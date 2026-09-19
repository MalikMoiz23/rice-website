/* ============================================================
   dishes.js — what each rice is for, and how it is plated

   One entry per rice, in the same order as grades.js, so index 0
   is Super Basmati in both files.

   `cook.grow` is not decoration: it is the grade's real cooked
   elongation from the spec sheet, and the finished dish scales
   every grain by it. Biryani looks long and loose on screen for
   the same reason it does in the pot.

   `top` is what goes on and in the rice once it is cooked —
   chicken, fried onion, mint, kebab. Biryani without chicken in
   it is not biryani, which is what the first version of this
   looked like.

   All the words live in i18n.js under d0.*–d4.*; this file is
   the shape, the colour and the vessel.
   ============================================================ */

export const DISHES = [
  {
    slug: 'biryani',
    vessel: 'copper',
    cook: {
      grow: 2.1,                                   // Super Basmati
      tint: [0xfdfaf3, 0xe8a93f, 0xc2641d],        // white, saffron, deep saffron
      mix: [0.5, 0.32, 0.18],
      // real biryani is patchy, not evenly speckled: the colour goes in
      // where it was poured and the rest stays white
      patchy: true,
      mound: { r: 1.15, h: 0.6 },
    },
    masala: 0x8c3a1e,
    top: { chicken: 3, onion: 170, mint: 18, kebab: 0 },
    steam: 0.9,
  },
  {
    slug: 'pulao',
    vessel: 'plate',
    cook: {
      grow: 2.4,                                   // 1121 Sella, the longest we run
      tint: [0xecd7a8, 0xe0c791, 0xd3b579],        // one colour all through, from the stock
      mix: [0.45, 0.35, 0.2],
      patchy: false,
      mound: { r: 1.05, h: 0.46 },
    },
    masala: null,                                  // pulao is cooked in stock, not layered
    top: { chicken: 1, onion: 60, mint: 0, kebab: 2 },
    steam: 0.7,
  },
  {
    slug: 'boiled-rice',
    vessel: 'bowl',
    cook: {
      grow: 2.2,                                   // 1121 Steam
      tint: [0xfffdf7, 0xf7f3e8, 0xefe9da],
      mix: [0.6, 0.3, 0.1],
      patchy: false,
      mound: { r: 0.92, h: 0.52 },
    },
    masala: null,
    top: { chicken: 0, onion: 0, mint: 0, kebab: 0 },
    steam: 1,
  },
  {
    slug: 'deg',
    vessel: 'degh',
    cook: {
      grow: 1.6,                                   // Irri-6, shorter and thirstier
      tint: [0xf2e9d2, 0xe4d3b0, 0xd6c193],
      mix: [0.5, 0.32, 0.18],
      patchy: true,
      mound: { r: 1.18, h: 0.46 },
    },
    masala: 0x7a4a2a,
    top: { chicken: 2, onion: 70, mint: 10, kebab: 0 },
    steam: 1,
  },
  {
    slug: 'kheer',
    vessel: 'bowl',
    cook: {
      grow: 1.35,                                  // broken pieces swell but stay short
      tint: [0xfff9ec, 0xf6ecd6, 0xefe0bd],
      mix: [0.6, 0.28, 0.12],
      patchy: false,
      mound: { r: 0.88, h: 0.24 },                 // kheer sits flat, it is not a heap
      creamy: true,
    },
    masala: null,
    top: { chicken: 0, onion: 0, mint: 0, kebab: 0, nuts: 60 },
    steam: 0.45,
  },
];

/* the four steps every dish moves through, as scene stages 0–3 */
export const STEPS = 4;
