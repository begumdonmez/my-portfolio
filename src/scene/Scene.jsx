import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import Particles from './Particles'
import Monoliths from './Monoliths'

export const BG = '#07080b'
const START_Z = 42
const END_Z = 10

// Flies the camera forward once the intro is done, then follows the cursor.
function CameraRig({ entered, reducedMotion }) {
  const light = useRef()

  useFrame(({ camera, pointer }, dt) => {
    const targetZ = entered || reducedMotion ? END_Z : START_Z
    const lambda = reducedMotion ? 100 : 0.9
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, lambda, dt)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 1.4, 2, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.y * 0.9, 2, dt)
    camera.lookAt(0, 0, -30)

    if (light.current) {
      const l = light.current.position
      l.x = THREE.MathUtils.damp(l.x, pointer.x * 9, 4, dt)
      l.y = THREE.MathUtils.damp(l.y, pointer.y * 5, 4, dt)
      l.z = camera.position.z - 9
    }
  })

  return <pointLight ref={light} color="#c9bfff" intensity={160} distance={34} decay={1.5} />
}

export default function Scene({ entered, onReady, reducedMotion, isMobile }) {
  return (
    <Canvas
      className="scene"
      dpr={[1, isMobile ? 1.5 : 1.75]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, reducedMotion ? END_Z : START_Z], fov: 55, near: 0.1, far: 140 }}
      onCreated={() => onReady?.()}
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 8, 55]} />
      <ambientLight intensity={0.04} />
      <directionalLight position={[-10, 8, 6]} intensity={0.25} color="#6b74ff" />

      <CameraRig entered={entered} reducedMotion={reducedMotion} />
      <Particles count={isMobile ? 1400 : 3200} />
      <Monoliths />

      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.15} luminanceSmoothing={0.3} intensity={0.9} />
      </EffectComposer>
    </Canvas>
  )
}
