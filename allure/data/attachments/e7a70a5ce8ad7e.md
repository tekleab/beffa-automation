# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/purchase-bill-ui-flow.spec.ts >> Purchase to Bill Flow @purchase @smoke @full >> Create PO via UI, approve, create linked bill, verify in vendor profile
- Location: tests/purchase/purchase-bill-ui-flow.spec.ts:6:9

# Error details

```
Error: [ERROR] Failed selection for Vendor
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
          - img "BM Tech" [ref=e126]: BT
          - generic [ref=e127]:
            - button "BM Tech" [ref=e128] [cursor=pointer]:
              - generic: BM Tech
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
          - img "Notifications" [ref=e153] [cursor=pointer]
          - button "EC" [ref=e156] [cursor=pointer]:
            - img [ref=e157]
            - paragraph [ref=e159]: EC
          - button [ref=e160] [cursor=pointer]:
            - img [ref=e161]
          - generic [ref=e164] [cursor=pointer]:
            - img "System" [ref=e166]: S
            - generic [ref=e167]:
              - generic [ref=e168]: System
              - paragraph [ref=e169]: IT Administrator / User Manager
      - generic [ref=e170]:
        - generic [ref=e171]:
          - generic [ref=e172]:
            - navigation "breadcrumb" [ref=e173]:
              - list [ref=e174]:
                - navigation "breadcrumb" [ref=e175]:
                  - list [ref=e176]:
                    - listitem [ref=e177]:
                      - link "Home" [ref=e178] [cursor=pointer]:
                        - /url: /
                      - text: /
                    - listitem [ref=e179]:
                      - link "Payables" [ref=e180] [cursor=pointer]:
                        - /url: /payables/overview/
                      - text: /
                    - listitem [ref=e181]:
                      - link "Purchase Orders" [ref=e182] [cursor=pointer]:
                        - /url: /payables/purchase-orders/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=e183]:
                      - link "New" [ref=e184] [cursor=pointer]:
                        - /url: /payables/purchase-orders/new
            - button "2018" [ref=e186] [cursor=pointer]:
              - generic [ref=e187]: "2018"
              - img [ref=e188]
          - generic [ref=e191]:
            - button "Toggle Visibility" [ref=e194] [cursor=pointer]:
              - img [ref=e195]
            - generic [ref=e198]:
              - generic [ref=e199]:
                - paragraph [ref=e201]: Add Purchase Order
                - generic [ref=e203]:
                  - generic [ref=e204]:
                    - generic [ref=e205]:
                      - group [ref=e206]:
                        - generic [ref=e207]: Purchase Order Number
                        - textbox "Purchase Order Number" [disabled] [ref=e209]:
                          - /placeholder: N/A
                      - paragraph [ref=e210]: PO number is auto-generated
                    - generic [ref=e211]:
                      - generic [ref=e212]: Purchase Order Date
                      - button "ግንቦት 02, 2018" [ref=e214] [cursor=pointer]:
                        - img [ref=e215]
                        - generic [ref=e217]: ግንቦት 02, 2018
                    - group [ref=e218]:
                      - generic [ref=e219]: Discount Term
                      - button "Discount Term selector" [ref=e220]
                    - group [ref=e221]:
                      - generic [ref=e222]: Budget
                      - button "Budget selector" [ref=e223]: Select a budget
                    - group [ref=e224]:
                      - generic [ref=e225]: Payment Term
                      - button "Payment Term selector" [ref=e226]
                  - generic [ref=e227]:
                    - group [ref=e228]:
                      - generic [ref=e229]: Vendor *
                      - button "Vendor selector" [ref=e230]
                    - group [ref=e231]:
                      - generic [ref=e232]: Accounts Payable *
                      - button "Accounts Payable selector" [ref=e233]
                    - group [ref=e234]:
                      - generic [ref=e235]: Purchase Type *
                      - button "Purchase Type selector" [ref=e236]
                    - group [ref=e237]:
                      - generic [ref=e238]: Currency *
                      - button "Currency selector" [ref=e239]: Birr
                - generic [ref=e240]:
                  - generic [ref=e241]:
                    - tablist [ref=e242]:
                      - tab "Purchase Order Items" [selected] [ref=e243] [cursor=pointer]
                      - tab "PO Journal" [ref=e244] [cursor=pointer]
                      - tab "Upload Related Documents" [ref=e245] [cursor=pointer]
                    - button "Line Item" [ref=e247] [cursor=pointer]:
                      - img [ref=e249]
                      - text: Line Item
                  - tabpanel "Purchase Order Items" [ref=e252]:
                    - table [ref=e256]:
                      - rowgroup [ref=e257]:
                        - row "Item Quantity Unit Price Purchase Type Description G/L Account * Project Before Tax * Tax Total" [ref=e258]:
                          - columnheader [ref=e259]
                          - columnheader "Item" [ref=e261]: Item
                          - columnheader "Quantity" [ref=e263]: Quantity
                          - columnheader "Unit Price" [ref=e265]: Unit Price
                          - columnheader "Purchase Type" [ref=e267]: Purchase Type
                          - columnheader "Description" [ref=e269]: Description
                          - columnheader "G/L Account *" [ref=e271]: G/L Account *
                          - columnheader "Project" [ref=e273]: Project
                          - columnheader "Before Tax *" [ref=e275]: Before Tax *
                          - columnheader "Tax" [ref=e277]: Tax
                          - columnheader "Total" [ref=e279]: Total
                          - columnheader [ref=e281]
                      - rowgroup [ref=e283]:
                        - row "No record found" [ref=e284]:
                          - cell "No record found" [ref=e285]:
                            - paragraph [ref=e287]: No record found
                      - rowgroup [ref=e288]:
                        - row "0.00 0.00 0.00" [ref=e289]:
                          - columnheader [ref=e290]
                          - columnheader [ref=e291]
                          - columnheader [ref=e292]
                          - columnheader [ref=e293]
                          - columnheader [ref=e294]
                          - columnheader [ref=e295]
                          - columnheader [ref=e296]
                          - columnheader [ref=e297]
                          - columnheader "0.00" [ref=e298]
                          - columnheader "0.00" [ref=e299]
                          - columnheader "0.00" [ref=e300]
                          - columnheader [ref=e301]
              - group [ref=e303]:
                - button "Add Now" [ref=e304] [cursor=pointer]
                - button [ref=e305] [cursor=pointer]:
                  - generic:
                    - img
        - generic [ref=e306]: BM Technology © 2026
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
  403 |     const dayToSelect = parseInt(dateValue.split('/')[0], 10).toString();
  404 |     console.log(`[ACTION] Filling date ${dateValue} -> Targeting UI day: ${dayToSelect}`);
  405 | 
  406 |     await this.startTacticalTimer(); // Start Tactical UI Timer
  407 | 
  408 |     let btn: Locator;
  409 |     if (typeof labelOrIndex === 'string') {
  410 |       const container = this.page.locator('.chakra-form-control, [role="group"], .flex-col, div')
  411 |         .filter({ has: this.page.getByText(new RegExp(`^${labelOrIndex}\\s*\\*?$`, 'i')) })
  412 |         .filter({ has: this.page.locator('button') })
  413 |         .last();
  414 |       btn = container.locator('button').first();
  415 |     } else {
  416 |       btn = this.page.locator('button:has(span.formatted-date), button.trigger-button').filter({ visible: true }).nth(labelOrIndex);
  417 |     }
  418 | 
  419 |     await btn.click({ force: true });
  420 |     await this.page.waitForTimeout(1000);
  421 | 
  422 |     const popover = this.page.locator('[role="dialog"], [data-slot="popover-content"], [id^="radix-"], .chakra-popover__content').filter({ visible: true }).last();
  423 |     // Use precise button targeting for the day number
  424 |     const dayBtn = popover.locator('button').filter({ hasText: new RegExp(`^${dayToSelect}$`) }).first();
  425 | 
  426 |     if (await dayBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  427 |       await dayBtn.click({ force: true });
  428 |       console.log(`[SUCCESS] Day ${dayToSelect} selected in the current active calendar grid.`);
  429 |     } else {
  430 |       console.log(`[WARN] Day ${dayToSelect} not found in grid. Using fallback type...`);
  431 |       await this.page.keyboard.type(dateValue);
  432 |       await this.page.keyboard.press('Enter');
  433 |     }
  434 |     await this.page.waitForTimeout(1000);
  435 |     await this.stopTacticalTimer(`Fill Date: ${labelOrIndex}`, 'UI');
  436 |   }
  437 | 
  438 |   async pickDate(label: string, dayNum?: number): Promise<void> {
  439 |     const targetDay = dayNum || await this.getActiveCalendarDay();
  440 |     console.log(`[ACTION] Picking date: "${label}" -> Targeting Day ${targetDay}`);
  441 | 
  442 |     await this.startTacticalTimer(); // Start Tactical UI Timer
  443 | 
  444 |     let container = this.page.locator('.chakra-form-control, [role="group"], .flex-col, div')
  445 |       .filter({ has: this.page.getByText(new RegExp(`^${label}\\s*\\*?$`, 'i')) })
  446 |       .filter({ has: this.page.locator('button') })
  447 |       .last();
  448 | 
  449 |     if (!(await container.isVisible().catch(() => false))) {
  450 |       container = this.page.locator('.chakra-form-control, [role="group"], div')
  451 |         .filter({ has: this.page.getByText(new RegExp(`${label}`, 'i')) })
  452 |         .filter({ has: this.page.locator('button') })
  453 |         .last();
  454 |     }
  455 | 
  456 |     const btn = container.locator('button').first();
  457 |     await btn.click({ force: true });
  458 |     await this.page.waitForTimeout(1000);
  459 | 
  460 |     const popover = this.page.locator('[role="dialog"], [data-slot="popover-content"], [id^="radix-"], .chakra-popover__content').filter({ visible: true }).last();
  461 |     const dayBtn = popover.locator('button').filter({ hasText: new RegExp(`^${targetDay}$`) }).first();
  462 | 
  463 |     if (await dayBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  464 |       await dayBtn.click({ force: true });
  465 |       console.log(`[SUCCESS] "${label}" set to Day ${targetDay} (Calendar match).`);
  466 |     } else {
  467 |       console.log(`[WARN] Could not find day ${targetDay}. Fallback to direct key press.`);
  468 |       await this.page.keyboard.type(String(targetDay));
  469 |       await this.page.keyboard.press('Enter');
  470 |       await this.page.keyboard.press('Tab');
  471 |     }
  472 |     await this.page.waitForTimeout(1000);
  473 |     await this.stopTacticalTimer(`Pick Date: ${label}`, 'UI');
  474 |   }
  475 | 
  476 |   async selectRandomOption(selector: Locator, labelName: string, isOptional: boolean = false): Promise<number> {
  477 |     const optionSelector = '[role="checkbox"], .chakra-checkbox, [role="option"], [role="menuitem"], .chakra-menu__menuitem';
  478 | 
  479 |     await this.startTacticalTimer(); // Start Tactical UI Timer
  480 | 
  481 |     for (let i = 0; i < 3; i++) {
  482 |       try {
  483 |         await selector.scrollIntoViewIfNeeded();
  484 |         await selector.click({ timeout: 5000 });
  485 |         await this.page.waitForTimeout(1500);
  486 |         const options = this.page.locator(optionSelector).filter({ visible: true });
  487 |         const count = await options.count();
  488 |         if (count > 0) {
  489 |           const randomIndex = Math.floor(Math.random() * count);
  490 |           const target = options.nth(randomIndex);
  491 |           await target.evaluate((node: HTMLElement) => node.click());
  492 |           await this.page.keyboard.press('Escape');
  493 |           await this.stopTacticalTimer(`Random Selection: ${labelName}`, 'UI');
  494 |           return count;
  495 |         } else {
  496 |           await this.page.keyboard.press('Escape');
  497 |           if (isOptional) return 0;
  498 |         }
  499 |       } catch (e) {
  500 |         await this.page.keyboard.press('Escape');
  501 |       }
  502 |     }
> 503 |     if (!isOptional) throw new Error(`[ERROR] Failed selection for ${labelName}`);
      |                            ^ Error: [ERROR] Failed selection for Vendor
  504 |     return 0;
  505 |   }
  506 | 
  507 |   getTransactionDates(): { soDate: string; invoiceDate: string; dueDate: string } {
  508 |     const today = new Date();
  509 |     const due = new Date();
  510 |     due.setDate(today.getDate() + 30);
  511 |     const fmt = (d: Date) => {
  512 |       const dd = String(d.getDate()).padStart(2, '0');
  513 |       const mm = String(d.getMonth() + 1).padStart(2, '0');
  514 |       const yyyy = d.getFullYear();
  515 |       return `${dd}/${mm}/${yyyy}`;
  516 |     };
  517 |     return { soDate: fmt(today), invoiceDate: fmt(today), dueDate: fmt(due) };
  518 |   }
  519 | 
  520 |   getInvoiceDates(): { invoiceDate: string; dueDate: string } {
  521 |     const today = new Date();
  522 |     const due = new Date();
  523 |     due.setDate(today.getDate() + 30);
  524 |     const fmt = (d: Date) => {
  525 |       const dd = String(d.getDate()).padStart(2, '0');
  526 |       const mm = String(d.getMonth() + 1).padStart(2, '0');
  527 |       return `${dd}/${mm}/${d.getFullYear()}`;
  528 |     };
  529 |     return { invoiceDate: fmt(today), dueDate: fmt(due) };
  530 |   }
  531 | 
  532 |   async getTableColumnMap(selector: string = 'table thead th'): Promise<Record<string, number>> {
  533 |     const headers = this.page.locator(selector);
  534 |     const count = await headers.count();
  535 |     const map: Record<string, number> = {};
  536 |     for (let h = 0; h < count; h++) {
  537 |       const text = (await headers.nth(h).innerText().catch(() => '')).trim().toLowerCase();
  538 |       if (text) map[text] = h;
  539 |     }
  540 |     return map;
  541 |   }
  542 | 
  543 |   async getAccountBalanceAPI(accountId: string, companyOverride?: string): Promise<number> {
  544 |     const token = await this._getAuthToken();
  545 |     const company = companyOverride || await this.page.evaluate(() => localStorage.getItem('currentCompany')) || process.env.BEFFA_COMPANY || 'sample';
  546 |     const year = process.env.BEFFA_YEAR || '2018';
  547 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  548 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  549 | 
  550 |     // Fetch all accounts and filter locally to ensure we find the exact UUID
  551 |     const url = `${this.apiBase}/accounts?page=1&pageSize=1000&year=${year}&period=${period}&calendar=${calendar}`;
  552 | 
  553 |     const response = await this.page.request.get(url, {
  554 |       headers: {
  555 |         'Authorization': `Bearer ${token}`,
  556 |         'x-company': company,
  557 |         'x-role': 'IT Administrator / User Manager'
  558 |       }
  559 |     });
  560 | 
  561 |     if (!response.ok()) {
  562 |       console.log(`[WARN] GL Balance Query Failed. Status: ${response.status()}`);
  563 |       return 0;
  564 |     }
  565 | 
  566 |     const data = await response.json();
  567 |     const list = data.items || data.data || [];
  568 |     const targetAccount = list.find((a: any) => a.id === accountId);
  569 | 
  570 |     if (!targetAccount) {
  571 |       console.log(`[WARN] GL Audit: Account ${accountId} not found in the COA list.`);
  572 |       return 0;
  573 |     }
  574 | 
  575 |     const balance = parseFloat(targetAccount.balance || targetAccount.current_balance || '0');
  576 |     console.log(`[GL_AUDIT] Account: ${targetAccount.name} | Balance: ${balance.toFixed(2)}`);
  577 |     return balance;
  578 |   }
  579 | 
  580 |   async getMultiAccountBalancesAPI(accountIds: string[], companyOverride?: string): Promise<Record<string, number>> {
  581 |     const token = await this._getAuthToken();
  582 |     const company = companyOverride || await this.page.evaluate(() => localStorage.getItem('currentCompany')) || process.env.BEFFA_COMPANY || 'sample';
  583 |     const year = process.env.BEFFA_YEAR || '2018';
  584 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  585 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  586 | 
  587 |     const url = `${this.apiBase}/accounts?page=1&pageSize=1000&year=${year}&period=${period}&calendar=${calendar}`;
  588 |     const response = await this.page.request.get(url, {
  589 |       headers: {
  590 |         'Authorization': `Bearer ${token}`,
  591 |         'x-company': company,
  592 |         'x-role': 'IT Administrator / User Manager'
  593 |       }
  594 |     });
  595 | 
  596 |     if (!response.ok()) return {};
  597 | 
  598 |     const data = await response.json();
  599 |     const list = data.items || data.data || [];
  600 |     const balances: Record<string, number> = {};
  601 | 
  602 |     accountIds.forEach(id => {
  603 |       const acc = list.find((a: any) => a.id === id);
```