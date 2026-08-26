# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/order-to-cash-e2e.spec.ts >> Order-to-Cash (O2C) Full Integration @cross-module @sales @logic @regression @full >> Full E2E Cycle: SO -> Invoice (Release) -> Receipt -> Ledger & GL Verification
- Location: tests/cross-module/order-to-cash-e2e.spec.ts:45:9

# Error details

```
Error: Invoice-Receipt API Creation Failed after 3 attempts. Last error: Attempt 3: Validation Error (422): {
	"code": 422,
	"message": "invoice is already fully paid: invoice INV/2026/08/26/003436 outstanding balance is 510.00 but 3000.00 was applied"
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
  611 |       if (currResp.ok()) {
  612 |         const currData = await currResp.json();
  613 |         const currency = currData.items?.[0] || currData.data?.[0];
  614 |         if (currency) currencyId = currency.id;
  615 |       }
  616 |     }
  617 | 
  618 |     // Discover GL account for receipt_items (required by ERP alongside invoice_receipts)
  619 |     let glAccountId = data.glAccountId;
  620 |     if (!glAccountId) {
  621 |       const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  622 |       if (acctResp.ok()) {
  623 |         const acctData = await acctResp.json();
  624 |         const allAccounts = acctData.items || acctData.data || [];
  625 |         const typeOf = (a: any) => (a.type || a.account_type || '').toLowerCase();
  626 |         const glAcct =
  627 |           allAccounts.find((a: any) => typeOf(a).includes('receivable') || a.name?.toLowerCase().includes('receivable')) ||
  628 |           allAccounts.find((a: any) => typeOf(a).includes('revenue') || typeOf(a).includes('income')) ||
  629 |           allAccounts[1] || allAccounts[0];
  630 |         if (glAcct) glAccountId = glAcct.id;
  631 |       }
  632 |     }
  633 | 
  634 |     const roundedAmount = Math.round(data.amount * 100) / 100;
  635 |     const payload = {
  636 |       amount: roundedAmount,
  637 |       cash_account_id: cashAccountId,
  638 |       customer_id: data.customerId,
  639 |       date: data.receiptDate || resolvedDate.iso,
  640 |       payment_method: data.payment_method || 'cash',
  641 |       currency_id: currencyId,
  642 |       invoice_receipts: [{ amount: roundedAmount, invoice_id: data.invoiceId }],
  643 |       receipt_items: [{
  644 |         amount: roundedAmount,
  645 |         general_ledger_account_id: glAccountId,
  646 |         unit_price: roundedAmount,
  647 |         quantity: 1,
  648 |         description: 'Invoice Receipt'
  649 |       }]
  650 |     };
  651 | 
  652 |     console.log(`[RECEIPT] amount=${roundedAmount} | invoice=${data.invoiceId?.substring(0, 8)}... | year=${year}`);
  653 | 
  654 |     // Validate required fields before making the API call
  655 |     if (!cashAccountId) {
  656 |       throw new Error(`Cash account not found. Cannot create receipt without cash account.`);
  657 |     }
  658 |     if (!currencyId) {
  659 |       throw new Error(`Currency not found. Cannot create receipt without currency.`);
  660 |     }
  661 |     if (!data.customerId) {
  662 |       throw new Error(`Customer ID is required for receipt creation.`);
  663 |     }
  664 |     if (!data.invoiceId) {
  665 |       throw new Error(`Invoice ID is required for receipt creation.`);
  666 |     }
  667 |     if (!data.amount || data.amount <= 0) {
  668 |       throw new Error(`Valid amount is required for receipt creation. Received: ${data.amount}`);
  669 |     }
  670 | 
  671 |     // Retry logic for transient 500 errors
  672 |     let lastError = '';
  673 |     for (let attempt = 1; attempt <= 3; attempt++) {
  674 |       try {
  675 |         const response = await this.safePost(`${apiBase}/receipts?${params}`, {
  676 |           data: payload,
  677 |           headers,
  678 |           label: `Create Invoice Receipt (Attempt ${attempt})`
  679 |         }, 30000);
  680 | 
  681 |         if (response.ok()) {
  682 |           const json = await response.json();
  683 |           console.log(`[SUCCESS] Receipt created on attempt ${attempt}:`, json.ref || json.id);
  684 |           return { success: true, ref: json.ref || json.receipt_number || `RCT-${json.id}`, id: json.id };
  685 |         }
  686 | 
  687 |         const errorText = await response.text();
  688 |         lastError = `Attempt ${attempt}: HTTP ${response.status()} - ${errorText}`;
  689 |         console.warn(`[WARN] Receipt creation failed on attempt ${attempt}: ${lastError}`);
  690 | 
  691 |         // If it's a 422 validation error, don't retry
  692 |         if (response.status() === 422) {
  693 |           throw new Error(`Validation Error (422): ${errorText}`);
  694 |         }
  695 | 
  696 |         // Wait before retry
  697 |         if (attempt < 3) {
  698 |           await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
  699 |         }
  700 | 
  701 |       } catch (error: any) {
  702 |         lastError = `Attempt ${attempt}: ${error.message || error}`;
  703 |         console.warn(`[WARN] Receipt creation error on attempt ${attempt}: ${error.message || error}`);
  704 | 
  705 |         if (attempt < 3) {
  706 |           await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
  707 |         }
  708 |       }
  709 |     }
  710 | 
> 711 |     throw new Error(`Invoice-Receipt API Creation Failed after 3 attempts. Last error: ${lastError}`);
      |           ^ Error: Invoice-Receipt API Creation Failed after 3 attempts. Last error: Attempt 3: Validation Error (422): {
  712 |   }
  713 | 
  714 |   async getInvoiceAPI(invoiceId: string): Promise<any> {
  715 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  716 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  717 |     const token = await this._getAuthToken();
  718 |     const year = process.env.BEFFA_YEAR || '2019';
  719 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  720 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  721 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  722 | 
  723 |     const response = await this.safeGet(`${apiBase}/invoice/${invoiceId}?${params}`, {
  724 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
  725 |     });
  726 |     if (!response.ok()) throw new Error(`Failed to fetch Invoice ${invoiceId}: ${response.status()} - ${await response.text().catch(() => 'No Response')}`);
  727 |     return await response.json();
  728 |   }
  729 | 
  730 |   async getCustomerNameAPI(customerId: string): Promise<string> {
  731 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  732 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  733 |     const token = await this._getAuthToken();
  734 |     const year = process.env.BEFFA_YEAR || '2019';
  735 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  736 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  737 |     const qs = `year=${year}&period=${period}&calendar=${calendar}`;
  738 |     const response = await this.safeGet(`${apiBase}/customer/${customerId}?${qs}`, {
  739 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  740 |     });
  741 |     if (!response.ok()) return '';
  742 |     const json = await response.json();
  743 |     return json.name || json.customer_name || '';
  744 |   }
  745 | }
  746 | 
```