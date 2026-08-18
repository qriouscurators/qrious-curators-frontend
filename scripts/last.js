/* ============================================================
   SALO ANIMATIONS — last.js
   ============================================================ */

/* ── 1. HERO GALLERY CARDS — staggered slide-up on load ── */
(function () {
  const cards = document.querySelectorAll(".gallery .card");
  cards.forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(60px)";
    card.style.transition = `
      opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms,
      transform 0.75s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms
    `;
  });

  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      cards.forEach((card) => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      });
    });
  });
})();


/* ── 2. SCROLL ANIMATIONS — fade + slide ── */
(function () {
  const style = document.createElement("style");
  style.textContent = `
    .anim-ready {
      opacity: 0;
      transform: translateY(48px);
      transition: opacity 0.85s cubic-bezier(0.22,1,0.36,1),
                  transform 0.85s cubic-bezier(0.22,1,0.36,1);
    }
    .anim-ready.from-left  { transform: translateX(-56px); }
    .anim-ready.from-right { transform: translateX( 56px); }
    .anim-ready.visible {
      opacity: 1 !important;
      transform: translate(0,0) !important;
    }
  `;
  document.head.appendChild(style);

  // HTML aur CSS ke actual class names ke hisaab se
  const targets = [
    // Intro (hero left side) — .intro ke andar ke elements
    { sel: ".intro .eyebrow"  },
    { sel: ".intro h1"        },
    { sel: ".intro .rule"     },
    { sel: ".intro .lead"     },
    { sel: ".intro .cta"      },

    // Story section — .framed left se, .ptext right se
    { sel: ".story .framed",  cls: "from-left"  },
    { sel: ".story .ptext",   cls: "from-right" },

    // Video row — .center-block left se, .video-wrap right se
    { sel: ".video-row .center-block", cls: "from-left"  },
    { sel: ".video-row .video-wrap",   cls: "from-right" },

    // Culture text
    { sel: ".culture-content .small-title" },
    { sel: ".culture-content h2"           },
    { sel: ".culture-content .line"        },
    { sel: ".culture-content .culture-para"},
  ];

  targets.forEach(({ sel, cls }) => {
    document.querySelectorAll(sel).forEach((el) => {
      el.classList.add("anim-ready");
      if (cls) el.classList.add(cls);
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".anim-ready").forEach((el) => io.observe(el));
})();


/* ── 3. CULTURE — floating images spring physics ── */
(function () {
  const cultureSection = document.querySelector(".culture-section");
  const images = document.querySelectorAll(".float-img");
  if (!cultureSection || !images.length) return;

  const spring = Array.from(images).map(() => ({ pos: 0, vel: 0 }));
  const rotations = [10, -5, 4, -6, 5, -3];
  let rafRunning = false;

  const STIFFNESS = 0.10;
  const DAMPING   = 0.52;

  function getTargetY(index) {
    const rect = cultureSection.getBoundingClientRect();
    const wh   = window.innerHeight;

    let progress = -rect.top / (rect.height - wh);
    progress = Math.max(0, Math.min(1, progress));
    progress = progress * progress * (3 - 2 * progress);

    const gap = window.innerWidth < 700 ? 170 : 230;
    let currentOffset = 0;
    for (let i = 0; i < index; i++) currentOffset += images[i].offsetHeight + gap;

    const totalStack = Array.from(images).reduce((t, img) => t + img.offsetHeight + gap, 0);
    const scrollDist = wh + totalStack + 500;

    return (wh + currentOffset) - progress * scrollDist;
  }

  function tick() {
    let anyMoving = false;

    images.forEach((img, i) => {
      const target = getTargetY(i);
      const s = spring[i];

      s.vel += (target - s.pos) * STIFFNESS;
      s.vel *= DAMPING;
      s.pos += s.vel;

      img.style.transform = `translate3d(0,${s.pos}px,0) rotate(${rotations[i % rotations.length]}deg)`;

      if (Math.abs(s.vel) > 0.05 || Math.abs(target - s.pos) > 0.05) anyMoving = true;
    });

    if (anyMoving) requestAnimationFrame(tick);
    else rafRunning = false;
  }

  function startSpring() {
    if (!rafRunning) { rafRunning = true; requestAnimationFrame(tick); }
  }

  window.addEventListener("load", () => {
    images.forEach((img, i) => {
      spring[i].pos = getTargetY(i);
      img.style.transform = `translate3d(0,${spring[i].pos}px,0) rotate(${rotations[i % rotations.length]}deg)`;
    });
    startSpring();
  });

  window.addEventListener("scroll", startSpring);
  window.addEventListener("resize", () => {
    images.forEach((img, i) => { spring[i].pos = getTargetY(i); spring[i].vel = 0; });
    startSpring();
  });
})();