/* Only the AZHARTT Accessibility case study owns these image-viewer interactions. */
(function () {
  Promise.resolve(window.portfolioPagesReady).then(() => {
    const root = document.getElementById("access-case-study");
    if (!root) return;
    const dialog = root.querySelector(".ac-modal");
    const stage = dialog.querySelector(".ac-modal-stage");
    const canvas = stage.firstElementChild;
    const image = canvas.firstElementChild;
    const caption = dialog.querySelector(".ac-modal-caption");
    let opener, oldOverflow, zoom = 1, fit = 1, generation = 0;
    const pointers = new Map();
    let gesture;
    function render() {
      image.style.width = (image.naturalWidth * fit * zoom) + "px";
      image.style.height = (image.naturalHeight * fit * zoom) + "px";
      canvas.style.width = Math.max(stage.clientWidth, image.naturalWidth * fit * zoom) + "px";
      canvas.style.height = Math.max(stage.clientHeight, image.naturalHeight * fit * zoom) + "px";
      stage.dataset.zoomed = String(zoom > 1.01);
    }
    function reset() {
      if (!image.naturalWidth) return;
      fit = Math.min(1, (stage.clientWidth - 24) / image.naturalWidth, (stage.clientHeight - 24) / image.naturalHeight);
      zoom = 1;
      render();
      stage.scrollTo(0, 0);
    }
    function zoomAt(next, x, y) {
      const before = image.getBoundingClientRect();
      const u = (x - before.left) / before.width;
      const v = (y - before.top) / before.height;
      zoom = Math.min(16, Math.max(1, next));
      render();
      const after = image.getBoundingClientRect();
      stage.scrollLeft += after.left + u * after.width - x;
      stage.scrollTop += after.top + v * after.height - y;
    }
    root.addEventListener("click", (event) => {
      const link = event.target.closest("[data-ac-image]");
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      oldOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      image.style.visibility = "hidden";
      caption.textContent = "Loading image…";
      dialog.showModal();
      stage.focus();
      const token = ++generation;
      image.alt = link.querySelector("img").alt;
      image.onload = () => {
        if (token !== generation || !dialog.open) return;
        reset();
        image.style.visibility = "visible";
        caption.textContent = link.closest("figure").querySelector("figcaption")?.textContent || image.alt;
      };
      image.onerror = () => { caption.textContent = "This image could not load. Close the viewer and open the image link in a new tab."; };
      image.src = link.href;
    });
    function close() { if (dialog.open) dialog.close(); }
    dialog.querySelector("[data-ac-close]").addEventListener("click", close);
    dialog.addEventListener("close", () => {
      generation++;
      document.body.style.overflow = oldOverflow || "";
      pointers.clear();
      gesture = null;
      stage.dataset.dragging = "false";
      if (opener?.getClientRects().length) opener.focus({ preventScroll: true });
    });
    stage.addEventListener("wheel", (event) => {
      if (!image.naturalWidth) return;
      event.preventDefault();
      zoomAt(zoom * Math.exp(-Math.max(-100, Math.min(100, event.deltaY)) * .003), event.clientX, event.clientY);
    }, { passive: false });
    stage.addEventListener("keydown", (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const rect = stage.getBoundingClientRect();
      if (["+", "=", "-", "0"].includes(event.key)) {
        event.preventDefault();
        if (event.key === "0") reset();
        else zoomAt(zoom * (event.key === "-" ? 1 / 1.25 : 1.25), rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    });
    function snapshot() {
      const p = [...pointers.values()];
      gesture = p.length > 1
        ? { distance: Math.hypot(p[0].x-p[1].x, p[0].y-p[1].y), zoom, x:(p[0].x+p[1].x)/2, y:(p[0].y+p[1].y)/2 }
        : p.length ? { x:p[0].x, y:p[0].y, left:stage.scrollLeft, top:stage.scrollTop } : null;
    }
    stage.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      pointers.set(event.pointerId, {x:event.clientX,y:event.clientY});
      stage.setPointerCapture(event.pointerId);
      stage.dataset.dragging = "true";
      snapshot();
    });
    stage.addEventListener("pointermove", (event) => {
      if (!pointers.has(event.pointerId) || !gesture) return;
      pointers.set(event.pointerId, {x:event.clientX,y:event.clientY});
      const p = [...pointers.values()];
      if (p.length > 1 && gesture.distance) {
        const x=(p[0].x+p[1].x)/2, y=(p[0].y+p[1].y)/2;
        zoomAt(gesture.zoom*Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)/gesture.distance,x,y);
        stage.scrollLeft += gesture.x-x; stage.scrollTop += gesture.y-y;
        snapshot();
      } else if (zoom > 1) {
        stage.scrollLeft=gesture.left+gesture.x-event.clientX;
        stage.scrollTop=gesture.top+gesture.y-event.clientY;
      }
    });
    function end(event) { pointers.delete(event.pointerId); snapshot(); if (!pointers.size) stage.dataset.dragging="false"; }
    stage.addEventListener("pointerup", end);
    stage.addEventListener("pointercancel", end);
    stage.addEventListener("lostpointercapture", end);
    window.addEventListener("resize", () => { if (dialog.open) reset(); });
    new MutationObserver(() => {
      if (dialog.open && document.body.dataset.currentPage !== "case-azhartt-accessibility") close();
    }).observe(document.body, { attributes:true, attributeFilter:["data-current-page"] });
  });
})();


