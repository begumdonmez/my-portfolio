import { useMemo } from 'react'
import { Halo } from '../lib/Glow'

// A hexagonal prism world with violet crystals growing from both caps.
const R = 1.5
const H = 1.1

export default function CrystalHex() {
  const crystals = useMemo(() => {
    const out = []
    for (const side of [1, -1]) {
      for (let i = 0; i < 9; i++) {
        const a = Math.random() * Math.PI * 2
        const d = Math.random() * R * 0.75
        const h = 0.25 + Math.random() * 0.6
        out.push({
          position: [Math.cos(a) * d, side * (H / 2 + h * 0.45), Math.sin(a) * d],
          rotation: [(Math.random() - 0.5) * 0.6 + (side < 0 ? Math.PI : 0), 0, (Math.random() - 0.5) * 0.6],
          scale: [0.12 + Math.random() * 0.1, h, 0.12 + Math.random() * 0.1],
          color: Math.random() < 0.3 ? '#ff7ad9' : '#8a6bff',
        })
      }
    }
    return out
  }, [])

  return (
    <group>
      <Halo color="#9b7bff" size={6} opacity={0.35} />
      <mesh>
        <cylinderGeometry args={[R, R, H, 6]} />
        <meshStandardMaterial color="#3a3366" emissive="#1d1640" emissiveIntensity={0.6} roughness={0.4} metalness={0.3} flatShading />
      </mesh>
      {crystals.map((c, i) => (
        <mesh key={i} position={c.position} rotation={c.rotation} scale={c.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={c.color}
            emissive={c.color}
            emissiveIntensity={1.4}
            roughness={0.15}
            flatShading
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}
