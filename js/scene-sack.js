/* ============================================================
   scene-sack.js — the 25 / 50 kg sack you can turn around
   Rounded box, deformed to look filled, wrapped in a woven-PP
   texture with the print drawn onto a slightly curved panel.
   ============================================================ */

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const W = 1.3;
const H = 2.55;
const D = 0.85;

const HALF_W = W / 2;
const HALF_H = H / 2;
const HALF_D = D / 2;

const SIZES = {
  25: { scale: new THREE.Vector3(1, 1, 1), lot: 'SR-2609-A' },
  50: { scale: new THREE.Vector3(1.13, 1.28, 1.13), lot: 'SR-2609-B' },
};

/* how far the front face has been pushed out at a given point — the label
   panel reuses this so it sits on the surface instead of through it */
function surfaceZ(x, y) {
  const ny = y / HALF_H;
  const belly = 1 + 0.22 * (1 - ny * ny);
  const seam = 1 - 0.42 * Math.pow(Math.abs(ny), 6);
  const edge = 1 - 0.1 * Math.pow(Math.abs(x) / HALF_W, 3);
  return HALF_D * belly * seam * edge;
}

export function initSack(canvas) {
  const el = canvas || document.querySelector('[data-sack-canvas]');
  if (!el || !supportsWebGL()) return null;

  const renderer = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();

  // a neutral room gives the woven PP something to reflect
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  camera.position.set(0.85, 0.35, 5.4);

  const controls = new OrbitControls(camera, el);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.rotateSpeed = 0.75;
  controls.minPolarAngle = Math.PI * 0.22;
  controls.maxPolarAngle = Math.PI * 0.76;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.1;

  let idleTimer = 0;
  controls.addEventListener('start', () => {
    controls.autoRotate = false;
    clearTimeout(idleTimer);
  });
  controls.addEventListener('end', () => {
    idleTimer = setTimeout(() => { controls.autoRotate = true; }, 3500);
  });

  /* ---------------------------------------------------------- the bag */

  const geo = new RoundedBoxGeometry(W, H, D, 8, 0.26);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const ny = y / HALF_H;
    const belly = 1 + 0.22 * (1 - ny * ny);
    const seam = 1 - 0.42 * Math.pow(Math.abs(ny), 6);
    const crease = Math.sin(x * 7.1 + y * 4.3) * Math.cos(z * 6.2 - y * 3.1) * 0.016;

    pos.setXYZ(i, x * belly * seam + crease, y, z * belly * seam + crease);
  }
  geo.computeVertexNormals();

  const weave = fabricTexture(renderer);

  const bag = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      map: weave,
      bumpMap: weave,
      bumpScale: 0.6,
      roughness: 0.78,
      metalness: 0.05,
    })
  );
  bag.castShadow = true;
  bag.receiveShadow = true;

  const group = new THREE.Group();
  group.add(bag);
  scene.add(group);

  /* ------------------------------------------------------ the printing */

  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 620;
  labelCanvas.height = 880;

  const labelTex = new THREE.CanvasTexture(labelCanvas);
  labelTex.colorSpace = THREE.SRGBColorSpace;
  labelTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const panel = new THREE.PlaneGeometry(0.98, 1.39, 24, 24);
  const ppos = panel.attributes.position;
  for (let i = 0; i < ppos.count; i++) {
    ppos.setZ(i, surfaceZ(ppos.getX(i), ppos.getY(i)) + 0.006);
  }
  panel.computeVertexNormals();

  const label = new THREE.Mesh(
    panel,
    new THREE.MeshStandardMaterial({
      map: labelTex,
      transparent: true,
      roughness: 0.62,
      metalness: 0,
    })
  );
  label.position.y = 0;
  bag.add(label);

  // chain-stitched mouth
  const stitch = new THREE.Mesh(
    new THREE.BoxGeometry(W * 0.55, 0.05, D * 0.42),
    new THREE.MeshStandardMaterial({ color: 0x3b2f1d, roughness: 0.85 })
  );
  stitch.position.y = HALF_H - 0.04;
  stitch.castShadow = true;
  bag.add(stitch);

  /* ------------------------------------------------------------ stage */

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(3.2, 64),
    new THREE.ShadowMaterial({ opacity: 0.26 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -HALF_H - 0.02;
  floor.receiveShadow = true;
  scene.add(floor);

  scene.add(new THREE.HemisphereLight(0xfff6e2, 0x3a4a2c, 0.7));

  const key = new THREE.DirectionalLight(0xfff0cf, 2.6);
  key.position.set(3.2, 5.4, 4.2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 16;
  key.shadow.camera.left = -3;
  key.shadow.camera.right = 3;
  key.shadow.camera.top = 3;
  key.shadow.camera.bottom = -3;
  key.shadow.bias = -0.0008;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x9ed076, 0.9);
  rim.position.set(-4.5, 1.2, -3.5);
  scene.add(rim);

  /* ------------------------------------------------------------ sizing */

  function resize() {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(el);

  /* ------------------------------------------------------------- state */

  let weight = 25;
  let tween = null;

  function setWeight(kg) {
    const next = SIZES[kg];
    if (!next || kg === weight) return;
    weight = kg;

    drawLabel(labelCanvas, kg, next.lot);
    labelTex.needsUpdate = true;

    const from = group.scale.clone();
    const to = next.scale;
    const started = performance.now();
    cancelAnimationFrame(tween);

    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const run = (now) => {
      const t = Math.min((now - started) / 620, 1);
      group.scale.lerpVectors(from, to, ease(t));
      floor.position.y = -HALF_H * group.scale.y - 0.02;
      if (t < 1) tween = requestAnimationFrame(run);
    };
    tween = requestAnimationFrame(run);
  }

  // the display font may still be loading when the texture is first drawn
  drawLabel(labelCanvas, 25, SIZES[25].lot);
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      drawLabel(labelCanvas, weight, SIZES[weight].lot);
      labelTex.needsUpdate = true;
    });
  }

  /* -------------------------------------------------------------- loop */

  let running = true;
  let visible = true;
  let frame = 0;

  const tick = () => {
    if (!running) return;
    frame = requestAnimationFrame(tick);
    if (!visible) return;
    controls.update();
    renderer.render(scene, camera);
  };
  tick();

  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 }).observe(el);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

  return {
    setWeight,
    destroy() {
      running = false;
      cancelAnimationFrame(frame);
      controls.dispose();
      geo.dispose();
      panel.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}

/* ------------------------------------------------------------ textures */

function fabricTexture(renderer) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');

  g.fillStyle = '#e7dabb';
  g.fillRect(0, 0, 256, 256);

  // laminated PP reads as a tight basket weave up close
  const step = 6;
  for (let i = 0; i < 256; i += step) {
    g.fillStyle = i % (step * 2) === 0 ? 'rgba(255,255,255,0.35)' : 'rgba(120,98,58,0.16)';
    g.fillRect(i, 0, step / 2, 256);
    g.fillStyle = i % (step * 2) === 0 ? 'rgba(120,98,58,0.14)' : 'rgba(255,255,255,0.3)';
    g.fillRect(0, i, 256, step / 2);
  }

  // a bit of fibre noise so it is not perfectly regular
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = `rgba(90,72,40,${Math.random() * 0.06})`;
    g.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 4);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

function drawLabel(c, kg, lot) {
  const g = c.getContext('2d');
  const w = c.width;
  const h = c.height;

  g.clearRect(0, 0, w, h);

  // printed panel
  roundRect(g, 26, 26, w - 52, h - 52, 26);
  g.fillStyle = '#f7f0de';
  g.fill();

  // masthead
  g.save();
  g.beginPath();
  roundRect(g, 26, 26, w - 52, 188, 26);
  g.clip();
  g.fillStyle = '#22381f';
  g.fillRect(26, 26, w - 52, 188);
  g.restore();

  g.textAlign = 'center';

  g.fillStyle = '#f7f0de';
  g.font = '600 74px Fraunces, Georgia, serif';
  g.fillText('SUNEHRI', w / 2, 128);

  g.fillStyle = '#d9ae44';
  g.font = '600 24px Inter, Arial, sans-serif';
  tracked(g, 'RICE MILLS · SHEIKHUPURA', w / 2, 174, 7);

  // grade
  g.fillStyle = '#22381f';
  g.font = '600 62px Fraunces, Georgia, serif';
  g.fillText('SUPER', w / 2, 330);
  g.fillText('BASMATI', w / 2, 398);

  g.fillStyle = '#7a6238';
  g.font = '400 24px Inter, Arial, sans-serif';
  tracked(g, 'AGED 12 MONTHS · SORTEX CLEANED', w / 2, 450, 3);

  grains(g, w / 2, 540);

  // net weight block
  roundRect(g, 120, 610, w - 240, 116, 16);
  g.fillStyle = '#d9ae44';
  g.fill();

  g.fillStyle = '#201806';
  g.font = '600 26px Inter, Arial, sans-serif';
  tracked(g, 'NET WEIGHT', w / 2, 650, 6);
  g.font = '600 60px Fraunces, Georgia, serif';
  g.fillText(`${kg} kg`, w / 2, 708);

  // batch line
  g.fillStyle = '#87764f';
  g.font = '400 22px Inter, Arial, sans-serif';
  g.fillText(`LOT ${lot}  ·  MILLED 09 / 26`, w / 2, 780);
  tracked(g, 'PRODUCT OF PAKISTAN', w / 2, 820, 5);
}

/* three little grains under the grade name */
function grains(g, cx, cy) {
  const offsets = [-46, 0, 46];
  offsets.forEach((dx, i) => {
    g.save();
    g.translate(cx + dx, cy);
    g.rotate((i - 1) * 0.35 - 0.15);
    g.beginPath();
    g.ellipse(0, 0, 11, 34, 0, 0, Math.PI * 2);
    g.fillStyle = '#e4d2a4';
    g.fill();
    g.strokeStyle = '#c2912a';
    g.lineWidth = 2.5;
    g.stroke();
    g.restore();
  });
}

function tracked(g, text, cx, y, spacing) {
  const chars = [...text];
  const width = chars.reduce((sum, ch) => sum + g.measureText(ch).width + spacing, -spacing);
  let x = cx - width / 2;
  g.textAlign = 'left';
  chars.forEach((ch) => {
    g.fillText(ch, x, y);
    x += g.measureText(ch).width + spacing;
  });
  g.textAlign = 'center';
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}
