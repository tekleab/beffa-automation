import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { DateHelper } from '../../lib/utils/DateHelper';

/**
 * =============================================================================
 * API VALIDATION DEFECTS — TARGETED ASSERTION SUITE  @smoke
 *
 * Source: ERP Backend API Validation Audit (47 scenarios, 60% compliant)
 * This spec asserts every non-compliant finding as a hard test failure.
 * Each test maps 1:1 to a finding in the audit report.
 *
 * Severity legend used in test titles:
 *   [P0-CRITICAL] HTTP 500 crash / raw SQL leak
 *   [P1-FORMAT]   Wrong status code or missing field-level details map
 *   [P1-ROUTE]    Route unmapped (404 plain text)
 * =============================================================================
 */

// ── shared helpers ────────────────────────────────────────────────────────────

/** Assert response is a proper 422 with a structured details map. */
function assert422Structured(status: number, body: any, label: string) {
    expect(status, `[${label}] Must return 422, got ${status}`).toBe(422);
    expect(body, `[${label}] Body must be an object`).toBeTruthy();
    expect(typeof body, `[${label}] Body must be JSON object, not string`).toBe('object');
    expect(body.details, `[${label}] Must have field-level "details" map`).toBeTruthy();
    expect(typeof body.details, `[${label}] "details" must be an object`).toBe('object');
}

/** Assert response is NOT a 500 (no crash). */
function assertNot500(status: number, body: any, label: string) {
    if (status === 500) {
        const raw = typeof body === 'string' ? body : JSON.stringify(body);
        throw new Error(
            `[P0-CRITICAL] ${label}: Server crashed with HTTP 500. ` +
            `Raw response (may contain leaked SQL/stack): ${raw.slice(0, 300)}`
        );
    }
}

/** Assert route returns standard JSON 404 envelope (not plain text) */
function assertGlobal404Json(status: number, body: any, label: string) {
    expect(status, `[${label}] Unmapped route must return HTTP 404`).toBe(404);
    expect(body, `[${label}] Body must be an object, not plain text`).toBeTruthy();
    expect(typeof body, `[${label}] Body must be JSON object`).toBe('object');
    expect(body.code, `[${label}] Response code must be 404`).toBe(404);
    expect(body.message, `[${label}] Message must be 'Route not found'`).toBe('Route not found');
}

test.describe('API Validation Defects — Compliance Assertions @cross-module @smoke', () => {
    test.setTimeout(180000);

    let apiBase: string;
    let headers: Record<string, string>;
    let qs: string;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const ctx = await app.buildApiContext();
        apiBase = ctx.apiBase;
        headers = ctx.headers;
        qs = ctx.qs;
        await page.close();
    });

    async function post(page: import('@playwright/test').Page, endpoint: string, payload: any) {
        const resp = await page.request.post(`${apiBase}${endpoint}?${qs}`, { headers, data: payload });
        const status = resp.status();
        const body = await resp.json().catch(async () => resp.text());
        return { status, body };
    }

    // =========================================================================
    // P0 CRITICAL — HTTP 500 crashes
    // =========================================================================

    test('[P0-CRITICAL] SALES: POST /receipts with null payload must not crash with HTTP 500', async ({ page }) => {
        const { status, body } = await post(page, '/receipts', { customer_id: null, amount: 0, cash_account_id: null });
        assertNot500(status, body, 'POST /receipts null payload');
        expect(status, `Must return 4xx validation error, got ${status}`).toBeGreaterThanOrEqual(400);
        expect(status, `Must return 4xx validation error, got ${status}`).toBeLessThan(500);
    });

    test('[P0-CRITICAL] HR: POST /timesheets with invalid employee_id must not leak raw SQL FK error', async ({ page }) => {
        const resolvedDate = await DateHelper.resolve(page);
        const { status, body } = await post(page, '/timesheets', {
            employee_id: '00000000-0000-0000-0000-000000000000',
            date: resolvedDate.iso,
            hours: -12
        });
        assertNot500(status, body, 'POST /timesheets invalid employee + negative hours');
        const raw = typeof body === 'string' ? body : JSON.stringify(body);
        expect(
            raw,
            `[P0-CRITICAL] Raw PostgreSQL FK error leaked in response: "${raw.slice(0, 200)}"`
        ).not.toMatch(/SQLSTATE|foreign key constraint|fk_employees|violates|ERROR:/i);
        expect(status).toBeGreaterThanOrEqual(400);
        expect(status).toBeLessThan(500);
    });

    // =========================================================================
    // P1 FORMAT — Wrong status code (400 instead of 422)
    // =========================================================================

    test('[P1-FORMAT] SALES: POST /invoices with invalid date must return 422 not 400', async ({ page }) => {
        const { status, body } = await post(page, '/invoices', {
            customer_id: '00000000-0000-0000-0000-000000000000',
            invoice_date: 'invalid-date',
            invoice_items: []
        });
        assertNot500(status, body, 'POST /invoices invalid date');
        expect(
            status,
            `[P1-FORMAT] POST /invoices invalid date returned HTTP ${status} (raw Go parser string). Must return 422 with structured details.`
        ).toBe(422);
    });

    test('[P1-FORMAT] SALES: POST /customers with integer phone must return 422 not 400', async ({ page }) => {
        const { status, body } = await post(page, '/customers', {
            name: 'Type Mismatch Customer',
            phone: 123456789,
            tin: '1234567890'
        });
        assertNot500(status, body, 'POST /customers integer phone');
        expect(
            status,
            `[P1-FORMAT] POST /customers phone type mismatch returned HTTP ${status}. Must return 422 with structured details.`
        ).toBe(422);
    });

    test('[P1-FORMAT] HR: POST /departments with empty payload must return 422 not 400', async ({ page }) => {
        const { status, body } = await post(page, '/departments', {});
        assertNot500(status, body, 'POST /departments empty payload');
        expect(
            status,
            `[P1-FORMAT] POST /departments returned HTTP ${status} with flat string message. Must return 422 with structured details.`
        ).toBe(422);
        assert422Structured(status, body, 'POST /departments empty payload');
    });

    test('[P1-FORMAT] HR: POST /payroll-runs with empty payload must return 422 not 400', async ({ page }) => {
        const { status, body } = await post(page, '/payroll-runs', {});
        assertNot500(status, body, 'POST /payroll-runs empty payload');
        expect(
            status,
            `[P1-FORMAT] POST /payroll-runs returned HTTP ${status} with flat string message. Must return 422 with structured details.`
        ).toBe(422);
        assert422Structured(status, body, 'POST /payroll-runs empty payload');
    });

    // =========================================================================
    // P1 FORMAT — Missing field attribution in details map
    // =========================================================================

    test('[P1-FORMAT] SALES: POST /receipts negative amount must include "amount" field in details', async ({ page }) => {
        const { status, body } = await post(page, '/receipts', {
            customer_id: '00000000-0000-0000-0000-000000000000',
            amount: -2500
        });
        assertNot500(status, body, 'POST /receipts negative amount');
        expect(status).toBeGreaterThanOrEqual(400);
        const raw = JSON.stringify(body).toLowerCase();
        expect(
            raw,
            `[P1-FORMAT] POST /receipts negative amount: "amount" field missing from error details map. Got: ${raw.slice(0, 200)}`
        ).toMatch(/amount/);
    });

    test('[P1-FORMAT] PURCHASE: POST /payments negative amount must include "amount" field in details', async ({ page }) => {
        const { status, body } = await post(page, '/payments', {
            vendor_id: '00000000-0000-0000-0000-000000000000',
            amount: -1000,
            bill_payments: []
        });
        assertNot500(status, body, 'POST /payments negative amount');
        expect(status).toBeGreaterThanOrEqual(400);
        const raw = JSON.stringify(body).toLowerCase();
        expect(
            raw,
            `[P1-FORMAT] POST /payments negative amount: "amount" field missing from error details map. Got: ${raw.slice(0, 200)}`
        ).toMatch(/amount/);
    });

    test('[P1-FORMAT] HR: POST /employees negative salary must include "base_salary" field in details', async ({ page }) => {
        const { status, body } = await post(page, '/employees', {
            first_name: 'Negative',
            last_name: 'Salary',
            email: 'valid.email@example.com',
            base_salary: -5000
        });
        assertNot500(status, body, 'POST /employees negative salary');
        expect(status).toBeGreaterThanOrEqual(400);
        const raw = JSON.stringify(body).toLowerCase();
        expect(
            raw,
            `[P1-FORMAT] POST /employees negative salary: "base_salary" field missing from error details map. Got: ${raw.slice(0, 200)}`
        ).toMatch(/salary|base_salary/);
    });

    test('[P1-FORMAT] PROJECT: POST /projects negative budget must include "budget" field in details', async ({ page }) => {
        const resolvedDate = await DateHelper.resolve(page);
        const { status, body } = await post(page, '/projects', {
            name: 'Negative Budget Project',
            budget: -100000,
            start_date: resolvedDate.iso
        });
        assertNot500(status, body, 'POST /projects negative budget');
        expect(status).toBeGreaterThanOrEqual(400);
        const raw = JSON.stringify(body).toLowerCase();
        expect(
            raw,
            `[P1-FORMAT] POST /projects negative budget: "budget" field missing from error details map. Got: ${raw.slice(0, 200)}`
        ).toMatch(/budget/);
    });

    test('[P1-FORMAT] PROJECT: POST /tasks missing project_id must include "project" field in details', async ({ page }) => {
        const { status, body } = await post(page, '/tasks', {
            title: 'Orphan Task Without Project',
            estimated_hours: 8
        });
        assertNot500(status, body, 'POST /tasks missing project_id');
        expect(status).toBeGreaterThanOrEqual(400);
        const raw = JSON.stringify(body).toLowerCase();
        expect(
            raw,
            `[P1-FORMAT] POST /tasks missing project_id: "project" field missing from error details map. Got: ${raw.slice(0, 200)}`
        ).toMatch(/project/);
    });

    // =========================================================================
    // P1 ROUTE — Standard JSON 404 Contract on Unmapped Endpoints
    // (Acknowledged by backend dev Segni: Routes not yet implemented;
    // must return structured JSON envelope {"code": 404, "message": "Route not found"})
    // =========================================================================

    test('[P1-ROUTE] INVENTORY: POST /inventory-transfers returns standard JSON 404', async ({ page }) => {
        const { status, body } = await post(page, '/inventory-transfers', {});
        assertGlobal404Json(status, body, 'POST /inventory-transfers');
    });

    test('[P1-ROUTE] PROJECT: POST /milestones returns standard JSON 404', async ({ page }) => {
        const { status, body } = await post(page, '/milestones', {});
        assertGlobal404Json(status, body, 'POST /milestones');
    });

    test('[P1-ROUTE] FIXED ASSETS: POST /assets returns standard JSON 404', async ({ page }) => {
        const { status, body } = await post(page, '/assets', {});
        assertGlobal404Json(status, body, 'POST /assets');
    });

    test('[P1-ROUTE] FIXED ASSETS: POST /asset-categories returns standard JSON 404', async ({ page }) => {
        const { status, body } = await post(page, '/asset-categories', {});
        assertGlobal404Json(status, body, 'POST /asset-categories');
    });

    test('[P1-ROUTE] ACCOUNTING: POST /general-journal-entries returns standard JSON 404', async ({ page }) => {
        const { status, body } = await post(page, '/general-journal-entries', {});
        assertGlobal404Json(status, body, 'POST /general-journal-entries');
    });
});
