# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> BILL-UI-01: Add inventory Line Item via modal → Bill created and approved
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:975:9

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
    - waiting for element to be visible, enabled and stable

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
        - textbox "Search tasks" [ref=e14]: WAC-Item-1786860014074
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
                      - link "Bills" [ref=e96] [cursor=pointer]:
                        - /url: /payables/bills/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=e97]:
                      - link "New" [ref=e98] [cursor=pointer]:
                        - /url: /payables/new
            - button "2019" [ref=e100] [cursor=pointer]:
              - generic [ref=e101]: "2019"
              - img [ref=e102]
          - generic [ref=e105]:
            - button "Toggle Visibility" [ref=e108] [cursor=pointer]:
              - img [ref=e109]
            - generic [ref=e112]:
              - generic [ref=e113]:
                - button "Close" [ref=e114] [cursor=pointer]:
                  - img [ref=e115]
                - heading "New Bills" [level=5] [ref=e117]
              - generic [ref=e118]:
                - generic [ref=e120]:
                  - generic [ref=e121]:
                    - group [ref=e122]:
                      - generic [ref=e123]: Vendor *
                      - button "Vendor selector" [ref=e124]: MOENCO S.C
                    - group [ref=e125]:
                      - generic [ref=e126]: Purchase Order
                      - button "Purchase Order selector" [ref=e127]
                    - generic [ref=e128]:
                      - group [ref=e129]:
                        - generic [ref=e130]: Invoice number
                        - textbox "Invoice number" [disabled] [ref=e132]: BILL/2026/08/16/001686
                      - paragraph [ref=e133]: Invoice number is auto-generated
                    - generic [ref=e134]:
                      - generic [ref=e135]: Due Date
                      - button "ነሀሴ 10, 2018" [ref=e137] [cursor=pointer]:
                        - img [ref=e138]
                        - generic [ref=e140]: ነሀሴ 10, 2018
                    - group [ref=e141]:
                      - generic [ref=e142]: Budget
                      - button "Budget selector" [ref=e143]: Select a budget
                  - generic [ref=e144]:
                    - generic [ref=e145]:
                      - generic [ref=e146]: Invoice Date
                      - button "ነሀሴ 16, 2018" [ref=e148] [cursor=pointer]:
                        - img [ref=e149]
                        - generic [ref=e151]: ነሀሴ 16, 2018
                    - group [ref=e152]:
                      - generic [ref=e153]: Accounts Payable *
                      - button "Accounts Payable selector" [ref=e154]: Cash at Bank - CBE
                    - group [ref=e155]:
                      - generic [ref=e156]: Currency *
                      - button "Currency selector" [ref=e157]: Birr
                - generic [ref=e158]:
                  - generic [ref=e159]:
                    - tablist [ref=e160]:
                      - tab "Purchases" [selected] [ref=e161] [cursor=pointer]
                      - tab "Received Purchase Order" [ref=e162] [cursor=pointer]
                      - tab "Journal" [ref=e163] [cursor=pointer]
                      - tab "Miscelaneuos" [ref=e164] [cursor=pointer]
                      - tab "Upload Related Documents" [ref=e165] [cursor=pointer]
                    - button "Line Item" [active] [ref=e167] [cursor=pointer]:
                      - img [ref=e169]
                      - text: Line Item
                  - tabpanel "Purchases" [ref=e172]:
                    - table [ref=e176]:
                      - rowgroup [ref=e177]:
                        - row "Item Quantity Unit Price Purchase Type Description G/L Account * Project Before Tax * Tax Total" [ref=e178]:
                          - columnheader [ref=e179]
                          - columnheader "Item" [ref=e181]: Item
                          - columnheader "Quantity" [ref=e183]: Quantity
                          - columnheader "Unit Price" [ref=e185]: Unit Price
                          - columnheader "Purchase Type" [ref=e187]: Purchase Type
                          - columnheader "Description" [ref=e189]: Description
                          - columnheader "G/L Account *" [ref=e191]: G/L Account *
                          - columnheader "Project" [ref=e193]: Project
                          - columnheader "Before Tax *" [ref=e195]: Before Tax *
                          - columnheader "Tax" [ref=e197]: Tax
                          - columnheader "Total" [ref=e199]: Total
                          - columnheader [ref=e201]
                      - rowgroup [ref=e203]:
                        - row "inventory/RWT-2 - steam door 78x2.02 4 2500 Goods Cash at Bank - Dashen 10000 2 10,200.00" [ref=e204]:
                          - cell [ref=e205]
                          - cell "inventory/RWT-2 - steam door 78x2.02" [ref=e206]:
                            - generic [ref=e208]: inventory/RWT-2 - steam door 78x2.02
                          - cell "4" [ref=e209]:
                            - generic [ref=e211]: "4"
                          - cell "2500" [ref=e212]:
                            - generic [ref=e214]: "2500"
                          - cell "Goods" [ref=e215]:
                            - generic [ref=e216]: Goods
                          - cell [ref=e217]
                          - cell "Cash at Bank - Dashen" [ref=e218]:
                            - generic [ref=e220]: Cash at Bank - Dashen
                          - cell [ref=e221]
                          - cell "10000" [ref=e222]:
                            - generic [ref=e224]: "10000"
                          - cell "2" [ref=e225]:
                            - generic [ref=e227]: "2"
                          - cell "10,200.00" [ref=e228]:
                            - generic [ref=e230]: 10,200.00
                          - cell [ref=e231]
                        - row [ref=e233]:
                          - cell [ref=e234]
                          - cell [ref=e235]
                          - cell [ref=e236]
                          - cell [ref=e237]
                          - cell [ref=e238]
                          - cell [ref=e239]
                          - cell [ref=e240]
                          - cell [ref=e241]
                          - cell [ref=e242]
                          - cell [ref=e243]
                          - cell [ref=e244]
                          - cell [ref=e245]
                        - row [ref=e246]:
                          - cell [ref=e247]
                          - cell [ref=e248]
                          - cell [ref=e249]
                          - cell [ref=e250]
                          - cell [ref=e251]
                          - cell [ref=e252]
                          - cell [ref=e253]
                          - cell [ref=e254]
                          - cell [ref=e255]
                          - cell [ref=e256]
                          - cell [ref=e257]
                          - cell [ref=e258]
                        - row [ref=e259]:
                          - cell [ref=e260]
                          - cell [ref=e261]
                          - cell [ref=e262]
                          - cell [ref=e263]
                          - cell [ref=e264]
                          - cell [ref=e265]
                          - cell [ref=e266]
                          - cell [ref=e267]
                          - cell [ref=e268]
                          - cell [ref=e269]
                          - cell [ref=e270]
                          - cell [ref=e271]
                        - row [ref=e272]:
                          - cell [ref=e273]
                          - cell [ref=e274]
                          - cell [ref=e275]
                          - cell [ref=e276]
                          - cell [ref=e277]
                          - cell [ref=e278]
                          - cell [ref=e279]
                          - cell [ref=e280]
                          - cell [ref=e281]
                          - cell [ref=e282]
                          - cell [ref=e283]
                          - cell [ref=e284]
                        - row [ref=e285]:
                          - cell [ref=e286]
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
                          - cell [ref=e297]
                        - row [ref=e298]:
                          - cell [ref=e299]
                          - cell [ref=e300]
                          - cell [ref=e301]
                          - cell [ref=e302]
                          - cell [ref=e303]
                          - cell [ref=e304]
                          - cell [ref=e305]
                          - cell [ref=e306]
                          - cell [ref=e307]
                          - cell [ref=e308]
                          - cell [ref=e309]
                          - cell [ref=e310]
                        - row [ref=e311]:
                          - cell [ref=e312]
                          - cell [ref=e313]
                          - cell [ref=e314]
                          - cell [ref=e315]
                          - cell [ref=e316]
                          - cell [ref=e317]
                          - cell [ref=e318]
                          - cell [ref=e319]
                          - cell [ref=e320]
                          - cell [ref=e321]
                          - cell [ref=e322]
                          - cell [ref=e323]
                        - row [ref=e324]:
                          - cell [ref=e325]
                          - cell [ref=e326]
                          - cell [ref=e327]
                          - cell [ref=e328]
                          - cell [ref=e329]
                          - cell [ref=e330]
                          - cell [ref=e331]
                          - cell [ref=e332]
                          - cell [ref=e333]
                          - cell [ref=e334]
                          - cell [ref=e335]
                          - cell [ref=e336]
                        - row [ref=e337]:
                          - cell [ref=e338]
                          - cell [ref=e339]
                          - cell [ref=e340]
                          - cell [ref=e341]
                          - cell [ref=e342]
                          - cell [ref=e343]
                          - cell [ref=e344]
                          - cell [ref=e345]
                          - cell [ref=e346]
                          - cell [ref=e347]
                          - cell [ref=e348]
                          - cell [ref=e349]
                        - row [ref=e350]:
                          - cell [ref=e351]
                          - cell [ref=e352]
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
                          - cell [ref=e374]
                          - cell [ref=e375]
                        - row [ref=e376]:
                          - cell [ref=e377]
                          - cell [ref=e378]
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
                        - row [ref=e389]:
                          - cell [ref=e390]
                          - cell [ref=e391]
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
                        - row [ref=e402]:
                          - cell [ref=e403]
                          - cell [ref=e404]
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
                      - rowgroup [ref=e415]:
                        - row "10000.00 200.00 10200.00" [ref=e416]:
                          - columnheader [ref=e417]
                          - columnheader [ref=e418]
                          - columnheader [ref=e419]
                          - columnheader [ref=e420]
                          - columnheader [ref=e421]
                          - columnheader [ref=e422]
                          - columnheader [ref=e423]
                          - columnheader [ref=e424]
                          - columnheader "10000.00" [ref=e425]
                          - columnheader "200.00" [ref=e426]
                          - columnheader "10200.00" [ref=e427]
                          - columnheader [ref=e428]
              - group [ref=e430]:
                - button "Add Now" [disabled] [ref=e431]
                - button [disabled] [ref=e432]:
                  - generic:
                    - img
        - generic [ref=e433]: BM Technology © 2026
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
  893  |         const poId = await app.extractIdFromUrl();
  894  |         const { apiBase, headers, qs } = await app.buildApiContext();
  895  |         const poData = await (await page.request.get(`${apiBase}/purchase-order/${poId}?${qs}`, { headers })).json();
  896  |         const lines: any[] = poData.po_items || [];
  897  |         expect(lines.length).toBeGreaterThanOrEqual(2);
  898  |         console.log(`[AUDIT] PO lines in API: ${lines.length}`);
  899  |         console.log('[PASS] PO mixed lines — all rows present in form and API');
  900  |     });
  901  | 
  902  |     test('PO-API-04: Multi-line PO → grand total = sum of lines', async ({ page }) => {
  903  |         const app = new AppManager(page);
  904  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  905  |         const { apiBase, headers, qs } = await app.buildApiContext();
  906  |         const L1 = 5 * 1000, L2 = 3 * 1500;
  907  |         const { DateHelper } = require('../../lib/utils/DateHelper');
  908  |         const dateIso = (await DateHelper.resolve(page)).iso;
  909  | 
  910  |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  911  |         const allAccounts = acctData.items || acctData.data || [];
  912  |         const apAcct  = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable'))  || allAccounts[0];
  913  |         const glAcct  = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  914  |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  915  |         const currency = currData.items?.[0] || currData.data?.[0];
  916  | 
  917  |         const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
  918  |             headers,
  919  |             data: {
  920  |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  921  |                 vendor_id: purchaseMeta.vendorId,
  922  |                 po_date: dateIso,
  923  |                 purchase_type_id: 4,
  924  |                 po_items: [
  925  |                     { item_id: itemA.itemId, quantity: 5, unit_price: 1000, amount: L1, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId },
  926  |                     { item_id: itemB.itemId, quantity: 3, unit_price: 1500, amount: L2, general_ledger_account_id: glAcct.id, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
  927  |                 ],
  928  |             },
  929  |         });
  930  | 
  931  |         expect(resp.ok(), `Multi-line PO failed: HTTP ${resp.status()}`).toBe(true);
  932  |         const data = await resp.json();
  933  |         const linesSum = (data.po_items || []).reduce((s: number, l: any) => s + parseFloat(l.amount ?? String(parseFloat(l.quantity) * parseFloat(l.unit_price))), 0);
  934  |         console.log(`[AUDIT] PO lines sum: $${linesSum} | Expected: $${L1 + L2}`);
  935  |         expect(linesSum).toBeCloseTo(L1 + L2, 1);
  936  |         console.log('[PASS] Multi-line PO totals correct');
  937  |     });
  938  | 
  939  |     test('PO-API-05: Miscellaneous line on PO (no item_id) → accepted or inventory-only enforced', async ({ page }) => {
  940  |         const app = new AppManager(page);
  941  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  942  |         const { apiBase, headers, qs } = await app.buildApiContext();
  943  | 
  944  |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  945  |         const allAccounts = acctData.items || acctData.data || [];
  946  |         const apAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
  947  |         const glAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  948  |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  949  |         const currency = currData.items?.[0] || currData.data?.[0];
  950  | 
  951  |         const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
  952  |             headers,
  953  |             data: {
  954  |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  955  |                 vendor_id: purchaseMeta.vendorId,
  956  |                 po_date: periodDateIso,
  957  |                 purchase_type_id: 4,
  958  |                 po_items: [{ description: 'Freight & customs', quantity: 1, unit_price: 3000, amount: 3000, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
  959  |             },
  960  |         });
  961  | 
  962  |         if (resp.ok()) {
  963  |             const amt = parseFloat(((await resp.json()).po_items || [])[0]?.amount ?? '0');
  964  |             console.log(`[INFO] PO miscellaneous line accepted: $${amt}`);
  965  |         } else {
  966  |             console.log(`[INFO] PO enforces item_id: HTTP ${resp.status()}`);
  967  |             expect([400, 422]).toContain(resp.status());
  968  |         }
  969  |     });
  970  | 
  971  |     // =========================================================================
  972  |     // BILL
  973  |     // =========================================================================
  974  | 
  975  |     test('BILL-UI-01: Add inventory Line Item via modal → Bill created and approved', async ({ page }) => {
  976  |         const app = new AppManager(page);
  977  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  978  |         await page.goto('/payables/bills/new', { waitUntil: 'domcontentloaded' });
  979  |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  980  |         await page.getByRole('button', { name: 'Line Item' }).waitFor({ state: 'visible', timeout: 60000 });
  981  | 
  982  |         await app.pickDate('Invoice Date');
  983  |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  984  |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  985  |         await fillCurrencyField(page, app);
  986  | 
  987  |         const capturedItem = await captureItemWithPriceAPI(page, app);
  988  | 
  989  |         await page.getByRole('button', { name: 'Line Item' }).click();
  990  |         await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: capturedItem?.price || '2500', itemName: capturedItem?.name });
  991  |         console.log('[OK] Inventory line item added to Bill');
  992  | 
> 993  |         await page.getByRole('button', { name: 'Add Now' }).first().click();
       |                                                                     ^ TimeoutError: locator.click: Timeout 90000ms exceeded.
  994  |         await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 });
  995  | 
  996  |         const billId = await app.extractIdFromUrl();
  997  |         await app.advanceDocumentAPI(billId, 'bills');
  998  |         console.log('[PASS] Bill with inventory line created and approved');
  999  |     });
  1000 | 
  1001 |     test('BILL-UI-02: Add Miscellaneous line via modal → Bill total reflects it', async ({ page }) => {
  1002 |         const app = new AppManager(page);
  1003 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1004 |         await page.goto('/payables/bills/new', { waitUntil: 'domcontentloaded' });
  1005 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  1006 |         await page.getByRole('button', { name: 'Line Item' }).waitFor({ state: 'visible', timeout: 60000 });
  1007 | 
  1008 |         await app.pickDate('Invoice Date');
  1009 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1010 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  1011 |         await fillCurrencyField(page, app);
  1012 | 
  1013 |         await page.getByRole('button', { name: 'Line Item' }).click();
  1014 |         const modal = page.getByRole('dialog').last();
  1015 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  1016 | 
  1017 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  1018 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  1019 |             console.log('[SKIP] Miscellaneous button not present in Bill modal');
  1020 |             await page.keyboard.press('Escape');
  1021 |             return;
  1022 |         }
  1023 | 
  1024 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '4000', description: 'Import duty' });
  1025 | 
  1026 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  1027 |         await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 });
  1028 |         console.log('[PASS] Bill with miscellaneous line created');
  1029 |     });
  1030 | 
  1031 |     test('BILL-UI-03: Mixed Item + Miscellaneous → both rows in Bill table, approve and verify AP', async ({ page }) => {
  1032 |         const app = new AppManager(page);
  1033 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1034 |         await page.goto('/payables/bills/new', { waitUntil: 'domcontentloaded' });
  1035 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  1036 |         await page.getByRole('button', { name: 'Line Item' }).waitFor({ state: 'visible', timeout: 60000 });
  1037 | 
  1038 |         await app.pickDate('Invoice Date');
  1039 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1040 |         const selectedVendor = (await page.getByRole('button', { name: 'Vendor selector' }).textContent())?.trim() || '';
  1041 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  1042 |         await fillCurrencyField(page, app);
  1043 | 
  1044 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  1045 | 
  1046 |         // Item line
  1047 |         await page.getByRole('button', { name: 'Line Item' }).click();
  1048 |         await addLineItemViaModal(page, app, 'Item', { qty: '2', unitPrice: capturedItem?.price || '3000', itemName: capturedItem?.name });
  1049 | 
  1050 |         // Miscellaneous line
  1051 |         await page.getByRole('button', { name: 'Line Item' }).click();
  1052 |         const modal2 = page.getByRole('dialog').last();
  1053 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  1054 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  1055 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  1056 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '500', description: 'Clearance fee' });
  1057 |         } else {
  1058 |             await page.keyboard.press('Escape');
  1059 |             await page.getByRole('button', { name: 'Line Item' }).click();
  1060 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '500' });
  1061 |         }
  1062 | 
  1063 |         // Chakra UI Bill table uses div rows, not <table>/<tbody>/<tr>
  1064 |         // Count via the Sale/Purchase items list rows (div-based)
  1065 |         const rowCount = await page.locator(
  1066 |             'table tbody tr, [role="row"], [data-testid*="line"], [data-testid*="item"], .line-item-row'
  1067 |         ).count();
  1068 |         const altRowCount = await page.locator('.chakra-stack > div, .flex-row').filter({ hasText: /\d+/ }).count();
  1069 |         const effectiveRowCount = rowCount > 0 ? rowCount : altRowCount;
  1070 |         console.log(`[AUDIT] ${effectiveRowCount} lines in Bill form (table rows: ${rowCount}, alt: ${altRowCount})`);
  1071 |         // Soft check — at least 1 row; the hard check is on API lines count below
  1072 |         if (effectiveRowCount < 2) {
  1073 |             console.log(`[WARN] UI row count ${effectiveRowCount} < 2; will validate via API instead`);
  1074 |         }
  1075 | 
  1076 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  1077 |         await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 });
  1078 | 
  1079 |         const billId = await app.extractIdFromUrl();
  1080 |         await app.advanceDocumentAPI(billId, 'bills');
  1081 |         const billData = await app.api.purchase.getBillAPI(billId);
  1082 |         // ERP GET /bill/{id} does NOT return line items in a direct array for standalone bills.
  1083 |         // Actual keys: accounts_payable, currency, current_approval_step, due_date,
  1084 |         //   id, invoice_date, invoice_number, purchase_journal, received_purchase_order_items,
  1085 |         //   related_files, unpaid_amount, vendor
  1086 |         // Validate via: purchase_journal entries (reflects line-item GL postings) + unpaid_amount > 0
  1087 |         const journalEntries: any[] = billData.purchase_journal?.journal_entries ||
  1088 |                                       billData.received_purchase_order_items ||
  1089 |                                       billData.items ||
  1090 |                                       [];
  1091 |         const unpaidAmount = parseFloat(billData.unpaid_amount ?? billData.total_amount ?? billData.amount ?? '0');
  1092 |         console.log(`[AUDIT] Journal entries: ${journalEntries.length} | Unpaid amount: $${unpaidAmount}`);
  1093 |         console.log(`[DEBUG] Bill data keys: ${Object.keys(billData).join(', ')}`);
```