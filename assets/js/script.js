(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = "rs-theme";

  /* ---------- Theme toggle ---------- */

  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  function initTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch (e) {
      /* localStorage unavailable — leave theme to system preference */
    }

    if (stored === "light" || stored === "dark") {
      applyTheme(stored);
    }
  }

  function isDarkActive() {
    var attr = root.getAttribute("data-theme");
    if (attr === "dark") return true;
    if (attr === "light") return false;
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  function initThemeToggle() {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var next = isDarkActive() ? "light" : "dark";
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
    if (!sidebar || !toggle) return;

    function closeNav() {
      sidebar.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    function openNav() {
      sidebar.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function () {
      if (sidebar.classList.contains("nav-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    sidebar.querySelectorAll(".nav-link").forEach(function (link) {
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
    var sections = document.querySelectorAll(".content > section[id]");
    var navLinks = document.querySelectorAll(".nav-link");
    if (!sections.length || !navLinks.length) return;

    var linkByHash = {};
    navLinks.forEach(function (link) {
      linkByHash[link.getAttribute("href")] = link;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = linkByHash["#" + entry.target.id];
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

  /* ---------- Copy email ---------- */

  function initCopyEmail() {
    var btn = document.getElementById("copyEmailBtn");
    if (!btn) return;

    var email = btn.getAttribute("data-email");
    var originalHTML = btn.innerHTML;
    var checkIcon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
    var resetTimer = null;

    btn.addEventListener("click", function (e) {
      e.preventDefault();

      function showCopied() {
        btn.innerHTML = checkIcon;
        btn.setAttribute("aria-label", "Email address copied");
        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          btn.innerHTML = originalHTML;
          btn.setAttribute("aria-label", "Copy email address");
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
    initCopyEmail();
    initYear();
  });
})();
