# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hr/hr-lifecycle.spec.ts >> HR: Full Employee-to-Payroll Lifecycle @hr @smoke @regression @full >> Full lifecycle: Employee creation through payroll run approval
- Location: tests/hr/hr-lifecycle.spec.ts:16:9

# Error details

```
Error: expect(received).toHaveProperty(path)

Matcher error: received value must not be null nor undefined

Received has value: null
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "sample" [ref=e10]: s
        - generic [ref=e11]:
          - button "sample" [ref=e12] [cursor=pointer]:
            - generic: sample
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
          - img "sample" [ref=e62]: s
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
  1   | import { test, expect } from '@playwright/test';
  2   | import { AppManager } from '../../pages/AppManager';
  3   | 
  4   | /**
  5   |  * HR Full Lifecycle: Employee (API) → Contract (API) → Approve (UI) → Payroll Run (API) → Approved
  6   |  *
  7   |  * Key findings from live API probe:
  8   |  * - Contract advance via API: E1481 always — UI approval only
  9   |  * - Payroll run advance: payload { submitted_to } returns HTTP 200 with null body — must GET run after each advance
  10  |  * - Payroll flow: Draft → Review → Approval → Approved (4 steps)
  11  |  * - GET /employee/:id → 404; use /employees/:id (plural)
  12  |  */
  13  | test.describe('HR: Full Employee-to-Payroll Lifecycle @hr @smoke @regression @full', () => {
  14  |     test.setTimeout(300000);
  15  | 
  16  |     test('Full lifecycle: Employee creation through payroll run approval', async ({ page }) => {
  17  |         const app = new AppManager(page);
  18  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  19  | 
  20  |         const ts = Date.now();
  21  |         const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  22  |         const adminId = process.env.BEFFA_ADMIN_ID || '14bb1e8c-496f-4556-99e0-830681fcf3de';
  23  | 
  24  |         const getHeaders = async () => ({
  25  |             'Authorization': `Bearer ${await app._getAuthToken()}`,
  26  |             'x-company': process.env.BEFFA_COMPANY as string,
  27  |             'Content-Type': 'application/json',
  28  |         });
  29  | 
  30  |         // ── STEP 1: Create Employee via API ───────────────────────────────────
  31  |         console.log(`[STEP 1] Creating employee via API...`);
  32  |         const emp = await app.api.hr.createEmployee({
  33  |             name: `Lifecycle-Emp-${ts}`,
  34  |             email: `lc${ts}@beffa.com`,
  35  |             phone: `09${String(ts).slice(-8)}`,
  36  |             gender: 'female',
  37  |             father_name: 'LifecycleFather',
  38  |             grand_father_name: 'LifecycleGrand',
  39  |             bank_account_number: String(ts).slice(-13),
  40  |             bank_name: 'Commercial Bank of Ethiopia',
  41  |             address: { region: 'Addis Ababa City Administration', zone: 'Bole Subcity', woreda: 'Woreda 2', kebele: '01' },
  42  |             emergency_contacts: [{ name: 'Emergency Contact', phone: '0922000001', relation: 'Spouse' }],
  43  |         });
> 44  |         expect(emp).toHaveProperty('id');
      |                     ^ Error: expect(received).toHaveProperty(path)
  45  |         const empId = emp.id;
  46  |         console.log(`[PASS] Employee: ${emp.ref} | id: ${empId}`);
  47  | 
  48  |         // ── STEP 2: Create Pay Component via API ──────────────────────────────
  49  |         console.log(`[STEP 2] Creating pay component...`);
  50  |         const meta = await app.api.hr.discoverMetadataAPI();
  51  |         
  52  |         // Dynamically find specific department (BM Technologies Group)
  53  |         const deptResp = await page.request.get(`${app.apiBase}/departments?page=1&pageSize=50&${params}`, { headers: await getHeaders() });
  54  |         const depts = (await deptResp.json()).data || await deptResp.json();
  55  |         const targetDept = depts.find((d: any) => d.name?.toLowerCase().includes('bm technologies group')) || depts[0];
  56  |         
  57  |         if (targetDept) {
  58  |             meta.departmentId = targetDept.id;
  59  |             meta.departmentName = targetDept.name;
  60  |             
  61  |             // Safe, paginated lookup for job positions inside that specific department!
  62  |             const job = await app.api.hr.ensureJobPosition(targetDept.id, 'QA specialist');
  63  |             if (job) {
  64  |                 meta.jobPositionId = job.id;
  65  |                 meta.jobPositionTitle = job.title;
  66  |             }
  67  |         }
  68  | 
  69  |         console.log(`[INFO] Using dept: ${meta.departmentName} (${meta.departmentId}) | job: ${meta.jobPositionTitle} (${meta.jobPositionId})`);
  70  |         const pc = await app.api.hr.createPayComponent(
  71  |             `Salary-${ts}`, 'Earning', 'FullyTaxable', `SL${String(ts).slice(-6)}`, meta.glAccountId
  72  |         );
  73  |         expect(pc).toHaveProperty('id');
  74  |         console.log(`[PASS] Pay component: ${pc.id}`);
  75  | 
  76  |         // ── STEP 3: Create Pay Structure + Add Component via API ──────────────
  77  |         console.log(`[STEP 3] Creating pay structure...`);
  78  |         const ps = await app.api.hr.createPayStructure(`PS-Lifecycle-${ts}`);
  79  |         expect(ps).toHaveProperty('id');
  80  |         const psId = ps.id;
  81  | 
  82  |         const patchResp = await page.request.patch(`${app.apiBase}/pay-structures/${psId}?${params}`, {
  83  |             headers: await getHeaders(),
  84  |             data: {
  85  |                 components: [{
  86  |                     pay_component_id: pc.id,
  87  |                     amount: 10000,
  88  |                     is_fixed: true,
  89  |                     exemption_cap_type: 'FixedCap',
  90  |                     fixed_exemption_cap: 0,
  91  |                     percentage_exemption_cap: 0,
  92  |                 }]
  93  |             }
  94  |         });
  95  |         expect(patchResp.ok()).toBe(true);
  96  |         const psDetail = await patchResp.json();
  97  |         expect(psDetail.components.length).toBeGreaterThan(0);
  98  |         console.log(`[PASS] Pay structure: ${psId} | components: ${psDetail.components.length}`);
  99  | 
  100 |         // ── STEP 4: Assign Pay Structure to Employee via API ──────────────────
  101 |         console.log(`[STEP 4] Assigning pay structure...`);
  102 |         const assignPsResp = await page.request.post(`${app.apiBase}/pay-structures/assign?${params}`, {
  103 |             headers: await getHeaders(),
  104 |             data: { pay_structure_id: psId, employee_ids: [empId] }
  105 |         });
  106 |         expect(assignPsResp.ok()).toBe(true);
  107 |         expect((await assignPsResp.json()).message).toMatch(/success/i);
  108 |         console.log(`[PASS] Pay structure assigned`);
  109 | 
  110 |         // ── STEP 5: Create Contract via API ───────────────────────────────────
  111 |         console.log(`[STEP 5] Creating contract via API...`);
  112 |         const today = new Date().toISOString().split('T')[0] + 'T00:00:00Z';
  113 |         const contractResp = await page.request.post(`${app.apiBase}/employee-contracts?${params}`, {
  114 |             headers: await getHeaders(),
  115 |             data: {
  116 |                 employee_id: empId,
  117 |                 contract_type: 'permanent',
  118 |                 pay_frequency: 'monthly',
  119 |                 pay_method: 'salary',
  120 |                 salary: 10000,
  121 |                 department_id: meta.departmentId,
  122 |                 job_position_id: meta.jobPositionId,
  123 |                 start_date: today,
  124 |             }
  125 |         });
  126 |         expect(contractResp.ok()).toBe(true);
  127 |         const contract = await contractResp.json();
  128 |         const contractId = contract.id;
  129 |         const contractDeptId = contract.department_id || contract.department?.id || 'MISSING';
  130 |         console.log(`[PASS] Contract created: ${contractId}`);
  131 |         console.log(`[INFO] department_id: ${contractDeptId} | job_position_id: ${meta.jobPositionId}`);
  132 |         console.log(`[INFO] status: ${contract.status} | contract_status: ${contract.contract_status}`);
  133 |         expect(contractDeptId).not.toBe('MISSING');
  134 | 
  135 |         // ── STEP 6: Approve Contract via API ──────────────────────────────────
  136 |         // NOTE: advance returns HTTP 200 with null body — must GET contract after PATCH to read real status
  137 |         console.log(`[STEP 6] Approving contract via API...`);
  138 |         let contractStatus = 'draft';
  139 |         for (let i = 0; i < 5 && !['approved', 'active'].includes(contractStatus); i++) {
  140 |             const advResp = await page.request.patch(
  141 |                 `${app.apiBase}/employee-contracts/${contractId}/advance?${params}`,
  142 |                 { headers: await getHeaders(), data: {} }
  143 |             );
  144 |             console.log(`[INFO] Advance attempt ${i + 1}: HTTP ${advResp.status()}`);
```