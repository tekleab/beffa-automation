# BEFFA ERP — Automated Testing

Playwright-based E2E test suite for the BEFFA ERP system. Covers financial workflows, inventory tracking, and accounting verification against a live environment.

## Setup

```bash
git clone https://github.com/tekleab/befffa-automation.git
cd befffa-automation
npm install
npx playwright install
```

Create `.env` in root:
```
BASE_URL=http://your-erp-url:4173
BEFFA_USER=your_username
BEFFA_PASS=your_password
```

## Running

```bash
npx playwright test                                    # full suite
npx playwright test payment-cycle.spec.js --headed     # single test, visible browser
npx playwright show-report                             # HTML report
```

CI runs with 2 workers to avoid overloading the remote server. Locally it defaults to 3.

## What's Tested

Tests cover the core financial and supply chain modules. Each test creates real documents, pushes them through the full approval chain, and verifies downstream effects (inventory counts, ledger entries).

| Test | What it does |
|:--|:--|
| `payment-cycle` | Picks an unpaid bill, creates a vendor payment, verifies it in the vendor profile |
| `sales-impact` | Creates SO + Invoice via API, approves both, checks stock deduction and ledger |
| `bill-impact` | Creates PO + Bill via API, approves both, checks stock addition and ledger |
| `reversal-impact` | Reverses an approved invoice, verifies inventory is restored |
| `purchase-order-to-bill` | Full procurement flow: PO → GRN → Bill |
| `sales-receipt-workflow` | Full sales flow: SO → Invoice → Receipt |
| `invoice-receipt-balance` | High-speed API logic validating rigorous fractional balance computations |
| `customer-accounting-duplication`| Dedicated Accounting Compliance sequence; strictly enforces Double-Entry business logic restrictions |
| `customer` | Creates a customer, checks profile data and lifecycle |
| `vendor` | Creates a vendor, checks account integrity |

## Full ERP Module Map

Below is the complete BEFFA ERP module structure. Checked items have test coverage today, unchecked items are planned.

**Accounting**
- [x] General Ledger — Chart of Accounts, General Journal
- [ ] Period Control
- [x] Account Payables — Bills, Payments
- [x] Account Receivables — Invoices, Receipts
- [ ] Asset — Asset Classes, Asset Items
- [ ] Budgeting — Posted Budgets, Calendars, Limits, Worksheets, Encumbrances, Controls, Supplements, Adjustments
- [ ] Account Reconciliation — Statements, Reconciliation, History

**CRM / Sales**
- [x] Sale Orders
- [x] Customers
- [x] Vendors

**HRM**
- [ ] Organization Chart, Employees, Timesheets, Attendances, Leaves
- [ ] Payroll — Payroll Run, Payroll Settings

**Project Management**
- [ ] Workspaces, Projects

**SCM (Supply Chain)**
- [x] Inventory — Items, Adjustments
- [ ] Warehouse Management, Locations, Shipments
- [ ] Move Orders — Location Transfer, Internal Request
- [x] Procurement — Purchase Orders

**Lease Management**
- [ ] Leases

**Service Management**
- [ ] Services, Service Events

**Reports**
- [ ] Financial Statements, Sales, Purchases, Budget Report, Payroll

**Settings**
- [ ] User Management

## Project Structure

```
pages/appManager.js       — all ERP interactions (search, approval, API calls)
tests/e2e/                — test files
playwright.config.js      — 2 workers (CI), 3 (local), failure-only capture
.env                      — credentials
```

Key implementation details:
- Documents are created via REST API where possible to cut setup time
- Approval flows are handled through the UI to maintain E2E integrity
- Screenshots, video, and traces are captured only on failure to keep runs fast

## License

MIT
