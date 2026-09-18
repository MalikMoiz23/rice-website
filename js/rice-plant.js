/* ============================================================
   rice-plant.js — one stalk of paddy
   Built to match how a ripe plant actually looks: the rachis
   arcs over under the weight of the head and the grain hangs
   off it pointing down, rather than sitting on top of it.
   Stem, four blades and the panicle merge into one geometry
   with baked vertex colours, so a whole field is one draw call.
   ============================================================ */

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { riceGeometry } from './rice-geometry.js';

const STEM = new THREE.Color('#7fa24e');
const LEAF = new THREE.Color('#6b9243');
const HULL = new THREE.Color('#cdbd7c');

export function ricePlant({ height = 1.75, grains = 16 } = {}) {
  const parts = [];

  /* stem — already leaning, because the head on top of it is heavy */
  const tip = new THREE.Vector3(0.26, height, 0.07);
  const stem = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.02, height * 0.34, 0.01),
      new THREE.Vector3(0.1, height * 0.7, 0.03),
      tip,
    ]),
    9,
    0.0135,
    5,
    false
  );
  paint(stem, STEM);
  parts.push(stem);

  /* four blades, alternating sides, each drooping further than the last */
  [0.16, 0.33, 0.5, 0.67].forEach((at, i) => {
    const blade = leaf(height * (0.58 - i * 0.07));
    blade.rotateZ(i % 2 ? 0.66 : -0.68);
    blade.rotateY(i * 1.9 + 0.3);
    blade.translate(0, height * at, 0);
    paint(blade, LEAF);
    parts.push(blade);
  });

  /* panicle — the rachis arcs over and the grain hangs beneath it */
  const rachis = new THREE.CatmullRomCurve3([
    tip,
    new THREE.Vector3(0.42, height * 1.09, 0.05),
    new THREE.Vector3(0.6, height * 1.08, -0.01),
    new THREE.Vector3(0.74, height * 0.92, -0.08),
  ]);

  const spine = new THREE.TubeGeometry(rachis, 8, 0.006, 4, false);
  paint(spine, STEM);
  parts.push(spine);

  const hull = riceGeometry({ segments: 5, radial: 5, length: 0.062, radius: 0.019, husk: true });

  for (let i = 0; i < grains; i++) {
    const at = rachis.getPointAt(i / (grains - 1));
    const g = hull.clone();

    // hangs near-vertical with a little splay, nose down
    g.rotateZ((Math.random() - 0.5) * 0.85);
    g.rotateY(Math.random() * Math.PI);
    g.translate(
      at.x + (Math.random() - 0.5) * 0.07,
      at.y - 0.035 - Math.random() * 0.085,
      at.z + (Math.random() - 0.5) * 0.07
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
    const w = 0.042 * (1 - t * 0.88) * (0.35 + Math.sin(t * Math.PI) * 0.9);
    const y = t * len;
    const droop = -Math.pow(t, 2) * len * 0.55;
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
