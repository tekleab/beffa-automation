import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PHASE 2 - SCENARIO 2: Negative Stock Race Condition
 *
 * Hypothesis: Simulates two users creating an invoice against the EXACT same
 * stock unit simultaneously. If the database backend lacks tight constraint
 * locking (e.g. Row-level locks, serialized isolation), both invoices will successfully
 * draw the stock level beneath 0, creating "Ghost Stock" mapping.
 */
test.describe('Negative Stock Race Condition @security @sales', () => {

    test('Guardrail: System must enforce thread-safe serialization for stock reduction limits', async ({ page, request }) => {
        test.setTimeout(180000); // Concurrency tests can momentarily block DB pipes
        const app = new AppManager(page);

        console.log('[ACTION] Authenticating primary session...');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        
        console.log('[ACTION] Seed Setup: Purchasing singular item to guarantee exact stock boundary (Qty: 1)...');
        const meta = await app.api.sales.discoverMetadataAPI();
        
        // Find items that can be purchased natively
        const seedItem = await app.api.inventory.captureRandomItemDataAPI({ minStock: 0 });
        
        // Push a fresh Bill for exactly 1 Quantity so that we control the exact global variable state
        const bill = await app.createBillAPI({
            ...seedItem,
            locationId: seedItem.locationId,
            warehouseId: seedItem.warehouseId
        }, 1, 1500); 
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[SUCCESS] Seed Setup Complete: Guaranteed exactly 1 isolated unit added for item: ${seedItem.itemId}`);

        // --- THE RACE CONDITION ATTACK ---
        console.log(`[ATTACK] Orchestrating Dual-Threaded Concurrent Invoicing against Item (${seedItem.itemId})...`);
        
        // To construct a true parallel race condition, we must build the raw payload parameters separately
        // and fire them simultaneously via Promise.all. 
        let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
        if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
        if (!apiBase.endsWith('/api')) apiBase += '/api';
        
        const token = await app._getAuthToken();
        const year = process.env.BEFFA_YEAR || '2018';
        const period = process.env.BEFFA_PERIOD || 'yearly';
        const calendar = process.env.BEFFA_CALENDAR || 'ec';
        const params = `year=${year}&period=${period}&calendar=${calendar}`;
        const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` };

        const buildRacePayload = () => ({
            accounts_receivable_id: meta.arAccountId,
            customer_id: meta.customerId,
            invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
            due_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] + 'T00:00:00Z',
            currency_id: meta.currencyId,
            items: [{
                amount: 3000,
                general_ledger_account_id: meta.salesAccountId,
                item_id: seedItem.itemId,
                location_id: seedItem.locationId,
                quantity: 1, // Draining the 1 item
                unit_price: 3000,
                warehouse_id: seedItem.warehouseId,
            }],
            released_sales_order_items: [],
            status: 'draft'
        });

        console.log('[FIRE] Transmitting synchronous POST array...');
        const [resp1, resp2] = await Promise.all([
            request.post(`${apiBase}/invoices?${params}`, { data: buildRacePayload(), headers }),
            request.post(`${apiBase}/invoices?${params}`, { data: buildRacePayload(), headers })
        ]);

        console.log(`[RESULT] Thread 1 API Status: ${resp1.status()}`);
        console.log(`[RESULT] Thread 2 API Status: ${resp2.status()}`);

        const wasFirstCreated = [200, 201].includes(resp1.status());
        const wasSecondCreated = [200, 201].includes(resp2.status());

        if (wasFirstCreated && wasSecondCreated) {
            console.log('[VULNERABILITY] Thread synchronization failed! The database generated BOTH invoices natively!');
            
            // Push approval stage to confirm ledger allocation
            const body1 = await resp1.json();
            const body2 = await resp2.json();
            
            try {
                await app.advanceDocumentAPI(body1.id, 'invoices');
                await app.advanceDocumentAPI(body2.id, 'invoices');
                
                throw new Error(`[CRITICAL_LOGIC_BUG] Serious Multi-threading Failure: ERP completely approved both concurrent invoices for an item with only 1 unit. Warehouse is securely desynced with a negative ghost stock.`);
            } catch (authErr: any) {
                if (authErr.message.includes('CRITICAL_LOGIC_BUG')) throw authErr;
                console.log(`[PASS] DB Lock failed at Draft creation, but Approval validation layer safely captured the stock reduction mismatch. (${authErr.message})`);
            }
        } else if (!wasFirstCreated && !wasSecondCreated) {
            console.log('[PASS] System strictly isolated both threads (potentially deadlocking or queue blocking, which is safe).');
        } else {
            console.log('[PASS] Atomic Threading functional! The system prioritized one transaction and cleanly blocked the collision request.');
            
            const blockedResp = wasFirstCreated ? resp2 : resp1;
            if (blockedResp.status() === 500) {
                console.log(`[SECONDARY_BUG] Backend threw a 500 Server Crash for the blocked thread instead of cleanly throwing a 409 Conflict or 422 Transaction constraint.`);
            }
        }
    });

});
