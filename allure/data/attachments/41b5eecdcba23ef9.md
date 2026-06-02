# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/customer.spec.ts >> Customer Lifecycle — Validation & CRUD @sales @smoke @full >> Validate TIN, create customer, edit, remove
- Location: tests/sales/customer.spec.ts:13:9

# Error details

```
TimeoutError: locator.selectOption: Timeout 60000ms exceeded.
Call log:
  - waiting for locator('#customer_type_id')

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
                      - link "Receivables" [ref=e181] [cursor=pointer]:
                        - /url: /receivables/overview/
                      - text: /
                    - listitem [ref=e182]:
                      - link "Customer" [ref=e183] [cursor=pointer]:
                        - /url: /receivables/customers/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=e184]:
                      - link "Add" [ref=e185] [cursor=pointer]:
                        - /url: /receivables/customers/new
            - button "2018" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2018"
              - img [ref=e189]
          - generic [ref=e192]:
            - button "Toggle Visibility" [ref=e195] [cursor=pointer]:
              - img [ref=e196]
            - generic [ref=e202]:
              - generic [ref=e204]:
                - generic [ref=e206]:
                  - generic [ref=e207]:
                    - group [ref=e208]:
                      - generic [ref=e209]: Customer Name *
                      - textbox "Customer Name *" [active] [ref=e210]: Validation Test
                    - group [ref=e211]:
                      - generic [ref=e212]: Customer Type *
                      - generic [ref=e213]:
                        - combobox "Customer Type *" [ref=e214]:
                          - option "Select Customer" [selected]
                          - option "Individual"
                          - option "Company"
                        - generic:
                          - img
                    - group [ref=e215]:
                      - generic [ref=e216]: Customer ID
                      - textbox "Customer ID" [disabled] [ref=e217]:
                        - /placeholder: N/A
                      - generic [ref=e218]: Customer ID is auto-generated
                    - group [ref=e219]:
                      - generic [ref=e220]: Customer TIN *
                      - textbox "Customer TIN *" [ref=e221]
                    - group [ref=e222]:
                      - generic [ref=e223]: Main Phone *
                      - textbox "Main Phone * Alternate Phone" [ref=e224]
                  - generic [ref=e225]:
                    - group [ref=e226]:
                      - generic [ref=e227]: Alternate Phone
                      - textbox [ref=e228]
                    - group [ref=e229]:
                      - generic [ref=e230]: Email
                      - textbox "Email" [ref=e231]
                    - group [ref=e232]:
                      - generic [ref=e233]: Website
                      - textbox "Website" [ref=e234]
                    - group [ref=e235]:
                      - group [ref=e236]:
                        - generic [ref=e237]: Search for account
                        - button "Search for account selector" [ref=e238]: Select a Customer Business Account
                    - group [ref=e239]:
                      - generic [ref=e240]: Fax
                      - textbox "Fax" [ref=e241]
                  - generic [ref=e242]:
                    - group [ref=e243]:
                      - generic [ref=e244]: Region*
                      - generic [ref=e245]:
                        - combobox "Region" [ref=e246]:
                          - option "Select Region" [selected]
                          - option "Tigray Region"
                          - option "Afar Region"
                          - option "Amhara Region"
                          - option "Oromia Region"
                          - option "Somali Region"
                          - option "Benishangul Gumuz Region"
                          - option "South Ethiopia Regional State"
                          - option "Gambela Region"
                          - option "Harari Region"
                          - option "Sidama Region"
                          - option "South West Ethiopia Region"
                          - option "Central Ethiopia Regional State"
                          - option "Addis Ababa City Administration"
                          - option "Dire Dawa City Administration"
                        - generic:
                          - img
                    - group [ref=e247]:
                      - generic [ref=e248]: Zone*
                      - generic [ref=e249]:
                        - combobox "Zone" [ref=e250]:
                          - option "Select Zone" [selected]
                        - generic:
                          - img
                    - group [ref=e251]:
                      - generic [ref=e252]: Wereda*
                      - generic [ref=e253]:
                        - combobox "Wereda" [ref=e254]:
                          - option "Select Wereda" [selected]
                        - generic:
                          - img
                    - group [ref=e255]:
                      - generic [ref=e256]: Kebele
                      - textbox "Kebele" [ref=e257]:
                        - /placeholder: Enter Kebele
                - generic [ref=e258]:
                  - generic [ref=e259]:
                    - paragraph [ref=e260]: Add Contacts
                    - generic [ref=e261]:
                      - button "Add item" [ref=e262] [cursor=pointer]:
                        - img [ref=e263]
                      - generic [ref=e265]: Add Contact
                  - generic [ref=e267]:
                    - generic [ref=e268]: First name
                    - generic [ref=e269]: Last name
                    - generic [ref=e270]: Phone
                    - generic [ref=e271]: Email
              - button "Create customer" [disabled] [ref=e273]
        - generic [ref=e274]: BM Technology © 2026
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
  1  | import { test, expect } from'@playwright/test';
  2  | import { AppManager } from'../../pages/AppManager';
  3  | import * as fs from'fs';
  4  | import * as path from'path';
  5  | 
  6  | const addressData: Array<{ region: string; zones: Array<{ name: string; woredas: string[] }> }> = JSON.parse(
  7  |     fs.readFileSync(path.join(__dirname,'../../data/address_locations.json'),'utf8')
  8  | );
  9  | 
  10 | test.describe('Customer Lifecycle — Validation & CRUD @sales @smoke @full', () => {
  11 |     test.setTimeout(480000);
  12 | 
  13 |     test('Validate TIN, create customer, edit, remove', async ({ page }) => {
  14 |         const app = new AppManager(page);
  15 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  16 | 
  17 |         const fixedTIN = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  18 |         const customerName =`Kebede-${Math.floor(Math.random() * 10000)}`;
  19 |         const updatedName =`${customerName}-Updated`;
  20 | 
  21 |         const randomRegion = addressData[Math.floor(Math.random() * addressData.length)];
  22 |         const randomZone = randomRegion.zones[Math.floor(Math.random() * randomRegion.zones.length)];
  23 |         const randomWoreda = randomZone.woredas[Math.floor(Math.random() * randomZone.woredas.length)];
  24 | 
  25 |         // Validation
  26 |         console.log('[STEP] Phase 1: TIN validation check');
  27 |         await page.goto('/receivables/customers/new');
  28 |         await app.customerNameInput.fill("Validation Test");
> 29 |         await app.customerTypeSelect.selectOption('individual');
     |                                      ^ TimeoutError: locator.selectOption: Timeout 60000ms exceeded.
  30 |         await app.customerTinInput.fill("123");
  31 |         await app.customerPhoneInput.fill("0911223344");
  32 |         await app.fillEthiopianAddress(randomRegion.region, randomZone.name, randomWoreda);
  33 | 
  34 |         await app.createCustomerBtn.click();
  35 |         await expect(page.getByText(/10 digit|must be 10/i)).toBeVisible();
  36 |         console.log('[OK] Invalid TIN correctly blocked');
  37 | 
  38 |         // Create
  39 |         console.log(`[STEP] Phase 2: Creating customer "${customerName}"`);
  40 |         const uniquePhone =`09${Math.floor(10000000 + Math.random() * 90000000)}`;
  41 |         await app.customerTinInput.fill(fixedTIN);
  42 |         await app.customerPhoneInput.fill(uniquePhone);
  43 |         await app.customerNameInput.clear();
  44 |         await app.customerNameInput.fill(customerName);
  45 |         await app.createCustomerBtn.click();
  46 |         await page.waitForURL(url => url.href.includes('/detail'), { timeout: 60000 });
  47 |         console.log(`[OK] Customer "${customerName}" created`);
  48 | 
  49 |         // Edit
  50 |         console.log(`[STEP] Phase 3: Editing to "${updatedName}"`);
  51 |         await app.editCustomerBtn.waitFor({ state:'visible', timeout: 15000 });
  52 |         await page.waitForTimeout(2000);
  53 |         await app.editCustomerBtn.click({ force: true });
  54 |         await page.waitForTimeout(3000);
  55 |         await expect(app.customerNameInput).toBeVisible({ timeout: 30000 });
  56 |         await app.customerNameInput.clear();
  57 |         await app.customerNameInput.fill(updatedName);
  58 |         const saveBtn = page.locator('button:has-text("Save"), button:has-text("Update")').first();
  59 |         await saveBtn.click({ force: true });
  60 |         await page.waitForTimeout(4000);
  61 |         console.log('[OK] Customer updated');
  62 | 
  63 |         // Remove
  64 |         console.log('[STEP] Phase 4: Removing customer');
  65 |         await app.removeCustomerBtn.waitFor({ state:'visible' });
  66 |         await app.removeCustomerBtn.click({ force: true });
  67 |         const confirmBtn = page.locator('section[role="dialog"] button:has-text("Yes"), button:has-text("Confirm")').first();
  68 |         await confirmBtn.waitFor({ state:'visible' });
  69 |         await confirmBtn.click({ force: true });
  70 |         await page.waitForURL(url => url.href.includes('/receivables/customers'), { timeout: 30000 });
  71 | 
  72 |         console.log('[RESULT] Customer Lifecycle: PASSED');
  73 |     });
  74 | });
  75 | 
```