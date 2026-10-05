export interface Payout {
  id: string;
  listerId: string;
  listerName: string;
  orderId: string;
  productName: string;
  mode: string;
  transactionAmount?: number;
  listerShare: number;
  hokCommission: number;
  taxDeduction?: number;
  netPayout?: number;
  dueDate: string;
  status: "Paid" | "Pending";
}
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
    throw new Error(b.message || "Payout request failed");
  return b;
};
export const getPayouts = async () => request("/payouts");
export const markPaid = async (
  id: string,
  payload: { paidBy: string; paymentReference?: string; taxDeduction?: number },
) =>
  (
    await request(`/payouts/${encodeURIComponent(id)}/paid`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  ).data as Payout;
export const updateStatus = (
  id: string,
  status: "Pending" | "Failed" | "Reversed",
  notes?: string,
) =>
  request(`/payouts/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, notes }),
  });
export const exportPayoutsUrl = `${BASE}/payouts/export/csv`;
