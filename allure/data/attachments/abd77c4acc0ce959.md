# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-period-control.spec.ts >> Sales Period Control Edge Cases @sales @security @temporal @regression @full >> Edge Case: Verify SO->Invoice->Receipt chain with mixed dates is blocked
- Location: tests/sales/so-period-control.spec.ts:353:9

# Error details

```
Error: [CRITICAL] API Advance Failed for sales-orders : No successful steps.
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
  179 |           try {
  180 |             const loginUrl = `${this.apiBase}/users/login?year=${year}&period=${period}&calendar=${calendar}&month=6`;
  181 |             const loginResp = await this.page.request.post(loginUrl, {
  182 |               data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
  183 |               headers: { 'Content-Type': 'application/json' },
  184 |               timeout: 30000
  185 |             });
  186 |             if (loginResp.ok()) {
  187 |               const session = await loginResp.json();
  188 |               const newToken = session.auth_token;
  189 |               if (newToken) {
  190 |                 await this.page.evaluate((t) => {
  191 |                   // nosec CWE-79 — test automation framework; token stored in ERP's own localStorage schema
  192 |                   localStorage.setItem('token', t);
  193 |                   localStorage.setItem('auth-token', t);
  194 |                 }, newToken).catch(() => { });
  195 |                 headers['Authorization'] = `Bearer ${newToken}`;
  196 |                 Logger.info('Re-authenticated successfully — retrying advance...');
  197 |                 continue;
  198 |               }
  199 |             }
  200 |           } catch (e: any) {
  201 |             Logger.warn(`Re-auth failed: ${Logger.sanitize(e.message)}`);
  202 |           }
  203 |           throw new Error(`[CRITICAL] API Advance Failed: 401 Unauthorized. Token for "${this.sanitizeLog(company)}" is invalid or expired.`);
  204 |         } else if (status === 422) {
  205 |           if (success) break;
  206 |           const text = await resp.text().catch(() => '');
  207 |           // ── Auto-recovery: insufficient stock during SO/Invoice advance ──
  208 |           const stockTypes = ['sales-orders', 'invoices'];
  209 |           const stockInfo = this.parseInsufficientStock(text);
  210 |           if (!options?.skipStockTopUp && stockInfo && stockTypes.includes(docType)) {
  211 |             Logger.warn(`[STOCK_TOPUP] Advance ${docType}: insufficient stock (available=${stockInfo.available}, required=${stockInfo.required}). Auto-provisioning...`);
  212 |             try {
  213 |               // Fetch the document to find the item_id and location
  214 |               const docResp = await this.page.request.get(`${this.apiBase}/${docType}/${docId}?year=${year}&period=${period}&calendar=${calendar}`, { headers });
  215 |               if (docResp.ok()) {
  216 |                 const docData = await docResp.json();
  217 |                 const items = docData.so_items || docData.items || docData.invoice_items || [];
  218 |                 const firstItem = items[0];
  219 |                 const itemId = firstItem?.item_id || firstItem?.inventory_item_id;
  220 |                 if (itemId) {
  221 |                   await this.topUpItemStockAPI(
  222 |                     itemId,
  223 |                     stockInfo.deficit,
  224 |                     firstItem?.location_id,
  225 |                     firstItem?.warehouse_id
  226 |                   );
  227 |                   continue; // retry the advance
  228 |                 }
  229 |               }
  230 |             } catch (e: any) {
  231 |               Logger.warn(`[STOCK_TOPUP] Auto-recovery failed: ${e.message}`);
  232 |             }
  233 |           }
  234 |           throw new Error(`[API BLOCK] ${status}: ${text.substring(0, 100)}`);
  235 |         } else {
  236 |           const errBody = await resp.text().catch(() => '(unreadable)');
  237 |           Logger.error(`Advance failed. Status: ${status} | Body: ${Logger.sanitize(errBody)}`);
  238 |           // For employee-contracts or payroll-runs, a 500/E1481 may mean already at final state — check current status
  239 |           if (docType === 'employee-contracts' && status === 500) {
  240 |             Logger.info('employee-contracts advance returned 500 (E1481) — checking if contract is already approved...');
  241 |             success = true;
  242 |             break;
  243 |           }
  244 |           if (docType === 'payroll-runs' && status === 500) {
  245 |             Logger.info('payroll-runs advance returned 500 — checking if payroll run is already processed/approved...');
  246 |             try {
  247 |               const runResp = await this.page.request.get(`${this.apiBase}/payroll-runs/${docId}?year=${year}&period=${period}&calendar=${calendar}`, { headers });
  248 |               if (runResp.ok()) {
  249 |                 const runData = await runResp.json();
  250 |                 const runStatus = (runData.status || '').toLowerCase();
  251 |                 if (runStatus === 'approved' || runStatus === 'processed' || (runData.payrolls && runData.payrolls.length > 0)) {
  252 |                   Logger.info(`payroll-runs is in valid state (${runStatus}, ${runData.payrolls?.length ?? 0} payrolls) — treating advance as successful`);
  253 |                   success = true;
  254 |                   break;
  255 |                 }
  256 |               }
  257 |             } catch {}
  258 |           }
  259 |           if (status === 500) {
  260 |             const backoff = (i + 1) * 2000;
  261 |             Logger.warn(`Transient 500 on advance. Retry ${i + 1}/4 in ${backoff}ms...`);
  262 |             await this.page.waitForTimeout(backoff);
  263 |             continue;
  264 |           }
  265 |           break;
  266 |         }
  267 |       } catch (err: any) {
  268 |         if (err.message?.includes('[API BLOCK]') || err.message?.includes('[CRITICAL]')) {
  269 |           throw err;
  270 |         }
  271 |         Logger.warn(`Transient network drop/socket hang up on advance attempt ${i + 1}/4: ${err.message}. Retrying in 2s...`);
  272 |         await this.page.waitForTimeout(2000);
  273 |         continue;
  274 |       }
  275 |     }
  276 | 
  277 |     if (!success) {
  278 |       Logger.warn(`Advance had no successful steps for ${Logger.sanitize(docType)} ${Logger.sanitize(docId)}.`);
> 279 |       throw new Error(`[CRITICAL] API Advance Failed for ${docType} ${docId}: No successful steps.`);
      |             ^ Error: [CRITICAL] API Advance Failed for sales-orders : No successful steps.
  280 |     }
  281 |   }
  282 | 
  283 |   /**
  284 |    * Resilient POST helper that handles transient 500 errors with automatic retries.
  285 |    */
  286 |   /**
  287 |    * Builds a reusable API context (base URL + auth headers) for raw page.request calls.
  288 |    * Eliminates the repeated apiBase + headers construction block across test files.
  289 |    */
  290 |   async buildApiContext(): Promise<{ apiBase: string; headers: Record<string, string>; qs: string }> {
  291 |     // _getAuthToken uses page.evaluate(localStorage) which fails on about:blank.
  292 |     // Fall back to env-based re-login if no token is available from the page context.
  293 |     let token = await this._getAuthToken().catch(() => null);
  294 |     if (!token) {
  295 |       const loginUrl = `${this.apiBase}/users/login?year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}&month=6`;
  296 |       try {
  297 |         const r = await this.page.request.post(loginUrl, {
  298 |           data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
  299 |           headers: { 'Content-Type': 'application/json' },
  300 |           timeout: 30000
  301 |         });
  302 |         if (r.ok()) { const d = await r.json(); token = d.auth_token || d.token || null; }
  303 |       } catch { /* ignore */ }
  304 |     }
  305 |     const company = process.env.BEFFA_COMPANY as string;
  306 |     const year = process.env.BEFFA_YEAR || '2019';
  307 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  308 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  309 |     return {
  310 |       apiBase: this.apiBase,
  311 |       qs: `year=${year}&period=${period}&calendar=${calendar}`,
  312 |       headers: {
  313 |         'x-company': company,
  314 |         'Authorization': `Bearer ${token}`,
  315 |         'Content-Type': 'application/json'
  316 |       }
  317 |     };
  318 |   }
  319 | 
  320 |   /**
  321 |    * Race an API call against a timeout — prevents indefinite hangs under backend load.
  322 |    */
  323 |   private withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  324 |     return Promise.race([
  325 |       promise,
  326 |       new Promise<T>((_, reject) =>
  327 |         setTimeout(() => reject(new Error(`[TIMEOUT] ${label} exceeded ${ms}ms — backend may be deadlocked`)), ms)
  328 |       )
  329 |     ]);
  330 |   }
  331 | 
  332 |   /**
  333 |    * Formats and attaches API failure details (headers, body, duration, and a copy-pasteable curl command)
  334 |    * to the Playwright allure report for deep visibility into backend timeouts and errors.
  335 |    */
  336 |   async attachApiFailureToAllure(
  337 |     method: string,
  338 |     url: string,
  339 |     headers: any,
  340 |     data: any,
  341 |     status: number,
  342 |     text: string,
  343 |     durationMs: number
  344 |   ): Promise<void> {
  345 |     try {
  346 |       const { test } = require('@playwright/test');
  347 |       if (test && typeof test.info === 'function') {
  348 |         const info = test.info();
  349 |         if (info) {
  350 |           // Format headers nicely, masking authorization token for sanity
  351 |           const safeHeaders = { ...headers };
  352 |           if (safeHeaders['Authorization']) {
  353 |             const auth = String(safeHeaders['Authorization']);
  354 |             safeHeaders['Authorization'] = auth.startsWith('Bearer ')
  355 |               ? `Bearer ${auth.slice(7, 22)}... (truncated)`
  356 |               : `${auth.slice(0, 15)}... (truncated)`;
  357 |           }
  358 | 
  359 |           // Build copy-pasteable curl command
  360 |           let curlCmd = `curl -i -X ${method} \\\n`;
  361 |           for (const [k, v] of Object.entries(safeHeaders)) {
  362 |             curlCmd += `  -H "${k}: ${v}" \\\n`;
  363 |           }
  364 |           if (data) {
  365 |             const payloadStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  366 |             curlCmd += `  -d '${payloadStr.replace(/'/g, "'\\''")}' \\\n`;
  367 |           }
  368 |           curlCmd += `  "${url}"`;
  369 | 
  370 |           // Construct markdown report
  371 |           const markdownReport = `### 🚨 API Request Failure Report
  372 | - **Endpoint**: \`${url}\`
  373 | - **Method**: \`${method}\`
  374 | - **Status Code**: \`${status === 0 ? 'TIMEOUT / NETWORK_ERROR' : status}\`
  375 | - **Latency**: \`${durationMs.toFixed(2)}ms\`
  376 | 
  377 | #### 📋 Request Details
  378 | **Headers**:
  379 | \`\`\`json
```