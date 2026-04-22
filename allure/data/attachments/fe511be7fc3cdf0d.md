# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/invoice-receipt-balance.spec.ts >> Invoice-Receipt Balance Flow @regression >> Verify partial receipt correctly updates invoice amount due
- Location: tests/sales/invoice-receipt-balance.spec.ts:6:9

# Error details

```
Error: Standalone Invoice API Creation Failed: 422 - {
	"code": 422,
	"message": "Accounts Receivable account not found."
}

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
  66  |         tax_id: data.taxId || taxes[Math.floor(Math.random() * taxes.length)],
  67  |         description: data.description || 'E2E Speed Track'
  68  |       }],
  69  |       status: 'draft'
  70  |     };
  71  | 
  72  |     const token = await this._getAuthToken();
  73  |     await this.startTacticalTimer();
  74  |     const response = await this.page.request.post(`${apiBase}/sales-orders?year=2018&period=yearly&calendar=ec`, {
  75  |       data: payload,
  76  |       headers: { 'x-company': 'smoke test', 'Authorization': token ? `Bearer ${token}` : '' }
  77  |     });
  78  |     await this.stopTacticalTimer('Create Sales Order', 'API');
  79  | 
  80  |     if (!response.ok()) {
  81  |       const errText = await response.text();
  82  |       console.warn(`[WARN] SO API Creation Failed: ${response.status()} - ${errText}`);
  83  |       return { success: false, ref: '', id: '', customerId: payload.customer_id, soItemId: null, status: response.status(), error: errText };
  84  |     }
  85  |     const json = await response.json();
  86  |     const soItemId = json.so_items?.[0]?.id || null;
  87  |     console.log(`[SUCCESS] Sales Order created via API: ${json.so_number} (ID: ${json.id}, ItemID: ${soItemId})`);
  88  |     return { success: true, ref: json.so_number, id: json.id, customerId: payload.customer_id, soItemId };
  89  |   }
  90  | 
  91  |   async createInvoiceAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref?: string; id?: string; status?: number; error?: string }> {
  92  |     const apiBase = 'http://157.180.20.112:8001/api';
  93  | 
  94  |     const arAccounts = ['20c381e1-4d14-4ab1-8e7e-dee2937b4a64', '8479ad17-541c-4b85-a371-59f0536ba6e9'];
  95  | 
  96  |     const now = new Date();
  97  |     const dueDate = new Date();
  98  |     dueDate.setDate(now.getDate() + 30);
  99  | 
  100 |     const payload = {
  101 |       accounts_receivable_id: data.arAccountId || arAccounts[0],
  102 |       currency_id: data.currencyId || '50567982-ee2f-4391-9400-3149067443a5',
  103 |       customer_id: data.customerId, // REQUIRED: must match the SO customer
  104 |       invoice_date: now.toISOString().split('T')[0] + 'T00:00:00Z',
  105 |       due_date: dueDate.toISOString().split('T')[0] + 'T00:00:00Z',
  106 |       released_sales_order_items: [{
  107 |         so_item_id: data.soItemId, // REQUIRED: from createSalesOrderAPI response
  108 |         released_quantity: data.releasedQuantity || 1
  109 |       }],
  110 |       status: 'draft'
  111 |     };
  112 | 
  113 |     const token = await this._getAuthToken();
  114 |     await this.startTacticalTimer();
  115 |     const response = await this.page.request.post(`${apiBase}/invoices?year=2018&period=yearly&calendar=ec`, {
  116 |       data: payload,
  117 |       headers: { 'x-company': 'smoke test', 'Authorization': token ? `Bearer ${token}` : '' }
  118 |     });
  119 |     await this.stopTacticalTimer('Create Invoice', 'API');
  120 | 
  121 |     if (!response.ok()) {
  122 |       const err = await response.text();
  123 |       console.error(`[ERROR] Invoice API Failed: ${response.status()} - ${err}`);
  124 |       return { success: false, status: response.status(), error: err };
  125 |     }
  126 |     const json = await response.json();
  127 |     console.log(`[SUCCESS] Invoice created via API: ${json.invoice_number} (ID: ${json.id})`);
  128 |     return { success: true, ref: json.invoice_number, id: json.id };
  129 |   }
  130 | 
  131 |   async createStandaloneInvoiceAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string; amountDue: number; customerId: string }> {
  132 |     const apiBase = 'http://157.180.20.112:8001/api';
  133 |     const customers = ['32f1aeb4-531f-4104-ad07-f3761a97dd06', '256ce173-d504-4345-a6b7-70cead86f135'];
  134 |     const custId = data.customerId || customers[1];
  135 | 
  136 |     const unitPrice = data.unitPrice || 10993.05;
  137 |     const q = data.quantity || 1;
  138 |     const amount = q * unitPrice;
  139 | 
  140 |     const payload = {
  141 |       accounts_receivable_id: '998df511-68ea-48b9-b405-9419eb78145b',
  142 |       customer_id: custId,
  143 |       invoice_date: new Date().toISOString(),
  144 |       due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
  145 |       currency_id: '50567982-ee2f-4391-9400-3149067443a5',
  146 |       items: [{
  147 |         amount: amount,
  148 |         general_ledger_account_id: '998df511-68ea-48b9-b405-9419eb78145b',
  149 |         item_id: data.itemId,
  150 |         location_id: '2595ebb0-4e78-4bc5-9321-140d3fd316c7',
  151 |         quantity: q,
  152 |         tax_id: 'b017352f-f454-45e2-85ef-e327f90d8f9c',
  153 |         unit_price: unitPrice,
  154 |         warehouse_id: 'cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4',
  155 |       }],
  156 |       released_sales_order_items: [],
  157 |       sales_order_id: '00000000-0000-0000-0000-000000000000'
  158 |     };
  159 | 
  160 |     const token = await this._getAuthToken();
  161 |     const response = await this.page.request.post(`${apiBase}/invoices?year=2018&period=yearly&calendar=ec`, {
  162 |       data: payload,
  163 |       headers: { 'x-company': 'smoke test', 'Authorization': token ? `Bearer ${token}` : '' }
  164 |     });
  165 | 
> 166 |     if (!response.ok()) throw new Error(`Standalone Invoice API Creation Failed: ${response.status()} - ${await response.text()}`);
      |                               ^ Error: Standalone Invoice API Creation Failed: 422 - {
  167 |     const json = await response.json();
  168 |     console.log(`[SUCCESS] Standalone Invoice created via API: ${json.invoice_number} (ID: ${json.id})`);
  169 |     return { success: true, ref: json.invoice_number, id: json.id, amountDue: amount, customerId: custId };
  170 |   }
  171 | 
  172 |   async createReceiptAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
  173 |     const apiBase = 'http://157.180.20.112:8001/api';
  174 |     const amount = data.amount || Math.floor(Math.random() * 1500000) + 500000;
  175 | 
  176 |     const customers = ['32f1aeb4-531f-4104-ad07-f3761a97dd06', '256ce173-d504-4345-a6b7-70cead86f135'];
  177 |     const cashAccounts = ['9375b986-2772-434e-ada2-b1843e465604', 'f17570eb-6533-4249-8eba-e77a4ea92d43'];
  178 |     const glAccounts = ['8b313729-d6cb-4a33-af8b-7f5c880d86c0', '998df511-68ea-48b9-b405-9419eb78145b'];
  179 |     const taxes = ['8da036a5-9185-4043-bfb5-b146aac78412', 'b017352f-f454-45e2-85ef-e327f90d8f9c'];
  180 | 
  181 |     const payload = {
  182 |       amount,
  183 |       cash_account_id: cashAccounts[Math.floor(Math.random() * cashAccounts.length)],
  184 |       customer_id: customers[Math.floor(Math.random() * customers.length)],
  185 |       date: new Date().toISOString(),
  186 |       payment_method: 'cash',
  187 |       currency_id: '50567982-ee2f-4391-9400-3149067443a5',
  188 |       receipt_items: [{
  189 |         amount,
  190 |         general_ledger_account_id: glAccounts[Math.floor(Math.random() * glAccounts.length)],
  191 |         tax_id: taxes[Math.floor(Math.random() * taxes.length)],
  192 |         unit_price: amount, quantity: 1, description: 'E2E Speed Track'
  193 |       }]
  194 |     };
  195 | 
  196 |     const token = await this._getAuthToken();
  197 |     const response = await this.page.request.post(`${apiBase}/receipts`, {
  198 |       data: payload,
  199 |       headers: { 'x-company': 'smoke test', 'Authorization': token ? `Bearer ${token}` : '' }
  200 |     });
  201 | 
  202 |     if (!response.ok()) throw new Error(`API Creation Failed: ${response.status()} - ${await response.text()}`);
  203 |     const json = await response.json();
  204 |     console.log(`[SUCCESS] Receipt created via API: ${json.ref} (ID: ${json.id})`);
  205 |     return { success: true, ref: json.ref, id: json.id };
  206 |   }
  207 | 
  208 |   async reverseInvoiceAPI(invoiceId: string): Promise<boolean> {
  209 |     const apiBase = 'http://157.180.20.112:8001/api';
  210 |     const token = await this._getAuthToken();
  211 |     const params = 'year=2018&period=yearly&calendar=ec';
  212 | 
  213 |     const response = await this.page.request.patch(`${apiBase}/invoice/${invoiceId}?${params}`, {
  214 |       data: { status: 'reversed' },
  215 |       headers: {
  216 |         'x-company': 'smoke test',
  217 |         'Authorization': token ? `Bearer ${token}` : '',
  218 |         'Content-Type': 'application/json'
  219 |       }
  220 |     });
  221 | 
  222 |     if (!response.ok()) {
  223 |       console.error(`[ERROR] Reversal API failed: ${response.status()}`);
  224 |       return false;
  225 |     }
  226 |     console.log(`[SUCCESS] Invoice ${invoiceId} reversed via API`);
  227 |     return true;
  228 |   }
  229 | 
  230 |   async approveInvoiceAPI(invoiceId: string): Promise<boolean> {
  231 |     const apiBase = 'http://157.180.20.112:8001/api';
  232 |     const token = await this._getAuthToken();
  233 |     const params = 'year=2018&period=yearly&calendar=ec';
  234 | 
  235 |     console.log(`[ACTION] Approving Invoice ${invoiceId} via API...`);
  236 |     const response = await this.page.request.patch(`${apiBase}/invoice/${invoiceId}?${params}`, {
  237 |       data: { status: 'approved' },
  238 |       headers: { 'x-company': 'smoke test', 'Authorization': token ? `Bearer ${token}` : '' }
  239 |     });
  240 |     return response.ok();
  241 |   }
  242 | 
  243 |   async createInvoiceReceiptAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
  244 |     const apiBase = 'http://157.180.20.112:8001/api';
  245 |     const cashAccounts = ['9375b986-2772-434e-ada2-b1843e465604', 'f17570eb-6533-4249-8eba-e77a4ea92d43'];
  246 | 
  247 |     const payload = {
  248 |       amount: data.amount,
  249 |       cash_account_id: cashAccounts[Math.floor(Math.random() * cashAccounts.length)],
  250 |       customer_id: data.customerId, // MUST match the invoice customer
  251 |       date: new Date().toISOString(),
  252 |       payment_method: 'cash',
  253 |       currency_id: '50567982-ee2f-4391-9400-3149067443a5',
  254 |       invoice_receipts: [{
  255 |         amount: data.amount,
  256 |         invoice_id: data.invoiceId // The target invoice UUID
  257 |       }]
  258 |     };
  259 | 
  260 |     const token = await this._getAuthToken();
  261 |     const response = await this.page.request.post(`${apiBase}/receipts?year=2018&period=yearly&calendar=ec`, {
  262 |       data: payload,
  263 |       headers: { 'x-company': 'smoke test', 'Authorization': token ? `Bearer ${token}` : '' }
  264 |     });
  265 | 
  266 |     if (!response.ok()) throw new Error(`Invoice-Receipt API Creation Failed: ${response.status()} - ${await response.text()}`);
```