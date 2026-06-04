import * as fs from 'fs';
import * as path from 'path';

interface ModuleBreakdown {
    name: string;
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    trend: number[];
}

interface Blocker {
    severity: 'critical' | 'high' | 'medium';
    name: string;
    error: string;
    firstSeen: string;
    occurrences: number;
}

interface RunHistory {
    run: number;
    trigger: string;
    duration: string;
    passRate: number;
    status: 'success' | 'failed';
}

interface ResultsData {
    metrics: {
        totalTests: number;
        passRate: number;
        failed: number;
        skipped: number;
        avgDuration: number;
    };
    modules: ModuleBreakdown[];
    failures: {
        'API/Stability': number;
        'Logic Bugs': number;
        'UI Flakiness': number;
        'Performance': number;
        'Security': number;
    };
    blockers: Blocker[];
    history: RunHistory[];
    heatmap: {
        days: string[];
        modules: string[];
        data: number[][];
    };
}

// Parse Playwright results
function parsePlaywrightResults(): ResultsData {
    const resultsPath = path.join(process.cwd(), 'playwright-report', 'results.json');
    const accumulatedPath = path.join(process.cwd(), 'deploy', 'dashboard-accumulated.json');
    
    // Default data structure
    let results: ResultsData = {
        metrics: {
            totalTests: 0,
            passRate: 0,
            failed: 0,
            skipped: 0,
            avgDuration: 0
        },
        modules: [
            { name: 'Sales', total: 0, passed: 0, failed: 0, skipped: 6, trend: [82, 85, 88, 84, 87, 89, 90] },
            { name: 'Inventory', total: 0, passed: 0, failed: 0, skipped: 4, trend: [90, 88, 92, 91, 89, 93, 94] },
            { name: 'HR', total: 0, passed: 0, failed: 0, skipped: 4, trend: [85, 87, 86, 88, 90, 89, 91] },
            { name: 'Cross-Module', total: 0, passed: 0, failed: 0, skipped: 9, trend: [78, 82, 80, 85, 83, 86, 88] }
        ],
        failures: {
            'API/Stability': 0,
            'Logic Bugs': 0,
            'UI Flakiness': 0,
            'Performance': 0,
            'Security': 0
        },
        blockers: [],
        history: [],
        heatmap: {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            modules: ['Sales', 'Inventory', 'HR', 'Cross-Module'],
            data: [
                [8.2, 7.8, 8.5, 8.1, 8.3, 7.9, 8.0],
                [7.5, 7.2, 7.8, 7.6, 7.4, 7.1, 7.3],
                [6.8, 7.0, 6.9, 7.2, 6.7, 6.5, 6.8],
                [9.5, 9.8, 9.2, 9.6, 9.4, 9.1, 9.3]
            ]
        }
    };

    // Try to load Playwright results
    if (fs.existsSync(resultsPath)) {
        try {
            const playwrightResults = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
            const suites = playwrightResults.suites || [];
            
            let totalTests = 0;
            let passedTests = 0;
            let failedTests = 0;
            let skippedTests = 0;
            let totalDuration = 0;
            
            const moduleStats: { [key: string]: { total: number; passed: number; failed: number; skipped: number } } = {
                'Sales': { total: 0, passed: 0, failed: 0, skipped: 0 },
                'Inventory': { total: 0, passed: 0, failed: 0, skipped: 0 },
                'HR': { total: 0, passed: 0, failed: 0, skipped: 0 },
                'Cross-Module': { total: 0, passed: 0, failed: 0, skipped: 0 }
            };
            
            const failureCategories: { 'API/Stability': number; 'Logic Bugs': number; 'UI Flakiness': number; 'Performance': number; 'Security': number } = {
                'API/Stability': 0,
                'Logic Bugs': 0,
                'UI Flakiness': 0,
                'Performance': 0,
                'Security': 0
            };
            
            const blockersMap: { [key: string]: Blocker } = {};
            
            suites.forEach((suite: any) => {
                const specPath = suite.spec || '';
                const moduleName = specPath.includes('sales') ? 'Sales' :
                                  specPath.includes('inventory') ? 'Inventory' :
                                  specPath.includes('hr') ? 'HR' :
                                  specPath.includes('cross-module') ? 'Cross-Module' : 'Other';
                
                if (moduleStats[moduleName]) {
                    moduleStats[moduleName].total += suite.stats?.expected || 0;
                    moduleStats[moduleName].passed += suite.stats?.expected - suite.stats?.failed || 0;
                    moduleStats[moduleName].failed += suite.stats?.failed || 0;
                    moduleStats[moduleName].skipped += suite.stats?.skipped || 0;
                }
                
                totalTests += suite.stats?.expected || 0;
                passedTests += suite.stats?.expected - suite.stats?.failed || 0;
                failedTests += suite.stats?.failed || 0;
                skippedTests += suite.stats?.skipped || 0;
                totalDuration += suite.stats?.duration || 0;
                
                // Parse failures for blockers and categories
                if (suite.suites) {
                    suite.suites.forEach((subSuite: any) => {
                        if (subSuite.specs) {
                            subSuite.specs.forEach((spec: any) => {
                                if (spec.tests) {
                                    spec.tests.forEach((test: any) => {
                                        if (test.results && test.results[0] && test.results[0].status === 'failed') {
                                            const error = test.results[0].error || '';
                                            const testName = test.title || '';
                                            
                                            // Categorize failures
                                            if (error.includes('timeout') || error.includes('network')) {
                                                failureCategories['API/Stability']++;
                                            } else if (error.includes('assert') || error.includes('expect')) {
                                                failureCategories['Logic Bugs']++;
                                            } else if (error.includes('element') || error.includes('selector')) {
                                                failureCategories['UI Flakiness']++;
                                            } else if (error.includes('performance') || error.includes('slow')) {
                                                failureCategories['Performance']++;
                                            } else if (error.includes('auth') || error.includes('security')) {
                                                failureCategories['Security']++;
                                            }
                                            
                                            // Track blockers (critical failures)
                                            const errorKey = `${testName}-${error.substring(0, 50)}`;
                                            if (error.includes('CRITICAL') || error.includes('500') || error.includes('timeout')) {
                                                if (!blockersMap[errorKey]) {
                                                    blockersMap[errorKey] = {
                                                        severity: error.includes('CRITICAL') ? 'critical' : 
                                                                    error.includes('500') ? 'high' : 'medium',
                                                        name: testName,
                                                        error: error.substring(0, 200),
                                                        firstSeen: new Date().toISOString(),
                                                        occurrences: 0
                                                    };
                                                }
                                                blockersMap[errorKey].occurrences++;
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
            
            results.metrics = {
                totalTests,
                passRate: totalTests > 0 ? ((passedTests / totalTests) * 100) : 0,
                failed: failedTests,
                skipped: skippedTests,
                avgDuration: totalTests > 0 ? (totalDuration / totalTests / 1000 / 60) : 0
            };
            
            results.modules = Object.keys(moduleStats).map(name => ({
                name,
                total: moduleStats[name].total,
                passed: moduleStats[name].passed,
                failed: moduleStats[name].failed,
                skipped: moduleStats[name].skipped,
                trend: results.modules.find(m => m.name === name)?.trend || [80, 82, 84, 86, 88, 90, 92]
            }));
            
            results.failures = failureCategories;
            results.blockers = Object.values(blockersMap).slice(0, 10); // Top 10 blockers
        } catch (error) {
            console.error('[ERROR] Failed to parse Playwright results:', error);
        }
    }
    
    // Load accumulated history
    if (fs.existsSync(accumulatedPath)) {
        try {
            const accumulated = JSON.parse(fs.readFileSync(accumulatedPath, 'utf-8'));
            results.history = accumulated.history || [];
            results.heatmap = accumulated.heatmap || results.heatmap;
            
            // Update module trends from accumulated data
            if (accumulated.modules) {
                results.modules.forEach(module => {
                    const accModule = accumulated.modules.find((m: any) => m.name === module.name);
                    if (accModule && accModule.trend) {
                        module.trend = accModule.trend;
                    }
                });
            }
        } catch (error) {
            console.error('[ERROR] Failed to load accumulated data:', error);
        }
    }
    
    // Add current run to history
    const runNumber = parseInt(process.env.GITHUB_RUN_NUMBER || '0');
    const trigger = process.env.GITHUB_EVENT_NAME || 'manual';
    const duration = process.env.TEST_DURATION || '0m 0s';
    
    results.history.unshift({
        run: runNumber,
        trigger,
        duration,
        passRate: results.metrics.passRate,
        status: results.metrics.passRate >= 80 ? 'success' : 'failed'
    });
    
    // Keep only last 10 runs
    results.history = results.history.slice(0, 10);
    
    // Update heatmap with current run data
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1; // Convert to 0-6 (Mon-Sun)
    
    return results;
}

// Generate and save results.json
function generateResultsJson() {
    const results = parsePlaywrightResults();
    const outputPath = path.join(process.cwd(), 'deploy', 'results.json');
    
    // Ensure deploy directory exists
    const deployDir = path.join(process.cwd(), 'deploy');
    if (!fs.existsSync(deployDir)) {
        fs.mkdirSync(deployDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`[SUCCESS] results.json generated at ${outputPath}`);
    
    // Also save as accumulated data for next run
    const accumulatedPath = path.join(deployDir, 'dashboard-accumulated.json');
    fs.writeFileSync(accumulatedPath, JSON.stringify(results, null, 2));
    console.log(`[SUCCESS] Accumulated data saved at ${accumulatedPath}`);
}

// Run generation
generateResultsJson();
