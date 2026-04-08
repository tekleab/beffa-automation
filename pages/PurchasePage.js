const { expect } = require('@playwright/test');

class PurchasePage {
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

  async findApprovedUnpaidBill() {
    console.log("[ACTION] Scanning for an approved, unpaid bill (Net Due > 0)...");
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

  async handlePOReceiptTab() {
    console.log("[ACTION] Processing PO Receipt Tab...");
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

}
module.exports = { PurchasePage };
