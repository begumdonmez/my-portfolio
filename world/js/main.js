/* ============================================================
   Layer C — the interactive world
   One file, clear sections. Real assets (GLB models, voice
   recordings) are placeholders here: primitive shapes, canvas
   textures and generated tones stand in for them (greyboxing).
   Scale rule: 1 unit = 1 metre.
   ============================================================ */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

/* ---------- Tuning: feel lives here, not buried in code ---------- */
const TUNING = {
  walkSpeed: 2.2,
  reachDistance: 2.3,
  dollyDuration: 1.8,
  lightWaveStep: 0.35,
  bloom: { strength: 0.9, radius: 0.4, threshold: 0.8 },
  duckedVolume: 0.12,
  radioVolume: 0.5,
};

/* ---------- DOM refs ---------- */
const el = (id) => document.getElementById(id);
const ui = {
  consent: el('consent'), mobile: el('mobile-notice'), invite: el('invite'),
  hint: el('hint'), hintLabel: el('hint-label'), captions: el('captions'),
  computer: el('computer'), computerList: el('computer-list'),
};

/* ---------- Mobile: capability check, not screen width ---------- */
const touchOnly = matchMedia('(pointer: coarse)').matches && !matchMedia('(pointer: fine)').matches;
const forceDesktop = new URLSearchParams(location.search).has('force');   // testing escape hatch
if (touchOnly && !forceDesktop) {
  ui.consent.hidden = true;
  ui.mobile.hidden = false;
  throw new Error('touch-only device: experience needs a keyboard'); // stop module cleanly
}

/* ---------- State machine ---------- */
const State = { CONSENT: 'consent', INTRO: 'intro', TRANSITION: 'transition',
                WALK: 'walk', FOCUS: 'focus', COMPUTER: 'computer' };
let state = State.CONSENT;

/* ---------- Renderer / scene / camera ---------- */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x08080f);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 60);

const renderer = new THREE.WebGLRenderer({ canvas: el('scene'), antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(
  new THREE.Vector2(innerWidth, innerHeight),
  TUNING.bloom.strength, TUNING.bloom.radius, TUNING.bloom.threshold
));

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
});

/* ---------- Helpers ---------- */

// Canvas texture: placeholder for real JPG/WebP textures (diplomas, posters, labels)
function textTexture(lines, { bg = '#F5F3EF', fg = '#14213D', ratio = 1.41 } = {}) {
  const w = 512, h = Math.round(w * ratio);
  const c = Object.assign(document.createElement('canvas'), { width: w, height: h });
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = fg; ctx.lineWidth = 6; ctx.strokeRect(24, 24, w - 48, h - 48);
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.font = '28px Georgia';
  lines.forEach((line, i) => ctx.fillText(line, w / 2, h / 2 + (i - (lines.length - 1) / 2) * 44));
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const box = (w, h, d, color, opts = {}) =>
  new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, ...opts }));

/* ---------- World geometry (corridor z: 0 → -14, room z: -14 → -21) ---------- */
const C = { width: 2.6, height: 3, length: 14 };   // corridor
const R = { width: 6, length: 7 };                 // room

const wallMat = new THREE.MeshStandardMaterial({ color: 0x232331 });
const floorMat = new THREE.MeshStandardMaterial({ color: 0x2e2b33 });

function addBox(geoArgs, material, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(...geoArgs), material);
  m.position.set(x, y, z);
  scene.add(m);
  return m;
}

// corridor shell
addBox([0.2, C.height, C.length], wallMat, -C.width / 2, C.height / 2, -C.length / 2);
addBox([0.2, C.height, C.length], wallMat,  C.width / 2, C.height / 2, -C.length / 2);
addBox([C.width, 0.2, C.length], floorMat, 0, -0.1, -C.length / 2);
addBox([C.width, 0.2, C.length], wallMat, 0, C.height, -C.length / 2);
// room shell
const roomZ = -C.length - R.length / 2;
addBox([0.2, C.height, R.length], wallMat, -R.width / 2, C.height / 2, roomZ);
addBox([0.2, C.height, R.length], wallMat,  R.width / 2, C.height / 2, roomZ);
addBox([R.width, C.height, 0.2], wallMat, 0, C.height / 2, -C.length - R.length);
addBox([R.width, 0.2, R.length], floorMat, 0, -0.1, roomZ);
addBox([R.width, 0.2, R.length], wallMat, 0, C.height, roomZ);
// wall around the door at the corridor/room boundary
addBox([(R.width - 1.2) / 2 + (R.width - C.width) / 2, C.height, 0.2], wallMat, -(1.2 / 2 + (R.width / 2 - 0.6) / 2 + 0.3), C.height / 2, -C.length);
addBox([(R.width - 1.2) / 2 + (R.width - C.width) / 2, C.height, 0.2], wallMat,  (1.2 / 2 + (R.width / 2 - 0.6) / 2 + 0.3), C.height / 2, -C.length);
addBox([1.2, C.height - 2.1, 0.2], wallMat, 0, 2.1 + (C.height - 2.1) / 2, -C.length);

/* ---------- Lights: dark until the wave ---------- */
scene.add(new THREE.AmbientLight(0xffffff, 0.03));

const waveLights = [];
for (let i = 0; i < 5; i++) {                       // corridor lamps
  const l = new THREE.PointLight(0xfff0dd, 0, 6);
  l.position.set(0, C.height - 0.4, -1.5 - i * 2.6);
  l.userData.targetIntensity = 14;
  scene.add(l); waveLights.push(l);
}
for (let i = 0; i < 2; i++) {                       // room lamps
  const l = new THREE.PointLight(0xfff0dd, 0, 8);
  l.position.set(i === 0 ? -1.6 : 1.6, C.height - 0.4, roomZ);
  l.userData.targetIntensity = 18;
  scene.add(l); waveLights.push(l);
}

/* ---------- Mascot (greybox: soft shapes until the Blender model) ---------- */
const mascot = new THREE.Group();
{
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf5f3ef, roughness: 0.6 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 24), bodyMat);
  body.scale.y = 1.25; body.position.y = 0.45;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), bodyMat);
  head.position.y = 1.05;
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x14213d });
  for (const dx of [-0.08, 0.08]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyeMat);
    eye.position.set(dx, 1.08, -0.2);
    mascot.add(eye);
  }
  mascot.add(body, head);
}
mascot.position.set(-0.35, 0, -2.2);
mascot.rotation.y = Math.PI;                        // facing away, toward the dark
scene.add(mascot);

/* ---------- The orb: warm white, the only thing that blooms ---------- */
const orb = new THREE.Mesh(
  new THREE.SphereGeometry(0.14, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xfff2e0, emissiveIntensity: 2.4 })
);
orb.position.set(0.45, 1.1, -2.2);
scene.add(orb);
const orbGlow = new THREE.PointLight(0xffe8c4, 5, 4);
orb.add(orbGlow);

/* ---------- Interactables registry ---------- */
const interactables = [];
function register(object, label, onInteract) {
  object.userData.label = label;
  object.userData.interact = onInteract;
  interactables.push(object);
}
function interactableRoot(mesh) {
  let o = mesh;
  while (o && !o.userData.interact) o = o.parent;
  return o;
}

/* ---------- Corridor content ---------- */

// framed diplomas (right wall) — one template pattern, texture varies
const diplomaData = [
  { lines: ['Diploma', 'University Name', '20XX'], z: -4 },
  { lines: ['Certificate', 'Course Name', '20XX'], z: -7 },
];
for (const d of diplomaData) {
  const group = new THREE.Group();
  const frame = box(0.62, 0.86, 0.04, 0x3a3226);
  const photo = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.5 * 1.41),
    new THREE.MeshStandardMaterial({ map: textTexture(d.lines) })
  );
  photo.position.z = 0.021;
  group.add(frame, photo);
  group.position.set(C.width / 2 - 0.12, 1.6, d.z);
  group.rotation.y = -Math.PI / 2;
  scene.add(group);
  register(group, 'look closer', () => focusOn(group, 0.9));
}

// project posters (left wall)
const posterTitles = ['BALLERINO ONLINE', "SANTA'S WORKERS"];
posterTitles.forEach((title, i) => {
  const poster = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 1),
    new THREE.MeshStandardMaterial({ map: textTexture([title, '', 'poster'], { bg: '#14213D', fg: '#FCA311', ratio: 1.43 }) })
  );
  poster.position.set(-C.width / 2 + 0.11, 1.6, -5 - i * 3.5);
  poster.rotation.y = Math.PI / 2;
  scene.add(poster);
  register(poster, 'a closer look', () => focusOn(poster, 1.1));
});

// keepsake nightstand + lid box (lid hinge = rotation, drawer would be a lerp)
const nightstand = box(0.6, 0.55, 0.4, 0x4a4238);
nightstand.position.set(C.width / 2 - 0.32, 0.275, -10);
scene.add(nightstand);
const keepsake = new THREE.Group();
const kBody = box(0.3, 0.12, 0.22, 0x8d6b4b);
const kLid = new THREE.Group();                     // pivot group = hinge at the back edge
const lidMesh = box(0.3, 0.03, 0.22, 0x9d7b5b);
lidMesh.position.z = 0.11;                          // mesh offset so group origin sits on the hinge
kLid.add(lidMesh);
kLid.position.set(0, 0.075, -0.11);
keepsake.add(kBody, kLid);
keepsake.position.set(C.width / 2 - 0.32, 0.61, -10);
scene.add(keepsake);
let lidOpen = false;
register(keepsake, 'open the box', () => {
  lidOpen = !lidOpen;
  showCaption(lidOpen ? 'Polaroids of experiments. Some worked. All mattered.' : '', lidOpen ? 4 : 0);
});

/* ---------- Door (hinge = pivot group at the left edge) ---------- */
const doorPivot = new THREE.Group();
const doorMesh = box(1.2, 2.1, 0.08, 0x5a4632);
doorMesh.position.x = 0.6;                          // offset → pivot rotates like a hinge
doorPivot.add(doorMesh);
doorPivot.position.set(-0.6, 1.05, -C.length);
scene.add(doorPivot);
let doorOpen = false;
register(doorPivot, 'open the door', () => {
  doorOpen = true;
  showCaption('The room remembers everything.', 3.5);
});

/* ---------- Room content ---------- */

// radio
const radio = new THREE.Group();
const radioBody = box(0.5, 0.28, 0.2, 0x8a3324);
const dial = box(0.08, 0.08, 0.02, 0x000000, { emissive: 0xfca311, emissiveIntensity: 1.2 });
dial.position.set(0.12, 0.02, 0.11);
radio.add(radioBody, dial);
radio.position.set(-2.2, 1.0, roomZ - 1);
scene.add(radio);
const radioStand = box(0.6, 0.9, 0.4, 0x4a4238);
radioStand.position.set(-2.2, 0.45, roomZ - 1);
scene.add(radioStand);

// tapes on a shelf
const tapeShelf = box(1.2, 0.06, 0.3, 0x4a4238);
tapeShelf.position.set(2.4, 1.1, roomZ - 1);
scene.add(tapeShelf);

// computer desk
const desk = box(1.4, 0.06, 0.7, 0x4a4238);
desk.position.set(0, 0.75, -C.length - R.length + 0.7);
scene.add(desk);
const screen = box(0.9, 0.55, 0.05, 0x000000, { emissive: 0x1a2f4a, emissiveIntensity: 1.4 });
screen.position.set(0, 1.25, -C.length - R.length + 0.55);
scene.add(screen);
register(screen, 'sit down', () => openComputer());

/* ============================================================
   AUDIO — WebAudio through Three.js
   Placeholder sound design: generated tones stand in for real
   music; caption timing stands in for Begüm's voice recordings.
   ============================================================ */
const listener = new THREE.AudioListener();
camera.add(listener);
let audioEnabled = false;

function makeChordBuffer(freqs, seconds = 4) {
  const ctx = listener.context;
  const rate = ctx.sampleRate;
  const buf = ctx.createBuffer(1, rate * seconds, rate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / rate;
    let v = 0;
    for (const f of freqs) v += Math.sin(2 * Math.PI * f * t) / freqs.length;
    const fade = Math.min(t / 0.3, (seconds - t) / 0.3, 1);   // loop-friendly edges
    data[i] = v * 0.25 * fade;
  }
  return buf;
}

const radioSound = new THREE.PositionalAudio(listener);
radioSound.setRefDistance(1.2);
radio.add(radioSound);

let stations = [];
let stationIndex = -1;
fetch('/data/songs.json').then(r => r.json()).then(d => { stations = d; });

register(radio, 'change station', () => {
  if (!stations.length) return;
  stationIndex = (stationIndex + 1) % stations.length;
  const st = stations[stationIndex];
  if (audioEnabled) {
    if (radioSound.isPlaying) radioSound.stop();
    radioSound.setBuffer(makeChordBuffer(st.notes));
    radioSound.setLoop(true);
    radioSound.setVolume(TUNING.radioVolume);
    radioSound.play();
  }
  showCaption(`📻 Now playing: ${st.title}`, 3.5);
});

/* ---------- Tapes: timed captions (voice recordings go here later) ---------- */
let tapes = [];
fetch('/data/tapes.json').then(r => r.json()).then(d => {
  tapes = d;
  d.forEach((tape, i) => {
    const t = box(0.16, 0.05, 0.1, 0x2b2b35);
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(0.13, 0.035),
      new THREE.MeshStandardMaterial({ map: textTexture([tape.label], { ratio: 0.28, bg: '#F5F3EF' }) })
    );
    label.position.set(0, 0.026, 0);
    label.rotation.x = -Math.PI / 2;
    t.add(label);
    t.position.set(2.1 + i * 0.35, 1.16, roomZ - 1);
    scene.add(t);
    register(t, `play tape: "${tape.label}"`, () => playTape(tape));
  });
});

let currentTape = null;   // { captions, startedAt }
function playTape(tape) {
  currentTape = { captions: tape.captions, startedAt: clock.elapsedTime };  // new tape cuts the old
}

/* ---------- Narration (corridor) — same caption engine ---------- */
const narrationIntro = [
  { start: 0.0, end: 3.6, text: 'You reached for it. Most people just watch.' },
  { start: 3.6, end: 7.4, text: 'This corridor is everything I learned on the way here.' },
  { start: 7.4, end: 11.0, text: "Walk. Look closer. Don't let go of the dreams." },
];

/* ============================================================
   CAPTIONS — one engine for narration, tapes and one-shots
   ============================================================ */
let oneShot = null;   // { text, until }
function showCaption(text, seconds) {
  oneShot = text ? { text, until: clock.elapsedTime + seconds } : null;
}

function currentCaptionText() {
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

let narration = null;
function playNarration(captions) {
  narration = { captions, startedAt: clock.elapsedTime };
}

/* ============================================================
   COMPUTER OVERLAY — data from the single source of truth
   ============================================================ */
async function openComputer() {
  state = State.COMPUTER;
  ui.computer.hidden = false;
  if (ui.computerList.childElementCount) return;    // already rendered
  try {
    const res = await fetch('/data/projects.json');
    const projects = await res.json();
    for (const p of projects) {
      const card = document.createElement('article');
      card.className = 'computer-project';
      const h3 = document.createElement('h3');
      h3.textContent = p.title;                     // textContent: XSS-safe by default
      const desc = document.createElement('p');
      desc.textContent = p.summary;
      const tech = document.createElement('p');
      tech.className = 'tech';
      tech.textContent = p.tech.join(' · ');
      card.append(h3, tech, desc);
      for (const [name, url] of Object.entries(p.links)) {
        const a = document.createElement('a');
        a.href = url;
        a.textContent = `${name} →`;
        card.append(a);
      }
      ui.computerList.append(card);
    }
  } catch (err) {
    console.error('projects.json failed:', err);
  }
}

/* ============================================================
   INPUT
   ============================================================ */
const keys = {};
addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) e.preventDefault();

  if (e.code === 'KeyE') {
    if (state === State.INTRO && orbInReach()) touchTheOrb();
    else if (state === State.WALK && focused) focused.userData.interact();
    else if (state === State.FOCUS) endFocus();
  }
  if (e.code === 'Escape') {
    if (state === State.COMPUTER) { ui.computer.hidden = true; state = State.WALK; }
    else if (state === State.FOCUS) endFocus();
  }
});
addEventListener('keyup', (e) => keys[e.code] = false);

/* ============================================================
   INTRO → TRANSITION → WALK
   ============================================================ */
const player = { z: -0.5 };
let dolly = null;

function orbInReach() {
  return Math.abs(player.z - orb.position.z) < 2.2;  // intro: any E near the start works
}

function touchTheOrb() {
  state = State.TRANSITION;
  ui.invite.classList.remove('visible');

  // three things fire AT ONCE — this sync is the whole feeling
  waveLights.forEach((l, i) => { l.userData.turnOnAt = clock.elapsedTime + i * TUNING.lightWaveStep; });
  playNarration(narrationIntro);
  const from = camera.position.clone();
  const shoulder = mascot.position.clone().add(new THREE.Vector3(0.15, 1.45, 0.5));
  const eye = new THREE.Vector3(0, 1.6, mascot.position.z);
  dolly = { curve: new THREE.CatmullRomCurve3([from, shoulder, eye]), t: 0 };
}

/* ---------- Focus (zoom on frames/posters) ---------- */
let focused = null;
let focusTarget = null;   // { pos, look }
let savedCam = null;

function focusOn(object, distance) {
  state = State.FOCUS;
  savedCam = { pos: camera.position.clone(), look: lookTarget() };
  const pos = object.localToWorld(new THREE.Vector3(0, 0, distance));
  focusTarget = { pos, look: object.getWorldPosition(new THREE.Vector3()) };
}

function endFocus() {
  state = State.WALK;
  focusTarget = null;
}

function lookTarget() {
  return camera.position.clone().add(new THREE.Vector3(0, 0, -1));
}

/* ---------- Raycast: what am I looking at? ---------- */
const raycaster = new THREE.Raycaster();
function updateFocusHint() {
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const hits = raycaster.intersectObjects(interactables, true);
  focused = (hits.length && hits[0].distance < TUNING.reachDistance)
    ? interactableRoot(hits[0].object) : null;
  ui.hint.hidden = !(focused && state === State.WALK);
  if (focused) ui.hintLabel.textContent = focused.userData.label;
}

/* ============================================================
   CONSENT GATE → begin
   ============================================================ */
function begin(withSound) {
  audioEnabled = withSound;
  if (withSound) listener.context.resume();          // user gesture unlocks audio
  ui.consent.hidden = true;
  state = State.INTRO;
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
const clock = new THREE.Clock();
const smooth = (a, b, k, dt) => THREE.MathUtils.lerp(a, b, 1 - Math.pow(1 - k, dt * 60));

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();

  // walking (corridor is a rail: x stays 0)
  if (state === State.WALK) {
    const fwd = keys.ArrowUp || keys.KeyW, back = keys.ArrowDown || keys.KeyS;
    if (fwd)  player.z -= TUNING.walkSpeed * dt;
    if (back) player.z += TUNING.walkSpeed * dt;
    const maxZ = doorOpen ? -C.length - R.length + 1.4 : -C.length + 0.9;
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
      state = State.WALK;
    }
  }

  // light wave: lamps come on in sequence
  for (const l of waveLights) {
    if (l.userData.turnOnAt !== undefined && clock.elapsedTime >= l.userData.turnOnAt) {
      l.intensity = smooth(l.intensity, l.userData.targetIntensity, 0.08, dt);
    }
  }
  // orb settles once the world is lit
  if (state !== State.CONSENT && state !== State.INTRO) {
    orb.material.emissiveIntensity = smooth(orb.material.emissiveIntensity, 0.6, 0.05, dt);
    orbGlow.intensity = smooth(orbGlow.intensity, 0, 0.05, dt);
  }

  // focus zoom in/out
  if (focusTarget) {
    camera.position.x = smooth(camera.position.x, focusTarget.pos.x, 0.12, dt);
    camera.position.y = smooth(camera.position.y, focusTarget.pos.y, 0.12, dt);
    camera.position.z = smooth(camera.position.z, focusTarget.pos.z, 0.12, dt);
    camera.lookAt(focusTarget.look);
  } else if (state === State.WALK && savedCam) {
    savedCam = null;   // walking resets the camera every frame anyway
  }

  // door swings open
  if (doorOpen) doorPivot.rotation.y = smooth(doorPivot.rotation.y, -Math.PI / 1.8, 0.06, dt);
  // keepsake lid
  kLid.rotation.x = smooth(kLid.rotation.x, lidOpen ? -Math.PI * 0.55 : 0, 0.1, dt);

  // idle mascot breathing (intro only)
  if (mascot.visible) mascot.position.y = Math.sin(clock.elapsedTime * 2) * 0.03;

  // captions + ducking: radio steps back while a voice speaks
  const text = currentCaptionText();
  ui.captions.hidden = !text;
  ui.captions.textContent = text;
  if (audioEnabled && radioSound.isPlaying) {
    const speaking = !!(currentTape || narration);
    const target = speaking ? TUNING.duckedVolume : TUNING.radioVolume;
    radioSound.setVolume(smooth(radioSound.getVolume(), target, 0.08, dt));
  }

  composer.render();
}

/* render one frame so the consent screen has a live backdrop */
composer.render();

/* dev-only debug hook (harmless in production, handy in the console) */
window.__world = {
  get state() { return state; },
  player, orb, touchTheOrb, orbInReach, camera,
  step: () => animate(),   // manual frame step for environments without rAF
};
