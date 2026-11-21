import { useEffect, useState } from 'react'
import { LETTERS, LIMIT, PLAYERS, ROUND, ranking, useTrivia } from './store'
import { useArcade } from '../store'
import { sfx } from '../sound'

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

const leave = () => {
  sfx.back()
  useArcade.getState().goRoom('hall', { door: 'trivia' })
}

const start = () => {
  sfx.jingle()
  useTrivia.getState().start()
}

// remaining seconds, refreshed a few times a second while a question is up
function useSecondsLeft() {
  const phase = useTrivia((s) => s.phase)
  const startedAt = useTrivia((s) => s.startedAt)
  const [left, setLeft] = useState(LIMIT)
  useEffect(() => {
    if (phase !== 'question') return
    const tick = () => setLeft(Math.max(0, LIMIT - (performance.now() - startedAt) / 1000))
    tick()
    const id = setInterval(tick, 100)
    return () => clearInterval(id)
  }, [phase, startedAt])
  return phase === 'question' ? left : 0
}

function Scoreboard() {
  const scores = useTrivia((s) => s.scores)
  const gained = useTrivia((s) => s.gained)
  const phase = useTrivia((s) => s.phase)
  return (
    <div className="tv-scores">
      {PLAYERS.map((p) => (
        <span key={p.id} className={p.id === 'you' ? 'is-you' : ''} style={{ '--c': p.color }}>
          {p.name} <b>{scores[p.id]}</b>
          {phase === 'reveal' && gained[p.id] > 0 && <i key={scores[p.id]}>+{gained[p.id]}</i>}
        </span>
      ))}
    </div>
  )
}

function Question() {
  const phase = useTrivia((s) => s.phase)
  const q = useTrivia((s) => s.list[s.index])
  const index = useTrivia((s) => s.index)
  const mine = useTrivia((s) => s.answers.you)
  const left = useSecondsLeft()
  const revealed = phase === 'reveal'

  useEffect(() => {
    const onKey = (e) => {
      const map = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, KeyA: 0, KeyB: 1, KeyC: 2, KeyD: 3 }
      if (map[e.code] === undefined) return
      choose(map[e.code])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!q) return null
  return (
    <div className={`tv-question ${revealed ? 'is-revealed' : ''}`}>
      <p className="tv-question__meta">
        <span>{q.cat}</span>
        <span>
          SORU {index + 1}/{ROUND}
        </span>
        <span className={left <= 5 && !revealed ? 'is-urgent' : ''}>{revealed ? '—' : Math.ceil(left)}</span>
      </p>
      <div className="tv-question__timer">
        <i style={{ transform: `scaleX(${revealed ? 0 : left / LIMIT})` }} />
      </div>
      <h2 className="tv-question__text">{q.q}</h2>
      <div className="tv-answers">
        {q.options.map((opt, i) => {
          const state = revealed
            ? i === q.correct
              ? 'is-correct'
              : i === mine
                ? 'is-wrong'
                : 'is-dim'
            : mine === undefined
              ? ''
              : i === mine
                ? 'is-picked'
                : 'is-dim'
          return (
            <button
              key={i}
              className={`tv-answer tv-answer--${i} ${state}`}
              disabled={mine !== undefined || revealed}
              onMouseEnter={() => mine === undefined && !revealed && sfx.hover()}
              onClick={() => choose(i)}
            >
              <b>{LETTERS[i]}</b>
              {opt}
            </button>
          )
        })}
      </div>
      {revealed && (
        <button
          className="tv-next"
          onClick={() => {
            sfx.select()
            useTrivia.getState().next()
          }}
        >
          SONRAKİ ▶
        </button>
      )}
    </div>
  )
}

function choose(i) {
  const s = useTrivia.getState()
  if (s.phase !== 'question' || s.answers.you !== undefined) return
  sfx.select()
  s.answer(i)
}

function Intro() {
  return (
    <div className="tv-card">
      <p className="tv-card__eyebrow">— UZAYLILAR ARASI —</p>
      <h2 className="tv-card__title">BİLGİ ŞOVU</h2>
      <p className="tv-card__text">
        {ROUND} soru, her biri {LIMIT} saniye. Üç uzaylı yarışmacıya karşı yarışıyorsun: hızlı cevap ekstra puan
        getirir.
      </p>
      <button className="tv-card__start" onClick={start}>
        ▶ BAŞLA {!isTouch && <kbd>Enter</kbd>}
      </button>
    </div>
  )
}

function End() {
  const scores = useTrivia((s) => s.scores)
  const order = ranking(scores)
  const youFirst = order[0].id === 'you'
  return (
    <div className="tv-card tv-card--end">
      <p className="tv-card__eyebrow">— FİNAL —</p>
      <h2 className="tv-card__title">{youFirst ? 'ŞAMPİYON SENSİN!' : `${order[0].name} KAZANDI`}</h2>
      <ol className="tv-ranking">
        {order.map((p, i) => (
          <li key={p.id} className={p.id === 'you' ? 'is-you' : ''} style={{ '--c': p.color, animationDelay: `${0.15 + i * 0.12}s` }}>
            <span>{i + 1}.</span>
            <span>{p.name}</span>
            <b>{scores[p.id]}</b>
          </li>
        ))}
      </ol>
      <button className="tv-card__start" onClick={start}>
        ▶ TEKRAR {!isTouch && <kbd>Enter</kbd>}
      </button>
    </div>
  )
}

export default function TriviaOverlay() {
  const phase = useTrivia((s) => s.phase)
  const host = useTrivia((s) => s.host)
  const [flash, setFlash] = useState(null)

  // flash green / red on the reveal
  useEffect(
    () =>
      useTrivia.subscribe((s, prev) => {
        if (s.phase === 'reveal' && prev.phase === 'question') {
          setFlash(s.answers.you === s.list[s.index].correct ? 'win' : 'lose')
          setTimeout(() => setFlash(null), 700)
        }
      }),
    []
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Escape') leave()
      else if (e.code === 'Enter') {
        const p = useTrivia.getState().phase
        if (p === 'intro' || p === 'end') start()
        else if (p === 'reveal') useTrivia.getState().next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="tv-ui">
      <button className="arc-exit" onClick={leave}>
        ← SALONA DÖN
      </button>
      {phase !== 'intro' && <Scoreboard />}
      {flash && <div className={`xox-flash xox-flash--${flash}`} aria-hidden />}
      <p className="xox-bubble tv-host" key={host}>
        <b>ZORP:</b> {host}
      </p>
      {phase === 'intro' && <Intro />}
      {(phase === 'question' || phase === 'reveal') && <Question />}
      {phase === 'end' && <End />}
    </div>
  )
}
