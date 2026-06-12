import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, Img, staticFile, interpolate } from "remotion";

const mulberry32 = (a: number) => {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle pulsing glow for the lantern
  const glowOpacity = interpolate(Math.sin(frame * 0.2), [-1, 1], [0.3, 0.7]);

  // Pre-generate snowflakes
  const snowflakes = useMemo(() => {
    const rng = mulberry32(1234);
    const flakes = [];
    for (let i = 0; i < 80; i++) {
      flakes.push({
        id: i,
        x: rng() * 1280,
        yStart: rng() * 720,
        speed: rng() * 1.5 + 0.5,
        size: rng() * 4 + 2,
        drift: rng() * 2 - 1,
      });
    }
    return flakes;
  }, []);

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#080d1e" }}>
      <Img 
        src={staticFile("scene3.svg")} 
        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} 
      />

      {/* Animated SVG Overlay: Lantern Glow & Snow */}
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        {/* Soft lantern glow in the center-ish where the candle is */}
        <circle 
          cx="640" 
          cy="400" 
          r="300" 
          fill="url(#glowGrad)" 
          opacity={glowOpacity} 
          style={{ mixBlendMode: "screen" }}
        />
        <defs>
          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffaa00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffaa00" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Snowflakes */}
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
