import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AuthManager extends BasePage {
  constructor(page: Page) {
    super(page);
    this.page = page;

    // Login selectors
    this.emailInput = page.getByRole('textbox', { name: 'Email *' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
    this.loginBtn = page.getByRole('button', { name: 'Login' });

    // --- Customer Module Selectors ---
    this.mainPhoneInput = page.getByRole('textbox', { name: /Main Phone/i });
    this.customerNameInput = page.getByRole('textbox', { name: 'Customer Name *' });
    this.customerTinInput = page.getByRole('textbox', { name: 'Customer TIN *' });

    // Status and Button Selectors
    this.approvedStatus = 'span.css-1ny2kle:has-text("Approved"), span:has-text("Approved")';
    this.actionButtons = 'button:has-text("Submit For Review"), button:has-text("Approve"), button:has-text("Advance"), button:has-text("Submit For Approver"), button:has-text("Submit Forapprover"), button:has-text("Submit For Approve"), button:has-text("Submit For Apporver")';

    // Company Switcher Selectors (Top-left)
    this.companyBtn = page.locator('button.chakra-menu__menu-button').first();
  }

  async login(email: string | undefined, pass: string | undefined, companyName: string = process.env.BEFFA_COMPANY as string): Promise<void> {
    const cleanEmail = (email || '').replace(/['"]+/g, '').trim();
    const cleanPass = (pass || '').replace(/['"]+/g, '').trim();

    if (!cleanEmail || !cleanPass) {
      throw new Error('CRITICAL: Automation credentials (BEFFA_USER or BEFFA_PASS) are missing or empty. If running in CI, ensure GitHub Secrets are configured for this repository.');
    }

    console.log(`[ACTION] Performing High-Speed API Login for: ${cleanEmail}...`);

    try {
      // 1. Attempt API Login
      const loginUrl = `http://157.180.20.112:8001/api/users/login?year=2018&period=yearly&calendar=ec&month=6`;
      await this.startTacticalTimer();
      const response = await this.page.request.post(loginUrl, {
        data: { email: cleanEmail, password: cleanPass },
        headers: { 'Content-Type': 'application/json' }
      });
      await this.stopTacticalTimer('Auth API Verification', 'API');

      if (!response.ok()) throw new Error(`API Login Failed: ${response.status()}`);

      const session = await response.json();
      const token = session.auth_token;
      const expiry = session.auth_token_exp;

      if (!token) throw new Error('No token returned from API');

      // 2. Head to the Login page to settle the domain context
      await this.page.goto('/users/login');

      // 3. Inject the EXACT keys the frontend requires to "wake up" authenticated
      await this.page.evaluate(({ jwt, exp, company }: { jwt: string; exp: string; company: string }) => {
        localStorage.setItem('auth-token', jwt);
        localStorage.setItem('token', jwt); // fallback

        // The UI expects a serialized JSON object for expiration
        const tokenExp = JSON.stringify({ authTokenExpirationTime: exp });
        localStorage.setItem('token-expiration', tokenExp);

        // Crucial Fiscal & Role Metadata
        localStorage.setItem('selectedYear', '2018');
        localStorage.setItem('calendar', 'EC');
        localStorage.setItem('period', 'yearly');
        localStorage.setItem('selected-role', 'IT Administrator / User Manager');
        localStorage.setItem('currentCompany', company || process.env.BEFFA_COMPANY as string);

        localStorage.setItem('lastUserActivity', new Date().toISOString());
      }, { jwt: token, exp: expiry, company: companyName });

      // 4. Set HTTP cookies for backend persistence
      const domain = new URL(this.page.url()).hostname;
      await this.page.context().addCookies([
        { name: 'token', value: token, domain: domain, path: '/' },
        { name: 'auth-token', value: token, domain: domain, path: '/' }
      ]);

      // 5. Navigate to Home
      console.log('[SUCCESS] API Login complete. Session & Metadata injected.');
      await this.page.goto('/', { waitUntil: 'load' });

    } catch (error: any) {
      console.log(`[WARN] API Login failed (${error.message}). Falling back to UI Login...`);
      await this.page.goto('/users/login');
      await this.emailInput.waitFor({ state: 'visible', timeout: 30000 });
      await this.emailInput.fill(cleanEmail);
      await this.passwordInput.fill(cleanPass);
      await expect(this.loginBtn).toBeEnabled({ timeout: 20000 });
      await this.loginBtn.click();
    }

    await this.companyBtn.waitFor({ state: 'visible', timeout: 60000 });

    // Switch company if specific name provided
    if (companyName) {
      await this.switchCompany(companyName);
    }
  }

  async _getAuthToken(): Promise<string | null> {
    return await this.page.evaluate(() => {
      const keys = ['token', 'access_token', 'session_token', 'auth-token', 'jwt', 'user'];
      for (const key of keys) {
        const val = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (val && val.length > 50) return val;
      }
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)!;
        const v = localStorage.getItem(k);
        if (v && v.startsWith('ey')) return v;
      }
      return null;
    });
  }

  async switchCompany(targetName: string): Promise<void> {
    if (!targetName) return;
    const cleanTarget = targetName.trim();
    console.log('[ACTION] Verifying current company selection...');

    // Ensure we are on a page where sample switcher is visible
    await this.companyBtn.waitFor({ state: 'visible', timeout: 30000 });
    const currentName = (await this.companyBtn.innerText()).trim();

    if (currentName.toLowerCase() === cleanTarget.toLowerCase()) {
      console.log(`[INFO] Already on company: "${currentName}"`);
      return;
    }

    console.log(`[ACTION] Switching company: "${currentName}" -> "${cleanTarget}"`);
    await this.companyBtn.click();
    await this.page.waitForTimeout(1000);

    const option = this.page.locator('[role="menuitem"], .chakra-menu__menuitem, button')
      .filter({ hasText: new RegExp(`^${cleanTarget}$`, 'i') })
      .first();

    if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.startTacticalTimer();
      await option.click();
      // Reload is usually automatic on company change in this ERP
      await this.page.waitForURL('**/', { waitUntil: 'load', timeout: 60000 });
      await this.stopTacticalTimer(`${cleanTarget} Context Mount`, 'UI');
      console.log(`[SUCCESS] Company switched to "${cleanTarget}"`);
      await this.page.waitForTimeout(2000);
    } else {
      console.log(`[WARN] Company option "${cleanTarget}" not found in menu. Staying on "${currentName}"`);
      await this.page.keyboard.press('Escape');
    }
  }
}
