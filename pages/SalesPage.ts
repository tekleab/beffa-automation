import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../lib/base-page';

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
    await this.page.locator('button#customer_id').click();
    await this.page.locator('input#customer_id').fill(customerId);
  }

  async fillLocation(locationId: string) {
    console.log(`[UI] Filling location: ${locationId}`);
    const button = this.page.getByRole('button', { name: /select location/i });
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
    await this.page.locator('input#location_id').fill(locationId);
  }

  async fillWarehouse(warehouseId: string) {
    console.log(`[UI] Filling warehouse: ${warehouseId}`);
    const button = this.page.getByRole('button', { name: /select warehouse/i });
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
    await this.page.locator('input#warehouse_id').fill(warehouseId);
  }

  async fillItem(itemId: string) {
    console.log(`[UI] Filling item: ${itemId}`);
    await this.page.getByPlaceholder('Search...').fill(itemId);
  }

  async fillQuantity(quantity: string) {
    console.log(`[UI] Filling quantity: ${quantity}`);
    await this.page.locator('input[type="number"]').first().fill(quantity);
  }

  async fillPrice(price: string) {
    console.log(`[UI] Filling price: ${price}`);
    const priceInputs = await this.page.locator('input[type="number"]').all();
    if (priceInputs.length > 1) {
      await priceInputs[1].fill(price);
    }
  }

  async clickDateButton() {
    console.log(`[UI] Clicking date button`);
    const button = this.page.getByRole('button', { name: /date/i });
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
  }

  async clickAddLineItem() {
    console.log(`[UI] Clicking Add button for line item`);
    const button = this.page.getByRole('button', { name: 'Add' });
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
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
    const button = this.page.getByRole('button', { name: 'Add Sales Order' });
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickLineItemButtonSO() {
    console.log(`[UI] Clicking Line Item button (SO)`);
    const button = this.page.getByRole('button', { name: 'Line Item' });
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickItemTypeButton() {
    console.log(`[UI] Clicking Item button`);
    const button = this.page.getByRole('button', { name: 'Item' });
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickSubmitSO() {
    console.log(`[UI] Submitting Sales Order`);
    const button = this.page.getByRole('button', { name: 'Add' });
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickViewSO() {
    console.log(`[UI] Clicking view button for SO`);
    const button = this.page.getByRole('button', { name: 'view' }).first();
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
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
    const button = this.page.getByRole('button', { name: 'Add' });
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
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
    const button = this.page.getByRole('button', { name: 'Add Invoice' });
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillInvoiceNumber(invoiceNumber: string) {
    console.log(`[UI] Filling invoice number: ${invoiceNumber}`);
    await this.page.locator('input#invoice_number').fill(invoiceNumber);
  }

  async fillCustomerInvoice(customerId: string) {
    console.log(`[UI] Filling customer (Invoice): ${customerId}`);
    await this.page.locator('button#customer_id').click();
    await this.page.locator('input#customer_id').fill(customerId);
  }

  async fillBudgetInvoice(budgetId: string) {
    console.log(`[UI] Filling budget (Invoice): ${budgetId}`);
    await this.page.locator('button#budget_id').click();
    await this.page.locator('input#budget_id').fill(budgetId);
  }

  async fillAccountsReceivableInvoice(arId: string) {
    console.log(`[UI] Filling accounts receivable (Invoice): ${arId}`);
    await this.page.locator('button#accounts_receivable_id').click();
    await this.page.locator('input#accounts_receivable_id').fill(arId);
  }

  async fillCurrencyInvoice(currencyId: string) {
    console.log(`[UI] Filling currency (Invoice): ${currencyId}`);
    await this.page.locator('button#currency_id').click();
    await this.page.locator('input#currency_id').fill(currencyId);
  }

  async clickLineItemButtonInvoice() {
    console.log(`[UI] Clicking Line Item button (Invoice)`);
    const button = this.page.getByRole('button', { name: 'Line Item' });
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickSubmitInvoice() {
    console.log(`[UI] Submitting Invoice`);
    const button = this.page.getByRole('button', { name: 'Add' });
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickViewInvoice() {
    console.log(`[UI] Clicking view button for Invoice`);
    const button = this.page.getByRole('button', { name: 'view' }).first();
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
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
    const button = this.page.getByRole('button', { name: 'Add Receipt' });
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillReceiptRef(ref: string) {
    console.log(`[UI] Filling receipt ref: ${ref}`);
    await this.page.locator('input#ref').fill(ref);
  }

  async fillCheckNo(checkNo: string) {
    console.log(`[UI] Filling check no: ${checkNo}`);
    await this.page.locator('input#check_no').fill(checkNo);
  }

  async fillPaymentMethod(paymentMethod: string) {
    console.log(`[UI] Filling payment method: ${paymentMethod}`);
    await this.page.locator('select#payment_method').selectOption(paymentMethod);
  }

  async fillCustomerReceipt(customerId: string) {
    console.log(`[UI] Filling customer (Receipt): ${customerId}`);
    await this.page.locator('button#customer_id').click();
    await this.page.locator('input#customer_id').fill(customerId);
  }

  async fillCashAccount(cashAccountId: string) {
    console.log(`[UI] Filling cash account: ${cashAccountId}`);
    await this.page.locator('button#cash_account_id').click();
    await this.page.locator('input#cash_account_id').fill(cashAccountId);
  }

  async fillFiscalBudgetReceipt(budgetId: string) {
    console.log(`[UI] Filling fiscal budget (Receipt): ${budgetId}`);
    await this.page.locator('button#fiscal_budget_id').click();
    await this.page.locator('input#fiscal_budget_id').fill(budgetId);
  }

  async fillCurrencyReceipt(currencyId: string) {
    console.log(`[UI] Filling currency (Receipt): ${currencyId}`);
    await this.page.locator('button#currency_id').click();
    await this.page.locator('input#currency_id').fill(currencyId);
  }

  async clickLineItemButtonReceipt() {
    console.log(`[UI] Clicking Line Item button (Receipt)`);
    const button = this.page.getByRole('button', { name: 'Line Item' });
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickSubmitReceipt() {
    console.log(`[UI] Submitting Receipt`);
    const button = this.page.getByRole('button', { name: 'Add' });
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickViewReceipt() {
    console.log(`[UI] Clicking view button for Receipt`);
    const button = this.page.getByRole('button', { name: 'view' }).first();
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
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
