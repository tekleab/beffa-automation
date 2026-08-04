# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-period-control.spec.ts >> Sales Period Control Edge Cases @sales @security @temporal @regression @full >> SO: Reject back-dated Sales Order from previous fiscal year (2017)
- Location: tests/sales/so-period-control.spec.ts:43:9

# Error details

```
Error: [CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated SO from previous fiscal year!
  SO ID    : 14f3fb48-636c-4a81-bc70-b00f8a769078
  SO Ref   : SO/2026/08/04/000140
  SO Date  : 2017-12-31T00:00:00Z
  Item     : WAC-Item-1785825651643 (4196dc0f-0f38-4350-9c52-68d17000b977)
  Customer : 243b9845-e056-48ce-924d-6f233d99c574
  Status   : Approved — period control NOT enforced at SO approval
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
  4   | /**
  5   |  * SALES PERIOD CONTROL EDGE CASES
  6   |  *
  7   |  * Objectives:
  8   |  * 1. Verify system rejects back-dated SO, Invoice, Receipt outside fiscal period
  9   |  * 2. Verify system rejects future-dated SO, Invoice, Receipt outside fiscal period
  10  |  * 3. Test critical edge cases: leap years, month boundaries, year boundaries
  11  |  * 4. Test Ethiopian calendar edge cases (system uses EC calendar by default)
  12  |  *
  13  |  * Fiscal Context:
  14  |  * - Default Year: 2018 (Ethiopian Calendar)
  15  |  * - Period: yearly
  16  |  * - Calendar: EC (Ethiopian Calendar)
  17  |  */
  18  | 
  19  | test.describe('Sales Period Control Edge Cases @sales @security @temporal @regression @full', () => {
  20  |     test.setTimeout(120000);
  21  | 
  22  |     let sharedMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
  23  |     let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;
  24  | 
  25  |     test.beforeAll(async ({ browser }) => {
  26  |         const page = await browser.newPage();
  27  |         const app = new AppManager(page);
  28  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  29  |         sharedMeta = await app.api.sales.discoverMetadataAPI();
  30  |         sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
  31  |         await page.close();
  32  |     });
  33  | 
  34  |     test.beforeEach(async ({ page }) => {
  35  |         const app = new AppManager(page);
  36  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  37  |     });
  38  | 
  39  |     // ============================================================================
  40  |     // SALES ORDER (SO) - PERIOD CONTROL SCENARIOS
  41  |     // ============================================================================
  42  | 
  43  |     test('SO: Reject back-dated Sales Order from previous fiscal year (2017)', async ({ page }) => {
  44  |         const app = new AppManager(page);
  45  |         const meta = sharedMeta;
  46  |         const item = sharedItem;
  47  | 
  48  |         const backDate = '2017-12-31T00:00:00Z';
  49  |         console.log(`[TEST] Creating SO with back date: ${backDate}`);
  50  | 
  51  |         const so = await app.api.sales.createSalesOrderAPI({
  52  |             customerId: meta.customerId,
  53  |             itemId: item.itemId,
  54  |             unitPrice: 5000,
  55  |             quantity: 1,
  56  |             locationId: item.locationId,
  57  |             warehouseId: item.warehouseId,
  58  |             soDate: backDate
  59  |         });
  60  | 
  61  |         if (so.success) {
  62  |             try {
  63  |                 await app.advanceDocumentAPI(so.id, 'sales-orders');
> 64  |                 throw new Error(
      |                       ^ Error: [CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated SO from previous fiscal year!
  65  |                     `[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated SO from previous fiscal year!\n` +
  66  |                     `  SO ID    : ${so.id}\n` +
  67  |                     `  SO Ref   : ${so.ref}\n` +
  68  |                     `  SO Date  : ${backDate}\n` +
  69  |                     `  Item     : ${item.itemName} (${item.itemId})\n` +
  70  |                     `  Customer : ${meta.customerId}\n` +
  71  |                     `  Status   : Approved — period control NOT enforced at SO approval`
  72  |                 );
  73  |             } catch (advanceErr: any) {
  74  |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  75  |                 console.log(`[PASS] SO created but blocked at approval: ${advanceErr.message}`);
  76  |             }
  77  |         } else {
  78  |             console.log(`[PASS] Back-dated SO rejected at creation`);
  79  |         }
  80  |     });
  81  | 
  82  |     test('SO: Reject future-dated Sales Order from next fiscal year (2019)', async ({ page }) => {
  83  |         const app = new AppManager(page);
  84  |         const meta = sharedMeta;
  85  |         const item = sharedItem;
  86  | 
  87  |         const futureDate = '2019-01-01T00:00:00Z';
  88  |         console.log(`[TEST] Creating SO with future date: ${futureDate}`);
  89  | 
  90  |         const so = await app.api.sales.createSalesOrderAPI({
  91  |             customerId: meta.customerId,
  92  |             itemId: item.itemId,
  93  |             unitPrice: 5000,
  94  |             quantity: 1,
  95  |             locationId: item.locationId,
  96  |             warehouseId: item.warehouseId,
  97  |             soDate: futureDate
  98  |         });
  99  | 
  100 |         if (so.success) {
  101 |             try {
  102 |                 await app.advanceDocumentAPI(so.id, 'sales-orders');
  103 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved SO from next fiscal year!`);
  104 |             } catch (advanceErr: any) {
  105 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  106 |                 console.log(`[PASS] Future-dated SO blocked at approval: ${advanceErr.message}`);
  107 |             }
  108 |         } else {
  109 |             console.log(`[PASS] Future-dated SO rejected`);
  110 |         }
  111 |     });
  112 | 
  113 |     // ============================================================================
  114 |     // INVOICE - PERIOD CONTROL SCENARIOS
  115 |     // ============================================================================
  116 | 
  117 |     test('Invoice: Reject back-dated Invoice from previous fiscal year (2017)', async ({ page }) => {
  118 |         const app = new AppManager(page);
  119 |         const meta = sharedMeta;
  120 |         const item = sharedItem;
  121 | 
  122 |         const backDate = '2017-12-31T00:00:00Z';
  123 |         console.log(`[TEST] Creating Invoice with back date: ${backDate}`);
  124 | 
  125 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  126 |             customerId: meta.customerId,
  127 |             itemId: item.itemId,
  128 |             unitPrice: 5000,
  129 |             quantity: 1,
  130 |             locationId: item.locationId,
  131 |             warehouseId: item.warehouseId,
  132 |             invoiceDate: backDate
  133 |         });
  134 | 
  135 |         if (inv.success) {
  136 |             try {
  137 |                 await app.advanceDocumentAPI(inv.id, 'invoices');
  138 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Invoice from previous fiscal year!`);
  139 |             } catch (advanceErr: any) {
  140 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  141 |                 console.log(`[PASS] Back-dated Invoice blocked at approval: ${advanceErr.message}`);
  142 |             }
  143 |         } else {
  144 |             console.log(`[PASS] Back-dated Invoice rejected`);
  145 |         }
  146 |     });
  147 | 
  148 |     test('Invoice: Reject future-dated Invoice from next fiscal year (2019)', async ({ page }) => {
  149 |         const app = new AppManager(page);
  150 |         const meta = sharedMeta;
  151 |         const item = sharedItem;
  152 | 
  153 |         const futureDate = '2019-01-01T00:00:00Z';
  154 |         console.log(`[TEST] Creating Invoice with future date: ${futureDate}`);
  155 | 
  156 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  157 |             customerId: meta.customerId,
  158 |             itemId: item.itemId,
  159 |             unitPrice: 5000,
  160 |             quantity: 1,
  161 |             locationId: item.locationId,
  162 |             warehouseId: item.warehouseId,
  163 |             invoiceDate: futureDate
  164 |         });
```