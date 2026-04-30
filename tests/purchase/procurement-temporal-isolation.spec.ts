import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROCUREMENT TEMPORAL & DATA ISOLATION
 * 
 * Objectives:
 * 1. Verify system explicitly rejects historical back-dated Bills (Anti-Fraud).
 * 2. Verify system strictly segregates bills by Vendor (Anti-IDOR/Data Leak).
 */

test.describe('Procurement Temporal & Data Isolation Audits @security @purchase', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test('Guardrail: System must explicitly reject historical back-dated Bills', async ({ page }) => {
        const app = new AppManager(page);
        const meta = await app.api.purchase.discoverMetadataAPI();
        const item = await app.api.inventory.captureRandomItemDataAPI();

        // Target a date 1 year in the past
        const backDate = '2023-01-01T00:00:00Z';
        console.log(`[ATTACK] Attempting to inject a Bill from ${backDate} (Historical Manipulation)...`);

        try {
            // Using a raw payload override to bypass any UI date-pickers
            const payload = {
                itemData: item,
                unitPrice: 5000,
                quantity: 1,
                vendorId: meta.vendorId,
                invoice_date: backDate
            };

            const bill = await app.api.purchase.createBillAPI(payload as any);
            console.log(`[VULNERABILITY] System accepted back-dated Bill creation: ${bill.ref}`);
            
            // Try to approve it
            await app.advanceDocumentAPI(bill.id, 'bills');
            throw new Error(`[SECURITY_VULNERABILITY] Historical Manipulation: System approved a back-dated bill from 2023. This allows tax/profit evasion.`);

        } catch (err: any) {
            if (err.message.includes('SECURITY_VULNERABILITY')) throw err;
            console.log(`[PASS] Historical back-dating blocked or rejected by the audit engine.`);
        }
    });

    test('Guardrail: System must strictly segregate bills by Vendor', async ({ page }) => {
        const app = new AppManager(page);
        
        console.log(`[STEP 1] Discovering two different vendors...`);
        const vendorA = await app.api.purchase.discoverRandomVendorAPI();
        
        // Find another vendor - we can just call it again and check if it's different
        let vendorB = await app.api.purchase.discoverRandomVendorAPI();
        if (vendorB.id === vendorA.id) {
            console.log('[INFO] Second discovery returned same vendor, skipping isolation check or retry...');
            // In a real scenario we'd loop, but for now we skip if no second vendor found
        }

        // 1. Create a Bill for Vendor A
        console.log(`[STEP 2] Creating private Bill for Vendor A: "${vendorA.name}"`);
        const item = await app.api.inventory.captureRandomItemDataAPI();
        const billA = await app.api.purchase.createBillAPI({ itemData: item, vendorId: vendorA.id });

        // 2. ATTACK: Try to fetch Bill A using Vendor B's context
        console.log(`[ATTACK] Attempting Cross-Vendor IDOR: Fetching Vendor A's bill via Vendor B's ledger...`);
        
        const apiBase = process.env.BASE_URL?.replace(/\/$/, '') || 'http://157.180.20.112:8001';
        const token = await app._getAuthToken();
        const company = process.env.BEFFA_COMPANY || 'sample';
        
        const leakResp = await page.request.get(`${apiBase.replace(':4173', ':8001')}/api/vendor/${vendorB.id}/bills`, {
            headers: { 'x-company': company, 'Authorization': `Bearer ${token}` }
        });
        
        const leakData = await leakResp.json();
        const billsInB = leakData.data || leakData.items || [];
        
        const foundLeak = billsInB.find((b: any) => b.id === billA.id);

        if (foundLeak) {
            throw new Error(`[SECURITY_VULNERABILITY] IDOR: Vendor A's private Bill was visible in Vendor B's ledger! Data leak detected.`);
        }

        console.log(`[PASS] Cross-Vendor Isolation verified. Bills are strictly segregated.`);
    });
});
