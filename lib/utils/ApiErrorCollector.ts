import fs from 'fs';
import path from 'path';

export type ErrorSchemaType =
  | 'CODE_MESSAGE'      // { code: 422, message: "..." }
  | 'ARRAY_ERRORS'      // { errors: [{ field: "...", message: "..." }] }
  | 'ERROR_STRING'      // { error: "..." } or { detail: "..." }
  | 'VALIDATION_OBJECT' // { message: "Validation error", errors: { field: ["..."] } }
  | 'RAW_STRING'        // Plain text error
  | 'HTML_ERROR'        // 500/502/504 HTML page
  | 'UNKNOWN';

export interface ApiDefectEntry {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  endpoint: string;
  status: number;
  requestHeaders?: Record<string, any>;
  requestBody?: any;
  responseBody: any;
  schemaType: ErrorSchemaType;
  primaryMessage: string;
  contextLabel?: string;
  curlCommand: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
}

export class ApiErrorCollector {
  private static instance: ApiErrorCollector;
  private defects: Map<string, ApiDefectEntry> = new Map();
  private outputDir: string = path.resolve(process.cwd(), 'test-results');

  private constructor() {
    if (!fs.existsSync(this.outputDir)) {
      try {
        fs.mkdirSync(this.outputDir, { recursive: true });
      } catch {
        // ignore
      }
    }
  }

  public static getInstance(): ApiErrorCollector {
    if (!ApiErrorCollector.instance) {
      ApiErrorCollector.instance = new ApiErrorCollector();
    }
    return ApiErrorCollector.instance;
  }

  /**
   * Classify response body into known standard or non-standard error structures
   */
  public classifySchema(status: number, body: any): { schemaType: ErrorSchemaType; primaryMessage: string } {
    if (typeof body === 'string') {
      if (body.trim().startsWith('<') || body.toLowerCase().includes('<html')) {
        return { schemaType: 'HTML_ERROR', primaryMessage: `HTML Error Response (${status})` };
      }
      return { schemaType: 'RAW_STRING', primaryMessage: body.slice(0, 150) };
    }

    if (body && typeof body === 'object') {
      if (Array.isArray(body.errors)) {
        const first = body.errors[0];
        const msg = typeof first === 'string' ? first : (first?.message || first?.msg || JSON.stringify(first));
        return { schemaType: 'ARRAY_ERRORS', primaryMessage: msg || 'Array of errors' };
      }

      if (body.errors && typeof body.errors === 'object' && !Array.isArray(body.errors)) {
        const firstKey = Object.keys(body.errors)[0];
        const val = body.errors[firstKey];
        const msg = Array.isArray(val) ? val.join(', ') : String(val);
        return { schemaType: 'VALIDATION_OBJECT', primaryMessage: `${firstKey}: ${msg}` };
      }

      if ('code' in body && 'message' in body) {
        return { schemaType: 'CODE_MESSAGE', primaryMessage: String(body.message) };
      }

      if ('error' in body) {
        return { schemaType: 'ERROR_STRING', primaryMessage: String(body.error) };
      }

      if ('detail' in body) {
        return { schemaType: 'ERROR_STRING', primaryMessage: String(body.detail) };
      }

      if ('message' in body) {
        return { schemaType: 'CODE_MESSAGE', primaryMessage: String(body.message) };
      }
    }

    return { schemaType: 'UNKNOWN', primaryMessage: JSON.stringify(body).slice(0, 150) };
  }

  /**
   * Generates a reproducible curl command for developers
   */
  private generateCurl(method: string, url: string, headers?: Record<string, any>, data?: any): string {
    const headerFlags = Object.entries(headers || {})
      .filter(([k]) => !['content-length', 'host'].includes(k.toLowerCase()))
      .map(([k, v]) => `-H "${k}: ${v}"`)
      .join(' ');

    const dataFlag = data ? ` -d '${typeof data === 'string' ? data : JSON.stringify(data)}'` : '';
    return `curl -X ${method.toUpperCase()} "${url}" ${headerFlags}${dataFlag}`;
  }

  /**
   * Intercept and record an API validation error or anomaly
   */
  public record(params: {
    method: string;
    url: string;
    status: number;
    requestHeaders?: Record<string, any>;
    requestBody?: any;
    responseBody: any;
    label?: string;
  }): void {
    // Only capture error/warning responses (non-2xx)
    if (params.status >= 200 && params.status < 300) return;

    // Parse clean endpoint path
    let endpoint = params.url;
    try {
      const parsed = new URL(params.url.startsWith('http') ? params.url : `http://localhost${params.url}`);
      endpoint = parsed.pathname;
    } catch {
      // keep raw url
    }

    const { schemaType, primaryMessage } = this.classifySchema(params.status, params.responseBody);
    const key = `${params.method.toUpperCase()}:${endpoint}:${params.status}:${schemaType}:${primaryMessage.slice(0, 40)}`;
    const now = new Date().toISOString();

    if (this.defects.has(key)) {
      const existing = this.defects.get(key)!;
      existing.count += 1;
      existing.lastSeen = now;
      existing.responseBody = params.responseBody;
    } else {
      const entry: ApiDefectEntry = {
        id: `API-ERR-${(this.defects.size + 1).toString().padStart(3, '0')}`,
        timestamp: now,
        method: params.method.toUpperCase(),
        url: params.url,
        endpoint,
        status: params.status,
        requestHeaders: params.requestHeaders,
        requestBody: params.requestBody,
        responseBody: params.responseBody,
        schemaType,
        primaryMessage,
        contextLabel: params.label,
        curlCommand: this.generateCurl(params.method, params.url, params.requestHeaders, params.requestBody),
        count: 1,
        firstSeen: now,
        lastSeen: now,
      };
      this.defects.set(key, entry);
    }

    // Auto-save reports periodically
    this.saveReports();
  }

  /**
   * Exports markdown and JSON defect reports for developers
   */
  public saveReports(): void {
    const list = Array.from(this.defects.values());
    if (list.length === 0) return;

    if (!fs.existsSync(this.outputDir)) {
      try {
        fs.mkdirSync(this.outputDir, { recursive: true });
      } catch {
        return;
      }
    }

    try {
      // 1. JSON report
      const jsonPath = path.join(this.outputDir, 'api-defects-report.json');
      fs.writeFileSync(jsonPath, JSON.stringify(list, null, 2), 'utf-8');

      // 2. Markdown Developer Catalog
      const mdPath = path.join(this.outputDir, 'API_VALIDATION_DEFECTS.md');
      let md = `# 📋 Backend API Validation Error & Defect Catalog\n\n`;
      md += `> Generated on: **${new Date().toLocaleString()}** | Total Issues: **${list.length}** | Total Hits: **${list.reduce((acc, d) => acc + d.count, 0)}**\n\n`;

      md += `## 📊 Summary of Identified Error Schemas\n\n`;
      md += `| ID | Method | Endpoint | HTTP Status | Schema Type | Primary Error Message | Occurrences |\n`;
      md += `|:---|:---|:---|:---:|:---|:---|:---:|\n`;

      for (const d of list) {
        const cleanMsg = d.primaryMessage.replace(/\|/g, '\\|').replace(/\n/g, ' ');
        md += `| **${d.id}** | \`${d.method}\` | \`${d.endpoint}\` | **${d.status}** | \`${d.schemaType}\` | ${cleanMsg} | ${d.count} |\n`;
      }

      md += `\n---\n\n`;
      md += `## 🛠️ Detailed Defect Breakdowns & Reproduction Snippets\n\n`;

      for (const d of list) {
        md += `### [${d.id}] ${d.method} \`${d.endpoint}\` (${d.status} ${d.schemaType})\n\n`;
        md += `- **Context / Label:** ${d.contextLabel || 'N/A'}\n`;
        md += `- **Occurrences:** ${d.count} (First seen: ${d.firstSeen})\n`;
        md += `- **Primary Message:** \`${d.primaryMessage}\`\n\n`;

        if (d.requestBody) {
          md += `**Request Payload:**\n\`\`\`json\n${JSON.stringify(d.requestBody, null, 2)}\n\`\`\`\n\n`;
        }

        md += `**Response Body:**\n\`\`\`json\n${typeof d.responseBody === 'string' ? d.responseBody : JSON.stringify(d.responseBody, null, 2)}\n\`\`\`\n\n`;

        md += `**Reproduction (cURL):**\n\`\`\`bash\n${d.curlCommand}\n\`\`\`\n\n`;
        md += `---\n\n`;
      }

      fs.writeFileSync(mdPath, md, 'utf-8');
    } catch {
      // ignore write error during test execution
    }
  }

  public getDefects(): ApiDefectEntry[] {
    return Array.from(this.defects.values());
  }

  public clear(): void {
    this.defects.clear();
  }
}

export const apiErrorCollector = ApiErrorCollector.getInstance();

