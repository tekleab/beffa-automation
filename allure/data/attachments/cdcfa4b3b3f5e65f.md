# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/sales-customer-balance-ui.spec.ts >> Sales Customer Balance UI Audits @sales @smoke @full >> UI Audit: Customer profile shows zero balance after full payment
- Location: tests/sales/sales-customer-balance-ui.spec.ts:73:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('RCPT/2026/08/03/000136').first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByText('RCPT/2026/08/03/000136').first()

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
                        - /url: /receivables/customers/243b9845-e056-48ce-924d-6f233d99c574/detail
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
                    - paragraph [ref=e216]: CUST/2026/07/27/000001
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
                  - tab "Invoices" [ref=e258] [cursor=pointer]
                  - tab "Receipts" [active] [selected] [ref=e259] [cursor=pointer]
                  - tab "Sales Orders" [ref=e260] [cursor=pointer]
                  - tab "Projects" [ref=e261] [cursor=pointer]
                  - tab "Leases" [ref=e262] [cursor=pointer]
                  - tab "Services" [ref=e263] [cursor=pointer]
                - tabpanel "Receipts" [ref=e265]:
                  - generic [ref=e266]:
                    - table [ref=e269]:
                      - rowgroup [ref=e270]:
                        - row "Ref Customer Check No Cash Account Date Amount" [ref=e271]:
                          - columnheader "Ref" [ref=e272]: Ref
                          - columnheader "Customer" [ref=e274]: Customer
                          - columnheader "Check No" [ref=e276]: Check No
                          - columnheader "Cash Account" [ref=e278]: Cash Account
                          - columnheader "Date" [ref=e280]: Date
                          - columnheader "Amount" [ref=e282]: Amount
                      - rowgroup [ref=e284]:
                        - row "No record found" [ref=e285]:
                          - cell "No record found" [ref=e286]:
                            - paragraph [ref=e288]: No record found
                      - rowgroup [ref=e289]:
                        - row [ref=e290]:
                          - columnheader [ref=e291]
                          - columnheader [ref=e292]
                          - columnheader [ref=e293]
                          - columnheader [ref=e294]
                          - columnheader [ref=e295]
                          - columnheader [ref=e296]
                    - generic [ref=e297]:
                      - generic [ref=e299]:
                        - combobox [ref=e300]:
                          - option "Show 5 rows"
                          - option "Show 10 rows" [selected]
                          - option "Show 15 rows"
                          - option "Show 25 rows"
                          - option "Show 50 rows"
                          - option "Show 100 rows"
                        - generic:
                          - img
                      - generic [ref=e302]:
                        - button "go to first page" [disabled] [ref=e303]:
                          - img [ref=e304]
                        - generic [ref=e306]:
                          - button "go to previous page" [disabled] [ref=e307]:
                            - img [ref=e308]
                          - paragraph [ref=e310]: Page
                          - paragraph [ref=e311]: 1 of 10
                          - button "go to next page" [ref=e312] [cursor=pointer]:
                            - img [ref=e313]
                        - button "go to last page" [ref=e315] [cursor=pointer]:
                          - img [ref=e316]
        - generic [ref=e318]: BM Technology © 2026
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
    - option "2018" [selected]
    - option "2019 (open)"
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
  32  |             warehouseId: item.warehouseId
  33  |         });
  34  |         await app.advanceDocumentAPI(inv.id, 'invoices');
  35  |         console.log(`[OK] Invoice ${inv.ref} approved.`);
  36  | 
  37  |         // Read the actual invoice total from the backend (backend may override unit_price with item cost)
  38  |         console.log(`[STEP 2] Asserting outstanding balance via API...`);
  39  |         const invoiceData = await app.api.sales.getInvoiceAPI(inv.id);
  40  |         const netDue = parseFloat(invoiceData.net_due ?? '-1');
  41  |         const outstanding = parseFloat(invoiceData.unreceived_amount ?? invoiceData.balance ?? '-1');
  42  |         if (netDue === -1) throw new Error(`[AUDIT] 'net_due' field missing from invoice response.`);
  43  |         if (outstanding === -1) throw new Error(`[AUDIT] 'unreceived_amount' field missing from invoice response.`);
  44  |         console.log(`[AUDIT] Invoice ${inv.ref} | net_due: ${netDue} | unreceived: ${outstanding}`);
  45  |         // An approved, unpaid invoice must have unreceived_amount == net_due
  46  |         expect(outstanding).toBeCloseTo(netDue, 2);
  47  | 
  48  |         console.log(`[STEP 3] Navigating to customer profile...`);
  49  |         await page.goto(`/receivables/customers/${meta.customerId}/detail`);
  50  | 
  51  |         console.log(`[STEP 4] Opening Invoices tab...`);
  52  |         const invoicesTab = page.getByRole('tab', { name: /^Invoices$/i }).first();
  53  |         await invoicesTab.waitFor({ state: 'visible', timeout: 15000 });
  54  |         await invoicesTab.click();
  55  |         await page.waitForTimeout(2000);
  56  | 
  57  |         console.log(`[STEP 5] Asserting invoice ${inv.ref} is visible in customer profile...`);
  58  |         const tabContent = await page.locator('table').first().textContent().catch(() => 'No table found');
  59  |         Logger.debug(`Tab content preview: ${tabContent?.substring(0, 200)}...`);
  60  | 
  61  |         const invoiceLocator = page.getByText(inv.ref).first();
  62  |         const isVisible = await invoiceLocator.isVisible({ timeout: 15000 }).catch(() => false);
  63  | 
  64  |         if (!isVisible) {
  65  |             const rowCount = await page.locator('table tbody tr').count();
  66  |             console.log(`[DEBUG] Rows in table: ${rowCount}`);
  67  |             throw new Error(`Invoice ${inv.ref} not found in customer profile UI. Customer: ${meta.customerId}`);
  68  |         }
  69  | 
  70  |         console.log(`[PASS] Invoice ${inv.ref} confirmed visible. Outstanding balance ${outstanding} verified.`);
  71  |     });
  72  | 
  73  |     test('UI Audit: Customer profile shows zero balance after full payment', async ({ page }) => {
  74  |         const app = new AppManager(page);
  75  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  76  | 
  77  |         const meta = await app.api.sales.discoverMetadataAPI();
  78  |         const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
  79  |         if (!item) { console.log('[SKIP] No stock available.'); return; }
  80  | 
  81  |         console.log(`[STEP 1] Creating invoice, approving, and paying in full via API...`);
  82  |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  83  |             customerId: meta.customerId,
  84  |             itemId: item.itemId,
  85  |             quantity: 1,
  86  |             unitPrice: item.unitCost || 600,
  87  |             locationId: item.locationId,
  88  |             warehouseId: item.warehouseId
  89  |         });
  90  |         await app.advanceDocumentAPI(inv.id, 'invoices');
  91  | 
  92  |         // Read the actual invoice total before paying — backend may override unit_price
  93  |         const invData = await app.api.sales.getInvoiceAPI(inv.id);
  94  |         const ACTUAL_AMOUNT = parseFloat(invData.net_due ?? invData.unreceived_amount ?? '0');
  95  |         if (!ACTUAL_AMOUNT) throw new Error(`[AUDIT] Could not determine invoice net_due for payment. Response: ${JSON.stringify(invData).substring(0, 200)}`);
  96  |         console.log(`[OK] Invoice ${inv.ref} net_due: ${ACTUAL_AMOUNT}`);
  97  | 
  98  |         const rct = await app.api.sales.createInvoiceReceiptAPI({
  99  |             invoiceId: inv.id,
  100 |             customerId: meta.customerId,
  101 |             amount: ACTUAL_AMOUNT
  102 |         });
  103 |         await app.advanceDocumentAPI(rct.id, 'receipts');
  104 |         console.log(`[OK] Invoice ${inv.ref} fully paid via receipt ${rct.ref}.`);
  105 | 
  106 |         await page.waitForTimeout(3000);
  107 | 
  108 |         console.log(`[STEP 2] Verifying invoice balance is zero via API...`);
  109 |         const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
  110 |         const remaining = parseFloat(finalInv.unreceived_amount ?? finalInv.balance ?? '-1');
  111 |         if (remaining === -1) throw new Error(`[AUDIT] 'unreceived_amount' field missing from invoice response.`);
  112 |         console.log(`[AUDIT] Invoice ${inv.ref} remaining balance: ${remaining} (Expected: 0)`);
  113 |         expect(remaining).toBeCloseTo(0, 2);
  114 | 
  115 |         console.log(`[STEP 3] Navigating to customer profile to verify paid status in UI...`);
  116 |         await page.goto(`/receivables/customers/${meta.customerId}/detail`);
  117 | 
  118 |         const invoicesTab = page.getByRole('tab', { name: /^Invoices$/i }).first();
  119 |         await invoicesTab.waitFor({ state: 'visible', timeout: 150000 });
  120 |         await invoicesTab.click();
  121 |         await page.waitForTimeout(2000);
  122 | 
  123 |         // Check Receipts tab for the receipt ref — this is a hard assertion
  124 |         console.log(`[STEP 4] Asserting receipt ${rct.ref} is visible in customer profile...`);
  125 |         const receiptsTab = page.getByRole('tab', { name: /^Receipts$/i }).first();
  126 |         if (await receiptsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
  127 |             await receiptsTab.click();
  128 |             await page.waitForTimeout(2000);
  129 |         }
  130 | 
  131 |         const rcptLocator = page.getByText(rct.ref).first();
> 132 |         await expect(rcptLocator).toBeVisible({ timeout: 15000 });
      |                                   ^ Error: expect(locator).toBeVisible() failed
  133 | 
  134 |         console.log(`[PASS] Receipt ${rct.ref} confirmed in customer profile. Balance cleared to zero.`);
  135 |     });
  136 | });
  137 | 
```