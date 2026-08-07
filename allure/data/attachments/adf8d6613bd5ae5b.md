# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-doc-integrity.spec.ts >> Sales Document Integrity Guardrails @sales @logic @security @regression @full >> Guardrail: Invoice must reject second receipt after full payment
- Location: tests/sales/so-doc-integrity.spec.ts:30:9

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
  499 |     let cashAccountId = data.cashAccountId;
  500 |     if (!cashAccountId) {
  501 |       const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  502 |       if (acctResp.ok()) {
  503 |         const acctData = await acctResp.json();
  504 |         const allAccounts = acctData.items || acctData.data || [];
  505 |         const cashAcct = allAccounts.find((a: any) => 
  506 |           a.account_type?.toLowerCase().includes('cash') || 
  507 |           a.account_type?.toLowerCase().includes('bank') ||
  508 |           a.name?.toLowerCase().includes('cash') ||
  509 |           a.name?.toLowerCase().includes('petty')
  510 |         ) || allAccounts[0];
  511 |         if (cashAcct) cashAccountId = cashAcct.id;
  512 |       }
  513 |     }
  514 | 
  515 |     // Discover Currency dynamically if not provided
  516 |     let currencyId = data.currencyId;
  517 |     if (!currencyId) {
  518 |       const currResp = await this.safeGet(`${apiBase}/currency?${params}`, { headers });
  519 |       if (currResp.ok()) {
  520 |         const currData = await currResp.json();
  521 |         const currency = currData.items?.[0] || currData.data?.[0];
  522 |         if (currency) currencyId = currency.id;
  523 |       }
  524 |     }
  525 | 
  526 |     const { DateHelper: _DH } = require('../utils/DateHelper');
  527 |     const _dateIso = (await _DH.resolve(this.page)).iso;
  528 |     const payload = {
  529 |       amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
  530 |       cash_account_id: cashAccountId,
  531 |       customer_id: data.customerId, // MUST match the invoice customer
  532 |       date: data.receiptDate || _dateIso,
  533 |       payment_method: data.payment_method || 'cash',
  534 |       currency_id: currencyId,
  535 |       invoice_receipts: [{
  536 |         amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
  537 |         invoice_id: data.invoiceId // The target invoice UUID
  538 |       }]
  539 |     };
  540 | 
  541 |     console.log(`[RECEIPT] amount=${payload.amount} | invoice=${data.invoiceId?.substring(0, 8)}...`);
  542 | 
  543 |     // Validate required fields before making the API call
  544 |     if (!cashAccountId) {
  545 |       throw new Error(`Cash account not found. Cannot create receipt without cash account.`);
  546 |     }
  547 |     if (!currencyId) {
  548 |       throw new Error(`Currency not found. Cannot create receipt without currency.`);
  549 |     }
  550 |     if (!data.customerId) {
  551 |       throw new Error(`Customer ID is required for receipt creation.`);
  552 |     }
  553 |     if (!data.invoiceId) {
  554 |       throw new Error(`Invoice ID is required for receipt creation.`);
  555 |     }
  556 |     if (!data.amount || data.amount <= 0) {
  557 |       throw new Error(`Valid amount is required for receipt creation. Received: ${data.amount}`);
  558 |     }
  559 | 
  560 |     // Retry logic for transient 500 errors
  561 |     let lastError = '';
  562 |     for (let attempt = 1; attempt <= 3; attempt++) {
  563 |       try {
  564 |         const response = await this.page.request.post(`${apiBase}/receipts?${params}`, {
  565 |           data: payload,
  566 |           headers
  567 |         });
  568 |         
  569 |         if (response.ok()) {
  570 |           const json = await response.json();
  571 |           console.log(`[SUCCESS] Receipt created on attempt ${attempt}:`, json.ref || json.id);
  572 |           return { success: true, ref: json.ref || json.receipt_number || `RCT-${json.id}`, id: json.id };
  573 |         }
  574 |         
  575 |         const errorText = await response.text();
  576 |         lastError = `Attempt ${attempt}: HTTP ${response.status()} - ${errorText}`;
  577 |         console.warn(`[WARN] Receipt creation failed on attempt ${attempt}: ${lastError}`);
  578 |         
  579 |         // If it's a 422 validation error, don't retry
  580 |         if (response.status() === 422) {
  581 |           throw new Error(`Validation Error (422): ${errorText}`);
  582 |         }
  583 |         
  584 |         // Wait before retry
  585 |         if (attempt < 3) {
  586 |           await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
  587 |         }
  588 |         
  589 |       } catch (error) {
  590 |         lastError = `Attempt ${attempt}: ${error}`;
  591 |         console.warn(`[WARN] Receipt creation error on attempt ${attempt}:`, error);
  592 |         
  593 |         if (attempt < 3) {
  594 |           await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
  595 |         }
  596 |       }
  597 |     }
  598 |     
> 599 |     throw new Error(`Invoice-Receipt API Creation Failed after 3 attempts. Last error: ${lastError}`);
      |           ^ Error: Invoice-Receipt API Creation Failed after 3 attempts. Last error: Attempt 3: HTTP 500 - {
  600 |   }
  601 | 
  602 |   async getInvoiceAPI(invoiceId: string): Promise<any> {
  603 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  604 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  605 |     const token = await this._getAuthToken();
  606 |     const year = process.env.BEFFA_YEAR || '2018';
  607 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  608 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  609 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  610 | 
  611 |     const response = await this.safeGet(`${apiBase}/invoice/${invoiceId}?${params}`, {
  612 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
  613 |     });
  614 |     if (!response.ok()) throw new Error(`Failed to fetch Invoice ${invoiceId}: ${response.status()} - ${await response.text().catch(() => 'No Response')}`);
  615 |     return await response.json();
  616 |   }
  617 | 
  618 |   async getCustomerNameAPI(customerId: string): Promise<string> {
  619 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  620 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  621 |     const token = await this._getAuthToken();
  622 |     const year = process.env.BEFFA_YEAR || '2018';
  623 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  624 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  625 |     const qs = `year=${year}&period=${period}&calendar=${calendar}`;
  626 |     const response = await this.safeGet(`${apiBase}/customer/${customerId}?${qs}`, {
  627 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  628 |     });
  629 |     if (!response.ok()) return '';
  630 |     const json = await response.json();
  631 |     return json.name || json.customer_name || '';
  632 |   }
  633 | }
  634 | 
```