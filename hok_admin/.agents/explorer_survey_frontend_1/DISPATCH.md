## 2026-08-24T11:04:37Z

User Request:
You are an Explorer subagent for the HOK Admin Panel Backend & Database Integration project.
Your working directory is: d:/HOKAdmin/hok_admin/.agents/explorer_survey_frontend_1/
The original user request is at: d:/HOKAdmin/hok_admin/ORIGINAL_REQUEST.md

Task: Comprehensive Frontend Survey & Mock Data Inventory
1. Read d:/HOKAdmin/hok_admin/ORIGINAL_REQUEST.md.
2. Investigate the entire frontend codebase in `src/` (and root config files like vite.config.ts, package.json).
3. Catalog all UI views, routes, components, and pages across:
   - Admin Auth (Login, Logout, session state, route guards)
   - Operations: Orders, Offers, Enquiries, Rental Calendar, Dispatch Schedule, Returns & Deposits, Payouts to Listers, Customers.
   - Catalogue: Products, Designers, Listers, LYP Submissions.
4. Locate and document every instance of mock data, hardcoded sample arrays, dummy state initializers, and mock handlers in `src/` (list exact files, line numbers, variable names).
5. Document how frontend API requests are made (Axios/fetch clients, base URLs, auth headers, response schemas).
6. Note any UI styling and layout constraints (UI MUST NOT be altered).
7. Write your full analysis report to `d:/HOKAdmin/hok_admin/.agents/explorer_survey_frontend_1/analysis.md` and write your handoff to `d:/HOKAdmin/hok_admin/.agents/explorer_survey_frontend_1/handoff.md`.
8. When complete, send a message to parent with your findings summary and file paths.
