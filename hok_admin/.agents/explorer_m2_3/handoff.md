# Handoff Report: Milestone 2 — Frontend Auth & API Client Integration

## 1. Observation

### 1.1 API Client (`src/services/apiClient.ts`)
- **File**: `src/services/apiClient.ts` (Lines 1–40)
- **Token resolution**: Only checks `localStorage.getItem('hok_admin_session')` (lines 5–8). Does not check `localStorage.getItem('adminToken')` or `token`.
- **401 Handling**:
  ```typescript
  // Lines 31-34
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    throw new Error(body.message || `Request to ${path} failed with status ${response.status}`);
  }
  ```
  Does not clear tokens from `localStorage` on 401, nor does it dispatch an `auth:unauthorized` event to React.
- **Header construction**: Line 20 hardcodes `'Content-Type': 'application/json'`, which interferes with `FormData` multipart uploads.

### 1.2 Auth API Service (`src/services/authApi.ts`)
- **File**: `src/services/authApi.ts` (Lines 1–44)
- **Implemented methods**: `authStatus`, `registerAdmin`, `loginAdmin`, `logoutAdmin`, `getSession`.
- **Missing methods**:
  - `getMe()`: Missing call to `GET /api/auth/me` (which exists on backend at `backend/routes/authRoutes.js:17` and `backend/controllers/authController.js:139-161`).
  - `checkStatus()`: Missing as a first-class named function (currently only `authStatus`).
  - Dual-key persistence (`adminToken` along with `hok_admin_session`).

### 1.3 Service Modules Bypassing `apiClient`
- `src/services/offerApi.ts` (lines 4–9): Defines custom `fetch` wrapper without Bearer token injection or 401 handling.
- `src/services/productSectionsApi.ts` (line 2): Defines custom `fetch` without auth headers.
- `src/services/availabilityApi.ts` (line 5): Calls `fetch` directly.
- `src/services/bookingApi.ts` (line 3): Calls `fetch` directly.
- `src/services/messageApi.ts` (line 3): Calls `fetch` directly.
- `src/services/productQuoteApi.ts` (line 3): Calls `fetch` directly.
- `src/services/uploadApi.ts` (lines 3–4): Calls `fetch` directly.
- `src/components/products/tabs/CoreDetailsTab.tsx` (lines 90, 129): Direct `fetch` calls.

### 1.4 UI & State Components
- `src/components/AdminAuth.tsx` (lines 1–13): Houses login & registration form with golden/charcoal branding and CSS classes (`auth-input`, `bg-[#f8f6f2]`, `bg-[#1d1812]`, `bg-[#cfb26f]`, `text-[#332a17]`, `hover:bg-[#b58d49]`).
- `src/App.tsx` (lines 66, 428–430): Tracks `adminSession` state and conditionally renders `<AdminAuth onLogin={setAdminSession} />`.
- `src/components/Sidebar.tsx` (lines 29): Contains logout button triggering `onLogout` prop.

---

## 2. Logic Chain

1. **Token Attachment (Observation 1.1)**:
   Backend middleware `backend/middleware/authMiddleware.js` requires incoming requests to contain an `Authorization: Bearer <sessionToken>` header. Because `apiClient.ts` only read `hok_admin_session`, any standard integration relying on `localStorage.getItem('adminToken')` would fail to send auth headers. Adding multi-source token resolution (`adminToken` -> `hok_admin_session` -> `token`) ensures all authentication states are captured.

2. **Graceful 401 Handling (Observation 1.1 & 1.4)**:
   When an admin's token expires or is invalidated by backend logout (`Admin.sessionToken = null`), the backend responds with HTTP status 401. Without an automated token purge and event broadcast in `apiClient.ts`, the frontend remains in an inconsistent state where subsequent requests fail repeatedly. By purging tokens and dispatching `'auth:unauthorized'` on `window`, `App.tsx` can instantly reset `adminSession` to `null` and seamlessly show the login UI without a page reload or uncaught exception.

3. **Complete Auth API Interface (Observation 1.2)**:
   The backend provides 5 auth endpoints (`/auth/status`, `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me`). `src/services/authApi.ts` lacked `getMe` and aliases `checkStatus`, `login`, `logout`, `register`. Providing full signatures and dual-key token persistence guarantees complete feature alignment and enables `App.tsx` to verify token validity on initial app mount.

4. **Service Centralization (Observation 1.3)**:
   When subsequent milestones (M3, M4) protect backend routes with `requireAuth`, domain services using direct `fetch` (`offerApi.ts`, `availabilityApi.ts`, etc.) will fail. Centralizing all service requests through `apiClient.ts` ensures universal token injection and unified error handling across the entire admin panel.

5. **UI Freeze Compliance (Observation 1.4)**:
   The existing UI layouts and styling in `AdminAuth.tsx`, `App.tsx`, and `Sidebar.tsx` already match the luxury brand design language. All authentication features can be wired up through pure service and state logic without modifying a single visual element, class, color, margin, or layout container.

---

## 3. Caveats

- **No Source Code Direct Modification**: As an explorer agent, no production source code was modified. Complete, drop-in replacement code for `apiClient.ts` and `authApi.ts` has been documented in `analysis.md`.
- **Domain Services Migration Scope**: Migrating domain services (`offerApi.ts`, `productSectionsApi.ts`, etc.) to `apiClient.ts` should be coordinated with the respective milestone implementers (M3 for Operations, M4 for Catalogue).
- **Network / Proxy Setup**: Frontend is configured in `vite.config.ts` to proxy `/api` to `http://localhost:5003`. The proposed `apiClient.ts` supports both relative `/api` paths and explicit base URLs.

---

## 4. Conclusion

The frontend auth architecture for Milestone 2 has been thoroughly mapped and verified. The necessary updates are localized, precise, and completely preserve the frozen UI:

1. **`src/services/apiClient.ts`**: Implement multi-key token fallback (`adminToken`, `hok_admin_session`, `token`), FormData detection, 401 automatic token purging, and `auth:unauthorized` event dispatching.
2. **`src/services/authApi.ts`**: Implement `getMe()`, `checkStatus()`, `login()`, `logout()`, `register()`, dual-key session persistence (`adminToken` and `hok_admin_session`), and session helper utilities (`getSession()`, `getToken()`, `isAuthenticated()`).
3. **`src/App.tsx`**: Add `auth:unauthorized` event listener to reset `adminSession` on 401 and invoke `authApi.getMe()` on mount to validate token persistence across page refreshes.
4. **UI Layout**: Retain 100% frozen styling across `AdminAuth.tsx`, `Sidebar.tsx`, and `App.tsx`.

---

## 5. Verification Method

To independently verify the frontend auth and API client integration once implemented:

### 5.1 Static Type & Linter Verification
```bash
npx tsc --noEmit
```
Inspect `src/services/apiClient.ts` and `src/services/authApi.ts` to ensure no TypeScript compilation or type mismatch errors occur.

### 5.2 Functional Test Steps
1. **Initial Status Check**: Inspect network call to `GET /api/auth/status` when navigating to the app.
2. **Admin Login**: Log in via `AdminAuth.tsx`. Verify `localStorage.getItem('adminToken')` and `localStorage.getItem('hok_admin_session')` contain the session token.
3. **Session Persistence**: Refresh the browser. Verify `App.tsx` calls `GET /api/auth/me` with `Authorization: Bearer <token>` and keeps the admin authenticated without showing the login screen.
4. **401 Expiry Simulation**: Manually corrupt or clear the token in DB (`sessionToken = null`). Trigger any API request (e.g. fetch orders). Verify `apiClient.ts` catches the 401 status, removes `adminToken` and `hok_admin_session` from `localStorage`, dispatches `auth:unauthorized`, and `App.tsx` transitions to `<AdminAuth />`.
5. **Admin Logout**: Click the logout button in `Sidebar.tsx`. Verify `POST /api/auth/logout` is dispatched, `localStorage` tokens are cleared, and UI returns to `<AdminAuth />`.
6. **UI Freeze Audit**: Verify `AdminAuth.tsx` layout, colors, margins, fonts, and buttons match the original design with zero CSS regressions.
