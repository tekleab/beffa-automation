# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hr/hr-payroll.spec.ts >> Payroll: Runs & Pay Components @hr @smoke @regression @full >> UI: Payroll Runs page must load and display run records or empty state
- Location: tests/hr/hr-payroll.spec.ts:170:9

# Error details

```
Error: Payroll Runs page rendered no content — page may still be loading or route does not exist

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e6]
      - img [ref=e8]
      - generic [ref=e11]:
        - heading "Welcome to, befa" [level=3] [ref=e12]
        - paragraph [ref=e13]: Empower Your Finances, Simplify Your Success
        - paragraph [ref=e14]: From meticulous bookkeeping to seamless inventory control, we've got your back.
    - generic [ref=e16]:
      - heading "Login To Your Account" [level=2] [ref=e17]
      - generic [ref=e18]:
        - text: Not a member?
        - link "Register" [ref=e19] [cursor=pointer]:
          - /url: /users/register
      - generic [ref=e21]:
        - group [ref=e22]:
          - generic [ref=e23]: Email *
          - textbox "Email *" [ref=e25]:
            - /placeholder: Enter your email
        - group [ref=e26]:
          - generic [ref=e27]: Password *
          - generic [ref=e28]:
            - textbox "Password *" [ref=e29]:
              - /placeholder: Enter your password
            - button "Show password" [ref=e31] [cursor=pointer]:
              - img [ref=e32]
        - link "Forget Password?" [ref=e37] [cursor=pointer]:
          - /url: forget-password
        - button "Login" [ref=e39] [cursor=pointer]
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
```

# Test source

```ts
  113 |             for (const w of monthWindows) {
  114 |                 try {
  115 |                     run = await app.api.hr.createPayrollRun(
  116 |                         name,
  117 |                         `${gcYear}-${w.start}T00:00:00Z`,
  118 |                         `${gcYear}-${w.end}T00:00:00Z`,
  119 |                         `${gcYear}-${w.pay}T00:00:00Z`
  120 |                     );
  121 |                     console.log(`[INFO] Payroll run accepted for EC year ${ecYear + offset} (GC ${gcYear}-${w.start})`);
  122 |                     break outer;
  123 |                 } catch (e: any) {
  124 |                     if (e.message.includes('fiscal period') || e.message.includes('open')) {
  125 |                         console.log(`[INFO] GC ${gcYear}-${w.start} not in open fiscal period — trying next...`);
  126 |                         continue;
  127 |                     }
  128 |                     throw e;
  129 |                 }
  130 |             }
  131 |         }
  132 |         if (!run) {
  133 |             console.log('[KNOWN_BUG] No open fiscal period configured for HR payroll — skipping');
  134 |             return;
  135 |         }
  136 |         expect(run).toHaveProperty('id');
  137 |         expect(run.status?.toLowerCase()).toMatch(/draft/);
  138 |         payRunId = run.id;
  139 |         console.log(`[PASS] Payroll run created: ${run.id} | status: ${run.status}`);
  140 |         const fetched = await app.api.hr.getPayrollRun(run.id);
  141 |         expect(fetched.id).toBe(run.id);
  142 |         console.log(`[PASS] Payroll run persisted correctly`);
  143 |     });
  144 | 
  145 |     test('Guardrail: Payroll run advance without active employees must not silently succeed', async () => {
  146 |         if (!payRunId) { console.log('[SKIP] No payroll run ID from previous test'); return; }
  147 |         const token = await app._getAuthToken();
  148 |         const headers = { 'Authorization': `Bearer ${token}`, 'x-company': process.env.BEFFA_COMPANY as string };
  149 |         const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  150 |         const empResp = await page.request.get(`${app.apiBase}/payroll-runs/${payRunId}/employees?${params}`, { headers });
  151 |         const empBody = await empResp.json();
  152 |         console.log(`[INFO] Employees in payroll run: ${empBody.data?.length ?? 0}`);
  153 |         const advResp = await page.request.patch(
  154 |             `${app.apiBase}/payroll-runs/${payRunId}/advance?${params}`,
  155 |             { headers: { ...headers, 'Content-Type': 'application/json' }, data: {} }
  156 |         );
  157 |         if (advResp.status() === 500) {
  158 |             const body = await advResp.json();
  159 |             console.log(`[PASS] Advance correctly blocked: ${body.message}`);
  160 |             expect(body.message).toBeTruthy();
  161 |         } else if (advResp.status() === 422 || advResp.status() === 400) {
  162 |             console.log(`[PASS] Advance blocked with validation error: ${advResp.status()}`);
  163 |         } else if (advResp.status() === 200) {
  164 |             const run = await app.api.hr.getPayrollRun(payRunId);
  165 |             console.log(`[AUDIT] Advance succeeded with ${run.payrolls?.length ?? 0} payrolls generated`);
  166 |             expect(run.payrolls?.length ?? 0).toBeGreaterThanOrEqual(0);
  167 |         }
  168 |     });
  169 | 
  170 |     test('UI: Payroll Runs page must load and display run records or empty state', async ({ page: uiPage }) => {
  171 |         const uiApp = new AppManager(uiPage);
  172 |         await uiApp.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  173 |         await uiPage.goto('/payrolls/payroll-runs', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  174 |         const isServer404 = await uiPage.locator('text=/ENOENT|stat .*index\\.html/i').first().isVisible({ timeout: 2000 }).catch(() => false);
  175 |         if (isServer404) {
  176 |             console.log('[SKIP] Frontend preview server is returning static 404 ENOENT');
  177 |             return;
  178 |         }
  179 | 
  180 |         // Wait for full network settle — payroll page lazy-loads data
  181 |         await uiPage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  182 | 
  183 |         // Wait for any loading spinner/skeleton to disappear
  184 |         await uiPage.locator('#loading-screen, img[alt="Logo"], .chakra-spinner, [data-testid="skeleton"], .chakra-skeleton')
  185 |             .waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  186 | 
  187 |         // Give React time to render after data arrives
  188 |         await uiPage.waitForTimeout(3000);
  189 | 
  190 |         const hasError = await uiPage.locator('text=/Something went wrong|Internal Server Error/i').first()
  191 |             .isVisible({ timeout: 2000 }).catch(() => false);
  192 |         expect(hasError).toBe(false);
  193 | 
  194 |         // Check for meaningful content: table rows, empty-state text, heading, or New button
  195 |         const meaningfulContent = await uiPage.locator([
  196 |             'table tbody tr',
  197 |             '[role="row"]',
  198 |             'h1, h2, h3, [role="heading"]',
  199 |             'text=/No payroll runs|No records|No data|Empty/i',
  200 |             'button:has-text("New"), button:has-text("Run")',
  201 |             'main p, main span, .chakra-text',
  202 |         ].join(', ')).first().isVisible({ timeout: 15000 }).catch(() => false);
  203 | 
  204 |         if (!meaningfulContent) {
  205 |             // Final screenshot-style DOM dump for CI diagnostics
  206 |             const url = uiPage.url();
  207 |             const title = await uiPage.title().catch(() => 'unknown');
  208 |             const bodyText = await uiPage.locator('body').innerText().catch(() => '').then(t => t.slice(0, 300));
  209 |             console.log(`[DIAGNOSTIC] URL: ${url} | Title: ${title}`);
  210 |             console.log(`[DIAGNOSTIC] Body preview: ${bodyText}`);
  211 |         }
  212 | 
> 213 |         expect(meaningfulContent, 'Payroll Runs page rendered no content — page may still be loading or route does not exist').toBe(true);
      |                                                                                                                                ^ Error: Payroll Runs page rendered no content — page may still be loading or route does not exist
  214 |         console.log(`[PASS] Payroll Runs page loaded`);
  215 |     });
  216 | 
  217 | 
  218 |     test('UI: Pay Components settings page must render the components list', async ({ page: uiPage }) => {
  219 |         const uiApp = new AppManager(uiPage);
  220 |         await uiApp.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  221 |         await uiPage.goto('/payrolls/settings/pay-components', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  222 |         const isServer404 = await uiPage.locator('text=/ENOENT|stat .*index\.html/i').first().isVisible({ timeout: 2000 }).catch(() => false);
  223 |         if (isServer404) {
  224 |             console.log('[SKIP] Frontend preview server is returning static 404 ENOENT');
  225 |             return;
  226 |         }
  227 |         await uiPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  228 |         await uiPage.locator('#loading-screen, img[alt="Logo"], .chakra-spinner').waitFor({ state: 'hidden', timeout: 25000 }).catch(() => {});
  229 |         await uiPage.waitForTimeout(2000);
  230 |         const rowCount = await uiPage.locator('table tbody tr, [role="row"]').count();
  231 |         if (rowCount === 0) {
  232 |             // Rows may be inside a virtualised list or behind a different selector
  233 |             const anyRow = await uiPage.locator('[role="row"], .chakra-table tr, li, h1, h2, h3, .chakra-text, [role="table"], button, main, div').first()
  234 |                 .isVisible({ timeout: 10000 }).catch(() => false);
  235 |             expect(anyRow, 'Pay Components page rendered no rows').toBe(true);
  236 |         } else {
  237 |             expect(rowCount).toBeGreaterThan(0);
  238 |         }
  239 | 
  240 |         console.log(`[PASS] Pay Components page rendered ${rowCount} rows`);
  241 |     });
  242 | });
  243 | 
```