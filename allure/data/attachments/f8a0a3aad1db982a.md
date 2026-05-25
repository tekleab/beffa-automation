# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/purchase-bill-ui-flow.spec.ts >> Purchase to Bill Flow @smoke >> Create PO via UI, approve, create linked bill, verify in vendor profile
- Location: tests/purchase/purchase-bill-ui-flow.spec.ts:6:9

# Error details

```
Error: [ERROR] API Verification Failed: Bill BILL/2026/05/25/000444 never appeared in "Manenderas" ledger.
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
          - img "sample" [ref=e126]: s
          - generic [ref=e127]:
            - button "sample" [ref=e128] [cursor=pointer]:
              - generic: sample
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
                        - /url: /payables/purchase-orders/022ce030-929b-4e0f-a1c6-2df5804cb129/detail
            - button "2018" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2018"
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
                      - paragraph [ref=e220]: submit for reviewer
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
                    - paragraph [ref=e255]: Tuesday, June 2nd 2026
                  - generic [ref=e256]:
                    - paragraph [ref=e257]: "PO Number:"
                    - paragraph [ref=e258]: PO/2026/05/25/000312
                  - generic [ref=e259]:
                    - paragraph [ref=e260]: "PO Status:"
                    - generic [ref=e262]:
                      - generic [ref=e264]: Draft
                      - img [ref=e266]
                  - generic [ref=e268]:
                    - paragraph [ref=e269]: "Account Payable:"
                    - paragraph [ref=e270]: 1007 - Petty Cash
                  - generic [ref=e271]:
                    - paragraph [ref=e272]: "Currency:"
                    - paragraph [ref=e273]: Birr - BRR
                  - generic [ref=e274]:
                    - paragraph [ref=e275]: "vendor:"
                    - paragraph [ref=e276]: Manenderas
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
                    - paragraph [ref=e289]: Addis Ababa City Administration
                  - generic [ref=e290]:
                    - paragraph [ref=e291]: "Zone:"
                    - paragraph [ref=e292]: Kirkos Subcity
                  - generic [ref=e293]:
                    - paragraph [ref=e294]: "Woreda:"
                    - paragraph [ref=e295]: Woreda 9
                  - generic [ref=e296]:
                    - paragraph [ref=e297]: "City:"
                    - paragraph
                  - generic [ref=e298]:
                    - paragraph [ref=e299]: "Kebele:"
                    - paragraph [ref=e300]: Kebele 03
                  - generic [ref=e301]:
                    - paragraph [ref=e302]: "House No.:"
                    - paragraph
              - generic [ref=e303]:
                - tablist [ref=e304]:
                  - tab "Purchase Order Items" [selected] [ref=e305] [cursor=pointer]
                  - tab "PO Journal" [ref=e306] [cursor=pointer]
                  - tab "Related Documents" [ref=e307] [cursor=pointer]
                  - tab "History" [ref=e308] [cursor=pointer]
                - tabpanel "Purchase Order Items" [ref=e310]:
                  - table [ref=e314]:
                    - rowgroup [ref=e315]:
                      - row "Item ID Quantity Unit Price Purchase Type Description G/L Account Project Before Tax Tax Total" [ref=e316]:
                        - columnheader "Item ID" [ref=e317]: Item ID
                        - columnheader "Quantity" [ref=e319]: Quantity
                        - columnheader "Unit Price" [ref=e321]: Unit Price
                        - columnheader "Purchase Type" [ref=e323]: Purchase Type
                        - columnheader "Description" [ref=e325]: Description
                        - columnheader "G/L Account" [ref=e327]: G/L Account
                        - columnheader "Project" [ref=e329]: Project
                        - columnheader "Before Tax" [ref=e331]: Before Tax
                        - columnheader "Tax" [ref=e333]: Tax
                        - columnheader "Total" [ref=e335]: Total
                    - rowgroup [ref=e337]:
                      - row "Inlet solenoid valve 1 4527 Goods Cash at Bank - Awash 0 TOT" [ref=e338]:
                        - cell "Inlet solenoid valve" [ref=e339]:
                          - generic [ref=e340]: Inlet solenoid valve
                        - cell "1" [ref=e341]:
                          - generic [ref=e342]: "1"
                        - cell "4527" [ref=e343]:
                          - generic [ref=e344]: "4527"
                        - cell "Goods" [ref=e345]:
                          - generic [ref=e346]: Goods
                        - cell [ref=e347]
                        - cell "Cash at Bank - Awash" [ref=e348]:
                          - generic [ref=e349]: Cash at Bank - Awash
                        - cell [ref=e350]
                        - cell "0" [ref=e351]:
                          - generic [ref=e352]: "0"
                        - cell "TOT" [ref=e353]:
                          - generic [ref=e354]: TOT
                        - cell [ref=e355]
                      - row [ref=e356]:
                        - cell [ref=e357]
                        - cell [ref=e358]
                        - cell [ref=e359]
                        - cell [ref=e360]
                        - cell [ref=e361]
                        - cell [ref=e362]
                        - cell [ref=e363]
                        - cell [ref=e364]
                        - cell [ref=e365]
                        - cell [ref=e366]
                      - row [ref=e367]:
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
                      - row [ref=e400]:
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
                      - row [ref=e411]:
                        - cell [ref=e412]
                        - cell [ref=e413]
                        - cell [ref=e414]
                        - cell [ref=e415]
                        - cell [ref=e416]
                        - cell [ref=e417]
                        - cell [ref=e418]
                        - cell [ref=e419]
                        - cell [ref=e420]
                        - cell [ref=e421]
                      - row [ref=e422]:
                        - cell [ref=e423]
                        - cell [ref=e424]
                        - cell [ref=e425]
                        - cell [ref=e426]
                        - cell [ref=e427]
                        - cell [ref=e428]
                        - cell [ref=e429]
                        - cell [ref=e430]
                        - cell [ref=e431]
                        - cell [ref=e432]
                      - row [ref=e433]:
                        - cell [ref=e434]
                        - cell [ref=e435]
                        - cell [ref=e436]
                        - cell [ref=e437]
                        - cell [ref=e438]
                        - cell [ref=e439]
                        - cell [ref=e440]
                        - cell [ref=e441]
                        - cell [ref=e442]
                        - cell [ref=e443]
                      - row [ref=e444]:
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
                      - row [ref=e455]:
                        - cell [ref=e456]
                        - cell [ref=e457]
                        - cell [ref=e458]
                        - cell [ref=e459]
                        - cell [ref=e460]
                        - cell [ref=e461]
                        - cell [ref=e462]
                        - cell [ref=e463]
                        - cell [ref=e464]
                        - cell [ref=e465]
                      - row [ref=e466]:
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
                      - row [ref=e488]:
                        - cell [ref=e489]
                        - cell [ref=e490]
                        - cell [ref=e491]
                        - cell [ref=e492]
                        - cell [ref=e493]
                        - cell [ref=e494]
                        - cell [ref=e495]
                        - cell [ref=e496]
                        - cell [ref=e497]
                        - cell [ref=e498]
                      - row [ref=e499]:
                        - cell [ref=e500]
                        - cell [ref=e501]
                        - cell [ref=e502]
                        - cell [ref=e503]
                        - cell [ref=e504]
                        - cell [ref=e505]
                        - cell [ref=e506]
                        - cell [ref=e507]
                        - cell [ref=e508]
                        - cell [ref=e509]
                    - rowgroup [ref=e510]:
                      - row "0.00 0.00 0.00" [ref=e511]:
                        - columnheader [ref=e512]
                        - columnheader [ref=e513]
                        - columnheader [ref=e514]
                        - columnheader [ref=e515]
                        - columnheader [ref=e516]
                        - columnheader [ref=e517]
                        - columnheader [ref=e518]
                        - columnheader "0.00" [ref=e519]
                        - columnheader "0.00" [ref=e520]
                        - columnheader "0.00" [ref=e521]
        - generic [ref=e522]: BM Technology © 2026
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
  336 |       try { return JSON.parse(text); } catch (e) { throw new Error(`${label} invalid JSON: ${text.substring(0, 150)}`); }
  337 |     };
  338 | 
  339 |     // 1. Fetch the Purchase Order to gather its precise mapping metadata
  340 |     console.log(`[ACTION] Fetching PO Context for ID: ${poId}...`);
  341 |     const poResp = await this.page.request.get(`${apiBase}/purchase-order/${poId}?${params}`, { headers });
  342 |     const poData = await safeJson(poResp, `Fetch PO ${poId}`);
  343 | 
  344 |     // 2. Discover Accounts Payable ID for validation overlay
  345 |     const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  346 |     const acctData = await safeJson(acctResp, 'Accounts Discovery');
  347 |     const allAccounts = acctData.items || acctData.data || [];
  348 |     const apAccount = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
  349 | 
  350 |     // 3. Map strictly into `received_purchase_order_items`
  351 |     const receivedItems = (poData.po_items || []).map((item: any) => ({
  352 |       po_item_id: item.id,
  353 |       received_quantity: item.quantity,
  354 |       received_unit_price: item.unit_price
  355 |     }));
  356 | 
  357 |     if (receivedItems.length === 0) throw new Error(`PO ${poId} lacks interactable line-items.`);
  358 | 
  359 |     const payload = {
  360 |       accounts_payable_id: apAccount?.id,
  361 |       currency_id: poData.currency_id || poData.currency?.id,
  362 |       due_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  363 |       invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  364 |       items: [], // MUST be completely empty for a linked PO bill
  365 |       purchase_order_id: poId,
  366 |       vendor_id: poData.vendor_id || poData.vendor?.id,
  367 |       received_purchase_order_items: receivedItems,
  368 |       status: 'draft'
  369 |     };
  370 | 
  371 |     const response = await this.safePost(`${apiBase}/bills?${params}`, {
  372 |       data: payload,
  373 |       headers,
  374 |       label: 'Create API Bill from PO'
  375 |     });
  376 | 
  377 |     if (!response.ok()) throw new Error(`PO-to-Bill API Failed: ${response.status()} - ${await response.text()}`);
  378 |     const json = await response.json();
  379 |     console.log(`[SUCCESS] PO directly converted to Bill via API: ${json.invoice_number}`);
  380 |     return { success: true, billNumber: json.invoice_number, billId: json.id };
  381 |   }
  382 | 
  383 |   async verifyBillInVendorAPI(vendorName: string, billNumber: string): Promise<boolean> {
  384 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
  385 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  386 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  387 |     const token = await this._getAuthToken();
  388 |     const company = process.env.BEFFA_COMPANY as string;
  389 |     const year = process.env.BEFFA_YEAR || '2018';
  390 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  391 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  392 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  393 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}` };
  394 | 
  395 |     // 1. Resolve Vendor ID from Name
  396 |     console.log(`[ACTION] API Verifying: Resolving ID for Vendor "${vendorName}"...`);
  397 |     const vendResp = await this.page.request.get(`${apiBase}/vendors?page=1&pageSize=50&${params}`, { headers });
  398 |     const vendData = await vendResp.json();
  399 |     const vendor = (vendData.items || vendData.data || []).find((v: any) => v.name.toLowerCase() === vendorName.toLowerCase());
  400 | 
  401 |     if (!vendor) throw new Error(`API Verification Failed: Could not find Vendor "${vendorName}" in the system.`);
  402 |     const vendorId = vendor.id;
  403 | 
  404 |     // 2. Poll Vendor Bills Ledger (max 15 tries for indexing = ~30s)
  405 |     console.log(`[ACTION] API Verifying: Scanning Ledger for ${billNumber}...`);
  406 |     const safeJson = async (resp: any, label: string) => {
  407 |       const text = await resp.text();
  408 |       if (!resp.ok()) return null;
  409 |       try { return JSON.parse(text); } catch (e) { return null; }
  410 |     };
  411 | 
  412 |     for (let i = 0; i < 15; i++) {
  413 |       const billResp = await this.page.request.get(`${apiBase}/vendor/${vendorId}/bills?${params}`, { headers });
  414 |       const billData = await safeJson(billResp, 'Vendor Ledger');
  415 |       if (!billData) {
  416 |         console.log(`[WARN] Ledger API busy or returned error. Retrying...`);
  417 |       } else {
  418 |         const bills = billData.data || billData.items || [];
  419 |         const found = bills.find((b: any) =>
  420 |           b.invoice_number === billNumber ||
  421 |           b.bill_no === billNumber ||
  422 |           b.ref === billNumber ||
  423 |           b.bill_number === billNumber ||
  424 |           b.bill_number === billNumber.split('/').pop() ||
  425 |           b.id === billNumber
  426 |         );
  427 |         if (found) {
  428 |           console.log(`[SUCCESS] API Confirmed: Bill ${billNumber} is physically present in ${vendorName}'s ledger.`);
  429 |           return true;
  430 |         }
  431 |       }
  432 |       console.log(`[INFO] Bill not found in ledger yet (Index pending). Attempt ${i + 1}/15. Retrying in 2s...`);
  433 |       await this.page.waitForTimeout(2000);
  434 |     }
  435 | 
> 436 |     throw new Error(`[ERROR] API Verification Failed: Bill ${billNumber} never appeared in "${vendorName}" ledger.`);
      |           ^ Error: [ERROR] API Verification Failed: Bill BILL/2026/05/25/000444 never appeared in "Manenderas" ledger.
  437 |   }
  438 | 
  439 |   async createBillPaymentAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
  440 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
  441 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  442 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  443 |     const token = await this._getAuthToken();
  444 |     const company = process.env.BEFFA_COMPANY as string;
  445 |     const year = process.env.BEFFA_YEAR || '2018';
  446 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  447 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  448 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  449 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  450 | 
  451 |     const safeJson = async (resp: any, label: string) => {
  452 |       const text = await resp.text();
  453 |       if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
  454 |       try { return JSON.parse(text); } catch (e) { throw new Error(`${label} invalid JSON: ${text.substring(0, 150)}`); }
  455 |     };
  456 | 
  457 |     // 1. Discover Accounts
  458 |     const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  459 |     const acctData = await safeJson(acctResp, 'Accounts Discovery');
  460 |     const allAccounts = acctData.items || acctData.data || [];
  461 |     const cashAccount = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('cash') || a.account_type?.toLowerCase().includes('bank')) || allAccounts[0];
  462 | 
  463 |     // 2. Discover Currency
  464 |     const currResp = await this.page.request.get(`${apiBase}/currency?${params}`, { headers });
  465 |     const currData = await safeJson(currResp, 'Currency Discovery');
  466 |     const currency = currData.items?.[0] || currData.data?.[0];
  467 | 
  468 |     let resolvedCashAccountId = data.cashAccountId || cashAccount?.id;
  469 | 
  470 |     // In test we sometimes explicitly pass null to trigger validation error
  471 |     if ('cashAccountId' in data && data.cashAccountId === null) {
  472 |       resolvedCashAccountId = null;
  473 |     }
  474 | 
  475 |     const payload = {
  476 |       amount: data.amount,
  477 |       cash_account_id: resolvedCashAccountId,
  478 |       vendor_id: data.vendorId, // Tests usually supply this
  479 |       date: new Date().toISOString(),
  480 |       payment_method: 'cash',
  481 |       currency_id: currency?.id,
  482 |       bill_payments: [{
  483 |         amount: data.amount,
  484 |         bill_id: data.billId
  485 |       }]
  486 |     };
  487 | 
  488 |     console.log(`[ACTION] Creating Bill Payment for ${data.billId} via API (CashAcct: ${resolvedCashAccountId})...`);
  489 |     const response = await this.page.request.post(`${apiBase}/payments?${params}`, {
  490 |       data: payload,
  491 |       headers
  492 |     });
  493 | 
  494 |     if (!response.ok()) throw new Error(`Bill-Payment API Failed: ${response.status()} - ${await response.text()}`);
  495 |     const json = await response.json();
  496 |     console.log(`[SUCCESS] Payment created: ${json.ref} (ID: ${json.id})`);
  497 |     return { success: true, ref: json.ref, id: json.id };
  498 |   }
  499 | 
  500 |   async getBillAPI(billId: string): Promise<any> {
  501 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
  502 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  503 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  504 |     const token = await this._getAuthToken();
  505 |     const year = process.env.BEFFA_YEAR || '2018';
  506 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  507 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  508 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  509 | 
  510 |     const response = await this.page.request.get(`${apiBase}/bill/${billId}?${params}`, {
  511 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
  512 |     });
  513 |     if (!response.ok()) throw new Error(`Failed to fetch Bill ${billId}: ${response.status()}`);
  514 |     return await response.json();
  515 |   }
  516 | 
  517 |   async getPaymentAPI(paymentId: string): Promise<any> {
  518 |     const token = await this._getAuthToken();
  519 |     const year = process.env.BEFFA_YEAR || '2018';
  520 |     const params = `year=${year}&period=yearly&calendar=ec`;
  521 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
  522 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  523 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  524 |     const response = await this.page.request.get(`${apiBase}/payments/${paymentId}?${params}`, {
  525 |       headers: { 'x-company': process.env.BEFFA_COMPANY || 'sample', 'Authorization': `Bearer ${token}` }
  526 |     });
  527 |     return await response.json();
  528 |   }
  529 | 
  530 |   async reverseBillAPI(billId: string): Promise<boolean> {
  531 |     const token = await this._getAuthToken();
  532 |     const year = process.env.BEFFA_YEAR || '2018';
  533 |     const params = `year=${year}&period=yearly&calendar=ec`;
  534 | 
  535 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
  536 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
```