// Maintain curated recruiter answers, accepted phrasings, citations and follow-ups here.
// Patterns are complete phrases, never keywords or fuzzy substring matches.
const link = (title, url) => ({ title, url, description: title });
const trial = link('TrialBridge', '#case-trial');
const showroom = link('Virtual Showroom', '#case-showroom');
const ruhl = link('RUHL AI', '#case-ruhl');
const ai = link('AI Lab', '#ai-lab');
const about = link('About Dhrumil', '#about');
const entries = [
  {
    id: 'designer-profile', canonicalQuestion: 'What kind of designer is Dhrumil?',
    patterns: ['What type of designer is he?', 'Tell me about Dhrumil as a designer', 'What kind of designer are you?'],
    answer: 'Dhrumil is a Product Designer who works on complex products across healthcare, sustainability, AI-enabled experiences, accessibility, and interactive web products. He is comfortable moving between UX thinking, prototyping, visual design, and implementation.',
    evidence: [trial, showroom, ruhl], followUps: ['strongest-projects', 'role-fit'], tags: ['design', 'background'], intent: 'profile'
  },
  {
    id: 'strongest-projects', canonicalQuestion: 'What are Dhrumil’s strongest projects?',
    patterns: ['What are his strongest projects?', 'Show me his best work', 'What are your best projects?', 'Which projects best represent his work?'],
    answer: 'His strongest portfolio work includes TrialBridge, RUHL’s Virtual Showroom, and RUHL AI. Together they show product thinking, research, complex-system design, accessibility, and the ability to carry work into implementation.',
    evidence: [trial, showroom, ruhl], followUps: ['first-project', 'project-ownership'], tags: ['projects'], intent: 'projects'
  },
  {
    id: 'role-fit', canonicalQuestion: 'What roles is he best suited for?',
    patterns: ['What roles is Dhrumil best suited for?', 'What jobs would suit him?', 'What design roles fit his background?'],
    answer: 'His portfolio aligns most strongly with Product Designer and AI Product Designer roles, especially where the work involves complex workflows, technical systems, healthcare, enterprise software, or AI-enabled experiences.',
    evidence: [trial, ruhl, ai], followUps: ['designer-difference', 'strongest-projects'], tags: ['roles', 'career'], intent: 'roles'
  },
  {
    id: 'designer-difference', canonicalQuestion: 'What makes him different from other product designers?',
    patterns: ['What sets Dhrumil apart?', 'What makes Dhrumil different?', 'What makes him stand out as a designer?'],
    answer: 'He combines product-design thinking with enough frontend and technical fluency to prototype and implement ideas rather than stopping at Figma. He also actively explores how AI can accelerate design and build work while keeping judgment, evidence, and usability human-led.',
    evidence: [showroom, link('Mindle', '#case-mindle'), ai], followUps: ['technical-skills', 'ai-philosophy'], tags: ['design', 'technical'], intent: 'differentiation'
  },
  {
    id: 'project-ownership', canonicalQuestion: 'What did Dhrumil personally own in his projects?',
    patterns: ['What did Dhrumil personally own?', 'What did you personally own?', 'What were his individual contributions?', 'What was his personal contribution across projects?'],
    answer: 'His ownership varies by project. On TrialBridge, his work included onboarding, trial comparison, caregiver features, educational resources, FAQs, and connection-request concepts. At RUHL, his work has included UX/UI design alongside frontend implementation. Individual case studies separate his contribution from the wider team.',
    evidence: [trial, showroom, ruhl], followUps: ['healthcare-experience', 'virtual-showroom'], tags: ['ownership', 'role'], intent: 'ownership'
  },
  {
    id: 'design-process', canonicalQuestion: 'How does Dhrumil approach design problems?',
    patterns: ['What is his design process?', 'How does he solve design problems?', 'How do you approach design problems?', 'How I work'],
    answer: 'His process usually moves from understanding the problem and constraints into exploration, prototyping, critique or testing, refinement, and implementation. He adjusts the depth of each stage depending on the evidence, timeline, and project constraints.',
    evidence: [trial, showroom], followUps: ['research-experience', 'ai-workflow'], tags: ['process'], intent: 'process'
  },
  {
    id: 'research-experience', canonicalQuestion: 'What research experience does he have?',
    patterns: ['What research experience does Dhrumil have?', 'Has he done user research?', 'What usability research has he done?'],
    answer: 'His work includes moderated usability testing, physician feedback sessions, heuristic and accessibility evaluation, competitive/contextual research, and turning qualitative findings into product changes.',
    evidence: [link('AZHARTT usability research', '#case-azhartt'), trial], followUps: ['healthcare-experience', 'accessibility'], tags: ['research', 'testing'], intent: 'research'
  },
  {
    id: 'healthcare-experience', canonicalQuestion: 'What healthcare experience does Dhrumil have?',
    patterns: ['Has he worked in healthcare?', 'What medical products has he designed?', 'Tell me about his Mayo work', 'Does he have healthcare UX experience?', 'What’s his strongest healthcare work?', 'What is his strongest healthcare work?', 'What’s your strongest healthcare project?', 'What is your strongest healthcare project?'],
    answer: 'Dhrumil worked on TrialBridge during a Mayo Clinic apprenticeship, designing parts of a clinical-trial matching experience for patients, caregivers, and providers. His work included onboarding, trial comparison, caregiver features, educational resources, and iterations informed by physician feedback.',
    evidence: [trial], followUps: ['trialbridge', 'project-ownership'], tags: ['healthcare', 'mayo'], intent: 'healthcare'
  },
  {
    id: 'trialbridge', canonicalQuestion: 'What is TrialBridge?',
    patterns: ['Tell me about TrialBridge', 'Give me a TrialBridge overview', 'What does TrialBridge do?'],
    answer: 'TrialBridge is a concept for making clinical-trial discovery easier to understand and act on. The experience combined guided discovery, data-assisted matching, transparent recommendations, comparison, and caregiver support.',
    evidence: [trial], followUps: ['healthcare-experience', 'research-experience'], tags: ['trialbridge', 'healthcare'], intent: 'project-overview'
  },
  {
    id: 'technical-skills', canonicalQuestion: 'What technical skills does Dhrumil have?',
    patterns: ['Can he code?', 'Does he know frontend?', 'What technical work has he done?', 'Has he built anything himself?', 'Can Dhrumil code?', 'What technical skills do you have?'],
    answer: 'Dhrumil is primarily a Product Designer, but he also has practical frontend experience with HTML, CSS, JavaScript, React/Next.js, Three.js, Supabase, Vercel, and Cloudflare. He uses that technical fluency to prototype, evaluate feasibility, and sometimes ship working experiences.',
    evidence: [showroom, link('Mindle', '#case-mindle'), ruhl], followUps: ['virtual-showroom', 'tools'], tags: ['technical', 'frontend'], intent: 'technical'
  },
  {
    id: 'virtual-showroom', canonicalQuestion: 'What is the Virtual Showroom?',
    patterns: ['Tell me about the Virtual Showroom', 'What is RUHL’s Virtual Showroom?', 'What is the 200 Water showroom?'],
    answer: 'The Virtual Showroom is an interactive 3D rooftop experience created for RUHL’s 200 Water project. Users can explore rooftop systems and equipment inside a dedicated Three.js environment instead of relying only on static property content.',
    evidence: [showroom], followUps: ['technical-skills', 'project-ownership'], tags: ['showroom', 'technical'], intent: 'project-overview'
  },
  {
    id: 'ai-workflow', canonicalQuestion: 'How does Dhrumil use AI in his work?',
    patterns: ['How does he use AI?', 'Does he design with AI?', 'How do you use AI?', 'How do you use AI in your work?', 'What is his AI workflow?'],
    answer: 'He uses AI across framing, exploration, prototyping, critique, refinement, and build. AI helps expand possibilities and accelerate implementation, while he keeps problem definition, evidence, selection, and final judgment human-led.',
    evidence: [ai, link('Perspective', '#case-perspective'), link('Mindle', '#case-mindle')], followUps: ['ai-projects', 'ai-philosophy'], tags: ['ai', 'workflow'], intent: 'ai-workflow'
  },
  {
    id: 'ai-projects', canonicalQuestion: 'What AI projects has he worked on?',
    patterns: ['What AI projects has Dhrumil worked on?', 'Show me his AI projects', 'What AI experience does he have?', 'What are his AI projects?'],
    answer: 'His AI Lab includes Mindle, Perspective, an early Space Rocket game, and a six-part AI-in-design workshop series. His portfolio assistant also explores grounded AI, evidence links, failure states, and usage guardrails.',
    evidence: [ai, link('Mindle', '#case-mindle'), link('Perspective', '#case-perspective')], followUps: ['ai-workflow', 'ai-philosophy'], tags: ['ai', 'projects'], intent: 'ai-projects'
  },
  {
    id: 'ai-philosophy', canonicalQuestion: 'What is Dhrumil’s AI philosophy?',
    patterns: ['What is his AI philosophy?', 'How does he think about AI?', 'What is your philosophy on AI?'],
    answer: 'AI expands what he can explore and build quickly; it does not replace judgment. He tries to decide what already matters before asking AI to help with what is still uncertain.',
    evidence: [ai, link('Perspective', '#case-perspective')], followUps: ['ai-workflow', 'ai-projects'], tags: ['ai', 'judgment'], intent: 'ai-philosophy'
  },
  {
    id: 'accessibility', canonicalQuestion: 'Does Dhrumil have accessibility experience?',
    patterns: ['Does he have accessibility experience?', 'What accessibility experience does he have?', 'Has he worked on accessibility?', 'Does he consider WCAG?'],
    answer: 'Yes. Accessibility is part of his design and evaluation work, including WCAG-focused reviews, keyboard behavior, focus states, zoom behavior, interaction clarity, and accessible implementation considerations.',
    evidence: [link('AZHARTT usability research', '#case-azhartt'), trial, ai], followUps: ['research-experience', 'technical-skills'], tags: ['accessibility', 'wcag'], intent: 'accessibility'
  },
  {
    id: 'teamwork', canonicalQuestion: 'How does Dhrumil work with teams?',
    patterns: ['How does he collaborate?', 'What is he like to work with?', 'How does he work with a team?', 'How do you collaborate with others?'],
    answer: 'He tends to pay attention to the energy and needs of the people around him and look for small ways to contribute. In collaborative work, that often means stepping in where useful, helping keep things moving, and putting in extra effort when he knows the difference will be noticed.',
    evidence: [about, trial], followUps: ['project-ownership', 'design-process'], tags: ['team', 'collaboration'], intent: 'teamwork'
  },
  {
    id: 'tools', canonicalQuestion: 'What tools does Dhrumil use?',
    patterns: ['What tools does he use?', 'What is his design toolkit?', 'What design tools do you use?'],
    answer: 'His design toolkit includes Figma and Adobe tools, alongside frontend technologies such as HTML/CSS/JavaScript, React/Next.js, Three.js, Supabase, Vercel, and Cloudflare. His AI workflow includes tools such as ChatGPT and Cursor.',
    evidence: [link('Mindle', '#case-mindle'), showroom, ai], followUps: ['technical-skills', 'ai-workflow'], tags: ['tools', 'skills'], intent: 'tools'
  },
  {
    id: 'first-project', canonicalQuestion: 'Which project should I look at first?',
    patterns: ['Where should I start with his portfolio?', 'Which case study should I read first?', 'What project should I start with?'],
    answer: 'For product thinking and healthcare, start with TrialBridge. For technical and interaction work, explore the Virtual Showroom. For AI-oriented thinking and experimentation, visit the AI Lab.',
    evidence: [trial, showroom, ai], followUps: ['trialbridge', 'virtual-showroom'], tags: ['projects', 'navigation'], intent: 'navigation'
  }
];

function normalizeQuestion(question) {
  return String(question).toLowerCase().replace(/[’']/g, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}
const index = new Map();
for (const entry of entries) {
  for (const phrase of [entry.canonicalQuestion, ...entry.patterns]) {
    const normalized = normalizeQuestion(phrase);
    if (index.has(normalized) && index.get(normalized) !== entry) throw new Error(`Ambiguous common question: ${phrase}`);
    index.set(normalized, entry);
  }
}
function matchCommonAnswer(question) {
  // Full phrase equality is our high-confidence threshold. Extra constraints,
  // comparisons, negation, project-specific ownership and compound questions fall through.
  return index.get(normalizeQuestion(question)) || null;
}
function commonResponse(entry) {
  return {
    answer: entry.answer,
    evidence: entry.evidence.map(item => ({ ...item })),
    suggestedFollowUps: entry.followUps.map(id => entries.find(item => item.id === id).canonicalQuestion),
    hasMoreDetail: false, detail: '', insufficientEvidence: false, source: 'common-answer'
  };
}
module.exports = { entries, normalizeQuestion, matchCommonAnswer, commonResponse };
