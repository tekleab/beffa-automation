# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @regression >> PO-UI-03: Mixed Item + Miscellaneous lines → both rows in PO table
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:1184:9

# Error details

```
TimeoutError: page.waitForURL: Timeout 60000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "http://168.119.175.142:4173/payables/purchase-orders/new"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]: Enterprise
      - textbox "Search tasks" [ref=e14]
      - generic [ref=e15]:
        - navigation [ref=e17]:
          - link [ref=e18] [cursor=pointer]:
            - /url: /dashboard
            - paragraph [ref=e21]: Dashboard
        - generic [ref=e23] [cursor=pointer]:
          - paragraph [ref=e26]: Accounting
          - paragraph [ref=e27]:
            - button "Toggle section" [ref=e28]
        - generic [ref=e32] [cursor=pointer]:
          - paragraph [ref=e35]: Account Reconciliation
          - paragraph [ref=e36]:
            - button "Toggle section" [ref=e37]
        - generic [ref=e41] [cursor=pointer]:
          - paragraph [ref=e44]: CRM
          - paragraph [ref=e45]:
            - button "Toggle section" [ref=e46]
        - generic [ref=e50] [cursor=pointer]:
          - paragraph [ref=e53]: HRM
          - paragraph [ref=e54]:
            - button "Toggle section" [ref=e55]
        - generic [ref=e59] [cursor=pointer]:
          - paragraph [ref=e62]: Project Management
          - paragraph [ref=e63]:
            - button "Toggle section" [ref=e64]
        - generic [ref=e68] [cursor=pointer]:
          - paragraph [ref=e71]: SCM
          - paragraph [ref=e72]:
            - button "Toggle section" [ref=e73]
        - generic [ref=e77] [cursor=pointer]:
          - paragraph [ref=e80]: Lease Management
          - paragraph [ref=e81]:
            - button "Toggle section" [ref=e82]
        - generic [ref=e86] [cursor=pointer]:
          - paragraph [ref=e89]: Service Management
          - paragraph [ref=e90]:
            - button "Toggle section" [ref=e91]
        - generic [ref=e95] [cursor=pointer]:
          - paragraph [ref=e98]: Report
          - paragraph [ref=e99]:
            - button "Toggle section" [ref=e100]
      - generic [ref=e103]:
        - button "Settings" [ref=e105] [cursor=pointer]:
          - generic:
            - generic:
              - paragraph: Settings
        - navigation [ref=e107]:
          - link [ref=e109] [cursor=pointer]:
            - /url: /settings/general/users
            - generic [ref=e110]:
              - paragraph [ref=e114]: User Management
              - button [ref=e115]
        - button [ref=e118] [cursor=pointer]
    - generic [ref=e122]:
      - generic [ref=e123]:
        - generic [ref=e124]:
          - img "BM Tech" [ref=e126]: BT
          - generic [ref=e127]:
            - button [ref=e128] [cursor=pointer]
            - generic [ref=e132] [cursor=pointer]:
              - button "Company Detail" [ref=e133]
              - button "Edit Company" [ref=e137]
              - button "Company Detail" [ref=e141]
        - generic [ref=e145]:
          - button [ref=e146] [cursor=pointer]
          - generic [ref=e152] [cursor=pointer]:
            - generic [ref=e153]: "5"
            - img "Notifications" [ref=e154]
          - button [ref=e157] [cursor=pointer]:
            - paragraph [ref=e160]: EC
          - button [ref=e161] [cursor=pointer]
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
            - button "2019" [ref=e187] [cursor=pointer]
          - generic [ref=e192]:
            - button "Toggle Visibility" [ref=e195] [cursor=pointer]
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
                      - button "መስከረም 12, 2019" [ref=e215] [cursor=pointer]
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
                      - button "Vendor selector" [ref=e231]: KAMARIYA PLC
                    - group [ref=e232]:
                      - generic [ref=e233]: Quotes
                      - button "Quotes selector" [ref=e234]
                    - group [ref=e235]:
                      - generic [ref=e236]: Accounts Payable *
                      - button "Accounts Payable selector" [ref=e237]: Accounts Payable
                    - group [ref=e238]:
                      - generic [ref=e239]: Purchase Type *
                      - button "Purchase Type selector" [ref=e240]: Taxable-imported Purchase of Inputs
                    - group [ref=e241]:
                      - generic [ref=e242]: Currency *
                      - button "Currency selector" [ref=e243]
                      - generic [ref=e244]: Currency must be provided.
                - generic [ref=e245]:
                  - generic [ref=e246]:
                    - tablist [ref=e247]:
                      - tab "Purchase Order Items" [selected] [ref=e248] [cursor=pointer]
                      - tab "PO Journal" [ref=e249] [cursor=pointer]
                      - tab "Upload Related Documents" [ref=e250] [cursor=pointer]
                    - button [ref=e252] [cursor=pointer]
                  - tabpanel "Purchase Order Items" [ref=e257]:
                    - table [ref=e261]:
                      - rowgroup [ref=e262]:
                        - row [ref=e263]:
                          - columnheader [ref=e264]
                          - columnheader "Item" [ref=e266]
                          - columnheader "Quantity" [ref=e268]
                          - columnheader "Unit Price" [ref=e270]
                          - columnheader "Purchase Type" [ref=e272]
                          - columnheader "Description" [ref=e274]
                          - columnheader "G/L Account *" [ref=e276]
                          - columnheader "Project" [ref=e278]
                          - columnheader "Before Tax *" [ref=e280]
                          - columnheader "Tax" [ref=e282]
                          - columnheader "Total" [ref=e284]
                          - columnheader [ref=e286]
                      - rowgroup [ref=e288]:
                        - row [ref=e289]:
                          - cell [ref=e290]
                          - cell "ITM-FIFO-085254415 - FIFO-Item-1790085254415" [ref=e291]
                          - cell "4" [ref=e294]
                          - cell "100.00" [ref=e297]
                          - cell "Goods" [ref=e300]
                          - cell [ref=e302]
                          - cell "Prepayment" [ref=e303]
                          - cell [ref=e306]
                          - cell "400" [ref=e307]
                          - cell "2" [ref=e310]
                          - cell "408.00" [ref=e313]
                          - cell [ref=e316]:
                            - generic [ref=e319]:
                              - img [ref=e320] [cursor=pointer]
                              - img [ref=e324] [cursor=pointer]
                        - row [ref=e327]:
                          - cell [ref=e328]
                          - cell "ITM-FIFO-085254415 - FIFO-Item-1790085254415" [ref=e329]
                          - cell "1" [ref=e332]
                          - cell "100.00" [ref=e335]
                          - cell "Goods" [ref=e338]
                          - cell [ref=e340]
                          - cell "Inventory" [ref=e341]
                          - cell [ref=e344]
                          - cell "100" [ref=e345]
                          - cell "2" [ref=e348]
                          - cell "102.00" [ref=e351]
                          - cell [ref=e354]:
                            - generic [ref=e357]:
                              - img [ref=e358] [cursor=pointer]
                              - img [ref=e362] [cursor=pointer]
                        - row [ref=e365]:
                          - cell [ref=e366]
                          - cell [ref=e367]
                          - cell [ref=e368]
                          - cell [ref=e369]
                          - cell [ref=e370]
                          - cell [ref=e371]
                          - cell [ref=e372]
                          - cell [ref=e373]
                          - cell [ref=e374]
                          - cell [ref=e375]
                          - cell [ref=e376]
                          - cell [ref=e377]
                        - row [ref=e378]:
                          - cell [ref=e379]
                          - cell [ref=e380]
                          - cell [ref=e381]
                          - cell [ref=e382]
                          - cell [ref=e383]
                          - cell [ref=e384]
                          - cell [ref=e385]
                          - cell [ref=e386]
                          - cell [ref=e387]
                          - cell [ref=e388]
                          - cell [ref=e389]
                          - cell [ref=e390]
                        - row [ref=e391]:
                          - cell [ref=e392]
                          - cell [ref=e393]
                          - cell [ref=e394]
                          - cell [ref=e395]
                          - cell [ref=e396]
                          - cell [ref=e397]
                          - cell [ref=e398]
                          - cell [ref=e399]
                          - cell [ref=e400]
                          - cell [ref=e401]
                          - cell [ref=e402]
                          - cell [ref=e403]
                        - row [ref=e404]:
                          - cell [ref=e405]
                          - cell [ref=e406]
                          - cell [ref=e407]
                          - cell [ref=e408]
                          - cell [ref=e409]
                          - cell [ref=e410]
                          - cell [ref=e411]
                          - cell [ref=e412]
                          - cell [ref=e413]
                          - cell [ref=e414]
                          - cell [ref=e415]
                          - cell [ref=e416]
                        - row [ref=e417]:
                          - cell [ref=e418]
                          - cell [ref=e419]
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
                          - cell [ref=e441]
                          - cell [ref=e442]
                        - row [ref=e443]:
                          - cell [ref=e444]
                          - cell [ref=e445]
                          - cell [ref=e446]
                          - cell [ref=e447]
                          - cell [ref=e448]
                          - cell [ref=e449]
                          - cell [ref=e450]
                          - cell [ref=e451]
                          - cell [ref=e452]
                          - cell [ref=e453]
                          - cell [ref=e454]
                          - cell [ref=e455]
                        - row [ref=e456]:
                          - cell [ref=e457]
                          - cell [ref=e458]
                          - cell [ref=e459]
                          - cell [ref=e460]
                          - cell [ref=e461]
                          - cell [ref=e462]
                          - cell [ref=e463]
                          - cell [ref=e464]
                          - cell [ref=e465]
                          - cell [ref=e466]
                          - cell [ref=e467]
                          - cell [ref=e468]
                        - row [ref=e469]:
                          - cell [ref=e470]
                          - cell [ref=e471]
                          - cell [ref=e472]
                          - cell [ref=e473]
                          - cell [ref=e474]
                          - cell [ref=e475]
                          - cell [ref=e476]
                          - cell [ref=e477]
                          - cell [ref=e478]
                          - cell [ref=e479]
                          - cell [ref=e480]
                          - cell [ref=e481]
                        - row [ref=e482]:
                          - cell [ref=e483]
                          - cell [ref=e484]
                          - cell [ref=e485]
                          - cell [ref=e486]
                          - cell [ref=e487]
                          - cell [ref=e488]
                          - cell [ref=e489]
                          - cell [ref=e490]
                          - cell [ref=e491]
                          - cell [ref=e492]
                          - cell [ref=e493]
                          - cell [ref=e494]
                        - row [ref=e495]:
                          - cell [ref=e496]
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
                          - cell [ref=e507]
                        - row [ref=e508]:
                          - cell [ref=e509]
                          - cell [ref=e510]
                          - cell [ref=e511]
                          - cell [ref=e512]
                          - cell [ref=e513]
                          - cell [ref=e514]
                          - cell [ref=e515]
                          - cell [ref=e516]
                          - cell [ref=e517]
                          - cell [ref=e518]
                          - cell [ref=e519]
                          - cell [ref=e520]
                        - row [ref=e521]:
                          - cell [ref=e522]
                          - cell [ref=e523]
                          - cell [ref=e524]
                          - cell [ref=e525]
                          - cell [ref=e526]
                          - cell [ref=e527]
                          - cell [ref=e528]
                          - cell [ref=e529]
                          - cell [ref=e530]
                          - cell [ref=e531]
                          - cell [ref=e532]
                          - cell [ref=e533]
                      - rowgroup [ref=e534]:
                        - row [ref=e535]:
                          - columnheader [ref=e536]
                          - columnheader [ref=e537]
                          - columnheader [ref=e538]
                          - columnheader [ref=e539]
                          - columnheader [ref=e540]
                          - columnheader [ref=e541]
                          - columnheader [ref=e542]
                          - columnheader [ref=e543]
                          - columnheader "500.00" [ref=e544]
                          - columnheader "10.00" [ref=e545]
                          - columnheader "510.00" [ref=e546]
                          - columnheader [ref=e547]
              - group [ref=e549]:
                - button "Add Now" [disabled] [ref=e550]
                - button [disabled] [ref=e551]
        - generic [ref=e552]: BM Technology © 2026
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
```

# Test source

```ts
  1150 |         console.log('[PASS] PO with inventory line item created and approved');
  1151 |     });
  1152 | 
  1153 |     test('PO-UI-02: Add Miscellaneous Line Item via modal → PO total reflects it', async ({ page }) => {
  1154 |         const app = new AppManager(page);
  1155 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1156 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'domcontentloaded' });
  1157 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  1158 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).waitFor({ state: 'visible', timeout: 60000 });
  1159 | 
  1160 |         await app.pickDate('Purchase Order Date');
  1161 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1162 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable', false, 'Accounts Payable');
  1163 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  1164 | 
  1165 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  1166 |         await page.locator('button:has-text("Line Item")').first().click();
  1167 |         const modal = page.getByRole('dialog').last();
  1168 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  1169 | 
  1170 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  1171 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  1172 |             console.log('[SKIP] Miscellaneous button not present in PO modal');
  1173 |             await page.keyboard.press('Escape');
  1174 |             return;
  1175 |         }
  1176 | 
  1177 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '3000', description: 'Freight charges' });
  1178 | 
  1179 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  1180 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  1181 |         console.log('[PASS] PO with miscellaneous line created');
  1182 |     });
  1183 | 
  1184 |     test('PO-UI-03: Mixed Item + Miscellaneous lines → both rows in PO table', async ({ page }) => {
  1185 |         const app = new AppManager(page);
  1186 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1187 |         const lineItemBtn = page.locator('button:has-text("Line Item")').first();
  1188 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(async () => {
  1189 |             await page.goto('/payables/purchase-orders/new', { waitUntil: 'commit', timeout: 60000 });
  1190 |         });
  1191 |         await lineItemBtn.waitFor({ state: 'visible', timeout: 120000 });
  1192 |         const poItemsTab = page.getByRole('tab', { name: /Purchase Order Items/i });
  1193 |         if (await poItemsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
  1194 |             await poItemsTab.click().catch(() => {});
  1195 |         }
  1196 | 
  1197 |         await app.pickDate('Purchase Order Date');
  1198 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1199 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable', false, 'Accounts Payable');
  1200 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  1201 | 
  1202 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  1203 |         const targetItemName = (itemA as any)?.name || itemA.itemName || capturedItem?.name;
  1204 |         const targetUnitPrice = String(itemA.unitCost || capturedItem?.price || 100);
  1205 | 
  1206 |         // Line 1: inventory item
  1207 |         await lineItemBtn.click();
  1208 |         await addLineItemViaModal(page, app, 'Item', {
  1209 |             qty: '4',
  1210 |             unitPrice: targetUnitPrice,
  1211 |             itemName: targetItemName,
  1212 |             warehouseName: 'Default Warehouse',
  1213 |             locationName: 'location2'
  1214 |         });
  1215 | 
  1216 |         // Settle modal animation from Line 1
  1217 |         await page.waitForTimeout(800);
  1218 | 
  1219 |         // Line 2: miscellaneous (or second item line if PO form only supports inventory items)
  1220 |         await lineItemBtn.click();
  1221 |         const modal2 = page.locator('.chakra-modal__content, .chakra-popover__content, [role="dialog"]')
  1222 |             .filter({ hasText: /Warehouse \*|G\/L Account \*|Description|Please select an item type/i }).first();
  1223 |         
  1224 |         let modalOpened = await modal2.waitFor({ state: 'visible', timeout: 4000 }).then(() => true).catch(() => false);
  1225 |         if (!modalOpened) {
  1226 |             await lineItemBtn.click({ force: true }).catch(() => lineItemBtn.evaluate((b: HTMLElement) => b.click()));
  1227 |             await modal2.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  1228 |         }
  1229 | 
  1230 |         const miscBtn = page.getByRole('button', { name: 'Miscellaneous', exact: true });
  1231 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  1232 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '500', description: 'Import duty' });
  1233 |         } else {
  1234 |             console.log('[INFO] Miscellaneous not present in PO — adding second Item line');
  1235 |             await addLineItemViaModal(page, app, 'Item', {
  1236 |                 qty: '1',
  1237 |                 unitPrice: targetUnitPrice,
  1238 |                 itemName: targetItemName,
  1239 |                 warehouseName: 'Default Warehouse',
  1240 |                 locationName: 'location2'
  1241 |             });
  1242 |         }
  1243 | 
  1244 |         await expect.poll(async () => page.locator('table tbody tr').count(), { timeout: 10000 }).toBeGreaterThanOrEqual(2);
  1245 |         const rowCount = await page.locator('table tbody tr').count();
  1246 |         expect(rowCount).toBeGreaterThanOrEqual(2);
  1247 |         console.log(`[AUDIT] ${rowCount} lines in PO form table`);
  1248 | 
  1249 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
> 1250 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
       |                    ^ TimeoutError: page.waitForURL: Timeout 60000ms exceeded.
  1251 | 
  1252 |         const poId = await app.extractIdFromUrl();
  1253 |         expect(poId).toBeTruthy();
  1254 |         console.log(`[PASS] PO ${poId} mixed lines created and navigated to detail page`);
  1255 |     });
  1256 | 
  1257 |     test('PO-API-04: Multi-line PO → grand total = sum of lines', async ({ page }) => {
  1258 |         const app = new AppManager(page);
  1259 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1260 |         const { apiBase, headers, qs } = await app.buildApiContext();
  1261 |         const L1 = 5 * 1000, L2 = 3 * 1500;
  1262 |         const { DateHelper } = require('../../lib/utils/DateHelper');
  1263 |         const dateIso = (await DateHelper.resolve(page)).iso;
  1264 | 
  1265 |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  1266 |         const allAccounts = acctData.items || acctData.data || [];
  1267 |         const apAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
  1268 |         const glAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  1269 |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  1270 |         const currency = currData.items?.[0] || currData.data?.[0];
  1271 | 
  1272 |         const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
  1273 |             headers,
  1274 |             data: {
  1275 |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  1276 |                 vendor_id: purchaseMeta.vendorId,
  1277 |                 po_date: dateIso,
  1278 |                 purchase_type_id: 4,
  1279 |                 po_items: [
  1280 |                     { item_id: itemA.itemId, quantity: 5, unit_price: 1000, amount: L1, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId },
  1281 |                     { item_id: itemB.itemId, quantity: 3, unit_price: 1500, amount: L2, general_ledger_account_id: glAcct.id, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
  1282 |                 ],
  1283 |             },
  1284 |         });
  1285 | 
  1286 |         expect(resp.ok(), `Multi-line PO failed: HTTP ${resp.status()}`).toBe(true);
  1287 |         const data = await resp.json();
  1288 |         const linesSum = (data.po_items || []).reduce((s: number, l: any) => s + parseFloat(l.amount ?? String(parseFloat(l.quantity) * parseFloat(l.unit_price))), 0);
  1289 |         console.log(`[AUDIT] PO lines sum: $${linesSum} | Expected: $${L1 + L2}`);
  1290 |         expect(linesSum).toBeCloseTo(L1 + L2, 1);
  1291 |         console.log('[PASS] Multi-line PO totals correct');
  1292 |     });
  1293 | 
  1294 |     test('PO-API-05: Miscellaneous line on PO (no item_id) → accepted or inventory-only enforced', async ({ page }) => {
  1295 |         const app = new AppManager(page);
  1296 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1297 |         const { apiBase, headers, qs } = await app.buildApiContext();
  1298 | 
  1299 |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  1300 |         const allAccounts = acctData.items || acctData.data || [];
  1301 |         const apAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
  1302 |         const glAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  1303 |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  1304 |         const currency = currData.items?.[0] || currData.data?.[0];
  1305 | 
  1306 |         const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
  1307 |             headers,
  1308 |             data: {
  1309 |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  1310 |                 vendor_id: purchaseMeta.vendorId,
  1311 |                 po_date: periodDateIso,
  1312 |                 purchase_type_id: 4,
  1313 |                 po_items: [{ description: 'Freight & customs', quantity: 1, unit_price: 3000, amount: 3000, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
  1314 |             },
  1315 |         });
  1316 | 
  1317 |         if (resp.ok()) {
  1318 |             const amt = parseFloat(((await resp.json()).po_items || [])[0]?.amount ?? '0');
  1319 |             console.log(`[INFO] PO miscellaneous line accepted: $${amt}`);
  1320 |         } else {
  1321 |             if (resp.status() === 500) console.log(`[SECONDARY_BUG] Backend must return 422 instead of 500 for miscellaneous PO line without item_id`);
  1322 |             console.log(`[INFO] PO enforces item_id: HTTP ${resp.status()}`);
  1323 |             expect([400, 422, 500]).toContain(resp.status());
  1324 |         }
  1325 |     });
  1326 | 
  1327 |     // =========================================================================
  1328 |     // BILL
  1329 |     // =========================================================================
  1330 | 
  1331 |     test('BILL-UI-01: Add inventory Line Item via modal → Bill created and approved', async ({ page }) => {
  1332 |         const app = new AppManager(page);
  1333 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1334 |         const lineItemBtn = page.locator('button:has-text("Line Item")').first();
  1335 |         await page.goto('/payables/bills/new', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(async () => {
  1336 |             await page.goto('/payables/bills/new', { waitUntil: 'commit', timeout: 60000 });
  1337 |         });
  1338 |         await lineItemBtn.waitFor({ state: 'visible', timeout: 120000 });
  1339 | 
  1340 |         await app.pickDate('Invoice Date');
  1341 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1342 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable', false, 'Accounts Payable');
  1343 |         await fillCurrencyField(page, app);
  1344 | 
  1345 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  1346 | 
  1347 |         await lineItemBtn.click();
  1348 |         await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: capturedItem?.price || '2500', itemName: capturedItem?.name });
  1349 |         console.log('[OK] Inventory line item added to Bill');
  1350 | 
```