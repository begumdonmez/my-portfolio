import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { LETTERS, LIMIT, PLAYERS, ROUND, ranking, useTrivia } from './store'
import { fx, vibrate } from '../xox/fx'
import { Rings, Sparks } from '../xox/Particles'
import { sfx } from '../sound'

// ZORP's trivia studio: a big question screen, a floating host and three
// alien contestants at their podiums. You play from the audience side.

const FONT = '"Pixelify Sans", monospace' // has Turkish letters
const PINK = '#f706cf'
const CYAN = '#2de2e6'
const YELLOW = '#ffe66d'
const ORANGE = '#ff7a45'
const GREEN = '#7dff8a'
const RED = '#ff3b5c'

const SCREEN = { pos: [0, 3.75, -3.8], size: [6, 2.6] }
const HOST_POS = [-4.2, 2.9, -3.1]
const PODIUM_X = { blip: -2.6, zuu: 0, krek: 2.6 }
const PODIUM_Z = -0.4
const ALIEN_IDS = ['blip', 'zuu', 'krek']
const colorOf = Object.fromEntries(PLAYERS.map((p) => [p.id, p.color]))
const nameOf = Object.fromEntries(PLAYERS.map((p) => [p.id, p.name]))

const usePortrait = () => useThree((s) => s.size.width / s.size.height < 0.9)

// canvas textures use Pixelify Sans: redraw once it has loaded
function useFontReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    document.fonts
      ?.load(`600 40px ${FONT}`)
      .catch(() => {})
      .finally(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [])
  return ready
}

// A canvas texture you can redraw in place.
function useCanvas(w, h) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return { canvas, ctx: canvas.getContext('2d'), tex }
  }, [w, h])
}

function glowText(ctx, text, x, y, size, color, weight = 600) {
  ctx.font = `${weight} ${size}px ${FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = color
  ctx.shadowBlur = size * 0.35
  ctx.fillStyle = color
  ctx.fillText(text, x, y)
  ctx.shadowBlur = 0
  ctx.fillStyle = '#ffffff'
  ctx.globalAlpha = 0.55
  ctx.fillText(text, x, y)
  ctx.globalAlpha = 1
}

// ---------- camera
function ShowCamera() {
  const camera = useThree((s) => s.camera)
  const portrait = usePortrait()
  const want = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    camera.position.set(0, 3, portrait ? 13 : 8)
  }, [camera, portrait])

  useFrame(({ pointer }, dt) => {
    if (portrait) {
      // tall screens: look down a little so the stage sits above the answer card
      want.set(pointer.x * 0.2, 3.6 + pointer.y * 0.1, 11)
      look.set(0, 0.2, -2)
    } else {
      want.set(pointer.x * 0.5, 2.35 + pointer.y * 0.2, 5.5)
      look.set(0, 1.55, -2)
    }
    camera.position.lerp(want, 1 - Math.exp(-dt * 2.5))
    const v = fx.shake.value
    fx.shake.value *= Math.exp(-dt * 7)
    const t = performance.now() / 1000
    if (v > 0.002) {
      camera.position.x += Math.sin(t * 63) * v * 0.08
      camera.position.y += Math.cos(t * 51) * v * 0.06
    }
    camera.lookAt(look)
    if (v > 0.002) camera.rotateZ(Math.sin(t * 37) * v * 0.015)
  })
  return null
}

// ---------- the big screen
function Screen() {
  const fontReady = useFontReady()
  const { canvas, ctx, tex } = useCanvas(1200, 520)
  const phase = useTrivia((s) => s.phase)
  const index = useTrivia((s) => s.index)
  const list = useTrivia((s) => s.list)
  const scores = useTrivia((s) => s.scores)
  const q = list[index]

  useEffect(() => {
    const { width: w, height: h } = canvas
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, '#120a2a')
    g.addColorStop(1, '#05030d')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    // faint pixel grid
    ctx.fillStyle = 'rgba(255,255,255,0.035)'
    for (let x = 0; x < w; x += 12) ctx.fillRect(x, 0, 2, h)
    for (let y = 0; y < h; y += 12) ctx.fillRect(0, y, w, 2)

    if (phase === 'intro') {
      glowText(ctx, "ZORP'UN", w / 2, h * 0.3, 96, CYAN)
      glowText(ctx, 'BİLGİ ŞOVU', w / 2, h * 0.62, 150, YELLOW)
    } else if (phase === 'end') {
      const top = ranking(scores)[0]
      glowText(ctx, 'FİNAL', w / 2, h * 0.26, 90, CYAN)
      glowText(ctx, top.id === 'you' ? 'KAZANAN: SEN!' : `KAZANAN: ${top.name}`, w / 2, h * 0.6, 120, top.color)
    } else if (q) {
      glowText(ctx, `SORU ${index + 1} / ${ROUND}`, w / 2, h * 0.24, 70, CYAN)
      glowText(ctx, q.cat, w / 2, h * 0.43, 46, ORANGE)
      if (phase === 'reveal') {
        glowText(ctx, `${LETTERS[q.correct]}  ·  ${q.options[q.correct]}`, w / 2, h * 0.72, q.options[q.correct].length > 14 ? 74 : 100, GREEN)
      } else {
        glowText(ctx, '?', w / 2, h * 0.73, 150, YELLOW)
      }
    }
    // scanlines
    ctx.fillStyle = 'rgba(0,0,0,0.22)'
    for (let y = 0; y < h; y += 5) ctx.fillRect(0, y, w, 2)
    tex.needsUpdate = true
  }, [canvas, ctx, tex, phase, index, q, scores, fontReady])

  const [w, h] = SCREEN.size
  return (
    <group position={SCREEN.pos}>
      <RoundedBox args={[w + 0.35, h + 0.35, 0.2]} radius={0.08} position={[0, 0, -0.12]}>
        <meshStandardMaterial color="#141024" metalness={0.5} roughness={0.4} />
      </RoundedBox>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {/* bulb frame like an old game show */}
      <Bulbs w={w + 0.18} h={h + 0.18} />
      <TimerBar width={w} y={-h / 2 - 0.42} />
    </group>
  )
}

// chasing marquee bulbs around the screen
function Bulbs({ w, h }) {
  const ref = useRef()
  const count = 44
  const points = useMemo(() => {
    const per = 2 * (w + h)
    return Array.from({ length: count }, (_, i) => {
      let d = (i / count) * per
      if (d < w) return [-w / 2 + d, h / 2]
      d -= w
      if (d < h) return [w / 2, h / 2 - d]
      d -= h
      if (d < w) return [w / 2 - d, -h / 2]
      d -= w
      return [-w / 2, -h / 2 + d]
    })
  }, [w, h])
  const color = useMemo(() => new THREE.Color(), [])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    points.forEach(([x, y], i) => {
      dummy.position.set(x, y, 0.02)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [points, dummy])

  useFrame(({ clock }) => {
    const phase = useTrivia.getState().phase
    const speed = phase === 'reveal' || phase === 'end' ? 18 : 6
    const t = clock.elapsedTime * speed
    for (let i = 0; i < count; i++) {
      const on = (Math.floor(t) + i) % 3 === 0
      color.set(on ? YELLOW : '#4a3510')
      ref.current.setColorAt(i, color)
    }
    ref.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <sphereGeometry args={[0.045, 10, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}

function TimerBar({ width, y }) {
  const bar = useRef()
  const mat = useRef()
  const lastTick = useRef(null)
  useFrame(() => {
    const s = useTrivia.getState()
    let left = 1
    if (s.phase === 'question') left = Math.max(0, 1 - (performance.now() - s.startedAt) / 1000 / LIMIT)
    else if (s.phase === 'reveal') left = 0
    bar.current.scale.x = Math.max(0.0001, left)
    bar.current.position.x = (-width / 2) * (1 - left)
    const secs = Math.ceil(left * LIMIT)
    mat.current.color.set(secs <= 5 && s.phase === 'question' ? RED : secs <= 9 ? YELLOW : CYAN)
    // tick through the last five seconds, unless you've already answered
    if (s.phase === 'question' && secs <= 5 && secs !== lastTick.current && s.answers.you === undefined) {
      lastTick.current = secs
      if (secs > 0) sfx.tick(secs <= 3)
    }
    if (s.phase !== 'question') lastTick.current = null
  })
  return (
    <group position={[0, y, 0]}>
      <mesh>
        <planeGeometry args={[width, 0.16]} />
        <meshBasicMaterial color="#1b1430" />
      </mesh>
      <mesh ref={bar} position={[0, 0, 0.01]}>
        <planeGeometry args={[width, 0.16]} />
        <meshBasicMaterial ref={mat} color={CYAN} toneMapped={false} />
      </mesh>
    </group>
  )
}

// ---------- ZORP, the host
function Host() {
  const root = useRef()
  const body = useRef()
  const pupil = useRef()
  const lid = useRef()
  const talk = useRef(0)
  const host = useTrivia((s) => s.host)

  useEffect(() => {
    talk.current = 1.6
  }, [host])

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    talk.current = Math.max(0, talk.current - dt)
    root.current.position.y = HOST_POS[1] + Math.sin(t * 1.4) * 0.12
    root.current.rotation.z = Math.sin(t * 0.9) * 0.06
    // bobbing while it talks
    const s = talk.current > 0 ? 1 + Math.abs(Math.sin(t * 14)) * 0.06 : 1
    body.current.scale.set(1 / Math.sqrt(s), s, 1 / Math.sqrt(s))
    // big eye follows the action: the screen while asking, you otherwise
    const phase = useTrivia.getState().phase
    const tx = phase === 'question' ? 0.12 : 0.06
    const ty = phase === 'question' ? 0.05 : -0.04
    pupil.current.position.x = THREE.MathUtils.damp(pupil.current.position.x, tx, 4, dt)
    pupil.current.position.y = THREE.MathUtils.damp(pupil.current.position.y, ty, 4, dt)
    lid.current.scale.y = t % 4.2 < 0.12 ? 1 : 0.001
  })

  return (
    <group ref={root} position={HOST_POS} rotation={[0, 0.35, 0]}>
      <group ref={body}>
        {/* head */}
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.55, 32, 24]} />
          <meshStandardMaterial color="#2bd9a8" roughness={0.35} emissive="#0b4a3a" emissiveIntensity={0.5} />
        </mesh>
        {/* one huge eye */}
        <group position={[0, 0.6, 0.42]}>
          <mesh>
            <sphereGeometry args={[0.27, 24, 18]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <mesh ref={pupil} position={[0.06, -0.04, 0.22]}>
            <sphereGeometry args={[0.1, 16, 12]} />
            <meshBasicMaterial color="#120a20" />
          </mesh>
          <mesh ref={lid} position={[0, 0, 0.02]} scale={[1, 0.001, 1]}>
            <sphereGeometry args={[0.285, 24, 18]} />
            <meshStandardMaterial color="#2bd9a8" />
          </mesh>
        </group>
        {/* antennae */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.25, 1.0, 0]} rotation={[0, 0, -s * 0.4]}>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
              <meshStandardMaterial color="#2bd9a8" />
            </mesh>
            <mesh position={[0, 0.42, 0]}>
              <sphereGeometry args={[0.07, 12, 10]} />
              <meshBasicMaterial color={YELLOW} toneMapped={false} />
            </mesh>
          </group>
        ))}
        {/* small body with a sparkly bow tie */}
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.28, 0.35, 6, 16]} />
          <meshStandardMaterial color="#1c1340" metalness={0.4} roughness={0.4} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.1, 0.02, 0.27]} rotation={[0, 0, (s * Math.PI) / 2]}>
            <coneGeometry args={[0.08, 0.16, 4]} />
            <meshBasicMaterial color={PINK} toneMapped={false} />
          </mesh>
        ))}
        {/* hover jet */}
        <mesh position={[0, -0.85, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.18, 0.5, 16, 1, true]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

// ---------- contestants
function Eye({ position, size = 0.13, look = [0, 0] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[size, 18, 14]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[look[0] * size * 0.3, look[1] * size * 0.3, size * 0.8]}>
        <sphereGeometry args={[size * 0.45, 12, 10]} />
        <meshBasicMaterial color="#0d0818" />
      </mesh>
    </group>
  )
}

// Each alien is built from a few primitives with its own silhouette.
function AlienBody({ id, color }) {
  const skin = <meshStandardMaterial color={color} roughness={0.4} emissive={color} emissiveIntensity={0.15} />
  if (id === 'blip') {
    // round blob with one big eye and two bobbly antennae
    return (
      <group>
        <mesh scale={[1, 0.85, 0.9]}>
          <sphereGeometry args={[0.5, 28, 20]} />
          {skin}
        </mesh>
        <Eye position={[0, 0.08, 0.38]} size={0.2} />
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.22, 0.38, 0]} rotation={[0, 0, -s * 0.35]}>
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.32, 8]} />
              {skin}
            </mesh>
            <mesh position={[0, 0.34, 0]}>
              <sphereGeometry args={[0.07, 12, 10]} />
              {skin}
            </mesh>
          </group>
        ))}
      </group>
    )
  }
  if (id === 'zuu') {
    // tall and serious, three eyes and a head fin
    return (
      <group>
        <mesh position={[0, 0.15, 0]}>
          <capsuleGeometry args={[0.36, 0.6, 8, 20]} />
          {skin}
        </mesh>
        {[-0.15, 0, 0.15].map((x) => (
          <Eye key={x} position={[x, 0.42, 0.3]} size={0.08} />
        ))}
        <mesh position={[0, 0.82, -0.05]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.22, 0.22, 0.05]} />
          <meshBasicMaterial color={PINK} toneMapped={false} />
        </mesh>
      </group>
    )
  }
  // krek: boxy, two eyes on wobbly stalks
  return (
    <group>
      <RoundedBox args={[0.8, 0.7, 0.6]} radius={0.16}>
        {skin}
      </RoundedBox>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.2, 0.32, 0.1]} rotation={[0, 0, -s * 0.25]}>
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.36, 8]} />
            {skin}
          </mesh>
          <Eye position={[0, 0.42, 0]} size={0.12} />
        </group>
      ))}
      <mesh position={[0, -0.12, 0.31]}>
        <boxGeometry args={[0.3, 0.05, 0.02]} />
        <meshBasicMaterial color="#2a1206" />
      </mesh>
    </group>
  )
}

function Podium({ id }) {
  const fontReady = useFontReady()
  const { canvas, ctx, tex } = useCanvas(512, 300)
  const score = useTrivia((s) => s.scores[id])
  const answer = useTrivia((s) => s.answers[id])
  const phase = useTrivia((s) => s.phase)
  const correct = useTrivia((s) => s.list[s.index]?.correct)
  const color = colorOf[id]
  const alien = useRef()
  const light = useRef()
  const hop = useRef(0)
  const mood = useRef(0) // +1 right, -1 wrong

  useEffect(() => {
    if (answer !== undefined) hop.current = 1
  }, [answer])
  useEffect(() => {
    mood.current = phase === 'reveal' && answer !== undefined ? (answer === correct ? 1 : -1) : phase === 'reveal' ? -1 : 0
  }, [phase, answer, correct])

  useEffect(() => {
    const { width: w, height: h } = canvas
    ctx.fillStyle = '#0b0718'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = color
    ctx.fillRect(0, 0, w, 10)
    glowText(ctx, nameOf[id], w / 2, 62, 58, color)
    glowText(ctx, String(score), w / 2, 160, 96, '#ffffff')
    if (answer !== undefined) {
      const revealed = phase === 'reveal'
      const c = revealed ? (answer === correct ? GREEN : RED) : YELLOW
      glowText(ctx, revealed ? LETTERS[answer] : 'KİLİTLİ', w / 2, 250, revealed ? 64 : 40, c)
    }
    tex.needsUpdate = true
  }, [canvas, ctx, tex, id, color, score, answer, phase, correct, fontReady])

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    hop.current = Math.max(0, hop.current - dt * 3)
    const happy = mood.current > 0
    const sad = mood.current < 0
    const base = 1.55 + Math.sin(t * 2 + PODIUM_X[id]) * 0.04
    const y = base + Math.sin(hop.current * Math.PI) * 0.2 + (happy ? Math.abs(Math.sin(t * 9)) * 0.22 : 0) - (sad ? 0.16 : 0)
    alien.current.position.y = THREE.MathUtils.damp(alien.current.position.y, y, 12, dt)
    const sq = sad ? 0.86 : 1
    alien.current.scale.y = THREE.MathUtils.damp(alien.current.scale.y, sq, 8, dt)
    alien.current.rotation.z = happy ? Math.sin(t * 9) * 0.12 : THREE.MathUtils.damp(alien.current.rotation.z, sad ? 0.15 : 0, 4, dt)
    light.current.color.set(answer !== undefined ? (phase === 'reveal' ? (answer === correct ? GREEN : RED) : YELLOW) : '#2a2140')
  })

  return (
    <group position={[PODIUM_X[id], 0, PODIUM_Z]}>
      <group ref={alien} position={[0, 1.55, -0.3]}>
        <AlienBody id={id} color={color} />
      </group>
      {/* podium */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.62, 0.78, 1.1, 6]} />
        <meshStandardMaterial color="#17112b" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.62, 0.62]} rotation={[-0.14, 0, 0]}>
        <planeGeometry args={[0.95, 0.56]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.12, 0]}>
        <cylinderGeometry args={[0.64, 0.64, 0.05, 6]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {/* lock-in light */}
      <mesh position={[0.42, 1.2, 0.3]}>
        <sphereGeometry args={[0.07, 12, 10]} />
        <meshBasicMaterial ref={light} color="#2a2140" toneMapped={false} />
      </mesh>
    </group>
  )
}

// ---------- stage
function Stage() {
  const strips = useRef([])
  const rings = useRef([])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const phase = useTrivia.getState().phase
    const fast = phase === 'reveal' || phase === 'end'
    strips.current.forEach((m, i) => {
      if (!m) return
      const v = 0.25 + 0.75 * Math.max(0, Math.sin(t * (fast ? 7 : 2) - i * 0.6))
      m.opacity = v
    })
    rings.current.forEach((m, i) => {
      if (!m) return
      m.opacity = 0.35 + 0.65 * Math.max(0, Math.sin(t * (fast ? 6 : 1.6) - i * 1.1))
    })
  })

  const stripColors = [PINK, CYAN, YELLOW, ORANGE]
  return (
    <group>
      {/* floor + back wall */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[14, 64]} />
        <meshStandardMaterial color="#0b0816" metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh position={[0, 4, -5.2]}>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial color="#0a0614" roughness={0.9} />
      </mesh>
      {/* concentric stage rings */}
      {[2.2, 3.4, 4.6].map((r, i) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -0.6]}>
          <ringGeometry args={[r, r + 0.06, 96]} />
          <meshBasicMaterial ref={(m) => (rings.current[i] = m)} color={[PINK, CYAN, '#7b61ff'][i]} transparent toneMapped={false} />
        </mesh>
      ))}
      {/* vertical light strips on the back wall */}
      {Array.from({ length: 14 }, (_, i) => {
        const x = -9.1 + i * 1.4
        if (Math.abs(x) < 3.6) return null
        return (
          <mesh key={i} position={[x, 3.6, -5.1]}>
            <planeGeometry args={[0.12, 6]} />
            <meshBasicMaterial ref={(m) => (strips.current[i] = m)} color={stripColors[i % 4]} transparent toneMapped={false} />
          </mesh>
        )
      })}
      <Spotlights />
    </group>
  )
}

// slow sweeping light cones over the stage
function Spotlights() {
  const cones = useRef([])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    cones.current.forEach((c, i) => {
      if (!c) return
      c.rotation.z = Math.sin(t * 0.5 + i * 2.1) * 0.35
      c.rotation.x = 0.15 + Math.cos(t * 0.4 + i) * 0.1
    })
  })
  return [-5, 5].map((x, i) => (
    <group key={x} ref={(g) => (cones.current[i] = g)} position={[x, 7.5, -2]}>
      <mesh position={[0, -3.5, 0]}>
        <coneGeometry args={[1.6, 7, 32, 1, true]} />
        <meshBasicMaterial
          color={i ? CYAN : PINK}
          transparent
          opacity={0.035}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  ))
}

// ---------- effects director: sounds, sparks and shake for game events
function ShowFx() {
  useEffect(() => {
    const at = (id) => [PODIUM_X[id] + 0.42, 1.2, PODIUM_Z + 0.3]
    return useTrivia.subscribe((s, prev) => {
      if (s.phase === 'question' && (prev.phase !== 'question' || s.index !== prev.index)) sfx.ask()
      // lock-ins
      for (const id of ALIEN_IDS) {
        if (s.answers[id] !== undefined && prev.answers[id] === undefined && s.phase === 'question') {
          sfx.lock()
          fx.emit('burst', { at: at(id), colors: [YELLOW, '#ffffff'], count: 10, speed: 2, gravity: 3 })
        }
      }
      if (s.phase === 'reveal' && prev.phase === 'question') {
        const q = s.list[s.index]
        const right = s.answers.you === q.correct
        const [sx, sy, sz] = SCREEN.pos
        if (right) {
          sfx.correct()
          fx.emit('burst', { at: [sx, sy, sz + 0.2], colors: [GREEN, YELLOW, '#ffffff', CYAN], count: 140, speed: 6.5, life: 1.8, gravity: 4, size: 0.11, spread: 1.2 })
          fx.emit('ring', { at: [sx, sy, sz + 0.1], color: GREEN, size: 4 })
          fx.shake.value = 0.45
          vibrate([20, 30, 40])
        } else {
          sfx.wrong()
          fx.emit('ring', { at: [sx, sy, sz + 0.1], color: RED, size: 4 })
          fx.shake.value = 0.6
          vibrate(90)
        }
        for (const id of ALIEN_IDS) {
          if (s.answers[id] === q.correct) fx.emit('burst', { at: at(id), colors: [colorOf[id], '#ffffff'], count: 26, speed: 3.5 })
        }
      }
      if (s.phase === 'end' && prev.phase !== 'end') {
        const top = ranking(s.scores)[0]
        if (top.id === 'you') {
          sfx.win()
          sfx.confetti()
          fx.emit('burst', { at: [0, 4.5, -3], colors: [PINK, CYAN, YELLOW, GREEN, ORANGE, '#ffffff'], count: 320, speed: 8, life: 2.6, gravity: 4, size: 0.14, spread: 1.3 })
          fx.shake.value = 1
          vibrate([30, 40, 70])
        } else {
          sfx.lose()
          fx.emit('burst', { at: [PODIUM_X[top.id], 2.4, PODIUM_Z], colors: [top.color, '#ffffff'], count: 120, speed: 5, life: 1.8 })
        }
      }
    })
  }, [])
  return (
    <>
      <Sparks />
      <Rings />
    </>
  )
}

export default function TriviaRoom() {
  useEffect(() => {
    useTrivia.getState().reset()
    return () => useTrivia.getState().stop()
  }, [])

  return (
    <group>
      <ShowCamera />
      <Stage />
      <Screen />
      <Host />
      {ALIEN_IDS.map((id) => (
        <Podium key={id} id={id} />
      ))}
      <ShowFx />
      <ambientLight intensity={0.35} color="#8f80ff" />
      <hemisphereLight args={['#7a6cff', '#140a20', 0.5]} />
      <spotLight position={[0, 7, 4]} angle={0.6} penumbra={0.7} intensity={40} distance={16} decay={1.4} color="#ffe9c4" />
      <pointLight position={[-4, 3, -1.5]} color={PINK} intensity={6} distance={9} />
      <pointLight position={[4, 3, -1.5]} color={CYAN} intensity={6} distance={9} />
    </group>
  )
}
