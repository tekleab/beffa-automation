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
                        - row "No record found" [ref=e283]:
                          - cell "No record found" [ref=e284]:
                            - paragraph [ref=e286]: No record found
                      - rowgroup [ref=e287]:
                        - row [ref=e288]:
                          - columnheader [ref=e289]
                          - columnheader [ref=e290]
                          - columnheader [ref=e291]
                          - columnheader [ref=e292]
                          - columnheader [ref=e293]
                    - generic [ref=e294]:
                      - generic [ref=e296]:
                        - combobox [ref=e297]:
                          - option "Show 5 rows"
                          - option "Show 10 rows" [selected]
                          - option "Show 15 rows"
                          - option "Show 25 rows"
                          - option "Show 50 rows"
                          - option "Show 100 rows"
                        - generic:
                          - img
                      - generic [ref=e299]:
                        - button "go to first page" [disabled] [ref=e300]:
                          - img [ref=e301]
                        - generic [ref=e303]:
                          - button "go to previous page" [disabled] [ref=e304]:
                            - img [ref=e305]
                          - paragraph [ref=e307]: Page
                          - paragraph [ref=e308]: 1 of -1
                          - button "go to next page" [ref=e309] [cursor=pointer]:
                            - img [ref=e310]
                        - button "go to last page" [ref=e312] [cursor=pointer]:
                          - img [ref=e313]
        - generic [ref=e315]: BM Technology © 2026
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