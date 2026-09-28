const pages = [...document.querySelectorAll("[data-page-view]")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const routedControls = [...document.querySelectorAll("[data-page]")];
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

function showPage(pageName, scrollTargetId = "") {
  const target = pages.find((page) => page.dataset.pageView === pageName);
  const nextPage = target ? pageName : "home";

  pages.forEach((page) => {
    page.classList.toggle("is-visible", page.dataset.pageView === nextPage);
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.page === nextPage && !link.dataset.scrollTarget);
  });

  if (nav) {
    nav.classList.remove("is-open");
  }

  const nextHash = scrollTargetId || nextPage;
  if (location.hash.slice(1) !== nextHash) {
    history.replaceState(null, "", `#${nextHash}`);
  }

  requestAnimationFrame(() => {
    const scrollTarget = scrollTargetId ? document.getElementById(scrollTargetId) : null;
    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: "auto", block: "start" });
      initBackToTopObserver();
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    initBackToTopObserver();
  });
}

routedControls.forEach((control) => {
  control.addEventListener("click", (event) => {
    const pageName = control.dataset.page;
    if (!pageName) {
      return;
    }

    event.preventDefault();
    showPage(pageName, control.dataset.scrollTarget || "");
  });
});

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
}

window.addEventListener("hashchange", () => {
  const hash = location.hash.slice(1) || "home";
  const homeAnchor = hash === "about" || hash === "about-home" ? hash.replace("about-home", "about") : "";
  showPage(homeAnchor ? "home" : hash, homeAnchor);
});

const initialHash = location.hash.slice(1) || "home";
const initialHomeAnchor = initialHash === "about" || initialHash === "about-home" ? initialHash.replace("about-home", "about") : "";
showPage(initialHomeAnchor ? "home" : initialHash, initialHomeAnchor);

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

setInterval(() => {
  renderSlide(currentSlide + 1);
}, 7000);

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

const backToTopButton = document.querySelector(".back-to-top");
let backToTopObserver = null;

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

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  });
}

initBackToTopObserver();

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
