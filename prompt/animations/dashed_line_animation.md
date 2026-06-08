# Recreating MapLibre GL Dashed Line Animation in Remotion

This guide explains how to draw and animate a glowing or solid dashed line (route) connecting two points on a map using **MapLibre GL** and **Remotion**.

---

## 1. MapLibre GL Configuration (Style Definitions)

To prepare for drawing the line, define a **GeoJSON Source** with an empty or initial state and a **Line Layer** with your custom dashed style.

```typescript
const mapStyle = {
  version: 8,
  sources: {
    // 1. Define the line source with empty coordinates initially
    "route-src": {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      },
    },
  },
  layers: [
    // 2. Define the route-core layer with custom styling
    {
      id: "route-core",
      type: "line",
      source: "route-src",
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#ffffff", // Solid White line
        "line-width": 8,         // Thickness in pixels
        "line-opacity": 1.0,     // Full opacity
        "line-dasharray": [2, 2], // [dash length, gap length] pattern for dashed look
      },
    },
  ],
};
```

---

## 2. Animation Logic (React / Remotion Frame Listener)

Use `useCurrentFrame()` and `interpolate()` from `"remotion"` to calculate the current progress of the line growth on every frame, updating MapLibre's source data dynamically.

```typescript
import { interpolate, Easing } from "remotion";

// Inside your component render lifecycle:
const frame = useCurrentFrame();

useEffect(() => {
  if (!map) return;

  const lineSource = map.getSource("route-src") as maplibregl.GeoJSONSource;
  if (lineSource) {
    const startFrame = 91;
    const endFrame = 124;

    if (frame >= startFrame && frame < endFrame) {
      // 1. Calculate interpolation progress (0 to 1)
      const p = interpolate(frame, [startFrame, endFrame], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
      });

      // 2. Define start and end Coordinates [Longitude, Latitude]
      const start = [-171.6, -13.92];
      const end = [-170.7, -14.28];

      // 3. Interpolate current point along the line segment
      const currentLon = start[0] + p * (end[0] - start[0]);
      const currentLat = start[1] + p * (end[1] - start[1]);

      // 4. Update the GeoJSON source with the growing LineString
      lineSource.setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [start, [currentLon, currentLat]],
        },
      });
    } else if (frame >= endFrame) {
      // Line is fully drawn
      const start = [-171.6, -13.92];
      const end = [-170.7, -14.28];
      lineSource.setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [start, end],
        },
      });
    } else {
      // Line hasn't started drawing yet
      lineSource.setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      });
    }
  }
}, [frame, map]);
```
