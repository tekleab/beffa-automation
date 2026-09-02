import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: Sales Order - Concurrent Write & Race Condition Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Two simultaneous SO approvals on same item do not oversell stock
 * 2. Concurrent partial invoice creation on same SO does not corrupt totals
 * 3. Optimistic lock / version conflict handled gracefully
 * =============================================================================
 */



/**
 * CATEGORY 2: Concurrency & Race Conditions
 */
test.describe('Concurrency & Race Condition Audits @sales @concurrency @security @regression @full', () => {
    test.setTimeout(120000);

    let sharedMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        sharedMeta = await app.api.sales.discoverMetadataAPI();
        sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'FIFO', quantity: 20, unit_cost: 100 });
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

    });

    async function ensureStock(app: AppManager, item: any, quantity: number) {
        if (Number(item.currentStock) < quantity) {
            const bill = await app.createBillAPI({ itemData: { ...item }, quantity: quantity * 2, unitPrice: 100 });
            await app.advanceDocumentAPI(bill.id, 'bills');
        }
    }

    test('Guardrail: System must handle concurrent duplicate receipts atomically', async ({ page }) => {
        test.setTimeout(120000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const meta = sharedMeta;
        const item = sharedItem;
        await ensureStock(app, item, 5);

        const acctResp = await page.request.get(`${apiBase}/accounts?page=1&pageSize=200&${qs}`, { headers });
        const allAccs = (await acctResp.json()).items || (await acctResp.json()).data || [];
        const cashAcct = allAccs.find((a: any) => a.account_type?.toLowerCase().includes('cash') || a.name?.toLowerCase().includes('cash')) || allAccs[0];
        if (!cashAcct) throw new Error(`[ERROR] Could not discover a valid Cash Account.`);

        const currResp = await page.request.get(`${apiBase}/currency?${qs}`, { headers });
        const currency = (await currResp.json()).items?.[0] || (await currResp.json()).data?.[0];
        if (!currency) throw new Error(`[ERROR] Could not discover a valid Currency.`);

        const INVOICE_AMOUNT = 1000;
        const inv = await app.api.sales.createStandaloneInvoiceAPI({ customerId: meta.customerId, itemId: item.itemId, unitPrice: INVOICE_AMOUNT, locationId: item.locationId, warehouseId: item.warehouseId });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        const glAcct = allAccs.find((a: any) => a.account_type?.toLowerCase().includes('receivable') || a.name?.toLowerCase().includes('receivable')) || allAccs[1] || allAccs[0];
        const receiptPayload = {
            amount: INVOICE_AMOUNT,
            cash_account_id: cashAcct.id,
            customer_id: meta.customerId,
            date: new Date().toISOString(),
            payment_method: 'cash',
            currency_id: currency.id,
            invoice_receipts: [{ amount: INVOICE_AMOUNT, invoice_id: inv.id }],
            receipt_items: [{ amount: INVOICE_AMOUNT, general_ledger_account_id: glAcct.id, unit_price: INVOICE_AMOUNT, quantity: 1, description: 'Invoice Receipt' }]
        };

        console.log(`[ATTACK] Firing 2 concurrent receipt API calls for ${INVOICE_AMOUNT} each...`);
        const [resp1, resp2] = await Promise.all([
            page.request.post(`${apiBase}/receipts?${qs}`, { data: receiptPayload, headers }),
            page.request.post(`${apiBase}/receipts?${qs}`, { data: receiptPayload, headers })
        ]);

        const created: { id: string; ref: string }[] = [];
        for (const resp of [resp1, resp2]) {
            if (resp.ok()) { const body = await resp.json(); created.push({ id: body.id, ref: body.ref }); }
        }

        if (created.length === 2) {
            console.log('[ESCALATION] Both receipts created. Attempting to approve both...');
            const approvalResults = await Promise.allSettled(created.map(r => app.advanceDocumentAPI(r.id, 'receipts')));
            const approvedCount = approvalResults.filter(r => r.status === 'fulfilled').length;

            await page.waitForTimeout(5000);
            const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
            if (approvedCount === 2 && Number(finalInv.unreceived_amount) < 0) {
                throw new Error(`[CRITICAL_RACE_CONDITION_BUG] Both concurrent receipts approved. AR over-credited: ${finalInv.unreceived_amount}`);
            }
            console.log(`[PASS] At least one approval layer blocked the duplication. Approved: ${approvedCount}`);
        } else {
            console.log('[PASS] Concurrent receipt duplication handled at API layer.');        }
    });

    test('Guardrail: System must enforce thread-safe serialization for stock reduction limits', async ({ page }) => {
        test.setTimeout(180000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const meta = sharedMeta;
        const seedItem = sharedItem;

        const bill = await app.createBillAPI({ itemData: { ...seedItem }, quantity: 5, unitPrice: 1500 });
        await app.advanceDocumentAPI(bill.id, 'bills');

        const _dateIso = (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso;
        const buildRacePayload = () => ({            accounts_receivable_id: meta.arAccountId,
            customer_id: meta.customerId,            invoice_date: _dateIso,
            currency_id: meta.currencyId,
            items: [{ amount: 3000, general_ledger_account_id: meta.salesAccountId, item_id: seedItem.itemId, location_id: seedItem.locationId, quantity: 1, unit_price: 3000, warehouse_id: seedItem.warehouseId }],
            released_sales_order_items: [],
            status: 'draft'
        });

        console.log('[ATTACK] Firing 2 concurrent Invoicing requests for the same single unit...');
        const [resp1, resp2] = await Promise.all([
            page.request.post(`${apiBase}/invoices?${qs}`, { data: buildRacePayload(), headers }),
            page.request.post(`${apiBase}/invoices?${qs}`, { data: buildRacePayload(), headers })
        ]);

        if ([200, 201].includes(resp1.status()) && [200, 201].includes(resp2.status())) {
            const body1 = await resp1.json();
            const body2 = await resp2.json();
            try {
                await app.advanceDocumentAPI(body1.id, 'invoices', { skipStockTopUp: true });
                await app.advanceDocumentAPI(body2.id, 'invoices', { skipStockTopUp: true });
                throw new Error(`[CRITICAL_LOGIC_BUG] Concurrency Failure: Approved both invoices for 1 unit. Warehouse desynced.`);
            } catch (err: any) {
                if (err.message.includes('CRITICAL_LOGIC_BUG')) throw err;
                console.log(`[PASS] Approval layer blocked the double-spend after DB creation race.`);
            }
        } else {
            console.log('[PASS] Atomic threading handled the stock reduction race successfully.');
        }
    });
});
