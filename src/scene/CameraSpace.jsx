import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Children are positioned relative to the camera (x right, y up, -z forward).
// Used for things that should stay framed no matter where the camera flies.
export default function CameraSpace({ children }) {
  const group = useRef()
  useFrame(({ camera }) => {
    if (!group.current) return
    group.current.position.copy(camera.position)
    group.current.quaternion.copy(camera.quaternion)
  }, 1)
  return <group ref={group}>{children}</group>
}
