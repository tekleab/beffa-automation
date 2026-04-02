# BEFFA ERP Automation Suite

## 🚀 Overview
Production-grade E2E test suite for the **BEFFA ERP** system built with Playwright. Validates real-world business workflows across Sales, Procurement, Payments, and Accounting — ensuring data integrity, inventory accuracy, and ledger consistency.

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
- **Browsers**: Chromium & Firefox (auto-installed by Playwright)

---

## ⚙️ Setup & Installation

### 1. Clone & Install
```bash
git clone https://github.com/tekleab/befffa-automation.git
cd befffa-automation
npm install
npx playwright install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
BASE_URL=http://157.180.20.112:4173
BEFFA_USER=your_username
BEFFA_PASS=your_password
```

---

## 🧪 Test Catalog (9 Suites)

| Suite | File | Description | Speed |
|:--|:--|:--|:--|
| **Payment Cycle** | `payment-cycle.spec.js` | Vendor payment with surgical bill selection & balance validation | UI |
| **Sales Inventory Impact** | `sales-inventory-impact.spec.js` | SO → Invoice → Stock deduction & Ledger verification | ⚡ API+UI |
| **Purchase Inventory Impact** | `purchase-inventory-impact.spec.js` | PO → GRN → Stock addition verification | UI |
| **Invoice Reversal** | `invoice-reversal-impact.spec.js` | Direct invoice reversal with inventory restoration | UI |
| **Receipt Reversal** | `receipt-reversal-impact.spec.js` | Receipt reversal with G/L ledger impact verification | ⚡ API+UI |
| **Sales Receipt Workflow** | `sales-receipt-workflow.spec.js` | Full Sales cycle (SO → Invoice → Receipt) | UI |
| **Purchase Order to Bill** | `purchase-order-to-bill.spec.js` | Full Procurement cycle (PO → GRN → Bill) | UI |
| **Customer Management** | `customer.spec.js` | Customer creation & profile integrity | UI |
| **Vendor Management** | `vendor.spec.js` | Vendor creation & account verification | UI |

---

## 🏃 Running Tests

```bash
# Run all tests (4 workers, Chrome + Firefox)
npx playwright test

# Run a specific test (headed mode)
npx playwright test payment-cycle.spec.js --headed

# Run only on Chromium
npx playwright test --project=chromium

# Run only on Firefox
npx playwright test --project=firefox

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
│   └── appManager.js          # Page Object Model (centralized ERP interactions)
├── tests/
│   └── e2e/                   # All test suites
├── playwright.config.js       # 4 workers, Chrome + Firefox
├── .env                       # Environment variables (not committed)
└── README.md
```

### Key Patterns
- **Smart Search**: Handles reactive ERP lag with character-delete tricks and Enter/Escape commit sequences.
- **Surgical Row Selection**: Ancestor-based checkbox targeting to avoid header interference.
- **API Speed Track**: SO and Invoice creation via direct API calls, with UI-based approval for E2E integrity.
- **Navigation Guards**: URL-based wait conditions to ensure form submissions complete before proceeding.
- **Ledger Verification**: Comma-aware numeric comparison for formatted amounts in accounting tables.

---

## 📊 Configuration

| Setting | Value |
|:--|:--|
| Workers | 4 (parallel) |
| Browsers | Chromium, Firefox |
| Timeout | 10 min per test |
| Retries (CI) | 1 |
| Screenshots | Always |
| Traces | On failure |
| Video | On first retry |

---

## 📄 License
MIT
