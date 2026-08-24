# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-period-control.spec.ts >> Procurement Period Control Edge Cases @purchase @security @temporal @regression @full >> Payment: Reject future-dated Payment from next fiscal year (2019)
- Location: tests/purchase/po-period-control.spec.ts:229:9

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
  165 | 
  166 |         if (bill.success) {
  167 |             try {
  168 |                 await app.advanceDocumentAPI(bill.id, 'bills');
  169 |                 throw new Error(`[PERIOD_CONTROL_BUG] System approved future-dated Bill (${futureDate})!`);
  170 |             } catch (advanceErr: any) {
  171 |                 if (advanceErr.message.includes('PERIOD_CONTROL_BUG')) throw advanceErr;
  172 |                 console.log(`[PASS] Future-dated Bill blocked at approval: ${advanceErr.message}`);
  173 |             }
  174 |         } else {
  175 |             console.log(`[PASS] Future-dated Bill rejected`);
  176 |         }
  177 |     });
  178 | 
  179 |     // ============================================================================
  180 |     // PAYMENT - PERIOD CONTROL SCENARIOS
  181 |     // ============================================================================
  182 | 
  183 |     test('Payment: Reject back-dated Payment from previous fiscal year (2017)', async ({ page }) => {
  184 |         const app = new AppManager(page);
  185 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  186 |         const meta = sharedMeta;
  187 |         const item = sharedItem;
  188 | 
  189 |         const backDate = '2017-12-31T00:00:00Z';
  190 |         console.log(`[TEST] Creating Payment with back date: ${backDate}`);
  191 | 
  192 |         // First create a bill to pay
  193 |         const bill = await app.api.purchase.createBillAPI({
  194 |             itemId: item.itemId,
  195 |             quantity: 1,
  196 |             unitPrice: 5000,
  197 |             vendorId: meta.vendorId,
  198 |             apAccountId: meta.apAccountId
  199 |         });
  200 | 
  201 |         if (!bill.success) {
  202 |             console.log(`[SKIP] Could not create bill for payment test`);
  203 |             return;
  204 |         }
  205 | 
  206 |         await app.advanceDocumentAPI(bill.id, 'bills');
  207 | 
  208 |         // Create payment with back date
  209 |         const payment = await app.api.purchase.createBillPaymentAPI({
  210 |             billId: bill.id,
  211 |             vendorId: meta.vendorId,
  212 |             amount: 5000,
  213 |             cashAccountId: meta.apAccountId
  214 |         });
  215 | 
  216 |         if (payment.success) {
  217 |             try {
  218 |                 await app.advanceDocumentAPI(payment.id, 'payments');
  219 |                 throw new Error(`[PERIOD_CONTROL_BUG] System approved back-dated Payment (${backDate})!`);
  220 |             } catch (advanceErr: any) {
  221 |                 if (advanceErr.message.includes('PERIOD_CONTROL_BUG')) throw advanceErr;
  222 |                 console.log(`[PASS] Payment created but blocked at approval: ${advanceErr.message}`);
  223 |             }
  224 |         } else {
  225 |             console.log(`[PASS] Back-dated Payment rejected`);
  226 |         }
  227 |     });
  228 | 
  229 |     test('Payment: Reject future-dated Payment from next fiscal year (2019)', async ({ page }) => {
  230 |         const app = new AppManager(page);
  231 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  232 |         const meta = sharedMeta;
  233 |         const item = sharedItem;
  234 | 
  235 |         const futureDate = '2019-01-01T00:00:00Z';
  236 |         console.log(`[TEST] Creating Payment with future date: ${futureDate}`);
  237 | 
  238 |         // First create a bill to pay
  239 |         const bill = await app.api.purchase.createBillAPI({
  240 |             itemId: item.itemId,
  241 |             quantity: 1,
  242 |             unitPrice: 5000,
  243 |             vendorId: meta.vendorId,
  244 |             apAccountId: meta.apAccountId
  245 |         });
  246 | 
  247 |         if (!bill.success) {
  248 |             console.log(`[SKIP] Could not create bill for payment test`);
  249 |             return;
  250 |         }
  251 | 
  252 |         await app.advanceDocumentAPI(bill.id, 'bills');
  253 | 
  254 |         // Create payment with future date
  255 |         const payment = await app.api.purchase.createBillPaymentAPI({
  256 |             billId: bill.id,
  257 |             vendorId: meta.vendorId,
  258 |             amount: 5000,
  259 |             cashAccountId: meta.apAccountId
  260 |         });
  261 | 
  262 |         if (payment.success) {
  263 |             try {
  264 |                 await app.advanceDocumentAPI(payment.id, 'payments');
> 265 |                 throw new Error(`[PERIOD_CONTROL_BUG] System approved future-dated Payment (${futureDate})!`);
      |                       ^ Error: [PERIOD_CONTROL_BUG] System approved future-dated Payment (2019-01-01T00:00:00Z)!
  266 |             } catch (advanceErr: any) {
  267 |                 if (advanceErr.message.includes('PERIOD_CONTROL_BUG')) throw advanceErr;
  268 |                 console.log(`[PASS] Future-dated Payment blocked at approval: ${advanceErr.message}`);
  269 |             }
  270 |         } else {
  271 |             console.log(`[PASS] Future-dated Payment rejected`);
  272 |         }
  273 |     });
  274 | });
  275 | 
```