const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/AppManager');

test.describe('Sales Order Negative API Tests @negative', () => {

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test('Block Creation: Missing Customer ID', async ({ page }) => {
        const app = new AppManager(page);
        const token = await app._getAuthToken();
        const apiBase = "http://157.180.20.112:8001/api";

        const payload = {
            accounts_receivable_id: "20c381e1-4d14-4ab1-8e7e-dee2937b4a64",
            currency_id: "50567982-ee2f-4391-9400-3149067443a5",
            customer_id: null, // CRITICAL MISSING FIELD
            so_date: new Date().toISOString(),
            so_items: [{
                item_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4",
                quantity: 1,
                unit_price: 1000,
                tax_id: "b017352f-f454-45e2-85ef-e327f90d8f9c"
            }]
        };

        console.log('[ACTION] Sending SO with null customer_id...');
        const response = await page.request.post(`${apiBase}/sales-orders?year=2018&period=yearly&calendar=ec`, {
            data: payload,
            headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
        });

        console.log(`[OK] Received status: ${response.status()}`);
        expect(response.ok()).toBe(false);
        expect(response.status()).toBeGreaterThanOrEqual(400);

        const errorText = await response.text();
        console.log(`[INFO] Server Response: ${errorText}`);
    });

    test('Block Creation: Empty Items List', async ({ page }) => {
        const app = new AppManager(page);
        const token = await app._getAuthToken();
        const apiBase = "http://157.180.20.112:8001/api";

        const payload = {
            customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
            so_date: new Date().toISOString(),
            so_items: [] // CRITICAL EMPTY LIST
        };

        console.log('[ACTION] Sending SO with empty items list...');
        const response = await page.request.post(`${apiBase}/sales-orders?year=2018&period=yearly&calendar=ec`, {
            data: payload,
            headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
        });

        console.log(`[OK] Received status: ${response.status()}`);
        expect(response.ok()).toBe(false);
        expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('Block Creation: Missing Item ID in Line Item', async ({ page }) => {
        const app = new AppManager(page);
        const token = await app._getAuthToken();
        const apiBase = "http://157.180.20.112:8001/api";

        const payload = {
            customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
            so_items: [{
                // item_id: MISSING
                quantity: 10,
                unit_price: 50
            }]
        };

        console.log('[ACTION] Sending SO with missing item_id in lines...');
        const response = await page.request.post(`${apiBase}/sales-orders?year=2018&period=yearly&calendar=ec`, {
            data: payload,
            headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
        });

        console.log(`[OK] Received status: ${response.status()}`);
        expect(response.ok()).toBe(false);
    });

    // --- INVOICE NEGATIVE TESTS ---
    test('Block Invoice: Missing Released Items', async ({ page }) => {
        const app = new AppManager(page);
        const token = await app._getAuthToken();
        const apiBase = "http://157.180.20.112:8001/api";

        const payload = {
            customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
            invoice_date: new Date().toISOString(),
            released_sales_order_items: [] // EMPTY
        };

        console.log('[ACTION] Sending Invoice with no line items...');
        const response = await page.request.post(`${apiBase}/invoices?year=2018&period=yearly&calendar=ec`, {
            data: payload,
            headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
        });

        console.log(`[OK] Received status: ${response.status()}`);
        expect(response.status()).toBe(422);
    });

    // --- RECEIPT NEGATIVE TESTS ---
    test('Block Receipt: Missing Cash Account', async ({ page }) => {
        const app = new AppManager(page);
        const token = await app._getAuthToken();
        const apiBase = "http://157.180.20.112:8001/api";

        const payload = {
            amount: 500,
            customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
            cash_account_id: null, // MISSING
            payment_method: "cash",
            invoice_receipts: [{
                amount: 500,
                invoice_id: "00000000-0000-0000-0000-000000000000"
            }]
        };

        console.log('[ACTION] Sending Receipt with null cash_account...');
        const response = await page.request.post(`${apiBase}/receipts?year=2018&period=yearly&calendar=ec`, {
            data: payload,
            headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
        });

        console.log(`[OK] Received status: ${response.status()}`);
        expect(response.status()).toBe(422);
    });

    // --- ADVANCED EDGE CASES ---

    test('Security: Block Unauthorized Access', async ({ page }) => {
        const apiBase = "http://157.180.20.112:8001/api";

        console.log('[ACTION] Sending SO with INVALID token...');
        const response = await page.request.post(`${apiBase}/sales-orders`, {
            data: { customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06" },
            headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer INVALID_TOKEN_123` }
        });

        console.log(`[OK] Received status: ${response.status()}`);
        expect(response.status()).toBe(401);
    });

    test('Boundary: Block Negative Quantity', async ({ page }) => {
        const app = new AppManager(page);
        const token = await app._getAuthToken();
        const apiBase = "http://157.180.20.112:8001/api";

        const payload = {
            customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
            so_items: [{
                item_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4",
                quantity: -99, // ILLEGAL
                unit_price: 100
            }]
        };

        console.log('[ACTION] Sending SO with negative quantity...');
        const response = await page.request.post(`${apiBase}/sales-orders?year=2018&period=yearly&calendar=ec`, {
            data: payload,
            headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
        });

        console.log(`[OK] Received status: ${response.status()}`);
        expect(response.status()).toBe(400);
    });

    test('Integrity: Block Non-Existent Customer UUID', async ({ page }) => {
        const app = new AppManager(page);
        const token = await app._getAuthToken();
        const apiBase = "http://157.180.20.112:8001/api";

        const payload = {
            customer_id: "123e4567-e89b-12d3-a456-426614174000", // FAKE VALID-FORMAT UUID
            so_items: [{
                item_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4",
                quantity: 1, unit_price: 100
            }]
        };

        console.log('[ACTION] Sending SO with non-existent customer_id...');
        const response = await page.request.post(`${apiBase}/sales-orders?year=2018&period=yearly&calendar=ec`, {
            data: payload,
            headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
        });

        console.log(`[OK] Received status: ${response.status()}`);
        expect(response.status()).toBe(422);
    });

});
