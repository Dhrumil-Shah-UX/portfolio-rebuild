const { createHash, createHmac } = require('node:crypto');
const config = require('./config');
const MINUTE = 60000, HOUR = 3600000, DAY = 86400000;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const normalize = (text) => text.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
function identity(req, sessionId) {
  const secret = process.env.PORTFOLIO_AI_IDENTITY_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'local-development-only';
  const hash = (value) => createHmac('sha256', secret).update(value).digest('hex');
  // Vercel overwrites x-forwarded-for. In local development do not trust that header.
  const ip = process.env.VERCEL ? String(req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim() : req.socket?.remoteAddress || 'local';
  return { ip: hash(`ip:${ip}`), session: hash(`session:${sessionId}`) };
}
function requestHash(question, history, jdMode) {
  return createHash('sha256').update(JSON.stringify({ mode: jdMode ? 'jd' : 'chat', question: normalize(question), history })).digest('hex');
}
function createMemoryStore({ now = Date.now, maxKeys = 10000 } = {}) {
  const events = new Map(), claims = new Map();
  return {
    async reserve({ rules = [], claims: wanted = [] }) {
      const time = now();
      for (const [key, values] of events) {
        const recent = values.filter((stamp) => stamp > time - DAY);
        if (recent.length) events.set(key, recent); else events.delete(key);
      }
      for (const [key, expires] of claims) if (expires <= time) claims.delete(key);
      if (events.size + claims.size + rules.length + wanted.length > maxKeys) throw new Error('GUARD_UNAVAILABLE');
      for (const claim of wanted) if (claims.has(claim.key)) return { allowed: false, reason: 'duplicate', retryAfter: Math.max(1, Math.ceil((claims.get(claim.key) - time) / 1000)) };
      const remaining = {}, resets = {};
      for (const rule of rules) {
        const recent = (events.get(rule.key) || []).filter((stamp) => stamp > time - rule.window);
        const amount = rule.amount ?? 1;
        if (amount && recent.length + amount > rule.limit) return { allowed: false, reason: rule.reason, retryAfter: Math.max(1, Math.ceil(((recent[0] || time) + rule.window - time) / 1000)) };
        remaining[rule.key] = Math.max(0, rule.limit - recent.length - amount);
        resets[rule.key] = recent.length ? recent[0] + rule.window : time + rule.window;
      }
      for (const rule of rules) if ((rule.amount ?? 1) > 0) {
        const list = events.get(rule.key) || [];
        for (let i = 0; i < (rule.amount ?? 1); i++) list.push(time);
        events.set(rule.key, list);
      }
      for (const claim of wanted) claims.set(claim.key, time + claim.ttl);
      return { allowed: true, remaining, resets };
    }
  };
}
function createSupabaseStore() {
  return {
    async reserve(input) {
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const response = await fetch(`${process.env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/rpc/portfolio_ai_reserve`, {
        method: 'POST', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_rules: input.rules || [], p_claims: input.claims || [] }), signal: AbortSignal.timeout(2500)
      });
      if (!response.ok) throw new Error('GUARD_UNAVAILABLE');
      const result = await response.json();
      if (!result || typeof result.allowed !== 'boolean') throw new Error('GUARD_UNAVAILABLE');
      return result;
    }
  };
}
const memory = createMemoryStore();
function defaultStore() {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return createSupabaseStore();
  return memory;
}
function createProtection({ store, limits = config.limits, now = Date.now } = {}) {
  const getStore = () => store || defaultStore();
  const quotaKeys = (id) => ({ chat: `browser:chat:${id.session}`, jd: `browser:jd:${id.session}` });
  const rates = (id, prefix, minute, hour, reason) => ['ip', 'session'].flatMap((kind) => [
    { key: `${prefix}:minute:${kind}:${id[kind]}`, limit: minute, window: MINUTE, reason },
    { key: `${prefix}:hour:${kind}:${id[kind]}`, limit: hour, window: HOUR, reason }
  ]);
  return {
    attempts(id) { return getStore().reserve({ rules: rates(id, 'attempt', limits.attemptsMinute, limits.attemptsHour, 'rate_limited') }); },
    async usage(id, fingerprint, jdMode) {
      const keys = quotaKeys(id);
      const result = await getStore().reserve({ rules: [
        { key: keys.chat, limit: limits.chatDay, window: DAY, amount: jdMode ? 0 : 1, reason: 'browser_chat_limit' },
        { key: keys.jd, limit: limits.jdDay, window: DAY, amount: jdMode ? 1 : 0, reason: 'browser_jd_limit' }
      ], claims: ['ip', 'session'].map((kind) => ({ key: `duplicate:${kind}:${id[kind]}:${fingerprint}`, ttl: limits.duplicateMs })) });
      if (result.allowed) result.usage = {
        chat: { limit: limits.chatDay, remaining: result.remaining[keys.chat], resetAt: result.resets[keys.chat] },
        jd: { limit: limits.jdDay, remaining: result.remaining[keys.jd], resetAt: result.resets[keys.jd] }
      };
      return result;
    },
    async gemini(id) {
      // Local counters can serve local development, but cannot enforce a ceiling
      // across Vercel instances. Pause paid/provider work until shared storage works.
      if (!store && (process.env.VERCEL || process.env.NODE_ENV === 'production') && !(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)) throw new Error('GUARD_UNAVAILABLE');
      const day = new Date(now()).toISOString().slice(0, 10);
      const key = `global:${day}`;
      const result = await getStore().reserve({ rules: [...rates(id, 'gemini', limits.minute, limits.hour, 'rate_limited'), { key, limit: limits.daily, window: DAY, reason: 'global_limit' }] });
      if (!result.allowed && result.reason === 'global_limit') result.retryAfter = Math.max(1, Math.ceil((Date.parse(`${day}T00:00:00Z`) + DAY - now()) / 1000));
      if (result.allowed && limits.daily && limits.daily - result.remaining[key] === Math.ceil(limits.daily * limits.warningPercent / 100)) console.warn('Portfolio assistant daily safety warning threshold reached.');
      return result;
    }
  };
}
module.exports = { createMemoryStore, createSupabaseStore, createProtection, identity, requestHash, normalize, uuid };
