# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-period-control.spec.ts >> Procurement Period Control Edge Cases @purchase @security @temporal @regression @full >> Payment: Reject future-dated Payment from next fiscal year (2019)
- Location: tests/purchase/po-period-control.spec.ts:218:9

# Error details

```
Error: [PERIOD_CONTROL_BUG] System approved future-dated Payment (2019-01-01T00:00:00Z)!
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
  154 | 
  155 |         if (bill.success) {
  156 |             try {
  157 |                 await app.advanceDocumentAPI(bill.id, 'bills');
  158 |                 throw new Error(`[PERIOD_CONTROL_BUG] System approved future-dated Bill (${futureDate})!`);
  159 |             } catch (advanceErr: any) {
  160 |                 if (advanceErr.message.includes('PERIOD_CONTROL_BUG')) throw advanceErr;
  161 |                 console.log(`[PASS] Future-dated Bill blocked at approval: ${advanceErr.message}`);
  162 |             }
  163 |         } else {
  164 |             console.log(`[PASS] Future-dated Bill rejected`);
  165 |         }
  166 |     });
  167 | 
  168 |     // ============================================================================
  169 |     // PAYMENT - PERIOD CONTROL SCENARIOS
  170 |     // ============================================================================
  171 | 
  172 |     test('Payment: Reject back-dated Payment from previous fiscal year (2017)', async ({ page }) => {
  173 |         const app = new AppManager(page);
  174 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  175 |         const meta = sharedMeta;
  176 |         const item = sharedItem;
  177 | 
  178 |         const backDate = '2017-12-31T00:00:00Z';
  179 |         console.log(`[TEST] Creating Payment with back date: ${backDate}`);
  180 | 
  181 |         // First create a bill to pay
  182 |         const bill = await app.api.purchase.createBillAPI({
  183 |             itemId: item.itemId,
  184 |             quantity: 1,
  185 |             unitPrice: 5000,
  186 |             vendorId: meta.vendorId,
  187 |             apAccountId: meta.apAccountId
  188 |         });
  189 | 
  190 |         if (!bill.success) {
  191 |             console.log(`[SKIP] Could not create bill for payment test`);
  192 |             return;
  193 |         }
  194 | 
  195 |         await app.advanceDocumentAPI(bill.id, 'bills');
  196 | 
  197 |         // Create payment with back date
  198 |         const payment = await app.api.purchase.createBillPaymentAPI({
  199 |             billId: bill.id,
  200 |             vendorId: meta.vendorId,
  201 |             amount: 5000,
  202 |             cashAccountId: meta.apAccountId
  203 |         });
  204 | 
  205 |         if (payment.success) {
  206 |             try {
  207 |                 await app.advanceDocumentAPI(payment.id, 'payments');
  208 |                 throw new Error(`[PERIOD_CONTROL_BUG] System approved back-dated Payment (${backDate})!`);
  209 |             } catch (advanceErr: any) {
  210 |                 if (advanceErr.message.includes('PERIOD_CONTROL_BUG')) throw advanceErr;
  211 |                 console.log(`[PASS] Payment created but blocked at approval: ${advanceErr.message}`);
  212 |             }
  213 |         } else {
  214 |             console.log(`[PASS] Back-dated Payment rejected`);
  215 |         }
  216 |     });
  217 | 
  218 |     test('Payment: Reject future-dated Payment from next fiscal year (2019)', async ({ page }) => {
  219 |         const app = new AppManager(page);
  220 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  221 |         const meta = sharedMeta;
  222 |         const item = sharedItem;
  223 | 
  224 |         const futureDate = '2019-01-01T00:00:00Z';
  225 |         console.log(`[TEST] Creating Payment with future date: ${futureDate}`);
  226 | 
  227 |         // First create a bill to pay
  228 |         const bill = await app.api.purchase.createBillAPI({
  229 |             itemId: item.itemId,
  230 |             quantity: 1,
  231 |             unitPrice: 5000,
  232 |             vendorId: meta.vendorId,
  233 |             apAccountId: meta.apAccountId
  234 |         });
  235 | 
  236 |         if (!bill.success) {
  237 |             console.log(`[SKIP] Could not create bill for payment test`);
  238 |             return;
  239 |         }
  240 | 
  241 |         await app.advanceDocumentAPI(bill.id, 'bills');
  242 | 
  243 |         // Create payment with future date
  244 |         const payment = await app.api.purchase.createBillPaymentAPI({
  245 |             billId: bill.id,
  246 |             vendorId: meta.vendorId,
  247 |             amount: 5000,
  248 |             cashAccountId: meta.apAccountId
  249 |         });
  250 | 
  251 |         if (payment.success) {
  252 |             try {
  253 |                 await app.advanceDocumentAPI(payment.id, 'payments');
> 254 |                 throw new Error(`[PERIOD_CONTROL_BUG] System approved future-dated Payment (${futureDate})!`);
      |                       ^ Error: [PERIOD_CONTROL_BUG] System approved future-dated Payment (2019-01-01T00:00:00Z)!
  255 |             } catch (advanceErr: any) {
  256 |                 if (advanceErr.message.includes('PERIOD_CONTROL_BUG')) throw advanceErr;
  257 |                 console.log(`[PASS] Future-dated Payment blocked at approval: ${advanceErr.message}`);
  258 |             }
  259 |         } else {
  260 |             console.log(`[PASS] Future-dated Payment rejected`);
  261 |         }
  262 |     });
  263 | });
  264 | 
```