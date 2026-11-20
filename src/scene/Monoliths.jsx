import { useMemo } from 'react'
import { Float } from '@react-three/drei'

// Dark, glossy shapes floating at different depths. They are nearly invisible
// until the cursor light passes over them, which is what sells the depth.
const SHAPES = [
  { geo: 'ico', pos: [-6, 1.5, -4], scale: 1.4 },
  { geo: 'torus', pos: [5.5, -1.2, -9], scale: 1.6 },
  { geo: 'box', pos: [2.5, 2.8, -16], scale: 1.8 },
  { geo: 'ico', pos: [-4, -2.5, -22], scale: 2.4 },
  { geo: 'torus', pos: [-8, 3, -30], scale: 2.8 },
  { geo: 'box', pos: [8, 0.5, -36], scale: 3 },
  { geo: 'ico', pos: [0.5, -0.5, -46], scale: 4 },
]

function Geometry({ type }) {
  if (type === 'torus') return <torusGeometry args={[1, 0.32, 32, 96]} />
  if (type === 'box') return <boxGeometry args={[1.2, 1.2, 1.2]} />
  return <icosahedronGeometry args={[1, 0]} />
}

export default function Monoliths() {
  const items = useMemo(
    () =>
      SHAPES.map((s, i) => ({
        ...s,
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        speed: 0.6 + (i % 3) * 0.25,
      })),
    []
  )

  return items.map((s, i) => (
    <Float key={i} speed={s.speed} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh position={s.pos} rotation={s.rot} scale={s.scale}>
        <Geometry type={s.geo} />
        <meshStandardMaterial color="#0d0e14" roughness={0.35} metalness={0.55} flatShading />
      </mesh>
    </Float>
  ))
}
