import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

async function globalTeardown() {
    const root = process.cwd();
    const allureResults = path.join(root, 'allure-results');
    const allureReport = path.join(root, 'allure-report');

    // Only generate if there are actual results
    if (!fs.existsSync(allureResults) || fs.readdirSync(allureResults).length === 0) {
        console.log('[TEARDOWN] No allure-results found, skipping report generation.');
        return;
    }

    try {
        console.log('[TEARDOWN] Generating fresh Allure report...');
        execSync(`npx allure generate ${allureResults} --clean -o ${allureReport}`, {
            cwd: root,
            stdio: 'inherit',
        });
        console.log(`[TEARDOWN] ✓ Allure report generated at: ${allureReport}`);
        console.log(`[TEARDOWN]   → Open with: npx allure open`);
    } catch (e) {
        console.warn('[TEARDOWN] ⚠ Allure generation failed (is allure installed?). Skipping.');
    }
}

export default globalTeardown;
