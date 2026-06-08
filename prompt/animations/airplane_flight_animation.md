# Airplane Flight Animation along Map Routes (MapLibre + Remotion)

Use this pattern to animate an airplane (or any vehicle) flying along a route line between two coordinates on a MapLibre GL map layer.

## 1. Core Concepts

1. **Route Line**: The route line (e.g., a dashed white line) is pre-rendered on the MapLibre layer.
2. **Coordinates Interpolation**: Animate the geographical coordinates (longitude, latitude) of the vehicle along a straight line path from the start point to the end point over the scene's frame range.
3. **Screen Projections**: Use `map.project()` inside a frame hook to convert geographic coordinates to screen coordinates `(x, y)`.
4. **Heading / Rotation Calculation**: Project a point slightly ahead on the path (e.g., `p + 0.01`). Use screen-space `Math.atan2(dy, dx)` to get the exact rotation angle in degrees. This automatically aligns the nose of the plane along the path, even during camera pan, zoom, pitch, or bearing rotations.
5. **Premium Takeoff & Landing**: Scale the airplane up during the start of the flight (takeoff) and down to zero at the end (landing) for a smooth effect.

---

## 2. React Implementation Template

Here is the helper function and render block:

### Projection Helper
```tsx
const getPlaneProj = () => {
  if (!map) return null;
  if (frame < startFrame || frame > endFrame) return null;
  
  // Progress of the flight (0 to 1)
  const p = interpolate(frame, [startFrame, landingFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  
  const start = [-171.6, -13.92]; // Upolu (Samoa)
  const end = [-170.7, -14.28];   // Tutuila (American Samoa)
  
  // Interpolated coordinates
  const lon = start[0] + p * (end[0] - start[0]);
  const lat = start[1] + p * (end[1] - start[1]);
  const projected = map.project([lon, lat]);
  
  // Project slightly ahead to calculate screen-space angle
  const aheadP = Math.min(1, p + 0.01);
  const aheadLon = start[0] + aheadP * (end[0] - start[0]);
  const aheadLat = start[1] + aheadP * (end[1] - start[1]);
  const projectedAhead = map.project([aheadLon, aheadLat]);
  
  const dx = projectedAhead.x - projected.x;
  const dy = projectedAhead.y - projected.y;
  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;
  
  return { x: projected.x, y: projected.y, angle: angleDeg, p };
};
```

### Component Rendering
```tsx
{planeProj && (() => {
  // Scale pulse (takeoff & landing)
  const scale = interpolate(planeProj.p, [0, 0.15, 0.85, 1], [0, 1.2, 1.2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  return (
    <div
      style={{
        position: "absolute",
        top: planeProj.y,
        left: planeProj.x,
        // Add 90 degrees offset if the default SVG nose points straight up
        transform: `translate(-50%, -50%) rotate(${planeProj.angle + 90}deg) scale(${scale})`,
        zIndex: 60,
        pointerEvents: "none",
      }}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        style={{
          filter: "drop-shadow(0px 8px 12px rgba(0,0,0,0.6))",
        }}
      >
        <path
          d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
})()}
```
