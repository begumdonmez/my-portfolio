import * as THREE from 'three'
import { fbm } from './noise'

// Height of the terrain along a unit direction.
export function terrainRadius(dir, { radius, amp, freq, seed }) {
  const n = fbm(dir.x * freq, dir.y * freq, dir.z * freq, seed)
  return radius + (n - 0.5) * 2 * amp
}

// A noise-displaced icosphere with per-vertex colours picked by height.
// `palette` is a list of [threshold 0..1, colour] sorted by threshold.
export function makeTerrain(opts) {
  const { radius, detail = 5, palette } = opts
  const geo = new THREE.IcosahedronGeometry(radius, detail)
  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)
  const dir = new THREE.Vector3()
  const col = new THREE.Color()
  const cols = palette.map(([t, c]) => [t, new THREE.Color(c)])

  for (let i = 0; i < pos.count; i++) {
    dir.fromBufferAttribute(pos, i).normalize()
    const r = terrainRadius(dir, opts)
    pos.setXYZ(i, dir.x * r, dir.y * r, dir.z * r)

    const h = THREE.MathUtils.clamp((r - radius) / (2 * opts.amp) + 0.5, 0, 1)
    let k = 0
    while (k < cols.length - 1 && h > cols[k + 1][0]) k++
    const [t0, c0] = cols[k]
    const [t1, c1] = cols[Math.min(k + 1, cols.length - 1)]
    col.copy(c0).lerp(c1, t1 > t0 ? THREE.MathUtils.clamp((h - t0) / (t1 - t0), 0, 1) : 0)
    // a little per-vertex jitter so flat shading reads as texture
    const j = 0.92 + Math.random() * 0.16
    colors.set([col.r * j, col.g * j, col.b * j], i * 3)
  }

  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  return geo
}

export function randomDirection(v = new THREE.Vector3()) {
  const u = Math.random() * 2 - 1
  const a = Math.random() * Math.PI * 2
  const s = Math.sqrt(1 - u * u)
  return v.set(s * Math.cos(a), u, s * Math.sin(a))
}
