// Every playable cabinet in the arcade. Add a game by adding an entry here.
// `side`/`slot` decide where it stands in the hall (slot 0 is nearest the door).
//
// TODO(Begüm): fill in role / duration / team for each game, and check the
// descriptions — they were carried over from the old site.
export const GAMES = [
  {
    id: 'sultanahmet',
    title: 'Sultanahmet',
    subtitle: 'Tarih Katmanları',
    colors: ['#2ec4b6', '#f2c14e'],
    cover: '/arcade/covers/sultanahmet.jpg',
    video: null,
    build: '/webgl/sultanahmet/index.html',
    buildSize: [960, 600],
    heavy: '~190 MB',
    side: 'left',
    slot: 0,
    description:
      "Sultanahmet'in tarih katmanlarını 3D olarak keşfettiğin interaktif bir WebGL deneyimi. Yeniden kurulan sokaklarda yürü, gizli detayları bul, tarihi objelerle etkileşime gir.",
    tags: ['Unity', 'WebGL', 'Tarih', '3D Keşif'],
    stats: { Motor: 'Unity', Platform: 'Web (WebGL)' },
  },
  {
    id: 'santas',
    title: "Santa's Workers",
    subtitle: 'Game Jam',
    colors: ['#e63946', '#2a9d8f'],
    cover: '/arcade/covers/santas.jpg',
    video: null,
    build: '/webgl/Santas_Workers/index.html',
    buildSize: [960, 600],
    side: 'left',
    slot: 1,
    description:
      "Noel Baba'nın yardımcılarına mini oyunlarla yardım ettiğin bir yılbaşı oyunu. Oyuncak üret, ren geyiklerini yönet, bulmacaları çöz.",
    tags: ['Unity', 'WebGL', 'Game Jam'],
    stats: { Motor: 'Unity', Platform: 'Web (WebGL)', Tür: 'Game Jam' },
  },
  {
    id: 'ballerino',
    title: 'Ballerino Online',
    subtitle: 'Deck & Kick Action',
    colors: ['#ff5fa2', '#9b5de5'],
    cover: '/arcade/covers/ballerino.jpg',
    video: '/arcade/videos/ballerino.mp4',
    build: '/webgl/ballerino_online/index.html',
    buildSize: [1920, 1080],
    side: 'right',
    slot: 0,
    description:
      'Kart destesiyle oynanan, piksel sanat tarzında bir futbol aksiyon oyunu. Kartlarını seç, şutunu çek, rakibini alt et.',
    tags: ['Unity', 'WebGL', 'Online', 'Pixel Art'],
    stats: { Motor: 'Unity', Platform: 'Web (WebGL)', Ekip: '3 kişi' },
  },
]

// Empty cabinets that fill the hall until more games arrive.
export const SOON = [
  { id: 'soon-2', side: 'left', slot: 2 },
  { id: 'soon-3', side: 'right', slot: 2 },
]

// Cabinet screen: sits on the slope between (0.64, 1.06) and (0.52, 1.58) of the side profile
export const SCREEN = { center: [0, 1.32, 0.585], tilt: -0.227, size: [0.7, 0.46] }

// Hall layout
export const HALL = { halfWidth: 4.5, height: 4.2, front: 2.5, back: -22, wallX: 4.45 }
const SLOT_Z = [-4.5, -9.5, -14.5]

// World transform of a cabinet. Cabinets back onto the side walls and face the aisle.
export function cabinetTransform({ side, slot }) {
  const x = side === 'left' ? -HALL.wallX : HALL.wallX
  const rotY = side === 'left' ? Math.PI / 2 : -Math.PI / 2
  return { position: [x, 0, SLOT_Z[slot]], rotY }
}

// Doors in the side walls that lead to special rooms.
export const DOORS = [{ id: 'xox', title: 'XOX Odası', side: 'right', slot: 1, colors: ['#2de2e6', '#f706cf'] }]

// Doors sit flush in the wall, facing the aisle like the cabinets do.
export function doorTransform({ side, slot }) {
  const x = side === 'left' ? -HALL.halfWidth + 0.01 : HALL.halfWidth - 0.01
  const rotY = side === 'left' ? Math.PI / 2 : -Math.PI / 2
  return { position: [x, 0, SLOT_Z[slot]], rotY }
}
