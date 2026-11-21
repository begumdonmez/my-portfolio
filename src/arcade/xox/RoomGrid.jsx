import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useXox } from './store'
import { fx } from './fx'
import { BOARD, CYAN, PINK, ROOM, cellPos } from './layout'

// The room's walls, floor and ceiling are one neon grid that reacts to the game:
//  - every move sends a ring of light out from its cell; where the ring passes,
//    the grid cells swell and shrink like a wave
//  - the grid breathes slowly while idle
//  - a win cuts a band of light through the whole room along the winning line

const MAX_RIPPLES = 6

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`

const fragmentShader = /* glsl */ `
  #define MAX_RIPPLES ${MAX_RIPPLES}
  uniform float uTime;
  uniform vec2 uSize;        // surface size in metres
  uniform vec4 uHole;        // board rect on this surface (centre xy, half size xy), zero if none
  uniform vec3 uBase;
  uniform vec4 uRip[MAX_RIPPLES];    // xyz origin, w start time (<0 = unused)
  uniform vec3 uRipCol[MAX_RIPPLES];
  uniform vec3 uWinN;        // plane through the winning line
  uniform float uWinD;
  uniform float uWinT;       // start time, <0 = no win
  uniform vec3 uWinCol;
  varying vec2 vUv;
  varying vec3 vWorld;

  void main() {
    vec2 g = vUv * uSize;

    float glow = 0.0;
    vec3 rc = vec3(0.0);
    for (int i = 0; i < MAX_RIPPLES; i++) {
      if (uRip[i].w < 0.0) continue;
      float age = uTime - uRip[i].w;
      float d = distance(vWorld, uRip[i].xyz);
      float ring = exp(-pow((d - age * 6.5) * 1.3, 2.0)) * exp(-age * 0.75);
      // a soft flash right at the origin when it starts
      ring += exp(-d * 1.2) * exp(-age * 4.0) * 0.8;
      glow += ring;
      rc += uRipCol[i] * ring;
    }
    vec3 ripCol = glow > 0.001 ? rc / glow : uBase;
    float k = clamp(glow, 0.0, 1.5);

    // cell size breathes, and swells where a ripple passes
    float cell = 0.5 * (1.0 + 0.06 * sin(uTime * 0.9) + 0.45 * k);
    vec2 q = abs(fract(g / cell - 0.5) - 0.5) * cell;
    float m = min(q.x, q.y);
    float aa = fwidth(m) * 1.2;
    float w = 0.011 + 0.03 * k;
    float line = 1.0 - smoothstep(w - aa, w + aa, m);

    // brighter crossings
    float xing = (1.0 - smoothstep(w * 2.5 - aa, w * 2.5 + aa, q.x)) * (1.0 - smoothstep(w * 2.5 - aa, w * 2.5 + aa, q.y));

    // keep the area behind the board calm
    if (uHole.z > 0.0) {
      vec2 h = abs(g - uHole.xy) - uHole.zw;
      float inside = 1.0 - smoothstep(-0.2, 0.25, max(h.x, h.y));
      line *= 1.0 - inside * 0.85;
      xing *= 1.0 - inside;
    }

    vec3 lineCol = mix(uBase, ripCol, clamp(k * 1.4, 0.0, 1.0));
    float bright = 0.16 + 2.4 * k;
    vec3 col = vec3(0.006, 0.004, 0.014);
    col += lineCol * (line * bright + xing * 0.6 * bright);
    col += ripCol * k * 0.06;

    if (uWinT >= 0.0) {
      float age = uTime - uWinT;
      float wd = abs(dot(vWorld, uWinN) - uWinD);
      float band = exp(-wd * wd * 18.0) * smoothstep(0.0, 0.25, age);
      float pulse = 0.75 + 0.25 * sin(uTime * 9.0);
      col += uWinCol * band * (0.35 + line * 3.0) * pulse;
    }

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`

// uniforms every surface shares, so one update drives the whole room
function sharedUniforms() {
  return {
    uTime: { value: 0 },
    uBase: { value: new THREE.Color('#5b3fd0') },
    uRip: { value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, 0, -1)) },
    uRipCol: { value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Color()) },
    uWinN: { value: new THREE.Vector3(0, 1, 0) },
    uWinD: { value: 0 },
    uWinT: { value: -1 },
    uWinCol: { value: new THREE.Color('#ffd95a') },
  }
}

function surfaceMaterial(shared, size, hole = [0, 0, 0, 0]) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      ...shared,
      uSize: { value: new THREE.Vector2(...size) },
      uHole: { value: new THREE.Vector4(...hole) },
    },
  })
}

export default function RoomGrid() {
  const clock = useThree((s) => s.clock)
  const shared = useMemo(sharedUniforms, [])

  const W = ROOM.halfWidth * 2
  const H = ROOM.height
  const D = ROOM.front - ROOM.back
  const midZ = (ROOM.front + ROOM.back) / 2

  const mats = useMemo(() => {
    const half = BOARD.cell * 1.5
    return {
      floor: surfaceMaterial(shared, [W, D]),
      ceiling: surfaceMaterial(shared, [W, D]),
      left: surfaceMaterial(shared, [D, H]),
      right: surfaceMaterial(shared, [D, H]),
      // uv origin is the bottom-left corner of the back wall
      back: surfaceMaterial(shared, [W, H], [BOARD.x + W / 2, BOARD.y, half, half]),
    }
  }, [shared, W, D, H])

  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats])

  // turn game events into ripples and the win band
  useEffect(() => {
    let slot = 0
    const ripple = (pos, color) => {
      const i = slot++ % MAX_RIPPLES
      shared.uRip.value[i].set(pos[0], pos[1], pos[2], clock.elapsedTime)
      shared.uRipCol.value[i].set(color)
    }
    // ripples start when a mark lands, the band when the win sequence finishes
    const offs = [
      fx.on('impact', ({ index, mark }) => ripple(cellPos(index), mark === 'X' ? PINK : CYAN)),
      fx.on('win', ({ line, mark }) => {
        const a = new THREE.Vector3(...cellPos(line[0]))
        const c = new THREE.Vector3(...cellPos(line[2]))
        const n = c.clone().sub(a).normalize().cross(new THREE.Vector3(0, 0, 1)).normalize()
        shared.uWinN.value.copy(n)
        shared.uWinD.value = n.dot(a)
        shared.uWinT.value = clock.elapsedTime
        shared.uWinCol.value.set(mark === 'X' ? '#ffd95a' : '#ff2f6d')
        ripple(cellPos(line[1]), mark === 'X' ? '#ffe66d' : '#ff3b6b')
        if (mark === 'X') ripple(cellPos(line[1]), '#ffffff')
      }),
      fx.on('draw', () => ripple(cellPos(4), '#ffffff')), // one calm wave from the middle
      useXox.subscribe((s, prev) => {
        if (!s.outcome && prev.outcome) shared.uWinT.value = -1
      }),
    ]
    return () => offs.forEach((off) => off())
  }, [shared, clock])

  useFrame(({ clock }) => {
    shared.uTime.value = clock.elapsedTime
  })

  return (
    <group>
      <mesh material={mats.floor} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, midZ]}>
        <planeGeometry args={[W, D]} />
      </mesh>
      <mesh material={mats.ceiling} rotation={[Math.PI / 2, 0, 0]} position={[0, H, midZ]}>
        <planeGeometry args={[W, D]} />
      </mesh>
      <mesh material={mats.left} rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, midZ]}>
        <planeGeometry args={[D, H]} />
      </mesh>
      <mesh material={mats.right} rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, midZ]}>
        <planeGeometry args={[D, H]} />
      </mesh>
      <mesh material={mats.back} position={[0, H / 2, ROOM.back]}>
        <planeGeometry args={[W, H]} />
      </mesh>
    </group>
  )
}
