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
  const articleSlug = pageName.startsWith("article-")
    ? pageName.replace("article-", "")
    : pageName.startsWith("writing/")
      ? pageName.replace("writing/", "")
      : "";
  const targetPageName = articleSlug ? "article" : pageName;
  const target = pages.find((page) => page.dataset.pageView === targetPageName);
  const nextPage = target ? targetPageName : "home";

  if (articleSlug) {
    renderArticle(articleSlug);
  }

  pages.forEach((page) => {
    page.classList.toggle("is-visible", page.dataset.pageView === nextPage);
  });
  const activeNavPage = nextPage === "case-perspective" ? "ai-lab" : nextPage === "article" ? "writing" : nextPage;
  document.body.dataset.currentPage = activeNavPage;

  navLinks.forEach((link) => {
    const activePage = activeNavPage;
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
          <h2>${note.title}</h2>
          <figure class="note-figure">
            <div class="note-image-shell">${noteImageMarkup(note)}</div>
          </figure>
          <p class="note-number">${index + 1}</p>
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
      <article class="article-card" data-article-card="${index}" role="link" tabindex="0">
        <div class="article-card-copy">
          <h3>${article.title}</h3>
          <p>${article.summary}</p>
          <span>${article.platform} &middot; ${article.topic}</span>
        </div>
        <div class="article-card-image">${article.image ? `<img src="${article.image}" alt="" />` : `<span>${article.platform}</span>`}</div>
      </article>
    `)
    .join("");
  list.querySelectorAll("[data-article-card]").forEach((card) => {
    const openArticle = () => {
      showPage(`writing/${articles[Number(card.dataset.articleCard)].slug}`);
    };
    card.addEventListener("click", openArticle);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openArticle();
      }
    });
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function articleBlockMarkup(block) {
  if (typeof block === "string") {
    return `<p>${escapeHtml(block)}</p>`;
  }

  if (block.type === "image") {
    const alt = escapeHtml(block.alt || "");
    const caption = block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : "";
    return `<figure class="article-figure"><img src="${escapeHtml(block.src || "")}" alt="${alt}" />${caption}</figure>`;
  }

  if (block.type === "h2") {
    return `<h2>${escapeHtml(block.text)}</h2>`;
  }

  if (block.type === "h3") {
    return `<h3>${escapeHtml(block.text)}</h3>`;
  }

  if (block.type === "blockquote") {
    return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
  }

  if (block.type === "ul" || block.type === "ol") {
    const items = (block.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    return `<${block.type}>${items}</${block.type}>`;
  }

  if (block.type === "note") {
    return `<aside class="article-source-note">${escapeHtml(block.text)}</aside>`;
  }

  return `<p>${escapeHtml(block.text || "")}</p>`;
}

function renderMoreWriting(article) {
  const list = document.querySelector("[data-more-writing]");
  if (!list) {
    return;
  }

  list.innerHTML = articles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 1)
    .map(
      (item) => `
        <a class="more-writing-link" href="#writing/${item.slug}" data-more-writing-link="${item.slug}">
          <span>${item.topic}</span>
          <strong>${item.title}</strong>
          <small>${item.summary}</small>
          <em>Read article &rarr;</em>
        </a>
      `
    )
    .join("");

  list.querySelectorAll("[data-more-writing-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showPage(`writing/${link.dataset.moreWritingLink}`);
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
  external.href = article.originalUrl || "#";
  external.toggleAttribute("aria-disabled", !article.originalUrl);
  document.querySelector("[data-article-body]").innerHTML = article.content.map(articleBlockMarkup).join("");
  renderMoreWriting(article);
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

  const workshopCards = [...document.querySelectorAll("[data-workshop]")];
  const workshopTitle = document.querySelector("[data-workshop-title]");
  if (workshopCards.length && workshopTitle) {
    const workshops = [
      {
        title: "AI for Designers",
        summary: "A grounding session for designers to understand what AI is, what it can and cannot do, and how to approach AI tools more intentionally instead of relying on trial and error.",
        role: "Co-designed and co-hosted",
        audience: "Designers, product teams, and curious builders",
        attendance: 68,
        taught: "My AI workflow across design and build, with a live demo from a ChatGPT idea to a working interaction in Cursor.",
        artifacts: "FigJam board, live demo, and workflow examples.",
        takeaways: ["Understand AI fundamentals and where its limits are.", "Build an intentional workflow instead of copying prompts.", "Explore how AI can support everyday design work."],
        visual: "assets/images/workshops/ws1.png"
      },
      {
        title: "Prompt Writing for Designers",
        summary: "Move beyond repeated prompt tweaking and learn to direct, refine, and evaluate AI outputs with more intention.",
        role: "Co-designed and co-hosted",
        audience: "Designers seeking more consistent AI workflows",
        attendance: 35,
        taught: "How designers can use sketches, prototypes, references, and data to give AI stronger context.",
        artifacts: "FigJam board, prompt refinement activity, design references, and a persona generation demo.",
        takeaways: ["Use a repeatable framework instead of endlessly rewriting prompts.", "See how context and iteration change an output.", "Evaluate when an AI result is actually useful."],
        visual: "assets/images/workshops/ws2.png"
      },
      {
        title: "The New Designer Role & Process with AI",
        summary: "Compare how designers are bringing AI into their process, and where it amplifies or interferes with their abilities.",
        role: "Co-designed and co-hosted",
        audience: "Designers and design leaders",
        attendance: 71,
        taught: "A real project timeline showing AI assisting research, prototyping, debugging, and delivery while the process stayed human-led.",
        artifacts: "FigJam workflow map, process timeline, and real project example.",
        takeaways: ["There is no single correct AI-enabled design process.", "Learn how peers are integrating AI into their work.", "Identify where AI can amplify your strengths."],
        visual: "assets/images/workshops/ws3.png"
      },
      {
        title: "AI in Ideation, Prototyping & Design Delivery",
        summary: "Move from design intent to a working prototype while preserving brand consistency, design logic, and the original vision.",
        role: "Co-designed and co-hosted",
        audience: "Designers experienced in prototyping and delivery",
        attendance: 37,
        taught: "A structured Pomodoro prototype activity with requirements, constraints, and a done checklist.",
        artifacts: "FigJam board, activity PRD, completion checklist, and participant sharing spaces.",
        takeaways: ["Prototype with AI from idea to working demo.", "Maintain brand and design consistency.", "Tell polished output apart from output that works."],
        visual: "assets/images/workshops/ws4.png"
      },
      {
        title: "AI Portfolio Playground: Mini Hackathon",
        summary: "Small groups built an AI-enhanced portfolio interaction to help visitors understand a designer’s work, thinking, or personality.",
        role: "Designed and led",
        audience: "Designers, product teams, and curious builders",
        attendance: 41,
        taught: "A mini hackathon format for ideation, rapid prototyping, sharing, and lightweight voting.",
        artifacts: "FigJam board, challenge template, working areas, prototype checklist, and participant outputs.",
        takeaways: ["Turn an AI portfolio idea into a rough prototype.", "Explore ways a portfolio can respond, guide, or surprise.", "Keep AI interactions intentional instead of generic."],
        visual: "assets/images/workshops/ws5.png"
      },
      {
        title: "Making Decisions With AI When Building Products",
        summary: "Notice when AI begins steering your thinking, and become more intentional about making your own decisions.",
        role: "Designed and led",
        audience: "Designers and builders at any AI experience level",
        attendance: 12,
        taught: "Reflection exercises to map ideation patterns and notice when AI influences or redirects a decision.",
        artifacts: "FigJam board, ideation pattern exercise, self-reflection prompt, and interactive game.",
        takeaways: ["Understand why and how you use AI to make decisions.", "Recognize when AI begins driving instead of assisting.", "Keep ownership of decisions you can explain."],
        visual: "assets/images/workshops/ws6.png"
      }
    ];
    const fields = {
      kicker: document.querySelector("[data-workshop-kicker]"),
      summary: document.querySelector("[data-workshop-summary]"),
      role: document.querySelector("[data-workshop-role]"),
      audience: document.querySelector("[data-workshop-audience]"),
      format: document.querySelector("[data-workshop-format]"),
      visual: document.querySelector("[data-workshop-visual]"),
      takeaways: [...document.querySelectorAll("[data-workshop-takeaway]")],
      taught: document.querySelector("[data-workshop-taught]"),
      artifacts: document.querySelector("[data-workshop-artifacts]")
    };
    const selectWorkshop = (index) => {
      const workshop = workshops[index];
      if (!workshop) return;
      workshopCards.forEach((card, cardIndex) => {
        const selected = cardIndex === index;
        card.classList.toggle("is-selected", selected);
        card.setAttribute("aria-pressed", String(selected));
      });
      workshopTitle.textContent = workshop.title;
      fields.kicker.textContent = `Workshop ${String(index + 1).padStart(2, "0")}`;
      fields.summary.textContent = workshop.summary;
      fields.role.textContent = workshop.role;
      fields.audience.textContent = workshop.audience;
      fields.format.textContent = `90-minute interactive virtual workshop · ${workshop.attendance} joined`;
      fields.takeaways.forEach((item, itemIndex) => { item.textContent = workshop.takeaways[itemIndex] || ""; });
      fields.taught.textContent = workshop.taught;
      fields.artifacts.textContent = workshop.artifacts;
      fields.visual.src = workshop.visual;
      fields.visual.alt = `${workshop.title} workshop visual`;
    };
    workshopCards.forEach((card) => card.addEventListener("click", () => selectWorkshop(Number(card.dataset.workshop))));
    selectWorkshop(0);
  }

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
