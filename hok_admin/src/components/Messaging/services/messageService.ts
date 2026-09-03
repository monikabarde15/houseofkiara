// services/messageService.ts
import { Message, Wording } from '../types/messaging.types';

export interface MessageDetail extends Message {
  wordings: Wording[];
}

const API_BASE = '/api/messages';

export const messageService = {
  // Get all messages with optional filters
  getMessages: async (params?: {
    search?: string;
    audience?: string;
    type?: string;
    status?: string;
  }): Promise<Message[]> => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.audience) queryParams.append('audience', params.audience);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);

    const url = `${API_BASE}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to fetch messages');
    }
    return json.data;
  },

  // Get single message detail by ID
  getMessage: async (id: string): Promise<MessageDetail> => {
    const res = await fetch(`${API_BASE}/${id}`);
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to fetch message details');
    }
    return json.data;
  },

  // Create a new message
  createMessage: async (data?: Partial<Message>): Promise<Message> => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {}),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to create message');
    }
    return json.data;
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
  updateMessage: async (id: string, data: Partial<MessageDetail>): Promise<Message> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to update message');
    }
    return json.data;
  },

  // Delete a message
  deleteMessage: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to delete message');
    }
  },
};