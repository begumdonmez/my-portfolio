import { useMemo } from 'react'
import * as THREE from 'three'

let haloTexture
function getHaloTexture() {
  if (haloTexture) return haloTexture
  const s = 256
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(255,255,255,0.9)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.35)')
  g.addColorStop(0.6, 'rgba(255,255,255,0.08)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  haloTexture = new THREE.CanvasTexture(c)
  haloTexture.colorSpace = THREE.SRGBColorSpace
  return haloTexture
}

// Soft coloured light behind a planet. The planet hides the centre, so only
// the glow around its silhouette is visible.
export function Halo({ color = '#ffffff', size = 4, opacity = 0.5 }) {
  return (
    <sprite scale={[size, size, 1]}>
      <spriteMaterial
        map={getHaloTexture()}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        fog={false}
      />
    </sprite>
  )
}

const rimVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const rimFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uStrength;
  varying vec3 vNormal;
  void main() {
    float i = pow(max(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), uPower);
    gl_FragColor = vec4(uColor * i * uStrength, i);
  }
`

// Classic atmosphere shell: a slightly larger back-facing sphere whose edges glow.
export function Atmosphere({ radius, color = '#7fd6ff', scale = 1.12, power = 3, strength = 1.4 }) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uPower: { value: power },
      uStrength: { value: strength },
    }),
    [color, power, strength]
  )
  return (
    <mesh scale={scale}>
      <sphereGeometry args={[radius, 48, 32]} />
      <shaderMaterial
        vertexShader={rimVertex}
        fragmentShader={rimFragment}
        uniforms={uniforms}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
