/* ============================================================
   open-sack.js — the jute sack the finished rice pours into
   Not the stitched PP sack from the product viewer: this is the
   open mill sack with the mouth rolled back and a heap of milled
   grain standing proud of it, which is what the filling step
   actually looks like.
   ============================================================ */

import * as THREE from 'three';
import { riceGeometry } from './rice-geometry.js';

const MOUTH_Y = 1.18;

/* profile of the bag, bottom to mouth — flat foot, heavy belly, slight waist */
const PROFILE = [
  [0.0, 0.0],
  [0.64, 0.0],
  [0.71, 0.12],
  [0.745, 0.42],
  [0.75, 0.7],
  [0.725, 0.96],
  [0.69, MOUTH_Y],
];

export function openSack(renderer, { heapGrains = 520, grainColor = 0xfbf8f0 } = {}) {
  const group = new THREE.Group();
  const jute = burlapTexture(renderer);

  /* ------------------------------------------------------------ the bag */

  // a lathe alone is too perfect a circle to read as cloth, so the
  // silhouette gets folds pushed into it around the axis
  const bodyGeo = new THREE.LatheGeometry(
    PROFILE.map(([r, y]) => new THREE.Vector2(r, y)),
    56
  );
  const bp = bodyGeo.attributes.position;
  for (let i = 0; i < bp.count; i++) {
    const x = bp.getX(i);
    const y = bp.getY(i);
    const z = bp.getZ(i);
    if (Math.hypot(x, z) < 1e-5) continue;
    const th = Math.atan2(z, x);
    const fold =
      1 +
      0.032 * Math.sin(th * 3 + 0.6) +
      0.026 * Math.sin(th * 7 - y * 1.6) +
      0.018 * Math.sin(th * 13 + y * 2.9);
    bp.setXYZ(i, x * fold, y, z * fold);
  }
  bodyGeo.computeVertexNormals();

  const body = new THREE.Mesh(
    bodyGeo,
    new THREE.MeshStandardMaterial({
      map: jute,
      bumpMap: jute,
      bumpScale: 0.42,
      color: 0xcdbb98,
      roughness: 0.94,
      metalness: 0,
      side: THREE.DoubleSide,
    })
  );
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // the mouth folded back on itself
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.685, 0.082, 10, 40),
    new THREE.MeshStandardMaterial({
      map: jute,
      bumpMap: jute,
      bumpScale: 0.4,
      color: 0xc0ad88,
      roughness: 0.95,
      metalness: 0,
    })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = MOUTH_Y;
  rim.scale.set(1.03, 0.97, 1); // the roll is never even
  rim.castShadow = true;
  group.add(rim);

  /* ------------------------------------------------- the heap of rice */

  const heap = new THREE.Group();
  heap.position.y = MOUTH_Y - 0.16;
  group.add(heap);

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.64, 40, 20),
    new THREE.MeshStandardMaterial({ color: grainColor, roughness: 0.66, metalness: 0 })
  );
  dome.scale.y = 0.6;
  dome.castShadow = true;
  heap.add(dome);

  // loose grain over the dome, so the pile has a surface and not a skin
  const grainGeo = riceGeometry({ segments: 8, radial: 6, length: 0.042, radius: 0.013 });
  const loose = new THREE.InstancedMesh(
    grainGeo,
    new THREE.MeshStandardMaterial({ color: grainColor, roughness: 0.34, metalness: 0.02 }),
    heapGrains
  );
  loose.castShadow = true;

  const dummy = new THREE.Object3D();
  for (let i = 0; i < heapGrains; i++) {
    // cosine-weighted over the upper cap so the crown is not bald
    const u = Math.random();
    const phi = Math.acos(1 - u * 0.92);
    const theta = Math.random() * Math.PI * 2;
    const r = 0.635;

    dummy.position.set(
      Math.sin(phi) * Math.cos(theta) * r,
      Math.cos(phi) * r * 0.6,
      Math.sin(phi) * Math.sin(theta) * r
    );
    dummy.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    dummy.scale.setScalar(0.85 + Math.random() * 0.5);
    dummy.updateMatrix();
    loose.setMatrixAt(i, dummy.matrix);
  }
  heap.add(loose);

  /* ------------------------------------------------------------- state */

  /** 0 = empty sack, 1 = heaped over the mouth */
  function setFill(v) {
    const f = Math.min(Math.max(v, 0), 1);
    heap.scale.set(0.82 + f * 0.18, 0.18 + f * 0.82, 0.82 + f * 0.18);
    heap.position.y = MOUTH_Y - 0.3 + f * 0.14;
    heap.visible = f > 0.02;
  }
  setFill(0);

  /** what is in the sack changes with the grade on show */
  function setGrainColor(hex) {
    dome.material.color.setHex(hex);
    dome.material.color.multiplyScalar(0.94); // the bulk reads darker than a loose grain
    loose.material.color.setHex(hex);
  }

  return {
    group,
    mouthY: MOUTH_Y,
    setFill,
    setGrainColor,
    dispose() {
      bodyGeo.dispose();
      body.material.dispose();
      rim.geometry.dispose();
      rim.material.dispose();
      dome.geometry.dispose();
      dome.material.dispose();
      grainGeo.dispose();
      loose.material.dispose();
      jute.dispose();
    },
  };
}

/* ------------------------------------------------------------- texture */

function burlapTexture(renderer) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');

  g.fillStyle = '#c4b394';
  g.fillRect(0, 0, 256, 256);

  // jute is a coarse, uneven basket weave — much bigger thread than PP
  const step = 7;
  for (let i = 0; i < 256; i += step) {
    const jitter = (Math.random() - 0.5) * 1.4;
    g.fillStyle = 'rgba(255,244,222,0.15)';
    g.fillRect(i + jitter, 0, step * 0.45, 256);
    g.fillStyle = 'rgba(96,74,42,0.12)';
    g.fillRect(i + jitter + step * 0.45, 0, step * 0.2, 256);

    g.fillStyle = 'rgba(255,244,222,0.13)';
    g.fillRect(0, i - jitter, 256, step * 0.45);
    g.fillStyle = 'rgba(96,74,42,0.1)';
    g.fillRect(0, i - jitter + step * 0.45, 256, step * 0.2);
  }

  // stray fibres
  for (let i = 0; i < 4200; i++) {
    g.fillStyle = `rgba(${90 + Math.random() * 90 | 0},${66 + Math.random() * 70 | 0},34,${Math.random() * 0.12})`;
    g.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 2, 1);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3.4, 2.8);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}
