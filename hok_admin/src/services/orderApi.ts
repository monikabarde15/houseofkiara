import { Order } from '../types';
import { apiRequest } from './apiClient';

export const getOrders = async () => (await apiRequest('/orders')).data as Order[];
export const getOrder = async (id: string) => (await apiRequest(`/orders/${encodeURIComponent(id)}`)).data as Order;
export const createOrder = async (order: Partial<Order>) => (await apiRequest('/orders', { method: 'POST', body: JSON.stringify(order) })).data as Order;
export const updateOrder = async (id: string, order: Partial<Order>) => (await apiRequest(`/orders/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(order) })).data as Order;
export const addOrderLog = (id: string, message: string, type = 'Internal Note') => apiRequest(`/orders/${encodeURIComponent(id)}/logs`, { method: 'POST', body: JSON.stringify({ message, type, user: 'Admin' }) });
export const transitionOrder = (id: string, status: string) => apiRequest(`/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const updateOrderItem = (id: string, index: number, data: any) => apiRequest(`/orders/${encodeURIComponent(id)}/items/${index}`, { method: 'PATCH', body: JSON.stringify(data) });
export const updateDispatch = (id: string, index: number, data: any) => apiRequest(`/orders/${encodeURIComponent(id)}/items/${index}/dispatch`, { method: 'PATCH', body: JSON.stringify(data) });
export const updateReturn = (id: string, index: number, data: any) => apiRequest(`/orders/${encodeURIComponent(id)}/items/${index}/return`, { method: 'PATCH', body: JSON.stringify(data) });
export const decideDeposit = (id: string, index: number, data: any) => apiRequest(`/orders/${encodeURIComponent(id)}/items/${index}/deposit`, { method: 'PATCH', body: JSON.stringify(data) });
export const getInvoice = (id: string) => apiRequest(`/orders/${encodeURIComponent(id)}/invoice`);
export const saveEvidence = (id: string, index: number, stage: 'dispatch' | 'return', photos: string[], videoUrl?: string) => apiRequest(`/orders/${encodeURIComponent(id)}/items/${index}/evidence`, { method: 'PATCH', body: JSON.stringify({ stage, photos, videoUrl }) });
