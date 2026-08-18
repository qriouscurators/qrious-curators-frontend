(() => {
  "use strict";

  const section = document.querySelector(".qc-services-scroll");
  if (!section) return;

  const sticky = section.querySelector(".qc-services-sticky");
  const panels = [...section.querySelectorAll(".qc-service-panel")];
  const indexNumber = document.getElementById("qcIndexNumber");
  const indexProgress = document.getElementById("qcIndexProgress");

  if (!sticky || !panels.length) return;

  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
  const pad = n => String(n).padStart(2, "0");

  let ticking = false;

  function updateServices() {
    const rect = section.getBoundingClientRect();

    // Use the actual section height so footer/navbar CSS cannot alter the math.
    const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
    const travelled = clamp(-rect.top, 0, scrollable);
    const normalized = travelled / scrollable;

    const progress = normalized * (panels.length - 1);
    const active = clamp(Math.round(progress), 0, panels.length - 1);

    panels.forEach((panel, i) => {
      const d = i - progress;

      let y;
      let scale;
      let opacity;
      let rotateX;
      let z;

      if (d < 0) {
        /*
          OUTGOING PANEL:
          stays perfectly sharp and leaves straight upward.
          No fade, no blur, no scaling.
        */
        const gone = clamp(-d, 0, 1);
        y = -gone * (sticky.clientHeight + 80);
        scale = 1;
        opacity = 1;
        rotateX = 0;
        z = 0;
      } else {
        /*
          UPCOMING PANELS:
          remain stacked behind the active panel.
        */
        const depth = clamp(d, 0, 5);
        y = depth * 29;
        scale = 1 - depth * 0.032;
        opacity = depth > 4.4 ? 0 : 1;
        rotateX = depth * 0.35;
        z = -depth * 28;
      }

      panel.style.transform =
        `translate3d(0, ${y}px, ${z}px) scale(${scale}) rotateX(${rotateX}deg)`;

      panel.style.opacity = String(opacity);
      panel.style.filter = "none";

      // Keep nearer panels above deeper panels.
      panel.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));

      // Only current panel can receive mouse/touch interaction.
      panel.style.pointerEvents = Math.abs(d) < 0.55 ? "auto" : "none";
    });

    if (indexNumber) {
      indexNumber.textContent = pad(active + 1);
    }

    if (indexProgress) {
      indexProgress.style.transform = `scaleY(${normalized})`;
    }
  }

  function requestUpdate() {
    if (ticking) return;

    ticking = true;
    requestAnimationFrame(() => {
      updateServices();
      ticking = false;
    });
  }

  /*
    IMPORTANT:
    We intentionally use the normal window scroll.
    No scroll hijacking, no GSAP dependency and no overflow lock.
  */
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  window.addEventListener("orientationchange", requestUpdate, { passive: true });

  // Recalculate after fonts/assets/layout settle.
  window.addEventListener("load", updateServices);

  updateServices();
})();
