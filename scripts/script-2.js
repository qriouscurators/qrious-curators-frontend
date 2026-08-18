// Preloader
(function () {
  const MIN_TIME = 9000; 

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

const toggle = document.querySelector(".qc-nav__toggle");
const mobile = document.querySelector(".qc-mobile");

if (toggle && mobile) {
  toggle.addEventListener("click", () => {
    const open = mobile.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    mobile.setAttribute("aria-hidden", String(!open));
  });

  // Close on link click
  mobile.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobile.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      mobile.setAttribute("aria-hidden", "true");
    });
  });
}

// ----------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".qc-horizontal-scroll");
    const track = document.querySelector(".qc-horizontal-scroll__track");

    function updateHorizontalScroll() {
        const rect = section.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const scrollTop = window.scrollY - sectionTop;
        const maxScroll = section.offsetHeight - window.innerHeight;
        const maxTranslate = track.scrollWidth - window.innerWidth;

        let progress = scrollTop / maxScroll;
        progress = Math.max(0, Math.min(1, progress));

        const translateX = progress * maxTranslate;
        track.style.transform = `translateX(-${translateX}px)`;
    }

    window.addEventListener("scroll", updateHorizontalScroll);
    window.addEventListener("resize", updateHorizontalScroll);
    updateHorizontalScroll();
});

// ----------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    const section = document.getElementById("qcStickyCards");
    const cards = document.querySelectorAll(".qc-process-card");

    function animateStickyCards() {
        if (window.innerWidth <= 991) return;

        const rect = section.getBoundingClientRect();
        const sectionStart = window.scrollY + rect.top;
        const scrollInside = window.scrollY - sectionStart;
        const maxScroll = section.offsetHeight - window.innerHeight;

        let progress = scrollInside / maxScroll;
        progress = Math.max(0, Math.min(1, progress));

        cards.forEach((card, index) => {
            const start = index * 0.18;
            const end = start + 0.22;

            let localProgress = (progress - start) / (end - start);
            localProgress = Math.max(0, Math.min(1, localProgress));

            const translateY = 120 - (120 * localProgress);
            const scale = 0.9 + (0.1 * localProgress);
            const opacity = localProgress;

            card.style.transform = `translateY(${translateY}px) scale(${scale})`;
            card.style.opacity = opacity;
        });
    }

    window.addEventListener("scroll", animateStickyCards);
    window.addEventListener("resize", animateStickyCards);
    animateStickyCards();
});

// ----------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    const section = document.getElementById("qcTeamSection");
    const cardsLayer = document.getElementById("qcTeamCardsLayer");

    function animateTeamLayer() {
        if (window.innerWidth <= 991) return;

        const rect = section.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const scrollInside = window.scrollY - sectionTop;
        const maxScroll = section.offsetHeight - window.innerHeight;

        let progress = scrollInside / maxScroll;
        progress = Math.max(0, Math.min(1, progress));

        /* moves the whole card grid upward over the sticky heading */
        const startY = window.innerHeight * 1.2;
        const endY = -(cardsLayer.offsetHeight * 0.55);

        const currentY = startY + (endY - startY) * progress;
        cardsLayer.style.transform = `translateX(-50%) translateY(${currentY}px)`;
    }

    window.addEventListener("scroll", animateTeamLayer);
    window.addEventListener("resize", animateTeamLayer);
    animateTeamLayer();
});


const fadeElements = document.querySelectorAll(".fade-in-up");

const fadeObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{threshold:0.2});

fadeElements.forEach(el=>{
    fadeObserver.observe(el);
});


