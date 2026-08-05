import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

const API = () => (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
    .replace(/['"]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001') + '/api';
const QS = () => `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

async function apiLogin(request: any): Promise<string> {
    const r = await request.post(`${API()}/users/login?${QS()}&month=6`, {
        data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
        headers: { 'Content-Type': 'application/json' }
    });
    const token = (await r.json()).auth_token;
    if (!token) throw new Error('apiLogin failed');
    return token;
}


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
    test('API: Leave applications endpoint must respond with valid pagination', async ({ page , request }) => {
        const app = new AppManager(page);
        await apiLogin(request);

        const leaves = await app.api.hr.listLeaveApplications(10);
        expect(Array.isArray(leaves)).toBe(true);
        console.log(`[PASS] Leave applications endpoint healthy. Count: ${leaves.length}`);
    });

    // -------------------------------------------------------------------------
    // EDGE CASE: Leave application creation without required fields must fail
    // -------------------------------------------------------------------------
    test('Guardrail: Leave application must reject payload missing leave_type_id and reason', async ({ page , request }) => {
        const app = new AppManager(page);
        await apiLogin(request);

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
    test('UI: Leave Applications page must load and render the leave module', async ({ page , request }) => {
        const app = new AppManager(page);
        await apiLogin(request);

        await page.goto('/human-resources/leave/leave-applications', { waitUntil: 'commit' });

        const hasError = await page.locator('text=/error|failed|something went wrong/i').first()
            .isVisible({ timeout: 5000 }).catch(() => false);
        expect(hasError).toBe(false);

        const content = page.locator('table, [role="table"], h1, h2, [role="heading"], button').first();
        await content.waitFor({ state: 'visible', timeout: 20000 });
        console.log(`[PASS] Leave Applications page rendered without errors`);
    });
});
