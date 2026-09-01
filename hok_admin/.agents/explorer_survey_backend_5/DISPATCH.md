# Dispatch — explorer_survey_backend_5

## 2026-08-24T12:45:42Z
You are explorer_survey_backend_5.
Your working directory is: d:/HOKAdmin/hok_admin/.agents/explorer_survey_backend_5
Project root is: d:/HOKAdmin/hok_admin

Please read:
- d:/HOKAdmin/hok_admin/.agents/ORIGINAL_REQUEST.md
- d:/HOKAdmin/hok_admin/.agents/explorer_survey_backend_5/DISPATCH.md
- d:/HOKAdmin/hok_admin/.agents/spec_miner_database_1/analysis.md

Execute your survey:
1. Initialize BRIEFING.md and progress.md in your working directory.
2. Inspect backend files in `backend/` (`server.js`, `backend/routes/`, `backend/controllers/`, `backend/models/`, `backend/middleware/`, etc.).
3. Document all registered API routes and endpoints across:
   - Auth (`/api/auth`)
   - Operations: Orders (`/api/orders`), Offers/Enquiries (`/api/offers`), Calendar, Dispatch (`/api/dispatch`), Returns (`/api/returns`), Payouts (`/api/payouts`), Customers (`/api/customers`)
   - Catalogue: Products (`/api/products`), Designers (`/api/designers`), Listers (`/api/listers`), LYP (`/api/lyp`)
4. Document missing routes/handlers needed for full functionality (e.g. calendar aggregation, return processing, deposit refunds, CSV export, logs).
5. Document how the PostgreSQL JSONB adapter should replace or wrap Mongoose models in `backend/models/`.
6. Write your detailed survey to `d:/HOKAdmin/hok_admin/.agents/explorer_survey_backend_5/analysis.md` and `d:/HOKAdmin/hok_admin/.agents/explorer_survey_backend_5/handoff.md`.
7. Send a message to parent when completed.
