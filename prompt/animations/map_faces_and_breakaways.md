# Map Faces & Breakaway Animations in Remotion

This guide explains how to recreate two advanced map animation techniques: **Breakaway Country Splits** and **Dynamic Map Faces**.

## 1. Breakaway Country Splits (Unified to Individual Swap)

When you need to show one country physically separating from another (or declaring independence), you cannot easily animate a single MapLibre map splitting apart. Instead, you swap the GeoJSON sources at the exact frame of the split!

### The Technique
1. **Phase 1 (The Unified Map):** Create a single GeoJSON file that merges both countries into one polygon (e.g., `serbia_with_kosovo.json`).
2. **Phase 2 (The Split):** Load the individual GeoJSON files for each country (e.g., `serbia.json` and `kosovo.json`).
3. **The Transition:** In your `Composition.tsx`'s `useEffect`, hook into `map.setPaintProperty`. At the exact frame the split happens, set the unified layer's `fill-opacity` and `line-opacity` to `0`, and simultaneously turn the individual layers' opacities up to `0.45`!

This instantly renders an inner border, creating the sudden visual "breakup".

## 2. Dynamic Map Faces (Emotions on Countries)

To make a country look like a character (crying, angry, etc.), do not try to draw facial features natively inside MapLibre. Instead, use React SVGs absolutely positioned perfectly over the country's center coordinates.

### The Technique
1. **Coordinate Projection:** Inside the `map` rendering block, use `map.project([longitude, latitude])` to convert the country's geographical center into exact X/Y pixel coordinates on the screen.
   ```typescript
   const pos = map.project([20.989, 44.016]); // Center of Serbia
   ```
2. **Absolute Positioning:** Wrap your SVG component in an absolutely positioned `<div>` and center it exactly over the projected coordinates.
   ```tsx
   <div style={{
     position: "absolute",
     left: `${pos.x - width / 2}px`,
     top: `${pos.y - height / 2}px`
   }}>
     <CryingFaceSVG />
   </div>
   ```
3. **SVG Expressions:** Because the SVG is an independent React component, you can use Remotion's `useCurrentFrame`, `interpolate`, and `spring` hooks inside it to animate tears, angry shaking, or color changes completely independently of the heavy MapLibre rendering engine.
