# Sunehri Rice Mills — website

Marketing and wholesale-order site for a rice mill selling in 25 kg and 50 kg bags.
English and Urdu, with a scroll-driven 3D sequence running the length of the home
page and a cooking scene on each of the five dish pages.

Static site. No framework, no build step, no dependencies to install. HTML + CSS +
ES modules, with Three.js pulled from a CDN.

## Stack

| Piece    | Choice                                                            |
| -------- | ----------------------------------------------------------------- |
| Markup   | Single `index.html`                                               |
| Styles   | Plain CSS, custom properties, 4 files                             |
| Scripts  | ES modules, no bundler                                            |
| 3D       | [Three.js](https://threejs.org) r169 via jsDelivr                 |
| Fonts    | Fraunces + Inter; Noto Nastaliq Urdu + Noto Naskh Arabic for Urdu |
| Hosting  | Any static host — GitHub Pages, Netlify, Cloudflare               |

## Layout

```
.
├── index.html
├── cook-biryani.html      one page per rice — generated, see tools/
├── cook-pulao.html
├── cook-boiled-rice.html
├── cook-deg.html
├── cook-kheer.html
├── css/
│   ├── base.css         design tokens, reset, typography
│   ├── layout.css       header, hero, sections, act breaks, footer
│   ├── components.css   buttons, cards, forms, steps
│   ├── lang.css         Urdu type, right-to-left, WhatsApp, phone sizes
│   └── dish.css         the five what-it-cooks-best pages
├── js/
│   ├── main.js          the home page: cards, calculator, grade viewer
│   ├── chrome.js        header, nav, language, reveals — shared by every page
│   ├── dish-page.js     entry for the five dish pages
│   ├── dishes.js        which dish each rice is for, and its six cooking steps
│   ├── i18n.js          the English and Urdu dictionaries, and the switcher
│   ├── grades.js        the five grades as grain dimensions (no text)
│   ├── webgl.js         shared WebGL check, context-loss guard, quality guard
│   ├── rice-geometry.js one rice grain, revolved from a profile
│   ├── rice-plant.js    one stalk of paddy: stem, leaves, drooping panicle
│   ├── open-sack.js     the jute sack the milled rice pours into
│   ├── scene-story.js   the page-long field → paddy → white rice → sack sequence
│   ├── scene-grade.js   one grade up close: grain, sack, drifting backdrop
│   ├── scene-process.js six small grains, one per milling step
│   ├── scene-sack.js    the draggable 25/50 kg product bag
│   ├── kitchen.js       colander, degchi, karahi, stove, flame, lid, plates
│   ├── scene-dish.js    the dish cooking, in six scroll steps
│   └── scene-video.js   or a real clip of it, scrubbed by the scroll
├── assets/
│   ├── biryani-wide.mp4  the scrubbed clip, desktop
│   └── biryani-small.mp4 the same, for phones
└── tools/
    ├── build-dishes.mjs generates the five cook-*.html pages
    └── serve.mjs         dev server: right MIME types, Range requests
```

## How the page-long animation works

One fixed canvas sits behind everything (`scene-story.js`). `main.js` measures where
each `[data-act]` section is and converts scroll position into a continuous value
from 0 to 4. Whole numbers land exactly when an act section is centred:

| Stage | What is on screen                              |
| ----- | ---------------------------------------------- |
| 0     | Standing paddy in the field (the hero)         |
| 1     | One grain, close, still inside its hull        |
| 2     | The hull splits and comes away, white inside   |
| 3     | Paddy and milled grain side by side            |
| 4     | Milled rice pouring into an open sack          |

Everything between is interpolated. Content sections sit on top as frosted glass,
so the scene stays visible the whole way down.

## The dish pages

Five pages, one per rice: `cook-biryani.html`, `cook-pulao.html`,
`cook-boiled-rice.html`, `cook-deg.html` and `cook-kheer.html`. Each says what its
rice is for and why, then runs a six-step cooking scene driven by scroll.

Biryani follows the six steps of a real one, in order: wash it in a colander under
the tap, boil it in a degchi over a lit burner, simmer the chicken salan in a
karahi, layer the rice over it, seal the lid on with a rope of dough for the dum,
serve it. The other four borrow the same vessels wherever the step is the same.

### Footage, where there is any

Biryani does not use the modelled scene. `js/dishes.js` gives it a `footage`
block and the scroll scrubs a real clip of the same six steps instead, one shot
per step. The other four dishes have no clip and still run the 3D scene; adding
one is a matter of dropping the file in `assets/` and adding a `footage` block
with its cut points.

`js/scene-video.js` exposes the same two methods `initDish` does, so
`js/dish-page.js` does not care which it got. If the video will not play, the
modelled scene loads instead, so nothing is lost on a browser that cannot
handle it. When the video does work, `scene-dish.js` is never even fetched.

Two things make a clip scrub rather than stutter, and both are easy to undo:

- **Keyframes.** Seeking to a point between keyframes makes the decoder start
  at the one before it and work forward. The clip as supplied had six
  keyframes in ten seconds and took most of a second to land on a frame. It is
  re-encoded with one every fourth frame. Any replacement needs the same:

  ```bash
  ffmpeg -i source.mp4 -an \
    -vf "crop=1124:720:0:0,scale=1120:-2:flags=lanczos" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -crf 25.5 \
    -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart \
    assets/biryani-wide.mp4
  ```

  The crop takes the watermark off the right-hand edge; drop it if the clip
does not carry one. The width is whatever the source has left after that,
not a round number chosen for its own sake: the clip fills the window, so
it is scaled up on most screens and wants to start as close to its final
size as it can.

Then the same again at `scale=640:-2` and `-crf 27` for
  `assets/biryani-small.mp4`. `scene-video.js` picks between them on viewport
  width before it sets `src`, because changing it afterwards throws away
  everything already buffered.

- **One seek per frame.** `currentTime` is set from a single `requestAnimation-
  Frame` loop, never from the scroll event, and not at all while the target is
  inside the frame already on screen.

The cut points in `footage.cuts` are read off the clip, not guessed:

```bash
ffmpeg -i source.mp4 -vf "select='gt(scene,0.35)',metadata=print:file=-" -an -f null -
```

Step *n* parks in the middle of shot *n*, so a cut lands about halfway between
two steps rather than on one of them.

A phone is portrait and the footage is landscape, so `object-fit: cover` threw
away everything either side of the middle — a shot of a pot came out as a dark
stripe. Under 760px it is a band across the top instead, masked out at its
lower edge, with the copy below it.

**The clip is not of this mill.** It was generated, and it carried the
generator's watermark in the bottom-right corner, which is cropped off in the
encode above (`crop=1124:720:0:0` before the scale). Replacing it with real
footage of the actual mill and kitchen would be worth doing before this is
shown to customers.

### Generating the pages

They are **generated**, not hand-written. The site itself still has no build step;
this is a one-off so five pages cannot drift apart:

```bash
node tools/build-dishes.mjs
```

Re-run it after editing the template in `tools/build-dishes.mjs`, the dish copy in
`js/i18n.js` (keys `d0.*`–`d4.*`) or the plating in `js/dishes.js`. The English text
baked into the HTML is pulled from the dictionary at generation time, so it cannot
disagree with what the language switcher shows.

Two things in `js/scene-dish.js` are tied to real figures rather than picked to
look nice, and are easy to break:

- Cooked rice is scaled by each grade’s actual elongation, so Super Basmati at 2.1
  really does read longer on screen than Irri-6 at 1.6.
- A vessel is not a cylinder. Every one in `js/kitchen.js` is turned from a lathe
  profile, and `radiusAt(y)` reads that same profile back as the real interior
  radius at a height. Rice, water and salan are all seated at a height and then
  made exactly that wide. Guessing a width instead is what used to put a disc of
  salan straight through the side of the karahi, and water out of the bottom of
  the pot.
- The camera is not placed by hand. It is worked back from how wide the vessel is
  and how far down you have to look to see its floor, which is why a flat plate is
  seen almost side-on and a degchi is looked down into. The one exception is a lit
  burner: the shot flattens out then, because from any steeper angle the pot hides
  its own flame.

`js/dishes.js` holds six stage directions per dish — which vessel, burner lit or
not, how much water, how full and how cooked the rice is, what is on top — and
`scene-dish.js` interpolates between the two the scroll currently sits between.
Nothing is keyframed. `STEPS` is exported from there and the generator reads it,
so adding a seventh step means editing one array and re-running the generator.

## Running it

ES modules and an import map mean `file://` will not work — browsers block module
requests from the filesystem. Serve the folder over HTTP:

```bash
node tools/serve.mjs        # http://localhost:8137
```

`npx serve .` and `python -m http.server` both work too. Whatever you use, it has
to do two things, or the biryani page looks broken in a way that reports no error
anywhere:

- **send `.mp4` as `video/mp4`**, and
- **answer Range requests with a 206.**

A browser seeks by asking for a byte range. A server that hands the file over in
one lump will let the clip load and then quietly refuse to seek in it, so
`currentTime` is assigned, stays where it was, and the video sits on its first
frame the whole way down the page. `js/scene-video.js` watches for exactly that
and falls back to the modelled scene after a few seconds, so the page is never
just dead — but the clip is what you wanted, so check the server first.

To confirm a server is up to it:

```bash
curl -s -o /dev/null -w "%{content_type}\n" http://localhost:8137/assets/biryani-wide.mp4
curl -s -r 0-99 -o /dev/null -w "%{http_code}\n" http://localhost:8137/assets/biryani-wide.mp4
```

That wants `video/mp4` and `206`. GitHub Pages, Netlify, Vercel and Cloudflare
Pages all do both out of the box.

## Deploying to GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → `main` / `root`. Nothing to
build; the repository root is the site.

## Before you launch — everything here is a placeholder

**WhatsApp and phone number.** The number is a dummy: `923000000000`. It appears in
seven places, and all of them need the real number:

| File         | Where                                                      |
| ------------ | ---------------------------------------------------------- |
| `js/main.js` | `WA_NUMBER` at the top — used to build every prefilled chat |
| `index.html` | floating WhatsApp button, `.wa-float` href                  |
| `index.html` | "Message us on WhatsApp" in the contact section             |
| `index.html` | `tel:` link in the contact list                             |
| `index.html` | `tel:` link in the footer                                   |

The `href` values in the markup are the no-JavaScript fallback, which is why the
number is repeated rather than only living in `main.js`. Format for `wa.me` is
digits only, with the country code and no `+` or spaces.

**Other dummy content:**

- Business name, logo mark and tagline
- All prices, in the cards in `index.html` and in the calculator's `<option>` values
- Email `orders@example.com`, in the contact section and the footer
- Mill address, in the contact section and the footer
- Testimonials and the buyer names
- The stats in the hero (42,000 bags, 9 countries) and the quality tolerances

**The contact form has no backend.** It validates and shows a confirmation; nothing
is sent anywhere. Point it at Formspree, Basin or a small serverless handler — see
the note in `js/main.js`.

## Languages

`js/i18n.js` holds both dictionaries as flat key/value maps. Markup is tagged with
`data-i18n` (text), `data-i18n-html` (markup) and `data-i18n-attr` (attributes such
as `placeholder`). Switching sets `lang` and `dir` on `<html>` and rewrites every
tagged node; the choice is kept in `localStorage`.

To change wording, edit `i18n.js`, not `index.html` — the markup only holds the
English default, which is overwritten on load.

Urdu notes:

- Headings are Nastaliq, body and UI are Naskh. Nastaliq is beautiful but hard to
  read at button size.
- The Nastaliq font is only fetched when Urdu is actually selected, so English
  visitors do not pay for it.
- Digits stay Western (1, 2, 3) in both languages — that is what Pakistani price
  lists and invoices use.
- Latin-only values are bidi-isolated in `lang.css`, otherwise "7.2 mm" renders as
  "mm 7.2" inside an Urdu line.

## Browser support and performance

Needs WebGL2 and import maps: Chrome/Edge 89+, Firefox 108+, Safari 16.4+. Without
WebGL the whole site still works — the canvas keeps a CSS gradient and every scene
is skipped.

There are four WebGL contexts. The page-long story scene runs continuously, because
its canvas is fixed behind everything and the scrims are light enough to see it
through every section — gating it on the act breaks left it frozen behind the bag,
process and contact sections. The other three pause when their own section is off
screen, the six process grains are skipped below 760px, and every canvas survives a
lost context by hiding itself rather than going black (see `js/webgl.js`). A hidden
tab stops everything.

Three things keep scrolling smooth and are easy to undo by accident:

- The capability check lives in `webgl.js` and releases its probe context. A copy
  per scene leaks a context each, and past the browser cap the oldest live context
  is force-lost — a canvas that was working turns black.
- Scroll handlers only record a value. Per-instance work happens once per frame in
  the render loop, never in the scroll event, which fires far more often.
- Nothing blurs the canvas. Panels are dark and near-solid instead, and copy
  sitting straight on the scene carries a text-shadow. Blurring a live canvas
  was costing more than everything else on the page put together.

Measured on integrated graphics, scrolling the full page: median frame 6.9ms,
90th percentile 7.0ms, 99th 9.6ms, with the scene drawing the whole way down.

`prefers-reduced-motion` stops every animation loop and all scroll transitions; the
scenes still follow the scroll, they just do not idle-animate.
