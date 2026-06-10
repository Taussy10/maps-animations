import React from "react";
import { useVideoConfig, spring, interpolate } from "remotion";
import maplibregl from "maplibre-gl";

interface StatCardProps {
  map: maplibregl.Map;
  frame: number;
  config: {
    startValue: number;
    endValue: number;
    fadeIn: [number, number];
    countDuration: [number, number];
    fadeOut: [number, number];
    coords: [number, number];
    offsetY: number;
    textStyle: React.CSSProperties;
  };
}

export const StatCardOverlay: React.FC<StatCardProps> = ({ map, frame, config }) => {
  const { fps } = useVideoConfig();

  // If outside the active frame range, do not render
  if (frame < config.fadeIn[0] || frame > config.fadeOut[1]) {
    return null;
  }

  // Fade In (Spring scale)
  const scale = spring({
    frame: frame - config.fadeIn[0],
    fps,
    config: { damping: 12 },
  });

  // Fade Out (Opacity)
  const opacity = interpolate(
    frame,
    config.fadeOut,
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Number Counter
  const currentValue = interpolate(
    frame,
    config.countDuration,
    [config.startValue, config.endValue],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Project coordinates to pixels on screen
  const projected = map.project(config.coords);

  return (
    <div
      style={{
        position: "absolute",
        left: projected.x,
        top: projected.y + (config.offsetY || 0),
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        pointerEvents: "none",
        zIndex: 200,
        ...config.textStyle,
      }}
    >
      {Math.round(currentValue)} 
    </div>
  );
};
