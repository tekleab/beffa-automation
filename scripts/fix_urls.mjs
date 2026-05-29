import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  '../lib/BasePage.ts',
  '../lib/api/InventoryAPI.ts',
  '../lib/api/SalesAPI.ts',
  '../lib/api/PurchaseAPI.ts'
];

let totalReplaced = 0;

files.forEach(f => {
  const filePath = path.join(__dirname, f);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  const searchStr1 = `let base = process.env.BASE_URL ? process.env.BASE_URL.replace(/\\/$/, '') : 'http://157.180.20.112:8001';`;
  const replaceStr1 = `let base = process.env.BASE_URL ? process.env.BASE_URL.replace(/\\/$/, '').replace(':4173', ':8001') : process.env.API_URL?.replace(':4173', ':8001') || 'http://localhost:8001';`;

  const searchStr2 = `let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\\/$/, '') : 'http://157.180.20.112:8001';`;
  const replaceStr2 = `let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\\/$/, '').replace(':4173', ':8001') : process.env.API_URL?.replace(':4173', ':8001') || 'http://localhost:8001';`;

  let newContent = content.split(searchStr1).join(replaceStr1);
  newContent = newContent.split(searchStr2).join(replaceStr2);

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    const count1 = content.split(searchStr1).length - 1;
    const count2 = content.split(searchStr2).length - 1;
    console.log(`Updated ${path.basename(f)}: ${count1 + count2} replacements made.`);
    totalReplaced += (count1 + count2);
  }
});

console.log(`Done! Total replacements: ${totalReplaced}`);
