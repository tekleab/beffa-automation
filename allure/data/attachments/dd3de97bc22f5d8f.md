# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/customer-balance-ui.spec.ts >> Sales Customer Balance UI Audits @sales @smoke @full >> UI Audit: Approved invoice reflects outstanding balance in customer profile
- Location: tests/sales/customer-balance-ui.spec.ts:16:9

# Error details

```
TimeoutError: page.waitForLoadState: Timeout 10000ms exceeded.
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
                      - link "Customer" [ref=e183] [cursor=pointer]:
                        - /url: /receivables/customers/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=e184]:
                      - link "Detail" [ref=e185] [cursor=pointer]:
                        - /url: /receivables/customers/ddba3abe-40b3-4c51-8d43-7341690d1949/detail
            - button "2018" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2018"
              - img [ref=e189]
          - generic [ref=e192]:
            - button "Toggle Visibility" [ref=e195] [cursor=pointer]:
              - img [ref=e196]
            - generic [ref=e198]:
              - generic [ref=e199]:
                - heading "Customer Details" [level=3] [ref=e200]
                - group [ref=e204]:
                  - button "edit" [ref=e205] [cursor=pointer]: Edit
                  - button "remove" [ref=e207] [cursor=pointer]: Remove
              - generic [ref=e209]:
                - generic [ref=e210]:
                  - generic [ref=e211]:
                    - paragraph [ref=e212]: "Customer Name :"
                    - paragraph [ref=e213]: Base Ethiopia
                  - generic [ref=e214]:
                    - paragraph [ref=e215]: "Customer ID :"
                    - paragraph [ref=e216]: CUST/2026/06/05/000001
                  - generic [ref=e217]:
                    - paragraph [ref=e218]: "Customer Type :"
                    - paragraph [ref=e219]: company
                  - generic [ref=e220]:
                    - paragraph [ref=e221]: "Customer TIN :"
                    - paragraph [ref=e222]: "0010657485"
                  - generic [ref=e223]:
                    - paragraph [ref=e224]: "Main Phone :"
                    - paragraph [ref=e225]: "0919092334"
                  - generic [ref=e226]:
                    - paragraph [ref=e227]: "Alt Phone :"
                    - paragraph
                  - generic [ref=e228]:
                    - paragraph [ref=e229]: "Fax :"
                    - paragraph
                  - generic [ref=e230]:
                    - paragraph [ref=e231]: "Email :"
                    - paragraph [ref=e232]: bek@gmail.com
                  - generic [ref=e233]:
                    - paragraph [ref=e234]: "Website :"
                    - paragraph [ref=e235]: www.baseethiopia.com
                - generic [ref=e236]:
                  - generic [ref=e237]:
                    - paragraph [ref=e238]: "Region :"
                    - paragraph [ref=e239]: Addis Ababa City Administration
                  - generic [ref=e240]:
                    - paragraph [ref=e241]: "Zone :"
                    - paragraph [ref=e242]: Bole Subcity
                  - generic [ref=e243]:
                    - paragraph [ref=e244]: "Woreda :"
                    - paragraph [ref=e245]: Woreda 3
                  - generic [ref=e246]:
                    - paragraph [ref=e247]: "Kebele :"
                    - paragraph [ref=e248]: Kebele 05
                  - generic [ref=e249]:
                    - paragraph [ref=e250]: "House No.:"
                    - paragraph
              - generic [ref=e255]:
                - tablist [ref=e256]:
                  - tab "Contacts" [ref=e257] [cursor=pointer]
                  - tab "Invoices" [active] [selected] [ref=e258] [cursor=pointer]
                  - tab "Receipts" [ref=e259] [cursor=pointer]
                  - tab "Sales Orders" [ref=e260] [cursor=pointer]
                  - tab "Projects" [ref=e261] [cursor=pointer]
                  - tab "Leases" [ref=e262] [cursor=pointer]
                  - tab "Services" [ref=e263] [cursor=pointer]
                - tabpanel "Invoices" [ref=e265]:
                  - generic [ref=e266]:
                    - table [ref=e269]:
                      - rowgroup [ref=e270]:
                        - row "Invoice No Customer Date Status Net Due" [ref=e271]:
                          - columnheader "Invoice No" [ref=e272]: Invoice No
                          - columnheader "Customer" [ref=e274]: Customer
                          - columnheader "Date" [ref=e276]: Date
                          - columnheader "Status" [ref=e278]: Status
                          - columnheader "Net Due" [ref=e280]: Net Due
                      - rowgroup [ref=e282]:
                        - row "INV/2026/06/05/000010 Base Ethiopia Jun 05, 2026 Draft 27810.244000000002" [ref=e283]:
                          - cell "INV/2026/06/05/000010" [ref=e284]:
                            - link "INV/2026/06/05/000010" [ref=e286] [cursor=pointer]:
                              - /url: /receivables/invoices/fe3dc0f5-8b41-4549-b408-b3a04fb47901/detail
                          - cell "Base Ethiopia" [ref=e287]:
                            - generic [ref=e288]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e289]:
                            - generic [ref=e290]: Jun 05, 2026
                          - cell "Draft" [ref=e291]:
                            - generic [ref=e293]: Draft
                          - cell "27810.244000000002" [ref=e294]:
                            - generic [ref=e295]: "27810.244000000002"
                        - row "INV/2026/06/05/000008 Base Ethiopia Jun 05, 2026 Approved 16424.308999999997" [ref=e296]:
                          - cell "INV/2026/06/05/000008" [ref=e297]:
                            - link "INV/2026/06/05/000008" [ref=e299] [cursor=pointer]:
                              - /url: /receivables/invoices/37ef23b1-fc97-4af7-96fa-ec53989a6195/detail
                          - cell "Base Ethiopia" [ref=e300]:
                            - generic [ref=e301]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e302]:
                            - generic [ref=e303]: Jun 05, 2026
                          - cell "Approved" [ref=e304]:
                            - generic [ref=e306]: Approved
                          - cell "16424.308999999997" [ref=e307]:
                            - generic [ref=e308]: "16424.308999999997"
                        - row "INV/2026/06/05/000001 Base Ethiopia Jun 05, 2026 Approved 0.0044000000052619725" [ref=e309]:
                          - cell "INV/2026/06/05/000001" [ref=e310]:
                            - link "INV/2026/06/05/000001" [ref=e312] [cursor=pointer]:
                              - /url: /receivables/invoices/22d01418-ba99-45aa-ab68-307dd4a7e95d/detail
                          - cell "Base Ethiopia" [ref=e313]:
                            - generic [ref=e314]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e315]:
                            - generic [ref=e316]: Jun 05, 2026
                          - cell "Approved" [ref=e317]:
                            - generic [ref=e319]: Approved
                          - cell "0.0044000000052619725" [ref=e320]:
                            - generic [ref=e321]: "0.0044000000052619725"
                        - row "INV/2026/06/05/000002 Base Ethiopia Jun 05, 2026 Approved 588.27" [ref=e322]:
                          - cell "INV/2026/06/05/000002" [ref=e323]:
                            - link "INV/2026/06/05/000002" [ref=e325] [cursor=pointer]:
                              - /url: /receivables/invoices/d14e9064-14dc-466e-944c-e900c160b10d/detail
                          - cell "Base Ethiopia" [ref=e326]:
                            - generic [ref=e327]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e328]:
                            - generic [ref=e329]: Jun 05, 2026
                          - cell "Approved" [ref=e330]:
                            - generic [ref=e332]: Approved
                          - cell "588.27" [ref=e333]:
                            - generic [ref=e334]: "588.27"
                        - row "INV/2026/06/05/000015 Base Ethiopia Jun 05, 2026 Draft 3177.87" [ref=e335]:
                          - cell "INV/2026/06/05/000015" [ref=e336]:
                            - link "INV/2026/06/05/000015" [ref=e338] [cursor=pointer]:
                              - /url: /receivables/invoices/e8f7cf5a-400a-46d0-8b46-11144cc7e2db/detail
                          - cell "Base Ethiopia" [ref=e339]:
                            - generic [ref=e340]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e341]:
                            - generic [ref=e342]: Jun 05, 2026
                          - cell "Draft" [ref=e343]:
                            - generic [ref=e345]: Draft
                          - cell "3177.87" [ref=e346]:
                            - generic [ref=e347]: "3177.87"
                        - row "INV/2026/06/05/000003 Base Ethiopia Jun 05, 2026 Approved -918.961" [ref=e348]:
                          - cell "INV/2026/06/05/000003" [ref=e349]:
                            - link "INV/2026/06/05/000003" [ref=e351] [cursor=pointer]:
                              - /url: /receivables/invoices/8e93b880-798f-4d75-8ba6-a9680acb1886/detail
                          - cell "Base Ethiopia" [ref=e352]:
                            - generic [ref=e353]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e354]:
                            - generic [ref=e355]: Jun 05, 2026
                          - cell "Approved" [ref=e356]:
                            - generic [ref=e358]: Approved
                          - cell "-918.961" [ref=e359]:
                            - generic [ref=e360]: "-918.961"
                        - row "INV/2026/06/05/000009 Base Ethiopia Jun 05, 2026 Approved 23975.311599999997" [ref=e361]:
                          - cell "INV/2026/06/05/000009" [ref=e362]:
                            - link "INV/2026/06/05/000009" [ref=e364] [cursor=pointer]:
                              - /url: /receivables/invoices/d206dddf-8577-4e1d-a93d-8e5f777f8920/detail
                          - cell "Base Ethiopia" [ref=e365]:
                            - generic [ref=e366]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e367]:
                            - generic [ref=e368]: Jun 05, 2026
                          - cell "Approved" [ref=e369]:
                            - generic [ref=e371]: Approved
                          - cell "23975.311599999997" [ref=e372]:
                            - generic [ref=e373]: "23975.311599999997"
                        - row "INV/2026/06/05/000004 Base Ethiopia Jun 05, 2026 Approved 3241.458" [ref=e374]:
                          - cell "INV/2026/06/05/000004" [ref=e375]:
                            - link "INV/2026/06/05/000004" [ref=e377] [cursor=pointer]:
                              - /url: /receivables/invoices/9b8b1440-4b2f-4a6b-bce3-8d3ba18218fa/detail
                          - cell "Base Ethiopia" [ref=e378]:
                            - generic [ref=e379]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e380]:
                            - generic [ref=e381]: Jun 05, 2026
                          - cell "Approved" [ref=e382]:
                            - generic [ref=e384]: Approved
                          - cell "3241.458" [ref=e385]:
                            - generic [ref=e386]: "3241.458"
                        - row "INV/2026/06/05/000013 Base Ethiopia Jun 05, 2026 Approved 10173.188999999998" [ref=e387]:
                          - cell "INV/2026/06/05/000013" [ref=e388]:
                            - link "INV/2026/06/05/000013" [ref=e390] [cursor=pointer]:
                              - /url: /receivables/invoices/65411ec8-d12e-49e3-8d87-fda67caa27d6/detail
                          - cell "Base Ethiopia" [ref=e391]:
                            - generic [ref=e392]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e393]:
                            - generic [ref=e394]: Jun 05, 2026
                          - cell "Approved" [ref=e395]:
                            - generic [ref=e397]: Approved
                          - cell "10173.188999999998" [ref=e398]:
                            - generic [ref=e399]: "10173.188999999998"
                        - row "INV/2026/06/05/000005 Base Ethiopia Jun 05, 2026 Approved 3241.4274" [ref=e400]:
                          - cell "INV/2026/06/05/000005" [ref=e401]:
                            - link "INV/2026/06/05/000005" [ref=e403] [cursor=pointer]:
                              - /url: /receivables/invoices/9668c88a-1f66-46e9-837b-7fcbfdd0baf3/detail
                          - cell "Base Ethiopia" [ref=e404]:
                            - generic [ref=e405]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e406]:
                            - generic [ref=e407]: Jun 05, 2026
                          - cell "Approved" [ref=e408]:
                            - generic [ref=e410]: Approved
                          - cell "3241.4274" [ref=e411]:
                            - generic [ref=e412]: "3241.4274"
                        - row "INV/2026/06/05/000006 Base Ethiopia Jun 05, 2026 Approved -40.55" [ref=e413]:
                          - cell "INV/2026/06/05/000006" [ref=e414]:
                            - link "INV/2026/06/05/000006" [ref=e416] [cursor=pointer]:
                              - /url: /receivables/invoices/a9f0b917-d972-4a1b-adf7-b849f92f6263/detail
                          - cell "Base Ethiopia" [ref=e417]:
                            - generic [ref=e418]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e419]:
                            - generic [ref=e420]: Jun 05, 2026
                          - cell "Approved" [ref=e421]:
                            - generic [ref=e423]: Approved
                          - cell "-40.55" [ref=e424]:
                            - generic [ref=e425]: "-40.55"
                        - row "INV/2026/06/05/000007 Base Ethiopia Jun 05, 2026 Approved 38934.1358" [ref=e426]:
                          - cell "INV/2026/06/05/000007" [ref=e427]:
                            - link "INV/2026/06/05/000007" [ref=e429] [cursor=pointer]:
                              - /url: /receivables/invoices/cb0392c6-788b-4319-b28a-89624e5e4e0c/detail
                          - cell "Base Ethiopia" [ref=e430]:
                            - generic [ref=e431]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e432]:
                            - generic [ref=e433]: Jun 05, 2026
                          - cell "Approved" [ref=e434]:
                            - generic [ref=e436]: Approved
                          - cell "38934.1358" [ref=e437]:
                            - generic [ref=e438]: "38934.1358"
                        - row "INV/2026/06/05/000016 Base Ethiopia Jun 05, 2026 Approved 61182.1742" [ref=e439]:
                          - cell "INV/2026/06/05/000016" [ref=e440]:
                            - link "INV/2026/06/05/000016" [ref=e442] [cursor=pointer]:
                              - /url: /receivables/invoices/3724b369-131e-4b5d-bbc2-92cf66a44623/detail
                          - cell "Base Ethiopia" [ref=e443]:
                            - generic [ref=e444]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e445]:
                            - generic [ref=e446]: Jun 05, 2026
                          - cell "Approved" [ref=e447]:
                            - generic [ref=e449]: Approved
                          - cell "61182.1742" [ref=e450]:
                            - generic [ref=e451]: "61182.1742"
                        - row "INV/2026/06/05/000014 Base Ethiopia Jun 05, 2026 Approved 104015.5594" [ref=e452]:
                          - cell "INV/2026/06/05/000014" [ref=e453]:
                            - link "INV/2026/06/05/000014" [ref=e455] [cursor=pointer]:
                              - /url: /receivables/invoices/9fbddcc2-f50d-407f-9735-c07bdad2adef/detail
                          - cell "Base Ethiopia" [ref=e456]:
                            - generic [ref=e457]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e458]:
                            - generic [ref=e459]: Jun 05, 2026
                          - cell "Approved" [ref=e460]:
                            - generic [ref=e462]: Approved
                          - cell "104015.5594" [ref=e463]:
                            - generic [ref=e464]: "104015.5594"
                        - row "INV/2026/06/05/000011 Base Ethiopia Jun 05, 2026 Approved 7695.13" [ref=e465]:
                          - cell "INV/2026/06/05/000011" [ref=e466]:
                            - link "INV/2026/06/05/000011" [ref=e468] [cursor=pointer]:
                              - /url: /receivables/invoices/a235d676-4fa2-48e0-9d9e-4bb14d0a61eb/detail
                          - cell "Base Ethiopia" [ref=e469]:
                            - generic [ref=e470]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e471]:
                            - generic [ref=e472]: Jun 05, 2026
                          - cell "Approved" [ref=e473]:
                            - generic [ref=e475]: Approved
                          - cell "7695.13" [ref=e476]:
                            - generic [ref=e477]: "7695.13"
                        - row "INV/2026/06/05/000012 Base Ethiopia Jun 05, 2026 Approved 1500" [ref=e478]:
                          - cell "INV/2026/06/05/000012" [ref=e479]:
                            - link "INV/2026/06/05/000012" [ref=e481] [cursor=pointer]:
                              - /url: /receivables/invoices/a9e86c6d-deb0-41f5-bfa1-6325c57198e8/detail
                          - cell "Base Ethiopia" [ref=e482]:
                            - generic [ref=e483]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e484]:
                            - generic [ref=e485]: Jun 05, 2026
                          - cell "Approved" [ref=e486]:
                            - generic [ref=e488]: Approved
                          - cell "1500" [ref=e489]:
                            - generic [ref=e490]: "1500"
                        - row "INV/2026/06/05/000017 Base Ethiopia Jun 05, 2026 Approved 736.94" [ref=e491]:
                          - cell "INV/2026/06/05/000017" [ref=e492]:
                            - link "INV/2026/06/05/000017" [ref=e494] [cursor=pointer]:
                              - /url: /receivables/invoices/674317b5-64f4-4454-8f83-55d29caf3514/detail
                          - cell "Base Ethiopia" [ref=e495]:
                            - generic [ref=e496]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e497]:
                            - generic [ref=e498]: Jun 05, 2026
                          - cell "Approved" [ref=e499]:
                            - generic [ref=e501]: Approved
                          - cell "736.94" [ref=e502]:
                            - generic [ref=e503]: "736.94"
                        - row "INV/2026/06/05/000019 Base Ethiopia Jun 05, 2026 Approved 40621.7" [ref=e504]:
                          - cell "INV/2026/06/05/000019" [ref=e505]:
                            - link "INV/2026/06/05/000019" [ref=e507] [cursor=pointer]:
                              - /url: /receivables/invoices/82bdb716-67fd-4038-9693-6344dce576e6/detail
                          - cell "Base Ethiopia" [ref=e508]:
                            - generic [ref=e509]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e510]:
                            - generic [ref=e511]: Jun 05, 2026
                          - cell "Approved" [ref=e512]:
                            - generic [ref=e514]: Approved
                          - cell "40621.7" [ref=e515]:
                            - generic [ref=e516]: "40621.7"
                        - row "INV/2026/06/05/000018 Base Ethiopia Jun 05, 2026 Draft 10773.188999999998" [ref=e517]:
                          - cell "INV/2026/06/05/000018" [ref=e518]:
                            - link "INV/2026/06/05/000018" [ref=e520] [cursor=pointer]:
                              - /url: /receivables/invoices/dadd505c-3b91-498b-83cf-fe735aecea56/detail
                          - cell "Base Ethiopia" [ref=e521]:
                            - generic [ref=e522]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e523]:
                            - generic [ref=e524]: Jun 05, 2026
                          - cell "Draft" [ref=e525]:
                            - generic [ref=e527]: Draft
                          - cell "10773.188999999998" [ref=e528]:
                            - generic [ref=e529]: "10773.188999999998"
                        - row "INV/2026/06/05/000021 Base Ethiopia Jun 05, 2026 Draft 7778.97" [ref=e530]:
                          - cell "INV/2026/06/05/000021" [ref=e531]:
                            - link "INV/2026/06/05/000021" [ref=e533] [cursor=pointer]:
                              - /url: /receivables/invoices/8f83cfe3-9196-4299-9a58-c765422319d5/detail
                          - cell "Base Ethiopia" [ref=e534]:
                            - generic [ref=e535]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e536]:
                            - generic [ref=e537]: Jun 05, 2026
                          - cell "Draft" [ref=e538]:
                            - generic [ref=e540]: Draft
                          - cell "7778.97" [ref=e541]:
                            - generic [ref=e542]: "7778.97"
                        - row "INV/2026/06/05/000025 Base Ethiopia Jun 05, 2026 Approved 19072.3" [ref=e543]:
                          - cell "INV/2026/06/05/000025" [ref=e544]:
                            - link "INV/2026/06/05/000025" [ref=e546] [cursor=pointer]:
                              - /url: /receivables/invoices/ba16b7f7-697d-4cd5-85c6-fe13bf1bc1fd/detail
                          - cell "Base Ethiopia" [ref=e547]:
                            - generic [ref=e548]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e549]:
                            - generic [ref=e550]: Jun 05, 2026
                          - cell "Approved" [ref=e551]:
                            - generic [ref=e553]: Approved
                          - cell "19072.3" [ref=e554]:
                            - generic [ref=e555]: "19072.3"
                        - row "INV/2026/06/05/000028 Base Ethiopia Jun 05, 2026 Approved 19072.3" [ref=e556]:
                          - cell "INV/2026/06/05/000028" [ref=e557]:
                            - link "INV/2026/06/05/000028" [ref=e559] [cursor=pointer]:
                              - /url: /receivables/invoices/c51989cc-34bd-4fe1-8fa7-4d00565728f4/detail
                          - cell "Base Ethiopia" [ref=e560]:
                            - generic [ref=e561]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e562]:
                            - generic [ref=e563]: Jun 05, 2026
                          - cell "Approved" [ref=e564]:
                            - generic [ref=e566]: Approved
                          - cell "19072.3" [ref=e567]:
                            - generic [ref=e568]: "19072.3"
                        - row "INV/2026/06/05/000026 Base Ethiopia Jun 05, 2026 Approved 7138.317" [ref=e569]:
                          - cell "INV/2026/06/05/000026" [ref=e570]:
                            - link "INV/2026/06/05/000026" [ref=e572] [cursor=pointer]:
                              - /url: /receivables/invoices/b957117b-28ec-4d6e-8192-df29e835577b/detail
                          - cell "Base Ethiopia" [ref=e573]:
                            - generic [ref=e574]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e575]:
                            - generic [ref=e576]: Jun 05, 2026
                          - cell "Approved" [ref=e577]:
                            - generic [ref=e579]: Approved
                          - cell "7138.317" [ref=e580]:
                            - generic [ref=e581]: "7138.317"
                        - row "INV/2026/06/05/000027 Base Ethiopia Jun 05, 2026 Approved 19072.3" [ref=e582]:
                          - cell "INV/2026/06/05/000027" [ref=e583]:
                            - link "INV/2026/06/05/000027" [ref=e585] [cursor=pointer]:
                              - /url: /receivables/invoices/023276bd-cd15-43ee-af68-d96290f7bdea/detail
                          - cell "Base Ethiopia" [ref=e586]:
                            - generic [ref=e587]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e588]:
                            - generic [ref=e589]: Jun 05, 2026
                          - cell "Approved" [ref=e590]:
                            - generic [ref=e592]: Approved
                          - cell "19072.3" [ref=e593]:
                            - generic [ref=e594]: "19072.3"
                        - row "INV/2026/06/05/000029 Base Ethiopia Jun 05, 2026 Approved 9018.590100000001" [ref=e595]:
                          - cell "INV/2026/06/05/000029" [ref=e596]:
                            - link "INV/2026/06/05/000029" [ref=e598] [cursor=pointer]:
                              - /url: /receivables/invoices/d1c73bab-02e6-430d-9b78-89cee7ea189b/detail
                          - cell "Base Ethiopia" [ref=e599]:
                            - generic [ref=e600]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e601]:
                            - generic [ref=e602]: Jun 05, 2026
                          - cell "Approved" [ref=e603]:
                            - generic [ref=e605]: Approved
                          - cell "9018.590100000001" [ref=e606]:
                            - generic [ref=e607]: "9018.590100000001"
                        - row "INV/2026/06/05/000030 Base Ethiopia Jun 05, 2026 Approved 7778.97" [ref=e608]:
                          - cell "INV/2026/06/05/000030" [ref=e609]:
                            - link "INV/2026/06/05/000030" [ref=e611] [cursor=pointer]:
                              - /url: /receivables/invoices/e4a39790-b1f2-4e02-b29f-444e594fd6b7/detail
                          - cell "Base Ethiopia" [ref=e612]:
                            - generic [ref=e613]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e614]:
                            - generic [ref=e615]: Jun 05, 2026
                          - cell "Approved" [ref=e616]:
                            - generic [ref=e618]: Approved
                          - cell "7778.97" [ref=e619]:
                            - generic [ref=e620]: "7778.97"
                        - row "INV/2026/06/05/000031 Base Ethiopia Jun 05, 2026 Approved 100" [ref=e621]:
                          - cell "INV/2026/06/05/000031" [ref=e622]:
                            - link "INV/2026/06/05/000031" [ref=e624] [cursor=pointer]:
                              - /url: /receivables/invoices/dae143d8-2373-4a45-b5c3-09250663c254/detail
                          - cell "Base Ethiopia" [ref=e625]:
                            - generic [ref=e626]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e627]:
                            - generic [ref=e628]: Jun 05, 2026
                          - cell "Approved" [ref=e629]:
                            - generic [ref=e631]: Approved
                          - cell "100" [ref=e632]:
                            - generic [ref=e633]: "100"
                        - row "INV/2026/06/05/000032 Base Ethiopia Jun 05, 2026 Approved 181543.5202" [ref=e634]:
                          - cell "INV/2026/06/05/000032" [ref=e635]:
                            - link "INV/2026/06/05/000032" [ref=e637] [cursor=pointer]:
                              - /url: /receivables/invoices/22b1e676-fc83-4acb-9878-24b437fef36d/detail
                          - cell "Base Ethiopia" [ref=e638]:
                            - generic [ref=e639]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e640]:
                            - generic [ref=e641]: Jun 05, 2026
                          - cell "Approved" [ref=e642]:
                            - generic [ref=e644]: Approved
                          - cell "181543.5202" [ref=e645]:
                            - generic [ref=e646]: "181543.5202"
                        - row "INV/2026/06/05/000034 Base Ethiopia Jun 05, 2026 Approved 89864.1478" [ref=e647]:
                          - cell "INV/2026/06/05/000034" [ref=e648]:
                            - link "INV/2026/06/05/000034" [ref=e650] [cursor=pointer]:
                              - /url: /receivables/invoices/89770b82-de11-491b-9e4e-d784098c8f39/detail
                          - cell "Base Ethiopia" [ref=e651]:
                            - generic [ref=e652]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e653]:
                            - generic [ref=e654]: Jun 05, 2026
                          - cell "Approved" [ref=e655]:
                            - generic [ref=e657]: Approved
                          - cell "89864.1478" [ref=e658]:
                            - generic [ref=e659]: "89864.1478"
                        - row "INV/2026/06/05/000035 Base Ethiopia Jun 05, 2026 Approved 7138.317" [ref=e660]:
                          - cell "INV/2026/06/05/000035" [ref=e661]:
                            - link "INV/2026/06/05/000035" [ref=e663] [cursor=pointer]:
                              - /url: /receivables/invoices/afc6fd38-a83f-424d-853d-c04a16ee697c/detail
                          - cell "Base Ethiopia" [ref=e664]:
                            - generic [ref=e665]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e666]:
                            - generic [ref=e667]: Jun 05, 2026
                          - cell "Approved" [ref=e668]:
                            - generic [ref=e670]: Approved
                          - cell "7138.317" [ref=e671]:
                            - generic [ref=e672]: "7138.317"
                        - row "INV/2026/06/05/000033 Base Ethiopia Jun 05, 2026 Approved 89864.1478" [ref=e673]:
                          - cell "INV/2026/06/05/000033" [ref=e674]:
                            - link "INV/2026/06/05/000033" [ref=e676] [cursor=pointer]:
                              - /url: /receivables/invoices/03b0bb5e-2358-49e4-95aa-21216b8d83ea/detail
                          - cell "Base Ethiopia" [ref=e677]:
                            - generic [ref=e678]: Base Ethiopia
                          - cell "Jun 05, 2026" [ref=e679]:
                            - generic [ref=e680]: Jun 05, 2026
                          - cell "Approved" [ref=e681]:
                            - generic [ref=e683]: Approved
                          - cell "89864.1478" [ref=e684]:
                            - generic [ref=e685]: "89864.1478"
                      - rowgroup [ref=e686]:
                        - row [ref=e687]:
                          - columnheader [ref=e688]
                          - columnheader [ref=e689]
                          - columnheader [ref=e690]
                          - columnheader [ref=e691]
                          - columnheader [ref=e692]
                    - generic [ref=e693]:
                      - generic [ref=e695]:
                        - combobox [ref=e696]:
                          - option "Show 5 rows"
                          - option "Show 10 rows" [selected]
                          - option "Show 15 rows"
                          - option "Show 25 rows"
                          - option "Show 50 rows"
                          - option "Show 100 rows"
                        - generic:
                          - img
                      - generic [ref=e698]:
                        - button "go to first page" [disabled] [ref=e699]:
                          - img [ref=e700]
                        - generic [ref=e702]:
                          - button "go to previous page" [disabled] [ref=e703]:
                            - img [ref=e704]
                          - paragraph [ref=e706]: Page
                          - paragraph [ref=e707]: 1 of -1
                          - button "go to next page" [ref=e708] [cursor=pointer]:
                            - img [ref=e709]
                        - button "go to last page" [ref=e711] [cursor=pointer]:
                          - img [ref=e712]
        - generic [ref=e714]: BM Technology © 2026
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
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { AppManager } from '../../pages/AppManager';
  3   | import { Logger } from '../../lib/utils/Logger';
  4   | 
  5   | /**
  6   |  * SALES CUSTOMER BALANCE UI AUDIT
  7   |  *
  8   |  * Objectives:
  9   |  * 1. Approved invoice must reflect correct outstanding balance in customer profile UI.
  10  |  * 2. After full payment, customer profile must show zero outstanding balance.
  11  |  */
  12  | 
  13  | test.describe('Sales Customer Balance UI Audits @sales @smoke @full', () => {
  14  |     test.setTimeout(120000);
  15  | 
  16  |     test('UI Audit: Approved invoice reflects outstanding balance in customer profile', async ({ page }) => {
  17  |         const app = new AppManager(page);
  18  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  19  | 
  20  |         const meta = await app.api.sales.discoverMetadataAPI();
  21  |         const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
  22  |         if (!item) { console.log('[SKIP] No stock available.'); return; }
  23  | 
  24  |         console.log(`[STEP 1] Creating & approving invoice via API...`);
  25  |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  26  |             customerId: meta.customerId,
  27  |             itemId: item.itemId,
  28  |             quantity: 1,
  29  |             unitPrice: item.unitCost || 750,
  30  |             locationId: item.locationId,
  31  |             warehouseId: item.warehouseId
  32  |         });
  33  |         await app.advanceDocumentAPI(inv.id, 'invoices');
  34  |         console.log(`[OK] Invoice ${inv.ref} approved.`);
  35  | 
  36  |         // Read the actual invoice total from the backend (backend may override unit_price with item cost)
  37  |         console.log(`[STEP 2] Asserting outstanding balance via API...`);
  38  |         const invoiceData = await app.api.sales.getInvoiceAPI(inv.id);
  39  |         const netDue = parseFloat(invoiceData.net_due ?? '-1');
  40  |         const outstanding = parseFloat(invoiceData.unreceived_amount ?? invoiceData.balance ?? '-1');
  41  |         if (netDue === -1) throw new Error(`[AUDIT] 'net_due' field missing from invoice response.`);
  42  |         if (outstanding === -1) throw new Error(`[AUDIT] 'unreceived_amount' field missing from invoice response.`);
  43  |         console.log(`[AUDIT] Invoice ${inv.ref} | net_due: ${netDue} | unreceived: ${outstanding}`);
  44  |         // An approved, unpaid invoice must have unreceived_amount == net_due
  45  |         expect(outstanding).toBeCloseTo(netDue, 2);
  46  | 
  47  |         console.log(`[STEP 3] Navigating to customer profile...`);
  48  |         await page.goto(`/receivables/customers/${meta.customerId}/detail`);
  49  | 
  50  |         console.log(`[STEP 4] Opening Invoices tab...`);
  51  |         const invoicesTab = page.getByRole('tab', { name: /^Invoices$/i }).first();
  52  |         await invoicesTab.waitFor({ state: 'visible', timeout: 15000 });
  53  |         await invoicesTab.click();
  54  |         
  55  |         // Wait for tab content to load completely
> 56  |         await page.waitForLoadState('networkidle', { timeout: 10000 });
      |                    ^ TimeoutError: page.waitForLoadState: Timeout 10000ms exceeded.
  57  |         await page.waitForTimeout(3000); // Additional buffer for UI rendering
  58  | 
  59  |         console.log(`[STEP 5] Asserting invoice ${inv.ref} is visible in customer profile...`);
  60  |         
  61  |         // Wait for the invoices tab content to load
  62  |         await page.waitForLoadState('domcontentloaded');
  63  |         
  64  |         // Wait for any table in the active tab panel to be visible
  65  |         const activeTabPanel = page.locator('[role="tabpanel"]:not([hidden])').first();
  66  |         await activeTabPanel.waitFor({ state: 'visible', timeout: 10000 });
  67  |         
  68  |         // Give additional time for all invoices to load (could be many)
  69  |         await page.waitForTimeout(8000);
  70  |         
  71  |         // Check if we need to handle pagination or scroll to load more data
  72  |         let attempts = 0;
  73  |         let found = false;
  74  |         const maxAttempts = 5;
  75  |         
  76  |         while (!found && attempts < maxAttempts) {
  77  |             attempts++;
  78  |             console.log(`[DEBUG] Search attempt ${attempts}/${maxAttempts} for invoice ${inv.ref}`);
  79  |             
  80  |             // Check if there are any tables in the active tab
  81  |             const tables = page.locator('table');
  82  |             const tableCount = await tables.count();
  83  |             console.log(`[DEBUG] Tables found: ${tableCount}`);
  84  |             
  85  |             if (tableCount > 0) {
  86  |                 const activeTable = activeTabPanel.locator('table').first();
  87  |                 const isTableVisible = await activeTable.isVisible({ timeout: 5000 }).catch(() => false);
  88  |                 
  89  |                 if (isTableVisible) {
  90  |                     const rowCount = await activeTable.locator('tbody tr').count();
  91  |                     console.log(`[DEBUG] Rows in active table: ${rowCount}`);
  92  |                     
  93  |                     if (rowCount > 0) {
  94  |                         // Get sample content for debugging
  95  |                         const firstRowContent = await activeTable.locator('tbody tr').first().textContent().catch(() => '');
  96  |                         const lastRowContent = await activeTable.locator('tbody tr').last().textContent().catch(() => '');
  97  |                         console.log(`[DEBUG] First row: ${firstRowContent}`);
  98  |                         console.log(`[DEBUG] Last row: ${lastRowContent}`);
  99  |                     }
  100 |                 }
  101 |             }
  102 |             
  103 |             // Try multiple possible invoice reference formats
  104 |             const possibleRefs = [
  105 |                 inv.ref
  106 |             ].filter(Boolean);
  107 |             
  108 |             console.log(`[DEBUG] Looking for invoice refs: ${possibleRefs.join(', ')}`);
  109 |             
  110 |             // Search in the entire page content, not just tables
  111 |             for (const ref of possibleRefs) {
  112 |                 const locator = page.getByText(ref, { exact: false });
  113 |                 const elementCount = await locator.count();
  114 |                 
  115 |                 if (elementCount > 0) {
  116 |                     console.log(`[SUCCESS] Found ${elementCount} elements with reference: ${ref}`);
  117 |                     
  118 |                     // Check if at least one is visible
  119 |                     for (let i = 0; i < elementCount; i++) {
  120 |                         const element = locator.nth(i);
  121 |                         if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
  122 |                             console.log(`[SUCCESS] Invoice ${ref} is visible at position ${i}`);
  123 |                             found = true;
  124 |                             break;
  125 |                         }
  126 |                     }
  127 |                     
  128 |                     if (found) break;
  129 |                 }
  130 |             }
  131 |             
  132 |             if (!found) {
  133 |                 // Try searching by invoice ID as fallback
  134 |                 const invoiceId = inv.id.toString();
  135 |                 const idLocator = page.getByText(invoiceId, { exact: false });
  136 |                 const idCount = await idLocator.count();
  137 |                 
  138 |                 if (idCount > 0) {
  139 |                     console.log(`[SUCCESS] Found invoice by ID: ${invoiceId}`);
  140 |                     found = true;
  141 |                     break;
  142 |                 }
  143 |             }
  144 |             
  145 |             if (!found) {
  146 |                 // Scroll down to potentially load more invoices or check pagination
  147 |                 console.log(`[DEBUG] Invoice not found yet, scrolling down to load more data...`);
  148 |                 await page.keyboard.press('End'); // Scroll to bottom
  149 |                 await page.waitForTimeout(2000);
  150 |                 
  151 |                 // Check for pagination buttons and click "Next" if available
  152 |                 const nextButton = page.getByRole('button', { name: /next|>/i }).or(
  153 |                     page.locator('button[aria-label*="next"]')
  154 |                 ).first();
  155 |                 
  156 |                 if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
```