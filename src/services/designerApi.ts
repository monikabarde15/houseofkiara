import { Designer } from "../components/Designers/types/designer.types";

const API_BASE_URL = "http://localhost:5000/api";

const request = async (path: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    throw new Error(body.message || "Designer API request failed");
  }
  return body;
};

export const getDesigners = async (filters?: {
  search?: string;
  status?: string;
  type?: string;
}) => {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.type) params.append("type", filters.type);

  const queryStr = params.toString() ? `?${params.toString()}` : "";
  return (await request(`/designers${queryStr}`)).data as Designer[];
};

export const getDesignerById = async (id: string) => {
  return (await request(`/designers/${encodeURIComponent(id)}`))
    .data as Designer;
};

export const createDesigner = async (designer: Partial<Designer>) => {
  return (
    await request("/designers", {
      method: "POST",
      body: JSON.stringify(designer),
    })
  ).data as Designer;
};

export const updateDesigner = async (
  id: string,
  designer: Partial<Designer>,
) => {
  return (
    await request(`/designers/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(designer),
    })
  ).data as Designer;
};

export const deleteDesigner = async (id: string) => {
  return request(`/designers/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};
