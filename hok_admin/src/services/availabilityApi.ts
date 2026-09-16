export interface AvailabilityResult { productId: string; startDate: string; endDate: string; durationDays: number; cleaningBufferDays: number; }
import { API_BASE_URL } from './apiClient';
const BASE = API_BASE_URL;
export const checkAvailability = async (productId: string, startDate: string, endDate: string, mode: 'Rental' | 'Preloved' | 'Buy' = 'Rental', excludeOrderId?: string) => {
  const query = new URLSearchParams({ startDate, endDate, mode }); if (excludeOrderId) query.set('excludeOrderId', excludeOrderId);
  const response = await fetch(`${BASE}/products/${encodeURIComponent(productId)}/availability?${query}`); const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) throw new Error(body.message || 'Product is not available for these dates'); return body.data as AvailabilityResult;
};
