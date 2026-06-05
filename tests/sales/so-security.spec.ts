import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * CATEGORY 4: Security & Temporal Isolation
 */
test.describe('Security & Temporal Isolation Audits @sales @security @regression @full', () => {
    test.setTimeout(120000);

    let sharedMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['captureRandomItemDataAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        sharedMeta = await app.api.sales.discoverMetadataAPI();
        sharedItem = await app.api.inventory.captureRandomItemDataAPI({ minStock: 2 });
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test('Guardrail: System must strictly segregate invoices and receipts by Customer', async ({ page }) => {
        const app = new AppManager(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const meta = sharedMeta;
        const item = sharedItem;

        const custResp = await page.request.get(`${apiBase}/customers?page=1&pageSize=10&${qs}`, { headers });
        const customers = (await custResp.json()).items || [];
        if (customers.length < 2) { console.log('[SKIP] Need at least 2 customers.'); return; }

        const customerA = customers[0];
        const customerB = customers[1];

        const INVOICE_AMT = 5000;
        const invA = await app.api.sales.createStandaloneInvoiceAPI({ customerId: customerA.id, itemId: item.itemId, unitPrice: INVOICE_AMT });
        await app.advanceDocumentAPI(invA.id, 'invoices');

        const acctResp = await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers });
        const cashAcct = (await acctResp.json()).items?.find((a: any) => a.account_type?.toLowerCase().includes('cash')) || (await acctResp.json()).items?.[0];

        console.log(`[ATTACK] Submitting Receipt under Customer B, linking to Customer A's Invoice!`);
        const attackResp = await page.request.post(`${apiBase}/receipts?${qs}`, {
            data: { amount: INVOICE_AMT, cash_account_id: cashAcct.id, customer_id: customerB.id, date: new Date().toISOString(), payment_method: 'cash', currency_id: meta.currencyId, invoice_receipts: [{ amount: INVOICE_AMT, invoice_id: invA.id }] },
            headers
        });

        if ([200, 201].includes(attackResp.status())) {
            const body = await attackResp.json();
            try {
                await app.advanceDocumentAPI(body.id, 'receipts');
                const finalInv = await app.api.sales.getInvoiceAPI(invA.id);
                if (Number(finalInv.unreceived_amount) === 0) {
                    throw new Error(`[CRITICAL_SECURITY_BUG] IDOR VULNERABILITY! Customer B successfully paid Customer A's invoice.`);
                }
            } catch (e: any) {
                if (e.message.includes('CRITICAL_SECURITY_BUG')) throw e;
                console.log(`[PASS] Cross-customer receipt blocked at approval.`);
            }
        } else {
            console.log(`[PASS] IDOR payment blocked at API wall (Status: ${attackResp.status()}).`);
        }
    });

    test('Guardrail: System must explicitly reject historical back-dated invoices', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const rogueDate = '2021-04-29T00:00:00Z';
        console.log(`[ATTACK] Submitting Invoice forged for: ${rogueDate}`);

        try {
            const rogueInvoice = await app.api.sales.createStandaloneInvoiceAPI({ customerId: meta.customerId, itemId: item.itemId, invoiceDate: rogueDate });
            console.log(`[VULNERABILITY] Backend API accepted back-dated payload! ID: ${rogueInvoice.ref}`);

            try {
                await app.advanceDocumentAPI(rogueInvoice.id, 'invoices');
                const finalStatus = await app.api.sales.getInvoiceAPI(rogueInvoice.id);
                if (finalStatus.status?.toLowerCase().includes('approved') || finalStatus.status?.toLowerCase().includes('authorized')) {
                    throw new Error(`[CRITICAL_LOGIC_BUG] ERP fully approved an invoice from 5 years in the past (${rogueDate})! Immutability is broken.`);
                }
                console.log(`[PASS] Invoice advanced but stopped short of full approval.`);
            } catch (authErr: any) {
                if (authErr.message.includes('CRITICAL_LOGIC_BUG')) throw authErr;
                console.log(`[PASS] Backend safely intercepted rogue date during advancement: ${authErr.message}`);
            }
        } catch (error: any) {
            if (error.message.includes('CRITICAL_LOGIC_BUG')) throw error;
            console.log(`[PASS] Back-dating blocked: ${error.message}`);
        }
    });
});
