const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const seo = require('../scripts/seo-render');
const server = require('../scripts/dev-server');
let origin;
before(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = 'http://127.0.0.1:' + server.address().port;
});
after(() => new Promise(resolve => server.close(resolve)));
const pages = seo.pageData().pages;
for (const [id, page] of Object.entries(pages)) {
  test('crawlable HTML, metadata and assets: ' + page.path, async () => {
    const response = await fetch(origin + page.path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.equal((html.match(/<h1\b/g) || []).length, 1, 'one page-level heading');
    assert.equal((html.match(/class="page\b[^"]*\bis-visible\b[^"]*"/g) || []).length, 1, 'only the entry page in the initial response');
    assert.ok(html.includes(`<title>${require('../js/content-markup').escape(page.title)}</title>`));
    assert.ok(html.includes(`<link rel="canonical" href="${seo.getOrigin() + page.path}">`));
    assert.ok(html.includes('name="description"'));
    assert.ok(html.includes('name="twitter:card"'));
    assert.ok(html.includes('property="og:image:alt"'));
    const graph = JSON.parse(html.match(/id="portfolio-structured-data">([\s\S]*?)<\/script>/)[1]);
    assert.equal(graph['@context'], 'https://schema.org');
    const identities = new Set(graph['@graph'].map(node => node['@id']));
    for (const node of graph['@graph']) {
      for (const value of Object.values(node)) if (value && typeof value === 'object' && value['@id']) assert.ok(identities.has(value['@id']), 'resolved structured-data identity');
    }
    assert.ok(fs.existsSync(path.join(seo.root, '.' + page.image)), 'social image exists');
    assert.ok(page.description.length >= 70 && page.description.length <= 210, 'descriptive metadata');
    const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/)[1];
    assert.ok(main.replace(/<[^>]*>/g, '').trim().length > 120, 'meaningful text without JS');
    if (page.article) assert.ok(main.includes('data-article-body>') && !main.includes('data-article-title></h1>'));
    const urls = [...html.matchAll(/\b(?:src|href|poster)=["']([^"']+)["']/g)].map(match => match[1]);
    for (const url of urls) {
      if (!url.startsWith('/') || url.startsWith('//')) continue;
      const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
      if (Object.values(pages).some(entry => entry.path === pathname)) continue;
      assert.ok(fs.existsSync(path.join(seo.root, '.' + pathname)), 'local asset exists: ' + url);
    }
  });
}
test('unique titles, descriptions, paths and complete sitemap', async () => {
  for (const field of ['title', 'description', 'path']) assert.equal(new Set(Object.values(pages).map(page => page[field])).size, Object.keys(pages).length);
  const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(locations.sort(), Object.values(pages).map(page => seo.getOrigin() + page.path).sort());
  const robots = await (await fetch(origin + '/robots.txt')).text();
  assert.ok(robots.includes('Sitemap: ' + seo.getOrigin() + '/sitemap.xml'));
  assert.ok(!robots.includes('Disallow: /\n'));
});
test('real 404s, non-indexable fragments, canonical redirects and private-file exclusion', async () => {
  for (const url of ['/missing-page', '/work/missing-case', '/config/seo.json', '/.env.local', '/server/config.js']) assert.equal((await fetch(origin + url)).status, 404);
  assert.equal((await fetch(origin + '/pages/case-trial.html')).headers.get('x-robots-tag'), 'noindex');
  assert.equal((await fetch(origin + '/pages/case-trial')).headers.get('x-robots-tag'), 'noindex');
  for (const [url, destination] of [['/work/', '/work'], ['/work.html', '/work'], ['/index.html', '/']]) {
    const response = await fetch(origin + url, { redirect: 'manual' });
    assert.equal(response.status, 308); assert.equal(response.headers.get('location'), destination);
  }
  const head = await fetch(origin + '/work/trialbridge', { method: 'HEAD' });
  assert.equal(head.status, 200); assert.equal(await head.text(), '');
});
test('canonical origin can be changed without editing page metadata', () => {
  const original = process.env.SITE_ORIGIN;
  try {
    process.env.SITE_ORIGIN = 'https://example.test';
    assert.ok(seo.renderPage('case-trial').includes('href="https://example.test/work/trialbridge"'));
    assert.ok(seo.sitemap().includes('https://example.test/work/trialbridge'));
    assert.ok(seo.robots().includes('https://example.test/sitemap.xml'));
    process.env.SITE_ORIGIN = 'https://example.test/#home';
    assert.throws(() => seo.getOrigin(), /without a path/);
  } finally {
    if (original === undefined) delete process.env.SITE_ORIGIN; else process.env.SITE_ORIGIN = original;
  }
});
test('local video requests support ranges without downloading the entire recording', async () => {
  const response = await fetch(origin + '/assets/videos/mindle.mp4', { headers: { Range: 'bytes=0-127' } });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('content-length'), '128');
  assert.equal((await response.arrayBuffer()).byteLength, 128);
  assert.equal((await fetch(origin + '/assets/videos/mindle.mp4', { headers: { Range: 'bytes=999999999999-' } })).status, 416);
});
test('above-fold project images are eager and responsive; full-resolution links survive', () => {
  for (const id of ['work', 'case-trial', 'about']) {
    const html = seo.renderFragment(id);
    const image = html.match(/<img\b[^>]+>/)[0];
    assert.ok(image.includes('fetchpriority="high"'));
    assert.ok(!image.includes('loading="lazy"'));
    assert.ok(image.includes('srcset='));
  }
  assert.ok(seo.renderPage('case-trial').includes('href="/assets/images/case-studies/trialbridge/figma-dashboard-full.png"'));
  for (const images of Object.values(require('../config/image-responsive.json'))) for (const image of images) assert.ok(fs.existsSync(path.join(seo.root, '.' + image.src)));
});
