# Ders 3.1 — İçeriği JSON'a Taşıma (Refactor Dersi)

> 🎯 **Bu dersin sonunda:** CV içeriği tek kaynakta (`data/`) olacak; sayfa PİKSEL PİKSEL aynı
> görünecek. Refactor'ün tanımı bu: davranış değişmez, yapı iyileşir.

---

## 📖 Bölüm 1: Neden ŞİMDİ? (Karar 2'nin ikinci yarısı)

Faz 1'de "içerik HTML'de" demiştik: JS'e bağımlılık İK sayfasına zarar, ihtiyaç da yoktu (YAGNI).
Artık durum değişti: Katman B aynı içeriği FARKLI sunacak, 3D'deki PC de `projects.json` okuyor.
Bilgi 3 yerde elle tutulamaz — **tek doğruluk kaynağı** artık gerçek ihtiyaç. Ders: mimari karar
"doğru/yanlış" değil "ne zaman" sorusudur.

**Taviz dozu:** Hero + iletişim + PDF butonu HTML'de KALIR (İK'nın ilk ekranı JS'siz de tam çalışır —
progressive enhancement korunur). Listelenen içerik (deneyim, projeler, eğitim, yetenekler) JSON'a gider.

## 📖 Bölüm 2: Şema tasarımı — önce kâğıt

JSON = JavaScript nesne gösterimi. Şemayı koddan ÖNCE tasarla (hangi alanlar? hangileri opsiyonel?):

```json
// data/projects.json
[
  {
    "id": "ballerino",
    "title": "Ballerino Online",
    "cover": "/assets/ballerino-cover.webp",
    "summary": "One-paragraph description...",
    "tech": ["Unity", "C#"],
    "links": { "play": "https://...", "source": "https://..." },
    "screens": ["/assets/ballerino-1.webp"]
  }
]
```

- **`id`** — insan-okur benzersiz anahtar; 3D PC overlay'i ve ileride derin linkler bunu kullanır.
- **`screens`** — CV kartında kullanılmaz, PC overlay'inde kullanılır: aynı veri, farklı sunumlar
  farklı alanları seçer. Tek kaynak felsefesi tam bu.
- JSON kuralları (sıkıdır): anahtarlar çift tırnak, son elemandan sonra virgül YASAK, yorum YASAK.
  Bozuksa `fetch` patlar — editörün kırmızı çizgisine güven.

`cv.json` benzer mantıkla: `experience[]`, `education[]`, `skills[]`.

## 📖 Bölüm 3: fetch + render kalıbı

```js
async function loadCV() {
  try {
    const res = await fetch('/data/cv.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const cv = await res.json();
    renderExperience(cv.experience);
    renderSkills(cv.skills);
  } catch (err) {
    console.error('CV data failed to load:', err);
    // sayfa çökmez: hero zaten HTML'de, liste bölümleri boş kalır
  }
}
```

- **`async/await`** — "sonucu bekle ama tarayıcıyı dondurma." GLB yüklemedeki asenkronluğun aynısı.
- **`try/catch` + `res.ok`** — ağ her zaman başarısız olabilir; kontrolsüz fetch = sessiz boş sayfa.

Render — `<template>` etiketiyle (HTML şablonu HTML'de kalır, JS sadece doldurur):

```html
<template id="exp-template">
  <article>
    <h3></h3>
    <p class="dates"></p>
    <ul class="bullets"></ul>
  </article>
</template>
```

```js
function renderExperience(items) {
  const tpl = document.querySelector('#exp-template');
  const target = document.querySelector('#experience .list');
  for (const item of items) {
    const node = tpl.content.cloneNode(true);          // şablonu kopyala
    node.querySelector('h3').textContent = item.title; // textContent — innerHTML DEĞİL
    node.querySelector('.dates').textContent = item.dates;
    for (const b of item.bullets) {
      const li = document.createElement('li');
      li.textContent = b;
      node.querySelector('.bullets').append(li);
    }
    target.append(node);
  }
}
```

NEDEN'ler:
- **`<template>`** — tarayıcı içini ÇİZMEZ, kopyalanmayı bekler. Şablonun görünümü HTML'de kalır →
  Katman B'de AYNI veriye FARKLI template. Sırrın tamamı bu.
- **`textContent` (innerHTML değil)** — innerHTML string'i HTML olarak yorumlar: veriye karışan
  bir `<script>` çalışabilir (XSS güvenlik açığı). Veri basarken refleks: textContent.
- **`cloneNode(true)`** — true = çocuklarla birlikte (Three.js `clone()` gibi — desen tanıdık).

## 📖 Bölüm 4: Doğrulama — refactor'ün turnusolu

1. Değişiklik ÖNCESİ sayfanın ekran görüntüsünü al.
2. Refactor sonrası karşılaştır: **piksel piksel aynı mı?** Aynıysa refactor başarılı.
3. 3D PC overlay'ini de `projects.json`'a bağla (Ders 2.6'da basit hali vardı — şimdi ortak kaynağa).
4. JSON'da bir alanı değiştir → HEM CV'de HEM 3D'de değişti mi? Tek kaynak kanıtı. ✅

## ⚠️ Sık yapılan hatalar

1. JSON'da son virgül / tek tırnak → `SyntaxError: Unexpected token`. Editör lint'ine bak.
2. innerHTML refleksi → textContent (yukarıdaki güvenlik notu).
3. Hero'yu da JSON'a taşımak → taviz dozunu hatırla: ilk ekran HTML'de kalır.
4. fetch'i `file://` ile test etmek → çalışmaz; yerel sunucu (Ders 1.4'ten beri alışkanlığın).
5. Şemayı kod yazarken uydurmak → önce kâğıtta tasarla; şema değişikliği sonradan pahalı.

## ✏️ Görevler

1. Şemaları kâğıtta tasarla, sonra `cv.json` + `projects.json` (+ `tapes.json`, `songs.json` —
   Faz 2'de kodda duran listeleri de taşı).
2. Template + render fonksiyonları; içeriği HTML'den JSON'a taşı.
3. Ekran görüntüsü karşılaştırması — piksel testi.
4. PC overlay'ini ortak `projects.json`'a bağla; tek kaynak kanıtını yap.
5. Commit: `Move content to JSON data files`.

## ✅ Kontrol

1. JSON'a geçişi neden Faz 1'de yapmadık, şimdi neden yapıyoruz?
2. Hangi içerik HTML'de kaldı, neden?
3. `<template>` ne sağlar — Katman B ile ilişkisi ne?
4. innerHTML tehlikesinin adı ne, savunma ne?
5. Refactor'ün başarı kriteri ne?

→ Sonraki ders: [3.2 — Maskot etkileşimi](faz3-ders2-maskot.md)
