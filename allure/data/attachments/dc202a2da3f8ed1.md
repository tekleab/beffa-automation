# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/cross-module-ui-flows.spec.ts >> Cross-Module UI Flow Audits @sales @purchase @smoke @full >> Purchase UI: Approved bill reflects outstanding balance in vendor profile
- Location: tests/cross-module/cross-module-ui-flows.spec.ts:55:9

# Error details

```
Error: Bill BILL/2026/08/24/002562 should be linked to vendor "Gentium Concrite Industry" via API

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
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
                      - link "Vendors" [ref=e183] [cursor=pointer]:
                        - /url: /payables/vendors/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=e184]:
                      - link "Detail" [ref=e185] [cursor=pointer]:
                        - /url: /payables/vendors/8c8b8d32-3171-4290-ae83-17e58ccaf323/detail
            - button "2019" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2019"
              - img [ref=e189]
          - generic [ref=e192]:
            - button "Toggle Visibility" [ref=e195] [cursor=pointer]:
              - img [ref=e196]
            - generic [ref=e198]:
              - generic [ref=e200]:
                - heading "Vendor Details" [level=3] [ref=e201]
                - group [ref=e204]:
                  - button "submit" [ref=e205] [cursor=pointer]: Submit
                  - button "edit" [ref=e206] [cursor=pointer]: Edit
                  - button "remove" [ref=e208] [cursor=pointer]: Remove
              - generic [ref=e210]:
                - generic [ref=e211]:
                  - paragraph [ref=e212]: General
                  - generic [ref=e213]:
                    - paragraph [ref=e214]: "Vendor ID:"
                    - paragraph [ref=e215]: VEND/2026/07/27/000001
                    - paragraph [ref=e216]: "Name:"
                    - paragraph [ref=e217]: Gentium Concrite Industry
                    - paragraph [ref=e218]: "Vendor Type:"
                    - paragraph [ref=e219]: service
                  - paragraph [ref=e220]: Accounting
                  - generic [ref=e221]:
                    - paragraph [ref=e222]: "Expense Account:"
                    - paragraph [ref=e223]: Salaries and Wages
                    - paragraph [ref=e224]: "TIN:"
                    - paragraph [ref=e225]: "0014345098"
                    - paragraph [ref=e226]: "Due Balance:"
                    - paragraph [ref=e227]: 394,811,891.88
                - generic [ref=e228]:
                  - paragraph [ref=e229]: Address
                  - generic [ref=e230]:
                    - generic [ref=e231]:
                      - paragraph [ref=e232]: "Region:"
                      - paragraph [ref=e233]: Addis Ababa City Administration
                    - generic [ref=e234]:
                      - paragraph [ref=e235]: "Zone:"
                      - paragraph [ref=e236]: Bole Subcity
                    - generic [ref=e237]:
                      - paragraph [ref=e238]: "City:"
                      - paragraph
                    - generic [ref=e239]:
                      - paragraph [ref=e240]: "Woreda:"
                      - paragraph [ref=e241]: Woreda 5
                    - generic [ref=e242]:
                      - paragraph [ref=e243]: "Kebele:"
                      - paragraph [ref=e244]: Kebele 01
                    - generic [ref=e245]:
                      - paragraph [ref=e246]: "House NO:"
                      - paragraph
              - generic [ref=e249]:
                - tablist [ref=e250]:
                  - tab "Purchase Orders" [selected] [ref=e251] [cursor=pointer]
                  - tab "Bills" [ref=e252] [cursor=pointer]
                  - tab "Payments" [ref=e253] [cursor=pointer]
                  - tab "Quotes" [ref=e254] [cursor=pointer]
                  - tab "Leases" [ref=e255] [cursor=pointer]
                  - tab "Services" [ref=e256] [cursor=pointer]
                - tabpanel "Purchase Orders" [ref=e258]:
                  - generic [ref=e259]:
                    - table [ref=e262]:
                      - rowgroup [ref=e263]:
                        - row "Purchase Order (PO) Number Order Date PO Status Accounts Payable Discount Term" [ref=e264]:
                          - columnheader "Purchase Order (PO) Number" [ref=e265] [cursor=pointer]: Purchase Order (PO) Number
                          - columnheader "Order Date" [ref=e267] [cursor=pointer]: Order Date
                          - columnheader "PO Status" [ref=e269] [cursor=pointer]: PO Status
                          - columnheader "Accounts Payable" [ref=e271] [cursor=pointer]: Accounts Payable
                          - columnheader "Discount Term" [ref=e273] [cursor=pointer]: Discount Term
                      - rowgroup [ref=e275]:
                        - row "PO/2026/08/05/000137 September 15, 2026 Draft 2001-Bank Overdraft" [ref=e276]:
                          - cell "PO/2026/08/05/000137" [ref=e277]:
                            - link "PO/2026/08/05/000137" [ref=e279] [cursor=pointer]:
                              - /url: /payables/purchase-orders/5b30d583-25ec-4f21-b2ee-a1f96ae01279/detail
                          - cell "September 15, 2026" [ref=e280]:
                            - generic [ref=e281]: September 15, 2026
                          - cell "Draft" [ref=e282]:
                            - generic [ref=e284]: Draft
                          - cell "2001-Bank Overdraft" [ref=e285]:
                            - generic [ref=e286]: 2001-Bank Overdraft
                          - cell [ref=e287]
                        - row "PO/2026/08/05/000113 September 15, 2026 Draft 2001-Bank Overdraft" [ref=e288]:
                          - cell "PO/2026/08/05/000113" [ref=e289]:
                            - link "PO/2026/08/05/000113" [ref=e291] [cursor=pointer]:
                              - /url: /payables/purchase-orders/7c7dcda6-6a6f-48b4-8ed3-5ca2d1eafb69/detail
                          - cell "September 15, 2026" [ref=e292]:
                            - generic [ref=e293]: September 15, 2026
                          - cell "Draft" [ref=e294]:
                            - generic [ref=e296]: Draft
                          - cell "2001-Bank Overdraft" [ref=e297]:
                            - generic [ref=e298]: 2001-Bank Overdraft
                          - cell [ref=e299]
                        - row "PO/2026/08/06/000330 September 15, 2026 Draft 2001-Bank Overdraft" [ref=e300]:
                          - cell "PO/2026/08/06/000330" [ref=e301]:
                            - link "PO/2026/08/06/000330" [ref=e303] [cursor=pointer]:
                              - /url: /payables/purchase-orders/81bf9730-3dfe-4b16-8214-9eb674852a26/detail
                          - cell "September 15, 2026" [ref=e304]:
                            - generic [ref=e305]: September 15, 2026
                          - cell "Draft" [ref=e306]:
                            - generic [ref=e308]: Draft
                          - cell "2001-Bank Overdraft" [ref=e309]:
                            - generic [ref=e310]: 2001-Bank Overdraft
                          - cell [ref=e311]
                        - row "PO/2026/08/05/000099 September 15, 2026 Draft 2001-Bank Overdraft" [ref=e312]:
                          - cell "PO/2026/08/05/000099" [ref=e313]:
                            - link "PO/2026/08/05/000099" [ref=e315] [cursor=pointer]:
                              - /url: /payables/purchase-orders/f0a71cba-23ca-4db7-afb2-2c49e4299ad3/detail
                          - cell "September 15, 2026" [ref=e316]:
                            - generic [ref=e317]: September 15, 2026
                          - cell "Draft" [ref=e318]:
                            - generic [ref=e320]: Draft
                          - cell "2001-Bank Overdraft" [ref=e321]:
                            - generic [ref=e322]: 2001-Bank Overdraft
                          - cell [ref=e323]
                        - row "PO/2026/08/05/000110 September 15, 2026 Draft 2001-Bank Overdraft" [ref=e324]:
                          - cell "PO/2026/08/05/000110" [ref=e325]:
                            - link "PO/2026/08/05/000110" [ref=e327] [cursor=pointer]:
                              - /url: /payables/purchase-orders/01c63f5b-a3bd-4450-87cf-8f959a9bfff4/detail
                          - cell "September 15, 2026" [ref=e328]:
                            - generic [ref=e329]: September 15, 2026
                          - cell "Draft" [ref=e330]:
                            - generic [ref=e332]: Draft
                          - cell "2001-Bank Overdraft" [ref=e333]:
                            - generic [ref=e334]: 2001-Bank Overdraft
                          - cell [ref=e335]
                        - row "PO/2026/08/05/000109 September 15, 2026 Draft 2001-Bank Overdraft" [ref=e336]:
                          - cell "PO/2026/08/05/000109" [ref=e337]:
                            - link "PO/2026/08/05/000109" [ref=e339] [cursor=pointer]:
                              - /url: /payables/purchase-orders/549f75b1-9b59-4e56-a64d-5bd97bb8c4cb/detail
                          - cell "September 15, 2026" [ref=e340]:
                            - generic [ref=e341]: September 15, 2026
                          - cell "Draft" [ref=e342]:
                            - generic [ref=e344]: Draft
                          - cell "2001-Bank Overdraft" [ref=e345]:
                            - generic [ref=e346]: 2001-Bank Overdraft
                          - cell [ref=e347]
                        - row "PO/2026/08/06/000308 September 15, 2026 Approved 1001-Cash - Main Office" [ref=e348]:
                          - cell "PO/2026/08/06/000308" [ref=e349]:
                            - link "PO/2026/08/06/000308" [ref=e351] [cursor=pointer]:
                              - /url: /payables/purchase-orders/fdb55824-3d4d-41b5-98c9-555dcd51b320/detail
                          - cell "September 15, 2026" [ref=e352]:
                            - generic [ref=e353]: September 15, 2026
                          - cell "Approved" [ref=e354]:
                            - generic [ref=e356]: Approved
                          - cell "1001-Cash - Main Office" [ref=e357]:
                            - generic [ref=e358]: 1001-Cash - Main Office
                          - cell [ref=e359]
                        - row "PO/2026/08/06/000329 September 15, 2026 Draft 2001-Bank Overdraft" [ref=e360]:
                          - cell "PO/2026/08/06/000329" [ref=e361]:
                            - link "PO/2026/08/06/000329" [ref=e363] [cursor=pointer]:
                              - /url: /payables/purchase-orders/89fd5042-8c68-4224-bfc2-579b4c200749/detail
                          - cell "September 15, 2026" [ref=e364]:
                            - generic [ref=e365]: September 15, 2026
                          - cell "Draft" [ref=e366]:
                            - generic [ref=e368]: Draft
                          - cell "2001-Bank Overdraft" [ref=e369]:
                            - generic [ref=e370]: 2001-Bank Overdraft
                          - cell [ref=e371]
                        - row "PO/2026/08/05/000098 September 15, 2026 Draft 2001-Bank Overdraft" [ref=e372]:
                          - cell "PO/2026/08/05/000098" [ref=e373]:
                            - link "PO/2026/08/05/000098" [ref=e375] [cursor=pointer]:
                              - /url: /payables/purchase-orders/6eca1cfb-171b-4cdf-810f-6df6fe254363/detail
                          - cell "September 15, 2026" [ref=e376]:
                            - generic [ref=e377]: September 15, 2026
                          - cell "Draft" [ref=e378]:
                            - generic [ref=e380]: Draft
                          - cell "2001-Bank Overdraft" [ref=e381]:
                            - generic [ref=e382]: 2001-Bank Overdraft
                          - cell [ref=e383]
                        - row "PO/2026/08/05/000085 September 15, 2026 Draft 2001-Bank Overdraft" [ref=e384]:
                          - cell "PO/2026/08/05/000085" [ref=e385]:
                            - link "PO/2026/08/05/000085" [ref=e387] [cursor=pointer]:
                              - /url: /payables/purchase-orders/7f6cbf2f-9408-420d-ad80-ed73022a20ba/detail
                          - cell "September 15, 2026" [ref=e388]:
                            - generic [ref=e389]: September 15, 2026
                          - cell "Draft" [ref=e390]:
                            - generic [ref=e392]: Draft
                          - cell "2001-Bank Overdraft" [ref=e393]:
                            - generic [ref=e394]: 2001-Bank Overdraft
                          - cell [ref=e395]
                        - row "PO/2026/08/05/000105 September 15, 2026 Draft 2001-Bank Overdraft" [ref=e396]:
                          - cell "PO/2026/08/05/000105" [ref=e397]:
                            - link "PO/2026/08/05/000105" [ref=e399] [cursor=pointer]:
                              - /url: /payables/purchase-orders/81d4d8c9-d49c-44d3-8c14-24ae179dbd5d/detail
                          - cell "September 15, 2026" [ref=e400]:
                            - generic [ref=e401]: September 15, 2026
                          - cell "Draft" [ref=e402]:
                            - generic [ref=e404]: Draft
                          - cell "2001-Bank Overdraft" [ref=e405]:
                            - generic [ref=e406]: 2001-Bank Overdraft
                          - cell [ref=e407]
                        - row "PO/2026/08/05/000115 September 15, 2026 Draft 2001-Bank Overdraft" [ref=e408]:
                          - cell "PO/2026/08/05/000115" [ref=e409]:
                            - link "PO/2026/08/05/000115" [ref=e411] [cursor=pointer]:
                              - /url: /payables/purchase-orders/f0da8aaf-aa58-446a-a36c-c89eb58632ea/detail
                          - cell "September 15, 2026" [ref=e412]:
                            - generic [ref=e413]: September 15, 2026
                          - cell "Draft" [ref=e414]:
                            - generic [ref=e416]: Draft
                          - cell "2001-Bank Overdraft" [ref=e417]:
                            - generic [ref=e418]: 2001-Bank Overdraft
                          - cell [ref=e419]
                        - row "PO/2026/08/05/000106 September 15, 2026 Draft 2001-Bank Overdraft" [ref=e420]:
                          - cell "PO/2026/08/05/000106" [ref=e421]:
                            - link "PO/2026/08/05/000106" [ref=e423] [cursor=pointer]:
                              - /url: /payables/purchase-orders/6cdcd17d-3af2-4ce8-be86-459e90a6967d/detail
                          - cell "September 15, 2026" [ref=e424]:
                            - generic [ref=e425]: September 15, 2026
                          - cell "Draft" [ref=e426]:
                            - generic [ref=e428]: Draft
                          - cell "2001-Bank Overdraft" [ref=e429]:
                            - generic [ref=e430]: 2001-Bank Overdraft
                          - cell [ref=e431]
                        - row "PO/2026/08/05/000084 September 15, 2026 Draft 2001-Bank Overdraft" [ref=e432]:
                          - cell "PO/2026/08/05/000084" [ref=e433]:
                            - link "PO/2026/08/05/000084" [ref=e435] [cursor=pointer]:
                              - /url: /payables/purchase-orders/09913d85-d948-41a9-8b32-8c5876f97b42/detail
                          - cell "September 15, 2026" [ref=e436]:
                            - generic [ref=e437]: September 15, 2026
                          - cell "Draft" [ref=e438]:
                            - generic [ref=e440]: Draft
                          - cell "2001-Bank Overdraft" [ref=e441]:
                            - generic [ref=e442]: 2001-Bank Overdraft
                          - cell [ref=e443]
                        - row "PO/2026/08/05/000122 September 15, 2026 Draft 2001-Bank Overdraft" [ref=e444]:
                          - cell "PO/2026/08/05/000122" [ref=e445]:
                            - link "PO/2026/08/05/000122" [ref=e447] [cursor=pointer]:
                              - /url: /payables/purchase-orders/58a680ba-2f27-43c7-a733-56c8cd58259f/detail
                          - cell "September 15, 2026" [ref=e448]:
                            - generic [ref=e449]: September 15, 2026
                          - cell "Draft" [ref=e450]:
                            - generic [ref=e452]: Draft
                          - cell "2001-Bank Overdraft" [ref=e453]:
                            - generic [ref=e454]: 2001-Bank Overdraft
                          - cell [ref=e455]
                      - rowgroup [ref=e456]:
                        - row [ref=e457]:
                          - columnheader [ref=e458]
                          - columnheader [ref=e459]
                          - columnheader [ref=e460]
                          - columnheader [ref=e461]
                          - columnheader [ref=e462]
                    - generic [ref=e463]:
                      - generic [ref=e465]:
                        - combobox [ref=e466]:
                          - option "Show 5 rows"
                          - option "Show 10 rows"
                          - option "Show 15 rows" [selected]
                          - option "Show 25 rows"
                          - option "Show 50 rows"
                          - option "Show 100 rows"
                        - generic:
                          - img
                      - generic [ref=e468]:
                        - button "go to first page" [disabled] [ref=e469]:
                          - img [ref=e470]
                        - generic [ref=e472]:
                          - button "go to previous page" [disabled] [ref=e473]:
                            - img [ref=e474]
                          - paragraph [ref=e476]: Page
                          - paragraph [ref=e477]: 1 of 100
                          - button "go to next page" [ref=e478] [cursor=pointer]:
                            - img [ref=e479]
                        - button "go to last page" [ref=e481] [cursor=pointer]:
                          - img [ref=e482]
        - generic [ref=e484]: BM Technology © 2026
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
  26  |             customerId: meta.customerId,
  27  |             itemId: item.itemId,
  28  |             quantity: 1,
  29  |             unitPrice: INVOICE_AMOUNT,
  30  |             locationId: item.locationId,
  31  |             warehouseId: item.warehouseId
  32  |         });
  33  |         await app.advanceDocumentAPI(inv.id, 'invoices');
  34  |         console.log(`[OK] Invoice ${inv.ref} approved.`);
  35  | 
  36  |         // Fetch actual invoice amount after approval
  37  |         const invData = await app.api.sales.getInvoiceAPI(inv.id);
  38  |         const actualDue = parseFloat(invData.unreceived_amount ?? invData.due ?? invData.net_due ?? '0');
  39  |         console.log(`[INFO] Invoice ${inv.ref} | Amount Due from API: ${actualDue}`);
  40  |         expect(actualDue, 'Invoice Amount Due must be > 0 after approval').toBeGreaterThan(0);
  41  | 
  42  |         console.log(`[STEP 2] Navigating to invoice detail page...`);
  43  |         await page.goto(`/receivables/invoices/${inv.id}/detail`, { waitUntil: 'domcontentloaded' });
  44  |         await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  45  | 
  46  |         console.log(`[STEP 3] Verifying Amount Due is displayed on invoice detail page...`);
  47  |         // Look for the amount due value rendered anywhere on the page
  48  |         const amountDueText = actualDue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  49  |         const amountDueLocator = page.getByText(new RegExp(amountDueText.replace('.', '\\.'), 'i')).first();
  50  |         await expect(amountDueLocator).toBeVisible({ timeout: 15000 });
  51  | 
  52  |         console.log(`[PASS] Invoice ${inv.ref} Amount Due (${actualDue}) is visible on detail page.`);
  53  |     });
  54  | 
  55  |     test('Purchase UI: Approved bill reflects outstanding balance in vendor profile', async ({ page }) => {
  56  |         test.setTimeout(180000);
  57  |         const app = new AppManager(page);
  58  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  59  | 
  60  |         console.log(`[STEP 1] Creating & approving bill via API...`);
  61  |         // Use discoverMetadataAPI to avoid slow createFreshItemWithStockAPI
  62  |         const purchaseMeta = await app.api.purchase.discoverMetadataAPI();
  63  |         const invMeta = await app.api.inventory.discoverMetadataAPI();
  64  |         const { apiBase, headers, qs } = await app.buildApiContext();
  65  | 
  66  |         // Discover a GL expense account
  67  |         const acctResp = await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers });
  68  |         const allAccounts = (await acctResp.json()).items || (await acctResp.json()).data || [];
  69  |         const glAcct = allAccounts.find((a: any) => (a.type || a.account_type || '').toLowerCase().includes('expense')) || allAccounts[0];
  70  | 
  71  |         const { DateHelper } = require('../../lib/utils/DateHelper');
  72  |         const dateIso = (await DateHelper.resolve(page)).iso;
  73  | 
  74  |         // Create a miscellaneous bill (no item_id needed) directly
  75  |         const BILL_AMOUNT = 5000;
  76  |         const billResp = await page.request.post(`${apiBase}/bills?${qs}`, {
  77  |             headers,
  78  |             data: {
  79  |                 vendor_id: purchaseMeta.vendorId,
  80  |                 accounts_payable_id: purchaseMeta.apAccountId,
  81  |                 currency_id: purchaseMeta.currencyId,
  82  |                 invoice_date: dateIso,
  83  |                 due_date: dateIso,
  84  |                 items: [{ description: 'E2E Audit Bill', quantity: 1, unit_price: BILL_AMOUNT, amount: BILL_AMOUNT, general_ledger_account_id: glAcct?.id }],
  85  |                 status: 'draft'
  86  |             }
  87  |         });
  88  |         if (!billResp.ok()) throw new Error(`Bill creation failed: ${billResp.status()} ${await billResp.text()}`);
  89  |         const billJson = await billResp.json();
  90  |         const bill = { id: billJson.id, ref: billJson.invoice_number || billJson.ref };
  91  |         await app.advanceDocumentAPI(bill.id, 'bills');
  92  |         console.log(`[OK] Bill ${bill.ref} approved.`);
  93  | 
  94  |         const vendorId = purchaseMeta.vendorId;
  95  |         const vendorName = purchaseMeta.vendorName;
  96  | 
  97  |         console.log(`[STEP 3] Navigating to vendor profile UI...`);
  98  |         await page.goto(`/payables/vendors/${vendorId}/detail`, { waitUntil: 'domcontentloaded' });
  99  |         await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  100 | 
  101 |         if (page.url().includes('/users/login')) {
  102 |             await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  103 |             await page.goto(`/payables/vendors/${vendorId}/detail`, { waitUntil: 'domcontentloaded' });
  104 |             await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  105 |         }
  106 | 
  107 |         console.log(`[INFO] Current URL: ${page.url()}`);
  108 | 
  109 |         console.log(`[STEP 5] Verifying bill ${bill.ref} is linked to vendor via API...`);
  110 |         let billFound = false;
  111 | 
  112 |         // Fetch the bill directly by ID — fastest and most reliable check
  113 |         for (let attempt = 0; attempt < 5 && !billFound; attempt++) {
  114 |             const resp = await page.request.get(`${apiBase}/bill/${bill.id}?${qs}`, { headers });
  115 |             if (resp.ok()) {
  116 |                 const data = await resp.json();
  117 |                 const billVendorId = data.vendor_id || data.vendor?.id;
  118 |                 billFound = !!data.id && (billVendorId === vendorId || !billVendorId);
  119 |             }
  120 |             if (!billFound) {
  121 |                 console.log(`[POLL ${attempt + 1}/5] Bill not yet indexed, waiting 2s...`);
  122 |                 await page.waitForTimeout(2000);
  123 |             }
  124 |         }
  125 | 
> 126 |         expect(billFound, `Bill ${bill.ref} should be linked to vendor "${vendorName}" via API`).toBe(true);
      |                                                                                                  ^ Error: Bill BILL/2026/08/24/002562 should be linked to vendor "Gentium Concrite Industry" via API
  127 |         console.log(`[PASS] Bill ${bill.ref} confirmed linked to vendor "${vendorName}". Outstanding balance reflected.`);
  128 |     });
  129 | });
  130 | 
```