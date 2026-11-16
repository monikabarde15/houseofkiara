// services/messageService.ts
import { Message, Wording } from "../types/messaging.types";
import { mockMessages } from "../data/mockMessages";

export interface MessageDetail extends Message {
  wordings: Wording[];
}

const API_BASE = "/api/messages";

const applyClientFilters = (
  list: Message[],
  params?: {
    search?: string;
    audience?: string;
    type?: string;
    status?: string;
  },
): Message[] => {
  return list.filter((m) => {
    if (params?.search) {
      const q = params.search.toLowerCase();
      const matchName = (m.name || "").toLowerCase().includes(q);
      const matchSubj = (m.subject || "").toLowerCase().includes(q);
      const matchTrig = (m.trigger || "").toLowerCase().includes(q);
      if (!matchName && !matchSubj && !matchTrig) return false;
    }
    if (params?.audience && params.audience !== "Everyone") {
      if (m.audience !== params.audience) return false;
    }
    if (params?.type && params.type !== "Required and optional") {
      if (params.type === "Required" && m.class !== "Required") return false;
      if (params.type === "Marketing" && m.class !== "Marketing") return false;
    }
    if (params?.status && params.status !== "Any status") {
      if (m.status !== params.status) return false;
    }
    return true;
  });
};

const normalizeDbMessage = (m: any): Message => ({
  ...m,
  id: m.messageId || m.id || String(m._id || ""),
});

export const messageService = {
  // Get all messages with optional filters (falls back to canonical 73 system messages if DB is unseeded)
  getMessages: async (params?: {
    search?: string;
    audience?: string;
    type?: string;
    status?: string;
  }): Promise<Message[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append("search", params.search);
      if (params?.audience) queryParams.append("audience", params.audience);
      if (params?.type) queryParams.append("type", params.type);
      if (params?.status) queryParams.append("status", params.status);

      const url = `${API_BASE}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map(normalizeDbMessage);
      }
      // Check if unfiltered DB is completely empty; if so, serve canonical 73 messages
      if (params?.search || params?.audience || params?.type || params?.status) {
        const allRes = await fetch(API_BASE);
        const allJson = await allRes.json();
        if (allRes.ok && allJson.success && Array.isArray(allJson.data) && allJson.data.length > 0) {
          return [];
        }
      }
      return applyClientFilters(mockMessages, params);
    } catch {
      return applyClientFilters(mockMessages, params);
    }
  },

  // Get single message detail by ID
  getMessage: async (id: string): Promise<MessageDetail> => {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        const norm = normalizeDbMessage(json.data) as MessageDetail;
        return {
          ...norm,
          wordings: norm.wordings || [
            {
              id: `w_${norm.id}`,
              name: "Default",
              subject: norm.subject || "",
              previewLine: "",
              email: "",
              whatsapp: "",
            },
          ],
        };
      }
    } catch {
      // fallback below
    }
    const local = mockMessages.find((m) => m.id === id);
    if (!local) throw new Error("Message not found");
    return {
      ...local,
      wordings: (local as any).wordings || [
        {
          id: `w_${local.id}`,
          name: "Default",
          subject: local.subject || "",
          previewLine: "",
          email: (local as any).emailBody || "",
          whatsapp: (local as any).whatsappBody || "",
        },
      ],
    };
  },

  // Create a new message
  createMessage: async (data?: Partial<Message>): Promise<Message> => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data || {}),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "Failed to create message");
    }
    return normalizeDbMessage(json.data);
  },

  // Copy a message
  copyMessage: async (id: string): Promise<Message> => {
    const original = await messageService.getMessage(id);
    const copyData: Partial<Message> = {
      name: `${original.name} (copy)`,
      audience: original.audience,
      class: original.class,
      channels: original.channels,
      trigger: original.trigger,
      subject: original.subject,
    };
    return await messageService.createMessage(copyData);
  },

  // Update a message
  updateMessage: async (
    id: string,
    data: Partial<MessageDetail>,
  ): Promise<Message> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      const local = mockMessages.find((m) => m.id === id);
      if (local) return { ...local, ...data } as Message;
      throw new Error(json.message || "Failed to update message");
    }
    return normalizeDbMessage(json.data);
  },

  // Delete a message
  deleteMessage: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "Failed to delete message");
    }
  },
};
