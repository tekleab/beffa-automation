# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hr/hr-payroll.spec.ts >> Payroll: Runs & Pay Components @hr @smoke >> UI: Payroll Runs page must load and display run records or empty state
- Location: tests/hr/hr-payroll.spec.ts:170:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('textbox', { name: 'Email *' }) to be visible
    - waiting for "http://168.119.175.142:4173/users/login" navigation to finish...

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
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
            - button "Show password" [ref=e31] [cursor=pointer]
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
  50  |   async login(email: string | undefined, pass: string | undefined, companyName: string = process.env.BEFFA_COMPANY as string): Promise<void> {
  51  |     const cleanEmail = (email || '').replace(/['"]+/g, '').trim();
  52  |     const cleanPass = (pass || '').replace(/['"]+/g, '').trim();
  53  | 
  54  |     if (!cleanEmail || !cleanPass) {
  55  |       throw new Error('CRITICAL: Automation credentials (BEFFA_USER or BEFFA_PASS) are missing or empty. If running in CI, ensure GitHub Secrets are configured for this repository.');
  56  |     }
  57  | 
  58  |     // Fast-path check: If session token is already set in browser context, reuse it instantly
  59  |     const hasExistingSession = await this.page.evaluate(() => {
  60  |       try {
  61  |         const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
  62  |         if (token) {
  63  |           localStorage.setItem('lastUserActivity', new Date().toISOString());
  64  |           return true;
  65  |         }
  66  |         return false;
  67  |       } catch {
  68  |         return false;
  69  |       }
  70  |     }).catch(() => false);
  71  | 
  72  |     if (hasExistingSession) {
  73  |       console.log('[AUTH] Reusing cached signed-in session state — skipping login navigation.');
  74  |       return;
  75  |     }
  76  | 
  77  |     // Resolve the correct fiscal year BEFORE any API call so process.env.BEFFA_YEAR
  78  |     // is accurate for all subsequent query strings in this worker.
  79  |     try {
  80  |       const { DateHelper } = require('./utils/DateHelper');
  81  |       await DateHelper.resolve(this.page);
  82  |     } catch { /* ignore — DateHelper will retry on first API call */ }
  83  | 
  84  |     try {
  85  |       // 1. Attempt API Login
  86  |       const year = process.env.BEFFA_YEAR || '2019';
  87  |       const period = process.env.BEFFA_PERIOD || 'yearly';
  88  |       const calendar = process.env.BEFFA_CALENDAR || 'ec';
  89  |       const loginUrl = `${this.apiBase}/users/login?year=${year}&period=${period}&calendar=${calendar}&month=6`;
  90  |       let response: any;
  91  |       for (let attempt = 1; attempt <= 2; attempt++) {
  92  |         try {
  93  |           response = await this.page.request.post(loginUrl, {
  94  |             data: { email: cleanEmail, password: cleanPass },
  95  |             headers: { 'Content-Type': 'application/json' },
  96  |             timeout: 20000
  97  |           });
  98  |           if (response.ok()) break;
  99  |         } catch (err: any) {
  100 |           if (attempt === 2) throw err;
  101 |           await this.page.waitForTimeout(1000);
  102 |         }
  103 |       }
  104 |       await this.stopTacticalTimer('Auth API Verification', 'API');
  105 | 
  106 |       if (!response || !response.ok()) throw new Error(`API Login Failed: ${response?.status?.() ?? 'no response'}`);
  107 | 
  108 |       const session = await response.json();
  109 |       const token = session.auth_token;
  110 |       const expiry = session.auth_token_exp;
  111 | 
  112 |       if (!token) throw new Error('No token returned from API');
  113 |       this.cachedToken = token;
  114 | 
  115 |       // 2. Head to the Login page to settle the domain context
  116 |       await this.page.goto('/users/login', { waitUntil: 'commit', timeout: 30000 }).catch(async () => {
  117 |         await this.page.goto('/users/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
  118 |       });
  119 | 
  120 |       // 3. Inject the EXACT keys the frontend requires to "wake up" authenticated
  121 |       await this.page.evaluate(({ jwt, exp, company, year }: { jwt: string; exp: string; company: string; year: string }) => {
  122 |         localStorage.setItem('auth-token', jwt);
  123 |         localStorage.setItem('token', jwt); // fallback
  124 | 
  125 |         // The UI expects a serialized JSON object for expiration
  126 |         const tokenExp = JSON.stringify({ authTokenExpirationTime: exp });
  127 |         localStorage.setItem('token-expiration', tokenExp);
  128 | 
  129 |         // Crucial Fiscal & Role Metadata
  130 |         localStorage.setItem('selectedYear', year);
  131 |         localStorage.setItem('calendar', 'EC');
  132 |         localStorage.setItem('period', 'yearly');
  133 |         localStorage.setItem('selected-role', 'IT Administrator / User Manager');
  134 |         localStorage.setItem('currentCompany', company);
  135 | 
  136 |         localStorage.setItem('lastUserActivity', new Date().toISOString());
  137 |       }, { jwt: token, exp: expiry, company: companyName, year: process.env.BEFFA_YEAR || year });
  138 | 
  139 |       // 4. Set HTTP cookies for backend persistence
  140 |       const domain = new URL(this.page.url()).hostname;
  141 |       await this.page.context().addCookies([
  142 |         { name: 'token', value: token, domain: domain, path: '/' },
  143 |         { name: 'auth-token', value: token, domain: domain, path: '/' }
  144 |       ]);
  145 | 
  146 |       console.log('[AUTH] Session token and local storage injected successfully.');
  147 |     } catch (error: any) {
  148 |       console.log(`[WARN] API Login failed (${error.message}). Falling back to UI Login...`);
  149 |       await this.page.goto('/users/login', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
> 150 |       await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
      |                             ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  151 |       await this.emailInput.fill(cleanEmail);
  152 |       await this.passwordInput.fill(cleanPass);
  153 |       await expect(this.loginBtn).toBeEnabled({ timeout: 15000 });
  154 |       await this.loginBtn.click();
  155 |       await this.page.waitForURL(url => !url.href.includes('/users/login'), { timeout: 30000 });
  156 |     }
  157 |   }
  158 | 
  159 |   async _getAuthToken(): Promise<string | null> {
  160 |     if (this.cachedToken) return this.cachedToken;
  161 |     try {
  162 |       const token = await this.page.evaluate(() => {
  163 |         const keys = ['token', 'access_token', 'session_token', 'auth-token', 'jwt', 'user'];
  164 |         for (const key of keys) {
  165 |           const val = localStorage.getItem(key) || sessionStorage.getItem(key);
  166 |           if (val && val.length > 50) return val;
  167 |         }
  168 |         for (let i = 0; i < localStorage.length; i++) {
  169 |           const k = localStorage.key(i)!;
  170 |           const v = localStorage.getItem(k);
  171 |           if (v && v.startsWith('ey')) return v;
  172 |         }
  173 |         return null;
  174 |       });
  175 |       if (token) { this.cachedToken = token; return token; }
  176 |     } catch { /* page on about:blank or cross-origin — fall through to API login */ }
  177 |     // Re-login via API to get a fresh token (handles about:blank and cross-origin pages)
  178 |     try {
  179 |       const year = process.env.BEFFA_YEAR || '2019';
  180 |       const loginUrl = `${this.apiBase}/users/login?year=${year}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}&month=6`;
  181 |       const r = await this.page.request.post(loginUrl, {
  182 |         data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
  183 |         headers: { 'Content-Type': 'application/json' }
  184 |       });
  185 |       if (r.ok()) {
  186 |         const d = await r.json();
  187 |         const t = d.auth_token || d.token;
  188 |         if (t) { this.cachedToken = t; return t; }
  189 |       }
  190 |     } catch { /* ignore */ }
  191 |     return null;
  192 |   }
  193 | 
  194 |   async switchCompany(targetName: string): Promise<void> {
  195 |     if (!targetName) return;
  196 |     if (this.page.url().includes('/users/login')) return;
  197 |     const cleanTarget = targetName.trim();
  198 | 
  199 |     // Ensure we are on a page where sample switcher is visible
  200 |     const visible = await this.companyBtn.waitFor({ state: 'visible', timeout: 8000 }).then(() => true).catch(() => false);
  201 |     if (!visible) { console.log(`[AUTH] Company switcher not visible — skipping switch to "${cleanTarget}".`); return; }
  202 |     const currentName = (await this.companyBtn.innerText()).trim();
  203 | 
  204 |     if (currentName.toLowerCase() === cleanTarget.toLowerCase()) {
  205 |       return;
  206 |     }
  207 | 
  208 |     await this.companyBtn.click();
  209 |     await this.page.waitForTimeout(1000);
  210 | 
  211 |     const option = this.page.locator('[role="menuitem"], .chakra-menu__menuitem, button')
  212 |       .filter({ hasText: new RegExp(`^${cleanTarget}$`, 'i') })
  213 |       .first();
  214 | 
  215 |     if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
  216 |       await this.startTacticalTimer();
  217 |       await option.click();
  218 |       // Use 'commit' — avoids blocking on the 7.9MB JS bundle re-download
  219 |       await this.page.waitForURL('**/', { waitUntil: 'commit', timeout: 30000 }).catch(() => { });
  220 |       await this.stopTacticalTimer(`${cleanTarget} Context Mount`, 'UI');
  221 |       // Wait for company button to re-render (React mount) instead of fixed delay
  222 |       await this.companyBtn.waitFor({ state: 'visible', timeout: 15000 }).catch(() => { });
  223 |     } else {
  224 |       console.log(`[WARN] Company option "${cleanTarget}" not found in menu. Staying on "${currentName}"`);
  225 |       await this.page.keyboard.press('Escape');
  226 |     }
  227 |   }
  228 | 
  229 |   async switchYear(targetYear: string): Promise<void> {
  230 |     if (!targetYear) return;
  231 |     const yearBtn = this.page.locator('button[id*="popover-trigger"], [id*="popover-trigger"], button, [role="button"]')
  232 |       .filter({ hasText: new RegExp(`\\b${targetYear}\\b|\\b20\\d{2}\\b`) })
  233 |       .first();
  234 | 
  235 |     const visible = await yearBtn.isVisible({ timeout: 500 }).catch(() => false);
  236 |     if (!visible) return;
  237 | 
  238 |     const currentText = (await yearBtn.textContent())?.trim() || '';
  239 |     if (currentText.includes(targetYear)) return;
  240 | 
  241 |     await yearBtn.click();
  242 |     await this.page.waitForTimeout(500);
  243 | 
  244 |     const option = this.page.locator('[role="menuitem"], [role="option"], .chakra-menu__menuitem, button, span')
  245 |       .filter({ hasText: new RegExp(`^${targetYear}$`) })
  246 |       .first();
  247 | 
  248 |     if (await option.isVisible({ timeout: 1500 }).catch(() => false)) {
  249 |       await option.click();
  250 |       await this.page.waitForTimeout(500);
```