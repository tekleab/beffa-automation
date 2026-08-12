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
	"message": "invoice is already fully paid: invoice INV/2026/08/12/001576 outstanding balance is 100.00 but 1200.00 was applied"
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
  524 | 
  525 |     // Discover Cash Account dynamically if not provided
  526 |     let cashAccountId = data.cashAccountId;
  527 |     if (!cashAccountId) {
  528 |       const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  529 |       if (acctResp.ok()) {
  530 |         const acctData = await acctResp.json();
  531 |         const allAccounts = acctData.items || acctData.data || [];
  532 |         const typeOf = (a: any) => (a.type || a.account_type || '').toLowerCase();
  533 |         const cashAcct = allAccounts.find((a: any) =>
  534 |           typeOf(a).includes('cash') || typeOf(a).includes('bank') ||
  535 |           a.name?.toLowerCase().includes('cash') || a.name?.toLowerCase().includes('petty')
  536 |         ) || allAccounts[0];
  537 |         if (cashAcct) cashAccountId = cashAcct.id;
  538 |       }
  539 |     }
  540 | 
  541 |     // Discover Currency dynamically if not provided
  542 |     let currencyId = data.currencyId;
  543 |     if (!currencyId) {
  544 |       const currResp = await this.safeGet(`${apiBase}/currency?${params}`, { headers });
  545 |       if (currResp.ok()) {
  546 |         const currData = await currResp.json();
  547 |         const currency = currData.items?.[0] || currData.data?.[0];
  548 |         if (currency) currencyId = currency.id;
  549 |       }
  550 |     }
  551 | 
  552 |     const payload = {
  553 |       amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
  554 |       cash_account_id: cashAccountId,
  555 |       customer_id: data.customerId, // MUST match the invoice customer
  556 |       date: data.receiptDate || resolvedDate.iso,
  557 |       payment_method: data.payment_method || 'cash',
  558 |       currency_id: currencyId,
  559 |       invoice_receipts: [{
  560 |         amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
  561 |         invoice_id: data.invoiceId // The target invoice UUID
  562 |       }]
  563 |     };
  564 | 
  565 |     console.log(`[RECEIPT] amount=${payload.amount} | invoice=${data.invoiceId?.substring(0, 8)}... | year=${year}`);
  566 | 
  567 |     // Validate required fields before making the API call
  568 |     if (!cashAccountId) {
  569 |       throw new Error(`Cash account not found. Cannot create receipt without cash account.`);
  570 |     }
  571 |     if (!currencyId) {
  572 |       throw new Error(`Currency not found. Cannot create receipt without currency.`);
  573 |     }
  574 |     if (!data.customerId) {
  575 |       throw new Error(`Customer ID is required for receipt creation.`);
  576 |     }
  577 |     if (!data.invoiceId) {
  578 |       throw new Error(`Invoice ID is required for receipt creation.`);
  579 |     }
  580 |     if (!data.amount || data.amount <= 0) {
  581 |       throw new Error(`Valid amount is required for receipt creation. Received: ${data.amount}`);
  582 |     }
  583 | 
  584 |     // Retry logic for transient 500 errors
  585 |     let lastError = '';
  586 |     for (let attempt = 1; attempt <= 3; attempt++) {
  587 |       try {
  588 |         const response = await this.safePost(`${apiBase}/receipts?${params}`, {
  589 |           data: payload,
  590 |           headers,
  591 |           label: `Create Invoice Receipt (Attempt ${attempt})`
  592 |         }, 30000);
  593 | 
  594 |         if (response.ok()) {
  595 |           const json = await response.json();
  596 |           console.log(`[SUCCESS] Receipt created on attempt ${attempt}:`, json.ref || json.id);
  597 |           return { success: true, ref: json.ref || json.receipt_number || `RCT-${json.id}`, id: json.id };
  598 |         }
  599 | 
  600 |         const errorText = await response.text();
  601 |         lastError = `Attempt ${attempt}: HTTP ${response.status()} - ${errorText}`;
  602 |         console.warn(`[WARN] Receipt creation failed on attempt ${attempt}: ${lastError}`);
  603 | 
  604 |         // If it's a 422 validation error, don't retry
  605 |         if (response.status() === 422) {
  606 |           throw new Error(`Validation Error (422): ${errorText}`);
  607 |         }
  608 | 
  609 |         // Wait before retry
  610 |         if (attempt < 3) {
  611 |           await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
  612 |         }
  613 | 
  614 |       } catch (error) {
  615 |         lastError = `Attempt ${attempt}: ${error}`;
  616 |         console.warn(`[WARN] Receipt creation error on attempt ${attempt}:`, error);
  617 | 
  618 |         if (attempt < 3) {
  619 |           await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
  620 |         }
  621 |       }
  622 |     }
  623 | 
> 624 |     throw new Error(`Invoice-Receipt API Creation Failed after 3 attempts. Last error: ${lastError}`);
      |           ^ Error: Invoice-Receipt API Creation Failed after 3 attempts. Last error: Attempt 3: Error: Validation Error (422): {
  625 |   }
  626 | 
  627 |   async getInvoiceAPI(invoiceId: string): Promise<any> {
  628 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  629 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  630 |     const token = await this._getAuthToken();
  631 |     const year = process.env.BEFFA_YEAR || '2019';
  632 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  633 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  634 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  635 | 
  636 |     const response = await this.safeGet(`${apiBase}/invoice/${invoiceId}?${params}`, {
  637 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
  638 |     });
  639 |     if (!response.ok()) throw new Error(`Failed to fetch Invoice ${invoiceId}: ${response.status()} - ${await response.text().catch(() => 'No Response')}`);
  640 |     return await response.json();
  641 |   }
  642 | 
  643 |   async getCustomerNameAPI(customerId: string): Promise<string> {
  644 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  645 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  646 |     const token = await this._getAuthToken();
  647 |     const year = process.env.BEFFA_YEAR || '2019';
  648 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  649 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  650 |     const qs = `year=${year}&period=${period}&calendar=${calendar}`;
  651 |     const response = await this.safeGet(`${apiBase}/customer/${customerId}?${qs}`, {
  652 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  653 |     });
  654 |     if (!response.ok()) return '';
  655 |     const json = await response.json();
  656 |     return json.name || json.customer_name || '';
  657 |   }
  658 | }
  659 | 
```