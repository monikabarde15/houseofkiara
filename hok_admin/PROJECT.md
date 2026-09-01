# Project: HOK Admin Panel Backend & PostgreSQL Database Integration

## Architecture
- **Database Layer**: Supabase PostgreSQL (`postgresql://postgres:Rrkf4swYDLiBAhgX@db.rnvmjpxhlowhguihesja.supabase.co:5432/postgres`) using `pg` Pool with SSL `rejectUnauthorized: false` and connection pooling with IPv4 first DNS lookup.
- **Adapter Layer**: Lightweight Mongoose-compatible JSONB Adapter (`PostgresModel`, `PostgresQuery`, `PostgresDocument`) in `backend/db/postgresAdapter.js` storing document state in a `data JSONB` column with extracted primary keys, unique constraints, and B-tree / GIN indexes across all 8 entity tables (`admins`, `customers`, `designers`, `listers`, `offers`, `orders`, `payouts`, `products`).
- **Backend**: Express.js REST API on port 5000 (`backend/server.js`) with 10 domain routes, scrypt password hashing, session token verification middleware (`authMiddleware.js`), and full CRUD controllers for Operations and Catalogue.
- **Frontend**: React 19 + TypeScript + Vite single-page application with proxy to `/api`. Centralized `Authorization: Bearer <token>` header injection across all API service modules in `src/services/`. All UI layouts, components, styling, CSS classes, and buttons remain 100% frozen.
- **Mock Data Elimination**: All hardcoded arrays, fallback mock files (`mockOrders`, `mockProducts`, `mockDesigners`, `mockListers`, `mockSubmissions`, `RentalCalendar/mockdata`, `Dispatch`, `payouts`), and fake data generators are completely replaced by dynamic database-backed API calls.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | PostgreSQL Connection & Pool | Connect to Supabase PostgreSQL with SSL and connection pooling | M1 | R3, ORIGINAL_REQUEST §10-12 |
| 2 | Table Creation & DDL Migrations | Create all 8 tables (`admins`, `customers`, `designers`, `listers`, `offers`, `orders`, `payouts`, `products`) with primary keys, unique constraints, GIN indexes | M1 | R3, ORIGINAL_REQUEST §53-56 |
| 3 | Mongoose-JSONB Adapter Core | Drop-in Mongoose replacement (`find`, `findOne`, `create`, `save`, `findOneAndUpdate`, `$set`, `$push`, `$pull`, `$inc`, `$or`, `$regex`, `$elemMatch`) | M1 | R3, ORIGINAL_REQUEST §36-38 |
| 4 | Admin Auth & Password Hashing | Real admin login, scrypt password verification, session token generation | M2 | R1, ORIGINAL_REQUEST §16-18, §48-52 |
| 5 | Session Persistence & Logout | Session token persistence on page reload, `/api/auth/logout` invalidation | M2 | R1, ORIGINAL_REQUEST §48-52 |
| 6 | API Route Protection (401) | Express middleware blocking unauthorized API requests with 401 Unauthorized | M2 | R1, ORIGINAL_REQUEST §51 |
| 7 | Frontend Auth Headers | Centralized API client passing `Authorization: Bearer <token>` header on all requests | M2 | R1, spec_miner_frontend_1 |
| 8 | Orders & Order Details Integration | Real DB fetching, order status workflow (Confirmed to Complete), item dispatch/return logs, invoices | M3 | R2, ORIGINAL_REQUEST §22, §58 |
| 9 | Offers & Enquiries Integration | Real DB fetching, status transitions, counter-offers, assignments, notes, CSV export, aggregations | M3 | R2, ORIGINAL_REQUEST §23-24, §59 |
| 10 | Rental Calendar Integration | Dynamic loading of rental windows, dispatch dates, return dates on Month, Agenda, Gantt views | M3 | R2, ORIGINAL_REQUEST §25, §60 |
| 11 | Dispatch Schedule Integration | Dynamic queries for Today, Tomorrow, This Week dispatch schedules from DB records | M3 | R2, ORIGINAL_REQUEST §26, §61 |
| 12 | Returns & Deposits Integration | Live returns processing, quick return logging, condition grading, deposit refund decisions | M3 | R2, ORIGINAL_REQUEST §27, §62 |
| 13 | Payouts to Listers Integration | Real DB payout records, payment queue, status changes (Paid, Failed), product payout history | M3 | R2, ORIGINAL_REQUEST §28, §63 |
| 14 | Customers CRUD Integration | Full customer creation, editing, deletion, multi-field search, addresses, occasions, comm logs | M3 | R2, ORIGINAL_REQUEST §29, §64 |
| 15 | Products & Booking Engine | Real product catalog, images, availability checks, atomic double-booking lock, quote calculation | M4 | R2, ORIGINAL_REQUEST §31, spec_miner_backend_1 |
| 16 | Designers Catalog Integration | Real designer CRUD, auto-seeding initial designers, slug lookup, commercial terms | M4 | R2, ORIGINAL_REQUEST §32 |
| 17 | Listers Management Integration | Real lister CRUD, verification status, pickup preferences, bank details | M4 | R2, ORIGINAL_REQUEST §33 |
| 18 | LYP Submissions Integration | Connect List Your Piece submissions service to database persistence | M4 | R2, ORIGINAL_REQUEST §34 |
| 19 | Complete Mock Data Removal | Purge all mock imports (`mockOrders`, `mockProducts`, `mockDesigners`, `mockListers`, `mockSubmissions`, etc.) from frontend & backend | M5 | R4, ORIGINAL_REQUEST §39-41 |
| 20 | E2E Verification & Adversarial Hardening | Comprehensive test pass (Tiers 1-4), adversarial test hardening (Tier 5), and forensic integrity audit | M6 | Acceptance Criteria, System Spec |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: PostgreSQL Database Layer & JSONB Adapter | DDL migrations, connection pool, Mongoose-JSONB adapter wrapper supporting all query/update operators | none | DONE |
| 2 | M2: Admin Authentication & Session Management | Auth controllers, logout endpoint, auth middleware (401), frontend auth headers and session persistence | M1 | PLANNED |
| 3 | M3: Operations Subsections Database Integration | Orders, Offers, Enquiries, Calendar, Dispatch, Returns & Deposits, Payouts, Customers backend & frontend | M1, M2 | PLANNED |
| 4 | M4: Catalogue Subsections Database Integration | Products, Designers, Listers, LYP submissions backend & frontend | M1, M2 | PLANNED |
| 5 | M5: Complete Mock Data Removal & Cleanup | Complete elimination of all 17 mock data sources, local storage fallbacks, and dummy mocks | M3, M4 | PLANNED |
| 6 | M6: E2E Test Pass & Forensic Integrity Audit | 100% E2E test pass (Tiers 1-4), Tier 5 adversarial hardening, and forensic auditor integrity sign-off | M5 | PLANNED |

## Interface Contracts

### Frontend ↔ Backend REST API
- Base URL: `/api` (proxied by Vite to `http://localhost:5000`)
- Standard Header: `Authorization: Bearer <sessionToken>`, `Content-Type: application/json`
- Auth Endpoints:
  - `GET /api/auth/status` -> `{ initialized: boolean }`
  - `POST /api/auth/register` -> `{ name, email, password }` -> `{ message, token, admin }`
  - `POST /api/auth/login` -> `{ email, password }` -> `{ token, admin }`
  - `POST /api/auth/logout` -> `200 OK` (invalidates session token in DB)
  - `GET /api/auth/me` -> `{ admin }` (requires Bearer token)
- Operations Endpoints:
  - `GET /api/orders`, `GET /api/orders/:id`, `PATCH /api/orders/:id/status`, `POST /api/orders/:id/logs`, `POST /api/orders/:id/dispatch`, `POST /api/orders/:id/return`, `POST /api/orders/:id/deposit-decision`, `GET /api/orders/:id/invoice`
  - `GET /api/offers`, `POST /api/offers`, `GET /api/offers/:id`, `PUT /api/offers/:id`, `PATCH /api/offers/:id/status`, `POST /api/offers/:id/counter`, `POST /api/offers/:id/notes`, `GET /api/offers/export/csv`, `GET /api/offers/stats/summary`
  - `GET /api/payouts`, `GET /api/payouts/export/csv`, `PATCH /api/payouts/:id/status`, `PATCH /api/payouts/:id/pay`, `GET /api/payouts/product/:productId`
  - `GET /api/customers`, `POST /api/customers`, `GET /api/customers/:id`, `PUT /api/customers/:id`, `DELETE /api/customers/:id`, `POST /api/customers/:id/addresses`, `POST /api/customers/:id/occasions`, `POST /api/customers/:id/communication-log`
- Catalogue Endpoints:
  - `GET /api/products`, `POST /api/products`, `GET /api/products/:id`, `PUT /api/products/:id`, `DELETE /api/products/:id`, `GET /api/products/:id/quote`, `POST /api/products/:id/bookings`, `POST /api/products/:id/blocked-dates`, `DELETE /api/products/:id/blocked-dates/:index`, `GET /api/products/:id/activity`, `PUT /api/products/:id/related-products`, `POST /api/products/:id/external-bookings`
  - `GET /api/designers`, `POST /api/designers`, `GET /api/designers/:id`, `PUT /api/designers/:id`, `DELETE /api/designers/:id`
  - `GET /api/listers`, `POST /api/listers`, `GET /api/listers/:id`, `PUT /api/listers/:id`, `DELETE /api/listers/:id`
  - `GET /api/lyp/submissions`, `POST /api/lyp/submissions`, `PUT /api/lyp/submissions/:id`

### Database ↔ Models Adapter Contract
- Mongoose models point to `backend/db/postgresAdapter.js`.
- All methods (`find`, `findOne`, `findById`, `create`, `save`, `findOneAndUpdate`, `findByIdAndUpdate`, `findOneAndDelete`, `findByIdAndDelete`, `countDocuments`, `exists`, `aggregate`, `insertMany`) return promises resolving to Mongoose-like documents with property getter/setters and `.save()` / `.toObject()` / `.toJSON()` methods.

## Code Layout
- `backend/`
  - `config/db.js`: PostgreSQL connection pool setup with IPv4 DNS ordering
  - `db/postgresAdapter.js`: PostgreSQL JSONB adapter implementation with SQL injection sanitization
  - `db/migrate.js`: Schema DDL initialization for all 8 tables and GIN indexes
  - `models/`: Models delegating to `postgresAdapter`
  - `middleware/authMiddleware.js`: 401 JWT/token protection middleware
  - `controllers/`: Auth, Orders, Offers, Payouts, Customers, Products, Designers, Listers, LYP controllers
  - `routes/`: Express route definitions
  - `server.js`: Express server entry point
- `src/`
  - `services/apiClient.ts`: Central fetch wrapper injecting `Authorization: Bearer <token>`
  - `services/*.ts`: Domain API client wrappers (`orderApi`, `offerApi`, `productApi`, etc.)
  - `components/`: Admin UI views (Orders, Offers, Calendar, Dispatch, Returns, Payouts, Customers, Products, Designers, Listers, LYP)
  - `App.tsx`: Top-level router and state orchestrator
