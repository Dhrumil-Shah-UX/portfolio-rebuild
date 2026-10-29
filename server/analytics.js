// Never log a pasted JD, IP address, provider response, or credential.
async function track(event) {
  if (process.env.ANALYTICS_ENABLED === 'false') return;
  const row = { session_id: event.sessionId, timestamp: new Date().toISOString(), question: null, request_type: event.requestType || (event.jdMode ? 'jd' : 'chat'), category: event.category, retrieved_projects: [...new Set(event.facts.map((fact) => fact.project))], outcome: event.outcome, jd_mode: event.jdMode };
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) { console.info(JSON.stringify({ event: 'portfolio_assistant', ...row })); return; }
  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/portfolio_assistant_events`, { method: 'POST', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(row), signal: AbortSignal.timeout(2000) });
    if (!response.ok) console.warn('Portfolio analytics persistence unavailable.');
  } catch { console.warn('Portfolio analytics persistence unavailable.'); }
}
module.exports = { track };
