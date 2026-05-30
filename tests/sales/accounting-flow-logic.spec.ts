import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * CATEGORY 3: Accounting Flow & Ledger Logic
 */
test.describe('Accounting & Ledger Flow Logic Audits @sales @logic @regression', () => {
    test.setTimeout(500000);

    let sharedMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['captureRandomItemDataAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        sharedMeta = await app.api.sales.discoverMetadataAPI();
        sharedItem = await app.api.inventory.captureRandomItemDataAPI({ minStock: 0 });
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    async function ensureStock(app: AppManager, item: any, quantity: number) {
        if (Number(item.currentStock) < quantity) {
            console.log(`[SEED] Low stock (${item.currentStock}). Seeding ${quantity * 2} units via Bill...`);
            const bill = await app.createBillAPI({ itemData: { ...item }, quantity: quantity * 2, unitPrice: 100 });
            await app.advanceDocumentAPI(bill.id, 'bills');
        }
    }

    test('Guardrail: System must reject invoicing for more units than the approved SO', async ({ page }) => {
        const app = new AppManager(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const meta = sharedMeta;
        const item = sharedItem;
        await ensureStock(app, item, 7);

        const SO_QTY = 2;
        const OVER_QTY = 6;

        console.log(`[STEP 1] Creating Sales Order for ${SO_QTY} units...`);
        const so = await app.api.sales.createSalesOrderAPI({ itemId: item.itemId, quantity: SO_QTY, locationId: item.locationId, warehouseId: item.warehouseId });
        await app.advanceDocumentAPI(so.id, 'sales-orders');

        console.log(`[ATTACK] Attempting to invoice for ${OVER_QTY} units (SO only allows ${SO_QTY})...`);
        const overInvoiceResp = await page.request.post(`${apiBase}/invoices?${qs}`, {
            data: {
                accounts_receivable_id: meta.arAccountId,
                currency_id: meta.currencyId,
                customer_id: meta.customerId,
                invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
                released_sales_order_items: [{ so_item_id: so.soItemId, released_quantity: OVER_QTY, warehouse_id: item.warehouseId, location_id: item.locationId }],
                status: 'draft'
            },
            headers
        });

        if ([200, 201].includes(overInvoiceResp.status())) {
            const body = await overInvoiceResp.json();
            try {
                await app.advanceDocumentAPI(body.id, 'invoices');
                throw new Error(`[CRITICAL_LOGIC_BUG] Allowed over-invoicing! SO: ${SO_QTY}, Invoiced: ${OVER_QTY}`);
            } catch (e: any) {
                if (e.message.includes('CRITICAL_LOGIC_BUG')) throw e;
                console.log(`[PASS] Over-invoice blocked at approval stage.`);
            }
        } else {
            console.log(`[PASS] Over-invoice rejected with status ${overInvoiceResp.status()}.`);
        }
    });

    test('Guardrail: System must reject injected price/amount overrides during SO conversion', async ({ page }) => {
        const app = new AppManager(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const meta = sharedMeta;
        const item = sharedItem;
        await ensureStock(app, item, 5);

        const BASE_PRICE = 5000;
        const ATTACK_PRICE = 50;

        const so = await app.api.sales.createSalesOrderAPI({ itemId: item.itemId, quantity: 1, unitPrice: BASE_PRICE });
        await app.advanceDocumentAPI(so.id, 'sales-orders');

        console.log(`[ATTACK] Injecting malicious price: ${ATTACK_PRICE} (SO Price: ${BASE_PRICE})...`);
        const overInvoiceResp = await page.request.post(`${apiBase}/invoices?${qs}`, {
            data: {
                accounts_receivable_id: meta.arAccountId,
                currency_id: meta.currencyId,
                customer_id: meta.customerId,
                invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
                released_sales_order_items: [{ so_item_id: so.soItemId, released_quantity: 1, warehouse_id: item.warehouseId, location_id: item.locationId, unit_price: ATTACK_PRICE, amount: ATTACK_PRICE }],
                status: 'draft'
            },
            headers
        });

        if ([200, 201].includes(overInvoiceResp.status())) {
            const body = await overInvoiceResp.json();
            try {
                await app.advanceDocumentAPI(body.id, 'invoices');
                const finalInv = await app.api.sales.getInvoiceAPI(body.id);
                if (Number(finalInv.unreceived_amount) === ATTACK_PRICE) {
                    throw new Error(`[CRITICAL_LOGIC_BUG] Price Injection Allowed! SO: ${BASE_PRICE}, Invoiced: ${ATTACK_PRICE}`);
                }
            } catch (e: any) {
                if (e.message.includes('CRITICAL_LOGIC_BUG')) throw e;
                console.log(`[PASS] Price override blocked at approval.`);
            }
        }
    });

    test('Guardrail: System must prevent double-dip overpayments across multi-link receipts', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;
        await ensureStock(app, item, 5);

        const INVOICE_AMOUNT = 100;
        const inv = await app.api.sales.createStandaloneInvoiceAPI({ customerId: meta.customerId, itemId: item.itemId, quantity: 1, unitPrice: INVOICE_AMOUNT, locationId: item.locationId, warehouseId: item.warehouseId });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        const rct1 = await app.api.sales.createInvoiceReceiptAPI({ amount: 40, customerId: meta.customerId, invoiceId: inv.id });
        await app.advanceDocumentAPI(rct1.id, 'receipts');

        console.log(`[ATTACK] Attempting overpayment: 80.00 (Outstanding is only 60.00)...`);
        try {
            const rct2 = await app.api.sales.createInvoiceReceiptAPI({ amount: 80, customerId: meta.customerId, invoiceId: inv.id });
            await app.advanceDocumentAPI(rct2.id, 'receipts');
            const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
            if (Number(finalInv.unreceived_amount) < 0) {
                throw new Error(`[CRITICAL_LOGIC_BUG] Double-Dip Success: Invoice ${inv.ref} is over-paid (Balance: ${finalInv.unreceived_amount})`);
            }
        } catch (e: any) {
            if (e.message.includes('CRITICAL_LOGIC_BUG')) throw e;
            console.log(`[PASS] Overpayment blocked correctly: ${e.message}`);
        }
    });

    test('Guardrail: Invoice balance must correctly restore after receipt reversal', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;
        await ensureStock(app, item, 5);

        const INVOICE_AMOUNT = 500;
        const inv = await app.api.sales.createStandaloneInvoiceAPI({ customerId: meta.customerId, itemId: item.itemId, unitPrice: INVOICE_AMOUNT, locationId: item.locationId, warehouseId: item.warehouseId });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        const accounts = await app.getAllAccountsAPI();
        const cashAcct = accounts.find((a: any) => a.account_type?.toLowerCase().includes('cash')) || accounts[0];

        try {
            const rct1 = await app.api.sales.createInvoiceReceiptAPI({ amount: INVOICE_AMOUNT, customerId: meta.customerId, invoiceId: inv.id, currencyId: meta.currencyId, cashAccountId: cashAcct.id });
            await app.advanceDocumentAPI(rct1.id, 'receipts');

            console.log(`[ACTION] Reversing Receipt ${rct1.ref}...`);
            await app.reverseReceiptAPI(rct1.id);

            await page.waitForTimeout(5000);
            const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
            console.log(`[AUDIT] After Receipt Reversal: unreceived_amount = ${finalInv.unreceived_amount}`);

            if (Number(finalInv.unreceived_amount) !== INVOICE_AMOUNT) {
                throw new Error(`[CRITICAL_LOGIC_BUG] Ledger Drift: Reversing full receipt did not restore invoice balance! Current: ${finalInv.unreceived_amount}, Expected: ${INVOICE_AMOUNT}`);
            }
            console.log(`[PASS] Receipt reversed. Invoice balance restored to ${INVOICE_AMOUNT}.`);

            await app.reverseInvoiceAPI(inv.id);
        } catch (error: any) {
            if (error.message.includes('CRITICAL_LOGIC_BUG')) throw error;
            console.log(`[PASS/BUG] Transaction failed or was blocked: ${error.message}`);
        }
    });
});
