// Small, dependency-free 3D value noise + fBm. Deterministic for a given seed,
// so the same point on a planet always gets the same height.

function hash(x, y, z, seed) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177) ^ Math.imul(seed, 1442695041)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

const fade = (t) => t * t * (3 - 2 * t)
const lerp = (a, b, t) => a + (b - a) * t

export function noise3(x, y, z, seed = 0) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const zi = Math.floor(z)
  const u = fade(x - xi)
  const v = fade(y - yi)
  const w = fade(z - zi)
  const c = (dx, dy, dz) => hash(xi + dx, yi + dy, zi + dz, seed)
  return lerp(
    lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v),
    lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v),
    w
  )
}

// Returns roughly 0..1
export function fbm(x, y, z, seed = 0, octaves = 4) {
  let sum = 0
  let amp = 0.5
  let freq = 1
  let norm = 0
  for (let i = 0; i < octaves; i++) {
    sum += noise3(x * freq, y * freq, z * freq, seed + i * 17) * amp
    norm += amp
    amp *= 0.5
    freq *= 2
  }
  return sum / norm
}
