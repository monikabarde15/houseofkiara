## 2026-08-25T07:29:10Z
You are worker_m2_auth_1 implementing Milestone 2: Admin Authentication, Session Persistence & Route Protection for the HOK Admin project.
Your working directory is: d:/HOKAdmin/hok_admin/.agents/worker_m2_auth_1/

MANDATORY: You MUST read ORIGINAL_REQUEST.md at d:/HOKAdmin/hok_admin/.agents/ORIGINAL_REQUEST.md, PROJECT.md at d:/HOKAdmin/hok_admin/PROJECT.md, and the explorer reports at:
- `d:/HOKAdmin/hok_admin/.agents/explorer_m2_1/handoff.md`
- `d:/HOKAdmin/hok_admin/.agents/explorer_m2_2/handoff.md`
- `d:/HOKAdmin/hok_admin/.agents/explorer_m2_3/handoff.md`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Exclusively Owned Files for this Milestone:
- `backend/controllers/authController.js`
- `backend/routes/authRoutes.js`
- `backend/middleware/authMiddleware.js`
- `backend/server.js` (auth route mounting / middleware)
- `src/services/apiClient.ts`
- `src/services/authApi.ts`
- `src/App.tsx` (auth session hooks & 401 handling only — DO NOT modify UI styles, layouts, or CSS classes)

Tasks to Implement:
1. Backend Auth Controller (`backend/controllers/authController.js`):
   - Ensure `getAuthStatus` returns `{ success: true, data: { initialized: true, registered: boolean, count: number } }`.
   - Ensure `registerAdmin` validates password length >= 8, hashes with `crypto.scrypt` (16-byte salt, 64-byte key), saves to `Admin` model (PostgreSQL `admins` table), generates 32-byte hex session token, and returns 201 `{ success: true, message: "...", data: { token, admin: { id, name, email } } }`. If email exists, return 400.
   - Ensure `loginAdmin` checks email and timing-safe password hash equality, generates fresh session token, saves to DB, returns 200 `{ success: true, data: { token, admin: { id, name, email } } }`. If invalid, return 401 `{ success: false, message: "Invalid email or password." }`.
   - Ensure `logoutAdmin` clears `admin.sessionToken = null`, saves to DB, returns 200 `{ success: true, message: "Logged out successfully." }`.
   - Ensure `getMe` returns `{ success: true, data: { admin: { id, name, email } } }`.
2. Auth Middleware (`backend/middleware/authMiddleware.js`):
   - Robust Bearer token extraction (`/^Bearer\s+(.+)$/i` and fallback headers).
   - If missing/invalid, return 401 `{ success: false, message: "..." }`.
   - Find admin in PostgreSQL using `Admin.findOne({ sessionToken: token })`.
   - Attach `req.admin = admin` and call `next()`.
3. Route Protection & Mounting in `backend/routes/authRoutes.js` & `backend/server.js`:
   - Public auth endpoints: `GET /api/auth/status`, `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`.
   - Protected: `GET /api/auth/me` (requires `requireAuth`).
   - Verify server starts cleanly and exports app / server.
4. Frontend Auth & API Client (`src/services/apiClient.ts`, `src/services/authApi.ts`, `src/App.tsx`):
   - `apiClient.ts`: Multi-key token resolution (`adminToken`, `hok_admin_session`), attach `Authorization: Bearer <token>`, handle 401 by clearing tokens and broadcasting `auth:unauthorized` event.
   - `authApi.ts`: Implement `authStatus`, `checkStatus`, `registerAdmin`, `loginAdmin`, `logoutAdmin`, `getMe`, session helpers (`getSession`, `getToken`, `isAuthenticated`).
   - `App.tsx`: Listen to `auth:unauthorized` event and handle session validation on mount. Maintain 100% frozen UI styling.
5. Verification:
   - Run `node --test tests/e2e/tier1_auth.test.js`.
   - Ensure all 6 test cases in `tier1_auth.test.js` pass with 0 failures against the live backend/database.
   - Run typecheck `npx tsc --noEmit` on frontend if applicable.
   - Document all verification results in `d:/HOKAdmin/hok_admin/.agents/worker_m2_auth_1/handoff.md`.
