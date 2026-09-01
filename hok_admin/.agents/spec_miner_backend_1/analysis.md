# Backend Specification & API Route Analysis

## 1. Executive Summary
This document delivers a comprehensive survey of the backend architecture for the HOK Admin Panel, identifying:
1. All registered routes, controllers, middleware, and database models across **Auth**, **Operations** (Orders, Offers, Enquiries, Calendar, Dispatch, Returns, Payouts, Customers), and **Catalogue** (Products, Designers, Listers, LYP).
2. Missing or unmounted endpoints required to fully connect the frontend views.
3. The exact PostgreSQL JSONB adapter mechanism replacing Mongoose models without breaking existing controller business logic.
4. Complete Feature Discovery and Edge Cases specification tables.

---

## 2. Backend Server & Architecture Map

### 2.1 Server Entry Point (`backend/server.js`)
The backend is an Express application (`port 5000`) connecting to the database via `connectDB()`.
Routers are mounted as follows:
```javascript
app.use("/api", offersRouter);           // backend/routes/offerRoutes.js
app.use("/api", authRouter);             // backend/routes/authRoutes.js
app.use("/api/listers", listerRouter);   // backend/routes/listerRoutes.js
app.use("/api/designers", designerRouter);// backend/routes/designerRoutes.js
app.use("/api", payoutRouter);           // backend/routes/payoutRoutes.js
app.use("/api", productRouter);          // backend/routes/productRoutes.js
app.use("/api", orderRouter);            // backend/routes/orderRoutes.js
app.use("/api", uploadRouter);           // backend/routes/uploadRoutes.js
app.use("/api", messageRouter);          // backend/routes/messageRoutes.js
app.use("/api", customerRouter);         // backend/routes/customerRoutes.js
```

---

## 3. Comprehensive Domain Route & Controller Inventory

### 3.1 Admin Authentication (`backend/controllers/authController.js`)
- **Controller Implementation**: Uses `crypto.scrypt` with salt and `crypto.timingSafeEqual` for password verification. Session tokens generated with `crypto.randomBytes(32).toString('hex')`.
- **Existing Routes**:
  | HTTP Method | Route | Controller Handler | Description |
  |-------------|-------|--------------------|-------------|
  | `GET` | `/api/auth/status` | `getAuthStatus` | Checks if an initial admin is already registered (`Admin.exists({})`). |
  | `POST` | `/api/auth/register` | `registerAdmin` | Registers admin if none exists (email, name, password 8+ chars). |
  | `POST` | `/api/auth/login` | `loginAdmin` | Validates credentials, issues session token, updates `Admin.sessionToken`. |
- **Identified Gaps / Missing Endpoints**:
  - `POST /api/auth/logout`: Missing endpoint to invalidate the admin `sessionToken` in the database.
  - `authMiddleware.js`: Missing middleware to inspect `Authorization: Bearer <token>` or `x-auth-token` header and protect sensitive API endpoints with HTTP 401 Unauthorized.

---

### 3.2 Operations: Orders & Workflow (`backend/controllers/orderController.js`, `orderWorkflowController.js`)
- **Controller Implementation**: Comprehensive workflow state machine with status progression (`Confirmed` -> `Packed` -> `Dispatched` -> `Shipped` -> `Delivered` -> `Return Due` -> `Return Sent` -> `Returned` -> `Complete`), subdocument tracking for `preDispatch`, `dispatch`, `returnCondition`, `depositDecision`, activity log history, and auto-payout generation on return completion.
- **Existing Routes**:
  | HTTP Method | Route | Controller Handler | Description |
  |-------------|-------|--------------------|-------------|
  | `GET` | `/api/orders` | `getOrders` | Lists all orders with status/mode filters, sorted newest first. |
  | `POST` | `/api/orders` | `createOrder` | Creates new order with items, customer details, financial breakdown. |
  | `GET` | `/api/orders/:id` | `getOrder` | Retrieves order by `orderId` or `_id`. |
  | `PUT` | `/api/orders/:id` | `updateOrder` | Updates full order fields with `$set`. |
  | `POST` | `/api/orders/:id/logs` | `addOrderLog` | Appends log entry (`message`, `type`, `user`) to order logs. |
  | `PATCH` | `/api/orders/:id/status` | `transitionOrder` | Transitions order workflow status and appends timeline log. |
  | `PATCH` | `/api/orders/:id/items/:index` | `updateOrderItem` | Updates specific item attributes in `order.items[index]`. |
  | `PATCH` | `/api/orders/:id/items/:index/dispatch` | `updateDispatch` | Records dispatch details (courier, tracking, parcel date). |
  | `PATCH` | `/api/orders/:id/items/:index/return` | `updateReturnCondition`| Logs return QC grade (A/B/C/D), notes, and evidence. |
  | `PATCH` | `/api/orders/:id/items/:index/evidence` | `saveOrderEvidence` | Saves photo URLs and video URLs for pre-dispatch or return. |
  | `PATCH` | `/api/orders/:id/items/:index/deposit` | `decideDeposit` | Records deposit refund decision (Released, Partial, Forfeited). |
  | `GET` | `/api/orders/:id/invoice` | `getInvoice` | Generates / retrieves invoice details and printable metadata. |

---

### 3.3 Operations: Offers & Enquiries (`backend/controllers/offerController.js`)
- **Controller Implementation**: Full lifecycle for negotiations, counter-offers, multi-tier status changes, soft-deletes with trash and bulk recovery, and monthly analytics aggregation.
- **Existing Routes**:
  | HTTP Method | Route | Controller Handler | Description |
  |-------------|-------|--------------------|-------------|
  | `GET` | `/api/offers/dashboard` | `getOfferDashboard` | Aggregated dashboard stats (totals, status breakdown, monthly revenue). |
  | `GET` | `/api/offers/recent` | `getRecentOffers` | Fetches 5 most recent active offers. |
  | `GET` | `/api/offers/statistics` | `getOfferStatistics`| Computes offer conversion rates, averages, and status counts. |
  | `GET` | `/api/offers/export/csv` | `exportOffersCSV` | Streams CSV export of all non-deleted offers. |
  | `GET` | `/api/offers` | `getOffers` | Paginated listing with search, status, category, date filters. |
  | `GET` | `/api/offers/trash` | `getDeletedOffers` | Lists soft-deleted offers (`isDeleted: true`). |
  | `GET` | `/api/offers/:id` | `getOfferById` | Retrieves offer by `offerId` or `_id`. |
  | `POST` | `/api/offers` | `createOffer` | Creates a new customer offer or enquiry. |
  | `PUT` | `/api/offers/:id` | `updateOffer` | Full edit of offer attributes. |
  | `DELETE` | `/api/offers/:id` | `deleteOffer` | Soft deletes offer (`isDeleted = true`). |
  | `DELETE` | `/api/offers/:id/permanent` | `permanentDeleteOffer` | Permanently removes offer row from database. |
  | `PATCH` | `/api/offers/:id/restore` | `restoreOffer` | Restores soft-deleted offer back to active state. |
  | `DELETE` | `/api/offers/bulk-delete` | `bulkDeleteOffers` | Bulk soft-delete matching array of `offerIds`. |
  | `PATCH` | `/api/offers/bulk-restore` | `bulkRestoreOffers` | Bulk restore matching array of `offerIds`. |
  | `DELETE` | `/api/offers/bulk-permanent-delete` | `bulkPermanentDeleteOffers` | Bulk permanent delete matching `offerIds`. |
  | `POST` | `/api/offers/:id/duplicate` | `duplicateOffer` | Clones existing offer with new ID and Pending status. |
  | `PATCH` | `/api/offers/:id/status` | `updateOfferStatus` | Updates status (Accepted, Rejected, Counter Offered, Assigned). |
  | `POST` | `/api/offers/:id/counter-offer` | `sendCounterOffer` | Appends counter offer amount, note, and adjusts negotiation status. |
  | `GET` | `/api/offers/:id/counter-offers` | `getCounterOfferHistory` | Returns history of counter offers for an offer. |
  | `POST` | `/api/offers/:id/assign` | `assignOffer` | Assigns offer to team member and records assignment log. |
  | `GET` | `/api/offers/:id/assignment-history` | `getAssignmentHistory` | Returns log of team assignments for this offer. |
  | `POST` | `/api/offers/:id/notes` | `addOfferNote` | Appends internal team note to offer. |
  | `GET` | `/api/offers/:id/notes` | `getOfferNotes` | Returns array of notes for this offer. |
  | `GET` | `/api/offers/:id/timeline` | `getOfferTimeline` | Returns chronologically sorted action timeline. |

---

### 3.4 Operations: Payouts to Listers (`backend/controllers/payoutController.js`)
- **Controller Implementation**: Lister payout schedule, aggregation of pending and paid totals, status transitions (`Pending` -> `Paid` / `Failed` / `Reversed`), CSV export, and product payout history query.
- **Existing Routes**:
  | HTTP Method | Route | Controller Handler | Description |
  |-------------|-------|--------------------|-------------|
  | `GET` | `/api/payouts` | `getPayouts` | Lists payouts with status, listerId, dueDate filters and totals. |
  | `GET` | `/api/payouts/export/csv` | `exportPayouts` | Streams CSV export of payout records. |
  | `GET` | `/api/payouts/:id` | `getPayoutById` | Fetches single payout by ID. |
  | `POST` | `/api/payouts` | `createPayout` | Creates new payout record with commission calculation. |
  | `PATCH` | `/api/payouts/:id/paid` | `markPayoutPaid` | Marks payout as Paid with transaction reference and paidAt timestamp. |
  | `PATCH` | `/api/payouts/:id/approve` | `markPayoutPaid` | Approval alias marking payout processed. |
  | `PATCH` | `/api/payouts/:id/status` | `updatePayoutStatus` | Updates payout status to Pending, Failed, or Reversed. |
  | `GET` | `/api/products/:productId/payout-history` | `getPayouts` | Returns historical payouts associated with a product. |

---

### 3.5 Operations: Customers (`backend/controllers/customerController.js`)
- **Controller Implementation**: Supports customer profile lifecycle, search across name/email/phone/location, subdocument arrays for multiple addresses, occasions (birthdays, anniversaries), and communication logs.
- **Existing Routes**:
  | HTTP Method | Route | Controller Handler | Description |
  |-------------|-------|--------------------|-------------|
  | `GET` | `/api/customers` | `getCustomers` | Searchable & filterable customer directory. |
  | `POST` | `/api/customers` | `createCustomer` | Creates new customer profile (or updates if email/ID exists). |
  | `GET` | `/api/customers/:id` | `getCustomer` | Retrieves customer by `customerId` or `_id`. |
  | `PUT` | `/api/customers/:id` | `updateCustomer` | Full customer profile update. |
  | `PATCH` | `/api/customers/:id` | `updateCustomer` | Partial customer profile update. |
  | `DELETE` | `/api/customers/:id` | `deleteCustomer` | Deletes customer from database. |
  | `POST` | `/api/customers/:id/addresses` | `addCustomerAddress` | Appends address to customer addresses array. |
  | `POST` | `/api/customers/:id/occasions` | `addCustomerOccasion` | Appends special occasion to occasions array. |
  | `POST` | `/api/customers/:id/communication-log` | `addCustomerCommLog` | Prepend entry to customer communication history. |

---

### 3.6 Operations: Rental Calendar & Dispatch Schedule
- **Operational Integration**:
  - `RentalCalendarView`: Calendar grid, agenda, and Gantt views load events and dispatches directly from real `Order` items (`rentalStartDate`, `rentalEndDate`, `dispatchDate`, `returnDueDate`, `status`).
  - `DispatchSchedule`: `TodayTab`, `TomorrowTab`, and `ThisWeekTab` filter orders from `/api/orders` where `dispatchDate` equals today, tomorrow, or within the current 7-day operational window.

---

### 3.7 Catalogue: Products & Booking Management (`backend/controllers/productController.js`, `bookingController.js`, `productQuoteController.js`, `productSectionController.js`)
- **Controller Implementation**: Comprehensive luxury catalogue management with multi-mode pricing (Rental, Preloved, Buy), measurement dimensions, cleaning buffers, atomic reservation conflict detection, blocked date ranges, and external booking synchronization.
- **Existing Mounted Routes (`backend/routes/productRoutes.js`)**:
  | HTTP Method | Route | Controller Handler | Description |
  |-------------|-------|--------------------|-------------|
  | `GET` | `/api/products` | `getProducts` | Lists products with category, status, designer, availability filters. |
  | `GET` | `/api/products/:id` | `getProductById` | Retrieves product by `productId` or `_id`. |
  | `POST` | `/api/products` | `createProduct` | Creates new catalogue product. |
  | `PUT` | `/api/products/:id` | `updateProduct` | Full update of product details. |
  | `PUT` | `/api/products/:id/images` | `updateProductImages` | Updates product image gallery URLs. |
  | `DELETE` | `/api/products/:id` | `deleteProduct` | Deletes product record. |
  | `PATCH` | `/api/products/:id/archive` | `archiveProduct` | Sets status to 'Archived' and logs activity. |
  | `PATCH` | `/api/products/:id/restore` | `restoreProduct` | Sets status back to 'Live' and logs activity. |
  | `PATCH` | `/api/products/:id/increment-rented` | `incrementTimesRented` | Increments `timesRented` counter. |
  | `PATCH` | `/api/products/:id/listing-modes` | `updateListingModes` | Updates allowed listing modes (Rental, Preloved, Buy). |
  | `GET` | `/api/products/:id/availability` | `checkProductAvailability`| Checks date availability with buffer and conflict checks. |
  | `GET` | `/api/products/:id/calendar` | `getProductCalendar` | Retrieves blocked dates, booking history, and external bookings. |
  | `POST` | `/api/products/:id/reserve` | `reserveProduct` | Concurrency-safe reservation with atomic `$not: { $elemMatch }`. |
  | `POST` | `/api/products/:id/external-booking` | `addExternalBooking` | Adds external booking to prevent studio double-booking. |
  | `PATCH` | `/api/products/:id/measurements` | `updateMeasurements` | Updates garment measurements (bust, waist, hips, length). |
- **Unmounted / Missing Route Handlers (Implemented in Controllers)**:
  - `GET /api/products/:id/quote`: Implemented in `backend/controllers/productQuoteController.js` (`calculateProductQuote`), called by `src/services/productQuoteApi.ts`.
  - `POST /api/products/:id/bookings`: Called by `src/services/bookingApi.ts`, should alias `reserveProduct`.
  - `POST /api/products/:id/blocked-dates`: Implemented in `backend/controllers/productSectionController.js` (`addBlockedDate`), called by `src/services/productSectionsApi.ts`.
  - `DELETE /api/products/:id/blocked-dates/:index`: Implemented in `productSectionController.js` (`removeBlockedDate`).
  - `GET /api/products/:id/activity`: Implemented in `productSectionController.js` (`getProductActivity`).
  - `PUT /api/products/:id/related-products`: Implemented in `productSectionController.js` (`updateRelatedProducts`).
  - `POST /api/products/:id/external-bookings`: Plural alias for `addExternalBooking` called by `productSectionsApi.ts`.

---

### 3.8 Catalogue: Designers (`backend/controllers/designerController.js`)
- **Controller Implementation**: Luxury designer brand management, slug generation, authentication tiers, commercial terms, and auto-seeding initial designers if empty.
- **Existing Routes**:
  | HTTP Method | Route | Controller Handler | Description |
  |-------------|-------|--------------------|-------------|
  | `GET` | `/api/designers` | `getDesigners` | Lists designers with search, status, type filters. |
  | `GET` | `/api/designers/:id` | `getDesignerById` | Retrieves designer by `designerId`, `slug`, or `_id`. |
  | `POST` | `/api/designers` | `createDesigner` | Creates new designer brand with generated slug. |
  | `PUT` | `/api/designers/:id` | `updateDesigner` | Updates designer profile and commercial terms. |
  | `DELETE` | `/api/designers/:id` | `deleteDesigner` | Removes designer from database. |

---

### 3.9 Catalogue: Listers (`backend/controllers/listerController.js`)
- **Controller Implementation**: Lister onboarding, KYC verification, flexible schema fields (`address`, `bankDetails`, `terms`, `payoutPercentages`), and bank account updates.
- **Existing Routes**:
  | HTTP Method | Route | Controller Handler | Description |
  |-------------|-------|--------------------|-------------|
  | `GET` | `/api/listers` | `getListers` | Lists listers with search and verification status filters. |
  | `POST` | `/api/listers` | `createLister` | Onboards new lister with generated `listerId` and initials. |
  | `GET` | `/api/listers/:id` | `getLister` | Retrieves lister by `listerId`, `id`, or `_id`. |
  | `PUT` | `/api/listers/:id` | `updateLister` | Updates lister profile, address, and verification state. |
  | `DELETE` | `/api/listers/:id` | `deleteLister` | Removes lister record from database. |
  | `PUT` | `/api/listers/:id/bank-details` | `updateBankDetails` | Updates bank account, IFSC, and UPI details. |

---

### 3.10 Catalogue: LYP Submissions (List Your Piece)
- **Current State**: Frontend uses `src/components/LYP/services/submissionService.ts` backed by `mockSubmissions.ts`.
- **Database Integration**: Can be backed by database `lister_submissions` table or mapped directly to lister products pending review with status transitions (New, In Review, Awaiting Reply, Approved, Rejected, Withdrawn, Expired).

---

### 3.11 Uploads & Messaging (`backend/controllers/uploadController.js`, `backend/routes/messageRoutes.js`)
- **Existing Routes**:
  | HTTP Method | Route | Controller Handler | Description |
  |-------------|-------|--------------------|-------------|
  | `POST` | `/api/uploads` | `uploadFile` | Handles multipart image/video uploads via Cloudinary / storage. |
  | `DELETE` | `/api/uploads` | `deleteFile` | Deletes uploaded asset by `publicId`. |
  | `POST` | `/api/messages/send` | In-line handler | Dispatches WhatsApp / SMS message notification. |
  | `GET` | `/api/messages` | In-line handler | Retrieves notification delivery log. |

---

## 4. PostgreSQL JSONB Adapter Connection Mechanism

### 4.1 Connection Layer (`backend/config/db.js`)
- Replaces MongoDB Mongoose connection with `pg.Pool`:
  ```javascript
  import pg from "pg";
  const { Pool } = pg;

  export const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:Rrkf4swYDLiBAhgX@db.rnvmjpxhlowhguihesja.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  export const connectDB = async () => {
    const client = await pool.connect();
    try {
      console.log("Connected to Supabase PostgreSQL database successfully");
      await initTables(client);
    } finally {
      client.release();
    }
  };
  ```

### 4.2 Adapter Query & Mutation Architecture
The adapter provides a lightweight drop-in Mongoose replacement (`PostgresModel`):
1. **Hybrid Column + JSONB Storage**: Primary/foreign keys (`order_id`, `customer_id`, `product_id`, `designer_id`, `lister_id`, `offer_id`, `payout_id`, `email`, `status`, `created_at`, `updated_at`) are extracted to indexed relational columns, while the full document is preserved in `data JSONB`.
2. **CRUD & Query Chaining**: `find`, `findOne`, `findById`, `create`, `save`, `findOneAndUpdate`, `findByIdAndUpdate`, `findOneAndDelete`, `findByIdAndDelete`, `updateOne`, `updateMany`, `deleteOne`, `deleteMany`, `countDocuments`, `exists` return fluent `PostgresQuery` objects supporting `.sort()`, `.skip()`, `.limit()`, `.select()`, `.lean()`, and `.exec()`.
3. **Complex Operators**: Translates `$or`, `$and`, `$in`, `$nin`, `$gte`, `$lte`, `$regex`, `$options: 'i'`, `$not`, `$elemMatch` to SQL expressions.
4. **Mutations**: Deep merges `$set`, appends `$push`, removes `$pull`, increments `$inc`.
5. **Document Instance Methods**: Returned instances support property mutation, `doc.save()`, `doc.toObject()`, and `doc.toJSON()`.

---

## 5. Discovered Features & Inventory Table

## Features Discovered
| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Auth | Admin Registration & Login | Secure registration and login with scrypt hash and session token generation | `{ email, password, name }` | `{ token, admin }` | Returns 400 (validation), 401 (invalid credentials), 409 (already exists) | `backend/controllers/authController.js` |
| 2 | Auth | Session Invalidation (Logout) | Clears session token from database on logout | `{ sessionToken }` | `{ success: true }` | Returns 401 if token missing or invalid | ORIGINAL_REQUEST.md Requirement R1 |
| 3 | Auth | Route Protection Middleware | Inspects authorization token on requests to protected API endpoints | `Authorization` header | Next middleware or 401 Unauthorized | Blocks unauthorized access with 401 JSON error | ORIGINAL_REQUEST.md Requirement R1 |
| 4 | Operations | Orders CRUD & Workflow | Full state machine progression, item updates, dispatch tracking, return condition, and deposit refund decisions | Order payloads, status strings, subdocument data | Updated order JSON | Returns 404 (not found) or 422 (validation failure) | `backend/controllers/orderController.js`, `orderWorkflowController.js` |
| 5 | Operations | Offers & Counter Offers | Offer negotiation lifecycle, counter offers, team assignments, internal notes, CSV export, and monthly analytics | Offer objects, counter amounts, assignment payloads | Offer records, CSV stream, aggregation objects | Returns 404/422/500 with descriptive error messages | `backend/controllers/offerController.js` |
| 6 | Operations | Lister Payout Management | Lister payout scheduling, CSV export, UTR/payment references, status updates, and product payout history | Payout payloads, payment references | Payout objects, CSV stream, aggregated totals | Validates numeric values and dates | `backend/controllers/payoutController.js` |
| 7 | Operations | Customer Directory & Subdocuments | Multi-field search, address book, occasion tracking, and communication log | Customer objects, address/occasion/commLog payloads | Customer profile JSON | Validates email format and unique customerId | `backend/controllers/customerController.js` |
| 8 | Operations | Rental Calendar Integration | Visual calendar grid, agenda, and Gantt views powered by order booking dates | Real orders / booking items | Calendar event cards and operational timeline | Handles missing dates gracefully | `src/components/RentalCalendar/` |
| 9 | Operations | Dispatch Schedule Integration | Operational queue for today, tomorrow, and this week's shipments | Real orders with dispatch dates | Dispatch cards grouped by delivery day | Displays empty state if no dispatches due | `src/components/Dispatch/` |
| 10 | Catalogue | Product Catalogue & Concurrency | Full product lifecycle, measurement dimensions, blocked dates, and atomic conflict check for double-booking prevention | Product objects, booking date ranges | Product JSON, availability flags | Returns 409 Conflict if date overlaps existing booking | `backend/controllers/productController.js`, `bookingController.js` |
| 11 | Catalogue | Product Price & Quote Calculator | Dynamically calculates rental rates, deposits, GST, cleaning fees, and grand totals | Product ID, rental duration, listing mode | Calculated quote JSON | Returns 404 if product not found | `backend/controllers/productQuoteController.js` |
| 12 | Catalogue | Designer Directory & Auto-Seed | Designer brand listing, commercial terms, risk tier, and auto-seeding if table is empty | Designer payloads | Designer objects | Auto-generates unique URL slug | `backend/controllers/designerController.js` |
| 13 | Catalogue | Lister Directory & Bank Management | Lister profiles, verification status, KYC, and bank account details | Lister payloads, bank details | Lister records | Validates required fields and trims input | `backend/controllers/listerController.js` |
| 14 | Catalogue | Product Section Management | Manages blocked dates, activity logs, related products, and external bookings | Date ranges, product IDs, booking records | Updated section arrays | Rejects overlapping blocked date ranges | `backend/controllers/productSectionController.js` |
| 15 | Common | Database Adapter Layer | PostgreSQL JSONB Mongoose compatibility wrapper with pool management and automatic table creation | Mongoose queries, updates, aggregations | Relational + JSONB database persistence | Throws on SQL execution failure | `backend/config/db.js` |

---

## 6. Edge Cases & Error Behaviors

## Edge Cases
| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Order Transition to Returned | Order marked complete with condition grade A | Automatically marks deposit released and creates payout record in `Payout` table. |
| 2 | Product Double Booking | Two concurrent reservation requests for overlapping dates | `$not: { $elemMatch: { ... } }` in `Product.findOneAndUpdate` rejects the second request with a 409 Conflict error. |
| 3 | Non-ObjectId ID Queries | Calling `getOrder('HOK-ORD-001')` or `getDesigner('sabyasachi')` | Queries use `$or: [{ entityId: id }, { _id: id }]`, safely handling both custom string IDs and hex ObjectIds without throwing CastError. |
| 4 | Bulk Offers Soft-Delete | Array of `offerIds` passed to `/offers/bulk-delete` | Updates all matching rows with `isDeleted = true`, `deletedAt = NOW()`, and appends timeline log entry. |
| 5 | Lister Bank Details Update | Calling `PUT /api/listers/:id/bank-details` with nested bank object | Preserves existing lister fields while deeply updating `bankDetails` in document JSONB. |
| 6 | Unregistered Admin Login | Initial startup before any admin is registered | `GET /api/auth/status` returns `registered: false`, prompting UI to display initial registration form. |
| 7 | Multi-Field Customer Search | Searching term "mumbai" across customer directory | Compiles case-insensitive regex matching across `name`, `email`, `phone`, `location`, and `customerId`. |
| 8 | Product Blocked Date Overlap | Attempting to add a blocked date range overlapping an existing blocked range | Controller returns 409 Conflict with message "Blocked date range overlaps an existing range". |
| 9 | Unmounted Product Section Routes | Frontend calls `/products/:id/quote` or `/products/:id/blocked-dates` | Requires router mounts in `productRoutes.js` to prevent 404 Route Not Found errors. |
| 10 | PostgreSQL Connection Termination | Supabase connection drops during inactivity | `pg.Pool` automatically handles reconnection and releases client back to pool. |
