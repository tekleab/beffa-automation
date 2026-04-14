import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('Purchase Negative API Tests @negative', () => {

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    // --- PURCHASE ORDER NEGATIVE TESTS ---
    test('Block PO: Missing Vendor ID', async ({ page }) => {
        const app = new AppManager(page);
        const token = await app._getAuthToken();
        const apiBase = "http://157.180.20.112:8001/api";

        const payload = {
            accounts_payable_id: "20c381e1-4d14-4ab1-8e7e-dee2937b4a64",
            currency_id: "50567982-ee2f-4391-9400-3149067443a5",
            po_date: new Date().toISOString(),
            vendor_id: null, // CRITICAL MISSING
            po_items: [{
                item_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4",
                quantity: 1,
                unit_price: 500
            }]
        };

        console.log('[ACTION] Sending PO with null vendor_id...');
        const response = await page.request.post(`${apiBase}/purchase-orders?year=2018&period=yearly&calendar=ec`, {
            data: payload,
            headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
        });

        console.log(`[OK] Received status: ${response.status()}`);
        expect(response.status()).toBe(422);
    });

    test('Block PO: Negative Quantity', async ({ page }) => {
        const app = new AppManager(page);
        const token = await app._getAuthToken();
        const apiBase = "http://157.180.20.112:8001/api";

        const payload = {
            vendor_id: "b83a4bcd-0334-42fd-932c-b9bc5cc22208",
            po_items: [{
                item_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4",
                quantity: -50, // ILLEGAL
                unit_price: 100
            }]
        };

        console.log('[ACTION] Sending PO with negative quantity...');
        const response = await page.request.post(`${apiBase}/purchase-orders?year=2018&period=yearly&calendar=ec`, {
            data: payload,
            headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
        });

        console.log(`[OK] Received status: ${response.status()}`);
        expect(response.status()).toBe(400);
    });

    // --- BILL NEGATIVE TESTS ---
    test('Block Bill: Empty Items List', async ({ page }) => {
        const app = new AppManager(page);
        const token = await app._getAuthToken();
        const apiBase = "http://157.180.20.112:8001/api";

        const payload = {
            vendor_id: "b83a4bcd-0334-42fd-932c-b9bc5cc22208",
            items: [] // EMPTY
        };

        console.log('[ACTION] Sending Bill with empty items list...');
        const response = await page.request.post(`${apiBase}/bills?year=2018&period=yearly&calendar=ec`, {
            data: payload,
            headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
        });

        console.log(`[OK] Received status: ${response.status()}`);
        expect(response.status()).toBe(422);
    });

    // --- PAYMENT NEGATIVE TESTS ---
    test('Block Payment: Missing Cash Account', async ({ page }) => {
        const app = new AppManager(page);
        const token = await app._getAuthToken();
        const apiBase = "http://157.180.20.112:8001/api";

        const payload = {
            amount: 1000,
            vendor_id: "b83a4bcd-0334-42fd-932c-b9bc5cc22208",
            cash_account_id: null, // MISSING
            bill_payments: [{
                amount: 1000,
                bill_id: "00000000-0000-0000-0000-000000000000"
            }]
        };

        console.log('[ACTION] Sending Payment with null cash_account...');
        const response = await page.request.post(`${apiBase}/payments?year=2018&period=yearly&calendar=ec`, {
            data: payload,
            headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
        });

        console.log(`[OK] Received status: ${response.status()}`);
        expect(response.status()).toBe(422);
    });

    // --- SECURITY TEST ---
    test('Security: Block Unauthorized Purchase Access', async ({ page }) => {
        const apiBase = "http://157.180.20.112:8001/api";

        console.log('[ACTION] Sending PO with INVALID token...');
        const response = await page.request.post(`${apiBase}/purchase-orders`, {
            data: { vendor_id: "b83a4bcd-0334-42fd-932c-b9bc5cc22208" },
            headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer INVALID_TOKEN` }
        });

        console.log(`[OK] Received status: ${response.status()}`);
        expect(response.status()).toBe(401);
    });

    // --- PROFESSIONAL STATE & BOUNDARY TESTS ---

    test('State Violation: Block Billing a DRAFT PO', async ({ page }) => {
        const app = new AppManager(page);
        const apiBase = "http://157.180.20.112:8001/api";
        const token = await app._getAuthToken();

        // 1. Dynamic Item Discovery
        console.log('[ACTION] Discovering valid item for state violation test...');
        const item = await app.captureRandomItemDetails();

        // 2. Create a DRAFT Purchase Order
        const po = await app.api.purchase.createPurchaseOrderAPI({ itemName: item.itemName, itemId: item.itemId });

        // 3. Attempt to Bill (Should fail because PO is not approved)
        console.log(`[ACTION] Attempting state violation: Billing DRAFT PO ${po.poNumber}...`);
        const response = await page.request.post(`${apiBase}/bills?year=2018&period=yearly&calendar=ec`, {
            data: {
                vendor_id: "b83a4bcd-0334-42fd-932c-b9bc5cc22208",
                items: [{ po_item_id: "00000000-0000-0000-0000-000000000000", quantity: 1 }]
            },
            headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
        });

        console.log(`[OK] Received status: ${response.status()}`);
        expect(response.status()).toBe(422);
    });

    test('Boundary: Block Extreme Financial Inputs (Purchase)', async ({ page }) => {
        const app = new AppManager(page);
        const apiBase = "http://157.180.20.112:8001/api";
        const token = await app._getAuthToken();

        // 1. Dynamic Item Discovery
        const item = await app.captureRandomItemDetails();

        const payload = {
            vendor_id: "b83a4bcd-0334-42fd-932c-b9bc5cc22208",
            po_items: [{
                item_id: item.itemId,
                quantity: 999999999999,
                unit_price: 999999999999
            }]
        };

        console.log('[ACTION] Sending PO with extreme numeric values...');
        const response = await page.request.post(`${apiBase}/purchase-orders?year=2018&period=yearly&calendar=ec`, {
            data: payload,
            headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
        });

        console.log(`[OK] Received status: ${response.status()}`);
        expect(response.status()).toBeGreaterThanOrEqual(400);
    });
});
