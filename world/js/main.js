/* ============================================================
   Layer C — the interactive world. Bootstrap + runtime: the
   consent gate, the intro → transition → walk flow, and the main
   render loop that ties every module together.

   Modules: config (tuning), store (shared state), core (renderer/
   scene/camera), helpers, world (geometry + props), audio,
   captions, interact, computer, input.
   ============================================================ */
import './guard.js';                                 // FIRST: bail out on touch-only devices
import * as THREE from 'three';
import { TUNING, State } from './config.js';
import { store } from './store.js';
import { el, ui } from './dom.js';
import { scene, camera, composer, clock, listener } from './core.js';
import { smooth } from './helpers.js';
import { C, R, waveLights, mascot, orb, orbGlow, doorPivot, kLid } from './world.js';
import { radioSound } from './audio.js';
import { currentCaptionText, playNarration, isSpeaking } from './captions.js';
import { updateFocusHint } from './interact.js';
import { keys, initInput } from './input.js';

/* ============================================================
   INTRO → TRANSITION → WALK
   ============================================================ */
const player = { z: -0.5 };
let dolly = null;

const narrationIntro = [
  { start: 0.0, end: 3.6, text: 'You reached for it. Most people just watch.' },
  { start: 3.6, end: 7.4, text: 'This corridor is everything I learned on the way here.' },
  { start: 7.4, end: 11.0, text: "Walk. Look closer. Don't let go of the dreams." },
];

function orbInReach() {
  return Math.abs(player.z - orb.position.z) < 2.2;  // intro: any E near the start works
}

function touchTheOrb() {
  store.state = State.TRANSITION;
  ui.invite.classList.remove('visible');

  // three things fire AT ONCE — this sync is the whole feeling
  waveLights.forEach((l, i) => { l.userData.turnOnAt = clock.elapsedTime + i * TUNING.lightWaveStep; });
  playNarration(narrationIntro);
  const from = camera.position.clone();
  const shoulder = mascot.position.clone().add(new THREE.Vector3(0.15, 1.45, 0.5));
  const eye = new THREE.Vector3(0, 1.6, mascot.position.z);
  dolly = { curve: new THREE.CatmullRomCurve3([from, shoulder, eye]), t: 0 };
}

initInput({ onOrbReach: () => { if (orbInReach()) touchTheOrb(); } });

/* ============================================================
   CONSENT GATE → begin
   ============================================================ */
function begin(withSound) {
  store.audioEnabled = withSound;
  if (withSound) listener.context.resume();          // user gesture unlocks audio
  ui.consent.hidden = true;
  store.state = State.INTRO;
  camera.position.set(0.4, 2.0, 0.4);                // third person: behind the mascot
  camera.lookAt(mascot.position.x, 1.0, mascot.position.z);
  setTimeout(() => ui.invite.classList.add('visible'), 1200);
  animate();
}
el('sound-on').addEventListener('click', () => begin(true));
el('sound-off').addEventListener('click', () => begin(false));

/* ============================================================
   MAIN LOOP
   ============================================================ */
function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();

  // walking (corridor is a rail: x stays 0)
  if (store.state === State.WALK) {
    const fwd = keys.ArrowUp || keys.KeyW, back = keys.ArrowDown || keys.KeyS;
    if (fwd)  player.z -= TUNING.walkSpeed * dt;
    if (back) player.z += TUNING.walkSpeed * dt;
    const maxZ = store.doorOpen ? -C.length - R.length + 1.4 : -C.length + 0.9;
    player.z = THREE.MathUtils.clamp(player.z, maxZ, -0.5);
    camera.position.set(0, 1.6, player.z);
    camera.lookAt(0, 1.5, player.z - 2);
    updateFocusHint();
  }

  // camera dolly (third → first person, eased)
  if (dolly) {
    dolly.t = Math.min(dolly.t + dt / TUNING.dollyDuration, 1);
    const e = dolly.t * dolly.t * (3 - 2 * dolly.t);          // smoothstep
    camera.position.copy(dolly.curve.getPoint(e));
    camera.lookAt(0, 1.5, camera.position.z - 3);
    if (dolly.t === 1) {
      player.z = camera.position.z;
      mascot.visible = false;                                  // you become the figure
      dolly = null;
      store.state = State.WALK;
    }
  }

  // light wave: lamps come on in sequence
  for (const l of waveLights) {
    if (l.userData.turnOnAt !== undefined && clock.elapsedTime >= l.userData.turnOnAt) {
      l.intensity = smooth(l.intensity, l.userData.targetIntensity, 0.08, dt);
    }
  }
  // orb settles once the world is lit
  if (store.state !== State.CONSENT && store.state !== State.INTRO) {
    orb.material.emissiveIntensity = smooth(orb.material.emissiveIntensity, 0.6, 0.05, dt);
    orbGlow.intensity = smooth(orbGlow.intensity, 0, 0.05, dt);
  }

  // focus zoom in/out
  if (store.focusTarget) {
    camera.position.x = smooth(camera.position.x, store.focusTarget.pos.x, 0.12, dt);
    camera.position.y = smooth(camera.position.y, store.focusTarget.pos.y, 0.12, dt);
    camera.position.z = smooth(camera.position.z, store.focusTarget.pos.z, 0.12, dt);
    camera.lookAt(store.focusTarget.look);
  } else if (store.state === State.WALK && store.savedCam) {
    store.savedCam = null;   // walking resets the camera every frame anyway
  }

  // door swings open
  if (store.doorOpen) doorPivot.rotation.y = smooth(doorPivot.rotation.y, -Math.PI / 1.8, 0.06, dt);
  // keepsake lid
  kLid.rotation.x = smooth(kLid.rotation.x, store.lidOpen ? -Math.PI * 0.55 : 0, 0.1, dt);

  // idle mascot breathing (intro only)
  if (mascot.visible) mascot.position.y = Math.sin(clock.elapsedTime * 2) * 0.03;

  // captions + ducking: radio steps back while a voice speaks
  const text = currentCaptionText();
  ui.captions.hidden = !text;
  ui.captions.textContent = text;
  if (store.audioEnabled && radioSound.isPlaying) {
    const target = isSpeaking() ? TUNING.duckedVolume : TUNING.radioVolume;
    radioSound.setVolume(smooth(radioSound.getVolume(), target, 0.08, dt));
  }

  composer.render();
}

/* render one frame so the consent screen has a live backdrop */
composer.render();

/* dev-only debug hook (harmless in production, handy in the console) */
window.__world = {
  get state() { return store.state; },
  player, orb, touchTheOrb, orbInReach, camera,
  step: () => animate(),   // manual frame step for environments without rAF
};
