# Milestone 2 Route Protection & Auth Middleware — Comprehensive Analysis Report

**Explorer**: `explorer_m2_2`  
**Date**: 2026-08-25  
**Milestone**: Milestone 2 (Admin Authentication & Session Management — Route Protection & Auth Middleware)  
**Target Directory**: `d:/HOKAdmin/hok_admin/backend/`  

---

## 1. Executive Summary

This investigation analyzes the route protection, authentication middleware, and session verification mechanisms for the HOK Admin Panel. The objective is to evaluate how incoming requests are authenticated, how Bearer tokens are extracted and validated against PostgreSQL `admins` records, how `req.admin` is populated, how public vs. protected routes are segregated, and how Express middleware should be mounted across `backend/server.js` and domain route files.

### Key Findings Summary:
1. **Auth Middleware Implementation (`backend/middleware/authMiddleware.js`)**:
   - Currently extracts tokens from `req.headers.authorization` using strict `startsWith("Bearer ")`.
   - Queries PostgreSQL via `Admin.findOne({ sessionToken: token })`.
   - Attaches `req.admin = admin` to the Express `req` object.
   - Responds with HTTP 401 `{ success: false, message: "..." }` when the token is missing, malformed, or invalid.
   - **Gaps**: Does not handle case-insensitive `"bearer "` prefixes, multiple whitespace separators, or fallback custom headers (e.g. `x-auth-token`).

2. **Route Protection Coverage (`backend/server.js` & `backend/routes/*`)**:
   - Only `GET /api/auth/me` in `backend/routes/authRoutes.js` currently mounts `requireAuth`.
   - All 9 operational and catalogue route modules (`orders`, `offers`, `payouts`, `customers`, `products`, `designers`, `listers`, `uploads`, `messages`) are currently **unprotected** in `backend/server.js`.
   - Public auth endpoints (`/api/auth/status`, `/api/auth/login`, `/api/auth/register`) correctly operate without auth requirements.

3. **Database Integration (`Admin` Model & PostgreSQL JSONB Adapter)**:
   - The `admins` table has a dedicated `session_token TEXT` column with a B-tree index (`idx_admins_session_token`) and a `data JSONB` column with GIN indexing.
   - `Admin.findOne({ sessionToken: token })` seamlessly queries the PostgreSQL adapter.
   - Password hashing uses Node.js native `crypto.scrypt` with random 16-byte hex salts and timing-safe equality checks.
   - Token invalidation on `/api/auth/logout` sets `admin.sessionToken = null`, revoking session validity immediately.

4. **Frontend API Client Alignment (`src/services/`)**:
   - Central `apiClient.ts` reads `hok_admin_session` from `localStorage` and injects `Authorization: Bearer <token>`.
   - Several peripheral service modules (`offerApi.ts`, `availabilityApi.ts`, `bookingApi.ts`, `messageApi.ts`, `productQuoteApi.ts`, `productSectionsApi.ts`, `uploadApi.ts`) still use direct `fetch()` without `apiClient.ts`. They must be updated to ensure seamless communication once route protection is active.

---

## 2. Deep Dive: `backend/middleware/authMiddleware.js`

### 2.1 Current Implementation
```javascript
// backend/middleware/authMiddleware.js
import Admin from "../models/Admin.js";

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

export default requireAuth;
```

### 2.2 Functional Assessment Against Requirements

| Requirement | Implementation Status | Evaluation |
|---|---|---|
| **1. Bearer Token Extraction** | Implemented | Extracts from `req.headers.authorization`. Needs case-insensitivity (`/^Bearer\s+(.+)$/i`) and fallback header support (`x-auth-token`). |
| **2. HTTP 401 on Missing/Invalid** | Implemented | Returns `401 Unauthorized` with `{ success: false, message: "..." }`. |
| **3. Validate against PostgreSQL `admins`** | Implemented | Invokes `Admin.findOne({ sessionToken: token })`. Correctly matches session tokens. |
| **4. Attach `req.admin = admin`** | Implemented | Attaches populated `PostgresDocument` instance to `req.admin`. |
| **5. Public vs Protected Routes** | Partially Configured | Public routes in `authRoutes.js` are open, but protected routes lack middleware mounting in `server.js`. |

### 2.3 Proposed Hardened Auth Middleware
To provide maximum resilience against malformed headers, whitespace variations, and alternate header conventions, the following implementation is recommended:

```javascript
import Admin from "../models/Admin.js";

export const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // 1. Extract from standard Authorization header (Bearer format, case-insensitive)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && typeof authHeader === "string") {
      const match = authHeader.match(/^Bearer\s+(.+)$/i);
      if (match) {
        token = match[1].trim();
      }
    }

    // 2. Fallback to custom x-auth-token header
    if (!token && req.headers["x-auth-token"]) {
      token = String(req.headers["x-auth-token"]).trim();
    }

    // 3. Fallback to query parameter (useful for direct CSV/PDF download exports)
    if (!token && req.query?.token) {
      token = String(req.query.token).trim();
    }

    // Reject if token is missing or empty
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Access token is required.",
      });
    }

    // 4. Validate against PostgreSQL admins table
    const admin = await Admin.findOne({ sessionToken: token });
    if (!admin || !admin.sessionToken || admin.sessionToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired session token.",
      });
    }

    // 5. Attach admin object to Express request
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

export default requireAuth;
```

---

## 3. Database Layer & Model Integration

### 3.1 PostgreSQL DDL Schema (`admins` table)
From `backend/db/migrate.js`:
- Table name: `admins`
- Columns:
  - `_id VARCHAR(64) PRIMARY KEY`
  - `email VARCHAR(255) UNIQUE NOT NULL`
  - `name VARCHAR(255) NOT NULL`
  - `password_hash TEXT NOT NULL`
  - `password_salt TEXT NOT NULL`
  - `session_token TEXT`
  - `data JSONB NOT NULL DEFAULT '{}'::jsonb`
  - `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
  - `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
- Indexes:
  - `idx_admins__id` (UNIQUE B-tree on `_id`)
  - `idx_admins_email` (UNIQUE B-tree on `email`)
  - `idx_admins_session_token` (B-tree on `session_token`)
  - `idx_admins_data_gin` (GIN index on `data`)

### 3.2 Adapter Column Mapping (`backend/db/postgresAdapter.js`)
```javascript
Admin: {
  tableName: "admins",
  entityIdField: null,
  columnMap: {
    email: "email",
    name: "name",
    passwordHash: "password_hash",
    passwordSalt: "password_salt",
    sessionToken: "session_token",
  },
}
```
When `Admin.findOne({ sessionToken: token })` executes:
1. `buildWhereClause` constructs SQL filter `(data->>'sessionToken' = $1)` (or `session_token = $1`).
2. The adapter queries the `admins` table with `$1 = token`.
3. If matched, it instantiates and returns a `PostgresDocument` instance wrapping the admin's JSONB and relational data.
4. Downstream route handlers can access `req.admin.name`, `req.admin.email`, `req.admin._id`, `req.admin.createdAt`.

---

## 4. Route Inventory & Protection Matrix

| Route Module | Method | Endpoint Path | Auth Policy | Current Status in `server.js` | Action Required |
|---|---|---|---|---|---|
| **Auth** | GET | `/api/auth/status` | Public | Mounted without auth | Keep Public |
| **Auth** | POST | `/api/auth/register` | Public | Mounted without auth | Keep Public |
| **Auth** | POST | `/api/auth/login` | Public | Mounted without auth | Keep Public |
| **Auth** | POST | `/api/auth/logout` | Public/Token-aware | Mounted without auth | Keep Public / Token Invalidation in Controller |
| **Auth** | GET | `/api/auth/me` | **Protected** | `requireAuth` in `authRoutes.js` | Verified Protected |
| **Orders** | ALL | `/api/orders/*` | **Protected** | Mounted at `/api` without auth | Mount with `requireAuth` |
| **Offers** | ALL | `/api/offers/*` | **Protected** | Mounted at `/api` without auth | Mount with `requireAuth` |
| **Payouts** | ALL | `/api/payouts/*` | **Protected** | Mounted at `/api` without auth | Mount with `requireAuth` |
| **Customers** | ALL | `/api/customers/*` | **Protected** | Mounted at `/api` without auth | Mount with `requireAuth` |
| **Products** | ALL | `/api/products/*` | **Protected** | Mounted at `/api` without auth | Mount with `requireAuth` |
| **Designers** | ALL | `/api/designers/*` | **Protected** | Mounted at `/api/designers` without auth | Mount with `requireAuth` |
| **Listers** | ALL | `/api/listers/*` | **Protected** | Mounted at `/api/listers` without auth | Mount with `requireAuth` |
| **Uploads** | ALL | `/api/uploads/*` | **Protected** | Mounted at `/api` without auth | Mount with `requireAuth` |
| **Messages** | ALL | `/api/messages/*` | **Protected** | Mounted at `/api` without auth | Mount with `requireAuth` |

---

## 5. Middleware Mounting Architecture in `backend/server.js`

### 5.1 Current `backend/server.js` Layout
```javascript
// backend/server.js (Current)
app.use("/api", offersRouter);
app.use("/api", authRouter);
app.use("/api/listers", listerRouter); 
app.use("/api/designers", designerRouter);
app.use("/api", payoutRouter);
app.use("/api", productRouter); 
app.use("/api", orderRouter);
app.use("/api", uploadRouter);
app.use("/api", messageRouter);
app.use("/api", customerRouter);
```

### 5.2 Recommended Clean Mounting Pattern
To ensure robust route protection where public routes remain accessible and all operational endpoints are protected without duplication:

```javascript
// 1. Mount Public and Token-aware Auth Routes FIRST
app.use("/api", authRouter);

// 2. Mount Protected Operational & Catalogue Routes with requireAuth
app.use("/api/listers", requireAuth, listerRouter);
app.use("/api/designers", requireAuth, designerRouter);
app.use("/api", requireAuth, offersRouter);
app.use("/api", requireAuth, payoutRouter);
app.use("/api", requireAuth, productRouter);
app.use("/api", requireAuth, orderRouter);
app.use("/api", requireAuth, uploadRouter);
app.use("/api", requireAuth, messageRouter);
app.use("/api", requireAuth, customerRouter);
```

**Why this ordering is optimal:**
1. `/api/auth/status`, `/api/auth/login`, and `/api/auth/register` are evaluated first by `authRouter` and do not trigger `requireAuth`.
2. `/api/auth/me` within `authRouter` retains its explicit `requireAuth` middleware.
3. All operational routes (`/api/orders`, `/api/offers`, `/api/products`, `/api/customers`, etc.) are intercepted by `requireAuth` before reaching domain controllers.
4. Any unauthenticated request immediately returns `401 Unauthorized` `{ success: false, message: "..." }`.

---

## 6. End-to-End Auth & Session Lifecycle Verification

```
[ Frontend / Client ]
       │
       ├─ (1) GET /api/auth/status ──────────────────► [ Server: Public ] ──► Return { registered: bool, initialized: true }
       │
       ├─ (2) POST /api/auth/login { email, password } ► [ Server: Public ] ──► Validate scrypt hash, generate sessionToken
       │                                                                      ──► Save sessionToken in DB `admins` table
       │                                                                      ──► Return { token, admin: { name, email } }
       │
       ├─ (3) Stores token in localStorage (`hok_admin_session`)
       │
       ├─ (4) GET /api/orders (Header: `Authorization: Bearer <token>`)
       │        │
       │        ▼
       │      [ requireAuth Middleware ]
       │        ├─ Extract token from header
       │        ├─ Query Admin.findOne({ sessionToken: token })
       │        ├─ If valid: req.admin = admin ─────► [ Orders Controller ] ──► Return 200 OK + Orders list
       │        └─ If invalid: Return 401 Unauthorized
       │
       └─ (5) POST /api/auth/logout (Header: `Authorization: Bearer <token>`)
                │
                ▼
              [ Logout Controller ] ─────────────────► Set admin.sessionToken = null in DB
                                                     ──► Remove token from client localStorage
                                                     ──► Return 200 OK
```

---

## 7. Conclusions & Implementation Checklist

1. **`backend/middleware/authMiddleware.js`**:
   - Enhance token extraction to support regex `/^Bearer\s+(.+)$/i` and fallback header `x-auth-token`.
   - Maintain 401 status and structured error JSON `{ success: false, message: ... }`.
   - Maintain `req.admin = admin` assignment.

2. **`backend/server.js`**:
   - Mount `requireAuth` on all operational domain routers (`orderRouter`, `offersRouter`, `payoutRouter`, `customerRouter`, `productRouter`, `designerRouter`, `listerRouter`, `uploadRouter`, `messageRouter`).
   - Keep `authRouter` mounted at `/api` prior to protected routers.

3. **Frontend Integration Coordination**:
   - Verify `apiClient.ts` injects `Authorization: Bearer <token>`.
   - Coordinate with frontend agents to migrate remaining direct `fetch` calls in `offerApi.ts`, `bookingApi.ts`, `availabilityApi.ts`, `uploadApi.ts`, `messageApi.ts` to `apiClient.ts`.
