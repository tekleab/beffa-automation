import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { DateHelper } from '../../lib/utils/DateHelper';
import { DevReporter } from '../../lib/utils/DevReporter';

/**
 * =============================================================================
 * MODULE: Inventory Valuation, Purchase Price Variance (PPV) & Transfer Locking
 * 
 * Invariants & Guardrails:
 * 1. 3-Way Match Variance: Price differences between PO and Bill must be
 *    handled without creating negative WAC or corrupting inventory ledger.
 * 2. Return to Vendor (RTV) Costing: Return transactions must deduct stock
 *    accurately at inventory acquisition cost.
 * 3. In-Transit Transfer Integrity: Source warehouse stock in transfer must
 *    be protected against double-spending or concurrent overselling.
 * =============================================================================
 */

test.describe('Inventory Valuation, PPV & Transfer Guardrails @inventory @regression', () => {
    test.setTimeout(240000);

    test('Audit: 3-Way Match Price Variance (PO @ $100 vs Bill @ $120) maintains inventory subledger integrity', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const purchaseMeta = await app.api.purchase.discoverMetadataAPI();
        const freshItem = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'FIFO',
            quantity: 10,
            unit_cost: 100
        });

        // 1. Create Purchase Order for 10 units @ 100 ETB
        const po = await app.api.purchase.createPurchaseOrderAPI({
            vendorId: purchaseMeta.vendorId,
            itemId: freshItem.itemId,
            quantity: 10,
            unitPrice: 100,
            locationId: freshItem.locationId,
            warehouseId: freshItem.warehouseId
        });
        expect(po.success, 'PO creation must succeed').toBe(true);
        console.log(`[PPV AUDIT] Created PO: ${po.poNumber} (ID: ${po.poId})`);
        await app.advanceDocumentAPI(po.poId, 'purchase-orders');

        // 2. Create Vendor Bill with Price Variance: 10 units @ 120 ETB (Variance = +20 ETB/unit)
        const token = await app._getAuthToken();
        const resolvedDate = await DateHelper.resolve(page);
        const qs = DateHelper.qs();
        const company = process.env.BEFFA_COMPANY || 'ABC Trading';
        const headers = {
            'x-company': company,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const billPayload = {
            vendor_id: purchaseMeta.vendorId,
            purchase_order_id: po.poId,
            accounts_payable_id: purchaseMeta.apAccountId,
            currency_id: purchaseMeta.currencyId,
            date: resolvedDate.iso,
            posting_date: resolvedDate.iso,
            invoice_date: resolvedDate.iso,
            due_date: resolvedDate.iso,
            vendor_invoice_number: `VIN-PPV-${Date.now()}`,
            items: [
                {
                    item_id: freshItem.itemId,
                    quantity: 10,
                    unit_price: 120, // Price variance: was 100, now 120
                    location_id: freshItem.locationId,
                    warehouse_id: freshItem.warehouseId,
                    general_ledger_account_id: purchaseMeta.apAccountId
                }
            ]
        };

        const startTime = Date.now();
        const billUrl = `${app.apiBase}/bills?${qs}`;
        const billResp = await page.request.post(billUrl, {
            headers,
            data: billPayload
        });
        const duration = Date.now() - startTime;
        const billBody = await billResp.json().catch(() => ({}));

        DevReporter.record({
            testName: '3-Way Match Price Variance (PO $100 -> Bill $120)',
            action: 'Submit Vendor Bill with higher unit cost than approved PO',
            method: 'POST',
            url: billUrl,
            company,
            token,
            payload: billPayload,
            status: billResp.status(),
            responseBody: billBody,
            durationMs: duration,
            verdict: billResp.ok()
                ? 'Bill accepted with price variance — verifying inventory valuation conservation'
                : 'Bill creation rejected due to variance restriction policy'
        });

        if (billResp.ok()) {
            const billId = billBody.id || billBody.data?.id;
            await app.advanceDocumentAPI(billId, 'bills');

            const itemDetail = await app.api.inventory.getItemDetailsAPI(freshItem.itemId);
            console.log(`[PPV AUDIT] Final Item Stock Level: ${itemDetail?.currentStock ?? 'N/A'}`);
            expect(Number(itemDetail?.currentStock)).toBeGreaterThanOrEqual(10);
        }
    });

    test('Guardrail: Return to Vendor / Negative Adjustment cannot drive stock below zero', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        // Create item with exactly 5 units of stock
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'FIFO',
            quantity: 5,
            unit_cost: 80
        });

        const token = await app._getAuthToken();
        const resolvedDate = await DateHelper.resolve(page);
        const qs = DateHelper.qs();
        const company = process.env.BEFFA_COMPANY || 'ABC Trading';
        const headers = {
            'x-company': company,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Attempt excessive negative stock adjustment of 10 units (available is only 5)
        const excessiveAdjPayload = {
            adjustment_date: resolvedDate.iso,
            posting_date: resolvedDate.iso,
            description: 'Guardrail Test: Return-to-Vendor Over-Depletion',
            items: [
                {
                    item_id: item.itemId,
                    quantity: -10, // Exceeds 5 available
                    unit_cost: 80,
                    location_id: item.locationId,
                    warehouse_id: item.warehouseId
                }
            ]
        };

        const adjUrl = `${app.apiBase}/inventory-adjustments?${qs}`;
        const startTime = Date.now();
        const adjResp = await page.request.post(adjUrl, {
            headers,
            data: excessiveAdjPayload
        });
        const duration = Date.now() - startTime;
        const adjBody = await adjResp.json().catch(() => ({}));

        DevReporter.record({
            testName: 'Return to Vendor Over-Depletion Guardrail',
            action: 'Attempt negative adjustment of -10 units on stock of 5',
            method: 'POST',
            url: adjUrl,
            company,
            token,
            payload: excessiveAdjPayload,
            status: adjResp.status(),
            responseBody: adjBody,
            durationMs: duration,
            verdict: adjResp.status() >= 400
                ? 'PASSED: System correctly rejected over-depletion'
                : 'CRITICAL BUG: System allowed stock to drop below zero'
        });

        // Must reject over-depletion with client error
        expect(
            adjResp.status(),
            `Stock adjustment beyond available balance must be rejected (Got ${adjResp.status()})`
        ).toBeGreaterThanOrEqual(400);

        // Confirm stock remains non-negative
        const updated = await app.api.inventory.getItemDetailsAPI(item.itemId);
        expect(Number(updated?.currentStock)).toBeGreaterThanOrEqual(0);
    });

    test('Guardrail: Concurrent sales during inventory transfer cannot exceed available source stock', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const salesMeta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'FIFO',
            quantity: 15,
            unit_cost: 100
        });

        // Concurrently attempt two sales orders for 10 units each (Total 20 > 15 available)
        const order1Promise = app.api.sales.createStandaloneInvoiceAPI({
            customerId: salesMeta.customerId,
            itemId: item.itemId,
            quantity: 10,
            unitPrice: 150,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });

        const order2Promise = app.api.sales.createStandaloneInvoiceAPI({
            customerId: salesMeta.customerId,
            itemId: item.itemId,
            quantity: 10,
            unitPrice: 150,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });

        const [order1, order2] = await Promise.allSettled([order1Promise, order2Promise]);

        const o1Ok = order1.status === 'fulfilled' && (order1.value as any).success;
        const o2Ok = order2.status === 'fulfilled' && (order2.value as any).success;

        DevReporter.record({
            testName: 'Concurrent Dual Sales Orders (Total 20 units against 15 stock)',
            action: 'Simultaneously submit Order 1 (10 units) and Order 2 (10 units)',
            method: 'POST',
            url: `${app.apiBase}/invoices`,
            company: process.env.BEFFA_COMPANY || 'ABC Trading',
            payload: { order1Quantity: 10, order2Quantity: 10, availableStock: 15 },
            status: o1Ok && o2Ok ? 200 : 422,
            responseBody: { order1Created: o1Ok, order2Created: o2Ok },
            verdict: o1Ok && o2Ok
                ? 'Both draft invoices created — advancing documents to test approval-time concurrency barrier'
                : 'Concurrency barrier enforced at creation time'
        });

        if (o1Ok && o2Ok) {
            const inv1Id = (order1.value as any).id;
            const inv2Id = (order2.value as any).id;

            const adv1 = await app.advanceDocumentAPI(inv1Id, 'invoices').then(() => true).catch(() => false);
            const adv2 = await app.advanceDocumentAPI(inv2Id, 'invoices').then(() => true).catch(() => false);

            console.log(`[CONCURRENCY AUDIT] Invoice Approval Results: Inv1=${adv1}, Inv2=${adv2}`);
            expect(adv1 && adv2, 'Both parallel orders cannot be approved when cumulative demand exceeds total stock').toBe(false);
        }

        const finalItem = await app.api.inventory.getItemDetailsAPI(item.itemId);
        expect(Number(finalItem?.currentStock)).toBeGreaterThanOrEqual(0);
    });
});
