# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/accounting-flow-logic.spec.ts >> Accounting & Ledger Flow Logic Audits @logic @sales >> Audit: System must prevent double-dip overpayments across multi-link receipts
- Location: tests/sales/accounting-flow-logic.spec.ts:155:9

# Error details

```
Error: Invoice-Receipt API Creation Failed: 500 - {
	"code": 500,
	"message": "Internal Server Error"
}

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "sample" [ref=e10]: s
        - generic [ref=e11]:
          - button "sample" [ref=e12] [cursor=pointer]:
            - generic: sample
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
          - img "sample" [ref=e62]: s
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
  382 |   }
  383 | 
  384 |   async reverseInvoiceAPI(invoiceId: string): Promise<boolean> {
  385 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
  386 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  387 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  388 |     const token = await this._getAuthToken();
  389 |     const year = process.env.BEFFA_YEAR || '2018';
  390 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  391 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  392 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  393 | 
  394 |     // Based on user feedback, the reversal action is a PATCH to /api/invoices/:id/void
  395 |     const response = await this.page.request.patch(`${apiBase}/invoices/${invoiceId}/void?${params}`, {
  396 |       data: { status: 'reversed' }, // Some backends ignore body for void, but sending status is safe
  397 |       headers: {
  398 |         'x-company': process.env.BEFFA_COMPANY as string,
  399 |         'Authorization': token ? `Bearer ${token}` : '',
  400 |         'Content-Type': 'application/json'
  401 |       }
  402 |     });
  403 | 
  404 |     if (!response.ok()) {
  405 |       const err = await response.text();
  406 |       console.error(`[ERROR] Reversal API failed (${response.status()}): ${err}`);
  407 |       return false;
  408 |     }
  409 |     console.log(`[SUCCESS] Invoice ${invoiceId} reversed via API /void endpoint`);
  410 |     return true;
  411 |   }
  412 | 
  413 |   async approveInvoiceAPI(invoiceId: string): Promise<boolean> {
  414 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
  415 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  416 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  417 |     const token = await this._getAuthToken();
  418 |     const year = process.env.BEFFA_YEAR || '2018';
  419 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  420 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  421 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  422 | 
  423 |     console.log(`[ACTION] Approving Invoice ${invoiceId} via API...`);
  424 |     const response = await this.page.request.patch(`${apiBase}/invoice/${invoiceId}?${params}`, {
  425 |       data: { status: 'approved' },
  426 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
  427 |     });
  428 |     return response.ok();
  429 |   }
  430 | 
  431 |   async createInvoiceReceiptAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
  432 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
  433 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  434 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  435 |     const token = await this._getAuthToken();
  436 |     const year = process.env.BEFFA_YEAR || '2018';
  437 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  438 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  439 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  440 |     const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' };
  441 | 
  442 |     // Discover Cash Account dynamically if not provided
  443 |     let cashAccountId = data.cashAccountId;
  444 |     if (!cashAccountId) {
  445 |       const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  446 |       if (acctResp.ok()) {
  447 |         const acctData = await acctResp.json();
  448 |         const allAccounts = acctData.items || acctData.data || [];
  449 |         const cashAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('cash') || a.account_type?.toLowerCase().includes('bank')) || allAccounts[0];
  450 |         if (cashAcct) cashAccountId = cashAcct.id;
  451 |       }
  452 |     }
  453 | 
  454 |     // Discover Currency dynamically if not provided
  455 |     let currencyId = data.currencyId;
  456 |     if (!currencyId) {
  457 |       const currResp = await this.page.request.get(`${apiBase}/currency?${params}`, { headers });
  458 |       if (currResp.ok()) {
  459 |         const currData = await currResp.json();
  460 |         const currency = currData.items?.[0] || currData.data?.[0];
  461 |         if (currency) currencyId = currency.id;
  462 |       }
  463 |     }
  464 | 
  465 |     const payload = {
  466 |       amount: data.amount,
  467 |       cash_account_id: cashAccountId,
  468 |       customer_id: data.customerId, // MUST match the invoice customer
  469 |       date: new Date().toISOString(),
  470 |       payment_method: 'cash',
  471 |       currency_id: currencyId,
  472 |       invoice_receipts: [{
  473 |         amount: data.amount,
  474 |         invoice_id: data.invoiceId // The target invoice UUID
  475 |       }]
  476 |     };
  477 | 
  478 |     const response = await this.page.request.post(`${apiBase}/receipts?${params}`, {
  479 |       data: payload,
  480 |       headers
  481 |     });
> 482 |     if (!response.ok()) throw new Error(`Invoice-Receipt API Creation Failed: ${response.status()} - ${await response.text()}`);
      |                               ^ Error: Invoice-Receipt API Creation Failed: 500 - {
  483 |     const json = await response.json();
  484 |     console.log(`[SUCCESS] Receipt created via API: ${json.ref} (ID: ${json.id}) for Invoice ${data.invoiceId}`);
  485 |     return { success: true, ref: json.ref, id: json.id };
  486 |   }
  487 | 
  488 |   async getInvoiceAPI(invoiceId: string): Promise<any> {
  489 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
  490 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  491 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  492 |     const token = await this._getAuthToken();
  493 |     const year = process.env.BEFFA_YEAR || '2018';
  494 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  495 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  496 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  497 | 
  498 |     const response = await this.page.request.get(`${apiBase}/invoice/${invoiceId}?${params}`, {
  499 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
  500 |     });
  501 |     if (!response.ok()) throw new Error(`Failed to fetch Invoice ${invoiceId}: ${response.status()} - ${await response.text().catch(() => 'No Response')}`);
  502 |     return await response.json();
  503 |   }
  504 | 
  505 |   async getCustomerNameAPI(customerId: string): Promise<string> {
  506 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
  507 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  508 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  509 |     const token = await this._getAuthToken();
  510 |     const response = await this.page.request.get(`${apiBase}/customers?search=${customerId}`, {
  511 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  512 |     });
  513 |     if (!response.ok()) return 'System Customer';
  514 |     const json = await response.json();
  515 |     const name = json.items?.[0]?.name || 'System Customer';
  516 |     return name;
  517 |   }
  518 | }
  519 | 
```