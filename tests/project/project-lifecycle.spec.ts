import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROJECT LIFECYCLE & CRUD AUDITS
 *
 * Split: ~60% API | ~40% UI
 * API contract confirmed from live scan:
 *   POST   /projects              → create
 *   GET    /projects              → list (filters: customer_id, project_status, search)
 *   GET    /project/:id           → single
 *   PATCH  /project/:id           → update
 *   Valid statuses: 'pending' | 'in-progress' | 'completed'
 *   remaining_balance = estimated_revenue - estimated_expense (server-computed)
 *   No DELETE endpoint (404)
 *   Tasks: UI-only (status_id FK not exposed via API)
 *
 * PARALLEL MODE: Each test creates its own isolated project — no shared state.
 */
test.describe('Project Management: Lifecycle & CRUD Audits @project @audit @regression', () => {

    // Helper: creates a fresh project + returns app, meta, project
    async function setup(page: any) {
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
        const { app, meta } = await setup(page);
        const { project, name } = await createProject(app, meta);
        expect(project.id).toBeTruthy();
        expect(project.ref).toBeTruthy();
        expect(project.status).toBe('pending');
        console.log(`[OK] Created: ${project.ref} (${project.id})`);
    });

    test('API-02: GET single project returns correct fields', async ({ page }) => {
        const { app, meta } = await setup(page);
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
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        const d = await app.api.project.getProjectAPI(project.id);
        const bal = parseFloat(d.remaining_balance);
        expect(bal).toBe(200000 - 80000);
        console.log(`[AUDIT] remaining_balance: ${bal} ✓`);
    });

    test('API-04: LIST projects includes newly created project', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        const projects = await app.api.project.listProjectsAPI();
        expect(projects.find((p: any) => p.id === project.id)).toBeTruthy();
    });

    test('API-05: LIST filter by customer_id returns only matching projects', async ({ page }) => {
        const { app, meta } = await setup(page);
        await createProject(app, meta);
        const projects = await app.api.project.listProjectsAPI({ customer_id: meta.customerId });
        expect(projects.length).toBeGreaterThan(0);
        expect(projects.every((p: any) => (p.customer_id ?? p.customer?.id) === meta.customerId)).toBe(true);
    });

    test('API-06: LIST filter project_status=pending includes new project', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        const projects = await app.api.project.listProjectsAPI({ project_status: 'pending' });
        expect(projects.find((p: any) => p.id === project.id)).toBeTruthy();
    });

    test('API-07: LIST search by name fragment finds project', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project, name } = await createProject(app, meta);
        const fragment = name.split('-').slice(0, 2).join('-');
        const projects = await app.api.project.listProjectsAPI({ search: fragment });
        expect(projects.find((p: any) => p.id === project.id)).toBeTruthy();
    });

    // ── API: UPDATE ─────────────────────────────────────────────────────────────

    test('API-08: PATCH project_name persists', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project, name } = await createProject(app, meta);
        const updatedName = `${name}-UPD`;
        await app.api.project.updateProjectAPI(project.id, { project_name: updatedName });
        const d = await app.api.project.getProjectAPI(project.id);
        expect(d.project_name).toBe(updatedName);
    });

    test('API-09: PATCH estimated_revenue recalculates remaining_balance', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        await app.api.project.updateProjectAPI(project.id, { estimated_revenue: 300000 });
        const d = await app.api.project.getProjectAPI(project.id);
        expect(parseFloat(d.remaining_balance)).toBe(300000 - 80000);
    });

    test('API-10: PATCH estimated_expense recalculates remaining_balance', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        await app.api.project.updateProjectAPI(project.id, { estimated_expense: 100000 });
        const d = await app.api.project.getProjectAPI(project.id);
        expect(parseFloat(d.remaining_balance)).toBe(200000 - 100000);
    });

    test('API-11: PATCH percent_complete persists', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        await app.api.project.updateProjectAPI(project.id, { percent_complete: 25 });
        const d = await app.api.project.getProjectAPI(project.id);
        expect(parseFloat(d.percent_complete)).toBe(25);
    });

    // ── API: STATUS TRANSITIONS ─────────────────────────────────────────────────

    test('API-12: Status pending → in-progress is accepted', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        const p = await app.api.project.setProjectStatusAPI(project.id, 'in-progress');
        expect(p.status).toBe('in-progress');
    });

    test('API-13: Status in-progress → completed is accepted', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        await app.api.project.setProjectStatusAPI(project.id, 'in-progress');
        const p = await app.api.project.setProjectStatusAPI(project.id, 'completed');
        expect(p.status).toBe('completed');
    });

    test('API-14: Status completed → pending is accepted (reopen)', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        await app.api.project.setProjectStatusAPI(project.id, 'in-progress');
        await app.api.project.setProjectStatusAPI(project.id, 'completed');
        const p = await app.api.project.setProjectStatusAPI(project.id, 'pending');
        expect(p.status).toBe('pending');
    });

    // ── API: EDGE CASES ─────────────────────────────────────────────────────────

    test('API-15: completion_method=task_completion accepted, percent stays 0 without tasks', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        await app.api.project.updateProjectAPI(project.id, { completion_method: 'task_completion' });
        const d = await app.api.project.getProjectAPI(project.id);
        expect(d.completion_method).toBe('task_completion');
        expect(parseFloat(d.percent_complete)).toBe(0);
    });

    test('API-16: expense > revenue yields negative remaining_balance (no server guard)', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        await app.api.project.updateProjectAPI(project.id, { estimated_revenue: 1000, estimated_expense: 5000 });
        const d = await app.api.project.getProjectAPI(project.id);
        const bal = parseFloat(d.remaining_balance);
        expect(bal).toBe(1000 - 5000);
        console.log(`[NOTE] Negative balance allowed: ${bal} — no server guard on this.`);
    });

    // ── UI: LIST PAGE ───────────────────────────────────────────────────────────

    test('UI-01: Projects list page loads with all key table columns', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');
        for (const col of ['Project Name', 'Customer', 'Status', 'Budget', 'Tasks', 'Start Date', 'End Date']) {
            await expect(page.getByText(col, { exact: false }).first()).toBeVisible({ timeout: 10000 });
        }
    });

    test('UI-02: Filter pills (Workspace, Workflow, Status, Budget) are visible', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');
        for (const pill of ['Workspace', 'Workflow', 'Status', 'Budget']) {
            await expect(page.getByRole('button', { name: new RegExp(pill, 'i') }).first()).toBeVisible({ timeout: 8000 });
        }
    });

    test('UI-03: Sort and View buttons are visible in toolbar', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('button', { name: /Sort/i })).toBeVisible({ timeout: 8000 });
        await expect(page.getByRole('button', { name: /View/i })).toBeVisible({ timeout: 8000 });
    });

    test('UI-04: Advanced filters and Command filters links are present', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');
        await expect(page.getByText(/Advanced filters/i).first()).toBeVisible({ timeout: 8000 });
        await expect(page.getByText(/Command filters/i).first()).toBeVisible({ timeout: 8000 });
    });

    test('UI-05: Add Project button and Export button are visible', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('button', { name: /Add Project/i })).toBeVisible({ timeout: 8000 });
        await expect(page.getByRole('button', { name: /Export/i })).toBeVisible({ timeout: 8000 });
    });

    test('UI-06: Search input is present and accepts text', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');
        const search = page.getByPlaceholder(/Search/i).first();
        await expect(search).toBeVisible({ timeout: 8000 });
        await search.fill('test');
        await page.waitForTimeout(1000);
        await search.clear();
    });

    test('UI-07: Pagination shows rows-per-page and page count', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');
        await expect(page.getByText(/Rows per page/i).first()).toBeVisible({ timeout: 8000 });
        await expect(page.getByText(/Page [0-9]+ of [0-9]+/i).first()).toBeVisible({ timeout: 8000 });
    });

    test('UI-08: Project created via API appears in the list', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');
        await expect(page.getByText(project.ref, { exact: false }).first()).toBeVisible({ timeout: 15000 });
    });

    test('UI-09: Clicking project row navigates to detail view', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');
        await page.getByText(project.ref, { exact: false }).first().click();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain('project');
        await expect(page.getByText(project.ref, { exact: false }).first()).toBeVisible({ timeout: 10000 });
    });

    // ── UI: ADD PROJECT FORM ────────────────────────────────────────────────────

    test('UI-10: Add Project button opens form (modal or new page)', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: /Add Project/i }).click();
        await page.waitForTimeout(2000);
        const formOpen = await page.locator('[role="dialog"], form').first().isVisible({ timeout: 6000 }).catch(() => false)
            || page.url().includes('new') || page.url().includes('create');
        expect(formOpen).toBe(true);
    });

    test('UI-11: Add Project form has project name input', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: /Add Project/i }).click();
        await page.waitForTimeout(2000);
        const nameInput = page.getByRole('textbox', { name: /project name/i })
            .or(page.locator('input[name*="name"], input[placeholder*="name" i]').first());
        const visible = await nameInput.isVisible({ timeout: 6000 }).catch(() => false);
        if (!visible) {
            const anyInput = page.locator('[role="dialog"] input[type="text"], [role="dialog"] input:not([type])').first();
            await expect(anyInput).toBeVisible({ timeout: 6000 });
        } else {
            await expect(nameInput).toBeVisible();
        }
        await page.keyboard.press('Escape');
    });

    // ── UI: DETAIL PAGE ─────────────────────────────────────────────────────────

    test('UI-12: Project detail page shows financial data (budget / revenue / balance)', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        await page.goto(`/project-management/projects/${project.id}`);
        await page.waitForLoadState('networkidle');
        const financialText = await page.getByText(/budget|revenue|expense|balance/i).first()
            .isVisible({ timeout: 10000 }).catch(() => false);
        expect(financialText).toBe(true);
    });

    test('UI-13: Project detail page shows a status indicator', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        await page.goto(`/project-management/projects/${project.id}`);
        await page.waitForLoadState('networkidle');
        const statusEl = page.locator('span, div, [class*="badge"], [class*="status"]')
            .filter({ hasText: /pending|in.progress|completed/i }).first();
        await expect(statusEl).toBeVisible({ timeout: 10000 });
    });

    test('UI-14: Project detail page shows customer name', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        await page.goto(`/project-management/projects/${project.id}`);
        await page.waitForLoadState('networkidle');
        await expect(page.getByText(meta.customerName, { exact: false }).first()).toBeVisible({ timeout: 10000 });
    });

    test('UI-15: Direct URL to non-existent project shows error or redirects', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects/00000000-0000-0000-0000-000000000000');
        await page.waitForLoadState('networkidle');
        const errorOrRedirect = await page.getByText(/not found|error|no results/i).first()
            .isVisible({ timeout: 8000 }).catch(() => false)
            || !page.url().includes('00000000-0000-0000-0000-000000000000');
        expect(errorOrRedirect).toBe(true);
    });
});
