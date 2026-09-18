/* ============================================================
   scene-story.js — the whole milling story, one scene
   A single fixed canvas sits behind the page. Scroll position is
   mapped to a continuous stage value 0–4 by main.js, and each
   whole number lands when one of the clear act sections is
   centred in the viewport:

     0  standing paddy, still in the field
     1  one grain, close, still inside its hull
     2  the hull splits and comes away — white rice underneath
     3  both held side by side, paddy left, milled right
     4  the milled grain pours into an open sack

   Everything in between is interpolated, so the scene is never
   in a state the scroll did not ask for.
   ============================================================ */

import * as THREE from 'three';
import { riceGeometry } from './rice-geometry.js';
import { ricePlant } from './rice-plant.js';
import { openSack } from './open-sack.js';
import { supportsWebGL, guardContext, makeQualityGuard } from './webgl.js';

const PADDY = new THREE.Color('#d2bb8a'); // hull on
const BROWN = new THREE.Color('#b3865a'); // shelled, bran still on
const WHITE = new THREE.Color('#faf6ec'); // milled

/* camera per act — lookAt is pushed left so the subject sits right of
   centre, clear of the act copy */
const CAM = [
  { p: [0, 1.3, 5.6], l: [0, 1.52, -3] },
  { p: [0.5, 0.3, 3.3], l: [-0.42, 0.06, 0] },
  { p: [-0.2, 0.26, 3.35], l: [-0.42, 0.03, 0] },
  { p: [0, 0.26, 3.95], l: [-0.55, 0.03, 0] },
  { p: [0, 1.5, 5.9], l: [-0.4, -0.3, 0] },
];

const POUR_TOP = 3.0;
const POUR_BOTTOM = 0.78;

export function initStory(canvas) {
  const el = canvas || document.querySelector('[data-story-canvas]');
  if (!el || !supportsWebGL()) return null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.innerWidth < 760;

  const PLANTS = small ? 240 : 620;
  const CLOUD = small ? 560 : 1100;

  const renderer = new THREE.WebGLRenderer({
    canvas: el,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const quality = makeQualityGuard(renderer);

  const scene = new THREE.Scene();
  scene.background = skyTexture();
  scene.fog = new THREE.FogExp2(0x1e3415, 0.03);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 90);

  /* ═══════════════════════════════════════════════ act 0 — the field */

  const fieldGroup = new THREE.Group();
  scene.add(fieldGroup);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(160, 160),
    new THREE.MeshStandardMaterial({ color: 0x2c4420, roughness: 0.96, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  fieldGroup.add(ground);

  const plantGeo = ricePlant({ height: 1.75, grains: 16 });
  const field = new THREE.InstancedMesh(
    plantGeo,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.74,
      metalness: 0.02,
      side: THREE.DoubleSide,
    }),
    PLANTS
  );
  field.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  fieldGroup.add(field);

  const stalks = new Array(PLANTS);
  const dummy = new THREE.Object3D();

  // paddy is transplanted in clumps, not scattered one by one
  let n = 0;
  while (n < PLANTS) {
    const z = 4.4 - Math.pow(Math.random(), 0.55) * 32;
    const spread = 5 + (4.4 - z) * 0.85;
    const cx = (Math.random() * 2 - 1) * spread;
    const per = Math.min(4 + ((Math.random() * 5) | 0), PLANTS - n);

    for (let k = 0; k < per; k++, n++) {
      stalks[n] = {
        x: cx + (Math.random() - 0.5) * 0.3,
        z: z + (Math.random() - 0.5) * 0.3,
        turn: Math.random() * Math.PI * 2,
        lean: (Math.random() - 0.5) * 0.2,
        scale: 0.85 + Math.random() * 0.75,
        speed: 0.5 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
      };
    }
  }

  /* ══════════════════════════════════════ grain in the air, throughout */

  const cloudGeo = riceGeometry({ segments: 12, radial: 8, length: 0.5, radius: 0.145 });
  const cloud = new THREE.InstancedMesh(
    cloudGeo,
    new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.03 }),
    CLOUD
  );
  cloud.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(cloud);

  const motes = new Array(CLOUD);
  const tint = new THREE.Color();

  for (let i = 0; i < CLOUD; i++) {
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
      column: 0.05 + Math.random() * 0.17, // radius in the pour
      pours: Math.random() < 0.22, // only a fifth joins it — a stream, not a rope
      white: 0,
    };
    cloud.setColorAt(i, PADDY);
  }
  cloud.instanceColor.needsUpdate = true;

  /* ═════════════════════════════ acts 1–3 — one grain, hull and kernel */

  const assembly = new THREE.Group();
  assembly.scale.setScalar(0.001);
  scene.add(assembly);

  const hullMat = new THREE.MeshStandardMaterial({
    color: 0xd9c396,
    roughness: 0.84,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });

  const hullGroup = new THREE.Group();
  assembly.add(hullGroup);

  const hullA = new THREE.Mesh(
    riceGeometry({ segments: 26, radial: 28, length: 0.55, radius: 0.165, husk: true, ridges: 11, ridgeDepth: 0.075, phiStart: 0, phiLength: Math.PI }),
    hullMat
  );
  const hullB = new THREE.Mesh(
    riceGeometry({ segments: 26, radial: 28, length: 0.55, radius: 0.165, husk: true, ridges: 11, ridgeDepth: 0.075, phiStart: Math.PI, phiLength: Math.PI }),
    hullMat
  );
  hullGroup.add(hullA, hullB);

  // the bristle off the tip — the detail that makes it read as paddy
  const awn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.005, 0.0011, 0.44, 5, 1),
    hullMat
  );
  awn.position.set(0.025, 0.76, 0);
  awn.rotation.z = -0.14;
  hullA.add(awn);

  const kernel = new THREE.Mesh(
    riceGeometry({ segments: 30, radial: 20, length: 0.49, radius: 0.132 }),
    new THREE.MeshStandardMaterial({ color: 0xfbf8f2, roughness: 0.3, metalness: 0.02 })
  );
  assembly.add(kernel);

  /* ═══════════════════════════════════════════ act 4 — the open sack */

  const sack = openSack(renderer, { heapGrains: small ? 160 : 320 });
  sack.group.scale.setScalar(0.001);
  sack.group.position.y = -1.15;
  scene.add(sack.group);

  const shadowCatcher = new THREE.Mesh(
    new THREE.CircleGeometry(2.4, 48),
    new THREE.ShadowMaterial({ opacity: 0.3 })
  );
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.position.y = -1.16;
  shadowCatcher.receiveShadow = true;
  shadowCatcher.visible = false;
  scene.add(shadowCatcher);

  /* ════════════════════════════════════════════════════════════ light */

  const sky = new THREE.HemisphereLight(0xfff8e6, 0x4c5c32, 1.3);
  scene.add(sky);
  const SKY_FIELD = new THREE.Color(0x4c5c32);
  const SKY_CLOSE = new THREE.Color(0x6f6a54);

  // low sun behind the crop, so the stalks catch a rim like the reference
  const sun = new THREE.DirectionalLight(0xffd68a, 2.3);
  sun.position.set(-9, 6, -12);
  scene.add(sun);

  // straight down the lens, so nothing close to camera falls into its own shade
  const front = new THREE.DirectionalLight(0xfffdf6, 1.5);
  front.position.set(0.5, 2, 9);
  scene.add(front);

  const key = new THREE.DirectionalLight(0xfffaf0, 2.6);
  key.position.set(6, 9, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 4;
  key.shadow.camera.far = 22;
  key.shadow.camera.left = -3;
  key.shadow.camera.right = 3;
  key.shadow.camera.top = 3;
  key.shadow.camera.bottom = -3;
  key.shadow.bias = -0.0009;
  scene.add(key);

  /* ══════════════════════════════════════════════════════════ pointer */

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

  /* ═══════════════════════════════════════════════════════════ sizing */

  function resize() {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(el);

  /* ════════════════════════════════════════════════════════════ stage */

  let stage = 0;
  let wantStage = 0;
  let painted = -1;

  /** 0 = standing in the field, 1 = milled white. Cheap on purpose. */
  function setStage(s) {
    wantStage = clamp(s, 0, CAM.length - 1);
  }

  /* the costly half, run at most once per frame from step() */
  function applyStage() {
    stage = wantStage;
    if (Math.abs(stage - painted) < 0.01) return;
    painted = stage;

    for (let i = 0; i < CLOUD; i++) {
      const m = motes[i];
      // each grain turns at its own point, so the change sweeps the cloud
      const local = clamp((stage - 1.1 - m.seed * 0.5) / 1.2, 0, 1);

      if (local < 0.5) tint.lerpColors(PADDY, BROWN, local * 2);
      else tint.lerpColors(BROWN, WHITE, (local - 0.5) * 2);

      cloud.setColorAt(i, tint);
      m.white = local;
    }
    cloud.instanceColor.needsUpdate = true;
  }

  /* ═════════════════════════════════════════════════════════════ loop */

  const clock = new THREE.Clock();
  let running = true;
  let onScreen = true;
  let pageVisible = true;
  let frame = 0;

  function step(dt, t) {
    applyStage();
    const s = stage;

    /* --- how much of each act is showing --- */
    const fieldOut = smoothstep(0.1, 0.95, s);
    const grainIn = smoothstep(0.35, 1.0, s);
    const split = smoothstep(1.1, 2.0, s) * (1 - smoothstep(2.15, 2.7, s));
    const pair = smoothstep(2.45, 3.0, s);
    const grainOut = smoothstep(3.3, 3.85, s);
    const sackIn = smoothstep(3.2, 3.9, s);
    const pour = smoothstep(3.45, 4.0, s);

    /* --- the field sways, then sinks away --- */
    fieldGroup.visible = fieldOut < 0.995;
    if (fieldGroup.visible) {
      fieldGroup.position.y = -fieldOut * 11;

      for (let i = 0; i < PLANTS; i++) {
        const k = stalks[i];
        dummy.position.set(k.x, 0, k.z);
        dummy.rotation.set(
          Math.sin(t * k.speed * 0.7 + k.phase) * 0.05,
          k.turn,
          k.lean + Math.sin(t * k.speed + k.phase) * 0.08
        );
        dummy.scale.setScalar(k.scale);
        dummy.updateMatrix();
        field.setMatrixAt(i, dummy.matrix);
      }
      field.instanceMatrix.needsUpdate = true;
    }

    /* --- the grain in the air, and later the pour --- */
    for (let i = 0; i < CLOUD; i++) {
      const m = motes[i];

      m.y += m.rise * dt * (0.5 + Math.min(s, 1));
      if (m.y > 10.5) m.y = 0.6;
      m.x += m.drift * dt;
      if (m.x > 16) m.x = -16;
      else if (m.x < -16) m.x = 16;

      let px = m.x + Math.sin(t * 0.5 + m.phase) * 0.3;
      let py = m.y - fieldOut * 4.5;
      let pz = m.z;

      if (pour > 0.001 && m.pours) {
        // funnel into a narrow column dropping into the sack mouth
        const span = POUR_TOP - POUR_BOTTOM;
        const fall = POUR_TOP - (((t * (1.5 + m.rise * 2.2) + m.seed * span * 7) % span));
        const a = m.phase + t * 0.5;
        // the stream spreads on the way down, like grain off a chute
        const rad = m.column * (0.3 + 0.95 * ((fall - POUR_BOTTOM) / span));

        px = mix(px, Math.cos(a) * rad, pour);
        py = mix(py, fall, pour);
        pz = mix(pz, Math.sin(a) * rad, pour);
      }

      const shed = 1.16 - 0.16 * m.white;

      dummy.position.set(px, py, pz);
      dummy.rotation.set(m.phase + t * m.spin, t * m.spin * 0.6, m.phase * 0.7 + t * m.spin * 0.4);
      dummy.scale.setScalar(m.scale * shed);
      dummy.updateMatrix();
      cloud.setMatrixAt(i, dummy.matrix);
    }
    cloud.instanceMatrix.needsUpdate = true;

    /* --- the single grain: hull splits, kernel steps out, then both --- */
    const show = grainIn * (1 - grainOut);
    assembly.visible = show > 0.01;

    if (assembly.visible) {
      assembly.scale.setScalar(0.92 * show);
      assembly.rotation.y = t * 0.24;
      assembly.rotation.z = 0.2;

      hullGroup.position.x = -pair * 0.46;
      hullA.position.x = split * 0.55;
      hullA.rotation.z = split * 0.45;
      hullB.position.x = -split * 0.55;
      hullB.rotation.z = -split * 0.45;

      kernel.position.x = pair * 0.46;
      kernel.scale.setScalar(0.94 + pair * 0.06);
    }

    /* --- the sack fills --- */
    sack.group.visible = sackIn > 0.01;
    if (sack.group.visible) {
      sack.group.scale.setScalar(1.45 * sackIn);
      sack.setFill(pour);
      shadowCatcher.visible = sackIn > 0.5;
    } else {
      shadowCatcher.visible = false;
    }

    /* --- camera walks the keyframes --- */
    const i0 = Math.min(Math.floor(s), CAM.length - 1);
    const i1 = Math.min(i0 + 1, CAM.length - 1);
    const f = ease(s - i0);

    pointer.x += (aim.x - pointer.x) * 0.05;
    pointer.y += (aim.y - pointer.y) * 0.05;

    const side = small ? 0 : 1; // on a phone the copy is full width, so centre it

    camera.position.set(
      mix(CAM[i0].p[0], CAM[i1].p[0], f) + pointer.x * 0.35,
      mix(CAM[i0].p[1], CAM[i1].p[1], f) - pointer.y * 0.22,
      mix(CAM[i0].p[2], CAM[i1].p[2], f)
    );
    camera.lookAt(
      mix(CAM[i0].l[0], CAM[i1].l[0], f) * side + pointer.x * 0.2,
      mix(CAM[i0].l[1], CAM[i1].l[1], f),
      mix(CAM[i0].l[2], CAM[i1].l[2], f)
    );

    // the close-ups want a darker ground than the field does
    const close = smoothstep(0.3, 1.2, s);
    sky.groundColor.lerpColors(SKY_FIELD, SKY_CLOSE, close);
    front.intensity = mix(0.2, 1.7, close);
    scene.backgroundIntensity = mix(1, 0.4, close);
    scene.fog.density = mix(0.03, 0.012, smoothstep(0.3, 1.2, s));
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

  /* only draw while one of the clear act sections is actually showing */
  const acts = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) acts.add(e.target);
      else acts.delete(e.target);
    });
    onScreen = acts.size > 0;
    if (onScreen && reduced) {
      step(0, 0);
      render();
    }
  });
  document.querySelectorAll('[data-act]').forEach((a) => io.observe(a));

  setStage(0);

  if (reduced) {
    step(0, 0);
    render();
    window.addEventListener(
      'scroll',
      () => {
        if (!onScreen) return;
        step(0, 0);
        render();
      },
      { passive: true }
    );
  } else {
    tick();
    document.addEventListener('visibilitychange', () => { pageVisible = !document.hidden; });
  }

  return {
    setStage,
    destroy() {
      running = false;
      cancelAnimationFrame(frame);
      io.disconnect();
      plantGeo.dispose();
      cloudGeo.dispose();
      hullA.geometry.dispose();
      hullB.geometry.dispose();
      kernel.geometry.dispose();
      hullMat.dispose();
      sack.dispose();
      renderer.dispose();
    },
  };
}

/* ------------------------------------------------------------- helpers */

const mix = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const ease = (t) => t * t * (3 - 2 * t);

function smoothstep(a, b, x) {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
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
