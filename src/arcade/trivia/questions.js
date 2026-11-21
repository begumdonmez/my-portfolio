// Question bank for ZORP's trivia show. The first option is always the
// correct one; options are shuffled when a round starts.
//
// The BEGÜM questions double as a playful "about me"; their facts come from
// the old portfolio site.
export const QUESTIONS = [
  // ---- about Begüm
  { cat: 'BEGÜM', q: 'Begüm hangi üniversitede okuyor?', a: ['Beykoz Üniversitesi', 'Boğaziçi Üniversitesi', 'Bilkent Üniversitesi', 'İTÜ'] },
  { cat: 'BEGÜM', q: 'Begüm hangi bölümde okuyor?', a: ['Dijital Oyun Tasarımı', 'Bilgisayar Mühendisliği', 'Grafik Tasarım', 'Mimarlık'] },
  { cat: 'BEGÜM', q: 'Begüm hangi kulübün kurucusu ve başkanı?', a: ['Bumedya Medya Kulübü', 'Satranç Kulübü', 'Robotik Kulübü', 'Tiyatro Kulübü'] },
  { cat: 'BEGÜM', q: 'Begüm sektörde hangi tür oyunlarda level designer olarak çalıştı?', a: ['Match-3', 'FPS', 'Yarış', 'MMORPG'] },
  { cat: 'BEGÜM', q: "Begüm'ün üretme tutkusu nereden başladı?", a: ['Yazmak ve hikâye anlatmak', 'Resim yapmak', 'Müzik', 'Fotoğrafçılık'] },
  { cat: 'BEGÜM', q: 'Oyunlar dışında Begüm’ün merak ettiği alanlardan biri hangisi?', a: ['Kriminal psikoloji', 'Astroloji', 'Dalış', 'Bahçecilik'] },
  { cat: 'BEGÜM', q: 'Begüm ses tasarımında hangi programı kullanıyor?', a: ['Reaper', 'FL Studio', 'Ableton Live', 'GarageBand'] },
  { cat: 'BEGÜM', q: 'Ballerino Online’ın çevrim içi oynanışı için ne kullanıldı?', a: ['Photon', 'Steamworks', 'Firebase', 'WebRTC'] },
  { cat: 'BEGÜM', q: "Addiction oyunu neye dikkat çekmek için yapıldı?", a: ['Madde bağımlılığına', 'İklim krizine', 'Sosyal medyaya', 'Uykusuzluğa'] },
  { cat: 'BEGÜM', q: 'Kim Kam Olmak İster? hangi mitolojiden ilham alıyor?', a: ['Türk mitolojisi', 'Yunan mitolojisi', 'İskandinav mitolojisi', 'Mısır mitolojisi'] },
  { cat: 'BEGÜM', q: "Santa's Workers hangi jam için yapıldı?", a: ['Ice Breaking Jam', 'Global Game Jam', "Ludum Dare", 'GMTK Jam'] },
  { cat: 'BEGÜM', q: 'Begüm’ün editörlüğünü yaptığı öğrenci fanzininin adı ne?', a: ['Kadraj', 'Objektif', 'Çerçeve', 'Odak'] },

  // ---- Begüm's games (facts from the arcade cabinets)
  { cat: 'BEGÜM', q: 'Ballerino Online aslında hangi spor üzerine bir oyun?', a: ['Futbol', 'Bale', 'Basketbol', 'Tenis'] },
  { cat: 'BEGÜM', q: 'Ballerino Online kaç kişilik bir ekiple yapıldı?', a: ['3', '1', '5', '12'] },
  { cat: 'BEGÜM', q: "Arcade'deki oyunların hepsi hangi oyun motoruyla yapıldı?", a: ['Unity', 'Unreal Engine', 'Godot', 'GameMaker'] },
  { cat: 'BEGÜM', q: "Santa's Workers nasıl bir projeydi?", a: ['Game jam oyunu', 'Mobil bulmaca', 'VR deneyimi', 'Kısa film'] },
  { cat: 'BEGÜM', q: "Sultanahmet oyununda oyuncu neyi keşfeder?", a: ['Tarih katmanlarını', 'Okyanus tabanını', "Mars'ı", 'Bir rüyayı'] },

  // ---- games
  { cat: 'OYUN', q: 'İlk ticari arcade video oyunu hangisidir?', a: ['Computer Space', 'Pong', 'Pac-Man', 'Space Invaders'] },
  { cat: 'OYUN', q: "Hangisi Pac-Man'in hayaletlerinden biri değildir?", a: ['Sparky', 'Blinky', 'Pinky', 'Clyde'] },
  { cat: 'OYUN', q: 'Tetris ilk olarak hangi ülkede geliştirildi?', a: ['Sovyetler Birliği', 'Japonya', 'ABD', 'Finlandiya'] },
  { cat: 'OYUN', q: 'Oyunlarda "NPC" ne demektir?', a: ['Oyuncu olmayan karakter', 'Yeni oyuncu kartı', 'Ağ bağlantı protokolü', 'Nesne parçacık efekti'] },
  { cat: 'OYUN', q: "XOX'un İngilizcedeki adı nedir?", a: ['Tic-tac-toe', 'Connect Four', 'Checkers', 'Go'] },
  { cat: 'OYUN', q: 'Bir oyunda ekranın saniyede kaç kez çizildiğini gösteren değer hangisi?', a: ['FPS', 'RPG', 'DLC', 'NPC'] },

  // ---- design & 3D
  { cat: 'TASARIM', q: 'Renk çemberinde mavinin karşısındaki (tamamlayıcı) renk hangisi?', a: ['Turuncu', 'Yeşil', 'Mor', 'Kırmızı'] },
  { cat: 'TASARIM', q: '3D modellerin yüzeyini oluşturan çokgenlere ne denir?', a: ['Poligon', 'Sprite', 'Shader', 'Prefab'] },
  { cat: 'TASARIM', q: "Unity'de sahnede tekrar tekrar kullanılabilen hazır nesne şablonuna ne denir?", a: ['Prefab', 'Shader', 'Mesh', 'Collider'] },
  { cat: 'TASARIM', q: 'Bir yüzeyin rengini ve ışığa tepkisini hesaplayan küçük GPU programına ne denir?', a: ['Shader', 'Script', 'Rig', 'Keyframe'] },

  // ---- space
  { cat: 'UZAY', q: 'Güneş sistemindeki en büyük gezegen hangisi?', a: ['Jüpiter', 'Satürn', 'Neptün', 'Dünya'] },
  { cat: 'UZAY', q: "Ay'a ayak basan ilk insan kimdir?", a: ['Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'Michael Collins'] },
  { cat: 'UZAY', q: 'Kuzey ışıklarının bilimsel adı nedir?', a: ['Aurora Borealis', 'Aurora Australis', 'Nebula', 'Süpernova'] },
  { cat: 'UZAY', q: "Küçük Prens'in geldiği asteroidin adı nedir?", a: ['B-612', 'X-42', 'M-31', 'K-9'] },
  { cat: 'UZAY', q: 'Hangi gezegene "Kızıl Gezegen" denir?', a: ['Mars', 'Venüs', 'Merkür', 'Jüpiter'] },
  { cat: 'UZAY', q: 'Işığın boşluktaki hızı yaklaşık kaçtır?', a: ['300.000 km/s', '30.000 km/s', '3.000 km/s', '3.000.000 km/s'] },
]
