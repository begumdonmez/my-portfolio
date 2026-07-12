# Ders 2.5 — Koridor İçeriği

> 🎯 **Bu dersin sonunda:** Koridor dolu ve canlı: diplomalar, komodin + keepsake box,
> kitaplık, proje posterleri — hepsi E ile etkileşimli.

---

## 📖 Bölüm 1: Texture basma kalıbı (bu dersin çekirdeği)

Diplomalar, polaroidler, posterler, kaset etiketleri — hepsi AYNI kalıp:
**tek model + koddan texture değiştir.**

```js
const texLoader = new THREE.TextureLoader();

async function makeDiploma(imagePath, position) {
  const frame = frameTemplate.clone();                 // Ders 2.2'deki çerçeve GLB'si
  const photo = frame.getObjectByName('photo');        // Blender'daki isim!
  photo.material = photo.material.clone();             // ⚠️ ZORUNLU — yoksa hepsi aynı görsel
  photo.material.map = texLoader.load(imagePath);
  photo.material.map.colorSpace = THREE.SRGBColorSpace; // renkler soluk çıkmasın
  frame.position.copy(position);
  scene.add(frame);
  return frame;
}
```

NEDEN'ler:
- **`getObjectByName('photo')`** — Blender'da iç plane'e verdiğin isim. İsimlendirme disiplini burada
  meyve veriyor.
- **`material.clone()`** — Ders 2.2'nin kritik kuralı sahada. Unutursan tüm diplomalar son yüklenen
  görseli gösterir (ve bu hatayı en az bir kez yaşayacaksın 😄 — yaşayınca buraya dön).
- **`colorSpace`** — texture'lar sRGB'dir; söylemezsen render soluk/yıkanmış görünür. Klasik tuzak.
- Diploma görselleri: A4 oranında (1:1.41 — çerçevenin "photo" plane'i zaten bu oranda), 512-1024px.

Veriyle çoğaltma — koridor içeriği kodda liste olarak dursun:

```js
const diplomas = [
  { img: '/assets/textures/diploma-uni.webp',  z: -3 },
  { img: '/assets/textures/diploma-cert1.webp', z: -5 },
];
diplomas.forEach(d => makeDiploma(d.img, new THREE.Vector3(-1.18, 1.6, d.z)));
```
(Bu listeler Faz 3'te JSON'a taşınacak adaylar — şimdilik kodda, YAGNI.)

## 📖 Bölüm 2: Diploma zoom etkileşimi

Ders 2.3'teki kalıp: `frame.userData.interact = () => zoomTo(frame)`.
Zoom hedefi: çerçevenin ~0.7m önü, tam karşıdan. Çıkış: tekrar E ya da ESC.
İpucu: zoom hedef pozisyonunu çerçevenin "local +Z yönünün 0.7m ilerisi" olarak hesapla
(`frame.localToWorld(new THREE.Vector3(0, 0, 0.7))`) — çerçeve hangi duvardaysa doğru çalışır.

## 📖 Bölüm 3: Komodin + keepsake box

Origin kuralları meyvesini veriyor (Ders 2.2):

- **Çekmece** (origin merkez, eksene hizalı): E → `targetZ` değişir, lerp açar. Tekrar E → kapanır.
- **Kutu kapağı** (origin menteşede): E → `targetRotX = -Math.PI * 0.6`, lerp'le açılır.
- **İçinden polaroidler:** kapak açılınca 2-3 polaroid (tek model + foto texture — Bölüm 1 kalıbı)
  hafif yukarı lerp'lenerek "çıkar". Her polaroid kendi etkileşimli objesi olabilir (zoom).
  İçerik: deneyim/experiment fotoğrafların — "denediklerim" hissi.

Sıralı küçük hareketler = duygu. Kapak → bekle 0.3sn → polaroidler tek tek. Zamanlama yine
`clock.elapsedTime` + gecikme listesi (Ders 2.4'teki ışık dalgası kalıbının aynısı — fark ettin mi?
Aynı desen her yerde: **zamanlanmış lerp**).

## 📖 Bölüm 4: Kitaplık ve posterler

- **Kitaplık:** gövde tek mesh (GLB). Dolgu kitaplar Ders 2.2'deki klon rafı. Etkileşimli 1-2 kitap
  ayrı obje + `userData.interact` → küçük bilgi kartı (HTML overlay — hobi, ilham kaynağı vb.)
- **Posterler:** `PlaneGeometry(0.7, 1)` + poster texture'ı, duvara. En iyi 2-3 projen — vitrin.
  E → bilgi kartı (proje adı + tek cümle + "detay bilgisayarda" yönlendirmesi — odadaki PC'ye kanca).

## 📖 Bölüm 5: HTML bilgi kartı bileşeni

Tek kart, içeriği değişir (üç yerde kullanılıyor: kitap, poster, ileride hobi objeleri):

```html
<aside id="info-card" class="info-card" hidden>
  <h2 id="info-title"></h2>
  <p id="info-text"></p>
  <p class="info-close">ESC to close</p>
</aside>
```

```js
function showInfo(title, text) {
  infoTitle.textContent = title;    // textContent — innerHTML DEĞİL (güvenli ve hızlı)
  infoText.textContent = text;
  infoCard.hidden = false;
  state = State.COMPUTER;           // girdi kilidi mantığını yeniden kullan
}
```

- Kart stilinde palet + fontlar (Fraunces başlık!) — marka 3D'de de sürer. Scrapbook dokusu detay
  kartlarında serbest (plan: "C'nin detay kartlarında scrapbook estetiği olabilir").

## ⚠️ Sık yapılan hatalar

1. Tüm diplomalar aynı görsel → `material.clone()` (bu derste bir kez yaşanacak, garanti 😄).
2. Texture soluk → `colorSpace` unutulmuş.
3. Zoom pozisyonunu dünya koordinatıyla sabitlemek → çerçeve taşınınca bozulur; `localToWorld` kullan.
4. Her etkileşim için AYRI overlay HTML'i → tek yeniden kullanılabilir kart; tekrar = bakım yükü.
5. Etkileşimli obje enflasyonu → plan kuralı: koridor + oda TOPLAM 5-6 özenli etkileşim.

## ✏️ Görevler

1. `makeDiploma` kalıbı + 2-3 diploma duvarda, zoom çalışıyor.
2. Komodin: çekmece lerp, kutu kapağı rotasyon, polaroidler sıralı çıkış.
3. Kitaplık + klon dolgu + 1 etkileşimli kitap.
4. 2-3 poster + bilgi kartı.
5. Baştan yürü: açılış → koridor → her etkileşim. His bozuk yerleri TUNING'le düzelt.
6. Commit'ler: `Add diplomas with zoom`, `Add keepsake box sequence`, `Add bookshelf and posters`.

## ✅ Kontrol

1. "Tek model + texture değiştir" kalıbının 4 kullanım yeri neydi?
2. `colorSpace` satırı ne derdi çözer?
3. Keepsake polaroidlerinin sıralı çıkışı hangi dersteki desenin tekrarı?
4. Bilgi kartı neden tek bileşen?
5. `localToWorld` zoom'da neden gerekli?

→ Sonraki ders: [2.6 — Oda](faz2-ders6-oda.md)
