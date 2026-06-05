# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-period-control.spec.ts >> Sales Period Control Edge Cases @sales @security @temporal @regression @full >> Invoice: Reject back-dated Invoice from previous fiscal year (2017)
- Location: tests/sales/so-period-control.spec.ts:109:9

# Error details

```
Error: [CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Invoice from previous fiscal year!
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
  30  |         sharedItem = await app.api.inventory.captureRandomItemDataAPI({ minStock: 2 });
  31  |         await page.close();
  32  |     });
  33  | 
  34  |     test.beforeEach(async ({ page }) => {
  35  |         const app = new AppManager(page);
  36  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  37  |     });
  38  | 
  39  |     // ============================================================================
  40  |     // SALES ORDER (SO) - PERIOD CONTROL SCENARIOS
  41  |     // ============================================================================
  42  | 
  43  |     test('SO: Reject back-dated Sales Order from previous fiscal year (2017)', async ({ page }) => {
  44  |         const app = new AppManager(page);
  45  |         const meta = sharedMeta;
  46  |         const item = sharedItem;
  47  | 
  48  |         const backDate = '2017-12-31T00:00:00Z';
  49  |         console.log(`[TEST] Creating SO with back date: ${backDate}`);
  50  | 
  51  |         const so = await app.api.sales.createSalesOrderAPI({
  52  |             customerId: meta.customerId,
  53  |             itemId: item.itemId,
  54  |             unitPrice: 5000,
  55  |             quantity: 1,
  56  |             locationId: item.locationId,
  57  |             warehouseId: item.warehouseId,
  58  |             soDate: backDate
  59  |         });
  60  | 
  61  |         if (so.success) {
  62  |             try {
  63  |                 await app.advanceDocumentAPI(so.id, 'sales-orders');
  64  |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated SO from previous fiscal year!`);
  65  |             } catch (advanceErr: any) {
  66  |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  67  |                 console.log(`[PASS] SO created but blocked at approval: ${advanceErr.message}`);
  68  |             }
  69  |         } else {
  70  |             console.log(`[PASS] Back-dated SO rejected`);
  71  |         }
  72  |     });
  73  | 
  74  |     test('SO: Reject future-dated Sales Order from next fiscal year (2019)', async ({ page }) => {
  75  |         const app = new AppManager(page);
  76  |         const meta = sharedMeta;
  77  |         const item = sharedItem;
  78  | 
  79  |         const futureDate = '2019-01-01T00:00:00Z';
  80  |         console.log(`[TEST] Creating SO with future date: ${futureDate}`);
  81  | 
  82  |         const so = await app.api.sales.createSalesOrderAPI({
  83  |             customerId: meta.customerId,
  84  |             itemId: item.itemId,
  85  |             unitPrice: 5000,
  86  |             quantity: 1,
  87  |             locationId: item.locationId,
  88  |             warehouseId: item.warehouseId,
  89  |             soDate: futureDate
  90  |         });
  91  | 
  92  |         if (so.success) {
  93  |             try {
  94  |                 await app.advanceDocumentAPI(so.id, 'sales-orders');
  95  |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved SO from next fiscal year!`);
  96  |             } catch (advanceErr: any) {
  97  |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  98  |                 console.log(`[PASS] Future-dated SO blocked at approval: ${advanceErr.message}`);
  99  |             }
  100 |         } else {
  101 |             console.log(`[PASS] Future-dated SO rejected`);
  102 |         }
  103 |     });
  104 | 
  105 |     // ============================================================================
  106 |     // INVOICE - PERIOD CONTROL SCENARIOS
  107 |     // ============================================================================
  108 | 
  109 |     test('Invoice: Reject back-dated Invoice from previous fiscal year (2017)', async ({ page }) => {
  110 |         const app = new AppManager(page);
  111 |         const meta = sharedMeta;
  112 |         const item = sharedItem;
  113 | 
  114 |         const backDate = '2017-12-31T00:00:00Z';
  115 |         console.log(`[TEST] Creating Invoice with back date: ${backDate}`);
  116 | 
  117 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  118 |             customerId: meta.customerId,
  119 |             itemId: item.itemId,
  120 |             unitPrice: 5000,
  121 |             quantity: 1,
  122 |             locationId: item.locationId,
  123 |             warehouseId: item.warehouseId,
  124 |             invoiceDate: backDate
  125 |         });
  126 | 
  127 |         if (inv.success) {
  128 |             try {
  129 |                 await app.advanceDocumentAPI(inv.id, 'invoices');
> 130 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Invoice from previous fiscal year!`);
      |                       ^ Error: [CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Invoice from previous fiscal year!
  131 |             } catch (advanceErr: any) {
  132 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  133 |                 console.log(`[PASS] Back-dated Invoice blocked at approval: ${advanceErr.message}`);
  134 |             }
  135 |         } else {
  136 |             console.log(`[PASS] Back-dated Invoice rejected`);
  137 |         }
  138 |     });
  139 | 
  140 |     test('Invoice: Reject future-dated Invoice from next fiscal year (2019)', async ({ page }) => {
  141 |         const app = new AppManager(page);
  142 |         const meta = sharedMeta;
  143 |         const item = sharedItem;
  144 | 
  145 |         const futureDate = '2019-01-01T00:00:00Z';
  146 |         console.log(`[TEST] Creating Invoice with future date: ${futureDate}`);
  147 | 
  148 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  149 |             customerId: meta.customerId,
  150 |             itemId: item.itemId,
  151 |             unitPrice: 5000,
  152 |             quantity: 1,
  153 |             locationId: item.locationId,
  154 |             warehouseId: item.warehouseId,
  155 |             invoiceDate: futureDate
  156 |         });
  157 | 
  158 |         if (inv.success) {
  159 |             try {
  160 |                 await app.advanceDocumentAPI(inv.id, 'invoices');
  161 |                 throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved future-dated Invoice from next fiscal year!`);
  162 |             } catch (advanceErr: any) {
  163 |                 if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
  164 |                 console.log(`[PASS] Future-dated Invoice blocked at approval: ${advanceErr.message}`);
  165 |             }
  166 |         } else {
  167 |             console.log(`[PASS] Future-dated Invoice rejected`);
  168 |         }
  169 |     });
  170 | 
  171 |     // ============================================================================
  172 |     // RECEIPT - PERIOD CONTROL SCENARIOS
  173 |     // ============================================================================
  174 | 
  175 |     test('Receipt: Reject back-dated Receipt from previous fiscal year (2017)', async ({ page }) => {
  176 |         const app = new AppManager(page);
  177 |         const meta = sharedMeta;
  178 |         const item = sharedItem;
  179 | 
  180 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  181 |             customerId: meta.customerId,
  182 |             itemId: item.itemId,
  183 |             unitPrice: 5000,
  184 |             quantity: 1,
  185 |             locationId: item.locationId,
  186 |             warehouseId: item.warehouseId
  187 |         });
  188 |         await app.advanceDocumentAPI(inv.id, 'invoices');
  189 | 
  190 |         const backDate = '2017-12-31T00:00:00Z';
  191 |         console.log(`[TEST] Creating Receipt with back date: ${backDate}`);
  192 | 
  193 |         const rct = await app.api.sales.createInvoiceReceiptAPI({
  194 |             invoiceId: inv.id,
  195 |             customerId: meta.customerId,
  196 |             amount: 5000,
  197 |             receiptDate: backDate
  198 |         });
  199 | 
  200 |         if (rct.success) {
  201 |             try {
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
```