/* ============================================================
   main.js — page behaviour
   Header state, scroll reveals, sack-weight toggles, pointer
   tilt on the product cards, and the bulk-order calculator.
   ============================================================ */

const root = document.documentElement;
root.classList.add('js');

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const money = new Intl.NumberFormat('en-US');

const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

/* ------------------------------------------------------------ header */

const header = $('[data-header]');
const nav = $('[data-nav]');
const navToggle = $('[data-nav-toggle]');
const progress = $('[data-scroll-progress]');

function onScroll() {
  header.classList.toggle('is-stuck', window.scrollY > 24);

  const span = document.body.scrollHeight - window.innerHeight;
  progress.style.width = span > 0 ? `${(window.scrollY / span) * 100}%` : '0%';
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* highlight whichever section is sitting under the header */
const navLinks = new Map(
  $$('[data-nav] a')
    .map((a) => [a.getAttribute('href').slice(1), a])
    .filter(([id]) => document.getElementById(id))
);

if (navLinks.size) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = navLinks.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('is-current'));
          link.classList.add('is-current');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  navLinks.forEach((_, id) => spy.observe(document.getElementById(id)));
}

/* ----------------------------------------------------- scroll reveal */

const revealables = $$('[data-reveal]');

if (reduced || !('IntersectionObserver' in window)) {
  revealables.forEach((el) => el.classList.add('is-in'));
} else {
  const revealer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        // small stagger so a grid does not pop in all at once
        setTimeout(() => entry.target.classList.add('is-in'), i * 70);
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
  );
  revealables.forEach((el) => revealer.observe(el));
}

/* -------------------------------------------------------- counters */

function countTo(el, target, duration = 1500) {
  if (reduced) {
    el.textContent = money.format(target);
    return;
  }
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = money.format(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counters = $$('[data-count-to]');
if (counters.length) {
  const counterObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countTo(entry.target, Number(entry.target.dataset.countTo));
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterObs.observe(el));
}

/* -------------------------------------------- sack size on the cards */

const weightSwitch = $('[data-weight-switch]');

function rollNumber(el, to, duration = 380) {
  const from = Number(String(el.textContent).replace(/[^\d]/g, '')) || 0;
  if (reduced || from === to) {
    el.textContent = money.format(to);
    return;
  }
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = money.format(Math.round(from + (to - from) * eased));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function applyWeight(kg) {
  $$('.product-card').forEach((card) => {
    const price = Number(card.dataset[`price${kg}`]);
    rollNumber($('[data-price]', card), price);
    $('[data-weight-label]', card).textContent = kg;
  });
}

if (weightSwitch) {
  const track = $('.weight-switch__track', weightSwitch);
  const options = $$('button', track);

  track.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-weight]');
    if (!btn) return;

    options.forEach((o) => {
      const on = o === btn;
      o.classList.toggle('is-active', on);
      o.setAttribute('aria-checked', String(on));
    });
    track.classList.toggle('is-second', btn.dataset.weight === '50');
    applyWeight(btn.dataset.weight);
  });
}

/* ------------------------------------------------- card pointer tilt */

const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (canHover && !reduced) {
  $$('[data-tilt]').forEach((card) => {
    let frame = 0;

    card.addEventListener('pointermove', (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--ry', `${px * 9}deg`);
        card.style.setProperty('--rx', `${-py * 9}deg`);
      });
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
    });
  });
}

/* ---------------------------------------------------------- marquee */

const marquee = $('[data-marquee]');
if (marquee) {
  // the CSS scrolls the track by -50%, so it needs two identical halves
  marquee.innerHTML += marquee.innerHTML;
}

/* ------------------------------------------------- bulk calculator */

const calc = $('[data-calc]');

if (calc) {
  const grade = $('[data-calc-grade]', calc);
  const weightSeg = $('[data-calc-weight]', calc);
  const qty = $('[data-calc-qty]', calc);
  const qtyOut = $('[data-calc-qty-out]', calc);

  const outTonnes = $('[data-calc-tonnes]', calc);
  const outDiscount = $('[data-calc-discount]', calc);
  const outTruck = $('[data-calc-truck]', calc);
  const outTotal = $('[data-calc-total]', calc);

  let kg = 25;

  const slab = (sacks) => {
    if (sacks >= 300) return 0.05;
    if (sacks >= 200) return 0.035;
    if (sacks >= 100) return 0.02;
    return 0;
  };

  const truckClass = (tonnes) => {
    if (tonnes >= 13) return 'Full truck';
    if (tonnes >= 6.5) return 'Half truck';
    return 'Part load';
  };

  function recalc() {
    const sacks = Number(qty.value);
    const [p25, p50] = grade.value.split('|').map(Number);
    const unit = kg === 25 ? p25 : p50;

    const cut = slab(sacks);
    const tonnes = (sacks * kg) / 1000;
    const total = Math.round(sacks * unit * (1 - cut));

    qtyOut.textContent = sacks;
    qty.style.setProperty(
      '--fill',
      `${((sacks - qty.min) / (qty.max - qty.min)) * 100}%`
    );

    outTonnes.textContent = `${tonnes.toFixed(2)} t`;
    outDiscount.textContent = cut ? `−${(cut * 100).toFixed(1)}%` : '—';
    outTruck.textContent = truckClass(tonnes);
    outTotal.textContent = `Rs ${money.format(total)}`;
  }

  weightSeg.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-weight]');
    if (!btn) return;
    $$('button', weightSeg).forEach((b) => b.classList.toggle('is-active', b === btn));
    kg = Number(btn.dataset.weight);
    recalc();
  });

  grade.addEventListener('change', recalc);
  qty.addEventListener('input', recalc);
  recalc();
}

/* ------------------------------------------------------ enquiry form */

const form = $('[data-form]');

if (form) {
  const status = $('[data-form-status]', form);

  const bad = (field, why) => {
    field.classList.add('is-bad');
    field.focus();
    status.textContent = why;
    status.className = 'form__status is-bad';
  };

  form.addEventListener('input', (e) => e.target.classList?.remove('is-bad'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements.name;
    const phone = form.elements.phone;

    if (!name.value.trim()) return bad(name, 'We need a name to put on the quote.');

    const digits = phone.value.replace(/\D/g, '');
    if (digits.length < 10) return bad(phone, 'That phone number looks short — check it?');

    // No backend wired up yet. Swap this for a POST to Formspree, Basin or a
    // small serverless handler before launch.
    status.textContent = `Thanks ${name.value.trim().split(' ')[0]} — we will call you back with today's rate.`;
    status.className = 'form__status is-ok';
    form.reset();
  });
}

/* -------------------------------------------------------------- misc */

const year = $('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());

/* ---------------------------------------------------------- 3d hero */

// Loaded on the side: if WebGL is missing or the CDN is blocked the hero
// just keeps its gradient background.
import('./scene-hero.js')
  .then((m) => m.initHero())
  .catch((err) => console.warn('hero scene skipped:', err.message));

/* --------------------------------------------------- 3d sack viewer */

const sackSwitch = $('[data-sack-switch]');

if (sackSwitch) {
  const META = {
    25: { net: '25 kg', dims: '18 × 30 in', pallet: '40 sacks' },
    50: { net: '50 kg', dims: '22 × 36 in', pallet: '20 sacks' },
  };

  const net = $('[data-sack-net]');
  const dims = $('[data-sack-dims]');
  const pallet = $('[data-sack-pallet]');
  const hint = $('[data-sack-hint]');
  const sackCanvas = $('[data-sack-canvas]');

  let sack = null;
  import('./scene-sack.js')
    .then((m) => { sack = m.initSack(); })
    .catch((err) => console.warn('sack viewer skipped:', err.message));

  sackSwitch.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-sack-weight]');
    if (!btn) return;

    $$('button', sackSwitch).forEach((b) => b.classList.toggle('is-active', b === btn));

    const kg = btn.dataset.sackWeight;
    net.textContent = META[kg].net;
    dims.textContent = META[kg].dims;
    pallet.textContent = META[kg].pallet;
    sack?.setWeight(Number(kg));
  });

  // the drag hint has done its job once someone drags
  sackCanvas?.addEventListener('pointerdown', () => hint?.classList.add('is-gone'), { once: true });
}
