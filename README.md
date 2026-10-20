# Toko — Anime Digital Artist Portfolio

A dark, cinematic one-page portfolio for **Toko**, a digital artist who transforms people into anime-style characters. Built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step, no dependencies.

![Stack](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

## Features

- **Premium glassmorphism UI** — frosted translucent panels with backdrop blur, light-catching borders, and layered soft shadows throughout
- **Hero** — cinematic artwork in a glass frame with an animated light sheen, floating glass chips, and dual CTAs
- **Featured gallery** — 18 artwork cards, each in its own glass frame with category filters (Portraits, Fan Art, Original Characters, Custom Art)
- **Lightbox** — full-size artwork viewer in a glass panel with prev/next, keyboard support (← → Esc Home End), swipe gestures, and focus trapping
- **About** — artist intro inside a dedicated glass panel with nested glass specialty tiles
- **Commission banner** — rounded glass banner with pooled neon light and a prominent Telegram CTA
- **Responsive** — mobile-first; floating glass nav, hamburger menu below 760 px, fluid grid down to phones
- **Accessible** — semantic landmarks, skip link, visible focus states, `aria` attributes, alt text, WCAG AA contrast, `prefers-reduced-motion` support
- **Performance-tuned blur** — blur radius scales down on smaller screens and the animated neon layer pauses when the tab is hidden

## The glassmorphism system

Everything is driven by tokens at the top of `css/style.css`:

| Token | Purpose |
|-------|---------|
| `--glass`, `--glass-2`, `--glass-3` | Translucent fills, from subtle to brighter |
| `--glass-navy` | Navy-tinted glass for surfaces over artwork |
| `--glass-blur`, `--glass-sat` | Backdrop blur radius and saturation |
| `--border`, `--border-strong`, `--border-glow` | Hairline edges; `--border-glow` is the purple hover edge |
| `--edge` | The inset highlight that makes a pane read as glass |
| `--shadow-glass`, `--shadow-float` | Layered soft shadows for depth |

There's a reusable `.glass` utility class, and the effect works because the decorative `body::before` neon field sits behind the content — that's what the frosted panels actually blur.

## Performance notes

Backdrop blur is the most expensive effect here, so it's tuned deliberately:

- Blur radius drops from **18 px → 14 px → 10 px** across desktop / tablet / mobile
- Saturation is reduced on smaller screens to cut filter cost
- The neon layer uses a **single fixed GPU layer** rather than many animated elements
- The animation is **paused when the tab is hidden** (see `initPerf` in `js/main.js`)
- On mobile, `background-attachment: fixed` is switched to `scroll` to avoid scroll repaints
- All non-hero images are lazy-loaded

## Getting started

No installation required. Just open `index.html` in your browser.

For the most accurate results (lazy loading, font rendering), serve it locally:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then visit <http://localhost:8000>.

## Project structure

```
├── index.html          # All page content and markup
├── css/
│   └── style.css       # Full design system (tokens at the top)
├── js/
│   └── main.js         # Navigation, filters, lightbox, animations
├── images/             # Artwork, profile photo, favicon
└── README.md
```

## Updating the Telegram username

The username is configured in **one primary location**:

1. Open `js/main.js` and change the constant at the top:

   ```js
   var TELEGRAM_USERNAME = "toko18"; // ← change this
   ```

   Every Telegram link on the page updates automatically at load time.

2. For a no-JS fallback, the same username also appears in `index.html` wherever you see `https://t.me/toko18` (hero, navigation, contact section, footer). Update those to match if you want the links to work even with JavaScript disabled.

## Replacing or adding artwork

All gallery images live in `images/` and are referenced directly in `index.html`.

**To swap an image:** replace the file with your artwork, keeping the same filename (e.g. replace `images/01-held.jpg` with your new `01-held.jpg`). Keep the `width` and `height` attributes on the `<img>` tag roughly matching your image's real dimensions to avoid layout shifts.

**To add a new artwork:** copy one of the existing `<article class="gallery-card">…</article>` blocks in `index.html` and edit:

- `data-category` — one of `portraits`, `fan-art`, `original-characters`, `custom-art` (must match a filter button)
- `data-title` — shown in the lightbox and on hover
- `data-category-label` — the human-readable category name
- `alt` — a short, meaningful description for screen readers
- `src` — your image path, plus matching `width`/`height`

To **add a new category**, add a new `filter-btn` button in the filters bar with a matching `data-filter` value, then use that value on your cards.

**Current gallery mapping** (based on the supplied filenames):

| # | File | Title | Category |
|---|------|-------|----------|
| 1 | `01-held.jpg` | Held | Portraits |
| 2 | `02-subtitles.jpg` | Subtitles | Fan Art |
| 3 | `03-glasses-up.jpg` | Glasses Up | Portraits |
| 4 | `04-stars.jpg` | Stars | Original Characters |
| 5 | `05-lane.jpg` | Lane | Original Characters |
| 6 | `06-ophelia.jpg` | Ophelia | Fan Art |
| 7 | `07-curls.jpg` | Curls | Portraits |
| 8 | `08-two-hills.jpg` | Two Hills | Custom Art |
| 9 | `09-sailor-collars.jpg` | Sailor Collars | Portraits |
| 10 | `10-paper-boy.jpg` | Paper Boy | Original Characters |
| 11 | `11-kiss-after-klimt.jpg` | Kiss After Klimt | Fan Art |
| 12 | `12-lamplight.jpg` | Lamplight | Custom Art |
| 13 | `13-shatter.jpg` | Shatter | Fan Art |
| 14 | `14-whale-sky.jpg` | Whale Sky | Fan Art |
| 15 | `15-call-you-tonight.jpg` | Call You Tonight | Original Characters |
| 16 | `16-drift.jpg` | Drift | Custom Art |
| 17 | `17-peace-sign.jpg` | Peace Sign | Portraits |
| 18 | `18-red-sleeve.jpg` | Red Sleeve | Portraits |

The hero uses `images/04-stars.jpg` and the About section uses `images/profile.jpg`.

## Customizing the design

`css/style.css` starts with a `:root` block containing every design token — colors, fonts, radii, and spacing. The quickest ways to restyle:

- **Accent color:** change `--accent`, `--accent-deep`, and `--accent-grad`
- **Fonts:** the site uses *Manrope* (body) and *Caveat* (handwritten headings) from Google Fonts — swap the `<link>` in `index.html` and the `--font-*` variables
- **Background atmosphere:** the layered gradients live on `body` in section 2 of the stylesheet

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Graceful fallbacks are included for missing backdrop-filter and IntersectionObserver.

## Accessibility notes

- All interactive elements are keyboard reachable with visible focus rings
- The lightbox behaves as a modal dialog: `Esc` closes, arrow keys navigate, focus is trapped and restored
- Animations are disabled automatically when the visitor's system requests reduced motion
- Gallery filters announce results via an `aria-live` region

---

Made with care for Toko ✦ All artwork © Toko.
