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

## Facilities Feature (2026-06)
- `/facilities` list — searchable, cards + table view toggle, summary stats, status & readiness badges, data-completeness bars
- `/facilities/:id` detail — details, geo location, capacity, hours, manager, energy sources, utilities, products, emission sources
- Full data hierarchy tree: Organisation → Facility → Process → Production Line → Equipment/Meter → Data Source
- Actions: Add Facility, Edit Facility, Connect Device (live-updates hierarchy) via FacilitiesContext (in-memory)
- Shared TopNav (Profile ↔ Facilities)

## Processes Feature (2026-06)
- `/processes` list — grouped per facility with ordered flow strip; columns: Process ID, Name, Input, Output, Production Line, Energy Source, Meters/Data, Scope, Status; search + facility filter
- `/processes/:id` detail — facility process-flow strip (current highlighted), Input→Process→Output, associated carbon sources with scope badges, process attributes, and PCF trace (Product → Batch → Process → Activity → Emission Source)
- Action: Add Process (ProcessesContext, in-memory), links back to facility
- Tema chain seeded: Raw Cocoa Receiving → Cleaning → Roasting → Grinding → Pressing → Cocoa Butter Refining → Packaging → Storage
- TopNav now: Profile · Facilities · Processes

## Users & Roles + RBAC (2026-06)
- `/users` — Team Members table (Name, Email, Organisation, Facility Access, Role, Last Login, Status) with search + per-row Assign Role
- Roles & Permissions tab: matrix of 8 roles × 9 permissions (View, Create, Edit, Submit, Verify, Approve, Issue, Revoke, Export) + role description cards
- Roles: Organisation Admin, Facility Manager, Data Operator, Carbon Manager, Compliance Manager, Verifier, Auditor, Viewer
- Functional RBAC: "acting as" role switcher gates Invite/Assign actions (hasPermission) with lock + tooltip
- Actions: Invite User (role + facility-access picker), Assign Role — via UsersContext (in-memory)
- TopNav: Profile · Facilities · Processes · Users

## Reporting Periods + Audited Lifecycle (2026-06)
- `/periods` — table: Reporting Period, Start, End, Facilities, CCF Status, Data Completeness, Verification Status, Status
- Create Reporting Period: Monthly / Quarterly / Financial Year / Calendar Year / Custom (auto-fill name+dates), RBAC-gated (Create)
- `/periods/:id` — lifecycle stepper OPEN → DATA LOCKED → SUBMITTED → VERIFIED → CLOSED; summary; version/recalculation history
- RBAC transitions: Lock Data (Edit) → Submit (Submit) → Verify (Verify) → Close Period (Approve), each gated with tooltip
- After VERIFIED: data-lock banner; corrections create controlled recalculation versions (v2, v3…) — no silent edits
- PeriodsContext (in-memory). TopNav: Profile · Facilities · Processes · Periods · Users

## Localisation (2026-06)
- `/localisation` — Regional (Country, Currency, Timezone, Language, Measurement), Units (Energy/Fuel/Mass/Emissions), Regulatory (frameworks, grid factor region, emission-factor datasets, CBAM destination), Formatting & Output live previews (date/number/currency/cert language)
- Multi-jurisdiction roadmap strip: Ghana → India → EU → UK → Other markets (active highlighted)
- Configure Localisation modal with presets Ghana/India/EU/UK across Regional/Units/Regulatory tabs; LocalisationContext (in-memory)
- TopNav: Profile · Facilities · Processes · Periods · Users · Locale

## Backlog
- P1: Persist all data to MongoDB; real auth; server-enforced RBAC; auto audit log; apply active localisation formatting app-wide
- P2: Products/Batches + PCF engine, emissions charts, real geo map, logo upload, PDF export, CBAM/compliance module
