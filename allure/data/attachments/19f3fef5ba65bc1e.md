# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory/inv-logic.spec.ts >> Location Transfer (Move Order) Audits @inventory @regression >> TC-02: Destination stock must increase by exact transfer quantity
- Location: tests/inventory/inv-logic.spec.ts:102:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 5
Received: 0
```

# Test source

```ts
  14  | 
  15  | 
  16  | /**
  17  |  * LOCATION TRANSFER (MOVE ORDER) AUDITS
  18  |  *
  19  |  * Uses the dedicated /api/move-orders endpoint — the same backend
  20  |  * that powers the UI at /move-orders/location-transfer/new.
  21  |  *
  22  |  * Test Coverage:
  23  |  * 1. Stock atomicity  — source decreases exactly by transfer qty
  24  |  * 2. Destination gain — destination receives exactly transfer qty
  25  |  * 3. Conservation     — total stock across both locations is unchanged
  26  |  * 4. Zero qty guard   — move order with qty=0 must be rejected by API
  27  |  * 5. Excess qty guard — move order exceeding available stock must be rejected
  28  |  */
  29  | 
  30  | test.describe('Location Transfer (Move Order) Audits @inventory @regression', () => {
  31  | 
  32  |     let app: AppManager;
  33  |     let item: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;
  34  |     let destLocationId: string;
  35  |     let destWarehouseId: string;
  36  |     let srcStockBefore: number;
  37  |     let destStockBefore: number;
  38  | 
  39  |     test.beforeEach(async () => {
  40  |         test.setTimeout(240000);
  41  |     });
  42  | 
  43  |     test.beforeAll(async ({ browser }) => {
  44  |         test.setTimeout(240000);
  45  |         const page = await browser.newPage();
  46  |         app = new AppManager(page);
  47  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  48  | 
  49  |         item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'FIFO', quantity: 30, unit_cost: 100 });
  50  |         if (!item) throw new Error('[SETUP] No item with minStock=10 found.');
  51  | 
  52  |         // TC-04 and TC-05 only need item + source location — destination resolved best-effort
  53  |         try {
  54  |             const dest = await app.api.inventory.ensureTransferDestinationAPI(item.locationId!, item.itemId);
  55  |             destLocationId  = dest.locationId;
  56  |             destWarehouseId = dest.warehouseId;
  57  |         } catch (e: any) {
  58  |             console.log(`[SETUP] Destination location unavailable: ${e.message}`);
  59  |             // destLocationId stays undefined — TC-01/02/03 will skip, TC-04/05 run fine
  60  |         }
  61  | 
  62  |         // Snapshot stock at both locations before any transfer
  63  |         const srcDetails  = await app.api.inventory.getItemDetailsAPI(item.itemId, item.locationId);
  64  |         const destDetails = destLocationId ? await app.api.inventory.getItemDetailsAPI(item.itemId, destLocationId) : null;
  65  |         srcStockBefore  = srcDetails?.currentStock  ?? item.currentStock;
  66  |         destStockBefore = destDetails?.currentStock ?? 0;
  67  | 
  68  |         console.log(`[SETUP] Item: "${item.itemName}" | Src stock: ${srcStockBefore} | Dest stock: ${destStockBefore}`);
  69  |         console.log(`[SETUP] Src loc: ${item.locationId} | Dest loc: ${destLocationId ?? 'N/A (single-location env)'}`);
  70  |     });
  71  | 
  72  |     test('TC-01: Source stock must decrease by exact transfer quantity', async () => {
  73  |         if (!destLocationId) {
  74  |             try {
  75  |                 const dest = await app.api.inventory.ensureTransferDestinationAPI(item.locationId!, item.itemId);
  76  |                 destLocationId = dest.locationId;
  77  |                 destWarehouseId = dest.warehouseId;
  78  |             } catch (e: any) {
  79  |                 console.log('[WARN] Single-location environment — transfer test verified API setup.');
  80  |                 return;
  81  |             }
  82  |         }
  83  |         const qty = 5;
  84  | 
  85  |         await app.api.inventory.createMoveOrderAPI({
  86  |             itemId:          item.itemId,
  87  |             quantity:        qty,
  88  |             fromLocationId:  item.locationId!,
  89  |             fromWarehouseId: item.warehouseId!,
  90  |             toLocationId:    destLocationId,
  91  |             toWarehouseId:   destWarehouseId
  92  |         });
  93  | 
  94  |         const finalSrc = await app.api.inventory.pollStockAPI(item.itemId, srcStockBefore - qty, item.locationId);
  95  |         console.log(`[TC-01] Source: ${srcStockBefore} → ${finalSrc} (expected: ${srcStockBefore - qty})`);
  96  |         expect(finalSrc).toBe(srcStockBefore - qty);
  97  | 
  98  |         // Update snapshot for next tests
  99  |         srcStockBefore = finalSrc;
  100 |     });
  101 | 
  102 |     test('TC-02: Destination stock must increase by exact transfer quantity', async () => {
  103 |         if (!destLocationId) {
  104 |             console.log('[WARN] Single-location environment — transfer test verified API setup.');
  105 |             return;
  106 |         }
  107 |         const qty = 5;
  108 |         const expectedDest = destStockBefore + qty;
  109 | 
  110 |         // Poll destination until stock propagates — the move order credits destination
  111 |         // asynchronously after debiting the source, so we must wait rather than snapshot immediately.
  112 |         const finalDest = await app.api.inventory.pollStockAPI(item.itemId, expectedDest, destLocationId);
  113 |         console.log(`[TC-02] Dest: ${destStockBefore} → ${finalDest} (expected: ${expectedDest})`);
> 114 |         expect(finalDest).toBe(expectedDest);
      |                           ^ Error: expect(received).toBe(expected) // Object.is equality
  115 | 
  116 |         // Update snapshot for next tests
  117 |         destStockBefore = finalDest;
  118 |     });
  119 | 
  120 |     test('TC-03: Total stock conservation — sum across locations unchanged', async () => {
  121 |         if (!destLocationId) {
  122 |             console.log('[WARN] Single-location environment — transfer test verified API setup.');
  123 |             return;
  124 |         }
  125 |         const qty = 3;
  126 |         const totalBefore = srcStockBefore + destStockBefore;
  127 | 
  128 |         await app.api.inventory.createMoveOrderAPI({
  129 |             itemId:          item.itemId,
  130 |             quantity:        qty,
  131 |             fromLocationId:  item.locationId!,
  132 |             fromWarehouseId: item.warehouseId!,
  133 |             toLocationId:    destLocationId,
  134 |             toWarehouseId:   destWarehouseId
  135 |         });
  136 | 
  137 |         await app.api.inventory.pollStockAPI(item.itemId, srcStockBefore - qty, item.locationId);
  138 |         const srcFinal  = (await app.api.inventory.getItemDetailsAPI(item.itemId, item.locationId))?.currentStock ?? 0;
  139 |         const destFinal = (await app.api.inventory.getItemDetailsAPI(item.itemId, destLocationId))?.currentStock ?? 0;
  140 |         const totalAfter = srcFinal + destFinal;
  141 | 
  142 |         console.log(`[TC-03] Total before: ${totalBefore} | Total after: ${totalAfter} | Src: ${srcFinal} | Dest: ${destFinal}`);
  143 |         expect(totalAfter).toBe(totalBefore);
  144 | 
  145 |         srcStockBefore  = srcFinal;
  146 |         destStockBefore = destFinal;
  147 |     });
  148 | 
  149 |     test('TC-04: Move order with quantity=0 must be rejected', async () => {
  150 |         const { apiBase, headers, qs } = await app.buildApiContext();
  151 |         // Use source location as destination placeholder — rejection should happen before location validation
  152 |         const effectiveDest = destLocationId ?? item.locationId!;
  153 |         const effectiveDestWh = destWarehouseId ?? item.warehouseId!;
  154 |         const resp = await app.page.request.post(`${apiBase}/move-orders?${qs}`, {
  155 |             headers,
  156 |             data: {
  157 |                 inventory_item_id:        item.itemId,
  158 |                 quantity:                 0,
  159 |                 from_warehouse_id:        item.warehouseId,
  160 |                 from_location_id:         item.locationId,
  161 |                 destination_warehouse_id: effectiveDestWh,
  162 |                 destination_location_id:  effectiveDest
  163 |             }
  164 |         });
  165 |         console.log(`[TC-04] Zero qty response: ${resp.status()}`);
  166 |         expect(resp.status()).toBeGreaterThanOrEqual(400);
  167 |     });
  168 | 
  169 |     test('TC-05: Move order exceeding available stock must be rejected', async () => {
  170 |         const excessQty = srcStockBefore + 9999;
  171 |         const { apiBase, headers, qs } = await app.buildApiContext();
  172 |         const effectiveDest = destLocationId ?? item.locationId!;
  173 |         const effectiveDestWh = destWarehouseId ?? item.warehouseId!;
  174 |         const resp = await app.page.request.post(`${apiBase}/move-orders?${qs}`, {
  175 |             headers,
  176 |             data: {
  177 |                 inventory_item_id:        item.itemId,
  178 |                 quantity:                 excessQty,
  179 |                 from_warehouse_id:        item.warehouseId,
  180 |                 from_location_id:         item.locationId,
  181 |                 destination_warehouse_id: effectiveDestWh,
  182 |                 destination_location_id:  effectiveDest
  183 |             }
  184 |         });
  185 |         const body = await resp.text();
  186 |         console.log(`[TC-05] Excess qty (${excessQty}) response: ${resp.status()} | ${body.substring(0, 120)}`);
  187 |         expect(resp.status()).toBeGreaterThanOrEqual(400);
  188 |     });
  189 | });
  190 | 
```