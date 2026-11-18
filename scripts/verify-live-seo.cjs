const seo = require('./seo-render');
(async () => {
  for (const page of Object.values(seo.pageData().pages)) {
    const response = await fetch('https://dhrumilworks.com' + page.path);
    const html = await response.text();
    console.log(JSON.stringify({ path: page.path, status: response.status, robots: response.headers.get('x-robots-tag'), canonical: html.match(/rel="canonical" href="([^"]+)/)?.[1] }));
  }
  for (const path of ['/robots.txt', '/sitemap.xml']) {
    const response = await fetch('https://dhrumilworks.com' + path);
    console.log(path, response.status, await response.text());
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
