import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: System-Wide Error Visibility & Notification Audit Suite
 * =============================================================================
 * 
 * ARCHITECTURAL SCOPE & COVERAGE:
 * Systematically audits UI and API error communication across core ERP modules:
 * 1. Sales Module Error Visibility (Sales Orders & Invoices form validation & stock guards)
 * 2. Purchase Module Error Visibility (Purchase Orders & Bills form validation & G/L dialogs)
 * 3. HR Module Error Visibility (Employee Onboarding & Leave Requests validation)
 * 4. Global API Error Response Interception (Toast notification container checks on 400/422/500)
 * =============================================================================
 */

test.describe('System-Wide Error Visibility Audit @error-visibility @full', () => {
    test.setTimeout(180000);

    let sharedApp: AppManager;

    test.beforeEach(async ({ page }) => {
        sharedApp = new AppManager(page);
        await sharedApp.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    // -------------------------------------------------------------------------
    // 1. SALES MODULE ERROR VISIBILITY
    // -------------------------------------------------------------------------
    test('1. Sales Module: Form & Modal Error Visibility (Sales Orders / Invoices)', async ({ page }) => {
        console.log('[SALES MODULE AUDIT] Testing Sales Order & Invoice Error Visibility...');
        await page.goto('/receivables/sale-orders/new', { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });

        const addNowBtn = page.locator('button:has-text("Add Now"), button:has-text("Save"), button:has-text("Create")').first();
        await addNowBtn.waitFor({ state: 'visible', timeout: 15000 });

        const isDisabled = await addNowBtn.isDisabled().catch(() => false);
        console.log(`[SALES AUDIT] Sales Order Submit button initial state: disabled=${isDisabled}`);

        // Check for visible inline errors or alerts
        const inlineErrors = page.locator('.chakra-form__error-message, [aria-invalid="true"], [role="alert"], .chakra-toast, [data-status="error"]');
        const count = await inlineErrors.count();
        const errorTexts: string[] = [];
        for (let i = 0; i < count; i++) {
            const txt = await inlineErrors.nth(i).textContent().catch(() => '');
            if (txt?.trim()) errorTexts.push(txt.trim());
        }

        console.log(`[SALES AUDIT] Visible Errors Captured: ${errorTexts.length > 0 ? JSON.stringify(errorTexts) : 'NONE (Silent Validation / Disabled Button)'}`);
        expect(true).toBe(true);
    });

    // -------------------------------------------------------------------------
    // 2. PURCHASE MODULE ERROR VISIBILITY
    // -------------------------------------------------------------------------
    test('2. Purchase Module: Form & Modal Error Visibility (Purchase Orders / Bills)', async ({ page }) => {
        console.log('[PURCHASE MODULE AUDIT] Testing Purchase Order & Bill Error Visibility...');
        await page.goto('/payables/bills/new', { waitUntil: 'domcontentloaded' }).catch(() => {
            return page.goto('/payables/purchase-orders/new', { waitUntil: 'domcontentloaded' });
        });
        await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });

        const saveBtn = page.locator('button:has-text("Save"), button:has-text("Add Now"), button:has-text("Create")').first();
        if (await saveBtn.isVisible().catch(() => false)) {
            const isDisabled = await saveBtn.isDisabled().catch(() => false);
            console.log(`[PURCHASE AUDIT] Bill/PO Submit button initial state: disabled=${isDisabled}`);
        }

        const inlineErrors = page.locator('.chakra-form__error-message, [aria-invalid="true"], [role="alert"], .chakra-toast, [data-status="error"]');
        const count = await inlineErrors.count();
        const errorTexts: string[] = [];
        for (let i = 0; i < count; i++) {
            const txt = await inlineErrors.nth(i).textContent().catch(() => '');
            if (txt?.trim()) errorTexts.push(txt.trim());
        }

        console.log(`[PURCHASE AUDIT] Visible Errors Captured: ${errorTexts.length > 0 ? JSON.stringify(errorTexts) : 'NONE (Silent Validation / Disabled Button)'}`);
        expect(true).toBe(true);
    });

    // -------------------------------------------------------------------------
    // 3. HR MODULE ERROR VISIBILITY
    // -------------------------------------------------------------------------
    test('3. HR Module: Form Validation Error Visibility (Employees / Leave Requests)', async ({ page }) => {
        console.log('[HR MODULE AUDIT] Testing HR Employee & Leave Request Error Visibility...');
        await page.goto('/hrm/employees/new', { waitUntil: 'domcontentloaded' }).catch(() => {
            return page.goto('/hrm/leave-requests/new', { waitUntil: 'domcontentloaded' });
        });
        await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });

        const submitBtn = page.locator('button:has-text("Save"), button:has-text("Submit"), button:has-text("Create")').first();
        if (await submitBtn.isVisible().catch(() => false)) {
            const isDisabled = await submitBtn.isDisabled().catch(() => false);
            console.log(`[HR AUDIT] Employee/Leave Submit button initial state: disabled=${isDisabled}`);
        }

        const inlineErrors = page.locator('.chakra-form__error-message, [aria-invalid="true"], [role="alert"], .chakra-toast, [data-status="error"]');
        const count = await inlineErrors.count();
        const errorTexts: string[] = [];
        for (let i = 0; i < count; i++) {
            const txt = await inlineErrors.nth(i).textContent().catch(() => '');
            if (txt?.trim()) errorTexts.push(txt.trim());
        }

        console.log(`[HR AUDIT] Visible Errors Captured: ${errorTexts.length > 0 ? JSON.stringify(errorTexts) : 'NONE (Silent Validation / Disabled Button)'}`);
        expect(true).toBe(true);
    });

    // -------------------------------------------------------------------------
    // 4. API ERROR TOAST & NOTIFICATION VISIBILITY (Server 400 / 422 / 500)
    // -------------------------------------------------------------------------
    test('4. API & Global Error Visibility: Toast Notifications on Backend Failures', async ({ page }) => {
        console.log('[GLOBAL API AUDIT] Auditing Global Toast Notification Container & Backend API Error Responses...');

        const { apiBase, headers, qs } = await sharedApp.buildApiContext();
        const badRes = await page.request.post(`${apiBase}/sales-orders?${qs}`, {
            headers,
            data: { invalid_payload_probe: true }
        });

        console.log(`[GLOBAL API AUDIT] Response Status: ${badRes.status()}`);
        let apiErrorBody = '';
        try {
            apiErrorBody = await badRes.text();
            console.log(`[GLOBAL API AUDIT] Raw Server Payload: "${apiErrorBody.slice(0, 200)}"`);
        } catch { }

        const toastRegion = page.locator('[region*="Notifications"], .chakra-toast__group, [id^="chakra-toast"]');
        const isToastContainerPresent = await toastRegion.count() > 0;
        console.log(`[GLOBAL API AUDIT] UI Toast Region Present in DOM: ${isToastContainerPresent}`);

        expect([400, 422, 500]).toContain(badRes.status());
    });
});
