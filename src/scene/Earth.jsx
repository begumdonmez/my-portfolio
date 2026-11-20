import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Atmosphere } from './lib/Glow'
import { noiseGLSL } from './glsl'
import { scroll, range, ease } from './scroll'
import AuroraRing from './AuroraRing'

// Earth seen from its night side, lit only along the top limb, with the
// northern lights circling the pole. As the page scrolls it rises from below
// and settles into a wide view from orbit.
// Lives inside <CameraSpace>, so positions are relative to the camera.

const R = 20

const vertex = /* glsl */ `
  varying vec3 vObj;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vObj = normalize(position);
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`

const fragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uSun; // view space
  varying vec3 vObj;
  varying vec3 vNormal;
  varying vec3 vView;
  ${noiseGLSL}

  void main() {
    vec3 N = normalize(vNormal);
    float n = fbm(vObj * 2.4);
    float land = smoothstep(0.5, 0.53, n);
    float lat = abs(vObj.y);
    float ice = smoothstep(0.8, 0.88, lat + (n - 0.5) * 0.3);

    vec3 ocean = mix(vec3(0.01, 0.05, 0.16), vec3(0.03, 0.14, 0.34), smoothstep(0.3, 0.5, n));
    vec3 ground = mix(vec3(0.09, 0.17, 0.07), vec3(0.32, 0.27, 0.16), smoothstep(0.55, 0.7, n));
    vec3 day = mix(ocean, ground, land);
    day = mix(day, vec3(0.85, 0.9, 0.95), ice);

    float clouds = smoothstep(0.55, 0.78, fbm(vObj * 3.6 + vec3(uTime * 0.008, 0.0, uTime * 0.004)));
    day = mix(day, vec3(0.92), clouds * 0.75);

    float ndl = dot(N, uSun);
    float dayMix = smoothstep(-0.12, 0.3, ndl);

    // city lights on the dark side
    float cityMask = step(0.8, vnoise(vObj * 160.0)) * smoothstep(0.45, 0.62, vnoise(vObj * 11.0));
    float city = cityMask * land * (1.0 - ice) * (1.0 - clouds * 0.8);
    vec3 night = vec3(0.004, 0.008, 0.02) + city * vec3(1.0, 0.72, 0.38) * 1.8 + clouds * vec3(0.015, 0.02, 0.04);

    vec3 col = mix(night, day * (0.15 + 0.6 * max(ndl, 0.0)), dayMix);

    // soft green glow on the ground under the aurora ring (ring sits at y = 0.866)
    float oval = exp(-pow((vObj.y - 0.866) / 0.035, 2.0)) * (1.0 - dayMix);
    col += oval * vec3(0.08, 0.7, 0.4) * 0.45;

    // atmosphere scattering at the limb
    float fres = pow(1.0 - max(dot(N, normalize(vView)), 0.0), 2.6);
    col += fres * mix(vec3(0.04, 0.12, 0.35), vec3(0.35, 0.65, 1.0), dayMix) * 1.4;

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function Earth({ isMobile }) {
  const group = useRef()
  const mesh = useRef()
  const material = useRef()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      // behind Earth and slightly above: only a thin crescent on the top limb is lit
      uSun: { value: new THREE.Vector3(0.1, 0.42, -0.9).normalize() },
    }),
    []
  )

  useFrame((_, dt) => {
    if (material.current) material.current.uniforms.uTime.value += dt
    const g = group.current
    if (!g) return
    const p = scroll.current
    const approach = ease(range(p, 0.28, 0.92))
    g.visible = p > 0.22

    // rises from far below into a wide view from orbit; we never land
    const y = THREE.MathUtils.lerp(isMobile ? -75 : -70, isMobile ? -12 : -14, approach)
    const z = THREE.MathUtils.lerp(-210, isMobile ? -70 : -62, approach)
    g.position.set(0, y, z)
    if (mesh.current) mesh.current.rotation.y += dt * 0.012
  })

  return (
    <group ref={group} visible={false}>
      {/* tip the north pole towards us so the aurora oval is in view */}
      <group rotation={[0.42, 0, 0.1]}>
        <mesh ref={mesh}>
          <sphereGeometry args={[R, 160, 120]} />
          <shaderMaterial ref={material} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
        </mesh>
        <AuroraRing planetRadius={R} ringRatio={0.5} />
      </group>
      <Atmosphere radius={R} color="#4aa8ff" scale={1.07} power={2.4} strength={1.8} />
    </group>
  )
}
