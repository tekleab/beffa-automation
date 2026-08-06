# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/sales-customer-balance-ui.spec.ts >> Sales Customer Balance UI Audits @sales @smoke @full >> UI Audit: Approved invoice reflects outstanding balance in customer profile
- Location: tests/sales/sales-customer-balance-ui.spec.ts:17:9

# Error details

```
Error: Standalone Invoice API Creation Failed: 422 - {
	"code": 422,
	"details": {
		"items.0.location_id": [
			"Location not found or not linked to this warehouse."
		],
		"items.0.quantity": [
			"Insufficient stock. Available: 0, required: 1.00"
		]
	},
	"message": "Validation error when creating invoice"
}

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
  198 |     }
  199 |     const json = await response.json();
  200 |     const soItemId = json.so_items?.[0]?.id || null;
  201 |     return { success: true, ref: json.so_number, id: json.id, customerId: payload.customer_id, soItemId };
  202 |   }
  203 | 
  204 |   async createInvoiceAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref?: string; id?: string; status?: number; error?: string }> {
  205 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  206 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  207 |     const year = process.env.BEFFA_YEAR || '2018';
  208 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  209 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  210 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  211 | 
  212 |     // Discover live company environment
  213 |     const meta = await this.discoverMetadataAPI();
  214 | 
  215 |     const { DateHelper } = require('../utils/DateHelper');
  216 |     const resolvedDate = await DateHelper.resolve(this.page);
  217 |     const dueDate = new Date(resolvedDate.gcDate);
  218 |     dueDate.setUTCDate(resolvedDate.gcDate.getUTCDate() + 30);
  219 |     const dueDateIso = dueDate.toISOString().split('T')[0] + 'T00:00:00Z';
  220 | 
  221 |     const payload = {
  222 |       accounts_receivable_id: data.arAccountId || meta.arAccountId,
  223 |       currency_id: data.currencyId || meta.currencyId,
  224 |       customer_id: data.customerId, // REQUIRED: must match the SO customer
  225 |       invoice_date: data.invoiceDate || resolvedDate.iso,
  226 |       due_date: data.dueDate || dueDateIso,
  227 |       released_sales_order_items: [{
  228 |         so_item_id: data.soItemId, // REQUIRED: from createSalesOrderAPI response
  229 |         released_quantity: data.releasedQuantity || 1,
  230 |         warehouse_id: data.warehouseId || meta.warehouseId,
  231 |         location_id: data.locationId || meta.locationId
  232 |       }],
  233 |       status: 'draft'
  234 |     };
  235 | 
  236 |     const token = await this._getAuthToken();
  237 |     const response = await this.safePost(`${apiBase}/invoices?${params}`, {
  238 |       data: payload,
  239 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' },
  240 |       label: 'Create Invoice'
  241 |     });
  242 | 
  243 |     if (!response.ok()) {
  244 |       const err = await response.text();
  245 |       console.error(`[ERROR] Invoice API Failed: ${response.status()} - ${err}`);
  246 |       return { success: false, status: response.status(), error: err };
  247 |     }
  248 |     const json = await response.json();
  249 |     return { success: true, ref: json.invoice_number, id: json.id };
  250 |   }
  251 | 
  252 |   async createStandaloneInvoiceAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string; amountDue: number; customerId: string }> {
  253 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  254 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  255 |     const year = process.env.BEFFA_YEAR || '2018';
  256 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  257 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  258 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  259 |     
  260 |     // Discover live company environment
  261 |     const meta = await this.discoverMetadataAPI();
  262 |     
  263 |     const custId = data.customerId || meta.customerId;
  264 |     const unitPrice = data.unitPrice || 10993.05;
  265 |     const q = data.quantity || 1;
  266 |     const amount = q * unitPrice;
  267 | 
  268 |     const { DateHelper: _DH } = require('../utils/DateHelper');
  269 |     const _dateIso = (await _DH.resolve(this.page)).iso;
  270 |     const payload: Record<string, any> = {
  271 |       accounts_receivable_id: meta.arAccountId,
  272 |       customer_id: custId,
  273 |       invoice_date: data.invoiceDate || _dateIso,
  274 |       due_date: _dateIso,
  275 |       currency_id: meta.currencyId,
  276 |       items: [{
  277 |         amount: amount,
  278 |         general_ledger_account_id: meta.salesAccountId,
  279 |         item_id: data.itemId,
  280 |         location_id: data.locationId || meta.locationId,
  281 |         quantity: q,
  282 |         unit_price: unitPrice,
  283 |         warehouse_id: data.warehouseId || meta.warehouseId,
  284 |         ...(data.discount_amount && { discount_amount: data.discount_amount }),
  285 |         ...(data.discount_type && { discount_type: data.discount_type })
  286 |       }],
  287 |       released_sales_order_items: []
  288 |       // NOTE: sales_order_id intentionally omitted (null crashes backend)
  289 |     };
  290 | 
  291 |     const token = await this._getAuthToken();
  292 |     const response = await this.safePost(`${apiBase}/invoices?${params}`, {
  293 |       data: payload,
  294 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' },
  295 |       label: 'Standalone Invoice'
  296 |     });
  297 | 
> 298 |     if (!response.ok()) throw new Error(`Standalone Invoice API Creation Failed: ${response.status()} - ${await response.text()}`);
      |                               ^ Error: Standalone Invoice API Creation Failed: 422 - {
  299 |     const json = await response.json();
  300 |     return { success: true, ref: json.invoice_number, id: json.id, amountDue: amount, customerId: custId };
  301 |   }
  302 | 
  303 |   async createReceiptAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
  304 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  305 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  306 |     const token = await this._getAuthToken();
  307 |     const company = process.env.BEFFA_COMPANY as string;
  308 |     const year = process.env.BEFFA_YEAR || '2018';
  309 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  310 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  311 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  312 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  313 | 
  314 |     const safeJson = async (resp: any, label: string) => {
  315 |       const text = await resp.text();
  316 |       if (!resp.ok()) {
  317 |         console.error(`[ERROR] ${label} failed (${resp.status()}): ${text.substring(0, 300)}`);
  318 |         throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
  319 |       }
  320 |       try { return JSON.parse(text); } catch (e) {
  321 |         console.error(`[ERROR] ${label} returned non-JSON (status ${resp.status()}): ${text.substring(0, 300)}`);
  322 |         throw new Error(`${label} returned invalid JSON: ${text.substring(0, 150)}`);
  323 |       }
  324 |     };
  325 | 
  326 |     // 1. Discover Customer
  327 |     const custResp = await this.safeGet(`${apiBase}/customers?page=1&pageSize=10&${params}`, { headers });
  328 |     const custData = await safeJson(custResp, 'Customer Discovery');
  329 |     const customer = custData.items?.[0] || custData.data?.[0];
  330 |     if (!customer) throw new Error('Receipt Discovery Failed: No customers found in this company.');
  331 | 
  332 |     // 2. Discover Business Accounts (Cash + GL)
  333 |     const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  334 |     const acctData = await safeJson(acctResp, 'Business Accounts Discovery');
  335 |     const allAccounts = acctData.items || acctData.data || [];
  336 |     const cashAccount = allAccounts.find((a: any) =>
  337 |       a.account_type?.toLowerCase().includes('cash') || a.account_type?.toLowerCase().includes('bank')
  338 |     ) || allAccounts[0];
  339 |     const glAccount = allAccounts.find((a: any) =>
  340 |       a.account_type?.toLowerCase().includes('receivable')
  341 |     ) || allAccounts[1] || allAccounts[0];
  342 |     if (!cashAccount) throw new Error('Receipt Discovery Failed: No cash/bank accounts found.');
  343 | 
  344 |     // 3. Discover Currency
  345 |     const currResp = await this.safeGet(`${apiBase}/currency?${params}`, { headers });
  346 |     const currData = await safeJson(currResp, 'Currency Discovery');
  347 |     const currency = currData.items?.[0] || currData.data?.[0];
  348 |     if (!currency) throw new Error('Receipt Discovery Failed: No currencies found.');
  349 | 
  350 |     // 4. Discover Tax (optional)
  351 |     let tax: any = null;
  352 |     try {
  353 |       const taxResp = await this.safeGet(`${apiBase}/taxes?${params}`, { headers });
  354 |       if (taxResp.ok()) { const taxData = await taxResp.json(); tax = taxData.items?.[0] || taxData.data?.[0]; }
  355 |     } catch (e) { console.warn('[WARN] Tax Discovery failed — continuing without tax'); }
  356 | 
  357 |     const amount = data.amount || Math.floor(Math.random() * 1500000) + 500000;
  358 | 
  359 |     const payload = {
  360 |       amount,
  361 |       cash_account_id: cashAccount.id,
  362 |       customer_id: customer.id,
  363 |       date: new Date().toISOString(),
  364 |       payment_method: 'cash',
  365 |       currency_id: currency.id,
  366 |       receipt_items: [{
  367 |         amount,
  368 |         general_ledger_account_id: glAccount.id,
  369 |         tax_id: tax?.id || null,
  370 |         unit_price: amount,
  371 |         quantity: 1,
  372 |         description: 'E2E Dynamic Discovery - Speed Track'
  373 |       }]
  374 |     };
  375 | 
  376 |     const response = await this.page.request.post(`${apiBase}/receipts?${params}`, { data: payload, headers });
  377 | 
  378 |     if (!response.ok()) throw new Error(`API Creation Failed: ${response.status()} - ${await response.text()}`);
  379 |     const json = await response.json();
  380 |     return { success: true, ref: json.ref, id: json.id };
  381 |   }
  382 | 
  383 |   async reverseInvoiceAPI(invoiceId: string): Promise<{ id: string; ref: string; voidedStatus: string } | false> {
  384 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  385 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  386 |     const token = await this._getAuthToken();
  387 |     const year = process.env.BEFFA_YEAR || '2018';
  388 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  389 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  390 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  391 |     const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };
  392 | 
  393 |     const response = await this.page.request.patch(`${apiBase}/invoices/${invoiceId}/void?${params}`, {
  394 |       data: { status: 'reversed' },
  395 |       headers
  396 |     });
  397 | 
  398 |     if (!response.ok()) {
```