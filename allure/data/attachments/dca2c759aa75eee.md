# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> PO-UI-03: Mixed Item + Miscellaneous lines → both rows in PO table
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:1118:9

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 2
Received:    0
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
                      - link "Detail" [ref=e185] [cursor=pointer]:
                        - /url: /payables/purchase-orders/060283e5-890f-4789-aeee-3f99d155773d/detail
            - button "2019" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2019"
              - img [ref=e189]
          - generic [ref=e192]:
            - button "Toggle Visibility" [ref=e195] [cursor=pointer]:
              - img [ref=e196]
            - generic [ref=e201]:
              - generic [ref=e203]:
                - heading "Purchase Order Details" [level=3] [ref=e204]
                - generic [ref=e205]:
                  - generic [ref=e207]:
                    - button "edit" [ref=e209] [cursor=pointer]:
                      - img [ref=e211]
                      - paragraph [ref=e214]: edit
                    - button "approval-step" [ref=e216] [cursor=pointer]:
                      - img [ref=e218]
                      - paragraph [ref=e220]: Approve
                    - button "cancel" [disabled] [ref=e222]:
                      - img [ref=e224]
                      - paragraph [ref=e226]: cancel
                    - button "archive" [ref=e228] [cursor=pointer]:
                      - img [ref=e230]
                      - paragraph [ref=e233]: archive
                    - button "Reverse" [disabled] [ref=e235]:
                      - img [ref=e237]
                      - paragraph [ref=e240]: Reverse
                  - button "Purchase Order Journal Detail" [ref=e241] [cursor=pointer]:
                    - img [ref=e243]
                    - text: POJ
                  - button "Print" [ref=e245] [cursor=pointer]:
                    - img [ref=e247]
                    - text: Print
              - generic [ref=e251]:
                - generic [ref=e252]:
                  - generic [ref=e253]:
                    - paragraph [ref=e254]: "Order Date:"
                    - paragraph [ref=e255]: Thursday, August 27th 2026
                  - generic [ref=e256]:
                    - paragraph [ref=e257]: "PO Number:"
                    - paragraph [ref=e258]: PO/2026/08/21/001504
                  - generic [ref=e259]:
                    - paragraph [ref=e260]: "PO Status:"
                    - generic [ref=e262]:
                      - generic [ref=e264]: Draft
                      - img [ref=e266]
                  - generic [ref=e268]:
                    - paragraph [ref=e269]: "Account Payable:"
                    - paragraph [ref=e270]: 1006 - Cash at Bank - Dashen
                  - generic [ref=e271]:
                    - paragraph [ref=e272]: "Currency:"
                    - paragraph [ref=e273]: Birr - BRR
                  - generic [ref=e274]:
                    - paragraph [ref=e275]: "vendor:"
                    - paragraph [ref=e276]: Addis Wholesale Trading-5739
                  - generic [ref=e277]:
                    - paragraph [ref=e278]: "Discount Terms:"
                    - paragraph
                - generic [ref=e279]:
                  - generic [ref=e280]:
                    - paragraph [ref=e281]: Shipping Address
                    - button "update vendor address" [ref=e282] [cursor=pointer]:
                      - img [ref=e283]
                  - generic [ref=e287]:
                    - paragraph [ref=e288]: "Region:"
                    - paragraph
                  - generic [ref=e289]:
                    - paragraph [ref=e290]: "Zone:"
                    - paragraph
                  - generic [ref=e291]:
                    - paragraph [ref=e292]: "Woreda:"
                    - paragraph
                  - generic [ref=e293]:
                    - paragraph [ref=e294]: "City:"
                    - paragraph
                  - generic [ref=e295]:
                    - paragraph [ref=e296]: "Kebele:"
                    - paragraph
                  - generic [ref=e297]:
                    - paragraph [ref=e298]: "House No.:"
                    - paragraph
              - generic [ref=e299]:
                - tablist [ref=e300]:
                  - tab "Purchase Order Items" [selected] [ref=e301] [cursor=pointer]
                  - tab "PO Journal" [ref=e302] [cursor=pointer]
                  - tab "Related Documents" [ref=e303] [cursor=pointer]
                  - tab "History" [ref=e304] [cursor=pointer]
                - tabpanel "Purchase Order Items" [ref=e306]:
                  - generic [ref=e307]:
                    - table [ref=e310]:
                      - rowgroup [ref=e311]:
                        - row "Item ID Quantity Selling Price Purchase Type Description G/L Account Project Before Tax Tax Total" [ref=e312]:
                          - columnheader "Item ID" [ref=e313]: Item ID
                          - columnheader "Quantity" [ref=e315]: Quantity
                          - columnheader "Selling Price" [ref=e317]: Selling Price
                          - columnheader "Purchase Type" [ref=e319]: Purchase Type
                          - columnheader "Description" [ref=e321]: Description
                          - columnheader "G/L Account" [ref=e323]: G/L Account
                          - columnheader "Project" [ref=e325]: Project
                          - columnheader "Before Tax" [ref=e327]: Before Tax
                          - columnheader "Tax" [ref=e329]: Tax
                          - columnheader "Total" [ref=e331]: Total
                      - rowgroup [ref=e333]:
                        - row "1 miscellaneous Petty Cash [object Object]" [ref=e334]:
                          - cell [ref=e335]
                          - cell "1" [ref=e336]:
                            - generic [ref=e337]: "1"
                          - cell [ref=e338]
                          - cell "miscellaneous" [ref=e339]:
                            - generic [ref=e340]: miscellaneous
                          - cell [ref=e341]
                          - cell "Petty Cash" [ref=e342]:
                            - generic [ref=e343]: Petty Cash
                          - cell [ref=e344]
                          - cell [ref=e345]
                          - cell "[object Object]" [ref=e346]:
                            - generic [ref=e347]: "[object Object]"
                          - cell [ref=e348]
                        - row "4 miscellaneous Prepayment [object Object]" [ref=e349]:
                          - cell [ref=e350]
                          - cell "4" [ref=e351]:
                            - generic [ref=e352]: "4"
                          - cell [ref=e353]
                          - cell "miscellaneous" [ref=e354]:
                            - generic [ref=e355]: miscellaneous
                          - cell [ref=e356]
                          - cell "Prepayment" [ref=e357]:
                            - generic [ref=e358]: Prepayment
                          - cell [ref=e359]
                          - cell [ref=e360]
                          - cell "[object Object]" [ref=e361]:
                            - generic [ref=e362]: "[object Object]"
                          - cell [ref=e363]
                        - row [ref=e364]:
                          - cell [ref=e365]
                          - cell [ref=e366]
                          - cell [ref=e367]
                          - cell [ref=e368]
                          - cell [ref=e369]
                          - cell [ref=e370]
                          - cell [ref=e371]
                          - cell [ref=e372]
                          - cell [ref=e373]
                          - cell [ref=e374]
                        - row [ref=e375]:
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
                        - row [ref=e397]:
                          - cell [ref=e398]
                          - cell [ref=e399]
                          - cell [ref=e400]
                          - cell [ref=e401]
                          - cell [ref=e402]
                          - cell [ref=e403]
                          - cell [ref=e404]
                          - cell [ref=e405]
                          - cell [ref=e406]
                          - cell [ref=e407]
                        - row [ref=e408]:
                          - cell [ref=e409]
                          - cell [ref=e410]
                          - cell [ref=e411]
                          - cell [ref=e412]
                          - cell [ref=e413]
                          - cell [ref=e414]
                          - cell [ref=e415]
                          - cell [ref=e416]
                          - cell [ref=e417]
                          - cell [ref=e418]
                        - row [ref=e419]:
                          - cell [ref=e420]
                          - cell [ref=e421]
                          - cell [ref=e422]
                          - cell [ref=e423]
                          - cell [ref=e424]
                          - cell [ref=e425]
                          - cell [ref=e426]
                          - cell [ref=e427]
                          - cell [ref=e428]
                          - cell [ref=e429]
                        - row [ref=e430]:
                          - cell [ref=e431]
                          - cell [ref=e432]
                          - cell [ref=e433]
                          - cell [ref=e434]
                          - cell [ref=e435]
                          - cell [ref=e436]
                          - cell [ref=e437]
                          - cell [ref=e438]
                          - cell [ref=e439]
                          - cell [ref=e440]
                        - row [ref=e441]:
                          - cell [ref=e442]
                          - cell [ref=e443]
                          - cell [ref=e444]
                          - cell [ref=e445]
                          - cell [ref=e446]
                          - cell [ref=e447]
                          - cell [ref=e448]
                          - cell [ref=e449]
                          - cell [ref=e450]
                          - cell [ref=e451]
                        - row [ref=e452]:
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
                        - row [ref=e463]:
                          - cell [ref=e464]
                          - cell [ref=e465]
                          - cell [ref=e466]
                          - cell [ref=e467]
                          - cell [ref=e468]
                          - cell [ref=e469]
                          - cell [ref=e470]
                          - cell [ref=e471]
                          - cell [ref=e472]
                          - cell [ref=e473]
                        - row [ref=e474]:
                          - cell [ref=e475]
                          - cell [ref=e476]
                          - cell [ref=e477]
                          - cell [ref=e478]
                          - cell [ref=e479]
                          - cell [ref=e480]
                          - cell [ref=e481]
                          - cell [ref=e482]
                          - cell [ref=e483]
                          - cell [ref=e484]
                        - row [ref=e485]:
                          - cell [ref=e486]
                          - cell [ref=e487]
                          - cell [ref=e488]
                          - cell [ref=e489]
                          - cell [ref=e490]
                          - cell [ref=e491]
                          - cell [ref=e492]
                          - cell [ref=e493]
                          - cell [ref=e494]
                          - cell [ref=e495]
                        - row [ref=e496]:
                          - cell [ref=e497]
                          - cell [ref=e498]
                          - cell [ref=e499]
                          - cell [ref=e500]
                          - cell [ref=e501]
                          - cell [ref=e502]
                          - cell [ref=e503]
                          - cell [ref=e504]
                          - cell [ref=e505]
                          - cell [ref=e506]
                      - rowgroup [ref=e507]:
                        - row "0.00 500500.00" [ref=e508]:
                          - columnheader [ref=e509]
                          - columnheader [ref=e510]
                          - columnheader [ref=e511]
                          - columnheader [ref=e512]
                          - columnheader [ref=e513]
                          - columnheader [ref=e514]
                          - columnheader [ref=e515]
                          - columnheader [ref=e516]
                          - columnheader "0.00" [ref=e517]
                          - columnheader "500500.00" [ref=e518]
                    - generic [ref=e519]:
                      - generic [ref=e521]:
                        - combobox [ref=e522]:
                          - option "Show 5 rows"
                          - option "Show 10 rows"
                          - option "Show 15 rows" [selected]
                          - option "Show 25 rows"
                          - option "Show 50 rows"
                          - option "Show 100 rows"
                        - generic:
                          - img
                      - generic [ref=e524]:
                        - button "go to first page" [disabled] [ref=e525]:
                          - img [ref=e526]
                        - generic [ref=e528]:
                          - button "go to previous page" [disabled] [ref=e529]:
                            - img [ref=e530]
                          - paragraph [ref=e532]: Page
                          - paragraph [ref=e533]: 1 of 1
                          - button "go to next page" [disabled] [ref=e534]:
                            - img [ref=e535]
                        - button "go to last page" [disabled] [ref=e537]:
                          - img [ref=e538]
        - generic [ref=e540]: BM Technology © 2026
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right":
      - status [ref=e541]:
        - generic [ref=e542]:
          - img [ref=e544]
          - generic [ref=e547]: Purchase Order Created
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right":
      - status [ref=e548]:
        - generic [ref=e549]:
          - img [ref=e551]
          - generic [ref=e554]: Purchase Order Created
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
```

# Test source

```ts
  1063 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'domcontentloaded' });
  1064 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  1065 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).waitFor({ state: 'visible', timeout: 60000 });
  1066 | 
  1067 |         await app.pickDate('Purchase Order Date');
  1068 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1069 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  1070 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  1071 | 
  1072 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  1073 | 
  1074 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  1075 |         await page.getByRole('button', { name: 'Line Item' }).click();
  1076 |         await addLineItemViaModal(page, app, 'Item', { qty: '5', unitPrice: capturedItem?.price || '2000', itemName: capturedItem?.name });
  1077 |         console.log('[OK] Inventory line item added to PO');
  1078 | 
  1079 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  1080 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  1081 | 
  1082 |         const poId = await app.extractIdFromUrl();
  1083 |         await app.advanceDocumentAPI(poId, 'purchase-orders');
  1084 |         console.log('[PASS] PO with inventory line item created and approved');
  1085 |     });
  1086 | 
  1087 |     test('PO-UI-02: Add Miscellaneous Line Item via modal → PO total reflects it', async ({ page }) => {
  1088 |         const app = new AppManager(page);
  1089 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1090 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'domcontentloaded' });
  1091 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  1092 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).waitFor({ state: 'visible', timeout: 60000 });
  1093 | 
  1094 |         await app.pickDate('Purchase Order Date');
  1095 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1096 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  1097 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  1098 | 
  1099 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  1100 |         await page.getByRole('button', { name: 'Line Item' }).click();
  1101 |         const modal = page.getByRole('dialog').last();
  1102 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  1103 | 
  1104 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  1105 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  1106 |             console.log('[SKIP] Miscellaneous button not present in PO modal');
  1107 |             await page.keyboard.press('Escape');
  1108 |             return;
  1109 |         }
  1110 | 
  1111 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '3000', description: 'Freight charges' });
  1112 | 
  1113 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  1114 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  1115 |         console.log('[PASS] PO with miscellaneous line created');
  1116 |     });
  1117 | 
  1118 |     test('PO-UI-03: Mixed Item + Miscellaneous lines → both rows in PO table', async ({ page }) => {
  1119 |         const app = new AppManager(page);
  1120 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1121 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'domcontentloaded' });
  1122 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  1123 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).waitFor({ state: 'visible', timeout: 60000 });
  1124 | 
  1125 |         await app.pickDate('Purchase Order Date');
  1126 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1127 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  1128 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  1129 | 
  1130 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  1131 | 
  1132 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  1133 | 
  1134 |         // Line 1: inventory item
  1135 |         await page.getByRole('button', { name: 'Line Item' }).click();
  1136 |         await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: capturedItem?.price || '1500', itemName: capturedItem?.name });
  1137 | 
  1138 |         // Line 2: miscellaneous
  1139 |         await page.getByRole('button', { name: 'Line Item' }).click();
  1140 |         const modal2 = page.getByRole('dialog').last();
  1141 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  1142 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  1143 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  1144 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '500', description: 'Import duty' });
  1145 |         } else {
  1146 |             await page.keyboard.press('Escape');
  1147 |             await page.getByRole('button', { name: 'Line Item' }).click();
  1148 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: capturedItem?.price || '500', itemName: capturedItem?.name });
  1149 |         }
  1150 | 
  1151 |         await expect.poll(async () => page.locator('table tbody tr').count(), { timeout: 10000 }).toBeGreaterThanOrEqual(2);
  1152 |         const rowCount = await page.locator('table tbody tr').count();
  1153 |         expect(rowCount).toBeGreaterThanOrEqual(2);
  1154 |         console.log(`[AUDIT] ${rowCount} lines in PO form table`);
  1155 | 
  1156 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  1157 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  1158 | 
  1159 |         const poId = await app.extractIdFromUrl();
  1160 |         const { apiBase, headers, qs } = await app.buildApiContext();
  1161 |         const poData = await (await page.request.get(`${apiBase}/purchase-order/${poId}?${qs}`, { headers })).json();
  1162 |         const lines: any[] = poData.po_items || [];
> 1163 |         expect(lines.length).toBeGreaterThanOrEqual(2);
       |                              ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
  1164 |         console.log(`[AUDIT] PO lines in API: ${lines.length}`);
  1165 |         console.log('[PASS] PO mixed lines — all rows present in form and API');
  1166 |     });
  1167 | 
  1168 |     test('PO-API-04: Multi-line PO → grand total = sum of lines', async ({ page }) => {
  1169 |         const app = new AppManager(page);
  1170 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1171 |         const { apiBase, headers, qs } = await app.buildApiContext();
  1172 |         const L1 = 5 * 1000, L2 = 3 * 1500;
  1173 |         const { DateHelper } = require('../../lib/utils/DateHelper');
  1174 |         const dateIso = (await DateHelper.resolve(page)).iso;
  1175 | 
  1176 |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  1177 |         const allAccounts = acctData.items || acctData.data || [];
  1178 |         const apAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
  1179 |         const glAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  1180 |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  1181 |         const currency = currData.items?.[0] || currData.data?.[0];
  1182 | 
  1183 |         const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
  1184 |             headers,
  1185 |             data: {
  1186 |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  1187 |                 vendor_id: purchaseMeta.vendorId,
  1188 |                 po_date: dateIso,
  1189 |                 purchase_type_id: 4,
  1190 |                 po_items: [
  1191 |                     { item_id: itemA.itemId, quantity: 5, unit_price: 1000, amount: L1, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId },
  1192 |                     { item_id: itemB.itemId, quantity: 3, unit_price: 1500, amount: L2, general_ledger_account_id: glAcct.id, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
  1193 |                 ],
  1194 |             },
  1195 |         });
  1196 | 
  1197 |         expect(resp.ok(), `Multi-line PO failed: HTTP ${resp.status()}`).toBe(true);
  1198 |         const data = await resp.json();
  1199 |         const linesSum = (data.po_items || []).reduce((s: number, l: any) => s + parseFloat(l.amount ?? String(parseFloat(l.quantity) * parseFloat(l.unit_price))), 0);
  1200 |         console.log(`[AUDIT] PO lines sum: $${linesSum} | Expected: $${L1 + L2}`);
  1201 |         expect(linesSum).toBeCloseTo(L1 + L2, 1);
  1202 |         console.log('[PASS] Multi-line PO totals correct');
  1203 |     });
  1204 | 
  1205 |     test('PO-API-05: Miscellaneous line on PO (no item_id) → accepted or inventory-only enforced', async ({ page }) => {
  1206 |         const app = new AppManager(page);
  1207 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1208 |         const { apiBase, headers, qs } = await app.buildApiContext();
  1209 | 
  1210 |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  1211 |         const allAccounts = acctData.items || acctData.data || [];
  1212 |         const apAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
  1213 |         const glAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  1214 |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  1215 |         const currency = currData.items?.[0] || currData.data?.[0];
  1216 | 
  1217 |         const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
  1218 |             headers,
  1219 |             data: {
  1220 |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  1221 |                 vendor_id: purchaseMeta.vendorId,
  1222 |                 po_date: periodDateIso,
  1223 |                 purchase_type_id: 4,
  1224 |                 po_items: [{ description: 'Freight & customs', quantity: 1, unit_price: 3000, amount: 3000, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
  1225 |             },
  1226 |         });
  1227 | 
  1228 |         if (resp.ok()) {
  1229 |             const amt = parseFloat(((await resp.json()).po_items || [])[0]?.amount ?? '0');
  1230 |             console.log(`[INFO] PO miscellaneous line accepted: $${amt}`);
  1231 |         } else {
  1232 |             console.log(`[INFO] PO enforces item_id: HTTP ${resp.status()}`);
  1233 |             expect([400, 422]).toContain(resp.status());
  1234 |         }
  1235 |     });
  1236 | 
  1237 |     // =========================================================================
  1238 |     // BILL
  1239 |     // =========================================================================
  1240 | 
  1241 |     test('BILL-UI-01: Add inventory Line Item via modal → Bill created and approved', async ({ page }) => {
  1242 |         const app = new AppManager(page);
  1243 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1244 |         await page.goto('/payables/bills/new', { waitUntil: 'domcontentloaded' });
  1245 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  1246 |         await page.getByRole('button', { name: 'Line Item' }).waitFor({ state: 'visible', timeout: 60000 });
  1247 | 
  1248 |         await app.pickDate('Invoice Date');
  1249 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1250 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  1251 |         await fillCurrencyField(page, app);
  1252 | 
  1253 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  1254 | 
  1255 |         await page.getByRole('button', { name: 'Line Item' }).click();
  1256 |         await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: capturedItem?.price || '2500', itemName: capturedItem?.name });
  1257 |         console.log('[OK] Inventory line item added to Bill');
  1258 | 
  1259 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  1260 |         await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 });
  1261 | 
  1262 |         const billId = await app.extractIdFromUrl();
  1263 |         await app.advanceDocumentAPI(billId, 'bills');
```