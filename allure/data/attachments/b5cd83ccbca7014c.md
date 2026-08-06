# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hr/hr-payroll.spec.ts >> Payroll: Runs & Pay Components @hr @smoke @regression @full >> UI: Pay Components settings page must render the components list
- Location: tests/hr/hr-payroll.spec.ts:159:9

# Error details

```
Error: Pay Components page rendered no rows

expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
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
          - paragraph [ref=e25]: Accounting
          - paragraph [ref=e26]:
            - button "Toggle section" [ref=e27]:
              - img [ref=e28]
        - generic [ref=e31] [cursor=pointer]:
          - paragraph [ref=e33]: Account Reconciliation
          - paragraph [ref=e34]:
            - button "Toggle section" [ref=e35]:
              - img [ref=e36]
        - generic [ref=e39] [cursor=pointer]:
          - paragraph [ref=e41]: CRM
          - paragraph [ref=e42]:
            - button "Toggle section" [ref=e43]:
              - img [ref=e44]
        - generic [ref=e47] [cursor=pointer]:
          - paragraph [ref=e49]: HRM
          - paragraph [ref=e50]:
            - button "Toggle section" [ref=e51]:
              - img [ref=e52]
        - generic [ref=e55] [cursor=pointer]:
          - paragraph [ref=e57]: Project Management
          - paragraph [ref=e58]:
            - button "Toggle section" [ref=e59]:
              - img [ref=e60]
        - generic [ref=e63] [cursor=pointer]:
          - paragraph [ref=e65]: SCM
          - paragraph [ref=e66]:
            - button "Toggle section" [ref=e67]:
              - img [ref=e68]
        - generic [ref=e71] [cursor=pointer]:
          - paragraph [ref=e73]: Lease Management
          - paragraph [ref=e74]:
            - button "Toggle section" [ref=e75]:
              - img [ref=e76]
        - generic [ref=e79] [cursor=pointer]:
          - paragraph [ref=e81]: Service Management
          - paragraph [ref=e82]:
            - button "Toggle section" [ref=e83]:
              - img [ref=e84]
        - generic [ref=e87] [cursor=pointer]:
          - paragraph [ref=e90]: Report
          - paragraph [ref=e91]:
            - button "Toggle section" [ref=e92]:
              - img [ref=e93]
      - generic [ref=e95]:
        - button "Settings" [ref=e97] [cursor=pointer]:
          - generic:
            - generic:
              - img
              - paragraph: Settings
        - navigation [ref=e99]:
          - link "User Management" [ref=e101] [cursor=pointer]:
            - /url: /settings/general/users
            - generic [ref=e102]:
              - generic [ref=e103]:
                - img [ref=e104]
                - paragraph [ref=e106]: User Management
              - button [ref=e107]:
                - img [ref=e108]
        - button "Logout" [ref=e110] [cursor=pointer]:
          - img [ref=e112]
          - text: Logout
    - generic [ref=e114]:
      - generic [ref=e115]:
        - generic [ref=e116]:
          - img "BM Tech" [ref=e118]: BT
          - generic [ref=e119]:
            - button "BM Tech" [ref=e120] [cursor=pointer]:
              - generic: BM Tech
              - img [ref=e122]
            - generic [ref=e124] [cursor=pointer]:
              - button "Company Detail" [ref=e125]:
                - img [ref=e126]
              - button "Edit Company" [ref=e129]:
                - img [ref=e130]
              - button "Company Detail" [ref=e133]:
                - img [ref=e134]
        - generic [ref=e137]:
          - button "New" [ref=e138] [cursor=pointer]:
            - text: New
            - img [ref=e140]
          - generic [ref=e144] [cursor=pointer]:
            - generic [ref=e145]: "1557"
            - img "Notifications" [ref=e146]
          - button "EC" [ref=e149] [cursor=pointer]:
            - img [ref=e150]
            - paragraph [ref=e152]: EC
          - button [ref=e153] [cursor=pointer]:
            - img [ref=e154]
          - generic [ref=e157] [cursor=pointer]:
            - img "System" [ref=e159]: S
            - generic [ref=e160]:
              - generic [ref=e161]: System
              - paragraph [ref=e162]: IT Administrator / User Manager
      - generic [ref=e163]:
        - generic [ref=e164]:
          - generic [ref=e165]:
            - navigation "breadcrumb" [ref=e166]:
              - list [ref=e167]:
                - navigation "breadcrumb" [ref=e168]:
                  - list [ref=e169]:
                    - listitem [ref=e170]:
                      - link "Home" [ref=e171] [cursor=pointer]:
                        - /url: /
                      - text: /
                    - listitem [ref=e172]:
                      - link "Payrolls" [ref=e173] [cursor=pointer]:
                        - /url: /payrolls
                      - text: /
                    - listitem [ref=e174]:
                      - link "Settings" [ref=e175] [cursor=pointer]:
                        - /url: /payrolls/settings
                      - text: /
                    - listitem [ref=e176]:
                      - link "Pay Components" [ref=e177] [cursor=pointer]:
                        - /url: /payrolls/settings/pay-components
            - button "2019" [ref=e179] [cursor=pointer]:
              - generic [ref=e180]: "2019"
              - img [ref=e181]
          - generic [ref=e184]:
            - generic [ref=e185]:
              - heading "Payroll Settings" [level=1] [ref=e186]
              - paragraph [ref=e187]: Configure and manage payroll settings for your organization.
            - generic [ref=e188]:
              - tablist [ref=e189]:
                - tab "Pay Components" [selected] [ref=e190] [cursor=pointer]
                - tab "Pay Structures" [ref=e191] [cursor=pointer]
                - tab "Tax & Pension Brackets" [ref=e192] [cursor=pointer]
                - tab "Overtime Rates" [ref=e193] [cursor=pointer]
              - generic [ref=e196]:
                - group [ref=e198]:
                  - radio "Advanced filters" [ref=e199] [cursor=pointer]:
                    - img
                    - text: Advanced filters
                  - radio "Command filters" [ref=e200] [cursor=pointer]:
                    - img
                    - text: Command filters
                - generic [ref=e201]:
                  - generic [ref=e202]:
                    - link "Add Pay Component" [ref=e203] [cursor=pointer]:
                      - /url: /payrolls/settings/pay-components/new
                      - img [ref=e205]
                      - text: Add Pay Component
                    - button "Export" [ref=e207] [cursor=pointer]:
                      - img [ref=e209]
                      - text: Export
                  - generic [ref=e211]:
                    - toolbar [ref=e212]:
                      - generic [ref=e213]:
                        - textbox "Search names..." [ref=e214]
                        - button "Type" [ref=e215] [cursor=pointer]:
                          - button "Type" [ref=e216]:
                            - img
                            - text: Type
                        - button "Tax Rule" [ref=e217] [cursor=pointer]:
                          - button "Tax Rule" [ref=e218]:
                            - img
                            - text: Tax Rule
                      - generic [ref=e219]:
                        - button "Sort" [ref=e220] [cursor=pointer]:
                          - button "Sort" [ref=e221]:
                            - img
                            - text: Sort
                        - status [ref=e222]
                        - button [ref=e223] [cursor=pointer]:
                          - combobox "Toggle columns" [ref=e224]:
                            - img
                            - text: View
                            - img
                    - table [ref=e227]:
                      - rowgroup [ref=e228]:
                        - row "Select all Name Type Tax Rule Rounding GL Account" [ref=e229]:
                          - columnheader "Select all" [ref=e230]:
                            - checkbox "Select all" [ref=e231] [cursor=pointer]
                          - columnheader "Name" [ref=e232]:
                            - button "Name" [ref=e233] [cursor=pointer]:
                              - text: Name
                              - img [ref=e234]
                          - columnheader "Type" [ref=e237]:
                            - button "Type" [ref=e238] [cursor=pointer]:
                              - text: Type
                              - img [ref=e239]
                          - columnheader "Tax Rule" [ref=e242]:
                            - button "Tax Rule" [ref=e243] [cursor=pointer]:
                              - text: Tax Rule
                              - img [ref=e244]
                          - columnheader "Rounding" [ref=e247]:
                            - button "Rounding" [ref=e248] [cursor=pointer]:
                              - text: Rounding
                              - img [ref=e249]
                          - columnheader "GL Account" [ref=e252]:
                            - button "GL Account" [ref=e253] [cursor=pointer]
                          - columnheader [ref=e254]
                      - rowgroup [ref=e255]:
                        - row "Select row Allowance ALW Earning Fully Taxable Exact Allowance Expense - 6006" [ref=e256]:
                          - cell "Select row" [ref=e257]:
                            - checkbox "Select row" [ref=e258] [cursor=pointer]
                          - cell "Allowance ALW" [ref=e259]:
                            - generic [ref=e260]:
                              - generic [ref=e261]: Allowance
                              - generic [ref=e262]: ALW
                          - cell "Earning" [ref=e263]:
                            - generic [ref=e264]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e265]:
                            - generic [ref=e266]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e267]:
                            - generic [ref=e268]: Exact
                          - cell "Allowance Expense - 6006" [ref=e269]:
                            - generic [ref=e270]: Allowance Expense - 6006
                          - cell [ref=e271]:
                            - button [ref=e272] [cursor=pointer]:
                              - button [ref=e273]:
                                - img
                        - row "Select row Audit-Allowance-1785310901076 AA76 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e274]:
                          - cell "Select row" [ref=e275]:
                            - checkbox "Select row" [ref=e276] [cursor=pointer]
                          - cell "Audit-Allowance-1785310901076 AA76" [ref=e277]:
                            - generic [ref=e278]:
                              - generic [ref=e279]: Audit-Allowance-1785310901076
                              - generic [ref=e280]: AA76
                          - cell "Earning" [ref=e281]:
                            - generic [ref=e282]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e283]:
                            - generic [ref=e284]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e285]:
                            - generic [ref=e286]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e287]:
                            - generic [ref=e288]: Cash - Main Office - 1001
                          - cell [ref=e289]:
                            - button [ref=e290] [cursor=pointer]:
                              - button [ref=e291]:
                                - img
                        - row "Select row Audit-Allowance-1785312075930 AA930 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e292]:
                          - cell "Select row" [ref=e293]:
                            - checkbox "Select row" [ref=e294] [cursor=pointer]
                          - cell "Audit-Allowance-1785312075930 AA930" [ref=e295]:
                            - generic [ref=e296]:
                              - generic [ref=e297]: Audit-Allowance-1785312075930
                              - generic [ref=e298]: AA930
                          - cell "Earning" [ref=e299]:
                            - generic [ref=e300]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e301]:
                            - generic [ref=e302]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e303]:
                            - generic [ref=e304]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e305]:
                            - generic [ref=e306]: Cash - Main Office - 1001
                          - cell [ref=e307]:
                            - button [ref=e308] [cursor=pointer]:
                              - button [ref=e309]:
                                - img
                        - row "Select row Audit-Allowance-1785487209319 AA319 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e310]:
                          - cell "Select row" [ref=e311]:
                            - checkbox "Select row" [ref=e312] [cursor=pointer]
                          - cell "Audit-Allowance-1785487209319 AA319" [ref=e313]:
                            - generic [ref=e314]:
                              - generic [ref=e315]: Audit-Allowance-1785487209319
                              - generic [ref=e316]: AA319
                          - cell "Earning" [ref=e317]:
                            - generic [ref=e318]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e319]:
                            - generic [ref=e320]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e321]:
                            - generic [ref=e322]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e323]:
                            - generic [ref=e324]: Cash - Main Office - 1001
                          - cell [ref=e325]:
                            - button [ref=e326] [cursor=pointer]:
                              - button [ref=e327]:
                                - img
                        - row "Select row Audit-Allowance-1785740428269 AA269 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e328]:
                          - cell "Select row" [ref=e329]:
                            - checkbox "Select row" [ref=e330] [cursor=pointer]
                          - cell "Audit-Allowance-1785740428269 AA269" [ref=e331]:
                            - generic [ref=e332]:
                              - generic [ref=e333]: Audit-Allowance-1785740428269
                              - generic [ref=e334]: AA269
                          - cell "Earning" [ref=e335]:
                            - generic [ref=e336]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e337]:
                            - generic [ref=e338]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e339]:
                            - generic [ref=e340]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e341]:
                            - generic [ref=e342]: Cash - Main Office - 1001
                          - cell [ref=e343]:
                            - button [ref=e344] [cursor=pointer]:
                              - button [ref=e345]:
                                - img
                        - row "Select row Audit-Allowance-1785758725156 AA156 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e346]:
                          - cell "Select row" [ref=e347]:
                            - checkbox "Select row" [ref=e348] [cursor=pointer]
                          - cell "Audit-Allowance-1785758725156 AA156" [ref=e349]:
                            - generic [ref=e350]:
                              - generic [ref=e351]: Audit-Allowance-1785758725156
                              - generic [ref=e352]: AA156
                          - cell "Earning" [ref=e353]:
                            - generic [ref=e354]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e355]:
                            - generic [ref=e356]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e357]:
                            - generic [ref=e358]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e359]:
                            - generic [ref=e360]: Cash - Main Office - 1001
                          - cell [ref=e361]:
                            - button [ref=e362] [cursor=pointer]:
                              - button [ref=e363]:
                                - img
                        - row "Select row Audit-Allowance-1785760423188 AA188 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e364]:
                          - cell "Select row" [ref=e365]:
                            - checkbox "Select row" [ref=e366] [cursor=pointer]
                          - cell "Audit-Allowance-1785760423188 AA188" [ref=e367]:
                            - generic [ref=e368]:
                              - generic [ref=e369]: Audit-Allowance-1785760423188
                              - generic [ref=e370]: AA188
                          - cell "Earning" [ref=e371]:
                            - generic [ref=e372]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e373]:
                            - generic [ref=e374]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e375]:
                            - generic [ref=e376]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e377]:
                            - generic [ref=e378]: Cash - Main Office - 1001
                          - cell [ref=e379]:
                            - button [ref=e380] [cursor=pointer]:
                              - button [ref=e381]:
                                - img
                        - row "Select row Audit-Allowance-1785826586303 AA303 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e382]:
                          - cell "Select row" [ref=e383]:
                            - checkbox "Select row" [ref=e384] [cursor=pointer]
                          - cell "Audit-Allowance-1785826586303 AA303" [ref=e385]:
                            - generic [ref=e386]:
                              - generic [ref=e387]: Audit-Allowance-1785826586303
                              - generic [ref=e388]: AA303
                          - cell "Earning" [ref=e389]:
                            - generic [ref=e390]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e391]:
                            - generic [ref=e392]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e393]:
                            - generic [ref=e394]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e395]:
                            - generic [ref=e396]: Cash - Main Office - 1001
                          - cell [ref=e397]:
                            - button [ref=e398] [cursor=pointer]:
                              - button [ref=e399]:
                                - img
                        - row "Select row Audit-Allowance-1785827008250 AA250 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e400]:
                          - cell "Select row" [ref=e401]:
                            - checkbox "Select row" [ref=e402] [cursor=pointer]
                          - cell "Audit-Allowance-1785827008250 AA250" [ref=e403]:
                            - generic [ref=e404]:
                              - generic [ref=e405]: Audit-Allowance-1785827008250
                              - generic [ref=e406]: AA250
                          - cell "Earning" [ref=e407]:
                            - generic [ref=e408]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e409]:
                            - generic [ref=e410]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e411]:
                            - generic [ref=e412]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e413]:
                            - generic [ref=e414]: Cash - Main Office - 1001
                          - cell [ref=e415]:
                            - button [ref=e416] [cursor=pointer]:
                              - button [ref=e417]:
                                - img
                        - row "Select row Audit-Allowance-1785827330327 AA327 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e418]:
                          - cell "Select row" [ref=e419]:
                            - checkbox "Select row" [ref=e420] [cursor=pointer]
                          - cell "Audit-Allowance-1785827330327 AA327" [ref=e421]:
                            - generic [ref=e422]:
                              - generic [ref=e423]: Audit-Allowance-1785827330327
                              - generic [ref=e424]: AA327
                          - cell "Earning" [ref=e425]:
                            - generic [ref=e426]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e427]:
                            - generic [ref=e428]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e429]:
                            - generic [ref=e430]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e431]:
                            - generic [ref=e432]: Cash - Main Office - 1001
                          - cell [ref=e433]:
                            - button [ref=e434] [cursor=pointer]:
                              - button [ref=e435]:
                                - img
                    - generic [ref=e437]:
                      - generic [ref=e438]: 0 of 10 row(s) selected.
                      - generic [ref=e439]:
                        - generic [ref=e440]:
                          - paragraph [ref=e441]: Rows per page
                          - combobox [ref=e442] [cursor=pointer]:
                            - generic: "10"
                            - img
                        - generic [ref=e443]: Page 1 of 3
                        - generic [ref=e444]:
                          - button "Go to first page" [disabled]:
                            - img
                          - button "Go to previous page" [disabled]:
                            - img
                          - button "Go to next page" [ref=e445] [cursor=pointer]:
                            - img
                          - button "Go to last page" [ref=e446] [cursor=pointer]:
                            - img
        - generic [ref=e447]: BM Technology © 2026
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
    - option "2019" [selected]
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
  66  |             'Content-Type': 'application/json',
  67  |         };
  68  |         const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  69  |         const resp = await page.request.post(`${app.apiBase}/pay-components?${params}`, {
  70  |             headers,
  71  |             data: {
  72  |                 name: `Invalid-PC-${Date.now()}`,
  73  |                 type: 'INVALID_TYPE',
  74  |                 tax_rule: 'INVALID_RULE',
  75  |                 abbreviation: 'INV',
  76  |                 general_ledger_account_id: meta.glAccountId,
  77  |             }
  78  |         });
  79  |         expect(resp.status()).toBe(422);
  80  |         const body = await resp.json();
  81  |         expect(body).toHaveProperty('details');
  82  |         console.log(`[PASS] Invalid pay component type rejected: ${JSON.stringify(body.details)}`);
  83  |     });
  84  | 
  85  |     test('API: Payroll run must be created with correct initial draft status', async () => {
  86  |         const name = `Audit-PayRun-${Date.now()}`;
  87  |         const ecYear = parseInt(process.env.BEFFA_YEAR || '2019');
  88  |         let run: any;
  89  |         for (const offset of [0, -1, 1, -2]) {
  90  |             const gcYear = (ecYear + offset) + 7;
  91  |             try {
  92  |                 run = await app.api.hr.createPayrollRun(
  93  |                     name,
  94  |                     `${gcYear}-07-08T00:00:00Z`,
  95  |                     `${gcYear}-07-30T00:00:00Z`,
  96  |                     `${gcYear}-07-30T00:00:00Z`
  97  |                 );
  98  |                 console.log(`[INFO] Payroll run accepted for EC year ${ecYear + offset} (GC ${gcYear})`);
  99  |                 break;
  100 |             } catch (e: any) {
  101 |                 if (e.message.includes('fiscal period') || e.message.includes('open')) {
  102 |                     console.log(`[INFO] EC year ${ecYear + offset} (GC ${gcYear}) not in open fiscal period — trying next...`);
  103 |                     continue;
  104 |                 }
  105 |                 throw e;
  106 |             }
  107 |         }
  108 |         if (!run) {
  109 |             console.log('[KNOWN_BUG] No open fiscal period configured for HR payroll — skipping');
  110 |             return;
  111 |         }
  112 |         expect(run).toHaveProperty('id');
  113 |         expect(run.status?.toLowerCase()).toMatch(/draft/);
  114 |         payRunId = run.id;
  115 |         console.log(`[PASS] Payroll run created: ${run.id} | status: ${run.status}`);
  116 |         const fetched = await app.api.hr.getPayrollRun(run.id);
  117 |         expect(fetched.id).toBe(run.id);
  118 |         console.log(`[PASS] Payroll run persisted correctly`);
  119 |     });
  120 | 
  121 |     test('Guardrail: Payroll run advance without active employees must not silently succeed', async () => {
  122 |         if (!payRunId) { console.log('[SKIP] No payroll run ID from previous test'); return; }
  123 |         const token = await app._getAuthToken();
  124 |         const headers = { 'Authorization': `Bearer ${token}`, 'x-company': process.env.BEFFA_COMPANY as string };
  125 |         const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  126 |         const empResp = await page.request.get(`${app.apiBase}/payroll-runs/${payRunId}/employees?${params}`, { headers });
  127 |         const empBody = await empResp.json();
  128 |         console.log(`[INFO] Employees in payroll run: ${empBody.data?.length ?? 0}`);
  129 |         const advResp = await page.request.patch(
  130 |             `${app.apiBase}/payroll-runs/${payRunId}/advance?${params}`,
  131 |             { headers: { ...headers, 'Content-Type': 'application/json' }, data: {} }
  132 |         );
  133 |         if (advResp.status() === 500) {
  134 |             const body = await advResp.json();
  135 |             console.log(`[PASS] Advance correctly blocked: ${body.message}`);
  136 |             expect(body.message).toBeTruthy();
  137 |         } else if (advResp.status() === 422 || advResp.status() === 400) {
  138 |             console.log(`[PASS] Advance blocked with validation error: ${advResp.status()}`);
  139 |         } else if (advResp.status() === 200) {
  140 |             const run = await app.api.hr.getPayrollRun(payRunId);
  141 |             console.log(`[AUDIT] Advance succeeded with ${run.payrolls?.length ?? 0} payrolls generated`);
  142 |             expect(run.payrolls?.length ?? 0).toBeGreaterThanOrEqual(0);
  143 |         }
  144 |     });
  145 | 
  146 |     test('UI: Payroll Runs page must load and display run records or empty state', async () => {
  147 |         await page.goto('/payrolls/payroll-runs', { waitUntil: 'load', timeout: 90000 });
  148 |         await page.locator('#loading-screen').waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {});
  149 |         const hasError = await page.locator('text=/error|failed|something went wrong/i').first()
  150 |             .isVisible({ timeout: 3000 }).catch(() => false);
  151 |         expect(hasError).toBe(false);
  152 |         const anyContent = await page.locator(
  153 |             'table tbody tr, [role="row"], h1, h2, [role="heading"], .chakra-text'
  154 |         ).first().isVisible({ timeout: 10000 }).catch(() => false);
  155 |         expect(anyContent, 'Payroll Runs page rendered no content').toBe(true);
  156 |         console.log(`[PASS] Payroll Runs page loaded`);
  157 |     });
  158 | 
  159 |     test('UI: Pay Components settings page must render the components list', async () => {
  160 |         await page.goto('/payrolls/settings/pay-components', { waitUntil: 'load', timeout: 90000 });
  161 |         await page.locator('#loading-screen').waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {});
  162 |         const hasError = await page.locator('text=/error|failed|something went wrong/i').first()
  163 |             .isVisible({ timeout: 3000 }).catch(() => false);
  164 |         expect(hasError).toBe(false);
  165 |         const rowCount = await page.locator('table tbody tr, [role="row"]').count();
> 166 |         expect(rowCount, 'Pay Components page rendered no rows').toBeGreaterThan(0);
      |                                                                  ^ Error: Pay Components page rendered no rows
  167 |         console.log(`[PASS] Pay Components page rendered ${rowCount} rows`);
  168 |     });
  169 | });
  170 | 
```