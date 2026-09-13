"use strict";

document.addEventListener("DOMContentLoaded", () => {
        const panels = [...document.querySelectorAll(".about-story-panel")];
        const cards = [...document.querySelectorAll(".about-story-card")];
        const images = [...document.querySelectorAll(".about-story-image")];
        if (!panels.length || !cards.length || !images.length) return;
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const index = panels.indexOf(entry.target);
            if (index < 0 || !cards[index] || !images[index]) return;
            cards[index].classList.add("show");
            images.forEach((image, imageIndex) => image.classList.toggle("active", imageIndex === index));
          });
        }, { rootMargin: "-35% 0px -35% 0px", threshold: 0 });
        panels.forEach((panel) => observer.observe(panel));
      });


      
      
      (function () {
        window.addEventListener("load", function () {
          if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
            console.error("GSAP or ScrollTrigger is not loaded for QC orbit section.");
            return;
          }
      
          gsap.registerPlugin(ScrollTrigger);
      
          qcKillOldOrbitTrigger();
          qcInitLogoUSPOrbitSection();
        });
      
      
        function qcOrbitClamp(value, min, max) {
          return Math.min(Math.max(value, min), max);
        }
      
        function qcOrbitNorm(value, start, end) {
          return qcOrbitClamp((value - start) / (end - start), 0, 1);
        }
      
        function qcOrbitLerp(start, end, progress) {
          return start + (end - start) * progress;
        }
      
        function qcOrbitSmooth(progress) {
          progress = qcOrbitClamp(progress, 0, 1);
          return progress * progress * (3 - 2 * progress);
        }
      
        function qcKillOldOrbitTrigger() {
          const oldTrigger = ScrollTrigger.getById("qc-logo-orbit-trigger");
      
          if (oldTrigger) {
            oldTrigger.kill(true);
          }
      
          gsap.killTweensOf([
            "#qcOrbitSystem",
            "#qcOrbitLogo",
            ".qc-orbit-ring",
            ".qc-orbit-usp-card",
            ".qc-orbit-intro",
            ".qc-orbit-bottom-copy"
          ]);
        }
      
      
        function qcInitLogoUSPOrbitSection() {
          const section = document.querySelector("#qc-logo-orbit-section");
          const sticky = document.querySelector(".qc-logo-orbit-sticky");
          const system = document.querySelector("#qcOrbitSystem");
          const logo = document.querySelector("#qcOrbitLogo");
          const rings = gsap.utils.toArray(".qc-orbit-ring");
          const cards = gsap.utils.toArray(".qc-orbit-usp-card");
          const intro = document.querySelector(".qc-orbit-intro");
          const bottomCopy = document.querySelector(".qc-orbit-bottom-copy");
      
          if (!section || !sticky || !system || !logo || !cards.length) {
            console.error("QC logo USP orbit section elements missing.");
            return;
          }
      
          function getOrbitRadius() {
            const systemSize = Math.min(system.offsetWidth, system.offsetHeight);
      
            if (window.innerWidth <= 560) {
              return systemSize * 0.39;
            }
      
            if (window.innerWidth <= 900) {
              return systemSize * 0.40;
            }
      
            return systemSize * 0.43;
          }
      
          function getBaseAngle(index) {
            
            return [-90, 0, 90, 180][index] || 0;
          }
      
          function positionCard(card, index, orbitRotation, visibilityProgress) {
            const radius = getOrbitRadius();
            const angle = getBaseAngle(index) + orbitRotation;
            const rad = angle * Math.PI / 180;
      
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
      
            
            gsap.set(card, {
              x: x,
              y: y,
              xPercent: -50,
              yPercent: -50,
              opacity: visibilityProgress,
              visibility: visibilityProgress > 0.02 ? "visible" : "hidden",
              scale: qcOrbitLerp(0.72, 1, visibilityProgress),
              rotation: 0,
              rotate: 0,
              force3D: true
            });
          }
      
          function renderOrbit(progress) {
            progress = qcOrbitClamp(progress, 0, 1);
      
            
      
            const logoIn = qcOrbitSmooth(qcOrbitNorm(progress, 0.00, 0.22));
            const logoSpin = qcOrbitNorm(progress, 0.16, 0.42);
            const logoGrow = qcOrbitSmooth(qcOrbitNorm(progress, 0.38, 0.60));
            const cardsIn = qcOrbitSmooth(qcOrbitNorm(progress, 0.50, 0.72));
            const orbitMove = qcOrbitNorm(progress, 0.62, 1.00);
            const bottomIn = qcOrbitSmooth(qcOrbitNorm(progress, 0.80, 0.96));
      
            const introFade = qcOrbitSmooth(qcOrbitNorm(progress, 0.34, 0.58));
      
            gsap.set(intro, {
              opacity: 1 - introFade,
              y: -44 * introFade
            });
      
            
            const logoY = qcOrbitLerp(window.innerHeight * 0.82, 0, logoIn);
            const logoScale = qcOrbitLerp(0.46, 1.12, logoIn) + logoGrow * 1.08;
            const logoRotation = qcOrbitLerp(-180, 720, logoSpin) + orbitMove * 360;
      
            gsap.set(logo, {
              xPercent: -50,
              yPercent: -50,
              x: 0,
              y: logoY,
              opacity: logoIn,
              scale: logoScale,
              rotation: logoRotation,
              force3D: true
            });
      
            
            gsap.set(system, {
              scale: qcOrbitLerp(0.88, 1, qcOrbitNorm(progress, 0.38, 0.72)),
              rotation: 0,
              force3D: true
            });
      
            
            rings.forEach(function (ring, index) {
              const delay = index * 0.045;
              const ringProgress = qcOrbitSmooth(
                qcOrbitNorm(progress, 0.42 + delay, 0.68 + delay)
              );
      
              gsap.set(ring, {
                opacity: ringProgress * (index === 0 ? 1 : 0.72),
                scale: qcOrbitLerp(0.68, 1 + index * 0.045, ringProgress),
                rotation: orbitMove * (index % 2 === 0 ? 120 : -95),
                force3D: true
              });
            });
      
            
            const orbitRotation = orbitMove * 360;
      
            cards.forEach(function (card, index) {
              const cardDelay = index * 0.04;
              const individualIn = qcOrbitSmooth(
                qcOrbitNorm(progress, 0.50 + cardDelay, 0.74 + cardDelay)
              );
      
              const visibility = Math.min(cardsIn, individualIn);
      
              positionCard(card, index, orbitRotation, visibility);
            });
      
            gsap.set(bottomCopy, {
              opacity: bottomIn,
              y: qcOrbitLerp(34, 0, bottomIn)
            });
          }
      
          renderOrbit(0);
      
          ScrollTrigger.create({
            id: "qc-logo-orbit-trigger",
            trigger: section,
            start: "top top",
            end: function () {
              return "+=" + Math.max(3800, window.innerHeight * 4);
            },
            pin: sticky,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: false,
      
            onUpdate: function (self) {
              renderOrbit(self.progress);
            },
      
            onEnter: function (self) {
              renderOrbit(self.progress);
            },
      
            onLeave: function () {
              renderOrbit(1);
            },
      
            onEnterBack: function (self) {
              renderOrbit(self.progress);
            },
      
            onLeaveBack: function () {
              renderOrbit(0);
            },
      
            onRefresh: function (self) {
              renderOrbit(self.progress);
            }
          });
        }
      })();

const qcBlogCards = document.querySelectorAll(".qc-blog-card");

      const qcBlogObserver = new IntersectionObserver(
        function(entries) {
          entries.forEach(function(entry, index) {
            if (entry.isIntersecting) {
              setTimeout(function() {
                entry.target.classList.add("qc-visible");
              }, index * 120);
            }
          });
        },
        {
          threshold: 0.18
        }
      );
      
      qcBlogCards.forEach(function(card) {
        qcBlogObserver.observe(card);
      });


    (() => {
  "use strict";

  const loadScriptOnce = (src, isReady) => {
    if (isReady()) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(script => script.src === src);

      if (existing) {
        if (isReady()) {
          resolve();
          return;
        }

        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const start = async () => {
    try {
      if (!window.d3) return;

      await loadScriptOnce(
        "https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js",
        () => !!window.topojson && typeof window.topojson.merge === "function"
      );

      initQriousGlobalProof();
    } catch (error) {
      console.error("Global testimonials section could not start:", error);
    }
  };

  function initQriousGlobalProof() {
      const section = document.querySelector("#qgGlobalProof");
      if (!section || section.dataset.qgInitialized === "true") return;
      section.dataset.qgInitialized = "true";

      const marqueeStage = section.querySelector("#qgMarqueeStage");
      const introCopy = section.querySelector("#qgIntroCopy");
      const worldLayer = section.querySelector("#qgWorldLayer");
      const mapPointsLayer = section.querySelector("#qgMapPoints");
      const mapTitles = [...section.querySelectorAll(".qg-map-title")];
      const scrollCue = section.querySelector("#qgScrollCue");
      const scrollButton = section.querySelector("#qgScrollButton");
      const svg = d3.select("#qgWorldMapSvg");

      document.querySelectorAll(".qg-marquee-track").forEach(track => {
          const group = track.querySelector(".qg-marquee-group");
          const copy = group.cloneNode(true);
          copy.setAttribute("aria-hidden", "true");
          track.appendChild(copy);
        });

      document.querySelectorAll(".qg-marquee-row").forEach((row, rowIndex) => {
          row.querySelectorAll(".qg-marquee-group").forEach(group => {
              group.querySelectorAll(".qg-testimonial-card").forEach((card, cardIndex) => {
                  const isOrange = (cardIndex + rowIndex) % 2 === 1;
                  card.classList.toggle("qg-card-orange", isOrange);
                  card.classList.toggle("qg-card-white", !isOrange);
                });
            });
        });

      function clamp(value, min = 0, max = 1) { return Math.min(max, Math.max(min, value)); }
      function lerp(start, end, progress) { return start + (end - start) * progress; }
      function inverseLerp(start, end, value) { return clamp((value - start) / (end - start)); }
      function smoothstep(start, end, value) { const x = inverseLerp(start, end, value); return x * x * (3 - 2 * x); }
      function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

      const WORLD_DATA_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";

      const clientLocations = {
        usa: [-98.5795, 39.8283],
        europe: [10.0, 50.5],
        india: [78.9629, 20.5937],
        china: [104.1954, 35.8617],
        australia: [133.7751, -25.2744]
      };

      const clientCityLocations = [
        { key: "Jaipur",     label: "Jaipur",     coord: [75.7873, 26.9124],   labelX: -54, labelY:  24 },
        { key: "Mumbai",     label: "Mumbai",     coord: [72.8777, 19.0760],   labelX: -50, labelY:  28 },
        { key: "Delhi",      label: "Delhi",      coord: [77.1025, 28.7041],   labelX:  44, labelY: -28 },
        { key: "Australia",  label: "Sydney",     coord: [151.2093, -33.8688], labelX:  48, labelY: -20 },
        { key: "China",    label: "Beijing",    coord: [116.4074, 39.9042],  labelX:  48, labelY: -22 },
        { key: "America", label: "Washington", coord: [-77.0369, 38.9072],  labelX: -62, labelY:  27 },
        { key: "United Kingdom",     label: "London",     coord: [-0.1276, 51.5072],   labelX: -48, labelY: -26 },
        { key: "Germany",     label: "Berlin",     coord: [13.4050, 52.5200],   labelX:  45, labelY: -20 }
      ];

      function buildCityPopups() {
        if (!mapPointsLayer) return;
        mapPointsLayer.querySelectorAll(".qg-city-popup").forEach(popup => popup.remove());
        clientCityLocations.forEach((location, index) => {
          const popup = document.createElement("div");
          popup.className = "qg-city-popup";
          popup.dataset.city = location.key;
          popup.dataset.index = String(index);
          popup.style.setProperty("--qg-label-x", `${location.labelX}px`);
          popup.style.setProperty("--qg-label-y", `${location.labelY}px`);
          popup.style.setProperty("--qg-pop-scale", "0.55");
          popup.innerHTML = `<span class="qg-city-dot" aria-hidden="true"></span><span class="qg-city-label">${location.label}</span>`;
          mapPointsLayer.appendChild(popup);
        });
      }
      buildCityPopups();

      let worldData = null, projection = null, mapWidth = 0, mapHeight = 0;

      async function loadWorldMap() {
        try { worldData = await d3.json(WORLD_DATA_URL); renderWorldMap(); }
        catch (error) { console.error("Could not load world map:", error); }
      }

      function renderWorldMap() {
        if (!worldData) return;
        const rect = worldLayer.getBoundingClientRect();
        mapWidth = Math.max(700, Math.round(rect.width));
        mapHeight = Math.max(420, Math.round(rect.height));
        svg.attr("viewBox", `0 0 ${mapWidth} ${mapHeight}`).attr("preserveAspectRatio", "xMidYMid meet");

        const allCountries = topojson.feature(worldData, worldData.objects.countries).features;
        const countries = allCountries.filter(country => Number(country.id) !== 10);
        const mapFeatureCollection = { type: "FeatureCollection", features: countries };

        projection = d3.geoNaturalEarth1().fitExtent([[-22, 34], [mapWidth + 22, mapHeight - 24]], mapFeatureCollection);
        const geoPath = d3.geoPath(projection);
        svg.selectAll("*").remove();

        const mergedLand = topojson.merge(worldData, worldData.objects.countries.geometries.filter(geometry => Number(geometry.id) !== 10));
        svg.append("path").datum(mergedLand).attr("class", "qg-world-land-shadow").attr("d", geoPath);
        svg.append("path").datum(mergedLand).attr("class", "qg-world-land-glow").attr("d", geoPath);
        svg.append("path").datum(mergedLand).attr("class", "qg-world-land").attr("d", geoPath);
        positionMapMarkers();
      }

      function positionMapMarkers() {
        if (!projection) return;
        document.querySelectorAll(".qg-map-point").forEach(point => {
            const country = point.dataset.country;
            const coordinates = clientLocations[country];
            if (!coordinates) return;
            const projected = projection(coordinates);
            if (!projected) return;
            const [x, y] = projected;
            point.style.left = `${(x / mapWidth) * 100}%`;
            point.style.top = `${(y / mapHeight) * 100}%`;
          });

        clientCityLocations.forEach(location => {
          const popup = mapPointsLayer && mapPointsLayer.querySelector(`.qg-city-popup[data-city="${location.key}"]`);
          if (!popup) return;
          const projected = projection(location.coord);
          if (!projected) return;
          const [x, y] = projected;
          popup.style.left = `${(x / mapWidth) * 100}%`;
          popup.style.top = `${(y / mapHeight) * 100}%`;
        });
      }

      let flights = [], flightsCreated = false;

      function getVisibleCards() {
        const cards = [...document.querySelectorAll(".qg-testimonial-card")];
        const byId = new Map();
        for (const card of cards) {
          const id = card.dataset.id;
          if (!byId.has(id)) byId.set(id, []);
          byId.get(id).push(card);
        }
        const centerX = window.innerWidth / 2, centerY = window.innerHeight / 2;
        const visible = [];
        byId.forEach(instances => {
            let best = null, bestScore = -Infinity;
            for (const card of instances) {
              const rect = card.getBoundingClientRect();
              const onScreen = rect.right > -40 && rect.left < window.innerWidth + 40 && rect.bottom > -40 && rect.top < window.innerHeight + 40 && rect.width > 4 && rect.height > 4;
              const rectCenterX = rect.left + rect.width / 2, rectCenterY = rect.top + rect.height / 2;
              const distanceFromCenter = Math.abs(rectCenterX - centerX) + Math.abs(rectCenterY - centerY);
              const score = (onScreen ? 100000 : 0) - distanceFromCenter;
              if (score > bestScore) { bestScore = score; best = { card, rect }; }
            }
            if (best) visible.push(best);
          });
        return visible;
      }

      function createFlights() {
        if (flightsCreated) return;
        flightsCreated = true;
        const visibleCards = getVisibleCards();

        flights = visibleCards.map((item, index) => {
              const { card, rect } = item;
              const country = card.dataset.country;
              const target = section.querySelector(`.qg-map-point[data-country="${country}"]`);
              if (!target) return null;

              const naturalWidth = card.offsetWidth, naturalHeight = card.offsetHeight;
              const rectCenterX = rect.left + rect.width / 2, rectCenterY = rect.top + rect.height / 2;
              const startLeft = rectCenterX - naturalWidth / 2, startTop = rectCenterY - naturalHeight / 2;

              const placeholder = document.createElement("div");
              placeholder.className = "qg-flight-placeholder";
              placeholder.style.width = `${naturalWidth}px`;
              placeholder.style.height = `${naturalHeight}px`;
              placeholder.style.flex = `0 0 ${naturalWidth}px`;

              const originalStyle = card.getAttribute("style");
              card.parentNode.insertBefore(placeholder, card);
              card.classList.add("qg-flight-card");
              card.style.width = `${naturalWidth}px`;
              card.style.height = `${naturalHeight}px`;
              card.style.flexBasis = `${naturalWidth}px`;
              card.style.opacity = "1";
              card.style.borderRadius = "14px";
              card.style.setProperty("--flight-content-opacity", "1");
              card.style.transform = `translate3d(${startLeft}px, ${startTop}px, 0)`;
              document.body.appendChild(card);

              return { card, placeholder, originalStyle, country, target, startX: startLeft, startY: startTop, width: naturalWidth, height: naturalHeight, offsetX: 0, offsetY: 0, index };
            }).filter(Boolean);

        marqueeStage.classList.add("qg-flight-cleanup-active");
      }

      function updateFlights(progress) {
        if (!flightsCreated) return;
        flights.forEach((flight, index) => {
            const stagger = 0;
            const localProgress = clamp((progress - stagger) / (1 - stagger));
            const travelProgress = smoothstep(0.00, 1.00, localProgress);
            const travelEased = easeInOutCubic(travelProgress);
            const morphProgress = smoothstep(0.00, 0.22, localProgress);
            const targetRect = flight.target.getBoundingClientRect();
            const targetX = targetRect.left + targetRect.width / 2 - flight.width / 2 + flight.offsetX;
            const targetY = targetRect.top + targetRect.height / 2 - flight.height / 2 + flight.offsetY;
            const arcHeight = 38 + (index % 3) * 12;
            const arc = Math.sin(Math.PI * travelEased) * arcHeight;
            const currentX = lerp(flight.startX, targetX, travelEased);
            const currentY = lerp(flight.startY, targetY, travelEased) - arc;
            const landingGrow = smoothstep(0.78, 1.00, localProgress);
            const circleSize = lerp(16, 40, landingGrow);
            const visualWidth = lerp(flight.width, circleSize, morphProgress);
            const visualHeight = lerp(flight.height, circleSize, morphProgress);
            const scaleX = visualWidth / flight.width, scaleY = visualHeight / flight.height;
            const roundness = lerp(14, 999, morphProgress);
            const contentOpacity = 1 - smoothstep(0.04, 0.16, localProgress);
            let opacity = 1;
            if (localProgress > 0.94) opacity = 1 - smoothstep(0.94, 1, localProgress);

            flight.card.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${scaleX}, ${scaleY})`;
            flight.card.style.borderRadius = `${roundness}px`;
            flight.card.style.opacity = opacity;
            flight.card.style.setProperty("--flight-content-opacity", contentOpacity.toFixed(3));

            if (localProgress > 0.88) flight.target.classList.add("qg-active");
            else flight.target.classList.remove("qg-active");
          });
      }

      function removeFlights() {
        flights.forEach(flight => {
            const card = flight.card;
            if (flight.placeholder && flight.placeholder.isConnected) flight.placeholder.replaceWith(card);
            card.classList.remove("qg-flight-card");
            if (flight.originalStyle === null) card.removeAttribute("style");
            else card.setAttribute("style", flight.originalStyle);
          });
        flights = [];
        flightsCreated = false;
        marqueeStage.classList.remove("qg-flight-cleanup-active");
        document.querySelectorAll(".qg-map-point").forEach(point => point.classList.remove("qg-active"));
      }

      const SCROLL_PHASE = { freezeStart: 0.30, tiltEnd: 0.49, flightStart: 0.50, flightEnd: 0.74, textStart: 0.74, textEnd: 0.995 };

      function getSectionProgress() {
        const rect = section.getBoundingClientRect();
        const scrollDistance = section.offsetHeight - window.innerHeight;
        if (scrollDistance <= 0) return 0;
        return clamp(-rect.top / scrollDistance);
      }

      let ticking = false;

      function updateAnimation() {
        ticking = false;
        const progress = getSectionProgress();
        const { freezeStart, tiltEnd, flightStart, flightEnd, textStart, textEnd } = SCROLL_PHASE;

        if (progress < freezeStart) {
          section.classList.remove("qg-is-frozen");
          if (flightsCreated) removeFlights();
        } else {
          section.classList.add("qg-is-frozen");
        }

        const tiltProgress = smoothstep(freezeStart, tiltEnd, progress);
        const rotateX = lerp(0, 56, tiltProgress);
        const stageScale = lerp(1, 0.78, tiltProgress);
        const stageY = lerp(0, -7, tiltProgress);
        marqueeStage.style.transform = `translate3d(0, ${stageY}vh, 0) rotateX(${rotateX}deg) scale(${stageScale})`;

        const introFade = smoothstep(freezeStart, freezeStart + 0.09, progress);
        introCopy.style.opacity = 1 - introFade;
        introCopy.style.transform = `translateX(-50%) translateY(${-25 * introFade}px)`;

        const mapProgress = smoothstep(freezeStart + 0.02, flightStart + 0.16, progress);
        worldLayer.style.opacity = mapProgress;
        const mapScale = lerp(0.90, 1, mapProgress);
        worldLayer.style.transform = `translate(-50%, -50%) scale(${mapScale})`;

        const cityPopups = [...section.querySelectorAll(".qg-city-popup")];
        cityPopups.forEach((popup, index) => {
            const popupStart = 0.735 + index * 0.006;
            const popupEnd = popupStart + 0.050;
            const popupProgress = smoothstep(popupStart, popupEnd, progress);
            popup.style.opacity = popupProgress;
            popup.style.setProperty("--qg-pop-scale", lerp(0.55, 1, popupProgress).toFixed(3));
            popup.classList.toggle("qg-city-live", popupProgress > 0.82);
          });

        if (progress >= flightStart) {
          if (!flightsCreated) createFlights();
          const flightProgress = inverseLerp(flightStart, flightEnd, progress);
          updateFlights(flightProgress);
          const deckFade = smoothstep(flightStart, flightStart + 0.18, progress);
          marqueeStage.style.opacity = 1 - deckFade;
        } else {
          marqueeStage.style.opacity = 1;
          if (flightsCreated) removeFlights();
        }

        const titleProgress = inverseLerp(textStart, textEnd, progress);
        const titleCount = mapTitles.length;
        mapTitles.forEach((title, index) => {
            const segmentStart = index / titleCount, segmentEnd = (index + 1) / titleCount;
            const local = inverseLerp(segmentStart, segmentEnd, titleProgress);
            const enter = smoothstep(0.00, 0.14, local);
            const exit = smoothstep(0.82, 1.00, local);
            const opacity = enter * (1 - exit);
            const scale = local < 0.82 ? lerp(1.08, 1.00, enter) : lerp(1.00, 0.72, exit);
            const y = local < 0.82 ? lerp(18, 0, enter) : lerp(0, -10, exit);
            const blur = lerp(0, 7, exit);
            title.style.opacity = opacity;
            title.style.transform = `translateY(${y}px) scale(${scale})`;
            title.style.filter = `blur(${blur}px)`;
          });

        const cueFade = smoothstep(0.16, 0.30, progress);
        scrollCue.style.opacity = 1 - cueFade;
        scrollCue.style.pointerEvents = cueFade > 0.9 ? "none" : "auto";
      }

      function requestUpdate() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateAnimation);
      }

      qcScrollTasks.add(updateAnimation);

      scrollButton.addEventListener("click", () => {
          const scrollDistance = section.offsetHeight - window.innerHeight;
          const destination = section.offsetTop + scrollDistance * 0.33;
          window.scrollTo({ top: destination, behavior: "smooth" });
        });
      qcResizeTasks.add(() => { renderWorldMap(); if (flightsCreated) removeFlights(); updateAnimation(); });

      loadWorldMap();
      updateAnimation();
  }

  start();
})();
