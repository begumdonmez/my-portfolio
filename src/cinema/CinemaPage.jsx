import { Suspense, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import CinemaScene from './CinemaScene'
import { FILMS } from './films'
import { useCinema } from './store'
import Loading from '../arcade/Loading'
import { sfx } from '../arcade/sound'
import '../arcade/Arcade.css'
import './Cinema.css'

const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
const byId = Object.fromEntries(FILMS.map((f) => [f.id, f]))
const TIPS = ['İPUCU: Boşluk tuşu filmi durdurur, M sesi kapatır.', 'İPUCU: Seyircileri izle, onlar da filmi izliyor.', 'İPUCU: ← → ile filmler arasında geç.']
const FONT = '"Pixelify Sans", monospace'

function Ready({ onReady }) {
  useEffect(() => {
    onReady()
  }, [onReady])
  return null
}

const play = (id) => {
  sfx.select()
  useCinema.getState().choose(id)
}
const step = (dir) => {
  const s = useCinema.getState()
  const i = FILMS.findIndex((f) => f.id === s.film)
  play(FILMS[(i + dir + FILMS.length) % FILMS.length].id)
}

function Programme() {
  const film = useCinema((s) => s.film)
  return (
    <div className="cn-programme" role="list" aria-label="Film programı">
      {FILMS.map((f) => (
        <button
          key={f.id}
          role="listitem"
          className={`cn-ticket ${f.id === film ? 'is-on' : ''}`}
          onMouseEnter={() => sfx.hover()}
          onClick={() => play(f.id)}
        >
          <img src={f.poster} alt="" loading="lazy" />
          <span className="cn-ticket__kind">{f.kind}</span>
          <b>{f.title}</b>
          <small>{f.tr}</small>
        </button>
      ))}
    </div>
  )
}

function Controls() {
  const film = byId[useCinema((s) => s.film)]
  const stage = useCinema((s) => s.stage)
  const paused = useCinema((s) => s.paused)
  const muted = useCinema((s) => s.muted)
  const progress = useCinema((s) => s.progress)
  const info = useCinema((s) => s.info)
  const c = useCinema.getState()
  return (
    <div className="cn-controls">
      <div className="cn-controls__bar">
        <i style={{ transform: `scaleX(${progress})` }} />
      </div>
      <div className="cn-controls__row">
        <button onClick={() => step(-1)} aria-label="Önceki film">⏮</button>
        <button onClick={c.togglePause} aria-label={paused ? 'Oynat' : 'Durdur'} disabled={stage === 'countdown'}>
          {stage === 'ended' ? '↻' : paused ? '▶' : '❚❚'}
        </button>
        <button onClick={() => step(1)} aria-label="Sonraki film">⏭</button>
        {film.sound && (
          <button onClick={c.toggleMute} aria-label={muted ? 'Sesi aç' : 'Sesi kapat'}>
            {muted ? '🔇' : '🔊'}
          </button>
        )}
        <p className="cn-controls__title">
          <b>{film.title}</b> <span>{film.kind}</span>
        </p>
        <button onClick={c.toggleInfo} className={info ? 'is-on' : ''}>
          i BİLGİ
        </button>
        <button
          onClick={() => {
            sfx.back()
            c.stop()
          }}
        >
          ■ PERDE
        </button>
      </div>
    </div>
  )
}

function Info() {
  const film = byId[useCinema((s) => s.film)]
  return (
    <aside className="cn-info">
      <p className="cn-info__kind">{film.kind}</p>
      <h2>{film.title}</h2>
      <p className="cn-info__tr">{film.tr}</p>
      <p className="cn-info__text">{film.text}</p>
      <div className="arc-tags">
        {film.tools.map((t) => (
          <span key={t}>#{t}</span>
        ))}
      </div>
    </aside>
  )
}

export default function CinemaPage() {
  const navigate = useNavigate()
  const [fontsReady, setFontsReady] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [inside, setInside] = useState(false)
  const film = useCinema((s) => s.film)
  const stage = useCinema((s) => s.stage)
  const info = useCinema((s) => s.info)

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
    useCinema.getState().stop()
    window.scrollTo(0, 0)
    document.body.classList.add('is-locked')
    return () => {
      document.body.classList.remove('is-locked')
      useCinema.getState().stop()
    }
  }, [])

  useEffect(() => {
    if (!inside) return
    const onKey = (e) => {
      const s = useCinema.getState()
      if (e.code === 'Escape') {
        if (s.film) {
          sfx.back()
          s.stop()
        } else navigate('/')
      } else if (e.code === 'Space' && s.film) {
        e.preventDefault()
        s.togglePause()
      } else if (e.code === 'KeyM') s.toggleMute()
      else if (e.code === 'KeyI' && s.film) s.toggleInfo()
      else if (e.code === 'ArrowRight') step(1)
      else if (e.code === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [inside, navigate])

  const onReady = useCallback(() => setSceneReady(true), [])
  const onDone = useCallback(() => setInside(true), [])

  return (
    <div className="arcade cinema">
      <div className="arcade__canvas">
        {fontsReady && (
          <Canvas
            dpr={isMobile ? [1, 1.25] : [1, 1.6]}
            gl={{ antialias: false, powerPreference: 'high-performance' }}
            camera={{ fov: isMobile ? 70 : 55, near: 0.05, far: 80, position: [0, 4.5, 9] }}
          >
            <color attach="background" args={['#050206']} />
            <Suspense fallback={null}>
              <CinemaScene />
              <Ready onReady={onReady} />
            </Suspense>
            <EffectComposer multisampling={0}>
              <Bloom mipmapBlur luminanceThreshold={0.88} luminanceSmoothing={0.25} intensity={0.7} />
            </EffectComposer>
          </Canvas>
        )}
      </div>

      {inside && (
        <>
          <button className="arc-exit" onClick={() => navigate('/')}>
            ← UZAYA DÖN
          </button>
          {!film && <p className="cn-hint">{isTouch ? 'Bir afişe dokun, film başlasın' : 'Bir afiş seç · ← → ile gez'}</p>}
          {(!film || stage === 'ended') && <Programme />}
          {film && <Controls />}
          {film && info && <Info />}
        </>
      )}

      <Loading ready={fontsReady && sceneReady} onDone={onDone} tips={TIPS} title="SİNEMA" />
    </div>
  )
}
