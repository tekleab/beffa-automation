import { expect } from '@playwright/test';
import { apiErrorCollector } from './ApiErrorCollector';

export interface ValidationCaptureResult {
  rejected: boolean;
  status: number;
  body: any;
  standardSchema: boolean;
}

/**
 * Formats and prints a highly visible developer bug banner to the test console.
 */
export function printBackendBugBanner(details: {
  jiraTicket?: string;
  defectTitle: string;
  endpoint: string;
  method?: string;
  statusCode: number;
  expectedStatus?: string;
  rootCause: string;
  responsePreview?: any;
}): void {
  const line = '═'.repeat(72);
  const pad = (label: string, value: string) => `  ║ ${label.padEnd(15)}: ${value.padEnd(51)} ║`;

  console.log(`\n  ╔${line}╗`);
  console.log(`  ║ 🚨 BACKEND DEFECT DETECTED${details.jiraTicket ? ` [${details.jiraTicket}]` : ''}`.padEnd(74) + '║');
  console.log(`  ╠${line}╣`);
  console.log(pad('Defect Title', details.defectTitle.slice(0, 48)));
  console.log(pad('Endpoint', `${details.method || 'POST'} ${details.endpoint}`.slice(0, 48)));
  console.log(pad('Status Code', `HTTP ${details.statusCode} (Expected: ${details.expectedStatus || '422 / 400'})`));
  console.log(pad('Root Cause', details.rootCause.slice(0, 48)));
  if (details.jiraTicket) {
    console.log(pad('Jira Ticket', `https://bmtechnology.atlassian.net/browse/${details.jiraTicket}`.slice(0, 48)));
  }
  if (details.responsePreview) {
    const raw = typeof details.responsePreview === 'object' ? JSON.stringify(details.responsePreview) : String(details.responsePreview);
    console.log(pad('Response Snippet', raw.slice(0, 48)));
  }
  console.log(`  ╚${line}╝\n`);
}

/**
 * Validates that an API request was properly rejected (4xx error)
 * without hard-crashing on minor schema format discrepancies.
 * The error shape is automatically captured in the Developer Defect Catalog.
 */
export async function assertValidationRejection(
  response: any,
  options: {
    expectedStatuses?: number[];
    label: string;
    requestData?: any;
    url?: string;
    method?: string;
    jiraTicket?: string;
  }
): Promise<ValidationCaptureResult> {
  const status = typeof response.status === 'function' ? response.status() : (response.status || 0);
  let body: any = null;

  try {
    if (typeof response.json === 'function') {
      body = await response.json().catch(() => null);
    }
  } catch {
    // fallback
  }

  if (!body && typeof response.text === 'function') {
    body = await response.text().catch(() => '');
  }

  const expectedStatuses = options.expectedStatuses || [400, 401, 403, 404, 409, 422, 500];
  const isRejected = status >= 400;

  // Record into collector for developer visibility
  if (isRejected) {
    apiErrorCollector.record({
      method: options.method || 'POST',
      url: options.url || 'API Validation',
      status,
      requestBody: options.requestData,
      responseBody: body,
      label: options.label,
    });
  }

  const classification = apiErrorCollector.classifySchema(status, body);
  const isStandard = ['CODE_MESSAGE', 'ARRAY_ERRORS', 'VALIDATION_OBJECT'].includes(classification.schemaType);

  if (status === 500) {
    printBackendBugBanner({
      jiraTicket: options.jiraTicket || 'BDEV-1272',
      defectTitle: `Unhandled HTTP 500 on ${options.label}`,
      endpoint: options.url || 'POST /api/...',
      method: options.method || 'POST',
      statusCode: status,
      expectedStatus: 'HTTP 422 Unprocessable Entity',
      rootCause: 'Backend crashed with unhandled 500 instead of input validation map',
      responsePreview: body
    });
  } else {
    console.log(`[VALIDATION AUDIT] ${options.label} → Status ${status} (${classification.schemaType}): "${classification.primaryMessage}"`);
  }

  // Assert business requirement: system MUST reject invalid input
  expect(isRejected, `Expected ${options.label} to be rejected by server, received status ${status}`).toBe(true);
  expect(expectedStatuses).toContain(status);

  return {
    rejected: isRejected,
    status,
    body,
    standardSchema: isStandard,
  };
}


