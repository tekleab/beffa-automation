# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/purchase-bill-payment-api.spec.ts >> Bill-to-Payment API Flow @regression >> Create Bill via API, Approve via UI, Pay via API then Verify
- Location: tests/purchase/purchase-bill-payment-api.spec.ts:6:9

# Error details

```
Error: Failed to fetch Bill undefined: 404
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e9]:
        - img [ref=e10]
        - generic [ref=e11]: Enterprise
      - generic [ref=e13]:
        - generic:
          - img
        - textbox "Search tasks" [ref=e14]
      - generic [ref=e15]:
        - navigation [ref=e17]:
          - link "Dashboard" [ref=e18] [cursor=pointer]:
            - /url: /dashboard
            - paragraph [ref=e21]: Dashboard
        - generic [ref=e23] [cursor=pointer]:
          - paragraph [ref=e26]: Accounting
          - paragraph [ref=e27]:
            - button "Toggle section" [ref=e28]:
              - img [ref=e29]
        - generic [ref=e32] [cursor=pointer]:
          - paragraph [ref=e35]: Account Reconciliation
          - paragraph [ref=e36]:
            - button "Toggle section" [ref=e37]:
              - img [ref=e38]
        - generic [ref=e41] [cursor=pointer]:
          - paragraph [ref=e44]: CRM
          - paragraph [ref=e45]:
            - button "Toggle section" [ref=e46]:
              - img [ref=e47]
        - generic [ref=e50] [cursor=pointer]:
          - paragraph [ref=e53]: HRM
          - paragraph [ref=e54]:
            - button "Toggle section" [ref=e55]:
              - img [ref=e56]
        - generic [ref=e59] [cursor=pointer]:
          - paragraph [ref=e62]: Project Management
          - paragraph [ref=e63]:
            - button "Toggle section" [ref=e64]:
              - img [ref=e65]
        - generic [ref=e68] [cursor=pointer]:
          - paragraph [ref=e71]: SCM
          - paragraph [ref=e72]:
            - button "Toggle section" [ref=e73]:
              - img [ref=e74]
        - generic [ref=e77] [cursor=pointer]:
          - paragraph [ref=e80]: Lease Management
          - paragraph [ref=e81]:
            - button "Toggle section" [ref=e82]:
              - img [ref=e83]
        - generic [ref=e86] [cursor=pointer]:
          - paragraph [ref=e89]: Service Management
          - paragraph [ref=e90]:
            - button "Toggle section" [ref=e91]:
              - img [ref=e92]
        - generic [ref=e95] [cursor=pointer]:
          - paragraph [ref=e98]: Report
          - paragraph [ref=e99]:
            - button "Toggle section" [ref=e100]:
              - img [ref=e101]
      - generic [ref=e103]:
        - button "Settings" [ref=e105] [cursor=pointer]:
          - generic:
            - generic:
              - img
              - paragraph: Settings
        - navigation [ref=e107]:
          - link "User Management" [ref=e109] [cursor=pointer]:
            - /url: /settings/general/users
            - generic [ref=e110]:
              - generic [ref=e111]:
                - img [ref=e112]
                - paragraph [ref=e114]: User Management
              - button [ref=e115]:
                - img [ref=e116]
        - button "Logout" [ref=e118] [cursor=pointer]:
          - img [ref=e120]
          - text: Logout
    - generic [ref=e122]:
      - generic [ref=e123]:
        - generic [ref=e124]:
          - img "smoke test" [ref=e126]: st
          - generic [ref=e127]:
            - button "smoke test" [ref=e128] [cursor=pointer]:
              - generic: smoke test
              - img [ref=e130]
            - generic [ref=e132] [cursor=pointer]:
              - button "Company Detail" [ref=e133]:
                - img [ref=e134]
              - button "Edit Company" [ref=e137]:
                - img [ref=e138]
              - button "Company Detail" [ref=e141]:
                - img [ref=e142]
        - generic [ref=e145]:
          - button "New" [ref=e146] [cursor=pointer]:
            - text: New
            - img [ref=e148]
          - generic [ref=e152] [cursor=pointer]:
            - generic [ref=e153]: "5"
            - img "Notifications" [ref=e154]
          - button "EC" [ref=e157] [cursor=pointer]:
            - img [ref=e158]
            - paragraph [ref=e160]: EC
          - button [ref=e161] [cursor=pointer]:
            - img [ref=e162]
          - generic [ref=e165] [cursor=pointer]:
            - img "System" [ref=e167]: S
            - generic [ref=e168]:
              - generic [ref=e169]: System
              - paragraph [ref=e170]: IT Administrator / User Manager
      - generic [ref=e171]:
        - generic [ref=e172]:
          - generic [ref=e173]:
            - navigation "breadcrumb" [ref=e174]:
              - list [ref=e175]:
                - navigation "breadcrumb" [ref=e176]:
                  - list [ref=e177]:
                    - listitem [ref=e178]:
                      - link "Home" [ref=e179] [cursor=pointer]:
                        - /url: /
                      - text: /
                    - listitem [ref=e180]:
                      - link "Payables" [ref=e181] [cursor=pointer]:
                        - /url: /payables/overview/
                      - text: /
                    - listitem [ref=e182]:
                      - link "Bills" [ref=e183] [cursor=pointer]:
                        - /url: /payables/bills/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=e184]:
                      - link "Detail" [ref=e185] [cursor=pointer]:
                        - /url: /payables/bills/undefined/detail
            - button "2018" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2018"
              - img [ref=e189]
          - generic [ref=e192]:
            - button "Toggle Visibility" [ref=e195] [cursor=pointer]:
              - img [ref=e196]
            - generic [ref=e198]:
              - img [ref=e199]
              - generic [ref=e204]:
                - heading "Resource Not Found!" [level=1] [ref=e205]
                - paragraph [ref=e206]: The resource you are looking for doesn't exist.
              - button "Go back" [ref=e207] [cursor=pointer]:
                - img [ref=e209]
                - text: Go back
        - generic [ref=e212]: BM Technology © 2026
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
  - generic:
    - option "1950"
    - option "1951"
    - option "1952"
    - option "1953"
    - option "1954"
    - option "1955"
    - option "1956"
    - option "1957"
    - option "1958"
    - option "1959"
    - option "1960"
    - option "1961"
    - option "1962"
    - option "1963"
    - option "1964"
    - option "1965"
    - option "1966"
    - option "1967"
    - option "1968"
    - option "1969"
    - option "1970"
    - option "1971"
    - option "1972"
    - option "1973"
    - option "1974"
    - option "1975"
    - option "1976"
    - option "1977"
    - option "1978"
    - option "1979"
    - option "1980"
    - option "1981"
    - option "1982"
    - option "1983"
    - option "1984"
    - option "1985"
    - option "1986"
    - option "1987"
    - option "1988"
    - option "1989"
    - option "1990"
    - option "1991"
    - option "1992"
    - option "1993"
    - option "1994"
    - option "1995"
    - option "1996"
    - option "1997"
    - option "1998"
    - option "1999"
    - option "2000"
    - option "2001"
    - option "2002"
    - option "2003"
    - option "2004"
    - option "2005"
    - option "2006"
    - option "2007"
    - option "2008"
    - option "2009"
    - option "2010"
    - option "2011"
    - option "2012"
    - option "2013"
    - option "2014"
    - option "2015"
    - option "2016"
    - option "2017"
    - option "2018 (open)" [selected]
    - option "2019"
    - option "2020"
    - option "2021"
    - option "2022"
    - option "2023"
    - option "2024"
    - option "2025"
    - option "2026"
    - option "2027"
    - option "2028"
    - option "2029"
    - option "2030"
    - option "2031"
    - option "2032"
    - option "2033"
    - option "2034"
    - option "2035"
    - option "2036"
    - option "2037"
    - option "2038"
    - option "2039"
    - option "2040"
    - option "2041"
    - option "2042"
    - option "2043"
    - option "2044"
    - option "2045"
    - option "2046"
    - option "2047"
    - option "2048"
    - option "2049"
```

# Test source

```ts
  396 |     const vendResp = await this.page.request.get(`${apiBase}/vendors?page=1&pageSize=50&${params}`, { headers });
  397 |     const vendData = await vendResp.json();
  398 |     const vendor = (vendData.items || vendData.data || []).find((v: any) => v.name.toLowerCase() === vendorName.toLowerCase());
  399 |     
  400 |     if (!vendor) throw new Error(`API Verification Failed: Could not find Vendor "${vendorName}" in the system.`);
  401 |     const vendorId = vendor.id;
  402 | 
  403 |     // 2. Poll Vendor Bills Ledger (max 3 tries for indexing)
  404 |     console.log(`[ACTION] API Verifying: Scanning Ledger for ${billNumber}...`);
  405 |     for (let i = 0; i < 3; i++) {
  406 |         const billResp = await this.page.request.get(`${apiBase}/vendor/${vendorId}/bills?${params}`, { headers });
  407 |         const billData = await billResp.json();
  408 |         const bills = billData.data || billData.items || [];
  409 |         
  410 |         const found = bills.find((b: any) => b.invoice_number === billNumber);
  411 |         if (found) {
  412 |             console.log(`[SUCCESS] API Confirmed: Bill ${billNumber} is physically present in ${vendorName}'s ledger.`);
  413 |             return true;
  414 |         }
  415 |         console.log(`[INFO] Bill not found in ledger yet (Index pending). Retrying in 2s...`);
  416 |         await this.page.waitForTimeout(2000);
  417 |     }
  418 | 
  419 |     throw new Error(`[ERROR] API Verification Failed: Bill ${billNumber} never appeared in "${vendorName}" ledger.`);
  420 |   }
  421 | 
  422 |   async createBillPaymentAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
  423 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
  424 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  425 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  426 |     const token = await this._getAuthToken();
  427 |     const company = process.env.BEFFA_COMPANY as string;
  428 |     const year = process.env.BEFFA_YEAR || '2018';
  429 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  430 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  431 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  432 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  433 | 
  434 |     const safeJson = async (resp: any, label: string) => {
  435 |       const text = await resp.text();
  436 |       if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
  437 |       try { return JSON.parse(text); } catch (e) { throw new Error(`${label} invalid JSON: ${text.substring(0, 150)}`); }
  438 |     };
  439 | 
  440 |     // 1. Discover Accounts
  441 |     const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  442 |     const acctData = await safeJson(acctResp, 'Accounts Discovery');
  443 |     const allAccounts = acctData.items || acctData.data || [];
  444 |     const cashAccount = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('cash') || a.account_type?.toLowerCase().includes('bank')) || allAccounts[0];
  445 | 
  446 |     // 2. Discover Currency
  447 |     const currResp = await this.page.request.get(`${apiBase}/currency?${params}`, { headers });
  448 |     const currData = await safeJson(currResp, 'Currency Discovery');
  449 |     const currency = currData.items?.[0] || currData.data?.[0];
  450 | 
  451 |     let resolvedCashAccountId = data.cashAccountId || cashAccount?.id;
  452 |     
  453 |     // In test we sometimes explicitly pass null to trigger validation error
  454 |     if ('cashAccountId' in data && data.cashAccountId === null) {
  455 |       resolvedCashAccountId = null;
  456 |     }
  457 | 
  458 |     const payload = {
  459 |       amount: data.amount,
  460 |       cash_account_id: resolvedCashAccountId,
  461 |       vendor_id: data.vendorId, // Tests usually supply this
  462 |       date: new Date().toISOString(),
  463 |       payment_method: 'cash',
  464 |       currency_id: currency?.id,
  465 |       bill_payments: [{
  466 |         amount: data.amount,
  467 |         bill_id: data.billId
  468 |       }]
  469 |     };
  470 | 
  471 |     console.log(`[ACTION] Creating Bill Payment for ${data.billId} via API (CashAcct: ${resolvedCashAccountId})...`);
  472 |     const response = await this.page.request.post(`${apiBase}/payments?${params}`, {
  473 |       data: payload,
  474 |       headers
  475 |     });
  476 | 
  477 |     if (!response.ok()) throw new Error(`Bill-Payment API Failed: ${response.status()} - ${await response.text()}`);
  478 |     const json = await response.json();
  479 |     console.log(`[SUCCESS] Payment created: ${json.ref} (ID: ${json.id})`);
  480 |     return { success: true, ref: json.ref, id: json.id };
  481 |   }
  482 | 
  483 |   async getBillAPI(billId: string): Promise<any> {
  484 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
  485 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  486 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  487 |     const token = await this._getAuthToken();
  488 |     const year = process.env.BEFFA_YEAR || '2018';
  489 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  490 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  491 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  492 | 
  493 |     const response = await this.page.request.get(`${apiBase}/bill/${billId}?${params}`, {
  494 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
  495 |     });
> 496 |     if (!response.ok()) throw new Error(`Failed to fetch Bill ${billId}: ${response.status()}`);
      |                               ^ Error: Failed to fetch Bill undefined: 404
  497 |     return await response.json();
  498 |   }
  499 | 
  500 |   async getPaymentAPI(paymentId: string): Promise<any> {
  501 |     const token = await this._getAuthToken();
  502 |     const year = process.env.BEFFA_YEAR || '2018';
  503 |     const params = `year=${year}&period=yearly&calendar=ec`;
  504 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
  505 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  506 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  507 |     const response = await this.page.request.get(`${apiBase}/payments/${paymentId}?${params}`, {
  508 |       headers: { 'x-company': process.env.BEFFA_COMPANY || 'smoke test', 'Authorization': `Bearer ${token}` }
  509 |     });
  510 |     return await response.json();
  511 |   }
  512 | 
  513 |   async reverseBillAPI(billId: string): Promise<boolean> {
  514 |     const token = await this._getAuthToken();
  515 |     const year = process.env.BEFFA_YEAR || '2018';
  516 |     const params = `year=${year}&period=yearly&calendar=ec`;
  517 | 
  518 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
  519 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  520 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  521 |     console.log(`[ACTION] Reversing/Voiding Bill ${billId} via API...`);
  522 |     const response = await this.page.request.patch(`${apiBase}/bills/${billId}/void?${params}`, {
  523 |       data: { status: 'reversed' },
  524 |       headers: {
  525 |         'x-company': process.env.BEFFA_COMPANY as string,
  526 |         'Authorization': token ? `Bearer ${token}` : '',
  527 |         'Content-Type': 'application/json'
  528 |       }
  529 |     });
  530 | 
  531 |     if (!response.ok()) {
  532 |       console.error(`[ERROR] Bill Reversal failed (${response.status()}): ${await response.text()}`);
  533 |       return false;
  534 |     }
  535 |     return true;
  536 |   }
  537 | 
  538 |   async approvePaymentAPI(paymentId: string): Promise<boolean> {
  539 |     const token = await this._getAuthToken();
  540 |     const year = process.env.BEFFA_YEAR || '2018';
  541 |     const params = `year=${year}&period=yearly&calendar=ec`;
  542 | 
  543 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
  544 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  545 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  546 |     console.log(`[ACTION] Approving Payment ${paymentId} via API...`);
  547 |     const response = await this.page.request.patch(`${apiBase}/payments/${paymentId}?${params}`, {
  548 |       data: { status: 'approved' },
  549 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
  550 |     });
  551 |     return response.ok();
  552 |   }
  553 | 
  554 |   async findUnpaidBillAPI(): Promise<{ billId: string; billNumber: string; amount: number; vendorId: string; vendorName: string } | null> {
  555 |     const token = await this._getAuthToken();
  556 |     const company = process.env.BEFFA_COMPANY || 'smoke test';
  557 |     const year = process.env.BEFFA_YEAR || '2018';
  558 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  559 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  560 |     const params = `status=approved&year=${year}&period=${period}&calendar=${calendar}`;
  561 |     
  562 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
  563 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  564 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  565 |     console.log(`[ACTION] API Discovery: Scanning for unpaid approved bills in "${company}"...`);
  566 |     const response = await this.page.request.get(`${apiBase}/bills?pageSize=50&${params}`, {
  567 |       headers: { 'x-company': company, 'Authorization': `Bearer ${token}` }
  568 |     });
  569 |     
  570 |     if (!response.ok()) return null;
  571 |     const json = await response.json();
  572 |     const unpaid = (json.data || json.items || []).find((b: any) => parseFloat(b.balance) > 0);
  573 |     
  574 |     if (unpaid) {
  575 |       console.log(`[OK] API Found Bill: ${unpaid.invoice_number} | Balance: ${unpaid.balance} | Vendor: ${unpaid.vendor?.name}`);
  576 |       return {
  577 |         billId: unpaid.id,
  578 |         billNumber: unpaid.invoice_number,
  579 |         amount: parseFloat(unpaid.balance),
  580 |         vendorId: unpaid.vendor_id,
  581 |         vendorName: unpaid.vendor?.name || 'Unknown Vendor'
  582 |       };
  583 |     }
  584 |     return null;
  585 |   }
  586 | 
  587 |   async getBillJournalEntriesAPI(billId: string): Promise<Array<{ accountCode: string; accountName: string; debit: number; credit: number }>> {
  588 |     const json = await this.getBillAPI(billId);
  589 |     const journal = json.purchase_journal;
  590 | 
  591 |     if (!journal || !journal.journal_entries) return [];
  592 | 
  593 |     return journal.journal_entries.map((entry: any) => ({
  594 |       accountCode: entry.account.account_id,
  595 |       accountName: entry.account.name,
  596 |       debit: entry.debit || 0,
```