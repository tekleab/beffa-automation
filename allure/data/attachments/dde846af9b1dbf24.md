# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/project-ui-forms.spec.ts >> Project Management: UI Forms & Detail @project @ui @smoke @regression @full >> UI-GUARD-01: Add Project form blocks empty submit — keeps form open or shows error
- Location: tests/project/project-ui-forms.spec.ts:106:9

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /save|create|submit/i }).last()
    - locator resolved to <button disabled type="submit" class="chakra-button css-t9ddwj">Create project</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    147 × waiting for element to be visible, enabled and stable
        - element is not enabled
      - retrying click action
        - waiting 500ms

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
            - button "2018" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2018"
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
                  - row "E2E-Project-1780725665687-6486 PROJ-0076 0.00 BRR" [ref=e207] [cursor=pointer]:
                    - cell "E2E-Project-1780725665687-6486 PROJ-0076" [ref=e208]:
                      - generic [ref=e209]:
                        - generic [ref=e210]: E2E-Project-1780725665687-6486
                        - generic [ref=e211]: PROJ-0076
                    - cell "0.00 BRR" [ref=e212]:
                      - generic [ref=e215]:
                        - paragraph [ref=e216]: "0.00"
                        - separator [ref=e217]
                        - paragraph [ref=e218]: BRR
                  - row "E2E-Project-1780725631368-3165 PROJ-0075 0.00 BRR" [ref=e219] [cursor=pointer]:
                    - cell "E2E-Project-1780725631368-3165 PROJ-0075" [ref=e220]:
                      - generic [ref=e221]:
                        - generic [ref=e222]: E2E-Project-1780725631368-3165
                        - generic [ref=e223]: PROJ-0075
                    - cell "0.00 BRR" [ref=e224]:
                      - generic [ref=e227]:
                        - paragraph [ref=e228]: "0.00"
                        - separator [ref=e229]
                        - paragraph [ref=e230]: BRR
                  - row "E2E-Project-1780725628075-6191 PROJ-0074 0.00 BRR" [ref=e231] [cursor=pointer]:
                    - cell "E2E-Project-1780725628075-6191 PROJ-0074" [ref=e232]:
                      - generic [ref=e233]:
                        - generic [ref=e234]: E2E-Project-1780725628075-6191
                        - generic [ref=e235]: PROJ-0074
                    - cell "0.00 BRR" [ref=e236]:
                      - generic [ref=e239]:
                        - paragraph [ref=e240]: "0.00"
                        - separator [ref=e241]
                        - paragraph [ref=e242]: BRR
                  - row "Guardrail-Base-1780725624296-392 PROJ-0073 0.00 BRR" [ref=e243] [cursor=pointer]:
                    - cell "Guardrail-Base-1780725624296-392 PROJ-0073" [ref=e244]:
                      - generic [ref=e245]:
                        - generic [ref=e246]: Guardrail-Base-1780725624296-392
                        - generic [ref=e247]: PROJ-0073
                    - cell "0.00 BRR" [ref=e248]:
                      - generic [ref=e251]:
                        - paragraph [ref=e252]: "0.00"
                        - separator [ref=e253]
                        - paragraph [ref=e254]: BRR
                  - row "Guardrail-Base-1780725617132-7996 PROJ-0072 0.00 BRR" [ref=e255] [cursor=pointer]:
                    - cell "Guardrail-Base-1780725617132-7996 PROJ-0072" [ref=e256]:
                      - generic [ref=e257]:
                        - generic [ref=e258]: Guardrail-Base-1780725617132-7996
                        - generic [ref=e259]: PROJ-0072
                    - cell "0.00 BRR" [ref=e260]:
                      - generic [ref=e263]:
                        - paragraph [ref=e264]: "0.00"
                        - separator [ref=e265]
                        - paragraph [ref=e266]: BRR
                  - row "Guardrail-Base-1780725612927-9050 PROJ-0071 0.00 BRR" [ref=e267] [cursor=pointer]:
                    - cell "Guardrail-Base-1780725612927-9050 PROJ-0071" [ref=e268]:
                      - generic [ref=e269]:
                        - generic [ref=e270]: Guardrail-Base-1780725612927-9050
                        - generic [ref=e271]: PROJ-0071
                    - cell "0.00 BRR" [ref=e272]:
                      - generic [ref=e275]:
                        - paragraph [ref=e276]: "0.00"
                        - separator [ref=e277]
                        - paragraph [ref=e278]: BRR
                  - row "E2E-Project-1780725602374-6496 PROJ-0070 0.00 BRR" [ref=e279] [cursor=pointer]:
                    - cell "E2E-Project-1780725602374-6496 PROJ-0070" [ref=e280]:
                      - generic [ref=e281]:
                        - generic [ref=e282]: E2E-Project-1780725602374-6496
                        - generic [ref=e283]: PROJ-0070
                    - cell "0.00 BRR" [ref=e284]:
                      - generic [ref=e287]:
                        - paragraph [ref=e288]: "0.00"
                        - separator [ref=e289]
                        - paragraph [ref=e290]: BRR
                  - row "E2E-Project-1780725596934-9098 PROJ-0069 0.00 BRR" [ref=e291] [cursor=pointer]:
                    - cell "E2E-Project-1780725596934-9098 PROJ-0069" [ref=e292]:
                      - generic [ref=e293]:
                        - generic [ref=e294]: E2E-Project-1780725596934-9098
                        - generic [ref=e295]: PROJ-0069
                    - cell "0.00 BRR" [ref=e296]:
                      - generic [ref=e299]:
                        - paragraph [ref=e300]: "0.00"
                        - separator [ref=e301]
                        - paragraph [ref=e302]: BRR
                  - row "E2E-Project-1780725594488-6050 PROJ-0068 0.00 BRR" [ref=e303] [cursor=pointer]:
                    - cell "E2E-Project-1780725594488-6050 PROJ-0068" [ref=e304]:
                      - generic [ref=e305]:
                        - generic [ref=e306]: E2E-Project-1780725594488-6050
                        - generic [ref=e307]: PROJ-0068
                    - cell "0.00 BRR" [ref=e308]:
                      - generic [ref=e311]:
                        - paragraph [ref=e312]: "0.00"
                        - separator [ref=e313]
                        - paragraph [ref=e314]: BRR
                  - row "E2E-Project-1780725594470-2771 PROJ-0067 0.00 BRR" [ref=e315] [cursor=pointer]:
                    - cell "E2E-Project-1780725594470-2771 PROJ-0067" [ref=e316]:
                      - generic [ref=e317]:
                        - generic [ref=e318]: E2E-Project-1780725594470-2771
                        - generic [ref=e319]: PROJ-0067
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
  35  |         await page.goto('/project-management/projects');
  36  |         await page.waitForLoadState('networkidle');
  37  |         const addProjectEl = page.getByRole('link', { name: /Add Project/i }).or(page.getByRole('button', { name: /Add Project/i })).first();
  38  |         await addProjectEl.click();
  39  |         await page.waitForTimeout(2000);
  40  |         const formOpen = await page.locator('[role="dialog"], form').first().isVisible({ timeout: 6000 }).catch(() => false)
  41  |             || page.url().includes('new') || page.url().includes('create');
  42  |         expect(formOpen).toBe(true);
  43  |     });
  44  | 
  45  |     test('UI-11: Add Project form has project name input', async ({ page }) => {
  46  |         const { app } = await setup(page);
  47  |         await page.goto('/project-management/projects');
  48  |         await page.waitForLoadState('networkidle');
  49  |         const addProjectEl2 = page.getByRole('link', { name: /Add Project/i }).or(page.getByRole('button', { name: /Add Project/i })).first();
  50  |         await addProjectEl2.click();
  51  |         await page.waitForTimeout(2000);
  52  |         const nameInput = page.getByRole('textbox', { name: /project name/i })
  53  |             .or(page.locator('input[name*="name"], input[placeholder*="name" i]').first());
  54  |         const visible = await nameInput.isVisible({ timeout: 6000 }).catch(() => false);
  55  |         if (!visible) {
  56  |             const anyInput = page.locator('[role="dialog"] input[type="text"], [role="dialog"] input:not([type])').first();
  57  |             await expect(anyInput).toBeVisible({ timeout: 6000 });
  58  |         } else {
  59  |             await expect(nameInput).toBeVisible();
  60  |         }
  61  |         await page.keyboard.press('Escape');
  62  |     });
  63  | 
  64  |     // ── UI: DETAIL PAGE ─────────────────────────────────────────────────────────
  65  | 
  66  |     test('UI-12: Project detail page shows financial data (budget / revenue / balance)', async ({ page }) => {
  67  |         const { app, meta } = await setup(page);
  68  |         const { project } = await createProject(app, meta);
  69  |         await page.goto(`/project-management/projects/${project.id}`);
  70  |         await page.waitForLoadState('networkidle');
  71  |         const financialText = await page.getByText(/budget|revenue|expense|balance/i).first()
  72  |             .isVisible({ timeout: 10000 }).catch(() => false);
  73  |         expect(financialText).toBe(true);
  74  |     });
  75  | 
  76  |     test('UI-13: Project detail page shows a status indicator', async ({ page }) => {
  77  |         const { app, meta } = await setup(page);
  78  |         const { project } = await createProject(app, meta);
  79  |         await page.goto(`/project-management/projects/${project.id}`);
  80  |         await page.waitForLoadState('networkidle');
  81  |         const statusEl = page.locator('span, div, [class*="badge"], [class*="status"]')
  82  |             .filter({ hasText: /pending|in.progress|completed/i }).first();
  83  |         await expect(statusEl).toBeVisible({ timeout: 10000 });
  84  |     });
  85  | 
  86  |     test('UI-14: Project detail page shows customer name', async ({ page }) => {
  87  |         const { app, meta } = await setup(page);
  88  |         const { project } = await createProject(app, meta);
  89  |         await page.goto(`/project-management/projects/${project.id}`);
  90  |         await page.waitForLoadState('networkidle');
  91  |         await expect(page.getByText(meta.customerName, { exact: false }).first()).toBeVisible({ timeout: 10000 });
  92  |     });
  93  | 
  94  |     test('UI-15: Direct URL to non-existent project shows error or redirects', async ({ page }) => {
  95  |         const { app } = await setup(page);
  96  |         await page.goto('/project-management/projects/00000000-0000-0000-0000-000000000000');
  97  |         await page.waitForLoadState('networkidle');
  98  |         const errorOrRedirect = await page.getByText(/not found|error|no results/i).first()
  99  |             .isVisible({ timeout: 8000 }).catch(() => false)
  100 |             || !page.url().includes('00000000-0000-0000-0000-000000000000');
  101 |         expect(errorOrRedirect).toBe(true);
  102 |     });
  103 | 
  104 |     // ── UI GUARDRAILS ──────────────────────────────────────────────────────────
  105 | 
  106 |     test('UI-GUARD-01: Add Project form blocks empty submit — keeps form open or shows error', async ({ page }) => {
  107 |         const { app } = await setup(page);
  108 |         await page.goto('/project-management/projects');
  109 |         await page.waitForLoadState('networkidle');
  110 | 
  111 |         // "Add Project" renders as a link (<a>) in this ERP, not a <button>
  112 |         const addProjectEl = page.getByRole('link', { name: /Add Project/i })
  113 |             .or(page.getByRole('button', { name: /Add Project/i })).first();
  114 | 
  115 |         const elVisible = await addProjectEl.isVisible({ timeout: 8000 }).catch(() => false);
  116 |         if (!elVisible) {
  117 |             console.log('[UI-GUARD-01] Add Project element not found — skipping');
  118 |             return;
  119 |         }
  120 | 
  121 |         await addProjectEl.click();
  122 |         await page.waitForTimeout(2000);
  123 | 
  124 |         // Accept either a modal/dialog/form OR a new-page route (e.g. /projects/new)
  125 |         const formOpen = await page.locator('[role="dialog"], form').first()
  126 |             .isVisible({ timeout: 5000 }).catch(() => false)
  127 |             || page.url().includes('new') || page.url().includes('create');
  128 | 
  129 |         expect(formOpen).toBe(true);
  130 |         console.log(`[UI-GUARD-01] Add Project form opened: url=${page.url()}`);
  131 | 
  132 |         // Try submitting empty — verify validation blocks it
  133 |         const saveBtn = page.getByRole('button', { name: /save|create|submit/i }).last();
  134 |         if (await saveBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
> 135 |             await saveBtn.click();
      |                           ^ Error: locator.click: Test timeout of 120000ms exceeded.
  136 |             await page.waitForTimeout(1000);
  137 |             const stillOpen = await page.locator('[role="dialog"], form').first()
  138 |                 .isVisible({ timeout: 3000 }).catch(() => false);
  139 |             const hasError = await page.getByText(/required|invalid|error/i).first()
  140 |                 .isVisible({ timeout: 3000 }).catch(() => false);
  141 |             expect(stillOpen || hasError).toBe(true);
  142 |             console.log(`[UI-GUARD-01] Empty submit blocked: stillOpen=${stillOpen} hasError=${hasError}`);
  143 |         }
  144 |     });
  145 | 
  146 |     test('UI-GUARD-02: Unauthenticated browser access to projects redirects to login', async ({ browser }) => {
  147 |         const ctx = await browser.newContext({ storageState: undefined });
  148 |         const page = await ctx.newPage();
  149 |         await page.goto('/project-management/projects');
  150 |         await page.waitForLoadState('networkidle');
  151 |         expect(page.url()).toContain('login');
  152 |         await ctx.close();
  153 |     });
  154 | 
  155 |     test('UI-GUARD-03: Status filter pill click opens filter options', async ({ page }) => {
  156 |         const { app } = await setup(page);
  157 |         await page.goto('/project-management/projects');
  158 |         await page.waitForLoadState('networkidle');
  159 |         const statusBtn = page.getByRole('button', { name: /Status/i }).first();
  160 |         if (await statusBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  161 |             await statusBtn.click();
  162 |             await page.waitForTimeout(1000);
  163 |             const dropdownOpen = await page.locator('[role="listbox"], [role="dialog"], [role="menu"], [class*="dropdown"], [class*="popover"]')
  164 |                 .filter({ visible: true }).first().isVisible({ timeout: 4000 }).catch(() => false);
  165 |             console.log(`[UI-GUARD-03] Status filter opens dropdown: ${dropdownOpen}`);
  166 |             expect(dropdownOpen).toBe(true);
  167 |             await page.keyboard.press('Escape');
  168 |         }
  169 |     });
  170 | });
  171 | 
```