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
  placeX: () => blip(740, 0, 0.09, { gain: 0.045 }),
  placeO: () => blip(392, 0, 0.12, { type: 'triangle', gain: 0.06 }),
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
  start: () => {
    ;[523, 659, 784, 1047].forEach((f, i) => blip(f, i * 0.07, 0.12, { gain: 0.045 }))
  },
}
