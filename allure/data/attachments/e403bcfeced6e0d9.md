# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/bill-ui.spec.ts >> Purchase to Bill Flow @purchase @smoke @full >> Create PO via API, approve, create linked bill, verify in vendor profile
- Location: tests/purchase/bill-ui.spec.ts:7:9

# Error details

```
Error: [ERROR] API Verification Failed: Bill BILL/2026/08/07/000571 never appeared in "Gentium Concrite Industry" ledger.
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
  436 |   }
  437 | 
  438 |   async createPartialBillFromPoAPI(
  439 |     poId: string,
  440 |     receivedItems: Array<{ po_item_id: string; received_quantity: number; received_unit_price: number }>
  441 |   ): Promise<{ success: boolean; billNumber: string; billId: string; status: number; error?: string }> {
  442 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  443 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  444 |     const token = await this._getAuthToken();
  445 |     const company = process.env.BEFFA_COMPANY as string;
  446 |     const year = process.env.BEFFA_YEAR || '2018';
  447 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  448 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  449 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  450 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  451 | 
  452 |     const poResp = await this.safeGet(`${apiBase}/purchase-order/${poId}?${params}`, { headers });
  453 |     if (!poResp.ok()) throw new Error(`Fetch PO ${poId} failed: ${poResp.status()}`);
  454 |     const poData = await poResp.json();
  455 | 
  456 |     const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  457 |     const acctData = await acctResp.json();
  458 |     const allAccounts = acctData.items || acctData.data || [];
  459 |     const apAccount = allAccounts.find((a: any) => (a.type || a.account_type || '').toLowerCase().includes('payable')) || allAccounts[0];
  460 | 
  461 |     const { DateHelper: _DH } = require('../utils/DateHelper');
  462 |     const _dateIso = (await _DH.resolve(this.page)).iso;
  463 |     const payload = {
  464 |       accounts_payable_id: apAccount?.id,
  465 |       currency_id: poData.currency_id || poData.currency?.id,
  466 |       due_date: _dateIso,
  467 |       invoice_date: _dateIso,
  468 |       items: [],
  469 |       purchase_order_id: poId,
  470 |       vendor_id: poData.vendor_id || poData.vendor?.id,
  471 |       received_purchase_order_items: receivedItems,
  472 |       status: 'draft'
  473 |     };
  474 | 
  475 |     const response = await this.page.request.post(`${apiBase}/bills?${params}`, { data: payload, headers });
  476 |     if (!response.ok()) {
  477 |       return { success: false, billNumber: '', billId: '', status: response.status(), error: await response.text() };
  478 |     }
  479 |     const json = await response.json();
  480 |     return { success: true, billNumber: json.invoice_number, billId: json.id, status: response.status() };
  481 |   }
  482 | 
  483 |   async verifyBillInVendorAPI(vendorName: string, billNumber: string): Promise<boolean> {
  484 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  485 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  486 |     const token = await this._getAuthToken();
  487 |     const company = process.env.BEFFA_COMPANY as string;
  488 |     // Use DateHelper-resolved year so the ledger query matches the bill's fiscal year
  489 |     const { DateHelper: _VDH } = require('../utils/DateHelper');
  490 |     const _vResolved = await _VDH.resolve(this.page).catch(() => null);
  491 |     const year = _vResolved ? String(_vResolved.ecYear) : (process.env.BEFFA_YEAR || '2018');
  492 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  493 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  494 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  495 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}` };
  496 | 
  497 |     // 1. Resolve Vendor ID from Name
  498 |     const vendResp = await this.safeGet(`${apiBase}/vendors?page=1&pageSize=50&${params}`, { headers });
  499 |     const vendData = await vendResp.json();
  500 |     const vendor = (vendData.items || vendData.data || []).find((v: any) => v.name.toLowerCase() === vendorName.toLowerCase());
  501 | 
  502 |     if (!vendor) throw new Error(`API Verification Failed: Could not find Vendor "${vendorName}" in the system.`);
  503 |     const vendorId = vendor.id;
  504 | 
  505 |     // 2. Poll Vendor Bills Ledger (max 15 tries for indexing = ~30s)
  506 |     const safeJson = async (resp: any, label: string) => {
  507 |       const text = await resp.text();
  508 |       if (!resp.ok()) return null;
  509 |       try { return JSON.parse(text); } catch (e) { return null; }
  510 |     };
  511 | 
  512 |     for (let i = 0; i < 15; i++) {
  513 |       const billResp = await this.safeGet(`${apiBase}/vendor/${vendorId}/bills?${params}`, { headers });
  514 |       const billData = await safeJson(billResp, 'Vendor Ledger');
  515 |       if (!billData) {
  516 |         console.log(`[WARN] Ledger API busy or returned error. Retrying...`);
  517 |       } else {
  518 |         const bills = billData.data || billData.items || [];
  519 |         const found = bills.find((b: any) =>
  520 |           b.invoice_number === billNumber ||
  521 |           b.bill_no === billNumber ||
  522 |           b.ref === billNumber ||
  523 |           b.bill_number === billNumber ||
  524 |           b.bill_number === billNumber.split('/').pop() ||
  525 |           b.id === billNumber
  526 |         );
  527 |         if (found) {
  528 |           console.log(`[SUCCESS] API Confirmed: Bill ${billNumber} is physically present in ${vendorName}'s ledger.`);
  529 |           return true;
  530 |         }
  531 |       }
  532 |       console.log(`[INFO] Bill not found in ledger yet (Index pending). Attempt ${i + 1}/15. Retrying in 2s...`);
  533 |       await this.page.waitForTimeout(2000);
  534 |     }
  535 | 
> 536 |     throw new Error(`[ERROR] API Verification Failed: Bill ${billNumber} never appeared in "${vendorName}" ledger.`);
      |           ^ Error: [ERROR] API Verification Failed: Bill BILL/2026/08/07/000571 never appeared in "Gentium Concrite Industry" ledger.
  537 |   }
  538 | 
  539 |   private async postPaymentWithCashTopUp(
  540 |     apiBase: string,
  541 |     params: string,
  542 |     headers: Record<string, string>,
  543 |     payload: Record<string, any>,
  544 |     label: string
  545 |   ): Promise<any> {
  546 |     const maxTopUpAttempts = 5;
  547 |     let response = await this.page.request.post(`${apiBase}/payments?${params}`, { data: payload, headers });
  548 | 
  549 |     for (let attempt = 0; !response.ok() && attempt < maxTopUpAttempts; attempt++) {
  550 |       const errText = await response.text();
  551 |       const topUp = this.parseInsufficientCashTopUp(errText);
  552 |       if (response.status() !== 422 || topUp === null) {
  553 |         throw new Error(`${label} failed: ${response.status()} - ${errText}`);
  554 |       }
  555 | 
  556 |       const accountName = this.parseInsufficientCashAccountName(errText);
  557 |       const cashAccountId = await this.resolveCashAccountId(payload.cash_account_id, accountName);
  558 |       payload.cash_account_id = cashAccountId;
  559 | 
  560 |       console.log(`[CASH_TOPUP] ${label}: insufficient balance (attempt ${attempt + 1}/${maxTopUpAttempts}) — topping up ${topUp}...`);
  561 |       await this.seedCashBalanceAPI(topUp, cashAccountId);
  562 |       await this.page.waitForTimeout(6000);
  563 | 
  564 |       response = await this.page.request.post(`${apiBase}/payments?${params}`, { data: payload, headers });
  565 |     }
  566 | 
  567 |     if (response.ok()) return response.json();
  568 |     throw new Error(`${label} failed after ${maxTopUpAttempts} cash top-up attempts: ${response.status()} - ${await response.text()}`);
  569 |   }
  570 | 
  571 |   private parseInsufficientCashAccountName(errorText: string): string | null {
  572 |     const match = errorText.match(/account\s+([^:]+):\s*available/i);
  573 |     return match ? match[1].trim() : null;
  574 |   }
  575 | 
  576 |   private async resolveCashAccountId(preferredId?: string, accountName?: string | null): Promise<string> {
  577 |     const accounts = await this.getAllAccountsAPI();
  578 |     if (accountName) {
  579 |       const byName = accounts.find((a: any) => a.name === accountName);
  580 |       if (byName) return byName.id;
  581 |     }
  582 |     if (preferredId && accounts.some((a: any) => a.id === preferredId)) return preferredId;
  583 |     const typeOf = (a: any) => (a.type || a.account_type || '').toLowerCase();
  584 |     const cashAccount = accounts.find((a: any) =>
  585 |       typeOf(a).includes('cash') || typeOf(a).includes('bank')
  586 |     ) || accounts[0];
  587 |     return cashAccount?.id;
  588 |   }
  589 | 
  590 |   async createBillPaymentAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
  591 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  592 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  593 |     const token = await this._getAuthToken();
  594 |     const company = process.env.BEFFA_COMPANY as string;
  595 |     const year = process.env.BEFFA_YEAR || '2018';
  596 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  597 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  598 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  599 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  600 | 
  601 |     const safeJson = async (resp: any, label: string) => {
  602 |       const text = await resp.text();
  603 |       if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
  604 |       try { return JSON.parse(text); } catch (e) { throw new Error(`${label} invalid JSON: ${text.substring(0, 150)}`); }
  605 |     };
  606 | 
  607 |     // 1. Discover Accounts
  608 |     const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  609 |     const acctData = await safeJson(acctResp, 'Accounts Discovery');
  610 |     const allAccounts = acctData.items || acctData.data || [];
  611 |     const cashAccount = allAccounts.find((a: any) => (a.type || a.account_type || '').toLowerCase().includes('cash') || (a.type || a.account_type || '').toLowerCase().includes('bank')) || allAccounts[0];
  612 | 
  613 |     // 2. Discover Currency
  614 |     const currResp = await this.safeGet(`${apiBase}/currency?${params}`, { headers });
  615 |     const currData = await safeJson(currResp, 'Currency Discovery');
  616 |     const currency = currData.items?.[0] || currData.data?.[0];
  617 | 
  618 |     let resolvedCashAccountId = data.cashAccountId || cashAccount?.id;
  619 | 
  620 |     // In test we sometimes explicitly pass null to trigger validation error
  621 |     if ('cashAccountId' in data && data.cashAccountId === null) {
  622 |       resolvedCashAccountId = null;
  623 |     }
  624 | 
  625 |     const { DateHelper: _DH } = require('../utils/DateHelper');
  626 |     const _dateIso = (await _DH.resolve(this.page)).iso;
  627 |     const payload = {
  628 |       amount: data.amount,
  629 |       cash_account_id: resolvedCashAccountId,
  630 |       vendor_id: data.vendorId, // Tests usually supply this
  631 |       date: _dateIso,
  632 |       payment_method: 'cash',
  633 |       currency_id: currency?.id,
  634 |       bill_payments: [{
  635 |         amount: data.amount,
  636 |         bill_id: data.billId
```