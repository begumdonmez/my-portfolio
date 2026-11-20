// site.js — small enhancements only. The page is complete without it.
document.documentElement.classList.add('js');
const root = document.documentElement;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- The descent ----------------------------------------------------------
// --p: how far down the page we are (0 = high in the sky, 1 = on the ground).
// --q: how far the ground has risen into view (drives the hill parallax).
const masthead = document.querySelector('.masthead');
const hero = document.querySelector('.hero');
const ground = document.querySelector('.ground');
let scrollDelta = 0, lastScroll = window.scrollY, ticking = false;

const update = () => {
  ticking = false;
  const max = root.scrollHeight - innerHeight;
  root.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);

  const top = ground.getBoundingClientRect().top;
  const q = Math.min(1, Math.max(0, (innerHeight - top) / (innerHeight * 0.9)));
  ground.style.setProperty('--q', q.toFixed(4));

  masthead.classList.toggle('is-scrolled', scrollY > hero.offsetHeight - masthead.offsetHeight * 2);
};
const onScroll = () => {
  scrollDelta += scrollY - lastScroll;
  lastScroll = scrollY;
  if (!ticking) { ticking = true; requestAnimationFrame(update); }
};
update();
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', update);

// ---- Gentle reveal of sections -------------------------------------------
const revealer = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add('is-in'); revealer.unobserve(e.target); }
  }
}, { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.section__head, .feature, .ledger, .timeline, .toolkit, .about, .room__card, .meadow .wrap > *')
  .forEach((el) => { el.classList.add('reveal'); revealer.observe(el); });

// ---- Mark the section currently in view in the nav -----------------------
const navLinks = [...document.querySelectorAll('.masthead__nav a')];
const spy = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    navLinks.forEach((a) => {
      if (a.hash === '#' + e.target.id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
}, { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach((a) => { const s = document.querySelector(a.hash); if (s) spy.observe(s); });

// ---- Cursor-following cover preview on ledger links (fine pointers only) --
const preview = document.querySelector('.preview');
if (preview && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('[data-preview]').forEach((link) => {
    link.addEventListener('mouseenter', () => { preview.src = link.dataset.preview; preview.hidden = false; });
    link.addEventListener('mouseleave', () => { preview.hidden = true; });
    link.addEventListener('mousemove', (e) => {
      preview.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 80}px)`;
    });
  });
}

// ---- Leaves on the wind ----------------------------------------------------
// Moving the mouse makes a gust; scrolling down makes them rise past you,
// the way things do when you're the one falling.
const canvas = document.querySelector('.leaves');
if (canvas && !calm) {
  const ctx = canvas.getContext('2d');
  const colors = ['#5E9F55', '#7DB46C', '#9CC77F', '#E3B04B'];
  let w, h, wind = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const leaf = (x, y) => ({
    x, y,
    depth: 0.5 + Math.random() * 0.8,            // nearer leaves are bigger and move more
    speed: 0.25 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.04,
    angle: Math.random() * Math.PI,
    color: colors[Math.floor(Math.random() * colors.length)],
  });

  resize();
  const leaves = Array.from({ length: w < 600 ? 8 : 16 }, () => leaf(Math.random() * w, Math.random() * h));

  let lastX = null;
  window.addEventListener('pointermove', (e) => {
    if (lastX !== null) wind = Math.max(-6, Math.min(6, wind + (e.clientX - lastX) * 0.02));
    lastX = e.clientX;
  }, { passive: true });

  const tick = (t) => {
    ctx.clearRect(0, 0, w, h);
    wind *= 0.97;
    const lift = Math.max(-40, Math.min(40, scrollDelta));
    scrollDelta = 0;
    for (const l of leaves) {
      l.x += (l.speed + wind * 0.6) * l.depth;
      l.y += (Math.sin(t / 900 + l.phase) * 0.35 + 0.1) * l.depth - lift * 0.5 * l.depth;
      l.angle += l.spin + wind * 0.005 + lift * 0.002;
      if (l.x > w + 30) l.x = -20;
      if (l.x < -40) l.x = w + 20;
      if (l.y < -30) { l.y = h + 20; l.x = Math.random() * w; }
      if (l.y > h + 30) { l.y = -20; l.x = Math.random() * w; }

      const size = 4 + 5 * l.depth;
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.angle);
      ctx.fillStyle = l.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(tick);
  };

  window.addEventListener('resize', resize);
  requestAnimationFrame(tick);
}
