import React, { useEffect, useRef, useState } from "react";
import {
  useCurrentFrame,
  AbsoluteFill,
  delayRender,
  continueRender,
  interpolate,
  Easing,
  useVideoConfig,
} from "remotion";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import storyboardData from "./storyboard.json";

// Import local GeoJSON data
import serbiaGeoJSON from "../../../data/serbia_with_kosovo.json";
import kosovoGeoJSON from "../../../data/kosovo.json";
import voiceOverTimestamps from "../../timestamp-voice-over.json";

interface Camera {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
  easing?: string;
}

interface StoryboardScene {
  scene: string;
  startFrame: number;
  endFrame: number;
  text: string;
  cameraStart: Camera;
  cameraEnd: Camera;
  textOverlays: Array<{
    text: string;
    style: React.CSSProperties;
  }>;
  mapHighlights: string[];
}

interface WordEntry {
  word: string;
  frame_start: number;
  frame_end: number;
}

const storyboard = storyboardData as StoryboardScene[];
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

  // Find active scene
  const activeScene = storyboard.find(
    (s) => frame >= s.startFrame && frame <= s.endFrame
  ) || storyboard[0];

  // Find active word based on frame
  const activeWord = allWords.find(
    (w) => frame >= w.frame_start && frame < w.frame_end
  );

  // Determine active map visibility
  // Scene 1 (0-61): Atlantic
  // Scene 2 (74-154): Kosovo
  // Scene 3 (158-241): Serbia
  const showAtlantic = frame >= 0 && frame <= 61;
  const showKosovo = frame >= 74 && frame <= 154;
  const showSerbia = frame >= 158 && frame <= 241;

  // Track if map loading is complete
  const onMapReady = () => {
    readyCount.current += 1;
    if (readyCount.current >= 3) {
      continueRender(readyHandle);
    }
  };

  // Initialize Map A: Atlantic
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
      },
      layers: [
        ...SATELLITE_STYLE.layers,
        {
          id: "serbia-fill",
          type: "fill" as const,
          source: "serbia-src",
          paint: {
            "fill-color": "#C31E39",
            "fill-opacity": 0, // dynamic
          },
        },
        {
          id: "serbia-border-outer",
          type: "line" as const,
          source: "serbia-src",
          paint: {
            "line-color": "#FFFFFF",
            "line-width": 12,
            "line-blur": 8,
            "line-opacity": 0, // dynamic
          },
        },
        {
          id: "serbia-border-inner",
          type: "line" as const,
          source: "serbia-src",
          paint: {
            "line-color": "#FFFFFF",
            "line-width": 6,
            "line-blur": 3,
            "line-opacity": 0, // dynamic
          },
        },
        {
          id: "serbia-border-core",
          type: "line" as const,
          source: "serbia-src",
          paint: {
            "line-color": "#FFFFFF",
            "line-width": 2,
            "line-opacity": 0, // dynamic
          },
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

  // Update cameras and layers based on active scene
  useEffect(() => {
    if (!activeScene) return;

    const { startFrame, endFrame, cameraStart, cameraEnd, mapHighlights } = activeScene;
    const duration = endFrame - startFrame;
    const progress = frame - startFrame;

    // Easing check
    const easingFn = cameraStart.easing === "quadInOut"
      ? Easing.inOut(Easing.quad)
      : Easing.linear;

    // Calculate interpolated values
    const lat = interpolate(progress, [0, duration], [cameraStart.center[1], cameraEnd.center[1]], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easingFn,
    });
    const lng = interpolate(progress, [0, duration], [cameraStart.center[0], cameraEnd.center[0]], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easingFn,
    });
    const zoom = interpolate(progress, [0, duration], [cameraStart.zoom, cameraEnd.zoom], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easingFn,
    });
    const pitch = interpolate(progress, [0, duration], [cameraStart.pitch, cameraEnd.pitch], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easingFn,
    });
    const bearing = interpolate(progress, [0, duration], [cameraStart.bearing, cameraEnd.bearing], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easingFn,
    });

    const camObj = { center: [lng, lat] as [number, number], zoom, pitch, bearing };

    // Set camera to active map and update its layers
    if (showAtlantic && mapAtlantic) {
      mapAtlantic.jumpTo(camObj);
    } else if (showKosovo && mapKosovo) {
      mapKosovo.jumpTo(camObj);
      const isHighlighted = mapHighlights.includes("kosovo");
      mapKosovo.setPaintProperty("kosovo-fill", "fill-opacity", isHighlighted ? 0.45 : 0);
      mapKosovo.setPaintProperty("kosovo-border-outer", "line-opacity", isHighlighted ? 0.5 : 0);
      mapKosovo.setPaintProperty("kosovo-border-inner", "line-opacity", isHighlighted ? 0.8 : 0);
      mapKosovo.setPaintProperty("kosovo-border-core", "line-opacity", isHighlighted ? 1.0 : 0);
    } else if (showSerbia && mapSerbia) {
      mapSerbia.jumpTo(camObj);
      const isHighlighted = mapHighlights.includes("serbia");
      mapSerbia.setPaintProperty("serbia-fill", "fill-opacity", isHighlighted ? 0.45 : 0);
      mapSerbia.setPaintProperty("serbia-border-outer", "line-opacity", isHighlighted ? 0.5 : 0);
      mapSerbia.setPaintProperty("serbia-border-inner", "line-opacity", isHighlighted ? 0.8 : 0);
      mapSerbia.setPaintProperty("serbia-border-core", "line-opacity", isHighlighted ? 1.0 : 0);
    }
  }, [frame, activeScene, mapAtlantic, mapKosovo, mapSerbia, showAtlantic, showKosovo, showSerbia]);

  const containerStyle = {
    position: "absolute" as const,
    width: `${width}px`,
    height: `${height}px`,
    top: 0,
    left: 0,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#1E293B" }}>
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
            ...containerStyle,
            transform: "rotateX(30deg) scale(1.6) translateY(-150px)",
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
            ...containerStyle,
            transform: "rotateX(30deg) scale(1.6) translateY(-150px)",
            transformOrigin: "50% 50%",
          }}
        />
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
            ...containerStyle,
            transform: "rotateX(30deg) scale(1.6) translateY(-150px)",
            transformOrigin: "50% 50%",
          }}
        />
      </div>

      {/* Subtitles Overlay (Word-by-word) */}
      {activeWord && (
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

      {/* VS Overlay (and other text overlays) */}
      {activeScene.textOverlays.map((overlay, i) => {
        // Find active map for overlay coordinates projection
        const activeMap = showAtlantic ? mapAtlantic : showKosovo ? mapKosovo : mapSerbia;
        if (!activeMap) return null;

        return (
          <div
            key={i}
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
                fontWeight: overlay.text === "VS" ? "normal" : 900,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                ...overlay.style,
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
