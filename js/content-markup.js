/* Shared article HTML keeps the static build and interactive view identical. */
(function (root, factory) {
  const content = factory();
  if (typeof module === 'object' && module.exports) module.exports = content;
  else root.PortfolioContent = content;
})(typeof window === 'object' ? window : globalThis, function () {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
  const asset = src => src?.startsWith('assets/') ? '/' + src : src;
  function block(block) {
    if (typeof block === 'string') return `<p>${escape(block)}</p>`;
    if (block.type === 'image') return `<figure class="article-figure"><img src="${escape(asset(block.src || ''))}" alt="${escape(block.alt || '')}" loading="lazy" decoding="async" />${block.caption ? `<figcaption>${escape(block.caption)}</figcaption>` : ''}</figure>`;
    if (['h2', 'h3', 'blockquote', 'p'].includes(block.type)) return `<${block.type}>${escape(block.text)}</${block.type}>`;
    if (['ul', 'ol'].includes(block.type)) return `<${block.type}>${(block.items || []).map(item => `<li>${escape(item)}</li>`).join('')}</${block.type}>`;
    if (block.type === 'note') return `<aside class="article-source-note">${escape(block.text)}</aside>`;
    return `<p>${escape(block.text || '')}</p>`;
  }
  function cards(articles) {
    return articles.map((article, index) => `<a class="article-card" data-article-card="${index}" href="/writing/${escape(article.slug)}"><div class="article-card-copy"><h3>${escape(article.title)}</h3><p>${escape(article.summary)}</p><span>${escape(article.platform)} &middot; ${escape(article.topic)}</span></div><div class="article-card-image">${article.image ? `<img src="${escape(asset(article.image))}" alt="" loading="lazy" decoding="async" />` : `<span>${escape(article.platform)}</span>`}</div></a>`).join('');
  }
  function more(articles, current) {
    return articles.filter(item => item.slug !== current.slug).slice(0, 1).map(item => `<a class="more-writing-link" href="/writing/${escape(item.slug)}" data-more-writing-link="${escape(item.slug)}"><span>${escape(item.topic)}</span><strong>${escape(item.title)}</strong><small>${escape(item.summary)}</small><em class="icon-link">Read article <span class="ui-icon ui-icon--arrow-right" aria-hidden="true"></span></em></a>`).join('');
  }
  return { escape, block, cards, more };
});
