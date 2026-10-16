# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hr/hr-employees.spec.ts >> HR: Employee Lifecycle @hr @smoke >> API: Org chart must return company context and department segments
- Location: tests/hr/hr-employees.spec.ts:166:9

# Error details

```
Error: Get org-chart failed: 400
```

# Test source

```ts
  167 |       return json.data || json.employee || json;
  168 |     }
  169 |     // Fallback: list scan (check page 1 and last page)
  170 |     const listResp = await this.safeGet(
  171 |       `${this.apiBase}/employees?page=1&pageSize=100&${this.params}`, { headers: h });
  172 |     if (listResp.ok()) {
  173 |       const listJson = await listResp.json();
  174 |       const list = listJson.data || listJson.items || [];
  175 |       let found = list.find((e: any) => e.id === id);
  176 |       if (found) return found;
  177 | 
  178 |       const totalPages = parseInt(listJson.pagination?.total || listJson.total || '1', 10);
  179 |       if (totalPages > 1) {
  180 |         const lastResp = await this.safeGet(
  181 |           `${this.apiBase}/employees?page=${totalPages}&pageSize=100&${this.params}`, { headers: h });
  182 |         if (lastResp.ok()) {
  183 |           const lastJson = await lastResp.json();
  184 |           const lastList = lastJson.data || lastJson.items || [];
  185 |           found = lastList.find((e: any) => e.id === id);
  186 |           if (found) return found;
  187 |         }
  188 |       }
  189 |     }
  190 |     throw new Error(`Get employee failed: ${resp.status()}`);
  191 |   }
  192 | 
  193 |   async listTimesheets(pageSize = 10): Promise<any[]> {
  194 |     const h = await this.headers();
  195 |     const resp = await this.safeGet(
  196 |       `${this.apiBase}/timesheets?page=1&pageSize=${pageSize}&${this.params}`, { headers: h });
  197 |     if (!resp.ok()) throw new Error(`List timesheets failed: ${resp.status()}`);
  198 |     return (await resp.json()).data || [];
  199 |   }
  200 | 
  201 |   async createTimesheet(employeeId: string, date: string, hours: number, description = 'Audit Timesheet'): Promise<any> {
  202 |     const h = await this.headers();
  203 |     const resp = await this.page.request.post(
  204 |       `${this.apiBase}/timesheets?${this.params}`,
  205 |       { headers: h, data: { employee_id: employeeId, date, hours, description }, timeout: 30000 }
  206 |     );
  207 |     if (!resp.ok()) throw new Error(`Create timesheet failed: ${resp.status()} - ${await resp.text()}`);
  208 |     return resp.json();
  209 |   }
  210 | 
  211 |   async listLeaveApplications(pageSize = 10): Promise<any[]> {
  212 |     const h = await this.headers();
  213 |     const resp = await this.safeGet(
  214 |       `${this.apiBase}/leave-applications?page=1&pageSize=${pageSize}&${this.params}`, { headers: h });
  215 |     if (!resp.ok()) throw new Error(`List leave-applications failed: ${resp.status()}`);
  216 |     return (await resp.json()).data || [];
  217 |   }
  218 | 
  219 |   async listPayrollRuns(pageSize = 10): Promise<any[]> {
  220 |     const h = await this.headers();
  221 |     const resp = await this.safeGet(
  222 |       `${this.apiBase}/payroll-runs?page=1&pageSize=${pageSize}&${this.params}`, { headers: h });
  223 |     if (!resp.ok()) throw new Error(`List payroll-runs failed: ${resp.status()}`);
  224 |     return (await resp.json()).data || [];
  225 |   }
  226 | 
  227 |   async createPayrollRun(name: string, startDate: string, endDate: string, payDate: string): Promise<any> {
  228 |     const h = await this.headers();
  229 |     const resp = await this.page.request.post(
  230 |       `${this.apiBase}/payroll-runs?${this.params}`,
  231 |       { headers: h, data: { event_name: name, start_date: startDate, end_date: endDate, pay_date: payDate }, timeout: 30000 }
  232 |     );
  233 |     if (!resp.ok()) throw new Error(`Create payroll-run failed: ${resp.status()} - ${await resp.text()}`);
  234 |     return resp.json();
  235 |   }
  236 | 
  237 |   async getPayrollRun(id: string): Promise<any> {
  238 |     const h = await this.headers();
  239 |     const resp = await this.safeGet(
  240 |       `${this.apiBase}/payroll-runs/${id}?${this.params}`, { headers: h });
  241 |     if (!resp.ok()) throw new Error(`Get payroll-run failed: ${resp.status()}`);
  242 |     return resp.json();
  243 |   }
  244 | 
  245 |   async listPayComponents(pageSize = 10): Promise<any[]> {
  246 |     const h = await this.headers();
  247 |     const resp = await this.safeGet(
  248 |       `${this.apiBase}/pay-components?page=1&pageSize=${pageSize}&${this.params}`, { headers: h });
  249 |     if (!resp.ok()) throw new Error(`List pay-components failed: ${resp.status()}`);
  250 |     return (await resp.json()).data || [];
  251 |   }
  252 | 
  253 |   async createPayComponent(name: string, type: string, taxRule: string, abbreviation: string, glAccountId: string): Promise<any> {
  254 |     const h = await this.headers();
  255 |     const resp = await this.page.request.post(
  256 |       `${this.apiBase}/pay-components?${this.params}`,
  257 |       { headers: h, data: { name, type, tax_rule: taxRule, abbreviation, general_ledger_account_id: glAccountId }, timeout: 30000 }
  258 |     );
  259 |     if (!resp.ok()) throw new Error(`Create pay-component failed: ${resp.status()} - ${await resp.text()}`);
  260 |     return resp.json();
  261 |   }
  262 | 
  263 |   async getOrgChart(): Promise<any> {
  264 |     const h = await this.headers();
  265 |     const resp = await this.safeGet(
  266 |       `${this.apiBase}/organization-chart?${this.params}`, { headers: h });
> 267 |     if (!resp.ok()) throw new Error(`Get org-chart failed: ${resp.status()}`);
      |                           ^ Error: Get org-chart failed: 400
  268 |     return resp.json();
  269 |   }
  270 | 
  271 |   async listDepartments(pageSize = 10): Promise<any[]> {
  272 |     const h = await this.headers();
  273 |     const resp = await this.safeGet(
  274 |       `${this.apiBase}/departments?page=1&pageSize=${pageSize}&${this.params}`, { headers: h });
  275 |     if (!resp.ok()) throw new Error(`List departments failed: ${resp.status()}`);
  276 |     return (await resp.json()).data || [];
  277 |   }
  278 | 
  279 |   async ensureDepartment(name: string = 'Automation Department'): Promise<{ id: string; name: string; configId: string; levelId: string }> {
  280 |     const existing = await this.listDepartments(50);
  281 |     const h = await this.headers();
  282 | 
  283 |     // If a non-ROOT child department already exists, prefer it for contracts
  284 |     const childDept = existing.find((d: any) => d.parent_id !== null);
  285 |     if (childDept) return { id: childDept.id, name: childDept.name, configId: childDept.config_id, levelId: childDept.hierarchy_level_id };
  286 | 
  287 |     // Fall back to ROOT if it's the only one and has a config
  288 |     const rootDept = existing.find((d: any) => d.parent_id === null) || existing[0];
  289 | 
  290 |     // Fetch config to get child hierarchy levels
  291 |     if (rootDept?.config_id) {
  292 |       const cfgResp = await this.safeGet(
  293 |         `${this.apiBase}/departments/configs/${rootDept.config_id}?${this.params}`, { headers: h });
  294 |       if (cfgResp.ok()) {
  295 |         const cfg = await cfgResp.json();
  296 |         const levels: any[] = cfg.hierarchy_levels || [];
  297 |         // Find the first child level (level > 1) that allows children or is a leaf
  298 |         const childLevel = levels.find((l: any) => l.level > 1 && l.parent_id === rootDept.hierarchy_level_id)
  299 |           || levels.find((l: any) => l.level > 1)
  300 |           || levels[1];
  301 | 
  302 |         if (childLevel) {
  303 |           const ts = Date.now().toString().slice(-6);
  304 |           const createResp = await this.page.request.post(
  305 |             `${this.apiBase}/departments?${this.params}`,
  306 |             { headers: h, timeout: 30000, data: {
  307 |               name,
  308 |               code: `AUTO-${ts}`,
  309 |               config_id: rootDept.config_id,
  310 |               hierarchy_level_id: childLevel.id,
  311 |               parent_id: rootDept.id,
  312 |               description: 'Auto-created by E2E suite'
  313 |             }}
  314 |           );
  315 |           if (createResp.ok()) {
  316 |             const created = await createResp.json();
  317 |             if (created?.id) {
  318 |               console.log(`[HR] Created child department: "${created.name}" (${created.id})`);
  319 |               return { id: created.id, name: created.name, configId: rootDept.config_id, levelId: childLevel.id };
  320 |             }
  321 |           }
  322 |           const errText = await createResp.text().catch(() => '');
  323 |           console.log(`[HR] Child dept creation failed (${createResp.status()}): ${errText.slice(0, 120)}`);
  324 |         }
  325 |       }
  326 |     }
  327 | 
  328 |     // Last resort: return ROOT as-is
  329 |     if (rootDept) return { id: rootDept.id, name: rootDept.name, configId: rootDept.config_id, levelId: rootDept.hierarchy_level_id };
  330 | 
  331 |     throw new Error('[HR_SETUP] No departments found. HR org structure not configured in this environment.');
  332 |   }
  333 | 
  334 |   /**
  335 |    * Ensures a job position exists in the given department.
  336 |    * If none are found, creates one via API so subsequent tests always have a valid jobPositionId.
  337 |    */
  338 |   async ensureJobPosition(departmentId: string, title: string = 'Audit Engineer'): Promise<{ id: string; title: string }> {
  339 |     const h = await this.headers();
  340 |     const listResp = await this.safeGet(
  341 |       `${this.apiBase}/job-positions?page=1&pageSize=100&${this.params}`, { headers: h });
  342 |     if (listResp.ok()) {
  343 |       const all = (await listResp.json()).data || [];
  344 |       const deptJobs = all.filter((j: any) => j.department_id === departmentId && j.id);
  345 |       if (deptJobs.length > 0) {
  346 |         // Find a position with available capacity
  347 |         const available = deptJobs.find((j: any) => {
  348 |           const filled = j.filled_slots ?? 0;
  349 |           const slots = j.slot_count ?? 0;
  350 |           return slots > 0 && filled < slots;
  351 |         });
  352 | 
  353 |         if (available) {
  354 |           console.log(`[HR] Using job position: "${available.title}" (${available.id}) | filled: ${available.filled_slots}/${available.slot_count}`);
  355 |           return { id: available.id, title: available.title };
  356 |         }
  357 | 
  358 |         // All existing positions are full (filled >= 100) — fall through to create a new one
  359 |         console.log(`[HR] All job positions for dept ${departmentId} are full. Creating new one...`);
  360 |       }
  361 |     }
  362 | 
  363 |     // None found for this department — create one
  364 |     const ts = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  365 |     const createResp = await this.page.request.post(
  366 |       `${this.apiBase}/job-positions?${this.params}`,
  367 |       { headers: h, timeout: 30000, data: {
```