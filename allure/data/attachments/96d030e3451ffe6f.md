# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-partial-release.spec.ts >> Procurement Partial PO Release Audit @purchase @logic @regression @full >> Audit: Partial PO release correctly tracks remaining unreceived quantity
- Location: tests/purchase/po-partial-release.spec.ts:27:9

# Error details

```
Error: [VULNERABILITY] Partial Release Tracking Failed — Received: 0, Expected: 5
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
  1  | import { test } from '@playwright/test';
  2  | import { AppManager } from '../../pages/AppManager';
  3  | 
  4  | /**
  5  |  * PROCUREMENT PARTIAL PO RELEASE AUDIT
  6  |  */
  7  | test.describe('Procurement Partial PO Release Audit @purchase @logic @regression @full', () => {
  8  |     test.setTimeout(300000);
  9  | 
  10 |     let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
  11 |     let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['captureRandomItemDataAPI']>>;
  12 | 
  13 |     test.beforeAll(async ({ browser }) => {
  14 |         const page = await browser.newPage();
  15 |         const app = new AppManager(page);
  16 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  17 |         sharedMeta = await app.api.purchase.discoverMetadataAPI();
  18 |         sharedItem = await app.api.inventory.captureRandomItemDataAPI({ minStock: 10 });
  19 |         await page.close();
  20 |     });
  21 | 
  22 |     test.beforeEach(async ({ page }) => {
  23 |         const app = new AppManager(page);
  24 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  25 |     });
  26 | 
  27 |     test('Audit: Partial PO release correctly tracks remaining unreceived quantity', async ({ page }) => {
  28 |         const app = new AppManager(page);
  29 |         const { apiBase, headers, qs } = await app.buildApiContext();
  30 |         const meta = sharedMeta;
  31 |         const item = sharedItem;
  32 | 
  33 |         const PO_QTY = 10;
  34 |         const RECEIVE_QTY = 5;
  35 |         const EXPECTED_REMAINING = PO_QTY - RECEIVE_QTY;
  36 | 
  37 |         if (!item) { console.log(`[SKIP] No item with stock >= ${PO_QTY}.`); return; }
  38 | 
  39 |         console.log(`[STEP 1] Creating PO for ${PO_QTY} units...`);
  40 |         const po = await app.api.purchase.createPurchaseOrderAPI({
  41 |             itemId: item.itemId,
  42 |             itemName: item.itemName,
  43 |             locationId: item.locationId,
  44 |             warehouseId: item.warehouseId
  45 |         }, PO_QTY, 5000, meta.vendorId);
  46 |         await app.advanceDocumentAPI(po.poId, 'purchase-orders');
  47 |         console.log(`[OK] PO ${po.poNumber} approved.`);
  48 | 
  49 |         console.log(`[STEP 2] Receiving only ${RECEIVE_QTY} units via bill...`);
  50 |         const bill = await app.api.purchase.createBillAPI({
  51 |             vendorId: meta.vendorId,
  52 |             itemId: item.itemId,
  53 |             quantity: RECEIVE_QTY,
  54 |             unitPrice: 5000,
  55 |             apAccountId: meta.apAccountId
  56 |         });
  57 |         if (!bill.success) throw new Error(`Bill creation failed`);
  58 |         await app.advanceDocumentAPI(bill.id, 'bills');
  59 |         console.log(`[OK] Bill ${bill.ref} approved for ${RECEIVE_QTY} units.`);
  60 | 
  61 |         await page.waitForTimeout(3000);
  62 | 
  63 |         console.log(`[STEP 3] Verifying partial release via bill line items...`);
  64 |         const billResp = await page.request.get(`${apiBase}/bill/${bill.id}?${qs}`, { headers });
  65 |         if (!billResp.ok()) throw new Error(`Failed to fetch bill: ${billResp.status()}`);
  66 |         const billData = await billResp.json();
  67 | 
  68 |         const receivedItems = billData.received_purchase_order_items || billData.bill_items || billData.items || [];
  69 |         const totalReceived = receivedItems.reduce((sum: number, it: any) => sum + parseFloat(it.received_quantity || it.quantity || '0'), 0);
  70 |         const remainingQty = PO_QTY - totalReceived;
  71 | 
  72 |         console.log(`[QTY] PO Total: ${PO_QTY} | Received: ${totalReceived} (Expected: ${RECEIVE_QTY}) | Remaining: ${remainingQty} (Expected: ${EXPECTED_REMAINING})`);
  73 | 
  74 |         if (totalReceived !== RECEIVE_QTY) {
> 75 |             throw new Error(`[VULNERABILITY] Partial Release Tracking Failed — Received: ${totalReceived}, Expected: ${RECEIVE_QTY}`);
     |                   ^ Error: [VULNERABILITY] Partial Release Tracking Failed — Received: 0, Expected: 5
  76 |         }
  77 |         if (remainingQty !== EXPECTED_REMAINING) {
  78 |             throw new Error(`[VULNERABILITY] Partial Release Remaining Qty Mismatch — Remaining: ${remainingQty}, Expected: ${EXPECTED_REMAINING}`);
  79 |         }
  80 | 
  81 |         console.log(`[PASS] Partial PO release confirmed: ${RECEIVE_QTY} received, ${EXPECTED_REMAINING} remaining.`);
  82 |     });
  83 | });
  84 | 
```