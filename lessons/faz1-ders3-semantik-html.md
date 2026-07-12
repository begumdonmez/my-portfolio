# Ders 1.3 — CV Sayfası: Anlamsal Yapı

> 🎯 **Bu dersin sonunda:** `cv/index.html` gerçek içeriğinle, doğru etiketlerle, stilsiz ama
> düzgün yapıda hazır olacak. Ekran okuyucu ve Google bu sayfayı kusursuz "anlayacak".

---

## 📖 Bölüm 1: Semantic HTML — neden `<div>` yetmez?

`<div>` = anlamsız kutu. Çalışır, ama kimseye bir şey anlatmaz. Anlamsal etiketler TARİF eder:

| Etiket | Anlamı |
|---|---|
| `<header>` | Sayfanın/bölümün üst kısmı |
| `<nav>` | Gezinme bölgesi |
| `<main>` | Ana içerik (sayfada 1 tane) |
| `<section>` | Konu bütünlüğü olan bölüm |
| `<article>` | Kendi başına anlamlı parça (bir iş deneyimi, bir proje kartı) |
| `<footer>` | Alt bilgi |
| `<time>` | Tarih/saat (makine okunabilir) |
| `<ul>/<li>` | Liste (yetenekler, linkler) |

Kimin umrunda?
- **Ekran okuyucular:** kullanıcı "bölümler arasında atla", "başlık listesini ver" diyebilir.
- **Google:** yapıyı anlar, daha iyi indeksler. İK sayfası için doğrudan para eder.
- **Sen:** 6 ay sonra `<div class="x2">` yerine `<section id="experience">` okursun.

Kural: **anlamı olan etiket varsa onu kullan; yoksa div.** (Div yasak değil — sadece son çare.)

## 📖 Bölüm 2: Sayfanın iskeleti

```html
<body>
  <header class="site-header">
    <nav aria-label="Section navigation">
      <a href="#experience">Experience</a>
      <a href="#projects">Projects</a>
      <a href="#education">Education</a>
      <a href="#skills">Skills</a>
    </nav>
  </header>

  <main>
    <section id="hero">...</section>
    <section id="experience">...</section>
    <section id="projects">...</section>
    <section id="education">...</section>
    <section id="skills">...</section>
  </main>

  <footer>...</footer>
</body>
```

NEDEN'ler:
- **`id`'ler çift görevli:** menüden `href="#projects"` ile sayfa içi zıplama + paylaşılabilir
  derin link (`siten.com/cv/#projects` — İK'cıya "projelerime direkt bakın" linki).
- **Başlık hiyerarşisi:** `<h1>` (bir tane — ismin) → bölüm başlıkları `<h2>` → bölüm içi `<h3>`.
  **Seviye atlanmaz** (h2'den h4'e zıplamak yok): ekran okuyucular başlıklardan içindekiler tablosu
  çıkarır; atlarsan tablo bozulur. Başlığı "büyük görünsün" diye seçme — boyut CSS'in işi, seviye anlamın işi.

## 📖 Bölüm 3: Bölüm bölüm içerik

### Hero
```html
<section id="hero">
  <h1>Begum Donmez</h1>
  <p class="tagline">Game Developer & Designer</p>
  <p class="intro"><!-- 1-2 cümle: ne yaparsın, seni ne heyecanlandırır --></p>
  <ul class="contact-links">
    <li><a href="https://linkedin.com/in/...">LinkedIn</a></li>
    <li><a href="https://github.com/...">GitHub</a></li>
    <li><a href="mailto:begum@dawnbright.games">Email</a></li>
  </ul>
  <a class="cta" href="/assets/begum-donmez-cv.pdf" download>Download CV (PDF)</a>
</section>
```
- **PDF butonu ilk ekranda görünür olmalı** — İK'cının 30 saniyesinin yarısı buton aramakla geçmesin.
- **`download` özniteliği** — tarayıcı PDF'i açmak yerine indirir.
- **`mailto:`** — tıklayınca e-posta uygulamasını açar.

### Deneyim (en yeniden eskiye)
```html
<section id="experience">
  <h2>Experience</h2>
  <article>
    <h3>Game Developer — Dawnbright Games</h3>
    <p class="dates">
      <time datetime="2024-06">Jun 2024</time> — Present
    </p>
    <ul>
      <li><!-- ne yaptın: eylem + sonuç. "Worked on X" değil, "Built/Shipped/Designed X" --></li>
    </ul>
  </article>
  <!-- diğer deneyimler... -->
</section>
```
- **`<article>`** — her deneyim kendi başına anlamlı bir parça.
- **`<time datetime="2024-06">`** — insan "Jun 2024" okur, makine "2024-06" okur.
- İçerik tüyosu: maddeler eylemle başlasın (Built, Designed, Shipped) — CV yazımının evrensel kuralı.

### Projeler (3-4 adet — vitrine EN İYİLER)
```html
<article class="project-card">
  <img src="/assets/ballerino-cover.webp" alt="Ballerino Online gameplay screenshot"
       width="800" height="450">
  <h3>Ballerino Online</h3>
  <p><!-- TEK paragraf: ne, hangi teknoloji, senin rolün --></p>
  <a href="...">Play / View →</a>
</article>
```
- Görsel öznitelikleri (`alt`, `width/height`) Ders 1.6'nın konusu — şimdilik yaz, orada derinleşeceğiz.

### Eğitim + Sertifikalar
Deneyimle aynı kalıp: `<article>` + `<h3>` + `<time>`.

### Yetenekler
```html
<ul class="skills-list">
  <li>Unity</li><li>C#</li><li>Blender</li><li>Game Design</li><li>...</li>
</ul>
```
- **Yüzdelik bar / puan YOK** — "%80 Unity" neye göre %80? Uydurma metrik ciddiyetsiz durur. Sade etiketler.

### Footer
```html
<footer>
  <p>There's another side to this site... <a href="/world/">step through the door</a> 🚪</p>
</footer>
```
- 3D deneyime **zarif** davet — bağıran buton değil, merak kancası.

## ⚠️ Sık yapılan hatalar

1. Her şeyi `<div>` yapmak — çalışır ama bu dersin bütün amacını boşa düşürür.
2. Birden çok `<h1>` — sayfa başına bir tane.
3. Başlık seviyesi atlama (h2 → h4).
4. `alt` yazmamak — her `<img>`'ye ya anlamlı `alt` ya bilinçli boş `alt=""` (süs görseli ise).
5. Lorem ipsum bırakmak — bu sayfa GERÇEK CV'n; sahte içerikle yapı doğru kurulamaz
   (gerçek metin uzunlukları tasarımı şekillendirir).

## ✏️ Görevler

1. `cv/index.html` iskeletini kur (Ders 1.1'deki head — title'ı bu sayfaya göre yaz).
2. Tüm bölümleri GERÇEK içeriğinle doldur. Bu dersin çoğu zamanı içerik yazmaya gidecek — normaldir,
   içerik sitenin ta kendisi.
3. Stil YOK. Çıplak HTML'i tarayıcıda aç: okunabilir mi? İyi HTML stilsiz de okunur —
   buna "belge önce" yaklaşımı denir.
4. Hap ekranındaki mavi hapı tıkla — CV sayfan açılıyor mu? (Dosyadan açınca `/cv/` linki çalışmayabilir;
   bunu Ders 1.4'te yerel sunucuyla çözeceğiz. Şimdilik cv/index.html'i doğrudan açabilirsin.)
5. Commit: `Add CV page content structure`.

## ✅ Kontrol

1. `<section>` ile `<article>` farkı ne? Deneyim maddesi neden article?
2. Başlık seviyesi neden atlanmaz — kim etkilenir?
3. `<time datetime="...">` ne kazandırır?
4. Yetenek yüzdeleri neden yasak?
5. Sayfadaki id'lerin iki görevi ne?

→ Sonraki ders: [1.4 — CV sayfası: yerleşim ve stil](faz1-ders4-yerlesim.md)
