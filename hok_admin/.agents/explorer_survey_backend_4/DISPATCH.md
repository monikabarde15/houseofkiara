# Dispatch — explorer_survey_backend_4

## Mission
Survey the entire backend codebase for HOK Admin Panel, inspect server configuration, route handlers, controllers, models, and middleware across all 8 entities (admins, customers, designers, listers, offers, orders, payouts, products), identify mock/fake responses, and document all backend API endpoints and data requirements.

## Working Directory
`d:/HOKAdmin/hok_admin/.agents/explorer_survey_backend_4`

## Inputs
- `d:/HOKAdmin/hok_admin/.agents/ORIGINAL_REQUEST.md`
- Backend source files in `d:/HOKAdmin/hok_admin/backend/`
- `d:/HOKAdmin/hok_admin/.agents/spec_miner_database_1/analysis.md`

## Output Requirements
- `analysis.md`: Detailed backend survey report
- `handoff.md`: Self-contained handoff report
- Send message to parent upon completion.

## 2026-08-24T12:12:00Z
You are explorer_survey_backend_4.
Your working directory is: d:/HOKAdmin/hok_admin/.agents/explorer_survey_backend_4
Project root is: d:/HOKAdmin/hok_admin

Please read:
- d:/HOKAdmin/hok_admin/.agents/ORIGINAL_REQUEST.md
- d:/HOKAdmin/hok_admin/.agents/explorer_survey_backend_4/DISPATCH.md
- d:/HOKAdmin/hok_admin/.agents/spec_miner_database_1/analysis.md
- d:/HOKAdmin/hok_admin/.agents/spec_miner_database_1/handoff.md

Your mission:
1. Initialize your BRIEFING.md and progress.md in your working directory.
2. Thoroughly investigate the backend codebase in d:/HOKAdmin/hok_admin/backend (server.js, app.js, routes/, controllers/, middleware/, models/, config/, utils/, etc.).
3. Survey all 8 entities: admins, customers, designers, listers, offers, orders, payouts, products.
4. Survey all API endpoints and routes across:
   - Auth (/api/auth/login, /api/auth/logout, /api/auth/me, session tokens, seed admin)
   - Operations (/api/orders, /api/offers, /api/calendar, /api/dispatch, /api/returns, /api/payouts, /api/customers)
   - Catalogue (/api/products, /api/designers, /api/listers, /api/lyp)
5. Identify any missing routes or controller methods needed for frontend actions (like CSV export, status transitions, logs, deposit decisions, refund updates, etc.).
6. Check for mock/fallback data or placeholder controllers in the backend.
7. Inspect how the Mongoose models connect, how the custom Mongoose-JSONB adapter can be integrated seamlessly without breaking controller logic, and what environment variables (PORT, DATABASE_URL) are configured.
8. Write your comprehensive findings to d:/HOKAdmin/hok_admin/.agents/explorer_survey_backend_4/analysis.md and a self-contained handoff report to d:/HOKAdmin/hok_admin/.agents/explorer_survey_backend_4/handoff.md.
9. Send a message to parent with your handoff summary when complete.
