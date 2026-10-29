const knowledge = require('./knowledge');
const config = require('./config');
const normalize = (text) => text.toLowerCase().replace(/\.(?![a-z0-9])/g, ' ').replace(/[^a-z0-9.]+/g, ' ').trim();
const aliases = { own: 'ownership', owned: 'ownership', personally: 'ownership', responsibilities: 'ownership', role: 'ownership', health: 'healthcare', medical: 'healthcare', engineer: 'engineering', code: 'technical', coding: 'technical', developer: 'development', javascript: 'technical', prototypes: 'prototyping', tests: 'testing', tested: 'testing', difficult: 'technical', build: 'development' };
const stop = new Set('what who how why when where has have does did is are was were the a an of to and or in on for with me my your his he she it that this dhrumil shah portfolio work worked projects project tell about can do you i strongest best personally'.split(' '));
function tokens(text) { return [...new Set(normalize(text).split(' ').filter((word) => word && !stop.has(word)).map((word) => aliases[word] || word))]; }
function category(text) {
  const q = normalize(text);
  if (/healthcare|clinical|medical|trialbridge/.test(q)) return 'healthcare';
  if (/\bown|role|responsibilit/.test(q)) return 'ownership';
  if (/technical|develop|code|3d|three.js/.test(q)) return 'technical';
  if (/\bai\b|chatgpt/.test(q)) return 'ai';
  if (/process|decision|test|research/.test(q)) return 'process';
  return 'experience';
}
function retrieve(question, history = [], jd = false) {
  // No evidence of people management or these employment details exists in this KB.
  // Blocking these claims also prevents matching a six-person project team to management.
  if (!jd && /manag(?:e|ed|ing)|direct reports|team of\s*\d|salary|visa|sponsor|native ios|\bswift\b/i.test(question)) return [];
  let query = question;
  if (/^(?:how i work|how do you work|how does dhrumil work)[?.!\s]*$/i.test(question)) query += ' design process';
  const explicit = knowledge.filter((fact) => normalize(question).includes(normalize(fact.project)) || normalize(question).includes(normalize(fact.title.split(' · ')[0]))).map((fact) => fact.project);
  // Carry forward only a named project, never a client's unverified assistant text.
  if (!explicit.length && /\b(that|this|it|role|decision|testing|difficult|why|own)\b/i.test(question)) {
    const previous = [...history].reverse().find((item) => item.role === 'user' && /trialbridge|showroom|mindle|perspective|space shooter|ruhl/i.test(item.content));
    if (previous) {
      query += ` ${previous.content}`;
      for (const fact of knowledge) {
        if (normalize(previous.content).includes(normalize(fact.project)) || normalize(previous.content).includes(normalize(fact.title.split(' · ')[0]))) explicit.push(fact.project);
      }
    }
  }
  const terms = tokens(query);
  const named = [...new Set(explicit)];
  if (!jd && !named.length && /healthcare|clinical|medical/i.test(question)) named.push('trialbridge');
  const ranked = knowledge.map((fact) => {
    const tags = normalize(fact.tags.join(' '));
    const text = normalize(`${fact.title} ${fact.text}`);
    const score = terms.reduce((sum, term) => sum + (tags.split(' ').includes(term) ? 4 : text.split(' ').includes(term) ? 1 : 0), 0);
    return { fact, score: score + (named.includes(fact.project) ? 12 : 0) };
  }).filter(({ fact, score }) => score >= 4 && (!named.length || jd || named.includes(fact.project))).sort((a, b) => b.score - a.score);
  const counts = {};
  const selected = [];
  const covered = new Set();
  while (ranked.length && selected.length < config.maxFacts) {
    // JD retrieval rewards new requirement terms, so broad overview records
    // cannot crowd out a specific tool, research, or prototyping record.
    if (jd) ranked.sort((a, b) => {
      const novelty = ({ fact, score }) => score + terms.filter((term) => !covered.has(term) && tokens(fact.tags.join(' ')).includes(term)).length * 16;
      return novelty(b) - novelty(a);
    });
    const { fact } = ranked.shift();
    const cap = named.length ? 5 : jd ? 4 : 2;
    if ((counts[fact.project] || 0) >= cap) continue;
    counts[fact.project] = (counts[fact.project] || 0) + 1;
    selected.push(fact);
    for (const term of tokens(fact.tags.join(' '))) covered.add(term);
  }
  return selected;
}
module.exports = { retrieve, tokens, category };
