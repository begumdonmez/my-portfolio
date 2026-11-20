/* ============================================================
   AUDIO — WebAudio through Three.js. Placeholder sound design:
   generated tones stand in for real music; caption timing stands
   in for Begüm's voice recordings. Attaches sound + interactions
   to the radio and tape shelf built in world.js.
   ============================================================ */
import * as THREE from 'three';
import { listener, scene } from './core.js';
import { TUNING } from './config.js';
import { store } from './store.js';
import { box, textTexture } from './helpers.js';
import { register } from './interact.js';
import { showCaption, playTape } from './captions.js';
import { radio, roomZ } from './world.js';

function makeChordBuffer(freqs, seconds = 4) {
  const ctx = listener.context;
  const rate = ctx.sampleRate;
  const buf = ctx.createBuffer(1, rate * seconds, rate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / rate;
    let v = 0;
    for (const f of freqs) v += Math.sin(2 * Math.PI * f * t) / freqs.length;
    const fade = Math.min(t / 0.3, (seconds - t) / 0.3, 1);   // loop-friendly edges
    data[i] = v * 0.25 * fade;
  }
  return buf;
}

export const radioSound = new THREE.PositionalAudio(listener);
radioSound.setRefDistance(1.2);
radio.add(radioSound);

/* ---------- Radio stations ---------- */
let stations = [];
let stationIndex = -1;
fetch('/data/songs.json').then(r => r.json()).then(d => { stations = d; });

register(radio, 'change station', () => {
  if (!stations.length) return;
  stationIndex = (stationIndex + 1) % stations.length;
  const st = stations[stationIndex];
  if (store.audioEnabled) {
    if (radioSound.isPlaying) radioSound.stop();
    radioSound.setBuffer(makeChordBuffer(st.notes));
    radioSound.setLoop(true);
    radioSound.setVolume(TUNING.radioVolume);
    radioSound.play();
  }
  showCaption(`📻 Now playing: ${st.title}`, 3.5);
});

/* ---------- Tapes: timed captions (voice recordings go here later) ---------- */
fetch('/data/tapes.json').then(r => r.json()).then(d => {
  d.forEach((tape, i) => {
    const t = box(0.16, 0.05, 0.1, 0x2b2b35);
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(0.13, 0.035),
      new THREE.MeshStandardMaterial({ map: textTexture([tape.label], { ratio: 0.28, bg: '#F5F3EF' }) })
    );
    label.position.set(0, 0.026, 0);
    label.rotation.x = -Math.PI / 2;
    t.add(label);
    t.position.set(2.1 + i * 0.35, 1.16, roomZ - 1);
    scene.add(t);
    register(t, `play tape: "${tape.label}"`, () => playTape(tape));
  });
});
