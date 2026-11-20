import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useXox } from './store'
import { BOARD, CYAN, PINK, ROBO_POS, ROOM, YELLOW, cellPos, roboHand } from './layout'
import RoomGrid from './RoomGrid'
import Robo from './Robo'
import { neonSignTexture } from '../textures'
import { sfx } from '../sound'

// The XOX room: a neon grid room with the board on the back wall and ROBO
// hovering beside it. The room itself reacts to every move (see RoomGrid).

const LOOK = new THREE.Vector3(0.5, 2.75, ROOM.back)
const LOOK_PORTRAIT = new THREE.Vector3(0, 2.3, ROOM.back)
// On tall screens ROBO hovers small, below the board and closer to you.
const ROBO_PORTRAIT = { position: [0.55, 0.05, -0.6], scale: 0.42 }

const usePortrait = () => useThree((s) => s.size.width / s.size.height < 0.9)

// ---------- camera: standing in the room, a little parallax from the pointer
function ViewCamera() {
  const camera = useThree((s) => s.camera)
  const portrait = usePortrait()
  const want = useMemo(() => new THREE.Vector3(), [])
  const look = portrait ? LOOK_PORTRAIT : LOOK

  useFrame(({ pointer }, dt) => {
    if (portrait) want.set(pointer.x * 0.2, 2.25 + pointer.y * 0.1, 2.7)
    else want.set(0.5 + pointer.x * 0.35, 2.6 + pointer.y * 0.2, 2.6)
    camera.position.lerp(want, 1 - Math.exp(-dt * 3))
    camera.lookAt(look)
  })

  useEffect(() => {
    camera.position.set(portrait ? 0 : 0.5, 2.6, 4)
    camera.lookAt(look)
  }, [camera, portrait, look])
  return null
}

// ---------- marks
const easeOut = (k) => 1 - Math.pow(1 - k, 3)
const THROW_FROM = new THREE.Vector3(0.5, 1.4, 1.5) // just below the camera

// X flies in from the visitor and spins onto the wall; O is drawn by ROBO's beam.
function Mark({ index, mark, glow }) {
  const g = useRef()
  const born = useRef(null)
  const cell = useMemo(() => new THREE.Vector3(...cellPos(index)), [index])
  const from = useMemo(() => THROW_FROM.clone().sub(cell), [cell])

  useFrame(({ clock }) => {
    if (born.current === null) born.current = clock.elapsedTime
    const age = clock.elapsedTime - born.current
    if (mark === 'X') {
      const k = Math.min(1, age / 0.38)
      const e = easeOut(k)
      g.current.position.copy(from).multiplyScalar(1 - e)
      g.current.rotation.z = (1 - e) * Math.PI * 3
      // tiny squash when it hits the wall
      const hit = k >= 1 ? Math.max(0, 1 - (age - 0.38) / 0.15) : 0
      g.current.scale.set(1 + hit * 0.25, 1 + hit * 0.25, 1)
    } else {
      const k = Math.min(1, Math.max(0, age - 0.1) / 0.35)
      const s = k < 1 ? 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2) : 1
      g.current.scale.setScalar(Math.max(0.001, s))
    }
    if (glow) {
      const p = 1 + Math.sin(clock.elapsedTime * 10) * 0.06
      g.current.scale.set(p, p, 1)
    }
  })

  const color = glow ? '#ffffff' : mark === 'X' ? PINK : CYAN
  return (
    <group position={cellPos(index)}>
      <group ref={g} position={[0, 0, 0.08]} scale={mark === 'O' ? 0.001 : 1}>
        {mark === 'X' ? (
          [Math.PI / 4, -Math.PI / 4].map((r) => (
            <mesh key={r} rotation={[0, 0, r]}>
              <boxGeometry args={[0.98, 0.13, 0.08]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
          ))
        ) : (
          <mesh>
            <torusGeometry args={[0.37, 0.075, 14, 48]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        )}
      </group>
    </group>
  )
}

// ROBO's beam: a short-lived ray from its hand to the cell it plays.
function Beam() {
  const last = useXox((s) => s.last)
  const board = useXox((s) => s.board)
  const mesh = useRef()
  const mat = useRef()
  const start = useRef(-10)
  const target = useMemo(() => new THREE.Vector3(), [])
  const tmp = useMemo(() => ({ mid: new THREE.Vector3(), dir: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0) }), [])
  const clock = useThree((s) => s.clock)

  useEffect(() => {
    if (last !== null && board[last] === 'O') {
      target.set(...cellPos(last)).z += 0.08
      start.current = clock.elapsedTime
    }
  }, [last, board, target, clock])

  useFrame(({ clock }) => {
    const age = clock.elapsedTime - start.current
    const on = age < 0.55
    mesh.current.visible = on
    if (!on) return
    tmp.dir.copy(target).sub(roboHand)
    const len = tmp.dir.length()
    tmp.mid.copy(roboHand).addScaledVector(tmp.dir, 0.5)
    mesh.current.position.copy(tmp.mid)
    mesh.current.quaternion.setFromUnitVectors(tmp.up, tmp.dir.normalize())
    mesh.current.scale.set(1, len, 1)
    mat.current.opacity = Math.min(1, age * 8) * (1 - age / 0.55)
  })

  return (
    <mesh ref={mesh} visible={false}>
      <cylinderGeometry args={[0.03, 0.03, 1, 8, 1, true]} />
      <meshBasicMaterial ref={mat} color={CYAN} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

// ---------- the board on the wall
function Board() {
  const board = useXox((s) => s.board)
  const turn = useXox((s) => s.turn)
  const outcome = useXox((s) => s.outcome)
  const [hover, setHover] = useState(null)
  const canPlay = turn === 'X' && !outcome
  const half = BOARD.cell * 1.5

  useEffect(() => {
    document.body.style.cursor = hover !== null && canPlay && !board[hover] ? 'pointer' : ''
    return () => (document.body.style.cursor = '')
  }, [hover, canPlay, board])

  const winning = outcome?.line ?? []

  return (
    <group>
      {/* dark panel behind the board so marks read clearly */}
      <mesh position={[BOARD.x, BOARD.y, BOARD.z - 0.01]}>
        <planeGeometry args={[half * 2 + 0.3, half * 2 + 0.3]} />
        <meshBasicMaterial color="#06040e" transparent opacity={0.75} />
      </mesh>
      {/* grid lines */}
      {[-0.5, 0.5].map((k) => (
        <group key={k}>
          <mesh position={[BOARD.x + k * BOARD.cell, BOARD.y, BOARD.z + 0.02]}>
            <boxGeometry args={[0.06, half * 2, 0.04]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
          <mesh position={[BOARD.x, BOARD.y + k * BOARD.cell, BOARD.z + 0.02]}>
            <boxGeometry args={[half * 2, 0.06, 0.04]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* frame */}
      {[
        [0, half + 0.15, half * 2 + 0.36, 0.035],
        [0, -half - 0.15, half * 2 + 0.36, 0.035],
        [-half - 0.15, 0, 0.035, half * 2 + 0.3],
        [half + 0.15, 0, 0.035, half * 2 + 0.3],
      ].map(([x, y, w, h]) => (
        <mesh key={`${x},${y}`} position={[BOARD.x + x, BOARD.y + y, BOARD.z + 0.02]}>
          <boxGeometry args={[w, h, 0.03]} />
          <meshBasicMaterial color={PINK} toneMapped={false} />
        </mesh>
      ))}
      {board.map((v, i) => (
        <group key={i}>
          <mesh
            position={[cellPos(i)[0], cellPos(i)[1], BOARD.z + 0.03]}
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
            <planeGeometry args={[BOARD.cell * 0.9, BOARD.cell * 0.9]} />
            <meshBasicMaterial
              color={PINK}
              transparent
              opacity={hover === i && canPlay && !v ? 0.2 : 0}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          {v && <Mark index={i} mark={v} glow={winning.includes(i)} />}
        </group>
      ))}
      {outcome?.line && <WinLine key={outcome.line.join()} line={outcome.line} />}
    </group>
  )
}

function WinLine({ line }) {
  const mat = useRef()
  const mesh = useRef()
  const a = new THREE.Vector3(...cellPos(line[0]))
  const c = new THREE.Vector3(...cellPos(line[2]))
  const mid = a.clone().add(c).multiplyScalar(0.5)
  const len = a.distanceTo(c) + BOARD.cell * 0.8
  const angle = Math.atan2(c.y - a.y, c.x - a.x)
  useFrame(({ clock }) => {
    mat.current.opacity = 0.75 + Math.sin(clock.elapsedTime * 10) * 0.25
    mesh.current.scale.x = Math.min(1, mesh.current.scale.x + 0.07)
  })
  return (
    <mesh ref={mesh} position={[mid.x, mid.y, BOARD.z + 0.16]} rotation={[0, 0, angle]} scale={[0.01, 1, 1]}>
      <boxGeometry args={[len, 0.09, 0.05]} />
      <meshBasicMaterial ref={mat} color={YELLOW} transparent toneMapped={false} />
    </mesh>
  )
}

function Sign() {
  const tex = useMemo(
    () =>
      neonSignTexture([
        { text: 'X O X', color: PINK, size: 230, y: 0.42 },
        { text: 'ODASI', color: CYAN, size: 110, y: 0.82 },
      ]),
    []
  )
  const mat = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    mat.current.opacity = t % 8 > 7.8 && Math.sin(t * 60) > 0 ? 0.3 : 1
  })
  return (
    <mesh position={[BOARD.x, BOARD.y + BOARD.cell * 1.5 + 0.75, ROOM.back + 0.03]}>
      <planeGeometry args={[2.6, 0.82]} />
      <meshBasicMaterial ref={mat} map={tex} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  )
}

export default function XoxRoom() {
  const portrait = usePortrait()
  useEffect(() => {
    useXox.getState().start()
    return () => useXox.getState().stop()
  }, [])

  return (
    <group>
      <ViewCamera />
      <RoomGrid />
      <Sign />
      <Board />
      {portrait ? <Robo {...ROBO_PORTRAIT} /> : <Robo position={ROBO_POS} />}
      <Beam />
      <ambientLight intensity={0.35} color="#8f80ff" />
      <hemisphereLight args={['#6a5cff', '#120a1e', 0.5]} />
      <pointLight position={[ROBO_POS[0] - 0.5, 3, ROBO_POS[2] + 2]} color="#c9b8ff" intensity={8} distance={6} />
      <pointLight position={[-3, 3, -2]} color={PINK} intensity={4} distance={8} />
    </group>
  )
}
