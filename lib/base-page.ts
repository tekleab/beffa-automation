import { Page, Locator } from '@playwright/test';
import { Logger } from './utils/Logger';

export class BasePage {
  page: Page;
  emailInput: Locator;
  passwordInput: Locator;
  loginBtn: Locator;
  mainPhoneInput: Locator;
  customerNameInput: Locator;
  customerTinInput: Locator;
  customerIdInput: Locator;
  customerTypeSelect: Locator;
  customerPhoneInput: Locator;
  customerEmailInput: Locator;
  customerWebsiteInput: Locator;
  customerFaxInput: Locator;
  customerRegionSelect: Locator;
  customerZoneSelect: Locator;
  customerWoredaSelect: Locator;
  customerKebeleInput: Locator;
  customerSalesAccountInput: Locator;
  createCustomerBtn: Locator;
  editCustomerBtn: Locator;
  removeCustomerBtn: Locator;
  approvedStatus: string;
  actionButtons: string;
  companyBtn: Locator;
  private startTime: number = 0;
  apiBase: string = '';

  constructor(page: Page) {
    this.page = page;

    // Configure API Base — environment-aware, CI/CD safe
    let base = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
      .replace(/['"+]+/g, '')
      .replace(/\/$/, '');
    if (!base.startsWith('http://') && !base.startsWith('https://')) base = 'http://' + base;
    base = base.replace(/:4173/, ':8001');
    if (!base.endsWith('/api')) base += '/api';
    this.apiBase = base;

    // Login selectors
    this.emailInput = page.getByRole('textbox', { name: 'Email *' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
    this.loginBtn = page.getByRole('button', { name: 'Login' });

    // --- Customer Module Selectors ---
    this.mainPhoneInput = page.getByRole('textbox', { name: /Main Phone/i });
    this.customerNameInput = page.locator('#customer_name-input-id');
    this.customerTinInput = page.locator('#customer_tin-input-id');
    this.customerIdInput = page.locator('#customer_id');
    this.customerTypeSelect = page.locator('#type-select-id');
    this.customerPhoneInput = page.locator('#customer_phone-input-id');
    this.customerEmailInput = page.locator('#customer_email-input-id');
    this.customerWebsiteInput = page.locator('#customer_website-input-id');
    this.customerFaxInput = page.locator('#customer_fax-input-id');
    this.customerRegionSelect = page.locator('#region');
    this.customerZoneSelect = page.locator('#zone');
    this.customerWoredaSelect = page.locator('#woreda');
    this.customerKebeleInput = page.locator('#kebele');
    this.customerSalesAccountInput = page.locator('#sales_account_id');
    this.createCustomerBtn = page.locator('button:has-text("Create customer")');
    this.editCustomerBtn = page.locator('button:has-text("Edit")').first();
    this.removeCustomerBtn = page.locator('button:has-text("Remove")');

    // Status and Button Selectors
    this.approvedStatus = 'span.css-1ny2kle:has-text("Approved"), span:has-text("Approved")';
    this.actionButtons = 'button:has-text("Submit For Review"), button:has-text("Approve"), button:has-text("Advance"), button:has-text("Submit For Approver"), button:has-text("Submit Forapprover"), button:has-text("Submit For Approve"), button:has-text("Submit For Apporver")';

    // Company Switcher Selectors (Top-left Header)
    this.companyBtn = page.locator('header button.chakra-menu__menu-button, .chakra-stack button.chakra-menu__menu-button').first();
  }

  /**
   * Starts a high-resolution timer for tactical performance sync.
   */
  async startTacticalTimer() {
    this.startTime = performance.now();
  }

  /**
   * Stops the timer and records the latency metric.
   * Automatically attaches metadata for the Dashboard's Latency Engine.
   */
  async stopTacticalTimer(label: string, category: 'API' | 'UI' = 'API') {
    const duration = performance.now() - this.startTime;
    console.log(`[PERFORMANCE] ${category} - ${label}: ${duration.toFixed(2)}ms`);

    // Attach to Playwright annotations for Allure consumption
    try {
      const { test } = require('@playwright/test');
      if (test && typeof test.info === 'function') {
        const info = test.info();
        if (info) {
          info.annotations.push({
            type: 'tactical-perf',
            description: `${category}|${label}|${duration.toFixed(2)}`
          });
        }
      }
    } catch (e) {
      // Context unavailable (e.g. initialization or utility run)
    }
    return duration;
  }

  /**
   * Universal API-driven Document Approval / Advancement
   * Handles the 'Draft -> Verifier -> Approver -> Approved' transition in seconds.
   */
  async advanceDocumentAPI(docId: string, docType: string): Promise<void> {
    const token = await this._getAuthToken();
    if (!token) throw new Error("[ERROR] No Auth Token found. API Advance cannot proceed.");

    // Bulletproof Company Detection: Pull directly from ERP state
    const company = await this.page.evaluate(() => {
      return localStorage.getItem('currentCompany') ||
        localStorage.getItem('company');
    }) || process.env.BEFFA_COMPANY || 'sample';

    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';

    const url = `${this.apiBase}/${docType}/${docId}/advance?year=${year}&period=${period}&calendar=${calendar}`;
    const headers = {
      'x-company': company,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-role': 'IT Administrator / User Manager'
    };

    console.log(`[API] Advancing ${docType} "${docId}"...`);

    // Fetch current user once before the loop
    let submittedTo: string | undefined;
    try {
      const meResp = await this.page.request.get(`${this.apiBase}/users/me`, { headers });
      if (meResp.ok()) {
        const meData = await meResp.json();
        submittedTo = meData?.user?.id || meData?.id || meData?.user_id;
        if (submittedTo) Logger.debug(`Current user ID: ${submittedTo}`);
      }
    } catch (e: any) {
      // /users/me unavailable, use fallback
    }
    submittedTo ??= process.env.BEFFA_ADMIN_ID || '14bb1e8c-496f-4556-99e0-830681fcf3de';
    const payload = { submitted_to: submittedTo };

    let success = false;
    for (let i = 0; i < 4; i++) {
      const resp = await this.page.request.patch(url, { headers, data: payload });
      const status = resp.status();

      if (status === 200 || status === 204) {
        success = true;
        await this.page.waitForTimeout(1000);
      } else if (status === 400 || status === 404) {
        if (success) break;
        break;
      } else if (status === 401) {
        // Token expired mid-test — re-authenticate once and retry
        console.log(`[AUTH] 401 on advance — re-authenticating and retrying...`);
        try {
          const loginUrl = `${this.apiBase}/users/login?year=${year}&period=${period}&calendar=${calendar}&month=6`;
          const loginResp = await this.page.request.post(loginUrl, {
            data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
            headers: { 'Content-Type': 'application/json' }
          });
          if (loginResp.ok()) {
            const session = await loginResp.json();
            const newToken = session.auth_token;
            if (newToken) {
              await this.page.evaluate((t) => {
                localStorage.setItem('token', t);
                localStorage.setItem('auth-token', t);
              }, newToken);
              headers['Authorization'] = `Bearer ${newToken}`;
              console.log(`[AUTH] Re-authenticated successfully — retrying advance...`);
              continue;
            }
          }
        } catch (e: any) {
          console.log(`[AUTH] Re-auth failed: ${e.message}`);
        }
        throw new Error(`[CRITICAL] API Advance Failed: 401 Unauthorized. Token for "${company}" is invalid or expired.`);
      } else if (status === 422) {
        if (success) break;
        const text = await resp.text();
        throw new Error(`[API BLOCK] ${status}: ${text.substring(0, 100)}`);
      } else {
        const errBody = await resp.text().catch(() => '(unreadable)');
        console.log(`[ERROR] Advance failed. Status: ${status} | Body: ${errBody.substring(0, 200)}`);
        // For employee-contracts, a 500/E1481 may mean already at final state — check current status
        if (docType === 'employee-contracts' && status === 500) {
          console.log(`[INFO] employee-contracts advance returned 500 (E1481) — checking if contract is already approved...`);
          break;
        }
        break;
      }
    }

    if (!success) console.log(`[WARN] Advance had no successful steps for ${docType} ${docId}.`);
  }

  /**
   * Resilient POST helper that handles transient 500 errors with automatic retries.
   */
  /**
   * Builds a reusable API context (base URL + auth headers) for raw page.request calls.
   * Eliminates the repeated apiBase + headers construction block across test files.
   */
  async buildApiContext(): Promise<{ apiBase: string; headers: Record<string, string>; qs: string }> {
    const token = await this._getAuthToken();
    const company = process.env.BEFFA_COMPANY as string;
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    return {
      apiBase: this.apiBase,
      qs: `year=${year}&period=${period}&calendar=${calendar}`,
      headers: {
        'x-company': company,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  /**
   * Race an API call against a timeout — prevents indefinite hangs under backend load.
   */
  private withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`[TIMEOUT] ${label} exceeded ${ms}ms — backend may be deadlocked`)), ms)
      )
    ]);
  }

  /**
   * Formats and attaches API failure details (headers, body, duration, and a copy-pasteable curl command)
   * to the Playwright allure report for deep visibility into backend timeouts and errors.
   */
  async attachApiFailureToAllure(
    method: string,
    url: string,
    headers: any,
    data: any,
    status: number,
    text: string,
    durationMs: number
  ): Promise<void> {
    try {
      const { test } = require('@playwright/test');
      if (test && typeof test.info === 'function') {
        const info = test.info();
        if (info) {
          // Format headers nicely, masking authorization token for sanity
          const safeHeaders = { ...headers };
          if (safeHeaders['Authorization']) {
            const auth = String(safeHeaders['Authorization']);
            safeHeaders['Authorization'] = auth.startsWith('Bearer ')
              ? `Bearer ${auth.slice(7, 22)}... (truncated)`
              : `${auth.slice(0, 15)}... (truncated)`;
          }

          // Build copy-pasteable curl command
          let curlCmd = `curl -i -X ${method} \\\n`;
          for (const [k, v] of Object.entries(safeHeaders)) {
            curlCmd += `  -H "${k}: ${v}" \\\n`;
          }
          if (data) {
            const payloadStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
            curlCmd += `  -d '${payloadStr.replace(/'/g, "'\\''")}' \\\n`;
          }
          curlCmd += `  "${url}"`;

          // Construct markdown report
          const markdownReport = `### 🚨 API Request Failure Report
- **Endpoint**: \`${url}\`
- **Method**: \`${method}\`
- **Status Code**: \`${status === 0 ? 'TIMEOUT / NETWORK_ERROR' : status}\`
- **Latency**: \`${durationMs.toFixed(2)}ms\`

#### 📋 Request Details
**Headers**:
\`\`\`json
${JSON.stringify(safeHeaders, null, 2)}
\`\`\`

${data ? `**Body**:\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n` : ''}

#### 💥 Response Details
**Response Body**:
\`\`\`json
${text || '(No response text or timeout reached)'}
\`\`\`

#### 💻 Replay with curl
\`\`\`bash
${curlCmd}
\`\`\`
`;
          const parsedUrl = new URL(url);
          const endpointName = parsedUrl.pathname.split('/').pop() || 'request';
          info.attach(`api-failure-${method.toLowerCase()}-${endpointName}`, {
            body: markdownReport,
            contentType: 'text/markdown'
          });
        }
      }
    } catch (e) {
      console.log(`[WARN] Could not attach API failure to Allure report: ${e}`);
    }
  }

  /**
   * Resilient GET with exponential backoff for 500/503/socket-hang-up.
   */
  async safeGet(url: string, options: { headers: any }, timeoutMs = 30000): Promise<any> {
    let lastError: any = null;
    const startTime = performance.now();

    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const response = await this.withTimeout(
          this.page.request.get(url, { headers: options.headers }),
          timeoutMs,
          `GET ${url}`
        );
        if (response.ok()) return response;
        const status = response.status();
        const text = await response.text();
        lastError = { status, text };
        if (status === 500 || status === 503) {
          const backoff = attempt * attempt * 1500;
          console.log(`[WARN] GET ${url} → ${status}. Retry ${attempt}/4 in ${backoff}ms...`);
          await this.page.waitForTimeout(backoff);
          continue;
        }
        // Non-retryable error (e.g. 4xx) — attach to Allure and return
        const duration = performance.now() - startTime;
        await this.attachApiFailureToAllure('GET', url, options.headers, null, status, text, duration);
        return response; // 4xx — return as-is
      } catch (err: any) {
        if (
          err.message?.includes('socket hang up') ||
          err.message?.includes('ECONNRESET') ||
          err.message?.includes('ECONNREFUSED') ||
          err.message?.includes('Target page') ||
          err.message?.includes('[TIMEOUT]')
        ) {
          const backoff = attempt * attempt * 1500;
          console.log(`[WARN] GET ${url} → ${err.message.split('\n')[0]}. Retry ${attempt}/4 in ${backoff}ms...`);
          lastError = { status: err.message?.includes('[TIMEOUT]') ? 408 : 0, text: err.message };
          await this.page.waitForTimeout(backoff);
          continue;
        }
        lastError = { status: 0, text: err.message };
      }
    }

    // All retries failed (timeout, network error, or persistent 5xx)
    const duration = performance.now() - startTime;
    await this.attachApiFailureToAllure('GET', url, options.headers, null, lastError?.status ?? 0, lastError?.text ?? '', duration);

    return {
      ok: () => false,
      status: () => lastError?.status ?? 0,
      text: async () => lastError?.text ?? '',
      json: async () => { try { return JSON.parse(lastError?.text ?? '{}'); } catch { return {}; } }
    };
  }

  /**
   * Resilient POST with Promise.race timeout + exponential backoff for 500/503.
   * Gracefully swallows "target closed" errors so a crashed page doesn't kill the suite.
   */
  async safePost(url: string, options: { data: any, headers: any, label: string }, timeoutMs = 30000): Promise<any> {
    let lastError: any = null;
    const startTime = performance.now();

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await this.withTimeout(
          this.page.request.post(url, { data: options.data, headers: options.headers }),
          timeoutMs,
          options.label
        );

        if (response.ok()) return response;

        const status = response.status();
        const text = await response.text();
        lastError = { status, text };

        // Exponential backoff only for transient server errors
        if (status === 500 || status === 503) {
          const backoff = attempt * attempt * 1000; // 1s, 4s, 9s
          Logger.warn(`${options.label} → ${status}. Retry ${attempt}/3 in ${backoff}ms...`);
          await this.page.waitForTimeout(backoff);
          continue;
        }

        // Non-retryable error (e.g. 4xx) — attach to Allure and return
        const duration = performance.now() - startTime;
        await this.attachApiFailureToAllure('POST', url, options.headers, options.data, status, text, duration);
        return response; // 4xx — return as-is, no retry

      } catch (err: any) {
        // Gracefully handle page/context closed — don't crash the suite
        if (
          err.message?.includes('Target page, context or browser has been closed') ||
          err.message?.includes('page has been closed') ||
          err.message?.includes('context was destroyed')
        ) {
          Logger.warn(`${options.label} → Page closed mid-request (attempt ${attempt}). Skipping.`);
          return { ok: () => false, status: () => 0, text: async () => 'page-closed', json: async () => ({}) };
        }

        // Timeout hit — no point retrying a deadlocked backend immediately
        if (err.message?.includes('[TIMEOUT]')) {
          Logger.warn(err.message);
          lastError = { status: 408, text: err.message };
          break;
        }

        lastError = { status: 0, text: err.message };
        await this.page.waitForTimeout(attempt * 1000);
      }
    }

    // All retries failed
    const duration = performance.now() - startTime;
    await this.attachApiFailureToAllure('POST', url, options.headers, options.data, lastError?.status ?? 0, lastError?.text ?? '', duration);

    return {
      ok: () => false,
      status: () => lastError?.status ?? 0,
      text: async () => lastError?.text ?? '',
      json: async () => { try { return JSON.parse(lastError?.text ?? '{}'); } catch { return {}; } }
    };
  }


  /**
   * Extracts a UUID from the current page URL.
   */
  async extractIdFromUrl(): Promise<string> {
    const url = this.page.url();
    const parts = url.split('/');
    return parts.find(p => /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(p)) || '';
  }

  /** Resolve a valid x-company header — validates against API and falls back to user's companies. */
  async resolveActiveCompanyAPI(preferred?: string): Promise<string> {
    const token = await this._getAuthToken();
    if (!token) throw new Error('[COMPANY] No auth token — login first.');

    const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
    const candidates = new Set<string>();
    const addCandidate = (value?: string | null) => { if (value?.trim()) candidates.add(value.trim()); };

    addCandidate(preferred);
    addCandidate(process.env.BEFFA_COMPANY);
    addCandidate(await this.page.evaluate(() => localStorage.getItem('currentCompany')).catch(() => null));

    const isValidCompany = async (company: string): Promise<boolean> => {
      const resp = await this.page.request.get(`${this.apiBase}/accounts?page=1&pageSize=1&${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-company': company,
          'x-role': 'IT Administrator / User Manager'
        }
      });
      return resp.ok();
    };

    for (const company of candidates) {
      if (await isValidCompany(company)) {
        if (company !== process.env.BEFFA_COMPANY) {
          console.log(`[COMPANY] Resolved active company: "${company}"`);
        }
        process.env.BEFFA_COMPANY = company;
        await this.page.evaluate((c) => localStorage.setItem('currentCompany', c), company).catch(() => {});
        return company;
      }
    }

    const preferredLower = (preferred || process.env.BEFFA_COMPANY || '').toLowerCase();
    const pickFromList = async (companies: any[]): Promise<string | null> => {
      const ordered = [...companies].sort((a, b) => {
        const aName = (a.name || a.company_name || '').toLowerCase();
        const bName = (b.name || b.company_name || '').toLowerCase();
        if (aName === preferredLower) return -1;
        if (bName === preferredLower) return 1;
        return 0;
      });
      for (const entry of ordered) {
        const name = entry?.name || entry?.company_name;
        if (name && await isValidCompany(name)) return name;
      }
      return null;
    };

    const companiesResp = await this.safeGet(`${this.apiBase}/companies?page=1&pageSize=50&${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (companiesResp.ok()) {
      const data = await companiesResp.json();
      const resolved = await pickFromList(data.items || data.data || []);
      if (resolved) {
        const note = preferred && resolved.toLowerCase() !== preferredLower ? ` (fallback — "${preferred}" not found)` : '';
        console.log(`[COMPANY] Resolved company from API list: "${resolved}"${note}`);
        process.env.BEFFA_COMPANY = resolved;
        await this.page.evaluate((c) => localStorage.setItem('currentCompany', c), resolved).catch(() => {});
        return resolved;
      }
    }

    const meResp = await this.page.request.get(`${this.apiBase}/users/me?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (meResp.ok()) {
      const me = await meResp.json();
      const resolved = await pickFromList(me.user?.companies || me.companies || []);
      if (resolved) {
        console.log(`[COMPANY] Resolved company from user profile: "${resolved}"`);
        process.env.BEFFA_COMPANY = resolved;
        await this.page.evaluate((c) => localStorage.setItem('currentCompany', c), resolved).catch(() => {});
        return resolved;
      }
    }

    throw new Error(`[COMPANY] Could not resolve a valid company. Tried: ${[...candidates].join(', ') || '(none)'}`);
  }

  /**
   * Internal helper to retrieve the security bearer token from the session.
   */
  async _getAuthToken(): Promise<string | null> {
    return await this.page.evaluate(() => {
      const keys = ['token', 'auth-token', 'jwt', 'access_token', 'auth_data', 'session_token'];
      for (const k of keys) {
        const v = localStorage.getItem(k);
        if (v && v.length > 50) return v;
      }
      // Last-ditch: Scan all keys for a JWT pattern (ey...)
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)!;
        const v = localStorage.getItem(k);
        if (v && v.startsWith('ey')) return v;
      }
      return null;
    });
  }

  async smartSearch(container: Locator | null, text: string): Promise<void> {
    if (!text) return;
    const cleanText = text.trim();
    console.log(`[ACTION] Searching for: "${cleanText}"`);

    await this.startTacticalTimer(); // Start Tactical UI Timer

    for (let s = 0; s < 3; s++) {
      try {
        const target = container || this.page.locator('div[role="dialog"], .chakra-modal__content, .chakra-popover__content, .chakra-input__group').filter({ visible: true }).last();

        // 🛡️ CRITICAL: Only pick ENABLED text-like inputs, avoiding checkboxes/radios/numbers
        let searchBox = target.locator('input:enabled:not([type="number"]):not([type="hidden"]):not([type="checkbox"]):not([type="radio"])').filter({ visible: true }).first();

        if (!(await searchBox.isVisible({ timeout: 1000 }).catch(() => false))) {
          searchBox = target.locator('input[placeholder*="Search" i]:enabled:not([type="checkbox"]), input[role="textbox"]:enabled').filter({ visible: true }).last();
        }

        await searchBox.waitFor({ state: 'visible', timeout: 8000 });
        await searchBox.click({ force: true });
        await searchBox.clear();

        await searchBox.fill(cleanText);
        await this.page.waitForTimeout(2000);

        const trySelection = async (): Promise<boolean> => {
          const overlayList = this.page.locator('.chakra-popover__content, [role="listbox"], .chakra-menu__list, div[data-placement]').filter({ visible: true }).last();

          // Tier 1: Exact match within direct container
          const containerExact = target.getByText(cleanText, { exact: true }).first();
          if (await containerExact.isVisible({ timeout: 1000 }).catch(() => false)) {
            console.log(`[INFO] Tier 1 - exact in dialog: "${cleanText}"`);
            await containerExact.click({ force: true });
            return true;
          }

          // Tier 2: Search visible overlay/portal
          if (await overlayList.isVisible({ timeout: 1000 }).catch(() => false)) {
            const overlayExact = overlayList.getByText(cleanText, { exact: true }).first();
            if (await overlayExact.isVisible({ timeout: 1000 }).catch(() => false)) {
              console.log(`[INFO] Tier 2 - exact in overlay: "${cleanText}"`);
              await overlayExact.click({ force: true });
              return true;
            }
            const overlayContains = overlayList.getByText(cleanText, { exact: false }).first();
            if (await overlayContains.isVisible({ timeout: 1000 }).catch(() => false)) {
              console.log(`[INFO] Tier 2 - contains in overlay: "${cleanText}"`);
              await overlayContains.click({ force: true });
              return true;
            }
          }

          // Tier 3: Contains match WITHIN dialog
          const containerContains = target.getByText(cleanText, { exact: false }).first();
          if (await containerContains.isVisible({ timeout: 1000 }).catch(() => false)) {
            console.log(`[INFO] Tier 3 - contains in dialog: "${cleanText}"`);
            await containerContains.click({ force: true });
            return true;
          }

          // Tier 4: ID vs Name fallback (Allow this blind click for Document IDs OR Numeric Codes)
          const isIdOrCode = cleanText.includes('/') || /^\d+$/.test(cleanText);
          if (isIdOrCode) {
            let fallbackItem = null;
            const clickableSelectors = 'button:not([aria-label]), [role="option"], [role="menuitem"], li, .chakra-menu__menuitem, label, .chakra-checkbox, [role="checkbox"]';
            const validItemFilter = { hasNotText: /^\s*(\+?\s*Add|Clear|New|No more items)\s*$/i };

            if (await overlayList.isVisible({ timeout: 1000 }).catch(() => false)) {
              fallbackItem = overlayList.locator(clickableSelectors).filter({ visible: true }).filter(validItemFilter).first();
            } else {
              fallbackItem = target.locator(clickableSelectors).filter({ visible: true }).filter(validItemFilter).first();
            }

            if (await fallbackItem!.isVisible({ timeout: 1000 }).catch(() => false)) {
              await fallbackItem!.click({ force: true });
              return true;
            }
          }
          return false;
        };

        // Attempt 1: Normal Search
        let clicked = await trySelection();

        // Attempt 2 (Fallback trick if backend hung): Backspace one char to trigger state
        if (!clicked) {
          console.log(`[WARN] Original search didn't bring up "${cleanText}". Pressing backspace to wake up backend fetch...`);
          await searchBox.press('Backspace');
          await this.page.waitForTimeout(3000); // Allow backend to hit
          clicked = await trySelection();
        }

        if (!clicked) {
          throw new Error(`No visible accurate dropdown result found for "${cleanText}"`);
        }

        // ⚡ NEW: Verification check - Ensure the selection "sticks"
        // We wait a moment for reactive frameworks to update the field or close the dialog
        await this.page.waitForTimeout(800);

        // If the dialog is still open and we clicked something, maybe it didn't register?
        // We try hitting Enter as a final "commit" signal for some ERP inputs
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(500);
        await this.page.keyboard.press('Escape');

        console.log(`[SUCCESS] Selected: "${cleanText}"`);
        await this.stopTacticalTimer(`Smart Search: ${cleanText}`, 'UI');
        return;
      } catch (e: any) {
        console.log(`[WARNING] Search attempt ${s + 1} failed: ${e.message}`);
        await this.page.waitForTimeout(2000);
      }
    }
    throw new Error(`[ERROR] smartSearch failed to find and click "${cleanText}" accurately after 3 attempts.`);
  }

  async extractDetailValue(label: string): Promise<string> {
    const el = this.page.locator('.chakra-stack, div').filter({ hasText: new RegExp(`^${label}`, 'i') }).last();
    // We navigate to the parent to ensure we get the full text block containing both label and value
    const text = (await el.locator('xpath=..').innerText().catch(() => '')).trim();
    // Regex matches the label and captures everything after the colon or space, until the end of the line
    const match = text.match(new RegExp(`${label}[\\s:]+([^\\n\\r]+)`, 'i'));
    return match ? match[1].trim() : text.replace(new RegExp(`${label}`, 'i'), '').replace(/:/g, '').trim();
  }

  async getActiveCalendarDay(): Promise<number> {
    const calendarMode = await this.page.evaluate(() => localStorage.getItem('calendar') || 'EC');

    if (calendarMode.toUpperCase() === 'EC') {
      const now = new Date();
      const gDay = now.getDate();
      const gMonth = now.getMonth() + 1; // 1-12

      // 🇪🇹 Precise Ethiopian Translation for April (Megabit)
      // April 1st (GC) = Megabit 23rd (EC)
      // Today (April 3rd) = Megabit 25th (EC) -> Offset: +22
      if (gMonth === 4) {
        // Handle Megabit -> Miyazya overflow correctly (30 days max per EC month)
        const ethiopianDay = (gDay + 22) % 30 || 30;
        console.log(`[CALENDAR] Ethiopian mode: Today is mapped to EC Day ${ethiopianDay}.`);
        return ethiopianDay;
      }

      // Fallback for other months if needed during transition
      return gDay;
    }

    return new Date().getDate();
  }

  async fillDate(labelOrIndex: string | number, dateValue: string): Promise<void> {
    // Extract day number for the grid click
    const dayToSelect = parseInt(dateValue.split('/')[0], 10).toString();
    console.log(`[ACTION] Filling date ${dateValue} -> Targeting UI day: ${dayToSelect}`);

    await this.startTacticalTimer(); // Start Tactical UI Timer

    let btn: Locator;
    if (typeof labelOrIndex === 'string') {
      const container = this.page.locator('.chakra-form-control, [role="group"], .flex-col, div')
        .filter({ has: this.page.getByText(new RegExp(`^${labelOrIndex}\\s*\\*?$`, 'i')) })
        .filter({ has: this.page.locator('button') })
        .last();
      btn = container.locator('button').first();
    } else {
      btn = this.page.locator('button:has(span.formatted-date), button.trigger-button').filter({ visible: true }).nth(labelOrIndex);
    }

    await btn.click({ force: true });
    await this.page.waitForTimeout(1000);

    const popover = this.page.locator('[role="dialog"], [data-slot="popover-content"], [id^="radix-"], .chakra-popover__content').filter({ visible: true }).last();
    // Use precise button targeting for the day number
    const dayBtn = popover.locator('button').filter({ hasText: new RegExp(`^${dayToSelect}$`) }).first();

    if (await dayBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await dayBtn.click({ force: true });
      console.log(`[SUCCESS] Day ${dayToSelect} selected in the current active calendar grid.`);
    } else {
      console.log(`[WARN] Day ${dayToSelect} not found in grid. Using fallback type...`);
      await this.page.keyboard.type(dateValue);
      await this.page.keyboard.press('Enter');
    }
    await this.page.waitForTimeout(1000);
    await this.stopTacticalTimer(`Fill Date: ${labelOrIndex}`, 'UI');
  }

  async pickDate(label: string, dayNum?: number): Promise<void> {
    const targetDay = dayNum || await this.getActiveCalendarDay();
    console.log(`[ACTION] Picking date: "${label}" -> Targeting Day ${targetDay}`);

    await this.startTacticalTimer(); // Start Tactical UI Timer

    let container = this.page.locator('.chakra-form-control, [role="group"], .flex-col, div')
      .filter({ has: this.page.getByText(new RegExp(`^${label}\\s*\\*?$`, 'i')) })
      .filter({ has: this.page.locator('button') })
      .last();

    if (!(await container.isVisible().catch(() => false))) {
      container = this.page.locator('.chakra-form-control, [role="group"], div')
        .filter({ has: this.page.getByText(new RegExp(`${label}`, 'i')) })
        .filter({ has: this.page.locator('button') })
        .last();
    }

    const btn = container.locator('button').first();
    await btn.click({ force: true });
    await this.page.waitForTimeout(1000);

    const popover = this.page.locator('[role="dialog"], [data-slot="popover-content"], [id^="radix-"], .chakra-popover__content').filter({ visible: true }).last();
    const dayBtn = popover.locator('button').filter({ hasText: new RegExp(`^${targetDay}$`) }).first();

    if (await dayBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await dayBtn.click({ force: true });
      console.log(`[SUCCESS] "${label}" set to Day ${targetDay} (Calendar match).`);
    } else {
      console.log(`[WARN] Could not find day ${targetDay}. Fallback to direct key press.`);
      await this.page.keyboard.type(String(targetDay));
      await this.page.keyboard.press('Enter');
      await this.page.keyboard.press('Tab');
    }
    await this.page.waitForTimeout(1000);
    await this.stopTacticalTimer(`Pick Date: ${label}`, 'UI');
  }

  async selectRandomOption(selector: Locator, labelName: string, isOptional: boolean = false): Promise<number> {
    const optionSelector = '[role="checkbox"], .chakra-checkbox, [role="option"], [role="menuitem"], .chakra-menu__menuitem';

    await this.startTacticalTimer(); // Start Tactical UI Timer

    for (let i = 0; i < 3; i++) {
      try {
        await selector.scrollIntoViewIfNeeded();
        await selector.click({ timeout: 5000 });
        await this.page.waitForTimeout(1500);
        const options = this.page.locator(optionSelector).filter({ visible: true });
        const count = await options.count();
        if (count > 0) {
          const randomIndex = Math.floor(Math.random() * count);
          const target = options.nth(randomIndex);
          await target.evaluate((node: HTMLElement) => node.click());
          await this.page.keyboard.press('Escape');
          await this.stopTacticalTimer(`Random Selection: ${labelName}`, 'UI');
          return count;
        } else {
          await this.page.keyboard.press('Escape');
          if (isOptional) return 0;
        }
      } catch (e) {
        await this.page.keyboard.press('Escape');
      }
    }
    if (!isOptional) throw new Error(`[ERROR] Failed selection for ${labelName}`);
    return 0;
  }

  getTransactionDates(): { soDate: string; invoiceDate: string; dueDate: string } {
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 30);
    const fmt = (d: Date) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };
    return { soDate: fmt(today), invoiceDate: fmt(today), dueDate: fmt(due) };
  }

  getInvoiceDates(): { invoiceDate: string; dueDate: string } {
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 30);
    const fmt = (d: Date) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      return `${dd}/${mm}/${d.getFullYear()}`;
    };
    return { invoiceDate: fmt(today), dueDate: fmt(due) };
  }

  async getTableColumnMap(selector: string = 'table thead th'): Promise<Record<string, number>> {
    const headers = this.page.locator(selector);
    const count = await headers.count();
    const map: Record<string, number> = {};
    for (let h = 0; h < count; h++) {
      const text = (await headers.nth(h).innerText().catch(() => '')).trim().toLowerCase();
      if (text) map[text] = h;
    }
    return map;
  }

  async getAccountBalanceAPI(accountId: string, companyOverride?: string): Promise<number> {
    const token = await this._getAuthToken();
    const company = companyOverride || await this.page.evaluate(() => localStorage.getItem('currentCompany')) || process.env.BEFFA_COMPANY || 'sample';
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';

    // Fetch all accounts and filter locally to ensure we find the exact UUID
    const url = `${this.apiBase}/accounts?page=1&pageSize=1000&year=${year}&period=${period}&calendar=${calendar}`;

    const response = await this.page.request.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company': company,
        'x-role': 'IT Administrator / User Manager'
      }
    });

    if (!response.ok()) {
      console.log(`[WARN] GL Balance Query Failed. Status: ${response.status()}`);
      return 0;
    }

    const data = await response.json();
    const list = data.items || data.data || [];
    const targetAccount = list.find((a: any) => a.id === accountId);

    if (!targetAccount) {
      console.log(`[WARN] GL Audit: Account ${accountId} not found in the COA list.`);
      return 0;
    }

    const balance = parseFloat(targetAccount.balance || targetAccount.current_balance || '0');
    console.log(`[GL_AUDIT] Account: ${targetAccount.name} | Balance: ${balance.toFixed(2)}`);
    return balance;
  }

  async getMultiAccountBalancesAPI(accountIds: string[], companyOverride?: string): Promise<Record<string, number>> {
    const token = await this._getAuthToken();
    const company = companyOverride || await this.page.evaluate(() => localStorage.getItem('currentCompany')) || process.env.BEFFA_COMPANY || 'sample';
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';

    const url = `${this.apiBase}/accounts?page=1&pageSize=1000&year=${year}&period=${period}&calendar=${calendar}`;
    const response = await this.page.request.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company': company,
        'x-role': 'IT Administrator / User Manager'
      }
    });

    if (!response.ok()) return {};

    const data = await response.json();
    const list = data.items || data.data || [];
    const balances: Record<string, number> = {};

    accountIds.forEach(id => {
      const acc = list.find((a: any) => a.id === id);
      if (acc) {
        balances[id] = parseFloat(acc.balance || acc.current_balance || '0');
        console.log(`[SNAPSHOT] ${acc.name}: ${balances[id].toFixed(2)}`);
      }
    });

    return balances;
  }

  async getAllAccountsAPI(companyOverride?: string): Promise<any[]> {
    const token = await this._getAuthToken();
    const company = companyOverride || await this.page.evaluate(() => localStorage.getItem('currentCompany')) || process.env.BEFFA_COMPANY || 'sample';
    const year = process.env.BEFFA_YEAR || '2018';

    const url = `${this.apiBase}/accounts?page=1&pageSize=1000&year=${year}&period=yearly&calendar=ec`;
    const response = await this.page.request.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company': company,
        'x-role': 'IT Administrator / User Manager'
      }
    });

    if (!response.ok()) return [];
    const data = await response.json();
    return data.items || data.data || [];
  }

  /** Parse 422 insufficient-balance payment errors; returns top-up amount needed or null. */
  parseInsufficientCashTopUp(errorText: string): number | null {
    if (!/insufficient balance/i.test(errorText)) return null;
    const match = errorText.match(/available\s+(-?[\d.]+),\s*required\s+([\d.]+)/i);
    if (!match) return null;
    const available = parseFloat(match[1]);
    const required = parseFloat(match[2]);
    return Math.ceil(required - available + 1000);
  }

  /** Inject cash into a cash/bank account via an approved standalone receipt. */
  async seedCashBalanceAPI(amount: number, cashAccountId?: string): Promise<void> {
    const token = await this._getAuthToken();
    const company = process.env.BEFFA_COMPANY as string;
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;
    const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const acctResp = await this.page.request.get(`${this.apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
    const acctData = await acctResp.json();
    const allAccounts = acctData.items || acctData.data || [];
    const cashAccount = cashAccountId
      ? allAccounts.find((a: any) => a.id === cashAccountId)
      : allAccounts.find((a: any) =>
          a.account_type?.toLowerCase().includes('cash') || a.account_type?.toLowerCase().includes('bank')
        ) || allAccounts[0];

    const glAccount = allAccounts.find((a: any) =>
      a.account_type?.toLowerCase().includes('receivable')
    ) || allAccounts[1] || allAccounts[0];

    const custResp = await this.page.request.get(`${this.apiBase}/customers?page=1&pageSize=10&${params}`, { headers });
    const custData = await custResp.json();
    const customer = custData.items?.[0] || custData.data?.[0];

    const currResp = await this.page.request.get(`${this.apiBase}/currency?${params}`, { headers });
    const currData = await currResp.json();
    const currency = currData.items?.[0] || currData.data?.[0];

    if (!cashAccount || !customer || !currency) {
      throw new Error('[CASH_TOPUP] Discovery failed: missing cash account, customer, or currency.');
    }

    const roundedAmount = Math.ceil(amount);
    const payload = {
      amount: roundedAmount,
      cash_account_id: cashAccount.id,
      customer_id: customer.id,
      date: new Date().toISOString(),
      payment_method: 'cash',
      currency_id: currency.id,
      receipt_items: [{
        amount: roundedAmount,
        general_ledger_account_id: glAccount.id,
        unit_price: roundedAmount,
        quantity: 1,
        description: 'E2E Cash Balance Top-Up'
      }]
    };

    console.log(`[CASH_TOPUP] Seeding ${roundedAmount} into ${cashAccount.name || cashAccount.id}...`);
    const response = await this.page.request.post(`${this.apiBase}/receipts?${params}`, { data: payload, headers });
    if (!response.ok()) throw new Error(`[CASH_TOPUP] Receipt creation failed: ${response.status()} - ${await response.text()}`);

    const receipt = await response.json();
    await this.advanceDocumentAPI(receipt.id, 'receipts');
    await this.page.waitForTimeout(2000);
    console.log(`[CASH_TOPUP] Successfully seeded ${roundedAmount} (receipt ${receipt.ref})`);
  }
}
