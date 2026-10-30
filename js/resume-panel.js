(function () {
  const sourceId = '1yRVfSXOwIiojgWTzY-lU1nko6k3m3KHi';
  const dialog = document.createElement('dialog');
  dialog.className = 'resume-panel';
  dialog.setAttribute('aria-labelledby', 'resume-title');
  document.body.append(dialog);
  let trigger;
  let loading;
  let closing;
  let previousOverflow;
  function close() {
    if (!dialog.open || closing) return;
    dialog.classList.remove('is-open');
    closing = setTimeout(() => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger && trigger.isConnected) trigger.focus();
      closing = null;
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260);
  }
  document.addEventListener('click', async (event) => {
    const link = event.target.closest('a');
    if (!link || !link.href.includes(sourceId) || link.hasAttribute('data-original-resume') || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    trigger = link;
    if (!loading) loading = fetch('pages/resume-panel.html').then(response => {
      if (!response.ok) throw new Error('Resume unavailable');
      return response.text();
    }).catch(error => { loading = null; throw error; });
    try {
      const html = await loading;
      if (dialog.open) return;
      dialog.innerHTML = html;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      dialog.scrollTop = 0;
      requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('is-open')));
    } catch {
      window.location.assign(link.href);
    }
  });
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('click', event => {
    if (event.target.closest('[data-close-resume]')) close();
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
    }
  });
})();
