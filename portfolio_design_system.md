# Portfolio Design System — Global Standard

Use this file as the single source of truth for visual consistency across the portfolio.

## 1. Design intent

The site should feel:

- editorial
- calm
- thoughtful
- premium
- recruiter-friendly
- easy to scan

Avoid:

- oversized typography
- loud serif headlines
- random font sizes
- inconsistent spacing
- random greens / tans / creams
- heavy shadows
- glassmorphism
- excessive pill UI
- overly rounded cards
- one-off styling per page

The serif should feel like a refined editorial accent, not something that shouts.

---

## 2. Font families

Use only these two font families across the entire site.

### Display / editorial
```css
font-family: Georgia, "Times New Roman", serif;
```

### UI / body
```css
font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
```

Do not introduce additional font families without explicit approval.

---

## 3. Global typography scale

Use these tokens consistently. Do not invent arbitrary heading sizes per page.

| Token | Desktop | Tablet | Mobile | Use |
|---|---:|---:|---:|---|
| `display-xl` | 64px | 56px | 44px | Homepage hero only |
| `display-lg` | 52px | 46px | 38px | Major page hero titles |
| `display-md` | 40px | 36px | 32px | Selected project/workshop/article titles |
| `heading-lg` | 32px | 30px | 28px | Main section headings |
| `heading-md` | 26px | 24px | 22px | Internal headings |
| `heading-sm` | 21px | 20px | 19px | Card titles |
| `body-lg` | 18px | 18px | 17px | Hero intro / lead copy |
| `body-md` | 16px | 16px | 16px | Default body copy |
| `body-sm` | 14px | 14px | 14px | Metadata / supporting copy |
| `label` | 12px | 12px | 11px | Eyebrows / uppercase labels |
| `caption` | 13px | 13px | 12px | Captions / tertiary text |

### Line-height rules

```text
Display: 0.98–1.05
Headings: 1.12–1.20
Body: 1.55–1.70
Labels: 1.30
```

### Weight rules

#### Georgia
- default headings: 400
- occasional stronger emphasis only when necessary
- avoid making every serif heading bold

#### Inter
- body: 400
- secondary emphasis: 500
- UI labels/buttons: 600
- stronger UI emphasis: 650–700 only when needed

---

## 4. Heading hierarchy

Use this hierarchy site-wide.

### Page hero
Use `display-lg`

Examples:
- AI Lab
- Writing
- About
- Case study hero title

### Major section heading
Use `heading-lg`

Examples:
- Workshops
- Projects
- My AI Process
- Selected Work

### Selected item title
Use `display-md`

Examples:
- AI Fundamentals
- Mindle
- Designing Better AI Inputs

### Internal heading
Use `heading-md`

Examples:
- Key takeaways
- What I taught
- Artifacts
- Outcome

### Card title
Use `heading-sm`

Examples:
- Time to Prototype
- Space Shooter
- Short Videos

### Hard size limits

Do not exceed:

```text
64px anywhere
52px for normal page heroes
40px for selected item titles
32px for section headings
26px for internal headings
21px for card headings
```

---

## 5. Color system

Use these exact tokens unless a component requires an accessibility-safe variation.

### Base surfaces

```css
--bg-main: #F3F0E8;
--surface: #F8F5EE;
--surface-muted: #EAE4D9;
--surface-sage: #E3E8E1;
```

### Text

```css
--text-primary: #17221C;
--text-secondary: #5F665F;
--text-muted: #7B817A;
--text-inverse: #F7F4ED;
```

### Brand / accent

```css
--accent-green: #365444;
--accent-green-hover: #2E493B;
--accent-warm: #B89B72;
--accent-warm-soft: #D9C8AC;
```

### Borders

```css
--border-default: #D5D1C8;
--border-subtle: #E3DED4;
```

### Dark sections

```css
--dark-forest: #17221C;
--dark-secondary: #243229;
```

Do not introduce random greens, tans, creams, or grays page-by-page.

---

## 6. Background usage

Limit the site to these section backgrounds:

1. Main ivory — `#F3F0E8`
2. Warm neutral — `#EAE4D9`
3. Soft sage — `#E3E8E1`
4. Dark forest — `#17221C`

Avoid using slightly different one-off creams across cards and sections.

---

## 7. Spacing system

Use an 8px base rhythm.

```text
4px
8px
12px
16px
24px
32px
48px
64px
80px
96px
128px
```

### Section spacing

Desktop:
```text
96–120px vertical padding
```

Tablet:
```text
72–88px vertical padding
```

Mobile:
```text
56–64px vertical padding
```

### Card padding

```text
Large card: 32px
Medium card: 24px
Compact card: 16px
```

### Common vertical relationships

```text
Heading → description: 16–24px
Description → metadata: 24–32px
Section title → section content: 32–48px
```

Do not invent arbitrary spacing values unless layout geometry requires it.

---

## 8. Content widths

### Global page container
```css
max-width: 1280px;
```

### Editorial / content container
```css
max-width: 1100px;
```

### Article body
```css
max-width: 760px;
```

### Large text blocks
```css
max-width: 680px;
```

Body text should never stretch excessively wide.

---

## 9. Cards

Cards should be quiet and editorial.

### Standard card

```css
background: rgba(255,255,255,0.18);
border: 1px solid #D5D1C8;
border-radius: 16px;
```

### Large project/media card

```css
border-radius: 20px;
```

Avoid heavy shadows.

Use stronger shadows only for physical-style hero objects such as:
- notebook
- book
- floating media object
- cinematic hero visual

---

## 10. Radius system

Use only these radii:

```text
8px   — small controls
16px  — standard cards
20px  — large cards / media
999px — pills only
```

Avoid arbitrary radii such as 12px, 18px, 22px, 28px, 32px unless absolutely required.

---

## 11. Eyebrows / labels

Examples:
- WORKSHOP
- AI LAB
- PRODUCT THINKING
- PROJECTS

Use:

```css
font-size: 12px;
font-weight: 600;
letter-spacing: 0.14em;
text-transform: uppercase;
color: var(--accent-green); /* or warm accent where appropriate */
line-height: 1.3;
```

Do not scale labels up with the headline.

---

## 12. Buttons and CTAs

### Primary button

```css
font-size: 15px;
font-weight: 600;
padding: 12px 18px;
border-radius: 999px;
```

### Text CTA

```css
font-size: 15px;
font-weight: 600;
```

Examples:
- View project →
- Watch workshop →
- Read article →
- View workshop →

Do not use oversized CTA text.

---

## 13. Workshop-specific sizing

Use this as the standard for workshop UI.

### Left panel section title
Example: `AI in Design Workshop Series`

```text
32px desktop
30px tablet
28px mobile
line-height: ~1.05–1.10
```

### Selected workshop title
Example: `AI Fundamentals`

```text
40px desktop
36px tablet
32px mobile
```

### Internal heading
Example: `Key takeaways`

```text
26px desktop
24px tablet
22px mobile
```

### Bottom information cards
Examples:
- What I taught
- Artifacts
- Outcome

Title:
```text
20–21px
```

Body:
```text
14–15px
```

### Workshop list cards

Title:
```text
18–20px
```

Supporting copy:
```text
13–14px
```

---

## 14. Article page sizing

### Article title
Use `display-lg` or `display-md` depending on length.

Never exceed 52px.

### Article dek
Use `body-lg`.

### Article body
Use:

```text
18–20px desktop
17–18px mobile
line-height: 1.65–1.75
max-width: 720–760px
```

### Article section headings
Use `heading-md`.

---

## 15. Project / case study sizing

### Case study hero title
Use `display-lg`.

### Project section title
Use `heading-lg`.

### Decision title
Use `heading-md`.

### Supporting copy
Use `body-md`.

### Metadata
Use `body-sm`.

Do not allow decision titles to visually compete with the case study hero.

---

## 16. Navigation

Use the same navigation sizing site-wide.

```text
Desktop nav: 15–16px
Mobile nav: 15px
Weight: 500–600
```

Active state should be subtle:
- underline
- fine rule
- color shift

Avoid pill-style active states unless the component is genuinely a segmented control.

---

## 17. Visual hierarchy rule

Every page should clearly follow:

```text
1. Page title
2. Section title
3. Selected item title
4. Internal heading
5. Card title
6. Body copy
7. Metadata / caption
```

If two adjacent levels feel equally loud, reduce the lower level.

---

## 18. Responsive behavior

Use fluid scaling without dramatic jumps.

Recommended implementation:

```css
font-size: clamp(min, preferred, max);
```

Use the defined token ranges above as the min/max boundaries.

Do not allow desktop typography to simply shrink proportionally on mobile if it harms readability.

---

## 19. Accessibility

Maintain at least:

```text
Normal text: 4.5:1 contrast
Large text: 3:1 contrast
UI/focus indicators: 3:1 contrast
```

Do not rely on color alone for active states.

Maintain visible keyboard focus.

---

## 20. Implementation rule

This design system is authoritative.

When auditing an existing page:

1. Preserve content and functionality.
2. Map existing styles to the nearest approved token.
3. Remove one-off font sizes where possible.
4. Replace one-off colors with system tokens.
5. Normalize spacing to the approved scale.
6. Normalize card radii and borders.
7. Preserve layout intent unless it visibly conflicts with hierarchy.
8. Do not redesign unrelated interaction patterns.
9. Do not invent new content.
10. Do not change copy unless explicitly requested.

If an existing component cannot cleanly fit the system, flag it rather than silently inventing a new token.

---

## 21. Final standard

The site should feel:

**calm, editorial, restrained, consistent, premium, easy to scan**

The site should not feel:

**oversized, shouty, template-like, overdecorated, inconsistent, or visually noisy**
