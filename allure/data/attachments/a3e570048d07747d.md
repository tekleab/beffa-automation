# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/bill-payment-load-stress.spec.ts >> Bill Payment Load & Stress Audits @purchase @load @stress @regression @full >> STRESS: Payment against a bill reversed mid-flight must be rejected
- Location: tests/purchase/bill-payment-load-stress.spec.ts:165:9

# Error details

```
Error: [REVERSED_BILL_BUG] Payment PAY/2026/08/19/000571 approved against reversed bill BILL/2026/08/19/002140!
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
  106 |         console.log(`[PASS] All ${CONCURRENCY} bills verified paid in full.`);
  107 |     });
  108 | 
  109 |     // ── 2. STRESS: CONCURRENT DUPLICATE PAYMENTS (RACE CONDITION) ──────────────
  110 |     test('STRESS: Concurrent duplicate payment submittals against same bill must be blocked', async () => {
  111 |         test.fail(true, '[CONFIRMED BUG] Double payment race condition in ERP backend');
  112 |         const meta = await app.api.purchase.discoverMetadataAPI();
  113 |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  114 |             cost_method_code: 'WAC', quantity: 20, unit_cost: 100
  115 |         });
  116 | 
  117 |         const BILL_AMOUNT = 2500;
  118 |         const bill = await app.api.purchase.createBillAPI({
  119 |             itemData: item,
  120 |             quantity: 1,
  121 |             unitPrice: BILL_AMOUNT,
  122 |             vendorId: meta.vendorId
  123 |         });
  124 |         await app.advanceDocumentAPI(bill.id, 'bills');
  125 |         console.log(`[STRESS] Bill ${bill.ref} approved | amount: ${BILL_AMOUNT}`);
  126 | 
  127 |         // Fire 2 concurrent payments for the full bill amount
  128 |         console.log(`[STRESS] Creating 2 concurrent payments for full amount...`);
  129 |         const p1Promise = app.api.purchase.createBillPaymentAPI({ amount: BILL_AMOUNT, billId: bill.id, vendorId: meta.vendorId });
  130 |         const p2Promise = app.api.purchase.createBillPaymentAPI({ amount: BILL_AMOUNT, billId: bill.id, vendorId: meta.vendorId });
  131 | 
  132 |         const [p1Res, p2Res] = await Promise.allSettled([p1Promise, p2Promise]);
  133 |         
  134 |         const validPayments: any[] = [];
  135 |         if (p1Res.status === 'fulfilled') validPayments.push(p1Res.value);
  136 |         if (p2Res.status === 'fulfilled') validPayments.push(p2Res.value);
  137 | 
  138 |         console.log(`[STRESS] Created ${validPayments.length} payment documents.`);
  139 | 
  140 |         if (validPayments.length === 2) {
  141 |             console.log(`[STRESS] Approving both payments concurrently to trigger race condition...`);
  142 |             const approveRes = await Promise.allSettled(
  143 |                 validPayments.map(p => app.advanceDocumentAPI(p.id, 'payments'))
  144 |             );
  145 | 
  146 |             const approvedCount = approveRes.filter(r => r.status === 'fulfilled').length;
  147 |             console.log(`[STRESS] Approved ${approvedCount} of 2 payments.`);
  148 | 
  149 |             // Fetch final bill status
  150 |             const billData = await app.api.purchase.getBillAPI(bill.id);
  151 |             const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? '0');
  152 |             console.log(`[STRESS] Final bill balance: ${balance}`);
  153 | 
  154 |             if (approvedCount === 2) {
  155 |                 throw new Error(`[DOUBLE_PAYMENT_BUG] Race condition allowed: both payments approved concurrently for bill ${bill.ref}!`);
  156 |             }
  157 | 
  158 |             expect(approvedCount).toBeLessThan(2);
  159 |         } else {
  160 |             console.log(`[PASS] Concurrent draft creation rejected duplicate call correctly.`);
  161 |         }
  162 |     });
  163 | 
  164 |     // ── 3. STRESS: PAYMENT AGAINST MID-FLIGHT REVERSED BILL ──────────────────
  165 |     test('STRESS: Payment against a bill reversed mid-flight must be rejected', async () => {
  166 |         test.fail(true, '[CONFIRMED BUG] Payment approved against reversed bill');
  167 |         const meta = await app.api.purchase.discoverMetadataAPI();
  168 |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  169 |             cost_method_code: 'WAC', quantity: 20, unit_cost: 100
  170 |         });
  171 | 
  172 |         const BILL_AMOUNT = 3000;
  173 |         const bill = await app.api.purchase.createBillAPI({
  174 |             itemData: item,
  175 |             quantity: 1,
  176 |             unitPrice: BILL_AMOUNT,
  177 |             vendorId: meta.vendorId
  178 |         });
  179 |         await app.advanceDocumentAPI(bill.id, 'bills');
  180 |         console.log(`[STRESS] Bill ${bill.ref} approved.`);
  181 | 
  182 |         // Create draft payment
  183 |         const payment = await app.api.purchase.createBillPaymentAPI({
  184 |             amount: BILL_AMOUNT,
  185 |             billId: bill.id,
  186 |             vendorId: meta.vendorId
  187 |         });
  188 |         console.log(`[STRESS] Draft payment ${payment.ref} created.`);
  189 | 
  190 |         // Reverse the bill
  191 |         const reversed = await app.api.purchase.reverseBillAPI(bill.id);
  192 |         expect(reversed).toBe(true);
  193 |         console.log(`[STRESS] Bill ${bill.ref} reversed successfully.`);
  194 | 
  195 |         // Now attempt to approve the payment against the reversed bill
  196 |         console.log(`[STRESS] Attempting to approve payment ${payment.ref} against reversed bill...`);
  197 |         let approved = false;
  198 |         try {
  199 |             await app.advanceDocumentAPI(payment.id, 'payments');
  200 |             approved = true;
  201 |         } catch (err: any) {
  202 |             console.log(`[PASS] Payment rejected correctly: ${err.message}`);
  203 |         }
  204 | 
  205 |         if (approved) {
> 206 |             throw new Error(`[REVERSED_BILL_BUG] Payment ${payment.ref} approved against reversed bill ${bill.ref}!`);
      |                   ^ Error: [REVERSED_BILL_BUG] Payment PAY/2026/08/19/000571 approved against reversed bill BILL/2026/08/19/002140!
  207 |         }
  208 |     });
  209 | });
  210 | 
```