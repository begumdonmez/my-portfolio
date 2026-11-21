import { create } from 'zustand'
import { EXHIBITS } from './exhibits'

// mode: walk – roaming the gallery
//       approach – walking up to an exhibit you clicked
//       view – camera close to the exhibit, info card open
export const useMuseum = create((set, get) => ({
  mode: 'walk',
  near: null,
  target: null,
  active: null,
  setNear: (id) => get().near !== id && set({ near: id }),
  walkTo: (id) => set({ mode: 'approach', target: id }),
  view: (id) => set({ mode: 'view', active: id, target: null }),
  leave: () => set({ mode: 'walk', active: null }),
  // step to the previous / next work along the walls
  step(dir) {
    const i = EXHIBITS.findIndex((e) => e.id === get().active)
    if (i < 0) return
    set({ active: EXHIBITS[(i + dir + EXHIBITS.length) % EXHIBITS.length].id })
  },
}))

if (import.meta.env.DEV && typeof window !== 'undefined') window.__museum = useMuseum
