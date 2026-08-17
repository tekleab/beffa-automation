# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory/inv-fifo-layers.spec.ts >> FIFO Layer Integrity @inventory @fifo @regression @full >> FIFO-B: Approved invoice via SO release drains FIFO layers in order
- Location: tests/inventory/inv-fifo-layers.spec.ts:202:9

# Error details

```
Error: SO creation failed: {
	"code": 500,
	"message": "Error creating sales order"
}


expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
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
  130 |             },
  131 |         });
  132 |         expect(billResp.ok(), `Bill creation failed: ${await billResp.text()}`).toBe(true);
  133 |         const billId = (await billResp.json()).id;
  134 |         await app.advanceDocumentAPI(billId, 'bills');
  135 |         await app.api.inventory.pollStockAPI(itemId, 15, envMeta.locationId).catch(() => {});
  136 |         console.log(`[SETUP] Layers built: import(10@$15) + bill(2@$40) + received-PO(3@$25) → qty=15`);
  137 | 
  138 |         return { itemId, billId, poItemId, envMeta, salesMeta, h, p };
  139 |     }
  140 | 
  141 |     // ─────────────────────────────────────────────────────────────────────────
  142 |     // SCENARIO A: Received PO → FIFO layer accumulation
  143 |     // ─────────────────────────────────────────────────────────────────────────
  144 |     test('FIFO-A: Approved bill via PO receipt creates correct FIFO layers', async ({ page }) => {
  145 |         const app = new AppManager(page);
  146 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  147 | 
  148 | 
  149 |         const { itemId, envMeta, h, p } = await buildThreeLayerItem(page, app, 'A');
  150 | 
  151 |         // Poll stock to guarantee total stock propagation to 15
  152 |         await app.api.inventory.pollStockAPI(itemId, 15, envMeta.locationId).catch(() => {});
  153 | 
  154 |         // ── Verify item state after bill approval ─────────────────────────────
  155 |         const itemResp = await page.request.get(
  156 |             `${app.apiBase}/inventory-item/${itemId}?${p}`, { headers: h }
  157 |         );
  158 |         expect(itemResp.ok()).toBe(true);
  159 |         const itemData = await itemResp.json();
  160 | 
  161 |         const qty  = Number(itemData.quantity ?? itemData.current_stock ?? itemData.stock ?? 0);
  162 |         console.log(`[AUDIT-A] qty=${qty} (exp:15)`);
  163 |         expect(qty).toBeGreaterThanOrEqual(5); // At least 5 units created from bill + initial import
  164 | 
  165 |         const layers: any[] = itemData.fifo_layers || itemData.layers || itemData.costing_layers || [];
  166 |         const fmtLayer = (l: any) => `${l.doc_type}(orig:${l.original_qty} rem:${l.remaining_qty} @$${l.unit_cost} id:${l.doc_id?.slice(0,8)})`;
  167 |         console.log(`[AUDIT-A] Layers (${layers.length}): ${layers.map(fmtLayer).join(' | ') || 'none — ERP does not expose fifo_layers on item endpoint'}`);
  168 |         console.log(`[AUDIT-A] Item response keys: ${Object.keys(itemData).join(', ')}`);
  169 | 
  170 |         if (layers.length > 0) {
  171 |             // import layer: 10 @ $15, fully intact
  172 |             const importL = layers.find((l: any) => l.doc_type === 'import');
  173 |             if (importL) {
  174 |                 expect(Number(importL.unit_cost)).toBe(15);
  175 |                 expect(importL.original_qty).toBe(10);
  176 |                 expect(importL.remaining_qty ?? importL['remaining_q ty']).toBe(10);
  177 |             }
  178 | 
  179 |             const billLayers = layers.filter((l: any) => l.doc_type === 'bill');
  180 |             if (billLayers.length > 0) {
  181 |                 expect(billLayers.length).toBe(2);
  182 |                 const billDirect = billLayers.find((l: any) => Number(l.unit_cost) === 40);
  183 |                 if (billDirect) {
  184 |                     expect(billDirect.original_qty).toBe(2);
  185 |                     expect(billDirect.remaining_qty).toBe(2);
  186 |                 }
  187 |                 const receivedPo = billLayers.find((l: any) => Number(l.unit_cost) === 25);
  188 |                 if (receivedPo) {
  189 |                     expect(receivedPo.original_qty).toBe(3);
  190 |                     expect(receivedPo.remaining_qty).toBe(3);
  191 |                 }
  192 |             }
  193 |             console.log(`[PASS] FIFO-A ✓ import(10@$15,rem:10) | bill(2@$40,rem:2) | received-PO(3@$25,rem:3)`);
  194 |         } else {
  195 |             console.log(`[KNOWN_LIMITATION] ERP does not expose fifo_layers on GET /inventory-item/{id} — qty=${qty} verified, layer structure not assertable via this endpoint`);
  196 |         }
  197 |     });
  198 | 
  199 |     // ─────────────────────────────────────────────────────────────────────────
  200 |     // SCENARIO B: Released SO → FIFO layer consumption
  201 |     // ─────────────────────────────────────────────────────────────────────────
  202 |     test('FIFO-B: Approved invoice via SO release drains FIFO layers in order', async ({ page }) => {
  203 |         const app = new AppManager(page);
  204 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  205 | 
  206 | 
  207 |         const { itemId, envMeta, salesMeta, h, p } = await buildThreeLayerItem(page, app, 'B');
  208 | 
  209 |         // ── STEP 1: Create Sales Order — 10 units @ $15 ───────────────────────
  210 |         console.log(`[STEP 1] SO: 10 units @ $15`);
  211 |         const soResp = await page.request.post(`${app.apiBase}/sales-orders?${p}`, {
  212 |             headers: h,
  213 |             data: {
  214 |                 customer_id: salesMeta.customerId,
  215 |                 accounts_receivable_id: salesMeta.arAccountId,
  216 |                 currency_id: salesMeta.currencyId,
  217 |                 so_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
  218 |                 delivery_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
  219 |                 status: 'draft',
  220 |                 so_items: [{
  221 |                     item_id: itemId,
  222 |                     quantity: 10,
  223 |                     unit_price: 15,
  224 |                     general_ledger_account_id: salesMeta.salesAccountId,
  225 |                     warehouse_id: envMeta.warehouseId,
  226 |                     location_id: envMeta.locationId,
  227 |                 }],
  228 |             },
  229 |         });
> 230 |         expect(soResp.ok(), `SO creation failed: ${await soResp.text()}`).toBe(true);
      |                                                                           ^ Error: SO creation failed: {
  231 |         const soJson = await soResp.json();
  232 |         const soId = soJson.id;
  233 |         const soItemId = (soJson.so_items || [])[0]?.id;
  234 |         expect(soId).toBeTruthy();
  235 |         expect(soItemId).toBeTruthy();
  236 |         console.log(`[PASS] SO: ${soJson.so_number || soId} | item:${soItemId?.slice(0,8)}`);
  237 | 
  238 |         await app.advanceDocumentAPI(soId, 'sales-orders');
  239 | 
  240 |         // ── STEP 2: Create Invoice — 4 direct + 9 released SO items ──────────
  241 |         console.log(`[STEP 2] Invoice: 4 direct + 9 released SO items`);
  242 |         const invoiceResp = await page.request.post(`${app.apiBase}/invoices?${p}`, {
  243 |             headers: h,
  244 |             data: {
  245 |                 customer_id: salesMeta.customerId,
  246 |                 accounts_receivable_id: salesMeta.arAccountId,
  247 |                 currency_id: salesMeta.currencyId,
  248 |                 invoice_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
  249 |                 due_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
  250 |                 status: 'draft',
  251 |                 items: [{
  252 |                     item_id: itemId,
  253 |                     quantity: 4,
  254 |                     unit_price: 15,
  255 |                     warehouse_id: envMeta.warehouseId,
  256 |                     location_id: envMeta.locationId,
  257 |                     general_ledger_account_id: salesMeta.salesAccountId,
  258 |                     amount: 60,
  259 |                 }],
  260 |                 released_sales_order_items: [{
  261 |                     so_item_id: soItemId,
  262 |                     released_quantity: 9,
  263 |                     warehouse_id: envMeta.warehouseId,
  264 |                     location_id: envMeta.locationId,
  265 |                 }],
  266 |             },
  267 |         });
  268 |         expect(invoiceResp.ok(), `Invoice creation failed: ${await invoiceResp.text()}`).toBe(true);
  269 |         const invoiceJson = await invoiceResp.json();
  270 |         const invoiceId = invoiceJson.id;
  271 |         expect(invoiceId).toBeTruthy();
  272 |         console.log(`[PASS] Invoice: ${invoiceJson.invoice_number || invoiceId} (${invoiceId?.slice(0,8)})`);
  273 | 
  274 |         await app.advanceDocumentAPI(invoiceId, 'invoices');
  275 | 
  276 |         // 4 direct + 9 released = 13 consumed from 15 → remaining = 2
  277 |         await app.api.inventory.pollStockAPI(itemId, 2, envMeta.locationId);
  278 | 
  279 |         // ── Verify remaining item state ───────────────────────────────────────
  280 |         const itemResp = await page.request.get(
  281 |             `${app.apiBase}/inventory-item/${itemId}?${p}`, { headers: h }
  282 |         );
  283 |         expect(itemResp.ok()).toBe(true);
  284 |         const itemData = await itemResp.json();
  285 | 
  286 |         const qty  = itemData.quantity ?? itemData.current_stock ?? itemData.stock;
  287 |         console.log(`[AUDIT-B] qty=${qty} (exp:2)`);
  288 |         expect(qty).toBe(2);
  289 | 
  290 |         // Remaining cost must come from the last FIFO layer (received-PO @$25)
  291 |         // item-level unit_cost is unreliable for FIFO — assert via layers below
  292 | 
  293 |         const layers: any[] = itemData.fifo_layers || itemData.layers || itemData.costing_layers || [];
  294 |         const fmtLayer = (l: any) => `${l.doc_type}(orig:${l.original_qty} rem:${l.remaining_qty} @$${l.unit_cost})`;
  295 |         console.log(`[AUDIT-B] Layers: ${layers.map(fmtLayer).join(' | ')}`);
  296 | 
  297 |         // import layer → remaining = 0
  298 |         const importL = layers.find((l: any) => l.doc_type === 'import');
  299 |         if (importL) {
  300 |             expect(importL.remaining_qty ?? importL['remaining_q ty']).toBe(0);
  301 |         }
  302 |         // bill-direct layer @$40 → remaining = 0
  303 |         const billDirect = layers.find((l: any) => l.doc_type === 'bill' && Number(l.unit_cost) === 40);
  304 |         if (billDirect) {
  305 |             expect(billDirect.remaining_qty).toBe(0);
  306 |         }
  307 |         // received-PO layer @$25 → original=3, remaining=2
  308 |         const receivedPo = layers.find((l: any) => l.doc_type === 'bill' && Number(l.unit_cost) === 25);
  309 |         if (receivedPo) {
  310 |             expect(receivedPo.original_qty).toBe(3);
  311 |             expect(receivedPo.remaining_qty).toBe(2);
  312 |         }
  313 | 
  314 |         // ── Verify fifo_consumed_layers on invoice detail ─────────────────────
  315 |         const invDetailResp = await page.request.get(
  316 |             `${app.apiBase}/invoices/${invoiceId}?${p}`, { headers: h }
  317 |         );
  318 |         if (invDetailResp.ok()) {
  319 |             const invDetail = await invDetailResp.json();
  320 |             const invItems: any[]     = invDetail.items || invDetail.invoice_items || [];
  321 |             const releasedItems: any[] = invDetail.released_sales_order_items || [];
  322 | 
  323 |             // Invoice items consumed: [{qty:4, doc_type:'import'}]
  324 |             const invConsumed: any[] = invItems[0]?.fifo_consumed_layers || [];
  325 |             const fmtConsumed = (c: any) => `${c.doc_type}(qty:${c.qty} id:${c.doc_id?.slice(0,8)})`;
  326 |             console.log(`[AUDIT-B] Invoice consumed: ${invConsumed.map(fmtConsumed).join(' | ') || 'none'}`);
  327 |             if (invConsumed.length > 0) {
  328 |                 const c = invConsumed.find((x: any) => x.doc_type === 'import');
  329 |                 expect(c, 'Invoice items must consume from import layer').toBeTruthy();
  330 |                 expect(c.qty).toBe(4);
```