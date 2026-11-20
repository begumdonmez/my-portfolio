import './Intro.css'

const NAME = 'Begüm Dönmez'

// Full-screen black curtain shown while the scene boots. `phase` is
// 'loading' -> 'leaving' -> 'gone'.
export default function Intro({ phase }) {
  if (phase === 'gone') return null

  return (
    <div className={`intro intro--${phase}`} aria-hidden={phase !== 'loading'}>
      <p className="intro__name" aria-label={NAME}>
        {[...NAME].map((ch, i) => (
          <span key={i} style={{ animationDelay: `${120 + i * 55}ms` }}>
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </p>
      <div className="intro__bar">
        <div className="intro__fill" />
      </div>
    </div>
  )
}
