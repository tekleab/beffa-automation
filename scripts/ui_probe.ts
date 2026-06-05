import { chromium } from '@playwright/test';

const BASE = 'http://168.119.175.142:4173';
const USER = 'admin@beffa.com';
const PASS = 'Beff.$#!';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultTimeout(15000);

    // Login
    await page.goto(`${BASE}/login`);
    await page.getByRole('textbox', { name: /email/i }).fill(USER);
    await page.getByRole('textbox', { name: /password/i }).fill(PASS);
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForLoadState('networkidle');
    console.log('LOGIN OK, URL:', page.url());

    // Navigate to Projects list
    await page.goto(`${BASE}/project-management/projects`);
    await page.waitForLoadState('networkidle');
    console.log('\n=== PROJECTS LIST PAGE ===');
    console.log('URL:', page.url());

    // All buttons
    const buttons = page.getByRole('button');
    const btnCount = await buttons.count();
    console.log(`\nButtons (${btnCount}):`);
    for (let i = 0; i < btnCount; i++) {
        const txt = (await buttons.nth(i).innerText().catch(() => '')).trim();
        const aria = await buttons.nth(i).getAttribute('aria-label').catch(() => '');
        if (txt || aria) console.log(`  [${i}] "${txt}" aria="${aria}"`);
    }

    // Table headers
    const ths = page.locator('table thead th, [role="columnheader"]');
    const thCount = await ths.count();
    console.log(`\nTable Headers (${thCount}):`);
    for (let i = 0; i < thCount; i++) {
        console.log(`  ${await ths.nth(i).innerText().catch(() => '').then(t => t.trim())}`);
    }

    // Filter chips / toolbar pills
    const filterChips = page.locator('[class*="filter"], [class*="chip"], button[class*="pill"]');
    const fcCount = await filterChips.count();
    console.log(`\nFilter elements (${fcCount}):`);
    for (let i = 0; i < Math.min(fcCount, 15); i++) {
        const t = (await filterChips.nth(i).innerText().catch(() => '')).trim();
        if (t) console.log(`  "${t}"`);
    }

    // All visible text inputs
    const inputs = page.locator('input:visible, select:visible');
    const inputCount = await inputs.count();
    console.log(`\nVisible inputs (${inputCount}):`);
    for (let i = 0; i < inputCount; i++) {
        const ph = await inputs.nth(i).getAttribute('placeholder').catch(() => '');
        const type = await inputs.nth(i).getAttribute('type').catch(() => '');
        const name = await inputs.nth(i).getAttribute('name').catch(() => '');
        console.log(`  type="${type}" name="${name}" placeholder="${ph}"`);
    }

    // Pagination
    const pgText = await page.locator('text=/Page|rows per page|selected/i').first().innerText().catch(() => '');
    console.log(`\nPagination text: "${pgText}"`);

    // ── OPEN ADD PROJECT FORM ──
    console.log('\n=== CLICKING ADD PROJECT ===');
    const addBtn = page.getByRole('button', { name: /Add Project/i });
    await addBtn.click();
    await page.waitForTimeout(2000);
    console.log('URL after click:', page.url());

    // Check if modal or new page
    const isModal = await page.locator('[role="dialog"]').isVisible().catch(() => false);
    console.log('Is Modal:', isModal);

    if (isModal) {
        const dialog = page.locator('[role="dialog"]');
        // All inputs in modal
        const modalInputs = dialog.locator('input, select, textarea');
        const miCount = await modalInputs.count();
        console.log(`\nModal inputs (${miCount}):`);
        for (let i = 0; i < miCount; i++) {
            const ph = await modalInputs.nth(i).getAttribute('placeholder').catch(() => '');
            const type = await modalInputs.nth(i).getAttribute('type').catch(() => '');
            const name = await modalInputs.nth(i).getAttribute('name').catch(() => '');
            const label = await modalInputs.nth(i).evaluate((el: HTMLElement) => {
                const lbl = document.querySelector(`label[for="${el.id}"]`);
                return lbl ? lbl.textContent?.trim() : '';
            }).catch(() => '');
            console.log(`  [${i}] type="${type}" name="${name}" placeholder="${ph}" label="${label}"`);
        }
        // All labels
        const labels = dialog.locator('label');
        const lCount = await labels.count();
        console.log(`\nModal labels (${lCount}):`);
        for (let i = 0; i < lCount; i++) {
            console.log(`  "${(await labels.nth(i).innerText().catch(() => '')).trim()}"`);
        }
        // Buttons
        const mBtns = dialog.getByRole('button');
        const mBtnCount = await mBtns.count();
        console.log(`\nModal buttons (${mBtnCount}):`);
        for (let i = 0; i < mBtnCount; i++) {
            console.log(`  "${(await mBtns.nth(i).innerText().catch(() => '')).trim()}"`);
        }
    } else {
        // It navigated to a new page
        console.log('Navigated to:', page.url());
        const allInputs = page.locator('input:visible, select:visible, textarea:visible');
        const cnt = await allInputs.count();
        console.log(`\nForm inputs (${cnt}):`);
        for (let i = 0; i < cnt; i++) {
            const ph = await allInputs.nth(i).getAttribute('placeholder').catch(() => '');
            const type = await allInputs.nth(i).getAttribute('type').catch(() => '');
            const name = await allInputs.nth(i).getAttribute('name').catch(() => '');
            console.log(`  type="${type}" name="${name}" placeholder="${ph}"`);
        }
        const allLabels = page.locator('label:visible');
        const lc = await allLabels.count();
        console.log(`\nForm labels (${lc}):`);
        for (let i = 0; i < lc; i++) {
            const t = (await allLabels.nth(i).innerText().catch(() => '')).trim();
            if (t) console.log(`  "${t}"`);
        }
    }

    // ── NAVIGATE TO AN EXISTING PROJECT DETAIL ──
    // Close modal first
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Create a project via API to ensure one exists, then navigate to its detail
    // Get token from localStorage
    const token = await page.evaluate(() => {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i)!;
            const v = localStorage.getItem(k);
            if (v && v.startsWith('ey')) return v;
        }
        return null;
    });
    console.log('\nToken from LS:', token ? 'found' : 'not found');

    // Get projects list from API
    const resp = await page.request.get('http://168.119.175.142:8001/api/projects?year=2018&period=yearly&calendar=ec&page=1&pageSize=5', {
        headers: { 'x-company': 'BM Tech', 'Authorization': `Bearer ${token}` }
    });
    const data = await resp.json();
    const projects = data.items || data.data || [];
    console.log(`\nProjects in system: ${projects.length}`);

    if (projects.length > 0) {
        const pid = projects[0].id;
        console.log(`\n=== PROJECT DETAIL PAGE (${pid}) ===`);
        await page.goto(`${BASE}/project-management/projects/${pid}`);
        await page.waitForLoadState('networkidle');
        console.log('Detail URL:', page.url());

        // All visible text on detail page (headings + labels)
        const headings = page.locator('h1, h2, h3, h4, [class*="heading"], [class*="title"]');
        const hCount = await headings.count();
        console.log(`\nHeadings (${hCount}):`);
        for (let i = 0; i < Math.min(hCount, 10); i++) {
            const t = (await headings.nth(i).innerText().catch(() => '')).trim();
            if (t) console.log(`  "${t}"`);
        }

        // All buttons on detail page
        const dBtns = page.getByRole('button');
        const dBtnCount = await dBtns.count();
        console.log(`\nDetail page buttons (${dBtnCount}):`);
        for (let i = 0; i < dBtnCount; i++) {
            const txt = (await dBtns.nth(i).innerText().catch(() => '')).trim();
            const aria = await dBtns.nth(i).getAttribute('aria-label').catch(() => '');
            if (txt || aria) console.log(`  [${i}] "${txt}" aria="${aria}"`);
        }

        // Tab labels (Tasks, Details, etc.)
        const tabs = page.locator('[role="tab"], [class*="tab"]');
        const tabCount = await tabs.count();
        console.log(`\nTabs (${tabCount}):`);
        for (let i = 0; i < tabCount; i++) {
            const t = (await tabs.nth(i).innerText().catch(() => '')).trim();
            if (t) console.log(`  "${t}"`);
        }

        // Detail fields (key-value pairs)
        const detailLabels = page.locator('label, [class*="label"], dt, th');
        const dlCount = await detailLabels.count();
        console.log(`\nDetail labels/fields (${dlCount}):`);
        for (let i = 0; i < Math.min(dlCount, 20); i++) {
            const t = (await detailLabels.nth(i).innerText().catch(() => '')).trim();
            if (t && t.length < 50) console.log(`  "${t}"`);
        }

        // Check for task-add button
        const taskAddBtn = page.getByRole('button', { name: /add task|new task|\+ task/i });
        const taskBtnVisible = await taskAddBtn.isVisible().catch(() => false);
        console.log(`\nTask add button visible: ${taskBtnVisible}`);

        // All visible text blobs (status values, etc.)
        const allText = await page.locator('body').innerText();
        const statusMatch = allText.match(/pending|in-progress|completed/gi);
        console.log(`\nStatus values visible: ${[...new Set(statusMatch || [])].join(', ')}`);
    }

    await browser.close();
})();
