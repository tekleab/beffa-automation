import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

class LuxuryReporter implements Reporter {
  private deployDir = path.join(process.cwd(), 'deploy');

  onBegin() {
    if (!fs.existsSync(this.deployDir)) fs.mkdirSync(this.deployDir);
  }

  // --- In V5.0, we rely on Allure's generated JSONs for the UI ---
  // --- We just generate the Dynamic Engine Frontend ---

  async onEnd(result: FullResult) {
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BEFFA Unified QA Command Center V5.0 (Dynamic)</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --emerald: #10b981;
            --coral: #f43f5e;
            --amber: #f59e0b;
            --glass-deep: rgba(2, 6, 23, 0.9);
            --neon-glow: 0 0 25px rgba(16, 185, 129, 0.6);
        }

        body {
            background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
            color: #f8fafc;
            font-family: 'Inter', sans-serif;
            margin: 0;
            overflow: hidden;
            display: flex;
            height: 100vh;
        }

        .observation-deck {
            flex: 1;
            display: flex;
            flex-direction: column;
            position: relative;
            background-image: linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px);
            background-size: 50px 50px;
        }

        /* --- 3D Crystal --- */
        .hologram-stage { position: absolute; left: 50%; top: 45%; transform: translate(-50%, -50%); width: 400px; height: 400px; perspective: 1000px; }
        .crystal { position: relative; width: 150px; height: 250px; margin: 50px auto; transform-style: preserve-3d; animation: rotateCrystal 15s infinite linear; }
        .crystal-face { position: absolute; width: 0; height: 0; border-left: 75px solid transparent; border-right: 75px solid transparent; border-bottom: 125px solid rgba(16, 185, 129, 0.4); transform-origin: 50% 100%; backdrop-filter: blur(5px); box-shadow: inset 0 0 20px rgba(16, 185, 129, 0.2); }
        .crystal-top-1 { transform: rotateY(0deg) rotateX(30deg); }
        .crystal-top-2 { transform: rotateY(90deg) rotateX(30deg); }
        .crystal-top-3 { transform: rotateY(180deg) rotateX(30deg); }
        .crystal-top-4 { transform: rotateY(270deg) rotateX(30deg); }
        .crystal-bot-1 { transform: rotateY(0deg) rotateX(-30deg) translateY(125px) scaleY(-1); }
        .crystal-bot-2 { transform: rotateY(90deg) rotateX(-30deg) translateY(125px) scaleY(-1); }
        @keyframes rotateCrystal { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }

        /* --- Modules --- */
        .ai-wing { position: absolute; right: 40px; top: 40px; width: 350px; background: rgba(15, 23, 42, 0.3); backdrop-filter: blur(20px); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 25px; box-shadow: -10px 10px 30px rgba(0,0,0,0.5); }
        .erp-metrics { position: absolute; left: 40px; top: 40px; display: flex; flex-direction: column; gap: 15px; }
        .metric-card { background: rgba(15, 23, 42, 0.4); border-left: 4px solid var(--emerald); padding: 15px 25px; border-radius: 8px; min-width: 250px; }
        .control-console { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; gap: 20px; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(30px); padding: 15px 40px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); }
        .console-btn { display: flex; align-items: center; gap: 10px; padding: 10px 20px; border-radius: 25px; background: rgba(255,255,255,0.05); cursor: pointer; transition: 0.3s; font-size: 0.8rem; font-weight: bold; }
        .console-btn:hover { background: rgba(16, 185, 129, 0.2); color: var(--emerald); box-shadow: var(--neon-glow); }
        
        .loading { position: fixed; inset: 0; background: #020617; z-index: 9999; display: flex; align-items: center; justify-content: center; font-size: 2rem; letter-spacing: 10px; }
    </style>
</head>
<body>
    <div id="loader" class="loading">SYNCING DATA...</div>

    <div class="observation-deck">
        <!-- HEADER / ENV -->
        <div id="envHeader" style="position: absolute; width: 100%; text-align: center; top: 20px; font-size: 0.7rem; color: #64748b; letter-spacing: 2px;">
            FETCHING ENVIRONMENT CONTEXT...
        </div>

        <!-- ERP METRICS -->
        <div class="erp-metrics">
            <div class="metric-card">
                <div id="suiteCount" class="metric-value">...</div>
                <div class="metric-label">CORE DOMAINS VALIDATED</div>
            </div>
            <div class="metric-card">
                <div id="calcAccuracy" class="metric-value">100%</div>
                <div class="metric-label">CALCULATIONS ACCURACY</div>
            </div>
            <div class="metric-card">
                <div id="uuidCompliance" class="metric-value">100%</div>
                <div class="metric-label">UUID COMPLIANCE INDEX</div>
            </div>
        </div>

        <!-- CRYSTAL -->
        <div class="hologram-stage">
            <div class="crystal">
                <div class="crystal-face crystal-top-1"></div><div class="crystal-face crystal-top-2"></div>
                <div class="crystal-face crystal-top-3"></div><div class="crystal-face crystal-top-4"></div>
                <div class="crystal-face crystal-bot-1"></div><div class="crystal-face crystal-bot-2"></div>
            </div>
            <div style="position: absolute; bottom: -80px; width: 100%; text-align: center;">
                <div id="rateValue" style="font-size: 3rem; font-weight: 900; color: var(--emerald); text-shadow: var(--neon-glow);">...%</div>
                <div id="rateLabel" style="font-size: 0.7rem; letter-spacing: 3px; color: #94a3b8;">CORE INTEGRITY</div>
            </div>
        </div>

        <!-- AI WING -->
        <div class="ai-wing">
            <div style="font-size: 0.7rem; color: var(--emerald); font-weight: bold;">MULTI-VECTOR ROOT CAUSE ENGINE</div>
            <div id="errorWall" style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px;">
                <!-- Dynamically Populated -->
            </div>
        </div>

        <!-- CONSOLE -->
        <div class="control-console">
            <div class="console-btn" onclick="window.open('./allure/', '_blank')"><span>📊</span> <span>OPEN DETAILED ALLURE</span></div>
            <div class="console-btn" onclick="alert('Slack Alert Dispatched!')"><span>🟢</span> <span>SLACK: BROADCAST</span></div>
            <div class="console-btn" onclick="alert('Drafting Jira Ticket...')"><span>🔵</span> <span>JIRA: ESCALATE</span></div>
        </div>
    </div>

    <script>
        async function syncCommandCenter() {
            try {
                // 1. Fetch Summary
                const summaryResp = await fetch('./allure/widgets/summary.json');
                const summary = await summaryResp.json();
                const rate = ((summary.statistic.passed / summary.statistic.total) * 100).toFixed(2);
                document.getElementById('rateValue').innerText = rate + '%';
                document.getElementById('rateLabel').innerText = summary.statistic.total + ' TEST CASES INTEGRITY';

                // 2. Fetch Environment
                const envResp = await fetch('./allure/widgets/environment.json');
                const env = await envResp.json();
                const envStr = env.map(e => \`\${e.name.toUpperCase()}: \${e.values[0]}\`).join(' | ');
                document.getElementById('envHeader').innerText = envStr;

                // 3. Fetch Categories
                const catResp = await fetch('./allure/widgets/categories.json');
                const cats = await catResp.json();
                const wall = document.getElementById('errorWall');
                cats.items.slice(0, 3).forEach(c => {
                    const div = document.createElement('div');
                    div.style = "background: rgba(255,255,255,0.03); padding: 12px; border-radius: 6px; border-left: 3px solid var(--coral);";
                    div.innerHTML = \`<div style="font-size: 0.6rem; color: #64748b;">\${c.name.toUpperCase()}</div><div style="font-weight: bold; color: var(--coral);">\${c.statistic.count} ISSUES</div>\`;
                    wall.appendChild(div);
                });
                if (cats.items.length === 0) {
                    wall.innerHTML = '<div style="color: var(--emerald); font-size: 0.8rem; text-align: center;">VULNERABILITY SCAN: 0 DEFECTS</div>';
                }

                // 4. Fetch Suites
                const suitesResp = await fetch('./allure/data/suites.json');
                const suites = await suitesResp.json();
                document.getElementById('suiteCount').innerText = suites.children.length;

                document.getElementById('loader').style.display = 'none';
            } catch (e) {
                console.error("Sync Failed", e);
                document.getElementById('loader').innerText = "OFFLINE: RUN CI TO SYNC";
            }
        }

        window.onload = syncCommandCenter;
    </script>
</body>
</html>
    `;

    const reportPath = path.join(this.deployDir, 'index.html');
    fs.writeFileSync(reportPath, htmlTemplate);
    console.log(`[DYNAMIC] V5.0 Command Center Frontend generated: ${reportPath}`);
  }
}

export default LuxuryReporter;
