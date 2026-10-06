# Portfolio rebuild

Static portfolio site (HTML, CSS, vanilla JavaScript). Use a local static server (`npm start`) so page templates can load.

## Project layout

```
index.html              # App shell (header, footer, scripts)
pages/                  # One HTML file per routed view (loaded into index)
  manifest.json         # Page load order
css/
  main.css              # Entry stylesheet (@imports)
  tokens.css            # Design tokens (:root)
  site.css              # Component and page styles
  responsive.css        # Media queries
js/
  config.js             # App constants
  app.js                # Routing, UI behavior, design-notes viewer
  data/
    design-notes.js     # Design Notes content
    articles.js         # Article content
assets/
  brand/                # Logos and favicons
  icons/                # UI icons
  documents/            # Resume and downloads
  images/
    home/               # Hero imagery
    writing/            # Writing page textures
    work/               # Project thumbnails
    about/              # About, team, travel, skills, testimonials
    case-studies/       # Case study screenshots (by project)
  vendor/               # Third-party libraries (PageFlip)
data/
  caseStudies/          # Case study source data (JSON)
scripts/
  check-case-studies.js # CI-style TODO checker for case study content
  organize-project.js   # Asset migration helper (already applied)
  split-css.js          # CSS split helper (already applied)
  extract-js-modules.js # JS data extraction helper (already applied)
```

## Scripts

```bash
npm start                 # Preview at http://localhost:3000
npm run check:case-studies
```

## Conventions

- **Assets:** kebab-case file names, grouped by purpose under `assets/images/`.
- **Case study images:** `assets/images/case-studies/<project>/<descriptive-name>.png`.
- **CSS:** Tokens first, then layout/components, then responsive overrides in `responsive.css`.
- **JavaScript:** Content in `js/data/`, behavior in `js/app.js` (classic scripts, no bundler required).
