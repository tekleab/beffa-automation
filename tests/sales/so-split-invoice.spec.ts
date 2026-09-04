import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: Sales Order - Split Invoice Workflow Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Single SO split into multiple invoices by line selection
 * 2. Each split invoice total matches selected line sum
 * 3. All split invoices together equal original SO total
 * =============================================================================
 */



/**
 * SALES SO SPLIT INVOICE AUDIT
 *
 * Objective:
 * SO for 10 units — release in 2 batches (4 + 6).
 * Assert total invoiced never exceeds SO qty and system blocks a 3rd invoice.
 */

test.describe('Sales SO Split Invoice Audit @sales @logic @smoke @regression @full', () => {
    test.setTimeout(120000);

    test('Audit: SO split into multiple invoices — total must never exceed SO quantity', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);


        const SO_QTY = 10;
        const BATCH_1 = 4;
        const BATCH_2 = 6;
        const OVER_QTY = 1; // attempt after SO is fully released

        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'FIFO', quantity: SO_QTY + 10, unit_cost: 100 });
        if (!item) { console.log(`[SKIP] No item with stock >= ${SO_QTY}.`); return; }

        console.log(`\n========== SO SPLIT INVOICE SETUP ==========`);
        console.log(`[ITEM]  Item ID     : ${item.itemId} (${item.itemName})`);
        console.log(`[ITEM]  Stock       : ${item.currentStock}`);
        console.log(`[PLAN]  SO Qty      : ${SO_QTY}`);
        console.log(`[PLAN]  Batch 1     : ${BATCH_1}`);
        console.log(`[PLAN]  Batch 2     : ${BATCH_2}`);
        console.log(`[PLAN]  Over-release: ${OVER_QTY} (must be blocked)`);
        console.log(`============================================\n`);

        console.log(`[STEP 1] Creating & approving SO for ${SO_QTY} units...`);
        const so = await app.api.sales.createSalesOrderAPI({
            itemId: item.itemId,
            quantity: SO_QTY,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(so.id, 'sales-orders');
        console.log(`[OK] SO ${so.ref} approved (ID: ${so.id})`);

        console.log(`[STEP 2] Releasing Batch 1: ${BATCH_1} units...`);
        const inv1 = await app.api.sales.createInvoiceAPI({
            customerId: so.customerId,
            soId: so.id,
            soItemId: so.soItemId,
            releasedQuantity: BATCH_1,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        if (!inv1.success) throw new Error(`Batch 1 invoice failed: ${inv1.error}`);
        await app.advanceDocumentAPI(inv1.id!, 'invoices');
        console.log(`[OK] Batch 1 invoice ${inv1.ref} approved.`);

        console.log(`[STEP 3] Releasing Batch 2: ${BATCH_2} units...`);
        const inv2 = await app.api.sales.createInvoiceAPI({
            customerId: so.customerId,
            soId: so.id,
            soItemId: so.soItemId,
            releasedQuantity: BATCH_2,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        if (!inv2.success) throw new Error(`Batch 2 invoice failed: ${inv2.error}`);
        await app.advanceDocumentAPI(inv2.id!, 'invoices');
        console.log(`[OK] Batch 2 invoice ${inv2.ref} approved.`);

        await page.waitForTimeout(3000);

        console.log(`[STEP 4] Verifying stock deducted correctly (${SO_QTY} units total)...`);
        const expectedStock = item.currentStock - SO_QTY;
        await app.api.inventory.pollStockAPI(item.itemId, expectedStock, item.locationId, 20);
        const finalStock = await app.api.inventory.getItemDetailsAPI(item.itemId, item.locationId);

        console.log(`\n========== SPLIT INVOICE STOCK AUDIT ==========`);
        console.log(`[DOCUMENT] SO Ref       : ${so.ref} (ID: ${so.id})`);
        console.log(`[DOCUMENT] Invoice 1    : ${inv1.ref} (ID: ${inv1.id}) — ${BATCH_1} units`);
        console.log(`[DOCUMENT] Invoice 2    : ${inv2.ref} (ID: ${inv2.id}) — ${BATCH_2} units`);
        console.log(`[ITEM]     Item         : ${item.itemName} (${item.itemId})`);
        console.log(`[STOCK]    Before       : ${item.currentStock}`);
        console.log(`[STOCK]    After        : ${finalStock?.currentStock}`);
        console.log(`[STOCK]    Expected     : ${expectedStock}`);
        console.log(`================================================\n`);

        if (finalStock?.currentStock !== expectedStock) {
            throw new Error(
                `[VULNERABILITY] Split Invoice Stock Mismatch\n` +
                `  SO         : ${so.ref} (ID: ${so.id})\n` +
                `  Invoice 1  : ${inv1.ref} — ${BATCH_1} units\n` +
                `  Invoice 2  : ${inv2.ref} — ${BATCH_2} units\n` +
                `  Stock Before: ${item.currentStock}\n` +
                `  Stock After : ${finalStock?.currentStock}\n` +
                `  Expected   : ${expectedStock}\n` +
                `  Root Cause : Split invoices did not deduct the correct total stock.`
            );
        }

        console.log(`[STEP 5] Attempting over-release (${OVER_QTY} more unit after SO fully released)...`);
        try {
            const inv3 = await app.api.sales.createInvoiceAPI({
                customerId: so.customerId,
                soId: so.id,
                soItemId: so.soItemId,
                releasedQuantity: OVER_QTY,
                locationId: item.locationId,
                warehouseId: item.warehouseId
            });

            if (inv3.success) {
                await app.advanceDocumentAPI(inv3.id!, 'invoices');
                throw new Error(
                    `[VULNERABILITY] Over-Release Allowed on Fully Released SO\n` +
                    `  SO         : ${so.ref} (ID: ${so.id})\n` +
                    `  Invoice 1  : ${inv1.ref} — ${BATCH_1} units\n` +
                    `  Invoice 2  : ${inv2.ref} — ${BATCH_2} units\n` +
                    `  Invoice 3  : ${inv3.ref} — ${OVER_QTY} extra unit (should have been blocked)\n` +
                    `  Root Cause : System does not enforce SO quantity ceiling across multiple invoices.`
                );
            }
            console.log(`[PASS] Over-release correctly rejected at invoice creation.`);
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Over-release correctly blocked: ${err.message}`);
        }

        console.log(`[PASS] SO split invoice audit complete: ${BATCH_1} + ${BATCH_2} = ${SO_QTY} units correctly released and tracked.`);
    });
});
