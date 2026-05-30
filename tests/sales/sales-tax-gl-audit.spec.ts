import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * SALES TAX GL AUDIT
 */
test.describe('Sales Tax GL Audit @sales @logic @regression', () => {
    test.setTimeout(300000);

    let sharedMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['captureRandomItemDataAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        sharedMeta = await app.api.sales.discoverMetadataAPI();
        sharedItem = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test('Audit: Invoice with tax must credit tax account in journal entries', async ({ page }) => {
        const app = new AppManager(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const meta = sharedMeta;
        const item = sharedItem;
        if (!item) { console.log('[SKIP] No stock available.'); return; }

        console.log(`[STEP 1] Discovering tax configuration...`);
        const taxResp = await page.request.get(`${apiBase}/taxes?${qs}`, { headers });
        if (!taxResp.ok()) { console.log('[SKIP] No taxes configured.'); return; }
        const taxData = await taxResp.json();
        const tax = taxData.items?.[0] || taxData.data?.[0];
        if (!tax) { console.log('[SKIP] No tax records found.'); return; }

        const taxRate = parseFloat(tax.rate || tax.percentage || '0');
        const UNIT_PRICE = 1000;
        const expectedTaxAmount = parseFloat((UNIT_PRICE * taxRate / 100).toFixed(2));

        console.log(`[TAX] ${tax.name} @ ${taxRate}% | Expected tax amount: ${expectedTaxAmount}`);

        console.log(`[STEP 2] Creating invoice with tax...`);
        const resp = await page.request.post(`${apiBase}/invoices?${qs}`, {
            data: {
                accounts_receivable_id: meta.arAccountId,
                customer_id: meta.customerId,
                invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
                due_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] + 'T00:00:00Z',
                currency_id: meta.currencyId,
                items: [{ item_id: item.itemId, quantity: 1, unit_price: UNIT_PRICE, amount: UNIT_PRICE, general_ledger_account_id: meta.salesAccountId, location_id: item.locationId, warehouse_id: item.warehouseId, tax_id: tax.id }],
                released_sales_order_items: []
            },
            headers
        });
        if (!resp.ok()) throw new Error(`Invoice creation failed: ${resp.status()} - ${await resp.text()}`);
        const inv = await resp.json();
        console.log(`[OK] Invoice created: ${inv.invoice_number} (ID: ${inv.id})`);

        await app.advanceDocumentAPI(inv.id, 'invoices');
        await page.waitForTimeout(3000);

        console.log(`[STEP 3] Fetching journal entries to verify tax account...`);
        const rawResp = await page.request.get(`${apiBase}/invoice/${inv.id}?${qs}`, { headers });
        const rawJson = await rawResp.json();
        const invoiceData = rawJson.data ? (Array.isArray(rawJson.data) ? rawJson.data[0] : rawJson.data) : rawJson;
        const allJournalKeys = Object.keys(invoiceData).filter(k => k.includes('journal') && !k.includes('_id'));

        const allEntries: any[] = [];
        for (const key of allJournalKeys) {
            const j = invoiceData[key];
            if (j?.journal_entries) allEntries.push(...j.journal_entries);
        }
        const mappedEntries = allEntries.map((entry: any) => ({
            accountName: entry.account?.name || '',
            accountType: entry.account?.type?.name || entry.account?.account_type || '',
            accountCode: entry.account?.account_id || '',
            debit: entry.debit?.toString() || '0',
            credit: entry.credit?.toString() || '0'
        }));

        const taxEntry = mappedEntries.find(j =>
            j.accountName?.toLowerCase().includes('tax') ||
            j.accountName?.toLowerCase().includes('vat') ||
            j.accountType?.toLowerCase().includes('tax') ||
            j.accountCode === tax.account_id
        );

        console.log(`[TAX ENTRY] ${taxEntry ? `${taxEntry.accountName} | CR: ${taxEntry.credit}` : 'NOT FOUND'}`);

        if (!taxEntry) {
            throw new Error(`[VULNERABILITY] Tax GL Entry Missing — Invoice: ${inv.invoice_number}, Tax: ${tax.name} @ ${taxRate}%, Expected credit: ${expectedTaxAmount}`);
        }

        const actualTaxCredit = parseFloat(taxEntry.credit || '0');
        if (taxRate > 0 && actualTaxCredit <= 0) {
            throw new Error(`[VULNERABILITY] Tax Journal Entry Has Zero Credit — ${taxEntry.accountName} | CR: ${taxEntry.credit}, Expected: ${expectedTaxAmount}`);
        }

        console.log(`[PASS] Tax GL confirmed: ${taxEntry.accountName} credited ${actualTaxCredit} on invoice approval.`);
    });
});
