# Ders 2.1 — Three.js "Merhaba Dünya"

> 🎯 **Bu dersin sonunda:** `/world`'de dönen turuncu bir küp olacak ve Three.js'in dört temel
> taşını (scene, camera, renderer, mesh) Unity karşılıklarıyla kavramış olacaksın.
> ⚠️ Ön koşul: Faz 1 yayında + temel JavaScript. JS'e ilk kez giriyorsan bana söyle —
> araya 1-2 mini JS dersi koyarız (değişkenler, fonksiyonlar, olaylar, diziler/nesneler).

---

## 📖 Bölüm 1: Unity'den Three.js'e sözlük

| Three.js | Unity | Not |
|---|---|---|
| `Scene` | Scene/Hierarchy | Objelerin kabı |
| `PerspectiveCamera` | Camera | FOV, near/far aynı kavramlar |
| `WebGLRenderer` | motorun kendisi | Bir `<canvas>` elemanına çizer |
| `Mesh` = geometry + material | GameObject + MeshFilter + MeshRenderer | |
| `Object3D.position/rotation/scale` | Transform | Birebir aynı mantık |
| `requestAnimationFrame` döngüsü | `Update()` | Ama döngüyü SEN kurarsın |
| `THREE.Clock` → `getDelta()` | `Time.deltaTime` | |
| `scene.add(obj)` | Instantiate/parenting | `obj.add(child)` ile hiyerarşi |

En büyük fark: Unity'de motor kocaman bir editör; Three.js bir **kütüphane** — sahneyi kodla kurarsın,
editör yok. (Bu yüzden Blender bizim "sahne editörümüz" olacak.)

## 📖 Bölüm 2: Kurulum — build araçsız modern yol

`world/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Begum's World</title>
  <style> body { margin: 0; overflow: hidden; } </style>
  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.166.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.166.0/examples/jsm/"
    }
  }
  </script>
</head>
<body>
  <script type="module" src="/world/js/main.js"></script>
</body>
</html>
```

NEDEN'ler:
- **`importmap`** — "『three』 yazınca şu adrese bak" haritası. Build aracı olmadan modern `import`
  kullanmanın yolu. Sürümü sabitledik (0.166.0): "en son sürüm" bir gün siteni kırabilir, sabit sürüm kıramaz.
- **`type="module"`** — bu script import/export kullanır demek; ayrıca otomatik olarak sayfa
  yüklendikten sonra çalışır.
- **`overflow: hidden`** — canvas tam ekran; kaydırma çubuğu istemiyoruz.

## 📖 Bölüm 3: Minimum sahne — satır satır

`world/js/main.js`:

```js
import * as THREE from 'three';

// 1. Sahne
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);   // planımız siyah başlıyor zaten :)

// 2. Kamera: FOV 60, en-boy oranı, near 0.1, far 100
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1.6, 5);   // 1.6 = insan göz yüksekliği (metre düşün — ölçek alışkanlığı!)

// 3. Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));  // retina desteği; 2 üstü israf
document.body.appendChild(renderer.domElement);

// 4. Küp
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xFCA311 })   // paletimizin turuncusu 🧡
);
cube.position.y = 1.6;
scene.add(cube);

// 5. Işıklar — ışık yoksa StandardMaterial SİMSİYAH görünür (klasik ilk hata)
const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(3, 5, 2);
scene.add(sun, new THREE.AmbientLight(0xffffff, 0.3));

// 6. Döngü
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();       // saniye cinsinden kare süresi
  cube.rotation.y += 0.8 * delta;       // saniyede 0.8 radyan — HER cihazda aynı hız
  renderer.render(scene, camera);
}
animate();

// 7. Pencere boyutu değişince
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();      // aspect değişti → kamera matrisi yeniden
  renderer.setSize(innerWidth, innerHeight);
});
```

NEDEN'ler:
- **`requestAnimationFrame`** — "sonraki ekran karesinde beni çağır." `setInterval` KULLANMA:
  rAF ekranla senkron, arka plan sekmesinde durur (pil dostu).
- **`delta` ile çarpmak** — `Time.deltaTime` ile aynı sebep: 144Hz ekranda 60Hz'den hızlı dönmesin.
- **`setPixelRatio(min(dpr, 2))`** — retina ekranda net görüntü; ama 3x çizmek görünmez fark için
  %125 maliyet, o yüzden 2'ye sabitle.
- **`MeshStandardMaterial`** — PBR (fiziksel tabanlı); Blender Principled BSDF'in karşılığı. Işık ister.

## ⚠️ Sık yapılan hatalar

1. **Siyah ekran** — %90 üç sebepten: ışık yok / kamera objenin içinde ya da ters yöne bakıyor /
   konsolda kırmızı hata var. Her siyah ekranda İLK İŞ: DevTools Console.
2. CDN import'u yazım hatası — Console'da "Failed to resolve module" görürsün.
3. `resize`'da `updateProjectionMatrix` unutmak — pencere değişince görüntü yamulur.
4. Ölçek kaosu — baştan karar: **1 birim = 1 metre.** Blender'da da aynı. (Kapı ~2.1m, göz ~1.6m.)

## ✏️ Görevler

1. `world/index.html` + `world/js/main.js` — dönen turuncu küp.
2. Bilinçli hata dersi: ışık satırlarını yorum yap (`//`), siyah küpü gör, geri al. Kamerayı
   `(0, 1.6, 0.4)`'e al, küpün içine gir, geri al. (Hataları TANIMAK = hızlı debug.)
3. Console'a alış: `console.log(cube.position)` yaz, DevTools'ta gör.
4. Commit: `Add Three.js hello world scene`.

## ✅ Kontrol

1. Scene/Camera/Renderer/Mesh — Unity karşılıkları?
2. `requestAnimationFrame` neden `setInterval`'den iyi?
3. Delta ile çarpmazsak ne olur?
4. Siyah ekran gördün — ilk üç şüphelin kim?
5. Import map ne işe yarıyor, sürümü neden sabitledik?

→ Sonraki ders: [2.2 — GLB yükleme ve Blender köprüsü](faz2-ders2-glb-blender.md)
