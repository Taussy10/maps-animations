import React, { useEffect, useRef, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, delayRender, continueRender, Audio, staticFile, interpolate, Sequence, OffthreadVideo } from "remotion";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Caption } from "../components/Caption";
import { CenterCaption } from "../components/CenterCaption";
import { SvgBorder } from "../components/SvgBorder";
import { StatCardOverlay } from "../components/StatCardOverlay";
import { AllahText } from "../components/AllahText";
import { MapLabel } from "../components/MapLabel";
import { ShakingEmoji } from "../components/ShakingEmoji";
import { BigIcon } from "../components/BigIcon";
import { SubscribeAnimation } from "../../../shared/SubscribeAnimation";
import saudiData from "../../../data/saudi_arabia.json";
import ukData from "../../../data/united_kingdom.json";
import indonesiaData from "../../../data/indonesia.json";
import storyboard from "./storyboard.json";
import { HighlightedHeadline } from "../components/HighlightedHeadline";
import { PieChartAnimation } from "../components/PieChartAnimation";

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

// Custom easing function (quadInOut)
function easeQuadInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

const PRE_RENDER_MODE = false; // Set to true to export the clean map-only video

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
      style: PRE_RENDER_MODE ? {
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
          "uk-source": {
            type: "geojson",
            data: ukData as any,
          },
          "indonesia-source": {
            type: "geojson",
            data: indonesiaData as any,
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
              "fill-opacity": 0,
            },
          },
          {
            id: "saudi-border-glow",
            type: "line",
            source: "saudi-source",
            paint: {
              "line-color": storyboard.mapHighlights[0].borderColor,
              "line-width": 12,
              "line-opacity": 0,
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
              "line-opacity": 0,
            },
          },
          {
            id: "uk-fill",
            type: "fill",
            source: "uk-source",
            paint: {
              "fill-color": storyboard.mapHighlights[1].color,
              "fill-opacity": 0,
            },
          },
          {
            id: "uk-border-glow",
            type: "line",
            source: "uk-source",
            paint: {
              "line-color": storyboard.mapHighlights[1].borderColor,
              "line-width": 12,
              "line-opacity": 0,
              "line-blur": 6
            },
          },
          {
            id: "uk-border",
            type: "line",
            source: "uk-source",
            paint: {
              "line-color": storyboard.mapHighlights[1].borderColor,
              "line-width": storyboard.mapHighlights[1].borderWidth,
              "line-opacity": 0,
            },
          },
          {
            id: "indonesia-fill",
            type: "fill",
            source: "indonesia-source",
            paint: {
              "fill-color": storyboard.mapHighlights[2].color,
              "fill-opacity": 0,
            },
          },
          {
            id: "indonesia-border-glow",
            type: "line",
            source: "indonesia-source",
            paint: {
              "line-color": storyboard.mapHighlights[2].borderColor,
              "line-width": 12,
              "line-opacity": 0,
              "line-blur": 6
            },
          },
          {
            id: "indonesia-border",
            type: "line",
            source: "indonesia-source",
            paint: {
              "line-color": storyboard.mapHighlights[2].borderColor,
              "line-width": storyboard.mapHighlights[2].borderWidth,
              "line-opacity": 0,
            },
          },
        ],
      } : { version: 8, sources: {}, layers: [] },
      center: storyboard.cameraKeyframes[0].center as [number, number],
      zoom: storyboard.cameraKeyframes[0].zoom,
      pitch: storyboard.cameraKeyframes[0].pitch,
      bearing: storyboard.cameraKeyframes[0].bearing,
      interactive: false,
      fadeDuration: 0,
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });

    mapInstance.once("idle", () => {
      continueRender(handle);
    });

    setMap(mapInstance);
  }, []);

  useEffect(() => {
    if (!map) return;

    try {
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
        lerp(start.center[0], end.center[0], easedProgress),
        lerp(start.center[1], end.center[1], easedProgress)
      ] as [number, number];
      
      const zoom = lerp(start.zoom, end.zoom, easedProgress);
      const pitch = lerp(start.pitch, end.pitch, easedProgress);
      const bearing = lerp(start.bearing, end.bearing, easedProgress);

      map.jumpTo({ center, zoom, pitch, bearing });

      // WebGL highlights and opacity updates
      if (map.getLayer("saudi-border")) {
        const saudiVisible = frame < 516;
        let saudiBorderOpacity = 1;
        if (frame >= 133 && frame <= 208) {
           saudiBorderOpacity = interpolate(frame, [133, 208], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        } else if (frame < 133) {
           saudiBorderOpacity = 0;
        }
        
        map.setPaintProperty("saudi-border", "line-opacity", saudiVisible ? saudiBorderOpacity : 0);
        map.setPaintProperty("saudi-border-glow", "line-opacity", saudiVisible ? saudiBorderOpacity * 0.4 : 0);
        map.setPaintProperty("saudi-fill", "fill-opacity", saudiVisible ? storyboard.mapHighlights[0].opacity : 0);
      }
      
      if (map.getLayer("uk-border")) {
        const ukVisible = frame >= 516 && frame <= 791;
        map.setPaintProperty("uk-border", "line-opacity", ukVisible ? 1 : 0);
        map.setPaintProperty("uk-border-glow", "line-opacity", ukVisible ? 0.4 : 0);
        map.setPaintProperty("uk-fill", "fill-opacity", ukVisible ? storyboard.mapHighlights[1].opacity : 0);
      }
      
      if (map.getLayer("indonesia-border")) {
        let indoOpacity = 0;
        if (frame >= 1269 && frame <= 1394) {
          indoOpacity = interpolate(frame, [1269, 1394], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        } else if (frame > 1394) {
          indoOpacity = 1;
        }

        const indoPatternVisible = frame >= 1395 && frame <= 1475;
        map.setPaintProperty("indonesia-border", "line-opacity", indoOpacity);
        map.setPaintProperty("indonesia-border-glow", "line-opacity", indoOpacity * 0.4);
        map.setPaintProperty("indonesia-fill", "fill-opacity", indoOpacity * storyboard.mapHighlights[2].opacity);
      }
      
    } catch (err) {
      console.warn("MapLibre update loop error:", err);
    }
  }, [frame, map]);

  // Determine active map: Use single map for everything
  const useMapB = frame >= 815; // Kept for logic if needed elsewhere, but not for rendering map container

  // Determine if we are in Scene 2, 3 (67-132), Scene 8 (344-368), Scene 15 (792-814) or Scene 20 (1130-1225) which require a black screen
  const isBlackScreen = (frame >= 67 && frame <= 132) || (frame >= 344 && frame <= 368) || (frame >= 792 && frame <= 814) || (frame >= 1130 && frame <= 1225);

  return (
    <AbsoluteFill style={{ backgroundColor: isBlackScreen ? "black" : "transparent" }}>
      {/* PRE-RENDERED VIDEO BACKGROUND */}
      {!PRE_RENDER_MODE && (
        <OffthreadVideo
          src={staticFile("most-muslims-map.mp4")}
          style={{ position: "absolute", width: "100%", height: "100%", zIndex: 0, objectFit: "cover", opacity: isBlackScreen ? 0 : 1 }}
        />
      )}

      {/* BACKGROUND MAPS */}
      <Sequence from={0} durationInFrames={1600} name="Maps">
        <div 
          ref={mapContainer} 
          style={{ 
            position: "absolute", 
            width: `${width}px`, 
            height: `${height}px`,
            opacity: PRE_RENDER_MODE ? (isBlackScreen ? 0 : 1) : 0,
            visibility: "visible",
            zIndex: 0,
            pointerEvents: "none"
          }} 
        />
      </Sequence>

      {/* AUDIO & GLOBAL CAPTIONS */}
      <Sequence from={0} durationInFrames={1600} name="Audio & Captions">
        {!PRE_RENDER_MODE && (isBlackScreen ? <CenterCaption frame={frame} /> : <Caption frame={frame} />)}
        {!PRE_RENDER_MODE && <Audio src={staticFile("voice.mp3")} />}
        
        {!PRE_RENDER_MODE && map && !isBlackScreen && storyboard.statCards?.map((card, idx) => (
          <StatCardOverlay key={idx} map={map} frame={frame} config={card as any} />
        ))}
      </Sequence>

      {/* 🎬 CHAPTER 1: INTRO (0 - 208) */}
      <Sequence from={0} durationInFrames={209} name="Chapter 1: Intro">
        {!PRE_RENDER_MODE && map && !isBlackScreen && (
          <MapLabel map={map} lngLat={[45.0, 24.0]} text="Saudi Arabia" startFrame={0} endFrame={208} frame={frame} />
        )}
        {!PRE_RENDER_MODE && map && !isBlackScreen && frame >= 133 && (
          <SvgBorder map={map} frame={frame} startFrame={133} endFrame={208} coordinates={saudiData.geometry.coordinates[0] as number[][]} color="#FFFFFF" />
        )}
      </Sequence>

      {/* 🎬 CHAPTER 2: SAUDI ARABIA (209 - 515) */}
      <Sequence from={209} durationInFrames={307} name="Chapter 2: Saudi Arabia">
        <Sequence from={0} durationInFrames={59} name="Allah Text">
          {!PRE_RENDER_MODE && !isBlackScreen && <AllahText startFrame={0} endFrame={58} />}
        </Sequence>

        <Sequence from={59} durationInFrames={76} name="Mecca & Medina">
          {!PRE_RENDER_MODE && map && !isBlackScreen && (
            <>
              <MapLabel map={map} lngLat={[39.8262, 21.4225]} text="Mecca" startFrame={268} endFrame={343} frame={frame} />
              <MapLabel map={map} lngLat={[39.6111, 24.4672]} text="Medina" startFrame={268} endFrame={343} frame={frame} />
            </>
          )}
        </Sequence>

        <Sequence from={160} durationInFrames={54} name="Nodding Emoji">
          {!PRE_RENDER_MODE && map && !isBlackScreen && (
            <ShakingEmoji map={map} lngLat={[45.0, 24.0]} emoji="🙅‍♂️" startFrame={0} endFrame={53} />
          )}
        </Sequence>
      </Sequence>

      {/* 🎬 CHAPTER 3: UNITED KINGDOM (516 - 791) */}
      <Sequence from={516} durationInFrames={276} name="Chapter 3: United Kingdom">
        <Sequence from={0} durationInFrames={71} name="UK Map">
          {!PRE_RENDER_MODE && map && !isBlackScreen && (
            <MapLabel map={map} lngLat={[-3.4, 55.3]} text="United Kingdom" startFrame={516} endFrame={586} frame={frame} />
          )}
        </Sequence>

        <Sequence from={71} durationInFrames={117} name="Newspaper Headline">
          {!PRE_RENDER_MODE && !isBlackScreen && <HighlightedHeadline startFrame={0} />}
        </Sequence>
      </Sequence>

      {/* 🎬 CHAPTER 4: GLOBAL CUTS (815 - 1129) */}
      <Sequence from={815} durationInFrames={315} name="Chapter 4: Global Cuts">
        <Sequence from={0} durationInFrames={93} name="Middle East Cross">
          {!PRE_RENDER_MODE && map && !isBlackScreen && (
            <BigIcon map={map} lngLat={[45.0, 25.0]} icon="❌" startFrame={0} endFrame={92} />
          )}
        </Sequence>

        <Sequence from={93} durationInFrames={95} name="SE Asia Tick">
          {!PRE_RENDER_MODE && map && !isBlackScreen && (
            <BigIcon map={map} lngLat={[95.0, 15.0]} icon="✅" startFrame={0} endFrame={94} />
          )}
        </Sequence>

        <Sequence from={200} durationInFrames={115} name="Pie Chart 50%">
          {!PRE_RENDER_MODE && !isBlackScreen && <PieChartAnimation startFrame={0} endFrame={114} />}
        </Sequence>
      </Sequence>

      {/* 🎬 CHAPTER 5: INDONESIA (1130 - 1475) */}
      <Sequence from={1130} durationInFrames={346} name="Chapter 5: Indonesia">
      </Sequence>

      {/* 🎬 CHAPTER 6: OUTRO (1476 - 1600) */}
      <Sequence from={1476} durationInFrames={124} name="Chapter 6: Outro">
        {!PRE_RENDER_MODE && !isBlackScreen && <SubscribeAnimation startFrame={0} />}
      </Sequence>

    </AbsoluteFill>
  );
};
