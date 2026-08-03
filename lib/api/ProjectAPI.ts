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
    _getAuthToken!: () => Promise<string | null>;

    constructor(page: Page) {
        super(page);
    }

    private get qs(): string {
        const y = process.env.BEFFA_YEAR || '2018';
        const p = process.env.BEFFA_PERIOD || 'yearly';
        const c = process.env.BEFFA_CALENDAR || 'ec';
        return `year=${y}&period=${p}&calendar=${c}`;
    }

    private async h(): Promise<Record<string, string>> {
        const token = await this._getAuthToken();
        return {
            'x-company': process.env.BEFFA_COMPANY as string,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    async discoverMetadataAPI(): Promise<ProjectMeta> {
        const headers = await this.h();

        // Customer
        const custResp = await this.safeGet(`${this.apiBase}/customers?page=1&pageSize=5&${this.qs}`, { headers });
        if (!custResp.ok()) throw new Error(`[ProjectAPI] Customer discovery failed: ${custResp.status()}`);
        const custData = await custResp.json();
        const customer = (custData.items || custData.data || [])[0];
        if (!customer) throw new Error('[ProjectAPI] No customers found.');

        // Workspace — auto-create if none exist
        const wsResp = await this.safeGet(`${this.apiBase}/workspaces?page=1&pageSize=5&${this.qs}`, { headers });
        let workspace: { id: string; name: string } | null = null;
        if (wsResp.ok()) {
            const wsData = await wsResp.json();
            workspace = (wsData.items || wsData.data || [])[0] || null;
        }
        if (!workspace) {
            const createResp = await this.page.request.post(`${this.apiBase}/workspaces?${this.qs}`, {
                data: { name: 'Default Workspace' }, headers
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

        const payload = {
            project_name: data.name,
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
            data: payload, headers, label: 'Create Project'
        });
        if (!resp.ok()) throw new Error(`Create Project failed: ${resp.status()} - ${await resp.text()}`);
        const json = await resp.json();
        return this._mapProject(json);
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
