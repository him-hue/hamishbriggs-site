/* ═══════════════════════════════════════════════════
   Subpage navigation controller
   Handles swipe/scroll between product pages,
   bottom nav bar highlighting, and fade-to-black transitions
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

  /* Page detection via data-page attribute on body (reliable across all hosts) */
  var currentPage = document.body.getAttribute("data-page") || "";
  var currentIndex = PAGES.indexOf(currentPage);

  /* Fallback: try URL path matching */
  if (currentIndex === -1) {
    var href = window.location.href;
    for (var i = 0; i < PAGES.length; i++) {
      if (href.indexOf(PAGES[i]) !== -1) {
        currentIndex = i;
        break;
      }
    }
  }

  /* Highlight the active nav dot */
  var navDots = document.querySelectorAll(".product-nav-dot");
  navDots.forEach(function (dot, i) {
    if (i === currentIndex) {
      dot.classList.add("active");
    }
  });

  /* Blackout overlay for fade-to-black transitions */
  var blackout = document.getElementById("page-blackout");

  /* On page load: fade FROM black (overlay starts opaque, fades to transparent) */
  if (blackout) {
    blackout.classList.add("fade-from-black");
  }

  /* Navigate with fade-to-black effect */
  function navigateTo(url) {
    if (blackout) {
      blackout.classList.remove("fade-from-black");
      blackout.classList.add("fade-to-black");
    }
    setTimeout(function () {
      window.location.href = url;
    }, 450);
  }

  /* Intercept nav dot clicks for fade transition */
  navDots.forEach(function (dot) {
    dot.addEventListener("click", function (e) {
      e.preventDefault();
      var href = dot.getAttribute("href");
      if (href) {
        navigateTo(href);
      }
    });
  });

  /* Intercept back button for fade transition */
  var backBtn = document.querySelector(".subpage-back");
  if (backBtn) {
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();
      navigateTo(backBtn.getAttribute("href"));
    });
  }

  /* Intercept header nav links that go to index.html for fade transition */
  document.querySelectorAll(".header-sections .section-link, .logo").forEach(function (link) {
    var href = link.getAttribute("href") || "";
    if (href.indexOf("index.html") !== -1 || href === "index.html") {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        navigateTo(href);
      });
    }
  });

  /* Intercept Design Partners link for fade transition */
  document.querySelectorAll("a.design-partner-btn, .header-sections .section-link").forEach(function (link) {
    var href = link.getAttribute("href") || "";
    if (href.endsWith(".html") && href.indexOf("index.html") === -1) {
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
