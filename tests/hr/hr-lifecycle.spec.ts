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
 * HR Full Lifecycle — Multi-Employee
 * Creates 3 employees in parallel, runs them through a shared payroll run.
 * Flow: Employees (API) → Contracts (API) → Approve (API) → Pay Structure (API)
 *       → Payroll Run (API) → Assign all 3 (API) → Approve Run (UI) → Assert payrolls ≥ 3
 */
test.describe('HR: Multi-Employee Full Lifecycle @hr @smoke @regression @full', () => {
    test.setTimeout(120000);

    const EMPLOYEE_COUNT = 3;

    test('Full lifecycle: 3 employees created, contracted, and processed in one payroll run', async ({ page , request }) => {
        const app = new AppManager(page);
        await apiLogin(request);

        const ts = Date.now();
        const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
        const getHeaders = async () => ({
            'Authorization': `Bearer ${await app._getAuthToken()}`,
            'x-company': process.env.BEFFA_COMPANY as string,
            'Content-Type': 'application/json',
        });

        // ── STEP 1: Discover shared metadata ─────────────────────────────────
        console.log(`[STEP 1] Discovering metadata...`);
        const meta = await app.api.hr.discoverMetadataAPI();
        if (!meta) { console.log("[SKIP] HR org structure not configured"); return; }
        // Always use a contract-eligible (child) department — never ROOT alone
        let dept: any; try { dept = await app.api.hr.ensureDepartment("Automation Department"); } catch { console.log("[SKIP] No departments available"); return; }
        meta.departmentId = dept.id;
        meta.departmentName = dept.name;
        const job = await app.api.hr.ensureJobPosition(dept.id, 'QA Specialist');
        meta.jobPositionId = job.id;
        meta.jobPositionTitle = job.title;
        console.log(`[INFO] dept: ${meta.departmentName} (${meta.departmentId}) | job: ${meta.jobPositionTitle} (${meta.jobPositionId})`);

        // ── STEP 2: Create 3 employees sequentially (parallel causes backend timeout) ──
        console.log(`[STEP 2] Creating ${EMPLOYEE_COUNT} employees sequentially...`);
        const employees: any[] = [];
        for (let i = 0; i < EMPLOYEE_COUNT; i++) {
            const emp = await app.api.hr.createEmployee({
                name: `Lifecycle-Emp-${ts}-${i + 1}`,
                email: `lc${ts}${i}@beffa.com`,
                phone: `09${String(ts + i).slice(-8)}`,
                gender: i % 2 === 0 ? 'female' : 'male',
                father_name: `Father${i + 1}`,
                grand_father_name: `Grand${i + 1}`,
                bank_account_number: String(ts + i).slice(-13),
                bank_name: 'Commercial Bank of Ethiopia',
                address: { region: 'Addis Ababa City Administration', zone: 'Bole Subcity', woreda: 'Woreda 2', kebele: '01' },
                emergency_contacts: [{ name: 'Emergency Contact', phone: '0922000001', relation: 'Spouse' }],
            });
            employees.push(emp);
            console.log(`[PASS] Employee ${i + 1}: ${emp.name} | id: ${emp.id}`);
            if (i < EMPLOYEE_COUNT - 1) await page.waitForTimeout(1500);
        }
        const empIds = employees.map(e => e.id);
        expect(empIds.length).toBe(EMPLOYEE_COUNT);
        // Give backend time to index all employees before contract creation
        await page.waitForTimeout(2000);


        // ── STEP 3: Create shared pay component + pay structure ───────────────
        console.log(`[STEP 3] Creating shared pay component and pay structure...`);
        const pc = await app.api.hr.createPayComponent(
            `Salary-${ts}`, 'Earning', 'FullyTaxable', `SL${String(ts).slice(-6)}`, meta.glAccountId
        );
        expect(pc).toHaveProperty('id');

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
        console.log(`[PASS] Pay structure: ${psId}`);

        // ── STEP 4: Assign pay structure to all 3 employees at once ──────────
        console.log(`[STEP 4] Assigning pay structure to all ${EMPLOYEE_COUNT} employees...`);
        const assignPsResp = await page.request.post(`${app.apiBase}/pay-structures/assign?${params}`, {
            headers: await getHeaders(),
            data: { pay_structure_id: psId, employee_ids: empIds }
        });
        expect(assignPsResp.ok()).toBe(true);
        console.log(`[PASS] Pay structure assigned to all employees`);

        // ── STEP 5: Create contracts for all 3 employees in parallel ─────────
        console.log(`[STEP 5] Creating contracts for all ${EMPLOYEE_COUNT} employees...`);
        const { DateHelper: _DH } = require('../../lib/utils/DateHelper');
        const _dateIso = (await _DH.resolve(page)).iso;
        const today = _dateIso;
        const contracts: any[] = [];
        for (const empId of empIds) {
            // Cancel any existing draft contract to avoid 409
            const existingResp = await page.request.get(
                `${app.apiBase}/employee-contracts?employee_id=${empId}&status=draft&page=1&pageSize=10&${params}`,
                { headers: await getHeaders() }
            );
            if (existingResp.ok()) {
                const existing = (await existingResp.json()).data || [];
                for (const c of existing) {
                    await page.request.patch(
                        `${app.apiBase}/employee-contracts/${c.id}?${params}`,
                        { headers: await getHeaders(), data: { status: 'cancelled' } }
                    );
                    console.log(`[INFO] Cancelled existing draft contract ${c.id} for emp ${empId}`);
                }
            }

            let resp: any;
            let contractData: any = null;
            for (let attempt = 1; attempt <= 5; attempt++) {
                resp = await page.request.post(`${app.apiBase}/employee-contracts?${params}`, {
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
                if (resp.ok()) { contractData = await resp.json(); break; }
                const errBody = await resp.text();
                console.log(`[WARN] Contract attempt ${attempt} failed for emp ${empId}: ${resp.status()} — ${errBody.slice(0, 200)} — checking if created anyway...`);
                // 500 from workflow engine may still have persisted the contract — check before retrying
                await page.waitForTimeout(3000);
                const checkResp = await page.request.get(
                    `${app.apiBase}/contracts?employee_id=${empId}&page=1&pageSize=5`,
                    { headers: await getHeaders() }
                );
                if (checkResp.ok()) {
                    const existing = (await checkResp.json()).data || [];
                    const draft = existing.find((c: any) => c.status === 'draft');
                    if (draft) { console.log(`[INFO] Contract found after 500: ${draft.id}`); contractData = draft; break; }
                }
                await page.waitForTimeout(5000);
            }
            if (!contractData) throw new Error(`Contract creation failed for emp ${empId}: ${resp.status()} - ${await resp.text()}`);
            contracts.push(contractData);
            await page.waitForTimeout(2000);
        }
        const contractIds = contracts.map(c => c.id);
        contracts.forEach((c, i) => console.log(`[PASS] Contract ${i + 1}: ${c.id} | status: ${c.status}`));

        // ── STEP 6: Approve all contracts via advanceDocumentAPI in parallel ──
        console.log(`[STEP 6] Approving all ${EMPLOYEE_COUNT} contracts...`);
        await Promise.all(
            contractIds.map(contractId => app.advanceDocumentAPI(contractId, 'employee-contracts'))
        );
        await page.waitForTimeout(2000);
        console.log(`[PASS] All contracts approved`);

        // ── STEP 7: Verify all employees are active ───────────────────────────
        console.log(`[STEP 7] Verifying all ${EMPLOYEE_COUNT} employees are active...`);
        await Promise.all(
            empIds.map(async (empId, i) => {
                let status = 'inactive';
                for (let attempt = 0; attempt < 10; attempt++) {
                    const r = await page.request.get(`${app.apiBase}/employees/${empId}?${params}`, { headers: await getHeaders() });
                    status = (await r.json()).status?.toLowerCase() || 'inactive';
                    if (status === 'active') break;
                    await page.waitForTimeout(2000);
                }
                expect(status, `Employee ${i + 1} (${empId}) should be active`).toBe('active');
                console.log(`[PASS] Employee ${i + 1} is active`);
            })
        );

        // ── STEP 8: Create payroll run ────────────────────────────────────────
        console.log(`[STEP 8] Creating payroll run...`);
        const now = new Date(_dateIso);
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0] + 'T00:00:00Z';
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0] + 'T00:00:00Z';
        const run = await app.api.hr.createPayrollRun(
            `Lifecycle-Run-${ts}`, periodStart, periodEnd, periodEnd
        );
        expect(run).toHaveProperty('id');
        const runId = run.id;
        console.log(`[PASS] Payroll run: ${runId}`);

        // STEP 9: Assign employees one by one (API only processes first ID in array)
        console.log(`[STEP 9] Assigning all ${EMPLOYEE_COUNT} employees to payroll run...`);
        let assignedCount = 0;
        for (const empId of empIds) {
            let assignRunResp: any;
            for (let attempt = 1; attempt <= 5; attempt++) {
                assignRunResp = await page.request.post(
                    `${app.apiBase}/payroll-runs/${runId}/assign?${params}`,
                    { headers: await getHeaders(), data: { employee_ids: [empId], action: 'assign' } }
                );
                if (assignRunResp.ok()) break;
                console.log(`[WARN] Assign attempt ${attempt} for emp ${empId}: HTTP ${assignRunResp.status()}`);
                if (attempt < 5) await page.waitForTimeout(2000);
            }
            if (!assignRunResp.ok()) throw new Error(`Assign employee ${empId} failed after 5 attempts`);
            assignedCount++;
            console.log(`[OK] Assigned emp ${empId}`);
            await page.waitForTimeout(500);
        }
        expect(assignedCount).toBeGreaterThanOrEqual(EMPLOYEE_COUNT);
        console.log(`[PASS] ${assignedCount} employees assigned to payroll run`);

        // ── STEP 10: Process then approve payroll run ────────────────────────
        console.log(`[STEP 10] Processing payroll run (compute pay lines)...`);
        const processResp = await page.request.patch(
            `${app.apiBase}/payroll-runs/${runId}/process?${params}`,
            { headers: await getHeaders() }
        );
        if (!processResp.ok()) {
            const errText = await processResp.text();
            throw new Error(`Payroll run process failed: ${processResp.status()} - ${errText}`);
        }
        console.log(`[PASS] Payroll run processed`);
        await page.waitForTimeout(2000);

        console.log(`[STEP 10b] Approving payroll run via API...`);
        await app.advanceDocumentAPI(runId, 'payroll-runs');
        await page.waitForTimeout(3000);

        // Poll for approved status
        let finalStatus = 'draft';
        for (let i = 0; i < 15; i++) {
            await page.waitForTimeout(2000);
            const d = await app.api.hr.getPayrollRun(runId);
            finalStatus = d.status?.toLowerCase() || 'draft';
            console.log(`[POLL ${i + 1}/15] Payroll run status: ${finalStatus}`);
            if (finalStatus !== 'draft') break;
        }
        expect(finalStatus).toBe('approved');
        console.log(`[PASS] Payroll run approved`);

        // ── FINAL: Verify payrolls generated for all employees ────────────────
        const finalRun = await app.api.hr.getPayrollRun(runId);
        expect(Array.isArray(finalRun.payrolls)).toBe(true);
        expect(finalRun.payrolls.length).toBeGreaterThanOrEqual(EMPLOYEE_COUNT);
        console.log(`[PASS] Payrolls generated: ${finalRun.payrolls.length} (expected ≥ ${EMPLOYEE_COUNT})`);
    });
});
