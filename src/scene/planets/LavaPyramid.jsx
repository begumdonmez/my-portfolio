import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { fbm } from '../lib/noise'
import { Halo } from '../lib/Glow'

// A basalt pyramid split by rivers of lava, erupting at the summit, with a
// small industrial outpost built into one face and a glowing gas tail.

const R = 1.7
const H = 2.6

// Lava rivers run down from the summit (canvas top = cone tip), with cracks branching off.
function makeLavaTexture() {
  const W = 1024
  const Hc = 512
  const c = document.createElement('canvas')
  c.width = W
  c.height = Hc
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, W, Hc)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  const stroke = (pts, width) => {
    ctx.beginPath()
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.shadowColor = '#ff4a0a'
    ctx.shadowBlur = 22
    ctx.strokeStyle = '#ff5a14'
    ctx.lineWidth = width
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#ffc455'
    ctx.lineWidth = Math.max(1, width * 0.3)
    ctx.stroke()
  }

  // main rivers flowing downhill
  for (let k = 0; k < 14; k++) {
    let x = Math.random() * W
    let y = 0
    const pts = [[x, y]]
    while (y < Hc) {
      y += 10 + Math.random() * 14
      x += (Math.random() - 0.5) * 26
      pts.push([x, y])
      if (Math.random() < 0.12) {
        // branch crack
        let bx = x
        let by = y
        const branch = [[bx, by]]
        let a = Math.random() * Math.PI
        for (let j = 0; j < 8; j++) {
          a += (Math.random() - 0.5) * 1.2
          bx += Math.cos(a) * 12
          by += Math.abs(Math.sin(a)) * 12
          branch.push([bx, by])
        }
        stroke(branch, 2.5)
      }
    }
    stroke(pts, 4 + Math.random() * 6)
  }
  // pooled lava at the base
  const g = ctx.createLinearGradient(0, Hc * 0.82, 0, Hc)
  g.addColorStop(0, 'rgba(255,90,20,0)')
  g.addColorStop(1, 'rgba(255,110,30,0.85)')
  ctx.fillStyle = g
  ctx.fillRect(0, Hc * 0.82, W, Hc * 0.18)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  return tex
}

// Rough, displaced basalt cone with darker/lighter rock colours.
function makeRockGeometry() {
  const geo = new THREE.ConeGeometry(R, H, 4, 10, false)
  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)
  const v = new THREE.Vector3()
  const dark = new THREE.Color('#120c0a')
  const light = new THREE.Color('#3a2a22')
  const c = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const tipness = (v.y + H / 2) / H
    const n = fbm(v.x * 1.8 + 3, v.y * 1.8, v.z * 1.8, 11)
    if (tipness < 0.99) {
      const push = (n - 0.5) * 0.35 * (1 - tipness * 0.6)
      const radial = new THREE.Vector3(v.x, 0, v.z)
      if (radial.lengthSq() > 1e-6) radial.normalize().multiplyScalar(push)
      v.add(radial)
      v.y += (n - 0.5) * 0.12
    }
    pos.setXYZ(i, v.x, v.y, v.z)
    c.copy(dark).lerp(light, THREE.MathUtils.clamp(n * 1.4 - 0.2, 0, 1))
    colors.set([c.r, c.g, c.b], i * 3)
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  return geo
}

function Embers({ count = 22, top }) {
  const refs = useRef([])
  const seeds = useMemo(() => Array.from({ length: count }, () => Math.random()), [count])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    refs.current.forEach((m, i) => {
      if (!m) return
      const s = seeds[i]
      const life = (t * (0.3 + s * 0.3) + s) % 1
      const spread = 0.15 + life * 0.5
      m.position.set(Math.sin(s * 30) * spread, top + life * 1.8 - life * life * 0.6, Math.cos(s * 20) * spread)
      m.scale.setScalar((1 - life) * (0.5 + s * 0.8))
    })
  })
  return seeds.map((_, i) => (
    <mesh key={i} ref={(m) => (refs.current[i] = m)}>
      <sphereGeometry args={[0.05, 6, 4]} />
      <meshStandardMaterial color="#ffb04a" emissive="#ff7a1a" emissiveIntensity={3} toneMapped={false} />
    </mesh>
  ))
}

// Outpost: a terrace cut into the slope with a stacked tower, railings,
// lit windows, antennas and a blinking red beacon.
function Outpost(props) {
  const beacon = useRef()
  useFrame(({ clock }) => {
    if (beacon.current) beacon.current.emissiveIntensity = Math.sin(clock.elapsedTime * 4) > 0.2 ? 4 : 0.3
  })
  const metal = <meshStandardMaterial color="#3b3f45" metalness={0.8} roughness={0.35} />
  const rail = <meshStandardMaterial color="#c99a4a" metalness={0.7} roughness={0.4} />
  const windows = <meshStandardMaterial color="#9ff3ff" emissive="#5fe6ff" emissiveIntensity={2.2} toneMapped={false} />

  return (
    <group {...props}>
      {/* terrace */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.42, 0.46, 0.08, 20]} />
        {metal}
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.008, 4, 40]} />
        {rail}
      </mesh>
      {/* tower */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.32, 16]} />
        {metal}
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.185, 0.185, 0.04, 16, 1, true]} />
        {windows}
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.04, 20]} />
        {metal}
      </mesh>
      <mesh position={[0, 0.43, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.007, 4, 40]} />
        {rail}
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.11, 0.15, 0.2, 14]} />
        {metal}
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.035, 14, 1, true]} />
        {windows}
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.11, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        {metal}
      </mesh>
      {/* antennas + beacon */}
      {[
        [0.05, 0.85, 0.02, 0.4],
        [-0.06, 0.78, -0.03, 0.28],
      ].map(([x, y, z, h], i) => (
        <mesh key={i} position={[x, y, z]}>
          <cylinderGeometry args={[0.006, 0.01, h, 5]} />
          {metal}
        </mesh>
      ))}
      <mesh position={[0.05, 1.06, 0.02]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <meshStandardMaterial ref={beacon} color="#ff2a2a" emissive="#ff1a1a" emissiveIntensity={4} toneMapped={false} />
      </mesh>
      {/* walkway reaching out over the lava */}
      <mesh position={[0.55, -0.03, 0]}>
        <boxGeometry args={[0.35, 0.03, 0.09]} />
        {metal}
      </mesh>
      <pointLight position={[0, 0.3, 0.3]} color="#5fe6ff" intensity={0.8} distance={1.2} />
    </group>
  )
}

// Golden gas streaming off the planet; kept world-aligned so it always trails left.
function GasTail({ count = 260 }) {
  const group = useRef()
  const material = useRef()
  const q = useMemo(() => new THREE.Quaternion(), [])
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const seeds = new Float32Array(count)
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) seeds[i] = Math.random()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    return g
  }, [count])

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime
    if (group.current?.parent) {
      group.current.parent.getWorldQuaternion(q)
      group.current.quaternion.copy(q.invert())
    }
  })

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={/* glsl */ `
            attribute float aSeed;
            uniform float uTime;
            varying float vA;
            void main() {
              float life = fract(uTime * (0.06 + aSeed * 0.05) + aSeed);
              float ang = aSeed * 6.2831 * 7.0;
              float spread = 1.3 + life * 1.8;
              vec3 p = vec3(-0.8 - life * 7.0, sin(ang) * spread * 0.55, cos(ang) * spread * 0.35);
              vec4 mv = modelViewMatrix * vec4(p, 1.0);
              gl_Position = projectionMatrix * mv;
              gl_PointSize = (14.0 + aSeed * 22.0) * (1.0 - life * 0.5) * (10.0 / -mv.z);
              vA = (1.0 - life) * smoothstep(0.0, 0.08, life) * 0.18;
            }
          `}
          fragmentShader={/* glsl */ `
            varying float vA;
            void main() {
              float d = length(gl_PointCoord - 0.5);
              float a = smoothstep(0.5, 0.0, d) * vA;
              gl_FragColor = vec4(1.0, 0.68, 0.25, a);
            }
          `}
        />
      </points>
    </group>
  )
}

function Spire({ position, scale }) {
  return (
    <group position={position} scale={scale}>
      <mesh rotation={[0.1, 0.4, 0.08]} scale={[0.6, 2.2, 0.6]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color="#14100e" roughness={0.6} flatShading emissive="#ffb21a" emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[0.02, 0.05, 0.05]} rotation={[0.1, 0.4, 0.08]} scale={[0.1, 1.2, 0.4]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color="#ffd23a" emissive="#ffb21a" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function LavaPyramid() {
  const material = useRef()
  const lavaMap = useMemo(makeLavaTexture, [])
  const rock = useMemo(makeRockGeometry, [])

  // a point on one face, 30% of the way up, for the outpost terrace
  const outpost = useMemo(() => {
    const h = 0.28
    const y = -H / 2 + H * h
    const r = R * (1 - h) * 0.72
    const a = Math.PI / 4
    return [Math.sin(a) * r, y, Math.cos(a) * r]
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (material.current) material.current.emissiveIntensity = 2.4 + Math.sin(t * 1.6) * 0.5
    lavaMap.offset.y = -t * 0.015
  })

  return (
    <group>
      <Halo color="#ff7a2a" size={8} opacity={0.4} />
      <mesh geometry={rock}>
        <meshStandardMaterial
          ref={material}
          vertexColors
          roughness={0.9}
          flatShading
          emissive="#ff5a14"
          emissiveMap={lavaMap}
          emissiveIntensity={2.4}
        />
      </mesh>
      {/* molten summit */}
      <mesh position={[0, H / 2 - 0.05, 0]}>
        <coneGeometry args={[0.14, 0.2, 4]} />
        <meshStandardMaterial color="#ffb04a" emissive="#ff7a1a" emissiveIntensity={3.5} toneMapped={false} />
      </mesh>
      <pointLight position={[0, H / 2 + 0.5, 0]} color="#ff6a1a" intensity={8} distance={7} />
      <Embers top={H / 2} />

      <Outpost position={outpost} rotation={[0, Math.PI / 4, 0]} scale={0.9} />
      <Spire position={[-0.7, -0.55, 0.75]} scale={1.2} />
      <Spire position={[-0.95, -0.85, -0.4]} scale={0.9} />
      <Spire position={[0.4, -0.9, -0.95]} scale={1} />

      <GasTail />
    </group>
  )
}
