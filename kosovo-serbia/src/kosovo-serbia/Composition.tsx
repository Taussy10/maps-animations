import React, { useEffect, useRef, useState } from "react";
import {
  useCurrentFrame,
  AbsoluteFill,
  delayRender,
  continueRender,
  interpolate,
  Easing,
  useVideoConfig,
  spring,
  Audio,
  staticFile,
  Img,
  interpolateColors,
} from "remotion";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import storyboardData from "./storyboard.json";

// Import local GeoJSON data
import serbiaGeoJSON from "../../../data/serbia.json";
import serbiaWithKosovoGeoJSON from "../../../data/serbia_with_kosovo.json";
import kosovoGeoJSON from "../../../data/kosovo.json";
import voiceOverTimestamps from "../../timestamp-voice-over.json";
import { HumanStructure } from "../../../svgs/HumanStructure";
import { KosovoOutline } from "../../../svgs/KosovoOutline";
import { MoneySVG } from "../../../svgs/MoneySVG";
import { SubscribeAnimation } from "../../../shared/SubscribeAnimation";
import { CryingFaceSVG } from "../../../svgs/CryingFaceSVG";
import { AngryFaceSVG } from "../../../svgs/AngryFaceSVG";

interface CameraKeyframe {
  frame: number;
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
  easing?: string;
}

interface MapHighlight {
  country: string;
  color: string;
  opacity: number;
}

interface TextOverlay {
  id: string;
  text: string;
  map: string;
  coords: [number, number];
  fadeIn: [number, number];
  fadeOut: [number, number];
  offsetY: number;
  textStyle: React.CSSProperties;
}

interface StatCard {
  startValue: number;
  endValue: number;
  prefix?: string;
  suffix?: string;
  fadeIn: [number, number];
  countDuration: [number, number];
  fadeOut: [number, number];
  coords: [number, number];
  offsetY: number;
  textStyle: React.CSSProperties;
}

interface StoryboardConfig {
  cameraKeyframes: CameraKeyframe[];
  mapHighlights: MapHighlight[];
  textOverlays: TextOverlay[];
  statCards?: StatCard[];
}

interface WordEntry {
  word: string;
  frame_start: number;
  frame_end: number;
}

const storyboard = storyboardData as StoryboardConfig;
const allWords = voiceOverTimestamps.words as WordEntry[];

// ArcGIS satellite raster style
const SATELLITE_STYLE = {
  version: 8 as const,
  sources: {
    satellite: {
      type: "raster" as const,
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: "satellite",
      type: "raster" as const,
      source: "satellite",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
};

function getCameraPosition(
  frame: number,
  kf: CameraKeyframe[]
): { center: [number, number]; zoom: number; pitch: number; bearing: number } {
  if (kf.length === 0) return { center: [0, 0], zoom: 3, pitch: 0, bearing: 0 };
  if (frame <= kf[0].frame) return kf[0] as any;
  if (frame >= kf[kf.length - 1].frame) return kf[kf.length - 1] as any;

  for (let i = 0; i < kf.length - 1; i++) {
    const a = kf[i];
    const b = kf[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const ease =
        b.easing === "quadInOut" ? Easing.inOut(Easing.quad) : undefined;
      const o = {
        extrapolateLeft: "clamp" as const,
        extrapolateRight: "clamp" as const,
        easing: ease,
      };
      return {
        center: [
          interpolate(frame, [a.frame, b.frame], [a.center[0], b.center[0]], o),
          interpolate(frame, [a.frame, b.frame], [a.center[1], b.center[1]], o),
        ] as [number, number],
        zoom: interpolate(frame, [a.frame, b.frame], [a.zoom, b.zoom], o),
        pitch: interpolate(frame, [a.frame, b.frame], [a.pitch, b.pitch], o),
        bearing: interpolate(frame, [a.frame, b.frame], [a.bearing, b.bearing], o),
      };
    }
  }
  return kf[0] as any;
}

function getSVGPathFromGeoJSON(map: maplibregl.Map, geojson: any): string {
  if (!geojson || !geojson.features || geojson.features.length === 0) return "";
  const feature = geojson.features[0];
  const geometry = feature.geometry;
  let d = "";

  if (geometry.type === "Polygon") {
    const rings = geometry.coordinates;
    for (const ring of rings) {
      let ringPath = "";
      for (let i = 0; i < ring.length; i++) {
        const coord = ring[i];
        const pos = map.project(coord as [number, number]);
        if (!pos) continue;
        if (i === 0) {
          ringPath += `M ${pos.x} ${pos.y}`;
        } else {
          ringPath += ` L ${pos.x} ${pos.y}`;
        }
      }
      ringPath += " Z";
      d += ringPath + " ";
    }
  } else if (geometry.type === "MultiPolygon") {
    const polygons = geometry.coordinates;
    for (const polygon of polygons) {
      for (const ring of polygon) {
        let ringPath = "";
        for (let i = 0; i < ring.length; i++) {
          const coord = ring[i];
          const pos = map.project(coord as [number, number]);
          if (!pos) continue;
          if (i === 0) {
            ringPath += `M ${pos.x} ${pos.y}`;
          } else {
            ringPath += ` L ${pos.x} ${pos.y}`;
          }
        }
        ringPath += " Z";
        d += ringPath + " ";
      }
    }
  }
  return d;
}

const KOSOVO_HUMAN_COORDS: [number, number][] = [
  [20.902, 42.602], // Center
  [20.75, 42.70],   // North-West
  [21.05, 42.50],   // South-East
  [20.80, 42.50],   // South-West
  [21.00, 42.70],   // North-East
  [20.65, 42.60],   // West
  [21.15, 42.60],   // East
  [20.90, 42.80],   // North
  [20.90, 42.40],   // South
  [20.75, 42.35],   // South-West Edge
  [21.05, 42.80],   // North-East Edge
  [20.55, 42.45],   // West Edge
  [21.25, 42.55],   // East Edge
  [20.85, 42.75],   // North-Central
  [21.00, 42.45],   // South-Central
  [20.70, 42.55],   // West-Central
];

const SERBIA_HUMAN_COORDS: [number, number][] = [
  [20.989, 44.016], // Center
  [20.5, 44.2],     // West-Central
  [21.5, 43.8],     // East-Central
  [20.8, 44.5],     // North-West
  [21.2, 44.5],     // North-East
  [20.7, 43.6],     // South-West
  [21.3, 43.5],     // South-East
  [20.2, 44.8],     // Far West North
  [21.8, 44.2],     // Far East
  [20.1, 45.2],     // Vojvodina North-West
  [21.0, 45.4],     // Vojvodina North
  [21.8, 45.1],     // Vojvodina North-East
  [19.6, 45.0],     // West Border Vojvodina
  [20.4, 43.2],     // South-West Border
  [22.2, 44.5],     // East Border near Romania
  [22.4, 43.7],     // South-East Border
  [20.8, 44.8],     // North-Central
  [21.4, 44.8],     // North-East Vojvodina
  [21.0, 43.8],     // South-Central
  [20.6, 43.9],     // Central-West
  [21.5, 44.1],     // Central-East
  [20.3, 44.4],     // West
  [21.8, 44.6],     // East
  [20.7, 44.2],     // North-West Central
  [21.2, 44.2],     // North-East Central
  [20.9, 43.4],     // South
  [21.6, 43.2],     // Far South-East
  [20.2, 43.5],     // Far South-West
  [21.1, 45.0],     // Central Vojvodina
  [20.5, 44.6],     // Central West North
];

const KOSOVO_IN_SERBIA_COORDS: [number, number][] = [
  [20.4, 44.7], // North-West Serbia
  [21.4, 44.7], // North-East Serbia
  [20.4, 43.5], // South-West Serbia
  [21.4, 43.5], // South-East Serbia
];

const KOSOVO_IN_SERBIA_SCENE8_COORDS: [number, number][] = [
  [20.0, 45.2], // Vojvodina NW
  [20.9, 45.3], // Vojvodina N
  [21.7, 45.1], // Vojvodina NE
  [20.3, 44.5], // Central West
  [21.4, 44.4], // Central East
  [20.4, 43.8], // South West Central
  [21.1, 43.8], // South Central
  [21.7, 43.4], // South East
];

const KOSOVO_CITIES: { name: string; coords: [number, number]; fadeInFrame: number }[] = [
  { name: "Pristina", coords: [21.166, 42.662], fadeInFrame: 365 },
  { name: "Prizren", coords: [20.741, 42.231], fadeInFrame: 395 },
];

const SERBIA_CITIES: { name: string; coords: [number, number]; fadeInFrame: number }[] = [
  { name: "Belgrade", coords: [20.46, 44.818], fadeInFrame: 450 },
  { name: "Novi Sad", coords: [19.833, 45.25], fadeInFrame: 480 },
];

export const KosovoSerbiaComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Map containers
  const containerAtlantic = useRef<HTMLDivElement>(null);
  const containerKosovo = useRef<HTMLDivElement>(null);
  const containerSerbia = useRef<HTMLDivElement>(null);

  // Map instances
  const [mapAtlantic, setMapAtlantic] = useState<maplibregl.Map | null>(null);
  const [mapKosovo, setMapKosovo] = useState<maplibregl.Map | null>(null);
  const [mapSerbia, setMapSerbia] = useState<maplibregl.Map | null>(null);

  const [readyHandle] = useState(() => delayRender("Loading maps..."));
  const readyCount = useRef(0);
  const isInitialized = useRef(false);

  // Find active word based on frame
  const activeWord = allWords.find(
    (w) => frame >= w.frame_start && frame < w.frame_end
  );

  // Determine active map visibility
  // Scene 1 - Atlantic (0-20): Atlantic
  // Scene 1 - Kosovo (21-47): Kosovo
  // Scene 1 - Serbia (48-61): Serbia
  // Scene 2 (62-154) & Scene 5 (353-433): Kosovo (visuals cut early at 62/353)
  // Scene 3 (155-241) & Scene 4 (242-352): Serbia (visuals cut early at 155; overlays start at 158/245)
  const showAtlantic = frame >= 0 && frame <= 20;
  const showKosovo = (frame >= 21 && frame <= 47) || (frame >= 62 && frame <= 154) || (frame >= 353 && frame <= 433) || (frame >= 513 && frame <= 656) || (frame >= 833 && frame <= 909) || (frame >= 1002 && frame <= 1121) || (frame >= 1323 && frame <= 1348) || (frame >= 1743 && frame <= 1824) || (frame >= 1845 && frame <= 1899);
  const showSerbia = (frame >= 48 && frame <= 61) || (frame >= 155 && frame <= 352) || (frame >= 434 && frame <= 512) || (frame >= 657 && frame <= 833) || (frame >= 909 && frame <= 1002) || (frame >= 1122 && frame <= 1267) || (frame >= 1375 && frame <= 1466) || (frame >= 1514 && frame <= 1660) || (frame >= 1671 && frame <= 1742) || (frame >= 1825 && frame <= 1899);

  // Track if map loading is complete
  const onMapReady = () => {
    readyCount.current += 1;
    if (readyCount.current >= 3) {
      continueRender(readyHandle);
    }
  };

  // Initialize Maps
  useEffect(() => {
    if (isInitialized.current || !containerAtlantic.current || !containerKosovo.current || !containerSerbia.current) return;
    isInitialized.current = true;

    // Map A (Atlantic)
    const mAtlantic = new maplibregl.Map({
      container: containerAtlantic.current,
      style: SATELLITE_STYLE,
      center: [-30.0, 20.0],
      zoom: 4.5,
      interactive: false,
      attributionControl: false,
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });
    mAtlantic.on("load", () => {
      setMapAtlantic(mAtlantic);
      mAtlantic.once("idle", onMapReady);
    });

    // Map B (Kosovo)
    const styleKosovo = {
      ...SATELLITE_STYLE,
      sources: {
        ...SATELLITE_STYLE.sources,
        "kosovo-src": { type: "geojson" as const, data: kosovoGeoJSON as any },
      },
      layers: [
        ...SATELLITE_STYLE.layers,
        {
          id: "kosovo-fill",
          type: "fill" as const,
          source: "kosovo-src",
          paint: {
            "fill-color": "#0088FF",
            "fill-opacity": 0, // dynamic
          },
        },
        {
          id: "kosovo-border-outer",
          type: "line" as const,
          source: "kosovo-src",
          paint: {
            "line-color": "#FFFFFF",
            "line-width": 12,
            "line-blur": 8,
            "line-opacity": 0, // dynamic
          },
        },
        {
          id: "kosovo-border-inner",
          type: "line" as const,
          source: "kosovo-src",
          paint: {
            "line-color": "#FFFFFF",
            "line-width": 6,
            "line-blur": 3,
            "line-opacity": 0, // dynamic
          },
        },
        {
          id: "kosovo-border-core",
          type: "line" as const,
          source: "kosovo-src",
          paint: {
            "line-color": "#FFFFFF",
            "line-width": 2,
            "line-opacity": 0, // dynamic
          },
        },
      ],
    };

    const mKosovo = new maplibregl.Map({
      container: containerKosovo.current,
      style: styleKosovo,
      center: [20.902, 42.602],
      zoom: 8.5,
      interactive: false,
      attributionControl: false,
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });
    mKosovo.on("load", () => {
      setMapKosovo(mKosovo);
      mKosovo.once("idle", onMapReady);
    });

    // Map C (Serbia)
    const styleSerbia = {
      ...SATELLITE_STYLE,
      sources: {
        ...SATELLITE_STYLE.sources,
        "serbia-src": { type: "geojson" as const, data: serbiaGeoJSON as any },
        "serbia-with-kosovo-src": { type: "geojson" as const, data: serbiaWithKosovoGeoJSON as any },
        "kosovo-src": { type: "geojson" as const, data: kosovoGeoJSON as any },
      },
      layers: [
        ...SATELLITE_STYLE.layers,
        // Individual Serbia
        {
          id: "serbia-fill",
          type: "fill" as const,
          source: "serbia-src",
          paint: {
            "fill-color": "#C31E39", // Red
            "fill-opacity": 0,
          },
        },
        {
          id: "serbia-border-outer",
          type: "line" as const,
          source: "serbia-src",
          paint: { "line-color": "#FFFFFF", "line-width": 12, "line-blur": 8, "line-opacity": 0 },
        },
        {
          id: "serbia-border-inner",
          type: "line" as const,
          source: "serbia-src",
          paint: { "line-color": "#FFFFFF", "line-width": 6, "line-blur": 3, "line-opacity": 0 },
        },
        {
          id: "serbia-border-core",
          type: "line" as const,
          source: "serbia-src",
          paint: { "line-color": "#FFFFFF", "line-width": 2, "line-opacity": 0 },
        },
        // Individual Kosovo
        {
          id: "kosovo-fill-in-serbia",
          type: "fill" as const,
          source: "kosovo-src",
          paint: {
            "fill-color": "#0088FF", // Blue
            "fill-opacity": 0,
          },
        },
        {
          id: "kosovo-border-outer-in-serbia",
          type: "line" as const,
          source: "kosovo-src",
          paint: { "line-color": "#FFFFFF", "line-width": 12, "line-blur": 8, "line-opacity": 0 },
        },
        {
          id: "kosovo-border-inner-in-serbia",
          type: "line" as const,
          source: "kosovo-src",
          paint: { "line-color": "#FFFFFF", "line-width": 6, "line-blur": 3, "line-opacity": 0 },
        },
        {
          id: "kosovo-border-core-in-serbia",
          type: "line" as const,
          source: "kosovo-src",
          paint: { "line-color": "#FFFFFF", "line-width": 2, "line-opacity": 0 },
        },
        // Unified Serbia+Kosovo
        {
          id: "serbia-with-kosovo-fill",
          type: "fill" as const,
          source: "serbia-with-kosovo-src",
          paint: {
            "fill-color": "#C31E39", // Red
            "fill-opacity": 0,
          },
        },
        {
          id: "serbia-with-kosovo-border-outer",
          type: "line" as const,
          source: "serbia-with-kosovo-src",
          paint: { "line-color": "#FFFFFF", "line-width": 12, "line-blur": 8, "line-opacity": 0 },
        },
        {
          id: "serbia-with-kosovo-border-inner",
          type: "line" as const,
          source: "serbia-with-kosovo-src",
          paint: { "line-color": "#FFFFFF", "line-width": 6, "line-blur": 3, "line-opacity": 0 },
        },
        {
          id: "serbia-with-kosovo-border-core",
          type: "line" as const,
          source: "serbia-with-kosovo-src",
          paint: { "line-color": "#FFFFFF", "line-width": 2, "line-opacity": 0 },
        },
      ],
    };

    const mSerbia = new maplibregl.Map({
      container: containerSerbia.current,
      style: styleSerbia,
      center: [20.989, 44.016],
      zoom: 7.3,
      interactive: false,
      attributionControl: false,
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });
    mSerbia.on("load", () => {
      setMapSerbia(mSerbia);
      mSerbia.once("idle", onMapReady);
    });
  }, []);

  // Update cameras and layers based on active frame
  useEffect(() => {
    const camObj = getCameraPosition(frame, storyboard.cameraKeyframes);

    // Set camera to active map and update its layers
    if (showAtlantic && mapAtlantic) {
      mapAtlantic.jumpTo(camObj);
    } else if (showKosovo && mapKosovo) {
      mapKosovo.jumpTo(camObj);
      const highlight = storyboard.mapHighlights.find(h => h.country === "kosovo");
      const opacity = showKosovo ? (highlight ? highlight.opacity : 0.45) : 0;

      // WebGL borders are completely hidden during the drawing animation phase (513-543)
      let webglBorderOpacityScale = 1;
      if (frame >= 513 && frame < 543) {
        webglBorderOpacityScale = 0;
      }

      mapKosovo.setPaintProperty("kosovo-fill", "fill-opacity", opacity);
      mapKosovo.setPaintProperty("kosovo-border-outer", "line-opacity", (opacity > 0 ? 0.5 : 0) * webglBorderOpacityScale);
      mapKosovo.setPaintProperty("kosovo-border-inner", "line-opacity", (opacity > 0 ? 0.8 : 0) * webglBorderOpacityScale);
      mapKosovo.setPaintProperty("kosovo-border-core", "line-opacity", (opacity > 0 ? 1.0 : 0) * webglBorderOpacityScale);
    } else if (showSerbia && mapSerbia) {
      mapSerbia.jumpTo(camObj);
      const highlight = storyboard.mapHighlights.find(h => h.country === "serbia");
      const opacity = showSerbia ? (highlight ? highlight.opacity : 0.45) : 0;

      // WebGL borders are completely hidden during the drawing animation phase (657-687)
      let webglBorderOpacityScale = 1;
      if (frame >= 657 && frame < 687) {
        webglBorderOpacityScale = 0;
      }

      // Logic for Scene 21 & 22
      if (frame >= 1514 && frame <= 1563) {
        // Phase 1: Unified Map (Red)
        mapSerbia.setPaintProperty("serbia-with-kosovo-fill", "fill-opacity", opacity);
        mapSerbia.setPaintProperty("serbia-with-kosovo-border-outer", "line-opacity", (opacity > 0 ? 0.5 : 0) * webglBorderOpacityScale);
        mapSerbia.setPaintProperty("serbia-with-kosovo-border-inner", "line-opacity", (opacity > 0 ? 0.8 : 0) * webglBorderOpacityScale);
        mapSerbia.setPaintProperty("serbia-with-kosovo-border-core", "line-opacity", (opacity > 0 ? 1.0 : 0) * webglBorderOpacityScale);
        
        mapSerbia.setPaintProperty("serbia-fill", "fill-opacity", 0);
        mapSerbia.setPaintProperty("serbia-border-outer", "line-opacity", 0);
        mapSerbia.setPaintProperty("serbia-border-inner", "line-opacity", 0);
        mapSerbia.setPaintProperty("serbia-border-core", "line-opacity", 0);
        
        mapSerbia.setPaintProperty("kosovo-fill-in-serbia", "fill-opacity", 0);
        mapSerbia.setPaintProperty("kosovo-border-outer-in-serbia", "line-opacity", 0);
        mapSerbia.setPaintProperty("kosovo-border-inner-in-serbia", "line-opacity", 0);
        mapSerbia.setPaintProperty("kosovo-border-core-in-serbia", "line-opacity", 0);
      } else if ((frame >= 1564 && frame <= 1742) || (frame >= 1825 && frame <= 1899)) {
        // Phase 2, Scene 22, Scene 24, and Scene 26: Individual Maps (Serbia=Red, Kosovo=Blue)
        mapSerbia.setPaintProperty("serbia-with-kosovo-fill", "fill-opacity", 0);
        mapSerbia.setPaintProperty("serbia-with-kosovo-border-outer", "line-opacity", 0);
        mapSerbia.setPaintProperty("serbia-with-kosovo-border-inner", "line-opacity", 0);
        mapSerbia.setPaintProperty("serbia-with-kosovo-border-core", "line-opacity", 0);

        mapSerbia.setPaintProperty("serbia-fill", "fill-opacity", opacity);
        mapSerbia.setPaintProperty("serbia-border-outer", "line-opacity", (opacity > 0 ? 0.5 : 0) * webglBorderOpacityScale);
        mapSerbia.setPaintProperty("serbia-border-inner", "line-opacity", (opacity > 0 ? 0.8 : 0) * webglBorderOpacityScale);
        mapSerbia.setPaintProperty("serbia-border-core", "line-opacity", (opacity > 0 ? 1.0 : 0) * webglBorderOpacityScale);

        mapSerbia.setPaintProperty("kosovo-fill-in-serbia", "fill-opacity", opacity);
        mapSerbia.setPaintProperty("kosovo-border-outer-in-serbia", "line-opacity", (opacity > 0 ? 0.5 : 0) * webglBorderOpacityScale);
        mapSerbia.setPaintProperty("kosovo-border-inner-in-serbia", "line-opacity", (opacity > 0 ? 0.8 : 0) * webglBorderOpacityScale);
        mapSerbia.setPaintProperty("kosovo-border-core-in-serbia", "line-opacity", (opacity > 0 ? 1.0 : 0) * webglBorderOpacityScale);
      } else {
        // Default Logic (Normal Serbia)
        mapSerbia.setPaintProperty("serbia-with-kosovo-fill", "fill-opacity", 0);
        mapSerbia.setPaintProperty("serbia-with-kosovo-border-outer", "line-opacity", 0);
        mapSerbia.setPaintProperty("serbia-with-kosovo-border-inner", "line-opacity", 0);
        mapSerbia.setPaintProperty("serbia-with-kosovo-border-core", "line-opacity", 0);
        
        mapSerbia.setPaintProperty("kosovo-fill-in-serbia", "fill-opacity", 0);
        mapSerbia.setPaintProperty("kosovo-border-outer-in-serbia", "line-opacity", 0);
        mapSerbia.setPaintProperty("kosovo-border-inner-in-serbia", "line-opacity", 0);
        mapSerbia.setPaintProperty("kosovo-border-core-in-serbia", "line-opacity", 0);

        mapSerbia.setPaintProperty("serbia-fill", "fill-opacity", opacity);
        mapSerbia.setPaintProperty("serbia-border-outer", "line-opacity", (opacity > 0 ? 0.5 : 0) * webglBorderOpacityScale);
        mapSerbia.setPaintProperty("serbia-border-inner", "line-opacity", (opacity > 0 ? 0.8 : 0) * webglBorderOpacityScale);
        mapSerbia.setPaintProperty("serbia-border-core", "line-opacity", (opacity > 0 ? 1.0 : 0) * webglBorderOpacityScale);
      }
    }
  }, [frame, mapAtlantic, mapKosovo, mapSerbia, showAtlantic, showKosovo, showSerbia]);

  const containerStyle = {
    position: "absolute" as const,
    width: `${width}px`,
    height: `${height}px`,
    top: 0,
    left: 0,
  };

  const mapContainerStyle = {
    ...containerStyle,
    width: "150%",
    left: "-25%",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#1E293B" }}>
      <Audio src={staticFile("voice-over.mp3")} />
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&display=swap');`}
      </style>

      {/* 3D Perspective Wrapper for Map A: Atlantic */}
      <div
        style={{
          ...containerStyle,
          opacity: showAtlantic ? 1 : 0,
          visibility: showAtlantic ? "visible" : "hidden",
          zIndex: showAtlantic ? 1 : 0,
          perspective: "918px",
          perspectiveOrigin: "50% 20%",
          overflow: "hidden",
        }}
      >
        <div
          ref={containerAtlantic}
          style={{
            ...mapContainerStyle,
            transform: "rotateX(30deg) scale(2.0) translateY(-100px)",
            transformOrigin: "50% 50%",
          }}
        />
      </div>

      {/* 3D Perspective Wrapper for Map B: Kosovo */}
      <div
        style={{
          ...containerStyle,
          opacity: showKosovo ? 1 : 0,
          visibility: showKosovo ? "visible" : "hidden",
          zIndex: showKosovo ? 1 : 0,
          perspective: "918px",
          perspectiveOrigin: "50% 20%",
          overflow: "hidden",
        }}
      >
        <div
          ref={containerKosovo}
          style={{
            ...mapContainerStyle,
            transform: "rotateX(30deg) scale(2.0) translateY(-100px)",
            transformOrigin: "50% 50%",
          }}
        />
        {/* 3D-Aligned Overlays for Kosovo Map */}
        <div
          style={{
            ...mapContainerStyle,
            transform: "rotateX(30deg) scale(2.0) translateY(-100px)",
            transformOrigin: "50% 50%",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {/* Render Humans for Kosovo (Scene 2: frames 74 to 154) */}
          {frame >= 74 &&
            frame <= 154 &&
            mapKosovo &&
            KOSOVO_HUMAN_COORDS.map((coord, i) => {
              // Calculate threshold and appearance frame
              const appearanceFrame = 78 + (i / KOSOVO_HUMAN_COORDS.length) * (144 - 78);
              const scale = spring({
                frame: frame - appearanceFrame,
                fps: 30,
                config: { damping: 12, stiffness: 120 },
              });

              const pos = mapKosovo.project(coord);
              if (!pos) return null;

              const width = 35;
              const height = 52;

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${pos.x - width / 2}px`,
                    top: `${pos.y - height / 2}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: `scale(${scale})`,
                    opacity: scale,
                  }}
                >
                  <HumanStructure
                    fillColor="#FFFFFF"
                    glowColor="#FFFFFF"
                    glowWidth={3}
                    width="100%"
                    height="100%"
                  />
                </div>
              );
            })}

          {/* Render Stat Cards / Countdown Timer */}
          {storyboard.statCards
            ?.filter((card) => frame >= card.fadeIn[0] && frame <= card.fadeOut[1] && (card.country === "kosovo" || card.endValue === 1.6 || card.endValue === 4212 || card.endValue === 11 || card.endValue === 6000))
            .map((card, i) => {
              const countValue = interpolate(
                frame,
                card.countDuration,
                [card.startValue, card.endValue],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );

              let numberText = card.endValue > 100
                ? Math.round(countValue).toString()
                : countValue.toFixed(1);

              if (card.endValue === 11) {
                // For 11 billion, avoid printing 11.0 if it's already 11 exactly.
                numberText = countValue >= 11 ? "11" : countValue.toFixed(1);
              }

              const formattedText = `${card.prefix || ""}${numberText}${card.suffix || ""}`;

              const scale = spring({
                frame: frame - card.fadeIn[0],
                fps: 30,
                config: { damping: 12, stiffness: 120 },
              });

              const opacity = interpolate(
                frame,
                [card.fadeOut[0], card.fadeOut[1]],
                [1, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );

              const pos = mapKosovo ? mapKosovo.project(card.coords) : null;
              if (!pos) return null;

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${pos.x}px`,
                    top: `${pos.y + card.offsetY}px`,
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    opacity: opacity,
                    zIndex: 20,
                  }}
                >
                  <div style={card.textStyle}>{formattedText}</div>
                </div>
              );
            })}

          {/* Render City Names next to location dots for Kosovo (Scene 5: frames 353 to 433) */}
          {frame >= 353 &&
            frame <= 433 &&
            mapKosovo &&
            KOSOVO_CITIES.map((city, i) => {
              // Fade-in animation starting at city.fadeInFrame
              const opacity = interpolate(
                frame,
                [city.fadeInFrame, city.fadeInFrame + 10],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );

              // Spring scale pop-in
              const scale = spring({
                frame: frame - city.fadeInFrame,
                fps: 30,
                config: { damping: 12, stiffness: 120 },
              });

              const pos = mapKosovo.project(city.coords);
              if (!pos) return null;

              return (
                <div
                  key={`city-${i}`}
                  style={{
                    position: "absolute",
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    display: "flex",
                    alignItems: "center",
                    transform: `translate(-7px, -7px) scale(${scale})`, // center the dot
                    opacity: opacity,
                    zIndex: 30,
                  }}
                >
                  {/* City dot marker */}
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "50%",
                      border: "3px solid #000000",
                      boxShadow: "0 0 6px rgba(0,0,0,0.8)",
                      marginRight: "10px",
                    }}
                  />
                  {/* City name text */}
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 900,
                      fontSize: "44px",
                      color: "#FFFFFF",
                      WebkitTextStroke: "2px #000000",
                      textShadow: "3px 3px 0px #000000",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {city.name}
                  </span>
                </div>
              );
            })}

          {/* Animated SVG Border Drawing for Kosovo (Scene 7: frames 513 to 543) */}
          {frame >= 513 &&
            frame <= 543 &&
            mapKosovo &&
            (() => {
              const svgPath = getSVGPathFromGeoJSON(mapKosovo, kosovoGeoJSON);
              const dashOffset = interpolate(frame, [513, 543], [100, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              });

              return (
                <svg
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    left: 0,
                    top: 0,
                    pointerEvents: "none",
                  }}
                >
                  {/* Glowing blur under-path */}
                  <path
                    d={svgPath}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={12}
                    pathLength="100"
                    strokeDasharray="100"
                    strokeDashoffset={dashOffset}
                    style={{
                      filter: "blur(6px)",
                      opacity: 0.8,
                    }}
                  />
                  {/* Core sharp drawing path */}
                  <path
                    d={svgPath}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={3}
                    pathLength="100"
                    strokeDasharray="100"
                    strokeDashoffset={dashOffset}
                  />
                </svg>
              );
            })()}

          {/* Render Money SVG for Scene 9 (frames 833 to 909) */}
          {frame >= 833 &&
            frame <= 909 &&
            mapKosovo &&
            [
              { dx: -15, dy: -10, rot: -15, delay: 0 },
              { dx: 15, dy: 10, rot: 25, delay: 5 },
              { dx: 0, dy: 25, rot: -5, delay: 10 },
            ].map((conf, i) => {
              const scale = spring({
                frame: frame - (840 + conf.delay),
                fps: 30,
                config: { damping: 12, stiffness: 120 },
              });

              const pos = mapKosovo.project([20.902, 42.602]); // Center of Kosovo
              if (!pos) return null;

              const width = 80;
              const height = 40;

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${pos.x - width / 2 + conf.dx}px`,
                    top: `${pos.y - height / 2 + 30 + conf.dy}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: `scale(${scale}) rotate(${conf.rot}deg)`,
                    opacity: scale,
                  }}
                >
                  <MoneySVG
                    fillColor="#85bb65"
                    strokeColor="#FFFFFF"
                    strokeWidth={1.5}
                    width="100%"
                    height="100%"
                    style={{
                      filter: "drop-shadow(0 0 5px rgba(133, 187, 101, 0.75))"
                    }}
                  />
                </div>
              );
            })}

          {/* Render Broke Man SVG for Scene 11/12 (frames 1002 to 1121) */}
          {frame >= 1002 &&
            frame <= 1121 &&
            mapKosovo &&
            (() => {
              const scale = spring({
                frame: frame - 1010, // pop-in around frame 1010
                fps: 30,
                config: { damping: 12, stiffness: 120 },
              });

              const pos = mapKosovo.project([20.902, 42.602]); // Center of Kosovo
              if (!pos) return null;

              const width = 100;
              const height = 100;

              return (
                <div
                  style={{
                    position: "absolute",
                    left: `${pos.x - width / 2}px`,
                    top: `${pos.y - height / 2 + 20}px`, // below the text
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: `scale(${scale})`,
                    opacity: scale,
                  }}
                >
                  <Img
                    src={staticFile("poor-man.png")}
                    style={{
                      width: "100%",
                      height: "100%",
                      filter: "drop-shadow(0 0 10px rgba(136, 136, 136, 0.75))",
                    }}
                  />
                </div>
              );
            })()}
        </div>
      </div>

      {/* 3D Perspective Wrapper for Map C: Serbia */}
      <div
        style={{
          ...containerStyle,
          opacity: showSerbia ? 1 : 0,
          visibility: showSerbia ? "visible" : "hidden",
          zIndex: showSerbia ? 1 : 0,
          perspective: "918px",
          perspectiveOrigin: "50% 20%",
          overflow: "hidden",
        }}
      >
        <div
          ref={containerSerbia}
          style={{
            ...mapContainerStyle,
            transform: "rotateX(30deg) scale(2.0) translateY(-100px)",
            transformOrigin: "50% 50%",
          }}
        />
        {/* 3D-Aligned Overlays for Serbia Map */}
        <div
          style={{
            ...mapContainerStyle,
            transform: "rotateX(30deg) scale(2.0) translateY(-100px)",
            transformOrigin: "50% 50%",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {/* Animated SVG Border Drawing for Serbia (Scene 8: frames 657 to 687) */}
          {frame >= 657 &&
            frame <= 687 &&
            mapSerbia &&
            (() => {
              const svgPath = getSVGPathFromGeoJSON(mapSerbia, serbiaGeoJSON);
              const dashOffset = interpolate(frame, [657, 687], [100, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              });

              return (
                <svg
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    left: 0,
                    top: 0,
                    pointerEvents: "none",
                  }}
                >
                  {/* Glowing blur under-path */}
                  <path
                    d={svgPath}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={12}
                    pathLength="100"
                    strokeDasharray="100"
                    strokeDashoffset={dashOffset}
                    style={{
                      filter: "blur(6px)",
                      opacity: 0.8,
                    }}
                  />
                  {/* Core sharp drawing path */}
                  <path
                    d={svgPath}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={3}
                    pathLength="100"
                    strokeDasharray="100"
                    strokeDashoffset={dashOffset}
                  />
                </svg>
              );
            })()}
          {/* Render Humans for Serbia (Scene 3: frames 155 to 241) */}
          {frame >= 155 &&
            frame <= 241 &&
            mapSerbia &&
            SERBIA_HUMAN_COORDS.map((coord, i) => {
              const appearanceFrame = 163 + (i / SERBIA_HUMAN_COORDS.length) * (231 - 163);
              const scale = spring({
                frame: frame - appearanceFrame,
                fps: 30,
                config: { damping: 12, stiffness: 120 },
              });

              const pos = mapSerbia.project(coord);
              if (!pos) return null;

              const width = 35;
              const height = 52;

              return (
                <div
                  key={`serbia-human-${i}`}
                  style={{
                    position: "absolute",
                    left: `${pos.x - width / 2}px`,
                    top: `${pos.y - height / 2}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: `scale(${scale})`,
                    opacity: scale,
                  }}
                >
                  <HumanStructure
                    fillColor="#FFFFFF"
                    glowColor="#FFFFFF"
                    glowWidth={3}
                    width="100%"
                    height="100%"
                  />
                </div>
              );
            })}

          {/* Render Stat Cards / Countdown Timer for Serbia */}
          {storyboard.statCards
            ?.filter((card) => frame >= card.fadeIn[0] && frame <= card.fadeOut[1] && (card.endValue === 6.6 || card.endValue === 34116 || card.endValue === 80 || card.endValue === 13000))
            .map((card, i) => {
              const countValue = interpolate(
                frame,
                card.countDuration,
                [card.startValue, card.endValue],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );

              let numberText = card.endValue > 100
                ? Math.round(countValue).toString()
                : countValue.toFixed(1);
              
              if (card.endValue === 80) { // For Scene 10 later
                numberText = countValue >= 80 ? "80" : countValue.toFixed(1);
              }

              const formattedText = `${card.prefix || ""}${numberText}${card.suffix || ""}`;

              const scale = spring({
                frame: frame - card.fadeIn[0],
                fps: 30,
                config: { damping: 12, stiffness: 120 },
              });

              const opacity = interpolate(
                frame,
                [card.fadeOut[0], card.fadeOut[1]],
                [1, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );

              const pos = mapSerbia ? mapSerbia.project(card.coords) : null;
              if (!pos) return null;

              return (
                <div
                  key={`serbia-card-${i}`}
                  style={{
                    position: "absolute",
                    left: `${pos.x}px`,
                    top: `${pos.y + card.offsetY}px`,
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    opacity: opacity,
                    zIndex: 20,
                  }}
                >
                  <div style={card.textStyle}>{formattedText}</div>
                </div>
              );
            })}

          {/* Render 4 Kosovo Outlines for Scene 4 (frames 242 to 352) */}
          {frame >= 242 &&
            frame <= 352 &&
            mapSerbia &&
            KOSOVO_IN_SERBIA_COORDS.map((coord, i) => {
              // Staggered pop-in starting at frame 250, spaced by 15 frames
              const appearanceFrame = 250 + i * 15;
              const scale = spring({
                frame: frame - appearanceFrame,
                fps: 30,
                config: { damping: 12, stiffness: 120 },
              });

              const pos = mapSerbia.project(coord);
              if (!pos) return null;

              const width = 110;
              const height = 110;

              return (
                <div
                  key={`kosovo-shape-${i}`}
                  style={{
                    position: "absolute",
                    left: `${pos.x - width / 2}px`,
                    top: `${pos.y - height / 2}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: `scale(${scale}) rotate(${i * 12 - 18}deg)`,
                    opacity: scale,
                  }}
                >
                  <KosovoOutline
                    fillColor="rgba(0, 136, 255, 0.4)"
                    strokeColor="#FFFFFF"
                    strokeWidth={2.5}
                    width="100%"
                    height="100%"
                    style={{
                      filter: "drop-shadow(0 0 10px rgba(0, 136, 255, 0.75))"
                    }}
                  />
                </div>
              );
            })}

          {/* Render 8 Kosovo Outlines for Scene 8 (frames 657 to 833) */}
          {frame >= 657 &&
            frame <= 833 &&
            mapSerbia &&
            KOSOVO_IN_SERBIA_SCENE8_COORDS.map((coord, i) => {
              // Staggered pop-in starting at frame 776, spaced by 5 frames
              const appearanceFrame = 776 + i * 5;
              const scale = spring({
                frame: frame - appearanceFrame,
                fps: 30,
                config: { damping: 12, stiffness: 120 },
              });

              const pos = mapSerbia.project(coord);
              if (!pos) return null;

              const width = 85;
              const height = 85;

              return (
                <div
                  key={`kosovo-scene8-shape-${i}`}
                  style={{
                    position: "absolute",
                    left: `${pos.x - width / 2}px`,
                    top: `${pos.y - height / 2}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: `scale(${scale}) rotate(${i * 15 - 30}deg)`,
                    opacity: scale,
                  }}
                >
                  <KosovoOutline
                    fillColor="rgba(0, 136, 255, 0.4)"
                    strokeColor="#FFFFFF"
                    strokeWidth={2.5}
                    width="100%"
                    height="100%"
                    style={{
                      filter: "drop-shadow(0 0 10px rgba(0, 136, 255, 0.75))"
                    }}
                  />
                </div>
              );
            })}

          {/* Render City Names next to location dots for Serbia (Scene 6: frames 434 to 512) */}
          {frame >= 434 &&
            frame <= 512 &&
            mapSerbia &&
            SERBIA_CITIES.map((city, i) => {
              // Fade-in animation starting at city.fadeInFrame
              const opacity = interpolate(
                frame,
                [city.fadeInFrame, city.fadeInFrame + 10],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );

              // Spring scale pop-in
              const scale = spring({
                frame: frame - city.fadeInFrame,
                fps: 30,
                config: { damping: 12, stiffness: 120 },
              });

              const pos = mapSerbia.project(city.coords);
              if (!pos) return null;

              return (
                <div
                  key={`serbia-city-${i}`}
                  style={{
                    position: "absolute",
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    display: "flex",
                    alignItems: "center",
                    transform: `translate(-7px, -7px) scale(${scale})`, // center the dot
                    opacity: opacity,
                    zIndex: 30,
                  }}
                >
                  {/* City dot marker */}
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "50%",
                      border: "3px solid #000000",
                      boxShadow: "0 0 6px rgba(0,0,0,0.8)",
                      marginRight: "10px",
                    }}
                  />
                  {/* City name text */}
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 900,
                      fontSize: "44px",
                      color: "#FFFFFF",
                      WebkitTextStroke: "2px #000000",
                      textShadow: "3px 3px 0px #000000",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {city.name}
                  </span>
                </div>
              );
            })}

          {/* Render Money SVGs for Scene 10 (frames 909 to 1002) */}
          {frame >= 909 &&
            frame <= 1002 &&
            mapSerbia &&
            [
              { dx: -40, dy: -30, rot: -20, delay: 0 },
              { dx: 30, dy: -25, rot: 15, delay: 2 },
              { dx: -15, dy: 10, rot: 5, delay: 4 },
              { dx: 45, dy: 20, rot: -10, delay: 6 },
              { dx: -35, dy: 35, rot: 25, delay: 8 },
              { dx: 25, dy: 45, rot: -5, delay: 10 },
              { dx: 0, dy: -15, rot: 10, delay: 12 },
              { dx: -55, dy: 0, rot: -15, delay: 14 },
              { dx: 55, dy: -5, rot: 20, delay: 16 },
              { dx: -20, dy: 50, rot: -8, delay: 18 },
              { dx: 10, dy: 30, rot: 12, delay: 20 },
              { dx: -50, dy: 25, rot: 18, delay: 22 },
              { dx: 35, dy: 5, rot: -25, delay: 24 },
            ].map((conf, i) => {
              const scale = spring({
                frame: frame - (916 + conf.delay),
                fps: 30,
                config: { damping: 12, stiffness: 120 },
              });

              const pos = mapSerbia.project([20.989, 44.016]); // Center of Serbia
              if (!pos) return null;

              const width = 80;
              const height = 40;

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${pos.x - width / 2 + conf.dx}px`,
                    top: `${pos.y - height / 2 + 50 + conf.dy}px`, // below text
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: `scale(${scale}) rotate(${conf.rot}deg)`,
                    opacity: scale,
                  }}
                >
                  <MoneySVG
                    fillColor="#85bb65"
                    strokeColor="#FFFFFF"
                    strokeWidth={1.5}
                    width="100%"
                    height="100%"
                    style={{
                      filter: "drop-shadow(0 0 5px rgba(133, 187, 101, 0.75))"
                    }}
                  />
                </div>
              );
            })}

          {/* Render Rich Man Img for Scene 13 (frames 1122 to 1216) */}
          {frame >= 1122 &&
            frame <= 1216 &&
            mapSerbia &&
            (() => {
              const scale = spring({
                frame: frame - 1130, // pop-in around frame 1130
                fps: 30,
                config: { damping: 12, stiffness: 120 },
              });

              const pos = mapSerbia.project([20.989, 44.016]); // Center of Serbia
              if (!pos) return null;

              const width = 120;
              const height = 120;

              return (
                <div
                  style={{
                    position: "absolute",
                    left: `${pos.x - width / 2}px`,
                    top: `${pos.y - height / 2 + 20}px`, // below the text
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: `scale(${scale})`,
                    opacity: scale,
                  }}
                >
                  <Img
                    src={staticFile("rich-man.png")}
                    style={{
                      width: "100%",
                      height: "100%",
                      filter: "drop-shadow(0 0 10px rgba(255, 51, 51, 0.75))",
                    }}
                  />
                </div>
              );
            })()}

          {/* Render 2 Kosovo Outlines for Scene 14 (frames 1217 to 1267) */}
          {frame >= 1217 &&
            frame <= 1267 &&
            mapSerbia &&
            [
              [20.5, 44.5], // Left side
              [21.5, 43.5], // Right side
            ].map((coord, i) => {
              const scale = spring({
                frame: frame - (1225 + i * 5), // Stagger pop-in
                fps: 30,
                config: { damping: 12, stiffness: 120 },
              });

              const pos = mapSerbia.project(coord as [number, number]);
              if (!pos) return null;

              const width = 100;
              const height = 100;

              return (
                <div
                  key={`kosovo-scene14-${i}`}
                  style={{
                    position: "absolute",
                    left: `${pos.x - width / 2}px`,
                    top: `${pos.y - height / 2}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: `scale(${scale}) rotate(${i * 15 - 5}deg)`,
                    opacity: scale,
                  }}
                >
                  <KosovoOutline
                    fillColor="rgba(0, 136, 255, 0.4)"
                    strokeColor="#FFFFFF"
                    strokeWidth={2.5}
                    width="100%"
                    height="100%"
                    style={{
                      filter: "drop-shadow(0 0 10px rgba(0, 136, 255, 0.75))"
                    }}
                  />
                </div>
              );
            })}

          {/* Render Crying Face SVG for Scene 19 (frames 1388 to 1466) */}
          {frame >= 1388 &&
            frame <= 1466 &&
            mapSerbia &&
            (() => {
              const pos = mapSerbia.project([20.989, 44.016]); // Center of Serbia
              if (!pos) return null;

              const width = 300;
              const height = 300;

              return (
                <div
                  style={{
                    position: "absolute",
                    left: `${pos.x - width / 2}px`,
                    top: `${pos.y - height / 2}px`, // Exactly in the center
                    width: `${width}px`,
                    height: `${height}px`,
                    zIndex: 20,
                  }}
                >
                  <CryingFaceSVG
                    startFrame={1388}
                    width="100%"
                    height="100%"
                    style={{
                      filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))"
                    }}
                  />
                </div>
              );
            })()}

          {/* Render Crying Face SVG on Serbia for Scene 22 (frames 1594 to 1660) */}
          {frame >= 1594 &&
            frame <= 1660 &&
            mapSerbia &&
            (() => {
              const pos = mapSerbia.project([20.989, 44.016]); // Center of Serbia
              if (!pos) return null;

              const width = 300;
              const height = 300;

              return (
                <div
                  style={{
                    position: "absolute",
                    left: `${pos.x - width / 2}px`,
                    top: `${pos.y - height / 2}px`, // Exactly in the center
                    width: `${width}px`,
                    height: `${height}px`,
                    zIndex: 20,
                  }}
                >
                  <CryingFaceSVG
                    startFrame={1594}
                    width="100%"
                    height="100%"
                    style={{
                      filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))"
                    }}
                  />
                </div>
              );
            })()}

          {/* Render Angry Face SVG on Serbia for Scene 24 (frames 1671 to 1742) */}
          {frame >= 1671 &&
            frame <= 1742 &&
            mapSerbia &&
            (() => {
              const pos = mapSerbia.project([20.989, 44.016]); // Center of Serbia
              if (!pos) return null;

              const width = 300;
              const height = 300;

              return (
                <div
                  style={{
                    position: "absolute",
                    left: `${pos.x - width / 2}px`,
                    top: `${pos.y - height / 2}px`, // Exactly in the center
                    width: `${width}px`,
                    height: `${height}px`,
                    zIndex: 20,
                  }}
                >
                  <AngryFaceSVG
                    startFrame={1671}
                    width="100%"
                    height="100%"
                    style={{
                      filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))"
                    }}
                  />
                </div>
              );
            })()}

          {/* Scene 21 "Serbia" Label over combined countries (frames 1514 to 1563) */}
          {frame >= 1514 && frame <= 1563 && mapSerbia && (() => {
            const pos = mapSerbia.project([20.989, 44.016]); // Serbia Center
            if (!pos) return null;
            return (
              <div
                style={{
                  position: "absolute",
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: "translate(-50%, -50%)",
                  fontSize: "80px",
                  fontWeight: 900,
                  fontFamily: "'Poppins', sans-serif",
                  color: "white",
                  textShadow: "0 0 30px white, 0 0 60px white",
                  zIndex: 30,
                  pointerEvents: "none",
                }}
              >
                Serbia
              </div>
            );
          })()}
        </div>
      </div>

      {/* Subtitles Overlay (Word-by-word) */}
      {activeWord && !(frame >= 1268 && frame <= 1322) && !(frame >= 1349 && frame <= 1374) && !(frame >= 1467 && frame <= 1513) && !(frame >= 1743 && frame <= 1824) && (
        <div
          style={{
            position: "absolute",
            bottom: "300px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "0 60px",
            boxSizing: "border-box",
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 900,
              fontSize: "84px",
              lineHeight: 1.2,
              color: "#FFFF00",
              textAlign: "center",
              WebkitTextStroke: "4px #000000",
              textShadow: "6px 6px 0px #000000",
              display: "inline-block",
            }}
          >
            {activeWord.word}
          </span>
        </div>
      )}

      {/* Scene 15: Black screen with text (frames 1268 to 1322) */}
      {frame >= 1268 && frame <= 1322 && (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "black", zIndex: 110, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontSize: "84px", fontWeight: 900, fontFamily: "'Poppins', sans-serif", display: "flex", flexWrap: "wrap", justifyContent: "center", width: "80%" }}>
            {["Kosovo's", "most", "famous", "singer?"].map((w, i) => {
              const isActive = activeWord?.word.replace(/[.,?]/g, '') === w.replace(/[.,?]/g, '');
              return (
                <span key={i} style={{ color: isActive ? "#FFFF00" : "white", marginRight: "20px", textShadow: "6px 6px 0px #000000" }}>{w}</span>
              );
            })}
          </div>
        </div>
      )}

      {/* Scene 17: Black screen with text (frames 1349 to 1374) */}
      {frame >= 1349 && frame <= 1374 && (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "black", zIndex: 110, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontSize: "84px", fontWeight: 900, fontFamily: "'Poppins', sans-serif", display: "flex", flexWrap: "wrap", justifyContent: "center", width: "80%" }}>
            {["And", "Serbia's?"].map((w, i) => {
              const isActive = activeWord?.word.replace(/[.,?]/g, '') === w.replace(/[.,?]/g, '');
              return (
                <span key={i} style={{ color: isActive ? "#FFFF00" : "white", marginRight: "20px", textShadow: "6px 6px 0px #000000" }}>{w}</span>
              );
            })}
          </div>
        </div>
      )}

      {/* Scene 20: Black screen with text (frames 1467 to 1513) */}
      {frame >= 1467 && frame <= 1513 && (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "black", zIndex: 110, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontSize: "84px", fontWeight: 900, fontFamily: "'Poppins', sans-serif", display: "flex", flexWrap: "wrap", justifyContent: "center", width: "80%" }}>
            {["Now", "for", "the", "controversial", "stuff."].map((w, i) => {
              const isActive = activeWord?.word.replace(/[.,?]/g, '') === w.replace(/[.,?]/g, '');
              return (
                <span key={i} style={{ color: isActive ? "#FFFF00" : "white", marginRight: "20px", textShadow: "6px 6px 0px #000000" }}>{w}</span>
              );
            })}
          </div>
        </div>
      )}

      {/* Scene 23: Black screen with text (frames 1660 to 1670) */}
      {frame >= 1660 && frame <= 1670 && (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "black", zIndex: 110, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontSize: "84px", fontWeight: 900, fontFamily: "'Poppins', sans-serif", display: "flex", flexWrap: "wrap", justifyContent: "center", width: "80%" }}>
            {["Yeah,"].map((w, i) => {
              const isActive = activeWord?.word.replace(/[.,?]/g, '') === w.replace(/[.,?]/g, '');
              return (
                <span key={i} style={{ color: isActive ? "#FFFF00" : "white", marginRight: "20px", textShadow: "6px 6px 0px #000000" }}>{w}</span>
              );
            })}
          </div>
        </div>
      )}

      {/* Scene 25: Hand holding Kosovo map with timer (frames 1743 to 1824) */}
      {frame >= 1743 && frame <= 1824 && (
        <div style={{ position: "absolute", top: 0, left: 0, 
        width: "100%", height: "100%", zIndex: 110, display: "flex",
         justifyContent: "center", alignItems: "center", overflow: "hidden",
          }}>
          
          {/* Hand holding Kosovo map (ON TOP of the text) */}
          <div style={{ position: "absolute",     bottom: "550px", 
          right: "150px",
  
            zIndex: 112, opacity: interpolate(frame, [1743, 1755], 
            [0, 1], { extrapolateRight: "clamp" }) }}>
            <Img src={staticFile("holding-kosovo.png")} 
            style={{ width: "1000px", height: "auto",
               filter: "drop-shadow(0 -10px 20px rgba(0,0,0,0.5))" ,  
              

}} />
          </div>

          {/* Background Text: INDEPENDENT (glowing blue, behind the hand) */}
          <div style={{ position: "absolute", zIndex: 111, 
           
            fontSize: "140px", fontWeight: 900, fontFamily: "'Poppins', sans-serif", color: "white", textShadow: "0 0 40px #00aaff, 0 0 80px rgba(0, 170, 255, 0.8)", opacity: interpolate(frame, [1743, 1755], [0, 1], { extrapolateRight: "clamp" }), whiteSpace: "nowrap" }}>
            INDEPENDENT
          </div>

          {/* Countdown timer above the map */}
          <div style={{ position: "absolute", top: "200px", zIndex: 113, fontSize: "140px", fontWeight: 900, fontFamily: "monospace, sans-serif", color: "#FFFF00", textShadow: "0 10px 20px rgba(0,0,0,0.9)", opacity: interpolate(frame, [1743, 1755], [0, 1], { extrapolateRight: "clamp" }) }}>
            {Math.round(interpolate(frame, [1750, 1820], [2026, 2008], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}
          </div>

        </div>
      )}

      {/* Scene 26: Subscribe Animation (frames 1845 to 1899) */}
      {frame >= 1845 && frame <= 1899 && (
        <div style={{ zIndex: 120 }}>
          <SubscribeAnimation startFrame={1845} />
        </div>
      )}

      {/* VS Overlay (and other text overlays) */}
      {storyboard.textOverlays
        .filter((overlay) => frame >= overlay.fadeIn[0] && frame <= overlay.fadeOut[1])
        .map((overlay, i) => {
          // Find active map for overlay coordinates projection
          const activeMap = showAtlantic ? mapAtlantic : showKosovo ? mapKosovo : mapSerbia;
          if (!activeMap) return null;

          return (
            <div
              key={overlay.id || i}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 5,
              }}
            >
              <span
                style={{
                  fontFamily: overlay.text === "VS" ? "sans-serif" : "'Poppins', sans-serif",
                  fontWeight: overlay.text === "VS" ? "bold" : 900,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  ...overlay.textStyle,
                }}
              >
                {overlay.text}
              </span>
            </div>
          );
        })}
    </AbsoluteFill>
  );
};
