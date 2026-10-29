/* Anonymous allowance only: no prompts, answers, or pasted descriptions persist. */
(function (root) {
  const DAY = 86400000;
  const KEY = 'portfolio-assistant-usage-v1';
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  function createUsage({ storage, now = Date.now, newId = () => root.crypto.randomUUID() } = {}) {
    let memory;
    const read = () => {
      let data;
      try { data = JSON.parse(storage?.getItem(KEY) || 'null'); } catch { /* Private mode / storage unavailable. */ }
      data = data && typeof data === 'object' ? data : memory || {};
      if (!uuid.test(data.sessionId || '')) data.sessionId = newId();
      for (const mode of ['chat', 'jd']) data[mode] = (Array.isArray(data[mode]) ? data[mode] : []).filter((item) => item && Number.isFinite(item.at) && item.at > now() - DAY && item.at <= now()).slice(-1000);
      data.server = data.server && typeof data.server === 'object' ? data.server : {};
      memory = data;
      return data;
    };
    const save = (data) => { memory = data; try { storage?.setItem(KEY, JSON.stringify(data)); } catch { /* In-memory session fallback. */ } };
    const get = (mode, data = read()) => {
      const snapshot = data.server[mode];
      const limit = Number.isInteger(snapshot?.limit) && snapshot.limit > 0 ? snapshot.limit : mode === 'jd' ? 3 : 20;
      const local = Math.max(0, limit - data[mode].length);
      const remote = Number.isFinite(snapshot?.resetAt) && snapshot.resetAt > now() && Number.isInteger(snapshot.remaining) ? Math.max(0, snapshot.remaining) : limit;
      return { remaining: Math.min(local, remote), limit };
    };
    const initial = read(); save(initial);
    return {
      sessionId: initial.sessionId,
      get,
      reserve(mode) {
        const data = read();
        if (get(mode, data).remaining <= 0) return null;
        const reservation = newId(); data[mode].push({ id: reservation, at: now() }); save(data);
        return reservation;
      },
      settle(mode, reservation, response) {
        const data = read();
        if (response.usageConsumed === false) data[mode] = data[mode].filter((item) => item.id !== reservation);
        for (const kind of ['chat', 'jd']) if (response.usage?.[kind]) data.server[kind] = response.usage[kind];
        save(data);
      }
    };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { createUsage };
  else root.PortfolioAssistantUsage = { createUsage };
})(globalThis);
