# Ders 1.2 — CSS Temelleri ve Tasarım Sistemi

> 🎯 **Bu dersin sonunda:** Hap ekranı "Gece Yanığı" paletiyle güzel görünecek ve projenin tüm
> tema sistemi (Faz 3'teki sihirli dönüşümün altyapısı!) kurulmuş olacak.

---

## 📖 Bölüm 1: CSS nasıl düşünür?

CSS = **seçici + kurallar bloğu**:

```css
h1 {                 /* seçici: hangi elemanlar? */
  color: #14213D;    /* özellik: değer; */
  font-size: 3rem;
}
```

Seçici türleri (şimdilik gerekenler):
- `h1` → etiket seçici (tüm h1'ler)
- `.pill` → sınıf seçici (class="pill" olanlar) — **ana aracımız bu**
- `.pill:hover` → durum (üzerine gelince)
- `.gate .pill` → iç içe (gate İÇİNDEKİ pill'ler)

Üç temel mekanizma:

1. **Kalıtım:** Yazı rengi, font gibi özellikler ebeveynden çocuğa geçer. `body`'ye font ver → her şey alır.
2. **Cascade:** Aynı elemana çakışan kurallar varsa, daha **özgül** seçici kazanır (sınıf > etiket);
   eşitlikte sonra yazılan kazanır. CSS dosya sırasının önemli olmasının sebebi bu.
3. **Box model:** Her eleman bir kutu: **içerik → padding (iç boşluk) → border → margin (dış boşluk)**.
   DevTools'ta bir elemana tıkla → sağda renkli kutu şemasını gör. Bu şemayı okumayı öğrenmek = CSS'in yarısı.

## 📖 Bölüm 2: CSS değişkenleri — projenin kalbi

`css/base.css` en üstüne:

```css
:root {
  /* Renkler — "Gece Yanığı" paleti */
  --color-bg: #F5F3EF;          /* zemin: kırık beyaz */
  --color-text: #14213D;        /* metin: koyu lacivert — saf siyah YASAK */
  --color-accent: #FCA311;      /* vurgu — sayfanın max %5-10'u */
  --color-accent-dark: #D9880A; /* link/küçük metin vurgusu */
  --color-muted: #8D99AE;       /* ikincil metin: tarihler, alt bilgiler */

  /* Tipografi */
  --font-heading: "Fraunces", Georgia, serif;
  --font-body: "Space Grotesk", system-ui, sans-serif;
}
```

Kullanım: `color: var(--color-text);`

NEDEN'ler:
- **`:root`** = `<html>` elemanı. En tepede tanımlanan değişken kalıtımla her yere iner.
- **İsim role göre, renge göre DEĞİL:** `--color-orange` değil `--color-accent`. Katman B'de vurgu
  başka renk olacak; ismin doğru kalması lazım. **Faz 3'teki tema dönüşümü = bu değerlerin
  `body.magic` altında değişmesi.** Bugünkü 10 dakikalık disiplin, o gün günlerce iş tasarrufu.
- **Font sonundaki yedekler** (`Georgia, serif`): Google Fonts inmezse tarayıcı en yakın sistem
  fontunu kullanır — sayfa asla fontsuz kalmaz.

## 📖 Bölüm 3: Reset — tarayıcı varsayılanlarını sıfırla

Her tarayıcı elemanlara kendi varsayılan stilini verir ve bunlar tarayıcılar arasında azıcık farklıdır.
`base.css`'e (değişkenlerden sonra):

```css
*, *::before, *::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

img, video {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;          /* linkler varsayılan maviyi değil metnin rengini alsın */
}
```

NEDEN'ler:
- **`box-sizing: border-box`** — modern CSS'in 1 numaralı kuralı. Varsayılanda `width: 300px` =
  "İÇERİK 300px, padding + border HARİÇ" → kutu beklediğinden büyük çıkar, hesap tutmaz.
  `border-box` = 300px kutunun DIŞ genişliğidir. Herkes ilk satırda bunu yapar.
- **`margin: 0`** — h1'in, p'nin gizli varsayılan boşluklarını sıfırla. Boşluğu bilinçli biz veririz.
- **`display: block`** — img varsayılanda satır-içi davranır ve altında gizemli 3-4px boşluk bırakır
  (yazı taban çizgisi hizası yüzünden). Block yapınca dert biter.

## 📖 Bölüm 4: Google Fonts

1. fonts.google.com → Fraunces (400, 600, 700 ağırlıkları) + Space Grotesk (400, 500, 700) seç.
2. Verdiği `<link>` etiketlerini `index.html`'in `<head>`'ine, CSS linkinden ÖNCE koy.
3. Linkte `display=swap` olduğundan emin ol.

NEDEN'ler:
- **Sadece kullanılacak ağırlıklar:** her ağırlık ayrı dosya = ayrı indirme. 9 ağırlık yüklemek israf.
- **`display=swap`:** font inene kadar yedek fontla metni GÖSTER; font gelince değiştir.
  Alternatifi: metin fontsuz boş bekler (kötü).

## 📖 Bölüm 5: Hap ekranını giydirmek

Ortalamanın modern yolu — flexbox:

```css
body {
  min-height: 100svh;             /* gövde en az ekran boyu */
  display: flex;
  align-items: center;            /* dikeyde ortala (row yönünde çapraz eksen) */
  justify-content: center;        /* yatayda ortala */
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
}
```

- **`100svh`** = küçük viewport yüksekliği (mobilde adres çubuğu hesaba katılmış hali; `100vh`'nin
  mobil sorunlarını çözer). Bunsuz body içeriği kadar kısadır, "dikeyde ortala" diyecek yer olmaz.
- **Flexbox** = tek boyutlu dizilim (satır YA DA sütun). İki boyut gerekince Grid (Ders 1.4).

Hapların iskelet stili (değerlerle oyna, kendi zevkine getir):

```css
.pill {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;                    /* çocuklar arası boşluk — margin derdine son */
  padding: 2rem 2.5rem;
  border-radius: 999px;           /* hap görünümü: dev yuvarlak köşe */
  text-decoration: none;          /* linkin altı çizgisini kaldır */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pill:hover {
  transform: translateY(-4px);    /* hafifçe yüksel */
  box-shadow: 0 12px 24px rgb(20 33 61 / 0.15);
}
```

NEDEN'ler:
- **`gap`** — flex/grid çocukları arasına boşluk. Eskiden margin ile yapılırdı ve "son elemanın
  margin'i fazla" derdi vardı; gap bunu kökten çözer.
- **Hover'da `transform`** — tarayıcı transform'u GPU'da ucuza çizer; `top/margin` değiştirmek her
  karede sayfa düzenini yeniden hesaplatır (Unity'de her frame'de physics rebuild gibi düşün).
- **`transition` normal durumda tanımlı** — hover'a girerken VE çıkarken yumuşak olsun diye.
- **`rgb(20 33 61 / 0.15)`** — lacivertin %15 saydam hali; gölgeler saf siyahla değil metin rengiyle
  yapılırsa palet tutarlı kalır.
- Renk varyantları: `.pill--blue { background: ...; }` `.pill--red { ... }` — mavi hap "düz/güvenli"
  hisli (lacivert tonları), kırmızı hap merak uyandıran (turuncu vurgu burada meşru — büyük eleman).

Son adım — HTML'e bağla (`</head>`'den önce):
```html
<link rel="stylesheet" href="/css/base.css">
```

## ⚠️ Sık yapılan hatalar

1. **CSS değişip sayfa değişmiyor** → %90 önbellek. Sert yenile: Cmd+Shift+R. (DevTools açıkken
   Network sekmesinde "Disable cache" işaretle — geliştirirken hep açık kalsın.)
2. **`var(--color-text)` çalışmıyor** → değişken `:root`'ta mı? İsim birebir aynı mı (tire sayısı!)?
3. **Ortalama çalışmıyor** → body'de `min-height` var mı? Flex özellikleri EBEVEYNE yazılır,
   çocuğa değil (Unity'deki LayoutGroup gibi: ayar konteynerde).
4. **Font değişmedi** → font linki CSS'ten önce mi? Font adı tırnak içinde ve birebir doğru mu?

## ✏️ Görevler

1. `base.css`: değişkenler + reset + body stilleri.
2. `index.html`'e font linkleri + CSS linki.
3. Hapları stillendir: ortak `.pill` + `--blue`/`--red` varyantları + hover.
4. DevTools'ta bir hapı seç, box model şemasında padding'ini gör; Styles panelinde canlı değer
   değiştirerek oyna (değişiklikler geçici — dosyaya yansımaz, deneme alanıdır).
5. Commit: `Style entry gate with design system`.

## ✅ Kontrol

1. `box-sizing: border-box` neyi değiştirir? Varsayılan davranış neden sorunlu?
2. `--color-accent` ismi neden `--color-orange`'dan iyi? (Faz 3'ü düşün.)
3. Cascade'de çakışan iki kuraldan hangisi kazanır?
4. Hover animasyonunda neden `margin-top` değil `transform` kullandık?
5. `gap` neyi çözer, eski yöntem neydi?
6. Font linkindeki `display=swap` ne işe yarar?

→ Sonraki ders: [1.3 — CV sayfası: anlamsal yapı](faz1-ders3-semantik-html.md)
