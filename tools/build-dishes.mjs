/* ============================================================
   build-dishes.mjs — writes the five cook-*.html pages

   The site itself has no build step. This is a one-off generator
   so the five dish pages cannot drift apart: they share one
   template here, and their English defaults are pulled straight
   out of js/i18n.js rather than typed again.

   Run it from the repository root after editing the template,
   the dictionary or dishes.js:

     node tools/build-dishes.mjs
   ============================================================ */

import { writeFileSync } from 'node:fs';
import { DICT } from '../js/i18n.js';
import { DISHES, STEPS } from '../js/dishes.js';

const en = DICT.en;
const t = (k) => {
  if (!(k in en)) throw new Error('missing dictionary key: ' + k);
  return en[k];
};

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const file = (i) => `cook-${DISHES[i].slug}.html`;

const MARK = `<svg class="brand__mark" viewBox="0 0 64 64" aria-hidden="true">
        <g transform="rotate(-28 32 32)">
          <ellipse cx="32" cy="32" rx="9" ry="20"/>
          <path d="M32 15C27 24 27 40 32 49" class="brand__groove"/>
        </g>
      </svg>`;

const WA_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.65 4.2 3.71.59.25 1.04.4 1.4.52.59.18 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.17-.47-.29Z"/>
  </svg>`;

const NAV = [
  ['index.html#range', 'nav.range'],
  ['index.html#grade', 'nav.grade'],
  ['cook-biryani.html', 'nav.dishes'],
  ['index.html#process', 'nav.process'],
  ['index.html#quality', 'nav.quality'],
  ['index.html#order', 'nav.order'],
];

function steps(i) {
  return Array.from({ length: STEPS }, (_, k) => k + 1)
    .map(
      (n) => `
  <!-- ──────────────────────────────  step ${n}  ─────────────────────────── -->
  <section class="act" data-step="${n - 1}">
    <div class="shell act__inner" data-reveal>
      <p class="act__tag"><span data-i18n="dp.step">${esc(t('dp.step'))}</span> 0${n}</p>
      <h2 class="act__title" data-i18n="d${i}.s${n}t">${esc(t(`d${i}.s${n}t`))}</h2>
      <p class="act__text" data-i18n="d${i}.s${n}d">${esc(t(`d${i}.s${n}d`))}</p>
    </div>
  </section>
`
    )
    .join('');
}

function others(i) {
  return DISHES.map((_, j) => j)
    .filter((j) => j !== i)
    .map(
      (j) => `        <li>
          <a class="other" href="${file(j)}">
            <span class="other__rice" data-i18n="p${j}.name">${esc(t(`p${j}.name`))}</span>
            <span class="other__dish" data-i18n="d${j}.dish">${esc(t(`d${j}.dish`))}</span>
            <span class="other__tag" data-i18n="d${j}.tag">${esc(t(`d${j}.tag`))}</span>
            <span class="other__go" data-i18n="card.cook">${esc(t('card.cook'))}</span>
          </a>
        </li>`
    )
    .join('\n');
}

function page(i) {
  const dishName = t(`d${i}.dish`);
  const riceName = t(`p${i}.name`);

  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(dishName)} — made with ${esc(riceName)} | Sunehri Rice Mills</title>
<meta name="description" content="${esc(t(`d${i}.tag`))} ${esc(riceName)} from Sunehri Rice Mills, Sheikhupura. Watch it cook, then order by the bag or by the truck.">
<meta name="theme-color" content="#0D0906">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">

<meta property="og:type" content="article">
<meta property="og:title" content="${esc(dishName)} — made with ${esc(riceName)}">
<meta property="og:description" content="${esc(t(`d${i}.tag`))}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/lang.css">
<link rel="stylesheet" href="css/dish.css">

<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/"
  }
}
</script>
</head>
<body class="dish-page" id="top" data-rice="${i}">

<canvas class="dish-canvas" data-dish-canvas aria-hidden="true"></canvas>

<div class="grain-overlay" aria-hidden="true"></div>
<div class="scroll-rail" aria-hidden="true"><span data-scroll-progress></span></div>

<a class="skip-link" href="#main" data-i18n="skip">${esc(t('skip'))}</a>

<!-- ─────────────────────────────  header  ───────────────────────────── -->
<header class="site-header" data-header>
  <div class="shell site-header__inner">

    <a class="brand" href="index.html" aria-label="Sunehri Rice Mills">
      ${MARK}
      <span class="brand__text">
        <strong data-i18n="brand.name">${esc(t('brand.name'))}</strong>
        <em data-i18n="brand.sub">${esc(t('brand.sub'))}</em>
      </span>
    </a>

    <nav class="site-nav" data-nav aria-label="Primary">
      <ul>
${NAV.map(([href, key]) => `        <li><a href="${href}"${key === 'nav.dishes' ? ' class="is-current" aria-current="page"' : ''} data-i18n="${key}">${esc(t(key))}</a></li>`).join('\n')}
      </ul>
    </nav>

    <button type="button" class="lang-toggle" data-lang-toggle
            data-i18n="lang.switch" data-i18n-attr="aria-label:lang.label"
            aria-label="Switch to Urdu">اردو</button>

    <a class="btn btn--solid btn--sm site-header__cta" href="index.html#contact" data-i18n="nav.cta">${esc(t('nav.cta'))}</a>

    <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="main-nav">
      <span></span><span></span>
      <span class="u-sr" data-i18n="nav.menu">${esc(t('nav.menu'))}</span>
    </button>

  </div>
</header>

<main id="main">

  <!-- ────────────────────────────  hero  ──────────────────────────── -->
  <section class="dish-hero">
    <div class="dish-hero__wash" aria-hidden="true"></div>

    <div class="shell dish-hero__inner">
      <p class="dish-hero__rice" data-i18n="p${i}.name">${esc(riceName)}</p>
      <h1 class="dish-hero__title" data-i18n="d${i}.dish">${esc(dishName)}</h1>
      <p class="dish-hero__tag" data-i18n="d${i}.tag">${esc(t(`d${i}.tag`))}</p>

      <div class="dish-hero__actions">
        <button type="button" class="btn btn--wa" data-wa-dish data-i18n="dp.cta">${esc(t('dp.cta'))}</button>
        <a class="btn btn--ghost" href="index.html#range" data-i18n="dp.price">${esc(t('dp.price'))}</a>
      </div>
    </div>

    <p class="dish-hero__cue" aria-hidden="true">
      <span></span>
      <em data-i18n="dp.scroll">${esc(t('dp.scroll'))}</em>
    </p>
  </section>

  <!-- ───────────────────────────  why this rice  ──────────────────── -->
  <section class="section dish-why">
    <div class="shell dish-why__grid">

      <div data-reveal>
        <p class="eyebrow" data-i18n="dp.why">${esc(t('dp.why'))}</p>
        <h2 class="section-title" data-i18n="p${i}.name">${esc(riceName)}</h2>
        <p class="section-lede" data-i18n="d${i}.why">${esc(t(`d${i}.why`))}</p>
        <div class="dish-cta">
          <button type="button" class="btn btn--wa btn--sm" data-wa-dish data-i18n="dp.cta">${esc(t('dp.cta'))}</button>
          <a class="btn btn--line btn--sm" href="index.html#grade" data-i18n="card.hint">${esc(t('card.hint'))}</a>
        </div>
      </div>

      <dl class="dish-stat" data-reveal>
        <dt data-i18n="dp.grow">${esc(t('dp.grow'))}</dt>
        <dd data-dish-grow>${esc(t('dp.growv').replace('{x}', DISHES[i].cook.grow))}</dd>
        <dt data-i18n="grade.len">${esc(t('grade.len'))}</dt>
        <dd data-i18n="g${i}.len">${esc(t(`g${i}.len`))}</dd>
        <dt data-i18n="grade.age">${esc(t('grade.age'))}</dt>
        <dd data-i18n="g${i}.age">${esc(t(`g${i}.age`))}</dd>
      </dl>

    </div>
  </section>

  <!-- ───────────────────────  the cooking steps  ─────────────────── -->
  <p class="u-sr" data-i18n="dp.how">${esc(t('dp.how'))}</p>
${steps(i)}
  <!-- ──────────────────────────  the other four  ──────────────────── -->
  <section class="section section--dark">
    <div class="shell">

      <div class="section-head" data-reveal>
        <p class="eyebrow" data-i18n="dp.other">${esc(t('dp.other'))}</p>
        <h2 class="section-title" data-i18n="dp.otherlede">${esc(t('dp.otherlede'))}</h2>
      </div>

      <ul class="other-grid">
${others(i)}
      </ul>

    </div>
  </section>

</main>

<!-- ─────────────────────────────  footer  ───────────────────────────── -->
<footer class="site-footer">
  <div class="shell site-footer__grid">

    <div class="site-footer__brand">
      <a class="brand brand--light" href="index.html">
        ${MARK}
        <span class="brand__text">
          <strong data-i18n="brand.name">${esc(t('brand.name'))}</strong>
          <em data-i18n="brand.sub">${esc(t('brand.sub'))}</em>
        </span>
      </a>
      <p data-i18n="ft.blurb">${esc(t('ft.blurb'))}</p>
    </div>

    <nav class="site-footer__nav" aria-label="Footer">
      <h2 data-i18n="ft.site">${esc(t('ft.site'))}</h2>
      <ul>
        <li><a href="index.html#buyers" data-i18n="b.title">${esc(t('b.title'))}</a></li>
        <li><a href="index.html#range" data-i18n="nav.range">${esc(t('nav.range'))}</a></li>
        <li><a href="cook-biryani.html" data-i18n="nav.dishes">${esc(t('nav.dishes'))}</a></li>
        <li><a href="index.html#process" data-i18n="nav.process">${esc(t('nav.process'))}</a></li>
        <li><a href="index.html#contact" data-i18n="nav.contact">${esc(t('nav.contact'))}</a></li>
      </ul>
    </nav>

    <div class="site-footer__contact">
      <h2 data-i18n="ft.mill">${esc(t('ft.mill'))}</h2>
      <p>
        Plot 14, Mill Road Industrial Estate<br>
        Sheikhupura, Punjab 39350<br>
        <a href="tel:+923000000000">+92 300 000 0000</a><br>
        <a href="mailto:orders@example.com">orders@example.com</a>
      </p>
    </div>

  </div>

  <div class="shell site-footer__base">
    <p>&copy; <span data-year>2026</span> <span data-i18n="ft.rights">${esc(t('ft.rights'))}</span></p>
    <p data-i18n="ft.note">${esc(t('ft.note'))}</p>
  </div>
</footer>

<a class="wa-float" href="https://wa.me/923000000000" target="_blank" rel="noopener"
   data-i18n-attr="aria-label:wa.float" aria-label="${esc(t('wa.float'))}">
  ${WA_ICON}
</a>

<script type="module" src="js/dish-page.js"></script>
</body>
</html>
`;
}

let written = 0;
DISHES.forEach((d, i) => {
  writeFileSync(file(i), page(i));
  console.log('wrote ' + file(i) + '  (' + en[`p${i}.name`] + ' → ' + en[`d${i}.dish`] + ')');
  written++;
});
console.log(written + ' dish pages generated');
