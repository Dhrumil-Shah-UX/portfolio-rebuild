# RUHL ai case study evidence

This revision is scoped to the RUHL ai case study, its dedicated stylesheet, assets and source record. Existing TrialBridge and Virtual Showroom changes are preserved.

## Sources reviewed

- Existing `pages/case-ruhl.html`, `data/caseStudies/ruhlai.json` and `js/ruhl-particles.js`, including the recorded owner account from 2026-11-04 and existing prototype/source links.
- Archived Wix `/ruhlai/home?rc=test-site` (Home old) and `/ruhlai` (revised Home): rendered screens, inquiry controls and the embedded particle component. The separate `/blank-2` contact form was inspected but is not used as evidence of the building inquiry.
- Original GitHub Pages particle source: canvas text sampling, Three.js points, pointer attraction, shape mask and confinement, speed and DPR caps, animation loop and the Wix-hosted HTML wrapper.
- Original `Purpose of website.docx`: the lead/inquiry goal, public building-data context and proposed AI-assisted energy-design product direction. It describes an early product vision, not proof of a deployed AI engine.
- Original project handoff/research notes. An experience-letter draft describes broader accessibility and collaboration activities but is not treated as signed verification or a quantified test result.
- Local RUHLai repository README and public API contract, authored commit history and the relevant source/tests. Reviewed owner-attributed changes include `e5d9418` (public building search and preview), `9468add` (homepage deep links), and `1ee31b5` (loading feedback), dated July 2026. These support specific contributions, not ownership of the later entire application.
- The RUHL.org sourcebook was inspected to establish its different scope. Corporate-site, bilingual-route and showroom QA counts are excluded from this case study.

## AI involvement

The owner explicitly clarified on 2026-11-09: “chat gpt to code.” The Overview and workflow state ChatGPT coding assistance and retain the owner's responsibility for UX direction, adaptation and implementation. No exact prompt/output history, rejected AI proposal, generated function or specific coding change is attributed to AI. Product AI aspirations are labeled as the brief's proposed direction, not as verified deployed functionality.

## Visual provenance

All added assets are browser captures of the actual archived Wix prototype, not generated or reconstructed UI:

- `archived-early-landing.png`: focused capture of the old Home hero.
- `archived-revised-landing.png`: focused capture of the revised archived root hero.
- `archived-building-inquiry.png`: complete early form container.
- `archived-address-focus.png`: focused live-render capture of its NYC address and Add row. This smaller image appears in the case study and links to the complete form export.

The comparison demonstrates a visible shift from a particle-led product introduction to address entry. It is not a controlled usability comparison or a precise dated version timeline. Archived promotional copy, background media and partner marks remain part of the unaltered captured interface; no claim of endorsement, asset rights or measured marketing performance is added. Existing portfolio assets remain untouched.

## Technical interpretation

The reviewed Next.js code defines public search/preview responses, numeric building IDs, query/ID validation, explicit errors and origin handling. The contract limits search to at least three characters and up to eight results. Source tests cover representative responses and failures; their existence is not a production acceptance result. The Wix-to-API connection is not established by this code review and is not claimed.

Recorded inquiry fields (property name, address, BIN, BBL, borough, use type, floor area, added-properties area and an other-city address field) are retained from the pre-existing verified design record. The fresh focused capture shows the earlier empty form state. End-to-end submission and property-data accuracy are not verified.

The existing particle loader remains unchanged. It loads the original external demo only after activation, supports stopping it, and removes the iframe when navigating away or hiding the document. Code-level speed/DPR caps are described as workload constraints, not measured performance improvements. No conversion, usability, FPS, energy-savings or business-impact metrics are invented.

## Editorial implementation

Four chapters: Overview, Problem, Decisions, Impact. The page uses the established 180px sidebar, typography, colors and highlighted chapter labels, with 96px combined separation between decisions on desktop and 56px on mobile. Content is adapted to this project's strengths: archived layout evolution, a focused inquiry detail, a source-based building-handoff diagram and a live particle example. No accordions remain.

## Validation

Reviewed the complete rendered case study on desktop (1440px) and mobile (390px), plus an 820px tablet view. Initial review led to a focused form crop, shorter repeated qualifications and clearer Impact framing. Browser checks cover four-section navigation, image destinations, demo start/stop, demo unload on route change, duplicate IDs, missing images and runtime errors. Responsive document and navigation widths are checked at 320, 390, 768, 820, 1024 and 1440px.

These portfolio checks do not certify the archived product's accessibility or production behavior. The archive remains incomplete; the later broader RUHL AI rebuild by another employee is outside this case study's ownership.

Final browser checks passed without missing images, duplicate case-study IDs, failed local requests or page errors. Section navigation and particle start/stop/unload checks passed. Document widths matched all tested viewports, including 320px, and narrow case navigation fit without internal overflow. Production build and diff-whitespace checks passed. Review artifacts were moved out of the repository to temporary storage.
