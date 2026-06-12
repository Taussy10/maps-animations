import React from "react";

interface CharacterProps {
  scaleX?: number;
  scaleY?: number;
  headY?: number;
  mouthY?: number;
  mouthHeight?: number;
  mouthRx?: number;
  leftArmRotation?: number;
  rightArmRotation?: number;
  headColor?: string;
  hairColor?: string;
}

export const Character: React.FC<CharacterProps> = ({
  scaleX = 1,
  scaleY = 1,
  headY = 0,
  mouthY = 118,
  mouthHeight = 12,
  mouthRx = 6,
  leftArmRotation = 0,
  rightArmRotation = 0,
  headColor = "#f3f3f3",
  hairColor = "#888",
}) => {
  return (
    <svg
      width="300"
      height="400"
      viewBox="0 0 300 400"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        overflow: "visible",
      }}
    >
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dx="0" dy="4" result="offsetblur" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Root character group applying scale from feet level */}
      <g
        style={{
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "150px 395px",
        }}
      >
        {/* Head & Hair Group (Bobs up/down) */}
        <g
          style={{
            transform: `translateY(${headY}px)`,
            transformOrigin: "150px 160px",
          }}
        >
          {/* Hair */}
          <path
            id="hair1"
            d="M145 35 Q140 15 125 5"
            stroke={hairColor}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            id="hair2"
            d="M150 35 Q155 10 150 0"
            stroke={hairColor}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            id="hair3"
            d="M155 35 Q170 15 180 5"
            stroke={hairColor}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Head */}
          <circle
            id="head"
            cx="150"
            cy="90"
            r="70"
            fill={headColor}
            stroke="black"
            strokeWidth="3"
            filter="url(#shadow)"
          />

          {/* Left Eye */}
          <circle id="left-eye" cx="125" cy="80" r="5" fill="black" />

          {/* Right Eye */}
          <circle id="right-eye" cx="175" cy="80" r="5" fill="black" />

          {/* Mouth */}
          <rect
            id="mouth"
            x="135"
            y={mouthY}
            width="50"
            height={mouthHeight}
            rx={mouthRx}
            fill="black"
            transform="rotate(-2 160 122)"
          />
        </g>

        {/* Neck */}
        <line
          id="neck"
          x1="150"
          y1="160"
          x2="150"
          y2="190"
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Body */}
        <line
          id="body"
          x1="150"
          y1="190"
          x2="150"
          y2="300"
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Left Arms Group (pivot at shoulder joint near x=150, y=210) */}
        <g
          style={{
            transformOrigin: "150px 210px",
            transform: `rotate(${leftArmRotation}deg)`,
          }}
        >
          {/* Left Upper Arm */}
          <path
            id="left-arm-top"
            d="M150 210 Q120 220 90 200"
            stroke="black"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Left Lower Arm */}
          <path
            id="left-arm-bottom"
            d="M150 235 Q120 245 80 235"
            stroke="black"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          {/* Left Hand */}
          <circle cx="85" cy="217" r="12" fill={headColor} stroke="black" strokeWidth="3" />
        </g>

        {/* Right Arms Group (pivot at shoulder joint near x=150, y=210) */}
        <g
          style={{
            transformOrigin: "150px 210px",
            transform: `rotate(${rightArmRotation}deg)`,
          }}
        >
          {/* Right Upper Arm */}
          <path
            id="right-arm-top"
            d="M150 210 Q180 220 210 200"
            stroke="black"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Right Lower Arm */}
          <path
            id="right-arm-bottom"
            d="M150 235 Q180 245 220 235"
            stroke="black"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          {/* Right Hand */}
          <circle cx="215" cy="217" r="12" fill={headColor} stroke="black" strokeWidth="3" />
        </g>

        {/* Left Leg */}
        <line
          id="left-leg"
          x1="150"
          y1="300"
          x2="95"
          y2="390"
          stroke="black"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Right Leg */}
        <line
          id="right-leg"
          x1="150"
          y1="300"
          x2="190"
          y2="395"
          stroke="black"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
