# Flat Storyboard Architecture & Camera Kinematics Playbook

This document details the standardized schema and React rendering integration rules for data-driven mapping videos driven by a flat config storyboard.

---

## 1. Storyboard Config Schema (`storyboard.json`)

To keep camera trajectories, styling parameters, and text highlights decoupled from the React layout, the storyboard must be split into flat, root-level array keys:

### A. `cameraKeyframes`
A flat array of chronological keyframes that dictate the MapLibre viewport.
* **Drifting Kinematics Rule:** Never leave the camera stationary. Introduce a subtle, continuous drift between scenes (e.g. zoom increment of `+0.05` to `+0.1`, pitch increase of `+3°` to `+5°`, and bearing shift of `+2°` to `+4°`) so the viewport is always in motion.
* **Easing:** Use `"easing": "quadInOut"` on the destination keyframe when transitioning/panning between distant focus coordinates.

### B. `mapHighlights`
Defines the color fill and glowing borders of country boundaries.
* **Strict WebGL Rule:** Do not use SVG paths over the map. Fills and borders must be drawn directly in MapLibre WebGL layers.

### C. `textOverlays`
Controls the coordinates, styles, and exact fade-in/fade-out frame ranges for map text overlays (like label tags or "VS" indicators).

```json
{
  "cameraKeyframes": [
    {
      "frame": 0,
      "center": [-30.0, 20.0],
      "zoom": 4.5,
      "pitch": 0,
      "bearing": 0
    },
    {
      "frame": 61,
      "center": [-30.0, 20.0],
      "zoom": 4.65,
      "pitch": 3,
      "bearing": 2,
      "easing": "quadInOut"
    }
  ],
  "mapHighlights": [
    {
      "country": "kosovo",
      "color": "#0088FF",
      "opacity": 0.45
    }
  ],
  "textOverlays": [
    {
      "id": "vs_text",
      "text": "VS",
      "map": "atlantic",
      "coords": [-30.0, 20.0],
      "fadeIn": [2, 8],
      "fadeOut": [55, 61],
      "offsetY": 0,
      "textStyle": {
        "fontFamily": "sans-serif",
        "fontSize": "150px",
        "color": "#FF0000",
        "textShadow": "0 0 10px #FF0000"
      }
    }
  ]
}
```

---

## 2. React Engine Integration (`*Comp.tsx`)

The React component should consume the flat configuration directly without complex scene state management.

### A. Viewport Camera Interpolator
Add this helper function to compute the exact camera position for the current frame:

```typescript
function getCameraPosition(
  frame: number,
  kf: CameraKeyframe[]
): { center: [number, number]; zoom: number; pitch: number; bearing: number } {
  if (kf.length === 0) return { center: [0, 0], zoom: 3, pitch: 0, bearing: 0 };
  if (frame <= kf[0].frame) return kf[0] as any;
  if (frame >= kf[kf.length - 1].frame) return kf[kf.length - 1] as any;

  for (let i = 0; i < kf.length - 1; i++) {
    const a = kf[i];
    const b = kf[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const ease = b.easing === "quadInOut" ? Easing.inOut(Easing.quad) : undefined;
      const o = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: ease };
      return {
        center: [
          interpolate(frame, [a.frame, b.frame], [a.center[0], b.center[0]], o),
          interpolate(frame, [a.frame, b.frame], [a.center[1], b.center[1]], o),
        ] as [number, number],
        zoom: interpolate(frame, [a.frame, b.frame], [a.zoom, b.zoom], o),
        pitch: interpolate(frame, [a.frame, b.frame], [a.pitch, b.pitch], o),
        bearing: interpolate(frame, [a.frame, b.frame], [a.bearing, b.bearing], o),
      };
    }
  }
  return kf[0] as any;
}
```

### B. Frame Effect Hook
Use a single `useEffect` hook to drive MapLibre viewport coordinates and dynamically adjust layer opacities:

```typescript
useEffect(() => {
  const camObj = getCameraPosition(frame, storyboard.cameraKeyframes);

  if (showAtlantic && mapAtlantic) {
    mapAtlantic.jumpTo(camObj);
  } else if (showKosovo && mapKosovo) {
    mapKosovo.jumpTo(camObj);
    const highlight = storyboard.mapHighlights.find(h => h.country === "kosovo");
    const opacity = highlight ? highlight.opacity : 0.45;
    mapKosovo.setPaintProperty("kosovo-fill", "fill-opacity", opacity);
    mapKosovo.setPaintProperty("kosovo-border-outer", "line-opacity", opacity > 0 ? 0.5 : 0);
  }
}, [frame, mapAtlantic, mapKosovo, showAtlantic, showKosovo]);
```

### C. Text Overlays Rendering
In the JSX code, filter and map directly over the flat overlays array:

```tsx
{storyboard.textOverlays
  .filter((overlay) => frame >= overlay.fadeIn[0] && frame <= overlay.fadeOut[1])
  .map((overlay, i) => {
    const activeMap = showAtlantic ? mapAtlantic : showKosovo ? mapKosovo : mapSerbia;
    if (!activeMap) return null;

    return (
      <div key={overlay.id || i} style={{ position: "absolute", zIndex: 5, pointerEvents: "none" }}>
        <span style={{ position: "absolute", transform: "translate(-50%, -50%)", ...overlay.textStyle }}>
          {overlay.text}
        </span>
      </div>
    );
  })}
```
