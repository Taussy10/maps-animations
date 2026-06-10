import React, { useEffect, useRef, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, delayRender, continueRender, Audio, staticFile } from "remotion";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Caption } from "../components/Caption";
import { CenterCaption } from "../components/CenterCaption";
import { SvgBorder } from "../components/SvgBorder";
import saudiData from "../../../data/saudi_arabia.json";
import storyboard from "./storyboard.json";

function interpolate(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

// Custom easing function (quadInOut)
function easeQuadInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export const Comp1: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [handle] = useState(() => delayRender());

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || map) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "esri-raster": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256,
          },
          "saudi-source": {
            type: "geojson",
            data: saudiData as any,
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
            id: "saudi-fill",
            type: "fill",
            source: "saudi-source",
            paint: {
              "fill-color": storyboard.mapHighlights[0].color,
              "fill-opacity": storyboard.mapHighlights[0].opacity,
            },
          },
          {
            id: "saudi-border-glow",
            type: "line",
            source: "saudi-source",
            paint: {
              "line-color": storyboard.mapHighlights[0].borderColor,
              "line-width": 12,
              "line-opacity": 0.4,
              "line-blur": 6
            },
          },
          {
            id: "saudi-border",
            type: "line",
            source: "saudi-source",
            paint: {
              "line-color": storyboard.mapHighlights[0].borderColor,
              "line-width": storyboard.mapHighlights[0].borderWidth,
              "line-opacity": 1,
            },
          },
        ],
      },
      center: storyboard.cameraKeyframes[0].center as [number, number],
      zoom: storyboard.cameraKeyframes[0].zoom,
      pitch: storyboard.cameraKeyframes[0].pitch,
      bearing: storyboard.cameraKeyframes[0].bearing,
      interactive: false,
      fadeDuration: 0,
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });

    mapInstance.on("load", () => {
      mapInstance.once("idle", () => {
        continueRender(handle);
      });
    });

    setMap(mapInstance);
  }, []);

  // Update Camera each frame
  useEffect(() => {
    if (!map) return;

    let start = storyboard.cameraKeyframes[0];
    let end = storyboard.cameraKeyframes[storyboard.cameraKeyframes.length - 1];
    
    // Find active keyframe segment
    for (let i = 0; i < storyboard.cameraKeyframes.length - 1; i++) {
      if (frame >= storyboard.cameraKeyframes[i].frame && frame <= storyboard.cameraKeyframes[i+1].frame) {
        start = storyboard.cameraKeyframes[i];
        end = storyboard.cameraKeyframes[i+1];
        break;
      }
    }

    if (frame > end.frame) {
      start = end;
    }

    const duration = end.frame - start.frame;
    let easedProgress = 0;
    
    if (duration > 0) {
      const progress = Math.min(Math.max((frame - start.frame) / duration, 0), 1);
      easedProgress = easeQuadInOut(progress);
    }

    const center = [
      interpolate(start.center[0], end.center[0], easedProgress),
      interpolate(start.center[1], end.center[1], easedProgress)
    ] as [number, number];
    
    const zoom = interpolate(start.zoom, end.zoom, easedProgress);
    const pitch = interpolate(start.pitch, end.pitch, easedProgress);
    const bearing = interpolate(start.bearing, end.bearing, easedProgress);

    map.jumpTo({ center, zoom, pitch, bearing });
  }, [frame, map]);

  // Determine if we are in Scene 2 or 3 (frames 67 to 132) which require a black screen
  const isBlackScreen = frame >= 67 && frame <= 132;

  return (
    <AbsoluteFill style={{ backgroundColor: isBlackScreen ? "black" : "transparent" }}>
      <div 
        ref={mapContainer} 
        style={{ 
          position: "absolute", 
          width: `${width}px`, 
          height: `${height}px`,
          opacity: isBlackScreen ? 0 : 1
        }} 
      />
      {map && !isBlackScreen && frame >= 133 && (
        <SvgBorder 
          map={map} 
          frame={frame} 
          startFrame={133} 
          endFrame={208} 
          coordinates={saudiData.geometry.coordinates[0] as number[][]} 
          color="#FFFFFF" 
        />
      )}
      {isBlackScreen ? <CenterCaption frame={frame} /> : <Caption frame={frame} />}
      <Audio src={staticFile("voice.mp3")} />
    </AbsoluteFill>
  );
};
