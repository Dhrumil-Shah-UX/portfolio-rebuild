# Virtual Showroom case study evidence

This record supports the scoped migration in `pages/case-showroom.html` and `css/case-showroom.css`. TrialBridge and shared application code were not edited. The page adopts TrialBridge's four chapters, tokens, typography, 180px sidebar, highlighted section labels and 96px combined decision separation on desktop (56px on mobile).

## Sources reviewed

- `200_Water_Virtual_Showroom_Case_Study_Master.docx`, in the user's Project docs folder: full project history, individual responsibilities, RUHL collaboration, AI-assisted iterative Codex implementation, design decisions, launch work and accuracy limits.
- Original showroom repository: `docs/performance-optimization.md`, `docs/city-context-optimization.md`, `docs/accessibility-verification.md`, `docs/final-launch-checklist.md`, `docs/runtime-network-audit-results.md`, `docs/production-deployment.md`, `docs/system-flow-approval.md` and `docs/equipment-image-provenance.md`.
- Integrated RUHL site: `docs/200-water-showroom-integration.md`, `tools/showroom-qa-results.json`, and the active `system-flow.js`, `system-flow-data.js`, `config.js` and `city-assets.js` implementation.
- All existing portfolio showroom screenshots, including the earlier phone and tablet iterations, six phase exports, current desktop overview, recovery view and current mobile view.

## Resolving different project stages

- The master narrative describes a city simplification direction with three shared materials. The later controlled city report and integrated `city-assets.js` document 19 prepared PNG derivatives, canonical texture sharing and reference-counted ownership. The page uses this later evidence: 61 to 28 runtime city texture objects, 842.67 to 58.67 MiB estimated decoded footprint. These are estimates across RGBA8 objects and mip chains, not measured GPU residency, total tab memory or FPS.
- The earlier performance pass recorded 88 geometries, 70 textures and 29 programs across three cycles, with JS heap samples differing by approximately 88 KB. The later controlled city pass recorded 87 geometries, 37 textures and 29 programs. The final local launch audit recorded 91 geometries, 37 textures and 29 programs in its setup. These are different snapshots; the page identifies its displayed stability counts as the controlled post-optimization flow test and does not combine them.
- The 1.5 DPR cap yields 43.75% fewer drawing-buffer pixels on DPR-2 devices by calculation. It is not a measured rendering-speed improvement.
- `system-flow.js` applies presentation order `[1, 2, 5, 0, 3, 4]` to stable engineering indices: Return Air, Energy Recovery, Exhaust, Fresh Outdoor Air, Heat Pump, Supply Air. Raw data-array order is not presentation order.
- The original master describes direct mount/unmount integration. The newer RUHL site uses an independent showroom route, retains the existing entry CTA and isolated reference runtime, and restores scroll and focus on return. The case study uses wording supported by both stages and the integration QA, without claiming an iframe or a current in-page overlay.
- Engineering approval files include historical pending statuses. The later final-launch checklist and integrated `config.js` record owner approval. Equipment images remain labeled generic; no exact installed unit or AI image origin is claimed.
- The pre-launch accessibility/network reports describe a local Cloudflare production build, not a public-edge audit. The existing public project link returned HTTP 200 during this portfolio revision. This does not re-certify all live runtime behavior.

## AI and ownership

The master records iterative implementation with Codex. The page describes that broad assistance and the author's UX direction and evaluation. It does not invent prompt histories, specific generated functions, model creation or equipment-image generation. Existing building/rooftop models are credited to RUHL employees; engineering logic/claims are collaborative RUHL review.

## Preserved assets and behavior

All existing image files remain in place. The original six-step mouse/keyboard demo and its data attributes are retained. Its six visible summaries allow the overall narrative to be read without switching screenshots. Full-resolution image links, the earlier tablet iteration and public experience links remain available. No case-study accordions are used; the product screenshots may depict the actual product's own disclosures.

## Measurement limits

16 zero-violation automated axe scans, three keyboard cycles, tree review and actual 200% zoom are recorded pre-launch QA evidence. They are not formal compliance certification. Real screen-reader speech testing remained recommended. Comprehension and engagement were not measured. Engineering energy/airflow figures shown inside screenshots belong to the retrofit intervention, not interface impact. Airflow animation is explanatory, not CFD.

## Portfolio implementation review — 2026-11-09

Reviewed the complete rendered case study and individual sections on desktop (1440px) and mobile (390px), with an additional tablet render at 820px. Corrected duplicate step summaries, centered phone comparisons, shortened Impact copy, and resolved the header Back control's overlap with the case navigation. Normal viewport captures confirmed readable section headings below the sticky mobile navigation.

Browser checks passed section navigation, mouse and arrow-key demo selection, full-resolution image destinations, missing-image checks and runtime error collection. No horizontal document overflow at 320, 390, 768, 820, 1024 or 1440px; the 320px case navigation also fits without internal horizontal overflow. The public project URL returned HTTP 200. Production build and diff-whitespace checks passed.

The repository-wide case-study TODO check reports existing placeholders in `pages/case-soor.html` and `pages/case-azhartt.html`; neither file was changed. No new formal accessibility certification or user-impact measurement is asserted by this portfolio review.
