(function(){
  'use strict';

  const SOURCES = [
    { src:'./team1/vikram1.webp',     name:'Vikram Singh',        role:'Meta ads expert' },
    { src:'./team1/uday.webp',        name:'Uday Punjabi',        role:'BD Executive' },
    { src:'./team1/ashu.webp',        name:'Ashu Kashyap',        role:'Visual Story Teller' },
    { src:'./team1/abhay1.webp',      name:'Abhay Tanwar',        role:'Chief Action Officer' },
    { src:'./team1/bhavana1.webp',    name:'Bhavana Punjabi',     role:'Chief Curator Officer' },
    { src:'./team1/shubham.webp',     name:'Shubham Sharma',      role:'Web Developer' },
    { src:'./images/Chitransh.jpg',   name:'Chitransh Maharshi',  role:'Web Developer Intern' },
    { src:'./images/yashika1.jpeg',       name:'Vikas Tanwar',        role:'SEO Stategist' },
    { src:'./team1/khushisingh.webp', name:'Khushi Singh',        role:'SEO Executive' },
    { src:'./team1/prakriti1.webp',   name:'Prakriti Verma',      role:'Sr. Graphic Designer' },
    { src:'./team1/kumkum1.webp',     name:'Kumkum Chauhan',      role:'Sr. Graphic Designer' },
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
    { src:'./team1/nehal.webp',       name:'Nehal ',             role:'Social Media Intern' }
  ];

  const carousel = document.getElementById('tc-carousel');
  const track    = document.getElementById('tc-track');
  if(!carousel || !track) return;

  const STRETCH_Y  = 0.35;
  const SCALE_DROP = 0.22;
  const TRANSLATE_Z= 140;
  const CENTER_PUSH= -120;
  const ROTATE_MAX = 85;
  const REACH      = 1.2;
  const SPACING    = 0.80;

  let cardW, gap, unit, setWidth, cards = [];
  let offset    = 0;
  let last      = 0;
  let autoSpeed = 92;  // never changes
  let momentum  = 0;  // decays to 0 — used for drag & button nudge

  // drag state
  let dragging  = false;
  let dragLastX = 0;
  let dragVelX  = 0;

  function readVars(){
    const cs = getComputedStyle(carousel);
    cardW    = parseFloat(cs.getPropertyValue('--tc-card-w'));
    gap      = parseFloat(cs.getPropertyValue('--tc-gap'));
    unit     = (cardW + gap) * SPACING;
    setWidth = SOURCES.length * unit;
  }

  function build(){
    track.innerHTML = '';
    cards = [];
    const total = SOURCES.length * 2;
    for(let i = 0; i < total; i++){
      const data = SOURCES[i % SOURCES.length];
      const card = document.createElement('figure');
      card.className = 'tc-card';

      const img = document.createElement('img');
      img.src     = data.src;
      img.alt     = data.name;
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

  const clamp = (v,a,b) => v < a ? a : v > b ? b : v;

  function render(){
    const vw     = carousel.clientWidth;
    const center = vw / 2;
    const half   = (vw / 2) * REACH;

    for(let i = 0; i < cards.length; i++){
      let rawX = i * unit - offset;
      let x    = ((rawX % setWidth) + setWidth) % setWidth;
      if(x > setWidth - unit) x -= setWidth;

      const cardCenter = x + cardW / 2;
      const d  = (cardCenter - center) / half;
      const dc = clamp(d, -REACH, REACH);

      const scale    = 1 - SCALE_DROP + SCALE_DROP * dc * dc;
      const stretchY = 1 + STRETCH_Y  * dc * dc;
      const tz       = CENTER_PUSH + TRANSLATE_Z * dc * dc;
      const rotY     = -ROTATE_MAX * dc;
      const z        = Math.round(1000 - Math.abs(dc) * 500);

      cards[i].style.transform =
        `translate3d(${x}px,-50%,${tz}px) rotateY(${rotY}deg) scale(${scale}) scaleY(${stretchY})`;
      cards[i].style.zIndex  = z;
      cards[i].style.opacity = 1;
    }
  }

  function loop(now){
    if(!last) last = now;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if(!dragging){
      momentum *= 0.93;
      if(Math.abs(momentum) < 0.2) momentum = 0;
      offset += (autoSpeed + momentum) * dt;
    }

    if(offset >= setWidth) offset -= setWidth;
    if(offset < 0)         offset += setWidth;

    render();
    requestAnimationFrame(loop);
  }

  /* ── DRAG ── */
  function onDragStart(clientX){
    dragging  = true;
    dragLastX = clientX;
    dragVelX  = 0;
    momentum  = 0;
    carousel.style.cursor = 'grabbing';
  }

  function onDragMove(clientX){
    if(!dragging) return;
    const dx  = clientX - dragLastX;
    dragVelX  = dx;
    offset   -= dx;
    dragLastX = clientX;
  }

  function onDragEnd(){
    if(!dragging) return;
    dragging = false;
    momentum = -dragVelX * 7;
    carousel.style.cursor = 'grab';
  }

  carousel.addEventListener('mousedown', function(e){ onDragStart(e.clientX); e.preventDefault(); });
  window .addEventListener('mousemove',  function(e){ onDragMove(e.clientX); });
  window .addEventListener('mouseup',    function(){  onDragEnd(); });

  carousel.addEventListener('touchstart', function(e){ onDragStart(e.touches[0].clientX); }, { passive:true });
  carousel.addEventListener('touchmove',  function(e){ onDragMove(e.touches[0].clientX);  }, { passive:true });
  carousel.addEventListener('touchend',   function(){  onDragEnd(); });

  carousel.style.cursor = 'grab';

  /* ── PREV / NEXT BUTTONS
     tc-carousel has overflow:hidden so we need a wrapper div
     that sits on top with pointer-events, outside the clipping context
  ── */
  const btnWrap = document.createElement('div');
  btnWrap.className = 'tc-btn-wrap';

  const btnPrev = document.createElement('button');
  btnPrev.className = 'tc-btn tc-btn--prev';
  btnPrev.setAttribute('aria-label', 'Previous');
  btnPrev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>';

  const btnNext = document.createElement('button');
  btnNext.className = 'tc-btn tc-btn--next';
  btnNext.setAttribute('aria-label', 'Next');
  btnNext.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="9 18 15 12 9 6"/></svg>';

  btnWrap.appendChild(btnPrev);
  btnWrap.appendChild(btnNext);

  /* wrap carousel + btnWrap together */
  const outer = document.createElement('div');
  outer.className = 'tc-outer';
  carousel.parentNode.insertBefore(outer, carousel);
  outer.appendChild(carousel);
  outer.appendChild(btnWrap);

  const NUDGE = 900;
  btnPrev.addEventListener('click', function(){ momentum = -NUDGE; });
  btnNext.addEventListener('click', function(){ momentum =  NUDGE; });

  /* ── INJECT CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    /* wrapper that holds carousel + floating buttons */
    .tc-outer {
      position: relative;
      width: 100%;
    }

    /* button overlay — sits above carousel, no overflow clip */
    .tc-btn-wrap {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;   /* clicks fall through to carousel */
      z-index: 50;
    }

    .tc-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: all;    /* buttons themselves are clickable */
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.22);
      background: rgba(10,10,10,0.82);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: #fff;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, transform 0.15s;
    }
    .tc-btn:hover {
      background: rgba(255,255,255,0.14);
      border-color: rgba(255,255,255,0.5);
      transform: translateY(-50%) scale(1.1);
    }
    .tc-btn:active { transform: translateY(-50%) scale(0.94); }
    .tc-btn--prev { left: 18px; }
    .tc-btn--next { right: 18px; }

    /* no text selection while dragging */
    #tc-carousel { user-select: none; -webkit-user-select: none; }
  `;
  document.head.appendChild(style);

  /* ── INIT ── */
  function init(){ readVars(); build(); render(); requestAnimationFrame(loop); }
  window.addEventListener('resize', function(){ readVars(); render(); });
  if(document.readyState === 'complete') init();
  else window.addEventListener('load', init);

})();