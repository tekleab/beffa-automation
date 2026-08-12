# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/receipt-load-stress.spec.ts >> Customer Receipt Load & Stress Audits @sales @load @stress @regression @full >> LOAD: Concurrently approving 5 receipts must succeed without database deadlocks
- Location: tests/sales/receipt-load-stress.spec.ts:36:9

# Error details

```
Error: Invoice-Receipt API Creation Failed after 3 attempts. Last error: Attempt 3: Error: Validation Error (422): {
	"code": 422,
	"message": "invoice is already fully paid: invoice INV/2026/08/12/001485 outstanding balance is 100.00 but 1200.00 was applied"
}

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
  521 |     let cashAccountId = data.cashAccountId;
  522 |     if (!cashAccountId) {
  523 |       const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  524 |       if (acctResp.ok()) {
  525 |         const acctData = await acctResp.json();
  526 |         const allAccounts = acctData.items || acctData.data || [];
  527 |         const typeOf = (a: any) => (a.type || a.account_type || '').toLowerCase();
  528 |         const cashAcct = allAccounts.find((a: any) =>
  529 |           typeOf(a).includes('cash') || typeOf(a).includes('bank') ||
  530 |           a.name?.toLowerCase().includes('cash') || a.name?.toLowerCase().includes('petty')
  531 |         ) || allAccounts[0];
  532 |         if (cashAcct) cashAccountId = cashAcct.id;
  533 |       }
  534 |     }
  535 | 
  536 |     // Discover Currency dynamically if not provided
  537 |     let currencyId = data.currencyId;
  538 |     if (!currencyId) {
  539 |       const currResp = await this.safeGet(`${apiBase}/currency?${params}`, { headers });
  540 |       if (currResp.ok()) {
  541 |         const currData = await currResp.json();
  542 |         const currency = currData.items?.[0] || currData.data?.[0];
  543 |         if (currency) currencyId = currency.id;
  544 |       }
  545 |     }
  546 | 
  547 |     const { DateHelper: _DH } = require('../utils/DateHelper');
  548 |     const _dateIso = (await _DH.resolve(this.page)).iso;
  549 |     const payload = {
  550 |       amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
  551 |       cash_account_id: cashAccountId,
  552 |       customer_id: data.customerId, // MUST match the invoice customer
  553 |       date: data.receiptDate || _dateIso,
  554 |       payment_method: data.payment_method || 'cash',
  555 |       currency_id: currencyId,
  556 |       invoice_receipts: [{
  557 |         amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
  558 |         invoice_id: data.invoiceId // The target invoice UUID
  559 |       }]
  560 |     };
  561 | 
  562 |     console.log(`[RECEIPT] amount=${payload.amount} | invoice=${data.invoiceId?.substring(0, 8)}...`);
  563 | 
  564 |     // Validate required fields before making the API call
  565 |     if (!cashAccountId) {
  566 |       throw new Error(`Cash account not found. Cannot create receipt without cash account.`);
  567 |     }
  568 |     if (!currencyId) {
  569 |       throw new Error(`Currency not found. Cannot create receipt without currency.`);
  570 |     }
  571 |     if (!data.customerId) {
  572 |       throw new Error(`Customer ID is required for receipt creation.`);
  573 |     }
  574 |     if (!data.invoiceId) {
  575 |       throw new Error(`Invoice ID is required for receipt creation.`);
  576 |     }
  577 |     if (!data.amount || data.amount <= 0) {
  578 |       throw new Error(`Valid amount is required for receipt creation. Received: ${data.amount}`);
  579 |     }
  580 | 
  581 |     // Retry logic for transient 500 errors
  582 |     let lastError = '';
  583 |     for (let attempt = 1; attempt <= 3; attempt++) {
  584 |       try {
  585 |         const response = await this.page.request.post(`${apiBase}/receipts?${params}`, {
  586 |           data: payload,
  587 |           headers,
  588 |           timeout: 30000
  589 |         });
  590 | 
  591 |         if (response.ok()) {
  592 |           const json = await response.json();
  593 |           console.log(`[SUCCESS] Receipt created on attempt ${attempt}:`, json.ref || json.id);
  594 |           return { success: true, ref: json.ref || json.receipt_number || `RCT-${json.id}`, id: json.id };
  595 |         }
  596 | 
  597 |         const errorText = await response.text();
  598 |         lastError = `Attempt ${attempt}: HTTP ${response.status()} - ${errorText}`;
  599 |         console.warn(`[WARN] Receipt creation failed on attempt ${attempt}: ${lastError}`);
  600 | 
  601 |         // If it's a 422 validation error, don't retry
  602 |         if (response.status() === 422) {
  603 |           throw new Error(`Validation Error (422): ${errorText}`);
  604 |         }
  605 | 
  606 |         // Wait before retry
  607 |         if (attempt < 3) {
  608 |           await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
  609 |         }
  610 | 
  611 |       } catch (error) {
  612 |         lastError = `Attempt ${attempt}: ${error}`;
  613 |         console.warn(`[WARN] Receipt creation error on attempt ${attempt}:`, error);
  614 | 
  615 |         if (attempt < 3) {
  616 |           await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
  617 |         }
  618 |       }
  619 |     }
  620 | 
> 621 |     throw new Error(`Invoice-Receipt API Creation Failed after 3 attempts. Last error: ${lastError}`);
      |           ^ Error: Invoice-Receipt API Creation Failed after 3 attempts. Last error: Attempt 3: Error: Validation Error (422): {
  622 |   }
  623 | 
  624 |   async getInvoiceAPI(invoiceId: string): Promise<any> {
  625 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  626 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  627 |     const token = await this._getAuthToken();
  628 |     const year = process.env.BEFFA_YEAR || '2018';
  629 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  630 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  631 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  632 | 
  633 |     const response = await this.safeGet(`${apiBase}/invoice/${invoiceId}?${params}`, {
  634 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
  635 |     });
  636 |     if (!response.ok()) throw new Error(`Failed to fetch Invoice ${invoiceId}: ${response.status()} - ${await response.text().catch(() => 'No Response')}`);
  637 |     return await response.json();
  638 |   }
  639 | 
  640 |   async getCustomerNameAPI(customerId: string): Promise<string> {
  641 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  642 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  643 |     const token = await this._getAuthToken();
  644 |     const year = process.env.BEFFA_YEAR || '2018';
  645 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  646 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  647 |     const qs = `year=${year}&period=${period}&calendar=${calendar}`;
  648 |     const response = await this.safeGet(`${apiBase}/customer/${customerId}?${qs}`, {
  649 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  650 |     });
  651 |     if (!response.ok()) return '';
  652 |     const json = await response.json();
  653 |     return json.name || json.customer_name || '';
  654 |   }
  655 | }
  656 | 
```