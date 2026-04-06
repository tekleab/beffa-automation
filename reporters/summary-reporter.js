/**
 * Custom Playwright Reporter to show a final summary with the project's [RESULT] prefix.
 */
class SummaryReporter {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
    this.total = 0;
  }

  onTestEnd(test, result) {
    this.total++;
    if (result.status === 'passed') {
      this.passed++;
    } else if (result.status === 'failed' || result.status === 'timedOut') {
      this.failed++;
    } else if (result.status === 'skipped') {
      this.skipped++;
    }
  }

  onEnd(result) {
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

module.exports = SummaryReporter;
