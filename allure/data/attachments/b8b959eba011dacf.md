# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> BILL-UI-02: Add Miscellaneous line via modal → Bill total reflects it
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:1028:9

# Error details

```
Error: [MODAL] Line item modal did not close after clicking Add/Save. Validation errors: Unit price is must be greater than 0
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
            - button "2019" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2019"
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
                      - button "Vendor selector" [ref=e211]: Zelalem H/Giorgis
                    - group [ref=e212]:
                      - generic [ref=e213]: Purchase Order
                      - button "Purchase Order selector" [ref=e214]
                    - generic [ref=e215]:
                      - group [ref=e216]:
                        - generic [ref=e217]: Invoice number
                        - textbox "Invoice number" [disabled] [ref=e219]: BILL/2026/08/17/001839
                      - paragraph [ref=e220]: Invoice number is auto-generated
                    - generic [ref=e221]:
                      - generic [ref=e222]: Due Date
                      - button "ነሀሴ 11, 2018" [ref=e224] [cursor=pointer]:
                        - img [ref=e225]
                        - generic [ref=e227]: ነሀሴ 11, 2018
                    - group [ref=e228]:
                      - generic [ref=e229]: Budget
                      - button "Budget selector" [ref=e230]: Select a budget
                  - generic [ref=e231]:
                    - generic [ref=e232]:
                      - generic [ref=e233]: Invoice Date
                      - button "ነሀሴ 17, 2018" [ref=e235] [cursor=pointer]:
                        - img [ref=e236]
                        - generic [ref=e238]: ነሀሴ 17, 2018
                    - group [ref=e239]:
                      - generic [ref=e240]: Accounts Payable *
                      - button "Accounts Payable selector" [ref=e241]: Petty Cash
                    - group [ref=e242]:
                      - generic [ref=e243]: Currency *
                      - button "Currency selector" [ref=e244]: Birr
                - generic [ref=e245]:
                  - generic [ref=e246]:
                    - tablist [ref=e247]:
                      - tab "Purchases" [selected] [ref=e248] [cursor=pointer]
                      - tab "Received Purchase Order" [ref=e249] [cursor=pointer]
                      - tab "Journal" [ref=e250] [cursor=pointer]
                      - tab "Miscelaneuos" [ref=e251] [cursor=pointer]
                      - tab "Upload Related Documents" [ref=e252] [cursor=pointer]
                    - button "Line Item" [expanded] [ref=e254] [cursor=pointer]:
                      - img [ref=e256]
                      - text: Line Item
                  - tabpanel "Purchases" [ref=e259]:
                    - table [ref=e263]:
                      - rowgroup [ref=e264]:
                        - row "Item Quantity Unit Price Purchase Type Description G/L Account * Project Before Tax * Tax Total" [ref=e265]:
                          - columnheader [ref=e266]
                          - columnheader "Item" [ref=e268]: Item
                          - columnheader "Quantity" [ref=e270]: Quantity
                          - columnheader "Unit Price" [ref=e272]: Unit Price
                          - columnheader "Purchase Type" [ref=e274]: Purchase Type
                          - columnheader "Description" [ref=e276]: Description
                          - columnheader "G/L Account *" [ref=e278]: G/L Account *
                          - columnheader "Project" [ref=e280]: Project
                          - columnheader "Before Tax *" [ref=e282]: Before Tax *
                          - columnheader "Tax" [ref=e284]: Tax
                          - columnheader "Total" [ref=e286]: Total
                          - columnheader [ref=e288]
                      - rowgroup [ref=e290]:
                        - row "No record found" [ref=e291]:
                          - cell "No record found" [ref=e292]:
                            - paragraph [ref=e294]: No record found
                      - rowgroup [ref=e295]:
                        - row "0.00 0.00 0.00" [ref=e296]:
                          - columnheader [ref=e297]
                          - columnheader [ref=e298]
                          - columnheader [ref=e299]
                          - columnheader [ref=e300]
                          - columnheader [ref=e301]
                          - columnheader [ref=e302]
                          - columnheader [ref=e303]
                          - columnheader [ref=e304]
                          - columnheader "0.00" [ref=e305]
                          - columnheader "0.00" [ref=e306]
                          - columnheader "0.00" [ref=e307]
                          - columnheader [ref=e308]
              - group [ref=e310]:
                - button "Add Now" [ref=e311] [cursor=pointer]
                - button [ref=e312] [cursor=pointer]:
                  - generic:
                    - img
        - generic [ref=e313]: BM Technology © 2026
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
  - dialog [ref=e315]:
    - generic [ref=e318]:
      - generic [ref=e319]:
        - generic [ref=e320]:
          - group [ref=e322]:
            - generic [ref=e323]: G/L Account *
            - button "G/L Account selector" [ref=e324]: Cash - Main Office
          - group [ref=e326]:
            - generic [ref=e327]: price
            - spinbutton [disabled] [ref=e329]
            - generic [ref=e330]: Unit price is must be greater than 0
          - group [ref=e332]:
            - generic [ref=e333]: Before Tax
            - spinbutton [ref=e335]
        - generic [ref=e336]:
          - generic [ref=e337]:
            - group [ref=e339]:
              - generic [ref=e340]: Description
              - textbox "Put your description here" [ref=e341]: Import duty
            - generic [ref=e342]: "Total: 0"
          - group [ref=e344]:
            - generic [ref=e345]: Tax
            - button "Tax selector" [ref=e346]: TOT
      - generic [ref=e347]:
        - generic [ref=e348]: "Total: 0"
        - generic [ref=e349]:
          - button "Back" [ref=e350] [cursor=pointer]
          - button "Cancel" [ref=e351] [cursor=pointer]
          - button "Add" [active] [ref=e352] [cursor=pointer]
```

# Test source

```ts
  189 |                 await menuList.waitFor({ state: 'visible', timeout: 3000 }).catch(() => { });
  190 | 
  191 |                 const searchInput = menuList.locator('input[placeholder*="search" i], input[type="text"], input').filter({ visible: true }).first();
  192 | 
  193 |                 if (targetItemName && await searchInput.isVisible().catch(() => false)) {
  194 |                     await searchInput.focus();
  195 |                     await searchInput.clear();
  196 |                     await searchInput.pressSequentially(targetItemName, { delay: 20 });
  197 |                     await page.waitForTimeout(600);
  198 |                 }
  199 | 
  200 |                 const options = menuList.locator('[role="menuitem"], [role="option"], .chakra-menu__menuitem, div.chakra-stack')
  201 |                     .filter({ hasNotText: /^Clear$/i })
  202 |                     .filter({ visible: true });
  203 | 
  204 |                 let count = await options.count();
  205 | 
  206 |                 if (count > 0) {
  207 |                     let clickedIndex = -1;
  208 |                     if (targetItemName) {
  209 |                         for (let k = 0; k < count; k++) {
  210 |                             const txt = (await options.nth(k).textContent().catch(() => ''))?.toLowerCase() || '';
  211 |                             if (txt.includes(targetItemName.toLowerCase())) {
  212 |                                 clickedIndex = k;
  213 |                                 break;
  214 |                             }
  215 |                         }
  216 |                     }
  217 |                     if (clickedIndex === -1) {
  218 |                         clickedIndex = 0;
  219 |                     }
  220 | 
  221 |                     const selOpt = options.nth(clickedIndex);
  222 |                     const optText = await selOpt.textContent().catch(() => '');
  223 |                     await selOpt.evaluate((node: HTMLElement) => (node as HTMLElement).click()).catch(() => selOpt.click({ force: true }));
  224 |                     console.log(`[ITEM MODAL] Selected item option [${clickedIndex}]: "${optText?.trim().replace(/\s+/g, ' ')}"`);
  225 |                     await page.waitForTimeout(1000);
  226 | 
  227 |                     // Inspect Selling Price field state
  228 |                     const priceInput = modal.locator('.chakra-form-control').filter({
  229 |                         has: page.locator('label, p, span, div').filter({ hasText: /^Selling Price|^Unit Price|^Before Tax/i })
  230 |                     }).locator('input').first();
  231 | 
  232 |                     if (await priceInput.isVisible({ timeout: 1500 }).catch(() => false)) {
  233 |                         const val = parseFloat(await priceInput.inputValue().catch(() => '0')) || 0;
  234 |                         const isDisabled = await priceInput.isDisabled().catch(() => false);
  235 |                         console.log(`[ITEM MODAL] Price check: val=$${val}, disabled=${isDisabled}`);
  236 | 
  237 |                         if (!isDisabled && val <= 0) {
  238 |                             await priceInput.click({ clickCount: 3, force: true }).catch(() => { });
  239 |                             await page.keyboard.type(targetItemPrice, { delay: 30 }).catch(() => { });
  240 |                             await page.keyboard.press('Tab').catch(() => { });
  241 |                         }
  242 |                     }
  243 |                     itemSelected = true;
  244 |                 } else {
  245 |                     await page.keyboard.press('Escape').catch(() => { });
  246 |                     await page.waitForTimeout(300);
  247 |                 }
  248 |             }
  249 | 
  250 |             await app.selectRandomOption(modal.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
  251 |             await app.selectRandomOption(modal.getByRole('button', { name: 'Location selector' }), 'Location');
  252 |         } else {
  253 |             // Miscellaneous: fill description
  254 |             const descField = modal.getByRole('textbox').first();
  255 |             if (await descField.isVisible({ timeout: 3000 }).catch(() => false)) {
  256 |                 await descField.fill(opts.description || 'Miscellaneous charge');
  257 |             }
  258 |         }
  259 | 
  260 |         // ── G/L Account ───────────────────────────────────────────────────────
  261 |         const glBtn = modal.getByRole('button', { name: 'G/L Account selector' });
  262 |         await glBtn.waitFor({ state: 'attached', timeout: 5000 }).catch(() => { });
  263 |         await app.selectRandomOption(glBtn, 'G/L Account');
  264 | 
  265 |         // ── Quantity ──────────────────────────────────────────────────────────
  266 |         const qtyControl = modal.locator('.chakra-form-control').filter({
  267 |             has: page.locator('label, p, span, div').filter({ hasText: /^Quantity/i })
  268 |         }).first();
  269 |         if (await qtyControl.isVisible({ timeout: 2000 }).catch(() => false)) {
  270 |             const qtyInput = qtyControl.locator('input').first();
  271 |             await qtyInput.click({ force: true }).catch(() => { });
  272 |             await qtyInput.fill(opts.qty);
  273 |             console.log(`[MODAL] Filled Quantity: ${opts.qty}`);
  274 |         }
  275 | 
  276 |         // ── Tax (optional) ────────────────────────────────────────────────────
  277 |         await app.selectRandomOption(modal.getByRole('button', { name: 'Tax selector' }), 'Tax', true);
  278 | 
  279 |         // ── Click Add / Save and verify modal closes ──────────────────────────
  280 |         const addBtn = modal.locator('button:has-text("Add"), button:has-text("Save")').first();
  281 |         await addBtn.scrollIntoViewIfNeeded();
  282 |         await addBtn.click();
  283 | 
  284 |         const closed = await modal.waitFor({ state: 'hidden', timeout: 15000 }).then(() => true).catch(() => false);
  285 |         if (!closed) {
  286 |             const errorText = await modal.locator(
  287 |                 '[class*="error"], [class*="invalid"], [role="alert"], .chakra-form__error-message, [data-status="error"]'
  288 |             ).allTextContents().catch(() => []);
> 289 |             throw new Error(
      |                   ^ Error: [MODAL] Line item modal did not close after clicking Add/Save. Validation errors: Unit price is must be greater than 0
  290 |                 `[MODAL] Line item modal did not close after clicking Add/Save. ` +
  291 |                 `Validation errors: ${errorText.join('; ') || 'none visible'}`
  292 |             );
  293 |         }
  294 |         console.log(`[MODAL] ${type} line item added successfully`);
  295 |     }
  296 | 
  297 |     // =========================================================================
  298 |     // SALES ORDER
  299 |     // =========================================================================
  300 | 
  301 |     test('SO-UI-01: Add inventory Line Item via modal → SO created and approved', async ({ page }) => {
  302 |         const app = new AppManager(page);
  303 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  304 | 
  305 |         // 1. Capture inventory item via API with selling_price > 0
  306 |         let targetItemName: string | undefined = itemA ? ((itemA as any).name || itemA.itemName) : undefined;
  307 |         let targetUnitPrice = '500';
  308 | 
  309 |         try {
  310 |             const { apiBase, headers, qs } = await app.buildApiContext();
  311 |             const res = await page.request.get(`${apiBase}/inventory-items?page=1&pageSize=50&${qs}`, { headers });
  312 |             if (res.ok()) {
  313 |                 const data = await res.json();
  314 |                 const itemsList = Array.isArray(data) ? data : (data.items || data.data || []);
  315 |                 const pricedItem = itemsList.find((i: any) => parseFloat(i.selling_price || '0') > 0) ||
  316 |                     itemsList.find((i: any) => parseFloat(i.unit_price || '0') > 0);
  317 |                 if (pricedItem) {
  318 |                     targetItemName = pricedItem.name || pricedItem.item_name;
  319 |                     const priceVal = parseFloat(pricedItem.selling_price || pricedItem.unit_price || '0');
  320 |                     if (priceVal > 0) targetUnitPrice = String(priceVal);
  321 |                     console.log(`[API ITEM CAPTURE] Captured item "${targetItemName}" with selling_price ${targetUnitPrice} via API.`);
  322 |                 } else if (itemA) {
  323 |                     targetItemName = (itemA as any).name || itemA.itemName;
  324 |                     targetUnitPrice = '100';
  325 |                     console.log(`[API ITEM CAPTURE] Using fresh WAC item "${targetItemName}" with price $100.`);
  326 |                 }
  327 |             }
  328 |         } catch (err) {
  329 |             console.log(`[API ITEM CAPTURE] Error capturing item: ${err}`);
  330 |         }
  331 | 
  332 |         // 2. Proceed to Sales Order creation UI
  333 |         await page.goto('/receivables/sale-orders/new', { waitUntil: 'domcontentloaded' });
  334 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  335 | 
  336 |         const lineItemBtn = page.locator('button:has-text("Line Item"), button:has-text("Add Line Item")').first();
  337 |         await lineItemBtn.waitFor({ state: 'visible', timeout: 60000 });
  338 | 
  339 |         await app.pickDate('Sales Order Date');
  340 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  341 |         await app.selectRandomOption(page.locator('.flex-col, .chakra-form-control').filter({ hasText: /Account.?Receivable/i }).locator('button').first(), 'Accounts Receivable');
  342 |         await fillCurrencyField(page, app);
  343 | 
  344 |         await lineItemBtn.click();
  345 |         await addLineItemViaModal(page, app, 'Item', { qty: '3', unitPrice: targetUnitPrice, itemName: targetItemName });
  346 |         console.log('[OK] Inventory line item added to SO');
  347 | 
  348 |         const addNowBtn = page.locator('button:has-text("Add Now"), button:has-text("Save"), button:has-text("Create")').first();
  349 |         await addNowBtn.click();
  350 |         await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });
  351 | 
  352 |         const soId = await app.extractIdFromUrl();
  353 |         await app.advanceDocumentAPI(soId, 'sales-orders');
  354 |         console.log('[PASS] SO with inventory line item created and approved');
  355 |     });
  356 | 
  357 |     test('SO-UI-02: Add Miscellaneous Line Item via modal → SO created and approved', async ({ page }) => {
  358 |         const app = new AppManager(page);
  359 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  360 |         await page.goto('/receivables/sale-orders/new', { waitUntil: 'domcontentloaded' });
  361 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  362 |         await page.getByRole('button', { name: 'Line Item' }).waitFor({ state: 'visible', timeout: 60000 });
  363 | 
  364 |         await app.pickDate('Sales Order Date');
  365 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  366 |         await app.selectRandomOption(page.locator('.flex-col, .chakra-form-control').filter({ hasText: /Account.?Receivable/i }).locator('button').first(), 'Accounts Receivable');
  367 |         await fillCurrencyField(page, app);
  368 | 
  369 |         await page.getByRole('button', { name: 'Line Item' }).click();
  370 |         const modal = page.getByRole('dialog').last();
  371 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  372 | 
  373 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  374 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  375 |             console.log('[SKIP] Miscellaneous button not present in SO modal');
  376 |             await page.keyboard.press('Escape');
  377 |             return;
  378 |         }
  379 | 
  380 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '750', description: 'Delivery fee' });
  381 |         console.log('[OK] Miscellaneous line item added to SO');
  382 | 
  383 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  384 |         await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });
  385 |         console.log('[PASS] SO with miscellaneous line item created');
  386 |     });
  387 | 
  388 |     test('SO-UI-03: Add both Item + Miscellaneous lines → totals shown in SO table', async ({ page }) => {
  389 |         const app = new AppManager(page);
```