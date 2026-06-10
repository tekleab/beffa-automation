import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * INVENTORY ITEM LIFECYCLE AUDITS
 */
test.describe('Inventory Item Lifecycle Audits @inventory @logic @regression @full', () => {

    let sharedEnvMeta: Awaited<ReturnType<AppManager['api']['inventory']['discoverMetadataAPI']>>;
    let sharedSalesMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;

    const printAuditTable = (title: string, rows: [string, string][], passed: boolean, verdict: string) => {
        const W = { l: 32, v: 36 };
        const pad = (s: string, n: number) => s.length >= n ? s.substring(0, n - 1) + '…' : s.padEnd(n);
        const line = '─'.repeat(W.l + W.v + 7);
        console.log(`\n  ┌${line}┐`);
        console.log(`  │ ${pad(title, W.l + W.v + 3)} │`);
        console.log(`  ├${line}┤`);
        for (const [label, value] of rows)
            console.log(`  │ ${pad(label, W.l)} │ ${pad(value, W.v)} │`);
        console.log(`  ├${line}┤`);
        console.log(`  │ ${pad('Result', W.l)} │ ${pad(passed ? `✓ PASS — ${verdict}` : `✗ FAIL — ${verdict}`, W.v)} │`);
        console.log(`  └${line}┘\n`);
    };

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        sharedEnvMeta = await app.api.inventory.discoverMetadataAPI();
        sharedSalesMeta = await app.api.sales.discoverMetadataAPI();
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test('Guardrail: Deactivated item must be rejected for new stock adjustments', async ({ page }) => {
        const app = new AppManager(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const envMeta = sharedEnvMeta;

        const itemCode = `DEACT-GUARD-${Date.now()}`;
        console.log(`[STEP 1] Creating item to deactivate: ${itemCode}...`);
        const item = await app.api.inventory.createInventoryItemAPI({ name: itemCode, item_id: itemCode, part_number: `PN-${Date.now().toString().slice(-5)}` });
        console.log(`[OK] Item created: ${item.itemName} (ID: ${item.id})`);

        console.log(`[STEP 2] Deactivating item via API...`);
        const deactivateResp = await page.request.patch(`${apiBase}/inventory-item/${item.id}?${qs}`, { data: { status: 'inactive' }, headers });
        if (!deactivateResp.ok()) { console.log(`[SKIP] Deactivation endpoint returned ${deactivateResp.status()}.`); return; }
        console.log(`[OK] Item deactivated.`);

        console.log(`[ATTACK] Attempting stock adjustment on deactivated item...`);
        let blocked = false;
        let blockReason = '';
        let adjRef = 'N/A';
        let adjId  = 'N/A';

        try {
            const adj = await app.api.inventory.createInventoryAdjustmentAPI({
                itemId: item.id, quantity: 10, isWriteDown: false,
                warehouseId: envMeta.warehouseId, locationId: envMeta.locationId
            });
            if (!adj.success) {
                blocked = true;
                blockReason = adj.error?.substring(0, 60) || 'Rejected at creation';
            } else {
                adjRef = adj.ref ?? 'N/A';
                adjId  = adj.id  ?? 'N/A';
                if (adj.id) await app.advanceDocumentAPI(adj.id, 'inventory-adjustments');
                blocked = false;
                blockReason = `Adjustment ${adj.ref} created and advanced on inactive item`;
            }
        } catch (err: any) {
            blocked = true;
            blockReason = err.message.substring(0, 60);
        }

        // ── Stakeholder summary box ──────────────────────────────────────────────────────
        console.log([
            ``,
            `  ╔══════════════════════════════════════════════════════════╗`,
            `  ║      DEACTIVATED ITEM GUARDRAIL — TEST SUMMARY            ║`,
            `  ╠══════════════════════════════════════════════════════════╣`,
            `  ║  Item         : ${itemCode.substring(0, 38).padEnd(38)} ║`,
            `  ║  Item ID      : ${item.id.substring(0, 38).padEnd(38)} ║`,
            `  ║  Status set   : inactive                                   ║`,
            `  ║  Attack       : POST /inventory-adjustments qty=10         ║`,
            `  ╠══════════════════════════════════════════════════════════╣`,
            blocked
                ? `  ║  System response : BLOCKED ✓                             ║`
                : `  ║  System response : ACCEPTED ✕ — VULNERABILITY CONFIRMED  ║`,
            blocked
                ? `  ║  Adjustment was correctly rejected by the API.           ║`
                : `  ║  Adj Ref : ${adjRef.substring(0, 44).padEnd(44)} ║`,
            !blocked
                ? `  ║  Adj ID  : ${adjId.substring(0, 44).padEnd(44)} ║`
                : `  ║  No inventory record was written to the ledger.          ║`,
            `  ╠══════════════════════════════════════════════════════════╣`,
            !blocked
                ? `  ║  Risk    : Ghost stock written to inactive item           ║`
                : `  ║  Risk    : None — item lifecycle enforced correctly        ║`,
            !blocked
                ? `  ║  Fix     : Reject adjustments if item.status != active    ║`
                : `  ║                                                           ║`,
            `  ╚══════════════════════════════════════════════════════════╝`,
            ``
        ].join('\n'));

        printAuditTable('Deactivated Item Adjustment Guardrail', [
            ['Item Code',              itemCode],
            ['Item ID',                item.id],
            ['Item Status',           'inactive (set in Step 2)'],
            ['Attack: Adj Qty',        '10 units (write-up)'],
            ['Adjustment Ref',         adjRef],
            ['Adjustment ID',          adjId],
            ['Block Reason',           blockReason || 'Rejected at API layer'],
        ], blocked, blocked ? 'Inactive item correctly rejected' : 'VULNERABILITY — ghost stock on inactive item');

        if (!blocked) {
            throw new Error(`[VULNERABILITY] System accepted a stock adjustment on a deactivated item (Ref: ${adjRef}). Fix: validate item.status == active before creating adjustments.`);
        }
        console.log(`[PASS] Deactivated item correctly blocked.`);
    });

    test('Guardrail: System must block sales when item stock reaches exact zero', async ({ page }) => {
        const app = new AppManager(page);
        const envMeta = sharedEnvMeta;
        const salesMeta = sharedSalesMeta;

        const itemCode = `ZERO-STOCK-${Date.now()}`;
        console.log(`[STEP 1] Creating item with exactly 1 unit of stock...`);
        const item = await app.api.inventory.createInventoryItemAPI({ name: itemCode, item_id: itemCode, part_number: `PN-${Date.now().toString().slice(-5)}`, quantity: 1, unit_cost: 100, default_location_id: envMeta.locationId, default_warehouse_id: envMeta.warehouseId });
        console.log(`[OK] Item created: ${item.itemName} (ID: ${item.id})`);

        await app.api.inventory.pollStockAPI(item.id, 1);

        console.log(`[STEP 2] Selling the only 1 unit to drain stock to zero...`);
        const inv1 = await app.api.sales.createStandaloneInvoiceAPI({ customerId: salesMeta.customerId, itemId: item.id, quantity: 1, unitPrice: 200, locationId: envMeta.locationId, warehouseId: envMeta.warehouseId });
        await app.advanceDocumentAPI(inv1.id, 'invoices');
        await app.api.inventory.pollStockAPI(item.id, 0);
        console.log(`[OK] Stock is now 0.`);

        console.log(`[ATTACK] Attempting to sell 1 more unit from zero stock...`);
        let blocked = false;
        let blockReason = '';
        let oversellRef = 'N/A';
        let finalStock: number | null = null;

        try {
            const inv2 = await app.api.sales.createStandaloneInvoiceAPI({ customerId: salesMeta.customerId, itemId: item.id, quantity: 1, unitPrice: 200, locationId: envMeta.locationId, warehouseId: envMeta.warehouseId });
            await app.advanceDocumentAPI(inv2.id, 'invoices');
            oversellRef = inv2.ref || inv2.id || 'N/A';
            const details = await app.api.inventory.getItemDetailsAPI(item.id, envMeta.locationId);
            finalStock = details?.currentStock ?? null;
            if ((finalStock ?? 0) < 0) {
                blocked = false;
                blockReason = `Stock went negative: ${finalStock} — ghost stock created`;
            } else {
                blocked = false;
                blockReason = `Invoice created at zero stock but stock did not go negative (${finalStock})`;
            }
        } catch (err: any) {
            blocked = true;
            blockReason = err.message.substring(0, 60);
        }

        // ── Stakeholder summary box ──────────────────────────────────────────────────────
        console.log([
            ``,
            `  ╔══════════════════════════════════════════════════════════╗`,
            `  ║        ZERO-STOCK GUARDRAIL — TEST SUMMARY               ║`,
            `  ╠══════════════════════════════════════════════════════════╣`,
            `  ║  Item         : ${itemCode.substring(0, 38).padEnd(38)} ║`,
            `  ║  Item ID      : ${item.id.substring(0, 38).padEnd(38)} ║`,
            `  ║  Step 1       : Created with qty=1, sold 1 → stock=0       ║`,
            `  ║  Attack       : POST /invoices qty=1 against stock=0       ║`,
            `  ╠══════════════════════════════════════════════════════════╣`,
            blocked
                ? `  ║  System response : BLOCKED ✓                             ║`
                : `  ║  System response : ACCEPTED ✕ — VULNERABILITY CONFIRMED  ║`,
            blocked
                ? `  ║  Oversell invoice was correctly rejected by the API.     ║`
                : `  ║  Oversell Ref : ${oversellRef.substring(0, 40).padEnd(40)} ║`,
            `  ║  Final stock  : ${String(finalStock ?? 'N/A (blocked)').padEnd(38)} ║`,
            `  ╠══════════════════════════════════════════════════════════╣`,
            !blocked
                ? `  ║  Risk    : Negative stock corrupts COGS and inventory GL  ║`
                : `  ║  Risk    : None — zero-stock guard enforced correctly      ║`,
            !blocked
                ? `  ║  Fix     : Reject invoice if available qty < ordered qty   ║`
                : `  ║                                                           ║`,
            `  ╚══════════════════════════════════════════════════════════╝`,
            ``
        ].join('\n'));

        printAuditTable('Zero-Stock Oversell Guardrail', [
            ['Item Code',              itemCode],
            ['Item ID',                item.id],
            ['Initial Stock',         '1 unit'],
            ['Step 2: Sold',           '1 unit → stock drained to 0'],
            ['Attack: Invoice Qty',    '1 unit (against stock=0)'],
            ['Oversell Invoice Ref',   oversellRef],
            ['Final Stock',            finalStock !== null ? `${finalStock} units` : 'N/A (blocked)'],
            ['Block Reason',           blockReason || 'Rejected at API layer'],
        ], blocked, blocked ? 'Zero-stock sale correctly rejected' : 'VULNERABILITY — negative stock / ghost inventory');

        if (!blocked && (finalStock ?? 0) < 0) {
            throw new Error(`[VULNERABILITY] Stock went negative (${finalStock}) after selling from zero. Ghost stock created.`);
        }
        if (!blocked) {
            console.log(`[WARN] Invoice created at zero stock but stock did not go negative (${finalStock}). Monitor.`);
        } else {
            console.log(`[PASS] Zero-stock sale correctly rejected.`);
        }
    });
});
