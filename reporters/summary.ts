import type { Reporter, TestCase, TestResult, FullResult, Suite } from '@playwright/test/reporter';

/**
 * Custom Playwright Reporter to show a final summary with the project's [RESULT] prefix.
 * Enhanced with module breakdowns for full test runs.
 */
class SummaryReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private total = 0;
  private moduleBreakdown: Map<string, {passed: number, failed: number, skipped: number, total: number}> = new Map();
  private isFullTestRun = false;

  onBegin(config: any, suite: Suite): void {
    // Detect full test run
    this.isFullTestRun = process.env.TEST_TYPE === 'full' || 
                        (config.projects && config.projects.length >= 5);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.total++;
    
    // Extract module from test path
    const module = this.extractModuleFromTest(test);
    
    if (!this.moduleBreakdown.has(module)) {
      this.moduleBreakdown.set(module, {passed: 0, failed: 0, skipped: 0, total: 0});
    }
    
    const moduleStats = this.moduleBreakdown.get(module)!;
    moduleStats.total++;
    
    if (result.status === 'passed') {
      this.passed++;
      moduleStats.passed++;
    } else if (result.status === 'failed' || result.status === 'timedOut') {
      this.failed++;
      moduleStats.failed++;
    } else if (result.status === 'skipped') {
      this.skipped++;
      moduleStats.skipped++;
    }
  }

  private extractModuleFromTest(test: TestCase): string {
    const filePath = test.location.file;
    
    if (filePath.includes('/sales/')) return 'Sales';
    if (filePath.includes('/purchase/')) return 'Purchase';
    if (filePath.includes('/inventory/')) return 'Inventory';
    if (filePath.includes('/hr/')) return 'HR';
    if (filePath.includes('/cross-module/')) return 'Cross-Module';
    
    return test.parent?.project()?.name || 'General';
  }

  onEnd(result: FullResult): void {
    console.log('\n===========================================');
    console.log(`[RESULT] FINAL WORKFLOW SUMMARY`);
    console.log(`[RESULT] Total Tests: ${this.total}`);
    console.log(`[RESULT] PASSED     : ${this.passed}`);
    console.log(`[RESULT] FAILED     : ${this.failed}`);

    if (this.skipped > 0) {
      console.log(`[RESULT] SKIPPED    : ${this.skipped}`);
    }

    const overallStatus = result.status === 'passed' ? 'SUCCESS' : 'FAILED';
    console.log(`[RESULT] OVERALL STATUS: ${overallStatus}`);
    
    // Show module breakdown for full test runs
    if (this.isFullTestRun && this.moduleBreakdown.size > 1) {
      console.log('');
      console.log(`[RESULT] MODULE BREAKDOWN:`);
      console.log('-'.repeat(43));
      
      Array.from(this.moduleBreakdown.entries())
        .sort(([,a], [,b]) => b.total - a.total) // Sort by total tests desc
        .forEach(([module, stats]) => {
          const passRate = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
          console.log(`[RESULT] ${module.padEnd(12)} │ ${stats.total.toString().padStart(3)} tests │ ${passRate.toString().padStart(3)}% pass`);
        });
    }
    
    console.log('===========================================\n');
  }
}

export default SummaryReporter;
