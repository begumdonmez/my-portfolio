import { useEffect, useMemo, useState } from 'react'
import { DOORS, GAMES } from './games'
import { useArcade } from './store'
import { sfx } from './sound'

const byId = Object.fromEntries(GAMES.map((g) => [g.id, g]))
const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

function Prompt() {
  const near = useArcade((s) => s.near)
  const mode = useArcade((s) => s.mode)
  if (!near || mode !== 'walk') return null
  if (near.startsWith('door:')) {
    const door = DOORS.find((d) => `door:${d.id}` === near)
    return (
      <button
        className="arc-prompt arc-prompt--door"
        onClick={() => {
          sfx.door()
          useArcade.getState().goRoom(door.id)
        }}
      >
        ODAYA GİR {!isTouch && <kbd>E</kbd>}
        <small>{door.title}</small>
      </button>
    )
  }
  const game = byId[near]
  return (
    <button
      className="arc-prompt"
      onClick={() => {
        sfx.coin()
        useArcade.getState().insertCoin(near)
      }}
    >
      <span className="arc-prompt__coin" aria-hidden />
      JETON AT {!isTouch && <kbd>E</kbd>}
      <small>{game.title}</small>
    </button>
  )
}

const MENU = [
  { id: 'play', label: '▶ OYNA' },
  { id: 'info', label: 'i BİLGİ' },
  { id: 'video', label: '■ VİDEO' },
  { id: 'back', label: '← GERİ' },
]

function Menu({ game }) {
  const [index, setIndex] = useState(0)

  const choose = (id) => {
    if (id === 'back') {
      sfx.back()
      useArcade.getState().leaveCabinet()
      return
    }
    id === 'play' ? sfx.start() : sfx.select()
    useArcade.getState().open(id)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        setIndex((i) => (i + 1) % MENU.length)
        sfx.hover()
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        setIndex((i) => (i + MENU.length - 1) % MENU.length)
        sfx.hover()
      } else if (e.code === 'Enter' || e.code === 'Space') {
        setIndex((i) => {
          choose(MENU[i].id)
          return i
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="arc-screen" style={{ '--c1': game.colors[0], '--c2': game.colors[1] }}>
      <p className="arc-screen__eyebrow">{game.subtitle}</p>
      <h2 className="arc-screen__title">{game.title}</h2>
      <ul className="arc-menu">
        {MENU.map((m, i) => (
          <li key={m.id}>
            <button
              className={i === index ? 'is-selected' : ''}
              onMouseEnter={() => {
                if (i !== index) sfx.hover()
                setIndex(i)
              }}
              onClick={() => choose(m.id)}
            >
              {m.label}
            </button>
          </li>
        ))}
      </ul>
      {!isTouch && <p className="arc-screen__hint">↑ ↓ seç · Enter onayla · Esc geri</p>}
    </div>
  )
}

function Info({ game }) {
  return (
    <div className="arc-panel" style={{ '--c1': game.colors[0], '--c2': game.colors[1] }}>
      <p className="arc-panel__eyebrow">— HIGH SCORE —</p>
      <h2 className="arc-panel__title">{game.title}</h2>
      <table className="arc-table">
        <tbody>
          {Object.entries(game.stats).map(([k, v], i) => (
            <tr key={k}>
              <td>{String(i + 1).padStart(2, '0')}</td>
              <td>{k}</td>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="arc-panel__text">{game.description}</p>
      <div className="arc-tags">
        {game.tags.map((t) => (
          <span key={t}>#{t}</span>
        ))}
      </div>
      {game.link && (
        <a className="arc-link" href={game.link} target="_blank" rel="noreferrer">
          itch.io'da gör ↗
        </a>
      )}
      <BackButton />
    </div>
  )
}

function Video({ game }) {
  return (
    <div className="arc-panel arc-panel--wide" style={{ '--c1': game.colors[0], '--c2': game.colors[1] }}>
      <h2 className="arc-panel__title">{game.title}</h2>
      {game.video ? (
        <video className="arc-video" src={game.video} controls autoPlay playsInline />
      ) : (
        <div className="arc-video arc-video--empty" style={{ backgroundImage: `url(${game.cover})` }}>
          <span>VİDEO YAKINDA</span>
        </div>
      )}
      <BackButton />
    </div>
  )
}

function BackButton() {
  return (
    <button
      className="arc-back"
      onClick={() => {
        sfx.back()
        useArcade.getState().backToMenu()
      }}
    >
      ← MENÜ
    </button>
  )
}

// Unity's default WebGL template draws a fixed-size canvas with a footer.
// The builds are served from our own origin, so restyle the page to make the
// canvas fill the frame (Unity then renders at that size).
const UNITY_FILL_CSS = `
  html, body { margin: 0; height: 100%; overflow: hidden; background: #000; }
  #unity-container { position: fixed !important; inset: 0 !important; width: 100% !important;
    height: 100% !important; transform: none !important; left: 0 !important; top: 0 !important; }
  #unity-canvas { width: 100% !important; height: 100% !important; }
  #unity-footer { display: none !important; }
`
function fillUnityTemplate(e) {
  try {
    const doc = e.currentTarget.contentDocument
    if (!doc || doc.getElementById('arcade-fill')) return
    const style = doc.createElement('style')
    style.id = 'arcade-fill'
    style.textContent = UNITY_FILL_CSS
    doc.head.appendChild(style)
    e.currentTarget.contentWindow?.focus()
  } catch {
    /* cross-origin build: leave the template as it is */
  }
}

// The game itself, fitted to the window at its own aspect ratio.
function Play({ game }) {
  const [confirmed, setConfirmed] = useState(!game.heavy && !isTouch)
  const [vw, setVw] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  useEffect(() => {
    const onResize = () => setVw({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // fit the game's aspect ratio into the window below the bar
  const [bw, bh] = game.buildSize
  const bar = 52
  const scale = Math.min(vw.w / bw, (vw.h - bar) / bh)

  const exit = () => {
    sfx.back()
    useArcade.getState().backToMenu()
  }

  return (
    <div className="arc-play">
      <div className="arc-play__bar">
        <span>{game.title}</span>
        <button onClick={exit}>✕ ÇIK</button>
      </div>
      {!confirmed ? (
        <div className="arc-play__confirm">
          {isTouch && <p>Bu oyun masaüstü için tasarlandı; telefonda yavaş çalışabilir.</p>}
          {game.heavy && <p>Oyunun boyutu {game.heavy}. Yüklenmesi biraz sürebilir.</p>}
          <div className="arc-play__actions">
            <button onClick={() => setConfirmed(true)}>▶ YÜKLE VE OYNA</button>
            <button onClick={() => useArcade.getState().open('video')}>■ VİDEO İZLE</button>
          </div>
        </div>
      ) : (
        <div className="arc-play__stage" style={{ width: bw * scale, height: bh * scale }}>
          <p className="arc-play__loading">YÜKLENİYOR…</p>
          <iframe
            title={game.title}
            src={game.build}
            onLoad={fillUnityTemplate}
            allow="fullscreen; autoplay; gamepad"
          />
        </div>
      )}
    </div>
  )
}

export default function Overlay() {
  const mode = useArcade((s) => s.mode)
  const active = useArcade((s) => s.active)
  const game = useMemo(() => byId[active], [active])

  // Escape always steps one level back
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Escape') return
      const s = useArcade.getState()
      if (['info', 'video', 'play'].includes(s.mode)) {
        sfx.back()
        s.backToMenu()
      } else if (s.mode === 'menu' || s.mode === 'coin') {
        sfx.back()
        s.leaveCabinet()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <Prompt />
      {game && mode === 'menu' && <Menu game={game} />}
      {game && mode === 'info' && <Info game={game} />}
      {game && mode === 'video' && <Video game={game} />}
      {game && mode === 'play' && <Play game={game} />}
    </>
  )
}
