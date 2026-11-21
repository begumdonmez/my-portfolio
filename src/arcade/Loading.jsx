import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'

const TIPS = [
  'İPUCU: Bir makineye tıkla, oraya kendin yürürsün.',
  'İPUCU: Shift basılı tutarsan koşarsın.',
  'İPUCU: Esc her zaman bir adım geri götürür.',
]

// Full-screen loading card shown while the arcade's assets download.
// `ready` = everything the scene needs has loaded.
export default function Loading({ ready, onDone, tips = TIPS, title = 'LOADING' }) {
  const { progress } = useProgress()
  const [minTime, setMinTime] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)])
  const done = ready && minTime

  useEffect(() => {
    const t = setTimeout(() => setMinTime(true), 1400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!done) return
    onDone?.()
    const t = setTimeout(() => setHidden(true), 900)
    return () => clearTimeout(t)
  }, [done, onDone])

  if (hidden) return null
  const pct = done ? 100 : Math.min(99, Math.round(ready ? 99 : progress))
  const blocks = 20
  const filled = Math.round((pct / 100) * blocks)

  return (
    <div className={`arc-loading ${done ? 'arc-loading--out' : ''}`} role="status" aria-live="polite">
      <div className="arc-loading__coin" aria-hidden />
      <p className="arc-loading__title">{title}</p>
      <div className="arc-loading__bar" aria-hidden>
        {Array.from({ length: blocks }, (_, i) => (
          <span key={i} className={i < filled ? 'on' : ''} />
        ))}
      </div>
      <p className="arc-loading__pct">{pct}%</p>
      <p className="arc-loading__tip">{tip}</p>
    </div>
  )
}
