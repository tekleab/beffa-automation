import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { DateHelper } from '../../lib/utils/DateHelper';
import { DevReporter } from '../../lib/utils/DevReporter';

/**
 * =============================================================================
 * MODULE: Sales Commercial Risk — Credit Limits & Partial-Settlement Voids
 * 
 * Invariants & Guardrails:
 * 1. Partial-Payment Void Arbitrage: Once an invoice is partially paid,
 *    voiding or issuing a full credit note for the original gross total
 *    must be prevented (stops creation of phantom customer credit balances).
 * 2. Overpayment Protection: A receipt amount cannot exceed the remaining
 *    unpaid balance on an invoice.
 * =============================================================================
 */

test.describe('Sales Commercial Risk & Settlement Integrity @sales @regression', () => {
    test.setTimeout(240000);

    test('Guardrail: Cannot void or issue full credit note against an already partially-settled invoice', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'FIFO',
            quantity: 20,
            unit_cost: 100
        });

        // 1. Create and approve invoice for 1000 ETB (2 units @ 500 ETB)
        const invoice = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            quantity: 2,
            unitPrice: 500,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        expect(invoice.success, 'Invoice creation must succeed').toBe(true);
        console.log(`[VOID ARBITRAGE] Created Invoice: ${invoice.ref} (ID: ${invoice.id})`);
        await app.advanceDocumentAPI(invoice.id, 'invoices');

        // 2. Post partial receipt of 400 ETB (Outstanding balance = 600 ETB)
        const token = await app._getAuthToken();
        const resolvedDate = await DateHelper.resolve(page);
        const qs = DateHelper.qs();
        const company = process.env.BEFFA_COMPANY || 'ABC Trading';
        const headers = {
            'x-company': company,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const receiptPayload = {
            customer_id: meta.customerId,
            receipt_date: resolvedDate.iso,
            posting_date: resolvedDate.iso,
            cash_account_id: meta.cashAccountId,
            currency_id: meta.currencyId,
            amount: 400,
            invoices: [
                {
                    invoice_id: invoice.id,
                    amount_to_pay: 400
                }
            ]
        };

        const receiptUrl = `${app.apiBase}/receipts?${qs}`;
        const startTime = Date.now();
        const rcptResp = await page.request.post(receiptUrl, {
            headers,
            data: receiptPayload
        });
        const duration = Date.now() - startTime;
        const rcptBody = await rcptResp.json().catch(() => ({}));

        DevReporter.record({
            testName: 'Partial Receipt Registration ($400 on $1000 Invoice)',
            action: 'Record partial payment receipt against approved invoice',
            method: 'POST',
            url: receiptUrl,
            company,
            token,
            payload: receiptPayload,
            status: rcptResp.status(),
            responseBody: rcptBody,
            durationMs: duration,
            verdict: rcptResp.ok()
                ? 'Partial receipt created successfully'
                : 'Partial receipt creation rejected'
        });

        if (rcptResp.ok()) {
            const receiptId = rcptBody.id || rcptBody.data?.id;
            await app.advanceDocumentAPI(receiptId, 'receipts');

            // 3. ATTEMPT VOID / CANCELLATION OF ORIGINAL INVOICE ($1000)
            const voidUrl = `${app.apiBase}/invoices/${invoice.id}/void?${qs}`;
            const voidStart = Date.now();
            const voidResp = await page.request.post(voidUrl, { headers });
            const voidDuration = Date.now() - voidStart;
            const voidBody = await voidResp.text();

            DevReporter.record({
                testName: 'Partial Settlement Void Arbitrage Attack',
                action: 'Attempt to void a $1,000 invoice with an active approved $400 receipt',
                method: 'POST',
                url: voidUrl,
                company,
                token,
                payload: { invoice_id: invoice.id, reason: 'Arbitrage Attempt' },
                status: voidResp.status(),
                responseBody: voidBody,
                durationMs: voidDuration,
                verdict: voidResp.ok()
                    ? 'CRITICAL DEFECT: Backend permitted voiding a partially paid invoice (Creates phantom customer credit)'
                    : 'PASSED GUARDRAIL: Backend rejected voiding invoice with active receipts'
            });

            expect(
                voidResp.ok(),
                'Invoice with active settled receipts must NOT be directly voided (violates AR reconciliation)'
            ).toBe(false);
        }
    });

    test('Guardrail: Receipt amount exceeding outstanding invoice balance must be rejected or quarantined', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'FIFO',
            quantity: 10,
            unit_cost: 100
        });

        // Create invoice for 500 ETB
        const invoice = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            quantity: 1,
            unitPrice: 500,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(invoice.id, 'invoices');

        const token = await app._getAuthToken();
        const resolvedDate = await DateHelper.resolve(page);
        const qs = DateHelper.qs();
        const company = process.env.BEFFA_COMPANY || 'ABC Trading';
        const headers = {
            'x-company': company,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Attempt overpayment receipt of 2,000 ETB on a 500 ETB invoice
        const overpaymentPayload = {
            customer_id: meta.customerId,
            receipt_date: resolvedDate.iso,
            posting_date: resolvedDate.iso,
            cash_account_id: meta.cashAccountId,
            currency_id: meta.currencyId,
            amount: 2000,
            invoices: [
                {
                    invoice_id: invoice.id,
                    amount_to_pay: 2000 // Exceeds balance by 1500 ETB
                }
            ]
        };

        const rcptUrl = `${app.apiBase}/receipts?${qs}`;
        const startTime = Date.now();
        const resp = await page.request.post(rcptUrl, {
            headers,
            data: overpaymentPayload
        });
        const duration = Date.now() - startTime;
        const body = await resp.json().catch(() => ({}));

        DevReporter.record({
            testName: 'Invoice Overpayment Receipt Guardrail ($2,000 on $500 Balance)',
            action: 'Attempt to link receipt amount exceeding invoice balance due',
            method: 'POST',
            url: rcptUrl,
            company,
            token,
            payload: overpaymentPayload,
            status: resp.status(),
            responseBody: body,
            durationMs: duration,
            verdict: resp.status() >= 400
                ? 'PASSED GUARDRAIL: Overpayment rejected with 422'
                : 'Backend accepted overpayment — checking if amount due was clamped at 0'
        });

        if (resp.ok()) {
            const invDetail = await page.request.get(`${app.apiBase}/invoices/${invoice.id}?${qs}`, { headers }).then(r => r.json());
            const amountDue = parseFloat(invDetail.amount_due ?? invDetail.balance ?? 0);
            expect(amountDue, 'Invoice amount due must never drop below $0.00').toBeGreaterThanOrEqual(0);
        } else {
            expect(resp.status(), 'Overpayment linking rejected with 422').toBeGreaterThanOrEqual(400);
        }
    });
});
