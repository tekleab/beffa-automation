# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-period-control.spec.ts >> Sales Period Control Edge Cases @sales @security @temporal @regression @full >> Receipt: Reject back-dated Receipt from previous fiscal year (2017)
- Location: tests/sales/so-period-control.spec.ts:175:9

# Error details

```
Error: Invoice-Receipt API Creation Failed after 3 attempts. Last error: Attempt 3: HTTP 500 - {
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
  460 | 
  461 |     // Discover Cash Account dynamically if not provided
  462 |     let cashAccountId = data.cashAccountId;
  463 |     if (!cashAccountId) {
  464 |       const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  465 |       if (acctResp.ok()) {
  466 |         const acctData = await acctResp.json();
  467 |         const allAccounts = acctData.items || acctData.data || [];
  468 |         const cashAcct = allAccounts.find((a: any) => 
  469 |           a.account_type?.toLowerCase().includes('cash') || 
  470 |           a.account_type?.toLowerCase().includes('bank') ||
  471 |           a.name?.toLowerCase().includes('cash') ||
  472 |           a.name?.toLowerCase().includes('petty')
  473 |         ) || allAccounts[0];
  474 |         if (cashAcct) cashAccountId = cashAcct.id;
  475 |       }
  476 |     }
  477 | 
  478 |     // Discover Currency dynamically if not provided
  479 |     let currencyId = data.currencyId;
  480 |     if (!currencyId) {
  481 |       const currResp = await this.page.request.get(`${apiBase}/currency?${params}`, { headers });
  482 |       if (currResp.ok()) {
  483 |         const currData = await currResp.json();
  484 |         const currency = currData.items?.[0] || currData.data?.[0];
  485 |         if (currency) currencyId = currency.id;
  486 |       }
  487 |     }
  488 | 
  489 |     const payload = {
  490 |       amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
  491 |       cash_account_id: cashAccountId,
  492 |       customer_id: data.customerId, // MUST match the invoice customer
  493 |       date: data.receiptDate || new Date().toISOString(),
  494 |       payment_method: data.payment_method || 'cash',
  495 |       currency_id: currencyId,
  496 |       invoice_receipts: [{
  497 |         amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
  498 |         invoice_id: data.invoiceId // The target invoice UUID
  499 |       }]
  500 |     };
  501 | 
  502 |     console.log(`[RECEIPT] amount=${payload.amount} | invoice=${data.invoiceId?.substring(0, 8)}...`);
  503 | 
  504 |     // Validate required fields before making the API call
  505 |     if (!cashAccountId) {
  506 |       throw new Error(`Cash account not found. Cannot create receipt without cash account.`);
  507 |     }
  508 |     if (!currencyId) {
  509 |       throw new Error(`Currency not found. Cannot create receipt without currency.`);
  510 |     }
  511 |     if (!data.customerId) {
  512 |       throw new Error(`Customer ID is required for receipt creation.`);
  513 |     }
  514 |     if (!data.invoiceId) {
  515 |       throw new Error(`Invoice ID is required for receipt creation.`);
  516 |     }
  517 |     if (!data.amount || data.amount <= 0) {
  518 |       throw new Error(`Valid amount is required for receipt creation. Received: ${data.amount}`);
  519 |     }
  520 | 
  521 |     // Retry logic for transient 500 errors
  522 |     let lastError = '';
  523 |     for (let attempt = 1; attempt <= 3; attempt++) {
  524 |       try {
  525 |         const response = await this.page.request.post(`${apiBase}/receipts?${params}`, {
  526 |           data: payload,
  527 |           headers
  528 |         });
  529 |         
  530 |         if (response.ok()) {
  531 |           const json = await response.json();
  532 |           console.log(`[SUCCESS] Receipt created on attempt ${attempt}:`, json.ref || json.id);
  533 |           return { success: true, ref: json.ref || json.receipt_number || `RCT-${json.id}`, id: json.id };
  534 |         }
  535 |         
  536 |         const errorText = await response.text();
  537 |         lastError = `Attempt ${attempt}: HTTP ${response.status()} - ${errorText}`;
  538 |         console.warn(`[WARN] Receipt creation failed on attempt ${attempt}: ${lastError}`);
  539 |         
  540 |         // If it's a 422 validation error, don't retry
  541 |         if (response.status() === 422) {
  542 |           throw new Error(`Validation Error (422): ${errorText}`);
  543 |         }
  544 |         
  545 |         // Wait before retry
  546 |         if (attempt < 3) {
  547 |           await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
  548 |         }
  549 |         
  550 |       } catch (error) {
  551 |         lastError = `Attempt ${attempt}: ${error}`;
  552 |         console.warn(`[WARN] Receipt creation error on attempt ${attempt}:`, error);
  553 |         
  554 |         if (attempt < 3) {
  555 |           await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
  556 |         }
  557 |       }
  558 |     }
  559 |     
> 560 |     throw new Error(`Invoice-Receipt API Creation Failed after 3 attempts. Last error: ${lastError}`);
      |           ^ Error: Invoice-Receipt API Creation Failed after 3 attempts. Last error: Attempt 3: HTTP 500 - {
  561 |   }
  562 | 
  563 |   async getInvoiceAPI(invoiceId: string): Promise<any> {
  564 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  565 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  566 |     const token = await this._getAuthToken();
  567 |     const year = process.env.BEFFA_YEAR || '2018';
  568 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  569 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  570 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  571 | 
  572 |     const response = await this.page.request.get(`${apiBase}/invoice/${invoiceId}?${params}`, {
  573 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
  574 |     });
  575 |     if (!response.ok()) throw new Error(`Failed to fetch Invoice ${invoiceId}: ${response.status()} - ${await response.text().catch(() => 'No Response')}`);
  576 |     return await response.json();
  577 |   }
  578 | 
  579 |   async getCustomerNameAPI(customerId: string): Promise<string> {
  580 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  581 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  582 |     const token = await this._getAuthToken();
  583 |     const year = process.env.BEFFA_YEAR || '2018';
  584 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  585 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  586 |     const qs = `year=${year}&period=${period}&calendar=${calendar}`;
  587 |     const response = await this.page.request.get(`${apiBase}/customer/${customerId}?${qs}`, {
  588 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  589 |     });
  590 |     if (!response.ok()) return '';
  591 |     const json = await response.json();
  592 |     return json.name || json.customer_name || '';
  593 |   }
  594 | }
  595 | 
```