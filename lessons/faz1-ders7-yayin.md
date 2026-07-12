# Ders 1.7 — Cila ve Yayın 🚀

> 🎯 **Bu dersin sonunda:** Site YAYINDA olacak. Lighthouse 4×90+, paylaşınca güzel kart çıkaran,
> gerçek telefonda test edilmiş, iş başvurusunda kullanılabilir bir site.

---

## 📖 Bölüm 1: Sayfanın kartviziti — meta etiketler

Her sayfanın `<head>`'ine:

```html
<meta name="description" content="Portfolio of Begum Donmez — game developer and designer. Unity, C#, game design.">

<meta property="og:title" content="Begum Donmez — Game Developer">
<meta property="og:description" content="Games, projects and experiments.">
<meta property="og:image" content="https://SITEN.com/assets/og-cover.png">
<meta property="og:url" content="https://SITEN.com/cv/">
```

- **`description`** — Google sonucundaki gri özet. Sayfa başına özgün yaz (150-160 karakter).
- **`og:*` (Open Graph)** — LinkedIn/WhatsApp/Discord'a link atınca çıkan önizleme kartı.
  Portfolyo linki İK'ya çoğu kez MESAJLA gider — o kartın şık olması ciddi fark.
  `og:image` **TAM URL** ister (https'li). Görsel boyutu: 1200×630 klasik. Kendine bir og-cover tasarla
  (isim + unvan + palet renkleri — 10 dakikalık iş, çok getirisi var).

## 📖 Bölüm 2: Favicon

```html
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
```
SVG favicon modern tarayıcılarda çalışır ve tek dosya yeter. Basit tut: baş harfler + palet rengi.
(Maskot doğunca favicon da o olur — Faz 3 notu.)

## 📖 Bölüm 3: `vercel.json` düzeltmesi

Mevcut dosyadaki SPA kuralını hatırla: "her adres → index.html". Çok sayfalı yapımızda bu YANLIŞ —
`/cv` bile hap ekranını gösterirdi. Dosyayı şuna indir:

```json
{
  "cleanUrls": true
}
```

- SPA rewrite gitti: Vercel'in varsayılanı zaten doğru — `/cv/` → `cv/index.html`.
- **`cleanUrls`** bonusu: `.html` uzantıları URL'den düşer (ileride kök dışına sayfa eklersen şık durur).

## 📖 Bölüm 4: Lighthouse — karnen

Chrome DevTools → **Lighthouse** sekmesi → Analyze. Dört not: **Performance, Accessibility,
Best Practices, SEO.** Hedef: hepsi 90+.

- Gizli pencerede çalıştır (eklentiler skoru bozar).
- Düşük her maddenin tıklanınca açıklaması var — Lighthouse aslında interaktif bir öğretmendir.
  Her uyarıyı oku, anla, düzelt. Anlamadığını bana getir.
- Beklenen klasikler: kontrast uyarısı (muted renk küçük metinde sınırda olabilir), eksik `alt`,
  sıkıştırılmamış görsel.

## 📖 Bölüm 5: Yayın akışı (git → Vercel)

1. Her şey commit'li + push'lu olsun.
2. **Önizleme:** Vercel her branch push'unda otomatik önizleme URL'i üretir (Vercel panelinde ya da
   GitHub commit'inin yanındaki ✓ işaretinde). Bu URL'i GERÇEK telefonda aç, arkadaşlarına at,
   hap ekranından PDF indirmeye kadar her akışı test et.
3. **Pull Request:** GitHub'da `portfolio-v3` → `main` için PR aç. PR = "bu değişiklikleri main'e
   almak istiyorum" ilanı; diff'i son kez gözden geçirme şansı. Başlık: "Portfolio v3 — Phase 1".
4. **Merge** = yayın. Vercel main'i otomatik deploy eder. 🎉
5. Yayın sonrası kontrol: gerçek URL'de tam tur + LinkedIn'e (yayınlamadan, önizleme kutusunda)
   linki yapıştırıp og kartını gör.

## 📖 Bölüm 6: Faz 1 bitiş kriterleri — hepsini işaretle

- [ ] Site yayında, kendi alan adında açılıyor
- [ ] `/cv/` doğrudan linki çalışıyor (İK'ya gönderilecek link bu)
- [ ] PDF CV ilk ekranda görünür ve tek tıkla iniyor
- [ ] 375px'te kusursuz, yatay scroll yok
- [ ] Lighthouse 4 kategori 90+
- [ ] Link paylaşımında og kartı düzgün çıkıyor
- [ ] Toplam sayfa ağırlığı < 1MB
- [ ] `git log` okunabilir bir hikâye anlatıyor (update yok! 😄)

**Hepsi tamam mı? TEBRİKLER — her satırını kendi yazdığın bir siten var.** ☕🎉
Kutla, dinlen, sonra Faz 2'nin kapısını çal: 3D dünya seni bekliyor.

## ⚠️ Sık yapılan hatalar

1. `og:image`'a göreli yol yazmak (`/assets/...`) — sosyal ağlar çözemez, TAM URL şart.
2. Lighthouse'u normal pencerede çalıştırıp düşük Performance'a üzülmek — gizli pencere.
3. PR'ı kendine izletmeden merge'lemek — diff'i BAK; son bakış hep bir şey yakalar.
4. Yayın sonrası test etmemek — "localhost'ta çalışıyordu" internetin en eski cümlesi.

## ✅ Kontrol

1. Open Graph etiketleri nerede işe yarar, `og:image`'ın özel şartı ne?
2. `vercel.json`'daki eski rewrite neden bizim yapıya zararlıydı?
3. Lighthouse'un 4 kategorisi ne?
4. PR nedir, doğrudan main'e push'tan farkı ne?
5. Önizleme URL'i ile production URL'i farkı ne?

→ Sonraki faz: [2.1 — Three.js merhaba dünya](faz2-ders1-threejs-giris.md)
