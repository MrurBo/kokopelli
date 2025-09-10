const list = document.querySelector('#list');
const q = document.querySelector('#q');
const chips = document.querySelectorAll('.chip');

if (q) q.addEventListener('input', filter);
chips.forEach(c => c.addEventListener('click', () => {
  chips.forEach(x=>x.classList.remove('is-active'));
  c.classList.add('is-active');
  list.dataset.cat = c.dataset.cat;
  filter();
}));

function filter(){
  const term = (q?.value || '').trim().toLowerCase();
  const cat = document.querySelector('.chip.is-active')?.dataset.cat || 'all';
  document.querySelectorAll('.row').forEach(row=>{
    const inCat = cat === 'all' || row.dataset.cat === cat;
    const text = row.innerText.toLowerCase();
    const inText = !term || text.includes(term);
    row.style.display = (inCat && inText) ? '' : 'none';
  });
}

// Background pan removed — carousel slides provide hero visuals now.

/* Hero carousel behavior */
;(function initCarousel(){
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;
  const slidesEl = carousel.querySelector('.slides');
  const slideEls = Array.from(carousel.querySelectorAll('.slide'));
  const prevBtn = carousel.querySelector('.carousel-control.prev');
  const nextBtn = carousel.querySelector('.carousel-control.next');
  const dotsEl = carousel.querySelector('#heroDots');
  let current = 0;
  let timer = null;
  const interval = 5000;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // lazy-load slide backgrounds from data-src
  slideEls.forEach((s, i) => {
    const src = s.dataset.src;
    if (src) s.style.backgroundImage = `linear-gradient(rgba(246,244,234,0.25), rgba(246,244,234,0.25)), url('${src}')`;
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Go to slide ${i+1}`);
    btn.setAttribute('role', 'tab');
    const isActive = i === 0;
    btn.className = isActive ? 'is-active' : '';
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    btn.tabIndex = isActive ? 0 : -1;
    btn.addEventListener('click', (e) => { e.stopPropagation(); goto(i); });
    dotsEl.appendChild(btn);
  });

  function show(i){
    slideEls.forEach((s, idx)=>{
      s.classList.toggle('is-active', idx === i);
      s.setAttribute('aria-hidden', idx === i ? 'false' : 'true');
    });
    Array.from(dotsEl.children).forEach((d, idx)=> {
      const active = idx === i;
      d.classList.toggle('is-active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
      d.tabIndex = active ? 0 : -1;
    });
    current = i;
  }

  function goto(i){
    show((i + slideEls.length) % slideEls.length);
    resetTimer();
  }

  function next(){ goto(current+1); }
  function prev(){ goto(current-1); }

  prevBtn.addEventListener('click', (e)=>{ e.stopPropagation(); prev(); });
  nextBtn.addEventListener('click', (e)=>{ e.stopPropagation(); next(); });

  // keyboard support for dots
  dotsEl.addEventListener('keydown', (e) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const dots = Array.from(dotsEl.children);
    let idx = current;
    if (e.key === 'ArrowLeft') idx = (current - 1 + dots.length) % dots.length;
    if (e.key === 'ArrowRight') idx = (current + 1) % dots.length;
    if (e.key === 'Home') idx = 0;
    if (e.key === 'End') idx = dots.length - 1;
    goto(idx);
    dots[idx].focus();
  });

  if (!reduceMotion) {
    carousel.addEventListener('mouseenter', ()=> clearInterval(timer));
    carousel.addEventListener('mouseleave', resetTimer);
  }

  function resetTimer(){
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(next, interval);
  }

  // start
  show(0);
  resetTimer();
})();
