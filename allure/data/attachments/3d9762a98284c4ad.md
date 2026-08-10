# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> SO-UI-01: Add inventory Line Item via modal → SO created and approved
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:116:9

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  getByRole('dialog').last()
Expected: not visible
Received: visible
Timeout:  15000ms

Call log:
  - Expect "not toBeVisible" with timeout 15000ms
  - waiting for getByRole('dialog').last()
    19 × locator resolved to <section tabindex="-1" role="dialog" id="popover-content-:rg1:" aria-describedby="popover-body-:rg1:" class="chakra-popover__content css-unt9s1">…</section>
       - unexpected value "visible"

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
  22  |     test.describe.configure({ mode: 'serial' });
  23  |     test.setTimeout(600000);
  24  | 
  25  |     let salesMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
  26  |     let purchaseMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
  27  |     let itemA: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;
  28  |     let itemB: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;
  29  |     let periodDateIso: string;
  30  | 
  31  |     let sharedPage: import('@playwright/test').Page;
  32  | 
  33  |     test.beforeAll(async ({ browser }) => {
  34  |         test.setTimeout(600000);
  35  |         sharedPage = await browser.newPage();
  36  |         const app = new AppManager(sharedPage);
  37  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  38  | 
  39  |         salesMeta    = await app.api.sales.discoverMetadataAPI();
  40  |         purchaseMeta = await app.api.purchase.discoverMetadataAPI();
  41  |         itemA = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 50, unit_cost: 100 });
  42  |         itemB = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 50, unit_cost: 80 });
  43  |         const { DateHelper } = require('../../lib/utils/DateHelper');
  44  |         periodDateIso = (await DateHelper.resolve(sharedPage)).iso;
  45  |     });
  46  | 
  47  |     test.afterAll(async () => {
  48  |         await sharedPage?.close();
  49  |     });
  50  | 
  51  |     test.beforeEach(async ({ page }) => {
  52  |         const { DateHelper } = require('../../lib/utils/DateHelper');
  53  |         DateHelper.clearCache();
  54  |         const app = new AppManager(page);
  55  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  56  | 
  57  |     });
  58  | 
  59  |     // =========================================================================
  60  |     // HELPERS
  61  |     // =========================================================================
  62  | 
  63  |     async function addLineItemViaModal(page: any, app: AppManager, type: 'Item' | 'Miscellaneous', opts: {
  64  |         unitPrice: string; qty: string; description?: string;
  65  |     }) {
  66  |         const modal = page.getByRole('dialog').last();
  67  |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  68  | 
  69  |         // Choose Item vs Miscellaneous tab inside the modal
  70  |         await modal.getByRole('button', { name: type, exact: true }).click();
  71  |         await page.waitForTimeout(500);
  72  | 
  73  |         if (type === 'Item') {
  74  |             await app.selectRandomOption(modal.getByRole('button', { name: 'Item selector' }), 'Item');
  75  |             await app.selectRandomOption(modal.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
  76  |             await app.selectRandomOption(modal.getByRole('button', { name: 'Location selector' }), 'Location');
  77  |         } else {
  78  |             // Miscellaneous: description field instead of item picker
  79  |             const descField = modal.getByRole('textbox').first();
  80  |             if (await descField.isVisible({ timeout: 3000 }).catch(() => false)) {
  81  |                 await descField.fill(opts.description || 'Miscellaneous charge');
  82  |             }
  83  |         }
  84  | 
  85  |         const glBtn = modal.getByRole('button', { name: 'G/L Account selector' });
  86  |         await glBtn.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
  87  |         await app.selectRandomOption(glBtn, 'G/L Account');
  88  | 
  89  |         // Quantity + Unit Price spinbuttons exist on Item lines and some Miscellaneous modals.
  90  |         // Bill Miscellaneous modal uses a single "Before Tax" / "price" field instead.
  91  |         const qtyGroup = modal.getByRole('group').filter({ hasText: /^Quantity/i });
  92  |         const hasQty = await qtyGroup.isVisible({ timeout: 2000 }).catch(() => false);
  93  |         if (hasQty) {
  94  |             await qtyGroup.getByRole('spinbutton').fill(opts.qty);
  95  |             await modal.getByRole('group').filter({ hasText: /Unit Price/i }).getByRole('spinbutton').fill(opts.unitPrice);
  96  |         } else {
  97  |             // Miscellaneous modal without Quantity — fill Before Tax / price directly
  98  |             const beforeTaxInput = modal.locator('input[placeholder="price"], input[name*="price" i], input[name*="before_tax" i], input[name*="amount" i]').first();
  99  |             const spinFallback = modal.getByRole('spinbutton').first();
  100 |             if (await beforeTaxInput.isVisible({ timeout: 2000 }).catch(() => false)) {
  101 |                 await beforeTaxInput.fill(opts.unitPrice);
  102 |             } else if (await spinFallback.isVisible({ timeout: 2000 }).catch(() => false)) {
  103 |                 await spinFallback.fill(opts.unitPrice);
  104 |             }
  105 |         }
  106 |         await app.selectRandomOption(modal.getByRole('button', { name: 'Tax selector' }), 'Tax', true);
  107 | 
  108 |         await modal.getByRole('button', { name: 'Add', exact: true }).click();
> 109 |         await expect(modal).not.toBeVisible({ timeout: 15000 });
      |                                 ^ Error: expect(locator).not.toBeVisible() failed
  110 |     }
  111 | 
  112 |     // =========================================================================
  113 |     // SALES ORDER
  114 |     // =========================================================================
  115 | 
  116 |     test('SO-UI-01: Add inventory Line Item via modal → SO created and approved', async ({ page }) => {
  117 |         const app = new AppManager(page);
  118 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  119 |         await page.goto('/receivables/sale-orders/new', { waitUntil: 'domcontentloaded' });
  120 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  121 |         await page.getByRole('button', { name: 'Line Item' }).waitFor({ state: 'visible', timeout: 60000 });
  122 | 
  123 |         await app.pickDate('Sales Order Date');
  124 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  125 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');
  126 |         await app.selectRandomOption(page.getByRole('button', { name: 'Currency selector' }), 'Currency', true);
  127 | 
  128 |         await page.getByRole('button', { name: 'Line Item' }).click();
  129 |         await addLineItemViaModal(page, app, 'Item', { qty: '3', unitPrice: '500' });
  130 |         console.log('[OK] Inventory line item added to SO');
  131 | 
  132 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  133 |         await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });
  134 | 
  135 |         const soId = await app.extractIdFromUrl();
  136 |         await app.advanceDocumentAPI(soId, 'sales-orders');
  137 |         console.log('[PASS] SO with inventory line item created and approved');
  138 |     });
  139 | 
  140 |     test('SO-UI-02: Add Miscellaneous Line Item via modal → SO created and approved', async ({ page }) => {
  141 |         const app = new AppManager(page);
  142 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  143 |         await page.goto('/receivables/sale-orders/new', { waitUntil: 'domcontentloaded' });
  144 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  145 |         await page.getByRole('button', { name: 'Line Item' }).waitFor({ state: 'visible', timeout: 60000 });
  146 | 
  147 |         await app.pickDate('Sales Order Date');
  148 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  149 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');
  150 |         await app.selectRandomOption(page.getByRole('button', { name: 'Currency selector' }), 'Currency', true);
  151 | 
  152 |         await page.getByRole('button', { name: 'Line Item' }).click();
  153 |         const modal = page.getByRole('dialog').last();
  154 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  155 | 
  156 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  157 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  158 |             console.log('[SKIP] Miscellaneous button not present in SO modal');
  159 |             await page.keyboard.press('Escape');
  160 |             return;
  161 |         }
  162 | 
  163 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '750', description: 'Delivery fee' });
  164 |         console.log('[OK] Miscellaneous line item added to SO');
  165 | 
  166 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  167 |         await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });
  168 |         console.log('[PASS] SO with miscellaneous line item created');
  169 |     });
  170 | 
  171 |     test('SO-UI-03: Add both Item + Miscellaneous lines → totals shown in SO table', async ({ page }) => {
  172 |         const app = new AppManager(page);
  173 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  174 |         await page.goto('/receivables/sale-orders/new', { waitUntil: 'domcontentloaded' });
  175 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  176 |         await page.getByRole('button', { name: 'Line Item' }).waitFor({ state: 'visible', timeout: 60000 });
  177 | 
  178 |         await app.pickDate('Sales Order Date');
  179 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  180 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');
  181 | 
  182 |         // Line 1: inventory item
  183 |         await page.getByRole('button', { name: 'Line Item' }).click();
  184 |         await addLineItemViaModal(page, app, 'Item', { qty: '2', unitPrice: '1000' });
  185 | 
  186 |         // Line 2: miscellaneous
  187 |         await page.getByRole('button', { name: 'Line Item' }).click();
  188 |         const modal2 = page.getByRole('dialog').last();
  189 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  190 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  191 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  192 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '300', description: 'Shipping' });
  193 |         } else {
  194 |             await page.keyboard.press('Escape');
  195 |             console.log('[INFO] Miscellaneous not available — adding second Item line');
  196 |             await page.getByRole('button', { name: 'Line Item' }).click();
  197 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '300' });
  198 |         }
  199 | 
  200 |         // Verify 2 rows appear in the SO items table before submit
  201 |         const tableRows = page.locator('table tbody tr');
  202 |         const rowCount = await tableRows.count();
  203 |         expect(rowCount).toBeGreaterThanOrEqual(2);
  204 |         console.log(`[AUDIT] ${rowCount} line items visible in SO form table`);
  205 | 
  206 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  207 |         await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });
  208 | 
  209 |         const soId = await app.extractIdFromUrl();
```