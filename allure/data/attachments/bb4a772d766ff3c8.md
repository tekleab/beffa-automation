# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-period-control.spec.ts >> Procurement Period Control Edge Cases @purchase @security @temporal @regression @full >> Payment: Reject future-dated Payment from next fiscal year (2019)
- Location: tests/purchase/po-period-control.spec.ts:210:9

# Error details

```
Error: [CRITICAL_PERIOD_CONTROL_BUG] System approved Payment from next fiscal year!
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
  145 |             apAccountId: meta.apAccountId
  146 |         });
  147 | 
  148 |         if (bill.success) {
  149 |             try {
  150 |                 await app.advanceDocumentAPI(bill.id, 'bills');
  151 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved Bill from next fiscal year!`);
  152 |             } catch (advanceErr: any) {
  153 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  154 |                 console.log(`[PASS] Future-dated Bill blocked at approval: ${advanceErr.message}`);
  155 |             }
  156 |         } else {
  157 |             console.log(`[PASS] Future-dated Bill rejected`);
  158 |         }
  159 |     });
  160 | 
  161 |     // ============================================================================
  162 |     // PAYMENT - PERIOD CONTROL SCENARIOS
  163 |     // ============================================================================
  164 | 
  165 |     test('Payment: Reject back-dated Payment from previous fiscal year (2017)', async ({ page }) => {
  166 |         const app = new AppManager(page);
  167 |         const meta = sharedMeta;
  168 |         const item = sharedItem;
  169 | 
  170 |         const backDate = '2017-12-31T00:00:00Z';
  171 |         console.log(`[TEST] Creating Payment with back date: ${backDate}`);
  172 | 
  173 |         // First create a bill to pay
  174 |         const bill = await app.api.purchase.createBillAPI({
  175 |             itemId: item.itemId,
  176 |             quantity: 1,
  177 |             unitPrice: 5000,
  178 |             vendorId: meta.vendorId,
  179 |             apAccountId: meta.apAccountId
  180 |         });
  181 | 
  182 |         if (!bill.success) {
  183 |             console.log(`[SKIP] Could not create bill for payment test`);
  184 |             return;
  185 |         }
  186 | 
  187 |         await app.advanceDocumentAPI(bill.id, 'bills');
  188 | 
  189 |         // Create payment with back date
  190 |         const payment = await app.api.purchase.createBillPaymentAPI({
  191 |             billId: bill.id,
  192 |             vendorId: meta.vendorId,
  193 |             amount: 5000,
  194 |             cashAccountId: meta.apAccountId
  195 |         });
  196 | 
  197 |         if (payment.success) {
  198 |             try {
  199 |                 await app.advanceDocumentAPI(payment.id, 'payments');
  200 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Payment from previous fiscal year!`);
  201 |             } catch (advanceErr: any) {
  202 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  203 |                 console.log(`[PASS] Payment created but blocked at approval: ${advanceErr.message}`);
  204 |             }
  205 |         } else {
  206 |             console.log(`[PASS] Back-dated Payment rejected`);
  207 |         }
  208 |     });
  209 | 
  210 |     test('Payment: Reject future-dated Payment from next fiscal year (2019)', async ({ page }) => {
  211 |         const app = new AppManager(page);
  212 |         const meta = sharedMeta;
  213 |         const item = sharedItem;
  214 | 
  215 |         const futureDate = '2019-01-01T00:00:00Z';
  216 |         console.log(`[TEST] Creating Payment with future date: ${futureDate}`);
  217 | 
  218 |         // First create a bill to pay
  219 |         const bill = await app.api.purchase.createBillAPI({
  220 |             itemId: item.itemId,
  221 |             quantity: 1,
  222 |             unitPrice: 5000,
  223 |             vendorId: meta.vendorId,
  224 |             apAccountId: meta.apAccountId
  225 |         });
  226 | 
  227 |         if (!bill.success) {
  228 |             console.log(`[SKIP] Could not create bill for payment test`);
  229 |             return;
  230 |         }
  231 | 
  232 |         await app.advanceDocumentAPI(bill.id, 'bills');
  233 | 
  234 |         // Create payment with future date
  235 |         const payment = await app.api.purchase.createBillPaymentAPI({
  236 |             billId: bill.id,
  237 |             vendorId: meta.vendorId,
  238 |             amount: 5000,
  239 |             cashAccountId: meta.apAccountId
  240 |         });
  241 | 
  242 |         if (payment.success) {
  243 |             try {
  244 |                 await app.advanceDocumentAPI(payment.id, 'payments');
> 245 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved Payment from next fiscal year!`);
      |                       ^ Error: [CRITICAL_PERIOD_CONTROL_BUG] System approved Payment from next fiscal year!
  246 |             } catch (advanceErr: any) {
  247 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  248 |                 console.log(`[PASS] Future-dated Payment blocked at approval: ${advanceErr.message}`);
  249 |             }
  250 |         } else {
  251 |             console.log(`[PASS] Future-dated Payment rejected`);
  252 |         }
  253 |     });
  254 | });
  255 | 
```