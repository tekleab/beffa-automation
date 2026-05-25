const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.spec.ts')) {
            results.push(file);
        }
    });
    return results;
};

const files = walk('/home/teklish/beffa-automation/tests');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // First remove all existing tags entirely
    content = content.replace(/@(smoke|regression|full|logic|security|inventory|purchase|sales|concurrency|costing)/g, '');
    
    // Clean up all trailing spaces inside the single or double quotes
    content = content.replace(/ +\)/g, ')');
    content = content.replace(/ +'/g, "'");
    content = content.replace(/ +`/g, '`');
    
    let isForensic = file.includes('audit') || file.includes('logic') || file.includes('concurrency') || file.includes('security') || file.includes('isolation') || file.includes('integrity') || file.includes('financial');
    
    let isSmoke = !isForensic && (file.includes('vendor.spec') || file.includes('customer.spec') || file.includes('purchase-bill-ui-flow') || file.includes('receipt') || file.includes('adjustment-ui') || file.includes('sales-order') || file.includes('invoice'));
    
    // Build tags with guaranteed leading space
    let domainTag = file.includes('/sales/') ? ' @sales' : (file.includes('/purchase/') ? ' @purchase' : ' @inventory');
    let forensicTags = isForensic ? (file.includes('logic') || file.includes('financial') || file.includes('integrity') ? ' @logic' : (file.includes('concurrency') ? ' @concurrency @security' : ' @security')) : '';
    let costingTag = file.includes('average-audit') || file.includes('fifo-audit') ? ' @costing' : '';
    
    let levelTags = isSmoke ? ' @smoke @regression @full' : ' @regression @full';
    
    let allTags = `${domainTag}${forensicTags}${costingTag}${levelTags}`;
    
    // Inject tags into test.describe('...', ...)
    // Ensure there is a space before the new tags
    content = content.replace(/(test\.describe\(['"`][^'"`]+)(['"`])/, `$1${allTags}$2`);
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated tags for ${file}: ${allTags}`);
});
