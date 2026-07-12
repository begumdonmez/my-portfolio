# Ders 3.3 — Tema Dönüşümü (Sihir Anı) 🏆

> 🎯 **Bu dersin sonunda:** "Evet" diyen ziyaretçinin gözü önünde sayfa scrapbook'a dönüşecek,
> geri dönüş çalışacak, maskot C'ye davet edecek — ve SİTE TAMAM olacak.

---

## 📖 Bölüm 1: Hasat günü — Faz 1'deki yatırım

Ders 1.2'de renkleri değişkenlere koyarken "Faz 3'te ödeyecek" demiştik. Gün geldi.
Dönüşümün çekirdeği tek CSS bloğu:

```css
body.magic {
  --color-bg: #F6EFDF;                       /* defter kağıdı */
  --color-text: #3A3226;                     /* mürekkep kahvesi */
  --color-accent: #E76F51;                   /* scrapbook turuncu-mercanı */
  --font-heading: "Caveat", cursive;         /* el yazısı */
  --texture-paper: url('/assets/textures/paper.webp');
}
```

JS tarafı: `document.body.classList.add('magic')`. Bu kadar. 50 yerde renk değiştirmiyoruz —
5 değişken değiştiriyoruz. (Karar 3'ün kanıtı.)

- El yazısı fontu (Caveat vb.) SADECE magic temada lazım → baştan yükleme, "Evet" anında dinamik ekle:
  `<link>` elemanını JS'le head'e tak. Düz CV kullanıcısı bu fontu hiç indirmez (Faz 1 hız felsefesi korunur).

## 📖 Bölüm 2: Scrapbook dokusu — HTML'e dokunmadan

İskelet AYNI kalır (Ders 3.1'in template'leri!); kabuk `body.magic` altındaki stillerle gelir:

```css
body.magic { background-image: var(--texture-paper); }

body.magic .project-card {
  transform: rotate(-1.2deg);               /* elle yapıştırılmış hafif eğiklik */
  box-shadow: 3px 4px 0 rgb(58 50 38 / 0.2); /* kağıt üstü kağıt gölgesi */
  border: 10px solid #fff;                  /* polaroid çerçeve */
}
body.magic .project-card:nth-child(even) { transform: rotate(1.5deg); }  /* çeşitlilik */

body.magic .project-card::before {
  content: '';
  /* üstte bant şeridi: yarı saydam dikdörtgen, hafif açılı — ::before ile,
     HTML'e eleman EKLEMEDEN */
}
```

- **`::before/::after`** — her elemanın iki bedava dekor katmanı: bant, iğne, köşe kıvrımı...
  HTML iskelet temiz kalır; scrapbook tamamen CSS kabuğu.
- **`nth-child(even)`** — çift sıradakilere farklı açı; "el yapımı" hissi düzensizlikten gelir
  (ama KONTROLLÜ düzensizlik: -1.5° ile +1.5° arası, tutarlı gölgeler).
- Yapışkan notlar: bölüm başlıklarının yanına `::after` ile sarı not kareleri + Caveat yazı.

## 📖 Bölüm 3: Dönüşüm animasyonu — dalga

Plan: sayfa GÖZÜNÜN ÖNÜNDE dönüşür. Anlık sınıf ekleme = ışık düğmesi; biz dalga istiyoruz
(3D'deki ışık dalgasının 2D yankısı — marka bütünlüğü).

Teknik: CSS değişkeni kendisi animlanmaz ama KULLANILDIĞI özellikler animlanır:

```css
body { transition: background-color 0.8s ease; }
.project-card { transition: transform 0.6s ease, box-shadow 0.6s ease, border 0.6s ease; }
```

Dalga — bölümlere sırayla sınıf (Faz 2'nin ışık dalgası kalıbı, DOM'da):

```js
async function transformToMagic() {
  document.body.classList.add('magic');               // değişkenler + genel geçişler başlar
  const sections = document.querySelectorAll('section');
  for (const [i, s] of [...sections].entries()) {
    setTimeout(() => s.classList.add('magic-in'), i * 180);   // yukarıdan aşağı 0.18sn arayla
  }
}
```

```css
section { opacity: 1; }
body.magic section { /* dönüşmüş hal */ }
section.magic-in { animation: sparkle-in 0.5s ease; }   /* beliriş vurgusu */
```

- Geri dönüş: `classList.remove` + aynı dalga ters sırayla — İKİ YÖN de akıcı olmalı (plan: geri alınabilir).

**`prefers-reduced-motion` — pazarlıksız:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```
Hareket hassasiyeti olan kullanıcıya dalga yerine anında sade geçiş. Sihir kapsayıcı olmalı.

## 📖 Bölüm 4: C'ye köprü — merdivenin son basamağı

Dönüşümden ~beş-on saniye sonra (ya da sayfa sonuna scroll'da) maskot bir kez daha konuşur:

> *"Bunu beğendiysen... asıl dünyamı görmek ister misin?"* → **[Kapıyı aç 🚪]** → `/world/`

Merak merdiveni tamam: **sıkıcı → sihirli → metaforik.** Kimse zorlanmadı, herkes davet edildi.

## 📖 Bölüm 5: Son kontrol — Marka Bütünlüğü Listesi (plandan)

- [ ] Maskot üç katmanda da var (A: köşe 2D · B: anlatıcı · C: 3D yoldaş)
- [ ] Turuncu vurgu düz sitede ve 3D UI/altyazılarda
- [ ] Fraunces + Space Grotesk her iki dünyada (3D altyazı dahil)
- [ ] Işık topu sıcak beyaz (hafif turuncu hale)
- [ ] Scrapbook yalnız B + C detay kartlarında (A'da max %10 tek dokunuş)

## ⚠️ Sık yapılan hatalar

1. Scrapbook stillerini `body.magic` dışına yazmak → düz temaya sızar. HER scrapbook kuralı
   `body.magic` altında.
2. Dönüşümde HTML değiştirmek → hayır: iskelet sabit, kabuk CSS. (Değiştiriyorsan mimari bozuluyor.)
3. Aşırı doz → her elemana bant/iğne = karnaval. Az ama isabetli; arada uzaklaşıp bak.
4. `reduced-motion`'ı unutmak → Lighthouse yakalamaz ama gerçek insanlar yaşar. Test:
   DevTools → Rendering → "Emulate prefers-reduced-motion".
5. Geri dönüşü test etmemek → iki yönlü çalışmayan dönüşüm, yarım dönüşümdür.

## ✏️ Görevler

1. `body.magic` değişken seti + dinamik font yükleme.
2. Scrapbook kabuğu: dokular, polaroid kartlar, bantlar, yapışkan notlar (::before/::after ile).
3. Dalga dönüşümü + ters yön + reduced-motion alternatifi.
4. Maskotun C daveti.
5. Marka listesini işaretle; 2-3 kişiye tam turu (A→B→C) test ettir.
6. Commit: `Add magic theme transformation` → PR → main → **YAYIN** 🎉

## ✅ Kontrol

1. Dönüşümün çekirdeği neden sadece birkaç satır? Hangi karar bunu sağladı?
2. `::before/::after` bu derste neyi mümkün kıldı?
3. CSS değişkenleri animlanmazken geçiş nasıl yumuşak oluyor?
4. `prefers-reduced-motion` kimin için, nasıl test edilir?
5. "Kontrollü düzensizlik" ne demek?

---

## 🏆 SİTE TAMAM

Üç katman, tek marka, her satırı senin. Şimdi:
- `git log`'a bak — o liste senin öğrenme günlüğün.
- LinkedIn'de anlat: sadece siteyi değil, SÜRECİ (işe alımcılar süreci sever).
- Ve bu ders klasörü repoda kalsın — bir gün başkasına yol gösterir belki. 📖✨
