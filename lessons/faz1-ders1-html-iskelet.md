# Ders 1.1 — HTML İskeleti ve Hap Seçim Ekranı

> 🎯 **Bu dersin sonunda:** Klasör yapısı kurulmuş olacak ve tarayıcıda açılan (henüz çirkin)
> bir hap seçim ekranın olacak. Ayrıca her HTML sayfasının değişmez iskeletini ezbere yazabileceksin.

---

## 📖 Bölüm 1: HTML nedir, tarayıcı ne yapar?

HTML (HyperText Markup Language) bir programlama dili değil, **işaretleme** dilidir: içeriğin ne
olduğunu etiketlerle işaretlersin ("bu bir başlık", "bu bir paragraf", "bu bir link").

Tarayıcı HTML dosyasını okuyunca ondan bir **ağaç** kurar — buna **DOM** (Document Object Model) denir:

```
html
├── head  (görünmeyen üst bilgiler)
└── body  (görünen her şey)
    ├── h1
    └── p
```

Etiketlerin çoğu çift olur: `<p>` açar, `</p>` kapatır. Bazıları tek başınadır (`<img>`, `<meta>`)
çünkü içerik sarmaz. Etiketlere **öznitelik** (attribute) eklenir: `<a href="/cv/">` — `href` özniteliktir.

**Unity benzetmesi:** HTML = Hierarchy paneli. Objelerin ağacı. CSS = Inspector'daki görsel ayarlar.
JS = script'ler. Üçü ayrı katman, ayrı sorumluluk.

## 📖 Bölüm 2: Değişmez iskelet — satır satır

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Begum Donmez — Game Developer</title>
</head>
<body>

</body>
</html>
```

| Satır | Neden var? Yazmazsan ne olur? |
|---|---|
| `<!DOCTYPE html>` | "Modern standart modda çalış" bildirimi. Yazmazsan tarayıcı 90'lar uyumluluğu için **quirks mode**'a düşer: box model farklı hesaplanır, CSS'in sebepsizce tuhaflaşır. |
| `lang="en"` | Ekran okuyucu telaffuzu, Google'ın dil algısı, tarayıcının çeviri önerisi buna bakar. |
| `<meta charset="UTF-8">` | Karakter kodlaması. Yazmazsan "Begüm" → "BegÃ¼m" görünebilir. İlk satırlarda olmalı. |
| `<meta name="viewport" ...>` | Mobil tarayıcı, bu satır yoksa sayfayı 980px genişlikte varsayıp uzaktan gösterir → site telefonda pul gibi. `width=device-width` = "cihazın gerçek genişliğini kullan", `initial-scale=1` = "1:1 zoom ile başla". Responsive tasarımın açma düğmesi. |
| `<title>` | Sekme başlığı + Google sonuç başlığı + yer imi adı. İK'cının 20 sekmesi arasında seni bulduğu yer. Formül: "İsim — Unvan". |

## 📖 Bölüm 3: Link mi buton mu? (Hap seçimi için kritik karar)

- **Bir yere GÖTÜRÜYORSA** → `<a href="...">`. Geri tuşu çalışır, sağ tık "yeni sekmede aç" çalışır,
  ekran okuyucu "link" diye duyurur.
- **Bir şey YAPIYORSA** (menü açar, form gönderir) → `<button>`.

Haplar ziyaretçiyi başka sayfaya götürüyor → **link.** Dev bir hap gibi görünmesi CSS'in işi (Ders 1.2).

Yol yazımı:
- `/cv/` → baştaki `/` = "site kökünden başla" (**mutlak yol**). Nereden bakılırsa bakılsın hep aynı yer.
- `cv/` (baştaki `/` yok) → "bulunduğum yerden" (**göreli yol**). İç içe klasörlerde şaşırtabilir.
- Bu projede site içi linklerde hep mutlak yol kullanacağız — tutarlılık kafa karışıklığını önler.

## 📖 Bölüm 4: Hap ekranının gövdesi

```html
<body>
  <main class="gate">
    <h1>Begum Donmez</h1>
    <p class="gate-subtitle">Game Developer & Designer</p>

    <nav class="gate-choices" aria-label="Site version selection">
      <a class="pill pill--blue" href="/cv/">
        <span class="pill-title">The straightforward one</span>
        <span class="pill-hint">CV, projects, contact — quick and clear</span>
      </a>
      <a class="pill pill--red" href="/world/">
        <span class="pill-title">The rabbit hole</span>
        <span class="pill-hint">An interactive world. Sound on, curiosity required</span>
      </a>
    </nav>
  </main>
</body>
```

(Metinler öneri — kendi sesinle yaz. Matrix göndermesini istediğin dozda kullan.)

NEDEN'ler:
- **`<main>`** — "sayfanın ana içeriği". Ekran okuyucu kullanıcısı doğrudan buraya atlayabilir. Sayfada bir tane olur.
- **`<h1>`** — sayfa başına TAM BİR TANE. Sayfanın konusu ne ise h1 odur.
- **`<nav aria-label="...">`** — gezinme bölgesi; `aria-label` ekran okuyucuya bölgenin adını söyler
  (sayfada birden çok nav olursa ayırt edilir).
- **`class="pill pill--blue"`** — İKİ sınıf: `pill` = ortak görünüm (boyut, köşe, font),
  `pill--blue` = sadece renk farkı. Bu adlandırmaya **BEM** denir (`blok--varyant`).
  Ortak stil bir kez yazılır; tekrar = gelecekteki hata kaynağı.
- **`<span>`** — anlamsız satır-içi kutu (div'in satır-içi kardeşi). Başlık/ipucu metinlerini
  ayrı stillendirebilmek için sarıyoruz.

## ⚠️ Sık yapılan hatalar

1. Etiketi kapatmayı unutmak (`<p>` açık kalır) → sayfa "çalışır gibi" görünür ama DOM bozuktur,
   CSS garip davranır. Editörün renklendirmesine güven, girintiye özen göster.
2. `<title>`'ı `<body>`'ye yazmak — çalışmaz, title `<head>`'in malıdır.
3. Türkçe karakterli dosya/klasör adı (`görseller/`) — URL'lerde sorun çıkarır. Klasör adları hep
   İngilizce küçük harf: `assets`, `css`, `js`.
4. `index.html` yerine `Index.html` — sunucuların çoğu büyük/küçük harfe duyarlıdır. Hep küçük harf.

## ✏️ Görevler

1. Repo kökünde şu yapıyı kur (boş dosyalar):
   ```
   index.html · cv/index.html · world/ (boş klasör) · css/base.css · css/cv.css · js/ · data/ · assets/
   ```
2. `index.html`'e iskeleti + hap ekranı gövdesini yaz. Önce KİTABI KAPAT, hatırladığın kadar yaz;
   sonra açıp karşılaştır. Farklar = öğreneceğin yerler.
3. Dosyaya çift tıklayıp tarayıcıda aç. Çirkin ve düz görünecek — DOĞRU, stil sonraki ders.
4. Tarayıcıda sağ tık → "İncele" (DevTools) → Elements sekmesi → yazdığın ağacı gör.
5. Commit: `Add entry gate page skeleton` (+ push istersen).

## ✅ Kontrol — cevaplayamıyorsan derse geri dön

1. `<!DOCTYPE html>` olmasa ne olur, bu modun adı ne?
2. Viewport meta satırı silinirse site telefonda nasıl görünür, neden?
3. Hap seçenekleri neden `<button>` değil `<a>`?
4. `pill pill--blue` — neden tek sınıf değil de iki sınıf?
5. `/cv/` ile `cv/` arasındaki fark ne?

→ Sonraki ders: [1.2 — CSS temelleri ve tasarım sistemi](faz1-ders2-css-tasarim-sistemi.md)
