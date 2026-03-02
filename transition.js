/* ═══════════════════════════════════════════════════
   Portrait → Blueprint transition controller
   Shared across all product subpages.
   ═══════════════════════════════════════════════════ */

(function () {
  var vid    = document.getElementById("transition-video");
  var vidRev = document.getElementById("transition-video-rev");
  var still  = document.getElementById("transition-still");
  var wrap   = document.getElementById("transition-bg");
  if (!vid || !vidRev || !still || !wrap) return;

  /* ── Forward transition constants ── */
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
    var DIP_LEAD = 0.2; /* seconds before end to start the dip */
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
