# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/customer.spec.ts >> Customer Lifecycle — Validation & CRUD @sales @smoke >> Validate TIN, create customer, edit, remove
- Location: tests/sales/customer.spec.ts:26:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#customer_name-input-id, input[name="name"]:not([placeholder*="Search" i]), input[placeholder="Customer Name"], input[placeholder="Enter name"], .chakra-form-control:has(label) input[type="text"]:not([placeholder*="Search" i])').first() to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - generic [ref=f1e5]:
    - generic [ref=f1e6]:
      - generic [ref=f1e7]: Enterprise
      - textbox "Search tasks" [ref=f1e14]
      - generic [ref=f1e15]:
        - navigation [ref=f1e17]:
          - link [ref=f1e18] [cursor=pointer]:
            - /url: /dashboard
            - paragraph [ref=f1e21]: Dashboard
        - generic [ref=f1e23] [cursor=pointer]:
          - paragraph [ref=f1e26]: Accounting
          - paragraph [ref=f1e27]:
            - button "Toggle section" [ref=f1e28]
        - generic [ref=f1e32] [cursor=pointer]:
          - paragraph [ref=f1e35]: Account Reconciliation
          - paragraph [ref=f1e36]:
            - button "Toggle section" [ref=f1e37]
        - generic [ref=f1e41] [cursor=pointer]:
          - paragraph [ref=f1e44]: CRM
          - paragraph [ref=f1e45]:
            - button "Toggle section" [ref=f1e46]
        - generic [ref=f1e50] [cursor=pointer]:
          - paragraph [ref=f1e53]: HRM
          - paragraph [ref=f1e54]:
            - button "Toggle section" [ref=f1e55]
        - generic [ref=f1e59] [cursor=pointer]:
          - paragraph [ref=f1e62]: Project Management
          - paragraph [ref=f1e63]:
            - button "Toggle section" [ref=f1e64]
        - generic [ref=f1e68] [cursor=pointer]:
          - paragraph [ref=f1e71]: SCM
          - paragraph [ref=f1e72]:
            - button "Toggle section" [ref=f1e73]
        - generic [ref=f1e77] [cursor=pointer]:
          - paragraph [ref=f1e80]: Lease Management
          - paragraph [ref=f1e81]:
            - button "Toggle section" [ref=f1e82]
        - generic [ref=f1e86] [cursor=pointer]:
          - paragraph [ref=f1e89]: Service Management
          - paragraph [ref=f1e90]:
            - button "Toggle section" [ref=f1e91]
        - generic [ref=f1e95] [cursor=pointer]:
          - paragraph [ref=f1e98]: Report
          - paragraph [ref=f1e99]:
            - button "Toggle section" [ref=f1e100]
      - generic [ref=f1e103]:
        - button "Settings" [ref=f1e105] [cursor=pointer]:
          - generic:
            - generic:
              - paragraph: Settings
        - navigation [ref=f1e107]:
          - link [ref=f1e109] [cursor=pointer]:
            - /url: /settings/general/users
            - generic [ref=f1e110]:
              - paragraph [ref=f1e114]: User Management
              - button [ref=f1e115]
        - button [ref=f1e118] [cursor=pointer]
    - generic [ref=f1e122]:
      - generic [ref=f1e123]:
        - generic [ref=f1e124]:
          - img "BM Tech" [ref=f1e126]: BT
          - generic [ref=f1e127]:
            - button [ref=f1e128] [cursor=pointer]
            - generic [ref=f1e132] [cursor=pointer]:
              - button "Company Detail" [ref=f1e133]
              - button "Edit Company" [ref=f1e137]
              - button "Company Detail" [ref=f1e141]
        - generic [ref=f1e145]:
          - button [ref=f1e146] [cursor=pointer]
          - generic [ref=f1e152] [cursor=pointer]:
            - generic [ref=f1e153]: "5"
            - img "Notifications" [ref=f1e154]
          - button [ref=f1e157] [cursor=pointer]:
            - paragraph [ref=f1e160]: EC
          - button [ref=f1e161] [cursor=pointer]
          - generic [ref=f1e165] [cursor=pointer]:
            - img "System" [ref=f1e167]: S
            - generic [ref=f1e168]:
              - generic [ref=f1e169]: System
              - paragraph [ref=f1e170]: IT Administrator / User Manager
      - generic [ref=f1e171]:
        - generic [ref=f1e172]:
          - generic [ref=f1e173]:
            - navigation "breadcrumb" [ref=f1e174]:
              - list [ref=f1e175]:
                - navigation "breadcrumb" [ref=f1e176]:
                  - list [ref=f1e177]:
                    - listitem [ref=f1e178]:
                      - link "Home" [ref=f1e179] [cursor=pointer]:
                        - /url: /
                      - text: /
                    - listitem [ref=f1e180]:
                      - link "Receivables" [ref=f1e181] [cursor=pointer]:
                        - /url: /receivables/overview/
                      - text: /
                    - listitem [ref=f1e182]:
                      - link "Customer" [ref=f1e183] [cursor=pointer]:
                        - /url: /receivables/customers/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=f1e184]:
                      - link "Detail" [ref=f1e185] [cursor=pointer]:
                        - /url: /receivables/customers/9a620770-5441-42c3-a9c8-bda14f5c746c/detail
            - button "2019" [ref=f1e187] [cursor=pointer]
          - generic [ref=f1e192]:
            - button "Toggle Visibility" [ref=f1e195] [cursor=pointer]
            - generic [ref=f1e198]:
              - generic [ref=f1e199]:
                - heading "Customer Details" [level=3] [ref=f1e200]
                - group [ref=f1e204]:
                  - button "edit" [ref=f1e205] [cursor=pointer]: Edit
                  - button "remove" [ref=f1e207] [cursor=pointer]: Remove
              - generic [ref=f1e208]:
                - generic [ref=f1e209]:
                  - generic [ref=f1e210]:
                    - generic [ref=f1e211]:
                      - paragraph [ref=f1e212]: "Customer Name :"
                      - paragraph [ref=f1e213]: Kebede-1790056676940
                    - generic [ref=f1e214]:
                      - paragraph [ref=f1e215]: "Customer ID :"
                      - paragraph [ref=f1e216]: CUST/2026/09/22/000178
                    - generic [ref=f1e217]:
                      - paragraph [ref=f1e218]: "Customer Type :"
                      - paragraph [ref=f1e219]: individual
                    - generic [ref=f1e220]:
                      - paragraph [ref=f1e221]: "Customer TIN :"
                      - paragraph [ref=f1e222]: "3100836519"
                    - generic [ref=f1e223]:
                      - paragraph [ref=f1e224]: "Main Phone :"
                      - paragraph [ref=f1e225]: "0958371942"
                    - generic [ref=f1e226]:
                      - paragraph [ref=f1e227]: "Alt Phone :"
                      - paragraph
                    - generic [ref=f1e228]:
                      - paragraph [ref=f1e229]: "Fax :"
                      - paragraph
                    - generic [ref=f1e230]:
                      - paragraph [ref=f1e231]: "Email :"
                      - paragraph
                    - generic [ref=f1e232]:
                      - paragraph [ref=f1e233]: "Website :"
                      - paragraph
                  - generic [ref=f1e234]:
                    - generic [ref=f1e235]:
                      - paragraph [ref=f1e236]: "Region :"
                      - paragraph [ref=f1e237]: Tigray Region
                    - generic [ref=f1e238]:
                      - paragraph [ref=f1e239]: "Zone :"
                      - paragraph [ref=f1e240]: Central Zone
                    - generic [ref=f1e241]:
                      - paragraph [ref=f1e242]: "Woreda :"
                      - paragraph [ref=f1e243]: Abergele
                    - generic [ref=f1e244]:
                      - paragraph [ref=f1e245]: "Kebele :"
                      - paragraph
                    - generic [ref=f1e246]:
                      - paragraph [ref=f1e247]: "House No.:"
                      - paragraph
                - generic [ref=f1e248]:
                  - heading "Custom Fields" [level=2] [ref=f1e249]
                  - generic [ref=f1e251]:
                    - paragraph [ref=f1e252]: grand_father name
                    - paragraph [ref=f1e253]
              - generic [ref=f1e258]:
                - tablist [ref=f1e259]:
                  - tab "Contacts" [selected] [ref=f1e260] [cursor=pointer]
                  - tab "Invoices" [ref=f1e261] [cursor=pointer]
                  - tab "Receipts" [ref=f1e262] [cursor=pointer]
                  - tab "Sales Orders" [ref=f1e263] [cursor=pointer]
                  - tab "Projects" [ref=f1e264] [cursor=pointer]
                  - tab "Leases" [ref=f1e265] [cursor=pointer]
                  - tab "Services" [ref=f1e266] [cursor=pointer]
                - tabpanel "Contacts" [ref=f1e268]:
                  - table [ref=f1e273]:
                    - rowgroup [ref=f1e274]:
                      - row [ref=f1e275]:
                        - columnheader "First name" [ref=f1e276]
                        - columnheader "Last name" [ref=f1e278]
                        - columnheader "Phone" [ref=f1e280]
                        - columnheader "Email" [ref=f1e282]
                    - rowgroup [ref=f1e284]:
                      - row [ref=f1e285]:
                        - cell [ref=f1e286]:
                          - paragraph [ref=f1e288]: No record found
                    - rowgroup [ref=f1e289]:
                      - row [ref=f1e290]:
                        - columnheader [ref=f1e291]
                        - columnheader [ref=f1e292]
                        - columnheader [ref=f1e293]
                        - columnheader [ref=f1e294]
        - generic [ref=f1e295]: BM Technology © 2026
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
  1   | import { test, expect } from'@playwright/test';
  2   | import { AppManager } from'../../pages/AppManager';
  3   | import * as fs from'fs';
  4   | import * as path from'path';
  5   | 
  6   | 
  7   | const addressData: Array<{ region: string; zones: Array<{ name: string; woredas: string[] }> }> = JSON.parse(
  8   | 
  9   | /**
  10  |  * =============================================================================
  11  |  * MODULE: Customer Management - CRUD & Validation Suite
  12  |  * ARCHITECTURAL SCOPE & COVERAGE:
  13  |  * 1. Create customer with required fields (name, address, AR account)
  14  |  * 2. Duplicate customer name rejection (400/422 guardrail)
  15  |  * 3. Customer list pagination and search by name fragment
  16  |  * 4. Customer detail fields (balance, contacts, address)
  17  |  * =============================================================================
  18  |  */
  19  | 
  20  |     fs.readFileSync(path.join(__dirname,'../../data/address_locations.json'),'utf8')
  21  | );
  22  | 
  23  | test.describe('Customer Lifecycle — Validation & CRUD @sales @smoke', () => {
  24  |     test.setTimeout(180000);
  25  | 
  26  |     test('Validate TIN, create customer, edit, remove', async ({ page }) => {
  27  |         const app = new AppManager(page);
  28  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  29  | 
  30  |         const fixedTIN = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  31  |         const customerName = `Kebede-${Date.now()}`;
  32  |         const updatedName = `${customerName}-Updated`;
  33  | 
  34  |         // Use first region/zone/woreda — avoids cascading select race conditions
  35  |         const region  = addressData[0];
  36  |         const zone    = region.zones[0];
  37  |         const woreda  = zone.woredas[0];
  38  | 
  39  |         // ── Phase 1: TIN validation ───────────────────────────────────────────
  40  |         console.log('[STEP] Phase 1: TIN validation check');
  41  |         await page.goto('/receivables/customers/new', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  42  |         if (page.url().includes('/users/login')) {
  43  |             await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  44  |             await page.goto('/receivables/customers/new', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  45  |         }
  46  |         await app.customerNameInput.waitFor({ state: 'visible', timeout: 15000 });
  47  |         await app.customerNameInput.fill('Validation Test');
  48  |         await app.customerTypeSelect.selectOption('individual');
  49  |         await app.customerTinInput.fill('123');
  50  |         await app.customerPhoneInput.fill('0911223344');
  51  |         await app.fillEthiopianAddress(region.region, zone.name, woreda);
  52  |         await app.createCustomerBtn.click();
  53  |         await expect(page.getByText(/10 digit|must be 10/i)).toBeVisible({ timeout: 10000 });
  54  |         console.log('[OK] Invalid TIN correctly blocked');
  55  | 
  56  |         // ── Phase 2: Create ───────────────────────────────────────────────────
  57  |         console.log(`[STEP] Phase 2: Creating customer "${customerName}"`);
  58  |         const uniquePhone = `09${Math.floor(10000000 + Math.random() * 90000000)}`;
  59  |         await app.customerTinInput.fill(fixedTIN);
  60  |         await app.customerPhoneInput.fill(uniquePhone);
  61  |         await app.customerNameInput.clear();
  62  |         await app.customerNameInput.fill(customerName);
  63  |         await app.createCustomerBtn.click();
  64  |         await page.waitForURL(url => url.href.includes('/detail'), { timeout: 60000 });
  65  |         // Wait for detail page to fully render before interacting
  66  |         await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  67  |         console.log(`[OK] Customer "${customerName}" created`);
  68  | 
  69  |         // ── Phase 3: Edit ─────────────────────────────────────────────────────
  70  |         console.log(`[STEP] Phase 3: Editing to "${updatedName}"`);
  71  |         await app.editCustomerBtn.waitFor({ state: 'visible', timeout: 20000 });
  72  |         await app.editCustomerBtn.click({ force: true });
  73  | 
  74  |         // Wait for /edit URL — the Edit button navigates to a dedicated edit page
  75  |         await page.waitForURL(url => url.href.includes('/edit'), { timeout: 30000 })
  76  |           .catch(() => page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {}));
  77  | 
  78  |         // Scope strictly to a visible, editable input — explicitly exclude the
  79  |         // list-page "Search by name" box which shares the placeholder*="name" pattern.
  80  |         const nameInput = page.locator([
  81  |           '#customer_name-input-id',
  82  |           'input[name="name"]:not([placeholder*="Search" i])',
  83  |           'input[placeholder="Customer Name"]',
  84  |           'input[placeholder="Enter name"]',
  85  |           '.chakra-form-control:has(label) input[type="text"]:not([placeholder*="Search" i])',
  86  |         ].join(', ')).first();
  87  | 
> 88  |         await nameInput.waitFor({ state: 'visible', timeout: 30000 });
      |                         ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  89  |         await expect(nameInput).toBeEditable({ timeout: 15000 });
  90  |         await nameInput.click({ force: true });
  91  |         await nameInput.selectText().catch(() => {});
  92  |         await nameInput.fill(updatedName);
  93  | 
  94  |         const saveBtn = page.locator('button:has-text("Save"), button:has-text("Update"), button:has-text("Edit Customer")').first();
  95  |         await saveBtn.waitFor({ state: 'visible', timeout: 10000 });
  96  |         await saveBtn.click({ force: true });
  97  |         await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  98  |         // Poll for updated name — React re-render may lag behind networkidle
  99  |         await expect(page.getByText(updatedName).first()).toBeVisible({ timeout: 30000 });
  100 |         console.log('[OK] Customer updated');
  101 | 
  102 |         // ── Phase 4: Remove ───────────────────────────────────────────────────
  103 |         console.log('[STEP] Phase 4: Removing customer');
  104 |         await page.waitForTimeout(2000);
  105 |         const removeBtn = page.getByRole('button', { name: /remove|delete/i }).first();
  106 |         await removeBtn.waitFor({ state: 'visible', timeout: 20000 });
  107 |         await removeBtn.scrollIntoViewIfNeeded().catch(() => {});
  108 |         await removeBtn.click();
  109 | 
  110 |         const confirmBtn = page.locator('section[role="dialog"] button, div[role="alertdialog"] button, [role="dialog"] button, .modal button').filter({ hasText: /Yes|Confirm|Delete|Remove/i }).first();
  111 | 
  112 |         if (!await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  113 |             await removeBtn.click({ force: true });
  114 |         }
  115 | 
  116 |         await confirmBtn.waitFor({ state: 'visible', timeout: 15000 });
  117 |         await confirmBtn.click({ force: true });
  118 |         await page.waitForURL(url => url.href.includes('/receivables/customers'), { timeout: 30000 });
  119 |         console.log('[RESULT] Customer Lifecycle: PASSED');
  120 |     });
  121 | });
  122 | 
```