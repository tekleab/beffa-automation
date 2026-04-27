# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/sales-negative-api.spec.ts >> Sales Order Negative API Tests @negative >> Integrity: Block Non-Existent Customer UUID
- Location: tests/sales/sales-negative-api.spec.ts:177:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 422
Received: 500
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "smoke test" [ref=e10]: st
        - generic [ref=e11]:
          - button "smoke test" [ref=e12] [cursor=pointer]:
            - generic: smoke test
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
          - img "smoke test" [ref=e62]: st
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
  97  |             invoice_date: new Date().toISOString(),
  98  |             released_sales_order_items: [] // EMPTY
  99  |         };
  100 | 
  101 |         console.log('[ACTION] Sending Invoice with no line items...');
  102 |         const response = await page.request.post(`${apiBase}/invoices?year=2018&period=yearly&calendar=ec`, {
  103 |             data: payload,
  104 |             headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  105 |         });
  106 | 
  107 |         console.log(`[OK] Received status: ${response.status()}`);
  108 |         expect(response.status()).toBe(422);
  109 |     });
  110 | 
  111 |     // --- RECEIPT NEGATIVE TESTS ---
  112 |     test('Block Receipt: Missing Cash Account', async ({ page }) => {
  113 |         const app = new AppManager(page);
  114 |         const token = await app._getAuthToken();
  115 |         const apiBase = "http://157.180.20.112:8001/api";
  116 | 
  117 |         const payload = {
  118 |             amount: 500,
  119 |             customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
  120 |             cash_account_id: null, // MISSING
  121 |             payment_method: "cash",
  122 |             invoice_receipts: [{
  123 |                 amount: 500,
  124 |                 invoice_id: "00000000-0000-0000-0000-000000000000"
  125 |             }]
  126 |         };
  127 | 
  128 |         console.log('[ACTION] Sending Receipt with null cash_account...');
  129 |         const response = await page.request.post(`${apiBase}/receipts?year=2018&period=yearly&calendar=ec`, {
  130 |             data: payload,
  131 |             headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  132 |         });
  133 | 
  134 |         console.log(`[OK] Received status: ${response.status()}`);
  135 |         expect(response.status()).toBe(422);
  136 |     });
  137 | 
  138 |     // --- ADVANCED EDGE CASES ---
  139 | 
  140 |     test('Security: Block Unauthorized Access', async ({ page }) => {
  141 |         const apiBase = "http://157.180.20.112:8001/api";
  142 | 
  143 |         console.log('[ACTION] Sending SO with INVALID token...');
  144 |         const response = await page.request.post(`${apiBase}/sales-orders`, {
  145 |             data: { customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06" },
  146 |             headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer INVALID_TOKEN_123` }
  147 |         });
  148 | 
  149 |         console.log(`[OK] Received status: ${response.status()}`);
  150 |         expect(response.status()).toBe(401);
  151 |     });
  152 | 
  153 |     test('Boundary: Block Negative Quantity', async ({ page }) => {
  154 |         const app = new AppManager(page);
  155 |         const token = await app._getAuthToken();
  156 |         const apiBase = "http://157.180.20.112:8001/api";
  157 | 
  158 |         const payload = {
  159 |             customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
  160 |             so_items: [{
  161 |                 item_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4",
  162 |                 quantity: -99, // ILLEGAL
  163 |                 unit_price: 100
  164 |             }]
  165 |         };
  166 | 
  167 |         console.log('[ACTION] Sending SO with negative quantity...');
  168 |         const response = await page.request.post(`${apiBase}/sales-orders?year=2018&period=yearly&calendar=ec`, {
  169 |             data: payload,
  170 |             headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  171 |         });
  172 | 
  173 |         console.log(`[OK] Received status: ${response.status()}`);
  174 |         expect(response.status()).toBe(422);
  175 |     });
  176 | 
  177 |     test('Integrity: Block Non-Existent Customer UUID', async ({ page }) => {
  178 |         const app = new AppManager(page);
  179 |         const token = await app._getAuthToken();
  180 |         const apiBase = "http://157.180.20.112:8001/api";
  181 | 
  182 |         const payload = {
  183 |             customer_id: "123e4567-e89b-12d3-a456-426614174000", // FAKE VALID-FORMAT UUID
  184 |             so_items: [{
  185 |                 item_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4",
  186 |                 quantity: 1, unit_price: 100
  187 |             }]
  188 |         };
  189 | 
  190 |         console.log('[ACTION] Sending SO with non-existent customer_id...');
  191 |         const response = await page.request.post(`${apiBase}/sales-orders?year=2018&period=yearly&calendar=ec`, {
  192 |             data: payload,
  193 |             headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  194 |         });
  195 | 
  196 |         console.log(`[OK] Received status: ${response.status()}`);
> 197 |         expect(response.status()).toBe(422);
      |                                   ^ Error: expect(received).toBe(expected) // Object.is equality
  198 |     });
  199 | 
  200 |     // --- PROFESSIONAL STATE & BOUNDARY TESTS ---
  201 | 
  202 |     test('State Violation: Block Invoicing a DRAFT SO', async ({ page }) => {
  203 |         const app = new AppManager(page);
  204 |         const apiBase = "http://157.180.20.112:8001/api";
  205 |         const token = await app._getAuthToken();
  206 | 
  207 |         // 1. Dynamic Item Discovery
  208 |         console.log('[ACTION] Discovering valid item for state violation test...');
  209 |         const item = await app.captureRandomItemDetails();
  210 | 
  211 |         // 2. Create a DRAFT Sales Order
  212 |         const so = await app.api.sales.createSalesOrderAPI({ itemId: item.itemId });
  213 | 
  214 |         // 3. Attempt to Invoice (Should fail because SO is not approved)
  215 |         console.log(`[ACTION] Attempting state violation: Invoicing DRAFT SO ${so.ref}...`);
  216 |         const response = await page.request.post(`${apiBase}/invoices?year=2018&period=yearly&calendar=ec`, {
  217 |             data: {
  218 |                 customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
  219 |                 invoice_date: new Date().toISOString(),
  220 |                 released_sales_order_items: [{ so_item_id: so.soItemId, released_quantity: 1 }]
  221 |             },
  222 |             headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  223 |         });
  224 | 
  225 |         console.log(`[OK] Received status: ${response.status()}`);
  226 |         expect(response.status()).toBe(422);
  227 |     });
  228 | 
  229 |     test('Boundary: Block Extreme Financial Inputs', async ({ page }) => {
  230 |         const app = new AppManager(page);
  231 |         const apiBase = "http://157.180.20.112:8001/api";
  232 |         const token = await app._getAuthToken();
  233 | 
  234 |         const payload = {
  235 |             customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
  236 |             so_items: [{
  237 |                 item_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4",
  238 |                 quantity: 999999999999, // OVERFLOW QTY
  239 |                 unit_price: 999999999999 // OVERFLOW PRICE
  240 |             }]
  241 |         };
  242 | 
  243 |         console.log('[ACTION] Sending SO with extreme numeric values...');
  244 |         const response = await page.request.post(`${apiBase}/sales-orders?year=2018&period=yearly&calendar=ec`, {
  245 |             data: payload,
  246 |             headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  247 |         });
  248 | 
  249 |         console.log(`[OK] Received status: ${response.status()}`);
  250 |         // System should handle overflow or have a limit
  251 |         expect(response.status()).toBeGreaterThanOrEqual(400);
  252 |     });
  253 | });
  254 | 
```