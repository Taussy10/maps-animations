# Performance-Safe Animated SVG Border Drawing (Stroke Dashoffset)

This guide documents the cinematic technique of having map borders draw themselves onto the screen in Remotion, and outlines the strict performance guidelines to prevent map flickering and coordinate drift.

---

## 1. The Performance & Flicker Rule (Strict No-SVG During Camera Motion)

**CRITICAL STANDARD:** Never render React SVG overlays (`<svg>` and `<path>` elements) while the camera is actively moving, panning, zooming, or rotating. 

Because MapLibre's WebGL canvas and React's DOM rendering run on different threads/cycles, SVG overlays will lag, drift, and flicker severely during camera movement. 

### The Solution: The Hybrid Technique
To get the beautiful pen-drawing reveal effect without compromising performance:
1. **Static Drawing Phase**: Keep the camera completely static (no zoom, pitch, or bearing drift) during the border drawing animation. This keeps the coordinate projection 100% stable.
2. **Transition & Drift Phase**: The instant the drawing completes, hide the React SVG overlay, switch to native WebGL MapLibre border layers (which are 100% flicker-free), and begin the camera's drift animation.

---

## 2. Storyboard Config Setup (`storyboard.json`)

To lock the camera during drawing and drift afterwards, configure three keyframes for the scene:
```json
{
  "cameraKeyframes": [
    {
      "_comment": "Scene Start: Instant cut, camera locked static",
      "frame": 513,
      "center": [20.902, 42.602],
      "zoom": 7.5,
      "pitch": 40,
      "bearing": 5
    },
    {
      "_comment": "Drawing End: Camera static hold ends, drawing complete",
      "frame": 543,
      "center": [20.902, 42.602],
      "zoom": 7.5,
      "pitch": 40,
      "bearing": 5
    },
    {
      "_comment": "Scene End: Subtle drift ends",
      "frame": 656,
      "center": [20.902, 42.602],
      "zoom": 7.4,
      "pitch": 43,
      "bearing": 7,
      "easing": "quadInOut"
    }
  ]
}
```

---

## 3. Implementation Code Template (`Composition.tsx`)

### Step A: Geographic-to-SVG Projection Helper
Place this top-level helper in your component file to convert GeoJSON geometry coordinates to an SVG path string dynamically based on the current map state:

```tsx
import maplibregl from "maplibre-gl";

function getSVGPathFromGeoJSON(map: maplibregl.Map, geojson: any): string {
  if (!geojson || !geojson.features || geojson.features.length === 0) return "";
  const feature = geojson.features[0];
  const geometry = feature.geometry;
  let d = "";

  const projectCoordinates = (ring: any) => {
    let ringPath = "";
    for (let i = 0; i < ring.length; i++) {
      const coord = ring[i];
      const pos = map.project(coord as [number, number]);
      if (!pos) continue;
      ringPath += `${i === 0 ? "M" : "L"} ${pos.x} ${pos.y} `;
    }
    return ringPath + "Z ";
  };

  if (geometry.type === "Polygon") {
    for (const ring of geometry.coordinates) {
      d += projectCoordinates(ring);
    }
  } else if (geometry.type === "MultiPolygon") {
    for (const polygon of geometry.coordinates) {
      for (const ring of polygon) {
        d += projectCoordinates(ring);
      }
    }
  }
  return d.trim();
}
```

### Step B: Frame Listener Update (Toggling WebGL Borders)
In your map rendering listener, hide the native WebGL borders during the drawing phase, and show them immediately afterwards:

```tsx
useEffect(() => {
  if (!mapInstance) return;

  const opacity = showMap ? 0.45 : 0;
  
  // WebGL borders are completely hidden during the drawing phase (513-543)
  let webglBorderOpacityScale = 1;
  if (frame >= 513 && frame < 543) {
    webglBorderOpacityScale = 0;
  }

  mapInstance.setPaintProperty("map-fill", "fill-opacity", opacity);
  mapInstance.setPaintProperty("map-border-outer", "line-opacity", (opacity > 0 ? 0.5 : 0) * webglBorderOpacityScale);
  mapInstance.setPaintProperty("map-border-inner", "line-opacity", (opacity > 0 ? 0.8 : 0) * webglBorderOpacityScale);
  mapInstance.setPaintProperty("map-border-core", "line-opacity", (opacity > 0 ? 1.0 : 0) * webglBorderOpacityScale);
}, [frame, mapInstance, showMap]);
```

### Step C: SVG Rendering Overlay
Render the animated SVG trace overlay on top of the map **only during the drawing frame range**:

```tsx
import { interpolate, Easing, spring } from "remotion";

{/* Render inside 3D-Aligned Overlays container */}
{frame >= 513 &&
  frame <= 543 &&
  mapInstance &&
  (() => {
    const svgPath = getSVGPathFromGeoJSON(mapInstance, countryGeoJSON);
    const dashOffset = interpolate(frame, [513, 543], [100, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });

    return (
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          pointerEvents: "none",
        }}
      >
        {/* Glowing blur under-path */}
        <path
          d={svgPath}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={12}
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={dashOffset}
          style={{
            filter: "blur(6px)",
            opacity: 0.8,
          }}
        />
        {/* Core sharp drawing path */}
        <path
          d={svgPath}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={3}
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={dashOffset}
        />
      </svg>
    );
  })()}
```
