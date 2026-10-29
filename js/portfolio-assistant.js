/* UI only. Credentials, retrieval, grounding, and analytics live on the server. */
window.initPortfolioAssistant = function initPortfolioAssistant() {
  const entry = document.querySelector('.portfolio-ai-input');
  if (!entry || document.querySelector('.portfolio-assistant')) return;
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const resume = document.querySelector('.hero-actions a[target="_blank"]').href;
  const references = {
    trial: { name: 'TrialBridge', href: '#case-trial' },
    showroom: { name: 'Virtual Showroom', href: '#case-showroom' },
    ai: { name: 'AI Lab', href: '#ai-lab' },
    experience: { name: 'Relevant experience', href: '#about' }
  };
  const starters = [
    'What kind of designer is Dhrumil?',
    'What’s his strongest healthcare work?',
    'How does he use AI?',
    'What technical work has he done?'
  ];
  const dialog = document.createElement('dialog');
  dialog.className = 'portfolio-assistant';
  dialog.setAttribute('aria-labelledby', 'assistant-title');
  dialog.setAttribute('aria-describedby', 'assistant-description');
  dialog.innerHTML = `
    <header class="assistant-header">
      <div><h2 id="assistant-title">Ask Dhrumil’s Portfolio</h2><p id="assistant-description">Ask about my projects, experience, skills, or process.</p></div>
      <button class="assistant-close" type="button" aria-label="Close portfolio assistant">×</button>
    </header>
    <div class="assistant-scroll" tabindex="0" aria-label="Portfolio conversation">
      <section class="assistant-intro"><h3>Where would you like to start?</h3><div class="assistant-starters">${starters.map((question) => `<button type="button" data-question="${escape(question)}">${escape(question)}</button>`).join('')}</div></section>
      <div class="assistant-history"></div>
      <form class="assistant-jd" hidden>
        <label for="assistant-jd-text">Paste a job description</label>
        <textarea id="assistant-jd-text" placeholder="Paste the job description here…" required maxlength="12000" aria-describedby="assistant-jd-note assistant-jd-usage"></textarea>
        <p class="assistant-notice" id="assistant-jd-note">Text only. Your description is sent to Gemini for this comparison, but isn’t stored in portfolio analytics. Avoid confidential or personal information.</p>
        <p class="assistant-notice" id="assistant-jd-usage" aria-live="polite" hidden></p>
        <nav class="assistant-actions" data-jd-limit-links aria-label="Explore the portfolio" hidden><a class="assistant-action" href="#work" data-assistant-link>View work →</a><a class="assistant-action" href="${escape(resume)}" target="_blank" rel="noopener">View resume ↗</a></nav>
        <div class="assistant-actions"><button class="assistant-submit" type="submit">Analyze description</button><button class="assistant-action" type="button" data-cancel-jd>Back to questions</button></div>
      </form>
    </div>
    <footer class="assistant-composer">
      <form class="assistant-question-form"><label class="sr-only" for="assistant-query">Ask a question about the portfolio</label><div class="assistant-input-row"><input id="assistant-query" placeholder="Ask anything about my work…" maxlength="1500" autocomplete="off" aria-describedby="assistant-chat-usage"><button type="submit" aria-label="Send portfolio question">→</button></div></form>
      <p class="assistant-notice" data-assistant-notice>Answers use documented portfolio evidence. Anonymous usage is logged; question text isn’t stored.</p>
      <p class="assistant-notice" id="assistant-chat-usage" aria-live="polite" hidden></p>
      <p class="assistant-notice" data-jd-summary aria-live="polite" hidden></p>
      <nav class="assistant-actions" data-limit-links aria-label="Explore the portfolio" hidden><a class="assistant-action" href="#work" data-assistant-link>View work →</a><a class="assistant-action" href="${escape(resume)}" target="_blank" rel="noopener">View resume ↗</a></nav>
    </footer>
    <p class="sr-only" role="status" aria-live="polite" data-assistant-status></p>`;
  document.body.append(dialog);
  const scroll = dialog.querySelector('.assistant-scroll');
  const intro = dialog.querySelector('.assistant-intro');
  const log = dialog.querySelector('.assistant-history');
  const jdForm = dialog.querySelector('.assistant-jd');
  const composer = dialog.querySelector('.assistant-question-form');
  const input = dialog.querySelector('#assistant-query');
  const jdInput = dialog.querySelector('textarea');
  const status = dialog.querySelector('[data-assistant-status]');
  const history = [];
  let opener;
  let busy = false;
  let storage;
  try { storage = localStorage; } catch { /* The allowance has an in-memory fallback. */ }
  const allowance = window.PortfolioAssistantUsage.createUsage({ storage });
  const sessionId = allowance.sessionId;
  let allowanceTimer;
  entry.querySelector('input').maxLength = 1500;

  function projectReferences(keys, title = 'Relevant work') {
    return `<nav class="assistant-references" aria-label="${title}"><h4>${title}</h4>${keys.map((key) => `<a href="${references[key].href}" data-assistant-link>${references[key].name}<span aria-hidden="true">→</span></a>`).join('')}</nav>`;
  }

  function renderEvidence(evidence = [], title = 'Relevant work') {
    const safe = evidence.filter((item) => typeof item.url === 'string' && /^#(?:case-[a-z-]+|about|ai-lab)$/.test(item.url));
    if (!safe.length) return '';
    return `<nav class="assistant-references" aria-label="${escape(title)}"><h4>${escape(title)}</h4>${safe.map((item) => `<a href="${escape(item.url)}" data-assistant-link title="${escape(item.description || '')}">${escape(item.title)}<span aria-hidden="true">&rarr;</span></a>`).join('')}</nav>`;
  }

  function renderReply(reply) {
    let markup = `<p>${escape(reply.answer || reply.error || 'Please try again shortly.')}</p>`;
    if (reply.matchLevel) markup = `<h3>Match level</h3><p class="assistant-match-level">${escape(reply.matchLevel)} match</p>` + markup;
    if (reply.strongestRelevantExperience?.length) markup += `<h3>Relevant strengths</h3><ul class="assistant-strengths">${reply.strongestRelevantExperience.map((text) => `<li>${escape(text)}</li>`).join('')}</ul>`;
    markup += renderEvidence(reply.relevantProjects || reply.evidence, reply.matchLevel ? 'Relevant projects' : 'Relevant work');
    if (reply.potentialGaps?.length) markup += `<h3>Evidence to confirm</h3><ul>${reply.potentialGaps.map((gap) => `<li><strong>${escape(gap.requirement)}</strong>: ${escape(gap.explanation)}</li>`).join('')}</ul>`;
    if (reply.hasMoreDetail && reply.detail) markup += `<details><summary>Show more detail</summary><p>${escape(reply.detail)}</p>${reply.requirementsReviewed ? `<ul>${reply.requirementsReviewed.map((item) => `<li>${escape(item.requirement)}: ${item.supported ? 'Portfolio evidence found' : 'Not documented'}</li>`).join('')}</ul>` : ''}</details>`;
    if (reply.insufficientEvidence || reply.error || reply.offTopic) markup += `${projectReferences(['experience'])}<div class="assistant-actions"><a class="assistant-action" href="#work" data-assistant-link>View work &rarr;</a><a class="assistant-action" href="${escape(resume)}" target="_blank" rel="noopener">View resume &nearr;</a><button type="button" class="assistant-action" data-ask-else>Ask something else</button></div>`;
    else if (reply.suggestedFollowUps?.length) markup += `<div class="assistant-actions">${reply.suggestedFollowUps.slice(0, 2).map((question) => `<button type="button" class="assistant-action" data-question="${escape(question)}">${escape(question)}</button>`).join('')}</div>`;
    return markup;
  }

  function setBusy(value) {
    busy = value;
    log.setAttribute('aria-busy', String(value));
    updateAllowance();
    status.textContent = value ? 'Finding relevant portfolio evidence…' : 'Portfolio response added.';
    dialog.querySelector('[data-assistant-notice]').textContent = value ? 'Finding relevant portfolio evidence…' : 'Answers use documented portfolio evidence. Anonymous usage is logged; question text isn’t stored.';
  }

  function updateAllowance() {
    for (const mode of ['chat', 'jd']) {
      const { remaining } = allowance.get(mode);
      const helper = dialog.querySelector(`#assistant-${mode}-usage`);
      helper.hidden = remaining > (mode === 'jd' ? 1 : 3);
      helper.textContent = remaining === 0 ? (mode === 'jd' ? 'JD analyses are temporarily limited for this 24-hour period. You can still explore the portfolio.' : 'AI questions are temporarily limited for this 24-hour period. You can still explore the portfolio.') : `${remaining} ${mode === 'jd' ? remaining === 1 ? 'JD analysis' : 'JD analyses' : remaining === 1 ? 'AI question' : 'AI questions'} left in this 24-hour period`;
    }
    // The server can still answer curated questions when the AI allowance is spent.
    composer.querySelector('button[type="submit"]').disabled = busy;
    jdForm.querySelector('button[type="submit"]').disabled = busy || allowance.get('jd').remaining === 0;
    dialog.querySelectorAll('[data-question]').forEach((button) => { button.disabled = busy || (/job description|match me/i.test(button.dataset.question) && allowance.get('jd').remaining === 0); });
    const jdSummary = dialog.querySelector('[data-jd-summary]');
    jdSummary.textContent = dialog.querySelector('#assistant-jd-usage').textContent;
    jdSummary.hidden = allowance.get('jd').remaining > 1;
    dialog.querySelector('[data-limit-links]').hidden = allowance.get('chat').remaining > 0 && allowance.get('jd').remaining > 0;
    dialog.querySelector('[data-jd-limit-links]').hidden = allowance.get('jd').remaining > 0;
  }

  async function requestReply(endpoint, payload, label) {
    if (busy) return;
    const mode = payload.jobDescription !== undefined ? 'jd' : 'chat';
    const reservation = allowance.reserve(mode);
    if (!reservation && mode === 'jd') {
      appendTurn(label, renderReply({ error: mode === 'jd' ? 'JD analyses are temporarily limited for this 24-hour period. You can still explore the portfolio directly.' : 'AI questions are temporarily limited for this 24-hour period. You can still explore the portfolio directly.' }));
      updateAllowance();
      return false;
    }
    setBusy(true);
    intro.hidden = true;
    const context = history.slice(-4).map(({ role, content }) => ({ role, content: content.slice(0, 500) }));
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Portfolio-Session': sessionId }, body: JSON.stringify({ ...payload, sessionId, history: context }), signal: AbortSignal.timeout(30000) });
      const reply = await response.json();
      allowance.settle(mode, reservation, reply);
      if (!response.ok && !reply.error) throw new Error('Unavailable');
      appendTurn(label, renderReply(reply));
      if (response.ok && !reply.offTopic) {
        // Keep plain conversational context only. Never retain or resend the full JD.
        const contextLabel = `Portfolio projects discussed: ${(reply.evidence || []).map((item) => item.title).join(', ')}. ${label}`;
        history.push({ role: 'user', content: contextLabel }, { role: 'assistant', content: reply.answer || '' });
        if (history.length > 8) history.splice(0, history.length - 8);
      }
      return response.ok;
    } catch {
      appendTurn(label, renderReply({ error: 'The portfolio assistant is temporarily unavailable. Please try again shortly or explore the portfolio directly.' }));
      return false;
    } finally {
      setBusy(false);
      if (dialog.open && jdForm.hidden) input.focus();
    }
  }

  function appendTurn(question, answer) {
    intro.hidden = true;
    const turn = document.createElement('section');
    turn.className = 'assistant-turn';
    turn.setAttribute('aria-label', 'Question and portfolio response');
    turn.innerHTML = `<p class="assistant-question">${escape(question)}</p><div class="assistant-answer">${answer}</div>`;
    log.append(turn);
    status.textContent = 'Portfolio response added.';
    requestAnimationFrame(() => { scroll.scrollTop = scroll.scrollHeight; });
  }

  function showJd() {
    intro.hidden = true;
    jdForm.hidden = false;
    composer.hidden = true;
    updateAllowance();
    jdInput.focus();
    jdForm.scrollIntoView({ block: 'nearest' });
  }

  function ask(question) {
    if (busy) return;
    const trimmed = question.trim();
    if (!trimmed) { input.focus(); return; }
    if (trimmed.length > 1500) { appendTurn('Question too long', renderReply({ error: 'Please keep your question within 1,500 characters.' })); return; }
    if (/job description|\bjd\b|match me/.test(trimmed.toLowerCase())) { showJd(); return; }
    jdForm.hidden = true;
    composer.hidden = false;
    updateAllowance();
    input.value = '';
    input.placeholder = 'Ask a follow-up…';
    requestReply('/api/portfolio-chat', { question: trimmed }, trimmed);
  }

  function open(question = '') {
    if (!dialog.open) { opener = document.activeElement; dialog.showModal(); }
    updateAllowance();
    if (!allowanceTimer) allowanceTimer = setInterval(updateAllowance, 30000);
    if (question.trim()) ask(question);
    else input.focus();
  }
  dialog.querySelector('.assistant-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { clearInterval(allowanceTimer); allowanceTimer = null; if (opener?.isConnected) opener.focus(); });
  window.addEventListener('storage', updateAllowance);
  // Native modal dialog makes the background inert; explicit cycling covers Tab edges.
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll('button, a[href], input, textarea, summary, [tabindex="0"]')].filter((element) => element.getClientRects().length && !element.disabled);
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  dialog.addEventListener('click', (event) => {
    const question = event.target.closest('[data-question]');
    if (question) ask(question.dataset.question);
    if (event.target.closest('[data-assistant-link]')) dialog.close();
    if (event.target.closest('[data-ask-else]')) { input.focus(); }
    if (event.target.closest('[data-cancel-jd]')) {
      jdForm.hidden = true; composer.hidden = false; intro.hidden = history.length > 0; updateAllowance(); input.focus();
    }
  });
  composer.addEventListener('submit', (event) => { event.preventDefault(); ask(input.value); });
  jdForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!jdInput.value.trim()) { jdInput.setCustomValidity('Paste or type a job description first.'); jdInput.reportValidity(); return; }
    const jobDescription = jdInput.value.trim();
    if (jobDescription.length > 12000) { jdInput.setCustomValidity('Please keep the description within 12,000 characters.'); jdInput.reportValidity(); return; }
    if (busy) return;
    jdForm.hidden = true;
    composer.hidden = false;
    updateAllowance();
    input.placeholder = 'Ask a follow-up\u2026';
    requestReply('/api/portfolio-jd-match', { jobDescription }, 'Review this job description').then((success) => { if (success) jdInput.value = ''; });
  });
  jdInput.addEventListener('input', () => jdInput.setCustomValidity(''));
  entry.addEventListener('submit', (event) => { event.preventDefault(); const heroInput = entry.querySelector('input'); open(heroInput.value); heroInput.value = ''; });
  // Focusing the existing entry opens the initial workspace without changing the hero.
  entry.querySelector('input').addEventListener('click', () => open());
  document.querySelectorAll('.ai-suggestions button').forEach((button, index) => {
    button.addEventListener('click', () => open(starters[index]));
  });
  updateAllowance();
};
