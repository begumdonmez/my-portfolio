import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { EXHIBITS, GROUPS, PEDESTALS, ROOM, SECTIONS, placement } from './exhibits'
import { useMuseum } from './store'
import { input } from '../arcade/store'
import { sfx } from '../arcade/sound'

// A quiet gallery in space: dark walls, warm spotlights, Begüm's 2D work on
// the walls and glass cases waiting for 3D models down the middle.

const FONT = '"Pixelify Sans", monospace'
const GOLD = '#ffd27a'
const EYE = 1.65
const SPEED = 2.8
const RUN = 5
const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
const BOUNDS = { x: ROOM.halfWidth - 0.9, zMin: ROOM.back + 1.3, zMax: ROOM.front - 0.7 }

// aspect ratio of each work, filled in as textures load (the walker needs it)
const aspects = {}

function textTexture(lines, { w = 1024, h = 256, align = 'center' } = {}) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  ctx.textAlign = align
  ctx.textBaseline = 'middle'
  const x = align === 'center' ? w / 2 : 24
  for (const l of lines) {
    ctx.font = `${l.weight ?? 600} ${l.size}px ${FONT}`
    ctx.fillStyle = l.color
    if (l.glow) {
      ctx.shadowColor = l.color
      ctx.shadowBlur = l.glow
    }
    ctx.fillText(l.text, x, l.y * h)
    ctx.shadowBlur = 0
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64, 54, 4, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,214,150,0.9)')
  g.addColorStop(0.5, 'rgba(255,190,120,0.25)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function floorTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#16131d'
  ctx.fillRect(0, 0, 512, 512)
  // subtle marble veins and tile seams
  ctx.strokeStyle = 'rgba(255,255,255,0.035)'
  ctx.lineWidth = 2
  for (let i = 0; i < 18; i++) {
    ctx.beginPath()
    let x = Math.random() * 512
    let y = Math.random() * 512
    ctx.moveTo(x, y)
    for (let k = 0; k < 6; k++) {
      x += (Math.random() - 0.5) * 120
      y += (Math.random() - 0.5) * 120
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fillRect(0, 0, 512, 3)
  ctx.fillRect(0, 0, 3, 512)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set((ROOM.halfWidth * 2) / 2, (ROOM.front - ROOM.back) / 2)
  tex.anisotropy = 8
  return tex
}

// ---------- one framed work with its spotlight and label
function Frame({ ex, texture, glow, hovered, onHover, onClick }) {
  const { pos, rotY } = placement(ex)
  const img = texture.image
  const aspect = img ? img.width / img.height : 1
  aspects[ex.id] = aspect
  const h = ex.h
  const w = h * aspect
  const art = ex.group === 'cult' || ex.group === 'atheria'
  const mat = art ? 0.12 : 0.04 // passe-partout around artwork
  const group = GROUPS[ex.group]
  const label = useMemo(
    () =>
      textTexture(
        [
          { text: group.title, size: 54, color: '#f4ecdf', y: 0.36 },
          { text: ex.sub, size: 40, color: GOLD, y: 0.72, weight: 400 },
        ],
        { w: 768, h: 192 }
      ),
    [group.title, ex.sub]
  )
  const active = useMuseum((s) => s.active === ex.id)
  const lit = hovered || active

  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {/* warm pool of light on the wall */}
      <mesh position={[0, 0.25, -0.03]}>
        <planeGeometry args={[w + 1.8, h + 2.2]} />
        <meshBasicMaterial map={glow} transparent opacity={lit ? 0.55 : 0.32} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* frame + mat + picture */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[w + mat * 2 + 0.12, h + mat * 2 + 0.12, 0.06]} />
        <meshStandardMaterial color={art ? '#0e0c12' : '#1e1a24'} roughness={0.4} metalness={0.3} />
      </mesh>
      {art && (
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[w + mat * 2, h + mat * 2]} />
          <meshStandardMaterial color="#efe9de" roughness={0.9} emissive="#efe9de" emissiveIntensity={0.28} />
        </mesh>
      )}
      <mesh
        position={[0, 0, 0.036]}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(ex.id)
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation()
          onClick(ex.id)
        }}
      >
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={texture} roughness={0.6} emissive="#ffffff" emissiveMap={texture} emissiveIntensity={lit ? 0.45 : 0.3} transparent={ex.img.endsWith('.png')} />
      </mesh>
      {/* thin gold edge that lights up on hover */}
      <mesh position={[0, -h / 2 - mat - 0.1, 0.04]}>
        <boxGeometry args={[w + mat * 2 + 0.12, 0.012, 0.012]} />
        <meshBasicMaterial color={lit ? '#ffffff' : GOLD} toneMapped={false} />
      </mesh>
      {/* label */}
      <mesh position={[(w + mat * 2) / 2 - 0.42, -h / 2 - mat - 0.32, 0.02]}>
        <planeGeometry args={[0.84, 0.21]} />
        <meshBasicMaterial map={label} transparent />
      </mesh>
      {/* spotlight cone from the ceiling */}
      <mesh position={[0, (ROOM.height - pos[1]) / 2 + 0.2, 0.9]} rotation={[0.42, 0, 0]} visible={!active}>
        <coneGeometry args={[Math.max(w, h) * 0.55, ROOM.height - pos[1] + 0.6, 24, 1, true]} />
        <meshBasicMaterial color="#ffd9a0" transparent opacity={lit ? 0.03 : 0.012} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.FrontSide} />
      </mesh>
    </group>
  )
}

function Gallery() {
  const textures = useTexture(EXHIBITS.map((e) => e.img))
  const glow = useMemo(glowTexture, [])
  const [hovered, setHovered] = useState(null)
  useMemo(
    () =>
      textures.forEach((t) => {
        t.colorSpace = THREE.SRGBColorSpace
        t.anisotropy = 8
      }),
    [textures]
  )

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : ''
    return () => (document.body.style.cursor = '')
  }, [hovered])

  const onHover = (id) => {
    if (id && id !== hovered) sfx.hover()
    setHovered(id)
  }
  const onClick = (id) => {
    if (input.dragDistance > 6) return
    const s = useMuseum.getState()
    if (s.mode === 'view') {
      if (s.active !== id) s.view(id)
      return
    }
    sfx.select()
    s.near === id ? s.view(id) : s.walkTo(id)
  }

  return EXHIBITS.map((ex, i) => (
    <Frame key={ex.id} ex={ex} texture={textures[i]} glow={glow} hovered={hovered === ex.id} onHover={onHover} onClick={onClick} />
  ))
}

function SectionSign({ title, wall, at }) {
  const tex = useMemo(() => textTexture([{ text: title, size: 92, color: GOLD, y: 0.5, glow: 18 }], { w: 1400, h: 180 }), [title])
  const placed = placement({ wall, at, y: 4.35 })
  const pos = wall === 'back' ? [placed.pos[0], 4.75, placed.pos[2]] : placed.pos
  return (
    <mesh position={pos} rotation={[0, placed.rotY, 0]}>
      <planeGeometry args={[4.2, 0.54]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  )
}

function Sections() {
  return SECTIONS.map((s) => <SectionSign key={s.title} {...s} />)
}

// ---------- glass cases waiting for 3D models
function Pedestal({ z, shape }) {
  const obj = useRef()
  const label = useMemo(
    () =>
      textTexture(
        [
          { text: '3D MODEL', size: 64, color: '#f4ecdf', y: 0.38 },
          { text: 'çok yakında', size: 44, color: GOLD, y: 0.74, weight: 400 },
        ],
        { w: 512, h: 192 }
      ),
    []
  )
  useFrame(({ clock }, dt) => {
    obj.current.rotation.y += dt * 0.5
    obj.current.rotation.x = Math.sin(clock.elapsedTime * 0.4) * 0.3
    obj.current.position.y = 1.75 + Math.sin(clock.elapsedTime * 0.9 + z) * 0.05
  })
  return (
    <group position={[0, 0, z]}>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.9, 1.1, 0.9]} />
        <meshStandardMaterial color="#e9e3d8" roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.12, 0]}>
        <boxGeometry args={[1, 0.04, 1]} />
        <meshBasicMaterial color={GOLD} toneMapped={false} />
      </mesh>
      <mesh ref={obj} position={[0, 1.75, 0]}>
        {shape === 'knot' && <torusKnotGeometry args={[0.2, 0.06, 96, 12]} />}
        {shape === 'ico' && <icosahedronGeometry args={[0.28, 0]} />}
        {shape === 'torus' && <torusGeometry args={[0.24, 0.08, 16, 48]} />}
        <meshBasicMaterial color={GOLD} wireframe toneMapped={false} />
      </mesh>
      {/* glass */}
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[0.8, 0.9, 0.8]} />
        <meshStandardMaterial color="#bfe8ff" transparent opacity={0.1} roughness={0.05} metalness={0.2} depthWrite={false} />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={s} position={[0, 0.72, s * 0.452]} rotation={[0, s > 0 ? 0 : Math.PI, 0]}>
          <planeGeometry args={[0.7, 0.26]} />
          <meshBasicMaterial map={label} transparent />
        </mesh>
      ))}
    </group>
  )
}

// ---------- the room
function Hall() {
  const floor = useMemo(floorTexture, [])
  const welcome = useMemo(
    () =>
      textTexture(
        [
          { text: 'BEGÜM MÜZESİ', size: 110, color: GOLD, y: 0.42, glow: 24 },
          { text: 'bir esere tıkla, yanına yürü', size: 44, color: '#f4ecdf', y: 0.8, weight: 400 },
        ],
        { w: 1400, h: 300 }
      ),
    []
  )
  const W = ROOM.halfWidth * 2
  const D = ROOM.front - ROOM.back
  const midZ = (ROOM.front + ROOM.back) / 2
  const H = ROOM.height
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, midZ]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial map={floor} roughness={0.35} metalness={0.25} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, midZ]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#0b0910" />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} rotation={[0, (-s * Math.PI) / 2, 0]} position={[s * ROOM.halfWidth, H / 2, midZ]}>
          <planeGeometry args={[D, H]} />
          <meshStandardMaterial color="#1c1726" roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, H / 2, ROOM.back]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#1c1726" roughness={0.95} />
      </mesh>
      <mesh position={[0, H / 2, ROOM.front]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#1c1726" roughness={0.95} />
      </mesh>
      {/* skylight strips and a skirting line */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 2.4, H - 0.02, midZ]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.18, D - 2]} />
            <meshBasicMaterial color="#fff1d6" toneMapped={false} />
          </mesh>
          <mesh position={[s * (ROOM.halfWidth - 0.02), 0.12, midZ]}>
            <boxGeometry args={[0.02, 0.02, D]} />
            <meshBasicMaterial color={GOLD} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* welcome sign hanging over the entrance */}
      <mesh position={[0, 4.4, 1.2]}>
        <planeGeometry args={[4.6, 1]} />
        <meshBasicMaterial map={welcome} transparent toneMapped={false} />
      </mesh>
      <ambientLight intensity={0.5} color="#c8b8ff" />
      <hemisphereLight args={['#fff1d6', '#1c1726', 0.35]} />
      {(isMobile ? [-6, -20] : [-3, -11, -19, -27]).map((z) => (
        <pointLight key={z} position={[0, H - 0.6, z]} color="#ffe2b8" intensity={isMobile ? 10 : 6} distance={12} decay={1.4} />
      ))}
    </group>
  )
}

// ---------- walking around and stepping up to works
function poseFor(id, camera) {
  const ex = EXHIBITS.find((e) => e.id === id)
  const { pos, rotY, normal } = placement(ex)
  const n = new THREE.Vector3(...normal)
  const center = new THREE.Vector3(...pos)
  const stand = center.clone().addScaledVector(n, 2.4)
  stand.y = EYE
  // view: back off until the whole work fits, leaving room for the info card
  const aspect = aspects[id] ?? 1
  const h = (ex.h + 0.4) * 1.35
  const w = (ex.h * aspect + 0.4) * 1.2
  const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
  const portrait = camera.aspect < 0.9
  const fitH = (portrait ? h * 1.9 : h) / (2 * tan)
  const fitW = w / (2 * tan * camera.aspect * (portrait ? 1 : 0.62))
  const d = Math.max(fitH, fitW, 1.2)
  const view = center.clone().addScaledVector(n, d)
  // slide sideways (desktop) or down (phone) so the card doesn't cover the work
  const right = new THREE.Vector3(0, 1, 0).cross(n).normalize() // screen-right when facing the work
  if (portrait) view.y -= d * tan * 0.42
  else view.addScaledVector(right, d * tan * camera.aspect * 0.32)
  const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotY, 0, 'YXZ'))
  return { stand, yaw: rotY, view, quat }
}

function Walker() {
  const camera = useThree((s) => s.camera)
  const pos = useRef(new THREE.Vector3(0, EYE, ROOM.front - 1.5))
  const yaw = useRef(0)
  const pitch = useRef(0)
  const settle = useRef(0)
  const last = useRef('walk')
  const tmp = useMemo(() => ({ q: new THREE.Quaternion(), e: new THREE.Euler(0, 0, 0, 'YXZ'), v: new THREE.Vector3(), walk: new THREE.Vector3() }), [])

  useEffect(() => {
    camera.position.copy(pos.current)
    camera.rotation.set(0, 0, 0, 'YXZ')
  }, [camera])

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const s = useMuseum.getState()
    if (last.current !== s.mode) {
      if (s.mode === 'walk' && last.current === 'view') settle.current = 1
      last.current = s.mode
    }

    if (s.mode === 'view' && s.active) {
      const pose = poseFor(s.active, camera)
      camera.position.lerp(pose.view, 1 - Math.exp(-dt * 4))
      camera.quaternion.slerp(pose.quat, 1 - Math.exp(-dt * 4))
      // when you leave, you're standing in front of this work
      pos.current.copy(pose.stand)
      yaw.current = pose.yaw
      pitch.current = 0
      input.look.dx = input.look.dy = 0
      return
    }

    yaw.current -= input.look.dx * 0.0032
    pitch.current = THREE.MathUtils.clamp(pitch.current - input.look.dy * 0.0028, -0.6, 0.6)
    input.look.dx = input.look.dy = 0

    const k = input.keys
    let fwd = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) + input.move.y
    let side = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0) + input.move.x
    const manual = Math.abs(fwd) + Math.abs(side) > 0.05
    const speed = k.has('ShiftLeft') || k.has('ShiftRight') ? RUN : SPEED
    const p = pos.current
    if (s.mode === 'approach' && manual) s.leave()

    if (s.mode === 'approach' && s.target) {
      const pose = poseFor(s.target, camera)
      tmp.v.set(pose.stand.x - p.x, 0, pose.stand.z - p.z)
      const dist = tmp.v.length()
      const yawDiff = Math.atan2(Math.sin(pose.yaw - yaw.current), Math.cos(pose.yaw - yaw.current))
      yaw.current += yawDiff * (1 - Math.exp(-dt * 4))
      pitch.current *= Math.exp(-dt * 4)
      if (dist > 0.05) p.addScaledVector(tmp.v.normalize(), Math.min(dist, SPEED * 1.3 * dt))
      if (dist < 0.1 && Math.abs(yawDiff) < 0.06) s.view(s.target)
    } else if (manual) {
      const len = Math.hypot(fwd, side)
      if (len > 1) {
        fwd /= len
        side /= len
      }
      const sy = Math.sin(yaw.current)
      const cy = Math.cos(yaw.current)
      p.x += (-sy * fwd + cy * side) * speed * dt
      p.z += (-cy * fwd - sy * side) * speed * dt
    }

    p.x = THREE.MathUtils.clamp(p.x, -BOUNDS.x, BOUNDS.x)
    p.z = THREE.MathUtils.clamp(p.z, BOUNDS.zMin, BOUNDS.zMax)
    // walk around the glass cases instead of through them
    for (const ped of PEDESTALS) {
      const dx = p.x
      const dz = p.z - ped.z
      const d = Math.hypot(dx, dz)
      if (d < 0.95) {
        const push = (0.95 - d) / (d || 1)
        p.x += (d ? dx : 1) * push
        p.z += (d ? dz : 0) * push
      }
    }

    const moving = manual || s.mode === 'approach'
    const bob = moving ? Math.sin(clock.elapsedTime * 8) * 0.018 : 0
    tmp.walk.set(p.x, EYE + bob, p.z)
    tmp.e.set(pitch.current, yaw.current, 0, 'YXZ')
    tmp.q.setFromEuler(tmp.e)
    if (settle.current > 0) {
      settle.current = Math.max(0, settle.current - dt * 1.3)
      camera.position.lerp(tmp.walk, 1 - Math.exp(-dt * 5))
      camera.quaternion.slerp(tmp.q, 1 - Math.exp(-dt * 5))
    } else {
      camera.position.copy(tmp.walk)
      camera.quaternion.copy(tmp.q)
    }

    // which work is close and in front of us
    let best = null
    let bestD = 3.6
    const fx = -Math.sin(yaw.current)
    const fz = -Math.cos(yaw.current)
    for (const ex of EXHIBITS) {
      const { pos: c } = placement(ex)
      const dx = c[0] - p.x
      const dz = c[2] - p.z
      const d = Math.hypot(dx, dz)
      const facing = (dx * fx + dz * fz) / (d || 1)
      if (d < bestD && facing > 0.55) {
        best = ex.id
        bestD = d
      }
    }
    s.setNear(best)
  })
  return null
}

export default function MuseumScene() {
  return (
    <group>
      <Hall />
      <Gallery />
      <Sections />
      {PEDESTALS.map((p) => (
        <Pedestal key={p.id} {...p} />
      ))}
      <Walker />
    </group>
  )
}
