const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const envFile = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);
if (!process.env.GEMINI_API_KEY) {
  console.log('SKIPPED live Gemini tests: configure GEMINI_API_KEY in .env.local or the server environment. No credential is printed.');
  process.exit(0);
}
const { createHandler } = require('../server/portfolio-api');
const config = require('../server/config');
const questions = ['What healthcare experience does Dhrumil have?', 'What did Dhrumil own in TrialBridge?', 'What technical projects has Dhrumil worked on?', 'Has Dhrumil managed a team of 20 designers?'];
async function call(jdMode, body) {
  const handler = createHandler(jdMode, { track: async () => {} });
  const req = { method: 'POST', headers: { 'content-type': 'application/json' }, body };
  const res = { setHeader() {}, status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
  await handler(req, res);
  assert.equal(res.code, 200, res.body.error || 'API failed');
  return res.body;
}
(async () => {
  for (const question of questions) {
    const reply = await call(false, { question });
    if (question.includes('20 designers')) assert.equal(reply.answer, config.insufficient);
    else { assert.equal(reply.insufficientEvidence, false); assert.ok(reply.evidence.length); }
    console.log(JSON.stringify({ question, answer: reply.answer, evidence: reply.evidence.map((item) => item.title) }));
  }
  const reply = await call(true, { jobDescription: 'Product Designer. Design healthcare patient experiences. Conduct research and physician testing. Create prototypes. Requires Figma and 5 years of experience.' });
  assert.ok(['Strong', 'Moderate', 'Partial'].includes(reply.matchLevel));
  assert.ok(!('score' in reply));
  assert.ok(reply.potentialGaps.some((gap) => /Figma|years/i.test(gap.requirement)));
  console.log(JSON.stringify({ mode: 'jd', matchLevel: reply.matchLevel, projects: reply.relevantProjects.map((item) => item.title), gaps: reply.potentialGaps }));
})().catch(() => { console.error('Live Gemini check failed. Check model availability, credentials, and quota in the server environment. No credentials are logged.'); process.exitCode = 1; });
