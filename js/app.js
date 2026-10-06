let pages = [];
const navLinks = [...document.querySelectorAll(".nav-link")];
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
const backToTopButton = document.querySelector(".back-to-top");
let backToTopObserver = null;
let appBootstrapped = false;

let currentNoteIndex = 0;
let currentArticleIndex = 0;
let designNotesPageFlip = null;

function showPage(pageName, scrollTargetId = "") {
  const articleSlug = pageName.startsWith("article-") ? pageName.replace("article-", "") : "";
  const targetPageName = articleSlug ? "article" : pageName;
  const target = pages.find((page) => page.dataset.pageView === targetPageName);
  const nextPage = target ? targetPageName : "home";

  if (articleSlug) {
    renderArticle(articleSlug);
  }

  pages.forEach((page) => {
    page.classList.toggle("is-visible", page.dataset.pageView === nextPage);
  });
  document.body.dataset.currentPage = nextPage === "article" ? "writing" : nextPage;

  navLinks.forEach((link) => {
    const activePage = nextPage === "article" ? "writing" : nextPage;
    link.classList.toggle("is-active", link.dataset.page === activePage && !link.dataset.scrollTarget);
  });

  if (nav) {
    nav.classList.remove("is-open");
  }

  const nextHash = scrollTargetId || pageName;
  if (location.hash.slice(1) !== nextHash) {
    history.replaceState(null, "", `#${nextHash}`);
  }

  requestAnimationFrame(() => {
    const scrollTarget = scrollTargetId ? document.getElementById(scrollTargetId) : null;
    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: "auto", block: "start" });
      initBackToTopObserver();
      if (nextPage === "writing") {
        ensureVisibleNoteBook();
      }
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    initBackToTopObserver();
    if (nextPage === "writing") {
      ensureVisibleNoteBook();
    }
  });
}

function padNumber(index) {
  return String(index + 1).padStart(2, "0");
}

function noteImageMarkup(note) {
  return note.image
    ? `<img src="${note.image}" alt="" />`
    : `<span>${note.caption || "[NEEDS NOTE IMAGE]"}</span>`;
}

function noteSectionsMarkup(note) {
  return [
    ["Viewpoint", note.viewpoint],
    ["Experience", note.experience],
    ["Possible solution", note.solution]
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `<section class="note-detail"><h3>${label}</h3><p>${value}</p></section>`)
    .join("");
}

function notePageMarkup(note, index, side) {
  if (side === "left") {
    return `
      <article class="notebook-page notebook-page-left" data-note-index="${index}">
        <div class="notebook-page-content">
          <p class="note-number">${padNumber(index)} / ${designNotes.length}</p>
          <h2>${note.title}</h2>
          <figure class="note-figure">
            <div class="note-image-shell">${noteImageMarkup(note)}</div>
            <figcaption>${note.caption || ""}</figcaption>
          </figure>
        </div>
      </article>
    `;
  }

  return `
    <article class="notebook-page notebook-page-right" data-note-index="${index}">
      <div class="notebook-page-content">${noteSectionsMarkup(note)}</div>
    </article>
  `;
}

function updateNoteControls(index) {
  currentNoteIndex = Math.max(0, Math.min(index, designNotes.length - 1));
  document.querySelector("[data-note-indicator]").textContent = `${currentNoteIndex + 1} / ${designNotes.length}`;
  document.querySelector("[data-note-prev]").disabled = currentNoteIndex === 0;
  document.querySelector("[data-note-next]").disabled = currentNoteIndex === designNotes.length - 1;
}

function renderNoteBook() {
  const book = document.querySelector("[data-note-book]");
  if (!book) {
    return;
  }

  book.innerHTML = designNotes
    .map((note, index) => `${notePageMarkup(note, index, "left")}${notePageMarkup(note, index, "right")}`)
    .join("");

  const notePages = [...book.querySelectorAll(".notebook-page")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!window.St?.PageFlip || !notePages.length) {
    book.classList.add("notebook-fallback");
    updateNoteControls(0);
    return;
  }

  designNotesPageFlip = new St.PageFlip(book, {
    width: 550,
    height: 733,
    size: "stretch",
    minWidth: 300,
    maxWidth: 550,
    minHeight: 400,
    maxHeight: 733,
    drawShadow: !reducedMotion,
    flippingTime: reducedMotion ? 1 : 1000,
    usePortrait: true,
    startPage: initialWritingNoteIndex * 2,
    autoSize: true,
    maxShadowOpacity: 0.5,
    showCover: false,
    mobileScrollSupport: false,
    swipeDistance: 30,
    clickEventForward: true,
    disableFlipByClick: false
  });

  designNotesPageFlip.on("flip", (event) => {
    updateNoteControls(Math.floor(event.data / 2));
  });

  designNotesPageFlip.on("init", (event) => {
    updateNoteControls(Math.floor(event.data.page / 2));
  });

  const loadFromHTML = designNotesPageFlip.loadFromHTML || designNotesPageFlip.loadFromHtml;
  if (loadFromHTML) {
    loadFromHTML.call(designNotesPageFlip, notePages);
  }

  updateNoteControls(initialWritingNoteIndex);
}

function ensureVisibleNoteBook() {
  const writingPage = document.querySelector('[data-page-view="writing"].is-visible');
  if (!writingPage) {
    return;
  }

  if (!designNotesPageFlip) {
    renderNoteBook();
    return;
  }

  requestAnimationFrame(() => {
    designNotesPageFlip.update();
    updateNoteControls(Math.floor(designNotesPageFlip.getCurrentPageIndex() / 2));
  });
}

function selectNote(index) {
  const pageIndex = index * 2;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (designNotesPageFlip) {
    if (reducedMotion) {
      designNotesPageFlip.turnToPage(pageIndex);
      updateNoteControls(index);
    } else {
      designNotesPageFlip.flip(pageIndex, index < currentNoteIndex ? "top" : "bottom");
    }
  } else {
    updateNoteControls(index);
  }

  document.querySelector("#design-notes-viewer")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderNoteCards() {
  const list = document.querySelector("[data-note-list]");
  if (!list) {
    return;
  }

  list.innerHTML = designNotes
    .map((note, index) => `
      <button class="note-card" type="button" data-note-select="${index}">
        <span>${padNumber(index)}</span>
        <strong>${note.title}</strong>
        <small>${note.topic || ""}</small>
        <span class="note-card-thumb">${note.image ? `<img src="${note.image}" alt="" />` : "[NEEDS NOTE IMAGE]"}</span>
      </button>
    `)
    .join("");
  list.querySelectorAll("[data-note-select]").forEach((card) => {
    card.addEventListener("click", () => selectNote(Number(card.dataset.noteSelect)));
  });
}

function renderArticleCards() {
  const list = document.querySelector("[data-article-list]");
  if (!list) {
    return;
  }

  list.innerHTML = articles
    .map((article, index) => `
      <article class="article-card">
        <div class="article-card-image">${article.image ? `<img src="${article.image}" alt="" />` : "[NEEDS ARTICLE IMAGE]"}</div>
        <div>
          <span>${article.topic}</span>
          <h3>${article.title}</h3>
          <p>${article.summary}</p>
          <small>${article.platform}</small>
          <a href="#article-${article.slug}" data-article-link="${index}">Read article &rarr;</a>
        </div>
      </article>
    `)
    .join("");
  list.querySelectorAll("[data-article-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showPage(`article-${articles[Number(link.dataset.articleLink)].slug}`);
    });
  });
}

function renderArticle(slug) {
  const article = articles.find((item) => item.slug === slug) || articles[0];
  currentArticleIndex = articles.indexOf(article);
  document.querySelector("[data-article-topic]").textContent = article.topic;
  document.querySelector("[data-article-title]").textContent = article.title;
  document.querySelector("[data-article-summary]").textContent = article.summary;
  document.querySelector("[data-article-platform]").textContent = article.platform;
  const external = document.querySelector("[data-article-external]");
  external.href = article.externalUrl || "#";
  external.toggleAttribute("aria-disabled", !article.externalUrl);
  document.querySelector("[data-article-body]").innerHTML = article.content.map((paragraph) => `<p>${paragraph}</p>`).join("");
  document.querySelector("[data-article-prev]").disabled = currentArticleIndex <= 0;
  document.querySelector("[data-article-next]").disabled = currentArticleIndex >= articles.length - 1;
}

function getPageScrollAnchor() {
  const visiblePage = document.querySelector(".page.is-visible");
  if (!visiblePage) {
    return null;
  }

  return (
    visiblePage.querySelector(".case-section, .hero, .page-pad, .case-page, .section") ||
    visiblePage.firstElementChild
  );
}

function setBackToTopVisible(isVisible) {
  if (!backToTopButton) {
    return;
  }

  backToTopButton.classList.toggle("is-visible", isVisible);
  backToTopButton.setAttribute("aria-hidden", isVisible ? "false" : "true");
}

function initBackToTopObserver() {
  if (!backToTopButton) {
    return;
  }

  if (backToTopObserver) {
    backToTopObserver.disconnect();
    backToTopObserver = null;
  }

  setBackToTopVisible(false);

  const scrollAnchor = getPageScrollAnchor();
  if (!scrollAnchor) {
    return;
  }

  backToTopObserver = new IntersectionObserver(
    ([entry]) => {
      setBackToTopVisible(!entry.isIntersecting);
    },
    { threshold: 0, rootMargin: "0px 0px 0px 0px" }
  );

  backToTopObserver.observe(scrollAnchor);
}

function bootstrapApp() {
  if (appBootstrapped) {
    return;
  }
  appBootstrapped = true;

  pages = [...document.querySelectorAll("[data-page-view]")];

  [...document.querySelectorAll("[data-page]")].forEach((control) => {
    control.addEventListener("click", (event) => {
      const pageName = control.dataset.page;
      if (!pageName) {
        return;
      }

      event.preventDefault();
      showPage(pageName, control.dataset.scrollTarget || "");
    });
  });

  document.querySelector("[data-note-prev]")?.addEventListener("click", () => {
    if (currentNoteIndex > 0) {
      if (designNotesPageFlip && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        designNotesPageFlip.flipPrev("bottom");
      } else {
        selectNote(currentNoteIndex - 1);
      }
    }
  });

  document.querySelector("[data-note-next]")?.addEventListener("click", () => {
    if (currentNoteIndex < designNotes.length - 1) {
      if (designNotesPageFlip && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        designNotesPageFlip.flipNext("bottom");
      } else {
        selectNote(currentNoteIndex + 1);
      }
    }
  });

  document.querySelector("[data-article-prev]")?.addEventListener("click", () => {
    if (currentArticleIndex > 0) {
      showPage(`article-${articles[currentArticleIndex - 1].slug}`);
    }
  });

  document.querySelector("[data-article-next]")?.addEventListener("click", () => {
    if (currentArticleIndex < articles.length - 1) {
      showPage(`article-${articles[currentArticleIndex + 1].slug}`);
    }
  });

  renderNoteCards();
  renderArticleCards();

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
    });
  }

  const testimonials = [...document.querySelectorAll(".testimonial-card")];
  const slideButtons = [...document.querySelectorAll("[data-slide]")];
  let currentSlide = 0;

  function renderSlide(index) {
    if (!testimonials.length) {
      return;
    }

    currentSlide = (index + testimonials.length) % testimonials.length;
    testimonials.forEach((card, cardIndex) => {
      card.classList.toggle("is-current", cardIndex === currentSlide);
    });
  }

  slideButtons.forEach((button) => {
    button.addEventListener("click", () => {
      renderSlide(currentSlide + (button.dataset.slide === "next" ? 1 : -1));
    });
  });

  if (testimonials.length) {
    setInterval(() => {
      renderSlide(currentSlide + 1);
    }, 7000);
  }

  const form = document.querySelector(".contact-form");
  const portfolioAiForm = document.querySelector(".portfolio-ai-input");
  const portfolioAiInput = document.querySelector("#portfolio-ai-query");
  const suggestionButtons = [...document.querySelectorAll(".ai-suggestions button")];
  const caseSidebarLinks = [...document.querySelectorAll(".case-sidebar nav a")];
  const caseSections = caseSidebarLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (portfolioAiForm) {
    portfolioAiForm.addEventListener("submit", (event) => {
      event.preventDefault();
      portfolioAiInput?.focus();
    });
  }

  suggestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!portfolioAiInput) {
        return;
      }

      portfolioAiInput.value = button.textContent.trim();
      portfolioAiInput.focus();
    });
  });

  function setActiveCaseNavLink(activeLink) {
    caseSidebarLinks.forEach((sidebarLink) => {
      sidebarLink.setAttribute("aria-current", sidebarLink === activeLink ? "true" : "false");
    });
  }

  function jumpToCaseSection(href, activeLink) {
    const section = document.querySelector(href);
    if (!section) {
      return;
    }

    section.scrollIntoView({ behavior: "smooth", block: "start" });
    const navLink = activeLink || caseSidebarLinks.find((link) => link.getAttribute("href") === href);
    if (navLink) {
      setActiveCaseNavLink(navLink);
    }
  }

  caseSidebarLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      jumpToCaseSection(link.getAttribute("href"), link);
    });
  });

  document.querySelectorAll(".case-inpage-jump").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      jumpToCaseSection(link.getAttribute("href"));
    });
  });

  if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  }

  if (caseSections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        caseSidebarLinks.forEach((link) => {
          link.setAttribute("aria-current", link.getAttribute("href") === `#${visibleEntry.target.id}` ? "true" : "false");
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] }
    );

    caseSections.forEach((section) => observer.observe(section));
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const button = form.querySelector("button");
      const originalText = button.textContent;
      button.textContent = "Message ready";
      setTimeout(() => {
        button.textContent = originalText;
        form.reset();
      }, 1400);
    });
  }

  window.addEventListener("hashchange", () => {
    const hash = location.hash.slice(1) || "home";
    const homeAnchor = hash === "about" || hash === "about-home" ? hash.replace("about-home", "about") : "";
    showPage(homeAnchor ? "home" : hash, homeAnchor);
  });

  const initialHash = location.hash.slice(1) || "home";
  const initialHomeAnchor =
    initialHash === "about" || initialHash === "about-home" ? initialHash.replace("about-home", "about") : "";
  showPage(initialHomeAnchor ? "home" : initialHash, initialHomeAnchor);
}

document.addEventListener("keydown", (event) => {
  if (!document.querySelector('[data-page-view="writing"].is-visible')) {
    return;
  }

  if (event.key === "ArrowLeft" && currentNoteIndex > 0) {
    selectNote(currentNoteIndex - 1);
  }

  if (event.key === "ArrowRight" && currentNoteIndex < designNotes.length - 1) {
    selectNote(currentNoteIndex + 1);
  }
});

const pagesReady = window.portfolioPagesReady || Promise.resolve();
pagesReady.then(bootstrapApp).catch((error) => {
  console.error("Failed to load page content:", error);
});
