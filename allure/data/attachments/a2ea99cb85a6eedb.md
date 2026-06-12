# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hr/hr-employees.spec.ts >> HR: Employee Lifecycle @hr @smoke @full >> API: Org chart must return company context and department segments
- Location: tests/hr/hr-employees.spec.ts:137:9

# Error details

```
Error: Get org-chart failed: 401
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
          - generic [ref=e37]: "397"
          - img "Notifications" [ref=e38]
        - button "Loading... EC" [disabled] [ref=e41]:
          - generic [ref=e44]: Loading...
          - generic [ref=e45]:
            - img [ref=e46]
            - paragraph [ref=e48]: EC
        - button [ref=e49] [cursor=pointer]:
          - img [ref=e50]
        - generic [ref=e53] [cursor=pointer]:
          - img "System" [ref=e55]: S
          - generic [ref=e56]:
            - generic [ref=e57]: System
            - paragraph [ref=e58]: IT Administrator / User Manager
    - generic [ref=e60]:
      - generic [ref=e62]:
        - generic [ref=e63]:
          - img "BM Tech" [ref=e66]: BT
          - paragraph [ref=e67]: Welcome, System
        - paragraph [ref=e69]: From meticulous bookkeeping to seamless inventory control, we've got your back.
        - generic [ref=e70]:
          - link "Dashboard" [ref=e71] [cursor=pointer]:
            - /url: /dashboard
          - link "Settings" [ref=e72] [cursor=pointer]:
            - /url: /settings/company/details
        - generic [ref=e73]:
          - link "Add Customer" [ref=e74] [cursor=pointer]:
            - /url: /receivables/customers/new
            - img [ref=e77]
            - text: Add Customer
          - link "Add Invoice" [ref=e78] [cursor=pointer]:
            - /url: /receivables/invoices/new
            - img [ref=e81]
            - text: Add Invoice
          - link "Add Receipt" [ref=e82] [cursor=pointer]:
            - /url: /receivables/receipts/new
            - img [ref=e85]
            - text: Add Receipt
          - link "Add Sales Order" [ref=e86] [cursor=pointer]:
            - /url: /receivables/sale-orders/new
            - img [ref=e89]
            - text: Add Sales Order
        - paragraph [ref=e91]: Quick Access
        - generic [ref=e92]:
          - generic [ref=e93]:
            - link "Sales Sales" [ref=e95] [cursor=pointer]:
              - /url: /receivables/overview/
              - button "Sales Sales" [ref=e96]:
                - generic [ref=e97]:
                  - img "Sales" [ref=e98]
                  - paragraph [ref=e99]: Sales
            - link "Purchase Purchase" [ref=e101] [cursor=pointer]:
              - /url: /payables/overview/
              - button "Purchase Purchase" [ref=e102]:
                - generic [ref=e103]:
                  - img "Purchase" [ref=e104]
                  - paragraph [ref=e105]: Purchase
            - link "Accounting Accounting" [ref=e107] [cursor=pointer]:
              - /url: /accounting/overview
              - button "Accounting Accounting" [ref=e108]:
                - generic [ref=e109]:
                  - img "Accounting" [ref=e110]
                  - paragraph [ref=e111]: Accounting
            - link "Leases Leases" [ref=e113] [cursor=pointer]:
              - /url: /leases/leases/?page=1&pageSize=15
              - button "Leases Leases" [ref=e114]:
                - generic [ref=e115]:
                  - img "Leases" [ref=e116]
                  - paragraph [ref=e117]: Leases
            - link "Assets Assets" [ref=e119] [cursor=pointer]:
              - /url: /assets/overview
              - button "Assets Assets" [ref=e120]:
                - generic [ref=e121]:
                  - img "Assets" [ref=e122]
                  - paragraph [ref=e123]: Assets
            - link "Budgets Budgets" [ref=e125] [cursor=pointer]:
              - /url: /public-sector-budgets/overview
              - button "Budgets Budgets" [ref=e126]:
                - generic [ref=e127]:
                  - img "Budgets" [ref=e128]
                  - paragraph [ref=e129]: Budgets
            - link "Payroll Payroll" [ref=e131] [cursor=pointer]:
              - /url: /payrolls
              - button "Payroll Payroll" [ref=e132]:
                - generic [ref=e133]:
                  - img "Payroll" [ref=e134]
                  - paragraph [ref=e135]: Payroll
            - link "Report Report" [ref=e137] [cursor=pointer]:
              - /url: /reports
              - button "Report Report" [ref=e138]:
                - generic [ref=e139]:
                  - img "Report" [ref=e140]
                  - paragraph [ref=e141]: Report
          - button "View All" [ref=e142] [cursor=pointer]:
            - text: View All
            - img [ref=e144]
      - img "Floating Icon" [ref=e147]
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
  88  |   }
  89  | 
  90  |   async listEmployees(pageSize = 10): Promise<any[]> {
  91  |     const h = await this.headers();
  92  |     const resp = await this.page.request.get(
  93  |       `${this.apiBase}/employees?page=1&pageSize=${pageSize}&${this.params}`, { headers: h }
  94  |     );
  95  |     if (!resp.ok()) throw new Error(`List employees failed: ${resp.status()}`);
  96  |     return (await resp.json()).data || [];
  97  |   }
  98  | 
  99  |   async getEmployee(id: string): Promise<any> {
  100 |     const h = await this.headers();
  101 |     const resp = await this.page.request.get(
  102 |       `${this.apiBase}/employees/${id}?${this.params}`, { headers: h }
  103 |     );
  104 |     if (!resp.ok()) throw new Error(`Get employee failed: ${resp.status()}`);
  105 |     return resp.json();
  106 |   }
  107 | 
  108 |   async listTimesheets(pageSize = 10): Promise<any[]> {
  109 |     const h = await this.headers();
  110 |     const resp = await this.page.request.get(
  111 |       `${this.apiBase}/timesheets?page=1&pageSize=${pageSize}&${this.params}`, { headers: h }
  112 |     );
  113 |     if (!resp.ok()) throw new Error(`List timesheets failed: ${resp.status()}`);
  114 |     return (await resp.json()).data || [];
  115 |   }
  116 | 
  117 |   async createTimesheet(employeeId: string, date: string, hours: number, description = 'Audit Timesheet'): Promise<any> {
  118 |     const h = await this.headers();
  119 |     const resp = await this.page.request.post(
  120 |       `${this.apiBase}/timesheets?${this.params}`,
  121 |       { headers: h, data: { employee_id: employeeId, date, hours, description } }
  122 |     );
  123 |     if (!resp.ok()) throw new Error(`Create timesheet failed: ${resp.status()} - ${await resp.text()}`);
  124 |     return resp.json();
  125 |   }
  126 | 
  127 |   async listLeaveApplications(pageSize = 10): Promise<any[]> {
  128 |     const h = await this.headers();
  129 |     const resp = await this.page.request.get(
  130 |       `${this.apiBase}/leave-applications?page=1&pageSize=${pageSize}&${this.params}`, { headers: h }
  131 |     );
  132 |     if (!resp.ok()) throw new Error(`List leave-applications failed: ${resp.status()}`);
  133 |     return (await resp.json()).data || [];
  134 |   }
  135 | 
  136 |   async listPayrollRuns(pageSize = 10): Promise<any[]> {
  137 |     const h = await this.headers();
  138 |     const resp = await this.page.request.get(
  139 |       `${this.apiBase}/payroll-runs?page=1&pageSize=${pageSize}&${this.params}`, { headers: h }
  140 |     );
  141 |     if (!resp.ok()) throw new Error(`List payroll-runs failed: ${resp.status()}`);
  142 |     return (await resp.json()).data || [];
  143 |   }
  144 | 
  145 |   async createPayrollRun(name: string, startDate: string, endDate: string, payDate: string): Promise<any> {
  146 |     const h = await this.headers();
  147 |     const resp = await this.page.request.post(
  148 |       `${this.apiBase}/payroll-runs?${this.params}`,
  149 |       { headers: h, data: { event_name: name, start_date: startDate, end_date: endDate, pay_date: payDate } }
  150 |     );
  151 |     if (!resp.ok()) throw new Error(`Create payroll-run failed: ${resp.status()} - ${await resp.text()}`);
  152 |     return resp.json();
  153 |   }
  154 | 
  155 |   async getPayrollRun(id: string): Promise<any> {
  156 |     const h = await this.headers();
  157 |     const resp = await this.page.request.get(
  158 |       `${this.apiBase}/payroll-runs/${id}?${this.params}`, { headers: h }
  159 |     );
  160 |     if (!resp.ok()) throw new Error(`Get payroll-run failed: ${resp.status()}`);
  161 |     return resp.json();
  162 |   }
  163 | 
  164 |   async listPayComponents(pageSize = 10): Promise<any[]> {
  165 |     const h = await this.headers();
  166 |     const resp = await this.page.request.get(
  167 |       `${this.apiBase}/pay-components?page=1&pageSize=${pageSize}&${this.params}`, { headers: h }
  168 |     );
  169 |     if (!resp.ok()) throw new Error(`List pay-components failed: ${resp.status()}`);
  170 |     return (await resp.json()).data || [];
  171 |   }
  172 | 
  173 |   async createPayComponent(name: string, type: string, taxRule: string, abbreviation: string, glAccountId: string): Promise<any> {
  174 |     const h = await this.headers();
  175 |     const resp = await this.page.request.post(
  176 |       `${this.apiBase}/pay-components?${this.params}`,
  177 |       { headers: h, data: { name, type, tax_rule: taxRule, abbreviation, general_ledger_account_id: glAccountId } }
  178 |     );
  179 |     if (!resp.ok()) throw new Error(`Create pay-component failed: ${resp.status()} - ${await resp.text()}`);
  180 |     return resp.json();
  181 |   }
  182 | 
  183 |   async getOrgChart(): Promise<any> {
  184 |     const h = await this.headers();
  185 |     const resp = await this.page.request.get(
  186 |       `${this.apiBase}/organization-chart?${this.params}`, { headers: h }
  187 |     );
> 188 |     if (!resp.ok()) throw new Error(`Get org-chart failed: ${resp.status()}`);
      |                           ^ Error: Get org-chart failed: 401
  189 |     return resp.json();
  190 |   }
  191 | 
  192 |   async listDepartments(pageSize = 10): Promise<any[]> {
  193 |     const h = await this.headers();
  194 |     const resp = await this.page.request.get(
  195 |       `${this.apiBase}/departments?page=1&pageSize=${pageSize}&${this.params}`, { headers: h }
  196 |     );
  197 |     if (!resp.ok()) throw new Error(`List departments failed: ${resp.status()}`);
  198 |     return (await resp.json()).data || [];
  199 |   }
  200 | 
  201 |   async ensureDepartment(name: string = 'Automation Department'): Promise<{ id: string; name: string; configId: string; levelId: string }> {
  202 |     const existing = await this.listDepartments(50);
  203 |     const h = await this.headers();
  204 | 
  205 |     // If a non-ROOT child department already exists, prefer it for contracts
  206 |     const childDept = existing.find((d: any) => d.parent_id !== null);
  207 |     if (childDept) return { id: childDept.id, name: childDept.name, configId: childDept.config_id, levelId: childDept.hierarchy_level_id };
  208 | 
  209 |     // Fall back to ROOT if it's the only one and has a config
  210 |     const rootDept = existing.find((d: any) => d.parent_id === null) || existing[0];
  211 | 
  212 |     // Fetch config to get child hierarchy levels
  213 |     if (rootDept?.config_id) {
  214 |       const cfgResp = await this.page.request.get(
  215 |         `${this.apiBase}/departments/configs/${rootDept.config_id}?${this.params}`, { headers: h }
  216 |       );
  217 |       if (cfgResp.ok()) {
  218 |         const cfg = await cfgResp.json();
  219 |         const levels: any[] = cfg.hierarchy_levels || [];
  220 |         // Find the first child level (level > 1) that allows children or is a leaf
  221 |         const childLevel = levels.find((l: any) => l.level > 1 && l.parent_id === rootDept.hierarchy_level_id)
  222 |           || levels.find((l: any) => l.level > 1)
  223 |           || levels[1];
  224 | 
  225 |         if (childLevel) {
  226 |           const ts = Date.now().toString().slice(-6);
  227 |           const createResp = await this.page.request.post(
  228 |             `${this.apiBase}/departments?${this.params}`,
  229 |             { headers: h, data: {
  230 |               name,
  231 |               code: `AUTO-${ts}`,
  232 |               config_id: rootDept.config_id,
  233 |               hierarchy_level_id: childLevel.id,
  234 |               parent_id: rootDept.id,
  235 |               description: 'Auto-created by E2E suite'
  236 |             }}
  237 |           );
  238 |           if (createResp.ok()) {
  239 |             const created = await createResp.json();
  240 |             if (created?.id) {
  241 |               console.log(`[HR] Created child department: "${created.name}" (${created.id})`);
  242 |               return { id: created.id, name: created.name, configId: rootDept.config_id, levelId: childLevel.id };
  243 |             }
  244 |           }
  245 |           const errText = await createResp.text().catch(() => '');
  246 |           console.log(`[HR] Child dept creation failed (${createResp.status()}): ${errText.slice(0, 120)}`);
  247 |         }
  248 |       }
  249 |     }
  250 | 
  251 |     // Last resort: return ROOT as-is
  252 |     if (rootDept) return { id: rootDept.id, name: rootDept.name, configId: rootDept.config_id, levelId: rootDept.hierarchy_level_id };
  253 | 
  254 |     throw new Error('[HR] No departments found and could not create one. Set up org structure first.');
  255 |   }
  256 | 
  257 |   /**
  258 |    * Ensures a job position exists in the given department.
  259 |    * If none are found, creates one via API so subsequent tests always have a valid jobPositionId.
  260 |    */
  261 |   async ensureJobPosition(departmentId: string, title: string = 'Audit Engineer'): Promise<{ id: string; title: string }> {
  262 |     const h = await this.headers();
  263 |     const listResp = await this.page.request.get(
  264 |       `${this.apiBase}/job-positions?page=1&pageSize=100&${this.params}`, { headers: h }
  265 |     );
  266 |     if (listResp.ok()) {
  267 |       const all = (await listResp.json()).data || [];
  268 |       // Only use job positions that belong to this exact department
  269 |       const deptJobs = all.filter((j: any) => j.department_id === departmentId && j.id);
  270 |       if (deptJobs.length > 0) {
  271 |         const match = deptJobs.find((j: any) => j.title?.toLowerCase().includes(title.toLowerCase())) || deptJobs[0];
  272 |         const filled = match.filled_slots ?? 0;
  273 |         const slots = match.slot_count ?? 0;
  274 |         if (slots === 0 || slots === 1 || filled >= slots) {
  275 |           console.log(`[HR] Job "${match.title}" slots exhausted (${filled}/${slots}). Expanding...`);
  276 |           await this.page.request.patch(
  277 |             `${this.apiBase}/job-positions/${match.id}?${this.params}`,
  278 |             { headers: h, data: { slot_count: filled + 100 } }
  279 |           );
  280 |         }
  281 |         console.log(`[HR] Using job position: "${match.title}" (${match.id}) | dept: ${departmentId}`);
  282 |         return { id: match.id, title: match.title };
  283 |       }
  284 |     }
  285 | 
  286 |     // None found for this department — create one
  287 |     const ts = Date.now().toString().slice(-6);
  288 |     const createResp = await this.page.request.post(
```