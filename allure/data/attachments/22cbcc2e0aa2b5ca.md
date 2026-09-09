# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/project-ui-form.spec.ts >> Project Management: UI Form @project @smoke >> UI-10: Add Project button navigates to /projects/new
- Location: tests/project/project-ui-form.spec.ts:46:9

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=f1e1]:
  - generic [ref=f1e5]:
    - generic [aria-hidden] [ref=f1e6]:
      - generic [ref=f1e7]: Enterprise
      - textbox [ref=f1e14]:
        - /placeholder: Search tasks
      - generic [ref=f1e15]:
        - navigation [ref=f1e17]:
          - link [ref=f1e18] [cursor=pointer]:
            - /url: /dashboard
            - paragraph [ref=f1e21]: Dashboard
        - generic [ref=f1e23] [cursor=pointer]:
          - paragraph [ref=f1e26]: Accounting
          - paragraph [ref=f1e27]:
            - button [ref=f1e28]
        - generic [ref=f1e32] [cursor=pointer]:
          - paragraph [ref=f1e35]: Account Reconciliation
          - paragraph [ref=f1e36]:
            - button [ref=f1e37]
        - generic [ref=f1e41] [cursor=pointer]:
          - paragraph [ref=f1e44]: CRM
          - paragraph [ref=f1e45]:
            - button [ref=f1e46]
        - generic [ref=f1e50] [cursor=pointer]:
          - paragraph [ref=f1e53]: HRM
          - paragraph [ref=f1e54]:
            - button [ref=f1e55]
        - generic [ref=f1e59] [cursor=pointer]:
          - paragraph [ref=f1e62]: Project Management
          - paragraph [ref=f1e63]:
            - button [ref=f1e64]
        - generic [ref=f1e68] [cursor=pointer]:
          - paragraph [ref=f1e71]: SCM
          - paragraph [ref=f1e72]:
            - button [ref=f1e73]
        - generic [ref=f1e77] [cursor=pointer]:
          - paragraph [ref=f1e80]: Lease Management
          - paragraph [ref=f1e81]:
            - button [ref=f1e82]
        - generic [ref=f1e86] [cursor=pointer]:
          - paragraph [ref=f1e89]: Service Management
          - paragraph [ref=f1e90]:
            - button [ref=f1e91]
        - generic [ref=f1e95] [cursor=pointer]:
          - paragraph [ref=f1e98]: Report
          - paragraph [ref=f1e99]:
            - button [ref=f1e100]
      - generic [ref=f1e103]:
        - button [ref=f1e105] [cursor=pointer]:
          - generic:
            - generic:
              - paragraph: Settings
        - navigation [ref=f1e107]:
          - link [ref=f1e109] [cursor=pointer]:
            - /url: /settings/general/users
            - generic [ref=f1e110]:
              - paragraph [ref=f1e114]: User Management
              - button [ref=f1e115]
        - button [ref=f1e118] [cursor=pointer]: Logout
    - generic [ref=f1e122]:
      - generic [aria-hidden] [ref=f1e123]:
        - generic [ref=f1e124]:
          - img [ref=f1e126]: BT
          - generic [ref=f1e127]:
            - button [ref=f1e128] [cursor=pointer]:
              - generic: BM Tech
            - generic [ref=f1e132] [cursor=pointer]:
              - button [ref=f1e133]
              - button [ref=f1e137]
              - button [ref=f1e141]
        - generic [ref=f1e145]:
          - button [ref=f1e146] [cursor=pointer]: New
          - generic [ref=f1e150]: "5"
          - button [ref=f1e157] [cursor=pointer]:
            - paragraph [ref=f1e160]: EC
          - button [ref=f1e161] [cursor=pointer]
          - generic [ref=f1e165] [cursor=pointer]:
            - img [ref=f1e167]: S
            - generic [ref=f1e168]:
              - generic [ref=f1e169]: System
              - paragraph [ref=f1e170]: IT Administrator / User Manager
      - generic [ref=f1e171]:
        - generic [ref=f1e172]:
          - generic [aria-hidden] [ref=f1e173]:
            - navigation [ref=f1e174]:
              - list [ref=f1e175]:
                - navigation [ref=f1e176]:
                  - list [ref=f1e177]:
                    - listitem [ref=f1e178]:
                      - link [ref=f1e179] [cursor=pointer]:
                        - /url: /
                        - text: Home
                      - text: /
                    - listitem [ref=f1e180]:
                      - link [ref=f1e181] [cursor=pointer]:
                        - /url: /project-management
                        - text: Project Management
                      - text: /
                    - listitem [ref=f1e182]:
                      - link [ref=f1e183] [cursor=pointer]:
                        - /url: /project-management/projects
                        - text: Projects
            - button [ref=f1e185] [cursor=pointer]:
              - generic [ref=f1e186]: "2018"
          - generic [ref=f1e191]:
            - group [ref=f1e193]:
              - radio [ref=f1e194] [cursor=pointer]: Advanced filters
              - radio [ref=f1e195] [cursor=pointer]: Command filters
            - generic [ref=f1e197]:
              - generic [aria-hidden] [ref=f1e198]:
                - button [ref=f1e200] [cursor=pointer]: Add Project
                - button [ref=f1e207] [cursor=pointer]: Export
              - generic [ref=f1e211]:
                - toolbar [ref=f1e212]:
                  - generic [aria-hidden] [ref=f1e213]:
                    - textbox [ref=f1e214]:
                      - /placeholder: Search names...
                    - button [ref=f1e215] [cursor=pointer]:
                      - button [ref=f1e216]: Workspace
                    - button [ref=f1e217] [cursor=pointer]:
                      - button [ref=f1e218]: Workflow
                    - button [ref=f1e219] [cursor=pointer]:
                      - button [ref=f1e220]:
                        - generic [ref=f1e221]: Start Date
                    - button [ref=f1e223] [cursor=pointer]:
                      - button [ref=f1e224]:
                        - generic [ref=f1e225]: End Date
                    - button [ref=f1e227] [cursor=pointer]:
                      - button [ref=f1e228]: Status
                    - button [ref=f1e229] [cursor=pointer]:
                      - button [ref=f1e230]:
                        - generic [ref=f1e231]: Progress
                    - button [ref=f1e232] [cursor=pointer]:
                      - button [ref=f1e233]:
                        - generic [ref=f1e234]: Budget
                  - generic [ref=f1e235]:
                    - button [aria-hidden] [ref=f1e236] [cursor=pointer]:
                      - button [ref=f1e237]: Sort
                    - status [ref=f1e238]
                    - button [aria-hidden] [ref=f1e239] [cursor=pointer]:
                      - combobox [ref=f1e240]: View
                - table [ref=f1e243]:
                  - rowgroup [ref=f1e244]:
                    - row [ref=f1e245]:
                      - columnheader [ref=f1e246]:
                        - checkbox [ref=f1e247] [cursor=pointer]
                      - columnheader [ref=f1e248]:
                        - button [ref=f1e249] [cursor=pointer]: Project Name
                      - columnheader [ref=f1e253]:
                        - button [ref=f1e254] [cursor=pointer]: Workspace
                      - columnheader [ref=f1e258]:
                        - button [ref=f1e259] [cursor=pointer]: Workflow
                      - columnheader [ref=f1e263]:
                        - button [ref=f1e264] [cursor=pointer]: Customer
                      - columnheader [ref=f1e268]:
                        - button [ref=f1e269] [cursor=pointer]: Start Date
                      - columnheader [ref=f1e273]:
                        - button [ref=f1e274] [cursor=pointer]: End Date
                      - columnheader [ref=f1e278]:
                        - button [ref=f1e279] [cursor=pointer]: Status
                      - columnheader [ref=f1e283]:
                        - button [ref=f1e284] [cursor=pointer]: Progress
                      - columnheader [ref=f1e288]:
                        - button [ref=f1e289] [cursor=pointer]: Budget
                      - columnheader [ref=f1e293]:
                        - button [ref=f1e294] [cursor=pointer]: Tasks
                      - columnheader [ref=f1e295]
                  - rowgroup [ref=f1e296]:
                    - row [ref=f1e297]:
                      - cell [ref=f1e298]: No results.
                - generic [ref=f1e300]:
                  - generic [ref=f1e301]: 0 of 0 row(s) selected.
                  - generic [ref=f1e302]:
                    - generic [ref=f1e303]:
                      - paragraph [ref=f1e304]: Rows per page
                      - combobox [ref=f1e305] [cursor=pointer]:
                        - generic: "10"
                    - generic [ref=f1e306]: Page 1 of 0
                    - generic [ref=f1e307]:
                      - button [disabled]
                      - button [disabled]
                      - button [disabled]
                      - button [disabled]
        - generic [aria-hidden] [ref=f1e308]: BM Technology © 2026
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
  - dialog [ref=f1e311]:
    - banner [ref=f1e312]: Inactive Period
    - button "Close" [active] [ref=f1e313] [cursor=pointer]
    - generic [ref=f1e316]: Please ensure the selected period is active before proceeding.
    - contentinfo [ref=f1e317]:
      - button "No" [ref=f1e318] [cursor=pointer]
      - button "Yes" [ref=f1e319] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { AppManager } from '../../pages/AppManager';
  3   | 
  4   | /**
  5   |  * =============================================================================
  6   |  * MODULE: Project Management - UI Form & Submission Suite
  7   |  * ARCHITECTURAL SCOPE & COVERAGE:
  8   |  * 1. Add Project button navigates to /projects/new
  9   |  * 2. Form renders all required inputs (name, customer, dates, budget)
  10  |  * 3. Submit button disabled on empty form (error visibility guard)
  11  |  * =============================================================================
  12  |  */
  13  | 
  14  | 
  15  | /**
  16  |  * PROJECT UI FORM — Add Project Form Tests
  17  |  * Route: /project-management/projects/new
  18  |  *
  19  |  * Key selectors (from live probe):
  20  |  *   input#project_name          — Project Name *
  21  |  *   input#ref                   — Project ID *
  22  |  *   select#project_status       — Project Status *
  23  |  *   input#percent_complete      — Percent Completed *
  24  |  *   select#completion_method    — Completion Method *
  25  |  *   input#customer_id           — Project Owner Customer * (popover)
  26  |  *   input#workspace_id          — Project Workspace * (popover)
  27  |  *   input#estimated_revenue     — Estimated Revenue
  28  |  *   input#estimated_expense     — Estimated Expense
  29  |  *   input#project_start_date    — Project Start date (date)
  30  |  *   input#estimated_start_date  — Estimated End date (date, name="estimated_end_date")
  31  |  *   textarea#description        — Description
  32  |  *   input#is_active             — Is Active (checkbox)
  33  |  *   button[type="submit"] "Create project" — disabled=true until required fields filled
  34  |  */
  35  | test.describe('Project Management: UI Form @project @smoke', () => {
  36  | 
  37  |     async function setup(page: any) {
  38  |         const app = new AppManager(page);
  39  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  40  |         const meta = await app.api.project.discoverMetadataAPI();
  41  |         return { app, meta };
  42  |     }
  43  | 
  44  |     // ── UI: ADD PROJECT FORM ────────────────────────────────────────────────────
  45  | 
  46  |     test('UI-10: Add Project button navigates to /projects/new', async ({ page }) => {
  47  |         const { app } = await setup(page);
  48  |         await page.goto('/project-management/projects', { waitUntil: 'commit' });
  49  |         const addBtn = page.getByRole('link', { name: /Add Project/i })
  50  |             .or(page.getByRole('button', { name: /Add Project/i })).first();
  51  |         await addBtn.waitFor({ state: 'visible', timeout: 30000 });
  52  |         await addBtn.click();
> 53  |         await page.waitForURL(url => url.href.includes('/projects/new'), { timeout: 15000 });
      |                    ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  54  |         expect(page.url()).toMatch(/\/projects\/new/);
  55  |     });
  56  | 
  57  |     test('UI-11: Add Project form has all required inputs', async ({ page }) => {
  58  |         const { app } = await setup(page);
  59  |         await page.goto('/project-management/projects/new', { waitUntil: 'commit' });
  60  |         // Text inputs & selects
  61  |         await expect(page.locator('input#project_name')).toBeVisible({ timeout: 30000 });
  62  |         await expect(page.locator('input#ref')).toBeVisible();
  63  |         await expect(page.locator('select#project_status')).toBeVisible();
  64  |         await expect(page.locator('input#percent_complete')).toBeVisible();
  65  |         await expect(page.locator('select#completion_method')).toBeVisible();
  66  |         // Customer & workspace use button triggers (input is hidden until triggered)
  67  |         await expect(page.locator('button#customer_id')).toBeVisible();
  68  |         await expect(page.locator('button#workspace_id')).toBeVisible();
  69  |     });
  70  | 
  71  |     // TODO: UI-POM-10 — Project UI form creation via POM is blocked.
  72  |     // Root cause: Chakra UI popover fields (customer, workspace) update display text only.
  73  |     // React internal state does not reflect the selection in DOM input values, so the
  74  |     // "Create project" submit button remains disabled. Pending network payload intercept
  75  |     // to identify the exact React state mutation mechanism.
  76  |     //
  77  |     // test('UI-POM-10: Create and verify project entirely through the UI form using POM', async ({ page }) => {
  78  |     //     const { app, meta } = await setup(page);
  79  |     //     const projectName = `E2E-UI-POM-${Date.now()}`;
  80  |     //     await app.ui.project.navigateToProjects();
  81  |     //     await app.ui.project.clickAddProject();
  82  |     //     await app.ui.project.fillProjectForm({
  83  |     //         name: projectName,
  84  |     //         customerName: meta.customerName,
  85  |     //         workspaceName: meta.workspaceName,
  86  |     //         estimatedRevenue: 150000,
  87  |     //         estimatedExpense: 60000
  88  |     //     });
  89  |     //     await app.ui.project.clickSave();
  90  |     //     await app.ui.project.navigateToProjects();
  91  |     //     await app.ui.project.verifyInList(projectName);
  92  |     // });
  93  | 
  94  |     // ── UI GUARDRAILS ──────────────────────────────────────────────────────────
  95  | 
  96  |     test('UI-GUARD-01: "Create project" submit button is disabled on empty form', async ({ page }) => {
  97  |         const { app } = await setup(page);
  98  |         await page.goto('/project-management/projects/new', { waitUntil: 'commit' });
  99  | 
  100 |         // Probe confirmed: BTN[71] "Create project" type="submit" disabled=true on empty form
  101 |         const saveBtn = page.locator('button[type="submit"]').filter({ hasText: /Create project/i });
  102 |         await expect(saveBtn).toBeVisible({ timeout: 8000 });
  103 |         await expect(saveBtn).toBeDisabled();
  104 |     });
  105 | });
  106 | 
```