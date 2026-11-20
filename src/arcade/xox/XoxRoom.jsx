import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useXox } from './store'
import { neonSignTexture } from '../textures'
import { sfx } from '../sound'

// The XOX room: you sit at a neon table across from ROBO.

const PINK = '#f706cf'
const CYAN = '#2de2e6'
const YELLOW = '#ffe66d'
const TABLE_Y = 0.86
const CELL = 0.5
const BOARD_Z = 0.15
const ROBO_Z = -1.15

const cellPos = (i) => [((i % 3) - 1) * CELL, TABLE_Y + 0.012, BOARD_Z + (Math.floor(i / 3) - 1) * CELL]

// ---------- camera: seated view with a little parallax from the pointer
function SeatCamera() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const look = useMemo(() => new THREE.Vector3(0, 1.32, -0.6), [])
  const want = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    camera.position.set(0, 2.55, 2.9)
    camera.lookAt(look)
  }, [camera, look])

  useFrame(({ pointer }, dt) => {
    // portrait screens sit further back so the whole board fits
    const portrait = size.width / size.height < 0.9
    want.set(pointer.x * 0.25, (portrait ? 3.15 : 2.55) + pointer.y * 0.12, portrait ? 3.2 : 2.9)
    camera.position.lerp(want, 1 - Math.exp(-dt * 3))
    camera.lookAt(look)
  })
  return null
}

// ---------- ROBO
function faceTexture(mood) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 160
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#05040c'
  ctx.fillRect(0, 0, 256, 160)
  const color = { idle: CYAN, blink: CYAN, think: YELLOW, happy: '#7dff8a', sad: '#7aa7ff', wow: PINK }[mood]
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 18
  ctx.lineWidth = 12
  ctx.lineCap = 'round'
  const px = (x, y, w, h) => ctx.fillRect(x, y, w, h)
  if (mood === 'idle') {
    px(58, 52, 34, 40)
    px(164, 52, 34, 40)
  } else if (mood === 'blink') {
    px(56, 74, 38, 8)
    px(162, 74, 38, 8)
  } else if (mood === 'think') {
    // eyes glancing up to the side + a dot
    px(76, 44, 26, 30)
    px(182, 44, 26, 30)
    px(118, 112, 12, 12)
  } else if (mood === 'happy') {
    for (const x of [75, 181]) {
      ctx.beginPath()
      ctx.arc(x, 88, 24, Math.PI * 1.1, Math.PI * 1.9)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.arc(128, 104, 26, Math.PI * 0.15, Math.PI * 0.85)
    ctx.stroke()
  } else if (mood === 'sad') {
    px(58, 66, 34, 24)
    px(164, 66, 34, 24)
    ctx.beginPath()
    ctx.moveTo(50, 50)
    ctx.lineTo(96, 60)
    ctx.moveTo(206, 50)
    ctx.lineTo(160, 60)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(128, 140, 22, Math.PI * 1.2, Math.PI * 1.8)
    ctx.stroke()
  } else if (mood === 'wow') {
    for (const x of [75, 181]) {
      ctx.beginPath()
      ctx.arc(x, 70, 20, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.arc(128, 124, 12, 0, Math.PI * 2)
    ctx.stroke()
  }
  // scanlines
  ctx.shadowBlur = 0
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  for (let y = 0; y < 160; y += 4) ctx.fillRect(0, y, 256, 2)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const MOODS = ['idle', 'blink', 'think', 'happy', 'sad', 'wow']

function Robo() {
  const mood = useXox((s) => s.mood)
  const last = useXox((s) => s.last)
  const faces = useMemo(() => Object.fromEntries(MOODS.map((m) => [m, faceTexture(m)])), [])
  const root = useRef()
  const head = useRef()
  const faceMat = useRef()
  const bulb = useRef()
  const arm = useRef()
  const nod = useRef(0)

  // nod after each move
  useEffect(() => {
    if (last !== null) nod.current = 1
  }, [last])

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    if (!root.current) return
    const happy = mood === 'happy'
    const sad = mood === 'sad'
    root.current.position.y = happy ? Math.abs(Math.sin(t * 9)) * 0.08 : Math.sin(t * 1.6) * 0.015
    nod.current = Math.max(0, nod.current - dt * 3)
    const tiltZ = mood === 'think' ? Math.sin(t * 2.2) * 0.14 : happy ? Math.sin(t * 6) * 0.12 : 0
    const tiltX = sad ? 0.32 : mood === 'wow' ? -0.12 : Math.sin(nod.current * Math.PI) * 0.25
    head.current.rotation.z = THREE.MathUtils.damp(head.current.rotation.z, tiltZ, 6, dt)
    head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, tiltX, 6, dt)
    head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, mood === 'think' ? 0.25 : 0, 4, dt)
    // waving arm when it wins, tapping the table while thinking
    const armZ = happy ? 2.4 + Math.sin(t * 10) * 0.35 : mood === 'think' ? 0.25 + Math.abs(Math.sin(t * 7)) * 0.15 : 0.15
    arm.current.rotation.z = THREE.MathUtils.damp(arm.current.rotation.z, armZ, 8, dt)

    const blink = mood === 'idle' && t % 3.7 < 0.12
    const face = faces[blink ? 'blink' : mood]
    if (faceMat.current.map !== face) faceMat.current.map = face
    bulb.current.color.set(mood === 'think' ? (Math.sin(t * 12) > 0 ? YELLOW : '#4a3a00') : happy ? '#7dff8a' : sad ? '#7aa7ff' : PINK)
  })

  const metal = <meshStandardMaterial color="#2a2444" metalness={0.65} roughness={0.32} />
  return (
    <group position={[0, 0, ROBO_Z]}>
      <group ref={root}>
        {/* torso */}
        <RoundedBox args={[0.95, 0.85, 0.55]} radius={0.12} position={[0, 1.27, 0]}>
          {metal}
        </RoundedBox>
        <mesh position={[0, 1.35, 0.28]}>
          <boxGeometry args={[0.5, 0.05, 0.02]} />
          <meshBasicMaterial color={PINK} toneMapped={false} />
        </mesh>
        {[-0.15, 0, 0.15].map((x, i) => (
          <mesh key={x} position={[x, 1.2, 0.28]}>
            <circleGeometry args={[0.035, 16]} />
            <meshBasicMaterial color={[CYAN, YELLOW, PINK][i]} toneMapped={false} />
          </mesh>
        ))}
        {/* neck + head */}
        <mesh position={[0, 1.76, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.16, 16]} />
          {metal}
        </mesh>
        <group ref={head} position={[0, 1.84, 0]}>
          <RoundedBox args={[0.78, 0.54, 0.5]} radius={0.12} position={[0, 0.27, 0]}>
            {metal}
          </RoundedBox>
          <mesh position={[0, 0.27, 0.252]}>
            <planeGeometry args={[0.62, 0.38]} />
            <meshBasicMaterial ref={faceMat} map={faces.idle} toneMapped={false} />
          </mesh>
          {/* ears */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.41, 0.27, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
              <meshBasicMaterial color={CYAN} toneMapped={false} />
            </mesh>
          ))}
          {/* antenna */}
          <mesh position={[0, 0.64, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.22, 8]} />
            {metal}
          </mesh>
          <mesh position={[0, 0.77, 0]}>
            <sphereGeometry args={[0.05, 16, 12]} />
            <meshBasicMaterial ref={bulb} color={PINK} toneMapped={false} />
          </mesh>
        </group>
        {/* arms resting on the table; the right one waves */}
        <group position={[-0.56, 1.55, 0]} rotation={[0, 0, -0.15]}>
          <mesh position={[0, -0.32, 0.12]} rotation={[-0.6, 0, 0]}>
            <capsuleGeometry args={[0.07, 0.5, 4, 12]} />
            {metal}
          </mesh>
          <mesh position={[0, -0.6, 0.32]}>
            <sphereGeometry args={[0.09, 16, 12]} />
            <meshBasicMaterial color={PINK} toneMapped={false} />
          </mesh>
        </group>
        <group ref={arm} position={[0.56, 1.55, 0]}>
          <mesh position={[0, -0.32, 0.12]} rotation={[-0.6, 0, 0]}>
            <capsuleGeometry args={[0.07, 0.5, 4, 12]} />
            {metal}
          </mesh>
          <mesh position={[0, -0.6, 0.32]}>
            <sphereGeometry args={[0.09, 16, 12]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

// ---------- marks
function Pop({ children, position }) {
  const g = useRef()
  const born = useRef(null)
  useFrame(({ clock }) => {
    if (born.current === null) born.current = clock.elapsedTime
    const k = Math.min(1, (clock.elapsedTime - born.current) / 0.35)
    // overshoot ease
    const s = 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2)
    g.current.scale.setScalar(Math.max(0.001, s))
  })
  return (
    <group ref={g} position={position} scale={0.001}>
      {children}
    </group>
  )
}

function XMark({ glow }) {
  return (
    <group>
      {[Math.PI / 4, -Math.PI / 4].map((r) => (
        <mesh key={r} rotation={[0, r, 0]} position={[0, 0.03, 0]}>
          <boxGeometry args={[0.4, 0.05, 0.07]} />
          <meshBasicMaterial color={glow ? '#ffffff' : PINK} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function OMark({ glow }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
      <torusGeometry args={[0.15, 0.035, 12, 40]} />
      <meshBasicMaterial color={glow ? '#ffffff' : CYAN} toneMapped={false} />
    </mesh>
  )
}

function WinLine({ line }) {
  const mat = useRef()
  const mesh = useRef()
  const [a, , c] = line
  const pa = new THREE.Vector3(...cellPos(a))
  const pc = new THREE.Vector3(...cellPos(c))
  const mid = pa.clone().add(pc).multiplyScalar(0.5)
  const len = pa.distanceTo(pc) + 0.45
  const angle = Math.atan2(-(pc.z - pa.z), pc.x - pa.x)
  useFrame(({ clock }) => {
    mat.current.opacity = 0.7 + Math.sin(clock.elapsedTime * 10) * 0.3
    mesh.current.scale.x = Math.min(1, mesh.current.scale.x + 0.08)
  })
  return (
    <mesh ref={mesh} position={[mid.x, TABLE_Y + 0.08, mid.z]} rotation={[0, angle, 0]} scale={[0.01, 1, 1]}>
      <boxGeometry args={[len, 0.03, 0.06]} />
      <meshBasicMaterial ref={mat} color={YELLOW} transparent toneMapped={false} />
    </mesh>
  )
}

// ---------- table + board
function Board() {
  const board = useXox((s) => s.board)
  const turn = useXox((s) => s.turn)
  const outcome = useXox((s) => s.outcome)
  const [hover, setHover] = useState(null)
  const canPlay = turn === 'X' && !outcome

  useEffect(() => {
    document.body.style.cursor = hover !== null && canPlay && !board[hover] ? 'pointer' : ''
    return () => (document.body.style.cursor = '')
  }, [hover, canPlay, board])

  const winning = outcome?.line ?? []
  const half = CELL * 1.5

  return (
    <group>
      {/* table */}
      <RoundedBox args={[2.5, 0.08, 2.0]} radius={0.03} position={[0, TABLE_Y - 0.04, 0.05]}>
        <meshStandardMaterial color="#120e22" metalness={0.4} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, TABLE_Y - 0.05, 1.06]}>
        <boxGeometry args={[2.5, 0.025, 0.025]} />
        <meshBasicMaterial color={PINK} toneMapped={false} />
      </mesh>
      <mesh position={[0, TABLE_Y / 2 - 0.04, 0.05]}>
        <cylinderGeometry args={[0.18, 0.4, TABLE_Y - 0.08, 24]} />
        <meshStandardMaterial color="#1a1530" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* grid lines */}
      {[-0.5, 0.5].map((k) => (
        <group key={k}>
          <mesh position={[k * CELL, TABLE_Y + 0.006, BOARD_Z]}>
            <boxGeometry args={[0.03, 0.012, half * 2]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
          <mesh position={[0, TABLE_Y + 0.006, BOARD_Z + k * CELL]}>
            <boxGeometry args={[half * 2, 0.012, 0.03]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* cells: hit areas, hover glow, marks */}
      {board.map((v, i) => (
        <group key={i} position={cellPos(i)}>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHover(i)
              if (canPlay && !v) sfx.hover()
            }}
            onPointerOut={() => setHover((h) => (h === i ? null : h))}
            onClick={(e) => {
              e.stopPropagation()
              useXox.getState().play(i)
            }}
          >
            <planeGeometry args={[CELL * 0.92, CELL * 0.92]} />
            <meshBasicMaterial
              color={PINK}
              transparent
              opacity={hover === i && canPlay && !v ? 0.22 : 0}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          {v === 'X' && (
            <Pop>
              <XMark glow={winning.includes(i)} />
            </Pop>
          )}
          {v === 'O' && (
            <Pop>
              <OMark glow={winning.includes(i)} />
            </Pop>
          )}
        </group>
      ))}
      {outcome?.line && <WinLine key={outcome.line.join()} line={outcome.line} />}
    </group>
  )
}

// ---------- the room around it
function Shell() {
  const sign = useMemo(
    () =>
      neonSignTexture([
        { text: 'X O X', color: PINK, size: 230, y: 0.42 },
        { text: 'ODASI', color: CYAN, size: 110, y: 0.82 },
      ]),
    []
  )
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(12, 24, '#3a2a7a', '#241a4d')
    g.position.y = 0.005
    return g
  }, [])
  const signMat = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    signMat.current.opacity = t % 8 > 7.8 && Math.sin(t * 60) > 0 ? 0.3 : 1
  })

  return (
    <group>
      <mesh position={[0, 2.1, -1]}>
        <boxGeometry args={[9, 4.2, 9]} />
        <meshStandardMaterial color="#100b20" roughness={0.95} side={THREE.BackSide} />
      </mesh>
      <primitive object={grid} />
      <mesh position={[0, 3.05, -5.45]}>
        <planeGeometry args={[4.4, 1.38]} />
        <meshBasicMaterial ref={signMat} map={sign} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      {/* neon tubes in the corners */}
      {[
        [-4.45, -5.45],
        [4.45, -5.45],
      ].map(([x, z]) => (
        <mesh key={x} position={[x, 2.1, z]}>
          <boxGeometry args={[0.05, 4.2, 0.05]} />
          <meshBasicMaterial color={x < 0 ? PINK : CYAN} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 4.15, -5.45]}>
        <boxGeometry args={[9, 0.05, 0.05]} />
        <meshBasicMaterial color="#7b61ff" toneMapped={false} />
      </mesh>
      <ambientLight intensity={0.3} color="#8f80ff" />
      <hemisphereLight args={['#6a5cff', '#120a1e', 0.4]} />
      <spotLight position={[0, 3.2, 0]} angle={0.7} penumbra={0.6} intensity={18} distance={8} decay={1.5} color="#ffe9c4" />
      <pointLight position={[-3, 2, -3]} color={PINK} intensity={5} distance={8} />
      <pointLight position={[3, 2, -3]} color={CYAN} intensity={5} distance={8} />
      <pointLight position={[0, 2.3, ROBO_Z + 1.2]} color="#b9a6ff" intensity={6} distance={4} />
    </group>
  )
}

export default function XoxRoom() {
  useEffect(() => {
    useXox.getState().start()
    return () => useXox.getState().stop()
  }, [])

  return (
    <group>
      <SeatCamera />
      <Shell />
      <Robo />
      <Board />
    </group>
  )
}
