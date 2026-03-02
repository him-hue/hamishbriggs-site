/* ═══════════════════════════════════════════════════
   Portrait → Blueprint transition controller
   Shared across all product subpages.
   On mobile: skip videos entirely, show still + reveal text immediately.
   ═══════════════════════════════════════════════════ */

(function () {
  var vid    = document.getElementById("transition-video");
  var vidRev = document.getElementById("transition-video-rev");
  var still  = document.getElementById("transition-still");
  var wrap   = document.getElementById("transition-bg");

  /* Always define the reverse transition function so subpage-nav.js
     can find it, even if video elements are missing (fallback: just navigate) */
  if (!vid || !vidRev || !still || !wrap) {
    window.__reverseTransition = function (url) { window.location.href = url; };
    return;
  }

  var isMobile = window.matchMedia("(max-width: 768px)").matches;

  /* Check if arriving from another product page (product-to-product nav) */
  var skipTransition = false;
  try { skipTransition = sessionStorage.getItem("skipTransition") === "1"; sessionStorage.removeItem("skipTransition"); } catch(e) {}

  /* ── Skip transition: show still + text immediately (product-to-product or mobile) ── */
  if (skipTransition && !isMobile) {
    vid.removeAttribute("src");
    vid.load();
    vid.style.display    = "none";
    still.style.display  = "block";
    /* Jump overlay + vignette to final darkened state instantly (no animation) */
    var ov = wrap.querySelector(".transition-bg-overlay");
    var vg = wrap.querySelector(".transition-bg-vignette");
    if (ov) ov.style.opacity = "1";
    if (vg) vg.style.opacity = "1";
    document.body.classList.add("content-visible");
    /* Reverse transition still works normally from the skipped state */
    window.__reverseTransition = function (destinationUrl) {
      var bo = document.getElementById("page-blackout");
      document.body.classList.remove("content-visible");
      document.body.classList.add("content-hiding");
      wrap.classList.remove("drifting");
      wrap.classList.add("undrifting");
      vid.style.display   = "none";
      still.style.display = "none";
      vidRev.style.display = "block";
      vidRev.currentTime = 0;
      vidRev.playbackRate = 1;
      vidRev.play().catch(function () {});
      var dipTriggered = false;
      var DIP_LEAD = 0.2;
      function checkForDip() {
        if (vidRev.paused || vidRev.ended) return;
        if (!dipTriggered && vidRev.duration - vidRev.currentTime <= DIP_LEAD) {
          dipTriggered = true;
          if (bo) { bo.classList.remove("fade-from-black"); bo.style.transition = "opacity 0.18s ease"; bo.style.opacity = "1"; }
        }
        requestAnimationFrame(checkForDip);
      }
      requestAnimationFrame(checkForDip);
      vidRev.addEventListener("ended", function () {
        try { sessionStorage.setItem("skipBlackout", "1"); } catch(e) {}
        window.location.href = destinationUrl;
      }, { once: true });
    };
    return;
  }

  /* ── Mobile: skip videos, show still frame + text immediately ── */
  if (isMobile) {
    /* Prevent video downloads by clearing sources */
    vid.removeAttribute("src");
    vid.load();
    vidRev.removeAttribute("src");
    vidRev.load();
    vid.style.display    = "none";
    vidRev.style.display = "none";
    still.style.display  = "block";
    /* Jump overlay + vignette to final darkened state instantly */
    var ov = wrap.querySelector(".transition-bg-overlay");
    var vg = wrap.querySelector(".transition-bg-vignette");
    if (ov) ov.style.opacity = "1";
    if (vg) vg.style.opacity = "1";
    document.body.classList.add("content-visible");

    /* On mobile, reverse transition is a simple fade-to-black */
    window.__reverseTransition = function (destinationUrl) {
      var bo = document.getElementById("page-blackout");
      if (bo) {
        bo.style.transition = "opacity 0.3s ease";
        bo.style.opacity = "1";
      }
      setTimeout(function () {
        window.location.href = destinationUrl;
      }, 350);
    };
    return;
  }

  /* ── Desktop: full video transition ── */
  var DRIFT_TIME     = 1.2;
  var DRIFT_RATE     = 0.35;
  var EASE_DURATION  = 0.8;
  var drifting        = false;
  var easeStart       = null;

  function startDrift() {
    if (drifting) return;
    drifting = true;
    easeStart = performance.now();
    wrap.classList.add("drifting");
    document.body.classList.add("content-visible");
    easeRate();
  }

  function easeRate() {
    var elapsed = (performance.now() - easeStart) / 1000;
    var t = Math.min(elapsed / EASE_DURATION, 1);
    var eased = 1 - Math.pow(1 - t, 3);
    vid.playbackRate = 1.0 - (1.0 - DRIFT_RATE) * eased;
    if (t < 1) requestAnimationFrame(easeRate);
  }

  function checkTime() {
    if (vid.paused || vid.ended) return;
    if (vid.currentTime >= DRIFT_TIME) startDrift();
    if (!drifting) requestAnimationFrame(checkTime);
  }

  vid.addEventListener("ended", function () {
    still.style.display = "block";
    vid.style.display   = "none";
    if (!drifting) startDrift();
  });

  vid.addEventListener("playing", function () {
    requestAnimationFrame(checkTime);
  }, { once: true });

  /* ── Reverse transition ──
     Everything happens simultaneously: text hides, overlay fades out
     over ~1.2s (matching when the actor reappears in the reverse video),
     and the reverse video plays underneath. Navigate when video ends. */
  window.__reverseTransition = function (destinationUrl) {
    var bo = document.getElementById("page-blackout");

    /* Hide text immediately */
    document.body.classList.remove("content-visible");
    document.body.classList.add("content-hiding");

    /* Fade out overlay + vignette slowly (CSS duration matches actor reappearance) */
    wrap.classList.remove("drifting");
    wrap.classList.add("undrifting");

    /* Swap to reverse video and play immediately alongside the overlay fade */
    vid.style.display   = "none";
    vid.pause();
    still.style.display = "none";
    vidRev.style.display = "block";
    vidRev.currentTime = 0;
    vidRev.playbackRate = 1;
    vidRev.play().catch(function () {});

    /* Near the end of the reverse video, dip to black to mask the page swap */
    var dipTriggered = false;
    var DIP_LEAD = 0.2;
    function checkForDip() {
      if (vidRev.paused || vidRev.ended) return;
      if (!dipTriggered && vidRev.duration - vidRev.currentTime <= DIP_LEAD) {
        dipTriggered = true;
        if (bo) {
          bo.classList.remove("fade-from-black");
          bo.style.transition = "opacity 0.18s ease";
          bo.style.opacity = "1";
        }
      }
      requestAnimationFrame(checkForDip);
    }
    requestAnimationFrame(checkForDip);

    /* Navigate when reverse video ends */
    vidRev.addEventListener("ended", function () {
      try { sessionStorage.setItem("skipBlackout", "1"); } catch(e) {}
      window.location.href = destinationUrl;
    }, { once: true });
  };

  vid.play().catch(function () {
    function startOnInteraction() {
      vid.play().catch(function () {});
      document.removeEventListener("click", startOnInteraction);
      document.removeEventListener("scroll", startOnInteraction);
    }
    document.addEventListener("click", startOnInteraction, { once: true });
    document.addEventListener("scroll", startOnInteraction, { once: true });
  });
})();
