/* ============================================================
   scene-grade.js — one grade, at about forty times life size
   A single grain turning next to a sack of the same rice, over a
   slow drift of that grain filling the frame. Switching grade
   rebuilds the geometry, so the length and width on screen are
   the ones on the spec sheet rather than a tint swap.
   ============================================================ */

import * as THREE from 'three';
import { riceGeometry } from './rice-geometry.js';
import { openSack } from './open-sack.js';
import { GRADES } from './grades.js';
import { supportsWebGL, guardContext, makeQualityGuard } from './webgl.js';

export function initGrade(canvas) {
  const el = canvas || document.querySelector('[data-grade-canvas]');
  const section = document.getElementById('grade');
  if (!el || !supportsWebGL()) return null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.innerWidth < 760;
  const DRIFT = small ? 320 : 900;

  const renderer = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.15;
  const quality = makeQualityGuard(renderer);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a1206, 0.09);

  // the subject sits right of centre, clear of the spec column
  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 40);
  camera.position.set(0, 0.25, 3.8);

  /* ────────────────────────────────────────────── the single grain */

  const heroMat = new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.04 });
  const hero = new THREE.Mesh(new THREE.BufferGeometry(), heroMat);
  hero.position.set(-0.3, 0.16, 0.7);
  // geometry arrives with setGrade, so a bounding sphere computed now would be empty
  hero.frustumCulled = false;
  scene.add(hero);

  /* ───────────────────────────────────── a sack of the same rice */

  const sack = openSack(renderer, { heapGrains: small ? 180 : 420 });
  sack.group.scale.setScalar(0.78);
  sack.group.position.set(0.52, -0.7, -0.55);
  sack.setFill(1);
  scene.add(sack.group);

  /* ──────────────────────────────── the same grain, filling the frame */

  const driftMat = new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.02 });
  const drift = new THREE.InstancedMesh(new THREE.BufferGeometry(), driftMat, DRIFT);
  drift.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  drift.frustumCulled = false;
  scene.add(drift);

  const motes = new Array(DRIFT);
  for (let i = 0; i < DRIFT; i++) {
    motes[i] = {
      x: (Math.random() * 2 - 1) * 5.5,
      y: (Math.random() * 2 - 1) * 3.2,
      z: -2.6 - Math.random() * 9,
      fall: 0.06 + Math.random() * 0.3,
      spin: (Math.random() - 0.5) * 0.7,
      phase: Math.random() * Math.PI * 2,
      scale: 0.17 + Math.random() * 0.3,
    };
  }

  /* ───────────────────────────────────────────────────────── light */

  scene.add(new THREE.HemisphereLight(0xfff6e4, 0x2b3a1c, 1.0));

  const key = new THREE.DirectionalLight(0xfff6e2, 3.1);
  key.position.set(3, 4, 5);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xffd68a, 1.9);
  rim.position.set(-4, 1.5, -3);
  scene.add(rim);

  const front = new THREE.DirectionalLight(0xffffff, 0.9);
  front.position.set(0, 0.5, 8);
  scene.add(front);

  /* ─────────────────────────────────────────────────────── sizing */

  function resize() {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // on a phone the copy is full width, so centre the subject instead
    camera.lookAt(w < 780 ? 0 : -0.85, 0.05, 0);
  }
  resize();
  new ResizeObserver(resize).observe(el);

  /* ──────────────────────────────────────────────────── the grade */

  let current = -1;
  let swap = 0; // 0–1, drives the little pulse when a grade changes

  function setGrade(index) {
    const g = GRADES[index];
    if (!g || index === current) return;
    current = index;

    const { length, radius, color, roughness } = g.grain;

    hero.geometry.dispose();
    hero.geometry = riceGeometry({ segments: 34, radial: 24, length, radius });
    heroMat.color.setHex(color);
    heroMat.roughness = roughness;

    drift.geometry.dispose();
    drift.geometry = riceGeometry({ segments: 10, radial: 8, length, radius });
    driftMat.color.setHex(color).multiplyScalar(0.42);

    sack.setGrainColor(color);
    swap = 1;
  }

  setGrade(0);

  /* ───────────────────────────────────────────────────────── loop */

  const clock = new THREE.Clock();
  const dummy = new THREE.Object3D();
  let running = true;
  let onScreen = false;
  let pageVisible = true;
  let frame = 0;

  function step(dt, t) {
    swap = Math.max(0, swap - dt * 2.2);
    const pulse = 1 + Math.sin(swap * Math.PI) * 0.12;

    hero.rotation.set(0.42, t * 0.5, Math.sin(t * 0.6) * 0.1);
    hero.position.y = 0.16 + Math.sin(t * 0.7) * 0.05;
    // grades.js now holds true half-measurements, so the display scale carries
    // the magnification instead of the data being wrong
    hero.scale.setScalar(1.95 * pulse);

    sack.group.rotation.y = Math.sin(t * 0.25) * 0.28;

    for (let i = 0; i < DRIFT; i++) {
      const m = motes[i];
      m.y -= m.fall * dt;
      if (m.y < -3.4) m.y = 3.4;

      dummy.position.set(m.x + Math.sin(t * 0.3 + m.phase) * 0.12, m.y, m.z);
      dummy.rotation.set(m.phase + t * m.spin, t * m.spin * 0.7, m.phase * 0.5);
      dummy.scale.setScalar(m.scale * pulse);
      dummy.updateMatrix();
      drift.setMatrixAt(i, dummy.matrix);
    }
    drift.instanceMatrix.needsUpdate = true;
  }

  function render() {
    renderer.render(scene, camera);
  }

  function tick() {
    if (!running) return;
    frame = requestAnimationFrame(tick);
    if (!onScreen || !pageVisible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    quality(dt);
    step(dt, clock.elapsedTime);
    render();
  }

  guardContext(el, {
    onLost: () => { running = false; cancelAnimationFrame(frame); },
    onRestored: () => { if (!reduced) { running = true; tick(); } },
  });

  if (section) {
    new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && reduced) {
          step(0, 0);
          render();
        }
      },
      { rootMargin: '15% 0px' }
    ).observe(section);
  }

  if (reduced) {
    step(0, 0);
    render();
  } else {
    tick();
    document.addEventListener('visibilitychange', () => { pageVisible = !document.hidden; });
  }

  return {
    setGrade,
    destroy() {
      running = false;
      cancelAnimationFrame(frame);
      hero.geometry.dispose();
      heroMat.dispose();
      drift.geometry.dispose();
      driftMat.dispose();
      sack.dispose();
      renderer.dispose();
    },
  };
}
