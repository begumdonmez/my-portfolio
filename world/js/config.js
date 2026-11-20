/* ============================================================
   Tuning + state constants. Feel lives here, not buried in code.
   ============================================================ */

export const TUNING = {
  walkSpeed: 2.2,
  reachDistance: 2.3,
  dollyDuration: 1.8,
  lightWaveStep: 0.35,
  bloom: { strength: 0.9, radius: 0.4, threshold: 0.8 },
  duckedVolume: 0.12,
  radioVolume: 0.5,
};

export const State = {
  CONSENT: 'consent', INTRO: 'intro', TRANSITION: 'transition',
  WALK: 'walk', FOCUS: 'focus', COMPUTER: 'computer',
};
