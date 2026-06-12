# Leading Visual Cuts Transition Technique

To prevent a blank or black screen during natural timing gaps in your Remotion Map animations (e.g., when the narrator pauses for a fraction of a second between scenes), you must use a **leading visual cut**.

Instead of turning off the maps or leaving the screen blank, cut to the next map and camera position **immediately after the previous scene ends**. This gives the viewer a brief visual landing point (0.3 to 0.5 seconds) to register the new geography before the text, voiceover, and animations begin.

---

## The Kosovo & Serbia Example

* **Scene 1 (Serbia Focus)**: Ends at frame `61`.
* **Scene 2 (Kosovo Population)**: Voiceover and countdown overlays start at frame `74`.
* **Transition Gap**: Frames `62 - 73` (12 frames, or ~0.4s).

### Implementation Strategy

1. **Activate the Map Early**: Update the map visibility flags in `Composition.tsx` so the target map becomes active at the transition frame (`62`):
   ```typescript
   // Visuals cut to Kosovo at frame 62; the overlays & count start at 74
   const showKosovo = (frame >= 21 && frame <= 47) || (frame >= 62 && frame <= 154);
   ```

2. **Align Camera Trajectory**: Position the camera on the target coordinates (`storyboard.json`) at the start of the cut (`62`) rather than waiting for the voiceover frame (`74`):
   ```json
   {
     "_comment": "Scene 2: Zoomed out, focus on Kosovo (frame 62)",
     "frame": 62,
     "center": [20.902, 42.602],
     "zoom": 7.5,
     "pitch": 40,
     "bearing": 5
   }
   ```

3. **Delay Overlays**: Keep text overlays, count-up cards, and decorative icons hidden until the voiceover frame range actually starts (frame `74`).

This leading visual cut eliminates blank/dead screen space and ensures the pacing of the video feels natural and premium.
