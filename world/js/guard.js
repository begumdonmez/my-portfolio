/* ============================================================
   Mobile: capability check, not screen width. Imported FIRST by
   main.js — if it throws, the rest of the module graph (scene,
   world geometry) is never evaluated, so nothing WebGL boots on a
   touch-only device.
   ============================================================ */
import { ui } from './dom.js';

const touchOnly = matchMedia('(pointer: coarse)').matches && !matchMedia('(pointer: fine)').matches;
const forceDesktop = new URLSearchParams(location.search).has('force');   // testing escape hatch

if (touchOnly && !forceDesktop) {
  ui.consent.hidden = true;
  ui.mobile.hidden = false;
  throw new Error('touch-only device: experience needs a keyboard'); // stop module graph cleanly
}
