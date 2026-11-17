const fs = require('node:fs');
const path = require('node:path');
const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const plain = value => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
for (const file of fs.readdirSync('pages').filter(name => /^case-.*\.html$/.test(name))) {
  const location = path.join('pages', file);
  let html = fs.readFileSync(location, 'utf8');
  if (html.includes('overview-impact')) continue;
  const impact = html.match(/<section\b[^>]*id="[^"]*-impact"[^>]*>([\s\S]*?)(?=<section\b|$)/);
  const overview = html.match(/<section\b[^>]*id="[^"]*-overview"[^>]*>([\s\S]*?)<\/section>/);
  if (!impact || !overview) continue;
  const heading = impact[1].match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  const description = impact[1].match(/<header[^>]*>[\s\S]*?<p[^>]*>(?!Impact<)([\s\S]*?)<\/p>\s*<\/header>/);
  const entries = [...impact[1].matchAll(/<div[^>]*>\s*<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>\s*<\/div>/g)].slice(0, 2);
  if (!heading) continue;
  const items = [[heading[1], description?.[1] || 'See the Impact section below for evidence and limitations.'], ...entries.map(entry => [entry[1], entry[2]])];
  const summary = `<aside class="overview-impact" aria-label="Impact overview"><h2>Impact at a glance</h2><ol>${items.map(([title, text]) => `<li><h3>${title}</h3><p>${text}</p></li>`).join('')}</ol><a href="#${impact[0].match(/id="([^"]+)"/)[1]}">Review outcomes &amp; evidence</a></aside>`;
  let updated = overview[0].replace(/<\/header>/, `</header>${summary}`);
  updated = updated.replace(/<dl class="([^"]*-facts)">([\s\S]*?)<\/dl>/, (_, className, content) => {
    const rows = [...content.matchAll(/<div[^>]*>[\s\S]*?<\/div>/g)].map(match => match[0]);
    const primary = rows.filter(row => /<dt>(?:My role|Role|My contribution|Team|Timeline)<\/dt>/i.test(row));
    const secondary = rows.filter(row => !primary.includes(row));
    return `<div class="overview-context">${primary.length ? `<dl class="${className} overview-primary">${primary.join('')}</dl>` : ''}<details class="overview-details"><summary>Project context &amp; methods</summary><dl class="${className}">${secondary.join('')}</dl></details></div>`;
  });
  html = html.replace(overview[0], updated);
  fs.writeFileSync(location, html);
  console.log(file);
}
