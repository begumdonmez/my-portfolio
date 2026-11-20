import './Hero.css'

export default function Hero({ visible }) {
  return (
    <main className={`hero ${visible ? 'hero--visible' : ''}`}>
      <header className="hero__top">
        <span>Begüm Dönmez</span>
        <span className="hero__muted">Portfolio — 2026</span>
      </header>

      <div className="hero__main">
        <h1 className="hero__title">
          <span>Begüm</span>
          <span>Dönmez</span>
        </h1>
      </div>

      <p className="hero__hint">imleci gezdir</p>
    </main>
  )
}
