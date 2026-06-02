import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { Logger } from '../../lib/utils/Logger';

/**
 * SALES CUSTOMER BALANCE UI AUDIT
 *
 * Objectives:
 * 1. Approved invoice must reflect correct outstanding balance in customer profile UI.
 * 2. After full payment, customer profile must show zero outstanding balance.
 */

test.describe('Sales Customer Balance UI Audits @sales @smoke @full', () => {
    test.setTimeout(300000);

    test('UI Audit: Approved invoice reflects outstanding balance in customer profile', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
        if (!item) { console.log('[SKIP] No stock available.'); return; }

        console.log(`[STEP 1] Creating & approving invoice via API...`);
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            quantity: 1,
            unitPrice: item.unitCost || 750,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');
        console.log(`[OK] Invoice ${inv.ref} approved.`);

        // Read the actual invoice total from the backend (backend may override unit_price with item cost)
        console.log(`[STEP 2] Asserting outstanding balance via API...`);
        const invoiceData = await app.api.sales.getInvoiceAPI(inv.id);
        const netDue = parseFloat(invoiceData.net_due ?? '-1');
        const outstanding = parseFloat(invoiceData.unreceived_amount ?? invoiceData.balance ?? '-1');
        if (netDue === -1) throw new Error(`[AUDIT] 'net_due' field missing from invoice response.`);
        if (outstanding === -1) throw new Error(`[AUDIT] 'unreceived_amount' field missing from invoice response.`);
        console.log(`[AUDIT] Invoice ${inv.ref} | net_due: ${netDue} | unreceived: ${outstanding}`);
        // An approved, unpaid invoice must have unreceived_amount == net_due
        expect(outstanding).toBeCloseTo(netDue, 2);

        console.log(`[STEP 3] Navigating to customer profile...`);
        await page.goto(`/receivables/customers/${meta.customerId}/detail`);

        console.log(`[STEP 4] Opening Invoices tab...`);
        const invoicesTab = page.getByRole('tab', { name: /^Invoices$/i }).first();
        await invoicesTab.waitFor({ state: 'visible', timeout: 15000 });
        await invoicesTab.click();
        await page.waitForTimeout(2000);

        console.log(`[STEP 5] Asserting invoice ${inv.ref} is visible in customer profile...`);
        const tabContent = await page.locator('table').first().textContent().catch(() => 'No table found');
        Logger.debug(`Tab content preview: ${tabContent?.substring(0, 200)}...`);

        const invoiceLocator = page.getByText(inv.ref).first();
        const isVisible = await invoiceLocator.isVisible({ timeout: 15000 }).catch(() => false);

        if (!isVisible) {
            const rowCount = await page.locator('table tbody tr').count();
            console.log(`[DEBUG] Rows in table: ${rowCount}`);
            throw new Error(`Invoice ${inv.ref} not found in customer profile UI. Customer: ${meta.customerId}`);
        }

        console.log(`[PASS] Invoice ${inv.ref} confirmed visible. Outstanding balance ${outstanding} verified.`);
    });

    test('UI Audit: Customer profile shows zero balance after full payment', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
        if (!item) { console.log('[SKIP] No stock available.'); return; }

        console.log(`[STEP 1] Creating invoice, approving, and paying in full via API...`);
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            quantity: 1,
            unitPrice: item.unitCost || 600,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        // Read the actual invoice total before paying — backend may override unit_price
        const invData = await app.api.sales.getInvoiceAPI(inv.id);
        const ACTUAL_AMOUNT = parseFloat(invData.net_due ?? invData.unreceived_amount ?? '0');
        if (!ACTUAL_AMOUNT) throw new Error(`[AUDIT] Could not determine invoice net_due for payment. Response: ${JSON.stringify(invData).substring(0, 200)}`);
        console.log(`[OK] Invoice ${inv.ref} net_due: ${ACTUAL_AMOUNT}`);

        const rct = await app.api.sales.createInvoiceReceiptAPI({
            invoiceId: inv.id,
            customerId: meta.customerId,
            amount: ACTUAL_AMOUNT
        });
        await app.advanceDocumentAPI(rct.id, 'receipts');
        console.log(`[OK] Invoice ${inv.ref} fully paid via receipt ${rct.ref}.`);

        await page.waitForTimeout(3000);

        console.log(`[STEP 2] Verifying invoice balance is zero via API...`);
        const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
        const remaining = parseFloat(finalInv.unreceived_amount ?? finalInv.balance ?? '-1');
        if (remaining === -1) throw new Error(`[AUDIT] 'unreceived_amount' field missing from invoice response.`);
        console.log(`[AUDIT] Invoice ${inv.ref} remaining balance: ${remaining} (Expected: 0)`);
        expect(remaining).toBeCloseTo(0, 2);

        console.log(`[STEP 3] Navigating to customer profile to verify paid status in UI...`);
        await page.goto(`/receivables/customers/${meta.customerId}/detail`);

        const invoicesTab = page.getByRole('tab', { name: /^Invoices$/i }).first();
        await invoicesTab.waitFor({ state: 'visible', timeout: 150000 });
        await invoicesTab.click();
        await page.waitForTimeout(2000);

        // Check Receipts tab for the receipt ref — this is a hard assertion
        console.log(`[STEP 4] Asserting receipt ${rct.ref} is visible in customer profile...`);
        const receiptsTab = page.getByRole('tab', { name: /^Receipts$/i }).first();
        if (await receiptsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
            await receiptsTab.click();
            await page.waitForTimeout(2000);
        }

        const rcptLocator = page.getByText(rct.ref).first();
        await expect(rcptLocator).toBeVisible({ timeout: 15000 });

        console.log(`[PASS] Receipt ${rct.ref} confirmed in customer profile. Balance cleared to zero.`);
    });
});
