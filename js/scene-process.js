/* ============================================================
   scene-process.js — one grain per milling step
   Six small viewports scissored out of a single full-screen
   canvas, so the whole list costs one WebGL context and one
   animation loop. Each step shows the grain as it leaves that
   stage: hull, hull, hull, brown, white, white.
   ============================================================ */

import * as THREE from 'three';
import { riceGeometry } from './rice-geometry.js';
import { supportsWebGL, guardContext, makeQualityGuard } from './webgl.js';

const STEPS = [
  { color: '#c9a24a', husk: true },  // 01 procurement — paddy as bought
  { color: '#d9bd77', husk: true },  // 02 drying      — dried down, paler
  { color: '#b58c34', husk: true },  // 03 ageing      — colour deepens in the bin
  { color: '#b3865a', husk: false }, // 04 shelling    — hull off, bran still on
  { color: '#f4eede', husk: false }, // 05 grading     — polished, sorted
  { color: '#fbf8f0', husk: false }, // 06 sacking     — finished white rice
];

export function initProcess() {
  const canvas = document.querySelector('[data-process-canvas]');
  const slots = Array.from(document.querySelectorAll('[data-grain-slot]'));
  const section = document.getElementById('process');

  if (!canvas || !slots.length || !supportsWebGL()) return null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.autoClear = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 10);
  camera.position.set(0, 0, 1.8);

  scene.add(new THREE.HemisphereLight(0xfff4d8, 0x6b5630, 0.8));

  const key = new THREE.DirectionalLight(0xfff0d0, 3.4);
  key.position.set(2, 3, 4);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x8fbf66, 1.4);
  rim.position.set(-3, 1, -2);
  scene.add(rim);

  // the hull is chunkier and catches light in facets; milled rice is smooth
  const huskGeo = riceGeometry({ segments: 10, radial: 9, length: 0.55, radius: 0.175, husk: true });
  const riceGeo = riceGeometry({ segments: 16, radial: 14, length: 0.52, radius: 0.145 });

  const grains = STEPS.map((s, i) => {
    const mesh = new THREE.Mesh(
      s.husk ? huskGeo : riceGeo,
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(s.color),
        roughness: s.husk ? 0.86 : 0.33,
        metalness: 0.03,
        flatShading: s.husk,
      })
    );
    mesh.rotation.z = 0.5;
    mesh.rotation.y = i * 1.1;
    mesh.visible = false;
    scene.add(mesh);
    return mesh;
  });

  let boxes = [];

  function measure() {
    boxes = slots.map((s) => {
      const r = s.getBoundingClientRect();
      return { top: r.top + window.scrollY, left: r.left, w: r.width, h: r.height };
    });
  }

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    measure();
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('load', measure);
  document.fonts?.ready.then(measure);

  /* ------------------------------------------------------------- loop */

  let running = true;
  let onScreen = false;
  let pageVisible = true;
  let frame = 0;
  const clock = new THREE.Clock();

  function draw() {
    const vh = window.innerHeight;

    renderer.setScissorTest(false);
    renderer.clear();
    renderer.setScissorTest(true);

    const t = clock.elapsedTime;

    const scrolled = window.scrollY;

    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      const top = b.top - scrolled;
      const bottom = top + b.h;
      if (b.w === 0 || bottom < 0 || top > vh) continue;

      // WebGL counts y from the bottom of the drawing buffer
      renderer.setViewport(b.left, vh - bottom, b.w, b.h);
      renderer.setScissor(b.left, vh - bottom, b.w, b.h);

      camera.aspect = b.w / b.h;
      camera.updateProjectionMatrix();

      grains.forEach((g, j) => { g.visible = j === i; });
      grains[i].rotation.y = i * 1.1 + t * 0.55;

      renderer.render(scene, camera);
    }
  }

  function tick() {
    if (!running) return;
    frame = requestAnimationFrame(tick);
    if (!onScreen || !pageVisible) return;
    clock.getDelta();
    draw();
  }

  if (section) {
    new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        canvas.classList.toggle('is-live', onScreen);
        if (onScreen && reduced) draw();
      },
      { rootMargin: '10% 0px' }
    ).observe(section);
  }

  guardContext(canvas, {
    onLost: () => { running = false; cancelAnimationFrame(frame); },
    onRestored: () => { if (!reduced) { running = true; tick(); } },
  });

  if (reduced) {
    window.addEventListener('scroll', () => { if (onScreen) draw(); }, { passive: true });
  } else {
    tick();
    document.addEventListener('visibilitychange', () => { pageVisible = !document.hidden; });
  }

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(frame);
      huskGeo.dispose();
      riceGeo.dispose();
      grains.forEach((g) => g.material.dispose());
      renderer.dispose();
    },
  };
}
