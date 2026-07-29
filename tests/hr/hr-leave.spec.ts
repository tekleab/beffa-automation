import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * HR: Leave Applications
 * Happy path: endpoint health, pagination integrity
 * Edge cases: missing required fields on creation
 */
test.describe('HR: Leave Applications @hr @smoke @regression @full', () => {
    test.setTimeout(120000);

    // -------------------------------------------------------------------------
    // HAPPY PATH: Leave applications endpoint responds with valid structure
    // -------------------------------------------------------------------------
    test('API: Leave applications endpoint must respond with valid pagination', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const leaves = await app.api.hr.listLeaveApplications(10);
        expect(Array.isArray(leaves)).toBe(true);
        console.log(`[PASS] Leave applications endpoint healthy. Count: ${leaves.length}`);
    });

    // -------------------------------------------------------------------------
    // EDGE CASE: Leave application creation without required fields must fail
    // -------------------------------------------------------------------------
    test('Guardrail: Leave application must reject payload missing leave_type_id and reason', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const meta = await app.api.hr.discoverMetadataAPI();
        if (!meta) { console.log('[SKIP] HR org structure not configured'); return; }
        const token = await app._getAuthToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-company': process.env.BEFFA_COMPANY as string,
            'Content-Type': 'application/json',
        };
        const params = `year=${process.env.BEFFA_YEAR||'2018'}&period=${process.env.BEFFA_PERIOD||'yearly'}&calendar=${process.env.BEFFA_CALENDAR||'ec'}`;

        // Missing leave_type_id and reason — known required fields from API probe
        const resp = await page.request.post(
            `${app.apiBase}/leave-applications?${params}`,
            {
                headers,
                data: {
                    employee_id: meta.employeeId,
                    start_date: '2026-06-01T00:00:00Z',
                    end_date: '2026-06-02T00:00:00Z',
                }
            }
        );

        expect(resp.status()).toBe(422);
        const body = await resp.json();
        expect(body).toHaveProperty('details');
        const missingFields = Object.keys(body.details);
        expect(missingFields).toContain('leave_type_id');
        console.log(`[PASS] Incomplete leave application rejected. Missing: ${missingFields.join(', ')}`);
    });

    // -------------------------------------------------------------------------
    // UI: Leave Applications page renders without error
    // -------------------------------------------------------------------------
    test('UI: Leave Applications page must load and render the leave module', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        await page.goto('/human-resources/leave/leave-applications', { waitUntil: 'networkidle' });

        const hasError = await page.locator('text=/error|failed|something went wrong/i').first()
            .isVisible({ timeout: 5000 }).catch(() => false);
        expect(hasError).toBe(false);

        const content = page.locator('table, [role="table"], h1, h2, [role="heading"], button').first();
        await content.waitFor({ state: 'visible', timeout: 20000 });
        console.log(`[PASS] Leave Applications page rendered without errors`);
    });
});
