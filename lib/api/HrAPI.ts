import { Page } from '@playwright/test';
import { BasePage } from '../base-page';

export class HrAPI extends BasePage {
  constructor(page: Page) {

    super(page);
  }

  private get params() {
    const y = process.env.BEFFA_YEAR || '2019';
    const p = process.env.BEFFA_PERIOD || 'yearly';
    const c = process.env.BEFFA_CALENDAR || 'ec';
    return `year=${y}&period=${p}&calendar=${c}`;
  }

  private async headers() {
    // Always re-login if token is missing or expired (< 60s remaining)
    let token = await this._getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
        if (expiresIn < 60) {
          console.log(`[HR] Token expires in ${expiresIn}s — refreshing session...`);
          token = null; // Force re-login below
        }
      } catch { token = null; }
    }
    if (!token) {
      try {
        const loginUrl = `${this.apiBase}/users/login?year=2018&period=yearly&calendar=ec&month=6`;
        const loginResp = await this.page.request.post(loginUrl, {
          data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        });
        if (loginResp.ok()) {
          const d = await loginResp.json();
          const newToken = d.auth_token || d.token;
          if (newToken) {
            await this.page.evaluate((t) => {
              localStorage.setItem('token', t);
              localStorage.setItem('auth-token', t);
            }, newToken);
            token = newToken;
          }
        }
      } catch (e: any) {
        console.log(`[HR] Re-auth failed: ${e.message}`);
      }
      token = token || await this._getAuthToken();
    }
    return {
      'Authorization': `Bearer ${token}`,
      'x-company': process.env.BEFFA_COMPANY as string,
      'Content-Type': 'application/json',
    };
  }

  async createEmployee(data: Record<string, any>): Promise<any> {
    const h = await this.headers();
    let resp: any;
    let text = '';
    for (let attempt = 1; attempt <= 3; attempt++) {
      resp = await this.page.request.post(
        `${this.apiBase}/employees?${this.params}`, { headers: h, data, timeout: 30000 }
      );
      text = await resp.text();
      if (resp.ok() || resp.status() !== 500) break;
      console.warn(`[HR] createEmployee attempt ${attempt} returned 500. Retrying in ${attempt * 2000}ms...`);
      await this.page.waitForTimeout(attempt * 2000);
    }
    if (!resp.ok()) throw new Error(`Create employee failed: ${resp.status()} - ${text}`);

    // Try to parse direct response first
    if (text && text.trim() !== 'null' && text.trim() !== '') {
      try {
        const parsed = JSON.parse(text);
        if (parsed?.id) return parsed;
        if (parsed?.data?.id) return parsed.data;
        if (parsed?.employee?.id) return parsed.employee;
        if (Array.isArray(parsed?.data) && parsed.data[0]?.id) return parsed.data[0];
      } catch {}
    }

    // Fallback: search by email with retries — backend may not index instantly
    const email = data.email as string;
    const name = data.name as string;
    // Initial wait — backend creates the record async after returning null
    await this.page.waitForTimeout(4000);
    for (let attempt = 0; attempt < 7; attempt++) {
      // Try direct email search first (faster than full list scan)
      const emailResp = await this.safeGet(
        `${this.apiBase}/employees?page=1&pageSize=10&search=${encodeURIComponent(email)}&${this.params}`, { headers: h });
      if (emailResp.ok()) {
        const emailList = (await emailResp.json()).data || [];
        const byEmail = emailList.find((e: any) => e.email === email);
        if (byEmail) return byEmail;
      }
      // Fallback: search page 1 and last page (since newly created employees are appended at the end of the database)
      const listResp = await this.safeGet(
        `${this.apiBase}/employees?page=1&pageSize=100&${this.params}`, { headers: h });
      if (listResp.ok()) {
        const listJson = await listResp.json();
        const list = listJson.data || listJson.items || (Array.isArray(listJson) ? listJson : []);
        const totalPages = parseInt(listJson.pagination?.total || listJson.total || '1', 10);
        console.log(`[HR] Attempt ${attempt + 1}: list total pages=${totalPages} | checking ${list.length} rows for email=${email}`);
        let found = list.find((e: any) => e.email === email)
          || list.find((e: any) => e.name === name || e.full_name === name
            || (e.full_name || '').toLowerCase().includes(name.toLowerCase())
            || (e.name || '').toLowerCase().includes(name.toLowerCase()));
        
        if (!found && totalPages > 1) {
          console.log(`[HR] Fetching last page ${totalPages} for newly appended employee...`);
          const lastResp = await this.safeGet(
            `${this.apiBase}/employees?page=${totalPages}&pageSize=100&${this.params}`, { headers: h });
          if (lastResp.ok()) {
            const lastJson = await lastResp.json();
            const lastList = lastJson.data || lastJson.items || [];
            found = lastList.find((e: any) => e.email === email)
              || lastList.find((e: any) => e.name === name || e.full_name === name
                || (e.full_name || '').toLowerCase().includes(name.toLowerCase())
                || (e.name || '').toLowerCase().includes(name.toLowerCase()));
          }
        }
        if (found) return found;
      }
      await this.page.waitForTimeout(3000);
    }
    throw new Error(`Create employee: could not retrieve created employee "${name}" - response: ${text.slice(0, 200)}`);
  }

  async createPayStructure(name: string, description = ''): Promise<any> {
    const h = await this.headers();
    const resp = await this.page.request.post(
      `${this.apiBase}/pay-structures?${this.params}`,
      { headers: h, data: { name, description }, timeout: 30000 }
    );
    if (!resp.ok()) throw new Error(`Create pay-structure failed: ${resp.status()} - ${await resp.text()}`);
    return resp.json();
  }

  async listEmployees(pageSize = 10): Promise<any[]> {
    const h = await this.headers();
    const resp = await this.safeGet(
      `${this.apiBase}/employees?page=1&pageSize=${pageSize}&${this.params}`, { headers: h });
    if (!resp.ok()) throw new Error(`List employees failed: ${resp.status()}`);
    return (await resp.json()).data || [];
  }

  async getEmployee(id: string): Promise<any> {
    const h = await this.headers();
    let resp = await this.safeGet(
      `${this.apiBase}/employees/${id}?${this.params}`, { headers: h });
    if (!resp.ok() && resp.status() === 404) {
      resp = await this.safeGet(
        `${this.apiBase}/employee/${id}?${this.params}`, { headers: h });
    }
    if (resp.ok()) {
      const json = await resp.json();
      return json.data || json.employee || json;
    }
    // Fallback: list scan (check page 1 and last page)
    const listResp = await this.safeGet(
      `${this.apiBase}/employees?page=1&pageSize=100&${this.params}`, { headers: h });
    if (listResp.ok()) {
      const listJson = await listResp.json();
      const list = listJson.data || listJson.items || [];
      let found = list.find((e: any) => e.id === id);
      if (found) return found;

      const totalPages = parseInt(listJson.pagination?.total || listJson.total || '1', 10);
      if (totalPages > 1) {
        const lastResp = await this.safeGet(
          `${this.apiBase}/employees?page=${totalPages}&pageSize=100&${this.params}`, { headers: h });
        if (lastResp.ok()) {
          const lastJson = await lastResp.json();
          const lastList = lastJson.data || lastJson.items || [];
          found = lastList.find((e: any) => e.id === id);
          if (found) return found;
        }
      }
    }
    throw new Error(`Get employee failed: ${resp.status()}`);
  }

  async listTimesheets(pageSize = 10): Promise<any[]> {
    const h = await this.headers();
    const resp = await this.safeGet(
      `${this.apiBase}/timesheets?page=1&pageSize=${pageSize}&${this.params}`, { headers: h });
    if (!resp.ok()) throw new Error(`List timesheets failed: ${resp.status()}`);
    return (await resp.json()).data || [];
  }

  async createTimesheet(employeeId: string, date: string, hours: number, description = 'Audit Timesheet'): Promise<any> {
    const h = await this.headers();
    const resp = await this.page.request.post(
      `${this.apiBase}/timesheets?${this.params}`,
      { headers: h, data: { employee_id: employeeId, date, hours, description }, timeout: 30000 }
    );
    if (!resp.ok()) throw new Error(`Create timesheet failed: ${resp.status()} - ${await resp.text()}`);
    return resp.json();
  }

  async listLeaveApplications(pageSize = 10): Promise<any[]> {
    const h = await this.headers();
    const resp = await this.safeGet(
      `${this.apiBase}/leave-applications?page=1&pageSize=${pageSize}&${this.params}`, { headers: h });
    if (!resp.ok()) throw new Error(`List leave-applications failed: ${resp.status()}`);
    return (await resp.json()).data || [];
  }

  async listPayrollRuns(pageSize = 10): Promise<any[]> {
    const h = await this.headers();
    const resp = await this.safeGet(
      `${this.apiBase}/payroll-runs?page=1&pageSize=${pageSize}&${this.params}`, { headers: h });
    if (!resp.ok()) throw new Error(`List payroll-runs failed: ${resp.status()}`);
    return (await resp.json()).data || [];
  }

  async createPayrollRun(name: string, startDate: string, endDate: string, payDate: string): Promise<any> {
    const h = await this.headers();
    const resp = await this.page.request.post(
      `${this.apiBase}/payroll-runs?${this.params}`,
      { headers: h, data: { event_name: name, start_date: startDate, end_date: endDate, pay_date: payDate }, timeout: 30000 }
    );
    if (!resp.ok()) throw new Error(`Create payroll-run failed: ${resp.status()} - ${await resp.text()}`);
    return resp.json();
  }

  async getPayrollRun(id: string): Promise<any> {
    const h = await this.headers();
    const resp = await this.safeGet(
      `${this.apiBase}/payroll-runs/${id}?${this.params}`, { headers: h });
    if (!resp.ok()) throw new Error(`Get payroll-run failed: ${resp.status()}`);
    return resp.json();
  }

  async listPayComponents(pageSize = 10): Promise<any[]> {
    const h = await this.headers();
    const resp = await this.safeGet(
      `${this.apiBase}/pay-components?page=1&pageSize=${pageSize}&${this.params}`, { headers: h });
    if (!resp.ok()) throw new Error(`List pay-components failed: ${resp.status()}`);
    return (await resp.json()).data || [];
  }

  async createPayComponent(name: string, type: string, taxRule: string, abbreviation: string, glAccountId: string): Promise<any> {
    const h = await this.headers();
    const resp = await this.page.request.post(
      `${this.apiBase}/pay-components?${this.params}`,
      { headers: h, data: { name, type, tax_rule: taxRule, abbreviation, general_ledger_account_id: glAccountId }, timeout: 30000 }
    );
    if (!resp.ok()) throw new Error(`Create pay-component failed: ${resp.status()} - ${await resp.text()}`);
    return resp.json();
  }

  async getOrgChart(): Promise<any> {
    const h = await this.headers();
    const resp = await this.safeGet(
      `${this.apiBase}/organization-chart?${this.params}`, { headers: h });
    if (!resp.ok()) throw new Error(`Get org-chart failed: ${resp.status()}`);
    return resp.json();
  }

  async listDepartments(pageSize = 10): Promise<any[]> {
    const h = await this.headers();
    const resp = await this.safeGet(
      `${this.apiBase}/departments?page=1&pageSize=${pageSize}&${this.params}`, { headers: h });
    if (!resp.ok()) throw new Error(`List departments failed: ${resp.status()}`);
    return (await resp.json()).data || [];
  }

  async ensureDepartment(name: string = 'Automation Department'): Promise<{ id: string; name: string; configId: string; levelId: string }> {
    const existing = await this.listDepartments(50);
    const h = await this.headers();

    // If a non-ROOT child department already exists, prefer it for contracts
    const childDept = existing.find((d: any) => d.parent_id !== null);
    if (childDept) return { id: childDept.id, name: childDept.name, configId: childDept.config_id, levelId: childDept.hierarchy_level_id };

    // Fall back to ROOT if it's the only one and has a config
    const rootDept = existing.find((d: any) => d.parent_id === null) || existing[0];

    // Fetch config to get child hierarchy levels
    if (rootDept?.config_id) {
      const cfgResp = await this.safeGet(
        `${this.apiBase}/departments/configs/${rootDept.config_id}?${this.params}`, { headers: h });
      if (cfgResp.ok()) {
        const cfg = await cfgResp.json();
        const levels: any[] = cfg.hierarchy_levels || [];
        // Find the first child level (level > 1) that allows children or is a leaf
        const childLevel = levels.find((l: any) => l.level > 1 && l.parent_id === rootDept.hierarchy_level_id)
          || levels.find((l: any) => l.level > 1)
          || levels[1];

        if (childLevel) {
          const ts = Date.now().toString().slice(-6);
          const createResp = await this.page.request.post(
            `${this.apiBase}/departments?${this.params}`,
            { headers: h, timeout: 30000, data: {
              name,
              code: `AUTO-${ts}`,
              config_id: rootDept.config_id,
              hierarchy_level_id: childLevel.id,
              parent_id: rootDept.id,
              description: 'Auto-created by E2E suite'
            }}
          );
          if (createResp.ok()) {
            const created = await createResp.json();
            if (created?.id) {
              console.log(`[HR] Created child department: "${created.name}" (${created.id})`);
              return { id: created.id, name: created.name, configId: rootDept.config_id, levelId: childLevel.id };
            }
          }
          const errText = await createResp.text().catch(() => '');
          console.log(`[HR] Child dept creation failed (${createResp.status()}): ${errText.slice(0, 120)}`);
        }
      }
    }

    // Last resort: return ROOT as-is
    if (rootDept) return { id: rootDept.id, name: rootDept.name, configId: rootDept.config_id, levelId: rootDept.hierarchy_level_id };

    throw new Error('[HR_SETUP] No departments found. HR org structure not configured in this environment.');
  }

  /**
   * Ensures a job position exists in the given department.
   * If none are found, creates one via API so subsequent tests always have a valid jobPositionId.
   */
  async ensureJobPosition(departmentId: string, title: string = 'Audit Engineer'): Promise<{ id: string; title: string }> {
    const h = await this.headers();
    const listResp = await this.safeGet(
      `${this.apiBase}/job-positions?page=1&pageSize=100&${this.params}`, { headers: h });
    if (listResp.ok()) {
      const all = (await listResp.json()).data || [];
      const deptJobs = all.filter((j: any) => j.department_id === departmentId && j.id);
      if (deptJobs.length > 0) {
        // Find a position with available capacity
        const available = deptJobs.find((j: any) => {
          const filled = j.filled_slots ?? 0;
          const slots = j.slot_count ?? 0;
          return slots > 0 && filled < slots;
        });

        if (available) {
          console.log(`[HR] Using job position: "${available.title}" (${available.id}) | filled: ${available.filled_slots}/${available.slot_count}`);
          return { id: available.id, title: available.title };
        }

        // All existing positions are full (filled >= 100) — fall through to create a new one
        console.log(`[HR] All job positions for dept ${departmentId} are full. Creating new one...`);
      }
    }

    // None found for this department — create one
    const ts = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const createResp = await this.page.request.post(
      `${this.apiBase}/job-positions?${this.params}`,
      { headers: h, timeout: 30000, data: {
        title,
        code: `JP-${ts}`,
        department_id: departmentId,
        min_salary: 0,
        max_salary: 100000,
        slot_count: 100,
        description: 'Auto-created by E2E suite',
        requirements: 'Auto-created',
        responsibilities: 'Auto-created',
        job_grade: 'G1',
        pay_grade: 'E0'
      }}
    );
    if (createResp.ok()) {
      const created = await createResp.json();
      if (!created.id) throw new Error(`Job position created but no ID returned: ${JSON.stringify(created).slice(0, 200)}`);
      console.log(`[HR] Created job position: "${created.title}" (${created.id}) | dept: ${departmentId}`);
      return { id: created.id, title: created.title };
    }
    // If creation failed for any reason (e.g. 500, 409, 422), attempt to re-fetch and fallback to existing position
    console.log(`[HR] Job position creation returned ${createResp.status()} — re-fetching existing positions for dept ${departmentId}`);
    const retry = await this.safeGet(`${this.apiBase}/job-positions?page=1&pageSize=100&${this.params}`, { headers: h });
    if (retry.ok()) {
      const all = (await retry.json()).data || [];
      const deptMatches = all.filter((j: any) => j.department_id === departmentId && j.id);
      if (deptMatches.length > 0) {
        const fresh = deptMatches.find((j: any) => (j.filled_slots ?? 0) < (j.slot_count ?? 0)) || deptMatches[0];
        console.log(`[HR] Using existing job position for dept: "${fresh.title}" (${fresh.id})`);
        return { id: fresh.id, title: fresh.title };
      }
      // Return any available position across system
      const any = all.find((j: any) => j.id);
      if (any) {
        console.log(`[HR] Fallback: using any available job position "${any.title}" (${any.id})`);
        return { id: any.id, title: any.title };
      }
    }
    const errText = await createResp.text().catch(() => '');
    throw new Error(`Failed to create job position for dept ${departmentId}: ${createResp.status()} - ${errText.slice(0, 200)}`);
  }

  async discoverMetadataAPI(): Promise<{ employeeId: string; glAccountId: string; departmentId: string; departmentName: string; jobPositionId: string; jobPositionTitle: string } | null> {
    const [employees, accounts] = await Promise.all([
      this.listEmployees(10),
      this.safeGet(`${this.apiBase}/accounts?page=1&pageSize=50&${this.params}`, { headers: await this.headers() })
        .then(r => r.json()).then(d => d.items || d.data || []),
    ]);

    const employee = employees[0];
    if (!employee) throw new Error('HR Metadata: No employees found');
    const glAccount = accounts[0];
    if (!glAccount) throw new Error('HR Metadata: No GL accounts found');

    let targetDept: any;
    try {
      const depts = await this.listDepartments(20);
      const preferred = depts.find((d: any) => /finance.*purchase|purchase.*finance/i.test(d.name));
      const rawTarget = preferred || depts[0];
      targetDept = rawTarget ?? await this.ensureDepartment();
    } catch (e: any) {
      if (e.message.includes('HR_SETUP')) {
        console.log('[HR_SETUP] No departments configured — HR tests will be skipped');
        return null;
      }
      throw e;
    }

    const job = await this.ensureJobPosition(targetDept.id);

    return {
      employeeId: employee.id,
      glAccountId: glAccount.id,
      departmentId: targetDept.id,
      departmentName: targetDept.name,
      jobPositionId: job.id,
      jobPositionTitle: job.title,
    };
  }
}
