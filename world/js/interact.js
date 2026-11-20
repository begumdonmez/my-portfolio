/* ============================================================
   Interactables registry + crosshair raycast + focus (zoom on
   frames/posters). Focus/hint state lives on the shared store so
   input.js and main's loop can read it.
   ============================================================ */
import * as THREE from 'three';
import { camera } from './core.js';
import { ui } from './dom.js';
import { TUNING, State } from './config.js';
import { store } from './store.js';

export const interactables = [];

export function register(object, label, onInteract) {
  object.userData.label = label;
  object.userData.interact = onInteract;
  interactables.push(object);
}

function interactableRoot(mesh) {
  let o = mesh;
  while (o && !o.userData.interact) o = o.parent;
  return o;
}

/* ---------- Focus (zoom on frames/posters) ---------- */
function lookTarget() {
  return camera.position.clone().add(new THREE.Vector3(0, 0, -1));
}

export function focusOn(object, distance) {
  store.state = State.FOCUS;
  store.savedCam = { pos: camera.position.clone(), look: lookTarget() };
  const pos = object.localToWorld(new THREE.Vector3(0, 0, distance));
  store.focusTarget = { pos, look: object.getWorldPosition(new THREE.Vector3()) };
}

export function endFocus() {
  store.state = State.WALK;
  store.focusTarget = null;
}

/* ---------- Raycast: what am I looking at? ---------- */
const raycaster = new THREE.Raycaster();

export function updateFocusHint() {
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const hits = raycaster.intersectObjects(interactables, true);
  store.focused = (hits.length && hits[0].distance < TUNING.reachDistance)
    ? interactableRoot(hits[0].object) : null;
  ui.hint.hidden = !(store.focused && store.state === State.WALK);
  if (store.focused) ui.hintLabel.textContent = store.focused.userData.label;
}
