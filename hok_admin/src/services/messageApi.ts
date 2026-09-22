import { API_BASE_URL } from './apiClient';
const BASE = API_BASE_URL;
export const sendMockMessage = async (payload: { channel: 'whatsapp' | 'sms'; to: string; body: string }) => {
  const response = await fetch(`${BASE}/messages/send`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) throw new Error(body.message || 'Message could not be sent');
  return body.data;
};
