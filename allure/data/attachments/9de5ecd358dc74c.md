# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/vendor.spec.ts >> Vendor Lifecycle — Validation & CRUD @purchase @smoke @full >> Validate TIN, create vendor, edit, remove
- Location: tests/purchase/vendor.spec.ts:13:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('textbox', { name: 'Vendor Name *' }) to be visible

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
                        - /url: /payables/vendors/3cd463d6-9549-4cbb-a26e-45f6459d2f26/detail
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
                    - paragraph [ref=e215]: VEND/2026/08/04/000044
                    - paragraph [ref=e216]: "Name:"
                    - paragraph [ref=e217]: Ethio Supplies-9521
                    - paragraph [ref=e218]: "Vendor Type:"
                    - paragraph [ref=e219]: wholesaler
                  - paragraph [ref=e220]: Accounting
                  - generic [ref=e221]:
                    - paragraph [ref=e222]: "Expense Account:"
                    - paragraph [ref=e223]
                    - paragraph [ref=e224]: "TIN:"
                    - paragraph [ref=e225]: "4511771910"
                    - paragraph [ref=e226]: "Due Balance:"
                    - paragraph [ref=e227]: "0.00"
                - generic [ref=e228]:
                  - paragraph [ref=e229]: Address
                  - generic [ref=e230]:
                    - generic [ref=e231]:
                      - paragraph [ref=e232]: "Region:"
                      - paragraph [ref=e233]: Benishangul Gumuz Region
                    - generic [ref=e234]:
                      - paragraph [ref=e235]: "Zone:"
                      - paragraph [ref=e236]: Metekel Zone
                    - generic [ref=e237]:
                      - paragraph [ref=e238]: "City:"
                      - paragraph
                    - generic [ref=e239]:
                      - paragraph [ref=e240]: "Woreda:"
                      - paragraph [ref=e241]: Mandura
                    - generic [ref=e242]:
                      - paragraph [ref=e243]: "Kebele:"
                      - paragraph
                    - generic [ref=e244]:
                      - paragraph [ref=e245]: "House NO:"
                      - paragraph
              - generic [ref=e248]:
                - tablist [ref=e249]:
                  - tab "Purchase Orders" [selected] [ref=e250] [cursor=pointer]
                  - tab "Bills" [ref=e251] [cursor=pointer]
                  - tab "Payments" [ref=e252] [cursor=pointer]
                  - tab "Quotes" [ref=e253] [cursor=pointer]
                  - tab "Leases" [ref=e254] [cursor=pointer]
                  - tab "Services" [ref=e255] [cursor=pointer]
                - tabpanel "Purchase Orders" [ref=e257]:
                  - generic [ref=e258]:
                    - table [ref=e261]:
                      - rowgroup [ref=e262]:
                        - row "Purchase Order (PO) Number Order Date PO Status Accounts Payable Discount Term" [ref=e263]:
                          - columnheader "Purchase Order (PO) Number" [ref=e264] [cursor=pointer]: Purchase Order (PO) Number
                          - columnheader "Order Date" [ref=e266] [cursor=pointer]: Order Date
                          - columnheader "PO Status" [ref=e268] [cursor=pointer]: PO Status
                          - columnheader "Accounts Payable" [ref=e270] [cursor=pointer]: Accounts Payable
                          - columnheader "Discount Term" [ref=e272] [cursor=pointer]: Discount Term
                      - rowgroup [ref=e274]:
                        - row "No record found" [ref=e275]:
                          - cell "No record found" [ref=e276]:
                            - paragraph [ref=e278]: No record found
                      - rowgroup [ref=e279]:
                        - row [ref=e280]:
                          - columnheader [ref=e281]
                          - columnheader [ref=e282]
                          - columnheader [ref=e283]
                          - columnheader [ref=e284]
                          - columnheader [ref=e285]
                    - generic [ref=e286]:
                      - generic [ref=e288]:
                        - combobox [ref=e289]:
                          - option "Show 5 rows"
                          - option "Show 10 rows"
                          - option "Show 15 rows" [selected]
                          - option "Show 25 rows"
                          - option "Show 50 rows"
                          - option "Show 100 rows"
                        - generic:
                          - img
                      - generic [ref=e291]:
                        - button "go to first page" [disabled] [ref=e292]:
                          - img [ref=e293]
                        - generic [ref=e295]:
                          - button "go to previous page" [disabled] [ref=e296]:
                            - img [ref=e297]
                          - paragraph [ref=e299]: Page
                          - paragraph [ref=e300]: 1 of 0
                          - button "go to next page" [disabled] [ref=e301]:
                            - img [ref=e302]
                        - button "go to last page" [disabled] [ref=e304]:
                          - img [ref=e305]
        - generic [ref=e307]: BM Technology © 2026
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
```

# Test source

```ts
  1  | import { test, expect } from'@playwright/test';
  2  | import { AppManager } from'../../pages/AppManager';
  3  | import * as fs from'fs';
  4  | import * as path from'path';
  5  | 
  6  | const addressData: Array<{ region: string; zones: Array<{ name: string; woredas: string[] }> }> = JSON.parse(
  7  |     fs.readFileSync(path.join(__dirname,'../../data/address_locations.json'),'utf8')
  8  | );
  9  | 
  10 | test.describe('Vendor Lifecycle — Validation & CRUD @purchase @smoke @full', () => {
  11 |     test.setTimeout(120000);
  12 | 
  13 |     test('Validate TIN, create vendor, edit, remove', async ({ page }) => {
  14 |         const app = new AppManager(page);
  15 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  16 | 
  17 |         const fixedTIN = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  18 |         const vendorNames = ["TechSource PLC", "Global Imports", "Ethio Supplies", "Pioneer Distributors", "Addis Wholesale Trading"];
  19 |         const baseName = vendorNames[Math.floor(Math.random() * vendorNames.length)];
  20 |         const vendorName =`${baseName}-${Math.floor(Math.random() * 10000)}`;
  21 |         const updatedName =`${vendorName}-Updated`;
  22 | 
  23 |         const randomRegion = addressData[Math.floor(Math.random() * addressData.length)];
  24 |         const randomZone = randomRegion.zones[Math.floor(Math.random() * randomRegion.zones.length)];
  25 |         const randomWoreda = randomZone.woredas[Math.floor(Math.random() * randomZone.woredas.length)];
  26 | 
  27 |         // Validation
  28 |         console.log('[STEP] Phase 1: TIN validation check');
  29 |         await page.goto('/payables/vendors/new');
  30 |         await page.getByRole('textbox', { name:'Vendor Name *' }).fill("Validation Test Vendor");
  31 |         await page.getByLabel('Vendor Type *').selectOption('wholesaler');
  32 |         await page.getByRole('textbox', { name:'TIN', exact: false }).fill("123");
  33 |         await page.getByRole('textbox', { name:'Phone', exact: false }).fill("0911223344");
  34 |         await app.fillEthiopianAddress(randomRegion.region, randomZone.name, randomWoreda);
  35 | 
  36 |         const createBtn = page.locator('button:has-text("Add Now"), button:has-text("Create vendor"), button:has-text("Save")').first();
  37 |         await createBtn.click();
  38 |         await expect(page.getByText(/10 digit|must be 10|invalid/i)).toBeVisible();
  39 |         console.log('[OK] Invalid TIN correctly blocked');
  40 | 
  41 |         // Create
  42 |         console.log(`[STEP] Phase 2: Creating vendor "${vendorName}"`);
  43 |         const uniquePhone =`09${Math.floor(10000000 + Math.random() * 90000000)}`;
  44 |         await page.getByRole('textbox', { name:'TIN', exact: false }).clear();
  45 |         await page.getByRole('textbox', { name:'TIN', exact: false }).fill(fixedTIN);
  46 |         await page.getByRole('textbox', { name:'Phone', exact: false }).clear();
  47 |         await page.getByRole('textbox', { name:'Phone', exact: false }).fill(uniquePhone);
  48 |         await page.getByRole('textbox', { name:'Vendor Name *' }).clear();
  49 |         await page.getByRole('textbox', { name:'Vendor Name *' }).fill(vendorName);
  50 |         await createBtn.click();
  51 |         await page.waitForURL(url => url.href.includes('/detail'), { timeout: 60000 });
  52 |         console.log(`[OK] Vendor "${vendorName}" created`);
  53 | 
  54 |         // Edit
  55 |         console.log(`[STEP] Phase 3: Editing to "${updatedName}"`);
  56 |         const editBtn = page.locator('button:has-text("Edit")').first();
  57 |         await editBtn.waitFor({ state:'visible', timeout: 15000 });
  58 |         await page.waitForTimeout(2000);
  59 |         await editBtn.click({ force: true });
  60 |         // Wait for navigation or modal to settle before looking for the input
  61 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  62 |         await page.waitForTimeout(1000);
> 63 |         await page.getByRole('textbox', { name:'Vendor Name *' }).waitFor({ state:'visible', timeout: 30000 });
     |                                                                   ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  64 |         await page.getByRole('textbox', { name:'Vendor Name *' }).clear();
  65 |         await page.getByRole('textbox', { name:'Vendor Name *' }).fill(updatedName);
  66 |         await page.getByLabel('Vendor Type *').selectOption('independent');
  67 |         const editPhone =`09${Math.floor(10000000 + Math.random() * 90000000)}`;
  68 |         await page.getByRole('textbox', { name:'Phone', exact: false }).clear();
  69 |         await page.getByRole('textbox', { name:'Phone', exact: false }).fill(editPhone);
  70 |         const saveBtn = page.getByRole('button', { name: /Save Now|Update|Save/i }).first();
  71 |         await saveBtn.click({ force: true });
  72 |         await page.waitForTimeout(4000);
  73 |         console.log('[OK] Vendor updated');
  74 | 
  75 |         // Remove
  76 |         console.log('[STEP] Phase 4: Removing vendor');
  77 |         const removeBtn = page.getByRole('button', { name: /remove|delete/i }).first();
  78 |         await removeBtn.waitFor({ state:'visible' });
  79 |         await removeBtn.click({ force: true });
  80 |         const confirmBtn = page.locator('section[role="dialog"] button, div[role="alertdialog"] button').filter({ hasText: /Yes|Confirm|Delete/i }).first();
  81 |         await confirmBtn.waitFor({ state:'visible' });
  82 |         await confirmBtn.click({ force: true });
  83 |         await page.waitForURL(url => url.href.includes('/payables/vendors'), { timeout: 30000 });
  84 | 
  85 |         console.log('[RESULT] Vendor Lifecycle: PASSED');
  86 |     });
  87 | });
  88 | 
```