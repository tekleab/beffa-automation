# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory/inv-lifecycle.spec.ts >> Inventory Item Lifecycle Audits @inventory @logic @regression @full >> Guardrail: Deactivated item must be rejected for new stock adjustments
- Location: tests/inventory/inv-lifecycle.spec.ts:43:9

# Error details

```
Error: [VULNERABILITY] System accepted a stock adjustment on a deactivated item (Ref: ADJ/2026/08/18/004324). Fix: validate item.status == active before creating adjustments.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e6]
      - img [ref=e8]
      - generic [ref=e11]:
        - heading "Welcome to, befa" [level=3] [ref=e12]
        - paragraph [ref=e13]: Empower Your Finances, Simplify Your Success
        - paragraph [ref=e14]: From meticulous bookkeeping to seamless inventory control, we've got your back.
    - generic [ref=e16]:
      - heading "Login To Your Account" [level=2] [ref=e17]
      - generic [ref=e18]:
        - text: Not a member?
        - link "Register" [ref=e19] [cursor=pointer]:
          - /url: /users/register
      - generic [ref=e21]:
        - group [ref=e22]:
          - generic [ref=e23]: Email *
          - textbox "Email *" [ref=e25]:
            - /placeholder: Enter your email
        - group [ref=e26]:
          - generic [ref=e27]: Password *
          - generic [ref=e28]:
            - textbox "Password *" [ref=e29]:
              - /placeholder: Enter your password
            - button "Show password" [ref=e31] [cursor=pointer]:
              - img [ref=e32]
        - link "Forget Password?" [ref=e37] [cursor=pointer]:
          - /url: forget-password
        - button "Login" [ref=e39] [cursor=pointer]
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
  27  |     test.beforeAll(async ({ browser }) => {
  28  |         const page = await browser.newPage();
  29  |         const app = new AppManager(page);
  30  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  31  | 
  32  |         sharedEnvMeta = await app.api.inventory.discoverMetadataAPI();
  33  |         sharedSalesMeta = await app.api.sales.discoverMetadataAPI();
  34  |         await page.close();
  35  |     });
  36  | 
  37  |     test.beforeEach(async ({ page }) => {
  38  |         const app = new AppManager(page);
  39  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  40  | 
  41  |     });
  42  | 
  43  |     test('Guardrail: Deactivated item must be rejected for new stock adjustments', async ({ page }) => {
  44  |         const app = new AppManager(page);
  45  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  46  |         const { apiBase, headers, qs } = await app.buildApiContext();
  47  |         const envMeta = sharedEnvMeta;
  48  | 
  49  |         const itemCode = `DEACT-GUARD-${Date.now()}`;
  50  |         console.log(`[STEP 1] Creating item to deactivate: ${itemCode}...`);
  51  |         const item = await app.api.inventory.createInventoryItemAPI({ name: itemCode, item_id: itemCode, part_number: `PN-${Date.now().toString().slice(-5)}` });
  52  |         console.log(`[OK] Item created: ${item.itemName} (ID: ${item.id})`);
  53  | 
  54  |         console.log(`[STEP 2] Deactivating item via API...`);
  55  |         const deactivateResp = await page.request.patch(`${apiBase}/inventory-item/${item.id}?${qs}`, { data: { status: 'inactive' }, headers });
  56  |         if (!deactivateResp.ok()) { console.log(`[SKIP] Deactivation endpoint returned ${deactivateResp.status()}.`); return; }
  57  |         console.log(`[OK] Item deactivated.`);
  58  | 
  59  |         console.log(`[ATTACK] Attempting stock adjustment on deactivated item...`);
  60  |         let blocked = false;
  61  |         let blockReason = '';
  62  |         let adjRef = 'N/A';
  63  |         let adjId  = 'N/A';
  64  | 
  65  |         try {
  66  |             const adj = await app.api.inventory.createInventoryAdjustmentAPI({
  67  |                 itemId: item.id, quantity: 10, isWriteDown: false,
  68  |                 warehouseId: envMeta.warehouseId, locationId: envMeta.locationId
  69  |             });
  70  |             if (!adj.success) {
  71  |                 blocked = true;
  72  |                 blockReason = adj.error?.substring(0, 60) || 'Rejected at creation';
  73  |             } else {
  74  |                 adjRef = adj.ref ?? 'N/A';
  75  |                 adjId  = adj.id  ?? 'N/A';
  76  |                 if (adj.id) await app.advanceDocumentAPI(adj.id, 'inventory-adjustments');
  77  |                 blocked = false;
  78  |                 blockReason = `Adjustment ${adj.ref} created and advanced on inactive item`;
  79  |             }
  80  |         } catch (err: any) {
  81  |             blocked = true;
  82  |             blockReason = err.message.substring(0, 60);
  83  |         }
  84  | 
  85  |         // ── Stakeholder summary box ──────────────────────────────────────────────────────
  86  |         console.log([
  87  |             ``,
  88  |             `  ╔══════════════════════════════════════════════════════════╗`,
  89  |             `  ║      DEACTIVATED ITEM GUARDRAIL — TEST SUMMARY            ║`,
  90  |             `  ╠══════════════════════════════════════════════════════════╣`,
  91  |             `  ║  Item         : ${itemCode.substring(0, 38).padEnd(38)} ║`,
  92  |             `  ║  Item ID      : ${item.id.substring(0, 38).padEnd(38)} ║`,
  93  |             `  ║  Status set   : inactive                                   ║`,
  94  |             `  ║  Attack       : POST /inventory-adjustments qty=10         ║`,
  95  |             `  ╠══════════════════════════════════════════════════════════╣`,
  96  |             blocked
  97  |                 ? `  ║  System response : BLOCKED ✓                             ║`
  98  |                 : `  ║  System response : ACCEPTED ✕ — VULNERABILITY CONFIRMED  ║`,
  99  |             blocked
  100 |                 ? `  ║  Adjustment was correctly rejected by the API.           ║`
  101 |                 : `  ║  Adj Ref : ${adjRef.substring(0, 44).padEnd(44)} ║`,
  102 |             !blocked
  103 |                 ? `  ║  Adj ID  : ${adjId.substring(0, 44).padEnd(44)} ║`
  104 |                 : `  ║  No inventory record was written to the ledger.          ║`,
  105 |             `  ╠══════════════════════════════════════════════════════════╣`,
  106 |             !blocked
  107 |                 ? `  ║  Risk    : Ghost stock written to inactive item           ║`
  108 |                 : `  ║  Risk    : None — item lifecycle enforced correctly        ║`,
  109 |             !blocked
  110 |                 ? `  ║  Fix     : Reject adjustments if item.status != active    ║`
  111 |                 : `  ║                                                           ║`,
  112 |             `  ╚══════════════════════════════════════════════════════════╝`,
  113 |             ``
  114 |         ].join('\n'));
  115 | 
  116 |         printAuditTable('Deactivated Item Adjustment Guardrail', [
  117 |             ['Item Code',              itemCode],
  118 |             ['Item ID',                item.id],
  119 |             ['Item Status',           'inactive (set in Step 2)'],
  120 |             ['Attack: Adj Qty',        '10 units (write-up)'],
  121 |             ['Adjustment Ref',         adjRef],
  122 |             ['Adjustment ID',          adjId],
  123 |             ['Block Reason',           blockReason || 'Rejected at API layer'],
  124 |         ], blocked, blocked ? 'Inactive item correctly rejected' : 'VULNERABILITY — ghost stock on inactive item');
  125 | 
  126 |         if (!blocked) {
> 127 |             throw new Error(`[VULNERABILITY] System accepted a stock adjustment on a deactivated item (Ref: ${adjRef}). Fix: validate item.status == active before creating adjustments.`);
      |                   ^ Error: [VULNERABILITY] System accepted a stock adjustment on a deactivated item (Ref: ADJ/2026/08/18/004324). Fix: validate item.status == active before creating adjustments.
  128 |         }
  129 |         console.log(`[PASS] Deactivated item correctly blocked.`);
  130 |     });
  131 | 
  132 |     test('Guardrail: System must block sales when item stock reaches exact zero', async ({ page }) => {
  133 |         const app = new AppManager(page);
  134 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  135 |         const envMeta = sharedEnvMeta;
  136 |         const salesMeta = sharedSalesMeta;
  137 | 
  138 |         const itemCode = `ZERO-STOCK-${Date.now()}`;
  139 |         console.log(`[STEP 1] Creating item with exactly 1 unit of stock...`);
  140 |         const item = await app.api.inventory.createInventoryItemAPI({ name: itemCode, item_id: itemCode, part_number: `PN-${Date.now().toString().slice(-5)}`, quantity: 1, unit_cost: 100, default_location_id: envMeta.locationId, default_warehouse_id: envMeta.warehouseId });
  141 |         console.log(`[OK] Item created: ${item.itemName} (ID: ${item.id})`);
  142 | 
  143 |         await app.api.inventory.pollStockAPI(item.id, 1);
  144 | 
  145 |         console.log(`[STEP 2] Selling the only 1 unit to drain stock to zero...`);
  146 |         const inv1 = await app.api.sales.createStandaloneInvoiceAPI({ customerId: salesMeta.customerId, itemId: item.id, quantity: 1, unitPrice: 200, locationId: envMeta.locationId, warehouseId: envMeta.warehouseId });
  147 |         await app.advanceDocumentAPI(inv1.id, 'invoices');
  148 |         await app.api.inventory.pollStockAPI(item.id, 0);
  149 |         console.log(`[OK] Stock is now 0.`);
  150 | 
  151 |         console.log(`[ATTACK] Attempting to sell 1 more unit from zero stock...`);
  152 |         let blocked = false;
  153 |         let blockReason = '';
  154 |         let oversellRef = 'N/A';
  155 |         let finalStock: number | null = null;
  156 | 
  157 |         try {
  158 |             const inv2 = await app.api.sales.createStandaloneInvoiceAPI({ customerId: salesMeta.customerId, itemId: item.id, quantity: 1, unitPrice: 200, locationId: envMeta.locationId, warehouseId: envMeta.warehouseId });
  159 |             await app.advanceDocumentAPI(inv2.id, 'invoices');
  160 |             oversellRef = inv2.ref || inv2.id || 'N/A';
  161 |             const details = await app.api.inventory.getItemDetailsAPI(item.id, envMeta.locationId);
  162 |             finalStock = details?.currentStock ?? null;
  163 |             if ((finalStock ?? 0) < 0) {
  164 |                 blocked = false;
  165 |                 blockReason = `Stock went negative: ${finalStock} — ghost stock created`;
  166 |             } else {
  167 |                 blocked = false;
  168 |                 blockReason = `Invoice created at zero stock but stock did not go negative (${finalStock})`;
  169 |             }
  170 |         } catch (err: any) {
  171 |             blocked = true;
  172 |             blockReason = err.message.substring(0, 60);
  173 |         }
  174 | 
  175 |         // ── Stakeholder summary box ──────────────────────────────────────────────────────
  176 |         console.log([
  177 |             ``,
  178 |             `  ╔══════════════════════════════════════════════════════════╗`,
  179 |             `  ║        ZERO-STOCK GUARDRAIL — TEST SUMMARY               ║`,
  180 |             `  ╠══════════════════════════════════════════════════════════╣`,
  181 |             `  ║  Item         : ${itemCode.substring(0, 38).padEnd(38)} ║`,
  182 |             `  ║  Item ID      : ${item.id.substring(0, 38).padEnd(38)} ║`,
  183 |             `  ║  Step 1       : Created with qty=1, sold 1 → stock=0       ║`,
  184 |             `  ║  Attack       : POST /invoices qty=1 against stock=0       ║`,
  185 |             `  ╠══════════════════════════════════════════════════════════╣`,
  186 |             blocked
  187 |                 ? `  ║  System response : BLOCKED ✓                             ║`
  188 |                 : `  ║  System response : ACCEPTED ✕ — VULNERABILITY CONFIRMED  ║`,
  189 |             blocked
  190 |                 ? `  ║  Oversell invoice was correctly rejected by the API.     ║`
  191 |                 : `  ║  Oversell Ref : ${oversellRef.substring(0, 40).padEnd(40)} ║`,
  192 |             `  ║  Final stock  : ${String(finalStock ?? 'N/A (blocked)').padEnd(38)} ║`,
  193 |             `  ╠══════════════════════════════════════════════════════════╣`,
  194 |             !blocked
  195 |                 ? `  ║  Risk    : Negative stock corrupts COGS and inventory GL  ║`
  196 |                 : `  ║  Risk    : None — zero-stock guard enforced correctly      ║`,
  197 |             !blocked
  198 |                 ? `  ║  Fix     : Reject invoice if available qty < ordered qty   ║`
  199 |                 : `  ║                                                           ║`,
  200 |             `  ╚══════════════════════════════════════════════════════════╝`,
  201 |             ``
  202 |         ].join('\n'));
  203 | 
  204 |         printAuditTable('Zero-Stock Oversell Guardrail', [
  205 |             ['Item Code',              itemCode],
  206 |             ['Item ID',                item.id],
  207 |             ['Initial Stock',         '1 unit'],
  208 |             ['Step 2: Sold',           '1 unit → stock drained to 0'],
  209 |             ['Attack: Invoice Qty',    '1 unit (against stock=0)'],
  210 |             ['Oversell Invoice Ref',   oversellRef],
  211 |             ['Final Stock',            finalStock !== null ? `${finalStock} units` : 'N/A (blocked)'],
  212 |             ['Block Reason',           blockReason || 'Rejected at API layer'],
  213 |         ], blocked, blocked ? 'Zero-stock sale correctly rejected' : 'VULNERABILITY — negative stock / ghost inventory');
  214 | 
  215 |         if (!blocked && (finalStock ?? 0) < 0) {
  216 |             throw new Error(`[VULNERABILITY] Stock went negative (${finalStock}) after selling from zero. Ghost stock created.`);
  217 |         }
  218 |         if (!blocked) {
  219 |             console.log(`[WARN] Invoice created at zero stock but stock did not go negative (${finalStock}). Monitor.`);
  220 |         } else {
  221 |             console.log(`[PASS] Zero-stock sale correctly rejected.`);
  222 |         }
  223 |     });
  224 | });
  225 | 
```