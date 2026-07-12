# Ders 1.5 — Responsive Tasarım

> 🎯 **Bu dersin sonunda:** Site 375px'lik telefondan 27" monitöre kadar her boyutta düzgün
> görünecek ve "mobile-first" düşünmeyi öğrenmiş olacaksın.

---

## 📖 Bölüm 1: Responsive'in gerçek anlamı

Responsive = her ekran için ayrı tasarım yapmak DEĞİL; **kendini akışkanca uyarlayan TEK tasarım.**
Sen zaten yarısını yaptın:
- `max-width: 100%` görseller → taşmıyor
- `auto-fit` Grid → sütun sayısı kendini ayarlıyor
- `ch`/`rem` birimleri → içerikle ölçekleniyor
- viewport meta → telefon 1:1 gösteriyor

Media query, bu akışkan temelin YETMEDİĞİ yerlerde devreye girer — son çare, ilk araç değil.

## 📖 Bölüm 2: Mobile-first — neden bu yön?

```css
/* TEMEL = mobil (media query YOK) */
.hero { padding: 2.5rem 0; }
.contact-links { flex-direction: column; }

/* GENİŞ EKRAN EKLERİ */
@media (min-width: 768px) {
  .hero { padding: 5rem 0; }
  .contact-links { flex-direction: row; }
}
```

*Neden önce mobil?* Dar ekran, tasarımın en basit hali (tek sütun, doğal akış). Genişletmek =
üzerine EKLEMEK. Ters yön (önce masaüstü, sonra mobil için bozup düzeltmek) hep daha çok kod,
daha çok `!important`, daha çok hata üretir. `min-width` = "bu genişlik VE ÜSTÜ için".

**Kırılma noktası içeriğe göre seçilir, cihaza göre değil:** pencereyi yavaşça daralt; tasarım
nerede "bozuldu" hissi veriyorsa media query oraya. ~768px ve ~1024px klasik başlangıçlar ama
kutsal değiller.

## 📖 Bölüm 3: Mobilde sticky menü

Menü linklerin mobilde sığmayabilir. Hamburger menü YAPMAYACAĞIZ — 4 link için JS'li menü gereksiz
karmaşıklık (YAGNI). Daha zarif çözüm: yatay kaydırılabilir menü:

```css
.site-header nav {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;          /* sığmazsa yana kaydırılır */
}
```

## 📖 Bölüm 4: Dokunma hedefleri ve test

- Tıklanabilir her şey en az **44×44px** (parmak, imleç kadar hassas değil). Küçük linke `padding` ver.
- Test aracı: DevTools **cihaz modu** (Cmd+Shift+M). Şu üçünde tam tur at:
  **375px** (telefon) · **768px** (tablet) · **1280px** (laptop).
- Altın kural: **yatay kaydırma çubuğu ASLA çıkmamalı.** Çıkıyorsa bir eleman taşıyor.
  Suçluyu bulma tekniği: DevTools → Elements'te elemanların üzerinde gezin; taşan eleman
  vurgulanınca görünür. (Sık suçlular: sabit `width`, uzun kesintisiz metin, negatif margin.)

## 📖 Bölüm 5: Hap ekranı mobilde

İki hap yan yana mobilde sığmaz → temel halde alt alta (`flex-direction: column`), 768px+ yan yana.
Bu dersin mini uygulaması — kendin çöz.

## ⚠️ Sık yapılan hatalar

1. Media query'yi dosyanın rastgele yerine yazmak → ilgili kuralın YANINA ya da dosya sonuna
   düzenli blok halinde; karışırsa cascade sürprizleri başlar.
2. `max-width` ile `min-width` karıştırmak — mobile-first'te neredeyse hep `min-width`.
3. Sadece DevTools'ta test etmek — gerçek telefonda da bak (Vercel önizleme linki Ders 1.7'de;
   o zamana kadar telefonu aynı Wi-Fi'a bağlayıp `http://<bilgisayar-ip>:8000` ile bakabilirsin).
4. Metni mobilde aşırı küçültmek — gövde metni 16px'in (1rem) altına İNMEZ.

## ✏️ Görevler

1. Cihaz modunda 375px'e al; her iki sayfada yukarıdan aşağı gez, bozulan her şeyi not et.
2. Hapları mobilde alt alta, geniş ekranda yan yana yap.
3. CV'de gereken media query'leri ekle (az olmalı — çoksa temel akışkanlık eksik demektir, bana sor).
4. Yatay taşma avı: hiçbir genişlikte yatay scrollbar yok.
5. 768 ve 1280'de de tur at.
6. Commit: `Make pages responsive`.

## ✅ Kontrol

1. Mobile-first neden daha az kod üretir?
2. `@media (min-width: 768px)` hangi ekranlarda uygulanır?
3. Kırılma noktasını neye göre seçersin?
4. Yatay scrollbar çıktı — nasıl iz sürersin?
5. Hamburger menü neden yapmadık, hangi prensip?

→ Sonraki ders: [1.6 — Görseller ve varlıklar](faz1-ders6-gorseller.md)
