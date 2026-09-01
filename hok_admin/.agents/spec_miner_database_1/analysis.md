# Database Schema & Mongoose-JSONB Adapter Specifications

## 1. Executive Summary & Architecture Overview
This specification document provides the authoritative technical blueprint for integrating the Supabase PostgreSQL database into the HOK Admin Panel backend. 

The application currently uses Mongoose models across 14 controllers and multiple route handlers. To maintain 100% compatibility with existing business logic, validation layers, controllers, and frontend contracts without rewriting entire controllers from scratch, the system will use a **PostgreSQL JSONB Adapter Architecture** (`PostgresModel` / `PostgresQuery` / `PostgresDocument`):
1. All 8 application entities (`admins`, `customers`, `designers`, `listers`, `offers`, `orders`, `payouts`, `products`) are mapped to dedicated PostgreSQL tables.
2. Each table utilizes a hybrid storage model:
   - `_id VARCHAR(64) PRIMARY KEY` for document identity.
   - Top-level indexed columns for primary keys, natural unique identifiers, and critical filter fields (`customer_id`, `designer_id`, `slug`, `lister_id`, `offer_id`, `order_id`, `payout_id`, `product_id`, `email`, `status`, `created_at`, `updated_at`).
   - A `data JSONB NOT NULL DEFAULT '{}'::jsonb` column storing the full document state, supporting nested objects, arrays, and flexible schemas (`strict: false` models).
   - High-performance indexes: B-tree indexes on relational/filter columns and GIN indexes on the `data` JSONB column.
3. A drop-in Mongoose-compatible adapter layer implements standard Mongoose methods (`find`, `findOne`, `findById`, `create`, `save`, `findOneAndUpdate`, `findByIdAndUpdate`, `findOneAndDelete`, `findByIdAndDelete`, `updateOne`, `updateMany`, `deleteOne`, `deleteMany`, `countDocuments`, `exists`, `aggregate`, `distinct`) and query/update operators (`$set`, `$push`, `$pull`, `$inc`, `$or`, `$and`, `$in`, `$nin`, `$gte`, `$lte`, `$regex`, `$elemMatch`).

---

## 2. Database Connection Specifications
- **Target Host**: Supabase PostgreSQL Cloud
- **Connection URI**: `postgresql://postgres:Rrkf4swYDLiBAhgX@db.rnvmjpxhlowhguihesja.supabase.co:5432/postgres`
- **Environment Variables**:
  - `DATABASE_URL=postgresql://postgres:Rrkf4swYDLiBAhgX@db.rnvmjpxhlowhguihesja.supabase.co:5432/postgres`
  - `PGSSLMODE=require`
- **Driver**: `pg` (node-postgres with `Pool`)
- **Connection Configuration**:
  ```javascript
  {
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:Rrkf4swYDLiBAhgX@db.rnvmjpxhlowhguihesja.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  }
  ```

---

## 3. Entity & Schema Specifications (All 8 Entities)

### 3.1 `admins`
- **Model**: `Admin` (`backend/models/Admin.js`)
- **Table**: `admins`
- **Schema Columns**:
  | Column | PostgreSQL Type | Constraints | Description |
  |--------|-----------------|-------------|-------------|
  | `_id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique ID / MongoDB ObjectId hex |
  | `name` | `VARCHAR(255)` | `NOT NULL` | Admin full name (trimmed) |
  | `email` | `VARCHAR(255)` | `UNIQUE NOT NULL` | Admin email (lowercase, trimmed) |
  | `password_hash` | `TEXT` | `NOT NULL` | Scrypt password hash |
  | `password_salt` | `TEXT` | `NOT NULL` | Password salt |
  | `session_token` | `TEXT` | `NULL` | Active session token |
  | `data` | `JSONB` | `NOT NULL DEFAULT '{}'::jsonb` | Complete JSON document |
  | `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Record creation timestamp |
  | `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Record last update timestamp |
- **Indexes**:
  - `CREATE UNIQUE INDEX idx_admins_email ON admins(email);`
  - `CREATE INDEX idx_admins_session_token ON admins(session_token);`
  - `CREATE INDEX idx_admins_data_gin ON admins USING GIN (data);`
- **Invoked Methods & Operators**:
  - `Admin.exists({})` (check if initial admin exists)
  - `Admin.create({ name, email, passwordHash, passwordSalt })`
  - `Admin.findOne({ email })`
  - `admin.save()` (save new session token)

---

### 3.2 `customers`
- **Model**: `Customer` (`backend/models/Customer.js`)
- **Table**: `customers`
- **Schema Columns**:
  | Column | PostgreSQL Type | Constraints | Description |
  |--------|-----------------|-------------|-------------|
  | `_id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique ID / MongoDB ObjectId hex |
  | `customer_id` | `VARCHAR(255)` | `UNIQUE NOT NULL` | Customer ID (e.g. `HOK-CUST-1740000000000`) |
  | `name` | `VARCHAR(255)` | `NOT NULL` | Customer name |
  | `email` | `VARCHAR(255)` | `NOT NULL` | Customer email |
  | `phone` | `VARCHAR(100)` | `DEFAULT ''` | Phone number |
  | `location` | `VARCHAR(255)` | `DEFAULT ''` | City / Region / Country |
  | `status` | `VARCHAR(50)` | `DEFAULT 'Active'` | Status: 'Active', 'Suspended' |
  | `source` | `VARCHAR(100)` | `DEFAULT 'Manual - WA'` | Customer acquisition source |
  | `data` | `JSONB` | `NOT NULL DEFAULT '{}'::jsonb` | Complete JSON document |
  | `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Creation timestamp |
  | `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Update timestamp |
- **Document JSON Structure (`data`)**:
  - `customerId`: String (unique)
  - `name`: String
  - `email`: String
  - `phone`: String
  - `location`: String
  - `address`: String
  - `gstin`: String
  - `instagram`: String
  - `birthDate`: String
  - `referrer`: String
  - `status`: String ("Active" | "Suspended")
  - `source`: String ("Manual - WA", etc.)
  - `flagReason`: String
  - `internalNotes`: String
  - `preferences`: Object `{ preferredSize, preferredOccasions, preferredSilhouettes, newsletter, whatsappNotifications, marketingOptIn }`
  - `addresses`: Array of Objects `[{ id, label, address, isDefault }]`
  - `occasions`: Array of Objects `[{ id, occasion, date }]`
  - `communicationLog`: Array of Objects `[{ id, message, channel, timestamp }]`
  - `joinedDate`: String
  - `ordersCount`: Number (default: 0)
  - `totalSpent`: Number (default: 0)
  - `wishlistCount`: Number (default: 0)
  - `lastOrderDate`: String (default: "—")
  - `createdAt`: Date / ISO string
  - `updatedAt`: Date / ISO string
- **Indexes**:
  - `CREATE UNIQUE INDEX idx_customers_customer_id ON customers(customer_id);`
  - `CREATE INDEX idx_customers_email ON customers(email);`
  - `CREATE INDEX idx_customers_phone ON customers(phone);`
  - `CREATE INDEX idx_customers_status ON customers(status);`
  - `CREATE INDEX idx_customers_source ON customers(source);`
  - `CREATE INDEX idx_customers_data_gin ON customers USING GIN (data);`
- **Invoked Methods & Operators**:
  - `Customer.find(query).sort({ createdAt: -1 })` (with `$or` RegExp multi-field search)
  - `Customer.findOne({ $or: [{ customerId: id }, { _id: id }] })`
  - `Customer.findOne({ $or: [{ customerId }, { email }] })`
  - `Customer.create({...})`
  - `Customer.findOneAndUpdate({ $or: [...] }, { $set: req.body }, { new: true, runValidators: true })`
  - `Customer.findOneAndDelete({ $or: [...] })`
  - `customer.addresses.push(...)`, `customer.save()`
  - `customer.occasions.push(...)`, `customer.save()`
  - `customer.communicationLog.unshift(...)`, `customer.save()`

---

### 3.3 `designers`
- **Model**: `Designer` (`backend/models/Designer.js`)
- **Table**: `designers`
- **Schema Columns**:
  | Column | PostgreSQL Type | Constraints | Description |
  |--------|-----------------|-------------|-------------|
  | `_id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique ID / MongoDB ObjectId hex |
  | `designer_id` | `VARCHAR(255)` | `UNIQUE NOT NULL` | Designer ID (e.g. `sabyasachi`, `DES-123`) |
  | `slug` | `VARCHAR(255)` | `UNIQUE NOT NULL` | URL slug (e.g. `sabyasachi`) |
  | `name` | `VARCHAR(255)` | `NOT NULL` | Designer brand name |
  | `type` | `VARCHAR(100)` | `DEFAULT 'Indie Designer'` | Brand type |
  | `status` | `VARCHAR(50)` | `DEFAULT 'Active'` | Status: 'Active', 'Inactive', 'Suspended' |
  | `is_featured` | `BOOLEAN` | `DEFAULT FALSE` | Featured flag |
  | `sort_order` | `INT` | `DEFAULT 99` | Listing sort order |
  | `data` | `JSONB` | `NOT NULL DEFAULT '{}'::jsonb` | Complete JSON document |
  | `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Creation timestamp |
  | `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Update timestamp |
- **Document JSON Structure (`data`)**:
  - `designerId`: String
  - `name`: String
  - `slug`: String
  - `bio`: String
  - `shortBio`: String
  - `type`: String ("Couture House" | "Contemporary Label" | "Heritage Weave" | "Indie Designer" | "Unclassified")
  - `status`: String ("Active" | "Inactive" | "Suspended")
  - `joinedAt`: String (YYYY-MM-DD)
  - `isNewToHOK`: Boolean
  - `isFeatured`: Boolean
  - `featuredOrder`: Number | null
  - `sortOrder`: Number (default: 99)
  - `livePieces`: Number (default: 0)
  - `totalPieces`: Number (default: 0)
  - `counterfeitRiskTier`: String ("High" | "Medium" | "Low")
  - `authenticationChecklist`: String
  - `websiteUrl`: String
  - `instagramHandle`: String
  - `commercialTerms`: Object `{ suppliesFreshStockBuyNow, commissionRateBuyNow, paymentTerms, brandFulfilmentPolicy, accountManagerName, contactEmail, contactPhone, internalNotes }`
  - `createdAt`: Date / ISO string
  - `updatedAt`: Date / ISO string
- **Indexes**:
  - `CREATE UNIQUE INDEX idx_designers_designer_id ON designers(designer_id);`
  - `CREATE UNIQUE INDEX idx_designers_slug ON designers(slug);`
  - `CREATE INDEX idx_designers_name ON designers(name);`
  - `CREATE INDEX idx_designers_status ON designers(status);`
  - `CREATE INDEX idx_designers_type ON designers(type);`
  - `CREATE INDEX idx_designers_data_gin ON designers USING GIN (data);`
- **Invoked Methods & Operators**:
  - `Designer.countDocuments()`
  - `Designer.insertMany(initialDesigners)` (Auto-seed initial designers)
  - `Designer.find(query).sort({ createdAt: -1 })` (with status, type, regex search)
  - `Designer.findOne({ $or: [{ designerId: id }, { slug: id }, { _id: id }] })`
  - `Designer.findOne({ $or: [{ designerId }, { slug: generatedSlug }] })`
  - `Designer.create({...})`
  - `designer.save()`
  - `Designer.findOneAndDelete({ $or: [{ designerId: id }, { slug: id }, { _id: id }] })`

---

### 3.4 `listers`
- **Model**: `Lister` (`backend/models/Lister.js`, `strict: false`)
- **Table**: `listers`
- **Schema Columns**:
  | Column | PostgreSQL Type | Constraints | Description |
  |--------|-----------------|-------------|-------------|
  | `_id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique ID / MongoDB ObjectId hex |
  | `lister_id` | `VARCHAR(255)` | `UNIQUE NOT NULL` | Lister ID (e.g. `priya-sharma`) |
  | `name` | `VARCHAR(255)` | `NOT NULL` | Lister full name |
  | `email` | `VARCHAR(255)` | `NULL` | Lister email (lowercase) |
  | `phone` | `VARCHAR(100)` | `NULL` | Contact phone |
  | `city` | `VARCHAR(100)` | `NULL` | Location city |
  | `status` | `VARCHAR(50)` | `DEFAULT 'Verified'` | Lister status |
  | `data` | `JSONB` | `NOT NULL DEFAULT '{}'::jsonb` | Complete JSON document |
  | `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Creation timestamp |
  | `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Update timestamp |
- **Document JSON Structure (`data`)**:
  - `listerId`: String
  - `name`: String
  - `initials`: String
  - `email`: String
  - `phone`: String
  - `city`: String
  - `location`: String
  - `status`: String ("Verified", etc.)
  - `statusReason`: String
  - `source`: String
  - `referral`: String
  - `insta`: String
  - `joined`: String
  - `verified`: Boolean
  - `address`: Mixed (Object / String)
  - `pickup`: Mixed
  - `pickupPrefs`: String
  - `bank`: Mixed
  - `bankDetails`: Object `{ accountHolder, accountNumber, ifsc, bankName }`
  - `payoutPercentages`: Mixed
  - `gstReg`: Boolean
  - `gstin`: String
  - `pan`: String
  - `panVerified`: Boolean
  - `terms`: Mixed
  - `notes`: String
  - `internalNotes`: String
  - `createdAt`: Date / ISO string
  - `updatedAt`: Date / ISO string
- **Indexes**:
  - `CREATE UNIQUE INDEX idx_listers_lister_id ON listers(lister_id);`
  - `CREATE INDEX idx_listers_email ON listers(email);`
  - `CREATE INDEX idx_listers_phone ON listers(phone);`
  - `CREATE INDEX idx_listers_status ON listers(status);`
  - `CREATE INDEX idx_listers_city ON listers(city);`
  - `CREATE INDEX idx_listers_data_gin ON listers USING GIN (data);`
- **Invoked Methods & Operators**:
  - `Lister.find(q).sort({ createdAt: -1 })`
  - `Lister.findOne({ $or: [{ listerId: id }, { id: id }, { _id: id }] })`
  - `Lister.create(payload)`
  - `Lister.findOneAndUpdate({ $or: ... }, { $set: req.body }, { new: true })`
  - `Lister.findOneAndUpdate({ $or: ... }, { bankDetails: ... }, { new: true })`
  - `Lister.findOneAndDelete({ $or: ... })`

---

### 3.5 `offers`
- **Model**: `Offer` (`backend/models/Offer.js`)
- **Table**: `offers`
- **Schema Columns**:
  | Column | PostgreSQL Type | Constraints | Description |
  |--------|-----------------|-------------|-------------|
  | `_id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique ID / MongoDB ObjectId hex |
  | `offer_id` | `VARCHAR(255)` | `UNIQUE NOT NULL` | Offer ID (e.g. `OFF-1740000000000`) |
  | `enquiry_id` | `VARCHAR(255)` | `NULL` | Associated enquiry ID |
  | `product_id` | `VARCHAR(255)` | `NULL` | Product ID |
  | `customer_name` | `VARCHAR(255)` | `NULL` | Customer name |
  | `customer_email` | `VARCHAR(255)` | `NULL` | Customer email |
  | `customer_phone` | `VARCHAR(100)` | `NULL` | Customer phone |
  | `status` | `VARCHAR(50)` | `DEFAULT 'Pending'` | Offer status |
  | `is_deleted` | `BOOLEAN` | `DEFAULT FALSE` | Soft delete flag |
  | `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Active flag |
  | `data` | `JSONB` | `NOT NULL DEFAULT '{}'::jsonb` | Complete JSON document |
  | `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Creation timestamp |
  | `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Update timestamp |
- **Document JSON Structure (`data`)**:
  - `offerId`: String
  - `enquiryId`: String
  - `productId`: String
  - `productName`: String
  - `productImage`: String
  - `category`: String
  - `customerName`: String
  - `customerEmail`: String
  - `customerPhone`: String
  - `customerCity`: String
  - `customerState`: String
  - `quantity`: Number
  - `currency`: String ("INR")
  - `originalAmount`: Number
  - `offeredAmount`: Number
  - `discount`: Number
  - `finalAmount`: Number
  - `status`: String ("Pending" | "Accepted" | "Rejected" | "Counter Offered" | "Expired" | "Assigned" | "Completed")
  - `negotiationStatus`: String ("Not Started" | "In Progress" | "Completed")
  - `assignedTo`: String
  - `assignedBy`: String
  - `assignedAt`: Date
  - `assignmentHistory`: Array of Objects `[{ assignedTo, assignedBy, assignedAt, remarks }]`
  - `expiresAt`: Date
  - `whatsappSent`: Boolean
  - `emailSent`: Boolean
  - `notes`: Array of Objects `[{ message, createdBy, createdAt }]`
  - `counterOffers`: Array of Objects `[{ amount, discount, message, sentBy, expiryDate, sentAt }]`
  - `timeline`: Array of Objects `[{ action, remarks, user, createdAt }]`
  - `createdBy`: String
  - `updatedBy`: String
  - `deletedBy`: String
  - `deletedAt`: Date
  - `isDeleted`: Boolean
  - `isActive`: Boolean
  - `createdAt`: Date / ISO string
  - `updatedAt`: Date / ISO string
- **Indexes**:
  - `CREATE UNIQUE INDEX idx_offers_offer_id ON offers(offer_id);`
  - `CREATE INDEX idx_offers_status ON offers(status);`
  - `CREATE INDEX idx_offers_is_deleted ON offers(is_deleted);`
  - `CREATE INDEX idx_offers_product_id ON offers(product_id);`
  - `CREATE INDEX idx_offers_customer_email ON offers(customer_email);`
  - `CREATE INDEX idx_offers_data_gin ON offers USING GIN (data);`
- **Invoked Methods & Operators**:
  - `Offer.create({...})`
  - `Offer.find(filter).sort(...).skip(...).limit(...)`
  - `Offer.countDocuments(filter)`
  - `Offer.findById(id)`
  - `Offer.findById(id).select(...)`
  - `Offer.findByIdAndDelete(id)`
  - `Offer.updateMany({ _id: { $in: ids }, isDeleted: false }, { $set: { ... } })`
  - `Offer.deleteMany({ _id: { $in: ids } })`
  - `Offer.aggregate([...])` (Monthly revenue, status breakdowns, total revenue)
  - `Offer.find({ isDeleted: false }).lean()`
  - `offer.save()`

---

### 3.6 `orders`
- **Model**: `Order` (`backend/models/Order.js`, `strict: false`)
- **Table**: `orders`
- **Schema Columns**:
  | Column | PostgreSQL Type | Constraints | Description |
  |--------|-----------------|-------------|-------------|
  | `_id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique ID / MongoDB ObjectId hex |
  | `order_id` | `VARCHAR(255)` | `UNIQUE NOT NULL` | Order ID (e.g. `HOK-ORD-1740000000000`) |
  | `customer_id` | `VARCHAR(255)` | `NULL` | Associated customer ID |
  | `customer_name` | `VARCHAR(255)` | `NULL` | Customer name |
  | `customer_email` | `VARCHAR(255)` | `NULL` | Customer email |
  | `mode` | `VARCHAR(100)` | `NULL` | Order mode (Rental, Preloved, Buy) |
  | `status` | `VARCHAR(50)` | `DEFAULT 'Confirmed'` | Order workflow status |
  | `deposit_status` | `VARCHAR(50)` | `DEFAULT 'Pending'` | Deposit status |
  | `payout_status` | `VARCHAR(50)` | `DEFAULT 'Pending Approval'` | Lister payout status |
  | `data` | `JSONB` | `NOT NULL DEFAULT '{}'::jsonb` | Complete JSON document |
  | `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Creation timestamp |
  | `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Update timestamp |
- **Document JSON Structure (`data`)**:
  - `orderId`: String
  - `customerId`: String
  - `customerName`: String
  - `customerEmail`: String
  - `customerPhone`: String
  - `customerCity`: String
  - `customerState`: String
  - `gstin`: String
  - `address`: String
  - `items`: Array of Objects:
    - `productId`: String
    - `productName`: String
    - `designer`: String
    - `mode`: String ("Rental" | "Preloved" | "Buy" | "Multi-item")
    - `size`: String
    - `rentalStartDate`: String
    - `rentalEndDate`: String
    - `dispatchDate`: String
    - `returnDueDate`: String
    - `amount`: Number
    - `deposit`: Number
    - `gst`: Number
    - `quantity`: Number
    - `status`: String
    - `preDispatch`: Object `{ documented, documentedBy, photos: [], videoUrl }`
    - `dispatch`: Object `{ date, courierPartner, trackingNumber, deliveryAddress, status }`
    - `returnCondition`: Object `{ receivedDate, dueDate, grade ("A"|"B"|"C"|"D"), assessedBy, notes, photos: [], videoUrl }`
    - `depositDecision`: Object `{ status ("Pending"|"Released"|"Partial"|"Forfeited"), totalDeposit, deductedAmount, releasedAmount, reason, releaseNote, processedAt }`
  - `mode`: String
  - `status`: String ("Confirmed", "Packed", "Dispatched", "Shipped", "Delivered", "Return Due", "Return Sent", "Returned", "Complete", "Partially Returned", "Processing")
  - `orderValue`: Number
  - `depositHeld`: Number
  - `depositStatus`: String ("Pending", "Released", "Partially Released", "Forfeited")
  - `grandTotal`: Number
  - `discount`: Number
  - `gst`: Number
  - `listerPayout`: Number
  - `payoutStatus`: String ("Pending Approval", "Approved", "Paid")
  - `invoiceNo`: String
  - `invoiceDate`: String
  - `logs`: Array of Objects `[{ message, type, user, createdAt }]`
  - `internalNotes`: String
  - `createdAt`: Date / ISO string
  - `updatedAt`: Date / ISO string
- **Indexes**:
  - `CREATE UNIQUE INDEX idx_orders_order_id ON orders(order_id);`
  - `CREATE INDEX idx_orders_customer_id ON orders(customer_id);`
  - `CREATE INDEX idx_orders_status ON orders(status);`
  - `CREATE INDEX idx_orders_deposit_status ON orders(deposit_status);`
  - `CREATE INDEX idx_orders_payout_status ON orders(payout_status);`
  - `CREATE INDEX idx_orders_data_gin ON orders USING GIN (data);`
- **Invoked Methods & Operators**:
  - `Order.find(query).sort({ createdAt: -1 })` (with status, mode)
  - `Order.findOne({ $or: [{ orderId: id }, { _id: id }] })`
  - `Order.create({...})`
  - `Order.findOneAndUpdate({ $or: [{ orderId: id }, { _id: id }] }, { $set: req.body }, { new: true, runValidators: true })`
  - `Order.findOneAndUpdate({ orderId: id }, { $push: { logs: ... } }, { new: true })`
  - `order.save()`

---

### 3.7 `payouts`
- **Model**: `Payout` (`backend/models/Payout.js`)
- **Table**: `payouts`
- **Schema Columns**:
  | Column | PostgreSQL Type | Constraints | Description |
  |--------|-----------------|-------------|-------------|
  | `_id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique ID / MongoDB ObjectId hex |
  | `payout_id` | `VARCHAR(255)` | `UNIQUE NOT NULL` | Payout ID (e.g. `PAY-HOK-ORD-1-PRD-1`) |
  | `order_id` | `VARCHAR(255)` | `NOT NULL` | Associated Order ID |
  | `lister_id` | `VARCHAR(255)` | `NOT NULL` | Associated Lister ID |
  | `product_id` | `VARCHAR(255)` | `NULL` | Associated Product ID |
  | `product_name` | `VARCHAR(255)` | `NULL` | Product Name |
  | `status` | `VARCHAR(50)` | `DEFAULT 'Pending'` | Payout status ("Pending", "Paid", "Failed", "Reversed") |
  | `due_date` | `TIMESTAMPTZ` | `NOT NULL` | Payout Due Date |
  | `data` | `JSONB` | `NOT NULL DEFAULT '{}'::jsonb` | Complete JSON document |
  | `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Creation timestamp |
  | `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Update timestamp |
- **Document JSON Structure (`data`)**:
  - `payoutId`: String
  - `productId`: String
  - `listerId`: String
  - `listerName`: String
  - `orderId`: String
  - `productName`: String
  - `mode`: String
  - `transactionAmount`: Number
  - `payoutPercentage`: Number (default: 80)
  - `listerShare`: Number
  - `hokCommission`: Number
  - `taxDeduction`: Number
  - `netPayout`: Number
  - `dueDate`: Date
  - `status`: String ("Pending" | "Paid" | "Failed" | "Reversed")
  - `paidAt`: Date
  - `paidBy`: String
  - `paymentReference`: String
  - `notes`: String
  - `createdAt`: Date / ISO string
  - `updatedAt`: Date / ISO string
- **Indexes**:
  - `CREATE UNIQUE INDEX idx_payouts_payout_id ON payouts(payout_id);`
  - `CREATE INDEX idx_payouts_lister_status ON payouts(lister_id, status);`
  - `CREATE INDEX idx_payouts_order_id ON payouts(order_id);`
  - `CREATE INDEX idx_payouts_product_id ON payouts(product_id);`
  - `CREATE INDEX idx_payouts_due_date ON payouts(due_date);`
  - `CREATE INDEX idx_payouts_data_gin ON payouts USING GIN (data);`
- **Invoked Methods & Operators**:
  - `Payout.find(query).sort({ dueDate: 1, createdAt: -1 }).exec()` (with `status`, `listerId`, `productId`, `dueDate.$gte`, `dueDate.$lte`)
  - `Payout.aggregate([{ $match: { status: "Pending" } }, { $group: { _id: null, total: { $sum: "$listerShare" } } }])`
  - `Payout.aggregate([{ $match: { status: "Paid" } }, { $group: { _id: null, total: { $sum: "$listerShare" } } }])`
  - `Payout.findOne({ $or: [{ payoutId: id }, { _id: id }] })`
  - `Payout.findOne({ orderId, productId })`
  - `Payout.findOneAndUpdate({ $or: ... }, { status, notes, updatedBy }, { new: true })`
  - `Payout.findOneAndUpdate({ $or: ... }, { status: "Paid", paidAt, ... }, { new: true })`
  - `Payout.create({...})`
  - `payout.save()`

---

### 3.8 `products`
- **Model**: `Product` (`backend/models/Product.js`, `strict: false`)
- **Table**: `products`
- **Schema Columns**:
  | Column | PostgreSQL Type | Constraints | Description |
  |--------|-----------------|-------------|-------------|
  | `_id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique ID / MongoDB ObjectId hex |
  | `product_id` | `VARCHAR(255)` | `UNIQUE NOT NULL` | Product ID (e.g. `HOK-PRD-1740000000000`) |
  | `name` | `VARCHAR(255)` | `NOT NULL` | Product title |
  | `designer` | `VARCHAR(255)` | `NULL` | Designer brand name |
  | `category` | `VARCHAR(100)` | `NULL` | Category (e.g. Lehengas, Sarees) |
  | `status` | `VARCHAR(50)` | `DEFAULT 'Draft'` | Product status (Live, Draft, Review, Archived) |
  | `availability` | `VARCHAR(100)` | `DEFAULT 'Available Now'` | Availability state |
  | `lister_id` | `VARCHAR(255)` | `NULL` | Lister ID |
  | `data` | `JSONB` | `NOT NULL DEFAULT '{}'::jsonb` | Complete JSON document |
  | `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Creation timestamp |
  | `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Update timestamp |
- **Document JSON Structure (`data`)**:
  - `productId`: String
  - `name`: String
  - `designer`: String
  - `subtitle`: String
  - `description`: String
  - `story`: String
  - `category`: String
  - `occasion`: String
  - `material`: String
  - `color`: String
  - `craft`: String
  - `technique`: String
  - `embellishments`: String
  - `threadYarnDetail`: String
  - `threadWork`: String
  - `setIncludes`: String
  - `origin`: String
  - `sizes`: Array of Strings `["XS", "S", "M", "L", "XL"]`
  - `sizeGuide`: String
  - `measurements`: Object `{ bust, waist, hips, length }`
  - `measurementsCm`: Object `{ bust, waist, hips, length }`
  - `bestSuitedForHeight`: String
  - `weight`: String
  - `listingModes`: Array of Strings (default: `["RENTAL"]`)
  - `availability`: String ("Available Now", etc.)
  - `status`: String ("Draft", "Live", "Review", "Archived")
  - `condition`: String
  - `honestDisclosure`: String
  - `rentalPrice`: Number
  - `securityDeposit`: Number
  - `listingPrice`: Number
  - `commissionRate`: Number
  - `minimumDurationDays`: Number
  - `extensionWindowDays`: Number
  - `cleaningBufferDays`: Number
  - `preRentalBufferDays`: Number (default: 2)
  - `postRentalBufferDays`: Number (default: 3)
  - `deliveryTiming`: String
  - `taxRate`: Number
  - `gstRate`: Number
  - `cleaningFee`: Number
  - `extensionPrice`: Number
  - `listerId`: String
  - `listerName`: String
  - `payoutPercentage`: Number
  - `payoutTerms`: String
  - `rating`: Number
  - `reviewCount`: Number
  - `timesRented`: Number (default: 0)
  - `images`: Array of Strings
  - `seoTitle`: String
  - `seoDescription`: String
  - `urlSlug`: String
  - `tags`: Array of Strings
  - `relatedProductIds`: Array of Strings
  - `blockedDates`: Array of Objects `[{ from, to, reason }]`
  - `bookingHistory`: Array of Objects `[{ orderId, customerName, date, startDate, endDate, amount, deposit, mode, status, source, whatsappNumber, city, channel, listerSplitPercent, splitNote, depositStatus }]`
  - `externalBookings`: Array of Objects
  - `sku`: String
  - `activityLog`: Array of Objects `[{ action, user, createdAt, remarks }]`
  - `createdAt`: Date / ISO string
  - `updatedAt`: Date / ISO string
- **Indexes**:
  - `CREATE UNIQUE INDEX idx_products_product_id ON products(product_id);`
  - `CREATE INDEX idx_products_name ON products(name);`
  - `CREATE INDEX idx_products_designer ON products(designer);`
  - `CREATE INDEX idx_products_category ON products(category);`
  - `CREATE INDEX idx_products_status ON products(status);`
  - `CREATE INDEX idx_products_availability ON products(availability);`
  - `CREATE INDEX idx_products_lister_id ON products(lister_id);`
  - `CREATE INDEX idx_products_data_gin ON products USING GIN (data);`
- **Invoked Methods & Operators**:
  - `Product.find(filter).sort({ createdAt: -1 })`
  - `Product.findOne(productFilter(id))`
  - `Product.create(value)`
  - `Product.findByIdAndUpdate(id, value, { new: true, runValidators: true })`
  - `Product.findOneAndDelete(productFilter(id))`
  - `Product.findOneAndUpdate(productFilter(id), { status, $push: { activityLog: ... } }, { new: true })`
  - `Product.findOneAndUpdate(productFilter(id), { $inc: { timesRented: 1 }, $push: { activityLog: ... } }, { new: true })`
  - `Product.findOneAndUpdate(productFilter(id), { listingModes, $push: { activityLog: ... } }, { new: true })`
  - `Product.findOneAndUpdate(productFilter(id), { ...updateData, $push: { activityLog: ... } }, { new: true })`
  - `Product.findOneAndUpdate({ _id, status: "Live", availability: "Available Now", bookingHistory: { $not: { $elemMatch: ... } } }, { $push: ... }, { new: true })`
  - `Product.countDocuments({ productId: { $in: ids } })`
  - `product.save()`

---

## 4. Mongoose-Compatible JSONB Adapter Specifications

### 4.1 Mongoose API Method Mapping
| Mongoose Method | Adapter Implementation | PostgreSQL Translation |
|-----------------|------------------------|------------------------|
| `Model.find(query)` | Returns `PostgresQuery` instance supporting chaining | `SELECT * FROM table WHERE <query>` |
| `Model.findOne(query)` | Returns `PostgresQuery` resolving to single document | `SELECT * FROM table WHERE <query> LIMIT 1` |
| `Model.findById(id)` | Translates to `findOne({ _id: id })` or `{ $or: [{ _id: id }, { [entityId]: id }] }` | `SELECT * FROM table WHERE _id = $1 LIMIT 1` |
| `Model.create(docOrDocs)` | Instantiates and persists `PostgresDocument` | `INSERT INTO table (_id, ..., data, created_at, updated_at) VALUES (...) RETURNING *` |
| `Model.insertMany(docs)` | Bulk insert | Multi-value `INSERT INTO table (...) VALUES (...), (...) RETURNING *` |
| `Model.findOneAndUpdate(query, update, options)` | Evaluates query, applies update, returns doc | Atomic `UPDATE table SET data = ..., updated_at = NOW() WHERE ... RETURNING *` |
| `Model.findByIdAndUpdate(id, update, options)` | Shortcut for `findOneAndUpdate({ _id: id }, ...)` | `UPDATE table SET ... WHERE _id = $1 RETURNING *` |
| `Model.findOneAndDelete(query)` | Finds and deletes matching row, returns doc | `DELETE FROM table WHERE ... RETURNING *` |
| `Model.findByIdAndDelete(id)` | Shortcut for `findOneAndDelete({ _id: id })` | `DELETE FROM table WHERE _id = $1 RETURNING *` |
| `Model.updateOne(query, update, options)` | Executes update on 1 row | `UPDATE table ... WHERE _id IN (SELECT _id FROM table WHERE ... LIMIT 1)` |
| `Model.updateMany(query, update, options)` | Executes update on all matching rows | `UPDATE table SET ... WHERE <query>` |
| `Model.deleteOne(query)` | Deletes 1 matching row | `DELETE FROM table WHERE _id IN (SELECT _id FROM table WHERE ... LIMIT 1)` |
| `Model.deleteMany(query)` | Deletes all matching rows | `DELETE FROM table WHERE <query>` |
| `Model.countDocuments(query)` | Counts matching rows | `SELECT COUNT(*)::int AS count FROM table WHERE <query>` |
| `Model.exists(query)` | Checks if matching row exists | `SELECT _id FROM table WHERE <query> LIMIT 1` -> returns `{ _id }` or `null` |
| `Model.aggregate(pipeline)` | Executes aggregation pipeline | Pipeline stage evaluator in SQL (`$match`, `$group`, `$sum`, `$year`, `$month`, `$sort`) or JS fallback |
| `Model.distinct(field, query)` | Returns array of distinct values | `SELECT DISTINCT data->>field FROM table WHERE <query>` |

---

### 4.2 Query Filter Translation Matrix
| MongoDB Operator | Example Mongoose Filter | PostgreSQL WHERE Clause |
|------------------|-------------------------|--------------------------|
| Plain equality | `{ status: "Pending" }` | `(data->>'status' = $1)` |
| Relational / PK equality | `{ _id: "67..." }` | `(_id = $1)` |
| `$or` | `{ $or: [{ productId: id }, { _id: id }] }` | `( (data->>'productId' = $1) OR (_id = $1) )` |
| `$and` | `{ $and: [{ isDeleted: false }, { status: "Accepted" }] }` | `( (COALESCE((data->>'isDeleted')::boolean, false) = false) AND (data->>'status' = $1) )` |
| `$in` | `{ _id: { $in: ['id1', 'id2'] } }` | `_id = ANY($1::text[])` |
| `$nin` | `{ status: { $nin: ['Cancelled', 'Rejected'] } }` | `NOT (data->>'status' = ANY($1::text[]))` |
| `$ne` | `{ status: { $ne: "Deleted" } }` | `(data->>'status' IS NULL OR data->>'status' != $1)` |
| `$gt` / `$gte` | `{ dueDate: { $gte: new Date() } }` | `(data->>'dueDate')::timestamptz >= $1` |
| `$lt` / `$lte` | `{ dueDate: { $lte: new Date() } }` | `(data->>'dueDate')::timestamptz <= $1` |
| `$regex` / RegExp | `{ name: new RegExp("sabyasachi", "i") }` | `(data->>'name' ~* $1)` |
| Multi-field search | `{ $or: [{ name: regex }, { email: regex }] }` | `( (data->>'name' ~* $1) OR (data->>'email' ~* $1) )` |
| `$elemMatch` | `{ bookingHistory: { $elemMatch: { startDate: { $lte: occupiedEnd } } } }` | `EXISTS (SELECT 1 FROM jsonb_array_elements(data->'bookingHistory') AS b WHERE (b->>'startDate')::text <= $1)` |
| `$not` | `{ bookingHistory: { $not: { $elemMatch: ... } } }` | `NOT EXISTS (SELECT 1 FROM jsonb_array_elements(data->'bookingHistory') AS b WHERE ...)` |
| Dot-notation | `{ "preferences.newsletter": true }` | `(data#>>'{preferences,newsletter}')::boolean = $1` |

---

### 4.3 Update Operator Translation Matrix
| MongoDB Operator | Example Mongoose Update | PostgreSQL / JS JSONB Logic |
|------------------|-------------------------|-----------------------------|
| `$set` (Top-level & Nested) | `{ $set: { status: "Paid", "bankDetails.ifsc": "HDFC0001" } }` | Deep merges `$set` keys into document object: `data = deepMerge(data, setObj)` |
| `$unset` | `{ $unset: { sessionToken: "" } }` | Deletes specified keys from document object / JSONB |
| `$push` (Single item) | `{ $push: { logs: { message: "Created" } } }` | Appends element to array: `data[field] = [...(data[field] || []), item]` |
| `$push` (Multiple arrays) | `{ $push: { bookingHistory: b, activityLog: a } }` | Appends elements to respective arrays in single atomic update |
| `$pull` | `{ $pull: { tags: "sale" } }` | Filters out elements matching value or predicate from JSONB array |
| `$inc` | `{ $inc: { timesRented: 1, ordersCount: 1 } }` | Increments numeric property: `data[field] = (Number(data[field]) || 0) + amount` |
| `$addToSet` | `{ $addToSet: { tags: "bridal" } }` | Appends value to array only if not already present |

---

### 4.4 Instance Methods & Properties (`PostgresDocument`)
Every document returned from `findOne`, `find`, `create`, `save`, `findOneAndUpdate` conforms to `PostgresDocument`:
1. **Direct Property Access & Mutation**:
   - `doc.status = "Paid"`
   - `doc.timeline.push({ action: "Status Updated" })`
   - `doc.addresses.push({ address: "Mumbai" })`
   - `doc.communicationLog.unshift({ message: "WhatsApp message" })`
2. **`doc.save()` Method**:
   - Serializes current instance state into JSON.
   - Syncs extracted top-level columns (`customer_id`, `status`, `updated_at`, etc.).
   - Executes parameterized `UPDATE table SET data = $1, status = $2, updated_at = NOW() WHERE _id = $3 RETURNING *`.
   - Updates instance with persisted values and returns `doc`.
3. **`doc.toObject()` & `doc.toJSON()`**:
   - Returns a clean plain JavaScript object containing all document fields, plus `id: obj.orderId || obj._id.toString()`.
4. **Subdocument Compatibility**:
   - Subdocuments and items support `.toObject?.()` safely (e.g. `item.dispatch?.toObject?.()`).

---

### 4.5 Query Chaining (`PostgresQuery`)
Every query returned from `Model.find()` / `Model.findOne()` implements fluent chaining:
- `.sort(sortObj)`: Translates `{ createdAt: -1 }`, `{ dueDate: 1, createdAt: -1 }`, `"-createdAt"`.
- `.skip(offset)`: Adds SQL `OFFSET <offset>`.
- `.limit(limit)`: Adds SQL `LIMIT <limit>`.
- `.select(fields)`: Projects requested fields (`"offerId customerName notes"`, `"-passwordHash"`).
- `.lean()`: Returns plain JavaScript objects rather than `PostgresDocument` instances.
- `.exec()`: Executes query and returns Promise.
- `.then(onFulfilled, onRejected)` / `.catch(onRejected)`: Thenable contract allowing direct `await Model.find(...)`.

---

### 4.6 Aggregation Pipeline Support
The adapter handles the exact aggregation pipelines present in the codebase:
1. **Payout Totals by Status** (`payoutController.js`):
   - Pipeline: `[{ $match: { status: "Pending" } }, { $group: { _id: null, total: { $sum: "$listerShare" } } }]`
   - SQL:
     ```sql
     SELECT COALESCE(SUM((data->>'listerShare')::numeric), 0) AS total 
     FROM payouts 
     WHERE (data->>'status' = 'Pending' OR status = 'Pending');
     ```
2. **Offer Monthly Revenue & Count** (`offerController.js`):
   - Pipeline: `[{ $match: { isDeleted: false } }, { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, totalOffers: { $sum: 1 }, totalRevenue: { $sum: "$finalAmount" } } }, { $sort: { "_id.year": 1, "_id.month": 1 } }]`
   - SQL:
     ```sql
     SELECT 
       jsonb_build_object(
         'year', EXTRACT(YEAR FROM created_at)::int,
         'month', EXTRACT(MONTH FROM created_at)::int
       ) AS _id,
       COUNT(*)::int AS "totalOffers",
       COALESCE(SUM((data->>'finalAmount')::numeric), 0) AS "totalRevenue"
     FROM offers
     WHERE (COALESCE((data->>'isDeleted')::boolean, is_deleted, false) = false)
     GROUP BY EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)
     ORDER BY EXTRACT(YEAR FROM created_at) ASC, EXTRACT(MONTH FROM created_at) ASC;
     ```
3. **Offer Status Count** (`offerController.js`):
   - Pipeline: `[{ $match: { isDeleted: false } }, { $group: { _id: "$status", total: { $sum: 1 } } }]`
   - SQL:
     ```sql
     SELECT 
       data->>'status' AS _id,
       COUNT(*)::int AS total
     FROM offers
     WHERE (COALESCE((data->>'isDeleted')::boolean, is_deleted, false) = false)
     GROUP BY data->>'status';
     ```
4. **Offer Total Accepted Revenue** (`offerController.js`):
   - Pipeline: `[{ $match: { isDeleted: false, status: "Accepted" } }, { $group: { _id: null, revenue: { $sum: "$finalAmount" } } }]`
   - SQL:
     ```sql
     SELECT COALESCE(SUM((data->>'finalAmount')::numeric), 0) AS revenue
     FROM offers
     WHERE (COALESCE((data->>'isDeleted')::boolean, is_deleted, false) = false)
       AND (data->>'status' = 'Accepted' OR status = 'Accepted');
     ```

---

## 5. Migration & Table Initialization Scripts (DDL)

The database initialization script must execute on application startup (or via migration runner) to ensure all 8 tables and indexes exist on Supabase PostgreSQL:

```sql
-- =========================================================
-- HOK Admin Panel - Supabase PostgreSQL Schema Initialization
-- =========================================================

-- 1. Admins Table
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
CREATE UNIQUE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_session_token ON admins(session_token);
CREATE INDEX IF NOT EXISTS idx_admins_data_gin ON admins USING GIN (data);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS customers (
  _id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(100),
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Active',
  source VARCHAR(100) DEFAULT 'Manual - WA',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_customer_id ON customers(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_source ON customers(source);
CREATE INDEX IF NOT EXISTS idx_customers_data_gin ON customers USING GIN (data);

-- 3. Designers Table
CREATE TABLE IF NOT EXISTS designers (
  _id VARCHAR(64) PRIMARY KEY,
  designer_id VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) DEFAULT 'Indie Designer',
  status VARCHAR(50) DEFAULT 'Active',
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 99,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_designers_designer_id ON designers(designer_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_designers_slug ON designers(slug);
CREATE INDEX IF NOT EXISTS idx_designers_name ON designers(name);
CREATE INDEX IF NOT EXISTS idx_designers_status ON designers(status);
CREATE INDEX IF NOT EXISTS idx_designers_type ON designers(type);
CREATE INDEX IF NOT EXISTS idx_designers_data_gin ON designers USING GIN (data);

-- 4. Listers Table
CREATE TABLE IF NOT EXISTS listers (
  _id VARCHAR(64) PRIMARY KEY,
  lister_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(100),
  city VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Verified',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_listers_lister_id ON listers(lister_id);
CREATE INDEX IF NOT EXISTS idx_listers_email ON listers(email);
CREATE INDEX IF NOT EXISTS idx_listers_phone ON listers(phone);
CREATE INDEX IF NOT EXISTS idx_listers_status ON listers(status);
CREATE INDEX IF NOT EXISTS idx_listers_city ON listers(city);
CREATE INDEX IF NOT EXISTS idx_listers_data_gin ON listers USING GIN (data);

-- 5. Offers Table
CREATE TABLE IF NOT EXISTS offers (
  _id VARCHAR(64) PRIMARY KEY,
  offer_id VARCHAR(255) UNIQUE NOT NULL,
  enquiry_id VARCHAR(255),
  product_id VARCHAR(255),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Pending',
  is_deleted BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_offers_offer_id ON offers(offer_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_is_deleted ON offers(is_deleted);
CREATE INDEX IF NOT EXISTS idx_offers_product_id ON offers(product_id);
CREATE INDEX IF NOT EXISTS idx_offers_customer_email ON offers(customer_email);
CREATE INDEX IF NOT EXISTS idx_offers_data_gin ON offers USING GIN (data);

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  _id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(255) UNIQUE NOT NULL,
  customer_id VARCHAR(255),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  mode VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Confirmed',
  deposit_status VARCHAR(50) DEFAULT 'Pending',
  payout_status VARCHAR(50) DEFAULT 'Pending Approval',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_deposit_status ON orders(deposit_status);
CREATE INDEX IF NOT EXISTS idx_orders_payout_status ON orders(payout_status);
CREATE INDEX IF NOT EXISTS idx_orders_data_gin ON orders USING GIN (data);

-- 7. Payouts Table
CREATE TABLE IF NOT EXISTS payouts (
  _id VARCHAR(64) PRIMARY KEY,
  payout_id VARCHAR(255) UNIQUE NOT NULL,
  order_id VARCHAR(255) NOT NULL,
  lister_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255),
  product_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Pending',
  due_date TIMESTAMPTZ NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payouts_payout_id ON payouts(payout_id);
CREATE INDEX IF NOT EXISTS idx_payouts_lister_status ON payouts(lister_id, status);
CREATE INDEX IF NOT EXISTS idx_payouts_order_id ON payouts(order_id);
CREATE INDEX IF NOT EXISTS idx_payouts_product_id ON payouts(product_id);
CREATE INDEX IF NOT EXISTS idx_payouts_due_date ON payouts(due_date);
CREATE INDEX IF NOT EXISTS idx_payouts_data_gin ON payouts USING GIN (data);

-- 8. Products Table
CREATE TABLE IF NOT EXISTS products (
  _id VARCHAR(64) PRIMARY KEY,
  product_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  designer VARCHAR(255),
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Draft',
  availability VARCHAR(100) DEFAULT 'Available Now',
  lister_id VARCHAR(255),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_product_id ON products(product_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_designer ON products(designer);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_availability ON products(availability);
CREATE INDEX IF NOT EXISTS idx_products_lister_id ON products(lister_id);
CREATE INDEX IF NOT EXISTS idx_products_data_gin ON products USING GIN (data);
```

---

## 6. Discovered Features & Inventory Table

## Features Discovered
| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | DB Schema | 8 Core Tables | Tables for admins, customers, designers, listers, offers, orders, payouts, products | SQL DDL scripts | Table creations in PostgreSQL | `IF NOT EXISTS` avoids duplicate errors | ORIGINAL_REQUEST.md & `backend/models/*.js` |
| 2 | DB Schema | Hybrid JSONB + Column Pattern | Stores document in `data` JSONB while extracting natural IDs to indexed columns | Document Objects | Relational rows + JSONB storage | Unmapped fields gracefully stored in JSONB | ORIGINAL_REQUEST.md & Model schemas |
| 3 | DB Schema | GIN & B-Tree Indexing | Fast JSONB searches via GIN index and fast primary/filter lookups via B-tree | Column names & expressions | PostgreSQL Index creation | Index already exists ignored | Database performance analysis |
| 4 | Mongoose Adapter | Model CRUD Methods | `find`, `findOne`, `findById`, `create`, `save`, `updateOne`, `updateMany`, `deleteOne`, `deleteMany` | Filter objects, document payloads | Document / Query instances | Returns 404/422/500 errors as per controllers | `backend/controllers/*.js` |
| 5 | Mongoose Adapter | Atomic FindAndModify | `findOneAndUpdate`, `findByIdAndUpdate`, `findOneAndDelete`, `findByIdAndDelete` | Query, Update payload, Options (`{ new: true }`) | Updated/Deleted document | Returns null if not found | `backend/controllers/*.js` |
| 6 | Mongoose Adapter | Document Instance `.save()` | In-place property mutation followed by `.save()` persisting to PostgreSQL | Modified document instance | Saved document instance | Throws on constraint violation | `orderWorkflowController.js`, `customerController.js` |
| 7 | Mongoose Adapter | Complex Filter Translation | Translates `$or`, `$and`, `$in`, `$nin`, `$gte`, `$lte`, `$regex`, `$options: 'i'` to SQL WHERE | MongoDB Query filter | SQL WHERE string + params array | Throws syntax error on unknown operator | `offerController.js`, `customerController.js` |
| 8 | Mongoose Adapter | Nested & Array Updates | Supports `$set`, `$push`, `$pull`, `$inc` across top-level and nested JSONB fields | Update operator objects | Updated JSONB document in PostgreSQL | Rejects invalid type mutations | `productController.js`, `orderController.js` |
| 9 | Mongoose Adapter | Atomic Booking Concurrency | Concurrency check with `$not: { $elemMatch: { ... } }` in `Product.findOneAndUpdate` | Booking dates, occupied range | Reserved product document or 409 conflict | Returns 409 when date overlap detected | `bookingController.js:384` |
| 10 | Mongoose Adapter | Aggregation Pipeline | Translates `$match`, `$group`, `$sum`, `$year`, `$month`, `$sort` to SQL aggregations | Aggregation pipeline array | Aggregated data array | Throws on unsupported stage | `payoutController.js`, `offerController.js` |
| 11 | Mongoose Adapter | Pagination, Sorting, Projection | `.sort()`, `.skip()`, `.limit()`, `.select()`, `.lean()` | Sort keys, pagination numbers, field projection | Paged/sorted array of docs | Defaults to `createdAt DESC` | `offerController.js`, `payoutController.js` |
| 12 | Mongoose Adapter | Initial Data Auto-Seeding | `ensureSeedData()` checks `Designer.countDocuments()` and inserts initial designers | Seed array | Seeded rows in database | Idempotent check prevents duplicate seeds | `designerController.js:152` |

---

## 7. Edge Cases & Error Behavior Matrix

## Edge Cases
| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | `findById` / `findOne` | Non-ObjectId string ID (e.g. `HOK-ORD-1234`, `sabyasachi`) | Controller tests with `mongoose.Types.ObjectId.isValid(id)`. Adapter matches on `_id = id` OR `[entityId] = id`. |
| 2 | `findOneAndUpdate` | `{ new: true }` option | Returns the document state *after* the update is applied; if `{ new: false }`, returns pre-update state. |
| 3 | Double reservation / Race condition | Concurrent booking requests for overlapping dates on same product | `$not: { $elemMatch: ... }` in atomic UPDATE ensures only 1 request matches; second request receives null and triggers 409 Conflict. |
| 4 | JSONB Array push on empty field | `$push` to a document where array field was previously undefined or null | Adapter initializes field to `[]` and pushes new element, avoiding `null || element` corruption. |
| 5 | Case-Insensitive Search | Regex filter: `new RegExp(search, "i")` | Adapter compiles to PostgreSQL `(data->>'field' ~* $param)` with parameterized regex string. |
| 6 | Date Object vs ISO String | Mongoose query `{ dueDate: { $gte: new Date() } }` vs stored ISO string | Adapter converts Date objects to ISO 8601 strings for SQL parameter binding and casts JSONB values to `TIMESTAMPTZ`. |
| 7 | Mixed / Flexible Schema Fields | Lister `bankDetails`, `address`, `terms` (`strict: false`) | Entire unconstrained object tree is preserved intact in `data JSONB`. |
| 8 | Subdocument Method Invocation | `item.dispatch?.toObject?.()` | Subdocuments returned in arrays have `.toObject()` helper attached or proxy to prevent TypeError. |
| 9 | Soft-deleted offers handling | Bulk delete/restore via `Offer.updateMany` with `$in: offerIds` | Correctly sets `isDeleted: true/false`, timestamps, and updates timeline entries. |
| 10 | Numeric calculations in SQL | `payout.netPayout = Math.max(0, listerShare - taxDeduction)` | Numeric values cast to `::numeric` in PostgreSQL aggregation to prevent string concatenation bugs. |

---

## 8. Recommendations & Implementation Guidelines

1. **Adapter Location & Integration**:
   - Place adapter in `backend/config/pgAdapter.js` or `backend/db/postgresAdapter.js`.
   - Update `backend/config/db.js` to connect to PostgreSQL via `pg.Pool` and initialize tables.
   - Models in `backend/models/*.js` export `postgresAdapter.model(name, schema)` (or provide a drop-in shim exporting standard Model interface).
2. **Backward Compatibility**:
   - Keep `mongoose.Types.ObjectId.isValid(id)` helper working (e.g. test against 24-char hex string regex `/^[0-9a-fA-F]{24}$/`).
   - Retain all current validation files in `backend/validations/*.js` without modification.
3. **Database Migration Script**:
   - Provide standalone script `backend/scripts/initDb.js` to execute DDL and verify connection against Supabase PostgreSQL.
