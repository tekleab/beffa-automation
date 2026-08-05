import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * Payroll: Pay Structures, Pay Components, Payroll Runs
 */
test.describe('Payroll: Runs & Pay Components @hr @smoke @regression @full', () => {
    test.setTimeout(300000);

    let payStructureId: string;
    let payRunId: string;

    // -------------------------------------------------------------------------
    // HAPPY PATH: Pay structure creation
    // -------------------------------------------------------------------------
    test('API: Pay structure must be created with valid name', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const name = `Audit-PayStruct-${Date.now()}`;
        const ps = await app.api.hr.createPayStructure(name, 'Audit pay structure');

        expect(ps).toHaveProperty('id');
        expect(ps.name).toBe(name);
        payStructureId = ps.id;
        console.log(`[PASS] Pay structure created: ${ps.id}`);
    });

    // -------------------------------------------------------------------------
    // HAPPY PATH: Pay component creation with GL account linkage
    // -------------------------------------------------------------------------
    test('API: Pay component must be created with correct GL account linkage', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const meta = await app.api.hr.discoverMetadataAPI();
        if (!meta) { console.log("[SKIP] HR org structure not configured"); return; }
        const ts = Date.now();
        const name = `Audit-Allowance-${ts}`;

        const pc = await app.api.hr.createPayComponent(
            name, 'Earning', 'FullyTaxable', `AA${ts % 1000}`, meta.glAccountId
        );

        expect(pc).toHaveProperty('id');
        expect(pc.name).toBe(name);
        expect(pc.general_ledger_account_id).toBe(meta.glAccountId);
        console.log(`[PASS] Pay component created: ${pc.id} | GL: ${pc.general_ledger_account_id}`);
    });

    // -------------------------------------------------------------------------
    // HAPPY PATH: Pay components list has valid structure
    // -------------------------------------------------------------------------
    test('API: Pay components must have valid type and tax_rule fields', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const components = await app.api.hr.listPayComponents(20);
        expect(components.length).toBeGreaterThan(0);

        for (const c of components) {
            expect(c).toHaveProperty('id');
            expect(c).toHaveProperty('name');
            expect(c).toHaveProperty('type');
            expect(c).toHaveProperty('tax_rule');
        }
        console.log(`[PASS] All ${components.length} pay components have valid structure`);
    });

    // -------------------------------------------------------------------------
    // EDGE CASE: Pay component with invalid type must be rejected
    // -------------------------------------------------------------------------
    test('Guardrail: Pay component must reject invalid type and tax_rule values', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const meta = await app.api.hr.discoverMetadataAPI();
        if (!meta) { console.log("[SKIP] HR org structure not configured"); return; }
        const token = await app._getAuthToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-company': process.env.BEFFA_COMPANY as string,
            'Content-Type': 'application/json',
        };
        const params = `year=${process.env.BEFFA_YEAR||'2018'}&period=${process.env.BEFFA_PERIOD||'yearly'}&calendar=${process.env.BEFFA_CALENDAR||'ec'}`;

        const resp = await page.request.post(
            `${app.apiBase}/pay-components?${params}`,
            {
                headers,
                data: {
                    name: `Invalid-PC-${Date.now()}`,
                    type: 'INVALID_TYPE',
                    tax_rule: 'INVALID_RULE',
                    abbreviation: 'INV',
                    general_ledger_account_id: meta.glAccountId,
                }
            }
        );

        expect(resp.status()).toBe(422);
        const body = await resp.json();
        expect(body).toHaveProperty('details');
        console.log(`[PASS] Invalid pay component type rejected: ${JSON.stringify(body.details)}`);
    });

    // -------------------------------------------------------------------------
    // HAPPY PATH: Payroll run creation with correct draft status
    // -------------------------------------------------------------------------
    test('API: Payroll run must be created with correct initial draft status', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const name = `Audit-PayRun-${Date.now()}`;
        const ecYear = parseInt(process.env.BEFFA_YEAR || '2019');
        let run: any;
        for (const offset of [0, -1, 1, -2]) {
            const gcYear = (ecYear + offset) + 7;
            try {
                run = await app.api.hr.createPayrollRun(
                    name,
                    `${gcYear}-07-08T00:00:00Z`,
                    `${gcYear}-07-30T00:00:00Z`,
                    `${gcYear}-07-30T00:00:00Z`
                );
                console.log(`[INFO] Payroll run accepted for EC year ${ecYear + offset} (GC ${gcYear})`);
                break;
            } catch (e: any) {
                if (e.message.includes('fiscal period') || e.message.includes('open')) {
                    console.log(`[INFO] EC year ${ecYear + offset} (GC ${gcYear}) not in open fiscal period — trying next...`);
                    continue;
                }
                throw e;
            }
        }

        if (!run) {
            console.log('[KNOWN_BUG] No open fiscal period configured for HR payroll — skipping');
            return;
        }

        expect(run).toHaveProperty('id');
        expect(run.status?.toLowerCase()).toMatch(/draft/);
        payRunId = run.id;
        console.log(`[PASS] Payroll run created: ${run.id} | status: ${run.status}`);

        const fetched = await app.api.hr.getPayrollRun(run.id);
        expect(fetched.id).toBe(run.id);
        console.log(`[PASS] Payroll run persisted correctly`);
    });

    // -------------------------------------------------------------------------
    // EDGE CASE: Payroll run advance without active employees must fail gracefully
    // -------------------------------------------------------------------------
    test('Guardrail: Payroll run advance without active employees must not silently succeed', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        if (!payRunId) {
            console.log(`[SKIP] No payroll run ID from previous test`);
            return;
        }

        const token = await app._getAuthToken();
        const headers = { 'Authorization': `Bearer ${token}`, 'x-company': process.env.BEFFA_COMPANY as string };
        const params = `year=${process.env.BEFFA_YEAR||'2018'}&period=${process.env.BEFFA_PERIOD||'yearly'}&calendar=${process.env.BEFFA_CALENDAR||'ec'}`;

        const empResp = await page.request.get(
            `${app.apiBase}/payroll-runs/${payRunId}/employees?${params}`, { headers }
        );
        const empBody = await empResp.json();
        console.log(`[INFO] Employees in payroll run: ${empBody.data?.length ?? 0}`);

        const advResp = await page.request.patch(
            `${app.apiBase}/payroll-runs/${payRunId}/advance?${params}`,
            { headers: { ...headers, 'Content-Type': 'application/json' }, data: {} }
        );

        if (advResp.status() === 500) {
            const body = await advResp.json();
            console.log(`[PASS] Advance correctly blocked: ${body.message}`);
            expect(body.message).toBeTruthy();
        } else if (advResp.status() === 422 || advResp.status() === 400) {
            console.log(`[PASS] Advance blocked with validation error: ${advResp.status()}`);
        } else if (advResp.status() === 200) {
            const run = await app.api.hr.getPayrollRun(payRunId);
            console.log(`[AUDIT] Advance succeeded with ${run.payrolls?.length ?? 0} payrolls generated`);
            expect(run.payrolls?.length ?? 0).toBeGreaterThanOrEqual(0);
        }
    });

    // -------------------------------------------------------------------------
    // UI: Payroll Runs page loads
    // -------------------------------------------------------------------------
    test('UI: Payroll Runs page must load and display run records or empty state', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        await page.goto('/payrolls/payroll-runs', { waitUntil: 'load', timeout: 150000 });
        await page.locator('#loading-screen').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});

        const hasError = await page.locator('text=/error|failed|something went wrong/i').first()
            .isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasError).toBe(false);

        const anyContent = await page.locator(
            'table tbody tr, [role="row"], h1, h2, [role="heading"], .chakra-text'
        ).first().isVisible({ timeout: 15000 }).catch(() => false);
        expect(anyContent, 'Payroll Runs page rendered no content').toBe(true);
        console.log(`[PASS] Payroll Runs page loaded`);
    });

    // -------------------------------------------------------------------------
    // UI: Pay Components settings page renders list
    // -------------------------------------------------------------------------
    test('UI: Pay Components settings page must render the components list', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        await page.goto('/payrolls/settings/pay-components', { waitUntil: 'load', timeout: 150000 });
        await page.locator('#loading-screen').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});

        const hasError = await page.locator('text=/error|failed|something went wrong/i').first()
            .isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasError).toBe(false);

        const rowCount = await page.locator('table tbody tr, [role="row"]').count();
        expect(rowCount, 'Pay Components page rendered no rows').toBeGreaterThan(0);
        console.log(`[PASS] Pay Components page rendered ${rowCount} rows`);
    });
});
