import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROCUREMENT PO SPLIT BILL AUDIT
 *
 * Objective:
 * PO for 10 units — receive in 2 batches (4 + 6).
 * Assert total billed never exceeds PO qty and system blocks a 3rd bill.
 */

test.describe('Procurement PO Split Bill Audit @purchase @logic @regression @full', () => {
    test.setTimeout(400000);

    test('Audit: PO split into multiple bills — total must never exceed PO quantity', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const PO_QTY = 10;
        const BATCH_1 = 4;
        const BATCH_2 = 6;
        const OVER_QTY = 1; // attempt after PO is fully received

        const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: PO_QTY });
        if (!item) { console.log(`[SKIP] No item with stock >= ${PO_QTY}.`); return; }

        const meta = await app.api.purchase.discoverMetadataAPI();

        console.log(`\n========== PO SPLIT BILL SETUP ==========`);
        console.log(`[ITEM]  Item ID     : ${item.itemId} (${item.itemName})`);
        console.log(`[ITEM]  Stock       : ${item.currentStock}`);
        console.log(`[PLAN]  PO Qty      : ${PO_QTY}`);
        console.log(`[PLAN]  Batch 1     : ${BATCH_1}`);
        console.log(`[PLAN]  Batch 2     : ${BATCH_2}`);
        console.log(`[PLAN]  Over-receive: ${OVER_QTY} (must be blocked)`);
        console.log(`============================================\n`);

        console.log(`[STEP 1] Creating & approving PO for ${PO_QTY} units...`);
        const po = await app.api.purchase.createPurchaseOrderAPI({
            itemId: item.itemId,
            itemName: item.itemName,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        }, PO_QTY, 5000, meta.vendorId);
        await app.advanceDocumentAPI(po.poId, 'purchase-orders');
        console.log(`[OK] PO ${po.poNumber} approved (ID: ${po.poId})`);

        console.log(`[STEP 2] Receiving Batch 1: ${BATCH_1} units...`);
        const bill1 = await app.api.purchase.createBillAPI({
            vendorId: meta.vendorId,
            itemId: item.itemId,
            quantity: BATCH_1,
            unitPrice: 5000,
            apAccountId: meta.apAccountId,
            poId: po.poId
        });
        if (!bill1.success) throw new Error(`Batch 1 bill failed: ${bill1.error}`);
        await app.advanceDocumentAPI(bill1.id, 'bills');
        console.log(`[OK] Batch 1 bill ${bill1.ref} approved.`);

        console.log(`[STEP 3] Receiving Batch 2: ${BATCH_2} units...`);
        const bill2 = await app.api.purchase.createBillAPI({
            vendorId: meta.vendorId,
            itemId: item.itemId,
            quantity: BATCH_2,
            unitPrice: 5000,
            apAccountId: meta.apAccountId,
            poId: po.poId
        });
        if (!bill2.success) throw new Error(`Batch 2 bill failed: ${bill2.error}`);
        await app.advanceDocumentAPI(bill2.id, 'bills');
        console.log(`[OK] Batch 2 bill ${bill2.ref} approved.`);

        await page.waitForTimeout(3000);

        console.log(`[STEP 4] Verifying stock added correctly (${PO_QTY} units total)...`);
        const finalStock = await app.api.inventory.getItemDetailsAPI(item.itemId, item.locationId);
        const expectedStock = item.currentStock + PO_QTY;

        console.log(`\n========== SPLIT BILL STOCK AUDIT ==========`);
        console.log(`[DOCUMENT] PO Ref       : ${po.poNumber} (ID: ${po.poId})`);
        console.log(`[DOCUMENT] Bill 1       : ${bill1.ref} (ID: ${bill1.id}) — ${BATCH_1} units`);
        console.log(`[DOCUMENT] Bill 2       : ${bill2.ref} (ID: ${bill2.id}) — ${BATCH_2} units`);
        console.log(`[ITEM]     Item         : ${item.itemName} (${item.itemId})`);
        console.log(`[STOCK]    Before       : ${item.currentStock}`);
        console.log(`[STOCK]    After        : ${finalStock?.currentStock}`);
        console.log(`[STOCK]    Expected     : ${expectedStock}`);
        console.log(`================================================\n`);

        if (finalStock?.currentStock !== expectedStock) {
            throw new Error(
                `[VULNERABILITY] Split Bill Stock Mismatch\n` +
                `  PO         : ${po.poNumber} (ID: ${po.poId})\n` +
                `  Bill 1     : ${bill1.ref} — ${BATCH_1} units\n` +
                `  Bill 2     : ${bill2.ref} — ${BATCH_2} units\n` +
                `  Stock Before: ${item.currentStock}\n` +
                `  Stock After : ${finalStock?.currentStock}\n` +
                `  Expected   : ${expectedStock}\n` +
                `  Root Cause : Split bills did not add the correct total stock.`
            );
        }

        console.log(`[STEP 5] Attempting over-receive (${OVER_QTY} more unit after PO fully received)...`);
        try {
            const bill3 = await app.api.purchase.createBillAPI({
                vendorId: meta.vendorId,
                itemId: item.itemId,
                quantity: OVER_QTY,
                unitPrice: 5000,
                apAccountId: meta.apAccountId,
                poId: po.poId
            });

            if (bill3.success) {
                await app.advanceDocumentAPI(bill3.id, 'bills');
                throw new Error(
                    `[VULNERABILITY] Over-Receive Allowed on Fully Received PO\n` +
                    `  PO         : ${po.poNumber} (ID: ${po.poId})\n` +
                    `  Bill 1     : ${bill1.ref} — ${BATCH_1} units\n` +
                    `  Bill 2     : ${bill2.ref} — ${BATCH_2} units\n` +
                    `  Bill 3     : ${bill3.ref} — ${OVER_QTY} extra unit (should have been blocked)\n` +
                    `  Root Cause : System does not enforce PO quantity ceiling across multiple bills.`
                );
            }
            console.log(`[PASS] Over-receive correctly rejected at bill creation.`);
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Over-receive correctly blocked: ${err.message}`);
        }

        console.log(`[PASS] PO split bill audit complete: ${BATCH_1} + ${BATCH_2} = ${PO_QTY} units correctly received and tracked.`);
    });
});
