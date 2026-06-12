import React from 'react';

interface PunLimProps {
  scale?: number;
  isDistressed?: boolean;
  wearUniform?: boolean;
}

export const PunLimCharacter: React.FC<PunLimProps> = ({ 
  scale = 1,
  isDistressed = false,
  wearUniform = false
}) => {
  return (
    <svg 
      width="300" 
      height="400" 
      viewBox="0 0 300 400" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', transform: `scale(${scale})` }}
    >
      {/* Body / Shirt */}
      <path 
        d="M 100 200 C 100 180, 200 180, 200 200 L 220 350 L 80 350 Z" 
        fill={wearUniform ? "#f0f0f0" : "#8ca8b3"} // White uniform or soaked blue shirt
        stroke="#222" 
        strokeWidth="4" 
      />

      {wearUniform && (
        <>
          {/* Uniform Collar */}
          <path d="M 130 180 L 150 220 L 170 180" fill="none" stroke="#222" strokeWidth="4" />
          {/* Uniform Buttons */}
          <circle cx="150" cy="240" r="3" fill="#222" />
          <circle cx="150" cy="270" r="3" fill="#222" />
          <circle cx="150" cy="300" r="3" fill="#222" />
        </>
      )}

      {/* Neck */}
      <rect x="140" y="150" width="20" height="40" fill="#f5d0b5" stroke="#222" strokeWidth="4" />

      {/* Head */}
      <ellipse cx="150" cy="110" rx="45" ry="55" fill="#f5d0b5" stroke="#222" strokeWidth="4" />

      {/* Hair (Black, straight/messy depending on state) */}
      <path 
        d={isDistressed 
          ? "M 105 100 Q 150 40 195 100 Q 180 50 150 60 Q 120 50 105 100 Z" 
          : "M 105 100 C 105 40, 195 40, 195 100 C 180 60, 120 60, 105 100 Z"} 
        fill="#222" 
      />

      {/* Eyes */}
      {isDistressed ? (
        <g stroke="#222" strokeWidth="4" strokeLinecap="round">
          {/* Shut tight / distressed eyes */}
          <path d="M 120 110 L 140 100 L 120 100" fill="none" />
          <path d="M 180 110 L 160 100 L 180 100" fill="none" />
          {/* Eyebrows angled up */}
          <path d="M 115 85 L 145 75" />
          <path d="M 185 85 L 155 75" />
        </g>
      ) : (
        <g>
          {/* Normal Eyes */}
          <circle cx="130" cy="105" r="5" fill="#222" />
          <circle cx="170" cy="105" r="5" fill="#222" />
          {/* Normal Eyebrows */}
          <path d="M 115 85 Q 130 80 145 85" fill="none" stroke="#222" strokeWidth="3" />
          <path d="M 185 85 Q 170 80 155 85" fill="none" stroke="#222" strokeWidth="3" />
        </g>
      )}

      {/* Mouth */}
      {isDistressed ? (
        // Open gasping mouth
        <ellipse cx="150" cy="140" rx="10" ry="8" fill="#550000" stroke="#222" strokeWidth="2" />
      ) : (
        // Slight smile
        <path d="M 135 135 Q 150 145 165 135" fill="none" stroke="#222" strokeWidth="3" />
      )}

      {/* Arms */}
      {isDistressed ? (
        // Arms reaching out/clinging
        <g stroke="#222" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M 100 200 Q 60 180 80 140" strokeWidth="15" stroke="#8ca8b3" />
          <path d="M 200 200 Q 240 180 220 140" strokeWidth="15" stroke="#8ca8b3" />
          {/* Hands */}
          <circle cx="80" cy="140" r="12" fill="#f5d0b5" stroke="#222" strokeWidth="3" />
          <circle cx="220" cy="140" r="12" fill="#f5d0b5" stroke="#222" strokeWidth="3" />
        </g>
      ) : (
        // Arms resting by sides
        <g stroke="#222" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M 100 200 Q 70 250 80 300" strokeWidth="15" stroke={wearUniform ? "#f0f0f0" : "#8ca8b3"} />
          <path d="M 200 200 Q 230 250 220 300" strokeWidth="15" stroke={wearUniform ? "#f0f0f0" : "#8ca8b3"} />
          {/* Hands */}
          <circle cx="80" cy="300" r="12" fill="#f5d0b5" stroke="#222" strokeWidth="3" />
          <circle cx="220" cy="300" r="12" fill="#f5d0b5" stroke="#222" strokeWidth="3" />
        </g>
      )}

      {isDistressed && (
        // Water/sweat drops on face
        <g fill="#88ccff" opacity="0.8">
          <path d="M 160 120 Q 165 130 160 135 Q 155 130 160 120 Z" />
          <path d="M 120 130 Q 125 140 120 145 Q 115 140 120 130 Z" />
        </g>
      )}
    </svg>
  );
};
