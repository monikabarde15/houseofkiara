# Handoff Report — Milestone 2: Route Protection & Auth Middleware

**Agent**: `explorer_m2_2`  
**Milestone**: Milestone 2: Admin Authentication & Session Management  
**Working Directory**: `d:/HOKAdmin/hok_admin/.agents/explorer_m2_2/`  
**Target Subsystem**: Express Auth Middleware, Route Protection & Database Session Validation  
**Date**: 2026-08-25  

---

## 1. Observation

Direct observations from source files:

1. **Auth Middleware (`backend/middleware/authMiddleware.js:3-38`)**:
   ```javascript
   export const requireAuth = async (req, res, next) => {
     try {
       const authHeader = req.headers.authorization;
       if (!authHeader || !authHeader.startsWith("Bearer ")) {
         return res.status(401).json({
           success: false,
           message: "Authorization token required (Bearer format).",
         });
       }

       const token = authHeader.split(" ")[1];
       if (!token) {
         return res.status(401).json({
           success: false,
           message: "Authorization token missing.",
         });
       }

       const admin = await Admin.findOne({ sessionToken: token });
       if (!admin) {
         return res.status(401).json({
           success: false,
           message: "Invalid or expired session token.",
         });
       }

       req.admin = admin;
       next();
     } catch (error) {
       return res.status(500).json({
         success: false,
         message: "Authentication verification failed.",
         error: error.message,
       });
     }
   };
   ```

2. **Route Mounting in `backend/server.js:20-32`**:
   ```javascript
   app.use("/api", offersRouter);
   app.use("/api", authRouter);

   // ✅ FIX: SABSE PEHLE LISTER ROUTE REGISTER KARO (Taaki /api/listers product router se na takraye)
   app.use("/api/listers", listerRouter); 
   app.use("/api/designers", designerRouter);

   app.use("/api", payoutRouter);
   app.use("/api", productRouter); 
   app.use("/api", orderRouter);
   app.use("/api", uploadRouter);
   app.use("/api", messageRouter);
   app.use("/api", customerRouter);
   ```
   - Only `GET /api/auth/me` in `backend/routes/authRoutes.js:17` specifies `requireAuth`.
   - `offersRouter`, `listerRouter`, `designerRouter`, `payoutRouter`, `productRouter`, `orderRouter`, `uploadRouter`, `messageRouter`, and `customerRouter` are mounted without `requireAuth`.

3. **Auth Routes in `backend/routes/authRoutes.js:13-17`**:
   ```javascript
   router.get("/auth/status", getAuthStatus);
   router.post("/auth/register", registerAdmin);
   router.post("/auth/login", loginAdmin);
   router.post("/auth/logout", logoutAdmin);
   router.get("/auth/me", requireAuth, getMe);
   ```

4. **Admin Model Schema in `backend/models/Admin.js:3-9` & `backend/db/migrate.js:6-16`**:
   ```javascript
   const adminSchema = new mongoose.Schema({
     name: { type: String, required: true, trim: true },
     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
     passwordHash: { type: String, required: true },
     passwordSalt: { type: String, required: true },
     sessionToken: String,
   }, { timestamps: true });
   ```
   PostgreSQL migration creates `session_token TEXT` with index `CREATE INDEX IF NOT EXISTS idx_admins_session_token ON admins(session_token);` and `data JSONB NOT NULL DEFAULT '{}'::jsonb`.

5. **Token Generation and Logout in `backend/controllers/authController.js:87-89, 118-124`**:
   - On Login: `const sessionToken = crypto.randomBytes(32).toString("hex"); admin.sessionToken = sessionToken; await admin.save();`
   - On Logout: `admin.sessionToken = null; await admin.save();`

6. **Frontend API Client Token Injection in `src/services/apiClient.ts:18-29`**:
   ```typescript
   const token = getAuthToken();
   const headers: Record<string, string> = {
     'Content-Type': 'application/json',
     Accept: 'application/json',
     ...(token ? { Authorization: `Bearer ${token}` } : {}),
     ...(options?.headers as Record<string, string> || {}),
   };
   ```

---

## 2. Logic Chain

1. **Token Extraction and Case Sensitivity**:
   - Observation 1 shows `authHeader.startsWith("Bearer ")`. If the client sends lowercase `bearer `, uppercase `BEARER `, or extra spaces, this check fails even with a valid token.
   - Refactoring to a case-insensitive regex `const match = authHeader.match(/^Bearer\s+(.+)$/i)` and adding fallback support for `x-auth-token` and `req.query.token` will make token extraction robust across all request methods.

2. **Session Validation via PostgreSQL Adapter**:
   - Observations 1, 4, and 5 show `Admin.findOne({ sessionToken: token })`.
   - When an admin logs in, a 64-char hex string is saved to both `admins.session_token` column and `admins.data->'sessionToken'` JSONB field.
   - On logout, `admin.sessionToken = null; await admin.save()` nullifies the token.
   - Subsequent `Admin.findOne({ sessionToken: token })` returns `null`, causing `requireAuth` to return HTTP 401 `{ success: false, message: "Invalid or expired session token." }`.
   - If found, `req.admin = admin` is attached to `req`, enabling downstream handlers to access the authenticated admin profile.

3. **Public vs. Protected Route Boundary**:
   - Observation 3 shows `/api/auth/status`, `/api/auth/register`, `/api/auth/login`, and `/api/auth/logout` on `authRouter`. These must remain publicly accessible without a prerequisite Bearer token so unauthenticated users can check system status, register, and log in.
   - Observation 2 shows that currently, none of the operational routes (`/api/orders`, `/api/offers`, `/api/payouts`, `/api/customers`, `/api/products`, `/api/designers`, `/api/listers`, `/api/uploads`, `/api/messages`) have `requireAuth` applied.
   - Applying `requireAuth` to all operational routes in `backend/server.js` (e.g. `app.use("/api/orders", requireAuth, orderRouter)`) enforces the requirement that unauthenticated requests to protected endpoints receive HTTP 401.

4. **Mounting Order in `server.js`**:
   - Mounting `app.use("/api", authRouter)` first allows public endpoints (`/status`, `/login`, `/register`, `/logout`) and `/me` (internally protected) to route before global protection.
   - Mounting `app.use("/api/...", requireAuth, ...)` for all other operational routers protects all data and management endpoints.

---

## 3. Caveats

1. **E2E Test Suite Standalone Mode**:
   - Some standalone test runners in `tests/e2e/` create clients with `createApiClient()` and do not perform a login step before requesting domain endpoints. When `requireAuth` is mounted on all operational endpoints in `server.js`, tests requesting protected endpoints must set a valid token (via `setToken(token)`) or authenticate first.
2. **Peripheral Frontend Service Modules**:
   - While `src/services/apiClient.ts` automatically attaches the Bearer token, several service files (`offerApi.ts`, `availabilityApi.ts`, `bookingApi.ts`, `messageApi.ts`, `productQuoteApi.ts`, `productSectionsApi.ts`, `uploadApi.ts`) still use direct `fetch()`. These must be refactored to use `apiRequest()` from `apiClient.ts` as part of M2/M3 work.
3. **No Other Caveats**: All database schema, adapter queries, hashing mechanisms, and middleware structures are fully mapped and verified.

---

## 4. Conclusion

- **Middleware Health**: `backend/middleware/authMiddleware.js` contains the core logic for Bearer token extraction, PostgreSQL `Admin.findOne` query, HTTP 401 response, and `req.admin` attachment. It should be hardened with case-insensitive regex parsing and fallback header support (`x-auth-token`).
- **Route Protection Health**: Public endpoints (`/api/auth/status`, `/api/auth/login`, `/api/auth/register`) correctly function without auth. Protected operational routes in `backend/server.js` currently lack `requireAuth` and must be mounted with `requireAuth`.
- **Database Integration**: PostgreSQL `admins` table and the Mongoose JSONB adapter properly support session token lifecycle (creation, lookup, nullification on logout).

---

## 5. Verification Method

1. **Inspect Files**:
   - `backend/middleware/authMiddleware.js`
   - `backend/server.js`
   - `backend/routes/authRoutes.js`
   - `backend/models/Admin.js`
   - `backend/controllers/authController.js`
2. **Execute Auth E2E Tests**:
   - Run: `node --test tests/e2e/tier1_auth.test.js`
   - Verify:
     - `GET /api/auth/status` returns 200 OK without token.
     - `POST /api/auth/login` with invalid credentials returns 401.
     - `POST /api/auth/login` with valid credentials returns 200 and session token.
     - `GET /api/auth/me` without Bearer token returns 401.
     - `GET /api/auth/me` with valid Bearer token returns 200 and admin profile.
     - Protected routes (e.g. `GET /api/orders`) without Bearer token return 401 Unauthorized `{ success: false, message: ... }`.
     - Protected routes with valid Bearer token return 200 OK.
     - `POST /api/auth/logout` invalidates session token so subsequent requests with the old token return 401.
3. **Invalidation Conditions**:
   - If `Admin.findOne({ sessionToken: token })` returns null for an active token, check `admins` column mapping in `postgresAdapter.js`.
   - If public routes (`/api/auth/status`, `/api/auth/login`) return 401, verify `authRouter` is mounted before `requireAuth` in `server.js`.
