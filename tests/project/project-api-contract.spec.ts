import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';


/**
 * PROJECT API CONTRACT — CRUD Operations & Business Logic
 *
 * Pure API tests - no UI dependencies
 * Covers: Create, Read, Update, List, Filter, Search, Status Transitions
 */
test.describe('Project Management: API Contract @project @api @smoke @regression @full', () => {

    async function setup(page: any, request: any) {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const meta = await app.api.project.discoverMetadataAPI();
        return { app, meta };
    }

    async function createProject(app: AppManager, meta: any, overrides: Record<string, any> = {}) {
        const name = `E2E-Project-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
        const project = await app.api.project.createProjectAPI({
            name,
            customerId: meta.customerId,
            estimatedRevenue: 200000,
            estimatedExpense: 80000,
            ...overrides
        });
        return { project, name };
    }

    // ── API: CREATION ───────────────────────────────────────────────────────────

    test('API-01: Create project returns valid id, ref and pending status', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        const { project, name } = await createProject(app, meta);
        expect(project.id).toBeTruthy();
        expect(project.ref).toBeTruthy();
        expect(project.status).toBe('pending');
        console.log(`[OK] Created: ${project.ref} (${project.id})`);
    });

    test('API-02: GET single project returns correct fields', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        const { project, name } = await createProject(app, meta);
        const d = await app.api.project.getProjectAPI(project.id);
        expect(d.id).toBe(project.id);
        expect(d.project_name).toBe(name);
        expect(d.project_status).toBe('pending');
        expect(parseFloat(d.estimated_revenue)).toBe(200000);
        expect(parseFloat(d.estimated_expense)).toBe(80000);
        expect(d.customer).toBeTruthy();
        expect(d.customer.id).toBe(meta.customerId);
    });

    test('API-03: remaining_balance = estimated_revenue - estimated_expense', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        const { project } = await createProject(app, meta);
        const d = await app.api.project.getProjectAPI(project.id);
        const bal = parseFloat(d.remaining_balance);
        expect(bal).toBe(200000 - 80000);
        console.log(`[AUDIT] remaining_balance: ${bal} ✓`);
    });

    test('API-04: LIST projects includes newly created project', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        const { project } = await createProject(app, meta);
        const projects = await app.api.project.listProjectsAPI();
        expect(projects.find((p: any) => p.id === project.id)).toBeTruthy();
    });

    test('API-05: LIST filter by customer_id returns only matching projects', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        await createProject(app, meta);
        const projects = await app.api.project.listProjectsAPI({ customer_id: meta.customerId });
        expect(projects.length).toBeGreaterThan(0);
        expect(projects.every((p: any) => (p.customer_id ?? p.customer?.id) === meta.customerId)).toBe(true);
    });

    test('API-06: LIST filter project_status=pending includes new project', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        const { project } = await createProject(app, meta);
        const projects = await app.api.project.listProjectsAPI({ project_status: 'pending' });
        expect(projects.find((p: any) => p.id === project.id)).toBeTruthy();
    });

    test('API-07: LIST search by name fragment finds project', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        const { project, name } = await createProject(app, meta);
        const fragment = name.split('-').slice(0, 2).join('-');
        const projects = await app.api.project.listProjectsAPI({ search: fragment });
        expect(projects.find((p: any) => p.id === project.id)).toBeTruthy();
    });

    // ── API: UPDATE ─────────────────────────────────────────────────────────────

    test('API-08: PATCH project_name persists', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        const { project, name } = await createProject(app, meta);
        const updatedName = `${name}-UPD`;
        await app.api.project.updateProjectAPI(project.id, { project_name: updatedName });
        const d = await app.api.project.getProjectAPI(project.id);
        expect(d.project_name).toBe(updatedName);
    });

    test('API-09: PATCH estimated_revenue recalculates remaining_balance', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        const { project } = await createProject(app, meta);
        await app.api.project.updateProjectAPI(project.id, { estimated_revenue: 300000 });
        const d = await app.api.project.getProjectAPI(project.id);
        expect(parseFloat(d.remaining_balance)).toBe(300000 - 80000);
    });

    test('API-10: PATCH estimated_expense recalculates remaining_balance', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        const { project } = await createProject(app, meta);
        await app.api.project.updateProjectAPI(project.id, { estimated_expense: 100000 });
        const d = await app.api.project.getProjectAPI(project.id);
        expect(parseFloat(d.remaining_balance)).toBe(200000 - 100000);
    });

    test('API-11: PATCH percent_complete persists', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        const { project } = await createProject(app, meta);
        await app.api.project.updateProjectAPI(project.id, { percent_complete: 25 });
        const d = await app.api.project.getProjectAPI(project.id);
        expect(parseFloat(d.percent_complete)).toBe(25);
    });

    // ── API: STATUS TRANSITIONS ─────────────────────────────────────────────────

    test('API-12: Status pending → in-progress is accepted', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        const { project } = await createProject(app, meta);
        const p = await app.api.project.setProjectStatusAPI(project.id, 'in-progress');
        expect(p.status).toBe('in-progress');
    });

    test('API-13: Status in-progress → completed is accepted', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        const { project } = await createProject(app, meta);
        await app.api.project.setProjectStatusAPI(project.id, 'in-progress');
        const p = await app.api.project.setProjectStatusAPI(project.id, 'completed');
        expect(p.status).toBe('completed');
    });

    test('API-14: Status completed → pending is accepted (reopen)', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        const { project } = await createProject(app, meta);
        await app.api.project.setProjectStatusAPI(project.id, 'in-progress');
        await app.api.project.setProjectStatusAPI(project.id, 'completed');
        const p = await app.api.project.setProjectStatusAPI(project.id, 'pending');
        expect(p.status).toBe('pending');
    });

    // ── API: EDGE CASES ─────────────────────────────────────────────────────────

    test('API-15: completion_method=task_completion accepted, percent stays 0 without tasks', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        const { project } = await createProject(app, meta);
        await app.api.project.updateProjectAPI(project.id, { completion_method: 'task_completion' });
        const d = await app.api.project.getProjectAPI(project.id);
        expect(d.completion_method).toBe('task_completion');
        expect(parseFloat(d.percent_complete)).toBe(0);
    });

    test('API-16: expense > revenue yields negative remaining_balance (no server guard)', async ({ page }) => {
        const { app, meta } = await setup(page, request);
        const { project } = await createProject(app, meta);
        await app.api.project.updateProjectAPI(project.id, { estimated_revenue: 1000, estimated_expense: 5000 });
        const d = await app.api.project.getProjectAPI(project.id);
        const bal = parseFloat(d.remaining_balance);
        expect(bal).toBe(1000 - 5000);
        console.log(`[NOTE] Negative balance allowed: ${bal} — no server guard on this.`);
    });
});
