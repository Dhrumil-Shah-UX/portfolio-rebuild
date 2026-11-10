# AZHARTT Accessibility — evidence and scope

Source: https://dhrumilshahux.framer.website/azhartt-accessibility-project

Reviewed 2026-11-10. Source and Figma file were read only. This is a local portfolio implementation, not a change to HARTT or Framer.

## Evidence inventory

- Three scoped pages: Home, Lost Pet Help, Found Pet / Reuniting Pets & Families.
- Audit approach: WCAG 2.2 Level AA and POUR. No project dates, disability-participant recruitment, named screen reader, browser/AT test matrix, production code remediation or post-fix validation are established.
- Existing project card supplies role: UX Evaluator + Accessibility Reviewer.
- The source chart (audit-overview.png) records 76 passes and 35 failures, divided into 24 critical and 11 moderate. These are recorded audit checks/classifications, not 35 unique WCAG success criteria, resolved defects, a whole-site compliance percentage or measured user impact.
- Repeated patterns: image alternatives/control names, missing visible focus, and color/contrast barriers reported across 3/3 pages. Source summary says heading problems on 2/3, but detailed Found Pet text and Figma annotation also identify heading structure there. No clean numeric heading-count claim is made in the new page. The original inconsistency is preserved here rather than silently resolved.
- Source found-pet popup trap is reported in prose. The Figma board illustrates page-level issues rather than a repaired popup. Caption makes that distinction explicit.
- Figma boards contain audit wireframes and placeholder text, not shipped final screens. The public excerpts are CSS crops of the original board exports; modal links open the entire original exports.
- User confirmed AI was used mostly for analysis and documentation. Source specifically states GPT explained difficult WCAG criteria through practical examples. The Objective → AI contribution → My judgment → Result summary describes only that documented support and the author's audit work; no invented AI prompts, test output or automated compliance certification.
- Existing Work card incorrectly said 30+ issues were resolved. Only this project's card was changed to documented failures and recommendations, given an actual HARTT asset and connected to the new case route.
- Kept separate from the AZHARTT usability study: no five-person/eight-task metrics imported into this audit.

## Figma evidence

File: https://www.figma.com/design/4gARJra4hNm38GLdeg9muL/Shah_Low-Fidelity-Prototypes-and-Annotations

- Home, node 14:541 → home-annotations.png (4000px export of full board).
- Lost Pet, node 14:542 → lost-pet-annotations.png.
- Found Pet, node 14:543 → found-pet-annotations.png.

Exports inspected visually. Home metadata additionally corroborates the H3 HARTT / H1 OUR SERVICES finding and the proposed semantic hierarchy. Figma file was not edited. Short-lived Figma download URLs are not retained in repository files.

## Standards and legal boundaries

Checked primary W3C guidance to avoid repeating overbroad source recommendations:

- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html — target size has spacing provisions and exceptions; not every small target automatically fails.
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — applies to required control/state information and meaningful graphics, not every decorative icon.
- https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html — applies to supported purposes of applicable fields collecting personal information.

The public case study links the standards reference and avoids asserting a legal violation or certifying ADA/WCAG compliance. Original compliance-notes.png is preserved as a historical project artifact, not endorsed as a legal determination. No claim about the organization's funding or legal coverage is added.

## Implementation boundaries

New page, isolated stylesheet/viewer, six local assets, and this evidence record. Minimal manifest and script references make the new page routable. Only the existing accessibility project card is changed on Work. Other cases and unrelated dirty work are preserved. Viewer supports scroll zoom at the pointer, pinch, drag pan, keyboard plus/minus/reset, Escape, focus restoration and top-right Close. Max zoom is 16× for dense boards; no extra zoom buttons.

## Validation

Complete desktop and mobile renders plus tablet/narrow-phone checks at 1440, 768, 390 and 320px. Initial review identified clipping and long headings; corrected and re-reviewed. Static build, unresolved-placeholder check, JS syntax and whitespace checks pass. Functional regression checks cover routing, native right-clickable project card, source links, pinch/keyboard/wheel zoom, close/focus/scroll restoration and other case-study routes.

All 55 existing assistant regression tests passed, together with the accessibility-case browser checks. No horizontal overflow or JavaScript errors were observed at the four reviewed viewport sizes. Full-board viewers and the Work card were inspected visually after the final crop adjustments.

## Original source text

Preserved below to retain individual findings, legal discussion and source caveats beyond the concise public story. Source outcome benefits are not adopted as measured results.

Home

Work

About

Contact

AZHARTT Accessibility
Project
About the site

HARTT (Humane Animal Rescue and Trapping Team) is a volunteer-based Arizona nonprofit dedicated to the safe and humane rescue of lost, abandoned, and injured animals that cannot be captured through ordinary means. The organization specializes in field rescue, using patience, skill, and specialized equipment to bring vulnerable animals to safety when no other options exist. Serving Maricopa County and the Rim Country, HARTT operates entirely through community support and a strong commitment to protecting at-risk animals.

Problem Statement

The AZHARTT website’s accessibility limitations, unclear visual hierarchy, and disorganized content layout contribute to a confusing and inefficient user experience, reducing engagement and user satisfaction.

Approach

This case study applies WCAG 2.2 Level AA criteria and the POUR principles to audit 3 high-traffic website pages, to evaluate accessibility compliance, severity, and patterns of issues.
The approach integrates standards-based testing, legal compliance review, and data analysis to identify accessibility gaps and inform prioritized recommendations.

Challenge 1

Challenge:
WCAG 2.2 definitions were complex and difficult to quickly interpret in real-world design scenarios.

Solution:
I used GPT to translate the guidelines into practical, real-world examples, which helped me better understand how each rule applies to actual user experiences.

Audit Scope

Three high-traffic pages were reviewed:

Home Page - azhartt.org

Lost Pet Help page

Found Pet / Reuniting Pets & Families page

Each page was evaluated across Perceivable, Operable, Understandable, and Robust principles.

Annotated Accessibility Findings
Challenge 2

Challenge:
Accessibility issues are often highly technical, making them hard for clients and designers to understand and act upon.

Solution:
I presented findings using annotated screenshots and plain-language explanations, allowing both designers and developers to clearly see the problems and implement fixes efficiently.

HOME PAGE
Key issues identified:

Missing or non-descriptive alternative text on hero and content images (WCAG 1.1.1 - Critical)
→ Screen reader users cannot understand the purpose or content of images.

Incorrect heading hierarchy and structural markup (1.3.1 - Critical)
→ Disrupts logical navigation for assistive technologies.

Icon-only interactive elements without text or ARIA labels, including “back to top” and menu icons (1.3.3, 4.1.2 - Critical)
→ Users relying on screen readers cannot identify control functions.

Navigation uses color as the only indicator for active states (1.4.1 - Critical)
→ Color-blind and low-vision users cannot perceive state changes.

Low text contrast in footer content and over hero images (1.4.3 - Critical)
→ Makes content unreadable for low-vision users.

Low non-text contrast on footer and decorative icons (1.4.11 - Critical)
→ Interactive elements are visually indistinguishable.

Hover-only dropdown navigation is inaccessible to keyboard users (2.1.1 - Critical)
→ Prevents keyboard-only users from accessing site sections.

Missing visible focus indicators on links and buttons (2.4.7 - Critical)
→ Users cannot determine where keyboard focus is located.

Missing “Skip to main content” link (2.4.1 - Critical)
→ Keyboard users must tab through repetitive navigation on every page.




These issues prevent screen reader users, keyboard-only users, and low-vision users from effectively navigating or understanding the homepage.

LOST OWNED PET PAGE
Key issues identified:

Incorrect and inconsistent heading structure across sections (1.3.1 - Critical)
→ Makes page structure confusing for screen reader users.

Missing meaningful alternative text for informative images (1.1.1 - Critical)
→ Users cannot understand visual information related to pets or services.

Icon-only buttons without programmatic labels (4.1.2 - Critical)
→ Screen readers announce controls as “button” without context.

Form fields lack autocomplete attributes such as email and given-name (1.3.5 - Moderate)
→ Increases effort for users with cognitive and motor impairments.

Focus indicators are not visible on form fields and buttons (2.4.7 - Critical)
→ Keyboard users cannot see which field is active.

Color-only error or active indicators (1.4.1 - Critical)
→ Users who cannot perceive color may miss important state changes.

Small interactive targets on secondary controls (2.5.8 - Moderate)
→ Makes form interaction difficult for users with motor impairments.




These issues affect users’ ability to understand the page structure, complete forms efficiently, and navigate using assistive technologies.

FOUND PET PAGE
Key issues identified:

Keyboard trap within the “Found Pet” popup modal (2.1.2 - Critical)
→ Keyboard users cannot exit the popup once it is opened.

Popup close button is not keyboard focusable or operable (2.1.1 - Critical)
→ Prevents users from completing or abandoning the task.

Missing programmatic labels on icon-only controls inside the popup (4.1.2 - Critical)
→ Screen reader users cannot understand popup controls.

Missing visible focus indicators inside the modal (2.4.7 - Critical)
→ Users cannot track focus while navigating inside the popup.

Hover-only interactions used to reveal controls (2.1.1 - Critical)
→ Inaccessible to keyboard and touch users.

Low contrast on popup text and buttons over background layers (1.4.3 - Critical)
→ Makes reading and interacting difficult for low-vision users.




These issues block task completion for keyboard-only users and significantly impair usability for screen reader and low-vision users.

Patterns & Systemic Issues

Systemic issue pattern

	

Home

	

Lost Pet Help

	

Found Pet

	

Pages Affected




Missing alt text / programmatic labels

	




	




	




	

3/3




Missing visible focus indicators

	
	
	
	

3/3




Color-only meaning / low contrast

	




	




	




	

3/3




Keyboard navigation barriers

	




	




	




	

2/3




Heading hierarchy issues

	




	




	




	

2/3




Understandable content issues

	




	




	




	

0/3

Across all three pages, the audit revealed recurring, systemic accessibility failures:

Repeated absence of alternative text and programmatic labels

Global navigation patterns that are not keyboard accessible

Consistent lack of visible focus indicators

Structural issues in heading hierarchy

Over-reliance on color and low contrast for meaning

Notably, no failures were found under the Understandable principle, indicating that content clarity and language were not primary issues.

Challenge 3

Challenge:
The same accessibility issues appeared repeatedly across multiple pages, indicating deeper system-level problems.

Solution:
I grouped these issues under “Patterns & Systemic Issues” and proposed global design and component-level fixes instead of addressing each page individually.

User Impact

The identified accessibility issues create significant barriers for users with disabilities across multiple interaction types:

Screen reader users cannot understand page structure or visual meaning due to missing alt text, incorrect heading hierarchy, and unlabeled icon controls.

Keyboard-only users face navigation failures, including inaccessible dropdown menus, missing skip links, invisible focus indicators, and keyboard traps within modal dialogs.

Low-vision users struggle to read content because of insufficient text and non-text contrast, especially in footers, hero sections, and popups.

Motor-impaired users experience difficulty interacting with small click/tap targets, increasing the risk of errors and task abandonment.

These barriers prevent users from accessing essential services such as finding lost pets, submitting forms, and navigating support resources, directly undermining the site’s community mission.

Legal & Compliance Risk

AZHARTT is a public-facing nonprofit organization, which places it under the scope of ADA Title III. The audit identified multiple failures of WCAG 2.2 Level AA success criteria, particularly under the Perceivable, Operable, and Robust principles.

These failures indicate a risk of legal non-compliance, exposing the organization to potential complaints, reputational harm, and remediation costs. Addressing critical accessibility barriers is necessary not only to support users with disabilities, but also to reduce legal and regulatory exposure.

Recommendations
Critical Priority (Fix First)

Add meaningful alternative text for all informative images and mark decorative images appropriately.

Correct heading hierarchy to ensure logical structure and screen reader navigation.

Enable full keyboard access for all navigation menus, popups, and interactive elements.

Add visible focus indicators to all focusable elements.

Implement a “Skip to main content” link on every page.

Add ARIA labels and programmatic names to all icon-only and interactive controls.

Remove keyboard traps and ensure modals can be exited using keyboard controls.

Improve text and non-text contrast to meet WCAG minimum ratios.

Moderate Priority (Fix Next)

Increase tap and click target sizes to at least 24×24 pixels.

Improve contrast on decorative and secondary icons.

Add appropriate autocomplete attributes to form fields.

These changes will significantly improve usability, inclusivity, and compliance with accessibility standards.

Outcome

This audit provides AZHARTT with a clear, prioritized roadmap for improving accessibility across its digital services. Implementing the recommended fixes will:

Enable equitable access for users with disabilities

Improve usability for all users, not just those using assistive technologies

Reduce legal and compliance risk under ADA Title III

Increase trust, reach, and engagement with the community

The outcome is a more inclusive, resilient, and user-centered digital experience aligned with the organization’s mission.

© 2026 Dhrumil Shah

I Believe
Good design starts with listening and understanding.
Page Links

Home

Work

About

Contact

Socials

LinkedIn

Behance

Resume

Email

Create a free website with Framer, the website builder loved by startups, designers and agencies.
