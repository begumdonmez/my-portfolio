// Page scroll progress shared between the DOM and the 3D scene.
// `target` follows the scrollbar; `current` is eased towards it every frame.
export const scroll = { target: 0, current: 0 }

export function bindScroll() {
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    scroll.target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
  }
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  update()
  return () => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
  }
}

// 0 before `a`, 1 after `b`, linear in between
export const range = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)))
export const ease = (t) => t * t * (3 - 2 * t)
