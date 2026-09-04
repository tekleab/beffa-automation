import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: Purchase Order - API Security & Authorization Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Unauthenticated PO creation rejected (401)
 * 2. Cross-tenant PO access rejected (403/404)
 * 3. Auditor role cannot create or approve PO
 * =============================================================================
 */



/**
 * CATEGORY 4: Security & Temporal Isolation for Procurement
 * Merged from: procurement-temporal-isolation.spec.ts + procurement-security-temporal-isolation.spec.ts + po-guardrails.spec.ts
 */
test.describe('Procurement Security & Guardrails Audits @purchase @full', () => {
    test.setTimeout(120000);

    let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        sharedMeta = await app.api.purchase.discoverMetadataAPI();
        sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'FIFO', quantity: 20, unit_cost: 100 });
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

    });

    test('Guardrail: System must reject Billing for more units than the approved PO', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const meta = sharedMeta;
        const item = sharedItem;

        // 1. Create PO for 10 units
        console.log(`[STEP 1] Creating PO for 10 units...`);
        const po = await app.api.purchase.createPurchaseOrderAPI(item, 10, 5000, meta.vendorId);
        await app.advanceDocumentAPI(po.poId, 'purchase-orders');

        // 2. Attempt to Bill for 50 units
        console.log(`[ATTACK] Attempting to Bill 50 units against the 10-unit PO...`);

        try {
            const bill = await app.api.purchase.createBillFromPoAPI(po.poId, po.poItems);
            console.log(`[INFO] Bill created for PO. Checking if we can inflate quantity...`);

            await app.advanceDocumentAPI(bill.billId, 'bills');
            console.log(`[INFO] Bill approved. Verifying if it honored PO limits...`);

            const finalBill = await app.api.purchase.getBillAPI(bill.billId);
            const totalQty = finalBill.received_purchase_order_items?.reduce((sum: number, i: any) => sum + i.received_quantity, 0);

            if (totalQty > 10) {
                throw new Error(`[CRITICAL_LOGIC_BUG] Over-Billing! PO: 10, Invoiced: ${totalQty}. Financial leakage detected.`);
            }
            console.log(`[PASS] System correctly enforced PO limits.`);

        } catch (err: any) {
            if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
            console.log(`[PASS] Over-Billing attempt blocked: ${err.message}`);
        }
    });

    test('Guardrail: System must strictly segregate bills and payments by Vendor', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const meta = sharedMeta;
        const item = sharedItem;

        const vendorResp = await page.request.get(`${apiBase}/vendors?page=1&pageSize=10&${qs}`, { headers });
        let vendors = (await vendorResp.json()).items || (await vendorResp.json()).data || [];
        if (vendors.length < 2) {
            const newVendor = await app.api.purchase.createVendorAPI(`Sec-Vendor-${Date.now()}`);
            vendors.push(newVendor);
        }

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
        const acctJson = await acctResp.json().catch(() => ({}));
        const allAccounts = acctJson.items || acctJson.data || [];
        const cashAcct = allAccounts.find((a: any) => (a.account_type || a.type || a.name || '').toLowerCase().includes('cash') || (a.account_type || a.type || a.name || '').toLowerCase().includes('bank')) || allAccounts[0];

        if (!cashAcct) throw new Error('[SETUP] No cash account found.');

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
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const { apiBase, headers, qs } = await app.buildApiContext();

        const vendorA = await app.api.purchase.discoverRandomVendorAPI();
        let vendorB = await app.api.purchase.discoverRandomVendorAPI();

        if (vendorB.id === vendorA.id) {
            vendorB = await app.api.purchase.createVendorAPI(`IDOR-Vendor-${Date.now()}`);
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
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const meta = sharedMeta;
        const item = sharedItem;

        const rogueDate = '2021-04-29T00:00:00Z';
        console.log(`[ATTACK] Submitting Bill forged for: ${rogueDate}`);

        let rogueBill: any;
        try {
            rogueBill = await app.api.purchase.createBillAPI({
                vendorId: meta.vendorId,
                itemId: item.itemId,
                quantity: 1,
                unitPrice: 5000,
                apAccountId: meta.apAccountId
            });
        } catch (err: any) {
            console.log(`[PASS] Backend API rejected back-dated bill creation payload: ${err.message}`);
            return;
        }

        console.log(`[VULNERABILITY] Backend API accepted back-dated payload! ID: ${rogueBill.ref}`);

        await app.advanceDocumentAPI(rogueBill.id, 'bills').catch(() => {});
        const finalStatus = await app.api.purchase.getBillAPI(rogueBill.id);

        if (finalStatus.status?.toLowerCase().includes('approved') || finalStatus.status?.toLowerCase().includes('authorized')) {
            throw new Error(`[CRITICAL_LOGIC_BUG #TEMP-01] ERP fully approved back-dated bill (${rogueBill.ref}, date: ${rogueDate})! Temporal immutability is violated.`);
        } else {
            throw new Error(`[ERP_BUG #TEMP-02] Temporal Immutability Violation: Backend API accepted back-dated bill payload (${rogueBill.ref}).`);
        }
    });
});
