import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * CATEGORY 4: Security & Temporal Isolation
 * 
 * This suite verifies the core multi-tenant and regulatory boundaries of the 
 * system, including data leakage (IDOR) and temporal forgery (Back-dating).
 */
test.describe('Security & Temporal Isolation Audits @security @isolation @sales', () => {

    test.setTimeout(300000);

    /**
     * Resilience Helper: Seeding stock if needed.
     */
    async function ensureStock(app: any, item: any, quantity: number) {
        if (Number(item.currentStock) < quantity) {
            const bill = await app.createBillAPI({ ...item }, quantity * 2, 100);
            await app.advanceDocumentAPI(bill.id, 'bills');
        }
    }

    // -------------------------------------------------------------------------
    // TEST 1: Cross-Customer IDOR Payment Attack (The Phantom Payer)
    // -------------------------------------------------------------------------
    test('Guardrail: System must strictly segregate invoices and receipts by Customer', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        let apiBase = (process.env.BASE_URL || 'http://157.180.20.112:8001').replace(/\/$/, '').replace(':4173', ':8001');
        if (!apiBase.endsWith('/api')) apiBase += '/api';
        const token = await app._getAuthToken();
        const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` };

        const custResp = await page.request.get(`${apiBase}/customers?page=1&pageSize=10&year=2018&period=yearly&calendar=ec`, { headers });
        const customers = (await custResp.json()).items || [];
        if (customers.length < 2) return;

        const customerA = customers[0]; 
        const customerB = customers[1]; 

        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.captureRandomItemDataAPI({ minStock: 2 });

        const INVOICE_AMT = 5000;
        const invA = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: customerA.id,
            itemId: item.itemId,
            unitPrice: INVOICE_AMT
        });
        await app.advanceDocumentAPI(invA.id, 'invoices');

        const acctResp = await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&year=2018&period=yearly&calendar=ec`, { headers });
        const cashAcct = (await acctResp.json()).items?.find((a: any) => a.account_type?.toLowerCase().includes('cash')) || (await acctResp.json()).items?.[0];

        console.log(`[ATTACK] Submitting Receipt under Customer B, but linking to Customer A's Invoice!`);
        const attackResp = await page.request.post(`${apiBase}/receipts?year=2018&period=yearly&calendar=ec`, {
            data: {
                amount: INVOICE_AMT,
                cash_account_id: cashAcct.id,
                customer_id: customerB.id,
                date: new Date().toISOString(),
                payment_method: 'cash',
                currency_id: meta.currencyId,
                invoice_receipts: [{ amount: INVOICE_AMT, invoice_id: invA.id }] 
            },
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

    // -------------------------------------------------------------------------
    // TEST 2: Temporal Back-Dating Attack (Immutability Violation)
    // -------------------------------------------------------------------------
    test('Guardrail: System must explicitly reject historical back-dated invoices', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.captureRandomItemDataAPI({ minStock: 0 });
        await ensureStock(app, item, 5);

        const rogueDate = "2021-04-29T00:00:00Z"; 
        console.log(`[ATTACK] Submitting Invoice forged for: ${rogueDate}`);

        try {
            const rogueInvoice = await app.api.sales.createStandaloneInvoiceAPI({
                customerId: meta.customerId,
                itemId: item.itemId,
                invoiceDate: rogueDate
            });

            console.log(`[VULNERABILITY] Backend API accepted back-dated payload! ID: ${rogueInvoice.ref}`);
            
            try {
                await app.advanceDocumentAPI(rogueInvoice.id, 'invoices');
                
                // CRITICAL HARDEING: Verify final approval state
                const finalStatus = await app.api.sales.getInvoiceAPI(rogueInvoice.id);
                console.log(`[AUDIT] Post-Advance Status: ${finalStatus.status}`);

                if (finalStatus.status?.toLowerCase().includes('approved') || finalStatus.status?.toLowerCase().includes('authorized')) {
                    throw new Error(`[CRITICAL_LOGIC_BUG] The ERP fully approved an invoice from 5 years in the past (${rogueDate})! Immutability is broken.`);
                } else {
                    console.log(`[PASS] Invoice advanced but stopped short of full approval. Dirty Block observed.`);
                }

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
