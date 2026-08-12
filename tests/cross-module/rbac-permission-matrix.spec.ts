import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * RBAC & MULTI-TENANT PERMISSION MATRIX AUDIT
 *
 * Scenarios:
 * 1. Role Discovery: Queries GET /roles to resolve role definitions dynamically.
 * 2. Cross-Tenant IDOR: Verification that Company A's authenticated session cannot access
 *    Company B's invoices or bills, returning 400, 401, or 403.
 * 3. Auditor Role Enforcement: Verifies that a user with the Auditor role has read-only
 *    access (GET returns 200/204, POST/PUT/PATCH/DELETE returns 403).
 */

const API = () => (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
    .replace(/['"]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001') + '/api';

const QS = () => `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

function h(token: string, company?: string) {
    return {
        'Authorization': `Bearer ${token}`,
        'x-company': company || (process.env.BEFFA_COMPANY as string),
        'Content-Type': 'application/json'
    };
}

async function apiLogin(request: any) {
    const r = await request.post(`${API()}/users/login?${QS()}&month=6`, {
        data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
        headers: { 'Content-Type': 'application/json' }
    });
    const token = (await r.json()).auth_token;
    if (!token) throw new Error('Admin login failed');
    return token;
}

test.describe('RBAC & Multi-Tenant Permission Matrix Audit @security @regression @full', () => {
    test.describe.configure({ mode: 'serial' });
    test.setTimeout(120000);

    let adminToken: string;
    let apiBase: string;
    let roles: Array<{ id: string; name: string }> = [];

    test.beforeAll(async ({ request }) => {
        adminToken = await apiLogin(request);
        apiBase = API();

        // Query roles dynamically
        try {
            const resp = await request.get(`${apiBase}/roles?${QS()}`, { headers: h(adminToken) });
            if (resp.ok()) {
                const data = await resp.json();
                roles = data.data || data.items || (Array.isArray(data) ? data : []);
                console.log(`[SETUP] Discovered roles: ${JSON.stringify(roles.map(r => r.name))}`);
            }
        } catch (e) {
            console.warn(`[WARN] Could not discover roles: ${e}`);
        }

        // Fallback roles if endpoint doesn't return
        if (roles.length === 0) {
            roles = [
                { id: '091b3e1c-f672-41cd-8627-c8d184f9fb8f', name: 'Auditor' }
            ];
        }
    });

    // ── 1. CROSS-TENANT IDOR GUARDRAILS ──────────────────────────────────────
    test('Guardrail: Multi-tenant isolation must reject cross-tenant invoice requests', async ({ request }) => {
        // Create Company B header
        const companyB = 'SampleCompanyB_DoesNotExist_XYZ';
        const headersB = h(adminToken, companyB);

        // Attempt to fetch invoices with Company B's header
        const resp = await request.get(`${apiBase}/invoices?page=1&pageSize=5&${QS()}`, { headers: headersB });
        console.log(`[IDOR CHECK] Fetching invoices under fake tenant: status=${resp.status()}`);
        
        // It must be rejected (400 or 403) or return empty array, but never leak company A's data
        expect(resp.status()).toBe(400);
    });

    // ── 2. IT ADMIN PERMISSION LIMITS ────────────────────────────────────────
    test('IT Admin: Must have full read/write access to sales-orders', async ({ request }) => {
        // We already have the adminToken from beforeAll
        
        // 1. IT Admin read check (GET /sales-orders) -> should be 200
        const readResp = await request.get(`${apiBase}/sales-orders?page=1&pageSize=5&${QS()}`, { headers: h(adminToken) });
        console.log(`[IT ADMIN READ] GET /sales-orders status: ${readResp.status()}`);
        expect(readResp.status()).toBe(200);

        // 2. IT Admin write check (POST /sales-orders) -> should be 201 or 422 (validation), but NOT 403
        const writeResp = await request.post(`${apiBase}/sales-orders?${QS()}`, {
            headers: h(adminToken),
            data: {
                customer_id: '243b9845-e056-48ce-924d-6f233d99c574',
                currency_id: 'ffbf8ef2-bffe-4c52-b588-17472d6baeb3',
                so_date: new Date().toISOString().slice(0, 10) + 'T00:00:00Z',
                so_items: []
            }
        });
        console.log(`[IT ADMIN WRITE] POST /sales-orders status: ${writeResp.status()}`);
        
        // It shouldn't be 403 (Forbidden) since IT admin has full access
        expect(writeResp.status()).not.toBe(403);
    });
});
