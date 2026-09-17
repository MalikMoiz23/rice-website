/* ============================================================
   scene-hero.js — the grain field behind the hero
   A few thousand instanced grains drifting down through a slow
   swirl, lit warm from above and green from below so it reads as
   paddy rather than snow.
   ============================================================ */

import * as THREE from 'three';

const COLUMN_H = 18;   // half-height of the volume grains fall through
const R_INNER = 5;
const R_OUTER = 26;

const TINTS = [0xf4e8cb, 0xe9d7a6, 0xd9be7c, 0xfffaf0];

export function initHero(canvas) {
  const el = canvas || document.querySelector('[data-hero-canvas]');
  if (!el || !supportsWebGL()) return null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = window.innerWidth < 760 ? 1300 : 2800;

  const renderer = new THREE.WebGLRenderer({
    canvas: el,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x14230f, 0.021);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120);
  camera.position.set(0, 0, 28);

  /* ---- grain geometry: a sphere squeezed into a rice shape ---- */
  const grain = new THREE.SphereGeometry(1, 10, 7);
  grain.scale(0.23, 0.23, 0.86);

  const material = new THREE.MeshStandardMaterial({
    roughness: 0.52,
    metalness: 0.04,
    flatShading: false,
  });

  const mesh = new THREE.InstancedMesh(grain, material, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.position.z = -14;   // sit the whole column back so nothing clips the camera
  scene.add(mesh);

  /* ---- per-grain state, kept outside the matrix so the loop is cheap ---- */
  const grains = new Array(count);
  const dummy = new THREE.Object3D();
  const tint = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const depth = Math.random();
    grains[i] = {
      r: R_INNER + Math.pow(depth, 0.7) * (R_OUTER - R_INNER),
      theta: Math.random() * Math.PI * 2,
      y: (Math.random() * 2 - 1) * COLUMN_H,
      fall: 0.5 + Math.random() * 1.7,
      swirl: (0.06 + Math.random() * 0.13) * (Math.random() < 0.12 ? -1 : 1),
      spin: (Math.random() - 0.5) * 1.6,
      phase: Math.random() * Math.PI * 2,
      scale: 0.3 + Math.random() * 0.5,
    };

    tint.setHex(TINTS[(Math.random() * TINTS.length) | 0]);
    mesh.setColorAt(i, tint);
  }
  mesh.instanceColor.needsUpdate = true;

  /* ---- light: warm sun above, green bounce off the crop below ---- */
  scene.add(new THREE.HemisphereLight(0xfff2cf, 0x2b4020, 0.85));

  const sun = new THREE.DirectionalLight(0xffd68a, 2.1);
  sun.position.set(7, 13, 9);
  scene.add(sun);

  const bounce = new THREE.PointLight(0x9ed076, 260, 60, 2);
  bounce.position.set(-11, -6, 7);
  scene.add(bounce);

  const rim = new THREE.PointLight(0xffc45c, 190, 50, 2);
  rim.position.set(12, 4, -6);
  scene.add(rim);

  /* ---- pointer parallax ---- */
  const pointer = { x: 0, y: 0 };
  const aim = { x: 0, y: 0 };

  window.addEventListener(
    'pointermove',
    (e) => {
      aim.x = (e.clientX / window.innerWidth - 0.5) * 2;
      aim.y = (e.clientY / window.innerHeight - 0.5) * 2;
    },
    { passive: true }
  );

  /* ---- sizing ---- */
  function resize() {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(el);

  /* ---- loop ---- */
  const clock = new THREE.Clock();
  let running = true;
  let visible = true;
  let frame = 0;

  function step(dt, t) {
    for (let i = 0; i < count; i++) {
      const g = grains[i];

      g.y -= g.fall * dt;
      if (g.y < -COLUMN_H) g.y = COLUMN_H;
      g.theta += g.swirl * dt;

      // a little lateral sway so the fall is not a straight line
      const sway = Math.sin(t * 0.6 + g.phase) * 0.5;

      dummy.position.set(
        Math.cos(g.theta) * g.r + sway,
        g.y,
        Math.sin(g.theta) * g.r
      );
      dummy.rotation.set(
        g.phase + t * g.spin,
        g.theta * 1.4,
        g.phase * 0.5 + t * g.spin * 0.6
      );
      dummy.scale.setScalar(g.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    pointer.x += (aim.x - pointer.x) * 0.045;
    pointer.y += (aim.y - pointer.y) * 0.045;

    camera.position.x = pointer.x * 2.6;
    camera.position.y = -pointer.y * 1.8;
    camera.lookAt(0, 0, 0);

    // ease the whole field back as the hero scrolls away
    const past = Math.min(window.scrollY / (el.clientHeight || 1), 1);
    camera.position.z = 28 + past * 10;
    mesh.rotation.y = past * 0.5;
  }

  function render() {
    renderer.render(scene, camera);
  }

  function tick() {
    if (!running) return;
    frame = requestAnimationFrame(tick);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    step(dt, clock.elapsedTime);
    render();
  }

  if (reduced) {
    step(0, 0);
    render();
  } else {
    tick();

    // stop burning frames when the hero is off screen or the tab is hidden
    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    ).observe(el);

    document.addEventListener('visibilitychange', () => {
      visible = !document.hidden;
    });
  }

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(frame);
      grain.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}
