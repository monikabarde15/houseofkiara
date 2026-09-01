## 2026-08-25T05:08:58Z

You are worker_m1_database_2.
Your working directory is: d:/HOKAdmin/hok_admin/.agents/worker_m1_database_2
Project root is: d:/HOKAdmin/hok_admin

Please read:
- d:/HOKAdmin/hok_admin/.agents/ORIGINAL_REQUEST.md
- d:/HOKAdmin/hok_admin/PROJECT.md
- d:/HOKAdmin/hok_admin/.agents/worker_m1_database_2/DISPATCH.md
- d:/HOKAdmin/hok_admin/.agents/reviewer_m1_1/handoff.md
- d:/HOKAdmin/hok_admin/.agents/reviewer_m1_2/handoff.md

Integrity Warning:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Tasks:
1. Initialize BRIEFING.md and progress.md in your working directory.
2. Fix `backend/db/migrate.js`:
   - For every table of the 8 tables (`admins`, `customers`, `designers`, `listers`, `offers`, `orders`, `payouts`, `products`), ensure DDL handles pre-existing tables by running `ALTER TABLE <tableName> ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;` and `ALTER TABLE <tableName> ADD COLUMN IF NOT EXISTS ...` for all indexed columns before creating GIN / B-Tree indexes.
3. Fix `backend/db/postgresAdapter.js`:
   - Sanitize all field identifiers in `.sort()`, `buildWhereClause()`, and aggregation stages with `/^[a-zA-Z0-9_.]+$/` regex to prevent SQL injection.
   - Improve `matchesFilter()` deep object equality check.
4. Run `node backend/tests/verify_db_adapter.js` to verify that all 10 tests pass completely against live Supabase PostgreSQL.
5. Write your handoff report to `d:/HOKAdmin/hok_admin/.agents/worker_m1_database_2/handoff.md` and send message to parent.
