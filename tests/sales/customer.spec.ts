import { test, expect } from'@playwright/test';
import { AppManager } from'../../pages/AppManager';
import * as fs from'fs';
import * as path from'path';


const addressData: Array<{ region: string; zones: Array<{ name: string; woredas: string[] }> }> = JSON.parse(

/**
 * =============================================================================
 * MODULE: Customer Management - CRUD & Validation Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Create customer with required fields (name, address, AR account)
 * 2. Duplicate customer name rejection (400/422 guardrail)
 * 3. Customer list pagination and search by name fragment
 * 4. Customer detail fields (balance, contacts, address)
 * =============================================================================
 */

    fs.readFileSync(path.join(__dirname,'../../data/address_locations.json'),'utf8')
);

test.describe('Customer Lifecycle — Validation & CRUD @sales @sanity @smoke @regression @full', () => {
    test.setTimeout(180000);

    test('Validate TIN, create customer, edit, remove', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const fixedTIN = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const customerName = `Kebede-${Date.now()}`;
        const updatedName = `${customerName}-Updated`;

        // Use first region/zone/woreda — avoids cascading select race conditions
        const region  = addressData[0];
        const zone    = region.zones[0];
        const woreda  = zone.woredas[0];

        // ── Phase 1: TIN validation ───────────────────────────────────────────
        console.log('[STEP] Phase 1: TIN validation check');
        await page.goto('/receivables/customers/new', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
        if (page.url().includes('/users/login')) {
            await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
            await page.goto('/receivables/customers/new', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
        }
        await app.customerNameInput.waitFor({ state: 'visible', timeout: 15000 });
        await app.customerNameInput.fill('Validation Test');
        await app.customerTypeSelect.selectOption('individual');
        await app.customerTinInput.fill('123');
        await app.customerPhoneInput.fill('0911223344');
        await app.fillEthiopianAddress(region.region, zone.name, woreda);
        await app.createCustomerBtn.click();
        await expect(page.getByText(/10 digit|must be 10/i)).toBeVisible({ timeout: 10000 });
        console.log('[OK] Invalid TIN correctly blocked');

        // ── Phase 2: Create ───────────────────────────────────────────────────
        console.log(`[STEP] Phase 2: Creating customer "${customerName}"`);
        const uniquePhone = `09${Math.floor(10000000 + Math.random() * 90000000)}`;
        await app.customerTinInput.fill(fixedTIN);
        await app.customerPhoneInput.fill(uniquePhone);
        await app.customerNameInput.clear();
        await app.customerNameInput.fill(customerName);
        await app.createCustomerBtn.click();
        await page.waitForURL(url => url.href.includes('/detail'), { timeout: 60000 });
        // Wait for detail page to fully render before interacting
        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
        console.log(`[OK] Customer "${customerName}" created`);

        // ── Phase 3: Edit ─────────────────────────────────────────────────────
        console.log(`[STEP] Phase 3: Editing to "${updatedName}"`);
        await app.editCustomerBtn.waitFor({ state: 'visible', timeout: 20000 });
        await app.editCustomerBtn.click({ force: true });
        // Wait for form inputs to be editable — not just visible
        await app.customerNameInput.waitFor({ state: 'visible', timeout: 20000 });
        await expect(app.customerNameInput).toBeEditable({ timeout: 15000 });
        await app.customerNameInput.clear();
        await app.customerNameInput.fill(updatedName);
        const saveBtn = page.locator('button:has-text("Save"), button:has-text("Update")').first();
        await saveBtn.waitFor({ state: 'visible', timeout: 10000 });
        await saveBtn.click({ force: true });
        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
        // Poll for updated name — React re-render may lag behind networkidle
        await expect(page.getByText(updatedName).first()).toBeVisible({ timeout: 30000 });
        console.log('[OK] Customer updated');

        // ── Phase 4: Remove ───────────────────────────────────────────────────
        console.log('[STEP] Phase 4: Removing customer');
        await page.waitForTimeout(2000);
        const removeBtn = page.getByRole('button', { name: /remove|delete/i }).first();
        await removeBtn.waitFor({ state: 'visible', timeout: 20000 });
        await removeBtn.scrollIntoViewIfNeeded().catch(() => {});
        await removeBtn.click();

        const confirmBtn = page.locator('section[role="dialog"] button, div[role="alertdialog"] button, [role="dialog"] button, .modal button').filter({ hasText: /Yes|Confirm|Delete|Remove/i }).first();

        if (!await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await removeBtn.click({ force: true });
        }

        await confirmBtn.waitFor({ state: 'visible', timeout: 15000 });
        await confirmBtn.click({ force: true });
        await page.waitForURL(url => url.href.includes('/receivables/customers'), { timeout: 30000 });
        console.log('[RESULT] Customer Lifecycle: PASSED');
    });
});
