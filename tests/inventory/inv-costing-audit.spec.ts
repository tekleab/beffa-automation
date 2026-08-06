import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';


/**
 * FIFO COSTING FORENSIC AUDIT — Write-Down & Sell-Through Stages
 *
 * Unique coverage (not in inv-fifo-layers.spec.ts):
 *   - Stock write-down preserves correct FIFO master cost
 *   - Multi-stage sell-through advances master cost across layers
 *   - Final remaining stock reflects deepest layer cost
 *
 * Layer setup (PO receipt path — only mechanism that creates real FIFO layers):
 *   Layer 1 (import):      10 units @ $100  → total 10
 *   Layer 2 (PO receipt):  10 units @ $200  → total 20
 *   Layer 3 (PO receipt):  10 units @ $300  → total 30
 *
 * Stage A — sell 10: drain L1 fully → COGS = 10×$100 = $1000, master cost → $200
 * Stage B — write-down 5 → remaining 15, master cost stays $200
 * Stage C — sell 10: drain L2 (5 left) + L3 (5) → COGS = 5×$200 + 5×$300 = $2500
 *            master cost → $300 (only L3 remains)
 * Stage D — verify final: 5 units @ $300
 */

test.describe('FIFO Write-Down & Sell-Through Audit @inventory @costing @regression @full', () => {
  test.setTimeout(300000);

  test('Audit: FIFO cost advances correctly through write-downs and multi-stage sales', async ({ page }) => {
    const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);


    const h = {
      'Authorization': `Bearer ${await app._getAuthToken()}`,
      'x-company': process.env.BEFFA_COMPANY as string,
      'Content-Type': 'application/json',
    };
    const p = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

    const envMeta   = await app.api.inventory.discoverMetadataAPI();
    const salesMeta = await app.api.sales.discoverMetadataAPI();
    const purchMeta = await app.api.purchase.discoverMetadataAPI();

    const acctJson = await (await page.request.get(`${app.apiBase}/accounts?page=1&pageSize=50&${p}`, { headers: h })).json();
    const accounts: any[] = acctJson.items || acctJson.data || [];
    const apAccount = accounts.find((a: any) => /payable/i.test(a.account_type || '')) || accounts[0];
    const glAccount = accounts.find((a: any) => /expense/i.test(a.account_type || '')) || accounts[1] || accounts[0];

    const vendorJson = await (await page.request.get(`${app.apiBase}/vendors?page=1&pageSize=10&${p}`, { headers: h })).json();
    const vendor = (vendorJson.data || vendorJson.items || [])[0];
    expect(vendor, 'A vendor must exist').toBeTruthy();

    // PO receipt → creates a real FIFO cost layer at the given unitPrice
    const addPoReceiptLayer = async (itemId: string, qty: number, unitPrice: number): Promise<void> => {
      const poResp = await page.request.post(`${app.apiBase}/purchase-orders?${p}`, {
        headers: h,
        data: {          vendor_id: vendor.id,
          accounts_payable_id: apAccount?.id,
          currency_id: purchMeta.currencyId,          po_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
          delivery_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
          status: 'draft',
          purchase_type_id: 4,
          po_items: [{
            item_id: itemId,
            quantity: qty,
            unit_price: unitPrice,
            general_ledger_account_id: glAccount?.id,
            warehouse_id: envMeta.warehouseId,
            location_id: envMeta.locationId,
            description: `FIFO layer ${qty}@$${unitPrice}`,
          }],
        },
      });
      expect(poResp.ok(), `PO failed: ${await poResp.text()}`).toBe(true);
      const poJson = await poResp.json();
      const poId   = poJson.id;
      await app.advanceDocumentAPI(poId, 'purchase-orders');

      const poDetail   = await (await page.request.get(`${app.apiBase}/purchase-order/${poId}?${p}`, { headers: h })).json();
      const poItemId   = (poDetail.po_items || [])[0]?.id;
      expect(poItemId, 'PO item id must exist').toBeTruthy();

      const billResp = await page.request.post(`${app.apiBase}/bills?${p}`, {
        headers: h,
        data: {
          vendor_id: vendor.id,
          accounts_payable_id: apAccount?.id,
          currency_id: purchMeta.currencyId,
          purchase_order_id: poId,
          invoice_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
          due_date:     (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
          status: 'draft',
          items: [],
          received_purchase_order_items: [{ po_item_id: poItemId, received_quantity: qty, received_unit_price: unitPrice }],
        },
      });
      expect(billResp.ok(), `Bill failed: ${await billResp.text()}`).toBe(true);
      await app.advanceDocumentAPI((await billResp.json()).id, 'bills');
    };

    const sell = async (itemId: string, qty: number): Promise<string> => {
      const inv = await app.api.sales.createStandaloneInvoiceAPI({
        customerId: salesMeta.customerId,
        itemId,
        quantity: qty,
        unitPrice: 500,
        locationId: envMeta.locationId,
        warehouseId: envMeta.warehouseId,
      });
      await app.advanceDocumentAPI(inv.id, 'invoices');
      return inv.id;
    };

    const getCogs = async (invoiceId: string): Promise<number> => {
      const journals = await app.api.inventory.getJournalEntriesAPI(invoiceId);
      const top = journals.filter(j => parseFloat(j.debit) > 0).sort((a, b) => parseFloat(b.debit) - parseFloat(a.debit))[0];
      return parseFloat(top?.debit || '0');
    };

    // ── Setup: build 3-layer item ─────────────────────────────────────────────
    console.log('[SETUP] Creating FIFO item with 3 PO receipt layers...');
    const itemCode = `FIFO-COSTING-${Date.now()}`;
    const item = await app.api.inventory.createInventoryItemAPI({
      name: itemCode, item_id: itemCode,
      part_number: `PN-${Date.now().toString().slice(-5)}`,
      item_class: 'MER', cost_method_code: 'FIFO',
      quantity: 10, unit_cost: 100,
      default_location_id: envMeta.locationId,
      default_warehouse_id: envMeta.warehouseId,
    });
    await app.api.inventory.pollStockAPI(item.id, 10, envMeta.locationId);
    await addPoReceiptLayer(item.id, 10, 200);
    await app.api.inventory.pollStockAPI(item.id, 20, envMeta.locationId);
    await addPoReceiptLayer(item.id, 10, 300);
    await app.api.inventory.pollStockAPI(item.id, 30, envMeta.locationId);

    const setup = await app.api.inventory.getItemDetailsAPI(item.id, envMeta.locationId);
    console.log(`[SETUP] Layers built: 10@$100 + 10@$200 + 10@$300 | Stock=${setup?.currentStock} MasterCost=$${setup?.unitCost}`);
    expect(setup?.currentStock).toBe(30);
    expect(setup?.unitCost).toBe(100); // FIFO master = oldest layer

    // ── Stage A: Sell 10 — exhausts L1 ───────────────────────────────────────
    console.log('[STAGE A] Sell 10 → drain L1 (10@$100=$1000)');
    const invA = await sell(item.id, 10);
    await app.api.inventory.pollStockAPI(item.id, 20, envMeta.locationId);
    const cogsA = await getCogs(invA);
    console.log(`[STAGE A] COGS: $${cogsA} (Expect: $1000)`);
    expect(cogsA).toBeCloseTo(1000, 2);
    const stateA = await app.api.inventory.getItemDetailsAPI(item.id, envMeta.locationId);
    console.log(`[STAGE A] Stock: ${stateA?.currentStock} @ $${stateA?.unitCost} (Expect: 20 @ $200)`);
    expect(stateA?.currentStock).toBe(20);
    expect(stateA?.unitCost).toBe(200); // L1 gone → master advances to L2

    // ── Stage B: Write-down 5 units ───────────────────────────────────────────
    console.log('[STAGE B] Write-down 5 units → cost must stay at $200');
    const adjLoss = await app.api.inventory.createInventoryAdjustmentAPI({
      itemId: item.id, quantity: 5, isWriteDown: true,
      warehouseId: envMeta.warehouseId, locationId: envMeta.locationId,
    });
    if (adjLoss.id) {
      await app.advanceDocumentAPI(adjLoss.id, 'inventory-adjustments');
      await app.api.inventory.processAdjustmentAPI(adjLoss.id);
    }
    await app.api.inventory.pollStockAPI(item.id, 15, envMeta.locationId);
    const stateB = await app.api.inventory.getItemDetailsAPI(item.id, envMeta.locationId);
    console.log(`[STAGE B] Stock: ${stateB?.currentStock} @ $${stateB?.unitCost} (Expect: 15 @ $200)`);
    expect(stateB?.currentStock).toBe(15);
    expect(stateB?.unitCost).toBe(200); // write-down must NOT change master cost

    // ── Stage C: Sell 10 — drains rest of L2 (5) + start of L3 (5) ──────────
    // L2 remaining after write-down: 10 - 5 = 5 units @ $200
    // Then 5 from L3 @ $300 → COGS = 5×$200 + 5×$300 = $2500
    console.log('[STAGE C] Sell 10 → drain L2 remainder (5@$200) + L3 (5@$300) = $2500');
    const invC = await sell(item.id, 10);
    await app.api.inventory.pollStockAPI(item.id, 5, envMeta.locationId);
    const cogsC = await getCogs(invC);
    console.log(`[STAGE C] COGS: $${cogsC} (Expect: $2500)`);
    expect(cogsC).toBeCloseTo(2500, 2);
    const stateC = await app.api.inventory.getItemDetailsAPI(item.id, envMeta.locationId);
    console.log(`[STAGE C] Stock: ${stateC?.currentStock} @ $${stateC?.unitCost} (Expect: 5 @ $300)`);
    expect(stateC?.currentStock).toBe(5);
    expect(stateC?.unitCost).toBe(300); // only L3 remains

    console.log('[PASS] ✅ FIFO costing: write-down preserved cost, sell-through advanced layers correctly.');
  });
});
