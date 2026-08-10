# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-stress.spec.ts >> Procurement Stress & Financial Edge Cases @purchase @logic @security @regression @full >> Audit: Bill reversal after payment must roll back stock and restore balance
- Location: tests/purchase/po-stress.spec.ts:138:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 23
Received: 0
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
  68  |         expect.soft(balance, `[CRITICAL_LOGIC_BUG] Bill ${bill.ref}: Overpayment of ${overpayAmount} on ${billAmount} bill created negative balance=${balance}. Vendor credit injection possible.`).toBeGreaterThanOrEqual(0);
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
  130 |             console.log(`[KNOWN_BUG] Ghost payment ${ghost.ref} accepted on fully-paid bill ${bill.ref}! ERP does not block payments on fully-paid bills (E2888 only blocks re-approval of same payment ID). Bug logged for remediation.`);
  131 |             Logger.fail(`Ghost payment bug confirmed on bill ${bill.ref}`);
  132 |         } catch (err: any) {
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
> 156 |         expect(stockAfterBill).toBe(stockBefore + qty);
      |                                ^ Error: expect(received).toBe(expected) // Object.is equality
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
  169 |         console.log(`[PAYMENT VOIDED] ${payment.ref}`);
  170 | 
  171 |         await page.waitForTimeout(3000); // Allow ledger to process void
  172 | 
  173 |         console.log(`[STEP 4] Reversing bill ${bill.ref}...`);
  174 |         const reversed = await app.api.purchase.reverseBillAPI(bill.id);
  175 |         console.log(`[REVERSAL] Result: ${reversed}`);
  176 |         expect(reversed).toBeTruthy();
  177 | 
  178 |         await page.waitForTimeout(5000); // Allow stock index to sync
  179 |         const stockAfterReversal = await app.api.inventory.pollStockAPI(item.itemId, stockBefore, item.locationId);
  180 |         console.log(`[AUDIT] Stock after reversal: ${stockAfterReversal} (expected: ${stockBefore})`);
  181 | 
  182 |         expect.soft(stockAfterReversal, `[CRITICAL_LOGIC_BUG] Bill ${bill.ref}: Stock not rolled back after reversal. Expected ${stockBefore}, got ${stockAfterReversal}`).toBe(stockBefore);
  183 |         if (stockAfterReversal !== stockBefore) Logger.fail(`Stock rollback bug: expected ${stockBefore}, got ${stockAfterReversal}`);
  184 |         expect(stockAfterReversal).toBe(stockBefore);
  185 |         console.log(`[PASS] Bill ${bill.ref}: payment voided → bill reversed → stock and ledger correctly rolled back.`);
  186 |     });
  187 | 
  188 |     // ── 5. PARTIAL PAYMENT SEQUENCE — BALANCE DRIFT ──────────────────────────
  189 |     test('Audit: Three partial payments must exactly zero out bill balance', async ({ page }) => {
  190 |         const app = new AppManager(page);
  191 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  192 |         const meta = sharedMeta;
  193 |         const item = sharedItem;
  194 | 
  195 |         const billTotal = 9000;
  196 |         const partials = [3000, 3000, 3000];
  197 |         console.log(`[STEP 1] Creating & approving Bill for ${billTotal}...`);
  198 |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billTotal, quantity: 1, vendorId: meta.vendorId });
  199 |         await app.advanceDocumentAPI(bill.id, 'bills');
  200 |         console.log(`[BILL] ${bill.ref} (${bill.id}) | Total: ${billTotal}`);
  201 | 
  202 |         let expectedBalance = billTotal;
  203 |         for (let i = 0; i < partials.length; i++) {
  204 |             console.log(`[STEP ${i + 2}] Partial payment ${i + 1} of ${partials[i]} against bill ${bill.ref}...`);
  205 |             const payment = await app.api.purchase.createBillPaymentAPI({ amount: partials[i], billId: bill.id, vendorId: meta.vendorId });
  206 |             await app.advanceDocumentAPI(payment.id, 'payments');
  207 |             console.log(`[PAYMENT ${i + 1}] ${payment.ref} (${payment.id}) | Amount: ${partials[i]}`);
  208 |             await page.waitForTimeout(2000);
  209 | 
  210 |             expectedBalance -= partials[i];
  211 |             const billData = await app.api.purchase.getBillAPI(bill.id);
  212 |             const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.amount_due ?? -1);
  213 |             console.log(`[AUDIT] Bill ${bill.ref} balance after payment ${i + 1}: ${balance} (expected: ${expectedBalance})`);
  214 | 
  215 |             expect.soft(
  216 |                 Math.abs(balance - expectedBalance),
  217 |                 `[CRITICAL_LOGIC_BUG] Bill ${bill.ref}: Balance drift after partial payment ${i + 1}. Expected ${expectedBalance}, got ${balance}`
  218 |             ).toBeLessThanOrEqual(0.01);
  219 |             if (Math.abs(balance - expectedBalance) > 0.01) Logger.fail(`Balance drift: expected ${expectedBalance}, got ${balance}`);
  220 |         }
  221 | 
  222 |         const finalBill = await app.api.purchase.getBillAPI(bill.id);
  223 |         const finalBalance = parseFloat(finalBill.unpaid_amount ?? finalBill.balance ?? finalBill.amount_due ?? -1);
  224 |         console.log(`[AUDIT] Bill ${bill.ref} final balance after 3 partial payments: ${finalBalance} (expected: 0)`);
  225 |         expect(Math.abs(finalBalance)).toBeLessThanOrEqual(0.01);
  226 |         console.log(`[PASS] Bill ${bill.ref} partial payment sequence correctly zeroed balance.`);
  227 |     });
  228 | 
  229 |     // ── 6. ORPHAN BILL — CANCEL PO AFTER BILL APPROVED ───────────────────────
  230 |     test('Audit: Cancelling a PO after its linked bill is approved must not corrupt ledger', async ({ page }) => {
  231 |         const app = new AppManager(page);
  232 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  233 |         const meta = sharedMeta;
  234 |         const item = sharedItem;
  235 |         const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  236 | 
  237 |         console.log(`[STEP 1] Creating & approving PO...`);
  238 |         const po = await app.api.purchase.createPurchaseOrderAPI(item, 2, 1500, meta.vendorId);
  239 |         await app.advanceDocumentAPI(po.poId, 'purchase-orders');
  240 |         console.log(`[PO] ${po.poNumber} (${po.poId})`);
  241 | 
  242 |         console.log(`[STEP 2] Creating & approving linked Bill...`);
  243 |         const bill = await app.api.purchase.createBillFromPoAPI(po.poId, po.poItems);
  244 |         await app.advanceDocumentAPI(bill.billId, 'bills');
  245 |         console.log(`[BILL] ${bill.billNumber} (${bill.billId}) — approved`);
  246 | 
  247 |         console.log(`[ATTACK] Attempting to cancel source PO ${po.poNumber} after bill ${bill.billNumber} is approved...`);
  248 |         const headers = {
  249 |             'Authorization': `Bearer ${await app._getAuthToken()}`,
  250 |             'x-company': process.env.BEFFA_COMPANY as string,
  251 |             'Content-Type': 'application/json',
  252 |         };
  253 |         const cancelResp = await page.request.patch(
  254 |             `${app.apiBase}/purchase-orders/${po.poId}/cancel?${params}`,
  255 |             { headers, data: {} }
  256 |         );
```