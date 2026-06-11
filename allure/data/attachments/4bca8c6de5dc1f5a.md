# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hr/hr-lifecycle.spec.ts >> HR: Multi-Employee Full Lifecycle @hr @smoke @regression @full >> Full lifecycle: 3 employees created, contracted, and processed in one payroll run
- Location: tests/hr/hr-lifecycle.spec.ts:15:9

# Error details

```
Error: Contract creation failed for emp 246279d5-23fd-455b-8bad-fbd5ce5c526e: 500 - {
	"message": "Failed to create employee contract"
}

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "BM Tech" [ref=e10]: BT
        - generic [ref=e11]:
          - button "BM Tech" [ref=e12] [cursor=pointer]:
            - generic: BM Tech
            - img [ref=e14]
          - generic [ref=e16] [cursor=pointer]:
            - button "Company Detail" [ref=e17]:
              - img [ref=e18]
            - button "Edit Company" [ref=e21]:
              - img [ref=e22]
            - button "Company Detail" [ref=e25]:
              - img [ref=e26]
      - generic [ref=e29]:
        - button "New" [ref=e30] [cursor=pointer]:
          - text: New
          - img [ref=e32]
        - generic [ref=e36] [cursor=pointer]:
          - generic [ref=e37]: "5"
          - img "Notifications" [ref=e38]
        - button "EC" [ref=e41] [cursor=pointer]:
          - img [ref=e42]
          - paragraph [ref=e44]: EC
        - button [ref=e45] [cursor=pointer]:
          - img [ref=e46]
        - generic [ref=e49] [cursor=pointer]:
          - img "System" [ref=e51]: S
          - generic [ref=e52]:
            - generic [ref=e53]: System
            - paragraph [ref=e54]: IT Administrator / User Manager
    - generic [ref=e56]:
      - generic [ref=e58]:
        - generic [ref=e59]:
          - img "BM Tech" [ref=e62]: BT
          - paragraph [ref=e63]: Welcome, System
        - paragraph [ref=e65]: From meticulous bookkeeping to seamless inventory control, we've got your back.
        - generic [ref=e66]:
          - link "Dashboard" [ref=e67] [cursor=pointer]:
            - /url: /dashboard
          - link "Settings" [ref=e68] [cursor=pointer]:
            - /url: /settings/company/details
        - generic [ref=e69]:
          - link "Add Customer" [ref=e70] [cursor=pointer]:
            - /url: /receivables/customers/new
            - img [ref=e73]
            - text: Add Customer
          - link "Add Invoice" [ref=e74] [cursor=pointer]:
            - /url: /receivables/invoices/new
            - img [ref=e77]
            - text: Add Invoice
          - link "Add Receipt" [ref=e78] [cursor=pointer]:
            - /url: /receivables/receipts/new
            - img [ref=e81]
            - text: Add Receipt
          - link "Add Sales Order" [ref=e82] [cursor=pointer]:
            - /url: /receivables/sale-orders/new
            - img [ref=e85]
            - text: Add Sales Order
        - paragraph [ref=e87]: Quick Access
        - generic [ref=e88]:
          - generic [ref=e89]:
            - link "Sales Sales" [ref=e91] [cursor=pointer]:
              - /url: /receivables/overview/
              - button "Sales Sales" [ref=e92]:
                - generic [ref=e93]:
                  - img "Sales" [ref=e94]
                  - paragraph [ref=e95]: Sales
            - link "Purchase Purchase" [ref=e97] [cursor=pointer]:
              - /url: /payables/overview/
              - button "Purchase Purchase" [ref=e98]:
                - generic [ref=e99]:
                  - img "Purchase" [ref=e100]
                  - paragraph [ref=e101]: Purchase
            - link "Accounting Accounting" [ref=e103] [cursor=pointer]:
              - /url: /accounting/overview
              - button "Accounting Accounting" [ref=e104]:
                - generic [ref=e105]:
                  - img "Accounting" [ref=e106]
                  - paragraph [ref=e107]: Accounting
            - link "Leases Leases" [ref=e109] [cursor=pointer]:
              - /url: /leases/leases/?page=1&pageSize=15
              - button "Leases Leases" [ref=e110]:
                - generic [ref=e111]:
                  - img "Leases" [ref=e112]
                  - paragraph [ref=e113]: Leases
            - link "Assets Assets" [ref=e115] [cursor=pointer]:
              - /url: /assets/overview
              - button "Assets Assets" [ref=e116]:
                - generic [ref=e117]:
                  - img "Assets" [ref=e118]
                  - paragraph [ref=e119]: Assets
            - link "Budgets Budgets" [ref=e121] [cursor=pointer]:
              - /url: /public-sector-budgets/overview
              - button "Budgets Budgets" [ref=e122]:
                - generic [ref=e123]:
                  - img "Budgets" [ref=e124]
                  - paragraph [ref=e125]: Budgets
            - link "Payroll Payroll" [ref=e127] [cursor=pointer]:
              - /url: /payrolls
              - button "Payroll Payroll" [ref=e128]:
                - generic [ref=e129]:
                  - img "Payroll" [ref=e130]
                  - paragraph [ref=e131]: Payroll
            - link "Report Report" [ref=e133] [cursor=pointer]:
              - /url: /reports
              - button "Report Report" [ref=e134]:
                - generic [ref=e135]:
                  - img "Report" [ref=e136]
                  - paragraph [ref=e137]: Report
          - button "View All" [ref=e138] [cursor=pointer]:
            - text: View All
            - img [ref=e140]
      - img "Floating Icon" [ref=e143]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
```

# Test source

```ts
  24  |             'Content-Type': 'application/json',
  25  |         });
  26  | 
  27  |         // ── STEP 1: Discover shared metadata ─────────────────────────────────
  28  |         console.log(`[STEP 1] Discovering metadata...`);
  29  |         const meta = await app.api.hr.discoverMetadataAPI();
  30  |         const dept = await app.api.hr.ensureDepartment('Automation Department');
  31  |         meta.departmentId = dept.id;
  32  |         meta.departmentName = dept.name;
  33  |         const job = await app.api.hr.ensureJobPosition(dept.id, 'QA Specialist');
  34  |         meta.jobPositionId = job.id;
  35  |         meta.jobPositionTitle = job.title;
  36  |         console.log(`[INFO] dept: ${meta.departmentName} | job: ${meta.jobPositionTitle}`);
  37  | 
  38  |         // ── STEP 2: Create 3 employees sequentially (parallel causes backend timeout) ──
  39  |         console.log(`[STEP 2] Creating ${EMPLOYEE_COUNT} employees sequentially...`);
  40  |         const employees: any[] = [];
  41  |         for (let i = 0; i < EMPLOYEE_COUNT; i++) {
  42  |             const emp = await app.api.hr.createEmployee({
  43  |                 name: `Lifecycle-Emp-${ts}-${i + 1}`,
  44  |                 email: `lc${ts}${i}@beffa.com`,
  45  |                 phone: `09${String(ts + i).slice(-8)}`,
  46  |                 gender: i % 2 === 0 ? 'female' : 'male',
  47  |                 father_name: `Father${i + 1}`,
  48  |                 grand_father_name: `Grand${i + 1}`,
  49  |                 bank_account_number: String(ts + i).slice(-13),
  50  |                 bank_name: 'Commercial Bank of Ethiopia',
  51  |                 address: { region: 'Addis Ababa City Administration', zone: 'Bole Subcity', woreda: 'Woreda 2', kebele: '01' },
  52  |                 emergency_contacts: [{ name: 'Emergency Contact', phone: '0922000001', relation: 'Spouse' }],
  53  |             });
  54  |             employees.push(emp);
  55  |             console.log(`[PASS] Employee ${i + 1}: ${emp.name} | id: ${emp.id}`);
  56  |             if (i < EMPLOYEE_COUNT - 1) await page.waitForTimeout(1500);
  57  |         }
  58  |         const empIds = employees.map(e => e.id);
  59  |         expect(empIds.length).toBe(EMPLOYEE_COUNT);
  60  |         // Give backend time to index all employees before contract creation
  61  |         await page.waitForTimeout(2000);
  62  | 
  63  | 
  64  |         // ── STEP 3: Create shared pay component + pay structure ───────────────
  65  |         console.log(`[STEP 3] Creating shared pay component and pay structure...`);
  66  |         const pc = await app.api.hr.createPayComponent(
  67  |             `Salary-${ts}`, 'Earning', 'FullyTaxable', `SL${String(ts).slice(-6)}`, meta.glAccountId
  68  |         );
  69  |         expect(pc).toHaveProperty('id');
  70  | 
  71  |         const ps = await app.api.hr.createPayStructure(`PS-Lifecycle-${ts}`);
  72  |         expect(ps).toHaveProperty('id');
  73  |         const psId = ps.id;
  74  | 
  75  |         const patchResp = await page.request.patch(`${app.apiBase}/pay-structures/${psId}?${params}`, {
  76  |             headers: await getHeaders(),
  77  |             data: {
  78  |                 components: [{
  79  |                     pay_component_id: pc.id,
  80  |                     amount: 10000,
  81  |                     is_fixed: true,
  82  |                     exemption_cap_type: 'FixedCap',
  83  |                     fixed_exemption_cap: 0,
  84  |                     percentage_exemption_cap: 0,
  85  |                 }]
  86  |             }
  87  |         });
  88  |         expect(patchResp.ok()).toBe(true);
  89  |         console.log(`[PASS] Pay structure: ${psId}`);
  90  | 
  91  |         // ── STEP 4: Assign pay structure to all 3 employees at once ──────────
  92  |         console.log(`[STEP 4] Assigning pay structure to all ${EMPLOYEE_COUNT} employees...`);
  93  |         const assignPsResp = await page.request.post(`${app.apiBase}/pay-structures/assign?${params}`, {
  94  |             headers: await getHeaders(),
  95  |             data: { pay_structure_id: psId, employee_ids: empIds }
  96  |         });
  97  |         expect(assignPsResp.ok()).toBe(true);
  98  |         console.log(`[PASS] Pay structure assigned to all employees`);
  99  | 
  100 |         // ── STEP 5: Create contracts for all 3 employees in parallel ─────────
  101 |         console.log(`[STEP 5] Creating contracts for all ${EMPLOYEE_COUNT} employees...`);
  102 |         const today = new Date().toISOString().split('T')[0] + 'T00:00:00Z';
  103 |         const contracts = await Promise.all(
  104 |             empIds.map(async (empId) => {
  105 |                 let resp: any;
  106 |                 for (let attempt = 1; attempt <= 3; attempt++) {
  107 |                     resp = await page.request.post(`${app.apiBase}/employee-contracts?${params}`, {
  108 |                         headers: await getHeaders(),
  109 |                         data: {
  110 |                             employee_id: empId,
  111 |                             contract_type: 'permanent',
  112 |                             pay_frequency: 'monthly',
  113 |                             pay_method: 'salary',
  114 |                             salary: 10000,
  115 |                             department_id: meta.departmentId,
  116 |                             job_position_id: meta.jobPositionId,
  117 |                             start_date: today,
  118 |                         }
  119 |                     });
  120 |                     if (resp.ok()) break;
  121 |                     console.log(`[WARN] Contract attempt ${attempt} failed for emp ${empId}: ${resp.status()} — retrying...`);
  122 |                     await page.waitForTimeout(2000);
  123 |                 }
> 124 |                 if (!resp.ok()) throw new Error(`Contract creation failed for emp ${empId}: ${resp.status()} - ${await resp.text()}`);
      |                                       ^ Error: Contract creation failed for emp 246279d5-23fd-455b-8bad-fbd5ce5c526e: 500 - {
  125 |                 return resp.json();
  126 |             })
  127 |         );
  128 |         const contractIds = contracts.map(c => c.id);
  129 |         contracts.forEach((c, i) => console.log(`[PASS] Contract ${i + 1}: ${c.id} | status: ${c.status}`));
  130 | 
  131 |         // ── STEP 6: Approve all contracts via advanceDocumentAPI in parallel ──
  132 |         console.log(`[STEP 6] Approving all ${EMPLOYEE_COUNT} contracts...`);
  133 |         await Promise.all(
  134 |             contractIds.map(contractId => app.advanceDocumentAPI(contractId, 'employee-contracts'))
  135 |         );
  136 |         await page.waitForTimeout(2000);
  137 |         console.log(`[PASS] All contracts approved`);
  138 | 
  139 |         // ── STEP 7: Verify all employees are active ───────────────────────────
  140 |         console.log(`[STEP 7] Verifying all ${EMPLOYEE_COUNT} employees are active...`);
  141 |         await Promise.all(
  142 |             empIds.map(async (empId, i) => {
  143 |                 let status = 'inactive';
  144 |                 for (let attempt = 0; attempt < 10; attempt++) {
  145 |                     const r = await page.request.get(`${app.apiBase}/employees/${empId}?${params}`, { headers: await getHeaders() });
  146 |                     status = (await r.json()).status?.toLowerCase() || 'inactive';
  147 |                     if (status === 'active') break;
  148 |                     await page.waitForTimeout(2000);
  149 |                 }
  150 |                 expect(status, `Employee ${i + 1} (${empId}) should be active`).toBe('active');
  151 |                 console.log(`[PASS] Employee ${i + 1} is active`);
  152 |             })
  153 |         );
  154 | 
  155 |         // ── STEP 8: Create payroll run ────────────────────────────────────────
  156 |         console.log(`[STEP 8] Creating payroll run...`);
  157 |         const now = new Date();
  158 |         const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0] + 'T00:00:00Z';
  159 |         const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0] + 'T00:00:00Z';
  160 |         const run = await app.api.hr.createPayrollRun(
  161 |             `Lifecycle-Run-${ts}`, periodStart, periodEnd, periodEnd
  162 |         );
  163 |         expect(run).toHaveProperty('id');
  164 |         const runId = run.id;
  165 |         console.log(`[PASS] Payroll run: ${runId}`);
  166 | 
  167 |         // STEP 9: Assign employees one by one (API only processes first ID in array)
  168 |         console.log(`[STEP 9] Assigning all ${EMPLOYEE_COUNT} employees to payroll run...`);
  169 |         let assignedCount = 0;
  170 |         for (const empId of empIds) {
  171 |             let assignRunResp: any;
  172 |             for (let attempt = 1; attempt <= 5; attempt++) {
  173 |                 assignRunResp = await page.request.post(
  174 |                     `${app.apiBase}/payroll-runs/${runId}/assign?${params}`,
  175 |                     { headers: await getHeaders(), data: { employee_ids: [empId], action: 'assign' } }
  176 |                 );
  177 |                 if (assignRunResp.ok()) break;
  178 |                 console.log(`[WARN] Assign attempt ${attempt} for emp ${empId}: HTTP ${assignRunResp.status()}`);
  179 |                 if (attempt < 5) await page.waitForTimeout(2000);
  180 |             }
  181 |             if (!assignRunResp.ok()) throw new Error(`Assign employee ${empId} failed after 5 attempts`);
  182 |             assignedCount++;
  183 |             console.log(`[OK] Assigned emp ${empId}`);
  184 |             await page.waitForTimeout(500);
  185 |         }
  186 |         expect(assignedCount).toBeGreaterThanOrEqual(EMPLOYEE_COUNT);
  187 |         console.log(`[PASS] ${assignedCount} employees assigned to payroll run`);
  188 | 
  189 |         // ── STEP 10: Approve payroll run via UI (select all rows) ─────────────
  190 |         console.log(`[STEP 10] Approving payroll run via UI...`);
  191 |         await page.goto(`/payrolls/payroll-runs/${runId}/review/hours`);
  192 |         await page.waitForLoadState('networkidle');
  193 | 
  194 |         // Select all employee checkboxes (not just row 1)
  195 |         const checkboxes = page.locator('table tbody tr td:first-child button[role="checkbox"]');
  196 |         const checkCount = await checkboxes.count();
  197 |         console.log(`[INFO] Found ${checkCount} checkboxes to select`);
  198 |         for (let i = 0; i < checkCount; i++) {
  199 |             await checkboxes.nth(i).click({ force: true }).catch(() => {});
  200 |         }
  201 |         // Fallback: select-all header checkbox
  202 |         if (checkCount === 0) {
  203 |             const selectAll = page.locator('table thead button[role="checkbox"]').first();
  204 |             if (await selectAll.isVisible({ timeout: 3000 }).catch(() => false)) {
  205 |                 await selectAll.click({ force: true });
  206 |                 console.log(`[INFO] Used select-all header checkbox`);
  207 |             }
  208 |         }
  209 |         await page.waitForTimeout(1000);
  210 | 
  211 |         await page.getByRole('button', { name: /Process Payroll/i }).click();
  212 |         console.log(`[OK] Process Payroll clicked`);
  213 |         await page.waitForTimeout(3000);
  214 | 
  215 |         // Navigate to Preview step
  216 |         const previewBtn = page.locator('text=Preview').first();
  217 |         if (await previewBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  218 |             await previewBtn.click();
  219 |             await page.waitForTimeout(2000);
  220 |         } else {
  221 |             const baseUrl = page.url().split('/review/')[0];
  222 |             await page.goto(`${baseUrl}/review/preview`).catch(() => {});
  223 |             await page.waitForTimeout(2000);
  224 |         }
```