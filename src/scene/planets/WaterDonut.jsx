import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'
import { Halo } from '../lib/Glow'

// A ring-shaped wetland world: deep blue channels, turquoise shallows, little
// grassy islands with sandy shores and huts, and hover-ships cutting wakes.
// The torus lies flat (axis = Y) so the planet's spin keeps its silhouette.

const RING = 1.45
const TUBE = 0.55

// point + normal on the torus surface for angles u (around ring) and v (around tube)
function onTorus(u, v, lift = 0) {
  const n = new THREE.Vector3(Math.cos(v) * Math.cos(u), Math.sin(v), Math.cos(v) * Math.sin(u))
  const p = new THREE.Vector3(RING * Math.cos(u), 0, RING * Math.sin(u)).addScaledVector(n, TUBE + lift)
  return { p, n }
}

const waterVertex = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`
const waterFragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vView;

  float wave(vec3 p, float t) {
    return sin(p.x * 5.0 + t * 0.5) * sin(p.z * 4.3 - t * 0.4) * 0.5
         + sin(p.x * 11.0 - p.z * 9.0 + t * 0.9) * 0.25
         + sin(p.y * 13.0 + p.x * 7.0 - t * 0.7) * 0.15;
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vView);
    float n = wave(vPos, uTime) * 0.5 + 0.5;

    vec3 deep = vec3(0.03, 0.12, 0.32);
    vec3 mid = vec3(0.05, 0.36, 0.62);
    vec3 shallow = vec3(0.22, 0.85, 0.85);
    vec3 col = mix(deep, mid, smoothstep(0.25, 0.6, n));
    col = mix(col, shallow, smoothstep(0.68, 0.9, n));

    // thin foam lines that drift along the currents
    float f = sin((vPos.x + vPos.z) * 38.0 + wave(vPos * 2.0, uTime) * 6.0 + uTime);
    col += smoothstep(0.96, 1.0, f) * 0.25 * smoothstep(0.5, 0.8, n);

    float light = max(dot(N, normalize(vec3(-0.4, 0.7, 0.6))), 0.0) * 0.75 + 0.3;
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    vec3 H = normalize(V + normalize(vec3(-0.4, 0.7, 0.6)));
    float spec = pow(max(dot(N, H), 0.0), 60.0);

    gl_FragColor = vec4(col * light + fres * vec3(0.35, 0.75, 1.0) * 0.7 + spec * 0.6, 1.0);
  }
`

function Island({ u, v, size }) {
  const { p, n } = onTorus(u, v, -0.01)
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n)
  const huts = Math.random() < 0.6
  return (
    <group position={p.toArray()} quaternion={q} rotation-y={Math.random() * 6}>
      <mesh scale={[size, size * 0.18, size * 0.7]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color="#c9a46a" roughness={0.9} />
      </mesh>
      <mesh position={[0, size * 0.08, 0]} scale={[size * 0.75, size * 0.2, size * 0.5]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color="#5f9a34" roughness={0.9} flatShading />
      </mesh>
      {huts && (
        <mesh position={[size * 0.35, size * 0.12, size * 0.1]}>
          <sphereGeometry args={[size * 0.18, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#a8603a" roughness={0.8} />
        </mesh>
      )}
    </group>
  )
}

function Ship({ speed, offset, v }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const u = clock.elapsedTime * speed + offset
    const { p, n } = onTorus(u, v, 0.09)
    ref.current.position.copy(p)
    // face along the direction of travel
    const tangent = new THREE.Vector3(-Math.sin(u), 0, Math.cos(u)).multiplyScalar(Math.sign(speed))
    const m = new THREE.Matrix4().lookAt(new THREE.Vector3(), tangent, n)
    ref.current.quaternion.setFromRotationMatrix(m)
  })
  return (
    <Trail width={0.6} length={5} color="#d8fbff" attenuation={(w) => w * w} decay={1.5}>
      <group ref={ref}>
        <mesh scale={[0.05, 0.035, 0.13]}>
          <capsuleGeometry args={[0.6, 1.2, 4, 10]} />
          <meshStandardMaterial color="#e9e6df" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.02, 0]} scale={[0.055, 0.012, 0.14]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#b8322e" />
        </mesh>
        <mesh position={[0, 0.035, 0.03]}>
          <boxGeometry args={[0.04, 0.03, 0.05]} />
          <meshStandardMaterial color="#d9d6cf" />
        </mesh>
        <mesh position={[0, 0.06, 0.03]}>
          <sphereGeometry args={[0.008, 6, 4]} />
          <meshStandardMaterial color="#ff3b3b" emissive="#ff3b3b" emissiveIntensity={3} toneMapped={false} />
        </mesh>
      </group>
    </Trail>
  )
}

export default function WaterDonut() {
  const geo = useMemo(() => {
    const g = new THREE.TorusGeometry(RING, TUBE, 64, 160)
    g.rotateX(Math.PI / 2)
    return g
  }, [])
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame((_, dt) => (uniforms.uTime.value += dt))

  const islands = useMemo(
    () =>
      Array.from({ length: 16 }, () => ({
        u: Math.random() * Math.PI * 2,
        v: Math.PI / 2 + (Math.random() - 0.5) * 2.2,
        size: 0.08 + Math.random() * 0.12,
      })),
    []
  )

  return (
    <group>
      <Halo color="#3fb8ff" size={6.5} opacity={0.3} />
      <mesh geometry={geo}>
        <shaderMaterial vertexShader={waterVertex} fragmentShader={waterFragment} uniforms={uniforms} />
      </mesh>
      {islands.map((s, i) => (
        <Island key={i} {...s} />
      ))}
      <Ship speed={0.35} offset={0} v={Math.PI / 2} />
      <Ship speed={0.35} offset={0.5} v={Math.PI / 2 + 0.15} />
      <Ship speed={-0.25} offset={2.5} v={Math.PI / 2 - 0.35} />
    </group>
  )
}
