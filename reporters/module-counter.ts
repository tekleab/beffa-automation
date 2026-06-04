import type { Reporter, TestCase, TestResult, FullResult, FullConfig, Suite } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface ModuleStats {
  module: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  tests: Array<{
    title: string;
    status: string;
    duration: number;
    project: string;
  }>;
}

/**
 * Enhanced Module Counter Reporter for Full Test Runs
 * Tracks test counts by module and generates detailed reports for Allure integration
 */
class ModuleCounterReporter implements Reporter {
  private moduleStats: Map<string, ModuleStats> = new Map();
  private totalTests = 0;
  private startTime = 0;
  private isFullTestRun = false;

  onBegin(config: FullConfig, suite: Suite): void {
    this.startTime = Date.now();
    
    // Detect if this is a full test run (either by env var or by number of projects)
    this.isFullTestRun = process.env.TEST_TYPE === 'full' || 
                        config.projects.length >= 5; // Assuming full run has most/all projects

    if (this.isFullTestRun) {
      console.log('\n🔍 MODULE COUNTER: Full test run detected - tracking module statistics...\n');
    }

    // Initialize module stats from test structure
    this.initializeModuleStats(suite);
  }

  private initializeModuleStats(suite: Suite): void {
    const allTests = suite.allTests();
    
    allTests.forEach(test => {
      const module = this.extractModuleFromTest(test);
      
      if (!this.moduleStats.has(module)) {
        this.moduleStats.set(module, {
          module,
          total: 0,
          passed: 0,
          failed: 0,
          skipped: 0,
          duration: 0,
          tests: []
        });
      }
      
      const stats = this.moduleStats.get(module)!;
      stats.total++;
      this.totalTests++;
    });
  }

  private extractModuleFromTest(test: TestCase): string {
    const filePath = test.location.file;
    
    // Extract module from file path
    if (filePath.includes('/sales/')) return 'Sales';
    if (filePath.includes('/purchase/')) return 'Purchase';
    if (filePath.includes('/inventory/')) return 'Inventory';
    if (filePath.includes('/hr/')) return 'HR';
    if (filePath.includes('/cross-module/')) return 'Cross-Module';
    
    // Fallback to project name or parent suite
    return test.parent?.project()?.name || 'General';
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const module = this.extractModuleFromTest(test);
    const stats = this.moduleStats.get(module);
    
    if (stats) {
      // Update counters
      if (result.status === 'passed') {
        stats.passed++;
      } else if (result.status === 'failed' || result.status === 'timedOut') {
        stats.failed++;
      } else if (result.status === 'skipped') {
        stats.skipped++;
      }
      
      stats.duration += result.duration;
      
      // Track individual test details
      stats.tests.push({
        title: test.title,
        status: result.status,
        duration: result.duration,
        project: test.parent?.project()?.name || 'unknown'
      });
    }
  }

  async onEnd(result: FullResult): Promise<void> {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;
    
    if (this.isFullTestRun) {
      await this.generateModuleReport(result, totalDuration);
      await this.generateAllureAttachments();
    }
    
    this.printModuleSummary(totalDuration);
  }

  private async generateModuleReport(result: FullResult, totalDuration: number): Promise<void> {
    const reportData = {
      timestamp: new Date().toISOString(),
      testType: 'full',
      totalDuration: totalDuration,
      summary: {
        totalTests: this.totalTests,
        totalPassed: Array.from(this.moduleStats.values()).reduce((sum, stats) => sum + stats.passed, 0),
        totalFailed: Array.from(this.moduleStats.values()).reduce((sum, stats) => sum + stats.failed, 0),
        totalSkipped: Array.from(this.moduleStats.values()).reduce((sum, stats) => sum + stats.skipped, 0),
        overallStatus: result.status
      },
      modules: Array.from(this.moduleStats.values()).map(stats => ({
        module: stats.module,
        total: stats.total,
        passed: stats.passed,
        failed: stats.failed,
        skipped: stats.skipped,
        passRate: stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0,
        avgDuration: stats.tests.length > 0 ? Math.round(stats.duration / stats.tests.length) : 0,
        totalDuration: stats.duration,
        status: this.getModuleStatus(stats),
        tests: stats.tests
      }))
    };

    // Write detailed module report
    const reportsDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const reportPath = path.join(reportsDir, 'module-statistics.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    
    console.log(`📊 Module statistics report generated: ${reportPath}`);
  }

  private async generateAllureAttachments(): Promise<void> {
    const allureResultsDir = path.join(process.cwd(), 'allure-results');
    
    if (fs.existsSync(allureResultsDir)) {
      // Generate module summary for Allure
      const moduleSummary = Array.from(this.moduleStats.values()).map(stats => {
        return `## ${stats.module} Module\n` +
               `- **Total Tests**: ${stats.total}\n` +
               `- **Passed**: ${stats.passed}\n` +
               `- **Failed**: ${stats.failed}\n` +
               `- **Skipped**: ${stats.skipped}\n` +
               `- **Pass Rate**: ${stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}%\n` +
               `- **Avg Duration**: ${stats.tests.length > 0 ? Math.round(stats.duration / stats.tests.length) : 0}ms\n\n`;
      }).join('');

      const allureAttachment = {
        name: 'Module Statistics Summary',
        type: 'text/markdown',
        source: `# BEFFA ERP Module Test Statistics\n\n` +
                `**Generated**: ${new Date().toLocaleString()}\n` +
                `**Total Tests Executed**: ${this.totalTests}\n\n` +
                `${moduleSummary}\n` +
                `---\n*Generated by Module Counter Reporter*`
      };

      // Write as Allure attachment
      const attachmentId = `module-stats-${Date.now()}`;
      const attachmentPath = path.join(allureResultsDir, `${attachmentId}-attachment.md`);
      
      fs.writeFileSync(attachmentPath, allureAttachment.source);
      
      console.log(`📎 Allure module statistics attachment created: ${attachmentId}-attachment.md`);
    }
  }

  private getModuleStatus(stats: ModuleStats): 'healthy' | 'degraded' | 'critical' {
    const passRate = stats.total > 0 ? (stats.passed / stats.total) * 100 : 100;
    
    if (passRate >= 90) return 'healthy';
    if (passRate >= 70) return 'degraded';
    return 'critical';
  }

  private printModuleSummary(totalDuration: number): void {
    if (!this.isFullTestRun) return;

    console.log('\n' + '='.repeat(80));
    console.log('📊 MODULE TEST STATISTICS SUMMARY');
    console.log('='.repeat(80));
    console.log(`🕒 Total Execution Time: ${Math.round(totalDuration / 1000)}s`);
    console.log(`🧪 Total Tests Executed: ${this.totalTests}`);
    console.log('');

    // Sort modules by total tests (descending)
    const sortedModules = Array.from(this.moduleStats.values())
      .sort((a, b) => b.total - a.total);

    sortedModules.forEach(stats => {
      const passRate = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
      const status = this.getModuleStatus(stats);
      const statusIcon = status === 'healthy' ? '✅' : status === 'degraded' ? '⚠️' : '❌';
      const avgDuration = stats.tests.length > 0 ? Math.round(stats.duration / stats.tests.length) : 0;
      
      console.log(`${statusIcon} ${stats.module.padEnd(15)} │ ${stats.total.toString().padStart(3)} tests │ ` +
                  `${passRate.toString().padStart(3)}% pass │ avg ${avgDuration}ms │ ` +
                  `P:${stats.passed} F:${stats.failed} S:${stats.skipped}`);
    });

    console.log('');
    console.log('Legend: P=Passed, F=Failed, S=Skipped');
    console.log('='.repeat(80));
    console.log('');
  }
}

export default ModuleCounterReporter;