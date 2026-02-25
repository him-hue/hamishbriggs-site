/* ═══════════════════════════════════════════════════
   Hamish Briggs — site controller
   Background camera path + section transitions
   ═══════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Camera keyframes ──────────────────────────────
     12 keyframes along a subtle dolly/pan path.
     Each step: translateX, translateY (px), scale.
     The image starts slightly low and right-of-center,
     and slowly drifts up and gently breathes in scale.
     ──────────────────────────────────────────────── */
  const CAMERA = [
    { y:  0,    s: 1.0    },   // 0  – home default
    { y: -18,   s: 1.010  },   // 1
    { y: -34,   s: 1.020  },   // 2
    { y: -48,   s: 1.016  },   // 3
    { y: -60,   s: 1.028  },   // 4
    { y: -72,   s: 1.036  },   // 5
    { y: -82,   s: 1.030  },   // 6
    { y: -92,   s: 1.040  },   // 7
    { y: -100,  s: 1.046  },   // 8
    { y: -108,  s: 1.042  },   // 9
    { y: -114,  s: 1.050  },   // 10
    { y: -120,  s: 1.056  },   // 11 – max
  ];

  const TOTAL_SECTIONS = 4;
  const DURATION = 650; // ms — matches CSS --duration

  /* ── State ──────────────────────────────────────── */
  let currentSection = 0;
  let cameraStep = 0;
  let transitioning = false;

  /* ── DOM refs ───────────────────────────────────── */
  const bgLayer   = document.getElementById("bg-layer");
  const dots      = document.querySelectorAll(".dot");
  const sections  = document.querySelectorAll(".section");
  const detail    = document.getElementById("product-detail");
  const productBtns = document.querySelectorAll(".product-btn");

  /* ── Apply camera position ─────────────────────── */
  function applyCamera(step) {
    const kf = CAMERA[Math.min(step, CAMERA.length - 1)];
    bgLayer.style.transform =
      `translate3d(0, ${kf.y}px, 0) scale(${kf.s})`;
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

    // Advance or retreat camera
    if (direction === "up") {
      cameraStep = Math.min(cameraStep + 1, CAMERA.length - 1);
    } else {
      cameraStep = Math.max(cameraStep - 1, 0);
    }
    applyCamera(cameraStep);

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

  /* ── Product hover interaction ─────────────────── */
  const detailDefault = detail ? detail.innerHTML : "";

  productBtns.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      const status = btn.dataset.status === "dev" ? "Under development" : "Planned";
      const note = btn.dataset.status === "dev"
        ? "Visit the subdomain to explore this product."
        : "This product is planned. Details will appear as it comes into focus.";

      detail.innerHTML = `
        <div class="detail-active">
          <div class="detail-status">${status}</div>
          <div class="detail-name">${btn.textContent}</div>
          <div class="detail-blurb">${btn.dataset.blurb}</div>
          <div class="detail-note">${note}</div>
        </div>
      `;
    });

    btn.addEventListener("mouseleave", () => {
      detail.innerHTML = detailDefault;
    });
  });

  /* ── Init ───────────────────────────────────────── */
  applyCamera(0);

})();
