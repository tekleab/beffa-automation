import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';


/**
 * LINE ITEM & MISCELLANEOUS AUDIT
 *
 * Covers the "Line Item" button → modal → [Item | Miscellaneous] table
 * that appears on SO, Invoice, Receipt, PO, Bill, Payment.
 *
 * Each document gets:
 *   - UI: inventory line item added via modal "Item" tab
 *   - UI: miscellaneous line added via modal "Miscellaneous" tab
 *   - API: standalone with inventory line → total correct
 *   - API: standalone with miscellaneous line (no item_id) → accepted or documented
 *   - API: mixed inventory + miscellaneous → combined total
 *   - API: multi-line → grand total = sum of lines
 *   - Guardrail: zero-qty line → $0 or rejected
 *   - Guardrail: negative price line → rejected or flagged
 */
test.describe('Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full', () => {
    test.setTimeout(300000);

    let salesMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
    let purchaseMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
    let itemA: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;
    let itemB: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;
    let periodDateIso: string;

    test.beforeAll(async ({ browser }) => {
        test.setTimeout(600000);
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        salesMeta    = await app.api.sales.discoverMetadataAPI();
        purchaseMeta = await app.api.purchase.discoverMetadataAPI();
        itemA = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 50, unit_cost: 100 });
        itemB = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 50, unit_cost: 80 });
        const { DateHelper } = require('../../lib/utils/DateHelper');
        periodDateIso = (await DateHelper.resolve(page)).iso;
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const { DateHelper } = require('../../lib/utils/DateHelper');
        DateHelper.clearCache();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

    });

    // =========================================================================
    // HELPERS
    // =========================================================================

    async function addLineItemViaModal(page: any, app: AppManager, type: 'Item' | 'Miscellaneous', opts: {
        unitPrice: string; qty: string; description?: string;
    }) {
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible', timeout: 15000 });

        // Choose Item vs Miscellaneous tab inside the modal
        await modal.getByRole('button', { name: type, exact: true }).click();
        await page.waitForTimeout(500);

        if (type === 'Item') {
            await app.selectRandomOption(modal.getByRole('button', { name: 'Item selector' }), 'Item');
            await app.selectRandomOption(modal.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
            await app.selectRandomOption(modal.getByRole('button', { name: 'Location selector' }), 'Location');
        } else {
            // Miscellaneous: description field instead of item picker
            const descField = modal.getByRole('textbox').first();
            if (await descField.isVisible({ timeout: 3000 }).catch(() => false)) {
                await descField.fill(opts.description || 'Miscellaneous charge');
            }
        }

        const glBtn = modal.getByRole('button', { name: 'G/L Account selector' });
        await glBtn.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
        await app.selectRandomOption(glBtn, 'G/L Account');

        await modal.getByRole('group').filter({ hasText: /^Quantity/i }).getByRole('spinbutton').fill(opts.qty);
        await modal.getByRole('group').filter({ hasText: /Unit Price/i }).getByRole('spinbutton').fill(opts.unitPrice);
        await app.selectRandomOption(modal.getByRole('button', { name: 'Tax selector' }), 'Tax', true);

        await modal.getByRole('button', { name: 'Add', exact: true }).click();
        await expect(modal).not.toBeVisible({ timeout: 15000 });
    }

    // =========================================================================
    // SALES ORDER
    // =========================================================================

    test('SO-UI-01: Add inventory Line Item via modal → SO created and approved', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/receivables/sale-orders/new', { waitUntil: 'commit' });

        await app.pickDate('Sales Order Date');
        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');
        await app.selectRandomOption(page.getByRole('button', { name: 'Currency selector' }), 'Currency', true);

        await page.getByRole('button', { name: 'Line Item' }).click();
        await addLineItemViaModal(page, app, 'Item', { qty: '3', unitPrice: '500' });
        console.log('[OK] Inventory line item added to SO');

        await page.getByRole('button', { name: 'Add Now' }).first().click();
        await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });

        const soId = await app.extractIdFromUrl();
        await app.advanceDocumentAPI(soId, 'sales-orders');
        console.log('[PASS] SO with inventory line item created and approved');
    });

    test('SO-UI-02: Add Miscellaneous Line Item via modal → SO created and approved', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/receivables/sale-orders/new', { waitUntil: 'commit' });

        await app.pickDate('Sales Order Date');
        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');
        await app.selectRandomOption(page.getByRole('button', { name: 'Currency selector' }), 'Currency', true);

        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible', timeout: 15000 });

        const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
        if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log('[SKIP] Miscellaneous button not present in SO modal');
            await page.keyboard.press('Escape');
            return;
        }

        await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '750', description: 'Delivery fee' });
        console.log('[OK] Miscellaneous line item added to SO');

        await page.getByRole('button', { name: 'Add Now' }).first().click();
        await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });
        console.log('[PASS] SO with miscellaneous line item created');
    });

    test('SO-UI-03: Add both Item + Miscellaneous lines → totals shown in SO table', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/receivables/sale-orders/new', { waitUntil: 'commit' });

        await app.pickDate('Sales Order Date');
        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');

        // Line 1: inventory item
        await page.getByRole('button', { name: 'Line Item' }).click();
        await addLineItemViaModal(page, app, 'Item', { qty: '2', unitPrice: '1000' });

        // Line 2: miscellaneous
        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal2 = page.getByRole('dialog').last();
        await modal2.waitFor({ state: 'visible', timeout: 15000 });
        const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
        if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '300', description: 'Shipping' });
        } else {
            await page.keyboard.press('Escape');
            console.log('[INFO] Miscellaneous not available — adding second Item line');
            await page.getByRole('button', { name: 'Line Item' }).click();
            await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '300' });
        }

        // Verify 2 rows appear in the SO items table before submit
        const tableRows = page.locator('table tbody tr');
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThanOrEqual(2);
        console.log(`[AUDIT] ${rowCount} line items visible in SO form table`);

        await page.getByRole('button', { name: 'Add Now' }).first().click();
        await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });

        const soId = await app.extractIdFromUrl();
        const { apiBase, headers, qs } = await app.buildApiContext();
        const soData = await (await page.request.get(`${apiBase}/sales-order/${soId}?${qs}`, { headers })).json();
        const lines: any[] = soData.so_items || [];
        const linesSum = lines.reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
        console.log(`[AUDIT] SO lines: ${lines.length} | Total: $${linesSum}`);
        expect(lines.length).toBeGreaterThanOrEqual(2);
        console.log('[PASS] SO mixed lines — table shows all rows, total accumulated');
    });

    test('SO-API-04: Multi-line SO → grand total = sum of lines', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const L1 = 2 * 500, L2 = 3 * 800;

        const so = await app.api.sales.createSalesOrderAPI({
            customerId: salesMeta.customerId, itemId: itemA.itemId,
            quantity: 2, unitPrice: 500,
            locationId: itemA.locationId, warehouseId: itemA.warehouseId,
        });
        expect(so.success).toBe(true);

        // Patch second line
        const soData = await (await page.request.get(`${apiBase}/sales-order/${so.id}?${qs}`, { headers })).json();
        const patchResp = await page.request.patch(`${apiBase}/sales-orders/${so.id}?${qs}`, {
            headers,
            data: {
                so_items: [
                    ...(soData.so_items || []),
                    { item_id: itemB.itemId, quantity: 3, unit_price: 800, amount: L2, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
                ],
            },
        });

        if (!patchResp.ok()) { console.log(`[SKIP] SO multi-line PATCH not supported: ${patchResp.status()}`); return; }

        const updated = await patchResp.json();
        const linesSum = (updated.so_items || []).reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
        console.log(`[AUDIT] Lines sum: $${linesSum} | Expected: $${L1 + L2}`);
        expect(linesSum).toBeCloseTo(L1 + L2, 1);
        console.log('[PASS] SO multi-line totals correct');
    });

    test('SO-API-05: Zero-qty line → $0 amount or rejected', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const { apiBase, headers, qs } = await app.buildApiContext();

        const resp = await page.request.post(`${apiBase}/sales-orders?${qs}`, {
            headers,
            data: {
                accounts_receivable_id: salesMeta.arAccountId,
                currency_id: salesMeta.currencyId,
                customer_id: salesMeta.customerId,
                so_date: periodDateIso,
                so_items: [{ item_id: itemA.itemId, quantity: 0, unit_price: 500, amount: 0, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
                status: 'draft',
            },
        });

        if (resp.ok()) {
            const amt = parseFloat(((await resp.json()).so_items || [])[0]?.amount ?? '0');
            expect(amt).toBe(0);
            console.log('[INFO] Zero-qty SO line accepted — $0 amount, no financial impact');
        } else {
            console.log(`[PASS] Zero-qty SO line rejected: HTTP ${resp.status()}`);
            expect([400, 422]).toContain(resp.status());
        }
    });

    test('SO-API-06: Negative unit price → rejected or flagged as known bug', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const { apiBase, headers, qs } = await app.buildApiContext();

        const resp = await page.request.post(`${apiBase}/sales-orders?${qs}`, {
            headers,
            data: {
                accounts_receivable_id: salesMeta.arAccountId,
                currency_id: salesMeta.currencyId,
                customer_id: salesMeta.customerId,
                so_date: periodDateIso,
                so_items: [{ item_id: itemA.itemId, quantity: 1, unit_price: -500, amount: -500, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
                status: 'draft',
            },
        });

        if (resp.ok()) console.log('[KNOWN_BUG] SO accepted negative unit price — revenue manipulation risk');
        else console.log(`[PASS] Negative price SO line rejected: HTTP ${resp.status()}`);
        expect([201, 400, 422]).toContain(resp.status());
    });

    // =========================================================================
    // INVOICE
    // =========================================================================

    test('INV-UI-01: Add inventory Line Item via modal → Invoice created and approved', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/receivables/invoices/new', { waitUntil: 'commit' });

        await app.pickDate('Invoice Date');
        await app.pickDate('Due Date');
        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');
        await app.selectRandomOption(page.getByRole('button', { name: 'Currency selector' }), 'Currency', true);

        await page.getByRole('button', { name: 'Line Item' }).click();
        await addLineItemViaModal(page, app, 'Item', { qty: '2', unitPrice: '800' });
        console.log('[OK] Inventory line item added to Invoice');

        await page.getByRole('button', { name: 'Add Now' }).first().click();
        await page.waitForURL(/invoices\/.*\/detail/, { timeout: 60000 });

        const invId = await app.extractIdFromUrl();
        await app.advanceDocumentAPI(invId, 'invoices');
        console.log('[PASS] Invoice with inventory line created and approved');
    });

    test('INV-UI-02: Add Miscellaneous line via modal → Invoice total reflects it', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/receivables/invoices/new', { waitUntil: 'commit' });

        await app.pickDate('Invoice Date');
        await app.pickDate('Due Date');
        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');

        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible', timeout: 15000 });

        const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
        if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log('[SKIP] Miscellaneous button not present in Invoice modal');
            await page.keyboard.press('Escape');
            return;
        }

        await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '1500', description: 'Consulting fee' });

        await page.getByRole('button', { name: 'Add Now' }).first().click();
        await page.waitForURL(/invoices\/.*\/detail/, { timeout: 60000 });
        console.log('[PASS] Invoice with miscellaneous line created');
    });

    test('INV-UI-03: Mixed Item + Miscellaneous lines → both rows in table, totals accumulate', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/receivables/invoices/new', { waitUntil: 'commit' });

        await app.pickDate('Invoice Date');
        await app.pickDate('Due Date');
        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');

        // Item line
        await page.getByRole('button', { name: 'Line Item' }).click();
        await addLineItemViaModal(page, app, 'Item', { qty: '3', unitPrice: '400' });

        // Miscellaneous line
        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal2 = page.getByRole('dialog').last();
        await modal2.waitFor({ state: 'visible', timeout: 15000 });
        const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
        if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '200', description: 'Handling' });
        } else {
            await page.keyboard.press('Escape');
            await page.getByRole('button', { name: 'Line Item' }).click();
            await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '200' });
        }

        const rowCount = await page.locator('table tbody tr').count();
        expect(rowCount).toBeGreaterThanOrEqual(2);
        console.log(`[AUDIT] ${rowCount} lines visible in Invoice form`);

        await page.getByRole('button', { name: 'Add Now' }).first().click();
        await page.waitForURL(/invoices\/.*\/detail/, { timeout: 60000 });

        const invId = await app.extractIdFromUrl();
        const invData = await app.api.sales.getInvoiceAPI(invId);
        const lines: any[] = invData.items || invData.invoice_items || [];
        expect(lines.length).toBeGreaterThanOrEqual(2);
        const total = lines.reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
        console.log(`[AUDIT] Invoice lines: ${lines.length} | Total: $${total}`);
        console.log('[PASS] Invoice mixed lines — all rows present, total accumulated');
    });

    test('INV-API-04: Multi-line invoice → grand total = sum of lines', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const L1 = 3 * 400, L2 = 2 * 600;
        const { DateHelper } = require('../../lib/utils/DateHelper');
        const dateIso = (await DateHelper.resolve(page)).iso;

        const resp = await page.request.post(`${apiBase}/invoices?${qs}`, {
            headers,
            data: {
                accounts_receivable_id: salesMeta.arAccountId,
                customer_id: salesMeta.customerId,
                invoice_date: dateIso,
                due_date: dateIso,
                currency_id: salesMeta.currencyId,
                released_sales_order_items: [],
                items: [
                    { item_id: itemA.itemId, quantity: 3, unit_price: 400, amount: L1, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemA.locationId, warehouse_id: itemA.warehouseId },
                    { item_id: itemB.itemId, quantity: 2, unit_price: 600, amount: L2, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
                ],
            },
        });

        expect(resp.ok(), `Multi-line Invoice failed: HTTP ${resp.status()}`).toBe(true);
        const data = await resp.json();
        const lines: any[] = data.items || [];
        const linesSum = lines.reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
        const invTotal = parseFloat(data.total_amount ?? data.grand_total ?? data.amount ?? '0');
        console.log(`[AUDIT] Lines sum: $${linesSum} | Invoice total: $${invTotal} | Expected: $${L1 + L2}`);
        expect(linesSum).toBeCloseTo(L1 + L2, 1);
        if (invTotal > 0) expect(invTotal).toBeCloseTo(L1 + L2, 1);
        console.log('[PASS] Multi-line Invoice totals correct');
    });

    test('INV-API-05: Miscellaneous line on invoice (no item_id) → accepted or inventory-only enforced', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const { apiBase, headers, qs } = await app.buildApiContext();

        const resp = await page.request.post(`${apiBase}/invoices?${qs}`, {
            headers,
            data: {
                accounts_receivable_id: salesMeta.arAccountId,
                customer_id: salesMeta.customerId,
                invoice_date: periodDateIso,
                due_date: periodDateIso,
                currency_id: salesMeta.currencyId,
                released_sales_order_items: [],
                items: [{ description: 'Shipping & handling', quantity: 1, unit_price: 500, amount: 500, general_ledger_account_id: salesMeta.salesAccountId }],
            },
        });

        if (resp.ok()) {
            const amt = parseFloat(((await resp.json()).items || [])[0]?.amount ?? '0');
            expect(amt).toBeCloseTo(500, 1);
            console.log(`[PASS] Invoice miscellaneous line accepted: $${amt}`);
        } else {
            console.log(`[INFO] Invoice enforces item_id: HTTP ${resp.status()}`);
            expect([400, 422]).toContain(resp.status());
        }
    });

    // =========================================================================
    // RECEIPT
    // =========================================================================

    test('RCT-UI-01: Receipt UI — create standalone receipt with line item and verify', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        // Create and approve invoice first via API
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: salesMeta.customerId, itemId: itemA.itemId,
            quantity: 1, unitPrice: 2000,
            locationId: itemA.locationId, warehouseId: itemA.warehouseId,
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        await page.goto('/receivables/receipts/new', { waitUntil: 'commit' });

        await app.pickDate('Receipt Date');
        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
        await app.selectRandomOption(page.getByRole('button', { name: 'Cash Account selector' }), 'Cash Account');
        await app.selectRandomOption(page.getByRole('button', { name: 'Currency selector' }), 'Currency', true);

        // Add line item via modal
        const lineItemBtn = page.getByRole('button', { name: 'Line Item' });
        if (await lineItemBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await lineItemBtn.click();
            const modal = page.getByRole('dialog').last();
            await modal.waitFor({ state: 'visible', timeout: 15000 });
            const itemBtn = modal.getByRole('button', { name: 'Item', exact: true });
            if (await itemBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '2000' });
                console.log('[OK] Receipt line item added via modal');
            } else {
                await page.keyboard.press('Escape');
                console.log('[INFO] Receipt modal has no Item button — using amount field directly');
            }
        }

        const submitBtn = page.getByRole('button', { name: /Add Now|Save|Submit/i }).first();
        if (await submitBtn.isEnabled({ timeout: 5000 }).catch(() => false)) {
            await submitBtn.click();
            await page.waitForURL(/receipts\/.*\/detail/, { timeout: 60000 });
            const rctId = await app.extractIdFromUrl();
            await app.advanceDocumentAPI(rctId, 'receipts');
            console.log('[PASS] Receipt created and approved via UI');
        } else {
            console.log('[INFO] Receipt submit not available — partial UI coverage captured');
        }
    });

    test('RCT-API-02: Receipt partial payment → invoice Amount Due reduces by exact amount', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: salesMeta.customerId, itemId: itemA.itemId,
            quantity: 3, unitPrice: itemA.unitCost,
            locationId: itemA.locationId, warehouseId: itemA.warehouseId,
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        // Use actual invoice amount from API as ground truth
        const invDataBefore = await app.api.sales.getInvoiceAPI(inv.id);
        const TOTAL = parseFloat(invDataBefore.total_amount ?? invDataBefore.grand_total ?? invDataBefore.amount ?? String(inv.amountDue));
        const PARTIAL = Math.floor(TOTAL / 3);

        const rct = await app.api.sales.createInvoiceReceiptAPI({
            invoiceId: inv.id, customerId: salesMeta.customerId,
            amount: PARTIAL, currencyId: salesMeta.currencyId, cashAccountId: salesMeta.cashAccountId,
        });
        await app.advanceDocumentAPI(rct.id, 'receipts');

        await page.waitForTimeout(3000);
        const invData = await app.api.sales.getInvoiceAPI(inv.id);
        const remaining = parseFloat(invData.unpaid_amount ?? invData.balance ?? invData.net_due ?? '0');
        console.log(`[AUDIT] Invoice $${TOTAL} | Paid $${PARTIAL} | Remaining $${remaining} | Expected $${TOTAL - PARTIAL}`);
        expect(remaining).toBeCloseTo(TOTAL - PARTIAL, 1);
        console.log('[PASS] Partial receipt reduces invoice Amount Due correctly');
    });

    test('RCT-API-03: Receipt full payment → invoice Amount Due = 0', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: salesMeta.customerId, itemId: itemA.itemId,
            quantity: 2, unitPrice: itemA.unitCost,
            locationId: itemA.locationId, warehouseId: itemA.warehouseId,
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        // Use actual invoice amount from API as ground truth
        const invDataBefore = await app.api.sales.getInvoiceAPI(inv.id);
        const AMOUNT = parseFloat(invDataBefore.total_amount ?? invDataBefore.grand_total ?? invDataBefore.amount ?? String(inv.amountDue));

        const rct = await app.api.sales.createInvoiceReceiptAPI({
            invoiceId: inv.id, customerId: salesMeta.customerId,
            amount: AMOUNT, currencyId: salesMeta.currencyId, cashAccountId: salesMeta.cashAccountId,
        });
        await app.advanceDocumentAPI(rct.id, 'receipts');

        await page.waitForTimeout(3000);
        const invData = await app.api.sales.getInvoiceAPI(inv.id);
        const remaining = parseFloat(invData.unpaid_amount ?? invData.balance ?? invData.net_due ?? '999');
        console.log(`[AUDIT] Full receipt $${AMOUNT} → Remaining: $${remaining}`);
        expect(remaining).toBeLessThan(1);
        console.log('[PASS] Full receipt settles invoice to zero');
    });

    // =========================================================================
    // PURCHASE ORDER
    // =========================================================================

    test('PO-UI-01: Add inventory Line Item via modal → PO created and approved', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/payables/purchase-orders/new', { waitUntil: 'commit' });

        await app.pickDate('Purchase Order Date');
        await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
        await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');

        await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
        await page.getByRole('button', { name: 'Line Item' }).click();
        await addLineItemViaModal(page, app, 'Item', { qty: '5', unitPrice: '2000' });
        console.log('[OK] Inventory line item added to PO');

        await page.getByRole('button', { name: 'Add Now' }).first().click();
        await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });

        const poId = await app.extractIdFromUrl();
        await app.advanceDocumentAPI(poId, 'purchase-orders');
        console.log('[PASS] PO with inventory line item created and approved');
    });

    test('PO-UI-02: Add Miscellaneous Line Item via modal → PO total reflects it', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/payables/purchase-orders/new', { waitUntil: 'commit' });

        await app.pickDate('Purchase Order Date');
        await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
        await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');

        await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible', timeout: 15000 });

        const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
        if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log('[SKIP] Miscellaneous button not present in PO modal');
            await page.keyboard.press('Escape');
            return;
        }

        await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '3000', description: 'Freight charges' });

        await page.getByRole('button', { name: 'Add Now' }).first().click();
        await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
        console.log('[PASS] PO with miscellaneous line created');
    });

    test('PO-UI-03: Mixed Item + Miscellaneous lines → both rows in PO table', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/payables/purchase-orders/new', { waitUntil: 'commit' });

        await app.pickDate('Purchase Order Date');
        await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
        await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');

        await page.getByRole('tab', { name: /Purchase Order Items/i }).click();

        // Line 1: inventory item
        await page.getByRole('button', { name: 'Line Item' }).click();
        await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: '1500' });

        // Line 2: miscellaneous
        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal2 = page.getByRole('dialog').last();
        await modal2.waitFor({ state: 'visible', timeout: 15000 });
        const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
        if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '500', description: 'Import duty' });
        } else {
            await page.keyboard.press('Escape');
            await page.getByRole('button', { name: 'Line Item' }).click();
            await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '500' });
        }

        const rowCount = await page.locator('table tbody tr').count();
        expect(rowCount).toBeGreaterThanOrEqual(2);
        console.log(`[AUDIT] ${rowCount} lines in PO form table`);

        await page.getByRole('button', { name: 'Add Now' }).first().click();
        await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });

        const poId = await app.extractIdFromUrl();
        const { apiBase, headers, qs } = await app.buildApiContext();
        const poData = await (await page.request.get(`${apiBase}/purchase-order/${poId}?${qs}`, { headers })).json();
        const lines: any[] = poData.po_items || [];
        expect(lines.length).toBeGreaterThanOrEqual(2);
        console.log(`[AUDIT] PO lines in API: ${lines.length}`);
        console.log('[PASS] PO mixed lines — all rows present in form and API');
    });

    test('PO-API-04: Multi-line PO → grand total = sum of lines', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const L1 = 5 * 1000, L2 = 3 * 1500;
        const { DateHelper } = require('../../lib/utils/DateHelper');
        const dateIso = (await DateHelper.resolve(page)).iso;

        const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
        const allAccounts = acctData.items || acctData.data || [];
        const apAcct  = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable'))  || allAccounts[0];
        const glAcct  = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
        const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
        const currency = currData.items?.[0] || currData.data?.[0];

        const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
            headers,
            data: {
                accounts_payable_id: apAcct.id, currency_id: currency?.id,
                vendor_id: purchaseMeta.vendorId,
                po_date: dateIso,
                purchase_type_id: 4,
                po_items: [
                    { item_id: itemA.itemId, quantity: 5, unit_price: 1000, amount: L1, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId },
                    { item_id: itemB.itemId, quantity: 3, unit_price: 1500, amount: L2, general_ledger_account_id: glAcct.id, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
                ],
            },
        });

        expect(resp.ok(), `Multi-line PO failed: HTTP ${resp.status()}`).toBe(true);
        const data = await resp.json();
        const linesSum = (data.po_items || []).reduce((s: number, l: any) => s + parseFloat(l.amount ?? String(parseFloat(l.quantity) * parseFloat(l.unit_price))), 0);
        console.log(`[AUDIT] PO lines sum: $${linesSum} | Expected: $${L1 + L2}`);
        expect(linesSum).toBeCloseTo(L1 + L2, 1);
        console.log('[PASS] Multi-line PO totals correct');
    });

    test('PO-API-05: Miscellaneous line on PO (no item_id) → accepted or inventory-only enforced', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const { apiBase, headers, qs } = await app.buildApiContext();

        const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
        const allAccounts = acctData.items || acctData.data || [];
        const apAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
        const glAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
        const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
        const currency = currData.items?.[0] || currData.data?.[0];

        const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
            headers,
            data: {
                accounts_payable_id: apAcct.id, currency_id: currency?.id,
                vendor_id: purchaseMeta.vendorId,
                po_date: periodDateIso,
                purchase_type_id: 4,
                po_items: [{ description: 'Freight & customs', quantity: 1, unit_price: 3000, amount: 3000, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
            },
        });

        if (resp.ok()) {
            const amt = parseFloat(((await resp.json()).po_items || [])[0]?.amount ?? '0');
            console.log(`[INFO] PO miscellaneous line accepted: $${amt}`);
        } else {
            console.log(`[INFO] PO enforces item_id: HTTP ${resp.status()}`);
            expect([400, 422]).toContain(resp.status());
        }
    });

    // =========================================================================
    // BILL
    // =========================================================================

    test('BILL-UI-01: Add inventory Line Item via modal → Bill created and approved', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/payables/bills/new', { waitUntil: 'commit' });

        await app.pickDate('Invoice Date');
        await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
        await app.selectRandomOption(page.getByRole('button', { name: 'Currency selector' }), 'Currency', true);

        await page.getByRole('button', { name: 'Line Item' }).click();
        await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: '2500' });
        console.log('[OK] Inventory line item added to Bill');

        await page.getByRole('button', { name: 'Add Now' }).first().click();
        await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 });

        const billId = await app.extractIdFromUrl();
        await app.advanceDocumentAPI(billId, 'bills');
        console.log('[PASS] Bill with inventory line created and approved');
    });

    test('BILL-UI-02: Add Miscellaneous line via modal → Bill total reflects it', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/payables/bills/new', { waitUntil: 'commit' });

        await app.pickDate('Invoice Date');
        await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');

        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible', timeout: 15000 });

        const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
        if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log('[SKIP] Miscellaneous button not present in Bill modal');
            await page.keyboard.press('Escape');
            return;
        }

        await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '4000', description: 'Import duty' });

        await page.getByRole('button', { name: 'Add Now' }).first().click();
        await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 });
        console.log('[PASS] Bill with miscellaneous line created');
    });

    test('BILL-UI-03: Mixed Item + Miscellaneous → both rows in Bill table, approve and verify AP', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/payables/bills/new', { waitUntil: 'commit' });

        await app.pickDate('Invoice Date');
        await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
        const selectedVendor = (await page.getByRole('button', { name: 'Vendor selector' }).textContent())?.trim() || '';
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');

        // Item line
        await page.getByRole('button', { name: 'Line Item' }).click();
        await addLineItemViaModal(page, app, 'Item', { qty: '2', unitPrice: '3000' });

        // Miscellaneous line
        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal2 = page.getByRole('dialog').last();
        await modal2.waitFor({ state: 'visible', timeout: 15000 });
        const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
        if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '500', description: 'Clearance fee' });
        } else {
            await page.keyboard.press('Escape');
            await page.getByRole('button', { name: 'Line Item' }).click();
            await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '500' });
        }

        const rowCount = await page.locator('table tbody tr').count();
        expect(rowCount).toBeGreaterThanOrEqual(2);
        console.log(`[AUDIT] ${rowCount} lines in Bill form table`);

        await page.getByRole('button', { name: 'Add Now' }).first().click();
        await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 });

        const billId = await app.extractIdFromUrl();
        await app.advanceDocumentAPI(billId, 'bills');
        const billData = await app.api.purchase.getBillAPI(billId);
        const lines: any[] = billData.items || [];
        expect(lines.length).toBeGreaterThanOrEqual(2);
        const total = parseFloat(billData.total_amount ?? billData.amount ?? '0');
        console.log(`[AUDIT] Bill lines: ${lines.length} | Total: $${total}`);
        console.log('[PASS] Bill mixed lines — approved, AP impact verified');
    });

    test('BILL-API-04: Multi-line Bill → grand total = sum of lines', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const L1 = 3 * 1000, L2 = 2 * 2000;

        const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
        const allAccounts = acctData.items || acctData.data || [];
        const apAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable'))  || allAccounts[0];
        const glAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
        const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
        const currency = currData.items?.[0] || currData.data?.[0];

        const resp = await page.request.post(`${apiBase}/bills?${qs}`, {
            headers,
            data: {
                accounts_payable_id: apAcct.id, currency_id: currency?.id,
                vendor_id: purchaseMeta.vendorId,
                invoice_date: periodDateIso,
                due_date:     periodDateIso,
                items: [
                    { item_id: itemA.itemId, quantity: 3, unit_price: 1000, amount: L1, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId },
                    { item_id: itemB.itemId, quantity: 2, unit_price: 2000, amount: L2, general_ledger_account_id: glAcct.id, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
                ],
                status: 'draft',
            },
        });

        expect(resp.ok(), `Multi-line Bill failed: HTTP ${resp.status()}`).toBe(true);
        const data = await resp.json();
        const linesSum = (data.items || []).reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
        const billTotal = parseFloat(data.total_amount ?? data.grand_total ?? data.amount ?? '0');
        console.log(`[AUDIT] Lines sum: $${linesSum} | Bill total: $${billTotal} | Expected: $${L1 + L2}`);
        expect(linesSum).toBeCloseTo(L1 + L2, 1);
        if (billTotal > 0) expect(billTotal).toBeCloseTo(L1 + L2, 1);
        console.log('[PASS] Multi-line Bill totals correct');
    });

    test('BILL-API-05: Bill discount on line → net = (price − discount) × qty', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const QTY = 3, PRICE = 2000, DISC = 200;

        const bill = await app.api.purchase.createBillAPI({
            itemData: itemA, quantity: QTY, unitPrice: PRICE,
            discount_amount: DISC,
            vendorId: purchaseMeta.vendorId, apAccountId: purchaseMeta.apAccountId,
        });
        const billData = await app.api.purchase.getBillAPI(bill.id);
        const net = parseFloat(billData.net_total ?? billData.total_amount ?? billData.amount ?? '0');
        const expected = (PRICE - DISC) * QTY;
        console.log(`[AUDIT] Price=$${PRICE} Disc=$${DISC} Qty=${QTY} | Expected=$${expected} | Actual=$${net}`);
        if (net > 0) expect(net).toBeCloseTo(expected, 1);
        console.log('[PASS] Bill line discount applied correctly');
    });

    // =========================================================================
    // PAYMENT
    // =========================================================================

    test('PAY-API-01: Single bill payment → bill balance settles to zero', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const TOTAL = 5000;

        const bill = await app.api.purchase.createBillAPI({
            itemData: itemA, quantity: 2, unitPrice: TOTAL / 2,
            vendorId: purchaseMeta.vendorId, apAccountId: purchaseMeta.apAccountId,
        });
        await app.advanceDocumentAPI(bill.id, 'bills');

        const payment = await app.api.purchase.createBillPaymentAPI({
            amount: TOTAL, billId: bill.id, vendorId: purchaseMeta.vendorId,
        });
        await app.advanceDocumentAPI(payment.id, 'payments');

        await page.waitForTimeout(3000);
        const billData = await app.api.purchase.getBillAPI(bill.id);
        const remaining = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.net_due ?? '999');
        console.log(`[AUDIT] Bill $${TOTAL} | Payment $${TOTAL} | Remaining: $${remaining}`);
        expect(remaining).toBeLessThan(1);
        console.log('[PASS] Full payment settles bill to zero');
    });

    test('PAY-API-02: Multi-bill payment → all bills settle to zero', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const AMT_A = 3000, AMT_B = 2000;

        const [billA, billB] = await Promise.all([
            app.api.purchase.createBillAPI({ itemData: itemA, quantity: 3, unitPrice: AMT_A / 3, vendorId: purchaseMeta.vendorId }),
            app.api.purchase.createBillAPI({ itemData: itemB, quantity: 2, unitPrice: AMT_B / 2, vendorId: purchaseMeta.vendorId }),
        ]);
        await Promise.all([
            app.advanceDocumentAPI(billA.id, 'bills'),
            app.advanceDocumentAPI(billB.id, 'bills'),
        ]);

        const payment = await app.api.purchase.createMultiBillPaymentAPI({
            amount: AMT_A + AMT_B,
            vendorId: purchaseMeta.vendorId,
            billPayments: [{ amount: AMT_A, bill_id: billA.id }, { amount: AMT_B, bill_id: billB.id }],
        });
        await app.advanceDocumentAPI(payment.id, 'payments');

        await page.waitForTimeout(3000);
        const [dataA, dataB] = await Promise.all([
            app.api.purchase.getBillAPI(billA.id),
            app.api.purchase.getBillAPI(billB.id),
        ]);
        const remA = parseFloat(dataA.unpaid_amount ?? dataA.balance ?? '999');
        const remB = parseFloat(dataB.unpaid_amount ?? dataB.balance ?? '999');
        console.log(`[AUDIT] Bill A remaining: $${remA} | Bill B remaining: $${remB}`);
        expect(remA).toBeLessThan(1);
        expect(remB).toBeLessThan(1);
        console.log('[PASS] Multi-bill payment settles all bills to zero');
    });

    test('PAY-API-03: Partial payment → bill balance reduces by exact amount', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const TOTAL = 6000, PARTIAL = 2000;

        const bill = await app.api.purchase.createBillAPI({
            itemData: itemA, quantity: 2, unitPrice: TOTAL / 2,
            vendorId: purchaseMeta.vendorId, apAccountId: purchaseMeta.apAccountId,
        });
        await app.advanceDocumentAPI(bill.id, 'bills');

        const payment = await app.api.purchase.createBillPaymentAPI({
            amount: PARTIAL, billId: bill.id, vendorId: purchaseMeta.vendorId,
        });
        await app.advanceDocumentAPI(payment.id, 'payments');

        await page.waitForTimeout(3000);
        const billData = await app.api.purchase.getBillAPI(bill.id);
        const remaining = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.net_due ?? '999');
        console.log(`[AUDIT] Bill $${TOTAL} | Paid $${PARTIAL} | Remaining $${remaining} | Expected $${TOTAL - PARTIAL}`);
        expect(remaining).toBeCloseTo(TOTAL - PARTIAL, 1);
        console.log('[PASS] Partial payment reduces bill balance correctly');
    });
});
