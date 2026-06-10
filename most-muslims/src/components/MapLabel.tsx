import React from "react";
import maplibregl from "maplibre-gl";

interface MapLabelProps {
  map: maplibregl.Map;
  lngLat: [number, number];
  text: string;
  startFrame: number;
  endFrame: number;
  frame: number;
}

export const MapLabel: React.FC<MapLabelProps> = ({ map, lngLat, text, startFrame, endFrame, frame }) => {
  if (frame < startFrame || frame > endFrame) return null;

  // Calculate position
  const pos = map.project(lngLat);

  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
        color: "#FFFFFF",
        fontFamily: "'Amiri', 'Arial', sans-serif",
        fontWeight: "bold",
        fontSize: "64px",
        // textShadow: "0 0 10px #FFFFFF, 0 0 20px #FFFFFF", // White glow
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {text}
    </div>
  );
};
