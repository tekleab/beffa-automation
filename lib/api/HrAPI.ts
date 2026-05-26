import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

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
    const token = await this._getAuthToken();
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
    try { return JSON.parse(text); } catch { throw new Error(`Create employee: invalid JSON - ${text.slice(0, 200)}`); }
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
    const resp = await this.page.request.get(
      `${this.apiBase}/employees?page=1&pageSize=${pageSize}&${this.params}`, { headers: h }
    );
    if (!resp.ok()) throw new Error(`List employees failed: ${resp.status()}`);
    return (await resp.json()).data || [];
  }

  async getEmployee(id: string): Promise<any> {
    const h = await this.headers();
    const resp = await this.page.request.get(
      `${this.apiBase}/employees/${id}?${this.params}`, { headers: h }
    );
    if (!resp.ok()) throw new Error(`Get employee failed: ${resp.status()}`);
    return resp.json();
  }

  async listTimesheets(pageSize = 10): Promise<any[]> {
    const h = await this.headers();
    const resp = await this.page.request.get(
      `${this.apiBase}/timesheets?page=1&pageSize=${pageSize}&${this.params}`, { headers: h }
    );
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
    const resp = await this.page.request.get(
      `${this.apiBase}/leave-applications?page=1&pageSize=${pageSize}&${this.params}`, { headers: h }
    );
    if (!resp.ok()) throw new Error(`List leave-applications failed: ${resp.status()}`);
    return (await resp.json()).data || [];
  }

  async listPayrollRuns(pageSize = 10): Promise<any[]> {
    const h = await this.headers();
    const resp = await this.page.request.get(
      `${this.apiBase}/payroll-runs?page=1&pageSize=${pageSize}&${this.params}`, { headers: h }
    );
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
    const resp = await this.page.request.get(
      `${this.apiBase}/payroll-runs/${id}?${this.params}`, { headers: h }
    );
    if (!resp.ok()) throw new Error(`Get payroll-run failed: ${resp.status()}`);
    return resp.json();
  }

  async listPayComponents(pageSize = 10): Promise<any[]> {
    const h = await this.headers();
    const resp = await this.page.request.get(
      `${this.apiBase}/pay-components?page=1&pageSize=${pageSize}&${this.params}`, { headers: h }
    );
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
    const resp = await this.page.request.get(
      `${this.apiBase}/organization-chart?${this.params}`, { headers: h }
    );
    if (!resp.ok()) throw new Error(`Get org-chart failed: ${resp.status()}`);
    return resp.json();
  }

  async listDepartments(pageSize = 10): Promise<any[]> {
    const h = await this.headers();
    const resp = await this.page.request.get(
      `${this.apiBase}/departments?page=1&pageSize=${pageSize}&${this.params}`, { headers: h }
    );
    if (!resp.ok()) throw new Error(`List departments failed: ${resp.status()}`);
    return (await resp.json()).data || [];
  }

  /**
   * Ensures a job position exists in the given department.
   * If none are found, creates one via API so subsequent tests always have a valid jobPositionId.
   */
  async ensureJobPosition(departmentId: string): Promise<{ id: string; title: string }> {
    const h = await this.headers();

    // 1. Check if any job positions already exist
    const listResp = await this.page.request.get(
      `${this.apiBase}/job-positions?page=1&pageSize=10&department_id=${departmentId}&${this.params}`,
      { headers: h }
    );
    if (listResp.ok()) {
      const jobs = (await listResp.json()).data || [];
      const existing = jobs.find((j: any) => j.id && j.title) || jobs[0];
      if (existing) {
        console.log(`[HR SETUP] Job position already exists: "${existing.title}" (${existing.id})`);
        return { id: existing.id, title: existing.title };
      }
    }

    // 2. None found — create one
    console.log(`[HR SETUP] No job positions in department ${departmentId}. Creating one...`);
    const createResp = await this.page.request.post(
      `${this.apiBase}/job-positions?${this.params}`,
      { headers: h, data: { title: 'Audit Engineer', department_id: departmentId } }
    );

    if (!createResp.ok()) {
      const text = await createResp.text();
      throw new Error(`Failed to create job position: ${createResp.status()} - ${text.slice(0, 200)}`);
    }

    const created = await createResp.json();
    console.log(`[HR SETUP] Job position created: "${created.title}" (${created.id})`);
    return { id: created.id, title: created.title };
  }

  async discoverMetadataAPI(): Promise<{ employeeId: string; glAccountId: string; departmentId: string; departmentName: string; jobPositionId: string; jobPositionTitle: string }> {
    const [employees, accounts] = await Promise.all([
      this.listEmployees(10),
      this.page.request.get(`${this.apiBase}/accounts?page=1&pageSize=50&${this.params}`, { headers: await this.headers() })
        .then(r => r.json()).then(d => d.items || d.data || []),
    ]);

    const employee = employees[0];
    if (!employee) throw new Error('HR Metadata: No employees found');
    const glAccount = accounts[0];
    if (!glAccount) throw new Error('HR Metadata: No GL accounts found');

    const depts = await this.listDepartments(20);
    const preferred = depts.find((d: any) => /finance.*purchase|purchase.*finance/i.test(d.name));
    const ordered = preferred ? [preferred, ...depts.filter((d: any) => d !== preferred)] : depts;
    const targetDept = ordered[0];

    // Always guarantee a job position exists — create one if the org chart has none
    const job = await this.ensureJobPosition(targetDept.id);

    console.log(`[HR META] dept="${targetDept.name}" (${targetDept.id}) | job="${job.title}" (${job.id})`);

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
