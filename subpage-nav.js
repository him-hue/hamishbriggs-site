/* ═══════════════════════════════════════════════════
   Subpage navigation controller
   Handles swipe/scroll between product pages
   and bottom nav bar highlighting
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

  /* Figure out which page we're on */
  var currentFile = window.location.pathname.split("/").pop() || "";
  var currentIndex = PAGES.indexOf(currentFile);

  /* Highlight the active nav dot */
  var navDots = document.querySelectorAll(".product-nav-dot");
  navDots.forEach(function (dot, i) {
    if (i === currentIndex) {
      dot.classList.add("active");
    }
  });

  /* Swipe / scroll navigation between product pages */
  var subpage = document.querySelector(".subpage");
  if (!subpage) return;

  var touchStartY = 0;
  var lastNav = 0;
  var NAV_COOLDOWN = 800;
  var scrollAccum = 0;
  var SCROLL_THRESHOLD = 60;

  function navigateTo(url) {
    subpage.classList.remove("page-fade-in");
    subpage.classList.add("page-fade-out");
    setTimeout(function () {
      window.location.href = url;
    }, 350);
  }

  function goPrev() {
    var now = Date.now();
    if (now - lastNav < NAV_COOLDOWN) return;
    lastNav = now;

    if (currentIndex <= 0) {
      /* First product page: go back to main products view */
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
      /* Last product page: go back to main products view */
      navigateTo("index.html#products");
    } else {
      navigateTo(PAGES[currentIndex + 1]);
    }
  }

  /* Check if at scroll boundaries */
  function atTop() {
    return subpage.scrollTop <= 2;
  }

  function atBottom() {
    return subpage.scrollTop + subpage.clientHeight >= subpage.scrollHeight - 2;
  }

  /* Mouse wheel */
  subpage.addEventListener("wheel", function (e) {
    /* If content doesn't overflow (fits on screen), always navigate */
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
      /* Content overflows: only navigate at boundaries */
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
