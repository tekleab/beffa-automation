/**
 * DevReporter — Centralized forensic test logger for reporting exact backend behavior,
 * response payloads, HTTP statuses, and copyable cURL reproduction snippets to developers.
 */

export interface DevAuditRecord {
  testName: string;
  action: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  company: string;
  token?: string;
  payload?: any;
  status: number;
  responseBody?: any;
  durationMs?: number;
  verdict: string;
}

export class DevReporter {
  static record(audit: DevAuditRecord) {
    const separator = '═'.repeat(84);
    const subline = '─'.repeat(84);
    const isError = audit.status >= 400;
    const statusBadge = audit.status >= 500
      ? `🚨 ${audit.status} CRITICAL BACKEND BUG`
      : audit.status >= 400
        ? `🛡️ ${audit.status} CLIENT ERROR / VALIDATION`
        : `✅ ${audit.status} OK / CREATED`;

    console.log(`\n${separator}`);
    console.log(`📋 DEV FORENSIC AUDIT: ${audit.testName}`);
    console.log(`${subline}`);
    console.log(`Action      : ${audit.action}`);
    console.log(`Endpoint    : ${audit.method} ${audit.url}`);
    console.log(`Tenant      : ${audit.company}`);
    console.log(`HTTP Status : ${statusBadge} ${audit.durationMs !== undefined ? `(${audit.durationMs}ms)` : ''}`);
    console.log(`Verdict     : ${audit.verdict}`);

    if (audit.payload && Object.keys(audit.payload).length > 0) {
      console.log(`\n📦 Request Payload:`);
      console.log(JSON.stringify(audit.payload, null, 2));
    }

    if (audit.responseBody !== undefined) {
      console.log(`\n📥 Server Response:`);
      if (typeof audit.responseBody === 'string') {
        console.log(audit.responseBody.substring(0, 1000));
      } else {
        console.log(JSON.stringify(audit.responseBody, null, 2).substring(0, 1500));
      }
    }

    // Generate copyable cURL snippet
    console.log(`\n💻 Copyable cURL Reproduction:`);
    const authHeader = audit.token ? `-H "Authorization: Bearer ${audit.token.substring(0, 18)}..."` : '';
    const compHeader = `-H "x-company: ${audit.company}"`;
    const jsonHeader = `-H "Content-Type: application/json"`;
    const dataArg = audit.payload ? `-d '${JSON.stringify(audit.payload)}'` : '';
    console.log(`curl -X ${audit.method} "${audit.url}" ${compHeader} ${authHeader} ${jsonHeader} ${dataArg}`.trim());
    console.log(`${separator}\n`);
  }
}

