import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const BritishSoldier: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();

  // Gentle shivering/breathing animation
  const shiver = interpolate(Math.sin(frame * 0.5), [-1, 1], [-2, 2]);

  return (
    <div style={{ ...style }}>
      <svg width="150" height="200" viewBox="0 0 150 200">
        <g transform={`translate(${shiver}, 0)`}>
          {/* Body/Uniform */}
          <rect x="40" y="100" width="70" height="100" rx="20" fill="#6B5B3E" />
          
          {/* Straps */}
          <line x1="50" y1="100" x2="90" y2="200" stroke="#4A3D25" strokeWidth="5" />
          <line x1="100" y1="100" x2="60" y2="200" stroke="#4A3D25" strokeWidth="5" />

          {/* Head */}
          <circle cx="75" cy="70" r="30" fill="#FFD2B1" />

          {/* Eyes */}
          <circle cx="65" cy="65" r="4" fill="#000" />
          <circle cx="85" cy="65" r="4" fill="#000" />

          {/* Peaked Cap (1914 British) */}
          <path d="M40 50 Q75 30 110 50 L115 60 Q75 55 35 60 Z" fill="#4A3D25" />
          <path d="M50 40 Q75 10 100 40 Z" fill="#6B5B3E" />
          
          {/* Breath/Cold effect */}
          <circle cx="95" cy="80" r="5" fill="#FFF" opacity={interpolate(Math.sin(frame * 0.2), [-1, 1], [0, 0.5])} />
          <circle cx="105" cy="75" r="8" fill="#FFF" opacity={interpolate(Math.sin(frame * 0.2 - 1), [-1, 1], [0, 0.4])} />
        </g>
      </svg>
    </div>
  );
};
