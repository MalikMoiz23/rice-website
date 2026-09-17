/* ============================================================
   scene-hero.js — paddy field to white rice
   Scroll drives one continuous scene. At the top the camera sits
   down among standing paddy; as the page moves the grain lifts
   off the field, sheds its hull and comes out milled white while
   the camera climbs away from the crop.
   ============================================================ */

import * as THREE from 'three';
import { riceGeometry } from './rice-geometry.js';
import { ricePlant } from './rice-plant.js';

/* the three states the grain passes through */
const PADDY = new THREE.Color('#c9a24a'); // in the hull, off the field
const BROWN = new THREE.Color('#b3865a'); // shelled, not yet polished
const WHITE = new THREE.Color('#faf6ec'); // milled

const CAM_NEAR = { pos: [0, 2.05, 7], look: [0, 1.1, -3] };
const CAM_FAR = { pos: [0, 7.0, 13], look: [0, 4.6, -3] };

export function initHero(canvas) {
  const el = canvas || document.querySelector('[data-hero-canvas]');
  if (!el || !supportsWebGL()) return null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.innerWidth < 760;

  const PLANTS = small ? 230 : 520;
  const GRAINS = small ? 700 : 1500;

  const renderer = new THREE.WebGLRenderer({
    canvas: el,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();
  // a painted sky, so the fogged ground melts into it instead of ending on a
  // hard line where the canvas goes transparent
  scene.background = skyTexture();
  scene.fog = new THREE.FogExp2(0x1e3415, 0.03);

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 90);

  /* ------------------------------------------------------------ ground */

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(140, 140),
    new THREE.MeshStandardMaterial({ color: 0x2c4420, roughness: 0.95, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  scene.add(ground);

  /* -------------------------------------------------------- the crop */

  const plantGeo = ricePlant({ height: 1.7, grains: 10 });
  const field = new THREE.InstancedMesh(
    plantGeo,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.72,
      metalness: 0.02,
      side: THREE.DoubleSide,
    }),
    PLANTS
  );
  field.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(field);

  const stalks = new Array(PLANTS);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < PLANTS; i++) {
    // nothing directly in front of the camera, and the field widens with depth
    const z = 1 - Math.pow(Math.random(), 0.55) * 30;
    const spread = 6 + (1 - z) * 0.95;

    stalks[i] = {
      x: (Math.random() * 2 - 1) * spread,
      z,
      turn: Math.random() * Math.PI * 2,
      lean: (Math.random() - 0.5) * 0.16,
      scale: 0.9 + Math.random() * 0.7,
      speed: 0.55 + Math.random() * 0.75,
      phase: Math.random() * Math.PI * 2,
    };
  }

  /* ------------------------------------------------- grain in the air */

  const grainGeo = riceGeometry({ segments: 12, radial: 8, length: 0.5, radius: 0.145 });
  const air = new THREE.InstancedMesh(
    grainGeo,
    new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.03 }),
    GRAINS
  );
  air.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(air);

  const motes = new Array(GRAINS);
  const tint = new THREE.Color();

  for (let i = 0; i < GRAINS; i++) {
    motes[i] = {
      x: (Math.random() * 2 - 1) * 15,
      y: 0.7 + Math.random() * 9,
      z: -1 - Math.random() * 26,
      rise: 0.22 + Math.random() * 0.62,
      drift: (Math.random() - 0.5) * 0.35,
      spin: (Math.random() - 0.5) * 1.5,
      phase: Math.random() * Math.PI * 2,
      seed: Math.random(),
      scale: 0.2 + Math.random() * 0.2,
      white: 0,
    };
    air.setColorAt(i, PADDY);
  }
  air.instanceColor.needsUpdate = true;

  /* ------------------------------------------------------------ light */

  scene.add(new THREE.HemisphereLight(0xfff8e6, 0x4c5c32, 1.35));

  // low sun behind the crop, so the stalks catch a rim
  const sun = new THREE.DirectionalLight(0xffd68a, 2.4);
  sun.position.set(-9, 6, -12);
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0xfffaf0, 2.7);
  fill.position.set(6, 9, 8);
  scene.add(fill);

  /* ---------------------------------------------------------- pointer */

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

  /* ----------------------------------------------------------- sizing */

  function resize() {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(el);

  /* --------------------------------------------------------- progress */

  let progress = 0;
  let painted = -1;

  /** 0 = standing in the field, 1 = milled white */
  function setProgress(p) {
    progress = clamp(p, 0, 1);

    // recolouring walks every instance, so only do it when it would show
    if (Math.abs(progress - painted) < 0.004) return;
    painted = progress;

    for (let i = 0; i < GRAINS; i++) {
      const m = motes[i];
      // each grain turns at a slightly different point, so the change sweeps
      const local = clamp((progress - m.seed * 0.26) * 1.7, 0, 1);

      if (local < 0.5) tint.lerpColors(PADDY, BROWN, local * 2);
      else tint.lerpColors(BROWN, WHITE, (local - 0.5) * 2);

      air.setColorAt(i, tint);
      m.white = local;
    }
    air.instanceColor.needsUpdate = true;
  }

  /* ------------------------------------------------------------- loop */

  const clock = new THREE.Clock();
  let running = true;
  let visible = true;
  let frame = 0;

  function step(dt, t) {
    /* crop sways, and sinks as the camera climbs out of it */
    for (let i = 0; i < PLANTS; i++) {
      const s = stalks[i];
      dummy.position.set(s.x, -progress * 2.2, s.z);
      dummy.rotation.set(
        Math.sin(t * s.speed * 0.7 + s.phase) * 0.05,
        s.turn,
        s.lean + Math.sin(t * s.speed + s.phase) * 0.075
      );
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      field.setMatrixAt(i, dummy.matrix);
    }
    field.instanceMatrix.needsUpdate = true;

    /* grain lifts off the field and tumbles */
    for (let i = 0; i < GRAINS; i++) {
      const m = motes[i];

      m.y += m.rise * dt * (0.5 + progress);
      if (m.y > 10.5) m.y = 0.6;
      m.x += m.drift * dt;
      if (m.x > 16) m.x = -16;
      else if (m.x < -16) m.x = 16;

      // the hull is bulkier than the milled grain inside it
      const shed = 1.16 - 0.16 * m.white;

      dummy.position.set(m.x + Math.sin(t * 0.5 + m.phase) * 0.3, m.y + progress * 1.6, m.z);
      dummy.rotation.set(m.phase + t * m.spin, t * m.spin * 0.6, m.phase * 0.7 + t * m.spin * 0.4);
      dummy.scale.setScalar(m.scale * shed);
      dummy.updateMatrix();
      air.setMatrixAt(i, dummy.matrix);
    }
    air.instanceMatrix.needsUpdate = true;

    /* camera climbs out of the crop as the grain is milled */
    const e = progress * progress * (3 - 2 * progress); // smoothstep
    pointer.x += (aim.x - pointer.x) * 0.05;
    pointer.y += (aim.y - pointer.y) * 0.05;

    camera.position.set(
      mix(CAM_NEAR.pos[0], CAM_FAR.pos[0], e) + pointer.x * 0.9,
      mix(CAM_NEAR.pos[1], CAM_FAR.pos[1], e) - pointer.y * 0.5,
      mix(CAM_NEAR.pos[2], CAM_FAR.pos[2], e)
    );
    camera.lookAt(
      mix(CAM_NEAR.look[0], CAM_FAR.look[0], e) + pointer.x * 0.5,
      mix(CAM_NEAR.look[1], CAM_FAR.look[1], e),
      mix(CAM_NEAR.look[2], CAM_FAR.look[2], e)
    );
  }

  function tick() {
    if (!running) return;
    frame = requestAnimationFrame(tick);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    step(dt, clock.elapsedTime);
    renderer.render(scene, camera);
  }

  setProgress(0);

  if (reduced) {
    // no idle motion, but the scene still follows the scroll
    const once = () => {
      step(0, 0);
      renderer.render(scene, camera);
    };
    once();
    window.addEventListener('scroll', once, { passive: true });
  } else {
    tick();
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 }).observe(el);
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
  }

  return {
    setProgress,
    destroy() {
      running = false;
      cancelAnimationFrame(frame);
      plantGeo.dispose();
      grainGeo.dispose();
      field.material.dispose();
      air.material.dispose();
      renderer.dispose();
    },
  };
}

/* vertical gradient standing in for a sky; the bottom stop matches the fog */
function skyTexture() {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#15250e');
  grad.addColorStop(0.55, '#1c3113');
  grad.addColorStop(1, '#1e3415');
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 256);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.mapping = THREE.EquirectangularReflectionMapping;
  return tex;
}

const mix = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}
