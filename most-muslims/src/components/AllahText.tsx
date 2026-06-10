import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export const AllahText: React.FC<{ startFrame: number; endFrame: number }> = ({ startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Only render during the specified frames
  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  // Animate the scale of the text using a spring
  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  // Fade out towards the end
  const opacity = frame > endFrame - 10 ? (endFrame - frame) / 10 : 1;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 110,
        pointerEvents: "none",
        opacity,
      }}
    >
      <span
        style={{
          fontFamily: "'Amiri', 'Arial', sans-serif", // Standard Arabic fonts
          fontWeight: "bold",
          fontSize: "250px",
          color: "#FFFFFF", // White text
          textShadow: "0 0 20px #00FF00, 0 0 40px #00FF00, 0 0 60px #00FF00", // Green glow
          transform: `scale(${scale})`,
          display: "inline-block",
        }}
      >
        الله
      </span>
    </div>
  );
};
