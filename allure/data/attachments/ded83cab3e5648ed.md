# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hr/hr-attendance.spec.ts >> HR: Timesheets & Attendances @hr @smoke >> UI: Attendances page must load and render the attendance module
- Location: tests/hr/hr-attendance.spec.ts:114:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 20000ms exceeded.
Call log:
  - waiting for locator('table, [role="table"], h1, h2, [role="heading"], .chakra-text').first() to be visible
    35 × locator resolved to hidden <p class="chakra-text css-wjomy9">Notifications</p>

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6]:
    - generic [ref=e9]:
      - generic [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - button "BEFA ABC Trading IT Administrator / User Manager" [ref=e13] [cursor=pointer]:
              - img "BEFA" [ref=e15]
              - generic [ref=e16]:
                - generic [ref=e17]: ABC Trading
                - generic [ref=e18]: IT Administrator / User Manager
        - textbox "Search navigation..." [ref=e23]
      - generic [ref=e25]:
        - list [ref=e27]:
          - listitem [ref=e28]:
            - link "Dashboard" [ref=e29] [cursor=pointer]:
              - /url: /dashboard
        - list [ref=e38]:
          - listitem [ref=e39]:
            - button "Accounting" [ref=e40] [cursor=pointer]
        - list [ref=e48]:
          - listitem [ref=e49]:
            - button "Account Reconciliation" [ref=e50] [cursor=pointer]
        - list [ref=e58]:
          - listitem [ref=e59]:
            - button "CRM" [ref=e60] [cursor=pointer]
        - list [ref=e70]:
          - listitem [ref=e71]:
            - button "HRM" [expanded] [ref=e72] [cursor=pointer]
            - list [ref=e83]:
              - listitem [ref=e84]:
                - button "Human Resources" [expanded] [ref=e85] [cursor=pointer]
                - list [ref=e96]:
                  - listitem [ref=e97]:
                    - link "Organization Chart" [ref=e98] [cursor=pointer]:
                      - /url: /human-resources/org-charts
                  - listitem [ref=e104]:
                    - link "Employees" [ref=e105] [cursor=pointer]:
                      - /url: /human-resources/employees
                  - listitem [ref=e111]:
                    - link "Timesheets" [ref=e112] [cursor=pointer]:
                      - /url: /human-resources/timesheets
                  - listitem [ref=e118]:
                    - link "Attendances" [ref=e119] [cursor=pointer]:
                      - /url: /human-resources/attendances
                  - listitem [ref=e126]:
                    - link "Leaves" [ref=e127] [cursor=pointer]:
                      - /url: /human-resources/leave
              - listitem [ref=e133]:
                - button "Payrolls" [ref=e134] [cursor=pointer]
        - list [ref=e142]:
          - listitem [ref=e143]:
            - button "Project" [ref=e144] [cursor=pointer]
        - list [ref=e152]:
          - listitem [ref=e153]:
            - button "SCM" [ref=e154] [cursor=pointer]
        - list [ref=e163]:
          - listitem [ref=e164]:
            - button "Lease" [ref=e165] [cursor=pointer]
        - list [ref=e173]:
          - listitem [ref=e174]:
            - button "Services" [ref=e175] [cursor=pointer]
        - list [ref=e182]:
          - listitem [ref=e183]:
            - button "Reports" [ref=e184] [cursor=pointer]
        - list [ref=e192]:
          - listitem [ref=e193]:
            - button "Administration" [ref=e194] [cursor=pointer]
      - list [ref=e202]:
        - listitem [ref=e203]:
          - button "SA System Admin IT Administrator / User Manager" [ref=e204] [cursor=pointer]:
            - generic [ref=e205]: SA
            - generic [ref=e207]:
              - generic [ref=e208]: System Admin
              - generic [ref=e209]: IT Administrator / User Manager
    - main [ref=e213]:
      - generic [ref=e214]:
        - button "Toggle Sidebar" [ref=e216] [cursor=pointer]
        - generic [ref=e220]:
          - button "New" [ref=e221] [cursor=pointer]
          - button "Notifications" [ref=e228] [cursor=pointer]:
            - generic [ref=e232]: "5"
          - generic "Switch Calendar Era" [ref=e233]:
            - button "EC" [ref=e237] [cursor=pointer]
            - generic [ref=e238]: "|"
            - button "GC" [ref=e239] [cursor=pointer]
          - button "Change Language" [ref=e240] [cursor=pointer]:
            - generic [ref=e244]: EN
          - button "S System Admin IT Administrator / User Manager" [ref=e248] [cursor=pointer]:
            - generic [ref=e249]: S
            - generic [ref=e251]:
              - generic [ref=e252]: System Admin
              - generic [ref=e253]: IT Administrator / User Manager
      - main [ref=e256]:
        - generic [ref=e258]:
          - generic [ref=e259]:
            - navigation "breadcrumb" [ref=e260]:
              - list [ref=e261]:
                - navigation "breadcrumb" [ref=e262]:
                  - list [ref=e263]:
                    - listitem [ref=e264]:
                      - link "Home" [ref=e265] [cursor=pointer]:
                        - /url: /
                      - text: /
                    - listitem [ref=e266]:
                      - link "Human Resources" [ref=e267] [cursor=pointer]:
                        - /url: /human-resources
                      - text: /
                    - listitem [ref=e268]:
                      - link "Attendances" [ref=e269] [cursor=pointer]:
                        - /url: /human-resources/attendances
            - button "2019" [ref=e271] [cursor=pointer]
          - generic [ref=e277]:
            - generic [ref=e278]:
              - generic [ref=e279]:
                - heading "Attendance Report" [level=1] [ref=e280]
                - paragraph [ref=e281]: Detailed attendance summary for all employees.
              - button [ref=e283] [cursor=pointer]:
                - button "Export Data Export Data" [ref=e284]:
                  - text: Export Data
                  - generic [ref=e289]: Export Data
            - generic [ref=e290]:
              - generic [ref=e291]:
                - generic [ref=e292]: Period
                - generic [ref=e296]:
                  - generic [ref=e297]: መስከ 21 - መስከ 27, 2019
                  - generic [ref=e298]:
                    - paragraph [ref=e299]: Viewing 7 days
                    - generic [ref=e300]:
                      - button [disabled]
                      - button [ref=e301] [cursor=pointer]
              - generic [ref=e302]:
                - generic [ref=e303]: Total Present Days
                - generic [ref=e310]:
                  - generic [ref=e311]: "0"
                  - paragraph [ref=e312]: Across 0 employees
              - generic [ref=e313]:
                - generic [ref=e314]: Total Absent Days
                - generic [ref=e321]:
                  - generic [ref=e322]: "0"
                  - paragraph [ref=e323]: Across 0 employees
              - generic [ref=e324]:
                - generic [ref=e325]: Total Days on Leave
                - generic [ref=e329]:
                  - generic [ref=e330]: "0"
                  - paragraph [ref=e331]: Across 0 employees
            - table [ref=e335]:
              - rowgroup [ref=e336]:
                - row [ref=e337]:
                  - columnheader "Employee" [ref=e338]
                  - columnheader "Present" [ref=e339]
                  - columnheader "Absent" [ref=e340]
                  - columnheader "Leave" [ref=e341]
                  - columnheader "Total Hours" [ref=e342]
                  - columnheader "ሐሙስ 21" [ref=e343]:
                    - generic [ref=e344]: ሐሙስ
                    - generic [ref=e345]: "21"
                  - columnheader "ዓርብ 22" [ref=e346]:
                    - generic [ref=e347]: ዓርብ
                    - generic [ref=e348]: "22"
                  - columnheader "ቅዳሜ 23" [ref=e349]:
                    - generic [ref=e350]: ቅዳሜ
                    - generic [ref=e351]: "23"
                  - columnheader "እሑድ 24" [ref=e352]:
                    - generic [ref=e353]: እሑድ
                    - generic [ref=e354]: "24"
                  - columnheader "ሰኞ 25" [ref=e355]:
                    - generic [ref=e356]: ሰኞ
                    - generic [ref=e357]: "25"
                  - columnheader "ማክሰኞ 26" [ref=e358]:
                    - generic [ref=e359]: ማክሰኞ
                    - generic [ref=e360]: "26"
                  - columnheader "ረቡዕ 27" [ref=e361]:
                    - generic [ref=e362]: ረቡዕ
                    - generic [ref=e363]: "27"
              - rowgroup
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
  26  |     // -------------------------------------------------------------------------
  27  |     test('API: Timesheet must be created and advanced through approval', async ({ page }) => {
  28  |         const app = new AppManager(page);
  29  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  30  | 
  31  | 
  32  |         const meta = await app.api.hr.discoverMetadataAPI();
  33  |         if (!meta) { console.log('[SKIP] HR org structure not configured'); return; }
  34  |         // Unique date per run — avoids 409 duplicate conflict
  35  |         const randomDays = Math.floor(Math.random() * 3000) + 100;
  36  |         const date = new Date(Date.now() + randomDays * 86400000).toISOString().split('T')[0] + 'T00:00:00Z';
  37  | 
  38  |         console.log(`[STEP 1] Creating timesheet | employee: ${meta.employeeId} | date: ${date}`);
  39  |         const ts = await app.api.hr.createTimesheet(meta.employeeId, date, 8, 'Audit Timesheet Entry');
  40  | 
  41  |         expect(ts).toHaveProperty('id');
  42  |         expect(ts.employee_id).toBe(meta.employeeId);
  43  |         console.log(`[SUCCESS] Timesheet created: ${ts.id} | status: ${ts.status}`);
  44  | 
  45  |         console.log(`[STEP 2] Advancing timesheet through approval...`);
  46  |         await app.advanceDocumentAPI(ts.id, 'timesheets');
  47  |         console.log(`[PASS] Timesheet approval flow complete`);
  48  |     });
  49  | 
  50  |     // -------------------------------------------------------------------------
  51  |     // EDGE CASE: Duplicate date must return 409
  52  |     // -------------------------------------------------------------------------
  53  |     test('Guardrail: Duplicate timesheet for same employee+date must be rejected', async ({ page }) => {
  54  |         const app = new AppManager(page);
  55  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  56  | 
  57  |         const meta = await app.api.hr.discoverMetadataAPI();
  58  |         if (!meta) { console.log("[SKIP] HR org structure not configured"); return; }
  59  | 
  60  |         // Unique dynamic future date per run to guarantee clean state
  61  |         const randomDays = Math.floor(Math.random() * 5000) + 500;
  62  |         const date = new Date(Date.now() + randomDays * 86400000).toISOString().split('T')[0] + 'T00:00:00Z';
  63  | 
  64  |         // First creation
  65  |         try {
  66  |             const first = await app.api.hr.createTimesheet(meta.employeeId, date, 8, 'First Entry');
  67  |             console.log(`[INFO] First timesheet created: ${first.id || first.data?.id}`);
  68  |         } catch (e: any) {
  69  |             console.log(`[INFO] First timesheet creation attempt note: ${e.message}`);
  70  |         }
  71  | 
  72  |         // Second creation on same employee+date must be rejected with 409
  73  |         const { apiBase, headers, qs } = await app.buildApiContext();
  74  |         const dupResp = await page.request.post(
  75  |             `${apiBase}/timesheets?${qs}`,
  76  |             { headers, data: { employee_id: meta.employeeId, date, hours: 8, description: 'Duplicate Entry' } }
  77  |         );
  78  | 
  79  |         console.log(`[INFO] Duplicate timesheet response: HTTP ${dupResp.status()}`);
  80  |         expect([409, 400, 422]).toContain(dupResp.status());
  81  |         if (dupResp.status() === 409) {
  82  |             const body = await dupResp.json().catch(() => ({}));
  83  |             if (body.message) {
  84  |                 expect(body.message).toMatch(/already exists|duplicate|conflict/i);
  85  |             }
  86  |         }
  87  |         console.log(`[PASS] Duplicate timesheet correctly rejected with HTTP ${dupResp.status()}`);
  88  |     });
  89  | 
  90  |     // -------------------------------------------------------------------------
  91  |     // UI: Timesheets page loads without error
  92  |     // -------------------------------------------------------------------------
  93  |     test('UI: Timesheets page must load and not show an error state', async ({ page }) => {
  94  |         const app = new AppManager(page);
  95  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  96  | 
  97  | 
  98  |         await page.goto('/human-resources/timesheets', { waitUntil: 'commit' });
  99  | 
  100 |         const hasError = await page.locator('text=/error|failed|something went wrong/i').first()
  101 |             .isVisible({ timeout: 5000 }).catch(() => false);
  102 |         expect(hasError).toBe(false);
  103 | 
  104 |         // Breadcrumb nav is present but may be clipped — verify via URL + any visible content
  105 |         expect(page.url()).toMatch(/timesheet/i);
  106 |         const content = page.locator('table, [role="table"], button, .chakra-text, a').first();
  107 |         await content.waitFor({ state: 'visible', timeout: 20000 });
  108 |         console.log(`[PASS] Timesheets page loaded without errors`);
  109 |     });
  110 | 
  111 |     // -------------------------------------------------------------------------
  112 |     // UI: Attendances page loads (no API route — UI-only module)
  113 |     // -------------------------------------------------------------------------
  114 |     test('UI: Attendances page must load and render the attendance module', async ({ page }) => {
  115 |         const app = new AppManager(page);
  116 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  117 | 
  118 | 
  119 |         await page.goto('/human-resources/attendances', { waitUntil: 'commit' });
  120 | 
  121 |         const hasError = await page.locator('text=/error|failed|something went wrong/i').first()
  122 |             .isVisible({ timeout: 5000 }).catch(() => false);
  123 |         expect(hasError).toBe(false);
  124 | 
  125 |         const content = page.locator('table, [role="table"], h1, h2, [role="heading"], .chakra-text').first();
> 126 |         await content.waitFor({ state: 'visible', timeout: 20000 });
      |                       ^ TimeoutError: locator.waitFor: Timeout 20000ms exceeded.
  127 |         console.log(`[PASS] Attendances page rendered without errors`);
  128 |     });
  129 | 
  130 |     // -------------------------------------------------------------------------
  131 |     // SECURITY & VALIDATION: Server response on Timesheet Creation with Invalid Employee ID
  132 |     // -------------------------------------------------------------------------
  133 |     test('Guardrail: Server must validate employee_id and return 422 (not 500 with SQL leak)', async ({ page }) => {
  134 |         const app = new AppManager(page);
  135 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  136 | 
  137 |         const INVALID_EMPLOYEE_ID = '00000000-dead-beef-0000-000000000000';
  138 |         const token = await app._getAuthToken();
  139 |         const headers = {
  140 |             'Authorization': `Bearer ${token}`,
  141 |             'x-company': process.env.BEFFA_COMPANY as string,
  142 |             'Content-Type': 'application/json',
  143 |         };
  144 |         const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  145 | 
  146 |         console.log(`[ATTACK] Submitting timesheet creation with non-existent employee ID: ${INVALID_EMPLOYEE_ID}...`);
  147 |         const response = await page.request.post(
  148 |             `${app.apiBase}/timesheets?${params}`,
  149 |             {
  150 |                 headers,
  151 |                 data: {
  152 |                     employee_id: INVALID_EMPLOYEE_ID,
  153 |                     date: '2026-09-03T00:00:00Z',
  154 |                     hours: 8,
  155 |                     description: 'Invalid Employee Security Probe'
  156 |                 }
  157 |             }
  158 |         );
  159 | 
  160 |         const status = response.status();
  161 |         const responseText = await response.text();
  162 | 
  163 |         console.log(`[RESPONSE] Status Code: ${status}`);
  164 |         console.log(`[RESPONSE] Body: ${responseText}`);
  165 | 
  166 |         // Check for raw SQL leaks
  167 |         const leaksRawSQL = /SQLSTATE|fk_employees_timesheets|violates foreign key constraint|insert or update on table/i.test(responseText);
  168 | 
  169 |         // Audit Table Output
  170 |         const W = { l: 36, v: 38 };
  171 |         const pad = (s: string, n: number) => s.length >= n ? s.substring(0, n - 1) + '…' : s.padEnd(n);
  172 |         const line = '─'.repeat(W.l + W.v + 7);
  173 | 
  174 |         console.log(`\n  ┌${line}┐`);
  175 |         console.log(`  │ ${pad('Invalid Employee Timesheet Validation Audit', W.l + W.v + 3)} │`);
  176 |         console.log(`  ├${line}┤`);
  177 |         console.log(`  │ ${pad('Tested Employee ID', W.l)} │ ${pad(INVALID_EMPLOYEE_ID, W.v)} │`);
  178 |         console.log(`  │ ${pad('Expected Status', W.l)} │ ${pad('422 Unprocessable Entity', W.v)} │`);
  179 |         console.log(`  │ ${pad('Actual HTTP Status', W.l)} │ ${pad(`${status} ${status === 500 ? '(INTERNAL SERVER ERROR)' : ''}`, W.v)} │`);
  180 |         console.log(`  │ ${pad('Exposes Raw SQL / FK Constraint', W.l)} │ ${pad(leaksRawSQL ? 'YES (SECURITY DEFECT)' : 'No (Clean Response)', W.v)} │`);
  181 |         console.log(`  ├${line}┤`);
  182 | 
  183 |         const isCompliant = status === 422 && !leaksRawSQL;
  184 |         const verdict = isCompliant ? 'PASS — Clean 422 Validation Error' : `FAIL — ${status === 500 ? 'HTTP 500 Unhandled Error' : 'Validation Defect'}`;
  185 | 
  186 |         console.log(`  │ ${pad('Result', W.l)} │ ${pad(verdict, W.v)} │`);
  187 |         console.log(`  └${line}┘\n`);
  188 | 
  189 |         if (status === 500 || leaksRawSQL) {
  190 |             throw new Error(
  191 |                 `[TIMESHEET_INVALID_EMPLOYEE_BUG] Server failed validation on invalid employee_id.\n` +
  192 |                 `  HTTP Status: ${status} (Expected: 422)\n` +
  193 |                 `  Raw SQL Exposed: ${leaksRawSQL}\n` +
  194 |                 `  Response Body: ${responseText}\n` +
  195 |                 `  Fix Required: Pre-validate employee_id exists before executing database INSERT to avoid SQLSTATE 23503 crash.`
  196 |             );
  197 |         }
  198 | 
  199 |         expect(status, 'Must return 422 Unprocessable Entity').toBe(422);
  200 |         expect(leaksRawSQL, 'Must not leak raw SQL / DB foreign key constraints').toBe(false);
  201 |     });
  202 | });
  203 | 
  204 | 
```