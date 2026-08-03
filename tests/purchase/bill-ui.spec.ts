import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('Purchase to Bill Flow @purchase @smoke @full', () => {

    test('Create PO via API, approve, create linked bill, verify in vendor profile', async ({ page }) => {
        test.setTimeout(60000);
        const app = new AppManager(page);

        // API-only login — no page load needed, just token injection
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log('[STEP] Phase 1: Create PO via API');
        const meta = await app.discoverMetadataAPI();
        const item = await app.captureRandomItemDataAPI();
        const { poNumber, poId } = await app.createPurchaseOrderAPI(item, 5, item.unitPrice || 1000);
        console.log(`[OK] PO created: ${poNumber}`);

        await app.advanceDocumentAPI(poId, 'purchase-orders');
        console.log(`[OK] PO ${poNumber} approved`);

        console.log('[STEP] Phase 2: Create linked Bill via API');
        const { billNumber, billId } = await app.createBillFromPoAPI(poId);
        await app.advanceDocumentAPI(billId, 'bills');
        console.log(`[OK] Bill ${billNumber} approved`);

        console.log('[STEP] Phase 3: Verify Bill in vendor profile via API');
        const vendor = await app.discoverRandomVendorAPI();
        await app.verifyBillInVendorAPI(vendor.name, billNumber);
        console.log(`[RESULT] PASSED — PO ${poNumber} → Bill ${billNumber} verified in vendor ${vendor.name}`);
    });
});
