# UI Design Specification

Design system, 3D/motion specs, and responsive layout guide for the NVIDIA Super Computing Club website.

---

## Design Philosophy

This website should be an **Awwwards-caliber** experience — visually immersive, technically impressive, and butter-smooth. The design draws from NVIDIA's brand identity: dark, powerful, cutting-edge.

**Keywords:** Dark, Futuristic, Immersive, Precise, Powerful

---

## Color System

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--nvidia-green` | `#76B900` | Primary accent, CTAs, highlights |
| `--nvidia-green-light` | `#8CD419` | Hover states, gradients |
| `--nvidia-green-dark` | `#5A8F00` | Active states, pressed |

### Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0A0A0A` | Page background |
| `--bg-secondary` | `#111111` | Card backgrounds |
| `--bg-tertiary` | `#1A1A1A` | Elevated surfaces |
| `--bg-glass` | `rgba(255,255,255,0.05)` | Glassmorphism panels |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#FFFFFF` | Headlines, primary text |
| `--text-secondary` | `#A0A0A0` | Body text, descriptions |
| `--text-tertiary` | `#666666` | Captions, metadata |
| `--text-accent` | `#76B900` | Links, highlighted text |

### Gradients

```css
/* Hero gradient */
background: linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #0A0A0A 100%);

/* CTA button gradient */
background: linear-gradient(135deg, #76B900 0%, #5A8F00 100%);

/* Glow effect */
box-shadow: 0 0 30px rgba(118, 185, 0, 0.3);
```

---

## Typography

### Font Stack

```css
/* Headings - Use Inter or Satoshi */
font-family: 'Inter', 'Satoshi', system-ui, sans-serif;

/* Body */
font-family: 'Inter', system-ui, sans-serif;

/* Code / Technical */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Token | Size (Desktop) | Size (Mobile) | Weight | Usage |
|-------|---------------|---------------|--------|-------|
| `--text-hero` | 72px / 80px | 40px / 44px | 800 | Hero headline |
| `--text-h1` | 48px / 56px | 32px / 36px | 700 | Page titles |
| `--text-h2` | 36px / 44px | 28px / 32px | 700 | Section headings |
| `--text-h3` | 24px / 32px | 20px / 28px | 600 | Card titles |
| `--text-body` | 16px / 24px | 16px / 24px | 400 | Body text |
| `--text-caption` | 14px / 20px | 14px / 20px | 400 | Captions, metadata |
| `--text-label` | 12px / 16px | 12px / 16px | 600 | Labels, badges |

---

## Spacing & Layout

### Spacing Scale

```
4px → 8px → 12px → 16px → 24px → 32px → 48px → 64px → 96px → 128px
```

### Grid System

```
Desktop (1440px+):  12-column grid, 1200px max-width, 24px gutters
Tablet (768-1024px): 8-column grid, fluid width, 16px gutters
Mobile (< 768px):    4-column grid, fluid width, 16px gutters
```

### Breakpoints

```css
/* Mobile first */
--bp-mobile: 0px;
--bp-tablet: 768px;
--bp-desktop: 1024px;
--bp-wide: 1440px;
```

### Container Max Widths

| Container | Max Width | Padding |
|-----------|-----------|---------|
| Default | 1200px | 24px |
| Narrow | 800px | 24px |
| Wide | 1400px | 24px |
| Full | 100% | 0 |

---

## Component Design

### Buttons

```
┌─────────────────────────────┐
│         Primary             │  bg: nvidia-green, text: black
│     height: 48px            │  border-radius: 8px
│     padding: 0 24px         │  font-weight: 600
└─────────────────────────────┘

┌─────────────────────────────┐
│         Secondary           │  bg: transparent, border: nvidia-green
│     height: 48px            │  text: nvidia-green
│     padding: 0 24px         │  border-radius: 8px
└─────────────────────────────┘

┌─────────────────────────────┐
│         Ghost               │  bg: transparent, text: white
│     height: 48px            │  hover: bg white/10
└─────────────────────────────┘
```

### Cards

```
┌─────────────────────────────┐
│  [Image]                    │  bg: bg-secondary
│                             │  border-radius: 12px
│  Title                      │  border: 1px solid white/10
│  Description text here      │  overflow: hidden
│                             │
│  [Badge]     [Date]         │  hover: border nvidia-green
└─────────────────────────────┘  transition: all 0.3s ease
```

### Glassmorphism (Navbar)

```css
.navbar {
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
```

---

## 3D & Motion Specification

### Three.js / React Three Fiber Setup

#### Scene Structure

```
Canvas
├── ambientLight (intensity: 0.3)
├── directionalLight (intensity: 1.0, position: [5, 5, 5])
├── spotLight (intensity: 0.8, angle: 0.15, penumbra: 0.5)
├── DGXModel (GLTF loader)
│   ├── Auto-rotation (0.005 rad/frame)
│   ├── Mouse-tracking parallax
│   └── Environment map for reflections
├── ParticleField (custom shader)
│   ├── 2000 particles
│   ├── Size: 0.02 - 0.08
│   ├── Color: nvidia-green + white
│   └── Movement: gentle drift upward
├── Effects (post-processing)
│   ├── Bloom (threshold: 0.6, intensity: 0.4)
│   └── Vignette (darkness: 0.5)
└── OrbitControls (disabled for user, used for animation)
```

#### DGX H100 Model Specs

```
File format:    GLTF/GLB (binary)
Polygons:       < 100K (optimized for web)
Textures:       2K max, compressed (KTX2)
Animations:     Idle rotation, power-on sequence (optional)
Material:       PBR with metallic/roughness
                - Base color: #1A1A1A (dark gray)
                - Metallic: 0.8
                - Roughness: 0.3
                - Emissive: #76B900 (NVIDIA green accents)
```

#### Model Loading

```jsx
// React Three Fiber + Suspense pattern
import { Canvas } from '@react-three/fiber'
import { useGLTF, Suspense } from '@react-three/drei'

function DGXModel() {
  const { scene } = useGLTF('/models/dgx-h100.glb')
  // Apply materials, animations
  return <primitive object={scene} />
}

function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} />
      <Suspense fallback={<LoadingPlaceholder />}>
        <DGXModel />
      </Suspense>
      <ParticleField />
    </Canvas>
  )
}
```

#### Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| FPS (desktop) | 60fps | LOD, instanced rendering |
| FPS (mobile) | 30fps | Reduced particles, lower poly |
| Initial load | < 3s | Lazy-load model, show placeholder |
| Model size | < 5MB | Draco compression, KTX2 textures |
| Memory | < 100MB | Dispose unused resources |

### WebGL Particle System

#### Shader Specs

```glsl
// Vertex shader
- position: vec3 (random distribution in sphere)
- size: float (0.02 - 0.08, based on distance)
- color: vec3 (mix of nvidia-green and white)
- opacity: float (fade based on distance from center)

// Fragment shader
- Point sprite rendering
- Soft circle shape (smoothstep)
- Additive blending for glow
- Color: mix(vec3(0.463, 0.725, 0), vec3(1.0), vRandom)
```

#### Animation

```
Particles drift upward slowly
X/Y: gentle noise-based movement (perlin or simplex)
Z: slight oscillation
Speed: 0.1 - 0.3 units/second
Lifecycle: infinite loop, respawn at bottom when reaching top
```

### GSAP Animation Patterns

#### Scroll-Triggered Sections

```javascript
// Each section fades in and slides up on scroll
gsap.from('.section', {
  scrollTrigger: {
    trigger: '.section',
    start: 'top 80%',      // Animation starts when top of section hits 80% of viewport
    end: 'top 20%',        // Animation ends at 20%
    toggleActions: 'play none none reverse'
  },
  y: 60,                   // Slide up 60px
  opacity: 0,              // Start invisible
  duration: 0.8,           // 0.8 seconds
  ease: 'power2.out'       // Easing
})
```

#### Hero Text Reveal

```javascript
// Staggered letter animation
const tl = gsap.timeline({ delay: 0.5 })

tl.from('.hero-title .char', {
  y: 100,
  opacity: 0,
  rotateX: -90,
  stagger: 0.03,
  duration: 0.8,
  ease: 'back.out(1.7)'
})
.from('.hero-subtitle', {
  y: 30,
  opacity: 0,
  duration: 0.6,
  ease: 'power2.out'
}, '-=0.3')
.from('.hero-cta', {
  scale: 0.8,
  opacity: 0,
  duration: 0.5,
  ease: 'elastic.out(1, 0.5)'
}, '-=0.2')
```

#### Counter Animation

```javascript
// Animated number counting on scroll
ScrollTrigger.create({
  trigger: '.stats-section',
  start: 'top 70%',
  onEnter: () => {
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.dataset.target)
      gsap.to(el, {
        innerText: target,
        duration: 2,
        snap: { innerText: 1 },
        ease: 'power1.inOut'
      })
    })
  }
})
```

#### Parallax Effects

```javascript
// Hero background parallax
gsap.to('.hero-bg', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  },
  y: 100,  // Background moves slower than content
  scale: 1.1
})
```

---

## Responsive Layout

### Desktop (1440px+)

```
┌──────────────────────────────────────────────────────────────┐
│  Navbar (fixed, glassmorphism)                                │
│  [Logo]  [Home]  [Events]  [Team]              [Admin Login] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                    HERO SECTION                               │
│                                                              │
│     ┌──────────────────────┐   ┌──────────────────────┐     │
│     │                      │   │                      │     │
│     │   Title Text         │   │   3D DGX Model      │     │
│     │   Subtitle           │   │   (interactive)      │     │
│     │   [CTA Button]       │   │                      │     │
│     │                      │   │                      │     │
│     └──────────────────────┘   └──────────────────────┘     │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                    ABOUT + STATS                              │
│     ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                 │
│     │ 150+ │  │ 20+  │  │ 10+  │  │ 5+   │                 │
│     │Members│  │Events │  │Projects│ │Partners│                │
│     └──────┘  └──────┘  └──────┘  └──────┘                 │
├──────────────────────────────────────────────────────────────┤
│                    FEATURED SECTION                           │
│     ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│     │ Event 1  │  │ Event 2  │  │ Event 3  │                │
│     └──────────┘  └──────────┘  └──────────┘                │
├──────────────────────────────────────────────────────────────┤
│  Footer                                                      │
└──────────────────────────────────────────────────────────────┘
```

### Tablet (768px - 1024px)

```
┌──────────────────────────────────────────────┐
│  Navbar (hamburger menu)                       │
├──────────────────────────────────────────────┤
│                                              │
│              HERO SECTION                     │
│   ┌────────────────────────────────────┐     │
│   │                                    │     │
│   │   Title Text (smaller)             │     │
│   │   Subtitle                         │     │
│   │   [CTA Button]                     │     │
│   │                                    │     │
│   │   ┌──────────────────────────┐     │     │
│   │   │   3D DGX Model          │     │     │
│   │   └──────────────────────────┘     │     │
│   └────────────────────────────────────┘     │
│                                              │
├──────────────────────────────────────────────┤
│              STATS (2x2 grid)                │
│   ┌──────────┐  ┌──────────┐                │
│   │ 150+     │  │ 20+      │                │
│   └──────────┘  └──────────┘                │
│   ┌──────────┐  ┌──────────┐                │
│   │ 10+      │  │ 5+       │                │
│   └──────────┘  └──────────┘                │
├──────────────────────────────────────────────┤
│              FEATURED (2 columns)            │
│   ┌──────────────────┐  ┌──────────────────┐ │
│   │ Event 1          │  │ Event 2          │ │
│   └──────────────────┘  └──────────────────┘ │
├──────────────────────────────────────────────┤
│  Footer (2 columns)                           │
└──────────────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌──────────────────────┐
│  Navbar (hamburger)   │
├──────────────────────┤
│                      │
│      HERO SECTION    │
│                      │
│   Title (40px)       │
│   Subtitle           │
│   [CTA Button]       │
│                      │
│   ┌──────────────┐   │
│   │ 3D Model     │   │
│   │ (smaller)    │   │
│   └──────────────┘   │
│                      │
├──────────────────────┤
│   STATS (1 column)   │
│   ┌──────────────┐   │
│   │ 150+ Members │   │
│   └──────────────┘   │
│   ┌──────────────┐   │
│   │ 20+ Events   │   │
│   └──────────────┘   │
├──────────────────────┤
│   FEATURED (1 col)   │
│   ┌──────────────┐   │
│   │ Event 1      │   │
│   └──────────────┘   │
│   ┌──────────────┐   │
│   │ Event 2      │   │
│   └──────────────┘   │
├──────────────────────┤
│   Footer (stacked)   │
└──────────────────────┘
```

---

## Animation Checklist

- [ ] Hero text: staggered letter reveal on load
- [ ] Hero 3D model: auto-rotate, mouse parallax
- [ ] Scroll indicator: animated chevron bounce
- [ ] Stats: number counting animation on scroll
- [ ] Sections: fade-in + slide-up on scroll
- [ ] Cards: stagger entrance on scroll
- [ ] Navbar: glassmorphism appears after scroll
- [ ] Button hover: glow effect + scale
- [ ] Page transitions: fade between routes
- [ ] Mobile menu: slide-in from right
- [ ] Loading states: skeleton shimmer
- [ ] Error states: subtle shake animation

---

## Accessibility

- All animations respect `prefers-reduced-motion`
- 3D model has a static fallback image for screen readers
- Color contrast: all text meets WCAG AA (4.5:1)
- Keyboard navigation: all interactive elements focusable
- Focus indicators: 2px nvidia-green outline
- Alt text: all images have descriptive alt text
- Skip link: "Skip to main content" for keyboard users
