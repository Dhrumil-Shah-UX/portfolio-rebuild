const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(path.join(process.env.TEMP, 'portfolio-a11y-tools/node_modules/playwright'));
const out = path.resolve('.tmp/responsive-audit');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', args: ['--no-sandbox', '--disable-gpu'] });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  const results = [];
  for (const width of [320, 375, 768, 1024, 1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: width <= 375 ? 740 : 900 });
    for (const route of ['/', '/ai-lab', '/writing']) {
      await page.goto('http://127.0.0.1:3087' + route, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.ai-process-motion-toggle', { state: 'attached' });
      await page.evaluate(async () => {
        const images = [...document.querySelectorAll('.page.is-visible img, .site-footer img, .site-header img')];
        images.forEach(img => { img.loading = 'eager'; });
        await Promise.race([Promise.all(images.map(img => img.decode().catch(() => {}))), new Promise(resolve => setTimeout(resolve, 5000))]);
      });
      const name = route === '/' ? 'home' : route.slice(1);
      await page.screenshot({ path: path.join(out, `review-${name}-${width}.jpg`), fullPage: true, type: 'jpeg', quality: 70 });
      results.push({ route, width, overflow: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), images: await page.locator('.page.is-visible img').evaluateAll(images => images.filter(img => img.getClientRects().length && img.complete && !img.naturalWidth).map(img => img.getAttribute('src'))) });
      if (route === '/ai-lab') {
        for (let index = 0; index < 6; index++) {
          const button = page.locator('.ai-process-label').nth(index);
          await button.focus();
          await page.waitForTimeout(50);
          results.push({ route, width, phase: index + 1, state: await button.evaluate(el => {
            const tooltip = document.getElementById(el.getAttribute('aria-describedby'));
            const rect = tooltip.getBoundingClientRect();
            const scroller = el.closest('.ai-process-scroll');
            return { visible: getComputedStyle(tooltip).visibility, left: rect.left, right: rect.right, width: rect.width, scroll: scroller.scrollLeft };
          }) });
        }
        await page.keyboard.press('Escape');
        const lastWorkshop = page.locator('[data-workshop="5"]');
        await lastWorkshop.click();
        results.push({ route, width, lastWorkshopSelected: await lastWorkshop.getAttribute('aria-pressed') });
        await page.locator('#ai-workshops').screenshot({ path: path.join(out, `review-workshops-${width}.jpg`), type: 'jpeg', quality: 70 });
      }
      if (route === '/writing') {
        await page.locator('[data-note-next]').click();
        results.push({ route, width, nextNote: await page.locator('.notebook-controls').textContent() });
        await page.locator('.notebook-stage').screenshot({ path: path.join(out, `review-notebook-${width}.jpg`), type: 'jpeg', quality: 70 });
      }
    }
  }
  fs.writeFileSync(path.join(out, 'review-results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
