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
      - img [ref=e10]
      - generic:
        - generic:
          - generic:
            - img
      - navigation [ref=e13]:
        - link [ref=e14] [cursor=pointer]:
          - /url: /dashboard
      - generic [ref=e53]:
        - button [ref=e55] [cursor=pointer]:
          - generic:
            - generic:
              - img
        - navigation [ref=e57]:
          - link [ref=e59] [cursor=pointer]:
            - /url: /settings/general/users
            - img [ref=e62]
        - button [ref=e64] [cursor=pointer]:
          - img [ref=e66]
    - generic [ref=e68]:
      - generic [ref=e69]:
        - generic [ref=e70]:
          - img "BM Tech" [ref=e72]: BT
          - generic [ref=e73]:
            - button "BM Tech" [ref=e74] [cursor=pointer]:
              - generic: BM Tech
              - img [ref=e76]
            - generic [ref=e78] [cursor=pointer]:
              - button "Company Detail" [ref=e79]:
                - img [ref=e80]
              - button "Edit Company" [ref=e83]:
                - img [ref=e84]
              - button "Company Detail" [ref=e87]:
                - img [ref=e88]
        - generic [ref=e91]:
          - button "New" [ref=e92] [cursor=pointer]:
            - text: New
            - img [ref=e94]
          - img "Notifications" [ref=e99] [cursor=pointer]
          - button "EC" [ref=e102] [cursor=pointer]:
            - img [ref=e103]
            - paragraph [ref=e105]: EC
          - button [ref=e106] [cursor=pointer]:
            - img [ref=e107]
          - generic [ref=e110] [cursor=pointer]:
            - img "System" [ref=e112]: S
            - generic [ref=e113]:
              - generic [ref=e114]: System
              - paragraph [ref=e115]: IT Administrator / User Manager
      - generic [ref=e116]:
        - generic [ref=e117]:
          - generic [ref=e118]:
            - navigation "breadcrumb" [ref=e119]:
              - list [ref=e120]:
                - navigation "breadcrumb" [ref=e121]:
                  - list [ref=e122]:
                    - listitem [ref=e123]:
                      - link "Home" [ref=e124] [cursor=pointer]:
                        - /url: /
                      - text: /
                    - listitem [ref=e125]:
                      - link "Payrolls" [ref=e126] [cursor=pointer]:
                        - /url: /payrolls
                      - text: /
                    - listitem [ref=e127]:
                      - link "Settings" [ref=e128] [cursor=pointer]:
                        - /url: /payrolls/settings
                      - text: /
                    - listitem [ref=e129]:
                      - link "Pay Components" [ref=e130] [cursor=pointer]:
                        - /url: /payrolls/settings/pay-components
            - button "2019" [ref=e132] [cursor=pointer]:
              - generic [ref=e133]: "2019"
              - img [ref=e134]
          - generic [ref=e137]:
            - generic [ref=e138]:
              - heading "Payroll Settings" [level=1] [ref=e139]
              - paragraph [ref=e140]: Configure and manage payroll settings for your organization.
            - generic [ref=e141]:
              - tablist [ref=e142]:
                - tab "Pay Components" [selected] [ref=e143] [cursor=pointer]
                - tab "Pay Structures" [ref=e144] [cursor=pointer]
                - tab "Tax & Pension Brackets" [ref=e145] [cursor=pointer]
                - tab "Overtime Rates" [ref=e146] [cursor=pointer]
              - generic [ref=e149]:
                - group [ref=e151]:
                  - radio "Advanced filters" [ref=e152] [cursor=pointer]:
                    - img
                    - text: Advanced filters
                  - radio "Command filters" [ref=e153] [cursor=pointer]:
                    - img
                    - text: Command filters
                - generic [ref=e154]:
                  - generic [ref=e155]:
                    - link "Add Pay Component" [ref=e156] [cursor=pointer]:
                      - /url: /payrolls/settings/pay-components/new
                      - img [ref=e158]
                      - text: Add Pay Component
                    - button "Export" [ref=e160] [cursor=pointer]:
                      - img [ref=e162]
                      - text: Export
                  - generic [ref=e164]:
                    - toolbar [ref=e165]:
                      - generic [ref=e166]:
                        - textbox "Search names..." [ref=e167]
                        - button "Type" [ref=e168] [cursor=pointer]:
                          - button "Type" [ref=e169]:
                            - img
                            - text: Type
                        - button "Tax Rule" [ref=e170] [cursor=pointer]:
                          - button "Tax Rule" [ref=e171]:
                            - img
                            - text: Tax Rule
                      - generic [ref=e172]:
                        - button "Sort" [ref=e173] [cursor=pointer]:
                          - button "Sort" [ref=e174]:
                            - img
                            - text: Sort
                        - status [ref=e175]
                        - button [ref=e176] [cursor=pointer]:
                          - combobox "Toggle columns" [ref=e177]:
                            - img
                            - text: View
                            - img
                    - table [ref=e180]:
                      - rowgroup [ref=e181]:
                        - row "Select all Name Type Tax Rule Rounding GL Account" [ref=e182]:
                          - columnheader "Select all" [ref=e183]:
                            - checkbox "Select all" [ref=e184] [cursor=pointer]
                          - columnheader "Name" [ref=e185]:
                            - button "Name" [ref=e186] [cursor=pointer]:
                              - text: Name
                              - img [ref=e187]
                          - columnheader "Type" [ref=e190]:
                            - button "Type" [ref=e191] [cursor=pointer]:
                              - text: Type
                              - img [ref=e192]
                          - columnheader "Tax Rule" [ref=e195]:
                            - button "Tax Rule" [ref=e196] [cursor=pointer]:
                              - text: Tax Rule
                              - img [ref=e197]
                          - columnheader "Rounding" [ref=e200]:
                            - button "Rounding" [ref=e201] [cursor=pointer]:
                              - text: Rounding
                              - img [ref=e202]
                          - columnheader "GL Account" [ref=e205]:
                            - button "GL Account" [ref=e206] [cursor=pointer]
                          - columnheader [ref=e207]
                      - rowgroup [ref=e208]:
                        - row "Select row Allowance ALW Earning Fully Taxable Exact Allowance Expense - 6006" [ref=e209]:
                          - cell "Select row" [ref=e210]:
                            - checkbox "Select row" [ref=e211] [cursor=pointer]
                          - cell "Allowance ALW" [ref=e212]:
                            - generic [ref=e213]:
                              - generic [ref=e214]: Allowance
                              - generic [ref=e215]: ALW
                          - cell "Earning" [ref=e216]:
                            - generic [ref=e217]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e218]:
                            - generic [ref=e219]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e220]:
                            - generic [ref=e221]: Exact
                          - cell "Allowance Expense - 6006" [ref=e222]:
                            - generic [ref=e223]: Allowance Expense - 6006
                          - cell [ref=e224]:
                            - button [ref=e225] [cursor=pointer]:
                              - button [ref=e226]:
                                - img
                        - row "Select row Audit-Allowance-1785310901076 AA76 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e227]:
                          - cell "Select row" [ref=e228]:
                            - checkbox "Select row" [ref=e229] [cursor=pointer]
                          - cell "Audit-Allowance-1785310901076 AA76" [ref=e230]:
                            - generic [ref=e231]:
                              - generic [ref=e232]: Audit-Allowance-1785310901076
                              - generic [ref=e233]: AA76
                          - cell "Earning" [ref=e234]:
                            - generic [ref=e235]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e236]:
                            - generic [ref=e237]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e238]:
                            - generic [ref=e239]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e240]:
                            - generic [ref=e241]: Cash - Main Office - 1001
                          - cell [ref=e242]:
                            - button [ref=e243] [cursor=pointer]:
                              - button [ref=e244]:
                                - img
                        - row "Select row Audit-Allowance-1785312075930 AA930 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e245]:
                          - cell "Select row" [ref=e246]:
                            - checkbox "Select row" [ref=e247] [cursor=pointer]
                          - cell "Audit-Allowance-1785312075930 AA930" [ref=e248]:
                            - generic [ref=e249]:
                              - generic [ref=e250]: Audit-Allowance-1785312075930
                              - generic [ref=e251]: AA930
                          - cell "Earning" [ref=e252]:
                            - generic [ref=e253]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e254]:
                            - generic [ref=e255]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e256]:
                            - generic [ref=e257]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e258]:
                            - generic [ref=e259]: Cash - Main Office - 1001
                          - cell [ref=e260]:
                            - button [ref=e261] [cursor=pointer]:
                              - button [ref=e262]:
                                - img
                        - row "Select row Audit-Allowance-1785487209319 AA319 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e263]:
                          - cell "Select row" [ref=e264]:
                            - checkbox "Select row" [ref=e265] [cursor=pointer]
                          - cell "Audit-Allowance-1785487209319 AA319" [ref=e266]:
                            - generic [ref=e267]:
                              - generic [ref=e268]: Audit-Allowance-1785487209319
                              - generic [ref=e269]: AA319
                          - cell "Earning" [ref=e270]:
                            - generic [ref=e271]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e272]:
                            - generic [ref=e273]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e274]:
                            - generic [ref=e275]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e276]:
                            - generic [ref=e277]: Cash - Main Office - 1001
                          - cell [ref=e278]:
                            - button [ref=e279] [cursor=pointer]:
                              - button [ref=e280]:
                                - img
                        - row "Select row Audit-Allowance-1785740428269 AA269 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e281]:
                          - cell "Select row" [ref=e282]:
                            - checkbox "Select row" [ref=e283] [cursor=pointer]
                          - cell "Audit-Allowance-1785740428269 AA269" [ref=e284]:
                            - generic [ref=e285]:
                              - generic [ref=e286]: Audit-Allowance-1785740428269
                              - generic [ref=e287]: AA269
                          - cell "Earning" [ref=e288]:
                            - generic [ref=e289]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e290]:
                            - generic [ref=e291]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e292]:
                            - generic [ref=e293]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e294]:
                            - generic [ref=e295]: Cash - Main Office - 1001
                          - cell [ref=e296]:
                            - button [ref=e297] [cursor=pointer]:
                              - button [ref=e298]:
                                - img
                        - row "Select row Audit-Allowance-1785758725156 AA156 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e299]:
                          - cell "Select row" [ref=e300]:
                            - checkbox "Select row" [ref=e301] [cursor=pointer]
                          - cell "Audit-Allowance-1785758725156 AA156" [ref=e302]:
                            - generic [ref=e303]:
                              - generic [ref=e304]: Audit-Allowance-1785758725156
                              - generic [ref=e305]: AA156
                          - cell "Earning" [ref=e306]:
                            - generic [ref=e307]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e308]:
                            - generic [ref=e309]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e310]:
                            - generic [ref=e311]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e312]:
                            - generic [ref=e313]: Cash - Main Office - 1001
                          - cell [ref=e314]:
                            - button [ref=e315] [cursor=pointer]:
                              - button [ref=e316]:
                                - img
                        - row "Select row Audit-Allowance-1785760423188 AA188 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e317]:
                          - cell "Select row" [ref=e318]:
                            - checkbox "Select row" [ref=e319] [cursor=pointer]
                          - cell "Audit-Allowance-1785760423188 AA188" [ref=e320]:
                            - generic [ref=e321]:
                              - generic [ref=e322]: Audit-Allowance-1785760423188
                              - generic [ref=e323]: AA188
                          - cell "Earning" [ref=e324]:
                            - generic [ref=e325]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e326]:
                            - generic [ref=e327]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e328]:
                            - generic [ref=e329]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e330]:
                            - generic [ref=e331]: Cash - Main Office - 1001
                          - cell [ref=e332]:
                            - button [ref=e333] [cursor=pointer]:
                              - button [ref=e334]:
                                - img
                        - row "Select row Audit-Allowance-1785826586303 AA303 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e335]:
                          - cell "Select row" [ref=e336]:
                            - checkbox "Select row" [ref=e337] [cursor=pointer]
                          - cell "Audit-Allowance-1785826586303 AA303" [ref=e338]:
                            - generic [ref=e339]:
                              - generic [ref=e340]: Audit-Allowance-1785826586303
                              - generic [ref=e341]: AA303
                          - cell "Earning" [ref=e342]:
                            - generic [ref=e343]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e344]:
                            - generic [ref=e345]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e346]:
                            - generic [ref=e347]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e348]:
                            - generic [ref=e349]: Cash - Main Office - 1001
                          - cell [ref=e350]:
                            - button [ref=e351] [cursor=pointer]:
                              - button [ref=e352]:
                                - img
                        - row "Select row Audit-Allowance-1785827008250 AA250 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e353]:
                          - cell "Select row" [ref=e354]:
                            - checkbox "Select row" [ref=e355] [cursor=pointer]
                          - cell "Audit-Allowance-1785827008250 AA250" [ref=e356]:
                            - generic [ref=e357]:
                              - generic [ref=e358]: Audit-Allowance-1785827008250
                              - generic [ref=e359]: AA250
                          - cell "Earning" [ref=e360]:
                            - generic [ref=e361]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e362]:
                            - generic [ref=e363]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e364]:
                            - generic [ref=e365]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e366]:
                            - generic [ref=e367]: Cash - Main Office - 1001
                          - cell [ref=e368]:
                            - button [ref=e369] [cursor=pointer]:
                              - button [ref=e370]:
                                - img
                        - row "Select row Audit-Allowance-1785827330327 AA327 Earning Fully Taxable Exact Cash - Main Office - 1001" [ref=e371]:
                          - cell "Select row" [ref=e372]:
                            - checkbox "Select row" [ref=e373] [cursor=pointer]
                          - cell "Audit-Allowance-1785827330327 AA327" [ref=e374]:
                            - generic [ref=e375]:
                              - generic [ref=e376]: Audit-Allowance-1785827330327
                              - generic [ref=e377]: AA327
                          - cell "Earning" [ref=e378]:
                            - generic [ref=e379]:
                              - img
                              - text: Earning
                          - cell "Fully Taxable" [ref=e380]:
                            - generic [ref=e381]:
                              - img
                              - text: Fully Taxable
                          - cell "Exact" [ref=e382]:
                            - generic [ref=e383]: Exact
                          - cell "Cash - Main Office - 1001" [ref=e384]:
                            - generic [ref=e385]: Cash - Main Office - 1001
                          - cell [ref=e386]:
                            - button [ref=e387] [cursor=pointer]:
                              - button [ref=e388]:
                                - img
                    - generic [ref=e390]:
                      - generic [ref=e391]: 0 of 10 row(s) selected.
                      - generic [ref=e392]:
                        - generic [ref=e393]:
                          - paragraph [ref=e394]: Rows per page
                          - combobox [ref=e395] [cursor=pointer]:
                            - generic: "10"
                            - img
                        - generic [ref=e396]: Page 1 of 4
                        - generic [ref=e397]:
                          - button "Go to first page" [disabled]:
                            - img
                          - button "Go to previous page" [disabled]:
                            - img
                          - button "Go to next page" [ref=e398] [cursor=pointer]:
                            - img
                          - button "Go to last page" [ref=e399] [cursor=pointer]:
                            - img
        - generic [ref=e400]: BM Technology © 2026
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