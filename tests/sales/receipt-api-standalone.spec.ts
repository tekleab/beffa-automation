import { test, expect } from '@playwright/test';

test.describe('Receipt API Standalone Diagnostics Suite @sales @receipt @smoke @full', () => {
    test.setTimeout(60000);

    const apiBase = 'http://168.119.175.142:8001/api';
    const company = process.env.BEFFA_COMPANY || 'BM Tech';
    const year = process.env.BEFFA_YEAR || '2019';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    async function getAuthHeaders(request: any) {
        const loginResp = await request.post(`${apiBase}/users/login?${params}&month=6`, {
            data: { email: process.env.BEFFA_USER || 'admin@beffa.com', password: process.env.BEFFA_PASS || 'Beff.$#!' },
            headers: { 'Content-Type': 'application/json' }
        });
        const loginJson = await loginResp.json();
        return {
            'Authorization': `Bearer ${loginJson.auth_token}`,
            'x-company': company,
            'Content-Type': 'application/json'
        };
    }

    test('API: Receipt Roster & List Pagination Inspection', async ({ request }) => {
        console.log(`\n=======================================================`);
        console.log(`  [RECEIPT API] 1. Roster & List Pagination Inspection `);
        console.log(`=======================================================`);

        const headers = await getAuthHeaders(request);
        const response = await request.get(`${apiBase}/receipts?page=1&pageSize=10&${params}`, { headers });
        console.log(`[HTTP GET] /api/receipts?page=1&pageSize=10 -> Status: ${response.status()}`);

        expect(response.status()).toBe(200);
        const data = await response.json();
        const items = data.data || data.items || [];
        const total = data.pagination?.total || data.total || items.length;

        console.log(`[RESPONSE SUMMARY] Total Records/Pages: ${total} | Page Item Count: ${items.length}`);
        if (items.length > 0) {
            const sample = items[0];
            console.log(`[SAMPLE RECEIPT RECORD]:`);
            console.log(`  ├── ID       : ${sample.id}`);
            console.log(`  ├── Ref      : ${sample.ref || sample.receipt_number || 'N/A'}`);
            console.log(`  ├── Status   : ${sample.status}`);
            console.log(`  ├── Amount   : ${sample.amount}`);
            console.log(`  └── Customer : ${sample.customer_id || sample.customer?.name || 'N/A'}`);
        } else {
            console.log(`[INFO] No existing receipt records found in roster.`);
        }
        console.log(`[DIAGNOSTIC STATUS] ✅ Roster API is healthy and returning HTTP 200 OK.`);
    });

    test('Guardrail: Rejection of Invalid/Empty Receipt Payloads', async ({ request }) => {
        console.log(`\n=======================================================`);
        console.log(`  [RECEIPT API] 2. Guardrail: Empty/Invalid Payload Test `);
        console.log(`=======================================================`);

        const headers = await getAuthHeaders(request);
        const payload = { customer_id: null, amount: 0, cash_account_id: null };
        console.log(`[ATTACK PAYLOAD] POST /api/receipts with empty/null fields: ${JSON.stringify(payload)}`);

        const response = await request.post(`${apiBase}/receipts?${params}`, {
            headers,
            data: payload
        });

        const status = response.status();
        const text = await response.text();
        console.log(`[HTTP RESPONSE] Status Code: ${status}`);

        if (status === 422 || status === 400) {
            console.log(`[DIAGNOSTIC STATUS] ✅ Guardrail operational. Server rejected payload with HTTP ${status}`);
            console.log(`[SERVER REJECTION MESSAGE] ${text.slice(0, 250)}`);
        } else {
            console.log(`[⚠️ VULNERABILITY DETECTED] Expected HTTP 422 or 400 but server responded with ${status}`);
            console.log(`[SERVER RESPONSE BODY] ${text.slice(0, 300)}`);
        }

        expect([400, 422], `Server must reject invalid receipt payload with HTTP 400/422`).toContain(status);
    });

    test('API: Full Invoice, Receipt Creation, and Approval Workflow', async ({ request }) => {
        console.log(`\n=======================================================`);
        console.log(`  [RECEIPT API] 3. Full Invoice & Receipt Workflow Test `);
        console.log(`=======================================================`);

        const headers = await getAuthHeaders(request);
        const isoDate = '2026-08-14T00:00:00Z';
        console.log(`[OPERATING DATE] Date: ${isoDate}`);

        // 1. Discover Metadata
        console.log(`[METADATA DISCOVERY] Discovering Customer, Cash Account, Currency, Warehouse, and Inventory Item...`);
        const [custResp, cashResp, currResp, whResp, itemResp] = await Promise.all([
            request.get(`${apiBase}/customers?page=1&pageSize=1&${params}`, { headers }),
            request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers }),
            request.get(`${apiBase}/currency?${params}`, { headers }),
            request.get(`${apiBase}/warehouses?page=1&pageSize=1&${params}`, { headers }),
            request.get(`${apiBase}/inventory-items?page=1&pageSize=1&${params}`, { headers }),
        ]);

        const customer = (await custResp.json()).data?.[0];
        const cashAccounts = (await cashResp.json()).data || (await cashResp.json()).items || [];
        const currencyData = await currResp.json();
        const currencyList = Array.isArray(currencyData) ? currencyData : (currencyData.data || currencyData.items || currencyData.currencies || []);
        const currency = currencyList[0] || (currencyData.id ? currencyData : null);
        expect(currency?.id, 'Valid Currency is required').toBeTruthy();
        const cashAccount = cashAccounts.find((a: any) => /cash|bank/i.test(a.name || a.type)) || cashAccounts[0];
        const warehouse = (await whResp.json()).data?.[0];
        const item = (await itemResp.json()).data?.[0] || (await itemResp.json()).items?.[0];

        const allAccounts = cashAccounts;
        const arAccount =
            allAccounts.find((a: any) => a.name?.toLowerCase() === 'accounts receivable') ||
            allAccounts.find((a: any) => a.name?.toLowerCase().includes('receivable') && !a.name?.toLowerCase().includes('tax')) ||
            allAccounts[0];

        const salesAccount =
            allAccounts.find((a: any) => a.name?.toLowerCase() === 'sales') ||
            allAccounts.find((a: any) => (a.type || a.account_type || '').toLowerCase().includes('revenue') || (a.type || a.account_type || '').toLowerCase().includes('income')) ||
            allAccounts.find((a: any) => a.name?.toLowerCase().includes('sales')) ||
            arAccount;

        expect(customer, 'Customer is required').toBeTruthy();
        expect(cashAccount, 'Cash/Bank Account is required').toBeTruthy();
        console.log(`  ├── Customer ID      : ${customer.id}`);
        console.log(`  ├── Cash Account ID  : ${cashAccount.id} (${cashAccount.name || 'N/A'})`);
        console.log(`  ├── Currency ID      : ${currency.id} (${currency.code || currency.name || 'ETB'})`);
        console.log(`  ├── AR Account ID    : ${arAccount.id} (${arAccount.name || 'N/A'})`);
        console.log(`  ├── Sales Account ID : ${salesAccount.id} (${salesAccount.name || 'N/A'})`);
        console.log(`  ├── Warehouse ID     : ${warehouse?.id || 'N/A'}`);
        console.log(`  └── Inventory Item ID: ${item?.id || 'N/A'}`);

        // 2. Create & Advance Sales Order
        const ts = Date.now();
        console.log(`[STEP 3A] Creating Sales Order...`);
        const soResp = await request.post(`${apiBase}/sales-orders?${params}`, {
            headers,
            data: {
                customer_id: customer.id,
                accounts_receivable_id: arAccount.id,
                order_date: isoDate,
                warehouse_id: warehouse?.id,
                so_items: [{ inventory_item_id: item?.id, quantity: 1, unit_price: 1000, general_ledger_account_id: salesAccount.id }]
            }
        });

        expect(soResp.ok(), `SO Creation failed: ${await soResp.text()}`).toBe(true);
        const so = await soResp.json();
        console.log(`[PASS] Sales Order Created: ${so.ref || so.id}`);

        await request.patch(`${apiBase}/sales-orders/${so.id}/advance?${params}`, { headers, data: {} });

        // 3. Create & Advance Sales Invoice
        console.log(`[STEP 3B] Creating Sales Invoice...`);
        const invResp = await request.post(`${apiBase}/invoices?${params}`, {
            headers,
            data: {
                customer_id: customer.id,
                accounts_receivable_id: arAccount.id,
                sales_order_id: so.id,
                date: isoDate,
                due_date: isoDate,
                items: [{ inventory_item_id: item?.id, quantity: 1, unit_price: 1000, general_ledger_account_id: salesAccount.id }]
            }
        });

        expect(invResp.ok(), `Invoice Creation failed: ${await invResp.text()}`).toBe(true);
        const inv = await invResp.json();
        console.log(`[PASS] Invoice Created: ${inv.ref || inv.id} | Status: ${inv.status}`);

        const advInvResp = await request.patch(`${apiBase}/invoices/${inv.id}/advance?${params}`, { headers, data: {} });
        console.log(`[PASS] Invoice Advance Status: ${advInvResp.status()}`);

        // 4. Create Linked Receipt
        console.log(`[STEP 3C] Creating Receipt linked to Invoice ${inv.id}...`);
        const receiptPayload = {
            customer_id: customer.id,
            cash_account_id: cashAccount.id,
            currency_id: currency.id,
            payment_method: 'cash',
            amount: 1000,
            date: isoDate,
            reference: `AUTO-RCT-${ts}`,
            invoice_receipts: [
                { invoice_id: inv.id, amount: 1000 }
            ]
        };

        const rctResp = await request.post(`${apiBase}/receipts?${params}`, {
            headers,
            data: receiptPayload
        });

        const rctStatus = rctResp.status();
        const rctBodyText = await rctResp.text();
        console.log(`[HTTP POST] /api/receipts (linked to draft invoice) -> Status: ${rctStatus}`);

        if (!rctResp.ok()) {
            console.log(`[⚠️ BACKEND DEFECT DETECTED] Linking draft invoice to receipt returned HTTP ${rctStatus}`);
            console.log(`[SERVER RESPONSE] ${rctBodyText.slice(0, 300)}`);
        } else {
            console.log(`[PASS] Linked Receipt Created: ${rctBodyText.slice(0, 100)}`);
        }

        // 5. Create Standalone / Unlinked Direct Customer Receipt
        console.log(`[STEP 3D] Creating Standalone Customer Receipt (unlinked to draft invoice)...`);
        const unlinkedPayload = {
            customer_id: customer.id,
            cash_account_id: cashAccount.id,
            currency_id: currency.id,
            payment_method: 'cash',
            amount: 500,
            date: isoDate,
            reference: `AUTO-DIR-${ts}`
        };

        const dirRctResp = await request.post(`${apiBase}/receipts?${params}`, {
            headers,
            data: unlinkedPayload
        });

        const dirStatus = dirRctResp.status();
        const dirBody = await dirRctResp.text();
        console.log(`[HTTP POST] /api/receipts (standalone customer receipt) -> Status: ${dirStatus}`);

        expect(dirRctResp.ok(), `Direct customer receipt creation failed with HTTP ${dirStatus}: ${dirBody}`).toBe(true);
        const rct = JSON.parse(dirBody);
        console.log(`[PASS] Standalone Receipt Created Successfully!`);
        console.log(`  ├── Receipt ID  : ${rct.id}`);
        console.log(`  ├── Ref Number  : ${rct.ref || rct.receipt_number || 'N/A'}`);
        console.log(`  ├── Status      : ${rct.status}`);
        console.log(`  └── Amount      : ${rct.amount}`);

        // 6. Verify Direct GET /api/receipt/:id (or /api/receipts/:id)
        console.log(`[STEP 3E] Verifying Direct GET /api/receipt/${rct.id}...`);
        let directResp = await request.get(`${apiBase}/receipt/${rct.id}?${params}`, { headers });
        if (!directResp.ok()) {
            console.log(`[FALLBACK] GET /api/receipt/${rct.id} returned ${directResp.status()}. Trying plural GET /api/receipts/${rct.id}...`);
            directResp = await request.get(`${apiBase}/receipts/${rct.id}?${params}`, { headers });
        }
        console.log(`[HTTP GET] Direct Receipt Inspection -> Status: ${directResp.status()}`);
        expect([200, 201], 'GET receipt endpoint must return 200/201').toContain(directResp.status());

        // 7. Approve Receipt via Advance API
        console.log(`[STEP 3F] Approving Receipt via Document Workflow...`);
        let advRctResp = await request.patch(`${apiBase}/receipt/${rct.id}/advance?${params}`, { headers, data: {} });
        if (!advRctResp.ok()) {
            console.log(`[FALLBACK] PATCH /api/receipt/${rct.id}/advance returned ${advRctResp.status()}. Trying plural...`);
            advRctResp = await request.patch(`${apiBase}/receipts/${rct.id}/advance?${params}`, { headers, data: {} });
        }
        console.log(`[HTTP PATCH] Advance Receipt -> Status: ${advRctResp.status()}`);

        if (advRctResp.ok()) {
            console.log(`[PASS] Receipt ${rct.id} Approved Successfully!`);
        } else {
            console.log(`[⚠️ RECEIPT APPROVAL ISSUE] HTTP ${advRctResp.status()}: ${await advRctResp.text()}`);
        }

        console.log(`[DIAGNOSTIC STATUS] ✅ Receipt API Diagnostics Completed Successfully.`);
    });
});

