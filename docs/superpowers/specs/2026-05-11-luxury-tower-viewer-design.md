# Luxury Tower Balcony View Simulator — POC Design Spec

## 1. Concept & Vision

A premium, zero-latency web POC that lets prospective buyers explore the 180° balcony view from different floors of a luxury tower under construction. The experience feels like standing on the actual balcony — smooth panning, zoom exploration, day/night toggle, and POI overlays that reflect real visibility from each floor. The goal is emotional impact during live pitches: customers go "wow" and want to buy.

**Tone:** Sophisticated, cinematic, premium real estate. Dark backgrounds make the panoramic images the hero.

---

## 2. Design Language

### Aesthetic Direction
Luxury property marketing meets high-end architectural visualization. Think: private jet interior, premium watch brand, luxury automotive — dark, minimal, confident.

### Color Palette
- **Primary Background:** `#151717` (near-black charcoal)
- **Primary Text/UI:** `#FFFFFF` (pure white)
- **Accent:** `#C9A84C` (muted gold — used sparingly for premium highlights)
- **Secondary Accent:** `#4A90A4` (teal-blue for POI categories)
- **Surface:** `#1E2121` (slightly lighter dark for cards/overlays)

### Typography
- **Headings:** `'Playfair Display', serif` — elegant, editorial
- **Body/UI:** `'Inter', sans-serif` — clean, modern, readable

### Spatial System
- Base unit: 8px
- Generous whitespace on landing (hero breathes)
- Viewer UI uses compact, floating overlays — never obstruct the view

### Motion Philosophy
- Landing: slow parallax background, staggered text reveal (800ms total)
- Floor selection: smooth fade + subtle scale (300ms ease-out)
- Viewer transitions: cross-fade between day/night (400ms), POI pins fade in when visible
- Pan/zoom: physics-based momentum (friction decay) for natural drag feel

### Visual Assets
- All floor images from `/assets/` (1st, 5th, 10th — day & night variants)
- Building thumbnail: `/assets/building.png`
- POI pins: CSS-rendered circles with category-colored glow

---

## 3. Layout & Structure

### Screen 1: Landing Page
- **Hero Section:** Full-viewport, animated background (slow Ken Burns zoom on building image), centered headline + subline, CTA button
- **Section below fold:** 3 floor preview cards in a row, teaser thumbnails, floor name + tagline
- **Footer:** Minimal — project name, tagline

### Screen 2: Panorama Viewer
- **Full-screen image viewport** — no chrome, image fills screen
- **Floating UI overlays** (all positioned at edges, semi-transparent dark background):
  - **Top-left:** "Back to Building" button (chevron + text)
  - **Top-right:** Day/Night toggle (sun/moon icon pair)
  - **Bottom-center:** Category filter chips (All, Transit, Nature, etc.)
  - **POI pins:** Rendered on image at fixed positions (x%, y% in image space)

### Responsive Strategy
- Desktop: Full experience as described
- Tablet: Same layout, touch-optimized pan/zoom
- Mobile: Simplified — floor cards stack vertically, viewer works with touch gestures

---

## 4. Features & Interactions

### Landing Page
- **Hero background:** Slow zoom animation (scale 1.0 → 1.05 over 15s), subtle parallax on scroll
- **CTA Button:** "Explore the View" — hover: gold border glow, click → navigate to floor selector
- **Floor Cards:** Hover lifts card (translateY -8px, shadow increase), click → enter viewer for that floor

### Panorama Viewer
- **Pan/Zoom:**
  - Mouse: drag to pan, scroll wheel to zoom (1x–4x zoom range)
  - Touch: single-finger drag to pan, pinch to zoom
  - Momentum: when released during drag, velocity decays naturally (friction coefficient 0.95)
  - Constrained: cannot pan beyond image edges at current zoom level
- **Zoom controls:** +/- buttons overlaid (bottom-right) as an alternative to scroll
- **Day/Night Toggle:**
  - Single button toggles between day/night image variant for current floor
  - Icon animates (sun ↔ moon cross-fade)
  - Transition: 400ms cross-fade between images
- **Category Filters:**
  - Chips: All | Transit | Nature | Shopping | Dining
  - Click to toggle category on/off
  - Only POIs matching enabled categories + visible from current floor are shown
- **POI Pins:**
  - Appear only if: (1) their category is active, AND (2) their visibility range includes current floor
  - Pin = 12px circle with 4px glow halo in category color
  - Hover/tap: tooltip appears with POI name and distance
- **Back to Building:**
  - Button top-left, always visible
  - Click → exit viewer, return to landing page (floor selection still highlighted)

### Edge Cases
- **Loading:** Images preload silently in background. First floor image loads eagerly on landing page entry.
- **Zoom limits:** Min 1x, max 4x. At max zoom, further scroll is ignored.
- **Pan constraints:** Cannot pan beyond the visible area — image edges are the hard limits at 1x zoom; at higher zoom, limits shift accordingly.

---

## 5. Component Inventory

### `<LandingPage />`
- **HeroSection:** Background image with Ken Burns animation, centered text block, CTA button
  - States: default (animated), loaded
- **FloorCard:**
  - Props: floor number, thumbnail, tagline
  - States: default, hover (lifted), active (pressed)
- **Footer:** Static, minimal

### `<FloorViewer />`
- **ImageViewport:** The zoomable canvas
  - States: loading (shows spinner), loaded, error (fallback gradient)
- **PanZoomController:** Handles all pan/zoom logic with momentum physics
- **BackButton:** Fixed top-left, always visible
- **DayNightToggle:** Sun/moon icon pair, animated transition
  - States: day (sun visible), night (moon visible)
- **CategoryFilterBar:** Horizontal chip list, bottom-center
  - States: chip active (white text), chip inactive (muted text)
- **POIPin:** Individual pin on the image
  - Props: position (x%, y%), category, name, visibleFloors
  - States: visible (rendered), hidden (not rendered), hovered (tooltip shown)
- **POITooltip:** Floating label on hover
  - Shows: name, category icon, floor range

### `<FloorSelector />`
- Shown on landing page below hero — 3 cards in a row
- Also accessible via Back button from viewer

---

## 6. Technical Approach

### Stack
- **React 18** (Vite for fast dev server)
- **No backend** — all static, runs on localhost
- **No external panorama library** — custom zoomable viewport as agreed

### Architecture
```
src/
├── components/
│   ├── LandingPage/
│   │   ├── HeroSection.jsx
│   │   ├── FloorCard.jsx
│   │   └── Footer.jsx
│   └── FloorViewer/
│       ├── ImageViewport.jsx
│       ├── PanZoomController.jsx
│       ├── DayNightToggle.jsx
│       ├── CategoryFilterBar.jsx
│       ├── POIPin.jsx
│       └── POITooltip.jsx
├── data/
│   └── pois.js          # Hardcoded POI data
├── hooks/
│   ├── useImagePreloader.js
│   ├── usePanZoom.js
│   └── useMomentum.js
├── App.jsx
├── main.jsx
└── index.css             # Global styles, CSS variables, animations
```

### Key Implementation Details

**Image Preloading:**
- On landing page mount, eagerly load current floor's day image
- Background-preload all other images (6 remaining: 3 floors × 2 variants)
- Track load state with a `Map<src, 'loading' | 'loaded' | 'error'>`
- Viewer always has the next likely image preloaded

**Pan/Zoom:**
- CSS `transform: translate(x, y) scale(z)` on an inner container
- State: `{ x, y, scale, velocityX, velocityY }`
- On drag: update x/y directly
- On release with velocity: `requestAnimationFrame` loop decaying velocity (×0.95 per frame)
- Pan limits calculated from image aspect ratio and current scale vs viewport size

**POI Visibility:**
```js
const isPOIVisible = (poi, currentFloor) =>
  currentFloor >= poi.visibleFromFloor &&
  currentFloor <= poi.visibleToFloor;
```

**Day/Night Toggle:**
- Toggle swaps the `imageSrc` between day and night variant for current floor
- Cross-fade via CSS opacity transition on a layered img stack

### Data Model

**POI Structure:**
```js
{
  id: 'metro-station',
  name: 'Metro Station',
  category: 'transit',         // transit | nature | shopping | dining
  x: 25,                      // % from left on image
  y: 40,                      // % from top on image
  visibleFromFloor: 1,
  visibleToFloor: 10,
}
```

**Floor Data:**
```js
{
  id: 1,
  name: '1st Floor',
  tagline: 'Street-level perspective',
  dayImage: '/assets/1st/day.png',
  nightImage: '/assets/1st/night.png',
}
```

---

## 7. Preloading Strategy (Zero Latency)

1. **On app load:** Preload `1st/day.png` (hero entry floor)
2. **On landing page render:** Spawn hidden `<img>` tags for ALL remaining images
3. **On floor card hover:** Preload that floor's day image if not already loaded
4. **On entering viewer:** All 6 images should already be loaded (or near-loaded)
5. **Day/Night switch:** Instant — image already in browser cache

No spinners should ever appear after the initial 1-2s load.

---

## 8. Performance Targets

- Landing page hero animation: 60fps
- Pan/zoom: <16ms frame time (60fps)
- Image swap on day/night toggle: instant visual (<50ms perceived)
- Time to interactive after clicking floor: <100ms (image preloaded)