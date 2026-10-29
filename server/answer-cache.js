const { createHash } = require('node:crypto');
const knowledge = require('./knowledge');
const config = require('./config');
const version = createHash('sha256').update(JSON.stringify(knowledge) + config.model).digest('hex');
const groups = {
  healthcare: ['healthcare', 'healthcare experience', 'what healthcare experience does dhrumil have', 'what is your strongest healthcare project', 'whats your strongest healthcare project'],
  ai: ['ai projects', 'how do you use ai in your work', 'what ai projects has dhrumil worked on'],
  technical: ['technical work', 'what technical projects has dhrumil worked on'],
  ownership: ['what did you personally own', 'what did dhrumil personally own', 'what did dhrumil own in trialbridge'],
  accessibility: ['accessibility experience', 'what accessibility experience does dhrumil have']
};
// Ownership scoped to a named project must never share a cache key with generic ownership.
function commonKey(question, history = [], jdMode = false) {
  if (jdMode || history.length) return null;
  const normalized = question.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  for (const [group, phrases] of Object.entries(groups)) if (phrases.includes(normalized)) return `${version}:${group}:${group === 'ownership' && normalized.includes('trialbridge') ? 'trialbridge' : 'general'}`;
  return null;
}
function createAnswerCache({ now = Date.now, ttl = config.limits.cacheMs } = {}) {
  const values = new Map();
  return {
    get(key) {
      if (!key) return null;
      const entry = values.get(key);
      if (!entry || entry.expires <= now()) { values.delete(key); return null; }
      return structuredClone(entry.result);
    },
    set(key, result) {
      if (!key || result.error || result.offTopic) return;
      values.set(key, { expires: now() + ttl, result: structuredClone(result) });
    }
  };
}
module.exports = { commonKey, createAnswerCache };
