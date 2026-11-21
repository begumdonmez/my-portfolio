import { useMemo } from 'react'
import * as THREE from 'three'
import { Atmosphere } from '../lib/Glow'

// Soft horizontal bands, like a gas giant seen from afar.
function makeBands() {
  const c = document.createElement('canvas')
  c.width = 32
  c.height = 256
  const ctx = c.getContext('2d')
  const palette = ['#2b2148', '#4b3d6e', '#6b5a92', '#3a2e5c', '#8a76b5', '#4b3d6e', '#2b2148']
  for (let y = 0; y < 256; y++) {
    const t = y / 255
    const k = t * (palette.length - 1)
    const a = new THREE.Color(palette[Math.floor(k)])
    const b = new THREE.Color(palette[Math.min(palette.length - 1, Math.ceil(k))])
    const col = a.lerp(b, k - Math.floor(k)).multiplyScalar(0.85 + Math.sin(y * 0.9) * 0.08)
    ctx.fillStyle = `#${col.getHexString()}`
    ctx.fillRect(0, y, 32, 1)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export default function RingedGiant() {
  const bands = useMemo(makeBands, [])
  return (
    <group rotation={[0.35, 0, 0.25]}>
      <mesh>
        <sphereGeometry args={[3.2, 64, 40]} />
        <meshStandardMaterial map={bands} emissive="#2a1f4a" emissiveIntensity={0.35} roughness={0.9} />
      </mesh>
      <Atmosphere radius={3.2} color="#a18cff" scale={1.08} strength={1.1} />
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.2, 6.4, 128]} />
        <meshStandardMaterial
          color="#c9bbff"
          emissive="#6b5bd6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
