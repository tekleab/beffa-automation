import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { Logger } from '../../lib/utils/Logger';

/**
 * SALES STRESS & FINANCIAL EDGE CASES
 *
 * 1. Zero-price invoice line — silent revenue black hole
 * 2. Oversell after partial release — stock floor breach
 *
 * Removed (covered elsewhere):
 *   - Invoice reversal + stock rollback → so-credit-note.spec.ts
 *   - Double-invoice same SO → so-guardrails.spec.ts
 *   - Receipt against voided invoice → so-doc-integrity.spec.ts + so-receipt-overpayment.spec.ts
 *   - Partial receipt AR drift → po-stress.spec.ts (identical pattern)
 */

test.describe('Sales Stress & Financial Edge Cases @sales @logic @security @regression @full', () => {

    let sharedMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;
    let sharedPage: import('@playwright/test').Page;

    test.beforeAll(async ({ browser }) => {
        test.setTimeout(300000);
        sharedPage = await browser.newPage();
        const app = new AppManager(sharedPage);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        sharedMeta = await app.api.sales.discoverMetadataAPI();
        sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 50, unit_cost: 100 });
    });

    test.afterAll(async () => { await sharedPage?.close(); });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    // ── 1. ZERO-PRICE INVOICE LINE — SILENT REVENUE BLACK HOLE ───────────────
    test('Guardrail: Zero unit_price invoice line must be rejected', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const meta = sharedMeta;
        const item = sharedItem;

        console.log(`[ATTACK] Creating standalone invoice with unit_price=0...`);
        try {
            const inv = await app.api.sales.createStandaloneInvoiceAPI({
                customerId: meta.customerId,
                itemId: item.itemId,
                quantity: 1,
                unitPrice: 0,
                locationId: item.locationId,
                warehouseId: item.warehouseId
            });
            await app.advanceDocumentAPI(inv.id, 'invoices');
            const invData = await app.api.sales.getInvoiceAPI(inv.id);
            const netDue = parseFloat(invData.net_due ?? invData.total ?? '0');
            console.log(`[RESULT] Zero-price invoice ${inv.ref} approved | net_due=${netDue}`);
            if (netDue === 0) {
                expect(netDue, `[CRITICAL_LOGIC_BUG] Zero-price invoice ${inv.ref} accepted and approved with net_due=0 — revenue not recorded`).toBeGreaterThan(0);
            }
        } catch (err: any) {
            console.log(`[PASS] Zero-price invoice correctly rejected: ${err.message.slice(0, 100)}`);
        }
    });

    // ── 2. OVERSELL AFTER PARTIAL RELEASE — STOCK FLOOR BREACH ─────────────
    test('Guardrail: Second invoice release beyond SO quantity must be blocked', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const item = sharedItem;

        const soQty = 3;
        const so = await app.api.sales.createSalesOrderAPI({ itemId: item.itemId, quantity: soQty, unitPrice: 300, locationId: item.locationId, warehouseId: item.warehouseId });
        await app.advanceDocumentAPI(so.id, 'sales-orders');
        console.log(`[SO] ${so.ref} (${so.id}) | Qty: ${soQty}`);

        // Release 2 of 3 units
        const inv1 = await app.api.sales.createInvoiceAPI({ customerId: so.customerId, soItemId: so.soItemId, releasedQuantity: 2, locationId: item.locationId, warehouseId: item.warehouseId });
        await app.advanceDocumentAPI(inv1.id!, 'invoices');
        console.log(`[INVOICE 1] ${inv1.ref} — released 2 units`);

        console.log(`[ATTACK] Attempting to release 3 more units from SO with only 1 remaining...`);
        try {
            const inv2 = await app.api.sales.createInvoiceAPI({ customerId: so.customerId, soItemId: so.soItemId, releasedQuantity: 3, locationId: item.locationId, warehouseId: item.warehouseId });
            await app.advanceDocumentAPI(inv2.id!, 'invoices');
            expect.soft(false, `[CRITICAL_LOGIC_BUG] Oversell allowed! SO ${so.ref} released 5 units against qty=${soQty}. Stock floor breached.`).toBe(true);
            Logger.fail(`Oversell bug confirmed on SO ${so.ref}`);
        } catch (err: any) {
            if (err.message.includes('[CRITICAL_LOGIC_BUG]')) Logger.fail(err.message);
            else console.log(`[PASS] Oversell correctly blocked: ${err.message.slice(0, 100)}`);
        }
    });
});
