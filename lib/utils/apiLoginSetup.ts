import { Page } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * Lightweight login for load/stress tests.
 * Does a direct POST /users/login, injects the token into localStorage
 * via the login page (lightest possible page load — no SPA bundle wait).
 * Returns a ready AppManager with cachedToken set.
 */
export async function apiLoginSetup(page: Page): Promise<AppManager> {
    const base = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
        .replace(/['"]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
    const apiBase = base.endsWith('/api') ? base : base + '/api';
    const baseUrl = (process.env.BASE_URL || 'http://localhost:4173')
        .replace(/['"]+/g, '').replace(/\/$/, '');

    const year = process.env.BEFFA_YEAR || '2019';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';

    const r = await page.request.post(
        `${apiBase}/users/login?year=${year}&period=${period}&calendar=${calendar}&month=6`,
        {
            data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
            headers: { 'Content-Type': 'application/json' }
        }
    );
    if (!r.ok()) throw new Error(`apiLoginSetup failed: HTTP ${r.status()}`);
    const token = (await r.json()).auth_token;
    if (!token) throw new Error('apiLoginSetup: no auth_token in response');

    // Navigate to login page (static HTML, no bundle) just to get a valid origin
    // so localStorage.setItem works and page.request has a proper HTTP context.
    await page.goto(`${baseUrl}/users/login`, { waitUntil: 'commit', timeout: 30000 });

    await page.evaluate(
        ({ jwt, company, yr }: { jwt: string; company: string; yr: string }) => {
            localStorage.setItem('auth-token', jwt);
            localStorage.setItem('token', jwt);
            localStorage.setItem('currentCompany', company);
            localStorage.setItem('selectedYear', yr);
            localStorage.setItem('calendar', 'EC');
            localStorage.setItem('period', 'yearly');
            localStorage.setItem('selected-role', 'IT Administrator / User Manager');
        },
        { jwt: token, company: process.env.BEFFA_COMPANY as string, yr: year }
    );

    // Set process.env.BEFFA_YEAR so DateHelper and all API calls use the correct year
    process.env.BEFFA_YEAR = year;

    const app = new AppManager(page);
    // Cache the token so _getAuthToken() returns it immediately without localStorage lookup
    (app as any).cachedToken = token;

    return app;
}
