const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const config = require('../server/config');
const knowledge = require('../server/knowledge');
const { retrieve } = require('../server/retrieval');
const { createHandler, groundedResult } = require('../server/portfolio-api');
const { createProtection, createMemoryStore } = require('../server/abuse');
const { createAnswerCache } = require('../server/answer-cache');
const { generate } = require('../server/gemini');
const { track } = require('../server/analytics');
const id = '12345678-1234-4234-8234-123456789abc';
const jd = 'Product Designer. Design healthcare patient experiences. Conduct research and physician testing. Create prototypes. Requires Figma and 5 years of experience.';
function raw(ids, extra = {}) { return { insufficientEvidence: false, answer: 'Unsupported provider prose must never reach the client.', factIds: ids, detailFactIds: [], requirements: [], ...extra }; }
async function invoke(body, options = {}) {
  const events = []; let called = 0;
  const handler = createHandler(Boolean(options.jdMode), {
    generate: async (args) => { called++; if (options.error) throw new Error('QUOTA'); return options.reply ? options.reply(args) : raw([args.facts[0].id]); },
    track: async (event) => events.push(event),
    protection: options.rateLimit ? { attempts: async () => ({ allowed: false, reason: 'rate_limited', retryAfter: 60 }) } : options.protection || createProtection({ store: createMemoryStore() }),
    cache: options.cache || createAnswerCache()
  });
  const req = { method: options.method || 'POST', headers: { 'content-type': 'application/json', host: 'portfolio.test', ...options.headers }, body, socket: { remoteAddress: '127.0.0.1' } };
  const res = { headers: {}, setHeader(key, value) { this.headers[key] = value; }, status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
  await handler(req, res);
  return { ...res, events, called };
}

test('requested healthcare question retrieves and returns healthcare evidence only', async () => {
  const result = await invoke({ question: 'What healthcare experience does Dhrumil have?', sessionId: id });
  assert.equal(result.code, 200);
  assert.match(result.body.answer, /Mayo Clinic apprenticeship/);
  assert.ok(result.body.evidence.every((item) => item.url === '#case-trial'));
  assert.equal(result.body.insufficientEvidence, false);
  assert.equal(result.events[0].category, 'common-answer:healthcare-experience');
  assert.equal(result.called, 0);
});
test('requested TrialBridge ownership preserves personal versus team scope', async () => {
  const result = await invoke({ question: 'What did Dhrumil own in TrialBridge?' });
  assert.match(result.body.answer, /owned key parts of onboarding/);
  assert.match(result.body.answer, /collaborative/);
  assert.doesNotMatch(result.body.answer, /Unsupported provider prose/);
});
test('requested technical projects question finds actual built work', async () => {
  const result = await invoke({ question: 'What technical projects has Dhrumil worked on?' });
  assert.match(result.body.answer, /Three.js/);
  const facts = retrieve('What technical projects has Dhrumil worked on?');
  assert.ok(facts.some((fact) => fact.project === 'mindle'));
  assert.ok(facts.length <= config.maxFacts);
});
test('requested 20-designers question is insufficient without even calling Gemini', async () => {
  const result = await invoke({ question: 'Has Dhrumil managed a team of 20 designers?' });
  assert.equal(result.body.answer, config.insufficient);
  assert.equal(result.body.insufficientEvidence, true);
  assert.equal(result.called, 0);
  assert.equal(result.events[0].outcome, 'insufficient_evidence');
});
test('Product Designer JD returns qualitative fit, verified projects, and evidence gaps', async () => {
  const result = await invoke({ jobDescription: jd, sessionId: id }, { jdMode: true, reply: () => raw(['trial-overview'], { requirements: [
    { text: 'Design healthcare patient experiences', factIds: ['trial-overview'] },
    { text: 'Conduct research and physician testing', factIds: ['trial-testing'] },
    { text: 'Create prototypes', factIds: ['trial-ai'] },
    { text: 'Requires Figma and 5 years of experience', factIds: ['trial-overview'] }
  ] }) });
  assert.equal(result.code, 200);
  assert.equal(result.body.matchLevel, 'Moderate');
  assert.ok(result.body.potentialGaps.some((gap) => /Figma/.test(gap.requirement)));
  assert.ok(result.body.relevantProjects.some((project) => project.url === '#case-trial'));
  assert.ok(!('score' in result.body));
  assert.ok(!JSON.stringify(result.body).includes('%'));
});
test('unrelated general knowledge questions never call the model', async () => {
  const result = await invoke({ question: 'What is the capital of France?' });
  assert.equal(result.called, 0);
  assert.equal(result.body.offTopic, true);
  assert.equal(result.body.answer, config.offTopic);
});
test('follow-up retrieval keeps the previously named project', () => {
  const facts = retrieve('Why did he make that decision?', [{ role: 'user', content: 'Tell me about TrialBridge' }]);
  assert.ok(facts.some((fact) => fact.project === 'trialbridge'));
  assert.ok(retrieve('How I work').some((fact) => fact.tags.includes('process')));
});
test('invalid citation IDs cannot create evidence links', () => {
  assert.throws(() => groundedResult(raw(['nonexistent']), knowledge, false, 'test'), /INVALID_RESPONSE/);
});
test('provider insufficiency always uses the exact canonical answer', async () => {
  const result = await invoke({ question: 'Healthcare experience?' }, { reply: () => raw([], { insufficientEvidence: true, answer: 'Invented no experience claim' }) });
  assert.equal(result.body.answer, config.insufficient);
});
test('JD omitted hard requirements are surfaced instead of inflating Strong fit', () => {
  const result = groundedResult(raw(['trial-overview'], { requirements: [{ text: 'healthcare', factIds: ['trial-overview'] }] }), knowledge, true, 'Senior designer for healthcare. Requires Figma and 8 years.');
  assert.notEqual(result.matchLevel, 'Strong');
  assert.ok(result.potentialGaps.some((gap) => /Senior/i.test(gap.requirement)));
});
test('JD requirements must be actual excerpts, not model-invented requirements', () => {
  assert.throws(() => groundedResult(raw(['trial-overview'], { requirements: [{ text: 'Invented requirement', factIds: [] }] }), knowledge, true, jd), /INVALID_RESPONSE/);
});
test('invalid inputs, attachments, overlong inputs, and malformed JSON fail safely', async () => {
  for (const body of [{ question: '' }, { question: 'x'.repeat(1501) }, { question: ['hello'] }, { question: 'hello', file: 'attachment.pdf' }, '{broken']) assert.equal((await invoke(body)).code, 400);
  assert.equal((await invoke({ jobDescription: 'x'.repeat(12001) }, { jdMode: true })).code, 400);
});
test('method, content type, origin, and rate-limit protections are enforced', async () => {
  assert.equal((await invoke({}, { method: 'GET' })).code, 405);
  assert.equal((await invoke({}, { headers: { 'content-type': 'multipart/form-data' } })).code, 415);
  assert.equal((await invoke({}, { headers: { origin: 'https://other.test' } })).code, 403);
  const result = await invoke({ question: 'healthcare' }, { rateLimit: true });
  assert.equal(result.code, 429);
  assert.equal(result.headers['Retry-After'], '60');
});
test('Gemini quota failure returns friendly fallback links rather than invented answers', async () => {
  const result = await invoke({ question: 'Healthcare experience?' }, { error: true });
  assert.equal(result.code, 503);
  assert.equal(result.body.error, config.unavailable);
  assert.ok(result.body.evidence.length);
  assert.equal(result.events[0].outcome, 'provider_failure');
});
test('Gemini request includes only selected evidence, uses server key and structured output', async () => {
  const oldFetch = global.fetch; const oldKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'test-only-server-credential';
  try {
    global.fetch = async (url, options) => {
      assert.ok(!url.includes(process.env.GEMINI_API_KEY));
      assert.equal(options.headers['x-goog-api-key'], process.env.GEMINI_API_KEY);
      const payload = JSON.parse(options.body);
      assert.ok(!JSON.stringify(payload).includes(process.env.GEMINI_API_KEY));
      const data = JSON.parse(payload.contents[0].parts[0].text);
      assert.equal(data.evidence.length, 1);
      assert.ok(!JSON.stringify(data).includes('Mindle'));
      assert.equal(payload.generationConfig.responseMimeType, 'application/json');
      return { ok: true, json: async () => ({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(raw(['trial-overview'])) }] } }] }) };
    };
    await generate({ question: 'Healthcare?', history: [], facts: [knowledge[0]], jdMode: false });
    global.fetch = async () => ({ ok: false, status: 429 });
    await assert.rejects(generate({ question: 'Healthcare?', history: [], facts: [knowledge[0]], jdMode: false }), /QUOTA/);
  } finally { global.fetch = oldFetch; if (oldKey === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = oldKey; }
});
test('analytics never stores the pasted JD in the log fallback', async () => {
  const oldLog = console.info; const oldEnabled = process.env.ANALYTICS_ENABLED; const oldURL = process.env.SUPABASE_URL;
  let logged;
  console.info = (value) => { logged = JSON.parse(value); };
  delete process.env.SUPABASE_URL; process.env.ANALYTICS_ENABLED = 'true';
  try {
    await track({ sessionId: id, question: jd, category: 'jd_match', facts: [knowledge[0]], outcome: 'answered', jdMode: true });
    assert.equal(logged.question, null);
    assert.ok(!JSON.stringify(logged).includes('5 years'));
    assert.equal(logged.session_id, id);
    assert.equal(logged.jd_mode, true);
  } finally { console.info = oldLog; if (oldURL === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = oldURL; if (oldEnabled === undefined) delete process.env.ANALYTICS_ENABLED; else process.env.ANALYTICS_ENABLED = oldEnabled; }
});
test('all evidence routes and source pages exist; browser bundle contains no server configuration', () => {
  for (const fact of knowledge) {
    assert.ok(fs.existsSync(fact.source));
    const slug = fact.url.slice(1);
    assert.ok(fs.readFileSync(fact.source, 'utf8').includes(`data-page-view="${slug}"`));
  }
  assert.doesNotMatch(fs.readFileSync('js/portfolio-assistant.js', 'utf8'), /GEMINI_API_KEY|SUPABASE_SERVICE_ROLE_KEY|generativelanguage.googleapis/);
});


test('local HTTP server serves UI and API and blocks private files', async (t) => {
  const server = require('../scripts/dev-server');
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const page = await fetch(base);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /js\/portfolio-assistant.js/);
  for (const file of ['/server/config.js', '/.env.local', '/supabase/portfolio-assistant.sql', '/tests/portfolio-assistant.test.js', '/css/%2e%2e/server/config.js']) assert.equal((await fetch(base + file)).status, 404);
  const response = await fetch(base + '/api/portfolio-chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: 'Has Dhrumil managed a team of 20 designers?' }) });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).answer, config.insufficient);
  assert.equal((await fetch(base + '/api/portfolio-jd-match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bad' })).status, 400);
});


test('JD can use verified requirement citations without redundant summary fact IDs', () => {
  const result = groundedResult(raw([], { requirements: [
    { text: 'healthcare', factIds: ['trial-overview'] },
    { text: '5 years', factIds: [] }
  ] }), knowledge, true, 'Product designer for healthcare. Requires 5 years.');
  assert.equal(result.insufficientEvidence, false);
  assert.equal(result.matchLevel, 'Moderate');
  assert.ok(result.relevantProjects.length);
});
