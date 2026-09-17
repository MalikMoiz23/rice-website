/* ============================================================
   rice-geometry.js — the grain itself
   A revolved profile rather than a squashed sphere. Rice is
   blunt at the base and tapers to a point, and the bulge sits
   past the middle — that asymmetry is what stops it reading as
   a pill or a grain of wheat.
   ============================================================ */

import * as THREE from 'three';

/**
 * @param {object}  o
 * @param {number}  o.segments  steps along the length
 * @param {number}  o.radial    steps around
 * @param {number}  o.length    half-length in world units
 * @param {number}  o.radius    maximum half-width
 * @param {boolean} o.husk      paddy still in the hull: fatter, ridged
 */
export function riceGeometry({
  segments = 14,
  radial = 10,
  length = 0.5,
  radius = 0.145,
  husk = false,
} = {}) {
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = t * 2 - 1;

    // (1 - y²)^n gives the spindle; the linear term skews the bulge
    let r = Math.pow(Math.max(0, 1 - y * y), husk ? 0.36 : 0.44) * (1 + 0.16 * y) * radius;

    // the hull is ribbed along its length and a touch broader
    if (husk) r *= 1.14 + Math.sin(t * Math.PI * 8) * 0.045;

    points.push(new THREE.Vector2(Math.max(r, 0.0008), y * length));
  }

  const geo = new THREE.LatheGeometry(points, radial);
  geo.computeVertexNormals();
  return geo;
}
