# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/project-ui-detail.spec.ts >> Project Management: UI Detail & Guardrails @project @ui @smoke @regression @full >> UI-12: Project detail page shows financial data (budget / revenue / balance)
- Location: tests/project/project-ui-detail.spec.ts:33:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active]:
  - img "Logo" [ref=e2]
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
  1   | import { test, expect } from '@playwright/test';
  2   | import { AppManager } from '../../pages/AppManager';
  3   | 
  4   | /**
  5   |  * PROJECT UI DETAIL & GUARDRAILS — Detail Page, Authentication, Edge Cases
  6   |  *
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
> 62  |         expect(financialVisible).toBe(true);
      |                                  ^ Error: expect(received).toBe(expected) // Object.is equality
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
  107 |         expect(errorOrRedirect).toBe(true);
  108 |     });
  109 | 
  110 |     // ── UI GUARDRAILS ──────────────────────────────────────────────────────────
  111 | 
  112 |     test('UI-GUARD-02: Unauthenticated browser access to projects redirects to login', async ({ browser }) => {
  113 |         const ctx = await browser.newContext({ storageState: undefined });
  114 |         const page = await ctx.newPage();
  115 |         await page.goto('/project-management/projects');
  116 |         await page.waitForLoadState('domcontentloaded');
  117 |         expect(page.url()).toContain('login');
  118 |         await ctx.close();
  119 |     });
  120 | 
  121 |     test('UI-GUARD-03: Status filter pill click opens filter options', async ({ page }) => {
  122 |         const { app } = await setup(page);
  123 |         await page.goto('/project-management/projects');
  124 |         await page.waitForLoadState('domcontentloaded');
  125 |         const statusBtn = page.getByRole('button', { name: /Status/i }).first();
  126 |         if (await statusBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  127 |             await statusBtn.click();
  128 |             await page.waitForTimeout(1000);
  129 |             const dropdownOpen = await page.locator('[role="listbox"], [role="dialog"], [role="menu"], [class*="dropdown"], [class*="popover"]')
  130 |                 .filter({ visible: true }).first().isVisible({ timeout: 4000 }).catch(() => false);
  131 |             console.log(`[UI-GUARD-03] Status filter opens dropdown: ${dropdownOpen}`);
  132 |             expect(dropdownOpen).toBe(true);
  133 |             await page.keyboard.press('Escape');
  134 |         }
  135 |     });
  136 | });
  137 | 
```