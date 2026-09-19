/* ============================================================
   grades.js — the five grades, in one place
   Plain data, no Three.js, so the tabs and the spec panel still
   work on a browser that never loads the 3D.

   All the words live in i18n.js under g0.*–g4.*; this file is only the
   shape.

   `grain` is the real thing scaled up. riceGeometry takes HALF
   measurements, so both numbers are half the millimetre figure
   times 0.083: Super Basmati is 7.2 mm long and 1.8 mm wide, which
   is 0.299 and 0.075 here, and reads as the 4:1 grain it actually
   is. Swapping a grade genuinely changes the shape on screen, it
   is not a recolour.
   ============================================================ */

export const GRADES = [
  { grain: { length: 0.299, radius: 0.075,  color: 0xfcf9f3, roughness: 0.3  } }, // Super Basmati 7.2 × 1.8 mm
  { grain: { length: 0.349, radius: 0.079,  color: 0xe9cd93, roughness: 0.22 } }, // 1121 Sella    8.4 × 1.9 mm
  { grain: { length: 0.340, radius: 0.079,  color: 0xf8f4ea, roughness: 0.28 } }, // 1121 Steam    8.2 × 1.9 mm
  { grain: { length: 0.266, radius: 0.0875, color: 0xf1ead8, roughness: 0.34 } }, // Irri-6        6.4 × 2.1 mm
  { grain: { length: 0.125, radius: 0.079,  color: 0xf7f2e4, roughness: 0.33 } }, // Broken        2–4 × 1.9 mm
];
