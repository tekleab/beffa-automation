# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> PO-UI-03: Mixed Item + Miscellaneous lines → both rows in PO table
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:569:9

# Error details

```
TimeoutError: locator.click: Timeout 90000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Add Now' }).first()
    - locator resolved to <button disabled type="button" class="chakra-button css-jy0srd">Add Now</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    168 × waiting for element to be visible, enabled and stable
        - element is not enabled
      - retrying click action
        - waiting 500ms

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
                      - button "ሐምሌ 01, 2018" [ref=e215] [cursor=pointer]:
                        - img [ref=e216]
                        - generic [ref=e218]: ሐምሌ 01, 2018
                      - paragraph [ref=e219]: Selected date is after the period end date (ሰኔ 30, 2018).
                    - group [ref=e220]:
                      - generic [ref=e221]: Discount Term
                      - button "Discount Term selector" [ref=e222]
                    - group [ref=e223]:
                      - generic [ref=e224]: Budget
                      - button "Budget selector" [ref=e225]: Select a budget
                    - group [ref=e226]:
                      - generic [ref=e227]: Payment Term
                      - button "Payment Term selector" [ref=e228]
                  - generic [ref=e229]:
                    - group [ref=e230]:
                      - generic [ref=e231]: Vendor *
                      - button "Vendor selector" [ref=e232]: Zelalem H/Giorgis
                    - group [ref=e233]:
                      - generic [ref=e234]: Quotes
                      - button "Quotes selector" [ref=e235]
                    - group [ref=e236]:
                      - generic [ref=e237]: Accounts Payable *
                      - button "Accounts Payable selector" [ref=e238]: Cash at Bank - CBE
                    - group [ref=e239]:
                      - generic [ref=e240]: Purchase Type *
                      - button "Purchase Type selector" [ref=e241]: Taxable-imported Purchase of Capital Assets
                    - group [ref=e242]:
                      - generic [ref=e243]: Currency *
                      - button "Currency selector" [ref=e244]: Birr
                - generic [ref=e245]:
                  - generic [ref=e246]:
                    - tablist [ref=e247]:
                      - tab "Purchase Order Items" [selected] [ref=e248] [cursor=pointer]
                      - tab "PO Journal" [ref=e249] [cursor=pointer]
                      - tab "Upload Related Documents" [ref=e250] [cursor=pointer]
                    - button "Line Item" [active] [ref=e252] [cursor=pointer]:
                      - img [ref=e254]
                      - text: Line Item
                  - tabpanel "Purchase Order Items" [ref=e257]:
                    - table [ref=e261]:
                      - rowgroup [ref=e262]:
                        - row "Item Quantity Unit Price Purchase Type Description G/L Account * Project Before Tax * Tax Total" [ref=e263]:
                          - columnheader [ref=e264]
                          - columnheader "Item" [ref=e266]: Item
                          - columnheader "Quantity" [ref=e268]: Quantity
                          - columnheader "Unit Price" [ref=e270]: Unit Price
                          - columnheader "Purchase Type" [ref=e272]: Purchase Type
                          - columnheader "Description" [ref=e274]: Description
                          - columnheader "G/L Account *" [ref=e276]: G/L Account *
                          - columnheader "Project" [ref=e278]: Project
                          - columnheader "Before Tax *" [ref=e280]: Before Tax *
                          - columnheader "Tax" [ref=e282]: Tax
                          - columnheader "Total" [ref=e284]: Total
                          - columnheader [ref=e286]
                      - rowgroup [ref=e288]:
                        - row "inventory/RWT-9 - Helo sauna stone 20kg 4 1500 Goods Cash at Bank - Dashen 6000 15 6,900.00" [ref=e289]:
                          - cell [ref=e290]
                          - cell "inventory/RWT-9 - Helo sauna stone 20kg" [ref=e291]:
                            - generic [ref=e293]: inventory/RWT-9 - Helo sauna stone 20kg
                          - cell "4" [ref=e294]:
                            - generic [ref=e296]: "4"
                          - cell "1500" [ref=e297]:
                            - generic [ref=e299]: "1500"
                          - cell "Goods" [ref=e300]:
                            - generic [ref=e301]: Goods
                          - cell [ref=e302]
                          - cell "Cash at Bank - Dashen" [ref=e303]:
                            - generic [ref=e305]: Cash at Bank - Dashen
                          - cell [ref=e306]
                          - cell "6000" [ref=e307]:
                            - generic [ref=e309]: "6000"
                          - cell "15" [ref=e310]:
                            - generic [ref=e312]: "15"
                          - cell "6,900.00" [ref=e313]:
                            - generic [ref=e315]: 6,900.00
                          - cell [ref=e316]
                        - row "inventory/RWT-7 - spare part panecea 1 500 Goods Cash - Branch Office 500 15 575.00" [ref=e318]:
                          - cell [ref=e319]
                          - cell "inventory/RWT-7 - spare part panecea" [ref=e320]:
                            - generic [ref=e322]: inventory/RWT-7 - spare part panecea
                          - cell "1" [ref=e323]:
                            - generic [ref=e325]: "1"
                          - cell "500" [ref=e326]:
                            - generic [ref=e328]: "500"
                          - cell "Goods" [ref=e329]:
                            - generic [ref=e330]: Goods
                          - cell [ref=e331]
                          - cell "Cash - Branch Office" [ref=e332]:
                            - generic [ref=e334]: Cash - Branch Office
                          - cell [ref=e335]
                          - cell "500" [ref=e336]:
                            - generic [ref=e338]: "500"
                          - cell "15" [ref=e339]:
                            - generic [ref=e341]: "15"
                          - cell "575.00" [ref=e342]:
                            - generic [ref=e344]: "575.00"
                          - cell [ref=e345]
                        - row [ref=e347]:
                          - cell [ref=e348]
                          - cell [ref=e349]
                          - cell [ref=e350]
                          - cell [ref=e351]
                          - cell [ref=e352]
                          - cell [ref=e353]
                          - cell [ref=e354]
                          - cell [ref=e355]
                          - cell [ref=e356]
                          - cell [ref=e357]
                          - cell [ref=e358]
                          - cell [ref=e359]
                        - row [ref=e360]:
                          - cell [ref=e361]
                          - cell [ref=e362]
                          - cell [ref=e363]
                          - cell [ref=e364]
                          - cell [ref=e365]
                          - cell [ref=e366]
                          - cell [ref=e367]
                          - cell [ref=e368]
                          - cell [ref=e369]
                          - cell [ref=e370]
                          - cell [ref=e371]
                          - cell [ref=e372]
                        - row [ref=e373]:
                          - cell [ref=e374]
                          - cell [ref=e375]
                          - cell [ref=e376]
                          - cell [ref=e377]
                          - cell [ref=e378]
                          - cell [ref=e379]
                          - cell [ref=e380]
                          - cell [ref=e381]
                          - cell [ref=e382]
                          - cell [ref=e383]
                          - cell [ref=e384]
                          - cell [ref=e385]
                        - row [ref=e386]:
                          - cell [ref=e387]
                          - cell [ref=e388]
                          - cell [ref=e389]
                          - cell [ref=e390]
                          - cell [ref=e391]
                          - cell [ref=e392]
                          - cell [ref=e393]
                          - cell [ref=e394]
                          - cell [ref=e395]
                          - cell [ref=e396]
                          - cell [ref=e397]
                          - cell [ref=e398]
                        - row [ref=e399]:
                          - cell [ref=e400]
                          - cell [ref=e401]
                          - cell [ref=e402]
                          - cell [ref=e403]
                          - cell [ref=e404]
                          - cell [ref=e405]
                          - cell [ref=e406]
                          - cell [ref=e407]
                          - cell [ref=e408]
                          - cell [ref=e409]
                          - cell [ref=e410]
                          - cell [ref=e411]
                        - row [ref=e412]:
                          - cell [ref=e413]
                          - cell [ref=e414]
                          - cell [ref=e415]
                          - cell [ref=e416]
                          - cell [ref=e417]
                          - cell [ref=e418]
                          - cell [ref=e419]
                          - cell [ref=e420]
                          - cell [ref=e421]
                          - cell [ref=e422]
                          - cell [ref=e423]
                          - cell [ref=e424]
                        - row [ref=e425]:
                          - cell [ref=e426]
                          - cell [ref=e427]
                          - cell [ref=e428]
                          - cell [ref=e429]
                          - cell [ref=e430]
                          - cell [ref=e431]
                          - cell [ref=e432]
                          - cell [ref=e433]
                          - cell [ref=e434]
                          - cell [ref=e435]
                          - cell [ref=e436]
                          - cell [ref=e437]
                        - row [ref=e438]:
                          - cell [ref=e439]
                          - cell [ref=e440]
                          - cell [ref=e441]
                          - cell [ref=e442]
                          - cell [ref=e443]
                          - cell [ref=e444]
                          - cell [ref=e445]
                          - cell [ref=e446]
                          - cell [ref=e447]
                          - cell [ref=e448]
                          - cell [ref=e449]
                          - cell [ref=e450]
                        - row [ref=e451]:
                          - cell [ref=e452]
                          - cell [ref=e453]
                          - cell [ref=e454]
                          - cell [ref=e455]
                          - cell [ref=e456]
                          - cell [ref=e457]
                          - cell [ref=e458]
                          - cell [ref=e459]
                          - cell [ref=e460]
                          - cell [ref=e461]
                          - cell [ref=e462]
                          - cell [ref=e463]
                        - row [ref=e464]:
                          - cell [ref=e465]
                          - cell [ref=e466]
                          - cell [ref=e467]
                          - cell [ref=e468]
                          - cell [ref=e469]
                          - cell [ref=e470]
                          - cell [ref=e471]
                          - cell [ref=e472]
                          - cell [ref=e473]
                          - cell [ref=e474]
                          - cell [ref=e475]
                          - cell [ref=e476]
                        - row [ref=e477]:
                          - cell [ref=e478]
                          - cell [ref=e479]
                          - cell [ref=e480]
                          - cell [ref=e481]
                          - cell [ref=e482]
                          - cell [ref=e483]
                          - cell [ref=e484]
                          - cell [ref=e485]
                          - cell [ref=e486]
                          - cell [ref=e487]
                          - cell [ref=e488]
                          - cell [ref=e489]
                        - row [ref=e490]:
                          - cell [ref=e491]
                          - cell [ref=e492]
                          - cell [ref=e493]
                          - cell [ref=e494]
                          - cell [ref=e495]
                          - cell [ref=e496]
                          - cell [ref=e497]
                          - cell [ref=e498]
                          - cell [ref=e499]
                          - cell [ref=e500]
                          - cell [ref=e501]
                          - cell [ref=e502]
                        - row [ref=e503]:
                          - cell [ref=e504]
                          - cell [ref=e505]
                          - cell [ref=e506]
                          - cell [ref=e507]
                          - cell [ref=e508]
                          - cell [ref=e509]
                          - cell [ref=e510]
                          - cell [ref=e511]
                          - cell [ref=e512]
                          - cell [ref=e513]
                          - cell [ref=e514]
                          - cell [ref=e515]
                      - rowgroup [ref=e516]:
                        - row "6500.00 975.00 7475.00" [ref=e517]:
                          - columnheader [ref=e518]
                          - columnheader [ref=e519]
                          - columnheader [ref=e520]
                          - columnheader [ref=e521]
                          - columnheader [ref=e522]
                          - columnheader [ref=e523]
                          - columnheader [ref=e524]
                          - columnheader [ref=e525]
                          - columnheader "6500.00" [ref=e526]
                          - columnheader "975.00" [ref=e527]
                          - columnheader "7475.00" [ref=e528]
                          - columnheader [ref=e529]
              - group [ref=e531]:
                - button "Add Now" [disabled] [ref=e532]
                - button [disabled] [ref=e533]:
                  - generic:
                    - img
        - generic [ref=e534]: BM Technology © 2026
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
    - option "2018" [selected]
    - option "2019 (open)"
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
  501 |         const rct = await app.api.sales.createInvoiceReceiptAPI({
  502 |             invoiceId: inv.id, customerId: salesMeta.customerId,
  503 |             amount: AMOUNT, currencyId: salesMeta.currencyId, cashAccountId: salesMeta.cashAccountId,
  504 |         });
  505 |         await app.advanceDocumentAPI(rct.id, 'receipts');
  506 | 
  507 |         await page.waitForTimeout(3000);
  508 |         const invData = await app.api.sales.getInvoiceAPI(inv.id);
  509 |         const remaining = parseFloat(invData.unpaid_amount ?? invData.balance ?? invData.net_due ?? '999');
  510 |         console.log(`[AUDIT] Full receipt $${AMOUNT} → Remaining: $${remaining}`);
  511 |         expect(remaining).toBeLessThan(1);
  512 |         console.log('[PASS] Full receipt settles invoice to zero');
  513 |     });
  514 | 
  515 |     // =========================================================================
  516 |     // PURCHASE ORDER
  517 |     // =========================================================================
  518 | 
  519 |     test('PO-UI-01: Add inventory Line Item via modal → PO created and approved', async ({ page }) => {
  520 |         const app = new AppManager(page);
  521 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'networkidle' });
  522 | 
  523 |         await app.pickDate('Purchase Order Date');
  524 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  525 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  526 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  527 | 
  528 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  529 |         await page.getByRole('button', { name: 'Line Item' }).click();
  530 |         await addLineItemViaModal(page, app, 'Item', { qty: '5', unitPrice: '2000' });
  531 |         console.log('[OK] Inventory line item added to PO');
  532 | 
  533 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  534 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  535 | 
  536 |         const poId = await app.extractIdFromUrl();
  537 |         await app.advanceDocumentAPI(poId, 'purchase-orders');
  538 |         console.log('[PASS] PO with inventory line item created and approved');
  539 |     });
  540 | 
  541 |     test('PO-UI-02: Add Miscellaneous Line Item via modal → PO total reflects it', async ({ page }) => {
  542 |         const app = new AppManager(page);
  543 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'networkidle' });
  544 | 
  545 |         await app.pickDate('Purchase Order Date');
  546 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  547 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  548 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  549 | 
  550 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  551 |         await page.getByRole('button', { name: 'Line Item' }).click();
  552 |         const modal = page.getByRole('dialog').last();
  553 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  554 | 
  555 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  556 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  557 |             console.log('[SKIP] Miscellaneous button not present in PO modal');
  558 |             await page.keyboard.press('Escape');
  559 |             return;
  560 |         }
  561 | 
  562 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '3000', description: 'Freight charges' });
  563 | 
  564 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  565 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  566 |         console.log('[PASS] PO with miscellaneous line created');
  567 |     });
  568 | 
  569 |     test('PO-UI-03: Mixed Item + Miscellaneous lines → both rows in PO table', async ({ page }) => {
  570 |         const app = new AppManager(page);
  571 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'networkidle' });
  572 | 
  573 |         await app.pickDate('Purchase Order Date');
  574 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  575 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  576 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  577 | 
  578 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  579 | 
  580 |         // Line 1: inventory item
  581 |         await page.getByRole('button', { name: 'Line Item' }).click();
  582 |         await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: '1500' });
  583 | 
  584 |         // Line 2: miscellaneous
  585 |         await page.getByRole('button', { name: 'Line Item' }).click();
  586 |         const modal2 = page.getByRole('dialog').last();
  587 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  588 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  589 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  590 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '500', description: 'Import duty' });
  591 |         } else {
  592 |             await page.keyboard.press('Escape');
  593 |             await page.getByRole('button', { name: 'Line Item' }).click();
  594 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '500' });
  595 |         }
  596 | 
  597 |         const rowCount = await page.locator('table tbody tr').count();
  598 |         expect(rowCount).toBeGreaterThanOrEqual(2);
  599 |         console.log(`[AUDIT] ${rowCount} lines in PO form table`);
  600 | 
> 601 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
      |                                                                     ^ TimeoutError: locator.click: Timeout 90000ms exceeded.
  602 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  603 | 
  604 |         const poId = await app.extractIdFromUrl();
  605 |         const { apiBase, headers, qs } = await app.buildApiContext();
  606 |         const poData = await (await page.request.get(`${apiBase}/purchase-order/${poId}?${qs}`, { headers })).json();
  607 |         const lines: any[] = poData.po_items || [];
  608 |         expect(lines.length).toBeGreaterThanOrEqual(2);
  609 |         console.log(`[AUDIT] PO lines in API: ${lines.length}`);
  610 |         console.log('[PASS] PO mixed lines — all rows present in form and API');
  611 |     });
  612 | 
  613 |     test('PO-API-04: Multi-line PO → grand total = sum of lines', async ({ page }) => {
  614 |         const app = new AppManager(page);
  615 |         const { apiBase, headers, qs } = await app.buildApiContext();
  616 |         const L1 = 5 * 1000, L2 = 3 * 1500;
  617 | 
  618 |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  619 |         const allAccounts = acctData.items || acctData.data || [];
  620 |         const apAcct  = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable'))  || allAccounts[0];
  621 |         const glAcct  = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  622 |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  623 |         const currency = currData.items?.[0] || currData.data?.[0];
  624 | 
  625 |         const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
  626 |             headers,
  627 |             data: {
  628 |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  629 |                 vendor_id: purchaseMeta.vendorId,
  630 |                 po_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  631 |                 purchase_type_id: 4,
  632 |                 po_items: [
  633 |                     { item_id: itemA.itemId, quantity: 5, unit_price: 1000, amount: L1, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId },
  634 |                     { item_id: itemB.itemId, quantity: 3, unit_price: 1500, amount: L2, general_ledger_account_id: glAcct.id, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
  635 |                 ],
  636 |             },
  637 |         });
  638 | 
  639 |         expect(resp.ok(), `Multi-line PO failed: HTTP ${resp.status()}`).toBe(true);
  640 |         const data = await resp.json();
  641 |         const linesSum = (data.po_items || []).reduce((s: number, l: any) => s + parseFloat(l.amount ?? String(parseFloat(l.quantity) * parseFloat(l.unit_price))), 0);
  642 |         console.log(`[AUDIT] PO lines sum: $${linesSum} | Expected: $${L1 + L2}`);
  643 |         expect(linesSum).toBeCloseTo(L1 + L2, 1);
  644 |         console.log('[PASS] Multi-line PO totals correct');
  645 |     });
  646 | 
  647 |     test('PO-API-05: Miscellaneous line on PO (no item_id) → accepted or inventory-only enforced', async ({ page }) => {
  648 |         const app = new AppManager(page);
  649 |         const { apiBase, headers, qs } = await app.buildApiContext();
  650 | 
  651 |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  652 |         const allAccounts = acctData.items || acctData.data || [];
  653 |         const apAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
  654 |         const glAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  655 |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  656 |         const currency = currData.items?.[0] || currData.data?.[0];
  657 | 
  658 |         const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
  659 |             headers,
  660 |             data: {
  661 |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  662 |                 vendor_id: purchaseMeta.vendorId,
  663 |                 po_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  664 |                 purchase_type_id: 4,
  665 |                 po_items: [{ description: 'Freight & customs', quantity: 1, unit_price: 3000, amount: 3000, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
  666 |             },
  667 |         });
  668 | 
  669 |         if (resp.ok()) {
  670 |             const amt = parseFloat(((await resp.json()).po_items || [])[0]?.amount ?? '0');
  671 |             console.log(`[INFO] PO miscellaneous line accepted: $${amt}`);
  672 |         } else {
  673 |             console.log(`[INFO] PO enforces item_id: HTTP ${resp.status()}`);
  674 |             expect([400, 422]).toContain(resp.status());
  675 |         }
  676 |     });
  677 | 
  678 |     // =========================================================================
  679 |     // BILL
  680 |     // =========================================================================
  681 | 
  682 |     test('BILL-UI-01: Add inventory Line Item via modal → Bill created and approved', async ({ page }) => {
  683 |         const app = new AppManager(page);
  684 |         await page.goto('/payables/bills/new', { waitUntil: 'networkidle' });
  685 | 
  686 |         await app.pickDate('Invoice Date');
  687 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  688 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  689 |         await app.selectRandomOption(page.getByRole('button', { name: 'Currency selector' }), 'Currency', true);
  690 | 
  691 |         await page.getByRole('button', { name: 'Line Item' }).click();
  692 |         await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: '2500' });
  693 |         console.log('[OK] Inventory line item added to Bill');
  694 | 
  695 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  696 |         await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 });
  697 | 
  698 |         const billId = await app.extractIdFromUrl();
  699 |         await app.advanceDocumentAPI(billId, 'bills');
  700 |         console.log('[PASS] Bill with inventory line created and approved');
  701 |     });
```