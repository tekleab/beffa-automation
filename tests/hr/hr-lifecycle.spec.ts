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

        // Ensure a department exists (self-healing), then find/create a job position inside it
        const dept = await app.api.hr.ensureDepartment('Automation Department');
        meta.departmentId = dept.id;
        meta.departmentName = dept.name;
        const job = await app.api.hr.ensureJobPosition(dept.id, 'QA Specialist');
        meta.jobPositionId = job.id;
        meta.jobPositionTitle = job.title;

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

        // Guard: ensure job position has available slots (expands or creates if slot_count===1 or full)
        const freshJob = await app.api.hr.ensureJobPosition(meta.departmentId, 'QA Specialist');
        meta.jobPositionId = freshJob.id;
        console.log(`[INFO] Validated job position: "${freshJob.title}" (${meta.jobPositionId}) ∈ dept ${meta.departmentId}`);

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
        if (!contractResp.ok()) throw new Error(`Contract creation failed: ${contractResp.status()} - ${await contractResp.text()}`);
        const contract = await contractResp.json();
        const contractId = contract.id;
        const contractDeptId = contract.department_id || contract.department?.id || 'MISSING';
        if (contractDeptId === 'MISSING') throw new Error(`Contract created but department_id missing in response.`);
        console.log(`[PASS] Contract created: ${contractId}`);
        console.log(`[INFO] department_id: ${contractDeptId} | job_position_id: ${meta.jobPositionId}`);
        console.log(`[INFO] status: ${contract.status} | contract_status: ${contract.contract_status}`);

        // ── STEP 6: Approve Contract via advanceDocumentAPI ──────────────────────
        // advanceDocumentAPI handles multi-step workflows with submitted_to + retry logic
        console.log(`[STEP 6] Approving contract via advanceDocumentAPI...`);
        await app.advanceDocumentAPI(contractId, 'employee-contracts');
        await page.waitForTimeout(2000);

        // Verify final status via employee record
        const empCheck = await page.request.get(`${app.apiBase}/employees/${empId}?${params}`, { headers: await getHeaders() });
        const empCheckBody = empCheck.ok() ? await empCheck.json() : {};
        const contractAfter = (empCheckBody.employee_contract || []).find((x: any) => x.id === contractId);
        const contractStatus = contractAfter?.status?.toLowerCase() || contractAfter?.contract_status?.toLowerCase() || 'unknown';
        console.log(`[INFO] Contract status after advance: ${contractStatus}`);
        expect(['approved', 'active']).toContain(contractStatus);
        console.log(`[PASS] Contract approved — status: ${contractStatus}`);

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
        // Use current month so the employee's contract (start_date = today) falls within the period
        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0] + 'T00:00:00Z';
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0] + 'T00:00:00Z';
        const run = await app.api.hr.createPayrollRun(
            `Lifecycle-Run-${ts}`,
            periodStart,
            periodEnd,
            periodEnd
        );
        expect(run).toHaveProperty('id');
        const runId = run.id;
        console.log(`[PASS] Payroll run: ${runId} | status: ${run.status}`);

        // ── STEP 9: Assign Employee to Payroll Run via API ────────────────────
        console.log(`[STEP 9] Assigning employee to payroll run...`);
        let assignRunResp: any;
        for (let attempt = 1; attempt <= 5; attempt++) {
            assignRunResp = await page.request.post(
                `${app.apiBase}/payroll-runs/${runId}/assign?${params}`,
                { headers: await getHeaders(), data: { employee_ids: [empId], action: 'assign' } }
            );
            if (assignRunResp.ok()) break;
            const errText = await assignRunResp.text();
            console.log(`[WARN] Assign attempt ${attempt} failed: HTTP ${assignRunResp.status()} — ${errText.slice(0, 300)}`);
            if (attempt < 5) await page.waitForTimeout(3000);
        }
        if (!assignRunResp.ok()) throw new Error(`Assign employee to payroll run failed after 5 attempts: HTTP ${assignRunResp.status()}`);
        expect((await assignRunResp.json()).message).toMatch(/success/i);

        const empListResp = await page.request.get(
            `${app.apiBase}/payroll-runs/${runId}/employees?${params}`, { headers: await getHeaders() }
        );
        expect(Number((await empListResp.json()).pagination?.total)).toBeGreaterThan(0);
        console.log(`[PASS] Employee assigned to payroll run`);

        // ── STEP 10: Approve Payroll Run via UI ───────────────────────────
        // E1481 always blocks API advance — must use UI
        console.log(`[STEP 10] Approving payroll run via UI...`);

        // Intercept API calls made by the UI to discover the real process/advance endpoint
        const interceptedRequests: string[] = [];
        await page.route('**/api/**', async (route) => {
            const req = route.request();
            if (req.method() !== 'GET') {
                interceptedRequests.push(`${req.method()} ${req.url()}`);
            }
            await route.continue();
        });

        await page.goto(`/payrolls/payroll-runs/${runId}/review/hours`);
        await page.waitForLoadState('networkidle');

        // Fast checkbox selection and complete the approval workflow
        await page.locator('//table//tbody//tr[1]//td[1]//button[@role="checkbox"]').click({ force: true });
        console.log(`[OK] Checkbox clicked`);
        
        await page.waitForTimeout(1000);
        
        // Click Process Payroll to start the workflow
        await page.getByRole('button', { name: /Process Payroll/i }).click();
        console.log(`[OK] Process Payroll clicked`);
        
        await page.waitForTimeout(3000);
        
        // Navigate directly to Preview step for final approval
        console.log(`[WORKFLOW] Navigating to Preview step`);
        const previewButton = page.locator('text=Preview').first();
        if (await previewButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await previewButton.click();
            console.log(`[OK] Clicked Preview step`);
            await page.waitForTimeout(2000);
        } else {
            // Try navigating via URL if Preview button not visible
            const currentUrl = page.url();
            const baseUrl = currentUrl.split('/review/')[0];
            const previewUrl = `${baseUrl}/review/preview`;
            
            try {
                await page.goto(previewUrl);
                console.log(`[OK] Navigated to Preview via URL`);
                await page.waitForTimeout(2000);
            } catch (error) {
                console.log(`[WARN] Could not navigate to Preview: ${error}`);
            }
        }
        
        // Click final approve button on Preview page
        const approveSelectors = [
            'button:has-text("Approve")',
            'button:has-text("Final Approve")',
            'button:has-text("Submit for Approval")',
            '[data-testid*="approve"]',
            'button[class*="approve"]'
        ];
        
        for (const selector of approveSelectors) {
            const btn = page.locator(selector).first();
            if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await btn.click();
                console.log(`[OK] Clicked final approve button`);
                await page.waitForTimeout(2000);
                break;
            }
        }
        
        // Click toolbar Approve button to advance the payroll
        const toolbarApprove = page.getByRole('button', { name: 'Approve' }).first();
        if (await toolbarApprove.isVisible({ timeout: 2000 }).catch(() => false)) {
            await toolbarApprove.click();
            console.log(`[OK] Clicked toolbar Approve button`);
            await page.waitForTimeout(2000);
        }
        
        // Handle any confirmation modal
        const modal = page.getByRole('dialog').first();
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
            const modalApprove = modal.getByRole('button', { name: /approve|confirm|ok/i }).first();
            if (await modalApprove.isVisible({ timeout: 2000 }).catch(() => false)) {
                await modalApprove.click();
                console.log(`[OK] Clicked modal approve button`);
                await page.waitForTimeout(2000);
            }
        }
        
        console.log(`[DEBUG] Intercepted requests: ${JSON.stringify(interceptedRequests)}`);
        await page.unroute('**/api/**');
        
        // Poll for status change
        let finalStatus = 'draft';
        for (let i = 0; i < 15; i++) {
            await page.waitForTimeout(2000);
            const finalData = await app.api.hr.getPayrollRun(runId);
            finalStatus = finalData.status?.toLowerCase() || 'draft';
            console.log(`[POLL ${i+1}/15] Payroll run status: ${finalStatus}`);
            if (finalStatus !== 'draft') break;
        }
        
        expect(finalStatus).toBe('approved');
        console.log(`[PASS] Payroll run approved`);

        // ── FINAL: Verify payrolls generated ─────────────────────────────────
        const finalRun = await app.api.hr.getPayrollRun(runId);
        expect(Array.isArray(finalRun.payrolls)).toBe(true);
        expect(finalRun.payrolls.length).toBeGreaterThan(0);
        console.log(`[PASS] Payrolls generated: ${finalRun.payrolls.length}`);
    });
});
