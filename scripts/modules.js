#!/usr/bin/env node

/**
 * Module Statistics Analyzer
 * Analyzes test results and displays detailed module breakdown
 */

const fs = require('fs');
const path = require('path');

class ModuleStatsAnalyzer {
  constructor() {
    this.resultsPath = path.join(process.cwd(), 'test-results', 'module-statistics.json');
    this.playwrightResultsPath = path.join(process.cwd(), 'playwright-results.json');
  }

  analyze() {
    console.log('\
🔍 BEFFA ERP Module Statistics Analyzer');
    console.log('=' .repeat(60));

    try {
      // Try to load detailed module statistics first
      if (fs.existsSync(this.resultsPath)) {
        this.analyzeDetailedStats();
      } else if (fs.existsSync(this.playwrightResultsPath)) {
        this.analyzePlaywrightResults();
      } else {
        console.log('❌ No test results found. Run tests first.');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Error analyzing results:', error.message);
      process.exit(1);
    }
  }

  analyzeDetailedStats() {
    const data = JSON.parse(fs.readFileSync(this.resultsPath, 'utf8'));
    
    console.log(`📊 Analysis Date: ${new Date(data.timestamp).toLocaleString()}`);
    console.log(`⏱️  Total Duration: ${Math.round(data.totalDuration / 1000)}s`);
    console.log(`🧪 Test Type: ${data.testType.toUpperCase()}`);
    console.log('');

    // Overall summary
    const summary = data.summary;
    console.log('📋 OVERALL SUMMARY');
    console.log('-'.repeat(40));
    console.log(`Total Tests: ${summary.totalTests}`);
    console.log(`Passed: ${summary.totalPassed} (${Math.round((summary.totalPassed/summary.totalTests)*100)}%)`);
    console.log(`Failed: ${summary.totalFailed}`);
    console.log(`Skipped: ${summary.totalSkipped}`);
    console.log(`Status: ${summary.overallStatus === 'passed' ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log('');

    // Module breakdown
    console.log('🏗️  MODULE BREAKDOWN');
    console.log('-'.repeat(40));
    console.log('Module'.padEnd(15) + ' Tests  Pass%  Status     Avg Duration');
    console.log('-'.repeat(60));

    data.modules
      .sort((a, b) => b.total - a.total)
      .forEach(module => {
        const statusIcon = module.status === 'healthy' ? '✅' : 
                          module.status === 'degraded' ? '⚠️' : '❌';
        const statusText = module.status.toUpperCase().padEnd(8);
        
        console.log(
          `${module.module.padEnd(15)} ` +
          `${module.total.toString().padStart(4)}  ` +
          `${module.passRate.toString().padStart(4)}%  ` +
          `${statusIcon} ${statusText} ` +
          `${module.avgDuration}ms`
        );
      });

    console.log('');

    // Show detailed test failures if any
    const failedTests = data.modules
      .flatMap(m => m.tests.filter(t => t.status === 'failed' || t.status === 'timedOut'))
      .slice(0, 5); // Show top 5 failures

    if (failedTests.length > 0) {
      console.log('❌ TOP FAILED TESTS');
      console.log('-'.repeat(40));
      failedTests.forEach((test, idx) => {
        console.log(`${idx + 1}. ${test.title} (${test.project})`);
        console.log(`   Duration: ${test.duration}ms, Status: ${test.status}`);
      });
      console.log('');
    }

    // Performance insights
    this.showPerformanceInsights(data.modules);
  }

  analyzePlaywrightResults() {
    const data = JSON.parse(fs.readFileSync(this.playwrightResultsPath, 'utf8'));
    
    console.log('📊 Analyzing from Playwright JSON results...');
    console.log('');

    const moduleStats = new Map();
    
    // Process suites and tests
    data.suites?.forEach(suite => {
      this.processSuite(suite, moduleStats);
    });

    // Display results
    console.log('🏗️  MODULE BREAKDOWN');
    console.log('-'.repeat(40));
    console.log('Module'.padEnd(15) + ' Tests  Passed  Failed  Pass%');
    console.log('-'.repeat(50));

    Array.from(moduleStats.entries())
      .sort(([,a], [,b]) => b.total - a.total)
      .forEach(([module, stats]) => {
        const passRate = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
        const status = passRate >= 90 ? '✅' : passRate >= 70 ? '⚠️' : '❌';
        
        console.log(
          `${module.padEnd(15)} ` +
          `${stats.total.toString().padStart(4)}  ` +
          `${stats.passed.toString().padStart(6)}  ` +
          `${stats.failed.toString().padStart(6)}  ` +
          `${passRate.toString().padStart(4)}% ${status}`
        );
      });

    console.log('');
  }

  processSuite(suite, moduleStats, parentPath = '') {
    const suitePath = parentPath ? `${parentPath}/${suite.title}` : suite.title;
    
    suite.specs?.forEach(spec => {
      const module = this.extractModuleFromPath(spec.file || suitePath);
      
      if (!moduleStats.has(module)) {
        moduleStats.set(module, { total: 0, passed: 0, failed: 0, skipped: 0 });
      }
      
      const stats = moduleStats.get(module);
      
      spec.tests?.forEach(test => {
        stats.total++;
        
        const result = test.results?.[0];
        if (result) {
          if (result.status === 'passed') {
            stats.passed++;
          } else if (result.status === 'failed' || result.status === 'timedOut') {
            stats.failed++;
          } else {
            stats.skipped++;
          }
        }
      });
    });

    suite.suites?.forEach(childSuite => {
      this.processSuite(childSuite, moduleStats, suitePath);
    });
  }

  extractModuleFromPath(filePath) {
    if (filePath.includes('/sales/')) return 'Sales';
    if (filePath.includes('/purchase/')) return 'Purchase';
    if (filePath.includes('/inventory/')) return 'Inventory';
    if (filePath.includes('/hr/')) return 'HR';
    if (filePath.includes('/project/')) return 'Project';
    if (filePath.includes('/cross-module/')) return 'Cross-Module';
    return 'General';
  }

  showPerformanceInsights(modules) {
    console.log('⚡ PERFORMANCE INSIGHTS');
    console.log('-'.repeat(40));
    
    const slowestModule = modules.reduce((prev, curr) => 
      prev.avgDuration > curr.avgDuration ? prev : curr
    );
    
    const fastestModule = modules.reduce((prev, curr) => 
      prev.avgDuration < curr.avgDuration ? prev : curr
    );
    
    console.log(`🐌 Slowest Module: ${slowestModule.module} (${slowestModule.avgDuration}ms avg)`);
    console.log(`🚀 Fastest Module: ${fastestModule.module} (${fastestModule.avgDuration}ms avg)`);
    
    const totalDuration = modules.reduce((sum, m) => sum + m.totalDuration, 0);
    console.log(`⏱️  Total Test Time: ${Math.round(totalDuration / 1000)}s`);
    console.log('');
  }

  generateMarkdownReport() {
    if (!fs.existsSync(this.resultsPath)) {
      console.log('❌ No detailed statistics available for markdown report');
      return;
    }

    const data = JSON.parse(fs.readFileSync(this.resultsPath, 'utf8'));
    
    let markdown = `# BEFFA ERP Test Results Report\
\
`;
    markdown += `**Generated**: ${new Date(data.timestamp).toLocaleString()}\
`;
    markdown += `**Test Type**: ${data.testType.toUpperCase()}\
`;
    markdown += `**Duration**: ${Math.round(data.totalDuration / 1000)}s\
\
`;
    
    // Summary table
    markdown += `## Summary\
\
`;
    markdown += `| Metric | Count | Percentage |\
`;
    markdown += `|--------|-------|------------|\
`;
    markdown += `| Total Tests | ${data.summary.totalTests} | 100% |\
`;
    markdown += `| Passed | ${data.summary.totalPassed} | ${Math.round((data.summary.totalPassed/data.summary.totalTests)*100)}% |\
`;
    markdown += `| Failed | ${data.summary.totalFailed} | ${Math.round((data.summary.totalFailed/data.summary.totalTests)*100)}% |\
`;
    markdown += `| Skipped | ${data.summary.totalSkipped} | ${Math.round((data.summary.totalSkipped/data.summary.totalTests)*100)}% |\
\
`;
    
    // Module breakdown
    markdown += `## Module Breakdown\
\
`;
    markdown += `| Module | Tests | Pass Rate | Status | Avg Duration |\
`;
    markdown += `|--------|-------|-----------|--------|--------------|\
`;
    
    data.modules
      .sort((a, b) => b.total - a.total)
      .forEach(module => {
        const statusEmoji = module.status === 'healthy' ? '✅' : 
                           module.status === 'degraded' ? '⚠️' : '❌';
        markdown += `| ${module.module} | ${module.total} | ${module.passRate}% | ${statusEmoji} ${module.status} | ${module.avgDuration}ms |\
`;
      });
    
    const reportPath = path.join(process.cwd(), 'test-results', 'module-report.md');
    fs.writeFileSync(reportPath, markdown);
    
    console.log(`📝 Markdown report generated: ${reportPath}`);
  }
}

// CLI interface
if (require.main === module) {
  const analyzer = new ModuleStatsAnalyzer();
  const args = process.argv.slice(2);
  
  if (args.includes('--markdown') || args.includes('-md')) {
    analyzer.generateMarkdownReport();
  } else {
    analyzer.analyze();
  }
}

module.exports = ModuleStatsAnalyzer;