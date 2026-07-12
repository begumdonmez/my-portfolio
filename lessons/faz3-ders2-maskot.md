# Ders 3.2 — Maskot Etkileşimi

> 🎯 **Bu dersin sonunda:** Maskot doğru anda beliriyor, oyunbaz diyalog kuruyor, reddedilince
> gücenmeden köşesinde bekliyor olacak. Katman B'nin kapı zili hazır.

---

## 📖 Bölüm 1: Maskotun görseli

- 2D sprite/SVG — 3D maskotun aynı karakterde çizimi (marka bütünlüğü: A'da köşede minik 2D,
  C'de 3D yoldaş). Blender modelinden render alıp temizlemek de olur, elle çizmek de.
- 2-3 kare basit animasyon (idle salınım, zıplama) — CSS `@keyframes` yeter, sprite sheet gerekmez:

```css
@keyframes bounce {
  0%, 100% { translate: 0 0; }
  50%      { translate: 0 -12px; }
}
.mascot.excited { animation: bounce 0.6s ease-in-out 3; }   /* 3 kez zıpla, dur */
```

## 📖 Bölüm 2: Zamanlama — iki koşullu tetik

Plan: **~15-20 sn geçmiş VE en az bir kez scroll edilmiş.** Neden iki koşul? Süre tek başına
"sekmeyi açıp gitti"yi eleyemez; scroll = "gerçekten okuyor" kanıtı. İkisi = doğru an.

```js
let hasScrolled = false;
let timeReady = false;

addEventListener('scroll', () => {
  hasScrolled = true;
  maybeShowMascot();
}, { once: true, passive: true });

setTimeout(() => { timeReady = true; maybeShowMascot(); }, 17000);

function maybeShowMascot() {
  if (hasScrolled && timeReady && !mascotShown) showMascot();
}
```

NEDEN'ler:
- **`{ once: true }`** — dinleyici ilk tetikte kendini söker (her scroll'da çalışmaz — nezaket).
- **`passive: true`** — "scroll'u engellemeyeceğim" sözü; tarayıcı kaydırmayı beklemeden akıtır.
- **İki bayrak + tek kontrol fonksiyonu** — hangi koşul önce gerçekleşirse gerçekleşsin çalışır.
  (Sıraya bağlı kod = kırılgan kod.)
- Bonus incelik: kullanıcı B'yi daha önce reddettiyse bu ziyarette hiç çıkma —
  `sessionStorage.getItem('mascot-dismissed')` (aşağıda).

## 📖 Bölüm 3: Davranış — köşedeki arkadaş

Plan kuralları:
1. Sağ altta belirir (`position: fixed; right: 1.5rem; bottom: 1.5rem`), zıplar, balonda "Hey!" —
   SESSİZ, ekran kaplamaz. (Popup değil, arkadaş.)
2. 10 sn etkileşimsizlik → kenara süzülür (yarısı ekran dışına, CSS `translate` + transition),
   KAYBOLMAZ.
3. Tıklanınca diyalog balonu:
   - *"Psst... bunun bir de benim tarafımdan anlatılan hali var, görmek ister misin?"*
   - **[Evet]** → *"Hadi biraz sihir yapalım ✨"* → Ders 3.3'ün dönüşümü
   - **[Hayır]** → *"Anlaşıldı, ben buradayım 👀"* → köşeye döner + `sessionStorage.setItem('mascot-dismissed', '1')`
4. Dönüşümden SONRA maskot köşede kalır; menüsüne "eski haline döndüreyim mi?" eklenir —
   geri dönüş her an mümkün (kontrol ziyaretçide — güven böyle kurulur).

Ton kuralı: küçümseme YOK ("sıkıcı versiyondasın" değil), oyunbaz davet VAR. Ziyaretçinin
seçimi hep saygın.

## 📖 Bölüm 4: Diyalog — küçük durum makinesi

Faz 2'deki desen (yine!): maskotun durumları →
`hidden → greeting → waiting(kenarda) → asking(diyalog açık) → transformed`

```js
const mascot = {
  state: 'hidden',
  el: document.querySelector('.mascot'),
  set(state) {
    this.state = state;
    this.el.dataset.state = state;   // CSS: .mascot[data-state="waiting"] { ... }
  }
};
```

- **`data-state` + CSS** — görünüm CSS'te, mantık JS'te. Her durumun stilini
  `[data-state="..."]` seçicisiyle yaz; JS sınıf listesiyle boğuşmaz.
- Balon metinleri JS'te bir nesnede dursun (`dialog.ask`, `dialog.yes`, `dialog.no`) —
  metin düzeltmek kod aramak olmasın.

## 📖 Bölüm 5: Erişilebilirlik

- Maskot `<button aria-label="A message from the site mascot">` — klavyeyle odaklanılır (Tab),
  Enter'la tıklanır.
- Diyalog balonundaki seçenekler gerçek `<button>`'lar.
- `prefers-reduced-motion` → zıplama animasyonu kapalı, sade belirme (Ders 3.3'te derinleşecek).

## ⚠️ Sık yapılan hatalar

1. Maskotu `alert()`/modal gibi ekran kilitleyen şey yapmak → tam tersi felsefe: arkadaş, engel değil.
2. Her scroll'da dinleyici çalıştırmak → `once: true`.
3. "Hayır"dan sonra tekrar tekrar sormak → sessionStorage; ısrar = düşmanlık.
4. Zamanlamayı test için beklemek → geliştirirken süreyi 2 sn'ye indir, bitince 17 sn'ye al
   (TUNING nesnesi alışkanlığın — Faz 2'den).
5. Maskotu görselsiz beklemek → görsel hazır değilse geçici bir emoji/daire ile İSKELETİ kur;
   sanat sonra takılır (oyun geliştirmedeki greybox mantığı).

## ✏️ Görevler

1. Maskot görselini hazırla (ya da greybox placeholder).
2. Zamanlama + scroll tetiği + sessionStorage.
3. Durum makinesi + data-state CSS'leri + diyalog balonu (tüm dallar).
4. 10 sn kenara çekilme; tüm akışı hızlandırılmış sürelerle test et.
5. Klavyeyle tam tur: Tab → Enter → seçenekler.
6. Commit: `Add mascot companion with dialog`.

## ✅ Kontrol

1. Neden iki koşullu tetik?
2. `once: true` ve `passive: true` ne kazandırır?
3. "Hayır" cevabının İKİ sonucu ne? (ton + hafıza)
4. `data-state` deseni neyi ayırır?
5. Greybox yaklaşımı burada nasıl uygulandı?

→ Sonraki ders: [3.3 — Tema dönüşümü](faz3-ders3-tema-donusumu.md)
