import { useMemo } from 'react'
import PortalPlanet from './PortalPlanet'

const R = 2
const COLORS = { body: '#d9d2c3', emissive: '#3a3226', grid: '#ffd27a', halo: '#ffd27a', glow: '#ffb84d', fill: '#ffe2a8', sub: '#fff3d6' }
const COLUMNS = 18

// a marble world ringed by classical columns
export default function MuseumPlanet({ position, onEnter }) {
  const columns = useMemo(() => Array.from({ length: COLUMNS }, (_, i) => (i / COLUMNS) * Math.PI * 2), [])
  const r = R * 1.45
  return (
    <PortalPlanet position={position} onEnter={onEnter} radius={R} title="MÜZE" titleFont='"Pixelify Sans", monospace' colors={COLORS} spin={0.08} tilt={[0.2, 0, 0.25]}>
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.06, 8, 96]} />
          <meshBasicMaterial color="#ffd27a" toneMapped={false} />
        </mesh>
        {columns.map((a) => (
          <group key={a} position={[Math.cos(a) * r, 0, Math.sin(a) * r]}>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.07, 0.08, 0.7, 10]} />
              <meshStandardMaterial color="#f2ece0" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.73, 0]}>
              <boxGeometry args={[0.2, 0.06, 0.2]} />
              <meshStandardMaterial color="#f2ece0" roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </PortalPlanet>
  )
}
