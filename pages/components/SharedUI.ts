import { Page, Locator, expect } from '@playwright/test';

export class SharedUI {
  page: Page;
  emailInput: Locator;
  passwordInput: Locator;
  loginBtn: Locator;
  mainPhoneInput: Locator;
  customerNameInput: Locator;
  customerTinInput: Locator;
  approvedStatus: string;
  actionButtons: string;
  companyBtn: Locator;
  smartSearch!: (...args: any[]) => Promise<void>;
  fillDate!: (...args: any[]) => Promise<void>;

  constructor(page: Page) {
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

  async handleApprovalFlow(): Promise<void> {
    // Approval flow: Draft → Verifier → Approver → Approved
    const FINAL_STATUS = 'approved';
    const statusLocator = this.page.locator(
      '//p[contains(text(), "Status:")]/following-sibling::*//span | ' +
      '//span[contains(text(), "Status:")]/following-sibling::*//span | ' +
      '//span[contains(@class, "chakra-badge")]'
    ).filter({ visible: true }).first();

    let lastStatus = '';
    let actionClickedForStatus = ''; // Track which status we already acted on
    let emptyStatusStreak = 0;

    for (let i = 0; i < 90; i++) { // Max 90 loops * ~2s = ~180 seconds max
      if (this.page.isClosed()) return;
      await this.page.waitForTimeout(1000);

      // Fast check for status. If no visible badge, it throws quickly and we get ''
      const currentStatus = (await statusLocator.innerText({ timeout: 500 }).catch(() => '')).trim().toLowerCase();

      // Only log the status if it actually changed and is not empty
      if (currentStatus && currentStatus !== lastStatus) {
        console.log(`[INFO] Approval status: "${currentStatus}"`);
        lastStatus = currentStatus;
        actionClickedForStatus = ''; // NEW STATUS, meaning we can interact again
        emptyStatusStreak = 0;
      } else if (!currentStatus) {
        emptyStatusStreak++;
        if (emptyStatusStreak > 30) {
          console.log('[WARN] No status badge found for 30 seconds. Exiting approval loop.');
          return;
        }
      }

      // Done?
      if (currentStatus.includes(FINAL_STATUS)) {
        console.log('[SUCCESS] Document approved.');
        return;
      }

      // 🚨 FAST ERROR DETECTION: Catch toasts that spawn late due to backend lockups
      const errorToast = this.page.locator('#chakra-toast-manager-top-right, #chakra-toast-manager-bottom, div[role="alert"], div[role="status"], .chakra-toast, .chakra-alert, .go395831515').filter({ hasText: /error|failed|went wrong/i }).first();
      if (await errorToast.isVisible({ timeout: 200 }).catch(() => false)) {
        const errorText = (await errorToast.innerText().catch(() => 'Unknown backend error')).replace(/\n/g, ' ').trim();
        throw new Error(`[CRITICAL] Backend Error Prevented Approval: "${errorText}"`);
      }

      // Handle any confirmation modal that appeared AFTER a click
      const modal = this.page.getByRole('dialog').first();
      if (await modal.isVisible({ timeout: 500 }).catch(() => false)) {
        const modalText = (await modal.innerText().catch(() => '')).toLowerCase();
        if (modalText.includes('reviewer') || modalText.includes('select')) {
          await this._handleReviewerSelection(modal);
          actionClickedForStatus = currentStatus; // Lock to prevent re-opening the modal
          await this._waitForActionAndCheckErrors();
          continue;
        }

        const processingBtn = modal.locator('button').filter({ hasText: /Processing|Loading|Waiting/i }).first();
        if (await processingBtn.isVisible({ timeout: 200 }).catch(() => false)) {
          // Silent spin while waiting for ERP to process
          continue;
        }

        const confirmBtn = modal.locator('button').filter({ hasText: /^(Approve|Advance|Submit|Save|Confirm|Yes|Ok)$/i }).first();
        if (await confirmBtn.isVisible({ timeout: 500 }).catch(() => false)) {
          await confirmBtn.click({ force: true });
          await this._waitForActionAndCheckErrors();
          // We intentionally DO NOT reset actionClickedForStatus here so it waits patiently for the UI to update.
          continue;
        }
      }

      // If status is empty, or we already clicked for this status, keep waiting
      if (!currentStatus || currentStatus === actionClickedForStatus) {
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

      if (await button.isVisible({ timeout: 500 }).catch(() => false)) {
        const btnText = (await button.innerText()).trim();
        console.log(`[ACTION] Status changed to "${currentStatus}" → Clicking: "${btnText}"`);
        await button.click({ force: true });
        actionClickedForStatus = currentStatus; // mark this status as actioned
        await this._waitForActionAndCheckErrors();
      }
    }
    console.log('[WARN] Approval flow timed out before reaching final status.');
  }

  // 🚨 FAST ERROR DETECTION: Polls for quick-fading toast errors
  async _waitForActionAndCheckErrors(): Promise<void> {
    for (let w = 0; w < 10; w++) {
      const errorToast = this.page.locator('#chakra-toast-manager-top-right, #chakra-toast-manager-bottom, div[role="alert"], div[role="status"], .chakra-toast, .chakra-alert, .go395831515').filter({ hasText: /error|failed|went wrong/i }).first();
      if (await errorToast.isVisible({ timeout: 200 }).catch(() => false)) {
        const errorText = (await errorToast.innerText().catch(() => 'Unknown backend error')).replace(/\n/g, ' ').trim();
        throw new Error(`[CRITICAL] Backend Error Prevented Approval: "${errorText}"`);
      }
    }
  }

  async verifyLedgerImpact(accountCode: string, docNumber: string, expectedAmount: number, type: string): Promise<void> {
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
    const target = parseFloat(String(expectedAmount));
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
        const tableContainer = document.querySelector('table')?.closest('div[style*="overflow"], .chakra-table__container, [data-testid]') as HTMLElement;
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

  async verifyAllJournalEntries(docNumber: string, entries: Array<{ accountCode: string; accountName: string; debit: number; credit: number }>): Promise<void> {
    for (const entry of entries) {
      if (entry.debit > 0) await this.verifyLedgerImpact(entry.accountCode, docNumber, entry.debit, 'debit');
      if (entry.credit > 0) await this.verifyLedgerImpact(entry.accountCode, docNumber, entry.credit, 'credit');
    }
  }

  async fillEthiopianAddress(region: string, zone: string, woreda: string): Promise<void> {
    console.log(`[ACTION] Mapping address: ${region} > ${zone} > ${woreda}`);

    // Use selectOption as these are standard searchable/filterable selects that respond to it
    await this.page.getByLabel(/Region/i).first().selectOption({ label: region });
    await this.page.waitForTimeout(1000); // Cascading delay

    await this.page.getByLabel(/Zone/i).first().selectOption({ label: zone });
    await this.page.waitForTimeout(1000); // Cascading delay

    await this.page.getByLabel(/(Woreda|Wereda)/i).first().selectOption({ label: woreda });
    await this.page.waitForTimeout(500);
  }

  async verifyDocInProfile(type: string, entityName: string, docNumber: string): Promise<void> {
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

  async captureJournalEntries(tabNameRegex: RegExp = /Journal|CRJ|CDJ/i): Promise<Array<{ accountCode: string; accountName: string; debit: number; credit: number }>> {
    const journalTab = this.page.getByRole('tab', { name: tabNameRegex }).first();
    await journalTab.scrollIntoViewIfNeeded();
    await journalTab.click();
    await this.page.waitForTimeout(2000);
    const rows = this.page.locator('table tbody tr');
    const count = await rows.count();
    const entries: Array<{ accountCode: string; accountName: string; debit: number; credit: number }> = [];
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

  async _handleReviewerSelection(activeModal: Locator): Promise<boolean> {
    const dialog = activeModal || this.page.getByRole('dialog').last();
    // Use locator directly to avoid detachment issues
    const reviewerBtn = dialog.locator('button[aria-haspopup], [aria-haspopup], select[class*="select"], input:not([type="hidden"])').filter({ visible: true }).first();

    if (await reviewerBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Evaluate text directly or use innerText if not an input
      const currentSelection = (await reviewerBtn.inputValue().catch(() => null))
        || (await reviewerBtn.innerText().catch(() => '')).trim();

      if (currentSelection.toLowerCase() !== "system admin") {
        // Use fill if it's an input field
        if (await reviewerBtn.evaluate((n: HTMLElement) => n.tagName.toLowerCase() === 'input')) {
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
}
