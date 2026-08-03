# Plan: Convert JPG Scroll-Animation Frames to WebP

## Context

The `HomePage.jsx` scroll-driven "3D" animation uses **300 JPG frames** from `client/src/assets/exploding-frames-dgx-h200/` (~27 KB avg, **7.93 MB total**). These are loaded eagerly via `import.meta.glob` and drawn to a `<canvas>` element on scroll. Converting to WebP will reduce total payload by an estimated **50-65%** (~3-4 MB), improving initial load and scroll smoothness.

There is also an unused `image explosion2/` folder (300 JPGs, 8.41 MB) not referenced anywhere in code.

## Current State

| Folder | Files | Total Size | Avg Size | Used? |
|--------|-------|------------|----------|-------|
| `exploding-frames-dgx-h200/` | 300 JPGs | 7.93 MB | ~27 KB | **Yes** — `HomePage.jsx:18-26` |
| `image explosion2/` | 300 JPGs | 8.41 MB | ~28 KB | No |

**Code reference** (`client/src/pages HomePage.jsx`):
```js
const FRAME_SOURCES = Object.entries(
  import.meta.glob("../assets/exploding-frames-dgx-h200/*.jpg", {
    eager: true,
    query: "?url",
    import: "default",
  }),
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, u]) => u);
```

The `Sequence` component creates `new Image()` objects for each URL and draws them onto a canvas. Frames are drawn via `drawImage()` — no `<img>` elements in DOM.

## Approach: Pre-convert to WebP + Update Glob

**Why this approach**: Images are drawn to canvas via `new Image()`, so `<picture>` fallback is irrelevant. Sharp is already available. Vite resolves `import.meta.glob` at build time, so the glob pattern just needs to match the new extension. WebP has 97%+ browser support.

### Steps

1. **Create a conversion script** (`client/scripts/convert-to-webp.mjs`)
   - Uses `sharp` (already available in the project)
   - Reads all `*.jpg` from `exploding-frames-dgx-h200/`
   - Converts each to WebP at quality 80 (good balance for animation frames)
   - Writes `.webp` files to the same directory
   - Logs progress and final size comparison

2. **Run the conversion script**
   - `node client/scripts/convert-to-webp.mjs`
   - Produces 300 `.webp` files alongside the originals

3. **Update the glob pattern** in `client/src/pages/HomePage.jsx`
   - Change `"../assets/exploding-frames-dgx-h200/*.jpg"` → `"../assets/exploding-frames-dgx-h200/*.webp"`
   - No other code changes needed — the rest of the pipeline (sort, Image constructor, canvas draw) is format-agnostic

4. **Delete the original JPG files** from `exploding-frames-dgx-h200/`
   - Remove all `*.jpg` files after verifying WebP conversion succeeded

5. **Delete the unused `image explosion2/` folder**
   - Not referenced anywhere in the codebase — dead weight (8.41 MB)

6. **Verify** the build works
   - `npm run build` in `client/`
   - Confirm the glob resolves all 300 WebP files
   - Confirm no broken references

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Quality degradation from WebP | Quality 80 is visually near-identical for animation frames; these were already GIF-extracted (lossy). Can adjust if needed. |
| Browser compatibility | WebP supported in all modern browsers (Chrome, Firefox, Safari 14+, Edge). No IE11 concern for a Vite 6 + React 19 app. |
| Vite glob pattern change | Single line change, well-understood Vite API. |
| Large git diff from deleting JPGs | Expected — 300 files removed, 300 added. Consider doing this on a dedicated branch. |

## Files Modified

| File | Change |
|------|--------|
| `client/scripts/convert-to-webp.mjs` | **New** — conversion script (can be deleted after use) |
| `client/src/pages/HomePage.jsx` | **Edit line 19** — glob pattern `*.jpg` → `*.webp` |
| `client/src/assets/exploding-frames-dgx-h200/*.jpg` | **Deleted** after WebP conversion verified |
| `client/src/assets/image explosion2/` | **Deleted** — unused folder |
