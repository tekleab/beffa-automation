import { Page } from '@playwright/test';
import { BasePage } from '../base-page';

export class HrAPI extends BasePage {
  _getAuthToken!: () => Promise<string | null>;

  constructor(page: Page) {
    super(page);
  }

  private get params() {
    const y = process.env.BEFFA_YEAR || '2018';
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
          headers: { 'Content-Type': 'application/json' }
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
    const resp = await this.page.request.post(
      `${this.apiBase}/employees?${this.params}`, { headers: h, data }
    );
    const text = await resp.text();
    if (!resp.ok()) throw new Error(`Create employee failed: ${resp.status()} - ${text}`);

    // Try to parse direct response first
    if (text && text.trim() !== 'null' && text.trim() !== '') {
      try {
        const parsed = JSON.parse(text);
        if (parsed?.id) return parsed;
      } catch {}
    }

    // Fallback: search by email with retries — backend may not index instantly
    const email = data.email as string;
    const name = data.name as string;
    for (let attempt = 0; attempt < 5; attempt++) {
      await this.page.waitForTimeout(2000);
      const listResp = await this.safeGet(
        `${this.apiBase}/employees?page=1&pageSize=100&sort=created_at:desc&${this.params}`, { headers: h });
      if (listResp.ok()) {
        const list = (await listResp.json()).data || [];
        const found = list.find((e: any) => e.email === email)
          || list.find((e: any) => e.name === name || e.full_name === name);
        if (found) return found;
      }
    }
    throw new Error(`Create employee: could not retrieve created employee "${name}" - response: ${text.slice(0, 200)}`);
  }

  async createPayStructure(name: string, description = ''): Promise<any> {
    const h = await this.headers();
    const resp = await this.page.request.post(
      `${this.apiBase}/pay-structures?${this.params}`,
      { headers: h, data: { name, description } }
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
    const resp = await this.safeGet(
      `${this.apiBase}/employees/${id}?${this.params}`, { headers: h });
    if (!resp.ok()) throw new Error(`Get employee failed: ${resp.status()}`);
    return resp.json();
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
      { headers: h, data: { employee_id: employeeId, date, hours, description } }
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
      { headers: h, data: { event_name: name, start_date: startDate, end_date: endDate, pay_date: payDate } }
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
      { headers: h, data: { name, type, tax_rule: taxRule, abbreviation, general_ledger_account_id: glAccountId } }
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
            { headers: h, data: {
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

    throw new Error('[HR] No departments found and could not create one. Set up org structure first.');
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
      // Only use job positions that belong to this exact department
      const deptJobs = all.filter((j: any) => j.department_id === departmentId && j.id);
      if (deptJobs.length > 0) {
        const match = deptJobs.find((j: any) => j.title?.toLowerCase().includes(title.toLowerCase())) || deptJobs[0];
        const filled = match.filled_slots ?? 0;
        const slots = match.slot_count ?? 0;
        if (slots === 0 || slots === 1 || filled >= slots) {
          console.log(`[HR] Job "${match.title}" slots exhausted (${filled}/${slots}). Expanding...`);
          await this.page.request.patch(
            `${this.apiBase}/job-positions/${match.id}?${this.params}`,
            { headers: h, data: { slot_count: filled + 100 } }
          );
        }
        console.log(`[HR] Using job position: "${match.title}" (${match.id}) | dept: ${departmentId}`);
        return { id: match.id, title: match.title };
      }
    }

    // None found for this department — create one
    const ts = Date.now().toString().slice(-6);
    const createResp = await this.page.request.post(
      `${this.apiBase}/job-positions?${this.params}`,
      { headers: h, data: {
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
    if (!createResp.ok()) {
      const errText = await createResp.text();
      throw new Error(`Failed to create job position for dept ${departmentId}: ${createResp.status()} - ${errText.slice(0, 200)}`);
    }
    const created = await createResp.json();
    if (!created.id) throw new Error(`Job position created but no ID returned: ${JSON.stringify(created).slice(0, 200)}`);
    console.log(`[HR] Created job position: "${created.title}" (${created.id}) | dept: ${departmentId}`);
    return { id: created.id, title: created.title };
  }

  async discoverMetadataAPI(): Promise<{ employeeId: string; glAccountId: string; departmentId: string; departmentName: string; jobPositionId: string; jobPositionTitle: string }> {
    const [employees, accounts] = await Promise.all([
      this.listEmployees(10),
      this.safeGet(`${this.apiBase}/accounts?page=1&pageSize=50&${this.params}`, { headers: await this.headers() })
        .then(r => r.json()).then(d => d.items || d.data || []),
    ]);

    const employee = employees[0];
    if (!employee) throw new Error('HR Metadata: No employees found');
    const glAccount = accounts[0];
    if (!glAccount) throw new Error('HR Metadata: No GL accounts found');

    // Always guarantee a department exists — create one if none configured
    const depts = await this.listDepartments(20);
    const preferred = depts.find((d: any) => /finance.*purchase|purchase.*finance/i.test(d.name));
    const rawTarget = preferred || depts[0];
    const targetDept = rawTarget ?? await this.ensureDepartment();

    // Always guarantee a job position exists — create one if the org chart has none
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
