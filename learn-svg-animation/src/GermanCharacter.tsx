import React from 'react';

interface GermanCharacterProps {
  scale?: number;
  leftArmRotation?: number;
  rightArmRotation?: number;
}

export const GermanCharacter: React.FC<GermanCharacterProps> = ({ 
  scale = 1,
  leftArmRotation = 0,
  rightArmRotation = 0
}) => {
  // Thick dark brown stroke used throughout the design
  const strokeColor = "#3d2e1f";
  const strokeWidth = 8;

  return (
    <svg 
      width="200" 
      height="350" 
      viewBox="0 0 200 350" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', transform: `scale(${scale})` }}
    >
      <g stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        
        {/* Legs */}
        <line x1="80" y1="280" x2="70" y2="340" fill="none" />
        <line x1="120" y1="280" x2="130" y2="340" fill="none" />

        {/* Right Arm (Behind Body) */}
        <g style={{ transformOrigin: "150px 180px", transform: `rotate(${rightArmRotation}deg)` }}>
          <path d="M 140 170 Q 180 150 190 120" fill="none" />
        </g>

        {/* Body (Tunic) */}
        <path d="M 80 130 L 120 130 L 150 280 L 50 280 Z" fill="#ffffff" />

        {/* Left Arm (In Front of Body) */}
        <g style={{ transformOrigin: "50px 180px", transform: `rotate(${leftArmRotation}deg)` }}>
          <path d="M 60 190 Q 100 190 120 170" fill="none" />
        </g>

        {/* Head Base & Flag Clip */}
        <g>
          <clipPath id="headClip">
            <circle cx="100" cy="80" r="60" />
          </clipPath>
          
          <g clipPath="url(#headClip)">
            {/* German Empire Flag: Black, White, Red stripes */}
            <rect x="20" y="20" width="160" height="40" fill="#000000" stroke="none" />
            <rect x="20" y="60" width="160" height="40" fill="#ffffff" stroke="none" />
            <rect x="20" y="100" width="160" height="40" fill="#cc0000" stroke="none" />
          </g>
          
          {/* Head Outline */}
          <circle cx="100" cy="80" r="60" fill="none" />
        </g>

        {/* Eyes (Angry Semicircles) */}
        <g fill="#ffffff">
          {/* Left Eye */}
          <path d="M 65 60 Q 80 65 90 60 Q 80 85 65 80 Z" strokeWidth={5} />
          {/* Right Eye */}
          <path d="M 135 60 Q 120 65 110 60 Q 120 85 135 80 Z" strokeWidth={5} />
        </g>

        {/* Frown */}
        <path d="M 95 95 Q 100 90 105 95" fill="none" strokeWidth={4} />

      </g>
    </svg>
  );
};
