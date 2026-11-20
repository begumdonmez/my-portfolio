/* ============================================================
   Cross-module mutable game state. One object so its fields stay
   live-shared across modules (ES exports of `let` scalars would
   not — reassignment isn't visible to importers).
   ============================================================ */
import { State } from './config.js';

export const store = {
  state: State.CONSENT,
  audioEnabled: false,
  focused: null,       // interactable under the crosshair (interact.js)
  focusTarget: null,   // { pos, look } while zoomed on a frame (interact.js)
  savedCam: null,      // camera to restore after focus (interact.js)
  doorOpen: false,
  lidOpen: false,
};
