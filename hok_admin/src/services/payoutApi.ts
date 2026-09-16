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
  payoutPercentage?: number;
  listerShare: number;
  hokCommission: number;
  taxDeduction?: number;
  netPayout?: number;
  status: 'Paid' | 'Pending' | 'Failed' | 'Reversed' | 'Pending Approval';
  dueDate: string;
  notes?: string;
  submissionAssignedTo?: string;
}

import { API_BASE_URL } from './apiClient';
const BASE = API_BASE_URL;

export interface PayoutSummary {
  pending: number;
  paid: number;
  hokCommission: number;
}

export interface PayoutsResponse {
  success: boolean;
  data: Payout[];
  summary: PayoutSummary;
  message?: string;
}

export const getPayouts = async (): Promise<PayoutsResponse> => {
  const result = await apiRequest('/payouts');
  return result as PayoutsResponse;
};

export const markPaid = async (
  id: string,
  payload: { paidBy: string; paymentReference?: string; taxDeduction?: number }
) => (await apiRequest(`/payouts/${encodeURIComponent(id)}/paid`, { method: 'PATCH', body: JSON.stringify(payload) })).data as Payout;

export const updatePayout = async (
  id: string,
  payload: Partial<Payout>
) => (await apiRequest(`/payouts/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) })).data as Payout;

export const updateStatus = (id: string, status: 'Pending' | 'Failed' | 'Reversed', notes?: string) =>
  apiRequest(`/payouts/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) });

export const exportPayoutsUrl = `${BASE}/payouts/export/csv`;

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export const getAdmins = async (): Promise<AdminUser[]> => {
  const result = await apiRequest('/auth/admins');
  return (result.data || []) as AdminUser[];
};

export const getSubmissionAssignees = async (): Promise<string[]> => {
  const result = await apiRequest('/submissions/assignees');
  return (result.data || []) as string[];
};

export const getSubmissions = async (): Promise<any[]> => {
  const result = await apiRequest('/submissions');
  return (result.data || []) as any[];
};
