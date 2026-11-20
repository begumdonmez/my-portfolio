import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Halo } from './lib/Glow'

// The arcade's planet: a dark world wrapped in a neon grid with a ring and a
// flickering sign. Clicking it travels to /arcade.

const R = 2.2
const FONT = '"Press Start 2P", monospace'
const SUB_FONT = '"Pixelify Sans", monospace' // has Turkish letters

function signTexture(text, sub) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 320
  const ctx = c.getContext('2d')
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `110px ${FONT}`
  for (const blur of [50, 24, 10]) {
    ctx.shadowColor = '#f706cf'
    ctx.shadowBlur = blur
    ctx.fillStyle = '#ff63e4'
    ctx.fillText(text, 512, 120)
  }
  ctx.shadowBlur = 0
  ctx.fillStyle = '#fff'
  ctx.fillText(text, 512, 120)
  ctx.font = `600 52px ${SUB_FONT}`
  ctx.shadowColor = '#2de2e6'
  ctx.shadowBlur = 16
  ctx.fillStyle = '#9ff7f9'
  ctx.fillText(sub, 512, 250)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export default function ArcadePlanet({ position, onEnter }) {
  const group = useRef()
  const planet = useRef()
  const signMat = useRef()
  const [hovered, setHovered] = useState(false)
  const [fontReady, setFontReady] = useState(false)

  useEffect(() => {
    let alive = true
    Promise.all([document.fonts?.load(`40px ${FONT}`), document.fonts?.load(`600 40px ${SUB_FONT}`)])
      .catch(() => {})
      .finally(() => alive && setFontReady(true))
    return () => {
      alive = false
    }
  }, [])

  const sign = useMemo(() => signTexture('ARCADE', 'tıkla ve gir'), [fontReady]) // eslint-disable-line react-hooks/exhaustive-deps
  const grid = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(R * 1.005, 2)), [])

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : ''
    return () => (document.body.style.cursor = '')
  }, [hovered])

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    if (planet.current) planet.current.rotation.y += dt * 0.15
    if (group.current) {
      const target = hovered ? 1.12 : 1
      const s = THREE.MathUtils.damp(group.current.scale.x, target, 6, dt)
      group.current.scale.setScalar(s)
      group.current.position.y = position[1] + Math.sin(t * 0.6) * 0.25
    }
    if (signMat.current) {
      // neon tube flicker every few seconds
      const flicker = t % 5 > 4.75 && Math.sin(t * 70) > 0
      signMat.current.opacity = flicker ? 0.3 : 1
    }
  })

  return (
    <group ref={group} position={position}>
      <Halo color="#b14dff" size={11} opacity={hovered ? 0.6 : 0.4} />
      <group
        ref={planet}
        rotation={[0.25, 0, 0.15]}
        onClick={(e) => {
          e.stopPropagation()
          onEnter?.()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh>
          <sphereGeometry args={[R, 48, 32]} />
          <meshStandardMaterial color="#1a0f33" emissive="#2a0f4a" emissiveIntensity={0.6} roughness={0.5} />
        </mesh>
        <lineSegments geometry={grid}>
          <lineBasicMaterial color="#2de2e6" transparent opacity={hovered ? 0.9 : 0.5} toneMapped={false} />
        </lineSegments>
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[R * 1.55, 0.05, 8, 128]} />
          <meshBasicMaterial color="#f706cf" toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[R * 1.75, 0.025, 8, 128]} />
          <meshBasicMaterial color="#ffe66d" toneMapped={false} />
        </mesh>
      </group>
      <mesh position={[0, R + 1.5, 0]}>
        <planeGeometry args={[4.8, 1.5]} />
        <meshBasicMaterial ref={signMat} map={sign} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  )
}
