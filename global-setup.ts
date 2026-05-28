import * as fs from 'fs';
import * as path from 'path';

async function globalSetup() {
    const root = process.cwd();

    // 1. Clean Allure results so the report only shows THIS run
    const allureResults = path.join(root, 'allure-results');
    if (fs.existsSync(allureResults)) {
        fs.rmSync(allureResults, { recursive: true, force: true });
        console.log('[SETUP] ✓ Cleaned allure-results/');
    }
    fs.mkdirSync(allureResults, { recursive: true });

    // 2. Reset dashboard accumulator so the pass rate starts fresh
    const accumulator = path.join(root, 'deploy', 'dashboard-accumulated.json');
    if (fs.existsSync(accumulator)) {
        fs.unlinkSync(accumulator);
        console.log('[SETUP] ✓ Reset dashboard-accumulated.json');
    }
}

export default globalSetup;
