# BEFFA ERP Automation Framework

> **Author**: Tekleab
> **Version**: 2.0.0 (TypeScript Edition)
> **Purpose**: Professional E2E Automation for High-Integrity Financial & ERP Workflows

A high-performance, fully-typed Playwright-based automation suite designed for the BEFFA ERP environment. This framework utilizes an advanced **Modular Page Object Model (POM)** with **Facade delegation** and **Fast Capture API** optimizations, now running entirely on **TypeScript**.

---

## 🏗️ Architecture Overview

The framework is built for stability, modularity, type-safety, and speed:

*   **TypeScript Core**: 100% of the framework (Page Objects, Library, API clients, and Spec files) mapped to static types, eliminating runtime errors and providing full IDE code completion.
*   **Modular POM**: Business logic is decoupled into domain-specific API engines (`lib/api/`) and UI Objects (`pages/`).
*   **Facade Pattern**: The `AppManager` provides a unified, strictly-typed interface for all tests, ensuring clean orchestration while maintaining scalability.
*   **Fast Capture API**: Eliminates the bottleneck of UI-based data scraping. Stock discovery and initial state verification occur via direct REST API calls, reducing setup time by **70-80%**.

---

## 🚀 Key Features

### 1. High-Concurrency Parallel Execution
Configured with Playwright **Fully Parallel mode**, utilizing **4 workers** simultaneously:
- Independent test isolation allows all domains (Inventory, Purchases, Sales) to run concurrently via API-driven setup.

### 2. Standardized Domain Handling
Consistent test patterns across all major ERP modules, guarded by strict TypeScript generic bounds:
- **Inventory**: Real-time stock adjustments and impact tracking.
- **Payables**: Full P2P cycle (PO ➔ Bill ➔ Payment) with Ledger verification.
- **Receivables**: O2C cycle (SO ➔ Invoice ➔ Receipt) with financial reversal logic.
- **Negative Scenarios**: Deep systemic validation including state violations (draft invoicing), boundary numbers, and data integrity verification.

### 3. CI/CD & Automated Allure Reports to GitHub Pages
- **Continuous Integration**: Uses `.github/workflows/playwright.yml`. Triggered automatically on `push` to main.
- **Hosted Reporting**: Automatically generates an Allure HTML report and pushed directly to `gh-pages`. Viewable globally via a click in your browser without downloading traces locally.
- **Automated Cleanup**: Dedicated `npm run clean` script for purging storage-heavy local traces.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20+)
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
| `npx playwright test` | **Recommended**: Run all 35 tests in full parallel across 4 workers |
| `npm run clean` | Purge performance-heavy test results and traces |
| `npx playwright test --grep @smoke` | Run only the smoke-tagged suite |
| `npx playwright test --grep @regression` | Run only the regression-tagged suite |
| `npx playwright test --grep @negative` | Run API-driven negative edge-case suite |
| `npm run report:allure` | Generate and open local Allure dashboard |
| `npx playwright test <file> --headed` | **Visual Execution / Debugging** |
| `npx tsc --noEmit` | **Type-Check** source code compilation locally |

---

## 📁 Repository Structure

```text
├── .github/
│   └── workflows/
│       └── playwright.yml # CI/CD Config (Allure -> gh-pages)
├── lib/
│   ├── api/            # Typed domain-specific REST API engines
│   └── AuthManager.ts  # High-speed session injection
├── pages/
│   ├── AppManager.ts   # Central Orchestration Facade
│   └── components/
│       └── SharedUI.ts # Common UI approval & flow logic
├── reporters/
│   └── summary-reporter.ts # Custom Playwright CLI output formatting
├── tests/
│   ├── inventory/      # Stock adjustment flows
│   ├── purchase/       # Payables (PO, Bill, Payment)
│   └── sales/          # Receivables (SO, Invoice, Receipt)
├── package.json        # Unified script management
├── playwright.config.ts# Parallel test configuration
└── tsconfig.json       # TypeScript compiler configuration
```

---
**Tekleab** — *Continuous Improvement through Automation Engineering*
