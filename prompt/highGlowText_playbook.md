# Component Playbook: `AllahText`

This is a specialized, animated, full-screen text overlay used to display giant, glowing Arabic text ("الله") with a spring physics pop-in effect and a graceful fade out.

## Usage / Example
```tsx
<Sequence from={209} durationInFrames={59} name="Scene 5-6: Allah Text">
  <AllahText startFrame={0} endFrame={58} />
</Sequence>
```

## How It Works
1. **Spring Animation**: Uses Remotion's `spring()` utility to make the text scale up from 0 to its full size immediately at `startFrame`, giving it a "pop" effect.
2. **Glow Styling**: Uses heavy CSS `textShadow` logic (`0 0 20px #00FF00, 0 0 40px #00FF00...`) to generate a strong neon glow around the text without using slow Canvas filters.
3. **Fade Out**: Contains built-in opacity logic that detects when the current frame is 10 frames away from the `endFrame`. It then linearly interpolates the opacity down to 0, providing a smooth exit transition.

## Best Practices
* This component operates using relative timing if placed inside a `<Sequence>`. Therefore, pass `startFrame={0}` and `endFrame={DURATION_OF_SEQUENCE}`.
* When reusing this component for other words or emojis, ensure you keep the `display: "flex", justifyContent: "center"` wrapper so the pop-in scale animation expands perfectly outwards from the center of the screen.
