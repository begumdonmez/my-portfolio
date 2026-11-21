import { useEffect } from 'react'
import { useXox } from './store'
import { fx, vibrate } from './fx'
import { BOARD, CYAN, PINK, YELLOW, cellPos } from './layout'
import { sfx } from '../sound'
import { Rings, Sparks } from './Particles'

// Turns game moves into timed effects. A move doesn't "land" when you click:
// your X lands when it hits the wall, ROBO's O when its beam reaches the cell.
// Everything satisfying (sparks, rings, shake, sound, buzz) fires at that moment.

const X_FLIGHT = 380 // ms, matches the throw animation
const O_DRAW = 150
const CONFETTI = ['#f706cf', '#2de2e6', '#ffe66d', '#7dff8a', '#ff7a45', '#ffffff']

// ---------- the director: listens to the game and schedules the effects
export default function Effects() {
  useEffect(() => {
    let timers = []
    const later = (ms, fn) => timers.push(setTimeout(fn, ms))
    const clear = () => {
      timers.forEach(clearTimeout)
      timers = []
    }

    const unsub = useXox.subscribe((s, prev) => {
      // new round or level: drop anything still scheduled
      if (!s.outcome && prev.outcome) clear()
      if (s.board.every((v) => !v) && prev.board.some(Boolean)) clear()

      if (s.last === null || s.last === prev.last || !s.board[s.last]) return
      const index = s.last
      const mark = s.board[index]
      const at = cellPos(index)
      const step = s.board.filter(Boolean).length - 1
      const delay = mark === 'X' ? X_FLIGHT : O_DRAW

      if (mark === 'X') sfx.throwX()
      else sfx.laser()

      later(delay, () => {
        const c = mark === 'X' ? PINK : CYAN
        fx.emit('impact', { index, mark })
        fx.emit('burst', { at, colors: [c, '#ffffff'], count: mark === 'X' ? 46 : 30, speed: mark === 'X' ? 5 : 3.4 })
        fx.emit('ring', { at, color: c })
        fx.shake.value = Math.max(fx.shake.value, mark === 'X' ? 0.55 : 0.25)
        mark === 'X' ? sfx.hitX(step) : sfx.hitO(step)
        if (mark === 'X') vibrate(14)
      })

      const outcome = s.outcome
      if (!outcome) return
      const base = delay + 220
      if (!outcome.line) {
        later(base, () => {
          fx.emit('draw')
          fx.emit('ring', { at: cellPos(4), color: '#ffffff', size: 3 })
          sfx.draw()
        })
        return
      }
      // light the winning cells one by one, then the finale
      outcome.line.forEach((cell, k) =>
        later(base + k * 170, () => {
          fx.emit('winCell', { index: cell, k })
          fx.emit('ring', { at: cellPos(cell), color: YELLOW, size: 1.3 })
          fx.emit('burst', { at: cellPos(cell), colors: [YELLOW, '#ffffff'], count: 24, speed: 3 })
          fx.shake.value = Math.max(fx.shake.value, 0.3)
          sfx.winCell(k)
        })
      )
      later(base + 3 * 170 + 120, () => {
        fx.emit('win', { line: outcome.line, mark: outcome.mark })
        if (outcome.mark === 'X') {
          const center = [BOARD.x, BOARD.y, BOARD.z]
          fx.emit('burst', { at: center, colors: CONFETTI, count: 260, speed: 7.5, life: 2.2, gravity: 4.5, size: 0.13, spread: 1.2 })
          fx.shake.value = 1
          sfx.win()
          sfx.confetti()
          vibrate([30, 40, 70])
        } else {
          fx.shake.value = 0.7
          sfx.lose()
          vibrate(90)
        }
      })
    })

    return () => {
      unsub()
      clear()
    }
  }, [])

  return (
    <>
      <Sparks />
      <Rings />
    </>
  )
}
