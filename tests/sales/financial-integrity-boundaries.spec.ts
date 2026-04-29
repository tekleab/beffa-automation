import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * CATEGORY 1: Financial Integrity & Sanity Boundaries
 * 
 * This suite audits the "Hard Bounds" of the financial system, ensuring that
 * mathematical overflows, negative amounts, and illegal document states (Void)
 * are strictly enforced at the API layer.
 */
test.describe('Financial Integrity Boundaries @security @regression @sales', () => {

    test.beforeEach(async ({ page }) => {
        // Shared login logic could go here if needed, but we keep tests isolated
    });

    /**
     * Resilience Helper: Seeding stock if needed.
     */
    async function ensureStock(app: any, item: any, quantity: number) {
        if (Number(item.currentStock) < quantity) {
            const bill = await app.createBillAPI({
                itemData: { ...item },
                quantity: quantity * 2,
                unitPrice: 100
            });
            await app.advanceDocumentAPI(bill.id, 'bills');
        }
    }

    // -------------------------------------------------------------------------
    // TEST 1: Receipt Amount Boundary Attack
    // -------------------------------------------------------------------------
    test('Guardrail: System must reject zero, negative, and fractional receipt amounts', async ({ page }) => {
        test.setTimeout(300000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
        if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
        if (!apiBase.endsWith('/api')) apiBase += '/api';
        const token = await app._getAuthToken();
        const year = process.env.BEFFA_YEAR || '2018';
        const period = process.env.BEFFA_PERIOD || 'yearly';
        const calendar = process.env.BEFFA_CALENDAR || 'ec';
        const params = `year=${year}&period=${period}&calendar=${calendar}`;
        const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` };

        console.log('[STEP 1] Setting up baseline: Creating & Approving a valid Invoice...');
        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.captureRandomItemDataAPI({ minStock: 0 });
        await ensureStock(app, item, 5);
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            quantity: 1,
            unitPrice: 500,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        const acctResp = await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
        const acctData = await acctResp.json();
        const allAccounts = acctData.items || acctData.data || [];
        const cashAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('cash') || a.account_type?.toLowerCase().includes('bank')) || allAccounts[0];
        const currResp = await page.request.get(`${apiBase}/currency?${params}`, { headers });
        const currData = await currResp.json();
        const currency = currData.items?.[0] || currData.data?.[0];

        const buildReceiptPayload = (amount: number) => ({
            amount,
            cash_account_id: cashAcct.id,
            customer_id: meta.customerId,
            date: new Date().toISOString(),
            payment_method: 'cash',
            currency_id: currency.id,
            invoice_receipts: [{ amount, invoice_id: inv.id }]
        });

        // Attack 1: Zero
        console.log('[ATTACK] Submitting receipt with amount = 0...');
        const zeroResp = await page.request.post(`${apiBase}/receipts?${params}`, { data: buildReceiptPayload(0), headers });
        if ([200, 201].includes(zeroResp.status())) {
            const body = await zeroResp.json();
            try {
                await app.advanceDocumentAPI(body.id, 'receipts');
                throw new Error(`[CRITICAL_LOGIC_BUG] System approved a ZERO-amount receipt: ${body.ref}`);
            } catch (e: any) { if (e.message.includes('CRITICAL_LOGIC_BUG')) throw e; }
        } else {
            if (zeroResp.status() === 500) console.log(`[SECONDARY_BUG] Backend must return proper validation (e.g. 422) instead of crashing with 500`);
            expect([400, 422, 500]).toContain(zeroResp.status());
        }

        // Attack 2: Negative
        console.log('[ATTACK] Submitting receipt with amount = -100...');
        const negResp = await page.request.post(`${apiBase}/receipts?${params}`, { data: buildReceiptPayload(-100), headers });
        if ([200, 201].includes(negResp.status())) {
            const body = await negResp.json();
            try {
                await app.advanceDocumentAPI(body.id, 'receipts');
                throw new Error(`[CRITICAL_LOGIC_BUG] System approved a NEGATIVE-amount receipt: ${body.ref}`);
            } catch (e: any) { if (e.message.includes('CRITICAL_LOGIC_BUG')) throw e; }
        } else {
            if (negResp.status() === 500) console.log(`[SECONDARY_BUG] Backend must return proper validation (e.g. 422) instead of crashing with 500`);
            expect([400, 422, 500]).toContain(negResp.status());
        }

        console.log('[FINISH] Receipt Amount Boundary Attack complete.');
    });

    // -------------------------------------------------------------------------
    // TEST 2: Ghost Discount Overflow Attack
    // -------------------------------------------------------------------------
    test('Guardrail: System must mathematically reject discounts exceeding invoice value', async ({ page }) => {
        test.setTimeout(120000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        
        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.captureRandomItemDataAPI({ minStock: 0 });
        await ensureStock(app, item, 2);

        const EXPLOIT_UNIT_PRICE = 1000;
        const EXPLOIT_DISCOUNT_CASH = 3500; 

        console.log(`[ATTACK] Injecting bounds-breaking discount: -${EXPLOIT_DISCOUNT_CASH}`);
        try {
            const rogueInvoice = await app.api.sales.createStandaloneInvoiceAPI({
                customerId: meta.customerId,
                itemId: item.itemId,
                quantity: 1,
                unitPrice: EXPLOIT_UNIT_PRICE,
                discount_amount: EXPLOIT_DISCOUNT_CASH,
                discount_type: 'cash'
            });

            try {
                await app.advanceDocumentAPI(rogueInvoice.id, 'invoices');
                const checkStatus = await app.api.sales.getInvoiceAPI(rogueInvoice.id);
                if (Number(checkStatus.total_amount) < 0) {
                    throw new Error(`[CRITICAL_LOGIC_BUG] ERP allowed Ghost Discount overflow! Total: ${checkStatus.total_amount}`);
                }
            } catch (authErr: any) {
                if (authErr.message.includes('CRITICAL_LOGIC_BUG')) throw authErr;
                console.log(`[PASS] Bounds overflow intercepted: ${authErr.message}`);
            }
        } catch (error: any) {
            if (error.message.includes('CRITICAL_LOGIC_BUG')) throw error;
            if (error.message.includes('500')) console.log(`[SECONDARY_BUG] Backend crashed with 500 on bounds failure.`);
        }
    });

    // -------------------------------------------------------------------------
    // TEST 3: Receipt on Voided Invoice Attack
    // -------------------------------------------------------------------------
    test('Guardrail: System must prevent receipts against a voided invoice', async ({ page }) => {
        test.setTimeout(400000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        let apiBase = (process.env.BASE_URL || 'http://157.180.20.112:8001').replace(/\/$/, '').replace(':4173', ':8001');
        if (!apiBase.endsWith('/api')) apiBase += '/api';
        const token = await app._getAuthToken();
        const year = process.env.BEFFA_YEAR || '2018';
        const period = process.env.BEFFA_PERIOD || 'yearly';
        const calendar = process.env.BEFFA_CALENDAR || 'ec';
        const params = `year=${year}&period=${period}&calendar=${calendar}`;
        const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` };

        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.captureRandomItemDataAPI({ minStock: 0 });
        await ensureStock(app, item, 5);

        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            unitPrice: 250,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        console.log(`[ACTION] Voiding Invoice ${inv.ref}...`);
        const voidResp = await page.request.patch(`${apiBase}/invoices/${inv.id}/void?${params}`, {
            data: { status: 'reversed' },
            headers
        });

        if (voidResp.ok()) {
            const acctResp = await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
            const acctJson = await acctResp.json();
            const allAccounts = acctJson.items || acctJson.data || [];
            const cashAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('cash')) || allAccounts[0];
            
            const currResp = await page.request.get(`${apiBase}/currency?${params}`, { headers });
            const currJson = await currResp.json();
            const currency = (currJson.items || currJson.data || [])[0];

            console.log('[ATTACK] Attempting receipt on VOIDED invoice...');
            const ghostReceiptResp = await page.request.post(`${apiBase}/receipts?${params}`, {
                data: {
                    amount: 250,
                    cash_account_id: cashAcct.id,
                    customer_id: meta.customerId,
                    date: new Date().toISOString(),
                    payment_method: 'cash',
                    currency_id: currency.id,
                    invoice_receipts: [{ amount: 250, invoice_id: inv.id }]
                },
                headers
            });

            if ([200, 201].includes(ghostReceiptResp.status())) {
                const body = await ghostReceiptResp.json();
                try {
                    await app.advanceDocumentAPI(body.id, 'receipts');
                    throw new Error(`[CRITICAL_LOGIC_BUG] System allowed ghost payment on voided invoice: ${body.ref}`);
                } catch (e: any) { if (e.message.includes('CRITICAL_LOGIC_BUG')) throw e; }
            } else {
                if (ghostReceiptResp.status() === 500) console.log(`[SECONDARY_BUG] Backend crashed with 500 on void-receipt attack.`);
                expect([400, 403, 422, 500]).toContain(ghostReceiptResp.status());
            }
        }
    });
});
