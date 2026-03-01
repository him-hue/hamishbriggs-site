/* ═══════════════════════════════════════════════════
   Subpage navigation controller
   Handles swipe/scroll between product pages,
   bottom nav bar highlighting, and crossfade transitions
   ═══════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* Product page order */
  var PAGES = [
    "index-app.html",
    "storymap.html",
    "productionmap.html",
    "marketingmap.html",
    "domaindatamine.html",
    "yggdrasil.html"
  ];

  /* Robust page detection: check pathname, handle trailing slashes, query strings */
  var path = window.location.pathname;
  var currentFile = "";
  var currentIndex = -1;

  for (var i = 0; i < PAGES.length; i++) {
    if (path.indexOf(PAGES[i]) !== -1) {
      currentFile = PAGES[i];
      currentIndex = i;
      break;
    }
  }

  /* If still not found, try the last segment */
  if (currentIndex === -1) {
    var segments = path.replace(/\/$/, "").split("/");
    var lastSeg = segments[segments.length - 1] || "";
    currentIndex = PAGES.indexOf(lastSeg);
  }

  /* Highlight the active nav dot */
  var navDots = document.querySelectorAll(".product-nav-dot");
  navDots.forEach(function (dot, i) {
    if (i === currentIndex) {
      dot.classList.add("active");
    }
  });

  /* Crossfade helper: fades out everything, then navigates */
  function navigateTo(url) {
    var subpage = document.querySelector(".subpage");
    var gateway = document.querySelector(".subpage-gateway");
    var productNav = document.querySelector(".product-nav");

    /* Fade out all visible elements */
    if (subpage) {
      subpage.classList.remove("page-fade-in");
      subpage.classList.add("page-fade-out");
    }
    if (gateway) gateway.style.opacity = "0";
    if (productNav) productNav.style.opacity = "0";

    setTimeout(function () {
      window.location.href = url;
    }, 380);
  }

  /* Intercept nav dot clicks for crossfade */
  navDots.forEach(function (dot) {
    dot.addEventListener("click", function (e) {
      e.preventDefault();
      var href = dot.getAttribute("href");
      if (href && href !== currentFile) {
        navigateTo(href);
      }
    });
  });

  /* Intercept back button for crossfade */
  var backBtn = document.querySelector(".subpage-back");
  if (backBtn) {
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();
      navigateTo(backBtn.getAttribute("href"));
    });
  }

  /* Intercept header nav links that go to index.html for crossfade */
  document.querySelectorAll(".header-sections .section-link, .logo").forEach(function (link) {
    var href = link.getAttribute("href") || "";
    if (href.indexOf("index.html") !== -1 || href === "index.html") {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        navigateTo(href);
      });
    }
  });

  /* Swipe / scroll navigation between product pages */
  var subpage = document.querySelector(".subpage");
  if (!subpage || currentIndex === -1) return;

  var touchStartY = 0;
  var lastNav = 0;
  var NAV_COOLDOWN = 800;
  var scrollAccum = 0;
  var SCROLL_THRESHOLD = 80;

  function goPrev() {
    var now = Date.now();
    if (now - lastNav < NAV_COOLDOWN) return;
    lastNav = now;

    if (currentIndex <= 0) {
      navigateTo("index.html#products");
    } else {
      navigateTo(PAGES[currentIndex - 1]);
    }
  }

  function goNext() {
    var now = Date.now();
    if (now - lastNav < NAV_COOLDOWN) return;
    lastNav = now;

    if (currentIndex >= PAGES.length - 1) {
      navigateTo("index.html#products");
    } else {
      navigateTo(PAGES[currentIndex + 1]);
    }
  }

  function atTop() {
    return subpage.scrollTop <= 2;
  }

  function atBottom() {
    return subpage.scrollTop + subpage.clientHeight >= subpage.scrollHeight - 2;
  }

  /* Mouse wheel */
  subpage.addEventListener("wheel", function (e) {
    var fitsOnScreen = subpage.scrollHeight <= subpage.clientHeight + 5;

    if (fitsOnScreen) {
      e.preventDefault();
      scrollAccum += e.deltaY;

      if (scrollAccum > SCROLL_THRESHOLD) {
        scrollAccum = 0;
        goNext();
      } else if (scrollAccum < -SCROLL_THRESHOLD) {
        scrollAccum = 0;
        goPrev();
      }
    } else {
      if (e.deltaY < 0 && atTop()) {
        e.preventDefault();
        scrollAccum += e.deltaY;
        if (scrollAccum < -SCROLL_THRESHOLD) {
          scrollAccum = 0;
          goPrev();
        }
      } else if (e.deltaY > 0 && atBottom()) {
        e.preventDefault();
        scrollAccum += e.deltaY;
        if (scrollAccum > SCROLL_THRESHOLD) {
          scrollAccum = 0;
          goNext();
        }
      } else {
        scrollAccum = 0;
      }
    }
  }, { passive: false });

  /* Touch swipe */
  subpage.addEventListener("touchstart", function (e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  subpage.addEventListener("touchend", function (e) {
    var diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 60) return;

    var fitsOnScreen = subpage.scrollHeight <= subpage.clientHeight + 5;

    if (fitsOnScreen) {
      if (diff > 0) goNext();
      else goPrev();
    } else {
      if (diff < 0 && atTop()) goPrev();
      else if (diff > 0 && atBottom()) goNext();
    }
  }, { passive: true });

  /* Keyboard */
  window.addEventListener("keydown", function (e) {
    var fitsOnScreen = subpage.scrollHeight <= subpage.clientHeight + 5;

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      if (fitsOnScreen || atBottom()) {
        e.preventDefault();
        goNext();
      }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      if (fitsOnScreen || atTop()) {
        e.preventDefault();
        goPrev();
      }
    }
  });

})();
