# BEFFA ERP — End-to-End Automation Suite

## 🚀 Overview
Production-grade E2E test suite for the **BEFFA ERP** system built with Playwright. Validates real-world business workflows across Sales, Procurement, Payments, and Accounting — ensuring data integrity, inventory accuracy, and ledger consistency.

> **Scope**: This suite currently covers the core financial and inventory modules. It is designed to scale across the full BEFFA ERP platform as new modules are developed.

---

## 🛠 Tech Stack
| Technology | Purpose |
|:--|:--|
| **Playwright** | E2E Browser Automation |
| **JavaScript (Node.js)** | Test Logic & API Integration |
| **GitHub Actions** | CI/CD Pipeline |
| **Allure** | Visual Test Reporting |
| **Dotenv** | Environment Configuration |

---

## 📋 Prerequisites
- **Node.js** v20.0.0+
- **npm** v10.0.0+

---

## ⚙️ Setup

```bash
git clone https://github.com/tekleab/befffa-automation.git
cd befffa-automation
npm install
npx playwright install
```

Create a `.env` file:
```env
BASE_URL=http://your-erp-url:4173
BEFFA_USER=your_username
BEFFA_PASS=your_password
```

---

## 🧪 Test Coverage

### Current Modules (v1.0)

| Module | Suite | Description | Method |
|:--|:--|:--|:--|
| **Payments** | `payment-cycle.spec.js` | Vendor payment with bill selection & balance validation | UI |
| **Sales** | `sales-inventory-impact.spec.js` | SO → Invoice → Stock & Ledger verification | ⚡ API+UI |
| **Sales** | `sales-receipt-workflow.spec.js` | Full Sales cycle (SO → Invoice → Receipt) | UI |
| **Procurement** | `purchase-order-to-bill.spec.js` | Full Procurement cycle (PO → GRN → Bill) | UI |
| **Procurement** | `purchase-inventory-impact.spec.js` | Stock addition on purchase receipt | UI |
| **Reversals** | `invoice-reversal-impact.spec.js` | Invoice reversal with inventory restoration | UI |
| **Reversals** | `receipt-reversal-impact.spec.js` | Receipt reversal with G/L ledger impact | ⚡ API+UI |
| **Master Data** | `customer.spec.js` | Customer creation & profile integrity | UI |
| **Master Data** | `vendor.spec.js` | Vendor creation & account verification | UI |

### Future Expansion (Roadmap)

| Module | Planned Coverage |
|:--|:--|
| **Fixed Assets** | Asset registration, depreciation, disposal |
| **HR & Payroll** | Employee onboarding, salary processing, leave management |
| **Budget Management** | Budget creation, allocation, variance tracking |
| **Tax & Compliance** | WHT calculation, VAT reporting, fiscal year close |
| **Multi-Currency** | Foreign exchange transactions, rate adjustments |
| **Reporting** | Trial balance, P&L, balance sheet accuracy |
| **User Management** | Role-based access control, permission validation |

---

## 🏃 Running Tests

```bash
# Run all tests (2 workers in CI, 3 locally)
npx playwright test

# Run a specific test
npx playwright test payment-cycle.spec.js --headed

# Show HTML report
npx playwright show-report

# Generate Allure report
npx allure generate allure-results --clean && npx allure open
```

---

## 🏗 Architecture

```
beffa-automation/
├── pages/
│   └── appManager.js          # Page Object Model (all ERP interactions)
├── tests/
│   └── e2e/                   # All test suites (9 files)
├── playwright.config.js       # CI: 2 workers | Local: 3 workers
├── .env                       # Credentials (not committed)
├── .github/
│   └── workflows/             # CI/CD pipeline
└── README.md
```

### Core Patterns
- **Page Object Model** — Centralized `AppManager` class for all ERP interactions
- **Smart Search** — Handles reactive UI lag with retry and commit sequences
- **API Speed Track** — SO/Invoice/Receipt creation via REST API for fast setup
- **Surgical Selection** — Ancestor-based checkbox targeting to avoid header clicks
- **Navigation Guards** — URL-based waits to ensure form submission completion
- **Ledger Verification** — Comma-aware numeric comparison for accounting tables

---

## 📊 CI/CD Configuration

| Setting | CI | Local |
|:--|:--|:--|
| Workers | 2 | 3 |
| Browser | Chromium | Chromium |
| Retries | 1 | 0 |
| Timeout | 10 min/test | 10 min/test |
| Screenshots | Always | Always |
| Traces | On failure | On failure |

> **Why 2 workers in CI?** ERP tests hit a shared remote server. More workers means more concurrent connections, which increases timeout risk under network latency.

---

## 📄 License
MIT
