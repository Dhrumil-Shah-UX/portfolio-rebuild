(function loadPortfolioPages() {
  const root = document.querySelector("[data-page-root]");
  if (!root) {
    window.portfolioPagesReady = Promise.resolve();
    return;
  }

  window.portfolioPagesReady = fetch("/pages/manifest.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not load pages/manifest.json");
      }
      return response.json();
    })
    .then((manifest) =>
      Promise.all(
        manifest.pages.filter(page => !root.querySelector(`[data-page-view="${page.id}"]`)).map((page) =>
          // Request the real fragment filename so static hosts and older local
          // servers do not need extensionless rewrite support.
          fetch(`/pages/${page.file}`).then((response) => {
            if (!response.ok) {
              throw new Error(`Could not load pages/${page.file}`);
            }
            return response.text();
          })
        )
      )
    )
    .then((sections) => {
      const template = document.createElement('template');
      template.innerHTML = sections.join("");
      // Inactive media must not compete with the statically rendered entry page.
      template.content.querySelectorAll('video source[src]').forEach(source => {
        source.dataset.src = source.getAttribute('src');
        source.removeAttribute('src');
      });
      root.append(template.content);
      window.PortfolioSEO.normalizeLinks();
    });
})();
