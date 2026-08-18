/* =========================================================
   PRELOADER
========================================================= */
(function () {
  const MIN_TIME = 1500;
  const start = Date.now();

  window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    const elapsed = Date.now() - start;
    const remaining = Math.max(0, MIN_TIME - elapsed);

    setTimeout(() => {
      preloader.classList.add("hide");
      setTimeout(() => { preloader.style.display = "none"; }, 600);
    }, remaining);
  });
})();

/* =========================================================
   NAV / HAMBURGER
========================================================= */
(function () {
  const qnToggle = document.getElementById("qnToggle");
  const qnOverlay = document.getElementById("qnOverlay");

  if (qnToggle && qnOverlay) {
    function qnToggleMenu(force) {
      const isOpen = typeof force === "boolean" ? force : !qnOverlay.classList.contains("open");
      qnOverlay.classList.toggle("open", isOpen);
      qnToggle.classList.toggle("active", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
    qnToggle.addEventListener("click", () => qnToggleMenu());
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") qnToggleMenu(false); });
  }

  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mmClose = document.getElementById("mmClose");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => mobileMenu.classList.add("open"));
  }
  if (mmClose && mobileMenu) {
    mmClose.addEventListener("click", () => mobileMenu.classList.remove("open"));
  }
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => mobileMenu.classList.remove("open"));
    });
  }
})();

/* =========================================================
   GENERIC REVEAL (.rv / .rvl / .rvr)
========================================================= */
(function () {
  const targets = document.querySelectorAll(".rv, .rvl, .rvr");
  if (!targets.length || !("IntersectionObserver" in window)) return;

  const obs = new IntersectionObserver(
    (entries) => { entries.forEach((el) => { if (el.isIntersecting) el.target.classList.add("in"); }); },
    { threshold: 0.1 }
  );
  targets.forEach((el) => obs.observe(el));
})();

/* =========================================================
   SMOOTH ANCHORS
========================================================= */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const t = document.querySelector(a.getAttribute("href"));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }); }
  });
});

/* =========================================================
   FOOTER REVEAL
========================================================= */
(function () {
  const footerObs = new IntersectionObserver(
    (entries) => { entries.forEach((el) => { if (el.isIntersecting) el.target.style.opacity = "1"; }); },
    { threshold: 0.05 }
  );
  document.querySelectorAll("footer").forEach((el) => {
    el.style.opacity = "0";
    el.style.transition = "opacity 1s ease";
    footerObs.observe(el);
  });
})();

/* =========================================================
   NX INTRO — VIDEO DOCKING + WORD REVEAL
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector(".nx-floating-video");
  const targetCard = document.getElementById("nx-target-slot");
  const contentArea = document.querySelector(".nx-content-area");
  const dimOverlay = document.querySelector(".nx-dim-overlay");
  const textLayer = document.querySelector(".nx-sticky-text-layer");
  const words = document.querySelectorAll(".nx-word");

  if (!video || !targetCard || !contentArea || !dimOverlay || !textLayer) return;

  const updateAnimation = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    let dockProgress = scrollY / windowHeight;
    dockProgress = Math.max(0, Math.min(1, dockProgress));
    const rect = targetCard.getBoundingClientRect();
    const currentWidth = window.innerWidth - (window.innerWidth - rect.width) * dockProgress;
    const currentHeight = windowHeight - (windowHeight - rect.height) * dockProgress;
    const currentX = rect.left * dockProgress;
    const currentY = rect.top * dockProgress;
    const currentRadius = 4 * dockProgress;
    video.style.width = `${currentWidth}px`;
    video.style.height = `${currentHeight}px`;
    video.style.transform = `translate(${currentX}px, ${currentY}px)`;
    video.style.borderRadius = `${currentRadius}px`;

    const postDockScroll = Math.max(0, scrollY - windowHeight * 0.8);
    const textRevealProgress = Math.min(1, postDockScroll / 400);
    dimOverlay.style.opacity = textRevealProgress;

    words.forEach((word, index) => {
      const delay = index * 0.15;
      let wordProgress = (textRevealProgress - delay) * 2;
      wordProgress = Math.max(0, Math.min(1, wordProgress));
      const easeOut = 1 - Math.pow(1 - wordProgress, 4);
      const translateY = (1 - easeOut) * 120;
      const rotateZ = (1 - easeOut) * 4;
      word.style.transform = `translateY(${translateY}%) rotateZ(${rotateZ}deg)`;
    });

    const contentBottom = contentArea.offsetTop + contentArea.offsetHeight;
    const scrollBottom = scrollY + windowHeight;
    let layerExitTranslate = 0;
    if (scrollBottom > contentBottom) {
      layerExitTranslate = contentBottom - scrollBottom;
    }
    textLayer.style.transform = `translateY(${layerExitTranslate}px)`;
    dimOverlay.style.transform = `translateY(${layerExitTranslate}px)`;
  };

  window.addEventListener("scroll", updateAnimation);
  window.addEventListener("resize", updateAnimation);
  updateAnimation();
});

/* =========================================================
   PREMIUM ABOUT — 3-SLIDE SCROLL PACING (FIXED)
   Previously the slide index advanced every fixed
   0.9 * innerHeight of scroll, which — combined with the
   section's limited pin height — meant slide 3 barely had
   any scroll room before the section unpinned (felt like a
   glitch). Now each of the 3 slides gets an EVEN THIRD of
   the section's actual available scroll distance, however
   tall the section is set to in CSS.
========================================================= */
(function () {
  const section = document.querySelector(".premium-about");
  const slides = document.querySelectorAll(".content-slide");
  const cards = document.querySelectorAll(".visual-card");
  const progressBar = document.querySelector(".scroll-progress");

  if (!section || !slides.length) return;

  const imageData = [
    ["./assets/homeimages/teamh1.JPG", "./assets/homeimages/teamh2.JPG", "./assets/homeimages/teamh3.JPG"],
    ["./assets/homeimages/teamh4.JPG", "./assets/homeimages/teamh5.JPG", "./assets/homeimages/teamh6.JPG"],
    ["./assets/homeimages/teamh7.JPG", "./assets/homeimages/teamh8.JPG", "./assets/homeimages/teamh9.JPG"]
  ];

  let currentIndex = 0;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY - section.offsetTop;
    const maxScroll = section.offsetHeight - window.innerHeight;

    if (progressBar) {
      const progressWidth = (scrollTop / maxScroll) * 100;
      progressBar.style.width = `${progressWidth}%`;
    }

    // Evenly divide the available scroll distance across the 3 slides,
    // so every slide gets a comfortable, equal reading window.
    const segment = maxScroll / 3;
    let index = Math.floor(scrollTop / segment);
    index = Math.max(0, Math.min(index, 2));

    if (index !== currentIndex) {
      currentIndex = index;

      slides.forEach((slide, i) => { slide.classList.toggle("active", i === index); });

      cards.forEach((card) => {
        card.classList.remove("active");
        card.classList.add("inactive");
      });

      setTimeout(() => {
        const img1 = document.getElementById("img1");
        const img2 = document.getElementById("img2");
        const img3 = document.getElementById("img3");
        if (img1) img1.src = imageData[index][0];
        if (img2) img2.src = imageData[index][1];
        if (img3) img3.src = imageData[index][2];

        cards.forEach((card) => {
          card.classList.remove("inactive");
          card.classList.add("active");
        });
      }, 350);
    }
  }, { passive: true });
})();

/* =========================================================
   D3 WORLD MAP — #worldwide section
========================================================= */
const CITIES = {
  london:  { coord: [-0.12, 51.51],  label: "London",   bdx: -60, bdy: -54 },
  newyork: { coord: [-74.00, 40.71], label: "New York",  bdx: -70, bdy: -54 },
  toronto: { coord: [-79.38, 43.65], label: "Toronto",   bdx: 8,   bdy: -54 },
  sao:     { coord: [-46.63, -23.55], label: "São Paulo", bdx: -70, bdy: 16 },
  berlin:  { coord: [13.40, 52.52],  label: "Berlin",    bdx: 8,   bdy: -54 },
  dubai:   { coord: [55.30, 25.20],  label: "Dubai",     bdx: 8,   bdy: -54 },
  mumbai:  { coord: [72.88, 19.08],  label: "Mumbai",    bdx: 8,   bdy: -54 },
  tokyo:   { coord: [139.69, 35.69], label: "Tokyo",     bdx: -70, bdy: -54 },
  sydney:  { coord: [151.21, -33.87], label: "Sydney",    bdx: -70, bdy: 16 }
};

const ARCS = [
  ["london", "newyork"], ["london", "dubai"], ["london", "toronto"],
  ["london", "berlin"], ["dubai", "mumbai"], ["mumbai", "tokyo"],
  ["newyork", "sao"], ["tokyo", "sydney"]
];

const HIGHLIGHT_ISO = new Set([
  "GBR", "USA", "ARE", "JPN", "AUS", "IND", "BRA", "CAN", "DEU",
  "FRA", "NLD", "SGP", "CHN", "ZAF", "NGA", "SAU", "KEN", "MEX"
]);

async function drawMap() {
  const canvas = document.getElementById("map-canvas");
  if (!canvas) return;
  const W = canvas.offsetWidth || 1000;
  const H = Math.round(W * 0.52);

  const loading = document.getElementById("mapLoading");
  if (loading) loading.remove();

  const svg = d3.select("#map-canvas")
    .append("svg")
    .attr("id", "map-svg")
    .attr("viewBox", `0 0 ${W} ${H}`)
    .attr("width", "100%")
    .attr("height", H);

  const projection = d3.geoNaturalEarth1().scale(W / 6.5).translate([W / 2, H / 2]);
  const path = d3.geoPath().projection(projection);

  svg.append("path").datum({ type: "Sphere" }).attr("class", "sphere").attr("d", path);

  const graticule = d3.geoGraticule();
  svg.append("path").datum(graticule()).attr("class", "graticule").attr("d", path);

  const majorLines = d3.geoGraticule().step([180, 23.5])();
  svg.append("path").datum(majorLines).attr("class", "graticule-major").attr("d", path);

  let world;
  try {
    world = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
  } catch (e) {
    world = await d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json");
  }

  const { feature, mesh } = await import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm");
  const countries = feature(world, world.objects.countries);

  const ISO_NUMERIC = {
    826: "GBR", 840: "USA", 784: "ARE", 392: "JPN", 36: "AUS",
    356: "IND", 76: "BRA", 124: "CAN", 276: "DEU", 250: "FRA",
    528: "NLD", 702: "SGP", 156: "CHN", 710: "ZAF", 566: "NGA",
    682: "SAU", 404: "KEN", 484: "MEX", 620: "PRT", 724: "ESP",
    380: "ITA", 56: "BEL", 616: "POL", 804: "UKR", 643: "RUS",
    792: "TUR", 818: "EGY", 12: "DZA", 504: "MAR", 364: "IRN",
    50: "BGD", 144: "LKA", 586: "PAK", 608: "PHL", 458: "MYS",
    360: "IDN", 764: "THA", 704: "VNM", 410: "KOR"
  };

  svg.selectAll(".country")
    .data(countries.features)
    .join("path")
    .attr("class", (d) => {
      const iso = ISO_NUMERIC[d.id] || "";
      return "country" + (HIGHLIGHT_ISO.has(iso) ? " highlighted" : "");
    })
    .attr("d", path);

  svg.append("path")
    .datum(mesh(world, world.objects.countries, (a, b) => a !== b))
    .attr("fill", "none")
    .attr("stroke", "rgba(255,255,255,.14)")
    .attr("stroke-width", ".35")
    .attr("d", path);

  const arcG = svg.append("g").attr("class", "arcs-layer");
  ARCS.forEach(([a, b]) => {
    const c1 = CITIES[a].coord;
    const c2 = CITIES[b].coord;
    const line = d3.geoInterpolate(c1, c2);
    const arcPoints = d3.range(0, 1.01, 0.02).map((t) => line(t));
    const arcPath = d3.line().x((d) => projection(d)?.[0]).y((d) => projection(d)?.[1]);
    arcG.append("path").datum(arcPoints).attr("class", "arc-path").attr("d", arcPath);
  });

  Object.entries(CITIES).forEach(([key, city]) => {
    const proj = projection(city.coord) || [0, 0];
    const x = proj[0], y = proj[1];
    if (!x || !y) return;

    const g = svg.append("g").attr("class", `city-group cg-${key}`);
    g.append("circle").attr("class", "dot-ring1").attr("cx", x).attr("cy", y).attr("r", 2.5);
    g.append("circle").attr("class", "dot-ring2").attr("cx", x).attr("cy", y).attr("r", 2.5);
    g.append("circle").attr("class", "dot-core").attr("cx", x).attr("cy", y).attr("r", 2.5);
    g.append("text").attr("class", "city-label").attr("x", x + 6).attr("y", y + 3).text(city.label);

    const badge = document.querySelector(`.badge[data-city="${key}"]`);
    if (badge) {
      const pctX = (x / W) * 100;
      const pctY = (y / H) * 100;
      badge.style.position = "absolute";
      badge.style.left = `calc(${pctX}% + ${city.bdx}px)`;
      badge.style.top = `calc(${pctY}% + ${city.bdy}px)`;
    }
  });

  requestAnimationFrame(() => {
    const svgEl = document.getElementById("map-svg");
    if (svgEl) svgEl.classList.add("ready");
  });

  setTimeout(() => {
    const badges = document.querySelectorAll(".badge");
    badges.forEach((b, i) => {
      setTimeout(() => {
        b.classList.add("show");
        setTimeout(() => b.classList.add("float"), 700);
      }, i * 120);
    });
  }, 800);
}

(function () {
  const worldwideSection = document.getElementById("worldwide");
  if (!worldwideSection || typeof d3 === "undefined") return;

  const mapObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        drawMap().catch((err) => {
          console.warn("Map load error:", err);
          const loading = document.getElementById("mapLoading");
          if (loading) loading.textContent = "Map unavailable";
        });
        mapObs.disconnect();
      }
    });
  }, { threshold: 0.05 });

  mapObs.observe(worldwideSection);
})();