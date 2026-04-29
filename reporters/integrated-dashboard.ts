import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

class IntegratedDashboard implements Reporter {
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
    <title>BEFFA High-Integrity Command Center</title>
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
            background-image: 
                linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), 
                linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px);
            background-size: 50px 50px;
        }

        /* --- Scanner Beam Animation --- */
        .observation-deck::after {
            content: ''; position: absolute; top: -100%; left: 0; width: 100%; height: 2px;
            background: linear-gradient(to right, transparent, var(--emerald), transparent);
            box-shadow: 0 0 20px var(--emerald);
            animation: scannerBeam 6s infinite linear;
            z-index: 10; opacity: 0.3;
        }
        @keyframes scannerBeam { 0% { top: -10%; } 100% { top: 110%; } }

        /* --- High-Integrity Status Display --- */
        .hologram-stage { position: absolute; left: 50%; top: 45%; transform: translate(-50%, -50%); width: 400px; height: 400px; perspective: 1000px; }
        .crystal { position: relative; width: 150px; height: 250px; margin: 50px auto; transform-style: preserve-3d; animation: rotateCrystal 15s infinite linear; }
        .crystal-face { position: absolute; width: 0; height: 0; border-left: 75px solid transparent; border-right: 75px solid transparent; border-bottom: 125px solid rgba(16, 185, 129, 0.4); transform-origin: 50% 100%; backdrop-filter: blur(5px); box-shadow: inset 0 0 20px rgba(16, 185, 129, 0.2); }
        .crystal-top-1 { transform: rotateY(0deg) rotateX(30deg); }
        .crystal-top-2 { transform: rotateY(90deg) rotateX(30deg); }
        .crystal-top-3 { transform: rotateY(180deg) rotateX(30deg); }
        .crystal-top-4 { transform: rotateY(270deg) rotateX(30deg); }
        .crystal-bot-1 { transform: rotateY(0deg) rotateX(-30deg) translateY(125px) scaleY(-1); }
        .crystal-bot-2 { transform: rotateY(90deg) rotateX(-30deg) translateY(125px) scaleY(-1); }
        .hud-overlay {
            position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
            text-align: center; z-index: 2000; pointer-events: none;
        }
        .rate-value { font-size: 3rem; font-weight: 1000; letter-spacing: -2px; line-height: 1; color: #fff; position: relative; }
        .status-container { 
            margin-top: 10px; background: rgba(15, 23, 42, 0.85); padding: 15px 30px; 
            border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.2); 
            backdrop-filter: blur(10px); display: inline-block; box-shadow: 0 20px 50px rgba(0,0,0,0.8); 
        }
        
        .ai-wing {
            position: absolute;
            right: 40px;
            top: 40px;
            width: 320px;
            z-index: 1000;
        }
        .ai-wing-header {
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.07);
            border-right: 4px solid var(--emerald);
            border-radius: 16px;
            padding: 15px 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .ai-wing-header:hover { border-color: var(--emerald); }
        .ai-wing-header .title { font-size: 0.65rem; color: var(--emerald); font-weight: 800; letter-spacing: 1px; }
        .ai-wing-header .count { background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 10px; font-size: 0.6rem; color: #fff; }
        
        .ai-dropdown {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s cubic-bezier(0, 1, 0, 1);
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(25px);
            border-radius: 0 0 16px 16px;
            margin-top: 5px;
            border: 1px solid rgba(255,255,255,0.05);
            border-top: none;
            box-shadow: 0 20px 50px rgba(0,0,0,0.7);
        }
        .ai-wing:hover .ai-dropdown, .ai-wing:focus-within .ai-dropdown {
            max-height: calc(100vh - 150px);
            transition: max-height 0.8s ease-in-out;
            overflow-y: auto;
        }
        
        .ai-item { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; border-left: 3px solid var(--coral); margin-bottom: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 8px; transition: 0.3s; position: relative; }
        .ai-item:hover { background: rgba(255,255,255,0.05); transform: scale(1.02); }
        .ai-item.known-issue { opacity: 0.4; border-left-color: #64748b; filter: grayscale(1); }
        
        .erp-metrics { position: absolute; left: 40px; top: 40px; display: flex; flex-direction: column; gap: 20px; z-index: 100; }
        .metric-card { 
            background: rgba(15, 23, 42, 0.4); 
            backdrop-filter: blur(25px);
            border: 1px solid rgba(255,255,255,0.05);
            padding: 20px 30px; 
            border-radius: 16px; 
            min-width: 280px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            position: relative;
            overflow: hidden;
            transition: 0.4s;
        }
        .metric-card:hover { transform: translateX(10px); border-color: var(--emerald); }
        .metric-card::before {
            content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 5px;
            background: linear-gradient(to bottom, var(--emerald), transparent);
        }
        .metric-value { font-size: 2.2rem; font-weight: 900; background: linear-gradient(to right, #fff, var(--emerald)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .metric-label { font-size: 0.65rem; letter-spacing: 2px; color: #64748b; margin-top: 5px; font-weight: 700; text-transform: uppercase; }
        
        .integrity-bar { height: 4px; width: 100%; background: rgba(255,255,255,0.05); border-radius: 2px; margin-top: 15px; overflow: hidden; }
        .integrity-fill { height: 100%; width: 0%; background: var(--emerald); box-shadow: 0 0 10px var(--emerald); transition: 1.5s cubic-bezier(0.19, 1, 0.22, 1); }

        .control-console { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; gap: 20px; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(30px); padding: 15px 40px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); z-index: 100; }
        .console-btn { display: flex; align-items: center; gap: 10px; padding: 10px 20px; border-radius: 25px; background: rgba(255,255,255,0.05); cursor: pointer; transition: 0.3s; font-size: 0.8rem; font-weight: bold; }
        .console-btn:hover { background: rgba(16, 185, 129, 0.2); color: var(--emerald); box-shadow: var(--neon-glow); }
        
        .trend-panel { position: absolute; bottom: 120px; width: 420px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        
        .latency-engine { position: absolute; right: 40px; bottom: 130px; z-index: 100; }
        .latency-plate { 
            background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.1); 
            padding: 15px 25px; border-radius: 16px; width: 220px; backdrop-filter: blur(15px);
            box-shadow: 0 10px 40px rgba(0,0,0,0.5); border-right: 4px solid var(--emerald);
        }

        #loginWall {
            position: fixed;
            inset: 0;
            background: #020617;
            background-image: 
                linear-gradient(rgba(16, 185, 129, 0.08) 2px, transparent 2px),
                linear-gradient(90deg, rgba(16, 185, 129, 0.08) 2px, transparent 2px),
                radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.12) 0%, transparent 40%);
            background-size: 80px 80px, 80px 80px, 100% 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(50px);
        }
        .login-card {
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(16, 185, 129, 0.4);
            padding: 70px 60px;
            border-radius: 40px;
            width: 500px;
            box-shadow: 0 40px 100px rgba(0,0,0,0.9), inset 0 0 30px rgba(16, 185, 129, 0.1);
            text-align: center;
            position: relative;
        }
        .lux-input {
            width: 100%;
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.05);
            padding: 18px 20px;
            border-radius: 12px;
            color: #fff;
            font-size: 0.9rem;
            outline: none;
            transition: 0.3s;
            box-sizing: border-box;
        }
        .login-btn {
            width: 100%;
            padding: 18px;
            margin-top: 30px;
            border-radius: 12px;
            border: none;
            background: var(--emerald);
            color: #020617;
            font-weight: 900;
            cursor: pointer;
            transition: 0.3s;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
    </style>
</head>
<body class="login-active">
    <!-- REFACTORED COMMAND CENTER -->
    <div id="loginWall">
        <div class="login-card">
            <div class="login-logo" style="font-size: 2.5rem; color: #fff; margin-bottom: 30px;">befa</div>
            <div class="input-group" style="text-align: left; margin-bottom: 20px;">
                <label style="color: #64748b; font-size: 0.7rem; text-transform: uppercase;">Identity</label>
                <input type="text" id="username" class="lux-input" placeholder="Enter credentials">
            </div>
            <div class="input-group" style="text-align: left; margin-bottom: 30px;">
                <label style="color: #64748b; font-size: 0.7rem; text-transform: uppercase;">Security Key</label>
                <input type="password" id="password" class="lux-input" placeholder="••••••••">
            </div>
            <button class="login-btn" onclick="attemptAuth()">Authenticate</button>
        </div>
    </div>
    <div class="observation-deck">
        <div style="position: absolute; top: 30px; left: 40px; font-size: 1.6rem; font-weight: 950; color: #fff;">befa<span style="color:var(--emerald);">HUB</span></div>
        
        <div class="hud-overlay">
            <div id="hudRateValue" class="rate-value">0%</div>
            <div style="margin-top: 10px; background: rgba(15, 23, 42, 0.85); padding: 10px 25px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.2); font-size: 0.7rem; letter-spacing: 2px;">INTEGRITY RATING</div>
        </div>

        <div class="erp-metrics" style="top: 120px; left: 40px;">
            <div class="metric-card">
                <div id="domainCount" class="metric-value">3</div>
                <div class="metric-label">INTEGRATED DOMAINS</div>
                <div class="integrity-bar"><div style="width: 100%" class="integrity-fill"></div></div>
            </div>
        </div>

        <div class="control-console">
            <div class="console-btn" onclick="window.open('./allure/', '_blank')"><span>📊</span> <span>AUDIT DETAILS (ALLURE)</span></div>
        </div>
    </div>
    <script>
        function attemptAuth() {
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            if (u === 'admin@beffa.com' && p === 'Beff.$#!') {
                document.getElementById('loginWall').style.display = 'none';
                syncDashboard();
            }
        }
        async function syncDashboard() {
            // Simplified dashboard sync logic
            const response = await fetch('./allure/widgets/summary.json').catch(() => ({}));
            const data = await response.json().catch(() => ({}));
            const stats = data.statistic || { passed: 0, total: 100 };
            const rate = Math.floor((stats.passed / stats.total) * 100);
            document.getElementById('hudRateValue').innerText = rate + '%';
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
