const fs = require('node:fs');
const summaries = {
  'case-trial.html': [['Patient control', 'Onboarding, comparison and caregiver flows designed.'], ['Clinical feedback', 'Refined through three physician testing rounds.'], ['Prototype scope', 'Clinical concepts; patient outcomes not measured.']],
  'case-showroom.html': [['6 guided steps', 'A rooftop HVAC walkthrough with free exploration.'], ['16 states checked', 'Zero axe violations in final pre-launch scans.'], ['3 keyboard cycles', 'Pause, restart, exit and re-entry passed QA.']],
  'case-ruhl.html': [['Address-first entry', 'Landing page and building inquiry designed and developed.'], ['Connected search', 'Building IDs connect previews to detailed results.'], ['Evidence scope', 'Archived exploration; submission accuracy unverified.']],
  'case-azhartt.html': [['27 issues found', 'Prioritized usability findings and redesign directions.'], ['5 participants', 'Moderated testing across eight tasks.'], ['Research outcome', 'Recommendations delivered; redesign gains unmeasured.']],
  'case-azhartt-accessibility.html': [['35 audit failures', '24 critical and 11 moderate classifications.'], ['3 pages reviewed', 'Annotated findings and recurring accessibility patterns.'], ['Remediation roadmap', 'Prioritized fixes; implementation not verified.']],
  'case-mindle.html': [['Shipped game', 'Weekly UX puzzles, reflections and admin scheduling.'], ['7 registered players', 'Non-seed accounts in the July 6, 2026 snapshot.'], ['Early signal', 'Small reflection sample; engagement lift unproven.']],
  'case-perspective.html': [['Playable activity', 'Two game versions with tutorial and comparison.'], ['Workshop delivery', 'A metaphor for AI ideation and human judgment.'], ['Learning boundary', 'Participant learning gains not measured.']],
  'case-space-shooter.html': [['Playable build', 'A working game documented in a gameplay recording.'], ['Repeatable workflow', 'Ideate, structure, implement and review with AI.'], ['Evidence scope', 'No documented adoption or build-time measurements.']],
  'case-soor.html': [['Mobile redesign', 'Research, journey mapping and interactive prototyping.'], ['User evaluation', 'Usability testing informed interface refinements.'], ['Working interfaces', 'Core Android screens implemented in Jetpack Compose.']]
};
for (const [file, items] of Object.entries(summaries)) {
  const location = `pages/${file}`;
  let html = fs.readFileSync(location, 'utf8');
  const summary = `<aside class="overview-impact" aria-label="Impact overview"><h2>Impact at a glance</h2><ol>${items.map(([title, text]) => `<li><h3>${title}</h3><p>${text}</p></li>`).join('')}</ol></aside>`;
  html = html.replace(/<aside class="overview-impact"[\s\S]*?<\/aside>/, '');
  // The first figure on each project is the overview image or video.
  html = html.replace(/<\/figure>/, `</figure>${summary}`);
  html = html.replace(/<details class="overview-details"><summary>Project context &amp; methods<\/summary>([\s\S]*?)<\/details>/, '<section class="overview-details" aria-label="Project context and methods"><h2>Project context &amp; methods</h2>$1</section>');
  fs.writeFileSync(location, html);
}
