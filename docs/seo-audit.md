# Portfolio SEO audit and implementation

Reviewed locally on November 10, 2026. Nothing has been deployed, pushed, published, or submitted to a search engine as part of this work.

## Issues found

- All pages used URL fragments, one document title, and an otherwise empty HTML shell. Case studies and writing required JavaScript and multiple network requests before their content existed in the document.
- There were no page-specific descriptions, canonical tags, social previews, structured data, sitemap, or robots file.
- Article cards were JavaScript-only elements rather than ordinary crawlable links.
- The Work page had two H1 headings and two section labels pointing to missing heading IDs.
- Large display images, early video requests, duplicate CSS imports, parser-blocking scripts, and external font delivery added avoidable loading work.
- The notebook's initial space was smaller than its initialized minimum height, causing layout shift.

## Implemented

- A dependency-free static renderer generates **19 complete HTML documents** from the existing page fragments and writing data. Initial responses contain only the requested page; the current client-side experience progressively enhances them.
- Clean URLs use Vercel's `cleanUrls` configuration. Direct entry and refresh serve the actual generated page; unknown paths return a real 404 rather than the homepage.
- History API navigation preserves Back/Forward, anchors, new-tab behavior, and legacy `#case-*`, `#writing/...`, `#article-*`, and About hash links.
- Initial HTML and interactive navigation provide unique titles, descriptions, canonicals, Open Graph and Twitter metadata, and existing project-specific preview images. No new professional achievements or metrics were added.
- JSON-LD describes the Person, WebSite, WebPage, breadcrumbs, and existing articles. It deliberately omits unverified employment, ratings, dates, and results.
- The build generates `robots.txt` and `sitemap.xml`; internal HTML fragments have `X-Robots-Tag: noindex` response headers. Crawlers retain access to CSS, JavaScript, and images.
- Article cards are native links. Work headings and section associations now have a logical hierarchy, with equivalent CSS preserving their appearance.
- Design notes have a readable scrolling fallback when JavaScript is disabled; the existing page-turn interaction remains the enhanced experience.
- Images receive dimensions, asynchronous decoding, and appropriate loading priority. Seventeen large display images have same-resolution WebP derivatives: **17,977,841 bytes → 4,013,172 bytes** (about 78% smaller for those files). Five additional responsive derivatives serve the Work thumbnail, TrialBridge dashboard, and portrait at suitable widths. Original files and full-resolution case-study links remain available.
- CSS imports are flattened in the static build, the duplicate About import is removed, and scripts retain their execution order with `defer`. The existing Inter typeface is hosted locally with its OFL license.
- Video playback still starts automatically in view. Inactive video sources and parser-triggered autoplay downloads no longer compete with the first page render. RUHL's default demo and image viewers are preserved.
- The local server mirrors clean routes and redirects, supports video byte ranges, and compresses textual responses for representative local testing. Production remains Vercel static hosting plus the existing API functions.

## Routes

| Existing route ID | Public URL |
| --- | --- |
| home | `/` |
| work | `/work` |
| about | `/about` |
| contact | `/contact` |
| ai-lab | `/ai-lab` |
| writing | `/writing` |
| case-trial | `/work/trialbridge` |
| case-showroom | `/work/virtual-showroom` |
| case-ruhl | `/work/ruhl-ai` |
| case-soor | `/work/soor-malhar` |
| case-azhartt | `/work/azhartt-usability` |
| case-azhartt-accessibility | `/work/azhartt-accessibility` |
| case-diaries | `/work/ux-diaries` |
| case-mindle | `/ai-lab/mindle` |
| case-perspective | `/ai-lab/perspective` |
| case-space-shooter | `/ai-lab/space-shooter` |
| writing/the-art-of-task-framing | `/writing/the-art-of-task-framing` |
| writing/sometimes-the-best-ai-prompt-is-a | `/writing/sometimes-the-best-ai-prompt-is-a` |
| writing/accessibility-isnt-a-checklist | `/writing/accessibility-isnt-a-checklist` |

## Verification

- `npm run build`: successful static output.
- `npm run test:seo`: 24 checks passed, covering all routes, unique metadata, rendered HTML, local assets, structured-data identities, sitemap/robots, redirects, 404/private-file handling, origin configuration, primary-image loading, and video range responses.
- `npm run test:assistant`: all 55 existing checks passed, including API, retrieval, evidence routes, and server behavior.
- `npm run check:case-studies` and JavaScript syntax checks passed.
- Chrome checks passed on all 19 routes at desktop and mobile widths and with JavaScript disabled. Refresh, browser history, new-tab opening, six representative legacy links, article navigation, modal zoom/close, videos, the RUHL demo, and the resume viewer were exercised. No local missing assets or browser exceptions were observed in that run.
- Desktop and mobile screenshots were inspected against the existing presentation. Layout, typography, case-study content, and animations were retained.
- JSON-LD parses locally and its graph references resolve. No external structured-data validator or Google submission was used.

### Local mobile lab measurements

Chrome, 390 × 844 viewport, 4× CPU slowdown, 1.6 Mbps download, 150 ms latency, disabled browser cache, compressed local static responses. Single-run observations; they are **not production field Core Web Vitals or a guarantee of search ranking**.

| Page | LCP | CLS |
| --- | ---: | ---: |
| Home | 2.28 s | 0.0028 |
| Work | 1.84 s | 0.0043 |
| TrialBridge | 2.00 s | 0.00004 |
| About | 2.14 s | 0 |
| Writing | 2.12 s | 0.0007 |
| AI Lab | 1.99 s | 0 |

INP and real-user performance require representative production traffic. These local checks do not establish a passing field assessment. The external RUHL iframe retains its own loading cost.

### Accessibility and external-link findings requiring review

An axe-core 4.10.3 scan checked WCAG 2 A/AA and 2.1 A/AA rules on all 19 routes. Thirteen routes had no automated violations in this scan. Existing contrast failures remain on six routes: Home testimonial credits, Contact form labels, two AI Lab labels, and figure captions in the three articles. Correcting these requires a small color adjustment; the palette was preserved under the explicit design constraint. An automated scan is not a full accessibility conformance assessment.

Read-only HEAD checks covered 19 unique existing external destinations: 13 returned success; LinkedIn returned 999 and Medium returned 403, preventing verification. Four Figma URLs returned 404: the TrialBridge `mYwrcT8iuqvuLjgbmrUvLn` file and three links to accessibility annotation nodes `14-543`, `14-541`, and `14-542` in file `4gARJra4hNm38GLdeg9muL`. Review their public sharing settings and destinations manually; automated 404s can reflect access restrictions. Existing links were preserved.

## Domain and approval steps

1. The temporary origin is `https://portfolio-ofaeiyvd7-dashah99-4683s-projects.vercel.app`, supplied by the owner. Change `origin` in `config/seo.json`, or set build-time `SITE_ORIGIN=https://your-domain.example`. Use an origin only, without a path or fragment, then rebuild. This updates every canonical, social URL, structured-data identity, sitemap entry, and robots sitemap reference together.
2. After choosing a permanent domain, configure it in Vercel and use one primary host. A stable production alias is preferable to a deployment-specific temporary URL. Redirect alternate domains to the chosen primary domain.
3. Deployment/push remains pending approval. After approval, verify Vercel's live clean routes, redirects, noindex headers on `/pages/*`, cache/compression behavior, and social previews. Local tests cannot establish the final hosted response behavior.
4. After the approved deployment, optionally verify Search Console ownership, submit `/sitemap.xml`, and inspect important URLs. No Google verification or submission has been performed.
5. Decide whether to approve minimal contrast fixes and confirm public access to the four Figma links.

## Maintenance

- Edit page metadata and route paths in `config/seo.json`; keep case-study content in its existing source files.
- Article routes and metadata derive from `js/data/articles.js`. Shared article markup lives in `js/content-markup.js` so build output and client rendering agree.
- `config/image-variants.json` and `config/image-responsive.json` map display derivatives to their originals. Recreate derivatives if the corresponding original changes. The generated WebP files are committed assets; the build needs no image-processing dependency.
- The local Inter files were retrieved from the Google Fonts Inter v20 stylesheet. `assets/fonts/inter/OFL.txt` contains the upstream license.
- Run `npm run build` for the Vercel output in `dist/`; run `npm start` for a development preview. Restart an already-running old dev server after this server/routing change.

The routing approach follows [Google's JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) and [Vercel's clean URL configuration](https://vercel.com/docs/project-configuration/vercel-json).
