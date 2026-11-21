// Tiny event bus for the XOX room's juice: impacts, wins, shake.
// Game state lives in the store; this only carries momentary effects.
const listeners = {}

export const fx = {
  on(event, fn) {
    ;(listeners[event] ||= new Set()).add(fn)
    return () => listeners[event].delete(fn)
  },
  emit(event, payload) {
    listeners[event]?.forEach((fn) => fn(payload))
  },
  shake: { value: 0 }, // camera shake amount, decays in the camera
}

export const vibrate = (pattern) => {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* not supported */
  }
}
