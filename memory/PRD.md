# Carbon Passport — Organisation Profile

## Original Problem Statement
Profile page showing the legal identity of the company: legal name, trading name, org ID, registration number, country of incorporation, registered address, HQ, industry/sector, primary commodities, website, tax/VAT/GST ID, LEI, logo, primary + sustainability/compliance contacts. Carbon Accounting Boundary (consolidation approach, base year, reporting currency, default units, GHG standard, org status Draft/Active/Verified). Registration & Verification status + audit trail at bottom. Main action: Edit Organisation Profile. Design inline with Carbon Passport.

## User Choices
- Part of existing Carbon Passport app (matched enterprise ESG style)
- Front-end demo with mock data (no persistence)
- Static audit trail display
- Clean corporate/enterprise look
- No auth

## Architecture
- React SPA (CRA + craco), Tailwind, shadcn/ui, framer-motion, sonner
- No backend/database used — mock data in `src/data/mockProfile.js`
- Route `/` → `pages/OrganisationProfile.jsx`

## Implemented (2026-06)
- Header/command bar with monogram logo, status badge, Edit CTA, last-audit timestamp
- Company Legal Identity panel (all requested fields + primary & sustainability contacts)
- Carbon Accounting Boundary panel (consolidation approach, base year, currency, units, GHG standard, reporting period, status)
- Registration & Verification Status panel (provider, accreditor, standard, assurance level, dates, cert hash)
- Static Audit Trail table (timestamp, user & role, section, previous/updated, change hash)
- Edit Organisation Profile modal — tabbed (Legal Identity / Carbon Boundary / Contacts); saving updates page state in-memory + toast
- Custom emerald/slate palette, Plus Jakarta Sans / Manrope / JetBrains Mono fonts, light+dark tokens

## Backlog
- P1: Persist edits to MongoDB; auto-log audit entries on each change
- P2: Company logo upload (object storage), multi-entity registry list, export profile PDF
