# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/sales-inventory-impact.spec.ts >> Sales Impact Flow @regression >> Inventory Impact Verify @smoke
- Location: tests/sales/sales-inventory-impact.spec.ts:6:9

# Error details

```
Error: Stock deduction failed after polling! Expected 104, found 103
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
                      - link "Receivables" [ref=e181] [cursor=pointer]:
                        - /url: /receivables/overview/
                      - text: /
                    - listitem [ref=e182]:
                      - link "Invoices" [ref=e183] [cursor=pointer]:
                        - /url: /receivables/invoices/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=e184]:
                      - link "Detail" [ref=e185] [cursor=pointer]:
                        - /url: /receivables/invoices/caea45f8-a109-4b4c-a545-16918c9a6e1b/detail
            - button "2018" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2018"
              - img [ref=e189]
          - generic [ref=e192]:
            - button "Toggle Visibility" [ref=e195] [cursor=pointer]:
              - img [ref=e196]
            - generic [ref=e199]:
              - generic [ref=e200]:
                - heading "Invoice Details" [level=3] [ref=e201]
                - generic [ref=e202]:
                  - generic [ref=e204]:
                    - button "edit" [disabled] [ref=e206]:
                      - img [ref=e208]
                      - paragraph [ref=e211]: edit
                    - button "cancel" [disabled] [ref=e213]:
                      - img [ref=e215]
                      - paragraph [ref=e217]: cancel
                    - button "archive" [disabled] [ref=e219]:
                      - img [ref=e221]
                      - paragraph [ref=e224]: archive
                    - button "Reverse" [ref=e226] [cursor=pointer]:
                      - img [ref=e228]
                      - paragraph [ref=e231]: Reverse
                  - button "Print" [ref=e232] [cursor=pointer]:
                    - img [ref=e234]
                    - text: Print
              - generic [ref=e238]:
                - generic [ref=e239]:
                  - generic [ref=e240]:
                    - paragraph [ref=e241]: "Customer:"
                    - paragraph [ref=e242]: Base Ethiopia
                  - generic [ref=e243]:
                    - paragraph [ref=e244]: "Invoice Number:"
                    - paragraph [ref=e245]: INV/2026/04/28/000078
                  - generic [ref=e246]:
                    - paragraph [ref=e247]: "Invoice Date:"
                    - paragraph [ref=e248]: April 28, 2026
                  - generic [ref=e249]:
                    - paragraph [ref=e250]: "Due Date:"
                    - paragraph [ref=e251]: May 28, 2026
                  - generic [ref=e252]:
                    - paragraph [ref=e253]: "GL Account:"
                    - paragraph [ref=e254]: 1205 - Accounts Receivable
                  - generic [ref=e255]:
                    - paragraph [ref=e256]: "Currency:"
                    - paragraph [ref=e257]: Birr - BRR
                  - generic [ref=e258]:
                    - paragraph [ref=e259]: "Status:"
                    - generic [ref=e261]:
                      - generic [ref=e263]: Approved
                      - img [ref=e265]
                  - generic [ref=e267]:
                    - paragraph [ref=e268]: "Paid:"
                    - paragraph [ref=e269]: "No"
                - generic [ref=e270]:
                  - paragraph [ref=e271]: "Remit to:"
                  - generic [ref=e272]:
                    - generic [ref=e273]:
                      - paragraph [ref=e274]: "Region:"
                      - paragraph [ref=e275]: Addis Ababa City Administration
                    - generic [ref=e276]:
                      - paragraph [ref=e277]: "Zone:"
                      - paragraph [ref=e278]: Bole Subcity
                    - generic [ref=e279]:
                      - paragraph [ref=e280]: "City:"
                      - paragraph
                    - generic [ref=e281]:
                      - paragraph [ref=e282]: "Woreda:"
                      - paragraph [ref=e283]: Woreda 3
                    - generic [ref=e284]:
                      - paragraph [ref=e285]: "Kebele:"
                      - paragraph [ref=e286]: Kebele 05
                    - generic [ref=e287]:
                      - paragraph [ref=e288]: "House NO:"
                      - paragraph
              - generic [ref=e290]:
                - tablist [ref=e291]:
                  - tab "Released Sales Order" [selected] [ref=e292] [cursor=pointer]
                  - tab "Journal" [ref=e293] [cursor=pointer]
                  - tab "History" [ref=e294] [cursor=pointer]
                - tabpanel "Released Sales Order" [ref=e296]:
                  - table [ref=e300]:
                    - rowgroup [ref=e301]:
                      - row "Item Name Unit Price Remaining Released Quantity Description G/L Account Amount" [ref=e302]:
                        - columnheader "Item Name" [ref=e303]: Item Name
                        - columnheader "Unit Price" [ref=e305]: Unit Price
                        - columnheader "Remaining" [ref=e307]: Remaining
                        - columnheader "Released Quantity" [ref=e309]: Released Quantity
                        - columnheader "Description" [ref=e311]: Description
                        - columnheader "G/L Account" [ref=e313]: G/L Account
                        - columnheader "Amount" [ref=e315]: Amount
                    - rowgroup [ref=e317]:
                      - row "fifo-apr27 10993.05 0 1 E2E Speed Track Accounts Receivable 10993.05" [ref=e318]:
                        - cell "fifo-apr27" [ref=e319]:
                          - generic [ref=e320]: fifo-apr27
                        - cell "10993.05" [ref=e321]:
                          - generic [ref=e322]: "10993.05"
                        - cell "0" [ref=e323]:
                          - generic [ref=e324]: "0"
                        - cell "1" [ref=e325]:
                          - generic [ref=e326]: "1"
                        - cell "E2E Speed Track" [ref=e327]:
                          - generic [ref=e328]: E2E Speed Track
                        - cell "Accounts Receivable" [ref=e329]:
                          - generic [ref=e330]: Accounts Receivable
                        - cell "10993.05" [ref=e331]:
                          - generic [ref=e332]: "10993.05"
                      - row [ref=e333]:
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
                      - row [ref=e349]:
                        - cell [ref=e350]
                        - cell [ref=e351]
                        - cell [ref=e352]
                        - cell [ref=e353]
                        - cell [ref=e354]
                        - cell [ref=e355]
                        - cell [ref=e356]
                      - row [ref=e357]:
                        - cell [ref=e358]
                        - cell [ref=e359]
                        - cell [ref=e360]
                        - cell [ref=e361]
                        - cell [ref=e362]
                        - cell [ref=e363]
                        - cell [ref=e364]
                      - row [ref=e365]:
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
                      - row [ref=e381]:
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
                      - row [ref=e397]:
                        - cell [ref=e398]
                        - cell [ref=e399]
                        - cell [ref=e400]
                        - cell [ref=e401]
                        - cell [ref=e402]
                        - cell [ref=e403]
                        - cell [ref=e404]
                      - row [ref=e405]:
                        - cell [ref=e406]
                        - cell [ref=e407]
                        - cell [ref=e408]
                        - cell [ref=e409]
                        - cell [ref=e410]
                        - cell [ref=e411]
                        - cell [ref=e412]
                      - row [ref=e413]:
                        - cell [ref=e414]
                        - cell [ref=e415]
                        - cell [ref=e416]
                        - cell [ref=e417]
                        - cell [ref=e418]
                        - cell [ref=e419]
                        - cell [ref=e420]
                      - row [ref=e421]:
                        - cell [ref=e422]
                        - cell [ref=e423]
                        - cell [ref=e424]
                        - cell [ref=e425]
                        - cell [ref=e426]
                        - cell [ref=e427]
                        - cell [ref=e428]
                      - row [ref=e429]:
                        - cell [ref=e430]
                        - cell [ref=e431]
                        - cell [ref=e432]
                        - cell [ref=e433]
                        - cell [ref=e434]
                        - cell [ref=e435]
                        - cell [ref=e436]
                      - row [ref=e437]:
                        - cell [ref=e438]
                        - cell [ref=e439]
                        - cell [ref=e440]
                        - cell [ref=e441]
                        - cell [ref=e442]
                        - cell [ref=e443]
                        - cell [ref=e444]
                    - rowgroup [ref=e445]:
                      - row "0.00" [ref=e446]:
                        - columnheader [ref=e447]
                        - columnheader [ref=e448]
                        - columnheader [ref=e449]
                        - columnheader [ref=e450]
                        - columnheader [ref=e451]
                        - columnheader [ref=e452]
                        - columnheader "0.00" [ref=e453]
        - generic [ref=e454]: BM Technology © 2026
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
  3   | 
  4   | test.describe('Sales Impact Flow @regression', () => {
  5   | 
  6   |     test('Inventory Impact Verify @smoke', async ({ page }) => {
  7   |         test.info().annotations.push({ type: 'allure.severity', description: 'critical' });
  8   |         test.setTimeout(600000);
  9   |         const app = new AppManager(page);
  10  | 
  11  |         // Phase 1: Login & Item Discovery
  12  |         console.log('[STEP] Phase 1: Login & Item Discovery');
  13  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  14  | 
  15  |         const initial = await app.captureRandomItemDataAPI();
  16  |         console.log(`[INFO] Item: "${initial.itemName}" | UUID: ${initial.itemId} | Stock: ${initial.currentStock}`);
  17  | 
  18  |         // Phase 2: Create Sales Order via API
  19  |         // Phase 2: Create Sales Order via API
  20  |         const saleQty = Math.floor(Math.random() * 2) + 1;
  21  |         console.log(`[STEP] Phase 2: Creating SO via API for ${saleQty} x "${initial.itemName}"`);
  22  | 
  23  |         const soResult = await app.createSalesOrderAPI({
  24  |             itemId: initial.itemId,
  25  |             quantity: saleQty,
  26  |             locationId: initial.locationId,
  27  |             warehouseId: initial.warehouseId
  28  |         });
  29  | 
  30  |         if (!soResult.success) {
  31  |             if (soResult.status === 422 && soResult.error?.toLowerCase().includes('insufficient stock')) {
  32  |                 console.log(`[PASS] Valid Validation: System correctly blocked order due to insufficient stock for ${initial.itemName}`);
  33  |                 return; // Mark as passed per user requirement
  34  |             }
  35  |             throw new Error(`SO API Creation Failed: ${soResult.status} - ${soResult.error}`);
  36  |         }
  37  | 
  38  |         const soID = soResult.ref;
  39  |         const soItemId = soResult.soItemId;
  40  |         console.log(`[OK] SO created: ${soID} | Customer: ${soResult.customerId}`);
  41  | 
  42  |         // Phase 3: Approve SO
  43  |         console.log(`[STEP] Phase 3: Approving SO ${soID}`);
  44  |         // ⚡ Fast API Approval
  45  |         await page.goto(`/receivables/sale-orders/${soResult.id}/detail`, { waitUntil: 'load' });
  46  |         await app.advanceDocumentAPI(soResult.id, 'sales-orders');
  47  |         await page.reload(); // 🔄 Synchronize
  48  |         console.log(`[OK] SO ${soID} approved via Fast-API`);
  49  | 
  50  |         // Phase 4: Create Invoice via API
  51  |         console.log(`[STEP] Phase 4: Creating Invoice via API from SO ${soID}`);
  52  |         const invResult = await app.createInvoiceAPI({
  53  |             customerId: soResult.customerId,
  54  |             soItemId: soItemId, // Use SO Item ID for linking
  55  |             releasedQuantity: saleQty,
  56  |             locationId: initial.locationId,
  57  |             warehouseId: initial.warehouseId
  58  |         });
  59  | 
  60  |         if (!invResult.success) {
  61  |             throw new Error(`Invoice Creation Failed: ${invResult.error}`);
  62  |         }
  63  | 
  64  |         const invID = invResult.ref;
  65  |         const invUUID = invResult.id;
  66  |         console.log(`[OK] Invoice created: ${invID} (UUID: ${invUUID})`);
  67  | 
  68  |         // Phase 5: Approve Invoice
  69  |         console.log(`[STEP] Phase 5: Approving Invoice ${invID}`);
  70  |         // ⚡ Fast API Approval
  71  |         await page.goto(`/receivables/invoices/${invUUID}/detail`, { waitUntil: 'load' });
  72  |         await app.advanceDocumentAPI(invUUID, 'invoices');
  73  |         await page.reload(); // 🔄 Synchronize
  74  |         console.log(`[OK] Invoice ${invID} approved via Fast-API`);
  75  | 
  76  |         // Phase 6: Verify stock decrease via API (with Tactical Polling)
  77  |         console.log(`[STEP] Phase 6: Verifying stock for "${initial.itemName}" (Polling for backend sync)`);
  78  |         const expectedStock = initial.currentStock - saleQty;
  79  |         let final: any = null;
  80  |         let success = false;
  81  | 
  82  |         for (let attempt = 0; attempt < 3; attempt++) {
  83  |             final = await app.getItemDetailsAPI(initial.itemId, initial.locationId);
  84  |             const currentStock = final?.currentStock ?? 'NULL';
  85  |             console.log(`[POLL] Attempt ${attempt + 1}: Found ${currentStock} at location ${initial.locationId} | Expected ${expectedStock}`);
  86  |             
  87  |             if (final && final.currentStock === expectedStock) {
  88  |                 success = true;
  89  |                 break;
  90  |             }
  91  |             await page.waitForTimeout(5000); // 5s tactical wait for ERP invoice processing
  92  |         }
  93  | 
  94  |         if (!success) {
> 95  |             throw new Error(`Stock deduction failed after polling! Expected ${expectedStock}, found ${final?.currentStock ?? 'NULL'}`);
      |                   ^ Error: Stock deduction failed after polling! Expected 104, found 103
  96  |         }
  97  |         console.log(`[RESULT] Sales Impact: PASSED - Stock correctly decreased from ${initial.currentStock} to ${final?.currentStock}`);
  98  | 
  99  |         await page.close();
  100 |     });
  101 | });
  102 | 
```