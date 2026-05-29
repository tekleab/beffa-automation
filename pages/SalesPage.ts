import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../lib/BasePage';

export class SalesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async captureRandomCustomerDetails(): Promise<{ customerName: string; customerId: string | undefined }> {
    await this.page.goto('/receivables/customers/?page=1&pageSize=30', { waitUntil: 'networkidle' });
    const rows = this.page.locator('table tbody tr');
    await rows.first().waitFor({ state: 'visible', timeout: 30000 });
    const count = await rows.count();
    const targetRow = rows.nth(Math.floor(Math.random() * Math.min(count, 15)));

    const nameLink = targetRow.locator('td a').first();
    const customerName = (await nameLink.innerText()).trim();
    const href = await nameLink.getAttribute('href');
    const customerId = href?.match(/\/receivables\/customers\/([a-f0-9-]+)/)?.[1];

    console.log(`[DATA] Captured Customer: "${customerName}" (ID: ${customerId})`);
    return { customerName, customerId };
  }

  async captureSODetailData(): Promise<Record<string, string>> {
    const data: Record<string, string> = {};
    const rows = this.page.locator('table tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('td');
      const key = (await cells.nth(0).innerText().catch(() => '')).trim();
      const value = (await cells.nth(1).innerText().catch(() => '')).trim();
      if (key) data[key] = value;
    }
    return data;
  }

  async findApprovedUnpaidInvoice(): Promise<{ customerName: string; invoiceId: string } | null> {
    console.log("[ACTION] Scanning for an approved, unpaid invoice (Net Due > 0)...");
    await this.page.goto('/receivables/invoices/?page=1&pageSize=30');
    await this.page.waitForSelector('table tbody tr', { timeout: 30000 });
    await this.page.waitForTimeout(3000);

    // 🗺️ Discover headers dynamically
    const colMap = await this.getTableColumnMap();
    const idxInv = colMap['invoice id'] ?? colMap['reference'] ?? 1;
    const idxCust = colMap['customer'] ?? 2;
    const idxPaid = colMap['paid'] ?? 5;
    const idxNet = colMap['net due'] ?? 6;
    const idxStatus = colMap['status'] ?? 7;

    const rows = this.page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const cells = row.locator('td');

      const invId = (await cells.nth(idxInv).innerText().catch(() => '')).trim();
      const customer = (await cells.nth(idxCust).innerText().catch(() => '')).trim();
      const paid = (await cells.nth(idxPaid).innerText().catch(() => '')).trim().toLowerCase();
      const netDueRaw = (await cells.nth(idxNet).innerText().catch(() => '')).trim();
      const status = (await cells.nth(idxStatus).innerText().catch(() => '')).trim().toLowerCase();
      const netDue = parseFloat(netDueRaw.replace(/[^\d.]/g, '')) || 0;

      // 🛡️ Robust paid check: "no" or "unpaid" or checkbox = false
      const isUnpaid = paid.includes('no') || paid.includes('unpaid') || paid === '';

      if (isUnpaid && netDue > 0 && status === 'approved') {
        console.log(`[SUCCESS] Found unpaid customer match: "${customer}" (Invoice: ${invId})`);
        return { customerName: customer, invoiceId: invId };
      }
    }
    return null;
  }

  async handleSOReleasedTab(): Promise<number> {
    console.log("[ACTION] Processing SO Released Tab...");
    const tab = this.page.getByRole('tab', { name: /Released/i });
    await tab.waitFor({ state: 'visible', timeout: 5000 });
    await tab.click();
    await this.page.waitForTimeout(2000);

    const rows = this.page.locator('table tbody tr').filter({ has: this.page.locator('.chakra-checkbox') });
    const count = await rows.count();

    if (count === 0) {
      console.log("[WARN] No release rows found.");
      return 0;
    }

    // Discover column for "Remaining" by reading the released tab table headers
    const releaseColMap = await this.getTableColumnMap();
    const idxRemaining = releaseColMap['remaining'] ?? releaseColMap['unreleased'] ?? releaseColMap['qty remaining'] ?? releaseColMap['to release'] ?? 6;

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

    // 2. Read Remaining
    const tdList = row.locator('td');
    const remainingText = await tdList.nth(idxRemaining).innerText().catch(() => "1");
    const remaining = Math.max(1, parseInt(remainingText.replace(/[^0-9]/g, '')) || 1);

    // 3. Choose random quantity (1 to remaining)
    const toRelease = Math.max(1, Math.floor(Math.random() * remaining) + 1);
    console.log(`[DATA] Remaining: ${remaining} | Releasing: ${toRelease}`);

    // 4. Find and fill the Released Quantity input (now enabled)
    const qtyInput = row.locator('input[type="number"], .chakra-numberinput__field').last();
    await qtyInput.waitFor({ state: 'visible' });

    // Force actionability if it's still slow to enable
    await expect(qtyInput).toBeEnabled({ timeout: 15000 });
    await qtyInput.scrollIntoViewIfNeeded();

    // ⚡ NEW STABILIZER: Click to ensure focus before typing
    await qtyInput.click({ force: true });
    await this.page.waitForTimeout(500);

    await qtyInput.clear();
    await qtyInput.fill(String(toRelease));
    await this.page.waitForTimeout(500);
    await qtyInput.press('Enter');
    await this.page.keyboard.press('Tab'); // Blur input to trigger reactive state
    await this.page.waitForTimeout(800);

    await this.page.waitForTimeout(1000); // Allow totals to calculate
    console.log(`[SUCCESS] SO Line Item released (${toRelease}) and selected.`);
    return toRelease;
  }

  // ============================================================================
  // SHARED UI METHODS (SO & Invoice)
  // ============================================================================

  async fillCustomer(customerId: string, customerButtonClass: string = 'css-lwolnh') {
    console.log(`[UI] Filling customer: ${customerId}`);
    await this.page.click(`button#customer_id.chakra-button.${customerButtonClass}`);
    await this.page.fill('input#customer_id.chakra-input.css-cu54mj', customerId);
  }

  async fillLocation(locationId: string) {
    console.log(`[UI] Filling location: ${locationId}`);
    await this.page.click('button#location_id.chakra-button.css-lwolnh:has-text("Select location *")');
    await this.page.fill('input#location_id.chakra-input.css-cu54mj', locationId);
  }

  async fillWarehouse(warehouseId: string) {
    console.log(`[UI] Filling warehouse: ${warehouseId}`);
    await this.page.click('button#warehouse_id.chakra-button.css-qtt6lp:has-text("Select warehouse *")');
    await this.page.fill('input#warehouse_id.chakra-input.css-cu54mj', warehouseId);
  }

  async fillItem(itemId: string) {
    console.log(`[UI] Filling item: ${itemId}`);
    await this.page.fill('input.chakra-input.css-cu54mj[placeholder="Search..."]', itemId);
  }

  async fillQuantity(quantity: string) {
    console.log(`[UI] Filling quantity: ${quantity}`);
    await this.page.fill('input.chakra-input.css-bgx4xr[type="number"]', quantity);
  }

  async fillPrice(price: string) {
    console.log(`[UI] Filling price: ${price}`);
    const priceInputs = await this.page.locator('input.chakra-input.css-bgx4xr[type="number"]').all();
    if (priceInputs.length > 1) {
      await priceInputs[1].fill(price);
    }
  }

  async clickDateButton() {
    console.log(`[UI] Clicking date button`);
    await this.page.click('button.trigger-button');
  }

  async clickAddLineItem() {
    console.log(`[UI] Clicking Add button for line item`);
    await this.page.click('button.chakra-button.css-1qm6idw:has-text("Add")');
    await this.page.waitForLoadState('networkidle');
  }

  async verifySuccessMessage() {
    console.log(`[UI] Verifying success message`);
    const successMessage = await this.page.locator('.success-message, .alert-success, [class*="success"]').first();
    await expect(successMessage).toBeVisible();
  }

  async verifyValidationErrors() {
    console.log(`[UI] Verifying validation errors`);
    const validationErrors = await this.page.locator('.error-message, .validation-error, [class*="error"], .required-field').all();
    console.log(`[UI] Found ${validationErrors.length} validation errors`);
    await expect(validationErrors.length).toBeGreaterThan(0);
  }

  // ============================================================================
  // SO UI VERIFICATION METHODS
  // ============================================================================

  async navigateToSOList() {
    console.log(`[UI] Navigating to Sales Orders list`);
    await this.page.goto('/receivables/sale-orders');
    await this.page.waitForLoadState('networkidle');
  }

  async clickAddSalesOrder() {
    console.log(`[UI] Clicking Add Sales Order button`);
    await this.page.click('button.chakra-button.css-r0jt5t:has-text("Add Sales Order")');
    await this.page.waitForLoadState('networkidle');
  }

  async clickLineItemButtonSO() {
    console.log(`[UI] Clicking Line Item button (SO)`);
    await this.page.click('button#popover-trigger-:reb:.chakra-button.css-1c5ry1n:has-text("Line Item")');
    await this.page.waitForLoadState('networkidle');
  }

  async clickItemTypeButton() {
    console.log(`[UI] Clicking Item button`);
    await this.page.click('button.chakra-button.css-1fmr6zi:has-text("Item")');
    await this.page.waitForLoadState('networkidle');
  }

  async clickSubmitSO() {
    console.log(`[UI] Submitting Sales Order`);
    await this.page.click('button.chakra-button.css-1qm6idw:has-text("Add")');
    await this.page.waitForLoadState('networkidle');
  }

  async clickViewSO() {
    console.log(`[UI] Clicking view button for SO`);
    await this.page.click('button.chakra-button.css-324nk0:has-text("view")').first();
    await this.page.waitForLoadState('networkidle');
  }

  async verifySOFields() {
    console.log(`[UI] Verifying SO fields`);
    await expect(this.page.locator('input#customer_id')).toBeVisible();
    await expect(this.page.locator('input#warehouse_id')).toBeVisible();
    await expect(this.page.locator('input#location_id')).toBeVisible();
  }

  async verifySOStatus() {
    console.log(`[UI] Verifying SO status`);
    const statusElement = await this.page.locator('[class*="status"], [class*="state"]').first();
    const statusText = await statusElement.textContent();
    await expect(statusText).toMatch(/approved|submitted/i);
  }

  async clickSubmitWithoutFields() {
    console.log(`[UI] Clicking submit without filling fields`);
    await this.page.click('button.chakra-button.css-1qm6idw:has-text("Add")');
    await this.page.waitForLoadState('networkidle');
  }

  // ============================================================================
  // INVOICE UI VERIFICATION METHODS
  // ============================================================================

  async navigateToInvoiceList() {
    console.log(`[UI] Navigating to Invoices list`);
    await this.page.goto('/receivables/invoices');
    await this.page.waitForLoadState('networkidle');
  }

  async clickAddInvoice() {
    console.log(`[UI] Clicking Add Invoice button`);
    await this.page.click('button.chakra-button.css-r0jt5t:has-text("Add Invoice")');
    await this.page.waitForLoadState('networkidle');
  }

  async fillInvoiceNumber(invoiceNumber: string) {
    console.log(`[UI] Filling invoice number: ${invoiceNumber}`);
    await this.page.fill('input#invoice_number.chakra-input.css-bgx4xr', invoiceNumber);
  }

  async fillCustomerInvoice(customerId: string) {
    console.log(`[UI] Filling customer (Invoice): ${customerId}`);
    await this.page.click('button#customer_id.chakra-button.css-1lykmmz');
    await this.page.fill('input#customer_id.chakra-input.css-cu54mj', customerId);
  }

  async fillBudgetInvoice(budgetId: string) {
    console.log(`[UI] Filling budget (Invoice): ${budgetId}`);
    await this.page.click('button#budget_id.chakra-button.css-1lykmmz');
    await this.page.fill('input#budget_id.chakra-input.css-cu54mj', budgetId);
  }

  async fillAccountsReceivableInvoice(arId: string) {
    console.log(`[UI] Filling accounts receivable (Invoice): ${arId}`);
    await this.page.click('button#accounts_receivable_id.chakra-button.css-qtt6lp');
    await this.page.fill('input#accounts_receivable_id.chakra-input.css-cu54mj', arId);
  }

  async fillCurrencyInvoice(currencyId: string) {
    console.log(`[UI] Filling currency (Invoice): ${currencyId}`);
    await this.page.click('button#currency_id.chakra-button.css-1lykmmz');
    await this.page.fill('input#currency_id.chakra-input.css-cu54mj', currencyId);
  }

  async clickLineItemButtonInvoice() {
    console.log(`[UI] Clicking Line Item button (Invoice)`);
    await this.page.click('button#popover-trigger-:r16g:.chakra-button.css-1fmr6zi:has-text("Line Item")');
    await this.page.waitForLoadState('networkidle');
  }

  async clickSubmitInvoice() {
    console.log(`[UI] Submitting Invoice`);
    await this.page.click('button.chakra-button.css-1qm6idw:has-text("Add")');
    await this.page.waitForLoadState('networkidle');
  }

  async clickViewInvoice() {
    console.log(`[UI] Clicking view button for Invoice`);
    await this.page.click('button.chakra-button.css-324nk0:has-text("view")').first();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyInvoiceFields() {
    console.log(`[UI] Verifying Invoice fields`);
    await expect(this.page.locator('input#customer_id')).toBeVisible();
    await expect(this.page.locator('input#warehouse_id')).toBeVisible();
    await expect(this.page.locator('input#location_id')).toBeVisible();
    await expect(this.page.locator('input#invoice_number')).toBeVisible();
  }

  async verifyInvoiceStatus() {
    console.log(`[UI] Verifying Invoice status`);
    const statusElement = await this.page.locator('[class*="status"], [class*="state"]').first();
    const statusText = await statusElement.textContent();
    await expect(statusText).toMatch(/approved|submitted/i);
  }

  // ============================================================================
  // RECEIPT UI VERIFICATION METHODS
  // ============================================================================

  async navigateToReceiptList() {
    console.log(`[UI] Navigating to Receipts list`);
    await this.page.goto('/receivables/receipts');
    await this.page.waitForLoadState('networkidle');
  }

  async clickAddReceipt() {
    console.log(`[UI] Clicking Add Receipt button`);
    await this.page.click('button.chakra-button.css-r0jt5t:has-text("Add Receipt")');
    await this.page.waitForLoadState('networkidle');
  }

  async fillReceiptRef(ref: string) {
    console.log(`[UI] Filling receipt ref: ${ref}`);
    await this.page.fill('input#ref.chakra-input.css-bgx4xr', ref);
  }

  async fillCheckNo(checkNo: string) {
    console.log(`[UI] Filling check no: ${checkNo}`);
    await this.page.fill('input#check_no.chakra-input.css-bgx4xr', checkNo);
  }

  async fillPaymentMethod(paymentMethod: string) {
    console.log(`[UI] Filling payment method: ${paymentMethod}`);
    await this.page.selectOption('select#payment_method.chakra-select.css-1h4ea1o', paymentMethod);
  }

  async fillCustomerReceipt(customerId: string) {
    console.log(`[UI] Filling customer (Receipt): ${customerId}`);
    await this.page.click('button#customer_id.chakra-button.css-qtt6lp');
    await this.page.fill('input#customer_id.chakra-input.css-cu54mj', customerId);
  }

  async fillCashAccount(cashAccountId: string) {
    console.log(`[UI] Filling cash account: ${cashAccountId}`);
    await this.page.click('button#cash_account_id.chakra-button.css-qtt6lp');
    await this.page.fill('input#cash_account_id.chakra-input.css-cu54mj', cashAccountId);
  }

  async fillFiscalBudgetReceipt(budgetId: string) {
    console.log(`[UI] Filling fiscal budget (Receipt): ${budgetId}`);
    await this.page.click('button#fiscal_budget_id.chakra-button.css-1lykmmz');
    await this.page.fill('input#fiscal_budget_id.chakra-input.css-cu54mj', budgetId);
  }

  async fillCurrencyReceipt(currencyId: string) {
    console.log(`[UI] Filling currency (Receipt): ${currencyId}`);
    await this.page.click('button#currency_id.chakra-button.css-qtt6lp');
    await this.page.fill('input#currency_id.chakra-input.css-cu54mj', currencyId);
  }

  async clickLineItemButtonReceipt() {
    console.log(`[UI] Clicking Line Item button (Receipt)`);
    await this.page.click('button#popover-trigger-:r114:.chakra-button.css-1fmr6zi:has-text("Line Item")');
    await this.page.waitForLoadState('networkidle');
  }

  async clickSubmitReceipt() {
    console.log(`[UI] Submitting Receipt`);
    await this.page.click('button.chakra-button.css-1qm6idw:has-text("Add")');
    await this.page.waitForLoadState('networkidle');
  }

  async clickViewReceipt() {
    console.log(`[UI] Clicking view button for Receipt`);
    await this.page.click('button.chakra-button.css-324nk0:has-text("view")').first();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyReceiptFields() {
    console.log(`[UI] Verifying Receipt fields`);
    await expect(this.page.locator('input#customer_id')).toBeVisible();
    await expect(this.page.locator('input#warehouse_id')).toBeVisible();
    await expect(this.page.locator('input#location_id')).toBeVisible();
    await expect(this.page.locator('input#ref')).toBeVisible();
  }

  async verifyReceiptStatus() {
    console.log(`[UI] Verifying Receipt status`);
    const statusElement = await this.page.locator('[class*="status"], [class*="state"]').first();
    const statusText = await statusElement.textContent();
    await expect(statusText).toMatch(/approved|submitted/i);
  }
}
