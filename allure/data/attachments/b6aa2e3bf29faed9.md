# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/sales-receipt-ui-flow.spec.ts >> Sales Receipt — Create Receipt & Verify in Customer Profile @sales @smoke @regression @full >> Create fresh invoice via API, then create receipt and link it
- Location: tests/sales/sales-receipt-ui-flow.spec.ts:11:9

# Error details

```
Error: [CRITICAL] API Advance Failed: 401 Unauthorized. Token for "sample" is invalid or expired.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "sample" [ref=e10]: s
        - generic [ref=e11]:
          - button "sample" [ref=e12] [cursor=pointer]:
            - generic: sample
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
          - img "sample" [ref=e62]: s
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
  35  |     this.mainPhoneInput = page.getByRole('textbox', { name: /Main Phone/i });
  36  |     this.customerNameInput = page.getByRole('textbox', { name: 'Customer Name *' });
  37  |     this.customerTinInput = page.getByRole('textbox', { name: 'Customer TIN *' });
  38  | 
  39  |     // Status and Button Selectors
  40  |     this.approvedStatus = 'span.css-1ny2kle:has-text("Approved"), span:has-text("Approved")';
  41  |     this.actionButtons = 'button:has-text("Submit For Review"), button:has-text("Approve"), button:has-text("Advance"), button:has-text("Submit For Approver"), button:has-text("Submit Forapprover"), button:has-text("Submit For Approve"), button:has-text("Submit For Apporver")';
  42  | 
  43  |     // Company Switcher Selectors (Top-left Header)
  44  |     this.companyBtn = page.locator('header button.chakra-menu__menu-button, .chakra-stack button.chakra-menu__menu-button').first();
  45  |   }
  46  | 
  47  |   /**
  48  |    * Starts a high-resolution timer for tactical performance sync.
  49  |    */
  50  |   async startTacticalTimer() {
  51  |     this.startTime = performance.now();
  52  |   }
  53  | 
  54  |   /**
  55  |    * Stops the timer and records the latency metric.
  56  |    * Automatically attaches metadata for the Dashboard's Latency Engine.
  57  |    */
  58  |   async stopTacticalTimer(label: string, category: 'API' | 'UI' = 'API') {
  59  |     const duration = performance.now() - this.startTime;
  60  |     console.log(`[PERFORMANCE] ${category} - ${label}: ${duration.toFixed(2)}ms`);
  61  | 
  62  |     // Attach to Playwright annotations for Allure consumption
  63  |     try {
  64  |       const { test } = require('@playwright/test');
  65  |       if (test && typeof test.info === 'function') {
  66  |         const info = test.info();
  67  |         if (info) {
  68  |           info.annotations.push({
  69  |             type: 'tactical-perf',
  70  |             description: `${category}|${label}|${duration.toFixed(2)}`
  71  |           });
  72  |         }
  73  |       }
  74  |     } catch (e) {
  75  |       // Context unavailable (e.g. initialization or utility run)
  76  |     }
  77  |     return duration;
  78  |   }
  79  | 
  80  |   /**
  81  |    * Universal API-driven Document Approval / Advancement
  82  |    * Handles the 'Draft -> Verifier -> Approver -> Approved' transition in seconds.
  83  |    */
  84  |   async advanceDocumentAPI(docId: string, docType: string): Promise<void> {
  85  |     const token = await this._getAuthToken();
  86  |     if (!token) throw new Error("[ERROR] No Auth Token found. API Advance cannot proceed.");
  87  | 
  88  |     // Bulletproof Company Detection: Pull directly from ERP state
  89  |     const company = await this.page.evaluate(() => {
  90  |       return localStorage.getItem('currentCompany') ||
  91  |         localStorage.getItem('company');
  92  |     }) || process.env.BEFFA_COMPANY || 'sample';
  93  | 
  94  |     const year = process.env.BEFFA_YEAR || '2018';
  95  |     const period = process.env.BEFFA_PERIOD || 'yearly';
  96  |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  97  | 
  98  |     const url = `${this.apiBase}/${docType}/${docId}/advance?year=${year}&period=${period}&calendar=${calendar}`;
  99  |     const headers = {
  100 |       'x-company': company,
  101 |       'Authorization': `Bearer ${token}`,
  102 |       'Content-Type': 'application/json',
  103 |       'x-role': 'IT Administrator / User Manager'
  104 |     };
  105 | 
  106 |     console.log(`[API] Advancing ${docType} "${docId}"...`);
  107 | 
  108 |     // Fetch current user once before the loop
  109 |     let submittedTo: string | undefined;
  110 |     try {
  111 |       const meResp = await this.page.request.get(`${this.apiBase}/users/me`, { headers });
  112 |       if (meResp.ok()) {
  113 |         const meData = await meResp.json();
  114 |         submittedTo = meData?.user?.id || meData?.id || meData?.user_id;
  115 |         if (submittedTo) console.log(`[INFO] Current user ID: ${submittedTo}`);
  116 |       }
  117 |     } catch (e: any) {
  118 |       // /users/me unavailable, use fallback
  119 |     }
  120 |     submittedTo ??= process.env.BEFFA_ADMIN_ID || '14bb1e8c-496f-4556-99e0-830681fcf3de';
  121 |     const payload = { submitted_to: submittedTo };
  122 | 
  123 |     let success = false;
  124 |     for (let i = 0; i < 4; i++) {
  125 |       const resp = await this.page.request.patch(url, { headers, data: payload });
  126 |       const status = resp.status();
  127 | 
  128 |       if (status === 200 || status === 204) {
  129 |         success = true;
  130 |         await this.page.waitForTimeout(1000);
  131 |       } else if (status === 400 || status === 404) {
  132 |         if (success) break;
  133 |         break;
  134 |       } else if (status === 401) {
> 135 |         throw new Error(`[CRITICAL] API Advance Failed: 401 Unauthorized. Token for "${company}" is invalid or expired.`);
      |               ^ Error: [CRITICAL] API Advance Failed: 401 Unauthorized. Token for "sample" is invalid or expired.
  136 |       } else if (status === 422) {
  137 |         if (success) break;
  138 |         const text = await resp.text();
  139 |         throw new Error(`[API BLOCK] ${status}: ${text.substring(0, 100)}`);
  140 |       } else {
  141 |         const errBody = await resp.text().catch(() => '(unreadable)');
  142 |         console.log(`[ERROR] Advance failed. Status: ${status} | Body: ${errBody.substring(0, 200)}`);
  143 |         break;
  144 |       }
  145 |     }
  146 | 
  147 |     if (!success) console.log(`[WARN] Advance had no successful steps for ${docType} ${docId}.`);
  148 |   }
  149 | 
  150 |   /**
  151 |    * Resilient POST helper that handles transient 500 errors with automatic retries.
  152 |    */
  153 |   /**
  154 |    * Builds a reusable API context (base URL + auth headers) for raw page.request calls.
  155 |    * Eliminates the repeated apiBase + headers construction block across test files.
  156 |    */
  157 |   async buildApiContext(): Promise<{ apiBase: string; headers: Record<string, string>; qs: string }> {
  158 |     const token = await this._getAuthToken();
  159 |     const company = process.env.BEFFA_COMPANY as string;
  160 |     const year = process.env.BEFFA_YEAR || '2018';
  161 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  162 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  163 |     return {
  164 |       apiBase: this.apiBase,
  165 |       qs: `year=${year}&period=${period}&calendar=${calendar}`,
  166 |       headers: {
  167 |         'x-company': company,
  168 |         'Authorization': `Bearer ${token}`,
  169 |         'Content-Type': 'application/json'
  170 |       }
  171 |     };
  172 |   }
  173 | 
  174 |   async safePost(url: string, options: { data: any, headers: any, label: string }): Promise<any> {
  175 |     let lastError: any = null;
  176 |     for (let attempt = 1; attempt <= 3; attempt++) {
  177 |       const response = await this.page.request.post(url, { data: options.data, headers: options.headers });
  178 |       if (response.ok()) return response;
  179 |       const status = response.status();
  180 |       const text = await response.text();
  181 |       lastError = { status, text };
  182 |       if (status >= 500) {
  183 |         await this.page.waitForTimeout(attempt * 1500);
  184 |         continue;
  185 |       }
  186 |       return response;
  187 |     }
  188 |     return { ok: () => false, status: () => lastError.status, text: async () => lastError.text, json: async () => { try { return JSON.parse(lastError.text); } catch { return {}; } } };
  189 |   }
  190 | 
  191 | 
  192 |   /**
  193 |    * Extracts a UUID from the current page URL.
  194 |    */
  195 |   async extractIdFromUrl(): Promise<string> {
  196 |     const url = this.page.url();
  197 |     const parts = url.split('/');
  198 |     return parts.find(p => /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(p)) || '';
  199 |   }
  200 | 
  201 |   /**
  202 |    * Internal helper to retrieve the security bearer token from the session.
  203 |    */
  204 |   async _getAuthToken(): Promise<string | null> {
  205 |     return await this.page.evaluate(() => {
  206 |       const keys = ['token', 'auth-token', 'jwt', 'access_token', 'auth_data', 'session_token'];
  207 |       for (const k of keys) {
  208 |         const v = localStorage.getItem(k);
  209 |         if (v && v.length > 50) return v;
  210 |       }
  211 |       // Last-ditch: Scan all keys for a JWT pattern (ey...)
  212 |       for (let i = 0; i < localStorage.length; i++) {
  213 |         const k = localStorage.key(i)!;
  214 |         const v = localStorage.getItem(k);
  215 |         if (v && v.startsWith('ey')) return v;
  216 |       }
  217 |       return null;
  218 |     });
  219 |   }
  220 | 
  221 |   async smartSearch(container: Locator | null, text: string): Promise<void> {
  222 |     if (!text) return;
  223 |     const cleanText = text.trim();
  224 |     console.log(`[ACTION] Searching for: "${cleanText}"`);
  225 | 
  226 |     await this.startTacticalTimer(); // Start Tactical UI Timer
  227 | 
  228 |     for (let s = 0; s < 3; s++) {
  229 |       try {
  230 |         const target = container || this.page.locator('div[role="dialog"], .chakra-modal__content, .chakra-popover__content, .chakra-input__group').filter({ visible: true }).last();
  231 | 
  232 |         // 🛡️ CRITICAL: Only pick ENABLED text-like inputs, avoiding checkboxes/radios/numbers
  233 |         let searchBox = target.locator('input:enabled:not([type="number"]):not([type="hidden"]):not([type="checkbox"]):not([type="radio"])').filter({ visible: true }).first();
  234 | 
  235 |         if (!(await searchBox.isVisible({ timeout: 1000 }).catch(() => false))) {
```