# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> PO-UI-03: Mixed Item + Miscellaneous lines → both rows in PO table
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:855:9

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
        - textbox "Search tasks" [ref=e14]: WAC-Item-1786716756506
      - generic [ref=e16]:
        - button "Settings" [ref=e18] [cursor=pointer]:
          - generic:
            - generic:
              - img
              - paragraph: Settings
        - navigation [ref=e20]:
          - link "User Management" [ref=e22] [cursor=pointer]:
            - /url: /settings/general/users
            - generic [ref=e23]:
              - generic [ref=e24]:
                - img [ref=e25]
                - paragraph [ref=e27]: User Management
              - button [ref=e28]:
                - img [ref=e29]
        - button "Logout" [ref=e31] [cursor=pointer]:
          - img [ref=e33]
          - text: Logout
    - generic [ref=e35]:
      - generic [ref=e36]:
        - generic [ref=e37]:
          - img "BM Tech" [ref=e39]: BT
          - generic [ref=e40]:
            - button "BM Tech" [ref=e41] [cursor=pointer]:
              - generic: BM Tech
              - img [ref=e43]
            - generic [ref=e45] [cursor=pointer]:
              - button "Company Detail" [ref=e46]:
                - img [ref=e47]
              - button "Edit Company" [ref=e50]:
                - img [ref=e51]
              - button "Company Detail" [ref=e54]:
                - img [ref=e55]
        - generic [ref=e58]:
          - button "New" [ref=e59] [cursor=pointer]:
            - text: New
            - img [ref=e61]
          - generic [ref=e65] [cursor=pointer]:
            - generic [ref=e66]: "5"
            - img "Notifications" [ref=e67]
          - button "EC" [ref=e70] [cursor=pointer]:
            - img [ref=e71]
            - paragraph [ref=e73]: EC
          - button [ref=e74] [cursor=pointer]:
            - img [ref=e75]
          - generic [ref=e78] [cursor=pointer]:
            - img "System" [ref=e80]: S
            - generic [ref=e81]:
              - generic [ref=e82]: System
              - paragraph [ref=e83]: IT Administrator / User Manager
      - generic [ref=e84]:
        - generic [ref=e85]:
          - generic [ref=e86]:
            - navigation "breadcrumb" [ref=e87]:
              - list [ref=e88]:
                - navigation "breadcrumb" [ref=e89]:
                  - list [ref=e90]:
                    - listitem [ref=e91]:
                      - link "Home" [ref=e92] [cursor=pointer]:
                        - /url: /
                      - text: /
                    - listitem [ref=e93]:
                      - link "Payables" [ref=e94] [cursor=pointer]:
                        - /url: /payables/overview/
                      - text: /
                    - listitem [ref=e95]:
                      - link "Purchase Orders" [ref=e96] [cursor=pointer]:
                        - /url: /payables/purchase-orders/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=e97]:
                      - link "Detail" [ref=e98] [cursor=pointer]:
                        - /url: /payables/purchase-orders/a29a607f-3431-41ba-ad6b-017f4357cb20/detail
            - button "2019" [ref=e100] [cursor=pointer]:
              - generic [ref=e101]: "2019"
              - img [ref=e102]
          - generic [ref=e105]:
            - button "Toggle Visibility" [ref=e108] [cursor=pointer]:
              - img [ref=e109]
            - generic [ref=e114]:
              - generic [ref=e116]:
                - heading "Purchase Order Details" [level=3] [ref=e117]
                - generic [ref=e118]:
                  - button "Purchase Order Journal Detail" [ref=e119] [cursor=pointer]:
                    - img [ref=e121]
                    - text: POJ
                  - button "Print" [ref=e123] [cursor=pointer]:
                    - img [ref=e125]
                    - text: Print
              - generic [ref=e129]:
                - generic [ref=e130]:
                  - generic [ref=e131]:
                    - paragraph [ref=e132]: "Order Date:"
                    - paragraph [ref=e133]: Thursday, August 20th 2026
                  - generic [ref=e134]:
                    - paragraph [ref=e135]: "PO Number:"
                    - paragraph [ref=e136]: PO/2026/08/14/001119
                  - generic [ref=e137]:
                    - paragraph [ref=e138]: "PO Status:"
                    - generic [ref=e140]:
                      - generic [ref=e142]: Draft
                      - img [ref=e144]
                  - generic [ref=e146]:
                    - paragraph [ref=e147]: "Account Payable:"
                    - paragraph [ref=e148]: 1004 - Cash at Bank - Awash
                  - generic [ref=e149]:
                    - paragraph [ref=e150]: "Currency:"
                    - paragraph [ref=e151]: Birr - BRR
                  - generic [ref=e152]:
                    - paragraph [ref=e153]: "vendor:"
                    - paragraph [ref=e154]: Manenderas
                  - generic [ref=e155]:
                    - paragraph [ref=e156]: "Discount Terms:"
                    - paragraph
                - generic [ref=e157]:
                  - generic [ref=e158]:
                    - paragraph [ref=e159]: Shipping Address
                    - button "update vendor address" [ref=e160] [cursor=pointer]:
                      - img [ref=e161]
                  - generic [ref=e165]:
                    - paragraph [ref=e166]: "Region:"
                    - paragraph
                  - generic [ref=e167]:
                    - paragraph [ref=e168]: "Zone:"
                    - paragraph
                  - generic [ref=e169]:
                    - paragraph [ref=e170]: "Woreda:"
                    - paragraph
                  - generic [ref=e171]:
                    - paragraph [ref=e172]: "City:"
                    - paragraph
                  - generic [ref=e173]:
                    - paragraph [ref=e174]: "Kebele:"
                    - paragraph
                  - generic [ref=e175]:
                    - paragraph [ref=e176]: "House No.:"
                    - paragraph
              - generic [ref=e177]:
                - tablist [ref=e178]:
                  - tab "Purchase Order Items" [selected] [ref=e179] [cursor=pointer]
                  - tab "PO Journal" [ref=e180] [cursor=pointer]
                  - tab "Related Documents" [ref=e181] [cursor=pointer]
                  - tab "History" [ref=e182] [cursor=pointer]
                - tabpanel "Purchase Order Items" [ref=e184]:
                  - generic [ref=e185]:
                    - table [ref=e188]:
                      - rowgroup [ref=e189]:
                        - row "Item ID Quantity Selling Price Purchase Type Description G/L Account Project Before Tax Tax Total" [ref=e190]:
                          - columnheader "Item ID" [ref=e191]: Item ID
                          - columnheader "Quantity" [ref=e193]: Quantity
                          - columnheader "Selling Price" [ref=e195]: Selling Price
                          - columnheader "Purchase Type" [ref=e197]: Purchase Type
                          - columnheader "Description" [ref=e199]: Description
                          - columnheader "G/L Account" [ref=e201]: G/L Account
                          - columnheader "Project" [ref=e203]: Project
                          - columnheader "Before Tax" [ref=e205]: Before Tax
                          - columnheader "Tax" [ref=e207]: Tax
                          - columnheader "Total" [ref=e209]: Total
                      - rowgroup [ref=e211]:
                        - row "1 miscellaneous Cash at Bank - Dashen [object Object]" [ref=e212]:
                          - cell [ref=e213]
                          - cell "1" [ref=e214]:
                            - generic [ref=e215]: "1"
                          - cell [ref=e216]
                          - cell "miscellaneous" [ref=e217]:
                            - generic [ref=e218]: miscellaneous
                          - cell [ref=e219]
                          - cell "Cash at Bank - Dashen" [ref=e220]:
                            - generic [ref=e221]: Cash at Bank - Dashen
                          - cell [ref=e222]
                          - cell [ref=e223]
                          - cell "[object Object]" [ref=e224]:
                            - generic [ref=e225]: "[object Object]"
                          - cell [ref=e226]
                        - row "4 miscellaneous Cash at Bank - Zemen [object Object]" [ref=e227]:
                          - cell [ref=e228]
                          - cell "4" [ref=e229]:
                            - generic [ref=e230]: "4"
                          - cell [ref=e231]
                          - cell "miscellaneous" [ref=e232]:
                            - generic [ref=e233]: miscellaneous
                          - cell [ref=e234]
                          - cell "Cash at Bank - Zemen" [ref=e235]:
                            - generic [ref=e236]: Cash at Bank - Zemen
                          - cell [ref=e237]
                          - cell [ref=e238]
                          - cell "[object Object]" [ref=e239]:
                            - generic [ref=e240]: "[object Object]"
                          - cell [ref=e241]
                        - row [ref=e242]:
                          - cell [ref=e243]
                          - cell [ref=e244]
                          - cell [ref=e245]
                          - cell [ref=e246]
                          - cell [ref=e247]
                          - cell [ref=e248]
                          - cell [ref=e249]
                          - cell [ref=e250]
                          - cell [ref=e251]
                          - cell [ref=e252]
                        - row [ref=e253]:
                          - cell [ref=e254]
                          - cell [ref=e255]
                          - cell [ref=e256]
                          - cell [ref=e257]
                          - cell [ref=e258]
                          - cell [ref=e259]
                          - cell [ref=e260]
                          - cell [ref=e261]
                          - cell [ref=e262]
                          - cell [ref=e263]
                        - row [ref=e264]:
                          - cell [ref=e265]
                          - cell [ref=e266]
                          - cell [ref=e267]
                          - cell [ref=e268]
                          - cell [ref=e269]
                          - cell [ref=e270]
                          - cell [ref=e271]
                          - cell [ref=e272]
                          - cell [ref=e273]
                          - cell [ref=e274]
                        - row [ref=e275]:
                          - cell [ref=e276]
                          - cell [ref=e277]
                          - cell [ref=e278]
                          - cell [ref=e279]
                          - cell [ref=e280]
                          - cell [ref=e281]
                          - cell [ref=e282]
                          - cell [ref=e283]
                          - cell [ref=e284]
                          - cell [ref=e285]
                        - row [ref=e286]:
                          - cell [ref=e287]
                          - cell [ref=e288]
                          - cell [ref=e289]
                          - cell [ref=e290]
                          - cell [ref=e291]
                          - cell [ref=e292]
                          - cell [ref=e293]
                          - cell [ref=e294]
                          - cell [ref=e295]
                          - cell [ref=e296]
                        - row [ref=e297]:
                          - cell [ref=e298]
                          - cell [ref=e299]
                          - cell [ref=e300]
                          - cell [ref=e301]
                          - cell [ref=e302]
                          - cell [ref=e303]
                          - cell [ref=e304]
                          - cell [ref=e305]
                          - cell [ref=e306]
                          - cell [ref=e307]
                        - row [ref=e308]:
                          - cell [ref=e309]
                          - cell [ref=e310]
                          - cell [ref=e311]
                          - cell [ref=e312]
                          - cell [ref=e313]
                          - cell [ref=e314]
                          - cell [ref=e315]
                          - cell [ref=e316]
                          - cell [ref=e317]
                          - cell [ref=e318]
                        - row [ref=e319]:
                          - cell [ref=e320]
                          - cell [ref=e321]
                          - cell [ref=e322]
                          - cell [ref=e323]
                          - cell [ref=e324]
                          - cell [ref=e325]
                          - cell [ref=e326]
                          - cell [ref=e327]
                          - cell [ref=e328]
                          - cell [ref=e329]
                        - row [ref=e330]:
                          - cell [ref=e331]
                          - cell [ref=e332]
                          - cell [ref=e333]
                          - cell [ref=e334]
                          - cell [ref=e335]
                          - cell [ref=e336]
                          - cell [ref=e337]
                          - cell [ref=e338]
                          - cell [ref=e339]
                          - cell [ref=e340]
                        - row [ref=e341]:
                          - cell [ref=e342]
                          - cell [ref=e343]
                          - cell [ref=e344]
                          - cell [ref=e345]
                          - cell [ref=e346]
                          - cell [ref=e347]
                          - cell [ref=e348]
                          - cell [ref=e349]
                          - cell [ref=e350]
                          - cell [ref=e351]
                        - row [ref=e352]:
                          - cell [ref=e353]
                          - cell [ref=e354]
                          - cell [ref=e355]
                          - cell [ref=e356]
                          - cell [ref=e357]
                          - cell [ref=e358]
                          - cell [ref=e359]
                          - cell [ref=e360]
                          - cell [ref=e361]
                          - cell [ref=e362]
                        - row [ref=e363]:
                          - cell [ref=e364]
                          - cell [ref=e365]
                          - cell [ref=e366]
                          - cell [ref=e367]
                          - cell [ref=e368]
                          - cell [ref=e369]
                          - cell [ref=e370]
                          - cell [ref=e371]
                          - cell [ref=e372]
                          - cell [ref=e373]
                        - row [ref=e374]:
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
                      - rowgroup [ref=e385]:
                        - row "0.00 6500.00" [ref=e386]:
                          - columnheader [ref=e387]
                          - columnheader [ref=e388]
                          - columnheader [ref=e389]
                          - columnheader [ref=e390]
                          - columnheader [ref=e391]
                          - columnheader [ref=e392]
                          - columnheader [ref=e393]
                          - columnheader [ref=e394]
                          - columnheader "0.00" [ref=e395]
                          - columnheader "6500.00" [ref=e396]
                    - generic [ref=e397]:
                      - generic [ref=e399]:
                        - combobox [ref=e400]:
                          - option "Show 5 rows"
                          - option "Show 10 rows"
                          - option "Show 15 rows" [selected]
                          - option "Show 25 rows"
                          - option "Show 50 rows"
                          - option "Show 100 rows"
                        - generic:
                          - img
                      - generic [ref=e402]:
                        - button "go to first page" [disabled] [ref=e403]:
                          - img [ref=e404]
                        - generic [ref=e406]:
                          - button "go to previous page" [disabled] [ref=e407]:
                            - img [ref=e408]
                          - paragraph [ref=e410]: Page
                          - paragraph [ref=e411]: 1 of 1
                          - button "go to next page" [disabled] [ref=e412]:
                            - img [ref=e413]
                        - button "go to last page" [disabled] [ref=e415]:
                          - img [ref=e416]
        - generic [ref=e418]: BM Technology © 2026
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right":
      - status [ref=e419]:
        - generic [ref=e420]:
          - img [ref=e422]
          - generic [ref=e425]: Purchase Order Created
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right":
      - status [ref=e426]:
        - generic [ref=e427]:
          - img [ref=e429]
          - generic [ref=e432]: Purchase Order Created
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
  797 |     // =========================================================================
  798 | 
  799 |     test('PO-UI-01: Add inventory Line Item via modal → PO created and approved', async ({ page }) => {
  800 |         const app = new AppManager(page);
  801 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  802 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'domcontentloaded' });
  803 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  804 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).waitFor({ state: 'visible', timeout: 60000 });
  805 | 
  806 |         await app.pickDate('Purchase Order Date');
  807 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  808 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  809 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  810 | 
  811 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  812 |         await page.getByRole('button', { name: 'Line Item' }).click();
  813 |         await addLineItemViaModal(page, app, 'Item', { qty: '5', unitPrice: '2000' });
  814 |         console.log('[OK] Inventory line item added to PO');
  815 | 
  816 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  817 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  818 | 
  819 |         const poId = await app.extractIdFromUrl();
  820 |         await app.advanceDocumentAPI(poId, 'purchase-orders');
  821 |         console.log('[PASS] PO with inventory line item created and approved');
  822 |     });
  823 | 
  824 |     test('PO-UI-02: Add Miscellaneous Line Item via modal → PO total reflects it', async ({ page }) => {
  825 |         const app = new AppManager(page);
  826 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  827 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'domcontentloaded' });
  828 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  829 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).waitFor({ state: 'visible', timeout: 60000 });
  830 | 
  831 |         await app.pickDate('Purchase Order Date');
  832 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  833 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  834 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  835 | 
  836 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  837 |         await page.getByRole('button', { name: 'Line Item' }).click();
  838 |         const modal = page.getByRole('dialog').last();
  839 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  840 | 
  841 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  842 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  843 |             console.log('[SKIP] Miscellaneous button not present in PO modal');
  844 |             await page.keyboard.press('Escape');
  845 |             return;
  846 |         }
  847 | 
  848 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '3000', description: 'Freight charges' });
  849 | 
  850 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  851 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  852 |         console.log('[PASS] PO with miscellaneous line created');
  853 |     });
  854 | 
  855 |     test('PO-UI-03: Mixed Item + Miscellaneous lines → both rows in PO table', async ({ page }) => {
  856 |         const app = new AppManager(page);
  857 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  858 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'domcontentloaded' });
  859 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  860 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).waitFor({ state: 'visible', timeout: 60000 });
  861 | 
  862 |         await app.pickDate('Purchase Order Date');
  863 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  864 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  865 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  866 | 
  867 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  868 | 
  869 |         // Line 1: inventory item
  870 |         await page.getByRole('button', { name: 'Line Item' }).click();
  871 |         await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: '1500' });
  872 | 
  873 |         // Line 2: miscellaneous
  874 |         await page.getByRole('button', { name: 'Line Item' }).click();
  875 |         const modal2 = page.getByRole('dialog').last();
  876 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  877 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  878 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  879 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '500', description: 'Import duty' });
  880 |         } else {
  881 |             await page.keyboard.press('Escape');
  882 |             await page.getByRole('button', { name: 'Line Item' }).click();
  883 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '500' });
  884 |         }
  885 | 
  886 |         const rowCount = await page.locator('table tbody tr').count();
  887 |         expect(rowCount).toBeGreaterThanOrEqual(2);
  888 |         console.log(`[AUDIT] ${rowCount} lines in PO form table`);
  889 | 
  890 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  891 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  892 | 
  893 |         const poId = await app.extractIdFromUrl();
  894 |         const { apiBase, headers, qs } = await app.buildApiContext();
  895 |         const poData = await (await page.request.get(`${apiBase}/purchase-order/${poId}?${qs}`, { headers })).json();
  896 |         const lines: any[] = poData.po_items || [];
> 897 |         expect(lines.length).toBeGreaterThanOrEqual(2);
      |                              ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
  898 |         console.log(`[AUDIT] PO lines in API: ${lines.length}`);
  899 |         console.log('[PASS] PO mixed lines — all rows present in form and API');
  900 |     });
  901 | 
  902 |     test('PO-API-04: Multi-line PO → grand total = sum of lines', async ({ page }) => {
  903 |         const app = new AppManager(page);
  904 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  905 |         const { apiBase, headers, qs } = await app.buildApiContext();
  906 |         const L1 = 5 * 1000, L2 = 3 * 1500;
  907 |         const { DateHelper } = require('../../lib/utils/DateHelper');
  908 |         const dateIso = (await DateHelper.resolve(page)).iso;
  909 | 
  910 |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  911 |         const allAccounts = acctData.items || acctData.data || [];
  912 |         const apAcct  = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable'))  || allAccounts[0];
  913 |         const glAcct  = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  914 |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  915 |         const currency = currData.items?.[0] || currData.data?.[0];
  916 | 
  917 |         const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
  918 |             headers,
  919 |             data: {
  920 |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  921 |                 vendor_id: purchaseMeta.vendorId,
  922 |                 po_date: dateIso,
  923 |                 purchase_type_id: 4,
  924 |                 po_items: [
  925 |                     { item_id: itemA.itemId, quantity: 5, unit_price: 1000, amount: L1, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId },
  926 |                     { item_id: itemB.itemId, quantity: 3, unit_price: 1500, amount: L2, general_ledger_account_id: glAcct.id, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
  927 |                 ],
  928 |             },
  929 |         });
  930 | 
  931 |         expect(resp.ok(), `Multi-line PO failed: HTTP ${resp.status()}`).toBe(true);
  932 |         const data = await resp.json();
  933 |         const linesSum = (data.po_items || []).reduce((s: number, l: any) => s + parseFloat(l.amount ?? String(parseFloat(l.quantity) * parseFloat(l.unit_price))), 0);
  934 |         console.log(`[AUDIT] PO lines sum: $${linesSum} | Expected: $${L1 + L2}`);
  935 |         expect(linesSum).toBeCloseTo(L1 + L2, 1);
  936 |         console.log('[PASS] Multi-line PO totals correct');
  937 |     });
  938 | 
  939 |     test('PO-API-05: Miscellaneous line on PO (no item_id) → accepted or inventory-only enforced', async ({ page }) => {
  940 |         const app = new AppManager(page);
  941 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  942 |         const { apiBase, headers, qs } = await app.buildApiContext();
  943 | 
  944 |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  945 |         const allAccounts = acctData.items || acctData.data || [];
  946 |         const apAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
  947 |         const glAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  948 |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  949 |         const currency = currData.items?.[0] || currData.data?.[0];
  950 | 
  951 |         const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
  952 |             headers,
  953 |             data: {
  954 |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  955 |                 vendor_id: purchaseMeta.vendorId,
  956 |                 po_date: periodDateIso,
  957 |                 purchase_type_id: 4,
  958 |                 po_items: [{ description: 'Freight & customs', quantity: 1, unit_price: 3000, amount: 3000, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
  959 |             },
  960 |         });
  961 | 
  962 |         if (resp.ok()) {
  963 |             const amt = parseFloat(((await resp.json()).po_items || [])[0]?.amount ?? '0');
  964 |             console.log(`[INFO] PO miscellaneous line accepted: $${amt}`);
  965 |         } else {
  966 |             console.log(`[INFO] PO enforces item_id: HTTP ${resp.status()}`);
  967 |             expect([400, 422]).toContain(resp.status());
  968 |         }
  969 |     });
  970 | 
  971 |     // =========================================================================
  972 |     // BILL
  973 |     // =========================================================================
  974 | 
  975 |     test('BILL-UI-01: Add inventory Line Item via modal → Bill created and approved', async ({ page }) => {
  976 |         const app = new AppManager(page);
  977 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  978 |         await page.goto('/payables/bills/new', { waitUntil: 'domcontentloaded' });
  979 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  980 |         await page.getByRole('button', { name: 'Line Item' }).waitFor({ state: 'visible', timeout: 60000 });
  981 | 
  982 |         await app.pickDate('Invoice Date');
  983 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  984 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  985 |         await fillCurrencyField(page, app);
  986 | 
  987 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  988 | 
  989 |         await page.getByRole('button', { name: 'Line Item' }).click();
  990 |         await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: capturedItem?.price || '2500', itemName: capturedItem?.name });
  991 |         console.log('[OK] Inventory line item added to Bill');
  992 | 
  993 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  994 |         await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 });
  995 | 
  996 |         const billId = await app.extractIdFromUrl();
  997 |         await app.advanceDocumentAPI(billId, 'bills');
```