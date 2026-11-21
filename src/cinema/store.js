import { create } from 'zustand'

// stage: idle (curtains closed) → countdown (old film leader) → playing → ended
export const useCinema = create((set, get) => ({
  film: null, // id of the chosen film
  stage: 'idle',
  paused: false,
  muted: false,
  info: false,
  progress: 0, // 0..1 of the current film

  choose(id) {
    set({ film: id, stage: 'countdown', paused: false, info: false, progress: 0 })
  },
  startFilm: () => get().stage === 'countdown' && set({ stage: 'playing' }),
  ended: () => set({ stage: 'ended', paused: true }),
  togglePause: () => ['playing', 'ended'].includes(get().stage) && set({ paused: !get().paused, stage: 'playing' }),
  toggleMute: () => set({ muted: !get().muted }),
  toggleInfo: () => set({ info: !get().info }),
  stop: () => set({ film: null, stage: 'idle', paused: false, info: false, progress: 0 }),
  setProgress: (p) => set({ progress: p }),
}))

if (import.meta.env.DEV && typeof window !== 'undefined') window.__cinema = useCinema
