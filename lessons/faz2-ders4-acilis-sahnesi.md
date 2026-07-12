# Ders 2.4 — Açılış Sahnesi (Deneyimin En Önemli Anı)

> 🎯 **Bu dersin sonunda:** Siyah ekran → parlayan top → E → ışık dalgası + anlatıcı + kamera
> geçişi zinciri çalışıyor olacak. Planındaki söz: "bu geçiş deneyimin en önemli anı — özel efor."

---

## 📖 Bölüm 1: Durum makinesi — önce omurga

Deneyim akışı net durumlardan geçer (Unity'den tanıdık desen):

```js
const State = { INTRO: 'intro', TRANSITION: 'transition', CORRIDOR: 'corridor',
                ROOM: 'room', COMPUTER: 'computer' };
let state = State.INTRO;
```

Kural: **her davranış hangi durumlarda geçerli olduğunu bilir.**
- INTRO: yürüme YOK, sadece topa E.
- TRANSITION: TÜM girdiler kilitli (kamera uçarken oyuncu karışamaz).
- CORRIDOR/ROOM: yürüme + E.
- COMPUTER: sadece ESC.

`animate()` içindeki hareket/raycast kodunu `if (state === State.CORRIDOR || state === State.ROOM)`
ile sarmala. Bu disiplin olmadan "zoom sırasında yürüdüm, kamera uçtu" hataları KAÇINILMAZ.

## 📖 Bölüm 2: Işık topu — emissive + bloom

Top (plandan): beyaz ama %10-15 turuncuya çekilmiş sıcak beyaz, hareketSİZ — sembolik eşik.

```js
const orb = new THREE.Mesh(
  new THREE.SphereGeometry(0.25, 16, 16),
  new THREE.MeshStandardMaterial({
    emissive: new THREE.Color(0xFFF2E0),   // sıcak beyaz — hafif turuncu hale
    emissiveIntensity: 3,
    color: 0x000000
  })
);
```

Bloom = parlak yüzeylerin ışıması. Render artık efekt zincirinden geçer (Unity post-processing stack):

```js
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight),
  0.8,   // strength — ışıma gücü
  0.4,   // radius — yayılma
  0.85   // threshold — bu parlaklığın ÜSTÜ ışır (yüksek tut ki YALNIZ top ışısın)
));

// animate()'te artık: composer.render();  (renderer.render değil!)
```

- `threshold` düşükse duvarlar bile ışır → ucuz görünüm. Yüksek threshold + tek emissive obje =
  topun büyüsü.

## 📖 Bölüm 3: Sahne kurulumu

- Ortam ışığı YOK ya da kısık (`AmbientLight` 0.05) — gerçek siyahlık.
- Maskot GLB'si + yanında top. Kamera third-person: maskotun arkasında, hafif yukarıda.
- Davet metni HTML overlay: *"reach for the light"* tarzı ("catch" DEĞİL — kaçan bir şey ima etmesin).
  Fraunces, ekran ortasının altında, yumuşak fade-in. İlk etkileşim 10-15 sn'den kısa sürmeli —
  metin + tek E basışı, bulmaca değil.

## 📖 Bölüm 4: Dokunuş anı — üç şey AYNI ANDA

E (top menzilde) → `state = TRANSITION` → tek fonksiyon üçünü birden ateşler:

**1. Işık dalgası** — koridor lambaları sıradan, gecikmeli yanar:

```js
corridorLights.forEach((light, i) => {
  light.userData.turnOnAt = clock.elapsedTime + i * 0.35;   // soldan sağa 0.35 sn arayla
});
// animate()'te: zamanı gelen ışığın intensity'sini lerp'le 0 → hedef
```

**2. Anlatıcının İLK cümlesi** tam bu anda başlar (ses sistemi Ders 2.7'de — şimdilik
`playNarration('intro')` diye boş bir fonksiyon çağır; iskelet bugünden dursun).

**3. Kamera dolly'si** — 1-2 sn, sert kesme YOK:

```js
// Yol: maskotun arkası → omzu → göz hizası. Üç nokta arası yumuşak eğri:
const path = new THREE.CatmullRomCurve3([behindPos, shoulderPos, eyePos]);
let t = 0;
// animate()'te (state === TRANSITION):
t = Math.min(t + delta / 1.5, 1);            // 1.5 saniyede tamamla
const eased = t * t * (3 - 2 * t);           // smoothstep — başta/sonda yumuşak
camera.position.copy(path.getPoint(eased));
camera.lookAt(lookTarget);
if (t === 1) state = State.CORRIDOR;         // varış: kontrol oyuncuda, first-person
```

- **`CatmullRomCurve3`** — noktalardan geçen yumuşak eğri (Unity spline mantığı).
- **Easing (`smoothstep`)** — lineer hareket mekanik durur; ivmelenme/yavaşlama doğallık verir.
  Animasyonun evrensel sırrı: easing her şeydir.

## 📖 Bölüm 5: His ayarı — mühendislik değil, zanaat

Süreleri koda sabit yazma; üstte "ayar paneli" nesnesi tut:

```js
const TUNING = { lightDelay: 0.35, dollyDuration: 1.5, bloomStrength: 0.8 };
```
Sonra defalarca izle-ayarla-izle. Planındaki "özel efor" bu döngüdür. Bir oyun geliştirici olarak
bunu zaten biliyorsun: **feel, iterasyonla bulunur.** 10-15 tur normaldir.

## ⚠️ Sık yapılan hatalar

1. `composer.render()` yerine `renderer.render()` bırakmak → bloom "çalışmıyor" sanırsın.
2. Threshold düşük → her şey ışır, büyü ölür.
3. TRANSITION'da girdileri kilitlememek → kamera uçarken yürüme = kaos.
4. Lineer kamera (easing'siz) → asansör hissi. Smoothstep şart.
5. Işık dalgasını `setTimeout` zinciriyle yapmak → animate saatiyle senkron kopar;
   zamanlamayı hep `clock`'tan yürüt.

## ✏️ Görevler

1. Durum makinesi + girdi kilitleri.
2. Top (emissive) + bloom zinciri. Threshold'la oyna: farkı GÖR.
3. Davet metni overlay (fade-in).
4. Dokunuş anı: ışık dalgası + `playNarration` iskeleti + dolly. TUNING panelinle 10 tur his ayarı.
5. Arkadaşına izlet, kronometre tut: ilk E'ye kadar 15 sn'den kısa mı?
6. Commit: `Add opening scene with light wave transition`.

## ✅ Kontrol

1. Durum makinesi hangi hata sınıfını kökten önler?
2. Bloom threshold ne belirler, neden yüksek tuttuk?
3. Dokunuş anında hangi ÜÇ şey senkron başlar?
4. Easing olmayan kamera neden kötü hisseder?
5. Süreleri neden TUNING nesnesinde tuttuk?

→ Sonraki ders: [2.5 — Koridor içeriği](faz2-ders5-koridor.md)
