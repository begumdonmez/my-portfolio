import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { FILMS } from './films'
import { useCinema } from './store'
import { sfx } from '../arcade/sound'

// "Where the aliens go to the movies": a velvet cinema hall with stepped
// rows of seats, an alien audience and a big screen that plays Begüm's films.

const SCREEN = { y: 3.7, z: -11.5, maxW: 11, maxH: 6.2 }
const byId = Object.fromEntries(FILMS.map((f) => [f.id, f]))
const FONT = '"Pixelify Sans", monospace'
const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

// light from the screen, shared so the hall and audience glow with the film
const screenLight = { color: new THREE.Color('#1a1020'), level: 0 }

// seeded random so the audience is the same every visit
function rng(seed) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

// ---------- camera: you sit in the middle of the hall
function SeatCamera() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const want = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(0, SCREEN.y - 0.2, SCREEN.z), [])
  useEffect(() => {
    camera.position.set(0, 4.5, 9)
  }, [camera])
  useFrame(({ pointer }, dt) => {
    const portrait = size.width / size.height < 0.9
    const playing = useCinema.getState().stage !== 'idle'
    // lean in a little while a film plays
    const z = portrait ? 8.5 : playing ? 4.3 : 5.2
    // eye height of someone sitting in that row
    const y = portrait ? 5.2 : playing ? 3.6 : 3.9
    want.set(0.4 + pointer.x * 0.4, y + pointer.y * 0.15, z)
    camera.position.lerp(want, 1 - Math.exp(-dt * 2))
    camera.lookAt(look)
  })
  return null
}

// ---------- screen, curtains and the film itself
function leaderTexture() {
  const c = document.createElement('canvas')
  c.width = 640
  c.height = 360
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return { c, ctx: c.getContext('2d'), tex }
}

// old film leader: a sweeping hand over a big number, with dust and flicker
function drawLeader({ c, ctx, tex }, n, sweep) {
  const w = c.width
  const h = c.height
  ctx.fillStyle = '#d8d2c4'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(0,0,0,0.12)'
  ctx.beginPath()
  ctx.moveTo(w / 2, h / 2)
  ctx.arc(w / 2, h / 2, w, -Math.PI / 2, -Math.PI / 2 + sweep * Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#2a2622'
  ctx.lineWidth = 4
  for (const r of [120, 150]) {
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.moveTo(0, h / 2)
  ctx.lineTo(w, h / 2)
  ctx.moveTo(w / 2, 0)
  ctx.lineTo(w / 2, h)
  ctx.stroke()
  ctx.fillStyle = '#1a1714'
  ctx.font = `600 190px ${FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(n), w / 2, h / 2 + 10)
  // dust and scratches
  ctx.fillStyle = 'rgba(20,16,12,0.5)'
  for (let i = 0; i < 25; i++) ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 3 + 1, Math.random() * 3 + 1)
  ctx.fillRect(Math.random() * w, 0, 1.5, h)
  tex.needsUpdate = true
}

function idleTexture() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 576
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(512, 288, 40, 512, 288, 600)
  g.addColorStop(0, '#2a1020')
  g.addColorStop(1, '#07030a')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 1024, 576)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = '#ff3b5c'
  ctx.shadowBlur = 30
  ctx.fillStyle = '#ff7a8a'
  ctx.font = `600 92px ${FONT}`
  ctx.fillText('BEGÜM SİNEMASI', 512, 250)
  ctx.shadowColor = '#ffd27a'
  ctx.shadowBlur = 14
  ctx.fillStyle = '#ffd27a'
  ctx.font = `600 40px ${FONT}`
  ctx.fillText('aşağıdan bir film seç', 512, 350)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function useVideo(film) {
  const video = useMemo(() => {
    if (!film) return null
    const v = document.createElement('video')
    v.src = film.src
    v.crossOrigin = 'anonymous'
    v.playsInline = true
    v.preload = 'auto'
    v.loop = film.loop
    return v
  }, [film])
  const texture = useMemo(() => {
    if (!video) return null
    const t = new THREE.VideoTexture(video)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [video])
  useEffect(
    () => () => {
      video?.pause()
      video?.removeAttribute('src')
      video?.load()
      texture?.dispose()
    },
    [video, texture]
  )
  return { video, texture }
}

function Screen() {
  const filmId = useCinema((s) => s.film)
  const stage = useCinema((s) => s.stage)
  const paused = useCinema((s) => s.paused)
  const muted = useCinema((s) => s.muted)
  const film = filmId ? byId[filmId] : null
  const { video, texture } = useVideo(film)
  const leader = useMemo(leaderTexture, [])
  const idle = useMemo(idleTexture, [])
  const mesh = useRef()
  const mat = useRef()
  const aspect = useRef(16 / 9)
  const countStart = useRef(0)
  const lastN = useRef(0)
  const sampler = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 4
    return { c, ctx: c.getContext('2d', { willReadFrequently: true }), t: 0 }
  }, [])

  useEffect(() => {
    if (!video) return
    const meta = () => (aspect.current = video.videoWidth / video.videoHeight || 16 / 9)
    const end = () => {
      useCinema.getState().ended()
      sfx.applause()
    }
    const time = () => useCinema.getState().setProgress(video.duration ? video.currentTime / video.duration : 0)
    video.addEventListener('loadedmetadata', meta)
    video.addEventListener('ended', end)
    video.addEventListener('timeupdate', time)
    return () => {
      video.removeEventListener('loadedmetadata', meta)
      video.removeEventListener('ended', end)
      video.removeEventListener('timeupdate', time)
    }
  }, [video])

  useEffect(() => {
    if (stage === 'countdown') {
      countStart.current = performance.now()
      lastN.current = 0
      sfx.curtain()
      sfx.projector()
    }
  }, [stage, filmId])

  useEffect(() => {
    if (!video) return
    video.muted = muted
    if (stage === 'playing' && !paused) {
      if (video.ended) video.currentTime = 0
      video.play().catch(() => {
        // autoplay with sound refused: fall back to muted
        video.muted = true
        useCinema.setState({ muted: true })
        video.play().catch(() => {})
      })
    } else video.pause()
  }, [video, stage, paused, muted])

  useFrame((_, dt) => {
    const s = useCinema.getState()
    let map = idle
    let a = 16 / 9
    if (s.stage === 'countdown') {
      const t = (performance.now() - countStart.current) / 1000
      const n = 3 - Math.floor(t / 0.8)
      if (n <= 0) s.startFilm()
      else {
        if (n !== lastN.current) {
          lastN.current = n
          sfx.leader()
        }
        drawLeader(leader, n, (t % 0.8) / 0.8)
        map = leader.tex
      }
    } else if (texture && (s.stage === 'playing' || s.stage === 'ended')) {
      map = texture
      a = aspect.current
    }
    if (mat.current.map !== map) {
      mat.current.map = map
      mat.current.needsUpdate = true
    }
    // fit the picture inside the screen area
    let w = SCREEN.maxW
    let h = w / a
    if (h > SCREEN.maxH) {
      h = SCREEN.maxH
      w = h * a
    }
    mesh.current.scale.x = THREE.MathUtils.damp(mesh.current.scale.x, w, 6, dt)
    mesh.current.scale.y = THREE.MathUtils.damp(mesh.current.scale.y, h, 6, dt)

    // sample the picture a few times a second to light the room with it
    sampler.t += dt
    if (sampler.t > 0.15) {
      sampler.t = 0
      let target = '#1a1020'
      let level = 0.15
      try {
        const src = map === texture ? video : map.image
        if (src && (map !== texture || video.readyState >= 2)) {
          sampler.ctx.drawImage(src, 0, 0, 4, 4)
          const d = sampler.ctx.getImageData(0, 0, 4, 4).data
          let r = 0
          let g = 0
          let b = 0
          for (let i = 0; i < d.length; i += 4) {
            r += d[i]
            g += d[i + 1]
            b += d[i + 2]
          }
          const n = d.length / 4
          target = `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})`
          level = (r + g + b) / (n * 765)
        }
      } catch {
        /* not ready yet */
      }
      screenLight.target = target
      screenLight.levelTarget = level
    }
    if (screenLight.target) screenLight.color.lerp(new THREE.Color(screenLight.target), 1 - Math.exp(-dt * 4))
    screenLight.level = THREE.MathUtils.damp(screenLight.level, screenLight.levelTarget ?? 0.15, 4, dt)
  })

  return (
    <group position={[0, SCREEN.y, SCREEN.z]}>
      {/* black masking around the picture */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[SCREEN.maxW + 0.6, SCREEN.maxH + 0.6]} />
        <meshBasicMaterial color="#020103" />
      </mesh>
      <mesh ref={mesh} scale={[SCREEN.maxW, SCREEN.maxH, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial ref={mat} map={idle} color="#d6d6d6" toneMapped={false} />
      </mesh>
      <Curtains />
    </group>
  )
}

// velvet folds drawn once into a texture
function velvetTexture() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 16
  const ctx = c.getContext('2d')
  for (let x = 0; x < 256; x++) {
    const v = 0.5 + 0.5 * Math.sin((x / 256) * Math.PI * 2 * 7)
    const l = 18 + v * 30
    ctx.fillStyle = `hsl(350, 75%, ${l}%)`
    ctx.fillRect(x, 0, 1, 16)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function Curtains() {
  const velvet = useMemo(velvetTexture, [])
  const left = useRef()
  const right = useRef()
  const open = useRef(0)
  const W = SCREEN.maxW / 2 + 0.6
  const H = SCREEN.maxH + 1.4
  useFrame(({ clock }, dt) => {
    const stage = useCinema.getState().stage
    open.current = THREE.MathUtils.damp(open.current, stage === 'idle' ? 0 : 1, 2.2, dt)
    // gather towards the sides as they open, with a gentle sway
    const k = open.current
    const sway = Math.sin(clock.elapsedTime * 0.8) * 0.02
    left.current.scale.x = 1 - k * 0.82 + sway
    right.current.scale.x = 1 - k * 0.82 - sway
    left.current.position.x = -SCREEN.maxW / 2 - 0.3 + (W / 2) * left.current.scale.x
    right.current.position.x = SCREEN.maxW / 2 + 0.3 - (W / 2) * right.current.scale.x
  })
  return (
    <group position={[0, 0.3, 0.15]}>
      {[left, right].map((ref, i) => (
        <mesh key={i} ref={ref} position={[0, 0, 0]}>
          <planeGeometry args={[W, H]} />
          <meshStandardMaterial map={velvet} roughness={0.9} color="#ffffff" />
        </mesh>
      ))}
      {/* valance across the top */}
      <mesh position={[0, H / 2 - 0.2, 0.05]}>
        <boxGeometry args={[SCREEN.maxW + 2.2, 0.8, 0.2]} />
        <meshStandardMaterial map={velvet} roughness={0.9} />
      </mesh>
      <mesh position={[0, H / 2 - 0.62, 0.16]}>
        <boxGeometry args={[SCREEN.maxW + 2.2, 0.05, 0.03]} />
        <meshBasicMaterial color="#ffd27a" toneMapped={false} />
      </mesh>
    </group>
  )
}

// ---------- the hall
function Hall() {
  const stars = useMemo(() => {
    const r = rng(7)
    return Array.from({ length: isMobile ? 120 : 260 }, () => [(r() - 0.5) * 22, 8.6, -12 + r() * 26])
  }, [])
  const starRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  useEffect(() => {
    stars.forEach((p, i) => {
      dummy.position.set(...p)
      dummy.updateMatrix()
      starRef.current.setMatrixAt(i, dummy.matrix)
    })
    starRef.current.instanceMatrix.needsUpdate = true
  }, [stars, dummy])

  const ambient = useRef()
  const screenGlow = useRef()
  useFrame(() => {
    const playing = useCinema.getState().stage !== 'idle'
    // house lights dim once the film starts; the screen lights the room instead
    ambient.current.intensity = THREE.MathUtils.lerp(ambient.current.intensity, playing ? 0.08 : 0.35, 0.05)
    screenGlow.current.color.copy(screenLight.color)
    screenGlow.current.intensity = 3 + screenLight.level * (playing ? 14 : 6)
  })

  return (
    <group>
      {/* floor: steps rise toward the back */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]}>
        <planeGeometry args={[24, 30]} />
        <meshStandardMaterial color="#1a0a10" roughness={0.95} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[0, 0.2 + i * 0.4, 1 + i * 1.6]}>
          <boxGeometry args={[22, 0.4 + i * 0.8, 1.6]} />
          <meshStandardMaterial color="#160810" roughness={0.95} />
        </mesh>
      ))}
      {/* walls with soft sconces */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 11, 4.5, -2]} rotation={[0, -s * Math.PI / 2, 0]}>
            <planeGeometry args={[30, 9]} />
            <meshStandardMaterial color="#2a0b14" roughness={0.9} />
          </mesh>
          {[-8, -3, 2, 7].map((z) => (
            <mesh key={z} position={[s * 10.95, 4.2, z]} rotation={[0, -s * Math.PI / 2, 0]}>
              <circleGeometry args={[0.18, 16]} />
              <meshBasicMaterial color="#ffb86b" toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 4.5, -12.2]}>
        <planeGeometry args={[24, 9]} />
        <meshStandardMaterial color="#12060a" />
      </mesh>
      {/* ceiling with tiny stars */}
      <mesh position={[0, 8.7, -2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 30]} />
        <meshStandardMaterial color="#08040a" />
      </mesh>
      <instancedMesh ref={starRef} args={[null, null, stars.length]}>
        <sphereGeometry args={[0.025, 6, 4]} />
        <meshBasicMaterial color="#fff3d6" toneMapped={false} />
      </instancedMesh>
      {/* stage edge lights */}
      {Array.from({ length: 23 }, (_, i) => (
        <mesh key={i} position={[-11 + i, 0.08, -10.2]}>
          <sphereGeometry args={[0.06, 8, 6]} />
          <meshBasicMaterial color="#ffd27a" toneMapped={false} />
        </mesh>
      ))}
      <ambientLight ref={ambient} intensity={0.35} color="#ffb0c0" />
      <pointLight ref={screenGlow} position={[0, SCREEN.y, SCREEN.z + 3]} distance={26} decay={1.2} />
      {[-1, 1].map((s) => (
        <pointLight key={s} position={[s * 9.5, 4.2, -2]} color="#ff9a5a" intensity={3} distance={9} />
      ))}
    </group>
  )
}

function Seats() {
  const seats = useMemo(() => {
    const out = []
    for (let row = 0; row < 6; row++) {
      for (let col = -5; col <= 5; col++) {
        if (col === 0) continue // centre aisle
        out.push({ x: col * 0.95 + (col > 0 ? 0.3 : -0.3), y: 0.4 + row * 0.8, z: 0.4 + row * 1.6, row, col })
      }
    }
    return out
  }, [])
  return (
    <group>
      {seats.map((s) => (
        <group key={`${s.row},${s.col}`} position={[s.x, s.y, s.z]}>
          <RoundedBox args={[0.8, 0.9, 0.16]} radius={0.06} position={[0, 0.65, 0.3]}>
            <meshStandardMaterial color="#7a1024" roughness={0.8} />
          </RoundedBox>
          <RoundedBox args={[0.8, 0.16, 0.6]} radius={0.05} position={[0, 0.3, 0.02]}>
            <meshStandardMaterial color="#8a1428" roughness={0.8} />
          </RoundedBox>
        </group>
      ))}
    </group>
  )
}

// ---------- the audience
const ALIEN_COLORS = ['#7dff8a', '#b98cff', '#ff9a45', '#2de2e6', '#ff63e4', '#ffe66d', '#8fd3ff']

function Alien({ position, color, kind, eyes, seed }) {
  const g = useRef()
  const head = useRef()
  const arm = useRef()
  const r = useMemo(() => rng(seed), [seed])
  const phase = useMemo(() => r() * 10, [r])
  const laughAt = useRef(0)

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime + phase
    const s = useCinema.getState()
    const watching = s.stage === 'playing' && !s.paused
    // random laughs and munching while the film plays, chatting otherwise
    if (watching && Math.random() < dt * 0.06) laughAt.current = 1.2
    if (s.stage === 'ended') laughAt.current = Math.max(laughAt.current, 0.6)
    laughAt.current = Math.max(0, laughAt.current - dt)
    const laugh = laughAt.current > 0 ? Math.abs(Math.sin(t * 16)) * 0.08 : 0
    g.current.position.y = position[1] + Math.sin(t * 1.3) * 0.015 + laugh
    const turn = watching ? 0 : Math.sin(t * 0.5) * 0.6
    head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, turn, 3, dt)
    head.current.rotation.x = watching ? -0.08 : 0
    // popcorn: hand to mouth every few seconds; clapping at the end
    const munch = watching && Math.sin(t * 0.9) > 0.85 ? -1.9 : -0.4
    arm.current.rotation.x = s.stage === 'ended' ? -1.4 + Math.sin(t * 18) * 0.3 : THREE.MathUtils.damp(arm.current.rotation.x, munch, 6, dt)
  })

  const skin = <meshStandardMaterial color={color} roughness={0.45} emissive={color} emissiveIntensity={0.18} />
  return (
    <group ref={g} position={position}>
      <mesh position={[0, 0.45, 0]}>
        <capsuleGeometry args={[0.2, 0.3, 6, 12]} />
        {skin}
      </mesh>
      <group ref={head} position={[0, 0.95, 0]}>
        <mesh scale={kind === 0 ? [1, 1, 1] : kind === 1 ? [0.8, 1.3, 0.8] : [1.25, 0.85, 1]}>
          <sphereGeometry args={[0.26, 20, 14]} />
          {skin}
        </mesh>
        {/* eyes face the screen (the audience sits with its back to us) */}
        {Array.from({ length: eyes }, (_, i) => (
          <mesh key={i} position={[(i - (eyes - 1) / 2) * 0.12, 0.05, -0.22]}>
            <sphereGeometry args={[0.055, 10, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
        {kind !== 1 &&
          [-1, 1].map((s) => (
            <group key={s} position={[s * 0.12, 0.22, 0]} rotation={[0, 0, -s * 0.4]}>
              <mesh position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.24, 6]} />
                {skin}
              </mesh>
              <mesh position={[0, 0.26, 0]}>
                <sphereGeometry args={[0.04, 8, 6]} />
                <meshBasicMaterial color={color} toneMapped={false} />
              </mesh>
            </group>
          ))}
      </group>
      {/* one arm for popcorn duty */}
      <group ref={arm} position={[0.2, 0.62, 0]}>
        <mesh position={[0, -0.16, 0]}>
          <capsuleGeometry args={[0.05, 0.22, 4, 8]} />
          {skin}
        </mesh>
      </group>
    </group>
  )
}

function Audience() {
  const crowd = useMemo(() => {
    const r = rng(42)
    const out = []
    for (let row = 0; row < 5; row++) {
      for (let col = -5; col <= 5; col++) {
        if (col === 0) continue
        // leave your own seat (row 3, just right of the aisle) and its view free
        if (row >= 2 && Math.abs(col) <= 1) continue
        if (r() > (isMobile ? 0.35 : 0.5)) continue
        out.push({
          position: [col * 0.95 + (col > 0 ? 0.3 : -0.3), 0.55 + row * 0.8, 0.45 + row * 1.6],
          color: ALIEN_COLORS[Math.floor(r() * ALIEN_COLORS.length)],
          kind: Math.floor(r() * 3),
          eyes: 1 + Math.floor(r() * 3),
          seed: Math.floor(r() * 100000) + 1,
        })
      }
    }
    return out
  }, [])
  return crowd.map((a, i) => <Alien key={i} {...a} />)
}

// ---------- projector beam from the booth, with drifting dust
// Soft volumetric look: bright where you look straight through the cone,
// fading at its silhouette and towards the screen.
const BEAM_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vAlong;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vAlong = uv.y; // 1 at the projector, 0 at the screen
    gl_Position = projectionMatrix * mv;
  }
`
const BEAM_FRAG = /* glsl */ `
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vAlong;
  void main() {
    float facing = pow(abs(dot(normalize(vNormal), normalize(vView))), 3.0);
    float along = mix(0.25, 1.0, vAlong);
    gl_FragColor = vec4(uColor * facing * along * uOpacity, 1.0);
  }
`

function Projector() {
  const beam = useRef()
  const dust = useRef()
  const count = isMobile ? 120 : 260
  const geo = useMemo(() => {
    const r = rng(3)
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const k = r()
      pos[i * 3] = (r() - 0.5) * 2.2 * k * 4
      pos[i * 3 + 1] = 7.2 - k * 3.4 + (r() - 0.5) * k * 3
      pos[i * 3 + 2] = 13 - k * 24
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [count])
  const beamUniforms = useMemo(() => ({ uOpacity: { value: 0 }, uColor: { value: new THREE.Color('#fff1d6') } }), [])
  useFrame(({ clock }) => {
    const s = useCinema.getState()
    const on = s.stage === 'playing' || s.stage === 'countdown'
    const flick = 0.9 + Math.sin(clock.elapsedTime * 47) * 0.05 + Math.sin(clock.elapsedTime * 13) * 0.05
    const u = beam.current.uniforms
    u.uOpacity.value = THREE.MathUtils.lerp(u.uOpacity.value, on ? 0.22 * flick * (0.4 + screenLight.level) : 0, 0.08)
    u.uColor.value.copy(screenLight.color).lerp(new THREE.Color('#fff1d6'), 0.6)
    dust.current.material.opacity = Math.min(0.55, u.uOpacity.value * 2.2)
    dust.current.position.y = Math.sin(clock.elapsedTime * 0.2) * 0.15
    dust.current.rotation.z = Math.sin(clock.elapsedTime * 0.1) * 0.02
  })
  // a cone from the booth at the back towards the screen
  const from = new THREE.Vector3(0, 7.2, 13)
  const to = new THREE.Vector3(0, SCREEN.y, SCREEN.z)
  const len = from.distanceTo(to)
  const mid = from.clone().add(to).multiplyScalar(0.5)
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), to.clone().sub(from).normalize())
  return (
    <group>
      <mesh position={mid} quaternion={quat}>
        <coneGeometry args={[SCREEN.maxW * 0.45, len, 48, 1, true]} />
        <shaderMaterial
          ref={beam}
          uniforms={beamUniforms}
          vertexShader={BEAM_VERT}
          fragmentShader={BEAM_FRAG}
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <points ref={dust} geometry={geo}>
        <pointsMaterial color="#fff3d6" size={0.04} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  )
}

export default function CinemaScene() {
  return (
    <group>
      <SeatCamera />
      <Hall />
      <Seats />
      <Audience />
      <Screen />
      <Projector />
    </group>
  )
}
