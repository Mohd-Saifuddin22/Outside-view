# Luxury Tower Balcony View Simulator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, zero-latency React web app that simulates a 180° balcony view from different floors of a luxury tower, with day/night toggle, POI filters, and smooth pan/zoom exploration.

**Architecture:** React 18 + Vite, custom zoomable viewport (CSS transforms + momentum physics), all images preloaded at startup, no backend.

**Tech Stack:** React 18, Vite, CSS custom properties, no external panorama library.

---

## File Structure

```
E:\Projects\outside_view\
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/
│   │   ├── floors.js          # Floor definitions (id, name, tagline, image paths)
│   │   └── pois.js            # Hardcoded POI data with visibility ranges
│   ├── hooks/
│   │   ├── useImagePreloader.js   # Preload all images on mount
│   │   ├── usePanZoom.js          # Pan/zoom state + momentum physics
│   │   └── useMomentum.js         # Velocity-based drag momentum
│   └── components/
│       ├── LandingPage/
│       │   ├── LandingPage.jsx    # Container — hero + floor cards + footer
│       │   ├── HeroSection.jsx    # Animated hero with Ken Burns effect
│       │   ├── FloorCard.jsx     # Individual floor card component
│       │   └── Footer.jsx        # Minimal footer
│       └── FloorViewer/
│           ├── FloorViewer.jsx    # Container — manages viewer state
│           ├── ImageViewport.jsx  # Zoomable image canvas
│           ├── DayNightToggle.jsx # Sun/moon toggle button
│           ├── CategoryFilterBar.jsx # Filter chips
│           ├── POIPin.jsx         # Individual POI pin with tooltip
│           └── BackButton.jsx    # "Back to Building" button
├── assets/
│   ├── building.png
│   ├── 1st/day.png
│   ├── 1st/night.png
│   ├── 5th/day.png
│   ├── 5th/night.png
│   ├── 10th/day.png
│   └── 10th/night.png
└── docs/superpowers/specs/2026-05-11-luxury-tower-viewer-design.md
```

---

## Task 1: Project Scaffolding

**Goal:** Create the Vite + React project structure with all config files.

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "luxury-tower-viewer",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
});
```

- [ ] **Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Luxury Tower — Balcony View Simulator</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create src/main.jsx**

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`
Expected: node_modules created, vite and react packages installed

- [ ] **Step 6: Commit**

```bash
git add package.json vite.config.js index.html src/main.jsx
git commit -m "feat: scaffold Vite + React project

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 2: Global Styles & CSS Variables

**Goal:** Set up CSS custom properties, base styles, animations, and typography.

**Files:**
- Create: `src/index.css`

- [ ] **Step 1: Create src/index.css**

```css
/* ===== CSS Custom Properties ===== */
:root {
  /* Colors */
  --color-bg: #151717;
  --color-surface: #1E2121;
  --color-white: #FFFFFF;
  --color-gold: #C9A84C;
  --color-teal: #4A90A4;

  /* Category colors */
  --color-transit: #4A90A4;
  --color-nature: #5BA87A;
  --color-shopping: #A87BA8;
  --color-dining: #A87B4A;

  /* Typography */
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', -apple-system, sans-serif;

  /* Spacing */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 48px;
  --space-6: 64px;
  --space-7: 96px;

  /* Transitions */
  --transition-fast: 200ms ease-out;
  --transition-medium: 400ms ease-out;
  --transition-slow: 800ms ease-out;

  /* Shadows */
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
  --shadow-card-hover: 0 16px 48px rgba(0, 0, 0, 0.6);
  --shadow-glow: 0 0 20px rgba(201, 168, 76, 0.3);
}

/* ===== Reset & Base ===== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-bg);
  color: var(--color-white);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

img {
  max-width: 100%;
  display: block;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
}

/* ===== Typography ===== */
h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: 600;
  line-height: 1.2;
}

/* ===== Utility Classes ===== */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ===== Animations ===== */
@keyframes kenBurns {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ===== Scrollbar ===== */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--color-surface);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-gold);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "feat: add global styles, CSS variables, animations, typography

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 3: Data — Floors & POIs

**Goal:** Define the floor data and POI definitions that drive the entire app.

**Files:**
- Create: `src/data/floors.js`
- Create: `src/data/pois.js`

- [ ] **Step 1: Create src/data/floors.js**

```js
export const floors = [
  {
    id: 1,
    name: '1st Floor',
    tagline: 'Street-level perspective',
    dayImage: '/assets/1st/day.png',
    nightImage: '/assets/1st/night.png',
  },
  {
    id: 5,
    name: '5th Floor',
    tagline: 'Elevated neighborhood view',
    dayImage: '/assets/5th/day.png',
    nightImage: '/assets/5th/night.png',
  },
  {
    id: 10,
    name: '10th Floor',
    tagline: 'Panoramic skyline vista',
    dayImage: '/assets/10th/day.png',
    nightImage: '/assets/10th/night.png',
  },
];
```

- [ ] **Step 2: Create src/data/pois.js**

```js
export const categories = ['all', 'transit', 'nature', 'shopping', 'dining'];

export const pois = [
  {
    id: 'metro-station',
    name: 'Metro Station',
    category: 'transit',
    x: 25,  // % from left of image
    y: 40,  // % from top of image
    visibleFromFloor: 1,
    visibleToFloor: 10,
  },
  {
    id: 'central-park',
    name: 'Central Park',
    category: 'nature',
    x: 60,
    y: 30,
    visibleFromFloor: 3,
    visibleToFloor: 10,
  },
  {
    id: 'shopping-mall',
    name: 'Luxury Mall',
    category: 'shopping',
    x: 45,
    y: 55,
    visibleFromFloor: 1,
    visibleToFloor: 8,
  },
  {
    id: 'fine-dining',
    name: 'Fine Dining Restaurant',
    category: 'dining',
    x: 75,
    y: 45,
    visibleFromFloor: 1,
    visibleToFloor: 10,
  },
  {
    id: 'bus-stop',
    name: 'Bus Terminal',
    category: 'transit',
    x: 15,
    y: 60,
    visibleFromFloor: 1,
    visibleToFloor: 6,
  },
  {
    id: 'garden',
    name: 'Rooftop Garden',
    category: 'nature',
    x: 80,
    y: 25,
    visibleFromFloor: 5,
    visibleToFloor: 10,
  },
];
```

- [ ] **Step 3: Commit**

```bash
git add src/data/floors.js src/data/pois.js
git commit -m "feat: add floors and POIs data definitions

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 4: Hooks — Image Preloader

**Goal:** Preload all 6 panoramic images on app mount so the viewer never shows a loading spinner.

**Files:**
- Create: `src/hooks/useImagePreloader.js`

- [ ] **Step 1: Create src/hooks/useImagePreloader.js**

```js
import { useState, useEffect } from 'react';

export function useImagePreloader(imagePaths) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount] = useState(imagePaths.length);

  useEffect(() => {
    let cancelled = false;

    imagePaths.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (!cancelled) {
          setLoadedCount((prev) => prev + 1);
        }
      };
      img.onerror = () => {
        if (!cancelled) {
          setLoadedCount((prev) => prev + 1);
        }
      };
    });

    return () => {
      cancelled = true;
    };
  }, [imagePaths]);

  return {
    loadedCount,
    totalCount,
    isAllLoaded: loadedCount >= totalCount,
    progress: totalCount > 0 ? loadedCount / totalCount : 1,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useImagePreloader.js
git commit -m "feat: add useImagePreloader hook

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 5: Hooks — Pan/Zoom with Momentum

**Goal:** Core viewport interaction — drag to pan, scroll/pinch to zoom, momentum physics when released.

**Files:**
- Create: `src/hooks/usePanZoom.js`
- Create: `src/hooks/useMomentum.js`

- [ ] **Step 1: Create src/hooks/useMomentum.js**

```js
import { useRef, useCallback } from 'react';

export function useMomentum(initialVelocity = 0) {
  const velocityRef = useRef({ x: initialVelocity, y: initialVelocity });
  const isActiveRef = useRef(false);

  const setVelocity = useCallback((vx, vy) => {
    velocityRef.current = { x: vx, y: vy };
  }, []);

  const stop = useCallback(() => {
    isActiveRef.current = false;
  }, []);

  const start = useCallback(() => {
    isActiveRef.current = true;
  }, []);

  return { velocityRef, isActiveRef, setVelocity, start, stop };
}
```

- [ ] **Step 2: Create src/hooks/usePanZoom.js**

```js
import { useState, useRef, useCallback, useEffect } from 'react';

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const MOMENTUM_FRICTION = 0.92;
const MOMENTUM_THRESHOLD = 0.5;

export function usePanZoom(viewportWidth, viewportHeight, imageWidth, imageHeight) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const animationFrame = useRef(null);

  // Calculate pan limits based on current scale
  const getLimits = useCallback(
    (scale) => {
      const scaledWidth = imageWidth * scale;
      const scaledHeight = imageHeight * scale;
      const maxX = Math.max(0, (scaledWidth - viewportWidth) / 2);
      const maxY = Math.max(0, (scaledHeight - viewportHeight) / 2);
      return { maxX, maxY };
    },
    [imageWidth, imageHeight, viewportWidth, viewportHeight]
  );

  // Clamp value between min and max
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // Apply transform with limits
  const applyTransform = useCallback(
    (x, y, scale) => {
      const { maxX, maxY } = getLimits(scale);
      const clampedX = clamp(x, -maxX, maxX);
      const clampedY = clamp(y, -maxY, maxY);
      setTransform({ x: clampedX, y: clampedY, scale });
    },
    [getLimits]
  );

  // Start momentum animation
  const startMomentum = useCallback(() => {
    const animate = () => {
      velocity.current.x *= MOMENTUM_FRICTION;
      velocity.current.y *= MOMENTUM_FRICTION;

      if (
        Math.abs(velocity.current.x) < MOMENTUM_THRESHOLD &&
        Math.abs(velocity.current.y) < MOMENTUM_THRESHOLD
      ) {
        return;
      }

      const newX = transform.x + velocity.current.x;
      const newY = transform.y + velocity.current.y;
      applyTransform(newX, newY, transform.scale);

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);
  }, [transform, applyTransform]);

  // Stop momentum
  const stopMomentum = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  }, []);

  // Mouse/touch event handlers
  const onPointerDown = useCallback(
    (clientX, clientY) => {
      stopMomentum();
      isDragging.current = true;
      lastPosition.current = { x: clientX, y: clientY };
      velocity.current = { x: 0, y: 0 };
    },
    [stopMomentum]
  );

  const onPointerMove = useCallback(
    (clientX, clientY) => {
      if (!isDragging.current) return;

      const deltaX = clientX - lastPosition.current.x;
      const deltaY = clientY - lastPosition.current.y;

      velocity.current = { x: deltaX, y: deltaY };
      lastPosition.current = { x: clientX, y: clientY };

      const newX = transform.x + deltaX;
      const newY = transform.y + deltaY;
      applyTransform(newX, newY, transform.scale);
    },
    [transform, applyTransform]
  );

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const speed = Math.sqrt(
      velocity.current.x ** 2 + velocity.current.y ** 2
    );
    if (speed > MOMENTUM_THRESHOLD) {
      startMomentum();
    }
  }, [startMomentum]);

  // Zoom handlers
  const onZoom = useCallback(
    (delta, centerX, centerY) => {
      stopMomentum();

      const newScale = clamp(transform.scale + delta, MIN_SCALE, MAX_SCALE);

      // Zoom towards the center point
      const scaleRatio = newScale / transform.scale;
      const newX = centerX - (centerX - transform.x) * scaleRatio;
      const newY = centerY - (centerY - transform.y) * scaleRatio;

      applyTransform(newX, newY, newScale);
    },
    [transform, applyTransform, stopMomentum]
  );

  // Reset to center
  const reset = useCallback(() => {
    stopMomentum();
    applyTransform(0, 0, 1);
  }, [applyTransform, stopMomentum]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return {
    transform,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onZoom },
    reset,
    isDragging: isDragging.current,
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useMomentum.js src/hooks/usePanZoom.js
git commit -m "feat: add useMomentum and usePanZoom hooks with physics

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 6: Landing Page — HeroSection

**Goal:** Full-viewport animated hero with Ken Burns background effect and premium typography.

**Files:**
- Create: `src/components/LandingPage/HeroSection.jsx`
- Modify: `src/components/LandingPage/LandingPage.jsx` (create container)

- [ ] **Step 1: Create src/components/LandingPage/HeroSection.jsx**

```jsx
import './HeroSection.css';

export function HeroSection({ onExplore }) {
  return (
    <section className="hero">
      <div className="hero__background">
        <img
          src="/assets/building.png"
          alt="Luxury Tower"
          className="hero__background-image"
        />
        <div className="hero__overlay" />
      </div>

      <div className="hero__content">
        <p className="hero__tagline">Experience the View Before It's Built</p>
        <h1 className="hero__title">
          Your Future Home
          <br />
          <span className="hero__title-accent">Awaits You</span>
        </h1>
        <p className="hero__subtitle">
          Explore breathtaking panoramic views from each floor.
          <br />
          Day and night. Every detail. Every horizon.
        </p>
        <button className="hero__cta" onClick={onExplore}>
          <span>Explore the View</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="hero__scroll-indicator">
        <span>Scroll to explore</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14M5 12l7 7 7-7"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create src/components/LandingPage/HeroSection.css**

```css
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero__background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: kenBurns 20s ease-out forwards;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(21, 23, 23, 0.4) 0%,
    rgba(21, 23, 23, 0.6) 50%,
    rgba(21, 23, 23, 0.9) 100%
  );
}

.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 700px;
  padding: 0 var(--space-4);
}

.hero__tagline {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: var(--space-3);
  animation: fadeInUp 800ms ease-out 200ms both;
}

.hero__title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: var(--space-3);
  animation: fadeInUp 800ms ease-out 400ms both;
}

.hero__title-accent {
  font-style: italic;
  color: var(--color-gold);
}

.hero__subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  margin-bottom: var(--space-5);
  animation: fadeInUp 800ms ease-out 600ms both;
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-bg);
  background: var(--color-white);
  border: 2px solid transparent;
  transition: all var(--transition-medium);
  animation: fadeInUp 800ms ease-out 800ms both;
}

.hero__cta:hover {
  background: transparent;
  color: var(--color-white);
  border-color: var(--color-gold);
  box-shadow: var(--shadow-glow);
}

.hero__cta svg {
  transition: transform var(--transition-fast);
}

.hero__cta:hover svg {
  transform: translateX(4px);
}

.hero__scroll-indicator {
  position: absolute;
  bottom: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  animation: fadeIn 1s ease-out 1.2s both;
}

.hero__scroll-indicator svg {
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/LandingPage/HeroSection.jsx src/components/LandingPage/HeroSection.css
git commit -m "feat: add HeroSection with Ken Burns animation

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 7: Landing Page — FloorCard

**Goal:** Individual floor selection card with hover effect.

**Files:**
- Create: `src/components/LandingPage/FloorCard.jsx`
- Create: `src/components/LandingPage/FloorCard.css`

- [ ] **Step 1: Create src/components/LandingPage/FloorCard.jsx**

```jsx
import './FloorCard.css';

export function FloorCard({ floor, onClick, thumbnail }) {
  return (
    <button className="floor-card" onClick={() => onClick(floor)}>
      <div className="floor-card__image-container">
        <img
          src={thumbnail}
          alt={`${floor.name} view`}
          className="floor-card__image"
        />
        <div className="floor-card__image-overlay" />
      </div>
      <div className="floor-card__content">
        <span className="floor-card__label">Floor</span>
        <h3 className="floor-card__title">{floor.name}</h3>
        <p className="floor-card__tagline">{floor.tagline}</p>
      </div>
      <div className="floor-card__arrow">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Create src/components/LandingPage/FloorCard.css**

```css
.floor-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all var(--transition-medium);
  overflow: hidden;
  text-align: left;
  width: 100%;
}

.floor-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-card-hover);
  border-color: rgba(201, 168, 76, 0.3);
}

.floor-card__image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.floor-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.floor-card:hover .floor-card__image {
  transform: scale(1.05);
}

.floor-card__image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(21, 23, 23, 0.8) 0%,
    transparent 50%
  );
}

.floor-card__content {
  padding: var(--space-3);
}

.floor-card__label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: var(--space-1);
}

.floor-card__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-white);
  margin-bottom: var(--space-1);
}

.floor-card__tagline {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
}

.floor-card__arrow {
  position: absolute;
  bottom: var(--space-3);
  right: var(--space-3);
  color: var(--color-gold);
  opacity: 0;
  transform: translateX(-10px);
  transition: all var(--transition-fast);
}

.floor-card:hover .floor-card__arrow {
  opacity: 1;
  transform: translateX(0);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/LandingPage/FloorCard.jsx src/components/LandingPage/FloorCard.css
git commit -m "feat: add FloorCard component with hover effect

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 8: Landing Page — Footer

**Goal:** Minimal footer component.

**Files:**
- Create: `src/components/LandingPage/Footer.jsx`
- Create: `src/components/LandingPage/Footer.css`

- [ ] **Step 1: Create src/components/LandingPage/Footer.jsx**

```jsx
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <span className="footer__brand">Luxury Tower</span>
        <span className="footer__divider" />
        <span className="footer__tagline">Balcony View Simulator</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Create src/components/LandingPage/Footer.css**

```css
.footer {
  padding: var(--space-5) var(--space-4);
  background: var(--color-surface);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer__content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
}

.footer__brand {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-white);
}

.footer__divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
}

.footer__tagline {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/LandingPage/Footer.jsx src/components/LandingPage/Footer.css
git commit -m "feat: add Footer component

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 9: Landing Page — Container & Floor Selector Section

**Goal:** Assemble the full landing page with hero + floor cards section + footer.

**Files:**
- Create: `src/components/LandingPage/LandingPage.jsx`
- Create: `src/components/LandingPage/LandingPage.css`

- [ ] **Step 1: Create src/components/LandingPage/LandingPage.jsx**

```jsx
import { useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { FloorCard } from './FloorCard';
import { Footer } from './Footer';
import { floors } from '../../data/floors';
import './LandingPage.css';

export function LandingPage({ onSelectFloor }) {
  // Scroll to floor section when CTA is clicked
  const handleExplore = () => {
    const section = document.getElementById('floor-selector');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      <HeroSection onExplore={handleExplore} />

      <section id="floor-selector" className="floor-selector">
        <div className="floor-selector__header">
          <h2 className="floor-selector__title">Choose Your View</h2>
          <p className="floor-selector__subtitle">
            Select a floor to experience its unique perspective
          </p>
        </div>

        <div className="floor-selector__grid">
          {floors.map((floor, index) => (
            <div
              key={floor.id}
              className="floor-selector__card-wrapper"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <FloorCard
                floor={floor}
                thumbnail={floor.dayImage}
                onClick={onSelectFloor}
              />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Create src/components/LandingPage/LandingPage.css**

```css
.landing-page {
  min-height: 100vh;
}

/* ===== Floor Selector Section ===== */
.floor-selector {
  padding: var(--space-7) var(--space-4);
  background: var(--color-bg);
}

.floor-selector__header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.floor-selector__title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: var(--space-2);
}

.floor-selector__subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.6);
}

.floor-selector__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  max-width: 1200px;
  margin: 0 auto;
}

.floor-selector__card-wrapper {
  animation: fadeInUp 600ms ease-out both;
}

@media (max-width: 900px) {
  .floor-selector__grid {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
}

@media (min-width: 901px) and (max-width: 1200px) {
  .floor-selector__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/LandingPage/LandingPage.jsx src/components/LandingPage/LandingPage.css
git commit -m "feat: add LandingPage container with floor selector

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 10: Floor Viewer — ImageViewport

**Goal:** The zoomable image canvas with pan/zoom/momentum.

**Files:**
- Create: `src/components/FloorViewer/ImageViewport.jsx`
- Create: `src/components/FloorViewer/ImageViewport.css`

- [ ] **Step 1: Create src/components/FloorViewer/ImageViewport.jsx**

```jsx
import { useRef, useState, useEffect, useCallback } from 'react';
import { usePanZoom } from '../../hooks/usePanZoom';
import './ImageViewport.css';

export function ImageViewport({ imageSrc, children }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Get natural image dimensions
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageDimensions({ width: naturalWidth, height: naturalHeight });
    setIsLoaded(true);
  };

  const { transform, handlers, reset } = usePanZoom(
    dimensions.width,
    dimensions.height,
    imageDimensions.width || dimensions.width,
    imageDimensions.height || dimensions.height
  );

  // Wheel zoom handler
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = e.clientX - rect.left - dimensions.width / 2;
      const centerY = e.clientY - rect.top - dimensions.height / 2;
      handlers.onZoom(delta, centerX, centerY);
    },
    [handlers, dimensions]
  );

  // Touch handlers for pinch zoom
  const lastTouchDistance = useRef(0);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDistance.current = Math.sqrt(dx * dx + dy * dy);
    } else if (e.touches.length === 1) {
      handlers.onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const delta = (distance - lastTouchDistance.current) * 0.01;
      lastTouchDistance.current = distance;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left - dimensions.width / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top - dimensions.height / 2;
      handlers.onZoom(delta, centerX, centerY);
    } else if (e.touches.length === 1) {
      handlers.onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    handlers.onPointerUp();
  };

  return (
    <div className="image-viewport" ref={containerRef}>
      {!isLoaded && (
        <div className="image-viewport__loading">
          <div className="image-viewport__spinner" />
        </div>
      )}
      <div
        className={`image-viewport__image-container ${isLoaded ? 'loaded' : ''}`}
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        }}
        onMouseDown={(e) => handlers.onPointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlers.onPointerMove(e.clientX, e.clientY)}
        onMouseUp={handlers.onPointerUp}
        onMouseLeave={handlers.onPointerUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={imageSrc}
          alt="Panoramic view"
          className="image-viewport__image"
          onLoad={handleImageLoad}
          draggable={false}
        />
        <div className="image-viewport__pois">{children}</div>
      </div>
      <div className="image-viewport__controls">
        <button className="image-viewport__btn" onClick={() => handlers.onZoom(0.5, 0, 0)} aria-label="Zoom in">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
          </svg>
        </button>
        <button className="image-viewport__btn" onClick={() => handlers.onZoom(-0.5, 0, 0)} aria-label="Zoom out">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35M8 11h6" />
          </svg>
        </button>
        <button className="image-viewport__btn" onClick={reset} aria-label="Reset view">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create src/components/FloorViewer/ImageViewport.css**

```css
.image-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--color-bg);
  cursor: grab;
  user-select: none;
}

.image-viewport:active {
  cursor: grabbing;
}

.image-viewport__loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.image-viewport__spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--color-surface);
  border-top-color: var(--color-gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.image-viewport__image-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 400ms ease-out;
  opacity: 0;
}

.image-viewport__image-container.loaded {
  opacity: 1;
}

.image-viewport__image {
  max-width: none;
  max-height: none;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

.image-viewport__pois {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.image-viewport__controls {
  position: absolute;
  bottom: 100px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  z-index: 20;
}

.image-viewport__btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 33, 33, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  transition: all var(--transition-fast);
}

.image-viewport__btn:hover {
  background: var(--color-surface);
  border-color: var(--color-gold);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FloorViewer/ImageViewport.jsx src/components/FloorViewer/ImageViewport.css
git commit -m "feat: add ImageViewport with pan/zoom/momentum

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 11: Floor Viewer — POIPin & POITooltip

**Goal:** Individual POI pin component with tooltip on hover.

**Files:**
- Create: `src/components/FloorViewer/POIPin.jsx`
- Create: `src/components/FloorViewer/POIPin.css`

- [ ] **Step 1: Create src/components/FloorViewer/POIPin.jsx**

```jsx
import { useState } from 'react';
import './POIPin.css';

const categoryColors = {
  transit: 'var(--color-transit)',
  nature: 'var(--color-nature)',
  shopping: 'var(--color-shopping)',
  dining: 'var(--color-dining)',
};

export function POIPin({ poi, isVisible, onToggleCategory }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!isVisible) return null;

  const color = categoryColors[poi.category] || 'var(--color-white)';

  return (
    <div
      className="poi-pin"
      style={{
        left: `${poi.x}%`,
        top: `${poi.y}%`,
        '--poi-color': color,
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => onToggleCategory(poi.category)}
    >
      <div className="poi-pin__dot" />
      <div className="poi-pin__glow" />
      {showTooltip && (
        <div className="poi-pin__tooltip">
          <span className="poi-pin__tooltip-name">{poi.name}</span>
          <span className="poi-pin__tooltip-category">{poi.category}</span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create src/components/FloorViewer/POIPin.css**

```css
.poi-pin {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  pointer-events: auto;
}

.poi-pin__dot {
  width: 14px;
  height: 14px;
  background: var(--poi-color);
  border-radius: 50%;
  border: 2px solid var(--color-white);
  position: relative;
  z-index: 2;
}

.poi-pin__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: var(--poi-color);
  border-radius: 50%;
  opacity: 0.4;
  animation: pulse 2s ease-in-out infinite;
  z-index: 1;
}

.poi-pin__tooltip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--space-1) var(--space-2);
  white-space: nowrap;
  z-index: 100;
  animation: fadeIn 200ms ease-out;
}

.poi-pin__tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--color-surface);
}

.poi-pin__tooltip-name {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-white);
}

.poi-pin__tooltip-category {
  display: block;
  font-size: 0.75rem;
  color: var(--poi-color);
  text-transform: capitalize;
  margin-top: 2px;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FloorViewer/POIPin.jsx src/components/FloorViewer/POIPin.css
git commit -m "feat: add POIPin component with tooltip

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 12: Floor Viewer — DayNightToggle

**Goal:** Toggle button switching between day and night image variants.

**Files:**
- Create: `src/components/FloorViewer/DayNightToggle.jsx`
- Create: `src/components/FloorViewer/DayNightToggle.css`

- [ ] **Step 1: Create src/components/FloorViewer/DayNightToggle.jsx**

```jsx
import './DayNightToggle.css';

export function DayNightToggle({ isNight, onToggle }) {
  return (
    <button className="day-night-toggle" onClick={onToggle} aria-label="Toggle day/night view">
      <div className={`day-night-toggle__icons ${isNight ? 'night' : 'day'}`}>
        <svg
          className="day-night-toggle__sun"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        <svg
          className="day-night-toggle__moon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
      <span className="day-night-toggle__label">{isNight ? 'Night' : 'Day'}</span>
    </button>
  );
}
```

- [ ] **Step 2: Create src/components/FloorViewer/DayNightToggle.css**

```css
.day-night-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  background: rgba(30, 33, 33, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  transition: all var(--transition-fast);
}

.day-night-toggle:hover {
  background: var(--color-surface);
  border-color: var(--color-gold);
}

.day-night-toggle__icons {
  position: relative;
  width: 20px;
  height: 20px;
}

.day-night-toggle__sun,
.day-night-toggle__moon {
  position: absolute;
  inset: 0;
  transition: opacity var(--transition-medium), transform var(--transition-medium);
}

.day-night-toggle__icons.day .day-night-toggle__sun {
  opacity: 1;
  transform: rotate(0deg);
}

.day-night-toggle__icons.day .day-night-toggle__moon {
  opacity: 0;
  transform: rotate(90deg);
}

.day-night-toggle__icons.night .day-night-toggle__sun {
  opacity: 0;
  transform: rotate(-90deg);
}

.day-night-toggle__icons.night .day-night-toggle__moon {
  opacity: 1;
  transform: rotate(0deg);
}

.day-night-toggle__label {
  font-size: 0.875rem;
  font-weight: 500;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FloorViewer/DayNightToggle.jsx src/components/FloorViewer/DayNightToggle.css
git commit -m "feat: add DayNightToggle component

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 13: Floor Viewer — CategoryFilterBar

**Goal:** Filter chips to show/hide POI categories.

**Files:**
- Create: `src/components/FloorViewer/CategoryFilterBar.jsx`
- Create: `src/components/FloorViewer/CategoryFilterBar.css`

- [ ] **Step 1: Create src/components/FloorViewer/CategoryFilterBar.jsx**

```jsx
import { categories } from '../../data/pois';
import './CategoryFilterBar.css';

const categoryLabels = {
  all: 'All',
  transit: 'Transit',
  nature: 'Nature',
  shopping: 'Shopping',
  dining: 'Dining',
};

const categoryIcons = {
  all: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 0 20" />
    </svg>
  ),
  transit: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
    </svg>
  ),
  nature: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22V8M12 8C12 8 8 4 4 5c0 5 4 9 8 7M12 8c0 0 4-4 8-3 0 5-4 9-8 7" />
    </svg>
  ),
  shopping: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  dining: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
    </svg>
  ),
};

export function CategoryFilterBar({ activeCategories, onToggle }) {
  const isAllActive = activeCategories.includes('all');

  const handleToggle = (category) => {
    onToggle(category);
  };

  const handleAll = () => {
    onToggle('all');
  };

  return (
    <div className="category-filter-bar">
      {categories.map((category) => {
        const isActive = isAllActive || activeCategories.includes(category);
        return (
          <button
            key={category}
            className={`category-filter-bar__chip ${isActive ? 'active' : ''}`}
            onClick={() => (category === 'all' ? handleAll() : handleToggle(category))}
            data-category={category}
          >
            <span className="category-filter-bar__icon">{categoryIcons[category]}</span>
            <span className="category-filter-bar__label">{categoryLabels[category]}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create src/components/FloorViewer/CategoryFilterBar.css**

```css
.category-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  justify-content: center;
  padding: var(--space-2);
  background: rgba(30, 33, 33, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.category-filter-bar__chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.category-filter-bar__chip:hover {
  border-color: rgba(255, 255, 255, 0.4);
  color: var(--color-white);
}

.category-filter-bar__chip.active {
  background: var(--color-white);
  border-color: var(--color-white);
  color: var(--color-bg);
}

.category-filter-bar__chip[data-category="transit"].active {
  background: var(--color-transit);
  border-color: var(--color-transit);
}

.category-filter-bar__chip[data-category="nature"].active {
  background: var(--color-nature);
  border-color: var(--color-nature);
}

.category-filter-bar__chip[data-category="shopping"].active {
  background: var(--color-shopping);
  border-color: var(--color-shopping);
}

.category-filter-bar__chip[data-category="dining"].active {
  background: var(--color-dining);
  border-color: var(--color-dining);
}

.category-filter-bar__icon {
  display: flex;
  align-items: center;
}

.category-filter-bar__chip.active .category-filter-bar__icon {
  color: inherit;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FloorViewer/CategoryFilterBar.jsx src/components/FloorViewer/CategoryFilterBar.css
git commit -m "feat: add CategoryFilterBar component

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 14: Floor Viewer — BackButton

**Goal:** "Back to Building" button to return to landing page.

**Files:**
- Create: `src/components/FloorViewer/BackButton.jsx`
- Create: `src/components/FloorViewer/BackButton.css`

- [ ] **Step 1: Create src/components/FloorViewer/BackButton.jsx**

```jsx
import './BackButton.css';

export function BackButton({ onClick }) {
  return (
    <button className="back-button" onClick={onClick}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span>Back to Building</span>
    </button>
  );
}
```

- [ ] **Step 2: Create src/components/FloorViewer/BackButton.css**

```css
.back-button {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  background: rgba(30, 33, 33, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.back-button:hover {
  background: var(--color-surface);
  border-color: var(--color-gold);
}

.back-button svg {
  transition: transform var(--transition-fast);
}

.back-button:hover svg {
  transform: translateX(-3px);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FloorViewer/BackButton.jsx src/components/FloorViewer/BackButton.css
git commit -m "feat: add BackButton component

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 15: Floor Viewer — Container

**Goal:** Assemble all viewer components into the full-screen viewer experience.

**Files:**
- Create: `src/components/FloorViewer/FloorViewer.jsx`
- Create: `src/components/FloorViewer/FloorViewer.css`

- [ ] **Step 1: Create src/components/FloorViewer/FloorViewer.jsx**

```jsx
import { useState, useMemo } from 'react';
import { ImageViewport } from './ImageViewport';
import { DayNightToggle } from './DayNightToggle';
import { CategoryFilterBar } from './CategoryFilterBar';
import { POIPin } from './POIPin';
import { BackButton } from './BackButton';
import { pois } from '../../data/pois';
import './FloorViewer.css';

export function FloorViewer({ floor, onBack }) {
  const [isNight, setIsNight] = useState(false);
  const [activeCategories, setActiveCategories] = useState(['all']);

  const currentImage = isNight ? floor.nightImage : floor.dayImage;

  const handleDayNightToggle = () => {
    setIsNight((prev) => !prev);
  };

  const handleCategoryToggle = (category) => {
    if (category === 'all') {
      setActiveCategories(['all']);
      return;
    }

    setActiveCategories((prev) => {
      const withoutAll = prev.filter((c) => c !== 'all');
      if (withoutAll.includes(category)) {
        const filtered = withoutAll.filter((c) => c !== category);
        return filtered.length === 0 ? ['all'] : filtered;
      }
      return [...withoutAll, category];
    });
  };

  const isPOIVisible = (poi) => {
    const inFloorRange =
      floor.id >= poi.visibleFromFloor && floor.id <= poi.visibleToFloor;
    const inActiveCategory =
      activeCategories.includes('all') || activeCategories.includes(poi.category);
    return inFloorRange && inActiveCategory;
  };

  return (
    <div className="floor-viewer">
      <ImageViewport imageSrc={currentImage}>
        {pois.map((poi) => (
          <POIPin
            key={poi.id}
            poi={poi}
            isVisible={isPOIVisible(poi)}
            onToggleCategory={handleCategoryToggle}
          />
        ))}
      </ImageViewport>

      <div className="floor-viewer__ui">
        <div className="floor-viewer__top-bar">
          <BackButton onClick={onBack} />
          <div className="floor-viewer__floor-info">
            <span className="floor-viewer__floor-label">Viewing</span>
            <span className="floor-viewer__floor-name">{floor.name}</span>
          </div>
          <DayNightToggle isNight={isNight} onToggle={handleDayNightToggle} />
        </div>

        <div className="floor-viewer__bottom-bar">
          <CategoryFilterBar
            activeCategories={activeCategories}
            onToggle={handleCategoryToggle}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create src/components/FloorViewer/FloorViewer.css**

```css
.floor-viewer {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--color-bg);
}

.floor-viewer__ui {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 30;
}

.floor-viewer__top-bar {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  right: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: auto;
}

.floor-viewer__floor-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.floor-viewer__floor-label {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.floor-viewer__floor-name {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-white);
}

.floor-viewer__bottom-bar {
  position: absolute;
  bottom: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FloorViewer/FloorViewer.jsx src/components/FloorViewer/FloorViewer.css
git commit -m "feat: add FloorViewer container with all UI components

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 16: App.jsx — Routing Logic

**Goal:** Wire everything together — landing page vs viewer, floor selection, image preloading.

**Files:**
- Create: `src/App.jsx`
- Modify: `src/App.css` (rename from index.css routing if needed — actually we'll add global app styles here)

- [ ] **Step 1: Create src/App.jsx**

```jsx
import { useState, useMemo } from 'react';
import { LandingPage } from './components/LandingPage/LandingPage';
import { FloorViewer } from './components/FloorViewer/FloorViewer';
import { useImagePreloader } from './hooks/useImagePreloader';
import { floors } from './data/floors';
import './App.css';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'viewer'
  const [selectedFloor, setSelectedFloor] = useState(null);

  // Collect all image paths for preloading
  const allImagePaths = useMemo(() => {
    return floors.flatMap((floor) => [floor.dayImage, floor.nightImage]);
  }, []);

  // Preload all images
  const { progress } = useImagePreloader(allImagePaths);

  const handleSelectFloor = (floor) => {
    setSelectedFloor(floor);
    setView('viewer');
  };

  const handleBack = () => {
    setView('landing');
  };

  if (view === 'viewer' && selectedFloor) {
    return <FloorViewer floor={selectedFloor} onBack={handleBack} />;
  }

  return <LandingPage onSelectFloor={handleSelectFloor} />;
}

export default App;
```

- [ ] **Step 2: Create src/App.css**

```css
.app {
  min-height: 100vh;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx src/App.css
git commit -m "feat: add App.jsx with view routing

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 17: Move Assets & Verify Structure

**Goal:** Ensure the assets folder structure is correct and images are served properly.

**Files:**
- Check: `assets/` directory structure

- [ ] **Step 1: Verify assets structure**

The following structure must exist:
```
assets/
├── building.png
├── 1st/
│   ├── day.png
│   └── night.png
├── 5th/
│   ├── day.png
│   └── night.png
└── 10th/
    ├── day.png
    └── night.png
```

If Vite needs the assets to be in `public/` for serving, move the assets folder:

Run: `ls -la assets/`
Expected: Shows all floor folders and building.png

If images aren't served, assets should be moved to `public/assets/` and paths updated accordingly.

- [ ] **Step 2: If needed, restructure for Vite**

Move assets to `public/assets/` for automatic static serving:
```bash
# Create the structure under public/
mkdir -p public/assets/building public/assets/1st public/assets/5th public/assets/10th
# Copy files (manual step)
```

Then update all image paths in `floors.js` and `LandingPage.jsx` to use `/assets/` prefix.

- [ ] **Step 3: Commit asset structure changes (if any)**

```bash
git add -A
git commit -m "chore: configure assets for Vite static serving

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 18: Build & Test

**Goal:** Build the project and verify everything works with zero errors.

- [ ] **Step 1: Run development server**

Run: `npm run dev`
Expected: Server starts on port 3000, no errors in console

- [ ] **Step 2: Test landing page**

Open http://localhost:3000
- Hero section loads with animated building image
- 3 floor cards appear below
- No console errors

- [ ] **Step 3: Test floor viewer navigation**

Click on "1st Floor" card
- FloorViewer opens full-screen
- Back button works and returns to landing

- [ ] **Step 4: Test viewer interactions**

In FloorViewer:
- Drag to pan image
- Scroll to zoom
- Click Day/Night toggle (image should switch)
- Category chips filter POI pins
- POI pins visible based on floor range

- [ ] **Step 5: Verify zero loading screens**

All 6 images should be preloaded — no spinners when switching between floors or day/night.

- [ ] **Step 6: Run production build**

Run: `npm run build`
Expected: `dist/` folder created with no errors

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: complete luxury tower viewer POC

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Spec Coverage Check

| Spec Requirement | Implementation |
|-----------------|----------------|
| Landing page with Ken Burns hero | Task 6 (HeroSection) |
| 3 floor selection cards | Task 7 (FloorCard) + Task 9 (LandingPage) |
| Full-screen zoomable viewport | Task 10 (ImageViewport) |
| Pan/zoom with momentum | Task 5 (usePanZoom + useMomentum) |
| Day/night toggle | Task 12 (DayNightToggle) |
| Category filter chips | Task 13 (CategoryFilterBar) |
| POI pins with floor visibility | Task 11 (POIPin) + Task 15 (FloorViewer) |
| Back to Building button | Task 14 (BackButton) |
| Image preloading (zero latency) | Task 4 (useImagePreloader) + Task 16 (App preloads all) |
| Premium dark theme (#151717 + white) | Task 2 (CSS variables) |
| Responsive design | Task 9 (CSS grid + media queries) |

All spec requirements covered. No placeholder gaps found.

---

**Plan complete.** Execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks for quality.

**2. Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

Which approach?