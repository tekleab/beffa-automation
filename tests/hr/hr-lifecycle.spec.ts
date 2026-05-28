import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * HR Full Lifecycle: Employee (API) → Contract (API) → Approve (UI) → Payroll Run (API) → Approved
 *
 * Key findings from live API probe:
 * - Contract advance via API: E1481 always — UI approval only
 * - Payroll run advance: payload { submitted_to } returns HTTP 200 with null body — must GET run after each advance
 * - Payroll flow: Draft → Review → Approval → Approved (4 steps)
 * - GET /employee/:id → 404; use /employees/:id (plural)
 */
test.describe('HR: Full Employee-to-Payroll Lifecycle @hr @smoke @regression @full', () => {
    test.setTimeout(300000);

    test('Full lifecycle: Employee creation through payroll run approval', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const ts = Date.now();
        const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
        const adminId = process.env.BEFFA_ADMIN_ID || '14bb1e8c-496f-4556-99e0-830681fcf3de';

        const getHeaders = async () => ({
            'Authorization': `Bearer ${await app._getAuthToken()}`,
            'x-company': process.env.BEFFA_COMPANY as string,
            'Content-Type': 'application/json',
        });

        // ── STEP 1: Create Employee via API ───────────────────────────────────
        console.log(`[STEP 1] Creating employee via API...`);
        const emp = await app.api.hr.createEmployee({
            name: `Lifecycle-Emp-${ts}`,
            email: `lc${ts}@beffa.com`,
            phone: `09${String(ts).slice(-8)}`,
            gender: 'female',
            father_name: 'LifecycleFather',
            grand_father_name: 'LifecycleGrand',
            bank_account_number: String(ts).slice(-13),
            bank_name: 'Commercial Bank of Ethiopia',
            address: { region: 'Addis Ababa City Administration', zone: 'Bole Subcity', woreda: 'Woreda 2', kebele: '01' },
            emergency_contacts: [{ name: 'Emergency Contact', phone: '0922000001', relation: 'Spouse' }],
        });
        expect(emp).toHaveProperty('id');
        const empId = emp.id;
        console.log(`[PASS] Employee: ${emp.ref} | id: ${empId}`);

        // ── STEP 2: Create Pay Component via API ──────────────────────────────
        console.log(`[STEP 2] Creating pay component...`);
        const meta = await app.api.hr.discoverMetadataAPI();
        
        // Dynamically find specific department (BM Technologies Group)
        const deptResp = await page.request.get(`${app.apiBase}/departments?page=1&pageSize=50&${params}`, { headers: await getHeaders() });
        const depts = (await deptResp.json()).data || await deptResp.json();
        const targetDept = depts.find((d: any) => d.name?.toLowerCase().includes('bm technologies group')) || depts[0];
        
        if (targetDept) {
            meta.departmentId = targetDept.id;
            meta.departmentName = targetDept.name;
            
            // Safe, paginated lookup for job positions inside that specific department!
            const job = await app.api.hr.ensureJobPosition(targetDept.id, 'QA specialist');
            if (job) {
                meta.jobPositionId = job.id;
                meta.jobPositionTitle = job.title;
            }
        }

        console.log(`[INFO] Using dept: ${meta.departmentName} (${meta.departmentId}) | job: ${meta.jobPositionTitle} (${meta.jobPositionId})`);
        const pc = await app.api.hr.createPayComponent(
            `Salary-${ts}`, 'Earning', 'FullyTaxable', `SL${String(ts).slice(-6)}`, meta.glAccountId
        );
        expect(pc).toHaveProperty('id');
        console.log(`[PASS] Pay component: ${pc.id}`);

        // ── STEP 3: Create Pay Structure + Add Component via API ──────────────
        console.log(`[STEP 3] Creating pay structure...`);
        const ps = await app.api.hr.createPayStructure(`PS-Lifecycle-${ts}`);
        expect(ps).toHaveProperty('id');
        const psId = ps.id;

        const patchResp = await page.request.patch(`${app.apiBase}/pay-structures/${psId}?${params}`, {
            headers: await getHeaders(),
            data: {
                components: [{
                    pay_component_id: pc.id,
                    amount: 10000,
                    is_fixed: true,
                    exemption_cap_type: 'FixedCap',
                    fixed_exemption_cap: 0,
                    percentage_exemption_cap: 0,
                }]
            }
        });
        expect(patchResp.ok()).toBe(true);
        const psDetail = await patchResp.json();
        expect(psDetail.components.length).toBeGreaterThan(0);
        console.log(`[PASS] Pay structure: ${psId} | components: ${psDetail.components.length}`);

        // ── STEP 4: Assign Pay Structure to Employee via API ──────────────────
        console.log(`[STEP 4] Assigning pay structure...`);
        const assignPsResp = await page.request.post(`${app.apiBase}/pay-structures/assign?${params}`, {
            headers: await getHeaders(),
            data: { pay_structure_id: psId, employee_ids: [empId] }
        });
        expect(assignPsResp.ok()).toBe(true);
        expect((await assignPsResp.json()).message).toMatch(/success/i);
        console.log(`[PASS] Pay structure assigned`);

        // ── STEP 5: Create Contract via API ───────────────────────────────────
        console.log(`[STEP 5] Creating contract via API...`);
        const today = new Date().toISOString().split('T')[0] + 'T00:00:00Z';
        const contractResp = await page.request.post(`${app.apiBase}/employee-contracts?${params}`, {
            headers: await getHeaders(),
            data: {
                employee_id: empId,
                contract_type: 'permanent',
                pay_frequency: 'monthly',
                pay_method: 'salary',
                salary: 10000,
                department_id: meta.departmentId,
                job_position_id: meta.jobPositionId,
                start_date: today,
            }
        });
        expect(contractResp.ok()).toBe(true);
        const contract = await contractResp.json();
        const contractId = contract.id;
        const contractDeptId = contract.department_id || contract.department?.id || 'MISSING';
        console.log(`[PASS] Contract created: ${contractId}`);
        console.log(`[INFO] department_id: ${contractDeptId} | job_position_id: ${meta.jobPositionId}`);
        console.log(`[INFO] status: ${contract.status} | contract_status: ${contract.contract_status}`);
        expect(contractDeptId).not.toBe('MISSING');

        // ── STEP 6: Approve Contract via API ──────────────────────────────────
        // Now that employee has pay structure assigned BEFORE contract creation,
        // the API advance should work without E1481
        console.log(`[STEP 6] Approving contract via API...`);
        const advResp = await page.request.patch(
            `${app.apiBase}/employee-contracts/${contractId}/advance?${params}`,
            { headers: await getHeaders(), data: {} }
        );
        expect(advResp.ok()).toBe(true);
        const advBody = await advResp.json();
        expect(advBody.status?.toLowerCase()).toBe('approved');
        console.log(`[PASS] Contract approved via API`);

        // Confirm via API
        const contractFinal = await page.request.get(`${app.apiBase}/employee/${empId}/contracts?${params}`, { headers: await getHeaders() });
        const contracts = await contractFinal.json();
        const c = (contracts as any[]).find((x: any) => x.id === contractId);
        expect(c?.status?.toLowerCase()).toBe('approved');
        console.log(`[PASS] Contract status confirmed: ${c?.status}`);

        // ── STEP 7: Verify Employee is Active ────────────────────────────────
        console.log(`[STEP 7] Verifying employee is active...`);
        let empStatus = 'inactive';
        for (let i = 0; i < 10; i++) {
            const r = await page.request.get(`${app.apiBase}/employees/${empId}?${params}`, { headers: await getHeaders() });
            empStatus = (await r.json()).status?.toLowerCase();
            if (empStatus === 'active') break;
            await page.waitForTimeout(2000);
        }
        expect(empStatus).toBe('active');
        console.log(`[PASS] Employee is active`);

        // ── STEP 8: Create Payroll Run ────────────────────────────────────
        console.log(`[STEP 8] Creating payroll run...`);
        const run = await app.api.hr.createPayrollRun(
            `Lifecycle-Run-${ts}`,
            '2026-05-01T00:00:00Z',
            '2026-05-31T00:00:00Z',
            '2026-05-31T00:00:00Z'
        );
        expect(run).toHaveProperty('id');
        const runId = run.id;
        console.log(`[PASS] Payroll run: ${runId} | status: ${run.status}`);

        // ── STEP 9: Assign Employee to Payroll Run via API ────────────────────
        console.log(`[STEP 9] Assigning employee to payroll run...`);
        const assignRunResp = await page.request.post(
            `${app.apiBase}/payroll-runs/${runId}/assign?${params}`,
            { headers: await getHeaders(), data: { employee_ids: [empId], action: 'assign' } }
        );
        expect(assignRunResp.ok()).toBe(true);
        expect((await assignRunResp.json()).message).toMatch(/success/i);

        const empListResp = await page.request.get(
            `${app.apiBase}/payroll-runs/${runId}/employees?${params}`, { headers: await getHeaders() }
        );
        expect(Number((await empListResp.json()).pagination?.total)).toBeGreaterThan(0);
        console.log(`[PASS] Employee assigned to payroll run`);

        // ── STEP 10: Advance Payroll Run to Approved via API ──────────────────
        // Flow: Draft → Review → Approval → Approved (4 steps)
        // Payload { submitted_to } returns HTTP 200 with null body — GET run after each advance to read status
        console.log(`[STEP 10] Advancing payroll run to approved...`);
        let runStatus = run.status?.toLowerCase() || 'draft';
        for (let i = 0; i < 5 && runStatus !== 'approved'; i++) {
            const advResp = await page.request.patch(
                `${app.apiBase}/payroll-runs/${runId}/advance?${params}`,
                { headers: await getHeaders(), data: { submitted_to: adminId } }
            );
            const getResp = await page.request.get(`${app.apiBase}/payroll-runs/${runId}?${params}`, { headers: await getHeaders() });
            const runData = await getResp.json();
            runStatus = runData.status?.toLowerCase() || runStatus;
            console.log(`[INFO] Advance ${i + 1}: HTTP ${advResp.status()} | run status: ${runStatus} | step: ${runData.current_approval_step?.name || ''}`);
            if (!advResp.ok()) break;
            await page.waitForTimeout(1500);
        }
        expect(runStatus).toBe('approved');
        console.log(`[PASS] Payroll run approved`);

        // ── FINAL: Verify payrolls generated ─────────────────────────────────
        const finalRun = await app.api.hr.getPayrollRun(runId);
        expect(Array.isArray(finalRun.payrolls)).toBe(true);
        expect(finalRun.payrolls.length).toBeGreaterThan(0);
        console.log(`[PASS] Payrolls generated: ${finalRun.payrolls.length}`);
    });
});
