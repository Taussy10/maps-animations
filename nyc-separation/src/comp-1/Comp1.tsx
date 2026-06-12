import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  delayRender,
  continueRender,
  Sequence,
  Img,
} from "remotion";
import { Caption } from "./Caption";
import { CenterCaption } from "./CenterCaption";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import storyboard from "./storyboard.json";

// Import GeoJSONs
import usaData from "../../../data/usa.json";
import newYorkData from "../../../data/new_york.json";

export const Comp1: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [handle] = useState(() => delayRender());

  // Define the frames where the screen should be completely black
  const isBlackScreen = frame >= 56 && frame <= 66;

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "esri-raster": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
          },
          "usa-data": {
            type: "geojson",
            data: usaData as any,
          },
          "ny-data": {
            type: "geojson",
            data: newYorkData as any,
          },
        },
        layers: [
          {
            id: "esri-imagery-layer",
            type: "raster",
            source: "esri-raster",
            paint: {},
          },
          {
            id: "usa-fill",
            type: "fill",
            source: "usa-data",
            paint: {
              "fill-color": "#2b7fff", // Blue
              "fill-opacity": 0,
            },
          },
          {
            id: "usa-border",
            type: "line",
            source: "usa-data",
            paint: {
              "line-color": "#FFFFFF",
              "line-width": 3,
              "line-opacity": 0,
            },
          },
          {
            id: "ny-fill",
            type: "fill",
            source: "ny-data",
            paint: {
              "fill-color": "#00c950", // Dark Green
              "fill-opacity": 0,
            },
          },
          {
            id: "ny-border",
            type: "line",
            source: "ny-data",
            paint: {
              "line-color": "#FFFFFF",
              "line-width": 3,
              "line-opacity": 0,
            },
          },
        ],
      },
      center: [-98.5795, 39.8283],
      zoom: 1,
      interactive: false,
      fadeDuration: 0,
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });

    mapInstance.on("load", () => {
      mapInstance.once("idle", () => continueRender(handle));
    });

    setMap(mapInstance);

    return () => {
      // Let browser handle disposal to prevent crashes
    };
  }, []);

  // WebGL Updates
  useEffect(() => {
    if (!map) return;

    // Camera calculation based on storyboard
    let currentCenter = storyboard.cameraKeyframes[0].center as [
      number,
      number,
    ];
    let currentZoom = storyboard.cameraKeyframes[0].zoom;
    let currentPitch = storyboard.cameraKeyframes[0].pitch;
    let currentBearing = storyboard.cameraKeyframes[0].bearing;

    if (frame >= storyboard.cameraKeyframes[1].frame && frame < storyboard.cameraKeyframes[2].frame) {
      currentCenter = storyboard.cameraKeyframes[1].center as [number, number];
      currentZoom = storyboard.cameraKeyframes[1].zoom;
      currentPitch = storyboard.cameraKeyframes[1].pitch;
      currentBearing = storyboard.cameraKeyframes[1].bearing;
    } else if (frame >= storyboard.cameraKeyframes[2].frame && (!storyboard.cameraKeyframes[3] || frame < storyboard.cameraKeyframes[3].frame)) {
      const progress = spring({
        frame: frame - storyboard.cameraKeyframes[2].frame,
        fps,
        config: { damping: 200, mass: 1, stiffness: 50 },
        durationInFrames: 60,
      });

      const startK = storyboard.cameraKeyframes[1];
      const endK = storyboard.cameraKeyframes[2];

      currentCenter = [
        interpolate(progress, [0, 1], [startK.center[0], endK.center[0]]),
        interpolate(progress, [0, 1], [startK.center[1], endK.center[1]]),
      ] as [number, number];

      currentZoom = interpolate(progress, [0, 1], [startK.zoom, endK.zoom]);
      currentPitch = interpolate(progress, [0, 1], [startK.pitch, endK.pitch]);
      currentBearing = interpolate(progress, [0, 1], [startK.bearing, endK.bearing]);
    } else if (storyboard.cameraKeyframes[3] && frame >= storyboard.cameraKeyframes[3].frame) {
      const progress = spring({
        frame: frame - storyboard.cameraKeyframes[3].frame,
        fps,
        config: { damping: 200, mass: 1, stiffness: 50 },
        durationInFrames: 60,
      });

      const startK = storyboard.cameraKeyframes[2];
      const endK = storyboard.cameraKeyframes[3];

      currentCenter = [
        interpolate(progress, [0, 1], [startK.center[0], endK.center[0]]),
        interpolate(progress, [0, 1], [startK.center[1], endK.center[1]]),
      ] as [number, number];

      currentZoom = interpolate(progress, [0, 1], [startK.zoom, endK.zoom]);
      currentPitch = interpolate(progress, [0, 1], [startK.pitch, endK.pitch]);
      currentBearing = interpolate(progress, [0, 1], [startK.bearing, endK.bearing]);
    }

    map.jumpTo({
      center: currentCenter,
      zoom: currentZoom,
      pitch: currentPitch,
      bearing: currentBearing,
    });

    // Paints
    if (map.getLayer("usa-fill")) {
      const showUS = frame >= 67; // Scene 3
      map.setPaintProperty("usa-fill", "fill-opacity", showUS ? 0.5 : 0);
      map.setPaintProperty("usa-border", "line-opacity", showUS ? 1 : 0);
    }

    if (map.getLayer("ny-fill")) {
      const showNY = frame >= 109; // "Break" frame
      map.setPaintProperty("ny-fill", "fill-opacity", showNY ? 0.8 : 0);
      map.setPaintProperty("ny-border", "line-opacity", showNY ? 1 : 0);
    }
  }, [frame, map, fps]);

  return (
    <AbsoluteFill
      style={{ backgroundColor: isBlackScreen ? "black" : "transparent" }}
    >
      {/* 1. GLOBALS (Remain until the end) */}
      <div
        ref={mapContainer}
        style={{
          position: "absolute",
          width: `${width}px`,
          height: `${height}px`,
          opacity: isBlackScreen ? 0 : 1,
        }}
      />
      {/* 2. AUDIO & CAPTIONS */}
      <Sequence from={-192} durationInFrames={1500} name="Audio">
        <Audio src={staticFile("voice.mp3")} volume={1} />
      </Sequence>
      {isBlackScreen ? <CenterCaption frame={frame} /> : <Caption />}
      {/* 3. SCENES TIMELINE (For visual organization based on scenes.md) */}
      <Sequence
        from={0}
        durationInFrames={56}
        name="Scene 1 - What if New York was its own country?"
      >
        <></>
      </Sequence>
      <Sequence from={56} durationInFrames={7} name="Scene 2 - Well,">
        <></>
      </Sequence>
      <Sequence
        from={63}
        durationInFrames={120}
        name="Scene 3 - if New York suddenly decided..."
      >
        <></>
      </Sequence>
      <Sequence
        from={183}
        durationInFrames={143}
        name="Scene 4 - Zoran Mamdani would instantly become president..."
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Img
            src={staticFile("zohran-mamdani.png")}
            style={{
              width: "400px",
              height: "auto",
              transform: `scale(${spring({
                frame: frame - 183,
                fps,
                config: { damping: 12 },
              })})`,
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              borderRadius: "20px",
            }}
          />
        </div>
      </Sequence>
      <Sequence
        from={326}
        durationInFrames={42}
        name="Scene 5 - If we take a look at its economy,"
      >
        <></>
      </Sequence>
      <Sequence
        from={368}
        durationInFrames={108}
        name="Scene 6 - we can see that it would have a GDP..."
      >
        <></>
      </Sequence>
      <Sequence
        from={476}
        durationInFrames={147}
        name="Scene 7 - This amount of money would make the country richer..."
      >
        <></>
      </Sequence>
      <Sequence
        from={623}
        durationInFrames={57}
        name="Scene 8 - while still remaining behind India."
      >
        <></>
      </Sequence>
      <Sequence
        from={680}
        durationInFrames={86}
        name="Scene 9 - It would have a population of almost 20 million people,"
      >
        <