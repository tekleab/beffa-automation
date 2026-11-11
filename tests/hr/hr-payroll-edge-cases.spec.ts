import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { DateHelper } from '../../lib/utils/DateHelper';
import { DevReporter } from '../../lib/utils/DevReporter';

/**
 * =============================================================================
 * MODULE: HR & Payroll Edge Cases — Negative Salary, Over-Deductions & Leave
 * 
 * Invariants & Guardrails:
 * 1. Base Salary & Deductions Bounds: Negative salary or over-deductions
 *    exceeding gross pay must be rejected with 422.
 * 2. Overlapping Leave Guardrail: An employee cannot have concurrent active
 *    leave requests approved for the same calendar date range.
 * 3. Inactive Employee Payroll Integrity: Terminated employees cannot be
 *    billed or processed for full recurring monthly salary.
 * =============================================================================
 */

test.describe('HR & Payroll Critical Guardrails @hr @regression', () => {
    test.setTimeout(180000);

    test('Guardrail: Creating employee with negative base salary must be rejected with 422', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const token = await app._getAuthToken();
        const qs = DateHelper.qs();
        const company = process.env.BEFFA_COMPANY || 'ABC Trading';
        const headers = {
            'x-company': company,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const negativeSalaryPayload = {
            first_name: 'Audit',
            last_name: 'NegativeSalary',
            email: `audit.neg.${Date.now()}@example.com`,
            phone: '0911000000',
            base_salary: -15000, // ILLEGAL NEGATIVE SALARY
            employment_type: 'Full-Time',
            status: 'Active'
        };

        const empUrl = `${app.apiBase}/employees?${qs}`;
        const startTime = Date.now();
        const resp = await page.request.post(empUrl, {
            headers,
            data: negativeSalaryPayload
        });
        const duration = Date.now() - startTime;
        const body = await resp.json().catch(() => ({}));

        DevReporter.record({
            testName: 'Negative Base Salary Validation (-15,000 ETB)',
            action: 'POST /employees with negative base_salary',
            method: 'POST',
            url: empUrl,
            company,
            token,
            payload: negativeSalaryPayload,
            status: resp.status(),
            responseBody: body,
            durationMs: duration,
            verdict: resp.status() >= 400 && resp.status() < 500
                ? 'PASSED GUARDRAIL: Negative salary correctly rejected with 422/400'
                : resp.status() >= 500
                    ? 'BACKEND BUG: Server crashed with 500 on negative numeric input'
                    : 'CRITICAL BUSINESS BUG: Negative salary accepted and saved'
        });

        // Invariant: Negative salary must fail validation (400 or 422) and NEVER return 200/201 or 500
        expect(
            resp.status(),
            `Negative salary must be rejected (Expected 422/400, got ${resp.status()})`
        ).toBeGreaterThanOrEqual(400);
        expect(resp.status(), 'Must not crash with 500').toBeLessThan(500);
    });

    test('Guardrail: Overlapping leave requests for the same employee and date range must be rejected', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const token = await app._getAuthToken();
        const qs = DateHelper.qs();
        const resolvedDate = await DateHelper.resolve(page);
        const company = process.env.BEFFA_COMPANY || 'ABC Trading';
        const headers = {
            'x-company': company,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Fetch an active employee
        const empResp = await page.request.get(`${app.apiBase}/employees?page=1&pageSize=1&${qs}`, { headers });
        const empData = await empResp.json().catch(() => ({}));
        const empList = empData.data || empData.items || [];
        if (empList.length === 0) {
            console.log('[SKIP] No active employee available for leave collision test');
            return;
        }

        const employeeId = empList[0].id;
        const startDate = resolvedDate.iso;
        const endDate = resolvedDate.iso;

        // 1. Submit initial Leave Request
        const leavePayload1 = {
            employee_id: employeeId,
            start_date: startDate,
            end_date: endDate,
            leave_type: 'Annual',
            reason: 'Primary Annual Leave Booking'
        };

        const leaveUrl = `${app.apiBase}/leave-requests?${qs}`;
        const leaveResp1 = await page.request.post(leaveUrl, {
            headers,
            data: leavePayload1
        });

        // 2. Submit conflicting second Leave Request for same dates
        const leavePayload2 = {
            employee_id: employeeId,
            start_date: startDate,
            end_date: endDate,
            leave_type: 'Sick',
            reason: 'Conflicting Overlapping Leave Booking'
        };

        const startTime = Date.now();
        const leaveResp2 = await page.request.post(leaveUrl, {
            headers,
            data: leavePayload2
        });
        const duration = Date.now() - startTime;
        const body2 = await leaveResp2.json().catch(() => ({}));

        DevReporter.record({
            testName: 'Concurrent Overlapping Leave Booking Collision',
            action: `Submit second leave booking for employee ${employeeId} on identical dates (${startDate})`,
            method: 'POST',
            url: leaveUrl,
            company,
            token,
            payload: leavePayload2,
            status: leaveResp2.status(),
            responseBody: body2,
            durationMs: duration,
            verdict: leaveResp2.status() >= 400
                ? 'PASSED GUARDRAIL: Overlapping leave request blocked with conflict error'
                : 'INTEGRITY DEFECT: System accepted double-booked leave for same calendar dates'
        });

        if (leaveResp1.ok()) {
            expect(
                leaveResp2.status() >= 400 || !leaveResp2.ok(),
                'Concurrent overlapping leave booking for same dates must be blocked'
            ).toBe(true);
        }
    });

    test('Audit: Empty or malformed payroll run payload must be validated without SQL leaks', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const token = await app._getAuthToken();
        const qs = DateHelper.qs();
        const company = process.env.BEFFA_COMPANY || 'ABC Trading';
        const headers = {
            'x-company': company,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const malformedPayload = {
            payroll_date: 'invalid-date-format',
            department_id: '00000000-0000-0000-0000-000000000000',
            entries: []
        };

        const payrollUrl = `${app.apiBase}/payroll-runs?${qs}`;
        const startTime = Date.now();
        const resp = await page.request.post(payrollUrl, {
            headers,
            data: malformedPayload
        });
        const duration = Date.now() - startTime;
        const text = await resp.text();

        DevReporter.record({
            testName: 'Malformed Payroll Run SQL Leak Defense',
            action: 'Submit invalid date and dummy UUID to /payroll-runs',
            method: 'POST',
            url: payrollUrl,
            company,
            token,
            payload: malformedPayload,
            status: resp.status(),
            responseBody: text,
            durationMs: duration,
            verdict: text.match(/syntax error|pq:|sql:|postgres/i)
                ? 'CRITICAL DEFECT: Backend leaked raw SQL driver error / stack trace'
                : 'PASSED: Clean JSON validation error returned without database leaks'
        });

        expect(resp.status(), 'Malformed payroll run must return 400/422').toBeGreaterThanOrEqual(400);
        expect(text, 'Must not leak raw SQL syntax errors').not.toMatch(/syntax error|pq:|sql:/i);
    });
});
