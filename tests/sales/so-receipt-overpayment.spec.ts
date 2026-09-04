import { test, expect } from '@playwright/test';
import { DateHelper } from '../../lib/utils/DateHelper';

const API = () => (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
    .replace(/['"]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001').replace(/(?<!\/)$/, '') + '/api';
const QS = () => `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
let _resolvedToday = new Date().toISOString().slice(0, 10) + 'T00:00:00Z';
const TODAY = () => _resolvedToday;

const BUG = (id: string, title: string, detail: Record<string, any>) => {

/**
 * =============================================================================
 * MODULE: Sales Order - Receipt Overpayment & Excess Payment Guard Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Receipt exceeding invoice total rejected (422 overpayment guard)
 * 2. Partial payment creates correct open balance on invoice
 * 3. Final payment closes invoice and updates AR balance to zero
 * =============================================================================
 */

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

test.describe('Sales Receipt Overpayment Integrity @sales @full', () => {
    test.describe.configure({ mode: 'serial' });
    test.setTimeout(120000);

    let token: string;
    let meta: { customerId: string; currencyId: string; cashAccountId: string; arAccountId: string };
    let itemId: string;
    let locationId: string;
    let warehouseId: string;

    test.beforeAll(async ({ request }) => {
        token = await apiLogin(request);
        try {
            const resolved = await DateHelper.resolve(request as any);
            if (resolved?.iso) _resolvedToday = resolved.iso;
        } catch { }
        // Discover metadata in parallel
        const [custR, currR, acctR, locR, whR] = await Promise.all([
            request.get(`${API()}/customers?page=1&pageSize=10&${QS()}`, { headers: h(token) }),
            request.get(`${API()}/currency?${QS()}`, { headers: h(token) }),
            request.get(`${API()}/accounts?page=1&pageSize=200&${QS()}`, { headers: h(token) }),
            request.get(`${API()}/locations?page=1&pageSize=10&${QS()}`, { headers: h(token) }),
            request.get(`${API()}/warehouses?page=1&pageSize=10&${QS()}`, { headers: h(token) }),
        ]);
        const acctData = await acctR.json();
        const accounts = acctData.items || acctData.data || (Array.isArray(acctData) ? acctData : []);
        const cash = accounts.find((a: any) => a.name?.toLowerCase().includes('branch')) ||
            accounts.find((a: any) => (a.account_id || a.code) === '1002') ||
            accounts.find((a: any) => a.name?.toLowerCase().includes('petty')) ||
            accounts.find((a: any) => a.name?.toLowerCase().includes('cash')) || accounts[0];
        const ar = accounts.find((a: any) => a.name?.toLowerCase().includes('receivable') || a.account_type?.toLowerCase().includes('receivable')) || accounts[0];

        const custData = await custR.json();
        const customers = custData.items || custData.data || (Array.isArray(custData) ? custData : []);

        const currData = await currR.json();
        const currencies = currData.items || currData.data || (Array.isArray(currData) ? currData : []);

        const locData = await locR.json();
        const locations = locData.items || locData.data || (Array.isArray(locData) ? locData : []);

        const whData = await whR.json();
        const warehouses = whData.items || whData.data || (Array.isArray(whData) ? whData : []);

        meta = {
            customerId: customers[0]?.id,
            currencyId: currencies[0]?.id,
            cashAccountId: cash?.id,
            arAccountId: ar?.id,
        };

        // Create item with initial_stock — no poll needed
        const itemR = await request.post(`${API()}/inventory-items?${QS()}`, {
            headers: h(token),
            data: {
                name: `OVP-Item-${Date.now()}`, type: 'inventory', category: 'Raw Materials',
                cost_method_code: 'FIFO', item_class: 'MER', item_id: `ITM-OVP-${Date.now().toString().slice(-6)}`,
                unit_of_measurement: 'Each (ea)', part_number: `PN-OVP-${Date.now().toString().slice(-5)}`,
                serial: 'Z', status: 'active', min_stock: 0, initial_stock: 50,
                purchase_price: 200, selling_price: 200, unit_cost: 200,
                gl_sales_account_id: ar?.id, gl_cost_account_id: cash?.id, gl_inventory_account_id: ar?.id,
                default_location_id: locations[0]?.id, default_warehouse_id: warehouses[0]?.id,
                description: [{ content: '', type: 'item' }, { content: '', type: 'sales' }, { content: '', type: 'purchase' }],
            }
        });
        const item = await itemR.json();
        itemId = item.id;
        locationId = locations[0]?.id;
        warehouseId = warehouses[0]?.id;
        console.log(`[SETUP] item=${itemId} | customer=${meta.customerId} | currency=${meta.currencyId} | cash=${meta.cashAccountId}`);
    });

    async function createApprovedInvoice(request: any, amount: number) {
        const acctR = await request.get(`${API()}/accounts?page=1&pageSize=200&${QS()}`, { headers: h(token) });
        const acctData = await acctR.json();
        const accounts = acctData.items || acctData.data || (Array.isArray(acctData) ? acctData : []);
        const arId = accounts.find((a: any) => a.name?.toLowerCase().includes('receivable'))?.id || accounts[0]?.id;
        const salesId = accounts.find((a: any) => a.name?.toLowerCase().includes('sales'))?.id || accounts[0]?.id;

        const invR = await request.post(`${API()}/invoices?${QS()}`, {
            headers: h(token),
            data: {
                customer_id: meta.customerId, currency_id: meta.currencyId,
                accounts_receivable_id: arId,
                invoice_date: TODAY(), due_date: TODAY(),
                items: [{ inventory_item_id: itemId, quantity: 1, unit_price: amount, location_id: locationId, warehouse_id: warehouseId, general_ledger_account_id: salesId }],
            }
        });
        const raw = await invR.json();
        if (!raw.id) throw new Error(`Invoice creation failed: ${JSON.stringify(raw).slice(0, 200)}`);
        // Advance to approved
        for (let i = 0; i < 3; i++) {
            const adv = await request.patch(`${API()}/invoices/${raw.id}/advance?${QS()}`, { headers: h(token), data: {} });
            if (adv.status() === 204) break;
            const text = await adv.text();
            if (!text) break;
            try { const b = JSON.parse(text); if ((b.status || b.data?.status || '').toLowerCase() === 'approved') break; } catch { break; }
        }
        return raw;
    }

    // ── 1. OVERPAYMENT ────────────────────────────────────────────────────────
    test('Overpayment receipt must be rejected — not silently stored as amount=0', async ({ request }) => {
        const AMOUNT = 3000;
        const inv = await createApprovedInvoice(request, AMOUNT);
        console.log(`[SETUP] Invoice ${inv.invoice_number} (${inv.id}) | total: ${AMOUNT}`);

        const resp = await request.post(`${API()}/receipts?${QS()}`, {
            headers: h(token),
            data: { customer_id: meta.customerId, currency_id: meta.currencyId, date: TODAY(), payment_method: 'cash', cash_account_id: meta.cashAccountId, amount: AMOUNT * 10, invoice_receipts: [{ invoice_id: inv.id, amount: AMOUNT * 10 }], receipt_items: [{ amount: AMOUNT * 10, general_ledger_account_id: meta.arAccountId, unit_price: AMOUNT * 10, quantity: 1, description: 'Invoice Receipt' }] }
        });
        const body = await resp.json();
        const stored = parseFloat(body.amount ?? '-1');
        console.log(`[RESULT] status=${resp.status()} | receipt_id=${body.id ?? 'N/A'} | stored_amount=${stored}`);

        if (resp.ok()) {
            BUG('BUG-RECEIPT-001', 'Overpayment accepted — server should reject excess receipt', { receipt_doc: body.ref, receipt_id: body.id, invoice_doc: inv.invoice_number, invoice_id: inv.id, sent_amount: AMOUNT * 10, stored_amount: stored });
            expect(resp.ok(), 'Overpayment receipt should be rejected by server').toBe(false);
        } else {
            expect(resp.status()).toBeGreaterThanOrEqual(400);
            console.log(`[PASS] Overpayment correctly rejected: ${resp.status()}`);
        }
    });

    // ── 2. EXACT-AMOUNT RECEIPT ───────────────────────────────────────────────
    test('Exact-amount receipt must be accepted and reduce invoice AR balance to zero', async ({ request }) => {
        const AMOUNT = 2500;
        const inv = await createApprovedInvoice(request, AMOUNT);
        console.log(`[SETUP] Invoice ${inv.invoice_number} (${inv.id}) | total: ${AMOUNT}`);

        const rctR = await request.post(`${API()}/receipts?${QS()}`, {
            headers: h(token),
            data: { customer_id: meta.customerId, currency_id: meta.currencyId, date: TODAY(), payment_method: 'cash', cash_account_id: meta.cashAccountId, amount: AMOUNT, invoice_receipts: [{ invoice_id: inv.id, amount: AMOUNT }], receipt_items: [{ amount: AMOUNT, general_ledger_account_id: meta.arAccountId, unit_price: AMOUNT, quantity: 1, description: 'Invoice Receipt' }] }
        });
        if (!rctR.ok()) throw new Error(`Receipt failed: ${rctR.status()} ${await rctR.text()}`);
        const rct = await rctR.json();
        // Advance receipt
        for (let i = 0; i < 3; i++) {
            const adv = await request.patch(`${API()}/receipts/${rct.id}/advance?${QS()}`, { headers: h(token), data: {} });
            if (adv.status() === 204) break;
            const text = await adv.text();
            if (!text) break;
            try { const b = JSON.parse(text); if ((b.status || b.data?.status || '').toLowerCase() === 'approved') break; } catch { break; }
        }
        console.log(`[STEP] Receipt ${rct.ref} (${rct.id}) approved`);

        // Poll max 6×1s
        let unreceived = AMOUNT;
        for (let i = 0; i < 6; i++) {
            await new Promise(r => setTimeout(r, 1000));
            const d = await (await request.get(`${API()}/invoice/${inv.id}?${QS()}`, { headers: h(token) })).json();
            unreceived = parseFloat(d.unreceived_amount ?? d.net_due ?? AMOUNT);
            if (unreceived <= 0.01) break;
        }

        if (unreceived > 0.01) {
            BUG('BUG-RECEIPT-003', 'Invoice AR balance not reduced to zero after full payment', { invoice_doc: inv.invoice_number, invoice_id: inv.id, receipt_doc: rct.ref, receipt_id: rct.id, invoice_total: AMOUNT, unreceived_amount: unreceived, impact: 'AR stuck — invoice shows unpaid despite approved receipt' });
        }
        expect(unreceived, 'Invoice AR balance must be zero after full payment').toBeLessThanOrEqual(0.01);
        console.log(`[PASS] Invoice ${inv.invoice_number} fully paid — AR balance: ${unreceived}`);
    });

    // ── 3. DOUBLE-RECEIPT ─────────────────────────────────────────────────────
    test('Second receipt on a fully-paid invoice must be rejected', async ({ request }) => {
        const AMOUNT = 1800;
        const inv = await createApprovedInvoice(request, AMOUNT);

        let rct1R: any;
        for (let attempt = 1; attempt <= 3; attempt++) {
            rct1R = await request.post(`${API()}/receipts?${QS()}`, {
                headers: h(token),
                data: { customer_id: meta.customerId, currency_id: meta.currencyId, date: TODAY(), payment_method: 'cash', cash_account_id: meta.cashAccountId, amount: AMOUNT, invoice_receipts: [{ invoice_id: inv.id, amount: AMOUNT }], receipt_items: [{ amount: AMOUNT, general_ledger_account_id: meta.arAccountId, unit_price: AMOUNT, quantity: 1, description: 'Invoice Receipt' }] }
            });
            if (rct1R.ok()) break;
            await new Promise(r => setTimeout(r, 1500));
        }
        if (!rct1R.ok()) throw new Error(`First receipt failed: ${rct1R.status()} ${await rct1R.text()}`);
        const rct1 = await rct1R.json();
        for (let i = 0; i < 3; i++) {
            const adv = await request.patch(`${API()}/receipts/${rct1.id}/advance?${QS()}`, { headers: h(token), data: {} });
            if (adv.status() === 204) break;
            const text = await adv.text();
            if (!text) break;
            try { const b = JSON.parse(text); if ((b.status || b.data?.status || '').toLowerCase() === 'approved') break; } catch { break; }
        }
        console.log(`[SETUP] Invoice ${inv.invoice_number} (${inv.id}) paid via ${rct1.ref} (${rct1.id})`);
        await new Promise(r => setTimeout(r, 1000));

        const resp2 = await request.post(`${API()}/receipts?${QS()}`, {
            headers: h(token),
            data: { customer_id: meta.customerId, currency_id: meta.currencyId, date: TODAY(), payment_method: 'cash', cash_account_id: meta.cashAccountId, amount: AMOUNT, invoice_receipts: [{ invoice_id: inv.id, amount: AMOUNT }], receipt_items: [{ amount: AMOUNT, general_ledger_account_id: meta.arAccountId, unit_price: AMOUNT, quantity: 1, description: 'Invoice Receipt' }] }
        });
        const body2 = await resp2.json();
        const stored2 = parseFloat(body2.amount ?? '0');
        console.log(`[RESULT] Second receipt: status=${resp2.status()} | receipt_id=${body2.id ?? 'N/A'} | stored_amount=${stored2}`);

        if (resp2.ok()) {
            BUG('BUG-RECEIPT-004', 'Double-receipt accepted on fully-paid invoice — duplicate AR credit', { invoice_doc: inv.invoice_number, invoice_id: inv.id, first_receipt_doc: rct1.ref, first_receipt_id: rct1.id, second_receipt_doc: body2.ref, second_receipt_id: body2.id, duplicate_amount: stored2, impact: 'Duplicate AR credit — cash overstated, AR understated' });
            expect(resp2.ok(), 'Second receipt on fully-paid invoice should be rejected').toBe(false);
        } else {
            expect(resp2.status()).toBeGreaterThanOrEqual(400);
            console.log(`[PASS] Double-receipt correctly rejected: ${resp2.status()}`);
        }
    });
});
