import { Suspense, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Room from './Room'
import Cabinet from './Cabinet'
import Player from './Player'
import Overlay from './Overlay'
import Joystick from './Joystick'
import Loading from './Loading'
import Door from './Door'
import XoxRoom from './xox/XoxRoom'
import XoxOverlay from './xox/XoxOverlay'
import TriviaRoom from './trivia/TriviaRoom'
import TriviaOverlay from './trivia/TriviaOverlay'
import { DOORS, GAMES, SOON, cabinetTransform } from './games'
import { input, useArcade } from './store'
import { sfx } from './sound'
import { PIXEL_FONT } from './textures'
import './Arcade.css'

const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

// Fires once everything inside the Suspense boundary has loaded.
function Ready({ onReady }) {
  useEffect(() => {
    onReady()
  }, [onReady])
  return null
}

function useInputs(enabled) {
  useEffect(() => {
    if (!enabled) return
    const down = (e) => {
      if (e.target.closest?.('input, textarea')) return
      input.keys.add(e.code)
      const s = useArcade.getState()
      if ((e.code === 'KeyE' || e.code === 'Enter') && s.room === 'hall' && s.mode === 'walk' && s.near) {
        if (s.near.startsWith('door:')) {
          sfx.door()
          s.goRoom(s.near.slice(5))
        } else {
          sfx.coin()
          s.insertCoin(s.near)
        }
      }
      if (e.code.startsWith('Arrow') && s.mode === 'walk') e.preventDefault()
    }
    const up = (e) => input.keys.delete(e.code)
    const blur = () => input.keys.clear()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
      input.keys.clear()
    }
  }, [enabled])
}

// Drag anywhere on the scene to look around.
function useDragLook() {
  const [dragging, setDragging] = useState(null)
  const handlers = {
    onPointerDown: (e) => {
      input.dragDistance = 0
      setDragging({ id: e.pointerId, x: e.clientX, y: e.clientY })
    },
    onPointerMove: (e) => {
      if (!dragging || dragging.id !== e.pointerId) return
      const dx = e.clientX - dragging.x
      const dy = e.clientY - dragging.y
      input.look.dx += dx * (isTouch ? 1.4 : 1)
      input.look.dy += dy * (isTouch ? 1.4 : 1)
      input.dragDistance += Math.abs(dx) + Math.abs(dy)
      setDragging({ ...dragging, x: e.clientX, y: e.clientY })
    },
    onPointerUp: () => setDragging(null),
    onPointerCancel: () => setDragging(null),
  }
  return { handlers, dragging: !!dragging }
}

export default function ArcadePage() {
  const navigate = useNavigate()
  const [fontsReady, setFontsReady] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [inside, setInside] = useState(false)
  const mode = useArcade((s) => s.mode)
  const room = useArcade((s) => s.room)
  const fading = useArcade((s) => s.fading)
  const { handlers, dragging } = useDragLook()
  useInputs(inside)

  // canvas textures are drawn with the pixel font, so wait for it first
  useEffect(() => {
    let alive = true
    const fallback = setTimeout(() => alive && setFontsReady(true), 2500)
    document.fonts
      ?.load(`32px ${PIXEL_FONT}`)
      .catch(() => {})
      .finally(() => {
        clearTimeout(fallback)
        if (alive) setFontsReady(true)
      })
    return () => {
      alive = false
      clearTimeout(fallback)
    }
  }, [])

  // fresh state each visit, no page scrolling while inside
  useEffect(() => {
    useArcade.setState({ room: 'hall', fading: false, spawn: null, mode: 'walk', near: null, active: null, target: null })
    window.scrollTo(0, 0)
    document.body.classList.add('is-locked')
    return () => document.body.classList.remove('is-locked')
  }, [])

  const onReady = useCallback(() => setSceneReady(true), [])
  const onDone = useCallback(() => setInside(true), [])
  const inHall = room === 'hall'
  const walking = inHall && (mode === 'walk' || mode === 'approach')

  return (
    <div className={`arcade ${dragging ? 'is-dragging' : ''}`}>
      <div className="arcade__canvas" {...(walking ? handlers : {})}>
        {fontsReady && (
          <Canvas
            dpr={isMobile ? [1, 1.25] : [1, 1.6]}
            gl={{ antialias: false, powerPreference: 'high-performance' }}
            camera={{ fov: isMobile ? 80 : 65, near: 0.05, far: 60, position: [0, 1.6, 1.5] }}
          >
            <color attach="background" args={['#07060d']} />
            <fog attach="fog" args={['#07060d', 10, 30]} />
            <Suspense fallback={null}>
              {inHall ? (
                <group>
                  <Room isMobile={isMobile} />
                  {GAMES.map((g) => (
                    <Cabinet key={g.id} game={g} lights={!isMobile} {...cabinetTransform(g)} />
                  ))}
                  {SOON.map((s) => (
                    <Cabinet key={s.id} game={null} lights={false} {...cabinetTransform(s)} />
                  ))}
                  {DOORS.map((d) => (
                    <Door key={d.id} door={d} />
                  ))}
                  <Player />
                </group>
              ) : room === 'xox' ? (
                <XoxRoom />
              ) : (
                <TriviaRoom />
              )}
              <Ready onReady={onReady} />
            </Suspense>
            <EffectComposer multisampling={0}>
              <Bloom mipmapBlur luminanceThreshold={0.55} luminanceSmoothing={0.25} intensity={0.85} />
            </EffectComposer>
          </Canvas>
        )}
      </div>

      {inside && room === 'xox' && <XoxOverlay />}
      {inside && room === 'trivia' && <TriviaOverlay />}
      {inside && inHall && (
        <>
          <button className="arc-exit" onClick={() => navigate('/')}>
            ← UZAYA DÖN
          </button>
          {walking && (
            <p className="arc-hint">
              {isTouch
                ? 'Joystick ile yürü · sürükleyerek bak · makineye dokun'
                : 'WASD ile yürü · sürükleyerek bak · makineye tıkla'}
            </p>
          )}
          {isTouch && walking && <Joystick />}
          <Overlay />
        </>
      )}

      <div className={`arc-room-fade ${fading ? 'is-on' : ''}`} aria-hidden />
      <Loading ready={fontsReady && sceneReady} onDone={onDone} />
    </div>
  )
}
