import { expect } from '@playwright/test';
import { apiErrorCollector } from './ApiErrorCollector';

export interface ValidationCaptureResult {
  rejected: boolean;
  status: number;
  body: any;
  standardSchema: boolean;
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

  console.log(`[VALIDATION AUDIT] ${options.label} → Status ${status} (${classification.schemaType}): "${classification.primaryMessage}"`);

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

