# Animated SVG Faces on MapLibre Maps

This document outlines the workflow and architecture for overlaying responsive, animated SVG elements (such as faces, eyes, mouths, teardrops) onto dynamic 3D maps using Remotion and MapLibre.

## 1. Core Concept

Instead of attempting to draw intricate country outlines manually using SVG polygons or paths (which can flicker or lag during 3D camera sweeps), we split the responsibilities:

1.  **MapLibre GL** handles the map, the 3D camera projection, and the geographical filling/highlighting of the country (e.g. coloring Serbia red).
2.  **Remotion React SVGs** handle *only* the overlay details—in this case, the facial features (eyes, eyebrows, mouth, tears).
3.  **Coordinate Projection** is used to pin the center of the SVG face strictly to the geographical center of the target country on the map.

This ensures that the face always remains perfectly stuck to the country, regardless of how the camera pitches, bears, or zooms!

---

## 2. Creating the SVG Component

Create a standalone React component that takes `startFrame`, `width`, and `height` as props. Inside the component, utilize Remotion's `interpolate` and `spring` functions to animate individual SVG paths.

### Example: CryingFaceSVG.tsx
```tsx
import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";

export const CryingFaceSVG: React.FC<{
  width?: number | string;
  height?: number | string;
  startFrame?: number;
}> = ({ width = 150, height = 150, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - startFrame);

  // Example: Looping tears animation
  const loopFrame = localFrame % 60;
  const tearScale = spring({ frame: loopFrame - 5, fps: 30, config: { damping: 12 } });
  const tearY = interpolate(loopFrame, [10, 50], [0, 60], { extrapolateRight: "clamp" });
  const tearOpacity = interpolate(loopFrame, [30, 50], [1, 0], { extrapolateRight: "clamp" });

  return (
    <svg viewBox="0 0 200 200" width={width} height={height}>
      {/* Eyebrows, Eyes, Mouth */}
      <path d="M 40 70 Q 60 55 80 50" fill="none" stroke="#000000" strokeWidth="12" strokeLinecap="round" />
      <path d="M 120 50 Q 140 55 160 70" fill="none" stroke="#000000" strokeWidth="12" strokeLinecap="round" />
      
      <ellipse cx="60" cy="95" rx="20" ry="25" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
      <circle cx="60" cy="105" r="10" fill="#000000" />
      
      <ellipse cx="140" cy="95" rx="20" ry="25" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
      <circle cx="140" cy="105" r="10" fill="#000000" />

      <path d="M 70 150 Q 100 120 130 150" fill="none" stroke="#000000" strokeWidth="12" strokeLinecap="round" />

      {/* Animated Tear */}
      <g transform={`translate(60, ${105 + tearY}) scale(${tearScale})`} opacity={tearOpacity}>
        <path d="M 0 0 C 10 20 10 30 0 30 C -10 30 -10 20 0 0" fill="#00A8FF" />
      </g>
    </svg>
  );
};
```

---

## 3. Pinning the Face to the Map

To attach the face to a country, do **not** use absolute screen coordinates (e.g. `left: 50%`), because the map might move. Instead, project geographical coordinates (longitude, latitude) into screen pixels dynamically on every frame.

### In your Composition.tsx:
```tsx
{frame >= START_FRAME && frame <= END_FRAME && mapInstance && (() => {
  // 1. Get exact pixel coordinates for the center of the country
  const pos = mapInstance.project([20.989, 44.016]); // [Lng, Lat] for Serbia
  if (!pos) return null;

  const width = 300;
  const height = 300;

  return (
    <div
      style={{
        position: "absolute",
        // 2. Anchor the component's center exactly to the projected point
        left: `${pos.x - width / 2}px`,
        top: `${pos.y - height / 2}px`, 
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 20,
      }}
    >
      {/* 3. Render the SVG component inside the anchor box */}
      <CryingFaceSVG startFrame={START_FRAME} width="100%" height="100%" />
    </div>
  );
})()}
```

### Best Practices & Rules
- **Map Camera Adjustments:** Depending on how large the country is, you may need to adjust the `zoom` and `pitch` in your `storyboard.json` to ensure the face doesn't look too large/small compared to the map outline.
- **Vertical Offsets:** Sometimes the "geographical center" of a country might fall lower or higher than its visual center. You can tweak the `top` style by adding/subtracting a small offset (e.g., `top: \`\${pos.y - height / 2 - 50}px\``).
- **Shadows:** Add a CSS `filter: "drop-shadow(...)"` directly to the `<svg>` or `<CryingFaceSVG>` element to make the face visually "pop" off the map canvas and blend beautifully.
