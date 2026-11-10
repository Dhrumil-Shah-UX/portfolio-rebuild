const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { brotliCompressSync } = require('node:zlib');
const root = path.resolve(__dirname, '..');
const envFile = path.join(root, '.env.local');
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);
const seo = require('./seo-render');
const publicRoot = process.env.PREVIEW_DIST === '1' ? path.join(root, 'dist') : root;
if (require.main === module && !process.env.GEMINI_API_KEY) console.warn('Assistant setup: add GEMINI_API_KEY to .env.local and restart. .env.example is a template only.');
const routes = {
  '/api/portfolio-chat': require('../api/portfolio-chat'),
  '/api/portfolio-jd-match': require('../api/portfolio-jd-match')
};
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.ico': 'image/x-icon' };
const server = http.createServer(async (req, res) => {
  const sendText = (text, type) => {
    let body = Buffer.from(text);
    const headers = { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff', Vary: 'Accept-Encoding' };
    if (/\bbr\b/.test(req.headers['accept-encoding'] || '') && body.length > 1024) {
      body = brotliCompressSync(body); headers['Content-Encoding'] = 'br';
    }
    headers['Content-Length'] = body.length;
    res.writeHead(200, headers); res.end(req.method === 'HEAD' ? undefined : body);
  };
  const notFound = () => {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
    if (req.method === 'HEAD') res.end(); else fs.createReadStream(path.join(publicRoot, '404.html')).pipe(res);
  };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(data)); };
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('Invalid path'); return; }
  if (routes[pathname]) {
    res.setHeader('X-Robots-Tag', 'noindex');
    try { await routes[pathname](req, res); }
    catch { if (!res.headersSent) res.status(500).json({ error: 'The assistant is temporarily unavailable.' }); }
    return;
  }
  const sendHTML = html => {
    sendText(html, 'text/html; charset=utf-8');
  };
  const pages = seo.pageData().pages;
  const route = Object.entries(pages).find(([, page]) => page.path === pathname.replace(/\/$/, '') || page.path === pathname);
  const normalized = pathname === '/index.html' ? '/' : pathname.endsWith('.html') && !pathname.startsWith('/pages/') && pathname !== '/404.html' ? pathname.slice(0, -5) : pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : null;
  if (normalized && Object.values(pages).some(page => page.path === normalized)) {
    res.writeHead(308, { Location: normalized + new URL(req.url, 'http://localhost').search }); res.end(); return;
  }
  if (route) {
    const file = path.join(publicRoot, route[1].path === '/' ? 'index.html' : route[1].path.slice(1) + '.html');
    sendHTML(publicRoot === root ? seo.renderPage(route[0]) : fs.readFileSync(file, 'utf8'));
    return;
  }
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
    res.writeHead(200, { 'Content-Type': types[path.extname(pathname)] });
    res.end(req.method === 'HEAD' ? '' : pathname === '/robots.txt' ? seo.robots() : seo.sitemap()); return;
  }
  if (pathname.startsWith('/pages/')) {
    res.setHeader('X-Robots-Tag', 'noindex');
    const fragment = seo.manifest.pages.find(page => '/pages/' + page.file === pathname || '/pages/' + page.file.replace(/\.html$/, '') === pathname);
    if (fragment && publicRoot === root) { sendHTML(seo.renderFragment(fragment.id, { hidden: true })); return; }
  }
  const parts = pathname.split('/').filter(Boolean);
  if (parts.some((part) => part.startsWith('.') || part.includes('\\')) || (pathname !== '/' && !['index.html', '404.html', 'css', 'js', 'pages', 'assets'].includes(parts[0]))) { notFound(); return; }
  const file = path.resolve(publicRoot, '.' + pathname + (pathname.startsWith('/pages/') && !path.extname(pathname) ? '.html' : ''));
  if (!file.startsWith(publicRoot + path.sep)) { notFound(); return; }
  if (publicRoot === root && /^\/css\/[\w-]+\.css$/.test(pathname) && fs.existsSync(file)) {
    sendText(seo.rewriteCSS(fs.readFileSync(file, 'utf8')), types['.css']); return;
  }
  try {
    const stat = await fs.promises.stat(file);
    if (!stat.isFile()) throw new Error();
    if (['.html', '.css', '.js', '.json', '.xml', '.txt'].includes(path.extname(file))) {
      sendText(fs.readFileSync(file, 'utf8'), types[path.extname(file)]); return;
    }
    if (path.extname(file) === '.mp4') {
      res.setHeader('Accept-Ranges', 'bytes');
      if (req.headers.range) {
        const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        const start = range?.[1] ? Number(range[1]) : Math.max(0, stat.size - Number(range?.[2]));
        const end = range?.[1] && range[2] ? Math.min(Number(range[2]), stat.size - 1) : stat.size - 1;
        if (!range || !Number.isSafeInteger(start) || start < 0 || start > end || start >= stat.size) {
          res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }); res.end(); return;
        }
        res.writeHead(206, { 'Content-Type': 'video/mp4', 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end - start + 1 });
        if (req.method === 'HEAD') res.end(); else fs.createReadStream(file, { start, end }).pipe(res);
        return;
      }
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
  } catch { notFound(); }
});
const port = Number(process.env.PORT || 3000);
if (require.main === module) server.listen(port, '127.0.0.1', () => console.log(`Portfolio and API: http://localhost:${server.address().port}`));
module.exports = server;
