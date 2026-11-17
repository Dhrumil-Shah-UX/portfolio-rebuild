(() => {
  const desktop = matchMedia('(min-width: 981px) and (hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let lenis;

  function syncScroll() {
    if (!desktop.matches || reducedMotion.matches || !window.Lenis) {
      lenis?.destroy();
      lenis = null;
      return;
    }
    if (lenis) return;
    lenis = new Lenis({
      duration: 0.9,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      syncTouch: false,
      autoRaf: true,
      allowNestedScroll: true,
      prevent: node => node.matches?.('dialog, .portfolio-assistant, [role="dialog"]')
    });
  }

  desktop.addEventListener('change', syncScroll);
  reducedMotion.addEventListener('change', syncScroll);
  syncScroll();
})();
