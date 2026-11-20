/* ============================================================
   INPUT — keyboard. `keys` is polled by main's loop for walking;
   the E / Escape actions route by current state.
   ============================================================ */
import { store } from './store.js';
import { State } from './config.js';
import { endFocus } from './interact.js';
import { closeComputer } from './computer.js';

export const keys = {};

// onOrbReach: fired on E during INTRO (main decides if the orb is in reach)
export function initInput({ onOrbReach }) {
  addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) e.preventDefault();

    if (e.code === 'KeyE') {
      if (store.state === State.INTRO) onOrbReach();
      else if (store.state === State.WALK && store.focused) store.focused.userData.interact();
      else if (store.state === State.FOCUS) endFocus();
    }
    if (e.code === 'Escape') {
      if (store.state === State.COMPUTER) closeComputer();
      else if (store.state === State.FOCUS) endFocus();
    }
  });
  addEventListener('keyup', (e) => keys[e.code] = false);
}
