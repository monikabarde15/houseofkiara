# Technical Analysis Report — Milestone 2: Admin Auth & Session Management

**Explorer**: `explorer_m2_1`  
**Date**: 2026-08-25  
**Scope**: Backend Authentication, Session Management, Model Layer, Middleware, Routes, Tests, and Frontend Integration for HOK Admin Panel.

---

## 1. Executive Summary

A comprehensive investigation into the backend authentication and session management architecture was conducted. The implementation adheres to high cryptographic standards, leveraging Node.js native `crypto.scrypt` with individual random 16-byte salts and 256-bit session tokens. The database persistence layer utilizes the PostgreSQL JSONB adapter (`PostgresModel`) mapping onto the `admins` table with dedicated columns, unique constraints, and B-tree/GIN indexes. 

All 7 core requirements outlined in Milestone 2 are supported, with minor defensive enhancements recommended for `GET /api/auth/status` (adding count) and `loginAdmin` (buffer length parity check before timingSafeEqual).

---

## 2. Requirements & Verification Matrix

| # | Requirement | Implementation Location | Current Status | Findings & Notes |
|---|---|---|---|---|
| **1** | **Password Hashing (scrypt/pbkdf2 + salt)** | `backend/controllers/authController.js:5-9` | **Implemented & Verified** | Uses `crypto.scrypt` with 16-byte random hex salt, generating 64-byte key hashes. Uses `crypto.timingSafeEqual` during login. |
| **2** | **Session Token Generation & DB Persistence** | `backend/controllers/authController.js:30,87` | **Implemented & Verified** | Generates 32-byte hex (256-bit entropy) session tokens via `crypto.randomBytes(32).toString('hex')`. Persisted directly in `session_token` column & `data` JSONB. |
| **3** | **`GET /api/auth/status`** | `backend/controllers/authController.js:163-180` | **Implemented (Enhancement Suggested)** | Returns `{ success: true, data: { registered: boolean, initialized: true } }`. Recommend adding `count: await Admin.countDocuments({})` to explicitly supply `count: number`. |
| **4** | **`POST /api/auth/register`** | `backend/controllers/authController.js:11-54` | **Implemented & Verified** | Validates payload (name, email, password >= 8 chars), checks uniqueness, hashes password, saves session token, and returns 201 with `{ success: true, data: { token, admin } }`. |
| **5** | **`POST /api/auth/login`** | `backend/controllers/authController.js:56-106` | **Implemented & Verified** | Validates email/password, looks up admin, hashes input with stored salt, compares via `crypto.timingSafeEqual`, generates fresh session token, updates DB, and returns 200 with `{ success: true, data: { token, admin } }`. Returns 401 on invalid credentials. |
| **6** | **`POST /api/auth/logout`** | `backend/controllers/authController.js:108-137` | **Implemented & Verified** | Supports token via `Authorization: Bearer <token>` or body `token`. Nulls out `sessionToken` in the DB (`admin.sessionToken = null; await admin.save()`), invalidating session. |
| **7** | **`GET /api/auth/me`** | `backend/controllers/authController.js:139-161` | **Implemented & Verified** | Protected by `requireAuth` middleware (`backend/middleware/authMiddleware.js`). Returns `{ success: true, data: { admin: { name, email } } }`. Unauthorized requests yield 401. |

---

## 3. Deep Dive Architecture & Code Review

### 3.1 Data Model (`backend/models/Admin.js`)
The `Admin` model is registered through the `postgresAdapter` Mongoose-compatible wrapper:
```javascript
import mongoose from "../db/postgresAdapter.js";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: true },
  sessionToken: String,
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);
```

### 3.2 Database Schema & DDL Migration (`backend/db/migrate.js`)
The `admins` table definition in PostgreSQL contains dedicated indexed columns for fast queries and uniqueness constraints:
```sql
CREATE TABLE IF NOT EXISTS admins (
  _id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  session_token TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_admins__id ON admins(_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_session_token ON admins(session_token);
CREATE INDEX IF NOT EXISTS idx_admins_data_gin ON admins USING GIN (data);
```

### 3.3 PostgresAdapter Column Mapping (`backend/db/postgresAdapter.js`)
The column mapping ensures bi-directional translation between JavaScript camelCase model properties and PostgreSQL snake_case columns:
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

### 3.4 Authentication Middleware (`backend/middleware/authMiddleware.js`)
`requireAuth` intercepts incoming requests, verifies the `Authorization: Bearer <token>` header, queries `Admin.findOne({ sessionToken: token })`, and populates `req.admin`:
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

### 3.5 Routes & Server Mounting (`backend/routes/authRoutes.js` & `backend/server.js`)
Routes are mounted under `/api` in `server.js`:
- `GET /api/auth/status` -> `getAuthStatus`
- `POST /api/auth/register` -> `registerAdmin`
- `POST /api/auth/login` -> `loginAdmin`
- `POST /api/auth/logout` -> `logoutAdmin`
- `GET /api/auth/me` -> `requireAuth`, `getMe`

### 3.6 Frontend Integration
1. **API Client (`src/services/apiClient.ts`)**:
   - `getAuthToken()` parses the token from `localStorage.getItem('hok_admin_session')`.
   - `apiRequest()` injects `Authorization: Bearer ${token}` automatically into all outgoing HTTP headers.
2. **Auth Service (`src/services/authApi.ts`)**:
   - Manages `authStatus()`, `registerAdmin()`, `loginAdmin()`, `logoutAdmin()`, and `getSession()`.
   - Caches/removes session objects in `localStorage`.
3. **Auth UI (`src/components/AdminAuth.tsx`)**:
   - Checks `authStatus()` on mount to determine if an admin is already registered (`status.registered`).
   - Seamlessly switches between Login and First-Time Admin Registration modes.
4. **App Orchestrator (`src/App.tsx`)**:
   - Checks `adminSession` state; renders `<AdminAuth />` if unauthenticated, or the full dashboard once authenticated.
   - Triggers `handleLogout()` to call backend logout and reset frontend state.

---

## 4. Test Suite Alignment (`tests/e2e/tier1_auth.test.js`)

The test suite exercises all auth behaviors:
1. `GET /api/auth/status` -> verifies HTTP 200 and response object `{ success: true, data: ... }`.
2. `POST /api/auth/register` -> verifies admin creation or duplicate detection (200, 201, or 400).
3. `POST /api/auth/login` (invalid password) -> verifies HTTP 401 and `{ success: false }`.
4. `POST /api/auth/login` (non-existent email) -> verifies HTTP 401/404 and `{ success: false }`.
5. `POST /api/auth/login` (valid credentials) -> verifies HTTP 200, token issuance, and admin profile data.
6. Bearer token header handling -> verifies unauthenticated vs authenticated client token states.

---

## 5. Deficiencies & Recommended Enhancements

### Recommendation 1: Return `count` in `GET /api/auth/status`
In `backend/controllers/authController.js`:
```javascript
// Before
export const getAuthStatus = async (_req, res) => {
  try {
    const hasAdmin = Boolean(await Admin.exists({}));
    return res.json({
      success: true,
      data: {
        registered: hasAdmin,
        initialized: true,
      },
    });
  } catch (error) { ... }
};

// Recommended Enhancement
export const getAuthStatus = async (_req, res) => {
  try {
    const count = await Admin.countDocuments({});
    return res.json({
      success: true,
      data: {
        initialized: true,
        registered: count > 0,
        count,
      },
    });
  } catch (error) { ... }
};
```
**Rationale**: Explicitly provides `count: number` while preserving `registered: boolean` and `initialized: boolean`.

### Recommendation 2: Buffer Length Guard in `loginAdmin`
In `backend/controllers/authController.js`:
```javascript
// Before
const credentials = await hashPassword(password, admin.passwordSalt);
if (
  !crypto.timingSafeEqual(
    Buffer.from(credentials.hash, "hex"),
    Buffer.from(admin.passwordHash, "hex")
  )
) {
  return res.status(401).json({ success: false, message: "Invalid email or password." });
}

// Recommended Enhancement
const credentials = await hashPassword(password, admin.passwordSalt);
const hashBuf = Buffer.from(credentials.hash, "hex");
const storedBuf = Buffer.from(admin.passwordHash || "", "hex");
if (hashBuf.length !== storedBuf.length || !crypto.timingSafeEqual(hashBuf, storedBuf)) {
  return res.status(401).json({
    success: false,
    message: "Invalid email or password.",
  });
}
```
**Rationale**: `crypto.timingSafeEqual` throws a `RangeError` if buffer lengths differ. The length check prevents unexpected 500 runtime errors on malformed DB entries.

---

## 6. Conclusion
Milestone 2 (Admin Auth & Session Management) has a complete, robust, and well-integrated implementation across the backend controller, routes, middleware, PostgreSQL JSONB adapter, schema migrations, and frontend authentication flow. Applying the two minor defensive enhancements will ensure 100% compliance with all edge cases.
