/* ---------- DOM refs ---------- */

export const el = (id) => document.getElementById(id);

export const ui = {
  consent: el('consent'), mobile: el('mobile-notice'), invite: el('invite'),
  hint: el('hint'), hintLabel: el('hint-label'), captions: el('captions'),
  computer: el('computer'), computerList: el('computer-list'),
};
