import * as THREE from 'three'

// Shared geometry for the XOX room. The board hangs on the back wall.
export const PINK = '#f706cf'
export const CYAN = '#2de2e6'
export const YELLOW = '#ffe66d'

export const ROOM = { halfWidth: 5, height: 6, back: -4, front: 8 }
export const BOARD = { x: 0, y: 2.9, z: ROOM.back + 0.04, cell: 1.3 }
export const ROBO_POS = [3.15, 0, -2.7]

// centre of cell i (row-major, top-left first) on the wall
export const cellPos = (i) => [
  BOARD.x + ((i % 3) - 1) * BOARD.cell,
  BOARD.y - (Math.floor(i / 3) - 1) * BOARD.cell,
  BOARD.z,
]

// world position of ROBO's pointing hand: written by Robo, read by the beam
export const roboHand = new THREE.Vector3()
