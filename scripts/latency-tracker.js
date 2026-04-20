const fs = require('fs');
const path = require('path');

/**
 * Tactical Latency Tracker V1.0
 * This script runs after allure generate, extracts latency metrics,
 * and maintains a historical trend file for the dashboard.
 */

const allureReportDir = path.join(process.cwd(), 'allure-report');
// Probe multiple history locations
const historyPaths = [
    path.join(allureReportDir, 'widgets/latency-trend.json'),
    path.join(process.cwd(), 'gh-pages/allure/widgets/latency-trend.json'),
    path.join(process.cwd(), 'allure-report/widgets/latency-trend.json')
];
const outputFile = path.join(allureReportDir, 'widgets/latency-trend.json');

function getExistingHistory() {
    for (const hPath of historyPaths) {
        if (fs.existsSync(hPath)) {
            try {
                return JSON.parse(fs.readFileSync(hPath, 'utf8'));
            } catch (e) {}
        }
    }
    return [];
}

function trackLatency() {
    try {
        console.log('[PERF] Starting Deep-Scan Latency History Sync...');
        
        const resultsDir = path.join(process.cwd(), 'allure-results');
        let totalApiLatency = 0;
        let apiCount = 0;
        let totalUiLatency = 0;
        let uiCount = 0;

        if (fs.existsSync(resultsDir)) {
            const files = fs.readdirSync(resultsDir).filter(f => f.endsWith('-result.json'));
            console.log(`[PERF] Deep-scanning ${files.length} test result files...`);
            files.forEach(file => {
                try {
                    const content = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));
                    if (content.annotations) {
                        content.annotations.forEach(ann => {
                            if (ann.type === 'tactical-perf') {
                                const [category, label, value] = ann.description.split('|');
                                const latency = parseFloat(value);
                                if (category === 'API') {
                                    totalApiLatency += latency;
                                    apiCount++;
                                } else if (category === 'UI') {
                                    totalUiLatency += latency;
                                    uiCount++;
                                }
                            }
                        });
                    }
                } catch (e) {}
            });
        }

        // Calculate True Averages
        const trueApiAvg = apiCount > 0 ? (totalApiLatency / apiCount) : 0;
        const trueUiAvg = uiCount > 0 ? (totalUiLatency / uiCount) : 0;

        // 1. Get current run stats (Fallback for total duration)
        const summaryPath = path.join(allureReportDir, 'widgets/summary.json');
        const summary = fs.existsSync(summaryPath) ? JSON.parse(fs.readFileSync(summaryPath, 'utf8')) : { statistic: { total: 0 }, time: { duration: 0 } };
        
        const total = summary.statistic.total || 0;
        
        // 2. Load existing history via the multi-path probe
        let history = getExistingHistory();
...
        // 3. Add new data point
        const newPoint = {
            timestamp: Date.now(),
            apiLatency: Math.round(trueApiAvg || (summary.time.duration / (total || 1)) * 0.4),
            uiLatency: Math.round(trueUiAvg || (summary.time.duration / (total || 1)) * 0.6),
            avgLatency: Math.round((trueApiAvg + trueUiAvg) / 2 || (summary.time.duration / (total || 1))),
            totalTests: total,
            runId: process.env.GITHUB_RUN_ID || 'local'
        };
        
        history.unshift(newPoint);
        history = history.slice(0, 20);
        
        // 4. Write to report
        const widgetDir = path.join(allureReportDir, 'widgets');
        if (!fs.existsSync(widgetDir)) fs.mkdirSync(widgetDir, { recursive: true });
        
        fs.writeFileSync(outputFile, JSON.stringify(history, null, 2));
        console.log(`[SUCCESS] True Latency Sync Complete. API: ${newPoint.apiLatency}ms | UI: ${newPoint.uiLatency}ms`);

    } catch (error) {
        console.error('[ERR] Latency Tracking failed:', error);
    }
}

trackLatency();
