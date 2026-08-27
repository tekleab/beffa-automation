# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-stress.spec.ts >> Procurement Stress & Financial Edge Cases @purchase @logic @security @regression @full >> Audit: Three partial payments must exactly zero out bill balance
- Location: tests/purchase/po-stress.spec.ts:200:9

# Error details

```
Error: [CRITICAL_LOGIC_BUG] Bill BILL/2026/08/27/002939: Balance drift after partial payment 1. Expected 6000, got -1

expect(received).toBeLessThanOrEqual(expected)

Expected: <= 0.01
Received:    6001
```

```
Error: [CRITICAL_LOGIC_BUG] Bill BILL/2026/08/27/002939: Balance drift after partial payment 2. Expected 3000, got -1

expect(received).toBeLessThanOrEqual(expected)

Expected: <= 0.01
Received:    3001
```

```
Error: [CRITICAL_LOGIC_BUG] Bill BILL/2026/08/27/002939: Balance drift after partial payment 3. Expected 0, got -1

expect(received).toBeLessThanOrEqual(expected)

Expected: <= 0.01
Received:    1
```

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 0.01
Received:    1
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "Microverse" [ref=e10]: M
        - generic [ref=e11]:
          - button "Microverse" [ref=e12] [cursor=pointer]:
            - generic: Microverse
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
          - img "Microverse" [ref=e62]: M
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
  136 |         console.log(`[ATTACK] Attempting ghost payment against fully-paid bill ${bill.ref}...`);
  137 |         try {
  138 |             const ghost = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
  139 |             await app.advanceDocumentAPI(ghost.id, 'payments');
  140 |             console.log(`[GHOST PAYMENT] ${ghost.ref} (${ghost.id})`);
  141 |             throw new Error(`[GHOST_PAYMENT_BUG] Ghost payment ${ghost.ref} accepted on fully-paid bill ${bill.ref}! ERP does not block payments on fully-paid bills.`);
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
> 236 |         expect(Math.abs(finalBalance)).toBeLessThanOrEqual(0.01);
      |                                        ^ Error: expect(received).toBeLessThanOrEqual(expected)
  237 |         console.log(`[PASS] Bill ${bill.ref} partial payment sequence correctly zeroed balance.`);
  238 |     });
  239 | 
  240 |     // ── 6. ORPHAN BILL — CANCEL PO AFTER BILL APPROVED ───────────────────────
  241 |     test('Audit: Cancelling a PO after its linked bill is approved must not corrupt ledger', async ({ page }) => {
  242 |         const app = new AppManager(page);
  243 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  244 |         const meta = sharedMeta;
  245 |         const item = sharedItem;
  246 |         const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  247 | 
  248 |         console.log(`[STEP 1] Creating & approving PO...`);
  249 |         const po = await app.api.purchase.createPurchaseOrderAPI(item, 2, 1500, meta.vendorId);
  250 |         await app.advanceDocumentAPI(po.poId, 'purchase-orders');
  251 |         console.log(`[PO] ${po.poNumber} (${po.poId})`);
  252 | 
  253 |         console.log(`[STEP 2] Creating & approving linked Bill...`);
  254 |         const bill = await app.api.purchase.createBillFromPoAPI(po.poId, po.poItems);
  255 |         await app.advanceDocumentAPI(bill.billId, 'bills');
  256 |         console.log(`[BILL] ${bill.billNumber} (${bill.billId}) — approved`);
  257 | 
  258 |         console.log(`[ATTACK] Attempting to cancel source PO ${po.poNumber} after bill ${bill.billNumber} is approved...`);
  259 |         const headers = {
  260 |             'Authorization': `Bearer ${await app._getAuthToken()}`,
  261 |             'x-company': process.env.BEFFA_COMPANY as string,
  262 |             'Content-Type': 'application/json',
  263 |         };
  264 |         const cancelResp = await page.request.patch(
  265 |             `${app.apiBase}/purchase-orders/${po.poId}/cancel?${params}`,
  266 |             { headers, data: {} }
  267 |         );
  268 |         console.log(`[INFO] PO ${po.poNumber} cancel attempt: HTTP ${cancelResp.status()}`);
  269 | 
  270 |         const billData = await app.api.purchase.getBillAPI(bill.billId);
  271 |         const billStatus = (billData.status ?? billData.current_approval_step?.status_label ?? '').toLowerCase();
  272 |         console.log(`[AUDIT] Bill ${bill.billNumber} status after PO cancel: ${billStatus}`);
  273 | 
  274 |         expect.soft(billStatus, `[CRITICAL_LOGIC_BUG] Bill ${bill.billNumber}: Cancelling source PO ${po.poNumber} corrupted bill status to "${billStatus}"`).toBe('approved');
  275 |         if (billStatus !== 'approved') Logger.fail(`Bill status corruption: expected approved, got ${billStatus}`);
  276 |         expect(billStatus).toBe('approved');
  277 |         console.log(`[PASS] Bill ${bill.billNumber} integrity maintained after PO ${po.poNumber} cancel attempt.`);
  278 |     });
  279 | });
  280 | 
```