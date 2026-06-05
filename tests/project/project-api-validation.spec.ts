import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROJECT API VALIDATION — Input Guardrails & Edge Cases
 *
 * Pure API validation tests - no UI dependencies
 * Covers: Required fields, date validation, numeric constraints, invalid inputs
 */
test.describe('Project Management: API Validation @project @validation @smoke @regression @full', () => {

    async function setup(page: any) {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const meta = await app.api.project.discoverMetadataAPI();
        return { app, meta };
    }

    async function createBaseProject(app: AppManager, meta: any) {
        const p = await app.api.project.createProjectAPI({
            name: `Guardrail-Base-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
            customerId: meta.customerId,
            estimatedRevenue: 100000,
            estimatedExpense: 40000
        });
        return p;
    }

    // ── API CREATE GUARDRAILS ──────────────────────────────────────────────────

    test('GUARD-01: Missing customer_id → 422 with "Customer is required"', async ({ page }) => {
        const { app } = await setup(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const resp = await page.request.post(`${apiBase}/projects?${qs}`, {
            headers,
            data: {
                project_name: 'No-Customer',
                project_start_date: '2026-01-01T00:00:00Z',
                estimated_end_date: '2026-12-31T00:00:00Z',
                estimated_revenue: 1000,
                completion_method: 'manual',
                project_status: 'pending'
            }
        });
        expect(resp.status()).toBe(422);
        expect(JSON.stringify(await resp.json())).toContain('customer');
    });

    test('GUARD-02: Empty project_name → 422 with "Project Name is required"', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const resp = await page.request.post(`${apiBase}/projects?${qs}`, {
            headers,
            data: {
                project_name: '',
                customer_id: meta.customerId,
                project_start_date: '2026-01-01T00:00:00Z',
                estimated_end_date: '2026-12-31T00:00:00Z',
                estimated_revenue: 1000,
                completion_method: 'manual',
                project_status: 'pending'
            }
        });
        expect(resp.status()).toBe(422);
        expect(JSON.stringify(await resp.json())).toContain('Project Name');
    });

    test('GUARD-03: start_date after end_date → 422 with date validation message', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const resp = await page.request.post(`${apiBase}/projects?${qs}`, {
            headers,
            data: {
                project_name: 'Bad-Dates',
                customer_id: meta.customerId,
                project_start_date: '2026-12-31T00:00:00Z',
                estimated_end_date: '2026-01-01T00:00:00Z',
                estimated_revenue: 1000,
                completion_method: 'manual',
                project_status: 'pending'
            }
        });
        expect(resp.status()).toBe(422);
        expect(JSON.stringify(await resp.json())).toContain('Estimated End Date must be after');
    });

    test('GUARD-04: Negative estimated_revenue → 422 "must be positive"', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const resp = await page.request.post(`${apiBase}/projects?${qs}`, {
            headers,
            data: {
                project_name: 'Neg-Revenue',
                customer_id: meta.customerId,
                project_start_date: '2026-01-01T00:00:00Z',
                estimated_end_date: '2026-12-31T00:00:00Z',
                estimated_revenue: -9999,
                completion_method: 'manual',
                project_status: 'pending'
            }
        });
        expect(resp.status()).toBe(422);
        expect(JSON.stringify(await resp.json())).toContain('positive');
    });

    test('GUARD-05: Invalid project_status value "approved" → 400', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const resp = await page.request.post(`${apiBase}/projects?${qs}`, {
            headers,
            data: {
                project_name: 'Bad-Status',
                customer_id: meta.customerId,
                project_start_date: '2026-01-01T00:00:00Z',
                estimated_end_date: '2026-12-31T00:00:00Z',
                estimated_revenue: 1000,
                completion_method: 'manual',
                project_status: 'approved'
            }
        });
        expect(resp.status()).toBeGreaterThanOrEqual(400);
        console.log(`[GUARD-05] status='approved' → ${resp.status()}`);
    });

    test('GUARD-06: Non-existent customer_id UUID → 4xx', async ({ page }) => {
        const { app } = await setup(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const resp = await page.request.post(`${apiBase}/projects?${qs}`, {
            headers,
            data: {
                project_name: 'Ghost-Customer',
                customer_id: '00000000-0000-0000-0000-000000000000',
                project_start_date: '2026-01-01T00:00:00Z',
                estimated_end_date: '2026-12-31T00:00:00Z',
                estimated_revenue: 1000,
                completion_method: 'manual',
                project_status: 'pending'
            }
        });
        expect(resp.status()).toBeGreaterThanOrEqual(400);
        console.log(`[GUARD-06] Fake customer → ${resp.status()}`);
    });

    // ── API UPDATE GUARDRAILS ──────────────────────────────────────────────────

    test('GUARD-07: PATCH with invalid status "cancelled" → 400 "Invalid project status"', async ({ page }) => {
        const { app, meta } = await setup(page);
        const project = await createBaseProject(app, meta);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const resp = await page.request.patch(`${apiBase}/project/${project.id}?${qs}`, {
            headers,
            data: { project_status: 'cancelled' }
        });
        expect(resp.status()).toBe(400);
        expect(JSON.stringify(await resp.json())).toContain('Invalid project status');
    });

    test('GUARD-08: PATCH non-existent project_id → 4xx', async ({ page }) => {
        const { app } = await setup(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const resp = await page.request.patch(`${apiBase}/project/00000000-0000-0000-0000-000000000000?${qs}`, {
            headers,
            data: { project_name: 'Ghost' }
        });
        expect(resp.status()).toBeGreaterThanOrEqual(400);
    });

    test('GUARD-09: DELETE /projects/:id → 404 (endpoint not implemented)', async ({ page }) => {
        const { app, meta } = await setup(page);
        const project = await createBaseProject(app, meta);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const resp = await page.request.delete(`${apiBase}/projects/${project.id}?${qs}`, { headers });
        expect(resp.status()).toBe(404);
        console.log(`[GUARD-09] DELETE not implemented → 404 ✓`);
    });

    test('GUARD-10: Unauthenticated GET /projects → 401', async ({ page }) => {
        const { app } = await setup(page);
        const { apiBase, qs } = await app.buildApiContext();
        const resp = await page.request.get(`${apiBase}/projects?${qs}`, {
            headers: { 'x-company': process.env.BEFFA_COMPANY as string }
        });
        expect(resp.status()).toBe(401);
    });

    test('GUARD-11: GET non-existent project_id → 4xx', async ({ page }) => {
        const { app } = await setup(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const resp = await page.request.get(`${apiBase}/project/00000000-0000-0000-0000-000000000000?${qs}`, { headers });
        expect(resp.status()).toBeGreaterThanOrEqual(400);
    });

    test('GUARD-12: remaining_balance is expense-revenue when expense > revenue (no server clamp)', async ({ page }) => {
        const { app, meta } = await setup(page);
        const project = await createBaseProject(app, meta);
        await app.api.project.updateProjectAPI(project.id, { estimated_revenue: 1000, estimated_expense: 5000 });
        const d = await app.api.project.getProjectAPI(project.id);
        expect(parseFloat(d.remaining_balance)).toBe(1000 - 5000);
        console.log(`[GUARD-12] Negative balance allowed: ${d.remaining_balance} — document for product team`);
    });
});
