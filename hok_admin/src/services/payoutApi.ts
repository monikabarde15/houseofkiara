import { apiRequest } from './apiClient';

export interface Payout {
  id: string;
  payoutId?: string;
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
  status: 'Paid' | 'Pending' | 'Failed' | 'Reversed';
}

const BASE = 'http://localhost:5000/api';

export const getPayouts = async () => apiRequest('/payouts');

export const markPaid = async (
  id: string,
  payload: { paidBy: string; paymentReference?: string; taxDeduction?: number }
) => (await apiRequest(`/payouts/${encodeURIComponent(id)}/paid`, { method: 'PATCH', body: JSON.stringify(payload) })).data as Payout;

export const updateStatus = (id: string, status: 'Pending' | 'Failed' | 'Reversed', notes?: string) =>
  apiRequest(`/payouts/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) });

export const exportPayoutsUrl = `${BASE}/payouts/export/csv`;
