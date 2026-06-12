import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const GermanSoldier: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();

  // Gentle shivering/breathing animation
  const shiver = interpolate(Math.sin(frame * 0.5 + Math.PI), [-1, 1], [-2, 2]); // out of phase with British

  return (
    <div style={{ ...style }}>
      <svg width="150" height="200" viewBox="0 0 150 200">
        <g transform={`translate(${shiver}, 0)`}>
          {/* Body/Uniform */}
          <rect x="40" y="100" width="70" height="100" rx="20" fill="#5F6A72" />
          
          {/* Collar/Buttons */}
          <rect x="68" y="100" width="14" height="20" fill="#3D454A" />
          <circle cx="75" cy="130" r="3" fill="#B3A248" />
          <circle cx="75" cy="150" r="3" fill="#B3A248" />
          <circle cx="75" cy="170" r="3" fill="#B3A248" />

          {/* Head */}
          <circle cx="75" cy="70" r="30" fill="#FFD2B1" />

          {/* Eyes */}
          <circle cx="65" cy="65" r="4" fill="#000" />
          <circle cx="85" cy="65" r="4" fill="#000" />

          {/* Pickelhaube (Spiked Helmet) */}
          {/* Base */}
          <path d="M40 55 Q75 30 110 55 L115 65 Q75 55 35 65 Z" fill="#111" />
          <path d="M45 50 Q75 10 105 50 Z" fill="#111" />
          {/* Spike */}
          <path d="M70 25 L75 0 L80 25 Z" fill="#B3A248" />
          {/* Trim */}
          <path d="M45 50 Q75 60 105 50" stroke="#B3A248" strokeWidth="3" fill="none" />

          {/* Breath/Cold effect */}
          <circle cx="55" cy="80" r="5" fill="#FFF" opacity={interpolate(Math.sin(frame * 0.2 + 1), [-1, 1], [0, 0.5])} />
          <circle cx="45" cy="75" r="8" fill="#FFF" opacity={interpolate(Math.sin(frame * 0.2), [-1, 1], [0, 0.4])} />
        </g>
      </svg>
    </div>
  );
};
