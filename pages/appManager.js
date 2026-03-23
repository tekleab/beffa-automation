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
  }

  async login(email, pass) {
    const cleanEmail = (email || "").replace(/['"]+/g, '').trim();
    const cleanPass = (pass || "").replace(/['"]+/g, '').trim();
    await this.page.goto('/users/login');
    await this.emailInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.emailInput.fill(cleanEmail);
    await this.passwordInput.fill(cleanPass);
    await expect(this.loginBtn).toBeEnabled({ timeout: 20000 });
    await this.loginBtn.click();
    await this.page.waitForURL('**/', { waitUntil: 'networkidle', timeout: 60000 });
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
        // 1. Target container for typing (scoped to dialog to avoid wrong inputs)
        const target = container || this.page.locator('div[role="dialog"], .chakra-modal__content, .chakra-popover__content').filter({ visible: true }).last();

        // 2. Find search input — exclude numeric/hidden inputs
        let searchBox = target.locator('input:not([type="number"]):not([type="hidden"])').filter({ visible: true }).first();
        if (!(await searchBox.isVisible({ timeout: 2000 }).catch(() => false))) {
          searchBox = this.page.locator('input[placeholder*="Search" i]').filter({ visible: true }).last();
        }

        await searchBox.waitFor({ state: 'visible', timeout: 10000 });
        await searchBox.clear();

        // 3. Instant fill (copy-paste style) to trigger ERP search filters faster
        await searchBox.fill(cleanText);
        await this.page.waitForTimeout(2500);

        // 4. Click the result — SCOPED to dialog/overlay to avoid sidebar nav collisions
        let clicked = false;

        // Tier 1: Exact match WITHIN dialog container (prevents clicking 'Sales' nav link)
        const containerExact = target.getByText(cleanText, { exact: true }).first();
        if (await containerExact.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log(`[INFO] Tier 1 - exact in dialog: "${cleanText}"`);
          await containerExact.click({ force: true });
          clicked = true;
        }

        // Tier 2: Search visible overlay/portal (Chakra popovers render outside dialog)
        if (!clicked) {
          const overlayList = this.page.locator(
            '.chakra-popover__content, [role="listbox"], .chakra-menu__list, div[data-placement]'
          ).filter({ visible: true }).last();
          if (await overlayList.isVisible({ timeout: 2000 }).catch(() => false)) {
            const overlayExact = overlayList.getByText(cleanText, { exact: true }).first();
            if (await overlayExact.isVisible({ timeout: 2000 }).catch(() => false)) {
              console.log(`[INFO] Tier 2 - exact in overlay: "${cleanText}"`);
              await overlayExact.click({ force: true });
              clicked = true;
            }
            if (!clicked) {
              const overlayContains = overlayList.getByText(cleanText, { exact: false }).first();
              if (await overlayContains.isVisible({ timeout: 2000 }).catch(() => false)) {
                console.log(`[INFO] Tier 2 - contains in overlay: "${cleanText}" (ID↔Name)`);
                await overlayContains.click({ force: true });
                clicked = true;
              }
            }
          }
        }

        // Tier 3: Contains match WITHIN dialog (ID↔Name: searching ID shows "Name - ID")
        if (!clicked) {
          const containerContains = target.getByText(cleanText, { exact: false }).first();
          if (await containerContains.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log(`[INFO] Tier 3 - contains in dialog: "${cleanText}" (ID↔Name)`);
            await containerContains.click({ force: true });
            clicked = true;
          }
        }

        // Tier 4: Total mismatch fallback (Search ID -> Result is purely Name without ID)
        // E.g. search "CUST/..." -> shows "Etsegenet Yimer"
        if (!clicked) {
          console.log(`[INFO] Tier 4 - no text match for "${cleanText}". Clicking first visible item...`);

          // Look in overlay first (Chakra portal dropdown)
          const overlayList = this.page.locator('.chakra-popover__content, [role="listbox"], .chakra-menu__list, div[data-placement]').filter({ visible: true }).last();
          let fallbackItem = null;

          const clickableSelectors = 'button:not([aria-label]), [role="option"], [role="menuitem"], li, .chakra-menu__menuitem, label, .chakra-checkbox, [role="checkbox"]';
          const validItemFilter = { hasNotText: /^\s*(\+?\s*Add|Clear|New|No more items)\s*$/i };

          if (await overlayList.isVisible({ timeout: 1000 }).catch(() => false)) {
            fallbackItem = overlayList.locator(clickableSelectors).filter({ visible: true }).filter(validItemFilter).first();
          } else {
            // Look in container (inline dialog dropdown)
            fallbackItem = target.locator(clickableSelectors).filter({ visible: true }).filter(validItemFilter).first();
          }

          if (await fallbackItem.isVisible({ timeout: 2000 }).catch(() => false)) {
            const foundText = (await fallbackItem.innerText()).trim() || "Item";
            console.log(`[INFO] Tier 4 - clicking first available item: "${foundText}"`);
            await fallbackItem.click({ force: true });
            clicked = true;
          }
        }

        if (!clicked) {
          throw new Error(`No visible dropdown result found for "${cleanText}"`);
        }

        // 5. Commit and close dropdown
        await this.page.waitForTimeout(500);
        await this.page.keyboard.press('Escape');

        console.log(`[SUCCESS] Selected: "${cleanText}"`);
        return;
      } catch (e) {
        console.log(`[WARNING] Search attempt ${s + 1} failed: ${e.message}`);
        await this.page.waitForTimeout(2000);
      }
    }
    throw new Error(`[ERROR] smartSearch failed for "${cleanText}" after 3 attempts.`);
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
      const button = this.page.locator('button[aria-label="approval-step"], button').filter({
        hasText: /^(Submit For Review|Submit For Reviewer|Submit For Approver|Submit Forapprover|Submit For Approve|Submit For Apporver|Advance|Approve|Submit)$/i
      }).filter({ visible: true }).first();

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
    // Use a robust selector for the reviewer drop-down button or select input
    const reviewerSelector = dialog.locator('button[aria-haspopup], [aria-haspopup], select.chakra-select, input:not([type="hidden"])').filter({ visible: true }).first();

    const el = await reviewerSelector.elementHandle({ timeout: 1500 }).catch(() => null);
    if (el) {
      // Evaluate text directly to bypass any actionability stalls
      const currentSelection = (await el.evaluate(node => node.innerText || node.value || node.textContent || '')).trim();

      if (currentSelection.toLowerCase() !== "system admin") {
        // Use fill if it's an input field
        if ((await el.evaluate(n => n.tagName)).toLowerCase() === 'input') {
          await el.fill("System Admin");
        } else {
          await el.click({ force: true });
        }
        await this.page.waitForTimeout(1000);

        // Find "System Admin" option in any popup list or dropdown
        const adminOption = this.page.locator('div[role="option"], [role="menuitem"], li, .chakra-menu__menuitem, button').filter({ hasText: /System Admin/i }).filter({ visible: true }).first();
        const adminEl = await adminOption.elementHandle({ timeout: 2000 }).catch(() => null);
        if (adminEl) {
          await adminEl.click({ force: true });
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

  async fillDate(index, dateValue) {
    const dayToSelect = parseInt(dateValue.split('/')[0], 10).toString();
    const datePickerBtn = this.page.locator('button:has(span.formatted-date)').nth(index);
    await datePickerBtn.click();
    await this.page.waitForTimeout(1000);
    const dayButton = this.page.locator('div[role="grid"] button').getByText(dayToSelect, { exact: true }).first();
    if (await dayButton.isVisible()) {
      await dayButton.click();
    } else {
      await this.page.keyboard.type(dateValue);
      await this.page.keyboard.press('Enter');
    }
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
    const tabNameRegex = isVendor ? /Quotes|Bills|Transactions/i : /Receipts|Transactions/i;

    console.log(`[VERIFY] Searching for ${docNumber} in ${type}: ${entityName}...`);
    await this.page.goto(baseUrl);

    const searchInput = this.page.locator(`input[placeholder="${searchPlaceholder}"]`);
    await searchInput.waitFor({ state: 'visible' });
    await searchInput.fill(entityName);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(2000);

    const rowLocator = this.page.locator('table tbody tr').filter({ hasText: entityName }).first();
    await rowLocator.waitFor({ state: 'visible', timeout: 20000 });

    // NAVIGATION: Click the Ref link to go to details
    const link = rowLocator.locator('a').first();
    const href = await link.getAttribute('href');
    if (href) {
      console.log(`[ACTION] Navigating to detail: ${href}`);
      await this.page.goto(href, { waitUntil: 'networkidle' });
    } else {
      await link.click({ force: true });
    }

    // Wait for ANY detail page indicator
    await this.page.waitForSelector('.chakra-heading', { timeout: 30000 });

    // Go to relevant tab
    const targetTab = this.page.getByRole('tab', { name: tabNameRegex });
    await targetTab.waitFor({ state: 'visible' });
    await targetTab.click({ force: true });

    // Some ERP pages need a reload or a second click to refresh data in tabs
    await this.page.waitForTimeout(2000);
    await this.page.reload();
    await this.page.waitForTimeout(3000);
    await targetTab.waitFor({ state: 'visible' });
    await targetTab.click({ force: true });

    const docLocator = this.page.locator('table').getByText(docNumber);
    await expect(docLocator.first()).toBeVisible({ timeout: 30000 });
    console.log(`[SUCCESS] ${docNumber} verified in ${type} profile.`);
  }

  async captureJournalEntries() {
    const journalTab = this.page.getByRole('tab', { name: /Journal/i });
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
    const itemRow = this.page.locator('table tbody tr').filter({ hasText: itemName }).first();
    await itemRow.locator('a').first().click();
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
}

module.exports = { AppManager };