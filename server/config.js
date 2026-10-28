module.exports = {
  model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
  maxQuestion: 2000,
  maxJD: 20000,
  maxBodyBytes: 40000,
  maxFacts: 8,
  timeoutMs: 18000,
  maxOutputTokens: 1600,
  rateWindowMs: 60000,
  rateLimit: 12,
  insufficient: 'I don’t have enough portfolio evidence to answer that confidently.'
};
