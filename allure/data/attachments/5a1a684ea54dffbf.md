# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-period-control.spec.ts >> Sales Period Control Edge Cases @sales @security @temporal @regression @full >> SO: Reject back-dated Sales Order from previous fiscal year (2017)
- Location: tests/sales/so-period-control.spec.ts:57:9

# Error details

```
Error: [PERIOD_CONTROL_BUG] System approved back-dated SO from previous fiscal year (2017-12-31T00:00:00Z)!
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e6]
      - img [ref=e8]
      - generic [ref=e11]:
        - heading "Welcome to, befa" [level=3] [ref=e12]
        - paragraph [ref=e13]: Empower Your Finances, Simplify Your Success
        - paragraph [ref=e14]: From meticulous bookkeeping to seamless inventory control, we've got your back.
    - generic [ref=e16]:
      - heading "Login To Your Account" [level=2] [ref=e17]
      - generic [ref=e18]:
        - text: Not a member?
        - link "Register" [ref=e19] [cursor=pointer]:
          - /url: /users/register
      - generic [ref=e21]:
        - group [ref=e22]:
          - generic [ref=e23]: Email *
          - textbox "Email *" [ref=e25]:
            - /placeholder: Enter your email
        - group [ref=e26]:
          - generic [ref=e27]: Password *
          - generic [ref=e28]:
            - textbox "Password *" [ref=e29]:
              - /placeholder: Enter your password
            - button "Show password" [ref=e31] [cursor=pointer]:
              - img [ref=e32]
        - link "Forget Password?" [ref=e37] [cursor=pointer]:
          - /url: forget-password
        - button "Login" [ref=e39] [cursor=pointer]
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
  5   |  * =============================================================================
  6   |  * MODULE: Sales Order - Fiscal Period Control & Date Validation Suite
  7   |  * ARCHITECTURAL SCOPE & COVERAGE:
  8   |  * 1. SO with date outside open fiscal period rejected
  9   |  * 2. Closed period prevents SO creation and approval
  10  |  * 3. Period boundary edge cases (first/last day of period)
  11  |  * =============================================================================
  12  |  */
  13  | 
  14  | 
  15  | 
  16  | /**
  17  |  * SALES PERIOD CONTROL EDGE CASES
  18  |  *
  19  |  * Objectives:
  20  |  * 1. Verify system rejects back-dated SO, Invoice, Receipt outside fiscal period
  21  |  * 2. Verify system rejects future-dated SO, Invoice, Receipt outside fiscal period
  22  |  * 3. Test critical edge cases: leap years, month boundaries, year boundaries
  23  |  * 4. Test Ethiopian calendar edge cases (system uses EC calendar by default)
  24  |  *
  25  |  * Fiscal Context:
  26  |  * - Default Year: 2018 (Ethiopian Calendar)
  27  |  * - Period: yearly
  28  |  * - Calendar: EC (Ethiopian Calendar)
  29  |  */
  30  | 
  31  | test.describe('Sales Period Control Edge Cases @sales @security @temporal @regression @full', () => {
  32  |     test.setTimeout(120000);
  33  | 
  34  |     let sharedMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
  35  |     let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;
  36  | 
  37  |     test.beforeAll(async ({ browser }) => {
  38  |         const page = await browser.newPage();
  39  |         const app = new AppManager(page);
  40  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  41  | 
  42  |         sharedMeta = await app.api.sales.discoverMetadataAPI();
  43  |         sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'FIFO', quantity: 20, unit_cost: 100 });
  44  |         await page.close();
  45  |     });
  46  | 
  47  |     test.beforeEach(async ({ page }) => {
  48  |         const app = new AppManager(page);
  49  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  50  | 
  51  |     });
  52  | 
  53  |     // ============================================================================
  54  |     // SALES ORDER (SO) - PERIOD CONTROL SCENARIOS
  55  |     // ============================================================================
  56  | 
  57  |     test('SO: Reject back-dated Sales Order from previous fiscal year (2017)', async ({ page }) => {
  58  |         const app = new AppManager(page);
  59  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  60  |         const meta = sharedMeta;
  61  |         const item = sharedItem;
  62  | 
  63  |         const backDate = '2017-12-31T00:00:00Z';
  64  |         console.log(`[TEST] Creating SO with back date: ${backDate}`);
  65  | 
  66  |         const so = await app.api.sales.createSalesOrderAPI({
  67  |             customerId: meta.customerId,
  68  |             itemId: item.itemId,
  69  |             unitPrice: 5000,
  70  |             quantity: 1,
  71  |             locationId: item.locationId,
  72  |             warehouseId: item.warehouseId,
  73  |             soDate: backDate
  74  |         });
  75  | 
  76  |         if (so.success) {
  77  |             try {
  78  |                 await app.advanceDocumentAPI(so.id, 'sales-orders');
> 79  |                 throw new Error(`[PERIOD_CONTROL_BUG] System approved back-dated SO from previous fiscal year (${backDate})!`);
      |                       ^ Error: [PERIOD_CONTROL_BUG] System approved back-dated SO from previous fiscal year (2017-12-31T00:00:00Z)!
  80  |             } catch (advanceErr: any) {
  81  |                 if (advanceErr.message.includes('PERIOD_CONTROL_BUG')) throw advanceErr;
  82  |                 console.log(`[PASS] SO created but blocked at approval: ${advanceErr.message}`);
  83  |             }
  84  |         } else {
  85  |             console.log(`[PASS] Back-dated SO rejected at creation`);
  86  |         }
  87  |     });
  88  | 
  89  |     test('SO: Reject future-dated Sales Order from next fiscal year (2022)', async ({ page }) => {
  90  |         const app = new AppManager(page);
  91  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  92  |         const meta = sharedMeta;
  93  |         const item = sharedItem;
  94  | 
  95  |         const futureDate = '2022-01-01T00:00:00Z';
  96  |         console.log(`[TEST] Creating SO with future date: ${futureDate}`);
  97  | 
  98  |         const so = await app.api.sales.createSalesOrderAPI({
  99  |             customerId: meta.customerId,
  100 |             itemId: item.itemId,
  101 |             unitPrice: 5000,
  102 |             quantity: 1,
  103 |             locationId: item.locationId,
  104 |             warehouseId: item.warehouseId,
  105 |             soDate: futureDate
  106 |         });
  107 | 
  108 |         if (so.success) {
  109 |             try {
  110 |                 await app.advanceDocumentAPI(so.id, 'sales-orders');
  111 |                 throw new Error(`[PERIOD_CONTROL_BUG] System approved future-dated SO (${futureDate})!`);
  112 |             } catch (advanceErr: any) {
  113 |                 if (advanceErr.message.includes('PERIOD_CONTROL_BUG')) throw advanceErr;
  114 |                 console.log(`[PASS] Future-dated SO blocked at approval: ${advanceErr.message}`);
  115 |             }
  116 |         } else {
  117 |             console.log(`[PASS] Future-dated SO rejected`);
  118 |         }
  119 |     });
  120 | 
  121 |     // ============================================================================
  122 |     // INVOICE - PERIOD CONTROL SCENARIOS
  123 |     // ============================================================================
  124 | 
  125 |     test('Invoice: Reject back-dated Invoice from previous fiscal year (2017)', async ({ page }) => {
  126 |         const app = new AppManager(page);
  127 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  128 |         const meta = sharedMeta;
  129 |         const item = sharedItem;
  130 | 
  131 |         const backDate = '2017-12-31T00:00:00Z';
  132 |         console.log(`[TEST] Creating Invoice with back date: ${backDate}`);
  133 | 
  134 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  135 |             customerId: meta.customerId,
  136 |             itemId: item.itemId,
  137 |             unitPrice: 5000,
  138 |             quantity: 1,
  139 |             locationId: item.locationId,
  140 |             warehouseId: item.warehouseId,
  141 |             invoiceDate: backDate
  142 |         });
  143 | 
  144 |         if (inv.success) {
  145 |             try {
  146 |                 await app.advanceDocumentAPI(inv.id, 'invoices');
  147 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Invoice from previous fiscal year!`);
  148 |             } catch (advanceErr: any) {
  149 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  150 |                 console.log(`[PASS] Back-dated Invoice blocked at approval: ${advanceErr.message}`);
  151 |             }
  152 |         } else {
  153 |             console.log(`[PASS] Back-dated Invoice rejected`);
  154 |         }
  155 |     });
  156 | 
  157 |     test('Invoice: Reject future-dated Invoice from next fiscal year (2022)', async ({ page }) => {
  158 |         const app = new AppManager(page);
  159 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  160 |         const meta = sharedMeta;
  161 |         const item = sharedItem;
  162 | 
  163 |         const futureDate = '2022-01-01T00:00:00Z';
  164 |         console.log(`[TEST] Creating Invoice with future date: ${futureDate}`);
  165 | 
  166 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  167 |             customerId: meta.customerId,
  168 |             itemId: item.itemId,
  169 |             unitPrice: 5000,
  170 |             quantity: 1,
  171 |             locationId: item.locationId,
  172 |             warehouseId: item.warehouseId,
  173 |             invoiceDate: futureDate
  174 |         });
  175 | 
  176 |         if (inv.success) {
  177 |             try {
  178 |                 await app.advanceDocumentAPI(inv.id, 'invoices');
  179 |                 throw new Error(`[PERIOD_CONTROL_BUG] System approved future-dated Invoice (${futureDate})!`);
```