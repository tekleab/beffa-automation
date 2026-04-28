import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('Purchase Forensic Gauntlet: Negative API @negative', () => {

    test('Master Audit: Verify all Purchase Guardrails in a single session', async ({ page }) => {
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

        // --- PURCHASE ORDER NEGATIVES ---
        await runCheck('Missing Vendor ID', 'purchase-orders', {
            vendor_id: null,
            po_items: [{ item_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4", quantity: 1, unit_price: 500 }]
        });

        await runCheck('Negative Quantity', 'purchase-orders', {
            vendor_id: "b83a4bcd-0334-42fd-932c-b9bc5cc22208",
            po_items: [{ item_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4", quantity: -50, unit_price: 100 }]
        }, [400, 422]);

        // --- BILL NEGATIVES ---
        await runCheck('Bill: Empty Items List', 'bills', {
            vendor_id: "b83a4bcd-0334-42fd-932c-b9bc5cc22208",
            items: []
        });

        // --- PAYMENT NEGATIVES ---
        await runCheck('Payment: Missing Cash Account', 'payments', {
            amount: 1000,
            vendor_id: "b83a4bcd-0334-42fd-932c-b9bc5cc22208",
            cash_account_id: null,
            bill_payments: [{ amount: 1000, bill_id: "00000000-0000-0000-0000-000000000000" }]
        });

        // --- SECURITY ---
        await runCheck('Security: Invalid Token', 'purchase-orders', {}, 401, 'POST', 'INVALID_TOKEN_ABC');

        // --- STATE VIOLATION ---
        console.log('[AUDIT] Scenario: Billing a DRAFT Purchase Order');
        const item = await app.captureRandomItemDataAPI();
        const po = await app.api.purchase.createPurchaseOrderAPI({ itemName: item.itemName, itemId: item.itemId });
        const billResp = await page.request.post(`${apiBase}/bills?${meta.yearParams}`, {
            data: {
                vendor_id: "b83a4bcd-0334-42fd-932c-b9bc5cc22208",
                items: [{ po_item_id: po.id, quantity: 1 }]
            },
            headers: { 'x-company': meta.company, 'Authorization': `Bearer ${token}` }
        });
        expect(billResp.status()).toBe(422);
        console.log(`[RESULT] Status: ${billResp.status()} (Intercepted)`);

        await runCheck('Boundary: Financial Overflow', 'purchase-orders', {
            vendor_id: "b83a4bcd-0334-42fd-932c-b9bc5cc22208",
            po_items: [{ 
                item_id: item.itemId, 
                quantity: 9999999999, 
                unit_price: 9999999999 
            }]
        }, [400, 422]);

        console.log('[FINISH] Master Purchase Forensic Audit Complete. All guardrails verified.');
        await page.close();
    });
});
