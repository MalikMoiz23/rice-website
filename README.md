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
│   └── scene-dish.js    the dish cooking, in six scroll steps
├── assets/
└── tools/
    └── build-dishes.mjs generates the five cook-*.html pages
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
npx serve .
# or
python -m http.server 8000
```

Then open <http://localhost:8000>.

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
