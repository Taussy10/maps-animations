import React from 'react';
import { interpolate, Easing, useVideoConfig } from 'remotion';
import maplibregl from 'maplibre-gl';

export const SvgBorder: React.FC<{
  map: maplibregl.Map;
  frame: number;
  startFrame: number;
  endFrame: number;
  coordinates: number[][]; 
  color: string;
}> = ({ map, frame, startFrame, endFrame, coordinates, color }) => {
  const { width, height } = useVideoConfig();

  if (frame < startFrame) return null;

  // Convert map coordinates to pixel coordinates
  const pathPoints = coordinates.map(coord => {
    const projected = map.project([coord[0], coord[1]]);
    return `${projected.x},${projected.y}`;
  });

  const svgPathData = `M ${pathPoints.join(" L ")} Z`;

  const dashOffset = interpolate(
    frame,
    [startFrame, endFrame],
    [100, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width, height, pointerEvents: "none", zIndex: 10 }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path
        d={svgPathData}
        fill="none"
        stroke={color}
        strokeWidth={6}
        pathLength="100"
        strokeDasharray="100"
        strokeDashoffset={dashOffset}
        filter="url(#glow)"
      />
    </svg>
  );
};
