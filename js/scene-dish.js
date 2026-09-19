/* ============================================================
   scene-dish.js — the dish being cooked, step by scrolled step

   This is a director, not an animation. dishes.js holds six stage
   directions per dish — which vessel, whether the burner is lit,
   how much water, how heaped and how cooked the rice is, what has
   gone on top — and everything here interpolates between the two
   the scroll currently sits between. Nothing is keyframed by hand.

   For biryani that is the six panels of the reference: wash it
   under the tap in a colander, boil it in a degchi over a flame,
   simmer the chicken salan in a karahi, layer the rice over it,
   seal the lid with dough for the dum, serve it on the plate.

   Three things are worked out rather than picked to look nice:

   - every grain is the real grade. Raw length and width come from
     grades.js and `swell` scales each grain toward that grade's
     actual cooked elongation, so biryani reads long and loose
     because Super Basmati really does grow 2.1 times.

   - a vessel is not a cylinder. Rice, curry and water are seated
     at a height and then made exactly as wide as kitchen.js says
     that vessel is at that height. Guessing a width instead is
     what used to put a disc of salan straight through the side
     of the karahi.

   - the camera is not placed by hand either. It is worked back
     from how wide the vessel is and how deep you have to look to
     see its floor, which is why a shallow plate is seen almost
     side-on and a degchi is looked down into. The one exception
     is a lit burner: the shot flattens out then, because from
     any steeper angle the pot hides its own flame.
   ============================================================ */

import * as THREE from 'three';
import { riceGeometry } from './rice-geometry.js';
import { GRADES } from './grades.js';
import { DISHES } from './dishes.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { VESSELS, stove, flames, bubbles, tap, lid, STOVE_H } from './kitchen.js';
import { supportsWebGL, guardContext, makeQualityGuard } from './webgl.js';

const TAU = Math.PI * 2;

export function initDish(riceIndex, canvas) {
  const el = canvas || document.querySelector('[data-dish-canvas]');
  if (!el || !supportsWebGL()) return null;

  const dish = DISHES[riceIndex];
  const grade = GRADES[riceIndex];
  if (!dish || !grade) return null;

  const script = dish.script;
  const LAST = script.length - 1;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.innerWidth < 760;
  const COUNT = small ? 2200 : 5200;
  const topSpec = dish.top || {};
  const many = (n) => (small ? Math.round((n || 0) * 0.5) : n || 0);

  const renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.34;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const quality = makeQualityGuard(renderer);

  const scene = new THREE.Scene();
  scene.background = backdrop();

  /* Steel and aluminium are mirrors: with nothing but a dark gradient to
     reflect, every pot came out the colour of the table. This gives them a
     room to pick up, kept well under 1 so the kitchen stays warm. */
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;
  scene.environmentIntensity = 0.5;
  pmrem.dispose();

  scene.fog = new THREE.FogExp2(0x1a1209, 0.028);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 60);

  /* ───────────────────────────────────────── table and burner ── */

  const table = new THREE.Mesh(
    new THREE.CircleGeometry(9, 48),
    new THREE.MeshStandardMaterial({ color: 0x3a2712, roughness: 0.93 })
  );
  table.rotation.x = -Math.PI / 2;
  table.position.y = -0.002;
  table.receiveShadow = true;
  scene.add(table);

  const burner = stove();
  scene.add(burner);

  const fire = flames(small ? 12 : 18);
  scene.add(fire.mesh);

  /* everything that stands on the burner rides in here */
  const hob = new THREE.Group();
  scene.add(hob);

  /* ─────────────────────────────────────── every vessel used ── */

  const used = [...new Set(script.map((s) => s.v))];
  const vessels = {};

  used.forEach((name) => {
    const built = VESSELS[name]();
    // they cross-fade into one another at a step boundary
    built.object.traverse((o) => {
      if (!o.material) return;
      o.material = o.material.clone();
      o.material.transparent = true;
    });
    vessels[name] = built;
    hob.add(built.object);
  });

  /* ─────────────────────────────────── the lid, and the tap ── */

  const wantsLid = script.some((s) => s.lid);
  const cover = wantsLid ? lid() : null;
  if (cover) {
    cover.traverse((o) => {
      if (!o.material) return;
      o.material = o.material.clone();
      o.material.transparent = true;
    });
    hob.add(cover);
  }

  const wantsTap = script.some((s) => s.pour);
  const water_in = wantsTap ? tap() : null;
  if (water_in) hob.add(water_in.object);

  /* ────────────────────────────────────── water, bubbles, curry ── */

  /* WATER_LEVEL and SAUCE_LEVEL are fractions of a vessel's load, so the
     same numbers mean "nearly brimming" in a colander and in a deg. */
  const WATER_LEVEL = 0.95;
  const SAUCE_LEVEL = 0.62;

  const waterMat = new THREE.MeshPhysicalMaterial({
    color: 0xe7f1ea,
    roughness: 0.06,
    transmission: 0.62,
    thickness: 0.45,
    transparent: true,
    opacity: 0,
  });

  const curryMat = new THREE.MeshStandardMaterial({
    color: dish.masala ?? 0x9e3a18,
    roughness: 0.42,
    metalness: 0.06,
    transparent: true,
    opacity: 0,
  });

  const milkMat = dish.cook.creamy
    ? new THREE.MeshStandardMaterial({ color: 0xfaf3e2, roughness: 0.28, transparent: true, opacity: 0 })
    : null;

  /* One body of liquid per vessel, turned on that vessel's own wall. A
     cylinder cannot do this job: in anything that narrows towards its floor
     — which is every pot here — the bottom of it comes out through the
     side, and that is exactly what used to happen. */
  const liquids = {};
  used.forEach((name) => {
    const v = vessels[name];
    liquids[name] = {
      water: fill(v, WATER_LEVEL, waterMat),
      curry: fill(v, SAUCE_LEVEL, curryMat),
      milk: milkMat ? fill(v, SAUCE_LEVEL, milkMat) : null,
    };
    Object.values(liquids[name]).forEach((m) => m && hob.add(m));
  });

  /* Layering is the one step where the salan has to be seen, and by then
     it is underneath a potful of rice. So it is also poured over the top,
     the way the reference photograph has it: a ladleful in the middle with
     the white grain still showing round the edge. */
  const poured = new THREE.Mesh(
    new THREE.SphereGeometry(1, 30, 14, 0, TAU, 0, Math.PI / 2),
    curryMat.clone()
  );
  poured.visible = false;
  hob.add(poured);

  const boil = bubbles(small ? 30 : 70);
  hob.add(boil.mesh);

  /* what is floating in the salan: chicken, tomato, whole green chilli */
  const chunkGeo = new THREE.IcosahedronGeometry(0.12, 1);
  const salan = dish.masala
    ? scatter(many(22), chunkGeo, [0xd08a3c, 0xbb3a1c, 0x336f24, 0xc2701f], 0.02, false)
    : null;
  if (salan) hob.add(salan.mesh);

  /* ───────────────────────────────────────────────── the rice ── */

  /* A cooked grain is about 15 mm against a platter around 350 mm across. The
     vessels here are roughly 3 units wide, so a finished grain wants to be
     about 0.15 long — and it has to be that AFTER the elongation, which is why
     the raw size is divided by it. */
  const halfRaw = 0.15 / 2 / dish.cook.grow;

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
  hob.add(rice);

  const rawColor = new THREE.Color(grade.grain.color);
  const tints = dish.cook.tint.map((hex) => new THREE.Color(hex));
  const tint = new THREE.Color();
  const grains = new Array(COUNT);

  /* Stored as fractions of whatever vessel is on screen, so the same grain
     works in a colander, a degchi and a plate without being rebuilt. */
  for (let i = 0; i < COUNT; i++) {
    const u = Math.random() * TAU;
    const v = Math.sqrt(Math.random());
    grains[i] = {
      u, v,
      h: Math.random(),
      // tipped flat, then given a heading — a bed of rice lies down
      spin: [Math.PI / 2 + (Math.random() - 0.5) * 0.75, Math.random() * TAU, (Math.random() - 0.5) * 0.5],
      wobble: Math.random() * TAU,
      shade: dish.cook.patchy ? patchAt(Math.cos(u) * v, Math.sin(u) * v) : pickTint(dish.cook.mix),
      jitter: 0.9 + Math.random() * 0.25,
    };
    rice.setColorAt(i, rawColor);
  }
  rice.instanceColor.needsUpdate = true;

  /* ──────────────────────────── chicken, kebab, onion, mint ── */

  const props = new THREE.Group();
  hob.add(props);
  const meat = [];

  const chickenCount = many(topSpec.chicken);
  for (let i = 0; i < chickenCount; i++) {
    const stick = drumstick();
    stick.userData.a = (i / chickenCount) * TAU + 0.6;
    stick.userData.r = 0.5;
    stick.userData.size = 1.05;
    stick.scale.setScalar(0.001);
    props.add(stick);
    meat.push(stick);
  }

  const kebabCount = many(topSpec.kebab);
  for (let i = 0; i < kebabCount; i++) {
    const kebab = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.185, 0.06, 20),
      new THREE.MeshStandardMaterial({ color: 0x7a4a24, roughness: 0.78 })
    );
    kebab.userData.a = -2.5 + i * 1.25; // clear of the chicken, which sits at 0.6
    kebab.userData.r = 0.56;
    kebab.userData.size = 1;
    kebab.castShadow = true;
    kebab.scale.setScalar(0.001);
    props.add(kebab);
    meat.push(kebab);
  }

  /* fried onion is a shaving, so it is a flattened curved sliver lying face up */
  const onionGeo = new THREE.TorusGeometry(0.062, 0.012, 4, 10, Math.PI * 0.9);
  onionGeo.scale(1, 1, 0.34);
  const onion = scatter(many(topSpec.onion), onionGeo, [0x8f4a12, 0x6d3409, 0xa95f1d], 0.035, true);

  const mintGeo = new THREE.SphereGeometry(0.05, 7, 5);
  mintGeo.scale(1, 0.13, 0.62);
  const mint = scatter(many(topSpec.mint), mintGeo, [0x3f7f2c, 0x51923a], 0.045, true);

  const nuts = scatter(
    many(topSpec.nuts),
    new THREE.SphereGeometry(0.022, 7, 5),
    [0x7fae3f, 0xe8d9a8, 0xc9455a],
    0.03, false
  );

  [onion, mint, nuts].forEach((s) => s && hob.add(s.mesh));

  /* ─────────────────────────────────────────────────── steam ── */

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
  hob.add(steam);

  const puffs = Array.from({ length: STEAM }, () => ({
    a: Math.random() * TAU,
    r: Math.random() * 0.5,
    t: Math.random(),
    speed: 0.16 + Math.random() * 0.22,
    scale: 0.7 + Math.random() * 0.9,
  }));

  /* ─────────────────────────────────────────────────── light ── */

  scene.add(new THREE.HemisphereLight(0xfff1d8, 0x4a3520, 1.15));

  const key = new THREE.DirectionalLight(0xfff0cf, 4.2);
  key.position.set(2.6, 5.2, 3.4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 18;
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  key.shadow.bias = -0.0008;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xffd9a0, 1.7);
  rim.position.set(-3.4, 2.1, -3);
  scene.add(rim);

  /* the burner throws its own light, and only while it is lit */
  const fireLight = new THREE.PointLight(0xff8a2a, 0, 5, 2);
  fireLight.position.set(0, 0.25, 0);
  scene.add(fireLight);

  const warm = new THREE.PointLight(0xffb45c, 26, 11, 2);
  warm.position.set(-2.4, 2, 2);
  scene.add(warm);

  /* ────────────────────────────────────────────────── sizing ── */

  function resize() {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(el);

  /* ─────────────────────────────────────────────────── stage ── */

  let stage = 0;
  let want = 0;
  let painted = -1;

  const setStage = (s) => { want = clamp(s, 0, LAST); };

  function repaintRice(amount) {
    if (Math.abs(amount - painted) < 0.05) return;
    painted = amount;
    for (let i = 0; i < COUNT; i++) {
      tint.lerpColors(rawColor, tints[grains[i].shade], amount);
      rice.setColorAt(i, tint);
    }
    rice.instanceColor.needsUpdate = true;
  }

  /** the height a fraction of a vessel's load sits at, and how wide it is there */
  function level(v, fraction) {
    const y = v.base + (v.fill - v.base) * fraction;
    return { y, r: v.radiusAt(y) };
  }

  /* ──────────────────────────────────────────────────── loop ── */

  const clock = new THREE.Clock();
  const dummy = new THREE.Object3D();
  dummy.rotation.order = 'YXZ'; // Y after X turns the laid-down grain, not rolls it
  const face = new THREE.Object3D();
  let running = true;
  let pageVisible = true;
  let frame = 0;

  function step(dt, time) {
    stage = want;

    const i0 = Math.min(Math.floor(stage), LAST);
    const i1 = Math.min(i0 + 1, LAST);
    const f = ease(stage - i0);
    const A = script[i0];
    const B = script[i1];
    const va = vessels[A.v];
    const vb = vessels[B.v];

    /* the stage directions, blended */
    const heap = mix(A.heap, B.heap, f);
    const piled = mix(A.dome, B.dome, f);
    const swell = mix(A.swell, B.swell, f);
    const wet = mix(A.water, B.water, f);
    const bubbling = mix(A.boil, B.boil, f);
    const lit = mix(A.fire, B.fire, f);
    const onHob = mix(A.stove, B.stove, f);
    const sauce = mix(A.curry, B.curry, f);
    const riceOn = mix(A.rice, B.rice, f);
    const colour = mix(A.tint, B.tint, f);
    const topping = mix(A.top, B.top, f);
    const tapOn = mix(A.pour, B.pour, f);
    const sealed = mix(A.lid, B.lid, f);

    /* Every surface is measured inside each vessel and only then blended, so
       nothing is ever wider than whichever one is actually on screen. */
    const la = level(va, heap);
    const lb = level(vb, heap);
    const floorY = mix(la.y, lb.y, f);
    /* A grain is placed by its centre and is about 0.15 long, so a bed that
       reaches the wall has half a grain sticking through it. The inset is
       that half grain. */
    const R = Math.max(mix(la.r, lb.r, f) * 0.93 - 0.075, 0.12);

    const sa = level(va, SAUCE_LEVEL);
    const sb = level(vb, SAUCE_LEVEL);
    const sauceY = mix(sa.y, sb.y, f);
    const sauceR = mix(sa.r, sb.r, f) * 0.92;

    const wa = level(va, WATER_LEVEL);
    const wb = level(vb, WATER_LEVEL);
    const brim = mix(wa.y, wb.y, f);
    const brimR = mix(wa.r, wb.r, f) * 0.97;

    const floor = mix(va.base, vb.base, f);
    const rimY = mix(va.rim, vb.rim, f);
    const rimR = mix(va.radiusAt(va.rim), vb.radiusAt(vb.rim), f);
    const outer = mix(va.outer, vb.outer, f);

    const lift = onHob * STOVE_H;
    hob.position.y = lift;

    burner.visible = onHob > 0.02;
    fire.update(camera, time, lit);
    fireLight.intensity = lit * 11;

    /* vessels cross-fade where the script swaps them, and what is inside
       each one fades with it rather than on its own */
    used.forEach((name) => {
      let w = 0;
      if (A.v === name) w += 1 - f;
      if (B.v === name) w += f;
      w = Math.min(1, w);

      const v = vessels[name];
      v.object.visible = w > 0.01;
      if (v.object.visible) setOpacity(v.object, w);

      const held = liquids[name];
      show(held.water, w * wet * 0.82);
      show(held.curry, w * sauce);
      // milk from the moment it goes on the heat, and it stays milk after
      show(held.milk, w * Math.max(onHob, colour) * 0.9);
    });

    const domeH = dish.cook.mound.h * heap * piled;

    /* rice */
    repaintRice(colour);
    rice.visible = riceOn > 0.02;
    if (rice.visible) {
      for (let i = 0; i < COUNT; i++) {
        const g = grains[i];
        const dome = domeH * (1 - g.v * g.v);
        const bob = Math.sin(time * 0.6 + g.wobble) * 0.004 * heap;

        dummy.position.set(
          Math.cos(g.u) * g.v * R,
          floorY + dome * (0.18 + 0.82 * g.h) + bob,
          Math.sin(g.u) * g.v * R
        );
        dummy.rotation.set(g.spin[0], g.spin[1] + time * 0.02, g.spin[2]);
        // cooked rice gets longer, not thicker
        const grow = mix(1, dish.cook.grow, swell);
        dummy.scale.set(g.jitter * riceOn, g.jitter * grow * riceOn, g.jitter * riceOn);
        dummy.updateMatrix();
        rice.setMatrixAt(i, dummy.matrix);
      }
      rice.instanceMatrix.needsUpdate = true;
    }

    /* the bubbles coming up through the water, and the tap going into it */
    boil.update(dt, floor + 0.03, brim, brimR * 0.86, bubbling);
    if (water_in) water_in.update(time, brim, tapOn);

    /* the ladleful over the rice, and what is floating in it */
    const overRice = sauce * riceOn * smoothstep(0.35, 0.75, heap);
    poured.visible = overRice > 0.02;
    if (poured.visible) {
      const pr = R * 0.38;
      poured.material.opacity = overRice;
      poured.position.set(-R * 0.06, floorY + domeH * 0.82, R * 0.04);
      poured.scale.set(pr, domeH * 0.22 + 0.03, pr * 0.86);
    }

    if (salan) {
      salan.update(
        dummy,
        sauce,
        mix(sauceR * 0.78, R * 0.34, riceOn),
        0.03,
        mix(sauceY + 0.03, floorY + domeH * 0.86, riceOn)
      );
    }

    /* chicken and kebab sit on whatever surface there is now */
    const seatY = mix(sauceY + 0.08, floorY, riceOn);
    props.visible = topping > 0.02 && sealed < 0.6;
    if (props.visible) {
      meat.forEach((p) => {
        const r = p.userData.r * R;
        const dome = domeH * (1 - (r / Math.max(R, 0.001)) ** 2);
        p.position.set(Math.cos(p.userData.a) * r, seatY + dome + 0.015, Math.sin(p.userData.a) * r);
        // laid along the surface, not stood up on the bone
        p.rotation.set(-1.5, p.userData.a + 1.1, 0);
        p.scale.setScalar(topping * p.userData.size);
      });
    }

    /* onion, mint and nuts only once the dish has taken its colour */
    const garnish = topping * smoothstep(0.25, 0.8, colour) * (1 - sealed);
    if (onion) onion.update(dummy, garnish, R, domeH, floorY);
    if (mint) mint.update(dummy, garnish, R, domeH, floorY);
    if (nuts) nuts.update(dummy, garnish, R, domeH, floorY);

    /* the lid, sealed on with its rope of dough */
    if (cover) {
      cover.visible = sealed > 0.02;
      if (cover.visible) {
        setOpacity(cover, sealed);
        cover.position.y = rimY - 0.02;
        cover.scale.setScalar((rimR * 1.05) / 1.08);
      }
    }

    /* steam: off the boil, off the salan, out of a sealed lid, off the plate */
    const hot = clamp(Math.max(bubbling, garnish, sauce * 0.85, sealed), 0, 1) * dish.steam;
    steam.material.opacity = hot * 0.4;
    steam.visible = hot > 0.02;
    if (steam.visible) {
      const from = sealed > 0.5 ? rimY + 0.28 : Math.max(floorY + domeH, sauceY) + 0.22;
      for (let i = 0; i < STEAM; i++) {
        const p = puffs[i];
        p.t = (p.t + dt * p.speed) % 1;
        const rise = p.t * 1.5;
        face.position.set(
          Math.cos(p.a) * p.r * R * (1 + p.t * 0.7),
          from + rise,
          Math.sin(p.a) * p.r * R * (1 + p.t * 0.7)
        );
        face.quaternion.copy(camera.quaternion); // always face the lens
        face.scale.setScalar(p.scale * (0.5 + p.t * 1.5) * Math.sin(p.t * Math.PI));
        face.updateMatrix();
        steam.setMatrixAt(i, face.matrix);
      }
      steam.instanceMatrix.needsUpdate = true;
    }

    /* ── the camera, worked back from the vessel rather than placed ── */

    // wide enough for the vessel, and for the stove once it is up on one
    const framed = Math.max(outer, onHob * 1.72);
    const dist = framed * 2.7 + 1.05;

    // steep enough to see the floor of a deep pot; a flat plate needs almost none
    let tilt = clamp(Math.atan2((rimY - floorY) * 1.2, 2 * Math.max(R, 0.4)) + 0.2, 0.28, 0.72);
    // there is nothing to look into once the lid is on, and from any angle
    // steeper than this the pot hides its own flame
    tilt = mix(tilt, 0.34, sealed);
    tilt = mix(tilt, Math.min(tilt, 0.33), lit);

    const aimY = lift + mix(floorY + domeH * 0.55, rimY * 0.55, sealed) + 0.05;
    const aimX = -0.3 * framed;              // pushed right, clear of the copy
    const drift = Math.sin(time * 0.18) * 0.12;

    camera.position.set(aimX + drift, aimY + Math.sin(tilt) * dist, Math.cos(tilt) * dist);
    camera.lookAt(aimX, aimY, 0);
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

/** a body of liquid turned on a vessel's own wall, floor up to a level */
function fill(vessel, fraction, material) {
  const top = vessel.base + (vessel.fill - vessel.base) * fraction;
  const hug = 0.97;                       // just inside the wall, never touching

  const points = [new THREE.Vector2(0, vessel.base)];
  vessel.wall.forEach(([r, y]) => {
    if (y < top) points.push(new THREE.Vector2(r * hug, y));
  });
  points.push(new THREE.Vector2(vessel.radiusAt(top) * hug, top));
  points.push(new THREE.Vector2(0, top));  // the flat surface

  const mesh = new THREE.Mesh(new THREE.LatheGeometry(points, 44), material.clone());
  mesh.visible = false;
  return mesh;
}

/** show a mesh at an opacity, or not at all */
function show(mesh, amount) {
  if (!mesh) return;
  mesh.visible = amount > 0.02;
  if (mesh.visible) mesh.material.opacity = amount;
}


/** a drumstick: the meat, the bone it is on, and the knob on the end */
function drumstick() {
  const g = new THREE.Group();

  const meat = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 18, 14),
    new THREE.MeshStandardMaterial({ color: 0xbe7430, roughness: 0.56, metalness: 0.03 })
  );
  // narrow and long, or it reads as an egg with a stick in it
  meat.scale.set(0.8, 1.5, 0.78);
  meat.position.y = -0.06;
  meat.castShadow = true;
  g.add(meat);

  const boneMat = new THREE.MeshStandardMaterial({ color: 0xeee2cb, roughness: 0.62 });

  const bone = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.042, 0.42, 8), boneMat);
  bone.position.y = 0.3;
  bone.castShadow = true;
  g.add(bone);

  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 8), boneMat);
  knob.position.y = 0.5;
  knob.scale.set(1, 0.82, 1);
  g.add(knob);

  return g;
}

/** instanced bits strewn over whatever surface there is at the time */
function scatter(count, geometry, palette, lift, flat) {
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
    bits.push({
      a: Math.random() * TAU,
      v: Math.sqrt(Math.random()) * 0.94,
      // flat things keep their face to the sky and only vary their heading
      rot: flat
        ? [Math.PI / 2 + (Math.random() - 0.5) * 0.55, Math.random() * TAU, (Math.random() - 0.5) * 0.4]
        : [(Math.random() - 0.5) * 1.5, Math.random() * TAU, (Math.random() - 0.5) * 1.5],
      scale: 0.65 + Math.random() * 0.7,
      jig: 0.4 + Math.random() * 0.8,
    });
    mesh.setColorAt(i, colors[(Math.random() * colors.length) | 0]);
  }
  mesh.instanceColor.needsUpdate = true;

  return {
    mesh,
    update(dummy, amount, R, domeH, floorY) {
      mesh.visible = amount > 0.02;
      if (!mesh.visible) return;
      for (let i = 0; i < count; i++) {
        const b = bits[i];
        const r = b.v * R;
        const dome = domeH * (1 - b.v * b.v);
        dummy.position.set(
          Math.cos(b.a) * r,
          floorY + dome + lift * b.jig,
          Math.sin(b.a) * r
        );
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

function setOpacity(object, value) {
  object.traverse((o) => {
    if (o.material) o.material.opacity = value;
  });
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
  grad.addColorStop(0, '#140e08');
  grad.addColorStop(0.6, '#26190d');
  grad.addColorStop(1, '#3d2814');
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
