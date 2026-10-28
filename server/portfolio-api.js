const { createHash, randomUUID } = require('node:crypto');
const config = require('./config');
const { retrieve, tokens, category } = require('./retrieval');
const { generate } = require('./gemini');
const { track } = require('./analytics');
const buckets = new Map();
let total = { count: 0, reset: 0 };
function limited(req) {
  const now = Date.now();
  for (const [key, entry] of buckets) if (entry.reset < now) buckets.delete(key);
  if (total.reset < now) total = { count: 0, reset: now + config.rateWindowMs };
  total.count += 1;
  if (total.count > 120) return true;
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const key = createHash('sha256').update(ip).digest('hex');
  const bucket = buckets.get(key) || { count: 0, reset: now + config.rateWindowMs };
  bucket.count += 1;
  buckets.set(key, bucket);
  return bucket.count > config.rateLimit;
}
function clean(value, max) {
  if (typeof value !== 'string' || value.length > max) throw new Error('INPUT');
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim();
}
async function bodyOf(req) {
  if (Number(req.headers['content-length']) > config.maxBodyBytes) throw new Error('INPUT');
  let body = req.body;
  if (body === undefined) {
    let bytes = 0; const chunks = [];
    for await (const chunk of req) {
      bytes += Buffer.byteLength(chunk);
      if (bytes > config.maxBodyBytes) throw new Error('INPUT');
      chunks.push(Buffer.from(chunk));
    }
    body = Buffer.concat(chunks).toString('utf8');
  }
  if (Buffer.isBuffer(body)) body = body.toString('utf8');
  if (typeof body === 'string') { if (Buffer.byteLength(body) > config.maxBodyBytes) throw new Error('INPUT'); body = JSON.parse(body); }
  if (!body || typeof body !== 'object' || Array.isArray(body) || Buffer.byteLength(JSON.stringify(body)) > config.maxBodyBytes) throw new Error('INPUT');
  return body;
}
function evidenceFor(facts) {
  return facts.map(({ title, text, url }) => ({ title, description: text, url }));
}
function insufficient(jdMode = false) {
  const result = { answer: config.insufficient, evidence: [], suggestedFollowUps: ['What healthcare experience does Dhrumil have?', 'What technical projects has Dhrumil worked on?'], hasMoreDetail: false, detail: '', insufficientEvidence: true };
  return jdMode ? { ...result, matchLevel: 'Partial', strongestRelevantExperience: [], relevantProjects: [], potentialGaps: [] } : result;
}
function select(ids, facts, limit = 3) {
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'string')) throw new Error('INVALID_RESPONSE');
  return [...new Set(ids)].slice(0, limit).map((id) => {
    const fact = facts.find((item) => item.id === id);
    if (!fact) throw new Error('INVALID_RESPONSE');
    return fact;
  });
}
function groundedResult(raw, facts, jdMode, question) {
  if (!raw || typeof raw.insufficientEvidence !== 'boolean') throw new Error('INVALID_RESPONSE');
  if (raw.insufficientEvidence && (!jdMode || !Array.isArray(raw.requirements) || !raw.requirements.length)) return insufficient(jdMode);
  const chosen = select(raw.factIds, facts, 2);
  const detail = select(raw.detailFactIds, facts).filter((fact) => !chosen.includes(fact));
  if (!chosen.length && !jdMode) return insufficient();
  // The model can select/order evidence, but cannot author unsupported claims.
  // A paraphrase that fails exact validation is replaced with the source text.
  const supportedAnswer = chosen.map((fact) => fact.text).join(' ');
  const answer = raw.answer === supportedAnswer ? raw.answer : supportedAnswer;
  const result = { answer, evidence: evidenceFor([...chosen, ...detail]), suggestedFollowUps: ['What did Dhrumil personally own?', 'What shaped the design decisions?'], hasMoreDetail: detail.length > 0, detail: detail.map((fact) => fact.text).join(' '), insufficientEvidence: false };
  if (!jdMode) return result;
  if (!Array.isArray(raw.requirements) || !raw.requirements.length || raw.requirements.length > 8) throw new Error('INVALID_RESPONSE');
  const extracted = [...raw.requirements];
  // Do not let extraction silently omit common hard constraints to inflate fit.
  const hardConstraints = question.match(/\b(?:senior|principal|staff|leadership|manage\w*|mentoring|direct reports|\d+\+?\s*years?|figma|sketch|adobe|react|typescript|python|sql|swift|degree|bachelor\w*|master\w*|accessibility|wcag)\b/gi) || [];
  for (const text of [...new Set(hardConstraints)]) {
    if (!extracted.some((item) => typeof item.text === 'string' && item.text.toLowerCase().includes(text.toLowerCase()))) extracted.push({ text, factIds: [] });
  }
  const requirements = extracted.map((requirement) => {
    const text = clean(requirement.text, 400);
    if (!text || !question.toLowerCase().includes(text.toLowerCase())) throw new Error('INVALID_RESPONSE');
    let matches = select(requirement.factIds, facts);
    // Extra safeguards: a team project cannot establish leadership/seniority;
    // a related technology cannot establish a requested tool or qualification.
    const constraints = text.match(/\b(?:senior|principal|staff|leadership|manage\w*|mentoring|direct reports|\d+\+?\s*years?|figma|sketch|adobe|react|typescript|python|sql|swift|degree|bachelor\w*|master\w*|accessibility|wcag)\b/gi) || [];
    matches = matches.filter((fact) => {
      if (constraints.some((term) => !fact.text.toLowerCase().includes(term.toLowerCase()))) return false;
      return tokens(text).some((term) => tokens(`${fact.tags.join(' ')} ${fact.text}`).includes(term));
    });
    return { requirement: text, facts: matches };
  });
  const matched = requirements.filter((item) => item.facts.length);
  if (!matched.length) return { ...insufficient(), matchLevel: 'Partial', strongestRelevantExperience: [], relevantProjects: [], potentialGaps: requirements.map((item) => ({ requirement: item.requirement, explanation: 'Not documented in the retrieved portfolio evidence; this is not proof of missing experience.' })) };
  const supporting = [...new Map(matched.flatMap((item) => item.facts).map((fact) => [fact.id, fact])).values()];
  const matchLevel = matched.length === requirements.length ? 'Strong' : matched.length * 2 >= requirements.length ? 'Moderate' : 'Partial';
  return {
    ...result,
    answer: `${matchLevel} match against the requirements supported by the available portfolio evidence. This is a qualitative portfolio comparison, not an assessment of unverified experience.`,
    matchLevel,
    strongestRelevantExperience: supporting.slice(0, 3).map((fact) => fact.text),
    relevantProjects: evidenceFor(supporting).filter((item, index, all) => all.findIndex((other) => other.url === item.url) === index),
    evidence: evidenceFor(supporting),
    potentialGaps: requirements.filter((item) => !item.facts.length).map((item) => ({ requirement: item.requirement, explanation: 'Not documented in the retrieved portfolio evidence; confirm directly rather than assuming no experience.' })),
    requirementsReviewed: requirements.map(({ requirement, facts: matches }) => ({ requirement, supported: matches.length > 0 })),
    detail: 'The comparison uses the extracted requirements shown here and cited portfolio records. It does not verify employment eligibility, years of experience, or unlisted qualifications.',
    hasMoreDetail: true
  };
}
function createHandler(jdMode, dependencies = {}) {
  const provider = dependencies.generate || generate;
  const analytics = dependencies.track || track;
  const rateLimited = dependencies.limited || limited;
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const send = (code, data) => res.status(code).json(data);
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(405, { error: 'Use POST for portfolio questions.' }); }
    if (!/^application\/json\b/i.test(req.headers['content-type'] || '')) return send(415, { error: 'Please send text as JSON.' });
    if (req.headers.origin) {
      try { if (new URL(req.headers.origin).host !== req.headers.host) return send(403, { error: 'Please use the assistant on the portfolio website.' }); }
      catch { return send(403, { error: 'Invalid request origin.' }); }
    }
    if (rateLimited(req)) { res.setHeader('Retry-After', '60'); return send(429, { error: 'A few too many questions at once. Please try again in a minute.', retryable: true }); }
    let question, sessionId, history;
    try {
      const body = await bodyOf(req);
      if (Object.keys(body).some((key) => !['question', 'jobDescription', 'history', 'sessionId'].includes(key))) throw new Error('INPUT');
      question = clean(jdMode ? body.jobDescription : body.question, jdMode ? config.maxJD : config.maxQuestion);
      if (!question) throw new Error('INPUT');
      if (body.history !== undefined && (!Array.isArray(body.history) || body.history.length > 8)) throw new Error('INPUT');
      history = (body.history || []).map((item) => {
        if (!item || !['user', 'assistant'].includes(item.role)) throw new Error('INPUT');
        return { role: item.role, content: clean(item.content, config.maxQuestion).slice(0, 600) };
      });
      sessionId = typeof body.sessionId === 'string' && /^[a-f0-9-]{36}$/i.test(body.sessionId) ? body.sessionId : randomUUID();
    } catch { return send(400, { error: `Please enter ${jdMode ? 'a job description up to 20,000' : 'a question up to 2,000'} characters.` }); }
    const facts = retrieve(question, history, jdMode);
    let result, code = 200;
    try { result = facts.length ? groundedResult(await provider({ question, history, facts, jdMode }), facts, jdMode, question) : insufficient(jdMode); }
    catch (error) {
      code = 503;
      const messages = {
        MISSING_API_KEY: 'The portfolio assistant is not configured yet. Please explore the portfolio directly for now.',
        AUTH: 'The portfolio assistant could not connect to its AI provider. Please explore the portfolio directly for now.',
        MODEL_UNAVAILABLE: 'The portfolio assistant needs a model configuration update. Please try again later.',
        QUOTA: 'The portfolio assistant has reached its AI usage limit. Please try again later or explore the linked work.'
      };
      const safeCode = ['MISSING_API_KEY', 'AUTH', 'MODEL_UNAVAILABLE', 'QUOTA', 'INVALID_REQUEST', 'INVALID_RESPONSE'].includes(error.message) ? error.message : 'UNAVAILABLE';
      console.warn('Portfolio assistant request failed:', safeCode);
      result = { error: messages[safeCode] || 'The portfolio assistant is temporarily unavailable. Please try again shortly, or explore the linked work.', retryable: true, evidence: evidenceFor(facts.slice(0, 3)), suggestedFollowUps: [], hasMoreDetail: false, insufficientEvidence: false };
    }
    await analytics({ sessionId, question, category: jdMode ? 'jd_match' : category(question), facts, outcome: code !== 200 ? 'api_error' : result.insufficientEvidence ? 'insufficient_evidence' : 'answered', jdMode }).catch(() => {});
    return send(code, result);
  };
}
module.exports = { createHandler, groundedResult, insufficient, limited };
