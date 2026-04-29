import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * CATEGORY 2: Concurrency & Race Conditions
 * 
 * This suite simulates high-speed simultaneous multi-user interactions to 
 * verify database atomicity, row-level locking, and thread-safe operations.
 */
test.describe('Concurrency & Race Condition Audits @security @concurrency @sales', () => {

    test.setTimeout(500000);

    /**
     * Resilience Helper: Seeding stock if needed.
     */
    async function ensureStock(app: any, item: any, quantity: number) {
        if (Number(item.currentStock) < quantity) {
            console.log(`[SEED] Low stock (${item.currentStock}). Seeding ${quantity * 2} units via Bill...`);
            const bill = await app.createBillAPI({
                itemData: { ...item },
                quantity: quantity * 2,
                unitPrice: 100
            });
            await app.advanceDocumentAPI(bill.id, 'bills');
        }
    }

    // -------------------------------------------------------------------------
    // TEST 1: Concurrent Dual Receipt Race Condition
    // -------------------------------------------------------------------------
    test('Guardrail: System must handle concurrent duplicate receipts atomically', async ({ page }) => {
        test.setTimeout(400000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        let apiBase = (process.env.BASE_URL || 'http://157.180.20.112:8001').replace(/\/$/, '').replace(':4173', ':8001');
        if (!apiBase.endsWith('/api')) apiBase += '/api';
        const token = await app._getAuthToken();
        const year = process.env.BEFFA_YEAR || '2018';
        const params = `year=${year}&period=yearly&calendar=ec`;
        const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` };

        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.captureRandomItemDataAPI({ minStock: 0 });
        await ensureStock(app, item, 5);

        const acctResp = await page.request.get(`${apiBase}/accounts?page=1&pageSize=200&${params}`, { headers });
        const acctJson = await acctResp.json();
        const allAccs = acctJson.items || acctJson.data || [];
        const cashAcct = allAccs.find((a: any) => a.account_type?.toLowerCase().includes('cash') || a.name?.toLowerCase().includes('cash')) || allAccs[0];
        
        if (!cashAcct) throw new Error("[ERROR] Could not discover a valid Cash Account for receipt testing.");

        const currResp = await page.request.get(`${apiBase}/currency?${params}`, { headers });
        const currJson = await currResp.json();
        const currency = (currJson.items || currJson.data || [])[0];
        if (!currency) throw new Error("[ERROR] Could not discover a valid Currency.");

        const INVOICE_AMOUNT = 1000;
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            unitPrice: INVOICE_AMOUNT,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        const receiptPayload = {
            amount: INVOICE_AMOUNT,
            cash_account_id: cashAcct.id,
            customer_id: meta.customerId,
            date: new Date().toISOString(),
            payment_method: 'cash',
            currency_id: currency.id,
            invoice_receipts: [{ amount: INVOICE_AMOUNT, invoice_id: inv.id }]
        };

        console.log(`[ATTACK] Firing 2 concurrent receipt API calls for ${INVOICE_AMOUNT} each...`);
        const [resp1, resp2] = await Promise.all([
            page.request.post(`${apiBase}/receipts?${params}`, { data: receiptPayload, headers }),
            page.request.post(`${apiBase}/receipts?${params}`, { data: receiptPayload, headers })
        ]);

        const created: { id: string; ref: string }[] = [];
        for (const resp of [resp1, resp2]) { if (resp.ok()) { const body = await resp.json(); created.push({ id: body.id, ref: body.ref }); } }

        if (created.length === 2) {
            console.log('[ESCALATION] Both receipts created. Attempting to approve both...');
            const approvalResults = await Promise.allSettled(created.map(r => app.advanceDocumentAPI(r.id, 'receipts')));
            let approvedCount = 0;
            for (const result of approvalResults) { if (result.status === 'fulfilled') approvedCount++; }

            await page.waitForTimeout(5000);
            const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
            if (approvedCount === 2 && Number(finalInv.unreceived_amount) < 0) {
                throw new Error(`[CRITICAL_RACE_CONDITION_BUG] Both concurrent receipts approved. AR over-credited: ${finalInv.unreceived_amount}`);
            } else {
                console.log(`[PASS] At least one approval layer blocked the duplication. Approved: ${approvedCount}`);
            }
        } else {
            if (resp1.status() === 500 || resp2.status() === 500) console.log(`[SECONDARY_BUG] Backend crashed with 500 on concurrency check.`);
            console.log('[PASS] Concurrent receipt duplication handled at API layer.');
        }
    });

    // -------------------------------------------------------------------------
    // TEST 2: Negative Stock Race Condition
    // -------------------------------------------------------------------------
    test('Guardrail: System must enforce thread-safe serialization for stock reduction limits', async ({ page, request }) => {
        test.setTimeout(180000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        
        const meta = await app.api.sales.discoverMetadataAPI();
        const seedItem = await app.api.inventory.captureRandomItemDataAPI({ minStock: 0 });
        
        const bill = await app.createBillAPI({
            itemData: { ...seedItem, locationId: seedItem.locationId, warehouseId: seedItem.warehouseId },
            quantity: 5,
            unitPrice: 1500
        }); 
        await app.advanceDocumentAPI(bill.id, 'bills');

        let apiBase = (process.env.BASE_URL || 'http://157.180.20.112:8001').replace(/\/$/, '').replace(':4173', ':8001');
        if (!apiBase.endsWith('/api')) apiBase += '/api';
        const token = await app._getAuthToken();
        const params = `year=2018&period=yearly&calendar=ec`;
        const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` };

        const buildRacePayload = () => ({
            accounts_receivable_id: meta.arAccountId,
            customer_id: meta.customerId,
            invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
            currency_id: meta.currencyId,
            items: [{
                amount: 3000,
                general_ledger_account_id: meta.salesAccountId,
                item_id: seedItem.itemId,
                location_id: seedItem.locationId,
                quantity: 1, 
                unit_price: 3000,
                warehouse_id: seedItem.warehouseId,
            }],
            released_sales_order_items: [],
            status: 'draft'
        });

        console.log('[ATTACK] Firing 2 concurrent Invoicing requests for the same single unit...');
        const [resp1, resp2] = await Promise.all([
            request.post(`${apiBase}/invoices?${params}`, { data: buildRacePayload(), headers }),
            request.post(`${apiBase}/invoices?${params}`, { data: buildRacePayload(), headers })
        ]);

        if ([200, 201].includes(resp1.status()) && [200, 201].includes(resp2.status())) {
            const body1 = await resp1.json();
            const body2 = await resp2.json();
            try {
                await app.advanceDocumentAPI(body1.id, 'invoices');
                await app.advanceDocumentAPI(body2.id, 'invoices');
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
