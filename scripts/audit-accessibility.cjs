const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(path.join(process.env.TEMP, 'portfolio-a11y-tools/node_modules/playwright'));
const { default: AxeBuilder } = require(path.join(process.env.TEMP, 'portfolio-a11y-tools/node_modules/@axe-core/playwright'));
const { pages } = require('../scripts/seo-render').pageData();

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--no-sandbox'] });
  const results = [];
  for (const width of [1280, 768, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const [id, route] of Object.entries(pages)) {
      await page.goto('http://127.0.0.1:3087' + route.path, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.portfolioPagesReady && document.body.dataset.currentPage);
      await page.evaluate(() => window.portfolioPagesReady);
      await page.waitForFunction(() => typeof appBootstrapped !== 'undefined' && appBootstrapped && document.querySelector('.page-back-wrap'));
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      const overflow = await page.evaluate(() => ({
        amount: document.documentElement.scrollWidth - innerWidth,
        elements: [...document.querySelectorAll('main *')].filter(el => el.getClientRects().length && el.getBoundingClientRect().right > innerWidth + 2 && getComputedStyle(el).position !== 'absolute').slice(0, 8).map(el => el.className)
      }));
      results.push({ id, path: route.path, width, violations: audit.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), incomplete: audit.incomplete.map(v => v.id), overflow });
      fs.writeFileSync(process.argv[2] || 'accessibility-results.json', JSON.stringify(results, null, 2));
      console.log(id, width, audit.violations.map(v => v.id).join(','), 'overflow', overflow.amount);
    }
    await context.close();
  }
  fs.writeFileSync(process.argv[2] || 'accessibility-results.json', JSON.stringify(results, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
