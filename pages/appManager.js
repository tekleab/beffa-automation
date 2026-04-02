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
    await this.page.goto('/users/login');
    await this.emailInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.emailInput.fill(cleanEmail);
    await this.passwordInput.fill(cleanPass);
    await expect(this.loginBtn).toBeEnabled({ timeout: 20000 });
    await this.loginBtn.click();
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
        const target = container || this.page.locator('div[role="dialog"], .chakra-modal__content, .chakra-popover__content').filter({ visible: true }).last();

        let searchBox = target.locator('input:not([type="number"]):not([type="hidden"])').filter({ visible: true }).first();
        if (!(await searchBox.isVisible({ timeout: 2000 }).catch(() => false))) {
          searchBox = this.page.locator('input[placeholder*="Search" i]').filter({ visible: true }).last();
        }

        await searchBox.waitFor({ state: 'visible', timeout: 10000 });
        await searchBox.click();
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
          // E.g. search "CUST/..." or "1005" -> returns Name results
          const isIdOrCode = cleanText.includes('/') || /^\d+$/.test(cleanText);
          if (isIdOrCode) {
            console.log(`[INFO] Tier 4 - no exact match for "${cleanText}" (ID/Code). Clicking first visible item assuming Name returned...`);
            let fallbackItem = null;
            const clickableSelectors = 'button:not([aria-label]), [role="option"], [role="menuitem"], li, .chakra-menu__menuitem, label, .chakra-checkbox, [role="checkbox"]';
            const validItemFilter = { hasNotText: /^\s*(\+?\s*Add|Clear|New|No more items)\s*$/i };

            if (await overlayList.isVisible({ timeout: 1000 }).catch(() => false)) {
              fallbackItem = overlayList.locator(clickableSelectors).filter({ visible: true }).filter(validItemFilter).first();
            } else {
              fallbackItem = target.locator(clickableSelectors).filter({ visible: true }).filter(validItemFilter).first();
            }

            if (await fallbackItem.isVisible({ timeout: 1000 }).catch(() => false)) {
              const foundText = (await fallbackItem.innerText()).trim() || "Item";
              console.log(`[INFO] Tier 4 - clicking first available item: "${foundText}"`);
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
          hasText: /^(Submkt For Review|Submit For Review|Submir For Review|Submit For Reviewer|Submit For Approver|Submit Forapprover|Submit For Approve|Submit For Apporver|Advance|Approve|Approver|Submit)$/i
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

  async fillDate(labelOrIndex, dateValue) {
    const dayToSelect = parseInt(dateValue.split('/')[0], 10).toString();
    let datePickerBtn;

    if (typeof labelOrIndex === "string") {
      // Find the button within a container and label
      const container = this.page.locator('.chakra-form-control, [role="group"], div')
        .filter({ has: this.page.getByText(new RegExp(`^${labelOrIndex}\\s*\\*?$`, 'i')) })
        .filter({ has: this.page.locator('button') })
        .last();
      datePickerBtn = container.locator('button').first();
    } else {
      // Fallback to index if needed
      datePickerBtn = this.page.locator('button:has(span.formatted-date), button:has(img)').filter({ visible: true }).nth(labelOrIndex);
    }

    await datePickerBtn.click({ force: true });
    await this.page.waitForTimeout(2000);

    const dayButton = this.page.locator('div[role="grid"] button, button.chakra-datepicker__day').filter({ hasText: new RegExp(`^${dayToSelect}$`) }).first();

    if (await dayButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await dayButton.click({ force: true });
    } else {
      // Direct typing fallback
      await this.page.keyboard.type(dateValue);
      await this.page.keyboard.press('Enter');
    }

    await this.page.waitForTimeout(1000); // Sync React state
  }

  /**
   * pickDate — reusable automatic date picker helper.
   * Opens the picker identified by its form label, clicks the specified day,
   * then blurs to commit React state. Uses ARIA role targeting (getByRole('dialog'))
   * which correctly matches Chakra UI's div[role="dialog"] calendar popup.
   *
   * @param {string} label  - The visible label of the date field (e.g. 'Request Date')
   * @param {number} dayNum - The Ethiopian calendar day number to select
   */
  async pickDate(label, dayNum) {
    console.log(`[ACTION] Picking date: "${label}" -> Day ${dayNum}`);
    let container = this.page.locator('.chakra-form-control, [role="group"], div')
      .filter({ has: this.page.getByText(new RegExp(`^${label}\\s*\\*?$`, 'i')) })
      .filter({ has: this.page.locator('button') })
      .last();

    // Fallback to partial match if exact label wasn't found
    if (!(await container.isVisible().catch(() => false))) {
      container = this.page.locator('.chakra-form-control, [role="group"], div')
        .filter({ has: this.page.getByText(new RegExp(`${label}`, 'i')) })
        .filter({ has: this.page.locator('button') })
        .last();
    }

    const btn = container.locator('button').last(); // last button is usually the actual date button, not an attached icon

    // Open the picker using deep evaluate to bypass Chakra synthetic event locks
    await btn.evaluate(node => node.click());

    // Calendar renders as div[role="dialog"] (Chakra UI), a popover, or equivalent.
    const cal = this.page.locator('[role="dialog"], .chakra-popover__content, div[id*="popover"]')
      .filter({ has: this.page.locator('[role="grid"], .chakra-datepicker, .react-datepicker') })
      .last();

    // ⚡ ULTRA-ROBUST FALLBACK: If calendar doesn't appear in 3 seconds, just type the day
    if (!(await cal.isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log(`[INFO] Calendar for "${label}" did not appear. Using direct type fallback...`);
      await btn.click({ force: true }).catch(() => { });
      await this.page.keyboard.type(String(dayNum));
      await this.page.keyboard.press('Enter');
      await this.page.keyboard.press('Tab');
      return;
    }

    // Click the target day in the visible calendar
    console.log(`[INFO] Calendar visible. Clicking day ${dayNum}...`);
    const dayBtn = cal.getByRole('button', { name: String(dayNum), exact: true });
    if (await dayBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await dayBtn.click({ force: true });
    } else {
      await this.page.keyboard.type(String(dayNum));
      await this.page.keyboard.press('Enter');
    }

    await this.page.waitForTimeout(600);

    // Blur the label to commit React state
    const blurLabel = this.page.getByText(new RegExp(`${label}`, 'i')).first();
    if (await blurLabel.isVisible().catch(() => false)) {
      await blurLabel.click({ force: true });
    } else {
      await this.page.keyboard.press('Escape');
    }
    await this.page.waitForTimeout(600);
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
    await docLocator.first().scrollIntoViewIfNeeded().catch(() => {});
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

  async captureRandomItemDetails() {
    await this.page.goto('/inventories/items/?page=1&pageSize=30', { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(5000);
    const rows = this.page.locator('table tbody tr');
    await rows.first().waitFor({ state: 'visible', timeout: 30000 });
    const count = await rows.count();
    const targetRow = rows.nth(Math.floor(Math.random() * Math.min(count, 15)));
    const nameLink = targetRow.locator('a').first();
    let itemName = (await nameLink.textContent()).trim();
    if (itemName.includes(' - ')) itemName = itemName.split(' - ').pop().trim();
    console.log(`[ACTION] Capturing details for: "${itemName}"...`);
    await nameLink.click();
    await this.page.waitForURL(/\/inventories\/items\/.*/, { timeout: 60000 });
    return await this._extractItemDetails(itemName);
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

  async _extractItemDetails(itemName) {
    await this.page.waitForTimeout(3000);
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
    const clean = (f) => f.match(/^\d+/)?.[0] || '';
    return { itemName, currentStock: stock, salesAccountCode: clean(sAcc), costAccountCode: clean(cAcc), inventoryAccountCode: clean(iAcc) };
  }

  async verifyLedgerImpact(accountCode, docNumber, expectedAmount, type) {
    console.log(`[INFO] Verifying ${type} of ${expectedAmount} for ${docNumber} in ${accountCode}`);
    await this.page.goto('/accounting/chart-of-accounts/?page=1&pageSize=15');
    await this.page.getByPlaceholder('Search for accounts...').fill(accountCode);
    await this.page.locator('table tbody tr').filter({ hasText: accountCode }).locator('a').first().click();
    await this.page.getByRole('tab', { name: /Ledger/i }).click();

    // The Ledger does not always show the source document (INV/...), it usually shows the Journal Ref (JRN/...)
    // Therefore, we find the most recent row in the ledger that corresponds to the expected transaction amount.
    const row = this.page.locator('table tbody tr').filter({ hasText: expectedAmount.toString() }).last();
    await expect(row).toBeVisible({ timeout: 15000 });
    const cell = row.locator('td').nth(type.toLowerCase() === 'debit' ? 3 : 4);
    const actual = (await cell.innerText()).replace(/,/g, '').trim();
    expect(actual).toContain(expectedAmount.toString());
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
}

module.exports = { AppManager };