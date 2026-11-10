/* Clean-URL routing and head metadata shared by every statically rendered entry. */
(function () {
  const data = JSON.parse(document.getElementById('portfolio-seo-data').textContent);
  const byPath = new Map(Object.entries(data.pages).map(([id, page]) => [page.path, id]));
  const normalizePath = path => path === '/' ? '/' : path.replace(/\/+$/, '');
  function route(id) {
    if (id.startsWith('article-')) id = 'writing/' + id.slice(8);
    if (id === 'article') return Object.keys(data.pages).find(key => key.startsWith('writing/'));
    return Object.hasOwn(data.pages, id) ? id : null;
  }
  function url(id, anchor = '') {
    if (id === 'home' && anchor === 'about') anchor = 'about-home';
    return (data.pages[route(id)]?.path || '/') + (anchor ? '#' + encodeURIComponent(anchor) : '');
  }
  function readLocation() {
    let hash;
    try { hash = decodeURIComponent(location.hash.slice(1)); } catch { hash = ''; }
    const legacy = route(hash);
    if (legacy) return { id: legacy, anchor: '', legacy: true };
    if (['about-journey', 'about-sketchbook', 'about-outside'].includes(hash)) return { id: 'about', anchor: hash, legacy: true };
    if (hash === 'about-home') return { id: 'home', anchor: 'about', legacy: true };
    return { id: byPath.get(normalizePath(location.pathname)) || 'home', anchor: hash, legacy: false };
  }
  function update(id) {
    const page = data.pages[route(id)];
    if (!page) return;
    document.title = page.title;
    document.querySelector('link[rel="canonical"]').href = data.origin + page.path;
    const values = { description: page.description, 'og:title': page.title, 'og:description': page.description, 'og:url': data.origin + page.path, 'og:image': data.origin + page.image, 'og:image:alt': page.imageAlt, 'og:image:width': page.imageSize?.[0], 'og:image:height': page.imageSize?.[1], 'og:type': page.article ? 'article' : 'website', 'twitter:title': page.title, 'twitter:description': page.description, 'twitter:image': data.origin + page.image, 'twitter:image:alt': page.imageAlt };
    for (const [key, value] of Object.entries(values)) document.querySelector(`meta[${key.startsWith('og:') ? 'property' : 'name'}="${key}"]`)?.setAttribute('content', value);
    document.getElementById('portfolio-structured-data').textContent = JSON.stringify(page.structuredData);
  }
  function normalizeLinks(root = document) {
    root.querySelectorAll('a[data-page]').forEach(link => link.setAttribute('href', url(link.dataset.page, link.dataset.scrollTarget || '')));
  }
  window.PortfolioSEO = { ...data, route, url, readLocation, update, normalizeLinks };
  // Upgrade legacy links from assistant responses without changing their behavior.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = route(link.getAttribute('href').slice(1));
    if (id) link.setAttribute('href', url(id));
  }, true);
})();
