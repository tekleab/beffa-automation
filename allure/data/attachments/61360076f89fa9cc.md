# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/bill-payment-load-stress.spec.ts >> Bill Payment Load & Stress Audits @purchase @load @stress @regression @full >> STRESS: Payment against a bill reversed mid-flight must be rejected
- Location: tests/purchase/bill-payment-load-stress.spec.ts:164:9

# Error details

```
Error: [REVERSED_BILL_BUG] Payment PAY/2026/08/17/000434 approved against reversed bill BILL/2026/08/17/001790!
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
  104 |             expect(balance).toBeLessThanOrEqual(0.01);
  105 |         }
  106 |         console.log(`[PASS] All ${CONCURRENCY} bills verified paid in full.`);
  107 |     });
  108 | 
  109 |     // ── 2. STRESS: CONCURRENT DUPLICATE PAYMENTS (RACE CONDITION) ──────────────
  110 |     test('STRESS: Concurrent duplicate payment submittals against same bill must be blocked', async () => {
  111 |         const meta = await app.api.purchase.discoverMetadataAPI();
  112 |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  113 |             cost_method_code: 'WAC', quantity: 20, unit_cost: 100
  114 |         });
  115 | 
  116 |         const BILL_AMOUNT = 2500;
  117 |         const bill = await app.api.purchase.createBillAPI({
  118 |             itemData: item,
  119 |             quantity: 1,
  120 |             unitPrice: BILL_AMOUNT,
  121 |             vendorId: meta.vendorId
  122 |         });
  123 |         await app.advanceDocumentAPI(bill.id, 'bills');
  124 |         console.log(`[STRESS] Bill ${bill.ref} approved | amount: ${BILL_AMOUNT}`);
  125 | 
  126 |         // Fire 2 concurrent payments for the full bill amount
  127 |         console.log(`[STRESS] Creating 2 concurrent payments for full amount...`);
  128 |         const p1Promise = app.api.purchase.createBillPaymentAPI({ amount: BILL_AMOUNT, billId: bill.id, vendorId: meta.vendorId });
  129 |         const p2Promise = app.api.purchase.createBillPaymentAPI({ amount: BILL_AMOUNT, billId: bill.id, vendorId: meta.vendorId });
  130 | 
  131 |         const [p1Res, p2Res] = await Promise.allSettled([p1Promise, p2Promise]);
  132 |         
  133 |         const validPayments: any[] = [];
  134 |         if (p1Res.status === 'fulfilled') validPayments.push(p1Res.value);
  135 |         if (p2Res.status === 'fulfilled') validPayments.push(p2Res.value);
  136 | 
  137 |         console.log(`[STRESS] Created ${validPayments.length} payment documents.`);
  138 | 
  139 |         if (validPayments.length === 2) {
  140 |             console.log(`[STRESS] Approving both payments concurrently to trigger race condition...`);
  141 |             const approveRes = await Promise.allSettled(
  142 |                 validPayments.map(p => app.advanceDocumentAPI(p.id, 'payments'))
  143 |             );
  144 | 
  145 |             const approvedCount = approveRes.filter(r => r.status === 'fulfilled').length;
  146 |             console.log(`[STRESS] Approved ${approvedCount} of 2 payments.`);
  147 | 
  148 |             // Fetch final bill status
  149 |             const billData = await app.api.purchase.getBillAPI(bill.id);
  150 |             const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? '0');
  151 |             console.log(`[STRESS] Final bill balance: ${balance}`);
  152 | 
  153 |             if (approvedCount === 2) {
  154 |                 throw new Error(`[DOUBLE_PAYMENT_BUG] Race condition allowed: both payments approved concurrently for bill ${bill.ref}!`);
  155 |             }
  156 | 
  157 |             expect(approvedCount).toBeLessThan(2);
  158 |         } else {
  159 |             console.log(`[PASS] Concurrent draft creation rejected duplicate call correctly.`);
  160 |         }
  161 |     });
  162 | 
  163 |     // ── 3. STRESS: PAYMENT AGAINST MID-FLIGHT REVERSED BILL ──────────────────
  164 |     test('STRESS: Payment against a bill reversed mid-flight must be rejected', async () => {
  165 |         const meta = await app.api.purchase.discoverMetadataAPI();
  166 |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  167 |             cost_method_code: 'WAC', quantity: 20, unit_cost: 100
  168 |         });
  169 | 
  170 |         const BILL_AMOUNT = 3000;
  171 |         const bill = await app.api.purchase.createBillAPI({
  172 |             itemData: item,
  173 |             quantity: 1,
  174 |             unitPrice: BILL_AMOUNT,
  175 |             vendorId: meta.vendorId
  176 |         });
  177 |         await app.advanceDocumentAPI(bill.id, 'bills');
  178 |         console.log(`[STRESS] Bill ${bill.ref} approved.`);
  179 | 
  180 |         // Create draft payment
  181 |         const payment = await app.api.purchase.createBillPaymentAPI({
  182 |             amount: BILL_AMOUNT,
  183 |             billId: bill.id,
  184 |             vendorId: meta.vendorId
  185 |         });
  186 |         console.log(`[STRESS] Draft payment ${payment.ref} created.`);
  187 | 
  188 |         // Reverse the bill
  189 |         const reversed = await app.api.purchase.reverseBillAPI(bill.id);
  190 |         expect(reversed).toBe(true);
  191 |         console.log(`[STRESS] Bill ${bill.ref} reversed successfully.`);
  192 | 
  193 |         // Now attempt to approve the payment against the reversed bill
  194 |         console.log(`[STRESS] Attempting to approve payment ${payment.ref} against reversed bill...`);
  195 |         let approved = false;
  196 |         try {
  197 |             await app.advanceDocumentAPI(payment.id, 'payments');
  198 |             approved = true;
  199 |         } catch (err: any) {
  200 |             console.log(`[PASS] Payment rejected correctly: ${err.message}`);
  201 |         }
  202 | 
  203 |         if (approved) {
> 204 |             throw new Error(`[REVERSED_BILL_BUG] Payment ${payment.ref} approved against reversed bill ${bill.ref}!`);
      |                   ^ Error: [REVERSED_BILL_BUG] Payment PAY/2026/08/17/000434 approved against reversed bill BILL/2026/08/17/001790!
  205 |         }
  206 |     });
  207 | });
  208 | 
```