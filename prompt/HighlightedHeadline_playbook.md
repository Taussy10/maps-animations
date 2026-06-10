# Component Playbook: `HighlightedHeadline`

This component creates a stylish "Google News"-style animated newspaper clipping. It allows you to sweep a yellow highlighter across specific words at exact frames.

## Usage / Example
```tsx
<Sequence from={71} durationInFrames={117} name="Newspaper Headline">
  <HighlightedHeadline startFrame={0} />
</Sequence>
```

## How It Works
1. **The HTML Layout**: It builds a fake news article layout using nested `<div>` and `<span>` elements, using standard CSS fonts (Georgia, Arial).
2. **The `HighlightWord` Helper**: This is an internal mini-component that wraps text. It accepts a `triggerFrame`.
3. **Spring Physics**: Inside `HighlightWord`, a `spring()` animation triggers based on `frame - triggerFrame`. It calculates a `widthPercentage` from `0` to `100`.
4. **The Highlighter Effect**: A yellow background `<span>` behind the text dynamically changes its width from 0% to 100%, creating the effect of a marker sliding across the word.
5. **3D Zoom**: The entire container subtly scales up over time using `interpolate(localFrame, [0, 116], [1, 1.05])`.

## Best Practices
* **Relative Timing**: Wrap this component in a `<Sequence>` tag and set `startFrame={0}`. All animations inside (like the zoom and highlighter) will calculate timing relative to the start of the sequence.
* **Editing the Text**: Directly change the text inside the JSX. 
* **Editing the Highlights**: Adjust the `triggerFrame={X}` prop on `<HighlightWord>` to make the highlighter sweep across the word sooner or later.
