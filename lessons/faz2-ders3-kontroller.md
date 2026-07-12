# Ders 2.3 — Kontroller ve Etkileşim (Ok Tuşları + E)

> 🎯 **Bu dersin sonunda:** Koridorda ileri/geri yürünecek, menzildeki objede "E" ipucu belirecek,
> E'ye basınca ilk etkileşim (çerçeveye zoom) çalışacak.

---

## 📖 Bölüm 1: Klavye — olay değil, durum

Tuş OLAYLARI (keydown) "basıldı" anını verir; yürüme için "basılı MI?" durumunu tutarız:

```js
const keys = {};
addEventListener('keydown', (e) => keys[e.code] = true);
addEventListener('keyup',   (e) => keys[e.code] = false);
```

`animate()` içinde:

```js
const speed = 2;                     // m/sn — insan yürüyüşü ~1.4, oyunda 2 iyi his
if (keys['ArrowUp'] || keys['KeyW'])   player.z -= speed * delta;
if (keys['ArrowDown'] || keys['KeyS']) player.z += speed * delta;

player.z = THREE.MathUtils.clamp(player.z, -corridor.length + 1, -1);  // duvardan çıkma!
camera.position.z = player.z;
```

NEDEN'ler:
- **`e.code`** (`'KeyW'`) fiziksel tuşu verir — klavye düzeninden bağımsız. `e.key` karakter verir
  (Türkçe Q'da sürpriz yapar). Oyun kontrolü = `code`.
- **W/S'yi de dinle** — oyuncular WASD'ye şartlanmış; iki tuş takımı bedava nezaket.
- **`clamp`** — Unity'deki `Mathf.Clamp`. Koridor DAR ve TEK YÖN (plan kararı): yana hareket yok,
  mouse-look yok. Ziyaretçi oyuncu değil, misafir — kaybolmak imkânsız olmalı.
- Tarayıcı ok tuşlarıyla sayfayı kaydırmasın: `keydown`'da `e.preventDefault()`
  (yalnızca ok tuşları için).

## 📖 Bölüm 2: "Neye bakıyorum?" — Raycasting

E'nin neyi tetikleyeceğini bilmek için kameradan ileri ışın atılır (Unity `Physics.Raycast`):

```js
const raycaster = new THREE.Raycaster();
const interactables = [];    // etkileşimli objeler — kayıt sistemi aşağıda
let focused = null;          // şu an menzildeki obje

function updateFocus() {
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);  // (0,0) = ekran merkezi
  const hits = raycaster.intersectObjects(interactables, true); // true = çocuklara da bak
  focused = (hits.length && hits[0].distance < 2.5)
    ? findInteractableRoot(hits[0].object)
    : null;
  hintEl.classList.toggle('visible', focused !== null);
}
```

NEDEN'ler:
- **Sadece `interactables`** taranır, tüm sahne değil — hem hız hem doğruluk (duvara "E" çıkmasın).
  Liste 5-6 objeyi geçmeyecek (plan kuralı: az ama özenli).
- **`true` (recursive) + kökü bulma:** ışın GLB'nin İÇ mesh'ine çarpar; ama bizim mantığımız kök
  objeyle çalışır. Kayıt sırasında objeye etiket koy:
  `frame.userData.interact = () => zoomTo(frame);` — `userData` = Unity'deki component verisi gibi,
  Three.js'in sana ayırdığı serbest alan. `findInteractableRoot` = çarpılan mesh'ten yukarı çıkıp
  `userData.interact`'ı olan ilk ebeveyni bulan küçük fonksiyon (sen yazacaksın — parent zinciri!).
- **Mesafe şartı (2.5m):** odanın öbür ucundaki objeye E basılamasın.

E tuşu:

```js
addEventListener('keydown', (e) => {
  if (e.code === 'KeyE' && focused) focused.userData.interact();
});
```

## 📖 Bölüm 3: "E" ipucu — HTML overlay (3D içinde UI YOK)

Plan kuralı: UI 3D'ye texture olarak gömülmez, HTML olarak üste çizilir. Neden: metin her boyutta
net, erişilebilir, stillendirmesi CSS (zaten biliyorsun!).

```html
<div id="hint" class="hint">E</div>
```
```css
.hint {
  position: fixed;
  inset: auto auto 15% 50%;
  translate: -50% 0;
  opacity: 0;
  transition: opacity 0.2s;
  /* palet + Space Grotesk — marka 3D'de de sürer */
}
.hint.visible { opacity: 1; }
```

## 📖 Bölüm 4: Yumuşak hareket — lerp kalıbı

Çekmece, kapı, kamera zoom... hepsi tek kalıp:

```js
// animate() içinde her kare:
drawer.position.z = THREE.MathUtils.lerp(drawer.position.z, targetZ, 1 - Math.pow(0.001, delta));
```

- Mantık: her karede hedefe belli oranda yaklaş → başta hızlı, sonda yumuşak (doğal his).
- `1 - Math.pow(0.001, delta)` — kare hızından bağımsız lerp katsayısı (60fps'te de 144fps'te de
  aynı hız). Basit `0.1` sabiti de iş görür ama kare hızına bağımlıdır — farkı bil, basitle başla.
- Blender animasyonu GEREKMEZ: origin'ler doğruysa (Ders 2.2) her şey pozisyon/rotasyon lerp'i.

İlk etkileşim — çerçeveye zoom:
E → kamera hedefi çerçevenin önü (lerp) → tekrar E ya da ESC → eski konuma dön. İki "kamera hedefi"
durumu arasında geçiş — durum makinesinin (Ders 2.4) minik ön izlemesi.

## ⚠️ Sık yapılan hatalar

1. Hareketi `keydown` olayında yapmak → tuş tekrarı ritminde teklemeli hareket. Durum + animate döngüsü!
2. `intersectObjects`'e `true` vermemek → GLB'lerde ışın "delip geçer" (kök objenin kendisi mesh değil).
3. Raycast'ı her karede TÜM sahneye atmak → performans; sadece interactables.
4. `preventDefault` koymamak → ok tuşları sayfayı kaydırır (fullscreen canvas'ta bile scroll olabilir).
5. Lerp'i keydown'da tek sefer çağırmak → lerp her kare çalışan bir süreçtir, tek adım değil.

## ✏️ Görevler

1. İleri/geri yürüme + clamp sınırları. Duvarların içinden geçmeyi DENE — geçemiyorsan doğru.
2. `interactables` kayıt sistemi + `updateFocus` + `findInteractableRoot`.
3. "E" ipucu overlay'i (palet + fontlarla).
4. Çerçeveye zoom in/out etkileşimi (lerp ile).
5. Commit: `Add movement and interaction system`.

## ✅ Kontrol

1. Neden tuş durumu tutuyoruz, olay başına hareket etmiyoruz?
2. `e.code` vs `e.key` — oyun kontrolünde hangisi, neden?
3. Raycast neden sadece interactables listesine atılır?
4. `userData` ne işe yarar — Unity'deki benzeri ne?
5. Lerp neden her kare çalışır? `0.1` sabitinin zayıflığı ne?

→ Sonraki ders: [2.4 — Açılış sahnesi](faz2-ders4-acilis-sahnesi.md)
