import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const BritishSoldierShaking: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();

  // Walk in animation from left
  const xPos = interpolate(frame, [0, 60], [-300, 0], { extrapolateRight: "clamp" });
  
  // Handshake reach (arm rotates up)
  const armRotation = interpolate(frame, [60, 90], [0, -60], { extrapolateRight: "clamp" });

  // Handshake pump (up and down)
  const shake = frame > 90 ? Math.sin((frame - 90) * 0.5) * 15 : 0;

  // Eye blinking logic (blinks every 60 frames roughly)
  const isBlinking = frame % 60 > 56;

  // Cold breath animation (loops every 45 frames)
  const breathCycle = frame % 45;
  const breathOpacity = interpolate(breathCycle, [0, 15, 30, 45], [0, 0.6, 0.6, 0]);
  const breathX = interpolate(breathCycle, [0, 45], [0, 30]);
  const breathY = interpolate(breathCycle, [0, 45], [0, -20]);
  const breathScale = interpolate(breathCycle, [0, 45], [0.5, 2]);

  return (
    <div style={{ ...style, transform: `translateX(${xPos}px)` }}>
      <svg width="250" height="300" viewBox="0 0 150 200" style={{ overflow: "visible" }}>
        {/* Visible Cold Breath coming from mouth area */}
        <circle 
          cx={100 + breathX} 
          cy={75 + breathY} 
          r={5 * breathScale} 
          fill="rgba(255, 255, 255, 0.7)" 
          opacity={breathOpacity} 
          style={{ filter: "blur(2px)" }}
        />

        <g>
          {/* Back arm */}
          <line x1="75" y1="110" x2="60" y2="160" stroke="#4A3D25" strokeWidth="15" strokeLinecap="round" />
          
          {/* Body */}
          <rect x="40" y="100" width="70" height="100" rx="20" fill="#6B5B3E" />
          
          {/* Front Arm (Shaking) */}
          <g transform={`translate(75, 110) rotate(${armRotation + shake})`}>
            {/* Draw arm extending right */}
            <line x1="0" y1="0" x2="35" y2="35" stroke="#6B5B3E" strokeWidth="15" strokeLinecap="round" />
            <circle cx="40" cy="40" r="8" fill="#FFD2B1" /> {/* Hand */}
          </g>

          {/* Head */}
          <circle cx="75" cy="70" r="30" fill="#FFD2B1" />
          
          {/* Eye with Blink */}
          {isBlinking ? (
            <line x1="87" y1="65" x2="93" y2="65" stroke="#000" strokeWidth="2" />
          ) : (
            <circle cx="90" cy="65" r="4" fill="#000" />
          )}

          {/* Peaked Cap */}
          <path d="M40 50 Q75 30 110 50 L115 60 Q75 55 35 60 Z" fill="#4A3D25" />
          <path d="M50 40 Q75 10 100 40 Z" fill="#6B5B3E" />
        </g>
      </svg>
    </div>
  );
};
