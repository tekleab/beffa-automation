import * as fs from 'fs';
import * as path from 'path';

// Get test type from environment variable
const TEST_TYPE = process.env.TEST_TYPE || 'unknown';
const RUN_TIMESTAMP = new Date().toISOString();
const RUN_DATE = new Date().toLocaleString('en-US', { 
  timeZone: 'UTC',
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});
console.log(`[DASHBOARD] Test Type: ${TEST_TYPE}`);
console.log(`[DASHBOARD] Run Timestamp: ${RUN_TIMESTAMP}`);

// Read Playwright results from the test-results directory
const resultsDir = path.join(process.cwd(), 'test-results');
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;
let capturedIssues: { title: string; category: string; description: string }[] = [];

if (fs.existsSync(resultsDir)) {
  const files = fs.readdirSync(resultsDir);
  console.log(`[DASHBOARD] Found ${files.length} files in test-results`);
  
  // Try to read from Allure results first (more reliable)
  const allureDir = path.join(process.cwd(), 'allure-results');
  if (fs.existsSync(allureDir)) {
    console.log(`[DASHBOARD] Reading from Allure results`);
    const allureFiles = fs.readdirSync(allureDir);
    console.log(`[DASHBOARD] Found ${allureFiles.length} files in allure-results`);
    for (const file of allureFiles) {
      if (file.endsWith('.json') && file !== 'categories.json' && file !== 'environment.json' && file !== 'executor.json') {
        try {
          const content = fs.readFileSync(path.join(allureDir, file), 'utf8');
          const data = JSON.parse(content);
          
          // Allure test result structure
          if (data.fullName || data.name) {
            totalTests++;
            if (data.status === 'passed') {
              passedTests++;
            } else if (data.status === 'failed') {
              failedTests++;
              
              let cat = 'STABILITY';
              const testName = data.fullName || data.name || '';
              if (testName.toLowerCase().includes('security') || testName.toLowerCase().includes('concurrency')) cat = 'SECURITY_RACE';
              if (testName.toLowerCase().includes('reject') || testName.toLowerCase().includes('guardrail')) cat = 'LOGIC_VULN';
              
              capturedIssues.push({
                title: data.name || data.fullName,
                category: cat,
                description: data.statusDetails?.message?.substring(0, 100).replace(/[<>]/g, '') || 'Test failed'
              });
            } else if (data.status === 'skipped' || data.status === 'broken') {
              skippedTests++;
            }
          }
        } catch (e) {
          console.log(`[DASHBOARD] Error parsing ${file}:`, e);
        }
      }
    }
  } else {
    console.log(`[DASHBOARD] Allure directory not found: ${allureDir}`);
    
    // Fallback: try to read from results.json (JSON reporter)
    const resultsFile = path.join(resultsDir, 'results.json');
    if (fs.existsSync(resultsFile)) {
      try {
        const content = fs.readFileSync(resultsFile, 'utf8');
        const data = JSON.parse(content);
        console.log(`[DASHBOARD] Reading results from ${resultsFile}`);
        
        if (data.suites) {
          for (const suite of data.suites) {
            if (suite.specs) {
              for (const spec of suite.specs) {
                if (spec.tests) {
                  for (const test of spec.tests) {
                    totalTests++;
                    const lastResult = test.results[test.results.length - 1];
                    if (lastResult?.status === 'failed' || lastResult?.status === 'timedOut') {
                      failedTests++;
                      
                      let cat = 'STABILITY';
                      if (test.title.toLowerCase().includes('security') || test.title.toLowerCase().includes('concurrency')) cat = 'SECURITY_RACE';
                      if (test.title.toLowerCase().includes('reject') || test.title.toLowerCase().includes('guardrail')) cat = 'LOGIC_VULN';
                      
                      capturedIssues.push({
                        title: test.title,
                        category: cat,
                        description: lastResult?.error?.message?.split('\n')[0].substring(0, 100).replace(/[<>]/g, '') || 'Unexpected system state detected.'
                      });
                    }
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        console.log(`[DASHBOARD] Error parsing ${resultsFile}:`, e);
      }
    }
  }
} else {
  console.log(`[DASHBOARD] Results directory not found: ${resultsDir}`);
}

// Calculate metrics
const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 100;
const issueCount = capturedIssues.length;

console.log(`[DASHBOARD] Total Tests: ${totalTests}`);
console.log(`[DASHBOARD] Failed Tests: ${failedTests}`);
console.log(`[DASHBOARD] Pass Rate: ${passRate}%`);
console.log(`[DASHBOARD] Issues: ${issueCount}`);

// Generate HTML
let reproHtml = '';
if (issueCount === 0) {
  reproHtml = '<div class="issue-item" style="border-left-color: var(--emerald); opacity: 0.7;"><div class="issue-tag">CLEAN</div><div class="issue-desc">All financial guardrails passed successfully.</div></div>';
} else {
  capturedIssues.forEach(issue => {
    reproHtml += `
      <div class="issue-item">
        <div class="issue-tag">${issue.category}</div>
        <div class="issue-desc"><b>${issue.title}</b>: ${issue.description}</div>
      </div>`;
  });
}

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BEFFA QA Dashboard</title>
    <style>
        :root {
            --primary: #3b82f6; --success: #10b981; --danger: #ef4444; --warning: #f59e0b;
            --dark: #0f172a; --darker: #020617; --light: #f8fafc; --gray: #64748b; --border: #1e293b;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: var(--darker); color: var(--light); line-height: 1.6; }
        .container { max-width: 1400px; margin: 0 auto; padding: 32px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
        .logo { font-size: 1.5rem; font-weight: 800; } .logo span { color: var(--primary); }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .metric { background: var(--dark); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
        .metric-label { font-size: 0.7rem; font-weight: 600; color: var(--gray); text-transform: uppercase; margin-bottom: 8px; }
        .metric-value { font-size: 2rem; font-weight: 800; }
        .metric-value.success { color: var(--success); } .metric-value.danger { color: var(--danger); }
        .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
        .panel { background: var(--dark); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
        .panel-header { padding: 20px; border-bottom: 1px solid var(--border); font-weight: 700; }
        .panel-content { padding: 20px; }
        .issue { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; padding: 16px; margin-bottom: 12px; }
        .issue-cat { font-size: 0.65rem; font-weight: 700; color: var(--danger); text-transform: uppercase; margin-bottom: 8px; }
        .issue-title { font-weight: 600; margin-bottom: 4px; }
        .issue-desc { font-size: 0.8rem; color: var(--gray); }
        .actions { display: flex; gap: 12px; margin-top: 24px; }
        .btn { flex: 1; padding: 12px 20px; border: 1px solid var(--border); border-radius: 8px; background: var(--dark); color: var(--light); font-weight: 600; cursor: pointer; text-align: center; }
        .btn:hover { background: var(--primary); border-color: var(--primary); }
        .btn.primary { background: var(--primary); border-color: var(--primary); }
        @media (max-width: 1024px) { .grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">befa<span>QA</span></div>
            <div style="font-size: 0.8rem; color: var(--gray);">${RUN_DATE} UTC</div>
        </div>
        <div class="metrics">
            <div class="metric">
                <div class="metric-label">Test Type</div>
                <div class="metric-value">${TEST_TYPE.toUpperCase()}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Total Tests</div>
                <div class="metric-value">${totalTests}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Passed</div>
                <div class="metric-value success">${passedTests}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Failed</div>
                <div class="metric-value danger">${failedTests}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Pass Rate</div>
                <div class="metric-value">${passRate}%</div>
            </div>
        </div>
        <div class="grid">
            <div class="panel">
                <div class="panel-header">Test Execution Summary</div>
                <div class="panel-content">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
                        <div style="text-align: center; padding: 16px; background: rgba(16, 185, 129, 0.1); border-radius: 8px;">
                            <div style="font-size: 0.7rem; color: var(--gray); text-transform: uppercase; margin-bottom: 8px;">Passed</div>
                            <div style="font-size: 1.5rem; font-weight: 800; color: var(--success);">${passedTests}</div>
                        </div>
                        <div style="text-align: center; padding: 16px; background: rgba(239, 68, 68, 0.1); border-radius: 8px;">
                            <div style="font-size: 0.7rem; color: var(--gray); text-transform: uppercase; margin-bottom: 8px;">Failed</div>
                            <div style="font-size: 1.5rem; font-weight: 800; color: var(--danger);">${failedTests}</div>
                        </div>
                        <div style="text-align: center; padding: 16px; background: rgba(245, 158, 11, 0.1); border-radius: 8px;">
                            <div style="font-size: 0.7rem; color: var(--gray); text-transform: uppercase; margin-bottom: 8px;">Skipped</div>
                            <div style="font-size: 1.5rem; font-weight: 800; color: var(--warning);">${skippedTests}</div>
                        </div>
                    </div>
                    <div style="height: 8px; background: var(--border); border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; background: var(--success); width: ${(passedTests/totalTests)*100}%;"></div>
                    </div>
                </div>
            </div>
            <div class="panel">
                <div class="panel-header">Issues (${issueCount})</div>
                <div class="panel-content" style="max-height: 400px; overflow-y: auto;">
                    ${issueCount === 0 ? '<div style="text-align: center; padding: 32px; color: var(--gray);">No issues detected</div>' : reproHtml}
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="btn primary" onclick="window.open('./allure/', '_blank')">📊 View Allure Report</div>
            <div class="btn">🟢 Slack</div>
            <div class="btn">🔵 Jira</div>
        </div>
    </div>
</body>
</html>
`;

const deployDir = path.join(process.cwd(), 'deploy');
if (!fs.existsSync(deployDir)) fs.mkdirSync(deployDir);
const outputPath = path.join(deployDir, 'index.html');
fs.writeFileSync(outputPath, htmlTemplate);
console.log(`[SUCCESS] Integrated Dashboard generated at ${outputPath}`);
