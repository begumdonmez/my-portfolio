import { create } from 'zustand'
import { result, robotMove, winsAt } from './logic'

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
  streak: ['Yine mi?! Bu bir seri mi?', 'Devrelerim pes ediyor…', 'Biri fişimi çeksin!'],
  youWin: ['İmkânsız… devrelerim yandı!', 'Peki… bu seferlik.', 'Nasıl yaptın bunu?!'],
  draw: ['Berabere. Saygı duyuyorum.', 'Kimse kazanamadı. Klasik.', 'Denk rakipleriz demek.'],
  blocked: ['Hıh! Fark ettin demek.', 'Grr… planımı bozdun.', 'Bunu unutmayacağım.', 'Gözüm üstünde, insan.'],
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
  mood: 'idle', // idle | think | happy | sad | wow | squint
  say: LINES.hello.medium,
  score: { you: 0, robo: 0, draw: 0 },
  streak: 0, // your wins in a row

  // apply a move and settle the round if it ended
  place(i, mark) {
    const board = [...get().board]
    board[i] = mark
    const r = result(board)
    if (!r) {
      set({ board, last: i, turn: mark === YOU ? ROBO : YOU })
      return false
    }
    const score = { ...get().score }
    let mood, say
    let streak = get().streak
    if (r.mark === YOU) {
      score.you++
      streak = get().streak + 1
      mood = 'sad'
      say = streak >= 3 ? pick(LINES.streak) : pick(LINES.youWin)
    } else if (r.mark === ROBO) {
      score.robo++
      streak = 0
      mood = 'happy'
      say = pick(LINES.robotWins)
    } else {
      score.draw++
      mood = 'wow'
      say = pick(LINES.draw)
    }
    set({ board, last: i, outcome: r, score, streak, mood, say, turn: null })
    return true
  },

  play(i) {
    const s = get()
    if (s.turn !== YOU || s.outcome || s.board[i]) return
    const blocked = winsAt(s.board, i, ROBO) // you just took ROBO's winning cell
    if (s.place(i, YOU)) return
    if (blocked) {
      // let it glare at you for a moment before it thinks again
      clear()
      set({ mood: 'squint', say: pick(LINES.blocked) })
      timer = setTimeout(() => get().robotTurn(), 1300)
      return
    }
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
      streak: 0,
    })
  },

  // entering the room: new table, keep the chosen level
  start() {
    get().setLevel(get().level)
  },
  stop: clear,
}))

if (import.meta.env.DEV && typeof window !== 'undefined') window.__xox = useXox
