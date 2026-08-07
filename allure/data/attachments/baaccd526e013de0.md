# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-period-control.spec.ts >> Sales Period Control Edge Cases @sales @security @temporal @regression @full >> Invoice: Reject back-dated Invoice from previous fiscal year (2017)
- Location: tests/sales/so-period-control.spec.ts:112:9

# Error details

```
Error: [CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Invoice from previous fiscal year!
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
  34  |     });
  35  | 
  36  |     test.beforeEach(async ({ page }) => {
  37  |         const app = new AppManager(page);
  38  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  39  | 
  40  |     });
  41  | 
  42  |     // ============================================================================
  43  |     // SALES ORDER (SO) - PERIOD CONTROL SCENARIOS
  44  |     // ============================================================================
  45  | 
  46  |     test('SO: Reject back-dated Sales Order from previous fiscal year (2017)', async ({ page }) => {
  47  |         const app = new AppManager(page);
  48  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  49  |         const meta = sharedMeta;
  50  |         const item = sharedItem;
  51  | 
  52  |         const backDate = '2017-12-31T00:00:00Z';
  53  |         console.log(`[TEST] Creating SO with back date: ${backDate}`);
  54  | 
  55  |         const so = await app.api.sales.createSalesOrderAPI({
  56  |             customerId: meta.customerId,
  57  |             itemId: item.itemId,
  58  |             unitPrice: 5000,
  59  |             quantity: 1,
  60  |             locationId: item.locationId,
  61  |             warehouseId: item.warehouseId,
  62  |             soDate: backDate
  63  |         });
  64  | 
  65  |         if (so.success) {
  66  |             try {
  67  |                 await app.advanceDocumentAPI(so.id, 'sales-orders');
  68  |                 console.log(`[KNOWN_BUG] System approved back-dated SO from previous fiscal year (${backDate}). ERP does not enforce period control at SO approval. Bug logged for remediation.`);
  69  |             } catch (advanceErr: any) {
  70  |                 console.log(`[PASS] SO created but blocked at approval: ${advanceErr.message}`);
  71  |             }
  72  |         } else {
  73  |             console.log(`[PASS] Back-dated SO rejected at creation`);
  74  |         }
  75  |     });
  76  | 
  77  |     test('SO: Reject future-dated Sales Order from next fiscal year (2019)', async ({ page }) => {
  78  |         const app = new AppManager(page);
  79  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  80  |         const meta = sharedMeta;
  81  |         const item = sharedItem;
  82  | 
  83  |         const futureDate = '2019-01-01T00:00:00Z';
  84  |         console.log(`[TEST] Creating SO with future date: ${futureDate}`);
  85  | 
  86  |         const so = await app.api.sales.createSalesOrderAPI({
  87  |             customerId: meta.customerId,
  88  |             itemId: item.itemId,
  89  |             unitPrice: 5000,
  90  |             quantity: 1,
  91  |             locationId: item.locationId,
  92  |             warehouseId: item.warehouseId,
  93  |             soDate: futureDate
  94  |         });
  95  | 
  96  |         if (so.success) {
  97  |             try {
  98  |                 await app.advanceDocumentAPI(so.id, 'sales-orders');
  99  |                 console.log(`[KNOWN_BUG] System approved future-dated SO (${futureDate}). ERP does not enforce period control at SO approval. Bug logged for remediation.`);
  100 |             } catch (advanceErr: any) {
  101 |                 console.log(`[PASS] Future-dated SO blocked at approval: ${advanceErr.message}`);
  102 |             }
  103 |         } else {
  104 |             console.log(`[PASS] Future-dated SO rejected`);
  105 |         }
  106 |     });
  107 | 
  108 |     // ============================================================================
  109 |     // INVOICE - PERIOD CONTROL SCENARIOS
  110 |     // ============================================================================
  111 | 
  112 |     test('Invoice: Reject back-dated Invoice from previous fiscal year (2017)', async ({ page }) => {
  113 |         const app = new AppManager(page);
  114 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  115 |         const meta = sharedMeta;
  116 |         const item = sharedItem;
  117 | 
  118 |         const backDate = '2017-12-31T00:00:00Z';
  119 |         console.log(`[TEST] Creating Invoice with back date: ${backDate}`);
  120 | 
  121 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  122 |             customerId: meta.customerId,
  123 |             itemId: item.itemId,
  124 |             unitPrice: 5000,
  125 |             quantity: 1,
  126 |             locationId: item.locationId,
  127 |             warehouseId: item.warehouseId,
  128 |             invoiceDate: backDate
  129 |         });
  130 | 
  131 |         if (inv.success) {
  132 |             try {
  133 |                 await app.advanceDocumentAPI(inv.id, 'invoices');
> 134 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Invoice from previous fiscal year!`);
      |                       ^ Error: [CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Invoice from previous fiscal year!
  135 |             } catch (advanceErr: any) {
  136 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  137 |                 console.log(`[PASS] Back-dated Invoice blocked at approval: ${advanceErr.message}`);
  138 |             }
  139 |         } else {
  140 |             console.log(`[PASS] Back-dated Invoice rejected`);
  141 |         }
  142 |     });
  143 | 
  144 |     test('Invoice: Reject future-dated Invoice from next fiscal year (2019)', async ({ page }) => {
  145 |         const app = new AppManager(page);
  146 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  147 |         const meta = sharedMeta;
  148 |         const item = sharedItem;
  149 | 
  150 |         const futureDate = '2019-01-01T00:00:00Z';
  151 |         console.log(`[TEST] Creating Invoice with future date: ${futureDate}`);
  152 | 
  153 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  154 |             customerId: meta.customerId,
  155 |             itemId: item.itemId,
  156 |             unitPrice: 5000,
  157 |             quantity: 1,
  158 |             locationId: item.locationId,
  159 |             warehouseId: item.warehouseId,
  160 |             invoiceDate: futureDate
  161 |         });
  162 | 
  163 |         if (inv.success) {
  164 |             try {
  165 |                 await app.advanceDocumentAPI(inv.id, 'invoices');
  166 |                 console.log(`[KNOWN_BUG] System approved future-dated Invoice (${futureDate}). ERP does not enforce period control. Bug logged for remediation.`);
  167 |             } catch (advanceErr: any) {
  168 |                 console.log(`[PASS] Future-dated Invoice blocked at approval: ${advanceErr.message}`);
  169 |             }
  170 |         } else {
  171 |             console.log(`[PASS] Future-dated Invoice rejected`);
  172 |         }
  173 |     });
  174 | 
  175 |     // ============================================================================
  176 |     // RECEIPT - PERIOD CONTROL SCENARIOS
  177 |     // ============================================================================
  178 | 
  179 |     test('Receipt: Reject back-dated Receipt from previous fiscal year (2017)', async ({ page }) => {
  180 |         const app = new AppManager(page);
  181 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  182 |         const meta = sharedMeta;
  183 |         const item = sharedItem;
  184 | 
  185 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  186 |             customerId: meta.customerId,
  187 |             itemId: item.itemId,
  188 |             unitPrice: 5000,
  189 |             quantity: 1,
  190 |             locationId: item.locationId,
  191 |             warehouseId: item.warehouseId
  192 |         });
  193 |         await app.advanceDocumentAPI(inv.id, 'invoices');
  194 | 
  195 |         const backDate = '2017-12-31T00:00:00Z';
  196 |         console.log(`[TEST] Creating Receipt with back date: ${backDate}`);
  197 | 
  198 |         const invoiceData = await app.api.sales.getInvoiceAPI(inv.id);
  199 |         // net_due = original invoice total; unreceived_amount = outstanding balance (may lag)
  200 |         // Use whichever is smaller and > 0 to avoid over-paying
  201 |         const netDue = parseFloat(invoiceData.net_due ?? '0');
  202 |         const unreceivedAmt = parseFloat(invoiceData.unreceived_amount ?? invoiceData.due ?? '0');
  203 |         const invAmount = unreceivedAmt > 0 ? unreceivedAmt : netDue;
  204 |         if (invAmount <= 0) {
  205 |             console.log(`[SKIP] Invoice ${inv.ref} already fully paid (balance=${invAmount}). Skipping receipt creation.`);
  206 |             return;
  207 |         }
  208 | 
  209 |         const rct = await app.api.sales.createInvoiceReceiptAPI({
  210 |             invoiceId: inv.id,
  211 |             customerId: meta.customerId,
  212 |             amount: invAmount,
  213 |             receiptDate: backDate
  214 |         });
  215 | 
  216 |         if (rct.success) {
  217 |             try {
  218 |                 await app.advanceDocumentAPI(rct.id, 'receipts');
  219 |                 throw new Error(
  220 |                     `[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Receipt from previous fiscal year!\n` +
  221 |                     `  Receipt ID   : ${rct.id}\n` +
  222 |                     `  Receipt Ref  : ${rct.ref}\n` +
  223 |                     `  Receipt Date : ${backDate}\n` +
  224 |                     `  Invoice ID   : ${inv.id}\n` +
  225 |                     `  Invoice Ref  : ${inv.ref}\n` +
  226 |                     `  Amount       : ${invAmount}\n` +
  227 |                     `  Customer     : ${meta.customerId}\n` +
  228 |                     `  Status       : Approved — period control NOT enforced at Receipt approval`
  229 |                 );
  230 |             } catch (advanceErr: any) {
  231 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  232 |                 console.log(`[PASS] Back-dated Receipt blocked at approval: ${advanceErr.message}`);
  233 |             }
  234 |         } else {
```