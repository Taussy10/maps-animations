import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const GermanSoldierShaking: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();

  // Walk in animation from right
  const xPos = interpolate(frame, [0, 60], [300, 0], { extrapolateRight: "clamp" });
  
  // Handshake reach (arm rotates up)
  const armRotation = interpolate(frame, [60, 90], [0, 60], { extrapolateRight: "clamp" });

  // Handshake pump (up and down) - match the phase of the British soldier
  const shake = frame > 90 ? Math.sin((frame - 90) * 0.5) * -15 : 0;

  // Eye blinking logic (blinks slightly off-sync from British soldier)
  const isBlinking = (frame + 15) % 65 > 61;

  // Cold breath animation (loops every 50 frames to be out of sync)
  const breathCycle = frame % 50;
  const breathOpacity = interpolate(breathCycle, [0, 15, 30, 50], [0, 0.6, 0.6, 0]);
  const breathX = interpolate(breathCycle, [0, 50], [0, -30]); // Blows left
  const breathY = interpolate(breathCycle, [0, 50], [0, -20]);
  const breathScale = interpolate(breathCycle, [0, 50], [0.5, 2]);

  return (
    <div style={{ ...style, transform: `translateX(${xPos}px)` }}>
      <svg width="250" height="300" viewBox="0 0 150 200" style={{ overflow: "visible" }}>
        {/* Visible Cold Breath coming from mouth area */}
        <circle 
          cx={50 + breathX} 
          cy={75 + breathY} 
          r={5 * breathScale} 
          fill="rgba(255, 255, 255, 0.7)" 
          opacity={breathOpacity} 
          style={{ filter: "blur(2px)" }}
        />

        <g>
          {/* Back arm */}
          <line x1="75" y1="110" x2="90" y2="160" stroke="#3D454A" strokeWidth="15" strokeLinecap="round" />

          {/* Body */}
          <rect x="40" y="100" width="70" height="100" rx="20" fill="#5F6A72" />
          
          {/* Front Arm (Shaking) */}
          <g transform={`translate(75, 110) rotate(${armRotation + shake})`}>
            {/* Draw arm extending left */}
            <line x1="0" y1="0" x2="-35" y2="35" stroke="#5F6A72" strokeWidth="15" strokeLinecap="round" />
            <circle cx="-40" cy="40" r="8" fill="#FFD2B1" /> {/* Hand */}
          </g>

          {/* Head */}
          <circle cx="75" cy="70" r="30" fill="#FFD2B1" />
          
          {/* Eye with Blink */}
          {isBlinking ? (
            <line x1="57" y1="65" x2="63" y2="65" stroke="#000" strokeWidth="2" />
          ) : (
            <circle cx="60" cy="65" r="4" fill="#000" />
          )}

          {/* Pickelhaube */}
          <path d="M40 55 Q75 30 110 55 L115 65 Q75 55 35 65 Z" fill="#111" />
          <path d="M45 50 Q75 10 105 50 Z" fill="#111" />
          <path d="M70 25 L75 0 L80 25 Z" fill="#B3A248" />
        </g>
      </svg>
    </div>
  );
};
