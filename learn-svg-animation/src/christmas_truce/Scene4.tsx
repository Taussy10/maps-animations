import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, staticFile, interpolate, spring } from "remotion";
import { BritishSoldierShaking } from "./components/BritishSoldierShaking";
import { GermanSoldierShaking } from "./components/GermanSoldierShaking";

const mulberry32 = (a: number) => {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow forward dolly (scale up slightly over time)
  const dollyScale = interpolate(frame, [0, 150], [1, 1.15], { extrapolateRight: "clamp" });
  
  // Slight handheld camera shake
  const shakeX = Math.sin(frame * 0.15) * 4 + Math.cos(frame * 0.07) * 2;
  const shakeY = Math.cos(frame * 0.12) * 4 + Math.sin(frame * 0.05) * 2;

  // Slide-up animation for text
  const textY = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12 },
    from: 50,
    to: 0,
  });
  
  const textOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" });

  // Pre-generate snowflakes
  const snowflakes = useMemo(() => {
    const rng = mulberry32(4321);
    const flakes = [];
    for (let i = 0; i < 100; i++) {
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
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#b0c4de" }}>
      {/* Background with Camera Movement */}
      <div 
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          transform: `scale(${dollyScale}) translate(${shakeX}px, ${shakeY}px)`,
          transformOrigin: "center center"
        }}
      >
        <Img 
          src={staticFile("land.svg")} 
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} 
        />

        {/* Animated Soldiers overlaying the clean background */}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
          {/* Offset to meet in the middle */}
          <BritishSoldierShaking style={{ position: "relative", right: "-10px", top: "150px" }} />
          <GermanSoldierShaking style={{ position: "relative", left: "-10px", top: "150px" }} />
        </AbsoluteFill>
        
        {/* Animated Snow Overlay linked to camera shake to give depth */}
        <svg width="100%" height="100%" style={{ position: "absolute", pointerEvents: "none" }}>
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
      </div>

      {/* Narrative Text - Fixed on screen, unaffected by camera shake */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "80px" }}>
        <div 
          style={{ 
            backgroundColor: "rgba(0,0,0,0.6)", 
            padding: "20px 40px", 
            borderRadius: "12px",
            color: "white",
            fontSize: "32px",
            fontFamily: "sans-serif",
            textAlign: "center",
            maxWidth: "900px",
            transform: `translateY(${textY}px)`,
            opacity: textOpacity,
          }}
        >
          Soon, soldiers from both sides climbed out of their trenches...
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
