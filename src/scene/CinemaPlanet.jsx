import { useMemo } from 'react'
import PortalPlanet from './PortalPlanet'

const R = 2
const COLORS = { body: '#2a0710', emissive: '#4a0a18', grid: '#ffb34d', halo: '#ff3b5c', glow: '#ff3b5c', fill: '#ff7a8a', sub: '#ffd27a' }
const HOLES = 36

// a velvet-red world wrapped in a strip of film
export default function CinemaPlanet({ position, onEnter }) {
  const holes = useMemo(
    () =>
      Array.from({ length: HOLES }, (_, i) => {
        const a = (i / HOLES) * Math.PI * 2
        return a
      }),
    []
  )
  const r = R * 1.6
  return (
    <PortalPlanet position={position} onEnter={onEnter} radius={R} title="SİNEMA" titleFont='"Pixelify Sans", monospace' colors={COLORS} spin={0.1} tilt={[0.35, 0, -0.2]}>
      <group rotation={[Math.PI / 2.4, 0, 0]}>
        {/* the strip */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[r, r, 0.5, 96, 1, true]} />
          <meshStandardMaterial color="#141016" roughness={0.6} side={2} />
        </mesh>
        {/* sprocket holes on both edges glow like a projector */}
        {holes.map((a) =>
          [-0.19, 0.19].map((y) => (
            <mesh key={`${a}${y}`} position={[Math.cos(a) * (r + 0.01), Math.sin(a) * (r + 0.01), y]} rotation={[0, 0, a]}>
              <boxGeometry args={[0.02, 0.09, 0.07]} />
              <meshBasicMaterial color="#ffd27a" toneMapped={false} />
            </mesh>
          ))
        )}
      </group>
    </PortalPlanet>
  )
}
