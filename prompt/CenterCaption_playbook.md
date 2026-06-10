# Component Playbook: `CenterCaption`

This component creates a large, centered caption synced with JSON timestamp data. It is primarily used for displaying giant single words during black screen transitions (e.g., "Prophet", "Muhammad").

## Usage / Example
```tsx
<CenterCaption frame={frame} />
```

## How It Works
1. **Timestamp Data**: It imports an external JSON file containing a `words` array. Each object in the array defines the `word`, `frame_start`, and `frame_end`.
2. **Frame Matching**: The component accepts the absolute `frame` from `Comp1.tsx` as a prop.
3. **Word Extraction**: It loops over the JSON data array using `allWords.find` to see if the current `frame` falls between a word's start and end frames.
4. **Rendering**: If a match is found, it renders a huge absolute-positioned `<div>` in the dead center of the screen displaying that specific word.

## Best Practices
* Since this component reads from a global `timestamps.json` array, you do not need to wrap it inside a `<Sequence>` tag. It will automatically hide itself when there is no active word for the current frame.
* To change the font style or color, adjust the `style` object directly inside `CenterCaption.tsx` (e.g., increasing `fontSize` or changing the Hex color to match the aesthetic).
