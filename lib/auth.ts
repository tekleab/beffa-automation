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

  async apiLogin(email?: string, pass?: string): Promise<string> {
    const cleanEmail = (email || process.env.BEFFA_USER || '').replace(/['"]+/g, '').trim();
    const cleanPass = (pass || process.env.BEFFA_PASS || '').replace(/['"]+/g, '').trim();
    const year = process.env.BEFFA_YEAR || '2019';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';

    const loginUrl = `${this.apiBase}/users/login?year=${year}&period=${period}&calendar=${calendar}&month=6`;
    const response = await this.page.request.post(loginUrl, {
      data: { email: cleanEmail, password: cleanPass },
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok()) throw new Error(`API Login Failed: ${response.status()}`);
    const session = await response.json();
    const token = session.auth_token || session.token || session.access_token;
    if (!token) throw new Error('No token returned from API');
    this.cachedToken = token;
    BasePage.globalAuthToken = token;
    return token;
  }

  async login(email: string | undefined, pass: string | undefined, companyName: string = process.env.BEFFA_COMPANY as string): Promise<void> {
    const cleanEmail = (email || '').replace(/['"]+/g, '').trim();
    const cleanPass = (pass || '').replace(/['"]+/g, '').trim();

    if (!cleanEmail || !cleanPass) {
      throw new Error('CRITICAL: Automation credentials (BEFFA_USER or BEFFA_PASS) are missing or empty. If running in CI, ensure GitHub Secrets are configured for this repository.');
    }

    // Fast-path check: If session token is already set in browser context, reuse it instantly
    const hasExistingSession = await this.page.evaluate(() => {
      try {
        const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
        if (token) {
          localStorage.setItem('lastUserActivity', new Date().toISOString());
          return true;
        }
        return false;
      } catch {
        return false;
      }
    }).catch(() => false);

    if (hasExistingSession) {
      console.log('[AUTH] Reusing cached signed-in session state — skipping login navigation.');
      return;
    }

    // Fast-path 2: If playwright/.auth/user.json exists on disk, inject it into context and page instantly
    try {
      const fs = require('fs');
      const path = require('path');
      const authFile = path.resolve(__dirname, '../playwright/.auth/user.json');
      if (fs.existsSync(authFile)) {
        const authData = JSON.parse(fs.readFileSync(authFile, 'utf8'));
        if (authData.cookies?.length) {
          await this.page.context().addCookies(authData.cookies).catch(() => {});
        }
        const origin = authData.origins?.[0];
        if (origin?.localStorage?.length) {
          await this.page.addInitScript((items: any[]) => {
            for (const item of items) {
              try { localStorage.setItem(item.name, item.value); } catch {}
            }
          }, origin.localStorage);
          await this.page.evaluate((items: any[]) => {
            for (const item of items) {
              try { localStorage.setItem(item.name, item.value); } catch {}
            }
          }, origin.localStorage).catch(() => {});
          const token = origin.localStorage.find((i: any) => i.name === 'auth-token')?.value || origin.localStorage.find((i: any) => i.name === 'token')?.value;
          if (token) {
            this.cachedToken = token;
            BasePage.globalAuthToken = token;
          }
          console.log('[AUTH] Injected session from user.json storage file.');
          return;
        }
      }
    } catch (e: any) {
      console.warn(`[WARN] Could not restore session from storage file: ${e.message}`);
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
      let response: any;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          response = await this.page.request.post(loginUrl, {
            data: { email: cleanEmail, password: cleanPass },
            headers: { 'Content-Type': 'application/json' },
            timeout: 20000
          });
          if (response.ok()) break;
        } catch (err: any) {
          if (attempt === 3) throw err;
          await this.page.waitForTimeout(1000);
        }
      }
      await this.stopTacticalTimer('Auth API Verification', 'API');

      if (!response || !response.ok()) throw new Error(`API Login Failed: ${response?.status?.() ?? 'no response'}`);

      const session = await response.json();
      const token = session.auth_token;
      const expiry = session.auth_token_exp;

      if (!token) throw new Error('No token returned from API');
      this.cachedToken = token;
      BasePage.globalAuthToken = token;

      // 2. Inject localStorage via addInitScript so all future navigations are authenticated
      const resolvedYear = process.env.BEFFA_YEAR || year;
      await this.page.addInitScript(({ jwt, exp, company, yr }: any) => {
        try {
          localStorage.setItem('auth-token', jwt);
          localStorage.setItem('token', jwt);
          localStorage.setItem('token-expiration', JSON.stringify({ authTokenExpirationTime: exp }));
          localStorage.setItem('selectedYear', yr);
          localStorage.setItem('calendar', 'EC');
          localStorage.setItem('period', 'yearly');
          localStorage.setItem('selected-role', 'IT Administrator / User Manager');
          localStorage.setItem('currentCompany', company);
          localStorage.setItem('lastUserActivity', new Date().toISOString());
        } catch {}
      }, { jwt: token, exp: expiry, company: companyName, yr: resolvedYear });

      // 3. Set HTTP cookies for backend persistence
      let domain = 'localhost';
      try {
        const pageUrl = this.page.url();
        domain = pageUrl && !pageUrl.startsWith('about:') ? new URL(pageUrl).hostname : new URL(process.env.BASE_URL || 'http://localhost:4173').hostname;
      } catch {
        domain = 'localhost';
      }
      await this.page.context().addCookies([
        { name: 'token', value: token, domain: domain, path: '/' },
        { name: 'auth-token', value: token, domain: domain, path: '/' }
      ]);

      // 4. If already on a web page, populate localStorage directly
      await this.page.evaluate(({ jwt, exp, company, yr }: any) => {
        try {
          localStorage.setItem('auth-token', jwt);
          localStorage.setItem('token', jwt);
          localStorage.setItem('token-expiration', JSON.stringify({ authTokenExpirationTime: exp }));
          localStorage.setItem('selectedYear', yr);
          localStorage.setItem('calendar', 'EC');
          localStorage.setItem('period', 'yearly');
          localStorage.setItem('selected-role', 'IT Administrator / User Manager');
          localStorage.setItem('currentCompany', company);
          localStorage.setItem('lastUserActivity', new Date().toISOString());
        } catch {}
      }, { jwt: token, exp: expiry, company: companyName, yr: resolvedYear }).catch(() => {});

      console.log('[AUTH] Session token and local storage injected successfully.');
    } catch (error: any) {
      console.log(`[WARN] API Login failed (${error.message}). Falling back to UI Login...`);
      try {
        await this.page.goto('/users/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
        await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
        await this.emailInput.fill(cleanEmail);
        await this.passwordInput.fill(cleanPass);
        await expect(this.loginBtn).toBeEnabled({ timeout: 15000 });
        await this.loginBtn.click();
        await this.page.waitForURL(url => !url.href.includes('/users/login'), { timeout: 30000 });
      } catch (uiErr: any) {
        console.warn(`[WARN] UI Login also failed: ${uiErr.message}`);
        throw error;
      }
    }
  }

  async _getAuthToken(): Promise<string | null> {
    if (this.cachedToken) return this.cachedToken;
    if (BasePage.globalAuthToken) {
      this.cachedToken = BasePage.globalAuthToken;
      return this.cachedToken;
    }
    try {
      const token = await this.page.evaluate(() => {
        try {
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
        } catch {
          return null;
        }
      }).catch(() => null);
      if (token) {
        this.cachedToken = token;
        BasePage.globalAuthToken = token;
        return token;
      }
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
        if (t) {
          this.cachedToken = t;
          BasePage.globalAuthToken = t;
          return t;
        }
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
      await this.page.waitForURL('**/', { waitUntil: 'commit', timeout: 30000 }).catch(() => { });
      await this.stopTacticalTimer(`${cleanTarget} Context Mount`, 'UI');
      // Wait for company button to re-render (React mount) instead of fixed delay
      await this.companyBtn.waitFor({ state: 'visible', timeout: 15000 }).catch(() => { });
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
