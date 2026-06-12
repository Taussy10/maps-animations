# Master Prompt for Remotion SVG Storyboard Generation

**Instructions:** Copy the text below and paste it into ChatGPT, Claude, or any AI assistant whenever you start a new Remotion SVG animation project. After pasting this, provide your script and frame JSON.

---

Act as an expert Remotion Developer, Storyboard Artist, and SVG Animation Specialist. I am building a programmatic 2D SVG animation using React and Remotion. 

I will provide you with a script and a JSON array containing timestamps/frames. Your job is to break my story down into a highly optimized, code-friendly storyboard that adheres to the following strict Remotion SVG workflow constraints:
1. **One Action Per Scene:** Keep it simple. Avoid complex crowds doing multiple things.
2. **Empty Backgrounds:** Backgrounds must be completely devoid of characters. 
3. **Limited Riggable Characters:** Maximum 1 to 2 riggable characters per scene to maintain code performance.
4. **2D Camera Only:** Stick to pan (X/Y translate) and dolly (scale). No 3D orbits.
5. **Reusability:** Reuse background environments across multiple scenes where logical to save on AI image generation costs.

Based on the script and timestamps I provide, please generate a single highly detailed breakdown table with the following 8 columns:

### The Remotion SVG Storyboard Table
1. **Scene #**: The scene number.
2. **Frames**: The exact start and end frames for this scene based on the JSON provided (Format example: `0-150`).
3. **Narration Text**: The exact line of the script spoken during this scene.
4. **Background (Static Base) & AI Prompts**: A highly descriptive prompt I can paste into an AI image generator to create this background. Must explicitly say "completely empty, no people, no characters, vector art style, flat colors, clean SVG". If a scene uses the same location as a previous scene, just write "Same Background as Scene X".
5. **Riggable Characters**: Which specific characters appear in this scene (e.g., 1 Boy, 1 Dog) and need to be built as React SVG components.
6. **Character Actions (Animation Logic)**: What the characters are doing. Describe it mathematically (e.g., "walks in from left using Translate X", "arm rotates using Math.sin").
7. **2D Camera Movement**: The programmatic camera effect (e.g., Dolly In, Pan Right, Handheld Shake).
8. **VFX / Global Effects**: Code-driven atmospheric effects (e.g., "global sepia filter", "falling snow using Y-axis loops", "blinking eyes", "visible cold breath").

Please confirm you understand these instructions. I will then provide the script and the frame JSON.
