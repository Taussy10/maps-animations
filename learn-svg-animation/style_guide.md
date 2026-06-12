# Visual & Animation Style Guide

Use this prompt/document to guide the creation of future scenes or assets in the exact same style.

---

## 1. Style Definition Prompt (For AI/Design Generation)
> **Style Name:** Stick-Figure Doodle Meme (Wojak/Sam O'Nell-style)
> **Description:** Flat 2D vector doodle animation featuring high-contrast hand-drawn white heads with expressive, wrinkly facial details, sitting on simple black stick-figure bodies. Backdrops are simple, desaturated environments (grays, dark woods, muted stone bricks, flat pastel skies) with sketchy detail lines. No gradients, no soft shadows, and high outline thickness.

---

## 2. Graphic Design Blueprint (SVG Specifications)

### A. Line & Outline Weights
* **Main Outlines (Head, Body, Limbs, Bars):** Thick black strokes (`stroke="black" strokeWidth="4"` to `6`).
* **Details (Wrinkles, Hair, Texture Lines):** Medium/Thin black strokes (`strokeWidth="1.5"` to `2.5`).
* **Caps:** Always use rounded line ends (`strokeLinecap="round"`).

### B. Color Palette
* **Skin/Faces:** Plain white (`#ffffff`).
* **Limbs/Bodies:** Solid black (`#000000`).
* **Hair Colors:** Flat browns (`#5c3d2e`), blonde/yellow (`#ebdfa2`), or greys (`#888`).
* **Environments:** Flat desaturated tones—Stone gray (`#6e6e6e`), Cell dark gray (`#4d4d4d`), Sky blue (`#a5d8ff`), wood brown (`#8B4513`).

### C. Character Hierarchy & Layering (Critical)
Always overlay shapes in this order to hide inner borders:
1. Hair backing (for long hair / wigs)
2. White Face Circle/Cloud outlines with thick black strokes
3. Borderless smaller white circle fills (drawn exactly on top to cover intersecting outlines/cheeks)
4. Eyes, eyebrows, mouth, wrinkles, and front hair bangs
5. Neck & Body lines (extended upwards behind the head)

---

## 3. Remotion Animation Guide (Timelines & Physics)

### A. Walk Cycles
* **Vertical Bobbing:** Apply `Math.abs(Math.sin(frame / 3)) * 4` to the walking group to simulate steps.
* **Leg Swings:** Rotate stick legs reciprocally using `Math.sin(frame / 3) * 25` around their respective hip coordinate joints.

### B. Struggling / Heavy Lifting
* **Vibration:** Add high-frequency jitter using `Math.sin(frame * 2.2) * 2` to the coordinates to convey weight.
* **Sweat Drops:** Use a gravity-parabolic curve to shoot blue teardrop shapes away from the head:
  ```typescript
  const x = startX + vx * t;
  const y = startY + vy * t + 0.5 * gravity * t * t;
  ```

### C. Jumps / Leaps
* **Parabolic Arc:** Combine an interpolation on `X` (horizontal slide) with a spring-driven arc on `Y` going up and landing back down:
  ```typescript
  const jumpY = interpolate(jumpSpring, [0, 0.4, 1], [start, peak, land]);
  ```
