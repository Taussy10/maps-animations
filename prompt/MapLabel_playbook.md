# Component Playbook: `MapLabel`

This component is crucial for map videos. It perfectly projects HTML text elements (like "Saudi Arabia" or "Mecca") over specific geographic coordinate points (Longitude/Latitude) on the WebGL map so that the text "sticks" to the map as the 3D camera moves.

## Usage / Example
```tsx
<MapLabel
  map={map}
  lngLat={[45.0, 24.0]}
  text="Saudi Arabia"
  startFrame={0}
  endFrame={208}
  frame={frame}
/>
```

## How It Works
1. **Props**: It takes the MapLibre `map` instance, a `lngLat` array (Longitude, Latitude), the `text` string, and timing properties (`frame`, `startFrame`, `endFrame`).
2. **Geospatial Projection**: It uses MapLibre's built-in `map.project(lngLat)` API. This takes real-world geographic coordinates and instantly converts them to X/Y pixel values on the 1080x1920 canvas.
3. **Absolute Positioning**: It creates a React `<div>` absolutely positioned at `left: pos.x` and `top: pos.y` using the projected coordinates.
4. **Transform Centering**: Uses `transform: "translate(-50%, -50%)"` to ensure the label is perfectly centered exactly on the coordinate point.

## Best Practices
* You **MUST** pass the MapLibre `map` instance to this component so it has the mathematical context required to run `map.project()`.
* Ensure `pointerEvents: "none"` is set on the container to prevent the text from blocking interactions with the map below.
