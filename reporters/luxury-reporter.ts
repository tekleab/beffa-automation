import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

class LuxuryReporter implements Reporter {
  private results: any[] = [];
  private startTime!: number;
  private deployDir = path.join(process.cwd(), 'deploy');
  private attachmentsDir = path.join(this.deployDir, 'attachments');

  onBegin() {
    this.startTime = Date.now();
    // 🛡️ Pre-create deployment folders
    if (!fs.existsSync(this.deployDir)) fs.mkdirSync(this.deployDir);
    if (!fs.existsSync(this.attachmentsDir)) fs.mkdirSync(this.attachmentsDir);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const suitePath = [];
    let parent = test.parent;
    while (parent && parent.title) {
      suitePath.unshift(parent.title);
      parent = parent.parent;
    }

    // 🛡️ Attachment Handling
    const processedAttachments = (result.attachments || []).map(att => {
      if (att.path && fs.existsSync(att.path)) {
        const ext = path.extname(att.path);
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`;
        const targetPath = path.join(this.attachmentsDir, fileName);
        fs.copyFileSync(att.path, targetPath);
        return { 
          name: att.name, 
          url: `./attachments/${fileName}`, 
          type: att.contentType 
        };
      }
      return null;
    }).filter(Boolean);

    this.results.push({
      id: Math.random().toString(36).substr(2, 9),
      name: test.title,
      status: result.status,
      duration: result.duration,
      startTime: result.startTime.getTime(),
      endTime: result.startTime.getTime() + result.duration,
      error: result.error?.message || '',
      stack: result.error?.stack || '',
      suite: test.parent.title,
      suitePath: suitePath,
      category: this.categorizeError(result.error?.message),
      attachments: processedAttachments,
      steps: result.steps.map(s => ({
        title: s.title,
        status: s.error ? 'failed' : 'passed',
        duration: s.duration
      }))
    });
  }

  private categorizeError(msg?: string): string {
    if (!msg) return 'Success';
    if (msg.includes('Timeout') || msg.includes('timeout')) return 'Timeout Error';
    if (msg.includes('Not found') || msg.includes('locator')) return 'Selector Issue';
    if (msg.includes('expect') || msg.includes('Assertion')) return 'Logic Failure';
    return 'Product Defect';
  }

  async onEnd(result: FullResult) {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const rate = this.results.length > 0 ? ((passed / this.results.length) * 100).toFixed(2) : '0';
    
    const suitesMap: Record<string, any> = {};
    this.results.forEach(r => {
      const s = r.suite || 'Default';
      if (!suitesMap[s]) suitesMap[s] = { passed: 0, failed: 0, tests: [] };
      suitesMap[s].tests.push(r);
      if (r.status === 'passed') suitesMap[s].passed++;
      else suitesMap[s].failed++;
    });

    const categoriesMap: Record<string, number> = {};
    this.results.forEach(r => {
      if (r.status !== 'passed') {
        const cat = r.category;
        categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
      }
    });

    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BEFFA Luxury 3D Reporting Suite V3.0</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --emerald: #10b981;
            --coral: #f43f5e;
            --glass: rgba(15, 23, 42, 0.9);
            --neon-green: 0 0 15px rgba(16, 185, 129, 0.6);
            --neon-red: 0 0 15px rgba(244, 63, 94, 0.6);
            --sidebar-width: 80px;
        }

        body {
            background-color: #020617;
            color: #f8fafc;
            font-family: 'Inter', system-ui, sans-serif;
            margin: 0;
            display: flex;
            height: 100vh;
            overflow: hidden;
        }

        /* --- Sidebar & Layout --- */
        .sidebar {
            width: var(--sidebar-width);
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(20px);
            border-right: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 30px;
            gap: 25px;
            z-index: 1000;
        }

        .nav-item {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #64748b;
        }

        .nav-item:hover, .nav-item.active {
            background: rgba(16, 185, 129, 0.1);
            color: var(--emerald);
            box-shadow: var(--neon-green);
        }

        .main-container { flex: 1; display: flex; flex-direction: column; position: relative; }
        .tab-content { flex: 1; padding: 40px; overflow-y: auto; display: none; }
        .tab-content.active { display: block; animation: slideUp 0.4s ease; }

        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* --- detail Sidebar (THE MAGIC PANELS) --- */
        .detail-panel {
            position: fixed;
            right: -600px;
            top: 0;
            width: 550px;
            height: 100vh;
            background: var(--glass);
            backdrop-filter: blur(40px);
            border-left: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 2000;
            transition: right 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
            padding: 40px;
            overflow-y: auto;
            box-shadow: -50px 0 100px rgba(0,0,0,0.5);
        }

        .detail-panel.open { right: 0; }
        .close-btn { position: absolute; top: 30px; left: -20px; width: 40px; height: 40px; background: #1e293b; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid var(--emerald); }

        /* --- Media Gallery --- */
        .media-container { margin-top: 30px; border-radius: 15px; overflow: hidden; background: #000; position: relative; }
        .media-label { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.6); padding: 4px 10px; border-radius: 5px; font-size: 0.7rem; color: var(--emerald); }
        img.trace-img, video.trace-video { width: 100%; display: block; }

        /* --- Steps & Errors --- */
        .step-list { margin-top: 25px; }
        .step-item { display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.85rem; }
        .error-log { margin-top: 25px; background: rgba(244, 63, 94, 0.05); border: 1px solid rgba(244, 63, 94, 0.2); padding: 20px; border-radius: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--coral); overflow-x: auto; }

        /* --- Components --- */
        .hologram-circle { width: 220px; height: 220px; border-radius: 50%; border: 12px solid #1e293b; border-top-color: var(--emerald); display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto 30px; text-shadow: var(--neon-green); box-shadow: inset 0 0 20px rgba(16, 185, 129, 0.1); }
        .isometric-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 25px; transition: all 0.3s; cursor: pointer; position: relative; transform-style: preserve-3d; }
        .isometric-card:hover { transform: translateZ(20px) scale(1.02); border-color: var(--emerald); box-shadow: 0 30px 60px rgba(0,0,0,0.4); }

        .tag { padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; }
        .tag-passed { color: var(--emerald); background: rgba(16, 185, 129, 0.1); }
        .tag-failed { color: var(--coral); background: rgba(244, 63, 94, 0.1); }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="nav-item active" onclick="showTab('dashboard')">📊</div>
        <div class="nav-item" onclick="showTab('suites')">📂</div>
        <div class="nav-item" onclick="showTab('errors')">☄️</div>
        <div class="nav-item" onclick="showTab('timeline')">⏱️</div>
    </div>

    <div class="main-container">
        <!-- Dashboard -->
        <div id="dashboard" class="tab-content active">
            <h1 style="letter-spacing: 5px; text-transform: uppercase; opacity: 0.7;">Command Center</h1>
            <div style="display: flex; gap: 40px; margin-top: 40px;">
                <div class="glass-card" style="flex: 1; text-align: center;">
                    <div class="hologram-circle">
                        <div style="font-size: 3.5rem; font-weight: 800;">${rate}%</div>
                        <div style="font-size: 0.7rem; color: #64748b;">STABILITY INDEX</div>
                    </div>
                    <div style="display: flex; justify-content: center; gap: 30px;">
                        <div><div style="color: var(--emerald); font-size: 1.5rem; font-weight: bold;">${passed}</div><div style="font-size: 0.6rem; color: #64748b;">PASSED</div></div>
                        <div><div style="color: var(--coral); font-size: 1.5rem; font-weight: bold;">${failed}</div><div style="font-size: 0.6rem; color: #64748b;">FAILED</div></div>
                        <div><div style="font-size: 1.5rem; font-weight: bold;">${this.results.length}</div><div style="font-size: 0.6rem; color: #64748b;">TOTAL</div></div>
                    </div>
                </div>
                <div class="glass-card" style="flex: 1;">
                    <h3 style="margin-top: 0; color: #64748b; font-size: 0.9rem;">PERFORMANCE STREAM</h3>
                    <canvas id="mainChart" style="height: 250px;"></canvas>
                </div>
            </div>
        </div>

        <!-- Suites View -->
        <div id="suites" class="tab-content">
            <h2>Luxury Suites Architecture</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px;">
                ${Object.entries(suitesMap).map(([name, data]) => `
                    <div class="isometric-card">
                        <div style="font-weight: 800; font-size: 1.1rem; margin-bottom: 20px;">${name}</div>
                        ${data.tests.map((t: any) => `
                            <div onclick="openDetail('${t.id}')" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; margin-bottom: 8px; background: rgba(255,255,255,0.02); border-radius: 10px; border-left: 3px solid ${t.status === 'passed' ? 'var(--emerald)' : 'var(--coral)'}">
                                <div style="font-size: 0.85rem;">${t.name}</div>
                                <div class="tag tag-${t.status}">${t.status}</div>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Errors Tab -->
        <div id="errors" class="tab-content">
            <h2>Defect Analytics</h2>
            <div class="glass-card">
                ${this.results.filter(r => r.status !== 'passed').map(r => `
                    <div onclick="openDetail('${r.id}')" style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;">
                        <span style="color: var(--coral); font-weight: bold;">[${r.category}]</span>
                        <span style="margin-left: 10px;">${r.name}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Timeline Tab -->
        <div id="timeline" class="tab-content">
           <h2>Execution Stream</h2>
           <div class="glass-card">
               ${this.results.map(r => `
                   <div style="margin-bottom: 15px;">
                        <div style="font-size: 0.7rem; color: #64748b; margin-bottom: 4px;">${r.name}</div>
                        <div style="height: 10px; background: #1e293b; border-radius: 10px; overflow: hidden; width: 100%;">
                            <div style="height: 100%; border-radius: 10px; width: ${Math.min(100, (r.duration / 10000) * 100)}%; background: ${r.status === 'passed' ? 'var(--emerald)' : 'var(--coral)'}"></div>
                        </div>
                   </div>
               `).join('')}
           </div>
        </div>
    </div>

    <!-- DETAIL PANEL (THE DRILL DOWN) -->
    <div id="detailPanel" class="detail-panel">
        <div class="close-btn" onclick="closeDetail()">✖</div>
        <div id="detailContent"></div>
    </div>

    <script>
        const results = ${JSON.stringify(this.results)};
        
        function showTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            event.currentTarget.classList.add('active');
        }

        function openDetail(id) {
            const test = results.find(r => r.id === id);
            const panel = document.getElementById('detailPanel');
            const content = document.getElementById('detailContent');

            content.innerHTML = \`
                <div style="font-size: 0.7rem; color: var(--emerald); letter-spacing: 2px;">TEST DETAILS</div>
                <h1 style="margin-top: 10px;">\${test.name}</h1>
                <div style="display: flex; gap: 20px; margin-top: 20px;">
                    <div class="tag tag-\${test.status}">\${test.status}</div>
                    <div style="color: #64748b; font-size: 0.8rem;">DURATION: \${(test.duration / 1000).toFixed(2)}s</div>
                </div>

                <!-- Media Attachments -->
                \${test.attachments.map(att => \`
                    <div class="media-container">
                        <div class="media-label">\${att.name.toUpperCase()}</div>
                        \${att.type.includes('video') 
                            ? \\\`<video controls class="trace-video"><source src="\${att.url}" type="\${att.type}"></video>\\\`
                            : \\\`<img src="\${att.url}" class="trace-img" alt="Test Artifact">\\\`
                        }
                    </div>
                \`).join('')}

                <!-- Step Execution -->
                <div class="step-list">
                    <h3 style="color: #64748b; font-size: 0.9rem;">EXECUTION STEPS</h3>
                    \${test.steps.map(s => \\\`
                        <div class="step-item">
                            <span>\${s.title}</span>
                            <span style="color: \${s.status === 'passed' ? 'var(--emerald)' : 'var(--coral)'}">\${(s.duration / 1000).toFixed(2)}s</span>
                        </div>
                    \\\`).join('')}
                </div>

                <!-- Error Logs -->
                \${test.status === 'failed' ? \\\`
                    <div class="error-log">
                        <div style="font-weight: bold; margin-bottom: 15px;">ERROR STACK TRACE</div>
                        <pre style="white-space: pre-wrap;">\${test.error}\\\\n\\\\n\${test.stack}</pre>
                    </div>
                \\\` : ''}
            \`;
            
            panel.classList.add('open');
        }

        function closeDetail() {
            document.getElementById('detailPanel').classList.remove('open');
        }

        // Initialize Chart
        const ctx = document.getElementById('mainChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: results.slice(-10).map(r => r.name.substr(0, 10)),
                datasets: [{
                    label: 'Stability Index',
                    data: results.slice(-10).map(r => r.status === 'passed' ? 100 : 0),
                    borderColor: '#10b981',
                    backgroundGradient: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }]
            },
            options: { plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { display: false } } }
        });
    </script>
</body>
</html>
    `;

    const reportPath = path.join(this.deployDir, 'index.html');
    fs.writeFileSync(reportPath, htmlTemplate);
    console.log(`[ULTIMATE] V3.0 Astonishing Dashboard generated: ${reportPath}`);
  }
}

export default LuxuryReporter;
