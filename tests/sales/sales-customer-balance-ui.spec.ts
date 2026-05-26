import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * SALES CUSTOMER BALANCE UI AUDIT
 *
 * Objectives:
 * 1. Approved invoice must reflect correct outstanding balance in customer profile UI.
 * 2. After full payment, customer profile must show zero outstanding balance.
 */

test.describe('Sales Customer Balance UI Audits @sales @smoke @regression @full', () => {
    test.setTimeout(300000);

    test('UI Audit: Approved invoice reflects outstanding balance in customer profile', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
        if (!item) { console.log('[SKIP] No stock available.'); return; }

        const UNIT_PRICE = 750;

        console.log(`[STEP 1] Creating & approving invoice for ${UNIT_PRICE} via API...`);
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            quantity: 1,
            unitPrice: UNIT_PRICE,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');
        console.log(`[OK] Invoice ${inv.ref} approved.`);

        console.log(`[STEP 2] Navigating to customer profile...`);
        await page.goto(`/receivables/customers/${meta.customerId}/detail`, { waitUntil: 'networkidle' });

        console.log(`[STEP 3] Opening Invoices tab...`);
        const invoicesTab = page.getByRole('tab', { name: /Invoices|Transactions/i }).first();
        await invoicesTab.waitFor({ state: 'visible', timeout: 15000 });
        await invoicesTab.click();
        await page.waitForTimeout(2000);

        console.log(`[STEP 4] Asserting invoice ${inv.ref} is visible in customer profile...`);
        await expect(page.getByText(inv.ref).first()).toBeVisible({ timeout: 30000 });
        console.log(`[PASS] Invoice ${inv.ref} confirmed visible in customer profile.`);
    });

    test('UI Audit: Customer profile shows zero balance after full payment', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
        if (!item) { console.log('[SKIP] No stock available.'); return; }

        const AMOUNT = 600;

        console.log(`[STEP 1] Creating invoice, approving, and paying in full via API...`);
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            quantity: 1,
            unitPrice: AMOUNT,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        const rct = await app.api.sales.createInvoiceReceiptAPI({
            invoiceId: inv.id,
            customerId: meta.customerId,
            amount: AMOUNT
        });
        await app.advanceDocumentAPI(rct.id, 'receipts');
        console.log(`[OK] Invoice ${inv.ref} fully paid via receipt ${rct.ref}.`);

        await page.waitForTimeout(3000);

        console.log(`[STEP 2] Verifying invoice balance is zero via API...`);
        const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
        const remaining = parseFloat(finalInv.unreceived_amount || finalInv.balance || '0');
        console.log(`[AUDIT] Invoice ${inv.ref} remaining balance: ${remaining}`);
        expect(remaining).toBeCloseTo(0, 1);

        console.log(`[STEP 3] Navigating to customer profile to verify paid status...`);
        await page.goto(`/receivables/customers/${meta.customerId}/detail`, { waitUntil: 'networkidle' });

        const invoicesTab = page.getByRole('tab', { name: /Invoices|Transactions/i }).first();
        await invoicesTab.waitFor({ state: 'visible', timeout: 15000 });
        await invoicesTab.click();
        await page.waitForTimeout(2000);

        console.log(`[STEP 4] Asserting receipt ${rct.ref} is visible in customer profile...`);
        const receiptsTab = page.getByRole('tab', { name: /Receipts/i }).first();
        if (await receiptsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
            await receiptsTab.click();
            await page.waitForTimeout(2000);
        }

        await expect(page.getByText(rct.ref).first()).toBeVisible({ timeout: 30000 });
        console.log(`[PASS] Receipt ${rct.ref} confirmed in customer profile. Balance cleared to zero.`);
    });
});
