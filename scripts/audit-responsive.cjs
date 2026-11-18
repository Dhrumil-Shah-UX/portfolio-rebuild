const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(path.join(process.env.TEMP, 'portfolio-a11y-tools/node_modules/playwright'));
const routes = Object.entries(require('../scripts/seo-render').pageData().pages);
const widths = [320, 375, 600, 768, 980, 1000, 1024, 1200, 1440, 1920, 2560];
const output = path.resolve('.tmp/responsive-audit');
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', args: ['--no-sandbox', '--disable-gpu'] });
  const results = [];
  const jobs = widths.flatMap(width => routes.map(([id, route]) => ({ id, route, width })));
  async function worker() {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (;;) {
      const job = jobs.shift();
      if (!job) break;
      const { id, route, width } = job;
      try {
        await page.setViewportSize({ width, height: width < 600 ? 740 : 900 });
        await page.goto('http://127.0.0.1:3087' + route.path, { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => document.querySelector('.ai-process-motion-toggle'));
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(100);
        const metrics = await page.evaluate(() => {
          const visible = el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
          const clipped = [...document.querySelectorAll('.page.is-visible h1, .page.is-visible h2, .page.is-visible h3, .page.is-visible p, .page.is-visible button, .page.is-visible a')].filter(visible).filter(el => {
            const s = getComputedStyle(el);
            return (['hidden', 'clip'].includes(s.overflowX) && el.scrollWidth > el.clientWidth + 3) || (['hidden', 'clip'].includes(s.overflowY) && el.scrollHeight > el.clientHeight + 3);
          }).map(el => ({ tag: el.tagName, class: el.className, text: el.textContent.trim().slice(0, 80), width: el.clientWidth, height: el.clientHeight, scrollWidth: el.scrollWidth, scrollHeight: el.scrollHeight }));
          const header = document.querySelector('.site-header').getBoundingClientRect();
          const heading = document.querySelector('.page.is-visible h1').getBoundingClientRect();
          return { overflow: document.documentElement.scrollWidth - innerWidth, clipped, headingUnderHeader: heading.top < header.bottom && heading.bottom > header.top, documentHeight: document.documentElement.scrollHeight };
        });
        let screenshot;
        if ([375, 1024, 1920].includes(width) || ['home', 'ai-lab', 'writing'].includes(id) && [320, 768, 1440, 2560].includes(width)) {
          screenshot = `${id.replaceAll('/', '-')}-${width}.jpg`;
          await page.screenshot({ path: path.join(output, screenshot), fullPage: true, type: 'jpeg', quality: 60 });
        }
        results.push({ id, width, ...metrics, screenshot });
        fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
        console.log(id, width, 'overflow', metrics.overflow, 'clipped', metrics.clipped.length);
      } catch (error) {
        results.push({ ...job, error: error.message });
      }
    }
    await context.close();
  }
  await Promise.all([worker(), worker(), worker()]);
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
