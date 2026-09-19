/* ============================================================
   chrome.js — the furniture every page shares

   Header, navigation, language toggle, scroll reveals, the
   counters and the marquee. All of it no-ops when the elements
   are not on the page, so the home page and the dish pages can
   call the same function.

   It deliberately does not call initLang(). The page entry does
   that last, once its own blocks have registered their repaints.
   ============================================================ */

import { setLang, current } from './i18n.js';

export const $ = (sel, scope = document) => scope.querySelector(sel);
export const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const money = new Intl.NumberFormat('en-US');

// Placeholder. Swap for the mill's real WhatsApp number, digits only, with the
// country code and no + or spaces. It is also hard-coded into the markup as the
// no-JavaScript fallback — see the table in the readme.
export const WA_NUMBER = '923000000000';
export const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

export function initChrome() {
  document.documentElement.classList.add('js');

  /* ---------------------------------------------------------- language */

  const langToggle = $('[data-lang-toggle]');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      setLang(current() === 'ur' ? 'en' : 'ur');
    });
  }

  /* ------------------------------------------------------------ header */

  const header = $('[data-header]');
  const nav = $('[data-nav]');
  const navToggle = $('[data-nav-toggle]');
  const progress = $('[data-scroll-progress]');

  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-stuck', window.scrollY > 24);
      if (!progress) return;
      const span = document.body.scrollHeight - window.innerHeight;
      progress.style.width = span > 0 ? `${(window.scrollY / span) * 100}%` : '0%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => {
      if (!e.target.closest('a')) return;
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* highlight whichever section is sitting under the header */
  const navLinks = new Map(
    $$('[data-nav] a')
      .map((a) => [a.getAttribute('href').replace(/^.*#/, ''), a])
      .filter(([id]) => id && document.getElementById(id))
  );

  if (navLinks.size) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = navLinks.get(entry.target.id);
          if (!link || !entry.isIntersecting) return;
          navLinks.forEach((l) => l.classList.remove('is-current'));
          link.classList.add('is-current');
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
  } else if (revealables.length) {
    const pending = revealables.slice();
    const revealer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          // small stagger so a grid does not pop in all at once
          setTimeout(() => entry.target.classList.add('is-in'), i * 70);
          obs.unobserve(entry.target);
          const at = pending.indexOf(entry.target);
          if (at > -1) pending.splice(at, 1);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
    revealables.forEach((el) => revealer.observe(el));

    /* The observer is not enough on its own. An instant jump — an anchor
       link, a reload part-way down the page, a scroll position the browser
       restores — can carry a section past the viewport without the observer
       ever reporting it, and it then sits at opacity 0 for good. This sweep
       is the backstop. It only looks well inside the viewport, later than
       the observer fires, so ordinary scrolling still gets the stagger and
       this catches nothing but the ones that were dropped. */
    let queued = 0;
    const sweep = () => {
      queued = 0;
      const late = window.innerHeight * 0.6;
      for (let i = pending.length - 1; i >= 0; i--) {
        if (pending[i].getBoundingClientRect().top > late) continue;
        pending[i].classList.add('is-in');
        revealer.unobserve(pending[i]);
        pending.splice(i, 1);
      }
    };
    const queueSweep = () => { if (!queued) queued = requestAnimationFrame(sweep); };

    window.addEventListener('scroll', queueSweep, { passive: true });
    window.addEventListener('resize', queueSweep);
    window.addEventListener('load', queueSweep);
    queueSweep();
  }

  /* --------------------------------------------------------- counters */

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
      { threshold: 0.35 }
    );
    counters.forEach((el) => counterObs.observe(el));
  }

  /* ---------------------------------------------------------- marquee */

  const marquee = $('[data-marquee]');
  if (marquee) {
    // the CSS scrolls the track by -50%, so it needs two identical halves
    marquee.innerHTML += marquee.innerHTML;
  }

  /* ------------------------------------------------------------- misc */

  const year = $('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
}

export function countTo(el, target, duration = 1500) {
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
