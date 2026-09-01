# Dispatch — worker_m1_database_1

## Mission
Implement Milestone 1: PostgreSQL Connection & Mongoose-PostgreSQL JSONB Adapter Layer.

## Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Database Connection
`postgresql://postgres:Rrkf4swYDLiBAhgX@db.rnvmjpxhlowhguihesja.supabase.co:5432/postgres`

## Inputs
- `d:/HOKAdmin/hok_admin/.agents/ORIGINAL_REQUEST.md`
- `d:/HOKAdmin/hok_admin/PROJECT.md`
- `d:/HOKAdmin/hok_admin/.agents/spec_miner_database_1/analysis.md`
- `d:/HOKAdmin/hok_admin/.agents/spec_miner_database_1/handoff.md`

## Scope of Changes & Ownership
- `backend/config/db.js`: PostgreSQL connection pool with `pg` and SSL `rejectUnauthorized: false`
- `backend/db/postgresAdapter.js`: Complete Mongoose-compatible JSONB adapter (`PostgresModel`, `PostgresQuery`, `PostgresDocument`) supporting all query operators (`$eq`, `$ne`, `$in`, `$nin`, `$gt`, `$gte`, `$lt`, `$lte`, `$regex`, `$options`, `$or`, `$and`, `$not`, `$elemMatch`, dot notation), update operators (`$set`, `$unset`, `$push`, `$pull`, `$inc`, `$addToSet`), sorting, pagination, and aggregation.
- `backend/db/migrate.js`: Auto-migration script creating tables for all 8 entities (`admins`, `customers`, `designers`, `listers`, `offers`, `orders`, `payouts`, `products`) with primary keys, unique indexes, and GIN indexes on `data` JSONB column.
- `backend/models/*.js`: Rewire models to use the PostgreSQL JSONB adapter.
- Ensure package dependencies (`pg`, etc.) are installed in `backend/package.json`.
- Execute migration and verify connection against live Supabase PostgreSQL.

## Output
Write `d:/HOKAdmin/hok_admin/.agents/worker_m1_database_1/handoff.md` with build and test verification results, then send message to parent.
