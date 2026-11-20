import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useXox } from './store'
import { CYAN, PINK, YELLOW, roboHand } from './layout'

// ROBO: a hovering robot next to the wall board. Its face is a little
// screen whose expression follows the game; it points a beam at the board
// when it plays.

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

export default function Robo({ position, scale = 1 }) {
  const mood = useXox((s) => s.mood)
  const last = useXox((s) => s.last)
  const board = useXox((s) => s.board)
  const faces = useMemo(() => Object.fromEntries(MOODS.map((m) => [m, faceTexture(m)])), [])
  const root = useRef()
  const head = useRef()
  const faceMat = useRef()
  const bulb = useRef()
  const arm = useRef()
  const hand = useRef()
  const jet = useRef()
  const point = useRef(0) // 1 right after ROBO plays, fades out

  useEffect(() => {
    if (last !== null && board[last] === 'O') point.current = 1
  }, [last, board])

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    if (!root.current) return
    const happy = mood === 'happy'
    const sad = mood === 'sad'
    const think = mood === 'think'
    point.current = Math.max(0, point.current - dt * 1.2)

    root.current.position.y = 0.35 + (happy ? Math.abs(Math.sin(t * 8)) * 0.25 : Math.sin(t * 1.6) * 0.06)
    // turn toward the board while thinking / playing, toward you otherwise
    const turn = think || point.current > 0 ? -0.75 : happy ? 0 : -0.3
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, turn, 4, dt)
    root.current.rotation.z = THREE.MathUtils.damp(root.current.rotation.z, happy ? Math.sin(t * 8) * 0.08 : 0, 6, dt)

    const tiltZ = think ? Math.sin(t * 2.2) * 0.14 : 0
    const tiltX = sad ? 0.35 : mood === 'wow' ? -0.15 : 0
    head.current.rotation.z = THREE.MathUtils.damp(head.current.rotation.z, tiltZ, 6, dt)
    head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, tiltX, 6, dt)

    // board-side arm: raised to point while playing, waving when it wins
    const armZ = point.current > 0 ? -1.9 : happy ? -2.5 + Math.sin(t * 10) * 0.35 : think ? -0.5 - Math.abs(Math.sin(t * 5)) * 0.2 : -0.15
    arm.current.rotation.z = THREE.MathUtils.damp(arm.current.rotation.z, armZ, 9, dt)
    hand.current.getWorldPosition(roboHand)

    const blink = mood === 'idle' && t % 3.7 < 0.12
    const face = faces[blink ? 'blink' : mood]
    if (faceMat.current.map !== face) faceMat.current.map = face
    bulb.current.color.set(think ? (Math.sin(t * 12) > 0 ? YELLOW : '#4a3a00') : happy ? '#7dff8a' : sad ? '#7aa7ff' : PINK)
    jet.current.scale.y = 0.85 + Math.sin(t * 30) * 0.1
  })

  const metal = <meshStandardMaterial color="#2a2444" metalness={0.65} roughness={0.32} />
  return (
    <group position={position} scale={scale}>
      <group ref={root}>
        {/* thruster glow under the body */}
        <mesh ref={jet} position={[0, 0.62, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.22, 0.6, 20, 1, true]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.88, 0]}>
          <cylinderGeometry args={[0.3, 0.22, 0.12, 20]} />
          {metal}
        </mesh>
        {/* torso */}
        <RoundedBox args={[0.95, 0.85, 0.55]} radius={0.12} position={[0, 1.37, 0]}>
          {metal}
        </RoundedBox>
        <mesh position={[0, 1.45, 0.28]}>
          <boxGeometry args={[0.5, 0.05, 0.02]} />
          <meshBasicMaterial color={PINK} toneMapped={false} />
        </mesh>
        {[-0.15, 0, 0.15].map((x, i) => (
          <mesh key={x} position={[x, 1.3, 0.28]}>
            <circleGeometry args={[0.035, 16]} />
            <meshBasicMaterial color={[CYAN, YELLOW, PINK][i]} toneMapped={false} />
          </mesh>
        ))}
        {/* neck + head */}
        <mesh position={[0, 1.86, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.16, 16]} />
          {metal}
        </mesh>
        <group ref={head} position={[0, 1.94, 0]}>
          <RoundedBox args={[0.78, 0.54, 0.5]} radius={0.12} position={[0, 0.27, 0]}>
            {metal}
          </RoundedBox>
          <mesh position={[0, 0.27, 0.252]}>
            <planeGeometry args={[0.62, 0.38]} />
            <meshBasicMaterial ref={faceMat} map={faces.idle} toneMapped={false} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.41, 0.27, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
              <meshBasicMaterial color={CYAN} toneMapped={false} />
            </mesh>
          ))}
          <mesh position={[0, 0.64, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.22, 8]} />
            {metal}
          </mesh>
          <mesh position={[0, 0.77, 0]}>
            <sphereGeometry args={[0.05, 16, 12]} />
            <meshBasicMaterial ref={bulb} color={PINK} toneMapped={false} />
          </mesh>
        </group>
        {/* resting arm (away from the board) */}
        <group position={[0.56, 1.65, 0]} rotation={[0, 0, 0.15]}>
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.07, 0.45, 4, 12]} />
            {metal}
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <sphereGeometry args={[0.09, 16, 12]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
        </group>
        {/* pointing arm (board side) */}
        <group ref={arm} position={[-0.56, 1.65, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.07, 0.45, 4, 12]} />
            {metal}
          </mesh>
          <mesh ref={hand} position={[0, -0.6, 0]}>
            <sphereGeometry args={[0.09, 16, 12]} />
            <meshBasicMaterial color={PINK} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
