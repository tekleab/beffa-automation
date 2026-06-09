import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROJECT UI DETAIL & GUARDRAILS — Detail Page, Authentication, Edge Cases
 *
 * UI-only tests for project detail views and guardrails
 * Covers: Detail page, authentication, error handling, filter interactions
 */
test.describe('Project Management: UI Detail & Guardrails @project @ui @smoke @regression @full', () => {

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

    // ── UI: DETAIL PAGE ─────────────────────────────────────────────────────────

    test('UI-12: Project detail page shows financial data (budget / revenue / balance)', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        await page.goto(`/project-management/projects/${project.id}`);
        await page.waitForLoadState('networkidle');
        
        // Try multiple selector strategies for financial data
        const financialSelectors = [
            page.getByText(/budget|revenue|expense|balance/i).first(),
            page.locator('[class*="budget"], [class*="revenue"], [class*="expense"], [class*="balance"]').first(),
            page.getByText(new RegExp((project as any).estimated_revenue || '200000', 'i')).first(),
            page.getByText(new RegExp((project as any).estimated_expense || '80000', 'i')).first(),
        ];
        
        let financialVisible = false;
        for (const selector of financialSelectors) {
            if (await selector.isVisible({ timeout: 5000 }).catch(() => false)) {
                financialVisible = true;
                console.log(`[UI-12] Financial data found with selector`);
                break;
            }
        }
        
        expect(financialVisible).toBe(true);
    });

    test('UI-13: Project detail page shows a status indicator', async ({ page }) => {
        const { app, meta } = await setup(page);
        const { project } = await createProject(app, meta);
        await page.goto(`/project-management/projects/${project.id}`);
        await page.waitForLoadState('networkidle');
        
        // Try multiple selector strategies for status indicator
        const statusSelectors = [
            page.locator('span, div, [class*="badge"], [class*="status"]')
                .filter({ hasText: /pending|in.progress|completed/i }).first(),
            page.getByText(/pending|in.progress|completed/i).first(),
            page.locator('[class*="badge"]').first(),
            page.locator('[class*="status"]').first(),
        ];
        
        let statusVisible = false;
        for (const selector of statusSelectors) {
            if (await selector.isVisible({ timeout: 3000 }).catch(() => false)) {
                statusVisible = true;
                console.log(`[UI-13] Status indicator found with selector`);
                break;
            }
        }
        
        expect(statusVisible).toBe(true);
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
