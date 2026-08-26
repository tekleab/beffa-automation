# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-stress.spec.ts >> Procurement Stress & Financial Edge Cases @purchase @logic @security @regression @full >> Guardrail: System must reject payment against a fully-paid bill
- Location: tests/purchase/po-stress.spec.ts:114:9

# Error details

```
Error: [GHOST_PAYMENT_BUG] Ghost payment PAY/2026/08/26/000776 accepted on fully-paid bill BILL/2026/08/26/002721! ERP does not block payments on fully-paid bills.
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
  41  |         sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
  42  |     });
  43  | 
  44  |     test.afterAll(async () => {
  45  |         await sharedPage?.close();
  46  |     });
  47  | 
  48  |     test.beforeEach(async ({ page }) => {
  49  |         const app = new AppManager(page);
  50  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  51  |     });
  52  | 
  53  |     // ── 1. OVERPAYMENT ATTACK ─────────────────────────────────────────────────
  54  |     test('Guardrail: System must reject payment exceeding bill total', async ({ page }) => {
  55  |         // CONFIRMED BUG: system accepts overpayment and creates negative balance (vendor credit injection)
  56  |         test.fail(true, '[CONFIRMED BUG] Overpayment accepted — balance goes negative. Vendor credit injection possible.');
  57  | 
  58  |         const app = new AppManager(page);
  59  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  60  |         const meta = sharedMeta;
  61  |         const item = sharedItem;
  62  | 
  63  |         const billAmount = 3000;
  64  |         console.log(`[STEP 1] Creating & approving Bill for ${billAmount}...`);
  65  |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billAmount, quantity: 1, vendorId: meta.vendorId });
  66  |         await app.advanceDocumentAPI(bill.id, 'bills');
  67  |         console.log(`[BILL] ${bill.ref} (${bill.id}) | Amount: ${billAmount}`);
  68  | 
  69  |         const overpayAmount = billAmount * 2;
  70  |         console.log(`[ATTACK] Overpayment of ${overpayAmount} against bill ${bill.ref} (total: ${billAmount})...`);
  71  |         const payment = await app.api.purchase.createBillPaymentAPI({ amount: overpayAmount, billId: bill.id, vendorId: meta.vendorId });
  72  |         await app.advanceDocumentAPI(payment.id, 'payments');
  73  |         console.log(`[PAYMENT] ${payment.ref} (${payment.id}) | Amount: ${overpayAmount}`);
  74  | 
  75  |         const billData = await app.api.purchase.getBillAPI(bill.id);
  76  |         const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.amount_due ?? 0);
  77  |         console.log(`[RESULT] Bill ${bill.ref} balance after overpayment: ${balance} (expected: >= 0)`);
  78  | 
  79  |         expect.soft(balance, `[CRITICAL_LOGIC_BUG] Bill ${bill.ref}: Overpayment of ${overpayAmount} on ${billAmount} bill created negative balance=${balance}. Vendor credit injection possible.`).toBeGreaterThanOrEqual(0);
  80  |         if (balance < 0) Logger.fail(`Bill ${bill.ref} overpayment bug confirmed: balance=${balance}`);
  81  |         else console.log(`[PASS] Balance capped at 0 — overpayment handled correctly.`);
  82  |     });
  83  | 
  84  |     // ── 2. DOUBLE-BILLING SAME PO ─────────────────────────────────────────────
  85  |     test('Guardrail: System must prevent double-billing the same PO', async ({ page }) => {
  86  |         const app = new AppManager(page);
  87  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  88  |         const meta = sharedMeta;
  89  |         const item = sharedItem;
  90  | 
  91  |         console.log(`[STEP 1] Creating & approving PO...`);
  92  |         const po = await app.api.purchase.createPurchaseOrderAPI(item, 5, 1000, meta.vendorId);
  93  |         await app.advanceDocumentAPI(po.poId, 'purchase-orders');
  94  |         console.log(`[PO] ${po.poNumber} (${po.poId})`);
  95  | 
  96  |         console.log(`[STEP 2] Creating first Bill from PO...`);
  97  |         const bill1 = await app.api.purchase.createBillFromPoAPI(po.poId, po.poItems);
  98  |         await app.advanceDocumentAPI(bill1.billId, 'bills');
  99  |         console.log(`[BILL 1] ${bill1.billNumber} (${bill1.billId}) — approved`);
  100 | 
  101 |         console.log(`[ATTACK] Attempting second Bill from same PO ${po.poNumber}...`);
  102 |         try {
  103 |             const bill2 = await app.api.purchase.createBillFromPoAPI(po.poId, po.poItems);
  104 |             await app.advanceDocumentAPI(bill2.billId, 'bills');
  105 |             expect.soft(false, `[CRITICAL_LOGIC_BUG] Double-billing allowed! PO ${po.poNumber} billed twice: ${bill1.billNumber} + ${bill2.billNumber}. Duplicate liability created.`).toBe(true);
  106 |             Logger.fail(`Double-billing bug confirmed on PO ${po.poNumber}`);
  107 |         } catch (err: any) {
  108 |             if (err.message.includes('[CRITICAL_LOGIC_BUG]')) Logger.fail(err.message);
  109 |             else console.log(`[PASS] Double-billing correctly blocked: ${err.message}`);
  110 |         }
  111 |     });
  112 | 
  113 |     // ── 3. PAYMENT AGAINST FULLY-PAID BILL ───────────────────────────────────
  114 |     test('Guardrail: System must reject payment against a fully-paid bill', async ({ page }) => {
  115 |         const app = new AppManager(page);
  116 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  117 |         const meta = sharedMeta;
  118 |         const item = sharedItem;
  119 | 
  120 |         const billAmount = 2000;
  121 |         console.log(`[STEP 1] Creating & approving Bill for ${billAmount}...`);
  122 |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billAmount, quantity: 1, vendorId: meta.vendorId });
  123 |         await app.advanceDocumentAPI(bill.id, 'bills');
  124 |         console.log(`[BILL] ${bill.ref} (${bill.id}) | Amount: ${billAmount}`);
  125 | 
  126 |         console.log(`[STEP 2] Fully paying bill ${bill.ref}...`);
  127 |         const payment = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
  128 |         await app.advanceDocumentAPI(payment.id, 'payments');
  129 |         console.log(`[PAYMENT] ${payment.ref} (${payment.id}) | Amount: ${billAmount}`);
  130 | 
  131 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  132 |         const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.amount_due ?? 0);
  133 |         console.log(`[AUDIT] Bill ${bill.ref} balance after full payment: ${balance}`);
  134 |         expect(balance).toBe(0);
  135 | 
  136 |         console.log(`[ATTACK] Attempting ghost payment against fully-paid bill ${bill.ref}...`);
  137 |         try {
  138 |             const ghost = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
  139 |             await app.advanceDocumentAPI(ghost.id, 'payments');
  140 |             console.log(`[GHOST PAYMENT] ${ghost.ref} (${ghost.id})`);
> 141 |             throw new Error(`[GHOST_PAYMENT_BUG] Ghost payment ${ghost.ref} accepted on fully-paid bill ${bill.ref}! ERP does not block payments on fully-paid bills.`);
      |                   ^ Error: [GHOST_PAYMENT_BUG] Ghost payment PAY/2026/08/26/000776 accepted on fully-paid bill BILL/2026/08/26/002721! ERP does not block payments on fully-paid bills.
  142 |         } catch (err: any) {
  143 |             if (err.message.includes('GHOST_PAYMENT_BUG')) throw err;
  144 |             console.log(`[PASS] Ghost payment correctly blocked: ${err.message}`);
  145 |         }
  146 |     });
  147 | 
  148 |     // ── 4. BILL REVERSAL AFTER PAYMENT — STOCK & LEDGER ROLLBACK ─────────────
  149 |     test('Audit: Bill reversal after payment must roll back stock and restore balance', async ({ page }) => {
  150 |         const app = new AppManager(page);
  151 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  152 |         const meta = sharedMeta;
  153 |         const item = sharedItem;
  154 | 
  155 |         const qty = 3;
  156 |         const stockBefore = item.currentStock;
  157 |         console.log(`[ITEM] "${item.itemName}" | Stock before: ${stockBefore}`);
  158 | 
  159 |         console.log(`[STEP 1] Creating & approving Bill for ${qty} units...`);
  160 |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 1000, quantity: qty, vendorId: meta.vendorId });
  161 |         await app.advanceDocumentAPI(bill.id, 'bills');
  162 |         console.log(`[BILL] ${bill.ref} (${bill.id}) | Qty: ${qty}`);
  163 | 
  164 |         await page.waitForTimeout(3000);
  165 |         const stockAfterBill = await app.api.inventory.pollStockAPI(item.itemId, stockBefore + qty, item.locationId, 20);
  166 |         console.log(`[AUDIT] Stock after bill approval: ${stockAfterBill} (expected: ${stockBefore + qty})`);
  167 |         expect(stockAfterBill).toBe(stockBefore + qty);
  168 | 
  169 |         console.log(`[STEP 2] Paying bill ${bill.ref}...`);
  170 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  171 |         const billAmount = parseFloat(billData.unpaid_amount ?? billData.net_due ?? billData.total ?? 3000);
  172 |         const payment = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
  173 |         await app.advanceDocumentAPI(payment.id, 'payments');
  174 |         console.log(`[PAYMENT] ${payment.ref} (${payment.id}) | Amount: ${billAmount}`);
  175 | 
  176 |         // CRITICAL: Payment must be voided first — bill reversal only works when no active payments are linked
  177 |         console.log(`[STEP 3] Voiding payment ${payment.ref} before reversing bill...`);
  178 |         const voidSuccess = await app.api.purchase.reversePaymentAPI(payment.id);
  179 |         expect(voidSuccess).toBe(true);
  180 |         console.log(`[PAYMENT VOIDED] ${payment.ref}`);
  181 | 
  182 |         await page.waitForTimeout(3000); // Allow ledger to process void
  183 | 
  184 |         console.log(`[STEP 4] Reversing bill ${bill.ref}...`);
  185 |         const reversed = await app.api.purchase.reverseBillAPI(bill.id);
  186 |         console.log(`[REVERSAL] Result: ${reversed}`);
  187 |         expect(reversed).toBeTruthy();
  188 | 
  189 |         await page.waitForTimeout(5000); // Allow stock index to sync
  190 |         const stockAfterReversal = await app.api.inventory.pollStockAPI(item.itemId, stockBefore, item.locationId);
  191 |         console.log(`[AUDIT] Stock after reversal: ${stockAfterReversal} (expected: ${stockBefore})`);
  192 | 
  193 |         expect.soft(stockAfterReversal, `[CRITICAL_LOGIC_BUG] Bill ${bill.ref}: Stock not rolled back after reversal. Expected ${stockBefore}, got ${stockAfterReversal}`).toBe(stockBefore);
  194 |         if (stockAfterReversal !== stockBefore) Logger.fail(`Stock rollback bug: expected ${stockBefore}, got ${stockAfterReversal}`);
  195 |         expect(stockAfterReversal).toBe(stockBefore);
  196 |         console.log(`[PASS] Bill ${bill.ref}: payment voided → bill reversed → stock and ledger correctly rolled back.`);
  197 |     });
  198 | 
  199 |     // ── 5. PARTIAL PAYMENT SEQUENCE — BALANCE DRIFT ──────────────────────────
  200 |     test('Audit: Three partial payments must exactly zero out bill balance', async ({ page }) => {
  201 |         const app = new AppManager(page);
  202 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  203 |         const meta = sharedMeta;
  204 |         const item = sharedItem;
  205 | 
  206 |         const billTotal = 9000;
  207 |         const partials = [3000, 3000, 3000];
  208 |         console.log(`[STEP 1] Creating & approving Bill for ${billTotal}...`);
  209 |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billTotal, quantity: 1, vendorId: meta.vendorId });
  210 |         await app.advanceDocumentAPI(bill.id, 'bills');
  211 |         console.log(`[BILL] ${bill.ref} (${bill.id}) | Total: ${billTotal}`);
  212 | 
  213 |         let expectedBalance = billTotal;
  214 |         for (let i = 0; i < partials.length; i++) {
  215 |             console.log(`[STEP ${i + 2}] Partial payment ${i + 1} of ${partials[i]} against bill ${bill.ref}...`);
  216 |             const payment = await app.api.purchase.createBillPaymentAPI({ amount: partials[i], billId: bill.id, vendorId: meta.vendorId });
  217 |             await app.advanceDocumentAPI(payment.id, 'payments');
  218 |             console.log(`[PAYMENT ${i + 1}] ${payment.ref} (${payment.id}) | Amount: ${partials[i]}`);
  219 |             await page.waitForTimeout(2000);
  220 | 
  221 |             expectedBalance -= partials[i];
  222 |             const billData = await app.api.purchase.getBillAPI(bill.id);
  223 |             const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.amount_due ?? -1);
  224 |             console.log(`[AUDIT] Bill ${bill.ref} balance after payment ${i + 1}: ${balance} (expected: ${expectedBalance})`);
  225 | 
  226 |             expect.soft(
  227 |                 Math.abs(balance - expectedBalance),
  228 |                 `[CRITICAL_LOGIC_BUG] Bill ${bill.ref}: Balance drift after partial payment ${i + 1}. Expected ${expectedBalance}, got ${balance}`
  229 |             ).toBeLessThanOrEqual(0.01);
  230 |             if (Math.abs(balance - expectedBalance) > 0.01) Logger.fail(`Balance drift: expected ${expectedBalance}, got ${balance}`);
  231 |         }
  232 | 
  233 |         const finalBill = await app.api.purchase.getBillAPI(bill.id);
  234 |         const finalBalance = parseFloat(finalBill.unpaid_amount ?? finalBill.balance ?? finalBill.amount_due ?? -1);
  235 |         console.log(`[AUDIT] Bill ${bill.ref} final balance after 3 partial payments: ${finalBalance} (expected: 0)`);
  236 |         expect(Math.abs(finalBalance)).toBeLessThanOrEqual(0.01);
  237 |         console.log(`[PASS] Bill ${bill.ref} partial payment sequence correctly zeroed balance.`);
  238 |     });
  239 | 
  240 |     // ── 6. ORPHAN BILL — CANCEL PO AFTER BILL APPROVED ───────────────────────
  241 |     test('Audit: Cancelling a PO after its linked bill is approved must not corrupt ledger', async ({ page }) => {
```