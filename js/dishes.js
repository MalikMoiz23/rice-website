/* ============================================================
   dishes.js — what each rice is for, as data

   One entry per rice, in the same order as grades.js, so index 0
   is Super Basmati in both files.

   `cook.grow` is not decoration: it is the grade's real cooked
   elongation from the spec sheet, and the finished dish scales
   every grain by it. Biryani looks long and loose on screen for
   the same reason it does in the pot.

   All the words live in i18n.js under d0.*–d4.*; this file is
   the shape, the colour and the vessel.
   ============================================================ */

export const DISHES = [
  {
    slug: 'biryani',
    vessel: 'platter',
    cook: {
      grow: 2.1,              // Super Basmati, cooked elongation
      tint: [0xfdfaf3, 0xf2c766, 0xe08a3c], // white, saffron, deep saffron
      mix: [0.55, 0.3, 0.15], // how much of the mound is each tint
      mound: { r: 1.15, h: 0.62 },
    },
    masala: 0x8c3a1e,
    garnish: [0x2f6b2a, 0xd8d24a, 0xb8321f], // coriander, fried onion, chilli
    steam: 0.9,
  },
  {
    slug: 'pulao',
    vessel: 'degh',
    cook: {
      grow: 2.4,              // 1121 Sella, the longest we run
      tint: [0xf6e2b4, 0xe9c98a, 0xd8ad64],
      mix: [0.5, 0.35, 0.15],
      mound: { r: 1.0, h: 0.5 },
    },
    masala: 0x6d4a22,
    garnish: [0xe0761f, 0x5a2f17, 0x2f6b2a], // carrot, raisin, herb
    steam: 0.7,
  },
  {
    slug: 'boiled-rice',
    vessel: 'bowl',
    cook: {
      grow: 2.2,              // 1121 Steam
      tint: [0xfffdf7, 0xf7f3e8, 0xefe9da],
      mix: [0.6, 0.3, 0.1],
      mound: { r: 0.92, h: 0.52 },
    },
    masala: null,             // nothing under it, this is plain rice
    garnish: [],
    steam: 1,
  },
  {
    slug: 'deg',
    vessel: 'degh',
    cook: {
      grow: 1.6,              // Irri-6, a shorter, thirstier grain
      tint: [0xf4eede, 0xeadfc6, 0xdfd2b4],
      mix: [0.55, 0.3, 0.15],
      mound: { r: 1.18, h: 0.46 },
    },
    masala: 0x7a4a2a,
    garnish: [0x2f6b2a],
    steam: 1,
  },
  {
    slug: 'kheer',
    vessel: 'bowl',
    cook: {
      grow: 1.35,             // broken pieces swell but stay short
      tint: [0xfff9ec, 0xf6ecd6, 0xefe0bd],
      mix: [0.6, 0.28, 0.12],
      mound: { r: 0.88, h: 0.26 }, // kheer sits flat, it is not a heap
      creamy: true,
    },
    masala: null,
    garnish: [0x7fae3f, 0xc9455a, 0xe8d9a8], // pistachio, rose, almond
    steam: 0.45,
  },
];

/* the four steps every dish moves through, as scene stages 0–3 */
export const STEPS = 4;
