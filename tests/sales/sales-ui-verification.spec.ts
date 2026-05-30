import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { SalesPage } from '../../pages/SalesPage';

/**
 * SALES UI VERIFICATION - COMPREHENSIVE FLOW TESTS
 * 
 * Objectives:
 * 1. Verify complete UI flow for Sales Order, Invoice, and Receipt using POM structure
 * 2. Validate UI elements, validation messages, and workflows
 * 3. Test dynamic interactions like professional QA testers
 * 4. Capture screenshots at key verification points
 */

test.describe('Sales Order UI Verification @sales @ui @regression', () => {
    test.setTimeout(300000);

    let sharedMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['captureRandomItemDataAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        sharedMeta = await app.api.sales.discoverMetadataAPI();
        sharedItem = await app.api.inventory.captureRandomItemDataAPI({ minStock: 2 });
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    // ============================================================================
    // SALES ORDER UI FLOW
    // ============================================================================

    test('SO: Complete UI flow - Create, Validate, Approve', async ({ page }) => {
        const app = new AppManager(page);
        const salesPage = new SalesPage(page);

        console.log(`[UI FLOW] Starting Sales Order UI verification`);

        // Navigate to Sales Orders page
        await salesPage.navigateToSOList();
        await page.screenshot({ path: 'test-results/ui/so-list-initial.png' });

        // Click Add Sales Order button
        await salesPage.clickAddSalesOrder();
        await page.screenshot({ path: 'test-results/ui/so-form-blank.png' });

        // Fill customer field (using shared method with SO-specific class)
        await salesPage.fillCustomer(sharedMeta.customerId, 'css-lwolnh');
        await page.screenshot({ path: 'test-results/ui/so-form-customer.png' });

        // Click Line Item button
        await salesPage.clickLineItemButtonSO();
        await page.screenshot({ path: 'test-results/ui/so-line-item-menu.png' });

        // Click Item button
        await salesPage.clickItemTypeButton();
        await page.screenshot({ path: 'test-results/ui/so-item-form-blank.png' });

        // Fill item field (using shared method)
        await salesPage.fillItem(sharedItem.itemId);
        await page.screenshot({ path: 'test-results/ui/so-form-item.png' });

        // Fill quantity (using shared method)
        await salesPage.fillQuantity('1');
        await page.screenshot({ path: 'test-results/ui/so-form-quantity.png' });

        // Fill unit price (using shared method)
        await salesPage.fillPrice('5000');
        await page.screenshot({ path: 'test-results/ui/so-form-price.png' });

        // Fill location (using shared method)
        await salesPage.fillLocation(sharedItem.locationId);
        await page.screenshot({ path: 'test-results/ui/so-form-location.png' });

        // Fill warehouse (using shared method)
        await salesPage.fillWarehouse(sharedItem.warehouseId);
        await page.screenshot({ path: 'test-results/ui/so-form-warehouse.png' });

        // Click Add button to add line item (using shared method)
        await salesPage.clickAddLineItem();
        await page.screenshot({ path: 'test-results/ui/so-line-item-added.png' });

        // Fill date (using shared method)
        await salesPage.clickDateButton();
        await page.screenshot({ path: 'test-results/ui/so-form-date.png' });

        await page.screenshot({ path: 'test-results/ui/so-form-complete.png' });

        // Submit form
        await salesPage.clickSubmitSO();
        await page.screenshot({ path: 'test-results/ui/so-after-submit.png' });

        // Verify success message (using shared method)
        await salesPage.verifySuccessMessage();

        // Verify document created in list
        await salesPage.navigateToSOList();
        await page.screenshot({ path: 'test-results/ui/so-list-after-create.png' });

        // Navigate to detail view
        await salesPage.clickViewSO();
        await page.screenshot({ path: 'test-results/ui/so-detail-view.png' });

        // Verify all fields in detail view
        await salesPage.verifySOFields();

        // Test approval workflow
        await salesPage.clickSubmitSO();
        await page.screenshot({ path: 'test-results/ui/so-after-approval.png' });

        // Verify status changed to Approved
        await salesPage.verifySOStatus();
    });

    // ============================================================================
    // VALIDATION TESTING
    // ============================================================================

    test('SO: Verify validation messages for required fields', async ({ page }) => {
        const app = new AppManager(page);
        const salesPage = new SalesPage(page);

        console.log(`[UI FLOW] Testing validation messages`);

        // Navigate to Sales Orders
        await salesPage.navigateToSOList();
        await salesPage.clickAddSalesOrder();

        // Try to submit without filling required fields
        await salesPage.clickSubmitWithoutFields();
        await page.screenshot({ path: 'test-results/ui/so-validation-errors.png' });

        // Verify validation messages appear
        await salesPage.verifyValidationErrors();
    });

    // ============================================================================
    // INVOICE UI FLOW
    // ============================================================================

    test('Invoice: Complete UI flow - Create, Validate, Approve', async ({ page }) => {
        const app = new AppManager(page);
        const salesPage = new SalesPage(page);

        console.log(`[UI FLOW] Starting Invoice UI verification`);

        // Navigate to Invoices page
        await salesPage.navigateToInvoiceList();
        await page.screenshot({ path: 'test-results/ui/invoice-list-initial.png' });

        // Click Add Invoice button
        await salesPage.clickAddInvoice();
        await page.screenshot({ path: 'test-results/ui/invoice-form-blank.png' });

        // Fill invoice number
        await salesPage.fillInvoiceNumber('INV-' + Date.now());
        await page.screenshot({ path: 'test-results/ui/invoice-form-number.png' });

        // Fill customer field (using Invoice-specific method)
        await salesPage.fillCustomerInvoice(sharedMeta.customerId);
        await page.screenshot({ path: 'test-results/ui/invoice-form-customer.png' });

        // Fill budget (Invoice-specific)
        await salesPage.fillBudgetInvoice(sharedMeta.salesAccountId);
        await page.screenshot({ path: 'test-results/ui/invoice-form-budget.png' });

        // Fill accounts receivable (Invoice-specific)
        await salesPage.fillAccountsReceivableInvoice(sharedMeta.arAccountId);
        await page.screenshot({ path: 'test-results/ui/invoice-form-ar.png' });

        // Fill currency (Invoice-specific)
        await salesPage.fillCurrencyInvoice(sharedMeta.currencyId);
        await page.screenshot({ path: 'test-results/ui/invoice-form-currency.png' });

        // Click Line Item button
        await salesPage.clickLineItemButtonInvoice();
        await page.screenshot({ path: 'test-results/ui/invoice-line-item-menu.png' });

        // Click Item button (using shared method)
        await salesPage.clickItemTypeButton();
        await page.screenshot({ path: 'test-results/ui/invoice-item-form-blank.png' });

        // Fill item field (using shared method)
        await salesPage.fillItem(sharedItem.itemId);
        await page.screenshot({ path: 'test-results/ui/invoice-form-item.png' });

        // Fill quantity (using shared method)
        await salesPage.fillQuantity('1');
        await page.screenshot({ path: 'test-results/ui/invoice-form-quantity.png' });

        // Fill unit price (using shared method)
        await salesPage.fillPrice('5000');
        await page.screenshot({ path: 'test-results/ui/invoice-form-price.png' });

        // Fill location (using shared method)
        await salesPage.fillLocation(sharedItem.locationId);
        await page.screenshot({ path: 'test-results/ui/invoice-form-location.png' });

        // Fill warehouse (using shared method)
        await salesPage.fillWarehouse(sharedItem.warehouseId);
        await page.screenshot({ path: 'test-results/ui/invoice-form-warehouse.png' });

        // Click Add button to add line item (using shared method)
        await salesPage.clickAddLineItem();
        await page.screenshot({ path: 'test-results/ui/invoice-line-item-added.png' });

        // Fill date (using shared method)
        await salesPage.clickDateButton();
        await page.screenshot({ path: 'test-results/ui/invoice-form-date.png' });

        await page.screenshot({ path: 'test-results/ui/invoice-form-complete.png' });

        // Submit form
        await salesPage.clickSubmitInvoice();
        await page.screenshot({ path: 'test-results/ui/invoice-after-submit.png' });

        // Verify success message (using shared method)
        await salesPage.verifySuccessMessage();

        // Verify document created in list
        await salesPage.navigateToInvoiceList();
        await page.screenshot({ path: 'test-results/ui/invoice-list-after-create.png' });

        // Navigate to detail view
        await salesPage.clickViewInvoice();
        await page.screenshot({ path: 'test-results/ui/invoice-detail-view.png' });

        // Verify all fields in detail view
        await salesPage.verifyInvoiceFields();

        // Test approval workflow
        await salesPage.clickSubmitInvoice();
        await page.screenshot({ path: 'test-results/ui/invoice-after-approval.png' });

        // Verify status changed to Approved
        await salesPage.verifyInvoiceStatus();
    });

    test('Invoice: Verify validation messages for required fields', async ({ page }) => {
        const app = new AppManager(page);
        const salesPage = new SalesPage(page);

        console.log(`[UI FLOW] Testing Invoice validation messages`);

        // Navigate to Invoices
        await salesPage.navigateToInvoiceList();
        await salesPage.clickAddInvoice();

        // Try to submit without filling required fields
        await salesPage.clickSubmitInvoice();
        await page.screenshot({ path: 'test-results/ui/invoice-validation-errors.png' });

        // Verify validation messages appear (using shared method)
        await salesPage.verifyValidationErrors();
    });

    // ============================================================================
    // RECEIPT UI FLOW
    // ============================================================================

    test('Receipt: Complete UI flow - Create, Validate, Approve', async ({ page }) => {
        const app = new AppManager(page);
        const salesPage = new SalesPage(page);

        console.log(`[UI FLOW] Starting Receipt UI verification`);

        // Navigate to Receipts page
        await salesPage.navigateToReceiptList();
        await page.screenshot({ path: 'test-results/ui/receipt-list-initial.png' });

        // Click Add Receipt button
        await salesPage.clickAddReceipt();
        await page.screenshot({ path: 'test-results/ui/receipt-form-blank.png' });

        // Fill receipt ref
        await salesPage.fillReceiptRef('RCP-' + Date.now());
        await page.screenshot({ path: 'test-results/ui/receipt-form-ref.png' });

        // Fill check no
        await salesPage.fillCheckNo('CHK-' + Date.now());
        await page.screenshot({ path: 'test-results/ui/receipt-form-check-no.png' });

        // Fill payment method
        await salesPage.fillPaymentMethod('cash');
        await page.screenshot({ path: 'test-results/ui/receipt-form-payment-method.png' });

        // Fill customer field (using Receipt-specific method)
        await salesPage.fillCustomerReceipt(sharedMeta.customerId);
        await page.screenshot({ path: 'test-results/ui/receipt-form-customer.png' });

        // Fill cash account (Receipt-specific)
        await salesPage.fillCashAccount(sharedMeta.cashAccountId);
        await page.screenshot({ path: 'test-results/ui/receipt-form-cash-account.png' });

        // Fill fiscal budget (Receipt-specific)
        await salesPage.fillFiscalBudgetReceipt(sharedMeta.salesAccountId);
        await page.screenshot({ path: 'test-results/ui/receipt-form-budget.png' });

        // Fill currency (Receipt-specific)
        await salesPage.fillCurrencyReceipt(sharedMeta.currencyId);
        await page.screenshot({ path: 'test-results/ui/receipt-form-currency.png' });

        // Click Line Item button
        await salesPage.clickLineItemButtonReceipt();
        await page.screenshot({ path: 'test-results/ui/receipt-line-item-menu.png' });

        // Click Item button (using shared method)
        await salesPage.clickItemTypeButton();
        await page.screenshot({ path: 'test-results/ui/receipt-item-form-blank.png' });

        // Fill item field (using shared method)
        await salesPage.fillItem(sharedItem.itemId);
        await page.screenshot({ path: 'test-results/ui/receipt-form-item.png' });

        // Fill quantity (using shared method)
        await salesPage.fillQuantity('1');
        await page.screenshot({ path: 'test-results/ui/receipt-form-quantity.png' });

        // Fill unit price (using shared method)
        await salesPage.fillPrice('5000');
        await page.screenshot({ path: 'test-results/ui/receipt-form-price.png' });

        // Fill location (using shared method)
        await salesPage.fillLocation(sharedItem.locationId);
        await page.screenshot({ path: 'test-results/ui/receipt-form-location.png' });

        // Fill warehouse (using shared method)
        await salesPage.fillWarehouse(sharedItem.warehouseId);
        await page.screenshot({ path: 'test-results/ui/receipt-form-warehouse.png' });

        // Click Add button to add line item (using shared method)
        await salesPage.clickAddLineItem();
        await page.screenshot({ path: 'test-results/ui/receipt-line-item-added.png' });

        // Fill date (using shared method)
        await salesPage.clickDateButton();
        await page.screenshot({ path: 'test-results/ui/receipt-form-date.png' });

        await page.screenshot({ path: 'test-results/ui/receipt-form-complete.png' });

        // Submit form
        await salesPage.clickSubmitReceipt();
        await page.screenshot({ path: 'test-results/ui/receipt-after-submit.png' });

        // Verify success message (using shared method)
        await salesPage.verifySuccessMessage();

        // Verify document created in list
        await salesPage.navigateToReceiptList();
        await page.screenshot({ path: 'test-results/ui/receipt-list-after-create.png' });

        // Navigate to detail view
        await salesPage.clickViewReceipt();
        await page.screenshot({ path: 'test-results/ui/receipt-detail-view.png' });

        // Verify all fields in detail view
        await salesPage.verifyReceiptFields();

        // Test approval workflow
        await salesPage.clickSubmitReceipt();
        await page.screenshot({ path: 'test-results/ui/receipt-after-approval.png' });

        // Verify status changed to Approved
        await salesPage.verifyReceiptStatus();
    });

    test('Receipt: Verify validation messages for required fields', async ({ page }) => {
        const app = new AppManager(page);
        const salesPage = new SalesPage(page);

        console.log(`[UI FLOW] Testing Receipt validation messages`);

        // Navigate to Receipts
        await salesPage.navigateToReceiptList();
        await salesPage.clickAddReceipt();

        // Try to submit without filling required fields
        await salesPage.clickSubmitReceipt();
        await page.screenshot({ path: 'test-results/ui/receipt-validation-errors.png' });

        // Verify validation messages appear (using shared method)
        await salesPage.verifyValidationErrors();
    });
});
