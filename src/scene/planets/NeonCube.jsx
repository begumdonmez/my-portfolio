import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { Halo } from '../lib/Glow'

// A dark cube world covered in glowing plants on every face.
const S = 2
const COLORS = ['#3ff9ff', '#ff3fd8', '#9dff3f', '#b18cff']

// rotations that turn local +Y into each face normal
const FACES = [
  [0, 0, 0],
  [Math.PI, 0, 0],
  [Math.PI / 2, 0, 0],
  [-Math.PI / 2, 0, 0],
  [0, 0, Math.PI / 2],
  [0, 0, -Math.PI / 2],
]

function Plant({ position, height, color, seed, bulbs }) {
  const glow = useRef([])
  useFrame(({ clock }) => {
    const pulse = 1.6 + Math.sin(clock.elapsedTime * 1.4 + seed * 10) * 0.9
    glow.current.forEach((m) => m && (m.emissiveIntensity = pulse))
  })

  return (
    <group position={position} rotation={[(seed - 0.5) * 0.5, seed * 6, (seed - 0.5) * 0.4]}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.012, 0.02, height, 5]} />
        <meshStandardMaterial color="#10241f" emissive={color} emissiveIntensity={0.25} />
      </mesh>
      {Array.from({ length: bulbs }, (_, i) => {
        const t = 1 - i * 0.28
        const side = i % 2 ? 1 : -1
        return (
          <mesh key={i} position={[side * 0.05 * i, height * t, 0]} scale={1 - i * 0.2}>
            <sphereGeometry args={[0.055, 10, 8]} />
            <meshStandardMaterial
              ref={(m) => (glow.current[i] = m)}
              color={color}
              emissive={color}
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default function NeonCube() {
  const plants = useMemo(() => {
    const out = []
    FACES.forEach((rot, f) => {
      const count = f === 0 ? 9 : 5
      for (let i = 0; i < count; i++) {
        const seed = Math.random()
        out.push({
          face: f,
          rot,
          position: [(Math.random() - 0.5) * S * 0.8, 0, (Math.random() - 0.5) * S * 0.8],
          height: 0.18 + Math.random() * 0.4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          bulbs: 1 + Math.floor(Math.random() * 3),
          seed,
        })
      }
    })
    return out
  }, [])

  return (
    <group>
      <Halo color="#3ff9ff" size={6} opacity={0.3} />
      <RoundedBox args={[S, S, S]} radius={0.22} smoothness={4}>
        <meshStandardMaterial color="#17202a" roughness={0.75} metalness={0.15} />
      </RoundedBox>
      {plants.map((p, i) => (
        <group key={i} rotation={p.rot}>
          <group position={[0, S / 2, 0]}>
            <Plant {...p} />
          </group>
        </group>
      ))}
    </group>
  )
}
