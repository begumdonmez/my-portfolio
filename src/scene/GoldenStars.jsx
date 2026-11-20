import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scroll, range } from './scroll'

// Glowing five-pointed stars scattered over the whole sky: many small ones,
// a few big ones, at different depths. Positions are picked in screen space
// so they fill the frame on any aspect ratio and keep clear of the title.

const COUNT = 26
const CAMERA_Z = 10 // where the camera settles after the intro
const HALF_FOV = Math.tan(THREE.MathUtils.degToRad(55 / 2))

// tiny seeded RNG so the sky looks the same on every visit
function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function layout(aspect) {
  const rand = rng(1943)
  const picked = []
  let tries = 0
  while (picked.length < COUNT && tries < 2000) {
    tries++
    const sx = rand() * 2 - 1
    const sy = rand() * 2 - 1
    // keep the bottom-left title and the top header text clear
    if (sx < 0.1 && sy < 0.08) continue
    if (sy > 0.78 && Math.abs(sx) > 0.5) continue
    if (picked.some((p) => Math.hypot((p.sx - sx) * aspect, p.sy - sy) < 0.32)) continue

    const z = -8 - rand() * 36
    // mostly small, a few large
    const size = 0.12 + Math.pow(rand(), 2.6) * 0.95
    picked.push({ sx, sy, z, size, seed: rand() })
  }

  return picked.map(({ sx, sy, z, size, seed }) => {
    const halfH = (CAMERA_Z - z) * HALF_FOV
    const halfW = halfH * aspect
    // farther stars get a little bigger so depth doesn't make them vanish
    const depthBoost = 1 + (-z - 8) / 60
    return { pos: [sx * halfW * 0.92, sy * halfH * 0.9, z], size: size * depthBoost, seed }
  })
}

function starGeometry() {
  const shape = new THREE.Shape()
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 0.42 : 1
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelSize: 0.08,
    bevelThickness: 0.12,
    bevelSegments: 2,
  })
  g.center()
  return g
}

export default function GoldenStars() {
  const geo = useMemo(starGeometry, [])
  const aspect = useThree((s) => s.size.width / s.size.height)
  const stars = useMemo(() => layout(aspect), [aspect])
  const refs = useRef([])
  const mats = useRef([])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    // the big stars thin out as we scroll towards Earth
    const fade = 1 - range(scroll.current, 0.05, 0.38)
    stars.forEach((star, i) => {
      const m = refs.current[i]
      // smaller stars disappear first, the biggest ones last
      const own = Math.min(1, Math.max(0, fade * 1.6 - (1 - Math.min(star.size, 1)) * 0.6))
      if (m) {
        m.visible = own > 0.01
        m.scale.setScalar(star.size * (0.35 + 0.65 * own))
        m.rotation.y = t * (0.2 + star.seed * 0.35) + star.seed * 6
        m.rotation.z = Math.sin(t * 0.5 + star.seed * 4) * 0.15
        m.position.y = star.pos[1] + Math.sin(t * 0.6 + star.seed * 8) * 0.12
      }
      const mat = mats.current[i]
      if (mat) {
        mat.emissiveIntensity = 1.5 + Math.sin(t * 1.3 + star.seed * 10) * 0.6
        mat.opacity = own
      }
    })
  })

  return stars.map((star, i) => (
    <mesh key={i} ref={(m) => (refs.current[i] = m)} geometry={geo} position={star.pos} scale={star.size}>
      <meshStandardMaterial
        ref={(m) => (mats.current[i] = m)}
        color="#ffe9b0"
        emissive="#ffd27a"
        emissiveIntensity={1.6}
        roughness={0.35}
        metalness={0.2}
        transparent
        toneMapped={false}
      />
    </mesh>
  ))
}
