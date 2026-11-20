import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scroll, range } from './scroll'

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uOpacity;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec3 p = position;
    // slow drift so the field never feels frozen
    p.x += sin(uTime * 0.05 + aSeed * 40.0) * 0.4;
    p.y += cos(uTime * 0.04 + aSeed * 30.0) * 0.4;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float depth = -mv.z;
    float twinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 1.8) + aSeed * 6.2831);
    gl_PointSize = aSize * uPixelRatio * (40.0 / max(depth, 0.1));

    // fade out far away (fog) and right in front of the lens
    vAlpha = twinkle * smoothstep(90.0, 12.0, depth) * smoothstep(0.4, 4.0, depth) * uOpacity;
    vColor = aColor;
  }
`

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float a = core * core * vAlpha;
    if (a < 0.002) discard;
    gl_FragColor = vec4(vColor, a);
  }
`

const WHITE = new THREE.Color('#dfe6ff')
const ACCENT = new THREE.Color('#a28bff')

export default function Particles({ count = 3000 }) {
  const material = useRef()
  const dpr = useThree((s) => s.viewport.dpr)

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const seeds = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    const c = new THREE.Color()

    for (let i = 0; i < count; i++) {
      // a wide tunnel: dense far away, thinning out near the camera path
      const r = 3 + Math.pow(Math.random(), 0.7) * 38
      const theta = Math.random() * Math.PI * 2
      positions[i * 3] = Math.cos(theta) * r
      positions[i * 3 + 1] = Math.sin(theta) * r * 0.6
      positions[i * 3 + 2] = -90 + Math.random() * 130

      sizes[i] = 0.6 + Math.pow(Math.random(), 3) * 3.5
      seeds[i] = Math.random()

      c.copy(Math.random() < 0.12 ? ACCENT : WHITE)
      colors.set([c.r, c.g, c.b], i * 3)
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    g.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: dpr }, uOpacity: { value: 1 } }),
    [dpr]
  )

  useFrame((_, dt) => {
    if (!material.current) return
    material.current.uniforms.uTime.value += dt
    // thin out as we approach Earth
    material.current.uniforms.uOpacity.value = 1 - range(scroll.current, 0.45, 0.8) * 0.4
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
