# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-period-control.spec.ts >> Sales Period Control Edge Cases @sales @security @temporal @regression @full >> Receipt: Reject future-dated Receipt from next fiscal year (2019)
- Location: tests/sales/so-period-control.spec.ts:213:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 60000ms exceeded.
Call log:
  - waiting for locator('button.chakra-menu__menu-button').first() to be visible

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
  8   | 
  9   |     // Login selectors
  10  |     this.emailInput = page.getByRole('textbox', { name: 'Email *' });
  11  |     this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
  12  |     this.loginBtn = page.getByRole('button', { name: 'Login' });
  13  | 
  14  |     // --- Customer Module Selectors ---
  15  |     this.mainPhoneInput = page.getByRole('textbox', { name: /Main Phone/i });
  16  |     this.customerNameInput = page.getByRole('textbox', { name: 'Customer Name *' });
  17  |     this.customerTinInput = page.getByRole('textbox', { name: 'Customer TIN *' });
  18  | 
  19  |     // Status and Button Selectors
  20  |     this.approvedStatus = 'span.css-1ny2kle:has-text("Approved"), span:has-text("Approved")';
  21  |     this.actionButtons = 'button:has-text("Submit For Review"), button:has-text("Approve"), button:has-text("Advance"), button:has-text("Submit For Approver"), button:has-text("Submit Forapprover"), button:has-text("Submit For Approve"), button:has-text("Submit For Apporver")';
  22  | 
  23  |     // Company Switcher Selectors (Top-left)
  24  |     this.companyBtn = page.locator('button.chakra-menu__menu-button').first();
  25  |   }
  26  | 
  27  |   async login(email: string | undefined, pass: string | undefined, companyName: string = process.env.BEFFA_COMPANY as string): Promise<void> {
  28  |     const cleanEmail = (email || '').replace(/['"]+/g, '').trim();
  29  |     const cleanPass = (pass || '').replace(/['"]+/g, '').trim();
  30  | 
  31  |     if (!cleanEmail || !cleanPass) {
  32  |       throw new Error('CRITICAL: Automation credentials (BEFFA_USER or BEFFA_PASS) are missing or empty. If running in CI, ensure GitHub Secrets are configured for this repository.');
  33  |     }
  34  | 
  35  | 
  36  |     try {
  37  |       // 1. Attempt API Login
  38  |       const loginUrl = `${this.apiBase}/users/login?year=2018&period=yearly&calendar=ec&month=6`;
  39  |       await this.startTacticalTimer();
  40  |       const response = await this.page.request.post(loginUrl, {
  41  |         data: { email: cleanEmail, password: cleanPass },
  42  |         headers: { 'Content-Type': 'application/json' }
  43  |       });
  44  |       await this.stopTacticalTimer('Auth API Verification', 'API');
  45  | 
  46  |       if (!response.ok()) throw new Error(`API Login Failed: ${response.status()}`);
  47  | 
  48  |       const session = await response.json();
  49  |       const token = session.auth_token;
  50  |       const expiry = session.auth_token_exp;
  51  | 
  52  |       if (!token) throw new Error('No token returned from API');
  53  | 
  54  |       // 2. Head to the Login page to settle the domain context
  55  |       await this.page.goto('/users/login');
  56  | 
  57  |       // 3. Inject the EXACT keys the frontend requires to "wake up" authenticated
  58  |       await this.page.evaluate(({ jwt, exp, company }: { jwt: string; exp: string; company: string }) => {
  59  |         localStorage.setItem('auth-token', jwt);
  60  |         localStorage.setItem('token', jwt); // fallback
  61  | 
  62  |         // The UI expects a serialized JSON object for expiration
  63  |         const tokenExp = JSON.stringify({ authTokenExpirationTime: exp });
  64  |         localStorage.setItem('token-expiration', tokenExp);
  65  | 
  66  |         // Crucial Fiscal & Role Metadata
  67  |         localStorage.setItem('selectedYear', '2018');
  68  |         localStorage.setItem('calendar', 'EC');
  69  |         localStorage.setItem('period', 'yearly');
  70  |         localStorage.setItem('selected-role', 'IT Administrator / User Manager');
  71  |         localStorage.setItem('currentCompany', company || process.env.BEFFA_COMPANY as string);
  72  | 
  73  |         localStorage.setItem('lastUserActivity', new Date().toISOString());
  74  |       }, { jwt: token, exp: expiry, company: companyName });
  75  | 
  76  |       // 4. Set HTTP cookies for backend persistence
  77  |       const domain = new URL(this.page.url()).hostname;
  78  |       await this.page.context().addCookies([
  79  |         { name: 'token', value: token, domain: domain, path: '/' },
  80  |         { name: 'auth-token', value: token, domain: domain, path: '/' }
  81  |       ]);
  82  | 
  83  |       // 5. Navigate to Home and verify we are authenticated
  84  |       await this.page.goto('/', { waitUntil: 'load' });
  85  |       
  86  |       // If redirected back to login, the token injection failed — fall back to UI login
  87  |       if (this.page.url().includes('/users/login')) {
  88  |         console.log('[WARN] Token injection rejected by app, falling back to UI login...');
  89  |         await this.emailInput.waitFor({ state: 'visible', timeout: 30000 });
  90  |         await this.emailInput.fill(cleanEmail);
  91  |         await this.passwordInput.fill(cleanPass);
  92  |         await expect(this.loginBtn).toBeEnabled({ timeout: 20000 });
  93  |         await this.loginBtn.click();
  94  |         await this.page.waitForURL(url => !url.href.includes('/users/login'), { timeout: 60000 });
  95  |       }
  96  | 
  97  |     } catch (error: any) {
  98  |       console.log(`[WARN] API Login failed (${error.message}). Falling back to UI Login...`);
  99  |       await this.page.goto('/users/login');
  100 |       await this.emailInput.waitFor({ state: 'visible', timeout: 30000 });
  101 |       await this.emailInput.fill(cleanEmail);
  102 |       await this.passwordInput.fill(cleanPass);
  103 |       await expect(this.loginBtn).toBeEnabled({ timeout: 20000 });
  104 |       await this.loginBtn.click();
  105 |       await this.page.waitForURL(url => !url.href.includes('/users/login'), { timeout: 60000 });
  106 |     }
  107 | 
> 108 |     await this.companyBtn.waitFor({ state: 'visible', timeout: 60000 });
      |                           ^ TimeoutError: locator.waitFor: Timeout 60000ms exceeded.
  109 | 
  110 |     // Switch company if specific name provided
  111 |     if (companyName) {
  112 |       await this.switchCompany(companyName);
  113 |     }
  114 |   }
  115 | 
  116 |   async _getAuthToken(): Promise<string | null> {
  117 |     return await this.page.evaluate(() => {
  118 |       const keys = ['token', 'access_token', 'session_token', 'auth-token', 'jwt', 'user'];
  119 |       for (const key of keys) {
  120 |         const val = localStorage.getItem(key) || sessionStorage.getItem(key);
  121 |         if (val && val.length > 50) return val;
  122 |       }
  123 |       for (let i = 0; i < localStorage.length; i++) {
  124 |         const k = localStorage.key(i)!;
  125 |         const v = localStorage.getItem(k);
  126 |         if (v && v.startsWith('ey')) return v;
  127 |       }
  128 |       return null;
  129 |     });
  130 |   }
  131 | 
  132 |   async switchCompany(targetName: string): Promise<void> {
  133 |     if (!targetName) return;
  134 |     const cleanTarget = targetName.trim();
  135 | 
  136 |     // Ensure we are on a page where sample switcher is visible
  137 |     await this.companyBtn.waitFor({ state: 'visible', timeout: 30000 });
  138 |     const currentName = (await this.companyBtn.innerText()).trim();
  139 | 
  140 |     if (currentName.toLowerCase() === cleanTarget.toLowerCase()) {
  141 |       return;
  142 |     }
  143 | 
  144 |     await this.companyBtn.click();
  145 |     await this.page.waitForTimeout(1000);
  146 | 
  147 |     const option = this.page.locator('[role="menuitem"], .chakra-menu__menuitem, button')
  148 |       .filter({ hasText: new RegExp(`^${cleanTarget}$`, 'i') })
  149 |       .first();
  150 | 
  151 |     if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
  152 |       await this.startTacticalTimer();
  153 |       await option.click();
  154 |       // Reload is usually automatic on company change in this ERP
  155 |       await this.page.waitForURL('**/', { waitUntil: 'load', timeout: 60000 });
  156 |       await this.stopTacticalTimer(`${cleanTarget} Context Mount`, 'UI');
  157 |       await this.page.waitForTimeout(2000);
  158 |     } else {
  159 |       console.log(`[WARN] Company option "${cleanTarget}" not found in menu. Staying on "${currentName}"`);
  160 |       await this.page.keyboard.press('Escape');
  161 |     }
  162 |   }
  163 | }
  164 | 
```