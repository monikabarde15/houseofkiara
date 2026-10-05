import { Lister } from "../components/Listers/types/lister.types";

const BASE = "http://localhost:5000/api";

const request = async (path: string, options?: RequestInit) => {
  const r = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });
  const b = await r.json().catch(() => ({}));
  if (!r.ok || b.success === false) {
    throw new Error(b.message || "Lister request failed");
  }
  return b.data;
};

export const getListers = async (filters?: {
  search?: string;
  status?: string;
}) => {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.status) params.append("status", filters.status);

  const queryStr = params.toString() ? `?${params.toString()}` : "";
  return (await request(`/listers${queryStr}`)) as Lister[];
};

export const getListerById = async (id: string) => {
  return (await request(`/listers/${encodeURIComponent(id)}`)) as Lister;
};

export const createLister = async (data: Partial<Lister>) => {
  return (await request("/listers", {
    method: "POST",
    body: JSON.stringify(data),
  })) as Lister;
};

export const updateLister = async (id: string, data: Partial<Lister>) => {
  return (await request(`/listers/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })) as Lister;
};

export const deleteLister = async (id: string) => {
  return request(`/listers/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};

export const updateBankDetails = async (id: string, bankDetails: any) => {
  return (await request(`/listers/${encodeURIComponent(id)}/bank-details`, {
    method: "PUT",
    body: JSON.stringify(bankDetails),
  })) as Lister;
};

export const listerApi = {
  getListers,
  getListerById,
  createLister,
  updateLister,
  deleteLister,
  updateBankDetails,
};

export default listerApi;
