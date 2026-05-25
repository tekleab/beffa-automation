# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/accounting-flow-logic.spec.ts >> Accounting & Ledger Flow Logic Audits @sales @logic @regression @full >> Guardrail: System must prevent double-dip overpayments across multi-link receipts
- Location: tests/sales/accounting-flow-logic.spec.ts:154:9

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
  410 |     return true;
  411 |   }
  412 | 
  413 |   async reverseReceiptAPI(receiptId: string): Promise<boolean> {
  414 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
  415 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  416 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  417 |     const token = await this._getAuthToken();
  418 |     const year = process.env.BEFFA_YEAR || '2018';
  419 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  420 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  421 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  422 | 
  423 |     const response = await this.page.request.patch(`${apiBase}/receipts/${receiptId}/void?${params}`, {
  424 |       data: { status: 'reversed' },
  425 |       headers: {
  426 |         'x-company': process.env.BEFFA_COMPANY as string,
  427 |         'Authorization': token ? `Bearer ${token}` : '',
  428 |         'Content-Type': 'application/json'
  429 |       }
  430 |     });
  431 | 
  432 |     if (!response.ok()) {
  433 |       const err = await response.text();
  434 |       console.error(`[ERROR] Receipt Reversal API failed (${response.status()}): ${err}`);
  435 |       return false;
  436 |     }
  437 |     console.log(`[SUCCESS] Receipt ${receiptId} reversed via API /void endpoint`);
  438 |     return true;
  439 |   }
  440 | 
  441 |   async approveInvoiceAPI(invoiceId: string): Promise<boolean> {
  442 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
  443 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  444 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  445 |     const token = await this._getAuthToken();
  446 |     const year = process.env.BEFFA_YEAR || '2018';
  447 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  448 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  449 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  450 | 
  451 |     console.log(`[ACTION] Approving Invoice ${invoiceId} via API...`);
  452 |     const response = await this.page.request.patch(`${apiBase}/invoice/${invoiceId}?${params}`, {
  453 |       data: { status: 'approved' },
  454 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
  455 |     });
  456 |     return response.ok();
  457 |   }
  458 | 
  459 |   async createInvoiceReceiptAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
  460 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
  461 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  462 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  463 |     const token = await this._getAuthToken();
  464 |     const year = process.env.BEFFA_YEAR || '2018';
  465 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  466 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  467 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  468 |     const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' };
  469 | 
  470 |     // Discover Cash Account dynamically if not provided
  471 |     let cashAccountId = data.cashAccountId;
  472 |     if (!cashAccountId) {
  473 |       const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  474 |       if (acctResp.ok()) {
  475 |         const acctData = await acctResp.json();
  476 |         const allAccounts = acctData.items || acctData.data || [];
  477 |         const cashAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('cash') || a.account_type?.toLowerCase().includes('bank')) || allAccounts[0];
  478 |         if (cashAcct) cashAccountId = cashAcct.id;
  479 |       }
  480 |     }
  481 | 
  482 |     // Discover Currency dynamically if not provided
  483 |     let currencyId = data.currencyId;
  484 |     if (!currencyId) {
  485 |       const currResp = await this.page.request.get(`${apiBase}/currency?${params}`, { headers });
  486 |       if (currResp.ok()) {
  487 |         const currData = await currResp.json();
  488 |         const currency = currData.items?.[0] || currData.data?.[0];
  489 |         if (currency) currencyId = currency.id;
  490 |       }
  491 |     }
  492 | 
  493 |     const payload = {
  494 |       amount: data.amount,
  495 |       cash_account_id: cashAccountId,
  496 |       customer_id: data.customerId, // MUST match the invoice customer
  497 |       date: new Date().toISOString(),
  498 |       payment_method: 'cash',
  499 |       currency_id: currencyId,
  500 |       invoice_receipts: [{
  501 |         amount: data.amount,
  502 |         invoice_id: data.invoiceId // The target invoice UUID
  503 |       }]
  504 |     };
  505 | 
  506 |     const response = await this.page.request.post(`${apiBase}/receipts?${params}`, {
  507 |       data: payload,
  508 |       headers
  509 |     });
> 510 |     if (!response.ok()) throw new Error(`Invoice-Receipt API Creation Failed: ${response.status()} - ${await response.text()}`);
      |                               ^ Error: Invoice-Receipt API Creation Failed: 500 - {
  511 |     const json = await response.json();
  512 |     console.log(`[SUCCESS] Receipt created via API: ${json.ref} (ID: ${json.id}) for Invoice ${data.invoiceId}`);
  513 |     return { success: true, ref: json.ref, id: json.id };
  514 |   }
  515 | 
  516 |   async getInvoiceAPI(invoiceId: string): Promise<any> {
  517 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
  518 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  519 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  520 |     const token = await this._getAuthToken();
  521 |     const year = process.env.BEFFA_YEAR || '2018';
  522 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  523 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  524 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  525 | 
  526 |     const response = await this.page.request.get(`${apiBase}/invoice/${invoiceId}?${params}`, {
  527 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
  528 |     });
  529 |     if (!response.ok()) throw new Error(`Failed to fetch Invoice ${invoiceId}: ${response.status()} - ${await response.text().catch(() => 'No Response')}`);
  530 |     return await response.json();
  531 |   }
  532 | 
  533 |   async getCustomerNameAPI(customerId: string): Promise<string> {
  534 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
  535 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  536 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  537 |     const token = await this._getAuthToken();
  538 |     const response = await this.page.request.get(`${apiBase}/customers?search=${customerId}`, {
  539 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  540 |     });
  541 |     if (!response.ok()) return 'System Customer';
  542 |     const json = await response.json();
  543 |     const name = json.items?.[0]?.name || 'System Customer';
  544 |     return name;
  545 |   }
  546 | }
  547 | 
```