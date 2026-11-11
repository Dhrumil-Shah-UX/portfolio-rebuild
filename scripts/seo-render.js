const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const config = require('../config/seo.json');
const imageVariants = require('../config/image-variants.json');
const responsiveImages = require('../config/image-responsive.json');
const markup = require('../js/content-markup');
const root = path.resolve(__dirname, '..');
const manifest = require('../pages/manifest.json');
const escape = markup.escape;
function readData(file, key) {
  const context = {};
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { timeout: 1000 });
  return context[key];
}
const articles = readData('js/data/articles.js', 'articles');
const notes = readData('js/data/design-notes.js', 'designNotes');
const dimensionCache = new Map();
function getOrigin() {
  const candidate = process.env.SITE_ORIGIN || config.origin;
  const origin = new URL(candidate);
  if (!['https:', 'http:'].includes(origin.protocol) || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) throw new Error('SITE_ORIGIN must be an absolute origin without a path, query, or fragment.');
  return origin.origin;
}
function imageDimensions(src) {
  if (!src?.startsWith('/assets/')) return null;
  if (dimensionCache.has(src)) return dimensionCache.get(src);
  const file = path.resolve(root, '.' + src);
  if (!file.startsWith(path.join(root, 'assets') + path.sep) || !fs.existsSync(file)) return null;
  const buffer = fs.readFileSync(file);
  const remember = dimensions => { dimensionCache.set(src, dimensions); return dimensions; };
  if (buffer.toString('ascii', 1, 4) === 'PNG') return remember([buffer.readUInt32BE(16), buffer.readUInt32BE(20)]);
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    const kind = buffer.toString('ascii', 12, 16);
    if (kind === 'VP8X') return remember([buffer.readUIntLE(24, 3) + 1, buffer.readUIntLE(27, 3) + 1]);
    if (kind === 'VP8 ') return remember([buffer.readUInt16LE(26) & 16383, buffer.readUInt16LE(28) & 16383]);
    if (kind === 'VP8L') return remember([(buffer.readUInt32LE(21) & 16383) + 1, ((buffer.readUInt32LE(21) >>> 14) & 16383) + 1]);
  }
  if (buffer[0] === 255 && buffer[1] === 216) {
    let offset = 2;
    while (offset + 8 < buffer.length && buffer[offset] === 255) {
      const marker = buffer[offset + 1];
      if ([192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207].includes(marker)) return remember([buffer.readUInt16BE(offset + 7), buffer.readUInt16BE(offset + 5)]);
      const size = buffer.readUInt16BE(offset + 2);
      if (size < 2) break;
      offset += 2 + size;
    }
  }
  return null;
}
function pageData() {
  const origin = getOrigin();
  const pages = structuredClone(config.pages);
  for (const article of articles) pages['writing/' + article.slug] = { path: '/writing/' + article.slug, title: article.title + ' | Dhrumil Shah', description: article.summary, image: article.image ? '/' + article.image.replace(/^\//, '') : config.defaultImage, article: true, originalUrl: article.originalUrl };
  for (const [id, page] of Object.entries(pages)) {
    page.image ||= config.defaultImage;
    page.image = imageVariants[page.image] || page.image;
    page.imageAlt = page.article ? page.title.replace(' | Dhrumil Shah', '') : id === 'about' ? 'Dhrumil Shah outdoors by the water' : id === 'home' || id === 'work' || id === 'contact' || id === 'case-showroom' ? '200 Water Street Virtual Showroom on a desktop monitor' : page.title.replace(' | Dhrumil Shah', '') + ' project preview';
    page.imageSize = imageDimensions(page.image);
    const parent = page.article ? 'writing' : id.startsWith('case-') ? ['case-mindle', 'case-perspective', 'case-space-shooter'].includes(id) ? 'ai-lab' : 'work' : null;
    const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' }];
    if (parent) crumbs.push({ '@type': 'ListItem', position: 2, name: parent === 'ai-lab' ? 'AI Lab' : parent === 'writing' ? 'Writing' : 'Work', item: origin + pages[parent].path });
    if (id !== 'home') crumbs.push({ '@type': 'ListItem', position: crumbs.length + 1, name: page.title.split(' | ')[0], item: origin + page.path });
    const webpage = { '@type': id === 'about' ? 'AboutPage' : id === 'contact' ? 'ContactPage' : ['work', 'ai-lab', 'writing'].includes(id) ? 'CollectionPage' : 'WebPage', '@id': origin + page.path + '#webpage', url: origin + page.path, name: page.title, description: page.description, inLanguage: 'en', image: origin + page.image, isPartOf: { '@id': origin + '/#website' }, author: { '@id': origin + '/#person' }, breadcrumb: { '@id': origin + page.path + '#breadcrumb' } };
    if (page.article) webpage.mainEntity = { '@id': origin + page.path + '#article' };
    // No unverified employment, ratings, dates, or product-impact claims.
    page.structuredData = { '@context': 'https://schema.org', '@graph': [
      { '@type': 'Person', '@id': origin + '/#person', name: config.name, jobTitle: config.jobTitle, url: origin + '/about', sameAs: config.sameAs },
      { '@type': 'WebSite', '@id': origin + '/#website', name: config.siteName, url: origin + '/', inLanguage: 'en', publisher: { '@id': origin + '/#person' } },
      webpage,
      { '@type': 'BreadcrumbList', '@id': origin + page.path + '#breadcrumb', itemListElement: crumbs }
    ] };
    if (page.article) page.structuredData['@graph'].push({ '@type': 'Article', '@id': origin + page.path + '#article', headline: page.title.replace(' | Dhrumil Shah', ''), description: page.description, image: origin + page.image, author: { '@id': origin + '/#person' }, mainEntityOfPage: { '@id': webpage['@id'] }, inLanguage: 'en' });
  }
  return { origin, siteName: config.siteName, pages };
}
function routeId(id, data = pageData()) {
  if (id.startsWith('article-')) id = 'writing/' + id.slice(8);
  if (id === 'article') id = 'writing/' + articles[0].slug;
  return Object.hasOwn(data.pages, id) ? id : null;
}
function rewriteHTML(html, { hidden = false, id = '', data = pageData() } = {}) {
  // Resolve assets from nested routes without a <base> that would break fragments.
  html = html.replace(/\b(src|href|poster|action)=(['"])((?:assets|css|js|pages)\/[^'"]*)\2/g, '$1=$2/$3$2');
  html = html.replace(/\b(src|poster)=(['"])(\/assets\/[^'"]+)\2/g, (match, attribute, quote, src) => {
    const optimized = imageVariants[src] || src;
    const responsive = attribute === 'src' && responsiveImages[src];
    if (!responsive) return `${attribute}=${quote}${optimized}${quote}`;
    const variants = [...responsive, { src: optimized, width: imageDimensions(optimized)[0] }];
    const sizes = id === 'work' || id === 'home' ? '(max-width: 700px) 90vw, 45vw' : id === 'about' ? '(max-width: 700px) 90vw, 420px' : '(max-width: 1000px) 92vw, 900px';
    return `src=${quote}${optimized}${quote} srcset="${variants.map(image => image.src + ' ' + image.width + 'w').join(', ')}" sizes="${sizes}"`;
  });
  // IntersectionObserver starts playback in view; avoid parser-triggered downloads
  // for every autoplay video before the app has initialized.
  html = html.replace(/<video\b[^>]*>/g, tag => tag.replace(/\sautoplay\b/g, '').replace(/preload=['"][^'"]*['"]/g, 'preload="none"'));
  html = html.replace(/href=(['"])#([^'"]+)\1/g, (match, quote, hash) => {
    const target = routeId(hash, data);
    if (target) return `href=${quote}${data.pages[target].path}${quote}`;
    if (['about-journey', 'about-sketchbook', 'about-outside'].includes(hash)) return `href=${quote}/about#${hash}${quote}`;
    if (hash === 'about-home') return `href=${quote}/#about-home${quote}`;
    return match;
  });
  let count = 0;
  html = html.replace(/<img\b[^>]*>/g, tag => {
    const source = tag.match(/\bsrc=['"]([^'"]+)['"]/)?.[1];
    if (!source) return tag;
    const dimensions = imageDimensions(source);
    if (dimensions && !/\bwidth=/.test(tag) && !/\bheight=/.test(tag)) tag = tag.replace(/\s*\/?\s*>$/, ` width="${dimensions[0]}" height="${dimensions[1]}">`);
    const firstVisibleImage = !hidden && count++ === 0 && ['work', 'about', 'case-trial', 'case-showroom', 'case-ruhl', 'case-soor', 'case-azhartt', 'case-azhartt-accessibility'].includes(id);
    if (firstVisibleImage) {
      tag = tag.replace(/\sloading=['"][^'"]*['"]/g, '');
      if (!/fetchpriority=/.test(tag)) tag = tag.replace(/>$/, ' fetchpriority="high">');
    } else if (!/loading=/.test(tag)) tag = tag.replace(/>$/, ' loading="lazy">');
    if (!/decoding=/.test(tag)) tag = tag.replace(/>$/, ' decoding="async">');
    if (hidden) tag = tag.replace(/\sfetchpriority=['"][^'"]*['"]/g, '').replace(/loading=['"]eager['"]/g, 'loading="lazy"');
    return tag;
  });
  return html;
}
function renderArticle(article, html) {
  const fill = (attribute, text) => { html = html.replace(new RegExp(`(<[^>]+\\b${attribute}(?:=["'][^"']*["'])?[^>]*>)[\\s\\S]*?(<\\/[^>]+>)`), '$1' + escape(text).replace(/\$/g, '$$$$') + '$2'); };
  fill('data-article-topic', article.topic);
  fill('data-article-title', article.title);
  fill('data-article-summary', article.summary);
  fill('data-article-platform', article.platform);
  html = html.replace('href="#" target="_blank"', `href="${escape(article.originalUrl)}" target="_blank"`);
  html = html.replace('<div class="article-body" data-article-body></div>', `<div class="article-body" data-article-body>${article.content.map(markup.block).join('')}</div>`);
  html = html.replace('<div class="more-writing-list" data-more-writing></div>', `<div class="more-writing-list" data-more-writing>${markup.more(articles, article)}</div>`);
  return html;
}
function renderFragment(id, { hidden = false } = {}) {
  const data = pageData();
  const entry = manifest.pages.find(page => page.id === (id.startsWith('writing/') ? 'article' : id));
  if (!entry) throw new Error('Unknown page: ' + id);
  let html = fs.readFileSync(path.join(root, 'pages', entry.file), 'utf8');
  html = html.replace(/class="page\b([^"]*)"/, (_, classes) => `class="page${classes.replace(/\bis-visible\b/g, '').trimEnd()}${hidden ? '' : ' is-visible'}"`);
  if (id.startsWith('writing/')) html = renderArticle(articles.find(article => 'writing/' + article.slug === id), html);
  if (id === 'writing') {
    html = html.replace('</section>', '<noscript><style>.notebook-wrap{width:100%;height:auto;min-height:0;max-height:none;aspect-ratio:auto}.notebook{display:block;height:auto;aspect-ratio:auto}.notebook .notebook-page{height:auto;min-height:0;overflow:visible}.notebook-controls{display:none}</style></noscript></section>');
    html = html.replace('<div class="article-card-grid" data-article-list></div>', `<div class="article-card-grid" data-article-list>${markup.cards(articles)}</div>`);
    const notePages = notes.map((note, index) => `<article class="notebook-page notebook-page-left" data-note-index="${index}"><div class="notebook-page-content"><h2>${escape(note.title)}</h2><figure class="note-figure"><div class="note-image-shell"><img src="${escape(note.image)}" alt="${escape(note.caption || '')}"></div></figure><p class="note-number">${index + 1}</p></div></article><article class="notebook-page notebook-page-right" data-note-index="${index}"><div class="notebook-page-content">${[['Viewpoint', note.viewpoint], ['Experience', note.experience], ['Possible solution', note.solution]].filter(([, text]) => text).map(([label, text]) => `<section class="note-detail"><h3>${label}</h3><p>${escape(text)}</p></section>`).join('')}</div></article>`).join('');
    html = html.replace('<div class="notebook" data-note-book></div>', `<div class="notebook" data-note-book>${notePages}</div>`);
    html = html.replaceAll('<div class="notebook-page-content">', '<div class="notebook-page-content" tabindex="0" role="group" aria-label="Design note content">');
  }
  return rewriteHTML(html, { hidden, id, data });
}
const safeJSON = value => JSON.stringify(value).replace(/</g, '\\u003c');
function renderPage(id) {
  const data = pageData();
  const page = data.pages[id];
  if (!page) return null;
  let shell = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  shell = rewriteHTML(shell, { id: 'shell', data });
  const meta = `<meta name="description" content="${escape(page.description)}">
    <meta name="author" content="${escape(config.name)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <link rel="canonical" href="${data.origin + page.path}">
    <meta property="og:locale" content="en_US">
    <meta property="og:site_name" content="${escape(data.siteName)}">
    <meta property="og:type" content="${page.article ? 'article' : 'website'}">
    <meta property="og:title" content="${escape(page.title)}">
    <meta property="og:description" content="${escape(page.description)}">
    <meta property="og:url" content="${data.origin + page.path}">
    <meta property="og:image" content="${escape(data.origin + page.image)}">
    <meta property="og:image:alt" content="${escape(page.imageAlt)}">
    ${page.imageSize ? `<meta property="og:image:width" content="${page.imageSize[0]}"><meta property="og:image:height" content="${page.imageSize[1]}">` : ''}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escape(page.title)}">
    <meta name="twitter:description" content="${escape(page.description)}">
    <meta name="twitter:image" content="${escape(data.origin + page.image)}">
    <meta name="twitter:image:alt" content="${escape(page.imageAlt)}">
    <script type="application/ld+json" id="portfolio-structured-data">${safeJSON(page.structuredData)}</script>
    <script type="application/json" id="portfolio-seo-data">${safeJSON(data)}</script>`;
  shell = shell.replace(/<title>.*?<\/title>/, `<title>${escape(page.title)}</title>\n    ${meta}`);
  const activeNav = id.startsWith('writing/') ? 'writing' : ['case-mindle', 'case-perspective', 'case-space-shooter'].includes(id) ? 'ai-lab' : id;
  shell = shell.replace('<body>', `<body data-current-page="${activeNav}">`);
  shell = shell.replace('<main id="main-content" data-page-root tabindex="-1"></main>', `<main id="main-content" data-page-root tabindex="-1">${renderFragment(id)}</main>`);
  return shell;
}
function sitemap() {
  const data = pageData();
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + Object.values(data.pages).map(page => `  <url><loc>${escape(data.origin + page.path)}</loc></url>`).join('\n') + '\n</urlset>\n';
}
function robots() { return `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${getOrigin()}/sitemap.xml\n`; }
function rewriteCSS(css) {
  return css.replace(/url\((['"]?)(\.\.\/assets\/[^)'"\s]+)\1\)/g, (match, quote, src) => imageVariants['/' + src.slice(3)] ? `url("${imageVariants['/' + src.slice(3)]}")` : match);
}
module.exports = { root, articles, manifest, getOrigin, pageData, renderFragment, renderPage, rewriteHTML, rewriteCSS, sitemap, robots, imageDimensions };
