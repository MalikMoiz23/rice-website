/* ============================================================
   grades.js — the five grades, in one place
   Plain data, no Three.js, so the tabs and the spec panel still
   work on a browser that never loads the 3D.

   All the words live in i18n.js under g0.*–g4.*; this file is only the
   shape. `grain` is the real thing scaled up: world half-length is the
   millimetre figure × 0.083, and the radius is half the real
   width at the same scale. Swapping a grade genuinely changes
   the shape on screen, it is not a recolour.
   ============================================================ */

export const GRADES = [
  { grain: { length: 0.6,   radius: 0.075,  color: 0xfcf9f3, roughness: 0.3  } }, // Super Basmati
  { grain: { length: 0.7,   radius: 0.079,  color: 0xe9cd93, roughness: 0.22 } }, // 1121 Sella
  { grain: { length: 0.683, radius: 0.079,  color: 0xf8f4ea, roughness: 0.28 } }, // 1121 Steam
  { grain: { length: 0.533, radius: 0.0875, color: 0xf1ead8, roughness: 0.34 } }, // Irri-6
  { grain: { length: 0.25,  radius: 0.079,  color: 0xf7f2e4, roughness: 0.33 } }, // Broken
];
