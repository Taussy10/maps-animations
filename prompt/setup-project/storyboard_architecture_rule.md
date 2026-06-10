# Config-Driven Storyboard Architecture (Kosovo-Serbia Standard)

When building or updating mapping videos in this project, **DO NOT** hardcode timings, text labels, camera movements, or country highlights directly into the React/TSX components.

We follow the **Config-Driven Engine** architecture used in the `kosovo-serbia` project:
1. **Storyboard Data:** We use a JSON file (e.g., `storyboard.json`) to hold all configurations.
2. **React Engine:** The TSX component (`Composition.tsx`) acts *only* as a renderer that parses the JSON configuration.

## The Structure of `storyboard.json`

The JSON should contain four main arrays:

### 1. `cameraKeyframes`
Controls the 3D map camera movements across the timeline.
```json
"cameraKeyframes": [
  {
    "_comment": "Scene 1: Zoomed out, focus on Kosovo (frame 62)",
    "frame": 62,
    "center": [20.902, 42.602],
    "zoom": 7.5,
    "pitch": 40,
    "bearing": 5,
    "easing": "quadInOut"
  }
]
```
The React engine will automatically interpolate the map between the `frame` points using `interpolate` or `spring`.

### 2. `mapHighlights`
Defines which countries will be colored.
```json
"mapHighlights": [
  {
    "country": "kosovo",
    "color": "#0088FF",
    "opacity": 0.45
  }
]
```

### 3. `textOverlays`
Defines all labels and on-screen text.
```json
"textOverlays": [
  {
    "id": "kosovo_label",
    "text": "Kosovo",
    "coords": [20.902, 42.602],
    "fadeIn": [21, 26],
    "fadeOut": [42, 47],
    "offsetY": -50,
    "textStyle": {
      "fontFamily": "Poppins, sans-serif",
      "fontWeight": 900,
      "fontSize": "120px",
      "color": "#FFFFFF",
      "WebkitTextStroke": "3px #000000"
    }
  }
]
```

### 4. `statCards`
Defines numerical count-ups and animations.
```json
"statCards": [
  {
    "country": "kosovo",
    "startValue": 0,
    "endValue": 1.6,
    "prefix": "$",
    "suffix": " Billion",
    "fadeIn": [74, 79],
    "countDuration": [79, 144],
    "fadeOut": [150, 154],
    "coords": [20.902, 42.95]
  }
]
```

---

### **CRITICAL RULE: Avoid SVG Overlays completely (Use the WebGL Layer Method)**

Drawing shapes on a separate transparent React SVG sheet is a weak design pattern for maps.

- **The solution:** Put all your borders and highlight colors directly inside MapLibre as **WebGL layers**.
- Since the borders and map are drawn by the same WebGL engine on the same canvas, it is **physically impossible for them to drift or go outside the lines**, even during extreme 3D rotations, pitches, or fast zoom-ins.
- *Otherwise your map highlights will flicker and drift.*