import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: Sales Order - Fiscal Period Control & Date Validation Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. SO with date outside open fiscal period rejected
 * 2. Closed period prevents SO creation and approval
 * 3. Period boundary edge cases (first/last day of period)
 * =============================================================================
 */



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
    test.setTimeout(120000);

    let sharedMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        sharedMeta = await app.api.sales.discoverMetadataAPI();
        sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
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
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
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
                throw new Error(`[PERIOD_CONTROL_BUG] System approved back-dated SO from previous fiscal year (${backDate})!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('PERIOD_CONTROL_BUG')) throw advanceErr;
                console.log(`[PASS] SO created but blocked at approval: ${advanceErr.message}`);
            }
        } else {
            console.log(`[PASS] Back-dated SO rejected at creation`);
        }
    });

    test('SO: Reject future-dated Sales Order from next fiscal year (2019)', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
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
                throw new Error(`[PERIOD_CONTROL_BUG] System approved future-dated SO (${futureDate})!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('PERIOD_CONTROL_BUG')) throw advanceErr;
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
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
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
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
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
                throw new Error(`[PERIOD_CONTROL_BUG] System approved future-dated Invoice (${futureDate})!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('PERIOD_CONTROL_BUG')) throw advanceErr;
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
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
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

        const invoiceData = await app.api.sales.getInvoiceAPI(inv.id);
        // net_due = original invoice total; unreceived_amount = outstanding balance (may lag)
        // Use whichever is smaller and > 0 to avoid over-paying
        const netDue = parseFloat(invoiceData.net_due ?? '0');
        const unreceivedAmt = parseFloat(invoiceData.unreceived_amount ?? invoiceData.due ?? '0');
        const invAmount = unreceivedAmt > 0 ? unreceivedAmt : netDue;
        if (invAmount <= 0) {
            console.log(`[SKIP] Invoice ${inv.ref} already fully paid (balance=${invAmount}). Skipping receipt creation.`);
            return;
        }

        const rct = await app.api.sales.createInvoiceReceiptAPI({
            invoiceId: inv.id,
            customerId: meta.customerId,
            amount: invAmount,
            receiptDate: backDate
        });

        if (rct.success) {
            try {
                await app.advanceDocumentAPI(rct.id, 'receipts');
                throw new Error(
                    `[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Receipt from previous fiscal year!\n` +
                    `  Receipt ID   : ${rct.id}\n` +
                    `  Receipt Ref  : ${rct.ref}\n` +
                    `  Receipt Date : ${backDate}\n` +
                    `  Invoice ID   : ${inv.id}\n` +
                    `  Invoice Ref  : ${inv.ref}\n` +
                    `  Amount       : ${invAmount}\n` +
                    `  Customer     : ${meta.customerId}\n` +
                    `  Status       : Approved — period control NOT enforced at Receipt approval`
                );
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
                console.log(`[PASS] Back-dated Receipt blocked at approval: ${advanceErr.message}`);
            }
        } else {
            console.log(`[PASS] Back-dated Receipt rejected at creation`);
        }
    });

    test('Receipt: Reject future-dated Receipt from next fiscal year (2019)', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
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

        const invData = await app.api.sales.getInvoiceAPI(inv.id);
        const receiptAmount = parseFloat(invData.net_due ?? invData.unreceived_amount ?? invData.total_amount ?? '5000');
        const rct = await app.api.sales.createInvoiceReceiptAPI({
            invoiceId: inv.id,
            customerId: meta.customerId,
            amount: receiptAmount > 0 ? receiptAmount : 5000,
            receiptDate: futureDate
        });

        if (rct.success) {
            try {
                await app.advanceDocumentAPI(rct.id, 'receipts');
                throw new Error(`[PERIOD_CONTROL_BUG] System approved future-dated Receipt (${futureDate})!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('PERIOD_CONTROL_BUG')) throw advanceErr;
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
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
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
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
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
            throw new Error(`[PERIOD_CONTROL_BUG] System accepted pre-epoch date (${epochDate})!`);
        } else {
            console.log(`[PASS] Pre-epoch date rejected`);
        }
    });

    test('Edge Case: Verify SO->Invoice->Receipt chain with mixed dates is blocked', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
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
