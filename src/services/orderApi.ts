import { Order } from "../types";
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
  if (!r.ok || b.success === false)
    throw new Error(b.message || "Order request failed");
  return b;
};
export const getOrders = async () => (await request("/orders")).data as Order[];
export const getOrder = async (id: string) =>
  (await request(`/orders/${encodeURIComponent(id)}`)).data as Order;
export const createOrder = async (order: Partial<Order>) =>
  (await request("/orders", { method: "POST", body: JSON.stringify(order) }))
    .data as Order;
export const updateOrder = async (id: string, order: Partial<Order>) =>
  (
    await request(`/orders/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(order),
    })
  ).data as Order;
export const addOrderLog = (
  id: string,
  message: string,
  type = "Internal Note",
) =>
  request(`/orders/${encodeURIComponent(id)}/logs`, {
    method: "POST",
    body: JSON.stringify({ message, type, user: "Admin" }),
  });
export const transitionOrder = (id: string, status: string) =>
  request(`/orders/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
export const updateOrderItem = (id: string, index: number, data: any) =>
  request(`/orders/${encodeURIComponent(id)}/items/${index}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
export const updateDispatch = (id: string, index: number, data: any) =>
  request(`/orders/${encodeURIComponent(id)}/items/${index}/dispatch`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
export const updateReturn = (id: string, index: number, data: any) =>
  request(`/orders/${encodeURIComponent(id)}/items/${index}/return`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
export const decideDeposit = (id: string, index: number, data: any) =>
  request(`/orders/${encodeURIComponent(id)}/items/${index}/deposit`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
export const getInvoice = (id: string) =>
  request(`/orders/${encodeURIComponent(id)}/invoice`);
export const saveEvidence = (
  id: string,
  index: number,
  stage: "dispatch" | "return",
  photos: string[],
  videoUrl?: string,
) =>
  request(`/orders/${encodeURIComponent(id)}/items/${index}/evidence`, {
    method: "PATCH",
    body: JSON.stringify({ stage, photos, videoUrl }),
  });
