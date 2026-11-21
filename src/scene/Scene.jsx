import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import Particles from './Particles'
import GoldenStars from './GoldenStars'
import CameraSpace from './CameraSpace'
import Earth from './Earth'
import ArcadePlanet from './ArcadePlanet'
import CinemaPlanet from './CinemaPlanet'
import MuseumPlanet from './MuseumPlanet'
import { Environment, Lightformer } from '@react-three/drei'
import { scroll, range, ease } from './scroll'

export const BG = '#07080b'
const START_Z = 42
const END_Z = 10

const SCROLL_TRAVEL = 52 // how far forward the camera flies while scrolling

// Flies the camera in after the intro, then forward as the page scrolls,
// with a little parallax from the cursor.
function CameraRig({ entered, reducedMotion }) {
  const light = useRef()
  const arrived = useRef(false)

  useFrame(({ camera, pointer }, dt) => {
    scroll.current = THREE.MathUtils.damp(scroll.current, scroll.target, 4, dt)
    const base = entered || reducedMotion ? END_Z : START_Z
    const targetZ = base - ease(range(scroll.current, 0, 0.55)) * SCROLL_TRAVEL
    if (!arrived.current && entered && Math.abs(camera.position.z - END_Z) < 0.4) arrived.current = true
    // slow cinematic fly-in first, then responsive scroll
    const lambda = reducedMotion ? 100 : arrived.current ? 4 : 0.9
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, lambda, dt)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 1.4, 2, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.y * 0.9, 2, dt)
    camera.lookAt(0, 0, camera.position.z - 40)

    if (light.current) {
      const l = light.current.position
      l.x = THREE.MathUtils.damp(l.x, pointer.x * 9, 4, dt)
      l.y = THREE.MathUtils.damp(l.y, pointer.y * 5, 4, dt)
      l.z = camera.position.z - 5
    }
  })

  return <pointLight ref={light} color="#c9bfff" intensity={70} distance={30} decay={1.5} />
}

export default function Scene({ entered, onReady, onTravel, reducedMotion, isMobile }) {
  return (
    <Canvas
      className="scene"
      dpr={[1, isMobile ? 1.5 : 1.75]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, reducedMotion ? END_Z : START_Z], fov: 55, near: 0.1, far: 320 }}
      onCreated={() => onReady?.()}
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 14, 90]} />
      <ambientLight intensity={0.08} />
      {/* cool key light from the upper left, warm fill from below right */}
      <directionalLight position={[-10, 8, 6]} intensity={1.1} color="#b7c0ff" />
      <directionalLight position={[8, -4, 4]} intensity={0.35} color="#ffb98a" />
      {/* soft studio-like reflections so materials don't look like plastic */}
      <Environment resolution={128} environmentIntensity={0.35}>
        <Lightformer form="rect" intensity={2} color="#8fa0ff" position={[0, 6, -6]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffcf9a" position={[6, 0, 6]} scale={[4, 4, 1]} />
        <Lightformer form="ring" intensity={0.8} color="#b18cff" position={[-6, 2, 4]} scale={3} />
      </Environment>

      <CameraRig entered={entered} reducedMotion={reducedMotion} />
      <Particles count={isMobile ? 1400 : 3200} />
      <GoldenStars />
      {/* the places you can visit, passed one after another while scrolling */}
      <MuseumPlanet position={isMobile ? [-2.4, 3.2, -40] : [-7, 2.6, -42]} onEnter={() => onTravel('/muze')} />
      <CinemaPlanet position={isMobile ? [-2.2, -2.8, -50] : [-9, -1.6, -53]} onEnter={() => onTravel('/sinema')} />
      <ArcadePlanet position={isMobile ? [2.6, 3.6, -60] : [7.5, 2.4, -62]} onEnter={() => onTravel('/arcade')} />
      <CameraSpace>
        <Earth isMobile={isMobile} />
      </CameraSpace>

      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.15} luminanceSmoothing={0.3} intensity={0.9} />
      </EffectComposer>
    </Canvas>
  )
}
