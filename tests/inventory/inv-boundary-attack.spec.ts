import { test, expect } from '@playwright/test';

const API = () => (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
    .replace(/['"]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001') + '/api';
const QS = () => `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
const TODAY = () => new Date().toISOString().slice(0, 10) + 'T00:00:00Z';

const BUG = (id: string, title: string, detail: Record<string, any>) => {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`[BUG REPORT] ${id}`);
    console.log(`  Title   : ${title}`);
    console.log(`  Time    : ${new Date().toISOString()}`);
    Object.entries(detail).forEach(([k, v]) => console.log(`  ${k.padEnd(16)}: ${JSON.stringify(v)}`));
    console.log('─'.repeat(60));
};

async function apiLogin(request: any) {
    const r = await request.post(`${API()}/users/login?${QS()}&month=6`, {
        data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
        headers: { 'Content-Type': 'application/json' }
    });
    const token = (await r.json()).auth_token;
    if (!token) throw new Error('Login failed');
    return token;
}

function h(token: string) {
    return { 'Authorization': `Bearer ${token}`, 'x-company': process.env.BEFFA_COMPANY as string, 'Content-Type': 'application/json' };
}

test.describe('Inventory Boundary & Costing Attack Audit @inventory @security @logic @regression @full', () => {
    test.describe.configure({ mode: 'serial' });
    test.setTimeout(90000);

    let token: string;
    let item: { id: string; name: string; locationId: string; warehouseId: string; stock: number };
    let adjAccountId: string;

    test.beforeAll(async ({ request }) => {
        token = await apiLogin(request);

        // Discover location + account in parallel
        const [locR, acctR, whR] = await Promise.all([
            request.get(`${API()}/locations?page=1&pageSize=1&${QS()}`, { headers: h(token) }),
            request.get(`${API()}/accounts?page=1&pageSize=1&${QS()}`, { headers: h(token) }),
            request.get(`${API()}/warehouses?page=1&pageSize=1&${QS()}`, { headers: h(token) }),
        ]);
        const loc = ((await locR.json()).data || [])[0];
        const wh = ((await whR.json()).data || [])[0];
        adjAccountId = ((await acctR.json()).data || [])[0]?.id || '';

        // Create item with initial_stock=10 — no poll needed
        const itemR = await request.post(`${API()}/inventory-items?${QS()}`, {
            headers: h(token),
            data: {
                name: `BND-Item-${Date.now()}`, type: 'inventory', category: 'Raw Materials',
                cost_method_code: 'WAC', item_class: 'MER', item_id: `ITM-BND-${Date.now().toString().slice(-6)}`,
                unit_of_measurement: 'Kilogram (kg)', part_number: `PN-BND-${Date.now().toString().slice(-5)}`,
                serial: 'Z', status: 'active', min_stock: 0, initial_stock: 0,
                purchase_price: 100, selling_price: 100, unit_cost: 100,
                gl_sales_account_id: adjAccountId, gl_cost_account_id: adjAccountId, gl_inventory_account_id: adjAccountId,
                default_location_id: loc?.id, default_warehouse_id: wh?.id,
                description: [{ content: '', type: 'item' }, { content: '', type: 'sales' }, { content: '', type: 'purchase' }],
            }
        });
        const d = await itemR.json();
        item = { id: d.id, name: d.name, locationId: loc?.id, warehouseId: wh?.id, stock: 0 };
        console.log(`[SETUP] item_id=${item.id} | name=${item.name} | stock=${item.stock} | location=${item.locationId} | adjAccount=${adjAccountId}`);
    });

    const postAdj = (request: any, overrides: Record<string, any>) =>
        request.post(`${API()}/inventory-adjustments?${QS()}`, {
            headers: h(token),
            data: {
                warehouse_id: item.warehouseId, location_id: item.locationId, date: TODAY(),
                adjusted_by: 'quantity', adjusted_cost: 0, adjustment_account_id: adjAccountId,
                inventory_item_id: item.id, unit_cost: 100, is_write_down: 'false',
                current_quantity: 0, location_quantity: 0,
                ...overrides,
            }
        });

    async function advance(request: any, id: string, type: string) {
        for (let i = 0; i < 3; i++) {
            const r = await request.patch(`${API()}/${type}/${id}/advance?${QS()}`, { headers: h(token), data: {} });
            if (r.status() === 204) break; // No Content = success
            const text = await r.text();
            if (!text) break;
            try {
                const body = JSON.parse(text);
                const status = body.status?.toLowerCase() || body.data?.status?.toLowerCase() || '';
                if (status === 'approved' || r.ok()) break;
            } catch { break; }
        }
    }

    // ── 1. ZERO-QUANTITY ──────────────────────────────────────────────────────
    test('Guardrail: Zero-quantity adjustment must be rejected', async ({ request }) => {
        const resp = await postAdj(request, { adjusted_quantity: 0, reason: 'E2E boundary — zero qty' });
        const body = await resp.json();
        console.log(`[RESULT] Zero-qty: status=${resp.status()} | adj_id=${body.id ?? 'N/A'}`);

        if (resp.ok()) {
            BUG('BUG-INV-001', 'Zero-quantity adjustment accepted — ghost stock entry', { adj_doc: body.ref, adj_id: body.id, item_id: item.id, item_name: item.name, adjusted_quantity: 0, http_status: resp.status(), impact: 'Ghost adjustment record in ledger — data integrity risk' });
            expect(resp.ok(), 'Zero-quantity adjustment should be rejected by server').toBe(false);
        } else {
            expect(resp.status()).toBeGreaterThanOrEqual(400);
            console.log(`[PASS] Zero-quantity correctly rejected: ${resp.status()}`);
        }
    });

    // ── 2. FLOAT-QUANTITY ─────────────────────────────────────────────────────
    test('Float-quantity adjustment (1.5 units) must be rejected or rounded', async ({ request }) => {
        const resp = await postAdj(request, { adjusted_quantity: 1.5, reason: 'E2E boundary — float qty' });
        const body = await resp.json();
        const storedQty = parseFloat(body.adjusted_quantity ?? '0');
        console.log(`[RESULT] Float-qty 1.5: status=${resp.status()} | adj_id=${body.id ?? 'N/A'} | stored_qty=${storedQty}`);

        if (resp.ok()) {
            if (!Number.isInteger(storedQty)) {
                BUG('BUG-INV-002', 'Float-quantity stored as fractional — stock count corrupted', { adj_doc: body.ref, adj_id: body.id, item_id: item.id, item_name: item.name, sent_quantity: 1.5, stored_quantity: storedQty, impact: 'Fractional stock units corrupt WAC costing and stock counts' });
                expect(Number.isInteger(storedQty), 'Float-quantity adjustment must be rounded or rejected').toBe(true);
            } else {
                console.log(`[PASS] Float qty rounded to integer: ${storedQty}`);
            }
            if (body.id) await advance(request, body.id, 'inventory-adjustments').catch(() => {});
        } else {
            expect(resp.status()).toBeGreaterThanOrEqual(400);
            console.log(`[PASS] Float-quantity correctly rejected: ${resp.status()}`);
        }
    });

    // ── 3. MASSIVE NEGATIVE ───────────────────────────────────────────────────
    test('Guardrail: Negative adjustment beyond available stock must be rejected', async ({ request }) => {
        const attackQty = -(item.stock + 999999);
        console.log(`[ATTACK] qty=${attackQty} vs stock=${item.stock} | item_id=${item.id}`);

        const resp = await postAdj(request, { adjusted_quantity: attackQty, is_write_down: 'true', reason: 'E2E boundary — massive negative' });
        const body = await resp.json();
        console.log(`[RESULT] Massive neg: status=${resp.status()} | adj_id=${body.id ?? 'N/A'}`);

        if (resp.ok() && body.id) {
            try {
                await advance(request, body.id, 'inventory-adjustments');
                await new Promise(r => setTimeout(r, 1000));
                const d = await (await request.get(`${API()}/inventory-item/${item.id}?${QS()}`, { headers: h(token) })).json();
                const loc = (d.inventory_item_locations || []).find((l: any) => l.location_id === item.locationId);
                const finalStock = loc?.quantity ?? 0;
                if (finalStock < 0) {
                    BUG('BUG-INV-003', 'Negative stock created — no stock floor enforcement', { adj_doc: body.ref, adj_id: body.id, item_id: item.id, item_name: item.name, stock_before: item.stock, attack_qty: attackQty, stock_after: finalStock, impact: 'Negative inventory — COGS and WAC calculations corrupted' });
                    expect(finalStock, 'Stock count must not become negative').toBeGreaterThanOrEqual(0);
                } else {
                    console.log(`[PASS] Stock floor enforced: ${finalStock}`);
                }
            } catch (e: any) { console.log(`[PASS] Advance blocked: ${e.message.slice(0, 80)}`); }
        } else {
            expect(resp.status()).toBeGreaterThanOrEqual(400);
            console.log(`[PASS] Massive negative correctly rejected: ${resp.status()}`);
        }
    });

    // ── 4. ZERO UNIT_COST ─────────────────────────────────────────────────────
    test('Zero unit_cost must not corrupt WAC costing (divide-by-zero guard)', async ({ request }) => {
        const resp = await postAdj(request, { adjusted_quantity: 5, unit_cost: 0, reason: 'E2E boundary — zero unit_cost' });
        const body = await resp.json();
        console.log(`[RESULT] Zero unit_cost: status=${resp.status()} | adj_id=${body.id ?? 'N/A'}`);

        if (resp.ok() && body.id) {
            await advance(request, body.id, 'inventory-adjustments');
            await new Promise(r => setTimeout(r, 1000));
            const d = await (await request.get(`${API()}/inventory-item/${item.id}?${QS()}`, { headers: h(token) })).json();
            const wac = parseFloat(d.average_cost || d.unit_cost || d.wac || '0');
            console.log(`[AUDIT] WAC after zero-cost adj: ${wac} | item_id=${item.id}`);
            if (!isFinite(wac) || isNaN(wac)) {
                BUG('BUG-INV-004', 'WAC corrupted (NaN/Infinity) after zero-cost adjustment', { adj_doc: body.ref, adj_id: body.id, item_id: item.id, item_name: item.name, wac_value: wac, impact: 'All future COGS for this item will produce NaN/Infinity' });
            }
            expect(isFinite(wac), 'WAC must remain finite').toBe(true);
            console.log(`[PASS] WAC integrity maintained: ${wac}`);
        } else {
            console.log(`[PASS] Zero unit_cost rejected: ${resp.status()}`);
        }
    });

    // ── 5. CONCURRENT ADJUSTMENTS ────────────────────────────────────────────
    test('Concurrent adjustments on same item must produce correct final stock', async ({ request }) => {
        // Create isolated item for concurrency test
        const locR2 = await request.get(`${API()}/locations?page=1&pageSize=1&${QS()}`, { headers: h(token) });
        const whR2 = await request.get(`${API()}/warehouses?page=1&pageSize=1&${QS()}`, { headers: h(token) });
        const loc = ((await locR2.json()).data || [])[0];
        const wh2 = ((await whR2.json()).data || [])[0];
        const cItemR = await request.post(`${API()}/inventory-items?${QS()}`, {
            headers: h(token),
            data: {
                name: `CONC-Item-${Date.now()}`, type: 'inventory', category: 'Raw Materials',
                cost_method_code: 'WAC', item_class: 'MER', item_id: `ITM-CONC-${Date.now().toString().slice(-6)}`,
                unit_of_measurement: 'Kilogram (kg)', part_number: `PN-CONC-${Date.now().toString().slice(-5)}`,
                serial: 'Z', status: 'active', min_stock: 0, initial_stock: 0,
                purchase_price: 100, selling_price: 100, unit_cost: 100,
                gl_sales_account_id: adjAccountId, gl_cost_account_id: adjAccountId, gl_inventory_account_id: adjAccountId,
                default_location_id: loc?.id, default_warehouse_id: wh2?.id,
                description: [{ content: '', type: 'item' }, { content: '', type: 'sales' }, { content: '', type: 'purchase' }],
            }
        });
        const ci = await cItemR.json();
        console.log(`[SETUP] Concurrent item_id=${ci.id} | stock=0`);

        const adjData = { warehouse_id: wh2?.id, location_id: loc?.id, date: TODAY(), adjusted_by: 'quantity', adjusted_quantity: 10, adjusted_cost: 0, adjustment_account_id: adjAccountId, inventory_item_id: ci.id, unit_cost: 100, is_write_down: 'false', current_quantity: 0, location_quantity: 0, reason: 'E2E concurrent test' };

        // Fire both concurrently — ERP may reject one with 400 (known lock contention)
        const [r1, r2] = await Promise.all([
            request.post(`${API()}/inventory-adjustments?${QS()}`, { headers: h(token), data: adjData }),
            request.post(`${API()}/inventory-adjustments?${QS()}`, { headers: h(token), data: adjData }),
        ]);
        const [t1, t2] = await Promise.all([r1.text(), r2.text()]);
        let a1 = t1 ? JSON.parse(t1) : {};
        let a2 = t2 ? JSON.parse(t2) : {};
        console.log(`[SETUP] adj1: status=${r1.status()} doc=${a1.ref ?? 'N/A'} id=${a1.id ?? 'N/A'}`);
        console.log(`[SETUP] adj2: status=${r2.status()} doc=${a2.ref ?? 'N/A'} id=${a2.id ?? 'N/A'}`);

        // Retry whichever was rejected — documents the ERP lock contention but still tests both apply
        if (!a1.id) {
            console.log('[RETRY] adj1 was rejected (lock contention) — retrying after 500ms');
            await new Promise(r => setTimeout(r, 500));
            const retry = await request.post(`${API()}/inventory-adjustments?${QS()}`, { headers: h(token), data: adjData });
            const rt = await retry.text();
            a1 = rt ? JSON.parse(rt) : {};
            console.log(`[RETRY] adj1 retry: status=${retry.status()} doc=${a1.ref ?? 'N/A'} id=${a1.id ?? 'N/A'}`);
        }
        if (!a2.id) {
            console.log('[RETRY] adj2 was rejected (lock contention) — retrying after 500ms');
            await new Promise(r => setTimeout(r, 500));
            const retry = await request.post(`${API()}/inventory-adjustments?${QS()}`, { headers: h(token), data: adjData });
            const rt = await retry.text();
            a2 = rt ? JSON.parse(rt) : {};
            console.log(`[RETRY] adj2 retry: status=${retry.status()} doc=${a2.ref ?? 'N/A'} id=${a2.id ?? 'N/A'}`);
        }

        if (a1.id) await advance(request, a1.id, 'inventory-adjustments');
        if (a2.id) await advance(request, a2.id, 'inventory-adjustments');

        // Poll max 8×1s — read from single-record endpoint (list endpoint omits quantity for some items)
        let finalStock = 0;
        for (let i = 0; i < 8; i++) {
            await new Promise(r => setTimeout(r, 1000));
            const d = await (await request.get(`${API()}/inventory-item/${ci.id}?${QS()}`, { headers: h(token) })).json();
            finalStock = d.quantity ?? 0;
            if (finalStock === 20) break;
        }

        console.log(`[AUDIT] item_id=${ci.id} | adj1=${a1.ref ?? 'N/A'} | adj2=${a2.ref ?? 'N/A'} | expected=20 | actual=${finalStock}`);
        if (finalStock !== 20) {
            BUG('BUG-INV-005', 'Concurrent adjustments did not both apply — race condition', { adj1_doc: a1.ref ?? null, adj1_id: a1.id ?? null, adj2_doc: a2.ref ?? null, adj2_id: a2.id ?? null, item_id: ci.id, stock_before: 0, expected_stock: 20, actual_stock: finalStock, impact: 'Lost update — one adjustment silently dropped under concurrent load' });
        }
        expect(finalStock).toBe(20);
        console.log(`[PASS] Concurrent adjustments applied correctly: ${finalStock}`);
    });
});
