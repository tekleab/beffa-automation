# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/procurement-concurrency-race.spec.ts >> Procurement Concurrency & Race Condition Audits @purchase @concurrency @security @regression @full >> Guardrail: System must handle concurrent duplicate Bill payments atomically
- Location: tests/purchase/procurement-concurrency-race.spec.ts:20:9

# Error details

```
Error: [CRITICAL_LOGIC_BUG] Concurrency Failure: System approved 2 full payments for a single Bill! Cash leak detected.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "sample" [ref=e10]: s
        - generic [ref=e11]:
          - button "sample" [ref=e12] [cursor=pointer]:
            - generic: sample
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
          - img "sample" [ref=e62]: s
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
  1  | import { test, expect } from'@playwright/test';
  2  | import { AppManager } from'../../pages/AppManager';
  3  | 
  4  | /**
  5  |  * PROCUREMENT CONCURRENCY & RACE CONDITIONS
  6  |  * 
  7  |  * Objectives:
  8  |  * 1. Verify system handles concurrent duplicate Bill payments atomically.
  9  |  * 2. Verify system enforces thread-safe serialization for stock additions (Inventory Increase).
  10 |  */
  11 | 
  12 | test.describe('Procurement Concurrency & Race Condition Audits @purchase @concurrency @security @regression @full', () => {
  13 |     test.describe.configure({ mode:'serial' });
  14 | 
  15 |     test.beforeEach(async ({ page }) => {
  16 |         const app = new AppManager(page);
  17 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  18 |     });
  19 | 
  20 |     test('Guardrail: System must handle concurrent duplicate Bill payments atomically', async ({ page }) => {
  21 |         const app = new AppManager(page);
  22 |         const meta = await app.api.purchase.discoverMetadataAPI();
  23 |         const item = await app.api.inventory.captureRandomItemDataAPI();
  24 | 
  25 |         // 1. Create a Bill for 1000
  26 |         console.log(`[STEP 1] Creating target Bill for 1000...`);
  27 |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 1000, quantity: 1, vendorId: meta.vendorId });
  28 |         await app.advanceDocumentAPI(bill.id,'bills');
  29 | 
  30 |         // 2. TRIGGER RACE: Send 2 payments for 1000 at the EXACT same time
  31 |         console.log(`[ATTACK] Triggering Concurrent Payment Race...`);
  32 |         
  33 |         const pay1 = app.api.purchase.createBillPaymentAPI({ amount: 1000, billId: bill.id, vendorId: meta.vendorId });
  34 |         const pay2 = app.api.purchase.createBillPaymentAPI({ amount: 1000, billId: bill.id, vendorId: meta.vendorId });
  35 | 
  36 |         const results = await Promise.allSettled([pay1, pay2]);
  37 |         
  38 |         const successes = results.filter(r => r.status ==='fulfilled');
  39 |         console.log(`[SNAPSHOT] Concurrent Results: ${successes.length} / 2 requests fulfilled.`);
  40 | 
  41 |         if (successes.length > 1) {
  42 |             console.warn(`[VULNERABILITY] Both payment requests accepted! Checking if both can be APPROVED...`);
  43 |             
  44 |             const ids = successes.map((s: any) => s.value.id);
  45 |             const approvals = ids.map(id => app.advanceDocumentAPI(id,'payments'));
  46 |             
  47 |             const finalApprovals = await Promise.allSettled(approvals);
  48 |             const fullyApproved = finalApprovals.filter(a => a.status ==='fulfilled');
  49 |             
  50 |             if (fullyApproved.length > 1) {
> 51 |                 throw new Error(`[CRITICAL_LOGIC_BUG] Concurrency Failure: System approved 2 full payments for a single Bill! Cash leak detected.`);
     |                       ^ Error: [CRITICAL_LOGIC_BUG] Concurrency Failure: System approved 2 full payments for a single Bill! Cash leak detected.
  52 |             }
  53 |         }
  54 |         
  55 |         console.log(`[PASS] Integrity Guardrail: System blocked or rejected the duplicate payment race.`);
  56 |     });
  57 | 
  58 |     test('Guardrail: System must enforce thread-safe serialization for stock additions', async ({ page }) => {
  59 |         const app = new AppManager(page);
  60 |         const meta = await app.api.purchase.discoverMetadataAPI();
  61 |         const item = await app.api.inventory.captureRandomItemDataAPI();
  62 | 
  63 |         console.log(`[STEP 1] Capturing Baseline for "${item.itemName}"...`);
  64 |         const startStock = item.currentStock;
  65 |         
  66 |         // 2. Create 2 Bills for 5 units each
  67 |         const bill1 = await app.api.purchase.createBillAPI({ itemData: item, quantity: 5, vendorId: meta.vendorId });
  68 |         const bill2 = await app.api.purchase.createBillAPI({ itemData: item, quantity: 5, vendorId: meta.vendorId });
  69 | 
  70 |         // 3. TRIGGER RACE: Approve both at the same time
  71 |         console.log(`[ATTACK] Triggering Concurrent Stock Increase (Approval Race)...`);
  72 |         
  73 |         await Promise.all([
  74 |             app.advanceDocumentAPI(bill1.id,'bills'),
  75 |             app.advanceDocumentAPI(bill2.id,'bills')
  76 |         ]);
  77 | 
  78 |         // 4. Verify Final Stock: Must be exactly Start + 10
  79 |         console.log(`[AUDIT] Verifying Stock Integrity...`);
  80 |         const expectedStock = startStock + 10;
  81 |         const finalStock = await app.api.inventory.pollStockAPI(item.itemId, expectedStock, item.locationId);
  82 |         
  83 |         console.log(`[SNAPSHOT] Start: ${startStock} | Expected: ${expectedStock} | Final: ${finalStock}`);
  84 | 
  85 |         if (finalStock !== expectedStock) {
  86 |             throw new Error(`[CRITICAL_LOGIC_BUG] Stock Desync: Concurrent approvals caused lost updates. Expected ${expectedStock}, found ${finalStock}.`);
  87 |         }
  88 | 
  89 |         expect(finalStock).toBe(expectedStock);
  90 |         console.log(`[PASS] Stock Addition is atomic and thread-safe.`);
  91 |     });
  92 | });
  93 | 
```