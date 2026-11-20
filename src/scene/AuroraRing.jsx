import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Northern lights seen from orbit: a wavy ring of glowing curtains standing on
// the atmosphere around the pole. Bright green at the base, fading to violet.
// Place it so local +Y points out of the pole; `planetRadius` sets the size.

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uHeight;
  varying float vAngle;
  varying float vH;
  void main() {
    vec3 p = position;
    float a = atan(p.z, p.x);
    float h = p.y / uHeight + 0.5;
    // the oval breathes and ripples, and the curtains lean outwards as they rise
    float wobble = 1.0 + 0.07 * sin(a * 4.0 + uTime * 0.25) + 0.03 * sin(a * 11.0 - uTime * 0.45);
    p.xz *= wobble * (1.0 + h * 0.1);
    vAngle = a;
    vH = h;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying float vAngle;
  varying float vH;
  void main() {
    float rays = 0.5 + 0.5 * sin(vAngle * 140.0 + sin(vAngle * 9.0 + uTime * 0.6) * 4.0);
    rays = mix(rays, 1.0, 0.3);
    float band = 0.45 + 0.55 * pow(0.5 + 0.5 * sin(vAngle * 3.0 - uTime * 0.35), 1.5);
    float shimmer = 0.75 + 0.25 * sin(vAngle * 37.0 + uTime * 2.3);
    float profile = smoothstep(0.0, 0.05, vH) * exp(-vH * 2.6);
    vec3 col = mix(vec3(0.15, 1.0, 0.55), vec3(0.6, 0.28, 1.0), smoothstep(0.25, 0.9, vH));
    float a = profile * rays * band * shimmer * uOpacity;
    gl_FragColor = vec4(col * a * 2.4, a);
  }
`

export default function AuroraRing({ planetRadius, ringRatio = 0.38, opacity = 1 }) {
  const material = useRef()
  const r = planetRadius * ringRatio
  const height = planetRadius * 0.17
  // sit the base of the curtain on the surface at that latitude
  const baseY = Math.sqrt(planetRadius * planetRadius - r * r)

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uHeight: { value: height }, uOpacity: { value: opacity } }),
    [height, opacity]
  )

  useFrame((_, dt) => {
    if (material.current) material.current.uniforms.uTime.value += dt
  })

  return (
    <mesh position={[0, baseY + height / 2 - height * 0.08, 0]}>
      <cylinderGeometry args={[r, r, height, 256, 1, true]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
