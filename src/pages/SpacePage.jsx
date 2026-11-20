import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Scene from '../scene/Scene'
import Intro from '../components/Intro'
import Hero from '../components/Hero'
import { bindScroll } from '../scene/scroll'

const INTRO_MS = 1600 // minimum time the black curtain stays up
const FADE_MS = 1400 // curtain fade, matches .intro transition
const HERO_DELAY_MS = 1900 // let the camera travel before text appears

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

// coming back from a planet shouldn't replay the whole intro
const seenIntro = () => {
  try {
    return sessionStorage.getItem('intro-seen') === '1'
  } catch {
    return false
  }
}

export default function SpacePage() {
  const navigate = useNavigate()
  const quick = seenIntro()
  const [sceneReady, setSceneReady] = useState(false)
  const [minTimeDone, setMinTimeDone] = useState(false)
  const [phase, setPhase] = useState('loading') // loading | leaving | gone
  const [heroVisible, setHeroVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMinTimeDone(true), reducedMotion || quick ? 300 : INTRO_MS)
    return () => clearTimeout(t)
  }, [quick])

  // always start the journey at the top
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    return bindScroll()
  }, [])

  // lock scrolling during the intro
  useEffect(() => {
    document.body.classList.toggle('is-locked', !heroVisible)
    return () => document.body.classList.remove('is-locked')
  }, [heroVisible])

  // title and hint fade away during the first part of the scroll
  useEffect(() => {
    const onScroll = () => {
      const fade = 1 - Math.min(1, window.scrollY / (window.innerHeight * 0.6))
      document.documentElement.style.setProperty('--hero-fade', fade.toFixed(3))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!sceneReady || !minTimeDone) return
    setPhase('leaving')
    try {
      sessionStorage.setItem('intro-seen', '1')
    } catch {
      /* private mode: just replay next time */
    }
    const timers = [
      setTimeout(() => setPhase('gone'), FADE_MS),
      setTimeout(() => setHeroVisible(true), reducedMotion || quick ? 300 : HERO_DELAY_MS),
    ]
    return () => timers.forEach(clearTimeout)
  }, [sceneReady, minTimeDone, quick])

  // fade to black, then open the arcade
  const enterArcade = () => {
    if (leaving) return
    setLeaving(true)
    setTimeout(() => navigate('/arcade'), 700)
  }

  return (
    <>
      <Scene
        entered={phase !== 'loading'}
        onReady={() => setSceneReady(true)}
        onEnterArcade={enterArcade}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
      />
      {/* Vignette + film grain over the canvas. Done in CSS so the grain also
          dithers the dark gradients and avoids visible banding. */}
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />
      <Hero visible={heroVisible} />
      {heroVisible && (
        <button className="space-nav" onClick={enterArcade}>
          🕹 Arcade
        </button>
      )}
      <Intro phase={phase} />
      <div className={`page-fade ${leaving ? 'page-fade--on' : ''}`} aria-hidden />
      <div className="scroll-track" aria-hidden />
    </>
  )
}
