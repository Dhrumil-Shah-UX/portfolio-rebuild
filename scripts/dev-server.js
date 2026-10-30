const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const envFile = path.join(root, '.env.local');
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);
if (require.main === module && !process.env.GEMINI_API_KEY) console.warn('Assistant setup: add GEMINI_API_KEY to .env.local and restart. .env.example is a template only.');
const routes = {
  '/api/portfolio-chat': require('../api/portfolio-chat'),
  '/api/portfolio-jd-match': require('../api/portfolio-jd-match')
};
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.ico': 'image/x-icon' };
const server = http.createServer(async (req, res) => {
  const notFound = () => {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
    if (req.method === 'HEAD') res.end(); else fs.createReadStream(path.join(root, '404.html')).pipe(res);
  };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(data)); };
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('Invalid path'); return; }
  if (routes[pathname]) {
    try { await routes[pathname](req, res); }
    catch { if (!res.headersSent) res.status(500).json({ error: 'The assistant is temporarily unavailable.' }); }
    return;
  }
  const parts = pathname.split('/').filter(Boolean);
  if (parts.some((part) => part.startsWith('.') || part.includes('\\')) || (pathname !== '/' && !['index.html', '404.html', 'css', 'js', 'pages', 'assets'].includes(parts[0]))) { notFound(); return; }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { notFound(); return; }
  try {
    const stat = await fs.promises.stat(file);
    if (!stat.isFile()) throw new Error();
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
  } catch { notFound(); }
});
const port = Number(process.env.PORT || 3000);
if (require.main === module) server.listen(port, '127.0.0.1', () => console.log(`Portfolio and API: http://localhost:${server.address().port}`));
module.exports = server;
