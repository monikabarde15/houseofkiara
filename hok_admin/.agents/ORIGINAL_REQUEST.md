# Original User Request

## 2026-08-24T11:40:00Z

Implement backend and database integration for the HOK Admin Panel, connecting the existing UI screens and actions to a Supabase PostgreSQL database.

Working directory: d:/HOKAdmin/hok_admin
Integrity mode: demo

## Database Connection Details
You must connect to the following database:
`postgresql://postgres:Rrkf4swYDLiBAhgX@db.rnvmjpxhlowhguihesja.supabase.co:5432/postgres`

## Requirements

### R1. Admin Authentication
Connect the existing Admin Login UI to real authentication. Securely validate credentials, handle auth sessions/tokens, protect admin routes, implement logout and session persistence, and handle unauthorized access gracefully without altering the login UI.

### R2. Operations & Catalogue Subsections Database Integration
Connect all views and subsections under **Operations** and **Catalogue** to the PostgreSQL database.
- **Operations Subsections**:
  1. Orders (`orders`)
  2. Offers (`offers` status filter)
  3. Enquiries (`offers` enquiry status filter)
  4. Rental Calendar (`calendar`)
  5. Dispatch Schedule (`dispatch`)
  6. Returns & Deposits (`returns`)
  7. Payouts to Listers (`payouts`)
  8. Customers (`customers`)
- **Catalogue Subsections**:
  1. Products (`products`)
  2. Designers (`designers`)
  3. Listers (`listers`)
  4. LYP Submissions (`lyp`)

### R3. PostgreSQL Database Layer & Adapter
Implement the database connection layer. To avoid rewriting the entire database client and query controllers, implement a lightweight Mongoose-compatible JSONB adapter/wrapper in PostgreSQL. Store the main document fields in a `data` JSONB column, with primary keys and unique constraints extracted to their own columns. Ensure all queries, updates (including `$push`, `$set`, `$pull`), and document saves map correctly to PostgreSQL.

### R4. Mock Data Removal
Remove all hardcoded or mock data arrays (such as mock orders, mock offers, mock enquiries, fake table records) from the frontend and backend, replacing them with real calls to the integrated database.

## Acceptance Criteria

### UI Rules
- [ ] The existing UI design, styling, and layouts are completely unchanged (no adjustments to colors, margins, layouts, buttons, forms, sidebar, headers, or icons).
- [ ] All forms, tables, and buttons function correctly and wire up to real backend actions.

### Authentication & Authorization
- [ ] Valid admin credentials log in successfully, return a token, and the session persists on page refresh.
- [ ] Logging out invalidates the session token in the database.
- [ ] Accessing API endpoints or admin routes without a valid session token is blocked with a 401 Unauthorized error.

### Database Schema
- [ ] PostgreSQL tables are created for all 8 entities: `admins`, `customers`, `designers`, `listers`, `offers`, `orders`, `payouts`, `products`.
- [ ] Each table has a primary key and indexes/unique constraints matching the original MongoDB schema indices (e.g. `orderId`, `email`, `listerId`).

### Operations and CRUD Functional Verification
- [ ] **Orders**: Fetching, viewing detail, updating status (e.g. Confirmed to Packed to Shipped), adding logs, and modifying items persists directly to the database.
- [ ] **Offers & Enquiries**: Adding an offer, countered offers, updating status, exporting to CSV, and adding notes are persisted in the database.
- [ ] **Rental Calendar**: Rental windows, dispatch dates, and return dates are loaded from the database and accurately displayed on the monthly grid, agenda, and Gantt views.
- [ ] **Dispatch Schedule**: Correctly displays orders due for dispatch today, tomorrow, and this week based on DB records.
- [ ] **Returns & Deposits**: Correctly displays returns due, handles quick return logging, and updates deposit refund decisions.
- [ ] **Payouts to Listers**: Lister payouts are saved, status changes (Paid, Failed) persist, and product payout history is queried successfully.
- [ ] **Customers**: Fully supports creating, updating, search/filter, and deleting customers with database updates persisting correctly.
