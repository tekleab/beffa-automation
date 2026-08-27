import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { DateHelper } from '../../lib/utils/DateHelper';
import fs from 'fs';
import path from 'path';

interface ApiValidationResult {
  module: string;
  submodule: string;
  endpoint: string;
  method: string;
  scenario: string;
  httpStatus: number;
  expectedStatus: string;
  responseSchema: string;
  isCompliant: boolean;
  complianceLevel: 'COMPLIANT' | 'WARNING' | 'CRITICAL_DEFECT';
  ruleViolations: string[];
  responseBody: any;
  requestPayload: any;
  recommendation: string;
}

test.describe('Enterprise ERP Full-Spectrum API Validation Scanner', () => {
  test('Audit all ERP modules: Sales, Purchase, HR, Inventory, Project, Assets, Accounting', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes for deep multi-module inspection
    const app = new AppManager(page);
    await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    const { apiBase, headers, qs } = await app.buildApiContext();
    const resolvedDate = await DateHelper.resolve(page);
    const periodDate = resolvedDate.iso;

    const results: ApiValidationResult[] = [];

    const evaluateResponse = (
      module: string,
      submodule: string,
      endpoint: string,
      method: string,
      scenario: string,
      status: number,
      body: any,
      payload: any,
      options: {
        disallow2xx?: boolean;
        expectedFieldInError?: string;
      } = { disallow2xx: true }
    ): ApiValidationResult => {
      const violations: string[] = [];
      let complianceLevel: 'COMPLIANT' | 'WARNING' | 'CRITICAL_DEFECT' = 'COMPLIANT';

      // Rule 1: False Acceptance on Invalid Data (HTTP 200/201)
      if (options.disallow2xx && (status >= 200 && status < 300)) {
        violations.push(`CRITICAL: Server erroneously ACCEPTED invalid input with HTTP ${status}`);
        complianceLevel = 'CRITICAL_DEFECT';
      }

      // Rule 2: Unhandled 500 Crashes
      if (status >= 500) {
        violations.push(`CRITICAL: Server crashed with unhandled Internal Server Error (HTTP ${status})`);
        complianceLevel = 'CRITICAL_DEFECT';
      }

      // Rule 3: 404 Route Missing
      if (status === 404) {
        violations.push(`WARNING: Endpoint returned HTTP 404 Not Found (route missing or misconfigured)`);
        if (complianceLevel !== 'CRITICAL_DEFECT') complianceLevel = 'WARNING';
      }

      // Rule 4: Status code appropriateness (422 vs 400)
      if (status !== 422 && status !== 400 && status < 500 && status >= 400 && status !== 404) {
        violations.push(`WARNING: Unusual HTTP status ${status} (standard validation errors should use 422 or 400)`);
        if (complianceLevel !== 'CRITICAL_DEFECT') complianceLevel = 'WARNING';
      }

      // Rule 5: Schema Structure
      let schemaType = 'UNKNOWN';
      if (typeof body === 'string') {
        if (body.trim().startsWith('<') || body.toLowerCase().includes('<html')) {
          schemaType = 'HTML_PAGE';
          violations.push('CRITICAL: Server returned raw HTML error page instead of JSON');
          complianceLevel = 'CRITICAL_DEFECT';
        } else {
          schemaType = 'RAW_STRING';
          violations.push('WARNING: Server returned plain unformatted text instead of JSON');
          if (complianceLevel !== 'CRITICAL_DEFECT') complianceLevel = 'WARNING';
        }
      } else if (body && typeof body === 'object') {
        if (body.code && body.details && typeof body.details === 'object') {
          schemaType = 'STRUCTURED_DETAILS (Standard)';
        } else if (Array.isArray(body.errors)) {
          schemaType = 'ARRAY_ERRORS';
        } else if (body.errors && typeof body.errors === 'object') {
          schemaType = 'VALIDATION_OBJECT';
        } else if (body.code && body.message) {
          schemaType = 'CODE_MESSAGE (Missing details map)';
          violations.push('WARNING: Missing field-level "details" map in response');
          if (complianceLevel !== 'CRITICAL_DEFECT') complianceLevel = 'WARNING';
        } else if (body.error || body.message || body.detail) {
          schemaType = 'GENERIC_MESSAGE';
          violations.push('WARNING: Generic error message without field attribution');
          if (complianceLevel !== 'CRITICAL_DEFECT') complianceLevel = 'WARNING';
        }
      }

      // Rule 6: Field-level attribution
      if (options.expectedFieldInError && body && typeof body === 'object') {
        const bodyStr = JSON.stringify(body).toLowerCase();
        if (!bodyStr.includes(options.expectedFieldInError.toLowerCase())) {
          violations.push(`WARNING: Error response does not reference target field "${options.expectedFieldInError}"`);
          if (complianceLevel !== 'CRITICAL_DEFECT') complianceLevel = 'WARNING';
        }
      }

      let recommendation = 'Standard compliance achieved.';
      if (complianceLevel === 'CRITICAL_DEFECT') {
        recommendation = 'P0 FIX: Implement validation guard to return 422 JSON validation error instead of accepting or crashing.';
      } else if (complianceLevel === 'WARNING') {
        recommendation = 'P1 STANDARDIZATION: Align response schema with `{ code: 422, message: "...", details: { [field]: ["error message"] } }`.';
      }

      return {
        module,
        submodule,
        endpoint,
        method,
        scenario,
        httpStatus: status,
        expectedStatus: '422 Unprocessable Entity',
        responseSchema: schemaType,
        isCompliant: complianceLevel === 'COMPLIANT',
        complianceLevel,
        ruleViolations: violations,
        responseBody: body,
        requestPayload: payload,
        recommendation,
      };
    };

    const probe = async (
      module: string,
      submodule: string,
      method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
      endpoint: string,
      scenario: string,
      payload: any,
      options: { disallow2xx?: boolean; expectedFieldInError?: string } = { disallow2xx: true }
    ) => {
      const url = `${apiBase}${endpoint}?${qs}`;
      let resp: any;
      try {
        if (method === 'POST') resp = await page.request.post(url, { headers, data: payload });
        else if (method === 'PATCH') resp = await page.request.patch(url, { headers, data: payload });
        else if (method === 'PUT') resp = await page.request.put(url, { headers, data: payload });
        else if (method === 'GET') resp = await page.request.get(url, { headers });
        else if (method === 'DELETE') resp = await page.request.delete(url, { headers });

        const status = resp.status();
        const body = await resp.json().catch(async () => await resp.text());
        results.push(evaluateResponse(module, submodule, endpoint, method, scenario, status, body, payload, options));
      } catch (err: any) {
        results.push(evaluateResponse(module, submodule, endpoint, method, scenario, 0, err.message, payload, options));
      }
    };

    console.log('[PROBE] 🚀 Starting Full-Spectrum Multi-Module API Validation Scan...');

    // =========================================================================
    // 1. SALES MODULE
    // =========================================================================
    console.log('[PROBE] 1/7 Scanning Sales Module...');
    // 1.1 Sales Orders
    await probe('Sales', 'Sales Order', 'POST', '/sales-orders', 'Empty Payload', {});
    await probe('Sales', 'Sales Order', 'POST', '/sales-orders', 'Negative Unit Price (-500)', {
      customer_id: '00000000-0000-0000-0000-000000000000', so_date: periodDate,
      so_items: [{ item_id: '00000000-0000-0000-0000-000000000000', quantity: 1, unit_price: -500, amount: -500 }], status: 'draft'
    }, { disallow2xx: true, expectedFieldInError: 'price' });
    await probe('Sales', 'Sales Order', 'POST', '/sales-orders', 'Negative Quantity (-10)', {
      customer_id: '00000000-0000-0000-0000-000000000000', so_date: periodDate,
      so_items: [{ item_id: '00000000-0000-0000-0000-000000000000', quantity: -10, unit_price: 100, amount: -1000 }], status: 'draft'
    }, { disallow2xx: true, expectedFieldInError: 'quantity' });
    await probe('Sales', 'Sales Order', 'POST', '/sales-orders', 'Non-existent Customer ID', {
      customer_id: '99999999-9999-9999-9999-999999999999', so_date: periodDate,
      so_items: [{ item_id: '00000000-0000-0000-0000-000000000000', quantity: 1, unit_price: 100, amount: 100 }], status: 'draft'
    });

    // 1.2 Invoices
    await probe('Sales', 'Invoice', 'POST', '/invoices', 'Empty Payload', {});
    await probe('Sales', 'Invoice', 'POST', '/invoices', 'Invalid Date Format ("invalid-date")', {
      customer_id: '00000000-0000-0000-0000-000000000000', invoice_date: 'invalid-date', invoice_items: []
    });
    await probe('Sales', 'Invoice', 'POST', '/invoices', 'Zero Items Array ([])', {
      customer_id: '00000000-0000-0000-0000-000000000000', invoice_date: periodDate, invoice_items: []
    });

    // 1.3 Receipts
    await probe('Sales', 'Receipt', 'POST', '/receipts', 'Empty Payload', {});
    await probe('Sales', 'Receipt', 'POST', '/receipts', 'Negative Receipt Amount (-2500)', {
      customer_id: '00000000-0000-0000-0000-000000000000', receipt_date: periodDate, amount: -2500
    }, { disallow2xx: true, expectedFieldInError: 'amount' });

    // 1.4 Customers
    await probe('Sales', 'Customer Master', 'POST', '/customers', 'Empty Payload', {});
    await probe('Sales', 'Customer Master', 'POST', '/customers', 'Malformed Phone Data Type (number instead of string)', {
      name: 'Type Mismatch Customer', phone: 123456789, tin: '1234567890'
    });

    // =========================================================================
    // 2. PURCHASE MODULE
    // =========================================================================
    console.log('[PROBE] 2/7 Scanning Purchase Module...');
    // 2.1 Purchase Orders
    await probe('Purchase', 'Purchase Order', 'POST', '/purchase-orders', 'Empty Payload', {});
    await probe('Purchase', 'Purchase Order', 'POST', '/purchase-orders', 'Missing item_id in Lines', {
      vendor_id: '00000000-0000-0000-0000-000000000000', po_date: periodDate,
      purchase_order_items: [{ quantity: 2, unit_price: 100 }]
    }, { disallow2xx: true, expectedFieldInError: 'item' });

    // 2.2 Bills
    await probe('Purchase', 'Bill', 'POST', '/bills', 'Empty Payload', {});
    await probe('Purchase', 'Bill', 'POST', '/bills', 'Negative Bill Item Amount', {
      vendor_id: '00000000-0000-0000-0000-000000000000', bill_date: periodDate,
      bill_items: [{ quantity: -5, unit_price: -100 }]
    });

    // 2.3 Payments
    await probe('Purchase', 'Payment', 'POST', '/payments', 'Empty Payload', {});
    await probe('Purchase', 'Payment', 'POST', '/payments', 'Negative Payment Amount (-1000)', {
      vendor_id: '00000000-0000-0000-0000-000000000000', amount: -1000, bill_payments: []
    }, { disallow2xx: true, expectedFieldInError: 'amount' });

    // 2.4 Vendors
    await probe('Purchase', 'Vendor Master', 'POST', '/vendors', 'Empty Payload', {});
    await probe('Purchase', 'Vendor Master', 'POST', '/vendors', 'Invalid TIN Characters ("ABC#$$$")', {
      name: 'Invalid TIN Vendor', tin: 'ABC#$$$', type: 'company'
    });

    // =========================================================================
    // 3. INVENTORY MODULE
    // =========================================================================
    console.log('[PROBE] 3/7 Scanning Inventory Module...');
    // 3.1 Items
    await probe('Inventory', 'Inventory Items', 'POST', '/inventory-items', 'Empty Payload', {});
    await probe('Inventory', 'Inventory Items', 'POST', '/inventory-items', 'Negative Unit Cost (-150)', {
      name: 'Negative Cost Item', unit_cost: -150, category_id: '00000000-0000-0000-0000-000000000000'
    }, { disallow2xx: true, expectedFieldInError: 'cost' });

    // 3.2 Adjustments
    await probe('Inventory', 'Adjustments', 'POST', '/inventory-adjustments', 'Empty Payload', {});
    await probe('Inventory', 'Adjustments', 'POST', '/inventory-adjustments', 'Missing Location & Warehouse', {
      item_id: '00000000-0000-0000-0000-000000000000', quantity: 10, unit_cost: 50
    });

    // 3.3 Transfers
    await probe('Inventory', 'Transfers', 'POST', '/inventory-transfers', 'Empty Payload', {});
    await probe('Inventory', 'Transfers', 'POST', '/inventory-transfers', 'Identical Source and Destination Location', {
      source_location_id: '55555555-5555-5555-5555-555555555555',
      destination_location_id: '55555555-5555-5555-5555-555555555555',
      items: [{ item_id: '00000000-0000-0000-0000-000000000000', quantity: 5 }]
    });

    // =========================================================================
    // 4. HR & PAYROLL MODULE
    // =========================================================================
    console.log('[PROBE] 4/7 Scanning HR & Payroll Module...');
    // 4.1 Employees
    await probe('HR', 'Employees', 'POST', '/employees', 'Empty Payload', {});
    await probe('HR', 'Employees', 'POST', '/employees', 'Invalid Email Format ("not-an-email")', {
      first_name: 'Test', last_name: 'Employee', email: 'not-an-email', employment_type: 'permanent'
    }, { disallow2xx: true, expectedFieldInError: 'email' });
    await probe('HR', 'Employees', 'POST', '/employees', 'Negative Base Salary (-5000)', {
      first_name: 'Negative', last_name: 'Salary', email: 'valid.email@example.com', base_salary: -5000
    }, { disallow2xx: true, expectedFieldInError: 'salary' });

    // 4.2 Departments & Positions
    await probe('HR', 'Departments', 'POST', '/departments', 'Empty Payload', {});
    await probe('HR', 'Job Positions', 'POST', '/job-positions', 'Empty Payload', {});

    // 4.3 Payroll Runs & Timesheets
    await probe('HR', 'Payroll Runs', 'POST', '/payroll-runs', 'Empty Payload', {});
    await probe('HR', 'Timesheets', 'POST', '/timesheets', 'Negative Hours Worked (-12)', {
      employee_id: '00000000-0000-0000-0000-000000000000', date: periodDate, hours: -12
    });
    await probe('HR', 'Leave Applications', 'POST', '/leave-applications', 'End Date Before Start Date', {
      employee_id: '00000000-0000-0000-0000-000000000000',
      start_date: '2026-08-30T00:00:00Z',
      end_date: '2026-08-10T00:00:00Z',
      leave_type_id: '00000000-0000-0000-0000-000000000000'
    });

    // =========================================================================
    // 5. PROJECT MANAGEMENT MODULE
    // =========================================================================
    console.log('[PROBE] 5/7 Scanning Project Management Module...');
    // 5.1 Projects
    await probe('Project', 'Projects', 'POST', '/projects', 'Empty Payload', {});
    await probe('Project', 'Projects', 'POST', '/projects', 'Negative Total Budget (-100000)', {
      name: 'Negative Budget Project', budget: -100000, start_date: periodDate
    }, { disallow2xx: true, expectedFieldInError: 'budget' });
    await probe('Project', 'Projects', 'POST', '/projects', 'End Date Preceding Start Date', {
      name: 'Time Travel Project', start_date: '2026-09-01T00:00:00Z', end_date: '2026-08-01T00:00:00Z'
    });

    // 5.2 Tasks & Milestones
    await probe('Project', 'Tasks', 'POST', '/tasks', 'Empty Payload', {});
    await probe('Project', 'Tasks', 'POST', '/tasks', 'Missing Required project_id', {
      title: 'Orphan Task Without Project', estimated_hours: 8
    }, { disallow2xx: true, expectedFieldInError: 'project' });
    await probe('Project', 'Milestones', 'POST', '/milestones', 'Empty Payload', {});

    // =========================================================================
    // 6. FIXED ASSETS MODULE
    // =========================================================================
    console.log('[PROBE] 6/7 Scanning Fixed Assets Module...');
    await probe('Asset', 'Assets', 'POST', '/assets', 'Empty Payload', {});
    await probe('Asset', 'Assets', 'POST', '/assets', 'Negative Asset Cost (-50000)', {
      name: 'Negative Cost Asset', acquisition_cost: -50000, acquisition_date: periodDate
    }, { disallow2xx: true, expectedFieldInError: 'cost' });
    await probe('Asset', 'Asset Categories', 'POST', '/asset-categories', 'Empty Payload', {});
    await probe('Asset', 'Asset Categories', 'POST', '/asset-categories', 'Negative Depreciation Rate (-15%)', {
      name: 'Negative Depr Category', depreciation_rate: -15
    });

    // =========================================================================
    // 7. ACCOUNTING & GENERAL LEDGER MODULE
    // =========================================================================
    console.log('[PROBE] 7/7 Scanning Accounting & Finance Module...');
    // 7.1 Journal Entries
    await probe('Accounting', 'General Journal', 'POST', '/general-journal-entries', 'Empty Payload', {});
    await probe('Accounting', 'General Journal', 'POST', '/general-journal-entries', 'Unbalanced Journal Entry (Debit $100 vs Credit $50)', {
      entry_date: periodDate,
      lines: [
        { account_id: '00000000-0000-0000-0000-000000000000', debit: 100, credit: 0 },
        { account_id: '11111111-1111-1111-1111-111111111111', debit: 0, credit: 50 },
      ]
    });

    // 7.2 Accounts
    await probe('Accounting', 'Chart of Accounts', 'POST', '/accounts', 'Empty Payload', {});
    await probe('Accounting', 'Chart of Accounts', 'POST', '/accounts', 'Invalid Account Classification Type ("fake_type")', {
      name: 'Test Account', code: '99999', type: 'fake_type'
    });

    // =========================================================================
    // COMPILE ENTERPRISE AUDIT REPORT
    // =========================================================================
    const reportPath = path.resolve(process.cwd(), 'test-results', 'API_VALIDATION_COMPLIANCE_AUDIT.md');
    const jsonReportPath = path.resolve(process.cwd(), 'test-results', 'API_VALIDATION_COMPLIANCE_AUDIT.json');

    const totalScenarios = results.length;
    const compliantCount = results.filter(r => r.complianceLevel === 'COMPLIANT').length;
    const warningCount = results.filter(r => r.complianceLevel === 'WARNING').length;
    const defectCount = results.filter(r => r.complianceLevel === 'CRITICAL_DEFECT').length;
    const complianceScore = Math.round((compliantCount / totalScenarios) * 100);

    // Group by module
    const modules = Array.from(new Set(results.map(r => r.module)));

    let md = `# 🛡️ ERP Enterprise API Validation Compliance Audit Report\n\n`;
    md += `> **Audit Generated:** ${new Date().toLocaleString()}  \n`;
    md += `> **Scope:** Full-System (Sales, Purchase, HR, Inventory, Project Management, Fixed Assets, Accounting)  \n`;
    md += `> **Total Scenarios Evaluated:** **${totalScenarios}**  \n`;
    md += `> **Overall Validation Standardization Score:** **${complianceScore}%**  \n`;
    md += `> **Status Breakdown:** ✅ **${compliantCount} Compliant** | ⚠️ **${warningCount} Format Inconsistencies / Warnings** | ❌ **${defectCount} Critical Defects**  \n\n`;

    md += `---\n\n`;
    md += `## 📊 Module-by-Module Standardization Scorecard\n\n`;
    md += `| Module | Scenarios | Compliant (✅) | Warnings (⚠️) | Defects (❌) | Score |\n`;
    md += `|:---|:---:|:---:|:---:|:---:|:---:|\n`;

    for (const mod of modules) {
      const modResults = results.filter(r => r.module === mod);
      const c = modResults.filter(r => r.complianceLevel === 'COMPLIANT').length;
      const w = modResults.filter(r => r.complianceLevel === 'WARNING').length;
      const d = modResults.filter(r => r.complianceLevel === 'CRITICAL_DEFECT').length;
      const score = Math.round((c / modResults.length) * 100);
      md += `| **${mod}** | ${modResults.length} | ${c} | ${w} | ${d} | **${score}%** |\n`;
    }

    md += `\n---\n\n`;
    md += `## 📋 Comprehensive Endpoint Validation Matrix\n\n`;
    md += `| Module | Submodule | Method | Endpoint | Scenario | Status | Schema Type | Result | Key Finding |\n`;
    md += `|:---|:---|:---:|:---|:---|:---:|:---|:---:|:---|\n`;

    for (const r of results) {
      const badge = r.complianceLevel === 'COMPLIANT' ? '✅ **CORRECT**' : r.complianceLevel === 'WARNING' ? '⚠️ **WARNING**' : '❌ **DEFECT**';
      const finding = r.ruleViolations.length > 0 ? r.ruleViolations[0].replace(/\|/g, '\\|') : 'Correctly rejected with structured 422 JSON details.';
      md += `| ${r.module} | ${r.submodule} | \`${r.method}\` | \`${r.endpoint}\` | ${r.scenario} | **${r.httpStatus}** | \`${r.responseSchema}\` | ${badge} | ${finding} |\n`;
    }

    md += `\n---\n\n`;
    md += `## 🚨 Critical Defects (P0 - Immediate Fix Required)\n\n`;
    const criticalList = results.filter(r => r.complianceLevel === 'CRITICAL_DEFECT');
    if (criticalList.length === 0) {
      md += `*No unhandled server crashes (HTTP 500) or unauthorized 200 acceptances detected.*\n\n`;
    } else {
      for (const d of criticalList) {
        md += `### ❌ [${d.module} / ${d.submodule}] \`${d.method} ${d.endpoint}\` — ${d.scenario}\n`;
        md += `- **HTTP Status:** \`${d.httpStatus}\`\n`;
        md += `- **Violations:** ${d.ruleViolations.join('; ')}\n`;
        md += `- **Payload:**\n\`\`\`json\n${JSON.stringify(d.requestPayload, null, 2)}\n\`\`\`\n`;
        md += `- **Response:**\n\`\`\`json\n${typeof d.responseBody === 'string' ? d.responseBody : JSON.stringify(d.responseBody, null, 2)}\n\`\`\`\n`;
        md += `- **Recommendation:** ${d.recommendation}\n\n`;
      }
    }

    md += `\n---\n\n`;
    md += `## ⚠️ Standardization Roadmap for Developers (P1)\n\n`;
    const warningList = results.filter(r => r.complianceLevel === 'WARNING');
    for (const w of warningList) {
      md += `### ⚠️ [${w.module} / ${w.submodule}] \`${w.method} ${w.endpoint}\` — ${w.scenario}\n`;
      md += `- **Status Code:** \`${w.httpStatus}\` (Schema: \`${w.responseSchema}\`)\n`;
      md += `- **Discrepancy:** ${w.ruleViolations.join('; ')}\n`;
      md += `- **Current Response:**\n\`\`\`json\n${typeof w.responseBody === 'string' ? w.responseBody : JSON.stringify(w.responseBody, null, 2)}\n\`\`\`\n`;
      md += `- **Action Item:** Standardize error contract to return HTTP \`422\` with \`{ "code": 422, "message": "...", "details": { ... } }\`.\n\n`;
    }

    fs.writeFileSync(reportPath, md, 'utf-8');
    fs.writeFileSync(jsonReportPath, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`[AUDIT COMPLETE] Saved ${totalScenarios} audit results to: ${reportPath}`);

    expect(results.length).toBeGreaterThan(0);
  });
});
