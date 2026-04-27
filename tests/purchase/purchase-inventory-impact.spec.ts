import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('Purchase Impact Flow @regression', () => {

    test('Create PO via API, convert to Bill, verify stock addition', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);
        let poID: string | null = null;
        let selectedVendor = "";

        console.log('[STEP] Phase 1: Login & Item Discovery');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const initial = await app.captureRandomItemDataAPI();
        console.log(`[INFO] Item: "${initial.itemName}" | ID: ${initial.itemId} | Stock: ${initial.currentStock}`);

        // Phase 2: Create PO via API
        console.log(`[STEP] Phase 2: Creating PO via API for "${initial.itemName}"`);
        const poData = await app.createPurchaseOrderAPI(initial, 10, 5000);
        const poNumber = poData.poNumber;
        const poUUID = poData.poId;
        console.log(`[OK] PO created: ${poNumber}`);

        // ⚡ Fast API Approval
        await app.advanceDocumentAPI(poUUID, 'purchase-orders');
        console.log(`[OK] PO ${poNumber} approved via Fast-API`);

        // Phase 3: Create Bill from PO via API
        console.log(`[STEP] Phase 3: Converting PO ${poNumber} to Bill via API`);
        const billData = await app.createBillFromPoAPI(poUUID);
        const billNumber = billData.billNumber;
        const billUUID = billData.billId;
        console.log(`[OK] Bill created: ${billNumber}`);

        // ⚡ Fast API Bill Approval
        await app.advanceDocumentAPI(billUUID, 'bills');
        console.log(`[OK] Bill ${billNumber} approved via Fast-API`);

        // Phase 4: Ledger Verification via API
        console.log('[STEP] Phase 4: Ledger verification via API');
        const entries = await app.getBillJournalEntriesAPI(billUUID);
        console.log(`[INFO] Captured ${entries.length} ledger entries via API`);

        if (entries.length > 0) {
            console.log(`[INFO] Sample: ${entries[0].accountName} (${entries[0].accountCode}) — DR: ${entries[0].debit} | CR: ${entries[0].credit}`);
        } else {
            console.log('[WARN] No journal entries found yet. ERP indexing might be delayed.');
        }

        // Phase 5: Stock Verification via API Polling
        console.log(`[STEP] Phase 5: Verifying stock for "${initial.itemName}" via API Polling`);
        const receivedQty = 10; // Hardcoded in createPurchaseOrderAPI call above
        const expectedStock = initial.currentStock + receivedQty;

        const finalStock = await app.pollStockAPI(initial.itemId, expectedStock);
        console.log(`[VERIFY] Item: ${initial.itemName} | Initial: ${initial.currentStock} | Received: ${receivedQty} | Final: ${finalStock} | Expected: ${expectedStock}`);

        expect(finalStock).toBe(expectedStock);
        console.log('[RESULT] Purchase Impact: PASSED');

        await page.close();
    });
});
