# Handoff: Top Crop — Corporate Website

## Overview

This is a high-fidelity design prototype for **Top Crop**, a Tanzanian agricultural company specialising in premium bananas and sustainable palm oil. The site targets buyers, distributors, investors, and business partners globally.

The design includes:
- A multi-section marketing website (`Top Crop.html`)
- An admin dashboard prototype (`admin/dashboard.html`) for content management

---

## About the Design Files

The `.html` files in this bundle are **design references built as HTML prototypes** — they show the intended look, feel, and interactions of the final product. They are **not production code to copy directly**.

Your task is to **recreate these designs in your target codebase** using its existing framework, component library, and conventions (React, Next.js, Vue, etc.). If no codebase exists yet, Next.js + Tailwind CSS is recommended.

---

## Fidelity

**High-fidelity.** The prototypes include final colors, typography, spacing, imagery, copy, and interactions. Implement pixel-accurately using the token values documented below.

---

## Screens / Views

### 1. Main Website (`Top Crop.html`)

A single-page marketing site with anchor-linked sections. The user scrolls through all sections or uses the fixed nav to jump.

#### Nav
- Fixed, full-width, `z-index: 1000`
- Transparent on load → frosted glass on scroll (`background: rgba(9,31,16,0.95)`, `backdrop-filter: blur(14px)`, `border-bottom: 1px solid var(--border)`)
- Transition: `all 0.35s ease`
- **Logo**: "TOP CROP" in Playfair Display 19px/700, + "Tanzania" label in 8px/0.35em tracking, color `--accent`
- **Nav links**: 12.5px, `color: --fg-muted`, hover → `--fg`, transition 0.2s
- **CTA button** "Contact": banana yellow `#f5c800`, `color: #1a1100`, 9px 22px padding, 2px border-radius, 11.5px/500/0.07em uppercase. Hover: `#ffd400` + `translateY(-2px) scale(1.025)` + `box-shadow: 0 8px 28px rgba(245,196,0,0.38)`

#### Hero (3 variants — implement the "Bold" variant as default)

**Bold variant** (default):
- `min-height: 100vh`, flexbox centered, `padding-top: 80px`
- Radial glow: `radial-gradient(ellipse 60% 60% at 75% 50%, rgba(125,214,58,0.07), transparent 70%)`
- Right side: two stacked photo panels, `width: 38%`, absolute positioned
- Headline: Playfair Display, `clamp(44px, 6vw, 84px)`, weight 700, `line-height: 1.05`, `letter-spacing: -0.015em`
- Italic accent word in `color: --accent`
- Body: 17px, `color: --fg-muted`, `line-height: 1.85`, `max-width: 480px`
- Two buttons: primary banana yellow (see tokens), secondary ghost with `border: 1px solid rgba(255,255,255,0.2)`, hover → `border-color: --accent`
- Fade-in animation on load: `opacity 0→1`, `translateY(22px→0)`, 0.75s ease; second element delayed 180ms

**Split variant**: 50/50 grid, left = text, right = full-height photo
**Minimal variant**: Centered text, oversized headline `clamp(52px, 8vw, 110px)` weight 400, vertical line decoration below

#### Stats Bar
- Background: `--bg-sub`, top/bottom borders `--border`, `padding: 52px 0`
- 4-column grid, dividers between columns
- Animated counters: count up over 1.6s on scroll-into-view
- Value: 46px Playfair Display 600, `color: --accent`
- Label: 10.5px, `color: --fg-muted`, 0.12em tracking, uppercase
- Values: `5000+` ha cultivated, `12K+` tonnes exported, `30+` global partners, `800+` local employees

#### About
- `padding: 120px 0`
- 2-column grid: `1fr 1fr`, `gap: 88px`
- Left: label, h2 `clamp(28px, 3.5vw, 50px)` 600, two paragraphs 16px `--fg-muted` `line-height: 1.85`, three stat badges (Founded 2024, ISO 9001, 3 Regions)
- Right: photo mosaic — 2-column grid: one tall left photo (portrait), two landscape photos stacked right, `gap: 8px`
- FadeIn on scroll, right delayed 160ms

#### Products
- Background: `--bg-sub`, `padding: 120px 0`
- Tab toggle (Bananas / Palm Oil): bordered container, active tab = banana yellow bg + dark text
- 2-column grid: `1fr 1fr`, `gap: 72px`; left = photo `aspect-ratio: 5/4`, right = specs
- Latin name: 13px italic `--fg-muted`
- Spec rows: `grid-template-columns: 148px 1fr`; label 11px uppercase `--fg-muted`, value 14px `--fg`
- "Request Samples" button: outlined `border: 1px solid --accent`, `color: --accent`; hover → fill banana yellow
- Tab switch is client-side state, no page reload

#### Sustainability
- `padding: 120px 0`, 2-column `1fr 1.4fr`, `gap: 88px`
- Left: label, h2, body text, photo `aspect-ratio: 4/3`
- Right: 3 pillars, each with icon glyph (`◈ ◉ ◎`) in `--accent`, h4 21px 600, body 15px `--fg-muted`; separated by `border-bottom: 1px solid --border`

#### Gallery
- Background: `--bg-sub`, `padding: 120px 0`
- 3-column grid, `gap: 8px`
- Wide images: `gridColumn: span 2`, `aspect-ratio: 16/7`
- Regular images: `aspect-ratio: 4/3`
- Photos have `overflow: hidden` wrapper; on hover image scales to `scale(1.04)`, `transition: transform 0.5s ease`

#### News
- `padding: 120px 0`
- 3-column grid of article cards, `gap: 1px`, `background: --border` (creates hairline gaps)
- Each card: `background: --bg`, `padding: 40px 36px`; hover → `--bg-sub`
- Category: 9.5px `--accent` uppercase; date: 11px `--fg-muted`; title: 20px Playfair 600; body: 14px `--fg-muted` 1.8 line-height; "Read More →" 12px `--accent`

#### Careers
- Background: `--bg-sub`, `padding: 120px 0`
- 2-column `1fr 1.6fr`, `gap: 88px`
- Right: stacked job rows with `gap: 1px` / `background: --border`; each row `padding: 28px 32px`, flex space-between; hover → `--bg-card`
- Arrow `→` in `--accent` on right

#### Contact
- `padding: 120px 0`
- 2-column `1fr 1fr`, `gap: 88px`
- Left: label, h2, body, contact details list (key 80px wide, uppercase 10px `--accent`, value 15px `--fg-muted`)
- Right: form with Name, Email, Role (select), Message; submit = banana yellow full-width button
- On submit: show success state with checkmark circle `border: 1px solid --accent`

#### Footer
- Background: `--bg-sub`, `border-top: 1px solid --border`, `padding: 64px 0 40px`
- 4-column grid: `2fr 1fr 1fr 1fr`
- Logo + tagline left, three link columns right
- Bottom bar: copyright left, TIN right, separated by `border-top`

---

### 2. Admin Dashboard (`admin/dashboard.html`)

A protected content management interface. Access is gated by `sessionStorage` — redirect to `login.html` if not authenticated.

#### Layout
- 2-column: sidebar `220px` fixed + scrollable main
- Sidebar: white, `border-right: 1px solid #e4ede0`
  - Logo at top, nav items (Content, Photos, News, Careers, Settings), footer with "View Website" link + "Sign out"
  - Active nav item: `background: #eef8e8`, `color: #2b8c30`
- Main: `padding: 40px 48px`, `max-width: 860px`

#### Sections

**Content** — Edit text for Hero, About, Products, Sustainability via labeled textareas. Auto-save to `localStorage` key `tc_content`.

**Photos** — 2-column grid of photo slots (16 total). Each slot: dashed upload area or preview with ×-delete button. Photos stored as base64 in `localStorage`.

**News** — List of articles with Edit/Delete per row. "+ Add Article" button opens inline form with Date, Category, Title, Body fields.

**Careers** — List of open positions with Edit/Delete. "+ Add Position" opens inline form with Title, Location, Type (select).

**Settings** — Simple form: Email, Phone, HQ address, Processing facility address.

**Save & Publish** button (banana yellow, top-right): calls `localStorage.setItem('tc_content', JSON.stringify(data))`. Show "✓ Saved" confirmation for 2.5s.

---

### 3. Login Page (`login.html` — to be implemented)

Simple centered login screen:
- Logo + "Admin Panel" label
- Email and password fields
- "Sign in" banana yellow button
- On success: `sessionStorage.setItem('tc_admin', '1')`, redirect to `admin/dashboard.html`
- Hardcoded credentials acceptable for prototype: `admin@topcrop.tz` / `topcrop2024`

---

## Interactions & Behavior

| Interaction | Detail |
|---|---|
| Scroll-triggered fade-in | `IntersectionObserver`, threshold 0.08; `opacity 0→1` + `translateY(22px→0)`, 0.75s ease; staggered delays per section |
| Stat counters | Count from 0 to target over 1.6s on first scroll-into-view, `requestAnimationFrame` |
| Nav transparency | Transparent → frosted on `scrollY > 50`, 0.35s ease |
| Product tab switch | Client state toggle, no animation needed |
| Photo hover zoom | `transform: scale(1.04)`, `transition: 0.5s ease`, contained by `overflow: hidden` wrapper |
| News card hover | `background` swap `--bg` → `--bg-sub` |
| Contact form | Controlled form, on submit show success state (no real API) |
| Banana button hover | `#ffd400` + `translateY(-2px) scale(1.025)` + yellow glow shadow |

---

## Design Tokens

### Colors (Dark Forest theme — default)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#091f10` | Page background |
| `--bg-card` | `#0d2717` | Card backgrounds |
| `--bg-sub` | `#112e1c` | Alternating section bg |
| `--fg` | `#edf8ed` | Primary text |
| `--fg-muted` | `#6aab7a` | Secondary text, body copy |
| `--accent` | `#7ed63a` | Green accent — labels, icons, borders |
| `--accent2` | `#f2c040` | (secondary, rarely used) |
| `--border` | `rgba(255,255,255,0.07)` | Dividers, card borders |
| Banana yellow | `#f5c800` | All CTA buttons |
| Banana hover | `#ffd400` | Button hover state |
| Button text | `#1a1100` | Text on banana yellow buttons |

### Alternative themes (implement as CSS variable swaps)

**Light Meadow**: `--bg: #f0f9eb`, `--fg: #0a2014`, `--accent: #2b8c30`
**Earth Tones**: `--bg: #14100a`, `--fg: #f5ece0`, `--accent: #c6d638`

### Typography

| Role | Family | Size | Weight | Tracking |
|---|---|---|---|---|
| Display / H1 | Playfair Display | clamp(44px, 6vw, 84px) | 700 | -0.015em |
| H2 | Playfair Display | clamp(28px, 3.5vw, 50px) | 600 | — |
| H3 | Playfair Display | 38px | 600 | — |
| H4 | Playfair Display | 21px | 600 | — |
| Body | DM Sans | 15–17px | 400 | — |
| Label | DM Sans | 10px | 500 | 0.22em |
| Nav links | DM Sans | 12.5px | 400 | 0.04em |
| Button | DM Sans | 11.5–12px | 500 | 0.07–0.1em |

Google Fonts import:
```
Playfair Display: 400, 400i, 600, 600i, 700
DM Sans: 300, 400, 500 (opsz 9..40)
```

### Spacing

| Usage | Value |
|---|---|
| Section padding | `120px 0` |
| Container max-width | `1240px` |
| Container side padding | `56px` |
| Card padding | `28–40px` |
| Grid gap (main 2-col) | `72–88px` |
| Grid gap (gallery) | `8px` |

### Borders & Radius

| Usage | Value |
|---|---|
| Buttons | `border-radius: 2px` |
| Cards | `border-radius: 4px` (admin), `2px` (site) |
| All borders | `1px solid var(--border)` |
| No shadows on site | — |

---

## Assets

All photos are sourced from **Unsplash** (free to use). For production, replace with Top Crop's own photography. Photo URLs are embedded in the HTML prototype — see the `PHOTOS` map in `Top Crop.html` for all 16 image slots and their Unsplash IDs.

No icon library is used — decorative glyphs (`◈ ◉ ◎`) are Unicode characters. SVG icons in the admin panel are inline.

---

## Files in This Package

| File | Description |
|---|---|
| `Top Crop.html` | Full marketing website prototype (single file, self-contained) |
| `admin/dashboard.html` | Admin dashboard prototype (requires sessionStorage auth token) |
| `README.md` | This document |

**Not yet implemented (needed for production):**
- `login.html` — Admin login page
- Real backend / CMS integration
- Mobile responsive styles (currently desktop-only, min ~1200px)
- Form submission backend (contact form currently client-only)

---

## Notes for the Developer

1. **Mobile responsiveness** is not implemented in the prototype. All layouts are desktop-first. A full mobile pass is needed — nav collapses to burger menu, all 2-column grids become single-column, font sizes reduce.

2. **Content persistence** in the admin dashboard uses `localStorage` as a stand-in. In production, connect to a real CMS (Contentful, Sanity, or a custom API).

3. **Auth** is `sessionStorage`-only in the prototype. Replace with a real auth system.

4. **Scroll animations** use `IntersectionObserver`. These can be replaced with Framer Motion or any animation library of choice — the visual result should match (fade up, staggered delays).
