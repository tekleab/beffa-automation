# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory/inv-boundary-attack.spec.ts >> Inventory Boundary & Costing Attack Audit @inventory @security @logic @regression @full >> Concurrent adjustments on same item must produce correct final stock
- Location: tests/inventory/inv-boundary-attack.spec.ts:182:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 20
Received: 10
```

# Test source

```ts
  151 |                 }
  152 |             } catch (e: any) { console.log(`[PASS] Advance blocked: ${e.message.slice(0, 80)}`); }
  153 |         } else {
  154 |             expect(resp.status()).toBeGreaterThanOrEqual(400);
  155 |             console.log(`[PASS] Massive negative correctly rejected: ${resp.status()}`);
  156 |         }
  157 |     });
  158 | 
  159 |     // ── 4. ZERO UNIT_COST ─────────────────────────────────────────────────────
  160 |     test('Zero unit_cost must not corrupt WAC costing (divide-by-zero guard)', async ({ request }) => {
  161 |         const resp = await postAdj(request, { adjusted_quantity: 5, unit_cost: 0, reason: 'E2E boundary — zero unit_cost' });
  162 |         const body = await resp.json();
  163 |         console.log(`[RESULT] Zero unit_cost: status=${resp.status()} | adj_id=${body.id ?? 'N/A'}`);
  164 | 
  165 |         if (resp.ok() && body.id) {
  166 |             await advance(request, body.id, 'inventory-adjustments');
  167 |             await new Promise(r => setTimeout(r, 1000));
  168 |             const d = await (await request.get(`${API()}/inventory-item/${item.id}?${QS()}`, { headers: h(token) })).json();
  169 |             const wac = parseFloat(d.average_cost || d.unit_cost || d.wac || '0');
  170 |             console.log(`[AUDIT] WAC after zero-cost adj: ${wac} | item_id=${item.id}`);
  171 |             if (!isFinite(wac) || isNaN(wac)) {
  172 |                 BUG('BUG-INV-004', 'WAC corrupted (NaN/Infinity) after zero-cost adjustment', { adj_doc: body.ref, adj_id: body.id, item_id: item.id, item_name: item.name, wac_value: wac, impact: 'All future COGS for this item will produce NaN/Infinity' });
  173 |             }
  174 |             expect(isFinite(wac), 'WAC must remain finite').toBe(true);
  175 |             console.log(`[PASS] WAC integrity maintained: ${wac}`);
  176 |         } else {
  177 |             console.log(`[PASS] Zero unit_cost rejected: ${resp.status()}`);
  178 |         }
  179 |     });
  180 | 
  181 |     // ── 5. CONCURRENT ADJUSTMENTS ────────────────────────────────────────────
  182 |     test('Concurrent adjustments on same item must produce correct final stock', async ({ request }) => {
  183 |         // Create isolated item for concurrency test
  184 |         const locR2 = await request.get(`${API()}/locations?page=1&pageSize=1&${QS()}`, { headers: h(token) });
  185 |         const whR2 = await request.get(`${API()}/warehouses?page=1&pageSize=1&${QS()}`, { headers: h(token) });
  186 |         const loc = ((await locR2.json()).data || [])[0];
  187 |         const wh2 = ((await whR2.json()).data || [])[0];
  188 |         const cItemR = await request.post(`${API()}/inventory-items?${QS()}`, {
  189 |             headers: h(token),
  190 |             data: {
  191 |                 name: `CONC-Item-${Date.now()}`, type: 'inventory', category: 'Raw Materials',
  192 |                 cost_method_code: 'WAC', item_class: 'MER', item_id: `ITM-CONC-${Date.now().toString().slice(-6)}`,
  193 |                 unit_of_measurement: 'Kilogram (kg)', part_number: `PN-CONC-${Date.now().toString().slice(-5)}`,
  194 |                 serial: 'Z', status: 'active', min_stock: 0, initial_stock: 0,
  195 |                 purchase_price: 100, selling_price: 100, unit_cost: 100,
  196 |                 gl_sales_account_id: adjAccountId, gl_cost_account_id: adjAccountId, gl_inventory_account_id: adjAccountId,
  197 |                 default_location_id: loc?.id, default_warehouse_id: wh2?.id,
  198 |                 description: [{ content: '', type: 'item' }, { content: '', type: 'sales' }, { content: '', type: 'purchase' }],
  199 |             }
  200 |         });
  201 |         const ci = await cItemR.json();
  202 |         console.log(`[SETUP] Concurrent item_id=${ci.id} | stock=0`);
  203 | 
  204 |         const adjData = { warehouse_id: wh2?.id, location_id: loc?.id, date: TODAY(), adjusted_by: 'quantity', adjusted_quantity: 10, adjusted_cost: 0, adjustment_account_id: adjAccountId, inventory_item_id: ci.id, unit_cost: 100, is_write_down: 'false', current_quantity: 0, location_quantity: 0, reason: 'E2E concurrent test' };
  205 | 
  206 |         // Fire both concurrently — ERP may reject one with 400 (known lock contention)
  207 |         const [r1, r2] = await Promise.all([
  208 |             request.post(`${API()}/inventory-adjustments?${QS()}`, { headers: h(token), data: adjData }),
  209 |             request.post(`${API()}/inventory-adjustments?${QS()}`, { headers: h(token), data: adjData }),
  210 |         ]);
  211 |         const [t1, t2] = await Promise.all([r1.text(), r2.text()]);
  212 |         let a1 = t1 ? JSON.parse(t1) : {};
  213 |         let a2 = t2 ? JSON.parse(t2) : {};
  214 |         console.log(`[SETUP] adj1: status=${r1.status()} doc=${a1.ref ?? 'N/A'} id=${a1.id ?? 'N/A'}`);
  215 |         console.log(`[SETUP] adj2: status=${r2.status()} doc=${a2.ref ?? 'N/A'} id=${a2.id ?? 'N/A'}`);
  216 | 
  217 |         // Retry whichever was rejected — documents the ERP lock contention but still tests both apply
  218 |         if (!a1.id) {
  219 |             console.log('[RETRY] adj1 was rejected (lock contention) — retrying after 500ms');
  220 |             await new Promise(r => setTimeout(r, 500));
  221 |             const retry = await request.post(`${API()}/inventory-adjustments?${QS()}`, { headers: h(token), data: adjData });
  222 |             const rt = await retry.text();
  223 |             a1 = rt ? JSON.parse(rt) : {};
  224 |             console.log(`[RETRY] adj1 retry: status=${retry.status()} doc=${a1.ref ?? 'N/A'} id=${a1.id ?? 'N/A'}`);
  225 |         }
  226 |         if (!a2.id) {
  227 |             console.log('[RETRY] adj2 was rejected (lock contention) — retrying after 500ms');
  228 |             await new Promise(r => setTimeout(r, 500));
  229 |             const retry = await request.post(`${API()}/inventory-adjustments?${QS()}`, { headers: h(token), data: adjData });
  230 |             const rt = await retry.text();
  231 |             a2 = rt ? JSON.parse(rt) : {};
  232 |             console.log(`[RETRY] adj2 retry: status=${retry.status()} doc=${a2.ref ?? 'N/A'} id=${a2.id ?? 'N/A'}`);
  233 |         }
  234 | 
  235 |         if (a1.id) await advance(request, a1.id, 'inventory-adjustments');
  236 |         if (a2.id) await advance(request, a2.id, 'inventory-adjustments');
  237 | 
  238 |         // Poll max 8×1s — read from single-record endpoint (list endpoint omits quantity for some items)
  239 |         let finalStock = 0;
  240 |         for (let i = 0; i < 8; i++) {
  241 |             await new Promise(r => setTimeout(r, 1000));
  242 |             const d = await (await request.get(`${API()}/inventory-item/${ci.id}?${QS()}`, { headers: h(token) })).json();
  243 |             finalStock = d.quantity ?? 0;
  244 |             if (finalStock === 20) break;
  245 |         }
  246 | 
  247 |         console.log(`[AUDIT] item_id=${ci.id} | adj1=${a1.ref ?? 'N/A'} | adj2=${a2.ref ?? 'N/A'} | expected=20 | actual=${finalStock}`);
  248 |         if (finalStock !== 20) {
  249 |             BUG('BUG-INV-005', 'Concurrent adjustments did not both apply — race condition', { adj1_doc: a1.ref ?? null, adj1_id: a1.id ?? null, adj2_doc: a2.ref ?? null, adj2_id: a2.id ?? null, item_id: ci.id, stock_before: 0, expected_stock: 20, actual_stock: finalStock, impact: 'Lost update — one adjustment silently dropped under concurrent load' });
  250 |         }
> 251 |         expect(finalStock).toBe(20);
      |                            ^ Error: expect(received).toBe(expected) // Object.is equality
  252 |         console.log(`[PASS] Concurrent adjustments applied correctly: ${finalStock}`);
  253 |     });
  254 | });
  255 | 
```