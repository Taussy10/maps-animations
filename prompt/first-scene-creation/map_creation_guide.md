# Map Creation & Tooling Guide

This document explains the standard workflow, tools, and technical practices required to create and manipulate map animations in Remotion successfully.

## 1. Core Tooling Stack

- **Remotion:** The React-based video rendering engine.
- **MapLibre GL JS:** The WebGL mapping library. We use this instead of Leaflet or Google Maps because it supports 3D camera pitching, bearing (rotation), and smooth programmatic interpolation.
- **GeoJSON:** The format we use to define the geographic boundaries of countries.

## 2. GeoJSON Data Pipeline

To color or highlight a specific country, you must have its exact boundary data.
1. Store country boundary files in the `E:\Tausif\animations\data\` directory as `.json` files (e.g., `indonesia.json`).
2. Download missing GeoJSON files from GitHub repositories (such as `glynnbird/countriesgeojson` or natural earth data).
3. **Important:** Load these JSON files into MapLibre as a **Source**, and then draw them using a **Layer**.

## 3. The WebGL Rule (No React SVGs)

**Never use React `<svg>` overlays to draw borders or country highlights.**
When a 3D map tilts (pitch) or rotates (bearing), HTML/SVG elements rendered *above* the canvas will drift out of sync with the underlying map tiles, causing heavy flickering.

**Instead, inject styles natively into MapLibre:**
- Define your GeoJSON sources on map load.
- Initialize their `fill-opacity` or `line-opacity` to `0`.
- Update the opacities dynamically per-frame using MapLibre's native API (`mapInstance.setPaintProperty()`).

## 4. Preventing Render Flickering & Blank Frames

Remotion renders frames in parallel (e.g., frame 200 might render before frame 50). Because of this:
- **No CSS Animations:** Do not use `transition` or `animation`. Use Remotion's `interpolate()` and `spring()`.
- **No Randomness:** Do not use `Math.random()`. Use Remotion's `random(seed)`.
- **No HTML Tags:** Use Remotion's `<Img>` instead of `<img>` and `<OffthreadVideo>` instead of `<video>`.

## 5. Rendering Pipeline

Rendering heavy 3D WebGL maps in headless Chrome can cause memory crashes and timeouts.
1. Always run production exports with **concurrency 1** to prevent GPU context loss:
   ```bash
   npx remotion render <composition-id> out.mp4 --concurrency=1
   ```
2. If Chrome crashes, use Swiftshader for software rendering:
   ```bash
   npx remotion render <composition-id> out.mp4 --gl=swiftshader
   ```

## 6. Pre-rendering Strategy (For Heavy Scenes)
If your map has too many tiles or custom textures:
- Render the base map *without* text/HTML overlays first and save it as an `.mp4`.
- Create a composite composition that loads the `.mp4` background via `<OffthreadVideo>` and overlay the HTML text elements (like "VS" or Stat Cards) on top. This splits the GPU load and ensures buttery smooth final rendering.

## 7. Which Base Map to Use & How to Create It

By default, MapLibre will render an empty background unless you provide a base map style. For our standard geographic animations, we use **Esri's World Imagery** satellite raster tiles as the base layer. It provides high-quality, seamless, real-world textures without requiring an API key.

**How to implement the Esri Raster Map:**
Inside your `style` object, define the raster source pointing to ArcGIS, and then draw it as the first layer in your layers array (so country borders and highlights render *on top* of the satellite imagery).

```typescript
style: {
  version: 8,
  sources: {
    "esri-raster": {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      ],
      tileSize: 256,
    },
    // ... insert your country GeoJSON sources here
  },
  layers: [
    {
      id: "esri-imagery-layer",
      type: "raster",
      source: "esri-raster",
      paint: {},
    },
    // ... insert your country fills and glowing borders here
  ],
}
```
**Important:** Always place the raster base layer at the very top of your `layers` array to ensure it acts as the background beneath your dynamic highlights and borders.
