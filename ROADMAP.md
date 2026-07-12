# Portfolyo v3 — Ders Kitabı & Yol Haritası

> Bu dosya projenin hem planı hem ders kitabıdır. Her bölümü sırayla yapacağız.
>
> **Kullanım kuralı:** Kod örnekleri açıklamalarıyla birlikte burada, ama **kopyala-yapıştır yapma.**
> Oku, anla, kitabı kapat, kendin yaz. Yanlış yazarsan zaten öğreniyorsun demektir.
> Kural 2: **Bir faz bitip yayınlanmadan diğerine geçilmez.**

---

## Bölüm 0 — Büyük Resim

Site üç katmanlı bir deneyim:

| Katman | Ne | Nasıl ulaşılır |
|---|---|---|
| **A — Düz CV** | Hızlı, taranabilir, İK dostu tek sayfa | Giriş ekranında Seçenek 1 |
| **B — Sihirli Varyant** | Aynı içerik, scrapbook temasına dönüşür | Katman A'daki maskot tıklanınca |
| **C — 3D Deneyim** | Three.js koridor + oda, "ruhuma açılan kapı" | Giriş ekranında Seçenek 2 |

Giriş ekranı = kırmızı hap / mavi hap seçimi.
Ortak bağ: **maskot figür** (A'da köşede minik, B'de anlatıcı, C'de 3D yoldaş).

**Geliştirme sırası:** Faz 1 (Katman A) → Faz 2 (Katman C) → Faz 3 (Katman B + maskot).

### Mimari kararlar ve NEDENLERİ

Bu bölüm kitabın en önemli kısmı. Kod unutulur, karar verme becerisi kalır.

**Karar 1 — Çok sayfalı yapı (MPA), tek sayfa uygulama (SPA) değil.**
Eski site React SPA'ydı: tek bir `index.html`, tüm içerik JavaScript ile çiziliyordu.
Yeni yapıda her katman kendi HTML dosyası. Neden?
- *Performans:* Tarayıcı bir sayfayı açarken sadece o sayfanın dosyalarını indirir. CV'yi açan İK'cı, 3D dünyanın megabaytlarca modelini/sesini asla indirmez. SPA'da her şey tek pakete girer ya da paketi bölmek için ekstra karmaşıklık gerekir.
- *URL:* Her sayfanın gerçek adresi olur. İK'cıya doğrudan `siten.com/cv` gönderirsin; hap ekranını bile görmez. SPA'da bunun için "router" kütüphanesi gerekir — bizde bedava.
- *Basitlik (YAGNI prensibi):* "You Aren't Gonna Need It" — ihtiyacın olmayan esnekliği bugünden kurma. SPA'nın çözdüğü problem (sayfalar arası durumun korunması, uygulama benzeri akıcılık) bizim sitede yok.

**Karar 2 — Faz 1'de içerik doğrudan HTML'de, JSON'da değil.**
Plan "tek doğruluk kaynağı: JSON" diyor ve bu prensip doğru. Ama JSON'daki içeriği sayfaya basmak için JavaScript gerekir; JS yüklenene kadar sayfa **boştur**. İK sayfası için kabul edilemez: yavaş bağlantıda beyaz ekran, arama motoru için zayıf içerik. Çözüm sıralaması:
- Faz 1: içerik elle HTML'de. Sayfa JS olmadan bile tam çalışır. (Buna *progressive enhancement* denir: temel deneyim herkese, süsler modern tarayıcılara.)
- Faz 3: Katman B geldiğinde aynı içerik iki farklı sunumla gösterilecek — işte o zaman JSON'a taşırız. İhtiyaç doğunca yapılan bu işleme *refactor* denir: davranış aynı kalır, yapı iyileşir.

**Karar 3 — CSS baştan değişkenlerle (custom properties) kurulur.**
Katman B "tema dönüşümü" demek: renkler, dokular, çerçeveler değişecek ama HTML aynı kalacak.
Renkleri her yere elle yazarsak (`color: #14213D` × 50 yer) dönüşüm için 50 yeri değiştirmek gerekir.
Değişken kullanırsak (`color: var(--color-text)`) dönüşüm = tek yerde değişken setini değiştirmek.
Faz 1'de 10 dakikalık disiplin, Faz 3'te günlerce iş tasarrufu.

**Karar 4 — Build aracı yok (Vite/React kaldırıldı).**
Vite, kodu tarayıcıya vermeden önce işleyen bir araçtı (paketleme, küçültme, JSX çevirisi). Düz HTML/CSS/JS için buna gerek yok — dosya neyse tarayıcıya o gider. Öğrenme açısından da doğru: önce web'in ana dilini öğren, araçları sonra. `package.json` silindiği için Vercel de projeyi "statik site" olarak yayınlar: build adımı yok, bozulacak şey yok.

**Karar 5 — `vercel.json` düzenlenecek (Ders 1.7).**
Eski dosyada "hangi adres istenirse istensin `index.html`'i ver" kuralı var (SPA'ların standart ayarı — çünkü SPA'da tek HTML vardır). Bizim yapıda `/cv` isteği `cv/index.html` dosyasına gitmeli; bu kural kalırsa her adres hap ekranını gösterir. Faz 1 sonunda silinecek.

### Klasör yapısı

```
index.html          ← hap seçim ekranı
cv/index.html       ← Katman A (ileride B'ye dönüşür)
world/              ← Katman C (Faz 2'de)
css/base.css        ← ortak: değişkenler, font, reset
css/cv.css          ← Katman A'ya özel stiller
js/                 ← etkileşim kodları
data/               ← Faz 3'te dolacak (cv.json, projects.json, tapes.json, songs.json)
assets/             ← görseller, PDF CV
```

*Neden `cv/index.html`, `cv.html` değil?* Sunucular bir klasör istendiğinde içindeki `index.html`'i verir. Böylece adres `siten.com/cv` olur — `siten.com/cv.html`'den temiz.

*Neden ortak/özel CSS ayrımı?* `base.css` = her sayfanın yüklediği ortak temel (değişkenler, reset, fontlar). `cv.css` = sadece CV sayfasının yükü. Hap ekranı CV'nin stillerini taşımaz. Prensip: **ortak olanı ayır, özel olanı böl.**

### Tasarım sistemi ("Gece Yanığı" paleti)

| Rol | Renk | Not |
|---|---|---|
| Zemin | `#F5F3EF` | kırık beyaz — saf beyazdan yumuşak |
| Metin | `#14213D` | koyu lacivert — saf siyah YASAK (sert kontrast gözü yorar) |
| Vurgu | `#FCA311` | sadece büyük elemanlarda; sayfanın %5-10'unu geçmez |
| Link / küçük vurgu | `#D9880A` | açık zemin üstünde `#FCA311` küçük metinde kontrast testinden geçmez; koyulaştırılmış hali |
| İkincil metin | `#8D99AE` | tarihler, alt bilgiler |

Tipografi: başlıklar **Fraunces**, gövde **Space Grotesk** (Google Fonts). İki fonttan fazlası yasak (görsel gürültü + ekstra indirme).
Bol beyaz alan, minimal animasyon (hafif hover yeterli).

---

# FAZ 1 — Katman A: Düz CV Sitesi

> Hedef: yarın iş başvurusu yapılsa elinde olması gereken, yayınlanmış site.

## Ders 1.1 — HTML iskeleti ve giriş sayfası

### 📖 Konu: HTML belgesi nasıl çalışır?

HTML bir **belge ağacıdır**: etiketler iç içe geçer, tarayıcı bu ağacı (DOM) kurup çizer.
Her sayfanın değişmez iskeleti şudur — ve her satırın bir varlık sebebi var:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Begum Donmez — Game Developer</title>
</head>
<body>
  <h1>...</h1>
</body>
</html>
```

Satır satır NEDEN'ler:

- **`<!DOCTYPE html>`** — Tarayıcıya "bu modern bir belge, standart modda çalış" der. Yazmazsan tarayıcı 90'ların bozuk sayfalarıyla uyumluluk için **quirks mode**'a düşer: box model farklı hesaplanır, CSS'in tuhaf davranır ve sebebini saatlerce bulamazsın.
- **`lang="en"`** — Ekran okuyucular telaffuzu buna göre seçer; Google içeriğin dilini bilir; tarayıcı "çevirmek ister misin?" balonunu doğru gösterir. Site İngilizce olacaksa `en`.
- **`<head>`** — Sayfada *görünmeyen* üst bilgi. `<body>` — görünen her şey.
- **`<meta charset="UTF-8">`** — Karakter kodlaması. Yazmazsan "Begüm" → "BegÃ¼m" olabilir. İlk satırlarda olmalı ki tarayıcı belgeyi baştan doğru okusun.
- **`<meta name="viewport" ...>`** — Mobil tarayıcılar, eski masaüstü-siteleri bozulmasın diye sayfayı 980px genişlikte varsayıp uzaktan gösterir. Bu satır "cihaz genişliğini kullan, 1:1 ölçekle başla" der. Yazmazsan sitin telefonda pul gibi görünür — responsive tasarımın açma düğmesi budur.
- **`<title>`** — Sekme başlığı + Google sonuç başlığı + yer imi adı. İK'cının sekmelerinde kaybolmayacağın yer burası: "Begum Donmez — Game Developer" gibi isim + unvan iyi formüldür.

### 📖 Konu: Link mi buton mu?

Hap ekranındaki iki seçenek **link** (`<a href="...">`) olmalı, `<button>` değil. Kural şu:
- **Bir yere götürüyorsa** → `<a>` (yeni adres, geri tuşu çalışır, sağ tık "yeni sekmede aç" çalışır)
- **Bir şey yapıyorsa** (menü açmak, form göndermek) → `<button>`
Görünüşü CSS'in işi — bir `<a>`'yı dev bir hap gibi gösterebiliriz.

### ✏️ Yazılacak kod: `index.html` (hap ekranı)

Gövde yapısı kabaca şöyle (önce oku-anla, sonra kendin yaz):

```html
<body>
  <main class="gate">
    <h1>Begum Donmez</h1>
    <p>Game Developer & Designer</p>

    <nav class="gate-choices" aria-label="Site version selection">
      <a class="pill pill--blue" href="/cv/">
        <!-- düz CV'ye davet metni -->
      </a>
      <a class="pill pill--red" href="/world/">
        <!-- 3D deneyime davet metni -->
      </a>
    </nav>
  </main>
</body>
```

NEDEN'ler:
- **`<main>`** — "sayfanın ana içeriği bu" işareti. Ekran okuyucu kullanıcısı menüleri atlayıp doğrudan buraya zıplayabilir.
- **`<h1>`** — Her sayfada TAM BİR TANE olur. Sayfanın konusu ne ise h1 odur.
- **`<nav aria-label="...">`** — Bu bir gezinme bölgesi; `aria-label` ekran okuyucuya bölgenin adını söyler.
- **`class="pill pill--blue"`** — İki sınıf: `pill` ortak görünüm, `pill--blue` renk farkı. Bu adlandırma stiline BEM denir (`blok--varyant`); ortak stili bir kez yazarsın, fark için küçük ek yazarsın. Kod tekrarını önler.
- **`href="/cv/"`** — Baştaki `/` = "kökten başla" (mutlak yol). Nereden linklenirse linklensin hep aynı yere gider.

### ✅ Ders 1.1 görevleri

1. Klasör yapısını oluştur (boş dosyalarla).
2. `index.html` iskeletini ve hap ekranı gövdesini yaz — kitaba bakmadan dene, takılınca bak.
3. Dosyayı tarayıcıda aç (çift tık yeter). Çirkin olacak — sorun değil, stil sonraki ders.
4. Commit: `Add entry gate page skeleton` gibi bir mesajla.

---

## Ders 1.2 — CSS temelleri ve tasarım sistemi

### 📖 Konu: CSS nasıl düşünür?

CSS = **seçici + kural**. `h1 { color: red; }` → "tüm h1'lerin rengi kırmızı".
Üç kavram her şeyin temeli:

1. **Cascade (basamaklama):** Aynı elemana birden çok kural değerse, daha *özgül* (spesifik) olan kazanır; eşitse sonra yazılan kazanır.
2. **Inheritance (kalıtım):** Bazı özellikler (yazı rengi, font) ebeveynden çocuğa geçer. `body`'ye font verirsen her şey onu kullanır.
3. **Box model:** Her eleman bir kutudur: içerik → padding (iç boşluk) → border → margin (dış boşluk).

### 📖 Konu: CSS değişkenleri — tema sisteminin kalbi

```css
:root {
  /* Renkler — "Gece Yanığı" */
  --color-bg: #F5F3EF;
  --color-text: #14213D;
  --color-accent: #FCA311;
  --color-accent-dark: #D9880A;
  --color-muted: #8D99AE;

  /* Tipografi */
  --font-heading: "Fraunces", serif;
  --font-body: "Space Grotesk", sans-serif;
}
```

Kullanımı: `color: var(--color-text);`

NEDEN'ler:
- **`:root`** = `<html>` elemanı. En tepede tanımlanan değişken, kalıtımla her yere ulaşır.
- **İsimlendirme role göre, renge göre değil:** `--color-orange` değil `--color-accent`. Çünkü Katman B'de vurgu rengi belki pembe olacak — değişkenin adı hâlâ doğru kalır, sadece değeri değişir. **Tema dönüşümü tam olarak bu satırların değerlerini değiştirmekten ibaret olacak.**
- **Fontların sonundaki `serif` / `sans-serif`:** yedek (fallback). Google Fonts yüklenemezse tarayıcı en yakın sistem fontunu kullanır, sayfa asla fontsuz kalmaz.

### 📖 Konu: Reset — tarayıcıların varsayılanlarını sıfırlamak

Her tarayıcı elemanlara kendi varsayılan stillerini verir (h1 margin'i, liste girintisi...) ve bunlar tarayıcıdan tarayıcıya azıcık farklıdır. Kontrol bizde olsun diye baştan sıfırlarız:

```css
*, *::before, *::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

img {
  max-width: 100%;
  display: block;
}
```

NEDEN'ler:
- **`box-sizing: border-box`** — Varsayılanda `width: 300px` demek "içerik 300px, padding ve border HARİÇ" demek; kutu beklediğinden büyük çıkar. `border-box` ile 300px = kutunun gerçek dış genişliği. Modern CSS'in 1 numaralı kuralı; herkes bunu ilk satırda yapar.
- **`margin: 0`** — Tüm varsayılan boşlukları sıfırla; boşluğu nerede istiyorsak bilinçli olarak biz veririz.
- **`img { max-width: 100% }`** — Görsel, kabından asla taşamaz. Responsive'in temel taşı.

### 📖 Konu: Google Fonts nasıl yüklenir?

`<head>` içine link etiketi (Google Fonts sitesi üretir). Dikkat edilecekler:
- **Sadece kullanacağın ağırlıkları seç** (ör. 400, 600, 700). Her ağırlık ayrı dosya = ayrı indirme.
- Linkte `display=swap` olsun: font inene kadar yedek fontla metni GÖSTER (boş bekletme). Kullanıcı yazıyı hemen okur, font gelince değişir.

### ✏️ Yazılacak kod: hap ekranı stili (`base.css` + biraz sayfa stili)

Ortalamanın modern yolu — flexbox:

```css
body {
  min-height: 100vh;              /* gövde en az ekran boyu olsun */
  display: flex;
  flex-direction: column;         /* çocukları dikey diz */
  align-items: center;            /* yatayda ortala */
  justify-content: center;        /* dikeyde ortala */
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
}
```

NEDEN'ler:
- **`100vh`** = viewport yüksekliğinin %100'ü. Bu olmadan body içeriği kadar kısadır, "dikeyde ortala" diyecek yer olmaz.
- **Flexbox** tek boyutlu dizilim aracı (satır YA DA sütun). İki boyutlu ızgara gerekince Grid kullanacağız (projeler bölümünde).
- Hover geçişi için: `transition: transform 0.2s ease;` + `:hover { transform: translateY(-2px); }` gibi ufak dokunuş. *Neden `transform`?* Tarayıcı transform'u ucuza çizer (GPU); `top/left` değiştirmek her karede sayfa düzenini yeniden hesaplatır.

### ✅ Ders 1.2 görevleri

1. `base.css`: değişkenler + reset + body temel stilleri.
2. `index.html`'in `<head>`'ine font linki ve `<link rel="stylesheet" href="/css/base.css">` ekle.
3. Hap ekranını güzelleştir: ortala, hapları stillendir (`pill` ortak, `--blue`/`--red` varyant), hover ekle.
4. Tarayıcıda bak; DevTools'u aç (sağ tık → İncele), elemanların kutularını incele.
5. Commit: `Style entry gate with design system` gibi.

---

## Ders 1.3 — CV sayfası: anlamsal yapı

### 📖 Konu: Semantic HTML — neden `<div>` değil?

`<div>` anlamsız bir kutu. `<section>`, `<nav>`, `<header>` ise TARIF eder. Kimin umrunda?
- **Ekran okuyucular:** görme engelli kullanıcı "sonraki bölüme atla" diyebilir.
- **Arama motorları:** sayfanın yapısını anlar, daha iyi indeksler.
- **Sen:** altı ay sonra kodu açınca `<div class="x2">` yerine `<section id="experience">` görürsün.

İskelet şöyle:

```html
<body>
  <header>        <!-- sayfa üstü: isim + sticky menü -->
    <nav>...</nav>
  </header>
  <main>
    <section id="hero">...</section>
    <section id="experience">...</section>
    <section id="projects">...</section>
    <section id="education">...</section>
    <section id="skills">...</section>
  </main>
  <footer>...</footer>   <!-- 3D dünyaya zarif davet -->
</body>
```

NEDEN'ler:
- **`id`'ler** iki iş görür: menüden `href="#projects"` ile zıplama + adres çubuğunda `/cv/#projects` paylaşılabilir link.
- **Başlık hiyerarşisi:** `<h1>` (isim) → her bölüm başlığı `<h2>` → bölüm içi alt başlık `<h3>`. Seviye ATLANMAZ (h2'den h4'e geçmek yok) — ekran okuyucular başlıklardan içindekiler tablosu çıkarır, atlarsan tablo bozulur.
- **Deneyim tarihleri** için `<time datetime="2024-06">June 2024</time>` — makine okunabilir tarih.

### 📖 İçerik kuralları (plandan)

1. **Hero:** isim, unvan, 1-2 cümle tanıtım, LinkedIn + GitHub, **PDF CV butonu ilk ekranda görünür** (İK'cının 30 saniyesinin yarısı bu butonu aramakla geçmesin).
2. **Deneyim:** en yeniden eskiye.
3. **Projeler:** 3-4 adet (hepsi değil — vitrine en iyiler): görsel + tek paragraf + link.
4. **Eğitim + sertifikalar.**
5. **Yetenekler:** sade etiket listesi. Yüzdelik bar YOK — "%80 Unity" gibi uydurma metrikler ciddiyetsiz durur.
6. **Footer:** 3D deneyime davet.

### ✅ Ders 1.3 görevleri

1. `cv/index.html` iskeletini kur (Ders 1.1'deki head bilgileriyle — ama title'ı bu sayfaya uygun yaz).
2. Tüm bölümleri anlamsal etiketlerle, GERÇEK içerikle doldur (lorem ipsum yok — gerçek CV'n).
3. Stil YOK bu derste. Çıplak HTML'in bile okunabilir olduğunu gör — buna "belge önce" yaklaşımı denir.
4. Commit: `Add CV page content structure`.

---

## Ders 1.4 — CV sayfası: yerleşim ve stil

### 📖 Konu: Okunabilirlik = satır uzunluğu

Tipografi kuralı: bir satır 45-75 karakter olmalı; daha uzunu göz satır başına dönerken kaybolur.
CSS'te birimi bile var: `ch` (karakter genişliği).

```css
.container {
  max-width: 72ch;
  margin-inline: auto;   /* yatayda ortala */
  padding-inline: 1.5rem; /* dar ekranda kenara yapışmasın */
}
```

- **`rem`** = kök font boyutunun katı (varsayılan 16px; 1.5rem = 24px). *Neden px değil?* Kullanıcı tarayıcı font boyutunu büyütmüşse rem'ler birlikte büyür — erişilebilirlik bedavaya gelir.
- **`margin-inline` / `padding-inline`** = sol+sağ kısayolu (modern mantıksal özellik).

### 📖 Konu: Grid — proje kartları

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

Bu tek satırlık sihir: "her sütun en az 280px olsun; sığdığı kadar sütun aç; artan yeri eşit paylaş."
Media query bile gerekmeden mobilde 1, tablette 2, geniş ekranda 3 sütun olur. Grid'in gücü bu.

### 📖 Konu: Sticky menü + yumuşak kaydırma

```css
header {
  position: sticky;
  top: 0;
  background: var(--color-bg);
  z-index: 10;
}

html {
  scroll-behavior: smooth;
}
```

- **`sticky`** = normal akışta durur, ekrandan çıkacağı an yapışır. (`fixed`'ten farkı: yer kaplar, içeriğin üstüne binmez.)
- **`z-index`** = üst üste binme sırası; menü içeriğin ÜSTÜNDE kalsın.
- **`scroll-behavior: smooth`** = `#projects` linkine tıklayınca ışınlanma değil kayarak gitme. Tek satır, JS gerekmez.
- İnce ayar: `section { scroll-margin-top: 4rem; }` — kaydırınca bölüm başlığı sticky menünün altında kalmasın diye pay bırakır.

### 📖 Vurgu disiplini

Turuncu (#FCA311) SADECE: PDF butonu, aktif/önemli linkler, ufak süs detayları. Sayfanın %5-10'u.
Her şey vurgulanırsa hiçbir şey vurgulanmış olmaz.

### ✅ Ders 1.4 görevleri

1. `css/cv.css` oluştur, `cv/index.html`'e `base.css`'ten SONRA bağla (sıra önemli — cascade!).
2. Konteyner + tipografi ölçeği (h1/h2/h3 boyutları, satır aralığı `line-height: 1.6` civarı gövdede).
3. Proje kartlarını Grid ile diz.
4. Sticky menü + smooth scroll + scroll-margin.
5. Commit: `Style CV page layout`.

---

## Ders 1.5 — Responsive tasarım

### 📖 Konu: Mobile-first ne demek?

CSS'ini önce dar ekran için yaz (temel hali), sonra geniş ekranlara ek yap:

```css
/* Temel = mobil (media query YOK) */
.hero { padding: 2rem 1rem; }

/* Geniş ekran EKLERİ */
@media (min-width: 768px) {
  .hero { padding: 4rem 2rem; }
}
```

*Neden bu yön?* Dar ekran basit halidir (tek sütun, doğal akış). Genişlemek = ekleme yapmak. Tersi (önce masaüstü, sonra mobil için bozup düzeltme) hep daha çok kod ve daha çok hata üretir.
İyi haber: Grid `auto-fit` gibi modern araçlar sayesinde çok az media query gerekecek.

### Kurallar

- Kırılma noktaları içeriğe göre seçilir, cihaza göre değil: pencereyi daralt, tasarım nerede bozuluyorsa oraya media query koy. (~768px, ~1024px klasik başlangıçlar.)
- Dokunma hedefleri en az **44×44px** (parmak, fare imleci kadar hassas değil).
- Test: DevTools cihaz modu (Cmd+Shift+M) → 375px (telefon), 768px (tablet), 1280px (laptop).

### ✅ Ders 1.5 görevleri

1. Her iki sayfayı 375px'te aç, bozulan her şeyi düzelt.
2. Yatay kaydırma çubuğu ASLA çıkmamalı — çıkıyorsa bir eleman taşıyor demektir (DevTools ile suçluyu bul).
3. Commit: `Make pages responsive`.

---

## Ders 1.6 — İçerik ve varlıklar (assets)

### 📖 Konu: Görsel optimizasyonu neden hayati?

Bir sayfanın ağırlığının çoğu görsellerdir. 3MB'lık PNG, yavaş mobil bağlantıda 10+ saniye = İK'cı gitti.

Kurallar:
1. **Format:** Fotoğraf/karmaşık görsel → **WebP** (PNG'den ~%30-70 küçük). (macOS'ta dönüştürme: `sips` komutu ya da Squoosh.app — birlikte yaparız.)
2. **Boyut:** Görsel, gösterileceği alandan büyük olmasın. 400px'lik kartta 2000px'lik görsel = israf.
3. **`<img>` özellikleri:**
   ```html
   <img src="/assets/project.webp" alt="Ballerino Online gameplay"
        width="800" height="450" loading="lazy">
   ```
   - **`alt`** — görsel yüklenmezse/ekran okuyucuda okunan metin. Boş bırakmak erişilebilirlik hatası; süs görselinde `alt=""` (bilinçli boş) yazılır.
   - **`width`/`height`** — tarayıcı görsel inmeden yerini ayırır; içerik zıplamaz (buna *layout shift* denir, Lighthouse bunu cezalandırır).
   - **`loading="lazy"`** — ekranda görünmeye yaklaşana kadar indirme. Hero görseline KOYMA (o hemen lazım).

### Eski dosyaları geri getirme

Silinen her şey `main`'de duruyor:
```
git checkout main -- public/games/ballerino_online_cover.png
```
Sonra `assets/` altına taşı, optimize et. İhtiyacın olanı getir — hepsini değil.

### ✅ Ders 1.6 görevleri

1. CV sayfası için gereken görselleri main'den seç-getir-optimize et.
2. Güncel PDF CV'yi `assets/` içine koy, hero'daki butona bağla (`<a href="..." download>`).
3. Commit: `Add optimized assets`.

---

## Ders 1.7 — Cila ve yayın

### 📖 Konu: Sayfanın kartviziti — meta etiketler

```html
<meta name="description" content="Game developer portfolio of Begum Donmez...">
<meta property="og:title" content="Begum Donmez — Game Developer">
<meta property="og:description" content="...">
<meta property="og:image" content="https://siten.com/assets/og-cover.png">
```

- **`description`** — Google sonucundaki gri özet metni.
- **`og:*` (Open Graph)** — LinkedIn/WhatsApp/Discord'da linkin paylaşılınca çıkan kart. Portfolyo linki İK'ya çoğu zaman mesajla gider — o kartın güzel görünmesi ciddi fark yaratır. `og:image` TAM URL ister (https ile başlayan).

### 📖 Konu: `vercel.json` düzeltmesi

SPA rewrite kuralı silinir. Statik çok sayfalı yapıda Vercel'in varsayılan davranışı zaten doğru: `/cv` → `cv/index.html`. Ek olarak temiz URL ayarı konuşulabilir (`cleanUrls`) — o güne gelince birlikte bakarız.

### 📖 Konu: Lighthouse

Chrome DevTools → Lighthouse sekmesi → analiz. Dört not: Performance, Accessibility, Best Practices, SEO. Hedef: hepsi 90+. Düşük çıkan her maddenin açıklaması vardır — tek tek okuyup düzelteceğiz; en öğretici ders bu olabilir.

### Yayın akışı

1. Her şeyi commit'le + push.
2. Vercel her push'ta branch için **önizleme linki** üretir — gerçek telefonda test et.
3. Hazır olunca `portfolio-v3` → `main` merge (GitHub'da Pull Request ile — PR açmayı da öğreneceksin).
4. `main`'e merge = otomatik yayın. 🎉

**Faz 1 bitiş kriteri:** Site yayında, mobilde kusursuz, Lighthouse 4×90+, PDF CV tek tıkla iniyor, `/cv` linki doğrudan paylaşılabilir.

---

# FAZ 2 — Katman C: 3D Deneyim (`/world`)

> Ön koşul: Faz 1 yayında.
> Unity bilgin burada altın değerinde: scene/mesh/material/transform kavramları birebir aynı, isimler farklı.
> Bu faz parça parça yayınlanabilir: önce açılış sahnesi, sonra koridor, sonra oda.

### Teknoloji

- **Three.js** (WebGL), modeller **Blender → glTF 2.0 (GLB)**, texture gömülü
- Materyaller: Principled BSDF, low-poly düz renk estetiği
- Bloom: `UnrealBloomPass` (ışık topu glow'u) · Ses: `PositionalAudio`

## Ders 2.1 — Three.js "merhaba dünya"

### 📖 Konu: Three.js'in dört temel taşı

Unity karşılıkları ile:

| Three.js | Unity karşılığı | Ne yapar |
|---|---|---|
| `Scene` | Scene / Hierarchy | Tüm objelerin kabı |
| `PerspectiveCamera` | Camera | Sahneye bakan göz |
| `WebGLRenderer` | (motorun kendisi) | Sahne + kamerayı piksele çevirir |
| `Mesh` = geometry + material | GameObject + MeshFilter + MeshRenderer | Görünen obje |

Minimum çalışan sahne, satır satır:

```js
import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,                                    // FOV — görüş açısı (Unity'deki gibi)
  window.innerWidth / window.innerHeight, // en-boy oranı
  0.1, 100                               // near/far clip düzlemleri
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // renderer bir <canvas> üretir

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xFCA311 })
);
scene.add(cube);

scene.add(new THREE.DirectionalLight(0xffffff, 2));
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

function animate() {
  requestAnimationFrame(animate);  // Unity'deki Update() döngüsünün karşılığı
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
```

NEDEN'ler:
- **`requestAnimationFrame`** — "bir sonraki ekran karesinde beni tekrar çağır." Unity'de Update motoru senin için döndürür; web'de döngüyü sen kurarsın. `setInterval` KULLANILMAZ: rAF ekran yenilemesiyle senkron çalışır, sekme arka plandayken durur (pil dostu).
- **`MeshStandardMaterial`** — fiziksel tabanlı (PBR) materyal; Blender'daki Principled BSDF'in karşılığı. Işık ister — ışık yoksa her şey simsiyah görünür (klasik ilk hata!).
- **near/far** — bu aralık dışındaki şeyler çizilmez. Farkı çok açmak derinlik hassasiyeti bozar (z-fighting).
- **import nereden?** Modern yol: `<script type="module">` + import map ile CDN'den ya da three.js dosyasını indirip projeye koymak. Build aracı hâlâ gerekmez. O güne gelince kurulumu birlikte yaparız.

### 📖 Konu: Pencere boyutu değişince

```js
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();   // aspect değişince kamera matrisi yeniden hesaplanmalı
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

### ✅ Görevler
1. `world/index.html` + `world/js/main.js` kur; dönen turuncu küpü ekrana getir.
2. Işığı kapatıp aç — siyah küp deneyimini bilinçli yaşa 😄
3. Commit: `Add Three.js hello world scene`.

## Ders 2.2 — Objeler, GLB yükleme, Blender köprüsü

### 📖 Konu: Blender → web hattı

1. Blender'da modelle (low-poly, Principled BSDF, düz renkler).
2. Export → **glTF 2.0 (.glb)** — tek dosya, texture gömülü. *Neden GLB?* Web'in standart 3D formatı; FBX/OBJ'nin aksine PBR materyalleri, animasyonu ve sıkıştırmayı tek pakette taşır.
3. Three.js'te yükle:

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('/assets/models/mascot.glb', (gltf) => {
  scene.add(gltf.scene);
});
```

- Yükleme **asenkron** — dosya inene kadar kod devam eder, model callback içinde gelir. (JS'in en önemli kavramlarından biri; burada pratikte öğreneceksin.)
- **`clone()` prensibi:** 10 kitap = 1 model + 10 klon. Ama dikkat: klonlar **materyali paylaşır** — birinin texture'ını değiştireceksen `mesh.material = mesh.material.clone()` zorunlu, yoksa hepsi değişir.

### 📖 Konu: Koridor duvarları Blender'sız

```js
const wall = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 3, 20),           // ince, yüksek, uzun kutu
  new THREE.MeshStandardMaterial({ color: 0x2b2b35 })
);
```
Basit kutular için Blender'a gitmek israf — kod hem hafif hem parametrik (koridoru uzatmak = tek sayı).

### ✅ Görevler
1. Blender'da ilk asset'i yap: **ışık topu ve çerçeve** (listede en basitler) — maskotu sona bırak (en zoru).
2. GLB export → sahneye yükle.
3. Koridorun kaba kutusunu (duvarlar, zemin, tavan) kodda kur.
4. Commit'ler: `Add GLB loading`, `Block out corridor geometry`.

## Ders 2.3 — Kontroller ve etkileşim (ok tuşları + E)

### 📖 Konu: Klavye durumu

Tuşa "basılı tutma" için olay değil **durum** tutulur:

```js
const keys = {};
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup',   (e) => keys[e.code] = false);

// animate() içinde:
if (keys['ArrowUp']) player.position.z -= speed * delta;
```

- **`delta` (kare süresi) neden?** Unity'deki `Time.deltaTime` ile aynı sebep: 144Hz ekranda oyuncu 60Hz'dekinden hızlı yürümesin. `THREE.Clock` ile alınır.
- Koridor **tek yönlü ve dar** olduğu için tam FPS kontrolü gerekmez: sadece ileri/geri + sınırlar (min/max z). Mouse-look YOK — bu bir tasarım kararı: ziyaretçi oyuncu değil, misafir.

### 📖 Konu: "Neye bakıyorum?" — Raycasting

E ile etkileşim için önce neyin menzilde olduğunu bilmek gerekir. Kameradan ileri bir ışın atılır:

```js
const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(new THREE.Vector2(0, 0), camera); // ekran merkezi
const hits = raycaster.intersectObjects(interactables);
if (hits.length && hits[0].distance < 2.5) {
  // hits[0].object etkileşilebilir → "E" ipucunu göster
}
```

- Unity'deki `Physics.Raycast`'in birebir karşılığı.
- `interactables` = etkileşimli objelerin dizisi (5-6 taneyi geçmeyecek — plan kuralı). TÜM sahneyi taramak israf.
- UX kuralı: menzildeyken ekranda küçük "E" ipucu belirmeli — oyuncuyu tahmine zorlama.

### 📖 Konu: Yumuşak hareketler — lerp

Çekmece açılması, kamera geçişi, kapı dönmesi... hepsi aynı kalıp:

```js
drawer.position.z = THREE.MathUtils.lerp(drawer.position.z, targetZ, 0.1);
```
Her karede hedefe %10 yaklaş → başta hızlı, sonda yumuşak yavaşlayan doğal hareket. Blender animasyonu gerekmez (plan kuralı: origin'ler doğru yerdeyse her şey kodda döner/kayar).

### ✅ Görevler
1. İleri/geri yürüme + koridor sınırları.
2. Raycast + "E" ipucu UI'ı (HTML overlay olarak — 3D içinde texture UI YOK, plan kuralı).
3. İlk etkileşim: bir çerçeveye E → kamera zoom (lerp ile).
4. Commit: `Add movement and interaction system`.

## Ders 2.4 — Açılış sahnesi (deneyimin en önemli anı)

### 📖 Sahne akışı (plandan, uygulama notlarıyla)

1. **Siyah ekran, third-person:** maskot + yanında parlayan beyaz top. Top HAREKETSİZ — sembolik eşik. Metin: "reach for the light" tarzı davet ("catch" değil — kaçan bir şey ima etmesin).
2. **Topa dokunma (E):** üç şey AYNI ANDA tetiklenir — bu senkron, sahnenin bütün duygusu:
   - Işık dalgası: koridor lambaları soldan sağa sırayla yanar (her ışığın `intensity`'si gecikmeli lerp'le 0→hedef).
   - Anlatıcının İLK cümlesi başlar.
   - Kamera geçişi başlar.
3. **Kamera third→first person:** sert kesme YOK. 1-2 sn dolly: kamera figürün arkasından omzuna, oradan göz hizasına lerp'lenir; varınca kontrol first-person'a devredilir.
4. **Top:** sıcak beyaz — beyaza %10-15 turuncu karışmış emissive + bloom (palet bütünlüğü).

### 📖 Konu: Bloom (ışıma)

```js
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
```
Composer = Unity'deki post-processing stack. Render doğrudan ekrana değil, efekt zincirinden geçerek gider. Bloom sadece parlak (emissive) yüzeylerde patlar — bu yüzden top `emissive` renkli tek obje olmalı ki yalnız o ışısın.

### 📖 Konu: Sahne durumu (state machine)

Açılış → koridor → oda akışı bir durum makinesidir (Unity'den tanıdık kavram):

```js
let state = 'intro';   // 'intro' | 'transition' | 'corridor' | 'room' | 'computer'
```
Her durumda hangi kontrollerin aktif olduğu net olsun (intro'da yürüme yok, computer'da ESC dışında her şey kilitli). Bu disiplin olmadan "kapı açıkken zoom yapınca kamera uçtu" tarzı hatalar kaçınılmaz.

### ✅ Görevler
1. Durum makinesi iskeleti.
2. Açılış sahnesi: siyahlık, top + emissive + bloom, davet metni (HTML overlay).
3. E → ışık dalgası + kamera dolly geçişi. Bu sahneye özel efor — defalarca izle, hissi doğru olana kadar süreleri ayarla.
4. Commit: `Add opening scene with light wave transition`.

## Ders 2.5 — Koridor içeriği

- **Çerçeveli diplomalar:** tek çerçeve GLB'si; iç plane'in ("photo" mesh) materyaline kodda `TextureLoader` ile diploma JPG'si basılır. Her kopya için `material.clone()` (yoksa tüm diplomalar aynı görsel olur!). E → zoom.
- **Komodin + keepsake box:** çekmece lerp'le açılır; kutu kapağı origin'i menteşede olduğu için rotasyonla açılır. İçinden polaroid çerçeveli deneyim fotoğrafları çıkar (polaroid tek model, foto texture ile değişir).
- **Kitaplık:** dolgu kitaplar tek birleşik mesh (ucuz); etkileşimli 1-2 kitap ayrı obje.
- **Proje posterleri:** `PlaneGeometry` + JPG — en iyi 2-3 proje, vitrin görevi.
- **Anlatıcı + altyazı:** aşağıda Ders 2.7'de.

### ✅ Görevler: her obje ayrı commit ile (`Add framed diplomas`, `Add keepsake box interaction`...)

## Ders 2.6 — Oda (About Me)

- **Kapı:** E → origin'i menteşede, rotasyonla açılır. Oda koridorun fiziksel devamında — **yükleme ekranı YOK** (tüm sahne baştan yüklü; poly bütçesi ~5-10k olduğu için sorun değil — bütçenin varlık sebebi bu).
- **Radyo:** E ile istasyon değişir; geçişte kısa parazit sesi; altyazıda "Now playing: ...". `PositionalAudio` ile mesafeye göre duyulur (yaklaşınca yükselir — mekân hissi). Telif: gerçek mp3 yerine telifsiz/önizleme + Spotify playlist linki.
- **Kasetler:** el yazısı etiketli ("about me", "my journey"...); tek model, etiket texture ile. E → al → çalara tak → kendi sesinle kayıt çalar. 30-90 sn/kaset. Yeni kaset öncekini keser.
- **Bilgisayar:** E → kamera ekrana zoom → **tam ekran HTML overlay** açılır. Proje detayları (ekran görüntüleri, açıklamalar, GitHub/canlı linkler) `data/projects.json`'dan okunur. ESC ile çıkış. *Neden HTML overlay, 3D ekran texture'ı değil?* Metin netliği, tıklanabilir linkler, erişilebilirlik, kolay güncelleme — 3D içinde UI render etmenin her derdinden kurtulursun.
- Etkileşimli obje sayısı **5-6'yı geçmez** (plan kuralı: az ama özenli).

## Ders 2.7 — Ses ve altyazı sistemi

### 📖 Konu: Web'de ses kuralları

- **Autoplay kısıtı:** tarayıcı, kullanıcı etkileşimi olmadan ses başlatmaz. Çözüm zaten planda: giriş ekranında "sesli deneyim?" sorusu — o tıklama, ses iznini de açar.
- **Ducking:** anlatıcı konuşurken müzik `gain`'i düşürülür (lerp ile, anida değil), bitince geri yükselir.
- **Altyazı senkronu:** zaman damgalı dizi + `audio.currentTime` takibi:

```js
const captions = [
  { start: 0.0,  end: 3.5,  text: "Bir hayalin peşinden gitmek..." },
  { start: 3.5,  end: 7.2,  text: "..." },
];
```
Her karede `currentTime` hangi aralıktaysa o metin gösterilir. `tapes.json`'ın yapısı da bu: ses dosyası yolu + caption dizisi.

- **Kayıt kalitesi:** sessiz/yankısız oda, mikrofona yakın, Audacity ile gürültü temizliği (Noise Reduction), isteğe bağlı hafif tape hiss efekti (kaset hissi).
- **Tüm sesli içerik altyazılı** — pazarlıksız erişilebilirlik kuralı.

## Ders 2.8 — Kaçış, mobil, performans

- **Her ekranda "skip / doğrudan siteye geç"** çıkışı — sabit köşe linki. Deneyim hediye, hapishane değil.
- **İlk etkileşim (topa ulaşma) 10-15 sn'den kısa** olmalı — ilk sahneyi arkadaşlarında kronometreyle test et.
- **Mobil:** ok tuşları + E yok → mobil kullanıcı otomatik `/cv`'ye yönlendirilir + "masaüstünde interaktif deneyim var" notu. Tespit: ekran genişliği değil, `matchMedia('(pointer: coarse)')` gibi yetenek kontrolü. (Dokunmatik joystick = v2.)
- **Performans kontrol listesi:** poly bütçesine sadakat · texture 512-1024px · `renderer.info` ile draw call takibi · Chrome DevTools Performance sekmesi.

**Faz 2 bitiş kriteri:** Açılış + koridor + oda akıcı çalışıyor, ses/altyazı senkron, skip her yerde, mobil yönlendirme aktif, orta seviye bir laptopta 60fps.

### 3D Asset listesi (Blender → GLB)

Prensip: tek model, `clone()` ile çoğalt; texture'ı değişecek mesh'lerde `material.clone()` zorunlu.

| # | Asset | Not |
|---|---|---|
| 1 | Maskot | ~1.000-3.000 poly (en pahalı — sürekli ekranda) |
| 2 | Işık topu | `SphereGeometry(1,16,16)` + emissive + bloom |
| 3 | Çerçeve | Tek model; kenar + "photo" iç plane (A4 ≈ 1:1.41); diploma JPG texture kodda |
| 4 | Komodin gövdesi | Çekmece boşlukları eş |
| 5 | Çekmece | Tek model, klon; origin merkezde; açılma kodda lerp |
| 6-7 | Keepsake box gövde + kapak | Kapak origin'i menteşede |
| 8 | Polaroid | Tek model, foto texture ile |
| 9 | Kitaplık | Raflar dahil tek mesh |
| 10 | Kitap | Tek model; scale/renk/açı ile klon |
| 11 | Kapı + kasa | Kapı origin'i menteşede |
| 12 | Radyo/kasetçalar | Emissive ışık detayı |
| 13 | Kaset | Tek model, etiket texture ile |
| — | Duvarlar, posterler | Kodda geometry, Blender gerekmez |

**Poly bütçesi:** sahne ~5-10k · Subdivision max 1-2 (Apply'lı) · görünmeyen yüzey silinir · bevel 1-2 segment · texture 512-1024px · kontrol: Blender Statistics overlay.

---

# FAZ 3 — Katman B: Sihirli Varyant + Maskot

> Ayrı sayfa DEĞİL — Katman A'nın tema + bileşen dönüşümü.
> Merak merdiveninin son basamağı: sıkıcı → sihirli → metaforik. Kimse zorlanmaz, herkes davet edilir.

## Ders 3.1 — İçeriği JSON'a taşıma (refactor dersi)

### 📖 Konu: Neden ŞİMDİ JSON?

Faz 1'de "içerik HTML'de kalsın" demiştik (Karar 2). Artık durum değişti: aynı içerik iki sunumla gösterilecek (düz + scrapbook) ve 3D'deki bilgisayar overlay'i de proje verisini okuyor. Bilgi üç yerde elle tutulamaz — **tek doğruluk kaynağı** artık gerçek ihtiyaç. İşte refactor'ün doğru zamanı: ihtiyaç doğduğunda, önce değil.

### 📖 Konu: fetch ile veri okuma

```js
async function loadProjects() {
  const res = await fetch('/data/projects.json');
  const projects = await res.json();
  renderProjects(projects);
}
```

- **`async/await`** — "bu iş zaman alır, sonucu bekle ama tarayıcıyı dondurma." GLB yüklemedeki asenkronluğun aynısı, farklı sözdizimi.
- **`renderProjects`** — veriyi DOM'a çeviren fonksiyon: `document.createElement` ya da `<template>` etiketi ile. Şablon (nasıl görünecek) ve veri (ne yazacak) ayrışır — tema değişince sadece şablon değişir, veri aynı kalır. Katman B'nin tüm sırrı bu ayrım.

### 📖 Veri dosyaları

```
data/
  cv.json        → deneyim, eğitim, yetenekler
  projects.json  → projeler (görsel, açıklama, linkler)
  tapes.json     → kasetler (ses yolu + zaman damgalı altyazılar)
  songs.json     → radyo istasyon listesi
```

Dikkat: Faz 1'in "JS'siz de çalışsın" ilkesinden taviz veriyoruz — bilinçli bir takas: İK'cının gördüğü ilk yükleme hâlâ HTML'de kalabilir (hero + temel bilgiler), listelenen içerik JSON'dan gelir. Dozu birlikte ayarlayacağız.

### ✅ Görevler
1. JSON şemalarını tasarla (hangi alanlar? — önce kağıtta).
2. İçeriği HTML'den JSON'a taşı, render fonksiyonlarını yaz.
3. Sayfanın PİKSEL PİKSEL aynı göründüğünü doğrula — refactor'ün tanımı: davranış değişmez.
4. 3D bilgisayar overlay'ini de `projects.json`'a bağla.
5. Commit: `Move CV content to JSON data files`.

## Ders 3.2 — Maskot etkileşimi

### 📖 Konu: Zamanlama mantığı

Belirme koşulu (plandan): sayfa açıldıktan **~15-20 sn sonra VE kullanıcı en az bir kez scroll ettiyse**.
*Neden iki koşul?* Süre tek başına yetmez — kullanıcı belki sekmeyi açıp gitti. Scroll = "gerçekten okuyor" sinyali. İkisi birden = doğru an.

```js
let hasScrolled = false;
window.addEventListener('scroll', () => hasScrolled = true, { once: true });

setTimeout(() => {
  if (hasScrolled) showMascot();
  else /* scroll bekle, sonra göster */;
}, 17000);
```
- **`{ once: true }`** — dinleyici ilk tetiklenmede kendini söker (her scroll'da çalışmasın — performans nezaketi).

### 📖 Davranış kuralları (plandan)

- Sağ altta minik belirir, zıplar, "Hey!" der — **sessiz**, ekranı kaplamaz. (Popup değil, arkadaş.)
- 10 sn etkileşim yoksa kenara çekilir — **kaybolmaz**, bekler.
- Tıklanınca iki seçenekli diyalog, ton oyunbaz ve küçümsemesiz:
  - *"Psst... bunun bir de benim tarafımdan anlatılan hali var, görmek ister misin?"*
  - **Evet** → *"Hadi biraz sihir yapalım"* → dönüşüm başlar
  - **Hayır** → *"Anlaşıldı, ben buradayım 👀"* → köşede kalır
- Dönüşüm **geri alınabilir**: figür köşede "eski haline döndüreyim mi?" sunar. (Kontrol hep ziyaretçide — güven böyle kurulur.)
- Maskot görseli: 2D sprite/SVG — 3D maskotun aynı karakterde çizimi (marka bütünlüğü).

### ✅ Görevler
1. Maskot bileşeni: konumlandırma (`position: fixed`), beliriş animasyonu (CSS `@keyframes`), diyalog balonu.
2. Zamanlama + scroll mantığı.
3. "Hayır" ve geri-alma akışları dahil TÜM dallar test edilmiş olmalı.
4. Commit: `Add mascot companion with dialog`.

## Ders 3.3 — Tema dönüşümü (sihir anı)

### 📖 Konu: Faz 1'deki yatırım hasat ediliyor

Renkler baştan beri değişkenlerde. Dönüşümün çekirdeği tek CSS bloğu:

```css
body.magic {
  --color-bg: /* defter kağıdı tonu */;
  --color-accent: /* scrapbook vurgusu */;
  --font-heading: "Caveat", cursive;   /* el yazısı — sadece magic temada yüklenir */
  /* + doku değişkenleri: --texture-paper, --frame-style... */
}
```

JS tarafı tek satır: `document.body.classList.add('magic')`. Faz 1'de "neden değişken kullanıyoruz?" sorusunun cevabı tam olarak buydu.

### 📖 Konu: Dönüşüm animasyonu

Sayfa gözünün önünde dönüşmeli (plandan) — anlık tema değişimi değil, sihir:
- CSS değişkenleri `transition` ile animlanmaz ama kullanıldıkları özellikler animlanır: `body { transition: background 0.8s; }` gibi.
- Kademeli dönüşüm: bölümlere sırayla `magic` sınıfı ver (yukarıdan aşağı dalga — 3D'deki ışık dalgasının 2D yankısı; marka bütünlüğü).
- Polaroid çerçeveler, bant/iğne detayları, yapışkan notlar: `body.magic` altında beliren `::before/::after` sözde-elemanları ve arkaplan görselleri. HTML'e eleman eklemek gerekmez — kabuk değişir, iskelet aynı kalır.
- **`prefers-reduced-motion`** medya sorgusuna saygı: hareket azaltma isteyen kullanıcıya dalga yerine sade geçiş.

### 📖 Scrapbook estetiği (plandan)

Defter sayfaları, yapışkan notlar, polaroid çerçeveler, bant/iğne detayları, el yazısı etiketler.
Doz kuralı: bu estetik yalnız Katman B'de (ve C'nin detay kartlarında). Katman A'da en fazla %10'luk tek dokunuş.

### 📖 Katman C'ye köprü

Maskot, sihirli temada bir noktada teklif eder: *"Bunu beğendiysen... asıl dünyamı görmek ister misin?"* → `/world` linki. Merak merdiveninin son basamağı tamamlanır: A → B → C.

### ✅ Görevler
1. `body.magic` değişken seti + scrapbook stilleri.
2. Dalga animasyonu + `prefers-reduced-motion` alternatifi.
3. Geri dönüş animasyonu (dönüşüm iki yönlü çalışmalı).
4. Maskotun C'ye davet diyaloğu.
5. Commit: `Add magic theme transformation`.

**Faz 3 bitiş kriteri:** Maskot doğru zamanda beliriyor, tüm diyalog dalları çalışıyor, dönüşüm iki yönlü ve akıcı, içerik tek kaynaktan (JSON) geliyor, üç katman birbirine bağlı.

---

## Marka Bütünlüğü Kontrol Listesi

- [ ] Maskot üç katmanda da var (A: köşede 2D, B: anlatıcı, C: 3D yoldaş)
- [ ] Turuncu `#FCA311` düz sitede ve 3D UI/altyazılarda
- [ ] Fraunces + Space Grotesk her iki dünyada (3D altyazı dahil)
- [ ] Işık topu sıcak beyaz (hafif turuncu hale)
- [ ] Scrapbook estetiği yalnız B + C detay kartlarında (A'da max %10 dozunda)

## Git Çalışma Düzeni

- Çalışma branch'i: `portfolio-v3` · `main` = yayın; sadece bitmiş fazlar merge edilir (PR ile).
- Commit mesajı: İngilizce, emir kipi, baş harf büyük ("Add hero section"). `update` YASAK 😄
- Anlamlı her adımda commit; gün sonu push (yedek).
- Silineni geri al: `git checkout main -- <dosya-yolu>`

## Sözlük

- **MPA / SPA:** çok sayfalı / tek sayfalı uygulama
- **Semantic HTML:** anlam taşıyan etiketler (`<nav>`, `<section>`) — erişilebilirlik + SEO
- **DOM:** tarayıcının HTML'den kurduğu belge ağacı
- **Quirks mode:** DOCTYPE yoksa tarayıcının düştüğü eski uyumluluk modu
- **Box model:** içerik + padding + border + margin kutu modeli
- **Cascade / specificity:** çakışan CSS kurallarında kimin kazanacağı sistemi
- **CSS custom property:** `--isim: deger;` tanımla, `var(--isim)` ile kullan
- **BEM:** `blok--varyant` sınıf adlandırma düzeni
- **Mobile-first:** temel CSS mobil için, geniş ekran media query ile eklenir
- **Progressive enhancement:** temel deneyim JS'siz çalışır, süsler üstüne gelir
- **Layout shift:** içerik yüklenirken sayfanın zıplaması (kötü — width/height ile önlenir)
- **Refactor:** davranışı değiştirmeden yapıyı iyileştirmek
- **YAGNI:** ihtiyaç yokken genelleme/altyapı kurma
- **Single source of truth:** bilgi tek yerde, herkes oradan okur
- **Ducking:** anlatıcı konuşurken müziğin kısılması
- **Lerp:** iki değer arası yumuşak geçiş (linear interpolation)
- **Bloom:** parlak alanların ışıma efekti
- **Open Graph:** link paylaşımında çıkan önizleme kartının meta etiketleri
- **Lighthouse:** Chrome'un performans/erişilebilirlik/SEO denetim aracı
