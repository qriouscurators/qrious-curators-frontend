(function(){
  'use strict';

  const SOURCES = [
    { src:'./team1/vikram1.webp',     name:'Vikram Singh',        role:'Designation 23' },
    { src:'./team1/uday.webp',        name:'Name 24',             role:'Designation 24' },
    { src:'./team1/ashu.webp',        name:'Name 25',             role:'Designation 25' },
    { src:'./team1/bhavana1.webp',    name:'Bhavana Punjabi',     role:'Chief Curator Officer' },
    { src:'./team1/abhay1.webp',      name:'Abhay Tanwar',        role:'Chief Action Officer' },
    { src:'./team1/prakriti1.webp',   name:'Prakriti Verma',      role:'Sr. Graphic Designer' },
    { src:'./team1/kumkum1.webp',     name:'Name 7',              role:'Sr. Graphic Designer' },
    { src:'./team1/jayant1.webp',     name:'Jayant Rajvanshi',    role:'Graphic Designer' },
    { src:'./team1/khushisahoo.webp', name:'Khushi Sahu',         role:'Graphic Designer' },
    { src:'./team1/rohit.webp',       name:'Rohit Verma',         role:'Sr. Digital Video Artist' },
    { src:'./team1/tarun.webp',       name:'Tarun Sharma',        role:'Digital Video Artist' },
    { src:'./team1/prince.webp',      name:'Prince Sharma',       role:'Digital Video Artist' },
    { src:'./team1/preeti1.webp',     name:'Preeti Shekhawat',    role:'Brand Manager' },
    { src:'./team1/khushisharma.webp',name:'Khushi Sharma',       role:'Brand Manager' },
    { src:'./team1/srushti.webp',     name:'Srushti Soni',        role:'Social Media Strategist' },
    { src:'./team1/khushi.webp',      name:'Khushi Singh',        role:'Social Media Intern' },
    { src:'./team1/riddhi.webp',      name:'Riddhi Sharma',       role:'Social Media Intern' },
    { src:'./team1/nehal.webp',       name:'Name 17',             role:'Social Media Intern' },
    { src:'./team1/shubham.webp',     name:'Shubham Sharma',      role:'Web Developer' },
    { src:'./team1/chitransh.webp',   name:'Chitransh Maharshi',  role:'Web Developer Intern' },
    { src:'./team1/yashika1.webp',    name:'Yashika Singh',       role:'SEO Stategist' },
    { src:'./team1/vikas.webp',       name:'Vikas Tanwar',        role:'SEO Stategist' },
    { src:'./team1/khushisingh.webp', name:'Khushi Singh',        role:'SEO Executive' }
  ];

  const carousel = document.getElementById('tc-carousel');
  const track    = document.getElementById('tc-track');
  if(!carousel || !track) return;

  const STRETCH_Y  = 0.35;
  const SCALE_DROP = 0.22;
  const TRANSLATE_Z= 240;
  const CENTER_PUSH= -120;
  const ROTATE_MAX = 85;
  const REACH      = 1.2;
  const SPACING    = 0.82;

  let cardW, gap, unit, setWidth, speed, cards = [];
  let offset = 0, last = 0;

  function readVars(){
    const cs = getComputedStyle(carousel);
    cardW = parseFloat(cs.getPropertyValue('--tc-card-w'));
    gap   = parseFloat(cs.getPropertyValue('--tc-gap'));
    speed = 55;
    unit  = (cardW + gap) * SPACING;
    setWidth = SOURCES.length * unit;
  }

  function build(){
    track.innerHTML = '';
    cards = [];
    const total = SOURCES.length * 2;
    for(let i=0;i<total;i++){
      const data = SOURCES[i % SOURCES.length];
      const card = document.createElement('figure');
      card.className = 'tc-card';

      const img = document.createElement('img');
      img.src = data.src;
      img.alt = data.name;
      img.loading = 'lazy';
      card.appendChild(img);

      const cap = document.createElement('figcaption');
      cap.className = 'tc-caption';
      cap.innerHTML =
        '<span class="tc-name">' + data.name + '</span>' +
        '<span class="tc-role">' + data.role + '</span>';
      card.appendChild(cap);

      track.appendChild(card);
      cards.push(card);
    }
  }

  const clamp = (v,a,b)=> v<a?a:v>b?b:v;

  function render(){
    const vw = carousel.clientWidth;
    const center = vw/2;
    const half = (vw/2)*REACH;
    for(let i=0;i<cards.length;i++){
      let rawX = i*unit - offset;
      let x = ((rawX % setWidth) + setWidth) % setWidth;
      if (x > setWidth - unit) x -= setWidth;

      const cardCenter = x + cardW/2;
      const d  = (cardCenter - center)/half;
      const dc = clamp(d, -REACH, REACH);

      const scale    = 1 - SCALE_DROP + SCALE_DROP * dc*dc;
      const stretchY = 1 + STRETCH_Y * dc*dc;
      const tz       = CENTER_PUSH + TRANSLATE_Z * dc*dc;
      const rotY     = -ROTATE_MAX * dc;
      const z        = Math.round(1000 - Math.abs(dc)*500);

      const el = cards[i];
      el.style.transform =
        `translate3d(${x}px, -50%, ${tz}px) rotateY(${rotY}deg) scale(${scale}) scaleY(${stretchY})`;
      el.style.zIndex  = z;
      el.style.opacity = 1;
    }
  }

  function loop(now){
    if(!last) last = now;
    const dt = Math.min((now-last)/1000, 0.05);
    last = now;
    offset += speed*dt;
    if(offset >= setWidth) offset -= setWidth;
    render();
    requestAnimationFrame(loop);
  }

  /* ── DRAG (mouse + touch) ── */
  let dragging  = false;
  let dragLastX = 0;
  let dragVel   = 0;
  let autoSpeed = 55;   // base auto-scroll speed

  function onDragStart(clientX){
    dragging  = true;
    dragLastX = clientX;
    dragVel   = 0;
    autoSpeed = speed;
    speed     = 0;
    carousel.style.cursor = 'grabbing';
  }

  function onDragMove(clientX){
    if(!dragging) return;
    const dx = clientX - dragLastX;
    dragVel   = dx;
    offset   -= dx;
    dragLastX = clientX;
    render();
  }

  function onDragEnd(){
    if(!dragging) return;
    dragging = false;
    carousel.style.cursor = 'grab';

    // momentum ease-back
    const momentum = -dragVel * 15;
    const from = autoSpeed + momentum;
    speed = from;
    let t = 0;
    const ease = setInterval(function(){
      t += 16;
      const p = Math.min(t / 900, 1);
      const ep = 1 - Math.pow(1 - p, 3);
      speed = from + (autoSpeed - from) * ep;
      if(p >= 1){ speed = autoSpeed; clearInterval(ease); }
    }, 16);
  }

  // Mouse
  carousel.addEventListener('mousedown',  function(e){ onDragStart(e.clientX); e.preventDefault(); });
  window .addEventListener('mousemove',  function(e){ onDragMove(e.clientX); });
  window .addEventListener('mouseup',    function(){ onDragEnd(); });

  // Touch
  carousel.addEventListener('touchstart', function(e){ onDragStart(e.touches[0].clientX); }, { passive:true });
  carousel.addEventListener('touchmove',  function(e){ onDragMove(e.touches[0].clientX);  }, { passive:true });
  carousel.addEventListener('touchend',   function(){ onDragEnd(); });

  carousel.style.cursor = 'grab';

  /* ── PREV / NEXT BUTTONS ── */
  const NUDGE = 300;

  const btnPrev = document.createElement('button');
  btnPrev.className = 'tc-btn tc-btn--prev';
  btnPrev.setAttribute('aria-label', 'Previous');
  btnPrev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>';

  const btnNext = document.createElement('button');
  btnNext.className = 'tc-btn tc-btn--next';
  btnNext.setAttribute('aria-label', 'Next');
  btnNext.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polyline points="9 18 15 12 9 6"/></svg>';

  // insert before/after carousel
  carousel.parentNode.insertBefore(btnPrev, carousel);
  carousel.parentNode.insertBefore(btnNext, carousel.nextSibling);

  btnPrev.addEventListener('click', function(){ offset = offset - NUDGE; render(); });
  btnNext.addEventListener('click', function(){ offset = offset + NUDGE; render(); });

  /* ── BUTTON CSS (injected so no extra file needed) ── */
  const style = document.createElement('style');
  style.textContent = `
    .tc-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.18);
      background: rgba(10,10,10,0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: #fff;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, transform 0.15s;
    }
    .tc-btn:hover {
      background: rgba(255,255,255,0.12);
      border-color: rgba(255,255,255,0.4);
      transform: translateY(-50%) scale(1.1);
    }
    .tc-btn:active { transform: translateY(-50%) scale(0.95); }
    .tc-btn--prev { left: 16px; }
    .tc-btn--next { right: 16px; }
  `;
  document.head.appendChild(style);

  /* ── make parent relative so buttons position correctly ── */
  const parent = carousel.parentNode;
  if(getComputedStyle(parent).position === 'static'){
    parent.style.position = 'relative';
  }

  function init(){ readVars(); build(); render(); requestAnimationFrame(loop); }
  window.addEventListener('resize', ()=>{ readVars(); render(); });
  if(document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();