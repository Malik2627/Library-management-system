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

const files = getFiles('./src');
let errors = 0;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const importMatches = content.matchAll(/from\s+['"](\.[^'"]+)['"]/g);
  for (const m of importMatches) {
    const rel = m[1];
    const dir = path.dirname(f);
    let resolved = path.resolve(dir, rel);
    let exists = fs.existsSync(resolved) || fs.existsSync(resolved + '.js') || fs.existsSync(resolved + '.jsx');
    if (!exists) {
      console.error('BROKEN IMPORT in ' + f + ': ' + rel);
      errors++;
    }
  }
});

if (errors === 0) {
  console.log(`✅ SUCCESS: All ${files.length} source files have 100% valid internal imports!`);
} else {
  console.error(`❌ Total broken imports found: ${errors}`);
  process.exit(1);
}

