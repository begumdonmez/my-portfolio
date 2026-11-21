import { Suspense, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import MuseumScene from './MuseumScene'
import { EXHIBITS, GROUPS } from './exhibits'
import { useMuseum } from './store'
import { input } from '../arcade/store'
import Loading from '../arcade/Loading'
import Joystick from '../arcade/Joystick'
import { sfx } from '../arcade/sound'
import '../arcade/Arcade.css'
import './Museum.css'

const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
const byId = Object.fromEntries(EXHIBITS.map((e) => [e.id, e]))
const TIPS = ['İPUCU: Bir esere tıkla, yanına kendin yürürsün.', 'İPUCU: Eser açıkken ← → ile sıradakine geç.', 'İPUCU: Ortadaki vitrinler 3D modelleri bekliyor.']
const FONT = '"Pixelify Sans", monospace'

function Ready({ onReady }) {
  useEffect(() => {
    onReady()
  }, [onReady])
  return null
}

function useKeys(enabled, navigate) {
  useEffect(() => {
    if (!enabled) return
    const down = (e) => {
      const s = useMuseum.getState()
      if (s.mode === 'view') {
        if (e.code === 'Escape') {
          sfx.back()
          s.leave()
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          sfx.hover()
          s.step(1)
        } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          sfx.hover()
          s.step(-1)
        }
        return
      }
      input.keys.add(e.code)
      if ((e.code === 'KeyE' || e.code === 'Enter') && s.near) {
        sfx.select()
        s.view(s.near)
      }
      if (e.code === 'Escape') navigate('/')
      if (e.code.startsWith('Arrow')) e.preventDefault()
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
  }, [enabled, navigate])
}

function useDragLook() {
  const [drag, setDrag] = useState(null)
  return {
    dragging: !!drag,
    handlers: {
      onPointerDown: (e) => {
        input.dragDistance = 0
        setDrag({ id: e.pointerId, x: e.clientX, y: e.clientY })
      },
      onPointerMove: (e) => {
        if (!drag || drag.id !== e.pointerId) return
        const dx = e.clientX - drag.x
        const dy = e.clientY - drag.y
        input.look.dx += dx * (isTouch ? 1.4 : 1)
        input.look.dy += dy * (isTouch ? 1.4 : 1)
        input.dragDistance += Math.abs(dx) + Math.abs(dy)
        setDrag({ ...drag, x: e.clientX, y: e.clientY })
      },
      onPointerUp: () => setDrag(null),
      onPointerCancel: () => setDrag(null),
    },
  }
}

function Prompt() {
  const near = useMuseum((s) => s.near)
  const mode = useMuseum((s) => s.mode)
  if (!near || mode !== 'walk') return null
  const ex = byId[near]
  return (
    <button
      className="arc-prompt ms-prompt"
      onClick={() => {
        sfx.select()
        useMuseum.getState().view(near)
      }}
    >
      İNCELE {!isTouch && <kbd>E</kbd>}
      <small>
        {GROUPS[ex.group].title} · {ex.sub}
      </small>
    </button>
  )
}

function Card() {
  const active = useMuseum((s) => s.active)
  const ex = byId[active]
  const group = GROUPS[ex.group]
  const index = EXHIBITS.indexOf(ex)
  return (
    <aside className="ms-card" key={active}>
      <p className="ms-card__eyebrow">
        {String(index + 1).padStart(2, '0')} / {EXHIBITS.length} · {group.title}
      </p>
      <h2>{ex.sub}</h2>
      <p className="ms-card__text">{ex.text ?? group.text}</p>
      <dl className="ms-card__meta">
        <dt>Rol</dt>
        <dd>{group.role}</dd>
        <dt>Araçlar</dt>
        <dd>{group.tools.join(' · ')}</dd>
      </dl>
      {group.link && (
        <a className="ms-card__link" href={group.link} target="_blank" rel="noreferrer">
          Behance'te gör ↗
        </a>
      )}
      <div className="ms-card__nav">
        <button
          onClick={() => {
            sfx.hover()
            useMuseum.getState().step(-1)
          }}
        >
          ← ÖNCEKİ
        </button>
        <button
          onClick={() => {
            sfx.back()
            useMuseum.getState().leave()
          }}
        >
          ✕
        </button>
        <button
          onClick={() => {
            sfx.hover()
            useMuseum.getState().step(1)
          }}
        >
          SONRAKİ →
        </button>
      </div>
    </aside>
  )
}

export default function MuseumPage() {
  const navigate = useNavigate()
  const [fontsReady, setFontsReady] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [inside, setInside] = useState(false)
  const mode = useMuseum((s) => s.mode)
  const { handlers, dragging } = useDragLook()
  useKeys(inside, navigate)

  useEffect(() => {
    let alive = true
    const fallback = setTimeout(() => alive && setFontsReady(true), 2500)
    document.fonts
      ?.load(`600 40px ${FONT}`)
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

  useEffect(() => {
    useMuseum.setState({ mode: 'walk', near: null, target: null, active: null })
    window.scrollTo(0, 0)
    document.body.classList.add('is-locked')
    return () => document.body.classList.remove('is-locked')
  }, [])

  const onReady = useCallback(() => setSceneReady(true), [])
  const onDone = useCallback(() => setInside(true), [])
  const walking = mode !== 'view'

  return (
    <div className={`arcade museum ${dragging ? 'is-dragging' : ''}`}>
      <div className="arcade__canvas" {...(walking ? handlers : {})}>
        {fontsReady && (
          <Canvas
            dpr={isMobile ? [1, 1.25] : [1, 1.6]}
            gl={{ antialias: false, powerPreference: 'high-performance' }}
            camera={{ fov: isMobile ? 78 : 62, near: 0.05, far: 60, position: [0, 1.65, 2.5] }}
          >
            <color attach="background" args={['#0b0910']} />
            <fog attach="fog" args={['#0b0910', 14, 40]} />
            <Suspense fallback={null}>
              <MuseumScene />
              <Ready onReady={onReady} />
            </Suspense>
            <EffectComposer multisampling={0}>
              <Bloom mipmapBlur luminanceThreshold={0.75} luminanceSmoothing={0.25} intensity={0.6} />
            </EffectComposer>
          </Canvas>
        )}
      </div>

      {inside && (
        <>
          <button className="arc-exit" onClick={() => navigate('/')}>
            ← UZAYA DÖN
          </button>
          {walking && (
            <p className="arc-hint">
              {isTouch ? 'Joystick ile yürü · sürükleyerek bak · esere dokun' : 'WASD ile yürü · sürükleyerek bak · esere tıkla'}
            </p>
          )}
          {isTouch && walking && <Joystick />}
          <Prompt />
          {mode === 'view' && <Card />}
        </>
      )}

      <Loading ready={fontsReady && sceneReady} onDone={onDone} tips={TIPS} title="MÜZE" />
    </div>
  )
}
