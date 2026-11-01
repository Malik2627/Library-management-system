import fs from 'fs';
import path from 'path';

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(full));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(full);
    }
  });
  return results;
}

// Case-sensitive file existence check (critical for Linux GitHub Actions runners)
function fileExistsCaseSensitive(targetPath) {
  const dir = path.dirname(targetPath);
  const base = path.basename(targetPath);
  
  if (!fs.existsSync(dir)) return false;
  
  const entries = fs.readdirSync(dir);
  // Check exact case match
  if (entries.includes(base)) return true;
  if (entries.includes(base + '.js')) return true;
  if (entries.includes(base + '.jsx')) return true;
  
  return false;
}

const files = [...getFiles('./src'), ...fs.readdirSync('.').filter(f => f.endsWith('.mjs'))];
let errors = 0;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const importMatches = content.matchAll(/from\s+['"](\.[^'"]+)['"]/g);
  for (const m of importMatches) {
    const rel = m[1];
    const dir = path.dirname(f);
    const resolved = path.resolve(dir, rel);
    
    if (!fileExistsCaseSensitive(resolved)) {
      console.error(`❌ CASE-SENSITIVE IMPORT ERROR in ${f}: import '${rel}' does not match disk casing!`);
      errors++;
    }
  }
});

if (errors === 0) {
  console.log(`✅ SUCCESS: All ${files.length} source & test files have 100% case-sensitive valid imports!`);
} else {
  console.error(`❌ Total broken imports found: ${errors}`);
  process.exit(1);
}
