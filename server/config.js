const integer = (name, fallback, min = 1, max = 1000000) => {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value >= min && value <= max ? value : fallback;
};
module.exports = {
  model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
  maxQuestion: 1500,
  maxJD: 12000,
  maxBodyBytes: 60000,
  maxFacts: 8,
  timeoutMs: 18000,
  maxOutputTokens: 1200,
  limits: {
    minute: integer('PORTFOLIO_AI_REQUESTS_PER_MINUTE', 5),
    hour: integer('PORTFOLIO_AI_REQUESTS_PER_HOUR', 30),
    chatDay: integer('PORTFOLIO_AI_CHAT_DAILY_LIMIT', 20),
    jdDay: integer('PORTFOLIO_AI_JD_DAILY_LIMIT', 3),
    daily: integer('PORTFOLIO_AI_DAILY_LIMIT', 100, 0),
    warningPercent: integer('PORTFOLIO_AI_WARNING_PERCENT', 90, 1, 100),
    attemptsMinute: integer('PORTFOLIO_AI_ATTEMPTS_PER_MINUTE', 30),
    attemptsHour: integer('PORTFOLIO_AI_ATTEMPTS_PER_HOUR', 120),
    duplicateMs: integer('PORTFOLIO_AI_DUPLICATE_WINDOW_SECONDS', 30, 25, 300) * 1000,
    cacheMs: integer('PORTFOLIO_AI_CACHE_TTL_SECONDS', 3600, 1, 86400) * 1000
  },
  offTopic: 'I can only answer questions about Dhrumil’s work, experience, projects, process, or job fit.',
  unavailable: 'The portfolio assistant is temporarily unavailable. You can still explore the portfolio directly.',
  insufficient: 'I don’t have enough portfolio evidence to answer that confidently.'
};
