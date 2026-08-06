# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory/inv-costing-audit.spec.ts >> FIFO Write-Down & Sell-Through Audit @inventory @costing @regression @full >> Audit: FIFO cost advances correctly through write-downs and multi-stage sales
- Location: tests/inventory/inv-costing-audit.spec.ts:28:7

# Error details

```
Error: PO item id must exist

expect(received).toBeTruthy()

Received: undefined
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "BM Tech" [ref=e10]: BT
        - generic [ref=e11]:
          - button "BM Tech" [ref=e12] [cursor=pointer]:
            - generic: BM Tech
            - img [ref=e14]
          - generic [ref=e16] [cursor=pointer]:
            - button "Company Detail" [ref=e17]:
              - img [ref=e18]
            - button "Edit Company" [ref=e21]:
              - img [ref=e22]
            - button "Company Detail" [ref=e25]:
              - img [ref=e26]
      - generic [ref=e29]:
        - button "New" [ref=e30] [cursor=pointer]:
          - text: New
          - img [ref=e32]
        - generic [ref=e36] [cursor=pointer]:
          - generic [ref=e37]: "5"
          - img "Notifications" [ref=e38]
        - button "EC" [ref=e41] [cursor=pointer]:
          - img [ref=e42]
          - paragraph [ref=e44]: EC
        - button [ref=e45] [cursor=pointer]:
          - img [ref=e46]
        - generic [ref=e49] [cursor=pointer]:
          - img "System" [ref=e51]: S
          - generic [ref=e52]:
            - generic [ref=e53]: System
            - paragraph [ref=e54]: IT Administrator / User Manager
    - generic [ref=e56]:
      - generic [ref=e58]:
        - generic [ref=e59]:
          - img "BM Tech" [ref=e62]: BT
          - paragraph [ref=e63]: Welcome, System
        - paragraph [ref=e65]: From meticulous bookkeeping to seamless inventory control, we've got your back.
        - generic [ref=e66]:
          - link "Dashboard" [ref=e67] [cursor=pointer]:
            - /url: /dashboard
          - link "Settings" [ref=e68] [cursor=pointer]:
            - /url: /settings/company/details
        - generic [ref=e69]:
          - link "Add Customer" [ref=e70] [cursor=pointer]:
            - /url: /receivables/customers/new
            - img [ref=e73]
            - text: Add Customer
          - link "Add Invoice" [ref=e74] [cursor=pointer]:
            - /url: /receivables/invoices/new
            - img [ref=e77]
            - text: Add Invoice
          - link "Add Receipt" [ref=e78] [cursor=pointer]:
            - /url: /receivables/receipts/new
            - img [ref=e81]
            - text: Add Receipt
          - link "Add Sales Order" [ref=e82] [cursor=pointer]:
            - /url: /receivables/sale-orders/new
            - img [ref=e85]
            - text: Add Sales Order
        - paragraph [ref=e87]: Quick Access
        - generic [ref=e88]:
          - generic [ref=e89]:
            - link "Sales Sales" [ref=e91] [cursor=pointer]:
              - /url: /receivables/overview/
              - button "Sales Sales" [ref=e92]:
                - generic [ref=e93]:
                  - img "Sales" [ref=e94]
                  - paragraph [ref=e95]: Sales
            - link "Purchase Purchase" [ref=e97] [cursor=pointer]:
              - /url: /payables/overview/
              - button "Purchase Purchase" [ref=e98]:
                - generic [ref=e99]:
                  - img "Purchase" [ref=e100]
                  - paragraph [ref=e101]: Purchase
            - link "Accounting Accounting" [ref=e103] [cursor=pointer]:
              - /url: /accounting/overview
              - button "Accounting Accounting" [ref=e104]:
                - generic [ref=e105]:
                  - img "Accounting" [ref=e106]
                  - paragraph [ref=e107]: Accounting
            - link "Leases Leases" [ref=e109] [cursor=pointer]:
              - /url: /leases/leases/?page=1&pageSize=15
              - button "Leases Leases" [ref=e110]:
                - generic [ref=e111]:
                  - img "Leases" [ref=e112]
                  - paragraph [ref=e113]: Leases
            - link "Assets Assets" [ref=e115] [cursor=pointer]:
              - /url: /assets/overview
              - button "Assets Assets" [ref=e116]:
                - generic [ref=e117]:
                  - img "Assets" [ref=e118]
                  - paragraph [ref=e119]: Assets
            - link "Budgets Budgets" [ref=e121] [cursor=pointer]:
              - /url: /public-sector-budgets/overview
              - button "Budgets Budgets" [ref=e122]:
                - generic [ref=e123]:
                  - img "Budgets" [ref=e124]
                  - paragraph [ref=e125]: Budgets
            - link "Payroll Payroll" [ref=e127] [cursor=pointer]:
              - /url: /payrolls
              - button "Payroll Payroll" [ref=e128]:
                - generic [ref=e129]:
                  - img "Payroll" [ref=e130]
                  - paragraph [ref=e131]: Payroll
            - link "Report Report" [ref=e133] [cursor=pointer]:
              - /url: /reports
              - button "Report Report" [ref=e134]:
                - generic [ref=e135]:
                  - img "Report" [ref=e136]
                  - paragraph [ref=e137]: Report
          - button "View All" [ref=e138] [cursor=pointer]:
            - text: View All
            - img [ref=e140]
      - img "Floating Icon" [ref=e143]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { AppManager } from '../../pages/AppManager';
  3   | 
  4   | 
  5   | /**
  6   |  * FIFO COSTING FORENSIC AUDIT — Write-Down & Sell-Through Stages
  7   |  *
  8   |  * Unique coverage (not in inv-fifo-layers.spec.ts):
  9   |  *   - Stock write-down preserves correct FIFO master cost
  10  |  *   - Multi-stage sell-through advances master cost across layers
  11  |  *   - Final remaining stock reflects deepest layer cost
  12  |  *
  13  |  * Layer setup (PO receipt path — only mechanism that creates real FIFO layers):
  14  |  *   Layer 1 (import):      10 units @ $100  → total 10
  15  |  *   Layer 2 (PO receipt):  10 units @ $200  → total 20
  16  |  *   Layer 3 (PO receipt):  10 units @ $300  → total 30
  17  |  *
  18  |  * Stage A — sell 10: drain L1 fully → COGS = 10×$100 = $1000, master cost → $200
  19  |  * Stage B — write-down 5 → remaining 15, master cost stays $200
  20  |  * Stage C — sell 10: drain L2 (5 left) + L3 (5) → COGS = 5×$200 + 5×$300 = $2500
  21  |  *            master cost → $300 (only L3 remains)
  22  |  * Stage D — verify final: 5 units @ $300
  23  |  */
  24  | 
  25  | test.describe('FIFO Write-Down & Sell-Through Audit @inventory @costing @regression @full', () => {
  26  |   test.setTimeout(300000);
  27  | 
  28  |   test('Audit: FIFO cost advances correctly through write-downs and multi-stage sales', async ({ page }) => {
  29  |     const app = new AppManager(page);
  30  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  31  | 
  32  | 
  33  |     const h = {
  34  |       'Authorization': `Bearer ${await app._getAuthToken()}`,
  35  |       'x-company': process.env.BEFFA_COMPANY as string,
  36  |       'Content-Type': 'application/json',
  37  |     };
  38  |     const p = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  39  | 
  40  |     const envMeta   = await app.api.inventory.discoverMetadataAPI();
  41  |     const salesMeta = await app.api.sales.discoverMetadataAPI();
  42  |     const purchMeta = await app.api.purchase.discoverMetadataAPI();
  43  | 
  44  |     const acctJson = await (await page.request.get(`${app.apiBase}/accounts?page=1&pageSize=50&${p}`, { headers: h })).json();
  45  |     const accounts: any[] = acctJson.items || acctJson.data || [];
  46  |     const apAccount = accounts.find((a: any) => /payable/i.test(a.account_type || '')) || accounts[0];
  47  |     const glAccount = accounts.find((a: any) => /expense/i.test(a.account_type || '')) || accounts[1] || accounts[0];
  48  | 
  49  |     const vendorJson = await (await page.request.get(`${app.apiBase}/vendors?page=1&pageSize=10&${p}`, { headers: h })).json();
  50  |     const vendor = (vendorJson.data || vendorJson.items || [])[0];
  51  |     expect(vendor, 'A vendor must exist').toBeTruthy();
  52  | 
  53  |     // PO receipt → creates a real FIFO cost layer at the given unitPrice
  54  |     const addPoReceiptLayer = async (itemId: string, qty: number, unitPrice: number): Promise<void> => {
  55  |       const poResp = await page.request.post(`${app.apiBase}/purchase-orders?${p}`, {
  56  |         headers: h,
  57  |         data: {          vendor_id: vendor.id,
  58  |           accounts_payable_id: apAccount?.id,
  59  |           currency_id: purchMeta.currencyId,          po_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
  60  |           delivery_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
  61  |           status: 'draft',
  62  |           purchase_type_id: 4,
  63  |           po_items: [{
  64  |             item_id: itemId,
  65  |             quantity: qty,
  66  |             unit_price: unitPrice,
  67  |             general_ledger_account_id: glAccount?.id,
  68  |             warehouse_id: envMeta.warehouseId,
  69  |             location_id: envMeta.locationId,
  70  |             description: `FIFO layer ${qty}@$${unitPrice}`,
  71  |           }],
  72  |         },
  73  |       });
  74  |       expect(poResp.ok(), `PO failed: ${await poResp.text()}`).toBe(true);
  75  |       const poJson = await poResp.json();
  76  |       const poId   = poJson.id;
  77  |       await app.advanceDocumentAPI(poId, 'purchase-orders');
  78  | 
  79  |       const poDetail   = await (await page.request.get(`${app.apiBase}/purchase-order/${poId}?${p}`, { headers: h })).json();
  80  |       let poItemId = (poDetail.po_items || []).find((i: any) => i.id)?.id;
  81  |       if (!poItemId) {
  82  |         const subResp = await page.request.get(`${app.apiBase}/purchase-orders/${poId}/items?${p}`, { headers: h });
  83  |         if (subResp.ok()) {
  84  |           const subData = await subResp.json();
  85  |           poItemId = (subData.data || subData.items || []).find((i: any) => i.id)?.id;
  86  |         }
  87  |       }
> 88  |       expect(poItemId, 'PO item id must exist').toBeTruthy();
      |                                                 ^ Error: PO item id must exist
  89  | 
  90  |       const billResp = await page.request.post(`${app.apiBase}/bills?${p}`, {
  91  |         headers: h,
  92  |         data: {
  93  |           vendor_id: vendor.id,
  94  |           accounts_payable_id: apAccount?.id,
  95  |           currency_id: purchMeta.currencyId,
  96  |           purchase_order_id: poId,
  97  |           invoice_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
  98  |           due_date:     (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
  99  |           status: 'draft',
  100 |           items: [],
  101 |           received_purchase_order_items: [{ po_item_id: poItemId, received_quantity: qty, received_unit_price: unitPrice }],
  102 |         },
  103 |       });
  104 |       expect(billResp.ok(), `Bill failed: ${await billResp.text()}`).toBe(true);
  105 |       await app.advanceDocumentAPI((await billResp.json()).id, 'bills');
  106 |     };
  107 | 
  108 |     const sell = async (itemId: string, qty: number): Promise<string> => {
  109 |       const inv = await app.api.sales.createStandaloneInvoiceAPI({
  110 |         customerId: salesMeta.customerId,
  111 |         itemId,
  112 |         quantity: qty,
  113 |         unitPrice: 500,
  114 |         locationId: envMeta.locationId,
  115 |         warehouseId: envMeta.warehouseId,
  116 |       });
  117 |       await app.advanceDocumentAPI(inv.id, 'invoices');
  118 |       return inv.id;
  119 |     };
  120 | 
  121 |     const getCogs = async (invoiceId: string): Promise<number> => {
  122 |       const journals = await app.api.inventory.getJournalEntriesAPI(invoiceId);
  123 |       const top = journals.filter(j => parseFloat(j.debit) > 0).sort((a, b) => parseFloat(b.debit) - parseFloat(a.debit))[0];
  124 |       return parseFloat(top?.debit || '0');
  125 |     };
  126 | 
  127 |     // ── Setup: build 3-layer item ─────────────────────────────────────────────
  128 |     console.log('[SETUP] Creating FIFO item with 3 PO receipt layers...');
  129 |     const itemCode = `FIFO-COSTING-${Date.now()}`;
  130 |     const item = await app.api.inventory.createInventoryItemAPI({
  131 |       name: itemCode, item_id: itemCode,
  132 |       part_number: `PN-${Date.now().toString().slice(-5)}`,
  133 |       item_class: 'MER', cost_method_code: 'FIFO',
  134 |       quantity: 10, unit_cost: 100,
  135 |       default_location_id: envMeta.locationId,
  136 |       default_warehouse_id: envMeta.warehouseId,
  137 |     });
  138 |     await app.api.inventory.pollStockAPI(item.id, 10, envMeta.locationId);
  139 |     await addPoReceiptLayer(item.id, 10, 200);
  140 |     await app.api.inventory.pollStockAPI(item.id, 20, envMeta.locationId);
  141 |     await addPoReceiptLayer(item.id, 10, 300);
  142 |     await app.api.inventory.pollStockAPI(item.id, 30, envMeta.locationId);
  143 | 
  144 |     const setup = await app.api.inventory.getItemDetailsAPI(item.id, envMeta.locationId);
  145 |     console.log(`[SETUP] Layers built: 10@$100 + 10@$200 + 10@$300 | Stock=${setup?.currentStock} MasterCost=$${setup?.unitCost}`);
  146 |     expect(setup?.currentStock).toBe(30);
  147 |     expect(setup?.unitCost).toBe(100); // FIFO master = oldest layer
  148 | 
  149 |     // ── Stage A: Sell 10 — exhausts L1 ───────────────────────────────────────
  150 |     console.log('[STAGE A] Sell 10 → drain L1 (10@$100=$1000)');
  151 |     const invA = await sell(item.id, 10);
  152 |     await app.api.inventory.pollStockAPI(item.id, 20, envMeta.locationId);
  153 |     const cogsA = await getCogs(invA);
  154 |     console.log(`[STAGE A] COGS: $${cogsA} (Expect: $1000)`);
  155 |     expect(cogsA).toBeCloseTo(1000, 2);
  156 |     const stateA = await app.api.inventory.getItemDetailsAPI(item.id, envMeta.locationId);
  157 |     console.log(`[STAGE A] Stock: ${stateA?.currentStock} @ $${stateA?.unitCost} (Expect: 20 @ $200)`);
  158 |     expect(stateA?.currentStock).toBe(20);
  159 |     expect(stateA?.unitCost).toBe(200); // L1 gone → master advances to L2
  160 | 
  161 |     // ── Stage B: Write-down 5 units ───────────────────────────────────────────
  162 |     console.log('[STAGE B] Write-down 5 units → cost must stay at $200');
  163 |     const adjLoss = await app.api.inventory.createInventoryAdjustmentAPI({
  164 |       itemId: item.id, quantity: 5, isWriteDown: true,
  165 |       warehouseId: envMeta.warehouseId, locationId: envMeta.locationId,
  166 |     });
  167 |     if (adjLoss.id) {
  168 |       await app.advanceDocumentAPI(adjLoss.id, 'inventory-adjustments');
  169 |       await app.api.inventory.processAdjustmentAPI(adjLoss.id);
  170 |     }
  171 |     await app.api.inventory.pollStockAPI(item.id, 15, envMeta.locationId);
  172 |     const stateB = await app.api.inventory.getItemDetailsAPI(item.id, envMeta.locationId);
  173 |     console.log(`[STAGE B] Stock: ${stateB?.currentStock} @ $${stateB?.unitCost} (Expect: 15 @ $200)`);
  174 |     expect(stateB?.currentStock).toBe(15);
  175 |     expect(stateB?.unitCost).toBe(200); // write-down must NOT change master cost
  176 | 
  177 |     // ── Stage C: Sell 10 — drains rest of L2 (5) + start of L3 (5) ──────────
  178 |     // L2 remaining after write-down: 10 - 5 = 5 units @ $200
  179 |     // Then 5 from L3 @ $300 → COGS = 5×$200 + 5×$300 = $2500
  180 |     console.log('[STAGE C] Sell 10 → drain L2 remainder (5@$200) + L3 (5@$300) = $2500');
  181 |     const invC = await sell(item.id, 10);
  182 |     await app.api.inventory.pollStockAPI(item.id, 5, envMeta.locationId);
  183 |     const cogsC = await getCogs(invC);
  184 |     console.log(`[STAGE C] COGS: $${cogsC} (Expect: $2500)`);
  185 |     expect(cogsC).toBeCloseTo(2500, 2);
  186 |     const stateC = await app.api.inventory.getItemDetailsAPI(item.id, envMeta.locationId);
  187 |     console.log(`[STAGE C] Stock: ${stateC?.currentStock} @ $${stateC?.unitCost} (Expect: 5 @ $300)`);
  188 |     expect(stateC?.currentStock).toBe(5);
```