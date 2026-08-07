# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-integrity.spec.ts >> Financial Integrity & Boundary Audits @sales @logic @regression @full >> Guardrail: System must prevent receipts against a voided invoice
- Location: tests/sales/so-integrity.spec.ts:128:9

# Error details

```
Error: Standalone Invoice API Creation Failed: 422 - {
	"code": 422,
	"details": {
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
  195 |       const errText = await response.text();
  196 |       console.warn(`[WARN] SO API Creation Failed: ${response.status()} - ${errText}`);
  197 |       return { success: false, ref: '', id: '', customerId: payload.customer_id, soItemId: null, status: response.status(), error: errText };
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
  217 | 
  218 |     const payload = {
  219 |       accounts_receivable_id: data.arAccountId || meta.arAccountId,
  220 |       currency_id: data.currencyId || meta.currencyId,
  221 |       customer_id: data.customerId, // REQUIRED: must match the SO customer
  222 |       invoice_date: data.invoiceDate || resolvedDate.iso,
  223 |       due_date: data.dueDate || resolvedDate.iso,
  224 |       released_sales_order_items: [{
  225 |         so_item_id: data.soItemId, // REQUIRED: from createSalesOrderAPI response
  226 |         released_quantity: data.releasedQuantity || 1,
  227 |         warehouse_id: data.warehouseId || meta.warehouseId,
  228 |         location_id: data.locationId || meta.locationId
  229 |       }],
  230 |       status: 'draft'
  231 |     };
  232 | 
  233 |     const token = await this._getAuthToken();
  234 |     const response = await this.safePost(`${apiBase}/invoices?${params}`, {
  235 |       data: payload,
  236 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' },
  237 |       label: 'Create Invoice'
  238 |     });
  239 | 
  240 |     if (!response.ok()) {
  241 |       const err = await response.text();
  242 |       console.error(`[ERROR] Invoice API Failed: ${response.status()} - ${err}`);
  243 |       return { success: false, status: response.status(), error: err };
  244 |     }
  245 |     const json = await response.json();
  246 |     return { success: true, ref: json.invoice_number, id: json.id };
  247 |   }
  248 | 
  249 |   async createStandaloneInvoiceAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string; amountDue: number; customerId: string }> {
  250 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  251 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  252 |     const year = process.env.BEFFA_YEAR || '2018';
  253 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  254 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  255 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  256 |     
  257 |     // Discover live company environment
  258 |     const meta = await this.discoverMetadataAPI();
  259 |     
  260 |     const custId = data.customerId || meta.customerId;
  261 |     const unitPrice = data.unitPrice || 10993.05;
  262 |     const q = data.quantity || 1;
  263 |     const amount = q * unitPrice;
  264 | 
  265 |     const { DateHelper: _DH } = require('../utils/DateHelper');
  266 |     const _dateIso = (await _DH.resolve(this.page)).iso;
  267 |     const payload: Record<string, any> = {
  268 |       accounts_receivable_id: meta.arAccountId,
  269 |       customer_id: custId,
  270 |       invoice_date: data.invoiceDate || _dateIso,
  271 |       due_date: _dateIso,
  272 |       currency_id: meta.currencyId,
  273 |       items: [{
  274 |         amount: amount,
  275 |         general_ledger_account_id: meta.salesAccountId,
  276 |         item_id: data.itemId,
  277 |         location_id: data.locationId || meta.locationId,
  278 |         quantity: q,
  279 |         unit_price: unitPrice,
  280 |         warehouse_id: data.warehouseId || meta.warehouseId,
  281 |         ...(data.discount_amount && { discount_amount: data.discount_amount }),
  282 |         ...(data.discount_type && { discount_type: data.discount_type })
  283 |       }],
  284 |       released_sales_order_items: []
  285 |       // NOTE: sales_order_id intentionally omitted (null crashes backend)
  286 |     };
  287 | 
  288 |     const token = await this._getAuthToken();
  289 |     const response = await this.safePost(`${apiBase}/invoices?${params}`, {
  290 |       data: payload,
  291 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' },
  292 |       label: 'Standalone Invoice'
  293 |     });
  294 | 
> 295 |     if (!response.ok()) throw new Error(`Standalone Invoice API Creation Failed: ${response.status()} - ${await response.text()}`);
      |                               ^ Error: Standalone Invoice API Creation Failed: 422 - {
  296 |     const json = await response.json();
  297 |     return { success: true, ref: json.invoice_number, id: json.id, amountDue: amount, customerId: custId };
  298 |   }
  299 | 
  300 |   async createReceiptAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
  301 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  302 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  303 |     const token = await this._getAuthToken();
  304 |     const company = process.env.BEFFA_COMPANY as string;
  305 |     const year = process.env.BEFFA_YEAR || '2018';
  306 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  307 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  308 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  309 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  310 | 
  311 |     const safeJson = async (resp: any, label: string) => {
  312 |       const text = await resp.text();
  313 |       if (!resp.ok()) {
  314 |         console.error(`[ERROR] ${label} failed (${resp.status()}): ${text.substring(0, 300)}`);
  315 |         throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
  316 |       }
  317 |       try { return JSON.parse(text); } catch (e) {
  318 |         console.error(`[ERROR] ${label} returned non-JSON (status ${resp.status()}): ${text.substring(0, 300)}`);
  319 |         throw new Error(`${label} returned invalid JSON: ${text.substring(0, 150)}`);
  320 |       }
  321 |     };
  322 | 
  323 |     // 1. Discover Customer
  324 |     const custResp = await this.safeGet(`${apiBase}/customers?page=1&pageSize=10&${params}`, { headers });
  325 |     const custData = await safeJson(custResp, 'Customer Discovery');
  326 |     const customer = custData.items?.[0] || custData.data?.[0];
  327 |     if (!customer) throw new Error('Receipt Discovery Failed: No customers found in this company.');
  328 | 
  329 |     // 2. Discover Business Accounts (Cash + GL)
  330 |     const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  331 |     const acctData = await safeJson(acctResp, 'Business Accounts Discovery');
  332 |     const allAccounts = acctData.items || acctData.data || [];
  333 |     const cashAccount = allAccounts.find((a: any) =>
  334 |       a.account_type?.toLowerCase().includes('cash') || a.account_type?.toLowerCase().includes('bank')
  335 |     ) || allAccounts[0];
  336 |     const glAccount = allAccounts.find((a: any) =>
  337 |       a.account_type?.toLowerCase().includes('receivable')
  338 |     ) || allAccounts[1] || allAccounts[0];
  339 |     if (!cashAccount) throw new Error('Receipt Discovery Failed: No cash/bank accounts found.');
  340 | 
  341 |     // 3. Discover Currency
  342 |     const currResp = await this.safeGet(`${apiBase}/currency?${params}`, { headers });
  343 |     const currData = await safeJson(currResp, 'Currency Discovery');
  344 |     const currency = currData.items?.[0] || currData.data?.[0];
  345 |     if (!currency) throw new Error('Receipt Discovery Failed: No currencies found.');
  346 | 
  347 |     // 4. Discover Tax (optional)
  348 |     let tax: any = null;
  349 |     try {
  350 |       const taxResp = await this.safeGet(`${apiBase}/taxes?${params}`, { headers });
  351 |       if (taxResp.ok()) { const taxData = await taxResp.json(); tax = taxData.items?.[0] || taxData.data?.[0]; }
  352 |     } catch (e) { console.warn('[WARN] Tax Discovery failed — continuing without tax'); }
  353 | 
  354 |     const amount = data.amount || Math.floor(Math.random() * 1500000) + 500000;
  355 | 
  356 |     const payload = {
  357 |       amount,
  358 |       cash_account_id: cashAccount.id,
  359 |       customer_id: customer.id,
  360 |       date: new Date().toISOString(),
  361 |       payment_method: 'cash',
  362 |       currency_id: currency.id,
  363 |       receipt_items: [{
  364 |         amount,
  365 |         general_ledger_account_id: glAccount.id,
  366 |         tax_id: tax?.id || null,
  367 |         unit_price: amount,
  368 |         quantity: 1,
  369 |         description: 'E2E Dynamic Discovery - Speed Track'
  370 |       }]
  371 |     };
  372 | 
  373 |     const response = await this.page.request.post(`${apiBase}/receipts?${params}`, { data: payload, headers });
  374 | 
  375 |     if (!response.ok()) throw new Error(`API Creation Failed: ${response.status()} - ${await response.text()}`);
  376 |     const json = await response.json();
  377 |     return { success: true, ref: json.ref, id: json.id };
  378 |   }
  379 | 
  380 |   async reverseInvoiceAPI(invoiceId: string): Promise<{ id: string; ref: string; voidedStatus: string } | false> {
  381 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  382 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  383 |     const token = await this._getAuthToken();
  384 |     const year = process.env.BEFFA_YEAR || '2018';
  385 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  386 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  387 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  388 |     const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };
  389 | 
  390 |     const response = await this.page.request.patch(`${apiBase}/invoices/${invoiceId}/void?${params}`, {
  391 |       data: { status: 'reversed' },
  392 |       headers
  393 |     });
  394 | 
  395 |     if (!response.ok()) {
```