import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: Project Management - UI Detail Page & Guardrail Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Project detail page shows financial data (budget/revenue/balance)
 * 2. Status indicator rendered on detail page
 * 3. Customer name displayed correctly in detail header
 * 4. Non-existent project URL shows error or redirects
 * 5. Unauthenticated browser access redirects to login
 * =============================================================================
 */


/**
 * PROJECT UI DETAIL & GUARDRAILS — Detail Page, Authentication, Edge Cases
 *
 * UI-only tests for project detail views and guardrails
 * Covers: Detail page, authentication, error handling, filter interactions
 */
test.describe('Project Management: UI Detail & Guardrails @project @ui @smoke @regression @full', () => {

    async function setup(page: any) {
        const app = new AppManager(page);
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

    // ── UI: DETAIL PAGE ─────────────────────────────────────────────────────────

    test('UI-12: Project detail page shows financial data (budget / revenue / balance)', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        // Correct detail route: /project-management/projects/:projectID/detail
        await page.goto(`/project-management/projects/${project.id}/detail`);
        await page.waitForSelector('h1, h2, [class*="heading"], [class*="title"], main', { timeout: 30000 }).catch(() => {});

        const financialVisible =
            await page.getByText(/Estimated Revenue|Estimated Expense|Remaining Balance|Budget/i).first().isVisible({ timeout: 8000 }).catch(() => false) ||
            await page.getByText('200000', { exact: false }).first().isVisible({ timeout: 3000 }).catch(() => false) ||
            await page.getByText('80000', { exact: false }).first().isVisible({ timeout: 3000 }).catch(() => false);

        expect(financialVisible).toBe(true);
    });

    test('UI-13: Project detail page shows a status indicator', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        // Correct detail route: /project-management/projects/:projectID/detail
        await page.goto(`/project-management/projects/${project.id}/detail`);
        await page.waitForSelector('h1, h2, [class*="heading"], [class*="title"], main', { timeout: 30000 }).catch(() => {});

        const statusVisible =
            await page.getByText(/pending|in progress|in-progress|completed/i).first().isVisible({ timeout: 8000 }).catch(() => false) ||
            await page.locator('[class*="badge"], [class*="status"], [class*="tag"]').first().isVisible({ timeout: 5000 }).catch(() => false);

        expect(statusVisible).toBe(true);
    });

    test('UI-14: Project detail page shows customer name', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        await page.goto(`/project-management/projects/${project.id}/detail`);
        await page.waitForSelector('h1, h2, main', { timeout: 30000 }).catch(() => {});
        await expect(page.getByText(meta.customerName, { exact: false }).first()).toBeVisible({ timeout: 10000 });
    });

    test('UI-15: Direct URL to non-existent project shows error or redirects', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects/00000000-0000-0000-0000-000000000000/detail');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        const errorOrRedirect =
            await page.getByText(/not found|error|no results|404/i).first().isVisible({ timeout: 5000 }).catch(() => false) ||
            !page.url().includes('00000000-0000-0000-0000-000000000000');
        expect(errorOrRedirect).toBe(true);
    });

    // ── UI GUARDRAILS ──────────────────────────────────────────────────────────

    test('UI-GUARD-02: Unauthenticated browser access to projects redirects to login', async ({ browser }) => {
        const ctx = await browser.newContext({ storageState: undefined });
        const page = await ctx.newPage();
        await page.goto('/project-management/projects', { waitUntil: 'commit', timeout: 30000 });
        await page.waitForURL(/login/, { timeout: 10000 }).catch(() => {});
        // ERP may redirect to /login OR render the page with a login form
        const redirected = page.url().includes('login');
        const loginForm = await page.locator('input[type="password"], input[name="password"], button:has-text("Login")').first()
            .isVisible({ timeout: 5000 }).catch(() => false);
        console.log(`[UI-GUARD-02] redirected=${redirected} loginForm=${loginForm} url=${page.url()}`);
        expect(redirected || loginForm, 'Expected redirect to login or login form to be visible').toBe(true);
        await ctx.close();
    });

    test('UI-GUARD-03: Status filter pill click opens filter options', async ({ page }) => {
        const { app } = await setup(page);
        await page.goto('/project-management/projects');
        await page.waitForLoadState('domcontentloaded');
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
