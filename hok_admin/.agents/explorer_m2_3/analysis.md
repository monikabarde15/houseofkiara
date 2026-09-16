# Milestone 2: Frontend Auth & API Client Integration Analysis Report

## 1. Executive Summary

This report provides a comprehensive architectural and code-level investigation of **Milestone 2: Frontend Auth & API Client Integration** for the House of Kaira (HOK) Admin Panel.

The objective of Milestone 2 is to establish robust, secure, and persistent admin authentication and centralized API communication between the React 19 + TypeScript single-page application and the Express/PostgreSQL backend, while keeping 100% of the UI layouts, components, styling, CSS classes, colors, margins, and buttons completely frozen.

### Core Findings:
1. **API Client (`src/services/apiClient.ts`)**: Currently has basic Bearer token injection from `localStorage.getItem('hok_admin_session')`, but lacks support for `localStorage.getItem('adminToken')`, lacks automated 401 Unauthorized handling (token purging and event dispatching), does not handle `FormData` (which breaks multipart uploads if `Content-Type: application/json` is forced), and has partial path resolution.
2. **Auth API (`src/services/authApi.ts`)**: Implements `authStatus`, `registerAdmin`, `loginAdmin`, `logoutAdmin`, and `getSession`, but is missing `getMe` (profile verification via `/api/auth/me`), `checkStatus` (alias/method for `/api/auth/status`), `register` / `login` / `logout` method name aliases, and dual-key token storage (`adminToken` + `hok_admin_session`).
3. **Bypassed Service Modules**: Several service files (`offerApi.ts`, `productSectionsApi.ts`, `availabilityApi.ts`, `bookingApi.ts`, `messageApi.ts`, `productQuoteApi.ts`, `uploadApi.ts`) and component tabs (`CoreDetailsTab.tsx`) currently make raw `fetch()` calls rather than routing through `apiClient.ts`. When backend routes are protected with `requireAuth` middleware, these unauthenticated calls will be rejected with 401 errors unless centralized.
4. **Session Lifecycle in `App.tsx`**: `App.tsx` reads session from localStorage on initial render, but does not validate the token against `/api/auth/me` on mount, nor does it listen for `auth:unauthorized` events to immediately prompt for login if a token expires during active usage.
5. **UI Freeze Compliance**: `AdminAuth.tsx` and `Sidebar.tsx` layouts, colors, CSS classes, typography, and button behaviors are verified and must remain strictly untouched during implementation.

---

## 2. Current State vs. Required Architecture

### 2.1 `src/services/apiClient.ts`

#### Current Implementation (Lines 1–40):
- Base URL: `const API_BASE_URL = 'http://localhost:5003/api';`
- Token extraction: Only checks `localStorage.getItem('hok_admin_session')`.
- Headers: Always injects `'Content-Type': 'application/json'`, which corrupts `FormData` payloads.
- 401 Handling: Throws generic `Error` with message, but does not clear `localStorage` tokens or notify the React runtime.

#### Required Architecture:
1. **Multi-Source Token Resolution**:
   - Primary: `localStorage.getItem('adminToken')` (direct string or JSON).
   - Secondary: `localStorage.getItem('hok_admin_session')` (parses `{ token, admin }` or string).
   - Fallback: `localStorage.getItem('token')`.
2. **Centralized 401 Unauthorized Interception**:
   - Detect `response.status === 401`.
   - Clear all token keys from `localStorage` (`adminToken`, `hok_admin_session`, `token`).
   - Dispatch global window event `auth:unauthorized` with `{ path, status: 401 }` payload.
   - Throw specialized `AuthError` or standard `Error` with `.status = 401`.
3. **Smart Header & Payload Management**:
   - If `options.body` is an instance of `FormData`, omit `'Content-Type'` header so the browser automatically populates multipart boundaries.
   - Always inject `Accept: 'application/json'` and `Authorization: Bearer <token>` when a token exists.
4. **URL Normalization**:
   - Support relative paths (`/orders`), absolute API paths (`/api/orders`), full URLs (`http://localhost:5003/api/orders`), and ensure no double slashes.

---

### 2.2 `src/services/authApi.ts`

#### Current Implementation (Lines 1–44):
- Exports: `authStatus`, `registerAdmin`, `loginAdmin`, `logoutAdmin`, `getSession`.
- Missing: `getMe` (calling `GET /api/auth/me`), `checkStatus` (alias for status check), `register`, `login`, `logout` standard aliases, and `getToken()` / `isAuthenticated()` helper utilities.

#### Required Architecture:
1. **`checkStatus` / `authStatus`**:
   - `GET /api/auth/status` -> Returns `{ initialized: boolean, registered: boolean }`.
2. **`register` / `registerAdmin`**:
   - `POST /api/auth/register` with `{ name, email, password }`.
   - Persists session token in both `adminToken` and `hok_admin_session`.
   - Returns `{ success: true, message: string, data: { token: string, admin: { name: string, email: string } } }`.
3. **`login` / `loginAdmin`**:
   - `POST /api/auth/login` with `{ email, password }`.
   - Persists session token in both `adminToken` and `hok_admin_session`.
   - Returns `AdminSession` (`{ token: string, admin: { name: string, email: string } }`).
4. **`logout` / `logoutAdmin`**:
   - `POST /api/auth/logout` with Bearer token.
   - Clears `adminToken`, `hok_admin_session`, and `token` from `localStorage`.
5. **`getMe`**:
   - `GET /api/auth/me` with Bearer token.
   - Returns `{ name: string, email: string }` profile data.
   - Catches 401 to clear local session.
6. **Session & Token Utilities**:
   - `getToken()`: Retrieves current Bearer token string.
   - `getSession()`: Retrieves current `AdminSession` object.
   - `isAuthenticated()`: Boolean check for valid token presence.

---

### 2.3 Frontend Services Audit (Direct `fetch()` vs `apiClient`)

| File Path | Current Mechanism | Uses Bearer Token? | 401 Handled? | Action Needed in Implementation |
|---|---|---|---|---|
| `src/services/apiClient.ts` | `fetch` wrapper | Yes | Needs upgrade | Implement token fallback & 401 dispatch |
| `src/services/authApi.ts` | Uses `apiClient` | Yes | Inherited | Add `getMe`, `checkStatus`, dual-key persistence |
| `src/services/customerApi.ts` | Uses `apiClient` | Yes | Yes | Fully compliant |
| `src/services/designerApi.ts` | Uses `apiClient` | Yes | Yes | Fully compliant |
| `src/services/listerApi.ts` | Uses `apiClient` | Yes | Yes | Fully compliant |
| `src/services/orderApi.ts` | Uses `apiClient` | Yes | Yes | Fully compliant |
| `src/services/payoutApi.ts` | Uses `apiClient` | Yes | Yes | Fully compliant |
| `src/services/productApi.ts` | Uses `apiClient` | Yes | Yes | Fully compliant |
| `src/services/offerApi.ts` | Local `fetch` | **No** | **No** | Refactor to use `apiClient` / `apiRequest` |
| `src/services/productSectionsApi.ts` | Local `fetch` | **No** | **No** | Refactor to use `apiClient` / `apiRequest` |
| `src/services/availabilityApi.ts` | Direct `fetch` | **No** | **No** | Refactor to use `apiClient` / `apiRequest` |
| `src/services/bookingApi.ts` | Direct `fetch` | **No** | **No** | Refactor to use `apiClient` / `apiRequest` |
| `src/services/messageApi.ts` | Direct `fetch` | **No** | **No** | Refactor to use `apiClient` / `apiRequest` |
| `src/services/productQuoteApi.ts` | Direct `fetch` | **No** | **No** | Refactor to use `apiClient` / `apiRequest` |
| `src/services/uploadApi.ts` | Direct `fetch` (FormData) | **No** | **No** | Refactor to use `apiClient` with FormData support |
| `src/components/products/tabs/CoreDetailsTab.tsx` | Inline `fetch` | **No** | **No** | Route through `productApi` / `apiClient` |

---

## 3. Detailed Proposed Implementations

### 3.1 Proposed `src/services/apiClient.ts`

```typescript
/**
 * Centralized API Client and Fetch Wrapper for HOK Admin Panel
 * Handles base URL routing, automatic Bearer token injection, FormData handling,
 * and graceful 401 Unauthorized token clearance and event broadcasting.
 */

const API_BASE_URL = 'http://localhost:5003/api';

/**
 * Retrieves the active auth token from localStorage.
 * Checks 'adminToken', 'hok_admin_session', and 'token' in priority order.
 */
export const getAuthToken = (): string | null => {
  try {
    // 1. Direct adminToken key
    const directToken = localStorage.getItem('adminToken');
    if (directToken && directToken.trim()) {
      try {
        const parsed = JSON.parse(directToken);
        if (typeof parsed === 'string') return parsed;
        if (parsed?.token) return parsed.token;
      } catch {
        return directToken.trim();
      }
    }

    // 2. Session object key
    const rawSession = localStorage.getItem('hok_admin_session');
    if (rawSession && rawSession.trim()) {
      try {
        const parsed = JSON.parse(rawSession);
        if (parsed?.token) return parsed.token;
        if (typeof parsed === 'string') return parsed;
      } catch {
        return rawSession.trim();
      }
    }

    // 3. Fallback generic token key
    const fallback = localStorage.getItem('token');
    if (fallback && fallback.trim()) return fallback.trim();

    return null;
  } catch {
    return null;
  }
};

/**
 * Stores the authentication token and session data in localStorage.
 */
export const setAuthToken = (token: string, sessionData?: any): void => {
  try {
    localStorage.setItem('adminToken', token);
    const sessionObj = sessionData?.token
      ? sessionData
      : { token, admin: sessionData?.admin || sessionData || { name: 'Admin', email: '' } };
    localStorage.setItem('hok_admin_session', JSON.stringify(sessionObj));
  } catch (err) {
    console.error('Failed to persist auth token:', err);
  }
};

/**
 * Clears all authentication tokens and sessions from localStorage.
 */
export const clearAuthToken = (): void => {
  try {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('hok_admin_session');
    localStorage.removeItem('token');
  } catch (err) {
    console.error('Failed to clear auth tokens:', err);
  }
};

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Centralized fetch request wrapper.
 * Automatically attaches Authorization Bearer headers and handles 401s.
 */
export const apiRequest = async <T = any>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();

  const isFormData = options?.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options?.headers as Record<string, string>) || {}),
  };

  // Build target URL
  let targetUrl: string;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    targetUrl = path;
  } else if (path.startsWith('/api/')) {
    const baseWithoutApi = API_BASE_URL.replace(/\/api\/?$/, '');
    targetUrl = `${baseWithoutApi}${path}`;
  } else {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    targetUrl = `${API_BASE_URL}${cleanPath}`;
  }

  const response = await fetch(targetUrl, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized gracefully
  if (response.status === 401) {
    clearAuthToken();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('auth:unauthorized', {
          detail: { path, status: 401 },
        })
      );
    }
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'Session expired or unauthorized. Please log in again.');
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok || body.success === false) {
    throw new Error(body.message || `Request to ${path} failed with status ${response.status}`);
  }

  return body;
};

export const fetchWrapper = apiRequest;
export default apiRequest;
```

---

### 3.2 Proposed `src/services/authApi.ts`

```typescript
/**
 * Authentication API Service for HOK Admin Panel
 * Implements login, logout, getMe, checkStatus, register, and session helpers.
 */

import { apiRequest, clearAuthToken, getAuthToken, setAuthToken } from './apiClient';

export interface AdminUser {
  name: string;
  email: string;
}

export interface AdminSession {
  token: string;
  admin: AdminUser;
}

export interface AuthStatusResponse {
  initialized: boolean;
  registered: boolean;
}

/**
 * Checks whether an admin account exists and backend is initialized.
 * Corresponds to GET /api/auth/status
 */
export const checkStatus = async (): Promise<AuthStatusResponse> => {
  const res = await apiRequest<AuthStatusResponse>('/auth/status');
  return res.data;
};

export const authStatus = checkStatus;

/**
 * Registers a new initial admin account.
 * Corresponds to POST /api/auth/register
 */
export const register = async (payload: {
  name: string;
  email: string;
  password: string;
}): Promise<{ token: string; admin: AdminUser; message?: string }> => {
  const res = await apiRequest<{ token: string; admin: AdminUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (res.data?.token) {
    setAuthToken(res.data.token, res.data);
  }

  return {
    ...res.data,
    message: res.message,
  };
};

export const registerAdmin = register;

/**
 * Authenticates an admin with email and password.
 * Corresponds to POST /api/auth/login
 */
export const login = async (payload: {
  email: string;
  password: string;
}): Promise<AdminSession> => {
  const res = await apiRequest<AdminSession>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (res.data?.token) {
    setAuthToken(res.data.token, res.data);
  }

  return res.data;
};

export const loginAdmin = login;

/**
 * Logs out current admin and invalidates the session token on backend.
 * Corresponds to POST /api/auth/logout
 */
export const logout = async (): Promise<void> => {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (err) {
    console.warn('Logout request completed with warning:', err);
  } finally {
    clearAuthToken();
  }
};

export const logoutAdmin = logout;

/**
 * Fetches current authenticated admin user profile.
 * Corresponds to GET /api/auth/me
 */
export const getMe = async (): Promise<AdminUser> => {
  const res = await apiRequest<{ admin: AdminUser }>('/auth/me');
  return res.data.admin;
};

/**
 * Retrieves the current session object from localStorage.
 */
export const getSession = (): AdminSession | null => {
  try {
    const raw = localStorage.getItem('hok_admin_session');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token && parsed?.admin) return parsed as AdminSession;
      if (parsed?.token) return { token: parsed.token, admin: { name: 'Admin', email: '' } };
    }

    const directToken = localStorage.getItem('adminToken');
    if (directToken) {
      return { token: directToken, admin: { name: 'Admin', email: '' } };
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Checks if a session is currently active.
 */
export const isAuthenticated = (): boolean => {
  return Boolean(getAuthToken());
};
```

---

### 3.3 Auth State & Lifecycle in `src/App.tsx`

To support seamless session persistence on page refresh and handle 401 expiration gracefully without altering any UI elements:

```typescript
// App.tsx auth integration pattern:

const [adminSession, setAdminSession] = useState<any>(() => authApi.getSession());

// 1. Listen for global unauthorized events dispatched by apiClient
useEffect(() => {
  const handleUnauthorized = () => {
    setAdminSession(null);
  };

  window.addEventListener('auth:unauthorized', handleUnauthorized);
  return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
}, []);

// 2. Validate token persistence on mount via getMe()
useEffect(() => {
  if (adminSession?.token) {
    authApi.getMe().catch((err) => {
      console.warn('Session verification failed on mount:', err.message);
      setAdminSession(null);
    });
  }
}, []);

// 3. Logout action
const handleLogout = () => {
  authApi.logoutAdmin();
  setAdminSession(null);
};

// 4. Render login modal if unauthenticated
if (!adminSession) return <AdminAuth onLogin={setAdminSession} />;
```

---

## 4. UI Freeze & Layout Verification Audit

All UI components, styles, Tailwind utility classes, and buttons were audited to confirm zero layout/style modifications are required:

1. **`AdminAuth.tsx`**:
   - Container: `flex min-h-screen items-center justify-center bg-[#f8f6f2] p-4`
   - Card: `w-full max-w-[430px] border border-[#e7dfd5] bg-white shadow-[0_8px_30px_rgba(64,46,27,.12)]`
   - Header: `bg-[#1d1812] px-8 py-7 text-center`
   - Brand diamond: `h-12 w-12 rounded-[5px] bg-[#cfb26f] text-xl text-[#332a17]`
   - Typography: `font-serif text-2xl tracking-[.12em] text-[#f0ebe4]` and `text-[10px] uppercase tracking-[.2em] text-[#c6a765]`
   - Form inputs: class `auth-input`
   - Buttons: `bg-[#c6a05c] px-4 py-3 text-sm font-bold text-[#332817] hover:bg-[#b58d49]` and toggle link `text-sm text-[#988f86] underline`
   - Status & Error messages: `text-[#718c61]` (success) and `text-[#bd6040]` (error)
   - **Verdict**: UI styling remains 100% frozen.

2. **`Sidebar.tsx`**:
   - Sidebar container: `sidebar-reference ... w-[320px] h-screen shrink-0 select-none`
   - Navigation groups: Dashboard, Operations, Catalogue, Growth, Site settings
   - Logout button: `.sidebar-logout` with `<LogOut />` icon invoking `onLogout`
   - **Verdict**: UI styling remains 100% frozen.

---

## 5. Summary of Recommended Implementation Steps for Implementers

1. **Update `src/services/apiClient.ts`**:
   - Implement `getAuthToken`, `setAuthToken`, `clearAuthToken`.
   - Add multi-key token extraction (`adminToken`, `hok_admin_session`, `token`).
   - Add 401 response handling with token clearance and `auth:unauthorized` event dispatch.
   - Add `FormData` detection for file uploads.
2. **Update `src/services/authApi.ts`**:
   - Implement `getMe()` calling `GET /api/auth/me`.
   - Implement `checkStatus()` and alias `authStatus()`.
   - Implement `register()` and `registerAdmin()`.
   - Implement `login()` and `loginAdmin()`.
   - Implement `logout()` and `logoutAdmin()`.
   - Implement `getSession()`, `getToken()`, `isAuthenticated()`.
3. **Enhance `src/App.tsx`**:
   - Add `auth:unauthorized` event listener for immediate UI redirect to login screen upon session expiry.
   - Add token verification on initial mount via `authApi.getMe()`.
4. **Service Migration (M2/M3/M4)**:
   - Refactor `offerApi.ts`, `productSectionsApi.ts`, `availabilityApi.ts`, `bookingApi.ts`, `messageApi.ts`, `productQuoteApi.ts`, `uploadApi.ts` to use `apiRequest` from `./apiClient`.
