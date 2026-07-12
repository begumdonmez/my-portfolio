# Ders 1.6 — Görseller ve Varlıklar

> 🎯 **Bu dersin sonunda:** Eski siteden seçtiğin görseller optimize edilmiş halde yeni sitede
> olacak; PDF CV inecek; sayfa ağırlığı kontrol altında olacak.

---

## 📖 Bölüm 1: Neden hayati?

Bir sayfanın ağırlığının çoğu görsellerdir. 3MB'lık bir PNG, yavaş mobil bağlantıda 10+ saniye —
İK'cı 4. saniyede gitti. Hedef: **CV sayfasının toplamı < 1MB** (görseller dahil).

## 📖 Bölüm 2: Format seçimi

| İçerik | Format | Neden |
|---|---|---|
| Fotoğraf, oyun ekran görüntüsü | **WebP** | JPG/PNG'den %30-70 küçük, kalite gözle aynı |
| Logo, ikon, basit şekil | **SVG** | Vektör: her boyutta net, minicik dosya |
| Şeffaflık gereken karmaşık görsel | WebP (destekler) | PNG'ye gerek kalmadı |

Dönüştürme (macOS, terminal):
```
sips -s format webp -s formatOptions 80 kaynak.png --out sonuc.webp
```
(80 = kalite; portfolyo görseli için 75-85 ideal.) Alternatif: squoosh.app — tarayıcıda,
önce/sonra karşılaştırmalı, çok öğretici.

## 📖 Bölüm 3: Boyutlandırma

Kural: **görsel, gösterileceği alandan büyük olmasın.** ~400px'lik kartta 2000px görsel = israfın kendisi.
Retina ekranlar için pratik kural: gösterim alanının **2 katı** yeterli (400px kart → 800px görsel).

```
sips -Z 800 gorsel.webp   # uzun kenarı 800px'e küçült
```

## 📖 Bölüm 4: `<img>` etiketini doğru yazmak

```html
<img src="/assets/ballerino-cover.webp"
     alt="Ballerino Online gameplay: dancer dodging obstacles"
     width="800" height="450"
     loading="lazy">
```

| Öznitelik | Neden |
|---|---|
| `alt` | Ekran okuyucunun okuduğu, görsel inmezse görünen metin. Anlamlı yaz ("screenshot" değil, ne GÖRÜNDÜĞÜNÜ yaz). Süs görselinde bilinçli boş: `alt=""` — okuyucu atlar. Hiç yazmamak HATA. |
| `width` + `height` | Tarayıcı görsel inmeden ORANINI bilir, yerini ayırır → içerik zıplamaz. Bu zıplamaya **layout shift** denir; Lighthouse cezalandırır, kullanıcı nefret eder. Değerler gerçek piksel oranı olmalı; CSS `max-width:100%` ile esneme yine çalışır. |
| `loading="lazy"` | Görünmeye yaklaşana kadar İNDİRME. Sayfa altındaki görseller ilk yüklemeyi şişirmez. **Hero görseline koyma** — o hemen lazım (lazy koyarsan geç gelir, layout shift yapar). |

## 📖 Bölüm 5: Eski dosyaları geri getirme (git)

Silinen her şey `main`'de duruyor. Seçerek getir:

```
git checkout main -- public/games/ballerino_online_cover.png
```

Sonra: `assets/`e taşı → WebP'ye çevir → boyutlandır → orijinal PNG'yi sil (repo'da şişkinlik bırakma).
**Sadece ihtiyacın olanı getir** — eski sitenin 40 küsur görselinin çoğu Faz 2-3'ün malzemesi, günü gelince.

Bu ders için gerekenler: 3-4 proje kapak görseli + (varsa) profil fotoğrafı + PDF CV.

## 📖 Bölüm 6: PDF CV

1. Güncel CV'yi `assets/begum-donmez-cv.pdf` gibi profesyonel bir adla koy
   (İK'cının indirdiği dosyanın ADI da CV'nin parçası — `cv_final_son2.pdf` olmaz 😄).
2. Hero'daki butona bağla: `<a class="cta" href="/assets/begum-donmez-cv.pdf" download>`.

## ⚠️ Sık yapılan hatalar

1. Kaynak PSD/4000px orijinali repoya koymak — repo şişer, git yavaşlar. Web'e giren SADECE optimize hali.
2. `width/height` yazıp CSS'te ezmeyi unutmak değil — tam tersi: HTML'deki değerler oran içindir,
   CSS `max-width: 100%` boyutu yönetir. İkisi birlikte çalışır.
3. `alt`'a "image", "photo" yazmak — okuyucu zaten "image" diye duyurur; sen İÇERİĞİ anlat.
4. Her görseli lazy yapmak — ilk ekranda görünenler eager (varsayılan) kalmalı.

## ✏️ Görevler

1. Gerekli görselleri main'den getir, WebP'ye çevir, boyutlandır, `assets/`e yerleştir.
2. Proje kartlarındaki `<img>`'leri tam öznitelik setiyle yaz.
3. PDF CV'yi ekle, butonu bağla, İNDİRİP doğrula.
4. DevTools → Network sekmesi → sayfayı yenile → alttaki toplam transfer boyutuna bak: 1MB altı mı?
5. Commit: `Add optimized assets`.

## ✅ Kontrol

1. WebP'yi ne zaman, SVG'yi ne zaman seçersin?
2. `width/height` yazmamak hangi sorunu doğurur, adı ne?
3. `loading="lazy"` hero görseline neden konmaz?
4. `alt=""` (bilinçli boş) ne zaman doğru?
5. Ağır görseli tespit etmek için DevTools'un hangi sekmesine bakarsın?

→ Sonraki ders: [1.7 — Cila ve yayın](faz1-ders7-yayin.md)
