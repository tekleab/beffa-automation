# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/receipt-load-stress.spec.ts >> Customer Receipt Load & Stress Audits @sales @load @stress @regression @full >> LOAD: Concurrently approving 5 receipts must succeed without database deadlocks
- Location: tests/sales/receipt-load-stress.spec.ts:36:9

# Error details

```
Error: Invoice-Receipt API Creation Failed after 3 attempts. Last error: Attempt 3: Validation Error (422): {
	"code": 422,
	"message": "invoice is already fully paid: invoice INV/2026/08/19/002628 outstanding balance is 100.00 but 1200.00 was applied"
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
  555 |       if (currResp.ok()) {
  556 |         const currData = await currResp.json();
  557 |         const currency = currData.items?.[0] || currData.data?.[0];
  558 |         if (currency) currencyId = currency.id;
  559 |       }
  560 |     }
  561 | 
  562 |     // Discover GL account for receipt_items (required by ERP alongside invoice_receipts)
  563 |     let glAccountId = data.glAccountId;
  564 |     if (!glAccountId) {
  565 |       const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  566 |       if (acctResp.ok()) {
  567 |         const acctData = await acctResp.json();
  568 |         const allAccounts = acctData.items || acctData.data || [];
  569 |         const typeOf = (a: any) => (a.type || a.account_type || '').toLowerCase();
  570 |         const glAcct =
  571 |           allAccounts.find((a: any) => typeOf(a).includes('receivable') || a.name?.toLowerCase().includes('receivable')) ||
  572 |           allAccounts.find((a: any) => typeOf(a).includes('revenue') || typeOf(a).includes('income')) ||
  573 |           allAccounts[1] || allAccounts[0];
  574 |         if (glAcct) glAccountId = glAcct.id;
  575 |       }
  576 |     }
  577 | 
  578 |     const roundedAmount = Math.round(data.amount * 100) / 100;
  579 |     const payload = {
  580 |       amount: roundedAmount,
  581 |       cash_account_id: cashAccountId,
  582 |       customer_id: data.customerId,
  583 |       date: data.receiptDate || resolvedDate.iso,
  584 |       payment_method: data.payment_method || 'cash',
  585 |       currency_id: currencyId,
  586 |       invoice_receipts: [{ amount: roundedAmount, invoice_id: data.invoiceId }],
  587 |       receipt_items: [{
  588 |         amount: roundedAmount,
  589 |         general_ledger_account_id: glAccountId,
  590 |         unit_price: roundedAmount,
  591 |         quantity: 1,
  592 |         description: 'Invoice Receipt'
  593 |       }]
  594 |     };
  595 | 
  596 |     console.log(`[RECEIPT] amount=${roundedAmount} | invoice=${data.invoiceId?.substring(0, 8)}... | year=${year}`);
  597 | 
  598 |     // Validate required fields before making the API call
  599 |     if (!cashAccountId) {
  600 |       throw new Error(`Cash account not found. Cannot create receipt without cash account.`);
  601 |     }
  602 |     if (!currencyId) {
  603 |       throw new Error(`Currency not found. Cannot create receipt without currency.`);
  604 |     }
  605 |     if (!data.customerId) {
  606 |       throw new Error(`Customer ID is required for receipt creation.`);
  607 |     }
  608 |     if (!data.invoiceId) {
  609 |       throw new Error(`Invoice ID is required for receipt creation.`);
  610 |     }
  611 |     if (!data.amount || data.amount <= 0) {
  612 |       throw new Error(`Valid amount is required for receipt creation. Received: ${data.amount}`);
  613 |     }
  614 | 
  615 |     // Retry logic for transient 500 errors
  616 |     let lastError = '';
  617 |     for (let attempt = 1; attempt <= 3; attempt++) {
  618 |       try {
  619 |         const response = await this.safePost(`${apiBase}/receipts?${params}`, {
  620 |           data: payload,
  621 |           headers,
  622 |           label: `Create Invoice Receipt (Attempt ${attempt})`
  623 |         }, 30000);
  624 | 
  625 |         if (response.ok()) {
  626 |           const json = await response.json();
  627 |           console.log(`[SUCCESS] Receipt created on attempt ${attempt}:`, json.ref || json.id);
  628 |           return { success: true, ref: json.ref || json.receipt_number || `RCT-${json.id}`, id: json.id };
  629 |         }
  630 | 
  631 |         const errorText = await response.text();
  632 |         lastError = `Attempt ${attempt}: HTTP ${response.status()} - ${errorText}`;
  633 |         console.warn(`[WARN] Receipt creation failed on attempt ${attempt}: ${lastError}`);
  634 | 
  635 |         // If it's a 422 validation error, don't retry
  636 |         if (response.status() === 422) {
  637 |           throw new Error(`Validation Error (422): ${errorText}`);
  638 |         }
  639 | 
  640 |         // Wait before retry
  641 |         if (attempt < 3) {
  642 |           await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
  643 |         }
  644 | 
  645 |       } catch (error: any) {
  646 |         lastError = `Attempt ${attempt}: ${error.message || error}`;
  647 |         console.warn(`[WARN] Receipt creation error on attempt ${attempt}: ${error.message || error}`);
  648 | 
  649 |         if (attempt < 3) {
  650 |           await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
  651 |         }
  652 |       }
  653 |     }
  654 | 
> 655 |     throw new Error(`Invoice-Receipt API Creation Failed after 3 attempts. Last error: ${lastError}`);
      |           ^ Error: Invoice-Receipt API Creation Failed after 3 attempts. Last error: Attempt 3: Validation Error (422): {
  656 |   }
  657 | 
  658 |   async getInvoiceAPI(invoiceId: string): Promise<any> {
  659 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  660 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  661 |     const token = await this._getAuthToken();
  662 |     const year = process.env.BEFFA_YEAR || '2019';
  663 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  664 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  665 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  666 | 
  667 |     const response = await this.safeGet(`${apiBase}/invoice/${invoiceId}?${params}`, {
  668 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
  669 |     });
  670 |     if (!response.ok()) throw new Error(`Failed to fetch Invoice ${invoiceId}: ${response.status()} - ${await response.text().catch(() => 'No Response')}`);
  671 |     return await response.json();
  672 |   }
  673 | 
  674 |   async getCustomerNameAPI(customerId: string): Promise<string> {
  675 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  676 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  677 |     const token = await this._getAuthToken();
  678 |     const year = process.env.BEFFA_YEAR || '2019';
  679 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  680 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  681 |     const qs = `year=${year}&period=${period}&calendar=${calendar}`;
  682 |     const response = await this.safeGet(`${apiBase}/customer/${customerId}?${qs}`, {
  683 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  684 |     });
  685 |     if (!response.ok()) return '';
  686 |     const json = await response.json();
  687 |     return json.name || json.customer_name || '';
  688 |   }
  689 | }
  690 | 
```