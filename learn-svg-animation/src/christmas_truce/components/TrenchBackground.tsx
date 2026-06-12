import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill, Img, staticFile } from "remotion";

// Deterministic random numbers
const mulberry32 = (a: number) => {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const TrenchBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  
  // Pre-generate snowflakes deterministically
  const snowflakes = useMemo(() => {
    const rng = mulberry32(1914);
    const flakes = [];
    for (let i = 0; i < 150; i++) {
      flakes.push({
        id: i,
        x: rng() * 1280,
        yStart: rng() * 720,
        speed: rng() * 1.5 + 0.5,
        size: rng() * 3 + 1,
        drift: rng() * 2 - 1,
      });
    }
    return flakes;
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#080d1e" }}>
      <Img 
        src={staticFile("trench_scene.svg")} 
        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} 
      />
      
      {/* Animated SVG Snow Overlay */}
      <svg width="100%" height="100%" viewBox={`0 0 1280 720`} style={{ position: "absolute" }}>
        {snowflakes.map((flake) => {
          const yPos = (flake.yStart + frame * flake.speed * 2) % 750;
          const xPos = flake.x + Math.sin(frame * 0.05 + flake.id) * 10 * flake.drift;
          return (
            <circle 
              key={flake.id} 
              cx={xPos} 
              cy={yPos} 
              r={flake.size} 
              fill="white" 
              opacity={0.6} 
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
