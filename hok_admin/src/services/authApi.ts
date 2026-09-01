import { apiRequest } from './apiClient';

export interface AdminSession {
  token: string;
  admin: {
    name: string;
    email: string;
  };
}

export const authStatus = async () => (await apiRequest('/auth/status')).data;

export const registerAdmin = async (payload: { name: string; email: string; password: string }) => {
  const body = await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  if (body.data?.token) {
    localStorage.setItem('hok_admin_session', JSON.stringify(body.data));
  }
  return body;
};

export const loginAdmin = async (payload: { email: string; password: string }): Promise<AdminSession> => {
  const body = await apiRequest<AdminSession>('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
  localStorage.setItem('hok_admin_session', JSON.stringify(body.data));
  return body.data;
};

export const logoutAdmin = async (): Promise<void> => {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch {
    // Ignore network error on logout
  } finally {
    localStorage.removeItem('hok_admin_session');
  }
};

export const getSession = (): AdminSession | null => {
  try {
    return JSON.parse(localStorage.getItem('hok_admin_session') || 'null');
  } catch {
    return null;
  }
};
