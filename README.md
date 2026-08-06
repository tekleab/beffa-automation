# BEFFA ERP High-Integrity Automation Suite 🏗️

[![CI Status](https://github.com/tekleab/beffa-automation/workflows/Playwright%20Tests/badge.svg?branch=main)](https://github.com/tekleab/beffa-automation/actions/workflows/playwright.yml)
[![Live Dashboard](https://img.shields.io/badge/dashboard-live-blue)](https://tekleab.github.io/beffa-automation)
[![Playwright](https://img.shields.io/badge/playwright-1.40.0-2EAD33)](https://playwright.dev)

> **Author**: Tekleab  
> **Version**: 7.0.0  
> **Purpose**: Technical Audit Suite for Financial, Inventory, HR & Project Reconciliation

A high-performance Playwright-based testing framework for the BEFFA ERP environment. Uses an **API/UI Hybrid Architecture** that prioritises execution speed and data reconciliation across all integrated workflows. Every test creates its own isolated data — no seeded-data pollution across 6 modules and 60+ spec files.

---

## 🏗️ Engineering Architecture

- **API/UI Hybrid Workflows**: REST API layer establishes document states (SO, PO, Invoices, Bills, Projects, Payroll) instantly; UI is reserved for user-facing transition verification.
- **Self-Healing Fallbacks**: Zero stock → auto-injects new SKU + quantity via `createFreshItemWithStockAPI`. No workspace → auto-creates `Default Workspace`. No location → auto-creates warehouse + location pair.
- **Location-Synchronized Audits**: Every inventory adjustment and sale is locked to a specific `locationId` resolved at runtime.
- **Resilient GET Discovery (`safeGet`)**: All metadata discovery calls use retry/backoff — kills 500/socket-hang-up flakiness under parallel load.
- **Re-Auth on 401**: `createInventoryItemAPI`, `advanceDocumentAPI`, and `HrAPI.headers()` all re-login transparently on token expiry.
- **Resilient Search (Omni-Match)**: Ledger verification scans `bill_no`, `ref`, and `invoice_number` for schema-evolution resilience.
- **Thread-Safe Parallelism**: 4 workers with randomised SKU discovery and isolated location targeting per worker.
- **Structured Logging**: Custom `Logger` with coloured, timestamped output and `DEBUG=true` gating.
- **Custom Reporters**: Module-level statistics, dashboard integration, and Allure report with atomic directory swap.
- **`apiLoginSetup` utility**: Shared login helper used by all load/concurrency specs — single token acquisition per worker, cached for the test run.

---

## 🚀 Key Engineering Decisions

### Concurrency Architecture
All concurrency tests use `Promise.all` / `Promise.allSettled` to fire simultaneous API calls, then verify atomicity via `pollStockAPI` or direct balance checks. Three tiers:

| Tier | Files | Pattern |
|------|-------|---------|
| Race-condition guardrails | `so-concurrency`, `po-concurrency`, `inv-concurrency` | 2 concurrent requests → approve both → assert no double-spend |
| Load / throughput | `so-load`, `po-load`, `inv-load` | 10–20 concurrent creates → SLA assertion + degradation ratio |
| Stress / financial edge cases | `po-stress` | 6 financial attack scenarios (overpayment, double-bill, ghost payment, reversal, partial drift, orphan bill) |

### COGS Journal Audit (`so-cogs.spec.ts`)
Multi-item invoice (3 × WAC items) creates 3 fresh isolated items, approves invoice, then verifies:
- Stock deducted per line (3 independent `expect` assertions)
- Journal is double-entry balanced: `sum(all debits) == sum(all credits)` — schema-agnostic

### FIFO Layer Integrity (`inv-fifo-layers.spec.ts`)
- **Scenario A**: Approved bill via PO receipt creates exactly 3 FIFO layers
- **Scenario B**: Invoice + SO release drains layers in FIFO order; verifies `fifo_consumed_layers`

### PO Split Bill Audit (`po-split-bill.spec.ts`)
PO for 10 units received in 2 batches (4 + 6) via `received_purchase_order_items` path. Over-receive attempt logged as `[KNOWN_BUG]`.

### PO Document Integrity (`po-doc-integrity.spec.ts`)
`getPoReceiveStatusAPI` dual-source fallback: reads `unreceived_quantity` from PO items first; falls back to summing `received_quantity` from approved bills. Polling loop (10 × 2s) before overflow attack.

### Inventory Boundary & Costing Attack (`inv-boundary-attack.spec.ts`)
5 attack scenarios: zero-qty, float-qty, massive-negative, zero-unit-cost (WAC divide-by-zero guard), concurrent adjustments with retry-on-lock-contention.

### Receipt Overpayment Integrity (`so-receipt-overpayment.spec.ts`)
3 scenarios: overpayment (stored as amount=0 bug), exact-amount (AR settles to zero), double-receipt on fully-paid invoice.

### RBAC & User Security (`rbac-user-security.spec.ts`)
6 security checks: duplicate email, missing `x-company` header, invalid company header, tampered JWT, notification isolation, auditor RBAC privilege escalation.

### Line Item & Miscellaneous Audit (`line-item-miscellaneous-audit.spec.ts`)
Full coverage of the Line Item modal across SO, Invoice, Receipt, PO, Bill, Payment — UI and API paths for inventory items, miscellaneous lines, mixed lines, multi-line totals, zero-qty, negative price, discount, partial/full/multi-bill payment.

### HR Lifecycle (`hr-lifecycle.spec.ts`)
Sequential employee creation → contract → pay structure → payroll run → approve. 5-retry fallback for `null` response body. `HrAPI.headers()` proactively refreshes JWT < 60s before expiry.

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
| `sales-customer-balance-ui.spec.ts` | Extended customer balance UI scenarios |
| `receipt-ui.spec.ts` | UI: receipt creation and approval flow |
| `so-accounting.spec.ts` | SO accounting journal entries and GL impact |
| `so-cogs.spec.ts` | Multi-item invoice COGS audit — stock deduction + double-entry journal balance (Dr == Cr) |
| `so-concurrency.spec.ts` | **Concurrency**: 2 concurrent duplicate receipts (atomic AR guard) + 2 concurrent invoices for 1 unit (stock double-spend guard) |
| `so-credit-note.spec.ts` | Credit note creation and reversal flow |
| `so-doc-integrity.spec.ts` | Future-dated SO rejection, approved SO mutation block |
| `so-gl-audit.spec.ts` | GL account balance reconciliation after SO lifecycle |
| `so-guardrails.spec.ts` | Oversell prevention, zero-stock block, negative quantity rejection |
| `so-integrity.spec.ts` | SO document integrity across approval steps |
| `so-load.spec.ts` | **Load**: 10 concurrent invoices → distinct IDs; 5 concurrent approvals → AR balance = sum of amounts |
| `so-partial-release.spec.ts` | Partial SO release tracks remaining unreleased quantity |
| `so-period-control.spec.ts` | Period control rejects out-of-period dated documents |
| `so-receipt-overpayment.spec.ts` | **Security**: overpayment ghost receipt, exact-amount AR settlement, double-receipt on paid invoice |
| `so-security.spec.ts` | SQL injection, auth bypass, permission escalation attempts |
| `so-split-invoice.spec.ts` | Split invoice across multiple invoices from one SO |
| `so-tax-audit.spec.ts` | Tax calculation accuracy on invoiced amounts |
| `test-year-switch.spec.ts` | Fiscal year context switching validation |

### Purchase (`tests/purchase/`)
| File | Coverage |
|------|----------|
| `vendor.spec.ts` | Vendor CRUD, TIN validation, create/edit/remove lifecycle |
| `bill-ui.spec.ts` | UI: bill creation, PO linkage, approval flow |
| `bill-to-sale.spec.ts` | Cross-module: PO → bill → payment → SO → invoice reconciliation |
| `po-accounting.spec.ts` | PO accounting journal entries and AP impact |
| `po-concurrency.spec.ts` | **Concurrency**: 2 concurrent duplicate bill payments (atomic AP guard) + 2 concurrent bill approvals (stock addition race) |
| `po-doc-integrity.spec.ts` | Future-dated bill rejection, approved bill mutation block, over-billing guard, PO↔Bill 1:1 reconciliation |
| `po-integrity.spec.ts` | PO document integrity across approval steps |
| `po-load.spec.ts` | **Load**: 20 concurrent PO submissions within 60s SLA; response-time degradation ≤ 5× sequential baseline |
| `po-partial-release.spec.ts` | Partial PO receipt tracks remaining unreceived quantity |
| `po-payment-attacks.spec.ts` | Double-payment prevention, overpayment rejection |
| `po-period-control.spec.ts` | Period control rejects out-of-period dated POs and bills |
| `po-security.spec.ts` | Injection attacks, auth bypass on purchase endpoints |
| `po-split-bill.spec.ts` | Split bill via `received_purchase_order_items` path (4+6 batches) — stock verified; over-receive logged as `[KNOWN_BUG]` |
| `po-stress.spec.ts` | **Stress**: 6 financial edge cases — overpayment, double-billing, ghost payment, bill reversal + stock rollback, partial payment drift, orphan bill after PO cancel |
| `procurement-accounting-logic.spec.ts` | Approved bill posts COGS debit + vendor outstanding balance increases |

### Inventory (`tests/inventory/`)
| File | Coverage |
|------|----------|
| `inv-boundary-attack.spec.ts` | **Security/Boundary**: zero-qty, float-qty, massive-negative, zero-unit-cost WAC guard, concurrent adjustments with lock-contention retry |
| `inv-costing-audit.spec.ts` | 7-stage WAC and FIFO cost validation across purchases, sales, adjustments |
| `inv-concurrency.spec.ts` | **Concurrency**: 2 concurrent +10 adjustments → `initialStock + 20` verified via `pollStockAPI`; re-auth on 401 |
| `inv-fifo-layers.spec.ts` | FIFO layer integrity — PO receipt layer accumulation + SO release layer drain with `fifo_consumed_layers` verification |
| `inv-integrity.spec.ts` | Inventory document integrity, negative stock prevention |
| `inv-lifecycle.spec.ts` | Full item lifecycle: create → adjust → sell → verify |
| `inv-load.spec.ts` | **Load**: 10 concurrent +5 adjustments → net +50 stock; 10 concurrent -2 adjustments on 20-unit stock → floor ≥ 0 |
| `inv-logic.spec.ts` | Stock calculation logic, location-based isolation |
| `inv-management.spec.ts` | Item management CRUD, category and warehouse assignment |
| `inv-security.spec.ts` | Injection and auth attacks on inventory endpoints |

### HR (`tests/hr/`)
| File | Coverage |
|------|----------|
| `hr-employees.spec.ts` | Employee CRUD, roster validation, org chart integrity, duplicate email guardrail, UI page load |
| `hr-lifecycle.spec.ts` | Full multi-employee lifecycle — create (3 sequential) → contract → pay structure → payroll run → approve; 5-retry fallback |
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
| `line-item-miscellaneous-audit.spec.ts` | Line Item modal audit across SO/Invoice/Receipt/PO/Bill/Payment — UI + API, inventory + miscellaneous lines, multi-line totals, zero-qty, negative price, discount, partial/full/multi-bill payment (30+ tests) |
| `rbac-user-security.spec.ts` | **Security**: duplicate email, missing `x-company`, invalid company, tampered JWT, notification isolation, auditor RBAC privilege escalation |

---

## ⚡ Concurrency & Load Coverage Summary

### Concurrency Tests (Race-Condition Guardrails)

| File | Scenario | Concurrency | Assertion |
|------|----------|-------------|-----------|
| `so-concurrency.spec.ts` | Duplicate receipt race | 2 concurrent `POST /receipts` | AR not over-credited |
| `so-concurrency.spec.ts` | Invoice stock double-spend | 2 concurrent `POST /invoices` | Approval layer blocks second |
| `po-concurrency.spec.ts` | Duplicate bill payment race | 2 concurrent `createBillPaymentAPI` | Only 1 payment approved |
| `po-concurrency.spec.ts` | Concurrent bill approvals | 2 concurrent `advanceDocumentAPI` | Stock = startStock + 10 |
| `inv-concurrency.spec.ts` | Concurrent stock adjustments | 2 concurrent `adjustStockAPI` | Stock = initialStock + 20 |
| `inv-boundary-attack.spec.ts` | Concurrent adjustments (boundary) | 2 concurrent `POST /inventory-adjustments` | Stock = 20, retry on lock contention |

**Implementation pattern**: `Promise.allSettled([...])` fires both requests simultaneously. Results are inspected — if both succeed, both are advanced to `approved` and the final state is polled. Any negative balance, over-credit, or stock desync throws `[CRITICAL_LOGIC_BUG]`.

### Load Tests (Throughput & SLA)

| File | Scenario | Concurrency | SLA / Assertion |
|------|----------|-------------|-----------------|
| `so-load.spec.ts` | Concurrent invoice creation | 10 | All distinct IDs, ≤ 1 transient failure |
| `so-load.spec.ts` | Concurrent invoice approval + AR balance | 5 | AR total = 5 × unitPrice |
| `po-load.spec.ts` | Concurrent PO creation | 20 | All succeed within 60s |
| `po-load.spec.ts` | Sequential vs burst degradation | 3 baseline / 10 burst | Degradation ≤ 5× |
| `inv-load.spec.ts` | Concurrent +5 adjustments | 10 | Net stock = +50 |
| `inv-load.spec.ts` | Concurrent -2 adjustments | 10 | Stock ≥ 0 (floor enforced) |

**Implementation pattern**: `apiLoginSetup` acquires a single token per worker. `DateHelper.clearCache()` ensures all concurrent calls use the same fiscal date. `Promise.allSettled` collects all results; `passed`/`failed` counts are logged. Known ERP constraints (e.g. `unique_po_company` sequence collision) are documented as `[KNOWN_BUG]` and excluded from hard failure counts.

### Stress Tests (Financial Edge Cases)

`po-stress.spec.ts` — 6 scenarios:

| # | Scenario | Expected | Actual ERP Behaviour |
|---|----------|----------|----------------------|
| 1 | Overpayment (2× bill total) | Rejected | **BUG**: accepted, balance goes negative |
| 2 | Double-billing same PO | Rejected | **BUG**: second bill created and approved |
| 3 | Ghost payment on fully-paid bill | Rejected | Blocked (E2888) |
| 4 | Bill reversal after payment | Stock + ledger rollback | Pass after void-then-reverse |
| 5 | 3 partial payments (3000+3000+3000) | Balance = 0 | Pass (drift ≤ 0.01) |
| 6 | Cancel PO after linked bill approved | Bill stays `approved` | Pass |

---

## 🧩 POM & Library Architecture

| Path | Description |
|------|-------------|
| `pages/AppManager.ts` | Central facade — wires all API and UI modules |
| `pages/ProjectPage.ts` | Project UI POM |
| `pages/SalesPage.ts` | Sales UI POM |
| `pages/PurchasePage.ts` | Purchase UI POM |
| `pages/InventoryPage.ts` | Inventory UI POM |
| `pages/components/SharedUI.ts` | Shared UI components — approval flow, journal entry capture, ledger verification |
| `lib/api/SalesAPI.ts` | Sales REST API — SO/invoice/receipt CRUD, metadata discovery |
| `lib/api/PurchaseAPI.ts` | Purchase REST API — PO/bill/payment CRUD, `getPoReceiveStatusAPI` dual-source fallback |
| `lib/api/InventoryAPI.ts` | Inventory REST API — item CRUD, adjustment, costing, FIFO layer inspection; re-auth on 401 |
| `lib/api/HrAPI.ts` | HR REST API — employee, contract, payroll, timesheet, leave CRUD; proactive JWT refresh; 5-retry employee lookup |
| `lib/api/ProjectAPI.ts` | Project REST API — project CRUD, workspace/metadata discovery, auto-creation |
| `lib/auth.ts` | Authentication — API login, token injection, company switching |
| `lib/base-page.ts` | Base utilities — `advanceDocumentAPI` (re-auth on 401), `safeGet` (retry/backoff), date helpers, account balance queries |
| `lib/utils/apiLoginSetup.ts` | Shared login helper for load/concurrency specs — single token per worker |
| `lib/utils/Logger.ts` | Structured logger with colour, timestamp, DEBUG gating |
| `lib/utils/DateHelper.ts` | Fiscal date resolver with cache + `clearCache()` for load test isolation |
| `lib/utils/perf.ts` | Performance timing utilities |

---

## 📊 Reporters & Dashboard

| Path | Description |
|------|-------------|
| `reporters/module-counter.ts` | Per-module pass/fail/skip statistics with execution time |
| `reporters/dashboard.ts` | Integrated HTML dashboard generator |
| `reporters/summary.ts` | CI summary reporter |
| `scripts/results.js` | Parses `playwright-results.json` → `results.json` with module breakdown, blocker deduplication, Allure URL mapping |
| `scripts/qa-dashboard.html` | Live SPA dashboard — KPIs, trend charts, FIFO risk rows, occurrence deduplication badges, theme switcher |

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

**Playwright config**: 4 workers · 120s timeout · 0 retries · JSON + Allure reporters · 6 project groups (Sales, Purchase, Inventory, HR, Project-Management, Cross-Module)

---

## 🐛 Known ERP Bugs Discovered

| # | Module | Bug | Severity | Status |
|---|--------|-----|----------|--------|
| 1 | Purchase | System allows billing beyond 100% of PO quantity | High | Open |
| 2 | Purchase | Future-dated bills approved — balance sheet manipulation vector | High | Open |
| 3 | Purchase | Same PO can be billed twice — duplicate AP liability | High | Open |
| 4 | Purchase | Overpayment accepted — bill balance goes negative (vendor credit injection) | High | Open |
| 5 | Sales | Overpayment receipt stored as `amount=0` — silent accounting black hole | High | Open |
| 6 | Sales | Double-receipt accepted on fully-paid invoice — duplicate AR credit | High | Open |
| 7 | Sales | `net_due` reflects `unit_cost` not `unit_price` — AR understated | Medium | Open |
| 8 | Inventory | E1481 deadlock under concurrent `advance` — lost update on stock | High | Open |
| 9 | Inventory | Back-dated stock adjustments from closed periods accepted | High | Open |
| 10 | Inventory | Float-quantity adjustment stored as fractional — WAC costing corrupted | Medium | Open |
| 11 | HR | `GET /payroll-runs/{id}/employees` always returns `total=1` | Medium | Open |
| 12 | HR | `POST /employees` returns `null` response body | Low | Open |
| 13 | RBAC | Auditor role can create Sales Orders — privilege escalation | High | Open |

---

## 🚧 Known Limitations

- **UI-POM-10 (Project form creation via POM)**: Chakra UI popover fields update display text only — React internal state does not reflect selection. Pending network payload intercept.
- **Database Indexing Lag**: Ledger views exhibit up to 15s latency under parallel load — managed via polling retry (15 retries, 2–5s waits).
- **PO Over-Receive**: ERP does not block bill creation beyond PO quantity — logged as `[KNOWN_BUG]`, CI green.
- **`unique_po_company` constraint**: ERP sequence not atomic under concurrent load — duplicate PO number collisions logged as `[KNOWN_BUG]` in `po-load.spec.ts`.

---

## ✅ Roadmap

- [ ] **UI-POM-10**: Intercept `fetch`/XHR on manual submit to capture payload, replicate via `page.evaluate` React state dispatch
- [ ] **Swagger-Driven API Layer**: Generated API clients for 100% type-accuracy
- [ ] **Visual Regression**: Screenshot-diffing for the Executive Analytics Dashboard
- [x] **Load Tests**: `so-load`, `po-load`, `inv-load` — throughput + SLA assertions
- [x] **Boundary Attack Suite**: `inv-boundary-attack` — zero-qty, float-qty, massive-negative, zero-cost WAC guard
- [x] **Receipt Overpayment Integrity**: `so-receipt-overpayment` — 3 overpayment/double-receipt scenarios
- [x] **RBAC Security Audit**: `rbac-user-security` — 6 auth/tenant isolation checks
- [x] **Line Item & Miscellaneous Audit**: 30+ tests across all 6 document types
- [x] **COGS Journal Fix**: Double-entry balance assertion (Dr == Cr) — schema-agnostic
- [x] **PO Split Bill**: `received_purchase_order_items` path — triggers actual goods receipt
- [x] **PO Doc Integrity**: `getPoReceiveStatusAPI` dual-source fallback + polling loop
- [x] **Inv Concurrency**: Re-auth on 401 in `createInventoryItemAPI`
- [x] **HR Lifecycle**: 5-retry employee lookup + proactive JWT refresh
- [x] **safeGet Resilience**: Retry/backoff on all GET discovery calls
- [x] **FIFO Layer Integrity**: End-to-end `fifo_layers` + `fifo_consumed_layers` verification
- [x] **Workspace Auto-Creation**: `discoverMetadataAPI()` self-heals on fresh environments
- [x] **Project UI Tests**: UI-01→15 (list, form, detail)
- [x] **Dashboard Enhancements**: Hover-reveal Allure links, occurrence deduplication badges, multi-theme switcher

---

## 📋 Changelog

### v7.0.0 — Current
- **New specs**: `so-load`, `po-load`, `inv-load` — load/throughput tests with SLA assertions and degradation ratio checks
- **New specs**: `inv-boundary-attack` — 5 boundary/costing attack scenarios including concurrent adjustment with lock-contention retry
- **New specs**: `so-receipt-overpayment` — overpayment ghost receipt, exact-amount AR settlement, double-receipt guard
- **New specs**: `rbac-user-security` — 6 RBAC/tenant isolation security checks
- **New specs**: `line-item-miscellaneous-audit` — 30+ line item modal tests across all document types
- **`apiLoginSetup`**: new shared utility for load specs — single token per worker, `DateHelper.clearCache()` before burst
- **Known bugs**: expanded from 6 to 13 confirmed ERP defects with severity ratings
- **README**: full concurrency/load/stress coverage table, implementation patterns documented

### v6.0.0
- **so-cogs**: double-entry balance check (total Dr == total Cr)
- **po-split-bill**: rewrote to `received_purchase_order_items` path
- **po-doc-integrity**: `getPoReceiveStatusAPI` fallback + polling loop
- **inv-concurrency**: re-auth on 401 in `createInventoryItemAPI`
- **hr-lifecycle**: 5-retry employee lookup; proactive JWT refresh

### v5.0.0
- safeGet retry/backoff; re-auth on 401 in `advanceDocumentAPI`
- FIFO layer integrity (Scenario A + B)
- HR lifecycle 3-employee payroll with local counter
- Workspace auto-creation; Project UI tests (UI-01→15)
- Dashboard hover-reveal Allure links and theme switcher

---

**Tekleab** — *Precision Automation Engineering*
