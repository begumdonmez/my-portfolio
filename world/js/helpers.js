/* ---------- Shared helpers ---------- */
import * as THREE from 'three';
import { scene } from './core.js';

// Canvas texture: placeholder for real JPG/WebP textures (diplomas, posters, labels)
export function textTexture(lines, { bg = '#F5F3EF', fg = '#14213D', ratio = 1.41 } = {}) {
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

export const box = (w, h, d, color, opts = {}) =>
  new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, ...opts }));

export function addBox(geoArgs, material, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(...geoArgs), material);
  m.position.set(x, y, z);
  scene.add(m);
  return m;
}

// frame-rate-independent lerp toward a target
export const smooth = (a, b, k, dt) => THREE.MathUtils.lerp(a, b, 1 - Math.pow(1 - k, dt * 60));
