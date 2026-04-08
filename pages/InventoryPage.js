const { expect } = require('@playwright/test');

class InventoryPage {
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

  async findApprovedUnpaidInvoice() {
    console.log("[ACTION] Scanning for an approved, unpaid invoice (Net Due > 0)...");
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

}
module.exports = { InventoryPage };
