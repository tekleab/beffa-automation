# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/receipt-api-standalone.spec.ts >> Receipt API Standalone Diagnostics Suite @sales @receipt @smoke @full >> API: Full Invoice, Receipt Creation, and Approval Workflow
- Location: tests/sales/receipt-api-standalone.spec.ts:97:9

# Error details

```
Error: SO Creation failed: {
	"code": 422,
	"details": {
		"so_items.0.quantity": [
			"Insufficient stock. Available: 0, required: 1.00"
		]
	},
	"message": "Validation error when creating sales order"
}


expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
  198 |                     default_warehouse_id: warehouseId,
  199 |                     quantity: 0
  200 |                 }
  201 |             });
  202 | 
  203 |             if (createItemResp.ok()) {
  204 |                 activeItem = await createItemResp.json();
  205 |                 console.log(`[ITEM CREATED] Created fresh active item: ${activeItem.name} (${activeItem.id})`);
  206 |                 
  207 |                 // Seed stock via inventory adjustment
  208 |                 const adjResp = await request.post(`${apiBase}/inventory-adjustments?${params}`, {
  209 |                     headers,
  210 |                     data: {
  211 |                         adjusted_by: 'quantity',
  212 |                         adjusted_quantity: 50,
  213 |                         adjustment_account_id: arAccount.id,
  214 |                         inventory_item_id: activeItem.id,
  215 |                         is_write_down: 'false',
  216 |                         location_id: locationId,
  217 |                         warehouse_id: warehouseId,
  218 |                         date: isoDate,
  219 |                         reason: 'API Standalone Receipt Test Seed',
  220 |                         unit_cost: 100,
  221 |                         unit_price: 100,
  222 |                         total_cost: 5000,
  223 |                         current_quantity: 0,
  224 |                         location_quantity: 0,
  225 |                         skip_draft: false,
  226 |                         status: 'draft'
  227 |                     }
  228 |                 });
  229 | 
  230 |                 if (adjResp.ok()) {
  231 |                     const adj = await adjResp.json();
  232 |                     await request.patch(`${apiBase}/inventory-adjustments/${adj.id}/advance?${params}`, { headers, data: {} });
  233 |                     console.log(`[STOCK SEED] Seeded stock via adjustment ${adj.id}. Polling for stock commitment...`);
  234 | 
  235 |                     // Poll to ensure stock is committed before creating SO
  236 |                     for (let attempt = 1; attempt <= 10; attempt++) {
  237 |                         const locsResp = await request.get(`${apiBase}/inventory-item/${activeItem.id}/locations?${params}`, { headers });
  238 |                         if (locsResp.ok()) {
  239 |                             const locsData = await locsResp.json();
  240 |                             const locList = locsData.data || locsData.items || (Array.isArray(locsData) ? locsData : []);
  241 |                             const matchedLoc = locList.find((l: any) => l.id === locationId || l.location_id === locationId);
  242 |                             const currentStock = parseFloat(matchedLoc?.quantity || '0');
  243 |                             if (currentStock >= 1) {
  244 |                                 verifiedStock = currentStock;
  245 |                                 console.log(`[STOCK VERIFIED] Live stock confirmed on attempt ${attempt}: ${verifiedStock}`);
  246 |                                 break;
  247 |                             }
  248 |                         }
  249 |                         await new Promise(r => setTimeout(r, 1000));
  250 |                     }
  251 |                 }
  252 |             }
  253 |         }
  254 | 
  255 |         if (!activeItem) {
  256 |             activeItem = activeItems[0] || items[0];
  257 |         }
  258 | 
  259 |         expect(activeItem?.id, 'Active inventory item is required').toBeTruthy();
  260 | 
  261 |         expect(customer, 'Customer is required').toBeTruthy();
  262 |         expect(cashAccount, 'Cash/Bank Account is required').toBeTruthy();
  263 | 
  264 |         console.log(`  ├── Customer ID      : ${customer.id}`);
  265 |         console.log(`  ├── Cash Account ID  : ${cashAccount.id} (${cashAccount.name || 'N/A'})`);
  266 |         console.log(`  ├── Currency ID      : ${currency.id} (${currency.code || currency.name || 'ETB'})`);
  267 |         console.log(`  ├── AR Account ID    : ${arAccount.id} (${arAccount.name || 'N/A'})`);
  268 |         console.log(`  ├── Sales Account ID : ${salesAccount.id} (${salesAccount.name || 'N/A'})`);
  269 |         console.log(`  ├── Warehouse ID     : ${warehouseId || 'N/A'}`);
  270 |         console.log(`  ├── Location ID      : ${locationId || 'N/A'}`);
  271 |         console.log(`  └── Inventory Item ID: ${activeItem?.id || 'N/A'}`);
  272 | 
  273 |         // 2. Create & Advance Sales Order
  274 |         const ts = Date.now();
  275 |         console.log(`[STEP 3A] Creating Sales Order...`);
  276 |         const soResp = await request.post(`${apiBase}/sales-orders?${params}`, {
  277 |             headers,
  278 |             data: {
  279 |                 customer_id: customer.id,
  280 |                 accounts_receivable_id: arAccount.id,
  281 |                 currency_id: currency.id,
  282 |                 so_date: isoDate,
  283 |                 so_items: [{
  284 |                     item_id: activeItem?.id,
  285 |                     inventory_item_id: activeItem?.id,
  286 |                     quantity: 1,
  287 |                     unit_price: 1000,
  288 |                     amount: 1000,
  289 |                     general_ledger_account_id: salesAccount.id,
  290 |                     warehouse_id: warehouseId,
  291 |                     location_id: locationId,
  292 |                     description: 'API Standalone Receipt Test'
  293 |                 }],
  294 |                 status: 'draft'
  295 |             }
  296 |         });
  297 | 
> 298 |         expect(soResp.ok(), `SO Creation failed: ${await soResp.text()}`).toBe(true);
      |                                                                           ^ Error: SO Creation failed: {
  299 |         const so = await soResp.json();
  300 |         console.log(`[PASS] Sales Order Created: ${so.ref || so.id}`);
  301 | 
  302 |         await request.patch(`${apiBase}/sales-orders/${so.id}/advance?${params}`, { headers, data: {} });
  303 | 
  304 |         // 3. Create & Advance Sales Invoice
  305 |         console.log(`[STEP 3B] Creating Sales Invoice...`);
  306 |         const invResp = await request.post(`${apiBase}/invoices?${params}`, {
  307 |             headers,
  308 |             data: {
  309 |                 customer_id: customer.id,
  310 |                 accounts_receivable_id: arAccount.id,
  311 |                 currency_id: currency.id,
  312 |                 sales_order_id: so.id,
  313 |                 date: isoDate,
  314 |                 posting_date: isoDate,
  315 |                 due_date: isoDate,
  316 |                 items: [{
  317 |                     item_id: activeItem?.id,
  318 |                     inventory_item_id: activeItem?.id,
  319 |                     quantity: 1,
  320 |                     unit_price: 1000,
  321 |                     amount: 1000,
  322 |                     general_ledger_account_id: salesAccount.id,
  323 |                     warehouse_id: warehouseId,
  324 |                     location_id: locationId
  325 |                 }]
  326 |             }
  327 |         });
  328 | 
  329 |         expect(invResp.ok(), `Invoice Creation failed: ${await invResp.text()}`).toBe(true);
  330 |         const inv = await invResp.json();
  331 |         console.log(`[PASS] Invoice Created: ${inv.ref || inv.id} | Status: ${inv.status}`);
  332 | 
  333 |         const advInvResp = await request.patch(`${apiBase}/invoices/${inv.id}/advance?${params}`, { headers, data: {} });
  334 |         console.log(`[PASS] Invoice Advance Status: ${advInvResp.status()}`);
  335 | 
  336 |         // 4. Create Linked Receipt
  337 |         console.log(`[STEP 3C] Creating Receipt linked to Invoice ${inv.id}...`);
  338 |         const receiptPayload = {
  339 |             customer_id: customer.id,
  340 |             cash_account_id: cashAccount.id,
  341 |             currency_id: currency.id,
  342 |             payment_method: 'cash',
  343 |             amount: 1000,
  344 |             date: isoDate,
  345 |             reference: `AUTO-RCT-${ts}`,
  346 |             invoice_receipts: [{ invoice_id: inv.id, amount: 1000 }],
  347 |             receipt_items: [{ amount: 1000, general_ledger_account_id: arAccount.id, unit_price: 1000, quantity: 1, description: 'Invoice Receipt' }]
  348 |         };
  349 | 
  350 |         const rctResp = await request.post(`${apiBase}/receipts?${params}`, {
  351 |             headers,
  352 |             data: receiptPayload
  353 |         });
  354 | 
  355 |         const rctStatus = rctResp.status();
  356 |         const rctBodyText = await rctResp.text();
  357 |         console.log(`[HTTP POST] /api/receipts (linked to draft invoice) -> Status: ${rctStatus}`);
  358 | 
  359 |         if (!rctResp.ok()) {
  360 |             console.log(`[⚠️ BACKEND DEFECT DETECTED] Linking draft invoice to receipt returned HTTP ${rctStatus}`);
  361 |             console.log(`[SERVER RESPONSE] ${rctBodyText.slice(0, 300)}`);
  362 |         } else {
  363 |             console.log(`[PASS] Linked Receipt Created: ${rctBodyText.slice(0, 100)}`);
  364 |         }
  365 | 
  366 |         // 5. Create Standalone / Unlinked Direct Customer Receipt
  367 |         console.log(`[STEP 3D] Creating Standalone Customer Receipt (unlinked to draft invoice)...`);
  368 |         const unlinkedPayload = {
  369 |             customer_id: customer.id,
  370 |             cash_account_id: cashAccount.id,
  371 |             currency_id: currency.id,
  372 |             payment_method: 'cash',
  373 |             amount: 500,
  374 |             date: isoDate,
  375 |             reference: `AUTO-DIR-${ts}`
  376 |         };
  377 | 
  378 |         const dirRctResp = await request.post(`${apiBase}/receipts?${params}`, {
  379 |             headers,
  380 |             data: unlinkedPayload
  381 |         });
  382 | 
  383 |         const dirStatus = dirRctResp.status();
  384 |         const dirBody = await dirRctResp.text();
  385 |         console.log(`[HTTP POST] /api/receipts (standalone customer receipt) -> Status: ${dirStatus}`);
  386 | 
  387 |         expect(dirRctResp.ok(), `Direct customer receipt creation failed with HTTP ${dirStatus}: ${dirBody}`).toBe(true);
  388 |         const rct = JSON.parse(dirBody);
  389 |         console.log(`[PASS] Standalone Receipt Created Successfully!`);
  390 |         console.log(`  ├── Receipt ID  : ${rct.id}`);
  391 |         console.log(`  ├── Ref Number  : ${rct.ref || rct.receipt_number || 'N/A'}`);
  392 |         console.log(`  ├── Status      : ${rct.status}`);
  393 |         console.log(`  └── Amount      : ${rct.amount}`);
  394 | 
  395 |         // 6. Verify Direct GET /api/receipt/:id (or /api/receipts/:id)
  396 |         console.log(`[STEP 3E] Verifying Direct GET /api/receipt/${rct.id}...`);
  397 |         let directResp = await request.get(`${apiBase}/receipt/${rct.id}?${params}`, { headers });
  398 |         if (!directResp.ok()) {
```