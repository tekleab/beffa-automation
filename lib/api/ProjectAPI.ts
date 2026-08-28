import { Page } from '@playwright/test';
import { BasePage } from '../base-page';

export interface ProjectMeta {
    customerId: string;
    customerName: string;
    workspaceId: string;
    workspaceName: string;
}

export interface ProjectRecord {
    id: string;
    ref: string;
    name: string;
    status: string;
    estimatedRevenue: number;
    estimatedExpense: number;
    remainingBalance: number;
    percentComplete: number;
}

export class ProjectAPI extends BasePage {
    constructor(page: Page) {

        super(page);
    }

    private get qs(): string {
        const y = process.env.BEFFA_YEAR || '2019';
        const p = process.env.BEFFA_PERIOD || 'yearly';
        const c = process.env.BEFFA_CALENDAR || 'ec';
        return `year=${y}&period=${p}&calendar=${c}`;
    }

    private async h(): Promise<Record<string, string>> {
        let token = await this._getAuthToken();
        // Re-login via API if token is missing — use context-level request which works
        // even when the page is on about:blank (page.request fails with status 0 in that state)
        if (!token) {
            try {
                const y = process.env.BEFFA_YEAR || '2019';
                const loginResp = await this.page.context().request.post(
                    `${this.apiBase}/users/login?year=${y}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}&month=6`,
                    { data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS }, headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
                );
                if (loginResp.ok()) {
                    const d = await loginResp.json();
                    token = d.auth_token || d.token || null;
                }
            } catch { /* ignore */ }
        }
        return {
            'x-company': process.env.BEFFA_COMPANY as string,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    async discoverMetadataAPI(): Promise<ProjectMeta> {
        const headers = await this.h();
        // Use context-level request — works on about:blank; page.request fails with status 0
        const req = this.page.context().request;

        // Customer
        const custResp = await req.get(`${this.apiBase}/customers?page=1&pageSize=5&${this.qs}`, { headers, timeout: 30000 });
        if (!custResp.ok()) throw new Error(`[ProjectAPI] Customer discovery failed: ${custResp.status()}`);
        const custData = await custResp.json();
        const customer = (custData.items || custData.data || [])[0];
        if (!customer) throw new Error('[ProjectAPI] No customers found.');

        // Workspace — auto-create if none exist
        const wsResp = await req.get(`${this.apiBase}/workspaces?page=1&pageSize=5&${this.qs}`, { headers, timeout: 30000 });
        let workspace: { id: string; name: string } | null = null;
        if (wsResp.ok()) {
            const wsData = await wsResp.json();
            workspace = (wsData.items || wsData.data || [])[0] || null;
        }
        if (!workspace) {
            const createResp = await req.post(`${this.apiBase}/workspaces?${this.qs}`, {
                data: { name: 'Default Workspace' }, headers, timeout: 30000
            });
            if (!createResp.ok()) throw new Error(`[ProjectAPI] Workspace creation failed: ${createResp.status()} ${await createResp.text()}`);
            workspace = await createResp.json();
        }

        return {
            customerId: customer.id,
            customerName: customer.name,
            workspaceId: workspace!.id,
            workspaceName: workspace!.name
        };
    }

    async createProjectAPI(data: {
        name: string;
        customerId: string;
        estimatedRevenue?: number;
        estimatedExpense?: number;
        startDate?: string;
        endDate?: string;
        completionMethod?: string;
        description?: string;
    }): Promise<ProjectRecord> {
        const headers = await this.h();
        const { DateHelper: _DH } = require('../utils/DateHelper');
        const _cached = _DH._cached?.iso || new Date().toISOString().split('T')[0] + 'T00:00:00Z';
        const today = _cached;
        const nextYear = new Date(new Date(_cached).getTime() + 365 * 86400000).toISOString().split('T')[0] + 'T00:00:00Z';

        let projectName = data.name;
        for (let attempt = 1; attempt <= 3; attempt++) {
            const payload = {
                project_name: projectName,
                customer_id: data.customerId,
                project_start_date: data.startDate || today,
                estimated_end_date: data.endDate || nextYear,
                estimated_revenue: data.estimatedRevenue ?? 100000,
                estimated_expense: data.estimatedExpense ?? 50000,
                completion_method: data.completionMethod || 'manual',
                project_status: 'pending',
                description: data.description || ''
            };

            const resp = await this.safePost(`${this.apiBase}/projects?${this.qs}`, {
                data: payload, headers, label: `Create Project (Attempt ${attempt})`
            });

            if (resp.ok()) {
                const json = await resp.json();
                return this._mapProject(json);
            }

            const errorText = await resp.text();
            if (errorText.includes('unique_proj_company') || errorText.includes('duplicate key value') || resp.status() === 400) {
                if (attempt < 3) {
                    projectName = `${data.name}-${process.hrtime.bigint().toString().slice(-6)}-${Math.floor(Math.random() * 90000 + 10000)}`;
                    console.warn(`[WARN] Project name collision on attempt ${attempt}. Retrying with unique name: ${projectName}`);
                    await new Promise(r => setTimeout(r, 500 * attempt));
                    continue;
                }
            }

            throw new Error(`Create Project failed: ${resp.status()} - ${errorText}`);
        }
        throw new Error('Create Project failed after retries.');
    }

    async getProjectAPI(projectId: string): Promise<any> {
        const headers = await this.h();
        const resp = await this.safeGet(`${this.apiBase}/project/${projectId}?${this.qs}`, { headers });
        if (!resp.ok()) throw new Error(`Get Project failed: ${resp.status()}`);
        return await resp.json();
    }

    async listProjectsAPI(filters: Record<string, string> = {}): Promise<any[]> {
        const headers = await this.h();
        const extra = Object.entries(filters).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
        const url = `${this.apiBase}/projects?page=1&pageSize=50&${this.qs}${extra ? '&' + extra : ''}`;
        const resp = await this.safeGet(url, { headers });
        if (!resp.ok()) return [];
        const json = await resp.json();
        return json.items || json.data || [];
    }

    async updateProjectAPI(projectId: string, data: Record<string, any>): Promise<ProjectRecord> {
        const headers = await this.h();
        const resp = await this.page.request.patch(`${this.apiBase}/project/${projectId}?${this.qs}`, {
            data, headers
        });
        if (!resp.ok()) throw new Error(`Update Project failed: ${resp.status()} - ${await resp.text()}`);
        return this._mapProject(await resp.json());
    }

    async setProjectStatusAPI(projectId: string, status: 'pending' | 'in-progress' | 'completed'): Promise<ProjectRecord> {
        return await this.updateProjectAPI(projectId, { project_status: status });
    }

    private _mapProject(json: any): ProjectRecord {
        return {
            id: json.id,
            ref: json.ref || json.id,
            name: json.project_name,
            status: json.project_status,
            estimatedRevenue: parseFloat(json.estimated_revenue ?? 0),
            estimatedExpense: parseFloat(json.estimated_expense ?? 0),
            remainingBalance: parseFloat(json.remaining_balance ?? 0),
            percentComplete: parseFloat(json.percent_complete ?? 0)
        };
    }
}
