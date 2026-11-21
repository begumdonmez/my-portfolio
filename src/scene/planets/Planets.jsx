import Orbit from './Orbit'
import PrincePlanet from './PrincePlanet'
import NeonCube from './NeonCube'
import LavaPyramid from './LavaPyramid'
import WaterDonut from './WaterDonut'
import CrystalHex from './CrystalHex'
import RingedGiant from './RingedGiant'

// Where each world lives. x is squeezed on narrow screens so they stay in frame.
const LAYOUT = [
  { key: 'prince', World: PrincePlanet, anchor: [3.9, -2.1, 1.5], radius: 0.25, speed: 0.1, spin: 0, tilt: 0 },
  { key: 'neon', World: NeonCube, anchor: [-4.8, 2.6, -8], radius: 0.9, speed: 0.1, spin: 0.18, tilt: 0.5 },
  { key: 'lava', World: LavaPyramid, anchor: [7, -2.6, -13], radius: 1, speed: 0.08, spin: 0.15, tilt: 0.1 },
  { key: 'water', World: WaterDonut, anchor: [-0.5, 6, -17], radius: 1.2, speed: 0.07, spin: 0.2, tilt: 1.0 },
  { key: 'crystal', World: CrystalHex, anchor: [8, -4.2, -7], radius: 0.8, speed: 0.06, spin: 0.14, tilt: 0.4 },
  { key: 'giant', World: RingedGiant, anchor: [-15, -2, -40], radius: 1.5, speed: 0.03, spin: 0.05, tilt: 0 },
]

export default function Planets({ isMobile }) {
  return LAYOUT.map((p, i) => {
    const { key, World, anchor, ...orbit } = p
    return (
      <Orbit
        key={key}
        anchor={isMobile ? [anchor[0] * 0.45, anchor[1] * 1.2, anchor[2]] : anchor}
        phase={i * 1.7}
        {...orbit}
      >
        <group scale={isMobile ? 0.7 : 1}>
          <World />
        </group>
      </Orbit>
    )
  })
}
