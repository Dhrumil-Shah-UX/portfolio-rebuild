# Portfolio accessibility audit

Target: WCAG 2.2 AA. This is an engineering audit, not a conformance certification.

## Coverage and results

- Reviewed route rendering, shared navigation, styles, forms, media, motion, image viewers, resume panel, assistant UI, and the page templates for the 19 canonical routes, including three articles. The fallback 404 was also checked.
- Playwright with Chrome and axe-core scanned all 19 canonical routes at 1280, 768, and 320 CSS pixels. All 57 final scans reported zero violations for WCAG A/AA rules through WCAG 2.2. No document-level horizontal overflow was measured in those scans.
- The 404 and opened accessibility-audit image dialog reported zero axe violations. Keyboard checks covered the skip link, routed heading focus, mobile menu, phase tooltips, preview toggles, contact validation, and dialog focus containment and return.
- Six additional open-dialog states were checked: TrialBridge, Soor Malhar, HARTT usability, Mindle, artwork, and resume. All contained keyboard focus and returned it after Escape. Soor's discovered ARIA violation was fixed and its open dialog rescanned with zero violations.
- All 19 routes passed a 200% CSS zoom simulation at a 1280px viewport without document-level horizontal scrolling. This simulation does not replace testing native browser zoom or text-only enlargement.
- WCAG text-spacing overrides were exercised at 320px. The AI Lab preview label initially caused 7px overflow. Reserving horizontal room for that label resolved the isolated recheck to 0px, including a 740-by-320 landscape viewport. Other routes had no document-level overflow in the spacing run. These measurements do not establish that every visual element is free from clipping.
- Reduced-motion checks found visible project videos paused with autoplay disabled. The halo animation was disabled. Normal-motion checks verified that the new animation pause control pauses the halos.
- Existing regression checks: 34/34 SEO and common-answer tests passed. The case-study source check passed. The interaction run recorded no uncaught browser errors.

## Fixes implemented

- Removed card link name overrides that omitted visible card content, allowing native link text to provide the accessible name.
- Made the mobile Menu accessible name match its visible label. Matched workshop names and number formatting to visible labels, including separating text spans with whitespace.
- Matched preview button accessible names to their visible Play preview / Pause preview labels.
- Added a keyboard-operable pause control for the ongoing AI phase halo animation. Existing reduced-motion behavior remains applicable.
- Corrected skip-link behavior so focusing main content does not trigger the route handler. Explicit anchor navigation now moves focus to its destination.
- Made the accessibility comparison table keyboard-focusable with a named region. Added the missing region role to Soor's named image viewer area.
- Added a shared visible focus treatment and targeted wrapping/minimum-width safeguards. Contained decorative Home artwork overflow and reserved room for AI Lab preview labels.
- The contact page and its form were removed on November 27, 2026. Earlier contact-form checks below describe the historical audit.
- Removed an obsolete commented reference to a missing GIF that caused the existing asset regression check to fail.

## Manual verification still required

- NVDA with Chrome/Firefox and VoiceOver with Safari: reading order, heading and landmark navigation, dynamic route announcements, dialogs, image zoom instructions, workshop updates, and form errors.
- Native 200% browser zoom and text-only resizing, particularly fixed-size headings, notebook content, sticky case-study navigation, and dialogs. Inspect for text clipping, obscured focus, and content loss rather than relying only on scroll-width checks.
- Physical iOS and Android devices: touch target usability, portrait/landscape changes, pinch zoom, drag/joystick alternatives, on-screen keyboard interaction, and reduced-motion behavior. Automated target-size checks cannot establish practical touch usability.
- Contrast over photographs, video, gradients, and transient hover/focus states. Axe marked some contrast checks incomplete and cannot assess text embedded in screenshots.
- Review gameplay recordings for meaningful audio, required captions, and equivalent descriptions of meaningful visual information. Axe's video-caption result requires human assessment.
- External embedded games, the third-party particle demo, the linked original reports, and linked documents need their own accessibility reviews. Cross-origin content and document accessibility were not certified by this audit.
- The assistant entry is commented out on the Home page. Its source was reviewed, but a full live assistant conversation and provider failure flow were not exercised.

## Evidence

### Focused follow-up QA

The broad axe audit was not repeated for this follow-up.

Actually performed:

- Chrome/Playwright checks on Home, AI Lab, Writing, About, TrialBridge, and Mindle at 320-by-740 portrait and 740-by-320 landscape viewports: no document-level horizontal overflow. Touch input was emulated, not tested on a physical device.
- Programmatic text-only enlargement doubled computed font sizes on those six pages (for example Home 33.6px to 67.2px, and TrialBridge 64px to 128px). No document-level horizontal overflow at 1280px. This is neither native browser zoom nor proof that every component avoids internal clipping.
- Measured visible button rectangles on those six mobile views: none below 24px in either dimension. Links, pointer-only decorations, spacing exceptions, practical touch usability, and on-screen keyboard behavior still need device/manual checks.
- Inspected rendered Home hero, preview control, and AI Lab focus-state screenshots. Confirmed pale desktop AI Lab navigation text lacked sufficient contrast against the hero background. Corrected normal/hover/focus/active text to the existing dark theme text. Against a sampled header background of RGB(160,152,142), the new dark text has about 5.75:1 contrast. Preview text against its opaque cream control background is about 15.04:1. These sampled ratios do not establish contrast across every image, frame, or viewport.
- Checked the browser accessibility snapshot for a phase button, keyboard activation of phase details, Escape dismissal, and visible focus styling. Inspected the resulting screenshot. This checks browser exposure and interaction, not spoken screen-reader output.
- Checked pause control behavior and reduced-motion halo suppression. Rechecked the three full gameplay videos under reduced motion: paused, autoplay disabled.
- Decoded all three preview assets: no audio streams. Decoded the audio streams of the three full recordings with FFmpeg: each measured -91dB mean and maximum (silence at the analysis floor). No human listening test was performed.
- Visually inspected frames at approximately 15%, 50%, and 85% of each full recording. Added concise descriptions based on those frames and connected them to their videos with aria-describedby. These are summaries, not a verified full sequence of every meaningful visual event. A human should review the complete recordings to judge whether further equivalent descriptions are needed.

Native browser zoom could not be performed. Windows Computer Use stopped because it could not identify the current browser URL reliably enough to enforce its policy. No browser zoom settings were changed through that attempt. NVDA/VoiceOver listening, native text resizing, physical mobile devices, embedded games, linked PDFs, and full media-equivalence review remain outstanding.

Focused evidence: `accessibility-remaining-results.json`, `accessibility-home-visual.png`, `accessibility-preview-visual.png`, and `accessibility-phase-visual.png`. The phase screenshot was captured during the contrast refinement; final computed navigation colors were subsequently verified as RGB(23,34,28) in normal, hover, and focus states.

- `accessibility-results-final.json` contains the 57 route/viewport axe results and incomplete-rule identifiers.
- `accessibility-interactions.json` records interaction, media, zoom simulation, and text-spacing checks. Its AI Lab spacing entry precedes the final label-margin correction described above.
- `accessibility-dialogs.json` records the six additional dialog checks. Its Soor violation precedes the region-role correction and successful recheck described above.
- Audit runners are `scripts/audit-accessibility.cjs` and `scripts/check-accessibility-interactions.cjs`. They use temporary Playwright and axe packages installed under the Windows temporary directory and the portfolio preview server on port 3087.
