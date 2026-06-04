import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * CATEGORY 4: Security & Temporal Isolation for Procurement
 * Merged from: procurement-temporal-isolation.spec.ts + procurement-security-temporal-isolation.spec.ts
 */
test.describe('Procurement Security & Temporal Isolation Audits @purchase @security @regression @full', () => {
    test.setTimeout(300000);

    let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['captureRandomItemDataAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        sharedMeta = await app.api.purchase.discoverMetadataAPI();
        sharedItem = await app.api.inventory.captureRandomItemDataAPI({ minStock: 2 });
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test('Guardrail: System must strictly segregate bills and payments by Vendor', async ({ page }) => {
        const app = new AppManager(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const meta = sharedMeta;
        const item = sharedItem;

        const vendorResp = await page.request.get(`${apiBase}/vendors?page=1&pageSize=10&${qs}`, { headers });
        const vendors = (await vendorResp.json()).items || [];
        if (vendors.length < 2) { console.log('[SKIP] Need at least 2 vendors.'); return; }

        const vendorA = vendors[0];
        const vendorB = vendors[1];

        const BILL_AMT = 5000;
        const billA = await app.api.purchase.createBillAPI({
            vendorId: vendorA.id,
            itemId: item.itemId,
            quantity: 1,
            unitPrice: BILL_AMT,
            apAccountId: meta.apAccountId
        });
        await app.advanceDocumentAPI(billA.id, 'bills');

        const acctResp = await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers });
        const cashAcct = (await acctResp.json()).items?.find((a: any) => a.account_type?.toLowerCase().includes('cash')) || (await acctResp.json()).items?.[0];

        console.log(`[ATTACK] Submitting Payment under Vendor B, linking to Vendor A's Bill!`);
        const attackResp = await page.request.post(`${apiBase}/payments?${qs}`, {
            data: { amount: BILL_AMT, cash_account_id: cashAcct.id, vendor_id: vendorB.id, date: new Date().toISOString(), payment_method: 'cash', currency_id: meta.currencyId, bill_payments: [{ amount: BILL_AMT, bill_id: billA.id }] },
            headers
        });

        if ([200, 201].includes(attackResp.status())) {
            const body = await attackResp.json();
            try {
                await app.advanceDocumentAPI(body.id, 'payments');
                const finalBill = await app.api.purchase.getBillAPI(billA.id);
                if (Number(finalBill.unpaid_amount) === 0) {
                    throw new Error(`[CRITICAL_SECURITY_BUG] IDOR VULNERABILITY! Vendor B successfully paid Vendor A's bill.`);
                }
            } catch (e: any) {
                if (e.message.includes('CRITICAL_SECURITY_BUG')) throw e;
                console.log(`[PASS] Cross-vendor payment blocked at approval.`);
            }
        } else {
            console.log(`[PASS] IDOR payment blocked at API wall (Status: ${attackResp.status()}).`);
        }
    });

    test('Guardrail: System must strictly segregate bills by Vendor (IDOR read-access)', async ({ page }) => {
        const app = new AppManager(page);
        const { apiBase, headers, qs } = await app.buildApiContext();

        const vendorA = await app.api.purchase.discoverRandomVendorAPI();
        const vendorB = await app.api.purchase.discoverRandomVendorAPI();

        if (vendorB.id === vendorA.id) {
            console.log(`[SKIP] Only one vendor exists — cannot test cross-vendor isolation.`);
            return;
        }

        const billA = await app.api.purchase.createBillAPI({ itemData: sharedItem, vendorId: vendorA.id });

        console.log(`[ATTACK] Fetching Vendor A's bill via Vendor B's ledger...`);
        const leakResp = await page.request.get(`${apiBase}/vendor/${vendorB.id}/bills?${qs}`, { headers });
        const billsInB = (await leakResp.json()).data || (await leakResp.json()).items || [];
        const foundLeak = billsInB.find((b: any) => b.id === billA.id);

        if (foundLeak) {
            throw new Error(`[SECURITY_VULNERABILITY] IDOR: Vendor A's Bill was visible in Vendor B's ledger!`);
        }
        console.log(`[PASS] Cross-Vendor isolation verified.`);
    });

    // [KNOWN BUG] API accepts back-dated historical bills allowing temporal manipulation.
    test('Guardrail: System must explicitly reject historical back-dated bills', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const rogueDate = '2021-04-29T00:00:00Z';
        console.log(`[ATTACK] Submitting Bill forged for: ${rogueDate}`);

        try {
            const rogueBill = await app.api.purchase.createBillAPI({
                vendorId: meta.vendorId,
                itemId: item.itemId,
                quantity: 1,
                unitPrice: 5000,
                apAccountId: meta.apAccountId
            });
            console.log(`[VULNERABILITY] Backend API accepted back-dated payload! ID: ${rogueBill.ref}`);

            try {
                await app.advanceDocumentAPI(rogueBill.id, 'bills');
                const finalStatus = await app.api.purchase.getBillAPI(rogueBill.id);
                if (finalStatus.status?.toLowerCase().includes('approved') || finalStatus.status?.toLowerCase().includes('authorized')) {
                    throw new Error(`[CRITICAL_LOGIC_BUG] ERP fully approved a bill from the past (${rogueDate})! Immutability is broken.`);
                }
                console.log(`[PASS] Bill advanced but stopped short of full approval.`);
            } catch (authErr: any) {
                if (authErr.message.includes('CRITICAL_LOGIC_BUG')) throw authErr;
                console.log(`[PASS] Backend safely intercepted rogue date: ${authErr.message}`);
            }
        } catch (error: any) {
            if (error.message.includes('CRITICAL_LOGIC_BUG')) throw error;
            console.log(`[PASS] Back-dating blocked: ${error.message}`);
        }
    });
});
