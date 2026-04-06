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
npx playwright test                                 # full suite (sequential)
npx playwright test tests/sales --headed            # sales domain only
npx playwright test tests/purchase --headed         # purchase domain only
npx playwright test tests/sales/sales-impact.spec.js --headed  # single test
npx playwright show-report                          # HTML report
```

Tests run sequentially with 1 worker to avoid inventory conflicts. Sales tests run before purchase tests via Playwright project dependencies.

## Test Suite

### Sales Domain (`tests/sales/`)

| Test | What it does |
|:--|:--|
| `sales-impact` | SO + Invoice via API, approve both, verify stock deduction |
| `invoice-reversal` | Create invoice, approve, reverse, verify stock restoration |
| `invoice-receipt-balance` | Partial receipt, verify fractional balance, final settlement |
| `sales-receipt` | Find unpaid invoice, create receipt, verify in customer profile |
| `receipt-reversal` | Create receipt, approve, reverse, verify GL offsets |
| `accounting-logic` | Duplicate invoice allowed, duplicate receipt blocked |
| `customer` | Full CRUD lifecycle with TIN validation |

### Purchase Domain (`tests/purchase/`)

| Test | What it does |
|:--|:--|
| `bill-impact` | Create bill via API, approve, verify stock increase, reverse |
| `purchase-impact` | PO via API → Bill → verify stock addition and ledger entries |
| `purchase-to-bill` | Full PO → Bill lifecycle via UI, verify in vendor profile |
| `payment-cycle` | Find unpaid bill, create payment, verify in vendor profile |
| `vendor` | Full CRUD lifecycle with TIN validation |

## Log Prefix Convention

All tests use a consistent prefix system for CI/CD clarity:

| Prefix | Meaning |
|:--|:--|
| `[STEP]` | Major phase boundary |
| `[INFO]` | Informational detail |
| `[OK]` | Action succeeded |
| `[FAIL]` | Action failed (non-fatal) |
| `[VERIFY]` | Assertion checkpoint |
| `[RESULT]` | Test summary (final line) |

## Project Structure

```
pages/appManager.js          — all ERP interactions (search, approval, API calls)
tests/
  sales/                     — receivables, invoices, receipts, customers
  purchase/                  — payables, bills, purchase orders, vendors
data/address_locations.json  — Ethiopian address data for CRUD tests
playwright.config.js         — sequential execution, sales-first ordering
.env                         — credentials
```

Key implementation details:
- Documents are created via REST API where possible to cut setup time
- Approval flows are handled through the UI to maintain E2E integrity
- Screenshots, video, and traces are captured only on failure
- Sequential execution prevents inventory race conditions

## License

MIT
