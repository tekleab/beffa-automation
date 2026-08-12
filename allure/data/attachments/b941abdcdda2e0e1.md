# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> SO-UI-01: Add inventory Line Item via modal → SO created and approved
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:221:9

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  locator('.chakra-modal__content, .chakra-popover__content, [role="dialog"]').filter({ hasText: /Warehouse \*|G\/L Account \*|Description/i }).first()
Expected: not visible
Received: visible
Timeout:  15000ms

Call log:
  - Expect "not toBeVisible" with timeout 15000ms
  - waiting for locator('.chakra-modal__content, .chakra-popover__content, [role="dialog"]').filter({ hasText: /Warehouse \*|G\/L Account \*|Description/i }).first()
    18 × locator resolved to <section tabindex="-1" role="dialog" id="popover-content-:rdt:" aria-describedby="popover-body-:rdt:" class="chakra-popover__content css-unt9s1">…</section>
       - unexpected value "visible"

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
                      - link "Receivables" [ref=e181] [cursor=pointer]:
                        - /url: /receivables/overview/
                      - text: /
                    - listitem [ref=e182]:
                      - link "SaleOrders" [ref=e183] [cursor=pointer]:
                        - /url: /receivables/sale-orders/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=e184]:
                      - link "Add" [ref=e185] [cursor=pointer]:
                        - /url: /receivables/sale-orders/new
            - button "2019" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2019"
              - img [ref=e189]
          - generic [ref=e192]:
            - button "Toggle Visibility" [ref=e195] [cursor=pointer]:
              - img [ref=e196]
            - generic [ref=e198]:
              - paragraph [ref=e200]: Add Sale Order
              - generic [ref=e201]:
                - generic [ref=e203]:
                  - generic [ref=e205]:
                    - generic [ref=e206]:
                      - generic [ref=e207]:
                        - group [ref=e208]:
                          - generic [ref=e209]: Sale Order Number
                          - textbox "Sale Order Number" [disabled] [ref=e211]:
                            - /placeholder: N/A
                        - paragraph [ref=e212]: SO number is auto-generated
                      - generic [ref=e213]:
                        - generic [ref=e214]: Sale Order Date
                        - button "ነሀሴ 12, 2018" [ref=e216] [cursor=pointer]:
                          - img [ref=e217]
                          - generic [ref=e219]: ነሀሴ 12, 2018
                      - group [ref=e220]:
                        - generic [ref=e221]: Payment Term
                        - button "Payment Term selector" [ref=e222]
                      - group [ref=e223]:
                        - generic [ref=e224]: Posted Budget *
                        - button "Posted Budget * selector" [ref=e225]: Select a posted budget
                    - generic [ref=e226]:
                      - group [ref=e227]:
                        - generic [ref=e228]: Customer *
                        - button "Customer selector" [ref=e229]: J-Plant Construction
                      - group [ref=e230]:
                        - generic [ref=e231]: Accounts Receivable *
                        - button "Accounts Receivable selector" [ref=e232]: Cash - Main Office
                      - group [ref=e233]:
                        - generic [ref=e234]: Currency *
                        - button "Currency selector" [ref=e235]: Birr
                  - generic [ref=e237]:
                    - generic [ref=e238]:
                      - tablist [ref=e239]:
                        - tab "Sale Order Items *" [selected] [ref=e240] [cursor=pointer]
                        - tab "SO Journal" [ref=e241] [cursor=pointer]
                        - tab "Documents" [ref=e242] [cursor=pointer]
                      - button "Line Item" [expanded] [ref=e244] [cursor=pointer]:
                        - img [ref=e246]
                        - text: Line Item
                    - tabpanel "Sale Order Items *" [ref=e249]:
                      - table [ref=e253]:
                        - rowgroup [ref=e254]:
                          - row "Item Quantity Unit Price Description G/L Account * Project Before Tax * Tax Total" [ref=e255]:
                            - columnheader [ref=e256]
                            - columnheader "Item" [ref=e258]: Item
                            - columnheader "Quantity" [ref=e260]: Quantity
                            - columnheader "Unit Price" [ref=e262]: Unit Price
                            - columnheader "Description" [ref=e264]: Description
                            - columnheader "G/L Account *" [ref=e266]: G/L Account *
                            - columnheader "Project" [ref=e268]: Project
                            - columnheader "Before Tax *" [ref=e270]: Before Tax *
                            - columnheader "Tax" [ref=e272]: Tax
                            - columnheader "Total" [ref=e274]: Total
                            - columnheader [ref=e276]
                        - rowgroup [ref=e278]:
                          - row "No record found" [ref=e279]:
                            - cell "No record found" [ref=e280]:
                              - paragraph [ref=e282]: No record found
                        - rowgroup [ref=e283]:
                          - row "0.00 0.00 0.00" [ref=e284]:
                            - columnheader [ref=e285]
                            - columnheader [ref=e286]
                            - columnheader [ref=e287]
                            - columnheader [ref=e288]
                            - columnheader [ref=e289]
                            - columnheader [ref=e290]
                            - columnheader [ref=e291]
                            - columnheader "0.00" [ref=e292]
                            - columnheader "0.00" [ref=e293]
                            - columnheader "0.00" [ref=e294]
                            - columnheader [ref=e295]
                - group [ref=e297]:
                  - button "Add Now" [ref=e298] [cursor=pointer]
                  - button [ref=e299] [cursor=pointer]:
                    - generic:
                      - img
        - generic [ref=e300]: BM Technology © 2026
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
    - option "2018"
    - option "2019 (open)" [selected]
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
  - dialog [ref=e302]:
    - generic [ref=e305]:
      - generic [ref=e306]:
        - generic [ref=e307]:
          - group [ref=e309]:
            - generic [ref=e310]: Item *
            - button "Item selector" [ref=e311]: spare part panecea
          - group [ref=e313]:
            - generic [ref=e314]: Warehouse *
            - button "Warehouse selector" [ref=e315]: Transfer Destination Warehouse
          - group [ref=e317]:
            - generic [ref=e318]: Location *
            - button "Location selector" [ref=e319]: location1
          - group [ref=e321]:
            - generic [ref=e322]: Quantity *
            - spinbutton [ref=e324]: "500"
        - generic [ref=e325]:
          - group [ref=e327]:
            - generic [ref=e328]: G/L Account *
            - button "G/L Account selector" [ref=e329]: Cash - Branch Office
          - group [ref=e331]:
            - generic [ref=e332]: Project
            - button "Project selector" [ref=e333]
          - group [ref=e335]:
            - generic [ref=e336]: Selling Price
            - spinbutton [disabled] [ref=e338]: "0"
            - generic [ref=e339]: Selling price is must be greater than 0
          - group [ref=e341]:
            - generic [ref=e342]: Before Tax
            - spinbutton [disabled] [ref=e344]: "0"
        - generic [ref=e345]:
          - generic [ref=e346]:
            - group [ref=e348]:
              - generic [ref=e349]: Description
              - textbox "Put your description here" [ref=e350]
            - generic [ref=e351]: "Total: 0"
          - group [ref=e353]:
            - generic [ref=e354]: Tax
            - button "Tax selector" [ref=e355]: VAT
      - generic [ref=e356]:
        - generic [ref=e357]: "Total: 0"
        - generic [ref=e358]:
          - button "Back" [ref=e359] [cursor=pointer]
          - button "Cancel" [ref=e360] [cursor=pointer]
          - button "Add" [active] [ref=e361] [cursor=pointer]
```

# Test source

```ts
  114 |         unitPrice: string; qty: string; description?: string;
  115 |     }) {
  116 |         const popover = page.locator('[role="dialog"], .chakra-popover__content')
  117 |             .filter({ hasText: /Please select an item type/i });
  118 |         const modal = page.locator('.chakra-modal__content, .chakra-popover__content, [role="dialog"]')
  119 |             .filter({ hasText: /Warehouse \*|G\/L Account \*|Description/i })
  120 |             .first();
  121 | 
  122 |         // Wait up to 5s for either the popover or the modal to appear
  123 |         await Promise.race([
  124 |             popover.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
  125 |             modal.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
  126 |         ]);
  127 | 
  128 |         // If type selection popover is visible, click the button matching type first to open the modal
  129 |         if (await popover.isVisible().catch(() => false)) {
  130 |             const typeBtn = popover.getByRole('button', { name: type, exact: true });
  131 |             await typeBtn.click();
  132 |             await page.waitForTimeout(500);
  133 |         }
  134 | 
  135 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  136 | 
  137 |         // Choose Item vs Miscellaneous tab inside the modal if the inner button/tab is visible
  138 |         const innerTabBtn = modal.getByRole('button', { name: type, exact: true });
  139 |         if (await innerTabBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  140 |             await innerTabBtn.click();
  141 |             await page.waitForTimeout(500);
  142 |         }
  143 | 
  144 |         if (type === 'Item') {
  145 |             await app.selectRandomOption(modal.getByRole('button', { name: 'Item selector' }), 'Item');
  146 |             await app.selectRandomOption(modal.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
  147 |             await app.selectRandomOption(modal.getByRole('button', { name: 'Location selector' }), 'Location');
  148 |         } else {
  149 |             // Miscellaneous: description field instead of item picker
  150 |             const descField = modal.getByRole('textbox').first();
  151 |             if (await descField.isVisible({ timeout: 3000 }).catch(() => false)) {
  152 |                 await descField.fill(opts.description || 'Miscellaneous charge');
  153 |             }
  154 |         }
  155 | 
  156 |         const glBtn = modal.getByRole('button', { name: 'G/L Account selector' });
  157 |         await glBtn.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
  158 |         await app.selectRandomOption(glBtn, 'G/L Account');
  159 | 
  160 |         // Quantity input exists on Item lines and some Miscellaneous modals.
  161 |         const qtyGroup = modal.getByRole('group').filter({ hasText: /^Quantity/i });
  162 |         const hasQty = await qtyGroup.isVisible({ timeout: 2000 }).catch(() => false);
  163 |         if (hasQty) {
  164 |             await qtyGroup.getByRole('spinbutton').fill(opts.qty);
  165 |         }
  166 | 
  167 |         // Fill price field (Selling Price, Unit Price, Before Tax, price)
  168 |         let priceFilled = false;
  169 |         for (const labelName of [/Selling Price/i, /Unit Price/i, /Before Tax/i, /price/i, /amount/i]) {
  170 |             const container = modal.locator('.chakra-form-control, [role="group"], div').filter({
  171 |                 has: page.getByText(labelName)
  172 |             }).filter({ has: page.locator('input:not([disabled])') }).first();
  173 |             
  174 |             if (await container.isVisible({ timeout: 1000 }).catch(() => false)) {
  175 |                 const inp = container.locator('input:not([disabled])').first();
  176 |                 await inp.fill(opts.unitPrice);
  177 |                 priceFilled = true;
  178 |                 console.log(`[MODAL] Filled price field via label container "${labelName.source}": ${opts.unitPrice}`);
  179 |                 break;
  180 |             }
  181 |         }
  182 | 
  183 |         if (!priceFilled) {
  184 |             // Strategy 2: Fallback to inputs initialized with value="0" or price-related placeholders/names that are enabled
  185 |             const fallbackInput = modal.locator('input:not([disabled])').filter({
  186 |                 hasText: /price|amount|before_tax/i
  187 |             }).first();
  188 |             if (await fallbackInput.isVisible({ timeout: 1000 }).catch(() => false)) {
  189 |                 await fallbackInput.fill(opts.unitPrice);
  190 |                 priceFilled = true;
  191 |                 console.log(`[MODAL] Filled price field via fallback input: ${opts.unitPrice}`);
  192 |             }
  193 |         }
  194 | 
  195 |         if (!priceFilled) {
  196 |             // Strategy 3: Fallback to first visible enabled spinbutton or input that is not description/textbox
  197 |             const inputs = modal.locator('input:not([disabled])').filter({ visible: true });
  198 |             const count = await inputs.count();
  199 |             for (let i = 0; i < count; i++) {
  200 |                 const inp = inputs.nth(i);
  201 |                 const role = await inp.getAttribute('role');
  202 |                 const type = await inp.getAttribute('type');
  203 |                 if (role === 'textbox' || type === 'text') continue;
  204 |                 await inp.fill(opts.unitPrice);
  205 |                 priceFilled = true;
  206 |                 console.log(`[MODAL] Filled price field via fallback enabled input index ${i}: ${opts.unitPrice}`);
  207 |                 break;
  208 |             }
  209 |         }
  210 |         await app.selectRandomOption(modal.getByRole('button', { name: 'Tax selector' }), 'Tax', true);
  211 | 
  212 |         const addBtn = modal.locator('button:has-text("Add"), button:has-text("Save")').first();
  213 |         await addBtn.click();
> 214 |         await expect(modal).not.toBeVisible({ timeout: 15000 });
      |                                 ^ Error: expect(locator).not.toBeVisible() failed
  215 |     }
  216 | 
  217 |     // =========================================================================
  218 |     // SALES ORDER
  219 |     // =========================================================================
  220 | 
  221 |     test('SO-UI-01: Add inventory Line Item via modal → SO created and approved', async ({ page }) => {
  222 |         const app = new AppManager(page);
  223 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  224 |         await page.goto('/receivables/sale-orders/new', { waitUntil: 'domcontentloaded' });
  225 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  226 | 
  227 |         const lineItemBtn = page.locator('button:has-text("Line Item"), button:has-text("Add Line Item")').first();
  228 |         await lineItemBtn.waitFor({ state: 'visible', timeout: 60000 });
  229 | 
  230 |         await app.pickDate('Sales Order Date');
  231 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  232 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');
  233 |         await fillCurrencyField(page, app);
  234 | 
  235 |         await lineItemBtn.click();
  236 |         await addLineItemViaModal(page, app, 'Item', { qty: '3', unitPrice: '500' });
  237 |         console.log('[OK] Inventory line item added to SO');
  238 | 
  239 |         const addNowBtn = page.locator('button:has-text("Add Now"), button:has-text("Save"), button:has-text("Create")').first();
  240 |         await addNowBtn.click();
  241 |         await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });
  242 | 
  243 |         const soId = await app.extractIdFromUrl();
  244 |         await app.advanceDocumentAPI(soId, 'sales-orders');
  245 |         console.log('[PASS] SO with inventory line item created and approved');
  246 |     });
  247 | 
  248 |     test('SO-UI-02: Add Miscellaneous Line Item via modal → SO created and approved', async ({ page }) => {
  249 |         const app = new AppManager(page);
  250 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  251 |         await page.goto('/receivables/sale-orders/new', { waitUntil: 'domcontentloaded' });
  252 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  253 |         await page.getByRole('button', { name: 'Line Item' }).waitFor({ state: 'visible', timeout: 60000 });
  254 | 
  255 |         await app.pickDate('Sales Order Date');
  256 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  257 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');
  258 |         await fillCurrencyField(page, app);
  259 | 
  260 |         await page.getByRole('button', { name: 'Line Item' }).click();
  261 |         const modal = page.getByRole('dialog').last();
  262 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  263 | 
  264 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  265 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  266 |             console.log('[SKIP] Miscellaneous button not present in SO modal');
  267 |             await page.keyboard.press('Escape');
  268 |             return;
  269 |         }
  270 | 
  271 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '750', description: 'Delivery fee' });
  272 |         console.log('[OK] Miscellaneous line item added to SO');
  273 | 
  274 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  275 |         await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });
  276 |         console.log('[PASS] SO with miscellaneous line item created');
  277 |     });
  278 | 
  279 |     test('SO-UI-03: Add both Item + Miscellaneous lines → totals shown in SO table', async ({ page }) => {
  280 |         const app = new AppManager(page);
  281 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  282 |         await page.goto('/receivables/sale-orders/new', { waitUntil: 'domcontentloaded' });
  283 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  284 |         await page.getByRole('button', { name: 'Line Item' }).waitFor({ state: 'visible', timeout: 60000 });
  285 | 
  286 |         await app.pickDate('Sales Order Date');
  287 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  288 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');
  289 |         await fillCurrencyField(page, app);
  290 | 
  291 |         // Line 1: inventory item
  292 |         await page.getByRole('button', { name: 'Line Item' }).click();
  293 |         await addLineItemViaModal(page, app, 'Item', { qty: '2', unitPrice: '1000' });
  294 | 
  295 |         // Line 2: miscellaneous
  296 |         await page.getByRole('button', { name: 'Line Item' }).click();
  297 |         const modal2 = page.getByRole('dialog').last();
  298 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  299 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  300 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  301 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '300', description: 'Shipping' });
  302 |         } else {
  303 |             await page.keyboard.press('Escape');
  304 |             console.log('[INFO] Miscellaneous not available — adding second Item line');
  305 |             await page.getByRole('button', { name: 'Line Item' }).click();
  306 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '300' });
  307 |         }
  308 | 
  309 |         // Verify 2 rows appear in the SO items table before submit
  310 |         const tableRows = page.locator('table tbody tr');
  311 |         const rowCount = await tableRows.count();
  312 |         expect(rowCount).toBeGreaterThanOrEqual(2);
  313 |         console.log(`[AUDIT] ${rowCount} line items visible in SO form table`);
  314 | 
```