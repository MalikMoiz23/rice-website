/* ============================================================
   dish-page.js — entry for the five "what it cooks best" pages

   Every dish page is the same markup with a different rice index
   on <body data-rice>. This reads that, drives the cooking scene
   from scroll position, and wires the WhatsApp button so the
   message names both the rice and the dish.
   ============================================================ */

import { initLang, onLangChange, t } from './i18n.js';
import { $, $$, reduced, waLink, initChrome } from './chrome.js';
import { DISHES } from './dishes.js';

initChrome();

const rice = Number(document.body.dataset.rice);
const dish = DISHES[rice];

/* ------------------------------------------------ cooked length stat */

const growOut = $('[data-dish-grow]');
const paintGrow = () => {
  if (growOut && dish) growOut.textContent = t('dp.growv', { x: dish.cook.grow });
};
paintGrow();
onLangChange(paintGrow);

/* ------------------------------------------- scroll drives the stove */

const steps = $$('[data-step]');

if (steps.length) {
  let scene = null;
  let anchors = [];

  // the scroll position at which each step sits centred in the viewport
  function measure() {
    anchors = steps.map((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      return top + el.offsetHeight / 2 - window.innerHeight / 2;
    });
  }

  // a continuous 0–3, hitting a whole number exactly on each step
  function stage() {
    const y = window.scrollY;
    const last = anchors.length - 1;
    if (y <= anchors[0]) return 0;
    if (y >= anchors[last]) return last;

    let i = 0;
    while (i < last && y >= anchors[i + 1]) i++;
    const span = anchors[i + 1] - anchors[i];
    return span > 0 ? i + (y - anchors[i]) / span : i;
  }

  const paint = () => scene?.setStage(stage());

  measure();

  // WebGL is optional — the copy and the gradient stand on their own
  import('./scene-dish.js')
    .then((m) => {
      scene = m.initDish(rice);
      paint();
    })
    .catch((err) => console.warn('dish scene skipped:', err.message));

  window.addEventListener('scroll', paint, { passive: true });
  window.addEventListener('resize', () => { measure(); paint(); });
  window.addEventListener('load', () => { measure(); paint(); });
}

/* ------------------------------------------------------- order by chat */

$$('[data-wa-dish]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const msg = t('wa.dish', {
      rice: t('p' + rice + '.name'),
      dish: t('d' + rice + '.dish'),
    });
    window.open(waLink(msg), '_blank', 'noopener');
  });
});

/* Last of all: applying the saved language repaints every block above. */
initLang();
