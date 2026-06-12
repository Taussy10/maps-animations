# Remotion Map Animation: Component Architecture Playbook

This document explains the architecture pattern used in `Comp1.tsx` to orchestrate complex map animations, timeline events, and WebGL layer toggles without creating "spaghetti code." You can reuse this exact file structure for future map animation projects.

## 1. The Timeline Orchestrator Pattern

Instead of scattering `if (frame >= X)` logic wildly throughout the render block, we structure `Comp1.tsx` as a **Timeline Orchestrator**. 

The return block of `Comp1.tsx` should read like a movie script using nested `<Sequence>` tags. 

### Why we do this:
1. **Performance:** Remotion completely unmounts components that are outside their `<Sequence>` window, saving RAM and CPU.
2. **Relative Timing:** Components inside a sequence start their internal `useCurrentFrame()` at `0`. You don't have to pass complex `startFrame` props and manually subtract frames inside every component!
3. **Studio Readability (Scene Sequence Architecture):** By adding empty, named `<Sequence>` tags based on your `scenes.md`, you create beautiful, labeled folders in the Remotion Studio scrub bar. This visually segments the timeline making it incredibly easy to understand, without having to wrap global elements (like the Map or Captions) which would otherwise break global `useCurrentFrame` lookups.

### Example Template for the Return Block:

```tsx
return (
  <AbsoluteFill style={{ backgroundColor: isBlackScreen ? "black" : "transparent" }}>
    
    {/* 1. BACKGROUND ENGINE: Runs entire length of video */}
    <MapContainer mapRef={mapA} isVisible={!useMapB} />
    <MapContainer mapRef={mapB} isVisible={useMapB} />

    {/* 2. AUDIO (In a Sequence so it shows up neatly on the timeline) */}
    <Sequence from={0} durationInFrames={TOTAL_FRAMES} name="Audio">
      <Audio src={staticFile("voice.mp3")} />
    </Sequence>

    {/* 3. CAPTIONS (Rendered directly, conditionally) */}
    {isBlackScreen ? <CenterCaption frame={frame} /> : <Caption />}

    {/* 4. SCENES TIMELINE (For Remotion Editor visual organization) */}
    {/* Appending empty Sequences based on scenes.md segments the timeline perfectly! */}
    <Sequence from={0} durationInFrames={56} name="Scene 1 - What if New York was its own country?"><></></Sequence>
    <Sequence from={56} durationInFrames={7} name="Scene 2 - Well,"><></></Sequence>
    <Sequence from={63} durationInFrames={120} name="Scene 3 - if New York suddenly decided..."><></></Sequence>
    {/* ... continued for all scenes */}

  </AbsoluteFill>
);
```

---

## 2. WebGL Layer Toggling (The GPU Side)

While HTML elements (like floating labels and newspaper overlays) are handled perfectly by `<Sequence>` tags, **MapLibre layers (fills, glowing borders, and patterns) are drawn by the GPU.** 

You cannot use `<Sequence>` to toggle map borders. 

Instead, all WebGL manipulation happens inside a giant `useEffect` near the top of the file. This hook runs on every frame to push data directly to the MapLibre engine.

### The Standard WebGL `useEffect` Structure:

```tsx
useEffect(() => {
  if (!map) return;

  // 1. Calculate Camera Position (Lerping coordinates from storyboard.json)
  map.jumpTo({ center, zoom, pitch, bearing });

  // 2. Toggle Regional Borders & Highlights
  if (map.getLayer("country-border")) {
    const isVisible = frame >= START_FRAME && frame <= END_FRAME;
    
    map.setPaintProperty("country-border", "line-opacity", isVisible ? 1 : 0);
    map.setPaintProperty("country-fill", "fill-opacity", isVisible ? 0.8 : 0);
  }

  // 3. Toggle Custom SVG Patterns
  if (map.getLayer("country-pattern")) {
    const isPatternVisible = frame >= PATTERN_START && frame <= PATTERN_END;
    
    if (isPatternVisible && map.hasImage("custom-pattern")) {
      map.setPaintProperty("country-pattern", "fill-pattern", "custom-pattern");
    }
    map.setPaintProperty("country-pattern", "fill-opacity", isPatternVisible ? 0.6 : 0);
  }

}, [frame, map]);
```

---

## 3. The Dual-Map Seamless Cut Strategy

If a camera has to travel a huge distance (e.g., from the UK to Indonesia), panning across the globe causes the map engine to download thousands of unneeded tiles, leading to dropped frames and blank screens.

**The Solution:** Use `mapA` and `mapB`.
* Initialize `mapA` and `mapB` at the same time in your `onLoad` block.
* Both are perfectly synchronized with the camera tracker.
* `mapA` starts visible. `mapB` is `opacity: 0, visibility: hidden`.
* At the exact frame of the cut (e.g., frame 815), instantly swap their opacity and visibility in the React render block. The viewer experiences a perfect, instant camera cut with fully-loaded WebGL tiles.
