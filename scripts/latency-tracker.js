const fs = require('fs');
const path = require('path');

/**
 * Tactical Latency Tracker V1.0
 * This script runs after allure generate, extracts latency metrics,
 * and maintains a historical trend file for the dashboard.
 */

const allureReportDir = path.join(process.cwd(), 'allure-report');
const historyFile = path.join(process.cwd(), 'gh-pages/allure/widgets/latency-trend.json');
const outputFile = path.join(allureReportDir, 'widgets/latency-trend.json');

function trackLatency() {
    try {
        console.log('[PERF] Starting Latency History Sync...');
        
        // 1. Get current run stats
        const summaryPath = path.join(allureReportDir, 'widgets/summary.json');
        if (!fs.existsSync(summaryPath)) {
            console.error('[ERR] Allure summary not found at:', summaryPath);
            return;
        }
        const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
        
        const total = summary.statistic.total || 0;
        const duration = summary.time.duration || 0;
        const avgLatency = total > 0 ? (duration / total) : 0;
        
        // 2. Load existing history
        let history = [];
        if (fs.existsSync(historyFile)) {
            try {
                history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
                console.log(`[PERF] Loaded ${history.length} historical data points.`);
            } catch (e) {
                console.warn('[WARN] History file corrupted, starting fresh.');
            }
        }

        // 3. Add new data point (limit to 20 for performance)
        const newPoint = {
            timestamp: Date.now(),
            avgLatency: Math.round(avgLatency),
            totalTests: total,
            runId: process.env.GITHUB_RUN_ID || 'local'
        };
        
        history.unshift(newPoint);
        history = history.slice(0, 20); // Keep last 20 runs
        
        // 4. Write to report widgets (for the dashboard to find)
        const widgetDir = path.join(allureReportDir, 'widgets');
        if (!fs.existsSync(widgetDir)) fs.mkdirSync(widgetDir, { recursive: true });
        
        fs.writeFileSync(outputFile, JSON.stringify(history, null, 2));
        console.log(`[SUCCESS] Latency Trend updated. Current Avg: ${newPoint.avgLatency}ms`);

    } catch (error) {
        console.error('[ERR] Latency Tracking failed:', error);
    }
}

trackLatency();
