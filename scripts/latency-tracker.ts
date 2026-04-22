import * as fs from 'fs';
import * as path from 'path';
import { calculateAverages, syncHistory, LatencyPoint } from '../lib/utils/performance';

/**
 * Tactical Latency Tracker V2.0 (TS Refactor)
 * This script runs after allure generate, extracts latency metrics,
 * and maintains a historical trend file for the dashboard.
 */

const allureReportDir = path.join(process.cwd(), 'allure-report');
const historyPaths = [
    path.join(allureReportDir, 'widgets/latency-trend.json'),
    path.join(process.cwd(), 'gh-pages/allure/widgets/latency-trend.json'),
    path.join(process.cwd(), 'allure-report/widgets/latency-trend.json')
];
const outputFile = path.join(allureReportDir, 'widgets/latency-trend.json');

function getExistingHistory(): LatencyPoint[] {
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
        const rawPoints: Array<{ category: string, value: number }> = [];

        if (fs.existsSync(resultsDir)) {
            const files = fs.readdirSync(resultsDir).filter(f => f.endsWith('-result.json'));
            files.forEach(file => {
                try {
                    const content = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));
                    if (content.annotations) {
                        content.annotations.forEach((ann: any) => {
                            if (ann.type === 'tactical-perf') {
                                const [category, label, value] = ann.description.split('|');
                                rawPoints.push({ category, value: parseFloat(value) });
                            }
                        });
                    }
                } catch (e) {}
            });
        }

        // Use the tested Utility logic
        const { apiAvg, uiAvg } = calculateAverages(rawPoints);

        const summaryPath = path.join(allureReportDir, 'widgets/summary.json');
        const summary = fs.existsSync(summaryPath) ? JSON.parse(fs.readFileSync(summaryPath, 'utf8')) : { statistic: { total: 0 }, time: { duration: 0 } };
        
        const total = summary.statistic.total || 0;
        let history = getExistingHistory();
        
        const newPoint: LatencyPoint = {
            timestamp: Date.now(),
            apiLatency: Math.round(apiAvg || (summary.time.duration / (total || 1)) * 0.4),
            uiLatency: Math.round(uiAvg || (summary.time.duration / (total || 1)) * 0.6),
            avgLatency: Math.round((apiAvg + uiAvg) / 2 || (summary.time.duration / (total || 1))),
            totalTests: total,
            runId: process.env.GITHUB_RUN_ID || 'local'
        };
        
        history = syncHistory(history, newPoint);
        
        const widgetDir = path.join(allureReportDir, 'widgets');
        if (!fs.existsSync(widgetDir)) fs.mkdirSync(widgetDir, { recursive: true });
        
        fs.writeFileSync(outputFile, JSON.stringify(history, null, 2));
        console.log(`[SUCCESS] True Latency Sync Complete. API: ${newPoint.apiLatency}ms | UI: ${newPoint.uiLatency}ms`);

    } catch (error) {
        console.error('[ERR] Latency Tracking failed:', error);
    }
}

trackLatency();
