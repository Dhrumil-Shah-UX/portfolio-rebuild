const fs = require('node:fs');
for (const file of fs.readdirSync('pages').filter(name => /^case-.*\.html$/.test(name))) {
  const location = `pages/${file}`;
  const html = fs.readFileSync(location, 'utf8');
  const updated = html.replace(/(<aside class="overview-impact"[^>]*><h2>)Impact at a glance(<\/h2>)/g, '$1Impact$2');
  if (updated !== html) fs.writeFileSync(location, updated);
}
