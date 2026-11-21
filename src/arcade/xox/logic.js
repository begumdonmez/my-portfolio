// Tic-tac-toe rules and the robot's brain. Board: 9 cells, 'X' | 'O' | null.
export const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

// { mark, line } for a win, { mark: null } for a draw, null while playing
export function result(b) {
  for (const line of LINES) {
    const [a, c, d] = line
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { mark: b[a], line }
  }
  return b.every(Boolean) ? { mark: null, line: null } : null
}

const empty = (b) => b.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0)
const pick = (list) => list[Math.floor(Math.random() * list.length)]

// Perfect play. Prefers faster wins and slower losses.
function minimax(b, me, turn, depth) {
  const r = result(b)
  if (r) return r.mark === me ? 10 - depth : r.mark ? depth - 10 : 0
  const other = turn === 'X' ? 'O' : 'X'
  let best = turn === me ? -Infinity : Infinity
  for (const i of empty(b)) {
    b[i] = turn
    const score = minimax(b, me, other, depth + 1)
    b[i] = null
    best = turn === me ? Math.max(best, score) : Math.min(best, score)
  }
  return best
}

function perfect(b, me) {
  const other = me === 'X' ? 'O' : 'X'
  let bestScore = -Infinity
  let moves = []
  for (const i of empty(b)) {
    b[i] = me
    const score = minimax(b, me, other, 1)
    b[i] = null
    if (score > bestScore) {
      bestScore = score
      moves = [i]
    } else if (score === bestScore) moves.push(i)
  }
  return pick(moves) // vary between equally good moves so games differ
}

// would `mark` win by playing cell i?
export function winsAt(b, i, mark) {
  if (b[i]) return false
  const next = [...b]
  next[i] = mark
  return result(next)?.mark === mark
}

// a move that completes a line for `mark`, if there is one
function finishing(b, mark) {
  for (const i of empty(b)) {
    b[i] = mark
    const won = result(b)?.mark === mark
    b[i] = null
    if (won) return i
  }
  return null
}

export const LEVELS = [
  { id: 'easy', label: 'KOLAY' },
  { id: 'medium', label: 'ORTA' },
  { id: 'hard', label: 'YENİLMEZ' },
]

export function robotMove(b, me, level) {
  const other = me === 'X' ? 'O' : 'X'
  const board = [...b]
  if (level === 'hard') return perfect(board, me)
  if (level === 'medium') {
    // wins and blocks, otherwise plays well most of the time
    const win = finishing(board, me)
    if (win !== null) return win
    const block = finishing(board, other)
    if (block !== null) return block
    return Math.random() < 0.55 ? perfect(board, me) : pick(empty(board))
  }
  // easy: sees an immediate win, otherwise mostly random
  const win = finishing(board, me)
  if (win !== null && Math.random() < 0.7) return win
  return pick(empty(board))
}
