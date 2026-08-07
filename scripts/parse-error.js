const fs = require('fs');
const data = JSON.parse(fs.readFileSync('playwright-results.json', 'utf8'));
function walk(suites) {
  for (const suite of suites || []) {
    for (const spec of suite.specs || []) {
      if (spec.title && spec.title.includes('INV-UI-03')) {
        for (const test of spec.tests || []) {
          for (const r of test.results || []) {
            console.log('STATUS:', test.status);
            for (const e of r.errors || []) console.log('ERROR:', e.message?.substring(0, 800));
            for (const s of r.stdout || []) process.stdout.write('STDOUT: ' + s.text);
          }
        }
      }
    }
    walk(suite.suites);
  }
}
walk(data.suites);
