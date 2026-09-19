/* ============================================================
   dishes.js — what each rice is for, and how it is cooked

   One entry per rice, in the same order as grades.js, so index 0
   is Super Basmati in both files.

   `script` is the six scroll steps as stage directions. Each one
   says which vessel is on screen, whether it is on a lit burner,
   how much water is in it, how heaped and how cooked the rice
   is, and what has been put on top. scene-dish.js interpolates
   between consecutive entries, so the rice flows from a wet bed
   in a colander to a heap on a painted plate without anyone
   writing an animation.

     v      vessel key, from kitchen.js
     stove  burner underneath, which also lifts the vessel
     fire   flames lit
     pour   the tap running into it
     water  water, stock or milk in the vessel
     boil   bubbles coming up through it
     lid    the lid on, sealed with its rope of dough
     heap   how full the vessel is, 0 bare floor to 1 brimming
     dome   how much of that load is piled up rather than level,
            so a colander can be full of rice and still flat
     swell  0 raw grain, 1 fully cooked and elongated
     curry  the salan layer
     rice   whether there is rice on screen at all
     tint   how much colour the grain has taken
     top    chicken, fried onion, coriander, kebab

   A dish with a `footage` block is scrolled through its own video
   instead, and the script below is only the fallback for a browser
   that cannot play it.

   Biryani follows the six steps of the reference photograph
   exactly: wash it, boil it, make the salan, layer it, seal it
   for the dum, serve it. The other four borrow the same vessels
   wherever the step is the same one.

   `cook.grow` is not decoration: it is the grade's real cooked
   elongation from the spec sheet, and `swell` scales every grain
   towards it. Biryani looks long and loose on screen for the
   same reason it does in the pot.

   All the words live in i18n.js under d0.*–d4.*.
   ============================================================ */

/* every field a step can set, so a script only has to name what differs */
const STEP = {
  v: 'degchi',
  stove: 0, fire: 0, pour: 0, water: 0, boil: 0, lid: 0,
  heap: 0, dome: 1, swell: 0, curry: 0, rice: 1, tint: 0, top: 0,
};

const script = (steps) => steps.map((s) => ({ ...STEP, ...s }));

export const DISHES = [
  {
    slug: 'biryani',
    cook: {
      grow: 2.1,                                   // Super Basmati
      tint: [0xfdfaf3, 0xe8a93f, 0xc2641d],        // white, saffron, deep saffron
      mix: [0.5, 0.32, 0.18],
      // real biryani is patchy, not evenly speckled: the colour goes in
      // where it was poured and the rest stays white
      patchy: true,
      mound: { h: 0.6 },
    },
    masala: 0x7e2d10,
    top: { chicken: 3, onion: 190, mint: 20, kebab: 0 },
    steam: 0.9,
    /* Real footage of these same six steps, one shot each. The cuts are read
       off the clip rather than guessed, and they are what step n is parked
       in the middle of. Re-encoded with a keyframe every fourth frame, which
       is the difference between scrubbing and stuttering. */
    footage: {
      wide: 'assets/biryani-wide.mp4',
      small: 'assets/biryani-small.mp4',
      cuts: [0, 1.5, 2.958, 4.458, 6.0, 7.375, 10.006],
    },
    script: script([
      { v: 'colander', pour: 1, water: 1, heap: 0.72, dome: 0.12, swell: 0.08 },                  // washing
      { v: 'degchi', stove: 1, fire: 1, water: 1, boil: 1, heap: 0.5, dome: 0.08, swell: 0.62 },  // boiling
      { v: 'karahi', stove: 1, fire: 1, curry: 1, rice: 0, top: 0.6 },                            // the salan
      { v: 'degchi', curry: 1, heap: 0.84, dome: 0.8, swell: 1, tint: 0.55, top: 0.5 },           // layering
      { v: 'degchi', stove: 1, fire: 1, lid: 1, heap: 0.88, dome: 0.85, swell: 1, tint: 0.8, top: 0.3 }, // dum
      { v: 'platter', heap: 1, swell: 1, tint: 1, top: 1 },                                       // served
    ]),
  },
  {
    slug: 'pulao',
    cook: {
      grow: 2.4,                                   // 1121 Sella, the longest we run
      tint: [0xecd7a8, 0xe0c791, 0xd3b579],        // one colour all through, from the stock
      mix: [0.45, 0.35, 0.2],
      patchy: false,
      mound: { h: 0.46 },
    },
    masala: 0x8a5f2a,
    top: { chicken: 1, onion: 70, mint: 0, kebab: 2 },
    steam: 0.7,
    script: script([
      { v: 'colander', pour: 1, water: 1, heap: 0.72, dome: 0.12, swell: 0.1 },                   // rinse
      { v: 'karahi', stove: 1, fire: 1, curry: 0.35, heap: 0.55, dome: 0.2, swell: 0.28 },        // fried in the yakhni
      { v: 'degchi', stove: 1, fire: 1, water: 1, boil: 1, heap: 0.5, dome: 0.08, swell: 0.7, tint: 0.3 },
      { v: 'degchi', stove: 1, fire: 1, lid: 1, heap: 0.7, dome: 0.5, swell: 0.95, tint: 0.7 },   // simmered covered
      { v: 'degchi', heap: 0.82, dome: 0.8, swell: 1, tint: 1 },                                  // rested
      { v: 'plate', heap: 1, swell: 1, tint: 1, top: 1 },                                         // served
    ]),
  },
  {
    slug: 'boiled-rice',
    cook: {
      grow: 2.2,                                   // 1121 Steam
      tint: [0xfffdf7, 0xf7f3e8, 0xefe9da],
      mix: [0.6, 0.3, 0.1],
      patchy: false,
      mound: { h: 0.52 },
    },
    masala: null,
    top: { chicken: 0, onion: 0, mint: 0, kebab: 0 },
    steam: 1,
    script: script([
      { v: 'colander', pour: 1, water: 1, heap: 0.72, dome: 0.12, swell: 0.1 },                   // rinse
      { v: 'degchi', stove: 1, fire: 1, water: 1, boil: 1, heap: 0.48, dome: 0.08, swell: 0.5 },
      { v: 'degchi', stove: 1, fire: 1, water: 1, boil: 1, heap: 0.55, dome: 0.1, swell: 0.85 },  // tested
      { v: 'colander', heap: 0.8, dome: 0.45, swell: 1 },                                         // drained
      { v: 'degchi', heap: 0.82, dome: 0.7, swell: 1, tint: 0.6 },                                // fluffed
      { v: 'bowl', heap: 1, swell: 1, tint: 1 },                                                  // served
    ]),
  },
  {
    slug: 'deg',
    cook: {
      grow: 1.6,                                   // Irri-6, shorter and thirstier
      tint: [0xf2e9d2, 0xe4d3b0, 0xd6c193],
      mix: [0.5, 0.32, 0.18],
      patchy: true,
      mound: { h: 0.46 },
    },
    masala: 0x7a4a2a,
    top: { chicken: 2, onion: 80, mint: 12, kebab: 0 },
    steam: 1,
    script: script([
      { v: 'degh', pour: 1, water: 1, heap: 0.6, dome: 0.1, swell: 0.1 },                         // washed in the deg
      { v: 'degh', stove: 1, water: 1, heap: 0.5, dome: 0.08, swell: 0.2 },                       // measured
      { v: 'degh', stove: 1, fire: 1, water: 1, boil: 1, heap: 0.55, dome: 0.1, swell: 0.72 },    // boiled hard
      { v: 'karahi', stove: 1, fire: 1, curry: 1, rice: 0, top: 0.5 },                            // the salan
      { v: 'degh', curry: 1, heap: 0.84, dome: 0.75, swell: 1, tint: 0.7, top: 0.35 },            // folded together
      { v: 'degh', heap: 1, swell: 1, tint: 1, top: 1 },                                          // served from it
    ]),
  },
  {
    slug: 'kheer',
    cook: {
      grow: 1.35,                                  // broken pieces swell but stay short
      tint: [0xfff9ec, 0xf6ecd6, 0xefe0bd],
      mix: [0.6, 0.28, 0.12],
      patchy: false,
      mound: { h: 0.24 },                          // kheer sits flat, it is not a heap
      creamy: true,
    },
    masala: null,
    top: { chicken: 0, onion: 0, mint: 0, kebab: 0, nuts: 70 },
    steam: 0.45,
    script: script([
      { v: 'colander', pour: 1, water: 1, heap: 0.72, dome: 0.12, swell: 0.1 },                   // rinse
      { v: 'degchi', stove: 1, fire: 1, water: 1, boil: 1, heap: 0.4, dome: 0.05, swell: 0.15 },  // milk to the boil
      { v: 'degchi', stove: 1, fire: 1, water: 1, boil: 1, heap: 0.5, dome: 0.06, swell: 0.6 },
      { v: 'degchi', stove: 1, fire: 1, heap: 0.6, dome: 0.15, swell: 0.95, tint: 0.5 },          // simmered down
      { v: 'degchi', heap: 0.68, dome: 0.25, swell: 1, tint: 0.8 },                               // sweetened
      { v: 'bowl', heap: 1, swell: 1, tint: 1, top: 1 },                                          // garnished
    ]),
  },
];

/* the number of scroll steps every dish page lays out */
export const STEPS = DISHES[0].script.length;
