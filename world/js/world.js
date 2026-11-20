/* ============================================================
   The world's contents — corridor + room geometry, lights,
   mascot, orb, and every prop. Real assets (GLB models) are
   placeholders here: primitive shapes and canvas textures stand
   in for them (greyboxing).
   Corridor z: 0 → -14, room z: -14 → -21.
   ============================================================ */
import * as THREE from 'three';
import { scene } from './core.js';
import { box, addBox, textTexture } from './helpers.js';
import { register, focusOn } from './interact.js';
import { showCaption } from './captions.js';
import { openComputer } from './computer.js';
import { store } from './store.js';

/* ---------- Dimensions ---------- */
export const C = { width: 2.6, height: 3, length: 14 };   // corridor
export const R = { width: 6, length: 7 };                 // room
export const roomZ = -C.length - R.length / 2;

const wallMat = new THREE.MeshStandardMaterial({ color: 0x232331 });
const floorMat = new THREE.MeshStandardMaterial({ color: 0x2e2b33 });

// corridor shell
addBox([0.2, C.height, C.length], wallMat, -C.width / 2, C.height / 2, -C.length / 2);
addBox([0.2, C.height, C.length], wallMat,  C.width / 2, C.height / 2, -C.length / 2);
addBox([C.width, 0.2, C.length], floorMat, 0, -0.1, -C.length / 2);
addBox([C.width, 0.2, C.length], wallMat, 0, C.height, -C.length / 2);
// room shell
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

export const waveLights = [];
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
export const mascot = new THREE.Group();
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
export const orb = new THREE.Mesh(
  new THREE.SphereGeometry(0.14, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xfff2e0, emissiveIntensity: 2.4 })
);
orb.position.set(0.45, 1.1, -2.2);
scene.add(orb);
export const orbGlow = new THREE.PointLight(0xffe8c4, 5, 4);
orb.add(orbGlow);

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
export const kLid = new THREE.Group();              // pivot group = hinge at the back edge
const lidMesh = box(0.3, 0.03, 0.22, 0x9d7b5b);
lidMesh.position.z = 0.11;                          // mesh offset so group origin sits on the hinge
kLid.add(lidMesh);
kLid.position.set(0, 0.075, -0.11);
keepsake.add(kBody, kLid);
keepsake.position.set(C.width / 2 - 0.32, 0.61, -10);
scene.add(keepsake);
register(keepsake, 'open the box', () => {
  store.lidOpen = !store.lidOpen;
  showCaption(store.lidOpen ? 'Polaroids of experiments. Some worked. All mattered.' : '', store.lidOpen ? 4 : 0);
});

/* ---------- Door (hinge = pivot group at the left edge) ---------- */
export const doorPivot = new THREE.Group();
const doorMesh = box(1.2, 2.1, 0.08, 0x5a4632);
doorMesh.position.x = 0.6;                          // offset → pivot rotates like a hinge
doorPivot.add(doorMesh);
doorPivot.position.set(-0.6, 1.05, -C.length);
scene.add(doorPivot);
register(doorPivot, 'open the door', () => {
  store.doorOpen = true;
  showCaption('The room remembers everything.', 3.5);
});

/* ---------- Room content ---------- */

// radio (audio.js attaches the PositionalAudio + station switching)
export const radio = new THREE.Group();
const radioBody = box(0.5, 0.28, 0.2, 0x8a3324);
const dial = box(0.08, 0.08, 0.02, 0x000000, { emissive: 0xfca311, emissiveIntensity: 1.2 });
dial.position.set(0.12, 0.02, 0.11);
radio.add(radioBody, dial);
radio.position.set(-2.2, 1.0, roomZ - 1);
scene.add(radio);
const radioStand = box(0.6, 0.9, 0.4, 0x4a4238);
radioStand.position.set(-2.2, 0.45, roomZ - 1);
scene.add(radioStand);

// tapes on a shelf (audio.js fills the shelf with playable tapes)
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
