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
 * @param {number}  o.phiStart  where the revolve starts, for half shells
 * @param {number}  o.phiLength how far it revolves
 * @param {number}  o.ridges     lengthwise ribs around the hull, 0 for none
 * @param {number}  o.ridgeDepth how proud those ribs stand
 */
export function riceGeometry({
  segments = 14,
  radial = 10,
  length = 0.5,
  radius = 0.145,
  husk = false,
  phiStart = 0,
  phiLength = Math.PI * 2,
  ridges = 0,
  ridgeDepth = 0.06,
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

  const geo = new THREE.LatheGeometry(points, radial, phiStart, phiLength);

  // a lathe can only vary the radius along the length; real paddy is ribbed
  // around it, so push the vertices out as a function of their angle
  if (ridges > 0) {
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const z = p.getZ(i);
      if (Math.hypot(x, z) < 1e-5) continue;
      const f = 1 + ridgeDepth * Math.cos(ridges * Math.atan2(z, x));
      p.setXYZ(i, x * f, p.getY(i), z * f);
    }
  }

  geo.computeVertexNormals();
  return geo;
}
