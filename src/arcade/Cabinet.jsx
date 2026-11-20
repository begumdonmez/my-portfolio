import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { marqueeTexture, screenTextTexture } from './textures'
import { input, useArcade } from './store'
import { sfx } from './sound'
import { SCREEN } from './games'

const SOON_COLORS = ['#3a3550', '#6a5f9a']

// Side silhouette of a classic upright cabinet: (forward, up) in metres.
const W = 0.86
const PROFILE = [
  [0, 0],
  [0.66, 0],
  [0.66, 0.86],
  [0.9, 0.95],
  [0.9, 1.0],
  [0.64, 1.06],
  [0.52, 1.58],
  [0.66, 1.64],
  [0.66, 1.92],
  [0, 1.92],
]


function bodyGeometry() {
  const shape = new THREE.Shape()
  PROFILE.forEach(([u, v], i) => (i ? shape.lineTo(u, v) : shape.moveTo(u, v)))
  shape.closePath()
  const g = new THREE.ExtrudeGeometry(shape, { depth: W, bevelEnabled: false })
  // shape x (forward) -> +z, extrusion -> x, centred on x
  g.rotateY(-Math.PI / 2)
  g.translate(W / 2, 0, 0)
  return g
}

function sideArtTexture([c1, c2]) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 512
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, 256, 512)
  const bands = [
    [c1, 0.0, 0.18],
    [c2, 0.24, 0.34],
    [c1, 0.4, 0.44],
  ]
  bands.forEach(([col, a, b]) => {
    ctx.fillStyle = col
    ctx.beginPath()
    ctx.moveTo(0, 512 * (0.55 + a))
    ctx.lineTo(256, 512 * (0.15 + a))
    ctx.lineTo(256, 512 * (0.15 + b))
    ctx.lineTo(0, 512 * (0.55 + b))
    ctx.closePath()
    ctx.fill()
  })
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const screenVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
// CRT look: slight barrel curve, scanlines, vignette; static when there is no picture.
const screenFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uHasMap;
  uniform float uTime;
  uniform float uPower;
  varying vec2 vUv;
  float rand(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main() {
    vec2 c = vUv - 0.5;
    vec2 uv = 0.5 + c * (1.0 + dot(c, c) * 0.18);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }
    vec3 col;
    if (uHasMap > 0.5) {
      col = texture2D(uMap, uv).rgb;
    } else {
      float n = rand(floor(uv * vec2(160.0, 100.0)) + floor(uTime * 24.0));
      col = vec3(n * 0.22 + 0.03) * vec3(0.8, 0.85, 1.0);
    }
    float scan = 0.82 + 0.18 * sin(uv.y * 520.0 + uTime * 6.0);
    float vig = smoothstep(0.85, 0.25, length(c * vec2(1.0, 1.3)));
    gl_FragColor = vec4(col * scan * vig * uPower, 1.0);
    #include <colorspace_fragment>
  }
`

function Screen({ game }) {
  const material = useRef()
  const camera = useThree((s) => s.camera)
  const cover = useTexture(game?.cover ?? '/arcade/covers/santas.jpg')

  // gameplay loop on the screen, only decoded while the visitor is nearby
  const video = useMemo(() => {
    if (!game?.video) return null
    const v = document.createElement('video')
    v.src = game.video
    v.muted = true
    v.loop = true
    v.playsInline = true
    v.preload = 'metadata'
    return v
  }, [game])
  const videoTex = useMemo(() => {
    if (!video) return null
    const t = new THREE.VideoTexture(video)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [video])
  useEffect(
    () => () => {
      video?.pause()
      videoTex?.dispose()
    },
    [video, videoTex]
  )

  const uniforms = useMemo(
    () => ({
      uMap: { value: null },
      uHasMap: { value: game ? 1 : 0 },
      uTime: { value: 0 },
      uPower: { value: 1 },
    }),
    [game]
  )
  const world = useMemo(() => new THREE.Vector3(), [])
  const mesh = useRef()

  useFrame((_, dt) => {
    const u = material.current?.uniforms
    if (!u) return
    u.uTime.value += dt
    const playing = video && !video.paused && video.readyState >= 2
    u.uMap.value = playing ? videoTex : cover
    if (video && mesh.current) {
      mesh.current.getWorldPosition(world)
      const close = world.distanceTo(camera.position) < 9
      if (close && video.paused) video.play().catch(() => {})
      else if (!close && !video.paused) video.pause()
    }
  })

  return (
    <mesh ref={mesh} position={SCREEN.center} rotation={[SCREEN.tilt, 0, 0]}>
      <planeGeometry args={SCREEN.size} />
      <shaderMaterial
        ref={material}
        vertexShader={screenVertex}
        fragmentShader={screenFragment}
        uniforms={uniforms}
        toneMapped={false}
      />
    </mesh>
  )
}

function BlinkText({ texture, position, rotation, size, speed = 1.6 }) {
  const mat = useRef()
  useFrame(({ clock }) => {
    if (mat.current) mat.current.opacity = Math.sin(clock.elapsedTime * speed * Math.PI) > -0.2 ? 1 : 0
  })
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial ref={mat} map={texture} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  )
}

export default function Cabinet({ game, position, rotY, lights = true }) {
  const colors = game?.colors ?? SOON_COLORS
  const body = useMemo(bodyGeometry, [])
  const edges = useMemo(() => new THREE.EdgesGeometry(body, 25), [body])
  const marquee = useMemo(() => marqueeTexture(game ? game.title : 'YAKINDA', colors), [game, colors])
  const sideArt = useMemo(() => sideArtTexture(colors), [colors])
  const coinText = useMemo(() => screenTextTexture(game ? 'INSERT COIN' : 'YAKINDA', game ? '#ffe66d' : '#b9a8ff'), [game])
  const [hovered, setHovered] = useState(false)
  const edgeMat = useRef()
  const active = useArcade((s) => s.active === game?.id)
  const near = useArcade((s) => s.near === game?.id)

  useFrame(({ clock }) => {
    if (!edgeMat.current) return
    const lit = hovered || near || active
    edgeMat.current.opacity = lit ? 1 : 0.55 + Math.sin(clock.elapsedTime * 2 + position[2]) * 0.1
  })

  useEffect(() => {
    document.body.style.cursor = hovered && game ? 'pointer' : ''
    return () => (document.body.style.cursor = '')
  }, [hovered, game])

  const onClick = (e) => {
    e.stopPropagation()
    if (!game || input.dragDistance > 6) return
    const s = useArcade.getState()
    if (s.mode !== 'walk' && s.mode !== 'approach') return
    if (s.near === game.id) {
      sfx.coin()
      s.insertCoin(game.id)
    } else {
      sfx.select()
      s.walkTo(game.id)
    }
  }

  return (
    <group
      position={position}
      rotation={[0, rotY, 0]}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (game) sfx.hover()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh geometry={body}>
        <meshStandardMaterial color="#15121f" roughness={0.45} metalness={0.3} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial ref={edgeMat} color={colors[0]} transparent toneMapped={false} />
      </lineSegments>

      {/* side art on both flanks */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * W) / 2 + s * 0.002, 0.95, 0.33]} rotation={[0, (s * Math.PI) / 2, 0]}>
          <planeGeometry args={[0.62, 1.8]} />
          <meshBasicMaterial map={sideArt} transparent toneMapped={false} opacity={0.9} />
        </mesh>
      ))}

      {/* marquee */}
      <mesh position={[0, 1.78, 0.662]}>
        <planeGeometry args={[W - 0.06, 0.25]} />
        <meshBasicMaterial map={marquee} toneMapped={false} />
      </mesh>

      <Screen game={game} />
      <BlinkText
        texture={coinText}
        position={[0, 1.15, 0.62]}
        rotation={[SCREEN.tilt, 0, 0]}
        size={[0.5, 0.125]}
      />

      {/* control panel: joystick + buttons */}
      <group position={[0, 1.0, 0.78]} rotation={[-0.23, 0, 0]}>
        <mesh position={[-0.2, 0.015, 0]}>
          <cylinderGeometry args={[0.035, 0.04, 0.015, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[-0.2, 0.06, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.09, 8]} />
          <meshStandardMaterial color="#222" metalness={0.8} />
        </mesh>
        <mesh position={[-0.2, 0.11, 0]}>
          <sphereGeometry args={[0.028, 16, 12]} />
          <meshStandardMaterial color={colors[0]} emissive={colors[0]} emissiveIntensity={0.4} roughness={0.3} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.02 + i * 0.09, 0.012, i === 1 ? -0.03 : 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
            <meshStandardMaterial
              color={i === 1 ? colors[1] : colors[0]}
              emissive={i === 1 ? colors[1] : colors[0]}
              emissiveIntensity={1.2}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* coin door with glowing slots */}
      <mesh position={[0, 0.5, 0.662]}>
        <planeGeometry args={[0.3, 0.24]} />
        <meshStandardMaterial color="#26222f" metalness={0.7} roughness={0.35} />
      </mesh>
      {[-0.06, 0.06].map((x) => (
        <mesh key={x} position={[x, 0.53, 0.664]}>
          <planeGeometry args={[0.035, 0.012]} />
          <meshBasicMaterial color="#ff8a3c" toneMapped={false} />
        </mesh>
      ))}
      {/* kick plate */}
      <mesh position={[0, 0.06, 0.662]}>
        <planeGeometry args={[W - 0.02, 0.1]} />
        <meshBasicMaterial color={colors[1]} toneMapped={false} />
      </mesh>

      {lights && <pointLight position={[0, 0.8, 1.3]} color={colors[0]} intensity={2.2} distance={4} decay={1.6} />}
    </group>
  )
}
