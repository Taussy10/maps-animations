# Config-Driven Animation Architecture

This guide explains how to combine **reusable character components** with a **storyboard JSON configuration** to create a scalable, easily editable animation system in Remotion.

---

## 1. The Storyboard Schema (`storyboard.json`)

Instead of hardcoding positions and timings, we store the script, camera cues, and character states in a structured JSON file.

### Example Schema
```json
{
  "meta": {
    "fps": 30,
    "width": 1280,
    "height": 720
  },
  "timeline": [
    {
      "scene": 1,
      "name": "Locked Up",
      "duration": 60,
      "text": "Hugo Grotius is locked away for life.",
      "characters": [
        {
          "id": "hugo",
          "role": "prisoner",
          "x": 640,
          "y": 400,
          "expression": "crying",
          "animation": { "type": "idle_bob" }
        },
        {
          "id": "guard",
          "role": "guard",
          "x": 280,
          "y": 420,
          "expression": "angry",
          "animation": { "type": "scan_eyes" }
        }
      ]
    },
    {
      "scene": 2,
      "name": "The Idea",
      "duration": 60,
      "text": "But he gets a brilliant idea.",
      "characters": [
        {
          "id": "hugo",
          "role": "prisoner",
          "x": 640,
          "y": 400,
          "expression": "smiling",
          "animation": { "type": "lightbulb", "triggerFrame": 10 }
        },
        {
          "id": "guard",
          "role": "guard",
          "x": 280,
          "y": 420,
          "expression": "angry",
          "animation": { "type": "idle" }
        }
      ]
    }
  ]
}
```

---

## 2. Reusable Character Component (`Character.tsx`)

The character component should be purely functional. It accepts props to control its role, expressions, and joint states.

```tsx
import React from "react";

interface CharacterProps {
  role: "guard" | "prisoner";
  expression: "crying" | "smiling" | "determined" | "angry";
  leftArmRotation?: number;
  rightArmRotation?: number;
  breatheScale?: number;
}

export const Character: React.FC<CharacterProps> = ({
  role,
  expression,
  leftArmRotation = 0,
  rightArmRotation = 0,
  breatheScale = 1,
}) => {
  // 1. Dynamic Mouth Morphing
  let mouthPath = "M 90 100 Q 100 100 110 100"; // neutral flat
  if (expression === "crying") {
    mouthPath = "M 90 100 Q 100 85 110 100"; // sad curve
  } else if (expression === "smiling") {
    mouthPath = "M 90 100 Q 100 118 110 100"; // happy curve
  }

  return (
    <g style={{ transform: `scale(${breatheScale})`, transformOrigin: "bottom center" }}>
      {/* Body / Clothing based on role */}
      {role === "guard" ? (
        <g id="guard-uniform">
          {/* Blue uniform line / badge details */}
        </g>
      ) : (
        <g id="prisoner-uniform">
          {/* Striped shirt lines */}
        </g>
      )}

      {/* Head */}
      <circle cx="100" cy="80" r="40" fill="white" stroke="black" strokeWidth="4" />

      {/* Dynamic Expression Layer */}
      <path d={mouthPath} stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
      {expression === "crying" && <circle cx="95" cy="85" r="2" fill="#74c0fc" />}

      {/* Limbs with rotated joints */}
      <g style={{ transformOrigin: "65px 160px", transform: `rotate(${leftArmRotation}deg)` }}>
        <line x1="65" y1="160" x2="45" y2="220" stroke="black" strokeWidth="4" />
      </g>
    </g>
  );
};
```

---

## 3. The React Engine (`StoryRenderer.tsx`)

The renderer reads the JSON, determines which scene matches the current frame, and computes the interpolation values to pass down to the characters.

```tsx
import { useCurrentFrame, Sequence } from "remotion";
import storyboard from "./storyboard.json";
import { Character } from "./Character";

export const StoryRenderer = () => {
  const frame = useCurrentFrame();

  // Find active scene based on cumulative frame counts
  let accumulatedFrames = 0;
  const activeScene = storyboard.timeline.find((scene) => {
    const start = accumulatedFrames;
    const end = accumulatedFrames + scene.duration;
    accumulatedFrames = end;
    return frame >= start && frame < end;
  });

  if (!activeScene) return null;

  // Calculate frame relative to the start of the current scene
  const sceneStartFrame = accumulatedFrames - activeScene.duration;
  const relativeFrame = frame - sceneStartFrame;

  return (
    <div style={{ flex: 1, backgroundColor: "white" }}>
      {/* Subtitles Overlay */}
      <div style={{ position: "absolute", bottom: 50, width: "100%", textAlign: "center" }}>
        <p style={{ fontSize: "28px", color: "black", fontFamily: "sans-serif" }}>
          {activeScene.text}
        </p>
      </div>

      {/* Characters */}
      <svg width="1280" height="720" viewBox="0 0 1280 720">
        {activeScene.characters.map((char) => {
          // Calculate dynamic animation values based on activeScene.animation rules...
          return (
            <g key={char.id} style={{ transform: `translate(${char.x}px, ${char.y}px)` }}>
              <Character 
                role={char.role as "guard" | "prisoner"} 
                expression={char.expression as "crying" | "smiling"} 
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
```
