import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Moves its children on a small looping path around `anchor` and spins them
// slowly on their own axis, so every planet drifts at its own pace.
export default function Orbit({
  anchor,
  radius = 1,
  speed = 0.15,
  spin = 0.1,
  phase = 0,
  tilt = 0,
  children,
}) {
  const group = useRef()
  const body = useRef()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + phase
    if (group.current) {
      group.current.position.set(
        anchor[0] + Math.cos(t) * radius,
        anchor[1] + Math.sin(t * 0.7) * radius * 0.45,
        anchor[2] + Math.sin(t) * radius * 0.6
      )
    }
    if (body.current) body.current.rotation.y = clock.elapsedTime * spin + phase
  })

  return (
    <group ref={group}>
      <group rotation={[tilt, 0, tilt * 0.5]}>
        <group ref={body}>{children}</group>
      </group>
    </group>
  )
}
