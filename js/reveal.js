/* Scroll reveal — sections fade up as they enter the viewport.
   IntersectionObserver: the browser tells us when an element becomes
   visible; no scroll-event math, no per-frame work (cheap + smooth).
   Respects prefers-reduced-motion via the global CSS kill-switch. */

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);   // reveal once, then stop watching
    }
  }
}, { threshold: 0.12 });

const sections = document.querySelectorAll('main section:not(#hero)');
for (const section of sections) {
  section.classList.add('reveal');
  observer.observe(section);
}

/* Failsafe: content must NEVER stay hidden. If the observer hasn't fired
   within 3s (old browser, odd environment), reveal everything. */
setTimeout(() => {
  for (const section of sections) section.classList.add('visible');
}, 3000);
