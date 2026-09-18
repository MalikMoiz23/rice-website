/* ============================================================
   webgl.js — shared WebGL housekeeping

   Two things every scene on this page needs and none of them
   should be doing for itself.

   1. The capability check. Each scene used to build a throwaway
      canvas and call getContext on it, then drop the reference.
      The context does not go away when the reference does, and a
      browser only keeps a fixed number alive — once the cap is
      hit it force-loses the oldest one, which is how a canvas
      that was working ends up black. The check now runs once and
      hands its probe context straight back.

   2. Context loss itself. It happens on real machines: the GPU
      resets, the driver updates, a laptop switches graphics. The
      default browser behaviour is a black rectangle forever. We
      pause instead, and let the CSS underneath show through.
   ============================================================ */

let cached = null;

export function supportsWebGL() {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    cached = !!gl;
    // give it back immediately rather than waiting for garbage collection
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}

/**
 * Keep a canvas from going black if its context is lost.
 * @param {HTMLCanvasElement} canvas
 * @param {object}   handlers
 * @param {Function} handlers.onLost      stop your animation loop here
 * @param {Function} handlers.onRestored  start it again here
 */
export function guardContext(canvas, { onLost, onRestored } = {}) {
  canvas.addEventListener('webglcontextlost', (e) => {
    // without this the browser will not attempt a restore at all
    e.preventDefault();
    canvas.classList.add('is-context-lost');
    onLost?.();
  });

  canvas.addEventListener('webglcontextrestored', () => {
    canvas.classList.remove('is-context-lost');
    onRestored?.();
  });
}

/**
 * Drops the renderer's pixel ratio once if frames are consistently slow.
 * Cheaper than dropping geometry and invisible to the eye next to a stutter.
 * Call every frame with the frame's delta in seconds.
 */
export function makeQualityGuard(renderer, { floor = 1, after = 90, slowMs = 32 } = {}) {
  let slow = 0;
  let dropped = false;

  return function sample(dt) {
    if (dropped) return;
    slow = dt * 1000 > slowMs ? slow + 1 : Math.max(0, slow - 1);
    if (slow < after) return;

    dropped = true;
    const next = Math.max(floor, renderer.getPixelRatio() * 0.7);
    renderer.setPixelRatio(next);
  };
}
