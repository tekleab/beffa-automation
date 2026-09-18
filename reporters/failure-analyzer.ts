import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

type FailureCategory =
  | 'APP_BUG'      // Real ERP logic defect — assertion on business data failed
  | 'INFRA_FLAKE'  // Network drop, socket hang, 502/503/504, ECONNRESET, timeout
  | 'TEST_CODE'    // Wrong selector, bad assertion, test data setup issue
  | 'KNOWN_BUG'    // Matches a documented ERP defect (overpayment, double-bill, etc.)
  | 'ENV_CONFIG';  // Auth failure, missing env var, wrong URL, 401/403 on setup

interface FailureRecord {
  testTitle: string;
  file: string;
  project: string;
  errorMessage: string;
  errorSnippet: string; // first 600 chars of error + steps
  duration: number;
}

interface AnalysisResult {
  testTitle: string;
  file: string;
  category: FailureCategory;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  reasoning: string;
  suggestedAction: string;
}

const KNOWN_BUG_PATTERNS = [
  'overpayment', 'double-bill', 'ghost payment', 'double-receipt',
  'net_due', 'unit_cost', 'E1481', 'deadlock', 'unique_po_company',
  'KNOWN_BUG', 'BUG', 'privilege escalation', 'auditor',
];

const INFRA_PATTERNS = [
  'ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'socket hang up',
  'fetch failed', 'net::ERR_', 'ERR_CONNECTION', '502', '503', '504',
  'Navigation failed', 'Target closed', 'Protocol error',
  'browserType.launch', 'page.goto', 'ERR_EMPTY_RESPONSE',
];

class FailureAnalyzerReporter implements Reporter {
  private failures: FailureRecord[] = [];
  private apiKey: string | undefined;
  private model: string;
  private outputDir: string;

  constructor(options: { model?: string } = {}) {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = options.model ?? 'gpt-4o-mini';
    this.outputDir = path.join(process.cwd(), 'test-results');
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status !== 'failed' && result.status !== 'timedOut') return;

    const errorMessage = result.errors.map(e => e.message ?? '').join('\n').slice(0, 300);
    const stepLog = result.steps
      .filter(s => s.error)
      .map(s => `  step: ${s.title} → ${s.error?.message?.slice(0, 120) ?? ''}`)
      .join('\n');

    this.failures.push({
      testTitle: test.title,
      file: path.relative(process.cwd(), test.location.file),
      project: test.parent?.project()?.name ?? 'unknown',
      errorMessage,
      errorSnippet: [errorMessage, stepLog].filter(Boolean).join('\n').slice(0, 600),
      duration: result.duration,
    });
  }

  async onEnd(_result: FullResult): Promise<void> {
    if (this.failures.length === 0) return;

    let analyses: AnalysisResult[];

    if (this.apiKey) {
      try {
        analyses = await this.analyzeWithOpenAI(this.failures);
      } catch (err) {
        console.warn(`[AI-ANALYZER] OpenAI call failed: ${(err as Error).message}. Falling back to heuristics.`);
        analyses = this.failures.map(f => this.heuristicAnalyze(f));
      }
    } else {
      console.warn('[AI-ANALYZER] OPENAI_API_KEY not set — using heuristic classification.');
      analyses = this.failures.map(f => this.heuristicAnalyze(f));
    }

    this.writeReport(analyses);
    this.printSummary(analyses);
  }

  // ── OpenAI batch analysis ────────────────────────────────────────────────

  private async analyzeWithOpenAI(failures: FailureRecord[]): Promise<AnalysisResult[]> {
    const systemPrompt = `You are a QA triage expert for BEFFA ERP, a financial/inventory/HR system.
Classify each Playwright test failure into exactly one category:
- APP_BUG: Real ERP logic defect — wrong balance, wrong stock, wrong status, business rule violated
- INFRA_FLAKE: Network drop, socket hang, ECONNRESET, 502/503/504, browser crash, timeout on navigation
- TEST_CODE: Wrong selector, stale locator, bad assertion value, test data setup failure unrelated to ERP logic
- KNOWN_BUG: Matches a documented ERP defect (overpayment accepted, double-billing, ghost payment, E1481 deadlock, privilege escalation, net_due uses unit_cost)
- ENV_CONFIG: 401/403 on setup, missing env var, wrong BASE_URL, auth token expired before test starts

Respond with a JSON array. Each element: { "testTitle": string, "category": string, "confidence": "HIGH"|"MEDIUM"|"LOW", "reasoning": string (≤ 20 words), "suggestedAction": string (≤ 15 words) }`;

    const userContent = failures.map((f, i) =>
      `[${i + 1}] "${f.testTitle}" (${f.file})\n${f.errorSnippet}`
    ).join('\n\n---\n\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Classify these ${failures.length} failures:\n\n${userContent}\n\nReturn JSON: { "results": [...] }` },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`OpenAI ${response.status}: ${body.slice(0, 200)}`);
    }

    const json = await response.json() as any;
    const raw: any[] = JSON.parse(json.choices[0].message.content).results;

    return failures.map((f, i) => {
      const r = raw[i] ?? {};
      return {
        testTitle: f.testTitle,
        file: f.file,
        category: (r.category as FailureCategory) ?? 'TEST_CODE',
        confidence: r.confidence ?? 'LOW',
        reasoning: r.reasoning ?? '',
        suggestedAction: r.suggestedAction ?? '',
      };
    });
  }

  // ── Heuristic fallback ───────────────────────────────────────────────────

  private heuristicAnalyze(f: FailureRecord): AnalysisResult {
    const text = (f.errorMessage + ' ' + f.errorSnippet).toLowerCase();

    if (KNOWN_BUG_PATTERNS.some(p => text.includes(p.toLowerCase()))) {
      return this.result(f, 'KNOWN_BUG', 'HIGH', 'Matches documented ERP defect pattern', 'Log as known bug, skip in CI');
    }
    if (INFRA_PATTERNS.some(p => text.toLowerCase().includes(p.toLowerCase()))) {
      return this.result(f, 'INFRA_FLAKE', 'HIGH', 'Network/browser infrastructure error detected', 'Retry or check ERP server health');
    }
    if (text.includes('401') || text.includes('403') || text.includes('unauthorized') || text.includes('token')) {
      return this.result(f, 'ENV_CONFIG', 'HIGH', 'Auth/token failure during setup', 'Check BEFFA_USER/PASS env vars');
    }
    if (text.includes('expect(') || text.includes('tobevisible') || text.includes('tohavetext') || text.includes('locator')) {
      return this.result(f, 'TEST_CODE', 'MEDIUM', 'Playwright assertion or locator failure', 'Review selector or assertion value');
    }
    return this.result(f, 'APP_BUG', 'LOW', 'Unclassified — likely business logic failure', 'Investigate ERP response manually');
  }

  private result(f: FailureRecord, category: FailureCategory, confidence: 'HIGH' | 'MEDIUM' | 'LOW', reasoning: string, suggestedAction: string): AnalysisResult {
    return { testTitle: f.testTitle, file: f.file, category, confidence, reasoning, suggestedAction };
  }

  // ── Output ───────────────────────────────────────────────────────────────

  private writeReport(analyses: AnalysisResult[]): void {
    if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir, { recursive: true });

    const counts = this.countByCategory(analyses);
    const method = this.apiKey ? `OpenAI ${this.model}` : 'Heuristic (no API key)';
    const now = new Date().toLocaleString();

    let md = `# 🤖 AI Failure Analysis Report\n\n`;
    md += `> Generated: **${now}** | Method: **${method}** | Total failures: **${analyses.length}**\n\n`;

    md += `## Summary\n\n`;
    md += `| Category | Count | Action |\n|:---|:---:|:---|\n`;
    md += `| 🐛 APP_BUG | ${counts.APP_BUG} | File bug report |\n`;
    md += `| 🔥 KNOWN_BUG | ${counts.KNOWN_BUG} | Already tracked, skip CI block |\n`;
    md += `| 🌐 INFRA_FLAKE | ${counts.INFRA_FLAKE} | Retry / check server |\n`;
    md += `| 🧪 TEST_CODE | ${counts.TEST_CODE} | Fix test, not ERP |\n`;
    md += `| ⚙️ ENV_CONFIG | ${counts.ENV_CONFIG} | Fix env vars / auth |\n\n`;

    md += `## Failures by Category\n\n`;

    const grouped = this.groupByCategory(analyses);
    const order: FailureCategory[] = ['APP_BUG', 'KNOWN_BUG', 'INFRA_FLAKE', 'TEST_CODE', 'ENV_CONFIG'];
    const icons: Record<FailureCategory, string> = {
      APP_BUG: '🐛', KNOWN_BUG: '🔥', INFRA_FLAKE: '🌐', TEST_CODE: '🧪', ENV_CONFIG: '⚙️',
    };

    for (const cat of order) {
      const items = grouped[cat] ?? [];
      if (items.length === 0) continue;
      md += `### ${icons[cat]} ${cat} (${items.length})\n\n`;
      for (const a of items) {
        md += `- **${a.testTitle}**  \n`;
        md += `  \`${a.file}\` · confidence: ${a.confidence}  \n`;
        md += `  _${a.reasoning}_  \n`;
        md += `  → ${a.suggestedAction}\n\n`;
      }
    }

    fs.writeFileSync(path.join(this.outputDir, 'ai-failure-analysis.md'), md, 'utf-8');
    fs.writeFileSync(
      path.join(this.outputDir, 'ai-failure-analysis.json'),
      JSON.stringify(analyses, null, 2),
      'utf-8'
    );
  }

  private printSummary(analyses: AnalysisResult[]): void {
    const counts = this.countByCategory(analyses);
    const method = this.apiKey ? `OpenAI ${this.model}` : 'heuristic';
    console.log('\n🤖 AI FAILURE ANALYSIS (' + method + ')');
    console.log('─'.repeat(50));
    if (counts.APP_BUG)     console.log(`  🐛 APP_BUG      : ${counts.APP_BUG}`);
    if (counts.KNOWN_BUG)   console.log(`  🔥 KNOWN_BUG    : ${counts.KNOWN_BUG}`);
    if (counts.INFRA_FLAKE) console.log(`  🌐 INFRA_FLAKE  : ${counts.INFRA_FLAKE}`);
    if (counts.TEST_CODE)   console.log(`  🧪 TEST_CODE    : ${counts.TEST_CODE}`);
    if (counts.ENV_CONFIG)  console.log(`  ⚙️  ENV_CONFIG   : ${counts.ENV_CONFIG}`);
    console.log(`  📄 Report: test-results/ai-failure-analysis.md`);
    console.log('─'.repeat(50) + '\n');
  }

  private countByCategory(analyses: AnalysisResult[]): Record<FailureCategory, number> {
    const counts = { APP_BUG: 0, KNOWN_BUG: 0, INFRA_FLAKE: 0, TEST_CODE: 0, ENV_CONFIG: 0 };
    for (const a of analyses) counts[a.category]++;
    return counts;
  }

  private groupByCategory(analyses: AnalysisResult[]): Partial<Record<FailureCategory, AnalysisResult[]>> {
    const groups: Partial<Record<FailureCategory, AnalysisResult[]>> = {};
    for (const a of analyses) {
      (groups[a.category] ??= []).push(a);
    }
    return groups;
  }
}

export default FailureAnalyzerReporter;
