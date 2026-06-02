# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/cross-module-ui-flows.spec.ts >> Cross-Module UI Flow Audits @sales @purchase @smoke @full >> Sales UI: Partial payment updates invoice Amount Due correctly
- Location: tests/cross-module/cross-module-ui-flows.spec.ts:14:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Add Receipt|Create Receipt|Receive Payment/i }).first() to be visible

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
                      - link "Receivables" [ref=e181] [cursor=pointer]:
                        - /url: /receivables/overview/
                      - text: /
                    - listitem [ref=e182]:
                      - link "Invoices" [ref=e183] [cursor=pointer]:
                        - /url: /receivables/invoices/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=e184]:
                      - link "Detail" [ref=e185] [cursor=pointer]:
                        - /url: /receivables/invoices/657fc758-321b-4129-8791-5dc5f176ca9a/detail
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
                    - paragraph [ref=e245]: INV/2026/06/02/000127
                  - generic [ref=e246]:
                    - paragraph [ref=e247]: "Invoice Date:"
                    - paragraph [ref=e248]: June 02, 2026
                  - generic [ref=e249]:
                    - paragraph [ref=e250]: "Due Date:"
                    - paragraph [ref=e251]: June 04, 2026
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
                  - tab "Sales" [selected] [ref=e292] [cursor=pointer]
                  - tab "Journal" [ref=e293] [cursor=pointer]
                  - tab "History" [ref=e294] [cursor=pointer]
                - tabpanel "Sales" [ref=e296]:
                  - table [ref=e300]:
                    - rowgroup [ref=e301]:
                      - row "Item ID Quantity Unit Price Purchase Type Description G/L Account Project Before Tax Tax Total" [ref=e302]:
                        - columnheader "Item ID" [ref=e303]: Item ID
                        - columnheader "Quantity" [ref=e305]: Quantity
                        - columnheader "Unit Price" [ref=e307]: Unit Price
                        - columnheader "Purchase Type" [ref=e309]: Purchase Type
                        - columnheader "Description" [ref=e311]: Description
                        - columnheader "G/L Account" [ref=e313]: G/L Account
                        - columnheader "Project" [ref=e315]: Project
                        - columnheader "Before Tax" [ref=e317]: Before Tax
                        - columnheader "Tax" [ref=e319]: Tax
                        - columnheader "Total" [ref=e321]: Total
                    - rowgroup [ref=e323]:
                      - row "Switch gottak 1 1000 Goods Sales 3972.28 3972.28" [ref=e324]:
                        - cell "Switch gottak" [ref=e325]:
                          - generic [ref=e326]: Switch gottak
                        - cell "1" [ref=e327]:
                          - generic [ref=e328]: "1"
                        - cell "1000" [ref=e329]:
                          - generic [ref=e330]: "1000"
                        - cell "Goods" [ref=e331]:
                          - generic [ref=e332]: Goods
                        - cell [ref=e333]
                        - cell "Sales" [ref=e334]:
                          - generic [ref=e335]: Sales
                        - cell [ref=e336]
                        - cell "3972.28" [ref=e337]:
                          - generic [ref=e338]: "3972.28"
                        - cell [ref=e339]
                        - cell "3972.28" [ref=e340]:
                          - generic [ref=e341]: "3972.28"
                      - row [ref=e342]:
                        - cell [ref=e343]
                        - cell [ref=e344]
                        - cell [ref=e345]
                        - cell [ref=e346]
                        - cell [ref=e347]
                        - cell [ref=e348]
                        - cell [ref=e349]
                        - cell [ref=e350]
                        - cell [ref=e351]
                        - cell [ref=e352]
                      - row [ref=e353]:
                        - cell [ref=e354]
                        - cell [ref=e355]
                        - cell [ref=e356]
                        - cell [ref=e357]
                        - cell [ref=e358]
                        - cell [ref=e359]
                        - cell [ref=e360]
                        - cell [ref=e361]
                        - cell [ref=e362]
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
                    - rowgroup [ref=e496]:
                      - row "3972.28 0.00 3972.28" [ref=e497]:
                        - columnheader [ref=e498]
                        - columnheader [ref=e499]
                        - columnheader [ref=e500]
                        - columnheader [ref=e501]
                        - columnheader [ref=e502]
                        - columnheader [ref=e503]
                        - columnheader [ref=e504]
                        - columnheader "3972.28" [ref=e505]
                        - columnheader "0.00" [ref=e506]
                        - columnheader "3972.28" [ref=e507]
        - generic [ref=e508]: BM Technology © 2026
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
  4   | /**
  5   |  * CROSS-MODULE UI FLOW AUDITS (50/50 API+UI)
  6   |  *
  7   |  * Objectives:
  8   |  * 1. Sales: Partial payment via UI correctly updates invoice Amount Due on screen.
  9   |  * 2. Purchase: Approved bill reflects outstanding balance in vendor profile UI.
  10  |  */
  11  | 
  12  | test.describe('Cross-Module UI Flow Audits @sales @purchase @smoke @full', () => {
  13  | 
  14  |     test('Sales UI: Partial payment updates invoice Amount Due correctly', async ({ page }) => {
  15  |         test.setTimeout(300000);
  16  |         const app = new AppManager(page);
  17  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  18  | 
  19  |         const INVOICE_AMOUNT = 1000;
  20  |         const PARTIAL_AMOUNT = 400;
  21  |         const EXPECTED_REMAINING = INVOICE_AMOUNT - PARTIAL_AMOUNT;
  22  | 
  23  |         console.log(`[STEP 1] Creating & approving invoice for ${INVOICE_AMOUNT} via API...`);
  24  |         const meta = await app.api.sales.discoverMetadataAPI();
  25  |         const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
  26  | 
  27  |         if (!item) {
  28  |             console.log(`[SKIP] No item with stock >= 1 found.`);
  29  |             return;
  30  |         }
  31  | 
  32  |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  33  |             customerId: meta.customerId,
  34  |             itemId: item.itemId,
  35  |             quantity: 1,
  36  |             unitPrice: INVOICE_AMOUNT,
  37  |             locationId: item.locationId,
  38  |             warehouseId: item.warehouseId
  39  |         });
  40  |         await app.advanceDocumentAPI(inv.id, 'invoices');
  41  |         console.log(`[OK] Invoice ${inv.ref} approved.`);
  42  | 
  43  |         console.log(`[STEP 2] Navigating to invoice detail page via UI...`);
  44  |         await page.goto(`/receivables/invoices/${inv.id}/detail`, { waitUntil: 'networkidle' });
  45  | 
  46  |         console.log(`[STEP 3] Creating partial receipt of ${PARTIAL_AMOUNT} via UI...`);
  47  |         const addReceiptBtn = page.getByRole('button', { name: /Add Receipt|Create Receipt|Receive Payment/i }).first();
> 48  |         await addReceiptBtn.waitFor({ state: 'visible', timeout: 15000 });
      |                             ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  49  |         await addReceiptBtn.click();
  50  | 
  51  |         const modal = page.getByRole('dialog').last();
  52  |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  53  | 
  54  |         const amountInput = modal.getByRole('spinbutton').first();
  55  |         await amountInput.waitFor({ state: 'visible', timeout: 10000 });
  56  |         await amountInput.fill(String(PARTIAL_AMOUNT));
  57  | 
  58  |         await app.selectRandomOption(modal.getByRole('button', { name: /Cash Account selector/i }), 'Cash Account');
  59  | 
  60  |         const saveBtn = modal.getByRole('button', { name: /Add Now|Save|Submit/i }).first();
  61  |         await saveBtn.click();
  62  |         await expect(modal).not.toBeVisible({ timeout: 15000 });
  63  |         console.log(`[OK] Partial receipt submitted.`);
  64  | 
  65  |         console.log(`[STEP 4] Verifying Amount Due updated on invoice detail page...`);
  66  |         await page.waitForTimeout(3000);
  67  |         await page.reload({ waitUntil: 'networkidle' });
  68  | 
  69  |         const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
  70  |         const remaining = parseFloat(finalInv.unreceived_amount || finalInv.balance || '0');
  71  | 
  72  |         console.log(`[AUDIT] Invoice ${inv.ref} | Paid: ${PARTIAL_AMOUNT} | Remaining: ${remaining} | Expected: ${EXPECTED_REMAINING}`);
  73  |         expect(remaining).toBeCloseTo(EXPECTED_REMAINING, 1);
  74  | 
  75  |         await expect(page.getByText(String(EXPECTED_REMAINING)).first()).toBeVisible({ timeout: 15000 });
  76  |         console.log(`[PASS] Partial payment confirmed. Amount Due correctly updated to ${EXPECTED_REMAINING}.`);
  77  |     });
  78  | 
  79  |     test('Purchase UI: Approved bill reflects outstanding balance in vendor profile', async ({ page }) => {
  80  |         test.setTimeout(300000);
  81  |         const app = new AppManager(page);
  82  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  83  | 
  84  |         console.log(`[STEP 1] Creating & approving bill via API...`);
  85  |         const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 0 });
  86  |         const BILL_AMOUNT = 5000;
  87  | 
  88  |         const bill = await app.api.purchase.createBillAPI({
  89  |             itemData: item,
  90  |             quantity: 1,
  91  |             unitPrice: BILL_AMOUNT
  92  |         });
  93  |         await app.advanceDocumentAPI(bill.id, 'bills');
  94  |         console.log(`[OK] Bill ${bill.ref} approved.`);
  95  | 
  96  |         console.log(`[STEP 2] Fetching bill details to get vendor info...`);
  97  |         const billData = await app.api.purchase.getBillAPI(bill.id);
  98  |         const vendorId = billData.vendor_id || billData.vendor?.id;
  99  |         const vendorName = billData.vendor?.name || billData.vendor_name;
  100 | 
  101 |         if (!vendorId) {
  102 |             console.log(`[SKIP] Could not resolve vendor from bill. Skipping UI verification.`);
  103 |             return;
  104 |         }
  105 | 
  106 |         console.log(`[STEP 3] Navigating to vendor profile UI...`);
  107 |         await page.goto(`/payables/vendors/${vendorId}/detail`, { waitUntil: 'networkidle' });
  108 | 
  109 |         console.log(`[STEP 4] Navigating to Bills tab...`);
  110 |         const billsTab = page.getByRole('tab', { name: /Bills|Transactions/i }).first();
  111 |         await billsTab.waitFor({ state: 'visible', timeout: 15000 });
  112 |         await billsTab.click();
  113 |         await page.waitForTimeout(2000);
  114 | 
  115 |         console.log(`[STEP 5] Asserting bill ${bill.ref} is visible in vendor profile...`);
  116 |         const billLocator = page.getByText(bill.ref).first();
  117 |         await expect(billLocator).toBeVisible({ timeout: 30000 });
  118 | 
  119 |         console.log(`[PASS] Bill ${bill.ref} confirmed visible in vendor "${vendorName}" profile. Outstanding balance reflected.`);
  120 |     });
  121 | });
  122 | 
```