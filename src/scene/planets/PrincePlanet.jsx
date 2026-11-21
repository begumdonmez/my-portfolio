import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { makeTerrain } from '../lib/terrain'
import { Atmosphere, Halo } from '../lib/Glow'
import Grass from './Grass'

// A small grassy world. On top, a boy with a long scarf and a fox sit with
// their backs to us, looking out at the stars. Warm light from in front of
// them rims their hair and fur.

const TERRAIN = { radius: 1.5, amp: 0.07, freq: 1.6, seed: 7, detail: 5 }
const PALETTE = [
  [0, '#1f4a1c'],
  [0.45, '#2f6a25'],
  [0.7, '#4f8f34'],
  [1, '#7db54a'],
]
const TOP = TERRAIN.radius + 0.01

const HAIR = ['#f6c445', '#eaa83a', '#ffd970', '#f2b63f']
const FUR = '#d8612a'
const CREAM = '#f5ebe0'

function lathe(points, segments = 18) {
  return new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), segments)
}

function Hair() {
  // windswept spikes over the back and top of the head, swept to the right
  const spikes = useMemo(() => {
    const out = []
    const up = new THREE.Vector3(0, 1, 0)
    const wind = new THREE.Vector3(1, 0.25, 0.15).normalize()
    for (let i = 0; i < 46; i++) {
      const n = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 1.3 - 0.25, Math.random() * 1.4 - 0.2)
      if (n.lengthSq() < 0.05) continue
      n.normalize()
      const dir = n.clone().lerp(wind, 0.45 + Math.random() * 0.2).normalize()
      const len = 0.06 + Math.random() * 0.07
      out.push({
        position: n.clone().multiplyScalar(0.075).add(dir.clone().multiplyScalar(len * 0.45)).toArray(),
        quaternion: new THREE.Quaternion().setFromUnitVectors(up, dir).toArray(),
        len,
        color: HAIR[i % HAIR.length],
      })
    }
    return out
  }, [])

  return (
    <group>
      <mesh scale={[1, 0.95, 1]}>
        <sphereGeometry args={[0.085, 14, 12]} />
        <meshStandardMaterial color="#f2b63f" emissive="#f6c445" emissiveIntensity={0.25} roughness={0.6} />
      </mesh>
      {spikes.map((s, i) => (
        <mesh key={i} position={s.position} quaternion={s.quaternion}>
          <coneGeometry args={[0.022, s.len, 4]} />
          <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.35} roughness={0.5} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// A ribbon that flutters to the right, rebuilt every frame.
function ScarfTail({ length = 0.75, width = 0.075, segments = 28 }) {
  const geo = useMemo(() => new THREE.PlaneGeometry(length, width, segments, 1), [length, width, segments])
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array), [geo])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const bx = base[i * 3]
      const by = base[i * 3 + 1]
      const u = bx / length + 0.5 // 0 at the neck, 1 at the tip
      const flutter = Math.sin(t * 3.2 - u * 7) * 0.05 * u
      const lift = Math.cos(t * 2.1 - u * 5) * 0.035 * u
      pos.setXYZ(i, u * length, by * (1 - u * 0.35) - u * u * 0.12 + flutter, lift + u * 0.05)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
  })

  return (
    <mesh geometry={geo}>
      <meshStandardMaterial
        color="#f6c13a"
        emissive="#f6b52a"
        emissiveIntensity={0.45}
        side={THREE.DoubleSide}
        roughness={0.55}
      />
    </mesh>
  )
}

function Boy(props) {
  const coat = useMemo(
    () => lathe([[0, 0], [0.15, 0], [0.16, 0.04], [0.135, 0.14], [0.1, 0.24], [0.065, 0.3], [0, 0.31]]),
    []
  )
  return (
    <group {...props}>
      <mesh geometry={coat}>
        <meshStandardMaterial color="#2d4f2b" roughness={0.75} />
      </mesh>
      {/* belt */}
      <mesh position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.138, 0.01, 6, 24]} />
        <meshStandardMaterial color="#8a6a2c" roughness={0.6} />
      </mesh>
      {/* scarf wrapped around the neck, tail streaming in the wind */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.06, 0.028, 8, 20]} />
        <meshStandardMaterial color="#f6c13a" emissive="#f6b52a" emissiveIntensity={0.45} />
      </mesh>
      <group position={[0.05, 0.3, 0.03]}>
        <ScarfTail />
      </group>
      <group position={[0, 0.4, 0]}>
        <Hair />
      </group>
    </group>
  )
}

function Fox(props) {
  const body = useMemo(() => lathe([[0, 0], [0.09, 0], [0.1, 0.05], [0.08, 0.13], [0.05, 0.19], [0, 0.21]]), [])
  const tail = useMemo(() => {
    // big bushy tail sweeping along the ground towards the boy
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.02, 0.03, 0.07),
      new THREE.Vector3(0.08, 0.025, 0.13),
      new THREE.Vector3(0.2, 0.025, 0.13),
      new THREE.Vector3(0.3, 0.03, 0.08),
    ])
    return Array.from({ length: 11 }, (_, i) => {
      const t = i / 10
      const r = 0.035 + Math.sin(t * Math.PI) * 0.035
      return { p: curve.getPoint(t).toArray(), r, tip: t > 0.82 }
    })
  }, [])

  const fur = <meshStandardMaterial color={FUR} emissive="#6a2208" emissiveIntensity={0.25} roughness={0.7} />

  return (
    <group {...props}>
      <mesh geometry={body}>{fur}</mesh>
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.07, 14, 12]} />
        {fur}
      </mesh>
      {/* tall ears with dark tips */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.04, 0.31, 0]} rotation={[0, 0, -side * 0.18]}>
          <mesh position={[0, 0.05, 0]}>
            <coneGeometry args={[0.032, 0.11, 5]} />
            {fur}
          </mesh>
          <mesh position={[0, 0.095, 0]}>
            <coneGeometry args={[0.012, 0.03, 5]} />
            <meshStandardMaterial color="#2a140b" />
          </mesh>
        </group>
      ))}
      {tail.map((s, i) => (
        <mesh key={i} position={s.p} scale={[1, 0.8, 1]}>
          <sphereGeometry args={[s.r, 10, 8]} />
          {s.tip ? <meshStandardMaterial color={CREAM} roughness={0.8} /> : fur}
        </mesh>
      ))}
    </group>
  )
}

function Rose(props) {
  return (
    <group {...props}>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.006, 0.008, 0.16, 5]} />
        <meshStandardMaterial color="#3c7a3c" />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <icosahedronGeometry args={[0.03, 0]} />
        <meshStandardMaterial color="#ff2f55" emissive="#ff2f55" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.09, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#cfe6ff" transparent opacity={0.18} roughness={0} metalness={0.2} />
      </mesh>
    </group>
  )
}

export default function PrincePlanet() {
  const terrain = useMemo(() => makeTerrain({ ...TERRAIN, palette: PALETTE }), [])
  const duo = useRef()

  // a slow breathing sway so the pair feel alive
  useFrame(({ clock }) => {
    if (duo.current) duo.current.rotation.z = Math.sin(clock.elapsedTime * 0.6) * 0.015
  })

  return (
    <group>
      <Halo color="#6fd0ff" size={6} opacity={0.35} />
      <mesh geometry={terrain}>
        <meshStandardMaterial vertexColors roughness={0.9} flatShading />
      </mesh>
      <Grass terrain={TERRAIN} />
      <Atmosphere radius={TERRAIN.radius} color="#7fd6ff" scale={1.12} />

      {/* the pair, facing away from the camera (towards -z) */}
      <group ref={duo} position={[0, TOP, 0]} scale={1.9}>
        <Fox position={[-0.17, 0, 0]} rotation={[0, 0.12, 0]} />
        <Boy position={[0.1, 0, 0]} rotation={[0, -0.08, 0]} />
        {/* warm light in front of them -> golden rim on hair, ears, scarf */}
        <pointLight position={[0, 0.5, -0.9]} color="#ffc677" intensity={3} distance={2.5} decay={1.5} />
      </group>

      <group position={[0.9, 1.15, 0.35]} rotation={[0.2, 0, -0.65]} scale={1.6}>
        <Rose />
      </group>
    </group>
  )
}
