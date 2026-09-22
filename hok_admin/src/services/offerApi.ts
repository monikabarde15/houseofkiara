import { Offer } from '../types';

import { API_BASE_URL, getAuthToken } from './apiClient';
const BASE = API_BASE_URL;
const request = async (path: string, options?: RequestInit) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> || {}),
  };
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) throw new Error(body.message || 'Offer request failed');
  return body;
};
export const mapOffer = (item: any): Offer => ({ id: item.offerId || item.id || item._id, backendId: item._id, productId: item.productId || '', customerId: item.customerId || '', customerName: item.customerName || '', customerEmail: item.customerEmail || '', phone: item.customerPhone || '', productName: item.productName || '', marketPrice: Number(item.originalAmount || 0), offerPrice: Number(item.offeredAmount || item.finalAmount || 0), askPercentage: item.originalAmount ? Math.round((Number(item.offeredAmount || 0) / Number(item.originalAmount)) * 100) : 0, date: item.createdAt || new Date().toISOString(), status: Number(item.offeredAmount || item.finalAmount || 0) === 0 ? 'Enquiry' : item.status === 'Rejected' ? 'Declined' : item.status === 'Counter Offered' ? 'Countered' : item.status === 'Assigned' ? 'On Hold' : item.status === 'Completed' ? 'Accepted' : item.status || 'Pending', counterPrice: item.counterOffers?.at(-1)?.amount, channel: item.channel || 'Website', note: item.notes?.at(-1)?.message });
export const getOffers = async () => { const body = await request('/offers?limit=1000'); const items = Array.isArray(body.data) ? body.data : body.data?.offers || body.offers || []; return items.map(mapOffer); };
const routeId = (id: string, backendId?: string) => encodeURIComponent(backendId || id);
export const createOffer = async (offer: Partial<Offer>) => mapOffer((await request('/offers', { method: 'POST', body: JSON.stringify({ productName: offer.productName, customerName: offer.customerName, customerEmail: offer.customerEmail, customerPhone: offer.phone, originalAmount: offer.marketPrice, offeredAmount: offer.offerPrice, notes: offer.note, assignedTo: offer.assignedTo, channel: offer.channel }) })).data);
export const updateOfferStatus = async (id: string, status: Offer['status'], backendId?: string) => mapOffer((await request(`/offers/${routeId(id, backendId)}/status`, { method: 'PATCH', body: JSON.stringify({ status: status === 'Declined' ? 'Rejected' : status === 'Countered' ? 'Counter Offered' : status === 'On Hold' ? 'Assigned' : status }) })).data);
export const updateOffer = async (id: string, fields: Partial<Offer>, backendId?: string) => mapOffer((await request(`/offers/${routeId(id, backendId)}`, { method: 'PUT', body: JSON.stringify({ customerName: fields.customerName, customerEmail: fields.customerEmail, customerPhone: fields.phone, productName: fields.productName, originalAmount: fields.marketPrice, offeredAmount: fields.offerPrice }) })).data);
export const deleteOffer = (id: string, backendId?: string) => request(`/offers/${routeId(id, backendId)}`, { method: 'DELETE' });
export const permanentDeleteOffer = (id: string) => request(`/offers/${encodeURIComponent(id)}/permanent`, { method: 'DELETE' });
export const restoreOffer = (id: string) => request(`/offers/${encodeURIComponent(id)}/restore`, { method: 'PATCH' });
export const duplicateOffer = async (id: string) => mapOffer((await request(`/offers/${encodeURIComponent(id)}/duplicate`, { method: 'POST' })).data);
export const sendCounterOffer = (id: string, amount: number, message?: string, backendId?: string) => request(`/offers/${routeId(id, backendId)}/counter-offer`, { method: 'POST', body: JSON.stringify({ amount, remarks: message, sentBy: 'Admin' }) });
export const addOfferNote = (id: string, message: string, backendId?: string) => request(`/offers/${routeId(id, backendId)}/notes`, { method: 'POST', body: JSON.stringify({ message, createdBy: 'Admin' }) });
export const getOfferNotes = async (id: string, backendId?: string) => (await request(`/offers/${routeId(id, backendId)}/notes`)).data || [];
export const getOfferTimeline = async (id: string) => (await request(`/offers/${encodeURIComponent(id)}/timeline`)).data || [];
export const assignOffer = (id: string, assignedTo: string, remarks?: string) => request(`/offers/${encodeURIComponent(id)}/assign`, { method: 'POST', body: JSON.stringify({ assignedTo, assignedBy: 'Admin', remarks }) });
export const getAssignmentHistory = (id: string) => request(`/offers/${encodeURIComponent(id)}/assignment-history`);
export const getCounterOfferHistory = (id: string) => request(`/offers/${encodeURIComponent(id)}/counter-offers`);
export const getDashboard = () => request('/offers/dashboard');
export const getRecentOffers = () => request('/offers/recent');
export const getStatistics = () => request('/offers/statistics');
export const bulkDeleteOffers = (offerIds: string[]) => request('/offers/bulk-delete', { method: 'DELETE', body: JSON.stringify({ offerIds, deletedBy: 'Admin' }) });
export const bulkRestoreOffers = (offerIds: string[]) => request('/offers/bulk-restore', { method: 'PATCH', body: JSON.stringify({ offerIds, restoredBy: 'Admin' }) });
export const bulkPermanentDeleteOffers = (offerIds: string[]) => request('/offers/bulk-permanent-delete', { method: 'DELETE', body: JSON.stringify({ offerIds }) });
export const exportOffersUrl = `${API_BASE_URL}/offers/export/csv`;
