# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> SO-UI-01: Add inventory Line Item via modal → SO created and approved
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:100:9

# Error details

```
TimeoutError: locator.fill: Timeout 90000ms exceeded.
Call log:
  - waiting for getByRole('dialog').last().getByRole('group').filter({ hasText: /Unit Price/i }).getByRole('spinbutton')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "BM Tech" [ref=e10]: BT
        - generic [ref=e11]:
          - button "BM Tech" [ref=e12] [cursor=pointer]:
            - generic: BM Tech
            - img [ref=e14]
          - generic [ref=e16] [cursor=pointer]:
            - button "Company Detail" [ref=e17]:
              - img [ref=e18]
            - button "Edit Company" [ref=e21]:
              - img [ref=e22]
            - button "Company Detail" [ref=e25]:
              - img [ref=e26]
      - generic [ref=e29]:
        - button "New" [ref=e30] [cursor=pointer]:
          - text: New
          - img [ref=e32]
        - generic [ref=e36] [cursor=pointer]:
          - generic [ref=e37]: "5"
          - img "Notifications" [ref=e38]
        - button "EC" [ref=e41] [cursor=pointer]:
          - img [ref=e42]
          - paragraph [ref=e44]: EC
        - button [ref=e45] [cursor=pointer]:
          - img [ref=e46]
        - generic [ref=e49] [cursor=pointer]:
          - img "System" [ref=e51]: S
          - generic [ref=e52]:
            - generic [ref=e53]: System
            - paragraph [ref=e54]: IT Administrator / User Manager
    - generic [ref=e56]:
      - generic [ref=e58]:
        - generic [ref=e59]:
          - img "BM Tech" [ref=e62]: BT
          - paragraph [ref=e63]: Welcome, System
        - paragraph [ref=e65]: From meticulous bookkeeping to seamless inventory control, we've got your back.
        - generic [ref=e66]:
          - link "Dashboard" [ref=e67] [cursor=pointer]:
            - /url: /dashboard
          - link "Settings" [ref=e68] [cursor=pointer]:
            - /url: /settings/company/details
        - generic [ref=e69]:
          - link "Add Customer" [ref=e70] [cursor=pointer]:
            - /url: /receivables/customers/new
            - img [ref=e73]
            - text: Add Customer
          - link "Add Invoice" [ref=e74] [cursor=pointer]:
            - /url: /receivables/invoices/new
            - img [ref=e77]
            - text: Add Invoice
          - link "Add Receipt" [ref=e78] [cursor=pointer]:
            - /url: /receivables/receipts/new
            - img [ref=e81]
            - text: Add Receipt
          - link "Add Sales Order" [ref=e82] [cursor=pointer]:
            - /url: /receivables/sale-orders/new
            - img [ref=e85]
            - text: Add Sales Order
        - paragraph [ref=e87]: Quick Access
        - generic [ref=e88]:
          - generic [ref=e89]:
            - link "Sales Sales" [ref=e91] [cursor=pointer]:
              - /url: /receivables/overview/
              - button "Sales Sales" [ref=e92]:
                - generic [ref=e93]:
                  - img "Sales" [ref=e94]
                  - paragraph [ref=e95]: Sales
            - link "Purchase Purchase" [ref=e97] [cursor=pointer]:
              - /url: /payables/overview/
              - button "Purchase Purchase" [ref=e98]:
                - generic [ref=e99]:
                  - img "Purchase" [ref=e100]
                  - paragraph [ref=e101]: Purchase
            - link "Accounting Accounting" [ref=e103] [cursor=pointer]:
              - /url: /accounting/overview
              - button "Accounting Accounting" [ref=e104]:
                - generic [ref=e105]:
                  - img "Accounting" [ref=e106]
                  - paragraph [ref=e107]: Accounting
            - link "Leases Leases" [ref=e109] [cursor=pointer]:
              - /url: /leases/leases/?page=1&pageSize=15
              - button "Leases Leases" [ref=e110]:
                - generic [ref=e111]:
                  - img "Leases" [ref=e112]
                  - paragraph [ref=e113]: Leases
            - link "Assets Assets" [ref=e115] [cursor=pointer]:
              - /url: /assets/overview
              - button "Assets Assets" [ref=e116]:
                - generic [ref=e117]:
                  - img "Assets" [ref=e118]
                  - paragraph [ref=e119]: Assets
            - link "Budgets Budgets" [ref=e121] [cursor=pointer]:
              - /url: /public-sector-budgets/overview
              - button "Budgets Budgets" [ref=e122]:
                - generic [ref=e123]:
                  - img "Budgets" [ref=e124]
                  - paragraph [ref=e125]: Budgets
            - link "Payroll Payroll" [ref=e127] [cursor=pointer]:
              - /url: /payrolls
              - button "Payroll Payroll" [ref=e128]:
                - generic [ref=e129]:
                  - img "Payroll" [ref=e130]
                  - paragraph [ref=e131]: Payroll
            - link "Report Report" [ref=e133] [cursor=pointer]:
              - /url: /reports
              - button "Report Report" [ref=e134]:
                - generic [ref=e135]:
                  - img "Report" [ref=e136]
                  - paragraph [ref=e137]: Report
          - button "View All" [ref=e138] [cursor=pointer]:
            - text: View All
            - img [ref=e140]
      - img "Floating Icon" [ref=e143]
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
  4   | 
  5   | /**
  6   |  * LINE ITEM & MISCELLANEOUS AUDIT
  7   |  *
  8   |  * Covers the "Line Item" button → modal → [Item | Miscellaneous] table
  9   |  * that appears on SO, Invoice, Receipt, PO, Bill, Payment.
  10  |  *
  11  |  * Each document gets:
  12  |  *   - UI: inventory line item added via modal "Item" tab
  13  |  *   - UI: miscellaneous line added via modal "Miscellaneous" tab
  14  |  *   - API: standalone with inventory line → total correct
  15  |  *   - API: standalone with miscellaneous line (no item_id) → accepted or documented
  16  |  *   - API: mixed inventory + miscellaneous → combined total
  17  |  *   - API: multi-line → grand total = sum of lines
  18  |  *   - Guardrail: zero-qty line → $0 or rejected
  19  |  *   - Guardrail: negative price line → rejected or flagged
  20  |  */
  21  | test.describe('Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full', () => {
  22  |     test.setTimeout(300000);
  23  | 
  24  |     let salesMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
  25  |     let purchaseMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
  26  |     let itemA: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;
  27  |     let itemB: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;
  28  |     let periodDateIso: string;
  29  | 
  30  |     let sharedPage: import('@playwright/test').Page;
  31  | 
  32  |     test.beforeAll(async ({ browser }) => {
  33  |         test.setTimeout(600000);
  34  |         sharedPage = await browser.newPage();
  35  |         const app = new AppManager(sharedPage);
  36  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  37  | 
  38  |         salesMeta    = await app.api.sales.discoverMetadataAPI();
  39  |         purchaseMeta = await app.api.purchase.discoverMetadataAPI();
  40  |         itemA = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 50, unit_cost: 100 });
  41  |         itemB = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 50, unit_cost: 80 });
  42  |         const { DateHelper } = require('../../lib/utils/DateHelper');
  43  |         periodDateIso = (await DateHelper.resolve(sharedPage)).iso;
  44  |     });
  45  | 
  46  |     test.afterAll(async () => {
  47  |         await sharedPage?.close();
  48  |     });
  49  | 
  50  |     test.beforeEach(async ({ page }) => {
  51  |         const { DateHelper } = require('../../lib/utils/DateHelper');
  52  |         DateHelper.clearCache();
  53  |         const app = new AppManager(page);
  54  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  55  | 
  56  |     });
  57  | 
  58  |     // =========================================================================
  59  |     // HELPERS
  60  |     // =========================================================================
  61  | 
  62  |     async function addLineItemViaModal(page: any, app: AppManager, type: 'Item' | 'Miscellaneous', opts: {
  63  |         unitPrice: string; qty: string; description?: string;
  64  |     }) {
  65  |         const modal = page.getByRole('dialog').last();
  66  |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  67  | 
  68  |         // Choose Item vs Miscellaneous tab inside the modal
  69  |         await modal.getByRole('button', { name: type, exact: true }).click();
  70  |         await page.waitForTimeout(500);
  71  | 
  72  |         if (type === 'Item') {
  73  |             await app.selectRandomOption(modal.getByRole('button', { name: 'Item selector' }), 'Item');
  74  |             await app.selectRandomOption(modal.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
  75  |             await app.selectRandomOption(modal.getByRole('button', { name: 'Location selector' }), 'Location');
  76  |         } else {
  77  |             // Miscellaneous: description field instead of item picker
  78  |             const descField = modal.getByRole('textbox').first();
  79  |             if (await descField.isVisible({ timeout: 3000 }).catch(() => false)) {
  80  |                 await descField.fill(opts.description || 'Miscellaneous charge');
  81  |             }
  82  |         }
  83  | 
  84  |         const glBtn = modal.getByRole('button', { name: 'G/L Account selector' });
  85  |         await glBtn.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
  86  |         await app.selectRandomOption(glBtn, 'G/L Account');
  87  | 
  88  |         await modal.getByRole('group').filter({ hasText: /^Quantity/i }).getByRole('spinbutton').fill(opts.qty);
> 89  |         await modal.getByRole('group').filter({ hasText: /Unit Price/i }).getByRole('spinbutton').fill(opts.unitPrice);
      |                                                                                                   ^ TimeoutError: locator.fill: Timeout 90000ms exceeded.
  90  |         await app.selectRandomOption(modal.getByRole('button', { name: 'Tax selector' }), 'Tax', true);
  91  | 
  92  |         await modal.getByRole('button', { name: 'Add', exact: true }).click();
  93  |         await expect(modal).not.toBeVisible({ timeout: 15000 });
  94  |     }
  95  | 
  96  |     // =========================================================================
  97  |     // SALES ORDER
  98  |     // =========================================================================
  99  | 
  100 |     test('SO-UI-01: Add inventory Line Item via modal → SO created and approved', async ({ page }) => {
  101 |         const app = new AppManager(page);
  102 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  103 |         await page.goto('/receivables/sale-orders/new', { waitUntil: 'commit' });
  104 | 
  105 |         await app.pickDate('Sales Order Date');
  106 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  107 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');
  108 |         await app.selectRandomOption(page.getByRole('button', { name: 'Currency selector' }), 'Currency', true);
  109 | 
  110 |         await page.getByRole('button', { name: 'Line Item' }).click();
  111 |         await addLineItemViaModal(page, app, 'Item', { qty: '3', unitPrice: '500' });
  112 |         console.log('[OK] Inventory line item added to SO');
  113 | 
  114 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  115 |         await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });
  116 | 
  117 |         const soId = await app.extractIdFromUrl();
  118 |         await app.advanceDocumentAPI(soId, 'sales-orders');
  119 |         console.log('[PASS] SO with inventory line item created and approved');
  120 |     });
  121 | 
  122 |     test('SO-UI-02: Add Miscellaneous Line Item via modal → SO created and approved', async ({ page }) => {
  123 |         const app = new AppManager(page);
  124 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  125 |         await page.goto('/receivables/sale-orders/new', { waitUntil: 'commit' });
  126 | 
  127 |         await app.pickDate('Sales Order Date');
  128 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  129 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');
  130 |         await app.selectRandomOption(page.getByRole('button', { name: 'Currency selector' }), 'Currency', true);
  131 | 
  132 |         await page.getByRole('button', { name: 'Line Item' }).click();
  133 |         const modal = page.getByRole('dialog').last();
  134 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  135 | 
  136 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  137 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  138 |             console.log('[SKIP] Miscellaneous button not present in SO modal');
  139 |             await page.keyboard.press('Escape');
  140 |             return;
  141 |         }
  142 | 
  143 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '750', description: 'Delivery fee' });
  144 |         console.log('[OK] Miscellaneous line item added to SO');
  145 | 
  146 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  147 |         await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });
  148 |         console.log('[PASS] SO with miscellaneous line item created');
  149 |     });
  150 | 
  151 |     test('SO-UI-03: Add both Item + Miscellaneous lines → totals shown in SO table', async ({ page }) => {
  152 |         const app = new AppManager(page);
  153 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  154 |         await page.goto('/receivables/sale-orders/new', { waitUntil: 'commit' });
  155 | 
  156 |         await app.pickDate('Sales Order Date');
  157 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  158 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');
  159 | 
  160 |         // Line 1: inventory item
  161 |         await page.getByRole('button', { name: 'Line Item' }).click();
  162 |         await addLineItemViaModal(page, app, 'Item', { qty: '2', unitPrice: '1000' });
  163 | 
  164 |         // Line 2: miscellaneous
  165 |         await page.getByRole('button', { name: 'Line Item' }).click();
  166 |         const modal2 = page.getByRole('dialog').last();
  167 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  168 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  169 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  170 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '300', description: 'Shipping' });
  171 |         } else {
  172 |             await page.keyboard.press('Escape');
  173 |             console.log('[INFO] Miscellaneous not available — adding second Item line');
  174 |             await page.getByRole('button', { name: 'Line Item' }).click();
  175 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '300' });
  176 |         }
  177 | 
  178 |         // Verify 2 rows appear in the SO items table before submit
  179 |         const tableRows = page.locator('table tbody tr');
  180 |         const rowCount = await tableRows.count();
  181 |         expect(rowCount).toBeGreaterThanOrEqual(2);
  182 |         console.log(`[AUDIT] ${rowCount} line items visible in SO form table`);
  183 | 
  184 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  185 |         await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });
  186 | 
  187 |         const soId = await app.extractIdFromUrl();
  188 |         const { apiBase, headers, qs } = await app.buildApiContext();
  189 |         const soData = await (await page.request.get(`${apiBase}/sales-order/${soId}?${qs}`, { headers })).json();
```