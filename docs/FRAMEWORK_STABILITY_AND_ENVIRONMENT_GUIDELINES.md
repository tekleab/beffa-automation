# BEFFA Framework Stability, Multi-Tenancy & Zero-Data Engineering Guidelines

This document provides strict architecture and implementation rules for maintaining test stability across different environments, tenant companies, clean zero-data databases, and asynchronous backend workflows.

---

## 1. Multi-Tenancy & Dynamic Environment Rules

### 1.1 Company Isolation (`x-company`)
* **Never hardcode company names** (e.g. `'BM Tech'`) directly in test cases, fixtures, or API wrappers.
* Always read dynamically from the environment:
  ```typescript
  const company = process.env.BEFFA_COMPANY || 'BM Tech';
  ```
* In browser evaluations, extract the active tenant company from local storage with fallback:
  ```typescript
  const company = await page.evaluate(() => {
    try {
      return localStorage.getItem('currentCompany') || localStorage.getItem('company');
    } catch {
      return null;
    }
  }).catch(() => null) || process.env.BEFFA_COMPANY || 'BM Tech';
  ```
* All API requests must send:
  ```typescript
  headers: {
    'x-company': company,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
  ```

### 1.2 Fiscal Calendar & DateHelper Invariants
* The application runs on the **Ethiopian Calendar (EC)**, Fiscal Year **2019** (yearly period).
* Never hardcode Gregorian dates or assume the system clock year matches the open accounting period.
* Always use `DateHelper.resolve(page)` to obtain in-period dates and transaction timestamps.
* All endpoints accepting fiscal calendar parameters must include:
  ```typescript
  const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  ```

---

## 2. Zero-Data & Dynamic On-Demand Provisioning

### 2.1 Never Assume Existing Seed Data
* Fresh staging environments or newly provisioned company tenants will have empty tables (no items, customers, employees, or inventory stock).
* Tests must never fail with "Item not found" or "No customer available".
* Always use **on-demand auto-provisioning fixtures**:
  * **Items with stock**: Use `app.api.inventory.createFreshItemWithStockAPI({ cost_method_code, quantity, unit_cost })`.
  * **Customers / Metadata**: Use `app.api.project.discoverMetadataAPI()`, which checks for existing records and automatically provisions defaults if missing.
  * **Transfer destinations**: Use `app.api.inventory.ensureTransferDestinationAPI(fromLocId, itemId)`. Gracefully handle single-location environments.

### 2.2 Complete Isolation
* Each parallel worker and test run must operate on isolated records with timestamped / randomized IDs:
  ```typescript
  const uniqueName = `E2E-${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
  ```

---

## 3. Pagination, Sorting & API Query Guardrails

### 3.1 Total Pages vs Total Records
* In the BEFFA Go API backend:
  * `pagination.total` is the **total number of records**, NOT the total number of pages.
  * `pagination.pageSize` is the page size limit.
* To safely calculate the total number of pages:
  ```typescript
  const totalRecords = parseInt(json.pagination?.total || json.total || '0', 10);
  const pageSize = parseInt(json.pagination?.pageSize || '100', 10);
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  ```

### 3.2 Backend Empty Query Parameter Constraint
* The Go backend treats empty query parameters (e.g. `project_status=`, `search=`) as literal filter conditions:
  `WHERE project_status = ''`
  rather than omitting the filter!
* When testing UI pages where frontend state initializes empty string query params:
  * Strip empty query parameters in route hooks:
    ```typescript
    await page.route('**/api/projects?*', async (route) => {
        const u = new URL(route.request().url());
        if (u.searchParams.get('project_status') === '') {
            u.searchParams.delete('project_status');
        }
        await route.continue({ url: u.toString() });
    });
    ```
* In API wrappers, always use `pageSize=100` when polling or searching for newly appended records.

---

## 4. SPA Navigation & Workspace Loading Timing

### 4.1 The "Preparing your workspace..." Screen
* After login, the frontend renders an overlay:
  `Loading... Preparing your workspace...`
  while loading company settings, currencies, permissions, and period controls (typically 5–10s).
* **Never use short timeouts (<15s)** immediately after navigation.
* **Never call uncoordinated reloads** like `page.reload({ waitUntil: 'commit' })` which resets navigation mid-stream.
* Always wait for workspace initialization to complete before querying UI controls:
  ```typescript
  async function gotoAuthenticatedPage(page: Page, path: string) {
      await page.goto(path);
      await page.waitForSelector('text=Preparing your workspace', { state: 'detached', timeout: 30000 }).catch(() => {});
      await page.waitForSelector('main, table thead th, [role="columnheader"], h1', { timeout: 30000 }).catch(() => {});
  }
  ```

### 4.2 Accessible, Specific Selectors
* Avoid broad, non-specific selectors like `page.locator('svg, canvas').first()`, which often resolve to hidden sidebar icons.
* Use role-based accessible locators:
  ```typescript
  await expect(page.getByRole('heading', { name: /Organization Chart/i }).first()).toBeVisible({ timeout: 20000 });
  await expect(page.getByRole('tab', { name: /Organization Chart/i }).first()).toBeVisible({ timeout: 10000 });
  ```

---

## 5. Document Advancement & Asynchronous State Propagation

### 5.1 Document Approval Verification
* Documents in BEFFA advance through approval workflows:
  `draft` → `pending_verification` → `approved` / `completed`.
* Never assume calling `advanceDocumentAPI` synchronously guarantees immediate approval.
* Always verify the document has reached `approved` / `completed` status:
  ```typescript
  for (let poll = 0; poll < 6; poll++) {
      const resp = await this.safeGet(`${this.apiBase}/${docType}/${docId}?${params}`, { headers });
      if (resp.ok()) {
          const doc = await resp.json();
          if (doc.status === 'approved' || doc.status === 'completed') break;
      }
      await this.page.waitForTimeout(1000);
  }
  ```

### 5.2 Dynamic User ID Resolution
* When advancing documents, resolve the active user dynamically from `/users/me`:
  ```typescript
  const meResp = await this.page.request.get(
      `${this.apiBase}/users/me?year=${year}&period=${period}&calendar=${calendar}`,
      { headers }
  );
  if (meResp.ok()) {
      const meData = await meResp.json();
      submittedTo = meData?.user?.id || meData?.id || meData?.user_id;
  }
  ```
* Avoid hardcoding static user IDs across environments where user UUIDs differ.

### 5.3 Stock Propagation Polling
* Move orders debit the source location and credit the destination location asynchronously.
* Always use `pollStockAPI` with a reasonable retry interval (e.g., up to 30s) instead of immediate assertions.

