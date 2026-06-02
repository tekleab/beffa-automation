# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/cross-module-ui-flows.spec.ts >> Cross-Module UI Flow Audits @sales @purchase @smoke @full >> Sales UI: Partial payment updates invoice Amount Due correctly
- Location: tests/cross-module/cross-module-ui-flows.spec.ts:14:9

# Error details

```
Error: [CRITICAL] API Advance Failed: 401 Unauthorized. Token for "BM Tech" is invalid or expired.
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
  64  |     this.createCustomerBtn = page.locator('button:has-text("Create customer")');
  65  |     this.editCustomerBtn = page.locator('button:has-text("Edit")').first();
  66  |     this.removeCustomerBtn = page.locator('button:has-text("Remove")');
  67  | 
  68  |     // Status and Button Selectors
  69  |     this.approvedStatus = 'span.css-1ny2kle:has-text("Approved"), span:has-text("Approved")';
  70  |     this.actionButtons = 'button:has-text("Submit For Review"), button:has-text("Approve"), button:has-text("Advance"), button:has-text("Submit For Approver"), button:has-text("Submit Forapprover"), button:has-text("Submit For Approve"), button:has-text("Submit For Apporver")';
  71  | 
  72  |     // Company Switcher Selectors (Top-left Header)
  73  |     this.companyBtn = page.locator('header button.chakra-menu__menu-button, .chakra-stack button.chakra-menu__menu-button').first();
  74  |   }
  75  | 
  76  |   /**
  77  |    * Starts a high-resolution timer for tactical performance sync.
  78  |    */
  79  |   async startTacticalTimer() {
  80  |     this.startTime = performance.now();
  81  |   }
  82  | 
  83  |   /**
  84  |    * Stops the timer and records the latency metric.
  85  |    * Automatically attaches metadata for the Dashboard's Latency Engine.
  86  |    */
  87  |   async stopTacticalTimer(label: string, category: 'API' | 'UI' = 'API') {
  88  |     const duration = performance.now() - this.startTime;
  89  |     console.log(`[PERFORMANCE] ${category} - ${label}: ${duration.toFixed(2)}ms`);
  90  | 
  91  |     // Attach to Playwright annotations for Allure consumption
  92  |     try {
  93  |       const { test } = require('@playwright/test');
  94  |       if (test && typeof test.info === 'function') {
  95  |         const info = test.info();
  96  |         if (info) {
  97  |           info.annotations.push({
  98  |             type: 'tactical-perf',
  99  |             description: `${category}|${label}|${duration.toFixed(2)}`
  100 |           });
  101 |         }
  102 |       }
  103 |     } catch (e) {
  104 |       // Context unavailable (e.g. initialization or utility run)
  105 |     }
  106 |     return duration;
  107 |   }
  108 | 
  109 |   /**
  110 |    * Universal API-driven Document Approval / Advancement
  111 |    * Handles the 'Draft -> Verifier -> Approver -> Approved' transition in seconds.
  112 |    */
  113 |   async advanceDocumentAPI(docId: string, docType: string): Promise<void> {
  114 |     const token = await this._getAuthToken();
  115 |     if (!token) throw new Error("[ERROR] No Auth Token found. API Advance cannot proceed.");
  116 | 
  117 |     // Bulletproof Company Detection: Pull directly from ERP state
  118 |     const company = await this.page.evaluate(() => {
  119 |       return localStorage.getItem('currentCompany') ||
  120 |         localStorage.getItem('company');
  121 |     }) || process.env.BEFFA_COMPANY || 'sample';
  122 | 
  123 |     const year = process.env.BEFFA_YEAR || '2018';
  124 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  125 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  126 | 
  127 |     const url = `${this.apiBase}/${docType}/${docId}/advance?year=${year}&period=${period}&calendar=${calendar}`;
  128 |     const headers = {
  129 |       'x-company': company,
  130 |       'Authorization': `Bearer ${token}`,
  131 |       'Content-Type': 'application/json',
  132 |       'x-role': 'IT Administrator / User Manager'
  133 |     };
  134 | 
  135 |     console.log(`[API] Advancing ${docType} "${docId}"...`);
  136 | 
  137 |     // Fetch current user once before the loop
  138 |     let submittedTo: string | undefined;
  139 |     try {
  140 |       const meResp = await this.page.request.get(`${this.apiBase}/users/me`, { headers });
  141 |       if (meResp.ok()) {
  142 |         const meData = await meResp.json();
  143 |         submittedTo = meData?.user?.id || meData?.id || meData?.user_id;
  144 |         if (submittedTo) Logger.debug(`Current user ID: ${submittedTo}`);
  145 |       }
  146 |     } catch (e: any) {
  147 |       // /users/me unavailable, use fallback
  148 |     }
  149 |     submittedTo ??= process.env.BEFFA_ADMIN_ID || '14bb1e8c-496f-4556-99e0-830681fcf3de';
  150 |     const payload = { submitted_to: submittedTo };
  151 | 
  152 |     let success = false;
  153 |     for (let i = 0; i < 4; i++) {
  154 |       const resp = await this.page.request.patch(url, { headers, data: payload });
  155 |       const status = resp.status();
  156 | 
  157 |       if (status === 200 || status === 204) {
  158 |         success = true;
  159 |         await this.page.waitForTimeout(1000);
  160 |       } else if (status === 400 || status === 404) {
  161 |         if (success) break;
  162 |         break;
  163 |       } else if (status === 401) {
> 164 |         throw new Error(`[CRITICAL] API Advance Failed: 401 Unauthorized. Token for "${company}" is invalid or expired.`);
      |               ^ Error: [CRITICAL] API Advance Failed: 401 Unauthorized. Token for "BM Tech" is invalid or expired.
  165 |       } else if (status === 422) {
  166 |         if (success) break;
  167 |         const text = await resp.text();
  168 |         throw new Error(`[API BLOCK] ${status}: ${text.substring(0, 100)}`);
  169 |       } else {
  170 |         const errBody = await resp.text().catch(() => '(unreadable)');
  171 |         console.log(`[ERROR] Advance failed. Status: ${status} | Body: ${errBody.substring(0, 200)}`);
  172 |         break;
  173 |       }
  174 |     }
  175 | 
  176 |     if (!success) console.log(`[WARN] Advance had no successful steps for ${docType} ${docId}.`);
  177 |   }
  178 | 
  179 |   /**
  180 |    * Resilient POST helper that handles transient 500 errors with automatic retries.
  181 |    */
  182 |   /**
  183 |    * Builds a reusable API context (base URL + auth headers) for raw page.request calls.
  184 |    * Eliminates the repeated apiBase + headers construction block across test files.
  185 |    */
  186 |   async buildApiContext(): Promise<{ apiBase: string; headers: Record<string, string>; qs: string }> {
  187 |     const token = await this._getAuthToken();
  188 |     const company = process.env.BEFFA_COMPANY as string;
  189 |     const year = process.env.BEFFA_YEAR || '2018';
  190 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  191 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  192 |     return {
  193 |       apiBase: this.apiBase,
  194 |       qs: `year=${year}&period=${period}&calendar=${calendar}`,
  195 |       headers: {
  196 |         'x-company': company,
  197 |         'Authorization': `Bearer ${token}`,
  198 |         'Content-Type': 'application/json'
  199 |       }
  200 |     };
  201 |   }
  202 | 
  203 |   async safePost(url: string, options: { data: any, headers: any, label: string }): Promise<any> {
  204 |     let lastError: any = null;
  205 |     for (let attempt = 1; attempt <= 3; attempt++) {
  206 |       const response = await this.page.request.post(url, { data: options.data, headers: options.headers });
  207 |       if (response.ok()) return response;
  208 |       const status = response.status();
  209 |       const text = await response.text();
  210 |       lastError = { status, text };
  211 |       if (status >= 500) {
  212 |         await this.page.waitForTimeout(attempt * 1500);
  213 |         continue;
  214 |       }
  215 |       return response;
  216 |     }
  217 |     return { ok: () => false, status: () => lastError.status, text: async () => lastError.text, json: async () => { try { return JSON.parse(lastError.text); } catch { return {}; } } };
  218 |   }
  219 | 
  220 | 
  221 |   /**
  222 |    * Extracts a UUID from the current page URL.
  223 |    */
  224 |   async extractIdFromUrl(): Promise<string> {
  225 |     const url = this.page.url();
  226 |     const parts = url.split('/');
  227 |     return parts.find(p => /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(p)) || '';
  228 |   }
  229 | 
  230 |   /**
  231 |    * Internal helper to retrieve the security bearer token from the session.
  232 |    */
  233 |   async _getAuthToken(): Promise<string | null> {
  234 |     return await this.page.evaluate(() => {
  235 |       const keys = ['token', 'auth-token', 'jwt', 'access_token', 'auth_data', 'session_token'];
  236 |       for (const k of keys) {
  237 |         const v = localStorage.getItem(k);
  238 |         if (v && v.length > 50) return v;
  239 |       }
  240 |       // Last-ditch: Scan all keys for a JWT pattern (ey...)
  241 |       for (let i = 0; i < localStorage.length; i++) {
  242 |         const k = localStorage.key(i)!;
  243 |         const v = localStorage.getItem(k);
  244 |         if (v && v.startsWith('ey')) return v;
  245 |       }
  246 |       return null;
  247 |     });
  248 |   }
  249 | 
  250 |   async smartSearch(container: Locator | null, text: string): Promise<void> {
  251 |     if (!text) return;
  252 |     const cleanText = text.trim();
  253 |     console.log(`[ACTION] Searching for: "${cleanText}"`);
  254 | 
  255 |     await this.startTacticalTimer(); // Start Tactical UI Timer
  256 | 
  257 |     for (let s = 0; s < 3; s++) {
  258 |       try {
  259 |         const target = container || this.page.locator('div[role="dialog"], .chakra-modal__content, .chakra-popover__content, .chakra-input__group').filter({ visible: true }).last();
  260 | 
  261 |         // 🛡️ CRITICAL: Only pick ENABLED text-like inputs, avoiding checkboxes/radios/numbers
  262 |         let searchBox = target.locator('input:enabled:not([type="number"]):not([type="hidden"]):not([type="checkbox"]):not([type="radio"])').filter({ visible: true }).first();
  263 | 
  264 |         if (!(await searchBox.isVisible({ timeout: 1000 }).catch(() => false))) {
```