import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

const API = () => (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
    .replace(/['"]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001') + '/api';
const QS = () => `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

async function apiLogin(request: any): Promise<string> {
    const r = await request.post(`${API()}/users/login?${QS()}&month=6`, {
        data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
        headers: { 'Content-Type': 'application/json' }
    });
    const token = (await r.json()).auth_token;
    if (!token) throw new Error('apiLogin failed');
    return token;
}


/**
 * PROCUREMENT CONCURRENCY & RACE CONDITIONS
 *
 * Objectives:
 * 1. Verify system handles concurrent duplicate Bill payments atomically.
 * 2. Verify system enforces thread-safe serialization for stock additions.
 *
 * CONFIRMED ERP BEHAVIOR (live probe):
 * - Both concurrent payment CREATE requests succeed (drafts created)
 * - Concurrent APPROVE race: second approval gets E1481 — blocked
 * - Sequential APPROVE (one after other): BOTH can be approved — VULNERABILITY
 *   Confirmed by manual UI test: PAY/000096 + PAY/000097 both approved manually
 */

test.describe('Procurement Concurrency & Race Condition Audits @purchase @concurrency @security @regression @full', () => {
    test.setTimeout(300000);

    let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;

    test.beforeAll(async ({ browser, request }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await apiLogin(request);
        sharedMeta = await app.api.purchase.discoverMetadataAPI();
        sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
        await page.close();
    });

    test('Guardrail: System must handle concurrent duplicate Bill payments atomically', async ({ page , request }) => {
        const app = new AppManager(page);
        await apiLogin(request);
        const meta = sharedMeta;
        const item = sharedItem;

        console.log(`[STEP 1] Creating target Bill for 1000...`);
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 1000, quantity: 1, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');

        console.log(`[ATTACK] Triggering Concurrent Payment Race...`);
        const pay1 = app.api.purchase.createBillPaymentAPI({ amount: 1000, billId: bill.id, vendorId: meta.vendorId });
        const pay2 = app.api.purchase.createBillPaymentAPI({ amount: 1000, billId: bill.id, vendorId: meta.vendorId });

        const results = await Promise.allSettled([pay1, pay2]);
        const successes = results.filter(r => r.status === 'fulfilled');
        console.log(`[SNAPSHOT] Concurrent Results: ${successes.length} / 2 requests fulfilled.`);

        if (successes.length > 1) {
            console.warn(`[VULNERABILITY] Both payment drafts created — testing sequential approval (real-world attack vector)...`);

            const ids: string[] = successes.map((s: any) => s.value.id);

            // Phase A: concurrent approval (API race) — ERP blocks second via E1481
            await Promise.allSettled(ids.map(id => app.advanceDocumentAPI(id, 'payments')));
            await page.waitForTimeout(2000);

            // Phase B: sequential approval — attempt to approve any remaining drafts one by one
            // This simulates a user manually approving both from the UI.
            // Expected: already-approved payments return 422 E2888 — that is correct ERP behaviour.
            console.log(`[ATTACK-B] Sequential approval attempt on all draft payments...`);
            for (const id of ids) {
                try {
                    await app.advanceDocumentAPI(id, 'payments');
                } catch (e: any) {
                    console.log(`[GUARD] ${id.substring(0,8)}: ${e.message.substring(0,80)}`);
                }
                await page.waitForTimeout(1000);
            }
            await page.waitForTimeout(4000);

            // Check final statuses AFTER all advances complete
            const token = await app._getAuthToken();
            const apiBase: string = (app as any).base.apiBase;
            const qs = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
            const headers = {
                'x-company': process.env.BEFFA_COMPANY as string,
                'Authorization': `Bearer ${token}`,
                'x-role': 'IT Administrator / User Manager'
            };

            const listResp = await page.request.get(`${apiBase}/payments?pageSize=20&${qs}`, { headers });
            const listData = await listResp.json();
            const allPayments: any[] = listData.data || listData.items || [];
            const relevant = allPayments.filter((p: any) => ids.includes(p.id));

            relevant.forEach((p: any) => {
                console.log(`[PAYMENT STATUS] id=${p.id.substring(0, 8)}... status=${p.status} ref=${p.ref}`);
            });

            const approvedCount = relevant.filter((p: any) => p.status === 'approved').length;
            console.log(`[AUDIT] Approved payments for bill ${bill.id.substring(0, 8)}...: ${approvedCount} / ${relevant.length}`);

            if (approvedCount > 1) {
                // This is a REAL ERP vulnerability — confirmed live:
                // PAY/000096+097, 098+099, 100+101 all approved simultaneously
                // E2888 only blocks re-approving the SAME payment ID, not a duplicate payment for the same bill
                console.error(`[CRITICAL_VULNERABILITY] Both payments approved!`);
                relevant.forEach((p: any) => console.error(`  ${p.ref} (${p.id.substring(0,8)}) = ${p.status}`));
                throw new Error(
                    `[CRITICAL_VULNERABILITY] Double-Payment Bug: ERP approved ${approvedCount} payments for Bill ${bill.id.substring(0,8)}\n` +
                    `  Payments : ${relevant.map((p: any) => p.ref).join(' + ')}\n` +
                    `  Overpaid : $${((approvedCount - 1) * 1000).toFixed(2)}\n` +
                    `  Root Cause: ERP checks duplicate approval per payment ID (E2888) but not per bill.\n` +
                    `  Fix Required: Backend must reject approval of any payment if bill.paid_amount >= bill.total.`
                );
            }
        }

        console.log(`[PASS] Integrity Guardrail: System blocked duplicate payment approval.`);
    });

    test('Guardrail: System must enforce thread-safe serialization for stock additions', async ({ page , request }) => {
        const app = new AppManager(page);
        await apiLogin(request);
        const meta = sharedMeta;
        const item = sharedItem;

        console.log(`[STEP 1] Capturing Baseline for "${item.itemName}"...`);
        const startStock = item.currentStock;

        const bill1 = await app.api.purchase.createBillAPI({ itemData: item, quantity: 5, vendorId: meta.vendorId });
        const bill2 = await app.api.purchase.createBillAPI({ itemData: item, quantity: 5, vendorId: meta.vendorId });

        console.log(`[ATTACK] Triggering Concurrent Stock Increase (Approval Race)...`);
        await Promise.all([
            app.advanceDocumentAPI(bill1.id, 'bills'),
            app.advanceDocumentAPI(bill2.id, 'bills')
        ]);

        console.log(`[AUDIT] Verifying Stock Integrity...`);
        const expectedStock = startStock + 10;
        const finalStock = await app.api.inventory.pollStockAPI(item.itemId, expectedStock, item.locationId);

        console.log(`[SNAPSHOT] Start: ${startStock} | Expected: ${expectedStock} | Final: ${finalStock}`);

        if (finalStock !== expectedStock) {
            throw new Error(`[CRITICAL_LOGIC_BUG] Stock Desync: Concurrent approvals caused lost updates. Expected ${expectedStock}, found ${finalStock}.`);
        }

        expect(finalStock).toBe(expectedStock);
        console.log(`[PASS] Stock Addition is atomic and thread-safe.`);
    });
});
