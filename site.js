/* ═══════════════════════════════════════════════════
   Hamish Briggs — site controller
   Background video scrub + section transitions
   ═══════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Video scrub config ─────────────────────────────
     The reversed video is 3.25s / 78 frames @ 24fps.
     12 camera steps map linearly across the video duration.
     Each transition smoothly scrubs video.currentTime
     using requestAnimationFrame for butter-smooth motion.
     ──────────────────────────────────────────────── */
  const VIDEO_DURATION = 3.25;   // seconds
  const CAMERA_STEPS = 12;
  const SCRUB_DURATION = 1400;   // ms — how long the video scrub animation takes

  const TOTAL_SECTIONS = 4;
  const DURATION = 650; // ms — matches CSS --duration for section transitions

  /* ── State ──────────────────────────────────────── */
  let currentSection = 0;
  let cameraStep = 0;
  let transitioning = false;

  /* Video scrub state */
  let scrubFrom = 0;
  let scrubTo = 0;
  let scrubStart = 0;
  let scrubRaf = null;

  /* ── DOM refs ───────────────────────────────────── */
  const bgVideo   = document.getElementById("bg-video");
  const bgFrames  = document.querySelectorAll(".bg-frame");
  const dots      = document.querySelectorAll(".dot");
  const sections  = document.querySelectorAll(".section");
  const detail    = document.getElementById("product-detail");
  const productBtns = document.querySelectorAll(".product-btn");

  /* ── Mobile detection ──────────────────────────── */
  const isMobile = window.matchMedia("(max-width: 640px)").matches;

  /* ── Map camera step → video time ───────────────── */
  function stepToTime(step) {
    const clamped = Math.max(0, Math.min(step, CAMERA_STEPS - 1));
    return (clamped / (CAMERA_STEPS - 1)) * VIDEO_DURATION;
  }

  /* ── Smooth scrub using requestAnimationFrame ──── */
  function easOut(t) {
    // cubic ease-out for smooth deceleration
    return 1 - Math.pow(1 - t, 3);
  }

  function animateScrub(timestamp) {
    if (!scrubStart) scrubStart = timestamp;
    const elapsed = timestamp - scrubStart;
    const progress = Math.min(elapsed / SCRUB_DURATION, 1);
    const eased = easOut(progress);

    bgVideo.currentTime = scrubFrom + (scrubTo - scrubFrom) * eased;

    if (progress < 1) {
      scrubRaf = requestAnimationFrame(animateScrub);
    } else {
      scrubRaf = null;
    }
  }

  function scrubToStep(step) {
    if (isMobile) {
      // Mobile: crossfade to the nearest frame
      const frameIndex = Math.round((step / (CAMERA_STEPS - 1)) * (bgFrames.length - 1));
      bgFrames.forEach((f, i) => {
        f.classList.toggle("active", i === frameIndex);
      });
      return;
    }

    // Desktop: smooth video scrub
    if (scrubRaf) {
      cancelAnimationFrame(scrubRaf);
    }

    scrubFrom = bgVideo.currentTime;
    scrubTo = stepToTime(step);
    scrubStart = 0;
    scrubRaf = requestAnimationFrame(animateScrub);
  }

  /* ── Navigate to a section ─────────────────────── */
  function goTo(targetIndex) {
    if (transitioning) return;
    if (targetIndex < 0 || targetIndex >= TOTAL_SECTIONS) return;
    if (targetIndex === currentSection) return;

    transitioning = true;
    const direction = targetIndex > currentSection ? "up" : "down";
    const prev = sections[currentSection];
    const next = sections[targetIndex];

    // Exit current section
    prev.classList.remove("active");
    prev.classList.add(direction === "up" ? "exit-up" : "exit-down");

    // Prepare incoming section on opposite side
    next.classList.remove("exit-up", "exit-down");
    // Force it to start from correct side before transition kicks in
    next.style.transition = "none";
    next.style.opacity = "0";
    next.style.transform = direction === "up" ? "translateY(60px)" : "translateY(-60px)";

    // Force reflow
    void next.offsetHeight;

    // Animate in
    next.style.transition = "";
    next.classList.add("active");
    next.style.opacity = "";
    next.style.transform = "";

    // Advance or retreat camera (scrub video)
    if (direction === "up") {
      cameraStep = Math.min(cameraStep + 1, CAMERA_STEPS - 1);
    } else {
      cameraStep = Math.max(cameraStep - 1, 0);
    }
    scrubToStep(cameraStep);

    // Update dots
    dots.forEach((d) => d.classList.remove("active"));
    dots[targetIndex].classList.add("active");

    currentSection = targetIndex;

    // Clean up exit class after transition
    setTimeout(() => {
      prev.classList.remove("exit-up", "exit-down");
      transitioning = false;
    }, DURATION + 50);
  }

  /* ── Scroll / swipe handling ───────────────────── */
  let touchStartY = 0;
  let lastWheel = 0;

  /* Accumulate small scroll deltas (trackpad) before triggering */
  let scrollAccum = 0;
  const SCROLL_THRESHOLD = 30;   // lower = more sensitive
  const SCROLL_COOLDOWN = 600;   // ms between transitions

  window.addEventListener("wheel", (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastWheel < SCROLL_COOLDOWN) return;

    scrollAccum += e.deltaY;

    if (scrollAccum > SCROLL_THRESHOLD) {
      scrollAccum = 0;
      lastWheel = now;
      goTo(currentSection + 1);
    } else if (scrollAccum < -SCROLL_THRESHOLD) {
      scrollAccum = 0;
      lastWheel = now;
      goTo(currentSection - 1);
    }
  }, { passive: false });

  window.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener("touchend", (e) => {
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 50) return; // minimum swipe
    if (diff > 0) {
      goTo(currentSection + 1);
    } else {
      goTo(currentSection - 1);
    }
  }, { passive: true });

  /* ── Keyboard ──────────────────────────────────── */
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      goTo(currentSection + 1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      goTo(currentSection - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(TOTAL_SECTIONS - 1);
    }
  });

  /* ── Dot navigation ────────────────────────────── */
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = parseInt(dot.dataset.nav, 10);
      goTo(target);
    });
  });

  /* ── Logo / nav links → section navigation ─────── */
  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(parseInt(el.dataset.nav, 10));
    });
  });

  /* ── Product interaction (hover to preview, click to pin) ── */
  const detailDefault = detail ? detail.innerHTML : "";
  let pinnedBtn = null;   // currently pinned product, or null

  /* Build the detail HTML for a given product button */
  function buildDetail(btn) {
    const status = btn.dataset.status === "dev" ? "Under development" : "Planned";
    const note = btn.dataset.status === "dev"
      ? ""
      : "This product is planned. Details will appear as it comes into focus.";
    const name = btn.textContent;
    const href = btn.getAttribute("href");

    // Show a visit button for products that have a live link
    const showVisit = (name === "StoryMap");
    const visitBtn = showVisit
      ? `<a href="${href}" class="product-visit-btn">Visit ${name}</a>`
      : "";

    return `
      <div class="detail-active">
        <div class="detail-status">${status}</div>
        <div class="detail-name">${name}</div>
        <div class="detail-blurb">${btn.dataset.blurb}</div>
        ${note ? `<div class="detail-note">${note}</div>` : ""}
        ${visitBtn}
      </div>
    `;
  }

  /* Show detail for a button */
  function showDetail(btn) {
    detail.innerHTML = buildDetail(btn);
  }

  /* Reset to default */
  function resetDetail() {
    detail.innerHTML = detailDefault;
  }

  /* Highlight the active product name */
  function setActiveBtn(btn) {
    productBtns.forEach((b) => b.classList.remove("product-active"));
    if (btn) btn.classList.add("product-active");
  }

  productBtns.forEach((btn) => {
    /* Prevent default link navigation — click is now pin/unpin */
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      if (pinnedBtn === btn) {
        // Unpin — revert to default
        pinnedBtn = null;
        setActiveBtn(null);
        resetDetail();
      } else {
        // Pin this product
        pinnedBtn = btn;
        setActiveBtn(btn);
        showDetail(btn);
      }
    });

    /* Hover preview (desktop only, doesn't override a pin) */
    btn.addEventListener("mouseenter", () => {
      if (!pinnedBtn) {
        showDetail(btn);
      }
    });

    btn.addEventListener("mouseleave", () => {
      if (!pinnedBtn) {
        resetDetail();
      }
    });
  });

  /* Click outside product list or detail → unpin */
  document.addEventListener("click", (e) => {
    if (!pinnedBtn) return;
    if (e.target.closest(".product-list-flat") || e.target.closest("#product-detail")) return;
    pinnedBtn = null;
    setActiveBtn(null);
    resetDetail();
  });

  /* ── Init ───────────────────────────────────────── */
  if (!isMobile) {
    bgVideo.pause();
    bgVideo.currentTime = 0;
  }

})();
