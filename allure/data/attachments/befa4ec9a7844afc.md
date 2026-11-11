# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/index-query-boundaries.spec.ts >> Query Boundary Audit: Core Index Pages @cross-module @regression >> [INDEX BOUNDARY] Customers: Empty State Boundary (0 Records)
- Location: tests/cross-module/index-query-boundaries.spec.ts:80:13

# Error details

```
Error: Customers page must handle empty record list gracefully

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6]:
    - generic [ref=e9]:
      - generic [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - button "BEFA ABC Trading IT Administrator / User Manager" [ref=e13] [cursor=pointer]:
              - img "BEFA" [ref=e15]
              - generic [ref=e16]:
                - generic [ref=e17]: ABC Trading
                - generic [ref=e18]: IT Administrator / User Manager
        - textbox "Search navigation..." [ref=e23]
      - generic [ref=e25]:
        - list [ref=e27]:
          - listitem [ref=e28]:
            - link "Dashboard" [ref=e29] [cursor=pointer]:
              - /url: /dashboard
        - list [ref=e38]:
          - listitem [ref=e39]:
            - button "Accounting" [ref=e40] [cursor=pointer]
        - list [ref=e48]:
          - listitem [ref=e49]:
            - button "Account Reconciliation" [ref=e50] [cursor=pointer]
        - list [ref=e58]:
          - listitem [ref=e59]:
            - button "CRM" [expanded] [ref=e60] [cursor=pointer]
            - list [ref=e70]:
              - listitem [ref=e71]:
                - button "Sales" [expanded] [ref=e72] [cursor=pointer]
                - list [ref=e81]:
                  - listitem [ref=e82]:
                    - link "Sale Orders" [ref=e83] [cursor=pointer]:
                      - /url: /receivables/sale-orders/?page=1&pageSize=15
                  - listitem [ref=e88]:
                    - link "Customers" [ref=e89] [cursor=pointer]:
                      - /url: /receivables/customers/?page=1&pageSize=15
                  - listitem [ref=e97]:
                    - link "Vendors" [ref=e98] [cursor=pointer]:
                      - /url: /payables/vendors/?page=1&pageSize=15
        - list [ref=e107]:
          - listitem [ref=e108]:
            - button "HRM" [ref=e109] [cursor=pointer]
        - list [ref=e119]:
          - listitem [ref=e120]:
            - button "Project" [ref=e121] [cursor=pointer]
        - list [ref=e129]:
          - listitem [ref=e130]:
            - button "SCM" [ref=e131] [cursor=pointer]
        - list [ref=e140]:
          - listitem [ref=e141]:
            - button "Lease" [ref=e142] [cursor=pointer]
        - list [ref=e150]:
          - listitem [ref=e151]:
            - button "Services" [ref=e152] [cursor=pointer]
        - list [ref=e159]:
          - listitem [ref=e160]:
            - button "Reports" [ref=e161] [cursor=pointer]
        - list [ref=e169]:
          - listitem [ref=e170]:
            - button "Administration" [ref=e171] [cursor=pointer]
      - list [ref=e179]:
        - listitem [ref=e180]:
          - button "SA System Admin IT Administrator / User Manager" [ref=e181] [cursor=pointer]:
            - generic [ref=e182]: SA
            - generic [ref=e184]:
              - generic [ref=e185]: System Admin
              - generic [ref=e186]: IT Administrator / User Manager
    - main [ref=e190]:
      - generic [ref=e191]:
        - button "Toggle Sidebar" [ref=e193] [cursor=pointer]
        - generic [ref=e197]:
          - button "New" [ref=e198] [cursor=pointer]
          - button "Notifications" [ref=e205] [cursor=pointer]
          - generic "Switch Calendar Era" [ref=e209]:
            - button "EC" [ref=e213] [cursor=pointer]
            - generic [ref=e214]: "|"
            - button "GC" [ref=e215] [cursor=pointer]
          - button "Change Language" [ref=e216] [cursor=pointer]:
            - generic [ref=e220]: EN
          - button "S System Admin IT Administrator / User Manager" [ref=e224] [cursor=pointer]:
            - generic [ref=e225]: S
            - generic [ref=e227]:
              - generic [ref=e228]: System Admin
              - generic [ref=e229]: IT Administrator / User Manager
      - main [ref=e232]
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
  4   | interface IndexTarget {
  5   |     name: string;
  6   |     route: string;
  7   |     apiPattern: string;
  8   | }
  9   | 
  10  | const INDEX_PAGES: IndexTarget[] = [
  11  |     { name: 'Invoices', route: '/receivables/invoices', apiPattern: '**/api/invoices*' },
  12  |     { name: 'Receipts', route: '/receivables/receipts', apiPattern: '**/api/receipts*' },
  13  |     { name: 'Sales Orders', route: '/receivables/sales-orders', apiPattern: '**/api/sales-orders*' },
  14  |     { name: 'Customers', route: '/receivables/customers', apiPattern: '**/api/customers*' },
  15  |     { name: 'Bills', route: '/payables/bills', apiPattern: '**/api/bills*' },
  16  |     { name: 'Payments', route: '/payables/payments', apiPattern: '**/api/payments*' },
  17  |     { name: 'Purchase Orders', route: '/payables/purchase-orders', apiPattern: '**/api/purchase-orders*' },
  18  |     { name: 'Vendors', route: '/payables/vendors', apiPattern: '**/api/vendors*' },
  19  | ];
  20  | 
  21  | test.describe('Query Boundary Audit: Core Index Pages @cross-module @regression', () => {
  22  |     test.setTimeout(240000);
  23  | 
  24  |     test.beforeEach(async ({ page }) => {
  25  |         const app = new AppManager(page);
  26  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  27  |     });
  28  | 
  29  |     for (const target of INDEX_PAGES) {
  30  |         test(`[INDEX BOUNDARY] ${target.name}: Data Resolution & Loading State`, async ({ page }) => {
  31  |             console.log(`\nAuditing Data Resolution & Loading for ${target.name} (${target.route})...`);
  32  |             
  33  |             let loadingDetected = false;
  34  |             const loadingSelectors = ['.chakra-spinner', '[role="progressbar"]', '[class*="skeleton" i]', '[class*="spinner" i]', '[class*="loader" i]'];
  35  | 
  36  |             // Navigate to index route
  37  |             await page.goto(target.route, { waitUntil: 'domcontentloaded', timeout: 30000 });
  38  | 
  39  |             for (const sel of loadingSelectors) {
  40  |                 if (await page.locator(sel).first().isVisible({ timeout: 1500 }).catch(() => false)) {
  41  |                     loadingDetected = true;
  42  |                     break;
  43  |                 }
  44  |             }
  45  | 
  46  |             await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  47  |             await page.waitForTimeout(1000);
  48  | 
  49  |             const bodyText = await page.innerText('body').catch(() => '');
  50  |             const tableRows = await page.locator('table tbody tr').count().catch(() => 0);
  51  |             const hasGridOrTable = await page.locator('table, [role="table"], [role="grid"]').first().isVisible({ timeout: 3000 }).catch(() => false);
  52  |             const isResolved = bodyText.length > 50 && (tableRows > 0 || hasGridOrTable || bodyText.includes('Search') || bodyText.includes('New'));
  53  | 
  54  |             console.log(`[AUDIT] ${target.name} Data Resolved: ${isResolved} | Rows: ${tableRows} | Loading Indicator: ${loadingDetected ? 'Observed' : 'Fast cache'}`);
  55  |             expect(isResolved, `${target.name} index page must resolve table or controls without blank screen`).toBe(true);
  56  |         });
  57  | 
  58  |         test(`[INDEX BOUNDARY] ${target.name}: Error Boundary State (API 500 Failure)`, async ({ page }) => {
  59  |             console.log(`\nAuditing Error Boundary for ${target.name} (${target.route})...`);
  60  | 
  61  |             // Intercept target query and simulate server 500 error
  62  |             await page.route(target.apiPattern, route => route.fulfill({
  63  |                 status: 500,
  64  |                 contentType: 'application/json',
  65  |                 body: JSON.stringify({ code: 500, message: 'Internal Server Error' })
  66  |             }));
  67  | 
  68  |             await page.goto(target.route, { waitUntil: 'domcontentloaded', timeout: 30000 });
  69  |             await page.waitForTimeout(2000);
  70  | 
  71  |             const bodyText = await page.innerText('body').catch(() => '');
  72  |             const hasAlert = await page.locator('[role="alert"], .chakra-alert, [class*="alert" i]').first().isVisible({ timeout: 2000 }).catch(() => false);
  73  |             const hasErrorText = /error|failed|something went wrong|unable to load|try again|500/i.test(bodyText);
  74  |             const pageCrashed = bodyText.trim().length === 0;
  75  | 
  76  |             console.log(`[AUDIT] ${target.name} Error Boundary: Alert: ${hasAlert} | Error Text: ${hasErrorText} | Crashed Blank: ${pageCrashed}`);
  77  |             expect(pageCrashed, `${target.name} page must not crash into a blank white screen on API 500`).toBe(false);
  78  |         });
  79  | 
  80  |         test(`[INDEX BOUNDARY] ${target.name}: Empty State Boundary (0 Records)`, async ({ page }) => {
  81  |             console.log(`\nAuditing Empty State for ${target.name} (${target.route})...`);
  82  | 
  83  |             // Intercept target query and return empty data
  84  |             await page.route(target.apiPattern, route => route.fulfill({
  85  |                 status: 200,
  86  |                 contentType: 'application/json',
  87  |                 body: JSON.stringify({ data: [], items: [], pagination: { total: 0 } })
  88  |             }));
  89  | 
  90  |             await page.goto(target.route, { waitUntil: 'domcontentloaded', timeout: 30000 });
  91  |             await page.waitForTimeout(2000);
  92  | 
  93  |             const bodyText = await page.innerText('body').catch(() => '');
  94  |             const tableRows = await page.locator('table tbody tr').count().catch(() => 0);
  95  |             const hasEmptyNotice = /no record|no data|empty|no items|create your first|not found|0 of 0/i.test(bodyText);
  96  |             const isEmptyHandled = (hasEmptyNotice || tableRows === 0) && bodyText.length > 50;
  97  | 
  98  |             console.log(`[AUDIT] ${target.name} Empty State Handled: ${isEmptyHandled} | Notice Present: ${hasEmptyNotice} | Rows Count: ${tableRows}`);
> 99  |             expect(isEmptyHandled, `${target.name} page must handle empty record list gracefully`).toBe(true);
      |                                                                                                    ^ Error: Customers page must handle empty record list gracefully
  100 |         });
  101 |     }
  102 | });
  103 | 
  104 | 
```