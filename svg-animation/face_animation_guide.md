# Methods for Animating Character Faces (e.g. Donald Trump)

Use this guide to choose and implement different facial styling and animation methods in future scenes.

---

## Method 1: The "South Park" Cutout Style (Circle/Transparent PNG)
Place a real cutout photo of the head and animate vector shapes on top of it.

### Implementation
1. Save the face photo as a transparent PNG (e.g. `public/trump_head.png`).
2. Render the image inside a group `<g>` tag and layer a vector mouth over it:
```tsx
import { Img, staticFile, useCurrentFrame, interpolate } from "remotion";

export const CutoutHead = () => {
  const frame = useCurrentFrame();
  
  // Calculate talking mouth scale (South Park style black hole mouth)
  const mouthScaleY = Math.abs(Math.sin(frame / 2)) * 1.5;

  return (
    <g id="cutout-head">
      {/* 1. Base Photo Head */}
      <image 
        href={staticFile("trump_head.png")} 
        x="100" y="50" width="100" height="100" 
      />
      
      {/* 2. Layered Vector Mouth for Talking (Centered over the photo's mouth) */}
      <ellipse 
        cx="150" 
        cy="125" 
        rx="8" 
        ry={6 * mouthScaleY} 
        fill="black" 
      />
    </g>
  );
};
```
* **Pros:** Instantly recognizable, comedic, fast setup.
* **Cons:** Face features are frozen; relies on the cutout puppet aesthetic.

---

## Method 2: The Hand-Drawn SVG Style (Meme/Doodle)
Recreate a cartoon version of the person using native SVG shapes and paths.

### Implementation
Map out key defining features (e.g., Donald Trump's swoop hair, red tie, wrinkly squints) in SVG paths:
```tsx
import { useCurrentFrame, interpolate } from "remotion";

export const SVGTrumpHead = () => {
  const frame = useCurrentFrame();
  
  // Dynamic mouth morph for speech
  const talkCycle = Math.abs(Math.sin(frame / 2.5));
  const mouthHeight = interpolate(talkCycle, [0, 1], [6, 22]);

  return (
    <g id="svg-head">
      {/* 1. Donald Trump Swoop Hair */}
      <path 
        d="M 90 70 Q 150 20 180 50 Q 140 60 110 70 Z" 
        fill="#ffd43b" 
        stroke="black" 
        strokeWidth="3.5" 
      />
      
      {/* 2. Head Circle */}
      <circle cx="130" cy="95" r="45" fill="white" stroke="black" strokeWidth="4" />
      
      {/* 3. Squinting Eyes & Brows */}
      {/* ... details ... */}
      
      {/* 4. Morphing SVG Mouth */}
      <ellipse cx="130" cy="115" rx="10" ry={mouthHeight} fill="black" />
    </g>
  );
};
```
* **Pros:** Matches the current doodle aesthetic perfectly; allows complex expressions and path morphing.
* **Cons:** Requires manual coordination of SVG path points.

---

## Method 3: Segmented Cutout Swap (Modular PNGs)
Cut the photo of the face into separate parts (eyes, nose, mouth shapes) and render them selectively.

### Implementation
Swap transparent PNG states on every frame inside Remotion:
```tsx
import { Img, staticFile, useCurrentFrame } from "remotion";

export const SegmentedHead = () => {
  const frame = useCurrentFrame();
  
  // Swap talking frames
  const mouthState = frame % 3; // 0, 1, 2
  const mouthImage = mouthState === 0 
    ? "trump_mouth_closed.png" 
    : mouthState === 1 
      ? "trump_mouth_half.png" 
      : "trump_mouth_wide.png";

  return (
    <g id="segmented-head">
      {/* Head without mouth */}
      <image href={staticFile("trump_face_base.png")} x="100" y="50" width="100" height="100" />
      {/* Swappable mouth PNG overlaid on top */}
      <image href={staticFile(mouthImage)} x="135" y="115" width="30" height="20" />
    </g>
  );
};
```
* **Pros:** High-quality photo detail with realistic talking structures.
* **Cons:** Requires asset preparation in graphic software (e.g. cutting out mouths/eyes).
