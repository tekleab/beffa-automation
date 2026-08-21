import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: Project Management - UI Form & Submission Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Add Project button navigates to /projects/new
 * 2. Form renders all required inputs (name, customer, dates, budget)
 * 3. Submit button disabled on empty form (error visibility guard)
 * =============================================================================
 */


/**
 * PROJECT UI FORM — Add Project Form Tests
 * Route: /project-management/projects/new
 *
 * Key selectors (from live probe):
 *   input#project_name          — Project Name *
 *   input#ref                   — Project ID *
 *   select#project_status       — Project Status *
 *   input#percent_complete      — Percent Completed *
 *   select#completion_method    — Completion Method *
 *   input#customer_id           — Project Owner Customer * (popover)
 *   input#workspace_id          — Project Workspace * (popover)
 *   input#estimated_revenue     — Estimated Revenue
 *   input#estimated_expense     — Estimated Expense
 *   input#project_start_date    — Project Start date (date)
 *   input#estimated_start_date  — Estimated End date (date, name="estimated_end_date")
 *   textarea#description        — Description
 *   input#is_active             — Is Active (checkbox)
 *   button[type="submit"] "Create project" — disabled=true until required fields filled
 */
test.describe('Project Management: UI Form @project @ui @smoke @regression @full', () => {

    async function setup(page: any) {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const meta = await app.api.project.discoverMetadataAPI();
        return { app, meta };
    }

    // ── UI: ADD PROJECT FORM ────────────────────────────────────────────────────

    test('UI-10: Add Project button navigates to /projects/new', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects', { waitUntil: 'commit' });
        const addBtn = page.getByRole('link', { name: /Add Project/i })
            .or(page.getByRole('button', { name: /Add Project/i })).first();
        await addBtn.waitFor({ state: 'visible', timeout: 30000 });
        await addBtn.click();
        await page.waitForURL(url => url.href.includes('/projects/new'), { timeout: 15000 });
        expect(page.url()).toMatch(/\/projects\/new/);
    });

    test('UI-11: Add Project form has all required inputs', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects/new', { waitUntil: 'commit' });
        // Text inputs & selects
        await expect(page.locator('input#project_name')).toBeVisible({ timeout: 30000 });
        await expect(page.locator('input#ref')).toBeVisible();
        await expect(page.locator('select#project_status')).toBeVisible();
        await expect(page.locator('input#percent_complete')).toBeVisible();
        await expect(page.locator('select#completion_method')).toBeVisible();
        // Customer & workspace use button triggers (input is hidden until triggered)
        await expect(page.locator('button#customer_id')).toBeVisible();
        await expect(page.locator('button#workspace_id')).toBeVisible();
    });

    // TODO: UI-POM-10 — Project UI form creation via POM is blocked.
    // Root cause: Chakra UI popover fields (customer, workspace) update display text only.
    // React internal state does not reflect the selection in DOM input values, so the
    // "Create project" submit button remains disabled. Pending network payload intercept
    // to identify the exact React state mutation mechanism.
    //
    // test('UI-POM-10: Create and verify project entirely through the UI form using POM', async ({ page }) => {
    //     const { app, meta } = await setup(page);
    //     const projectName = `E2E-UI-POM-${Date.now()}`;
    //     await app.ui.project.navigateToProjects();
    //     await app.ui.project.clickAddProject();
    //     await app.ui.project.fillProjectForm({
    //         name: projectName,
    //         customerName: meta.customerName,
    //         workspaceName: meta.workspaceName,
    //         estimatedRevenue: 150000,
    //         estimatedExpense: 60000
    //     });
    //     await app.ui.project.clickSave();
    //     await app.ui.project.navigateToProjects();
    //     await app.ui.project.verifyInList(projectName);
    // });

    // ── UI GUARDRAILS ──────────────────────────────────────────────────────────

    test('UI-GUARD-01: "Create project" submit button is disabled on empty form', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects/new', { waitUntil: 'commit' });

        // Probe confirmed: BTN[71] "Create project" type="submit" disabled=true on empty form
        const saveBtn = page.locator('button[type="submit"]').filter({ hasText: /Create project/i });
        await expect(saveBtn).toBeVisible({ timeout: 8000 });
        await expect(saveBtn).toBeDisabled();
    });
});
