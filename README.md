# BEFFA ERP High-Integrity Automation Suite 🏗️

[![CI Status](https://github.com/tekleab/beffa-automation/workflows/Playwright%20Tests/badge.svg?branch=main)](https://github.com/tekleab/beffa-automation/actions/workflows/playwright.yml)
[![Live Dashboard](https://img.shields.io/badge/dashboard-live-blue)](https://tekleab.github.io/beffa-automation)
[![Playwright](https://img.shields.io/badge/playwright-1.40.0-2EAD33)](https://playwright.dev)

> **Author**: Tekleab  
> **Version**: 5.0.0  
> **Purpose**: Technical Audit Suite for Financial, Inventory, HR & Project Reconciliation

A high-performance Playwright-based testing framework for the BEFFA ERP environment. Uses an **API/UI Hybrid Architecture** that prioritises execution speed and data reconciliation across all integrated workflows.

---

## 🏗️ Engineering Architecture

- **API/UI Hybrid Workflows**: REST API layer establishes document states (SO, PO, Invoices, Bills, Projects, Payroll) instantly; UI is reserved for user-facing transition verification.
- **Self-Healing Fallbacks**: Zero stock → auto-injects new SKU + 100 units via API. No workspace → auto-creates `Default Workspace`.
- **Location-Synchronized Audits**: Every inventory adjustment and sale is locked to a specific `locationId`.
- **Resilient Search (Omni-Match)**: Ledger verification scans `bill_no`, `ref`, and `invoice_number` for schema-evolution resilience.
- **Thread-Safe Parallelism**: 4 workers with randomised SKU discovery and isolated location targeting per worker.
- **Structured Logging**: Custom `Logger` with coloured, timestamped output and `DEBUG=true` gating.
- **Custom Reporters**: Module-level statistics, dashboard integration, and Allure report with atomic directory swap.

---

## 🚀 Key Engineering Decisions

### FIFO Layer Integrity (`inv-fifo-layers.spec.ts`)
End-to-end verification of FIFO costing layer accumulation and drain:
- **Scenario A**: Approved bill via PO receipt creates exactly 3 FIFO layers — `import(10@$15)`, `bill-direct(2@$40)`, `received-PO(3@$25)`
- **Scenario B**: Invoice + SO release drains layers in FIFO order; verifies `fifo_consumed_layers` on both invoice items and released SO items

### COGS Journal Matching (`so-cogs.spec.ts`)
Largest-COGS-debit paired-amount matching:
- Finds the biggest `Cost of Sales` debit entry in the journal response
- Matches the `Inventory` credit entry by amount (±0.1 tolerance)
- Isolates the current invoice's COGS pair from historical ledger noise

### HR Lifecycle (`hr-lifecycle.spec.ts`)
- Local `assignedCount` counter instead of unreliable `GET /payroll-runs/{id}/employees` endpoint (always returns `total=1`)
- 3 employees created sequentially, contracted, pay-structure assigned, payroll run approved end-to-end

### ProjectAPI — Workspace Auto-Creation
`discoverMetadataAPI()` returns `workspaceId` + `workspaceName` and auto-creates a `Default Workspace` via `POST /api/workspaces` if none exist.

### CI/CD
- GitHub Actions pipeline on every push
- Allure report with atomic directory swap for stable historical trends on GitHub Pages
- Live dashboard with 60-second auto-refresh at `https://tekleab.github.io/beffa-automation/`

---

## 📁 Test Modules

### Sales (`tests/sales/`)
| File | Coverage |
|------|----------|
| `customer.spec.ts` | Customer CRUD, TIN validation, create/edit/remove lifecycle |
| `customer-balance-ui.spec.ts` | UI: customer profile shows correct outstanding balance after payment |
| `receipt-ui.spec.ts` | UI: receipt creation and approval flow |
| `so-accounting.spec.ts` | SO accounting journal entries and GL impact |
| `so-cogs.spec.ts` | Multi-item invoice COGS audit — stock deduction + Dr/Cr journal balance using largest-debit pairing |
| `so-concurrency.spec.ts` | Concurrent SO submissions — duplicate liability guardrail |
| `so-credit-note.spec.ts` | Credit note creation and reversal flow |
| `so-doc-integrity.spec.ts` | Future-dated SO rejection, approved SO mutation block |
| `so-gl-audit.spec.ts` | GL account balance reconciliation after SO lifecycle |
| `so-guardrails.spec.ts` | Oversell prevention, zero-stock block, negative quantity rejection |
| `so-integrity.spec.ts` | SO document integrity across approval steps |
| `so-partial-release.spec.ts` | Partial SO release tracks remaining unreleased quantity |
| `so-period-control.spec.ts` | Period control rejects out-of-period dated documents |
| `so-security.spec.ts` | SQL injection, auth bypass, permission escalation attempts |
| `so-split-invoice.spec.ts` | Split invoice across multiple invoices from one SO |
| `so-tax-audit.spec.ts` | Tax calculation accuracy on invoiced amounts |

### Purchase (`tests/purchase/`)
| File | Coverage |
|------|----------|
| `vendor.spec.ts` | Vendor CRUD, TIN validation, create/edit/remove lifecycle |
| `bill-ui.spec.ts` | UI: bill creation, PO linkage, approval flow |
| `bill-to-sale.spec.ts` | Cross-module: PO → bill → payment → SO → invoice reconciliation |
| `po-accounting.spec.ts` | PO accounting journal entries and AP impact |
| `po-concurrency.spec.ts` | Concurrent identical PO submissions — duplicate liability guardrail |
| `po-doc-integrity.spec.ts` | Future-dated bill rejection, approved bill mutation block, over-billing guard |
| `po-integrity.spec.ts` | PO document integrity across approval steps |
| `po-partial-release.spec.ts` | Partial PO receipt tracks remaining unreceived quantity |
| `po-payment-attacks.spec.ts` | Double-payment prevention, overpayment rejection |
| `po-period-control.spec.ts` | Period control rejects out-of-period dated POs and bills |
| `po-security.spec.ts` | Injection attacks, auth bypass on purchase endpoints |
| `po-split-bill.spec.ts` | Split bill across multiple bills from one PO |
| `po-stress.spec.ts` | High-volume concurrent PO creation stress test |
| `procurement-accounting-logic.spec.ts` | Approved bill posts COGS debit + vendor outstanding balance increases |

### Inventory (`tests/inventory/`)
| File | Coverage |
|------|----------|
| `inv-costing-audit.spec.ts` | 7-stage WAC and FIFO cost validation across purchases, sales, adjustments |
| `inv-fifo-layers.spec.ts` | **FIFO layer integrity** — PO receipt layer accumulation + SO release layer drain with `fifo_consumed_layers` verification |
| `inv-concurrency.spec.ts` | Concurrent inventory adjustments — race condition and double-deduction guardrail |
| `inv-integrity.spec.ts` | Inventory document integrity, negative stock prevention |
| `inv-lifecycle.spec.ts` | Full item lifecycle: create → adjust → sell → verify |
| `inv-logic.spec.ts` | Stock calculation logic, location-based isolation |
| `inv-management.spec.ts` | Item management CRUD, category and warehouse assignment |
| `inv-security.spec.ts` | Injection and auth attacks on inventory endpoints |

### HR (`tests/hr/`)
| File | Coverage |
|------|----------|
| `hr-employees.spec.ts` | Employee CRUD, roster validation, org chart integrity, duplicate email guardrail |
| `hr-lifecycle.spec.ts` | Full multi-employee lifecycle — create → contract → pay structure → payroll run → approve |
| `hr-attendance.spec.ts` | Timesheet creation/approval, duplicate date rejection (409), UI page load |
| `hr-leave.spec.ts` | Leave application creation, approval flow, balance checks |
| `hr-payroll.spec.ts` | Payroll run creation, employee assignment, approval |
| `hr-payroll-inspect.spec.ts` | Payroll journal entries and GL debit/credit verification |

### Project Management (`tests/project/`)
| File | Tests | Coverage |
|------|-------|----------|
| `project-ui-list.spec.ts` | UI-01 → UI-09 | List page columns, filter pills, sort/view controls, search, pagination, row navigation |
| `project-ui-form.spec.ts` | UI-10, UI-11, UI-GUARD-01 | Add form navigation, project name field, empty-submit guard |
| `project-ui-detail.spec.ts` | UI-12 → UI-15, UI-GUARD-02, UI-GUARD-03 | Financial data, status indicator, customer name, 404 handling, auth guard, filter dropdown |
| `project-api-contract.spec.ts` | API contract | CRUD lifecycle, field mapping, status transitions |
| `project-api-validation.spec.ts` | API validation | Missing fields, invalid payloads, boundary values |

### Cross-Module (`tests/cross-module/`)
| File | Coverage |
|------|----------|
| `cross-module-ui-flows.spec.ts` | Sales UI: partial payment updates invoice Amount Due; Purchase UI: approved bill reflects outstanding balance in vendor profile |

---

## 🧩 POM & Library Architecture

| Path | Description |
|------|-------------|
| `pages/AppManager.ts` | Central facade — wires all API and UI modules, exposes unified interface |
| `pages/ProjectPage.ts` | Project UI POM — popover field selection, form fill, save, list verify |
| `pages/SalesPage.ts` | Sales UI POM — SO, invoice, receipt UI helpers |
| `pages/PurchasePage.ts` | Purchase UI POM — PO, bill, payment UI helpers |
| `pages/InventoryPage.ts` | Inventory UI POM — adjustment, item management helpers |
| `pages/components/SharedUI.ts` | Shared UI components — approval flow, journal entry capture, ledger verification |
| `lib/api/SalesAPI.ts` | Sales REST API — SO/invoice/receipt CRUD, metadata discovery |
| `lib/api/PurchaseAPI.ts` | Purchase REST API — PO/bill/payment CRUD, vendor discovery |
| `lib/api/InventoryAPI.ts` | Inventory REST API — item CRUD, adjustment, costing, FIFO layer inspection |
| `lib/api/HrAPI.ts` | HR REST API — employee, contract, payroll, timesheet, leave CRUD |
| `lib/api/ProjectAPI.ts` | Project REST API — project CRUD, workspace/metadata discovery, auto-creation |
| `lib/auth.ts` | Authentication — API login, token injection, company switching |
| `lib/base-page.ts` | Base utilities — `advanceDocumentAPI`, date helpers, account balance queries |
| `lib/utils/Logger.ts` | Structured logger with colour, timestamp, DEBUG gating |
| `lib/utils/perf.ts` | Performance timing utilities |

---

## 📊 Reporters & Dashboard

| Path | Description |
|------|-------------|
| `reporters/module-counter.ts` | Per-module pass/fail/skip statistics with execution time |
| `reporters/dashboard.ts` | Integrated HTML dashboard generator |
| `reporters/summary.ts` | CI summary reporter |
| `scripts/results.js` | Parses `playwright-results.json` → `results.json` with module breakdown, blocker deduplication, Allure URL mapping |
| `scripts/qa-dashboard.html` | Live SPA dashboard — KPIs, trend charts, FIFO risk rows with hover-reveal Allure links, occurrence deduplication badges, theme switcher |

---

## ⚡ Quick Start

```bash
git clone https://github.com/tekleab/beffa-automation.git
cd beffa-automation
cp .env.example .env   # fill in credentials
npm install
npx playwright test
```

---

## 🔧 Configuration

| Variable | Purpose |
|----------|---------|
| `BASE_URL` | Frontend URL (e.g. `http://host:4173`) |
| `API_URL` | Backend API URL (e.g. `http://host:8001`) |
| `BEFFA_USER` | Login email |
| `BEFFA_PASS` | Login password |
| `BEFFA_COMPANY` | Company name for context switch |
| `BEFFA_YEAR` | Fiscal year (default: `2018`) |
| `BEFFA_PERIOD` | Period type (default: `yearly`) |
| `BEFFA_CALENDAR` | Calendar type (default: `ec`) |
| `DEBUG` | Set `true` for verbose logs |

**Playwright config**: 4 workers · 600s timeout · 0 retries · JSON + Allure reporters · 6 project groups (Sales, Purchase, Inventory, HR, Project-Management, Cross-Module)

---

## 🚧 Known Limitations

- **UI-POM-10 (Project form creation via POM)**: Chakra UI popover fields (customer, workspace) update display text only — React internal state does not reflect selection. `Create project` button stays disabled. Pending network payload intercept to identify React state mutation.
- **Database Indexing Lag**: Ledger views exhibit up to 15s latency under parallel load — managed via polling retry (15 retries, 2–5s waits).
- **Allure `#testresult` URLs**: UIDs are regenerated on every `allure generate` run; dashboard links to `#behaviors` view which is stable across regenerations.

---

## ✅ Roadmap

- [ ] **UI-POM-10**: Intercept `fetch`/XHR on manual submit to capture payload, replicate via `page.evaluate` React state dispatch
- [ ] **Swagger-Driven API Layer**: Generated API clients for 100% type-accuracy
- [ ] **Visual Regression**: Screenshot-diffing for the Executive Analytics Dashboard
- [x] **FIFO Layer Integrity**: End-to-end `fifo_layers` + `fifo_consumed_layers` verification (Scenario A + B)
- [x] **COGS Journal Fix**: Largest-debit paired-amount matching isolates current invoice entries
- [x] **HR Lifecycle**: 3-employee payroll run with local counter (fixed broken pagination endpoint)
- [x] **Workspace Auto-Creation**: `discoverMetadataAPI()` self-heals on fresh environments
- [x] **Project UI Tests**: UI-01→09 (list), UI-10/11/GUARD-01 (form), UI-12→15/GUARD-02/03 (detail)
- [x] **Dashboard Enhancements**: Hover-reveal Allure links, occurrence deduplication badges, multi-theme switcher, dynamic Chart.js

---

**Tekleab** — *Precision Automation Engineering*
