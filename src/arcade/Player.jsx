import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { DOORS, GAMES, HALL, SCREEN, cabinetTransform, doorTransform } from './games'
import { input, useArcade } from './store'
import { sfx } from './sound'

const EYE = 1.6
const SPEED = 3.2
const RUN = 5.5
const BOUNDS = { x: 3.05, zMin: HALL.back + 1.2, zMax: HALL.front - 0.6 }
const REACH = 1.9

// Precompute where to stand in front of each cabinet and where to look at its screen.
function cabinetPoses() {
  const out = {}
  for (const g of GAMES) {
    const { position, rotY } = cabinetTransform(g)
    const p = new THREE.Vector3(...position)
    const rot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY)
    const stand = new THREE.Vector3(0, 0, 1.45).applyQuaternion(rot).add(p)
    const screen = new THREE.Vector3(...SCREEN.center).applyQuaternion(rot).add(p)
    const normal = new THREE.Vector3(0, -Math.sin(SCREEN.tilt), Math.cos(SCREEN.tilt)).applyQuaternion(rot)
    const view = screen.clone().addScaledVector(normal, 0.8)
    const look = new THREE.Matrix4().lookAt(view, screen, new THREE.Vector3(0, 1, 0))
    out[g.id] = {
      stand,
      yaw: rotY,
      view,
      viewQuat: new THREE.Quaternion().setFromRotationMatrix(look),
    }
  }
  for (const d of DOORS) {
    const { position, rotY } = doorTransform(d)
    const rot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY)
    const stand = new THREE.Vector3(0, 0, 1.4).applyQuaternion(rot).add(new THREE.Vector3(...position))
    out[`door:${d.id}`] = { stand, yaw: rotY, door: d }
  }
  return out
}

// everything the visitor can walk up to: cabinets and doors
const TARGETS = [
  ...GAMES.map((g) => ({ id: g.id, center: cabinetTransform(g).position })),
  ...DOORS.map((d) => ({ id: `door:${d.id}`, center: doorTransform(d).position })),
]

export default function Player() {
  const camera = useThree((s) => s.camera)
  const poses = useMemo(cabinetPoses, [])
  const pos = useRef(new THREE.Vector3(0, EYE, HALL.front - 1))
  const yaw = useRef(0)
  const pitch = useRef(-0.04)
  const settle = useRef(0) // >0 while easing back from a cabinet screen
  const lastMode = useRef('walk')
  const tmp = useMemo(
    () => ({
      quat: new THREE.Quaternion(),
      euler: new THREE.Euler(0, 0, 0, 'YXZ'),
      v: new THREE.Vector3(),
      walkPos: new THREE.Vector3(),
    }),
    []
  )

  useEffect(() => {
    // coming back out of a room: stand in front of its door, facing the hall
    const spawn = useArcade.getState().spawn
    const pose = spawn?.door && poses[`door:${spawn.door}`]
    if (pose) {
      pos.current.set(pose.stand.x, EYE, pose.stand.z)
      yaw.current = pose.yaw + Math.PI
    }
    camera.position.copy(pos.current)
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ')
  }, [camera, poses])

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const s = useArcade.getState()
    const mode = s.mode
    if (lastMode.current !== mode) {
      if (mode === 'walk' && ['coin', 'menu', 'info', 'video', 'play'].includes(lastMode.current)) settle.current = 1
      lastMode.current = mode
    }

    // ---- at a cabinet: glide to / hold the screen view
    if (s.active && mode !== 'walk' && mode !== 'approach') {
      const pose = poses[s.active]
      camera.position.lerp(pose.view, 1 - Math.exp(-dt * 5))
      camera.quaternion.slerp(pose.viewQuat, 1 - Math.exp(-dt * 5))
      if (mode === 'coin' && camera.position.distanceTo(pose.view) < 0.03) s.arrived()
      input.look.dx = input.look.dy = 0
      return
    }

    // ---- look around
    yaw.current -= input.look.dx * 0.0032
    pitch.current = THREE.MathUtils.clamp(pitch.current - input.look.dy * 0.0028, -0.7, 0.6)
    input.look.dx = input.look.dy = 0

    // ---- movement intent from keys + joystick
    const k = input.keys
    let fwd = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) + input.move.y
    let side = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0) + input.move.x
    const manual = Math.abs(fwd) + Math.abs(side) > 0.05
    const speed = k.has('ShiftLeft') || k.has('ShiftRight') ? RUN : SPEED

    const p = pos.current
    if (mode === 'approach' && manual) s.open('walk')

    if (mode === 'approach' && s.target) {
      // auto-walk to the clicked cabinet, turning to face it on the way
      const pose = poses[s.target]
      tmp.v.set(pose.stand.x - p.x, 0, pose.stand.z - p.z)
      const dist = tmp.v.length()
      const yawDiff = Math.atan2(Math.sin(pose.yaw - yaw.current), Math.cos(pose.yaw - yaw.current))
      yaw.current += yawDiff * (1 - Math.exp(-dt * 4))
      pitch.current += (-0.08 - pitch.current) * (1 - Math.exp(-dt * 4))
      if (dist > 0.05) p.addScaledVector(tmp.v.normalize(), Math.min(dist, SPEED * 1.2 * dt))
      if (dist < 0.08 && Math.abs(yawDiff) < 0.05) {
        if (pose.door) {
          sfx.door()
          s.goRoom(pose.door.id)
        } else {
          sfx.coin()
          s.insertCoin(s.target)
        }
      }
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

    // gentle head bob while walking
    const moving = manual || mode === 'approach'
    const bob = moving ? Math.sin(clock.elapsedTime * 9) * 0.022 : 0
    tmp.walkPos.set(p.x, EYE + bob, p.z)
    tmp.euler.set(pitch.current, yaw.current, 0, 'YXZ')
    tmp.quat.setFromEuler(tmp.euler)

    if (settle.current > 0) {
      // ease back from the screen view
      settle.current = Math.max(0, settle.current - dt * 1.4)
      camera.position.lerp(tmp.walkPos, 1 - Math.exp(-dt * 6))
      camera.quaternion.slerp(tmp.quat, 1 - Math.exp(-dt * 6))
    } else {
      camera.position.copy(tmp.walkPos)
      camera.quaternion.copy(tmp.quat)
    }

    // ---- which cabinet is within reach and roughly in front of us
    let best = null
    let bestD = REACH
    const fx = -Math.sin(yaw.current)
    const fz = -Math.cos(yaw.current)
    for (const t of TARGETS) {
      const stand = poses[t.id].stand
      const d = Math.hypot(stand.x - p.x, stand.z - p.z)
      const tx = t.center[0] - p.x
      const tz = t.center[2] - p.z
      const facing = (tx * fx + tz * fz) / (Math.hypot(tx, tz) || 1)
      if (d < bestD && facing > 0.35) {
        best = t.id
        bestD = d
      }
    }
    s.setNear(best)
  })

  return null
}
