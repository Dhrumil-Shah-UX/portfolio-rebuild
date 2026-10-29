const { randomUUID } = require('node:crypto');
const config = require('./config');
const { retrieve, tokens, category } = require('./retrieval');
const { generate } = require('./gemini');
const { track } = require('./analytics');
const { classify } = require('./scope');
const { createProtection, identity, requestHash, uuid } = require('./abuse');
const { createAnswerCache, commonKey } = require('./answer-cache');
const protection = createProtection();
const answerCache = createAnswerCache();
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
  const guard = dependencies.protection || protection;
  const cache = dependencies.cache || answerCache;
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const candidate = req.headers['x-portfolio-session'] || req.body?.sessionId;
    let sessionId = typeof candidate === 'string' && uuid.test(candidate) ? candidate : randomUUID();
    let id = identity(req, sessionId), facts = [], usage, usageConsumed = false;
    let question = '', history = [], requestCategory = jdMode ? 'jd_match' : 'validation';
    const send = async (code, data, outcome) => {
      await Promise.resolve().then(() => analytics({ sessionId, category: requestCategory, facts, outcome, jdMode, requestType: jdMode ? 'jd' : 'chat' })).catch(() => {});
      return res.status(code).json({ ...data, ...(usage ? { usage } : {}), usageConsumed });
    };
    const fallback = (outcome = 'provider_failure') => send(503, { error: config.unavailable, retryable: true, evidence: evidenceFor(facts.slice(0, 3)), hasMoreDetail: false, insufficientEvidence: false }, outcome);
    const deny = (result) => {
      const messages = {
        duplicate: 'This question is already being processed or was just answered. Please wait a moment before trying again.',
        rate_limited: 'AI usage is temporarily limited. Please try again a little later; you can still explore the portfolio.',
        browser_chat_limit: 'Your AI questions are temporarily limited for this 24-hour period. You can still explore the portfolio directly.',
        browser_jd_limit: 'Your JD analyses are temporarily limited for this 24-hour period. You can still explore the portfolio directly.',
        global_limit: 'AI assistant usage limit reached. You can still explore the portfolio directly.'
      };
      const browser = result.reason?.startsWith('browser_');
      if (browser) {
        const mode = result.reason === 'browser_jd_limit' ? 'jd' : 'chat';
        usage = { ...(usage || {}), [mode]: { remaining: 0, limit: mode === 'jd' ? config.limits.jdDay : config.limits.chatDay, resetAt: Date.now() + result.retryAfter * 1000 } };
      }
      res.setHeader('Retry-After', String(result.retryAfter || 60));
      return send(result.reason === 'duplicate' ? 409 : 429, { error: messages[result.reason] || config.unavailable, limitReason: result.reason, retryable: true }, browser ? 'browser_limited' : result.reason === 'global_limit' ? 'global_limited' : result.reason === 'duplicate' ? 'duplicate' : 'rate_limited');
    };
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(405, { error: 'Use POST for portfolio questions.' }, 'invalid_input'); }
    try { const attempt = await guard.attempts(id); if (!attempt.allowed) return deny(attempt); }
    catch { return fallback('guard_unavailable'); }
    if (!/^application\/json\b/i.test(req.headers['content-type'] || '')) return send(415, { error: 'Please send text as JSON.' }, 'invalid_input');
    if (req.headers.origin) {
      try { if (new URL(req.headers.origin).host !== req.headers.host) return send(403, { error: 'Please use the assistant on the portfolio website.' }, 'invalid_input'); }
      catch { return send(403, { error: 'Invalid request origin.' }, 'invalid_input'); }
    }
    try {
      const body = await bodyOf(req);
      if (Object.keys(body).some((key) => !['question', 'jobDescription', 'history', 'sessionId'].includes(key))) throw new Error('INPUT');
      question = clean(jdMode ? body.jobDescription : body.question, jdMode ? config.maxJD : config.maxQuestion);
      if (!question) throw new Error('INPUT');
      if (body.history !== undefined && (!Array.isArray(body.history) || body.history.length > 8)) throw new Error('INPUT');
      history = (body.history || []).map((item) => {
        if (!item || !['user', 'assistant'].includes(item.role)) throw new Error('INPUT');
        return { role: item.role, content: clean(item.content, config.maxQuestion).slice(0, 500) };
      });
      if (!req.headers['x-portfolio-session'] && typeof body.sessionId === 'string' && uuid.test(body.sessionId)) sessionId = body.sessionId;
      id = identity(req, sessionId);
      history = history.slice(-4);
      requestCategory = jdMode ? 'jd_match' : category(question);
    } catch { return send(400, { error: `Please enter ${jdMode ? 'a job description up to 12,000' : 'a question up to 1,500'} characters.` }, 'invalid_input'); }
    try {
      const allowance = await guard.usage(id, requestHash(question, history, jdMode), jdMode);
      if (!allowance.allowed) return deny(allowance);
      usage = allowance.usage;
      usageConsumed = true;
    } catch { return fallback('guard_unavailable'); }
    const scope = classify(question, history, jdMode);
    const injectedHistory = history.some((item) => classify(item.content, [], false) === 'prompt_injection');
    if (scope !== 'portfolio' || injectedHistory) {
      return send(200, { answer: config.offTopic, evidence: [], suggestedFollowUps: [], hasMoreDetail: false, insufficientEvidence: false, offTopic: true }, scope === 'prompt_injection' || injectedHistory ? 'prompt_injection' : 'off_topic');
    }
    facts = retrieve(question, history, jdMode);
    const key = commonKey(question, history, jdMode);
    const cached = cache.get(key);
    if (cached) return send(200, cached, cached.insufficientEvidence ? 'insufficient_evidence' : 'answered');
    if (!facts.length) {
      const result = insufficient(jdMode);
      cache.set(key, result);
      return send(200, result, 'insufficient_evidence');
    }
    try {
      const reserved = await guard.gemini(id);
      if (!reserved.allowed) return deny(reserved);
    } catch { return fallback('guard_unavailable'); }
    let result;
    try { result = groundedResult(await provider({ question, history, facts, jdMode }), facts, jdMode, question); }
    catch (error) {
      const safeCode = ['MISSING_API_KEY', 'AUTH', 'MODEL_UNAVAILABLE', 'QUOTA', 'INVALID_REQUEST', 'INVALID_RESPONSE'].includes(error?.message) ? error.message : 'UNAVAILABLE';
      console.warn('Portfolio assistant request failed:', safeCode);
      return fallback();
    }
    cache.set(key, result);
    return send(200, result, result.insufficientEvidence ? 'insufficient_evidence' : 'answered');
  };
}
module.exports = { createHandler, groundedResult, insufficient };
