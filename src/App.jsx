import { useEffect, useState } from 'react'
import Scene from './scene/Scene'
import Intro from './components/Intro'
import Hero from './components/Hero'

const INTRO_MS = 1600 // minimum time the black curtain stays up
const FADE_MS = 1400 // curtain fade, matches .intro transition
const HERO_DELAY_MS = 1900 // let the camera travel before text appears

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

export default function App() {
  const [sceneReady, setSceneReady] = useState(false)
  const [minTimeDone, setMinTimeDone] = useState(false)
  const [phase, setPhase] = useState('loading') // loading | leaving | gone
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMinTimeDone(true), reducedMotion ? 400 : INTRO_MS)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!sceneReady || !minTimeDone) return
    setPhase('leaving')
    const timers = [
      setTimeout(() => setPhase('gone'), FADE_MS),
      setTimeout(() => setHeroVisible(true), reducedMotion ? 300 : HERO_DELAY_MS),
    ]
    return () => timers.forEach(clearTimeout)
  }, [sceneReady, minTimeDone])

  return (
    <>
      <Scene
        entered={phase !== 'loading'}
        onReady={() => setSceneReady(true)}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
      />
      {/* Vignette + film grain over the canvas. Done in CSS so the grain also
          dithers the dark gradients and avoids visible banding. */}
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />
      <Hero visible={heroVisible} />
      <Intro phase={phase} />
    </>
  )
}
