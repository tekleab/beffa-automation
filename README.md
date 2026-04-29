# BEFFA ERP High-Integrity Automation Suite 🏗️

> **Author**: Tekleab
> **Version**: 3.0.0
> **Purpose**: Technical Audit Suite for Financial & Inventory Reconciliation

A high-performance Playwright-based testing framework designed for the BEFFA ERP environment. This suite focuses on **Business Logic Integrity**, utilizing an **API/UI Hybrid Architecture** that prioritizes both execution speed and data reconciliation across integrated workflows.

---

## 🏗️ Engineering Architecture

The suite is designed for **deterministic results** in a complex, multi-tenant environment:

*   **API/UI Hybrid Workflows**: Tests utilize a REST API layer to instantly establish document states (SO, PO, Invoices), while retaining surgical UI verification for critical user-facing transitions.
*   **Location-Synchronized Audits**: Every inventory adjustment and sale is strictly locked to a specific `locationId`. This ensures the audit monitors the exact physical shelf affected by the transaction, eliminating stock discrepancies in shared-warehouse environments.
*   **Resilient Search (Omni-Match)**: Financial ledger verification uses a multi-field matching strategy (scanning `bill_no`, `ref`, and `invoice_number`), ensuring the suite remains stable even if the backend schema evolves.
*   **Thread-Safe Parallelism**: Optimized for **3 parallel workers**. Collision avoidance is handled via randomized SKU discovery and isolated location targeting per worker thread.

---

## 🚀 Engineering Signals & Design Strategy

### 1. Failure Isolation & Observability
Every worker failure is isolated for rapid root-cause analysis:
- **Trace Analysis**: Playwright traces are captured for every failure, providing a full timeline of network calls and DOM state.
- **Atomic Reporting**: The Allure deployment uses an atomic directory swap logic in CI to prevent data fragmentation and ensure stable historical trends on GitHub Pages.

### 2. Resilience & Polling Strategy
To handle backend indexing lag during high-frequency DB operations, the suite implements:
- **Strategic Polling**: Forensic probes use up to 15 retries with tactical waits (2-5s) to allow backend ledger indexing to complete.
- **Fail-Safe Capture**: Hybrid methods revert to UI fallbacks if direct API item discovery fails, maximizing the "Pass Rate" while maintaining audit depth.

### 3. CI/CD Integration
- **GitHub Actions**: Fully automated pipeline triggered on every push.
- **Environment Guarding**: Context-aware environment variable mapping ensures stable runs across both `pull_request` and `workflow_dispatch` events.

---

## 🚧 Known Limitations & Roadmap

### Current Limitations
- **Database Indexing Lag**: Certain ledger views exhibit high latency (up to 15s) during peak parallel loads; this is currently managed via the polling retry strategy.
- **UI Grid Density**: Large linked-invoice grids in the Receipt UI can occasionally slow down Playwright-to-DOM resolution; handled via the API-First creation pivot.

### Roadmap
- [ ] **Swagger-Driven API Layer**: Full migration to generated API clients for 100% type-accuracy with the backend.
- [ ] **Visual Regression**: Implementing screenshot-diffing for the Executive Analytics Dashboard.
- [ ] **Global Stock Balancer**: A pre-test hook to dynamically re-stock target SKUs via API to prevent inventory exhaustion during long CI runs.

---
**Tekleab** — *Precision Automation Engineering*
