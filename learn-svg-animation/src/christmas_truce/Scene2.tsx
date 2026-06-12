import React from "react";
import { AbsoluteFill, useCurrentFrame, Img, staticFile, interpolate } from "remotion";
import { GermanSoldierSinging } from "./components/GermanSoldierSinging";

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  // Floating musical notes effect
  const notes = [1, 2, 3].map((i) => {
    const yPos = interpolate(frame - (i * 20), [0, 60], [500, 200], { extrapolateRight: "clamp" });
    const xPos = 640 + Math.sin(frame * 0.1 + i) * 30;
    const opacity = interpolate(frame - (i * 20), [0, 20, 50, 60], [0, 1, 1, 0], { extrapolateRight: "clamp" });

    return { id: i, x: xPos, y: yPos, opacity };
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#080d1e" }}>
      {/* The empty background you generated */}
      <Img 
        src={staticFile("scene2.svg")} 
        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} 
      />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {/* Animated Singing Character */}
        <GermanSoldierSinging style={{ position: "relative", top: "100px", transform: "scale(1.5)" }} />
      </AbsoluteFill>

      {/* Musical notes floating up */}
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        {notes.map((note) => (
          <text 
            key={note.id} 
            x={note.x} 
            y={note.y} 
            fill="#FFD700" 
            fontSize="80" 
            opacity={note.opacity}
            style={{ filter: "drop-shadow(0px 0px 10px rgba(255, 215, 0, 0.8))" }}
          >
            ♪
          </text>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
