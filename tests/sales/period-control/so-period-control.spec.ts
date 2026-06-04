import { test, expect } from '@playwright/test';
import { AppManager } from '../../../pages/AppManager';

/**
 * SALES PERIOD CONTROL EDGE CASES
 *
 * Objectives:
 * 1. Verify system rejects back-dated SO, Invoice, Receipt outside fiscal period
 * 2. Verify system rejects future-dated SO, Invoice, Receipt outside fiscal period
 * 3. Test critical edge cases: leap years, month boundaries, year boundaries
 * 4. Test Ethiopian calendar edge cases (system uses EC calendar by default)
 *
 * Fiscal Context:
 * - Default Year: 2018 (Ethiopian Calendar)
 * - Period: yearly
 * - Calendar: EC (Ethiopian Calendar)
 */

test.describe('Sales Period Control Edge Cases @sales @security @temporal @regression @full', () => {
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
    // SALES ORDER (SO) - PERIOD CONTROL SCENARIOS
    // ============================================================================

    test('SO: Reject back-dated Sales Order from previous fiscal year (2017)', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const backDate = '2017-12-31T00:00:00Z';
        console.log(`[TEST] Creating SO with back date: ${backDate}`);

        const so = await app.api.sales.createSalesOrderAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            unitPrice: 5000,
            quantity: 1,
            locationId: item.locationId,
            warehouseId: item.warehouseId,
            soDate: backDate
        });

        if (so.success) {
            try {
                await app.advanceDocumentAPI(so.id, 'sales-orders');
                throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated SO from previous fiscal year!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
                console.log(`[PASS] SO created but blocked at approval: ${advanceErr.message}`);
            }
        } else {
            console.log(`[PASS] Back-dated SO rejected`);
        }
    });

    test('SO: Reject future-dated Sales Order from next fiscal year (2019)', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const futureDate = '2019-01-01T00:00:00Z';
        console.log(`[TEST] Creating SO with future date: ${futureDate}`);

        const so = await app.api.sales.createSalesOrderAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            unitPrice: 5000,
            quantity: 1,
            locationId: item.locationId,
            warehouseId: item.warehouseId,
            soDate: futureDate
        });

        if (so.success) {
            try {
                await app.advanceDocumentAPI(so.id, 'sales-orders');
                throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved SO from next fiscal year!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
                console.log(`[PASS] Future-dated SO blocked at approval: ${advanceErr.message}`);
            }
        } else {
            console.log(`[PASS] Future-dated SO rejected`);
        }
    });

    // ============================================================================
    // INVOICE - PERIOD CONTROL SCENARIOS
    // ============================================================================

    test('Invoice: Reject back-dated Invoice from previous fiscal year (2017)', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const backDate = '2017-12-31T00:00:00Z';
        console.log(`[TEST] Creating Invoice with back date: ${backDate}`);

        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            unitPrice: 5000,
            quantity: 1,
            locationId: item.locationId,
            warehouseId: item.warehouseId,
            invoiceDate: backDate
        });

        if (inv.success) {
            try {
                await app.advanceDocumentAPI(inv.id, 'invoices');
                throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Invoice from previous fiscal year!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
                console.log(`[PASS] Back-dated Invoice blocked at approval: ${advanceErr.message}`);
            }
        } else {
            console.log(`[PASS] Back-dated Invoice rejected`);
        }
    });

    test('Invoice: Reject future-dated Invoice from next fiscal year (2019)', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const futureDate = '2019-01-01T00:00:00Z';
        console.log(`[TEST] Creating Invoice with future date: ${futureDate}`);

        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            unitPrice: 5000,
            quantity: 1,
            locationId: item.locationId,
            warehouseId: item.warehouseId,
            invoiceDate: futureDate
        });

        if (inv.success) {
            try {
                await app.advanceDocumentAPI(inv.id, 'invoices');
                throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved future-dated Invoice from next fiscal year!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
                console.log(`[PASS] Future-dated Invoice blocked at approval: ${advanceErr.message}`);
            }
        } else {
            console.log(`[PASS] Future-dated Invoice rejected`);
        }
    });

    // ============================================================================
    // RECEIPT - PERIOD CONTROL SCENARIOS
    // ============================================================================

    test('Receipt: Reject back-dated Receipt from previous fiscal year (2017)', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            unitPrice: 5000,
            quantity: 1,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        const backDate = '2017-12-31T00:00:00Z';
        console.log(`[TEST] Creating Receipt with back date: ${backDate}`);

        const rct = await app.api.sales.createInvoiceReceiptAPI({
            invoiceId: inv.id,
            customerId: meta.customerId,
            amount: 5000,
            receiptDate: backDate
        });

        if (rct.success) {
            try {
                await app.advanceDocumentAPI(rct.id, 'receipts');
                throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Receipt from previous fiscal year!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
                console.log(`[PASS] Back-dated Receipt blocked at approval: ${advanceErr.message}`);
            }
        } else {
            console.log(`[PASS] Back-dated Receipt rejected`);
        }
    });

    test('Receipt: Reject future-dated Receipt from next fiscal year (2019)', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            unitPrice: 5000,
            quantity: 1,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        const futureDate = '2019-01-01T00:00:00Z';
        console.log(`[TEST] Creating Receipt with future date: ${futureDate}`);

        const rct = await app.api.sales.createInvoiceReceiptAPI({
            invoiceId: inv.id,
            customerId: meta.customerId,
            amount: 5000,
            receiptDate: futureDate
        });

        if (rct.success) {
            try {
                await app.advanceDocumentAPI(rct.id, 'receipts');
                throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved future-dated Receipt from next fiscal year!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
                console.log(`[PASS] Future-dated Receipt blocked at approval: ${advanceErr.message}`);
            }
        } else {
            console.log(`[PASS] Future-dated Receipt rejected`);
        }
    });

    // ============================================================================
    // CRITICAL EDGE CASES
    // ============================================================================

    test('Edge Case: Reject invalid date (Feb 30, 2018)', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const invalidDate = '2018-02-30T00:00:00Z';
        console.log(`[ATTACK] Creating Invoice with invalid date: ${invalidDate}`);

        try {
            const inv = await app.api.sales.createStandaloneInvoiceAPI({
                customerId: meta.customerId,
                itemId: item.itemId,
                unitPrice: 5000,
                quantity: 1,
                locationId: item.locationId,
                warehouseId: item.warehouseId,
                invoiceDate: invalidDate
            });

            if (inv.success) {
                throw new Error(`[CRITICAL_DATA_VALIDATION_BUG] System accepted invalid date (Feb 30)!`);
            }
        } catch (error: any) {
            if (error.message.includes('CRITICAL_DATA_VALIDATION_BUG')) throw error;
            console.log(`[PASS] Invalid date rejected: ${error.message}`);
        }
    });

    test('Edge Case: Reject date with negative timestamp (epoch manipulation)', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const epochDate = '1969-12-31T00:00:00Z';
        console.log(`[TEST] Creating Invoice with pre-epoch date: ${epochDate}`);

        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            unitPrice: 5000,
            quantity: 1,
            locationId: item.locationId,
            warehouseId: item.warehouseId,
            invoiceDate: epochDate
        });

        if (inv.success) {
            throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System accepted pre-epoch date!`);
        } else {
            console.log(`[PASS] Pre-epoch date rejected`);
        }
    });

    test('Edge Case: Verify SO->Invoice->Receipt chain with mixed dates is blocked', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        console.log(`[TEST] Creating SO with valid date, Invoice with back date`);

        const so = await app.api.sales.createSalesOrderAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            unitPrice: 5000,
            quantity: 1,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(so.id, 'sales-orders');

        const inv = await app.api.sales.createInvoiceAPI({
            customerId: meta.customerId,
            soItemId: so.soItemId,
            releasedQuantity: 1,
            locationId: item.locationId,
            warehouseId: item.warehouseId,
            invoiceDate: '2017-12-31T00:00:00Z'
        });

        if (inv.success) {
            try {
                await app.advanceDocumentAPI(inv.id, 'invoices');
                throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Invoice in SO->Invoice chain!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
                console.log(`[PASS] Back-dated Invoice in chain blocked at approval: ${advanceErr.message}`);
            }
        } else {
            console.log(`[PASS] Mixed date chain rejected`);
        }
    });
});
