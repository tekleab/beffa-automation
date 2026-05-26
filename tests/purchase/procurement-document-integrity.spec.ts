import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROCUREMENT DOCUMENT INTEGRITY ATTACKS
 *
 * Scenarios targeting document and PO tampering vulnerabilities:
 * 1. Future-dated bill injection — post-dated AP liability
 * 2. PO quantity exhaustion boundary — bill 100% then +1 unit
 * 3. Duplicate PO submission race — concurrent identical POs
 * 4. Approved bill line item mutation — tamper financial document post-approval
 * 5. Bill with no vendor — orphan AP liability
 */

test.describe('Procurement Document Integrity Attacks @purchase @security @logic @regression @full', () => {

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

    // ── 1. POST-DATED BILL INJECTION ─────────────────────────────────────────
    test('Guardrail: System must reject approval of a future-dated Bill', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 2);
        const futureDateStr = futureDate.toISOString().split('T')[0] + 'T00:00:00Z';

        console.log(`[ATTACK] Injecting Bill with future date: ${futureDateStr}...`);
        try {
            const bill = await app.api.purchase.createBillAPI({
                itemData: item,
                unitPrice: 10000,
                quantity: 1,
                vendorId: meta.vendorId,
                invoice_date: futureDateStr,
                due_date: futureDateStr
            } as any);
            console.log(`[INFO] Future-dated bill created: ${bill.ref} (${bill.id})`);

            await app.advanceDocumentAPI(bill.id, 'bills');
            throw new Error(`[CRITICAL_LOGIC_BUG] System approved a bill dated ${futureDateStr}. Future-period AP liability injection possible — balance sheet manipulation.`);
        } catch (err: any) {
            if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
            console.log(`[PASS] Future-dated bill correctly blocked: ${err.message}`);
        }
    });

    // ── 2. PO QUANTITY EXHAUSTION THEN +1 UNIT ───────────────────────────────
    test('Guardrail: System must block billing beyond 100% of PO quantity', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const poQty = 10;
        console.log(`[STEP 1] Creating PO for exactly ${poQty} units...`);
        const po = await app.api.purchase.createPurchaseOrderAPI(item, poQty, 1000, meta.vendorId);
        await app.advanceDocumentAPI(po.poId, 'purchase-orders');
        console.log(`[PO] ${po.poNumber} (${po.poId})`);

        console.log(`[STEP 2] Billing exactly ${poQty} units (100% of PO) — must succeed...`);
        const bill1 = await app.api.purchase.createBillFromPoAPI(po.poId);
        await app.advanceDocumentAPI(bill1.billId, 'bills');
        console.log(`[BILL 1] ${bill1.billNumber} — 100% of PO consumed`);

        console.log(`[ATTACK] Attempting to bill 1 more unit beyond exhausted PO...`);
        const { apiBase, headers, qs } = await app.buildApiContext();

        const poResp = await page.request.get(`${apiBase}/purchase-order/${po.poId}?${qs}`, { headers });
        const poData = await poResp.json();
        const poItemId = poData.po_items?.[0]?.id;

        const overflowResp = await page.request.post(`${apiBase}/bills?${qs}`, {
            headers,
            data: {
                purchase_order_id: po.poId,
                vendor_id: meta.vendorId,
                accounts_payable_id: sharedMeta.apAccountId,
                currency_id: sharedMeta.currencyId,
                invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
                due_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
                items: [],
                received_purchase_order_items: [{ po_item_id: poItemId, received_quantity: 1, received_unit_price: 1000 }],
                status: 'draft'
            }
        });

        if (overflowResp.ok()) {
            const overflowBill = await overflowResp.json();
            try {
                await app.advanceDocumentAPI(overflowBill.id, 'bills');
                throw new Error(`[CRITICAL_LOGIC_BUG] System approved a bill for 1 unit beyond the fully-exhausted PO ${po.poNumber}. Over-receiving liability created.`);
            } catch (err: any) {
                if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
                console.log(`[PASS] Overflow bill created but approval blocked: ${err.message}`);
            }
        } else {
            console.log(`[PASS] Overflow bill creation rejected at API level: HTTP ${overflowResp.status()}`);
        }
    });

    // ── 3. DUPLICATE PO SUBMISSION RACE ──────────────────────────────────────
    test('Guardrail: Concurrent identical PO submissions must not create duplicate liability', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        console.log(`[ATTACK] Firing 2 identical POs simultaneously...`);
        const [result1, result2] = await Promise.allSettled([
            app.api.purchase.createPurchaseOrderAPI(item, 10, 1000, meta.vendorId),
            app.api.purchase.createPurchaseOrderAPI(item, 10, 1000, meta.vendorId)
        ]);

        const successes = [result1, result2].filter(r => r.status === 'fulfilled') as PromiseFulfilledResult<any>[];
        console.log(`[SNAPSHOT] ${successes.length}/2 POs created`);

        if (successes.length === 2) {
            const po1 = successes[0].value;
            const po2 = successes[1].value;

            await app.advanceDocumentAPI(po1.poId, 'purchase-orders');
            await app.advanceDocumentAPI(po2.poId, 'purchase-orders');

            const bill1 = await app.api.purchase.createBillFromPoAPI(po1.poId);
            const bill2 = await app.api.purchase.createBillFromPoAPI(po2.poId);
            await app.advanceDocumentAPI(bill1.billId, 'bills');
            await app.advanceDocumentAPI(bill2.billId, 'bills');

            const b1Data = await app.api.purchase.getBillAPI(bill1.billId);
            const b2Data = await app.api.purchase.getBillAPI(bill2.billId);
            const totalLiability = parseFloat(b1Data.total ?? b1Data.amount ?? 0) + parseFloat(b2Data.total ?? b2Data.amount ?? 0);

            console.log(`[SNAPSHOT] Total AP liability from duplicate POs: ${totalLiability}`);
            throw new Error(`[CRITICAL_LOGIC_BUG] Duplicate PO race succeeded — both POs approved and billed. Total AP liability doubled to ${totalLiability}. No deduplication guard exists.`);
        }

        console.log(`[PASS] System handled concurrent PO submissions — only ${successes.length} succeeded.`);
    });

    // ── 4. APPROVED BILL LINE ITEM MUTATION ──────────────────────────────────
    test('Guardrail: System must reject mutation of an approved Bill line item', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        console.log(`[STEP 1] Creating & approving Bill for 5 units @ 1000...`);
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 1000, quantity: 5, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[BILL] ${bill.ref} (${bill.id}) — APPROVED`);

        const { apiBase, headers, qs } = await app.buildApiContext();

        const billData = await app.api.purchase.getBillAPI(bill.id);
        const lineItem = billData.items?.[0];
        if (!lineItem) {
            console.log(`[SKIP] No line items found on bill — cannot test mutation.`);
            return;
        }

        console.log(`[ATTACK] Attempting to mutate approved bill line item qty from 5 to 999...`);
        const mutateResp = await page.request.patch(`${apiBase}/bills/${bill.id}?${qs}`, {
            headers,
            data: { items: [{ ...lineItem, quantity: 999, amount: 999 * 1000 }] }
        });

        if (mutateResp.ok()) {
            const mutated = await app.api.purchase.getBillAPI(bill.id);
            const mutatedQty = mutated.items?.[0]?.quantity;
            if (mutatedQty === 999) {
                throw new Error(`[CRITICAL_LOGIC_BUG] Approved bill ${bill.ref} line item mutated from qty=5 to qty=999 via PATCH. Financial document tampered post-approval — audit trail broken.`);
            }
            console.log(`[PASS] PATCH accepted but quantity not mutated (server ignored the change).`);
        } else {
            console.log(`[PASS] Mutation of approved bill correctly rejected: HTTP ${mutateResp.status()}`);
        }
    });

    // ── 5. BILL WITH NO VENDOR ────────────────────────────────────────────────
    test('Guardrail: System must reject Bill creation with no Vendor', async ({ page }) => {
        const app = new AppManager(page);
        const item = sharedItem;

        const { apiBase, headers, qs } = await app.buildApiContext();

        const locResp = await page.request.get(`${apiBase}/locations?page=1&pageSize=5&${qs}`, { headers });
        const locData = await locResp.json();
        const loc = (locData.items || locData.data || [])[0];

        console.log(`[ATTACK] Attempting to create Bill with vendor_id=null...`);
        const noVendorResp = await page.request.post(`${apiBase}/bills?${qs}`, {
            headers,
            data: {
                accounts_payable_id: sharedMeta.apAccountId,
                currency_id: sharedMeta.currencyId,
                invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
                due_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
                vendor_id: null,
                items: [{
                    item_id: item.itemId,
                    quantity: 1,
                    unit_price: 5000,
                    amount: 5000,
                    location_id: loc?.id,
                    warehouse_id: loc?.warehouse_id
                }],
                status: 'draft'
            }
        });

        if (noVendorResp.ok()) {
            const orphanBill = await noVendorResp.json();
            try {
                await app.advanceDocumentAPI(orphanBill.id, 'bills');
                throw new Error(`[CRITICAL_LOGIC_BUG] Bill approved with no vendor! Orphan AP liability created — no counterparty, no audit trail. Bill ID: ${orphanBill.id}`);
            } catch (err: any) {
                if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
                console.log(`[PASS] Vendorless bill created but approval blocked: ${err.message}`);
            }
        } else {
            console.log(`[PASS] Vendorless bill correctly rejected at creation: HTTP ${noVendorResp.status()}`);
        }
    });
});
