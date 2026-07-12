# Ders 2.2 — GLB Yükleme ve Blender Köprüsü

> 🎯 **Bu dersin sonunda:** Blender'da yaptığın bir model sahnede duracak, koridorun kaba
> geometrisi (duvarlar/zemin/tavan) kodda kurulmuş olacak ve clone() disiplinini öğrenmiş olacaksın.

---

## 📖 Bölüm 1: Boru hattı — Blender'dan tarayıcıya

1. **Modelle:** low-poly, Principled BSDF, ağırlıklı düz renk (texture az). 1 birim = 1 metre!
2. **Temizle:** görünmeyen yüzleri sil · Subdivision max 1-2 ve **Apply** · bevel 1-2 segment ·
   transform'ları Apply (Ctrl+A) — origin'ler doğru yerde (aşağıda).
3. **Export → glTF 2.0 (.glb):** tek dosya, texture gömülü.
   *Neden GLB?* Web'in standart formatı ("3D'nin JPEG'i" denir): PBR materyal + animasyon + sıkıştırma
   tek pakette. FBX/OBJ web'de ikinci sınıf.
4. Dosyayı `assets/models/` altına koy.

**Origin kuralları (planından — çok önemli):**
- Çekmece: origin MERKEZDE, dünya eksenine hizalı → kodda `position` lerp'i ile açılır.
- Keepsake box kapağı & kapı: origin MENTEŞEDE → kodda `rotation` ile açılır.
- Origin yanlışsa obje "yörüngede döner" — Unity'deki pivot sorunuyla birebir aynı.

## 📖 Bölüm 2: GLB yüklemek

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

loader.load('/assets/models/frame.glb', (gltf) => {
  const frame = gltf.scene;          // modelin kök objesi
  frame.position.set(-1.9, 1.6, -4);
  scene.add(frame);
});
```

- Yükleme **asenkron**: dosya inene kadar kodun devamı çalışır, model callback'te gelir.
  Model yüklenmeden ona erişmeye çalışmak = klasik `undefined` hatası.
- Birden çok model için sıra derdi çıkınca: `Promise.all` + `loadAsync` (o güne gelince birlikte).
- Modelin içindeki parçaya isimle eriş: `frame.getObjectByName('photo')` — Blender'da mesh'e
  verdiğin isim buraya taşınır. **Blender'da isimlendirme disiplini = kodda konfor.**

## 📖 Bölüm 3: clone() disiplini — 10 kitap, 1 model

```js
const book = await loader.loadAsync('/assets/models/book.glb');

for (let i = 0; i < 10; i++) {
  const copy = book.scene.clone();
  copy.position.set(2, 1 + i * 0.05, -3 + i * 0.2);
  copy.scale.setScalar(0.9 + Math.random() * 0.2);   // boy çeşitliliği
  scene.add(copy);
}
```

**KRİTİK kural:** `clone()` geometriyi VE materyali **paylaşır** (bellek dostu — istediğimiz bu).
Ama birinin texture/rengini değiştireceksen önce kopar:

```js
mesh.material = mesh.material.clone();   // artık bağımsız
mesh.material.map = newTexture;
```
Bunu yapmazsan TÜM klonlar değişir — tüm diplomalar aynı diploma olur. 😄 (Çerçeve, polaroid,
kaset — texture'ı değişen her asset'te bu satır zorunlu. Planındaki kural buydu.)

## 📖 Bölüm 4: Koridor kutusu — Blender'sız

Basit kutular için Blender israf; kod hem hafif hem parametrik:

```js
const corridor = { width: 2.4, height: 3, length: 20 };
const wallMat = new THREE.MeshStandardMaterial({ color: 0x2b2b35 });

const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, corridor.height, corridor.length), wallMat);
leftWall.position.set(-corridor.width / 2, corridor.height / 2, -corridor.length / 2);
scene.add(leftWall);
// sağ duvar, zemin, tavan: aynı kalıp — sen yaz
```

- Ölçüler nesnede (`corridor`) toplu duruyor: koridoru uzatmak = tek sayı değiştirmek.
- Tek `wallMat` paylaşımı bilinçli: aynı görünüm = aynı materyal = daha az draw call.
- Posterler de böyle: `PlaneGeometry` + `TextureLoader` ile JPG.

## ⚠️ Sık yapılan hatalar

1. Model görünmüyor → boyut/konum sorunu. İlk teşhis: `console.log` + sahneye geçici
   `new THREE.AxesHelper(5)` ekle (eksenleri gösterir).
2. Model simsiyah → texture gömülmemiş (export ayarı) ya da ışık yetersiz.
3. Model dev ya da minicik → Blender'da ölçek Apply edilmemiş (Ctrl+A → Scale).
4. `clone()` sonrası hepsinin birden değişmesi → `material.clone()` unutuldu (yukarıdaki kural).
5. GLB'yi `world/js/` içine koymak — varlıklar `assets/models/` altında, düzen bozulmasın.

## ✏️ Görevler

1. Blender'da EN BASİT asset'le başla: **çerçeve** (kenar + "photo" adlı iç plane, A4 oranı ≈ 1:1.41).
   Maskot en sona — en zor model, en çok pratikten sonra.
2. GLB export → sahneye yükle → duvara as.
3. Koridor kutusunu kur (4 parça). İçinde "yürü": kameranın z'sini elle değiştirerek dolaş.
4. Kitap modeli + 10 klon rafı (scale/rotasyon çeşitliliğiyle).
5. Commit'ler: `Add GLB loading pipeline`, `Block out corridor geometry`.

## ✅ Kontrol

1. GLB'yi FBX'e neden tercih ettik?
2. Çekmecenin origin'i nerede, kapağınki nerede — neden farklı?
3. `clone()` neyi paylaşır? Ne zaman `material.clone()` şart?
4. Koridor ölçülerini neden tek nesnede tuttuk?
5. Model sahnede görünmüyor — ilk iki teşhis aracın ne?

→ Sonraki ders: [2.3 — Kontroller ve etkileşim](faz2-ders3-kontroller.md)
