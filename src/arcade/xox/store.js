import { create } from 'zustand'
import { result, robotMove } from './logic'
import { sfx } from '../sound'

// You are X, ROBO is O. Who starts alternates every round.
const YOU = 'X'
const ROBO = 'O'

const LINES = {
  hello: {
    easy: 'Selam! Ben ROBO. Bugün yumuşak oynayacağım, söz.',
    medium: 'Selam! Ben ROBO. Bir el atalım mı?',
    hard: 'Beni yenemezsin. Ama denemekte özgürsün.',
  },
  think: ['Hmm…', 'Hesaplıyorum… bip.', 'İlginç hamle.', 'Bir saniye…', 'Devrelerim ısınıyor…'],
  robotWins: ['Bip bop! Kazandım!', 'Makineler 1, insanlar 0.', 'Tekrar dene, insan.'],
  youWin: ['İmkânsız… devrelerim yandı!', 'Peki… bu seferlik.', 'Nasıl yaptın bunu?!'],
  draw: ['Berabere. Saygı duyuyorum.', 'Kimse kazanamadı. Klasik.', 'Denk rakipleriz demek.'],
  yourTurn: ['Sıra sende.', 'Hadi bakalım.', 'Senin hamlen.', 'Bakalım ne yapacaksın.'],
  robotStarts: ['Bu sefer ben başlıyorum.', 'Sıra bende. Hazır mısın?'],
}
const pick = (list) => list[Math.floor(Math.random() * list.length)]

let timer = null
const clear = () => {
  clearTimeout(timer)
  timer = null
}

const fresh = () => ({ board: Array(9).fill(null), outcome: null, last: null })

export const useXox = create((set, get) => ({
  ...fresh(),
  level: 'medium',
  starter: YOU,
  turn: YOU,
  mood: 'idle', // idle | think | happy | sad | wow
  say: LINES.hello.medium,
  score: { you: 0, robo: 0, draw: 0 },

  // apply a move and settle the round if it ended
  place(i, mark) {
    const board = [...get().board]
    board[i] = mark
    mark === YOU ? sfx.placeX() : sfx.placeO()
    const r = result(board)
    if (!r) {
      set({ board, last: i, turn: mark === YOU ? ROBO : YOU })
      return false
    }
    const score = { ...get().score }
    let mood, say
    if (r.mark === YOU) {
      score.you++
      mood = 'sad'
      say = pick(LINES.youWin)
      sfx.win()
    } else if (r.mark === ROBO) {
      score.robo++
      mood = 'happy'
      say = pick(LINES.robotWins)
      sfx.lose()
    } else {
      score.draw++
      mood = 'wow'
      say = pick(LINES.draw)
      sfx.draw()
    }
    set({ board, last: i, outcome: r, score, mood, say, turn: null })
    return true
  },

  play(i) {
    const s = get()
    if (s.turn !== YOU || s.outcome || s.board[i]) return
    if (s.place(i, YOU)) return
    s.robotTurn()
  },

  robotTurn() {
    clear()
    set({ mood: 'think', say: pick(LINES.think) })
    timer = setTimeout(() => {
      const s = get()
      if (s.outcome || s.turn !== ROBO) return
      s.place(robotMove(s.board, ROBO, s.level), ROBO)
      if (!get().outcome) set({ mood: 'idle', say: pick(LINES.yourTurn) })
    }, 650 + Math.random() * 550)
  },

  nextRound() {
    clear()
    const starter = get().starter === YOU ? ROBO : YOU
    set({ ...fresh(), starter, turn: starter, mood: 'idle', say: starter === ROBO ? pick(LINES.robotStarts) : 'Sıra sende.' })
    if (starter === ROBO) get().robotTurn()
  },

  setLevel(level) {
    clear()
    set({
      ...fresh(),
      level,
      starter: YOU,
      turn: YOU,
      mood: 'idle',
      say: LINES.hello[level],
      score: { you: 0, robo: 0, draw: 0 },
    })
  },

  // entering the room: new table, keep the chosen level
  start() {
    get().setLevel(get().level)
  },
  stop: clear,
}))
