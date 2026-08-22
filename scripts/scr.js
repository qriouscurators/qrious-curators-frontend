// ----------------------------- Testimonial Section ---------------------------------

const testimonialSectionWrap = document.querySelector(".testimonial-section");
const testimonialCardItems = document.querySelectorAll(".testimonial-card");

function handleStackedTestimonialsScroll() {
  const testimonialSectionBounds = testimonialSectionWrap.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  const testimonialScrollRange =
    testimonialSectionWrap.offsetHeight - viewportHeight;

  const testimonialScrollProgress = Math.min(
    Math.max(-testimonialSectionBounds.top / testimonialScrollRange, 0),
    1
  );

  const testimonialCardCount = testimonialCardItems.length;

  testimonialCardItems.forEach((testimonialCard, testimonialIndex) => {
    const cardRevealStart = testimonialIndex / testimonialCardCount;
    const cardRevealEnd = (testimonialIndex + 1) / testimonialCardCount;

    let cardRevealProgress =
      (testimonialScrollProgress - cardRevealStart) /
      (cardRevealEnd - cardRevealStart);

    cardRevealProgress = Math.min(Math.max(cardRevealProgress, 0), 1);

    const cardEntryPositionY = 120 - cardRevealProgress * 120;
    const cardStackSpacing = testimonialIndex * 10;
    const cardTiltAngle = testimonialIndex % 2 === 0 ? -3 : 3;

    if (testimonialScrollProgress >= cardRevealStart) {
      testimonialCard.style.opacity = 1;
      testimonialCard.style.zIndex = testimonialIndex + 2;

      if (testimonialScrollProgress > cardRevealEnd) {
        testimonialCard.style.transform = `
          translateY(${cardStackSpacing}px)
          rotate(${cardTiltAngle}deg)
          scale(${1 - testimonialIndex * 0.015})
        `;
      } else {
        testimonialCard.style.transform = `
          translateY(${cardEntryPositionY}vh)
          rotate(${cardTiltAngle * cardRevealProgress}deg)
          scale(1)
        `;
      }
    } else {
      testimonialCard.style.opacity = 0;
      testimonialCard.style.transform =
        "translateY(120vh) rotate(0deg) scale(1)";
    }
  });
}

window.addEventListener("scroll", handleStackedTestimonialsScroll);
window.addEventListener("load", handleStackedTestimonialsScroll);

// ----------------------------------------------------------------------------------

const qnToggle = document.getElementById('qnToggle');
const qnOverlay = document.getElementById('qnOverlay');
function qnToggleMenu(force){
  const isOpen = typeof force === 'boolean' ? force : !qnOverlay.classList.contains('open');
  qnOverlay.classList.toggle('open', isOpen);
  qnToggle.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
qnToggle.addEventListener('click', () => qnToggleMenu());
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') qnToggleMenu(false);
});

// ----------------------------------------------------------------------


(function () {
  const MIN_TIME = 5000;

  const start = Date.now();

  window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    const elapsed = Date.now() - start;
    const remaining = Math.max(0, MIN_TIME - elapsed);

    setTimeout(() => {
      preloader.classList.add("hide");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 600);
    }, remaining);
  });
})();

// ----------------------------------------------------------------------

/* ---- CURSOR ---- */
/* ---- HAMBURGER ---- */
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.add("open");
});

document.getElementById("mmClose").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.remove("open");
});

document.querySelectorAll(".mobile-menu a").forEach((a) => {
  a.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.remove("open");
  });
});

/* ---- HORIZONTAL SCROLL ---- */
const svcSection = document.getElementById("services");
const svcTrack = document.getElementById("svcTrack");

function updateSvc() {
  if (!svcSection || !svcTrack) return;

  const r = svcSection.getBoundingClientRect();
  const totalH = svcSection.offsetHeight - window.innerHeight;
  const p = Math.max(0, Math.min(1, -r.top / totalH));
  const maxShift = svcTrack.scrollWidth - window.innerWidth;

  svcTrack.style.transform = `translateX(-${p * maxShift}px)`;
}

window.addEventListener("scroll", updateSvc, { passive: true });
/* ---- PROCESS CARDS ---- */
const procSection=document.getElementById('process');
const procCards=document.querySelectorAll('.p-card');
function updateProc(){
  const r=procSection.getBoundingClientRect();
  const totalH=procSection.offsetHeight-window.innerHeight;
  const p=Math.max(0,Math.min(1,-r.top/totalH));
  procCards.forEach((c,i)=>{
    const delay=i*0.22;
    const cp=Math.max(0,Math.min(1,(p-delay)/.22));
    c.style.transform=`translateY(${100*(1-cp)}px) scale(${.92+.08*cp})`;
    c.style.opacity=cp;
    c.style.transition='transform .05s linear,opacity .05s linear';
  });
}
window.addEventListener('scroll',updateProc,{passive:true});

/* ---- TEAM PARALLAX ---- */
const teamSection=document.getElementById('team');
const teamCards=document.getElementById('teamCards');
function updateTeam(){
  const r=teamSection.getBoundingClientRect();
  const totalH=teamSection.offsetHeight-window.innerHeight;
  const p=Math.max(0,Math.min(1,-r.top/totalH));
  const maxY=teamCards.offsetHeight-window.innerHeight+80;
  teamCards.style.transform=`translateX(-50%) translateY(-${p*maxY}px)`;
}
window.addEventListener('scroll',updateTeam,{passive:true});

/* ---- MANIFESTO WORD REVEAL ---- */
const words=document.querySelectorAll('.manifesto-word');
function updateManifesto(){
  const section=document.getElementById('manifesto');
  const r=section.getBoundingClientRect();
  const progress=1-r.bottom/window.innerHeight;
  const visible=Math.floor(progress*words.length*4);
  words.forEach((w,i)=>w.classList.toggle('lit',i<visible));
}
window.addEventListener('scroll',updateManifesto,{passive:true});

/* ---- GENERIC REVEAL ---- */
const obs=new IntersectionObserver(e=>{e.forEach(el=>{if(el.isIntersecting)el.target.classList.add('in');});},{threshold:.1});
document.querySelectorAll('.rv,.rvl,.rvr').forEach(el=>obs.observe(el));

/* ---- SMOOTH ANCHORS ---- */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
  });
});

/* ---- FOOTER REVEAL ---- */
const footerObs=new IntersectionObserver(e=>{e.forEach(el=>{if(el.isIntersecting)el.target.style.opacity='1';});},{threshold:.05});
document.querySelectorAll('footer').forEach(el=>{el.style.opacity='0';el.style.transition='opacity 1s ease';footerObs.observe(el);});


/* ════════════════════════════════════════════
   D3 WORLD MAP
════════════════════════════════════════════ */

// Cities: [lon, lat] in geographic coords + display offset for badge
const CITIES = {
  london:  { coord:[-0.12, 51.51],  label:'London',    bdx:-60, bdy:-54 },
  newyork: { coord:[-74.00, 40.71], label:'New York',   bdx:-70, bdy:-54 },
  toronto: { coord:[-79.38, 43.65], label:'Toronto',    bdx: 8,  bdy:-54 },
  sao:     { coord:[-46.63,-23.55], label:'São Paulo',  bdx:-70, bdy: 16 },
  berlin:  { coord:[ 13.40, 52.52], label:'Berlin',     bdx: 8,  bdy:-54 },
  dubai:   { coord:[ 55.30, 25.20], label:'Dubai',      bdx: 8,  bdy:-54 },
  mumbai:  { coord:[ 72.88, 19.08], label:'Mumbai',     bdx: 8,  bdy:-54 },
  tokyo:   { coord:[139.69, 35.69], label:'Tokyo',      bdx:-70, bdy:-54 },
  sydney:  { coord:[151.21,-33.87], label:'Sydney',     bdx:-70, bdy: 16 },
}

// Arc connections [cityA, cityB]
const ARCS = [
  ['london','newyork'],['london','dubai'],['london','toronto'],
  ['london','berlin'],['dubai','mumbai'],['mumbai','tokyo'],
  ['newyork','sao'],['tokyo','sydney'],
]

// Countries to highlight (ISO Alpha-2 → used in topojson id)
const HIGHLIGHT_ISO = new Set([
  'GBR','USA','ARE','JPN','AUS','IND','BRA','CAN','DEU',
  'FRA','NLD','SGP','CHN','ZAF','NGA','SAU','KEN','MEX'
])

async function drawMap() {
  const canvas = document.getElementById('map-canvas')
  const W = canvas.offsetWidth || 1000
  const H = Math.round(W * 0.52)

  // Remove loading indicator
  document.getElementById('mapLoading').remove()

  // Create SVG
  const svg = d3.select('#map-canvas')
    .append('svg')
    .attr('id','map-svg')
    .attr('viewBox',`0 0 ${W} ${H}`)
    .attr('width','100%')
    .attr('height',H)

  // Natural Earth projection
  const projection = d3.geoNaturalEarth1()
    .scale(W / 6.5)
    .translate([W / 2, H / 2])

  const path = d3.geoPath().projection(projection)

  // ── Sphere (ocean) ──
  svg.append('path')
    .datum({type:'Sphere'})
    .attr('class','sphere')
    .attr('d', path)

  // ── Graticule ──
  const graticule = d3.geoGraticule()
  svg.append('path')
    .datum(graticule())
    .attr('class','graticule')
    .attr('d', path)

  // Major lines (equator + tropics)
  const majorLines = d3.geoGraticule().step([180,23.5])()
  svg.append('path')
    .datum(majorLines)
    .attr('class','graticule-major')
    .attr('d', path)

  // ── Fetch TopoJSON world data ──
  let world
  try {
    world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  } catch(e) {
    // Fallback URL
    world = await d3.json('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
  }

  const { feature, mesh } = await import('https://cdn.jsdelivr.net/npm/topojson-client@3/+esm')

  const countries = feature(world, world.objects.countries)

  // Country id → ISO lookup (numeric codes)
  const ISO_NUMERIC = {
    '826':'GBR','840':'USA','784':'ARE','392':'JPN','036':'AUS',
    '356':'IND','076':'BRA','124':'CAN','276':'DEU','250':'FRA',
    '528':'NLD','702':'SGP','156':'CHN','710':'ZAF','566':'NGA',
    '682':'SAU','404':'KEN','484':'MEX','620':'PRT','724':'ESP',
    '380':'ITA','56':'BEL','620':'PRT','616':'POL','804':'UKR',
    '643':'RUS','792':'TUR','818':'EGY','012':'DZA','504':'MAR',
    '364':'IRN','050':'BGD','144':'LKA','586':'PAK','608':'PHL',
    '458':'MYS','360':'IDN','764':'THA','704':'VNM','410':'KOR',
  }

  // Draw countries
  const countryPaths = svg.selectAll('.country')
    .data(countries.features)
    .join('path')
    .attr('class', d => {
      const iso = ISO_NUMERIC[d.id] || ''
      return 'country' + (HIGHLIGHT_ISO.has(iso) ? ' highlighted' : '')
    })
    .attr('d', path)

  // Country borders mesh
  svg.append('path')
    .datum(mesh(world, world.objects.countries, (a,b) => a !== b))
    .attr('fill','none')
    .attr('stroke','rgba(255,255,255,.14)')
    .attr('stroke-width','.35')
    .attr('d', path)

  // ── Draw arcs ──
  const arcG = svg.append('g').attr('class','arcs-layer')
  ARCS.forEach(([a,b]) => {
    const c1 = CITIES[a].coord
    const c2 = CITIES[b].coord
    // Great-circle arc via interpolation
    const line = d3.geoInterpolate(c1, c2)
    const arcPoints = d3.range(0,1.01,.02).map(t => line(t))
    const arcPath = d3.line()
      .x(d => projection(d)?.[0])
      .y(d => projection(d)?.[1])
    arcG.append('path')
      .datum(arcPoints)
      .attr('class','arc-path')
      .attr('d', arcPath)
  })

  // ── Draw city dots ──
  Object.entries(CITIES).forEach(([key, city]) => {
    const [x, y] = projection(city.coord) || [0,0]
    if (!x || !y) return

    const g = svg.append('g').attr('class',`city-group cg-${key}`)

    // Rings
    g.append('circle').attr('class','dot-ring1').attr('cx',x).attr('cy',y).attr('r',2.5)
    g.append('circle').attr('class','dot-ring2').attr('cx',x).attr('cy',y).attr('r',2.5)
    g.append('circle').attr('class','dot-core').attr('cx',x).attr('cy',y).attr('r',2.5)

    // Small city label
    g.append('text')
      .attr('class','city-label')
      .attr('x', x + 6)
      .attr('y', y + 3)
      .text(city.label)

    // Position corresponding badge relative to SVG container
    const badge = document.querySelector(`.badge[data-city="${key}"]`)
    if (badge) {
      // Convert SVG coords to percentage of container
      const pctX = (x / W) * 100
      const pctY = (y / H) * 100
      // Compute badge offset so it appears above/beside dot
      const bw = 170 // approx badge width px
      const bh = 44  // approx badge height px

      // Use pixel offsets from dot
      badge.style.position = 'absolute'
      badge.style.left = `calc(${pctX}% + ${city.bdx}px)`
      badge.style.top  = `calc(${pctY}% + ${city.bdy}px)`
    }
  })

  // Fade in SVG
  requestAnimationFrame(() => {
    document.getElementById('map-svg').classList.add('ready')
  })

  // Trigger badge entrance after map loads
  setTimeout(() => {
    const badges = document.querySelectorAll('.badge')
    badges.forEach((b, i) => {
      setTimeout(() => {
        b.classList.add('show')
        setTimeout(() => b.classList.add('float'), 700)
      }, i * 120)
    })
  }, 800)
}

// ── Observe section, draw when visible ──
const mapObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      drawMap().catch(err => {
        console.warn('Map load error:', err)
        document.getElementById('mapLoading') && (document.getElementById('mapLoading').textContent = 'Map unavailable')
      })
      mapObs.disconnect()
    }
  })
}, { threshold: 0.05 })

mapObs.observe(document.getElementById('worldwide'))

/* Smooth anchors */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'))
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth' }) }
  })
})

document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector('.nx-floating-video');
    const targetCard = document.getElementById('nx-target-slot');
    const contentArea = document.querySelector('.nx-content-area');
    const dimOverlay = document.querySelector('.nx-dim-overlay');
    const textLayer = document.querySelector('.nx-sticky-text-layer');
    const words = document.querySelectorAll('.nx-word');
    const updateAnimation = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        /* =========================================
           1. VIDEO DOCKING LOGIC
           ========================================= */
        let dockProgress = scrollY / windowHeight;
        dockProgress = Math.max(0, Math.min(1, dockProgress));
        const rect = targetCard.getBoundingClientRect();
        const currentWidth = window.innerWidth - ((window.innerWidth - rect.width) * dockProgress);
        const currentHeight = windowHeight - ((windowHeight - rect.height) * dockProgress);
        const currentX = rect.left * dockProgress;
        const currentY = rect.top * dockProgress;
        const currentRadius = 4 * dockProgress;
        video.style.width = `${currentWidth}px`;
        video.style.height = `${currentHeight}px`;
        video.style.transform = `translate(${currentX}px, ${currentY}px)`;
        video.style.borderRadius = `${currentRadius}px`;
        /* =========================================
           2. TEXT & DIM OVERLAY REVEAL
           ========================================= */
        // Wait until the docking scroll is almost done to start fading in the background dim
        const postDockScroll = Math.max(0, scrollY - (windowHeight * 0.8));
        const textRevealProgress = Math.min(1, postDockScroll / 400);

        dimOverlay.style.opacity = textRevealProgress;
        // Animate words sliding up beautifully
        words.forEach((word, index) => {
            const delay = index * 0.15;
            let wordProgress = (textRevealProgress - delay) * 2;
            wordProgress = Math.max(0, Math.min(1, wordProgress));

            // Custom ease-out curve
            const easeOut = 1 - Math.pow(1 - wordProgress, 4);

            // Slides from Y:120% and Rotate:4deg down to 0
            const translateY = (1 - easeOut) * 120;
            const rotateZ = (1 - easeOut) * 4;

            word.style.transform = `translateY(${translateY}%) rotateZ(${rotateZ}deg)`;
        });
        /* =========================================
           3. SECTION EXIT LOGIC
           Makes the fixed text and dim overlay scroll away naturally
           when you reach the bottom of the grid.
           ========================================= */
        const contentBottom = contentArea.offsetTop + contentArea.offsetHeight;
        const scrollBottom = scrollY + windowHeight;

        let layerExitTranslate = 0;
        if (scrollBottom > contentBottom) {
            // Push the fixed layers UP by the exact amount scrolled past the section
            layerExitTranslate = contentBottom - scrollBottom;
        }

        textLayer.style.transform = `translateY(${layerExitTranslate}px)`;
        dimOverlay.style.transform = `translateY(${layerExitTranslate}px)`;
    };
    window.addEventListener('scroll', updateAnimation);
    window.addEventListener('resize', updateAnimation);
    updateAnimation(); // Initial setup
});


/* ================= PREMIUM ABOUT — STABLE / REVERSIBLE ================= */
(() => {
  const section = document.querySelector(".premium-about");
  if (!section) return;

  const slides = Array.from(section.querySelectorAll(".content-slide"));
  const cards = Array.from(section.querySelectorAll(".visual-card"));
  const progressBar = section.querySelector(".scroll-progress");

  // Desktop now has only 2 states. Mobile intentionally uses state 0 only.
  const imageData = [
    [
      "./assets/homeimages/teamh1.JPG",
      "./assets/homeimages/teamh2.JPG",
      "./assets/homeimages/teamh3.JPG"
    ],
    [
      "./assets/homeimages/teamh4.JPG",
      "./assets/homeimages/teamh5.JPG",
      "./assets/homeimages/teamh6.JPG"
    ]
  ];

  // Preload both desktop states so reverse scrolling never reveals empty cards.
  imageData.flat().forEach((src) => {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  });

  let currentIndex = -1;
  let ticking = false;

  function setState(index) {
    index = Math.max(0, Math.min(index, 1));
    if (index === currentIndex) return;
    currentIndex = index;

    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));

    const img1 = document.getElementById("img1");
    const img2 = document.getElementById("img2");
    const img3 = document.getElementById("img3");
    if (img1) img1.src = imageData[index][0];
    if (img2) img2.src = imageData[index][1];
    if (img3) img3.src = imageData[index][2];

    // No delayed timeout: delayed swaps were the main reason reverse scroll could
    // leave cards temporarily blank/in the wrong state.
    cards.forEach((card) => {
      card.classList.remove("inactive");
      card.classList.add("active");
    });
  }

  function update() {
    ticking = false;

    // Mobile = one stable section, no slide switching at all.
    if (window.matchMedia("(max-width: 900px)").matches) {
      if (progressBar) progressBar.style.width = "0%";
      setState(0);
      return;
    }

    const rect = section.getBoundingClientRect();
    const viewport = window.innerHeight;
    const travel = Math.max(1, section.offsetHeight - viewport);
    const scrolled = Math.min(travel, Math.max(0, -rect.top));
    const p = scrolled / travel;

    if (progressBar) progressBar.style.width = `${p * 100}%`;
    setState(p < 0.68 ? 0 : 1);
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  window.addEventListener("pageshow", requestUpdate);
  requestUpdate();
})();

// ------------------------------------------------------------- Testimonials ---------------------------------------------------------------------------------

const reviews = [
  { q: "Working with Qrious Curators has been an outstanding experience. What truly sets them apart is their content quality — every post feels thoughtfully crafted, visually compelling, and perfectly aligned with our brand voice.", name: "Harsh Jain", role: "Verified Google Review", initials: "HJ" },
  { q: "If you want jaw dropping graphics for your wedding, call Qrious Curators. Period.", name: "Kanika Agarwal", role: "Local Guide · Verified Review", initials: "KA", guide: true },
  { q: "Qrious Curators were my complete wedding digital planner — trust me they killed it. What an e-invite they made and all my social media countdowns were on point.", name: "Akshat Goyal", role: "Local Guide · Verified Review", initials: "AG", guide: true },
  { q: "We recently worked with Qrious for photo editing and retouching of around 150 images. Excellent communication throughout and great quality work.", name: "Angie Ng", role: "Verified Google Review", initials: "AN" },
  { q: "I highly recommend Qrious Curators. The experience was smooth, clear and I am satisfied about the result. The team always goes an extra mile.", name: "Lina Stanule", role: "Local Guide · Verified Review", initials: "LS", guide: true },
  { q: "We are a family business since 50+ years and always relied on word of mouth — but because of Qrious Curators we got a way to digital marketing. Their services are extremely personalised.", name: "MDI Nikita Punjabi", role: "Verified Google Review", initials: "NP" },
  { q: "I have been working with Team QC for 9 months. Their work is actually good, the team is proactive, and they've helped my brand Jain Textile gain a strong online presence.", name: "Harshit Sethi", role: "Verified Google Review", initials: "HS" },
  { q: "Have been their client since past 1 year and everything has been beyond perfect! The team is knowledgeable and very good at what they do.", name: "Prerna Daryanani", role: "Verified Google Review", initials: "PD" },
  { q: "One of the best digital marketing and branding agencies in Jaipur. Their expertise in social media, content creation, website development, and brand strategy drives real growth.", name: "Suniti Verma", role: "Verified Google Review", initials: "SV" },
  { q: "Qrious Curators have been fantastic for our brand! Their creative strategies boosted our engagement and reach quickly. They're responsive, transparent, and really understand our goals.", name: "Javed Ahmed Khan", role: "Local Guide · Verified Review", initials: "JK", guide: true },
  { q: "I got my website work done from Qrious Curators. They completed the project on time and as per my expectations. Highly recommended!", name: "Heeralal Soni", role: "Verified Google Review", initials: "HS" },
  { q: "Great work by Abhay and Team for their seamless efforts for my newly launched brand. I'd also like to highlight Social Media Manager Preeti for her outstanding work.", name: "Kanu Sharma", role: "Verified Google Review", initials: "KS" },
  { q: "Excellent digital marketing services! Their strategies significantly improved our online visibility and drove real results. A professional and reliable team.", name: "Ishika Jhalani", role: "Verified Google Review", initials: "IJ" },
  { q: "Outstanding social media marketing services! They crafted innovative campaigns that boosted our engagement and reach significantly.", name: "Kumkum Chauhan", role: "Verified Google Review", initials: "KC" },
  { q: "Good service and nice experience. The team is helpful and professional. One of the best digital marketing agencies in Jaipur.", name: "Yashika Chouhan", role: "Verified Google Review", initials: "YC" },
  { q: "Excellent services and very well trained staff. Behaviour is polite and they complete projects on due dates.", name: "Prapti Dave", role: "Verified Google Review", initials: "PD" },
];

function buildCard(d) {
  return `<div class="t-card">
    <div class="t-stars">${'★'.repeat(5).split('').map(s => `<span class="t-star">${s}</span>`).join('')}</div>
    <p class="t-quote">${d.q}</p>
    <div class="t-author">
      <div class="t-avatar">${d.initials}</div>
      <div>
        <p class="t-name">${d.name}</p>
        <p class="t-role">${d.role}</p>
        ${d.guide ? `<div class="t-badge"><span class="t-g-dot"></span>Local Guide</div>` : ''}
      </div>
    </div>
  </div>`;
}

const half = Math.ceil(reviews.length / 2);
const h1 = reviews.slice(0, half).map(buildCard).join('');
const h2 = reviews.slice(half).map(buildCard).join('');
document.getElementById('r1').innerHTML = h1 + h1;
document.getElementById('r2').innerHTML = h2 + h2;

// ------------------ Testimonials ------------------




/* =========================================================
   CINEMATIC SERVICES SECTION JS — REVISIT FIXED VERSION
   Requires:
   gsap.min.js
   ScrollTrigger.min.js

   Use this instead of the previous qc-cine JS.
========================================================= */

(function () {
  window.addEventListener("load", function () {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.error("GSAP or ScrollTrigger is not loaded.");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /*
      Prevent duplicate timelines if this file is loaded twice
      or if you are testing with hot reload.
    */
    qcKillOldCinematicTriggers();

    qcInitCinematicServices();
    qcInitExperienceCards();
    qcRefreshAfterImages();
  });


  function qcKillOldCinematicTriggers() {
    const oldServicesTrigger = ScrollTrigger.getById("qc-cinematic-services");
    const oldExperienceTrigger = ScrollTrigger.getById("qc-experience-cards");

    if (oldServicesTrigger) oldServicesTrigger.kill(true);
    if (oldExperienceTrigger) oldExperienceTrigger.kill(true);

    gsap.killTweensOf([
      "#qcCineTrack",
      "#qcCineClone",
      "#qcCineClone img",
      "#qcCineSource",
      ".qc-cine-panel",
      ".qc-cine-panel-last .qc-cine-content",
      ".qc-cine-panel-last .qc-cine-num",
      ".qc-floating-card",
      ".qc-exp-kicker",
      ".qc-exp-sub",
      ".qc-exp-line",
      ".qc-exp-copy"
    ]);
  }


  /* =========================================================
     PART 1 + PART 2
     Horizontal service scroll + last card image fullscreen takeover
     (REWRITTEN — fast, gap-free, Apple-style takeover)
  ========================================================= */

  function qcInitCinematicServices() {
    const section = document.querySelector("#qc-cine-services");
    const track = document.querySelector("#qcCineTrack");
    const sourceBox = document.querySelector("#qcCineSource");
    const sourceImg = document.querySelector("#qcCineImage");
    const clone = document.querySelector("#qcCineClone");
    const cloneBaseImg = clone ? clone.querySelector(".qc-cine-clone-img-base") : null;
    const cloneNextImg = clone ? clone.querySelector(".qc-cine-clone-img-next") : null;

    if (
      !section || !track || !sourceBox || !sourceImg ||
      !clone || !cloneBaseImg || !cloneNextImg
    ) {
      console.error("Cinematic services elements missing.");
      return;
    }

    // Always mirror whatever image is actually loaded in the panel,
    // so the clone never shows a stale / placeholder src.
    cloneBaseImg.src = sourceImg.currentSrc || sourceImg.src;

    const panels = gsap.utils.toArray(".qc-cine-panel");
    const previousPanels = panels.slice(0, -1);
    const lastPanelContent = document.querySelectorAll(
      ".qc-cine-panel-last .qc-cine-content, .qc-cine-panel-last .qc-cine-num"
    );

    /* ---------- math helpers ---------- */
    const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
    const norm = (v, a, b) => clamp01((v - a) / (b - a));
    const lerp = (a, b, t) => a + (b - a) * t;
    const smooth = (t) => { t = clamp01(t); return t * t * (3 - 2 * t); };

    function getMaxShift() {
      return Math.max(0, track.scrollWidth - window.innerWidth);
    }

    function getSourceRadius() {
      return parseFloat(window.getComputedStyle(sourceBox).borderRadius) || 38;
    }

    /* ---------------------------------------------------------
       TIMELINE MAP (progress 0 -> 1 across the pinned scroll)
       0.00 – 0.62   horizontal card scroll
       0.62 – 0.84   image expands from its own rect to fullscreen
       0.78 – 0.90   optional crossfade to a second "reveal" image
       0.90 – 1.00   short settle, then unpin straight into next section
    --------------------------------------------------------- */
    const HORIZONTAL_END = 0.62;
    const EXPAND_START = 0.62;
    const EXPAND_END = 0.84;
    const SWAP_START = 0.78;
    const SWAP_END = 0.90;

    function getScrollDistance() {
      // Shorter total pin distance: enough for the horizontal scroll,
      // plus roughly one viewport for the takeover + settle.
      return Math.max(3400, getMaxShift() + window.innerHeight * 1.15);
    }

    function forceStartState() {
      gsap.set(track, { x: 0, force3D: true });

      gsap.set(sourceBox, { autoAlpha: 1 });
      gsap.set(previousPanels, { autoAlpha: 1 });
      gsap.set(lastPanelContent, { autoAlpha: 1, y: 0 });

      gsap.set(clone, {
        autoAlpha: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        borderRadius: getSourceRadius(),
        transformOrigin: "top left",
        force3D: true
      });

      gsap.set(cloneBaseImg, {
        opacity: 1,
        scale: 1.04,
        transformOrigin: "center center",
        force3D: true
      });

      gsap.set(cloneNextImg, {
        opacity: 0,
        scale: 1.08,
        transformOrigin: "center center",
        force3D: true
      });
    }

    forceStartState();

    /* ---------------------------------------------------------
       Single render function driven purely by scroll progress.
       No independent tweens with their own durations — everything
       is a direct function of `progress`, so the clone's position
       and the source's visibility can never drift out of sync.
    --------------------------------------------------------- */
    function renderServices(progress) {
      progress = clamp01(progress);
      const maxShift = getMaxShift();

      // PHASE 1 — horizontal scroll through the cards
      const hProgress = smooth(norm(progress, 0, HORIZONTAL_END));
      gsap.set(track, { x: -maxShift * hProgress, force3D: true });

      if (progress < EXPAND_START) {
        // Nothing has taken over yet. Clone stays fully hidden so it
        // can't accidentally paint anything over the cards.
        gsap.set(sourceBox, { autoAlpha: 1 });
        gsap.set(previousPanels, { autoAlpha: 1 });
        gsap.set(lastPanelContent, { autoAlpha: 1, y: 0 });
        gsap.set(clone, {
          autoAlpha: 0, x: 0, y: 0, width: 0, height: 0,
          borderRadius: getSourceRadius()
        });
        gsap.set(cloneBaseImg, { opacity: 1, scale: 1.04 });
        gsap.set(cloneNextImg, { opacity: 0, scale: 1.08 });
        return;
      }

      // Track is fully scrolled and stays locked for the rest of the pin.
      gsap.set(track, { x: -maxShift, force3D: true });

      // KEY FIX #1 — measure the source's real on-screen rect fresh,
      // every frame, right before using it. At progress === EXPAND_START
      // the lerp below evaluates to exactly this rect, so the clone
      // materializes pixel-perfectly on top of the source in the same
      // frame it becomes visible. There is no frame where the clone is
      // mis-sized relative to the source.
      const sourceRect = sourceBox.getBoundingClientRect();
      const expandProgress = smooth(norm(progress, EXPAND_START, EXPAND_END));

      const currentX = lerp(sourceRect.left, 0, expandProgress);
      const currentY = lerp(sourceRect.top, 0, expandProgress);
      const currentW = lerp(sourceRect.width, window.innerWidth, expandProgress);
      const currentH = lerp(sourceRect.height, window.innerHeight, expandProgress);
      const currentRadius = lerp(getSourceRadius(), 0, expandProgress);

      gsap.set(clone, {
        autoAlpha: 1,
        x: currentX,
        y: currentY,
        width: currentW,
        height: currentH,
        borderRadius: currentRadius,
        force3D: true
      });

      // KEY FIX #2 — the source panel only fades out AFTER the clone is
      // already glued on top of it (same rect, higher z-index in CSS).
      // Visually you're always looking at *something* covering that
      // spot — either the real panel or the clone — never neither.
      const chromeFade = norm(progress, EXPAND_START, EXPAND_START + 0.05);
      gsap.set(sourceBox, { autoAlpha: 1 - chromeFade });
      gsap.set(previousPanels, { autoAlpha: 1 - chromeFade });
      gsap.set(lastPanelContent, { autoAlpha: 1 - chromeFade, y: -40 * chromeFade });

      // PHASE 2b — optional crossfade to a second "reveal" image once
      // the clone is basically fullscreen. Delete this block (and the
      // cloneNextImg element) if you only want a single-image takeover.
      const swapProgress = smooth(norm(progress, SWAP_START, SWAP_END));
      gsap.set(cloneBaseImg, {
        opacity: 1 - swapProgress,
        scale: lerp(1.04, 1.12, expandProgress)
      });
      gsap.set(cloneNextImg, {
        opacity: swapProgress,
        scale: lerp(1.08, 1.03, swapProgress)
      });

      // Snap to exact fullscreen values once fully expanded so there's
      // no sub-pixel drift on resize/refresh.
      if (progress >= EXPAND_END) {
        gsap.set(clone, {
          autoAlpha: 1, x: 0, y: 0,
          width: window.innerWidth, height: window.innerHeight,
          borderRadius: 0
        });
      }
    }

    ScrollTrigger.create({
      id: "qc-cinematic-services",
      trigger: section,
      start: "top top",
      end: () => "+=" + getScrollDistance(),
      pin: true,
      scrub: true,          // direct 1:1 scrub — no smoothing lag to desync from
      anticipatePin: 1,
      invalidateOnRefresh: true,
      markers: false,

      onUpdate: (self) => renderServices(self.progress),
      onEnter: (self) => renderServices(self.progress),
      onEnterBack: (self) => renderServices(self.progress),

      onLeave: () => {
        // Land on the exact fullscreen frame, then release immediately —
        // no lingering hold before the next section appears.
        renderServices(1);
        gsap.set(clone, { autoAlpha: 0 });
      },

      onLeaveBack: () => {
        renderServices(0);
      },

      onRefresh: (self) => {
        renderServices(self.progress);
        if (!self.isActive && self.progress >= 1) {
          gsap.set(clone, { autoAlpha: 0 });
        }
      }
    });
  }


  /* =========================================================
     PART 3 + PART 4
     Sticky text + floating cards
  ========================================================= */

  function qcInitExperienceCards() {
    const section = document.querySelector("#qc-cine-experience");
    const sticky = document.querySelector(".qc-cine-experience-sticky");
    const cards = gsap.utils.toArray(".qc-floating-card");

    if (!section || !sticky || !cards.length) {
      console.error("Experience cards elements missing.");
      return;
    }

    function resetExperienceToStart() {
      gsap.set(cards, {
        autoAlpha: 0,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        clearProps: "visibility,opacity,transform"
      });

      gsap.set(".qc-exp-kicker", {
        autoAlpha: 0,
        y: 20
      });

      gsap.set(".qc-exp-sub", {
        autoAlpha: 0,
        y: 26
      });

      gsap.set(".qc-exp-line", {
        yPercent: 115,
        rotateX: 12,
        transformOrigin: "center bottom"
      });

      gsap.set(".qc-exp-copy", {
        scale: 1,
        autoAlpha: 1
      });
    }

    function resetExperienceToEnd() {
      gsap.set(cards, {
        autoAlpha: 0
      });

      gsap.set(".qc-exp-kicker", {
        autoAlpha: 1,
        y: 0
      });

      gsap.set(".qc-exp-sub", {
        autoAlpha: 1,
        y: 0
      });

      gsap.set(".qc-exp-line", {
        yPercent: 0,
        rotateX: 0
      });

      gsap.set(".qc-exp-copy", {
        scale: 0.965,
        autoAlpha: 1
      });
    }

    gsap.set(cards, {
      autoAlpha: 0,
      force3D: true,
      transformOrigin: "center center"
    });

    gsap.set(".qc-exp-kicker", {
      autoAlpha: 0,
      y: 20
    });

    gsap.set(".qc-exp-sub", {
      autoAlpha: 0,
      y: 26
    });

    gsap.set(".qc-exp-line", {
      yPercent: 115,
      rotateX: 12,
      transformOrigin: "center bottom"
    });

    gsap.set(".qc-exp-copy", {
      scale: 1,
      autoAlpha: 1
    });


    const enterStates = [
      { x: -360, y: 80, rotation: -8, scale: 0.86 },
      { x: 0, y: 320, rotation: 5, scale: 0.74 },
      { x: 360, y: 70, rotation: 7, scale: 0.86 },

      { x: -330, y: -90, rotation: 8, scale: 0.84 },
      { x: 330, y: 120, rotation: -6, scale: 0.86 },
      { x: 40, y: 330, rotation: 5, scale: 0.78 },

      { x: 360, y: -70, rotation: 9, scale: 0.84 },
      { x: -380, y: 160, rotation: -9, scale: 0.84 },
      { x: 300, y: 260, rotation: 6, scale: 0.78 }
    ];

    const activeStates = [
      { x: 0, y: 0, rotation: -3, scale: 1 },
      { x: 0, y: 0, rotation: 2, scale: 1 },
      { x: 0, y: 0, rotation: 4, scale: 1 },

      { x: 0, y: 0, rotation: 3, scale: 1 },
      { x: 0, y: 0, rotation: -3, scale: 1 },
      { x: 0, y: 0, rotation: 2, scale: 1 },

      { x: 0, y: 0, rotation: 4, scale: 1 },
      { x: 0, y: 0, rotation: -4, scale: 1 },
      { x: 0, y: 0, rotation: 3, scale: 1 }
    ];

    const exitStates = [
      { x: -260, y: -180, rotation: -14, scale: 0.82 },
      { x: 40, y: -320, rotation: 8, scale: 0.82 },
      { x: 300, y: -140, rotation: 12, scale: 0.82 },

      { x: -300, y: 180, rotation: -8, scale: 0.82 },
      { x: 320, y: -210, rotation: 9, scale: 0.82 },
      { x: 80, y: -330, rotation: -7, scale: 0.82 },

      { x: 300, y: -180, rotation: 13, scale: 0.82 },
      { x: -320, y: -170, rotation: -12, scale: 0.82 },
      { x: 260, y: -260, rotation: 9, scale: 0.82 }
    ];


    const tl = gsap.timeline({
      defaults: {
        ease: "none"
      },
      scrollTrigger: {
        id: "qc-experience-cards",
        trigger: section,
        start: "top top",
        end: function () {
          return "+=" + Math.max(4200, window.innerHeight * 4.4);
        },
        scrub: 1,
        pin: sticky,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: false,

        onEnter: function () {
          if (this.progress === 0) {
            resetExperienceToStart();
          }
        },

        onLeave: function () {
          resetExperienceToEnd();
        },

        onEnterBack: function () {
          resetExperienceToEnd();
        },

        onLeaveBack: function () {
          resetExperienceToStart();
        },

        onRefresh: function (self) {
          if (self.progress === 0) {
            resetExperienceToStart();
          }
        }
      }
    });


    /*
      Sticky text reveal.
    */
    tl.to(
      ".qc-exp-kicker",
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.28,
        ease: "power2.out"
      },
      0
    );

    tl.to(
      ".qc-exp-line",
      {
        yPercent: 0,
        rotateX: 0,
        duration: 0.62,
        stagger: 0.08,
        ease: "power3.out"
      },
      0.05
    );

    tl.to(
      ".qc-exp-sub",
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      },
      0.35
    );

    tl.to(
      ".qc-exp-copy",
      {
        scale: 0.965,
        duration: 3.4,
        ease: "none"
      },
      0.48
    );


    function animateGroup(indexes, startTime, exitTime, isLastGroup) {
      indexes.forEach(function (cardIndex, slotIndex) {
        const card = cards[cardIndex];
        const delay = slotIndex * 0.075;

        tl.fromTo(
          card,
          {
            autoAlpha: 0,
            ...enterStates[cardIndex]
          },
          {
            autoAlpha: 1,
            ...activeStates[cardIndex],
            duration: 0.48,
            ease: "power3.out"
          },
          startTime + delay
        );

        tl.to(
          card,
          {
            autoAlpha: 0,
            ...exitStates[cardIndex],
            duration: isLastGroup ? 0.52 : 0.4,
            ease: "power2.in"
          },
          exitTime + delay
        );
      });
    }


    /*
      0% - 30%: cards 1, 2, 3
      30% - 60%: cards 4, 5, 6
      60% - 100%: cards 7, 8, 9
    */
    animateGroup([0, 1, 2], 0.68, 1.35, false);
    animateGroup([3, 4, 5], 1.52, 2.24, false);
    animateGroup([6, 7, 8], 2.48, 3.34, true);

    tl.to({}, { duration: 0.35 });
  }


  /* =========================================================
     REFRESH HANDLING
  ========================================================= */

  function qcRefreshAfterImages() {
    const images = document.querySelectorAll(
      "#qc-cine-services img, #qc-cine-experience img"
    );

    images.forEach(function (img) {
      if (!img.complete) {
        img.addEventListener(
          "load",
          function () {
            ScrollTrigger.refresh();
          },
          { once: true }
        );

        img.addEventListener(
          "error",
          function () {
            ScrollTrigger.refresh();
          },
          { once: true }
        );
      }
    });

    let resizeTimer;

    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(function () {
        ScrollTrigger.refresh();
      }, 250);
    });

    setTimeout(function () {
      ScrollTrigger.refresh();
    }, 300);

    setTimeout(function () {
      ScrollTrigger.refresh();
    }, 1000);
  }
})();
 const form = document.getElementById('contactForm');
  const statusMsg = document.getElementById('statusMsg');
  const submitBtn = document.getElementById('submitBtn');
 
  form.addEventListener('submit', function(e){
    e.preventDefault();
    submitBtn.disabled = true;
    statusMsg.textContent = 'Sending...';
 
    // Simulated submit — replace with a real endpoint call as needed
    setTimeout(() => {
      statusMsg.textContent = 'Thanks — we will be in touch shortly.';
      submitBtn.disabled = false;
      form.reset();
    }, 900);
  });