# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-stress.spec.ts >> Procurement Stress & Financial Edge Cases @purchase @logic @security @regression @full >> Guardrail: System must reject payment exceeding bill total
- Location: tests/purchase/po-stress.spec.ts:36:9

# Error details

```
Error: [CRITICAL_LOGIC_BUG] Bill BILL/2026/06/04/000229: Overpayment of 6000 on 3000 bill created negative balance=-3000. Vendor credit injection possible.
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
  5   |  * PROCUREMENT STRESS & FINANCIAL EDGE CASES
  6   |  *
  7   |  * Scenarios designed to expose financial integrity bugs:
  8   |  * 1. Overpayment attack — pay more than bill total         [CONFIRMED BUG: balance goes negative]
  9   |  * 2. Double-billing same PO — duplicate liability
  10  |  * 3. Payment against fully-paid bill — ghost payment
  11  |  * 4. Bill reversal after payment — stock & ledger rollback
  12  |  * 5. Partial payment sequence — balance drift
  13  |  * 6. Orphan bill — cancel PO after bill approved
  14  |  */
  15  | 
  16  | test.describe('Procurement Stress & Financial Edge Cases @purchase @logic @security @regression @full', () => {
  17  | 
  18  |     let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
  19  |     let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['captureRandomItemDataAPI']>>;
  20  | 
  21  |     test.beforeAll(async ({ browser }) => {
  22  |         const page = await browser.newPage();
  23  |         const app = new AppManager(page);
  24  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  25  |         sharedMeta = await app.api.purchase.discoverMetadataAPI();
  26  |         sharedItem = await app.api.inventory.captureRandomItemDataAPI();
  27  |         await page.close();
  28  |     });
  29  | 
  30  |     test.beforeEach(async ({ page }) => {
  31  |         const app = new AppManager(page);
  32  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  33  |     });
  34  | 
  35  |     // ── 1. OVERPAYMENT ATTACK ─────────────────────────────────────────────────
  36  |     test('Guardrail: System must reject payment exceeding bill total', async ({ page }) => {
  37  |         // CONFIRMED BUG: system accepts overpayment and creates negative balance (vendor credit injection)
  38  |         test.fail(true, '[CONFIRMED BUG] Overpayment accepted — balance goes negative. Vendor credit injection possible.');
  39  | 
  40  |         const app = new AppManager(page);
  41  |         const meta = sharedMeta;
  42  |         const item = sharedItem;
  43  | 
  44  |         const billAmount = 3000;
  45  |         console.log(`[STEP 1] Creating & approving Bill for ${billAmount}...`);
  46  |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billAmount, quantity: 1, vendorId: meta.vendorId });
  47  |         await app.advanceDocumentAPI(bill.id, 'bills');
  48  |         console.log(`[BILL] ${bill.ref} (${bill.id}) | Amount: ${billAmount}`);
  49  | 
  50  |         const overpayAmount = billAmount * 2;
  51  |         console.log(`[ATTACK] Overpayment of ${overpayAmount} against bill ${bill.ref} (total: ${billAmount})...`);
  52  |         const payment = await app.api.purchase.createBillPaymentAPI({ amount: overpayAmount, billId: bill.id, vendorId: meta.vendorId });
  53  |         await app.advanceDocumentAPI(payment.id, 'payments');
  54  |         console.log(`[PAYMENT] ${payment.ref} (${payment.id}) | Amount: ${overpayAmount}`);
  55  | 
  56  |         const billData = await app.api.purchase.getBillAPI(bill.id);
  57  |         const balance = parseFloat(billData.balance ?? billData.amount_due ?? billData.unpaid_amount ?? 0);
  58  |         console.log(`[RESULT] Bill ${bill.ref} balance after overpayment: ${balance} (expected: >= 0)`);
  59  | 
  60  |         if (balance < 0) {
> 61  |             throw new Error(`[CRITICAL_LOGIC_BUG] Bill ${bill.ref}: Overpayment of ${overpayAmount} on ${billAmount} bill created negative balance=${balance}. Vendor credit injection possible.`);
      |                   ^ Error: [CRITICAL_LOGIC_BUG] Bill BILL/2026/06/04/000229: Overpayment of 6000 on 3000 bill created negative balance=-3000. Vendor credit injection possible.
  62  |         }
  63  |         console.log(`[PASS] Balance capped at 0 — overpayment handled correctly.`);
  64  |     });
  65  | 
  66  |     // ── 2. DOUBLE-BILLING SAME PO ─────────────────────────────────────────────
  67  |     test('Guardrail: System must prevent double-billing the same PO', async ({ page }) => {
  68  |         const app = new AppManager(page);
  69  |         const meta = sharedMeta;
  70  |         const item = sharedItem;
  71  | 
  72  |         console.log(`[STEP 1] Creating & approving PO...`);
  73  |         const po = await app.api.purchase.createPurchaseOrderAPI(item, 5, 1000, meta.vendorId);
  74  |         await app.advanceDocumentAPI(po.poId, 'purchase-orders');
  75  |         console.log(`[PO] ${po.poNumber} (${po.poId})`);
  76  | 
  77  |         console.log(`[STEP 2] Creating first Bill from PO...`);
  78  |         const bill1 = await app.api.purchase.createBillFromPoAPI(po.poId);
  79  |         await app.advanceDocumentAPI(bill1.billId, 'bills');
  80  |         console.log(`[BILL 1] ${bill1.billNumber} (${bill1.billId}) — approved`);
  81  | 
  82  |         console.log(`[ATTACK] Attempting second Bill from same PO ${po.poNumber}...`);
  83  |         try {
  84  |             const bill2 = await app.api.purchase.createBillFromPoAPI(po.poId);
  85  |             await app.advanceDocumentAPI(bill2.billId, 'bills');
  86  |             throw new Error(`[CRITICAL_LOGIC_BUG] Double-billing allowed! PO ${po.poNumber} billed twice: ${bill1.billNumber} + ${bill2.billNumber}. Duplicate liability created.`);
  87  |         } catch (err: any) {
  88  |             if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
  89  |             console.log(`[PASS] Double-billing correctly blocked: ${err.message}`);
  90  |         }
  91  |     });
  92  | 
  93  |     // ── 3. PAYMENT AGAINST FULLY-PAID BILL ───────────────────────────────────
  94  |     test('Guardrail: System must reject payment against a fully-paid bill', async ({ page }) => {
  95  |         const app = new AppManager(page);
  96  |         const meta = sharedMeta;
  97  |         const item = sharedItem;
  98  | 
  99  |         const billAmount = 2000;
  100 |         console.log(`[STEP 1] Creating & approving Bill for ${billAmount}...`);
  101 |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billAmount, quantity: 1, vendorId: meta.vendorId });
  102 |         await app.advanceDocumentAPI(bill.id, 'bills');
  103 |         console.log(`[BILL] ${bill.ref} (${bill.id}) | Amount: ${billAmount}`);
  104 | 
  105 |         console.log(`[STEP 2] Fully paying bill ${bill.ref}...`);
  106 |         const payment = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
  107 |         await app.advanceDocumentAPI(payment.id, 'payments');
  108 |         console.log(`[PAYMENT] ${payment.ref} (${payment.id}) | Amount: ${billAmount}`);
  109 | 
  110 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  111 |         const balance = parseFloat(billData.balance ?? billData.amount_due ?? billData.unpaid_amount ?? 0);
  112 |         console.log(`[AUDIT] Bill ${bill.ref} balance after full payment: ${balance}`);
  113 |         expect(balance).toBe(0);
  114 | 
  115 |         console.log(`[ATTACK] Attempting ghost payment against fully-paid bill ${bill.ref}...`);
  116 |         try {
  117 |             const ghost = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
  118 |             await app.advanceDocumentAPI(ghost.id, 'payments');
  119 |             console.log(`[GHOST PAYMENT] ${ghost.ref} (${ghost.id})`);
  120 |             throw new Error(`[CRITICAL_LOGIC_BUG] Ghost payment ${ghost.ref} accepted on fully-paid bill ${bill.ref}! Vendor credit manipulation possible.`);
  121 |         } catch (err: any) {
  122 |             if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
  123 |             console.log(`[PASS] Ghost payment correctly blocked: ${err.message}`);
  124 |         }
  125 |     });
  126 | 
  127 |     // ── 4. BILL REVERSAL AFTER PAYMENT — STOCK & LEDGER ROLLBACK ─────────────
  128 |     test('Audit: Bill reversal after payment must roll back stock and restore balance', async ({ page }) => {
  129 |         const app = new AppManager(page);
  130 |         const meta = sharedMeta;
  131 |         const item = sharedItem;
  132 | 
  133 |         const qty = 3;
  134 |         const stockBefore = item.currentStock;
  135 |         console.log(`[ITEM] "${item.itemName}" | Stock before: ${stockBefore}`);
  136 | 
  137 |         console.log(`[STEP 1] Creating & approving Bill for ${qty} units...`);
  138 |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 1000, quantity: qty, vendorId: meta.vendorId });
  139 |         await app.advanceDocumentAPI(bill.id, 'bills');
  140 |         console.log(`[BILL] ${bill.ref} (${bill.id}) | Qty: ${qty}`);
  141 | 
  142 |         await page.waitForTimeout(3000);
  143 |         const stockAfterBill = await app.api.inventory.pollStockAPI(item.itemId, stockBefore + qty, item.locationId);
  144 |         console.log(`[AUDIT] Stock after bill approval: ${stockAfterBill} (expected: ${stockBefore + qty})`);
  145 |         expect(stockAfterBill).toBe(stockBefore + qty);
  146 | 
  147 |         console.log(`[STEP 2] Paying bill ${bill.ref}...`);
  148 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  149 |         const billAmount = parseFloat(billData.balance ?? billData.total ?? 3000);
  150 |         const payment = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
  151 |         await app.advanceDocumentAPI(payment.id, 'payments');
  152 |         console.log(`[PAYMENT] ${payment.ref} (${payment.id}) | Amount: ${billAmount}`);
  153 | 
  154 |         // CRITICAL: Payment must be voided first — bill reversal only works when no active payments are linked
  155 |         console.log(`[STEP 3] Voiding payment ${payment.ref} before reversing bill...`);
  156 |         const voidSuccess = await app.api.purchase.reversePaymentAPI(payment.id);
  157 |         expect(voidSuccess).toBe(true);
  158 |         console.log(`[PAYMENT VOIDED] ${payment.ref}`);
  159 | 
  160 |         await page.waitForTimeout(3000); // Allow ledger to process void
  161 | 
```