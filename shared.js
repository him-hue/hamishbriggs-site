/* ── Shared JS: background parallax, menu, keyboard shortcut ── */

document.addEventListener("DOMContentLoaded", () => {
  /* Parallax */
  const bgWrap = document.querySelector(".bg-wrap");
  if (bgWrap) {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const y = window.scrollY * 0.12;
        bgWrap.style.transform = `translate3d(0, ${-y}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Floating menu */
  const trigger = document.querySelector(".menu-trigger");
  const popup = document.querySelector(".menu-popup");
  if (trigger && popup) {
    trigger.addEventListener("click", () => popup.classList.toggle("open"));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") popup.classList.remove("open");
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        popup.classList.toggle("open");
      }
    });

    /* Close on outside click */
    document.addEventListener("click", (e) => {
      if (!trigger.contains(e.target) && !popup.contains(e.target)) {
        popup.classList.remove("open");
      }
    });
  }
});
