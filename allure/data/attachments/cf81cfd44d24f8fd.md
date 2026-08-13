# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/project-ui-detail.spec.ts >> Project Management: UI Detail & Guardrails @project @ui @smoke @regression @full >> UI-15: Direct URL to non-existent project shows error or redirects
- Location: tests/project/project-ui-detail.spec.ts:100:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e9]:
        - img [ref=e10]
        - generic [ref=e11]: Enterprise
      - generic [ref=e13]:
        - generic:
          - img
        - textbox "Search tasks" [ref=e14]
      - generic [ref=e15]:
        - navigation [ref=e17]:
          - link "Dashboard" [ref=e18] [cursor=pointer]:
            - /url: /dashboard
            - paragraph [ref=e21]: Dashboard
        - generic [ref=e23] [cursor=pointer]:
          - paragraph [ref=e26]: Accounting
          - paragraph [ref=e27]:
            - button "Toggle section" [ref=e28]:
              - img [ref=e29]
        - generic [ref=e32] [cursor=pointer]:
          - paragraph [ref=e35]: Account Reconciliation
          - paragraph [ref=e36]:
            - button "Toggle section" [ref=e37]:
              - img [ref=e38]
        - generic [ref=e41] [cursor=pointer]:
          - paragraph [ref=e44]: CRM
          - paragraph [ref=e45]:
            - button "Toggle section" [ref=e46]:
              - img [ref=e47]
        - generic [ref=e50] [cursor=pointer]:
          - paragraph [ref=e53]: HRM
          - paragraph [ref=e54]:
            - button "Toggle section" [ref=e55]:
              - img [ref=e56]
        - generic [ref=e59] [cursor=pointer]:
          - paragraph [ref=e62]: Project Management
          - paragraph [ref=e63]:
            - button "Toggle section" [ref=e64]:
              - img [ref=e65]
        - generic [ref=e68] [cursor=pointer]:
          - paragraph [ref=e71]: SCM
          - paragraph [ref=e72]:
            - button "Toggle section" [ref=e73]:
              - img [ref=e74]
        - generic [ref=e77] [cursor=pointer]:
          - paragraph [ref=e80]: Lease Management
          - paragraph [ref=e81]:
            - button "Toggle section" [ref=e82]:
              - img [ref=e83]
        - generic [ref=e86] [cursor=pointer]:
          - paragraph [ref=e89]: Service Management
          - paragraph [ref=e90]:
            - button "Toggle section" [ref=e91]:
              - img [ref=e92]
        - generic [ref=e95] [cursor=pointer]:
          - paragraph [ref=e98]: Report
          - paragraph [ref=e99]:
            - button "Toggle section" [ref=e100]:
              - img [ref=e101]
      - generic [ref=e103]:
        - button "Settings" [ref=e105] [cursor=pointer]:
          - generic:
            - generic:
              - img
              - paragraph: Settings
        - navigation [ref=e107]:
          - link "User Management" [ref=e109] [cursor=pointer]:
            - /url: /settings/general/users
            - generic [ref=e110]:
              - generic [ref=e111]:
                - img [ref=e112]
                - paragraph [ref=e114]: User Management
              - button [ref=e115]:
                - img [ref=e116]
        - button "Logout" [ref=e118] [cursor=pointer]:
          - img [ref=e120]
          - text: Logout
    - generic [ref=e122]:
      - generic [ref=e123]:
        - generic [ref=e124]:
          - img "BM Tech" [ref=e126]: BT
          - generic [ref=e127]:
            - button "BM Tech" [ref=e128] [cursor=pointer]:
              - generic: BM Tech
              - img [ref=e130]
            - generic [ref=e132] [cursor=pointer]:
              - button "Company Detail" [ref=e133]:
                - img [ref=e134]
              - button "Edit Company" [ref=e137]:
                - img [ref=e138]
              - button "Company Detail" [ref=e141]:
                - img [ref=e142]
        - generic [ref=e145]:
          - button "New" [ref=e146] [cursor=pointer]:
            - text: New
            - img [ref=e148]
          - img "Notifications" [ref=e153] [cursor=pointer]
          - button "EC" [ref=e156] [cursor=pointer]:
            - img [ref=e157]
            - paragraph [ref=e159]: EC
          - button [ref=e160] [cursor=pointer]:
            - img [ref=e161]
          - generic [ref=e164] [cursor=pointer]:
            - img "System" [ref=e166]: S
            - generic [ref=e167]:
              - generic [ref=e168]: System
              - paragraph [ref=e169]: IT Administrator / User Manager
      - generic [ref=e170]:
        - generic [ref=e171]:
          - img [ref=e172]
          - generic [ref=e177]:
            - heading "Resource Not Found!" [level=1] [ref=e178]
            - paragraph [ref=e179]: The resource you are looking for doesn't exist.
          - button "Go back" [ref=e180] [cursor=pointer]:
            - img [ref=e182]
            - text: Go back
        - generic [ref=e185]: BM Technology © 2026
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
```

# Test source

```ts
  7   |  * UI-only tests for project detail views and guardrails
  8   |  * Covers: Detail page, authentication, error handling, filter interactions
  9   |  */
  10  | test.describe('Project Management: UI Detail & Guardrails @project @ui @smoke @regression @full', () => {
  11  | 
  12  |     async function setup(page: any) {
  13  |         const app = new AppManager(page);
  14  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  15  |         const meta = await app.api.project.discoverMetadataAPI();
  16  |         return { app, meta };
  17  |     }
  18  | 
  19  |     async function createProject(app: AppManager, meta: any, overrides: Record<string, any> = {}) {
  20  |         const name = `E2E-Project-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
  21  |         const project = await app.api.project.createProjectAPI({
  22  |             name,
  23  |             customerId: meta.customerId,
  24  |             estimatedRevenue: 200000,
  25  |             estimatedExpense: 80000,
  26  |             ...overrides
  27  |         });
  28  |         return { project, name };
  29  |     }
  30  | 
  31  |     // ── UI: DETAIL PAGE ─────────────────────────────────────────────────────────
  32  | 
  33  |     test('UI-12: Project detail page shows financial data (budget / revenue / balance)', async ({ page }) => {
  34  |         const { app, meta } = await setup(page);
  35  |         const { project } = await createProject(app, meta);
  36  |         await page.goto(`/project-management/projects/${project.id}`);
  37  |         await page.waitForLoadState('domcontentloaded');
  38  | 
  39  |         // Click the "Financial Information" tab to expose financial fields
  40  |         const finTab = page.getByRole('tab', { name: /financial/i }).or(page.getByText(/financial information/i)).first();
  41  |         if (await finTab.isVisible({ timeout: 5000 }).catch(() => false)) {
  42  |             await finTab.click();
  43  |             await page.waitForTimeout(800);
  44  |         }
  45  | 
  46  |         const financialSelectors = [
  47  |             page.getByText(/budget|revenue|expense|balance/i).first(),
  48  |             page.locator('[class*="budget"], [class*="revenue"], [class*="expense"], [class*="balance"]').first(),
  49  |             page.getByText(new RegExp((project as any).estimated_revenue || '200000', 'i')).first(),
  50  |             page.getByText(new RegExp((project as any).estimated_expense || '80000', 'i')).first(),
  51  |         ];
  52  | 
  53  |         let financialVisible = false;
  54  |         for (const selector of financialSelectors) {
  55  |             if (await selector.isVisible({ timeout: 5000 }).catch(() => false)) {
  56  |                 financialVisible = true;
  57  |                 console.log(`[UI-12] Financial data found with selector`);
  58  |                 break;
  59  |             }
  60  |         }
  61  | 
  62  |         expect(financialVisible).toBe(true);
  63  |     });
  64  | 
  65  |     test('UI-13: Project detail page shows a status indicator', async ({ page }) => {
  66  |         const { app, meta } = await setup(page);
  67  |         const { project } = await createProject(app, meta);
  68  |         await page.goto(`/project-management/projects/${project.id}`);
  69  |         await page.waitForLoadState('domcontentloaded');
  70  |         
  71  |         // Try multiple selector strategies for status indicator
  72  |         const statusSelectors = [
  73  |             page.locator('span, div, [class*="badge"], [class*="status"]')
  74  |                 .filter({ hasText: /pending|in.progress|completed/i }).first(),
  75  |             page.getByText(/pending|in.progress|completed/i).first(),
  76  |             page.locator('[class*="badge"]').first(),
  77  |             page.locator('[class*="status"]').first(),
  78  |         ];
  79  |         
  80  |         let statusVisible = false;
  81  |         for (const selector of statusSelectors) {
  82  |             if (await selector.isVisible({ timeout: 3000 }).catch(() => false)) {
  83  |                 statusVisible = true;
  84  |                 console.log(`[UI-13] Status indicator found with selector`);
  85  |                 break;
  86  |             }
  87  |         }
  88  |         
  89  |         expect(statusVisible).toBe(true);
  90  |     });
  91  | 
  92  |     test('UI-14: Project detail page shows customer name', async ({ page }) => {
  93  |         const { app, meta } = await setup(page);
  94  |         const { project } = await createProject(app, meta);
  95  |         await page.goto(`/project-management/projects/${project.id}`);
  96  |         await page.waitForLoadState('domcontentloaded');
  97  |         await expect(page.getByText(meta.customerName, { exact: false }).first()).toBeVisible({ timeout: 10000 });
  98  |     });
  99  | 
  100 |     test('UI-15: Direct URL to non-existent project shows error or redirects', async ({ page }) => {
  101 |         const { app } = await setup(page);
  102 |         await page.goto('/project-management/projects/00000000-0000-0000-0000-000000000000');
  103 |         await page.waitForLoadState('domcontentloaded');
  104 |         const errorOrRedirect = await page.getByText(/not found|error|no results/i).first()
  105 |             .isVisible({ timeout: 8000 }).catch(() => false)
  106 |             || !page.url().includes('00000000-0000-0000-0000-000000000000');
> 107 |         expect(errorOrRedirect).toBe(true);
      |                                 ^ Error: expect(received).toBe(expected) // Object.is equality
  108 |     });
  109 | 
  110 |     // ── UI GUARDRAILS ──────────────────────────────────────────────────────────
  111 | 
  112 |     test('UI-GUARD-02: Unauthenticated browser access to projects redirects to login', async ({ browser }) => {
  113 |         const ctx = await browser.newContext({ storageState: undefined });
  114 |         const page = await ctx.newPage();
  115 |         await page.goto('/project-management/projects', { waitUntil: 'commit', timeout: 30000 });
  116 |         await page.waitForURL(/login/, { timeout: 10000 }).catch(() => {});
  117 |         // ERP may redirect to /login OR render the page with a login form
  118 |         const redirected = page.url().includes('login');
  119 |         const loginForm = await page.locator('input[type="password"], input[name="password"], button:has-text("Login")').first()
  120 |             .isVisible({ timeout: 5000 }).catch(() => false);
  121 |         console.log(`[UI-GUARD-02] redirected=${redirected} loginForm=${loginForm} url=${page.url()}`);
  122 |         expect(redirected || loginForm, 'Expected redirect to login or login form to be visible').toBe(true);
  123 |         await ctx.close();
  124 |     });
  125 | 
  126 |     test('UI-GUARD-03: Status filter pill click opens filter options', async ({ page }) => {
  127 |         const { app } = await setup(page);
  128 |         await page.goto('/project-management/projects');
  129 |         await page.waitForLoadState('domcontentloaded');
  130 |         const statusBtn = page.getByRole('button', { name: /Status/i }).first();
  131 |         if (await statusBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  132 |             await statusBtn.click();
  133 |             await page.waitForTimeout(1000);
  134 |             const dropdownOpen = await page.locator('[role="listbox"], [role="dialog"], [role="menu"], [class*="dropdown"], [class*="popover"]')
  135 |                 .filter({ visible: true }).first().isVisible({ timeout: 4000 }).catch(() => false);
  136 |             console.log(`[UI-GUARD-03] Status filter opens dropdown: ${dropdownOpen}`);
  137 |             expect(dropdownOpen).toBe(true);
  138 |             await page.keyboard.press('Escape');
  139 |         }
  140 |     });
  141 | });
  142 | 
```