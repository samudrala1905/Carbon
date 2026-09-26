# Saurient Carbon Passport — Investor Demo PRD

## Original problem statement
Web-based React + FastAPI demo showing how Saurient turns company, supplier and emissions data into a deterministic, verified, CBAM-ready Carbon Passport. Target users: investors. 5-minute golden path: onboarding → emissions ingestion → Scope 1–3 → PCF → MRV verification → passport issuance → public QR verification.

Requirements: seeded demo data only (no real ERP/IoT/payment/registry/AI integrations), role-based demo access (Company Operator, Verifier, Passport Officer) with demo login + in-app role switcher, deterministic calculations, public QR verification route with warnings for revoked/superseded/unverifiable, explicit visual states for valid/invalid/duplicate/incomplete records. Language: English.

## User choices
- Simple demo login with prefilled accounts + public QR-verification link + in-app role switcher.
- Add all four enhancements: interactive CBAM exposure preview, downloadable audit summary (CSV **and** printable HTML), passport copy/share actions, supplier drilldown (completeness, assumptions, correction status).

## Architecture
- `/app/backend/server.py` — FastAPI, in-memory seeded demo state (`INITIAL_STATE`), token sessions, Mongo used only to persist seed docs. Endpoints: `/api/demo/login`, `/api/demo/me`, `/api/demo/role`, `/api/demo/state`, `/api/demo/ingest`, `/api/demo/calculate`, `/api/demo/pcf`, `/api/demo/workflow` (correct/verify/issue), `/api/public/verify/{id}`.
- `/app/frontend/src/App.js` — single-file React app (Login, AppShell, Overview, CompanyInteractive, Emissions, Calculations, Passport, CBAM, AuditSummary, ExplainDrawer, PublicVerify). Audit export is client-side (Blob download / printable HTML tab).
- `/app/frontend/src/App.css` — all styling (DM Sans / Space Grotesk / DM Mono, dark sidebar, mint/green accents).
- Credentials: `/app/memory/test_credentials.md`.

## Implemented (as of Jun 2026)
- [x] Demo login, role switcher, seeded Northstar Components workspace
- [x] Golden path: ingest → Scope 1–3 → PCF versioning → MRV correction → verify & lock → issue passport
- [x] Public verification `/verify/{id}` with VALID / UNVERIFIABLE states, duplicate-issuance prevention
- [x] Methodology trace drawer, responsive desktop/mobile
- [x] CBAM exposure preview (SIMULATED) with product/year selectors
- [x] Audit summary export — CSV download + printable HTML
- [x] Passport copy-link + share actions (Web Share API with clipboard fallback)
- [x] Supplier drilldown: 4 records with completeness, assumption, correction status; detail panel
- Tested: iteration_1/2 (core flow, backend), iteration_3 (4 enhancements + regression, 100% pass)

## Backlog
- P1: Split App.js into components under `/src/components/` for maintainability
- P2: Revoke / supersede passport action to demo the public warning states live
- P2: Investor "presenter mode" (guided step-through with narration)
- P2: Persist demo state per session in Mongo instead of process memory
