/* ============================================================
   kitchen.js — the things a dish is cooked in and on

   The six panels of the reference: a colander under the tap, a
   degchi on a lit burner, a karahi of salan, the degchi again
   with the rice layered over it, the same degchi sealed with a
   rope of dough for the dum, and a patterned plate.

   A vessel is not a cylinder, and that is the whole reason this
   file exists. Every one of them is turned from a lathe profile,
   and that profile is also its measurements: ask it how wide it
   is at a given height and you get the real interior radius
   there. The director in scene-dish.js uses that to seat rice,
   curry and water at a level without any of it coming through
   the side of the pot and onto the table.

   What each vessel reports:

     base      the height of its floor
     rim       the height of its lip
     outer     its widest radius, which is what has to be framed
     wall      the profile of the inside, floor upward
     fill      the height a full load of cooked rice reaches
     radiusAt  the interior radius at any height between the two

   Nothing here knows what a dish is. It only knows shapes.
   ============================================================ */

import * as THREE from 'three';

const TAU = Math.PI * 2;

/* How high a pot stands once it is up on the burner. The gap this leaves
   between the hob and the bottom of the pot is the only place a flame can
   actually be seen from, so it is deliberately generous. */
export const STOVE_H = 0.58;

const lathe = (profile, segments = 72) =>
  new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments);

const ALU = { color: 0xb9bec4, roughness: 0.29, metalness: 0.92 };
const STEEL = { color: 0xd2d7dd, roughness: 0.15, metalness: 0.95 };
const IRON = { color: 0x46433f, roughness: 0.5, metalness: 0.72 };

/* ═════════════════════════════════════════════════ measurements ══ */

/**
 * Read a lathe profile back as an interior radius per height.
 *
 * A profile is written in drawing order and usually starts at the centre of
 * the floor, so the wall is everything from the lowest point onward. Taking
 * the radii straight off that wall is what matters for a degchi, which is
 * wider at the belly than it is at the rim: a running maximum would happily
 * report the belly width up at the lip and put rice through the neck.
 */
function measure(profile, fill) {
  let floor = 0;
  profile.forEach(([, y], i) => { if (y < profile[floor][1]) floor = i; });

  const wall = [];
  for (let i = floor; i < profile.length; i++) {
    const [r, y] = profile[i];
    if (!wall.length || y > wall[wall.length - 1][1]) wall.push([r, y]);
  }

  const radiusAt = (y) => {
    if (y <= wall[0][1]) return wall[0][0];
    for (let i = 1; i < wall.length; i++) {
      const [r0, y0] = wall[i - 1];
      const [r1, y1] = wall[i];
      if (y <= y1) return r0 + (r1 - r0) * ((y - y0) / (y1 - y0));
    }
    return wall[wall.length - 1][0];
  };

  return {
    wall,
    base: wall[0][1],
    rim: wall[wall.length - 1][1],
    outer: Math.max(...profile.map(([r]) => r)),
    fill,
    radiusAt,
  };
}

function shell(profile, material, segments) {
  const mesh = new THREE.Mesh(
    lathe(profile, segments),
    new THREE.MeshStandardMaterial({ ...material, side: THREE.DoubleSide })
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function ring(group, radius, tube, y, material) {
  const r = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 40), material);
  r.rotation.x = Math.PI / 2;
  r.position.y = y;
  r.castShadow = true;
  group.add(r);
  return r;
}

/* ══════════════════════════════════════════════════════ vessels ══ */

/** the perforated colander the rice is washed and drained in */
export function colander() {
  const profile = [[0, 0.02], [0.45, 0], [0.9, 0.16], [1.25, 0.4], [1.34, 0.5], [1.28, 0.52]];

  const g = new THREE.Group();
  const body = shell(profile, { ...STEEL, roughnessMap: perforation() });
  g.add(body);
  const mat = body.material;

  ring(g, 1.31, 0.035, 0.51, mat);         // the wire rolled into the lip
  ring(g, 0.52, 0.04, 0.005, mat);         // the foot it stands on

  // the long handle, which is how you know it is a colander and not a bowl
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.045, 0.16), mat);
  handle.position.set(1.72, 0.52, 0);
  handle.rotation.z = 0.12;
  handle.castShadow = true;
  g.add(handle);

  return { object: g, ...measure(profile, 0.26) };
}

/** the bellied aluminium degchi everything is actually cooked in */
export function degchi() {
  const profile = [
    [0, 0], [0.6, 0], [0.84, 0.1], [1.12, 0.36],
    [1.19, 0.62], [1.06, 0.86], [0.95, 0.97], [1.06, 1.01], [0.99, 1.04],
  ];

  const g = new THREE.Group();
  const body = shell(profile, ALU);
  g.add(body);
  const mat = body.material;

  // the two lugs a degchi is lifted off the fire by
  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.028, 8, 18, Math.PI), mat);
    ear.position.set(side * 1.06, 0.84, 0);
    ear.rotation.set(Math.PI / 2, 0, side > 0 ? -Math.PI / 2 : Math.PI / 2);
    ear.castShadow = true;
    g.add(ear);
  });

  return { object: g, ...measure(profile, 0.62) };
}

/** the karahi the salan is made in — wide, shallow, cast iron */
export function karahi() {
  const profile = [[0, 0], [0.42, 0.02], [0.92, 0.18], [1.26, 0.44], [1.38, 0.58], [1.32, 0.6]];

  const g = new THREE.Group();
  const body = shell(profile, IRON);
  g.add(body);
  const mat = body.material;

  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.026, 8, 18, Math.PI), mat);
    ear.position.set(side * 1.36, 0.53, 0);
    ear.rotation.set(Math.PI / 2, 0, side > 0 ? -Math.PI / 2 : Math.PI / 2);
    g.add(ear);
  });

  return { object: g, ...measure(profile, 0.3) };
}

/**
 * the lid, and the rope of dough that seals it on for the dum.
 *
 * Sealing the lid is not decoration, it is the whole mechanism of the step:
 * the steam cannot get out, so it goes up through the rice instead.
 */
export function lid() {
  const g = new THREE.Group();

  const dome = shell(
    [[0, 0.2], [0.35, 0.19], [0.72, 0.14], [0.95, 0.06], [1.04, 0.01], [1.08, 0]],
    { ...ALU, color: 0xc4c9cf }
  );
  g.add(dome);

  const knob = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 14, 10),
    new THREE.MeshStandardMaterial({ color: 0x2c2a27, roughness: 0.6 })
  );
  knob.position.y = 0.23;
  knob.castShadow = true;
  g.add(knob);

  const dough = new THREE.Mesh(
    new THREE.TorusGeometry(1.03, 0.075, 10, 44),
    new THREE.MeshStandardMaterial({ color: 0xe6d2ad, roughness: 0.92, metalness: 0 })
  );
  dough.rotation.x = Math.PI / 2;
  dough.position.y = 0.01;
  dough.castShadow = true;
  g.add(dough);

  return g;
}

/* ═══════════════════════════════════════════════════════ stove ══ */

/** a gas burner: base, burner cap, and the trivet the pot stands on */
export function stove() {
  const g = new THREE.Group();

  const enamel = new THREE.MeshStandardMaterial({ color: 0x272b32, roughness: 0.4, metalness: 0.38 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x9aa1a9, roughness: 0.28, metalness: 0.9 });

  const base = new THREE.Mesh(lathe([[0, 0], [1.5, 0], [1.55, 0.05], [1.5, 0.09]], 48), enamel);
  base.receiveShadow = true;
  g.add(base);

  // the burner head, kept low so the ring of flame above it stays in the open
  const head = new THREE.Mesh(lathe([[0, 0.1], [0.3, 0.12], [0.34, 0.18], [0.26, 0.21]], 36), steel);
  head.castShadow = true;
  g.add(head);

  ring(g, 0.3, 0.032, 0.18, steel);

  // four trivet arms, and the pot sits on top of them
  for (let i = 0; i < 4; i++) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.045, 0.07), steel);
    const a = (i / 4) * TAU + Math.PI / 4;
    arm.position.set(Math.cos(a) * 0.52, STOVE_H - 0.03, Math.sin(a) * 0.52);
    arm.rotation.y = -a;
    arm.castShadow = true;
    g.add(arm);
  }

  ring(g, 0.62, 0.028, STOVE_H - 0.03, steel);

  return g;
}

/**
 * gas flame: billboards that flicker and lick upward around the burner.
 *
 * They sit just outside the burner head rather than on top of it, because
 * the head was hiding the bottom of every jet and the pot was hiding the
 * top, which between them left nothing on screen but an orange glow.
 */
export function flames(count = 24) {
  const mesh = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.22, 0.5),
    new THREE.MeshBasicMaterial({
      map: flameTexture(),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
    count
  );
  mesh.frustumCulled = false;

  const jets = Array.from({ length: count }, (_, i) => ({
    // spread over a band rather than a perfect circle, or the ring of jets
    // lines up into a row of petals
    a: (i / count) * TAU + Math.random() * 0.2,
    r: 0.37 + Math.random() * 0.1,
    phase: Math.random() * TAU,
    speed: 5 + Math.random() * 4,
  }));

  const dummy = new THREE.Object3D();

  return {
    mesh,
    update(camera, time, amount) {
      mesh.material.opacity = amount * 0.7;
      mesh.visible = amount > 0.01;
      if (!mesh.visible) return;

      for (let i = 0; i < count; i++) {
        const j = jets[i];
        // a gas flame is never still; this is the flicker
        const flick = 0.78 + Math.sin(time * j.speed + j.phase) * 0.2 + Math.random() * 0.07;
        // anchored at the burner, so a taller flame grows upward, not out of the floor
        dummy.position.set(Math.cos(j.a) * j.r, 0.13 + 0.22 * flick, Math.sin(j.a) * j.r);
        dummy.quaternion.copy(camera.quaternion);
        dummy.scale.set(0.5 + flick * 0.28, flick, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}

/* ══════════════════════════════════════════════════════ liquids ══ */

/** bubbles climbing through boiling water */
export function bubbles(count) {
  const mesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.03, 8, 6),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.05,
      transmission: 0.85,
      thickness: 0.1,
      transparent: true,
      opacity: 0,
    })
  );
  mesh.frustumCulled = false;

  const pops = Array.from({ length: count }, () => ({
    a: Math.random() * TAU,
    r: Math.sqrt(Math.random()) * 0.92,   // a fraction of the radius, applied per frame
    t: Math.random(),
    speed: 0.5 + Math.random() * 0.9,
    scale: 0.5 + Math.random() * 1.1,
  }));

  const dummy = new THREE.Object3D();

  return {
    mesh,
    update(dt, base, top, radius, amount) {
      mesh.material.opacity = amount * 0.8;
      mesh.visible = amount > 0.02;
      if (!mesh.visible) return;

      for (let i = 0; i < count; i++) {
        const p = pops[i];
        p.t = (p.t + dt * p.speed) % 1;
        const rr = p.r * radius;
        dummy.position.set(Math.cos(p.a) * rr, base + p.t * (top - base), Math.sin(p.a) * rr);
        dummy.rotation.set(0, 0, 0);
        // they swell on the way up and burst at the surface
        dummy.scale.setScalar(p.scale * (0.35 + p.t * 0.9) * (1 - p.t * p.t));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}

/** the tap running into the colander, and the froth where it lands */
export function tap() {
  const g = new THREE.Group();

  const stream = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.115, 1, 18, 1, true),
    new THREE.MeshPhysicalMaterial({
      color: 0xdff0ff,
      roughness: 0.04,
      transmission: 0.9,
      thickness: 0.2,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    })
  );
  g.add(stream);

  const splash = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 20, 12, 0, TAU, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      color: 0xf4fbff,
      roughness: 0.22,
      transparent: true,
      opacity: 0,
    })
  );
  g.add(splash);

  return {
    object: g,
    update(time, surfaceY, amount) {
      g.visible = amount > 0.02;
      if (!g.visible) return;

      const height = 1.75;
      stream.material.opacity = amount * 0.8;
      stream.scale.set(1, height, 1);
      stream.position.y = surfaceY + height / 2;

      // the froth where it lands is never the same size twice
      const churn = 1 + Math.sin(time * 7.3) * 0.1 + Math.sin(time * 11.7) * 0.06;
      splash.material.opacity = amount * 0.75;
      splash.position.y = surfaceY;
      splash.scale.set(churn, 0.3 * churn, churn);
    },
  };
}

/* ═════════════════════════════════════════════════════ textures ══ */

function flameTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 96;
  const g = c.getContext('2d');

  // a teardrop: blue at the base, orange through the middle, gone at the tip
  const grad = g.createLinearGradient(0, 96, 0, 0);
  grad.addColorStop(0, 'rgba(80,140,255,0.5)');
  grad.addColorStop(0.22, 'rgba(255,175,70,0.55)');
  grad.addColorStop(0.6, 'rgba(255,120,30,0.26)');
  grad.addColorStop(1, 'rgba(255,90,20,0)');

  g.fillStyle = grad;
  g.beginPath();
  g.moveTo(32, 0);
  g.quadraticCurveTo(56, 58, 32, 96);
  g.quadraticCurveTo(8, 58, 32, 0);
  g.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** a grid of dots, used as roughness so a colander reads as perforated */
function perforation() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#2a2a2a';
  g.fillRect(0, 0, 64, 64);
  g.fillStyle = '#e8e8e8';
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      g.beginPath();
      g.arc(x * 8 + (y % 2 ? 6 : 2), y * 8 + 4, 2.1, 0, TAU);
      g.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(26, 9);
  return tex;
}

/** the painted rim of the plate biryani is brought to the table on */
function plateGlaze() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const g = c.getContext('2d');

  g.fillStyle = '#f6f1e6';
  g.fillRect(0, 0, 256, 64);

  /* A lathe runs its v coordinate from the centre of the profile out to the
     rim, and a canvas texture is flipped, so the rim is the top of the image.
     Everything below it is the face of the plate and stays plain. */
  g.fillStyle = '#9c3f28';
  g.fillRect(0, 0, 256, 15);
  g.fillStyle = '#e9ddc4';
  for (let i = 0; i < 32; i++) {
    g.beginPath();
    g.moveTo(i * 8 + 4, 2);
    g.lineTo(i * 8 + 7, 7.5);
    g.lineTo(i * 8 + 4, 13);
    g.lineTo(i * 8 + 1, 7.5);
    g.fill();
  }
  g.fillStyle = '#c9a98a';
  g.fillRect(0, 15, 256, 2);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ═════════════════════════════════════════════ serving vessels ══ */

/** what each dish is finally brought to the table in */
export const SERVING = {
  /* the patterned plate biryani is served on */
  platter: () => {
    const profile = [[0, 0.05], [1.3, 0], [1.5, 0.1], [1.66, 0.24], [1.74, 0.32]];
    return {
      object: shell(profile, { map: plateGlaze(), roughness: 0.24, metalness: 0.02 }),
      ...measure(profile, 0.17),
    };
  },

  /* a plain white plate, which is what pulao turns up on */
  plate: () => {
    const profile = [[0, 0.04], [1.28, 0], [1.48, 0.1], [1.64, 0.24], [1.71, 0.31]];
    return {
      object: shell(profile, { color: 0xf3efe7, roughness: 0.3, metalness: 0.02 }),
      ...measure(profile, 0.15),
    };
  },

  /* the brass deg, for when it is cooked and served out of the same pot */
  degh: () => {
    const profile = [[0, 0], [0.92, 0], [1.2, 0.26], [1.34, 0.72], [1.24, 1.0], [1.38, 1.08]];
    return {
      object: shell(profile, { color: 0xc9ac7e, roughness: 0.3, metalness: 0.75 }),
      ...measure(profile, 0.66),
    };
  },

  bowl: () => {
    const profile = [[0, 0.02], [0.52, 0], [0.84, 0.24], [0.97, 0.56], [1.03, 0.65]];
    return {
      object: shell(profile, { color: 0xeee7d8, roughness: 0.42, metalness: 0.04 }),
      ...measure(profile, 0.4),
    };
  },
};

/** every vessel the scripts can name, built on demand */
export const VESSELS = {
  colander,
  degchi,
  karahi,
  ...SERVING,
};
