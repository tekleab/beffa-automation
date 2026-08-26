# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/project-ui-form.spec.ts >> Project Management: UI Form @project @ui @smoke @regression @full >> UI-GUARD-01: "Create project" submit button is disabled on empty form
- Location: tests/project/project-ui-form.spec.ts:96:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button[type="submit"]').filter({ hasText: /Create project/i })
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for locator('button[type="submit"]').filter({ hasText: /Create project/i })

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
                      - link "Project Management" [ref=e181] [cursor=pointer]:
                        - /url: /project-management
                      - text: /
                    - listitem [ref=e182]:
                      - link "Projects" [ref=e183] [cursor=pointer]:
                        - /url: /project-management/projects
                      - text: /
                    - listitem [ref=e184]:
                      - link "Add" [ref=e185] [cursor=pointer]:
                        - /url: /project-management/projects/new
            - button "2019" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2019"
              - img [ref=e189]
          - generic [ref=e192]:
            - generic [ref=e197]:
              - toolbar [ref=e198]:
                - generic [ref=e199]:
                  - textbox "Search names..." [ref=e200]
                  - link "Reset filters" [ref=e201] [cursor=pointer]:
                    - /url: /project-management/projects/new
                    - button "Reset filters" [ref=e202]:
                      - img
              - table [ref=e205]:
                - rowgroup
                - rowgroup [ref=e206]:
                  - row "E2E-Project-1787752723253-1037 PROJ-1071 0.00 BRR" [ref=e207] [cursor=pointer]:
                    - cell "E2E-Project-1787752723253-1037 PROJ-1071" [ref=e208]:
                      - generic [ref=e209]:
                        - generic [ref=e210]: E2E-Project-1787752723253-1037
                        - generic [ref=e211]: PROJ-1071
                    - cell "0.00 BRR" [ref=e212]:
                      - generic [ref=e215]:
                        - paragraph [ref=e216]: "0.00"
                        - separator [ref=e217]
                        - paragraph [ref=e218]: BRR
                  - row "E2E-Project-1787752723195-1165 PROJ-1070 0.00 BRR" [ref=e219] [cursor=pointer]:
                    - cell "E2E-Project-1787752723195-1165 PROJ-1070" [ref=e220]:
                      - generic [ref=e221]:
                        - generic [ref=e222]: E2E-Project-1787752723195-1165
                        - generic [ref=e223]: PROJ-1070
                    - cell "0.00 BRR" [ref=e224]:
                      - generic [ref=e227]:
                        - paragraph [ref=e228]: "0.00"
                        - separator [ref=e229]
                        - paragraph [ref=e230]: BRR
                  - row "Guardrail-Base-1787752717368-4061 PROJ-1069 0.00 BRR" [ref=e231] [cursor=pointer]:
                    - cell "Guardrail-Base-1787752717368-4061 PROJ-1069" [ref=e232]:
                      - generic [ref=e233]:
                        - generic [ref=e234]: Guardrail-Base-1787752717368-4061
                        - generic [ref=e235]: PROJ-1069
                    - cell "0.00 BRR" [ref=e236]:
                      - generic [ref=e239]:
                        - paragraph [ref=e240]: "0.00"
                        - separator [ref=e241]
                        - paragraph [ref=e242]: BRR
                  - row "E2E-Project-1787752717108-8795 PROJ-1068 0.00 BRR" [ref=e243] [cursor=pointer]:
                    - cell "E2E-Project-1787752717108-8795 PROJ-1068" [ref=e244]:
                      - generic [ref=e245]:
                        - generic [ref=e246]: E2E-Project-1787752717108-8795
                        - generic [ref=e247]: PROJ-1068
                    - cell "0.00 BRR" [ref=e248]:
                      - generic [ref=e251]:
                        - paragraph [ref=e252]: "0.00"
                        - separator [ref=e253]
                        - paragraph [ref=e254]: BRR
                  - row "Guardrail-Base-1787752711393-2946-392876-19115 PROJ-1067 0.00 BRR" [ref=e255] [cursor=pointer]:
                    - cell "Guardrail-Base-1787752711393-2946-392876-19115 PROJ-1067" [ref=e256]:
                      - generic [ref=e257]:
                        - generic [ref=e258]: Guardrail-Base-1787752711393-2946-392876-19115
                        - generic [ref=e259]: PROJ-1067
                    - cell "0.00 BRR" [ref=e260]:
                      - generic [ref=e263]:
                        - paragraph [ref=e264]: "0.00"
                        - separator [ref=e265]
                        - paragraph [ref=e266]: BRR
                  - row "Guardrail-Base-1787752711363-1421 PROJ-1066 0.00 BRR" [ref=e267] [cursor=pointer]:
                    - cell "Guardrail-Base-1787752711363-1421 PROJ-1066" [ref=e268]:
                      - generic [ref=e269]:
                        - generic [ref=e270]: Guardrail-Base-1787752711363-1421
                        - generic [ref=e271]: PROJ-1066
                    - cell "0.00 BRR" [ref=e272]:
                      - generic [ref=e275]:
                        - paragraph [ref=e276]: "0.00"
                        - separator [ref=e277]
                        - paragraph [ref=e278]: BRR
                  - row "E2E-Project-1787752697981-774624-923460-629917-12762 PROJ-1065 0.00 BRR" [ref=e279] [cursor=pointer]:
                    - cell "E2E-Project-1787752697981-774624-923460-629917-12762 PROJ-1065" [ref=e280]:
                      - generic [ref=e281]:
                        - generic [ref=e282]: E2E-Project-1787752697981-774624-923460-629917-12762
                        - generic [ref=e283]: PROJ-1065
                    - cell "0.00 BRR" [ref=e284]:
                      - generic [ref=e287]:
                        - paragraph [ref=e288]: "0.00"
                        - separator [ref=e289]
                        - paragraph [ref=e290]: BRR
                  - row "E2E-Project-1787752697994-548011-642785 PROJ-1064 0.00 BRR" [ref=e291] [cursor=pointer]:
                    - cell "E2E-Project-1787752697994-548011-642785 PROJ-1064" [ref=e292]:
                      - generic [ref=e293]:
                        - generic [ref=e294]: E2E-Project-1787752697994-548011-642785
                        - generic [ref=e295]: PROJ-1064
                    - cell "0.00 BRR" [ref=e296]:
                      - generic [ref=e299]:
                        - paragraph [ref=e300]: "0.00"
                        - separator [ref=e301]
                        - paragraph [ref=e302]: BRR
                  - row "E2E-Project-1787752697966-030692-337126 PROJ-1063 0.00 BRR" [ref=e303] [cursor=pointer]:
                    - cell "E2E-Project-1787752697966-030692-337126 PROJ-1063" [ref=e304]:
                      - generic [ref=e305]:
                        - generic [ref=e306]: E2E-Project-1787752697966-030692-337126
                        - generic [ref=e307]: PROJ-1063
                    - cell "0.00 BRR" [ref=e308]:
                      - generic [ref=e311]:
                        - paragraph [ref=e312]: "0.00"
                        - separator [ref=e313]
                        - paragraph [ref=e314]: BRR
                  - row "E2E-Project-1787752694802-087430-654690 PROJ-1062 0.00 BRR" [ref=e315] [cursor=pointer]:
                    - cell "E2E-Project-1787752694802-087430-654690 PROJ-1062" [ref=e316]:
                      - generic [ref=e317]:
                        - generic [ref=e318]: E2E-Project-1787752694802-087430-654690
                        - generic [ref=e319]: PROJ-1062
                    - cell "0.00 BRR" [ref=e320]:
                      - generic [ref=e323]:
                        - paragraph [ref=e324]: "0.00"
                        - separator [ref=e325]
                        - paragraph [ref=e326]: BRR
              - generic [ref=e329]:
                - combobox [ref=e331] [cursor=pointer]:
                  - generic: "10"
                  - img
                - generic [ref=e332]:
                  - button "Go to first page" [disabled]:
                    - img
                  - button "Go to previous page" [disabled]:
                    - img
                  - button "Go to next page" [ref=e333] [cursor=pointer]:
                    - img
                  - button "Go to last page" [ref=e334] [cursor=pointer]:
                    - img
            - main [ref=e335]:
              - button "Toggle Sidebar" [ref=e338] [cursor=pointer]:
                - img
                - generic [ref=e339]: Toggle Sidebar
              - generic [ref=e342]:
                - paragraph [ref=e344]: Add Project
                - generic [ref=e350]:
                  - generic [ref=e351]:
                    - generic [ref=e353]:
                      - heading "Project Information" [level=2] [ref=e355]
                      - generic [ref=e357]:
                        - group [ref=e358]:
                          - generic [ref=e359]: Project ID *
                          - textbox "Project ID *" [ref=e360]
                        - group [ref=e361]:
                          - generic [ref=e362]: Project Name *
                          - textbox "Project Name *" [ref=e363]
                        - group [ref=e364]:
                          - group [ref=e365]:
                            - generic [ref=e366]: Project Owner Customer *
                            - button "Project Owner Customer * selector" [ref=e367]: Select a project owner customer
                        - group [ref=e368]:
                          - group [ref=e369]:
                            - generic [ref=e370]: Project Workspace *
                            - button "Project Workspace * selector" [ref=e371]: Select a project workspace
                        - group [ref=e372]:
                          - generic [ref=e373]: Description
                          - textbox "Description" [ref=e374]
                    - generic [ref=e376]:
                      - heading "Status & Settings" [level=2] [ref=e378]
                      - generic [ref=e380]:
                        - group [ref=e381]:
                          - generic [ref=e382]: Project Status *
                          - generic [ref=e383]:
                            - combobox "Project Status *" [ref=e384]:
                              - option "Pending" [selected]
                              - option "In Progress"
                              - option "On Hold"
                              - option "Completed"
                            - generic:
                              - img
                        - group [ref=e385]:
                          - generic [ref=e386]: Percent Completed *
                          - spinbutton "Percent Completed *" [ref=e387]: "0"
                        - group [ref=e388]:
                          - generic [ref=e389]: Completion Method *
                          - generic [ref=e390]:
                            - combobox "Completion Method *" [ref=e391]:
                              - option "Manual" [selected]
                              - option "Task Completion"
                              - option "Task Progress"
                              - option "Task Weight"
                            - generic:
                              - img
                        - group [ref=e392]:
                          - generic [ref=e393]: Is Active
                          - checkbox "Is Active" [checked] [ref=e395]
                    - generic [ref=e399]:
                      - heading "Timeline" [level=2] [ref=e401]
                      - generic [ref=e403]:
                        - group [ref=e404]:
                          - generic [ref=e405]: Project Start date
                          - generic [ref=e406]:
                            - textbox "Project Start date" [ref=e407]:
                              - /placeholder: DD/MM/YYYY
                            - img [ref=e409]
                        - group [ref=e411]:
                          - generic [ref=e412]: Estimated End date
                          - generic [ref=e413]:
                            - textbox "Estimated End date" [ref=e414]:
                              - /placeholder: DD/MM/YYYY
                            - img [ref=e416]
                    - generic [ref=e419]:
                      - heading "Financial Information" [level=2] [ref=e421]
                      - generic [ref=e423]:
                        - group [ref=e424]:
                          - generic [ref=e425]: Job Opening Balance
                          - spinbutton "Job Opening Balance" [ref=e426]
                        - group [ref=e427]:
                          - generic [ref=e428]: Estimated Expense
                          - spinbutton "Estimated Expense" [ref=e429]
                        - group [ref=e430]:
                          - generic [ref=e431]: Estimated Revenue
                          - spinbutton "Estimated Revenue" [ref=e432]
                  - button "Create project" [disabled] [ref=e434]
        - generic [ref=e435]: BM Technology © 2026
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
  2   | import { AppManager } from '../../pages/AppManager';
  3   | 
  4   | /**
  5   |  * =============================================================================
  6   |  * MODULE: Project Management - UI Form & Submission Suite
  7   |  * ARCHITECTURAL SCOPE & COVERAGE:
  8   |  * 1. Add Project button navigates to /projects/new
  9   |  * 2. Form renders all required inputs (name, customer, dates, budget)
  10  |  * 3. Submit button disabled on empty form (error visibility guard)
  11  |  * =============================================================================
  12  |  */
  13  | 
  14  | 
  15  | /**
  16  |  * PROJECT UI FORM — Add Project Form Tests
  17  |  * Route: /project-management/projects/new
  18  |  *
  19  |  * Key selectors (from live probe):
  20  |  *   input#project_name          — Project Name *
  21  |  *   input#ref                   — Project ID *
  22  |  *   select#project_status       — Project Status *
  23  |  *   input#percent_complete      — Percent Completed *
  24  |  *   select#completion_method    — Completion Method *
  25  |  *   input#customer_id           — Project Owner Customer * (popover)
  26  |  *   input#workspace_id          — Project Workspace * (popover)
  27  |  *   input#estimated_revenue     — Estimated Revenue
  28  |  *   input#estimated_expense     — Estimated Expense
  29  |  *   input#project_start_date    — Project Start date (date)
  30  |  *   input#estimated_start_date  — Estimated End date (date, name="estimated_end_date")
  31  |  *   textarea#description        — Description
  32  |  *   input#is_active             — Is Active (checkbox)
  33  |  *   button[type="submit"] "Create project" — disabled=true until required fields filled
  34  |  */
  35  | test.describe('Project Management: UI Form @project @ui @smoke @regression @full', () => {
  36  | 
  37  |     async function setup(page: any) {
  38  |         const app = new AppManager(page);
  39  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  40  |         const meta = await app.api.project.discoverMetadataAPI();
  41  |         return { app, meta };
  42  |     }
  43  | 
  44  |     // ── UI: ADD PROJECT FORM ────────────────────────────────────────────────────
  45  | 
  46  |     test('UI-10: Add Project button navigates to /projects/new', async ({ page }) => {
  47  |         const { app } = await setup(page);
  48  |         await page.goto('/project-management/projects', { waitUntil: 'commit' });
  49  |         const addBtn = page.getByRole('link', { name: /Add Project/i })
  50  |             .or(page.getByRole('button', { name: /Add Project/i })).first();
  51  |         await addBtn.waitFor({ state: 'visible', timeout: 30000 });
  52  |         await addBtn.click();
  53  |         await page.waitForURL(url => url.href.includes('/projects/new'), { timeout: 15000 });
  54  |         expect(page.url()).toMatch(/\/projects\/new/);
  55  |     });
  56  | 
  57  |     test('UI-11: Add Project form has all required inputs', async ({ page }) => {
  58  |         const { app } = await setup(page);
  59  |         await page.goto('/project-management/projects/new', { waitUntil: 'commit' });
  60  |         // Text inputs & selects
  61  |         await expect(page.locator('input#project_name')).toBeVisible({ timeout: 30000 });
  62  |         await expect(page.locator('input#ref')).toBeVisible();
  63  |         await expect(page.locator('select#project_status')).toBeVisible();
  64  |         await expect(page.locator('input#percent_complete')).toBeVisible();
  65  |         await expect(page.locator('select#completion_method')).toBeVisible();
  66  |         // Customer & workspace use button triggers (input is hidden until triggered)
  67  |         await expect(page.locator('button#customer_id')).toBeVisible();
  68  |         await expect(page.locator('button#workspace_id')).toBeVisible();
  69  |     });
  70  | 
  71  |     // TODO: UI-POM-10 — Project UI form creation via POM is blocked.
  72  |     // Root cause: Chakra UI popover fields (customer, workspace) update display text only.
  73  |     // React internal state does not reflect the selection in DOM input values, so the
  74  |     // "Create project" submit button remains disabled. Pending network payload intercept
  75  |     // to identify the exact React state mutation mechanism.
  76  |     //
  77  |     // test('UI-POM-10: Create and verify project entirely through the UI form using POM', async ({ page }) => {
  78  |     //     const { app, meta } = await setup(page);
  79  |     //     const projectName = `E2E-UI-POM-${Date.now()}`;
  80  |     //     await app.ui.project.navigateToProjects();
  81  |     //     await app.ui.project.clickAddProject();
  82  |     //     await app.ui.project.fillProjectForm({
  83  |     //         name: projectName,
  84  |     //         customerName: meta.customerName,
  85  |     //         workspaceName: meta.workspaceName,
  86  |     //         estimatedRevenue: 150000,
  87  |     //         estimatedExpense: 60000
  88  |     //     });
  89  |     //     await app.ui.project.clickSave();
  90  |     //     await app.ui.project.navigateToProjects();
  91  |     //     await app.ui.project.verifyInList(projectName);
  92  |     // });
  93  | 
  94  |     // ── UI GUARDRAILS ──────────────────────────────────────────────────────────
  95  | 
  96  |     test('UI-GUARD-01: "Create project" submit button is disabled on empty form', async ({ page }) => {
  97  |         const { app } = await setup(page);
  98  |         await page.goto('/project-management/projects/new', { waitUntil: 'commit' });
  99  | 
  100 |         // Probe confirmed: BTN[71] "Create project" type="submit" disabled=true on empty form
  101 |         const saveBtn = page.locator('button[type="submit"]').filter({ hasText: /Create project/i });
> 102 |         await expect(saveBtn).toBeVisible({ timeout: 8000 });
      |                               ^ Error: expect(locator).toBeVisible() failed
  103 |         await expect(saveBtn).toBeDisabled();
  104 |     });
  105 | });
  106 | 
```