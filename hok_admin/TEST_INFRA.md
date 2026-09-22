# Test Infrastructure Specification — HOK Admin Panel

## 1. Overview & Architecture

The HOK Admin Panel End-to-End (E2E) Test Suite is an opaque-box testing framework designed to validate all backend API endpoints, business logic workflows, data integrity, and PostgreSQL JSONB persistence.

The test suite communicates exclusively over HTTP/REST against the Express backend (`http://localhost:5003/api`), verifying status codes, payload contracts, validation errors, database state transitions, and concurrency safeguards without relying on internal function mocks or white-box shortcuts.

```
+-------------------------------------------------------------------------------+
|                             4-Tier E2E Architecture                           |
+-------------------------------------------------------------------------------+
| Tier 1: Feature Coverage      | >=5 test cases per domain feature (Auth,       |
|                               | Orders, Offers, Calendar, Dispatch, Returns,   |
|                               | Payouts, Customers, Products, Designers,       |
|                               | Listers, LYP)                                 |
+-------------------------------+-----------------------------------------------+
| Tier 2: Boundary & Corner     | Empty/null values, duplicate keys, negative    |
|                               | numbers, invalid transitions, race conditions  |
+-------------------------------+-----------------------------------------------+
| Tier 3: Cross-Feature Flows   | Offer -> Order -> Booking -> Dispatch ->      |
|                               | Return -> Deposit Settlement -> Lister Payout  |
+-------------------------------+-----------------------------------------------+
| Tier 4: Real-World Scenarios  | Full operational lifecycles (Bridal Lehengas,  |
|                               | Damage Dispute, Lister Onboarding to Payout)  |
+-------------------------------------------------------------------------------+
```

---

## 2. Test Runner & Harness

- **Test Framework**: Node.js Native Test Runner (`node:test`, `node:assert/strict`)
- **HTTP Client**: Native `fetch` (Node 18+) with standard JSON and header handling
- **Zero External Test Dependencies**: Executes out-of-the-box using the existing Node.js runtime without needing heavy test runners or separate browser drivers.
- **Server Lifecycle Management**:
  - Automatically connects to an active backend server on `http://localhost:5003` (or custom `TEST_BASE_URL`).
  - Capable of booting the Express server in-process if no standalone server is running.
- **Test Isolation & Determinism**:
  - Every test uses randomized / timestamped identifiers (e.g. `TEST-ORD-<timestamp>`, `test_user_<timestamp>@example.com`).
  - No cross-test state pollution or execution order dependencies.

---

## 3. Test Directory & File Layout

```
tests/
└── e2e/
    ├── helpers/
    │   ├── api_client.js            # Reusable HTTP client with auth session management
    │   ├── test_fixtures.js         # Factory generators for Orders, Products, Customers, etc.
    │   └── server_harness.js        # Server boot / port check harness
    ├── tier1_auth.test.js           # Tier 1: Auth, Login, Registration, 401 Protection, Logout
    ├── tier1_orders.test.js         # Tier 1: Orders CRUD, status transitions, logs, invoices
    ├── tier1_offers.test.js         # Tier 1: Offers, Enquiries, Counter-offers, Notes, CSV export
    ├── tier1_calendar_dispatch.test.js # Tier 1: Rental Calendar & Dispatch Schedule queries
    ├── tier1_returns_deposits.test.js # Tier 1: Returns due, Quick return, QC condition, Deposits
    ├── tier1_payouts.test.js        # Tier 1: Lister Payouts, Approval, CSV export, History
    ├── tier1_customers.test.js      # Tier 1: Customer CRUD, multi-search, subdocuments
    ├── tier1_products.test.js       # Tier 1: Products, Quotes, Availability, Blocked dates
    ├── tier1_designers.test.js      # Tier 1: Designers catalog, slug lookups, auto-seed
    ├── tier1_listers.test.js        # Tier 1: Lister directory, KYC verification, Bank details
    ├── tier1_lyp.test.js            # Tier 1: List Your Piece submissions lifecycle
    ├── tier2_boundary.test.js       # Tier 2: Boundary, Corner & Error handling cases
    ├── tier3_cross_feature.test.js  # Tier 3: Multi-domain interaction workflows
    ├── tier4_real_world.test.js     # Tier 4: Real-world operational scenarios
    └── runner.js                    # Unified CLI Test Orchestrator & Report Generator
```

---

## 4. 20-Feature Coverage Matrix

| # | Feature in PROJECT.md | Tier | Test File | Target Test Count | Description & Assertions |
|---|-----------------------|------|-----------|-------------------|--------------------------|
| 1 | PostgreSQL Connection & Pool | T1 | `tier1_auth.test.js` | 5 | DB connectivity, pool health, query latency, session persistence |
| 2 | Table Creation & DDL Migrations | T1 | `tier1_products.test.js` | 5 | Schema presence, JSONB data column, extracted columns across 8 entities |
| 3 | Mongoose-JSONB Adapter Core | T1 | `tier1_orders.test.js` | 6 | `$set`, `$push`, `$inc`, `$elemMatch`, `$regex`, atomic findOneAndUpdate |
| 4 | Admin Auth & Password Hashing | T1 | `tier1_auth.test.js` | 6 | Scrypt hashing, salt verification, valid/invalid credentials, status check |
| 5 | Session Persistence & Logout | T1 | `tier1_auth.test.js` | 5 | Session token issuance, `/api/auth/logout` invalidation, token reuse block |
| 6 | API Route Protection (401) | T1 | `tier1_auth.test.js` | 5 | Protected routes reject missing or invalid `Authorization: Bearer` with 401 |
| 7 | Frontend Auth Headers | T1 | `tier1_auth.test.js` | 5 | Bearer header parsing, valid token acceptance, malformed token rejection |
| 8 | Orders & Order Details | T1 | `tier1_orders.test.js` | 8 | Order creation, detail retrieval, workflow transitions, item edits, invoice |
| 9 | Offers & Enquiries | T1 | `tier1_offers.test.js` | 8 | Negotiation lifecycle, counter-offers, assignments, notes, CSV export |
| 10 | Rental Calendar Integration | T1 | `tier1_calendar_dispatch.test.js` | 5 | Rental date window aggregation, Month/Agenda/Gantt date range matching |
| 11 | Dispatch Schedule Integration | T1 | `tier1_calendar_dispatch.test.js` | 5 | Today, Tomorrow, This Week query filters, courier & tracking updates |
| 12 | Returns & Deposits | T1 | `tier1_returns_deposits.test.js` | 6 | Returns due list, QC condition grading (A/B/C/D), deposit decisions |
| 13 | Payouts to Listers | T1 | `tier1_payouts.test.js` | 6 | Payout queue, commission math, mark paid with UTR, CSV export |
| 14 | Customers CRUD Integration | T1 | `tier1_customers.test.js` | 7 | Customer lifecycle, multi-field search, addresses, occasions, comm log |
| 15 | Products & Booking Engine | T1 | `tier1_products.test.js` | 8 | Product catalog, quote calculation, availability check, date blocking |
| 16 | Designers Catalog Integration | T1 | `tier1_designers.test.js` | 6 | Designer CRUD, auto-slug generation, auto-seed verification, terms edit |
| 17 | Listers Management Integration | T1 | `tier1_listers.test.js` | 6 | Lister onboarding, verification status, bank details deep update |
| 18 | LYP Submissions Integration | T1 | `tier1_lyp.test.js` | 5 | List Your Piece intake, status workflow, approval into product catalog |
| 19 | Complete Mock Data Removal | T1-T4 | All suites | 10 | Dynamic database-backed responses; zero fallback mock data pollution |
| 20 | E2E Verification & Hardening | T2-T4 | `tier2_boundary.test.js`, `tier3_cross_feature.test.js`, `tier4_real_world.test.js` | 25 | Concurrency lock, boundary extremes, cross-feature cascades, user journeys |

**Total Test Cases Across Suite**: >= 120 executable test cases.

---

## 5. Test Tier Specifications

### 5.1 Tier 1: Feature Coverage (>=5 tests per feature area)
- Exercises each individual endpoint in isolation.
- Verifies happy path HTTP 200/201 responses.
- Verifies response body schema conformance (`success: true`, correct field types).
- Validates data persistence by performing write followed by read.

### 5.2 Tier 2: Boundary & Corner Cases
- **Empty / Null / Missing Values**: Omitted required fields, empty strings, whitespace-only names.
- **Duplicate & Unique Key Constraints**: Duplicate customer emails, duplicate product IDs, duplicate designer slugs.
- **Invalid Workflow Status Transitions**: Jumping invalid status steps (e.g. `Delivered` directly to `Complete` without `Returned`).
- **Concurrency & Double-Booking Collisions**: Overlapping rental reservation attempts on the same product dates returning 409 Conflict.
- **Boundary Numbers**: 0-day rentals, negative rental prices, negative deposit amounts, 100% discount.

### 5.3 Tier 3: Cross-Feature Interactions
- **Flow A (Order Completion -> Auto-Payout)**: Order status progression to `Returned` triggers automatic Lister Payout entry with correct split (80/20).
- **Flow B (Offer Acceptance -> Order Creation)**: Customer offer negotiated and accepted generates an operational Order linked to customer.
- **Flow C (Product Booking -> Calendar & Dispatch)**: Booking a product immediately registers dates in Rental Calendar and appears on Dispatch Schedule.
- **Flow D (Return QC Assessment -> Deposit Settlement)**: Condition Grade B with minor defect triggers partial deposit refund deduction and updates customer deposit history.

### 5.4 Tier 4: Real-World Workload Scenarios
- **Scenario 1 (Luxury Bridal Lehenga Rental Journey)**:
  1. Customer registration & KYC.
  2. Quote calculation for 4-day rental + security deposit + 18% GST.
  3. Order placement and atomic reservation locking.
  4. Dispatch preparation with tracking ID.
  5. Post-rental return inspection, grade A condition approval, and deposit release.
  6. Lister payout generation, approval, and UTR settlement.
- **Scenario 2 (Lister Wardrobe Onboarding & LYP Intake)**:
  1. Lister onboards with bank details and PAN.
  2. LYP submission intake with images and estimated valuation.
  3. Admin review, SKU generation, and approval into live catalog product.
  4. Product rented out by customer and lister earning verified.

---

## 6. Execution Commands

### Run Full E2E Test Suite
```bash
# Using native Node test runner via unified orchestrator
node tests/e2e/runner.js

# Or using npm script
npm run test:e2e
```

### Run Specific Tiers
```bash
# Tier 1 only (Feature Coverage)
node --test tests/e2e/tier1_*.test.js

# Tier 2 only (Boundary & Corner Cases)
node --test tests/e2e/tier2_boundary.test.js

# Tier 3 only (Cross-Feature Interactions)
node --test tests/e2e/tier3_cross_feature.test.js

# Tier 4 only (Real-World Scenarios)
node --test tests/e2e/tier4_real_world.test.js
```

### Run Single Feature Domain
```bash
# Auth & Session Protection
node --test tests/e2e/tier1_auth.test.js

# Orders & Workflow
node --test tests/e2e/tier1_orders.test.js

# Products & Booking Engine
node --test tests/e2e/tier1_products.test.js
```

### Environment Configuration
```bash
# Custom base URL (default: http://localhost:5003/api)
TEST_BASE_URL=http://localhost:5003/api node tests/e2e/runner.js
```
