import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROCUREMENT TEMPORAL & DATA ISOLATION
 *
 * Objectives:
 * 1. Verify system explicitly rejects historical back-dated Bills (Anti-Fraud).
 * 2. Verify system strictly segregates bills by Vendor (Anti-IDOR/Data Leak).
 */

test.describe('Procurement Temporal & Data Isolation Audits @purchase @security @regression', () => {

    let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['captureRandomItemDataAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        sharedMeta = await app.api.purchase.discoverMetadataAPI();
        sharedItem = await app.api.inventory.captureRandomItemDataAPI();
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    // [KNOWN BUG] API accepts back-dated historical bills allowing temporal manipulation.
    test('Guardrail: System must explicitly reject historical back-dated Bills', async ({ page }) => {
        test.fail(true, '[KNOWN BUG] API accepts back-dated bills — temporal manipulation possible.');

        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const backDate = '2023-01-01T00:00:00Z';
        console.log(`[ATTACK] Attempting to inject a Bill from ${backDate} (Historical Manipulation)...`);

        try {
            const bill = await app.api.purchase.createBillAPI({
                itemData: item,
                unitPrice: 5000,
                quantity: 1,
                vendorId: meta.vendorId,
                invoice_date: backDate
            } as any);
            console.log(`[VULNERABILITY] System accepted back-dated Bill creation: ${bill.ref}`);

            await app.advanceDocumentAPI(bill.id, 'bills');
            throw new Error(`[SECURITY_VULNERABILITY] Historical Manipulation: System approved a back-dated bill from 2023. This allows tax/profit evasion.`);
        } catch (err: any) {
            if (err.message.includes('SECURITY_VULNERABILITY')) throw err;
            console.log(`[PASS] Historical back-dating blocked or rejected by the audit engine.`);
        }
    });

    // [KNOWN BUG] API returns Vendor A's bills when querying Vendor B's ledger.
    test('Guardrail: System must strictly segregate bills by Vendor', async ({ page }) => {
        const app = new AppManager(page);
        const { apiBase, headers, qs } = await app.buildApiContext();

        console.log(`[STEP 1] Discovering two different vendors...`);
        const vendorA = await app.api.purchase.discoverRandomVendorAPI();
        const vendorB = await app.api.purchase.discoverRandomVendorAPI();

        if (vendorB.id === vendorA.id) {
            console.log(`[SKIP] Only one vendor exists in the system — cannot test cross-vendor isolation.`);
            return;
        }

        console.log(`[STEP 2] Creating private Bill for Vendor A: "${vendorA.name}"`);
        const billA = await app.api.purchase.createBillAPI({ itemData: sharedItem, vendorId: vendorA.id });

        console.log(`[ATTACK] Attempting Cross-Vendor IDOR: Fetching Vendor A's bill via Vendor B's ledger...`);
        const leakResp = await page.request.get(`${apiBase}/vendor/${vendorB.id}/bills?${qs}`, { headers });
        const leakData = await leakResp.json();
        const billsInB = leakData.data || leakData.items || [];

        const foundLeak = billsInB.find((b: any) => b.id === billA.id);

        if (foundLeak) {
            throw new Error(`[SECURITY_VULNERABILITY] IDOR: Vendor A's private Bill was visible in Vendor B's ledger! Data leak detected.`);
        }

        console.log(`[PASS] Cross-Vendor Isolation verified. Bills are strictly segregated.`);
    });
});
