# BEFFA ERP Automation Framework

> **Author**: Tekleab
> **Version**: 1.0.0
> **Purpose**: Professional E2E Automation for High-Integrity Financial & ERP Workflows

A high-performance, modular Playwright-based automation suite designed for the BEFFA ERP environment. This framework utilizes an advanced **Modular Page Object Model (POM)** with **Facade delegation** and **Fast Capture API** optimizations.

---

## 🏗️ Architecture Overview

The framework is built for stability, modularity, and speed:

*   **Modular POM**: Business logic is decoupled into domain-specific API engines (`lib/api/`) and Page Objects (`pages/`).
*   **Facade Pattern**: The `AppManager` provides a unified interface for all tests, ensuring clean orchestration while maintaining scalability.
*   **Fast Capture API**: Eliminates the bottleneck of UI-based data scraping. Stock discovery and initial state verification occur via direct REST API calls, reducing setup time by **70-80%**.

---

## 🚀 Key Features

### 1. Ordered Parallel Execution
Configured with Playwright **Project Dependencies** to ensure data integrity across parallel workers:
- **Project Order**: `Inventory` ➔ `Purchases` ➔ `Sales`.
- This ensures that stock is replenished by purchase workflows before it is consumed by sales orders.

### 2. Standardized Domain Handling
Consistent test patterns across all major ERP modules:
- **Inventory**: Real-time stock adjustments and impact tracking.
- **Payables**: Full P2P cycle (PO ➔ Bill ➔ Payment) with Ledger verification.
- **Receivables**: O2C cycle (SO ➔ Invoice ➔ Receipt) with financial reversal logic.

### 3. CI/CD & Artifact Management
- **Automated Cleanup**: Dedicated `npm run clean` script for purging storage-heavy traces and videos.
- **Ordered Bootstrapping**: Integrated `npm run test:ordered` for one-click production-grade regression runs.
- **Custom Reporting**: Optimized for clear visibility into multi-step approval flows.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- Playwright installed and configured

### Installation
```bash
git clone https://github.com/tekleab/befffa-automation.git
cd befffa-automation
npm install
npx playwright install
```

### Configuration
Create a `.env` file in the root directory:
```env
BASE_URL=http://your-erp-url:4173
BEFFA_USER=admin@beffa.com
BEFFA_PASS=your_password
```

---

## 🏃 Running Tests

| Command | Description |
|:--- |:--- |
| `npm run test:ordered` | **Recommended**: Full clean run with parallel ordering |
| `npx playwright test` | Run all tests in parallel (project-ordered) |
| `npm run clean` | Purge performance-heavy test results and traces |
| `npm run test:regression` | Run only the regression-tagged suite |
| `npm run report:allure` | Generate and open the enhanced Allure dashboard |
| `npx playwright test <file> --project=Fast-Debug --headed` | **Isolated Local Run** (1 test, 1 worker, no dependencies) |
| `npx playwright test --project=Sales` | **CI/CD Regression** (Runs Inventory ➔ Purchase ➔ Sales) |
| `npx playwright show-report` | Open the visualized HTML report |

---

## 📁 Repository Structure

```text
├── lib/
│   ├── api/            # Domain-specific REST API engines
│   └── AuthManager.js  # High-speed session injection
├── pages/
│   ├── AppManager.js   # Central Orchestration Facade
│   └── SharedUI.js     # Common UI approval & flow logic
├── tests/
│   ├── inventory/      # Stock adjustment flows
│   ├── purchase/       # Payables (PO, Bill, Payment)
│   └── sales/          # Receivables (SO, Invoice, Receipt)
├── package.json        # Unified script management
└── playwright.config.js # Project-level parallel dependency config
```

---
**Tekleab** — *Continuous Improvement through Automation Engineering*
