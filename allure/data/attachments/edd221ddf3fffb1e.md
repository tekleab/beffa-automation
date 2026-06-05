# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-period-control.spec.ts >> Sales Period Control Edge Cases @sales @security @temporal @regression @full >> Edge Case: Reject date with negative timestamp (epoch manipulation)
- Location: tests/sales/so-period-control.spec.ts:283:9

# Error details

```
Error: [CRITICAL_PERIOD_CONTROL_BUG] System accepted pre-epoch date!
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
  202 |                 await app.advanceDocumentAPI(rct.id, 'receipts');
  203 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Receipt from previous fiscal year!`);
  204 |             } catch (advanceErr: any) {
  205 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  206 |                 console.log(`[PASS] Back-dated Receipt blocked at approval: ${advanceErr.message}`);
  207 |             }
  208 |         } else {
  209 |             console.log(`[PASS] Back-dated Receipt rejected`);
  210 |         }
  211 |     });
  212 | 
  213 |     test('Receipt: Reject future-dated Receipt from next fiscal year (2019)', async ({ page }) => {
  214 |         const app = new AppManager(page);
  215 |         const meta = sharedMeta;
  216 |         const item = sharedItem;
  217 | 
  218 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  219 |             customerId: meta.customerId,
  220 |             itemId: item.itemId,
  221 |             unitPrice: 5000,
  222 |             quantity: 1,
  223 |             locationId: item.locationId,
  224 |             warehouseId: item.warehouseId
  225 |         });
  226 |         await app.advanceDocumentAPI(inv.id, 'invoices');
  227 | 
  228 |         const futureDate = '2019-01-01T00:00:00Z';
  229 |         console.log(`[TEST] Creating Receipt with future date: ${futureDate}`);
  230 | 
  231 |         const rct = await app.api.sales.createInvoiceReceiptAPI({
  232 |             invoiceId: inv.id,
  233 |             customerId: meta.customerId,
  234 |             amount: 5000,
  235 |             receiptDate: futureDate
  236 |         });
  237 | 
  238 |         if (rct.success) {
  239 |             try {
  240 |                 await app.advanceDocumentAPI(rct.id, 'receipts');
  241 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved future-dated Receipt from next fiscal year!`);
  242 |             } catch (advanceErr: any) {
  243 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  244 |                 console.log(`[PASS] Future-dated Receipt blocked at approval: ${advanceErr.message}`);
  245 |             }
  246 |         } else {
  247 |             console.log(`[PASS] Future-dated Receipt rejected`);
  248 |         }
  249 |     });
  250 | 
  251 |     // ============================================================================
  252 |     // CRITICAL EDGE CASES
  253 |     // ============================================================================
  254 | 
  255 |     test('Edge Case: Reject invalid date (Feb 30, 2018)', async ({ page }) => {
  256 |         const app = new AppManager(page);
  257 |         const meta = sharedMeta;
  258 |         const item = sharedItem;
  259 | 
  260 |         const invalidDate = '2018-02-30T00:00:00Z';
  261 |         console.log(`[ATTACK] Creating Invoice with invalid date: ${invalidDate}`);
  262 | 
  263 |         try {
  264 |             const inv = await app.api.sales.createStandaloneInvoiceAPI({
  265 |                 customerId: meta.customerId,
  266 |                 itemId: item.itemId,
  267 |                 unitPrice: 5000,
  268 |                 quantity: 1,
  269 |                 locationId: item.locationId,
  270 |                 warehouseId: item.warehouseId,
  271 |                 invoiceDate: invalidDate
  272 |             });
  273 | 
  274 |             if (inv.success) {
  275 |                 throw new Error(`[CRITICAL_DATA_VALIDATION_BUG] System accepted invalid date (Feb 30)!`);
  276 |             }
  277 |         } catch (error: any) {
  278 |             if (error.message.includes('CRITICAL_DATA_VALIDATION_BUG')) throw error;
  279 |             console.log(`[PASS] Invalid date rejected: ${error.message}`);
  280 |         }
  281 |     });
  282 | 
  283 |     test('Edge Case: Reject date with negative timestamp (epoch manipulation)', async ({ page }) => {
  284 |         const app = new AppManager(page);
  285 |         const meta = sharedMeta;
  286 |         const item = sharedItem;
  287 | 
  288 |         const epochDate = '1969-12-31T00:00:00Z';
  289 |         console.log(`[TEST] Creating Invoice with pre-epoch date: ${epochDate}`);
  290 | 
  291 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  292 |             customerId: meta.customerId,
  293 |             itemId: item.itemId,
  294 |             unitPrice: 5000,
  295 |             quantity: 1,
  296 |             locationId: item.locationId,
  297 |             warehouseId: item.warehouseId,
  298 |             invoiceDate: epochDate
  299 |         });
  300 | 
  301 |         if (inv.success) {
> 302 |             throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System accepted pre-epoch date!`);
      |                   ^ Error: [CRITICAL_PERIOD_CONTROL_BUG] System accepted pre-epoch date!
  303 |         } else {
  304 |             console.log(`[PASS] Pre-epoch date rejected`);
  305 |         }
  306 |     });
  307 | 
  308 |     test('Edge Case: Verify SO->Invoice->Receipt chain with mixed dates is blocked', async ({ page }) => {
  309 |         const app = new AppManager(page);
  310 |         const meta = sharedMeta;
  311 |         const item = sharedItem;
  312 | 
  313 |         console.log(`[TEST] Creating SO with valid date, Invoice with back date`);
  314 | 
  315 |         const so = await app.api.sales.createSalesOrderAPI({
  316 |             customerId: meta.customerId,
  317 |             itemId: item.itemId,
  318 |             unitPrice: 5000,
  319 |             quantity: 1,
  320 |             locationId: item.locationId,
  321 |             warehouseId: item.warehouseId
  322 |         });
  323 |         await app.advanceDocumentAPI(so.id, 'sales-orders');
  324 | 
  325 |         const inv = await app.api.sales.createInvoiceAPI({
  326 |             customerId: meta.customerId,
  327 |             soItemId: so.soItemId,
  328 |             releasedQuantity: 1,
  329 |             locationId: item.locationId,
  330 |             warehouseId: item.warehouseId,
  331 |             invoiceDate: '2017-12-31T00:00:00Z'
  332 |         });
  333 | 
  334 |         if (inv.success) {
  335 |             try {
  336 |                 await app.advanceDocumentAPI(inv.id, 'invoices');
  337 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Invoice in SO->Invoice chain!`);
  338 |             } catch (advanceErr: any) {
  339 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  340 |                 console.log(`[PASS] Back-dated Invoice in chain blocked at approval: ${advanceErr.message}`);
  341 |             }
  342 |         } else {
  343 |             console.log(`[PASS] Mixed date chain rejected`);
  344 |         }
  345 |     });
  346 | });
  347 | 
```