# Plan: HOK Admin Panel Backend & PostgreSQL Database Integration

## Objectives
1. Integrate real Supabase PostgreSQL database (`postgresql://postgres:Rrkf4swYDLiBAhgX@db.rnvmjpxhlowhguihesja.supabase.co:5432/postgres`) with 8 entities.
2. Build Mongoose-compatible JSONB adapter/wrapper in PostgreSQL for document storage (`data` column with primary keys & unique columns).
3. Connect full Admin Authentication flow with session tokens and route protection without altering existing UI.
4. Integrate all Operations and Catalogue views and full CRUD operations.
5. Completely purge hardcoded/mock data arrays in frontend and backend.
6. Verify against all acceptance criteria, pass full E2E testing, and clear Forensic Integrity Audit.

## Execution Sequence
1. **Phase 0: Survey & Specification Mining** (3 Explorers in parallel)
   - Explorer 1: Frontend components, services, routes, forms, mock data inventory.
   - Explorer 2: Backend server setup, routes, controllers, DB models, API contracts.
   - Explorer 3: Database adapter requirements, PostgreSQL schema, query mapping ($set, $push, $pull), connection validation.
2. **Phase 1: Architecture & Feature Inventory (PROJECT.md & TEST_INFRA.md)**
   - Synthesize survey findings into comprehensive PROJECT.md and E2E Test Suite design.
3. **Phase 2: Milestone Execution Loop (Direct or Sub-Orchestrators)**
   - M1: Database Layer & JSONB Adapter Implementation
   - M2: Authentication & Session Management
   - M3: Operations Subsections Backend & Frontend
   - M4: Catalogue Subsections Backend & Frontend
   - M5: Mock Data Purge & Verification
4. **Phase 3: E2E Testing, Adversarial Hardening & Forensic Audit**
   - E2E Test Runner execution (Tiers 1-4)
   - Adversarial verification (Tier 5 Challenger)
   - Forensic Auditor verification (Zero-tolerance check)
5. **Phase 4: Final Synthesis, Handoff & Reporting to Sentinel**
