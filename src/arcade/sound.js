// Tiny synthesized sound effects: no audio files to download.
let ctx

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function blip(freq, start, duration, { type = 'square', gain = 0.06, slideTo } = {}) {
  const a = audio()
  if (!a) return
  const t = a.currentTime + start
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration)
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(g).connect(a.destination)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

// short burst of filtered noise, for whooshes and thuds
function noise(start, duration, { gain = 0.08, from = 800, to = 3000, q = 1.2 } = {}) {
  const a = audio()
  if (!a) return
  const t = a.currentTime + start
  const len = Math.ceil(a.sampleRate * duration)
  const buf = a.createBuffer(1, len, a.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  const src = a.createBufferSource()
  src.buffer = buf
  const filter = a.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = q
  filter.frequency.setValueAtTime(from, t)
  filter.frequency.exponentialRampToValueAtTime(to, t + duration)
  const g = a.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + duration * 0.3)
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  src.connect(filter).connect(g).connect(a.destination)
  src.start(t)
  src.stop(t + duration + 0.02)
}

// pentatonic notes: each move in a round climbs one step, so a game plays a little melody
const SCALE = [392, 440, 523, 587, 659, 784, 880, 1047, 1175, 1319]
const note = (step) => SCALE[Math.max(0, Math.min(SCALE.length - 1, step))]

export const sfx = {
  // classic two-note coin
  coin: () => {
    blip(988, 0, 0.08)
    blip(1319, 0.08, 0.35)
  },
  hover: () => blip(660, 0, 0.04, { gain: 0.025, type: 'triangle' }),
  select: () => blip(880, 0, 0.06, { gain: 0.04 }),
  back: () => blip(520, 0, 0.12, { gain: 0.04, slideTo: 260 }),
  door: () => {
    blip(220, 0, 0.25, { type: 'sawtooth', gain: 0.03, slideTo: 440 })
    blip(660, 0.18, 0.2, { type: 'triangle', gain: 0.04 })
  },
  // X: a whoosh as it flies, then a punchy hit tuned to the move number
  throwX: () => noise(0, 0.32, { gain: 0.05, from: 500, to: 4000 }),
  hitX: (step) => {
    noise(0, 0.12, { gain: 0.14, from: 260, to: 90, q: 0.8 })
    blip(note(step), 0, 0.18, { gain: 0.05 })
    blip(note(step) * 2, 0.02, 0.12, { type: 'triangle', gain: 0.03 })
  },
  // O: ROBO's laser, then a softer chime
  laser: () => blip(1800, 0, 0.16, { type: 'sawtooth', gain: 0.025, slideTo: 300 }),
  hitO: (step) => {
    blip(note(step), 0, 0.22, { type: 'triangle', gain: 0.07 })
    blip(note(step) * 1.5, 0.03, 0.18, { type: 'sine', gain: 0.04 })
  },
  // one rising note per winning cell
  winCell: (i) => {
    blip([784, 988, 1175][i] ?? 1175, 0, 0.16, { gain: 0.05 })
    blip(([784, 988, 1175][i] ?? 1175) / 2, 0, 0.2, { type: 'triangle', gain: 0.05 })
  },
  confetti: () => {
    noise(0, 0.5, { gain: 0.06, from: 2000, to: 8000, q: 0.6 })
    ;[1047, 1319, 1568, 2093].forEach((f, i) => blip(f, 0.05 + i * 0.06, 0.12, { type: 'triangle', gain: 0.03 }))
  },
  win: () => {
    ;[523, 659, 784, 1047, 1319].forEach((f, i) => blip(f, i * 0.08, 0.16, { gain: 0.045 }))
  },
  lose: () => {
    ;[494, 440, 392, 330].forEach((f, i) => blip(f, i * 0.14, 0.2, { type: 'triangle', gain: 0.06 }))
  },
  draw: () => {
    blip(587, 0, 0.12, { gain: 0.04 })
    blip(587, 0.16, 0.2, { gain: 0.04 })
  },
  // ---- trivia show
  jingle: () => {
    ;[523, 659, 784, 659, 1047].forEach((f, i) => blip(f, i * 0.09, 0.14, { gain: 0.04 }))
  },
  ask: () => {
    blip(880, 0, 0.08, { type: 'triangle', gain: 0.05 })
    blip(1175, 0.09, 0.14, { type: 'triangle', gain: 0.05 })
  },
  lock: () => blip(1568, 0, 0.06, { type: 'square', gain: 0.025 }),
  tick: (urgent) => blip(urgent ? 1200 : 900, 0, 0.04, { type: 'square', gain: urgent ? 0.04 : 0.025 }),
  correct: () => {
    ;[784, 988, 1175].forEach((f) => blip(f, 0, 0.35, { type: 'triangle', gain: 0.045 }))
    blip(1568, 0.12, 0.3, { gain: 0.03 })
  },
  wrong: () => {
    blip(140, 0, 0.45, { type: 'sawtooth', gain: 0.06 })
    blip(147, 0, 0.45, { type: 'square', gain: 0.03 })
  },
  // ---- cinema
  projector: () => {
    for (let i = 0; i < 14; i++) noise(i * 0.06, 0.03, { gain: 0.05, from: 1800, to: 1200, q: 2 })
  },
  leader: () => blip(1000, 0, 0.12, { type: 'sine', gain: 0.05 }),
  applause: () => {
    for (let i = 0; i < 60; i++) noise(Math.random() * 2.2, 0.05 + Math.random() * 0.04, { gain: 0.03 + Math.random() * 0.04, from: 1500 + Math.random() * 2500, to: 900, q: 0.8 })
  },
  curtain: () => noise(0, 0.9, { gain: 0.035, from: 400, to: 1200, q: 0.5 }),
  start: () => {
    ;[523, 659, 784, 1047].forEach((f, i) => blip(f, i * 0.07, 0.12, { gain: 0.045 }))
  },
}
