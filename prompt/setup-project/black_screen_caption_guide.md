# Black Screen Transition & Centered Caption System

This guide explains how to transition a map animation to a pure black screen and display word-by-word, perfectly centered captions. This is highly useful for dramatic pauses or introductory hooks before revealing a map scene.

## Concept
Instead of splitting the timeline into completely separate React components, we use the `useCurrentFrame()` hook in the main composition to:
1. Detect if the current frame falls within a "Black Screen Scene".
2. Conditionally hide the MapLibre canvas and change the background to black.
3. Swap out the standard bottom-aligned `<Caption />` with a specialized `<CenterCaption />`.

---

## 1. Creating `CenterCaption.tsx`
Create a variant of the caption component that centers text on the screen using Flexbox and utilizes a large, bold, white font. It should read from the same `timestamp.json` as the regular caption component.

```tsx
import React from "react";
import timestamps from "./timestamp-Muslims.json";

interface WordEntry {
  word: string;
  frame_start: number;
  frame_end: number;
}

const allWords = timestamps.words as WordEntry[];

export const CenterCaption: React.FC<{ frame: number }> = ({ frame }) => {
  const activeWord = allWords.find(
    (w) => frame >= w.frame_start && frame < w.frame_end
  );

  if (!activeWord) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: "bold",
          fontSize: "140px",
          lineHeight: 1.2,
          color: "#FFFFFF",
          display: "inline-block",
        }}
      >
        {activeWord.word}
      </span>
    </div>
  );
};
```

---

## 2. Implementing the Transition in `Comp.tsx`
Inside your main composition, define the frame boundaries for the black screen. Use this boolean variable to swap components and alter CSS styles dynamically.

```tsx
export const Comp1: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Define the frames where the screen should be completely black
  const isBlackScreen = frame >= 67 && frame <= 132;

  return (
    <AbsoluteFill style={{ backgroundColor: isBlackScreen ? "black" : "transparent" }}>
      
      {/* MapLibre Container: Hidden during black screen scenes */}
      <div 
        ref={mapContainer} 
        style={{ 
          position: "absolute", 
          width: `${width}px`, 
          height: `${height}px`,
          opacity: isBlackScreen ? 0 : 1 // Hide map layer
        }} 
      />

      {/* Conditionally Render Captions */}
      {isBlackScreen ? (
        <CenterCaption frame={frame} />
      ) : (
        <Caption frame={frame} />
      )}
      
      {/* Audio Layer */}
      <Audio src={staticFile("voice.mp3")} />
    </AbsoluteFill>
  );
};
```

## Key Benefits
- **No Map Context Loss:** The MapLibre WebGL instance remains loaded in memory (just hidden via `opacity: 0`). When the black screen ends, the map instantly appears without needing to re-render or re-download tiles.
- **Perfect Sync:** Both `<Caption />` and `<CenterCaption />` derive their text purely from `frame`, meaning the transition between the two states is flawless.
