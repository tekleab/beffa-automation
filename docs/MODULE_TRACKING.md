# Module Test Statistics & Tracking

This document explains the enhanced module counting and tracking system for BEFFA ERP automation tests, specifically designed for full test runs and Allure integration.

## 🎯 Overview

The module tracking system provides:
- **Test counting by module** (Sales, Purchase, Inventory, HR, Cross-Module)
- **Detailed statistics** including pass rates, duration, and failure breakdown
- **Allure integration** with custom attachments
- **Dashboard visualization** in the QA dashboard
- **Markdown reports** for documentation

## 🔧 Components

### 1. Module Counter Reporter
**File**: `reporters/module-counter-reporter.ts`

- Automatically detects full test runs (`TEST_TYPE=full` or 5+ projects)
- Tracks statistics per module during test execution
- Generates detailed JSON reports and Allure attachments
- Prints module summary at the end of test runs

### 2. Enhanced Summary Reporter
**File**: `reporters/summary-reporter.ts` (updated)

- Shows module breakdown in the final `[RESULT]` summary
- Displays pass rates per module for full test runs
- Integrates with existing CI output format

### 3. Module Analysis Script
**File**: `scripts/analyze-modules.js`

- Post-test analysis tool for detailed statistics
- Generates markdown reports
- Performance insights (slowest/fastest modules)
- CLI interface for manual analysis

## 📊 Usage

### Running Full Tests with Module Tracking

```bash
# Local run with module tracking
npm run test:full

# Manual analysis after any test run
npm run analyze:modules

# Generate markdown report
npm run report:modules:md
```

### CI/CD Integration

When running `TEST_TYPE=full` in GitHub Actions:
1. Module Counter Reporter automatically activates
2. Generates `module-statistics.json` in `test-results/`
3. Creates Allure attachment with module breakdown
4. Produces markdown report deployed to GitHub Pages
5. Prints detailed console output for CI logs

### Example Output

```
📊 MODULE TEST STATISTICS SUMMARY
================================================================================
🕒 Total Execution Time: 247s
🧪 Total Tests Executed: 89

✅ Sales            │  32 tests │  94% pass │ avg 2847ms │ P:30 F:2 S:0
✅ Purchase         │  24 tests │  92% pass │ avg 3102ms │ P:22 F:2 S:0
⚠️ Inventory        │  18 tests │  78% pass │ avg 2156ms │ P:14 F:4 S:0
✅ HR               │  12 tests │  100% pass │ avg 1823ms │ P:12 F:0 S:0
✅ Cross-Module     │   3 tests │  100% pass │ avg 4205ms │ P:3 F:0 S:0

Legend: P=Passed, F=Failed, S=Skipped
================================================================================
```

## 📈 Reports Generated

### 1. JSON Statistics
**Location**: `test-results/module-statistics.json`
- Complete test data with individual test details
- Module-level aggregations
- Timing and performance metrics

### 2. Markdown Report
**Location**: `test-results/module-report.md`
- Human-readable summary tables
- Module breakdown with status indicators
- Deployed to GitHub Pages for full test runs

### 3. Allure Attachment
**Location**: `allure-results/{id}-attachment.md`
- Integrated into Allure reports
- Module statistics as structured markdown
- Visible in Allure UI under attachments

## 🎯 Module Detection Logic

Tests are automatically categorized by file path:
- `/tests/sales/` → **Sales** module
- `/tests/purchase/` → **Purchase** module  
- `/tests/inventory/` → **Inventory** module
- `/tests/hr/` → **HR** module
- `/tests/cross-module/` → **Cross-Module** module
- Others → **General** module (fallback to project name)

## 📋 Module Status Classification

- **Healthy** ✅: ≥90% pass rate
- **Degraded** ⚠️: 70-89% pass rate  
- **Critical** ❌: <70% pass rate

## 🔗 Integration Points

### QA Dashboard
Module statistics feed into the existing QA dashboard (`scripts/qa-dashboard.html`) for visualization.

### Allure Reports
Custom attachments provide module breakdown visible in Allure UI, enhancing the detailed test reports.

### CI/CD Pipeline
Full test runs automatically generate and deploy module reports to GitHub Pages alongside Allure reports.

## 🛠️ Configuration

The system activates automatically for full test runs. Configuration options:

### Environment Variables
- `TEST_TYPE=full` - Enables enhanced module tracking
- `DEBUG=true` - Enables verbose logging (if implemented)

### Playwright Config
Module Counter Reporter is included in the reporter chain:
```typescript
reporter: [
  ['list'],
  ['./reporters/module-counter-reporter.ts'], // Module tracking
  // ... other reporters
],
```

## 📝 Notes

- Module tracking adds minimal overhead to test execution
- Reports are generated only for full test runs to avoid noise
- All reports are automatically deployed to GitHub Pages
- Compatible with existing Allure and dashboard infrastructure

---

**Part of**: BEFFA ERP High-Integrity Automation Suite v4.0.0