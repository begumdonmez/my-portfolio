/* ============================================================
   Renderer / scene / camera / composer — the singletons every
   other module hangs off. Scale rule: 1 unit = 1 metre.
   ============================================================ */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { TUNING } from './config.js';
import { el } from './dom.js';

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x08080f);

export const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 60);

export const renderer = new THREE.WebGLRenderer({ canvas: el('scene'), antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

export const composer = new EffectComposer(renderer);
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

export const clock = new THREE.Clock();

export const listener = new THREE.AudioListener();
camera.add(listener);
