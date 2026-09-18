/* ============================================================
   grades.js — the five grades, in one place
   Plain data, no Three.js, so the tabs and the spec panel still
   work on a browser that never loads the 3D.

   `grain` is the real thing scaled up: world half-length is the
   millimetre figure × 0.083, and the radius is half the real
   width at the same scale. Swapping a grade genuinely changes
   the shape on screen, it is not a recolour.
   ============================================================ */

export const GRADES = [
  {
    name: 'Super Basmati',
    caption: 'Super Basmati · 25 kg sack',
    len: '7.2 mm',
    broken: '≤ 2%',
    age: '12 months',
    elong: '2.1×',
    note:
      'Rested twelve months before milling, so the starch firms up and the ' +
      'grain stays separate on the boil. This is the biryani grade.',
    grain: { length: 0.6, radius: 0.075, color: 0xfcf9f3, roughness: 0.3 },
  },
  {
    name: '1121 Sella Kainat',
    caption: '1121 Sella Kainat · 25 kg sack',
    len: '8.4 mm',
    broken: '≤ 1%',
    age: '18 months',
    elong: '2.4×',
    note:
      'Steamed in the husk before milling, which drives the colour into the ' +
      'grain and hardens it. The highest elongation of anything we run.',
    grain: { length: 0.7, radius: 0.079, color: 0xe9cd93, roughness: 0.22 },
  },
  {
    name: '1121 Steam White',
    caption: '1121 Steam White · 25 kg sack',
    len: '8.2 mm',
    broken: '≤ 2%',
    age: '12 months',
    elong: '2.2×',
    note:
      'The same 1121 paddy, steamed white rather than parboiled. Cooks loose ' +
      'and clean, which is what most hotel kitchens are after.',
    grain: { length: 0.683, radius: 0.079, color: 0xf8f4ea, roughness: 0.28 },
  },
  {
    name: 'Irri-6 Long Grain',
    caption: 'Irri-6 Long Grain · 50 kg sack',
    len: '6.4 mm',
    broken: '≤ 5%',
    age: '3 months',
    elong: '1.6×',
    note:
      'Short, hard and absorbent. It takes a lot of water and forgives a rough ' +
      'boil, which is why the volume kitchens run on it.',
    grain: { length: 0.533, radius: 0.0875, color: 0xf1ead8, roughness: 0.34 },
  },
  {
    name: 'Broken Basmati (Tota)',
    caption: 'Broken Basmati · 50 kg sack',
    len: '2–4 mm',
    broken: '—',
    age: '—',
    elong: '—',
    note:
      'Fragments pulled off the length grader. The same aroma as the whole ' +
      'grain at about a third of the price — kheer, khichri and the snack trade.',
    grain: { length: 0.25, radius: 0.079, color: 0xf7f2e4, roughness: 0.33 },
  },
];
