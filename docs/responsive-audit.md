# Responsive audit and fixes

## Coverage actually performed

- Chrome/Playwright measured all 19 canonical routes at 320, 375, 600, 768, 980, 1000, 1024, 1200, 1440, 1920, and 2560 CSS pixels: 209 route/width combinations, with no document-level horizontal overflow or navigation errors recorded.
- Captured 69 initial full-page screenshots. Reviewed mobile and desktop contact sheets covering all routes, plus individual Home, AI Lab, Writing, workshop, notebook, and final corrected hero screenshots. Some initial screenshots contain lazy-media placeholders, so additional representative screenshots requested eager image loading before capture. Not every generated screenshot was individually inspected at full resolution.
- Exercised all six AI phase focus states at seven widths (320, 375, 768, 1024, 1440, 1920, 2560). After the tooltip correction, all 42 tooltip bounding boxes were within the viewport horizontally and reported visible. Inspected the final 320px active-phase screenshot.
- Selected all six workshops at each of those seven widths: all 42 selected buttons exposed aria-pressed=true. Checked notebook Next controls at the same seven widths and captured notebook states.
- Opened nine image/artwork/resume viewers at 320, 768, and 1440px: 27 states. Focus stayed in each open dialog. An initial desktop resume bound was captured before its opening position settled; a settled recheck placed it from x=640 to x=1440 inside a 1440px viewport.
- Measured all 19 routes in a 740-by-320 landscape viewport and with a 200% CSS zoom simulation at 1280px. No document-level overflow. Programmatically doubled text sizes at 1280px across all routes. Two initial HARTT overflow measurements cleared on rechecks after layout settled. These checks do not establish absence of internal clipping at every enlargement level.
- Checked TrialBridge sticky section jumps at 375, 768, 1000, 1024, and 1440px. Destination headings remained below the header; at widths using a horizontal sticky section bar, they also remained below that bar.
- Checked the 404 page at 320, 1024, and 1920px with no document-level overflow.
- Existing SEO/common-answer regression tests passed 34/34. git diff --check reported no whitespace errors.

## Confirmed issues fixed

1. The Home writing-preview thumbnail retained its HTML height while its width shrank. Its computed 92.5px width and 714px height stretched the adjacent paper card. Explicit automatic height restores the intended square aspect ratio; final dimensions were approximately 92.5 by 92.5px.
2. The mobile AI Lab process reserved 21rem of empty tooltip space even before interaction. The compact resting state now expands that space only while phase details are active.
3. Workshop labels crowded together across six columns at 320px. The selector now uses three columns below 480px, retaining all six choices.
4. The Home Experience category column split labels such as Sustainability on narrow phones. Below 400px, each category sits above its timeline entry.
5. Mobile AI phase tooltips extended outside the visible horizontal scroller. Their maximum width now accounts for page gutters, and phase activation adjusts the scroller to reveal the full tooltip.
6. At wide/ultrawide widths, the AI Lab title and introduction overlapped the note collage and phase markers. The copy and notes now receive separate responsive widths, note text scales with its container, and the copy moves slightly upward above 1600px. Corrected 1920px and 2560px screenshots were inspected.

The changes are confined to existing layout/responsive styles, the Experience media query, and phase-scroller positioning logic. Content, routes, animation timing, and interactions were retained.

## Evidence and limitations

The local evidence directory is `.tmp/responsive-audit/`. `results.json` records the 209 measurements. `phase-final-results.json` records the 42 corrected phase states. `final-rechecks.json` contains workshop, settled-dialog, HARTT enlargement, final-hero, and 404 checks. `sticky-results.json` records the section-jump positions. Earlier review files retain observations from before the final corrections.

Native browser zoom was not performed in this pass. CSS zoom simulation and programmatic text enlargement are explicitly distinct checks. Physical iOS/Android orientation changes, browser toolbars and on-screen keyboards, touch/drag usability, Firefox/Safari rendering, and third-party embedded experiences still require manual verification. Responsive video containers were inspected; playback was not reviewed frame by frame for crop safety. Decorative cover backgrounds intentionally crop as viewport proportions change.
