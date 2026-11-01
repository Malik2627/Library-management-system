import fs from 'fs';
import path from 'path';

function walk(dir) {
  let list = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      list = list.concat(walk(full));
    } else if (/\.(jsx?|mjs)$/.test(item)) {
      list.push(full);
    }
  }
  return list;
}

const allFiles = [...walk('./src'), ...fs.readdirSync('.').filter(f => f.endsWith('.mjs'))];
let issues = 0;

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  const regex = /from\s+['"](\.[^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const importPath = match[1];
    const resolvedBase = path.resolve(dir, importPath);
    const targetDir = path.dirname(resolvedBase);
    const targetName = path.basename(resolvedBase);
    
    if (!fs.existsSync(targetDir)) {
      console.error(`❌ Directory does not exist: ${targetDir} referenced in ${file}`);
      issues++;
      continue;
    }
    
    const entries = fs.readdirSync(targetDir);
    const exactMatch = entries.find(e => 
      e === targetName || 
      e === targetName + '.js' || 
      e === targetName + '.jsx' || 
      e === targetName + '.mjs'
    );
    
    if (!exactMatch) {
      console.error(`❌ MISMATCH in ${file}: import "${importPath}" not found in ${targetDir}`);
      issues++;
    } else {
      const stem = exactMatch.replace(/\.(jsx?|mjs)$/, '');
      if (stem !== targetName && exactMatch !== targetName) {
        console.error(`❌ CASING DIFFERENCE in ${file}: imported "${targetName}" vs actual disk file "${exactMatch}"`);
        issues++;
      }
    }
  }
});

if (issues === 0) {
  console.log(`✅ ALL ${allFiles.length} FILES HAVE 100% PERFECT EXACT-CASING IMPORTS!`);
  process.exit(0);
} else {
  console.error(`❌ Total casing/import issues: ${issues}`);
  process.exit(1);
}
