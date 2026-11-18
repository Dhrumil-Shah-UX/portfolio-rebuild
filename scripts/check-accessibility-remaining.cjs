const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(path.join(process.env.TEMP, 'portfolio-a11y-tools/node_modules/playwright'));
const routes = ['/', '/ai-lab', '/writing', '/about', '/work/trialbridge', '/ai-lab/mindle'];
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', args: ['--no-sandbox', '--disable-gpu'] });
  const context = await browser.newContext({ viewport: { width: 320, height: 740 }, reducedMotion: 'reduce', hasTouch: true });
  const page = await context.newPage();
  const results = [];
  for (const route of routes) {
    await page.goto('http://127.0.0.1:3087' + route, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof appBootstrapped !== 'undefined' && appBootstrapped && document.querySelector('.page-back-wrap'));
    await page.evaluate(() => document.fonts.ready);
    for (const viewport of [{ width: 320, height: 740 }, { width: 740, height: 320 }]) {
      await page.setViewportSize(viewport);
      results.push({ route, viewport, overflow: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) });
    }
    await page.setViewportSize({ width: 320, height: 740 });
    results.push({ route, smallTargets: await page.locator('.page.is-visible button, .site-header button').evaluateAll(elements => elements.filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden').map(el => ({ text: el.getAttribute('aria-label') || el.textContent.trim(), width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height })).filter(el => el.width < 24 || el.height < 24)) });
    await page.setViewportSize({ width: 1280, height: 900 });
    const before = await page.locator('.page.is-visible h1').evaluate(el => getComputedStyle(el).fontSize);
    await page.evaluate(() => {
      const nodes = [...document.querySelectorAll('.page.is-visible *, .site-header *, .site-footer *')];
      const sizes = nodes.map(el => parseFloat(getComputedStyle(el).fontSize));
      nodes.forEach((el, i) => el.style.setProperty('font-size', `${sizes[i] * 2}px`, 'important'));
    });
    await page.waitForTimeout(150);
    results.push({ route, textEnlargement: { before, after: await page.locator('.page.is-visible h1').evaluate(el => getComputedStyle(el).fontSize), overflow: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) } });
  }
  await page.goto('http://127.0.0.1:3087/');
  await page.waitForFunction(() => typeof appBootstrapped !== 'undefined' && appBootstrapped && document.querySelector('.page-back-wrap'));
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({ path: 'accessibility-home-visual.png' });
  results.push({ reducedMotion: await page.locator('.page.is-visible video').evaluateAll(videos => videos.map(v => ({ paused: v.paused, autoplay: v.autoplay }))) });
  const control = page.locator('.home-game-motion-toggle').first();
  await control.scrollIntoViewIfNeeded();
  await control.screenshot({ path: 'accessibility-preview-visual.png' });
  await page.goto('http://127.0.0.1:3087/ai-lab');
  await page.waitForFunction(() => typeof appBootstrapped !== 'undefined' && appBootstrapped && document.querySelector('.page-back-wrap'));
  await page.locator('.ai-process-label').nth(2).focus();
  await page.screenshot({ path: 'accessibility-phase-visual.png' });
  results.push({ phaseAccessibleTree: await page.locator('.ai-process-label').nth(2).ariaSnapshot(), phaseStyles: await page.locator('.ai-process-label').nth(2).evaluate(el => ({ outline: getComputedStyle(el).outline, color: getComputedStyle(el).color, labelBackground: getComputedStyle(el.lastElementChild).backgroundColor })) });
  await page.keyboard.press('Escape');
  results.push({ phaseDismissed: await page.locator('#ai-phase-prototype').evaluate(el => getComputedStyle(el).visibility === 'hidden') });
  fs.writeFileSync('accessibility-remaining-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
