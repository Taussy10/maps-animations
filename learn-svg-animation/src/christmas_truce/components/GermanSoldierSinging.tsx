import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const GermanSoldierSinging: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();

  // Singing mouth animation - mouth opens and closes using a sine wave
  const mouthHeight = interpolate(Math.sin(frame * 0.3), [-1, 1], [2, 15]);
  const mouthY = interpolate(Math.sin(frame * 0.3), [-1, 1], [75, 68]);

  return (
    <div style={{ ...style }}>
      <svg width="200" height="250" viewBox="0 0 150 200">
        <g>
          {/* Body */}
          <rect x="40" y="100" width="70" height="100" rx="20" fill="#5F6A72" />
          
          {/* Collar/Buttons */}
          <rect x="68" y="100" width="14" height="20" fill="#3D454A" />
          <circle cx="75" cy="130" r="3" fill="#B3A248" />

          {/* Head */}
          <circle cx="75" cy="65" r="30" fill="#FFD2B1" />

          {/* Eyes (Closed in emotion) */}
          <path d="M60 60 Q65 65 70 60" stroke="#000" strokeWidth="2" fill="none" />
          <path d="M80 60 Q85 65 90 60" stroke="#000" strokeWidth="2" fill="none" />

          {/* Singing Mouth */}
          <ellipse cx="75" cy={mouthY} rx="6" ry={mouthHeight / 2} fill="#5c2929" />

          {/* Pickelhaube (Spiked Helmet) */}
          <path d="M40 50 Q75 25 110 50 L115 60 Q75 50 35 60 Z" fill="#111" />
          <path d="M45 45 Q75 5 105 45 Z" fill="#111" />
          <path d="M70 20 L75 -5 L80 20 Z" fill="#B3A248" />
          <path d="M45 45 Q75 55 105 45" stroke="#B3A248" strokeWidth="3" fill="none" />
        </g>
      </svg>
    </div>
  );
};
