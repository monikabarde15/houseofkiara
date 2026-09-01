# Handoff Report — Database Schema & Mongoose-JSONB Adapter Specifications

## 1. Observation
- **Target PostgreSQL Database**: `postgresql://postgres:Rrkf4swYDLiBAhgX@db.rnvmjpxhlowhguihesja.supabase.co:5432/postgres` specified in `d:/HOKAdmin/hok_admin/ORIGINAL_REQUEST.md:12`.
- **Existing Mongoose Models in `backend/models/`**:
  - `Admin.js` (`backend/models/Admin.js:1-12`): Schema with `name`, `email` (unique, lowercase), `passwordHash`, `passwordSalt`, `sessionToken`, timestamps.
  - `Customer.js` (`backend/models/Customer.js:1-72`): Schema with `customerId` (unique), `name`, `email`, `phone`, `location`, `status`, `source`, `preferences`, `addresses` array, `occasions` array, `communicationLog` array, and metrics (`ordersCount`, `totalSpent`, `wishlistCount`).
  - `Designer.js` (`backend/models/Designer.js:1-55`): Schema with `designerId` (unique), `slug` (unique), `name`, `bio`, `type`, `status`, `isFeatured`, `commercialTerms` subdocument, and timestamps.
  - `Lister.js` (`backend/models/Lister.js:1-40`): Schema with `listerId` (unique), `name`, `email`, `phone`, `city`, `status`, `address` (Mixed), `bankDetails` (Mixed), `terms` (Mixed), `strict: false`.
  - `Offer.js` (`backend/models/Offer.js:1-248`): Schema with `offerId` (unique), `enquiryId`, `productId`, `customerName`, `customerEmail`, `status`, `notes` array, `counterOffers` array, `timeline` array, `assignmentHistory` array, `isDeleted`.
  - `Order.js` (`backend/models/Order.js:1-19`): Schema with `orderId` (unique), `customerId`, `items` array with subdocuments (`preDispatch`, `dispatch`, `returnCondition`, `depositDecision`), `status`, `depositStatus`, `payoutStatus`, `logs` array, `strict: false`.
  - `Payout.js` (`backend/models/Payout.js:1-14`): Schema with `payoutId` (unique), `productId`, `listerId`, `orderId`, `listerShare`, `hokCommission`, `dueDate`, `status`, indexes on `{ listerId: 1, status: 1 }` and `{ orderId: 1 }` (unique).
  - `Product.js` (`backend/models/Product.js:1-146`): Schema with `productId` (unique), `name`, `designer`, `category`, `listingModes`, `availability`, `status`, `blockedDates` array, `bookingHistory` array, `externalBookings` array, `activityLog` array, `strict: false`.
- **Controllers & Queries in `backend/controllers/`**:
  - `authController.js:12,22`: `Admin.exists({})`, `Admin.findOne({ email })`, `admin.save()`.
  - `customerController.js:38,53,105,158,182,222,259,297`: `Customer.find(query).sort(...)`, `Customer.findOne(...)`, `Customer.findOneAndUpdate(...)`, `Customer.findOneAndDelete(...)`, array `.push()`, `.unshift()`, and `.save()`.
  - `designerController.js:154,157,190,207,304,368`: `Designer.countDocuments()`, `Designer.insertMany(...)`, `Designer.find(...)`, `Designer.findOneAndDelete(...)`.
  - `listerController.js:33,42,91,109,123,134`: `Lister.find(...)`, `Lister.findOne(...)`, `Lister.create(...)`, `Lister.findOneAndUpdate(...)`, `Lister.findOneAndDelete(...)`.
  - `offerController.js:44,146,148,196,305,418,1150,1220,1358,1631,1665`: `Offer.create(...)`, `Offer.find().sort().skip().limit()`, `Offer.countDocuments(...)`, `Offer.findById(...)`, `Offer.findByIdAndDelete(...)`, `Offer.updateMany(...)`, `Offer.deleteMany(...)`, `Offer.aggregate(...)`, `.lean()`.
  - `orderController.js:6,7,13,15,16`: `Order.find(...)`, `Order.findOne(...)`, `Order.create(...)`, `Order.findOneAndUpdate(...)` with `$set` and `$push: { logs }`.
  - `orderWorkflowController.js:5,11,12,13,14,15,17`: `Order.findOne(...)`, in-place property and subdocument modifications, `order.save()`, `Payout.create(...)`.
  - `payoutController.js:39,42,80,100,112,130,147`: `Payout.find().sort().exec()`, `Payout.aggregate(...)`, `Payout.findOneAndUpdate(...)`, `payout.save()`.
  - `productController.js:20,32,68,115,128,138,161,189,213,243,274`: `Product.find(...)`, `Product.findOne(...)`, `Product.create(...)`, `Product.findByIdAndUpdate(...)`, `Product.findOneAndDelete(...)`, `Product.findOneAndUpdate(...)` with `$push` and `$inc: { timesRented: 1 }`.
  - `bookingController.js:29,160,184,294,316,384`: Complex atomic booking lock with `Product.findOneAndUpdate` checking `status: "Live"`, `availability: "Available Now"`, `bookingHistory: { $not: { $elemMatch: { startDate: { $lte: occupiedEnd }, endDate: { $gte: occupiedStart }, status: { $nin: [...] } } } }`, `$push: { bookingHistory, activityLog }`.

## 2. Logic Chain
1. *Observation*: The application contains 14 controllers with dozens of complex queries, atomic updates, array pushes, and aggregation pipelines written against the Mongoose API.
2. *Premise*: Rewriting all 14 controllers to raw SQL statements would introduce high regression risk, take extensive effort, and potentially break delicate workflow mutations (like subdocument array mutations, order workflow logs, and double-booking conflict detection).
3. *Premise*: PostgreSQL has native JSONB support, GIN indexing, JSON path query capabilities, and JSON manipulation functions (`jsonb_set`, `jsonb_array_elements`, `@>`, `~*`).
4. *Inference*: A hybrid PostgreSQL architecture storing document state in a `data JSONB` column while extracting natural primary keys (`order_id`, `customer_id`, `designer_id`, `slug`, `lister_id`, `offer_id`, `payout_id`, `product_id`, `email`, `status`) to indexed columns provides both relational speed/integrity and MongoDB-like schema flexibility.
5. *Inference*: Building a lightweight Mongoose-compatible JSONB adapter (`PostgresModel`, `PostgresQuery`, `PostgresDocument`) enables all existing controllers to function without modifying their controller logic or breaking frontend API contracts.

## 3. Caveats
- No production database mutations have been executed by this agent (read-only discovery role).
- Supabase connection requires `ssl: { rejectUnauthorized: false }` for TLS negotiation from Node.js clients.
- `mongoose.Types.ObjectId.isValid` checks in controllers need to remain satisfied by generating 24-character hexadecimal IDs for documents if custom string IDs are not provided.

## 4. Conclusion
The database specifications and Mongoose-JSONB adapter requirements have been fully discovered and documented in `d:/HOKAdmin/hok_admin/.agents/spec_miner_database_1/analysis.md`.
- All 8 entities (`admins`, `customers`, `designers`, `listers`, `offers`, `orders`, `payouts`, `products`) have their full DDL schema, primary/unique keys, indexes, and document structures specified.
- The adapter query translator covers all query operators (`$eq`, `$ne`, `$in`, `$nin`, `$gt`, `$gte`, `$lt`, `$lte`, `$regex`, `$options`, `$or`, `$and`, `$not`, `$elemMatch`, dot notation) and update operators (`$set`, `$unset`, `$push`, `$pull`, `$inc`, `$addToSet`).
- The aggregation pipelines in `payoutController.js` and `offerController.js` are fully mapped to PostgreSQL aggregation SQL.

## 5. Verification Method
1. Inspect the full specification report in `d:/HOKAdmin/hok_admin/.agents/spec_miner_database_1/analysis.md`.
2. Verify all 8 entity schemas match the models in `backend/models/*.js`.
3. Verify all Mongoose methods and query operators in `backend/controllers/*.js` are represented in the translation matrices.
