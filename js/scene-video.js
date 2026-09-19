/* ============================================================
   scene-video.js — a cooking video scrubbed by the scroll

   Where a dish has real footage, the scroll drives that instead
   of the WebGL scene. It exposes the same two methods initDish
   does, so dish-page.js does not care which one it got.

   The clip is one cut per step, in the page's own order. CUTS
   holds the shot boundaries in seconds, read off the footage
   rather than guessed, and step n is parked in the middle of
   shot n so the copy and the picture agree. Scrolling between
   two steps runs the video from one shot's middle to the next,
   which carries the cut across at about the halfway point.

   Two things make a video scrub rather than stutter:

   - the file is re-encoded with a keyframe every fourth frame.
     Seeking to a point between keyframes makes the decoder
     start at the one before it and decode forward, so the
     original, with six keyframes in ten seconds, took most of a
     second to land on a frame.

   - currentTime is set once per animation frame, never per
     scroll event, and not at all when the target is inside the
     frame already showing.
   ============================================================ */

const FRAME = 1 / 24;

export function initVideo(cuts, { onFail } = {}, el) {
  const video = el || document.querySelector('[data-dish-video]');
  if (!video || !cuts || cuts.length < 2) return null;

  /* the middle of each shot: where a step parks */
  const marks = [];
  for (let i = 0; i < cuts.length - 1; i++) marks.push((cuts[i] + cuts[i + 1]) / 2);
  const LAST = marks.length - 1;

  /* A phone does not want the desktop file. This is chosen before the src is
     set, because switching it afterwards throws away everything buffered. */
  const source = video.dataset[window.innerWidth < 760 ? 'small' : 'wide'];
  if (!source) return null;

  let ready = false;
  let failed = false;
  let want = marks[0];
  let shown = -1;
  let frame = 0;

  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.src = source;

  video.addEventListener('loadeddata', () => {
    ready = true;
    video.pause();
    video.classList.add('is-ready');
  }, { once: true });

  video.addEventListener('error', () => {
    failed = true;
    video.classList.remove('is-ready');
    if (onFail) onFail();
  }, { once: true });

  /* Some browsers will not decode a frame for a video that has never been
     told to play, and seeking one silently does nothing. Asking it to play
     and stopping it immediately is enough to wake the decoder up. */
  const wake = () => {
    const p = video.play();
    if (p && p.then) p.then(() => video.pause(), () => {});
  };
  wake();
  window.addEventListener('touchstart', wake, { once: true, passive: true });
  window.addEventListener('pointerdown', wake, { once: true });

  function paint() {
    frame = requestAnimationFrame(paint);
    if (!ready || failed || video.seeking) return;
    // no point seeking inside the frame that is already on screen
    if (Math.abs(want - shown) < FRAME) return;
    shown = want;
    video.currentTime = want;
  }
  frame = requestAnimationFrame(paint);

  return {
    setStage(stage) {
      const s = Math.min(Math.max(stage, 0), LAST);
      const i = Math.min(Math.floor(s), LAST - 1);
      want = marks[i] + (marks[i + 1] - marks[i]) * (s - i);
    },
    failed: () => failed,
    destroy() {
      cancelAnimationFrame(frame);
      video.removeAttribute('src');
      video.load();
    },
  };
}
