(function initRuhlParticles() {
  window.portfolioPagesReady.then(() => {
    const demo = document.querySelector('[data-ruhl-particles]');
    if (!demo) return;
    const button = demo.querySelector('[data-ruhl-particle-toggle]');
    const stage = demo.querySelector('.ruhl-particle-stage');
    const placeholder = stage.querySelector('[data-ruhl-particle-placeholder]');
    const stop = () => {
      stage.querySelector('iframe')?.remove();
      placeholder.hidden = false;
      button.textContent = 'Start demo';
      button.setAttribute('aria-expanded', 'false');
    };
    const start = () => {
      if (stage.querySelector('iframe')) return;
      const frame = document.createElement('iframe');
      frame.src = 'https://dhrumil-shah-ux.github.io/mep-particles/';
      frame.title = 'Original RUHL AI particle text: move your pointer over the text';
      frame.setAttribute('sandbox', 'allow-scripts');
      frame.referrerPolicy = 'no-referrer';
      frame.setAttribute('aria-describedby', 'ruhl-particle-instructions');
      placeholder.hidden = true;
      stage.append(frame);
      button.textContent = 'Stop demo';
      button.setAttribute('aria-expanded', 'true');
    };
    button.addEventListener('click', () => {
      if (stage.querySelector('iframe')) stop();
      else start();
    });
    // Unload WebGL when this routed view becomes hidden.
    const page = demo.closest('[data-page-view]');
    new MutationObserver(() => {
      if (page.classList.contains('is-visible') && !document.hidden) start();
      else stop();
    }).observe(page, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (page.classList.contains('is-visible')) start();
    });
    if (page.classList.contains('is-visible') && !document.hidden) start();
  }).catch(() => {});
})();
