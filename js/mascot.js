/* ============================================================
   Mascot — Layer B's doorbell.
   Appears ~15s in AND after the first scroll ("actually reading"
   signal). Playful, never pushy: "no" is remembered this session.
   ============================================================ */

import { transformToMagic, revertToPlain, isMagic } from '/js/theme.js';

const TUNING = {
  appearDelay: 15000,      // drop to ~2000 while developing
  retreatAfter: 10000,
};

const zone = document.querySelector('.mascot-zone');
const button = document.querySelector('#mascot');
const bubble = document.querySelector('#mascot-bubble');
const text = document.querySelector('#mascot-text');
const choices = document.querySelector('#mascot-choices');

const dialog = {
  hey: 'Hey!',
  ask: "Psst… there's a version of this page told my way. Want to see it?",
  yes: "Let's make a little magic ✨",
  no: 'Fair enough — I\'ll be right here 👀',
  revertAsk: 'Want the plain version back?',
};

const set = (state) => { zone.dataset.state = state; };

/* ---------- Two-condition trigger ---------- */
let hasScrolled = false;
let timeReady = false;
let shown = false;

function maybeShow() {
  if (shown || !hasScrolled || !timeReady) return;
  if (sessionStorage.getItem('mascot-dismissed')) return;   // "no" means no (this session)
  shown = true;
  set('greeting');
  say(dialog.hey, []);
  retreatTimer = setTimeout(retreat, TUNING.retreatAfter);
}

addEventListener('scroll', () => { hasScrolled = true; maybeShow(); }, { once: true, passive: true });
setTimeout(() => { timeReady = true; maybeShow(); }, TUNING.appearDelay);

/* ---------- Behaviour ---------- */
let retreatTimer = null;

function retreat() {
  bubble.hidden = true;
  set('waiting');           // slides half off-screen via CSS, never disappears
}

function say(message, options) {
  text.textContent = message;
  choices.replaceChildren();
  for (const opt of options) {
    const b = document.createElement('button');
    b.textContent = opt.label;
    b.addEventListener('click', opt.action);
    choices.append(b);
  }
  bubble.hidden = false;
}

button.addEventListener('click', () => {
  clearTimeout(retreatTimer);
  set('asking');

  if (isMagic()) {
    say(dialog.revertAsk, [
      { label: 'Yes, back to plain', action: () => { revertToPlain(); afterChoice(); } },
      { label: 'No, keep the magic', action: afterChoice },
    ]);
    return;
  }

  say(dialog.ask, [
    { label: 'Yes, show me', action: () => {
        say(dialog.yes, []);
        setTimeout(() => { transformToMagic(); afterChoice(); }, 700);
    }},
    { label: 'Not now', action: () => {
        say(dialog.no, []);
        sessionStorage.setItem('mascot-dismissed', '1');
        setTimeout(afterChoice, 1800);
    }},
  ]);
});

function afterChoice() {
  bubble.hidden = true;
  set('idle');              // stays in the corner, available
}
