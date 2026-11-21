import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Halo } from './lib/Glow'

// A planet you can click to travel somewhere: a small world with a floating
// neon sign. The arcade, cinema and museum are all built from this.

const SUB_FONT = '"Pixelify Sans", monospace' // has Turkish letters

function signTexture({ title, sub, titleFont, glow, fill, subColor }) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 320
  const ctx = c.getContext('2d')
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  let size = 110
  ctx.font = `${size}px ${titleFont}`
  while (ctx.measureText(title).width > 960 && size > 50) ctx.font = `${(size -= 6)}px ${titleFont}`
  for (const blur of [50, 24, 10]) {
    ctx.shadowColor = glow
    ctx.shadowBlur = blur
    ctx.fillStyle = fill
    ctx.fillText(title, 512, 120)
  }
  ctx.shadowBlur = 0
  ctx.fillStyle = '#fff'
  ctx.fillText(title, 512, 120)
  ctx.font = `600 52px ${SUB_FONT}`
  ctx.shadowColor = subColor
  ctx.shadowBlur = 16
  ctx.fillStyle = subColor
  ctx.fillText(sub, 512, 250)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export default function PortalPlanet({
  position,
  onEnter,
  radius = 2.2,
  title,
  sub = 'tıkla ve gir',
  titleFont = '"Press Start 2P", monospace',
  colors, // { body, emissive, grid, halo, glow, fill, sub }
  spin = 0.15,
  tilt = [0.25, 0, 0.15],
  children, // decoration that rotates with the planet (rings, columns…)
}) {
  const group = useRef()
  const planet = useRef()
  const signMat = useRef()
  const [hovered, setHovered] = useState(false)
  const [fontReady, setFontReady] = useState(false)

  useEffect(() => {
    let alive = true
    Promise.all([document.fonts?.load(`40px ${titleFont}`), document.fonts?.load(`600 40px ${SUB_FONT}`)])
      .catch(() => {})
      .finally(() => alive && setFontReady(true))
    return () => {
      alive = false
    }
  }, [titleFont])

  const sign = useMemo(
    () => signTexture({ title, sub, titleFont, glow: colors.glow, fill: colors.fill, subColor: colors.sub }),
    [title, sub, titleFont, colors, fontReady] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const grid = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(radius * 1.005, 2)), [radius])

  useEffect(() => {
    if (!hovered) return
    document.body.style.cursor = 'pointer'
    return () => (document.body.style.cursor = '')
  }, [hovered])

  // flicker at a different moment for each planet
  const offset = useMemo(() => Math.random() * 5, [])

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    if (planet.current) planet.current.rotation.y += dt * spin
    if (group.current) {
      const s = THREE.MathUtils.damp(group.current.scale.x, hovered ? 1.12 : 1, 6, dt)
      group.current.scale.setScalar(s)
      group.current.position.y = position[1] + Math.sin(t * 0.6 + offset) * 0.25
    }
    if (signMat.current) {
      const flicker = (t + offset) % 5 > 4.75 && Math.sin(t * 70) > 0
      signMat.current.opacity = flicker ? 0.3 : 1
    }
  })

  return (
    <group ref={group} position={position}>
      <Halo color={colors.halo} size={radius * 5} opacity={hovered ? 0.6 : 0.4} />
      <group
        ref={planet}
        rotation={tilt}
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
          <sphereGeometry args={[radius, 48, 32]} />
          <meshStandardMaterial color={colors.body} emissive={colors.emissive} emissiveIntensity={0.6} roughness={0.5} />
        </mesh>
        <lineSegments geometry={grid}>
          <lineBasicMaterial color={colors.grid} transparent opacity={hovered ? 0.9 : 0.5} toneMapped={false} />
        </lineSegments>
        {children}
      </group>
      <mesh position={[0, radius + 1.5, 0]}>
        <planeGeometry args={[4.8, 1.5]} />
        <meshBasicMaterial ref={signMat} map={sign} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  )
}
