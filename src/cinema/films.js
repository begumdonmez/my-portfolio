// The cinema's programme: Begüm's 2D animations and game trailers.
// TODO(Begüm): check the texts (carried over from the old site) and add new films here.
export const FILMS = [
  {
    id: 'boredom',
    title: 'Boredom',
    tr: 'Can Sıkıntısı',
    kind: '2D Animasyon',
    src: '/cinema/boredom.mp4',
    poster: '/cinema/boredom.jpg',
    sound: true,
    loop: false,
    tools: ['Photoshop', '2D Animasyon'],
    text:
      'Hayat biz farkına bile varmadan akıp gidiyor; hep bir şeye yetişmeye, bize söyleneni yapmaya çalışıyoruz. Peki biz aslında ne istiyoruz? 2D animasyon dersinde "can sıkıntısı" temasıyla bir animasyon yapmamız istendi. Ben hayalleri hayatımızın renkleri olarak görüyorum; onlar olmadan renksiz, sıradan ve sıkıcı bir dünyada sıkışıp kalırız. Can sıkıntısını böyle anlattım.',
  },
  {
    id: 'cuphead',
    title: 'Cuphead',
    tr: 'Koşu Animasyonu',
    kind: '2D Animasyon',
    src: '/cinema/cuphead.mp4',
    poster: '/cinema/cuphead.jpg',
    sound: false,
    loop: true,
    tools: ['Photoshop', '2D Animasyon'],
    text:
      "2D animasyon dersi için yaptığım bir Cuphead koşu animasyonu. Hareketi Gravity Falls'tan Dipper Pines referans alınarak çalışıldı; göz detayı benim fikrimdi. Zamanlama, squash & stretch ve klasik Cuphead tarzına uyan oyuncu bir akış üzerine odaklandım.",
  },
  {
    id: 'baymax',
    title: 'Baymax',
    tr: 'Big Hero 6',
    kind: '2D Animasyon',
    src: '/cinema/baymax.mp4',
    poster: '/cinema/baymax.jpg',
    sound: false,
    loop: true,
    tools: ['Illustrator', '2D'],
    text:
      "2D animasyon dersinde en sevdiğim karakterlerden biri olan Big Hero 6'dan Baymax'i çizmek istedim. Tam bitmedi ama çok tatlı olduğu için yine de paylaşmak istedim.",
  },
  {
    id: 'addiction',
    title: 'Addiction',
    tr: 'Oyun Fragmanı',
    kind: 'Oyun',
    src: '/cinema/addiction.mp4',
    poster: '/cinema/addiction.jpg',
    sound: true,
    loop: false,
    tools: ['Unity', 'C#', 'Bullet Hell'],
    text:
      'Madde bağımlılığına dikkat çekmek için geliştirdiğimiz, hızlı mekanikleri ve tematik hikâyesiyle etkileyici bir 2D bullet hell oyunu. 5 kişilik ekipte oyun geliştirici olarak çalıştım.',
  },
  {
    id: 'kimkam',
    title: 'Kim Kam Olmak İster?',
    tr: 'Oyun Fragmanı',
    kind: 'Oyun',
    src: '/cinema/kimkam.mp4',
    poster: '/cinema/kimkam.jpg',
    sound: true,
    loop: false,
    tools: ['Unity', 'C#', 'Bilgi Yarışması'],
    text:
      'Türk mitolojisinden ilham alan etkileşimli bir bilgi yarışması oyunu. Mitoloji dersi için, öğretici içeriği eğlenceli arayüz öğeleriyle birleştirecek şekilde tasarlandı.',
  },
]
