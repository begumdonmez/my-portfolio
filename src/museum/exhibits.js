// What hangs in the museum and where. Texts come from the old portfolio
// (translated); TODO(Begüm): check them, and add 3D models to the pedestals.

export const ROOM = { halfWidth: 6.5, height: 5.6, front: 4, back: -32 }

export const GROUPS = {
  cult: {
    title: 'Cult of the Lamb',
    text: '2D animasyon dersi kapsamında Cult of the Lamb oyunu için karakterler tasarladık. Ben bir tarikat üyesi ve bir boss tasarladım.',
    role: 'Çizer',
    tools: ['Illustrator', 'Karakter Tasarımı', '2D'],
    link: 'https://www.behance.net/gallery/238375447/Cult-of-The-Lamb',
  },
  atheria: {
    title: 'Atheria',
    text: "2D çizim dersi için verilen konsepte göre bir hikâye temeli, artboard'lar, bayrak tasarımı, karakter çizimleri ve bir harita oluşturdum.",
    role: 'Yazar & Çizer',
    tools: ['Photoshop', 'Dünya Tasarımı', 'Senaryo'],
  },
  kadraj: {
    title: 'Kadraj Fanzin',
    text: 'Öğrenci girişimi olarak kurduğumuz bağımsız kampüs fanzini.',
    role: 'Editör & Tasarımcı',
    tools: ['Canva', 'Fanzin', 'Editörlük'],
  },
  bumedya: {
    title: 'Bumedya Gazetesi',
    text: "Ramazan için çıkardığımız bir gazete. Osmanlı'dan Cumhuriyet'e uzanan Ramazan kültürünü hem bilgilendirici hem eğlenceli bir şekilde anlatmak istedik.",
    role: 'Editör & Tasarımcı',
    tools: ['Canva', 'Gazete'],
  },
  posters: {
    title: 'Oyun Afişleri',
    text: 'Ekiplerle geliştirdiğim oyunların afişleri.',
    role: 'Oyun Geliştirici',
    tools: ['Unity', 'C#'],
  },
}

// wall: left (x = -halfWidth), right (x = +halfWidth) or back (z = back).
// at: position along the wall (z for side walls, x for the back wall); h: height in metres.
export const EXHIBITS = [
  // ---- left wall: Cult of the Lamb, then Atheria characters
  { id: 'cult1', img: '/museum/cult1.jpg', group: 'cult', sub: 'Karakter 1', wall: 'left', at: -3, h: 1.45 },
  { id: 'cult2', img: '/museum/cult2.png', group: 'cult', sub: 'Karakter 2', wall: 'left', at: -5.6, h: 1.45 },
  { id: 'cult3', img: '/museum/cult3.jpg', group: 'cult', sub: 'Karakter 3', wall: 'left', at: -8.2, h: 1.45 },
  { id: 'cult4', img: '/museum/cult4.jpg', group: 'cult', sub: 'Karakter 4', wall: 'left', at: -10.8, h: 1.45 },
  { id: 'cult5', img: '/museum/cult5.jpg', group: 'cult', sub: 'Karakter 5', wall: 'left', at: -13.4, h: 1.45 },
  { id: 'nereja', img: '/museum/nereja.jpg', group: 'atheria', sub: 'Nereja', wall: 'left', at: -17, h: 1.5 },
  { id: 'glim', img: '/museum/glim.jpg', group: 'atheria', sub: 'Glim', wall: 'left', at: -19.4, h: 1.5 },
  { id: 'brondir', img: '/museum/brondir.jpg', group: 'atheria', sub: 'Brondir', wall: 'left', at: -21.8, h: 1.5 },
  { id: 'aelia', img: '/museum/aelia.jpg', group: 'atheria', sub: 'Aelia', wall: 'left', at: -24.2, h: 1.5 },
  { id: 'xgran', img: '/museum/xgran.jpg', group: 'atheria', sub: 'Xgran', wall: 'left', at: -26.6, h: 1.5 },
  { id: 'elara', img: '/museum/elara.jpg', group: 'atheria', sub: 'Elara', wall: 'left', at: -29, h: 1.5 },

  // ---- back wall: the world of Atheria
  { id: 'harita', img: '/museum/harita.png', group: 'atheria', sub: 'Harita', wall: 'back', at: -5.2, h: 2.4 },
  { id: 'artboard1', img: '/museum/artboard1.png', group: 'atheria', sub: 'Artboard 1', wall: 'back', at: -2.9, h: 1.55 },
  { id: 'atheria', img: '/museum/atheria.png', group: 'atheria', sub: 'Arayüz', wall: 'back', at: 0, h: 2, y: 2.5 },
  { id: 'artboard2', img: '/museum/artboard2.png', group: 'atheria', sub: 'Artboard 2', wall: 'back', at: 2.9, h: 1.55 },
  { id: 'flag', img: '/museum/flag.png', group: 'atheria', sub: 'Bayrak', wall: 'back', at: 5.1, h: 1.5 },

  // ---- right wall: fanzines, newspaper, game posters
  { id: 'kadraj1', img: '/museum/kadraj1.jpg', group: 'kadraj', sub: 'Sayı 1', wall: 'right', at: -3, h: 1.3, text: "Kampüs medyasını ve yaratıcı hikâye anlatımını desteklemek için öğrenci girişimi olarak kurulan bağımsız haber kaynağı Kadraj'ın ilk sayısı." },
  { id: 'kadraj2', img: '/museum/kadraj2.jpg', group: 'kadraj', sub: 'Sayı 2 · Cadılar Bayramı', wall: 'right', at: -5.8, h: 1.3, text: "Özel günler için özel sayılar çıkarmaya karar verdik. Cadılar Bayramı'na uygun illüstrasyon ve yazıları bir araya getirdik. Şaka mı şeker mi!" },
  { id: 'kadraj3', img: '/museum/kadraj3.jpg', group: 'kadraj', sub: 'Sayı 3 · 29 Ekim', wall: 'right', at: -8.6, h: 1.3, text: "Bizim için çok önemli olan Cumhuriyet Bayramı'nı kutladığımız özel sayı. Bize Cumhuriyeti armağan eden atalarımıza sonsuz minnetle." },
  { id: 'kadraj4', img: '/museum/kadraj4.jpg', group: 'kadraj', sub: 'Sayı 4 · Atatürk', wall: 'right', at: -11.2, h: 1.6, text: "Değerli önderimiz Mustafa Kemal Atatürk'ün anısına. Saygı ve minnetle! 1881 – 199∞" },
  { id: 'kadraj5', img: '/museum/kadraj5.jpg', group: 'kadraj', sub: 'Sayı 5 · Sonbahar', wall: 'right', at: -13.8, h: 1.3, text: 'Rengârenk, sonbahar temalı sayımız.' },
  { id: 'kadraj6', img: '/museum/kadraj6.jpg', group: 'kadraj', sub: 'Sayı 6', wall: 'right', at: -16.6, h: 1.3, text: 'Her sayıyı daha özel yapmak için elimizden geleni yaptık. Bu sayıda Spotify hesabımız üzerinden okurlarla etkileşime girmek istedim.' },
  { id: 'bumedya', img: '/museum/bumedya.jpg', group: 'bumedya', sub: 'Ramazan Sayısı', wall: 'right', at: -19.6, h: 1.7 },
  { id: 'kepler', img: '/museum/kepler.png', group: 'posters', sub: 'GStellar Recon: Kepler', wall: 'right', at: -22.6, h: 1.25, text: 'Stratejik oynanışa sahip 2D kuşbakışı bir kule savunma oyunu. 6 kişilik ekipte oyun geliştirici olarak çalıştım.' },
  { id: 'ecoguardian', img: '/museum/ecoguardian.png', group: 'posters', sub: 'Eco Guardian', wall: 'right', at: -25.1, h: 1.2, text: 'Kirliliğin yaban hayatına etkisini etkileşimli oynanışla gösteren, çevre bilinci odaklı 2D kuşbakışı bir prototip.' },
  { id: 'addiction', img: '/museum/addiction.png', group: 'posters', sub: 'Addiction', wall: 'right', at: -27.6, h: 1.2, text: 'Madde bağımlılığına dikkat çekmek için geliştirdiğimiz 2D bullet hell oyunu. Fragmanı sinemada!' },
  { id: 'kimkam', img: '/museum/kimkam.jpg', group: 'posters', sub: 'Kim Kam Olmak İster?', wall: 'right', at: -30, h: 1.2, text: 'Türk mitolojisinden ilham alan bir bilgi yarışması oyunu. Fragmanı sinemada!' },
]

// section titles painted above each group of works
export const SECTIONS = [
  { title: 'CULT OF THE LAMB', wall: 'left', at: -8.2 },
  { title: 'ATHERIA', wall: 'left', at: -23 },
  { title: 'ATHERIA · DÜNYA', wall: 'back', at: 0 },
  { title: 'KADRAJ FANZİN', wall: 'right', at: -9.8 },
  { title: 'GAZETE & AFİŞ', wall: 'right', at: -25 },
]

// glass cases waiting for 3D models
export const PEDESTALS = [
  { id: 'p1', z: -8, shape: 'knot' },
  { id: 'p2', z: -17, shape: 'ico' },
  { id: 'p3', z: -26, shape: 'torus' },
]

// Where an exhibit hangs, which way it faces, and where to stand to see it.
export function placement(ex) {
  const y = ex.y ?? 2.15
  if (ex.wall === 'left') return { pos: [-ROOM.halfWidth + 0.06, y, ex.at], rotY: Math.PI / 2, normal: [1, 0, 0] }
  if (ex.wall === 'right') return { pos: [ROOM.halfWidth - 0.06, y, ex.at], rotY: -Math.PI / 2, normal: [-1, 0, 0] }
  return { pos: [ex.at, y + 0.25, ROOM.back + 0.06], rotY: 0, normal: [0, 0, 1] }
}
