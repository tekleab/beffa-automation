# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/project-ui-detail.spec.ts >> Project Management: UI Detail & Guardrails @project @ui @smoke @regression @full >> UI-12: Project detail page shows financial data (budget / revenue / balance)
- Location: tests/project/project-ui-detail.spec.ts:33:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
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
                      - link "Detail" [ref=e185] [cursor=pointer]:
                        - /url: /project-management/projects/4787284c-d86e-48ad-9c84-74b382834aac/detail
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
                  - row "E2E-Project-1782382577815-3693 PROJ-0306 0.00 BRR" [ref=e207] [cursor=pointer]:
                    - cell "E2E-Project-1782382577815-3693 PROJ-0306" [ref=e208]:
                      - generic [ref=e209]:
                        - generic [ref=e210]: E2E-Project-1782382577815-3693
                        - generic [ref=e211]: PROJ-0306
                    - cell "0.00 BRR" [ref=e212]:
                      - generic [ref=e215]:
                        - paragraph [ref=e216]: "0.00"
                        - separator [ref=e217]
                        - paragraph [ref=e218]: BRR
                  - row "E2E-Project-1782382577463-240 PROJ-0305 0.00 BRR" [ref=e219] [cursor=pointer]:
                    - cell "E2E-Project-1782382577463-240 PROJ-0305" [ref=e220]:
                      - generic [ref=e221]:
                        - generic [ref=e222]: E2E-Project-1782382577463-240
                        - generic [ref=e223]: PROJ-0305
                    - cell "0.00 BRR" [ref=e224]:
                      - generic [ref=e227]:
                        - paragraph [ref=e228]: "0.00"
                        - separator [ref=e229]
                        - paragraph [ref=e230]: BRR
                  - row "Guardrail-Base-1782382574006-1404 PROJ-0304 0.00 BRR" [ref=e231] [cursor=pointer]:
                    - cell "Guardrail-Base-1782382574006-1404 PROJ-0304" [ref=e232]:
                      - generic [ref=e233]:
                        - generic [ref=e234]: Guardrail-Base-1782382574006-1404
                        - generic [ref=e235]: PROJ-0304
                    - cell "0.00 BRR" [ref=e236]:
                      - generic [ref=e239]:
                        - paragraph [ref=e240]: "0.00"
                        - separator [ref=e241]
                        - paragraph [ref=e242]: BRR
                  - row "Guardrail-Base-1782382569326-5448 PROJ-0303 0.00 BRR" [ref=e243] [cursor=pointer]:
                    - cell "Guardrail-Base-1782382569326-5448 PROJ-0303" [ref=e244]:
                      - generic [ref=e245]:
                        - generic [ref=e246]: Guardrail-Base-1782382569326-5448
                        - generic [ref=e247]: PROJ-0303
                    - cell "0.00 BRR" [ref=e248]:
                      - generic [ref=e251]:
                        - paragraph [ref=e252]: "0.00"
                        - separator [ref=e253]
                        - paragraph [ref=e254]: BRR
                  - row "Guardrail-Base-1782382566057-2923 PROJ-0302 0.00 BRR" [ref=e255] [cursor=pointer]:
                    - cell "Guardrail-Base-1782382566057-2923 PROJ-0302" [ref=e256]:
                      - generic [ref=e257]:
                        - generic [ref=e258]: Guardrail-Base-1782382566057-2923
                        - generic [ref=e259]: PROJ-0302
                    - cell "0.00 BRR" [ref=e260]:
                      - generic [ref=e263]:
                        - paragraph [ref=e264]: "0.00"
                        - separator [ref=e265]
                        - paragraph [ref=e266]: BRR
                  - row "E2E-Project-1782382550487-7941 PROJ-0301 0.00 BRR" [ref=e267] [cursor=pointer]:
                    - cell "E2E-Project-1782382550487-7941 PROJ-0301" [ref=e268]:
                      - generic [ref=e269]:
                        - generic [ref=e270]: E2E-Project-1782382550487-7941
                        - generic [ref=e271]: PROJ-0301
                    - cell "0.00 BRR" [ref=e272]:
                      - generic [ref=e275]:
                        - paragraph [ref=e276]: "0.00"
                        - separator [ref=e277]
                        - paragraph [ref=e278]: BRR
                  - row "E2E-Project-1782382549615-3509 PROJ-0300 0.00 BRR" [ref=e279] [cursor=pointer]:
                    - cell "E2E-Project-1782382549615-3509 PROJ-0300" [ref=e280]:
                      - generic [ref=e281]:
                        - generic [ref=e282]: E2E-Project-1782382549615-3509
                        - generic [ref=e283]: PROJ-0300
                    - cell "0.00 BRR" [ref=e284]:
                      - generic [ref=e287]:
                        - paragraph [ref=e288]: "0.00"
                        - separator [ref=e289]
                        - paragraph [ref=e290]: BRR
                  - row "E2E-Project-1782382546686-4652 PROJ-0299 0.00 BRR" [ref=e291] [cursor=pointer]:
                    - cell "E2E-Project-1782382546686-4652 PROJ-0299" [ref=e292]:
                      - generic [ref=e293]:
                        - generic [ref=e294]: E2E-Project-1782382546686-4652
                        - generic [ref=e295]: PROJ-0299
                    - cell "0.00 BRR" [ref=e296]:
                      - generic [ref=e299]:
                        - paragraph [ref=e300]: "0.00"
                        - separator [ref=e301]
                        - paragraph [ref=e302]: BRR
                  - row "E2E-Project-1782382545564-6853 PROJ-0298 0.00 BRR" [ref=e303] [cursor=pointer]:
                    - cell "E2E-Project-1782382545564-6853 PROJ-0298" [ref=e304]:
                      - generic [ref=e305]:
                        - generic [ref=e306]: E2E-Project-1782382545564-6853
                        - generic [ref=e307]: PROJ-0298
                    - cell "0.00 BRR" [ref=e308]:
                      - generic [ref=e311]:
                        - paragraph [ref=e312]: "0.00"
                        - separator [ref=e313]
                        - paragraph [ref=e314]: BRR
                  - row "E2E-Project-1782382542613-4949 PROJ-0297 0.00 BRR" [ref=e315] [cursor=pointer]:
                    - cell "E2E-Project-1782382542613-4949 PROJ-0297" [ref=e316]:
                      - generic [ref=e317]:
                        - generic [ref=e318]: E2E-Project-1782382542613-4949
                        - generic [ref=e319]: PROJ-0297
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
                - generic [ref=e343]:
                  - heading "Project Details" [level=2] [ref=e344]
                  - group [ref=e346]:
                    - button "edit" [ref=e347] [cursor=pointer]: Edit
                    - button "remove" [ref=e349] [cursor=pointer]: Remove
                - generic [ref=e352]:
                  - generic [ref=e353]: PR
                  - generic [ref=e354]:
                    - heading "E2E-Project-1782382577463-240" [level=2] [ref=e355]
                    - paragraph [ref=e356]: Base Ethiopia
                    - generic [ref=e357]:
                      - generic [ref=e358]: PENDING
                      - paragraph [ref=e359]: "ID: PROJ-0305"
                      - paragraph [ref=e360]: "Progress: 0.00%"
                    - generic [ref=e361]:
                      - generic [ref=e362]:
                        - paragraph [ref=e363]: "Start Date:"
                        - paragraph [ref=e364]: 25-Jun-2026
                      - generic [ref=e365]:
                        - paragraph [ref=e366]: "Est. End:"
                        - paragraph [ref=e367]: 25-Jun-2027
                - generic [ref=e368]:
                  - tablist [ref=e369]:
                    - tab "Overview" [selected] [ref=e370] [cursor=pointer]
                    - tab "Financial Information" [ref=e371] [cursor=pointer]
                    - tab "Purchase Orders" [ref=e372] [cursor=pointer]
                    - tab "Sales Orders" [ref=e373] [cursor=pointer]
                    - tab "Bill Items" [ref=e374] [cursor=pointer]
                    - tab "Invoice Items" [ref=e375] [cursor=pointer]
                    - tab "Payment Items" [ref=e376] [cursor=pointer]
                    - tab "Receipt Items" [ref=e377] [cursor=pointer]
                  - tabpanel "Overview" [ref=e379]:
                    - generic [ref=e380]:
                      - generic [ref=e381]:
                        - generic [ref=e382]:
                          - generic [ref=e383]:
                            - generic [ref=e385]:
                              - heading "Total Tasks" [level=2] [ref=e386]
                              - img [ref=e387]
                            - generic [ref=e390]:
                              - paragraph [ref=e391]: "0"
                              - paragraph [ref=e392]: Tasks in this project
                          - generic [ref=e393]:
                            - generic [ref=e395]:
                              - heading "Completed" [level=2] [ref=e396]
                              - img [ref=e397]
                            - generic [ref=e400]:
                              - paragraph [ref=e401]: "0"
                              - paragraph [ref=e402]: 0% completion rate
                          - generic [ref=e403]:
                            - generic [ref=e405]:
                              - heading "In Progress" [level=2] [ref=e406]
                              - img [ref=e407]
                            - generic [ref=e410]:
                              - paragraph [ref=e411]: "0"
                              - paragraph [ref=e412]: Active tasks
                          - generic [ref=e413]:
                            - generic [ref=e415]:
                              - heading "Overdue" [level=2] [ref=e416]
                              - img [ref=e417]
                            - generic [ref=e419]:
                              - paragraph [ref=e420]: "0"
                              - paragraph [ref=e421]: Tasks past due date
                        - generic [ref=e422]:
                          - generic [ref=e423]:
                            - generic [ref=e424]:
                              - heading "Overall Progress" [level=2] [ref=e425]
                              - paragraph [ref=e426]: Based on task completion
                            - generic [ref=e428]:
                              - generic [ref=e429]:
                                - paragraph [ref=e430]: Progress
                                - paragraph [ref=e431]: 0%
                              - progressbar [ref=e433]
                          - heading "Task Status Distribution" [level=2] [ref=e436]
                      - generic [ref=e438]:
                        - heading "General Information" [level=2] [ref=e440]
                        - generic [ref=e442]:
                          - generic [ref=e444]:
                            - paragraph [ref=e445]: Project ID
                            - paragraph [ref=e446]: PROJ-0305
                          - generic [ref=e448]:
                            - paragraph [ref=e449]: Project Name
                            - paragraph [ref=e450]: E2E-Project-1782382577463-240
                          - generic [ref=e452]:
                            - paragraph [ref=e453]: Project Status
                            - paragraph [ref=e454]: pending | 0.00%
                          - generic [ref=e456]:
                            - paragraph [ref=e457]: Project Owner
                            - paragraph [ref=e458]: Base Ethiopia
                          - generic [ref=e460]:
                            - paragraph [ref=e461]: Description
                            - paragraph:
                              - paragraph
                      - generic [ref=e462]:
                        - heading "Timeline Information" [level=2] [ref=e464]
                        - generic [ref=e466]:
                          - generic [ref=e468]:
                            - paragraph [ref=e469]: Project Start Date
                            - paragraph [ref=e470]: 25-Jun-2026
                          - generic [ref=e472]:
                            - paragraph [ref=e473]: Estimated End Date
                            - paragraph [ref=e474]: 25-Jun-2027
                          - generic [ref=e476]:
                            - paragraph [ref=e477]: Actual End Date
                            - paragraph [ref=e478]: Not completed yet
        - generic [ref=e479]: BM Technology © 2026
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
  1   | import { test, expect } from '@playwright/test';
  2   | import { AppManager } from '../../pages/AppManager';
  3   | 
  4   | /**
  5   |  * PROJECT UI DETAIL & GUARDRAILS — Detail Page, Authentication, Edge Cases
  6   |  *
  7   |  * UI-only tests for project detail views and guardrails
  8   |  * Covers: Detail page, authentication, error handling, filter interactions
  9   |  */
  10  | test.describe('Project Management: UI Detail & Guardrails @project @ui @smoke @regression @full', () => {
  11  | 
  12  |     async function setup(page: any) {
  13  |         const app = new AppManager(page);
  14  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  15  |         const meta = await app.api.project.discoverMetadataAPI();
  16  |         return { app, meta };
  17  |     }
  18  | 
  19  |     async function createProject(app: AppManager, meta: any, overrides: Record<string, any> = {}) {
  20  |         const name = `E2E-Project-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
  21  |         const project = await app.api.project.createProjectAPI({
  22  |             name,
  23  |             customerId: meta.customerId,
  24  |             estimatedRevenue: 200000,
  25  |             estimatedExpense: 80000,
  26  |             ...overrides
  27  |         });
  28  |         return { project, name };
  29  |     }
  30  | 
  31  |     // ── UI: DETAIL PAGE ─────────────────────────────────────────────────────────
  32  | 
  33  |     test('UI-12: Project detail page shows financial data (budget / revenue / balance)', async ({ page }) => {
  34  |         const { app, meta } = await setup(page);
  35  |         const { project } = await createProject(app, meta);
  36  |         await page.goto(`/project-management/projects/${project.id}`);
  37  |         await page.waitForLoadState('networkidle');
  38  |         
  39  |         // Try multiple selector strategies for financial data
  40  |         const financialSelectors = [
  41  |             page.getByText(/budget|revenue|expense|balance/i).first(),
  42  |             page.locator('[class*="budget"], [class*="revenue"], [class*="expense"], [class*="balance"]').first(),
  43  |             page.getByText(new RegExp((project as any).estimated_revenue || '200000', 'i')).first(),
  44  |             page.getByText(new RegExp((project as any).estimated_expense || '80000', 'i')).first(),
  45  |         ];
  46  |         
  47  |         let financialVisible = false;
  48  |         for (const selector of financialSelectors) {
  49  |             if (await selector.isVisible({ timeout: 5000 }).catch(() => false)) {
  50  |                 financialVisible = true;
  51  |                 console.log(`[UI-12] Financial data found with selector`);
  52  |                 break;
  53  |             }
  54  |         }
  55  |         
> 56  |         expect(financialVisible).toBe(true);
      |                                  ^ Error: expect(received).toBe(expected) // Object.is equality
  57  |     });
  58  | 
  59  |     test('UI-13: Project detail page shows a status indicator', async ({ page }) => {
  60  |         const { app, meta } = await setup(page);
  61  |         const { project } = await createProject(app, meta);
  62  |         await page.goto(`/project-management/projects/${project.id}`);
  63  |         await page.waitForLoadState('networkidle');
  64  |         
  65  |         // Try multiple selector strategies for status indicator
  66  |         const statusSelectors = [
  67  |             page.locator('span, div, [class*="badge"], [class*="status"]')
  68  |                 .filter({ hasText: /pending|in.progress|completed/i }).first(),
  69  |             page.getByText(/pending|in.progress|completed/i).first(),
  70  |             page.locator('[class*="badge"]').first(),
  71  |             page.locator('[class*="status"]').first(),
  72  |         ];
  73  |         
  74  |         let statusVisible = false;
  75  |         for (const selector of statusSelectors) {
  76  |             if (await selector.isVisible({ timeout: 3000 }).catch(() => false)) {
  77  |                 statusVisible = true;
  78  |                 console.log(`[UI-13] Status indicator found with selector`);
  79  |                 break;
  80  |             }
  81  |         }
  82  |         
  83  |         expect(statusVisible).toBe(true);
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
  106 |     test('UI-GUARD-02: Unauthenticated browser access to projects redirects to login', async ({ browser }) => {
  107 |         const ctx = await browser.newContext({ storageState: undefined });
  108 |         const page = await ctx.newPage();
  109 |         await page.goto('/project-management/projects');
  110 |         await page.waitForLoadState('networkidle');
  111 |         expect(page.url()).toContain('login');
  112 |         await ctx.close();
  113 |     });
  114 | 
  115 |     test('UI-GUARD-03: Status filter pill click opens filter options', async ({ page }) => {
  116 |         const { app } = await setup(page);
  117 |         await page.goto('/project-management/projects');
  118 |         await page.waitForLoadState('networkidle');
  119 |         const statusBtn = page.getByRole('button', { name: /Status/i }).first();
  120 |         if (await statusBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  121 |             await statusBtn.click();
  122 |             await page.waitForTimeout(1000);
  123 |             const dropdownOpen = await page.locator('[role="listbox"], [role="dialog"], [role="menu"], [class*="dropdown"], [class*="popover"]')
  124 |                 .filter({ visible: true }).first().isVisible({ timeout: 4000 }).catch(() => false);
  125 |             console.log(`[UI-GUARD-03] Status filter opens dropdown: ${dropdownOpen}`);
  126 |             expect(dropdownOpen).toBe(true);
  127 |             await page.keyboard.press('Escape');
  128 |         }
  129 |     });
  130 | });
  131 | 
```