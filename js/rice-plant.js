/* ============================================================
   rice-plant.js — one stalk of paddy
   Stem, two leaves and a drooping panicle of grain still in the
   hull, merged into a single geometry with baked vertex colours
   so the whole field can go out as one instanced draw call.
   ============================================================ */

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { riceGeometry } from './rice-geometry.js';

const STEM = new THREE.Color('#86a758');
const LEAF = new THREE.Color('#72964c');
const HULL = new THREE.Color('#d5b158');

export function ricePlant({ height = 1.7, grains = 10 } = {}) {
  const parts = [];

  /* stem — leans over, because a ripe head is heavy */
  const tip = new THREE.Vector3(0.22, height, 0.06);
  const stem = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.02, height * 0.36, 0.01),
      new THREE.Vector3(0.09, height * 0.72, 0.03),
      tip,
    ]),
    8,
    0.012,
    5,
    false
  );
  paint(stem, STEM);
  parts.push(stem);

  /* two blades off the stem, drooping away from each other */
  [0.3, 0.55].forEach((at, i) => {
    const blade = leaf(height * 0.52);
    blade.rotateZ(i ? 0.6 : -0.62);
    blade.rotateY(i ? 2.5 : 0.4);
    blade.translate(0, height * at, 0);
    paint(blade, LEAF);
    parts.push(blade);
  });

  /* panicle — the head bends over and the grain hangs off it */
  const head = new THREE.CatmullRomCurve3([
    tip,
    new THREE.Vector3(0.31, height * 1.11, 0.04),
    new THREE.Vector3(0.44, height * 1.13, -0.02),
    new THREE.Vector3(0.53, height * 1.0, -0.07),
  ]);

  const hull = riceGeometry({ segments: 6, radial: 5, length: 0.055, radius: 0.018, husk: true });

  for (let i = 0; i < grains; i++) {
    const at = head.getPointAt(i / (grains - 1));
    const g = hull.clone();
    g.rotateZ((Math.random() - 0.5) * 1.7);
    g.rotateX((Math.random() - 0.5) * 1.7);
    g.translate(
      at.x + (Math.random() - 0.5) * 0.06,
      at.y - 0.02 - Math.random() * 0.06,
      at.z + (Math.random() - 0.5) * 0.06
    );
    paint(g, HULL);
    parts.push(g);
  }
  hull.dispose();

  const merged = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  return merged;
}

/* a tapered ribbon that curls over as it gets longer */
function leaf(len) {
  const steps = 6;
  const position = [];
  const uv = [];
  const index = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const w = 0.04 * (1 - t * 0.85) * (0.35 + Math.sin(t * Math.PI) * 0.9);
    const y = t * len;
    const droop = -Math.pow(t, 2) * len * 0.5;
    position.push(-w, y + droop, 0, w, y + droop, 0);
    uv.push(0, t, 1, t);
  }

  for (let i = 0; i < steps; i++) {
    const a = i * 2;
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(index);
  geo.computeVertexNormals();
  return geo;
}

/* mergeGeometries needs matching attributes, so every part gets a colour */
function paint(geo, color) {
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    arr[i * 3] = color.r;
    arr[i * 3 + 1] = color.g;
    arr[i * 3 + 2] = color.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
}
