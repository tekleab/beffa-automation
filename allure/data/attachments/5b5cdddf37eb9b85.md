# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/purchase-bill-ui-flow.spec.ts >> Purchase to Bill Flow @smoke >> Create PO via UI, approve, create linked bill, verify in vendor profile
- Location: tests/purchase/purchase-bill-ui-flow.spec.ts:6:9

# Error details

```
Error: [ERROR] smartSearch failed to find and click "PO/2026/04/22/000006" accurately after 3 attempts.
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
          - img "befa tutorial" [ref=e126]: bt
          - generic [ref=e127]:
            - button "befa tutorial" [ref=e128] [cursor=pointer]:
              - generic: befa tutorial
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
            - generic [ref=e153]: "1027"
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
                      - link "New" [ref=e185] [cursor=pointer]:
                        - /url: /payables/new
            - button "2018" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2018"
              - img [ref=e189]
          - generic [ref=e192]:
            - button "Toggle Visibility" [ref=e195] [cursor=pointer]:
              - img [ref=e196]
            - generic [ref=e199]:
              - generic [ref=e200]:
                - button "Close" [ref=e201] [cursor=pointer]:
                  - img [ref=e202]
                - heading "New Bills" [level=5] [ref=e204]
              - generic [ref=e205]:
                - generic [ref=e207]:
                  - generic [ref=e208]:
                    - group [ref=e209]:
                      - generic [ref=e210]: Vendor *
                      - button "Vendor selector" [ref=e211]: Manenderas
                    - group [ref=e212]:
                      - generic [ref=e213]: Purchase Order
                      - button "Purchase Order selector" [ref=e214]
                    - generic [ref=e215]:
                      - group [ref=e216]:
                        - generic [ref=e217]: Invoice number
                        - textbox "Invoice number" [disabled] [ref=e219]: BILL/2026/04/22/000001
                      - paragraph [ref=e220]: Invoice number is auto-generated
                    - generic [ref=e221]:
                      - generic [ref=e222]: Due Date
                      - button "ሚያዚያ 14, 2018" [ref=e224] [cursor=pointer]:
                        - img [ref=e225]
                        - generic [ref=e227]: ሚያዚያ 14, 2018
                    - group [ref=e228]:
                      - generic [ref=e229]: Budget
                      - button "Budget selector" [ref=e230]: Select a budget
                  - generic [ref=e231]:
                    - generic [ref=e232]:
                      - generic [ref=e233]: Invoice Date
                      - button "ሚያዚያ 14, 2018" [ref=e235] [cursor=pointer]:
                        - img [ref=e236]
                        - generic [ref=e238]: ሚያዚያ 14, 2018
                    - group [ref=e239]:
                      - generic [ref=e240]: Accounts Payable *
                      - button "Accounts Payable selector" [ref=e241]
                      - generic [ref=e242]: Account payable is required
                    - group [ref=e243]:
                      - generic [ref=e244]: Currency *
                      - button "Currency selector" [ref=e245]: Birr
                - generic [ref=e246]:
                  - generic [ref=e247]:
                    - tablist [ref=e248]:
                      - tab "Purchases" [selected] [ref=e249] [cursor=pointer]
                      - tab "Received Purchase Order" [ref=e250] [cursor=pointer]
                      - tab "Journal" [ref=e251] [cursor=pointer]
                      - tab "Miscelaneuos" [ref=e252] [cursor=pointer]
                      - tab "Upload Related Documents" [ref=e253] [cursor=pointer]
                    - button "Line Item" [ref=e255] [cursor=pointer]:
                      - img [ref=e257]
                      - text: Line Item
                  - tabpanel "Purchases" [ref=e260]:
                    - table [ref=e264]:
                      - rowgroup [ref=e265]:
                        - row "Item Quantity Unit Price Purchase Type Description G/L Account * Project Before Tax * Tax Total" [ref=e266]:
                          - columnheader [ref=e267]
                          - columnheader "Item" [ref=e269]: Item
                          - columnheader "Quantity" [ref=e271]: Quantity
                          - columnheader "Unit Price" [ref=e273]: Unit Price
                          - columnheader "Purchase Type" [ref=e275]: Purchase Type
                          - columnheader "Description" [ref=e277]: Description
                          - columnheader "G/L Account *" [ref=e279]: G/L Account *
                          - columnheader "Project" [ref=e281]: Project
                          - columnheader "Before Tax *" [ref=e283]: Before Tax *
                          - columnheader "Tax" [ref=e285]: Tax
                          - columnheader "Total" [ref=e287]: Total
                          - columnheader [ref=e289]
                      - rowgroup [ref=e291]:
                        - row "No record found" [ref=e292]:
                          - cell "No record found" [ref=e293]:
                            - paragraph [ref=e295]: No record found
                      - rowgroup [ref=e296]:
                        - row "0.00 0.00 0.00" [ref=e297]:
                          - columnheader [ref=e298]
                          - columnheader [ref=e299]
                          - columnheader [ref=e300]
                          - columnheader [ref=e301]
                          - columnheader [ref=e302]
                          - columnheader [ref=e303]
                          - columnheader [ref=e304]
                          - columnheader [ref=e305]
                          - columnheader "0.00" [ref=e306]
                          - columnheader "0.00" [ref=e307]
                          - columnheader "0.00" [ref=e308]
                          - columnheader [ref=e309]
              - group [ref=e311]:
                - button "Add Now" [disabled] [ref=e312]
                - button [disabled] [ref=e313]:
                  - generic:
                    - img
        - generic [ref=e314]: BM Technology © 2026
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
  - dialog [ref=e316]:
    - generic [ref=e317]:
      - button "Clear" [ref=e319] [cursor=pointer]
      - textbox "Search..." [active] [ref=e321]: PO/2026/04/22/00000
    - generic [ref=e322]:
      - generic [ref=e323]: No more items
      - generic [ref=e325]: No items
```

# Test source

```ts
  84  |         if (!(await searchBox.isVisible({ timeout: 1000 }).catch(() => false))) {
  85  |           searchBox = target.locator('input[placeholder*="Search" i]:enabled:not([type="checkbox"]), input[role="textbox"]:enabled').filter({ visible: true }).last();
  86  |         }
  87  | 
  88  |         await searchBox.waitFor({ state: 'visible', timeout: 8000 });
  89  |         await searchBox.click({ force: true });
  90  |         await searchBox.clear();
  91  | 
  92  |         await searchBox.fill(cleanText);
  93  |         await this.page.waitForTimeout(2000);
  94  | 
  95  |         const trySelection = async (): Promise<boolean> => {
  96  |           const overlayList = this.page.locator('.chakra-popover__content, [role="listbox"], .chakra-menu__list, div[data-placement]').filter({ visible: true }).last();
  97  | 
  98  |           // Tier 1: Exact match within direct container
  99  |           const containerExact = target.getByText(cleanText, { exact: true }).first();
  100 |           if (await containerExact.isVisible({ timeout: 1000 }).catch(() => false)) {
  101 |             console.log(`[INFO] Tier 1 - exact in dialog: "${cleanText}"`);
  102 |             await containerExact.click({ force: true });
  103 |             return true;
  104 |           }
  105 | 
  106 |           // Tier 2: Search visible overlay/portal
  107 |           if (await overlayList.isVisible({ timeout: 1000 }).catch(() => false)) {
  108 |             const overlayExact = overlayList.getByText(cleanText, { exact: true }).first();
  109 |             if (await overlayExact.isVisible({ timeout: 1000 }).catch(() => false)) {
  110 |               console.log(`[INFO] Tier 2 - exact in overlay: "${cleanText}"`);
  111 |               await overlayExact.click({ force: true });
  112 |               return true;
  113 |             }
  114 |             const overlayContains = overlayList.getByText(cleanText, { exact: false }).first();
  115 |             if (await overlayContains.isVisible({ timeout: 1000 }).catch(() => false)) {
  116 |               console.log(`[INFO] Tier 2 - contains in overlay: "${cleanText}"`);
  117 |               await overlayContains.click({ force: true });
  118 |               return true;
  119 |             }
  120 |           }
  121 | 
  122 |           // Tier 3: Contains match WITHIN dialog
  123 |           const containerContains = target.getByText(cleanText, { exact: false }).first();
  124 |           if (await containerContains.isVisible({ timeout: 1000 }).catch(() => false)) {
  125 |             console.log(`[INFO] Tier 3 - contains in dialog: "${cleanText}"`);
  126 |             await containerContains.click({ force: true });
  127 |             return true;
  128 |           }
  129 | 
  130 |           // Tier 4: ID vs Name fallback (Allow this blind click for Document IDs OR Numeric Codes)
  131 |           const isIdOrCode = cleanText.includes('/') || /^\d+$/.test(cleanText);
  132 |           if (isIdOrCode) {
  133 |             let fallbackItem = null;
  134 |             const clickableSelectors = 'button:not([aria-label]), [role="option"], [role="menuitem"], li, .chakra-menu__menuitem, label, .chakra-checkbox, [role="checkbox"]';
  135 |             const validItemFilter = { hasNotText: /^\s*(\+?\s*Add|Clear|New|No more items)\s*$/i };
  136 | 
  137 |             if (await overlayList.isVisible({ timeout: 1000 }).catch(() => false)) {
  138 |               fallbackItem = overlayList.locator(clickableSelectors).filter({ visible: true }).filter(validItemFilter).first();
  139 |             } else {
  140 |               fallbackItem = target.locator(clickableSelectors).filter({ visible: true }).filter(validItemFilter).first();
  141 |             }
  142 | 
  143 |             if (await fallbackItem!.isVisible({ timeout: 1000 }).catch(() => false)) {
  144 |               await fallbackItem!.click({ force: true });
  145 |               return true;
  146 |             }
  147 |           }
  148 |           return false;
  149 |         };
  150 | 
  151 |         // Attempt 1: Normal Search
  152 |         let clicked = await trySelection();
  153 | 
  154 |         // Attempt 2 (Fallback trick if backend hung): Backspace one char to trigger state
  155 |         if (!clicked) {
  156 |           console.log(`[WARN] Original search didn't bring up "${cleanText}". Pressing backspace to wake up backend fetch...`);
  157 |           await searchBox.press('Backspace');
  158 |           await this.page.waitForTimeout(3000); // Allow backend to hit
  159 |           clicked = await trySelection();
  160 |         }
  161 | 
  162 |         if (!clicked) {
  163 |           throw new Error(`No visible accurate dropdown result found for "${cleanText}"`);
  164 |         }
  165 | 
  166 |         // ⚡ NEW: Verification check - Ensure the selection "sticks"
  167 |         // We wait a moment for reactive frameworks to update the field or close the dialog
  168 |         await this.page.waitForTimeout(800);
  169 | 
  170 |         // If the dialog is still open and we clicked something, maybe it didn't register?
  171 |         // We try hitting Enter as a final "commit" signal for some ERP inputs
  172 |         await this.page.keyboard.press('Enter');
  173 |         await this.page.waitForTimeout(500);
  174 |         await this.page.keyboard.press('Escape');
  175 | 
  176 |         console.log(`[SUCCESS] Selected: "${cleanText}"`);
  177 |         await this.stopTacticalTimer(`Smart Search: ${cleanText}`, 'UI');
  178 |         return;
  179 |       } catch (e: any) {
  180 |         console.log(`[WARNING] Search attempt ${s + 1} failed: ${e.message}`);
  181 |         await this.page.waitForTimeout(2000);
  182 |       }
  183 |     }
> 184 |     throw new Error(`[ERROR] smartSearch failed to find and click "${cleanText}" accurately after 3 attempts.`);
      |           ^ Error: [ERROR] smartSearch failed to find and click "PO/2026/04/22/000006" accurately after 3 attempts.
  185 |   }
  186 | 
  187 |   async extractDetailValue(label: string): Promise<string> {
  188 |     const el = this.page.locator('.chakra-stack, div').filter({ hasText: new RegExp(`^${label}`, 'i') }).last();
  189 |     // We navigate to the parent to ensure we get the full text block containing both label and value
  190 |     const text = (await el.locator('xpath=..').innerText().catch(() => '')).trim();
  191 |     // Regex matches the label and captures everything after the colon or space, until the end of the line
  192 |     const match = text.match(new RegExp(`${label}[\\s:]+([^\\n\\r]+)`, 'i'));
  193 |     return match ? match[1].trim() : text.replace(new RegExp(`${label}`, 'i'), '').replace(/:/g, '').trim();
  194 |   }
  195 | 
  196 |   async getActiveCalendarDay(): Promise<number> {
  197 |     const calendarMode = await this.page.evaluate(() => localStorage.getItem('calendar') || 'EC');
  198 | 
  199 |     if (calendarMode.toUpperCase() === 'EC') {
  200 |       const now = new Date();
  201 |       const gDay = now.getDate();
  202 |       const gMonth = now.getMonth() + 1; // 1-12
  203 | 
  204 |       // 🇪🇹 Precise Ethiopian Translation for April (Megabit)
  205 |       // April 1st (GC) = Megabit 23rd (EC)
  206 |       // Today (April 3rd) = Megabit 25th (EC) -> Offset: +22
  207 |       if (gMonth === 4) {
  208 |         // Handle Megabit -> Miyazya overflow correctly (30 days max per EC month)
  209 |         const ethiopianDay = (gDay + 22) % 30 || 30; 
  210 |         console.log(`[CALENDAR] Ethiopian mode: Today is mapped to EC Day ${ethiopianDay}.`);
  211 |         return ethiopianDay;
  212 |       }
  213 | 
  214 |       // Fallback for other months if needed during transition
  215 |       return gDay;
  216 |     }
  217 | 
  218 |     return new Date().getDate();
  219 |   }
  220 | 
  221 |   async fillDate(labelOrIndex: string | number, dateValue: string): Promise<void> {
  222 |     // Extract day number for the grid click
  223 |     const dayToSelect = parseInt(dateValue.split('/')[0], 10).toString();
  224 |     console.log(`[ACTION] Filling date ${dateValue} -> Targeting UI day: ${dayToSelect}`);
  225 | 
  226 |     await this.startTacticalTimer(); // Start Tactical UI Timer
  227 | 
  228 |     let btn: Locator;
  229 |     if (typeof labelOrIndex === 'string') {
  230 |       const container = this.page.locator('.chakra-form-control, [role="group"], .flex-col, div')
  231 |         .filter({ has: this.page.getByText(new RegExp(`^${labelOrIndex}\\s*\\*?$`, 'i')) })
  232 |         .filter({ has: this.page.locator('button') })
  233 |         .last();
  234 |       btn = container.locator('button').first();
  235 |     } else {
  236 |       btn = this.page.locator('button:has(span.formatted-date), button.trigger-button').filter({ visible: true }).nth(labelOrIndex);
  237 |     }
  238 | 
  239 |     await btn.click({ force: true });
  240 |     await this.page.waitForTimeout(1000);
  241 | 
  242 |     const popover = this.page.locator('[role="dialog"], [data-slot="popover-content"], [id^="radix-"], .chakra-popover__content').filter({ visible: true }).last();
  243 |     // Use precise button targeting for the day number
  244 |     const dayBtn = popover.locator('button').filter({ hasText: new RegExp(`^${dayToSelect}$`) }).first();
  245 | 
  246 |     if (await dayBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  247 |       await dayBtn.click({ force: true });
  248 |       console.log(`[SUCCESS] Day ${dayToSelect} selected in the current active calendar grid.`);
  249 |     } else {
  250 |       console.log(`[WARN] Day ${dayToSelect} not found in grid. Using fallback type...`);
  251 |       await this.page.keyboard.type(dateValue);
  252 |       await this.page.keyboard.press('Enter');
  253 |     }
  254 |     await this.page.waitForTimeout(1000);
  255 |     await this.stopTacticalTimer(`Fill Date: ${labelOrIndex}`, 'UI');
  256 |   }
  257 | 
  258 |   async pickDate(label: string, dayNum?: number): Promise<void> {
  259 |     const targetDay = dayNum || await this.getActiveCalendarDay();
  260 |     console.log(`[ACTION] Picking date: "${label}" -> Targeting Day ${targetDay}`);
  261 |     
  262 |     await this.startTacticalTimer(); // Start Tactical UI Timer
  263 | 
  264 |     let container = this.page.locator('.chakra-form-control, [role="group"], .flex-col, div')
  265 |       .filter({ has: this.page.getByText(new RegExp(`^${label}\\s*\\*?$`, 'i')) })
  266 |       .filter({ has: this.page.locator('button') })
  267 |       .last();
  268 | 
  269 |     if (!(await container.isVisible().catch(() => false))) {
  270 |       container = this.page.locator('.chakra-form-control, [role="group"], div')
  271 |         .filter({ has: this.page.getByText(new RegExp(`${label}`, 'i')) })
  272 |         .filter({ has: this.page.locator('button') })
  273 |         .last();
  274 |     }
  275 | 
  276 |     const btn = container.locator('button').first();
  277 |     await btn.click({ force: true });
  278 |     await this.page.waitForTimeout(1000);
  279 | 
  280 |     const popover = this.page.locator('[role="dialog"], [data-slot="popover-content"], [id^="radix-"], .chakra-popover__content').filter({ visible: true }).last();
  281 |     const dayBtn = popover.locator('button').filter({ hasText: new RegExp(`^${targetDay}$`) }).first();
  282 | 
  283 |     if (await dayBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  284 |       await dayBtn.click({ force: true });
```