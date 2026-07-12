# Ders 2.6 — Oda: Radyo, Kasetler, Bilgisayar

> 🎯 **Bu dersin sonunda:** Kapı açılacak, oda yaşayacak: istasyon değiştiren radyo, kendi sesinle
> konuşan kasetler, projelerini gösteren bilgisayar.

---

## 📖 Bölüm 1: Kapı ve kesintisiz geçiş

- Kapı GLB'si: origin MENTEŞEDE → E → `targetRotY` lerp (artık ezberindeki desen).
- Oda, koridorun fiziksel devamında modellenmiş/kurulmuş — kapı açılınca İÇERİ YÜRÜRSÜN.
  **Yükleme ekranı YOK** (plan). Bunu mümkün kılan şey poly bütçesi (~5-10k): tüm dünya baştan
  bellekte. Bütçe disiplininin ödülü bu andır.
- Kapıdan geçince `state = State.ROOM` (tetik: oyuncu z'si eşiği geçti — görünmez çizgi).

## 📖 Bölüm 2: Radyo — PositionalAudio

Web Audio + Three.js: sesin 3D konumu olur, yaklaştıkça yükselir (mekân hissi):

```js
const listener = new THREE.AudioListener();   // kulak — kameraya takılır
camera.add(listener);

const radioSound = new THREE.PositionalAudio(listener);
radioSound.setRefDistance(1.5);   // bu mesafede tam ses, uzaklaştıkça kısılır
radioMesh.add(radioSound);        // ses radyonun İÇİNDEN gelir

const audioLoader = new THREE.AudioLoader();
audioLoader.load(stations[current].file, (buffer) => {
  radioSound.setBuffer(buffer);
  radioSound.setLoop(true);
  radioSound.play();
});
```

İstasyon değiştirme (E):
1. Çalanı durdur → **parazit efekti** çal (kısa `static.mp3`, normal `THREE.Audio` — konumsuz) →
   yeni istasyonu yükle-çal.
2. Altyazı şeridinde: *"Now playing: <şarkı adı>"* (istasyon listesi + adlar `songs.json`
   yapısına uygun bir dizide — Faz 3'te dosyaya taşınacak).
3. **Telif:** gerçek şarkı mp3'ü YOK — telifsiz parçalar/kendi kayıtların + köşede
   "gerçek playlist'im" Spotify linki (plan kararı).

## 📖 Bölüm 3: Kasetler — deneyimin kalbi

Kaset = tek model + el yazısı etiket texture'ı ("about me", "my journey"... — Ders 2.5 kalıbı).

Akış: E (kasete) → kaset çalara lerp'le taşınır → "takılma" klik sesi → **kendi sesinle kayıt** başlar
→ altyazı senkron akar.

Kurallar (plandan):
- Her kaset 30-90 saniye. (Uzun anlatı = terk edilen anlatı.)
- Yeni kaset takılınca önceki KESİLİR (çakışma yok — tek `currentTape` referansı tut).
- Ses `THREE.Audio` (konumsuz) olabilir — anlatım "kafanın içinde" hissi; radyo konumsal kalır, kontrast güzel.
- Kayıt kalitesi: sessiz/yankısız oda, mikrofona yakın, Audacity ile gürültü temizliği,
  isteğe bağlı hafif tape hiss (kaset ruhu). Ses tasarımı Ders 2.7'de derinleşecek.

## 📖 Bölüm 4: Bilgisayar — tam ekran HTML overlay

Plan kuralı: **3D içinde texture UI YOK.** E (PC'ye) → kamera ekrana zoom (lerp) → zoom bitince
tam ekran HTML overlay açılır:

```html
<div id="computer-overlay" class="computer" hidden>
  <header>
    <h2>Projects</h2>
    <p>ESC to step back</p>
  </header>
  <main id="project-list"><!-- JS doldurur --></main>
</div>
```

- İçerik `projects.json`'dan `fetch` ile gelir ve DOM'a basılır — **Faz 3'teki render kalıbının
  ilk provası.** (fetch + createElement — Faz 3 Ders 3.1'de derinleşecek; burada basit hali.)
- Neden overlay, neden texture değil: metin her çözünürlükte net · linkler GERÇEKTEN tıklanabilir
  (GitHub, canlı demo) · erişilebilir · güncellemesi kolay (JSON değişir, 3D'ye dokunulmaz).
- ESC → overlay kapanır → kamera geri lerp → `state = ROOM`.
- Ekran mesh'ine hafif `emissive` ver — odada "açık monitör" ışığı (ambiyans, bloom'la hoş parlar).

## 📖 Bölüm 5: Diğer objeler + bütçe muhasebesi

Hobi objeleri, posterler → Ders 2.5'in bilgi kartı bileşeni (yeniden kullan!).
**Etkileşim sayımı yap:** diplomalar (tek grup sayılır) + keepsake + kitap + radyo + kasetler
(tek grup) + PC ≈ 6. Sınırdayız — yeni fikir gelirse biri ÇIKMALI. Az ama özenli (plan kuralı).

## ⚠️ Sık yapılan hatalar

1. Ses çalmıyor → autoplay kısıtı: kullanıcı etkileşimi olmadan tarayıcı ses başlatmaz.
   Zaten girişte "sesli deneyim?" sorusu olacak (Ders 2.7) — o tıklama izni açar.
2. `AudioListener`'ı kameraya eklemeyi unutmak → ses var ama konumsal davranmıyor.
3. İki kaset üst üste çalıyor → önce `currentTape?.stop()`, sonra yenisi.
4. Overlay açıkken yürüme kilidi yok → PC başında koridora yürüyen hayalet. `state` disiplinine dön.
5. mp3 dosyaları repoda dev boyutlu → ses export: mono, 96-128kbps yeterli (konuşma için).

## ✏️ Görevler

1. Kapı + oda geometrisi + eşik tetiği.
2. Radyo: 2-3 telifsiz istasyon, parazitli geçiş, "Now playing" şeridi.
3. İlk kaseti KAYDET (telefon + sessiz oda yeter, kusursuzluk bekleme) → kaset akışını kur.
4. PC overlay: zoom + fetch + proje listesi + ESC dönüşü.
5. Etkileşim sayımı: 6'yı aşıyor musun?
6. Commit'ler: `Add door and room`, `Add radio with stations`, `Add tape player`, `Add computer overlay`.

## ✅ Kontrol

1. Yükleme ekranı olmamasını ne mümkün kılıyor?
2. PositionalAudio ile normal Audio farkı? Hangisi radyo, hangisi kaset — neden?
3. PC ekranı neden HTML overlay?
4. Autoplay kısıtı ne, bizim tasarım bunu nasıl çözüyor?
5. Etkileşim sınırı kaç ve neden var?

→ Sonraki ders: [2.7 — Ses ve altyazı sistemi](faz2-ders7-ses-altyazi.md)
