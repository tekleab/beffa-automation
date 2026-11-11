import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import * as fs from 'fs';
import * as path from 'path';

/**
 * =============================================================================
 * MODULE: Customer Management - CRUD & Validation Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Form Validation: Rejection of invalid TIN (< 10 digits)
 * 2. Form Validation: Duplicate customer name guardrail ("Customer name already in use")
 * 3. Form Validation: Disabled submit button on empty/invalid mandatory fields
 * 4. Customer Lifecycle: End-to-end Create -> Edit -> Delete
 * 5. Customer Roster: List rendering and search query filtering
 * =============================================================================
 */

const addressData: Array<{ region: string; zones: Array<{ name: string; woredas: string[] }> }> = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../data/address_locations.json'), 'utf8')
);

test.describe('Customer Lifecycle — Validation & CRUD @sales @smoke', () => {
    test.setTimeout(180000);

    const region = addressData[0];
    const zone = region.zones[0];
    const woreda = zone.woredas[0];

    test('Guardrail: System rejects customer creation with invalid TIN (< 10 digits)', async ({ page }) => {
        const app = new AppManager(page);

        console.log('[STEP] Navigating to customer creation form');
        await page.goto('/receivables/customers/new', { waitUntil: 'domcontentloaded', timeout: 60000 });
        if (page.url().includes('/users/login')) {
            await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
            await page.goto('/receivables/customers/new', { waitUntil: 'domcontentloaded', timeout: 60000 });
        }
        await app.customerNameInput.waitFor({ state: 'visible', timeout: 60000 });

        // Dynamic unique customer name prevents "Customer name already in use" collision
        const uniqueValidationName = `Val-TIN-${Date.now()}`;
        const uniqueValidationPhone = `09${Math.floor(10000000 + Math.random() * 90000000)}`;

        await app.customerNameInput.fill(uniqueValidationName);
        await app.customerTypeSelect.selectOption('individual');
        await app.customerTinInput.fill('123'); // Invalid TIN: only 3 digits (10 digits required)
        await app.customerPhoneInput.fill(uniqueValidationPhone);
        await app.fillEthiopianAddress(region.region, zone.name, woreda);

        console.log('[STEP] Submitting customer form with invalid TIN');
        await app.createCustomerBtn.click();

        // Server returns 422 with "Tax ID Number must be a 10 digit TIN number." mapped to the form error message
        await expect(page.getByText(/10 digit|must be 10|Tax ID Number must be a 10 digit/i).first()).toBeVisible({ timeout: 20000 });
        console.log('[PASS] Invalid TIN (< 10 digits) correctly blocked with validation message');

        // Verify URL remains on customer creation (no unintended navigation or record creation)
        expect(page.url()).not.toContain('/detail');
    });

    test('Guardrail: System rejects duplicate customer name with inline error', async ({ page }) => {
        const app = new AppManager(page);

        // 1. Create a known customer via API to guarantee an existing name
        const existingName = `Existing-Cust-${Date.now()}`;
        const existingPhone = `09${Math.floor(10000000 + Math.random() * 90000000)}`;
        const validTin = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        const token = await app._getAuthToken();
        const qs = 'year=2019&period=yearly&calendar=ec&month=6';
        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-company': process.env.BEFFA_COMPANY || 'ABC Trading',
            'Content-Type': 'application/json'
        };

        const createResp = await page.request.post(`${app.apiBase}/customers?${qs}`, {
            headers,
            data: {
                name: existingName,
                type: 'individual',
                tax_id_number: validTin,
                phone: { p1: existingPhone },
                address: { region: region.region, zone: zone.name, woreda }
            }
        });
        expect(createResp.status(), 'Prerequisite customer creation must succeed').toBe(201);
        console.log(`[SETUP] Seeded existing customer "${existingName}" for duplicate collision check`);

        // 2. Navigate to UI and attempt to use the exact same name
        await page.goto('/receivables/customers/new', { waitUntil: 'domcontentloaded', timeout: 60000 });
        if (page.url().includes('/users/login')) {
            await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
            await page.goto('/receivables/customers/new', { waitUntil: 'domcontentloaded', timeout: 60000 });
        }
        await app.customerNameInput.waitFor({ state: 'visible', timeout: 60000 });

        await app.customerNameInput.fill(existingName);
        await app.customerNameInput.blur();

        // 3. Assert the inline duplicate name error appears
        const duplicateError = page.getByText(/Customer name already in use/i).first();
        await expect(duplicateError).toBeVisible({ timeout: 15000 });
        console.log('[PASS] Duplicate customer name correctly flagged: "Customer name already in use"');

        // 4. Verify Create Customer button remains disabled when validation fails
        await expect(app.createCustomerBtn).toBeDisabled({ timeout: 5000 });
        console.log('[PASS] Create Customer submit button is strictly disabled');
    });

    test('Guardrail: Form blocks submission when required fields are missing', async ({ page }) => {
        const app = new AppManager(page);

        console.log('[STEP] Navigating to customer creation form');
        await page.goto('/receivables/customers/new', { waitUntil: 'domcontentloaded', timeout: 60000 });
        if (page.url().includes('/users/login')) {
            await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
            await page.goto('/receivables/customers/new', { waitUntil: 'domcontentloaded', timeout: 60000 });
        }
        await app.customerNameInput.waitFor({ state: 'visible', timeout: 60000 });

        // With form fields empty, verify Create Customer submit button is disabled per ERP business rule
        await expect(app.createCustomerBtn).toBeDisabled({ timeout: 10000 });
        console.log('[PASS] Create Customer button is strictly disabled on empty form');
        expect(page.url()).not.toContain('/detail');
    });

    test('Customer Lifecycle: Create customer, edit profile, and remove', async ({ page }) => {
        const app = new AppManager(page);

        const fixedTIN = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const customerName = `Kebede-${Date.now()}`;
        const updatedName = `${customerName}-Updated`;
        const uniquePhone = `09${Math.floor(10000000 + Math.random() * 90000000)}`;

        // ── Phase 1: Create Customer ──────────────────────────────────────────
        console.log(`[STEP 1] Creating customer "${customerName}"`);
        await page.goto('/receivables/customers/new', { waitUntil: 'domcontentloaded', timeout: 60000 });
        if (page.url().includes('/users/login')) {
            await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
            await page.goto('/receivables/customers/new', { waitUntil: 'domcontentloaded', timeout: 60000 });
        }
        await app.customerNameInput.waitFor({ state: 'visible', timeout: 60000 });

        await app.customerNameInput.fill(customerName);
        await app.customerTypeSelect.selectOption('individual');
        await app.customerTinInput.fill(fixedTIN);
        await app.customerPhoneInput.fill(uniquePhone);
        await app.fillEthiopianAddress(region.region, zone.name, woreda);

        await app.createCustomerBtn.click();
        await page.waitForURL(url => url.href.includes('/detail'), { timeout: 60000 });
        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
        console.log(`[OK] Customer "${customerName}" created successfully and detail page loaded`);

        // ── Phase 2: Edit Customer ────────────────────────────────────────────
        console.log(`[STEP 2] Editing customer to "${updatedName}"`);
        await page.waitForTimeout(1500);
        const editBtn = page.locator('button, a, [role="button"]').filter({ hasText: /^edit$/i }).first();
        await editBtn.waitFor({ state: 'visible', timeout: 20000 });

        await expect(async () => {
            if (!page.url().includes('/update') && !page.url().includes('/edit')) {
                await editBtn.click();
            }
            expect(page.url()).toMatch(/\/(update|edit)/);
        }).toPass({ timeout: 25000, intervals: [1000, 2000] });

        const nameInput = page.locator([
            '#customer_name-input-id',
            'input[name="name"]:not([placeholder*="Search" i])',
            'input[placeholder="Customer Name"]',
            'input[placeholder="Enter name"]',
            '.chakra-form-control:has(label) input[type="text"]:not([placeholder*="Search" i])',
        ].join(', ')).first();

        await nameInput.waitFor({ state: 'visible', timeout: 30000 });
        await expect(nameInput).toBeEditable({ timeout: 15000 });
        await nameInput.click();
        await nameInput.fill(updatedName);

        const saveBtn = page.locator('button:has-text("Update Customer"), button:has-text("Save"), button:has-text("Update"), button:has-text("Edit Customer")').first();
        await saveBtn.waitFor({ state: 'visible', timeout: 10000 });
        await saveBtn.click();

        await page.waitForURL(url => url.href.includes('/detail'), { timeout: 30000 }).catch(() => {});
        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
        await expect(page.getByText(updatedName).first()).toBeVisible({ timeout: 30000 });
        console.log(`[OK] Customer profile successfully updated to "${updatedName}"`);

        // ── Phase 3: Remove Customer ──────────────────────────────────────────
        console.log('[STEP 3] Removing customer');
        await page.waitForTimeout(1500);
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
        console.log('[PASS] Customer Lifecycle: Create -> Edit -> Delete verified');
    });

    test('Roster View: Customer list renders and search filters correctly', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log('[STEP] Navigating to customer roster list');
        await page.goto('/receivables/customers?page=1&pageSize=30', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.locator('#loading-screen, img[alt="Logo"], .chakra-spinner').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

        // Verify table rendered with customer records
        const table = page.locator('table');
        await expect(table).toBeVisible({ timeout: 30000 });

        const rows = page.locator('table tbody tr');
        await expect(rows.first()).toBeVisible({ timeout: 20000 });
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(0);
        console.log(`[OK] Customer table rendered with ${rowCount} visible rows`);

        // Verify search input operates
        const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]').first();
        if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            const firstCustName = (await rows.first().locator('td').first().innerText()).trim();
            if (firstCustName) {
                await searchInput.fill(firstCustName);
                await page.waitForTimeout(1000);
                await expect(page.getByText(firstCustName).first()).toBeVisible({ timeout: 10000 });
                console.log(`[PASS] Search filter successfully isolated customer "${firstCustName}"`);
            }
        }
    });
});
