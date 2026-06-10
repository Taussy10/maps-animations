import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import maplibregl from "maplibre-gl";

interface BigIconProps {
  map: maplibregl.Map;
  lngLat: [number, number];
  icon: string;
  startFrame: number;
  endFrame: number;
  color?: string;
}

export const BigIcon: React.FC<BigIconProps> = ({
  map,
  lngLat,
  icon,
  startFrame,
  endFrame,
  color,
}) => {
  const frame = useCurrentFrame();

  if (frame < startFrame || frame > endFrame) return null;

  const pos = map.project(lngLat);
  const localFrame = frame - startFrame;

  // Scale in smoothly
  const scale = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        fontSize: "200px",
        pointerEvents: "none",
        zIndex: 60,
        color: color || "inherit",
        textShadow: "0px 15px 30px rgba(0,0,0,0.5)",
      }}
    >
      {icon}
    </div>
  );
};
