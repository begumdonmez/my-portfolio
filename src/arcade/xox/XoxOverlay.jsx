import { useEffect, useState } from 'react'
import { useXox } from './store'
import { LEVELS } from './logic'
import { useArcade } from '../store'
import { sfx } from '../sound'
import { fx } from './fx'

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

const leave = () => {
  sfx.back()
  useArcade.getState().goRoom('hall', { door: 'xox' })
}

export default function XoxOverlay() {
  const say = useXox((s) => s.say)
  const score = useXox((s) => s.score)
  const level = useXox((s) => s.level)
  const turn = useXox((s) => s.turn)
  const outcome = useXox((s) => s.outcome)
  const streak = useXox((s) => s.streak)
  // the result card waits for the win / draw effects to play out
  const [revealed, setRevealed] = useState(false)
  const [flash, setFlash] = useState(null)

  useEffect(() => {
    let timer
    const offs = [
      fx.on('win', ({ mark }) => {
        setRevealed(true)
        setFlash(mark === 'X' ? 'win' : 'lose')
        clearTimeout(timer)
        timer = setTimeout(() => setFlash(null), 700)
      }),
      fx.on('draw', () => setRevealed(true)),
    ]
    return () => {
      offs.forEach((off) => off())
      clearTimeout(timer)
    }
  }, [])
  useEffect(() => {
    if (!outcome) setRevealed(false)
  }, [outcome])

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Escape') leave()
      else if ((e.code === 'Enter' || e.code === 'Space') && document.querySelector('.xox-result')) {
        sfx.select()
        useXox.getState().nextRound()
      } else if (/^Digit[1-9]$/.test(e.code)) useXox.getState().play(Number(e.code.slice(5)) - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const result = revealed && outcome && (outcome.mark === 'X' ? 'KAZANDIN!' : outcome.mark === 'O' ? 'ROBO KAZANDI' : 'BERABERE')

  return (
    <div className="xox-ui">
      <button className="arc-exit" onClick={leave}>
        ← SALONA DÖN
      </button>

      <div className="xox-score" aria-label="Skor">
        <span className="xox-score__you">SEN {score.you}</span>
        <span className="xox-score__draw">{score.draw}</span>
        <span className="xox-score__robo">{score.robo} ROBO</span>
      </div>

      <div className="xox-levels" role="group" aria-label="Zorluk">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            className={l.id === level ? 'is-active' : ''}
            onClick={() => {
              if (l.id === level) return
              sfx.select()
              useXox.getState().setLevel(l.id)
            }}
          >
            {l.label}
          </button>
        ))}
      </div>

      {flash && <div className={`xox-flash xox-flash--${flash}`} aria-hidden />}
      {streak >= 2 && (
        <p className="xox-streak" key={streak}>
          SERİ ×{streak}
        </p>
      )}

      <p className="xox-bubble" key={say}>
        <b>ROBO:</b> {say}
      </p>

      {result ? (
        <div className="xox-result">
          <p>{result}</p>
          <button
            onClick={() => {
              sfx.select()
              useXox.getState().nextRound()
            }}
          >
            ▶ TEKRAR {!isTouch && <kbd>Enter</kbd>}
          </button>
        </div>
      ) : outcome ? null : (
        <p className="arc-hint">
          {turn === 'X'
            ? isTouch
              ? 'Sıra sende · bir kareye dokun'
              : 'Sıra sende · bir kareye tıkla (ya da 1–9) · Esc salona dön'
            : 'ROBO düşünüyor…'}
        </p>
      )}
    </div>
  )
}
