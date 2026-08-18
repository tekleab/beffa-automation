# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-stress.spec.ts >> Procurement Stress & Financial Edge Cases @purchase @logic @security @regression @full >> Guardrail: System must reject payment exceeding bill total
- Location: tests/purchase/po-stress.spec.ts:43:9

# Error details

```
Error: [CRITICAL_LOGIC_BUG] Bill BILL/2026/08/18/001929: Overpayment of 6000 on 3000 bill created negative balance=-3000. Vendor credit injection possible.

expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 0
Received:    -3000
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
  3   | import { Logger } from '../../lib/utils/Logger';
  4   | 
  5   | 
  6   | /**
  7   |  * PROCUREMENT STRESS & FINANCIAL EDGE CASES
  8   |  *
  9   |  * Scenarios designed to expose financial integrity bugs:
  10  |  * 1. Overpayment attack — pay more than bill total         [CONFIRMED BUG: balance goes negative]
  11  |  * 2. Double-billing same PO — duplicate liability
  12  |  * 3. Payment against fully-paid bill — ghost payment
  13  |  * 4. Bill reversal after payment — stock & ledger rollback
  14  |  * 5. Partial payment sequence — balance drift
  15  |  * 6. Orphan bill — cancel PO after bill approved
  16  |  */
  17  | 
  18  | test.describe('Procurement Stress & Financial Edge Cases @purchase @logic @security @regression @full', () => {
  19  | 
  20  |     let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
  21  |     let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;
  22  |     let sharedPage: import('@playwright/test').Page;
  23  | 
  24  |     test.beforeAll(async ({ browser }) => {
  25  |         test.setTimeout(300000);
  26  |         sharedPage = await browser.newPage();
  27  |         const app = new AppManager(sharedPage);
  28  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  29  |         sharedMeta = await app.api.purchase.discoverMetadataAPI();
  30  |         sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
  31  |     });
  32  | 
  33  |     test.afterAll(async () => {
  34  |         await sharedPage?.close();
  35  |     });
  36  | 
  37  |     test.beforeEach(async ({ page }) => {
  38  |         const app = new AppManager(page);
  39  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  40  |     });
  41  | 
  42  |     // ── 1. OVERPAYMENT ATTACK ─────────────────────────────────────────────────
  43  |     test('Guardrail: System must reject payment exceeding bill total', async ({ page }) => {
  44  |         // CONFIRMED BUG: system accepts overpayment and creates negative balance (vendor credit injection)
  45  |         test.fail(true, '[CONFIRMED BUG] Overpayment accepted — balance goes negative. Vendor credit injection possible.');
  46  | 
  47  |         const app = new AppManager(page);
  48  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  49  |         const meta = sharedMeta;
  50  |         const item = sharedItem;
  51  | 
  52  |         const billAmount = 3000;
  53  |         console.log(`[STEP 1] Creating & approving Bill for ${billAmount}...`);
  54  |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billAmount, quantity: 1, vendorId: meta.vendorId });
  55  |         await app.advanceDocumentAPI(bill.id, 'bills');
  56  |         console.log(`[BILL] ${bill.ref} (${bill.id}) | Amount: ${billAmount}`);
  57  | 
  58  |         const overpayAmount = billAmount * 2;
  59  |         console.log(`[ATTACK] Overpayment of ${overpayAmount} against bill ${bill.ref} (total: ${billAmount})...`);
  60  |         const payment = await app.api.purchase.createBillPaymentAPI({ amount: overpayAmount, billId: bill.id, vendorId: meta.vendorId });
  61  |         await app.advanceDocumentAPI(payment.id, 'payments');
  62  |         console.log(`[PAYMENT] ${payment.ref} (${payment.id}) | Amount: ${overpayAmount}`);
  63  | 
  64  |         const billData = await app.api.purchase.getBillAPI(bill.id);
  65  |         const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.amount_due ?? 0);
  66  |         console.log(`[RESULT] Bill ${bill.ref} balance after overpayment: ${balance} (expected: >= 0)`);
  67  | 
> 68  |         expect.soft(balance, `[CRITICAL_LOGIC_BUG] Bill ${bill.ref}: Overpayment of ${overpayAmount} on ${billAmount} bill created negative balance=${balance}. Vendor credit injection possible.`).toBeGreaterThanOrEqual(0);
      |                                                                                                                                                                                                     ^ Error: [CRITICAL_LOGIC_BUG] Bill BILL/2026/08/18/001929: Overpayment of 6000 on 3000 bill created negative balance=-3000. Vendor credit injection possible.
  69  |         if (balance < 0) Logger.fail(`Bill ${bill.ref} overpayment bug confirmed: balance=${balance}`);
  70  |         else console.log(`[PASS] Balance capped at 0 — overpayment handled correctly.`);
  71  |     });
  72  | 
  73  |     // ── 2. DOUBLE-BILLING SAME PO ─────────────────────────────────────────────
  74  |     test('Guardrail: System must prevent double-billing the same PO', async ({ page }) => {
  75  |         const app = new AppManager(page);
  76  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  77  |         const meta = sharedMeta;
  78  |         const item = sharedItem;
  79  | 
  80  |         console.log(`[STEP 1] Creating & approving PO...`);
  81  |         const po = await app.api.purchase.createPurchaseOrderAPI(item, 5, 1000, meta.vendorId);
  82  |         await app.advanceDocumentAPI(po.poId, 'purchase-orders');
  83  |         console.log(`[PO] ${po.poNumber} (${po.poId})`);
  84  | 
  85  |         console.log(`[STEP 2] Creating first Bill from PO...`);
  86  |         const bill1 = await app.api.purchase.createBillFromPoAPI(po.poId, po.poItems);
  87  |         await app.advanceDocumentAPI(bill1.billId, 'bills');
  88  |         console.log(`[BILL 1] ${bill1.billNumber} (${bill1.billId}) — approved`);
  89  | 
  90  |         console.log(`[ATTACK] Attempting second Bill from same PO ${po.poNumber}...`);
  91  |         try {
  92  |             const bill2 = await app.api.purchase.createBillFromPoAPI(po.poId, po.poItems);
  93  |             await app.advanceDocumentAPI(bill2.billId, 'bills');
  94  |             expect.soft(false, `[CRITICAL_LOGIC_BUG] Double-billing allowed! PO ${po.poNumber} billed twice: ${bill1.billNumber} + ${bill2.billNumber}. Duplicate liability created.`).toBe(true);
  95  |             Logger.fail(`Double-billing bug confirmed on PO ${po.poNumber}`);
  96  |         } catch (err: any) {
  97  |             if (err.message.includes('[CRITICAL_LOGIC_BUG]')) Logger.fail(err.message);
  98  |             else console.log(`[PASS] Double-billing correctly blocked: ${err.message}`);
  99  |         }
  100 |     });
  101 | 
  102 |     // ── 3. PAYMENT AGAINST FULLY-PAID BILL ───────────────────────────────────
  103 |     test('Guardrail: System must reject payment against a fully-paid bill', async ({ page }) => {
  104 |         const app = new AppManager(page);
  105 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  106 |         const meta = sharedMeta;
  107 |         const item = sharedItem;
  108 | 
  109 |         const billAmount = 2000;
  110 |         console.log(`[STEP 1] Creating & approving Bill for ${billAmount}...`);
  111 |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billAmount, quantity: 1, vendorId: meta.vendorId });
  112 |         await app.advanceDocumentAPI(bill.id, 'bills');
  113 |         console.log(`[BILL] ${bill.ref} (${bill.id}) | Amount: ${billAmount}`);
  114 | 
  115 |         console.log(`[STEP 2] Fully paying bill ${bill.ref}...`);
  116 |         const payment = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
  117 |         await app.advanceDocumentAPI(payment.id, 'payments');
  118 |         console.log(`[PAYMENT] ${payment.ref} (${payment.id}) | Amount: ${billAmount}`);
  119 | 
  120 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  121 |         const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.amount_due ?? 0);
  122 |         console.log(`[AUDIT] Bill ${bill.ref} balance after full payment: ${balance}`);
  123 |         expect(balance).toBe(0);
  124 | 
  125 |         console.log(`[ATTACK] Attempting ghost payment against fully-paid bill ${bill.ref}...`);
  126 |         try {
  127 |             const ghost = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
  128 |             await app.advanceDocumentAPI(ghost.id, 'payments');
  129 |             console.log(`[GHOST PAYMENT] ${ghost.ref} (${ghost.id})`);
  130 |             throw new Error(`[GHOST_PAYMENT_BUG] Ghost payment ${ghost.ref} accepted on fully-paid bill ${bill.ref}! ERP does not block payments on fully-paid bills.`);
  131 |         } catch (err: any) {
  132 |             if (err.message.includes('GHOST_PAYMENT_BUG')) throw err;
  133 |             console.log(`[PASS] Ghost payment correctly blocked: ${err.message}`);
  134 |         }
  135 |     });
  136 | 
  137 |     // ── 4. BILL REVERSAL AFTER PAYMENT — STOCK & LEDGER ROLLBACK ─────────────
  138 |     test('Audit: Bill reversal after payment must roll back stock and restore balance', async ({ page }) => {
  139 |         const app = new AppManager(page);
  140 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  141 |         const meta = sharedMeta;
  142 |         const item = sharedItem;
  143 | 
  144 |         const qty = 3;
  145 |         const stockBefore = item.currentStock;
  146 |         console.log(`[ITEM] "${item.itemName}" | Stock before: ${stockBefore}`);
  147 | 
  148 |         console.log(`[STEP 1] Creating & approving Bill for ${qty} units...`);
  149 |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 1000, quantity: qty, vendorId: meta.vendorId });
  150 |         await app.advanceDocumentAPI(bill.id, 'bills');
  151 |         console.log(`[BILL] ${bill.ref} (${bill.id}) | Qty: ${qty}`);
  152 | 
  153 |         await page.waitForTimeout(3000);
  154 |         const stockAfterBill = await app.api.inventory.pollStockAPI(item.itemId, stockBefore + qty, item.locationId, 20);
  155 |         console.log(`[AUDIT] Stock after bill approval: ${stockAfterBill} (expected: ${stockBefore + qty})`);
  156 |         expect(stockAfterBill).toBe(stockBefore + qty);
  157 | 
  158 |         console.log(`[STEP 2] Paying bill ${bill.ref}...`);
  159 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  160 |         const billAmount = parseFloat(billData.unpaid_amount ?? billData.net_due ?? billData.total ?? 3000);
  161 |         const payment = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
  162 |         await app.advanceDocumentAPI(payment.id, 'payments');
  163 |         console.log(`[PAYMENT] ${payment.ref} (${payment.id}) | Amount: ${billAmount}`);
  164 | 
  165 |         // CRITICAL: Payment must be voided first — bill reversal only works when no active payments are linked
  166 |         console.log(`[STEP 3] Voiding payment ${payment.ref} before reversing bill...`);
  167 |         const voidSuccess = await app.api.purchase.reversePaymentAPI(payment.id);
  168 |         expect(voidSuccess).toBe(true);
```