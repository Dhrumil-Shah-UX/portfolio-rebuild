# Case study system pilot

TrialBridge is the only study using the opt-in `cs-system` root. Styles live in `css/case-study-system.css` and use existing portfolio tokens. No other study is migrated.

## Reading structure

1. Overview: product visual, context, role, collaborators, evidence counts, personal versus team ownership.
2. Problem: three concise constraints and the research foundation.
3. Decisions: large evidence visual, insight, design response, and optional supporting artifacts.
4. Impact: verified deliverables, testing observations, limitations, and reflection.

## Reusable components

- `cs-chapter`: section spacing and anchor offset.
- `cs-section-heading`: chapter label, headline, and brief framing.
- `cs-figure`: uncropped responsive image, link to complete export, caption.
- `cs-facts`: project metadata in a definition list.
- `cs-decision`: numbered decision with visual evidence and reasoning.
- `cs-reasoning`: paired insight and response, stacked on small screens.
- `cs-detail`: native keyboard-accessible disclosure for optional depth.
- `cs-outcomes`: delivery and review counts with explicit measurement context.
- `cs-evidence-list`: testing observations organized by round.

Navigation uses the existing case-sidebar anchor and active-section behavior. It occupies a sticky left column on desktop and becomes a horizontally scrollable chapter bar on smaller screens. Existing global routing, assistant, and project navigation are preserved.

## Evidence rules

Separate personal responsibilities from shared team decisions. Label prototype screenshots and conceptual features. Delivery and activity counts are not measured impact. Do not imply patient testing, live EHR integration, deployed AI, clinical effectiveness, security implementation, or accessibility conformance without evidence.

The original TrialBridge narrative remains inside the final project archive disclosure. Its anchors use `trial-archive-` to avoid collisions. Existing image files are retained; additional supporting exports and annotations appear beside the related decisions.

Before migrating another case study, review this pilot visually at desktop and mobile widths and review its evidence with the project owner.
