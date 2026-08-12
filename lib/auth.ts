import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class AuthManager extends BasePage {
  cachedToken: string | null = null;

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

    // Resolve the correct fiscal year BEFORE any API call so process.env.BEFFA_YEAR
    // is accurate for all subsequent query strings in this worker.
    try {
      const { DateHelper } = require('./utils/DateHelper');
      await DateHelper.resolve(this.page);
    } catch { /* ignore — DateHelper will retry on first API call */ }

    try {
      // 1. Attempt API Login
      const year = process.env.BEFFA_YEAR || '2019';
      const period = process.env.BEFFA_PERIOD || 'yearly';
      const calendar = process.env.BEFFA_CALENDAR || 'ec';
      const loginUrl = `${this.apiBase}/users/login?year=${year}&period=${period}&calendar=${calendar}&month=6`;
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
      this.cachedToken = token;

      // 2. Head to the Login page to settle the domain context
      await this.page.goto('/users/login', { waitUntil: 'commit' });

      // 3. Inject the EXACT keys the frontend requires to "wake up" authenticated
      await this.page.evaluate(({ jwt, exp, company, year }: { jwt: string; exp: string; company: string; year: string }) => {
        localStorage.setItem('auth-token', jwt);
        localStorage.setItem('token', jwt); // fallback

        // The UI expects a serialized JSON object for expiration
        const tokenExp = JSON.stringify({ authTokenExpirationTime: exp });
        localStorage.setItem('token-expiration', tokenExp);

        // Crucial Fiscal & Role Metadata
        localStorage.setItem('selectedYear', year);
        localStorage.setItem('calendar', 'EC');
        localStorage.setItem('period', 'yearly');
        localStorage.setItem('selected-role', 'IT Administrator / User Manager');
        localStorage.setItem('currentCompany', company);

        localStorage.setItem('lastUserActivity', new Date().toISOString());
      }, { jwt: token, exp: expiry, company: companyName, year: process.env.BEFFA_YEAR || year });

      // 4. Set HTTP cookies for backend persistence
      const domain = new URL(this.page.url()).hostname;
      await this.page.context().addCookies([
        { name: 'token', value: token, domain: domain, path: '/' },
        { name: 'auth-token', value: token, domain: domain, path: '/' }
      ]);

      // 5. Navigate home and wait for the JS bundle to fully load (populates browser cache).
      // This is intentionally slow on first load (~150s on this infra) but makes all
      // subsequent page.goto calls in the same test instant via browser cache.
      await this.page.goto('/', { waitUntil: 'load', timeout: 150000 }).catch(() => {
        console.log('[AUTH] Frontend navigation skipped (unreachable) — API session active.');
      });
      // #loading-screen hides once React has mounted — wait for it as the true ready signal
      await this.page.locator('#loading-screen').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});

    } catch (error: any) {
      console.log(`[WARN] API Login failed (${error.message}). Falling back to UI Login...`);
      await this.page.goto('/users/login');
      await this.emailInput.waitFor({ state: 'visible', timeout: 30000 });
      await this.emailInput.fill(cleanEmail);
      await this.passwordInput.fill(cleanPass);
      await expect(this.loginBtn).toBeEnabled({ timeout: 20000 });
      await this.loginBtn.click();
      await this.page.waitForURL(url => !url.href.includes('/users/login'), { timeout: 60000 });
    }

    // React is now mounted (bundle loaded + #loading-screen hidden above).
    const uiReady = await this.companyBtn.waitFor({ state: 'visible', timeout: 30000 }).then(() => true).catch(() => false);
    if (uiReady && companyName) {
      await this.switchCompany(companyName);
      await this.switchYear(process.env.BEFFA_YEAR || '2019');
    } else {
      console.log('[AUTH] UI not mounted (slow bundle) — API session active, skipping company/year switch.');
    }
  }

  async _getAuthToken(): Promise<string | null> {
    if (this.cachedToken) return this.cachedToken;
    try {
      const token = await this.page.evaluate(() => {
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
      if (token) { this.cachedToken = token; return token; }
    } catch { /* page on about:blank or cross-origin — fall through to API login */ }
    // Re-login via API to get a fresh token (handles about:blank and cross-origin pages)
    try {
      const year = process.env.BEFFA_YEAR || '2019';
      const loginUrl = `${this.apiBase}/users/login?year=${year}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}&month=6`;
      const r = await this.page.request.post(loginUrl, {
        data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
        headers: { 'Content-Type': 'application/json' }
      });
      if (r.ok()) {
        const d = await r.json();
        const t = d.auth_token || d.token;
        if (t) { this.cachedToken = t; return t; }
      }
    } catch { /* ignore */ }
    return null;
  }

  async switchCompany(targetName: string): Promise<void> {
    if (!targetName) return;
    if (this.page.url().includes('/users/login')) return;
    const cleanTarget = targetName.trim();

    // Ensure we are on a page where sample switcher is visible
    const visible = await this.companyBtn.waitFor({ state: 'visible', timeout: 8000 }).then(() => true).catch(() => false);
    if (!visible) { console.log(`[AUTH] Company switcher not visible — skipping switch to "${cleanTarget}".`); return; }
    const currentName = (await this.companyBtn.innerText()).trim();

    if (currentName.toLowerCase() === cleanTarget.toLowerCase()) {
      return;
    }

    await this.companyBtn.click();
    await this.page.waitForTimeout(1000);

    const option = this.page.locator('[role="menuitem"], .chakra-menu__menuitem, button')
      .filter({ hasText: new RegExp(`^${cleanTarget}$`, 'i') })
      .first();

    if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.startTacticalTimer();
      await option.click();
      // Use 'commit' — avoids blocking on the 7.9MB JS bundle re-download
      await this.page.waitForURL('**/', { waitUntil: 'commit', timeout: 30000 }).catch(() => {});
      await this.stopTacticalTimer(`${cleanTarget} Context Mount`, 'UI');
      // Wait for company button to re-render (React mount) instead of fixed delay
      await this.companyBtn.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    } else {
      console.log(`[WARN] Company option "${cleanTarget}" not found in menu. Staying on "${currentName}"`);
      await this.page.keyboard.press('Escape');
    }
  }

  async switchYear(targetYear: string): Promise<void> {
    if (!targetYear) return;
    const yearBtn = this.page.locator('button[id*="popover-trigger"], [id*="popover-trigger"], button, [role="button"]')
      .filter({ hasText: new RegExp(`\\b${targetYear}\\b|\\b20\\d{2}\\b`) })
      .first();

    const visible = await yearBtn.isVisible({ timeout: 500 }).catch(() => false);
    if (!visible) return;

    const currentText = (await yearBtn.textContent())?.trim() || '';
    if (currentText.includes(targetYear)) return;

    await yearBtn.click();
    await this.page.waitForTimeout(500);

    const option = this.page.locator('[role="menuitem"], [role="option"], .chakra-menu__menuitem, button, span')
      .filter({ hasText: new RegExp(`^${targetYear}$`) })
      .first();

    if (await option.isVisible({ timeout: 1500 }).catch(() => false)) {
      await option.click();
      await this.page.waitForTimeout(500);
      console.log(`[AUTH] Switched fiscal year to ${targetYear}.`);
    } else {
      await this.page.keyboard.press('Escape');
    }
  }
}
