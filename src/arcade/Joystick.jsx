import { useRef, useState } from 'react'
import { input } from './store'

// On-screen thumbstick for touch devices. Writes to input.move (-1..1).
const RADIUS = 46

export default function Joystick() {
  const base = useRef()
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const pointer = useRef(null)

  const update = (e) => {
    const r = base.current.getBoundingClientRect()
    let x = e.clientX - (r.left + r.width / 2)
    let y = e.clientY - (r.top + r.height / 2)
    const len = Math.hypot(x, y)
    if (len > RADIUS) {
      x = (x / len) * RADIUS
      y = (y / len) * RADIUS
    }
    setKnob({ x, y })
    input.move.x = x / RADIUS
    input.move.y = -y / RADIUS
  }

  const end = () => {
    pointer.current = null
    setKnob({ x: 0, y: 0 })
    input.move.x = input.move.y = 0
  }

  return (
    <div
      ref={base}
      className="joystick"
      onPointerDown={(e) => {
        e.stopPropagation()
        pointer.current = e.pointerId
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e)
      }}
      onPointerMove={(e) => pointer.current === e.pointerId && update(e)}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <div className="joystick__knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
    </div>
  )
}
