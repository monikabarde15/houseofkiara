const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api';

export const getAuthToken = (): string | null => {
  try {
    const raw = localStorage.getItem('hok_admin_session');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || (typeof parsed === 'string' ? parsed : null);
  } catch {
    return null;
  }
};

export const apiRequest = async <T = any>(
  path: string,
  options?: RequestInit
): Promise<{ success: boolean; data: T; message?: string }> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`, {
    ...options,
    headers,
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    throw new Error(body.message || `Request to ${path} failed with status ${response.status}`);
  }

  return body;
};

export default apiRequest;
