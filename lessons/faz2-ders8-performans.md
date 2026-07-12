# Ders 2.8 — Kaçış, Mobil, Performans (Faz 2 Finali)

> 🎯 **Bu dersin sonunda:** Deneyim kibar (her an çıkış var), mobilde akıllı (CV'ye yönlendirir),
> ve akıcı (60fps). Faz 2 YAYINLANIR. 🚀

---

## 📖 Bölüm 1: Kaçış — deneyim hediye, hapishane değil

- **Her ekranda** köşede sabit çıkış: "Skip → straight to the site" (HTML overlay, küçük, hep görünür).
  Bir tıkla `/cv/`ye. Kullanıcının vakti senin sanatından değerli — bu saygı, sanatı DAHA çekici yapar.
- İlk etkileşim (topa E) 10-15 sn'den kısa — Ders 2.4'te kronometreyle test etmiştin; yayın öncesi bir tur daha.

## 📖 Bölüm 2: Mobil — yetenek tespiti, ekran boyu değil

Ok tuşları + E mobilde yok → mobil kullanıcı otomatik `/cv/`ye, kısa bir notla:

```js
const isTouchOnly = matchMedia('(pointer: coarse)').matches && !matchMedia('(pointer: fine)').matches;
if (isTouchOnly) {
  // yönlendirme ekranı: "The interactive world needs a keyboard —
  //  it's waiting for you on desktop. Meanwhile, here's the classic version →"
  location.href = '/cv/?from=world';
}
```

NEDEN'ler:
- **`pointer: coarse`** = kaba işaretçi (parmak). Ekran GENİŞLİĞİ değil YETENEK ölçüyoruz:
  küçük pencereli laptop masaüstüdür, klavyeli tablet gri alandır — genişlik yalan söyler.
- Anında sessiz yönlendirme yerine tek cümlelik açıklama ekranı: kullanıcı "site bozuk" sanmasın,
  "masaüstünde beni bir dünya bekliyor" bilgisini alsın (merak tohumu!).
- Dokunmatik joystick = v2 (plan). Şimdi değil — YAGNI.

## 📖 Bölüm 3: Performans — ölç, tahmin etme

**Ölçüm araçları:**
1. **FPS hissi:** Chrome DevTools → Cmd+Shift+P → "Show frames per second" (FPS meter).
2. **`renderer.info`** — konsola yazdır: `render.calls` (draw call), `render.triangles`.
   Hedefler: draw call < 100, üçgen < 100k (bütçemiz ~5-10k poly — çok rahatız; şişme varsa kaçak var).
3. **DevTools Performance sekmesi:** kaydet → uzun karelerin neye gittiğine bak.

**Klasik kaçaklar ve çözümleri:**

| Belirti | Sebep | Çözüm |
|---|---|---|
| Draw call yüksek | her kitap ayrı materyal | materyal paylaş (aynı görünüm = tek materyal) |
| İlk saniyeler takılıyor | texture'lar büyük | 512-1024px kuralına dön; toplam GLB+texture < 5MB hedefle |
| Zoom'da ani düşüş | bloom çözünürlüğü | bloom pass boyutunu yarıya indir (görsel fark: yok denecek kadar) |
| Sekme değişince ses kaosu | rAF durur ama ses akar | `visibilitychange` olayında sesleri duraklat |

**Yükleme performansı:** tüm GLB'ler baştan yükleniyor (yükleme ekranı yok kuralı) →
toplam varlık bütçesi disiplin ister: modeller + texture + ses ≈ 10-15MB tavan.
Aşarsan: ses bitrate'lerini düşür, texture'ları sık, modelleri gözden geçir — SIRASIYLA
(en büyük dosyadan başla: `ls -lhS assets/models assets/audio`).

## 📖 Bölüm 4: Faz 2 yayın kontrol listesi

- [ ] Açılış → koridor → oda tam akış, durum makinesi sağlam (her durumda doğru girdiler)
- [ ] Tüm etkileşimler (≤6) çalışıyor, E ipucu tutarlı
- [ ] Ses izni ekranı; sessiz mod TAM işlevsel; her ses altyazılı
- [ ] Ducking yumuşak; kaset değişimi öncekini kesiyor
- [ ] Skip her ekranda; ilk etkileşim < 15 sn
- [ ] Mobil yönlendirme + açıklama ekranı
- [ ] Orta seviye laptopta 60fps; toplam varlık < 15MB
- [ ] `/cv/` footer'ındaki davet linki `/world/`e geliyor (döngü tamam)
- [ ] Vercel önizlemede 2-3 kişiye TEST ettir (sen artık göremezsin — taze göz şart)
- [ ] PR → main → YAYIN 🎉

Yayınladıysan: bu, portfolyonun kendisi bir portfolyo parçası artık. LinkedIn'de paylaş —
"her satırını kendim yazdım" notuyla. 💪

## ✅ Kontrol

1. Mobil tespiti neden ekran genişliğiyle yapılmaz?
2. Draw call nedir, nasıl düşürülür?
3. `visibilitychange` neden gerekli?
4. Varlık bütçesini aşınca ilk nereye bakarsın?
5. Neden başkalarına test ettirmek şart?

→ Sonraki faz: [3.1 — İçeriği JSON'a taşıma](faz3-ders1-json-refactor.md)
