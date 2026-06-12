# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/bill-ui.spec.ts >> Purchase to Bill Flow @purchase @smoke @full >> Create PO via UI, approve, create linked bill, verify in vendor profile
- Location: tests/purchase/bill-ui.spec.ts:6:9

# Error details

```
Error: [ERROR] Failed selection for G/L Account
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
                      - link "Purchase Orders" [ref=e183] [cursor=pointer]:
                        - /url: /payables/purchase-orders/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=e184]:
                      - link "New" [ref=e185] [cursor=pointer]:
                        - /url: /payables/purchase-orders/new
            - button "2018" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2018"
              - img [ref=e189]
          - generic [ref=e192]:
            - button "Toggle Visibility" [ref=e195] [cursor=pointer]:
              - img [ref=e196]
            - generic [ref=e199]:
              - generic [ref=e200]:
                - paragraph [ref=e202]: Add Purchase Order
                - generic [ref=e204]:
                  - generic [ref=e205]:
                    - generic [ref=e206]:
                      - group [ref=e207]:
                        - generic [ref=e208]: Purchase Order Number
                        - textbox "Purchase Order Number" [disabled] [ref=e210]:
                          - /placeholder: N/A
                      - paragraph [ref=e211]: PO number is auto-generated
                    - generic [ref=e212]:
                      - generic [ref=e213]: Purchase Order Date
                      - button "ሰኔ 12, 2018" [ref=e215] [cursor=pointer]:
                        - img [ref=e216]
                        - generic [ref=e218]: ሰኔ 12, 2018
                    - group [ref=e219]:
                      - generic [ref=e220]: Discount Term
                      - button "Discount Term selector" [ref=e221]
                    - group [ref=e222]:
                      - generic [ref=e223]: Budget
                      - button "Budget selector" [ref=e224]: Select a budget
                    - group [ref=e225]:
                      - generic [ref=e226]: Payment Term
                      - button "Payment Term selector" [ref=e227]
                  - generic [ref=e228]:
                    - group [ref=e229]:
                      - generic [ref=e230]: Vendor *
                      - button "Vendor selector" [ref=e231]: Manenderas
                    - group [ref=e232]:
                      - generic [ref=e233]: Quotes
                      - button "Quotes selector" [ref=e234]
                    - group [ref=e235]:
                      - generic [ref=e236]: Accounts Payable *
                      - button "Accounts Payable selector" [ref=e237]: Prepaid Rent
                    - group [ref=e238]:
                      - generic [ref=e239]: Purchase Type *
                      - button "Purchase Type selector" [ref=e240]: Taxable-local Purchase of Inputs
                    - group [ref=e241]:
                      - generic [ref=e242]: Currency *
                      - button "Currency selector" [ref=e243]: Birr
                - generic [ref=e244]:
                  - generic [ref=e245]:
                    - tablist [ref=e246]:
                      - tab "Purchase Order Items" [selected] [ref=e247] [cursor=pointer]
                      - tab "PO Journal" [ref=e248] [cursor=pointer]
                      - tab "Upload Related Documents" [ref=e249] [cursor=pointer]
                    - button "Line Item" [expanded] [ref=e251] [cursor=pointer]:
                      - img [ref=e253]
                      - text: Line Item
                  - tabpanel "Purchase Order Items" [ref=e256]:
                    - table [ref=e260]:
                      - rowgroup [ref=e261]:
                        - row "Item Quantity Unit Price Purchase Type Description G/L Account * Project Before Tax * Tax Total" [ref=e262]:
                          - columnheader [ref=e263]
                          - columnheader "Item" [ref=e265]: Item
                          - columnheader "Quantity" [ref=e267]: Quantity
                          - columnheader "Unit Price" [ref=e269]: Unit Price
                          - columnheader "Purchase Type" [ref=e271]: Purchase Type
                          - columnheader "Description" [ref=e273]: Description
                          - columnheader "G/L Account *" [ref=e275]: G/L Account *
                          - columnheader "Project" [ref=e277]: Project
                          - columnheader "Before Tax *" [ref=e279]: Before Tax *
                          - columnheader "Tax" [ref=e281]: Tax
                          - columnheader "Total" [ref=e283]: Total
                          - columnheader [ref=e285]
                      - rowgroup [ref=e287]:
                        - row "No record found" [ref=e288]:
                          - cell "No record found" [ref=e289]:
                            - paragraph [ref=e291]: No record found
                      - rowgroup [ref=e292]:
                        - row "0.00 0.00 0.00" [ref=e293]:
                          - columnheader [ref=e294]
                          - columnheader [ref=e295]
                          - columnheader [ref=e296]
                          - columnheader [ref=e297]
                          - columnheader [ref=e298]
                          - columnheader [ref=e299]
                          - columnheader [ref=e300]
                          - columnheader [ref=e301]
                          - columnheader "0.00" [ref=e302]
                          - columnheader "0.00" [ref=e303]
                          - columnheader "0.00" [ref=e304]
                          - columnheader [ref=e305]
              - group [ref=e307]:
                - button "Add Now" [ref=e308] [cursor=pointer]
                - button [ref=e309] [cursor=pointer]:
                  - generic:
                    - img
        - generic [ref=e310]: BM Technology © 2026
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
  - dialog [ref=e312]:
    - generic [ref=e315]:
      - generic [ref=e316]:
        - generic [ref=e317]:
          - group [ref=e319]:
            - generic [ref=e320]: Item *
            - button "Item selector" [ref=e321]: inventory/RWT-7 - spare part panecea
          - group [ref=e323]:
            - generic [ref=e324]: Warehouse *
            - button "Warehouse selector" [ref=e325]: Default Warehouse
          - group [ref=e327]:
            - generic [ref=e328]: Location *
            - button "Location selector" [ref=e329]: Default Warehouse Location
          - group [ref=e331]:
            - generic [ref=e332]: Quantity *
            - spinbutton [ref=e334]: "1"
        - generic [ref=e335]:
          - group [ref=e337]:
            - generic [ref=e338]: G/L Account *
            - button "G/L Account selector" [ref=e339]
            - generic [ref=e340]: G/L is required
          - group [ref=e342]:
            - generic [ref=e343]: Project
            - button "Project selector" [ref=e344]
          - group [ref=e346]:
            - generic [ref=e347]: Unit Price *
            - spinbutton [ref=e349]: "6595.83"
          - group [ref=e351]:
            - generic [ref=e352]: Before Tax
            - spinbutton [disabled] [ref=e354]: "6595.83"
        - generic [ref=e355]:
          - generic [ref=e356]:
            - group [ref=e358]:
              - generic [ref=e359]: Description
              - textbox "Put your description here" [ref=e360]
            - generic [ref=e361]: "Total: 6595.83"
          - group [ref=e363]:
            - generic [ref=e364]: Tax
            - button "Tax selector" [ref=e365]
      - generic [ref=e366]:
        - generic [ref=e367]: "Total: 6,595.83"
        - generic [ref=e368]:
          - button "Back" [ref=e369] [cursor=pointer]
          - button "Cancel" [ref=e370] [cursor=pointer]
          - button "Add" [ref=e371] [cursor=pointer]
```

# Test source

```ts
  548 |     const dayToSelect = parseInt(dateValue.split('/')[0], 10).toString();
  549 |     console.log(`[ACTION] Filling date ${dateValue} -> Targeting UI day: ${dayToSelect}`);
  550 | 
  551 |     await this.startTacticalTimer(); // Start Tactical UI Timer
  552 | 
  553 |     let btn: Locator;
  554 |     if (typeof labelOrIndex === 'string') {
  555 |       const container = this.page.locator('.chakra-form-control, [role="group"], .flex-col, div')
  556 |         .filter({ has: this.page.getByText(new RegExp(`^${labelOrIndex}\\s*\\*?$`, 'i')) })
  557 |         .filter({ has: this.page.locator('button') })
  558 |         .last();
  559 |       btn = container.locator('button').first();
  560 |     } else {
  561 |       btn = this.page.locator('button:has(span.formatted-date), button.trigger-button').filter({ visible: true }).nth(labelOrIndex);
  562 |     }
  563 | 
  564 |     await btn.click({ force: true });
  565 |     await this.page.waitForTimeout(1000);
  566 | 
  567 |     const popover = this.page.locator('[role="dialog"], [data-slot="popover-content"], [id^="radix-"], .chakra-popover__content').filter({ visible: true }).last();
  568 |     // Use precise button targeting for the day number
  569 |     const dayBtn = popover.locator('button').filter({ hasText: new RegExp(`^${dayToSelect}$`) }).first();
  570 | 
  571 |     if (await dayBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  572 |       await dayBtn.click({ force: true });
  573 |       console.log(`[SUCCESS] Day ${dayToSelect} selected in the current active calendar grid.`);
  574 |     } else {
  575 |       console.log(`[WARN] Day ${dayToSelect} not found in grid. Using fallback type...`);
  576 |       await this.page.keyboard.type(dateValue);
  577 |       await this.page.keyboard.press('Enter');
  578 |     }
  579 |     await this.page.waitForTimeout(1000);
  580 |     await this.stopTacticalTimer(`Fill Date: ${labelOrIndex}`, 'UI');
  581 |   }
  582 | 
  583 |   async pickDate(label: string, dayNum?: number): Promise<void> {
  584 |     const targetDay = dayNum || await this.getActiveCalendarDay();
  585 |     console.log(`[ACTION] Picking date: "${label}" -> Targeting Day ${targetDay}`);
  586 | 
  587 |     await this.startTacticalTimer(); // Start Tactical UI Timer
  588 | 
  589 |     let container = this.page.locator('.chakra-form-control, [role="group"], .flex-col, div')
  590 |       .filter({ has: this.page.getByText(new RegExp(`^${label}\\s*\\*?$`, 'i')) })
  591 |       .filter({ has: this.page.locator('button') })
  592 |       .last();
  593 | 
  594 |     if (!(await container.isVisible().catch(() => false))) {
  595 |       container = this.page.locator('.chakra-form-control, [role="group"], div')
  596 |         .filter({ has: this.page.getByText(new RegExp(`${label}`, 'i')) })
  597 |         .filter({ has: this.page.locator('button') })
  598 |         .last();
  599 |     }
  600 | 
  601 |     const btn = container.locator('button').first();
  602 |     await btn.click({ force: true });
  603 |     await this.page.waitForTimeout(1000);
  604 | 
  605 |     const popover = this.page.locator('[role="dialog"], [data-slot="popover-content"], [id^="radix-"], .chakra-popover__content').filter({ visible: true }).last();
  606 |     const dayBtn = popover.locator('button').filter({ hasText: new RegExp(`^${targetDay}$`) }).first();
  607 | 
  608 |     if (await dayBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  609 |       await dayBtn.click({ force: true });
  610 |       console.log(`[SUCCESS] "${label}" set to Day ${targetDay} (Calendar match).`);
  611 |     } else {
  612 |       console.log(`[WARN] Could not find day ${targetDay}. Fallback to direct key press.`);
  613 |       await this.page.keyboard.type(String(targetDay));
  614 |       await this.page.keyboard.press('Enter');
  615 |       await this.page.keyboard.press('Tab');
  616 |     }
  617 |     await this.page.waitForTimeout(1000);
  618 |     await this.stopTacticalTimer(`Pick Date: ${label}`, 'UI');
  619 |   }
  620 | 
  621 |   async selectRandomOption(selector: Locator, labelName: string, isOptional: boolean = false): Promise<number> {
  622 |     const optionSelector = '[role="checkbox"], .chakra-checkbox, [role="option"], [role="menuitem"], .chakra-menu__menuitem';
  623 | 
  624 |     await this.startTacticalTimer(); // Start Tactical UI Timer
  625 | 
  626 |     for (let i = 0; i < 3; i++) {
  627 |       try {
  628 |         await selector.scrollIntoViewIfNeeded();
  629 |         await selector.click({ timeout: 5000 });
  630 |         await this.page.waitForTimeout(1500);
  631 |         const options = this.page.locator(optionSelector).filter({ visible: true });
  632 |         const count = await options.count();
  633 |         if (count > 0) {
  634 |           const randomIndex = Math.floor(Math.random() * count);
  635 |           const target = options.nth(randomIndex);
  636 |           await target.evaluate((node: HTMLElement) => node.click());
  637 |           await this.page.keyboard.press('Escape');
  638 |           await this.stopTacticalTimer(`Random Selection: ${labelName}`, 'UI');
  639 |           return count;
  640 |         } else {
  641 |           await this.page.keyboard.press('Escape');
  642 |           if (isOptional) return 0;
  643 |         }
  644 |       } catch (e) {
  645 |         await this.page.keyboard.press('Escape');
  646 |       }
  647 |     }
> 648 |     if (!isOptional) throw new Error(`[ERROR] Failed selection for ${labelName}`);
      |                            ^ Error: [ERROR] Failed selection for G/L Account
  649 |     return 0;
  650 |   }
  651 | 
  652 |   getTransactionDates(): { soDate: string; invoiceDate: string; dueDate: string } {
  653 |     const today = new Date();
  654 |     const due = new Date();
  655 |     due.setDate(today.getDate() + 30);
  656 |     const fmt = (d: Date) => {
  657 |       const dd = String(d.getDate()).padStart(2, '0');
  658 |       const mm = String(d.getMonth() + 1).padStart(2, '0');
  659 |       const yyyy = d.getFullYear();
  660 |       return `${dd}/${mm}/${yyyy}`;
  661 |     };
  662 |     return { soDate: fmt(today), invoiceDate: fmt(today), dueDate: fmt(due) };
  663 |   }
  664 | 
  665 |   getInvoiceDates(): { invoiceDate: string; dueDate: string } {
  666 |     const today = new Date();
  667 |     const due = new Date();
  668 |     due.setDate(today.getDate() + 30);
  669 |     const fmt = (d: Date) => {
  670 |       const dd = String(d.getDate()).padStart(2, '0');
  671 |       const mm = String(d.getMonth() + 1).padStart(2, '0');
  672 |       return `${dd}/${mm}/${d.getFullYear()}`;
  673 |     };
  674 |     return { invoiceDate: fmt(today), dueDate: fmt(due) };
  675 |   }
  676 | 
  677 |   async getTableColumnMap(selector: string = 'table thead th'): Promise<Record<string, number>> {
  678 |     const headers = this.page.locator(selector);
  679 |     const count = await headers.count();
  680 |     const map: Record<string, number> = {};
  681 |     for (let h = 0; h < count; h++) {
  682 |       const text = (await headers.nth(h).innerText().catch(() => '')).trim().toLowerCase();
  683 |       if (text) map[text] = h;
  684 |     }
  685 |     return map;
  686 |   }
  687 | 
  688 |   async getAccountBalanceAPI(accountId: string, companyOverride?: string): Promise<number> {
  689 |     const token = await this._getAuthToken();
  690 |     const company = companyOverride || await this.page.evaluate(() => localStorage.getItem('currentCompany')) || process.env.BEFFA_COMPANY || 'sample';
  691 |     const year = process.env.BEFFA_YEAR || '2018';
  692 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  693 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  694 | 
  695 |     // Fetch all accounts and filter locally to ensure we find the exact UUID
  696 |     const url = `${this.apiBase}/accounts?page=1&pageSize=1000&year=${year}&period=${period}&calendar=${calendar}`;
  697 | 
  698 |     const response = await this.page.request.get(url, {
  699 |       headers: {
  700 |         'Authorization': `Bearer ${token}`,
  701 |         'x-company': company,
  702 |         'x-role': 'IT Administrator / User Manager'
  703 |       }
  704 |     });
  705 | 
  706 |     if (!response.ok()) {
  707 |       console.log(`[WARN] GL Balance Query Failed. Status: ${response.status()}`);
  708 |       return 0;
  709 |     }
  710 | 
  711 |     const data = await response.json();
  712 |     const list = data.items || data.data || [];
  713 |     const targetAccount = list.find((a: any) => a.id === accountId);
  714 | 
  715 |     if (!targetAccount) {
  716 |       console.log(`[WARN] GL Audit: Account ${accountId} not found in the COA list.`);
  717 |       return 0;
  718 |     }
  719 | 
  720 |     const balance = parseFloat(targetAccount.balance || targetAccount.current_balance || '0');
  721 |     console.log(`[GL_AUDIT] Account: ${targetAccount.name} | Balance: ${balance.toFixed(2)}`);
  722 |     return balance;
  723 |   }
  724 | 
  725 |   async getMultiAccountBalancesAPI(accountIds: string[], companyOverride?: string): Promise<Record<string, number>> {
  726 |     const token = await this._getAuthToken();
  727 |     const company = companyOverride || await this.page.evaluate(() => localStorage.getItem('currentCompany')) || process.env.BEFFA_COMPANY || 'sample';
  728 |     const year = process.env.BEFFA_YEAR || '2018';
  729 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  730 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  731 | 
  732 |     const url = `${this.apiBase}/accounts?page=1&pageSize=1000&year=${year}&period=${period}&calendar=${calendar}`;
  733 |     const response = await this.page.request.get(url, {
  734 |       headers: {
  735 |         'Authorization': `Bearer ${token}`,
  736 |         'x-company': company,
  737 |         'x-role': 'IT Administrator / User Manager'
  738 |       }
  739 |     });
  740 | 
  741 |     if (!response.ok()) return {};
  742 | 
  743 |     const data = await response.json();
  744 |     const list = data.items || data.data || [];
  745 |     const balances: Record<string, number> = {};
  746 | 
  747 |     accountIds.forEach(id => {
  748 |       const acc = list.find((a: any) => a.id === id);
```