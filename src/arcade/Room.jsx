import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { HALL } from './games'
import { carpetTexture, neonSignTexture, screenTextTexture } from './textures'

const LENGTH = HALL.front - HALL.back
const MID_Z = (HALL.front + HALL.back) / 2

function NeonTube({ position, size, color, flicker = false }) {
  const mat = useRef()
  useFrame(({ clock }) => {
    if (!flicker || !mat.current) return
    const t = clock.elapsedTime
    // occasional buzz like an old tube
    const off = Math.sin(t * 13) > 0.96 || (t % 7 > 6.7 && Math.sin(t * 40) > 0)
    mat.current.color.set(off ? '#222' : color)
  })
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial ref={mat} color={color} toneMapped={false} />
    </mesh>
  )
}

export default function Room({ isMobile }) {
  const carpet = useMemo(() => {
    const t = carpetTexture()
    t.repeat.set(HALL.halfWidth * 2 / 2.2, LENGTH / 2.2)
    return t
  }, [])
  const sign = useMemo(
    () =>
      neonSignTexture([
        { text: "BEGÜM'S", color: '#f706cf', size: 120, y: 0.3 },
        { text: 'ARCADE', color: '#2de2e6', size: 190, y: 0.68 },
      ]),
    []
  )
  const exitText = useMemo(() => screenTextTexture('EXIT', '#ff4d4d'), [])
  const signMat = useRef()

  useFrame(({ clock }) => {
    if (!signMat.current) return
    const t = clock.elapsedTime
    signMat.current.opacity = t % 9 > 8.75 && Math.sin(t * 60) > 0 ? 0.35 : 1
  })

  const w = HALL.halfWidth
  const h = HALL.height

  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, MID_Z]}>
        <planeGeometry args={[w * 2, LENGTH]} />
        <meshStandardMaterial map={carpet} roughness={0.85} />
      </mesh>
      {/* ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, h, MID_Z]}>
        <planeGeometry args={[w * 2, LENGTH]} />
        <meshStandardMaterial color="#0a0912" roughness={1} />
      </mesh>
      {/* side walls */}
      {[-1, 1].map((s) => (
        <mesh key={s} rotation={[0, (-s * Math.PI) / 2, 0]} position={[s * w, h / 2, MID_Z]}>
          <planeGeometry args={[LENGTH, h]} />
          <meshStandardMaterial color="#140f26" roughness={0.9} />
        </mesh>
      ))}
      {/* back wall + sign */}
      <mesh position={[0, h / 2, HALL.back]}>
        <planeGeometry args={[w * 2, h]} />
        <meshStandardMaterial color="#110c20" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.5, HALL.back + 0.02]}>
        <planeGeometry args={[6.4, 2]} />
        <meshBasicMaterial ref={signMat} map={sign} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      {/* front wall with the way out */}
      <mesh position={[0, h / 2, HALL.front]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[w * 2, h]} />
        <meshStandardMaterial color="#110c20" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.75, HALL.front - 0.02]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1, 0.25]} />
        <meshBasicMaterial map={exitText} transparent toneMapped={false} />
      </mesh>
      <NeonTube position={[0, 2.5, HALL.front - 0.03]} size={[1.5, 0.03, 0.03]} color="#ff4d4d" />
      <NeonTube position={[-0.75, 1.25, HALL.front - 0.03]} size={[0.03, 2.5, 0.03]} color="#ff4d4d" />
      <NeonTube position={[0.75, 1.25, HALL.front - 0.03]} size={[0.03, 2.5, 0.03]} color="#ff4d4d" />

      {/* neon tubes along the ceiling edges and floor skirting */}
      <NeonTube position={[-w + 0.05, h - 0.12, MID_Z]} size={[0.05, 0.05, LENGTH]} color="#f706cf" />
      <NeonTube position={[w - 0.05, h - 0.12, MID_Z]} size={[0.05, 0.05, LENGTH]} color="#2de2e6" flicker />
      <NeonTube position={[-w + 0.03, 0.04, MID_Z]} size={[0.03, 0.03, LENGTH]} color="#7b61ff" />
      <NeonTube position={[w - 0.03, 0.04, MID_Z]} size={[0.03, 0.03, LENGTH]} color="#7b61ff" />
      {/* ceiling stripes across the hall */}
      {[-2, -7, -12, -17].map((z) => (
        <NeonTube key={z} position={[0, h - 0.03, z]} size={[w * 1.4, 0.02, 0.06]} color="#5b4bff" />
      ))}

      <ambientLight intensity={0.25} color="#8f80ff" />
      <hemisphereLight args={['#6a5cff', '#120a1e', 0.35]} />
      {(isMobile ? [-9] : [-3, -10, -17]).map((z) => (
        <pointLight key={z} position={[0, h - 0.5, z]} color="#a58cff" intensity={isMobile ? 10 : 6} distance={12} decay={1.4} />
      ))}
      <pointLight position={[0, 2.5, HALL.back + 1.5]} color="#f706cf" intensity={5} distance={7} />
    </group>
  )
}
