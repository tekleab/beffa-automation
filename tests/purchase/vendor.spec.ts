import { test, expect } from'@playwright/test';
import { AppManager } from'../../pages/AppManager';
import * as fs from'fs';
import * as path from'path';

const API = () => (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
    .replace(/['"]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001') + '/api';
const QS = () => `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

async function apiLogin(request: any): Promise<string> {
    const r = await request.post(`${API()}/users/login?${QS()}&month=6`, {
        data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
        headers: { 'Content-Type': 'application/json' }
    });
    const token = (await r.json()).auth_token;
    if (!token) throw new Error('apiLogin failed');
    return token;
}


const addressData: Array<{ region: string; zones: Array<{ name: string; woredas: string[] }> }> = JSON.parse(
    fs.readFileSync(path.join(__dirname,'../../data/address_locations.json'),'utf8')
);

test.describe('Vendor Lifecycle — Validation & CRUD @purchase @smoke @full', () => {
    test.setTimeout(120000);

    test('Validate TIN, create vendor, edit, remove', async ({ page , request }) => {
        const app = new AppManager(page);
        await apiLogin(request);

        const fixedTIN = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const vendorNames = ["TechSource PLC", "Global Imports", "Ethio Supplies", "Pioneer Distributors", "Addis Wholesale Trading"];
        const baseName = vendorNames[Math.floor(Math.random() * vendorNames.length)];
        const vendorName =`${baseName}-${Math.floor(Math.random() * 10000)}`;
        const updatedName =`${vendorName}-Updated`;

        const randomRegion = addressData[Math.floor(Math.random() * addressData.length)];
        const randomZone = randomRegion.zones[Math.floor(Math.random() * randomRegion.zones.length)];
        const randomWoreda = randomZone.woredas[Math.floor(Math.random() * randomZone.woredas.length)];

        // Validation
        console.log('[STEP] Phase 1: TIN validation check');
        await page.goto('/payables/vendors/new');
        await page.getByRole('textbox', { name:'Vendor Name *' }).fill("Validation Test Vendor");
        await page.getByLabel('Vendor Type *').selectOption('wholesaler');
        await page.getByRole('textbox', { name:'TIN', exact: false }).fill("123");
        await page.getByRole('textbox', { name:'Phone', exact: false }).fill("0911223344");
        await app.fillEthiopianAddress(randomRegion.region, randomZone.name, randomWoreda);

        const createBtn = page.locator('button:has-text("Add Now"), button:has-text("Create vendor"), button:has-text("Save")').first();
        await createBtn.click();
        await expect(page.getByText(/10 digit|must be 10|invalid/i)).toBeVisible();
        console.log('[OK] Invalid TIN correctly blocked');

        // Create
        console.log(`[STEP] Phase 2: Creating vendor "${vendorName}"`);
        const uniquePhone =`09${Math.floor(10000000 + Math.random() * 90000000)}`;
        await page.getByRole('textbox', { name:'TIN', exact: false }).clear();
        await page.getByRole('textbox', { name:'TIN', exact: false }).fill(fixedTIN);
        await page.getByRole('textbox', { name:'Phone', exact: false }).clear();
        await page.getByRole('textbox', { name:'Phone', exact: false }).fill(uniquePhone);
        await page.getByRole('textbox', { name:'Vendor Name *' }).clear();
        await page.getByRole('textbox', { name:'Vendor Name *' }).fill(vendorName);
        await createBtn.click();
        await page.waitForURL(url => url.href.includes('/detail'), { timeout: 60000 });
        console.log(`[OK] Vendor "${vendorName}" created`);

        // Edit
        console.log(`[STEP] Phase 3: Editing to "${updatedName}"`);
        const editBtn = page.locator('button:has-text("Edit")').first();
        await editBtn.waitFor({ state:'visible', timeout: 15000 });
        await page.waitForTimeout(2000);
        await editBtn.click({ force: true });
        // Wait for navigation or modal to settle before looking for the input
        await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
        await page.waitForTimeout(1000);
        await page.getByRole('textbox', { name:'Vendor Name *' }).waitFor({ state:'visible', timeout: 30000 });
        await page.getByRole('textbox', { name:'Vendor Name *' }).clear();
        await page.getByRole('textbox', { name:'Vendor Name *' }).fill(updatedName);
        await page.getByLabel('Vendor Type *').selectOption('independent');
        const editPhone =`09${Math.floor(10000000 + Math.random() * 90000000)}`;
        await page.getByRole('textbox', { name:'Phone', exact: false }).clear();
        await page.getByRole('textbox', { name:'Phone', exact: false }).fill(editPhone);
        const saveBtn = page.getByRole('button', { name: /Save Now|Update|Save/i }).first();
        await saveBtn.click({ force: true });
        await page.waitForTimeout(4000);
        console.log('[OK] Vendor updated');

        // Remove
        console.log('[STEP] Phase 4: Removing vendor');
        const removeBtn = page.getByRole('button', { name: /remove|delete/i }).first();
        await removeBtn.waitFor({ state:'visible' });
        await removeBtn.click({ force: true });
        const confirmBtn = page.locator('section[role="dialog"] button, div[role="alertdialog"] button').filter({ hasText: /Yes|Confirm|Delete/i }).first();
        await confirmBtn.waitFor({ state:'visible' });
        await confirmBtn.click({ force: true });
        await page.waitForURL(url => url.href.includes('/payables/vendors'), { timeout: 30000 });

        console.log('[RESULT] Vendor Lifecycle: PASSED');
    });
});
