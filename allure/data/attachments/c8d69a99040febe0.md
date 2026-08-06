# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-period-control.spec.ts >> Procurement Period Control Edge Cases @purchase @security @temporal @regression @full >> Payment: Reject back-dated Payment from previous fiscal year (2017)
- Location: tests/purchase/po-period-control.spec.ts:172:9

# Error details

```
Error: [CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Payment from previous fiscal year!
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
  108 |     test('Bill: Reject back-dated Bill from previous fiscal year (2017)', async ({ page }) => {
  109 |         const app = new AppManager(page);
  110 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  111 |         const meta = sharedMeta;
  112 |         const item = sharedItem;
  113 | 
  114 |         const backDate = '2017-12-31T00:00:00Z';
  115 |         console.log(`[TEST] Creating Bill with back date: ${backDate}`);
  116 | 
  117 |         const bill = await app.api.purchase.createBillAPI({
  118 |             itemId: item.itemId,
  119 |             quantity: 1,
  120 |             unitPrice: 5000,
  121 |             vendorId: meta.vendorId,
  122 |             apAccountId: meta.apAccountId
  123 |         });
  124 | 
  125 |         if (bill.success) {
  126 |             try {
  127 |                 await app.advanceDocumentAPI(bill.id, 'bills');
  128 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Bill from previous fiscal year!`);
  129 |             } catch (advanceErr: any) {
  130 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  131 |                 console.log(`[PASS] Bill created but blocked at approval: ${advanceErr.message}`);
  132 |             }
  133 |         } else {
  134 |             console.log(`[PASS] Back-dated Bill rejected`);
  135 |         }
  136 |     });
  137 | 
  138 |     test('Bill: Reject future-dated Bill from next fiscal year (2019)', async ({ page }) => {
  139 |         const app = new AppManager(page);
  140 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  141 |         const meta = sharedMeta;
  142 |         const item = sharedItem;
  143 | 
  144 |         const futureDate = '2019-01-01T00:00:00Z';
  145 |         console.log(`[TEST] Creating Bill with future date: ${futureDate}`);
  146 | 
  147 |         const bill = await app.api.purchase.createBillAPI({
  148 |             itemId: item.itemId,
  149 |             quantity: 1,
  150 |             unitPrice: 5000,
  151 |             vendorId: meta.vendorId,
  152 |             apAccountId: meta.apAccountId
  153 |         });
  154 | 
  155 |         if (bill.success) {
  156 |             try {
  157 |                 await app.advanceDocumentAPI(bill.id, 'bills');
  158 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved Bill from next fiscal year!`);
  159 |             } catch (advanceErr: any) {
  160 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
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
> 208 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Payment from previous fiscal year!`);
      |                       ^ Error: [CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Payment from previous fiscal year!
  209 |             } catch (advanceErr: any) {
  210 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
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
  254 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved Payment from next fiscal year!`);
  255 |             } catch (advanceErr: any) {
  256 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  257 |                 console.log(`[PASS] Future-dated Payment blocked at approval: ${advanceErr.message}`);
  258 |             }
  259 |         } else {
  260 |             console.log(`[PASS] Future-dated Payment rejected`);
  261 |         }
  262 |     });
  263 | });
  264 | 
```