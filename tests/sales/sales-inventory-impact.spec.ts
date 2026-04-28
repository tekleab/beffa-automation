import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('Sales Impact Flow @regression', () => {

    test('Inventory Impact Verify @smoke', async ({ page }) => {
        test.info().annotations.push({ type: 'allure.severity', description: 'critical' });
        test.setTimeout(600000);
        const app = new AppManager(page);

        // Phase 1: Login & Item Discovery
        console.log('[STEP] Phase 1: Login & Item Discovery');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const initial = await app.captureRandomItemDataAPI();
        console.log(`[INFO] Item: "${initial.itemName}" | UUID: ${initial.itemId} | Stock: ${initial.currentStock}`);

        // Phase 2: Create Sales Order via API
        // Phase 2: Create Sales Order via API
        const saleQty = Math.floor(Math.random() * 2) + 1;
        console.log(`[STEP] Phase 2: Creating SO via API for ${saleQty} x "${initial.itemName}"`);

        const soResult = await app.createSalesOrderAPI({
            itemId: initial.itemId,
            quantity: saleQty,
            locationId: initial.locationId,
            warehouseId: initial.warehouseId
        });

        if (!soResult.success) {
            if (soResult.status === 422 && soResult.error?.toLowerCase().includes('insufficient stock')) {
                console.log(`[PASS] Valid Validation: System correctly blocked order due to insufficient stock for ${initial.itemName}`);
                return; // Mark as passed per user requirement
            }
            throw new Error(`SO API Creation Failed: ${soResult.status} - ${soResult.error}`);
        }

        const soID = soResult.ref;
        const soItemId = soResult.soItemId;
        console.log(`[OK] SO created: ${soID} | Customer: ${soResult.customerId}`);

        // Phase 3: Approve SO
        console.log(`[STEP] Phase 3: Approving SO ${soID}`);
        // ⚡ Fast API Approval
        await page.goto(`/receivables/sale-orders/${soResult.id}/detail`, { waitUntil: 'load' });
        await app.advanceDocumentAPI(soResult.id, 'sales-orders');
        await page.reload(); // 🔄 Synchronize
        console.log(`[OK] SO ${soID} approved via Fast-API`);

        // Phase 4: Create Invoice via API
        console.log(`[STEP] Phase 4: Creating Invoice via API from SO ${soID}`);
        const invResult = await app.createInvoiceAPI({
            customerId: soResult.customerId,
            soItemId: soItemId, // Use SO Item ID for linking
            releasedQuantity: saleQty,
            locationId: initial.locationId,
            warehouseId: initial.warehouseId
        });

        if (!invResult.success) {
            throw new Error(`Invoice Creation Failed: ${invResult.error}`);
        }

        const invID = invResult.ref;
        const invUUID = invResult.id;
        console.log(`[OK] Invoice created: ${invID} (UUID: ${invUUID})`);

        // Phase 5: Approve Invoice
        console.log(`[STEP] Phase 5: Approving Invoice ${invID}`);
        // ⚡ Fast API Approval
        await page.goto(`/receivables/invoices/${invUUID}/detail`, { waitUntil: 'load' });
        await app.advanceDocumentAPI(invUUID, 'invoices');
        await page.reload(); // 🔄 Synchronize
        console.log(`[OK] Invoice ${invID} approved via Fast-API`);

        // Phase 6: Verify stock decrease via API (with Tactical Polling)
        console.log(`[STEP] Phase 6: Verifying stock for "${initial.itemName}" (Polling for backend sync)`);
        const expectedStock = initial.currentStock - saleQty;
        let final: any = null;
        let success = false;

        for (let attempt = 0; attempt < 3; attempt++) {
            final = await app.getItemDetailsAPI(initial.itemId, initial.locationId);
            const currentStock = final?.currentStock ?? 'NULL';
            console.log(`[POLL] Attempt ${attempt + 1}: Found ${currentStock} at location ${initial.locationId} | Expected ${expectedStock}`);
            
            if (final && final.currentStock === expectedStock) {
                success = true;
                break;
            }
            await page.waitForTimeout(5000); // 5s tactical wait for ERP invoice processing
        }

        if (!success) {
            throw new Error(`Stock deduction failed after polling! Expected ${expectedStock}, found ${final?.currentStock ?? 'NULL'}`);
        }
        console.log(`[RESULT] Sales Impact: PASSED - Stock correctly decreased from ${initial.currentStock} to ${final?.currentStock}`);

        await page.close();
    });
});
