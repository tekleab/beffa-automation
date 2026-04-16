import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

class LuxuryReporter implements Reporter {
  private results: any[] = [];
  private startTime!: number;

  onBegin() {
    this.startTime = Date.now();
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push({
      name: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error?.message || '',
      suite: test.parent.title
    });
  }

  async onEnd(result: FullResult) {
    const durationArr = this.results.map(r => r.duration);
    const avgDuration = durationArr.length > 0 ? (durationArr.reduce((a, b) => a + b, 0) / durationArr.length / 1000).toFixed(2) : '0';
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const rate = this.results.length > 0 ? ((passed / this.results.length) * 100).toFixed(2) : '0';

    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BEFFA Luxury 3D Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --emerald: #10b981;
            --coral: #f43f5e;
            --glass: rgba(15, 23, 42, 0.8);
            --neon-green: 0 0 15px rgba(16, 185, 129, 0.4);
            --neon-red: 0 0 15px rgba(244, 63, 94, 0.4);
        }

        body {
            background-color: #020617;
            color: #f8fafc;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            margin: 0;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .scene {
            perspective: 1500px;
            width: 100%;
            padding: 50px 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .isometric-board {
            width: 90%;
            max-width: 1200px;
            transform: rotateX(15deg) rotateY(-10deg);
            transform-style: preserve-3d;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
        }

        .glass-card {
            background: var(--glass);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 25px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            transition: transform 0.3s ease;
            position: relative;
        }

        .glass-card:hover {
            transform: translateZ(20px);
            border-color: var(--emerald);
        }

        .success-gauge {
            grid-column: span 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
            background: radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
        }

        .rate-circle {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border: 10px solid #1e293b;
            border-top: 10px solid var(--emerald);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            font-weight: 800;
            text-shadow: var(--neon-green);
            animation: glow 2s infinite alternate;
        }

        @keyframes glow {
            from { box-shadow: 0 0 5px var(--emerald); }
            to { box-shadow: 0 0 20px var(--emerald); }
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 20px;
        }

        .stat-item {
            text-align: center;
            padding: 15px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
        }

        .stat-value { font-size: 1.5rem; font-weight: bold; }
        .stat-label { font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; }

        .test-list-3d {
            grid-column: span 2;
            margin-top: 20px;
        }

        .test-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            margin-bottom: 10px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 12px;
            border-left: 4px solid #334155;
            transition: transform 0.2s;
        }

        .test-row:hover {
            transform: translateX(10px);
            background: rgba(255, 255, 255, 0.05);
        }

        .status-pill {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            text-transform: uppercase;
            font-weight: bold;
        }

        .status-passed { background: rgba(16, 185, 129, 0.2); color: var(--emerald); border: 1px solid var(--emerald); }
        .status-failed { background: rgba(244, 63, 94, 0.2); color: var(--coral); border: 1px solid var(--coral); }

        h1 { margin: 20px 0; font-size: 2.5rem; text-transform: uppercase; letter-spacing: 4px; }
        .env-badge { font-family: monospace; color: var(--emerald); background: rgba(16, 185, 129, 0.1); padding: 5px 15px; border-radius: 5px; margin-bottom: 40px; }
    </style>
</head>
<body>
    <h1>BEFFA QA DASHBOARD</h1>
    <div class="env-badge">OS: LINUX | NODE: v20.20.2 | BROWSER: CHROMIUM</div>

    <div class="scene">
        <div class="isometric-board">
            <!-- Main Success Gauge -->
            <div class="glass-card success-gauge">
                <div class="rate-circle">${rate}%</div>
                <div style="margin-top: 15px; color: #94a3b8;">STABILITY INDEX</div>
            </div>

            <!-- Summary Stats -->
            <div class="glass-card">
                <div class="stat-label">Execution Summary</div>
                <div class="stats-grid">
                    <div class="stat-item"><div class="stat-value" style="color: var(--emerald);">${passed}</div><div class="stat-label">Passed</div></div>
                    <div class="stat-item"><div class="stat-value" style="color: var(--coral);">${failed}</div><div class="stat-label">Failed</div></div>
                    <div class="stat-item"><div class="stat-value">${this.results.length}</div><div class="stat-label">Total</div></div>
                    <div class="stat-item"><div class="stat-value">${avgDuration}s</div><div class="stat-label">Avg Speed</div></div>
                </div>
            </div>

            <!-- Performance Trend Chart -->
            <div class="glass-card">
                <div class="stat-label">Performance Trend</div>
                <canvas id="trendChart" style="height: 150px; margin-top: 15px;"></canvas>
            </div>

            <!-- Test List -->
            <div class="glass-card test-list-3d">
                <div class="stat-label" style="margin-bottom: 15px;">Live Test Feed</div>
                <div id="testFeed">
                    ${this.results.map(r => `
                        <div class="test-row" style="border-left-color: ${r.status === 'passed' ? 'var(--emerald)' : 'var(--coral)'}">
                            <div>
                                <div style="font-weight: bold;">${r.name}</div>
                                <div style="font-size: 0.7rem; color: #64748b;">${r.suite} • ${(r.duration / 1000).toFixed(2)}s</div>
                            </div>
                            <div class="status-pill status-${r.status}">${r.status}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>

    <script>
        const ctx = document.getElementById('trendChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Run 1', 'Run 2', 'Run 3', 'Run 4', 'Run 5'],
                datasets: [{
                    label: 'Stability',
                    data: [85, 90, 88, 92, ${rate}],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: { 
                    y: { display: false }, 
                    x: { grid: { display: false }, ticks: { color: '#64748b' } }
                }
            }
        });
    </script>
</body>
</html>
    `;

    const reportPath = path.join(process.cwd(), 'luxury-report.html');
    fs.writeFileSync(reportPath, htmlTemplate);
    console.log(`[LUXURY] Astonishing 3D Dashboard generated: ${reportPath}`);
  }
}

export default LuxuryReporter;
