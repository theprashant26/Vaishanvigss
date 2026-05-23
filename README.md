# Vaishnavi Gau Seva Gausansthan — Website

E‑commerce front-end for **Vaishnavi Gau Seva Gausansthan**, an Indian gaushala running the livelihood of 35+ indigenous cows. The site sells A2 dairy, traditional sweets, and panchgavya products; every rupee funds cow welfare.

> **Aesthetic direction:** "Heritage Refined" — modern editorial e‑commerce with restrained traditional Indian ornament. Maroon, gold, cream. Never festival‑poster.

---

## Tech

| Layer | Tool |
|---|---|
| Markup | HTML5 (semantic) |
| Styling | Plain CSS3 + Bootstrap 5 (CDN) + design-token CSS variables |
| Behaviour | Vanilla JavaScript (ES2020) |
| Animation | GSAP 3 + ScrollTrigger (CDN) |
| Data | JSON files under `/assets/data/` |

No build step. No npm install. No frameworks.

---

## Run locally

`fetch()` is used to inject partials (navbar/footer) and load JSON data, so the site **must be served from a local web server** — opening `index.html` via `file://` will leave the navbar empty.

```bash
# Easiest: VS Code Live Server extension → right-click index.html → "Open with Live Server"

# Python
python -m http.server 8080
# then visit http://localhost:8080

# Node
npx serve .
```

---

## Pages

| Page | Status | Notes |
|---|---|---|
| [`index.html`](index.html) | ✅ | Home — hero, trust strip, categories, story, bestsellers, subscriptions, testimonials, blog teasers, newsletter |
| [`about.html`](about.html) | ✅ | Story, timeline, values, meet-the-cows, photo gallery (masonry + lightbox) |
| [`services.html`](services.html) | ✅ | 6 services + how-it-works flow + pricing tiers |
| [`products.html`](products.html) | ✅ | Filterable grid, URL-synced filters, mobile offcanvas filters |
| [`product-detail.html`](product-detail.html) | ✅ | Gallery, hover-zoom, sizes, qty, tabs, sticky add-to-cart bar, related |
| [`cart.html`](cart.html) | ✅ | Line items, promo codes, free-shipping progress bar |
| [`checkout.html`](checkout.html) | ✅ | 3-step flow (Address → Payment → Review) + success state |
| [`login.html`](login.html) | ✅ | Email tab + Phone OTP tab + Google placeholder |
| [`register.html`](register.html) | ✅ | Details → OTP verify, password strength meter |
| [`profile.html`](profile.html) | ✅ | Dashboard, orders, subscriptions, addresses, wishlist, settings |
| [`contact.html`](contact.html) | ✅ | Form, info card, map placeholder, FAQ |
| [`404.html`](404.html) | ✅ | Themed "this pasture is empty" |
| [`styleguide.html`](styleguide.html) | ✅ | Living design system reference (Sections 1–15) |

---

## Folder structure

```
vaishnavi-gaushala/
├── *.html (13 pages)
├── components/
│   ├── navbar.html       (sticky, scroll-state, mobile offcanvas)
│   └── footer.html       (4-col desktop, accordion mobile)
├── assets/
│   ├── css/
│   │   ├── tokens.css            (design tokens — single source of truth)
│   │   ├── global.css            (reset + typography + buttons + forms + splash + page-transition)
│   │   ├── components.css        (navbar, footer, cards, toasts, back-to-top)
│   │   ├── home.css
│   │   ├── about.css
│   │   ├── services.css
│   │   ├── products.css
│   │   ├── product-detail.css
│   │   ├── cart.css
│   │   ├── checkout.css
│   │   ├── auth.css              (shared login + register)
│   │   ├── profile.css
│   │   ├── contact.css
│   │   ├── 404.css
│   │   └── styleguide.css
│   ├── js/
│   │   ├── app.js                (partial loader, cart, nav state, splash, page transitions, back-to-top)
│   │   ├── animations.js         (GSAP timelines + reveal helpers)
│   │   ├── home.js / about.js / services.js / contact.js
│   │   ├── products.js           (filter logic + URL sync)
│   │   ├── product-detail.js     (?id= fetch + hover-zoom + tabs + sticky bar)
│   │   ├── cart.js / checkout.js / login.js / register.js / profile.js
│   ├── svg/                      (lotus-dot, divider, corner-flourish, paisley-watermark, hand-print, logo*)
│   ├── img/                      (empty — Unsplash placeholders described in HTML comments)
│   └── data/
│       ├── products.json         (13 products across 5 categories)
│       ├── categories.json       (5)
│       ├── services.json         (6)
│       ├── testimonials.json     (4)
│       └── cows.json             (6 cow profiles)
└── README.md
```

---

## Design system

**Never** introduce a hex code, font, radius, or shadow that isn't declared in [`assets/css/tokens.css`](assets/css/tokens.css).

- Colors: maroon `#7A1F1F`, gold `#C9A961`, cream `#FBF5E9`, warm ink `#2B1810`
- Fonts: **Fraunces** (display) · **DM Sans** (body) · **Tiro Devanagari Hindi** (accents)
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128
- Radius: 4 / 8 / 16 / pill
- Shadows: soft only

Open [`styleguide.html`](styleguide.html) for the live reference — 15 sections covering every component.

---

## Persistence (localStorage)

| Key | Owner | Purpose |
|---|---|---|
| `vai_cart_v1` | app.js (`window.vaiCart`) | Cart line items |
| `vai_promo_v1` | cart.js | Applied promo code |
| `vai_cart_totals_v1` | cart.js → checkout.js | Snapshotted totals for handoff |
| `vai_splash_shown_v1` (sessionStorage) | app.js | Splash only shows once per session |

Promo codes (demo): `VAISHNAVI10` (10% off), `FIRSTORDER` (₹100 off), `GAUSEVA` (5% off).

---

## Known placeholders

All marked with `<!-- TODO -->` comments inline:

- **Logo:** Real logo at `/assets/img/vaishnavilogo.jpeg`. Used in navbar, footer, auth cards, splash, 404 medallion, favicon, OG/Twitter image. CSS classes `.logo-img`, `.logo-img--blend` (cream backgrounds), `.logo-img--medallion` (circular crop). The earlier placeholder SVGs at `/assets/svg/logo.svg` and `/assets/svg/logo-mark.svg` remain in the repo as fallback references only.
- **Product / cow / gaushala imagery:** All gradient blocks. Drop in Unsplash photos (URLs noted in HTML comments) or real photography.
- **Map:** `contact.html` uses a styled pin card. Swap for `<iframe>` Google Maps embed.
- **Phone, email, address, WhatsApp:** `+91 98XXX XXXXX`, `hello@vaishnavigaushala.com`, generic village address.
- **Domain:** `vaishnavigaushala.com` placeholder in OG/canonical URLs.
- **Cow names:** Gauri, Nandini, Lakshmi, Kamadhenu, Radha, Saraswati — traditional placeholders, swap with real names.
- **Pricing:** All values illustrative — confirm with client.
- **Customer reviews on PDP:** 3 hardcoded reviews. Render from a `reviews.json` once available.

---

## What's mocked vs real

| Feature | Status |
|---|---|
| Cart state | Real — `localStorage` |
| Wishlist | Visual only (heart toggle) |
| Promo codes | Real client-side logic, 3 demo codes |
| Product / service / testimonial / cow data | Real JSON, mock content |
| Filter + sort + URL sync | Real |
| Email / phone OTP auth | UI only — any 6-digit OTP accepts, toast + redirect |
| Google sign-in | UI only — toast + redirect |
| Payment | UI only — UPI/Card/NB/COD radios, no gateway |
| Order placement | Generates client-side `VAI-XXXXXX` ID, clears cart |
| Newsletter | UI only — toast on submit |
| Contact form | UI only — validation + toast |
| Profile data | Hardcoded "Anjali Sharma" |

Backend wiring is a later engagement.

---

## Polish features (Phase 6)

- **Loading splash** — logo pulse + wordmark on first visit per session. Auto-fades after ~1s. Skipped under `prefers-reduced-motion`.
- **Page transitions** — short cream-fade overlay on internal `<a>` clicks. Skipped for new-tab, modifier-held, external, anchor-only, `mailto:`/`tel:`/`javascript:`, and explicit `data-no-transition` links. Skipped under `prefers-reduced-motion`.
- **Back-to-top button** — appears after 600px scroll (Phase 1).
- **OG + Twitter + theme-color** — full social-share meta on 6 public pages; `noindex,nofollow` on transactional pages (cart, checkout, login, register, profile, styleguide).
- **Favicon** — `/assets/img/vaishnavilogo.jpeg` set on every page.
- **`prefers-reduced-motion`** — globally honored in CSS (transition durations → 0.01ms) and JS (animations + splash + page transitions bail).

---

## Pre-launch manual audit checklist

These need a browser; document what you'd run before shipping.

### Lighthouse (Chrome DevTools)
Target ≥90 Performance, ≥95 Accessibility, ≥95 Best Practices, ≥90 SEO.
Run on a built / served version (not `file://`):
- [ ] `index.html` — home
- [ ] `products.html` — listing
- [ ] `product-detail.html?id=ghee-500` — PDP
- [ ] `cart.html` (with items added)
- [ ] `checkout.html` (with items added)
- [ ] `about.html`, `services.html`, `contact.html`
- [ ] `profile.html`

Common likely flags + already-handled:
- ✅ `lang="en"`, `<title>`, `<meta description>` on every page
- ✅ Single `<h1>` per page
- ✅ `alt` on every meaningful `<img>`, `aria-label` on icon-only buttons
- ✅ `<link rel="preconnect">` for Google Fonts
- ⚠ Real images aren't in yet — Lighthouse may flag missing image sizing or unused CSS once they're added (lazy-load + width/height attrs already in HTML comments).

### axe DevTools
- [ ] No serious / critical violations on any of the 12 pages
- [ ] Color contrast on maroon-on-cream (passes 4.5:1)
- [ ] Form labels & error announcements (`aria-live` already on toast)
- [ ] Tab order through navbar → main → footer matches visual order

### Manual responsive sweep
Test at: **360, 414, 768, 1024, 1440**
- [ ] No horizontal scroll at any width
- [ ] All tap targets ≥ 44px
- [ ] Font ≥ 14px on mobile
- [ ] Navbar collapses to offcanvas at <992
- [ ] Filter sidebar collapses to offcanvas at <992 (products page)
- [ ] Filter / form values persist across orientation change

### Manual flow sweep
- [ ] Home → category card → products → product detail → add to cart → cart → checkout → success
- [ ] Cart promo codes: `VAISHNAVI10`, `FIRSTORDER`, `GAUSEVA`
- [ ] Login (email tab) → profile
- [ ] Login (phone OTP, any 6 digits) → profile
- [ ] Register → OTP → profile
- [ ] Profile views: dashboard / orders / subscriptions / addresses / wishlist / settings
- [ ] 404 page from a bad URL
- [ ] WhatsApp / phone / email links open the right apps

### Cross-browser
- [ ] Chrome / Edge (Chromium) — primary
- [ ] Safari (macOS / iOS) — verify `-webkit-backdrop-filter`, mask-image lotus
- [ ] Firefox — verify scrollbar-width / scrollbar-color (these are Firefox-native), `<details>` FAQ

### Pre-flight before push
- [ ] Replace placeholder phone / email / address / WhatsApp number
- [ ] Replace placeholder logo with real PNG/SVG
- [ ] Drop real product / cow / gaushala photos into `/assets/img/`
- [ ] Update product pricing if needed
- [ ] Replace Google Maps placeholder with real embed
- [ ] Confirm cow names with client
- [ ] Update OG `og:url` and canonical to the real production domain

---

## Conventions

- Mobile-first. Test 360 / 768 / 1024 / 1440.
- Tap targets ≥ 44px. Min font 14px on mobile.
- `prefers-reduced-motion` respected globally.
- Every `<img>` has meaningful `alt`. Icon buttons get `aria-label`.
- Color contrast ≥ 4.5:1 for body text. Gold reserved for ornament or large display, never body.
- Use only design tokens. No rogue hexes.

---

## License & credits

© Vaishnavi Gau Seva Gausansthan. Design and front-end build by the engagement team.
