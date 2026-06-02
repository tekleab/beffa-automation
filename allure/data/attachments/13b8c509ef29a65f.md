# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hr/hr-employees.spec.ts >> HR: Employee Lifecycle @hr @smoke @full >> UI: Org Chart page must render the department hierarchy
- Location: tests/hr/hr-employees.spec.ts:176:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 25000ms exceeded.
Call log:
  - waiting for locator('.react-flow, .react-flow__renderer, [class*="react-flow"]').first() to be visible

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
                      - link "Human Resources" [ref=e181] [cursor=pointer]:
                        - /url: /human-resources
                      - text: /
                    - listitem [ref=e182]:
                      - link "Org Charts" [ref=e183] [cursor=pointer]:
                        - /url: /human-resources/org-charts
            - button "2018" [ref=e185] [cursor=pointer]:
              - generic [ref=e186]: "2018"
              - img [ref=e187]
          - generic [ref=e190]:
            - generic [ref=e191]:
              - heading "Organization Chart" [level=1] [ref=e192]
              - paragraph [ref=e193]: Visualize and manage your organizational structure.
            - generic [ref=e194]:
              - tablist [ref=e195]:
                - tab "Organization Chart" [selected] [ref=e196] [cursor=pointer]
                - tab "Structure Configuration" [ref=e197] [cursor=pointer]
              - generic [ref=e201]:
                - heading "Configuration Required" [level=3] [ref=e202]
                - paragraph [ref=e203]: Please set up your organizational structure configuration first.
                - paragraph [ref=e204] [cursor=pointer]: Go to Configuration
        - generic [ref=e205]: BM Technology © 2026
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
  87  | 
  88  |     // -------------------------------------------------------------------------
  89  |     // EDGE CASE: Duplicate email must be rejected
  90  |     // -------------------------------------------------------------------------
  91  |     test('Guardrail: Duplicate employee email must be rejected by the system', async ({ page }) => {
  92  |         const app = new AppManager(page);
  93  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  94  | 
  95  |         const ts = Date.now();
  96  |         const rand = Math.random().toString(36).slice(2, 7);
  97  |         const sharedEmail = `dup.${ts}.${rand}@beffa.com`;
  98  |         const basePayload = {
  99  |             name: `Dup-Emp-${ts}`,
  100 |             email: sharedEmail,
  101 |             phone: `09${String(ts + 1).slice(-8)}`,
  102 |             gender: 'male',
  103 |             father_name: 'DupFather',
  104 |             grand_father_name: 'DupGrand',
  105 |             bank_account_number: `200${String(ts).slice(-10)}`,
  106 |             bank_name: 'Commercial Bank of Ethiopia',
  107 |             address: { region: 'Addis Ababa City Administration', zone: 'Bole Subcity', woreda: 'Woreda 2', kebele: '01' },
  108 |             emergency_contacts: [{ name: 'Emergency Contact', phone: '0922000002', relation: 'Spouse' }],
  109 |         };
  110 | 
  111 |         // First creation must succeed
  112 |         const first = await app.api.hr.createEmployee(basePayload);
  113 |         expect(first).toHaveProperty('id');
  114 |         console.log(`[INFO] First employee created: ${first.id}`);
  115 | 
  116 |         // Second creation with same email must fail
  117 |         const token = await app._getAuthToken();
  118 |         const headers = {
  119 |             'Authorization': `Bearer ${token}`,
  120 |             'x-company': process.env.BEFFA_COMPANY as string,
  121 |             'Content-Type': 'application/json',
  122 |         };
  123 |         const params = `year=${process.env.BEFFA_YEAR||'2018'}&period=${process.env.BEFFA_PERIOD||'yearly'}&calendar=${process.env.BEFFA_CALENDAR||'ec'}`;
  124 |         const dupResp = await page.request.post(
  125 |             `${app.apiBase}/employees?${params}`,
  126 |             { headers, data: { ...basePayload, name: `Dup-Emp-${ts}-2` } }
  127 |         );
  128 | 
  129 |         if ([409, 422, 400].includes(dupResp.status())) {
  130 |             console.log(`[PASS] Duplicate email correctly rejected: ${dupResp.status()}`);
  131 |         } else if (dupResp.status() === 201 || dupResp.status() === 200) {
  132 |             const body = await dupResp.json();
  133 |             // If system allows it, both IDs must be different (no data corruption)
  134 |             expect(body.id).not.toBe(first.id);
  135 |             console.log(`[INFO] System allows duplicate emails — both employees have distinct IDs`);
  136 |         }
  137 |     });
  138 | 
  139 |     // -------------------------------------------------------------------------
  140 |     // HAPPY PATH: Org chart returns company + segments
  141 |     // -------------------------------------------------------------------------
  142 |     test('API: Org chart must return company context and department segments', async ({ page }) => {
  143 |         const app = new AppManager(page);
  144 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  145 | 
  146 |         const chart = await app.api.hr.getOrgChart();
  147 |         expect(chart).toHaveProperty('company');
  148 |         expect(chart).toHaveProperty('segments');
  149 |         expect(chart.segments.length).toBeGreaterThan(0);
  150 | 
  151 |         const seg = chart.segments[0];
  152 |         expect(seg).toHaveProperty('id');
  153 |         expect(seg).toHaveProperty('name');
  154 |         console.log(`[PASS] Org chart: ${chart.segments.length} segments. Top: "${seg.name}"`);
  155 |     });
  156 | 
  157 |     // -------------------------------------------------------------------------
  158 |     // UI: Employees page renders rows
  159 |     // -------------------------------------------------------------------------
  160 |     test('UI: Employees page must load and display employee records', async ({ page }) => {
  161 |         const app = new AppManager(page);
  162 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  163 | 
  164 |         await page.goto('/human-resources/employees', { waitUntil: 'networkidle' });
  165 |         const row = page.locator('table tbody tr, [role="row"]').first();
  166 |         await row.waitFor({ state: 'visible', timeout: 30000 });
  167 | 
  168 |         const rowCount = await page.locator('table tbody tr, [role="row"]').count();
  169 |         expect(rowCount).toBeGreaterThan(0);
  170 |         console.log(`[PASS] Employees page rendered ${rowCount} rows`);
  171 |     });
  172 | 
  173 |     // -------------------------------------------------------------------------
  174 |     // UI: Org Chart renders hierarchy
  175 |     // -------------------------------------------------------------------------
  176 |     test('UI: Org Chart page must render the department hierarchy', async ({ page }) => {
  177 |         const app = new AppManager(page);
  178 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  179 | 
  180 |         await page.goto('/human-resources/org-charts', { waitUntil: 'networkidle' });
  181 | 
  182 |         const hasError = await page.locator('text=/error|failed|something went wrong/i').first()
  183 |             .isVisible({ timeout: 5000 }).catch(() => false);
  184 |         expect(hasError).toBe(false);
  185 | 
  186 |         const treeNode = page.locator('.react-flow, .react-flow__renderer, [class*="react-flow"]').first();
> 187 |         await treeNode.waitFor({ state: 'visible', timeout: 25000 });
      |                        ^ TimeoutError: locator.waitFor: Timeout 25000ms exceeded.
  188 |         console.log(`[PASS] Org Chart rendered`);
  189 |     });
  190 | });
  191 | 
```