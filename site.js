/* ═══════════════════════════════════════════════════
   Hamish Briggs — site controller
   Background video scrub + section transitions
   ═══════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Video scrub config ─────────────────────────────
     The reversed video is 3.25s / 78 frames @ 24fps.
     Camera steps = section count. Each section maps to
     an evenly spaced point in the video. Transitions
     scrub smoothly between them.
     ──────────────────────────────────────────────── */
  const VIDEO_DURATION = 3.25;   // seconds
  const TOTAL_SECTIONS = 4;
  const SCRUB_DURATION = 2000;   // ms — slow, cinematic scrub
  const DURATION = 1200;         // ms — section text transition

  /* ── State ──────────────────────────────────────── */
  let currentSection = 0;
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

  /* ── Map section index → video time (reversed: wide shot first) ── */
  function sectionToTime(index) {
    const clamped = Math.max(0, Math.min(index, TOTAL_SECTIONS - 1));
    return (1 - clamped / (TOTAL_SECTIONS - 1)) * VIDEO_DURATION;
  }

  /* ── Smooth scrub using requestAnimationFrame ──── */
  function easeInOut(t) {
    // sine ease-in-out for buttery smooth acceleration and deceleration
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  function animateScrub(timestamp) {
    if (!scrubStart) scrubStart = timestamp;
    const elapsed = timestamp - scrubStart;
    const progress = Math.min(elapsed / SCRUB_DURATION, 1);
    const eased = easeInOut(progress);

    bgVideo.currentTime = scrubFrom + (scrubTo - scrubFrom) * eased;

    if (progress < 1) {
      scrubRaf = requestAnimationFrame(animateScrub);
    } else {
      scrubRaf = null;
    }
  }

  function scrubToSection(sectionIndex) {
    if (isMobile) {
      // Mobile: crossfade to matching frame (reversed order)
      const frameIndex = (bgFrames.length - 1) - sectionIndex;
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
    scrubTo = sectionToTime(sectionIndex);
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

    // Scrub video to match target section
    scrubToSection(targetIndex);

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
    bgVideo.currentTime = VIDEO_DURATION;  // start on wide shot
  }

})();
