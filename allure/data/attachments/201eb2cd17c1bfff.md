# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-stress.spec.ts >> Procurement Stress & Financial Edge Cases @purchase @logic @security @regression @full >> Guardrail: System must reject payment against a fully-paid bill
- Location: tests/purchase/po-stress.spec.ts:95:9

# Error details

```
Error: [CRITICAL_LOGIC_BUG] Ghost payment PAY/2026/06/05/000152 accepted on fully-paid bill BILL/2026/06/05/000471! Vendor credit manipulation possible.

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
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
  21  | 
  22  |     test.beforeAll(async ({ browser }) => {
  23  |         const page = await browser.newPage();
  24  |         const app = new AppManager(page);
  25  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  26  |         sharedMeta = await app.api.purchase.discoverMetadataAPI();
  27  |         sharedItem = await app.api.inventory.captureRandomItemDataAPI();
  28  |         await page.close();
  29  |     });
  30  | 
  31  |     test.beforeEach(async ({ page }) => {
  32  |         const app = new AppManager(page);
  33  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  34  |     });
  35  | 
  36  |     // ── 1. OVERPAYMENT ATTACK ─────────────────────────────────────────────────
  37  |     test('Guardrail: System must reject payment exceeding bill total', async ({ page }) => {
  38  |         // CONFIRMED BUG: system accepts overpayment and creates negative balance (vendor credit injection)
  39  |         test.fail(true, '[CONFIRMED BUG] Overpayment accepted — balance goes negative. Vendor credit injection possible.');
  40  | 
  41  |         const app = new AppManager(page);
  42  |         const meta = sharedMeta;
  43  |         const item = sharedItem;
  44  | 
  45  |         const billAmount = 3000;
  46  |         console.log(`[STEP 1] Creating & approving Bill for ${billAmount}...`);
  47  |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billAmount, quantity: 1, vendorId: meta.vendorId });
  48  |         await app.advanceDocumentAPI(bill.id, 'bills');
  49  |         console.log(`[BILL] ${bill.ref} (${bill.id}) | Amount: ${billAmount}`);
  50  | 
  51  |         const overpayAmount = billAmount * 2;
  52  |         console.log(`[ATTACK] Overpayment of ${overpayAmount} against bill ${bill.ref} (total: ${billAmount})...`);
  53  |         const payment = await app.api.purchase.createBillPaymentAPI({ amount: overpayAmount, billId: bill.id, vendorId: meta.vendorId });
  54  |         await app.advanceDocumentAPI(payment.id, 'payments');
  55  |         console.log(`[PAYMENT] ${payment.ref} (${payment.id}) | Amount: ${overpayAmount}`);
  56  | 
  57  |         const billData = await app.api.purchase.getBillAPI(bill.id);
  58  |         const balance = parseFloat(billData.balance ?? billData.amount_due ?? billData.unpaid_amount ?? 0);
  59  |         console.log(`[RESULT] Bill ${bill.ref} balance after overpayment: ${balance} (expected: >= 0)`);
  60  | 
  61  |         expect.soft(balance, `[CRITICAL_LOGIC_BUG] Bill ${bill.ref}: Overpayment of ${overpayAmount} on ${billAmount} bill created negative balance=${balance}. Vendor credit injection possible.`).toBeGreaterThanOrEqual(0);
  62  |         if (balance < 0) Logger.fail(`Bill ${bill.ref} overpayment bug confirmed: balance=${balance}`);
  63  |         else console.log(`[PASS] Balance capped at 0 — overpayment handled correctly.`);
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
  86  |             expect.soft(false, `[CRITICAL_LOGIC_BUG] Double-billing allowed! PO ${po.poNumber} billed twice: ${bill1.billNumber} + ${bill2.billNumber}. Duplicate liability created.`).toBe(true);
  87  |             Logger.fail(`Double-billing bug confirmed on PO ${po.poNumber}`);
  88  |         } catch (err: any) {
  89  |             if (err.message.includes('[CRITICAL_LOGIC_BUG]')) Logger.fail(err.message);
  90  |             else console.log(`[PASS] Double-billing correctly blocked: ${err.message}`);
  91  |         }
  92  |     });
  93  | 
  94  |     // ── 3. PAYMENT AGAINST FULLY-PAID BILL ───────────────────────────────────
  95  |     test('Guardrail: System must reject payment against a fully-paid bill', async ({ page }) => {
  96  |         const app = new AppManager(page);
  97  |         const meta = sharedMeta;
  98  |         const item = sharedItem;
  99  | 
  100 |         const billAmount = 2000;
  101 |         console.log(`[STEP 1] Creating & approving Bill for ${billAmount}...`);
  102 |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billAmount, quantity: 1, vendorId: meta.vendorId });
  103 |         await app.advanceDocumentAPI(bill.id, 'bills');
  104 |         console.log(`[BILL] ${bill.ref} (${bill.id}) | Amount: ${billAmount}`);
  105 | 
  106 |         console.log(`[STEP 2] Fully paying bill ${bill.ref}...`);
  107 |         const payment = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
  108 |         await app.advanceDocumentAPI(payment.id, 'payments');
  109 |         console.log(`[PAYMENT] ${payment.ref} (${payment.id}) | Amount: ${billAmount}`);
  110 | 
  111 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  112 |         const balance = parseFloat(billData.balance ?? billData.amount_due ?? billData.unpaid_amount ?? 0);
  113 |         console.log(`[AUDIT] Bill ${bill.ref} balance after full payment: ${balance}`);
  114 |         expect(balance).toBe(0);
  115 | 
  116 |         console.log(`[ATTACK] Attempting ghost payment against fully-paid bill ${bill.ref}...`);
  117 |         try {
  118 |             const ghost = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
  119 |             await app.advanceDocumentAPI(ghost.id, 'payments');
  120 |             console.log(`[GHOST PAYMENT] ${ghost.ref} (${ghost.id})`);
> 121 |             expect.soft(false, `[CRITICAL_LOGIC_BUG] Ghost payment ${ghost.ref} accepted on fully-paid bill ${bill.ref}! Vendor credit manipulation possible.`).toBe(true);
      |                                                                                                                                                                 ^ Error: [CRITICAL_LOGIC_BUG] Ghost payment PAY/2026/06/05/000152 accepted on fully-paid bill BILL/2026/06/05/000471! Vendor credit manipulation possible.
  122 |             Logger.fail(`Ghost payment bug confirmed on bill ${bill.ref}`);
  123 |         } catch (err: any) {
  124 |             if (err.message.includes('[CRITICAL_LOGIC_BUG]')) Logger.fail(err.message);
  125 |             else console.log(`[PASS] Ghost payment correctly blocked: ${err.message}`);
  126 |         }
  127 |     });
  128 | 
  129 |     // ── 4. BILL REVERSAL AFTER PAYMENT — STOCK & LEDGER ROLLBACK ─────────────
  130 |     test('Audit: Bill reversal after payment must roll back stock and restore balance', async ({ page }) => {
  131 |         const app = new AppManager(page);
  132 |         const meta = sharedMeta;
  133 |         const item = sharedItem;
  134 | 
  135 |         const qty = 3;
  136 |         const stockBefore = item.currentStock;
  137 |         console.log(`[ITEM] "${item.itemName}" | Stock before: ${stockBefore}`);
  138 | 
  139 |         console.log(`[STEP 1] Creating & approving Bill for ${qty} units...`);
  140 |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 1000, quantity: qty, vendorId: meta.vendorId });
  141 |         await app.advanceDocumentAPI(bill.id, 'bills');
  142 |         console.log(`[BILL] ${bill.ref} (${bill.id}) | Qty: ${qty}`);
  143 | 
  144 |         await page.waitForTimeout(3000);
  145 |         const stockAfterBill = await app.api.inventory.pollStockAPI(item.itemId, stockBefore + qty, item.locationId);
  146 |         console.log(`[AUDIT] Stock after bill approval: ${stockAfterBill} (expected: ${stockBefore + qty})`);
  147 |         expect(stockAfterBill).toBe(stockBefore + qty);
  148 | 
  149 |         console.log(`[STEP 2] Paying bill ${bill.ref}...`);
  150 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  151 |         const billAmount = parseFloat(billData.balance ?? billData.total ?? 3000);
  152 |         const payment = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
  153 |         await app.advanceDocumentAPI(payment.id, 'payments');
  154 |         console.log(`[PAYMENT] ${payment.ref} (${payment.id}) | Amount: ${billAmount}`);
  155 | 
  156 |         // CRITICAL: Payment must be voided first — bill reversal only works when no active payments are linked
  157 |         console.log(`[STEP 3] Voiding payment ${payment.ref} before reversing bill...`);
  158 |         const voidSuccess = await app.api.purchase.reversePaymentAPI(payment.id);
  159 |         expect(voidSuccess).toBe(true);
  160 |         console.log(`[PAYMENT VOIDED] ${payment.ref}`);
  161 | 
  162 |         await page.waitForTimeout(3000); // Allow ledger to process void
  163 | 
  164 |         console.log(`[STEP 4] Reversing bill ${bill.ref}...`);
  165 |         const reversed = await app.api.purchase.reverseBillAPI(bill.id);
  166 |         console.log(`[REVERSAL] Result: ${reversed}`);
  167 |         expect(reversed).toBeTruthy();
  168 | 
  169 |         await page.waitForTimeout(5000); // Allow stock index to sync
  170 |         const stockAfterReversal = await app.api.inventory.pollStockAPI(item.itemId, stockBefore, item.locationId);
  171 |         console.log(`[AUDIT] Stock after reversal: ${stockAfterReversal} (expected: ${stockBefore})`);
  172 | 
  173 |         expect.soft(stockAfterReversal, `[CRITICAL_LOGIC_BUG] Bill ${bill.ref}: Stock not rolled back after reversal. Expected ${stockBefore}, got ${stockAfterReversal}`).toBe(stockBefore);
  174 |         if (stockAfterReversal !== stockBefore) Logger.fail(`Stock rollback bug: expected ${stockBefore}, got ${stockAfterReversal}`);
  175 |         expect(stockAfterReversal).toBe(stockBefore);
  176 |         console.log(`[PASS] Bill ${bill.ref}: payment voided → bill reversed → stock and ledger correctly rolled back.`);
  177 |     });
  178 | 
  179 |     // ── 5. PARTIAL PAYMENT SEQUENCE — BALANCE DRIFT ──────────────────────────
  180 |     test('Audit: Three partial payments must exactly zero out bill balance', async ({ page }) => {
  181 |         const app = new AppManager(page);
  182 |         const meta = sharedMeta;
  183 |         const item = sharedItem;
  184 | 
  185 |         const billTotal = 9000;
  186 |         const partials = [3000, 3000, 3000];
  187 |         console.log(`[STEP 1] Creating & approving Bill for ${billTotal}...`);
  188 |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billTotal, quantity: 1, vendorId: meta.vendorId });
  189 |         await app.advanceDocumentAPI(bill.id, 'bills');
  190 |         console.log(`[BILL] ${bill.ref} (${bill.id}) | Total: ${billTotal}`);
  191 | 
  192 |         let expectedBalance = billTotal;
  193 |         for (let i = 0; i < partials.length; i++) {
  194 |             console.log(`[STEP ${i + 2}] Partial payment ${i + 1} of ${partials[i]} against bill ${bill.ref}...`);
  195 |             const payment = await app.api.purchase.createBillPaymentAPI({ amount: partials[i], billId: bill.id, vendorId: meta.vendorId });
  196 |             await app.advanceDocumentAPI(payment.id, 'payments');
  197 |             console.log(`[PAYMENT ${i + 1}] ${payment.ref} (${payment.id}) | Amount: ${partials[i]}`);
  198 |             await page.waitForTimeout(2000);
  199 | 
  200 |             expectedBalance -= partials[i];
  201 |             const billData = await app.api.purchase.getBillAPI(bill.id);
  202 |             const balance = parseFloat(billData.balance ?? billData.amount_due ?? billData.unpaid_amount ?? -1);
  203 |             console.log(`[AUDIT] Bill ${bill.ref} balance after payment ${i + 1}: ${balance} (expected: ${expectedBalance})`);
  204 | 
  205 |             expect.soft(
  206 |                 Math.abs(balance - expectedBalance),
  207 |                 `[CRITICAL_LOGIC_BUG] Bill ${bill.ref}: Balance drift after partial payment ${i + 1}. Expected ${expectedBalance}, got ${balance}`
  208 |             ).toBeLessThanOrEqual(0.01);
  209 |             if (Math.abs(balance - expectedBalance) > 0.01) Logger.fail(`Balance drift: expected ${expectedBalance}, got ${balance}`);
  210 |         }
  211 | 
  212 |         const finalBill = await app.api.purchase.getBillAPI(bill.id);
  213 |         const finalBalance = parseFloat(finalBill.balance ?? finalBill.amount_due ?? finalBill.unpaid_amount ?? -1);
  214 |         console.log(`[AUDIT] Bill ${bill.ref} final balance after 3 partial payments: ${finalBalance} (expected: 0)`);
  215 |         expect(Math.abs(finalBalance)).toBeLessThanOrEqual(0.01);
  216 |         console.log(`[PASS] Bill ${bill.ref} partial payment sequence correctly zeroed balance.`);
  217 |     });
  218 | 
  219 |     // ── 6. ORPHAN BILL — CANCEL PO AFTER BILL APPROVED ───────────────────────
  220 |     test('Audit: Cancelling a PO after its linked bill is approved must not corrupt ledger', async ({ page }) => {
  221 |         const app = new AppManager(page);
```