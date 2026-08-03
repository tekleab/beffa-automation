# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> RCT-API-03: Receipt full payment → invoice Amount Due = 0
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:490:9

# Error details

```
Error: Invoice-Receipt API Creation Failed after 3 attempts. Last error: Attempt 3: Error: Validation Error (422): {
	"code": 422,
	"message": "invoice is already fully paid: invoice INV/2026/08/03/000309 outstanding balance is 200.00 but 2000.00 was applied"
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
  502 |     let cashAccountId = data.cashAccountId;
  503 |     if (!cashAccountId) {
  504 |       const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  505 |       if (acctResp.ok()) {
  506 |         const acctData = await acctResp.json();
  507 |         const allAccounts = acctData.items || acctData.data || [];
  508 |         const cashAcct = allAccounts.find((a: any) => 
  509 |           a.account_type?.toLowerCase().includes('cash') || 
  510 |           a.account_type?.toLowerCase().includes('bank') ||
  511 |           a.name?.toLowerCase().includes('cash') ||
  512 |           a.name?.toLowerCase().includes('petty')
  513 |         ) || allAccounts[0];
  514 |         if (cashAcct) cashAccountId = cashAcct.id;
  515 |       }
  516 |     }
  517 | 
  518 |     // Discover Currency dynamically if not provided
  519 |     let currencyId = data.currencyId;
  520 |     if (!currencyId) {
  521 |       const currResp = await this.safeGet(`${apiBase}/currency?${params}`, { headers });
  522 |       if (currResp.ok()) {
  523 |         const currData = await currResp.json();
  524 |         const currency = currData.items?.[0] || currData.data?.[0];
  525 |         if (currency) currencyId = currency.id;
  526 |       }
  527 |     }
  528 | 
  529 |     const { DateHelper: _DH } = require('../utils/DateHelper');
  530 |     const _dateIso = (await _DH.resolve(this.page)).iso;
  531 |     const payload = {
  532 |       amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
  533 |       cash_account_id: cashAccountId,
  534 |       customer_id: data.customerId, // MUST match the invoice customer
  535 |       date: data.receiptDate || _dateIso,
  536 |       payment_method: data.payment_method || 'cash',
  537 |       currency_id: currencyId,
  538 |       invoice_receipts: [{
  539 |         amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
  540 |         invoice_id: data.invoiceId // The target invoice UUID
  541 |       }]
  542 |     };
  543 | 
  544 |     console.log(`[RECEIPT] amount=${payload.amount} | invoice=${data.invoiceId?.substring(0, 8)}...`);
  545 | 
  546 |     // Validate required fields before making the API call
  547 |     if (!cashAccountId) {
  548 |       throw new Error(`Cash account not found. Cannot create receipt without cash account.`);
  549 |     }
  550 |     if (!currencyId) {
  551 |       throw new Error(`Currency not found. Cannot create receipt without currency.`);
  552 |     }
  553 |     if (!data.customerId) {
  554 |       throw new Error(`Customer ID is required for receipt creation.`);
  555 |     }
  556 |     if (!data.invoiceId) {
  557 |       throw new Error(`Invoice ID is required for receipt creation.`);
  558 |     }
  559 |     if (!data.amount || data.amount <= 0) {
  560 |       throw new Error(`Valid amount is required for receipt creation. Received: ${data.amount}`);
  561 |     }
  562 | 
  563 |     // Retry logic for transient 500 errors
  564 |     let lastError = '';
  565 |     for (let attempt = 1; attempt <= 3; attempt++) {
  566 |       try {
  567 |         const response = await this.page.request.post(`${apiBase}/receipts?${params}`, {
  568 |           data: payload,
  569 |           headers
  570 |         });
  571 |         
  572 |         if (response.ok()) {
  573 |           const json = await response.json();
  574 |           console.log(`[SUCCESS] Receipt created on attempt ${attempt}:`, json.ref || json.id);
  575 |           return { success: true, ref: json.ref || json.receipt_number || `RCT-${json.id}`, id: json.id };
  576 |         }
  577 |         
  578 |         const errorText = await response.text();
  579 |         lastError = `Attempt ${attempt}: HTTP ${response.status()} - ${errorText}`;
  580 |         console.warn(`[WARN] Receipt creation failed on attempt ${attempt}: ${lastError}`);
  581 |         
  582 |         // If it's a 422 validation error, don't retry
  583 |         if (response.status() === 422) {
  584 |           throw new Error(`Validation Error (422): ${errorText}`);
  585 |         }
  586 |         
  587 |         // Wait before retry
  588 |         if (attempt < 3) {
  589 |           await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
  590 |         }
  591 |         
  592 |       } catch (error) {
  593 |         lastError = `Attempt ${attempt}: ${error}`;
  594 |         console.warn(`[WARN] Receipt creation error on attempt ${attempt}:`, error);
  595 |         
  596 |         if (attempt < 3) {
  597 |           await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
  598 |         }
  599 |       }
  600 |     }
  601 |     
> 602 |     throw new Error(`Invoice-Receipt API Creation Failed after 3 attempts. Last error: ${lastError}`);
      |           ^ Error: Invoice-Receipt API Creation Failed after 3 attempts. Last error: Attempt 3: Error: Validation Error (422): {
  603 |   }
  604 | 
  605 |   async getInvoiceAPI(invoiceId: string): Promise<any> {
  606 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  607 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  608 |     const token = await this._getAuthToken();
  609 |     const year = process.env.BEFFA_YEAR || '2018';
  610 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  611 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  612 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  613 | 
  614 |     const response = await this.safeGet(`${apiBase}/invoice/${invoiceId}?${params}`, {
  615 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
  616 |     });
  617 |     if (!response.ok()) throw new Error(`Failed to fetch Invoice ${invoiceId}: ${response.status()} - ${await response.text().catch(() => 'No Response')}`);
  618 |     return await response.json();
  619 |   }
  620 | 
  621 |   async getCustomerNameAPI(customerId: string): Promise<string> {
  622 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  623 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  624 |     const token = await this._getAuthToken();
  625 |     const year = process.env.BEFFA_YEAR || '2018';
  626 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  627 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  628 |     const qs = `year=${year}&period=${period}&calendar=${calendar}`;
  629 |     const response = await this.safeGet(`${apiBase}/customer/${customerId}?${qs}`, {
  630 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  631 |     });
  632 |     if (!response.ok()) return '';
  633 |     const json = await response.json();
  634 |     return json.name || json.customer_name || '';
  635 |   }
  636 | }
  637 | 
```