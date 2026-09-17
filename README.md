# Sunehri Rice Mills — website

Marketing and wholesale-order site for a rice mill that sells in 25 kg and 50 kg sacks.

Static site. No framework, no build step. HTML + CSS + ES modules, with Three.js
pulled from a CDN for the two WebGL scenes.

## Stack

| Piece        | Choice                                              |
| ------------ | --------------------------------------------------- |
| Markup       | Single `index.html`                                  |
| Styles       | Plain CSS, custom properties, 3 files                |
| Scripts      | ES modules, no bundler                               |
| 3D           | [Three.js](https://threejs.org) r169 via jsDelivr    |
| Fonts        | Fraunces + Inter (Google Fonts)                      |
| Hosting      | Any static host — GitHub Pages, Netlify, Cloudflare  |

## Layout

```
.
├── index.html
├── css/
│   ├── base.css         design tokens, reset, typography
│   ├── layout.css       header, sections, grid, footer
│   └── components.css   buttons, cards, forms, timeline
├── js/
│   ├── main.js          nav, reveals, toggles, calculator
│   ├── scene-hero.js    drifting rice-grain field (hero backdrop)
│   └── scene-sack.js    interactive 25/50 kg sack viewer
└── assets/
```

## Running it

The page uses ES modules and an import map, so `file://` will not work — browsers
block module requests from the filesystem. Serve the folder over HTTP:

```bash
npx serve .
# or
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploying to GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → `main` / `root`. Nothing to
build, the repository root is the site.

## Placeholder content

Everything customer-facing is dummy data and needs replacing before launch:

- Business name, logo mark and tagline
- Prices, varieties and per-sack rates in `index.html` and `js/main.js`
- Phone, WhatsApp, email and mill address in the contact section and footer
- Testimonials and the client logo strip

The contact form has no backend. It validates and shows a confirmation, nothing
is sent. Point it at Formspree, Basin or a small serverless handler before going
live — see the note in `js/main.js`.

## Browser support

Needs WebGL2 and import-map support: Chrome/Edge 89+, Firefox 108+, Safari 16.4+.
Older browsers still get the full site, just without the two 3D scenes — the hero
falls back to a CSS gradient. `prefers-reduced-motion` disables the animation
loops and all scroll transitions.
