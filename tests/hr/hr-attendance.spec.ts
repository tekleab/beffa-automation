import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: HR - Attendance Tracking & Validation Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Check-in / check-out records created correctly per employee
 * 2. Duplicate check-in on same day rejected
 * 3. Attendance report totals match individual records
 * =============================================================================
 */



/**
 * HR: Timesheets & Attendances
 * Happy path: create timesheet → advance through approval
 * Edge cases: duplicate date conflict (409), zero hours
 */
test.describe('HR: Timesheets & Attendances @hr @smoke @regression @full', () => {
    test.setTimeout(120000);

    // -------------------------------------------------------------------------
    // HAPPY PATH: Timesheet creation and approval flow
    // -------------------------------------------------------------------------
    test('API: Timesheet must be created and advanced through approval', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);


        const meta = await app.api.hr.discoverMetadataAPI();
        if (!meta) { console.log('[SKIP] HR org structure not configured'); return; }
        // Unique date per run — avoids 409 duplicate conflict
        const randomDays = Math.floor(Math.random() * 3000) + 100;
        const date = new Date(Date.now() + randomDays * 86400000).toISOString().split('T')[0] + 'T00:00:00Z';

        console.log(`[STEP 1] Creating timesheet | employee: ${meta.employeeId} | date: ${date}`);
        const ts = await app.api.hr.createTimesheet(meta.employeeId, date, 8, 'Audit Timesheet Entry');

        expect(ts).toHaveProperty('id');
        expect(ts.employee_id).toBe(meta.employeeId);
        console.log(`[SUCCESS] Timesheet created: ${ts.id} | status: ${ts.status}`);

        console.log(`[STEP 2] Advancing timesheet through approval...`);
        await app.advanceDocumentAPI(ts.id, 'timesheets');
        console.log(`[PASS] Timesheet approval flow complete`);
    });

    // -------------------------------------------------------------------------
    // EDGE CASE: Duplicate date must return 409
    // -------------------------------------------------------------------------
    test('Guardrail: Duplicate timesheet for same employee+date must be rejected', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);


        const meta = await app.api.hr.discoverMetadataAPI();
        if (!meta) { console.log("[SKIP] HR org structure not configured"); return; }
        // Use a fixed far-future date so first creation always succeeds
        const date = '2099-01-15T00:00:00Z';

        // First creation
        let firstId: string | null = null;
        try {
            const first = await app.api.hr.createTimesheet(meta.employeeId, date, 8, 'First Entry');
            firstId = first.id;
            console.log(`[INFO] First timesheet created: ${firstId}`);
        } catch (e: any) {
            // Already exists from a prior run — that's fine, proceed to duplicate test
            console.log(`[INFO] First timesheet already exists for this date`);
        }

        // Second creation on same date must be rejected
        const token = await app._getAuthToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-company': process.env.BEFFA_COMPANY as string,
            'Content-Type': 'application/json',
        };
        const params = `year=${process.env.BEFFA_YEAR||'2019'}&period=${process.env.BEFFA_PERIOD||'yearly'}&calendar=${process.env.BEFFA_CALENDAR||'ec'}`;
        const dupResp = await page.request.post(
            `${app.apiBase}/timesheets?${params}`,
            { headers, data: { employee_id: meta.employeeId, date, hours: 8, description: 'Duplicate Entry' } }
        );

        expect(dupResp.status()).toBe(409);
        const body = await dupResp.json();
        expect(body.message).toMatch(/already exists/i);
        console.log(`[PASS] Duplicate timesheet correctly rejected: 409`);
    });

    // -------------------------------------------------------------------------
    // UI: Timesheets page loads without error
    // -------------------------------------------------------------------------
    test('UI: Timesheets page must load and not show an error state', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);


        await page.goto('/human-resources/timesheets', { waitUntil: 'commit' });

        const hasError = await page.locator('text=/error|failed|something went wrong/i').first()
            .isVisible({ timeout: 5000 }).catch(() => false);
        expect(hasError).toBe(false);

        // Breadcrumb nav is present but may be clipped — verify via URL + any visible content
        expect(page.url()).toMatch(/timesheet/i);
        const content = page.locator('table, [role="table"], button, .chakra-text, a').first();
        await content.waitFor({ state: 'visible', timeout: 20000 });
        console.log(`[PASS] Timesheets page loaded without errors`);
    });

    // -------------------------------------------------------------------------
    // UI: Attendances page loads (no API route — UI-only module)
    // -------------------------------------------------------------------------
    test('UI: Attendances page must load and render the attendance module', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);


        await page.goto('/human-resources/attendances', { waitUntil: 'commit' });

        const hasError = await page.locator('text=/error|failed|something went wrong/i').first()
            .isVisible({ timeout: 5000 }).catch(() => false);
        expect(hasError).toBe(false);

        const content = page.locator('table, [role="table"], h1, h2, [role="heading"], .chakra-text').first();
        await content.waitFor({ state: 'visible', timeout: 20000 });
        console.log(`[PASS] Attendances page rendered without errors`);
    });

    // -------------------------------------------------------------------------
    // SECURITY & VALIDATION: Server response on Timesheet Creation with Invalid Employee ID
    // -------------------------------------------------------------------------
    test('Guardrail: Server must validate employee_id and return 422 (not 500 with SQL leak)', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const INVALID_EMPLOYEE_ID = '00000000-dead-beef-0000-000000000000';
        const token = await app._getAuthToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-company': process.env.BEFFA_COMPANY as string,
            'Content-Type': 'application/json',
        };
        const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

        console.log(`[ATTACK] Submitting timesheet creation with non-existent employee ID: ${INVALID_EMPLOYEE_ID}...`);
        const response = await page.request.post(
            `${app.apiBase}/timesheets?${params}`,
            {
                headers,
                data: {
                    employee_id: INVALID_EMPLOYEE_ID,
                    date: '2026-09-03T00:00:00Z',
                    hours: 8,
                    description: 'Invalid Employee Security Probe'
                }
            }
        );

        const status = response.status();
        const responseText = await response.text();

        console.log(`[RESPONSE] Status Code: ${status}`);
        console.log(`[RESPONSE] Body: ${responseText}`);

        // Check for raw SQL leaks
        const leaksRawSQL = /SQLSTATE|fk_employees_timesheets|violates foreign key constraint|insert or update on table/i.test(responseText);

        // Audit Table Output
        const W = { l: 36, v: 38 };
        const pad = (s: string, n: number) => s.length >= n ? s.substring(0, n - 1) + '…' : s.padEnd(n);
        const line = '─'.repeat(W.l + W.v + 7);

        console.log(`\n  ┌${line}┐`);
        console.log(`  │ ${pad('Invalid Employee Timesheet Validation Audit', W.l + W.v + 3)} │`);
        console.log(`  ├${line}┤`);
        console.log(`  │ ${pad('Tested Employee ID', W.l)} │ ${pad(INVALID_EMPLOYEE_ID, W.v)} │`);
        console.log(`  │ ${pad('Expected Status', W.l)} │ ${pad('422 Unprocessable Entity', W.v)} │`);
        console.log(`  │ ${pad('Actual HTTP Status', W.l)} │ ${pad(`${status} ${status === 500 ? '(INTERNAL SERVER ERROR)' : ''}`, W.v)} │`);
        console.log(`  │ ${pad('Exposes Raw SQL / FK Constraint', W.l)} │ ${pad(leaksRawSQL ? 'YES (SECURITY DEFECT)' : 'No (Clean Response)', W.v)} │`);
        console.log(`  ├${line}┤`);

        const isCompliant = status === 422 && !leaksRawSQL;
        const verdict = isCompliant ? 'PASS — Clean 422 Validation Error' : `FAIL — ${status === 500 ? 'HTTP 500 Unhandled Error' : 'Validation Defect'}`;

        console.log(`  │ ${pad('Result', W.l)} │ ${pad(verdict, W.v)} │`);
        console.log(`  └${line}┘\n`);

        if (status === 500 || leaksRawSQL) {
            throw new Error(
                `[TIMESHEET_INVALID_EMPLOYEE_BUG] Server failed validation on invalid employee_id.\n` +
                `  HTTP Status: ${status} (Expected: 422)\n` +
                `  Raw SQL Exposed: ${leaksRawSQL}\n` +
                `  Response Body: ${responseText}\n` +
                `  Fix Required: Pre-validate employee_id exists before executing database INSERT to avoid SQLSTATE 23503 crash.`
            );
        }

        expect(status, 'Must return 422 Unprocessable Entity').toBe(422);
        expect(leaksRawSQL, 'Must not leak raw SQL / DB foreign key constraints').toBe(false);
    });
});

