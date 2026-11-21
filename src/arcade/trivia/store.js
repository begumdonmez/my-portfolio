import { create } from 'zustand'
import { QUESTIONS } from './questions'

// ZORP's trivia show: you against three alien contestants.
//  phase: intro → question → reveal → (question …) → end
export const LIMIT = 15 // seconds per question
export const ROUND = 7 // questions per game
export const LETTERS = ['A', 'B', 'C', 'D']

export const PLAYERS = [
  { id: 'you', name: 'SEN', color: '#f706cf' },
  { id: 'blip', name: 'BLIP', color: '#7dff8a', acc: 0.72, speed: [3, 9] },
  { id: 'zuu', name: 'ZUU', color: '#b98cff', acc: 0.58, speed: [2, 11] },
  { id: 'krek', name: 'KREK', color: '#ff9a45', acc: 0.42, speed: [1.2, 6] },
]
const ALIENS = PLAYERS.slice(1)

const pick = (list) => list[Math.floor(Math.random() * list.length)]
const shuffle = (list) => {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const HOST = {
  intro: "Hoş geldin, Dünyalı! Ben ZORP. Galaksinin en zor bilgi yarışmasına hazır mısın?",
  ask: ['Soru geliyor!', 'Bakalım bunu kim bilecek!', 'Süre başladı!', 'Bu biraz zor…'],
  right: ['DOĞRU! Seyirciler çıldırıyor!', 'Muhteşem! Bir Dünyalı için fena değil.', 'Evet, evet, EVET!'],
  wrong: (ans) => [`Ahh, yanlış! Doğrusu: ${ans}.`, `Hayır! Cevap ${ans} olacaktı.`],
  timeout: (ans) => [`Süre doldu! Doğrusu: ${ans}.`],
  win: 'Tebrikler! Galaksinin en zekisi sensin!',
  lose: (name) => `${name} kazandı! Dünyalılar biraz daha çalışmalı.`,
}

let timers = []
const later = (ms, fn) => timers.push(setTimeout(fn, ms))
const clear = () => {
  timers.forEach(clearTimeout)
  timers = []
}

const zeroScores = () => Object.fromEntries(PLAYERS.map((p) => [p.id, 0]))

export const useTrivia = create((set, get) => ({
  phase: 'intro',
  list: [], // this game's questions: { cat, q, options, correct }
  index: 0,
  startedAt: 0, // performance.now() when the question appeared
  answers: {}, // player id → option index
  times: {}, // player id → seconds taken
  gained: {}, // points won on the last question
  scores: zeroScores(),
  host: HOST.intro,

  start() {
    clear()
    // three questions about Begüm in every game, the rest mixed
    const own = shuffle(QUESTIONS.filter((q) => q.cat === 'BEGÜM')).slice(0, 3)
    const rest = shuffle(QUESTIONS.filter((q) => q.cat !== 'BEGÜM')).slice(0, ROUND - own.length)
    const list = shuffle([...own, ...rest]).map((q) => {
      const order = shuffle([0, 1, 2, 3])
      return { cat: q.cat, q: q.q, options: order.map((i) => q.a[i]), correct: order.indexOf(0) }
    })
    set({ list, index: 0, scores: zeroScores(), gained: {} })
    get().ask()
  },

  ask() {
    clear()
    set({ phase: 'question', startedAt: performance.now(), answers: {}, times: {}, gained: {}, host: pick(HOST.ask) })
    // each alien locks in at its own pace
    for (const a of ALIENS) {
      const [lo, hi] = a.speed
      later((lo + Math.random() * (hi - lo)) * 1000, () => get().lockAlien(a))
    }
    later(LIMIT * 1000, () => get().reveal())
  },

  lockAlien(a) {
    const s = get()
    if (s.phase !== 'question' || s.answers[a.id] !== undefined) return
    const q = s.list[s.index]
    const wrong = [0, 1, 2, 3].filter((i) => i !== q.correct)
    const choice = Math.random() < a.acc ? q.correct : pick(wrong)
    get().lock(a.id, choice)
  },

  // record an answer; once everyone is in, reveal
  lock(id, choice) {
    const s = get()
    if (s.phase !== 'question' || s.answers[id] !== undefined) return
    const taken = (performance.now() - s.startedAt) / 1000
    set({ answers: { ...s.answers, [id]: choice }, times: { ...s.times, [id]: taken } })
    const answers = get().answers
    if (PLAYERS.every((p) => answers[p.id] !== undefined)) later(700, () => get().reveal())
  },

  answer(choice) {
    const s = get()
    if (s.phase !== 'question' || s.answers.you !== undefined) return
    get().lock('you', choice)
    // the aliens hurry up once you've answered
    for (const a of ALIENS) {
      if (get().answers[a.id] === undefined) later(400 + Math.random() * 1100, () => get().lockAlien(a))
    }
  },

  reveal() {
    const s = get()
    if (s.phase !== 'question') return
    clear()
    const q = s.list[s.index]
    const gained = {}
    const scores = { ...s.scores }
    for (const p of PLAYERS) {
      const ok = s.answers[p.id] === q.correct
      // quicker answers earn a bonus of up to 50
      gained[p.id] = ok ? 100 + Math.round(50 * Math.max(0, 1 - (s.times[p.id] ?? LIMIT) / LIMIT)) : 0
      scores[p.id] += gained[p.id]
    }
    const ans = q.options[q.correct]
    const host =
      s.answers.you === undefined
        ? pick(HOST.timeout(ans))
        : s.answers.you === q.correct
          ? pick(HOST.right)
          : pick(HOST.wrong(ans))
    set({ phase: 'reveal', gained, scores, host })
    later(3600, () => get().next())
  },

  next() {
    const s = get()
    if (s.phase !== 'reveal') return
    clear()
    if (s.index + 1 < s.list.length) {
      set({ index: s.index + 1 })
      get().ask()
      return
    }
    const top = [...PLAYERS].sort((a, b) => s.scores[b.id] - s.scores[a.id])[0]
    set({ phase: 'end', host: top.id === 'you' ? HOST.win : HOST.lose(top.name) })
  },

  reset() {
    clear()
    set({ phase: 'intro', list: [], index: 0, answers: {}, times: {}, gained: {}, scores: zeroScores(), host: HOST.intro })
  },
  stop: clear,
}))

// final standings, best first
export const ranking = (scores) => [...PLAYERS].sort((a, b) => scores[b.id] - scores[a.id])

if (import.meta.env.DEV && typeof window !== 'undefined') window.__trivia = useTrivia
