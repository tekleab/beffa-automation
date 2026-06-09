import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test('Diagnostic: which field enables Create project button', async ({ page }) => {
    const app = new AppManager(page);
    await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    const meta = await app.api.project.discoverMetadataAPI();

    await page.goto('/project-management/projects/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const saveBtn = page.locator('button[type="submit"]').filter({ hasText: /Create project/i });
    const check = async (label: string) => {
        const en = await saveBtn.isEnabled().catch(() => false);
        console.log(`[${en ? 'ENABLED ✓' : 'disabled  '}] ${label}`);
        return en;
    };

    await page.locator('input#ref').fill(`PRJ-${Date.now()}`);
    await page.locator('input#project_name').fill(`E2E-Diag-${Date.now()}`);
    await check('ref + name');

    // Customer popover — [0]=Clear, [1]=input#customer_id, [2][4]...=option buttons
    await page.locator('button#customer_id').click();
    await page.waitForTimeout(600);
    const custInput = page.locator('.chakra-popover__content input#customer_id');
    await custInput.waitFor({ state: 'visible', timeout: 5000 });
    await custInput.fill(meta.customerName);
    await page.waitForTimeout(800);
    const custOpt = page.locator('.chakra-popover__content button')
        .filter({ hasText: meta.customerName }).first();
    if (await custOpt.isVisible({ timeout: 3000 }).catch(() => false)) {
        await custOpt.click();
    } else {
        await page.locator('.chakra-popover__content button').nth(1).click();
    }
    await page.waitForTimeout(400);
    const custVal = await page.locator('input#customer_id').inputValue();
    console.log(`customer_id value after selection: "${custVal}"`);
    await check('customer selected');

    // Workspace popover — [0]=Clear, [1]=input#workspace_id, [2]=option button
    await page.locator('button#workspace_id').click();
    await page.waitForTimeout(600);
    const wsInput = page.locator('.chakra-popover__content input#workspace_id');
    await wsInput.waitFor({ state: 'visible', timeout: 5000 });
    await wsInput.fill(meta.workspaceName);
    await page.waitForTimeout(800);
    const wsOpt = page.locator('.chakra-popover__content button')
        .filter({ hasText: meta.workspaceName }).first();
    if (await wsOpt.isVisible({ timeout: 3000 }).catch(() => false)) {
        await wsOpt.click();
    } else {
        await page.locator('.chakra-popover__content button').nth(1).click();
    }
    await page.waitForTimeout(600);
    const wsVal = await page.locator('input#workspace_id').inputValue();
    console.log(`workspace_id value after selection: "${wsVal}"`);
    await check('workspace selected');

    // workflow_set_id — appears after workspace selection
    const wfSelect = page.locator('select#workflow_set_id');
    if (await wfSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
        const opts = await wfSelect.locator('option').count();
        console.log(`workflow_set_id options: ${opts}`);
        if (opts > 1) {
            await wfSelect.selectOption({ index: 1 });
            await check('workflow_set_id selected');
        }
    } else {
        console.log('workflow_set_id not visible');
    }

    await page.screenshot({ path: 'test-results/diag-final.png' });
});
