# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-split-invoice.spec.ts >> Sales SO Split Invoice Audit @sales @logic @regression @full >> Audit: SO split into multiple invoices — total must never exceed SO quantity
- Location: tests/sales/so-split-invoice.spec.ts:16:9

# Error details

```
Error: [VULNERABILITY] Split Invoice Stock Mismatch
  SO         : SO/2026/08/10/000296 (ID: d71229f5-7105-4ce2-b14a-96feede2338c)
  Invoice 1  : INV/2026/08/10/001183 — 4 units
  Invoice 2  : INV/2026/08/10/001184 — 6 units
  Stock Before: 20
  Stock After : 0
  Expected   : 10
  Root Cause : Split invoices did not deduct the correct total stock.
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
  6   |  * SALES SO SPLIT INVOICE AUDIT
  7   |  *
  8   |  * Objective:
  9   |  * SO for 10 units — release in 2 batches (4 + 6).
  10  |  * Assert total invoiced never exceeds SO qty and system blocks a 3rd invoice.
  11  |  */
  12  | 
  13  | test.describe('Sales SO Split Invoice Audit @sales @logic @regression @full', () => {
  14  |     test.setTimeout(120000);
  15  | 
  16  |     test('Audit: SO split into multiple invoices — total must never exceed SO quantity', async ({ page }) => {
  17  |         const app = new AppManager(page);
  18  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  19  | 
  20  | 
  21  |         const SO_QTY = 10;
  22  |         const BATCH_1 = 4;
  23  |         const BATCH_2 = 6;
  24  |         const OVER_QTY = 1; // attempt after SO is fully released
  25  | 
  26  |         const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: SO_QTY + 10, unit_cost: 100 });
  27  |         if (!item) { console.log(`[SKIP] No item with stock >= ${SO_QTY}.`); return; }
  28  | 
  29  |         console.log(`\n========== SO SPLIT INVOICE SETUP ==========`);
  30  |         console.log(`[ITEM]  Item ID     : ${item.itemId} (${item.itemName})`);
  31  |         console.log(`[ITEM]  Stock       : ${item.currentStock}`);
  32  |         console.log(`[PLAN]  SO Qty      : ${SO_QTY}`);
  33  |         console.log(`[PLAN]  Batch 1     : ${BATCH_1}`);
  34  |         console.log(`[PLAN]  Batch 2     : ${BATCH_2}`);
  35  |         console.log(`[PLAN]  Over-release: ${OVER_QTY} (must be blocked)`);
  36  |         console.log(`============================================\n`);
  37  | 
  38  |         console.log(`[STEP 1] Creating & approving SO for ${SO_QTY} units...`);
  39  |         const so = await app.api.sales.createSalesOrderAPI({
  40  |             itemId: item.itemId,
  41  |             quantity: SO_QTY,
  42  |             locationId: item.locationId,
  43  |             warehouseId: item.warehouseId
  44  |         });
  45  |         await app.advanceDocumentAPI(so.id, 'sales-orders');
  46  |         console.log(`[OK] SO ${so.ref} approved (ID: ${so.id})`);
  47  | 
  48  |         console.log(`[STEP 2] Releasing Batch 1: ${BATCH_1} units...`);
  49  |         const inv1 = await app.api.sales.createInvoiceAPI({
  50  |             customerId: so.customerId,
  51  |             soId: so.id,
  52  |             soItemId: so.soItemId,
  53  |             releasedQuantity: BATCH_1,
  54  |             locationId: item.locationId,
  55  |             warehouseId: item.warehouseId
  56  |         });
  57  |         if (!inv1.success) throw new Error(`Batch 1 invoice failed: ${inv1.error}`);
  58  |         await app.advanceDocumentAPI(inv1.id!, 'invoices');
  59  |         console.log(`[OK] Batch 1 invoice ${inv1.ref} approved.`);
  60  | 
  61  |         console.log(`[STEP 3] Releasing Batch 2: ${BATCH_2} units...`);
  62  |         const inv2 = await app.api.sales.createInvoiceAPI({
  63  |             customerId: so.customerId,
  64  |             soId: so.id,
  65  |             soItemId: so.soItemId,
  66  |             releasedQuantity: BATCH_2,
  67  |             locationId: item.locationId,
  68  |             warehouseId: item.warehouseId
  69  |         });
  70  |         if (!inv2.success) throw new Error(`Batch 2 invoice failed: ${inv2.error}`);
  71  |         await app.advanceDocumentAPI(inv2.id!, 'invoices');
  72  |         console.log(`[OK] Batch 2 invoice ${inv2.ref} approved.`);
  73  | 
  74  |         await page.waitForTimeout(3000);
  75  | 
  76  |         console.log(`[STEP 4] Verifying stock deducted correctly (${SO_QTY} units total)...`);
  77  |         const expectedStock = item.currentStock - SO_QTY;
  78  |         await app.api.inventory.pollStockAPI(item.itemId, expectedStock, item.locationId, 20);
  79  |         const finalStock = await app.api.inventory.getItemDetailsAPI(item.itemId, item.locationId);
  80  | 
  81  |         console.log(`\n========== SPLIT INVOICE STOCK AUDIT ==========`);
  82  |         console.log(`[DOCUMENT] SO Ref       : ${so.ref} (ID: ${so.id})`);
  83  |         console.log(`[DOCUMENT] Invoice 1    : ${inv1.ref} (ID: ${inv1.id}) — ${BATCH_1} units`);
  84  |         console.log(`[DOCUMENT] Invoice 2    : ${inv2.ref} (ID: ${inv2.id}) — ${BATCH_2} units`);
  85  |         console.log(`[ITEM]     Item         : ${item.itemName} (${item.itemId})`);
  86  |         console.log(`[STOCK]    Before       : ${item.currentStock}`);
  87  |         console.log(`[STOCK]    After        : ${finalStock?.currentStock}`);
  88  |         console.log(`[STOCK]    Expected     : ${expectedStock}`);
  89  |         console.log(`================================================\n`);
  90  | 
  91  |         if (finalStock?.currentStock !== expectedStock) {
> 92  |             throw new Error(
      |                   ^ Error: [VULNERABILITY] Split Invoice Stock Mismatch
  93  |                 `[VULNERABILITY] Split Invoice Stock Mismatch\n` +
  94  |                 `  SO         : ${so.ref} (ID: ${so.id})\n` +
  95  |                 `  Invoice 1  : ${inv1.ref} — ${BATCH_1} units\n` +
  96  |                 `  Invoice 2  : ${inv2.ref} — ${BATCH_2} units\n` +
  97  |                 `  Stock Before: ${item.currentStock}\n` +
  98  |                 `  Stock After : ${finalStock?.currentStock}\n` +
  99  |                 `  Expected   : ${expectedStock}\n` +
  100 |                 `  Root Cause : Split invoices did not deduct the correct total stock.`
  101 |             );
  102 |         }
  103 | 
  104 |         console.log(`[STEP 5] Attempting over-release (${OVER_QTY} more unit after SO fully released)...`);
  105 |         try {
  106 |             const inv3 = await app.api.sales.createInvoiceAPI({
  107 |                 customerId: so.customerId,
  108 |                 soId: so.id,
  109 |                 soItemId: so.soItemId,
  110 |                 releasedQuantity: OVER_QTY,
  111 |                 locationId: item.locationId,
  112 |                 warehouseId: item.warehouseId
  113 |             });
  114 | 
  115 |             if (inv3.success) {
  116 |                 await app.advanceDocumentAPI(inv3.id!, 'invoices');
  117 |                 throw new Error(
  118 |                     `[VULNERABILITY] Over-Release Allowed on Fully Released SO\n` +
  119 |                     `  SO         : ${so.ref} (ID: ${so.id})\n` +
  120 |                     `  Invoice 1  : ${inv1.ref} — ${BATCH_1} units\n` +
  121 |                     `  Invoice 2  : ${inv2.ref} — ${BATCH_2} units\n` +
  122 |                     `  Invoice 3  : ${inv3.ref} — ${OVER_QTY} extra unit (should have been blocked)\n` +
  123 |                     `  Root Cause : System does not enforce SO quantity ceiling across multiple invoices.`
  124 |                 );
  125 |             }
  126 |             console.log(`[PASS] Over-release correctly rejected at invoice creation.`);
  127 |         } catch (err: any) {
  128 |             if (err.message.includes('[VULNERABILITY]')) throw err;
  129 |             console.log(`[PASS] Over-release correctly blocked: ${err.message}`);
  130 |         }
  131 | 
  132 |         console.log(`[PASS] SO split invoice audit complete: ${BATCH_1} + ${BATCH_2} = ${SO_QTY} units correctly released and tracked.`);
  133 |     });
  134 | });
  135 | 
```