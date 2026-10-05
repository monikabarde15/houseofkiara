const API_BASE_URL = "http://localhost:5000/api";
const request = async (path: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false)
    throw new Error(body.message || "Authentication failed");
  return body;
};
export const authStatus = async () => (await request("/auth/status")).data;
export const registerAdmin = (payload: {
  name: string;
  email: string;
  password: string;
}) =>
  request("/auth/register", { method: "POST", body: JSON.stringify(payload) });
export const loginAdmin = async (payload: {
  email: string;
  password: string;
}) => {
  const body = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  localStorage.setItem("hok_admin_session", JSON.stringify(body.data));
  return body.data;
};
export const logoutAdmin = () => localStorage.removeItem("hok_admin_session");
export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem("hok_admin_session") || "null");
  } catch {
    return null;
  }
};
