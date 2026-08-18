// Responsive About Page Interactions
// Desktop: keeps GSAP horizontal journey.
// Mobile/tablet: converts journey into clean vertical sections to prevent overlap.
(function () {
  'use strict';

  const MOBILE_QUERY = '(max-width: 900px)';
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;
  const initialModeIsMobile = isMobile;

  const cardsData = [
    {
      id: 1,
      x: -600,
      y: -500,
      r: 0,
      year: '2022',
      title: 'Two people. One idea. A lot of let’s try.',
      tag: 'THE START',
      desc: 'It started with Abhay and Bhavana and the belief that brands deserve more than random digital work.',
      metric: 'FOUNDERS · FIRST BRANDS · BIG DREAMS',
      image: './images/artboard-7.jpeg'
    },
    {
      id: 2,
      x: 600,
      y: -500,
      r: 0,
      year: '2023',
      title: 'The first few brands taught us everything.',
      tag: 'THE REALITY CHECK',
      desc: "Every brief, every change, every campaign, every 'can this go live today?' helped us understand what growing brands actually need.",
      metric: 'LEARNING · TESTING · FIXING',
      image: './images/artboard-12.jpeg'
    },
    {
      id: 3,
      x: 1000,
      y: 0,
      r: 90,
      year: '2024',
      title: 'Clients became conversations, not just projects.',
      tag: 'THE PEOPLE PART',
      desc: 'Working closely with business owners made us realise that marketing works better when you understand the people behind the brand first.',
      metric: 'TRUST · RELATIONSHIPS · REAL STORIES',
      image: './images/artboard-19.jpeg'
    },
    {
      id: 4,
      x: 600,
      y: 500,
      r: 180,
      year: '2025',
      title: 'Then came the team, and the office got louder.',
      tag: 'THE TEAM PHASE',
      desc: 'More minds joined in. More ideas, more opinions, more laughs, more deadlines, and somehow, better work every time.',
      metric: 'TEAM · CHAOS · CULTURE',
      image: './images/artboard-18.jpeg'
    },
    {
      id: 5,
      x: -600,
      y: 500,
      r: 180,
      year: '2026',
      title: 'From posts to full brand worlds.',
      tag: 'THE GROWTH',
      desc: 'What started with digital marketing grew into social media, shoots, websites, branding, campaigns, ads, and everything brands need to show up better.',
      metric: 'CONTENT · DESIGN · GROWTH',
      image: './images/artboard-6.jpeg'
    },
    {
      id: 6,
      x: -1000,
      y: 0,
      r: 270,
      year: 'NOW',
      title: 'Still learning. Still building. Still curious.',
      tag: 'RIGHT NOW',
      desc: 'The journey is still moving, with bigger ideas, better systems, a growing team, and brands we genuinely care about.',
      metric: 'NEXT CHAPTER · SAME ENERGY',
      image: './images/artboard-13.jpeg'
    }
  ];

  function injectJourneyCards() {
    const trackFrame = document.querySelector('.track-frame');
    if (!trackFrame) return;

    trackFrame.querySelectorAll('.card-container').forEach((card) => card.remove());

    cardsData.forEach((card) => {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'card-container';
      cardContainer.style.setProperty('--x', `${card.x}px`);
      cardContainer.style.setProperty('--y', `${card.y}px`);
      cardContainer.style.setProperty('--r', `${card.r}deg`);

      cardContainer.innerHTML = `
        <div class="card" data-id="${card.id}">
          <div class="card-info">
            <div class="card-header">
              <span class="card-year">${card.year}</span>
              <span class="card-tag">${card.tag}</span>
            </div>
            <div class="card-body">
              <h3 class="card-title">${card.title}</h3>
              <p class="card-desc">${card.desc}</p>
            </div>
            <div class="card-footer">
              <div class="card-meta"><span>${card.metric}</span></div>
            </div>
          </div>
          <div class="card-media">
            <img src="${card.image}" alt="${card.title}" loading="lazy" />
          </div>
        </div>
      `;

      trackFrame.appendChild(cardContainer);
    });
  }

  function setActiveCard(index) {
    document.querySelectorAll('.dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });

    document.querySelectorAll('.panel-works-track .card').forEach((card, idx) => {
      card.classList.toggle('active', idx === index);
    });

    const progressNum = document.querySelector('.works-hud .progress-num');
    if (!progressNum) return;

    if (index >= 0) {
      const formattedNum = (index + 1).toString().padStart(2, '0');
      progressNum.textContent = `${formattedNum} / 06`;
    } else {
      progressNum.textContent = 'INTRO / 06';
    }
  }

  function getFrameTransformForCard(card) {
    const theta = card.r;
    const phi = -theta * (Math.PI / 180);
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const rotatedX = card.x * cosPhi - card.y * sinPhi;
    const rotatedY = card.x * sinPhi + card.y * cosPhi;

    return {
      x: -rotatedX,
      y: -rotatedY,
      rotation: -theta
    };
  }

  function initLenis() {
    if (typeof Lenis === 'undefined') return null;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.07
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);

      if (typeof gsap !== 'undefined') {
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }
    }

    return lenis;
  }

  function initDesktopJourney() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const section = document.querySelector('.about-horizontal');
    const track = document.querySelector('.horizontal-track');
    const worksPanel = document.querySelector('.panel-works-track');

    if (!section || !track || !worksPanel) return;

    document.body.classList.add('qc-desktop-mode');
    document.body.classList.remove('qc-mobile-mode');

    const lenis = initLenis();

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + (window.innerWidth * 3 + 5500),
        scrub: 1.5,
        pin: '.about-pin',
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const timelineTime = self.progress * 18.5;

          if (timelineTime >= 1.8 && timelineTime <= 13.8) {
            const worksProgress = (timelineTime - 1.8) / 12.0;
            gsap.to('.works-hud .progress-fill', {
              width: `${worksProgress * 100}%`,
              duration: 0.3,
              ease: 'power1.out'
            });
          }
        }
      }
    });

    tl.set('.panel-works-track .track-frame', {
      scale: 0.5,
      x: 0,
      y: 0,
      rotation: -15
    }, 0);

    tl.to('.seed-circle', {
      scale: 0.2,
      opacity: 0,
      duration: 0.3,
      ease: 'none'
    }, 0);

    tl.to('.circle-reveal', {
      scale: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, 0);

    tl.to('.bg-orb', {
      scale: 1.35,
      opacity: 0.4,
      duration: 0.8,
      ease: 'none'
    }, 0);

    tl.to(track, {
      x: '-100vw',
      duration: 1.0,
      ease: 'power2.inOut'
    }, 0.8);

    tl.to('.works-dots, .works-hud', {
      opacity: 1,
      pointerEvents: 'auto',
      duration: 0.6,
      ease: 'power1.out'
    }, 1.2);

    tl.to('.panel-works-track .intro-container', {
      opacity: 0,
      y: -60,
      duration: 0.8,
      ease: 'power2.inOut'
    }, 1.8);

    const firstCardTransform = getFrameTransformForCard(cardsData[0]);
    tl.to('.panel-works-track .track-frame', {
      scale: 1,
      x: firstCardTransform.x,
      y: firstCardTransform.y,
      rotation: firstCardTransform.rotation,
      duration: 1.2,
      ease: 'power2.inOut'
    }, 1.8);

    tl.to({}, { duration: 0.6 }, 3.0);

    let currentTime = 3.6;
    for (let i = 1; i < cardsData.length; i += 1) {
      const target = getFrameTransformForCard(cardsData[i]);

      tl.to('.panel-works-track .track-frame', {
        x: target.x,
        y: target.y,
        rotation: target.rotation,
        duration: 1.2,
        ease: 'power2.inOut'
      }, currentTime);

      currentTime += 1.2;
      tl.to({}, { duration: 0.6 }, currentTime);
      currentTime += 0.6;
    }

    tl.to('.panel-works-track .track-frame', {
      scale: 0.5,
      x: 0,
      y: 0,
      rotation: -375,
      duration: 1.2,
      ease: 'power2.inOut'
    }, currentTime);

    tl.to('.panel-works-track .intro-container', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power2.inOut'
    }, currentTime);

    tl.to('.works-dots, .works-hud', {
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.5
    }, 13.8);

    tl.to(track, {
      x: '-200vw',
      duration: 1.7,
      ease: 'power2.inOut'
    }, 13.8);

    function getLogoTargetX() {
      const content = document.querySelector('.but-dark-content');
      if (!content) return -120;

      const rect = content.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      return rect.left + 26 - centerX;
    }

    tl.set('.brand-info', { x: 24 }, 16.4);
    tl.set('.deco-left', { opacity: 0, x: -30 }, 16.4);
    tl.set('.deco-right', { opacity: 0, x: 30 }, 16.4);

    tl.to('.but-expand-bg', {
      scale: 40,
      duration: 2,
      ease: 'power2.inOut'
    }, 16.5);

    tl.to('.but-icon', {
      x: () => getLogoTargetX(),
      duration: 1.5,
      ease: 'power3.out'
    }, 17.0);

    tl.set('.but-dark-content', { opacity: 1 }, 17.4);

    tl.to('.brand-info', {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power3.out'
    }, 17.5);

    tl.to('.brand-sub', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, 18.0);

    tl.to('.deco-left', {
      opacity: 1,
      x: 0,
      duration: 1.0,
      ease: 'power2.out'
    }, 17.8);

    tl.to('.deco-right', {
      opacity: 1,
      x: 0,
      duration: 1.0,
      ease: 'power2.out'
    }, 17.8);

    tl.call(() => setActiveCard(-1), null, 0.5);
    tl.call(() => setActiveCard(0), null, 2.0);
    tl.call(() => setActiveCard(1), null, 4.2);
    tl.call(() => setActiveCard(2), null, 6.0);
    tl.call(() => setActiveCard(3), null, 7.8);
    tl.call(() => setActiveCard(4), null, 9.6);
    tl.call(() => setActiveCard(5), null, 11.4);
    tl.call(() => setActiveCard(-1), null, 13.0);

    document.querySelectorAll('.dot').forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const times = [2.0, 4.2, 6.0, 7.8, 9.6, 11.4];
        const progress = times[index] / 18.5;
        const start = tl.scrollTrigger.start;
        const end = tl.scrollTrigger.end;
        const scrollOffset = start + progress * (end - start);

        if (lenis) {
          lenis.scrollTo(scrollOffset, {
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } else {
          window.scrollTo({ top: scrollOffset, behavior: 'smooth' });
        }
      });
    });

    if (window.matchMedia('(hover: hover)').matches) {
      let tiltRaf = null;

      worksPanel.addEventListener('mousemove', (event) => {
        if (tiltRaf) return;

        tiltRaf = requestAnimationFrame(() => {
          const rect = worksPanel.getBoundingClientRect();
          const mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          const mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

          gsap.to('.panel-works-track .track-wrapper', {
            rotationY: mouseX * 1.2,
            rotationX: -mouseY * 1.2,
            duration: 1.2,
            ease: 'power3.out',
            overwrite: 'auto'
          });

          tiltRaf = null;
        });
      });
    }

    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });
  }

  function initMobileJourney() {
    document.body.classList.add('qc-mobile-mode');
    document.body.classList.remove('qc-desktop-mode');

    setActiveCard(0);
  }

  function initCountersAndReveals() {
    const arkCounters = document.querySelectorAll('.ark-counter');

    const animateArkCounter = (counterElement) => {
      const target = Number(counterElement.dataset.target || 0);
      const duration = 1400;
      const startTime = performance.now();

      const update = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(easedProgress * target);

        counterElement.textContent = value;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counterElement.textContent = target;
        }
      };

      requestAnimationFrame(update);
    };

    if ('IntersectionObserver' in window) {
      const arkCounterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateArkCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });

      arkCounters.forEach((counterElement) => arkCounterObserver.observe(counterElement));

      const arkRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            arkRevealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18 });

      document.querySelectorAll('.ark-reveal-item').forEach((item) => arkRevealObserver.observe(item));
    } else {
      arkCounters.forEach(animateArkCounter);
      document.querySelectorAll('.ark-reveal-item').forEach((item) => item.classList.add('show'));
    }
  }

  function handleBreakpointReload() {
    let resizeTimer;

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const modeChanged = window.matchMedia(MOBILE_QUERY).matches !== initialModeIsMobile;
        if (modeChanged) window.location.reload();
      }, 250);
    });
  }

  injectJourneyCards();

  if (isMobile) {
    initMobileJourney();
  } else {
    initDesktopJourney();
  }

  initCountersAndReveals();
  handleBreakpointReload();
}());
