const fs = require('node:fs');
for (const file of fs.readdirSync('pages').filter(name => /^case-.*\.html$/.test(name))) {
  const location = `pages/${file}`;
  const html = fs.readFileSync(location, 'utf8');
  const updated = html.replace(/<div class="overview-context">([\s\S]*?)<\/section><\/div>/g, (_, content) => {
    const rows = [...content.matchAll(/<dl\b[^>]*>([\s\S]*?)<\/dl>/g)].map(match => match[1]).join('');
    return `<div class="overview-context"><dl class="overview-metadata" aria-label="Project details">${rows}</dl></div>`;
  });
  if (updated !== html) fs.writeFileSync(location, updated);
}
