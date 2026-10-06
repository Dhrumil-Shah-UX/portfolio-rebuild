(function loadPortfolioPages() {
  const root = document.querySelector("[data-page-root]");
  if (!root) {
    window.portfolioPagesReady = Promise.resolve();
    return;
  }

  window.portfolioPagesReady = fetch("pages/manifest.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not load pages/manifest.json");
      }
      return response.json();
    })
    .then((manifest) =>
      Promise.all(
        manifest.pages.map((page) =>
          fetch(`pages/${page.file}`).then((response) => {
            if (!response.ok) {
              throw new Error(`Could not load pages/${page.file}`);
            }
            return response.text();
          })
        )
      )
    )
    .then((sections) => {
      root.innerHTML = sections.join("");
    });
})();
