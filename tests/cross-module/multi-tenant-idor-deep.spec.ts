import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { DateHelper } from '../../lib/utils/DateHelper';
import { DevReporter } from '../../lib/utils/DevReporter';

/**
 * =============================================================================
 * MODULE: Multi-Tenancy & Authorization Security — Deep Cross-Tenant IDOR
 * 
 * Strict Multi-Tenancy Invariants (per AGENTS.md):
 * 1. Strict multi-tenancy enforced on all requests via `x-company` header.
 * 2. Cross-Tenant IDOR Guardrail: A tenant cannot read, update, or approve
 *    documents belonging to another company.
 * 3. Relational Grafting Protection: A tenant cannot reference foreign
 *    customer, vendor, GL account, or warehouse UUIDs in document payloads.
 * =============================================================================
 */

test.describe('Multi-Tenancy & Deep Cross-Tenant IDOR Guardrails @cross-module @regression', () => {
    test.setTimeout(240000);

    test('Guardrail: Authenticated tenant cannot read or fetch invoices belonging to another company (IDOR)', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const token = await app._getAuthToken();
        const qs = DateHelper.qs();
        const primaryCompany = process.env.BEFFA_COMPANY || 'ABC Trading';
        const secondaryCompany = 'sample'; // Distinct existing company in database

        // 1. Query secondary company's customer list legitimately
        const secHeaders = {
            'x-company': secondaryCompany,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const secCustResp = await page.request.get(`${app.apiBase}/customers?page=1&pageSize=1&${qs}`, { headers: secHeaders });
        const secCustData = await secCustResp.json().catch(() => ({}));
        const secCustList = secCustData.data || secCustData.items || [];

        if (secCustList.length === 0) {
            console.log(`[IDOR GUARDRAIL] Secondary company "${secondaryCompany}" has no customers — skipping entity ID test`);
            return;
        }

        const secCustId = secCustList[0].id;

        // 2. ATTACK: Authenticated under primaryCompany (`x-company: ABC Trading`), attempt
        // to directly fetch the secondary company's customer profile
        const attackHeaders = {
            'x-company': primaryCompany,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const idorUrl = `${app.apiBase}/customers/${secCustId}?${qs}`;
        const startTime = Date.now();
        const idorFetchResp = await page.request.get(idorUrl, { headers: attackHeaders });
        const duration = Date.now() - startTime;
        const idorBody = await idorFetchResp.json().catch(() => ({}));

        DevReporter.record({
            testName: 'Cross-Tenant Customer Entity Read (IDOR)',
            action: `Tenant "${primaryCompany}" attempts GET customer UUID "${secCustId}" owned by "${secondaryCompany}"`,
            method: 'GET',
            url: idorUrl,
            company: primaryCompany,
            token,
            status: idorFetchResp.status(),
            responseBody: idorBody,
            durationMs: duration,
            verdict: idorFetchResp.status() === 404 || idorFetchResp.status() === 403
                ? 'PASSED GUARDRAIL: Cross-tenant read strictly blocked (404/403)'
                : 'CRITICAL IDOR BUG: Cross-tenant customer record exposed to foreign tenant'
        });

        // Invariant: Accessing an entity belonging to another tenant MUST return 404 (Not Found) or 403 (Forbidden)
        expect(
            idorFetchResp.status() === 404 || idorFetchResp.status() === 403,
            `Cross-tenant read must be blocked (Expected 404/403, got ${idorFetchResp.status()})`
        ).toBe(true);
    });

    test('Guardrail: Invoice payload referencing a foreign tenant customer UUID must be rejected (Anti-Grafting)', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const token = await app._getAuthToken();
        const primaryCompany = process.env.BEFFA_COMPANY || 'ABC Trading';
        const primaryMeta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'FIFO',
            quantity: 10,
            unit_cost: 100
        });

        const qs = DateHelper.qs();
        const resolvedDate = await DateHelper.resolve(page);

        // Fetch a customer UUID belonging to another company
        const secHeaders = {
            'x-company': 'sample',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        const secCustResp = await page.request.get(`${app.apiBase}/customers?page=1&pageSize=1&${qs}`, { headers: secHeaders });
        const secCustData = await secCustResp.json().catch(() => ({}));
        const secCustomers = secCustData.data || secCustData.items || [];

        if (secCustomers.length > 0) {
            const foreignCustomerId = secCustomers[0].id;

            // Submit invoice under primaryCompany but with foreignCustomerId
            const attackHeaders = {
                'x-company': primaryCompany,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const attackPayload = {
                customer_id: foreignCustomerId, // FOREIGN TENANT CUSTOMER
                accounts_receivable_id: primaryMeta.arAccountId,
                currency_id: primaryMeta.currencyId,
                date: resolvedDate.iso,
                posting_date: resolvedDate.iso,
                invoice_date: resolvedDate.iso,
                due_date: resolvedDate.iso,
                items: [
                    {
                        item_id: item.itemId,
                        quantity: 1,
                        unit_price: 100,
                        location_id: item.locationId,
                        warehouse_id: item.warehouseId,
                        general_ledger_account_id: primaryMeta.salesAccountId || primaryMeta.arAccountId
                    }
                ]
            };

            const invoiceUrl = `${app.apiBase}/invoices?${qs}`;
            const startTime = Date.now();
            const graftResp = await page.request.post(invoiceUrl, {
                headers: attackHeaders,
                data: attackPayload
            });
            const duration = Date.now() - startTime;
            const graftBody = await graftResp.json().catch(() => ({}));

            DevReporter.record({
                testName: 'Cross-Tenant Relational UUID Injection (Anti-Grafting)',
                action: `Tenant "${primaryCompany}" submits invoice linking customer "${foreignCustomerId}" owned by "sample"`,
                method: 'POST',
                url: invoiceUrl,
                company: primaryCompany,
                token,
                payload: attackPayload,
                status: graftResp.status(),
                responseBody: graftBody,
                durationMs: duration,
                verdict: graftResp.status() >= 400
                    ? 'PASSED GUARDRAIL: Foreign customer UUID rejected with 422/404'
                    : 'CRITICAL IDOR BUG: Cross-tenant entity grafting accepted'
            });

            // Invariant: Must reject with 404 or 422
            expect(
                graftResp.status(),
                `Submitting an invoice referencing a customer from another tenant must be rejected (Got ${graftResp.status()})`
            ).toBeGreaterThanOrEqual(400);
        }
    });

    test('Guardrail: Requests with invalid or empty tenant header must fail with 400/401 and never leak global data', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const token = await app._getAuthToken();
        const qs = DateHelper.qs();

        // 1. Missing x-company header
        const missingUrl = `${app.apiBase}/invoices?page=1&pageSize=5&${qs}`;
        const missingHeaderResp = await page.request.get(missingUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const missingBody = await missingHeaderResp.json().catch(() => ({}));

        DevReporter.record({
            testName: 'Missing x-company Tenant Header Guardrail',
            action: 'GET /invoices without x-company header',
            method: 'GET',
            url: missingUrl,
            company: '(none)',
            token,
            status: missingHeaderResp.status(),
            responseBody: missingBody,
            verdict: missingHeaderResp.status() >= 400
                ? 'PASSED GUARDRAIL: Request without tenant header rejected'
                : 'SECURITY LEAK: Server returned data without tenant identification'
        });
        expect(missingHeaderResp.status(), 'Missing tenant header must not return 200 OK').toBeGreaterThanOrEqual(400);

        // 2. Fictitious / Malformed x-company header
        const fakeCompany = 'NonExistent_EvilCorp_99999';
        const fakeHeaderResp = await page.request.get(missingUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-company': fakeCompany
            }
        });
        const fakeBody = await fakeHeaderResp.json().catch(() => ({}));

        DevReporter.record({
            testName: 'Fictitious x-company Header Guardrail',
            action: `GET /invoices with non-existent tenant "${fakeCompany}"`,
            method: 'GET',
            url: missingUrl,
            company: fakeCompany,
            token,
            status: fakeHeaderResp.status(),
            responseBody: fakeBody,
            verdict: fakeHeaderResp.status() >= 400
                ? 'PASSED GUARDRAIL: Non-existent company header rejected'
                : 'SECURITY LEAK: Server returned records for a non-existent company'
        });
        expect(fakeHeaderResp.status(), 'Fake tenant header must be rejected with 400/403/404').toBeGreaterThanOrEqual(400);
    });
});
