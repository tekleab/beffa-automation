# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/cross-module-ui-flows.spec.ts >> Cross-Module UI Flow Audits @sales @purchase @smoke @full >> Purchase UI: Approved bill reflects outstanding balance in vendor profile
- Location: tests/cross-module/cross-module-ui-flows.spec.ts:55:9

# Error details

```
Error: [API BLOCK] 422: {
	"code": 422,
	"message": "Posting failed: the journal date 2025-08-07 falls in a closed or missin
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "BM Tech" [ref=e10]: BT
        - generic [ref=e11]:
          - button "BM Tech" [ref=e12] [cursor=pointer]:
            - generic: BM Tech
            - img [ref=e14]
          - generic [ref=e16] [cursor=pointer]:
            - button "Company Detail" [ref=e17]:
              - img [ref=e18]
            - button "Edit Company" [ref=e21]:
              - img [ref=e22]
            - button "Company Detail" [ref=e25]:
              - img [ref=e26]
      - generic [ref=e29]:
        - button "New" [ref=e30] [cursor=pointer]:
          - text: New
          - img [ref=e32]
        - generic [ref=e36] [cursor=pointer]:
          - generic [ref=e37]: "5"
          - img "Notifications" [ref=e38]
        - button "EC" [ref=e41] [cursor=pointer]:
          - img [ref=e42]
          - paragraph [ref=e44]: EC
        - button [ref=e45] [cursor=pointer]:
          - img [ref=e46]
        - generic [ref=e49] [cursor=pointer]:
          - img "System" [ref=e51]: S
          - generic [ref=e52]:
            - generic [ref=e53]: System
            - paragraph [ref=e54]: IT Administrator / User Manager
    - generic [ref=e56]:
      - generic [ref=e58]:
        - generic [ref=e59]:
          - img "BM Tech" [ref=e62]: BT
          - paragraph [ref=e63]: Welcome, System
        - paragraph [ref=e65]: From meticulous bookkeeping to seamless inventory control, we've got your back.
        - generic [ref=e66]:
          - link "Dashboard" [ref=e67] [cursor=pointer]:
            - /url: /dashboard
          - link "Settings" [ref=e68] [cursor=pointer]:
            - /url: /settings/company/details
        - generic [ref=e69]:
          - link "Add Customer" [ref=e70] [cursor=pointer]:
            - /url: /receivables/customers/new
            - img [ref=e73]
            - text: Add Customer
          - link "Add Invoice" [ref=e74] [cursor=pointer]:
            - /url: /receivables/invoices/new
            - img [ref=e77]
            - text: Add Invoice
          - link "Add Receipt" [ref=e78] [cursor=pointer]:
            - /url: /receivables/receipts/new
            - img [ref=e81]
            - text: Add Receipt
          - link "Add Sales Order" [ref=e82] [cursor=pointer]:
            - /url: /receivables/sale-orders/new
            - img [ref=e85]
            - text: Add Sales Order
        - paragraph [ref=e87]: Quick Access
        - generic [ref=e88]:
          - generic [ref=e89]:
            - link "Sales Sales" [ref=e91] [cursor=pointer]:
              - /url: /receivables/overview/
              - button "Sales Sales" [ref=e92]:
                - generic [ref=e93]:
                  - img "Sales" [ref=e94]
                  - paragraph [ref=e95]: Sales
            - link "Purchase Purchase" [ref=e97] [cursor=pointer]:
              - /url: /payables/overview/
              - button "Purchase Purchase" [ref=e98]:
                - generic [ref=e99]:
                  - img "Purchase" [ref=e100]
                  - paragraph [ref=e101]: Purchase
            - link "Accounting Accounting" [ref=e103] [cursor=pointer]:
              - /url: /accounting/overview
              - button "Accounting Accounting" [ref=e104]:
                - generic [ref=e105]:
                  - img "Accounting" [ref=e106]
                  - paragraph [ref=e107]: Accounting
            - link "Leases Leases" [ref=e109] [cursor=pointer]:
              - /url: /leases/leases/?page=1&pageSize=15
              - button "Leases Leases" [ref=e110]:
                - generic [ref=e111]:
                  - img "Leases" [ref=e112]
                  - paragraph [ref=e113]: Leases
            - link "Assets Assets" [ref=e115] [cursor=pointer]:
              - /url: /assets/overview
              - button "Assets Assets" [ref=e116]:
                - generic [ref=e117]:
                  - img "Assets" [ref=e118]
                  - paragraph [ref=e119]: Assets
            - link "Budgets Budgets" [ref=e121] [cursor=pointer]:
              - /url: /public-sector-budgets/overview
              - button "Budgets Budgets" [ref=e122]:
                - generic [ref=e123]:
                  - img "Budgets" [ref=e124]
                  - paragraph [ref=e125]: Budgets
            - link "Payroll Payroll" [ref=e127] [cursor=pointer]:
              - /url: /payrolls
              - button "Payroll Payroll" [ref=e128]:
                - generic [ref=e129]:
                  - img "Payroll" [ref=e130]
                  - paragraph [ref=e131]: Payroll
            - link "Report Report" [ref=e133] [cursor=pointer]:
              - /url: /reports
              - button "Report Report" [ref=e134]:
                - generic [ref=e135]:
                  - img "Report" [ref=e136]
                  - paragraph [ref=e137]: Report
          - button "View All" [ref=e138] [cursor=pointer]:
            - text: View All
            - img [ref=e140]
      - img "Floating Icon" [ref=e143]
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
  99  |       const { test } = require('@playwright/test');
  100 |       if (test && typeof test.info === 'function') {
  101 |         const info = test.info();
  102 |         if (info) {
  103 |           info.annotations.push({
  104 |             type: 'tactical-perf',
  105 |             description: `${safeCategory}|${safeLabel}|${duration.toFixed(2)}`
  106 |           });
  107 |         }
  108 |       }
  109 |     } catch (e) {
  110 |       // Context unavailable (e.g. initialization or utility run)
  111 |     }
  112 |     return duration;
  113 |   }
  114 | 
  115 |   /**
  116 |    * Universal API-driven Document Approval / Advancement
  117 |    * Handles the 'Draft -> Verifier -> Approver -> Approved' transition in seconds.
  118 |    */
  119 |   async advanceDocumentAPI(docId: string, docType: string): Promise<void> {
  120 |     const token = await this._getAuthToken();
  121 |     if (!token) throw new Error("[ERROR] No Auth Token found. API Advance cannot proceed.");
  122 | 
  123 |     // Bulletproof Company Detection: Pull directly from ERP state
  124 |     const company = await this.page.evaluate(() => {
  125 |       return localStorage.getItem('currentCompany') ||
  126 |         localStorage.getItem('company');
  127 |     }) || process.env.BEFFA_COMPANY || 'sample';
  128 | 
  129 |     const year = process.env.BEFFA_YEAR || '2018';
  130 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  131 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  132 | 
  133 |     const url = `${this.apiBase}/${docType}/${docId}/advance?year=${year}&period=${period}&calendar=${calendar}`;
  134 |     const headers = {
  135 |       'x-company': company,
  136 |       'Authorization': `Bearer ${token}`,
  137 |       'Content-Type': 'application/json',
  138 |       'x-role': 'IT Administrator / User Manager'
  139 |     };
  140 | 
  141 |     Logger.info(`Advancing ${Logger.sanitize(docType)} "${Logger.sanitize(docId)}"...`);
  142 | 
  143 |     // Fetch current user once before the loop
  144 |     let submittedTo: string | undefined;
  145 |     try {
  146 |       const meResp = await this.page.request.get(`${this.apiBase}/users/me`, { headers });
  147 |       if (meResp.ok()) {
  148 |         const meData = await meResp.json();
  149 |         submittedTo = meData?.user?.id || meData?.id || meData?.user_id;
  150 |         if (submittedTo) Logger.debug(`Current user ID: ${submittedTo}`);
  151 |       }
  152 |     } catch (e: any) {
  153 |       // /users/me unavailable, use fallback
  154 |     }
  155 |     submittedTo ??= process.env.BEFFA_ADMIN_ID || '14bb1e8c-496f-4556-99e0-830681fcf3de';
  156 |     const payload = { submitted_to: submittedTo };
  157 | 
  158 |     let success = false;
  159 |     for (let i = 0; i < 4; i++) {
  160 |       const resp = await this.page.request.patch(url, { headers, data: payload });
  161 |       const status = resp.status();
  162 | 
  163 |       if (status === 200 || status === 204) {
  164 |         success = true;
  165 |         await this.page.waitForTimeout(1000);
  166 |       } else if (status === 400 || status === 404) {
  167 |         if (success) break;
  168 |         break;
  169 |       } else if (status === 401) {
  170 |         // Token expired mid-test — re-authenticate once and retry
  171 |         Logger.warn('401 on advance — re-authenticating and retrying...');
  172 |         try {
  173 |           const loginUrl = `${this.apiBase}/users/login?year=${year}&period=${period}&calendar=${calendar}&month=6`;
  174 |           const loginResp = await this.page.request.post(loginUrl, {
  175 |             data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
  176 |             headers: { 'Content-Type': 'application/json' }
  177 |           });
  178 |           if (loginResp.ok()) {
  179 |             const session = await loginResp.json();
  180 |             const newToken = session.auth_token;
  181 |             if (newToken) {
  182 |               await this.page.evaluate((t) => {
  183 |                 // nosec CWE-79 — test automation framework; token stored in ERP's own localStorage schema
  184 |                 localStorage.setItem('token', t);
  185 |                 localStorage.setItem('auth-token', t);
  186 |               }, newToken);
  187 |               headers['Authorization'] = `Bearer ${newToken}`;
  188 |               Logger.info('Re-authenticated successfully — retrying advance...');
  189 |               continue;
  190 |             }
  191 |           }
  192 |         } catch (e: any) {
  193 |           Logger.warn(`Re-auth failed: ${Logger.sanitize(e.message)}`);
  194 |         }
  195 |         throw new Error(`[CRITICAL] API Advance Failed: 401 Unauthorized. Token for "${this.sanitizeLog(company)}" is invalid or expired.`);
  196 |       } else if (status === 422) {
  197 |         if (success) break;
  198 |         const text = await resp.text();
> 199 |         throw new Error(`[API BLOCK] ${status}: ${text.substring(0, 100)}`);
      |               ^ Error: [API BLOCK] 422: {
  200 |       } else {
  201 |         const errBody = await resp.text().catch(() => '(unreadable)');
  202 |         Logger.error(`Advance failed. Status: ${status} | Body: ${Logger.sanitize(errBody)}`);
  203 |         // For employee-contracts, a 500/E1481 may mean already at final state — check current status
  204 |         if (docType === 'employee-contracts' && status === 500) {
  205 |           Logger.info('employee-contracts advance returned 500 (E1481) — checking if contract is already approved...');
  206 |           break;
  207 |         }
  208 |         break;
  209 |       }
  210 |     }
  211 | 
  212 |     if (!success) Logger.warn(`Advance had no successful steps for ${Logger.sanitize(docType)} ${Logger.sanitize(docId)}.`);
  213 |   }
  214 | 
  215 |   /**
  216 |    * Resilient POST helper that handles transient 500 errors with automatic retries.
  217 |    */
  218 |   /**
  219 |    * Builds a reusable API context (base URL + auth headers) for raw page.request calls.
  220 |    * Eliminates the repeated apiBase + headers construction block across test files.
  221 |    */
  222 |   async buildApiContext(): Promise<{ apiBase: string; headers: Record<string, string>; qs: string }> {
  223 |     // _getAuthToken uses page.evaluate(localStorage) which fails on about:blank.
  224 |     // Fall back to env-based re-login if no token is available from the page context.
  225 |     let token = await this._getAuthToken().catch(() => null);
  226 |     if (!token) {
  227 |       const loginUrl = `${this.apiBase}/users/login?year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}&month=6`;
  228 |       try {
  229 |         const r = await this.page.request.post(loginUrl, {
  230 |           data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
  231 |           headers: { 'Content-Type': 'application/json' }
  232 |         });
  233 |         if (r.ok()) { const d = await r.json(); token = d.auth_token || d.token || null; }
  234 |       } catch { /* ignore */ }
  235 |     }
  236 |     const company = process.env.BEFFA_COMPANY as string;
  237 |     const year = process.env.BEFFA_YEAR || '2018';
  238 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  239 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  240 |     return {
  241 |       apiBase: this.apiBase,
  242 |       qs: `year=${year}&period=${period}&calendar=${calendar}`,
  243 |       headers: {
  244 |         'x-company': company,
  245 |         'Authorization': `Bearer ${token}`,
  246 |         'Content-Type': 'application/json'
  247 |       }
  248 |     };
  249 |   }
  250 | 
  251 |   /**
  252 |    * Race an API call against a timeout — prevents indefinite hangs under backend load.
  253 |    */
  254 |   private withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  255 |     return Promise.race([
  256 |       promise,
  257 |       new Promise<T>((_, reject) =>
  258 |         setTimeout(() => reject(new Error(`[TIMEOUT] ${label} exceeded ${ms}ms — backend may be deadlocked`)), ms)
  259 |       )
  260 |     ]);
  261 |   }
  262 | 
  263 |   /**
  264 |    * Formats and attaches API failure details (headers, body, duration, and a copy-pasteable curl command)
  265 |    * to the Playwright allure report for deep visibility into backend timeouts and errors.
  266 |    */
  267 |   async attachApiFailureToAllure(
  268 |     method: string,
  269 |     url: string,
  270 |     headers: any,
  271 |     data: any,
  272 |     status: number,
  273 |     text: string,
  274 |     durationMs: number
  275 |   ): Promise<void> {
  276 |     try {
  277 |       const { test } = require('@playwright/test');
  278 |       if (test && typeof test.info === 'function') {
  279 |         const info = test.info();
  280 |         if (info) {
  281 |           // Format headers nicely, masking authorization token for sanity
  282 |           const safeHeaders = { ...headers };
  283 |           if (safeHeaders['Authorization']) {
  284 |             const auth = String(safeHeaders['Authorization']);
  285 |             safeHeaders['Authorization'] = auth.startsWith('Bearer ')
  286 |               ? `Bearer ${auth.slice(7, 22)}... (truncated)`
  287 |               : `${auth.slice(0, 15)}... (truncated)`;
  288 |           }
  289 | 
  290 |           // Build copy-pasteable curl command
  291 |           let curlCmd = `curl -i -X ${method} \\\n`;
  292 |           for (const [k, v] of Object.entries(safeHeaders)) {
  293 |             curlCmd += `  -H "${k}: ${v}" \\\n`;
  294 |           }
  295 |           if (data) {
  296 |             const payloadStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  297 |             curlCmd += `  -d '${payloadStr.replace(/'/g, "'\\''")}' \\\n`;
  298 |           }
  299 |           curlCmd += `  "${url}"`;
```