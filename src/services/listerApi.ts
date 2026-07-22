import { Lister } from '../types';
const BASE = 'http://localhost:3001/api';
const request = async (path: string, options?: RequestInit) => { const r = await fetch(`${BASE}${path}`, { headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) }, ...options }); const b = await r.json().catch(() => ({})); if (!r.ok || b.success === false) throw new Error(b.message || 'Lister request failed'); return b.data; };
export const getListers = () => request('/listers') as Promise<Lister[]>;
export const createLister = (data: Partial<Lister>) => request('/listers', { method: 'POST', body: JSON.stringify(data) });
export const updateLister = (id: string, data: Partial<Lister>) => request(`/listers/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) });
export const updateBankDetails = (id: string, bankDetails: NonNullable<Lister['bankDetails']>) => request(`/listers/${encodeURIComponent(id)}/bank-details`, { method: 'PUT', body: JSON.stringify(bankDetails) });
