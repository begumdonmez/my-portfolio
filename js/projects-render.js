/* Lesson 3.1 pattern: fetch + <template> render.
   Data lives in ONE place (/data/projects.json); this page and the
   3D world's computer both read it. Change the JSON → both update. */

async function loadProjects() {
  const grid = document.querySelector('#projects-grid');
  const tpl = document.querySelector('#project-template');

  try {
    const res = await fetch('/data/projects.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();

    for (const p of projects) {
      const node = tpl.content.cloneNode(true);
      const img = node.querySelector('img');
      img.src = p.cover;
      img.alt = `${p.title} cover`;
      node.querySelector('h3').textContent = p.title;      // textContent, never innerHTML
      node.querySelector('p').textContent = p.summary;
      node.querySelector('a').href = p.links.play ?? Object.values(p.links)[0];
      grid.append(node);
    }
  } catch (err) {
    console.error('projects failed to load:', err);
    // page stays usable: hero, experience and contact are plain HTML
  }
}

loadProjects();
