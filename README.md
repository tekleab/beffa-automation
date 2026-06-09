# BEFFA ERP High-Integrity Automation Suite 🏗️

[![CI Status](https://github.com/tekleab/beffa-automation/workflows/Playwright%20Tests/badge.svg?branch=main)](https://github.com/tekleab/beffa-automation/actions/workflows/playwright.yml)
[![Live Dashboard](https://img.shields.io/badge/dashboard-live-blue)](https://tekleab.github.io/beffa-automation)
[![Playwright](https://img.shields.io/badge/playwright-1.40.0-2EAD33)](https://playwright.dev)

> **Author**: Tekleab
> **Version**: 4.2.0
> **Purpose**: Technical Audit Suite for Financial & Inventory Reconciliation

A high-performance Playwright-based testing framework designed for the BEFFA ERP environment. This suite focuses on **Business Logic Integrity**, utilizing an **API/UI Hybrid Architecture** that prioritizes both execution speed and data reconciliation across integrated workflows.

---

## 🏗️ Engineering Architecture

- **API/UI Hybrid Workflows**: Tests use a REST API layer to instantly establish document states (SO, PO, Invoices, Projects), while retaining surgical UI verification for critical user-facing transitions.
- **Self-Healing Fallbacks**: Zero stock → auto-injects new SKU + 100 units via API. No workspace → auto-creates `Default Workspace` via `/api/workspaces`.
- **Location-Synchronized Audits**: Every inventory adjustment and sale is locked to a specific `locationId`, eliminating stock discrepancies in shared-warehouse environments.
- **Resilient Search (Omni-Match)**: Financial ledger verification scans `bill_no`, `ref`, and `invoice_number` fields for stable schema-evolution resilience.
- **Thread-Safe Parallelism**: 3 parallel workers with randomized SKU discovery and isolated location targeting per worker.
- **Structured Logging**: Custom `Logger` with colored, timestamped output and `DEBUG=true` gating.

---

## 🚀 Key Engineering Decisions

### COGS Journal Matching (so-cogs.spec.ts)
Replaced total-sum comparison with **largest-COGS-debit paired-amount matching**:
- Finds the biggest `Cost of Sales` debit entry in the journal response
- Matches the `Inventory` credit entry by amount (±0.1 tolerance)
- Isolates the current invoice's COGS pair from historical ledger noise in multi-transaction API responses

### ProjectAPI — Workspace Auto-Creation
`discoverMetadataAPI()` now returns `workspaceId` + `workspaceName` in addition to customer fields, and auto-creates a `Default Workspace` via `POST /api/workspaces` if none exist on the target environment.

### CI/CD
- GitHub Actions pipeline on every push
- Allure report with atomic directory swap for stable historical trends on GitHub Pages
- Live dashboard with 60-second auto-refresh at `https://<owner>.github.io/<repo>/`

---

## 📁 Test Modules

### Sales
| File | Coverage |
|------|----------|
| `tests/sales/so-cogs.spec.ts` | Multi-item invoice COGS journal verification — stock deduction + Dr/Cr balance audit using largest-debit matching |

### Project Management
| File | Tests | Coverage |
|------|-------|----------|
| `tests/project/project-ui-list.spec.ts` | UI-01 → UI-09 | List page columns, filters, search, pagination, row navigation |
| `tests/project/project-ui-form.spec.ts` | UI-10, UI-11, UI-GUARD-01 | Add form navigation, required field visibility, empty-submit guard |
| `tests/project/project-ui-detail.spec.ts` | UI-12 → UI-15, UI-GUARD-02, UI-GUARD-03 | Detail page financial data, status indicator, customer name, 404 handling, auth guard |
| `tests/project/project-api-contract.spec.ts` | API contract | CRUD lifecycle, field mapping, status transitions |
| `tests/project/project-api-validation.spec.ts` | API validation | Missing fields, invalid payloads, boundary values |

### Project Module — Key Selectors (live-probed)
```
Route: /project-management/projects/new

input#ref                  — Project ID * (not auto-generated, must be filled)
input#project_name         — Project Name *
select#project_status      — Project Status * (pending/in-progress/on-hold/completed)
select#completion_method   — Completion Method * (manual/task_completion/task_progress/task_weight)
input#percent_complete     — Percent Completed * (default: 0)
select#workflow_set_id     — Workflow Set * (appears after workspace selected)

button#customer_id         — Project Owner Customer * → opens POPOVER[6]
  └─ .chakra-popover__content input#customer_id   — search input
  └─ .chakra-popover__content button (nth 1+)     — option rows (no class attr)

button#workspace_id        — Project Workspace * → opens POPOVER[7]
  └─ .chakra-popover__content input#workspace_id  — search input
  └─ .chakra-popover__content button (nth 1+)     — option rows (no class attr)

button[type="submit"] "Create project" — disabled=true until all required fields resolved in React state
```

---

## ⚡ Quick Start

```bash
git clone https://github.com/tekleab/beffa-automation.git
cd beffa-automation
cp .env.example .env   # fill in credentials
npx playwright test
```

---

## 🔧 Configuration

| Variable | Purpose |
|----------|---------|
| `BASE_URL` | Frontend URL |
| `API_URL` | Backend API URL |
| `BEFFA_USER` | Login email |
| `BEFFA_PASS` | Login password |
| `BEFFA_COMPANY` | Company name for context switch |
| `DEBUG` | Set `true` for verbose logs |

**Playwright config**: 4 workers · 600s timeout · 0 retries · JSON + Allure reporters

---

## 🧩 POM Architecture

| File | Description |
|------|-------------|
| `pages/AppManager.ts` | Central facade — wires all API and UI modules |
| `pages/ProjectPage.ts` | Project UI POM — popover field selection, form fill, save, list verify |
| `lib/api/ProjectAPI.ts` | Project API — CRUD, metadata + workspace discovery/auto-creation |

---

## 🚧 Known Limitations & Roadmap

### Current Limitations
- **UI-POM-10 (Project form creation via POM)**: Chakra UI popover fields (customer, workspace) update display text only — React internal state does not reflect the selection in DOM input values. The `Create project` button stays disabled. Commented out pending network payload intercept to identify the React state mutation.
- **Database Indexing Lag**: Ledger views exhibit up to 15s latency under parallel load — managed via polling retry (15 retries, 2-5s waits).

### Roadmap
- [ ] **UI-POM-10**: Intercept `fetch`/XHR on manual submit to capture exact payload, then replicate via `page.evaluate` React state dispatch
- [ ] **Swagger-Driven API Layer**: Generated API clients for 100% type-accuracy
- [ ] **Visual Regression**: Screenshot-diffing for the Executive Analytics Dashboard
- [x] **COGS Journal Fix**: Largest-debit paired-amount matching isolates current invoice entries
- [x] **Workspace Auto-Creation**: `discoverMetadataAPI()` self-heals on fresh environments
- [x] **Project UI Tests**: UI-01→09 (list), UI-10/11/GUARD-01 (form), UI-12→15/GUARD-02/03 (detail)
- [x] **Dashboard Enhancements**: Multi-theme switcher, parent-child module mapping, dynamic Chart.js

---
**Tekleab** — *Precision Automation Engineering*
