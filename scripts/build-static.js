const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
// Allowlist public assets. Never copy server code, SQL, tests, or .env files.
fs.mkdirSync(output, { recursive: true });
for (const item of ['index.html', 'css', 'js', 'pages', 'assets']) {
  fs.cpSync(path.join(root, item), path.join(output, item), { recursive: true });
}
console.log('Built public portfolio assets in dist/.');
