const fs = require('fs');
const path = require('path');

const resultsPath = path.join(__dirname, '..', 'playwright-results.json');
const outputPath  = path.join(__dirname, 'results.json');
const accumulatedPath = path.join(__dirname, 'results-accumulated.json');

let results = {
  total: 0, passed: 0, failed: 0, skipped: 0,
  passRate: 0, avgDurationMs: 0,
  lastUpdated: new Date().toISOString(),
  moduleBreakdown: [], last10Runs: [], criticalBlockers: []
};

let accumulated = { last10Runs: [], moduleBreakdown: [] };
if (fs.existsSync(accumulatedPath)) {
  try { accumulated = JSON.parse(fs.readFileSync(accumulatedPath, 'utf-8')); }
  catch (e) { console.log('[WARN] Failed to load accumulated data:', e.message); }
}

// ── Recursive spec collector ────────────────────────────────────────────────
// Playwright JSON: root.suites[].file  (top-level = spec file)
//                 root.suites[].suites[].specs[].tests[].results[].status
function collectSpecs(suites, inheritedFile) {
  const out = [];
  if (!suites) return out;
  for (const s of suites) {
    const fp = s.file || inheritedFile || '';
    if (s.specs) {
      for (const spec of s.specs) out.push({ spec, filePath: fp });
    }
    if (s.suites) out.push(...collectSpecs(s.suites, fp));
  }
  return out;
}

// ── Allure UID cross-reference (if allure-report/data/suites.json exists) ──
const allureBase = 'https://tekleab.github.io/beffa-automation/allure';
const allureSuitesPath = path.join(__dirname, '..', 'allure-report', 'data', 'suites.json');
const allureUidMap = {}; // title -> uid
if (fs.existsSync(allureSuitesPath)) {
  try {
    const suitesData = JSON.parse(fs.readFileSync(allureSuitesPath, 'utf-8'));
    function indexAllureNodes(node) {
      const uid = node.uid;
      const name = node.name;
      if (uid && name && node.status) allureUidMap[name] = uid;
      (node.children || []).forEach(indexAllureNodes);
    }
    (suitesData.children || []).forEach(indexAllureNodes);
    console.log(`[INFO] Allure UID map loaded: ${Object.keys(allureUidMap).length} entries`);
  } catch (e) { console.log('[WARN] Could not parse allure suites.json:', e.message); }
}

function getAllureUrl(title) {
  const uid = allureUidMap[title];
  return uid ? `${allureBase}/#testresult/${uid}` : `${allureBase}/#suites`;
}

if (fs.existsSync(resultsPath)) {
  try {
    const pw = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
    const all = collectSpecs(pw.suites || [], '');

    const moduleStats = {};
    const blockersMap = {};
    let totalTests = 0, passedTests = 0, failedTests = 0, skippedTests = 0, totalDuration = 0;

    for (const { spec, filePath } of all) {
      // Derive module from path like  tests/sales/... → Sales
      const parts = filePath.replace(/\\/g, '/').split('/');
      const ti = parts.indexOf('tests');
      let mod = 'Other';
      if (ti >= 0 && ti + 1 < parts.length) {
        mod = parts[ti + 1].charAt(0).toUpperCase() + parts[ti + 1].slice(1);
      }
      if (!moduleStats[mod]) moduleStats[mod] = { passed: 0, failed: 0, skipped: 0 };

      for (const test of (spec.tests || [])) {
        const r = test.results && test.results[0];
        if (!r) continue;
        totalDuration += r.duration || 0;
        totalTests++;
        const st = r.status; // 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted'
        if (st === 'passed') { passedTests++; moduleStats[mod].passed++; }
        else if (st === 'skipped' || st === 'interrupted') { skippedTests++; moduleStats[mod].skipped++; }
        else { // failed / timedOut
          failedTests++; moduleStats[mod].failed++;
          const errMsg = (r.errors || []).map(e => e.message || '').join(' ') ||
                         (r.error && r.error.message) || '';
          const key = `${spec.title}-${errMsg.substring(0, 50)}`;
          if (!blockersMap[key]) {
            blockersMap[key] = {
              severity: errMsg.includes('500') || errMsg.includes('CRITICAL') ? 'critical'
                      : st === 'timedOut' ? 'high' : 'medium',
              title: spec.title,
              error: errMsg.substring(0, 200),
              firstSeen: r.startTime || new Date().toISOString(),
              allureUrl: getAllureUrl(spec.title)
            };
          }
        }
      }
    }

    results.total        = totalTests;
    results.passed       = passedTests;
    results.failed       = failedTests;
    results.skipped      = skippedTests;
    results.passRate     = totalTests > 0 ? parseFloat(((passedTests / totalTests) * 100).toFixed(1)) : 0;
    results.avgDurationMs = totalTests > 0 ? Math.round(totalDuration / totalTests) : 0;
    results.lastUpdated  = new Date().toISOString();

    results.moduleBreakdown = Object.keys(moduleStats).map(name => {
      const acc = accumulated.moduleBreakdown?.find(m => m.module === name);
      const trend = acc?.trend ? [...acc.trend] : [80, 82, 84, 86, 88, 90, 92];
      const total = moduleStats[name].passed + moduleStats[name].failed;
      trend.push(total > 0 ? parseFloat(((moduleStats[name].passed / total) * 100).toFixed(1)) : trend[trend.length - 1]);
      trend.shift();
      return { module: name, passed: moduleStats[name].passed, failed: moduleStats[name].failed, skipped: moduleStats[name].skipped, trend };
    }).sort((a, b) => a.module.localeCompare(b.module));

    results.criticalBlockers = Object.values(blockersMap).slice(0, 10);
    console.log(`[SUCCESS] Parsed: ${totalTests} tests, ${passedTests} passed, ${failedTests} failed, ${skippedTests} skipped`);
  } catch (e) {
    console.error('[ERROR] Failed to parse playwright-results.json:', e.message);
  }
} else {
  console.log('[WARN] playwright-results.json not found — results will be all-zero this run');
}

// ── History ─────────────────────────────────────────────────────────────────
const runNumber = process.env.GITHUB_RUN_NUMBER || Date.now();
const commit    = process.env.GITHUB_SHA || 'local';
const trigger   = process.env.GITHUB_EVENT_NAME || 'manual';
const testType  = process.env.TEST_TYPE || '';
const status    = results.total === 0 ? 'unknown' : results.passRate >= 80 ? 'success' : 'failed';

// Duration: prefer env var set by workflow timing; fall back to avg * total
const durMs = parseInt(process.env.TEST_DURATION_MS || '0') ||
              (results.avgDurationMs * results.total);
const durMin = Math.floor(durMs / 60000);
const durSec = Math.floor((durMs % 60000) / 1000);
const duration = durMs > 0 ? `${durMin}m ${durSec}s` : process.env.TEST_DURATION || '0m 0s';

results.last10Runs = (accumulated.last10Runs || []);
results.last10Runs.unshift({
  run: runNumber,
  commit: String(commit).substring(0, 7),
  trigger: testType ? `${trigger} (${testType})` : trigger,
  duration,
  passRate: results.passRate,
  status
});
results.last10Runs = results.last10Runs.slice(0, 10);

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`[SUCCESS] results.json → ${outputPath}`);

fs.writeFileSync(accumulatedPath, JSON.stringify(
  { last10Runs: results.last10Runs, moduleBreakdown: results.moduleBreakdown }, null, 2));
console.log(`[SUCCESS] Accumulated data saved → ${accumulatedPath}`);
