import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { randomDirection, terrainRadius } from '../lib/terrain'

// Instanced grass blades that sway in the wind, scattered over a terrain sphere.
export default function Grass({ terrain, count = 3000, colors = ['#2f6a25', '#7fbf45'] }) {
  const { mesh, uniforms } = useMemo(() => {
    // unit-height blade with the base at y=0, darker at the root
    const geo = new THREE.ConeGeometry(0.1, 1, 3, 3)
    geo.translate(0, 0.5, 0)
    const pos = geo.attributes.position
    const vc = new Float32Array(pos.count * 3)
    for (let i = 0; i < pos.count; i++) {
      const t = pos.getY(i)
      const v = 0.35 + t * 0.65
      vc.set([v, v, v], i * 3)
    }
    geo.setAttribute('color', new THREE.BufferAttribute(vc, 3))

    const uniforms = { uTime: { value: 0 } }
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, flatShading: true })
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime
      shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float hgt = clamp(position.y, 0.0, 1.0);
        vec4 ip = instanceMatrix[3];
        float w = sin(uTime * 1.7 + ip.x * 4.0 + ip.z * 3.0) * 0.6 + sin(uTime * 3.3 + ip.y * 6.0) * 0.25;
        transformed.x += w * 0.22 * hgt * hgt;
        transformed.z += w * 0.12 * hgt * hgt;`
      )
    }

    const mesh = new THREE.InstancedMesh(geo, mat, count)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const s = new THREE.Vector3()
    const p = new THREE.Vector3()
    const dir = new THREE.Vector3()
    const up = new THREE.Vector3(0, 1, 0)
    const twist = new THREE.Quaternion()
    const c0 = new THREE.Color(colors[0])
    const c1 = new THREE.Color(colors[1])
    const c = new THREE.Color()

    for (let i = 0; i < count; i++) {
      randomDirection(dir)
      const r = terrainRadius(dir, terrain)
      p.copy(dir).multiplyScalar(r - 0.005)
      q.setFromUnitVectors(up, dir)
      twist.setFromAxisAngle(up, Math.random() * Math.PI * 2)
      q.multiply(twist)
      const h = 0.06 + Math.random() * 0.1
      s.set(h, h, h)
      m.compose(p, q, s)
      mesh.setMatrixAt(i, m)
      mesh.setColorAt(i, c.copy(c0).lerp(c1, Math.random()))
    }
    mesh.instanceMatrix.needsUpdate = true
    return { mesh, uniforms }
  }, [terrain, count, colors])

  useEffect(() => () => {
    mesh.geometry.dispose()
    mesh.material.dispose()
  }, [mesh])

  useFrame((_, dt) => {
    uniforms.uTime.value += dt
  })

  return <primitive object={mesh} />
}
