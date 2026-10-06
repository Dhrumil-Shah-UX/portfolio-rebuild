# Page templates

Each file is one routed view (`data-page-view`). The shell in `index.html` loads these into `<main data-page-root>` via `js/load-pages.js`.

| File | Route hash |
|------|------------|
| `home.html` | `#home` |
| `work.html` | `#work` |
| `about.html` | `#about-page` (full about page; home also has `#about` section) |
| `contact.html` | `#contact` |
| `ai-lab.html` | `#ai-lab` |
| `writing.html` | `#writing` |
| `article.html` | `#article-…` |
| `case-*.html` | `#case-…` |

Edit page markup here—not in `index.html` (shell only).

**Local preview:** run `npm start` (static server). Opening `index.html` directly will not load pages because of browser `fetch` rules.

`manifest.json` defines load order; `home.html` must stay first.
