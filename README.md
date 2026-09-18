# Sunehri Rice Mills — website

Marketing and wholesale-order site for a rice mill selling in 25 kg and 50 kg bags.
English and Urdu, with a scroll-driven 3D sequence running the length of the page.

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
├── css/
│   ├── base.css         design tokens, reset, typography
│   ├── layout.css       header, hero, sections, act breaks, footer
│   ├── components.css   buttons, cards, forms, steps
│   └── lang.css         Urdu type, right-to-left, WhatsApp, phone sizes
├── js/
│   ├── main.js          nav, reveals, toggles, calculator, WhatsApp, language
│   ├── i18n.js          the English and Urdu dictionaries, and the switcher
│   ├── grades.js        the five grades as grain dimensions (no text)
│   ├── rice-geometry.js one rice grain, revolved from a profile
│   ├── rice-plant.js    one stalk of paddy: stem, leaves, drooping panicle
│   ├── open-sack.js     the jute sack the milled rice pours into
│   ├── scene-story.js   the page-long field → paddy → white rice → sack sequence
│   ├── scene-grade.js   one grade up close: grain, sack, drifting backdrop
│   ├── scene-process.js six small grains, one per milling step
│   └── scene-sack.js    the draggable 25/50 kg product bag
└── assets/
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

There are four WebGL contexts. Each one pauses when its section is off screen, and
the six process grains are skipped entirely below 760px, because six extra viewports
is a lot to ask of a mid-range phone. If it stutters on low-end hardware, the
contexts can be consolidated onto a single renderer.

`prefers-reduced-motion` stops every animation loop and all scroll transitions; the
scenes still follow the scroll, they just do not idle-animate.
