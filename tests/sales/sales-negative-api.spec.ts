import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('Sales Forensic Gauntlet: Negative API @negative', () => {

    test('Master Audit: Verify all Sales Guardrails in a single session', async ({ page }) => {
        test.setTimeout(300000);
        const app = new AppManager(page);
        
        console.log('[STEP] Phase 1: High-Speed Forensic Login');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const token = await app._getAuthToken();
        const apiBase = "http://157.180.20.112:8001/api";
        const meta = {
            company: process.env.BEFFA_COMPANY as string,
            yearParams: "year=2018&period=yearly&calendar=ec"
        };

        const runCheck = async (name: string, endpoint: string, payload: any, expectedStatus: number | number[] = 422, method: 'POST' | 'PUT' = 'POST', customToken?: string) => {
            console.log(`[AUDIT] Scenario: ${name}`);
            const response = await page.request[method.toLowerCase() as 'post' | 'put'](`${apiBase}/${endpoint}?${meta.yearParams}`, {
                data: payload,
                headers: { 
                    'x-company': meta.company, 
                    'Authorization': `Bearer ${customToken || token}` 
                }
            });
            const status = response.status();
            console.log(`[RESULT] Status: ${status}`);
            
            if (Array.isArray(expectedStatus)) {
                expect(expectedStatus).toContain(status);
            } else {
                expect(status).toBe(expectedStatus);
            }
        };

        // --- SALES ORDER NEGATIVES ---
        await runCheck('Missing Customer ID', 'sales-orders', {
            customer_id: null,
            so_items: [{ item_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4", quantity: 1, unit_price: 1000 }]
        });

        await runCheck('Empty Items List', 'sales-orders', {
            customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
            so_items: []
        });

        await runCheck('Missing Item ID', 'sales-orders', {
            customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
            so_items: [{ quantity: 1, unit_price: 100 }]
        });

        await runCheck('Negative Quantity', 'sales-orders', {
            customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
            so_items: [{ item_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4", quantity: -50, unit_price: 100 }]
        });

        // --- INVOICE NEGATIVES ---
        await runCheck('Invoice: Empty SO Links', 'invoices', {
            customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
            released_sales_order_items: []
        });

        // --- RECEIPT NEGATIVES ---
        await runCheck('Receipt: Missing Cash Account', 'receipts', {
            amount: 500,
            customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
            cash_account_id: null,
            payment_method: "cash",
            invoice_receipts: [{ amount: 500, invoice_id: "00000000-0000-0000-0000-000000000000" }]
        });

        // --- SECURITY & INTEGRITY ---
        await runCheck('Security: Invalid Token', 'sales-orders', {}, 401, 'POST', 'INVALID_TOKEN_999');

        await runCheck('Integrity: Fake Customer UUID', 'sales-orders', {
            customer_id: "123e4567-e89b-12d3-a456-426614174000",
            so_items: [{ item_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4", quantity: 1, unit_price: 100 }]
        });

        // --- STATE VIOLATION ---
        console.log('[AUDIT] Scenario: Invoicing a DRAFT Sales Order');
        const item = await app.captureRandomItemDataAPI();
        const so = await app.api.sales.createSalesOrderAPI({ 
            itemId: item.itemId,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        const invResp = await page.request.post(`${apiBase}/invoices?${meta.yearParams}`, {
            data: {
                customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
                released_sales_order_items: [{ so_item_id: so.soItemId, released_quantity: 1 }]
            },
            headers: { 'x-company': meta.company, 'Authorization': `Bearer ${token}` }
        });
        expect(invResp.status()).toBe(422);
        console.log(`[RESULT] Status: ${invResp.status()} (Intercepted)`);

        await runCheck('Boundary: Financial Overflow', 'sales-orders', {
            customer_id: "32f1aeb4-531f-4104-ad07-f3761a97dd06",
            so_items: [{ 
                item_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4", 
                quantity: 9999999999, 
                unit_price: 9999999999 
            }]
        }, [400, 422]);

        console.log('[FINISH] Master Sales Forensic Audit Complete. All guardrails verified.');
        await page.close();
    });
});
