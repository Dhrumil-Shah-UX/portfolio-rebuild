const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const seo = require('./seo-render');
// Allowlist public assets. Never copy server code, SQL, tests, or .env files.
fs.mkdirSync(output, { recursive: true });
for (const item of ['404.html', 'css', 'js', 'pages', 'assets']) {
  fs.cpSync(path.join(root, item), path.join(output, item), { recursive: true });
}
for (const [id, page] of Object.entries(seo.pageData().pages)) {
  const file = path.join(output, page.path === '/' ? 'index.html' : page.path.slice(1) + '.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, seo.renderPage(id));
}
for (const page of seo.manifest.pages) {
  fs.writeFileSync(path.join(output, 'pages', page.file), seo.renderFragment(page.id, { hidden: true }));
}
// Flatten the existing import order to avoid a render-blocking CSS request chain.
const css = fs.readFileSync(path.join(root, 'css/main.css'), 'utf8').replace(/@import\s+["']\.\/([^"']+)["'];/g, (_, file) => fs.readFileSync(path.join(root, 'css', file), 'utf8'));
fs.writeFileSync(path.join(output, 'css/main.css'), seo.rewriteCSS(css));
for (const file of fs.readdirSync(path.join(output, 'css')).filter(file => file.endsWith('.css') && file !== 'main.css')) {
  const target = path.join(output, 'css', file);
  fs.writeFileSync(target, seo.rewriteCSS(fs.readFileSync(target, 'utf8')));
}
fs.writeFileSync(path.join(output, '404.html'), seo.rewriteHTML(fs.readFileSync(path.join(root, '404.html'), 'utf8')));
fs.writeFileSync(path.join(output, 'robots.txt'), seo.robots());
fs.writeFileSync(path.join(output, 'sitemap.xml'), seo.sitemap());
console.log(`Built ${Object.keys(seo.pageData().pages).length} statically rendered routes, public assets, robots.txt, and sitemap.xml in dist/.`);
