import PortalPlanet from './PortalPlanet'

// The planets you can visit. Each one is a PortalPlanet with its own look.

const R = 2.2

const ARCADE = { body: '#1a0f33', emissive: '#2a0f4a', grid: '#2de2e6', halo: '#b14dff', glow: '#f706cf', fill: '#ff63e4', sub: '#9ff7f9' }

// neon rings around a dark grid world
export default function ArcadePlanet({ position, onEnter }) {
  return (
    <PortalPlanet position={position} onEnter={onEnter} radius={R} title="ARCADE" colors={ARCADE}>
      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[R * 1.55, 0.05, 8, 128]} />
        <meshBasicMaterial color="#f706cf" toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[R * 1.75, 0.025, 8, 128]} />
        <meshBasicMaterial color="#ffe66d" toneMapped={false} />
      </mesh>
    </PortalPlanet>
  )
}
