# BEFFA ERP High-Integrity Automation Suite 🏗️

[![CI Status](https://github.com/tekleab/beffa-automation/workflows/Playwright%20Tests/badge.svg?branch=main)](https://github.com/tekleab/beffa-automation/actions/workflows/playwright.yml)
[![Live Dashboard](https://img.shields.io/badge/dashboard-live-blue)](https://tekleab.github.io/beffa-automation)
[![Playwright](https://img.shields.io/badge/playwright-1.40.0-2EAD33)](https://playwright.dev)

> **Author**: Tekleab
> **Version**: 4.0.0
> **Purpose**: Technical Audit Suite for Financial & Inventory Reconciliation

A high-performance Playwright-based testing framework designed for the BEFFA ERP environment. This suite focuses on **Business Logic Integrity**, utilizing an **API/UI Hybrid Architecture** that prioritizes both execution speed and data reconciliation across integrated workflows.

---

## 🏗️ Engineering Architecture

The suite is designed for **deterministic results** in a complex, multi-tenant environment:

*   **API/UI Hybrid Workflows**: Tests utilize a REST API layer to instantly establish document states (SO, PO, Invoices), while retaining surgical UI verification for critical user-facing transitions.
*   **Self-Healing Fallbacks**: If the test runner detects zero active items or stock depletion during setup, the suite dynamically injects a new SKU and pre-stocks 100 units via API. This self-healing fallback ensures the pipeline never crashes due to demo data depletion on clean or newly seeded database environments.
*   **Location-Synchronized Audits**: Every inventory adjustment and sale is strictly locked to a specific `locationId`. This ensures the audit monitors the exact physical shelf affected by the transaction, eliminating stock discrepancies in shared-warehouse environments.
*   **Resilient Search (Omni-Match)**: Financial ledger verification uses a multi-field matching strategy (scanning `bill_no`, `ref`, and `invoice_number`), ensuring the suite remains stable even if the backend schema evolves.
*   **Thread-Safe Parallelism**: Optimized for **3 parallel workers**. Collision avoidance is handled via randomized SKU discovery and isolated location targeting per worker thread.
*   **Structured Logging**: Custom `Logger` utility provides colored, timestamped logs with DEBUG gating for clean CI/CD output.

---

## 🚀 Engineering Signals & Design Strategy

### 1. Failure Isolation & Observability
Every worker failure is isolated for rapid root-cause analysis:
- **Trace Analysis**: Playwright traces are captured for every failure, providing a full timeline of network calls and DOM state.
- **Atomic Reporting**: The Allure deployment uses an atomic directory swap logic in CI to prevent data fragmentation and ensure stable historical trends on GitHub Pages.
- **Structured Logging**: Custom `Logger` utility with color-coded output, timestamps, and environment variable gating (`DEBUG=true`).

### 2. Resilience & Polling Strategy
To handle backend indexing lag during high-frequency DB operations, the suite implements:
- **Strategic Polling**: Forensic probes use up to 15 retries with tactical waits (2-5s) to allow backend ledger indexing to complete.
- **Fail-Safe Capture**: Hybrid methods revert to UI fallbacks if direct API item discovery fails, maximizing the "Pass Rate" while maintaining audit depth.

### 3. CI/CD Integration
- **GitHub Actions**: Fully automated pipeline triggered on every push.
- **Environment Guarding**: Context-aware environment variable mapping ensures stable runs across both `pull_request` and `workflow_dispatch` events.
- **Live Dashboard**: Modern QA CI/CD dashboard with real-time metrics, module breakdown, and 60-second auto-refresh.
- **Dynamic Module Detection**: Dashboard automatically detects and displays new modules without manual configuration.

---

## 📊 QA Dashboard

A premium dark-mode SaaS-style dashboard for monitoring test execution:

### Features
- **Metrics Row**: Total Tests, Pass Rate (color-coded), Failed, Skipped, Avg Duration
- **Module Breakdown**: Dynamic table with sparkline trends for each module (accurately mapped parent-child suites)
- **Charts**: 7-day pass rate trend, failure breakdown donut, duration heatmap (theme adaptive)
- **Theme Switching UI**: Persistent theme selector supporting Midnight Amethyst, Cyberpunk Emerald, Nordic Steel, and Slate Night color palettes.
- **Critical Blockers**: Deduplicated blocker tracking with severity badges
- **CI Run History**: Last 10 runs with commit SHA, trigger, duration, and status
- **Live Updates**: 60-second polling with cache-busting for real-time data

### Access
- Local: Open `scripts/qa-dashboard.html` in a browser
- CI: Deployed to GitHub Pages at `https://<owner>.github.io/<repo>/`

### Data Flow
1. Playwright generates `playwright-results.json` via JSON reporter
2. `scripts/generate-results.js` parses results and outputs `scripts/results.json`
3. GitHub Actions commits `results.json` to the repository
4. Dashboard fetches `results.json` with cache-busting query parameter

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/tekleab/beffa-automation.git
cd beffa-automation

# Copy .env.example to .env and fill in your credentials
cp .env.example .env

# Run the tests
npx playwright test
```

---

## 🔧 Configuration

### Environment Variables
- `BASE_URL`: Frontend application URL
- `API_URL`: Backend API URL
- `BEFFA_USER`: BEFFA username
- `BEFFA_PASS`: BEFFA password
- `BEFFA_TOKEN`: Authentication token
- `BEFFA_COMPANY`: Company identifier
- `DEBUG`: Enable debug logging (set to `true` for verbose output)

### Playwright Configuration
- **Reporter**: JSON output to `playwright-results.json`
- **Workers**: 4 (parallel execution with collision avoidance via randomized SKU discovery and isolated location targeting)
- **Timeout**: 600 seconds per test
- **Retries**: 0 (fail fast for immediate feedback)

---

## � Testing Best Practices

See `docs/TESTING_BEST_PRACTICES.md` for comprehensive guidelines on:
- Test independence and isolation
- Failure logging and debugging
- Test organization and naming
- API vs UI testing strategies
- Environment variable usage

---

## �🚧 Known Limitations & Roadmap

### Current Limitations
- **Database Indexing Lag**: Certain ledger views exhibit high latency (up to 15s) during peak parallel loads; this is currently managed via the polling retry strategy.
- **UI Grid Density**: Large linked-invoice grids in the Receipt UI can occasionally slow down Playwright-to-DOM resolution; handled via the API-First creation pivot.

### Roadmap
- [ ] **Swagger-Driven API Layer**: Full migration to generated API clients for 100% type-accuracy with the backend.
- [ ] **Visual Regression**: Implementing screenshot-diffing for the Executive Analytics Dashboard.
- [x] **Global Stock Balancer / Self-Healing Fallback**: Fully implemented dynamic inventory replenishment and SKU auto-creation/stocking inside `captureRandomItemDataAPI` to prevent test blockers in zero-stock environments.
- [x] **Dashboard Enhancements**: Integrated a persistent multi-theme switcher, parent-to-child module mapping fixes, and dynamic Chart.js canvas adaptations.

---
**Tekleab** — *Precision Automation Engineering*
