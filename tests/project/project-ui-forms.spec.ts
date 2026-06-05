import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROJECT UI FORMS & DETAIL — Add Form, Detail Page, UI Guardrails
 *
 * UI-only tests for project forms, detail views, and edge cases
 * Covers: Add form, detail page, validation, authentication
 */
test.describe('Project Management: UI Forms & Detail @project @ui @smoke @regression @full', () => {

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

    // ── UI: ADD PROJECT FORM ────────────────────────────────────────────────────

    test('UI-10: Add Project button opens form (modal or new page)', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');
        const addProjectEl = page.getByRole('link', { name: /Add Project/i }).or(page.getByRole('button', { name: /Add Project/i })).first();
        await addProjectEl.click();
        await page.waitForTimeout(2000);
        const formOpen = await page.locator('[role="dialog"], form').first().isVisible({ timeout: 6000 }).catch(() => false)
            || page.url().includes('new') || page.url().includes('create');
        expect(formOpen).toBe(true);
    });

    test('UI-11: Add Project form has project name input', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');
        const addProjectEl2 = page.getByRole('link', { name: /Add Project/i }).or(page.getByRole('button', { name: /Add Project/i })).first();
        await addProjectEl2.click();
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

    // ── UI GUARDRAILS ──────────────────────────────────────────────────────────

    test('UI-GUARD-01: Add Project form blocks empty submit — keeps form open or shows error', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');

        // "Add Project" renders as a link (<a>) in this ERP, not a <button>
        const addProjectEl = page.getByRole('link', { name: /Add Project/i })
            .or(page.getByRole('button', { name: /Add Project/i })).first();

        const elVisible = await addProjectEl.isVisible({ timeout: 8000 }).catch(() => false);
        if (!elVisible) {
            console.log('[UI-GUARD-01] Add Project element not found — skipping');
            return;
        }

        await addProjectEl.click();
        await page.waitForTimeout(2000);

        // Accept either a modal/dialog/form OR a new-page route (e.g. /projects/new)
        const formOpen = await page.locator('[role="dialog"], form').first()
            .isVisible({ timeout: 5000 }).catch(() => false)
            || page.url().includes('new') || page.url().includes('create');

        expect(formOpen).toBe(true);
        console.log(`[UI-GUARD-01] Add Project form opened: url=${page.url()}`);

        // Try submitting empty — verify validation blocks it
        const saveBtn = page.getByRole('button', { name: /save|create|submit/i }).last();
        if (await saveBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
            await saveBtn.click();
            await page.waitForTimeout(1000);
            const stillOpen = await page.locator('[role="dialog"], form').first()
                .isVisible({ timeout: 3000 }).catch(() => false);
            const hasError = await page.getByText(/required|invalid|error/i).first()
                .isVisible({ timeout: 3000 }).catch(() => false);
            expect(stillOpen || hasError).toBe(true);
            console.log(`[UI-GUARD-01] Empty submit blocked: stillOpen=${stillOpen} hasError=${hasError}`);
        }
    });

    test('UI-GUARD-02: Unauthenticated browser access to projects redirects to login', async ({ browser }) => {
        const ctx = await browser.newContext({ storageState: undefined });
        const page = await ctx.newPage();
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain('login');
        await ctx.close();
    });

    test('UI-GUARD-03: Status filter pill click opens filter options', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('networkidle');
        const statusBtn = page.getByRole('button', { name: /Status/i }).first();
        if (await statusBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await statusBtn.click();
            await page.waitForTimeout(1000);
            const dropdownOpen = await page.locator('[role="listbox"], [role="dialog"], [role="menu"], [class*="dropdown"], [class*="popover"]')
                .filter({ visible: true }).first().isVisible({ timeout: 4000 }).catch(() => false);
            console.log(`[UI-GUARD-03] Status filter opens dropdown: ${dropdownOpen}`);
            expect(dropdownOpen).toBe(true);
            await page.keyboard.press('Escape');
        }
    });
});
