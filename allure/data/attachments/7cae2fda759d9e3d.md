# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/bill-ui.spec.ts >> Purchase to Bill Flow @purchase @smoke @full >> Create PO via API, approve, create linked bill, verify in vendor profile
- Location: tests/purchase/bill-ui.spec.ts:6:9

# Error details

```
Error: [ERROR] API Verification Failed: Bill BILL/2026/08/03/000300 never appeared in "Gentium Concrite Industry" ledger.
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
  429 |     }
  430 | 
  431 |     return { poQty, receivedQty, remainingQty: poQty - receivedQty };
  432 |   }
  433 | 
  434 |   async createPartialBillFromPoAPI(
  435 |     poId: string,
  436 |     receivedItems: Array<{ po_item_id: string; received_quantity: number; received_unit_price: number }>
  437 |   ): Promise<{ success: boolean; billNumber: string; billId: string; status: number; error?: string }> {
  438 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  439 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  440 |     const token = await this._getAuthToken();
  441 |     const company = process.env.BEFFA_COMPANY as string;
  442 |     const year = process.env.BEFFA_YEAR || '2018';
  443 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  444 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  445 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  446 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  447 | 
  448 |     const poResp = await this.safeGet(`${apiBase}/purchase-order/${poId}?${params}`, { headers });
  449 |     if (!poResp.ok()) throw new Error(`Fetch PO ${poId} failed: ${poResp.status()}`);
  450 |     const poData = await poResp.json();
  451 | 
  452 |     const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  453 |     const acctData = await acctResp.json();
  454 |     const allAccounts = acctData.items || acctData.data || [];
  455 |     const apAccount = allAccounts.find((a: any) => (a.type || a.account_type || '').toLowerCase().includes('payable')) || allAccounts[0];
  456 | 
  457 |     const { DateHelper: _DH } = require('../utils/DateHelper');
  458 |     const _dateIso = (await _DH.resolve(this.page)).iso;
  459 |     const payload = {
  460 |       accounts_payable_id: apAccount?.id,
  461 |       currency_id: poData.currency_id || poData.currency?.id,
  462 |       due_date: _dateIso,
  463 |       invoice_date: _dateIso,
  464 |       items: [],
  465 |       purchase_order_id: poId,
  466 |       vendor_id: poData.vendor_id || poData.vendor?.id,
  467 |       received_purchase_order_items: receivedItems,
  468 |       status: 'draft'
  469 |     };
  470 | 
  471 |     const response = await this.page.request.post(`${apiBase}/bills?${params}`, { data: payload, headers });
  472 |     if (!response.ok()) {
  473 |       return { success: false, billNumber: '', billId: '', status: response.status(), error: await response.text() };
  474 |     }
  475 |     const json = await response.json();
  476 |     return { success: true, billNumber: json.invoice_number, billId: json.id, status: response.status() };
  477 |   }
  478 | 
  479 |   async verifyBillInVendorAPI(vendorName: string, billNumber: string): Promise<boolean> {
  480 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  481 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  482 |     const token = await this._getAuthToken();
  483 |     const company = process.env.BEFFA_COMPANY as string;
  484 |     const year = process.env.BEFFA_YEAR || '2018';
  485 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  486 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  487 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  488 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}` };
  489 | 
  490 |     // 1. Resolve Vendor ID from Name
  491 |     const vendResp = await this.safeGet(`${apiBase}/vendors?page=1&pageSize=50&${params}`, { headers });
  492 |     const vendData = await vendResp.json();
  493 |     const vendor = (vendData.items || vendData.data || []).find((v: any) => v.name.toLowerCase() === vendorName.toLowerCase());
  494 | 
  495 |     if (!vendor) throw new Error(`API Verification Failed: Could not find Vendor "${vendorName}" in the system.`);
  496 |     const vendorId = vendor.id;
  497 | 
  498 |     // 2. Poll Vendor Bills Ledger (max 15 tries for indexing = ~30s)
  499 |     const safeJson = async (resp: any, label: string) => {
  500 |       const text = await resp.text();
  501 |       if (!resp.ok()) return null;
  502 |       try { return JSON.parse(text); } catch (e) { return null; }
  503 |     };
  504 | 
  505 |     for (let i = 0; i < 15; i++) {
  506 |       const billResp = await this.safeGet(`${apiBase}/vendor/${vendorId}/bills?${params}`, { headers });
  507 |       const billData = await safeJson(billResp, 'Vendor Ledger');
  508 |       if (!billData) {
  509 |         console.log(`[WARN] Ledger API busy or returned error. Retrying...`);
  510 |       } else {
  511 |         const bills = billData.data || billData.items || [];
  512 |         const found = bills.find((b: any) =>
  513 |           b.invoice_number === billNumber ||
  514 |           b.bill_no === billNumber ||
  515 |           b.ref === billNumber ||
  516 |           b.bill_number === billNumber ||
  517 |           b.bill_number === billNumber.split('/').pop() ||
  518 |           b.id === billNumber
  519 |         );
  520 |         if (found) {
  521 |           console.log(`[SUCCESS] API Confirmed: Bill ${billNumber} is physically present in ${vendorName}'s ledger.`);
  522 |           return true;
  523 |         }
  524 |       }
  525 |       console.log(`[INFO] Bill not found in ledger yet (Index pending). Attempt ${i + 1}/15. Retrying in 2s...`);
  526 |       await this.page.waitForTimeout(2000);
  527 |     }
  528 | 
> 529 |     throw new Error(`[ERROR] API Verification Failed: Bill ${billNumber} never appeared in "${vendorName}" ledger.`);
      |           ^ Error: [ERROR] API Verification Failed: Bill BILL/2026/08/03/000300 never appeared in "Gentium Concrite Industry" ledger.
  530 |   }
  531 | 
  532 |   private async postPaymentWithCashTopUp(
  533 |     apiBase: string,
  534 |     params: string,
  535 |     headers: Record<string, string>,
  536 |     payload: Record<string, any>,
  537 |     label: string
  538 |   ): Promise<any> {
  539 |     const maxTopUpAttempts = 5;
  540 |     let response = await this.page.request.post(`${apiBase}/payments?${params}`, { data: payload, headers });
  541 | 
  542 |     for (let attempt = 0; !response.ok() && attempt < maxTopUpAttempts; attempt++) {
  543 |       const errText = await response.text();
  544 |       const topUp = this.parseInsufficientCashTopUp(errText);
  545 |       if (response.status() !== 422 || topUp === null) {
  546 |         throw new Error(`${label} failed: ${response.status()} - ${errText}`);
  547 |       }
  548 | 
  549 |       const accountName = this.parseInsufficientCashAccountName(errText);
  550 |       const cashAccountId = await this.resolveCashAccountId(payload.cash_account_id, accountName);
  551 |       payload.cash_account_id = cashAccountId;
  552 | 
  553 |       console.log(`[CASH_TOPUP] ${label}: insufficient balance (attempt ${attempt + 1}/${maxTopUpAttempts}) — topping up ${topUp}...`);
  554 |       await this.seedCashBalanceAPI(topUp, cashAccountId);
  555 |       await this.page.waitForTimeout(6000);
  556 | 
  557 |       response = await this.page.request.post(`${apiBase}/payments?${params}`, { data: payload, headers });
  558 |     }
  559 | 
  560 |     if (response.ok()) return response.json();
  561 |     throw new Error(`${label} failed after ${maxTopUpAttempts} cash top-up attempts: ${response.status()} - ${await response.text()}`);
  562 |   }
  563 | 
  564 |   private parseInsufficientCashAccountName(errorText: string): string | null {
  565 |     const match = errorText.match(/account\s+([^:]+):\s*available/i);
  566 |     return match ? match[1].trim() : null;
  567 |   }
  568 | 
  569 |   private async resolveCashAccountId(preferredId?: string, accountName?: string | null): Promise<string> {
  570 |     const accounts = await this.getAllAccountsAPI();
  571 |     if (accountName) {
  572 |       const byName = accounts.find((a: any) => a.name === accountName);
  573 |       if (byName) return byName.id;
  574 |     }
  575 |     if (preferredId && accounts.some((a: any) => a.id === preferredId)) return preferredId;
  576 |     const typeOf = (a: any) => (a.type || a.account_type || '').toLowerCase();
  577 |     const cashAccount = accounts.find((a: any) =>
  578 |       typeOf(a).includes('cash') || typeOf(a).includes('bank')
  579 |     ) || accounts[0];
  580 |     return cashAccount?.id;
  581 |   }
  582 | 
  583 |   async createBillPaymentAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
  584 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  585 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  586 |     const token = await this._getAuthToken();
  587 |     const company = process.env.BEFFA_COMPANY as string;
  588 |     const year = process.env.BEFFA_YEAR || '2018';
  589 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  590 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  591 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  592 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  593 | 
  594 |     const safeJson = async (resp: any, label: string) => {
  595 |       const text = await resp.text();
  596 |       if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
  597 |       try { return JSON.parse(text); } catch (e) { throw new Error(`${label} invalid JSON: ${text.substring(0, 150)}`); }
  598 |     };
  599 | 
  600 |     // 1. Discover Accounts
  601 |     const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  602 |     const acctData = await safeJson(acctResp, 'Accounts Discovery');
  603 |     const allAccounts = acctData.items || acctData.data || [];
  604 |     const cashAccount = allAccounts.find((a: any) => (a.type || a.account_type || '').toLowerCase().includes('cash') || (a.type || a.account_type || '').toLowerCase().includes('bank')) || allAccounts[0];
  605 | 
  606 |     // 2. Discover Currency
  607 |     const currResp = await this.safeGet(`${apiBase}/currency?${params}`, { headers });
  608 |     const currData = await safeJson(currResp, 'Currency Discovery');
  609 |     const currency = currData.items?.[0] || currData.data?.[0];
  610 | 
  611 |     let resolvedCashAccountId = data.cashAccountId || cashAccount?.id;
  612 | 
  613 |     // In test we sometimes explicitly pass null to trigger validation error
  614 |     if ('cashAccountId' in data && data.cashAccountId === null) {
  615 |       resolvedCashAccountId = null;
  616 |     }
  617 | 
  618 |     const { DateHelper: _DH } = require('../utils/DateHelper');
  619 |     const _dateIso = (await _DH.resolve(this.page)).iso;
  620 |     const payload = {
  621 |       amount: data.amount,
  622 |       cash_account_id: resolvedCashAccountId,
  623 |       vendor_id: data.vendorId, // Tests usually supply this
  624 |       date: _dateIso,
  625 |       payment_method: 'cash',
  626 |       currency_id: currency?.id,
  627 |       bill_payments: [{
  628 |         amount: data.amount,
  629 |         bill_id: data.billId
```