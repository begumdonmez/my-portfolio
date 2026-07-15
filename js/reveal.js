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

for (const section of document.querySelectorAll('main section:not(#hero)')) {
  section.classList.add('reveal');
  observer.observe(section);
}
