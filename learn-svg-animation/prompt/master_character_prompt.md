# Master Prompt for Riggable SVG Characters in React

**Instructions:** Copy the text below and paste it into ChatGPT, Claude, or any AI assistant whenever you need them to code a brand new riggable character component for your Remotion project.

---

Act as an expert React Developer and SVG Animation Specialist. I need you to write the code for a reusable, programmatic 2D SVG Character component for a Remotion video project. 

Please create a file named `Character.tsx` (or whatever specific character name I ask for) that strictly follows this architecture:

1. **Purely Functional & Reusable:** The component must accept `props` to control its physical state, roles, and joint rotations. Do not hardcode the animation logic (like `useCurrentFrame()`) inside the character itself. The character should only receive static numbers/strings as props, so the parent Scene component can control it.
2. **Required Props:**
   - `role` (string) - Changes the clothing/uniform colors.
   - `expression` (string) - Changes the mouth SVG path or eye shapes (e.g., "smiling", "sad", "angry").
   - `leftArmRotation` (number) - Controls the `transform: rotate()` of the left arm.
   - `rightArmRotation` (number) - Controls the `transform: rotate()` of the right arm.
   - `breatheScale` (number) - Controls a subtle Y-axis scale to simulate breathing.
3. **SVG Architecture (Crucial):**
   - Build the character entirely out of raw SVG primitives (`<rect>`, `<circle>`, `<path>`, `<line>`).
   - Group limbs cleanly using `<g>`.
   - **Pivot Points:** Any group that rotates (like an arm or a head) MUST have a specific `transformOrigin` set exactly at the joint (e.g., the shoulder coordinates).
   - Use dynamic string interpolation for mouth morphing (e.g., swapping out the `d` attribute of a `<path>` based on the `expression` prop).

**Example Output Structure:**
```tsx
import React from "react";

interface CharacterProps {
  role: "british" | "german";
  expression: "neutral" | "smiling" | "singing";
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
  // Logic for mouth paths and uniform colors goes here based on props

  return (
    <g style={{ transform: `scaleY(${breatheScale})`, transformOrigin: "bottom center" }}>
      {/* SVG Code with transformOrigins applied to joints */}
    </g>
  );
};
```

Please confirm you understand these architectural rules. I will then tell you which specific character I need you to build.
