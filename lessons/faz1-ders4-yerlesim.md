# Ders 1.4 — CV Sayfası: Yerleşim ve Stil

> 🎯 **Bu dersin sonunda:** CV sayfası tipografisi oturmuş, proje kartları Grid'le dizilmiş,
> sticky menüsü yumuşak kayan, "tasarlanmış" hissi veren bir sayfa olacak.

---

## 📖 Bölüm 0: Yerel sunucu (önce bunu çözelim)

Dosyayı çift tıkla açmak (`file://...`) mutlak yolları (`/css/base.css`) bozar — kök, diskin kökü
sanılır. Çözüm: klasörü küçük bir yerel sunucuyla aç. En kolayı VS Code **Live Server** eklentisi
(sağ alt "Go Live") ya da terminalde:

```
python3 -m http.server 8000
```
→ tarayıcıda `http://localhost:8000`. Artık site gerçek sunucudaki gibi davranır; linkler,
mutlak yollar, her şey doğru çalışır. Bundan sonra HEP böyle test et.

## 📖 Bölüm 1: Okunabilirlik = satır uzunluğu

Tipografinin demir kuralı: bir satır **45-75 karakter**. Daha uzun → göz satır başına dönerken kaybolur.
CSS'te birimi var: `ch` (yaklaşık bir karakter genişliği).

```css
.container {
  max-width: 72ch;
  margin-inline: auto;      /* yatayda ortala */
  padding-inline: 1.5rem;   /* dar ekranda kenara yapışmasın */
}
```

- **`rem`** = kök font boyutunun katı (varsayılan 16px → 1.5rem = 24px). *Neden px değil?*
  Kullanıcı tarayıcı yazı boyutunu büyütmüşse rem'ler birlikte büyür — erişilebilirlik bedava.
  Kural: yazıyla ilişkili her ölçü rem; ince çizgi gibi sabit detaylar px olabilir.
- **`margin-inline` / `padding-inline`** = sol+sağ kısayolu (modern "mantıksal özellik").

Tipografi ölçeği — `base.css`'e:

```css
body { line-height: 1.6; }                       /* gövde satır aralığı */
h1, h2, h3 { font-family: var(--font-heading); line-height: 1.2; }
h1 { font-size: 2.75rem; }
h2 { font-size: 1.75rem; }
h3 { font-size: 1.25rem; }
.dates, .tagline { color: var(--color-muted); }
```

- Başlıkta satır aralığı DAR (1.1-1.2), gövdede FERAH (1.5-1.7) — büyük yazı sıkı, küçük yazı havadar ister.
- Boyutlar öneri; oranı koru (her seviye bir öncekinden belirgin küçük).

## 📖 Bölüm 2: Boşluk ritmi

Amatör ve profesyonel sayfayı ayıran şey renk değil, **boşluk tutarlılığıdır.** Rastgele değerler
(23px, 37px...) yerine bir ölçek seç ve sadık kal: `0.5rem / 1rem / 1.5rem / 2rem / 4rem`.

```css
section { padding-block: 4rem; }     /* bölümler arası nefes */
article + article { margin-top: 2rem; }  /* ardışık kartlar arası */
```

- **`article + article`** — "bir article'ı takip eden article" (komşu seçici). İlk elemanın üstüne
  boşluk koymamanın zarif yolu.

## 📖 Bölüm 3: Grid — proje kartları

Flexbox tek boyut (satır YA sütun); ızgara için Grid:

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

Bu tek satır şunu der: "Her sütun en az 280px olsun; sığdığı kadar sütun aç; artan alanı eşit dağıt."
Sonuç: telefonda 1, tablette 2, geniş ekranda 3 sütun — **media query yazmadan.** Grid'in gücü bu.

Kart stili fikirleri: `border-radius`, ince `border: 1px solid` (muted rengin saydamı),
hover'da hafif yükselme (Ders 1.2'deki transform kalıbı). Turuncu DEĞİL — vurgu bütçesini harcama.

## 📖 Bölüm 4: Sticky menü + yumuşak kaydırma

```css
.site-header {
  position: sticky;
  top: 0;                          /* nereye yapışsın */
  background: var(--color-bg);     /* altından içerik görünmesin */
  z-index: 10;                     /* içeriğin ÜSTÜNDE kalsın */
}

html { scroll-behavior: smooth; }

section { scroll-margin-top: 5rem; }
```

NEDEN'ler:
- **`sticky` vs `fixed`:** sticky normal akışta yer kaplar, ekrandan çıkacağı an yapışır;
  fixed baştan akıştan çıkar ve içeriğin üstüne biner (altına padding hack'i gerekir). Sticky temiz.
- **`z-index`** — üst üste binme sırası. Sadece konumlandırılmış elemanlarda çalışır.
- **`scroll-behavior: smooth`** — `#projects` linki ışınlanma yerine kayarak gider. Sıfır JS.
- **`scroll-margin-top`** — kaydırma hedefinin üstüne pay koyar; yoksa bölüm başlığı sticky menünün
  ALTINDA kalır (çok yaygın, çok gözden kaçan hata).

## 📖 Bölüm 5: Vurgu disiplini + CTA butonu

Turuncu (#FCA311) bütçesi: **PDF butonu, aktif/önemli linkler, ufak detaylar. Toplam %5-10.**
Her şey vurgulanırsa hiçbir şey vurgulanmaz.

```css
.cta {
  display: inline-block;
  background: var(--color-accent);
  color: var(--color-text);        /* turuncu üstünde lacivert: yüksek kontrast */
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
}

.cta:hover { background: var(--color-accent-dark); }

p a, li a { color: var(--color-accent-dark); }   /* metin içi linkler koyu turuncu */
```

- Metin içi linklerde `--color-accent-dark` kullanılır çünkü açık zeminde parlak turuncu küçük
  metinde **kontrast testinden geçmez** (WCAG erişilebilirlik standardı — Lighthouse bunu ölçecek).

## ⚠️ Sık yapılan hatalar

1. `cv.css`'i `base.css`'ten ÖNCE linklemek → cascade ters döner, geçersiz kılmalar çalışmaz.
   Sıra: önce temel, sonra özel.
2. Ortalamayan container → `max-width` var ama `margin-inline: auto` unutulmuş.
3. Sticky çalışmıyor → ebeveynlerden birinde `overflow: hidden` olabilir (sticky'nin bilinen düşmanı).
4. Her yere turuncu — vurgu bütçesi aşıldıysa geri al.
5. DevTools'ta düzeltip dosyaya yazmayı unutmak — DevTools değişiklikleri kalıcı DEĞİL.

## ✏️ Görevler

1. Yerel sunucuyu kur, siteyi `localhost` üzerinden aç. Hap → CV linkinin çalıştığını gör.
2. `cv/index.html`'e `base.css` + `cv.css`'i (bu sırayla) bağla.
3. Container + tipografi ölçeği + boşluk ritmi.
4. Proje kartlarını Grid'le diz; pencereyi daraltıp sütunların kendini ayarlamasını izle.
5. Sticky menü + smooth scroll + scroll-margin. Menüden her bölüme tıklayıp test et.
6. CTA butonu + link renkleri. Sayfaya uzaktan bak: turuncu %10'un altında mı?
7. Commit: `Style CV page layout`.

## ✅ Kontrol

1. Neden yerel sunucu gerekti, `file://` neyi bozuyordu?
2. `72ch` neden 72 harf civarı? Satır uzunluğu kuralı neydi?
3. `repeat(auto-fit, minmax(280px, 1fr))` cümle olarak ne diyor?
4. `sticky` ile `fixed` farkı?
5. `scroll-margin-top` hangi görünmez hatayı önler?
6. Metin içi linkler neden `--color-accent` değil `--color-accent-dark`?

→ Sonraki ders: [1.5 — Responsive tasarım](faz1-ders5-responsive.md)
