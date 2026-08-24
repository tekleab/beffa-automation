# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/bill-payment-load-stress.spec.ts >> Bill Payment Load & Stress Audits @purchase @load @stress @regression @full >> STRESS: Payment against a bill reversed mid-flight must be rejected
- Location: tests/purchase/bill-payment-load-stress.spec.ts:176:9

# Error details

```
Error: [REVERSED_BILL_BUG] Payment PAY/2026/08/24/000729 approved against reversed bill BILL/2026/08/24/002599!
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
  117 |         console.log(`[PASS] All ${CONCURRENCY} bills verified paid in full.`);
  118 |     });
  119 | 
  120 |     // ── 2. STRESS: CONCURRENT DUPLICATE PAYMENTS (RACE CONDITION) ──────────────
  121 |     test('STRESS: Concurrent duplicate payment submittals against same bill must be blocked', async () => {
  122 |         test.fail(true, '[CONFIRMED BUG] Double payment race condition in ERP backend');
  123 |         const meta = await app.api.purchase.discoverMetadataAPI();
  124 |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  125 |             cost_method_code: 'WAC', quantity: 20, unit_cost: 100
  126 |         });
  127 | 
  128 |         const BILL_AMOUNT = 2500;
  129 |         const bill = await app.api.purchase.createBillAPI({
  130 |             itemData: item,
  131 |             quantity: 1,
  132 |             unitPrice: BILL_AMOUNT,
  133 |             vendorId: meta.vendorId
  134 |         });
  135 |         await app.advanceDocumentAPI(bill.id, 'bills');
  136 |         console.log(`[STRESS] Bill ${bill.ref} approved | amount: ${BILL_AMOUNT}`);
  137 | 
  138 |         // Fire 2 concurrent payments for the full bill amount
  139 |         console.log(`[STRESS] Creating 2 concurrent payments for full amount...`);
  140 |         const p1Promise = app.api.purchase.createBillPaymentAPI({ amount: BILL_AMOUNT, billId: bill.id, vendorId: meta.vendorId });
  141 |         const p2Promise = app.api.purchase.createBillPaymentAPI({ amount: BILL_AMOUNT, billId: bill.id, vendorId: meta.vendorId });
  142 | 
  143 |         const [p1Res, p2Res] = await Promise.allSettled([p1Promise, p2Promise]);
  144 |         
  145 |         const validPayments: any[] = [];
  146 |         if (p1Res.status === 'fulfilled') validPayments.push(p1Res.value);
  147 |         if (p2Res.status === 'fulfilled') validPayments.push(p2Res.value);
  148 | 
  149 |         console.log(`[STRESS] Created ${validPayments.length} payment documents.`);
  150 | 
  151 |         if (validPayments.length === 2) {
  152 |             console.log(`[STRESS] Approving both payments concurrently to trigger race condition...`);
  153 |             const approveRes = await Promise.allSettled(
  154 |                 validPayments.map(p => app.advanceDocumentAPI(p.id, 'payments'))
  155 |             );
  156 | 
  157 |             const approvedCount = approveRes.filter(r => r.status === 'fulfilled').length;
  158 |             console.log(`[STRESS] Approved ${approvedCount} of 2 payments.`);
  159 | 
  160 |             // Fetch final bill status
  161 |             const billData = await app.api.purchase.getBillAPI(bill.id);
  162 |             const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? '0');
  163 |             console.log(`[STRESS] Final bill balance: ${balance}`);
  164 | 
  165 |             if (approvedCount === 2) {
  166 |                 throw new Error(`[DOUBLE_PAYMENT_BUG] Race condition allowed: both payments approved concurrently for bill ${bill.ref}!`);
  167 |             }
  168 | 
  169 |             expect(approvedCount).toBeLessThan(2);
  170 |         } else {
  171 |             console.log(`[PASS] Concurrent draft creation rejected duplicate call correctly.`);
  172 |         }
  173 |     });
  174 | 
  175 |     // ── 3. STRESS: PAYMENT AGAINST MID-FLIGHT REVERSED BILL ──────────────────
  176 |     test('STRESS: Payment against a bill reversed mid-flight must be rejected', async () => {
  177 |         test.fail(true, '[CONFIRMED BUG] Payment approved against reversed bill');
  178 |         const meta = await app.api.purchase.discoverMetadataAPI();
  179 |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  180 |             cost_method_code: 'WAC', quantity: 20, unit_cost: 100
  181 |         });
  182 | 
  183 |         const BILL_AMOUNT = 3000;
  184 |         const bill = await app.api.purchase.createBillAPI({
  185 |             itemData: item,
  186 |             quantity: 1,
  187 |             unitPrice: BILL_AMOUNT,
  188 |             vendorId: meta.vendorId
  189 |         });
  190 |         await app.advanceDocumentAPI(bill.id, 'bills');
  191 |         console.log(`[STRESS] Bill ${bill.ref} approved.`);
  192 | 
  193 |         // Create draft payment
  194 |         const payment = await app.api.purchase.createBillPaymentAPI({
  195 |             amount: BILL_AMOUNT,
  196 |             billId: bill.id,
  197 |             vendorId: meta.vendorId
  198 |         });
  199 |         console.log(`[STRESS] Draft payment ${payment.ref} created.`);
  200 | 
  201 |         // Reverse the bill
  202 |         const reversed = await app.api.purchase.reverseBillAPI(bill.id);
  203 |         expect(reversed).toBe(true);
  204 |         console.log(`[STRESS] Bill ${bill.ref} reversed successfully.`);
  205 | 
  206 |         // Now attempt to approve the payment against the reversed bill
  207 |         console.log(`[STRESS] Attempting to approve payment ${payment.ref} against reversed bill...`);
  208 |         let approved = false;
  209 |         try {
  210 |             await app.advanceDocumentAPI(payment.id, 'payments');
  211 |             approved = true;
  212 |         } catch (err: any) {
  213 |             console.log(`[PASS] Payment rejected correctly: ${err.message}`);
  214 |         }
  215 | 
  216 |         if (approved) {
> 217 |             throw new Error(`[REVERSED_BILL_BUG] Payment ${payment.ref} approved against reversed bill ${bill.ref}!`);
      |                   ^ Error: [REVERSED_BILL_BUG] Payment PAY/2026/08/24/000729 approved against reversed bill BILL/2026/08/24/002599!
  218 |         }
  219 |     });
  220 | });
  221 | 
```