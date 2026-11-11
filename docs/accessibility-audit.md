# Portfolio accessibility audit

Reviewed locally on November 10, 2026, against WCAG 2.2 Level AA. This is an audit and remediation record, not a conformance declaration.

## Coverage and method

- All 19 public routes defined by the SEO renderer: six primary pages, ten portfolio case studies/experiments, and three articles.
- Chrome with axe-core 4.10.3: WCAG 2 A/AA, 2.1 A/AA, 2.2 AA, and best-practice rules. Desktop at 1440 CSS pixels and narrow layouts at 320 CSS pixels: 38 scans. Final scans reported zero automated violations. Nine affected routes were checked again after the final notebook/grid fixes, also with zero automated violations.
- All 19 routes were checked at 640 and 320 CSS pixels with line height 1.5, paragraph spacing 2em, letter spacing .12em, and word spacing .16em. These widths model reflow at 200% and 400% zoom on a 1280-pixel window. This is not an assertion that CSS zoom is equivalent to browser zoom. No document-level horizontal overflow remained in the final text-spacing checks. Intentionally visually hidden instructions/headings were excluded from clipping findings; notebook overflow now has a scrollable, focusable content region.
- Browser keyboard interaction checks covered skip navigation, the mobile menu, route changes, seven image-viewer routes, About art, resume, showroom tabs, notebook controls, and the assistant. Screenshots of representative interactive states were visually inspected, including the mobile assistant validation state. This was not a manual inspection of every pixel or every keyboard path on all routes.
- Assistant requests were intercepted with a controlled response fixture for browser interaction testing. Existing server tests cover error, rate-limit, and unavailable-provider branches. No private information was submitted to an AI provider during these browser tests.
- No new project dependencies were added. The audit used an existing Playwright installation and an externally loaded axe script only in the test browser.

## Confirmed issues corrected

| Finding | Correction | Relevant criteria |
| --- | --- | --- |
| Repeated navigation had no bypass control | Added a first-focusable skip link and a stable, focusable main landmark in both source and prerendered HTML | 2.4.1 |
| Mobile navigation did not expose its open state | Added `aria-expanded`, `aria-controls`, a stable navigation ID, and Escape/focus-return behavior | 4.1.2, 2.1.1 |
| Client-side navigation left focus on the old control | Focus moves to the new page heading on in-app navigation; current primary links expose `aria-current` | 2.4.3 |
| Hidden Back to top remained in the Tab order | Removed it from keyboard navigation while hidden | 2.4.3, 4.1.2 |
| Contact fields removed their keyboard outline; the default warm focus ring was low contrast on light surfaces | Restored field focus outlines and used the existing dark green for the shared focus indicator | 2.4.7, 1.4.11 |
| Image-viewer Tab navigation could leave its controls | Added focus cycling for open dialogs; preserved native modal behavior, Escape, and opener restoration | 2.4.3 |
| Looping preview cards had no pause mechanism | Added a keyboard-operable pause/play control per preview group; preserved full-card links | 2.2.2 |
| Reduced-motion preferences did not cover all automatic playback/scrolling | Prevented automatic video/RUHL playback under reduced motion and made scripted section scrolling respect that preference; explicit playback remains available | Motion accommodation; supports 2.2.2 |
| Notebook images were marked decorative after client rendering | Reused the existing note caption or title as alternative text | 1.1.1 |
| Enlarged text spacing clipped notebook explanations | Made notebook content vertically scrollable and keyboard-focusable without removing content | 1.4.12, 2.1.1 |
| Several case-study grids expanded beyond 320 pixels under text-spacing overrides | Changed narrow grid tracks to allow shrinking below their content's intrinsic minimum; retained local navigation scrolling | 1.4.10, 1.4.12 |
| Assistant responses lacked an accessible conversation log | Added a named polite live log while retaining loading/status behavior | 4.1.3 |
| Assistant custom validation could scroll its title/close control offscreen | Added an inline alert associated with the field, `aria-invalid`, and controlled inner scrolling; the title and close button remain visible | 3.3.1, 3.3.2, 2.4.11 |
| Contact form completion feedback was only a temporary button label | Added a status announcement; retained existing form behavior | 4.1.3 |
| Contact inputs lacked autofill purpose metadata | Added standard autocomplete tokens and field names | 1.3.5 |
| Workshop chooser was exposed as a nested complementary landmark | Changed it to a named group appropriate to its content | Landmark best practice |

Previously implemented contrast and mobile notebook fixes were preserved. The loader now waits for SEO initialization before normalizing links; the resume fragment uses its real `.html` filename, preserving behavior on basic local servers.

## Verified results

- Automated checks found no violations in the final route scans. Heading hierarchy, page titles, landmarks, names, roles, contrast, and target-size rules were included where axe can evaluate them.
- Keyboard activation of the skip link focused main content. Menu open/close state, Escape, focus return, and new-page heading focus passed.
- TrialBridge, Soor Malhar, both AZHARTT projects, Mindle, Perspective, and Space Shooter viewers passed Enter-to-open, keyboard zoom/reset, Tab containment, Escape, and opener-focus restoration.
- About art and resume passed keyboard opening/closing and focus return. Showroom tabs passed arrow-key selection/state updates.
- Notebook previous/next worked in the single-page reduced-motion layout. Expanded notebook content remains available through its focusable scroll area.
- The assistant's controlled response, busy state, live-log markup, job-description mode, invalid-whitespace state, visible close control, and Escape behavior passed. An axe scan with the validation dialog open reported zero violations.
- Native contact required/email validation passed. The contact form's existing placeholder completion behavior was retained; this audit did not implement or verify message delivery.
- Build, 24 SEO tests, 55 assistant tests, and the case-study integrity check passed after remediation.

## Remaining review and testing limitations

- **Actual screen-reader testing was not completed.** Windows Narrator is installed, but the Windows automation runtime failed to initialize (`helper_unknown_error: setup refresh had errors`). No spoken announcements or Narrator browse-mode interaction were verified. DOM/axe results are not substitutes for that test. Follow-up should cover Narrator/Chrome or NVDA/Firefox, especially notebook reading order, route-change announcements, live responses, and validation errors.
- axe returned manual-review items for contrast in some rendered contexts, video captions, frame contents, and ARIA applicability. Zero reported violations does not close these manual-review items. Static contrast findings previously confirmed were corrected; complex image backgrounds and every interaction-state color were not exhaustively sampled.
- Silent gameplay recordings and detailed research screenshots require a content-equivalence review against their surrounding text. Alternative-text presence alone does not establish that every important visual detail has a sufficient text equivalent. No transcripts or unverified descriptions were invented.
- External RUHL, showroom/game experiences, Figma prototypes, and destinations reached through external links were not audited end-to-end. Their accessibility cannot be inferred from the portfolio's controls or iframe names.
- Chrome was the tested browser. Safari/VoiceOver, Firefox/NVDA, touch-screen assistive technologies, switch access, forced-colors mode, native mobile virtual keyboards, and physical-device browser zoom remain untested.
- Reflow used CSS viewport equivalents; literal browser-zoom behavior across browser/OS combinations and every reduced-height landscape dialog state still need human review.
- WCAG criteria requiring broader content, sensory, media, or assistive-technology judgment have not been declared passing solely because a scanner reported no violation.

Changes remain local. No deployment, Google submission, or GitHub push was performed as part of this audit.
