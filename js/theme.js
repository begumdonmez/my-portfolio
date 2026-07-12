/* ============================================================
   Theme transformation — the harvest of Lesson 1.2's variables.
   Core = toggling body.magic; the wave = per-section delays.
   Reversible both ways: the visitor always holds the switch.
   ============================================================ */

let fontLoaded = false;

function loadHandwritingFont() {
  if (fontLoaded) return;
  fontLoaded = true;
  // Caveat is only needed by the magic theme — plain-CV visitors never download it
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap';
  document.head.append(link);
}

function wave(reverse = false) {
  const sections = [...document.querySelectorAll('section')];
  if (reverse) sections.reverse();
  sections.forEach((s, i) => {
    s.style.transitionDelay = `${i * 0.18}s`;       // the 2D echo of the corridor light wave
  });
  // clean the inline delays after the wave so hover transitions stay snappy
  setTimeout(() => sections.forEach(s => s.style.transitionDelay = ''),
             sections.length * 180 + 900);
}

export function transformToMagic() {
  loadHandwritingFont();
  wave();
  document.body.classList.add('magic');
}

export function revertToPlain() {
  wave(true);
  document.body.classList.remove('magic');
}

export function isMagic() {
  return document.body.classList.contains('magic');
}
