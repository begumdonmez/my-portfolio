/* ============================================================
   CAPTIONS — one engine for narration, tapes and one-shots.
   Owns the three caption sources; main's loop reads
   currentCaptionText() every frame and paints ui.captions.
   (Voice recordings replace the timed text later.)
   ============================================================ */
import { clock } from './core.js';

let currentTape = null;   // { captions, startedAt } — a new tape cuts the old
let narration = null;     // corridor narration, same shape
let oneShot = null;       // { text, until } transient line

export function playTape(tape) {
  currentTape = { captions: tape.captions, startedAt: clock.elapsedTime };
}

export function playNarration(captions) {
  narration = { captions, startedAt: clock.elapsedTime };
}

export function showCaption(text, seconds) {
  oneShot = text ? { text, until: clock.elapsedTime + seconds } : null;
}

// is a voice (tape or narration) currently speaking? — radio ducks against this
export function isSpeaking() {
  return !!(currentTape || narration);
}

export function currentCaptionText() {
  if (currentTape) {
    const t = clock.elapsedTime - currentTape.startedAt;
    const line = currentTape.captions.find(c => t >= c.start && t < c.end);
    if (t > currentTape.captions.at(-1).end) currentTape = null;
    if (line) return line.text;
  }
  if (narration) {
    const t = clock.elapsedTime - narration.startedAt;
    const line = narration.captions.find(c => t >= c.start && t < c.end);
    if (t > narration.captions.at(-1).end) narration = null;
    if (line) return line.text;
  }
  if (oneShot) {
    if (clock.elapsedTime < oneShot.until) return oneShot.text;
    oneShot = null;
  }
  return '';
}
