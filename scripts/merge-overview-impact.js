const fs = require('node:fs');
for (const file of fs.readdirSync('pages').filter(name => /^case-.*\.html$/.test(name))) {
  const location = `pages/${file}`;
  let html = fs.readFileSync(location, 'utf8');
  const impact = html.match(/<aside class="overview-impact"[\s\S]*?<\/aside>/);
  if (!impact || !html.includes('overview-metadata')) continue;
  html = html.replace(impact[0], '');
  html = html.replace(/(<div class="overview-context"><dl class="overview-metadata"[\s\S]*?<\/dl>)(<\/div>)/, `$1${impact[0]}$2`);
  fs.writeFileSync(location, html);
}
