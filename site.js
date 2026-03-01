/* ═══════════════════════════════════════════════════
   Hamish Briggs: site controller
   Background video scrub + section transitions
   ═══════════════════════════════════════════════════ */

(function () {
  "use strict";

  const VIDEO_DURATION = 3.25;
  const TOTAL_SECTIONS = 4;
  const SCRUB_DURATION = 2000;
  const DURATION = 1200;

  let currentSection = 0;
  let transitioning = false;

  let scrubFrom = 0;
  let scrubTo = 0;
  let scrubStart = 0;
  let scrubRaf = null;

  const bgVideo   = document.getElementById("bg-video");
  const bgFrames  = document.querySelectorAll(".bg-frame");
  const dots      = document.querySelectorAll(".dot");
  const sections  = document.querySelectorAll(".section");
  const detail    = document.getElementById("product-detail");
  const productBtns = document.querySelectorAll(".product-btn");

  const isMobile = window.matchMedia("(max-width: 640px)").matches;

  function sectionToTime(index) {
    const clamped = Math.max(0, Math.min(index, TOTAL_SECTIONS - 1));
    return (1 - clamped / (TOTAL_SECTIONS - 1)) * VIDEO_DURATION;
  }

  function easeInOut(t) {
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
      const frameIndex = (bgFrames.length - 1) - sectionIndex;
      bgFrames.forEach((f, i) => {
        f.classList.toggle("active", i === frameIndex);
      });
      return;
    }

    if (scrubRaf) {
      cancelAnimationFrame(scrubRaf);
    }

    scrubFrom = bgVideo.currentTime;
    scrubTo = sectionToTime(sectionIndex);
    scrubStart = 0;
    scrubRaf = requestAnimationFrame(animateScrub);
  }

  function goTo(targetIndex) {
    if (transitioning) return;
    if (targetIndex < 0 || targetIndex >= TOTAL_SECTIONS) return;
    if (targetIndex === currentSection) return;

    transitioning = true;
    const direction = targetIndex > currentSection ? "up" : "down";
    const prev = sections[currentSection];
    const next = sections[targetIndex];

    prev.classList.remove("active");
    prev.classList.add(direction === "up" ? "exit-up" : "exit-down");

    next.classList.remove("exit-up", "exit-down");
    next.style.transition = "none";
    next.style.opacity = "0";
    next.style.transform = direction === "up" ? "translateY(60px)" : "translateY(-60px)";

    void next.offsetHeight;

    next.style.transition = "";
    next.classList.add("active");
    next.style.opacity = "";
    next.style.transform = "";

    scrubToSection(targetIndex);

    dots.forEach((d) => d.classList.remove("active"));
    dots[targetIndex].classList.add("active");

    currentSection = targetIndex;

    setTimeout(() => {
      prev.classList.remove("exit-up", "exit-down");
      transitioning = false;
    }, DURATION + 50);
  }

  /* ── Scroll / swipe handling ───────────────────── */
  let touchStartY = 0;
  let lastWheel = 0;
  let scrollAccum = 0;
  const SCROLL_THRESHOLD = 30;
  const SCROLL_COOLDOWN = 600;

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
    if (Math.abs(diff) < 50) return;
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

  /* ── Product interaction (hover preview, click navigates with crossfade) ── */
  const detailDefault = detail ? detail.innerHTML : "";

  function buildDetail(btn) {
    const status = btn.dataset.status === "dev" ? "Under development" : "Planned";
    const note = btn.dataset.status === "dev"
      ? ""
      : "This product is planned. Details will appear as it comes into focus.";
    const name = btn.textContent;

    const appLinks = { "StoryMap": "https://storymap.hamishbriggs.com" };
    const appUrl = appLinks[name];
    const visitBtn = appUrl
      ? `<a href="${appUrl}" class="product-visit-btn" onclick="event.stopPropagation()">Visit ${name}</a>`
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

  function showDetail(btn) {
    detail.innerHTML = buildDetail(btn);
  }

  function resetDetail() {
    detail.innerHTML = detailDefault;
  }

  function setActiveBtn(btn) {
    productBtns.forEach((b) => b.classList.remove("product-active"));
    if (btn) btn.classList.add("product-active");
  }

  productBtns.forEach((btn) => {
    /* Click navigates to subpage with crossfade */
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const href = btn.getAttribute("href");
      if (!href) return;

      // Add fade-out class to the viewport
      const viewport = document.getElementById("viewport");
      if (viewport) {
        viewport.classList.add("page-fade-out");
      }
      // Navigate after fade completes
      setTimeout(() => {
        window.location.href = href;
      }, 350);
    });

    /* Hover preview (desktop only) */
    btn.addEventListener("mouseenter", () => {
      setActiveBtn(btn);
      showDetail(btn);
    });

    btn.addEventListener("mouseleave", () => {
      setActiveBtn(null);
      resetDetail();
    });
  });

  /* ── Init ───────────────────────────────────────── */
  if (!isMobile) {
    bgVideo.pause();
    bgVideo.currentTime = VIDEO_DURATION;
  }

})();
