# AZHARTT case-study evidence

Source: https://dhrumilshahux.framer.website/azhartt-usability-project

Reviewed 2026-11-10. The external source was read only and left unchanged. This is a local portfolio update, not a deployment to Framer or a modification of HARTT's website.

## Claim mapping and limits

- Completed-study summary: 5 participants, 8 tasks, 27 usability issues, 7 areas, and reported 100% task completion. The test-plan dashboard (source-24.png) instead proposed 8–9 participants with scheduling TBD. The plan is preserved but not misrepresented as the completed study.
- That dashboard names Dhrumil as facilitator, calls for think-aloud observation and consent, and says form tasks stop before submission. It mixes remote plans with face-to-face equipment. The completed project record describes in-person moderated sessions. No invented recruitment method, participant demographics, consent outcome, or session duration is claimed.
- Source records blockers alongside 100% completion. No claim of unassisted completion is made. References to abandonment in proposal justifications are not treated as measured dropout or conversion rates.
- Existing pages/case-azhartt.html supplies March 10–20, 2025 and means of 11.8 seconds to locate the adoption form, 19.4 minutes to complete it, and 33.2 seconds to locate volunteer information. These are retained as original-study means, not redesign improvements.
- pages/resume-panel.html corroborates 19 recommendations and a review against WCAG 2.2. The external source contains 8 Adoption Page changes and 11 Adoption Application Form changes (19 directions). No WCAG certification, contrast measurement, accessibility compliance score or post-redesign test result is claimed.
- User clarified: “A little Chatgpt to analyse and test the site.” Overview names limited ChatGPT support for site analysis/testing, separate from the moderated participant research. No screen-specific AI output, automated test coverage, prompt, generated finding or AI-caused result is invented.
- Research pivot from weak survey responses to interviews, heuristic review, expert review and in-person testing is documented in the source. Survey personas are preserved as assets, not presented as validated participant profiles or a count of participants.
- Decisions are recommendations and annotated mockups. No deployed save/autosave, date picker, signature implementation, lost-pet redesign screen or performance outcome is established.
- Source uses several severity vocabularies: heuristic 0–4; study Suggestion / Strong Suggestion / Minor / Major / Blocker; design-change Low / Medium / High. Public narrative uses the study classifications for the cited progress-loss and signature issues; it does not invent a normalized quantitative ranking.
- The issue distribution chart source-26.png has percentages inconsistent with a denominator of 27 unique issues. It is preserved but not redrawn as a verified issue-count breakdown.

## Visual mapping

- Hero: source-00.png, original website mockup.
- Decision 1: source-67.png and source-68.png, original Submit and proposed Save & Continue Later.
- Decision 2: source-69.png and source-70.png, free-text state field and proposed selector.
- Decision 3: source-51.png and source-52.png, navigation without indicators and annotated dropdown/teal proposal.
- Decision 4: source-40.png and source-41.png, two observed parts of the original lost-pet page. They are deliberately not labeled before/after. The information-order diagram is an editorial summary of the existing recommendation, labeled not shipped.
- All 85 unique project images from the supplied source are preserved. source-manifest.json maps local filenames to original image URLs. Duplicate source-image instances were deduplicated; footer/logo assets were excluded.

## Scope and validation

Only AZHARTT's case markup, isolated CSS/JS, assets and evidence documentation are new or changed. index.html adds one guarded AZHARTT viewer script. Other case studies and unrelated prior dirty changes are preserved.

Desktop 1440px, tablet 768px, mobile 390px and narrow mobile 320px were rendered; the complete desktop/mobile page and all four decisions were inspected. All displayed assets loaded, navigation selected the correct chapter, wheel zoom worked, close restored focus, and no browser JavaScript errors or horizontal overflow were observed. Final checks also cover touch pinch, Escape, navigation cleanup and static build.

Static build, repository-wide case-study placeholder check, JavaScript syntax, whitespace validation, all 55 existing assistant regression tests, and the AZHARTT-specific browser interaction checks passed. Touch-pinch, keyboard zoom/reset, native Escape close-event timing, focus restoration, body-scroll restoration, and cross-project route cleanup were verified.

## Preserved source text

The following transcript retains detailed heuristics, findings, persona headings, individual redesign rationales and source caveats beyond the concise public narrative. The externally authored qualitative benefits are source statements, not independently verified outcomes.

Home

Work

About

Contact

AZHARTT Usability
Project
About the site

HARTT (Humane Animal Rescue and Trapping Team) is a volunteer-based Arizona nonprofit dedicated to the safe and humane rescue of lost, abandoned, and injured animals that cannot be captured through ordinary means. The organization specializes in field rescue, using patience, skill, and specialized equipment to bring vulnerable animals to safety when no other options exist. Serving Maricopa County and the Rim Country, HARTT operates entirely through community support and a strong commitment to protecting at-risk animals.

Problem Statement

The AZHARTT website’s accessibility limitations, unclear visual hierarchy, and disorganized content layout contribute to a confusing and inefficient user experience, reducing engagement and user satisfaction.

Research
HEURISTIC EVALUATIONS
1. Visibility of System Status

Issue: Form buttons do not indicate which ones open in a new tab. (This one in the image opens as an overlay)

Rating: 2 - Minor Usability Problem

Why this Rating: This can be a minor issue since it only slightly affects the user's experience. Users are uncertain about the outcome of their interaction with the buttons, which causes hesitation.

Why this Heuristic: This issue relates to Visibility of System Status because users do not know what will happen when they click the buttons. They need feedback or indication (such as icons or text labels) to inform them of the system’s state (here, that the link will open in a new tab). This would provide clarity and reduce hesitation.

Suggestion: Add small icons or text labels like “Opens in new tab” next to relevant buttons.

2. Match Between System and the Real World

Issue: The adoption application form uses jargon like “acclimating”, which may confuse users.

Rating: 2 - Minor Usability Problem

Why this Rating: While not a critical problem, simplifying the language ensures that the system speaks in a way that matches user expectations.

Why this Heuristic: This issue falls under Match Between System and the Real World because these terms are not commonly used and may confuse users. Simple and real-world language would better match user expectations and improve comprehension.

Suggestion: Replace with simpler terms, such as "adjusting" or "coming soon."

Issue: For unavailable videos, users see the message ‘w3.cdn.anvato.net’s server IP address could not be found.’

Rating: 3 - Major Usability Problem

Why this Rating: This error message is too technical for general users, leaving them confused about what went wrong.

Why this Heuristic: Users expect clear, simple error messages, and replacing technical jargon with more user-friendly language ensures that the system matches the real-world expectations of how errors are communicated.

Suggestion: Replace the error with clear language, such as "This video is currently unavailable. Please try again later."

Issue: On the "Meet Our Team" page, "Coming Soon" images may mislead users into expecting animal pictures instead of team members.

Rating: 2 - Minor Usability Problem

Why this Rating: While misleading, this issue doesn't drastically affect functionality. 

Why this Heuristic: This issue is categorized here because the “Coming Soon” images can mislead users. They may interpret the placeholder images as something related to the animals, which is inconsistent with the page's purpose (to introduce team members).

Suggestion: Use a generic vector illustration of a person instead of an animal paw.

3. User Control and Freedom

Issue: Users cannot exit the adoption application modal by clicking outside the box or even on the close button.

Rating: 3 - Major Usability Problem

Why this Rating: The inability to exit the modal creates frustration and forces users into undesirable actions.

Why this Heuristic: This is categorized under User Control and Freedom because users expect to be able to freely close or exit modals without frustration. 

Suggestion: Enable clicking outside the modal or ensure the close button works correctly.

4. Consistency and Standards

Issue: Navigation menu names change as compared to Top Nav Bar names, across different pages. (Name of this page on Top Nav bar is ‘How we Trap’)

Rating: 3 - Major Usability Problem

Why this Rating: Inconsistent navigation creates confusion.

Why this Heuristic: This issue is categorized under Consistency and Standards because users expect consistency in navigation. When menu names change on the page header (like ‘How we Trap’), it disrupts the user experience. Consistent navigation naming helps users develop a mental model of how to interact with the website.

Suggestion: Ensure consistent menu labeling across all pages.

Issue: Video container sizes and fonts are inconsistent on the "Media" page.

Rating: 2 - Minor Usability Problem

Why this Rating:  It may not disrupt functionality but can create a disjointed experience, which detracts from the website's visual coherence.

Why this Heuristic: This is categorized under Consistency and Standards because the inconsistency in video container sizes and fonts negatively impacts the site's visual cohesion and professionalism.

Suggestion: Standardize container sizes, font sizes, and spacing across all videos.

Issue: Buttons appear different across the website.

Rating: 3 - Major Usability Problem

Why this Rating: Inconsistent buttons can confuse users and undermine trust in the website.

Why this Heuristic: This is another issue under Consistency and Standards. Users rely on consistent button styles (color, shape, size) to navigate and interact with a website. Inconsistent buttons can lead to confusion and frustration.

Suggestion: Create uniform button styles (same shape, color, hover effect) across all pages.

5. Error Prevention

Issue: On the Success Stories page, clickable images appear to enlarge but actually open a Facebook link.

Rating: 3 - Major Usability Problem

Why this Rating: Users face an unexpected page redirection which can cause frustration.

Why this Heuristic: This issue falls under Error Prevention because users are expecting one action (to enlarge the image), but they are redirected to an unexpected location (Facebook).

Suggestion: Change the hover effect to indicate a Facebook link (e.g., "View on Facebook") or use an icon.

Issue: Small clickable area for the signature field in the adoption form.

Rating: 3 - Major Usability Problem

Why this Rating: Tiny interactive elements can be hard to find, frustrating users. 

Why this Heuristic: This is categorized under Error Prevention because the small clickable area creates a barrier for users to complete an action easily. A larger clickable area reduces the chances of users missing or struggling with small interactive elements, making it easier and less error-prone to interact with the form.

Suggestion: Increase clickable area and use a visible outline.

Issue: Numeral date entry increases cognitive load – needs a calendar selection.

Rating: 3 - Major Usability Problem

Why this Rating: Manually entering dates can lead to formatting errors and interchange of day and month can cause severe errors.

Why this Heuristic: This issue falls under Error Prevention because manual date entry can lead to mistakes. 

Suggestion: Provide a calendar picker for date selection.

6. Recognition rather than Recall

Issue: Dropdown menus in navigation lack indicators (no arrow to show they expand).

Rating: 3 - Major Usability Problem

Why this Rating: Lack of visual cues lead to missed opportunities for navigation.

Why this Heuristic: This issue falls under Recognition Rather Than Recall because users are expected to remember that the menus can be on Top Nav Bar and can be expanded. 

Suggestion: Add a dropdown arrow to indicate expandable menus.

Issue: No hierarchy on the "Media" page – headings look like normal text.

Rating: 2 - Minor Usability Problem

Why this Rating: Poor visual hierarchy makes content hard to scan.

Why this Heuristic: This issue also relates to Recognition Rather Than Recall because users have to recall or guess which parts of the page are most important. A clear visual hierarchy helps users quickly recognize sections of interest without needing to recall the structure of the page.

Suggestion: Use larger font sizes, bold text, or color differentiation for headings.

Issue: Images in ‘Media > Print and Online Media’ don’t look clickable.

Rating: 3 - Major Usability Problem

Why this Rating: Users might miss important content.

Why this Heuristic: This issue is categorized under Recognition Rather Than Recall because users won't easily recognize that the images are interactive without visual cues.

Suggestion: Add shadow effects or borders to indicate interactivity.

7. Flexibility and Efficiency of Use

Issue: No dropdowns or radio buttons in adoption form acknowledgments.

Rating: 3 - Major Usability Problem

Why this Rating: Users must type unnecessary text instead of making a quick selection.

Why this Heuristic: This issue is categorized under Flexibility and Efficiency of Use because offering dropdowns or radio buttons would streamline the form-filling process. It would allow users to quickly select options, improving the efficiency of form submission.

Suggestion: Add dropdowns or radio buttons with text like - “I agree” or “I acknowledge” for faster input.

8. Aesthetic and Minimalist Design

Issue: Overwhelming content makes scanning difficult.

Rating: 3 - Major Usability Problem

Why this Rating: Large text blocks reduce readability and user may miss important content.

Why this Heuristic: This issue falls under Aesthetic and Minimalist Design because large blocks of text make the page harder to read and scan.

Suggestion: Break up content with bullet points and headings.

Issue: Small text across all pages.

Rating: 2 - Minor Usability Problem

Why this Rating: Impacts readability but doesn’t prevent functionality.

Why this Heuristic: This issue is categorized under Aesthetic and Minimalist Design because small text reduces readability, especially on mobile devices or for users with visual impairments.

Suggestion: Increase font size for better legibility.

Issue: Poor color contrast between text and background.

Rating: 4 - Usability Catastrophe

Why this Rating: Low contrast reduces readability significantly, especially for visually impaired users.

Why this Heuristic: This falls under Aesthetic and Minimalist Design because low contrast makes text hard to read and harms accessibility.

Suggestion: Improve contrast ratio and use darker text where needed.

9. Help Users Recognize, Diagnose and Recover from Errors

Issue: Technical error message on video playback.

Rating: 3 - Major Usability Problem

Why this Rating: Unclear messages confuse users.

Why this Heuristic: This issue is categorized under Help Users Recognize, Diagnose, and Recover from Errors because users are presented with a technical error message that doesn’t help them understand what went wrong or how to resolve it. 

Suggestion: Replace with simple error text (e.g., "This video is unavailable. Try again later.").

Issue: Some form fields lack instructions, making it unclear what to enter (e.g., "Breed/Description" and "Acknowledgements" fields).

Rating: 3 - Major Usability Problem

Why this Rating: Users may struggle to complete the form accurately, increasing cognitive load.

Why this Heuristic: This issue fits here as the lack of instructions increases the chances of users making mistakes.

Suggestion: Add hints or placeholder text for guidance (e.g., “Enter your pet’s breed or describe its appearance”).

10. Help and Documentation

Issue: No contact form available, but alternative contact details (email, phone, address and FAQs) are present.

Rating: 2 - Minor Usability Problem

Why this Rating: Without it, users have to manually copy email addresses, which adds extra effort and may discourage engagement.

Why this Heuristic: This issue is categorized under Help and Documentation because while there are alternatives (email, phone), a contact form would be a readily available help.

Suggestion: Add a simple contact form with fields for name, email and message. 

PERSONAS

(Based on Survey)

USABILITY TEST PLAN
Tasks to test
Areas / Scopes to test

Find Adoption form

Fill adoption form

Find Volunteer information

Fill Volunteer form

Find donation information

Fill donation information

Steps for lost pet

Fill assisstance form

Structure & Navigation

Forms & User input

Visual Design & Content

Functionality & interactions

Error & feedback

Information retrieval & efforts

Help & documentation

INSIGHTS

5

PARTICIPANTS

8

TASKS TESTED

27

USABILITY ISSUES

7

AREAS / SCOPES TESTED

100 %

SUCCESS RATE OF TASKS

Issues By Type

Suggestion: A suggestion that describes a possible enhancement of fix in the system,but with low importance to the participant.

Strong Suggestion: A suggestion to fix something that is clearly annoying the participant.

Minor Issue: Participant stops to think, but proceeds

Major Issue: Participant faces a significant delay or starts doing try-and-error.

Blocker Issue: Participant gets stuck or gives up, only proceeds with help.

Issues Found
BLOCKER ISSUES

Task:

Fill adoption form

Scope:

Error & feedback

Issue:

Clicking back on navigation to go out of form led to home page and filled contents were lost.

Task:

Tasks in total

Scope:

Error & feedback

Issue:

Had to fill forms repeatedly as user had to go out to seek different information.

Task:

Tasks in total

Scope:

Error & feedback

Issue:

No radio buttons for acknowledgements in several pages.

MAJOR ISSUE

Task:

Fill adoption form

Scope:

Error & feedback

Issue:

A dot in sign area, nothing happens when user clicks it.

MINOR ISSUES

Task:

Tasks in total

Scope:

Visual Design & Content

Issue:

Text was hard to read.

Task:

Fill adoption form

Scope:

Error & feedback

Issue:

Forgot about date format. (month / or - between numbers ?)

Task:

Fill adoption form

Scope:

Forms & User input

Issue:

No dropdown for state selection in address.

Task:

Fill adoption form

Scope:

Forms & User input

Issue:

Do you own or rent what?

Task:

Fill adoption form

Scope:

Help & documentation

Issue:

please initial after each item - meaning?

Task:

Tasks in total

Scope:

Functionality & interactions

Issue:

Didn't know about dropdowns in tabs on main page.

Task:

Fill Volunteer form

Scope:

Forms & User input

Issue:

How many miles from home can the user travel for volunteer - cognition load.

Task:

Steps for lost pet

Scope:

Structure & Navigation

Issue:

Navigation hierarchy - what is Programs & Services? User never clicked there.

Task:

Steps for lost pet

Scope:

Visual Design & Content

Issue:

Navigation hierarchy items weren’t recognized as links.

Task:

Steps for lost pet

Scope:

Error & feedback

Issue:

No visual hierarchy for information - isn't scannable.

Task:

Steps for lost pet

Scope:

Forms & User input

Issue:

Main steps to find lost pet given in the end and that too for only cats and dogs.

Task:

Fill assisstance form

Scope:

Functionality & interactions

Issue:

Repitition for spayed and neutered.

STRONG SUGGESTION TYPE ISSUES

Task:

Tasks in total

Scope:

Visual Design & Content

Issue:

Participants found some pages too text-heavy, making key content hard to scan or prioritize.

Task:

Tasks in total

Scope:

Forms & User input

Issue:

Date picker, time and weight. (proper pickers aren't given in most areas)

Task:

Tasks in total

Scope:

Help & documentation

Issue:

No hints given in some areas like, Nearest major cross street, which pet are you interested in (name)? , acknowledgement statements, miscellaneous fee in donation form, etc.

Task:

Fill adoption form

Scope:

Forms & User input

Issue:

Need to go out to check names in petfinder but clicking outside of form doesn't help and Clicking on cross doesn't work to go out of the form.

Task:

Fill adoption form

Scope:

Forms & User input

Issue:

Have you owned and kept pets in your household in the last 5 years - Want to say no but field not given to do so and the question is compulsory.

Task:

Steps for lost pet

Scope:

Help & documentation

Issue:

Help, isn't visible quickly on main page for emergency.

Task:

Steps for lost pet

Scope:

Visual Design & Content

Issue:

Bold text was clickable in information.

SUGGESTION TYPE ISSUES

Task:

Tasks in total

Scope:

Visual Design & Content

Issue:

Participants found some pages too text-heavy, making key content hard to scan or prioritize.

Task:

Fill Volunteer form

Scope:

Help & documentation

Issue:

What is social media metrics?

Task:

Find donation information

Scope:

Functionality & interactions

Issue:

Didn't know amazon wishlist was clickable.

Task:

Steps for lost pet

Scope:

Forms & User input

Issue:

Can't go out from pdf for 'Lost pet instructions' to website page.

Challenge

Challenge: 

Initial responses from the user survey were inconsistent and lacked actionable insights, as several participants submitted random or superficial feedback without fully engaging with the questions. 

Solution: 

To overcome this, I pivoted to more effective user research methods. Conducted in-person interviews that provided deeper, more contextual feedback. Supplemented survey data with expert reviews, heuristic evaluations, and in-person usability testing. 

This multi-method approach enriched the quality of insights and ensured design decisions were grounded in user behavior, not assumptions.

Important Design Changes
ADOPTION PAGE
No Dropdown Arrows in Page Navigation Bar

Before

After

Why this issue:

The absence of dropdown arrows confused users, who didn’t realize additional menu options were hidden under labels.

Where Identified:

Heuristic Evaluation (Recognition Rather Than Recall)

Usability Testing

Severity level:

Medium

Justification:

During usability testing, users missed hidden menu options because there was no visual indicator (arrow) suggesting a dropdown. Adding arrows on hover significantly improves discoverability and reduces navigation errors.

Low Visual Distinction Between Page and Primary Navigation Bars

Before

After

Why this issue:

Participants struggled to distinguish between the Page Navigation and Primary Navigation due to similar styling.

Where Identified:

User Research

Heuristic Evaluation (Consistency and Standards)

Severity level:

Medium

Justification:

Feedback from user surveys noted confusion about which navigation bar controlled what content. Changing the color of the Primary Navigation Bar from Grey to Teal (in line with the website theme) clarified the site’s structure and made navigation more intuitive.

Overwhelming Text Content

Before

After

Why this issue:

Pages were filled with large text blocks, overwhelming users and making important information hard to scan.

Where Identified:

User Research (Survey feedback)

Heuristic Evaluation (Aesthetic and Minimalist Design)

Severity level:

Medium

Justification:

Participants reported difficulty finding relevant information due to the heavy amount of text. Breaking the content into concise sections and bullet points improved scannability and reduced cognitive overload.

Small, Illegible Text

Before

After

Why this issue:

Font sizes were too small for comfortable reading, especially on mobile devices.

Where Identified:

Accessibility Audit

Usability Testing

Severity level:

Low

Justification:

Users (especially mobile users) struggled with readability, leading to frustration. Increasing text size across the Adoption page improved accessibility and user comfort.

Navigation Hierarchy Confusion

Before

After

Why this issue:

Navigation structure was disorganized; participants could not predict where they were within the site (e.g., "Programs and Services" showing without context).

Where Identified:

Heuristic Evaluation (Match Between System and the Real World)

Usability Testing

Severity level:

Medium

Justification:

Usability testing showed users pausing in confusion. A simpler and predictable hierarchy (Home > Adopt) reduced navigation errors and made paths logical and direct.

Links Looked Like Normal Text

Before

After

Why this issue:

Hyperlinks inside paragraphs were styled like regular text, making them difficult to recognize as clickable links.

Where Identified:

Usability Testing

Heuristic Evaluation (Recognition Rather Than Recall)

Severity level:

Medium

Justification:

Many participants skipped important links because they blended with the surrounding text. Updating links to blue color and underlining them made them immediately identifiable.

Red Adoption Button Not Matching Website Theme

Before

After

Why this issue:

The red "Adoption" button clashed visually with the rest of the site's Teal theme, creating a jarring experience.

Where Identified:

Visual Usability Testing

Heuristic Evaluation (Aesthetic and Minimalist Design)

Severity level:

Low

Justification:

Users' attention was distracted by the inconsistency. Changing the button to Teal maintained visual consistency and made the call-to-action feel cohesive with the page design.

Unused Whitespace (Fixed by "Pay Adoption Fee" Button)

Before

After

Why this issue:

Large empty spaces made the page feel unfinished and wasted valuable screen real estate.

Where Identified:

Heuristic Evaluation (Aesthetic and Minimalist Design)

Usability Testing

Severity level:

Low

Justification:

By strategically placing the "Pay Adoption Fee" button in the whitespace, the layout became more balanced, improving visual flow and user focus on key actions.

ADOPTION APPLICATION FORM
Non-Functional Date Picker

Before

After

Why this issue:

A broken date picker caused confusion among users, leading to frequent format errors and frustration during form filling. Date input is critical for accurate submissions.

Where Identified:

Heuristic Evaluation (Error Prevention)

Usability Testing observations

Severity level:

Medium

Justification:

Participants during usability testing mentioned that entering dates manually was error-prone and confusing. They either entered MM/DD/YYYY incorrectly or abandoned form filling after repeated errors. A standard date picker reduces mistakes and enhances user confidence.

No Option to Save Progress or Minimize the Form

Before

After

Why this issue:

Users needed to refer to external sources but couldn't save progress or minimize, resulting in data loss and task abandonment.

Where Identified:

User Research (feedback during survey)

Usability Testing

Severity level:

Medium

Justification:

Several users reported frustration when they needed to look up pet information but had no way to save the form. They wanted a "Save and Continue Later" option to reduce anxiety about losing information, especially when multitasking across tabs.

Loss of Data on Navigation

Before

After

Why this issue:

Navigating away from the form (accidentally or intentionally) led to total data loss, creating a critical barrier to form completion.

Where Identified:

Usability Testing

User Research complaints

Severity level:

High

Justification:

Users who accidentally refreshed the page or clicked a link lost all their entered data, causing high frustration. Implementing an auto-save feature prevents critical information loss and improves task completion rates.

No 'State' Dropdown

Before

After

Why this issue:

Manual state entries led to inconsistencies and increased the chance of spelling errors.

Where Identified:

Heuristic Evaluation (Consistency and Standards)

Severity level:

Medium

Justification:

User feedback indicated frustration with having to type states manually. Drop-down menus for standardized selections improve efficiency and reduce input errors significantly.

Vague or Confusing Questions

Before

After

Why this issue:

Ambiguous phrasing (e.g., "Do you own or rent what?") caused confusion about what information was needed.

Where Identified:

Heuristic Evaluation (Match Between System and Real World)

Usability Testing

Severity level:

Medium

Justification:

Usability testing showed users pausing and hesitating at vague questions, asking for clarification. Clear, user-friendly language directly correlates with faster form completion.

Missing "No" Response Options

Before

After

Why this issue:

Certain questions offered only "Yes" without giving users a way to answer "No."

Where Identified:

Heuristic Evaluation (Error Prevention)

Severity level:

Medium

Justification:

During testing, users were unsure how to indicate a negative response, leading to incomplete or inaccurate form submissions. Adding a "No" ensures logical consistency and completeness.

Unclear Instructions for some fields

Before

After

Why this issue:

The form asked users some questions which were vague, but gave no examples or explanations.

Where Identified:

Heuristic Evaluation (Help Users Recognize, Diagnose, and Recover from Errors)

Severity level:

Low

Justification:

Participants hesitated and made mistakes when trying to figure out what was required. Adding brief instructions minimizes confusion and increases compliance.

Broken Signature Field

Before

After

Why this issue:

Users could see the signature field but could not sign, leading to broken task flows.

Where Identified:

Usability Testing

Heuristic Evaluation (Error Prevention)

Severity level:

High

Justification:

Several users tried repeatedly but couldn't sign the form electronically. Fixing the field and offering a text fallback prevents task abandonment.

Section Heading ("Dog or Cat") Cognitive Load

Before

After

Why this issue:

Confusing heading structure ("Adoption Application and Agreement - Dog or Cat") created mental friction.

Where Identified:

Heuristic Evaluation (Recognition Rather Than Recall)

Severity level:

Low

Justification:

By simplifying and splitting headings (Main Heading: "Adoption Application and Agreement", Section Heading: "Pet Profile (Dog or Cat)"), users can scan and process information faster.

Auto-Populate Feature for Fields

Before

After

Why this issue:

The form was unnecessarily repetitive and time-consuming for users filling it out.

Where Identified:

User Research feedback

Usability Testing

Severity level:

Medium

Justification:

Users complained about repetitive data entry across forms. Auto-filling known information (like name and species of pet) reduces time on task and improves satisfaction.

Unused Whitespace

Before

After

Why this issue:

Excessive whitespace caused visual imbalance and felt like missing content.

Where Identified:

Heuristic Evaluation (Aesthetic and Minimalist Design)

Severity level:

Low

Justification:

By adding friendly Dog and Cat images, the form felt more complete, themed, and inviting, improving the emotional connection. It is also suitable for the section beside it.

Impact

✅ Identified 27 usability issues across 8 core tasks, tested with 5 participants across 7 key areas of the AZHARTT experience.

✅ Achieved a 100% task completion rate, showing that users could complete the assigned flows, but still faced friction in navigation, form completion, content clarity, and error recovery.

✅ Prioritized issues by severity, with most findings concentrated in minor, strong suggestion, and blocker-level issues, helping separate quick UI fixes from higher-risk usability barriers.

✅ Improved the redesign direction by focusing on recurring pain points, including unclear form inputs, weak navigation cues, poor visual hierarchy, missing feedback, and confusing error states.

✅ Converted usability findings into actionable design recommendations, making the next iteration more scannable, easier to navigate, and more supportive for users completing rescue, adoption, volunteer, and donation-related tasks.

Learnings

Relying on diverse research methods yields richer data and enables more user-centered, evidence-based design improvements.

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
