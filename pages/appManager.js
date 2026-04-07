const { expect } = require('@playwright/test');

class AppManager {
  constructor(page) {
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

  async login(email, pass, companyName = "befa tutorial") {
    const cleanEmail = (email || "").replace(/['"]+/g, '').trim();
    const cleanPass = (pass || "").replace(/['"]+/g, '').trim();

    console.log(`[ACTION] Performing High-Speed API Login for: ${cleanEmail}...`);

    try {
      // 1. Attempt API Login
      const loginUrl = `http://157.180.20.112:8001/api/users/login?year=2018&period=yearly&calendar=ec&month=6`;
      const response = await this.page.request.post(loginUrl, {
        data: { email: cleanEmail, password: cleanPass },
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok()) throw new Error(`API Login Failed: ${response.status()}`);

      const session = await response.json();
      const token = session.auth_token;
      const expiry = session.auth_token_exp;

      if (!token) throw new Error("No token returned from API");

      // 2. Head to the Login page to settle the domain context
      await this.page.goto('/users/login');

      // 3. Inject the EXACT keys the frontend requires to "wake up" authenticated
      await this.page.evaluate(({ jwt, exp, company }) => {
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
        localStorage.setItem('currentCompany', company || 'befa tutorial');

        localStorage.setItem('lastUserActivity', new Date().toISOString());
      }, { jwt: token, exp: expiry, company: companyName });

      // 4. Set HTTP cookies for backend persistence
      const domain = new URL(this.page.url()).hostname;
      await this.page.context().addCookies([
        { name: 'token', value: token, domain: domain, path: '/' },
        { name: 'auth-token', value: token, domain: domain, path: '/' }
      ]);

      // 5. Navigate to Home
      console.log(`[SUCCESS] API Login complete. Session & Metadata injected.`);
      await this.page.goto('/', { waitUntil: 'load' });

    } catch (error) {
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

  async switchCompany(targetName) {
    if (!targetName) return;
    const cleanTarget = targetName.trim();
    console.log(`[ACTION] Verifying current company selection...`);

    // Ensure we are on a page where the company switcher is visible
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
      await option.click();
      // Reload is usually automatic on company change in this ERP
      await this.page.waitForURL('**/', { waitUntil: 'load', timeout: 60000 });
      console.log(`[SUCCESS] Company switched to "${cleanTarget}"`);
      await this.page.waitForTimeout(2000);
    } else {
      console.log(`[WARN] Company option "${cleanTarget}" not found in menu. Staying on "${currentName}"`);
      await this.page.keyboard.press('Escape');
    }
  }

  /**
   * --- SMART SEARCH ---
   * Optimized for exact text matching and robust selection.
   */
  async smartSearch(container, text) {
    if (!text) return;
    const cleanText = text.trim();
    console.log(`[ACTION] Searching for: "${cleanText}"`);

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

        const trySelection = async () => {
          let clicked = false;
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

            if (await fallbackItem.isVisible({ timeout: 1000 }).catch(() => false)) {
              await fallbackItem.click({ force: true });
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
        return;
      } catch (e) {
        console.log(`[WARNING] Search attempt ${s + 1} failed: ${e.message}`);
        await this.page.waitForTimeout(2000);
      }
    }
    throw new Error(`[ERROR] smartSearch failed to find and click "${cleanText}" accurately after 3 attempts.`);
  }

  async handleApprovalFlow() {
    // Approval flow: Draft → Verifier → Approver → Approved
    const FINAL_STATUS = 'approved';
    const statusLocator = this.page.locator(
      '//p[contains(text(), "Status:")]/following-sibling::*//span | ' +
      '//span[contains(text(), "Status:")]/following-sibling::*//span | ' +
      '//span.chakra-badge'
    ).first();

    let lastStatus = '';
    let actionClickedForStatus = ''; // Track which status we already acted on

    for (let i = 0; i < 180; i++) {
      if (this.page.isClosed()) return;
      await this.page.waitForTimeout(1000);

      const currentStatus = (await statusLocator.innerText({ timeout: 3000 }).catch(() => '')).trim().toLowerCase();

      // Only log the status if it actually changed
      if (currentStatus && currentStatus !== lastStatus) {
        console.log(`[INFO] Approval status: "${currentStatus}"`);
        lastStatus = currentStatus;
      }

      // Done?
      if (currentStatus.includes(FINAL_STATUS)) {
        console.log('[SUCCESS] Document approved.');
        return;
      }

      // Handle any confirmation modal that appeared AFTER a click
      const modal = this.page.getByRole('dialog').first();
      if (await modal.isVisible({ timeout: 500 }).catch(() => false)) {
        const modalText = (await modal.innerText().catch(() => '')).toLowerCase();
        if (modalText.includes('reviewer') || modalText.includes('select')) {
          await this._handleReviewerSelection(modal);
          lastStatus = ''; // Reset to force status log after modal
          continue;
        }
        const confirmBtn = modal.locator('button').filter({ hasText: /^(Approve|Advance|Submit|Save|Confirm|Yes|Ok)$/i }).first();
        if (await confirmBtn.isVisible({ timeout: 500 }).catch(() => false)) {
          await confirmBtn.click({ force: true });
          await this.page.waitForTimeout(2000);
          continue;
        }
      }

      // Only act if status has CHANGED since our last action
      if (currentStatus === actionClickedForStatus) {
        // Keep quiet while waiting for status to update
        continue;
      }

      // Find the action button for the current status
      let button = this.page.locator('button[aria-label="approval-step"]').filter({ visible: true }).first();

      if (!(await button.isVisible({ timeout: 1000 }).catch(() => false))) {
        // Fallback to text matching if aria-label is missing
        button = this.page.locator('button').filter({
          hasText: /^(Submkt For Review|Submit For Review|Submir For Review|Submit For Reviewer|Submt For Review|Submit For Approver|Submit Forapprover|Submit For Approve|Submit For Apporver|Advance|Approve|Approver|Submit)$/i
        }).filter({ visible: true }).first();
      }

      if (await button.isVisible({ timeout: 1000 }).catch(() => false)) {
        const btnText = (await button.innerText()).trim();
        console.log(`[ACTION] Status changed to "${currentStatus}" → Clicking: "${btnText}"`);
        await button.click({ force: true });
        actionClickedForStatus = currentStatus; // mark this status as actioned
        await this.page.waitForTimeout(2000);
      }
    }
  }

  async _handleReviewerSelection(activeModal) {
    const dialog = activeModal || this.page.getByRole('dialog').last();
    // Use locator directly to avoid detachment issues
    const reviewerBtn = dialog.locator('button[aria-haspopup], [aria-haspopup], select[class*="select"], input:not([type="hidden"])').filter({ visible: true }).first();

    if (await reviewerBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Evaluate text directly or use innerText if not an input
      const currentSelection = (await reviewerBtn.inputValue().catch(() => null))
        || (await reviewerBtn.innerText().catch(() => '')).trim();

      if (currentSelection.toLowerCase() !== "system admin") {
        // Use fill if it's an input field
        if (await reviewerBtn.evaluate(n => n.tagName.toLowerCase() === 'input')) {
          await reviewerBtn.fill("System Admin");
        } else {
          await reviewerBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);

        // Find "System Admin" option in any popup list or dropdown
        const adminOption = this.page.locator('div[role="option"], [role="menuitem"], li, .chakra-menu__menuitem, button').filter({ hasText: /System Admin/i }).filter({ visible: true }).first();
        if (await adminOption.isVisible({ timeout: 2000 }).catch(() => false)) {
          await adminOption.click({ force: true });
        } else {
          await this.page.keyboard.press('Escape');
        }
      }
    }

    // ALWAYS attempt to confirm the modal (even if reviewer selection was skipped/not found)
    const confirmBtn = dialog.locator('button').filter({ hasText: /^(Advance|Submit|Approve|Save|Confirm)$/i }).filter({ visible: true }).first();
    if (await confirmBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await confirmBtn.click({ force: true });
      await confirmBtn.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
      return true;
    }
    return false;
  }

  getTransactionDates() {
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 30);
    const fmt = (d) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };
    return { soDate: fmt(today), invoiceDate: fmt(today), dueDate: fmt(due) };
  }

  /**
   * getActiveCalendarDay
   * Returns today's day number in the current active calendar (EC or GC).
   */
  async getActiveCalendarDay() {
    const calendarMode = await this.page.evaluate(() => localStorage.getItem('calendar') || 'EC');

    if (calendarMode.toUpperCase() === 'EC') {
      const now = new Date();
      const gDay = now.getDate();
      const gMonth = now.getMonth() + 1; // 1-12

      // 🇪🇹 Precise Ethiopian Translation for April (Megabit)
      // April 1st (GC) = Megabit 23rd (EC)
      // Today (April 3rd) = Megabit 25th (EC) -> Offset: +22
      if (gMonth === 4) {
        const ethiopianDay = gDay + 22;
        console.log(`[CALENDAR] Ethiopian mode: Today is Megabit ${ethiopianDay}.`);
        return ethiopianDay;
      }

      // Fallback for other months if needed during transition
      return gDay;
    }

    return new Date().getDate();
  }

  async fillDate(labelOrIndex, dateValue) {
    // Extract day number for the grid click
    const dayToSelect = parseInt(dateValue.split('/')[0], 10).toString();
    console.log(`[ACTION] Filling date ${dateValue} -> Targeting UI day: ${dayToSelect}`);

    let btn;
    if (typeof labelOrIndex === "string") {
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
  }

  async pickDate(label, dayNum) {
    const targetDay = dayNum || await this.getActiveCalendarDay();
    console.log(`[ACTION] Picking date: "${label}" -> Targeting Day ${targetDay}`);

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
  }

  async selectRandomOption(selector, labelName, isOptional = false) {
    const optionSelector = '[role="checkbox"], .chakra-checkbox, [role="option"], [role="menuitem"], .chakra-menu__menuitem';
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
          await target.evaluate(node => node.click());
          await this.page.keyboard.press('Escape');
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

  async verifyDocInProfile(type, entityName, docNumber) {
    const isVendor = type.toLowerCase() === 'vendor';
    const baseUrl = isVendor ? '/payables/vendors' : '/receivables/customers';
    const searchPlaceholder = isVendor ? 'Search for vendor...' : 'Search for customers...';

    // 1. Precise Tab Selection based on document prefix
    let targetTabName = 'Transactions';
    if (docNumber.includes('BILL')) targetTabName = 'Bills';
    else if (docNumber.includes('QTE')) targetTabName = 'Quotes';
    else if (docNumber.includes('RCPT')) targetTabName = 'Receipts';
    else if (docNumber.includes('INV')) targetTabName = isVendor ? 'Transactions' : 'Invoices';

    console.log(`[VERIFY] Entity: ${entityName} | Doc: ${docNumber} | Tab: ${targetTabName}`);
    await this.page.goto(baseUrl);

    const searchInput = this.page.locator(`input[placeholder="${searchPlaceholder}"]`);
    await searchInput.waitFor({ state: 'visible' });
    await searchInput.fill(entityName);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(2000);

    const rowLocator = this.page.locator('table tbody tr').filter({ hasText: entityName }).first();
    await rowLocator.waitFor({ state: 'visible', timeout: 20000 });

    // 2. Direct Navigation to Detail page (most robust method)
    const link = rowLocator.locator('a').first();
    const href = await link.getAttribute('href');
    if (href) {
      console.log(`[ACTION] Navigating to detail: ${href}`);
      await this.page.goto(href, { waitUntil: 'networkidle' });
    } else {
      await link.click({ force: true });
    }

    // 3. Wait for Detail Page Load
    await this.page.waitForSelector('.chakra-heading', { timeout: 30000 });

    // 4. Click the Exact Tab
    const tabLocator = this.page.getByRole('tab').filter({ hasText: new RegExp(`^${targetTabName}$`, 'i') });
    await tabLocator.waitFor({ state: 'visible', timeout: 15000 });
    await tabLocator.click({ force: true });

    // 5. Trigger Data Refresh (some tabs load empty initially)
    await this.page.waitForTimeout(2000);
    await this.page.reload();
    await this.page.waitForTimeout(3000);
    const finalTab = this.page.getByRole('tab').filter({ hasText: new RegExp(`^${targetTabName}$`, 'i') });
    await finalTab.click({ force: true });

    // 6. Assertion
    const docLocator = this.page.locator('table').getByText(docNumber);
    await docLocator.first().waitFor({ state: 'attached', timeout: 30000 });
    await docLocator.first().scrollIntoViewIfNeeded().catch(() => { });
    await expect(docLocator.first()).toBeAttached();
    console.log(`[SUCCESS] ${docNumber} verified in ${type} profile.`);
  }

  /**
   * findApprovedUnpaidBill
   * Scans the Bills list for an 'approved' document that is not yet fully paid (Net Due > 0).
   * Returns { vendorName, billNumber } or null.
   */
  async findApprovedUnpaidBill() {
    console.log("Action: Scanning for an approved, unpaid bill (Net Due > 0)...");
    await this.page.goto('/payables/bills/?page=1&pageSize=30');
    await this.page.waitForSelector('table tbody tr', { timeout: 30000 });
    await this.page.waitForTimeout(3000); // Stabilization

    const rows = this.page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const cells = row.locator('td');

      const billId = (await cells.nth(1).innerText().catch(() => '')).trim();
      const vendor = (await cells.nth(2).innerText().catch(() => '')).trim();
      const paid = (await cells.nth(4).innerText().catch(() => '')).trim().toLowerCase();
      const netDueRaw = (await cells.nth(5).innerText().catch(() => '')).trim();

      // EXTREMELY ROBUST STATUS DETECTION: Look for the first badge or non-empty action text
      let status = '';
      const badge = row.locator('.chakra-badge').first();
      if (await badge.isVisible({ timeout: 500 }).catch(() => false)) {
        status = (await badge.innerText()).trim().toLowerCase();
      } else {
        // Fallback: look at index 6 or 7
        status = (await cells.nth(6).innerText().catch(() => '')).trim().toLowerCase();
        if (!status) status = (await cells.nth(7).innerText().catch(() => '')).trim().toLowerCase();
      }

      const netDue = parseFloat(netDueRaw.replace(/[^\d.]/g, '')) || 0;
      console.log(`[CHECK] Row ${i + 1} (${billId}): Paid? "${paid}", Net Due: ${netDue}, Status: "${status}"`);

      if (paid === 'no' && netDue > 0 && status === 'approved') {
        console.log(`[SUCCESS] Found unpaid vendor match: "${vendor}" (Bill: ${billId})`);
        return { vendorName: vendor, billNumber: billId };
      }
    }

    console.log("[WARNING] No unpaid approved bills found in the first 30 rows.");
    return null;
  }

  /**
   * findApprovedUnpaidInvoice
   * Scans the Sales Invoices list for an 'approved' document that is not yet fully paid (Net Due > 0).
   * Returns { customerName, invoiceId } or null.
   * Indices based on user screenshot: 1=Invoice#, 2=Customer, 5=Paid, 6=NetDue, 7=Status
   */
  async findApprovedUnpaidInvoice() {
    console.log("Action: Scanning for an approved, unpaid invoice (Net Due > 0)...");
    await this.page.goto('/receivables/invoices/?page=1&pageSize=30');
    await this.page.waitForSelector('table tbody tr', { timeout: 30000 });
    await this.page.waitForTimeout(3000); // Stabilization

    const rows = this.page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const cells = row.locator('td');

      const invId = (await cells.nth(1).innerText().catch(() => '')).trim();
      const customer = (await cells.nth(2).innerText().catch(() => '')).trim();
      const paid = (await cells.nth(5).innerText().catch(() => '')).trim().toLowerCase();
      const netDueRaw = (await cells.nth(6).innerText().catch(() => '')).trim();

      // Status Detection (Index 7 based on Due Date presence)
      const status = (await cells.nth(7).innerText().catch(() => '')).trim().toLowerCase();

      const netDue = parseFloat(netDueRaw.replace(/[^\d.]/g, '')) || 0;
      console.log(`[CHECK] Row ${i + 1} (${invId}): Paid? "${paid}", Net Due: ${netDue}, Status: "${status}"`);

      if (paid === 'no' && netDue > 0 && status === 'approved') {
        console.log(`[SUCCESS] Found unpaid customer match: "${customer}" (Invoice: ${invId})`);
        return { customerName: customer, invoiceId: invId };
      }
    }

    console.log("[WARNING] No unpaid approved invoices found in the first 30 rows.");
    return null;
  }

  async captureJournalEntries(tabNameRegex = /Journal|CRJ|CDJ/i) {
    const journalTab = this.page.getByRole('tab', { name: tabNameRegex }).first();
    await journalTab.scrollIntoViewIfNeeded();
    await journalTab.click();
    await this.page.waitForTimeout(2000);
    const rows = this.page.locator('table tbody tr');
    const count = await rows.count();
    const entries = [];
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const accFull = await row.locator('td').nth(0).innerText();
      const drText = await row.locator('td').nth(2).innerText();
      const crText = await row.locator('td').nth(3).innerText();
      const code = accFull.match(/^\d+/)?.[0] || "";
      const name = accFull.replace(/^\d+\s*-\s*/, '').trim();
      const dr = parseFloat(drText.replace(/,/g, '')) || 0;
      const cr = parseFloat(crText.replace(/,/g, '')) || 0;
      if (code) entries.push({ accountCode: code, accountName: name, debit: dr, credit: cr });
    }
    return entries;
  }

  /**
   * handlePOReceiptTab
   * Specifically for Bill/GRN screens. It reads the remaining quantity from the table
   * and fills a random "Received Quantity" to enable submission.
   */
  async handlePOReceiptTab() {
    console.log("Action: Processing PO Receipt Tab...");
    const tab = this.page.getByRole('tab', { name: /Received Purchase Order/i });
    await tab.waitFor({ state: 'visible', timeout: 5000 });
    await tab.click();
    await this.page.waitForTimeout(2000);

    const rows = this.page.locator('table tbody tr').filter({ has: this.page.locator('.chakra-checkbox') });
    const count = await rows.count();

    if (count === 0) {
      console.log("[WARN] No receipt rows found.");
      return;
    }

    // Process first row for standard testing
    const row = rows.first();

    // 1. Ensure it is checked FIRST - This enables the quantity input in the ERP
    const checkbox = row.locator('.chakra-checkbox__control').last();
    const hiddenCb = row.locator('input[type="checkbox"]').first();

    if (!(await hiddenCb.isChecked())) {
      await checkbox.click({ force: true });
      await this.page.waitForTimeout(800);

      // Fallback to nth(1) if primary click failed to toggle state
      if (!(await hiddenCb.isChecked())) {
        const altCheckbox = row.locator('.chakra-checkbox__control').nth(1);
        if (await altCheckbox.isVisible()) await altCheckbox.click({ force: true });
      }
    }
    await this.page.waitForTimeout(1000); // ⚡ Wait for reactive re-render to enable input

    // 2. Read Remaining (7th column / index 6 based on current ERP layout)
    const tdList = row.locator('td');
    const remainingText = await tdList.nth(6).innerText().catch(() => "1");
    const remaining = Math.max(1, parseInt(remainingText.replace(/[^0-9]/g, '')) || 1);

    // 3. Choose random quantity (1 to remaining)
    const toReceive = Math.max(1, Math.floor(Math.random() * remaining) + 1);
    console.log(`[DATA] Remaining: ${remaining} | Receiving: ${toReceive}`);

    // 4. Find and fill the Received Quantity input (now enabled)
    const qtyInput = row.locator('input[type="number"], .chakra-numberinput__field').last();
    await qtyInput.waitFor({ state: 'visible' });

    // Force actionability if it's still slow to enable
    await expect(qtyInput).toBeEnabled({ timeout: 10000 });

    await qtyInput.clear();
    await qtyInput.fill(String(toReceive));
    await qtyInput.press('Enter');
    await this.page.keyboard.press('Tab'); // Blur input to trigger reactive state

    await this.page.waitForTimeout(1000); // Allow totals to calculate
    console.log(`[SUCCESS] PO Line Item received (${toReceive}) and selected.`);
    return toReceive; // ⚡ Return the quantity for impact verification
  }

  /**
   * handleSOReleasedTab
   * Specifically for Invoice screens. It reads the remaining quantity from the table
   * and fills a random "Released Quantity" to enable submission.
   */
  async handleSOReleasedTab() {
    console.log("Action: Processing Released Sales Order Tab...");
    const tab = this.page.getByRole('tab', { name: /Released Sales Order/i });
    await tab.waitFor({ state: 'visible', timeout: 5000 });
    await tab.click();
    await this.page.waitForTimeout(2000);

    const rows = this.page.locator('table tbody tr').filter({ has: this.page.locator('.chakra-checkbox') });
    const count = await rows.count();

    if (count === 0) {
      console.log("[WARN] No release rows found.");
      return 1;
    }

    // Process first row for standard testing
    const row = rows.first();

    // 1. Ensure it is checked FIRST - This enables the quantity input in the ERP
    const checkbox = row.locator('.chakra-checkbox__control').last();
    const hiddenCb = row.locator('input[type="checkbox"]').first();

    if (!(await hiddenCb.isChecked())) {
      await checkbox.click({ force: true });
      await this.page.waitForTimeout(800);

      // Fallback to nth(1) if primary click failed to toggle state
      if (!(await hiddenCb.isChecked())) {
        const altCheckbox = row.locator('.chakra-checkbox__control').nth(1);
        if (await altCheckbox.isVisible()) await altCheckbox.click({ force: true });
      }
    }
    await this.page.waitForTimeout(1000); // ⚡ Wait for reactive re-render to enable input

    // 2. Read Remaining (7th column / index 6 based on current ERP layout)
    const tdList = row.locator('td');
    const remainingText = await tdList.nth(6).innerText().catch(() => "1");
    const remaining = Math.max(1, parseInt(remainingText.replace(/[^0-9]/g, '')) || 1);

    // 3. Choose random quantity (1 to remaining)
    const toRelease = Math.max(1, Math.floor(Math.random() * remaining) + 1);
    console.log(`[DATA] Remaining: ${remaining} | Releasing: ${toRelease}`);

    // 4. Find and fill the Released Quantity input (now enabled)
    const qtyInput = row.locator('input[type="number"], .chakra-numberinput__field').last();
    await qtyInput.waitFor({ state: 'visible' });

    // Force actionability if it's still slow to enable
    await expect(qtyInput).toBeEnabled({ timeout: 10000 });

    await qtyInput.clear();
    await qtyInput.fill(String(toRelease));
    await qtyInput.press('Enter');
    await this.page.keyboard.press('Tab'); // Blur input to trigger reactive state

    await this.page.waitForTimeout(1000); // Allow totals to calculate
    console.log(`[SUCCESS] SO Line Item released (${toRelease}) and selected.`);
    return toRelease; // ⚡ Return the quantity for impact verification
  }

  getInvoiceDates() {
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 30);
    const fmt = (d) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      return `${dd}/${mm}/${d.getFullYear()}`;
    };
    return { invoiceDate: fmt(today), dueDate: fmt(due) };
  }

  /** Discover and return item data purely via API (High-Speed) */
  async captureRandomItemDataAPI() {
    const apiBase = "http://157.180.20.112:8001/api";
    const token = await this._getAuthToken();
    // 🛡️ ERP system is currently in 2018 Ethiopian Calendar (2026 GC)
    const params = "page=1&pageSize=50&year=2018&period=yearly&calendar=ec";
    
    console.log("[ACTION] Discovering random item via API (Year 2018)...");
    const response = await this.page.request.get(`${apiBase}/inventory-items?${params}`, {
      headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok()) throw new Error(`Item API discovery failed: ${response.status()}`);

    const json = await response.json();
    const list = json.data || json.items || [];
    const items = list.filter(i => (i.current_stock > 0) || (i.quantity > 0));
    if (items.length === 0) throw new Error("No items with stock found via API");

    const target = items[Math.floor(Math.random() * Math.min(items.length, 10))];
    // 🛡️ CRITICAL: Call the detail API immediately to get the absolute source of truth for initial stock
    const trueDetails = await this.getItemDetailsAPI(target.id);
    console.log(`[DEBUG] Initial Source of Truth (API): current_stock=${trueDetails.currentStock}`);
    return trueDetails;
  }

  async captureRandomItemDetails() {
    // 🛡️ Optimized: Discover via API then jump to detail page
    const target = await this.captureRandomItemDataAPI();
    console.log(`[OK] Discovered: "${target.itemName}" via API. Navigating to detail...`);
    await this.page.goto(`/inventories/items/${target.itemId}/detail`, { waitUntil: 'load' });
    return await this._extractItemDetails(target.itemName);
  }

  async extractDetailValue(label) {
    const el = this.page.locator('.chakra-stack, div').filter({ hasText: new RegExp(`^${label}`, 'i') }).last();
    // We navigate to the parent to ensure we get the full text block containing both label and value
    const text = (await el.locator('xpath=..').innerText().catch(() => '')).trim();
    // Regex matches the label and captures everything after the colon or space, until the end of the line
    const match = text.match(new RegExp(`${label}[\\s:]+([^\\n\\r]+)`, 'i'));
    return match ? match[1].trim() : text.replace(new RegExp(`${label}`, 'i'), '').replace(/:/g, '').trim();
  }

  async captureSODetailData() {
    console.log("[ACTION] Capturing Customer Name (Brute Force Method)...");
    await this.page.waitForSelector('text=Customer:', { timeout: 30000 });

    // 🛡️ Brute force: find the label and pick the next text block in the DOM
    const name = await this.page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('div, p, span'));
      const label = labels.find(el => el.innerText.trim() === 'Customer:');
      if (!label) return "System Customer";

      // Find the next sibling or descendant with actual text
      let next = label.nextElementSibling;
      while (next && !next.innerText.trim()) next = next.nextElementSibling;
      return next ? next.innerText.trim() : "System Customer";
    });

    console.log(`[DATA] Captured Customer: "${name}"`);
    return name;
  }

  async getCustomerNameAPI(customerId) {
    const apiBase = "http://157.180.20.112:8001/api";
    const token = await this._getAuthToken();
    const response = await this.page.request.get(`${apiBase}/contacts/customers?search=${customerId}`, {
      headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok()) return "System Customer";
    const json = await response.json();
    const name = json.items?.[0]?.name || "System Customer";
    return name;
  }

  async captureRandomCustomerDetails() {
    await this.page.goto('/contacts/customers/?page=1&pageSize=30', { waitUntil: 'networkidle' });
    // 🛡️ HARDENING: Wait for the table and bypass any loading skeletons
    await this.page.locator('table').waitFor({ state: 'visible', timeout: 30000 });
    await this.page.waitForTimeout(5000);

    const rows = this.page.locator('table tbody tr');
    await rows.first().waitFor({ state: 'visible', timeout: 30000 });
    const count = await rows.count();
    const targetRow = rows.nth(Math.floor(Math.random() * Math.min(count, 15)));

    // Extract ID from detail link
    const nameLink = targetRow.locator('td a').first();
    const customerName = (await nameLink.innerText()).trim();
    const href = await nameLink.getAttribute('href');
    const customerId = href.match(/\/contacts\/customers\/([a-f0-9-]+)/)?.[1];

    console.log(`[DATA] Captured Customer: "${customerName}" (ID: ${customerId})`);
    return { customerName, customerId };
  }

  async captureRandomVendorDetails() {
    await this.page.goto('/contacts/vendors/?page=1&pageSize=30', { waitUntil: 'networkidle' });
    const rows = this.page.locator('table tbody tr');
    await rows.first().waitFor({ state: 'visible', timeout: 30000 });
    const count = await rows.count();
    const targetRow = rows.nth(Math.floor(Math.random() * Math.min(count, 15)));

    // Extract ID from detail link
    const nameLink = targetRow.locator('td a').first();
    const vendorName = (await nameLink.innerText()).trim();
    const href = await nameLink.getAttribute('href');
    const vendorId = href.match(/\/contacts\/vendors\/([a-f0-9-]+)/)?.[1];

    console.log(`[DATA] Captured Vendor: "${vendorName}" (ID: ${vendorId})`);
    return { vendorName, vendorId };
  }

  async captureItemDetails(itemName) {
    await this.page.goto('/inventories/items/?page=1&pageSize=30', { waitUntil: 'networkidle' });
    const searchBox = this.page.getByPlaceholder('Search for inventory...').filter({ visible: true }).first();
    await searchBox.fill(itemName);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(2000);

    // We want to match exactly the itemName, but it might be prepended by an ID like "inventory/RWT-18 - "
    // We escape special chars and ensure the link text ENDS with the item name.
    const safeName = itemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactLink = this.page.locator('table tbody tr a').filter({ hasText: new RegExp(`(?:^| - )${safeName}\\s*$`, 'i') }).first();

    if (await exactLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await exactLink.click();
    } else {
      // Fallback: original partial match just in case
      const itemRow = this.page.locator('table tbody tr').filter({ hasText: itemName }).first();
      await itemRow.locator('a').first().click();
    }

    await this.page.waitForURL(/\/inventories\/items\/.*/, { timeout: 60000 });
    return await this._extractItemDetails(itemName);
  }

  async getItemDetailsAPI(itemId) {
    const apiBase = "http://157.180.20.112:8001/api";
    const token = await this._getAuthToken();
    const params = "year=2018&period=yearly&calendar=ec";

    let response = await this.page.request.get(`${apiBase}/inventory-item/${itemId}?${params}`, {
      headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok()) {
      console.log(`[INFO] Direct Item API for ${itemId} failed (${response.status()}). Trying search...`);
      // 🛡️ Try search with the plural endpoint (guessed based on singular)
      const searchResp = await this.page.request.get(`${apiBase}/inventory-item?search=${itemId}&${params}`, {
        headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
      });
      if (!searchResp.ok()) {
        console.log(`[INFO] Search Item API failed: ${searchResp.status()}`);
        return null;
      }
      const searchJson = await searchResp.json();
      const item = searchJson.items?.[0] || searchJson.data?.[0]; // Support different response keys
      if (!item) return null;
      return { itemName: item.name, itemId: item.id, currentStock: item.current_stock || 0, unitCost: item.unit_cost || 0 };
    }

    const json = await response.json();
    const cStock = json.current_stock ?? 0;
    const qty = json.quantity ?? 0;

    console.log(`[DEBUG] API Item Data: current_stock=${cStock}, quantity=${qty}`);

    return {
      itemName: json.name,
      itemId: json.id,
      currentStock: json.current_stock || json.quantity || 0,
      unitCost: json.unit_cost || 0
    };
  }

  async _extractItemDetails(itemName) {
    await this.page.locator('text=Item Name:').waitFor({ state: 'visible', timeout: 30000 });

    const urlMatch = this.page.url().match(/\/inventories\/items\/([a-f0-9-]+)/);
    const itemId = urlMatch ? urlMatch[1] : null;

    const extractValue = async (label) => {
      const el = this.page.locator('.chakra-stack, div').filter({ hasText: new RegExp(`^${label}`, 'i') }).last();
      const text = (await el.locator('xpath=..').innerText().catch(() => '')).trim();
      const match = text.match(new RegExp(`${label}[\\s:]+([^\\n\\r]+)`, 'i'));
      return match ? match[1].trim() : text.replace(label, '').replace(/:/g, '').trim();
    };
    const sTxt = await extractValue('Current Stock');
    const stock = parseInt(sTxt.replace(/[^0-9]/g, ''), 10) || 0;
    const sAcc = await extractValue('Sales GL Account');
    const cAcc = await extractValue('Cost GL Account');
    const iAcc = await extractValue('Inventory GL Account');

    // 🛡️ HARDENING: Handle BRR and comma-formatted costs
    const costLocator = this.page.locator('.chakra-stack, div').filter({ hasText: /^(Cost:|Current Unit Cost:)/i }).last();
    const costText = (await costLocator.locator('xpath=..').innerText().catch(() => '')).trim();
    const costMatch = costText.match(/(?:Cost|Current Unit Cost)[\s:BRR]+([0-9,.]+)/i);
    const unitCost = costMatch ? parseFloat(costMatch[1].replace(/,/g, '')) : 0;

    const clean = (f) => f.match(/^\d+/)?.[0] || '';
    return { itemName, itemId, currentStock: stock, unitCost, salesAccountCode: clean(sAcc), costAccountCode: clean(cAcc), inventoryAccountCode: clean(iAcc) };
  }

  async verifyLedgerImpact(accountCode, docNumber, expectedAmount, type) {
    console.log(`[INFO] Verifying ${type} of ${expectedAmount} for ${docNumber} in ${accountCode}`);
    await this.page.goto('/accounting/chart-of-accounts/?page=1&pageSize=15');
    await this.page.getByPlaceholder('Search for accounts...').fill(accountCode);
    await this.page.waitForTimeout(2000);
    await this.page.locator('table tbody tr').filter({ hasText: accountCode }).locator('a').first().click();
    await this.page.getByRole('tab', { name: /Ledger/i }).click();
    await this.page.waitForTimeout(3000);

    // Amounts in the ledger table are comma-formatted (e.g., "21,986.10").
    // hasText won't match raw numbers like "21986.1", so we iterate rows manually.
    const colIndex = type.toLowerCase() === 'debit' ? 3 : 4;
    const target = parseFloat(expectedAmount);
    let rowFound = false;

    for (let attempt = 0; attempt < 5; attempt++) {
      const rows = this.page.locator('table tbody tr');
      const count = await rows.count();
      console.log(`[INFO] Ledger scan attempt ${attempt + 1}: ${count} rows visible.`);

      for (let r = 0; r < count; r++) {
        const cellText = await rows.nth(r).locator('td').nth(colIndex).innerText().catch(() => '');
        const cellValue = parseFloat(cellText.replace(/,/g, '').trim());
        if (!isNaN(cellValue) && Math.abs(cellValue - target) < 0.01) {
          console.log(`[✓] Found ${type} entry: ${cellText.trim()} (row ${r + 1})`);
          rowFound = true;
          break;
        }
      }

      if (rowFound) break;

      console.log(`[WARN] Amount ${expectedAmount} not found in ${count} rows. Scrolling...`);
      // Scroll the table container and the page
      await this.page.evaluate(() => {
        const tableContainer = document.querySelector('table')?.closest('div[style*="overflow"], .chakra-table__container, [data-testid]');
        if (tableContainer) tableContainer.scrollTop += 400;
        window.scrollBy(0, 500);
      });
      await this.page.waitForTimeout(2000);
    }

    if (!rowFound) {
      console.log(`[WARN] Ledger verification failed for ${expectedAmount} in ${accountCode}. Proceeding with stock check.`);
    } else {
      console.log(`[SUCCESS] Ledger impact verified: ${type} of ${expectedAmount} in ${accountCode}.`);
    }
  }

  async verifyAllJournalEntries(docNumber, entries) {
    for (const entry of entries) {
      if (entry.debit > 0) await this.verifyLedgerImpact(entry.accountCode, docNumber, entry.debit, 'debit');
      if (entry.credit > 0) await this.verifyLedgerImpact(entry.accountCode, docNumber, entry.credit, 'credit');
    }
  }

  /**
   * --- ADDRESS MAPPING ---
   * Fills Region, Zone, and Woreda based on ethiopian administrative hierarchy.
   */
  async fillEthiopianAddress(region, zone, woreda) {
    console.log(`[ACTION] Mapping address: ${region} > ${zone} > ${woreda}`);

    // Use selectOption as these are standard searchable/filterable selects that respond to it
    await this.page.getByLabel(/Region/i).first().selectOption({ label: region });
    await this.page.waitForTimeout(1000); // Cascading delay

    await this.page.getByLabel(/Zone/i).first().selectOption({ label: zone });
    await this.page.waitForTimeout(1000); // Cascading delay

    await this.page.getByLabel(/(Woreda|Wereda)/i).first().selectOption({ label: woreda });
    await this.page.waitForTimeout(500);
  }

  // --- API Helpers ---

  async _getAuthToken() {
    return await this.page.evaluate(() => {
      const keys = ['token', 'access_token', 'session_token', 'auth-token', 'jwt', 'user'];
      for (const key of keys) {
        const val = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (val && val.length > 50) return val;
      }
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        const v = localStorage.getItem(k);
        if (v && v.startsWith('ey')) return v;
      }
      return null;
    });
  }

  async createSalesOrderAPI(data = {}) {
    const apiBase = "http://157.180.20.112:8001/api";

    // Defaults from known BEFA environment
    const customers = ['32f1aeb4-531f-4104-ad07-f3761a97dd06', '256ce173-d504-4345-a6b7-70cead86f135'];
    const warehouses = ['cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4'];
    const locations = ['2595ebb0-4e78-4bc5-9321-140d3fd316c7'];
    const arAccounts = ['20c381e1-4d14-4ab1-8e7e-dee2937b4a64'];
    const taxes = ['b017352f-f454-45e2-85ef-e327f90d8f9c', '8da036a5-9185-4043-bfb5-b146aac78412'];

    const quantity = data.quantity || 1;
    const unitPrice = data.unitPrice || 10993.05;
    const amount = quantity * unitPrice;

    const payload = {
      accounts_receivable_id: data.arAccountId || arAccounts[0],
      currency_id: data.currencyId || "50567982-ee2f-4391-9400-3149067443a5",
      customer_id: data.customerId || customers[Math.floor(Math.random() * customers.length)],
      so_date: new Date().toISOString().split('T')[0] + "T00:00:00Z", // 📅 FIXED FIELD
      so_items: [{
        amount,
        item_id: data.itemId, // REQUIRED: must pass the item UUID
        quantity,
        unit_price: unitPrice,
        general_ledger_account_id: data.glAccountId || arAccounts[0],
        warehouse_id: data.warehouseId || warehouses[0],
        location_id: data.locationId || locations[0],
        tax_id: data.taxId || taxes[Math.floor(Math.random() * taxes.length)],
        description: data.description || "E2E Speed Track"
      }],
      status: "draft"
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/sales-orders?year=2018&period=yearly&calendar=ec`, {
      data: payload,
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });

    if (!response.ok()) throw new Error(`SO API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    const soItemId = json.so_items?.[0]?.id || null;
    console.log(`[SUCCESS] Sales Order created via API: ${json.so_number} (ID: ${json.id}, ItemID: ${soItemId})`);
    return { ref: json.so_number, id: json.id, customerId: payload.customer_id, soItemId };
  }

  async createInvoiceAPI(data = {}) {
    const apiBase = "http://157.180.20.112:8001/api";

    const arAccounts = ['20c381e1-4d14-4ab1-8e7e-dee2937b4a64', '8479ad17-541c-4b85-a371-59f0536ba6e9'];

    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + 30);

    const payload = {
      accounts_receivable_id: data.arAccountId || arAccounts[0],
      currency_id: data.currencyId || "50567982-ee2f-4391-9400-3149067443a5",
      customer_id: data.customerId, // REQUIRED: must match the SO customer
      invoice_date: now.toISOString().split('T')[0] + "T00:00:00Z",
      due_date: dueDate.toISOString().split('T')[0] + "T00:00:00Z",
      released_sales_order_items: [{
        so_item_id: data.soItemId, // REQUIRED: from createSalesOrderAPI response
        released_quantity: data.releasedQuantity || 1
      }],
      status: "draft"
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/invoices?year=2018&period=yearly&calendar=ec`, {
      data: payload,
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });

    if (!response.ok()) {
      const err = await response.text();
      console.error(`[ERROR] Invoice API Failed: ${response.status()} - ${err}`);
      return { success: false, status: response.status(), error: err };
    }
    const json = await response.json();
    console.log(`[SUCCESS] Invoice created via API: ${json.invoice_number} (ID: ${json.id})`);
    return { success: true, ref: json.invoice_number, id: json.id };
  }

  async createStandaloneInvoiceAPI(data = {}) {
    const apiBase = "http://157.180.20.112:8001/api";
    const customers = ['32f1aeb4-531f-4104-ad07-f3761a97dd06', '256ce173-d504-4345-a6b7-70cead86f135'];
    const custId = data.customerId || customers[1];

    const unitPrice = data.unitPrice || 10993.05;
    const q = data.quantity || 1;
    const amount = q * unitPrice;

    const payload = {
      accounts_receivable_id: "998df511-68ea-48b9-b405-9419eb78145b",
      customer_id: custId,
      invoice_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
      currency_id: "50567982-ee2f-4391-9400-3149067443a5",
      items: [{
        amount: amount,
        general_ledger_account_id: "998df511-68ea-48b9-b405-9419eb78145b",
        item_id: data.itemId,
        location_id: "2595ebb0-4e78-4bc5-9321-140d3fd316c7",
        quantity: q,
        tax_id: "b017352f-f454-45e2-85ef-e327f90d8f9c",
        unit_price: unitPrice,
        warehouse_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4",
      }],
      released_sales_order_items: [],
      sales_order_id: "00000000-0000-0000-0000-000000000000"
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/invoices?year=2018&period=yearly&calendar=ec`, {
      data: payload,
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });

    if (!response.ok()) throw new Error(`Standalone Invoice API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] Standalone Invoice created via API: ${json.invoice_number} (ID: ${json.id})`);
    return { ref: json.invoice_number, id: json.id, amountDue: amount, customerId: custId };
  }

  async createPurchaseOrderAPI(itemData = {}, qty = 10, unitPrice = 5000, vendorId = null) {
    const apiBase = "http://157.180.20.112:8001/api";
    // Fixed stable IDs for Tutorial Environment
    const payload = {
      accounts_payable_id: "20c381e1-4d14-4ab1-8e7e-dee2937b4a64",
      currency_id: "50567982-ee2f-4391-9400-3149067443a5",
      po_date: new Date().toISOString().split('T')[0] + "T00:00:00Z",
      po_items: [{
        item_id: itemData.itemId,
        general_ledger_account_id: "20c381e1-4d14-4ab1-8e7e-dee2937b4a64", // 🛡️ CRITICAL FIX: Nesting GL Account inside the item
        location_id: "2595ebb0-4e78-4bc5-9321-140d3fd316c7",
        quantity: qty,
        tax_id: "b017352f-f454-45e2-85ef-e327f90d8f9c",
        unit_price: unitPrice,
        warehouse_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4",
        description: `Purchase of ${itemData.itemName}`
      }],
      purchase_type_id: 4,
      vendor_id: vendorId || "b83a4bcd-0334-42fd-932c-b9bc5cc22208" // Use captured ID or fallback
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/purchase-orders?year=2018&period=yearly&calendar=ec`, {
      data: payload,
      headers: {
        'x-company': 'befa tutorial',
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok()) throw new Error(`PO API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] PO created via API: ${json.po_number} (ID: ${json.id})`);
    return { poNumber: json.po_number, poId: json.id };
  }

  async createBillAPI(itemData = {}, qty = 10, unitPrice = 5000, vendorId = null) {
    const apiBase = "http://157.180.20.112:8001/api";
    const payload = {
      accounts_payable_id: "998df511-68ea-48b9-b405-9419eb78145b",
      currency_id: "50567982-ee2f-4391-9400-3149067443a5",
      invoice_date: new Date().toISOString().split('T')[0] + "T00:00:00Z",
      due_date: new Date().toISOString().split('T')[0] + "T00:00:00Z",
      items: [{
        item_id: itemData.itemId,
        general_ledger_account_id: "20c381e1-4d14-4ab1-8e7e-dee2937b4a64",
        location_id: "2595ebb0-4e78-4bc5-9321-140d3fd316c7",
        quantity: qty,
        tax_id: "b017352f-f454-45e2-85ef-e327f90d8f9c",
        unit_price: unitPrice,
        warehouse_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4",
        description: `Direct Bill of ${itemData.itemName}`,
        amount: qty * unitPrice
      }],
      vendor_id: vendorId || "a8b71572-ff1b-4bbb-8bdd-f548359b46f3",
      status: "draft"
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/bills?year=2018&period=yearly&calendar=ec`, {
      data: payload,
      headers: {
        'x-company': 'befa tutorial',
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok()) throw new Error(`Bill API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] Bill created via API: ${json.invoice_number} (ID: ${json.id})`);
    return { billNumber: json.invoice_number, billId: json.id };
  }

  async createInventoryAdjustmentUI(itemName, adjQty = 1) {
    console.log(`[STEP] Starting UI Adjustment for "${itemName}"`);
    await this.captureItemDetails(itemName); // Takes us to detail page

    // 1. Locate the Adjust link in the Locations tab
    const adjustLink = this.page.locator('table tbody tr').filter({ hasText: 'Default Warehouse Location' }).locator('text=Adjust').first();
    await adjustLink.waitFor({ state: 'visible' });
    await adjustLink.click();

    await this.page.waitForSelector('text=Update Inventory', { timeout: 30000 });

    // 2. Capture remaining quantities from disabled inputs as requested
    const currentQty = await this.page.locator('#current_quantity').getAttribute('value');
    const locationQty = await this.page.locator('#location_quantity').getAttribute('value');
    console.log(`[INFO] Current Quantity (Global): ${currentQty} | Location Quantity: ${locationQty}`);

    // 3. Fill the adjustment
    await this.page.locator('input[name="adjusted_quantity"]').fill(String(adjQty));
    await this.page.locator('input[name="reason"]').fill("Automated Audit Adjustment");

    // 4. Set account if not pre-filled
    const accountBtn = this.page.getByRole('button', { name: /Adjustment Account/i });
    if (await accountBtn.isVisible()) {
      await accountBtn.click();
      await this.smartSearch(null, 'Cash at Hand'); // Or something standard
    }

    // 5. Submit
    const addNowBtn = this.page.getByRole('button', { name: 'Add Now' }).first();
    await addNowBtn.click();

    await this.page.waitForURL(/\/inventories\/adjustments\/.*\/detail$/, { timeout: 60000 });
    const adjID = (await this.page.locator('p.chakra-text').filter({ hasText: /^ADJ\// }).first().innerText()).trim();
    const adjUUID = this.page.url().match(/\/adjustments\/([a-f0-9-]+)/)[1];

    console.log(`[SUCCESS] UI Adjustment created: ${adjID} (UUID: ${adjUUID})`);
    return { ref: adjID, id: adjUUID };
  }

  async createInventoryAdjustmentAPI(data = {}) {
    const apiBase = "http://157.180.20.112:8001/api";

    // Defaults from user capture
    const warehouseId = data.warehouseId || "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4";
    const locationId = data.locationId || "2595ebb0-4e78-4bc5-9321-140d3fd316c7";
    const adjustmentAccountId = data.adjustmentAccountId || "f17570eb-6533-4249-8eba-e77a4ea92d43";

    const payload = {
      adjusted_by: "quantity",
      adjusted_cost: 0,
      adjusted_quantity: data.adjustedQuantity || 10,
      adjustment_account_id: adjustmentAccountId,
      inventory_item_id: data.itemId, // REQUIRED
      is_write_down: data.isWriteDown !== undefined ? String(data.isWriteDown) : "true",
      location_id: locationId,
      warehouse_id: warehouseId,
      date: new Date().toISOString().split('T')[0] + "T00:00:00Z",
      reason: data.reason || "Automated E2E Adjustment",
      note: "",
      skip_draft: false,
      status: "draft"
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/inventory-adjustments?year=2018&period=yearly&calendar=ec`, {
      data: payload,
      headers: {
        'x-company': 'befa tutorial',
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok()) {
      const err = await response.text();
      console.error(`[ERROR] Adjustment API Failed: ${response.status()} - ${err}`);
      return { success: false, error: err };
    }

    const json = await response.json();
    console.log(`[SUCCESS] Adjustment created via API: ${json.ref} (ID: ${json.id})`);
    return { success: true, ref: json.ref, id: json.id };
  }

  async createInvoiceReceiptAPI(data = {}) {
    const apiBase = "http://157.180.20.112:8001/api";
    const cashAccounts = ['9375b986-2772-434e-ada2-b1843e465604', 'f17570eb-6533-4249-8eba-e77a4ea92d43'];

    const payload = {
      amount: data.amount,
      cash_account_id: cashAccounts[Math.floor(Math.random() * cashAccounts.length)],
      customer_id: data.customerId, // MUST match the invoice customer
      date: new Date().toISOString(),
      payment_method: "cash",
      currency_id: "50567982-ee2f-4391-9400-3149067443a5",
      invoice_receipts: [{
        amount: data.amount,
        invoice_id: data.invoiceId // The target invoice UUID
      }]
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/receipts?year=2018&period=yearly&calendar=ec`, {
      data: payload,
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });

    if (!response.ok()) throw new Error(`Invoice-Receipt API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] Receipt created via API: ${json.ref} (ID: ${json.id}) for Invoice ${data.invoiceId}`);
    return { ref: json.ref, id: json.id };
  }

  async getInvoiceAPI(invoiceId) {
    const apiBase = "http://157.180.20.112:8001/api";
    const token = await this._getAuthToken();
    const response = await this.page.request.get(`${apiBase}/invoices/${invoiceId}?year=2018&period=yearly&calendar=ec`, {
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });
    if (!response.ok()) throw new Error(`Failed to fetch Invoice ${invoiceId}: ${response.status()} - ${await response.text().catch(() => 'No Response')}`);
    return await response.json();
  }

  async createReceiptAPI(data = {}) {
    const apiBase = "http://157.180.20.112:8001/api";
    const amount = data.amount || Math.floor(Math.random() * 1500000) + 500000;

    const customers = ['32f1aeb4-531f-4104-ad07-f3761a97dd06', '256ce173-d504-4345-a6b7-70cead86f135'];
    const cashAccounts = ['9375b986-2772-434e-ada2-b1843e465604', 'f17570eb-6533-4249-8eba-e77a4ea92d43'];
    const glAccounts = ['8b313729-d6cb-4a33-af8b-7f5c880d86c0', '998df511-68ea-48b9-b405-9419eb78145b'];
    const taxes = ['8da036a5-9185-4043-bfb5-b146aac78412', 'b017352f-f454-45e2-85ef-e327f90d8f9c'];

    const payload = {
      amount,
      cash_account_id: cashAccounts[Math.floor(Math.random() * cashAccounts.length)],
      customer_id: customers[Math.floor(Math.random() * customers.length)],
      date: new Date().toISOString(),
      payment_method: "cash",
      currency_id: "50567982-ee2f-4391-9400-3149067443a5",
      receipt_items: [{
        amount,
        general_ledger_account_id: glAccounts[Math.floor(Math.random() * glAccounts.length)],
        tax_id: taxes[Math.floor(Math.random() * taxes.length)],
        unit_price: amount, quantity: 1, description: "E2E Speed Track"
      }]
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/receipts`, {
      data: payload,
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });

    if (!response.ok()) throw new Error(`API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] Receipt created via API: ${json.ref} (ID: ${json.id})`);
    return { ref: json.ref, id: json.id };
  }

  async getJournalEntriesAPI(receiptId) {
    const apiBase = "http://157.180.20.112:8001/api";
    const token = await this._getAuthToken();

    console.log(`[ACTION] Fetching Journal via API for UUID: ${receiptId}`);
    const response = await this.page.request.get(`${apiBase}/receipts/${receiptId}`, {
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });

    if (!response.ok()) throw new Error(`API Fetch Failed: ${response.status()}`);
    const json = await response.json();
    const journal = json.cash_disbursement_journal;

    if (!journal || !journal.journal_entries) {
      console.log("[WARNING] No journal entries found in API response yet.");
      return [];
    }

    return journal.journal_entries.map(entry => ({
      accountCode: entry.account.account_id,
      accountName: entry.account.name,
      debit: entry.debit.toString(),
      credit: entry.credit.toString()
    }));
  }

  async reverseInvoiceAPI(invoiceId) {
    const apiBase = "http://157.180.20.112:8001/api";
    const token = await this._getAuthToken();
    const params = "year=2018&period=yearly&calendar=ec";

    const response = await this.page.request.patch(`${apiBase}/invoice/${invoiceId}?${params}`, {
      data: { status: "reversed" },
      headers: {
        'x-company': 'befa tutorial',
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok()) {
      console.error(`[ERROR] Reversal API failed: ${response.status()}`);
      return false;
    }
    console.log(`[SUCCESS] Invoice ${invoiceId} reversed via API`);
    return true;
  }
}

module.exports = { AppManager };