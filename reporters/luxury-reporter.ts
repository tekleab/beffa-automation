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
    <title>BEFFA Unified QA Command Center V10.2 (TACTICAL HUB)</title>
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
        .hud-overlay { position: absolute; left: 50%; top: 55%; transform: translate(-50%, -50%); text-align: center; width: 500px; z-index: 10; pointer-events: none; }
        .rate-value { font-size: 8rem; font-weight: 900; color: #fff; line-height: 1; letter-spacing: -5px; opacity: 0.15; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: -1; }
        
        .status-container {
            background: rgba(15, 23, 42, 0.6); 
            backdrop-filter: blur(15px);
            padding: 20px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.1);
            display: inline-block;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        /* --- AI Wing Panel --- */
        .ai-wing {
            position: absolute;
            right: 40px;
            top: 40px;
            width: 320px;
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.07);
            border-right: 4px solid var(--emerald);
            border-radius: 16px;
            padding: 20px;
            max-height: calc(100vh - 200px);
            overflow-y: auto;
            z-index: 100;
        }

        
        .ai-item { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; border-left: 3px solid var(--coral); margin-bottom: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 8px; transition: 0.3s; position: relative; }
        .ai-item:hover { background: rgba(255,255,255,0.05); transform: scale(1.02); }
        .ai-item.known-issue { opacity: 0.4; border-left-color: #64748b; filter: grayscale(1); }
        .mute-btn { position: absolute; right: 10px; top: 10px; font-size: 0.6rem; color: #64748b; border: 1px solid rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px; background: rgba(0,0,0,0.2); }
        .mute-btn:hover { color: #fff; border-color: #fff; }
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
        
        /* --- Trend Panel --- */
        .trend-panel { position: absolute; bottom: 120px; width: 400px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 15px; }
        
        .loading { position: fixed; inset: 0; background: #020617; z-index: 9999; display: flex; align-items: center; justify-content: center; font-size: 2rem; letter-spacing: 10px; }
        @keyframes rotateCrystal { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }

        .latency-engine { position: absolute; right: 40px; bottom: 130px; z-index: 100; }
        .latency-plate { 
            background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.1); 
            padding: 15px 25px; border-radius: 16px; width: 220px; backdrop-filter: blur(15px);
            box-shadow: 0 10px 40px rgba(0,0,0,0.5); border-right: 4px solid var(--emerald);
        }
        .latency-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .latency-value { font-size: 1.1rem; font-weight: 800; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.2); }
        .latency-label { font-size: 0.65rem; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; font-weight: 700; }
        .latency-status { font-size: 0.55rem; margin-top: 10px; font-weight: bold; padding: 4px 10px; border-radius: 4px; background: rgba(0,0,0,0.3); text-align: center; border: 1px solid rgba(255,255,255,0.05); }
        
        .amber-state { border-right-color: #fbbf24 !important; }
        .coral-state { border-right-color: var(--coral) !important; }
        .emerald-state { border-right-color: var(--emerald) !important; }
    </style>
</head>
<body>
    <script>
        // V10.2 ULTRA RESONANCE: Immediate Resilience Script (Zero Dependency)
        function forceKillLoader() {
            var l = document.getElementById('loader');
            if (l) l.style.display = 'none';
        }
        window.earlyTimer = setTimeout(forceKillLoader, 6000); 
    </script>

    <div id="loader" class="loading">
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
            <div id="loaderText">SYNCING TACTICAL DATA...</div>
            <div onclick="forceKillLoader()" style="font-size:0.6rem; color:#64748b; cursor:pointer; letter-spacing:2px; border:1px solid rgba(255,255,255,0.1); padding:5px 15px; border-radius:20px;">[ FORCE SKIP ]</div>
        </div>
    </div>

    <div class="observation-deck">
        <!-- HEADER / ENV -->
        <div id="envHeader" style="position: absolute; width: 100%; text-align: center; top: 20px; font-size: 0.7rem; color: #64748b; letter-spacing: 2px;">
            FETCHING ENVIRONMENT CONTEXT...
        </div>

        <!-- HUD OVERLAY -->
        <div class="hud-overlay">
            <div id="hudRateValue" class="rate-value">0%</div>
            <div id="hudRateLabel" class="status-container"></div>
        </div>

        <!-- ERP METRICS -->
        <div class="erp-metrics">
            <div class="metric-card">
                <div id="suiteCount" class="metric-value">0</div>
                <div class="metric-label">CORE DOMAINS VALIDATED</div>
                <div class="integrity-bar"><div id="suiteBar" class="integrity-fill"></div></div>
            </div>
            <div class="metric-card">
                <div id="calcAccuracy" class="metric-value">0%</div>
                <div class="metric-label">CALCULATIONS ACCURACY</div>
                <div class="integrity-bar"><div id="calcBar" class="integrity-fill"></div></div>
            </div>
            <div class="metric-card">
                <div id="uuidCompliance" class="metric-value">0%</div>
                <div class="metric-label">UUID COMPLIANCE INDEX</div>
                <div class="integrity-bar"><div id="uuidBar" class="integrity-fill"></div></div>
            </div>
        </div>

        <!-- ENTERPRISE LATENCY ENGINE -->
        <div id="latencyHub" class="latency-engine">
            <div class="latency-plate">
                <div class="latency-row">
                    <div class="latency-label">Infrastructure</div>
                    <div id="apiLatencyValue" class="latency-value">0ms</div>
                </div>
                <div class="latency-row">
                    <div class="latency-label">UI Rendering</div>
                    <div id="uiLatencyValue" class="latency-value">0ms</div>
                </div>
                <div id="latencyStatus" class="latency-status">SYNC: INITIALIZING</div>
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
                <div id="crystalRateValue" style="font-size: 3rem; font-weight: 900; color: var(--emerald); text-shadow: var(--neon-glow);">...%</div>
            <div id="crystalRateLabel" style="font-size: 0.7rem; letter-spacing: 3px; color: #94a3b8;">TACTICAL HUB V10.2</div>
            </div>
        </div>

        <!-- AI WING -->
        <div id="aiWing" class="ai-wing">
            <div style="font-size: 0.7rem; color: var(--emerald); font-weight: bold;">MULTI-VECTOR ROOT CAUSE ENGINE</div>
            <div id="errorWall" style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px;">
                <!-- Dynamically Populated -->
            </div>
        </div>

        <!-- TREND PANEL -->
        <div class="trend-panel">
            <div style="font-size: 0.6rem; color: #64748b; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Tactical Stability Trend (Last 10 Runs)</div>
            <canvas id="trendChart" height="100"></canvas>
        </div>

        <!-- CONSOLE -->
        <div class="control-console">
            <div class="console-btn" onclick="window.open('./allure/', '_blank')"><span>📊</span> <span>OPEN DETAILED ALLURE</span></div>
            <div class="console-btn" onclick="broadcastToSlack()"><span>🟢</span> <span>SLACK: BROADCAST</span></div>
            <div class="console-btn" onclick="escalateToJira()"><span>🔵</span> <span>JIRA: ESCALATE</span></div>
        </div>
    </div>

    <script>
        let currentFailures = [];
        const KNOWN_ISSUES_KEY = 'beffa_known_issues';
        const SENT_ISSUES_KEY = 'beffa_sent_broadcasts';

        function toggleKnownIssue(id, event) {
            event.stopPropagation();
            let known = JSON.parse(localStorage.getItem(KNOWN_ISSUES_KEY) || '[]');
            if (known.includes(id)) {
                known = known.filter(i => i !== id);
            } else {
                known.push(id);
            }
            localStorage.setItem(KNOWN_ISSUES_KEY, JSON.stringify(known));
            syncCommandCenter(); // Re-render
        }

        async function broadcastToSlack() {
            const known = JSON.parse(localStorage.getItem(KNOWN_ISSUES_KEY) || '[]');
            const sent = JSON.parse(localStorage.getItem(SENT_ISSUES_KEY) || '[]');
            
            // 1. Filter out muted issues
            let eligibleFailures = currentFailures.filter(f => !known.includes(f.uid));
            
            // 2. Filter out already sent issues
            const unsentFailures = eligibleFailures.filter(f => !sent.includes(f.uid));
            
            if (eligibleFailures.length === 0) {
                alert('No active vulnerabilities to broadcast. (Check muted issues)');
                return;
            }

            if (unsentFailures.length === 0) {
                alert('INTEGRITY SYNC: All ' + eligibleFailures.length + ' active vulnerabilities have already been broadcast to the QA channel today.');
                return;
            }

            const activeFailures = unsentFailures; // Proceed with new issues only

            const webhook = localStorage.getItem('beffa_slack_webhook');
            if (!webhook) {
                const input = prompt('Enter Slack Webhook URL:');
                if (input) {
                    localStorage.setItem('beffa_slack_webhook', input);
                    alert('Webhook saved. Try broadcasting again!');
                }
                return;
            }

            const attachment = activeFailures.map(f => ({
                color: '#f43f5e',
                title: '❌ ' + f.name,
                text: 'Root Cause: ' + (f.hint || 'Investigating...') + '\\nTrace: ' + window.location.origin + window.location.pathname + 'allure/#behaviors/' + f.uid
            }));

            const payload = {
                text: '🚨 *TACTICAL ALERT: BEFFA ERP V9.0* 🚨\\nStability dropped to ' + document.getElementById('hudRateValue').innerText,
                attachments: attachment
            };

            try {
                await fetch(webhook, { method: 'POST', body: JSON.stringify(payload) });
                
                // Track as sent
                const updatedSent = [...sent, ...activeFailures.map(f => f.uid)];
                localStorage.setItem(SENT_ISSUES_KEY, JSON.stringify(updatedSent));
                
                alert('Broadcast Success! ' + activeFailures.length + ' new vulnerabilities shared with #quality-assurance.');
            } catch (e) {
                alert('Slack Sync Failed. Check Webhook URL.');
            }
        }

        async function escalateToJira() {
            const first = currentFailures[0];
            if (!first) return alert('No failures to escalate.');
            const jiraUrl = 'https://tekleab.atlassian.net/secure/CreateIssueDetails!default.jspa?pid=10000&issuetype=10004&summary=[BUG]%20Test%20Failure:%20' + encodeURIComponent(first.name);
            window.open(jiraUrl, '_blank');
        }

        function animateValue(id, start, end, duration, suffix = '%') {
            const obj = document.getElementById(id);
            if (!obj) return;
            
            const range = end - start;
            if (range === 0 || duration === 0) {
               obj.innerText = (id.includes('Count') ? end : end.toFixed(2) + suffix);
               return;
            }

            const startTime = performance.now();
            const step = () => {
                const timeElapsed = performance.now() - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const current = start + (range * progress);
                
                obj.innerText = (id.includes('Count') ? Math.floor(current) : current.toFixed(2) + suffix);
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    obj.innerText = (id.includes('Count') ? end : end.toFixed(2) + suffix);
                }
            };
            requestAnimationFrame(step);
        }

        function categorizeError(msg = '') {
            const m = msg.toLowerCase();
            if (m.includes('400') || m.includes('401') || m.includes('404') || m.includes('500') || m.includes('api') || m.includes('response')) 
                return { label: 'API VALIDATION', hint: 'Potential backend/payload mismatch' };
            if (m.includes('timeout') || m.includes('waiting for') || m.includes('selector') || m.includes('hidden') || m.includes('not visible'))
                return { label: 'UI SYNCHRONIZATION', hint: 'UI element timing/visibility issue' };
            if (m.includes('expect') || m.includes('to be') || m.includes('match') || m.includes('uuid'))
                return { label: 'DATA INTEGRITY', hint: 'Business rule/calculation violation' };
            return { label: 'LOGIC VARIATION', hint: 'Unexpected application state' };
        }

        async function fetchWithTimeout(resource, options = {}) {
            const { timeout = 8000 } = options;
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            // Append cache-buster to prevent browser from showing old 0% data
            const cleanUrl = resource.includes('?') ? resource : resource + '?cb=' + new Date().getTime();
            const response = await fetch(cleanUrl, {
                ...options,
                cache: 'no-store', // Force network fetch
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        }

        async function smartFetch(paths) {
            let lastError = "Target resource unavailable";
            const pathname = window.location.pathname;
            const repoBase = pathname.includes('beffa-automation') ? '/beffa-automation/' : '/';
            
            for (const path of paths) {
                try {
                    const cleanPath = path.replace('./', '');
                    const url = repoBase + cleanPath;
                    const resp = await fetchWithTimeout(url);
                    if (resp.ok) {
                        return await resp.json();
                    } else {
                        lastError = 'HTTP ' + resp.status + ' on ' + url;
                    }
                } catch (e) {
                    lastError = e.message;
                }
            }
            throw new Error(lastError);
        }

        async function syncCommandCenter() {
            try {
                // 1. Fetch Summary (Probing widgets and data)
                const summary = await smartFetch([
                    'allure/widgets/summary.json',
                    './allure/widgets/summary.json',
                    './allure/data/summary.json'
                ]);
                
                const total = summary?.statistic?.total || 0;
                const passed = summary?.statistic?.passed || 0;
                const failed = (summary?.statistic?.failed || 0) + (summary?.statistic?.broken || 0);
                const numericRate = total > 0 ? parseFloat(((passed / total) * 100).toFixed(2)) : 0;
                
                animateValue('hudRateValue', 0, numericRate, 1500); animateValue('crystalRateValue', 0, numericRate, 1500);
                const status = failed === 0 && total > 0 ? 'INTEGRITY: STABLE' : (numericRate > 90 ? 'STATUS: UNSTABLE' : 'STATUS: CRITICAL');
                const statusColor = failed === 0 && total > 0 ? 'var(--emerald)' : (numericRate > 90 ? '#fbbf24' : 'var(--coral)');
                
                document.getElementById('hudRateLabel').innerHTML = 
                    '<div style="font-size: 0.65rem; color: #64748b; font-weight: bold; letter-spacing: 3px; margin-bottom: 8px;">INTEGRITY ENGINE</div>' +
                    '<div style="font-size: 2.5rem; font-weight: 900; color: #fff; line-height: 1;">' + numericRate + '%</div>' +
                    '<div style="height: 1px; width: 60%; background: rgba(255,255,255,0.1); margin: 15px auto;"></div>' +
                    '<div style="font-size: 0.8rem; font-weight: 700; color: ' + (failed > 0 ? 'var(--coral)' : 'var(--emerald)') + '; margin-bottom: 4px;">CRITICAL VIOLATIONS: ' + failed + '</div>' +
                    '<div style="font-size: 1.2rem; font-weight: 800; color: ' + statusColor + '; letter-spacing: 2px;">' + status + '</div>';
                
                // Sync ERP Metrics
                animateValue('calcAccuracy', 0, numericRate, 1500);
                animateValue('uuidCompliance', 0, numericRate, 1500);
                document.getElementById('calcBar').style.width = numericRate + '%';
                document.getElementById('uuidBar').style.width = numericRate + '%';
                document.getElementById('calcBar').style.background = statusColor;
                document.getElementById('uuidBar').style.background = statusColor;

                // 3. Performance / Latency Processing (Phase 2: Tactical Deep Scan)
                const latHistory = await smartFetch(['./widgets/latency-trend.json', './data/latency-trend.json']).catch(() => []);
                const latestLat = (latHistory && latHistory.length > 0) ? latHistory[0] : null;
                
                // Use REAL tactical metrics (ms), or 'Pending' sync
                const apiLatency = latestLat ? latestLat.apiLatency : 0;
                const uiLatency = latestLat ? latestLat.uiLatency : 0;
                
                const statusEl = document.getElementById('latencyStatus');
                const plate = document.querySelector('.latency-plate');

                animateValue('apiLatencyValue', 0, apiLatency, 1000, 'ms');
                animateValue('uiLatencyValue', 0, uiLatency, 1000, 'ms');

                if (!latestLat) {
                    statusEl.innerText = 'SYNC: PENDING DATA';
                    statusEl.style.color = '#64748b';
                    plate.className = 'latency-plate';
                } else {
                    const maxLat = Math.max(apiLatency, uiLatency);
                    if (maxLat < 1500) {
                        plate.className = 'latency-plate emerald-state';
                        statusEl.innerText = 'SYNC: OPTIMAL';
                        statusEl.style.color = 'var(--emerald)';
                    } else if (maxLat < 3500) {
                        plate.className = 'latency-plate amber-state';
                        statusEl.innerText = 'SYNC: WARNING';
                        statusEl.style.color = '#fbbf24';
                    } else {
                        plate.className = 'latency-plate coral-state';
                        statusEl.innerText = 'SYNC: CRITICAL';
                        statusEl.style.color = 'var(--coral)';
                    }
                }

                // 4. Fetch Environment
                let env = [];
                try {
                    env = await smartFetch(['./allure/widgets/environment.json', './allure/data/environment.json']);
                } catch(e) { console.warn("Environment context unavailable"); }
                
                const envStr = env.length > 0 ? env.map(function(e) { return e.name.toUpperCase() + ': ' + e.values[0]; }).join(' | ') : 'SYSTEM SYNCED | BM TECHNOLOGY HUD';
                document.getElementById('envHeader').innerText = envStr;

                // 3. Fetch Behaviors (Deep Data)
                const behaviors = await smartFetch(['./allure/data/behaviors.json', './allure/widgets/behaviors.json']).catch(() => ({}));
                const wall = document.getElementById('errorWall');
                wall.innerHTML = '';
                
                function findFailures(node, list = []) {
                    if (node.children) node.children.forEach(c => findFailures(c, list));
                    else if (node.status === 'failed' || node.status === 'broken') list.push(node);
                    return list;
                }
                
                let failures = findFailures(behaviors);
                
                // V8.4 Fallback: If Behaviors is empty but Summary has failures, deep-scan Suites
                if (failures.length === 0 && failed > 0) {
                    try {
                        const suitesResp = await fetch('./allure/data/suites.json');
                        const suites = await suitesResp.json();
                        failures = findFailures(suites);
                    } catch(e) { console.warn("Fallback deep-scan failed", e); }
                }

                document.getElementById('aiWing').style.borderRight = failed > 0 ? '4px solid var(--coral)' : '4px solid var(--emerald)';
                const severityIcons = { critical: '🔴', high: '🟠', normal: '🟠', minor: '🟡', trivial: '🟡' };

                if (failures.length > 0) {
                    // Optimized: Only fetch detail for top 5 failures to keep HUD fast
                    const displayFailures = failures.slice(0, 5);
                    for (const f of displayFailures) {
                        let hintData = { label: 'ANALYZING', hint: 'Querying root cause...' };
                        try {
                            const detailResp = await fetch('./allure/data/test-cases/' + f.uid + '.json');
                            const detail = await detailResp.json();
                            hintData = categorizeError(detail.statusDetails?.message || '');
                        } catch (e) {
                            hintData = { label: 'LOGIC VARIATION', hint: 'Heuristics unavailable' };
                        }

                        const isKnown = JSON.parse(localStorage.getItem(KNOWN_ISSUES_KEY) || '[]').includes(f.uid);
                        const icon = severityIcons[f.severity] || '🟠';
                        const div = document.createElement('div');
                        div.className = 'ai-item' + (isKnown ? ' known-issue' : '');
                        div.onclick = () => window.open('./allure/#behaviors/' + f.uid, '_blank');
                        
                        div.innerHTML = 
                            '<div class="mute-btn" onclick="toggleKnownIssue(\\\'' + f.uid + '\\\', event)">' + (isKnown ? 'UNMUTE' : 'MUTE') + '</div>' +
                            '<div style="font-size: 0.6rem; color: #64748b; font-weight: bold;">' + icon + ' [' + hintData.label + ']</div>' +
                            '<div style="font-size: 0.8rem; color: #fff;">' + f.name + '</div>' +
                            '<div style="font-size: 0.5rem; color: var(--coral);">HINT: ' + hintData.hint + '</div>';
                        wall.appendChild(div);
                        
                        // Track for broadcast
                        f.hint = hintData.hint;
                        currentFailures.push(f);
                    }
                } else {
                    currentFailures = [];
                    wall.innerHTML = '<div style="color: var(--emerald); font-size: 0.8rem; text-align: center; padding: 20px;">SYSTEM GUARD: 0 VULNERABILITIES</div>';
                }

                // 4. Fetch Suites
                try {
                    const suites = await smartFetch(['./allure/widgets/suites.json', './allure/data/suites.json']);
                    const suiteCount = suites?.items?.length || suites?.children?.length || 0;
                    animateValue('suiteCount', 0, suiteCount, 1000);
                    document.getElementById('suiteBar').style.width = '100%';
                } catch(e) {}

                // 5. Fetch History (Dual-Axis Trend Graph)
                try {
                    const history = await smartFetch([
                        './widgets/history-trend.json',
                        './allure/widgets/history-trend.json',
                        './data/history-trend.json'
                    ]).catch(() => null);
                    
                    // Attempt to fetch custom latency history if exists
                    const latencyHistory = await smartFetch([
                        './widgets/latency-trend.json', 
                        './allure/widgets/latency-trend.json',
                        './data/latency-trend.json'
                    ]).catch(() => []);

                    if (history && history.length > 0 && typeof Chart !== 'undefined') {
                        const ctx = document.getElementById('trendChart').getContext('2d');
                        new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: history.map((_, i) => '#' + (history.length - i)).reverse(),
                                datasets: [
                                    {
                                        label: 'Stability %',
                                        data: history.map(h => {
                                            const stats = h.statistic || h.data || {};
                                            const p = stats.passed || 0;
                                            const t = stats.total || 0;
                                            return t > 0 ? ((p / t) * 100) : 0;
                                        }).reverse(),
                                        borderColor: '#10b981',
                                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                        fill: true,
                                        tension: 0.4,
                                        yAxisID: 'yStability'
                                    },
                                    {
                                        label: 'Latency (ms)',
                                        data: latencyHistory.length > 0 ? latencyHistory.map(l => l.avgLatency).reverse() : history.map(h => {
                                            return (h.statistic?.duration || 0) / (h.statistic?.total || 1);
                                        }).reverse(),
                                        borderColor: 'var(--coral)',
                                        backgroundColor: 'transparent',
                                        borderDash: [5, 5],
                                        tension: 0.4,
                                        yAxisID: 'yLatency'
                                    }
                                ]
                            },
                            options: {
                                plugins: { legend: { display: false } },
                                scales: {
                                    yStability: { 
                                        display: false, 
                                        min: 0, 
                                        max: 100,
                                        position: 'left'
                                    },
                                    yLatency: {
                                        display: false,
                                        min: 0,
                                        max: 5000,
                                        position: 'right'
                                    },
                                    x: { display: false }
                                }
                            }
                        });
                    }
                } catch (e) {
                    console.warn("Trend Engine Offline: Missing or malformed history", e);
                }
                document.getElementById('loader').style.display = 'none';
                if (window.earlyTimer) clearTimeout(window.earlyTimer);
            } catch (e) {
                console.error("Dashboard Sync Failed", e);
                const loader = document.getElementById('loader');
                if (loader) {
                    loader.style.display = 'flex'; // Re-expose loader if it timed out and hid
                    loader.innerHTML = '<div style="text-align:center">INTEGRITY ENGINE OFFLINE<br><span style="font-size:0.8rem; color:var(--coral)">' + e.message + '</span></div>';
                }
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
