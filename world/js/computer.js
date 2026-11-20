/* ============================================================
   COMPUTER OVERLAY — projects from the single source of truth
   (/data/projects.json — the CV page renders the SAME file).
   ============================================================ */
import { ui } from './dom.js';
import { State } from './config.js';
import { store } from './store.js';

export async function openComputer() {
  store.state = State.COMPUTER;
  ui.computer.hidden = false;
  if (ui.computerList.childElementCount) return;    // already rendered
  try {
    const res = await fetch('/data/projects.json');
    const projects = await res.json();
    for (const p of projects) {
      const card = document.createElement('article');
      card.className = 'computer-project';
      const h3 = document.createElement('h3');
      h3.textContent = p.title;                     // textContent: XSS-safe by default
      const desc = document.createElement('p');
      desc.textContent = p.summary;
      const tech = document.createElement('p');
      tech.className = 'tech';
      tech.textContent = p.tech.join(' · ');
      card.append(h3, tech, desc);
      for (const [name, url] of Object.entries(p.links)) {
        const a = document.createElement('a');
        a.href = url;
        a.textContent = `${name} →`;
        card.append(a);
      }
      ui.computerList.append(card);
    }
  } catch (err) {
    console.error('projects.json failed:', err);
  }
}

export function closeComputer() {
  ui.computer.hidden = true;
  store.state = State.WALK;
}
