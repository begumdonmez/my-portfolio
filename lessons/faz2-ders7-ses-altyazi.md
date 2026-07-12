# Ders 2.7 — Ses ve Altyazı Sistemi

> 🎯 **Bu dersin sonunda:** Girişte ses izni soruluyor, anlatıcı konuşurken müzik kısılıyor
> (ducking), her ses zaman damgalı altyazıyla akıyor olacak.

---

## 📖 Bölüm 1: Ses izni — kapıda nazik soru

Tarayıcı kuralı: kullanıcı etkileşimi olmadan ses YOK (autoplay kısıtı). Bizim çözüm tasarımın
parçası (plan): `/world` girişinde, deneyim başlamadan:

> 🎧 "This experience speaks. Sound on?"  — [Yes, sound on] / [No, subtitles only]

- "Yes" tıklaması = tarayıcıya ses izni + `AudioContext` başlar.
- "No" = deneyim TAM çalışır, sesler çalmaz, altyazılar her şeyi anlatır. Sessiz kullanıcı
  ikinci sınıf DEĞİL — zaten her ses altyazılı (pazarlıksız kural).

```js
startButton.addEventListener('click', () => {
  listener.context.resume();   // AudioContext'i kullanıcı jestiyle başlat
  audioEnabled = true;
  beginExperience();
});
```

## 📖 Bölüm 2: Altyazı — zaman damgalı senkron

Veri yapısı (tapes.json'un çekirdeği):

```js
const tape = {
  audio: '/assets/audio/tape-about-me.mp3',
  captions: [
    { start: 0.0, end: 3.5,  text: "I make games because..." },
    { start: 3.5, end: 8.0,  text: "..." },
  ]
};
```

Senkron — `animate()` içinde her kare:

```js
function updateCaptions(sound, captions) {
  const t = sound.context.currentTime - startedAt;   // kaç saniyedir çalıyor
  const line = captions.find(c => t >= c.start && t < c.end);
  captionEl.textContent = line ? line.text : '';
}
```

- Kalıp tanıdık: **zamana bağlı durum** — ışık dalgası, sıralı polaroidler, şimdi altyazı.
  Aynı beyin kası.
- Zaman damgalarını çıkarma pratiği: Audacity'de kaydı dinlerken cümle sınırlarının saniyelerini
  not al. Zahmetli ama 60-90 saniyelik kayıt için 10 dakika.

Altyazı şeridi (HTML overlay):
```css
.captions {
  position: fixed;
  bottom: 8%;
  left: 50%; translate: -50%;
  max-width: 60ch;                 /* Faz 1'in satır uzunluğu kuralı burada da! */
  font-family: var(--font-body);   /* Space Grotesk — marka 3D'de sürer */
  background: rgb(20 33 61 / 0.8); /* lacivert saydam şerit */
  color: #F5F3EF;
}
```

## 📖 Bölüm 3: Ducking — anlatıcı konuşunca müzik kısılır

```js
// animate() içinde:
const target = narrationPlaying ? 0.15 : radioBaseVolume;
radioSound.setVolume(THREE.MathUtils.lerp(radioSound.getVolume(), target, 3 * delta));
```

- Yine lerp! Ani kısma kulağa "arıza" gibi gelir; 0.3-0.5 saniyelik yumuşak iniş "saygılı radyo" hissi verir.
- `narrationPlaying` bayrağını anlatım start/stop'unda güncelle. Anlatım bitince müzik kendiliğinden yükselir.

## 📖 Bölüm 4: Kayıt zanaatı

- **Ortam:** yankısız oda (dolap arası, battaniye çadırı — gerçek stüdyo hilesi), sessiz saat.
- **Mikrofon:** ağza 10-15cm, hafif YANDAN (patlayan P sesleri direkt üflemesin).
- **Ton:** yazılı metinden OKUMA değil, madde başlıklarından KONUŞMA — samimiyet kasetin ruhu.
  Motivasyon anlatımı ("hayallerini bırakma" teması) tepeden değil, yol arkadaşı tonunda.
- **Audacity işleme sırası:** Noise Reduction (önce 1-2 sn sessizlikten gürültü profili al) →
  Normalize (-3dB) → isteğe bağlı hafif tape hiss (kaset karakteri) → Export: mp3 mono 96-128kbps
  (konuşma için bol yeterli; dosya küçük kalır).
- Her kaset 30-90 sn (plan). Uzadıysa acımadan kes — en iyi editör makastır.

## 📖 Bölüm 5: Ses varlık listesi

| Ses | Tür | Kaynak |
|---|---|---|
| Anlatıcı (koridor) | konuşma | kendi kaydın |
| Kasetler (2-4 adet) | konuşma | kendi kaydın |
| Radyo istasyonları (2-3) | müzik | telifsiz (Free Music Archive, incompetech...) |
| Radyo paraziti | efekt | telifsiz ya da kendin (radyo + mikrofon 😄) |
| Klik/mekanik (kaset takma, kapı) | efekt | telifsiz ya da Foley (kendin kaydet — eğlenceli kısım) |

Eski sitendeki ses efektleri (`public/sounds/` — main'de duruyor) burada yeniden değerlendirilebilir:
`git checkout main -- public/sounds/` ile getir, eleyerek kullan.

## ⚠️ Sık yapılan hatalar

1. `AudioContext` uyarısı konsolda → resume() kullanıcı jestinde çağrılmamış.
2. Altyazı senkronu kayıyor → kendi sayacını tutma; `context.currentTime` referans al.
3. Kayıtta oda yankısı → mikrofon uzak. Yakınlaş, yumuşak yüzeyler ekle.
4. Ducking'i anlık yapmak → lerp'le.
5. Stereo 320kbps konuşma dosyası → gereksiz 5 kat boyut; mono 96-128k.

## ✏️ Görevler

1. Giriş ses sorusu ekranı (iki seçenek de TAM deneyime gider).
2. Altyazı bileşeni + zaman damgalı senkron; kasete ve anlatıcıya bağla.
3. Ducking'i kur, radyo çalarken kaset tak — geçişi DİNLE.
4. Koridor anlatımını kaydet-işle-bağla (Ders 2.4'teki `playNarration` iskeleti şimdi doluyor).
5. Sessiz modda tam tur: altyazılar tek başına deneyimi taşıyor mu?
6. Commit'ler: `Add audio consent gate`, `Add caption system with ducking`.

## ✅ Kontrol

1. Autoplay kısıtı tasarımımızda hangi ekranla çözülüyor?
2. Altyazı senkronu neden `context.currentTime`'a bağlanır?
3. Ducking nedir, neden lerp'li?
4. Konuşma kaydı için mp3 ayarların ne?
5. "Sound off" seçen kullanıcı ne kaybediyor? (Doğru cevap: hiçbir içerik — sadece doku.)

→ Sonraki ders: [2.8 — Kaçış, mobil, performans](faz2-ders8-performans.md)
