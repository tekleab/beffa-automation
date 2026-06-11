# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-split-bill.spec.ts >> Procurement PO Split Bill Audit @purchase @logic @regression @full >> Audit: PO split into multiple bills — total must never exceed PO quantity
- Location: tests/purchase/po-split-bill.spec.ts:15:9

# Error details

```
Error: [VULNERABILITY] Split Bill Stock Mismatch
  PO         : PO/2026/06/11/000043 (ID: ec6fb179-9827-410c-89b7-e93e99efc206)
  Bill 1     : BILL/2026/06/11/000125 — 4 units
  Bill 2     : BILL/2026/06/11/000127 — 6 units
  Stock Before: 20
  Stock After : 20
  Expected   : 30
  Root Cause : Split bills did not add the correct total stock.
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
  5   |  * PROCUREMENT PO SPLIT BILL AUDIT
  6   |  *
  7   |  * Objective:
  8   |  * PO for 10 units — receive in 2 batches (4 + 6).
  9   |  * Assert total billed never exceeds PO qty and system blocks a 3rd bill.
  10  |  */
  11  | 
  12  | test.describe('Procurement PO Split Bill Audit @purchase @logic @regression @full', () => {
  13  |     test.setTimeout(120000);
  14  | 
  15  |     test('Audit: PO split into multiple bills — total must never exceed PO quantity', async ({ page }) => {
  16  |         const app = new AppManager(page);
  17  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  18  | 
  19  |         const PO_QTY = 10;
  20  |         const BATCH_1 = 4;
  21  |         const BATCH_2 = 6;
  22  |         const OVER_QTY = 1; // attempt after PO is fully received
  23  | 
  24  |         const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: PO_QTY + 10, unit_cost: 100 });
  25  |         if (!item) { console.log(`[SKIP] No item with stock >= ${PO_QTY}.`); return; }
  26  | 
  27  |         const meta = await app.api.purchase.discoverMetadataAPI();
  28  | 
  29  |         console.log(`\n========== PO SPLIT BILL SETUP ==========`);
  30  |         console.log(`[ITEM]  Item ID     : ${item.itemId} (${item.itemName})`);
  31  |         console.log(`[ITEM]  Stock       : ${item.currentStock}`);
  32  |         console.log(`[PLAN]  PO Qty      : ${PO_QTY}`);
  33  |         console.log(`[PLAN]  Batch 1     : ${BATCH_1}`);
  34  |         console.log(`[PLAN]  Batch 2     : ${BATCH_2}`);
  35  |         console.log(`[PLAN]  Over-receive: ${OVER_QTY} (must be blocked)`);
  36  |         console.log(`============================================\n`);
  37  | 
  38  |         console.log(`[STEP 1] Creating & approving PO for ${PO_QTY} units...`);
  39  |         const po = await app.api.purchase.createPurchaseOrderAPI({
  40  |             itemId: item.itemId,
  41  |             itemName: item.itemName,
  42  |             locationId: item.locationId,
  43  |             warehouseId: item.warehouseId
  44  |         }, PO_QTY, 5000, meta.vendorId);
  45  |         await app.advanceDocumentAPI(po.poId, 'purchase-orders');
  46  |         console.log(`[OK] PO ${po.poNumber} approved (ID: ${po.poId})`);
  47  | 
  48  |         console.log(`[STEP 2] Receiving Batch 1: ${BATCH_1} units...`);
  49  |         const bill1 = await app.api.purchase.createBillAPI({
  50  |             vendorId: meta.vendorId,
  51  |             itemId: item.itemId,
  52  |             quantity: BATCH_1,
  53  |             unitPrice: 5000,
  54  |             apAccountId: meta.apAccountId,
  55  |             poId: po.poId
  56  |         });
  57  |         if (!bill1.success) throw new Error(`Batch 1 bill failed: ${bill1.error}`);
  58  |         await app.advanceDocumentAPI(bill1.id, 'bills');
  59  |         console.log(`[OK] Batch 1 bill ${bill1.ref} approved.`);
  60  | 
  61  |         console.log(`[STEP 3] Receiving Batch 2: ${BATCH_2} units...`);
  62  |         const bill2 = await app.api.purchase.createBillAPI({
  63  |             vendorId: meta.vendorId,
  64  |             itemId: item.itemId,
  65  |             quantity: BATCH_2,
  66  |             unitPrice: 5000,
  67  |             apAccountId: meta.apAccountId,
  68  |             poId: po.poId
  69  |         });
  70  |         if (!bill2.success) throw new Error(`Batch 2 bill failed: ${bill2.error}`);
  71  |         await app.advanceDocumentAPI(bill2.id, 'bills');
  72  |         console.log(`[OK] Batch 2 bill ${bill2.ref} approved.`);
  73  | 
  74  |         await page.waitForTimeout(3000);
  75  | 
  76  |         console.log(`[STEP 4] Verifying stock added correctly (${PO_QTY} units total)...`);
  77  |         const finalStock = await app.api.inventory.getItemDetailsAPI(item.itemId, item.locationId);
  78  |         const expectedStock = item.currentStock + PO_QTY;
  79  | 
  80  |         console.log(`\n========== SPLIT BILL STOCK AUDIT ==========`);
  81  |         console.log(`[DOCUMENT] PO Ref       : ${po.poNumber} (ID: ${po.poId})`);
  82  |         console.log(`[DOCUMENT] Bill 1       : ${bill1.ref} (ID: ${bill1.id}) — ${BATCH_1} units`);
  83  |         console.log(`[DOCUMENT] Bill 2       : ${bill2.ref} (ID: ${bill2.id}) — ${BATCH_2} units`);
  84  |         console.log(`[ITEM]     Item         : ${item.itemName} (${item.itemId})`);
  85  |         console.log(`[STOCK]    Before       : ${item.currentStock}`);
  86  |         console.log(`[STOCK]    After        : ${finalStock?.currentStock}`);
  87  |         console.log(`[STOCK]    Expected     : ${expectedStock}`);
  88  |         console.log(`================================================\n`);
  89  | 
  90  |         if (finalStock?.currentStock !== expectedStock) {
> 91  |             throw new Error(
      |                   ^ Error: [VULNERABILITY] Split Bill Stock Mismatch
  92  |                 `[VULNERABILITY] Split Bill Stock Mismatch\n` +
  93  |                 `  PO         : ${po.poNumber} (ID: ${po.poId})\n` +
  94  |                 `  Bill 1     : ${bill1.ref} — ${BATCH_1} units\n` +
  95  |                 `  Bill 2     : ${bill2.ref} — ${BATCH_2} units\n` +
  96  |                 `  Stock Before: ${item.currentStock}\n` +
  97  |                 `  Stock After : ${finalStock?.currentStock}\n` +
  98  |                 `  Expected   : ${expectedStock}\n` +
  99  |                 `  Root Cause : Split bills did not add the correct total stock.`
  100 |             );
  101 |         }
  102 | 
  103 |         console.log(`[STEP 5] Attempting over-receive (${OVER_QTY} more unit after PO fully received)...`);
  104 |         try {
  105 |             const bill3 = await app.api.purchase.createBillAPI({
  106 |                 vendorId: meta.vendorId,
  107 |                 itemId: item.itemId,
  108 |                 quantity: OVER_QTY,
  109 |                 unitPrice: 5000,
  110 |                 apAccountId: meta.apAccountId,
  111 |                 poId: po.poId
  112 |             });
  113 | 
  114 |             if (bill3.success) {
  115 |                 await app.advanceDocumentAPI(bill3.id, 'bills');
  116 |                 throw new Error(
  117 |                     `[VULNERABILITY] Over-Receive Allowed on Fully Received PO\n` +
  118 |                     `  PO         : ${po.poNumber} (ID: ${po.poId})\n` +
  119 |                     `  Bill 1     : ${bill1.ref} — ${BATCH_1} units\n` +
  120 |                     `  Bill 2     : ${bill2.ref} — ${BATCH_2} units\n` +
  121 |                     `  Bill 3     : ${bill3.ref} — ${OVER_QTY} extra unit (should have been blocked)\n` +
  122 |                     `  Root Cause : System does not enforce PO quantity ceiling across multiple bills.`
  123 |                 );
  124 |             }
  125 |             console.log(`[PASS] Over-receive correctly rejected at bill creation.`);
  126 |         } catch (err: any) {
  127 |             if (err.message.includes('[VULNERABILITY]')) throw err;
  128 |             console.log(`[PASS] Over-receive correctly blocked: ${err.message}`);
  129 |         }
  130 | 
  131 |         console.log(`[PASS] PO split bill audit complete: ${BATCH_1} + ${BATCH_2} = ${PO_QTY} units correctly received and tracked.`);
  132 |     });
  133 | });
  134 | 
```