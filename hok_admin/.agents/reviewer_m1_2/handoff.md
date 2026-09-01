# Handoff Report — Milestone 1 Review: PostgreSQL Adapter & Schema Layer

## Review Summary
**Verdict**: REQUEST_CHANGES
**Milestone**: M1 (PostgreSQL Connection & Mongoose-PostgreSQL JSONB Adapter Layer)
**Reviewer Role**: reviewer, critic

---

## 1. Observation

1. **Test Execution Command & Verbatim Failure**:
   Executed command:
   ```bash
   node backend/tests/verify_db_adapter.js
   ```
   Verbatim output and error stack:
   ```
   === RUNNING POSTGRESQL & MONGOOSE-JSONB ADAPTER VERIFICATION SUITE ===

   [Test 1] Connecting to Supabase PostgreSQL & Running Migrations...
   Connected to PostgreSQL (Supabase) at: 2026-08-25T05:06:13.402Z
   Starting PostgreSQL schema migration for 8 tables...
   Migration failed: error: column "data" does not exist
       at D:\HOKAdmin\hok_admin\node_modules\pg\lib\client.js:694:17
       at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
       at async migrate (file:///D:/HOKAdmin/hok_admin/backend/db/migrate.js:179:7)
       at async connectDB (file:///D:/HOKAdmin/hok_admin/backend/config/db.js:34:5)
       at async runTests (file:///D:/HOKAdmin/hok_admin/backend/tests/verify_db_adapter.js:17:3) {
     length: 94,
     severity: 'ERROR',
     code: '42703',
     routine: 'ComputeIndexAttrs'
   }
   PostgreSQL connection error: column "data" does not exist
   ❌ Test failed: error: column "data" does not exist
   ```

2. **Schema Migration Implementation (`backend/db/migrate.js:6-171`)**:
   - `migrate.js` defines table creation with `CREATE TABLE IF NOT EXISTS <table_name> (...)` followed by index definitions such as:
     - `CREATE INDEX IF NOT EXISTS idx_admins_data_gin ON admins USING GIN (data);` (line 19)
     - `CREATE INDEX IF NOT EXISTS idx_customers_data_gin ON customers USING GIN (data);` (line 40)
     - `CREATE INDEX IF NOT EXISTS idx_orders_data_gin ON orders USING GIN (data);` (line 126)
   - When pre-existing tables exist in the target Supabase database that were created previously without the `data JSONB` column, `CREATE TABLE IF NOT EXISTS` is a no-op and does NOT add missing columns.
   - When the script proceeds to `CREATE INDEX ... ON <table_name> USING GIN (data)`, PostgreSQL throws `42703 (undefined_column): column "data" does not exist`.

3. **Database Connection Initialization (`backend/config/db.js:26-41`)**:
   - `connectDB()` unconditionally invokes `await migrate()` in lines 33-34. Because `migrate()` fails, `connectDB()` throws, crashing backend startup and all dependent test runners.

4. **Query String Interpolation & SQL Injection Risk (`backend/db/postgresAdapter.js:946-969`)**:
   - In `PostgresQuery.prototype.exec()`:
     ```javascript
     if (typeof this._sort === "string") {
       const parts = this._sort.split(" ").filter(Boolean);
       for (const part of parts) {
         const desc = part.startsWith("-");
         const field = desc ? part.substring(1) : part;
         orderClauses.push(`(data->>'${field}') ${desc ? "DESC" : "ASC"}`);
       }
     }
     ```
   - The field name `field` is directly concatenated into the SQL statement without sanitization or identifier validation. If sort queries come from user input (e.g. `req.query.sort`), this creates an SQL injection vulnerability in `ORDER BY`.

5. **SQL Pagination & In-Memory Filter Truncation (`backend/db/postgresAdapter.js:974-1005`)**:
   - `PostgresQuery.prototype.exec()` applies SQL-level `LIMIT` and `OFFSET` whenever `!this._hasComplexFilter()`.
   - Secondary in-memory filtering (`docs = docs.filter(doc => matchesFilter(doc, this.filter));` at line 995) runs after SQL limits are applied.
   - If SQL WHERE filtering does not match in-memory filter semantics for any edge cases, candidate rows are dropped in-memory, causing fewer rows to be returned than requested by the limit (e.g., returning 7 rows instead of 10 even when 50 rows match).

---

## 2. Logic Chain

1. *Premise*: Acceptance Criteria require the PostgreSQL database layer and all 8 entity models to connect and persist data reliably to Supabase PostgreSQL (`postgresql://...supabase.co:5432/postgres`).
2. *Observation*: Executing `node backend/tests/verify_db_adapter.js` fails on Step 1 (`connectDB()` calling `migrate()`) with `error: column "data" does not exist` (PostgreSQL error code `42703`).
3. *Inference*: `backend/db/migrate.js` relies solely on `CREATE TABLE IF NOT EXISTS`, which fails to add the required `data JSONB` column and extracted index columns when tables already exist in Supabase from prior schemas.
4. *Inference*: Because `connectDB()` crashes during schema migration, the backend server cannot start and no CRUD operations or queries can be executed against the database.
5. *Adversarial Challenge*: Furthermore, string-based `.sort()` directly interpolates fields into the SQL `ORDER BY` clause, introducing an unparameterized SQL injection vector.
6. *Conclusion*: The work for Milestone 1 does not satisfy the functional verification requirement and requires changes to resolve the schema migration defect and secure SQL query compilation before Milestone 2 can proceed.

---

## 3. Caveats

- The Mongoose-JSONB adapter implementation in `backend/db/postgresAdapter.js` is structurally comprehensive and well-designed (covering `PostgresModel`, `PostgresQuery`, `PostgresDocument`, proxying, `$set`, `$inc`, `$push`, `$pull`, `$addToSet`, row-level `FOR UPDATE` locking, and aggregation pipelines).
- No integrity violations (hardcoded test answers, dummy facade stubs, or fake outputs) were found. The implementation is genuine, but blocked by the schema migration DDL incompatibility against pre-existing tables in the Supabase database.
- Once migration DDL is made idempotent (e.g. adding `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...`), the full test suite in `verify_db_adapter.js` can be verified.

---

## 4. Conclusion

**Verdict: REQUEST_CHANGES**

### Required Action Items for Worker:
1. **Fix Schema Migration DDL in `backend/db/migrate.js`**:
   - Ensure migration script is idempotent and handles existing tables that lack `data JSONB` and other extracted columns.
   - For every table (`admins`, `customers`, `designers`, `listers`, `offers`, `orders`, `payouts`, `products`), ensure the `data` column exists before creating GIN indexes, for example:
     ```sql
     ALTER TABLE <table_name> ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;
     ```
   - Ensure all other referenced columns in index creation statements (e.g., `session_token`, `customer_id`, `designer_id`, `lister_id`, `offer_id`, `order_id`, `payout_id`, `product_id`, etc.) are also added if missing with `ADD COLUMN IF NOT EXISTS`.
2. **Sanitize Sort Fields in `backend/db/postgresAdapter.js`**:
   - Sanitize or validate sort field identifiers (e.g. `/^[a-zA-Z0-9_.]+$/`) in `PostgresQuery.prototype.sort()` / `exec()` before interpolating into SQL `ORDER BY`.
3. **Re-run and Verify Test Suite**:
   - Run `node backend/tests/verify_db_adapter.js` to ensure all 10 verification test steps pass with exit code 0 against the live Supabase PostgreSQL database.

---

## 5. Verification Method

To independently verify the fix:
1. Run the test verification suite:
   ```powershell
   node backend/tests/verify_db_adapter.js
   ```
2. Verify that all 10 test steps complete successfully:
   - Test 1: Connects and migrates all 8 tables
   - Test 2: Admin model create, findOne, save, exists
   - Test 3: Customer model create, nested array push, save, delete
   - Test 4: Designer model countDocuments, insertMany, regex
   - Test 5: Lister model flexible schema, bankDetails
   - Test 6: Offer model query chaining, aggregation pipelines, updateMany
   - Test 7: Order model subdocuments, status transitions, logs push
   - Test 8: Payout model create, find.exec, aggregate
   - Test 9: Product model & atomic booking lock concurrency
   - Test 10: Clean up test records
3. Invalidation condition: Any error during `node backend/tests/verify_db_adapter.js` or `npm run server` startup invalidates the approval.
