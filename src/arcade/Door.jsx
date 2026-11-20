import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { doorTransform } from './games'
import { input, useArcade } from './store'
import { sfx } from './sound'
import { neonSignTexture } from './textures'

const W = 1.5
const H = 2.5

// A soft light pool spilling out of the doorway onto the carpet.
function glowTexture(color) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, color)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// The doorway itself: a dark opening with a slow pulsing gradient, like a portal.
const portalShader = {
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uA;
    uniform vec3 uB;
    varying vec2 vUv;
    void main() {
      vec2 p = vUv - 0.5;
      float edge = smoothstep(0.5, 0.0, max(abs(p.x) * 1.0, abs(p.y) * 0.6));
      float bands = 0.5 + 0.5 * sin(vUv.y * 18.0 - uTime * 2.0);
      vec3 col = mix(uA, uB, vUv.y + 0.15 * sin(uTime + vUv.x * 6.0));
      col *= (0.08 + 0.22 * bands * (1.0 - edge)) ;
      gl_FragColor = vec4(col, 1.0);
      #include <colorspace_fragment>
    }
  `,
}

function Tube({ position, size, color }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

export default function Door({ door }) {
  const { position, rotY } = doorTransform(door)
  const [c1, c2] = door.colors
  const [hovered, setHovered] = useState(false)
  const portal = useRef()
  const signMat = useRef()
  const sign = useMemo(
    () =>
      neonSignTexture([
        { text: 'X O X', color: c2, size: 230, y: 0.42 },
        { text: 'ODASI', color: c1, size: 110, y: 0.82 },
      ]),
    [c1, c2]
  )
  const glow = useMemo(() => glowTexture(c1), [c1])
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uA: { value: new THREE.Color(c1) }, uB: { value: new THREE.Color(c2) } }),
    [c1, c2]
  )

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : ''
    return () => (document.body.style.cursor = '')
  }, [hovered])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (portal.current) portal.current.uniforms.uTime.value = t
    if (signMat.current) signMat.current.opacity = t % 6 > 5.8 && Math.sin(t * 70) > 0 ? 0.3 : 1
  })

  const onClick = (e) => {
    e.stopPropagation()
    if (input.dragDistance > 6) return
    const s = useArcade.getState()
    if (s.mode !== 'walk' && s.mode !== 'approach') return
    const id = `door:${door.id}`
    if (s.near === id) {
      sfx.door()
      s.goRoom(door.id)
    } else s.walkTo(id)
  }

  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh
        position={[0, H / 2, 0.01]}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          sfx.hover()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[W, H]} />
        <shaderMaterial ref={portal} uniforms={uniforms} {...portalShader} />
      </mesh>
      {/* neon frame */}
      <Tube position={[0, H, 0.04]} size={[W + 0.1, 0.05, 0.05]} color={hovered ? '#ffffff' : c1} />
      <Tube position={[-W / 2 - 0.03, H / 2, 0.04]} size={[0.05, H, 0.05]} color={hovered ? '#ffffff' : c1} />
      <Tube position={[W / 2 + 0.03, H / 2, 0.04]} size={[0.05, H, 0.05]} color={hovered ? '#ffffff' : c1} />
      <Tube position={[0, H + 0.12, 0.04]} size={[W + 0.4, 0.025, 0.025]} color={c2} />
      {/* sign above the door */}
      <mesh position={[0, H + 0.62, 0.03]}>
        <planeGeometry args={[2.4, 0.75]} />
        <meshBasicMaterial ref={signMat} map={sign} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      {/* light spilling onto the floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0.9]}>
        <planeGeometry args={[2.6, 1.8]} />
        <meshBasicMaterial
          map={glow}
          transparent
          opacity={hovered ? 0.55 : 0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 1.4, 0.6]} color={c1} intensity={2.5} distance={4} />
    </group>
  )
}
