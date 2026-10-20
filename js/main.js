/* ==========================================================================
   Toko — Portfolio interactions
   Navigation, gallery filters, lightbox, scroll reveal
   ========================================================================== */

(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     CONFIGURATION — the single place to update Toko's Telegram username.
     (The links in index.html also contain the same username as a no-JS
     fallback; see README.md if you change it.)
     ---------------------------------------------------------------------- */
  var TELEGRAM_USERNAME = "toko18"; // ← change this, e.g. "your_new_username"

  var TELEGRAM_URL = "https://t.me/" + TELEGRAM_USERNAME;

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------------
     Telegram links
     ---------------------------------------------------------------------- */
  function initTelegramLinks() {
    document.querySelectorAll("[data-telegram-link]").forEach(function (link) {
      link.href = TELEGRAM_URL;
    });
    document.querySelectorAll("[data-telegram-username]").forEach(function (el) {
      el.textContent = "@" + TELEGRAM_USERNAME;
    });
  }

  /* ----------------------------------------------------------------------
     Header: scrolled state + mobile menu
     ---------------------------------------------------------------------- */
  function initHeader() {
    var header = document.getElementById("site-header");
    var toggle = document.getElementById("nav-toggle");
    var menu = document.getElementById("nav-menu");
    if (!header || !toggle || !menu) return;

    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var setMenuOpen = function (open) {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    };

    toggle.addEventListener("click", function () {
      setMenuOpen(!menu.classList.contains("is-open"));
    });

    // Close the menu when a link inside it is chosen
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });

    // Close on Escape
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    // Close when clicking outside the menu
    document.addEventListener("click", function (event) {
      if (
        menu.classList.contains("is-open") &&
        !menu.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    });

    // Close if the viewport grows past the mobile breakpoint
    var desktopQuery = window.matchMedia("(min-width: 761px)");
    var onViewportChange = function (event) {
      if (event.matches) setMenuOpen(false);
    };
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", onViewportChange);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(onViewportChange);
    }
  }

  /* ----------------------------------------------------------------------
     Smooth scrolling with fixed-header offset + scroll spy
     ---------------------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var hash = link.getAttribute("href");
        if (!hash || hash === "#") return;
        var target = document.querySelector(hash);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
        history.replaceState(null, "", hash);

        // Move keyboard focus to the target for accessibility
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
  }

  function initScrollSpy() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.nav__link[href^="#"]')
    );
    if (!links.length || !("IntersectionObserver" in window)) return;

    var sections = links
      .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
      })
      .filter(Boolean);

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            var active = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("is-active", active);
            if (active) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ----------------------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------------------- */
  function initReveal() {
    var elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    // Gentle stagger for siblings that arrive together (e.g. gallery cards)
    elements.forEach(function (el) {
      var parent = el.parentElement;
      if (!parent) return;
      var siblings = parent.querySelectorAll(":scope > .reveal");
      if (siblings.length > 1) {
        var index = Array.prototype.indexOf.call(siblings, el);
        el.style.setProperty("--reveal-delay", Math.min(index, 8) * 60 + "ms");
      }
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------------------
     Gallery filters
     ---------------------------------------------------------------------- */
  var galleryCards = [];
  var visibleCards = [];

  function initGalleryFilters() {
    var buttons = document.querySelectorAll(".filter-btn");
    var status = document.getElementById("gallery-status");
    galleryCards = Array.prototype.slice.call(
      document.querySelectorAll(".gallery-card")
    );
    visibleCards = galleryCards.slice();
    if (!buttons.length || !galleryCards.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.dataset.filter;

        buttons.forEach(function (other) {
          var active = other === button;
          other.classList.toggle("is-active", active);
          other.setAttribute("aria-pressed", String(active));
        });

        visibleCards = [];
        galleryCards.forEach(function (card) {
          var show = filter === "all" || card.dataset.category === filter;
          card.hidden = !show;
          if (show) visibleCards.push(card);
        });

        if (status) {
          status.textContent =
            "Showing " + visibleCards.length + " " + button.textContent.trim() + " artworks.";
        }
      });
    });
  }

  /* ----------------------------------------------------------------------
     Lightbox
     ---------------------------------------------------------------------- */
  function initLightbox() {
    var lightbox = document.getElementById("lightbox");
    var imgEl = document.getElementById("lightbox-img");
    var titleEl = document.getElementById("lightbox-title");
    var categoryEl = document.getElementById("lightbox-category");
    var counterEl = document.getElementById("lightbox-counter");
    var prevBtn = document.getElementById("lightbox-prev");
    var nextBtn = document.getElementById("lightbox-next");
    if (!lightbox || !imgEl) return;

    var currentIndex = 0;
    var lastFocused = null;

    var render = function () {
      var card = visibleCards[currentIndex];
      if (!card) return;

      var thumb = card.querySelector("img");
      var btn = card.querySelector(".gallery-card__btn");

      imgEl.src = thumb.currentSrc || thumb.src;
      imgEl.alt = thumb.alt;
      titleEl.textContent = btn.dataset.title || "";
      categoryEl.textContent = btn.dataset.categoryLabel || "";
      counterEl.textContent = currentIndex + 1 + " / " + visibleCards.length;

      // Preload the neighbours for instant navigation
      [currentIndex + 1, currentIndex - 1].forEach(function (index) {
        var neighbour = visibleCards[(index + visibleCards.length) % visibleCards.length];
        if (!neighbour) return;
        var preload = new Image();
        preload.src = neighbour.querySelector("img").src;
      });
    };

    var open = function (index) {
      if (!visibleCards.length) return;
      currentIndex = index;
      lastFocused = document.activeElement;
      lightbox.hidden = false;
      // Force a reflow so the entrance animation plays
      void lightbox.offsetHeight;
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      render();
      lightbox.querySelector(".lightbox__close").focus();
    };

    var close = function () {
      lightbox.classList.remove("is-open");
      lightbox.hidden = true;
      document.body.style.overflow = "";
      imgEl.removeAttribute("src");
      if (lastFocused) lastFocused.focus();
    };

    var step = function (direction) {
      currentIndex =
        (currentIndex + direction + visibleCards.length) % visibleCards.length;
      render();
    };

    // Open from any gallery card
    galleryCards.forEach(function (card) {
      var btn = card.querySelector(".gallery-card__btn");
      btn.addEventListener("click", function () {
        open(visibleCards.indexOf(card));
      });
    });

    lightbox.querySelectorAll("[data-lightbox-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });
    prevBtn.addEventListener("click", function () {
      step(-1);
    });
    nextBtn.addEventListener("click", function () {
      step(1);
    });

    document.addEventListener("keydown", function (event) {
      if (lightbox.hidden) return;

      switch (event.key) {
        case "Escape":
          close();
          break;
        case "ArrowLeft":
          step(-1);
          break;
        case "ArrowRight":
          step(1);
          break;
        case "Home":
          currentIndex = 0;
          render();
          break;
        case "End":
          currentIndex = visibleCards.length - 1;
          render();
          break;
        case "Tab": {
          // Keep keyboard focus inside the dialog
          var focusables = lightbox.querySelectorAll("button");
          var first = focusables[0];
          var last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
          break;
        }
      }
    });

    // Swipe support on touch devices
    var touchStartX = null;
    lightbox.addEventListener(
      "touchstart",
      function (event) {
        touchStartX = event.changedTouches[0].screenX;
      },
      { passive: true }
    );
    lightbox.addEventListener(
      "touchend",
      function (event) {
        if (touchStartX === null) return;
        var delta = event.changedTouches[0].screenX - touchStartX;
        if (Math.abs(delta) > 55) step(delta > 0 ? -1 : 1);
        touchStartX = null;
      },
      { passive: true }
    );
  }

  /* ----------------------------------------------------------------------
     Performance: pause the animated neon backdrop when the tab is hidden.
     The backdrop blur sits on a fixed layer, so not compositing it while
     the page is in the background keeps idle GPU/CPU cost near zero.
     ---------------------------------------------------------------------- */
  function initPerf() {
    if (!document.hidden) return;

    var setPaused = function (paused) {
      document.documentElement.classList.toggle("is-paused", paused);
    };

    setPaused(true);
    document.addEventListener("visibilitychange", function () {
      setPaused(document.hidden);
    });
  }

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  function initYear() {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* ----------------------------------------------------------------------
     Boot
     ---------------------------------------------------------------------- */
  function init() {
    initTelegramLinks();
    initHeader();
    initSmoothScroll();
    initScrollSpy();
    initReveal();
    initGalleryFilters();
    initLightbox();
    initPerf();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
