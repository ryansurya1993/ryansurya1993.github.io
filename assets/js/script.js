(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = "rs-theme";

  /* ---------- Theme toggle ---------- */

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
  }

  function initTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch (e) {
      /* localStorage unavailable — fall back to system preference */
    }

    if (stored) {
      applyTheme(stored);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      applyTheme("light");
    }
  }

  function initThemeToggle() {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var isLight = root.getAttribute("data-theme") === "light";
      var next = isLight ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        /* ignore persistence failures */
      }
    });
  }

  /* ---------- Mobile nav ---------- */

  function initMobileNav() {
    var sidebar = document.getElementById("sidebar");
    var toggle = document.getElementById("navToggle");
    var scrim = document.getElementById("navScrim");
    if (!sidebar || !toggle) return;

    function closeNav() {
      sidebar.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      if (scrim) scrim.style.display = "none";
    }

    function openNav() {
      sidebar.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      if (scrim) scrim.style.display = "block";
    }

    toggle.addEventListener("click", function () {
      var isOpen = sidebar.classList.contains("nav-open");
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (scrim) {
      scrim.addEventListener("click", closeNav);
    }

    var navLinks = sidebar.querySelectorAll(".nav-link");
    navLinks.forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    var mq = window.matchMedia("(min-width: 861px)");
    mq.addEventListener("change", function (e) {
      if (e.matches) closeNav();
    });
  }

  /* ---------- Scroll-spy active nav link ---------- */

  function initScrollSpy() {
    var sections = document.querySelectorAll(".section[id]");
    var navLinks = document.querySelectorAll(".nav-link");
    if (!sections.length || !navLinks.length) return;

    var linkByHash = {};
    navLinks.forEach(function (link) {
      linkByHash[link.getAttribute("href")] = link;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var hash = "#" + entry.target.id;
          var link = linkByHash[hash];
          if (!link) return;

          if (entry.isIntersecting) {
            navLinks.forEach(function (l) {
              l.classList.remove("active");
            });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ---------- Reveal on scroll ---------- */

  function initReveal() {
    var sections = document.querySelectorAll(".section");
    if (!sections.length) return;

    if (!("IntersectionObserver" in window)) {
      sections.forEach(function (s) {
        s.classList.add("in-view");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ---------- Copy email ---------- */

  function initCopyEmail() {
    var btn = document.getElementById("copyEmailBtn");
    var label = document.getElementById("copyEmailLabel");
    if (!btn || !label) return;

    var email = btn.getAttribute("data-email");
    var originalLabel = label.textContent;
    var resetTimer = null;

    btn.addEventListener("click", function () {
      function showCopied() {
        label.textContent = "Copied!";
        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          label.textContent = originalLabel;
        }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showCopied, function () {
          window.location.href = "mailto:" + email;
        });
      } else {
        window.location.href = "mailto:" + email;
      }
    });
  }

  /* ---------- Footer year ---------- */

  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Init ---------- */

  initTheme();

  document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();
    initMobileNav();
    initScrollSpy();
    initReveal();
    initCopyEmail();
    initYear();
  });
})();
