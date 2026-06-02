import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * SALES MULTI-ITEM INVOICE COGS AUDIT
 */
test.describe('Sales Multi-Item Invoice COGS Audit @sales @inventory @logic @regression @full', () => {
    test.setTimeout(300000);

    let sharedMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        sharedMeta = await app.api.sales.discoverMetadataAPI();
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test('Audit: Multi-item invoice correctly deducts stock for each line item', async ({ page }) => {
        const app = new AppManager(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const meta = sharedMeta;

        console.log(`[STEP 1] Discovering 3 distinct items with stock...`);
        const item1 = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
        const item2 = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
        const item3 = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
        if (!item1 || !item2 || !item3) { console.log('[SKIP] Could not find 3 items with stock.'); return; }

        const stock1Before = item1.currentStock;
        const stock2Before = item2.currentStock;
        const stock3Before = item3.currentStock;

        console.log(`[ITEM 1] ${item1.itemName} | Stock: ${stock1Before}`);
        console.log(`[ITEM 2] ${item2.itemName} | Stock: ${stock2Before}`);
        console.log(`[ITEM 3] ${item3.itemName} | Stock: ${stock3Before}`);

        console.log(`[STEP 2] Creating multi-item invoice (3 lines)...`);
        const resp = await page.request.post(`${apiBase}/invoices?${qs}`, {
            data: {
                accounts_receivable_id: meta.arAccountId,
                customer_id: meta.customerId,
                invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
                due_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] + 'T00:00:00Z',
                currency_id: meta.currencyId,
                items: [
                    { item_id: item1.itemId, quantity: 1, unit_price: 100, amount: 100, general_ledger_account_id: meta.salesAccountId, location_id: item1.locationId, warehouse_id: item1.warehouseId },
                    { item_id: item2.itemId, quantity: 1, unit_price: 200, amount: 200, general_ledger_account_id: meta.salesAccountId, location_id: item2.locationId, warehouse_id: item2.warehouseId },
                    { item_id: item3.itemId, quantity: 1, unit_price: 300, amount: 300, general_ledger_account_id: meta.salesAccountId, location_id: item3.locationId, warehouse_id: item3.warehouseId }
                ],
                released_sales_order_items: []
            },
            headers
        });
        if (!resp.ok()) throw new Error(`Multi-item invoice creation failed: ${resp.status()} - ${await resp.text()}`);
        const inv = await resp.json();
        console.log(`[OK] Invoice created: ${inv.invoice_number} (ID: ${inv.id})`);

        await app.advanceDocumentAPI(inv.id, 'invoices');
        await page.waitForTimeout(5000);

        console.log(`[STEP 3] Verifying stock deducted for each item...`);
        const details1 = await app.api.inventory.getItemDetailsAPI(item1.itemId, item1.locationId);
        const details2 = await app.api.inventory.getItemDetailsAPI(item2.itemId, item2.locationId);
        const details3 = await app.api.inventory.getItemDetailsAPI(item3.itemId, item3.locationId);

        console.log(`[ITEM 1] ${item1.itemName} | Before: ${stock1Before} | After: ${details1?.currentStock} | Expected: ${stock1Before - 1}`);
        console.log(`[ITEM 2] ${item2.itemName} | Before: ${stock2Before} | After: ${details2?.currentStock} | Expected: ${stock2Before - 1}`);
        console.log(`[ITEM 3] ${item3.itemName} | Before: ${stock3Before} | After: ${details3?.currentStock} | Expected: ${stock3Before - 1}`);

        const failures: string[] = [];
        if (details1?.currentStock !== stock1Before - 1) failures.push(`Item 1 (${item1.itemName}): Expected ${stock1Before - 1}, got ${details1?.currentStock}`);
        if (details2?.currentStock !== stock2Before - 1) failures.push(`Item 2 (${item2.itemName}): Expected ${stock2Before - 1}, got ${details2?.currentStock}`);
        if (details3?.currentStock !== stock3Before - 1) failures.push(`Item 3 (${item3.itemName}): Expected ${stock3Before - 1}, got ${details3?.currentStock}`);

        if (failures.length > 0) {
            throw new Error(`[VULNERABILITY] Multi-Item Invoice Stock Deduction Failed\n  Invoice: ${inv.invoice_number}\n  Failures:\n    - ${failures.join('\n    - ')}`);
        }

        console.log(`[PASS] All 3 items correctly deducted by 1 unit each.`);
    });
});
