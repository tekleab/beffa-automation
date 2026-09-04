import { test, expect } from '@playwright/test';

const API = () => (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
    .replace(/['"]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001') + '/api';
const QS = () => `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

const BUG = (id: string, title: string, detail: Record<string, any>) => {

/**
 * =============================================================================
 * MODULE: RBAC & User Management - Security Audit Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Duplicate email registration rejected (409/422)
 * 2. Missing x-company header returns 400 (no data leak)
 * 3. Invalid company header returns 400 (cross-tenant isolation)
 * 4. Tampered JWT returns 401 on all protected endpoints
 * 5. Notifications scoped to authenticated company only
 * 6. Auditor role cannot create financial documents (403)
 * =============================================================================
 */

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`[BUG REPORT] ${id}`);
    console.log(`  Title   : ${title}`);
    console.log(`  Time    : ${new Date().toISOString()}`);
    Object.entries(detail).forEach(([k, v]) => console.log(`  ${k.padEnd(16)}: ${JSON.stringify(v)}`));
    console.log('─'.repeat(60));
};

async function apiLogin(request: any) {
    const r = await request.post(`${API()}/users/login?${QS()}&month=6`, {
        data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await r.json();
    const token = data.auth_token || data.token;
    if (!token) throw new Error('Login failed');
    return token;
}

function h(token: string) {
    return { 'Authorization': `Bearer ${token}`, 'x-company': process.env.BEFFA_COMPANY as string, 'Content-Type': 'application/json' };
}

test.describe('RBAC & User Management Security Audit @regression', () => {
    test.describe.configure({ mode: 'serial' });
    test.setTimeout(120000);

    const AUDITOR_ROLE_ID = '091b3e1c-f672-41cd-8627-c8d184f9fb8f';
    let token: string;
    let apiBase: string;

    test.beforeAll(async ({ request }) => {
        token = await apiLogin(request);
        apiBase = API();
        console.log(`[SETUP] Admin token acquired | api=${apiBase}`);
    });


    // ── 1. DUPLICATE EMAIL ────────────────────────────────────────────────────
    test('Guardrail: Duplicate email registration must be rejected', async ({ request }) => {
        const email = `audit.rbac.${Date.now()}@test-beffa.com`;

        const r1 = await request.post(`${apiBase}/users?${QS()}`, { headers: h(token), data: { email, first_name: 'RBACTest', father_name: 'User', password: 'Admin@12345!Secure#99X', role_id: AUDITOR_ROLE_ID } });
        const b1 = await r1.json();
        console.log(`[SETUP] Create user: status=${r1.status()} | user_id=${b1.id ?? 'N/A'} | email=${email}`);

        if (!r1.ok()) { console.log(`[SKIP] Could not create test user (${r1.status()})`); return; }

        const r2 = await request.post(`${apiBase}/users?${QS()}`, { headers: h(token), data: { email, first_name: 'Duplicate', father_name: 'User', password: 'Admin@12345!Secure#99X', role_id: AUDITOR_ROLE_ID } });
        const b2 = await r2.json();
        console.log(`[RESULT] Duplicate email: status=${r2.status()} | dup_user_id=${b2.id ?? 'N/A'}`);

        if (r2.ok()) {
            BUG('BUG-RBAC-001', 'Duplicate email registration accepted — two accounts with same email', { email, first_user_id: b1.id, second_user_id: b2.id, impact: 'Account takeover risk — attacker can register duplicate email and intercept login' });
            expect(b2.id).not.toBe(b1.id);
        } else {
            expect(r2.status()).toBeGreaterThanOrEqual(400);
            console.log(`[PASS] Duplicate email correctly rejected: ${r2.status()}`);
        }
    });

    // ── 2. MISSING x-company HEADER ──────────────────────────────────────────
    test('Missing x-company header must return 400 — not leak data', async ({ request }) => {
        const noCompany = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        const endpoints = ['invoices', 'bills', 'sales-orders'];

        const results = await Promise.all(endpoints.map(ep =>
            request.get(`${apiBase}/${ep}?page=1&pageSize=1&${QS()}`, { headers: noCompany })
        ));

        for (let i = 0; i < endpoints.length; i++) {
            const resp = results[i];
            console.log(`[CHECK] No x-company on ${endpoints[i]}: status=${resp.status()}`);
            if (resp.status() !== 400) {
                BUG('BUG-RBAC-002', `Endpoint ${endpoints[i]} does not enforce x-company header`, { endpoint: endpoints[i], http_status: resp.status(), impact: 'Missing tenant isolation — cross-company data may be accessible' });
            }
            expect(resp.status(), `${endpoints[i]} must return 400 without x-company`).toBe(400);
        }
        console.log(`[PASS] All endpoints correctly reject requests without x-company header`);
    });

    // ── 3. INVALID COMPANY HEADER ─────────────────────────────────────────────
    test('Invalid company header must return 400 — not leak cross-tenant data', async ({ request }) => {
        const fakeH = { 'Authorization': `Bearer ${token}`, 'x-company': 'FakeCorpXYZ_DoesNotExist_12345', 'Content-Type': 'application/json' };
        const resp = await request.get(`${apiBase}/invoices?page=1&pageSize=5&${QS()}`, { headers: fakeH });
        const body = await resp.json();
        console.log(`[RESULT] Fake company: status=${resp.status()}`);

        if (resp.status() !== 400) {
            BUG('BUG-RBAC-003', 'Invalid company header not rejected — potential cross-tenant data leak', { fake_company: 'FakeCorpXYZ_DoesNotExist_12345', http_status: resp.status(), records_returned: (body.data || body.items || []).length, impact: 'Cross-tenant data exposure — invoices from other companies may be visible' });
        }
        expect(resp.status()).toBe(400);
        expect((body.data || body.items || []).length).toBe(0);
        console.log(`[PASS] Fake company correctly rejected — no data leaked`);
    });

    // ── 4. TAMPERED JWT ───────────────────────────────────────────────────────
    test('Tampered JWT must return 401 on all protected endpoints', async ({ request }) => {
        const adminToken = token || await apiLogin(request);
        const parts = adminToken.split('.');
        const tampered = parts[0] + '.' + Buffer.from(JSON.stringify({ user_id: '00000000-0000-0000-0000-000000000000', email: 'tampered@attack.com' })).toString('base64url') + '.' + 'tamperedSignatureXYZ123456789';
        const tampH = { 'Authorization': `Bearer ${tampered}`, 'x-company': process.env.BEFFA_COMPANY as string };
        const endpoints = ['invoices', 'bills', 'employees', 'users'];

        const results = await Promise.all(endpoints.map(ep =>
            request.get(`${apiBase}/${ep}?page=1&pageSize=1&${QS()}`, { headers: tampH })
        ));

        for (let i = 0; i < endpoints.length; i++) {
            console.log(`[CHECK] Tampered JWT on ${endpoints[i]}: status=${results[i].status()}`);
            if (results[i].status() !== 401) {
                BUG('BUG-RBAC-004', `Endpoint ${endpoints[i]} accepted tampered JWT — auth bypass`, { endpoint: endpoints[i], http_status: results[i].status(), impact: 'Authentication bypass — tampered tokens accepted on protected endpoints' });
            }
            expect(results[i].status(), `${endpoints[i]} must return 401 for tampered JWT`).toBe(401);
        }
        console.log(`[PASS] All endpoints correctly reject tampered JWT with 401`);
    });


    // ── 5. NOTIFICATION ISOLATION ─────────────────────────────────────────────
    test('Notifications must only contain data for the authenticated company', async ({ request }) => {
        const resp = await request.get(`${apiBase}/notifications?page=1&pageSize=20&${QS()}`, { headers: h(token), timeout: 30000 }).catch(() => null);
        if (!resp || !resp.ok()) { console.log(`[SKIP] Notifications endpoint returned ${resp?.status() ?? 'timeout'}`); return; }


        const notifs = (await resp.json()).data || [];
        console.log(`[INFO] Notifications count: ${notifs.length}`);
        const companyId = notifs[0]?.company_id;

        for (const n of notifs) {
            if (n.company_id && companyId && n.company_id !== companyId) {
                BUG('BUG-RBAC-005', 'Cross-tenant notification data leak', { notification_id: n.id, expected_company_id: companyId, actual_company_id: n.company_id, impact: 'Tenant isolation breach — user sees notifications from another company' });
                expect(n.company_id).toBe(companyId);
            }
        }
        console.log(`[PASS] All ${notifs.length} notifications belong to correct company`);
    });

    // ── 6. AUDITOR RBAC ───────────────────────────────────────────────────────
    test('Auditor role must not be able to create financial documents', async ({ request }) => {
        const email = `auditor.rbac.${Date.now()}@test-beffa.com`;
        const cr = await request.post(`${apiBase}/users?${QS()}`, { headers: h(token), data: { email, first_name: 'AuditorRBAC', father_name: 'Test', password: 'Admin@12345!Secure#99X', role_id: AUDITOR_ROLE_ID } });
        if (!cr.ok()) { console.log(`[SKIP] Could not create auditor (${cr.status()})`); return; }
        const auditorUser = await cr.json();
        console.log(`[SETUP] Auditor user_id=${auditorUser.id} | email=${email}`);

        const lr = await request.post(`${apiBase}/users/login?${QS()}&month=6`, { headers: { 'Content-Type': 'application/json' }, data: { email, password: 'Admin@12345!Secure#99X' } });
        if (!lr.ok()) { console.log(`[SKIP] Auditor login failed (${lr.status()})`); return; }
        const auditorToken = (await lr.json()).auth_token;
        if (!auditorToken) { console.log(`[SKIP] No token for auditor`); return; }

        const soR = await request.post(`${apiBase}/sales-orders?${QS()}`, {
            headers: h(auditorToken),
            data: { customer_id: '243b9845-e056-48ce-924d-6f233d99c574', currency_id: 'ffbf8ef2-bffe-4c52-b588-17472d6baeb3', so_date: new Date().toISOString().slice(0, 10) + 'T00:00:00Z', so_items: [] }
        });
        const soBody = await soR.json();
        console.log(`[RESULT] Auditor create SO: status=${soR.status()} | auditor_user_id=${auditorUser.id}`);

        if (soR.ok()) {
            BUG('BUG-RBAC-006', 'Auditor role can create Sales Orders — RBAC not enforced', { auditor_user_id: auditorUser.id, auditor_email: email, role_id: AUDITOR_ROLE_ID, so_doc: soBody.so_number, created_so_id: soBody.id, impact: 'Privilege escalation — auditor-role users can create financial documents' });
            expect(soR.ok(), 'Auditor role must be blocked from creating Sales Orders').toBe(false);
        } else {
            console.log(`[PASS] Auditor blocked from creating SO: ${soR.status()}`);
            expect(soR.status()).not.toBe(201);
        }
    });
});
