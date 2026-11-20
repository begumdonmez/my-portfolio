import { create } from 'zustand'

const FADE_MS = 450

// UI + interaction state for the arcade.
//  room: hall | xox – which space we are in
//  mode: walk     – free roaming
//        approach – auto-walking to a cabinet or door the visitor clicked
//        coin     – camera gliding up to the screen after a coin
//        menu     – Play / Info / Video menu on the cabinet
//        info | video | play – the chosen screen
// near / target hold a cabinet id, or `door:<room>` for a door.
export const useArcade = create((set, get) => ({
  room: 'hall',
  fading: false,
  spawn: null, // where the player reappears in the hall after a room
  mode: 'walk',
  near: null, // id of the cabinet in reach
  active: null, // id of the cabinet being used
  target: null, // id we are auto-walking to

  setNear: (id) => get().near !== id && set({ near: id }),
  walkTo: (id) => set({ mode: 'approach', target: id }),
  insertCoin: (id) => set({ mode: 'coin', active: id ?? get().near, target: null }),
  arrived: () => get().mode === 'coin' && set({ mode: 'menu' }),
  open: (mode) => set({ mode }),
  backToMenu: () => set({ mode: 'menu' }),
  leaveCabinet: () => set({ mode: 'walk', active: null }),

  // fade to black, swap the room, fade back in
  goRoom: (room, spawn = null) => {
    if (get().fading) return
    set({ fading: true })
    setTimeout(() => {
      set({ room, spawn, mode: 'walk', near: null, active: null, target: null })
      setTimeout(() => set({ fading: false }), 120)
    }, FADE_MS)
  },
}))

// Raw input, written by keyboard / joystick / drag and read every frame.
// Kept outside React so input never causes re-renders.
export const input = {
  keys: new Set(),
  move: { x: 0, y: 0 }, // joystick, -1..1
  look: { dx: 0, dy: 0 }, // accumulated drag pixels
  dragDistance: 0, // how far the current pointer press has moved
}

// handy for poking at the arcade from the dev console
if (import.meta.env.DEV && typeof window !== 'undefined') window.__arcade = useArcade
