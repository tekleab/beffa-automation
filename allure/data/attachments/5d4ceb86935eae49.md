# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/bill-impact.spec.ts >> Bill Impact Flow @regression >> Stage 1: Create bill via API, approve, verify stock increase
- Location: tests/purchase/bill-impact.spec.ts:10:9

# Error details

```
Test timeout of 400000ms exceeded.
```

```
Error: page.goto: Test timeout of 400000ms exceeded.
Call log:
  - navigating to "http://157.180.20.112:4173/inventories/items/?page=1&pageSize=30", waiting until "networkidle"

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
          - img "smoke test" [ref=e126]: st
          - generic [ref=e127]:
            - button "smoke test" [ref=e128] [cursor=pointer]:
              - generic: smoke test
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
                      - link "Inventories" [ref=e181] [cursor=pointer]:
                        - /url: /inventories/overview/
                      - text: /
                    - listitem [ref=e182]:
                      - link "Items" [ref=e183] [cursor=pointer]:
                        - /url: /inventories/items/?page=1&pageSize=15
            - button "2018" [ref=e185] [cursor=pointer]:
              - generic [ref=e186]: "2018"
              - img [ref=e187]
          - generic [ref=e192]:
            - generic [ref=e193]:
              - generic [ref=e194]:
                - heading "Inventory Items" [level=5] [ref=e195]
                - link "Inventory Items" [ref=e196] [cursor=pointer]:
                  - /url: /inventories/items/new
                  - img [ref=e198]
                  - text: Add Inventory Items
              - generic [ref=e200]:
                - generic [ref=e201]:
                  - generic [ref=e203]:
                    - textbox "Search" [ref=e204]:
                      - /placeholder: Search for inventory...
                    - img [ref=e206] [cursor=pointer]
                  - button "Search" [ref=e210] [cursor=pointer]:
                    - generic:
                      - generic: Cost Method
                    - img [ref=e212]
                - tablist [ref=e218]:
                  - tab "All" [selected] [ref=e219] [cursor=pointer]
                  - tab "Merchandises" [ref=e220] [cursor=pointer]
                  - tab "Raw Materials" [ref=e221] [cursor=pointer]
                  - tab "Work in Progress" [ref=e222] [cursor=pointer]
                  - button "show more" [ref=e223] [cursor=pointer]:
                    - text: More
                    - img [ref=e225]
            - generic [ref=e227]:
              - table [ref=e230]:
                - rowgroup [ref=e231]:
                  - row "Item Item Class Category Serial Status Part Number" [ref=e232]:
                    - columnheader [ref=e233] [cursor=pointer]:
                      - checkbox [ref=e235]
                    - columnheader "Item" [ref=e237] [cursor=pointer]: Item
                    - columnheader "Item Class" [ref=e239] [cursor=pointer]: Item Class
                    - columnheader "Category" [ref=e241] [cursor=pointer]: Category
                    - columnheader "Serial" [ref=e243] [cursor=pointer]: Serial
                    - columnheader "Status" [ref=e245] [cursor=pointer]: Status
                    - columnheader "Part Number" [ref=e247] [cursor=pointer]: Part Number
                    - columnheader [ref=e249] [cursor=pointer]
                - rowgroup [ref=e251]:
                  - row "inv/fifo/00112 - fifo-aprl20 FIG Finished Goods active show_icons" [ref=e252]:
                    - cell [ref=e253]:
                      - checkbox [ref=e256] [cursor=pointer]
                    - cell "inv/fifo/00112 - fifo-aprl20" [ref=e257]:
                      - link "inv/fifo/00112 - fifo-aprl20" [ref=e259] [cursor=pointer]:
                        - /url: /inventories/items/84f92055-ba76-4728-8566-a6f8102ccfdf/detail
                    - cell "FIG" [ref=e260]:
                      - paragraph [ref=e262]: FIG
                    - cell "Finished Goods" [ref=e263]:
                      - paragraph [ref=e265]: Finished Goods
                    - cell [ref=e266]
                    - cell "active" [ref=e267]:
                      - paragraph [ref=e269]: active
                    - cell [ref=e270]
                    - cell "show_icons" [ref=e271]:
                      - button "show_icons" [ref=e273] [cursor=pointer]:
                        - img [ref=e274]
                  - row "inv/fifo/002 - fifo testitem RWT Raw Materials active show_icons" [ref=e278]:
                    - cell [ref=e279]:
                      - checkbox [ref=e282] [cursor=pointer]
                    - cell "inv/fifo/002 - fifo testitem" [ref=e283]:
                      - link "inv/fifo/002 - fifo testitem" [ref=e285] [cursor=pointer]:
                        - /url: /inventories/items/d0814ddf-f1f8-4cd0-ab37-9771c0624848/detail
                    - cell "RWT" [ref=e286]:
                      - paragraph [ref=e288]: RWT
                    - cell "Raw Materials" [ref=e289]:
                      - paragraph [ref=e291]: Raw Materials
                    - cell [ref=e292]
                    - cell "active" [ref=e293]:
                      - paragraph [ref=e295]: active
                    - cell [ref=e296]
                    - cell "show_icons" [ref=e297]:
                      - button "show_icons" [ref=e299] [cursor=pointer]:
                        - img [ref=e300]
                  - row "inv/fifo/007 - item-cost-test RWT Raw Materials active show_icons" [ref=e304]:
                    - cell [ref=e305]:
                      - checkbox [ref=e308] [cursor=pointer]
                    - cell "inv/fifo/007 - item-cost-test" [ref=e309]:
                      - link "inv/fifo/007 - item-cost-test" [ref=e311] [cursor=pointer]:
                        - /url: /inventories/items/666822b8-510c-47cc-ae9f-b3b5d2ff64f5/detail
                    - cell "RWT" [ref=e312]:
                      - paragraph [ref=e314]: RWT
                    - cell "Raw Materials" [ref=e315]:
                      - paragraph [ref=e317]: Raw Materials
                    - cell [ref=e318]
                    - cell "active" [ref=e319]:
                      - paragraph [ref=e321]: active
                    - cell [ref=e322]
                    - cell "show_icons" [ref=e323]:
                      - button "show_icons" [ref=e325] [cursor=pointer]:
                        - img [ref=e326]
                  - row "inv/fifo/0222 - fifo-apr27 RWT Raw Materials active show_icons" [ref=e330]:
                    - cell [ref=e331]:
                      - checkbox [ref=e334] [cursor=pointer]
                    - cell "inv/fifo/0222 - fifo-apr27" [ref=e335]:
                      - link "inv/fifo/0222 - fifo-apr27" [ref=e337] [cursor=pointer]:
                        - /url: /inventories/items/78f240ec-6884-443f-8dc8-784531a7d5c5/detail
                    - cell "RWT" [ref=e338]:
                      - paragraph [ref=e340]: RWT
                    - cell "Raw Materials" [ref=e341]:
                      - paragraph [ref=e343]: Raw Materials
                    - cell [ref=e344]
                    - cell "active" [ref=e345]:
                      - paragraph [ref=e347]: active
                    - cell [ref=e348]
                    - cell "show_icons" [ref=e349]:
                      - button "show_icons" [ref=e351] [cursor=pointer]:
                        - img [ref=e352]
                  - row "inv/wac/00111 - wac-april27 FIG Finished Goods active show_icons" [ref=e356]:
                    - cell [ref=e357]:
                      - checkbox [ref=e360] [cursor=pointer]
                    - cell "inv/wac/00111 - wac-april27" [ref=e361]:
                      - link "inv/wac/00111 - wac-april27" [ref=e363] [cursor=pointer]:
                        - /url: /inventories/items/f359b721-636f-49fb-9c85-7337f9d72c0f/detail
                    - cell "FIG" [ref=e364]:
                      - paragraph [ref=e366]: FIG
                    - cell "Finished Goods" [ref=e367]:
                      - paragraph [ref=e369]: Finished Goods
                    - cell [ref=e370]
                    - cell "active" [ref=e371]:
                      - paragraph [ref=e373]: active
                    - cell [ref=e374]
                    - cell "show_icons" [ref=e375]:
                      - button "show_icons" [ref=e377] [cursor=pointer]:
                        - img [ref=e378]
                  - row "inventory/RWT-1 - steam door 78x2.02 RWT Finished Goods active show_icons" [ref=e382]:
                    - cell [ref=e383]:
                      - checkbox [ref=e386] [cursor=pointer]
                    - cell "inventory/RWT-1 - steam door 78x2.02" [ref=e387]:
                      - link "inventory/RWT-1 - steam door 78x2.02" [ref=e389] [cursor=pointer]:
                        - /url: /inventories/items/931edf48-f18f-45cf-93aa-c2af3d47258d/detail
                    - cell "RWT" [ref=e390]:
                      - paragraph [ref=e392]: RWT
                    - cell "Finished Goods" [ref=e393]:
                      - paragraph [ref=e395]: Finished Goods
                    - cell [ref=e396]
                    - cell "active" [ref=e397]:
                      - paragraph [ref=e399]: active
                    - cell [ref=e400]
                    - cell "show_icons" [ref=e401]:
                      - button "show_icons" [ref=e403] [cursor=pointer]:
                        - img [ref=e404]
                  - row "inventory/RWT-10 - Jacuzzi Lanzarote RWT Finished Goods active show_icons" [ref=e408]:
                    - cell [ref=e409]:
                      - checkbox [ref=e412] [cursor=pointer]
                    - cell "inventory/RWT-10 - Jacuzzi Lanzarote" [ref=e413]:
                      - link "inventory/RWT-10 - Jacuzzi Lanzarote" [ref=e415] [cursor=pointer]:
                        - /url: /inventories/items/f77efc33-bef6-4dce-ac2a-73ea84d9bf21/detail
                    - cell "RWT" [ref=e416]:
                      - paragraph [ref=e418]: RWT
                    - cell "Finished Goods" [ref=e419]:
                      - paragraph [ref=e421]: Finished Goods
                    - cell [ref=e422]
                    - cell "active" [ref=e423]:
                      - paragraph [ref=e425]: active
                    - cell [ref=e426]
                    - cell "show_icons" [ref=e427]:
                      - button "show_icons" [ref=e429] [cursor=pointer]:
                        - img [ref=e430]
                  - row "inventory/RWT-11 - Control panal RWT Finished Goods active show_icons" [ref=e434]:
                    - cell [ref=e435]:
                      - checkbox [ref=e438] [cursor=pointer]
                    - cell "inventory/RWT-11 - Control panal" [ref=e439]:
                      - link "inventory/RWT-11 - Control panal" [ref=e441] [cursor=pointer]:
                        - /url: /inventories/items/62529f09-aae3-4f54-8d1a-3b75981b5fb3/detail
                    - cell "RWT" [ref=e442]:
                      - paragraph [ref=e444]: RWT
                    - cell "Finished Goods" [ref=e445]:
                      - paragraph [ref=e447]: Finished Goods
                    - cell [ref=e448]
                    - cell "active" [ref=e449]:
                      - paragraph [ref=e451]: active
                    - cell [ref=e452]
                    - cell "show_icons" [ref=e453]:
                      - button "show_icons" [ref=e455] [cursor=pointer]:
                        - img [ref=e456]
                  - row "inventory/RWT-12 - Handle tylette RWT Finished Goods active show_icons" [ref=e460]:
                    - cell [ref=e461]:
                      - checkbox [ref=e464] [cursor=pointer]
                    - cell "inventory/RWT-12 - Handle tylette" [ref=e465]:
                      - link "inventory/RWT-12 - Handle tylette" [ref=e467] [cursor=pointer]:
                        - /url: /inventories/items/188bffc0-a53c-4875-ab2f-4a3b81670ed5/detail
                    - cell "RWT" [ref=e468]:
                      - paragraph [ref=e470]: RWT
                    - cell "Finished Goods" [ref=e471]:
                      - paragraph [ref=e473]: Finished Goods
                    - cell [ref=e474]
                    - cell "active" [ref=e475]:
                      - paragraph [ref=e477]: active
                    - cell [ref=e478]
                    - cell "show_icons" [ref=e479]:
                      - button "show_icons" [ref=e481] [cursor=pointer]:
                        - img [ref=e482]
                  - row "inventory/RWT-13 - Timer 6 pol 12 H RWT Finished Goods active show_icons" [ref=e486]:
                    - cell [ref=e487]:
                      - checkbox [ref=e490] [cursor=pointer]
                    - cell "inventory/RWT-13 - Timer 6 pol 12 H" [ref=e491]:
                      - link "inventory/RWT-13 - Timer 6 pol 12 H" [ref=e493] [cursor=pointer]:
                        - /url: /inventories/items/456509ed-3750-408f-b1cd-0eca93bcd08e/detail
                    - cell "RWT" [ref=e494]:
                      - paragraph [ref=e496]: RWT
                    - cell "Finished Goods" [ref=e497]:
                      - paragraph [ref=e499]: Finished Goods
                    - cell [ref=e500]
                    - cell "active" [ref=e501]:
                      - paragraph [ref=e503]: active
                    - cell [ref=e504]
                    - cell "show_icons" [ref=e505]:
                      - button "show_icons" [ref=e507] [cursor=pointer]:
                        - img [ref=e508]
                  - row "inventory/RWT-14 - Thermo Activator RWT Finished Goods active show_icons" [ref=e512]:
                    - cell [ref=e513]:
                      - checkbox [ref=e516] [cursor=pointer]
                    - cell "inventory/RWT-14 - Thermo Activator" [ref=e517]:
                      - link "inventory/RWT-14 - Thermo Activator" [ref=e519] [cursor=pointer]:
                        - /url: /inventories/items/d7ef2f65-fc1c-4d8d-937a-87d79137016f/detail
                    - cell "RWT" [ref=e520]:
                      - paragraph [ref=e522]: RWT
                    - cell "Finished Goods" [ref=e523]:
                      - paragraph [ref=e525]: Finished Goods
                    - cell [ref=e526]
                    - cell "active" [ref=e527]:
                      - paragraph [ref=e529]: active
                    - cell [ref=e530]
                    - cell "show_icons" [ref=e531]:
                      - button "show_icons" [ref=e533] [cursor=pointer]:
                        - img [ref=e534]
                  - row "inventory/RWT-15 - Saw Blade 350 RWT Finished Goods active show_icons" [ref=e538]:
                    - cell [ref=e539]:
                      - checkbox [ref=e542] [cursor=pointer]
                    - cell "inventory/RWT-15 - Saw Blade 350" [ref=e543]:
                      - link "inventory/RWT-15 - Saw Blade 350" [ref=e545] [cursor=pointer]:
                        - /url: /inventories/items/23c0b943-3f49-43dc-b442-681f26a7118e/detail
                    - cell "RWT" [ref=e546]:
                      - paragraph [ref=e548]: RWT
                    - cell "Finished Goods" [ref=e549]:
                      - paragraph [ref=e551]: Finished Goods
                    - cell [ref=e552]
                    - cell "active" [ref=e553]:
                      - paragraph [ref=e555]: active
                    - cell [ref=e556]
                    - cell "show_icons" [ref=e557]:
                      - button "show_icons" [ref=e559] [cursor=pointer]:
                        - img [ref=e560]
                  - row "inventory/RWT-16 - Circuit card RB-5 RWT Finished Goods active show_icons" [ref=e564]:
                    - cell [ref=e565]:
                      - checkbox [ref=e568] [cursor=pointer]
                    - cell "inventory/RWT-16 - Circuit card RB-5" [ref=e569]:
                      - link "inventory/RWT-16 - Circuit card RB-5" [ref=e571] [cursor=pointer]:
                        - /url: /inventories/items/bca2bd18-16d1-424d-85fd-5d5fef178685/detail
                    - cell "RWT" [ref=e572]:
                      - paragraph [ref=e574]: RWT
                    - cell "Finished Goods" [ref=e575]:
                      - paragraph [ref=e577]: Finished Goods
                    - cell [ref=e578]
                    - cell "active" [ref=e579]:
                      - paragraph [ref=e581]: active
                    - cell [ref=e582]
                    - cell "show_icons" [ref=e583]:
                      - button "show_icons" [ref=e585] [cursor=pointer]:
                        - img [ref=e586]
                  - row "inventory/RWT-17 - Timer 3 pol RWT Finished Goods active show_icons" [ref=e590]:
                    - cell [ref=e591]:
                      - checkbox [ref=e594] [cursor=pointer]
                    - cell "inventory/RWT-17 - Timer 3 pol" [ref=e595]:
                      - link "inventory/RWT-17 - Timer 3 pol" [ref=e597] [cursor=pointer]:
                        - /url: /inventories/items/7f78f29e-9919-4dbb-a020-ef032620a489/detail
                    - cell "RWT" [ref=e598]:
                      - paragraph [ref=e600]: RWT
                    - cell "Finished Goods" [ref=e601]:
                      - paragraph [ref=e603]: Finished Goods
                    - cell [ref=e604]
                    - cell "active" [ref=e605]:
                      - paragraph [ref=e607]: active
                    - cell [ref=e608]
                    - cell "show_icons" [ref=e609]:
                      - button "show_icons" [ref=e611] [cursor=pointer]:
                        - img [ref=e612]
                  - row "inventory/RWT-18 - Inlet solenoid valve RWT Finished Goods active show_icons" [ref=e616]:
                    - cell [ref=e617]:
                      - checkbox [ref=e620] [cursor=pointer]
                    - cell "inventory/RWT-18 - Inlet solenoid valve" [ref=e621]:
                      - link "inventory/RWT-18 - Inlet solenoid valve" [ref=e623] [cursor=pointer]:
                        - /url: /inventories/items/d38008f4-112b-4719-8929-78fd60ea9f30/detail
                    - cell "RWT" [ref=e624]:
                      - paragraph [ref=e626]: RWT
                    - cell "Finished Goods" [ref=e627]:
                      - paragraph [ref=e629]: Finished Goods
                    - cell [ref=e630]
                    - cell "active" [ref=e631]:
                      - paragraph [ref=e633]: active
                    - cell [ref=e634]
                    - cell "show_icons" [ref=e635]:
                      - button "show_icons" [ref=e637] [cursor=pointer]:
                        - img [ref=e638]
                  - row "inventory/RWT-19 - Rubber piston RWT Finished Goods active show_icons" [ref=e642]:
                    - cell [ref=e643]:
                      - checkbox [ref=e646] [cursor=pointer]
                    - cell "inventory/RWT-19 - Rubber piston" [ref=e647]:
                      - link "inventory/RWT-19 - Rubber piston" [ref=e649] [cursor=pointer]:
                        - /url: /inventories/items/5561a674-38ce-4645-b487-2bfe1be2cbff/detail
                    - cell "RWT" [ref=e650]:
                      - paragraph [ref=e652]: RWT
                    - cell "Finished Goods" [ref=e653]:
                      - paragraph [ref=e655]: Finished Goods
                    - cell [ref=e656]
                    - cell "active" [ref=e657]:
                      - paragraph [ref=e659]: active
                    - cell [ref=e660]
                    - cell "show_icons" [ref=e661]:
                      - button "show_icons" [ref=e663] [cursor=pointer]:
                        - img [ref=e664]
                  - row "inventory/RWT-2 - steam door 78x2.02 RWT Finished Goods active show_icons" [ref=e668]:
                    - cell [ref=e669]:
                      - checkbox [ref=e672] [cursor=pointer]
                    - cell "inventory/RWT-2 - steam door 78x2.02" [ref=e673]:
                      - link "inventory/RWT-2 - steam door 78x2.02" [ref=e675] [cursor=pointer]:
                        - /url: /inventories/items/64b93d86-42a5-453b-b41b-d89b659dcb58/detail
                    - cell "RWT" [ref=e676]:
                      - paragraph [ref=e678]: RWT
                    - cell "Finished Goods" [ref=e679]:
                      - paragraph [ref=e681]: Finished Goods
                    - cell [ref=e682]
                    - cell "active" [ref=e683]:
                      - paragraph [ref=e685]: active
                    - cell [ref=e686]
                    - cell "show_icons" [ref=e687]:
                      - button "show_icons" [ref=e689] [cursor=pointer]:
                        - img [ref=e690]
                  - row "inventory/RWT-20 - Temperature sensor RWT Finished Goods active show_icons" [ref=e694]:
                    - cell [ref=e695]:
                      - checkbox [ref=e698] [cursor=pointer]
                    - cell "inventory/RWT-20 - Temperature sensor" [ref=e699]:
                      - link "inventory/RWT-20 - Temperature sensor" [ref=e701] [cursor=pointer]:
                        - /url: /inventories/items/276d14c3-5c72-4469-9bed-7a77b631f2bb/detail
                    - cell "RWT" [ref=e702]:
                      - paragraph [ref=e704]: RWT
                    - cell "Finished Goods" [ref=e705]:
                      - paragraph [ref=e707]: Finished Goods
                    - cell [ref=e708]
                    - cell "active" [ref=e709]:
                      - paragraph [ref=e711]: active
                    - cell [ref=e712]
                    - cell "show_icons" [ref=e713]:
                      - button "show_icons" [ref=e715] [cursor=pointer]:
                        - img [ref=e716]
                  - row "inventory/RWT-21 - Sparepart Hinge RWT Finished Goods active show_icons" [ref=e720]:
                    - cell [ref=e721]:
                      - checkbox [ref=e724] [cursor=pointer]
                    - cell "inventory/RWT-21 - Sparepart Hinge" [ref=e725]:
                      - link "inventory/RWT-21 - Sparepart Hinge" [ref=e727] [cursor=pointer]:
                        - /url: /inventories/items/c43279a6-4e14-4b22-aba3-3aa689a1b93e/detail
                    - cell "RWT" [ref=e728]:
                      - paragraph [ref=e730]: RWT
                    - cell "Finished Goods" [ref=e731]:
                      - paragraph [ref=e733]: Finished Goods
                    - cell [ref=e734]
                    - cell "active" [ref=e735]:
                      - paragraph [ref=e737]: active
                    - cell [ref=e738]
                    - cell "show_icons" [ref=e739]:
                      - button "show_icons" [ref=e741] [cursor=pointer]:
                        - img [ref=e742]
                  - row "inventory/RWT-22 - Switch gottak RWT Finished Goods active show_icons" [ref=e746]:
                    - cell [ref=e747]:
                      - checkbox [ref=e750] [cursor=pointer]
                    - cell "inventory/RWT-22 - Switch gottak" [ref=e751]:
                      - link "inventory/RWT-22 - Switch gottak" [ref=e753] [cursor=pointer]:
                        - /url: /inventories/items/943d3c2f-7094-4145-a9d0-a88ab04af31a/detail
                    - cell "RWT" [ref=e754]:
                      - paragraph [ref=e756]: RWT
                    - cell "Finished Goods" [ref=e757]:
                      - paragraph [ref=e759]: Finished Goods
                    - cell [ref=e760]
                    - cell "active" [ref=e761]:
                      - paragraph [ref=e763]: active
                    - cell [ref=e764]
                    - cell "show_icons" [ref=e765]:
                      - button "show_icons" [ref=e767] [cursor=pointer]:
                        - img [ref=e768]
                  - row "inventory/RWT-23 - Thermo stat RWT Finished Goods active show_icons" [ref=e772]:
                    - cell [ref=e773]:
                      - checkbox [ref=e776] [cursor=pointer]
                    - cell "inventory/RWT-23 - Thermo stat" [ref=e777]:
                      - link "inventory/RWT-23 - Thermo stat" [ref=e779] [cursor=pointer]:
                        - /url: /inventories/items/4af40458-45ae-4f84-a96f-ee9051e5e539/detail
                    - cell "RWT" [ref=e780]:
                      - paragraph [ref=e782]: RWT
                    - cell "Finished Goods" [ref=e783]:
                      - paragraph [ref=e785]: Finished Goods
                    - cell [ref=e786]
                    - cell "active" [ref=e787]:
                      - paragraph [ref=e789]: active
                    - cell [ref=e790]
                    - cell "show_icons" [ref=e791]:
                      - button "show_icons" [ref=e793] [cursor=pointer]:
                        - img [ref=e794]
                  - row "inventory/RWT-24 - Steam genrator 18 VA RWT Finished Goods active show_icons" [ref=e798]:
                    - cell [ref=e799]:
                      - checkbox [ref=e802] [cursor=pointer]
                    - cell "inventory/RWT-24 - Steam genrator 18 VA" [ref=e803]:
                      - link "inventory/RWT-24 - Steam genrator 18 VA" [ref=e805] [cursor=pointer]:
                        - /url: /inventories/items/501ff67d-b483-4845-835f-c727296bc476/detail
                    - cell "RWT" [ref=e806]:
                      - paragraph [ref=e808]: RWT
                    - cell "Finished Goods" [ref=e809]:
                      - paragraph [ref=e811]: Finished Goods
                    - cell [ref=e812]
                    - cell "active" [ref=e813]:
                      - paragraph [ref=e815]: active
                    - cell [ref=e816]
                    - cell "show_icons" [ref=e817]:
                      - button "show_icons" [ref=e819] [cursor=pointer]:
                        - img [ref=e820]
                  - row "inventory/RWT-25 - Steam light A RWT Finished Goods active show_icons" [ref=e824]:
                    - cell [ref=e825]:
                      - checkbox [ref=e828] [cursor=pointer]
                    - cell "inventory/RWT-25 - Steam light A" [ref=e829]:
                      - link "inventory/RWT-25 - Steam light A" [ref=e831] [cursor=pointer]:
                        - /url: /inventories/items/3efb6ce9-50cd-4b81-aec3-063286c2d833/detail
                    - cell "RWT" [ref=e832]:
                      - paragraph [ref=e834]: RWT
                    - cell "Finished Goods" [ref=e835]:
                      - paragraph [ref=e837]: Finished Goods
                    - cell [ref=e838]
                    - cell "active" [ref=e839]:
                      - paragraph [ref=e841]: active
                    - cell [ref=e842]
                    - cell "show_icons" [ref=e843]:
                      - button "show_icons" [ref=e845] [cursor=pointer]:
                        - img [ref=e846]
                  - row "inventory/RWT-26 - Steam generator 12 VA RWT Finished Goods active show_icons" [ref=e850]:
                    - cell [ref=e851]:
                      - checkbox [ref=e854] [cursor=pointer]
                    - cell "inventory/RWT-26 - Steam generator 12 VA" [ref=e855]:
                      - link "inventory/RWT-26 - Steam generator 12 VA" [ref=e857] [cursor=pointer]:
                        - /url: /inventories/items/34b4f21e-0625-44db-b4f6-d1deb44a02d1/detail
                    - cell "RWT" [ref=e858]:
                      - paragraph [ref=e860]: RWT
                    - cell "Finished Goods" [ref=e861]:
                      - paragraph [ref=e863]: Finished Goods
                    - cell [ref=e864]
                    - cell "active" [ref=e865]:
                      - paragraph [ref=e867]: active
                    - cell [ref=e868]
                    - cell "show_icons" [ref=e869]:
                      - button "show_icons" [ref=e871] [cursor=pointer]:
                        - img [ref=e872]
                  - row "inventory/RWT-27 - Steam commercial 12 Complete with control panel RWT Finished Goods active show_icons" [ref=e876]:
                    - cell [ref=e877]:
                      - checkbox [ref=e880] [cursor=pointer]
                    - cell "inventory/RWT-27 - Steam commercial 12 Complete with control panel" [ref=e881]:
                      - link "inventory/RWT-27 - Steam commercial 12 Complete with control panel" [ref=e883] [cursor=pointer]:
                        - /url: /inventories/items/3ab6291c-c936-4bfb-b0a4-52e74d99bf4e/detail
                    - cell "RWT" [ref=e884]:
                      - paragraph [ref=e886]: RWT
                    - cell "Finished Goods" [ref=e887]:
                      - paragraph [ref=e889]: Finished Goods
                    - cell [ref=e890]
                    - cell "active" [ref=e891]:
                      - paragraph [ref=e893]: active
                    - cell [ref=e894]
                    - cell "show_icons" [ref=e895]:
                      - button "show_icons" [ref=e897] [cursor=pointer]:
                        - img [ref=e898]
                  - row "inventory/RWT-28 - Steam room special 4D Elysee complete set RWT Finished Goods active show_icons" [ref=e902]:
                    - cell [ref=e903]:
                      - checkbox [ref=e906] [cursor=pointer]
                    - cell "inventory/RWT-28 - Steam room special 4D Elysee complete set" [ref=e907]:
                      - link "inventory/RWT-28 - Steam room special 4D Elysee complete set" [ref=e909] [cursor=pointer]:
                        - /url: /inventories/items/c01887c9-37f6-4823-b55e-c65f29a39920/detail
                    - cell "RWT" [ref=e910]:
                      - paragraph [ref=e912]: RWT
                    - cell "Finished Goods" [ref=e913]:
                      - paragraph [ref=e915]: Finished Goods
                    - cell [ref=e916]
                    - cell "active" [ref=e917]:
                      - paragraph [ref=e919]: active
                    - cell [ref=e920]
                    - cell "show_icons" [ref=e921]:
                      - button "show_icons" [ref=e923] [cursor=pointer]:
                        - img [ref=e924]
                  - row "inventory/RWT-29 - Steam room special 6F Elysee complete set RWT Finished Goods active show_icons" [ref=e928]:
                    - cell [ref=e929]:
                      - checkbox [ref=e932] [cursor=pointer]
                    - cell "inventory/RWT-29 - Steam room special 6F Elysee complete set" [ref=e933]:
                      - link "inventory/RWT-29 - Steam room special 6F Elysee complete set" [ref=e935] [cursor=pointer]:
                        - /url: /inventories/items/6aa71ed9-beb6-4030-9dbd-4dd8d09f6206/detail
                    - cell "RWT" [ref=e936]:
                      - paragraph [ref=e938]: RWT
                    - cell "Finished Goods" [ref=e939]:
                      - paragraph [ref=e941]: Finished Goods
                    - cell [ref=e942]
                    - cell "active" [ref=e943]:
                      - paragraph [ref=e945]: active
                    - cell [ref=e946]
                    - cell "show_icons" [ref=e947]:
                      - button "show_icons" [ref=e949] [cursor=pointer]:
                        - img [ref=e950]
                  - row "inventory/RWT-3 - steam door 60g 60x202 RWT Finished Goods active show_icons" [ref=e954]:
                    - cell [ref=e955]:
                      - checkbox [ref=e958] [cursor=pointer]
                    - cell "inventory/RWT-3 - steam door 60g 60x202" [ref=e959]:
                      - link "inventory/RWT-3 - steam door 60g 60x202" [ref=e961] [cursor=pointer]:
                        - /url: /inventories/items/bb8e452e-c27b-4314-bf54-f094a23fa8d3/detail
                    - cell "RWT" [ref=e962]:
                      - paragraph [ref=e964]: RWT
                    - cell "Finished Goods" [ref=e965]:
                      - paragraph [ref=e967]: Finished Goods
                    - cell [ref=e968]
                    - cell "active" [ref=e969]:
                      - paragraph [ref=e971]: active
                    - cell [ref=e972]
                    - cell "show_icons" [ref=e973]:
                      - button "show_icons" [ref=e975] [cursor=pointer]:
                        - img [ref=e976]
                  - row "inventory/RWT-30 - Steam room special 8F Elysee complete set RWT Finished Goods active show_icons" [ref=e980]:
                    - cell [ref=e981]:
                      - checkbox [ref=e984] [cursor=pointer]
                    - cell "inventory/RWT-30 - Steam room special 8F Elysee complete set" [ref=e985]:
                      - link "inventory/RWT-30 - Steam room special 8F Elysee complete set" [ref=e987] [cursor=pointer]:
                        - /url: /inventories/items/118bffde-4037-4ccb-814a-438c9cef9ecc/detail
                    - cell "RWT" [ref=e988]:
                      - paragraph [ref=e990]: RWT
                    - cell "Finished Goods" [ref=e991]:
                      - paragraph [ref=e993]: Finished Goods
                    - cell [ref=e994]
                    - cell "active" [ref=e995]:
                      - paragraph [ref=e997]: active
                    - cell [ref=e998]
                    - cell "show_icons" [ref=e999]:
                      - button "show_icons" [ref=e1001] [cursor=pointer]:
                        - img [ref=e1002]
                  - row "inventory/RWT-31 - Steam 9VA RWT Finished Goods active show_icons" [ref=e1006]:
                    - cell [ref=e1007]:
                      - checkbox [ref=e1010] [cursor=pointer]
                    - cell "inventory/RWT-31 - Steam 9VA" [ref=e1011]:
                      - link "inventory/RWT-31 - Steam 9VA" [ref=e1013] [cursor=pointer]:
                        - /url: /inventories/items/59fd1ebb-ea4d-41a8-a606-8bed4abbcd11/detail
                    - cell "RWT" [ref=e1014]:
                      - paragraph [ref=e1016]: RWT
                    - cell "Finished Goods" [ref=e1017]:
                      - paragraph [ref=e1019]: Finished Goods
                    - cell [ref=e1020]
                    - cell "active" [ref=e1021]:
                      - paragraph [ref=e1023]: active
                    - cell [ref=e1024]
                    - cell "show_icons" [ref=e1025]:
                      - button "show_icons" [ref=e1027] [cursor=pointer]:
                        - img [ref=e1028]
                - rowgroup [ref=e1032]:
                  - row [ref=e1033]:
                    - columnheader [ref=e1034]
                    - columnheader [ref=e1035]
                    - columnheader [ref=e1036]
                    - columnheader [ref=e1037]
                    - columnheader [ref=e1038]
                    - columnheader [ref=e1039]
                    - columnheader [ref=e1040]
                    - columnheader [ref=e1041]
              - generic [ref=e1042]:
                - generic [ref=e1044]:
                  - combobox [ref=e1045]:
                    - option "Show 5 rows" [selected]
                    - option "Show 10 rows"
                    - option "Show 15 rows"
                    - option "Show 25 rows"
                    - option "Show 50 rows"
                    - option "Show 100 rows"
                  - generic:
                    - img
                - generic [ref=e1047]:
                  - button "go to first page" [disabled] [ref=e1048]:
                    - img [ref=e1049]
                  - generic [ref=e1051]:
                    - button "go to previous page" [disabled] [ref=e1052]:
                      - img [ref=e1053]
                    - paragraph [ref=e1055]: Page
                    - paragraph [ref=e1056]: 1 of 3
                    - button "go to next page" [ref=e1057] [cursor=pointer]:
                      - img [ref=e1058]
                  - button "go to last page" [ref=e1060] [cursor=pointer]:
                    - img [ref=e1061]
        - generic [ref=e1063]: BM Technology © 2026
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
  1   | import { Page, Locator, expect } from '@playwright/test';
  2   | 
  3   | export class InventoryPage {
  4   |   page: Page;
  5   |   emailInput: Locator;
  6   |   passwordInput: Locator;
  7   |   loginBtn: Locator;
  8   |   mainPhoneInput: Locator;
  9   |   customerNameInput: Locator;
  10  |   customerTinInput: Locator;
  11  |   approvedStatus: string;
  12  |   actionButtons: string;
  13  |   companyBtn: Locator;
  14  |   smartSearch!: (...args: any[]) => Promise<void>;
  15  | 
  16  |   constructor(page: Page) {
  17  |     this.page = page;
  18  | 
  19  |     // Login selectors
  20  |     this.emailInput = page.getByRole('textbox', { name: 'Email *' });
  21  |     this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
  22  |     this.loginBtn = page.getByRole('button', { name: 'Login' });
  23  | 
  24  |     // --- Customer Module Selectors ---
  25  |     this.mainPhoneInput = page.getByRole('textbox', { name: /Main Phone/i });
  26  |     this.customerNameInput = page.getByRole('textbox', { name: 'Customer Name *' });
  27  |     this.customerTinInput = page.getByRole('textbox', { name: 'Customer TIN *' });
  28  | 
  29  |     // Status and Button Selectors
  30  |     this.approvedStatus = 'span.css-1ny2kle:has-text("Approved"), span:has-text("Approved")';
  31  |     this.actionButtons = 'button:has-text("Submit For Review"), button:has-text("Approve"), button:has-text("Advance"), button:has-text("Submit For Approver"), button:has-text("Submit Forapprover"), button:has-text("Submit For Approve"), button:has-text("Submit For Apporver")';
  32  | 
  33  |     // Company Switcher Selectors (Top-left)
  34  |     this.companyBtn = page.locator('button.chakra-menu__menu-button').first();
  35  |   }
  36  | 
  37  |   async captureItemDetails(itemName: string): Promise<{ itemName: string; itemId: string | null; currentStock: number; unitCost: number; salesAccountCode: string; costAccountCode: string; inventoryAccountCode: string }> {
> 38  |     await this.page.goto('/inventories/items/?page=1&pageSize=30', { waitUntil: 'networkidle' });
      |                     ^ Error: page.goto: Test timeout of 400000ms exceeded.
  39  |     const searchBox = this.page.getByPlaceholder('Search for inventory...').filter({ visible: true }).first();
  40  |     await searchBox.fill(itemName);
  41  |     await this.page.keyboard.press('Enter');
  42  |     await this.page.waitForTimeout(2000);
  43  | 
  44  |     // We want to match exactly the itemName, but it might be prepended by an ID like "inventory/RWT-18 - "
  45  |     // We escape special chars and ensure the link text ENDS with the item name.
  46  |     const safeName = itemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  47  |     const exactLink = this.page.locator('table tbody tr a').filter({ hasText: new RegExp(`(?:^| - )${safeName}\\s*$`, 'i') }).first();
  48  | 
  49  |     if (await exactLink.isVisible({ timeout: 5000 }).catch(() => false)) {
  50  |       await exactLink.click();
  51  |     } else {
  52  |       // Fallback: original partial match just in case
  53  |       const itemRow = this.page.locator('table tbody tr').filter({ hasText: itemName }).first();
  54  |       await itemRow.locator('a').first().click();
  55  |     }
  56  | 
  57  |     await this.page.waitForURL(/\/inventories\/items\/.*/, { timeout: 60000 });
  58  |     return await this._extractItemDetails(itemName);
  59  |   }
  60  | 
  61  |   async _extractItemDetails(itemName: string): Promise<{ itemName: string; itemId: string | null; currentStock: number; unitCost: number; salesAccountCode: string; costAccountCode: string; inventoryAccountCode: string }> {
  62  |     await this.page.locator('text=Item Name:').waitFor({ state: 'visible', timeout: 30000 });
  63  | 
  64  |     const urlMatch = this.page.url().match(/\/inventories\/items\/([a-f0-9-]+)/);
  65  |     const itemId = urlMatch ? urlMatch[1] : null;
  66  | 
  67  |     const extractValue = async (label: string): Promise<string> => {
  68  |       const el = this.page.locator('.chakra-stack, div').filter({ hasText: new RegExp(`^${label}`, 'i') }).last();
  69  |       const text = (await el.locator('xpath=..').innerText().catch(() => '')).trim();
  70  |       const match = text.match(new RegExp(`${label}[\\s:]+([^\\n\\r]+)`, 'i'));
  71  |       return match ? match[1].trim() : text.replace(label, '').replace(/:/g, '').trim();
  72  |     };
  73  |     const sTxt = await extractValue('Current Stock');
  74  |     const stock = parseInt(sTxt.replace(/[^0-9]/g, ''), 10) || 0;
  75  |     const sAcc = await extractValue('Sales GL Account');
  76  |     const cAcc = await extractValue('Cost GL Account');
  77  |     const iAcc = await extractValue('Inventory GL Account');
  78  | 
  79  |     // 🛡️ HARDENING: Handle BRR and comma-formatted costs
  80  |     const costLocator = this.page.locator('.chakra-stack, div').filter({ hasText: /^(Cost:|Current Unit Cost:)/i }).last();
  81  |     const costText = (await costLocator.locator('xpath=..').innerText().catch(() => '')).trim();
  82  |     const costMatch = costText.match(/(?:Cost|Current Unit Cost)[\s:BRR]+([0-9,.]+)/i);
  83  |     const unitCost = costMatch ? parseFloat(costMatch[1].replace(/,/g, '')) : 0;
  84  | 
  85  |     const clean = (f: string) => f.match(/^\d+/)?.[0] || '';
  86  |     return { itemName, itemId, currentStock: stock, unitCost, salesAccountCode: clean(sAcc), costAccountCode: clean(cAcc), inventoryAccountCode: clean(iAcc) };
  87  |   }
  88  | 
  89  |   async createInventoryAdjustmentUI(itemName: string, adjQty: number = 1): Promise<{ ref: string; id: string }> {
  90  |     console.log(`[STEP] Starting UI Adjustment for "${itemName}"`);
  91  |     await this.captureItemDetails(itemName); // Takes us to detail page
  92  | 
  93  |     // 1. Locate the Adjust link in the Locations tab
  94  |     const adjustLink = this.page.locator('table tbody tr').filter({ hasText: 'Default Warehouse Location' }).locator('text=Adjust').first();
  95  |     await adjustLink.waitFor({ state: 'visible' });
  96  |     await adjustLink.click();
  97  | 
  98  |     await this.page.waitForSelector('text=Update Inventory', { timeout: 30000 });
  99  | 
  100 |     // 2. Capture remaining quantities from disabled inputs as requested
  101 |     const currentQty = await this.page.locator('#current_quantity').getAttribute('value');
  102 |     const locationQty = await this.page.locator('#location_quantity').getAttribute('value');
  103 |     console.log(`[INFO] Current Quantity (Global): ${currentQty} | Location Quantity: ${locationQty}`);
  104 | 
  105 |     // 3. Fill the adjustment
  106 |     await this.page.locator('input[name="adjusted_quantity"]').fill(String(adjQty));
  107 |     await this.page.locator('input[name="reason"]').fill("Automated Audit Adjustment");
  108 | 
  109 |     // 4. Set account if not pre-filled
  110 |     const accountBtn = this.page.getByRole('button', { name: /Adjustment Account/i });
  111 |     if (await accountBtn.isVisible()) {
  112 |       await accountBtn.click();
  113 |       await this.smartSearch(null, 'Cash at Hand'); // Or something standard
  114 |     }
  115 | 
  116 |     // 5. Submit
  117 |     const addNowBtn = this.page.getByRole('button', { name: 'Add Now' }).first();
  118 |     await addNowBtn.click();
  119 | 
  120 |     await this.page.waitForURL(/\/inventories\/adjustments\/.*\/detail$/, { timeout: 60000 });
  121 |     const adjID = (await this.page.locator('p.chakra-text').filter({ hasText: /^ADJ\// }).first().innerText()).trim();
  122 |     const adjUUIDMatch = this.page.url().match(/\/adjustments\/([a-f0-9-]+)/);
  123 |     const adjUUID = adjUUIDMatch ? adjUUIDMatch[1] : '';
  124 | 
  125 |     console.log(`[SUCCESS] UI Adjustment created: ${adjID} (UUID: ${adjUUID})`);
  126 |     return { ref: adjID, id: adjUUID };
  127 |   }
  128 | 
  129 |   async findApprovedUnpaidInvoice(): Promise<{ customerName: string; invoiceId: string } | null> {
  130 |     console.log("[ACTION] Scanning for an approved, unpaid invoice (Net Due > 0)...");
  131 |     await this.page.goto('/receivables/invoices/?page=1&pageSize=30');
  132 |     await this.page.waitForSelector('table tbody tr', { timeout: 30000 });
  133 |     await this.page.waitForTimeout(3000); // Stabilization
  134 | 
  135 |     // 🗺️ Discover headers dynamically
  136 |     const colMap = await this.getTableColumnMap();
  137 |     const idxInv = colMap['invoice id'] ?? colMap['reference'] ?? 1;
  138 |     const idxCust = colMap['customer'] ?? 2;
```