/* ============================================================
   scene-dish.js — the dish being made, in four scroll steps

     0  dry grain in the vessel, as it comes out of the bag
     1  washed and soaking, the grain swells
     2  the chicken curry goes in and the rice piles over it
     3  finished — full length, colour in patches, fried onion,
        mint, chicken sitting in it, steam coming off

   Two things here are tied to real figures rather than picked to
   look nice:

   - every grain is the real grade. Raw length and width come from
     grades.js, and the finished mound scales each grain by that
     grade's actual cooked elongation, so biryani reads long and
     loose because Super Basmati really does grow 2.1 times.

   - a vessel is not a cylinder. VESSELS carries where the floor
     is and how wide rice can lie on it, separately from where the
     cooked surface sits and how wide the heap may be up there.
     Sizing the heap from dishes.js alone put rice through the
     side of the bowl and onto the table.
   ============================================================ */

import * as THREE from 'three';
import { riceGeometry } from './rice-geometry.js';
import { GRADES } from './grades.js';
import { DISHES } from './dishes.js';
import { supportsWebGL, guardContext, makeQualityGuard } from './webgl.js';

const TAU = Math.PI * 2;

/* bottom-to-top lathe profiles, [radius, height].

   `base`/`bed` are where dry rice lies on the floor and how wide it spreads
   there. `fill`/`cap` are where the cooked surface sits and how wide the heap
   may be at that height, which is higher up and so wider. `view` lifts the
   camera so a deep pot is seen into rather than across. */
const VESSELS = {
  /* the engraved copper thaal biryani is served out of */
  copper: {
    profile: [[0, 0.06], [1.4, 0.02], [1.58, 0.14], [1.74, 0.32], [1.84, 0.42], [1.77, 0.45]],
    material: { color: 0x8a5a2f, roughness: 0.33, metalness: 0.88 },
    bed: 1.24, base: 0.06, fill: 0.12, cap: 1.28,
    view: { lift: 1, look: 0.15 },
  },
  /* a plain white plate, which is what pulao turns up on */
  plate: {
    profile: [[0, 0.04], [1.28, 0], [1.48, 0.1], [1.64, 0.24], [1.71, 0.31]],
    material: { color: 0xf3efe7, roughness: 0.3, metalness: 0.02 },
    bed: 1.15, base: 0.04, fill: 0.1, cap: 1.2,
    view: { lift: 1, look: 0.12 },
  },
  degh: {
    profile: [[0, 0], [0.92, 0], [1.2, 0.26], [1.32, 0.72], [1.28, 1.02], [1.39, 1.1]],
    material: { color: 0xb9a179, roughness: 0.32, metalness: 0.72 },
    bed: 0.86, base: 0.06, fill: 0.62, cap: 1.06,
    view: { lift: 1.5, look: 0.95 },
  },
  bowl: {
    profile: [[0, 0.02], [0.52, 0], [0.84, 0.24], [0.97, 0.56], [1.03, 0.65]],
    material: { color: 0xeee7d8, roughness: 0.44, metalness: 0.04 },
    bed: 0.5, base: 0.06, fill: 0.34, cap: 0.8,
    view: { lift: 1.2, look: 0.5 },
  },
};

/* camera, one keyframe per step */
const CAM = [
  { p: [0, 3.15, 5.3], l: [0, 0.18, 0] },
  { p: [0, 2.65, 4.7], l: [0, 0.24, 0] },
  { p: [0.95, 2.1, 4.25], l: [0, 0.4, 0] },
  { p: [0.55, 1.72, 3.8], l: [0, 0.46, 0] },
];

export function initDish(riceIndex, canvas) {
  const el = canvas || document.querySelector('[data-dish-canvas]');
  if (!el || !supportsWebGL()) return null;

  const dish = DISHES[riceIndex];
  const grade = GRADES[riceIndex];
  if (!dish || !grade) return null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.innerWidth < 760;
  const COUNT = small ? 2200 : 5200;
  const top = dish.top || {};
  const many = (n) => (small ? Math.round((n || 0) * 0.5) : n || 0);

  const renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.16;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const quality = makeQualityGuard(renderer);

  const scene = new THREE.Scene();
  scene.background = backdrop();
  scene.fog = new THREE.FogExp2(0x120d07, 0.055);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 60);

  /* ─────────────────────────────────────────────────────── vessel */

  const vessel = VESSELS[dish.vessel];
  const pot = new THREE.Mesh(
    new THREE.LatheGeometry(vessel.profile.map(([r, y]) => new THREE.Vector2(r, y)), 72),
    new THREE.MeshStandardMaterial({ ...vessel.material, side: THREE.DoubleSide })
  );
  pot.castShadow = true;
  pot.receiveShadow = true;
  scene.add(pot);

  const table = new THREE.Mesh(
    new THREE.CircleGeometry(6, 48),
    new THREE.MeshStandardMaterial({ color: 0x241809, roughness: 0.95 })
  );
  table.rotation.x = -Math.PI / 2;
  table.position.y = -0.002;
  table.receiveShadow = true;
  scene.add(table);

  const moundR = Math.min(dish.cook.mound.r, vessel.cap);
  const moundH = dish.cook.mound.h;
  const floor = vessel.fill; // the cooked surface, part-way up the vessel
  const bedY = vessel.base;  // the dry grain, down on the floor

  /* ──────────────────────────────── the curry layer underneath */

  let masala = null;
  if (dish.masala !== null) {
    masala = new THREE.Mesh(
      new THREE.CylinderGeometry(moundR * 0.95, moundR * 0.86, 0.16, 40),
      new THREE.MeshStandardMaterial({ color: dish.masala, roughness: 0.68, transparent: true })
    );
    masala.position.y = floor - 0.07;
    scene.add(masala);
  }

  /* ────────────────────────────── kheer sits in milk, not on air */

  let milk = null;
  if (dish.cook.creamy) {
    milk = new THREE.Mesh(
      new THREE.CylinderGeometry(moundR * 1.04, moundR * 0.88, 0.3, 40),
      new THREE.MeshStandardMaterial({ color: 0xfaf3e2, roughness: 0.28, transparent: true })
    );
    milk.position.y = floor - 0.05;
    scene.add(milk);
  }

  /* ─────────────────────────────────────────────────── the rice */

  /* A cooked grain is about 15 mm against a platter around 350 mm across. The
     vessel here is roughly 3.4 units wide, so a finished grain wants to be
     about 0.15 long — and it has to be that AFTER the elongation below, which
     is why the raw size is divided by it. */
  const cookedLength = 0.15;
  const halfRaw = cookedLength / 2 / dish.cook.grow;

  const grainGeo = riceGeometry({
    segments: 8,
    radial: 7,
    length: halfRaw,
    radius: halfRaw / 4, // raw rice is about four times as long as it is wide
  });

  const rice = new THREE.InstancedMesh(
    grainGeo,
    new THREE.MeshStandardMaterial({ roughness: 0.36, metalness: 0.02 }),
    COUNT
  );
  rice.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  rice.castShadow = true;
  scene.add(rice);

  const raw = new THREE.Color(grade.grain.color);
  const tints = dish.cook.tint.map((hex) => new THREE.Color(hex));
  const grains = new Array(COUNT);
  const tint = new THREE.Color();

  for (let i = 0; i < COUNT; i++) {
    // dry: a flat bed across the floor of the vessel
    const ra = Math.random() * TAU;
    const rr = vessel.bed * Math.sqrt(Math.random());

    // cooked: filling a dome, which is how a served mound actually sits
    const ca = Math.random() * TAU;
    const cr = moundR * Math.sqrt(Math.random());
    const cap = moundH * (1 - (cr / moundR) ** 2);
    const cx = Math.cos(ca) * cr;
    const cz = Math.sin(ca) * cr;

    grains[i] = {
      dry: [Math.cos(ra) * rr, bedY + 0.01 + Math.random() * 0.07, Math.sin(ra) * rr],
      done: [cx, floor + cap * (0.18 + 0.82 * Math.random()), cz],
      // tipped flat, then given a heading — a bed of rice lies down
      spin: [Math.PI / 2 + (Math.random() - 0.5) * 0.75, Math.random() * TAU, (Math.random() - 0.5) * 0.5],
      wobble: Math.random() * TAU,
      shade: dish.cook.patchy ? patchAt(cx, cz) : pickTint(dish.cook.mix),
      jitter: 0.9 + Math.random() * 0.25,
    };
    rice.setColorAt(i, raw);
  }
  rice.instanceColor.needsUpdate = true;

  /* ───────────────────────────────────────── water while soaking */

  const water = new THREE.Mesh(
    new THREE.CylinderGeometry(vessel.bed * 1.06, vessel.bed * 0.96, 0.26, 44),
    new THREE.MeshPhysicalMaterial({
      color: 0xdfe8dc,
      roughness: 0.08,
      transmission: 0.9,
      thickness: 0.4,
      transparent: true,
      opacity: 0,
    })
  );
  water.position.y = bedY + 0.09;
  scene.add(water);

  /* ═══════════════════════ what goes on and in the finished rice ══ */

  const props = new THREE.Group(); // chicken and kebab, each scaled in place
  scene.add(props);
  const pieces = [];

  /* chicken — the thing the first version of this was missing */
  const chickenCount = many(top.chicken);
  for (let i = 0; i < chickenCount; i++) {
    const stick = drumstick();
    const a = (i / chickenCount) * TAU + 0.6;
    const r = moundR * 0.5;
    const cap = moundH * (1 - (r / moundR) ** 2);
    // resting on the surface, tipped over, the way a drumstick lies
    stick.position.set(Math.cos(a) * r, floor + cap + 0.04, Math.sin(a) * r);
    stick.rotation.set(-1.28 + (Math.random() - 0.5) * 0.25, a + 1.1, (Math.random() - 0.5) * 0.35);
    stick.userData.size = 1.35;
    stick.scale.setScalar(0.001);
    props.add(stick);
    pieces.push(stick);
  }

  /* shami kebab — flat, browned, sitting on the rice */
  const kebabCount = many(top.kebab);
  for (let i = 0; i < kebabCount; i++) {
    const kebab = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.185, 0.06, 20),
      new THREE.MeshStandardMaterial({ color: 0x7a4a24, roughness: 0.78 })
    );
    const a = -2.5 + i * 1.25; // clear of the chicken, which sits at 0.6
    const r = moundR * 0.56;
    const cap = moundH * (1 - (r / moundR) ** 2);
    kebab.position.set(Math.cos(a) * r, floor + cap + 0.03, Math.sin(a) * r);
    kebab.rotation.set((Math.random() - 0.5) * 0.25, Math.random() * TAU, (Math.random() - 0.5) * 0.25);
    kebab.castShadow = true;
    kebab.scale.setScalar(0.001);
    props.add(kebab);
    pieces.push(kebab);
  }

  /* fried onion — curved slivers, not beads */
  const onionGeo = new THREE.TorusGeometry(0.058, 0.0105, 4, 10, Math.PI * 0.9);
  onionGeo.scale(1, 1, 0.34); // flattened, because fried onion is a shaving
  const onion = scatter(
    many(top.onion),
    onionGeo,
    [0xb0682a, 0x8d4c18, 0xc4813c],
    moundR, moundH, floor, 0.035, true
  );

  /* mint — flat leaves */
  const mintGeo = new THREE.SphereGeometry(0.05, 7, 5);
  mintGeo.scale(1, 0.13, 0.62);
  const mint = scatter(many(top.mint), mintGeo, [0x3f7f2c, 0x51923a], moundR, moundH, floor, 0.045, true);

  /* pistachio and almond, for the kheer */
  const nuts = scatter(
    many(top.nuts),
    new THREE.SphereGeometry(0.022, 7, 5),
    [0x7fae3f, 0xe8d9a8, 0xc9455a],
    moundR, moundH, floor, 0.03
  );

  [onion, mint, nuts].forEach((s) => s && scene.add(s.mesh));

  /* ─────────────────────────────────────────────────────── steam */

  const STEAM = small ? 10 : 22;
  const steam = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.6, 0.6),
    new THREE.MeshBasicMaterial({
      map: puffTexture(),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
    STEAM
  );
  steam.frustumCulled = false;
  scene.add(steam);

  const puffs = Array.from({ length: STEAM }, () => ({
    a: Math.random() * TAU,
    r: Math.random() * 0.45,
    t: Math.random(),
    speed: 0.16 + Math.random() * 0.22,
    scale: 0.7 + Math.random() * 0.9,
  }));

  /* ─────────────────────────────────────────────────────── light */

  scene.add(new THREE.HemisphereLight(0xfff1d8, 0x3a2a18, 0.85));

  const key = new THREE.DirectionalLight(0xfff0cf, 3.2);
  key.position.set(2.6, 4.2, 3.4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 14;
  key.shadow.camera.left = -3;
  key.shadow.camera.right = 3;
  key.shadow.camera.top = 3;
  key.shadow.camera.bottom = -3;
  key.shadow.bias = -0.0008;
  scene.add(key);

  const warm = new THREE.PointLight(0xffb45c, 22, 9, 2);
  warm.position.set(-2.1, 1.5, 1.6);
  scene.add(warm);

  const rim = new THREE.DirectionalLight(0xffd9a0, 1.2);
  rim.position.set(-3, 1.4, -3);
  scene.add(rim);

  /* ────────────────────────────────────────────────────── sizing */

  function resize() {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(el);

  /* ─────────────────────────────────────────────────────── stage */

  let stage = 0;
  let want = 0;
  let painted = -1;

  function setStage(s) {
    want = clamp(s, 0, CAM.length - 1);
  }

  function applyStage() {
    stage = want;
    // 5200 colour lerps plus a buffer upload; the tint shifts slowly enough
    // that doing it every 0.05 of a stage is indistinguishable
    if (Math.abs(stage - painted) < 0.05) return;
    // and outside the window where the colour actually moves, never
    if (stage < 1.6 && painted < 1.6) return;
    if (stage > 3.05 && painted > 3.05) return;
    painted = stage;

    // colour arrives late: rice does not take the curry until it is layered
    const t = smoothstep(1.7, 3, stage);
    for (let i = 0; i < COUNT; i++) {
      tint.lerpColors(raw, tints[grains[i].shade], t);
      rice.setColorAt(i, tint);
    }
    rice.instanceColor.needsUpdate = true;
  }

  /* ──────────────────────────────────────────────────────── loop */

  const clock = new THREE.Clock();
  const dummy = new THREE.Object3D();
  // Y after X, so the heading turns the laid-down grain rather than rolling it
  dummy.rotation.order = 'YXZ';
  const face = new THREE.Object3D(); // steam billboards, kept separate
  let running = true;
  let pageVisible = true;
  let frame = 0;

  function step(dt, time) {
    applyStage();
    const s = stage;

    const swell = mix(1, dish.cook.grow, smoothstep(0.85, 3, s));
    const rise = smoothstep(1.3, 3, s);
    const wet = smoothstep(0.5, 1.1, s) * (1 - smoothstep(1.5, 2.1, s));
    const layered = smoothstep(1.5, 2.4, s);
    const meatIn = smoothstep(1.7, 2.5, s);
    const done = smoothstep(2.45, 3, s);

    /* the rice: swells, climbs into a mound, takes the colour */
    for (let i = 0; i < COUNT; i++) {
      const g = grains[i];
      const bob = Math.sin(time * 0.6 + g.wobble) * 0.004 * rise;

      dummy.position.set(
        mix(g.dry[0], g.done[0], rise),
        mix(g.dry[1], g.done[1], rise) + bob,
        mix(g.dry[2], g.done[2], rise)
      );
      dummy.rotation.set(g.spin[0], g.spin[1] + time * 0.02, g.spin[2]);
      // cooked rice gets longer, not thicker
      dummy.scale.set(g.jitter, g.jitter * swell, g.jitter);
      dummy.updateMatrix();
      rice.setMatrixAt(i, dummy.matrix);
    }
    rice.instanceMatrix.needsUpdate = true;

    water.material.opacity = wet * 0.72;
    water.visible = wet > 0.01;

    if (masala) {
      masala.material.opacity = layered;
      masala.visible = layered > 0.01;
    }
    if (milk) {
      milk.material.opacity = 0.35 + layered * 0.55;
      milk.visible = layered > 0.01;
    }

    /* the chicken goes in with the curry, a beat before the rice covers it */
    props.visible = meatIn > 0.02;
    if (props.visible) pieces.forEach((p) => p.scale.setScalar(meatIn * (p.userData.size || 1)));

    /* onion, mint and nuts are strewn over the finished dish */
    if (onion) onion.update(dummy, done);
    if (mint) mint.update(dummy, done);
    if (nuts) nuts.update(dummy, done);

    /* steam only once it is actually hot */
    steam.material.opacity = done * 0.42 * dish.steam;
    steam.visible = done > 0.02;
    if (steam.visible) {
      for (let i = 0; i < STEAM; i++) {
        const p = puffs[i];
        p.t = (p.t + dt * p.speed) % 1;
        const lift = p.t * 1.5;
        face.position.set(
          Math.cos(p.a) * p.r * (1 + p.t * 0.7),
          floor + moundH + 0.22 + lift,
          Math.sin(p.a) * p.r * (1 + p.t * 0.7)
        );
        face.quaternion.copy(camera.quaternion); // always face the lens
        face.scale.setScalar(p.scale * (0.5 + p.t * 1.5) * Math.sin(p.t * Math.PI));
        face.updateMatrix();
        steam.setMatrixAt(i, face.matrix);
      }
      steam.instanceMatrix.needsUpdate = true;
    }

    /* camera walks the keyframes and drifts so it never sits still */
    const i0 = Math.min(Math.floor(s), CAM.length - 1);
    const i1 = Math.min(i0 + 1, CAM.length - 1);
    const f = ease(s - i0);
    const drift = Math.sin(time * 0.18) * 0.16;

    camera.position.set(
      mix(CAM[i0].p[0], CAM[i1].p[0], f) + drift,
      mix(CAM[i0].p[1], CAM[i1].p[1], f) * vessel.view.lift,
      mix(CAM[i0].p[2], CAM[i1].p[2], f)
    );
    camera.lookAt(
      mix(CAM[i0].l[0], CAM[i1].l[0], f),
      mix(CAM[i0].l[1], CAM[i1].l[1], f) + vessel.view.look,
      mix(CAM[i0].l[2], CAM[i1].l[2], f)
    );
  }

  const render = () => renderer.render(scene, camera);

  function tick() {
    if (!running) return;
    frame = requestAnimationFrame(tick);
    if (!pageVisible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    quality(dt);
    step(dt, clock.elapsedTime);
    render();
  }

  guardContext(el, {
    onLost: () => { running = false; cancelAnimationFrame(frame); },
    onRestored: () => { if (!reduced) { running = true; tick(); } },
  });

  setStage(0);

  if (reduced) {
    step(0, 0);
    render();
    window.addEventListener('scroll', () => { step(0, 0); render(); }, { passive: true });
  } else {
    tick();
    document.addEventListener('visibilitychange', () => { pageVisible = !document.hidden; });
  }

  return {
    setStage,
    destroy() {
      running = false;
      cancelAnimationFrame(frame);
      grainGeo.dispose();
      rice.material.dispose();
      renderer.dispose();
    },
  };
}

/* ------------------------------------------------------------ pieces */

/** a drumstick: meat, bone, and the knob on the end of it */
function drumstick() {
  const g = new THREE.Group();

  const meat = new THREE.Mesh(
    new THREE.SphereGeometry(0.165, 18, 14),
    new THREE.MeshStandardMaterial({ color: 0xc27c36, roughness: 0.52, metalness: 0.03 })
  );
  meat.scale.set(1, 1.3, 0.94);
  meat.castShadow = true;
  g.add(meat);

  const boneMat = new THREE.MeshStandardMaterial({ color: 0xeee2cb, roughness: 0.62 });

  const bone = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.033, 0.25, 8), boneMat);
  bone.position.y = 0.23;
  bone.castShadow = true;
  g.add(bone);

  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.044, 10, 8), boneMat);
  knob.position.y = 0.35;
  g.add(knob);

  return g;
}

/** instanced bits strewn over the surface of the mound */
function scatter(count, geometry, palette, moundR, moundH, floor, lift, flat = false) {
  if (!count) return null;

  const colors = palette.map((hex) => new THREE.Color(hex));
  const mesh = new THREE.InstancedMesh(
    geometry,
    new THREE.MeshStandardMaterial({ roughness: 0.62 }),
    count
  );
  mesh.castShadow = true;
  mesh.frustumCulled = false;

  const bits = [];
  for (let i = 0; i < count; i++) {
    const a = Math.random() * TAU;
    const r = moundR * 0.94 * Math.sqrt(Math.random());
    const cap = moundH * (1 - (r / moundR) ** 2);
    bits.push({
      pos: [Math.cos(a) * r, floor + cap + lift * (0.4 + Math.random() * 0.8), Math.sin(a) * r],
      // flat things keep their face to the sky and only vary their heading
      rot: flat
        ? [Math.PI / 2 + (Math.random() - 0.5) * 0.55, Math.random() * TAU, (Math.random() - 0.5) * 0.4]
        : [(Math.random() - 0.5) * 1.5, Math.random() * TAU, (Math.random() - 0.5) * 1.5],
      scale: 0.65 + Math.random() * 0.7,
    });
    mesh.setColorAt(i, colors[(Math.random() * colors.length) | 0]);
  }
  mesh.instanceColor.needsUpdate = true;

  return {
    mesh,
    update(dummy, amount) {
      mesh.visible = amount > 0.02;
      if (!mesh.visible) return;
      for (let i = 0; i < count; i++) {
        const b = bits[i];
        dummy.position.set(b.pos[0], b.pos[1], b.pos[2]);
        dummy.rotation.set(b.rot[0], b.rot[1], b.rot[2]);
        dummy.scale.setScalar(b.scale * amount);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}

/* ------------------------------------------------------------ helpers */

const mix = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const ease = (t) => t * t * (3 - 2 * t);

function smoothstep(a, b, x) {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

/** weighted pick, so a mound is mostly white with saffron through it */
function pickTint(weights) {
  let r = Math.random();
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

/** Biryani is not evenly speckled: the colour goes in where it was poured, so
    neighbouring grains share a shade. Low-frequency noise gives those patches. */
function patchAt(x, z) {
  const n =
    Math.sin(x * 4.1 + 0.7) * Math.cos(z * 3.3 - 0.4) +
    Math.sin((x + z) * 2.4) * 0.65 +
    Math.cos((x - z) * 5.1) * 0.25;
  if (n > 0.55) return 2;
  if (n > -0.15) return 1;
  return 0;
}

/* a warm kitchen rather than the green of the mill */
function backdrop() {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#0d0906');
  grad.addColorStop(0.6, '#1a1109');
  grad.addColorStop(1, '#2a1b0e');
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 256);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.mapping = THREE.EquirectangularReflectionMapping;
  return tex;
}

function puffTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,0.55)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0.16)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
