const fs = require('fs');
const path = require('path');

// Read playwright-results.json
const resultsPath = path.join(__dirname, '..', 'playwright-results.json');
const outputPath = path.join(__dirname, 'results.json');
const accumulatedPath = path.join(__dirname, 'results-accumulated.json');

// Default data structure
let results = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  passRate: 0,
  avgDurationMs: 0,
  lastUpdated: new Date().toISOString(),
  moduleBreakdown: [
    { module: 'Sales', passed: 0, failed: 0, skipped: 0, trend: [82, 85, 88, 84, 87, 89, 90] },
    { module: 'Inventory', passed: 0, failed: 0, skipped: 0, trend: [90, 88, 92, 91, 89, 93, 94] },
    { module: 'HR', passed: 0, failed: 0, skipped: 0, trend: [85, 87, 86, 88, 90, 89, 91] },
    { module: 'Cross-Module', passed: 0, failed: 0, skipped: 0, trend: [78, 82, 80, 85, 83, 86, 88] }
  ],
  last10Runs: [],
  criticalBlockers: []
};

// Load accumulated data if exists
let accumulated = { last10Runs: [], moduleBreakdown: results.moduleBreakdown };
if (fs.existsSync(accumulatedPath)) {
  try {
    accumulated = JSON.parse(fs.readFileSync(accumulatedPath, 'utf-8'));
  } catch (e) {
    console.log('[WARN] Failed to load accumulated data:', e.message);
  }
}

// Parse Playwright results
if (fs.existsSync(resultsPath)) {
  try {
    const playwrightResults = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
    const suites = playwrightResults.suites || [];
    
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;
    let totalDuration = 0;
    
    const moduleStats = {
      'Sales': { passed: 0, failed: 0, skipped: 0 },
      'Inventory': { passed: 0, failed: 0, skipped: 0 },
      'HR': { passed: 0, failed: 0, skipped: 0 },
      'Cross-Module': { passed: 0, failed: 0, skipped: 0 }
    };
    
    const blockersMap = {};
    
    suites.forEach(suite => {
      const specPath = suite.spec || '';
      const moduleName = specPath.includes('sales') ? 'Sales' :
                        specPath.includes('inventory') ? 'Inventory' :
                        specPath.includes('hr') ? 'HR' :
                        specPath.includes('cross-module') ? 'Cross-Module' : 'Other';
      
      if (moduleStats[moduleName]) {
        moduleStats[moduleName].passed += suite.stats?.expected - suite.stats?.failed || 0;
        moduleStats[moduleName].failed += suite.stats?.failed || 0;
        moduleStats[moduleName].skipped += suite.stats?.skipped || 0;
      }
      
      totalTests += suite.stats?.expected || 0;
      passedTests += suite.stats?.expected - suite.stats?.failed || 0;
      failedTests += suite.stats?.failed || 0;
      skippedTests += suite.stats?.skipped || 0;
      totalDuration += suite.stats?.duration || 0;
      
      // Parse failures for blockers
      if (suite.suites) {
        suite.suites.forEach(subSuite => {
          if (subSuite.specs) {
            subSuite.specs.forEach(spec => {
              if (spec.tests) {
                spec.tests.forEach(test => {
                  if (test.results && test.results[0] && test.results[0].status === 'failed') {
                    const error = test.results[0].error || '';
                    const testName = test.title || '';
                    
                    // Track critical blockers
                    const errorKey = `${testName}-${error.substring(0, 50)}`;
                    if (error.includes('CRITICAL') || error.includes('500') || error.includes('timeout')) {
                      if (!blockersMap[errorKey]) {
                        blockersMap[errorKey] = {
                          severity: error.includes('CRITICAL') ? 'critical' : 
                                    error.includes('500') ? 'high' : 'medium',
                          title: testName,
                          error: error.substring(0, 200),
                          firstSeen: new Date().toISOString()
                        };
                      }
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
    
    results.total = totalTests;
    results.passed = passedTests;
    results.failed = failedTests;
    results.skipped = skippedTests;
    results.passRate = totalTests > 0 ? ((passedTests / totalTests) * 100) : 0;
    results.avgDurationMs = totalTests > 0 ? (totalDuration / totalTests) : 0;
    results.lastUpdated = new Date().toISOString();
    
    // Update module breakdown with trend from accumulated data
    results.moduleBreakdown = Object.keys(moduleStats).map(name => {
      const accModule = accumulated.moduleBreakdown?.find(m => m.module === name);
      const trend = accModule?.trend || [80, 82, 84, 86, 88, 90, 92];
      // Update trend with current pass rate
      const currentPassRate = moduleStats[name].passed + moduleStats[name].failed > 0 
        ? ((moduleStats[name].passed / (moduleStats[name].passed + moduleStats[name].failed)) * 100) 
        : trend[trend.length - 1];
      trend.push(currentPassRate);
      trend.shift(); // Keep only 7 days
      
      return {
        module: name,
        passed: moduleStats[name].passed,
        failed: moduleStats[name].failed,
        skipped: moduleStats[name].skipped,
        trend: [...trend]
      };
    });
    
    results.criticalBlockers = Object.values(blockersMap).slice(0, 10);
  } catch (error) {
    console.error('[ERROR] Failed to parse Playwright results:', error.message);
  }
}

// Add current run to history
const runNumber = process.env.GITHUB_RUN_NUMBER || Date.now();
const commit = process.env.GITHUB_SHA || 'local';
const trigger = process.env.GITHUB_EVENT_NAME || 'manual';
const duration = process.env.TEST_DURATION || '0m 0s';
const status = results.passRate >= 80 ? 'success' : 'failed';

results.last10Runs = accumulated.last10Runs || [];
results.last10Runs.unshift({
  run: runNumber,
  commit: commit.substring(0, 7),
  duration,
  passRate: results.passRate,
  trigger,
  status
});
results.last10Runs = results.last10Runs.slice(0, 10);

// Write results.json
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`[SUCCESS] results.json generated at ${outputPath}`);

// Write accumulated data for next run
fs.writeFileSync(accumulatedPath, JSON.stringify({
  last10Runs: results.last10Runs,
  moduleBreakdown: results.moduleBreakdown
}, null, 2));
console.log(`[SUCCESS] Accumulated data saved at ${accumulatedPath}`);
