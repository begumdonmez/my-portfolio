import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { fx } from './fx'

// Pooled particle effects shared by the special rooms. Trigger them with
// fx.emit('burst', {...}) and fx.emit('ring', {...}).

// ---------- sparks: one pooled point cloud for every burst and the confetti
const MAX = 900

const sparkShader = {
  vertexShader: /* glsl */ `
    attribute float aSize;
    attribute float aAlpha;
    attribute vec3 aColor;
    varying float vAlpha;
    varying vec3 vColor;
    void main() {
      vAlpha = aAlpha;
      vColor = aColor;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * 1100.0 / -mv.z;
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: /* glsl */ `
    varying float vAlpha;
    varying vec3 vColor;
    void main() {
      vec2 p = gl_PointCoord - 0.5;
      float d = length(p);
      float a = smoothstep(0.5, 0.0, d);
      a = a * a * vAlpha;
      if (a < 0.01) discard;
      gl_FragColor = vec4(vColor * (1.0 + a), a);
      #include <colorspace_fragment>
    }
  `,
}

export function Sparks() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX * 3), 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(MAX * 3), 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(MAX), 1))
    g.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(MAX), 1))
    return g
  }, [])
  const sim = useMemo(
    () => ({
      vel: new Float32Array(MAX * 3),
      life: new Float32Array(MAX),
      max: new Float32Array(MAX),
      grav: new Float32Array(MAX),
      size: new Float32Array(MAX),
      next: 0,
    }),
    []
  )
  const color = useMemo(() => new THREE.Color(), [])

  useEffect(() => {
    const pos = geo.attributes.position.array
    const col = geo.attributes.aColor.array
    // spray particles out of the wall toward the room
    const burst = ({ at, colors, count, speed, life = 0.7, gravity = 6, size = 0.07, spread = 1 }) => {
      for (let n = 0; n < count; n++) {
        const i = sim.next++ % MAX
        const theta = Math.random() * Math.PI * 2
        const r = Math.random() * spread
        pos.set([at[0] + (Math.random() - 0.5) * 0.2, at[1] + (Math.random() - 0.5) * 0.2, at[2] + 0.1], i * 3)
        const s = speed * (0.35 + Math.random() * 0.75)
        sim.vel[i * 3] = Math.cos(theta) * r * s
        sim.vel[i * 3 + 1] = Math.sin(theta) * r * s + speed * 0.25
        sim.vel[i * 3 + 2] = (0.4 + Math.random() * 0.8) * s * 0.7
        sim.max[i] = sim.life[i] = life * (0.6 + Math.random() * 0.8)
        sim.grav[i] = gravity
        sim.size[i] = size * (0.6 + Math.random() * 0.9)
        color.set(colors[Math.floor(Math.random() * colors.length)])
        col.set([color.r, color.g, color.b], i * 3)
      }
      geo.attributes.aColor.needsUpdate = true
    }
    return fx.on('burst', burst)
  }, [geo, sim, color])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const pos = geo.attributes.position.array
    const alpha = geo.attributes.aAlpha.array
    const size = geo.attributes.aSize.array
    const drag = Math.exp(-dt * 1.6)
    for (let i = 0; i < MAX; i++) {
      if (sim.life[i] <= 0) {
        alpha[i] = 0
        continue
      }
      sim.life[i] -= dt
      sim.vel[i * 3 + 1] -= sim.grav[i] * dt
      for (let k = 0; k < 3; k++) {
        sim.vel[i * 3 + k] *= drag
        pos[i * 3 + k] += sim.vel[i * 3 + k] * dt
      }
      const t = Math.max(0, sim.life[i] / sim.max[i])
      alpha[i] = t
      size[i] = sim.size[i] * (0.4 + 0.6 * t)
    }
    geo.attributes.position.needsUpdate = true
    geo.attributes.aAlpha.needsUpdate = true
    geo.attributes.aSize.needsUpdate = true
  })

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        {...sparkShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ---------- shock rings that expand from a cell on the wall
const RINGS = 8

export function Rings() {
  const meshes = useRef([])
  const state = useMemo(() => Array.from({ length: RINGS }, () => ({ start: -10, size: 1 })), [])
  const next = useRef(0)
  const now = useRef(0)

  useEffect(
    () =>
      fx.on('ring', ({ at, color, size = 1 }) => {
        const i = next.current++ % RINGS
        const m = meshes.current[i]
        state[i].start = now.current
        state[i].size = size
        m.position.set(at[0], at[1], at[2] + 0.12)
        m.material.color.set(color)
      }),
    [state]
  )

  useFrame(({ clock }) => {
    now.current = clock.elapsedTime
    for (let i = 0; i < RINGS; i++) {
      const m = meshes.current[i]
      const age = now.current - state[i].start
      const k = age / 0.55
      m.visible = k < 1
      if (!m.visible) continue
      const e = 1 - Math.pow(1 - k, 3)
      m.scale.setScalar((0.5 + e * 1.8) * state[i].size)
      m.material.opacity = (1 - k) * 0.9
    }
  })

  return Array.from({ length: RINGS }, (_, i) => (
    <mesh key={i} ref={(el) => (meshes.current[i] = el)} visible={false}>
      <ringGeometry args={[0.46, 0.52, 56]} />
      <meshBasicMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </mesh>
  ))
}
