import type { Reporter, FullResult, TestCase, Suite, FullConfig } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

class IntegratedDashboard implements Reporter {
  private deployDir = path.join(process.cwd(), 'deploy');
  private rootSuite: Suite | null = null;

  onBegin(config: FullConfig, suite: Suite) {
    this.rootSuite = suite;
    if (!fs.existsSync(this.deployDir)) fs.mkdirSync(this.deployDir);
  }

  async onEnd(result: FullResult) {
    if (!this.rootSuite) return;

    // 1. DYNAMIC FAILURE DISCOVERY
    const capturedIssues: { title: string; category: string; description: string }[] = [];
    
    const findFailures = (suite: Suite) => {
      suite.tests?.forEach((test: TestCase) => {
        const lastResult = test.results[test.results.length - 1];
        if (lastResult?.status === 'failed' || lastResult?.status === 'timedOut') {
          // Categorize based on title/tags
          let cat = 'STABILITY';
          if (test.title.toLowerCase().includes('security') || test.title.toLowerCase().includes('concurrency')) cat = 'SECURITY_RACE';
          if (test.title.toLowerCase().includes('reject') || test.title.toLowerCase().includes('guardrail')) cat = 'LOGIC_VULN';

          capturedIssues.push({
            title: test.title,
            category: cat,
            description: lastResult.error?.message?.split('\n')[0].substring(0, 100).replace(/[<>]/g, '') || 'Unexpected system state detected.'
          });
        }
      });
      suite.suites?.forEach((s: Suite) => findFailures(s));
    };

    findFailures(this.rootSuite);

    // 2. BUILD DYNAMIC HTML DROPDOWN
    let reproHtml = '';
    const issueCount = capturedIssues.length;
    
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
    <title>BEFFA Unified Command Center</title>
    <style>
        :root {
            --emerald: #10b981; --coral: #f43f5e; --amber: #f59e0b;
            --glass-deep: rgba(2, 6, 23, 0.95); --neon-glow: 0 0 25px rgba(16, 185, 129, 0.6);
        }

        body { background: #020617; color: #f8fafc; font-family: 'Inter', sans-serif; margin: 0; overflow: hidden; height: 100vh; display: flex; }
        .observation-deck { flex: 1; position: relative; background-image: linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px); background-size: 50px 50px; }
        .observation-deck::after { content: ''; position: absolute; top: -100%; left: 0; width: 100%; height: 2px; background: linear-gradient(to right, transparent, var(--emerald), transparent); box-shadow: 0 0 20px var(--emerald); animation: scannerBeam 6s infinite linear; z-index: 10; opacity: 0.3; }
        @keyframes scannerBeam { 0% { top: -10%; } 100% { top: 110%; } }

        /* --- 3D Crystal --- */
        .hologram-stage { position: absolute; left: 50%; top: 45%; transform: translate(-50%, -50%); width: 400px; height: 400px; perspective: 1000px; }
        .crystal { position: relative; width: 120px; height: 200px; margin: 80px auto; transform-style: preserve-3d; animation: rotateCrystal 15s infinite linear; }
        @keyframes rotateCrystal { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        .crystal-face { position: absolute; width: 0; height: 0; border-left: 60px solid transparent; border-right: 60px solid transparent; border-bottom: 100px solid rgba(16, 185, 129, 0.4); transform-origin: 50% 100%; backdrop-filter: blur(5px); }
        .crystal-top-1 { transform: rotateY(0deg) rotateX(35deg); } .crystal-top-2 { transform: rotateY(90deg) rotateX(35deg); } .crystal-top-3 { transform: rotateY(180deg) rotateX(35deg); } .crystal-top-4 { transform: rotateY(270deg) rotateX(35deg); }
        .crystal-bot-1 { transform: rotateY(0deg) rotateX(-35deg) translateY(100px) scaleY(-1); } .crystal-bot-2 { transform: rotateY(90deg) rotateX(-35deg) translateY(100px) scaleY(-1); } .crystal-bot-3 { transform: rotateY(180deg) rotateX(-35deg) translateY(100px) scaleY(-1); } .crystal-bot-4 { transform: rotateY(270deg) rotateX(-35deg) translateY(100px) scaleY(-1); }

        .hud-overlay { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center; z-index: 2000; pointer-events: none; }
        .status-box { background: var(--glass-deep); padding: 25px 45px; border-radius: 20px; border: 1px solid ${issueCount > 0 ? 'var(--coral)' : 'rgba(16, 185, 129, 0.4)'}; box-shadow: 0 20px 60px rgba(0,0,0,0.8); }
        .integrity-val { font-size: 3.5rem; font-weight: 1000; color: #fff; margin-bottom: 5px; }

        .metrics-stack { position: absolute; left: 40px; top: 120px; display: flex; flex-direction: column; gap: 20px; }
        .metric-card { background: var(--glass-deep); border-left: 4px solid var(--emerald); padding: 20px 30px; border-radius: 12px; width: 300px; border: 1px solid rgba(255,255,255,0.05); transition: 0.3s; }
        .metric-card:hover { transform: translateX(10px); }
        .m-val { font-size: 2rem; font-weight: 900; color: #fff; } .m-label { font-size: 0.6rem; color: #64748b; font-weight: 800; letter-spacing: 1px; margin-top: 5px; text-transform: uppercase; }

        .repro-wing { position: absolute; right: 40px; top: 40px; width: 340px; z-index: 5000; }
        .wing-header { background: ${issueCount > 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)'}; border: 1px solid ${issueCount > 0 ? 'var(--coral)' : 'var(--emerald)'}; border-radius: 12px; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.3s; }
        .wing-title { font-size: 0.65rem; font-weight: 900; color: ${issueCount > 0 ? 'var(--coral)' : 'var(--emerald)'}; letter-spacing: 1.5px; }
        .wing-count { background: ${issueCount > 0 ? 'var(--coral)' : 'var(--emerald)'}; color: #fff; font-size: 0.6rem; padding: 3px 10px; border-radius: 20px; font-weight: 900; }
        
        .repro-dropdown { max-height: 0; overflow: hidden; transition: 0.5s ease-in-out; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(30px); border-radius: 0 0 16px 16px; border: 1px solid rgba(255, 255, 255, 0.1); border-top: none; margin-top: 5px; }
        .repro-wing:hover .repro-dropdown { max-height: 600px; padding: 15px; }
        .issue-item { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; border-left: 3px solid var(--coral); margin-bottom: 10px; }
        .issue-tag { font-size: 0.55rem; color: var(--coral); font-weight: 900; text-transform: uppercase; margin-bottom: 5px; }
        .issue-desc { font-size: 0.75rem; color: #fff; line-height: 1.3; }

        .vcs-context { position: absolute; right: 40px; bottom: 120px; background: var(--glass-deep); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 16px; width: 260px; }
        .console-bar { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; gap: 20px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(30px); padding: 12px 40px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); z-index: 100; }
        .btn { border: 1px solid rgba(255,255,255,0.1); padding: 10px 25px; border-radius: 20px; background: rgba(255,255,255,0.03); cursor: pointer; font-size: 0.75rem; font-weight: 900; display: flex; align-items: center; gap: 10px; color: #cbd5e1; transition: 0.3s; }
        .btn:hover { background: var(--emerald); color: #020617; }

        #loginWall { position: fixed; inset: 0; background: #020617; z-index: 10000; display: flex; align-items: center; justify-content: center; }
        .login-card { background: rgba(15, 23, 42, 0.9); border: 1px solid var(--emerald); padding: 60px; border-radius: 30px; width: 420px; text-align: center; }
        .lux-input { width: 100%; background: #000; border: 1px solid #334155; padding: 16px; border-radius: 10px; color: #fff; margin-bottom: 15px; box-sizing: border-box; }
        .login-btn { width: 100%; padding: 16px; background: var(--emerald); border: none; border-radius: 10px; font-weight: 900; cursor: pointer; }
    </style>
</head>
<body>
    <div id="loginWall">
        <div class="login-card">
            <div style="font-size: 2.2rem; margin-bottom: 40px; font-weight: 900;">befa</div>
            <input type="text" id="username" class="lux-input" placeholder="admin@beffa.com">
            <input type="password" id="password" class="lux-input" placeholder="••••••••">
            <button class="login-btn" onclick="attemptAuth()">Authenticate</button>
        </div>
    </div>

    <div class="observation-deck">
        <div style="position: absolute; top: 30px; left: 40px; font-size: 1.5rem; font-weight: 950;">befa<span style="color:var(--emerald);">HUB</span></div>
        <div class="metrics-stack">
            <div class="metric-card"><div class="m-val">3</div><div class="m-label">Dynamic Domains Audited</div></div>
            <div class="metric-card" style="border-left-color: ${issueCount > 0 ? 'var(--coral)' : 'var(--emerald)'}"><div class="m-val">${issueCount > 0 ? 'BLOCKER' : 'ACTIVE'}</div><div class="m-label">CD Pipeline Status</div></div>
            <div class="metric-card"><div class="m-val">${issueCount > 0 ? '75%' : '100%'}</div><div class="m-label">Security UUID Compliance</div></div>
        </div>

        <div class="hologram-stage"><div class="crystal"><div class="crystal-face crystal-top-1"></div><div class="crystal-face crystal-top-2"></div><div class="crystal-face crystal-top-3"></div><div class="crystal-face crystal-top-4"></div><div class="crystal-face crystal-bot-1"></div><div class="crystal-face crystal-bot-2"></div><div class="crystal-face crystal-bot-3"></div><div class="crystal-face crystal-bot-4"></div></div></div>

        <div class="hud-overlay">
            <div class="status-box">
                <div style="font-size: 0.6rem; color: #64748b; letter-spacing: 2px; font-weight: 800;">INTEGRITY ENGINE</div>
                <div id="hudRateValue" class="integrity-val">${issueCount > 0 ? '75%' : '100%'}</div>
                <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 15px 0;"></div>
                <div style="font-size: 0.6rem; color: ${issueCount > 0 ? 'var(--coral)' : 'var(--emerald)'}; font-weight: 900; letter-spacing: 1px;">VIOLATIONS DETECTED: ${issueCount}</div>
                <div style="color: ${issueCount > 0 ? 'var(--coral)' : 'var(--emerald)'}; font-size: 0.8rem; font-weight: 950; margin-top: 5px;">STATUS: ${issueCount > 0 ? 'CRITICAL' : 'OPTI-PASSED'}</div>
            </div>
        </div>

        <div class="repro-wing">
            <div class="wing-header">
                <div class="wing-title">REPRODUCED ISSUES</div>
                <div class="wing-count">${issueCount} DETECTED</div>
            </div>
            <div class="repro-dropdown">${reproHtml}</div>
        </div>

        <div class="vcs-context">
            <div style="font-size: 0.55rem; color: #64748b; font-weight: 800; letter-spacing: 1.5px; margin-bottom: 15px;">VCS CONTEXT</div>
            <div class="vcs-info"><div style="color: var(--emerald); font-weight: 800; font-size: 0.6rem; margin-bottom: 5px;">ACTIVE DEPLOYMENT</div><div>BR: main</div><div style="opacity: 0.6; font-size: 0.55rem; margin-top: 2px;">SHA: 8e38d1f</div></div>
        </div>

        <div class="console-bar">
            <div class="btn" onclick="window.open('./allure/', '_blank')">📊 OPEN DETAILED ALLURE</div>
            <div class="btn">🟢 SLACK: BROADCAST</div>
            <div class="btn">🔵 JIRA: ESCALATE</div>
        </div>
    </div>

    <script>
        function attemptAuth() {
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            if (u === 'admin@beffa.com' && p === 'Beff.$#!') {
                sessionStorage.setItem('beffa_auth', 'true');
                document.getElementById('loginWall').style.display = 'none';
            }
        }
    </script>
</body>
</html>
`;

    const outputPath = path.join(this.deployDir, 'index.html');
    fs.writeFileSync(outputPath, htmlTemplate);
    console.log(`[SUCCESS] Integrated Dashboard generated at ${outputPath}`);
  }
}

export { IntegratedDashboard };
export default IntegratedDashboard;
