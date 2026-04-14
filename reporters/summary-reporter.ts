import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

/**
 * Custom Playwright Reporter to show a final summary with the project's [RESULT] prefix.
 */
class SummaryReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private total = 0;

  onTestEnd(test: TestCase, result: TestResult): void {
    this.total++;
    if (result.status === 'passed') {
      this.passed++;
    } else if (result.status === 'failed' || result.status === 'timedOut') {
      this.failed++;
    } else if (result.status === 'skipped') {
      this.skipped++;
    }
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
    console.log('===========================================\n');
  }
}

export default SummaryReporter;
